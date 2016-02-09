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
    #print 'EXEC: revise_reservations()'
    return True

def revise_reservations():
    from django.db.models import Q
    from reservas.models import *
    from datetime import *
    from reservas.aux.emails import *
    hoy=datetime(int(datetime.today().year),int(datetime.today().month),int(datetime.today().day),0,0,0)
    reservas=Reservations.objects.filter(Q(schedule_time__schedule__date>hoy) & Q(cursada=False))
    conf=Configuration.objects.get(id=1)
    for res in reservas:
        fechaparaactividad = datetime(res.schedule_time.schedule.date.year, res.schedule_time.schedule.date.month, res.schedule_time.schedule.date.day, res.schedule_time.time_start.hour, res.schedule_time.time_start.minute, 0)
        fechasepuedecancelar = fechaparaactividad - timedelta(minutes=conf.minutes_post)
        if datetime.today() >= fechasepuedecancelar:
            if res.queue:
                customer=U_Customers.objects.filter(Q(auth__id=res.auth.id))
                for cus in customer:
                    if not cus.vip:
                        cus.credit_wod = cus.credit_wod + res.schedule_time.schedule.activity.credit_wod
                        cus.credit_box = cus.credit_box + res.schedule_time.schedule.activity.credit_box
                        cus.save()
                send_email_cancel_reservation_cola_fin(res.auth.id, res.id)
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
                    send_email_confirm_reservation(res.auth.id, res.id)
                else:
                    #se cancela
                    send_email_cancel_reservation_minimo(res.auth.id, res.id)
                    res.delete()

    schedules_timess=Schedules_times.objects.filter(Q(schedule__date>hoy))
    for sch in schedules_timess:
        fechaparaactividaddos = datetime(sch.schedule.date.year, sch.schedule.date.month, sch.schedule.date.day, sch.time_start.hour, sch.time_start.minute, 0)
        fechasepuedecancelardos = fechaparaactividaddos - timedelta(minutes=conf.minutes_post)
        if datetime.today() >= fechasepuedecancelardos:
            rssdos = Reservations.objects.filter(Q(schedule_time__id=sch.id))
            numplazasdos = 0
            for rsdos in rssdos:
                numplazasdos = numplazasdos + 1
            minimumdos = sch.schedule.activity.min_capacity
            if numplazasdos < minimumdos:
                send_email_cancel_reservation_minimo_super(sch.id)
                #aqui estamos avisando al super de que la clase se cancela xq no hay gente
                


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

###############
#   TELEGRAM  #
###############

'''def send_telegram_task(name,nick,phone,msg):
    from reservas.aux.telegram import send_telegram
    send_telegram(name,nick,phone,msg)

def warning_telegram_task(msg):
    from reservas.aux.telegram import send_telegram
    send_telegram('Manuel de la Calle','Manuel_de_la_Calle','+34675349165',msg)
    send_telegram('Antonio Ramirez','Antonio_Ramirez','+34638054946',msg)
    send_telegram('Javier Iglesias','Javier_Iglesias','+34661827100',msg)
    send_telegram('Natalia Perellon','Natalia_Perellon','+34652112108',msg)
'''


    

    