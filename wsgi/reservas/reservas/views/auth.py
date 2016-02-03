# -*- coding: utf-8 -*-

from django.http import HttpResponse
import json
import unicodedata

from reservas.models import *
from reservas.aux.auth import *
from reservas.aux.permissions import *
from reservas.aux.general import *
from reservas.aux.emails import *
from reservas.aux.tasks import *
from django.template.loader import render_to_string
from django.template import RequestContext, loader


def default(request):
    """ Metodo default pruebas """
    data=json.dumps({'status': 'failed', 'response':'[auth] works'})
    return APIResponse(request,data)

def restorepassview(request,token):
    try:
        auth=Auth.objects.get(token=token)
        status = 'success' if auth else 'failed'
    except:
        status='failed'

    template = loader.get_template('restorepass.html')
    content = RequestContext(request,{ 'token':token, 'status':status })
    return HttpResponse(template.render(content))

def edit_password(request):
    """
    Edit password
    """
    if validate_parameter(request.GET,'token'):
        if validate_parameter(request.GET,'newpass'):
            if len(request.GET['newpass']) > 4:
                try:
                    auth = Auth.objects.get(token=request.GET['token'])
                    auth.password=create_password(request.GET['newpass'])
                    auth.save()
                    data = json.dumps({'status':'success','response':'password_changed'})
                except Auth.DoesNotExist:
                    data = json.dumps({'status': 'failed', 'response': 'invalid_token'})
                except Exception as e:
                    data=json.dumps({'status':'failed','response': 'auth_model_failure:'})
            else:
                data=json.dumps({'status':'failed','response':'newpass_short'})
        else:
            data=json.dumps({'status':'failed','response':'newpass_missed'})
    else:
        data=json.dumps({'status':'failed','response':'token_missed'})

    return APIResponse(request,data)


def login(request):
    """
    Logs a user in
    """
    try:
        if 'auth_id' not in request.session:
            params=['email','password']
            for param in params:
                if not validate_parameter(request.GET,param):
                    raise Exception(param+'_missed')

            auth=Auth.objects.get(email=request.GET['email'])

            if not check_password(request.GET['email'],request.GET['password']):
                raise Exception('password_wrong')

            if auth.banned:
                raise Exception('banned',{'id':auth.id})
            if not auth.active:
                raise Exception('not_activated',{'token':auth.token})

            request.session['auth_id'] = auth.id
            data=json.dumps({'status': 'success', 'response':'logged', 'data':{'id':auth.id, 'role':auth.role.role}})
        else:
            auth=Auth.objects.get(id=request.session['auth_id'])
            data=json.dumps({'status': 'failed', 'response':'logged_yet','data':{'auth_id':auth.id,'role':auth.role.role}})

    except Auth.DoesNotExist:
        data = json.dumps({'status':'failed','response':'email_wrong'})

    except Auth.MultipleObjectsReturned:
        data = json.dumps({'status':'failed','response':'email_wrong'})

    except Exception as e:
        data=json.dumps({'status':'failed','response':e.args[0]})

    return APIResponse(request,data)


def tokin(request):
    """
    Logs a user in using its token
    """
    if validate_parameter(request.GET,'token'):
        if 'auth_id' in request.session:
            del request.session['auth_id']
        try:
            auth=Auth.objects.get(token=request.GET['token'])
            if not auth.banned:
                if auth.active:
                    request.session['auth_id'] = auth.id
                    data=json.dumps({'status':'success','response':'logged','data':{'auth_id':auth.id,'role':auth.role.role}})
                else:
                    data=json.dumps({'status': 'failed', 'response':'not_activated','data':{'id':auth.id}})
            else:
                data=json.dumps({'status': 'failed', 'response':'banned'})

        except:
            data=json.dumps({'status': 'failed', 'response':'auth_not_found'})

    else:
        data=json.dumps({'status': 'failed', 'response':'token_missed'})

    return APIResponse(request,data)



def logout(request):
    """
    Logs a user out
    """
    if 'auth_id' in request.session:
        auth_id=request.session['auth_id']
        delete_session(auth_id)
        del request.session['auth_id']
        

        data=json.dumps({'status': 'success', 'response':'logout'})
    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    return APIResponse(request,data)

def restorepass(request):
    """
    Send a restorepass request
    """
    emailtrad=''
    if validate_parameter(request.GET,'email'):
        emailtrad = elimina_tildes(request.GET['email'], request.GET['email'])
        lista_auth=Auth.objects.filter(email=emailtrad)
        if len(lista_auth)>0:
            auth=lista_auth[0]
            url='http://'+request.get_host()+'/restorepass/'+auth.token
            try:
                add_task(datetime.utcnow(),'send_email_restorepass_task(url="'+url+'",email="'+emailtrad+'")')
                data=json.dumps({'status': 'success', 'response':'email_sent'})
            except:
                data=json.dumps({'status': 'failed', 'response':'email_unsent'})
        else:
            data=json.dumps({'status': 'failed', 'response':'email_unknown'})
    else:
        data=json.dumps({'status':'failed','response':'email_missed'})

    return APIResponse(request,data)


def edit_password(request):
    """
    Edit password
    """
    if validate_parameter(request.GET,'token'):
        if validate_parameter(request.GET,'newpass'):
            if len(request.GET['newpass']) > 4:
                try:
                    auth = Auth.objects.get(token=request.GET['token'])
                    auth.password=create_password(request.GET['newpass'])
                    auth.save()
                    data = json.dumps({'status':'success','response':'password_changed'})
                except Auth.DoesNotExist:
                    data = json.dumps({'status': 'failed', 'response': 'invalid_token'})
                except Exception as e:
                    data=json.dumps({'status':'failed','response': 'auth_model_failure:'})
            else:
                data=json.dumps({'status':'failed','response':'newpass_short'})
        else:
            data=json.dumps({'status':'failed','response':'newpass_missed'})
    else:
        data=json.dumps({'status':'failed','response':'token_missed'})

    return APIResponse(request,data)


def add_tokenpush(request):
    """
    Adds a token for push notifications (Android and iOS)
    """
    if 'auth_id' in request.session:
        try:
            auth=Auth.objects.get(id=request.session['auth_id'])
            if validate_parameter(request.GET,'token'):
                if validate_parameter(request.GET,'device_type'):
                    tokenpush=Tokenpush.objects.filter(auth=auth,token=request.GET["token"])
                    if len(tokenpush)==0:
                        tokenpush=Tokenpush()
                        tokenpush.auth=auth
                        tokenpush.token=request.GET["token"]
                        tokenpush.device_type=request.GET["device_type"]
                        try:
                            tokenpush.save()
                            data=json.dumps({'status':'success','response':'created'})
                        except:
                            data=json.dumps({'status':'failed','response':'device_type_wrong'})
                    else:
                        data=json.dumps({'status':'success','response':'token_already_created'})
                else:
                    data=json.dumps({'status':'failed','response':'device_type_missed'})
            else:
                data=json.dumps({'status':'failed','response':'token_missed'})
        except:
            data=json.dumps({'status':'failed','response':'auth_not_found'})

    else:
        data=json.dumps({'status':'failed','response':'not_logged'})

    return APIResponse(request,data)


def del_tokenpush(request):
    """
    Deletes a token for push notifications (Android and iOS)
    """
    if 'auth_id' in request.session:
        auth=Auth.objects.get(id=request.session['auth_id'])
        if validate_parameter(request.GET,'token'):
            try:
                tokenpush=Tokenpush.objects.filter(auth=auth,token=request.GET["token"])
                try:
                    tokenpush.delete()
                    data=json.dumps({'status':'success','response':'deleted'})
                except:
                    data=json.dumps({'status':'failed','response':'fatal_error'})
            except:
                data=json.dumps({'status':'success','response':'token_not_found'})
        else:
            data=json.dumps({'status':'failed','response':'token_missed'})
    else:
        data=json.dumps({'status':'failed','response':'not_logged'})

    return APIResponse(request,data)


def status(request):
    """
    Returns if a user is logged and which role is
    """
    if 'auth_id' in request.session:
        try:
            auth=Auth.objects.get(id=request.session['auth_id'])
            data=json.dumps({'status':'success','response':'logged','data':{'auth_id':auth.id,'role':auth.role.role, 'token':auth.token}})
        except:
            data=json.dumps({'status':'failed','response':'auth_error'})
    else:
        data=json.dumps({'status':'success','response':'not_logged'})

    return APIResponse(request,data) 



def get(request):
    """
    Gets an auth profile
    """
    if 'auth_id' in request.session:
        auth_profile=get_profile(request.session['auth_id'])
        data=json.dumps({'status':'success','response':'auth_profile','data':{'auth_profile':auth_profile}})
    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    return APIResponse(request,data)

def get_user(request):
    from reservas.aux.auth import get_user as get_user_profile
    """
    Gets user id and role from an auth_id
    """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'get_user_info'):
            if validate_parameter(request.GET,'id'):
                try:
                    auth=Auth.objects.get(id=request.GET['id'])
                    user=get_user_profile(auth.id)
                    if user:
                        data=json.dumps({'status':'success','response':'get_user','data':{'role':auth.role.role,'user_id':user.id}})
                    else:
                       data=json.dumps({'status': 'failed', 'response':'user_not_found'})
                except:
                    data=json.dumps({'status': 'failed', 'response':'auth_not_found'})

            else:
               data=json.dumps({'status': 'failed', 'response':'id_missed'})

        else:
            data=json.dumps({'status': 'failed', 'response':'unauthorized_get_user_info'})

    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    return APIResponse(request,data)

def ban(request):
    """
    Bans a user
    """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'ban_auth'):
            if validate_parameter(request.GET,'id'):
                try:
                    auth=Auth.objects.get(id=request.GET['id'])
                    if auth.banned:
                        data=json.dumps({'status':'failed','response':'auth_already_banned'})
                    else:
                        auth.banned=True
                        auth.save()
                        delete_session(auth.id)
                        data=json.dumps({'status':'success','response':'auth_banned'})

                except:
                    data=json.dumps({'status': 'failed', 'response':'auth_not_found'})

            else:
               data=json.dumps({'status': 'failed', 'response':'id_missed'})

        else:
            data=json.dumps({'status': 'failed', 'response':'unauthorized_ban_auth'})

    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    return APIResponse(request,data)

def unban(request):
    """
    Unbans a user
    """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'unban_auth'):
            if validate_parameter(request.GET,'id'):
                try:
                    auth=Auth.objects.get(id=request.GET['id'])
                    if auth.banned:
                        auth.banned=False
                        auth.save()
                        data=json.dumps({'status':'success','response':'auth_unbanned'})
                    else:
                       data=json.dumps({'status':'failed','response':'auth_already_unbanned'})

                except:
                    data=json.dumps({'status': 'failed', 'response':'auth_not_found'})

            else:
               data=json.dumps({'status': 'failed', 'response':'id_missed'})

        else:
            data=json.dumps({'status': 'failed', 'response':'unauthorized_unban_auth'})

    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    return APIResponse(request,data)

def activate(request):
    """
    Activates a user
    """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'activate_auth'):
            if validate_parameter(request.GET,'id'):
                try:
                    auth=Auth.objects.get(id=request.GET['id'])
                    if auth.active:
                        data=json.dumps({'status':'failed','response':'auth_already_activated'})
                    else:
                        auth.active=True
                        auth.save()
                        customer=U_Customers.objects.get(auth=auth)
                        customer.validated=True
                        customer.save()
                        data=json.dumps({'status':'success','response':'auth_activated'})
                except:
                    data=json.dumps({'status': 'failed', 'response':'auth_not_found'})

            else:
               data=json.dumps({'status': 'failed', 'response':'id_missed'})

        else:
            data=json.dumps({'status': 'failed', 'response':'unauthorized_activate_auth'})

    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    return APIResponse(request,data)

def deactivate(request):
    """
    Deactivates a user
    """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'deactivate_auth'):
            if validate_parameter(request.GET,'id'):
                try:
                    auth=Auth.objects.get(id=request.GET['id'])
                    if auth.active:
                        auth.active=False
                        auth.save()
                        customer=U_Customers.objects.get(auth=auth)
                        customer.validated=False
                        customer.save()
                        delete_session(auth.id)
                        data=json.dumps({'status':'success','response':'auth_deactivated'})
                    else:
                        data=json.dumps({'status':'failed','response':'auth_already_deactivated'})

                except:
                    data=json.dumps({'status': 'failed', 'response':'auth_not_found'})

            else:
               data=json.dumps({'status': 'failed', 'response':'id_missed'})

        else:
            data=json.dumps({'status': 'failed', 'response':'unauthorized_deactivate_auth'})

    else:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    return APIResponse(request,data)


def list_roles(request):
    """
    List of roles
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')

        if not have_permission(request.session['auth_id'],'list_roles'):
            raise Exception('unauthorized_list_roles')

        roles = Roles.objects.all()
        list=[]
        for role in roles:
            if role.role != 'U_Super':
                list.append({'id':role.id,'role':role.role})

        data = json.dumps({'status':'success','response':'roles_list', 'data':list})


    except Exception as e:
        data = json.dumps({ 'status': 'failed', 'response': e.args[0] })

    return APIResponse(request, data)
    
    
    
def search_by_email(request):
    """
    Search user
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')

        if not have_permission(request.session['auth_id'],'search_by_email'):
            raise Exception('unauthorized_search_by_email')
        
        if not validate_parameter(request.GET,'email'):
            raise Exception('email_missed')

        auth = Auth.objects.filter(email__icontains=request.GET['email'])[0]
        
        auth_profile = {'id': auth.id, 'name' : auth.name, 'surname': auth.surname, 'email':auth.email, 'prefix':auth.prefix, 'phone':auth.phone, 'role':auth.role.role }
        
        profile = False
        
        if auth.role.role == 'U_Customers':
            passenger=U_Customers.objects.get(auth=auth)
            profile = { 'id' : passenger.id }
        
        data = json.dumps({'status':'success','response':'user_data', 'data':{ 'auth_profile' : auth_profile , 'profile' : profile } })


    except Exception as e:
        data = json.dumps({ 'status': 'failed', 'response': e.args[0] })

    return APIResponse(request, data)

def get_otro_default(request):
    """
    Search user
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')

        if not have_permission(request.session['auth_id'],'search_by_email'):
            raise Exception('unauthorized_get_otro_default')

        auth = Auth.objects.filter(email__icontains='other@taxible.call')[0]
        
        auth_profile = {'id': auth.id, 'name' : auth.name, 'surname': auth.surname, 'email':auth.email, 'prefix':auth.prefix, 'phone':auth.phone, 'role':auth.role.role }
        
        profile = False
        
        if auth.role.role == 'U_Customers':
            passenger=U_Customers.objects.get(auth=auth)
            profile = { 'id' : passenger.id }
        
        data = json.dumps({'status':'success','response':'user_data', 'data':{ 'auth_profile' : auth_profile , 'profile' : profile } })


    except Exception as e:
        data = json.dumps({ 'status': 'failed', 'response': e.args[0] })

    return APIResponse(request, data)
   
def get_oculto_default(request):
    """
    Search user
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')

        if not have_permission(request.session['auth_id'],'search_by_email'):
            raise Exception('unauthorized_get_oculto_default')

        auth = Auth.objects.filter(email__icontains='oculto@taxible.call')[0]
        
        auth_profile = {'id': auth.id, 'name' : auth.name, 'surname': auth.surname, 'email':auth.email, 'prefix':auth.prefix, 'phone':auth.phone, 'role':auth.role.role }
        
        profile = False
        
        if auth.role.role == 'U_Customers':
            passenger=U_Customers.objects.get(auth=auth)
            profile = { 'id' : passenger.id }
        
        data = json.dumps({'status':'success','response':'user_data', 'data':{ 'auth_profile' : auth_profile , 'profile' : profile } })


    except Exception as e:
        data = json.dumps({ 'status': 'failed', 'response': e.args[0] })

    return APIResponse(request, data)

def get_taxista_default(request):
    """
    Search user
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')

        if not have_permission(request.session['auth_id'],'search_by_email'):
            raise Exception('unauthorized_get_taxista_default')

        auth = Auth.objects.filter(email__icontains='taxista@taxible.call')[0]
        
        auth_profile = {'id': auth.id, 'name' : auth.name, 'surname': auth.surname, 'email':auth.email, 'prefix':auth.prefix, 'phone':auth.phone, 'role':auth.role.role }
        
        profile = False
        
        if auth.role.role == 'U_Customers':
            passenger=U_Customers.objects.get(auth=auth)
            profile = { 'id' : passenger.id }
        
        data = json.dumps({'status':'success','response':'user_data', 'data':{ 'auth_profile' : auth_profile , 'profile' : profile } })


    except Exception as e:
        data = json.dumps({ 'status': 'failed', 'response': e.args[0] })

    return APIResponse(request, data)

def search_by_phone(request):
    """
    Search user by phone
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')

        if not have_permission(request.session['auth_id'],'search_by_phone'):
            raise Exception('unauthorized_search_by_phone')
        
        if not validate_parameter(request.GET,'phone'):
            raise Exception('phone_missed')

        auth = Auth.objects.filter(phone__icontains=request.GET['phone'])[0]
        
        auth_profile = {'id': auth.id, 'name' : auth.name, 'surname': auth.surname, 'email':auth.email, 'prefix':auth.prefix, 'phone':auth.phone, 'role':auth.role.role }
        
        profile = False
        
        if auth.role.role == 'U_Customers':
            passenger=U_Customers.objects.get(auth=auth)
            profile = { 'id' : passenger.id }
        
        data = json.dumps({'status':'success','response':'user_data', 'data':{ 'auth_profile' : auth_profile , 'profile' : profile } })


    except Exception as e:
        data = json.dumps({ 'status': 'failed', 'response': e.args[0] })

    return APIResponse(request, data)
    
def send_instagram_by_phone(request):
    """
    Send instagram by phone number
    """
    try:
        if not validate_parameter(request.GET,'phone'):
            raise Exception('phone_missed')

        if not validate_parameter(request.GET,'message'):
            raise Exception('message_missed')

        auth = Auth.objects.filter(phone__icontains=request.GET['phone'])[0]
        
        name = 'User Id'+str(auth.id)
        nick = 'User_Id'+str(auth.id)
        phone = '+'+str(auth.prefix)+str(auth.phone)
        message = request.GET['message']
        telegram = {'name': name, 'nick': nick , 'phone': phone , 'message': message }
        
        add_task(datetime.utcnow(),'send_telegram_task(name="'+str(name)+'",nick="'+str(nick)+'",phone="'+str(phone)+'",msg="'+message+'")')
                
        data = json.dumps({'status':'success','response':'instagram_sent', 'data': telegram })


    except Exception as e:
        data = json.dumps({ 'status': 'failed', 'response': e.args[0] })

    return APIResponse(request, data)
    
def warning_instagram(request):
    """
    Send warning instagram to Taxible Team
    """
    try:
        if not validate_parameter(request.GET,'message'):
            raise Exception('message_missed')

        message = request.GET['message']
        add_task(datetime.utcnow(),'warning_telegram_task(msg="'+message+'")')
                
        data = json.dumps({'status':'success','response':'warning_instagram_sent', 'data': message })

    except Exception as e:
        data = json.dumps({ 'status': 'failed', 'response': e.args[0] })

    return APIResponse(request, data)
    
def list_num_users_by_year(request):
    list_year = []
    try:
        if not validate_parameter(request.GET, 'year'):
            raise Exception('year_missed')
        user,auth = get_user_and_auth(request.session['auth_id'])
        year = request.GET['year']
        list_year=[]
        list_year = generate_list_users_by_year(year)
        data = json.dumps({'status':'success', 'response':'users_by_year', 'data':list_year})
    except Exception as e:
        data = json.dumps({'status':'failed', 'response': e.args[0]})

    return APIResponse(request,data)