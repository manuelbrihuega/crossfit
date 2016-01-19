# -*- coding: UTF-8 -*-
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
PROJECT_PATH = os.path.realpath(os.path.dirname(__file__))
SECRET_KEY = 'qrdor327)nv9wzv$w7pn-76tur1kafvoel6_)$=z0tdyvtqo!i'
DEBUG = True
TEMPLATE_DEBUG = True
ALLOWED_HOSTS = [
    'api.taxible.com',
    'crossfit-reservasjerez.rhcloud.com/api/',
    'crossfit-reservasjerez.rhcloud.com',
    'api.taxibleapp.com',
    'taxible.com',
    'taxibleapp.com',
    '127.0.0.1',
    'localhost']
ROOT_URLCONF = 'reservas.urls'
WSGI_APPLICATION = 'reservas.wsgi.application'
LANGUAGE_CODE = 'es'
TIME_ZONE = 'Europe/Madrid'
USE_I18N = True
USE_L10N = True
USE_TZ = True
_ = lambda s: s
STATIC_URL = '/static/'
STATIC_ROOT = (PROJECT_PATH + '/../static')
TEMPLATE_DIRS = (PROJECT_PATH+'/templates')
SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
SESSION_COOKIE_AGE = 31 * 24 * 60 * 60 #
INSTALLED_APPS = (
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'reservas',
    'corsheaders',
    'django_extensions',
)
MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware'
)

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.static",
    "django.contrib.messages.context_processors.messages",
    "reservas.context_processors.baseurl",
)
LANGUAGES = (
    ('es', _('Espaniol ES')),
    ('cr', _('Espaniol CR')),
    ('pa', _('Espaniol PA')),
    ('pe', _('Espaniol PE')),
    ('ad', _('Espaniol AD')),
)
LOCALE_PATHS = (
    os.path.join(PROJECT_PATH, 'locale'),
)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'crossfit',                    # Or path to database file if using sqlite3.
        'USER': 'adminqdCT4kk',               # Not used with sqlite3.
        'PASSWORD': 'WfqmJhVeEqpv',               # Not used with sqlite3.
        'HOST': '127.10.183.2',                        # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '3306',                           # Set to empty string for default. Not used with sqlite3.
    }
}

DATABASE_OPTIONS = {
   "init_command": "SET storage_engine=INNODB",
}

PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.SHA1PasswordHasher',
    'django.contrib.auth.hashers.MD5PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
    'django.contrib.auth.hashers.BCryptPasswordHasher',
    'django.contrib.auth.hashers.CryptPasswordHasher',
)


#Configuramos variables para envio de email.
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_HOST_USER="crossfitjerezdelafrontera@gmail.com"
EMAIL_HOST_PASSWORD="Larios501"
EMAIL_USE_TLS=True