# -*- coding: utf-8 -*-

from django.http import HttpResponse
from django.db.models import Q
import json
from django.db import transaction

from reservas.models import *

#from api.aux.permissions import *
from reservas.aux.customers import *
from reservas.aux.general import *
from reservas.aux.strings import *
from reservas.aux.auth import *
#from api.aux.radios import *

@transaction.atomic
def add(request):
    """
    Creates a customer.
    """
    try:
        params=['birthdate','nif','name','surname','password','email','movil','rate_id']
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
