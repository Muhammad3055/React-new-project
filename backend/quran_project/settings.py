import os
# pyrefly: ignore [missing-import]
import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
environ.Env.read_env(BASE_DIR / '.env')

SECRET_KEY = env('SECRET_KEY', default='django-insecure-uv_wu8vz!h9omjh%vbv_h0*1^f&^tt$69$&=b2c_e(v+!uw0yj')

DEBUG = env.bool('DEBUG', default=True)

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['*'])

CSRF_TRUSTED_ORIGINS = [
    'https://maktabatulmuslim.com',
    'https://www.maktabatulmuslim.com',
    'http://localhost:5173',
    'http://127.0.0.1:8000',
    'http://localhost:8000'
]


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'core',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.gzip.GZipMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

try:
    import whitenoise  # pyrefly: ignore [unused-import]
    MIDDLEWARE.insert(3, 'whitenoise.middleware.WhiteNoiseMiddleware')
except ImportError:
    pass

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'quran-portal-cache',
    }
}

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

ROOT_URLCONF = 'quran_project.urls'

FRONTEND_DIR = BASE_DIR.parent / 'frontend' / 'dist'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [FRONTEND_DIR, BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {

            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.media',
            ],
        },
    },
]

WSGI_APPLICATION = 'quran_project.wsgi.application'


# Enterprise Database & High-Concurrency PostgreSQL Configuration
raw_db = os.environ.get('POSTGRES_DB', 'quran_db').strip()
if 'EMAIL_' in raw_db or len(raw_db) > 60:
    POSTGRES_DB = 'quran_db'
else:
    POSTGRES_DB = raw_db

POSTGRES_USER = os.environ.get('POSTGRES_USER', 'postgres').split('EMAIL_')[0].strip()
POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD', 'postgres').split('EMAIL_')[0].strip()
POSTGRES_HOST = os.environ.get('POSTGRES_HOST', 'localhost').split('EMAIL_')[0].strip()
POSTGRES_PORT = os.environ.get('POSTGRES_PORT', '5432').split('EMAIL_')[0].strip()


if os.environ.get('DATABASE_URL'):
    DATABASES = {'default': env.db('DATABASE_URL')}
    DATABASES['default']['CONN_MAX_AGE'] = 600
elif os.environ.get('USE_POSTGRES') == 'True':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': POSTGRES_DB,
            'USER': POSTGRES_USER,
            'PASSWORD': POSTGRES_PASSWORD,
            'HOST': POSTGRES_HOST,
            'PORT': POSTGRES_PORT,
            'CONN_MAX_AGE': 600,
            'OPTIONS': {
                'connect_timeout': 10,
            }
        }
    }
else:
    # Auto-detect local PostgreSQL connection or fallback to SQLite for local development
    try:
        import psycopg2
        conn = psycopg2.connect(
            dbname=POSTGRES_DB,
            user=POSTGRES_USER,
            password=POSTGRES_PASSWORD,
            host=POSTGRES_HOST,
            port=POSTGRES_PORT,
            connect_timeout=2
        )
        conn.close()
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': POSTGRES_DB,
                'USER': POSTGRES_USER,
                'PASSWORD': POSTGRES_PASSWORD,
                'HOST': POSTGRES_HOST,
                'PORT': POSTGRES_PORT,
                'CONN_MAX_AGE': 600,
            }
        }
    except Exception:
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR / 'db.sqlite3',
            }
        }

# Session & Security Settings for Accurate Auth Persistence across Page Reloads
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_SAVE_EVERY_REQUEST = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_AGE = 1209600
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False

# CSRF Trusted Origins for Local Dev, VPS IP and Custom Domains
CSRF_TRUSTED_ORIGINS = env.list('CSRF_TRUSTED_ORIGINS', default=[
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://169.58.117.130',
    'https://169.58.117.130',
    'http://maktabatulmuslim.com',
    'https://maktabatulmuslim.com',
    'http://www.maktabatulmuslim.com',
    'https://www.maktabatulmuslim.com',
])

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://169.58.117.130',
    'https://169.58.117.130',
    'http://maktabatulmuslim.com',
    'https://maktabatulmuslim.com',
    'http://www.maktabatulmuslim.com',
    'https://www.maktabatulmuslim.com',
]

# Email Configuration for Password Resets & 6-Digit Verification Codes
EMAIL_BACKEND = env('EMAIL_BACKEND', default='django.core.mail.backends.smtp.EmailBackend')
EMAIL_HOST = env('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = env.int('EMAIL_PORT', default=587)
EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS', default=True)
EMAIL_HOST_USER = env('EMAIL_HOST_USER', default='maktabtulmuslim26@gmail.com')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL', default='Maktaba tul Muslim <maktabtulmuslim26@gmail.com>')



AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Cloudflare R2 Object Storage Integration (Optional Cloud Media Storage for 10GB+ Media)
USE_CLOUDFLARE_R2 = os.environ.get('USE_CLOUDFLARE_R2', 'False') == 'True'

if USE_CLOUDFLARE_R2:
    if 'storages' not in INSTALLED_APPS:
        INSTALLED_APPS.append('storages')
    AWS_ACCESS_KEY_ID = os.environ.get('R2_ACCESS_KEY_ID', '')
    AWS_SECRET_ACCESS_KEY = os.environ.get('R2_SECRET_ACCESS_KEY', '')
    AWS_STORAGE_BUCKET_NAME = os.environ.get('R2_BUCKET_NAME', 'quran-media')
    AWS_S3_ENDPOINT_URL = os.environ.get('R2_ENDPOINT_URL', '')
    AWS_S3_CUSTOM_DOMAIN = os.environ.get('R2_CUSTOM_DOMAIN', '')
    AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}
    AWS_QUERYSTRING_AUTH = False
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

# Allow iframe and object embedding from same origin for PDF/Document reader modal
X_FRAME_OPTIONS = 'SAMEORIGIN'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Enable 600MB File Upload Limits in Django
DATA_UPLOAD_MAX_MEMORY_SIZE = 629145600  # 600 MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 629145600  # 600 MB

# Set upload permissions so Nginx (www-data) can read uploaded PDF & media files (Fixes 403 Forbidden)
# Official OAuth 2.0 / OpenID Connect Provider Configurations
GOOGLE_OAUTH_CLIENT_ID = env('GOOGLE_OAUTH_CLIENT_ID', default='')
GOOGLE_OAUTH_CLIENT_SECRET = env('GOOGLE_OAUTH_CLIENT_SECRET', default='')
MICROSOFT_OAUTH_CLIENT_ID = env('MICROSOFT_OAUTH_CLIENT_ID', default='')
APPLE_OAUTH_CLIENT_ID = env('APPLE_OAUTH_CLIENT_ID', default='')







