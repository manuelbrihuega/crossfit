# -*- coding: utf-8 -*-

from django.http import HttpResponse
import json
from django.db.models import Q

from reservas.models import *

from reservas.aux.auth import *
#from api.aux.rates import *
from reservas.aux.permissions import *
from reservas.aux.general import *
from reservas.aux.tasks import add_task
from reservas.aux.date import *


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
        schedule.date=request.GET['date']
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

        from datetime import *
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
        schedule_time=Schedules_times.objects.all()
        cad ='<?xml version="1.0"?><monthly>'
        for sch in schedule_time:
            startdate=sch.schedule.get_year()+'-'+sch.schedule.get_month()+'-'+sch.schedule.get_day()
            cad= cad + '<event><id>'+sch.id+'</id>'+'<name>'+sch.schedule.activity.name+'</name>'+'<startdate>'+startdate+'</startdate>'+'<starttime>'+sch.time_start+'</starttime>'+'<endtime>'+sch.time_end+'</endtime></event>'
        cad = cad + '</monthly>'

        data=json.dumps({'status':'success','response':'list_all_schedules','data':cad})

    except Exception as e:
        data = json.dumps({
            'status':'failed',
            'response': e.args[0]
        })

    return APIResponse(request,data)