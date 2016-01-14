function get_content() {
    $.when(
            $.getScript('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js'),
            $.getScript(media_url+'js/aux/date.js'),
            $.getScript(media_url+'js/aux/modals.js'),
            $.getScript(media_url+'js/aux/passengers.js'),
            $.getScript(media_url+'js/aux/radios.js'),
            $.getScript(media_url+'js/aux/drivers.js'),
            $.ready.promise()
    ).then(function(){
        $.post('partials/tickets_supporters', function(template, textStatus, xhr) {
            $('#main').html(template);
            get_list();
        });
    });



}

var status_list = ['closed', 'support', 'user'];

function get_list() {
    update_tickets_supporter_badge();
	$('#new_ticket_wrapper').slideUp();
	$('#tickets_accordion').empty();
	$.getJSON(api_url+'tickets/list_foreign?callback=?', {offset:local_offset}, function(data){
		if(data.status=='success'){
            var agrupados=_.groupBy(data.data.tickets, 'role');
			$.each(agrupados, function(role, tickets) {
                addCategoryTickets(role,tickets);

			});
		}
		else super_error('Tickets failure');
	});
}

function addCategoryTickets(role,tickets){

    if (role=="") role="Sin rol definido";


//    var panel=$('<div></div>').attr('class','panel panel-default').text(role); $('#tickets_accordion').append(panel);

    $.each(tickets,function(index,ticket){
        addPanel(role,ticket);
    });
}


function addPanel(role,ticket) {


	var panel=$('<div></div>').attr('class','panel panel-default '+status_list[ticket.status]); $('#tickets_accordion').append(panel);

		var heading=$('<div></div>').attr('class','panel-heading'); panel.append(heading);
			var title=$('<h4></h4>').attr('class','panel-title row'); heading.append(title);
				var toggle=$('<a></a>').attr({'class':'accordion-toggle col-md-10','data-toggle':'collapse', 'data-parent':'#tickets_accordion', 'href':'#ticket_'+ticket.id}).text(ticket.title); title.append(toggle);
                var role_type=$('<span></span>').attr({'class':'col-md-2'}).text(role); title.append(role_type);

		var collapse=$('<div></div>').attr({'class':'panel-collapse collapse','id':'ticket_'+ticket.id}); panel.append(collapse);
			var body=$('<div></div>').attr({'class':'panel-body'}); collapse.append(body);
				var messages_wrapper=$('<div></div>').attr({'class':'messages'}); body.append(messages_wrapper);





			$.each(ticket.messages, function(index, message) {
				insert_message(message,messages_wrapper);
			});

            if (ticket.user_profile!=""){
                var user_wrapper=$('<div></div>').attr({'class':'panel panel-default'}).css({'width':'350px','margin-bottom':'10px'}); body.prepend(user_wrapper);
                var data_user_wrapper=$('<div></div>').attr({'class':'panel panel-heading'}); user_wrapper.append(data_user_wrapper);
                var user=ticket.user_profile;
                if (role=='U_Passengers') draw_passenger_md(user, data_user_wrapper);
                if (role=='U_Viewer_Radios') draw_viewer_md(user, data_user_wrapper);
                if (role=='U_Delegations') draw_viewer_md(user, data_user_wrapper);
                if (role=='U_Drivers') draw_driver_supporter(user, data_user_wrapper);
                else draw_not_auth_md(user, data_user_wrapper);
            }

			var form=$('<form></form>').attr({'role':'form', 'data-ticket-id':ticket.id}); body.append(form);
				var group=$('<div></div>').attr({'class':'form-group'}); form.append(group);
					var textarea=$('<textarea></textarea>').attr({'class':'form-control respuesta', 'row':'3', 'placeholder':'Escribir nueva respuesta', 'data-ticket-id':ticket.id}); group.append(textarea);
				var enviar=$('<button></button>').attr({'type':'submit','class':'btn btn-default'}).text('Enviar'); form.append(enviar);
				var ocultar=$('<button></button>').attr({'class':'cerrar btn btn-default', 'data-ticket-id':ticket.id}).text('Ocultar'); form.append(ocultar);

				form.submit(false).submit(function(e){
					add_message(this);
					return false;
				});

                ocultar.click(function(){
                    hide_ticket(this);
                });

	return false;
}



function insert_message(message,messages_wrapper) {
	var direction = (message.original_way) ? ' ' : 'reverse';
	var message_wrapper=$('<div></div>').attr({'class':'message '+direction, 'data-id':message.id}).html(message.text); messages_wrapper.append(message_wrapper);
		var date=$('<div></div>').attr({'class':'date'}).text(fecha_castellano_con_hora(message.date)); message_wrapper.prepend(date);
}


function add_message(element) {
	var form=$(element);
	var messages_wrapper = form.siblings('.messages');
	var panel = form.closest('.panel');
	var ticket_id = form.attr('data-ticket-id');
	var response_textarea = form.find('.respuesta');
	if (response_textarea.length==1){
		var text = response_textarea.val();
		if(text.length>0){

			$.getJSON(api_url+'tickets/respond_foreign?callback=?', {id:ticket_id, text:text, offset:local_offset}, function(data){
				if(data.status=='success'){
					get_list();
					launch_alert('<i class="fa fa-smile-o"></i> Mensaje enviado','');

				}
				else launch_alert('<i class="fa fa-frown-o"></i> Incidencia cerrada','warning');
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Respuesta vacía','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Error al enviar la respuesta','warning');
	return false;

}

function hide_ticket(element) {
	var button=$(element);
	var panel = button.closest('.panel');
	var ticket_id = button.attr('data-ticket-id');
	$.getJSON(api_url+'tickets/hide?callback=?', {ticket_id:ticket_id}, function(data){
		if(data.status=='success'){
			get_list();
            launch_alert('<i class="fa fa-smile-o"></i> Ticket ocultado','');
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al cerrar','warning');
	});
	return false;

}