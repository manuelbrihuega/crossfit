function get_content() {
	$.getScript(media_url+'js/aux/date.js', function(){
		$.post('partials/tickets', function(template, textStatus, xhr) {
			$('#main').html(template);
			get_list();
			
			$('#new_ticket_form').submit(false).submit(function(e){
				new_ticket();
				return false;
			});
			
		});
	});
	
	
	
}

function get_list() {
	$('#new_ticket_wrapper').slideUp();
	$('#tickets_accordion').empty();
	$.getJSON(api_url+'tickets/list_all?callback=?', {offset:local_offset}, function(data){
		if(data.status=='success'){
			$.each(data.data.tickets, function(index, ticket) {
				addPanel(ticket);
			});
			if(data.data.tickets.length==0){
				super_error('No hay incidencias abiertas');
			}
		}
		else super_error('Tickets failure');
	});
}


var status_list = ['closed', 'support', 'user'];

function addPanel(ticket) {
	
	var panel=$('<div></div>').attr('class','panel panel-default '+status_list[ticket.status]); $('#tickets_accordion').append(panel);

		var heading=$('<div></div>').attr('class','panel-heading'); panel.append(heading);
			var title=$('<h4></h4>').attr('class','panel-title'); heading.append(title);
				var toggle=$('<a></a>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#tickets_accordion', 'href':'#ticket_'+ticket.id}).text(ticket.title); title.append(toggle);

		var collapse=$('<div></div>').attr({'class':'panel-collapse collapse','id':'ticket_'+ticket.id}); panel.append(collapse);
			var body=$('<div></div>').attr({'class':'panel-body'}); collapse.append(body);
				var messages_wrapper=$('<div></div>').attr({'class':'messages'}); body.append(messages_wrapper);
			
			$.each(ticket.messages, function(index, message) {
				insert_message(message,messages_wrapper);
			});
			
			var form=$('<form></form>').attr({'role':'form', 'data-ticket-id':ticket.id}); body.append(form);
				var group=$('<div></div>').attr({'class':'form-group'}); form.append(group);
					var textarea=$('<textarea></textarea>').attr({'class':'form-control respuesta', 'row':'3', 'placeholder':'Escribir nueva respuesta', 'data-ticket-id':ticket.id}); group.append(textarea);
				var enviar=$('<button></button>').attr({'type':'submit','class':'btn btn-default'}).text('Enviar'); form.append(enviar);
				var cerrar=$('<button></button>').attr({'class':'cerrar btn btn-default', 'data-ticket-id':ticket.id}).text('Dar por cerrada'); form.append(cerrar);
				
				form.submit(function(e){
					add_message(this);
					return false;
				});
				
				
				cerrar.click(function(){
					close_ticket(this);
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
			
			$.getJSON(api_url+'tickets/respond?callback=?', {ticket_id:ticket_id, text:text, offset:local_offset}, function(data){
				if(data.status=='success'){
					insert_message(data.data.message,messages_wrapper);
					panel.removeClass().addClass('panel panel-default supoprt');
					response_textarea.val('').focus();
					update_tickets_badge();
					launch_alert('<i class="fa fa-smile-o"></i> Mensaje enviado','')
			
				}
				else launch_alert('<i class="fa fa-frown-o"></i> Incidencia cerrada','warning');
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Respuesta vacía','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Error al enviar la respuesta','warning');
	return false;
	
}

function close_ticket(element) {
	var button=$(element);
	var panel = button.closest('.panel');
	var toggle = panel.find('.panel-title>a');
	var ticket_id = button.attr('data-ticket-id');
	$.getJSON(api_url+'tickets/close?callback=?', {ticket_id:ticket_id}, function(data){
		if(data.status=='success'){
			panel.removeClass().addClass('panel panel-default closed');
			launch_alert('<i class="fa fa-smile-o"></i> Incidencia cerrada','');
			update_tickets_badge();
			toggle.click();
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al cerrar','warning');
	});
	return false;
	
}

function show_new() {
	if($('#new_ticket_wrapper').css('display')=='none'){
		$('#new_ticket_wrapper').slideDown();
	}
	else $('#new_ticket_wrapper').slideUp();
}

function new_ticket() {
	var title=$('#new_title').val();
	var text=$('#new_text').val();
	if (title.length>0){
		if(text.length>0){
		
			$.getJSON(api_url+'tickets/add?callback=?', {title:title, text:text, offset:local_offset}, function(data){
				if(data.status=='success'){
					$('#new_title').add('#new_text').val('');
					get_list();
					launch_alert('<i class="fa fa-smile-o"></i> Incidencia enviada','');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> Error al enviar','warning');
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Necesitamos conocer el problema','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un asunto','warning');
	
	
}


