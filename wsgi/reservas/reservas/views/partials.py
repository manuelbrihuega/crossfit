from django.http import HttpResponse
from django.template import RequestContext, loader
from django.template.loader import render_to_string


def dashboard_passenger(request):
    template = loader.get_template('partials/dashboard_passenger.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def dashboard_operator(request):
    template = loader.get_template('partials/dashboard_operator.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def dashboard_sidebar_operator(request):
    template = loader.get_template('partials/dashboard_sidebar_operator.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def dashboard_button(request):
    template = loader.get_template('partials/dashboard_button.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def subscriber_service(request):
    template = loader.get_template('partials/subscriber_service.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def dashboard_viewer(request):
    template = loader.get_template('partials/dashboard_viewer.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))   

def dashboard_digital_viewer(request):
    template = loader.get_template('partials/dashboard_digital_viewer.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))  

def projects_admin_enterprise(request):
    template = loader.get_template('partials/projects_admin_enterprise.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def dashboard_super(request):
    template = loader.get_template('partials/dashboard_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))  

def dashboard_admin_enterprise(request):
    template = loader.get_template('partials/dashboard_admin_enterprise.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def get_taxi_admin_enterprise(request):
    template = loader.get_template('partials/get_taxi_admin_enterprise.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content)) 

def tariff_delegation(request):
    template = loader.get_template('partials/tariff_delegation.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def journeys_super(request):
    template = loader.get_template('partials/journeys_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def journeys_operator(request):
    template = loader.get_template('partials/journeys_operator.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))  

def tarifas_super(request):
    template = loader.get_template('partials/tarifas_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def calendario_super(request):
    template = loader.get_template('partials/calendario_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def calendario_cliente(request):
    template = loader.get_template('partials/calendario_cliente.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def actividades_super(request):
    template = loader.get_template('partials/actividades_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def enterprisesradio_super(request):
    template = loader.get_template('partials/enterprisesradio_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def faqs_super(request):
    template = loader.get_template('partials/faqs_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def employees_admin_enterprise(request):
    template = loader.get_template('partials/employees_admin_enterprise.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def clientes_super(request):
    template = loader.get_template('partials/clientes_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def configuracion_super(request):
    template = loader.get_template('partials/configuracion_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def call_super(request):
    template = loader.get_template('partials/call_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def digitaloperators_super(request):
    template = loader.get_template('partials/digitaloperators_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content)) 

def drivers_super(request):
    template = loader.get_template('partials/drivers_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def stadistics_super_delegation(request):
    template = loader.get_template('partials/stadistics_super_delegation.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content)) 

def radios_super(request):
    template = loader.get_template('partials/radios_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def radio_super(request):
    template = loader.get_template('partials/radio_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def stats_radio(request):
    template = loader.get_template('partials/stats_radio.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def radio_locations_super(request):
    template = loader.get_template('partials/radio_locations_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def radio_viewers_super(request):
    template = loader.get_template('partials/radio_viewers_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def radio_digital_viewers_super(request):
    template = loader.get_template('partials/radio_digital_viewers_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))   

def radio_drivers_super(request):
    template = loader.get_template('partials/radio_drivers_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def radio_touroperators(request):
    template = loader.get_template('partials/radio_touroperators.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content)) 

def radio_stops_super(request):
    template = loader.get_template('partials/radio_stops_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def radio_profile_super(request):
    template = loader.get_template('partials/radio_profile_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def delegations_super(request):
    template = loader.get_template('partials/delegations_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def delegation_super(request):
    template = loader.get_template('partials/delegation_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def features_delegation(request):
    template = loader.get_template('partials/features_delegation.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def stats_delegation(request):
    template = loader.get_template('partials/stats_delegation.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def delegation_profile_super(request):
    template = loader.get_template('partials/delegation_profile_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def profile_passenger(request):
    template = loader.get_template('partials/profile_passenger.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def profile_driver(request):
    template = loader.get_template('partials/profile_driver.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))   

def historical_passenger(request):
    template = loader.get_template('partials/historical_passenger.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def historical_enterprise(request):
    template = loader.get_template('partials/historical_enterprise.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content)) 

def invoicing_driver(request):
    template = loader.get_template('partials/invoicing_driver.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def invoicing_delegation(request):
    template = loader.get_template('partials/invoicing_delegation.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def invoicing_super(request):
    template = loader.get_template('partials/invoicing_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def invoicing_digitalviewer(request):
    template = loader.get_template('partials/invoicing_digitalviewer.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def invoicing_admin_enterprise(request):
    template = loader.get_template('partials/invoicing_admin_enterprise.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def favourites(request):
    template = loader.get_template('partials/favourites.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def news(request):
    template = loader.get_template('partials/news.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def news_super(request):
    template = loader.get_template('partials/news_super.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))    

def news_adminradios(request):
    template = loader.get_template('partials/news_adminradios.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))  

def news_operator(request):
    template = loader.get_template('partials/news_operator.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def tickets(request):
    template = loader.get_template('partials/tickets.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def tickets_supporters(request):
    template = loader.get_template('partials/tickets_supporters.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def faqs(request):
    template = loader.get_template('partials/faqs.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))   

#MODALS

def modal_new_radiotariff(request):
    template = loader.get_template('partials/modal_new_radiotariff.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))  

def modal_project_add_employees_detail(request):
    template = loader.get_template('partials/modal_project_add_employees_detail.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def modal_add_radiotariff(request):
    template = loader.get_template('partials/modal_add_radiotariff.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def modal_load_excel(request):
    template = loader.get_template('partials/modal_load_excel.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content)) 

def modal_new_district(request):
    template = loader.get_template('partials/modal_new_district.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def modal_employees_stadistics(request):
    template = loader.get_template('partials/modal_employees_stadistics.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))  
    
def modal_new_journey(request):
    template = loader.get_template('partials/modal_new_journey.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))     

def modal_journey_details(request):
    template = loader.get_template('partials/modal_journey_details.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))     

def modal_passenger_details(request):
    template = loader.get_template('partials/modal_passenger_details.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))     

def modal_tarifa_details(request):
    template = loader.get_template('partials/modal_tarifa_details.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def modal_actividad_details(request):
    template = loader.get_template('partials/modal_actividad_details.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def modal_calendario_details(request):
    template = loader.get_template('partials/modal_calendario_details.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def modal_passenger_details_enterprise(request):
    template = loader.get_template('partials/modal_passenger_details_enterprise.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content)) 

def modal_operator_details(request):
    template = loader.get_template('partials/modal_operator_details.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))     

def modal_operators_detail(request):
    template = loader.get_template('partials/modal_operators_detail.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))  

def modal_enterprise_details(request):
    template = loader.get_template('partials/modal_enterprise_details.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))     

def modal_faq_details(request):
    template = loader.get_template('partials/modal_faq_details.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))   

def modal_driver_details(request):
    template = loader.get_template('partials/modal_driver_details.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def modal_touroperator_details(request):
    template = loader.get_template('partials/modal_touroperator_details.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def modal_driver_operator_details(request):
    template = loader.get_template('partials/modal_driver_operator_details.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def modal_total_flota(request):
    template = loader.get_template('partials/modal_total_flota.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def modal_location_details(request):
    template = loader.get_template('partials/modal_location_details.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))     

def modal_enterprise_register(request):
    template = loader.get_template('partials/modal_enterprise_register.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def modal_stop_details(request):
    template = loader.get_template('partials/modal_stop_details.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def informacion_legal(request):
    template = loader.get_template('partials/modal_eula_legal.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def condiciones_uso(request):
    template = loader.get_template('partials/modal_eula_use.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def condiciones_uso_drivers(request):
    template = loader.get_template('partials/modal_condiciones_uso_drivers.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))

def condiciones_uso_drivers_es(request):
    template = loader.get_template('partials/modal_condiciones_uso_drivers_es.html')
    content = RequestContext(request)
    return HttpResponse(template.render(content))




