# -*- coding: utf-8 -*-

import json
import unicodedata

from reservas.models import *
from datetime import datetime,timedelta

from reservas.aux.general import *
from reservas.aux.strings import *
from reservas.aux.permissions import *
from reservas.aux.date import *

###############################Fapi
###   AUTH
###############################

def get_user(auth_id):
    #Returns the user associated to an auth
    auth=Auth.objects.get(id=auth_id)
    user=False
    cadena="user="+auth.role.role+".objects.get(auth=auth)"
    exec(cadena)
    return user

def create_password(raw_password):
    import hashlib
    hash_object = hashlib.sha1(raw_password)
    return hash_object.hexdigest()

def check_password(email,raw_password):
    import hashlib
    hash_object = hashlib.sha1(raw_password).hexdigest()
    try:
        Auth.objects.get(email=email,password=hash_object)
        return True
    except:
        return False


def get_profile(auth_id=None, auth_obj=None):
    try:
        if auth_id is not None:
            auth = Auth.objects.get(id=auth_id)
        elif auth_obj is not None:
            auth = auth_obj
        else:
            raise Exception

        return {'auth_id':auth.id,'email':auth.email,'name':auth.name,'surname':auth.surname,'phone':auth.phone,'active':auth.active,'banned':auth.banned,'token':auth.token}
    except:
        return False

def get_user_and_auth(auth_id):
    user = get_user(auth_id)
    return (user, user.auth)


def create_auth(data,role,active):
    # Creates an auth
    import random
    try:
        role_res = Roles.objects.get(role=role)
        auth = Auth()
        auth.role = role_res
        if 'email' in data and len(data['email'])>0:
            found=Auth.objects.filter(email=data['email'])
            if len(found)>0:
                return {'status':'failed','response':'email_registered'}
            else:
                auth.email=data['email']
        else:
            return {'status':'failed','response':'email_missed'}

        if 'password' in data and len(data['password'])>0:
            auth.password=create_password(data['password'])
        else:
            return {'status':'failed','response':'password_missed'}

        auth.date=datetime.utcnow()
        auth.token = random.getrandbits(128)

        if 'name' in data and len(data['name'])>0:
            auth.name=data['name']
        else:
            return {'status':'failed','response':'name_missed'}

        if 'surname' in data:
            auth.surname=data['surname']
        
        if 'phone' in data and len(data['phone'])>0:
            phone=string_to_compare(data['phone'])
            phone=phone.replace(" ","")
            found=Auth.objects.filter(phone=phone)
            if len(found)>0:
                return {'status':'failed','response':'phone_registered'}
            else:
                auth.phone=phone

        elif role=="U_Customers":
            return {'status':'failed','response':'phone_missed'}

        if active:
            auth.active=True
        try:
            auth.save()

            return {'status':'success','response':auth}
        except Exception as e:
            return {'status':'failed','response':'fatal_error: ' + e.args[0]}
    except:
        return {'status':'failed','response':'role_not_found'}



def edit_auth(auth_id,data):
    found=False
    changed=False
    try:
        auth=Auth.objects.get(id=auth_id)
        if validate_parameter(data,'email'):
            found=True
            if data['email']!=auth.email:
                found_email=Auth.objects.filter(email=data['email'])
                if len(found_email)>0:
                    return {'status':'failed','response':'email_registered'}
                else:
                    auth.email=data['email']
                    changed=True
        if validate_parameter(data,'password'):
            found=True
            if create_password(data['password'])!=auth.password:
                auth.password=create_password(data['password'])
                changed=True

        if validate_parameter(data,'name'):
            found=True
            if data['name']!=auth.name:
                auth.name=data['name']
                changed=True
        if validate_parameter(data,'surname'):
            found=True
            if data['surname']!=auth.surname:
                auth.surname=data['surname']
                changed=True
        if validate_parameter(data,'phone'):            
            found=True
            if data['phone']!=auth.phone:
                found_phone=Auth.objects.filter(phone=data['phone'])
                if len(found_phone)>0:
                    return {'status':'failed','response':'phone_registered'}
                else:
                    auth.phone=data['phone']
                    changed=True

        if not found:
            return {'status':'failed','response':'parameter_not_found'}
        elif not changed:
            return {'status':'success','response':'nothing_to_change'}
        try:
            auth.save()
            return {'status':'success','response':auth.id}
        except:
            return {'status':'failed','response':'fatal_error'}
    except:
        return {'status':'failed','response':'auth_not_found'}




def delete_session(auth_id):
    from django.contrib.sessions.models import Session
    try:
        sessions = Session.objects.all()
        for s in sessions:
            if s.get_decoded():
                if 'auth_id' in s.get_decoded():
                    if s.get_decoded()['auth_id']==auth_id:
                        s.delete()
    except:
        pass
    return True


def delete_auth(auth_id):
    try:
        auth=Auth.objects.get(id=auth_id)
        try:
            auth.delete()
            return {'status':'success','response':'deleted'}
        except:
            return {'status':'failed','response':'deleting_error'}
    except:
        return {'status':'failed','response':'auth_not_found'}

def info_new_users_today():
    try:
        year = datetime.today().year
        month = datetime.today().month
        day = datetime.today().day
        first,last=get_day_limit_utc(year=year, month=month, day=day)
        users=Auth.objects.raw('SELECT reservas_auth.id, COUNT(reservas_auth.id) AS new_users FROM reservas_auth WHERE \''+first.strftime("%Y-%m-%d %H:%M:%S")+'\' < ADDTIME(reservas_auth.date, CONCAT(2,\':0\') ) AND \''+last.strftime("%Y-%m-%d %H:%M:%S")+'\' >= ADDTIME(reservas_auth.date, CONCAT(2,\':0\') ) ORDER BY reservas_auth.date;')
        result=0
        for item in users:
            result=item.new_users
        data = {'status':'success','response':'new_users_today','data':str(result)}
    except Exception as e:
        data = {'status':'failed', 'response': e.args[0]}

    return data


def generate_list_users_by_year(year):
    list_result_users=[0] * 12
    try:
        first,last=get_year_limit_utc(year=year)
        auths=Auth.objects.raw('SELECT reservas_auth.* FROM reservas_auth WHERE \''+first.strftime("%Y-%m-%d %H:%M:%S")+'\' < ADDTIME(reservas_auth.date, CONCAT(2,\':0\') ) AND \''+last.strftime("%Y-%m-%d %H:%M:%S")+'\' >= ADDTIME(reservas_auth.date, CONCAT(2,\':0\') ) ORDER BY reservas_auth.date;')
        for auth in auths:
            month = auth.date.month-1
            result = list_result_users[month]
            result = result + 1
            list_result_users[month]=result

    except Exception as e:
        list_result_users.append(e.args[0])
    return list_result_users

def elimina_tildes(self, cadena):
    s = ''.join((c for c in unicodedata.normalize('NFD',unicode(cadena)) if unicodedata.category(c) != 'Mn'))
    return s.decode()