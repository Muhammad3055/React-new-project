import hashlib
import io
import json
import tempfile
import uuid
from pathlib import Path
from unittest.mock import patch
from PIL import Image

from django.contrib import admin
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client, TestCase, override_settings
from django.urls import path

from . import views
from .models import BookMedia, ImageMedia, QuranAudio, TaqreerAudio, VideoMedia

urlpatterns = [
    path('api/upload/chunk/', views.api_upload_chunk),
    path('api/taqreer/', views.api_taqreer_list),
    path('api/quran/', views.api_quran_list),
    path('api/books/', views.api_books_list),
    path('api/videos/', views.api_videos_list),
    path('api/images/', views.api_images_list),
    path('api/admin/content/edit/', views.api_admin_edit_content),
    path('admin/', admin.site.urls),
]


class UploadTests(TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.override = override_settings(CHUNK_UPLOAD_ROOT=self.root / 'private', MEDIA_ROOT=self.root / 'media')
        self.override.enable()
        self.addCleanup(self.override.disable)
        self.user = User.objects.create_superuser('uploader', 'uploader@example.com', 'test-password')
        self.client.force_login(self.user)

    def part(self, token, index=0, payload=b'abcdefgh', size=11, filename='lecture.mp3', **extra):
        body = dict(upload_id=token, chunk_index=index, total_chunks=(size + 7) // 8,
                    file_size=size, filename=filename, fingerprint='test-file',
                    sha256=hashlib.sha256(payload).hexdigest(),
                    chunk=SimpleUploadedFile('part.bin', payload))
        body.update(extra)
        return self.client.post('/api/upload/chunk/', body)

    def complete(self, filename='lecture.mp3'):
        token = uuid.uuid4().hex
        self.assertEqual(self.part(token, filename=filename).status_code, 200)
        response = self.part(token, 1, b'ijk', filename=filename)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['assembled_filename'], token)
        return token

    def test_first_chunk_and_resume(self):
        token = uuid.uuid4().hex
        self.assertEqual(self.part(token).json()['next_index'], 1)
        response = self.client.get('/api/upload/chunk/', {'upload_id': token})
        self.assertEqual(response.json()['next_index'], 1)
        self.assertEqual((self.root / 'private' / token / 'data').read_bytes(), b'abcdefgh')

    def test_duplicate_retry_does_not_duplicate_bytes(self):
        token = uuid.uuid4().hex
        self.part(token)
        self.assertEqual(self.part(token).status_code, 200)
        self.part(token, 1, b'ijk')
        self.assertEqual((self.root / 'private' / token / 'data').read_bytes(), b'abcdefghijk')

    def test_retry_final_chunk(self):
        token = self.complete()
        self.assertEqual(self.part(token, 1, b'ijk').json()['assembled_filename'], token)

    def test_crash_before_manifest_commit(self):
        token = uuid.uuid4().hex
        self.part(token)
        with (self.root / 'private' / token / 'data').open('ab') as handle:
            handle.write(b'incomplete-write')
        self.assertEqual(self.part(token, 1, b'ijk').status_code, 200)
        self.assertEqual((self.root / 'private' / token / 'data').stat().st_size, 11)

    def test_checksum_and_size_rejected(self):
        token = uuid.uuid4().hex
        self.assertEqual(self.part(token, sha256='wrong').status_code, 400)
        self.assertEqual(self.part(token, payload=b'short').status_code, 400)

    def test_missing_and_out_of_order_chunks_rejected(self):
        self.assertEqual(self.part(uuid.uuid4().hex, 1, b'ijk').status_code, 400)

    def test_invalid_ids_and_numbers_rejected(self):
        self.assertEqual(self.part('../escape').status_code, 400)
        self.assertEqual(self.part(uuid.uuid4().hex, chunk_index='bad').status_code, 400)

    def test_different_retry_rejected(self):
        token = uuid.uuid4().hex
        self.part(token)
        self.assertEqual(self.part(token, payload=b'12345678').status_code, 400)

    def test_staff_required(self):
        self.client.logout()
        self.assertEqual(self.part(uuid.uuid4().hex).status_code, 403)
        self.assertEqual(self.client.get('/api/upload/chunk/').status_code, 403)

    def test_csrf_required_and_valid_token_accepted(self):
        client = Client(enforce_csrf_checks=True)
        client.force_login(self.user)
        config = client.get('/api/upload/chunk/').json()
        self.assertEqual(client.post('/api/upload/chunk/', {}).status_code, 403)
        response = client.post('/api/upload/chunk/', {}, HTTP_X_CSRFTOKEN=config['csrf_token'])
        self.assertEqual(response.status_code, 400)  # CSRF passed; missing chunk rejected.

    def test_another_staff_cannot_claim_upload(self):
        token = self.complete()
        other = User.objects.create_user('other', is_staff=True)
        self.client.force_login(other)
        self.assertEqual(self.client.get('/api/upload/chunk/', {'upload_id': token}).status_code, 400)

    def test_incomplete_upload_cannot_publish(self):
        token = uuid.uuid4().hex
        self.part(token)
        response = self.client.post('/api/taqreer/', {'title': 'Incomplete', 'audio_file_upload': token})
        self.assertEqual(response.status_code, 400)
        self.assertFalse(TaqreerAudio.objects.exists())

    def test_missing_upload_cannot_publish(self):
        response = self.client.post('/api/taqreer/', {'title': 'Missing', 'audio_file_upload': uuid.uuid4().hex})
        self.assertEqual(response.status_code, 400)
        self.assertFalse(TaqreerAudio.objects.exists())

    def test_save_audio_quran_book_and_video(self):
        for endpoint, field, model, filename in [
            ('taqreer', 'audio_file', TaqreerAudio, 'lecture.mp3'),
            ('quran', 'audio_file', QuranAudio, 'quran.mp3'),
            ('books', 'pdf_file', BookMedia, 'book.pdf'),
            ('videos', 'video_file', VideoMedia, 'video.mp4'),
        ]:
            with self.subTest(endpoint=endpoint):
                token = self.complete(filename)
                response = self.client.post(f'/api/{endpoint}/', {'title': 'Test', f'{field}_upload': token})
                self.assertEqual(response.status_code, 200, response.content)
                record = model.objects.latest('pk')
                saved = getattr(record, field)
                self.assertEqual(Path(saved.path).read_bytes(), b'abcdefghijk')
                self.assertEqual(Path(saved.name).name, filename)
                self.assertFalse((self.root / 'private' / token / 'data').exists())
                self.assertEqual(self.client.post(f'/api/{endpoint}/', {'title': 'Again', f'{field}_upload': token}).status_code, 400)

    def test_edit_replaces_existing_audio(self):
        record = TaqreerAudio.objects.create(title='Before')
        token = self.complete()
        response = self.client.post('/api/admin/content/edit/', {
            'id': record.pk, 'title': 'After', 'content_type': 'audio', 'file_upload': token,
        })
        self.assertEqual(response.status_code, 200, response.content)
        self.assertEqual(response.json()['id'], record.pk)
        record.refresh_from_db()
        self.assertEqual(record.title, 'After')
        self.assertEqual(Path(record.audio_file.path).read_bytes(), b'abcdefghijk')
        self.assertEqual(TaqreerAudio.objects.count(), 1)
        metadata = self.client.post('/api/admin/content/edit/', {
            'id': record.pk, 'title': 'Metadata only', 'content_type': 'audio',
        })
        self.assertEqual(metadata.status_code, 200, metadata.content)
        record.refresh_from_db()
        self.assertEqual(record.title, 'Metadata only')
        self.assertEqual(Path(record.audio_file.path).read_bytes(), b'abcdefghijk')
        self.assertEqual(TaqreerAudio.objects.count(), 1)
        changed = self.client.post('/api/admin/content/edit/', {
            'id': record.pk, 'content_type': 'audio',
            'audio_url': 'https://example.com/lecture.mp3', 'replace_with_url': '1',
        })
        self.assertEqual(changed.status_code, 200, changed.content)
        record.refresh_from_db()
        self.assertFalse(record.audio_file)
        self.assertEqual(record.audio_url, 'https://example.com/lecture.mp3')
        self.assertEqual(TaqreerAudio.objects.count(), 1)

    def test_edit_updates_existing_media_without_creating_duplicates(self):
        cases = [
            (BookMedia, {'title': 'Before'}, 'book', 'pdf_file', 'book.pdf'),
            (QuranAudio, {'surah_number': 1, 'surah_name_english': 'Before', 'surah_name_arabic': 'الفاتحة'}, 'quran', 'audio_file', 'quran.mp3'),
            (VideoMedia, {'title': 'Before'}, 'video', 'video_file', 'video.mp4'),
            (ImageMedia, {'title': 'Before'}, 'image', 'image_file', 'image.png'),
        ]
        for model, fields, content_type, file_field, filename in cases:
            with self.subTest(content_type=content_type):
                record = model.objects.create(**fields)
                token = self.complete(filename)
                response = self.client.post('/api/admin/content/edit/', {
                    'id': record.pk, 'content_type': content_type,
                    'title': 'After', f'{file_field}_upload': token,
                })
                self.assertEqual(response.status_code, 200, response.content)
                self.assertEqual(response.json()['id'], record.pk)
                self.assertEqual(model.objects.count(), 1)
                record.refresh_from_db()
                self.assertEqual(Path(getattr(record, file_field).path).read_bytes(), b'abcdefghijk')
                url_field = {'book': 'pdf_url', 'quran': 'audio_url',
                             'video': 'video_url', 'image': 'image_url'}[content_type]
                url = f'https://example.com/{filename}'
                changed = self.client.post('/api/admin/content/edit/', {
                    'id': record.pk, 'content_type': content_type,
                    url_field: url, 'replace_with_url': '1',
                })
                self.assertEqual(changed.status_code, 200, changed.content)
                record.refresh_from_db()
                self.assertFalse(getattr(record, file_field))
                self.assertEqual(getattr(record, url_field), url)
                self.assertEqual(model.objects.count(), 1)

    def test_django_admin_add_and_validation_retry(self):
        token = self.complete()
        url = '/admin/core/taqreeraudio/add/'
        response = self.client.post(url, {'audio_file_upload': token, '_save': 'Save'})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, f'value="{token}"')
        self.assertTrue((self.root / 'private' / token / 'data').exists())
        response = self.client.post(url, {'title': 'Admin lecture', 'speaker': 'Scholar',
            'language': 'urdu', 'duration': '04:00:00', 'audio_file_upload': token, '_save': 'Save'})
        self.assertEqual(response.status_code, 302, response.content[:1000])
        record = TaqreerAudio.objects.get(title='Admin lecture')
        self.assertEqual(Path(record.audio_file.path).read_bytes(), b'abcdefghijk')

    def test_disk_full_is_reported(self):
        with patch('core.uploads.shutil.disk_usage') as usage:
            usage.return_value.free = 0
            self.assertEqual(self.part(uuid.uuid4().hex).status_code, 507)

    def test_django_admin_video_document_and_quran(self):
        cases = [
            ('videomedia', 'video_file', 'video.mp4', {'title': 'Video', 'speaker': 'Scholar'}),
            ('bookmedia', 'pdf_file', 'book.pdf', {'title': 'Book', 'author': 'Scholar', 'file_type': 'pdf', 'language': 'ur', 'pages_count': '1'}),
            ('quranaudio', 'audio_file', 'quran.mp3', {'surah_number': '1', 'surah_name_english': 'Al Fatiha',
                'surah_name_arabic': 'الفاتحة', 'reciter': 'Scholar', 'language': 'arabic',
                'duration': '04:00:00', 'revelation_place': 'Makki', 'total_ayahs': '7'}),
        ]
        for model, field, filename, data in cases:
            with self.subTest(model=model):
                token = self.complete(filename)
                response = self.client.post(f'/admin/core/{model}/add/', {**data, f'{field}_upload': token, '_save': 'Save'})
                self.assertEqual(response.status_code, 302, response.content[:1000])

    def test_image_upload_from_both_interfaces(self):
        image = io.BytesIO()
        Image.new('RGB', (2, 2), 'green').save(image, format='PNG')
        for url in ('/api/images/', '/admin/core/imagemedia/add/'):
            with self.subTest(url=url):
                token = self.complete('image.png')
                directory = self.root / 'private' / token
                (directory / 'data').write_bytes(image.getvalue())
                manifest = json.loads((directory / 'manifest.json').read_text())
                manifest.update(file_size=len(image.getvalue()), next_index=(len(image.getvalue()) + 7) // 8)
                (directory / 'manifest.json').write_text(json.dumps(manifest))
                response = self.client.post(url, {'title': 'Image', 'category': 'mix', 'image_file_upload': token, '_save': 'Save'})
                self.assertIn(response.status_code, (200, 302), response.content[:1000])
                if url.startswith('/admin'):
                    self.assertEqual(response.status_code, 302)

    def test_large_file_metadata_uses_64_bit_sizes(self):
        # Exercise actual >5 GiB arithmetic without allocating a giant file.
        size = 5 * 1024 ** 3 + 1
        token = uuid.uuid4().hex
        self.assertEqual(self.part(token, size=size).status_code, 200)
        manifest = json.loads((self.root / 'private' / token / 'manifest.json').read_text())
        self.assertEqual(manifest['file_size'], size)

    def test_limit_is_configurable(self):
        with override_settings(MAX_MEDIA_UPLOAD_SIZE=10):
            self.assertEqual(self.part(uuid.uuid4().hex).status_code, 400)

    def test_sparse_multigigabyte_files_save_by_moving(self):
        # Sparse files exercise real 64-bit filesystem sizes without consuming
        # gigabytes of test disk space or generating hours of media.
        for endpoint, field, model, size, filename in [
            ('taqreer', 'audio_file', TaqreerAudio, 2 * 1024 ** 3, 'long.mp3'),
            ('videos', 'video_file', VideoMedia, 5 * 1024 ** 3, 'long.mp4'),
            ('books', 'pdf_file', BookMedia, 5 * 1024 ** 3, 'large.pdf'),
        ]:
            token = self.complete(filename)
            directory = self.root / 'private' / token
            with (directory / 'data').open('r+b') as handle:
                handle.truncate(size)
            manifest = json.loads((directory / 'manifest.json').read_text())
            manifest.update(file_size=size, next_index=(size + 7) // 8)
            (directory / 'manifest.json').write_text(json.dumps(manifest))
            response = self.client.post(f'/api/{endpoint}/', {
                'title': 'Long media', 'duration': '05:00:00', f'{field}_upload': token,
            })
            self.assertEqual(response.status_code, 200, response.content)
            saved = getattr(model.objects.latest('pk'), field)
            self.assertEqual(Path(saved.path).stat().st_size, size)
            self.assertFalse((directory / 'data').exists())
