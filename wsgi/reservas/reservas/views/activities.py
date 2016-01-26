# -*- coding: utf-8 -*-

from django.http import HttpResponse
import json
from django.db.models import Q

from reservas.models import *

from reservas.aux.auth import *
from reservas.aux.permissions import *
from reservas.aux.general import *
from reservas.aux.tasks import add_task
from reservas.aux.date import *


def list_all(request):
    """
    List all activities info
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not have_permission(request.session['auth_id'],'list_all_activities'):
            raise Exception('unauthorized_list_all_activities')

        user,auth = get_user_and_auth(request.session['auth_id'])
        activities=Activities.objects.all()
        list=[]
        for activity in activities:
            list.append({'id':activity.id,
                         'name':activity.name,
                         'description':activity.description,
                         'credit_wod':activity.credit_wod,
                         'credit_box':activity.credit_box,
                         'max_capacity':activity.max_capacity,
                         'min_capacity':activity.min_capacity,
                         'queue_capacity':activity.queue_capacity})


        data=json.dumps({'status':'success','response':'list_all_activities','data':list})

    except Exception as e:
        data = json.dumps({
            'status':'failed',
            'response': e.args[0]
        })

    return APIResponse(request,data)


def search(request):
    """
    Search rates
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        
        if not have_permission(request.session['auth_id'],'search_activities'):
            raise Exception('unauthorized_search_activities')
            
        if not validate_parameter(request.GET,'lookup'):
            raise Exception('lookup_missed')
        
        user,auth = get_user_and_auth(request.session['auth_id'])   
        if request.GET['lookup']=='*':
            activities=Activities.objects.all()   
        else:
            activities=Activities.objects.filter( Q(name__icontains=request.GET['lookup']) | Q(description__icontains = request.GET['lookup']) )
        list=[]
        for activity in activities:
            list.append({'id':activity.id,
                         'name':activity.name,
                         'description':activity.description,
                         'credit_wod':activity.credit_wod,
                         'credit_box':activity.credit_box,
                         'max_capacity':activity.max_capacity,
                         'min_capacity':activity.min_capacity,
                         'queue_capacity':activity.queue_capacity})                     
            
        data=json.dumps({'status': 'success', 'response':'search_activities','data':list})
    
    except Exception as e:
        data = json.dumps({ 'status':'failed', 'response': e.args[0] })

    return APIResponse(request,data)


def add(request):
    """
    Creates a new activity
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not have_permission(request.session['auth_id'],'add_activity'):
            raise Exception('unauthorized_add_activity')
            
        for field in ('name','queue_capacity','credit_wod','credit_box','max_capacity','min_capacity'):
            if not validate_parameter(request.GET, field):
                raise Exception(field+'_missed')
        
        user,auth = get_user_and_auth(request.session['auth_id'])
        
        activity=Activities()
        activity.name=request.GET['name']
        activity.queue_capacity=request.GET['queue_capacity']
        activity.credit_wod=request.GET['credit_wod']
        activity.credit_box=request.GET['credit_box']
        activity.max_capacity=request.GET['max_capacity']
        activity.min_capacity=request.GET['min_capacity']
        if validate_parameter(request.GET,'description'):
            activity.description=request.GET['description']
        activity.save()
        
        data=json.dumps({'status':'success','response':'activity_created','data':{'id':activity.id}})
    
    except Exception as e:
        data = json.dumps({'status':'failed', 'response': e.args[0] })

    return APIResponse(request,data)


def get_foreign(request):
    """
    Get foreign activity info
    """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'get_foreign_activity'):
            if validate_parameter(request.GET,'id'):
                try:
                    activity=Activities.objects.get(id=request.GET['id'])
                    activity_profile={'id':activity.id,
                                        'name':activity.name,
                                        'description':activity.description,
                                        'credit_wod':activity.credit_wod,
                                        'credit_box':activity.credit_box,
                                        'max_capacity':activity.max_capacity,
                                        'min_capacity':activity.min_capacity,
                                        'queue_capacity':activity.queue_capacity}
                    data=json.dumps({'status':'success','response':'get_activity','data':{'activity':activity_profile,}})
                except:
                    data=json.dumps({'status':'failed','response':'activity_not_found'})
            else:
                data=json.dumps({'status':'failed','response':'id_missed'})
        else:
            data=json.dumps({'status':'failed','response':'unauthorized_list_all_activities'})
    else:
        data=json.dumps({'status':'failed','response':'not_logged'})
    return APIResponse(request,data)


def delete(request):
    """
    Delete activity
    """
    
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')

        if not have_permission(request.session['auth_id'], 'delete_activity'):
            raise Exception('unauthorized_delete_activity')

        if not validate_parameter(request.GET, 'id'):
            raise Exception('activity_id_missed')

        user,auth = get_user_and_auth(request.session['auth_id'])
        
        activity=Activities.objects.get(id=request.GET['id'])
            
        activity.delete()
        
        data = json.dumps( { 'status': 'success', 'response': 'activity_deleted'} )
       
    except Activities.DoesNotExist:
        data = json.dumps({'status': 'failed', 'response': 'activity_not_found'})

    except Exception as e:
        data = json.dumps({
            'status':'failed',
            'response': e.args[0]
        })

    return APIResponse(request=request, data=data)


def edit_foreign(request):
    """
    Edits a activity
    """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'edit_foreign_activity'):
            for field in ('name','queue_capacity','credit_wod','credit_box','max_capacity','min_capacity'):
                if not validate_parameter(request.GET, field):
                    raise Exception(field+'_missed')
            try:
                activity=Activities.objects.get(id=request.GET['id'])
                activity.name=request.GET['name']
                activity.queue_capacity=request.GET['queue_capacity']
                activity.credit_wod=request.GET['credit_wod']
                activity.credit_box=request.GET['credit_box']
                activity.max_capacity=request.GET['max_capacity']
                activity.min_capacity=request.GET['min_capacity']
                if validate_parameter(request.GET,'description'):
                    activity.description=request.GET['description']
                activity.save()
                data=json.dumps({'status':'success','response':'activity_modified'})
            except:
                data=json.dumps({'status': 'failed', 'response':'activity_not_found'})
           
        else:
            data=json.dumps({'status': 'failed', 'response':'unauthorized_edit_foreign_activity'})
    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    return APIResponse(request,data)
