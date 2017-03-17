# -*- coding: utf-8 -*-

from datetime import datetime
from reservas.models import Messages
from reservas.aux.date import *
from reservas.aux.emails import *
from reservas.aux.tasks import *
import unicodedata

def add_message(ticket,text,way,offset):
    """
    Create a message from a ticket
    """
    try:
        message=Messages()
        message.ticket=ticket
        message.text=text
        message.original_way=way
        message.date=localdate=local_date(datetime.utcnow(),offset)
        message.save()
        name = 'User_Id'+str(ticket.auth.id)
        nick = 'User_Id'+str(ticket.auth.id)
        phone = '+34'+str(ticket.auth.phone)
        messagel = 'Ha recibido una respuesta a su incidencia'
        cu = U_Customers.objects.filter(Q(auth__id=ticket.auth.id))
        for c in cu:
            if c.emailnotif:
                add_task(datetime.utcnow(),'send_email_ticket_message_task(auth_id="'+str(ticket.auth.id)+'",id_message="'+str(message.id)+'")')
            if c.telegramnotif:
                add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+messagel+'")')
        
        '''else:
            if ticket.auth:
                #send_email_ticket_message(ticket.auth.email,ticket.title,message.text)
            else:
                #send_email_ticket_message(ticket.email,ticket.title,message.text)
        '''

        return {'status':'success','response':'message_added', 'data':{ 'message':{ 'id':message.id, 'text':message.text, 'original_way':message.original_way, 'date':get_string_from_date(localdate) }    }}
    except Exception as e:
        return {'status':'failed','response':'message_creation_failure'+e.args[0]}
        
    