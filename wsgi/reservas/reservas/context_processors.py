from django.conf import settings

def baseurl(request):
    """
    Return a BASE_URL template context for the current request.
    """
    scheme = 'https://' if request.is_secure() else 'http://'
    return {'BASE_URL': scheme + request.get_host(),'MEDIA':scheme + request.get_host() + settings.STATIC_URL}