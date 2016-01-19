from reservas.models import *

from reservas.aux.general import *
from reservas.aux.strings import *

def create_customer(data,auth):
    try:
        customer=U_Customers()
        customer.auth=auth
        customer.rate=rate
        customer.paid=False
        customer.vip=False
        customer.test_user=False
        customer.validated=False
        if validate_parameter(data,'credit_wod'):
            customer.credit_wod=data["credit_wod"]
        if validate_parameter(data,'credit_box'):
            customer.credit_box=data["credit_box"]
        if validate_parameter(data,'birthdate'):
            customer.birthdate=data["birthdate"]
        if validate_parameter(data,'nif'):
            customer.nif=data["nif"]
        customer.save()

        return {'status':'success','response':driver}

    except:
        return {'status':'failed','response':'driver_not_created'}