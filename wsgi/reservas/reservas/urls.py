from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
   
    #BACKEND
    url(r'^dashboard$', 'reservas.views.dashboard.dashboard'),
    url(r'^api/auth/login$', 'reservas.views.auth.login'),
    url(r'^api/auth/logout$', 'reservas.views.auth.logout'),
    url(r'^api/auth/status$', 'reservas.views.auth.status'),
    url(r'^api/auth/restorepass$', 'reservas.views.auth.restorepass'),
    url(r'^api/auth/add_tokenpush$', 'reservas.views.auth.add_tokenpush'),
    url(r'^api/auth/del_tokenpush$', 'reservas.views.auth.del_tokenpush'),
    url(r'^api/auth/edit_password$', 'reservas.views.auth.edit_password'),
    url(r'^api/auth/get$', 'reservas.views.auth.get'),
    url(r'^api/auth/get_user$', 'reservas.views.auth.get_user'),
    url(r'^api/auth/tokin$', 'reservas.views.auth.tokin'),
    url(r'^api/auth/ban$', 'reservas.views.auth.ban'),
    url(r'^api/auth/unban$', 'reservas.views.auth.unban'),
    url(r'^api/auth/activate$', 'reservas.views.auth.activate'),
    url(r'^api/auth/deactivate$', 'reservas.views.auth.deactivate'),
    url(r'^api/auth/list_roles$', 'reservas.views.auth.list_roles'),
    url(r'^api/auth/search_by_email$', 'reservas.views.auth.search_by_email'),
    url(r'^api/auth/get_otro_default$', 'reservas.views.auth.get_otro_default'),
    url(r'^api/auth/get_oculto_default$', 'reservas.views.auth.get_oculto_default'),
    url(r'^api/auth/get_taxista_default$', 'reservas.views.auth.get_taxista_default'),
    url(r'^api/auth/search_by_phone$', 'reservas.views.auth.search_by_phone'),
    url(r'^api/auth/send_instagram_by_phone$', 'reservas.views.auth.send_instagram_by_phone'),
    url(r'^api/auth/warning_instagram$', 'reservas.views.auth.warning_instagram'),
    url(r'^api/auth/list_num_users_by_year$', 'reservas.views.auth.list_num_users_by_year'),
    url(r'^seguimiento$', 'reservas.views.dashboard.seguimiento'),
    url(r'^admin-monitoring$', 'reservas.views.dashboard.admin_monitoring'),
    url(r'^get_taxi$', 'reservas.views.dashboard.get_taxi'),
    url(r'^projects$', 'reservas.views.dashboard.projects'),
    url(r'^journeys$', 'reservas.views.dashboard.journeys'),
    # url(r'^users$', 'reservas.views.dashboard.users'),
    url(r'^enterprises$', 'reservas.views.dashboard.enterprises'),
    url(r'^employees$', 'reservas.views.dashboard.employees'),
    url(r'^passengers$', 'reservas.views.dashboard.passengers'),
    url(r'^call$', 'reservas.views.dashboard.call'),
    url(r'^digitaloperators$', 'reservas.views.dashboard.digitaloperators'),
    url(r'^drivers$', 'reservas.views.dashboard.drivers'),
    url(r'^touroperators$', 'reservas.views.dashboard.touroperators'),
    url(r'^radios$', 'reservas.views.dashboard.radios'),
    url(r'^radio/(?P<id>\w+)$', 'reservas.views.dashboard.radio'),
    url(r'^radiomap/(?P<id>\w+)$', 'reservas.views.dashboard.radiomap'),
    url(r'^delegations$', 'reservas.views.dashboard.delegations'),
    url(r'^delegation/(?P<id>\w+)$', 'reservas.views.dashboard.delegation'),
    url(r'^profile$', 'reservas.views.dashboard.profile'),
    url(r'^enterprisesradio$', 'reservas.views.dashboard.enterprisesradio'),
    url(r'^historical$', 'reservas.views.dashboard.historical'),
    url(r'^locations$', 'reservas.views.dashboard.locations'),
    url(r'^flota$', 'reservas.views.dashboard.flota'),
    url(r'^gestores$', 'reservas.views.dashboard.gestores'),
    url(r'^stadistics$', 'reservas.views.dashboard.stadistics'),
    url(r'^invoicing$', 'reservas.views.dashboard.invoicing'),
    url(r'^favourites$', 'reservas.views.dashboard.favourites'),
    url(r'^news$', 'reservas.views.dashboard.news'),
    url(r'^tickets$', 'reservas.views.dashboard.tickets'),
    url(r'^incidencias$', 'reservas.views.dashboard.incidencias'),
    url(r'^faqs$', 'reservas.views.dashboard.faqs'),
    url(r'^get_taxi$', 'reservas.views.dashboard.get_taxi'),
    url(r'^subscriber$', 'reservas.views.dashboard.subscriber'),
    url(r'^tariff$', 'reservas.views.dashboard.tariff'),

    #PARTIALS
    url(r'^partials/dashboard_passenger$', 'reservas.views.partials.dashboard_passenger'),
    url(r'^partials/dashboard_operator$', 'reservas.views.partials.dashboard_operator'),
    url(r'^partials/dashboard_sidebar_operator$', 'reservas.views.partials.dashboard_sidebar_operator'),
    url(r'^partials/dashboard_button$', 'reservas.views.partials.dashboard_button'),
    url(r'^partials/dashboard_viewer$', 'reservas.views.partials.dashboard_viewer'),
    url(r'^partials/dashboard_digital_viewer$', 'reservas.views.partials.dashboard_digital_viewer'),
    url(r'^partials/dashboard_super$', 'reservas.views.partials.dashboard_super'),
    url(r'^partials/dashboard_admin_enterprise$', 'reservas.views.partials.dashboard_admin_enterprise'),
    url(r'^partials/projects_admin_enterprise$', 'reservas.views.partials.projects_admin_enterprise'),
    url(r'^partials/subscriber_service$', 'reservas.views.partials.subscriber_service'),
    url(r'^partials/stadistics_super_delegation$', 'reservas.views.partials.stadistics_super_delegation'),
    url(r'^partials/journeys_super$', 'reservas.views.partials.journeys_super'),
    url(r'^partials/journeys_operator$', 'reservas.views.partials.journeys_operator'),
    url(r'^partials/get_taxi_admin_enterprise$', 'reservas.views.partials.get_taxi_admin_enterprise'),
    url(r'^partials/enterprises_super$', 'reservas.views.partials.enterprises_super'),
    url(r'^partials/enterprisesradio_super$', 'reservas.views.partials.enterprisesradio_super'),
    url(r'^partials/faqs_super$', 'reservas.views.partials.faqs_super'),
    url(r'^partials/employees_admin_enterprise$', 'reservas.views.partials.employees_admin_enterprise'),
    url(r'^partials/passengers_super$', 'reservas.views.partials.passengers_super'),
    url(r'^partials/call_super$', 'reservas.views.partials.call_super'),
    url(r'^partials/drivers_super$', 'reservas.views.partials.drivers_super'),
    url(r'^partials/radios_super$', 'reservas.views.partials.radios_super'),
    url(r'^partials/digitaloperators_super$', 'reservas.views.partials.digitaloperators_super'),
    url(r'^partials/radio_super$', 'reservas.views.partials.radio_super'),
    url(r'^partials/stats_radio$', 'reservas.views.partials.stats_radio'),
    url(r'^partials/radio_locations_super$', 'reservas.views.partials.radio_locations_super'),
    url(r'^partials/radio_viewers_super$', 'reservas.views.partials.radio_viewers_super'),
    url(r'^partials/radio_digital_viewers_super$', 'reservas.views.partials.radio_digital_viewers_super'),
    url(r'^partials/radio_drivers_super$', 'reservas.views.partials.radio_drivers_super'),
    url(r'^partials/radio_touroperators$', 'reservas.views.partials.radio_touroperators'),
    url(r'^partials/radio_stops_super$', 'reservas.views.partials.radio_stops_super'),
    url(r'^partials/radio_profile_super$', 'reservas.views.partials.radio_profile_super'),
    url(r'^partials/delegations_super$', 'reservas.views.partials.delegations_super'),
    url(r'^partials/delegation_super$', 'reservas.views.partials.delegation_super'),
    url(r'^partials/features_delegation$', 'reservas.views.partials.features_delegation'),
    url(r'^partials/stats_delegation$', 'reservas.views.partials.stats_delegation'),
    url(r'^partials/delegation_profile_super$', 'reservas.views.partials.delegation_profile_super'),
    url(r'^partials/profile_passenger$', 'reservas.views.partials.profile_passenger'),
    url(r'^partials/profile_driver$', 'reservas.views.partials.profile_driver'),
    url(r'^partials/historical_passenger$', 'reservas.views.partials.historical_passenger'),
    url(r'^partials/historical_enterprise$', 'reservas.views.partials.historical_enterprise'),
    url(r'^partials/invoicing_driver$', 'reservas.views.partials.invoicing_driver'),
    url(r'^partials/invoicing_delegation$', 'reservas.views.partials.invoicing_delegation'),
    url(r'^partials/invoicing_super$', 'reservas.views.partials.invoicing_super'),
    url(r'^partials/invoicing_digitalviewer$', 'reservas.views.partials.invoicing_digitalviewer'),
    url(r'^partials/invoicing_admin_enterprise$', 'reservas.views.partials.invoicing_admin_enterprise'),
    url(r'^partials/favourites$', 'reservas.views.partials.favourites'),
    url(r'^partials/news$', 'reservas.views.partials.news'),
    url(r'^partials/news_super$', 'reservas.views.partials.news_super'),
    url(r'^partials/news_adminradios$', 'reservas.views.partials.news_adminradios'),
    url(r'^partials/news_operator$', 'reservas.views.partials.news_operator'),
    url(r'^partials/tickets$', 'reservas.views.partials.tickets'),
    url(r'^partials/tickets_supporters$', 'reservas.views.partials.tickets_supporters'),
    url(r'^partials/faqs$', 'reservas.views.partials.faqs'),
    url(r'^partials/tariff_delegation$', 'reservas.views.partials.tariff_delegation'),
    
    #PARTIALS MODALS
    url(r'^partials/modal_new_radiotariff$', 'reservas.views.partials.modal_new_radiotariff'),
    url(r'^partials/modal_load_excel$', 'reservas.views.partials.modal_load_excel'),
    url(r'^partials/modal_add_radiotariff$', 'reservas.views.partials.modal_add_radiotariff'),
    url(r'^partials/modal_new_district$', 'reservas.views.partials.modal_new_district'),
    url(r'^partials/modal_new_journey$', 'reservas.views.partials.modal_new_journey'),
    url(r'^partials/modal_journey_details$', 'reservas.views.partials.modal_journey_details'),
    url(r'^partials/modal_passenger_details$', 'reservas.views.partials.modal_passenger_details'),
    url(r'^partials/modal_passenger_details_enterprise$', 'reservas.views.partials.modal_passenger_details_enterprise'),
    url(r'^partials/modal_total_flota$', 'reservas.views.partials.modal_total_flota'),
    url(r'^partials/modal_operator_details$', 'reservas.views.partials.modal_operator_details'),
    url(r'^partials/modal_operators_detail$', 'reservas.views.partials.modal_operators_detail'),
    url(r'^partials/modal_enterprise_details$', 'reservas.views.partials.modal_enterprise_details'),
    url(r'^partials/modal_faq_details$', 'reservas.views.partials.modal_faq_details'),
    url(r'^partials/modal_driver_details$', 'reservas.views.partials.modal_driver_details'),
    url(r'^partials/modal_touroperator_details$', 'reservas.views.partials.modal_touroperator_details'),
    url(r'^partials/modal_driver_operator_details$', 'reservas.views.partials.modal_driver_operator_details'),
    url(r'^partials/modal_location_details$', 'reservas.views.partials.modal_location_details'),
    url(r'^partials/modal_enterprise_register$', 'reservas.views.partials.modal_enterprise_register'),
    url(r'^partials/modal_stop_details$', 'reservas.views.partials.modal_stop_details'),
    url(r'^partials/modal_project_add_employees_detail$', 'reservas.views.partials.modal_project_add_employees_detail'),
    url(r'^partials/informacion_legal$', 'reservas.views.partials.informacion_legal'),
    url(r'^partials/condiciones_uso$', 'reservas.views.partials.condiciones_uso'),
    url(r'^partials/condiciones_uso_drivers$', 'reservas.views.partials.condiciones_uso_drivers'),
    url(r'^partials/condiciones_uso_drivers_es$', 'reservas.views.partials.condiciones_uso_drivers_es'),
    url(r'^partials/modal_employees_stadistics$', 'reservas.views.partials.modal_employees_stadistics'),

    #AJAX
    url(r'^ajax/get_lang$', 'reservas.views.ajax.get_lang'),
    url(r'^ajax/set_lang$', 'reservas.views.ajax.set_lang'),
    url(r'^ajax/upload_file_driver$', 'reservas.views.ajax.upload_file_driver'),
    url(r'^ajax/upload_excel_tariff$', 'reservas.views.ajax.upload_excel_tariff'),
    url(r'^ajax/get_files_driver$', 'reservas.views.ajax.get_files_driver'),

    #PUBLIC
    url(r'^test$', 'reservas.views.public.test'),
    url(r'^login$', 'reservas.views.public.login'),
    url(r'^button$', 'reservas.views.public.button'),
    url(r'^guard$', 'reservas.views.public.guard'),
    url(r'^sip$', 'reservas.views.public.sip'),
    url(r'^radiostatus$', 'reservas.views.public.radiostatus'),
    url(r'^inversores/j9n48dhf1m95ahs7sqxi3p$', 'reservas.views.public.inversores'),
    url(r'^taxistas$', 'reservas.views.public.taxistas'),
    url(r'^validate_driver/(?P<token>\w+)$', 'reservas.views.public.validate_driver'),
    url(r'^tokin/(?P<token>\w+)$', 'reservas.views.public.tokin'),
    url(r'^qr$', 'reservas.views.public.downloads'),
    url(r'^downloads$', 'reservas.views.public.downloads'),
    url(r'^descargas', 'reservas.views.public.downloads'),
    url(r'^', 'reservas.views.public.home'),

    
    #STATIC
    # url(r'^static/(?P<path>.*)$', 'django.views.static.serve',{'document_root': '/var/www/reservas/reservas/static'}),

    
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
