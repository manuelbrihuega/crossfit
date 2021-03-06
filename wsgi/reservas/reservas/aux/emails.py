# -*- coding: utf-8 -*-

from django.template.loader import render_to_string
from django.template import RequestContext, loader
from django.core.mail import EmailMultiAlternatives
from reservas.models import *
from reservas.aux.auth import *

# MAIN METHOD
def send_email(content,subject,emails,title, sender=None):
    rendered = render_to_string("email.html", {'subject':subject,'content':content,'title':title})
    thesender=sender if sender!=None else 'CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>'
    msg = EmailMultiAlternatives(subject, '', thesender, emails)
    msg.attach_alternative(rendered, "text/html")
    msg.send()
    print 'OK'
    

def send_email_restorepass(url,email):
    """Send an email to restore the pass"""
    content = render_to_string("emails/restorepass.html", {'url':url})
    send_email(content,'Cambio de contraseña', [email],'CAMBIO DE CONTRASEÑA','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')


def send_email_banned_user(email,name):
    """Send an email to announce an user has been banned"""
    content = render_to_string("emails/userbanned_es.html", {'name':name})
    send_email(content,'Usuario baneado', [email],'USUARIO BANEADO','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')


def send_email_ticket_message(email,title,text):
    """Send an email to announce there is a new ticket message"""
    content = render_to_string("emails/new_ticket_message.html", {'title':title,'text':text})
    send_email(content,'Respuesta incidencia', [email],'RESPUESTA INCIDENCIA','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')

def send_email_new_comunication(email,title,text):
    """Send an email to announce there is a new ticket message"""
    content = render_to_string("emails/new_comunication.html", {'title':title,'text':text})
    send_email(content,'Nuevo mensaje de Crossfit', [email],'Nuevo mensaje de Crossfit','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')

def send_email_ticket_message_supporter(email,title,text,user):
    """Send an email to announce there is a new ticket message"""
    content = render_to_string("emails/new_ticket_message_supporter.html", {'title':title,'text':text, 'user':user})
    conf=Configuration.objects.get(id=1)
    send_email(content,'Nueva incidencia', [conf.email],'NUEVA INCIDENCIA','CrossFit Jerez WEBAPP <crossfitjerezdelafrontera@gmail.com>')
       

def send_email_new_customer_for_super(auth_id, auth_id_dos):
    """Send an email when a customer is created"""
    from reservas.models import *
    try:
        au=Configuration.objects.get(id=1)
        auth=Auth.objects.get(id=auth_id_dos)
        content = render_to_string("emails/new_driver_for_super.html",
                                   {'name':auth.name + auth.surname})
        send_email(content,'Se ha registrado un nuevo cliente', [au.email],'Se ha registrado un nuevo cliente ','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')
    except:
        pass


def send_email_new_customer(customer_id):
    """Send an email when a customer is created"""
    from reservas.models import U_Customers
    try:
        customer=U_Customers.objects.get(id=customer_id)
        content = render_to_string("emails/new_driver.html",
                                   {'name':customer.auth.name,
                                    'token':customer.auth.token,
                                  'tarifa':customer.rate.name})
        send_email(content,'Bienvenido al sistema de reservas CrossFit Jerez', [customer.auth.email],'Bienvenido al sistema de reservas CrossFit Jerez ','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')
    except:
        pass

def send_email_customer_deactivated(id_cus):
    """Send an email when a customer is unvalidated"""
    from reservas.models import U_Customers
    try:
        cus=U_Customers.objects.get(id=id_cus)
        content = render_to_string("emails/customer_deactivated.html",
                                   {'name':cus.auth.name})
        send_email(content,'Has sido dado de baja', [cus.auth.email],'Baja en el sistema','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')
    except:
        pass

def send_email_customer_activated(id_cus):
    """Send an email when a customer is validated"""
    from reservas.models import U_Customers
    try:
        cus=U_Customers.objects.get(id=id_cus)
        content = render_to_string("emails/customer_activated.html",
                                   {'name':cus.auth.name})
        send_email(content,'Suscripción Validada!', [cus.auth.email],'Alta en el sistema','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')
    except:
        pass


def send_email_new_reservation(cus_id, res_id):
    """Send an email when a reservation is created"""
    from reservas.models import *
    try:
        res=Reservations.objects.get(id=res_id)
        cus=U_Customers.objects.get(id=cus_id)
        conf=Configuration.objects.get(id=1)
        cadminutos = ''
        if res.schedule_time.minutes_post > 99:
          cadminutos = str(res.schedule_time.minutes_post/60) + ' horas'
        else:
          cadminutos = str(res.schedule_time.minutes_post) + ' minutos'
        content = render_to_string("emails/new_reservation.html",
                                   {'name':cus.auth.name,
                                   'actividad':res.schedule_time.schedule.activity.name,
                                   'fecha': str(res.schedule_time.schedule.date.day)+'-'+str(res.schedule_time.schedule.date.month)+'-'+str(res.schedule_time.schedule.date.year),
                                   'horario': get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[1],
                                   'minutos': str(cadminutos)})
        send_email(content,'Nueva reserva realizada', [cus.auth.email],'Nueva reserva','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')
    except:
        pass

def send_email_new_reservation_cola(cus_id, res_id):
    """Send an email when a reservation is created"""
    from reservas.models import *
    try:
        res=Reservations.objects.get(id=res_id)
        cus=U_Customers.objects.get(id=cus_id)
        conf=Configuration.objects.get(id=1)
        cadminutos = ''
        if res.schedule_time.minutes_post > 99:
          cadminutos = str(res.schedule_time.minutes_post/60) + ' horas'
        else:
          cadminutos = str(res.schedule_time.minutes_post) + ' minutos'
        content = render_to_string("emails/new_reservation_cola.html",
                                   {'name':cus.auth.name,
                                   'actividad':res.schedule_time.schedule.activity.name,
                                   'fecha': str(res.schedule_time.schedule.date.day)+'-'+str(res.schedule_time.schedule.date.month)+'-'+str(res.schedule_time.schedule.date.year),
                                   'horario': get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[1],
                                   'minutos': str(cadminutos)})
        send_email(content,'Nueva reserva realizada', [cus.auth.email],'Nueva reserva','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')
    except:
        pass

def send_email_cancel_reservation_cola(cus_id, res_id):
    """Send an email when a reservation is created"""
    from reservas.models import *
    try:
        res=Reservations.objects.get(id=res_id)
        cus=U_Customers.objects.get(id=cus_id)
        conf=Configuration.objects.get(id=1)
        cadminutos = ''
        if res.schedule_time.minutes_post > 99:
          cadminutos = str(res.schedule_time.minutes_post/60) + ' horas'
        else:
          cadminutos = str(res.schedule_time.minutes_post) + ' minutos'
        content = render_to_string("emails/cancel_reservation_cola.html",
                                   {'name':cus.auth.name,
                                   'actividad':res.schedule_time.schedule.activity.name,
                                   'fecha': str(res.schedule_time.schedule.date.day)+'-'+str(res.schedule_time.schedule.date.month)+'-'+str(res.schedule_time.schedule.date.year),
                                   'horario':get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[1],
                                   'minutos': str(cadminutos)})
        send_email(content,'Reserva en cola cancelada', [cus.auth.email],'Reserva cancelada','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')
    except:
        pass

def send_email_cancel_reservation_cola_fin(auth_id, res_id):
    """Send an email when a reservation is created"""
    from reservas.models import *
    try:
        res=Reservations.objects.get(id=res_id)
        auth=Auth.objects.get(id=auth_id)
        conf=Configuration.objects.get(id=1)
        cadminutos = ''
        if res.schedule_time.minutes_post > 99:
          cadminutos = str(res.schedule_time.minutes_post/60) + ' horas'
        else:
          cadminutos = str(res.schedule_time.minutes_post) + ' minutos'
        content = render_to_string("emails/cancel_reservation_cola_fin.html",
                                   {'name':auth.name,
                                   'actividad':res.schedule_time.schedule.activity.name,
                                   'fecha': str(res.schedule_time.schedule.date.day)+'-'+str(res.schedule_time.schedule.date.month)+'-'+str(res.schedule_time.schedule.date.year),
                                   'horario': get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[1],
                                   'minutos': str(cadminutos)})
        send_email(content,'Reserva en cola cancelada', [auth.email],'Reserva cancelada','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')
    except:
        pass

def send_email_confirm_reservation(auth_id, res_id):
    """Send an email when a reservation is created"""
    from reservas.models import *
    try:
        res=Reservations.objects.get(id=res_id)
        auth=Auth.objects.get(id=auth_id)
        conf=Configuration.objects.get(id=1)
        cadminutos = ''
        if res.schedule_time.minutes_post > 99:
          cadminutos = str(res.schedule_time.minutes_post/60) + ' horas'
        else:
          cadminutos = str(res.schedule_time.minutes_post) + ' minutos'
        content = render_to_string("emails/confirm_reservation.html",
                                   {'name':auth.name,
                                   'horaempiezo': get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1],
                                   'actividad':res.schedule_time.schedule.activity.name,
                                   'fecha': str(res.schedule_time.schedule.date.day)+'-'+str(res.schedule_time.schedule.date.month)+'-'+str(res.schedule_time.schedule.date.year),
                                   'horario': get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[1],
                                   'minutos': str(cadminutos)})
        send_email(content,'Reserva confirmada', [auth.email],'Reserva confirmada','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')
    except:
        pass


def send_email_cambiocolaareserva_reservation(auth_id, res_id):
    """Send an email when a reservation is created"""
    from reservas.models import *
    try:
        res=Reservations.objects.get(id=res_id)
        auth=Auth.objects.get(id=auth_id)
        conf=Configuration.objects.get(id=1)
        cadminutos = ''
        if res.schedule_time.minutes_post > 99:
          cadminutos = str(res.schedule_time.minutes_post/60) + ' horas'
        else:
          cadminutos = str(res.schedule_time.minutes_post) + ' minutos'
        content = render_to_string("emails/confirm_cambio.html",
                                   {'name':auth.name,
                                   'horaempiezo': get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1],
                                   'actividad':res.schedule_time.schedule.activity.name,
                                   'fecha': str(res.schedule_time.schedule.date.day)+'-'+str(res.schedule_time.schedule.date.month)+'-'+str(res.schedule_time.schedule.date.year),
                                   'horario': get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[1],
                                   'minutos': str(cadminutos)})
        send_email(content,'Reserva realizada', [auth.email],'Reserva realizada','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')
    except:
        pass

def send_email_cancel_reservation(auth_id, res_id):
    """Send an email when a reservation is created"""
    from reservas.models import *
    try:
        res=Reservations.objects.get(id=res_id)
        auth=Auth.objects.get(id=auth_id)
        conf=Configuration.objects.get(id=1)
        cadminutos = ''
        if res.schedule_time.minutes_post > 99:
          cadminutos = str(res.schedule_time.minutes_post/60) + ' horas'
        else:
          cadminutos = str(res.schedule_time.minutes_post) + ' minutos'
        content = render_to_string("emails/cancel_reservation.html",
                                   {'name':auth.name,
                                   'actividad':res.schedule_time.schedule.activity.name,
                                   'fecha': str(res.schedule_time.schedule.date.day)+'-'+str(res.schedule_time.schedule.date.month)+'-'+str(res.schedule_time.schedule.date.year),
                                   'horario': get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[1],
                                   'minutos': str(cadminutos)})
        send_email(content,'Reserva cancelada', [auth.email],'Reserva cancelada','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')
    except:
        pass

def send_email_cancel_reservation_minimo(auth_id, res_id):
    """Send an email when a reservation is created"""
    from reservas.models import *
    try:
        res=Reservations.objects.get(id=res_id)
        auth=Auth.objects.get(id=auth_id)
        conf=Configuration.objects.get(id=1)
        cadminutos = ''
        if res.schedule_time.minutes_post > 99:
          cadminutos = str(res.schedule_time.minutes_post/60) + ' horas'
        else:
          cadminutos = str(res.schedule_time.minutes_post) + ' minutos'
        content = render_to_string("emails/cancel_reservation_minimo.html",
                                   {'name':auth.name,
                                   'actividad':res.schedule_time.schedule.activity.name,
                                   'fecha': str(res.schedule_time.schedule.date.day)+'-'+str(res.schedule_time.schedule.date.month)+'-'+str(res.schedule_time.schedule.date.year),
                                   'horario': get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[1],
                                   'minutos': str(cadminutos)})
        send_email(content,'Reserva cancelada', [auth.email],'Reserva cancelada','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')
    except:
        pass


def send_email_cancel_reservation_minimo_super(sch_id):
    """Send an email when a reservation is created"""
    from reservas.models import *
    try:
        conf=Configuration.objects.get(id=1)
        sch=Schedules_times.objects.get(id=sch_id)
        cadminutos = ''
        if sch.minutes_post > 99:
          cadminutos = str(sch.minutes_post/60) + ' horas'
        else:
          cadminutos = str(sch.minutes_post) + ' minutos'
        content = render_to_string("emails/cancel_reservation_minimo_super.html",
                                   {'actividad':sch.schedule.activity.name,
                                   'fecha': str(sch.schedule.date.day)+'-'+str(sch.schedule.date.month)+'-'+str(sch.schedule.date.year),
                                   'horario': get_string_from_date(sch.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(sch.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(sch.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(sch.time_end).split(' ')[1].split(':')[1],
                                   'minutos': str(cadminutos)})
        conf=Configuration.objects.get(id=1)
        send_email(content,'Actividad cancelada', [conf.email],'Actividad cancelada','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')
    except:
        pass

def send_email_confirm_class_super(sch_id, asistentes, numplazasdos):
    from reservas.models import *
    try:
        conf=Configuration.objects.get(id=1)
        sch=Schedules_times.objects.get(id=sch_id)
        cadminutos = ''
        if sch.minutes_post > 99:
          cadminutos = str(sch.minutes_post/60) + ' horas'
        else:
          cadminutos = str(sch.minutes_post) + ' minutos'
        cad=asistentes.split(',')
        finalcad=''
        for ass in cad:
          if ass!='':
            finalcad= finalcad + '- '+ ass +'\n\n' 
        content = render_to_string("emails/confirm_class_super.html",
                                   {'actividad':sch.schedule.activity.name,
                                   'fecha': str(sch.schedule.date.day)+'-'+str(sch.schedule.date.month)+'-'+str(sch.schedule.date.year),
                                   'horario': get_string_from_date(sch.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(sch.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(sch.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(sch.time_end).split(' ')[1].split(':')[1],
                                   'minutos': str(cadminutos),
                                   'asistentes': finalcad,
                                   'numeroasis':numplazasdos})
        conf=Configuration.objects.get(id=1)
        send_email(content,'Actividad confirmada', [conf.email],'Actividad confirmada','CrossFit Jerez TEAM <crossfitjerezdelafrontera@gmail.com>')
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