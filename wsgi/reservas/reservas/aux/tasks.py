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


##############
#   EMAIL    #
##############

def send_email_new_customer_task(customer_id):
    from reservas.aux.emails import send_email_new_customer
    send_email_new_customer(customer_id)

def send_email_new_customer_info_task(customer_id):
    from reservas.aux.emails import send_email_new_customer_info
    send_email_new_customer_info(customer_id)


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


    

    