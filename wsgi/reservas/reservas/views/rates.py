# -*- coding: utf-8 -*-

from django.http import HttpResponse
import json
from django.db.models import Q

from api.models import *

from api.aux.auth import *
#from api.aux.rates import *
from api.aux.permissions import *
from api.aux.general import *
from api.aux.tasks import add_task
from api.aux.date import *


def list_all(request):
    """
    List all rates info
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not have_permission(request.session['auth_id'],'list_all_rates'):
            raise Exception('unauthorized_list_all_rates')

        user,auth = get_user_and_auth(request.session['auth_id'])
        rates=Rates.objects.all()
        list=[]
        for rate in rates:
            list.append({'id':rate.id,
                         'name':rate.name,
                         'credit_wod':rate.credit_wod,
                         'credit_box':rate.credit_box,
                         'price':rate.price,
                         'observations':rate.observations})


        data=json.dumps({'status':'success','response':'list_all_rates','data':list})

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
        
        if not have_permission(request.session['auth_id'],'search_rates'):
            raise Exception('unauthorized_search_rates')
            
        if not validate_parameter(request.GET,'lookup'):
            raise Exception('lookup_missed')
        
        user,auth = get_user_and_auth(request.session['auth_id'])   
        if request.GET['lookup']=='':
            rates=Rates.objects.all()   
        else:
            rates=Rates.objects.filter( Q(name__icontains=request.GET['lookup']) | Q(observations__icontains = request.GET['lookup']) )
        list=[]
        for rate in rates:
            list.append({'id':rate.id,
                         'name':rate.name,
                         'credit_wod':rate.credit_wod,
                         'credit_box':rate.credit_box,
                         'price':rate.price,
                         'observations':rate.observations})                     
            
        data=json.dumps({'status': 'success', 'response':'search_rates','data':list})
    
    except Exception as e:
        data = json.dumps({ 'status':'failed', 'response': e.args[0] })

    return APIResponse(request,data)


def add(request):
    """
    Creates a new rate
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not have_permission(request.session['auth_id'],'add_rate'):
            raise Exception('unauthorized_add_rate')
            
        for field in ('name','price','credit_wod','credit_box', 'observations'):
            if not validate_parameter(request.GET, field):
                raise Exception(field+'_missed')
        
        user,auth = get_user_and_auth(request.session['auth_id'])
        
        rate=Rates()
        rate.name=request.GET['name']
        rate.price=request.GET['price']
        rate.credit_wod=request.GET['credit_wod']
        rate.credit_box=request.GET['credit_box']
        rate.observations=request.GET['observations']
        rate.save()
        
        data=json.dumps({'status':'success','response':'rate_created','data':{'id':rate.id}})
    
    except Exception as e:
        data = json.dumps({'status':'failed', 'response': e.args[0] })

    return APIResponse(request,data)

'''
def get(request):
    """
    Get enterprise info
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not is_role(request.session['auth_id'],'U_Buttons') and not is_role(request.session['auth_id'],'U_Admin_Enterprises'):
            raise Exception('invalid_role')

        user=get_user(request.session['auth_id'])
        enterprise=Enterprises.objects.get(id=user.enterprise_id)

        enterprise_profile={'id':enterprise.id,
                            'name':enterprise.name,
                            'cif':enterprise.cif,
                            'prefix':enterprise.prefix,
                            'phone':enterprise.phone,
                            'discount':enterprise.discount,
                            'email':enterprise.email,
                            'credit_days':enterprise.credit_days,
                            'logo':enterprise.logo,
                            'latitude':enterprise.position.latitude if enterprise.position else '',
                            'longitude':enterprise.position.longitude if enterprise.position else '',
                            'address':enterprise.position.address if enterprise.position else '',
                            'postal_code':enterprise.position.location.postal_code if enterprise.position and enterprise.position.location else '',
                            'country_code':enterprise.position.location.country_code if enterprise.position and enterprise.position.location else '',
                            'locality':enterprise.position.location.locality if enterprise.position and enterprise.position.location else '',
                            'currency':enterprise.position.location.radio.delegation.currency if enterprise.position and enterprise.position.location and enterprise.position.location.radio and enterprise.position.location.radio.delegation else '',
                            'radio':{'id':enterprise.position.location.radio.id if enterprise.position and enterprise.position.location else '',
                                     'name':enterprise.position.location.radio.name if enterprise.position and enterprise.position.location else '',
                                     'fb_ref':enterprise.position.location.radio.fb_ref if enterprise.position and enterprise.position.location else ''}}
        
        data=json.dumps({'status':'success','response':'get_enterprise','data':{'enterprise':enterprise_profile}})

    except Enterprises.DoesNotExist:
        data = json.dumps({'status':'failed','response':'enterprise_not_found'})

    except Exception as e:
        data = json.dumps({ 'status':'failed', 'response': e.args[0] })
        
    return APIResponse(request,data)
'''