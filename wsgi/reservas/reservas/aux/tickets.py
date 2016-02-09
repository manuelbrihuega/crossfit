# -*- coding: utf-8 -*-

from datetime import datetime
from reservas.models import Messages
from reservas.aux.date import *
from reservas.aux.emails import *
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
            '''else:
                if ticket.auth:
                    #send_email_ticket_message(ticket.auth.email,ticket.title,message.text)
                else:
                    #send_email_ticket_message(ticket.email,ticket.title,message.text)
            '''

        return {'status':'success','response':'message_added', 'data':{ 'message':{ 'id':message.id, 'text':message.text, 'original_way':message.original_way, 'date':get_string_from_date(localdate) }    }}
    except Exception as e:
        return {'status':'failed','response':'message_creation_failure'+e.args[0]}
        
    