# -*- coding: utf-8 -*-

def add_task(date,method):
    from reservas.models import Tasks
    task=Tasks()
    task.date=date
    task.method=method
    task.save()


def revise_tasks():
    """docstring for revise_tasks"""
    from reservas.models import Tasks
    from datetime import datetime
    tasks = Tasks.objects.filter(date__lte=datetime.utcnow())
    for task in tasks:
        try:
            exec task.method
            task.delete()
            print 'EXEC: '+task.method
        except:
            print 'ERROR EXEC: '+task.method

    return True

def revise_reservations():
    from django.db.models import Q
    from reservas.models import *
    from datetime import *
    from reservas.aux.emails import *
    from reservas.aux.general import *
    from reservas.aux.date import *

    hoy=datetime(int(datetime.today().year),int(datetime.today().month),int(datetime.today().day),0,0,0)
    reservas=Reservations.objects.filter(Q(schedule_time__schedule__date__gt=hoy) & Q(cursada=False))
    conf=Configuration.objects.get(id=1)
    for res in reservas:
        fechaparaactividad = datetime(res.schedule_time.schedule.date.year, res.schedule_time.schedule.date.month, res.schedule_time.schedule.date.day, res.schedule_time.time_start.hour, res.schedule_time.time_start.minute, 0)
        fechasepuedecancelar = fechaparaactividad - timedelta(minutes=conf.minutes_pre)
        if datetime.today() >= fechasepuedecancelar:
            if res.queue:
                customer=U_Customers.objects.filter(Q(auth__id=res.auth.id))
                for cus in customer:
                    if not cus.vip:
                        cus.credit_wod = cus.credit_wod + res.schedule_time.schedule.activity.credit_wod
                        cus.credit_box = cus.credit_box + res.schedule_time.schedule.activity.credit_box
                        cus.save()

                name = 'User_Id'+str(res.auth.id)
                nick = 'User_Id'+str(res.auth.id)
                phone = '+34'+str(res.auth.phone)
                message = 'El plazo de reserva para '+str(res.schedule_time.schedule.activity.name)+' el '+str(res.schedule_time.schedule.date.day)+'-'+str(res.schedule_time.schedule.date.month)+'-'+str(res.schedule_time.schedule.date.year)+' de '+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[1]+' ha terminado y NO has conseguido plaza, su posición en la cola será eliminada.'
                add_task(datetime.utcnow(),'send_email_cancel_reservation_cola_fin_task(auth_id="'+str(res.auth.id)+'",res_id="'+str(res.id)+'")')
                add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
                res.delete()
            else:
                schedule_time = res.schedule_time
                rss = Reservations.objects.filter(Q(schedule_time__id=schedule_time.id))
                numplazas = 0
                for rs in rss:
                    numplazas = numplazas + 1
                minimum = res.schedule_time.schedule.activity.min_capacity
                if numplazas >= minimum:
                    #se confirma
                    res.cursada = True
                    res.save()
                    name = 'User_Id'+str(res.auth.id)
                    nick = 'User_Id'+str(res.auth.id)
                    phone = '+34'+str(res.auth.phone)
                    horaini = get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1]
                    message = 'La reserva para '+str(res.schedule_time.schedule.activity.name)+' el '+str(res.schedule_time.schedule.date.day)+'-'+str(res.schedule_time.schedule.date.month)+'-'+str(res.schedule_time.schedule.date.year)+' de '+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[1]+' ha sido CONFIRMADA y ya no puede ser cancelada. Le esperamos a las '+horaini
                    add_task(datetime.utcnow(),'send_email_confirm_reservation_task(auth_id="'+str(res.auth.id)+'",res_id="'+str(res.id)+'")')
                    add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
                else:
                    #se cancela
                    customer=U_Customers.objects.filter(Q(auth__id=res.auth.id))
                    for cus in customer:
                        if not cus.vip:
                            cus.credit_wod = cus.credit_wod + res.schedule_time.schedule.activity.credit_wod
                            cus.credit_box = cus.credit_box + res.schedule_time.schedule.activity.credit_box
                            cus.save()
                    name = 'User_Id'+str(res.auth.id)
                    nick = 'User_Id'+str(res.auth.id)
                    phone = '+34'+str(res.auth.phone)
                    message = 'Su reserva para '+str(res.schedule_time.schedule.activity.name)+' el '+str(res.schedule_time.schedule.date.day)+'-'+str(res.schedule_time.schedule.date.month)+'-'+str(res.schedule_time.schedule.date.year)+' de '+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[1]+' ha sido CANCELADA debido a que la actividad no ha cubierto el cupo mínimo de participantes.'
                    add_task(datetime.utcnow(),'send_email_cancel_reservation_minimo_task(auth_id="'+str(res.auth.id)+'",res_id="'+str(res.id)+'")')
                    add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
                    res.delete()

    schedules_timess=Schedules_times.objects.filter(Q(schedule__date__gt=hoy))
    for sch in schedules_timess:
        if not sch.cursada:
            fechaparaactividaddos = datetime(sch.schedule.date.year, sch.schedule.date.month, sch.schedule.date.day, sch.time_start.hour, sch.time_start.minute, 0)
            fechasepuedecancelardos = fechaparaactividaddos - timedelta(minutes=conf.minutes_pre)
            if datetime.today() >= fechasepuedecancelardos:
                rssdos = Reservations.objects.filter(Q(schedule_time__id=sch.id))
                numplazasdos = 0
                asistentes = ''
                for rsdos in rssdos:
                    numplazasdos = numplazasdos + 1
                    asistentes = asistentes + rsdos.auth.name + ' ' + rsdos.auth.surname + ', '
                minimumdos = sch.schedule.activity.min_capacity
                if numplazasdos < minimumdos:
                    authito = Auth.objects.get(id=1)
                    name = 'User_Id'+str(authito.id)
                    nick = 'User_Id'+str(authito.id)
                    phone = '+34'+str(authito.phone)
                    message = 'La actividad '+str(sch.schedule.activity.name)+' del '+str(sch.schedule.date.day)+'-'+str(sch.schedule.date.month)+'-'+str(sch.schedule.date.year)+' de '+get_string_from_date(sch.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(sch.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(sch.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(sch.time_end).split(' ')[1].split(':')[1]+' ha sido CANCELADA debido a que la actividad no ha cubierto el cupo mínimo de participantes.'
                    add_task(datetime.utcnow(),'send_email_cancel_reservation_minimo_super_task(sch_id="'+str(sch.id)+'")')
                    add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
                    sch.cursada=True
                    sch.save()
                else:
                    authito = Auth.objects.get(id=1)
                    name = 'User_Id'+str(authito.id)
                    nick = 'User_Id'+str(authito.id)
                    phone = '+34'+str(authito.phone)
                    message = 'La actividad '+str(sch.schedule.activity.name)+' del '+str(sch.schedule.date.day)+'-'+str(sch.schedule.date.month)+'-'+str(sch.schedule.date.year)+' de '+get_string_from_date(sch.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(sch.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(sch.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(sch.time_end).split(' ')[1].split(':')[1]+' ha sido CONFIRMADA. Asistirán '+numplazasdos+' personas.'
                    add_task(datetime.utcnow(),'send_email_confirm_class_super_task(sch_id="'+str(sch.id)+'",asistentes="'+asistentes+'",numplazasdos="'+numplazasdos+'")')
                    add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
                    sch.cursada=True
                    sch.save()

                    #aqui estamos avisando al super de que la clase se cancela xq no hay gente
                

def reload_credit_users_task():
    from reservas.models import *
    from datetime import *
    customers=U_Customers.objects.all()
    for cus in customers:
        cus.credit_box=cus.rate.credit_box
        cus.credit_wod=cus.rate.credit_wod
        cus.save()
    hoy=datetime.today()
    dia=1
    if hoy.month == 12:
        mes = 1
        year = hoy.year + 1
    else:
        mes = hoy.month + 1
        year = hoy.year

    proxfecha = datetime(year, mes, dia, 4, 0, 0)
    
    add_task(proxfecha,'reload_credit_users_task()')


##############
#   EMAIL    #
##############

def send_email_new_customer_task(customer_id):
    from reservas.aux.emails import send_email_new_customer
    send_email_new_customer(customer_id)

def send_email_new_customer_info_task(customer_id):
    from reservas.aux.emails import send_email_new_customer_info
    send_email_new_customer_info(customer_id)

def send_email_restorepass_task(url,email):
    from reservas.aux.emails import send_email_restorepass
    send_email_restorepass(url,email)

def send_email_banned_task(name, email):
    from reservas.aux.emails import send_email_banned_user
    send_email_banned_user(email, name)

def send_email_ticket_message_task(email, title, text):
    from reservas.aux.emails import send_email_ticket_message
    send_email_ticket_message(email,title,text)

def send_email_ticket_message_supporter_task(email, title, text, auth):
    from reservas.aux.emails import send_email_ticket_message_supporter
    send_email_ticket_message_supporter(email,title,text,auth)

def send_email_customer_deactivated_task(idcus):
    from reservas.aux.emails import send_email_customer_deactivated
    send_email_customer_deactivated(idcus)

def send_email_customer_activated_task(idcus):
    from reservas.aux.emails import send_email_customer_activated
    send_email_customer_activated(idcus)

def send_email_new_reservation_task(cus_id, res_id):
    from reservas.aux.emails import send_email_new_reservation
    send_email_new_reservation(cus_id, res_id)

def send_email_new_reservation_cola_task(cus_id, res_id):
    from reservas.aux.emails import send_email_new_reservation_cola
    send_email_new_reservation_cola(cus_id, res_id)

def send_email_cancel_reservation_cola_task(cus_id, res_id):
    from reservas.aux.emails import send_email_cancel_reservation_cola
    send_email_cancel_reservation_cola(cus_id, res_id)

def send_email_cancel_reservation_cola_fin_task(auth_id, res_id):
    from reservas.aux.emails import send_email_cancel_reservation_cola_fin
    send_email_cancel_reservation_cola_fin(auth_id, res_id)

def send_email_confirm_reservation_task(auth_id, res_id):
    from reservas.aux.emails import send_email_confirm_reservation
    send_email_confirm_reservation(auth_id, res_id)

def send_email_cambiocolaareserva_reservation_task(auth_id, res_id):
    from reservas.aux.emails import send_email_cambiocolaareserva_reservation
    send_email_cambiocolaareserva_reservation(auth_id, res_id)

def send_email_cancel_reservation_task(auth_id, res_id):
    from reservas.aux.emails import send_email_cancel_reservation
    send_email_cancel_reservation(auth_id, res_id)

def send_email_cancel_reservation_minimo_task(auth_id, res_id):
    from reservas.aux.emails import send_email_cancel_reservation_minimo
    send_email_cancel_reservation_minimo(auth_id, res_id)

def send_email_cancel_reservation_minimo_super_task(sch_id):
    from reservas.aux.emails import send_email_cancel_reservation_minimo_super
    send_email_cancel_reservation_minimo_super(sch_id)

def send_email_confirm_class_super_task(sch_id, asistentes, numplazasdos):
    from reservas.aux.emails import send_email_confirm_class_super
    send_email_confirm_class_super(sch_id,asistentes,numplazasdos)

###############
#   TELEGRAM  #
###############

def send_telegram_task(name,nick,phone,msg):
    from reservas.aux.telegram import *
    prueba(name,phone,msg)
    #send_telegram(name,nick,phone,msg)

'''
def warning_telegram_task(msg):
    from reservas.aux.telegram import send_telegram
    send_telegram('Manuel de la Calle','Manuel_de_la_Calle','+34675349165',msg)
    send_telegram('Antonio Ramirez','Antonio_Ramirez','+34638054946',msg)
    send_telegram('Javier Iglesias','Javier_Iglesias','+34661827100',msg)
    send_telegram('Natalia Perellon','Natalia_Perellon','+34652112108',msg)
'''


    

    