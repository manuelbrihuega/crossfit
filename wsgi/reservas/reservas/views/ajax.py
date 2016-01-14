from django.http import HttpResponse
import json
import os

from reservas.aux.lang import *

# LANG
def get_lang(request):
    return HttpResponse(json.dumps({'status': 'success', 'response':'lang', 'data':getLang(request)}))
    
def set_lang(request):
    if 'country_code' in request.POST:
        setLang(request,request.POST['country_code'])
        data=json.dumps({'status': 'success', 'response':'lang_set','data':request.session['django_language']})
    else:
        data=json.dumps({'status': 'failed', 'response':'country_code_missed'})
    return HttpResponse(data)

    
def upload_file_driver(request):
    from django.conf import settings
    from os import listdir
    from os.path import isfile, join
    try:
        PROJECT_PATH = getattr(settings, "PROJECT_PATH", None)
        if 'token' not in request.POST:
            raise Exception('token_missed')
        if 'file' not in request.FILES:
            raise Exception('file_missed')
        token=request.POST['token']
        f=request.FILES['file']
        if len(f)==0:
            raise Exception('file_not_found')
        file_name=f.name
        file_extension=file_name.split('.')
        if len(file_extension)>1:
            file_extension=file_extension[len(file_extension)-1]
        else:
            file_extension='txt'
        file_root = os.path.join(PROJECT_PATH,'static/docs/drivers/'+token)
        if not os.path.isdir(file_root):
            os.mkdir(file_root, 0755)
        else:
            onlyfiles = [ftemp for ftemp in listdir(file_root) if isfile(join(file_root,ftemp)) ]
            for myfile in onlyfiles:
                os.remove(os.path.join(PROJECT_PATH,'static/docs/drivers/'+token+'/'+myfile))
        with open(os.path.join(PROJECT_PATH,'static/docs/drivers/'+token+'/document.'+file_extension), 'wb+') as destination:
            for chunk in f.chunks():
                destination.write(chunk)

        data=json.dumps({'status':'success','response':'file_uploaded'})

    except Exception as e:
        data=json.dumps({'status':'failed','response':e.args[0]})

    return HttpResponse(data)


def upload_excel_tariff(request):
    from django.conf import settings
    from os import listdir
    from os.path import isfile, join
    try:
        PROJECT_PATH = getattr(settings, "PROJECT_PATH", None)
        if 'excel' not in request.FILES:
            raise Exception('file_missed')
        radio_id=request.POST['radio_id']
        f=request.FILES['excel']
        if len(f)==0:
            raise Exception('file_not_found')
        file_name=f.name
        file_extension=file_name.split('.')
        if len(file_extension)>1:
            file_extension=file_extension[len(file_extension)-1]
        else:
            file_extension='txt'
        file_root = os.path.join(PROJECT_PATH,'static/docs/tariff/'+radio_id)
        if not os.path.isdir(file_root):
            os.mkdir(file_root, 0755)
        else:
            onlyfiles = [ftemp for ftemp in listdir(file_root) if isfile(join(file_root,ftemp)) ]
            for myfile in onlyfiles:
                os.remove(os.path.join(PROJECT_PATH,'static/docs/tariff/'+radio_id+'/'+myfile))
        with open(os.path.join(PROJECT_PATH,'static/docs/tariff/'+radio_id+'/document.'+file_extension), 'wb+') as destination:
            for chunk in f.chunks():
                destination.write(chunk)

        data=json.dumps({'status':'success','response':'file_uploaded'})

    except Exception as e:
        data=json.dumps({'status':'failed','response':e.args[0]})

    return HttpResponse(data)

def get_files_driver(request):
    from os import listdir
    from os.path import isfile, join
    from django.conf import settings
    PROJECT_PATH = getattr(settings, "PROJECT_PATH", None)
    try:

        mypath=os.path.join(PROJECT_PATH,'static/docs/drivers/'+request.POST['token'])
        onlyfiles=[]
        if os.path.isdir(mypath):
            onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath,f)) ]

        data=json.dumps({'status':'success','response':'get_files','data':onlyfiles})

    except Exception as e:
        data=json.dumps({'status':'failed','response':e.args[0]})

    return HttpResponse(data)
