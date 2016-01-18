# -*- coding: utf-8 -*-

from django.template.loader import render_to_string
from django.template import RequestContext, loader
from django.core.mail import EmailMultiAlternatives
from reservas.models import *
from reservas.aux.auth import *
from reservas.aux.journeys import *

# MAIN METHOD
def send_email(content,subject,emails,title, sender=None):
    rendered = render_to_string("email.html", {'subject':subject,'content':content,'title':title})
    thesender=sender if sender!=None else 'Taxible Support <soporte@taxible.com>'
    msg = EmailMultiAlternatives(subject, '', thesender, emails)
    msg.attach_alternative(rendered, "text/html")
    msg.send()
    print 'OK'
    
    
# ALL SHIPMENTS EMAILS
def send_email_invoice(invoice_id, email):
    """Send an email with invoice"""
    invoice = Invoices.objects.get(id=invoice_id)
    months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    month = months[invoice.month-1]
    year = invoice.year
    url = "http://api.taxible.com/invoices/"+str(invoice.id)+str(invoice)+".pdf"
    content = render_to_string("emails/send_invoice.html", {'url':url, 'month':month, 'year':year})
    if email == '':
        send_email('La factura '+url+' no se ha enviado correctamente ya que el email de destino no existe.','Factura '+str(month)+' '+str(year)+' NO ENVIADA', ['soporte@taxible.com'],'Factura '+str(month)+' '+str(year)+' NO ENVIADA','Taxible Administration <admon@taxibleapp.com>')
    else:
        send_email(content,'Factura '+str(month)+' '+str(year), [email],'Factura '+str(month)+' '+str(year),'Taxible Administration <admon@taxibleapp.com>')
    

def send_email_autoinvoice(autoinvoice_id, email):
    """Send an email with invoice"""
    autoinvoice = Autoinvoices.objects.get(id=autoinvoice_id)
    months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    month = months[autoinvoice.month-1]
    year = autoinvoice.year
    url = "http://api.taxible.com/invoices/"+str(autoinvoice.id)+str(autoinvoice)+".pdf"
    content = render_to_string("emails/send_autoinvoice.html", {'url':url, 'month':month, 'year':year})
    if email == '':
        send_email('La autofactura '+url+' no se ha enviado correctamente ya que el email de destino no existe.','Autofactura '+str(month)+' '+str(year)+' NO ENVIADA', ['soporte@taxible.com'],'Autofactura '+str(month)+' '+str(year)+' NO ENVIADA','Taxible Administration <admon@taxibleapp.com>')
    else:
        send_email(content,'Factura '+str(month)+' '+str(year), [email],'Factura '+str(month)+' '+str(year),'Taxible Administration <admon@taxibleapp.com>')
    

def send_email_restorepass(url,email):
    """Send an email to restore the pass"""
    content = render_to_string("emails/restorepass.html", {'url':url})
    send_email(content,'Cambio de contraseña', [email],'CAMBIO DE CONTRASEÑA','Taxible Support <soporte@taxible.com>')

def send_email_daily_report():
    """Send an email with daily report"""
    try:
        new_users_data = info_new_users_today()
        journeys_data = daily_report()
        services = journeys_data['data']
        content = render_to_string("emails/daily_report.html", {'new_users': new_users_data['data'], 'radios': services['services'], 'total_completed': services['total_completed'], 'total_canceled':services['total_canceled']})
        send_email(content,'Informe diario de Taxible.com', ['soporte@taxible.com', 'info@taxible.com'],'INFORME DIARIO DE TAXIBLE.COM','Taxible Community <hola@taxible.com>')
    except:
        pass

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
    
def send_email_not_served_journey(journey_id):
    """Send an email to announce there is not served journey"""
    from api.models import Journeys
    try:
        journey = Journeys.objects.get(id=journey_id)
        radio = journey.location.radio.name
        name = journey.auth.name+' '+journey.auth.surname+' ('+journey.auth.phone+' | '+journey.auth.email+')'
        origin = journey.origin
        content = render_to_string("emails/not_served_journey.html", {'radio':radio, 'name': name, 'origin': origin })
        send_email(content,'Carrera no servida', ['soporte@taxible.com', 'info@taxible.com'],'CARRERA NO SERVIDA','Taxible Support <soporte@taxible.com>')
    except:
        pass

def send_email_cancel_reserved_journey(journey_id, motivation):
    """Send an email to announce cancelation reserved by radio"""
    from api.models import Journeys
    try:
        journey = Journeys.objects.get(id=journey_id)
        radio = journey.location.radio.name
        name = journey.auth.name+' '+journey.auth.surname+' ('+journey.auth.phone+' | '+journey.auth.email+')'
        origin = journey.origin
        content = render_to_string("emails/cancel_reserved_journey.html", {'radio':radio, 'name': name, 'origin': origin, 'motivation':motivation })
        send_email(content,'Reserva cancelada', ['soporte@taxible.com', 'info@taxible.com'],'RESERVA CANCELADA','Taxible Support <soporte@taxible.com>')
    except:
        pass

def send_email_corporate_code_passenger(passenger_id, country_code):
    """Send an email with corporate code"""
    from api.models import U_Passengers
    try:
        passenger=U_Passengers.objects.get(id=passenger_id)
        email = get_email_passengers(country_code)
        name = passenger.auth.name if passenger.auth.name else ''
        content = render_to_string("emails/corporate_code_passenger.html",{'corporate_code':passenger.corporate_code})
        send_email(content,'Código corporativo', [passenger.auth.email],'Hola '+name,'Taxible <'+email+'>')
    except:
        pass
    
def send_email_new_passenger(passenger_id, country_code):
    """Send an email when a passenger is created"""
    from api.models import U_Passengers
    try:
        passenger=U_Passengers.objects.get(id=passenger_id)
        email = get_email_passengers(country_code)
        name = passenger.auth.name if passenger.auth.name else ''
        content = render_to_string("emails/new_passenger.html",{'email':email})
        send_email(content,'Bienvenido', [passenger.auth.email],'Hola '+name,'Taxible <'+email+'>')
    except:
        pass

def send_email_new_employee(passenger_id, country_code, passwd, emailuser):
    """Send an email when a employee is created"""
    from api.models import U_Passengers
    try:
        passenger=U_Passengers.objects.get(id=passenger_id)
        email = get_email_passengers(country_code)
        name = passenger.auth.name if passenger.auth.name else ''
        content = render_to_string("emails/new_employee.html",{'email':email, 'pass':passwd, 'emailuser':emailuser})
        send_email(content,'Bienvenido', [passenger.auth.email],'Hola '+name,'Taxible <'+email+'>')
    except:
        pass

def send_email_new_change_employee(passenger_id, country_code, emailuser):
    """Send an email when a employee is created"""
    from api.models import U_Passengers
    try:
        passenger=U_Passengers.objects.get(id=passenger_id)
        email = get_email_passengers(country_code)
        name = passenger.auth.name if passenger.auth.name else ''
        content = render_to_string("emails/new_change_employee.html",{'email':email, 'emailuser':emailuser})
        send_email(content,'Bienvenido', [passenger.auth.email],'Hola '+name,'Taxible <'+email+'>')
    except:
        pass


def send_email_new_driver(driver_id):
    """Send an email when a driver is created"""
    from api.models import U_Drivers
    try:
        driver=U_Drivers.objects.get(id=driver_id)
        content = render_to_string("emails/new_driver.html",
                                   {'name':driver.auth.name,
                                    'token':driver.auth.token,
                                  'radio':driver.licence.owner.radio.city if driver.licence.owner.radio else driver.licence.owner.locality})
        send_email(content,'Estás a un paso de formar parte de Taxible', [driver.auth.email],'¡Estás a un paso de formar parte de Taxible! ','Taxible Taxistas <taxistas@taxible.com>')
    except:
        pass

def send_email_new_driver_info(driver_id):
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
        pass