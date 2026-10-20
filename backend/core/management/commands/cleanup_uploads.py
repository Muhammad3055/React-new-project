import fcntl
import shutil
import time

from django.conf import settings
from django.core.management.base import BaseCommand

from core.uploads import root


class Command(BaseCommand):
    help = 'Remove expired or consumed private uploads; skip uploads currently in use.'

    def handle(self, **options):
        removed = 0
        for path in root().iterdir():
            if not path.is_dir():
                continue
            manifest = path / 'manifest.json'
            age = time.time() - (manifest if manifest.exists() else path).stat().st_mtime
            if age < settings.CHUNK_UPLOAD_TTL:
                continue
            try:
                with (path / 'lock').open('a+b') as lock:
                    fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
                    # Recheck after taking the lock: a request may have resumed.
                    age = time.time() - (manifest if manifest.exists() else path).stat().st_mtime
                    if age >= settings.CHUNK_UPLOAD_TTL:
                        shutil.rmtree(path)
                        removed += 1
            except (BlockingIOError, FileNotFoundError):
                continue
        self.stdout.write(f'Removed {removed} expired uploads.')
