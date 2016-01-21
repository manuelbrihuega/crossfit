# -*- coding: UTF-8 -*-
from django.utils.translation import ugettext as _
from django.conf import settings
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import RequestContext, loader
from django.template.loader import render_to_string

from reservas.aux.lang import *
from reservas.aux.path import *

def home(request):
    lang=getLang(request)
    template = loader.get_template('completes/public.html')
    content = RequestContext(request,{
        'content':render_to_string('partials/public_home.html', {'lang':lang, 'media':getMediaPath(request)}),
        'title':_('SISTEMA DE RESERVAS | CrossFit Jerez'),
        'lang':lang,
        'css':['partials/home.css','partials/modals.css'],
        'javascript':['aux/modals.js']
    })
    return HttpResponse(template.render(content))

    
def login(request):
    lang=getLang(request)
    template = loader.get_template('completes/public.html')
    content = RequestContext(request,{
        'content':render_to_string('partials/public_login.html', {'lang':lang, 'media':getMediaPath(request)}),
        'title':_('SISTEMA DE RESERVAS | CrossFit Jerez'),
        'css':['partials/coolform.css'],
        'javascript':['public/login.js'],
        'lang':lang,
    })
    return HttpResponse(template.render(content))

    
def tokin(request,token):
    lang=getLang(request)
    template = loader.get_template('completes/clear.html')
    content = RequestContext(request,{
        'content':render_to_string('partials/public_tokin.html', {'lang':lang, 'media':getMediaPath(request),'token':token}),
        'title':_('SISTEMA DE RESERVAS | CrossFit Jerez'),
        'javascript':['public/tokin.js'],
        'lang':lang,
    })
    return HttpResponse(template.render(content))


def button(request):
    lang=getLang(request)
    template = loader.get_template('completes/button.html')
    content = RequestContext(request,{
        'content':render_to_string('partials/public_tokin.html', {'lang':lang, 'media':getMediaPath(request)}),
        'title':_('SISTEMA DE RESERVAS | CrossFit Jerez'),
        'javascript':['public/tokin.js'],
        'lang':lang,
    })
    return HttpResponse(template.render(content))

def guard(request):
    lang=getLang(request)
    template = loader.get_template('completes/guard.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))


def inversores(request):
    lang=getLang(request)
    template = loader.get_template('completes/inversores.html')
    content = RequestContext(request,{
        'content':render_to_string('partials/inversores.html', {'lang':lang, 'media':getMediaPath(request)}),
        'title':_('SISTEMA DE RESERVAS | CrossFit Jerez'),
        'javascript':['public/tokin.js'],
        'lang':lang,
    })
    return HttpResponse(template.render(content))

def radiostatus(request):
    lang=getLang(request)
    template = loader.get_template('completes/public.html')
    content = RequestContext(request,{
        'content':render_to_string('partials/radiostatus.html', {'lang':lang, 'media':getMediaPath(request)}),
        'title':_('SISTEMA DE RESERVAS | CrossFit Jerez'),
        'css':['partials/radiostatus.css'],
        'javascript':['public/radiostatus.js'],
        'lang':lang,
    })
    return HttpResponse(template.render(content))

def sip(request):
    template = loader.get_template('completes/sip.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

    
    
def test(request):
    lang=getLang(request)
    template = loader.get_template('completes/test.html')
    content = RequestContext(request,{
        'content':render_to_string('partials/test.html', {'idioma':lang}),
        'cadena':_("Bienvenido ES"),
        'lang_code':request.LANGUAGE_CODE,
        'django_language':request.session['django_language'],
        'xpire':request.session.get_expiry_age(),
        'dateex':request.session.get_expiry_date(),
        'STATIC_ROOT':settings.STATIC_ROOT
    })
    return HttpResponse(template.render(content))

def taxistas(request):
    lang=getLang(request)
    template = loader.get_template('completes/public.html')
    content = RequestContext(request,{
        'content':render_to_string('partials/signup_drivers.html', {'lang':lang, 'media':getMediaPath(request)}),
        'title':_('SISTEMA DE RESERVAS | CrossFit Jerez'),
        'css':['partials/coolform.css','partials/signup_driver.css'],
        'javascript':['public/signup_drivers.js','lib/modernizr-custom.js','lib/jquery-ui-1.10.4.custom.min.js','lib/jquery.ui.datepicker.es.js'],
        'lang':lang,
    })
    return HttpResponse(template.render(content))

def downloads(request):
    lang=getLang(request)
    template = loader.get_template('completes/public.html')
    content = RequestContext(request,{
        'content':render_to_string('partials/downloads.html', {'lang':lang, 'media':getMediaPath(request)}),
        'title':_('SISTEMA DE RESERVAS | CrossFit Jerez'),
        'css':['partials/downloads.css'],
        'javascript':[],
        'lang':lang,
    })
    return HttpResponse(template.render(content))


def validate_driver(request,token):
    lang=getLang(request)
    template = loader.get_template('completes/public.html')
    content = RequestContext(request,{
        'content':render_to_string('partials/validate_driver.html', {'lang':lang, 'media':getMediaPath(request),'token':token}),
        'title':_('SISTEMA DE RESERVAS | CrossFit Jerez'),
        'javascript':['public/validate_driver.js','aux/modals.js'],
        'css':['partials/validate_driver.css'],
        'lang':lang,
    })
    return HttpResponse(template.render(content))