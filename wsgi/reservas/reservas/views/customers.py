# -*- coding: utf-8 -*-
import unicodedata
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
                    name = 'User_Id'+str(result_auth['response'].id)
                    nick = 'User_Id'+str(result_auth['response'].id)
                    phone = '+34'+str(result_auth['response'].phone)
                    message = 'Gracias por registrate en el sistema de reservas de CrossFit Jerez. Podrá comenzar a utilizarlo cuando validemos su registro.'
                    add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
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
                        name = 'User_Id'+str(result_auth['response'].id)
                        nick = 'User_Id'+str(result_auth['response'].id)
                        phone = '+34'+str(result_auth['response'].phone)
                        message = 'Gracias por registrate en el sistema de reservas de CrossFit Jerez. Podrá comenzar a utilizarlo cuando validemos su registro.'
                        add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
                    
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
            order = request.GET['order']
            list_customers=[]
            user,auth = get_user_and_auth(request.session['auth_id'])
            if request.GET['lookup']!='*':
                words = request.GET['lookup'].split()
                counter = 0
                for word in words:
                    if order=='nombreDESC':
                        if counter == 0:
                            if filtro=='todos':
                                items=U_Customers.objects.filter(Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)).order_by('auth__name')
                            elif filtro=='pagados':
                                items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=1)).order_by('auth__name')
                            elif filtro=='nopagados':
                                items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=0)).order_by('auth__name')
                            elif filtro=='validados':
                                items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=1)).order_by('auth__name')
                            elif filtro=='novalidados':
                                items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=0)).order_by('auth__name')
                            counter = 1
                        elif counter == 1:
                    	    if filtro=='todos':
                                items=items.filter(Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)).order_by('auth__name')
                            elif filtro=='pagados':
                                items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=1)).order_by('auth__name')
                            elif filtro=='nopagados':
                                items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=0)).order_by('auth__name')
                            elif filtro=='validados':
                                items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=1)).order_by('auth__name')
                            elif filtro=='novalidados':
                                items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=0)).order_by('auth__name')
                    elif order=='nombreASC':
                        if counter == 0:
                            if filtro=='todos':
                                items=U_Customers.objects.filter(Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)).order_by('-auth__name')
                            elif filtro=='pagados':
                                items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=1)).order_by('-auth__name')
                            elif filtro=='nopagados':
                                items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=0)).order_by('-auth__name')
                            elif filtro=='validados':
                                items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=1)).order_by('-auth__name')
                            elif filtro=='novalidados':
                                items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=0)).order_by('-auth__auth__name')
                            counter = 1
                        elif counter == 1:
                            if filtro=='todos':
                                items=items.filter(Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)).order_by('-auth__name')
                            elif filtro=='pagados':
                                items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=1)).order_by('-auth__name')
                            elif filtro=='nopagados':
                                items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=0)).order_by('-auth__name')
                            elif filtro=='validados':
                                items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=1)).order_by('-auth__name')
                            elif filtro=='novalidados':
                                items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=0)).order_by('-auth__name')
                    elif order=='apellidosDESC':
                        if counter == 0:
                            if filtro=='todos':
                                items=U_Customers.objects.filter(Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)).order_by('auth__surname')
                            elif filtro=='pagados':
                                items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=1)).order_by('auth__surname')
                            elif filtro=='nopagados':
                                items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=0)).order_by('auth__surname')
                            elif filtro=='validados':
                                items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=1)).order_by('auth__surname')
                            elif filtro=='novalidados':
                                items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=0)).order_by('auth__surname')
                            counter = 1
                        elif counter == 1:
                            if filtro=='todos':
                                items=items.filter(Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)).order_by('auth__surname')
                            elif filtro=='pagados':
                                items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=1)).order_by('auth__surname')
                            elif filtro=='nopagados':
                                items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=0)).order_by('auth__surname')
                            elif filtro=='validados':
                                items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=1)).order_by('auth__surname')
                            elif filtro=='novalidados':
                                items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=0)).order_by('auth__surname')
                    elif order=='apellidosASC':
                        if counter == 0:
                            if filtro=='todos':
                                items=U_Customers.objects.filter(Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)).order_by('-auth__surname')
                            elif filtro=='pagados':
                                items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=1)).order_by('-auth__surname')
                            elif filtro=='nopagados':
                                items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=0)).order_by('-auth__surname')
                            elif filtro=='validados':
                                items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=1)).order_by('-auth__surname')
                            elif filtro=='novalidados':
                                items=U_Customers.objects.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=0)).order_by('-auth__surname')
                            counter = 1
                        elif counter == 1:
                            if filtro=='todos':
                                items=items.filter(Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)).order_by('-auth__surname')
                            elif filtro=='pagados':
                                items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=1)).order_by('-auth__surname')
                            elif filtro=='nopagados':
                                items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(paid=0)).order_by('-auth__surname')
                            elif filtro=='validados':
                                items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=1)).order_by('-auth__surname')
                            elif filtro=='novalidados':
                                items=items.filter((Q(auth__name__icontains=word)|Q(auth__surname__icontains=word)|Q(auth__email__icontains=word)|Q(auth__phone__icontains=word)) & Q(validated=0)).order_by('-auth__surname')
                for item in items:
                    list_customers.append({'id':item.id, 'name':item.auth.name, 'email':item.auth.email, 'surname':item.auth.surname, 'paid':item.paid, 'phone':item.auth.phone, 'nif':item.nif, 'credit_wod':item.credit_wod, 'credit_box':item.credit_box, 'credit_bono':item.credit_bono, 'validated':item.validated, 'credit_wod_tarifa':item.rate.credit_wod, 'credit_box_tarifa':item.rate.credit_box, 'credit_bono_tarifa':item.rate.credit_bono, 'tarifa_vigente':item.rate.name, 'tarifa_vigente_precio':item.rate.price, 'direccion':item.direccion, 'nota_general':item.nota_general, 'nota_especial':item.nota_especial})
                data=json.dumps({'status': 'success','response':'search_customers','data':{'list':list_customers}})
            else:
            	if order=='nombreDESC':
                    if filtro=='todos':
                        items=U_Customers.objects.all().order_by('auth__name')
                    elif filtro=='pagados':
                        items=U_Customers.objects.filter(Q(paid=1)).order_by('auth__name')
                    elif filtro=='nopagados':
                        items=U_Customers.objects.filter(Q(paid=0)).order_by('auth__name')
                    elif filtro=='validados':
                        items=U_Customers.objects.filter(Q(validated=1)).order_by('auth__name')
                    elif filtro=='novalidados':
                        items=U_Customers.objects.filter(Q(validated=0)).order_by('auth__name')
                    for item in items:
                        list_customers.append({'id':item.id, 'name':item.auth.name, 'email':item.auth.email, 'surname':item.auth.surname, 'paid':item.paid, 'phone':item.auth.phone, 'nif':item.nif, 'credit_wod':item.credit_wod, 'credit_box':item.credit_box, 'credit_bono':item.credit_bono, 'validated':item.validated, 'credit_wod_tarifa':item.rate.credit_wod, 'credit_box_tarifa':item.rate.credit_box, 'credit_bono_tarifa':item.rate.credit_bono, 'tarifa_vigente':item.rate.name, 'tarifa_vigente_precio':item.rate.price, 'direccion':item.direccion, 'nota_general':item.nota_general, 'nota_especial':item.nota_especial})
                    data=json.dumps({'status': 'success','response':'search_customers','data':{'list':list_customers}})
                elif order=='nombreASC':
                    if filtro=='todos':
                        items=U_Customers.objects.all().order_by('-auth__name')
                    elif filtro=='pagados':
                        items=U_Customers.objects.filter(Q(paid=1)).order_by('-auth__name')
                    elif filtro=='nopagados':
                        items=U_Customers.objects.filter(Q(paid=0)).order_by('-auth__name')
                    elif filtro=='validados':
                        items=U_Customers.objects.filter(Q(validated=1)).order_by('-auth__name')
                    elif filtro=='novalidados':
                        items=U_Customers.objects.filter(Q(validated=0)).order_by('-auth__name')
                    for item in items:
                        list_customers.append({'id':item.id, 'name':item.auth.name, 'email':item.auth.email, 'surname':item.auth.surname, 'paid':item.paid, 'phone':item.auth.phone, 'nif':item.nif, 'credit_wod':item.credit_wod, 'credit_box':item.credit_box, 'credit_bono':item.credit_bono, 'validated':item.validated, 'credit_wod_tarifa':item.rate.credit_wod, 'credit_box_tarifa':item.rate.credit_box, 'credit_bono_tarifa':item.rate.credit_bono, 'tarifa_vigente':item.rate.name, 'tarifa_vigente_precio':item.rate.price, 'direccion':item.direccion, 'nota_general':item.nota_general, 'nota_especial':item.nota_especial})
                    data=json.dumps({'status': 'success','response':'search_customers','data':{'list':list_customers}})
                elif order=='apellidosDESC':
                    if filtro=='todos':
                        items=U_Customers.objects.all().order_by('auth__surname')
                    elif filtro=='pagados':
                        items=U_Customers.objects.filter(Q(paid=1)).order_by('auth__surname')
                    elif filtro=='nopagados':
                        items=U_Customers.objects.filter(Q(paid=0)).order_by('auth__surname')
                    elif filtro=='validados':
                        items=U_Customers.objects.filter(Q(validated=1)).order_by('auth__surname')
                    elif filtro=='novalidados':
                        items=U_Customers.objects.filter(Q(validated=0)).order_by('auth__surname')
                    for item in items:
                        list_customers.append({'id':item.id, 'name':item.auth.name, 'email':item.auth.email, 'surname':item.auth.surname, 'paid':item.paid, 'phone':item.auth.phone, 'nif':item.nif, 'credit_wod':item.credit_wod, 'credit_box':item.credit_box, 'credit_bono':item.credit_bono, 'validated':item.validated, 'credit_wod_tarifa':item.rate.credit_wod, 'credit_box_tarifa':item.rate.credit_box, 'credit_bono_tarifa':item.rate.credit_bono, 'tarifa_vigente':item.rate.name, 'tarifa_vigente_precio':item.rate.price, 'direccion':item.direccion, 'nota_general':item.nota_general, 'nota_especial':item.nota_especial})
                    data=json.dumps({'status': 'success','response':'search_customers','data':{'list':list_customers}})
                elif order=='apellidosASC':
                    if filtro=='todos':
                        items=U_Customers.objects.all().order_by('-auth__surname')
                    elif filtro=='pagados':
                        items=U_Customers.objects.filter(Q(paid=1)).order_by('-auth__surname')
                    elif filtro=='nopagados':
                        items=U_Customers.objects.filter(Q(paid=0)).order_by('-auth__surname')
                    elif filtro=='validados':
                        items=U_Customers.objects.filter(Q(validated=1)).order_by('-auth__surname')
                    elif filtro=='novalidados':
                        items=U_Customers.objects.filter(Q(validated=0)).order_by('-auth__surname')
                    for item in items:
                        list_customers.append({'id':item.id, 'name':item.auth.name, 'email':item.auth.email, 'surname':item.auth.surname, 'paid':item.paid, 'phone':item.auth.phone, 'nif':item.nif, 'credit_wod':item.credit_wod, 'credit_box':item.credit_box, 'credit_bono':item.credit_bono, 'validated':item.validated, 'credit_wod_tarifa':item.rate.credit_wod, 'credit_box_tarifa':item.rate.credit_box, 'credit_bono_tarifa':item.rate.credit_bono, 'tarifa_vigente':item.rate.name, 'tarifa_vigente_precio':item.rate.price, 'direccion':item.direccion, 'nota_general':item.nota_general, 'nota_especial':item.nota_especial})
                    data=json.dumps({'status': 'success','response':'search_customers','data':{'list':list_customers}})
        except Exception as e:
            data=json.dumps({'status': 'failed', 'response':e.args[0]})
    
    return APIResponse(request,data)


def get(request):
    """
    Gets a customer profile
    """
    if 'auth_id' in request.session:
        if is_role(request.session['auth_id'],'U_Customers'):
            cu=get_user(request.session['auth_id'])
            if cu:
                auth_profile=get_profile(request.session['auth_id'])
                cu_profile={'id':cu.id,
                            'nif':cu.nif, 
                            'birthdate':get_string_from_date(local_date(cu.birthdate,2)), 
                            'credit_wod':cu.credit_wod, 
                            'credit_box':cu.credit_box,
                            'credit_bono':cu.credit_bono,
                            'paid':cu.paid, 
                            'vip':cu.vip, 
                            'validated':cu.validated, 
                            'test_user':cu.test_user, 
                            'rate_id':cu.rate_id,
                            'credit_box_tarifa':cu.rate.credit_box,
                            'credit_wod_tarifa':cu.rate.credit_wod,
                            'credit_bono_tarifa':cu.rate.credit_bono,
                            'tarifa_vigente':cu.rate.name,
                            'tarifa_vigente_precio':cu.rate.price,
                            'direccion':cu.direccion,
                            'nota_general':cu.nota_general,
                            'nota_especial':cu.nota_especial}
                data=json.dumps({'status':'success','response':'customer_profile','data':{'auth_profile':auth_profile,'customer_profile':cu_profile}})

            else:
                data=json.dumps({'status': 'failed', 'response':'customer_not_found'})
        else:
            data=json.dumps({'status': 'failed', 'response':'not_customer'})
    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

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
                        customer_profile={'id':customer.id, 'nif':customer.nif, 'birthdate':get_string_from_date(local_date(customer.birthdate,2)), 'credit_wod':customer.credit_wod, 'credit_box':customer.credit_box, 'credit_bono':customer.credit_bono, 'paid':customer.paid, 'vip':customer.vip, 'validated':customer.validated, 'test_user':customer.test_user, 'rate_id':customer.rate_id, 'credit_box_tarifa':customer.rate.credit_box, 'credit_wod_tarifa':customer.rate.credit_wod, 'credit_bono_tarifa':customer.rate.credit_bono, 'tarifa_vigente':customer.rate.name, 'tarifa_vigente_precio':customer.rate.price, 'direccion':customer.direccion, 'nota_general':customer.nota_general, 'nota_especial':customer.nota_especial}
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


def edit_foreign(request):
    """
    Edits a passenger profile
    """
    if 'auth_id' not in request.session:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    if not have_permission(request.session['auth_id'],'edit_foreign_customer'):
        data=json.dumps({'status': 'failed', 'response':'unauthorized_edit_foreign_customer'})

    if not validate_parameter(request.GET,'id'):
        data=json.dumps({'status': 'failed', 'response':'id_missed'})
    else:
        try:
            customer=U_Customers.objects.get(id=request.GET['id'])
            result_auth=edit_auth(customer.auth_id,request.GET)
            rate=Rates.objects.get(id=request.GET['rate_id'])
            result_customer=edit_customer(customer.auth_id,request.GET,rate)
            if result_auth['status']=='success':
                data=json.dumps({'status':'success','response':'auth_modified'})
            else:
                if result_customer['status']=='success':
                    data=json.dumps({'status':'success','response':'customer_modified'})
                else:
                    data=json.dumps({'status':'failed','response':result_customer['response']})
        except Exception, e:
            data=json.dumps({'status': 'failed', 'response':e.args[0]})

    return APIResponse(request,data)


def edit_client(request):
    """
    Edits a profile
    """
    if 'auth_id' not in request.session:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    if not have_permission(request.session['auth_id'],'edit_client'):
        data=json.dumps({'status': 'failed', 'response':'unauthorized_edit_client'})
    user,auth = get_user_and_auth(request.session['auth_id'])
    try:
        result_auth=edit_auth(user.auth_id,request.GET)
        result_customer=edit_customer_b(user.auth_id,request.GET)
        if result_auth['status']=='success':
            data=json.dumps({'status':'success','response':'auth_modified'})
        else:
            if result_customer['status']=='success':
                data=json.dumps({'status':'success','response':'customer_modified'})
            else:
                data=json.dumps({'status':'failed','response':result_customer['response']})
    except Exception, e:
        data=json.dumps({'status': 'failed', 'response':e.args[0]})

    return APIResponse(request,data)



def delete(request):
    """
    Deletes a customer and all related info
    """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'delete_customer'):
            if validate_parameter(request.GET,'id'):
                try:
                    customer=U_Customers.objects.get(id=request.GET['id'])
                    result=delete_auth(customer.auth.id)
                    data=json.dumps(result)

                except:
                    data=json.dumps({'status': 'failed', 'response':'customer_not_found'})
            else:
                data=json.dumps({'status': 'failed', 'response':'id_missed'})
        else:
            data=json.dumps({'status':'failed','response':'unauthorized_delete_customer'})
    else:
        data=json.dumps({'status':'failed','response':'not_logged'})

    return APIResponse(request,data)


def pagar(request):
    """
    PAGA.
    """
    if 'auth_id' not in request.session:
        data=json.dumps({'status':'failed','response':'not_logged'})
    if not have_permission(request.session['auth_id'],'pagar_super'):
        data=json.dumps({'status':'failed','response':'unauthorized_pagar_super'})
    else:
        try:
            if not validate_parameter(request.GET,'id'):
                raise Exception('id_missed')
            customer=U_Customers.objects.get(id=request.GET['id'])
            customer.paid=True
            customer.validated=True
            auth=customer.auth
            auth.active=True
            auth.save()
            customer.save()  
            data=json.dumps({'status':'success','response':'customer_paid'})
        except Exception as e:
            data = json.dumps({
                'status':'failed',
                'response': e.args[0]
            })

    return APIResponse(request,data)


def revertir_pago(request):
    """
    NO PAGA.
    """
    if 'auth_id' not in request.session:
        data=json.dumps({'status':'failed','response':'not_logged'})
    if not have_permission(request.session['auth_id'],'pagar_super'):
        data=json.dumps({'status':'failed','response':'unauthorized_pagar_super'})
    else:
        try:
            if not validate_parameter(request.GET,'id'):
                raise Exception('id_missed')
            customer=U_Customers.objects.get(id=request.GET['id'])
            customer.paid=False
            customer.save()  
            data=json.dumps({'status':'success','response':'customer_not_paid'})
        except Exception as e:
            data = json.dumps({
                'status':'failed',
                'response': e.args[0]
            })

    return APIResponse(request,data)