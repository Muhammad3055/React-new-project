"""Private, resumable disk uploads shared by the API and Django admin."""
import errno
import fcntl
import hashlib
import json
import math
import os
import re
import shutil
import time
from contextlib import ExitStack, contextmanager
from functools import wraps
from pathlib import Path

from django.conf import settings
from django.core.files.uploadedfile import UploadedFile
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.cache import never_cache


class UploadError(ValueError):
    pass


def root():
    path = Path(settings.CHUNK_UPLOAD_ROOT)
    path.mkdir(parents=True, exist_ok=True, mode=0o700)
    return path


def upload_path(upload_id):
    if not re.fullmatch(r'[a-f0-9]{32}', upload_id or ''):
        raise UploadError('Invalid upload reference. Please select the file again.')
    return root() / upload_id


@contextmanager
def locked_upload(upload_id, create=False):
    path = upload_path(upload_id)
    if create:
        path.mkdir(exist_ok=True, mode=0o700)
    if not path.is_dir():
        raise UploadError('Upload expired or is missing. Please select the file again.')
    with (path / 'lock').open('a+b') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        try:
            yield path
        finally:
            fcntl.flock(lock, fcntl.LOCK_UN)


def read_manifest(path, user):
    try:
        meta = json.loads((path / 'manifest.json').read_text())
    except FileNotFoundError:
        raise UploadError('Upload is not initialized. Please select the file again.')
    if meta['owner'] != user.pk:
        raise UploadError('This upload belongs to another administrator.')
    if time.time() - meta['updated'] > settings.CHUNK_UPLOAD_TTL:
        raise UploadError('Upload expired. Please select the file again.')
    if meta.get('consumed'):
        raise UploadError('This file has already been saved. Refresh the content list.')
    return meta


def write_manifest(path, meta):
    meta['updated'] = time.time()
    temp = path / 'manifest.tmp'
    with temp.open('w') as handle:
        json.dump(meta, handle)
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temp, path / 'manifest.json')


def staff_error(request):
    if not request.user.is_authenticated or not request.user.is_active or not request.user.is_staff:
        return JsonResponse({'error': 'Please sign in with a staff account before uploading.'}, status=403)


@never_cache
@csrf_protect
def upload_chunk(request):
    denied = staff_error(request)
    if denied is not None:
        return denied
    try:
        if request.method == 'GET':
            data = {
                'chunk_size': settings.CHUNK_UPLOAD_SIZE,
                'max_file_size': settings.MAX_MEDIA_UPLOAD_SIZE,
                'csrf_token': get_token(request),
            }
            if request.GET.get('upload_id'):
                with locked_upload(request.GET['upload_id']) as path:
                    meta = read_manifest(path, request.user)
                    data.update(next_index=meta['next_index'], file_size=meta['file_size'],
                                filename=meta['filename'], fingerprint=meta['fingerprint'])
            return JsonResponse(data)
        if request.method != 'POST':
            return JsonResponse({'error': 'GET or POST required.'}, status=405)

        body = request.POST
        upload_id = body.get('upload_id', '')
        index = int(body.get('chunk_index', '-1'))
        total = int(body.get('total_chunks', '0'))
        size = int(body.get('file_size', '0'))
        chunk_size = settings.CHUNK_UPLOAD_SIZE
        filename = Path(body.get('filename', '').replace('\\', '/')).name
        chunk = request.FILES.get('chunk')
        fingerprint = body.get('fingerprint', '')
        if not filename or len(filename) > 180 or filename in ('.', '..'):
            raise UploadError('Please use a filename of at most 180 characters.')
        if size <= 0 or size > settings.MAX_MEDIA_UPLOAD_SIZE:
            raise UploadError('File is empty or exceeds the configured upload limit.')
        if total != math.ceil(size / chunk_size) or not 0 <= index < total:
            raise UploadError('Invalid chunk count or index.')
        expected = min(chunk_size, size - index * chunk_size)
        if chunk is None or chunk.size != expected:
            raise UploadError('Incomplete chunk. Retry the upload.')
        digest = hashlib.sha256()
        for block in chunk.chunks():
            digest.update(block)
        checksum = digest.hexdigest()
        if checksum != body.get('sha256'):
            raise UploadError('Chunk checksum mismatch. Retry the upload.')
        chunk.seek(0)

        with locked_upload(upload_id, create=True) as path:
            if (path / 'manifest.json').exists():
                meta = read_manifest(path, request.user)
                if (meta['file_size'], meta['filename'], meta['fingerprint']) != (size, filename, fingerprint):
                    raise UploadError('File metadata changed. Start a new upload.')
            else:
                if index != 0:
                    raise UploadError('Upload must start with the first chunk.')
                meta = dict(owner=request.user.pk, file_size=size, filename=filename,
                            fingerprint=fingerprint, next_index=0, hashes=[])
            if index > meta['next_index']:
                raise UploadError('A preceding chunk is missing. Resume the upload.')
            if index < meta['next_index']:
                if meta['hashes'][index] != checksum:
                    raise UploadError('A retry contained different file data.')
            else:
                if shutil.disk_usage(root()).free < expected + settings.CHUNK_UPLOAD_DISK_RESERVE:
                    return JsonResponse({'error': 'Server storage is low. Free disk space before retrying.'}, status=507)
                data_path = path / 'data'
                with data_path.open('r+b' if data_path.exists() else 'w+b') as target:
                    # Discard any bytes appended before an interrupted metadata commit.
                    target.truncate(index * chunk_size)
                    target.seek(index * chunk_size)
                    for block in chunk.chunks():
                        target.write(block)
                    target.flush()
                    os.fsync(target.fileno())
                meta['hashes'].append(checksum)
                meta['next_index'] += 1
            write_manifest(path, meta)
            complete = meta['next_index'] == total
            return JsonResponse({'status': 'complete' if complete else 'chunk_saved',
                                 'next_index': meta['next_index'],
                                 'assembled_filename': upload_id if complete else None})
    except (UploadError, ValueError, TypeError) as exc:
        return JsonResponse({'error': str(exc)}, status=400)
    except OSError as exc:
        if exc.errno == errno.ENOSPC:
            return JsonResponse({'error': 'Server disk is full. Free space before retrying.'}, status=507)
        raise


class StagedUpload(UploadedFile):
    """Lets FileSystemStorage move a completed file rather than copy gigabytes."""
    def temporary_file_path(self):
        return self.file.name


def chunked_files(aliases=None):
    """Resolve <file_field>_upload references before Django parses a form.

    Keep staged files on validation failure, so an admin can correct metadata
    without uploading the file again. Requests hold the upload lock until saved.
    """
    aliases = aliases or {}

    def decorate(view):
        @wraps(view)
        def wrapped(request, *args, **kwargs):
            if request.method in ('POST', 'PUT'):
                denied = staff_error(request)
                if denied is not None:
                    return denied
            if request.method != 'POST' or not request.content_type.startswith('multipart/'):
                return view(request, *args, **kwargs)
            refs = {key[:-7]: value for key, value in request.POST.items()
                    if key.endswith('_upload') and value}
            for key, field in aliases.items():
                if request.POST.get(key):
                    refs[field] = request.POST[key]
            if not refs:
                return view(request, *args, **kwargs)
            denied = staff_error(request)
            if denied is not None:
                return denied
            allowed = {'audio_file', 'pdf_file', 'file', 'video_file', 'image_file',
                       'cover_image', 'cover_file', 'thumbnail'}
            if set(refs) - allowed:
                return JsonResponse({'error': 'Unsupported file field.'}, status=400)
            if len(set(refs.values())) != len(refs):
                return JsonResponse({'error': 'Each file field needs its own upload.'}, status=400)
            try:
                with ExitStack() as stack:
                    resolved = {}
                    # Fixed order prevents deadlock when a form has several files.
                    for token in sorted(set(refs.values())):
                        path = stack.enter_context(locked_upload(token))
                        meta = read_manifest(path, request.user)
                        data = path / 'data'
                        if meta['next_index'] != math.ceil(meta['file_size'] / settings.CHUNK_UPLOAD_SIZE) or not data.exists() or data.stat().st_size != meta['file_size']:
                            raise UploadError('File upload is incomplete. Resume it before saving.')
                        resolved[token] = (path, meta)
                    files = request.FILES.copy()
                    for field, token in refs.items():
                        path, meta = resolved[token]
                        handle = stack.enter_context((path / 'data').open('rb'))
                        files[field] = StagedUpload(handle, name=meta['filename'], size=meta['file_size'])
                    request._files = files
                    request._chunked_tokens = [(field + '_upload', token) for field, token in refs.items()]
                    response = view(request, *args, **kwargs)
                    success = response.status_code == 302
                    if isinstance(response, JsonResponse) and response.status_code < 300:
                        success = json.loads(response.content).get('status') == 'success'
                    if success:
                        for path, meta in resolved.values():
                            meta['consumed'] = True
                            write_manifest(path, meta)
                            (path / 'data').unlink(missing_ok=True)
                    # TemplateResponse renders after this function: handles may
                    # close now, but the retained token is rendered into the form.
                    return response
            except UploadError as exc:
                return JsonResponse({'error': str(exc)}, status=400)
        return wrapped
    return decorate
