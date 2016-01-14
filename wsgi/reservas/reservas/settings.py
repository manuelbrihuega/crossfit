# -*- coding: UTF-8 -*-
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
PROJECT_PATH = os.path.realpath(os.path.dirname(__file__))
SECRET_KEY = 'qrdor327)nv9wzv$w7pn-76tur1kafvoel6_)$=z0tdyvtqo!i'
DEBUG = True
TEMPLATE_DEBUG = True
ALLOWED_HOSTS = [
    'api.taxible.com',
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
STATIC_ROOT = (PROJECT_PATH + '/assets')
TEMPLATE_DIRS = (PROJECT_PATH+'/templates')
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
SESSION_COOKIE_AGE = 31 * 24 * 60 * 60 #
INSTALLED_APPS = (
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
)
MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
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

STATICFILES_DIRS = (
    os.path.join(PROJECT_PATH, 'static'),
)


'''
       Root User: adminqdCT4kk
   Root Password: WfqmJhVeEqpv
   Database Name: crossfit

Connection URL: mysql://$OPENSHIFT_MYSQL_DB_HOST:$OPENSHIFT_MYSQL_DB_PORT/'''