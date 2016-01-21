from reservas.models import *

from reservas.aux.general import *
from reservas.aux.strings import *

def create_customer(data,auth,rate):
    try:
        customer=U_Customers()
        customer.auth=auth
        customer.rate=rate
        customer.credit_wod=rate.credit_wod
        customer.credit_box=rate.credit_box
        customer.paid=False
        customer.vip=False
        customer.test_user=False
        customer.validated=False
        if validate_parameter(data,'birthdate'):
            customer.birthdate=data["birthdate"]
        if validate_parameter(data,'nif'):
            customer.nif=data["nif"]
        customer.save()

        return {'status':'success','response':customer}

    except Exception as e:
        return {'status':'failed','response':e.args[0]}


def create_customer_super(data,auth,rate):
    try:
        customer=U_Customers()
        customer.auth=auth
        customer.rate=rate
        customer.credit_wod=rate.credit_wod
        customer.credit_box=rate.credit_box
        if validate_parameter(data,'paid'):
            customer.paid=getBoolValue(data["paid"])
        if validate_parameter(data,'vip'):
            customer.vip=getBoolValue(data["vip"])
        if validate_parameter(data,'prueba'):
            customer.test_user=getBoolValue(data["prueba"])
        if validate_parameter(data,'validated'):
            customer.validated=getBoolValue(data["validated"])
        if validate_parameter(data,'birthdate'):
            customer.birthdate=getBoolValue(data["birthdate"])
        if validate_parameter(data,'nif'):
            customer.nif=getBoolValue(data["nif"])
        customer.save()

        return {'status':'success','response':customer}

    except Exception as e:
        return {'status':'failed','response':e.args[0]}