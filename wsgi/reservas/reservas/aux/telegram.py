# -*- coding: utf-8 -*-
import pexpect
import os
import time

def send_telegram(name,nick,phone,msg):
    # cmd = '/Users/rafaparadela/Downloads/tg/telegram -k /Users/rafaparadela/Downloads/tg/tg.pub'
    patheo = os.path.dirname(__file__) + '/../../../../../../dependencies/tg/bin/'
    print patheo
    cmd = patheo+'telegram-cli -k '+patheo+'../tg-server.pub'
    print cmd
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
    add_contact_line = 'add_contact '+phone+' '+name+' '+name
    print add_contact_line
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
    telegram.sendline('contact_list')  
    time.sleep(5)
    send_msg_line = 'msg '+nick+'_'+nick+' '+msg
    print send_msg_line
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
    
def prueba(cmd):
    telegram = pexpect.spawn(cmd)
    time.sleep(5)
    contad = 0
    for line in telegram:
        print line
        contad = contad + 1
        if contad==15:
            break
    index = telegram.expect(['', 'unread', pexpect.EOF, pexpect.TIMEOUT],timeout=5)
    telegram.sendline('add_contact +34675349165 User_id4 User_id4')
    time.sleep(5)
    contad = 0
    for line in telegram:
        print line
        contad = contad + 1
        if contad==15:
            break
    index = telegram.expect(['', 'successfully', pexpect.EOF, pexpect.TIMEOUT],timeout=5)
    telegram.sendline('contact_list')  
    time.sleep(5)
    contad = 0
    for line in telegram:
        print line
        contad = contad + 1
        if contad==15:
            break
    telegram.sendline('msg User_id4_User_id4 FinalAbsoluto')  
    contad = 0
    for line in telegram:
        print linecontad = contad + 1
        if contad==15:
            break
    print 'OK'