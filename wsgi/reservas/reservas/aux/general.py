# -*- coding: utf-8 -*-
from django.http import HttpResponse

def APIResponse(request,data):
    callback = request.GET.get('callback', '')
    return HttpResponse(callback+'('+data+');' if callback else data, content_type="application/json")


def validate_parameter(request,parameter):
    result=False
    cadena="result=True if '"+parameter+"' in request and len(request['"+parameter+"'].strip()) else False"
    try:
        exec(cadena)
        if parameter=='offset':
            try:
                int(request[parameter])
            except:
                return False
        return result
    except:
        return False


def sort_by_distance(item):
    return item['distance']