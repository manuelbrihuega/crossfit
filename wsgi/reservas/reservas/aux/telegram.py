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
    time.sleep(10)
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
    time.sleep(5)
    telegram.sendline(add_contact_line)
    time.sleep(10)
    index = telegram.expect(['', 'successfully', pexpect.EOF, pexpect.TIMEOUT],timeout=5)
    if index == 0 or index == 1:
        send_msg_method(telegram,nick,msg)
    elif index == 2:
        print 'ADD_CONTACT_END'
    elif index == 3:
        print 'ADD_CONTACT_TIMEOUT'
    else:
        print 'ADD_CONTACT_ERROR'


def send_msg_method(telegram, nick, msg):
    time.sleep(5)
    telegram.sendline('contact_list')  
    time.sleep(10)
    send_msg_line = 'msg '+nick+'_'+nick+' '+msg
    #print send_msg_line
    telegram.sendline(send_msg_line)   
    time.sleep(5)
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
    
def prueba(name, phone, msg):
    line = 'msg '+name+'_'+name+' '+msg
    patheo = os.path.dirname(__file__) + '/../../../../../../dependencies/tg/bin/'
    cmd = patheo+'telegram-cli -k '+patheo+'../tg-server.pub'
    telegram = pexpect.spawn(cmd)
    time.sleep(5) 
    index1 = telegram.expect(['Telegram-cli *', 'unread', pexpect.EOF, pexpect.TIMEOUT],timeout=5)
    telegram.sendline('add_contact '+phone+' '+name+' '+name)
    time.sleep(5)
    index2 = telegram.expect(['', 'successfully', pexpect.EOF, pexpect.TIMEOUT],timeout=5)
    telegram.sendline('contact_list')  
    time.sleep(6)
    contad = 0
    #print line
    telegram.sendline(line)  
    #index = telegram.expect(['', 'print_message', 'Bad', pexpect.EOF, pexpect.TIMEOUT],timeout=5)
    index3 = telegram.expect([name+' '+name+' ', 'unread', pexpect.EOF, pexpect.TIMEOUT],timeout=5)
    #contad = 0
    telegram.sendline('quit')
    #for line in telegram:
    #    print line
    #    contad = contad + 1
    #    if contad==15:
    #        break
    if index1 == 0:
        if index2 == 0:
            if index3 == 3:
                return 'SEND_OK'
            else:
                return 'SEND_FAIL'
        else:
            return 'CONTACT_ERROR'
    else:
        return 'ERROR'
