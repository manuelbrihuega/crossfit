# -*- coding: utf-8 -*-

from django.http import HttpResponse
from django.db.models import Q
import json
from django.db import transaction

from reservas.models import *

from reservas.aux.permissions import *
from reservas.aux.customers import *
from reservas.aux.general import *
from reservas.aux.strings import *
from reservas.aux.auth import *
from reservas.aux.tasks import *
#from api.aux.radios import *

@transaction.atomic
def add(request):
    """
    Creates a customer.
    """
    try:
        params=['birthdate','nif','name','surname','password','email','phone','rate_id']
        for param in params:
            if not validate_parameter(request.GET,param):
                raise Exception(param+'_missed')

        with transaction.atomic():
            if request.GET['rate_id']!='-1':
                rate=Rates.objects.get(id=request.GET['rate_id'])
            else:
            	raise Exception('rate_missed')
            result_auth=create_auth(request.GET,'U_Customers',False)
            if result_auth['status']=="success":
                r_customer=create_customer(request.GET,result_auth['response'],rate)
                if r_customer['status']=='failed':
                	raise Exception(r_customer['response'])
                else:
                	add_task(datetime.utcnow(),'send_email_new_customer_task(customer_id='+str(r_customer['response'].id)+')')
                	data=json.dumps({'status':'success','response':'created','data':{'auth_id':result_auth['response'].id,'customer_id':r_customer['response'].id}})
            else:
                raise Exception(result_auth['response'])

    except Rates.DoesNotExist:
        raise Exception('rate_not_found')

    except Exception as e:
        data = json.dumps({
            'status':'failed',
            'response': e.args[0]
        })


    return APIResponse(request,data)


def search(request):
    """
    Searches a customer by its name, surname or email
    """
    if 'auth_id' not in request.session:
        data=json.dumps({'status':'failed','response':'not_logged'})
    if not have_permission(request.session['auth_id'],'search_customers'):
        data=json.dumps({'status':'failed','response':'unauthorized_search_customers'})
    if not validate_parameter(request.GET,'lookup'):
        data=json.dumps({'status': 'failed', 'response':'lookup_missed'})
    else:
        try:
            list_customers=[]
            user,auth = get_user_and_auth(request.session['auth_id'])
            words = str(request.GET['lookup']).split()
            counter = 0
            for word in words:
                if counter == 0:
					items=U_Customers.objects.filter(Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word))
					counter = 1
				elif counter == 1:
					items=items.filter(Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word))
            for item in items:
                list_customers.append({'id':item.id, 'name':item.auth.name, 'email':item.auth.email, 'surname':item.auth.surname})
            data=json.dumps({'status': 'success','response':'search_customers','data':{'list':list_customers}})
        except:
            data=json.dumps({'status': 'failed', 'response':'customer_not_found'})
    
    return APIResponse(request,data)