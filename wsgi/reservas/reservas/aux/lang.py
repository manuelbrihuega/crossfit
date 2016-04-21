# -*- coding: utf-8 -*-
from django.utils import translation

def getLang(request):
    """Get lang by request"""
    lang = request.LANGUAGE_CODE
    if request.get_host().find(".com.pa")>0:
        lang = 'pa'
    elif request.get_host().find(".cr")>0:
        lang = 'cr'
    elif 'django_language' in request.session:
        if request.session.get('django_language') == 'cr':
            lang = 'cr'
        if request.session.get('django_language') == 'pa':
            lang = 'pa'
        if request.session.get('django_language') == 'pe':
            lang = 'pe'
        if request.session.get('django_language') == 'ad':
            lang = 'ad'
    lang = 'es'
    setLang(request,lang)
    return lang
    
def setLang(request,code):
    request.session['django_language']=code
    translation.activate(code)
    request.LANGUAGE_CODE = code
    return True
    
