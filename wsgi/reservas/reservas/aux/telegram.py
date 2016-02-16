# -*- coding: utf-8 -*-
import pexpect
import os

def send_telegram(name,nick,phone,msg):
    # cmd = '/Users/rafaparadela/Downloads/tg/telegram -k /Users/rafaparadela/Downloads/tg/tg.pub'
    patheo = os.path.dirname(__file__) + '/../../../../../../dependencies/tg/bin/'
    cmd = patheo+'telegram-cli -k '+patheo+'../tg-server.pub'
    telegram = pexpect.spawn(cmd)
    # telegram.expect('0m',timeout=5)
    index = telegram.expect(['', 'unread', pexpect.EOF, pexpect.TIMEOUT],timeout=5)
    if index == 0 or index == 1:
        add_contact_method(telegram,name,nick,phone,msg)
    elif index == 2:
        print 'CONNECT_END'
    elif index == 3:
        print 'CONNECT_TIMEOUT'
    else:
        print 'CONNECT_ERROR'
        

def add_contact_method(telegram,name,nick,phone,msg):
    add_contact_line = 'add_contact '+phone+' '+name
    telegram.sendline(add_contact_line)
    index = telegram.expect(['', 'successfully', pexpect.EOF, pexpect.TIMEOUT],timeout=5)
    if index == 0 or index == 1:
        print telegram.after
        send_msg_method(telegram,nick,msg)
    elif index == 2:
        print 'ADD_CONTACT_END'
    elif index == 3:
        print 'ADD_CONTACT_TIMEOUT'
    else:
        print 'ADD_CONTACT_ERROR'


def send_msg_method(telegram, nick, msg):
    send_msg_line = 'msg '+nick+' '+msg
    telegram.sendline(send_msg_line)   
    index = telegram.expect(['', 'print_message', 'Bad', pexpect.EOF, pexpect.TIMEOUT],timeout=5)
    if index == 0 or index == 1:
        print 'SENT'
    elif index == 2:
        print 'BAD_USER_SEND'
    elif index == 3:
        print 'SEND_END'
    elif index == 4:
        print 'SEND_TIMEOUT'
    else:
        print 'SEND_ERROR'
        
    telegram.sendline('quit')
    