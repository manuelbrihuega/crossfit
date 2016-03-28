# -*- coding: utf-8 -*-

from django.http import HttpResponse
from django.db.models import Q
import json

from reservas.models import *
from reservas.aux.permissions import *
from reservas.aux.general import *
from reservas.aux.date import *
from reservas.aux.auth import *


def default(request):
    """ Metodo default pruebas """
    data=json.dumps({'status': 'failed', 'response':'[faqs] works'})
    return APIResponse(request,data)


def list_news_foreign(request):
    """ Get the list of news  """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'list_news_foreign'):
            auth=Auth.objects.get(id=request.session['auth_id'])

            try:
                items=News.objects.all().order_by('-id')

                items_list = []

                for item in items:
                    date = item.date
                    items_list.append({'id':item.id, 'title':item.title, 'body':item.body, 'link':item.link, 'date':get_string_from_date(date)})

                data=json.dumps({'status': 'success', 'response':'news_list', 'data':{'news':items_list} })

            except:
                data=json.dumps({'status': 'failed', 'response':'new_not_found'})

        else:
            data=json.dumps({'status': 'failed', 'response':'unauthorized_list_news_foreign'})
    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    return APIResponse(request,data)
    

def list_news(request):
    """ Get the list of news  """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'list_news'):
            auth=Auth.objects.get(id=request.session['auth_id'])

            try:
                items = []
                items=News.objects.all()
               


                # TODO: contemplar noticias para radios

                items_list = []
                cu = U_Customers.objects.filter(Q(auth__id=auth.id))
                idfin = 0
                for c in cu:
                    idfin = c.id
                for item in items:
                    if item.auth==None or item.auth.id==idfin:
                        date = item.date
                        items_list.append({'id':item.id, 'title':item.title, 'body':item.body, 'link':item.link, 'date':get_string_from_date(date)})

                data=json.dumps({'status': 'success', 'response':'news_list', 'data':{'news':items_list} })

            except:
                data=json.dumps({'status': 'failed', 'response':'new_not_found'})

        else:
            data=json.dumps({'status': 'failed', 'response':'unauthorized_list_news'})
    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    return APIResponse(request,data)



def add_global_news(request):
    """
    Creates global news
    """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'add_global_news'):
            try:
                new=News()
                new.title = request.GET['title'] if validate_parameter(request.GET,'title') else None
                new.title = request.GET['title'] if validate_parameter(request.GET,'title') else None
                new.body = request.GET['body'] if validate_parameter(request.GET,'body') else None
                new.link = request.GET['link'] if validate_parameter(request.GET,'link') else None
                if validate_parameter(request.GET,'destiner'):
                    if request.GET['destiner']!=0:
                        new.auth_id = request.GET['destiner']
                new.date=datetime.utcnow()
                new.save()
                data=json.dumps({'status': 'success', 'response':'new_added', 'data':{'id':new.id}})
            except Exception as e:
                data=json.dumps({'status': 'failed', 'response':e.args[0]})
        else:
            data=json.dumps({'status': 'failed', 'response':'unauthorized_add_global_news'})
    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})
    return APIResponse(request,data)


def delete(request):
    """
    Deletes a communication
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
            
        if not have_permission(request.session['auth_id'],'delete_communication'):
            raise Exception(json.dumps({'status':'failed','response':'unauthorized_delete_communication'}))

        if not validate_parameter(request.GET,'id'):
            raise Exception('id_missed')

        new = News.objects.get(id=request.GET['id'])

        new.delete()

        data=json.dumps({'status':'success','response':'communication_deleted'})

    except News.DoesNotExist:
        data=json.dumps({'status':'failed','response':'communication_not_found'})

    except Exception as e:
        data=json.dumps({'status':'failed','response': e.args[0]})

    return APIResponse(request,data)
    
    
    
    