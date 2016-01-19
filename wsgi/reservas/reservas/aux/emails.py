# -*- coding: utf-8 -*-

from django.template.loader import render_to_string
from django.template import RequestContext, loader
from django.core.mail import EmailMultiAlternatives
from reservas.models import *
from reservas.aux.auth import *

# MAIN METHOD
def send_email(content,subject,emails,title, sender=None):
    rendered = render_to_string("email.html", {'subject':subject,'content':content,'title':title})
    thesender=sender if sender!=None else 'Taxible Support <soporte@taxible.com>'
    msg = EmailMultiAlternatives(subject, '', thesender, emails)
    msg.attach_alternative(rendered, "text/html")
    msg.send()
    print 'OK'
    

def send_email_restorepass(url,email):
    """Send an email to restore the pass"""
    content = render_to_string("emails/restorepass.html", {'url':url})
    send_email(content,'Cambio de contraseña', [email],'CAMBIO DE CONTRASEÑA','Taxible Support <soporte@taxible.com>')


def send_email_banned_user(email,name):
    """Send an email to announce an user has been banned"""
    content = render_to_string("emails/userbanned_es.html", {'name':name})
    send_email(content,'Usuario baneado', [email],'USUARIO BANEADO','Taxible Support <soporte@taxible.com>')


def send_email_ticket_message(email,title,text):
    """Send an email to announce there is a new ticket message"""
    content = render_to_string("emails/new_ticket_message.html", {'title':title,'text':text})
    send_email(content,'Respuesta incidencia', [email],'RESPUESTA INCIDENCIA','Taxible Support <soporte@taxible.com>')

def send_email_ticket_message_supporter(email,title,text,user):
    """Send an email to announce there is a new ticket message"""
    content = render_to_string("emails/new_ticket_message_supporter.html", {'title':title,'text':text, 'user':user})
    send_email(content,'Nueva incidencia', [email],'NUEVA INCIDENCIA','Taxible Support <soporte@taxible.com>')
    
def send_email_tradicional_radio_disconnected(radio_name):
    """Send an email to announce there is a tradicional radio desconnected"""
    content = render_to_string("emails/radio_desconnected.html", {'radio_name':radio_name})
    send_email(content,'Radio desconectada', ['soporte@taxible.com', 'info@taxible.com'],'RADIO DESCONECTADA','Taxible Support <soporte@taxible.com>')
    

def send_email_new_customer(customer_id):
    """Send an email when a customer is created"""
    from reservas.models import U_Customers
    try:
        customer=U_Customers.objects.get(id=customer_id)
        content = render_to_string("emails/new_driver.html",
                                   {'name':customer.auth.name,
                                    'token':customer.auth.token,
                                  'tarifa':customer.rate.name})
        send_email(content,'Bienvenido al sistema de reservas CrossFit Jerez', [customer.auth.email],'Bienvenido al sistema de reservas CrossFit Jerez ','CrossFit Jerez TEAM <crossfitjerez@hotmail.com>')
    except:
        pass

'''def send_email_new_driver_info(driver_id):
    """Send an email when a driver is created"""
    from api.models import U_Drivers
    try:
        driver=U_Drivers.objects.get(id=driver_id)
        content = render_to_string("emails/new_driver_info.html",
                                   {'name':driver.auth.name,
                                    'licence':driver.licence.num_licence,
                                  'radio':driver.licence.owner.radio.city if driver.licence.owner.radio else ''})
        email=get_email_drivers(driver.licence.owner.radio)
        send_email(content,'Nueva alta de Taxista', [email] ,'Nueva alta de taxista ','Taxible Taxistas <taxistas@taxible.com>')
    except:
        pass

def send_email_new_driver_new_radio(driver_id):
    """Send an email when a driver is created"""
    from api.models import U_Drivers
    try:
        driver=U_Drivers.objects.get(id=driver_id)
        content = render_to_string("emails/new_driver_new_radio.html",
                                   {'name':driver.auth.name,
                                  'radio':driver.licence.owner.locality})
        send_email(content,'Gracias por tu interés', [driver.auth.email],'¡Gracias por tu interés! ','Taxible Taxistas <taxistas@taxible.com>')
    except:
        pass

def send_email_new_touroperator_info(touroperator_id):
    """Send an email when a touroperator is created"""
    from api.models import U_Touroperator
    try:
        touroperator=U_Touroperator.objects.get(id=touroperator_id)
        content = render_to_string("emails/new_touroperator_info.html",
                                   {'name':touroperator.auth.name,
                                    'radio':touroperator.radio.city if touroperator.radio else ''})
        email=get_email_touroperator(touroperator.radio)
        send_email(content,'Nueva alta de Touroperador', [email] ,'Nueva alta de touroperador ','Taxible Touroperadores <soporte@taxible.com>')
    except:
        pass


def send_email_driver_activated(driver_id):
    """Send an email when a driver is validated"""
    from api.models import U_Drivers
    try:
        driver=U_Drivers.objects.get(id=driver_id)
        content = render_to_string("emails/driver_activated.html",
                                   {'name':driver.auth.name})
        send_email(content,'Ya formas parte de Taxible', [driver.auth.email],'¡Ya formas parte de Taxible! ','Taxible Taxistas <taxistas@taxible.com>')
    except:
        pass

def send_email_driver_activation_info(driver_id):
    """Send an email when a driver send a validation document"""
    from api.models import U_Drivers
    try:
        driver=U_Drivers.objects.get(id=driver_id)
        content = render_to_string("emails/driver_activation_info.html",
                                   {'name':driver.auth.name})

        email=get_email_drivers(driver.licence.owner.radio)

        send_email(content,'Activación enviada', [email],'Activación enviado','Taxible Taxistas <taxistas@taxible.com>')
    except:
        pass

def send_email_driver_request_validation(driver_id):
    """Send an email when a driver is created"""
    from api.models import U_Drivers
    try:
        driver=U_Drivers.objects.get(id=driver_id)
        content = render_to_string("emails/driver_request_validation.html",
                                   {'name':driver.auth.name,
                                    'token':driver.auth.token,
                                  'radio':driver.licence.owner.radio.city if driver.licence.owner.radio else driver.licence.owner.locality})
        send_email(content,'Estás a un paso de formar parte de Taxible', [driver.auth.email],'¡Estás a un paso de formar parte de Taxible! ','Taxible Taxistas <taxistas@taxible.com>')
    except:
        pass

def get_email_drivers(radio):
    email='taxistas@taxible.com'
    if radio and radio.delegation and radio.delegation.country_code!='ES':
        email = 'taxistas.'+radio.delegation.country_code+'@taxible.com'
    return email

def get_email_touroperator(radio):
    email='soporte@taxible.com'
    if radio and radio.delegation and radio.delegation.country_code!='ES':
        email = 'soporte@taxible.com'
    return email

def get_email_enterprises(radio):
    email='empresas@taxible.com'
    if radio and radio.delegation and radio.delegation.country_code!='ES':
        email = 'empresas.'+radio.delegation.country_code+'@taxible.com'
    return email

def get_email_passengers(country_code):
    if country_code == 'ES':
        email='hola@taxible.com'
    else:
        email = 'hola.'+country_code+'@taxible.com'
    return email


def send_email_new_enterprise(enterprise_id):
    """Send an email when an enterprise is created"""
    from api.models import Enterprises,U_Buttons
    try:
        enterprise=Enterprises.objects.get(id=enterprise_id)
        buttons = U_Buttons.objects.filter(enterprise=enterprise)
        button = buttons[0]
        content = render_to_string("emails/new_enterprise.html",
                                   {'name':button.auth.name,
                                  'radio':enterprise.position.location.locality if enterprise.position else ''})
        send_email(content,'Taxible ya está a tu servicio', [button.auth.email],'¡Taxible ya está a tu servicio! ','Taxible Empresas <empresas@taxible.com>')
    except:
        pass

def send_email_new_enterprise_info(enterprise_id):
    """Send an email when an enterprise is created"""
    from api.models import Enterprises,U_Buttons
    try:
        enterprise=Enterprises.objects.get(id=enterprise_id)
        buttons = U_Buttons.objects.filter(enterprise=enterprise)
        button = buttons[0]
        content = render_to_string("emails/new_enterprise_info.html",
                                   {'name':button.auth.name,
                                  'radio':enterprise.position.location.locality if enterprise.position else ''})
        if enterprise.position and enterprise.position.location:
            email=get_email_enterprises(enterprise.position.location.radio)
        else:
            email = 'empresas@taxible.com'
        send_email(content,'Nueva alta de Empresa', [email] ,'Nueva alta de empresa ','Taxible Empresas <empresas@taxible.com>')
    except:
        pass

def send_email_new_enterprise_new_radio(enterprise_id):
    """Send an email when an enterprise is created"""
    from api.models import Enterprises,U_Buttons
    try:
        enterprise=Enterprises.objects.get(id=enterprise_id)
        buttons = U_Buttons.objects.filter(enterprise=enterprise)
        button = buttons[0]
        content = render_to_string("emails/new_enterprise_new_radio.html",
                                   {'name':button.auth.name,
                                  'radio':enterprise.position.location.locality if enterprise.position else ''})
        send_email(content,'Gracias por tu interés', [enterprise.auth.email],'¡Gracias por tu interés! ','Taxible Empresas <empresas@taxible.com>')
    except:
        pass'''