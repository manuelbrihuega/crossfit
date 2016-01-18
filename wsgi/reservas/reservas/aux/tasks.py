# -*- coding: utf-8 -*-

def add_task(date,method):
    from reservas.models import Tasks
    task=Tasks()
    task.date=date
    task.method=method
    task.save()


def revise_tasks():
    """docstring for revise_tasks"""
    from reservas.models import Tasks
    from datetime import datetime
    tasks = Tasks.objects.filter(date__lte=datetime.utcnow())
    for task in tasks:
        try:
            exec task.method
            task.delete()
            print 'EXEC: '+task.method
        except:
            print 'ERROR EXEC: '+task.method
    return True


##############
#  JOURNEYS  #
##############


def process_stop_journey_task(journey_id):
    from reservas.aux.journeys import process_stop_journey
    process_stop_journey(journey_id)

def retry_process_digital_task(journey_id,with_features,jump):
    from reservas.aux.journeys import retry_process_digital
    retry_process_digital(journey_id,with_features,jump)

def try_cancel_reservation_task(journey_id):
    from reservas.aux.journeys import try_cancel_reservation
    try_cancel_reservation(journey_id)

def notice_soon_reservation_driver_task(journey_id):
    from reservas.aux.journeys import notice_soon_reservation_driver
    notice_soon_reservation_driver(journey_id)

def notice_soon_reservation_passenger_task(journey_id):
    from reservas.aux.journeys import notice_soon_reservation_passenger
    notice_soon_reservation_passenger(journey_id)

def turns_reservation_into_journey_task(journey_id):
    from reservas.aux.journeys import turns_reservation_into_journey
    turns_reservation_into_journey(journey_id)

def complete_traditional_journey_task(journey_id):
    from reservas.aux.journeys import complete_traditional_journey
    complete_traditional_journey(journey_id)

def try_ban_user_task(journey_id,initial_status):
    from reservas.aux.journeys import try_ban_user
    try_ban_user(journey_id,initial_status)

def not_served_journey_warning_task(journey_id):
    from reservas.aux.journeys import not_served_journey_warning
    not_served_journey_warning(journey_id)


##############
#   RADIOS   #
##############

def purge_fb_radios_task():
    from reservas.aux.radios import purge_fb_radios
    purge_fb_radios()

def collect_radios_analytics_task():
    from reservas.aux.radios import collect_analytics
    collect_analytics()

def check_radiostatus_task():
    from reservas.aux.radios import check_radiostatus
    check_radiostatus()


##############
#   EMAIL    #
##############

def send_email_restorepass_task(url,email):
    from reservas.aux.emails import send_email_restorepass
    send_email_restorepass(url,email)

def send_email_tradicional_radio_disconnected_task(radio_name):
    from reservas.aux.emails import send_email_tradicional_radio_disconnected
    send_email_tradicional_radio_disconnected(radio_name)

def send_email_daily_report_task():
    from reservas.aux.emails import send_email_daily_report
    send_email_daily_report()

def send_email_not_served_journey_task(journey_id):
    from reservas.aux.emails import send_email_not_served_journey
    send_email_not_served_journey(journey_id)

def send_email_cancel_reserved_journey_task(journey_id, motivation):
    from reservas.aux.emails import send_email_cancel_reserved_journey
    send_email_cancel_reserved_journey(journey_id, motivation)

def send_email_new_passenger_task(passenger_id, country_code):
    from reservas.aux.emails import send_email_new_passenger
    send_email_new_passenger(passenger_id, country_code)

def send_email_new_employee_task(passenger_id, country_code, passwd, emailuser):
    from reservas.aux.emails import send_email_new_employee
    send_email_new_employee(passenger_id, country_code, passwd, emailuser)

def send_email_new_change_employee_task(passenger_id, country_code, emailuser):
    from reservas.aux.emails import send_email_new_change_employee
    send_email_new_change_employee(passenger_id, country_code, emailuser)

def send_email_corporate_code_passenger_task(passenger_id, country_code):
    from reservas.aux.emails import send_email_corporate_code_passenger
    send_email_corporate_code_passenger(passenger_id, country_code)

def send_email_new_driver_task(driver_id):
    from reservas.aux.emails import send_email_new_driver
    send_email_new_driver(driver_id)

def send_email_new_driver_info_task(driver_id):
    from reservas.aux.emails import send_email_new_driver_info
    send_email_new_driver_info(driver_id)

def send_email_new_driver_new_radio_task(driver_id):
    from reservas.aux.emails import send_email_new_driver_new_radio
    send_email_new_driver_new_radio(driver_id)

def send_email_new_touroperator_info_task(touroperator_id):
    from reservas.aux.emails import send_email_new_touroperator_info
    send_email_new_touroperator_info(touroperator_id)

def send_email_driver_activated_task(driver_id):
    from reservas.aux.emails import send_email_driver_activated
    send_email_driver_activated(driver_id)

def send_email_driver_activation_info_task(driver_id):
    from reservas.aux.emails import send_email_driver_activation_info
    send_email_driver_activation_info(driver_id)

def send_email_driver_request_validation_task(driver_id):
    from reservas.aux.emails import send_email_driver_request_validation
    send_email_driver_request_validation(driver_id)

def send_email_new_enterprise_task(enterprise_id):
    from reservas.aux.emails import send_email_new_enterprise
    send_email_new_enterprise(enterprise_id)

def send_email_new_enterprise_new_radio_task(enterprise_id):
    from reservas.aux.emails import send_email_new_enterprise_new_radio
    send_email_new_enterprise_new_radio(enterprise_id)

def send_email_new_enterprise_info_task(enterprise_id):
    from reservas.aux.emails import send_email_new_enterprise_info
    send_email_new_enterprise_info(enterprise_id)

##############
#  MAILCHIMP #
##############


def add_mailchimp_passenger_task(auth_id):
    from reservas.aux.mailchimp import add_mailchimp_passenger
    add_mailchimp_passenger(auth_id)

def edit_mailchimp_passenger_task(auth_id):
    from reservas.aux.mailchimp import edit_mailchimp_passenger
    edit_mailchimp_passenger(auth_id)

def add_country_passenger_task(auth_id):
    from reservas.aux.mailchimp import add_country_passenger
    add_country_passenger(auth_id)

def edit_country_passenger_task(auth_id):
    from reservas.aux.mailchimp import edit_country_passenger
    edit_country_passenger(auth_id)

def add_mailchimp_driver_task(auth_id):
    from reservas.aux.mailchimp import add_mailchimp_driver
    add_mailchimp_driver(auth_id)

def add_mailchimp_touroperator_task(auth_id):
    from reservas.aux.mailchimp import add_mailchimp_touroperator
    add_mailchimp_touroperator(auth_id)

def edit_mailchimp_driver_task(auth_id):
    from reservas.aux.mailchimp import edit_mailchimp_driver
    edit_mailchimp_driver(auth_id)

def edit_mailchimp_touroperator_task(auth_id):
    from reservas.aux.mailchimp import edit_mailchimp_touroperator
    edit_mailchimp_touroperator(auth_id)

def add_mailchimp_radio_task(auth_id):
    from reservas.aux.mailchimp import add_mailchimp_radio
    add_mailchimp_radio(auth_id)

def edit_mailchimp_radio_task(auth_id):
    from reservas.aux.mailchimp import edit_mailchimp_radio
    edit_mailchimp_radio(auth_id)

def add_mailchimp_enterprise_task(auth_id):
    from reservas.aux.mailchimp import add_mailchimp_enterprise
    add_mailchimp_enterprise(auth_id)

def edit_mailchimp_enterprise_task(auth_id):
    from reservas.aux.mailchimp import edit_mailchimp_enterprise
    edit_mailchimp_enterprise(auth_id)

##############
#    AUTH    #
##############


def send_push_notification_task(auth_id,message,show_alert):
    from reservas.aux.auth import send_push_notification
    send_push_notification(auth_id,message,show_alert)

###############
# DELEGATIONS #
###############

def collect_delegations_analytics_task():
    from reservas.aux.delegations import collect_analytics
    collect_analytics()


###############
# ENTERPRISES #
###############

def create_launcher_task(button_id):
    from reservas.aux.enterprises import create_launcher
    create_launcher(button_id)


###############
# PASSENGERS  #
###############

def collect_passengers_analytics_task():
    from reservas.aux.passengers import collect_analytics
    collect_analytics()
    
###############
# OPERATORS #
###############

def create_operator_launcher_task(operator_id):
    from reservas.aux.operators import create_operator_launcher
    create_operator_launcher(operator_id)


###############
#  INVOICES   #
###############

def create_monthly_invoices_task():
    from reservas.aux.invoices import create_monthly_invoices
    from datetime import datetime,timedelta
    now = datetime.now()
    before = now-timedelta(days=30)
    create_monthly_invoices(month=before.month, year=before.year)

def create_monthly_autoinvoices_task():
    from reservas.aux.autoinvoices import create_monthly_autoinvoices
    from datetime import datetime,timedelta
    now = datetime.now()
    before = now-timedelta(days=30)
    create_monthly_autoinvoices(month=before.month, year=before.year)

def generate_invoice_pdf_owner_task(invoice_id):
    from reservas.aux.invoices import generate_invoice_pdf_owner
    generate_invoice_pdf_owner(invoice_id)

def generate_invoice_pdf_radio_task(invoice_id):
    from reservas.aux.invoices import generate_invoice_pdf_radio
    generate_invoice_pdf_radio(invoice_id)

def generate_autoinvoice_pdf_owner_task(autoinvoice_id):
    from reservas.aux.autoinvoices import generate_autoinvoice_pdf_owner
    generate_autoinvoice_pdf_owner(autoinvoice_id)

def generate_autoinvoice_pdf_radio_task(autoinvoice_id):
    from reservas.aux.autoinvoices import generate_autoinvoice_pdf_radio
    generate_autoinvoice_pdf_radio(autoinvoice_id)

def generate_invoice_pdf_enterprise_task(invoice_id):
    from reservas.aux.invoices import generate_invoice_pdf_enterprise
    generate_invoice_pdf_enterprise(invoice_id)
   

def generate_invoice_pdf_task(url,filename):
    from reservas.aux.invoices import generate_pdf
    generate_pdf(url,filename)

def send_email_invoice_task(invoice_id, email):
    from reservas.aux.emails import send_email_invoice
    send_email_invoice(invoice_id, email)

def send_email_autoinvoice_task(autoinvoice_id, email):
    from reservas.aux.emails import send_email_autoinvoice
    send_email_autoinvoice(autoinvoice_id, email)
    

###############
#   TELEGRAM  #
###############

def send_telegram_task(name,nick,phone,msg):
    from reservas.aux.telegram import send_telegram
    send_telegram(name,nick,phone,msg)

def warning_telegram_task(msg):
    from reservas.aux.telegram import send_telegram
    send_telegram('Manuel de la Calle','Manuel_de_la_Calle','+34675349165',msg)
    send_telegram('Antonio Ramirez','Antonio_Ramirez','+34638054946',msg)
    send_telegram('Javier Iglesias','Javier_Iglesias','+34661827100',msg)
    send_telegram('Natalia Perellon','Natalia_Perellon','+34652112108',msg)



    

    