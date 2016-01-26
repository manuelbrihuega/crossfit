from django.http import HttpResponse
from django.template import RequestContext, loader
from django.template.loader import render_to_string
import json


def dashboard(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'dashboard','css':['partials/map.css','partials/journeys.css','partials/buttons.css', 'partials/modals.css', 'partials/radios.css','partials/tickets.css', 'partials/dashboard.css','lib/jquery.keypad.css']})
    return HttpResponse(template.render(content))    

def seguimiento(request):
    template = loader.get_template('completes/base_seguimiento.html')
    content = RequestContext(request,{'section':'seguimiento','css':['partials/map.css','partials/journeys.css','partials/buttons.css', 'partials/modals.css', 'partials/radios.css','partials/tickets.css', 'partials/dashboard.css','lib/jquery.keypad.css']})
    return HttpResponse(template.render(content))

def admin_monitoring(request):
    template = loader.get_template('completes/base_seguimiento_admin.html')
    content = RequestContext(request,{'section':'seguimiento','css':['partials/map.css','partials/journeys.css','partials/buttons.css', 'partials/modals.css', 'partials/radios.css','partials/tickets.css', 'partials/dashboard.css','lib/jquery.keypad.css']})
    return HttpResponse(template.render(content))

def get_taxi(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'get_taxi','css':['partials/map.css','partials/journeys.css','partials/buttons.css', 'partials/modals.css', 'partials/radios.css','partials/tickets.css','lib/jquery.keypad.css']})
    return HttpResponse(template.render(content))   

def projects(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'projects','css':['partials/modals.css', 'partials/radios.css','partials/drivers.css']})
    return HttpResponse(template.render(content))   

def subscriber(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'subscriber_service','css':['partials/map.css','partials/journeys.css','partials/buttons.css', 'partials/modals.css', 'partials/radios.css','partials/tickets.css', 'partials/subscriber.css','lib/jquery.keypad.css']})
    return HttpResponse(template.render(content))   

def stadistics(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'stadistics','css':['partials/map.css','partials/journeys.css','partials/buttons.css', 'partials/modals.css', 'partials/radios.css','partials/tickets.css', 'partials/stadistics.css','lib/jquery.keypad.css']})
    return HttpResponse(template.render(content))   

def journeys(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'journeys','css':['partials/journeys.css','partials/modals.css']})
    return HttpResponse(template.render(content))    

def users(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'users'})
    return HttpResponse(template.render(content))    

def tarifas(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'tarifas','css':['partials/modals.css','partials/tarifas.css']})
    return HttpResponse(template.render(content))

def calendario(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'calendario','css':['partials/modals.css','partials/calendario.css']})
    return HttpResponse(template.render(content))

def actividades(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'actividades','css':['partials/modals.css','partials/actividades.css']})
    return HttpResponse(template.render(content))    

def enterprisesradio(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'enterprisesradio','css':['partials/modals.css','partials/enterprises.css']})
    return HttpResponse(template.render(content)) 

def employees(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'employees','css':['partials/enterprises.css']})
    return HttpResponse(template.render(content))    

def clientes(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'clientes','css':['partials/modals.css']})
    return HttpResponse(template.render(content))    

def call(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'call','css':['partials/operators.css','partials/modals.css']})
    return HttpResponse(template.render(content))    

def digitaloperators(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'digitaloperators','css':['partials/radios.css','partials/modals.css']})
    return HttpResponse(template.render(content)) 

def operators(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'operators','css':['partials/modals.css']})
    return HttpResponse(template.render(content))    

def drivers(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'drivers','css':['partials/modals.css','partials/drivers.css']})
    return HttpResponse(template.render(content))    

def touroperators(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'touroperators','css':['partials/modals.css','partials/drivers.css']})
    return HttpResponse(template.render(content)) 

def radios(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'radios','css':['partials/radios.css']})
    return HttpResponse(template.render(content))    

def tariff(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'tariff','css':['partials/invoicing.css', 'partials/tariff.css', 'partials/buttons.css']})
    return HttpResponse(template.render(content))  

def radio(request,id):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'radio','item_id':id,'css':['partials/journeys.css','partials/modals.css','partials/radios.css','partials/drivers.css']})
    return HttpResponse(template.render(content))    

def radiomap(request,id):
    template = loader.get_template('completes/radiomap.html')
    content = RequestContext(request,{'id':id})
    return HttpResponse(template.render(content))

def delegations(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'delegations','css':['partials/delegations.css']})
    return HttpResponse(template.render(content))    

def delegation(request,id):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'delegation','item_id':id,'css':['partials/modals.css','partials/delegations.css']})
    return HttpResponse(template.render(content))

def profile(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'profile'})
    return HttpResponse(template.render(content))    

def historical(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'historical','css':['partials/journeys.css']})
    return HttpResponse(template.render(content))

def locations(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'locations','css':['partials/radios.css']})
    return HttpResponse(template.render(content))

def gestores(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'gestores','css':['partials/modals.css']})
    return HttpResponse(template.render(content))

def flota(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'flota','css':['partials/radios.css']})
    return HttpResponse(template.render(content))

def invoicing(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'invoicing','css':['partials/invoicing.css']})
    return HttpResponse(template.render(content))  

def favourites(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'favourites'})
    return HttpResponse(template.render(content))    

def news(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'news','css':['partials/news.css']})
    return HttpResponse(template.render(content))    

def tickets(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'tickets','css':['partials/tickets.css']})
    return HttpResponse(template.render(content))    

def incidencias(request):
    template = loader.get_template('completes/base_incidencias.html')
    content = RequestContext(request,{'section':'tickets','css':['partials/tickets.css']})
    return HttpResponse(template.render(content)) 

def faqs(request):
    template = loader.get_template('completes/base_dashboard.html')
    content = RequestContext(request,{'section':'faqs','css':['partials/modals.css','partials/enterprises.css']})
    return HttpResponse(template.render(content))    







