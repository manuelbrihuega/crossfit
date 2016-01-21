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


@transaction.atomic
def add_super(request):
    """
    Creates a customer.
    """
    if 'auth_id' not in request.session:
        data=json.dumps({'status':'failed','response':'not_logged'})
    if not have_permission(request.session['auth_id'],'add_customer_super'):
        data=json.dumps({'status':'failed','response':'unauthorized_add_customer_super'})
    else:
        try:
            params=['birthdate','nif','name','surname','password','email','phone','rate_id','vip','paid','validated','prueba']
            for param in params:
                if not validate_parameter(request.GET,param):
                    raise Exception(param+'_missed')

            with transaction.atomic():
                if request.GET['rate_id']!='-1':
                    rate=Rates.objects.get(id=request.GET['rate_id'])
                else:
                	raise Exception('rate_missed')
                resl=getBoolValue(request.GET['validated'])
                result_auth=create_auth(request.GET,'U_Customers',resl)
                if result_auth['status']=="success":
                    r_customer=create_customer_super(request.GET,result_auth['response'],rate)
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
            filtro = request.GET['filtro']
            list_customers=[]
            user,auth = get_user_and_auth(request.session['auth_id'])
            if request.GET['lookup']!='*':
                words = str(request.GET['lookup']).split()
                counter = 0
                for word in words:
                    if counter == 0:
                    	if filtro=='todos':
                            items=U_Customers.objects.filter(Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word))
                        elif filtro=='pagados':
                            items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=1))
                        elif filtro=='nopagados':
                            items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=0))
                        elif filtro=='validados':
                            items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=1))
                        elif filtro=='novalidados':
                            items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=0))
                        counter = 1
                    elif counter == 1:
                    	if filtro=='todos':
                            items=items.filter(Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word))
                        elif filtro=='pagados':
                            items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=1))
                        elif filtro=='nopagados':
                            items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=0))
                        elif filtro=='validados':
                            items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=1))
                        elif filtro=='novalidados':
                            items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=0))
                for item in items:
                    list_customers.append({'id':item.id, 'name':item.auth.name, 'email':item.auth.email, 'surname':item.auth.surname, 'paid':item.paid})
                data=json.dumps({'status': 'success','response':'search_customers','data':{'list':list_customers}})
            else:
            	if filtro=='todos':
                    items=U_Customers.objects.all()
                elif filtro=='pagados':
                    items=U_Customers.objects.filter(Q(paid=1))
                elif filtro=='nopagados':
                    items=U_Customers.objects.filter(Q(paid=0))
                elif filtro=='validados':
                    items=U_Customers.objects.filter(Q(validated=1))
                elif filtro=='novalidados':
                    items=U_Customers.objects.filter(Q(validated=0))
                for item in items:
                    list_customers.append({'id':item.id, 'name':item.auth.name, 'email':item.auth.email, 'surname':item.auth.surname})
                data=json.dumps({'status': 'success','response':'search_customers','data':{'list':list_customers}})
        except:
            data=json.dumps({'status': 'failed', 'response':'customer_not_found'})
    
    return APIResponse(request,data)


def get_foreign(request):
    """
    Gets a foreign customer profile
    """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'get_foreign_customer'):
            if validate_parameter(request.GET,'customer_id'):
                try:
                    customer=U_Customers.objects.get(id=request.GET['customer_id'])
                    if customer:
                        auth_profile=get_profile(customer.auth_id)
                        customer_profile={'id':customer.id, 'nif':customer.nif, 'birthdate':get_string_from_date(local_date(customer.birthdate,2)), 'credit_wod':customer.credit_wod, 'credit_box':customer.credit_box, 'paid':customer.paid, 'vip':customer.vip, 'validated':customer.validated, 'test_user':customer.test_user, 'rate_id':customer.rate_id}
                        data=json.dumps({'status':'success','response':'customer_profile','data':{'auth_profile':auth_profile,
                                                                                                   'customer_profile':customer_profile
                                                                                                   }})
                    else:
                        data=json.dumps({'status': 'failed', 'response':'customer_not_found'})

                except Exception as e:
                    data=json.dumps({'status': 'failed', 'response':e.args[0]})
            else:
                data=json.dumps({'status': 'failed', 'response':'customer_id_missed'})
        else:
            data=json.dumps({'status': 'failed', 'response':'unauthorized_get_foreign_customer'})
    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    return APIResponse(request,data)