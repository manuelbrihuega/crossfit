# -*- coding: utf-8 -*-

from django.http import HttpResponse
import json
from django.db.models import Q
import os
from django.core.files import File
from reservas.models import *

from reservas.aux.auth import *
#from api.aux.rates import *
from reservas.aux.permissions import *
from reservas.aux.general import *
from reservas.aux.tasks import add_task
from reservas.aux.date import *
from datetime import *
from django.conf import settings


def add_concrete(request):
    """
    Creates a new schedule time
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not have_permission(request.session['auth_id'],'add_concrete_schedule_time'):
            raise Exception('unauthorized_add_concrete_schedule_time')
            
        for field in ('time_start','time_end','duration','date','activity_id'):
            if not validate_parameter(request.GET, field):
                raise Exception(field+'_missed')
        
        activity=Activities.objects.get(id=request.GET['activity_id'])
        schedule=Schedules()
        schedule.concrete=True
        fechazocad=str(request.GET['date']).split('-')
        schedule.date=datetime(int(fechazocad[0]), int(fechazocad[1]),int(fechazocad[2]), 12, 12, 12)
        schedule.activity=activity
        schedule.save()
        
        schedule_time=Schedules_times()
        schedule_time.time_start=request.GET['time_start']
        schedule_time.time_end=request.GET['time_end']
        schedule_time.duration=request.GET['duration']
        schedule_time.schedule=schedule
        schedule_time.save()

        data=json.dumps({'status':'success','response':'schedule_time_created','data':{'id':schedule_time.id}})
    
    except Exception as e:
        data = json.dumps({'status':'failed', 'response': e.args[0] })

    return APIResponse(request,data)


def add_interval(request):
    """
    Creates a new schedule time
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not have_permission(request.session['auth_id'],'add_interval_schedule_time'):
            raise Exception('unauthorized_add_interval_schedule_time')
            
        for field in ('time_start','time_end','duration','monthly','activity_id','weekly'):
            if not validate_parameter(request.GET, field):
                raise Exception(field+'_missed')
        
        activity=Activities.objects.get(id=request.GET['activity_id'])
        schedule=Schedules()
        schedule.concrete=False
        schedule.monthly=request.GET['monthly']
        schedule.weekly=request.GET['weekly']
        schedule.activity=activity
        schedule.save()
        
        schedule_time=Schedules_times()
        schedule_time.time_start=request.GET['time_start']
        schedule_time.time_end=request.GET['time_end']
        schedule_time.duration=request.GET['duration']
        schedule_time.schedule=schedule
        schedule_time.save()

        ahora=datetime.now()
        ano=ahora.year
        fechprox=datetime(ano+1,1,1)
        queda=fechprox-ahora
        dias=queda.days
        contador=1
        fechaprincipal=datetime.now()
        cadmeses=request.GET['monthly'].split(',')
        cadsemana=request.GET['weekly'].split(',')
        while contador<=dias:
            if cadmeses[fechaprincipal.month-1]=='1':
                if cadsemana[fechaprincipal.weekday()]=='1':
                    scheduleaux=Schedules()
                    scheduleaux.concrete=True
                    scheduleaux.date=fechaprincipal
                    scheduleaux.activity=activity
                    scheduleaux.save()
                    schedule_timeaux=Schedules_times()
                    schedule_timeaux.time_start=request.GET['time_start']
                    schedule_timeaux.time_end=request.GET['time_end']
                    schedule_timeaux.duration=request.GET['duration']
                    schedule_timeaux.schedule=scheduleaux
                    schedule_timeaux.save()

            fechaprincipal = fechaprincipal + timedelta(days=1)
            contador=contador+1
            
        data=json.dumps({'status':'success','response':'schedule_time_created','data':{'id':schedule_time.id}})
    
    except Exception as e:
        data = json.dumps({'status':'failed', 'response': e.args[0] })

    return APIResponse(request,data)


def openFile(fileName, mode, context):
    # open file using python's open method
    # by default file gets opened in read mode
    try:
        fileHandler = open(fileName, mode)
        return {'opened':True, 'handler':fileHandler}
    except IOError:
        context['error'] += 'Unable to open file ' + fileName + '\n'
    except:
        context['error'] += 'Unexpected exception in openFile method.\n'
    return {'opened':False, 'handler':None}


def writeFile(content, fileName, context):
    # open file write mode
    fileHandler = openFile(fileName, 'w', context)
    
    if fileHandler['opened']:
        # create Django File object using python's file object
        file = File(fileHandler['handler'])
        # write content into the file
        file.write(content)
        # flush content so that file will be modified.
        file.flush()
        # close file
        file.close()


def list_all(request):
    """
    List all schedules info
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not have_permission(request.session['auth_id'],'list_all_schedules'):
            raise Exception('unauthorized_list_all_schedules')

        user,auth = get_user_and_auth(request.session['auth_id'])
        schedule_time=Schedules_times.objects.filter(Q(schedule__concrete=1)).order_by('time_start')
        cad ='<?xml version="1.0"?><monthly>'
        for sch in schedule_time:
            fechaact = datetime(int(sch.schedule.date.year),int(sch.schedule.date.month),int(sch.schedule.date.day),0,0,0)
            fechahoy = datetime(int(datetime.today().year),int(datetime.today().month),int(datetime.today().day),0,0,0)
            if fechahoy<=fechaact:
                fechita = sch.schedule.date
                startdate=str(fechita.year)+'-'+str(fechita.month)+'-'+str(fechita.day)
                ocupadas = 0
                disponibles = 0
                aforo = sch.schedule.activity.max_capacity
                aforocola = sch.schedule.activity.queue_capacity
                reservations=Reservations.objects.filter(Q(schedule_time__id=sch.id))
                for res in reservations:
                    ocupadas = ocupadas + 1
                disponibles = aforo - ocupadas
                if disponibles < 0:
                    disponibles = 0;
                discol = ocupadas-aforo
                if discol < 0:
                    discol=0
                discol = aforocola - discol
                cad= cad + '<event><id>'+str(sch.id)+'</id>'+'<name>'+sch.schedule.activity.name+'</name>'+'<startdate>'+startdate+'</startdate>'+'<starttime>'+str(sch.time_start)+'</starttime>'+'<endtime>'+str(sch.time_end)+'</endtime><oc>'+str(ocupadas)+'</oc><dis>'+str(disponibles)+'</dis><af>'+str(aforo)+'</af><afcol>'+str(aforocola)+'</afcol><discol>'+str(discol)+'</discol></event>'
        cad = cad + '</monthly>'

        context = {'error':''}
        fileName = os.path.join(os.path.abspath(os.path.dirname(__file__)) + '/../../../static/xml', 'calendario.xml')
        writeFile(cad, fileName, context)
        scheme = 'https://' if request.is_secure() else 'http://'
        urlfinal = scheme + request.get_host() + settings.STATIC_URL + 'xml/calendario.xml'
        data=json.dumps({'status':'success','response':'list_all_schedules','data':urlfinal})

    except Exception as e:
        data = json.dumps({
            'status':'failed',
            'response': e.args[0]
        })

    return APIResponse(request,data)


def delete(request):
    """
    Delete schedule_time
    """
    
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')

        if not have_permission(request.session['auth_id'], 'delete_schedule'):
            raise Exception('unauthorized_delete_schedule')

        if not validate_parameter(request.GET, 'id'):
            raise Exception('schedule_id_missed')

        user,auth = get_user_and_auth(request.session['auth_id'])
        
        schedule_time=Schedules_times.objects.get(id=request.GET['id'])
            
        schedule=schedule_time.schedule
        reservations=Reservations.objects.filter(Q(schedule_time__id=schedule_time.id))
        for res in reservations:
            res.delete()
        schedule_time.delete()
        schedule.delete()
        
        data = json.dumps( { 'status': 'success', 'response': 'schedule_deleted'} )
       
    except Activities.DoesNotExist:
        data = json.dumps({'status': 'failed', 'response': 'schedule_not_found'})

    except Exception as e:
        data = json.dumps({
            'status':'failed',
            'response': e.args[0]
        })

    return APIResponse(request=request, data=data)


def delete_reservation(request):
    """
    Delete reservation
    """
    
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')

        if not have_permission(request.session['auth_id'], 'delete_reservation'):
            raise Exception('unauthorized_delete_reservation')

        if not validate_parameter(request.GET, 'id'):
            raise Exception('reservation_id_missed')

        user,auth = get_user_and_auth(request.session['auth_id'])
        
        reservation=Reservations.objects.get(id=request.GET['id'])
        if reservation.queue:
            position = reservation.position_queue
            schedule_time_id = reservation.schedule_time.id
            reservation.delete()
            reservations=Reservations.objects.filter(Q(schedule_time__id=schedule_time_id) & Q(queue=True))
            for res in reservations:
                if res.position_queue > position:
                    res.position_queue = res.position_queue - 1
                    res.save()
        else:
            schedule_time_id = reservation.schedule_time.id
            reservation.delete()
            reservations=Reservations.objects.filter(Q(schedule_time__id=schedule_time_id) & Q(queue=True))
            for res in reservations:
                if res.position_queue==1:
                    res.queue=False
                    res.position_queue=None
                    res.save()
                else:
                    res.position_queue = res.position_queue - 1
                    res.save()
        
        data = json.dumps( { 'status': 'success', 'response': 'reservation_deleted'} )
       
    except Reservations.DoesNotExist:
        data = json.dumps({'status': 'failed', 'response': 'reservation_not_found'})

    except Exception as e:
        data = json.dumps({
            'status':'failed',
            'response': e.args[0]
        })

    return APIResponse(request=request, data=data)


def get_foreign(request):
    """
    Get foreign schedule info
    """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'get_foreign_schedule'):
            if validate_parameter(request.GET,'id'):
                try:
                    schedule_time=Schedules_times.objects.get(id=request.GET['id'])
                    schedule_profile={'schedule_time_id':schedule_time.id,
                                        'time_start':get_string_from_date(schedule_time.time_start),
                                        'time_end':get_string_from_date(schedule_time.time_end),
                                        'duration':schedule_time.duration,
                                        'schedule_id':schedule_time.schedule.id,
                                        'date':get_string_from_date(schedule_time.schedule.date),
                                        'activity_id':schedule_time.schedule.activity.id,
                                        'activity_name':schedule_time.schedule.activity.name,
                                        'activity_description':schedule_time.schedule.activity.description,
                                        'activity_id_max_capacity':schedule_time.schedule.activity.max_capacity,
                                        'activity_id_min_capacity':schedule_time.schedule.activity.min_capacity,
                                        'activity_id_queue_capacity':schedule_time.schedule.activity.queue_capacity}
                    reservations=Reservations.objects.filter(Q(schedule_time__id=schedule_time.id))
                    reservations_profile=[]
                    for res in reservations:
                        reservations_profile.append({'id':res.id,
                                 'name':res.auth.name,
                                 'surname':res.auth.surname,
                                 'email':res.auth.email,
                                 'queue':res.queue,
                                 'position_queue':res.position_queue,
                                 'date':get_string_from_date(res.date),
                                 'phone':res.auth.phone})  

                    data=json.dumps({'status':'success','response':'get_foreign_schedule','data':{'schedule':schedule_profile, 'reservations':reservations_profile}})
                except Exception as e:
                    data=json.dumps({'status':'failed','response':e.args[0]})
            else:
                data=json.dumps({'status':'failed','response':'id_missed'})
        else:
            data=json.dumps({'status':'failed','response':'unauthorized_get_foreign_schedule'})
    else:
        data=json.dumps({'status':'failed','response':'not_logged'})
    return APIResponse(request,data)


def hay_plazas(request):
    """
    Define si hay plazas o no
    """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'hay_plazas_schedule'):
            if validate_parameter(request.GET,'id'):
                try:
                    schedule_time=Schedules_times.objects.get(id=request.GET['id'])
                    aforo=schedule_time.schedule.activity.max_capacity
                    aforocola=schedule_time.schedule.activity.queue_capacity
                    reservations=Reservations.objects.filter(Q(schedule_time__id=schedule_time.id))
                    ocupadas=0
                    ocupadascola=0
                    for res in reservations:
                        if res.queue:
                            ocupadascola = ocupadascola + 1
                        else:
                            ocupadas = ocupadas + 1  
                    disponibles=aforo - ocupadas
                    disponiblescola=aforocola - ocupadascola
                    data=json.dumps({'status':'success','response':'hay_plazas_schedule','data':{'aforo':str(aforo), 'aforo_cola':str(aforocola), 'disponibles':str(disponibles), 'disponibles_cola':str(disponiblescola), 'ocupadas':str(ocupadas), 'ocupadas_cola':str(ocupadascola)}})
                except Exception as e:
                    data=json.dumps({'status':'failed','response':e.args[0]})
            else:
                data=json.dumps({'status':'failed','response':'id_missed'})
        else:
            data=json.dumps({'status':'failed','response':'unauthorized_hay_plazas_schedule'})
    else:
        data=json.dumps({'status':'failed','response':'not_logged'})
    return APIResponse(request,data)


def add_reservation(request):
    """
    Creates a new reservation
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not have_permission(request.session['auth_id'],'add_reservation'):
            raise Exception('unauthorized_add_reservation')
            
        for field in ('schedule_time_id','customer_id'):
            if not validate_parameter(request.GET, field):
                raise Exception(field+'_missed')
        
        schedule_time=Schedules_times.objects.get(id=request.GET['schedule_time_id'])
        customer=U_Customers.objects.get(id=request.GET['customer_id'])
        auth=customer.auth
        aforo=schedule_time.schedule.activity.max_capacity
        aforocola=schedule_time.schedule.activity.queue_capacity
        reservations=Reservations.objects.filter(Q(schedule_time__id=schedule_time.id))
        ocupadas=0
        ocupadascola=0
        for res in reservations:
            if res.auth.id==auth.id:
                raise Exception('El cliente ya tiene una plaza ocupada')
            if res.queue:
                ocupadascola = ocupadascola + 1
            else:
                ocupadas = ocupadas + 1  
        disponibles=aforo - ocupadas
        disponiblescola=aforocola - ocupadascola
        if disponibles > 0:
            reservation = Reservations()
            reservation.auth = auth
            reservation.date = datetime.utcnow()
            reservation.queue = False
            reservation.schedule_time = schedule_time
            reservation.save()
        elif disponiblescola > 0:
            reservation = Reservations()
            reservation.auth = auth
            reservation.date = datetime.utcnow()
            reservation.queue = True
            reservation.position_queue = (aforocola - disponiblescola) + 1
            reservation.schedule_time = schedule_time
            reservation.save()
        else:
            raise Exception('No hay plazas disponibles')
            
        data=json.dumps({'status':'success','response':'reservation_created','data':{'id':reservation.id}})
    
    except Exception as e:
        data = json.dumps({'status':'failed', 'response': e.args[0] })

    return APIResponse(request,data)