# -*- coding: utf-8 -*-

import unicodedata
from django.http import HttpResponse
import json

from django.db.models import Q
from reservas.models import *

from reservas.aux.general import *
from reservas.aux.date import *
from reservas.aux.auth import *
from reservas.aux.tickets import *
from reservas.aux.permissions import *


def default(request):
    """ Metodo default pruebas """
    data=json.dumps({'status': 'failed', 'response':'[tickets] works'})
    return APIResponse(request,data)


def add(request):
    """
    Creates a new ticket
    """
    if validate_parameter(request.GET,'offset'):
        if validate_parameter(request.GET,'title'):
            if validate_parameter(request.GET,'text'):
                try:
                    ticket=Tickets()
                    ticket.title=request.GET['title']
                    sender=False
                    if 'auth_id' in request.session:
                        ticket.auth_id=request.session['auth_id']
                        sender=True
                    if sender:
                        ticket.save()
                        message=Messages()
                        message.ticket=ticket
                        message.text=unicode(request.GET['text'])
                        message.original_way=True
                        message.date=local_date(datetime.utcnow(),int(request.GET['offset']))
                        message.save()
                        data=json.dumps({'status': 'success', 'response':'ticked_added', 'data': {'ticket_id':ticket.id} })
                        
                    else:
                        data=json.dumps({'status': 'failed', 'response':'sender_missed'})
                except Exception as e:
                    data=json.dumps({'status': 'failed', 'response':'ticket_model_failure'+e.args[0]})
            else:
                data=json.dumps({'status': 'failed', 'response':'text_missed'})
        else:
           data=json.dumps({'status': 'failed', 'response':'title_missed'})
    else:
       data=json.dumps({'status': 'failed', 'response':'offset_missed'})

    return APIResponse(request,data)




def list_opened(request):
    """ Get the list of opened tickets  """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'list_opened_tickets'):
            try:
                items=Tickets.objects.filter(Q(auth_id=request.session['auth_id']),~Q(status=0)).order_by('-id')
                items_list = []
                for item in items:
                    items_list.append({'id':item.id, 'title':item.title, 'status':item.status})

                data=json.dumps({'status': 'success', 'response':'opened_tickets', 'data':{'tickets':items_list} })

            except:
                data=json.dumps({'status': 'failed', 'response':'permissions_not_found'})
        else:
            data=json.dumps({'status': 'failed', 'response':'unauthorized_list_opened_tickets'})
    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    return APIResponse(request,data)


def list_all(request):
    """ Get the tickets list  """
    if 'auth_id' in request.session:
        if validate_parameter(request.GET,'offset'):
            if have_permission(request.session['auth_id'],'list_tickets'):
                try:
                    tickets=Tickets.objects.filter(auth_id=request.session['auth_id']).order_by('-id')
                    tickets_list = []
                    for ticket in tickets:

                        items=Messages.objects.filter(ticket=ticket)
                        items_list = []
                        for item in items:
                            items_list.append({'id':item.id, 'text':item.text, 'original_way':item.original_way, 'date':get_string_from_date(local_date(item.date,request.GET['offset']) ) })

                        tickets_list.append({'id':ticket.id, 'title':ticket.title, 'status':ticket.status, 'messages':items_list})

                    data=json.dumps({'status': 'success', 'response':'tickets_list', 'data':{'tickets':tickets_list} })

                except:
                    data=json.dumps({'status': 'failed', 'response':'tickets_model_failure'})
            else:
                data=json.dumps({'status': 'failed', 'response':'unauthorized_list_tickets'})
        else:
            data=json.dumps({'status': 'failed', 'response':'offset_missed'})
    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    return APIResponse(request,data)


def list_messages(request):
    """ Get messages from a ticket  """
    if 'auth_id' in request.session:
        if validate_parameter(request.GET,'offset'):
            if validate_parameter(request.GET,'ticket_id'):
                try:
                    items=Messages.objects.filter(ticket__auth_id=request.session['auth_id'],ticket_id=request.GET['ticket_id'])
                    items_list = []
                    for item in items:
                        items_list.append({'id':item.id, 'text':item.text, 'original_way':item.original_way, 'date':get_string_from_date(local_date(item.date,request.GET['offset']) )})

                    data=json.dumps({'status': 'success', 'response':'list_messages', 'data':{'messages':items_list} })

                except:
                    data=json.dumps({'status': 'failed', 'response':'messages_not_found'})
            else:
               data=json.dumps({'status': 'failed', 'response':'ticket_id_missed'})
        else:
           data=json.dumps({'status': 'failed', 'response':'offset_id_missed'})
    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    return APIResponse(request,data)


def close(request):
    """ Close a ticket  """
    if 'auth_id' in request.session:
        if validate_parameter(request.GET,'ticket_id'):
            try:
                ticket=Tickets.objects.get(id=request.GET['ticket_id'])
                if ticket:
                    if ticket.auth_id==request.session['auth_id']:
                        ticket.status=0
                        ticket.save()
                        data=json.dumps({'status': 'success', 'response':'ticked_closed'})
                    else:
                        data=json.dumps({'status': 'failed', 'response':'foreign_ticket'})
                else:
                    data=json.dumps({'status': 'failed', 'response':'ticket_not_found'})
            except:
                data=json.dumps({'status': 'failed', 'response':'ticket_model_failure'})
        else:
           data=json.dumps({'status': 'failed', 'response':'ticket_id_missed'})
    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    return APIResponse(request,data)


'''def respond(request):
    """ Add message to ticket  """
    if 'auth_id' in request.session:
        if validate_parameter(request.GET,'offset'):
            if validate_parameter(request.GET,'ticket_id'):
                if validate_parameter(request.GET,'text'):
                    try:
                        ticket=Tickets.objects.get(id=request.GET['ticket_id'])
                        if ticket:
                            if ticket.auth_id==request.session['auth_id']:
                                if ticket.status != 0:
                                    message=add_message(ticket,request.GET['text'],True,request.GET['offset'])
                                    if message['status']=='success':
                                        ticket.status=1
                                        ticket.save()
                                        data=json.dumps({'status': 'success', 'response':'message_added', 'data': {'message':message['data']['message']} })
                                    else:
                                        data=json.dumps({'status': 'failed', 'response':message['response']})
                                else:
                                    data=json.dumps({'status': 'failed', 'response':'closed_ticket'})
                            else:
                                data=json.dumps({'status': 'failed', 'response':'foreign_ticket'})
                        else:
                            data=json.dumps({'status': 'failed', 'response':'ticket_not_found'})
                    except:
                        data=json.dumps({'status': 'failed', 'response':'ticket_model_failure'})
                else:
                    data=json.dumps({'status': 'failed', 'response':'text_missed'})
            else:
               data=json.dumps({'status': 'failed', 'response':'ticket_id_missed'})
        else:
           data=json.dumps({'status': 'failed', 'response':'offset_missed'})
    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    return APIResponse(request,data)'''


def respond(request):
    """ Get every ticket """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not validate_parameter(request.GET,'ticket_id'):
            raise Exception('id_missed')
        if not validate_parameter(request.GET,'text'):
            raise Exception('text_missed')
        if not have_permission(request.session['auth_id'],'respond_ticket'):
            raise Exception('unauthorized_respond_ticket')
        ticket=Tickets.objects.get(id=request.GET['ticket_id'])
        message=add_message(ticket,request.GET['text'],True,request.GET['offset'])
        ticket.status=1
        ticket.save()

        data=json.dumps({'status': 'success', 'response':'ticket_responded','data': {'message':message['data']['message']} })

    except Tickets.DoesNotExist:
        data=json.dumps({'status':'failed','response':'ticket_not_found'})

    except Exception as e:
        data=json.dumps({'status':'failed','repsonse':e.args[0]})


    return APIResponse(request,data)


def notifications(request):
    """ Get the count of answered tickets  """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'list_tickets'):
            try:
                notifications=Tickets.objects.filter(auth_id=request.session['auth_id'],status=2).count()
                data=json.dumps({'status': 'success', 'response':'notifications', 'data':notifications })

            except:
                data=json.dumps({'status': 'failed', 'response':'ticket_model_failure'})
        else:
            data=json.dumps({'status': 'failed', 'response':'unauthorized_list_tickets'})
    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    return APIResponse(request,data)


def list_foreign(request):
    """ Get every ticket """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not validate_parameter(request.GET,'offset'):
            raise Exception('offset_missed')
        if not have_permission(request.session['auth_id'],'list_foreign_tickets'):
            raise Exception('unauthorized_list_foreign_tickets')
        tickets=Tickets.objects.filter(status=1).order_by('-id')
        tickets_list = []
        for ticket in tickets:
            role=""
            if ticket.auth:
                role=ticket.auth.role.role
                user_profile={'id':get_user(ticket.auth.id).id,
                              'auth_id':ticket.auth.id,
                              'name':ticket.auth.name+" "+ticket.auth.surname,
                              'phone':ticket.auth.phone,
                              'email':ticket.auth.email}
            else:
                user_profile={'email':ticket.email}
            items=Messages.objects.filter(ticket=ticket)
            items_list = []
            for item in items:
                items_list.append({'id':item.id, 'text':item.text, 'original_way':item.original_way, 'date':get_string_from_date(local_date(item.date,request.GET['offset']))})

            tickets_list.append({'id':ticket.id, 'title':ticket.title, 'status':ticket.status, 'messages':items_list,'user_profile':user_profile,"role":role})

        data=json.dumps({'status': 'success', 'response':'tickets_list', 'data':{'tickets':tickets_list} })

    except Exception as e:
        data=json.dumps({'status':'failed','repsonse':e.args[0]})


    return APIResponse(request,data)


def respond_foreign(request):
    """ Get every ticket """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not validate_parameter(request.GET,'id'):
            raise Exception('id_missed')
        if not validate_parameter(request.GET,'text'):
            raise Exception('text_missed')
        if not have_permission(request.session['auth_id'],'respond_foreign_ticket'):
            raise Exception('unauthorized_respond_foreign_ticket')
        ticket=Tickets.objects.get(id=request.GET['id'])
        message=add_message(ticket,request.GET['text'],False,request.GET['offset'])
        ticket.status=2
        ticket.save()

        data=json.dumps({'status': 'success', 'response':'ticket_responded','data': {'message':message['data']['message']} })

    except Tickets.DoesNotExist:
        data=json.dumps({'status':'failed','response':'ticket_not_found'})

    except Exception as e:
        data=json.dumps({'status':'failed','repsonse':e.args[0]})


    return APIResponse(request,data)

def notifications_supporters(request):
    """ Get the count of pending tickets  """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not have_permission(request.session['auth_id'],'list_foreign_tickets'):
            raise Exception('unauthorized_list_foreign_tickets')

        items=Tickets.objects.filter(status=1).count()
        data=json.dumps({'status': 'success', 'response':'notifications', 'data':items })

    except Exception as e:
        data=json.dumps({'status':'failed','repsonse':e.args[0]})

    return APIResponse(request,data)


def hide(request):
    """ Hide a ticket  """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not have_permission(request.session['auth_id'],'hide_foreign_ticket'):
            raise Exception('unauthorized_hide_foreign_ticket')
        if not validate_parameter(request.GET,'ticket_id'):
            raise Exception('ticket_id_missed')

        ticket=Tickets.objects.get(id=request.GET['ticket_id'])
        ticket.status=3
        ticket.save()

        data=json.dumps({'status': 'success', 'response':'ticked_hidden'})

    except Tickets.DoesNotExist:
        raise Exception('ticket_not_found')

    except Exception as e:
        data=json.dumps({'status':'failed','repsonse':e.args[0]})

    return APIResponse(request,data)