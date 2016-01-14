# -*- coding: utf-8 -*-
from django.conf import settings

def getMediaPath(request):
    """Get lang by request"""
    scheme = 'https://' if request.is_secure() else 'http://'
    return scheme + request.get_host() + settings.STATIC_URL