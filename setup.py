#!/usr/bin/env python

from setuptools import setup

setup(
    # GETTING-STARTED: set your app name:
    name='Reservas',
    # GETTING-STARTED: set your app version:
    version='1.0',
    # GETTING-STARTED: set your app description:
    description='Sistema de reservas Crossfit Jerez',
    # GETTING-STARTED: set author name (your name):
    author='Manuel de la Calle Brihuega',
    # GETTING-STARTED: set author email (your email):
    author_email='manuel.brihuega@gmail.com',
    # GETTING-STARTED: set author url (your url):
    url='http://www.python.org/sigs/distutils-sig/',
    # GETTING-STARTED: define required django version:
    install_requires=[
        'Django==1.6.1',
        'MySQL-python==1.2.5',
        'Pillow==2.3.0',
        'South==0.8.4',
        'Unidecode==0.04.16',
        'amqp==1.4.2',
        'anyjson==0.3.3',
        'billiard==3.3.0.14',
        'celery==3.1.8',
        'django-celery==3.1.1',
        'django-cors-headers==0.12',
        'django-extensions==1.3.3',
        'docopt==0.4.0',
        'kombu==3.0.10',
        'mailchimp==2.0.7',
        'pexpect==3.2',
        'pytz==2013.9',
        'requests==2.2.1',
        'six==1.6.1',
        'wsgiref==0.1.2',
        'xlrd==0.9.3'
    ],
    dependency_links=[
        'https://pypi.python.org/simple/django/'
    ],
)
