from reservas.models import *

from reservas.aux.general import *
from reservas.aux.strings import *
from reservas.aux.auth import *
from django.db.models import Q

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
            dnies = Dnis.objects.filter(Q(nif=customer.nif))
            for d in dnies:
                customer.validated = True
                customer.auth.active = True
                customer.auth.save()
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
        customer.credit_bono=rate.credit_bono
        customer.paid=getBoolValue(data["paid"])
        customer.vip=getBoolValue(data["vip"])
        customer.test_user=getBoolValue(data["prueba"])
        customer.validated=getBoolValue(data["validated"])
        customer.birthdate=data["birthdate"]
        customer.direccion=data["direccion"]
        customer.nota_general=data["nota_general"]
        customer.nota_especial=data["nota_especial"]
        customer.nif=data["nif"]
        customer.save()

        return {'status':'success','response':customer}

    except Exception as e:
        return {'status':'failed','response':e.args[0]}


def edit_customer(auth_id,data,rate):
    customer=get_user(auth_id)
    auth=Auth.objects.get(id=auth_id)
    found = False
    changed = False
    if customer:
        if validate_parameter(data,'credit_wod'):
            found=True
            if customer.credit_wod!=data['credit_wod']:
                changed=True
                customer.credit_wod=data['credit_wod']
        if validate_parameter(data,'credit_box'):
            found=True
            if customer.credit_box!=data['credit_box']:
                changed=True
                customer.credit_box=data['credit_box']
        if validate_parameter(data,'credit_bono'):
            found=True
            if customer.credit_bono!=data['credit_bono']:
                changed=True
                customer.credit_bono=data['credit_bono']
        if validate_parameter(data,'birthdate'):
            found=True
            if customer.birthdate!=data['birthdate']:
                changed=True
                customer.birthdate=data['birthdate']
        if validate_parameter(data,'nif'):
            found=True
            if customer.nif!=data['nif']:
                changed=True
                customer.nif=data['nif']
        if validate_parameter(data,'nota_general'):
            if customer.nota_general!=data['nota_general']:
                changed=True
                customer.nota_general=data['nota_general']
        if validate_parameter(data,'direccion'):
            if customer.direccion!=data['direccion']:
                changed=True
                customer.direccion=data['direccion']
        if validate_parameter(data,'nota_especial'):
            if customer.nota_especial!=data['nota_especial']:
                changed=True
                customer.nota_especial=data['nota_especial']
        if not found:
            return {'status':'failed','response':'parameter_not_found'}

        elif not changed:
            return {'status':'failed','response':'nothing_changed'}

        else:
            customer.paid=getBoolValue(data['paid'])
            customer.vip=getBoolValue(data['vip'])
            customer.test_user=getBoolValue(data['test_user'])
            customer.rate = rate
            customer.save()
            return {'status':'success','response':'changed'}

    else:
        return {'status':'failed','response':'not_customer'}


def edit_customer_b(auth_id,data):
    customer=get_user(auth_id)
    auth=Auth.objects.get(id=auth_id)
    found = False
    changed = False
    if customer:
        if validate_parameter(data,'birthdate'):
            found=True
            if customer.birthdate!=data['birthdate']:
                changed=True
                customer.birthdate=data['birthdate']
        if validate_parameter(data,'nif'):
            found=True
            if customer.nif!=data['nif']:
                changed=True
                customer.nif=data['nif']
        if validate_parameter(data,'direccion'):
            if customer.direccion!=data['direccion']:
                changed=True
                customer.direccion=data['direccion']
        if not found:
            return {'status':'failed','response':'parameter_not_found'}

        elif not changed:
            return {'status':'failed','response':'nothing_changed'}

        else:
            customer.save()
            return {'status':'success','response':'changed'}

    else:
        return {'status':'failed','response':'not_customer'}