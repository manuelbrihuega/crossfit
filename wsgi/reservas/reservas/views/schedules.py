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

        data=json.dumps({'status':'success','response':'schedule_time_created','data':{'id':schedule_time.id}})
    
    except Exception as e:
        data = json.dumps({'status':'failed', 'response': e.args[0] })

    return APIResponse(request,data)