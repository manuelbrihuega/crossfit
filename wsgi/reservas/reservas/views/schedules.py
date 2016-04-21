# -*- coding: utf-8 -*-

import unicodedata
from django.http import HttpResponse
import json
from django.db.models import Q
import os
import sys
from django.core.files import File
from reservas.models import *

from reservas.aux.auth import *
#from api.aux.rates import *
from reservas.aux.permissions import *
from reservas.aux.general import *
from reservas.aux.emails import *
from reservas.aux.tasks import add_task
from reservas.aux.date import *
from datetime import *
from django.conf import settings


#TAREA: cuando hacemos una reserva en cola hay que añadir una tarea que compruebe cuando acabe el plazo, si estamos ya dentro de la clase, si seguimos en la cola hay que borra la reserva y aumentar el credito consumido
#TAREA: hay que lanzar una tarea el dia 1 de cada mes para que se restablezca el crédito a cada usuario

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
        num = int(request.GET['numerodetramos'])
        contadortramos = 0
        time_start_sp = request.GET['time_start'].split(',')
        time_end_sp = request.GET['time_end'].split(',')
        duration_sp = request.GET['duration'].split(',')
        while contadortramos < num:
            activity=Activities.objects.get(id=request.GET['activity_id'])
            schedule=Schedules()
            schedule.concrete=True
            fechazocad=str(request.GET['date']).split('-')
            schedule.date=datetime(int(fechazocad[0]), int(fechazocad[1]),int(fechazocad[2]), 12, 12, 12)
            festivos=Parties.objects.all()
            for fest in festivos:
                if int(fechazocad[0])==fest.date.year:
                    if int(fechazocad[1])==fest.date.month:
                        if int(fechazocad[2])==fest.date.day:
                            raise Exception('El día seleccionado es festivo')
            schedule.activity=activity
            schedule.save()
            
            schedule_time=Schedules_times()
            schedule_time.time_start=time_start_sp[contadortramos]
            schedule_time.time_end=time_end_sp[contadortramos]
            schedule_time.duration=duration_sp[contadortramos]
            schedule_time.minutes_pre=request.GET['minutes_pre']
            schedule_time.minutes_post=request.GET['minutes_post']
            schedule_time.schedule=schedule
            schedule_time.save()
            fechaparaactividaddos = datetime(schedule_time.schedule.date.year, schedule_time.schedule.date.month, schedule_time.schedule.date.day, int(schedule_time.time_start.split(':')[0]), int(schedule_time.time_start.split(':')[1]), 0)
            fechasepuedecancelardos = fechaparaactividaddos - timedelta(minutes=int(schedule_time.minutes_pre))
            add_task(fechasepuedecancelardos,'revise_schedule_task(idschedule="'+str(schedule_time.id)+'")')
            contadortramos = contadortramos + 1

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
        
        num = int(request.GET['numerodetramos'])
        contadortramos = 0
        time_start_sp = request.GET['time_start'].split(',')
        time_end_sp = request.GET['time_end'].split(',')
        duration_sp = request.GET['duration'].split(',')
        while contadortramos < num:

            activity=Activities.objects.get(id=request.GET['activity_id'])
            schedule=Schedules()
            schedule.concrete=False
            schedule.monthly=request.GET['monthly']
            schedule.weekly=request.GET['weekly']
            schedule.activity=activity
            schedule.save()
            
            schedule_time=Schedules_times()
            schedule_time.time_start=time_start_sp[contadortramos]
            schedule_time.time_end=time_end_sp[contadortramos]
            schedule_time.duration=duration_sp[contadortramos]
            schedule_time.minutes_pre=request.GET['minutes_pre']
            schedule_time.minutes_post=request.GET['minutes_post']
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
            festivos = Parties.objects.all()
            while contador<=dias:
                if cadmeses[fechaprincipal.month-1]=='1':
                    if cadsemana[fechaprincipal.weekday()]=='1':
                        scheduleaux=Schedules()
                        scheduleaux.concrete=True
                        scheduleaux.date=fechaprincipal
                        scheduleaux.activity=activity
                        timbre = True
                        for fest in festivos:
                            if fest.date.year==fechaprincipal.year:
                                if fest.date.month==fechaprincipal.month:
                                    if fest.date.day==fechaprincipal.day:
                                        timbre = False
                        if timbre:
                            scheduleaux.save()
                            schedule_timeaux=Schedules_times()
                            schedule_timeaux.time_start=time_start_sp[contadortramos]
                            schedule_timeaux.time_end=time_end_sp[contadortramos]
                            schedule_timeaux.duration=duration_sp[contadortramos]
                            schedule_timeaux.minutes_pre=request.GET['minutes_pre']
                            schedule_timeaux.minutes_post=request.GET['minutes_post']
                            schedule_timeaux.schedule=scheduleaux
                            schedule_timeaux.save()
                            fechaparaactividaddos = datetime(schedule_timeaux.schedule.date.year, schedule_timeaux.schedule.date.month, schedule_timeaux.schedule.date.day, int(schedule_timeaux.time_start.split(':')[0]), int(schedule_timeaux.time_start.split(':')[1]), 0)
                            fechasepuedecancelardos = fechaparaactividaddos - timedelta(minutes=int(schedule_timeaux.minutes_pre))
                            add_task(fechasepuedecancelardos,'revise_schedule_task(idschedule="'+str(schedule_timeaux.id)+'")')
            

                fechaprincipal = fechaprincipal + timedelta(days=1)
                contador=contador+1
            contadortramos = contadortramos+1
            
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
        conf = Configuration.objects.get(id=1)
        for sch in schedule_time:
            '''fechaact = datetime(int(sch.schedule.date.year),int(sch.schedule.date.month),int(sch.schedule.date.day),0,0,0)
            fechahoy = datetime(int(datetime.today().year),int(datetime.today().month),int(datetime.today().day),0,0,0) - timedelta(days=conf.days_pre_show)
            fechanext = datetime(int(datetime.today().year),int(datetime.today().month),int(datetime.today().day),0,0,0) + timedelta(days=conf.days_pre)
            
            if fechahoy<=fechaact and fechanext>=fechaact:'''
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
            cad= cad + '<event><id>'+str(sch.id)+'</id>'+'<name>'+str(sch.schedule.activity)+'</name>'+'<startdate>'+startdate+'</startdate>'+'<starttime>'+str(sch.time_start)+'</starttime>'+'<endtime>'+str(sch.time_end)+'</endtime><oc>'+str(ocupadas)+'</oc><dis>'+str(disponibles)+'</dis><af>'+str(aforo)+'</af><afcol>'+str(aforocola)+'</afcol><discol>'+str(discol)+'</discol></event>'
        festivos=Parties.objects.all()
        for fest in festivos:
            fechi = fest.date
            festfech=str(fechi.year)+'-'+str(fechi.month)+'-'+str(fechi.day)
            cad= cad + '<event><id>'+str(fest.id)+'festivo</id>'+'<name>'+fest.name+'</name>'+'<startdate>'+festfech+'</startdate>'+'<color>#ff6a6a</color></event>'
        cad = cad + '</monthly>'

        context = {'error':''}
        fileName = os.path.join(os.path.abspath(os.path.dirname(__file__)) + '/../../../static/xml', 'calendario.xml')
        writeFile(cad, fileName, context)
        scheme = 'https://' if request.is_secure() else 'http://'
        urlfinal = scheme + request.get_host() + settings.STATIC_URL + 'xml/calendario.xml'
        data=json.dumps({'status':'success','response':'list_all_schedules','data':urlfinal})

    except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        data = json.dumps({
            'status':'failed',
            'response': e.args[0]+str(exc_tb.tb_lineno)+cad
        })

    return APIResponse(request,data)


def list_all_tabla(request):
    """
    List all schedules info
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not have_permission(request.session['auth_id'],'list_all_schedules'):
            raise Exception('unauthorized_list_all_schedules')

        user,auth = get_user_and_auth(request.session['auth_id'])
        conf = Configuration.objects.get(id=1)
        hoy = datetime(int(datetime.today().year),int(datetime.today().month),int(datetime.today().day),0,0,0)
        next = datetime(int(datetime.today().year),int(datetime.today().month),int(datetime.today().day),0,0,0) + timedelta(days=conf.days_table_show+1)
        schedule_time=Schedules_times.objects.filter(Q(schedule__concrete=1), Q(schedule__date__gte=hoy), Q(schedule__date__lte=next)).order_by('-schedule__activity__name')
        dia_semana_inicio = datetime.weekday(hoy)
        dias_a_mostrar = conf.days_table_show
        listacts=[]
        for sch in schedule_time:
            fechaact = datetime(int(sch.schedule.date.year),int(sch.schedule.date.month),int(sch.schedule.date.day),0,0,0)
            if fechaact >= hoy and fechaact <= next:
                '''fechaact = datetime(int(sch.schedule.date.year),int(sch.schedule.date.month),int(sch.schedule.date.day),0,0,0)
                fechahoy = datetime(int(datetime.today().year),int(datetime.today().month),int(datetime.today().day),0,0,0) - timedelta(days=conf.days_pre_show)
                fechanext = datetime(int(datetime.today().year),int(datetime.today().month),int(datetime.today().day),0,0,0) + timedelta(days=conf.days_pre)
                
                if fechahoy<=fechaact and fechanext>=fechaact:'''
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
                estado = 'DISPONIBLE'
                if disponibles == 0:
                    estado = 'COMPLETA'
                if datetime.now() >= (datetime(int(fechita.year),int(fechita.month),int(fechita.day),int(sch.time_start.hour),int(sch.time_start.minute),0) - timedelta(minutes=sch.minutes_pre)):
                    estado = 'CERRADA'
                if datetime.now() >= datetime(int(fechita.year),int(fechita.month),int(fechita.day),int(sch.time_start.hour),int(sch.time_start.minute),0):
                    estado = 'FINALIZADA'
                listacts.append({'id':str(sch.id),
                         'name':str(sch.schedule.activity),
                         'year':str(fechita.year),
                         'month':str(fechita.month),
                         'day':str(fechita.day),
                         'dayweek':str(datetime.weekday(fechita)),
                         'time_start':str(sch.time_start),
                         'time_end':str(sch.time_end),
                         'ocupadas':str(ocupadas),
                         'disponibles':str(disponibles),
                         'aforo':str(aforo),
                         'aforocola':str(aforocola),
                         'estado':estado,
                         'disponiblecola':str(discol)})
        festivos=Parties.objects.all()
        listfest=[]
        for fest in festivos:
            fechi = fest.date
            festfech=str(fechi.year)+'-'+str(fechi.month)+'-'+str(fechi.day)
            listfest.append({
                'id':str(fest.id),
                'name':fest.name,
                'year':str(fechi.year),
                'month':str(fechi.month),
                'day':str(fechi.day),
                'dayweek':str(datetime.weekday(fechi))})
    
        data=json.dumps({'status':'success','response':'list_all_schedules','data':{ 'dia_hoy':str(hoy.day), 'mes_hoy':str(hoy.month), 'year_hoy':str(hoy.year), 'hora_hoy':str(datetime.now().hour), 'minuto_hoy':str(datetime.now().minute), 'dia_semana_inicio': str(dia_semana_inicio), 'dias_a_mostrar':str(dias_a_mostrar), 'actividades':listacts, 'festivos':listfest}})

    except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        data = json.dumps({
            'status':'failed',
            'response': e.args[0]+str(exc_tb.tb_lineno)
        })

    return APIResponse(request,data)


def list_all_tabla_for_customers(request):
    """
    List all schedules info
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not have_permission(request.session['auth_id'],'list_all_schedules_for_customers'):
            raise Exception('unauthorized_list_all_schedules_for_customers')

        user,auth = get_user_and_auth(request.session['auth_id'])
        conf = Configuration.objects.get(id=1)
        fechahoy = datetime(int(datetime.today().year),int(datetime.today().month),int(datetime.today().day),0,0,0)
        fechanext = datetime(int(datetime.today().year),int(datetime.today().month),int(datetime.today().day),0,0,0) + timedelta(days=conf.days_pre+1)    
        schedule_time=Schedules_times.objects.filter(Q(schedule__concrete=1), Q(schedule__date__gte=fechahoy), Q(schedule__date__lte=fechanext)).order_by('-schedule__activity__name')
        hoy = datetime(int(datetime.today().year),int(datetime.today().month),int(datetime.today().day),0,0,0)
        #next = datetime(int(datetime.today().year),int(datetime.today().month),int(datetime.today().day),0,0,0) + timedelta(days=conf.days_table_show)
        dia_semana_inicio = datetime.weekday(hoy)
        #dias_a_mostrar = conf.days_table_show
        listacts=[]
        for sch in schedule_time:
            fechaact = datetime(int(sch.schedule.date.year),int(sch.schedule.date.month),int(sch.schedule.date.day),0,0,0)
            if fechahoy<=fechaact and fechanext>=fechaact:
                ahoramismo = datetime.today()
                fechaparaactividad = datetime(sch.schedule.date.year, sch.schedule.date.month, sch.schedule.date.day, sch.time_start.hour, sch.time_start.minute, 0)
                fechasepuedecancelar = fechaparaactividad - timedelta(minutes=sch.minutes_post)
                fechasepuedereservar = fechaparaactividad - timedelta(minutes=sch.minutes_pre)
                estado = 'DISPONIBLE'
                fechita = sch.schedule.date
                if datetime.now() >= (datetime(int(fechita.year),int(fechita.month),int(fechita.day),int(sch.time_start.hour),int(sch.time_start.minute),0) - timedelta(minutes=sch.minutes_pre)):
                    estado = 'CERRADA'
                if datetime.now() >= datetime(int(fechita.year),int(fechita.month),int(fechita.day),int(sch.time_start.hour),int(sch.time_start.minute),0):
                    estado = 'FINALIZADA'
                startdate=str(fechita.year)+'-'+str(fechita.month)+'-'+str(fechita.day)
                ocupadas = 0
                disponibles = 0
                aforo = sch.schedule.activity.max_capacity
                aforocola = sch.schedule.activity.queue_capacity
                reservations=Reservations.objects.filter(Q(schedule_time__id=sch.id))
                for res in reservations:
                    ocupadas = ocupadas + 1
                    if res.auth.id==auth.id and res.position_queue:
                        estado='EN COLA'
                    elif res.auth.id==auth.id and not res.position_queue:
                        estado='MI RESERVA'
                disponibles = aforo - ocupadas
                if disponibles < 1:
                    disponibles = 0;
                    if estado != 'MI RESERVA' and estado != 'EN COLA':
                        estado='COMPLETA'
                discol = ocupadas-aforo
                if discol < 0:
                    discol=0
                discol = aforocola - discol
                listacts.append({'id':str(sch.id),
                         'name':str(sch.schedule.activity),
                         'year':str(fechita.year),
                         'month':str(fechita.month),
                         'day':str(fechita.day),
                         'dayweek':str(datetime.weekday(fechita)),
                         'time_start':str(sch.time_start),
                         'time_end':str(sch.time_end),
                         'ocupadas':str(ocupadas),
                         'disponibles':str(disponibles),
                         'aforo':str(aforo),
                         'aforocola':str(aforocola),
                         'estado':estado,
                         'disponiblecola':str(discol)})
        festivos=Parties.objects.all()
        listfest=[]
        for fest in festivos:
            fechi = fest.date
            festfech=str(fechi.year)+'-'+str(fechi.month)+'-'+str(fechi.day)
            listfest.append({
                'id':str(fest.id),
                'name':fest.name,
                'year':str(fechi.year),
                'month':str(fechi.month),
                'day':str(fechi.day),
                'dayweek':str(datetime.weekday(fechi))})

        data=json.dumps({'status':'success','response':'list_all_schedules','data':{ 'dia_hoy':str(hoy.day), 'mes_hoy':str(hoy.month), 'year_hoy':str(hoy.year), 'hora_hoy':str(datetime.now().hour), 'minuto_hoy':str(datetime.now().minute), 'dia_semana_inicio': str(dia_semana_inicio), 'dias_a_mostrar':str(conf.days_pre), 'actividades':listacts, 'festivos':listfest}})

    except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        data = json.dumps({
            'status':'failed',
            'response': e.args[0]+str(exc_tb.tb_lineno)
        })

    return APIResponse(request,data)


def list_all_for_customers(request):
    """
    List all schedules info for customers
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not have_permission(request.session['auth_id'],'list_all_schedules_for_customers'):
            raise Exception('unauthorized_list_all_schedules_for_customers')

        user,auth = get_user_and_auth(request.session['auth_id'])
        schedule_time=Schedules_times.objects.filter(Q(schedule__concrete=1)).order_by('time_start')
        cad ='<?xml version="1.0"?><monthly>'
        conf = Configuration.objects.get(id=1)
        for sch in schedule_time:
            fechaact = datetime(int(sch.schedule.date.year),int(sch.schedule.date.month),int(sch.schedule.date.day),0,0,0)
            fechahoy = datetime(int(datetime.today().year),int(datetime.today().month),int(datetime.today().day),0,0,0) - timedelta(days=conf.days_pre_show)
            fechanext = datetime(int(datetime.today().year),int(datetime.today().month),int(datetime.today().day),0,0,0) + timedelta(days=conf.days_pre)
            
            if fechahoy<=fechaact and fechanext>=fechaact:
                conf = Configuration.objects.get(id=1)
                ahoramismo = datetime.today()
                fechaparaactividad = datetime(sch.schedule.date.year, sch.schedule.date.month, sch.schedule.date.day, sch.time_start.hour, sch.time_start.minute, 0)
                fechasepuedecancelar = fechaparaactividad - timedelta(minutes=sch.minutes_post)
                fechasepuedereservar = fechaparaactividad - timedelta(minutes=sch.minutes_pre)
                cadsepuedereservar = '<sepuedereservar>SI</sepuedereservar>'
                if fechasepuedereservar <= ahoramismo:
                    cadsepuedereservar = '<sepuedereservar>NO</sepuedereservar>'
                cadsepuedecancelar = '<sepuedecancelar>SI</sepuedecancelar>'
                if fechasepuedecancelar <= ahoramismo:
                    cadsepuedecancelar = '<sepuedecancelar>NO</sepuedecancelar>'
                fechita = sch.schedule.date
                startdate=str(fechita.year)+'-'+str(fechita.month)+'-'+str(fechita.day)
                ocupadas = 0
                disponibles = 0
                aforo = sch.schedule.activity.max_capacity
                aforocola = sch.schedule.activity.queue_capacity
                reservations=Reservations.objects.filter(Q(schedule_time__id=sch.id))
                yareservada = '<yareservada>NO</yareservada>'
                for res in reservations:
                    ocupadas = ocupadas + 1
                    if res.auth.id==auth.id:
                        yareservada='<yareservada>SI</yareservada>'
                disponibles = aforo - ocupadas
                if disponibles < 0:
                    disponibles = 0;
                discol = ocupadas-aforo
                if discol < 0:
                    discol=0
                discol = aforocola - discol
                cad= cad + '<event><id>'+str(sch.id)+'</id>'+'<name>'+str(sch.schedule.activity)+'</name>'+'<startdate>'+startdate+'</startdate>'+'<starttime>'+str(sch.time_start)+'</starttime>'+'<endtime>'+str(sch.time_end)+'</endtime><oc>'+str(ocupadas)+'</oc><dis>'+str(disponibles)+'</dis><af>'+str(aforo)+'</af><afcol>'+str(aforocola)+'</afcol><discol>'+str(discol)+'</discol>'+yareservada+cadsepuedereservar+cadsepuedecancelar+'</event>'
        festivos=Parties.objects.all()
        for fest in festivos:
            fechi = fest.date
            festfech=str(fechi.year)+'-'+str(fechi.month)+'-'+str(fechi.day)
            cad= cad + '<event><id>'+str(fest.id)+'festivo</id>'+'<name>'+fest.name+'</name>'+'<startdate>'+festfech+'</startdate>'+'<color>#ff6a6a</color></event>'
        cad = cad + '</monthly>'

        context = {'error':''}
        fileName = os.path.join(os.path.abspath(os.path.dirname(__file__)) + '/../../../static/xml', 'calendarioclientes.xml')
        writeFile(cad, fileName, context)
        scheme = 'https://' if request.is_secure() else 'http://'
        urlfinal = scheme + request.get_host() + settings.STATIC_URL + 'xml/calendarioclientes.xml'
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
            name = 'User_Id'+str(res.auth.id)
            nick = 'User_Id'+str(res.auth.id)
            phone = '+34'+str(res.auth.phone)
            message = 'Su reserva para '+str(res.schedule_time.schedule.activity)+' el '+str(res.schedule_time.schedule.date.day)+'-'+str(res.schedule_time.schedule.date.month)+'-'+str(res.schedule_time.schedule.date.year)+' de '+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[1]+' ha sido CANCELADA.'
            cu = U_Customers.objects.filter(Q(auth__id=res.auth.id))
            for c in cu:
                if c.emailnotif:
                    send_email_cancel_reservation(str(res.auth.id),str(res.id))
                if c.telegramnotif:
                    add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
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

        reservation=Reservations.objects.get(id=request.GET['id'])
        user,auth = get_user_and_auth(reservation.auth.id)
        if reservation.queue:
            position = reservation.position_queue
            schedule_time_id = reservation.schedule_time.id
            if not user.vip:
                user.credit_wod = user.credit_wod + reservation.schedule_time.schedule.activity.credit_wod
                user.credit_box = user.credit_box + reservation.schedule_time.schedule.activity.credit_box
                user.save()
            name = 'User_Id'+str(auth.id)
            nick = 'User_Id'+str(auth.id)
            phone = '+34'+str(auth.phone)
            message = 'Su suscripción en la cola para '+str(reservation.schedule_time.schedule.activity)+' el '+str(reservation.schedule_time.schedule.date.day)+'-'+str(reservation.schedule_time.schedule.date.month)+'-'+str(reservation.schedule_time.schedule.date.year)+' de '+get_string_from_date(reservation.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(reservation.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(reservation.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(reservation.schedule_time.time_end).split(' ')[1].split(':')[1]+' ha sido CANCELADA, su posición en la cola será eliminada.'
            if user.emailnotif:
                send_email_cancel_reservation_cola(str(user.id),str(reservation.id))
            if user.telegramnotif:
                add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
            reservation.delete()
            reservations=Reservations.objects.filter(Q(schedule_time__id=schedule_time_id) & Q(queue=True))
            for res in reservations:
                if res.position_queue > position:
                    res.position_queue = res.position_queue - 1
                    res.save()
        else:
            schedule_time_id = reservation.schedule_time.id
            if not user.vip:
                user.credit_wod = user.credit_wod + reservation.schedule_time.schedule.activity.credit_wod
                user.credit_box = user.credit_box + reservation.schedule_time.schedule.activity.credit_box
                user.save()
            name = 'User_Id'+str(user.auth.id)
            nick = 'User_Id'+str(user.auth.id)
            phone = '+34'+str(user.auth.phone)
            message = 'Su reserva para '+str(reservation.schedule_time.schedule.activity)+' el '+str(reservation.schedule_time.schedule.date.day)+'-'+str(reservation.schedule_time.schedule.date.month)+'-'+str(reservation.schedule_time.schedule.date.year)+' de '+get_string_from_date(reservation.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(reservation.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(reservation.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(reservation.schedule_time.time_end).split(' ')[1].split(':')[1]+' ha sido CANCELADA.'
            if user.emailnotif:
                send_email_cancel_reservation(str(user.auth.id),str(reservation.id))
            if user.telegramnotif:
                add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
            reservation.delete()
            reservations=Reservations.objects.filter(Q(schedule_time__id=schedule_time_id) & Q(queue=True))
            for res in reservations:
                if res.position_queue==1:
                    res.queue=False
                    res.position_queue=None
                    res.save()

                    name = 'User_Id'+str(res.auth.id)
                    nick = 'User_Id'+str(res.auth.id)
                    phone = '+34'+str(res.auth.phone)
                    conf=Configuration.objects.get(id=1)
                    minutitos=res.schedule_time.minutes_post
                    cadminutitos = ''
                    if minutitos >=100:
                        cadminutitos = str(minutitos/60) + ' horas'
                    else:
                        cadminutitos = str(minutitos) + ' minutos'
    
                    message = 'Ha quedado libre una plaza para '+str(res.schedule_time.schedule.activity)+' el '+str(res.schedule_time.schedule.date.day)+'-'+str(res.schedule_time.schedule.date.month)+'-'+str(res.schedule_time.schedule.date.year)+' de '+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[1]+'. Acabamos de registrar su reserva. Puedes cancelar la reserva hasta '+cadminutitos+' antes de la actividad'
                    cu = U_Customers.objects.filter(Q(auth__id=res.auth.id))
                    for c in cu:
                        if c.emailnotif:
                            add_task(datetime.utcnow(),'send_email_cambiocolaareserva_reservation_task(auth_id="'+str(res.auth.id)+'",res_id="'+str(res.id)+'")')
                        if c.telegramnotif:
                            add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
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


def delete_reservation_client(request):
    """
    Delete reservation
    """
    
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')

        if not have_permission(request.session['auth_id'], 'delete_reservation_client'):
            raise Exception('unauthorized_delete_reservation_client')

        if not validate_parameter(request.GET, 'schedule_time_id'):
            raise Exception('schedule_time_id_missed')
        conf = Configuration.objects.get(id=1)
        user,auth = get_user_and_auth(request.session['auth_id'])
        schedule_time = Schedules_times.objects.get(id=request.GET['schedule_time_id'])
        reservations=Reservations.objects.filter(Q(schedule_time__id=request.GET['schedule_time_id']) & Q(auth__id=auth.id))
        for reservation in reservations:
            ahoramismo = datetime.today()
            fechaparaactividad = datetime(schedule_time.schedule.date.year, schedule_time.schedule.date.month, schedule_time.schedule.date.day, schedule_time.time_start.hour, schedule_time.time_start.minute, 0)
            fechaparaactividad = fechaparaactividad - timedelta(minutes=schedule_time.minutes_post)
            if fechaparaactividad <= ahoramismo:
                raise Exception('Ya es demasiado tarde para cancelar su reserva')
            if reservation.queue:
                position = reservation.position_queue
                schedule_time_id = reservation.schedule_time.id
                if not user.vip:
                    user.credit_wod = user.credit_wod + reservation.schedule_time.schedule.activity.credit_wod
                    user.credit_box = user.credit_box + reservation.schedule_time.schedule.activity.credit_box
                    user.save()
                name = 'User_Id'+str(auth.id)
                nick = 'User_Id'+str(auth.id)
                phone = '+34'+str(auth.phone)
                message = 'Su suscripción en la cola para '+str(reservation.schedule_time.schedule.activity)+' el '+str(reservation.schedule_time.schedule.date.day)+'-'+str(reservation.schedule_time.schedule.date.month)+'-'+str(reservation.schedule_time.schedule.date.year)+' de '+get_string_from_date(reservation.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(reservation.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(reservation.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(reservation.schedule_time.time_end).split(' ')[1].split(':')[1]+' ha sido CANCELADA, su posición en la cola será eliminada.'
                if user.emailnotif:
                    add_task(datetime.utcnow(),'send_email_cancel_reservation_cola_task(cus_id="'+str(user.id)+'",res_id="'+str(reservation.id)+'")')
                if user.telegramnotif:
                    add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
                reservation.delete()
                reservations=Reservations.objects.filter(Q(schedule_time__id=schedule_time_id) & Q(queue=True))
                for res in reservations:
                    if res.position_queue > position:
                        res.position_queue = res.position_queue - 1
                        res.save()
            else:
                schedule_time_id = reservation.schedule_time.id
                if not user.vip:
                    user.credit_wod = user.credit_wod + reservation.schedule_time.schedule.activity.credit_wod
                    user.credit_box = user.credit_box + reservation.schedule_time.schedule.activity.credit_box
                    user.save()
                name = 'User_Id'+str(user.auth.id)
                nick = 'User_Id'+str(user.auth.id)
                phone = '+34'+str(user.auth.phone)
                message = 'Su reserva para '+str(reservation.schedule_time.schedule.activity)+' el '+str(reservation.schedule_time.schedule.date.day)+'-'+str(reservation.schedule_time.schedule.date.month)+'-'+str(reservation.schedule_time.schedule.date.year)+' de '+get_string_from_date(reservation.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(reservation.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(reservation.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(reservation.schedule_time.time_end).split(' ')[1].split(':')[1]+' ha sido CANCELADA.'
                if user.emailnotif:
                    send_email_cancel_reservation(str(user.auth.id),str(reservation.id))
                if user.telegramnotif:
                    add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
                reservation.delete()
                reservations=Reservations.objects.filter(Q(schedule_time__id=schedule_time_id) & Q(queue=True))
                for res in reservations:
                    if res.position_queue==1:
                        res.queue=False
                        res.position_queue=None
                        res.save()
                        name = 'User_Id'+str(res.auth.id)
                        nick = 'User_Id'+str(res.auth.id)
                        phone = '+34'+str(res.auth.phone)
                        conf=Configuration.objects.get(id=1)
                        minutitos=res.schedule_time.minutes_post
                        cadminutitos = ''
                        if minutitos >=100:
                            cadminutitos = str(minutitos/60) + ' horas'
                        else:
                            cadminutitos = str(minutitos) + ' minutos'
                        message = 'Ha quedado libre una plaza para '+str(res.schedule_time.schedule.activity)+' el '+str(res.schedule_time.schedule.date.day)+'-'+str(res.schedule_time.schedule.date.month)+'-'+str(res.schedule_time.schedule.date.year)+' de '+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[1]+'. Acabamos de registrar su reserva. Puedes cancelar la reserva hasta '+cadminutitos+' antes de la actividad'
                        cu = U_Customers.objects.filter(Q(auth__id=res.auth.id))
                        for c in cu:
                            if c.emailnotif:
                                add_task(datetime.utcnow(),'send_email_cambiocolaareserva_reservation_task(auth_id="'+str(res.auth.id)+'",res_id="'+str(res.id)+'")')
                            if c.telegramnotif:
                                add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
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


def get_foreign_reservations_customer(request):
    """
    Get foreign reservations
    """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'get_foreign_reservations_customer'):
            if validate_parameter(request.GET,'id'):
                try:
                    reservations=Reservations.objects.filter(Q(auth_id=request.GET['id']))
                    reservations_profile=[]
                    for res in reservations:
                        reservations_profile.append({'id':res.id,
                                 'name':res.auth.name,
                                 'surname':res.auth.surname,
                                 'email':res.auth.email,
                                 'queue':res.queue,
                                 'position_queue':res.position_queue,
                                 'date':get_string_from_date(res.date),
                                 'phone':res.auth.phone,
                                 'time_start':get_string_from_date(res.schedule_time.time_start),
                                 'time_end':get_string_from_date(res.schedule_time.time_end),
                                 'activity':res.schedule_time.schedule.activity.name})  

                    data=json.dumps({'status':'success','response':'get_foreign_reservations_customer','data':{'reservations':reservations_profile}})
                except Exception as e:
                    data=json.dumps({'status':'failed','response':e.args[0]})
            else:
                data=json.dumps({'status':'failed','response':'id_missed'})
        else:
            data=json.dumps({'status':'failed','response':'unauthorized_get_foreign_reservations_customer'})
    else:
        data=json.dumps({'status':'failed','response':'not_logged'})
    return APIResponse(request,data)

def get_reservations_customer(request):
    """
    Get foreign reservations
    """
    if 'auth_id' not in request.session:
        raise Exception('not_logged')

    if not have_permission(request.session['auth_id'], 'delete_reservation_client'):
        raise Exception('unauthorized_delete_reservation_client')

    try:
        user,auth = get_user_and_auth(request.session['auth_id'])
        reservations=Reservations.objects.filter(Q(auth_id=auth.id))
        reservations_profile=[]
        for res in reservations:
            reservations_profile.append({'id':res.id,
                                 'name':res.auth.name,
                                 'surname':res.auth.surname,
                                 'email':res.auth.email,
                                 'queue':res.queue,
                                 'position_queue':res.position_queue,
                                 'date':get_string_from_date(res.date),
                                 'phone':res.auth.phone,
                                 'time_start':get_string_from_date(res.schedule_time.time_start),
                                 'time_end':get_string_from_date(res.schedule_time.time_end),
                                 'activity':res.schedule_time.schedule.activity.name})  

        data=json.dumps({'status':'success','response':'get_foreign_reservations_customer','data':{'reservations':reservations_profile}})
    except Exception as e:
        data=json.dumps({'status':'failed','response':e.args[0]})
            
    return APIResponse(request,data)



def get_foreign_pagos_customer(request):
    """
    Get foreign reservations
    """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'get_foreign_pagos_customer'):
            if validate_parameter(request.GET,'id'):
                try:
                    pagos=Pagos.objects.filter(Q(auth_id=request.GET['id']))
                    pagos_profile=[]
                    customer=get_user(request.GET['id'])
                    for pay in pagos:
                        if customer.pago_en_curso.id==pay.id:
                            pay.credit_wod=customer.credit_wod
                            pay.credit_box=customer.credit_box
                            pay.credit_bono=customer.credit_bono
                            pay.save()
                        pagos_profile.append({'id':pay.id,
                                 'date':get_string_from_date(pay.date),
                                 'rate':pay.rate.name,
                                 'credit_wod':pay.credit_wod,
                                 'credit_wod_total':pay.credit_wod_total,
                                 'credit_box':pay.credit_box,
                                 'credit_box_total':pay.credit_box_total,
                                 'credit_bono':pay.credit_bono,
                                 'credit_bono_total':pay.credit_bono_total})  

                    data=json.dumps({'status':'success','response':'get_foreign_pagos_customer','data':{'pagos':pagos_profile}})
                except Exception as e:
                    data=json.dumps({'status':'failed','response':e.args[0]})
            else:
                data=json.dumps({'status':'failed','response':'id_missed'})
        else:
            data=json.dumps({'status':'failed','response':'unauthorized_get_foreign_pagos_customer'})
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
                    customer=get_user(request.session['auth_id'])
                    schedule_time=Schedules_times.objects.get(id=request.GET['id'])
                    configuration=Configuration.objects.get(id=1)
                    aforo=schedule_time.schedule.activity.max_capacity
                    aforocola=schedule_time.schedule.activity.queue_capacity
                    reservations=Reservations.objects.filter(Q(schedule_time__id=schedule_time.id))
                    ocupadas=0
                    ocupadascola=0
                    list=[]
                    for res in reservations:
                        list.append({'id':res.auth.id, 'name':res.auth.name + ' ' + res.auth.surname})
                        if res.queue:
                            ocupadascola = ocupadascola + 1
                        else:
                            ocupadas = ocupadas + 1  
                    disponibles=aforo - ocupadas
                    disponiblescola=aforocola - ocupadascola
                    if is_role(request.session['auth_id'],'U_Customers'):
                        data=json.dumps({'status':'success','response':'hay_plazas_schedule','data':{'days_pre':configuration.days_pre, 'minimo':schedule_time.schedule.activity.min_capacity, 'customers':list, 'minutes_pre':schedule_time.minutes_pre, 'minutes_post':schedule_time.minutes_post, 'credit_bono':customer.credit_bono, 'credit_wod':customer.credit_wod, 'credit_box':customer.credit_box, 'credit_box_total':customer.rate.credit_box, 'credit_wod_total':customer.rate.credit_wod, 'time_end':get_string_from_date(schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(schedule_time.time_end).split(' ')[1].split(':')[1], 'time_start':get_string_from_date(schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(schedule_time.time_start).split(' ')[1].split(':')[1], 'year':schedule_time.schedule.date.year, 'mes':schedule_time.schedule.date.month, 'dia':schedule_time.schedule.date.day, 'dia_semana':datetime.weekday(schedule_time.schedule.date), 'activity':schedule_time.schedule.activity.name, 'activity_desc':schedule_time.schedule.activity.description , 'consume_box':schedule_time.schedule.activity.credit_box, 'consume_wod':schedule_time.schedule.activity.credit_wod, 'aforo':str(aforo), 'minutos':schedule_time.minutes_post, 'aforo_cola':str(aforocola), 'disponibles':str(disponibles), 'disponibles_cola':str(disponiblescola), 'ocupadas':str(ocupadas), 'ocupadas_cola':str(ocupadascola)}})
                    else:
                        data=json.dumps({'status':'success','response':'hay_plazas_schedule','data':{'days_pre':configuration.days_pre, 'minimo':schedule_time.schedule.activity.min_capacity, 'customers':list, 'minutes_pre':schedule_time.minutes_pre, 'minutes_post':schedule_time.minutes_post, 'credit_bono':0, 'credit_wod':0, 'credit_box':0, 'credit_box_total':0, 'credit_wod_total':0, 'time_end':get_string_from_date(schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(schedule_time.time_end).split(' ')[1].split(':')[1], 'time_start':get_string_from_date(schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(schedule_time.time_start).split(' ')[1].split(':')[1], 'year':schedule_time.schedule.date.year, 'mes':schedule_time.schedule.date.month, 'dia':schedule_time.schedule.date.day, 'dia_semana':datetime.weekday(schedule_time.schedule.date), 'activity':schedule_time.schedule.activity.name, 'activity_desc':schedule_time.schedule.activity.description , 'consume_box':schedule_time.schedule.activity.credit_box, 'consume_wod':schedule_time.schedule.activity.credit_wod, 'aforo':str(aforo), 'minutos':schedule_time.minutes_post, 'aforo_cola':str(aforocola), 'disponibles':str(disponibles), 'disponibles_cola':str(disponiblescola), 'ocupadas':str(ocupadas), 'ocupadas_cola':str(ocupadascola)}})    
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
        '''
        conf = Configuration.objects.get(id=1)
        ahoramismo = datetime.today()
        fechaparaactividad = datetime(schedule_time.schedule.date.year, schedule_time.schedule.date.month, schedule_time.schedule.date.day, schedule_time.time_start.hour, schedule_time.time_start.minute, 0)
        fechaparaactividad = fechaparaactividad - timedelta(minutes=conf.minutes_pre)
        if fechaparaactividad <= ahoramismo:
            raise Exception('Ya es demasiado tarde para reservar plaza en esta actividad') '''
        if disponibles > 0:
            reservation = Reservations()
            reservation.auth = auth
            reservation.date = datetime.utcnow()
            reservation.queue = False
            reservation.schedule_time = schedule_time
            if not customer.vip:
                customer.credit_wod = customer.credit_wod - schedule_time.schedule.activity.credit_wod
                customer.credit_box = customer.credit_box - schedule_time.schedule.activity.credit_box
                customer.save()
            reservation.save()
            fechaparaactividad = datetime(reservation.schedule_time.schedule.date.year, reservation.schedule_time.schedule.date.month, reservation.schedule_time.schedule.date.day, int(reservation.schedule_time.time_start.split(':')[0]), int(reservation.schedule_time.time_start.split(':')[1]), 0)
            fechasepuedecancelar = fechaparaactividad - timedelta(minutes=reservation.schedule_time.minutes_pre)
            add_task(fechasepuedecancelardos,'revise_reservation_task(idreservation="'+str(reservation.id)+'")')
            name = 'User_Id'+str(auth.id)
            nick = 'User_Id'+str(auth.id)
            phone = '+34'+str(auth.phone)
            conf=Configuration.objects.get(id=1)
            minutitos=reservation.schedule_time.minutes_post
            cadminutitos = ''
            if minutitos >=100:
                cadminutitos = str(minutitos/60) + ' horas'
            else:
                cadminutitos = str(minutitos) + ' minutos'
            message = 'Acabas de realizar una reserva para '+str(reservation.schedule_time.schedule.activity)+' el '+str(reservation.schedule_time.schedule.date.day)+'-'+str(reservation.schedule_time.schedule.date.month)+'-'+str(reservation.schedule_time.schedule.date.year)+' de '+get_string_from_date(reservation.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(reservation.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(reservation.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(reservation.schedule_time.time_end).split(' ')[1].split(':')[1]+'. Te recordamos que si deseas cancelarla, puedes hacerlo hasta '+cadminutitos+' antes de la actividad.'
            if customer.emailnotif:
                add_task(datetime.utcnow(),'send_email_new_reservation_task(cus_id="'+str(customer.id)+'",res_id="'+str(reservation.id)+'")')
            if customer.telegramnotif:
                add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
        elif disponiblescola > 0:
            reservation = Reservations()
            reservation.auth = auth
            reservation.date = datetime.utcnow()
            reservation.queue = True
            reservation.position_queue = (aforocola - disponiblescola) + 1
            reservation.schedule_time = schedule_time
            if not customer.vip:
                customer.credit_wod = customer.credit_wod - schedule_time.schedule.activity.credit_wod
                customer.credit_box = customer.credit_box - schedule_time.schedule.activity.credit_box
                customer.save()
            reservation.save()
            fechaparaactividad = datetime(reservation.schedule_time.schedule.date.year, reservation.schedule_time.schedule.date.month, reservation.schedule_time.schedule.date.day, int(reservation.schedule_time.time_start.split(':')[0]), int(reservation.schedule_time.time_start.split(':')[1]), 0)
            fechasepuedecancelar = fechaparaactividad - timedelta(minutes=reservation.schedule_time.minutes_pre)
            add_task(fechasepuedecancelardos,'revise_reservation_task(idreservation="'+str(reservation.id)+'")')
            name = 'User_Id'+str(auth.id)
            nick = 'User_Id'+str(auth.id)
            phone = '+34'+str(auth.phone)
            message = 'Acabas de ponerte en cola para '+str(schedule_time.schedule.activity)+' el '+str(schedule_time.schedule.date.day)+'-'+str(schedule_time.schedule.date.month)+'-'+str(schedule_time.schedule.date.year)+' de '+get_string_from_date(schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(schedule_time.time_end).split(' ')[1].split(':')[1]+'. Cuando alguna plaza quede libre, su petición se procesará y se realizará la reserva.'
            if customer.emailnotif:
                add_task(datetime.utcnow(),'send_email_new_reservation_cola_task(cus_id="'+str(customer.id)+'",res_id="'+str(reservation.id)+'")')
            if customer.telegramnotif:
                add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
        else:
            raise Exception('No hay plazas disponibles')
            
        data=json.dumps({'status':'success','response':'reservation_created','data':{'id':reservation.id}})
    
    except Exception as e:
        data = json.dumps({'status':'failed', 'response': e.args[0] })

    return APIResponse(request,data)


def add_reservation_client(request):
    """
    Creates a new reservation
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not is_role(request.session['auth_id'],'U_Customers'):
            raise Exception('not_customer')
        if not have_permission(request.session['auth_id'],'add_reservation_client'):
            raise Exception('unauthorized_add_reservation_client')
        if not validate_parameter(request.GET, 'schedule_time_id'):
            raise Exception(field+'_missed')
        customer=get_user(request.session['auth_id'])
        schedule_time=Schedules_times.objects.get(id=request.GET['schedule_time_id'])
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
        conf = Configuration.objects.get(id=1)
        ahoramismo = datetime.today()
        fechaparaactividad = datetime(schedule_time.schedule.date.year, schedule_time.schedule.date.month, schedule_time.schedule.date.day, schedule_time.time_start.hour, schedule_time.time_start.minute, 0)
        fechaparaactividad = fechaparaactividad - timedelta(minutes=schedule_time.minutes_pre)
        
        consumo_wod = schedule_time.schedule.activity.credit_wod
        consumo_box = schedule_time.schedule.activity.credit_box
        mequedanbox = customer.credit_box
        mequedanwod = customer.credit_wod
        if not customer.validated:
            raise Exception('Cliente no validado')
        if not customer.vip:
            if mequedanwod==0 and mequedanbox==0:
                raise Exception('No te quedan créditos para reservar')
            if mequedanwod==0 and mequedanbox<consumo_box:
                raise Exception('No te quedan créditos para reservar')
            if mequedanbox==0 and mequedanwod<consumo_wod:
                raise Exception('No te quedan créditos para reservar')
            if mequedanwod!=0 and mequedanbox!=0 and mequedanbox<consumo_box and mequedanwod<consumo_wod:
                raise Exception('No te quedan créditos para reservar')
            if fechaparaactividad <= ahoramismo:
                raise Exception('Ya es demasiado tarde para reservar plaza en esta actividad')
        if disponibles > 0:
            reservation = Reservations()
            reservation.auth = auth
            reservation.date = datetime.utcnow()
            reservation.queue = False
            reservation.schedule_time = schedule_time
            if not customer.vip:
                customer.credit_wod = customer.credit_wod - schedule_time.schedule.activity.credit_wod
                customer.credit_box = customer.credit_box - schedule_time.schedule.activity.credit_box
                customer.save()
            reservation.save()
            fechaparaactividad = datetime(reservation.schedule_time.schedule.date.year, reservation.schedule_time.schedule.date.month, reservation.schedule_time.schedule.date.day, int(reservation.schedule_time.time_start.split(':')[0]), int(reservation.schedule_time.time_start.split(':')[1]), 0)
            fechasepuedecancelar = fechaparaactividad - timedelta(minutes=reservation.schedule_time.minutes_pre)
            add_task(fechasepuedecancelardos,'revise_reservation_task(idreservation="'+str(reservation.id)+'")')
            name = 'User_Id'+str(auth.id)
            nick = 'User_Id'+str(auth.id)
            phone = '+34'+str(auth.phone)
            conf=Configuration.objects.get(id=1)
            minutitos=reservation.schedule_time.minutes_post
            cadminutitos = ''
            if minutitos >=100:
                cadminutitos = str(minutitos/60) + ' horas'
            else:
                cadminutitos = str(minutitos) + ' minutos'
            message = 'Acabas de realizar una reserva para '+str(reservation.schedule_time.schedule.activity)+' el '+str(reservation.schedule_time.schedule.date.day)+'-'+str(reservation.schedule_time.schedule.date.month)+'-'+str(reservation.schedule_time.schedule.date.year)+' de '+get_string_from_date(reservation.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(reservation.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(reservation.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(reservation.schedule_time.time_end).split(' ')[1].split(':')[1]+'. Te recordamos que si deseas cancelarla, puedes hacerlo hasta '+cadminutitos+' antes de la actividad.'
            if customer.emailnotif:
                add_task(datetime.utcnow(),'send_email_new_reservation_task(cus_id="'+str(customer.id)+'",res_id="'+str(reservation.id)+'")')
            if customer.telegramnotif:
                add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
        elif disponiblescola > 0:
            reservation = Reservations()
            reservation.auth = auth
            reservation.date = datetime.utcnow()
            reservation.queue = True
            reservation.position_queue = (aforocola - disponiblescola) + 1
            reservation.schedule_time = schedule_time
            if not customer.vip:
                customer.credit_wod = customer.credit_wod - schedule_time.schedule.activity.credit_wod
                customer.credit_box = customer.credit_box - schedule_time.schedule.activity.credit_box
                customer.save()
            reservation.save()
            fechaparaactividad = datetime(reservation.schedule_time.schedule.date.year, reservation.schedule_time.schedule.date.month, reservation.schedule_time.schedule.date.day, int(reservation.schedule_time.time_start.split(':')[0]), int(reservation.schedule_time.time_start.split(':')[1]), 0)
            fechasepuedecancelar = fechaparaactividad - timedelta(minutes=reservation.schedule_time.minutes_pre)
            add_task(fechasepuedecancelardos,'revise_reservation_task(idreservation="'+str(reservation.id)+'")')
            name = 'User_Id'+str(auth.id)
            nick = 'User_Id'+str(auth.id)
            phone = '+34'+str(auth.phone)
            conf=Configuration.objects.get(id=1)
            minutitos=reservation.schedule_time.minutes_post
            cadminutitos = ''
            if minutitos >=100:
                cadminutitos = str(minutitos/60) + ' horas'
            else:
                cadminutitos = str(minutitos) + ' minutos'
            message = 'Acabas de ponerte en cola para '+str(schedule_time.schedule.activity)+' el '+str(schedule_time.schedule.date.day)+'-'+str(schedule_time.schedule.date.month)+'-'+str(schedule_time.schedule.date.year)+' de '+get_string_from_date(schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(schedule_time.time_end).split(' ')[1].split(':')[1]+'. Cuando alguna plaza quede libre, su petición se procesará y se realizará la reserva.'
            if customer.emailnotif:
                add_task(datetime.utcnow(),'send_email_new_reservation_cola_task(cus_id="'+str(customer.id)+'",res_id="'+str(reservation.id)+'")')
            if customer.telegramnotif:
                add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
        else:
            raise Exception('No hay plazas disponibles')
        
        data=json.dumps({'status':'success','response':'reservation_created','data':{'id':reservation.id}})
    
    except Exception as e:
        data = json.dumps({'status':'failed', 'response': e.args[0] })

    return APIResponse(request,data)


def list_parties(request):
    """
    List all parties info
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not have_permission(request.session['auth_id'],'list_parties'):
            raise Exception('unauthorized_list_parties')

        user,auth = get_user_and_auth(request.session['auth_id'])
        parties=Parties.objects.all()
        list=[]
        for party in parties:
            list.append({'id':party.id,
                         'name':party.name,
                         'date':get_string_from_date(party.date)})


        data=json.dumps({'status':'success','response':'list_parties','data':list})

    except Exception as e:
        data = json.dumps({
            'status':'failed',
            'response': e.args[0]
        })

    return APIResponse(request,data)


def list_dnis(request):
    """
    List all dnis info
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not have_permission(request.session['auth_id'],'list_dnis'):
            raise Exception('unauthorized_list_dnis')

        user,auth = get_user_and_auth(request.session['auth_id'])
        dnis=Dnis.objects.all()
        list=[]
        for dn in dnis:
            list.append({'id':dn.id,
                         'nif':dn.nif})


        data=json.dumps({'status':'success','response':'list_dnis','data':list})

    except Exception as e:
        data = json.dumps({
            'status':'failed',
            'response': e.args[0]
        })

    return APIResponse(request,data)


def delete_party(request):
    """
    Delete party
    """
    
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')

        if not have_permission(request.session['auth_id'], 'delete_party'):
            raise Exception('unauthorized_delete_party')

        if not validate_parameter(request.GET, 'id'):
            raise Exception('party_id_missed')

        
        party=Parties.objects.get(id=request.GET['id'])
        party.delete()
        
        data = json.dumps( { 'status': 'success', 'response': 'party_deleted'} )
       
    except Parties.DoesNotExist:
        data = json.dumps({'status': 'failed', 'response': 'party_not_found'})

    except Exception as e:
        data = json.dumps({
            'status':'failed',
            'response': e.args[0]
        })

    return APIResponse(request=request, data=data)


def delete_dni(request):
    """
    Delete dni
    """
    
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')

        if not have_permission(request.session['auth_id'], 'delete_dni'):
            raise Exception('unauthorized_delete_dni')

        if not validate_parameter(request.GET, 'id'):
            raise Exception('dni_id_missed')

        
        dni=Dnis.objects.get(id=request.GET['id'])
        dni.delete()
        
        data = json.dumps( { 'status': 'success', 'response': 'dni_deleted'} )
       
    except Dnis.DoesNotExist:
        data = json.dumps({'status': 'failed', 'response': 'dni_not_found'})

    except Exception as e:
        data = json.dumps({
            'status':'failed',
            'response': e.args[0]
        })

    return APIResponse(request=request, data=data)



def add_party(request):
    """
    Creates a new party
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not have_permission(request.session['auth_id'],'add_party'):
            raise Exception('unauthorized_add_party')
            
        for field in ('name','date'):
            if not validate_parameter(request.GET, field):
                raise Exception(field+'_missed')
        
        party=Parties()
        fechazocad=str(request.GET['date']).split('-')
        party.date=datetime(int(fechazocad[0]), int(fechazocad[1]),int(fechazocad[2]), 12, 12, 12)
        party.name=request.GET['name']
        party.save()
        schedules_times=Schedules_times.objects.filter(Q(schedule__concrete=True))
        for sch in schedules_times:
            if sch.schedule.date.year==int(fechazocad[0]):
                if sch.schedule.date.month==int(fechazocad[1]):
                    if sch.schedule.date.day==int(fechazocad[2]):
                        schedule=sch.schedule
                        reservations=Reservations.objects.filter(Q(schedule_time__id=sch.id))
                        for res in reservations:
                            name = 'User_Id'+str(res.auth.id)
                            nick = 'User_Id'+str(res.auth.id)
                            phone = '+34'+str(res.auth.phone)
                            message = 'Su reserva para '+str(res.schedule_time.schedule.activity)+' el '+str(res.schedule_time.schedule.date.day)+'-'+str(res.schedule_time.schedule.date.month)+'-'+str(res.schedule_time.schedule.date.year)+' de '+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_start).split(' ')[1].split(':')[1]+' a '+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[0]+':'+get_string_from_date(res.schedule_time.time_end).split(' ')[1].split(':')[1]+' ha sido CANCELADA.'
                            cu = U_Customers.objects.filter(Q(auth__id=res.auth.id))
                            for c in cu:
                                if c.emailnotif:
                                    send_email_cancel_reservation(str(res.auth.id),str(res.id))
                                if c.telegramnotif:
                                    add_task(datetime.utcnow(),'send_telegram_task(name="'+name+'",nick="'+nick+'",phone="'+phone+'",msg="'+message+'")')
                            res.delete()
                        sch.delete()
                        schedule.delete()
        
        data=json.dumps({'status':'success','response':'party_created','data':{'id':party.id}})
    
    except Exception as e:
        data = json.dumps({'status':'failed', 'response': e.args[0] })

    return APIResponse(request,data)


def add_dni(request):
    """
    Creates a new dni
    """
    try:
        if 'auth_id' not in request.session:
            raise Exception('not_logged')
        if not have_permission(request.session['auth_id'],'add_dni'):
            raise Exception('unauthorized_add_dni')
            
        if not validate_parameter(request.GET, 'nif'):
            raise Exception(field+'_missed')
        
        dni=Dnis()
        dni.nif=request.GET['nif']
        dni.save()
        customers = U_Customers.objects.filter(Q(nif=dni.nif))
        for cu in customers:
            cu.validated = True
            cu.auth.active = True
            cu.save()
        data=json.dumps({'status':'success','response':'dni_created','data':{'id':dni.id}})
    
    except Exception as e:
        data = json.dumps({'status':'failed', 'response': e.args[0] })

    return APIResponse(request,data)



def edit_config(request):
    """
    Edit config
    """
    if 'auth_id' not in request.session:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    if not have_permission(request.session['auth_id'],'edit_config'):
        data=json.dumps({'status': 'failed', 'response':'unauthorized_edit_config'})

    for field in ('dias_reserva','dias_a_mostrar', 'dias_pago'):
        if not validate_parameter(request.GET, field):
            raise Exception(field+'_missed')
                
    try:
        config=Configuration.objects.get(id=1)
        config.days_pre = request.GET['dias_reserva']
        config.days_table_show = request.GET['dias_a_mostrar']
        config.dias_pago = request.GET['dias_pago']
        config.save()
        data=json.dumps({'status':'success','response':'configuration_modified'})
    
    except Exception, e:
            data=json.dumps({'status': 'failed', 'response':e.args[0]})

    return APIResponse(request,data)


def edit_config_email(request):
    """
    Edit config
    """
    if 'auth_id' not in request.session:
        data=json.dumps({'status': 'failed', 'response':'not_logged'})

    if not have_permission(request.session['auth_id'],'edit_config_email'):
        data=json.dumps({'status': 'failed', 'response':'unauthorized_edit_config_email'})

    if not validate_parameter(request.GET, 'email'):
        raise Exception('email_missed')
    if not validate_parameter(request.GET, 'telefono_coach'):
        raise Exception('email_missed')
                
    try:
        config=Configuration.objects.get(id=1)
        config.email = request.GET['email']
        config.save()
        auth=Auth.objects.get(id=1)
        auth.phone= request.GET['telefono_coach']
        auth.save()
        data=json.dumps({'status':'success','response':'configuration_modified'})
    
    except Exception, e:
            data=json.dumps({'status': 'failed', 'response':e.args[0]})

    return APIResponse(request,data)


def get_configuration(request):
    """
    Get foreign config info
    """
    if 'auth_id' in request.session:
        if have_permission(request.session['auth_id'],'get_configuration'):
            try:
                config=Configuration.objects.get(id=1)
                auth=Auth.objects.get(id=1)
                config_profile={'dias_reserva':config.days_pre,
                                'dias_a_mostrar':config.days_table_show,
                                'dias_pago':config.dias_pago,
                                'email':config.email,
                                'telefono_coach': auth.phone}
                data=json.dumps({'status':'success','response':'get_configuration','data': config_profile})
            except Exception as e:
                data=json.dumps({'status':'failed','response':e.args[0]})
        else:
            data=json.dumps({'status':'failed','response':'unauthorized_get_configuration'})
    else:
        data=json.dumps({'status':'failed','response':'not_logged'})
    return APIResponse(request,data)
