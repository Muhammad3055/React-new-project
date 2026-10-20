# Large media uploads

Both React admin forms and Django admin upload files larger than 8 MiB in
8 MiB requests. MP3 duration and video duration are not limited. The default
file limit is 10 GiB, so 2 GiB MP3s and 5 GiB videos/documents are supported.
Images use the same transport; Django admin still validates actual image formats
and dimensions with Pillow. Raising a byte limit does not remove image decoder
limits or make an unsupported browser codec playable.

The uploader checks SHA-256 for every part, retries transient errors up to four
times, and remembers confirmed progress in this browser tab. If interrupted,
select the same file and retry within seven days. Keep the tab open while
uploading. The final content save is not automatically retried: if that request
times out, inspect the content list before trying again.

Requests require a logged-in Django staff session. Sign in again if the session
expires. The chunk endpoint uses Django CSRF protection. Unlike the old public
`media/chunks` directory, new staging files are private under `backend/upload_tmp`.

## Deploy

Commit/push the changes before updating the VPS. Rebuild the frontend, collect
Django static files, and restart the actual Gunicorn service. The existing
`update_live.sh` performs these actions and also resets the checkout and replaces
Nginx configuration, so review it before running `bash update_live.sh`. Running
with `bash` does not require an executable file bit. Do not replace a live
Certbot/HTTPS server block with the repository HTTP example: preserve TLS settings.

No database migration is required for the upload feature. The new JavaScript
files must be included in `python manage.py collectstatic --noinput`; otherwise
Django admin cannot use the chunk uploader. Confirm that a large upload shows
multiple `POST /api/upload/chunk/` requests, then one small content-save request.

Both `nginx.conf` and the deployment example allow 6 GiB direct request bodies
for origin compatibility. Browser uploads still use small requests. Apply the
buffering/timeouts and body-size directives to the active HTTPS server block as
well as HTTP. Run `sudo nginx -t` before reloading Nginx. Never assume a repository
config is already active on the VPS.

Cloudflare can reject a single large request before it reaches Django. Chunking
avoids sending the entire file in that request; it does not require changing the
site's DNS. See [Cloudflare's upload-limit documentation](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/4xx-client-error/error-413/).

## Server capacity

- Use 64-bit Python and a filesystem supporting files larger than 5 GiB.
- Give the Gunicorn service user write access to `backend/upload_tmp` and media.
- Keep staging and local media on the **same filesystem**. Completed uploads
  are moved into storage, avoiding a second multi-gigabyte copy during saving.
- Allow space for every active upload, existing media, Nginx/Django temporary
  request files, and at least 256 MiB of reserve. Disk-full errors are reported
  and uploads can resume after space is freed.
- Run one daily cleanup with the application's virtual environment:
  `python manage.py cleanup_uploads`. It only removes staging files older than
  seven days and skips uploads currently locked by a request.
- Chunk requests are short, but verify your active Gunicorn command and server
  logs. The deployment script uses `--timeout 1800`; the old deployment guide
  did not. The update script does not rewrite an existing service's command.

Optional `.env` values:

```dotenv
# Bytes: default 10 GiB. Increase when storage and operational capacity permit.
MAX_MEDIA_UPLOAD_SIZE=10737418240
# Absolute private path, preferably on the same filesystem as MEDIA_ROOT.
CHUNK_UPLOAD_ROOT=/var/www/quran_portal/backend/upload_tmp
```

The local filesystem storage path is tested. If switching to R2/S3, configure and
test that storage separately: remote finalization copies the completed file and
can exceed a proxy's request timeout. This implementation does not perform direct
browser-to-object-storage multipart uploads.

## Verification

```bash
cd backend
python manage.py test core.test_uploads --settings=quran_project.upload_test_settings
```

Tests use an in-memory database and temporary storage, never the production `.env`
or database. They cover first-part upload, retries, checksums, resume, incomplete
files, ownership, CSRF, disk exhaustion, content saving, replacements, and Django
admin validation. Sparse 2 GiB/5 GiB files verify real filesystem-size handling and
moving completed files; they do not simulate hours of real media over a network.

Before considering a live rollout verified, upload the original 118 MB MP3 from
both admin interfaces, play and seek it, and check a representative large video
on the VPS. No implementation can guarantee uploads during arbitrary network
outages or after storage is exhausted.
