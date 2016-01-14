function get_content() {
	
	$.ajaxSetup({ cache: false });
	
    $.when(
		$.getScript(media_url+'js/aux/modals.js'),
		$.getScript(media_url+'js/lib/jquery-ui-1.10.4.custom.min.js'),
		$.getScript('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js'),
        $.ready.promise()
    ).then(function(){
		load_radios();
        loadTemplate();
    });
	
	
}

var radios = false;

function loadTemplate() {
	$.post(base_url+'/partials/call_super', function(template, textStatus, xhr) {
		$('#main').html(template);
		
		unlinked_operators_list();
		unlinked_call_numbers_list();
		queues_list();
		
		// $('#submain').html(template);
		// operators_list();
		// 
		// $('#new_operator_form').submit(false).submit(function(e){
		// 	add_operator();
		// 	return false;
		// });
		
	});
}


function load_radios() {
	$.getJSON(api_url+'radios/list_all?callback=?', '', function(data){
		if(data.status=='success'){
			radios = data.data;
		}
	});
}


// OPERATORS
function unlinked_operators_list() {
	var wrapper = $('#unlinked_operators_subwrapper');
	$.getJSON(api_url+'operators/list_unlinked_operators?callback=?', '', function(data){
		if(data.status=='success'){
			wrapper.empty();
			if(data.data.list.length>0){
				
				$.each(data.data.list, function(index, operator) {
					draw_operator_sm(operator, wrapper);
				});
				
				
			}

			$('#delete_operator').droppable({
			      accept: 'div.item.operator',
			      activeClass: "active",
				  hoverClass: "hover",
				  tolerance: "touch",
			      drop: function( event, ui ) {
						operator_id = ui.draggable.attr("data-id");
						if(operator_id!=undefined){
							ui.draggable.remove();
							delete_operator(operator_id);
						}
			      }
			 });
			 
 			$('#unlinked_operators_subwrapper').droppable({
 			      accept: 'div.item.operator',
 			      activeClass: "active",
 				  hoverClass: "hover",
 				  tolerance: "touch",
 			      drop: function( event, ui ) {
 						operator_id = ui.draggable.attr("data-id");
 						if(operator_id!=undefined){
 							ui.draggable.remove();
 							link_operator_queue(operator_id, '');
 						}
 			      }
 			 });
			
		}
		else super_error('Search failure');
	});
	
}

function draw_operator_sm(operator, wrapper) {
	
	var item = $('<div></div>').attr({'class':'item operator', 'data-id':operator.id}); wrapper.append(item);
	var extension = $('<div></div>').attr({'class':'extension'}).text(operator.extension); item.append(extension);
	var pass = $('<div></div>').attr({'class':'pass'}).text(operator.password); item.append(pass);

	// item.draggable({ revert: true, zIndex: 100, scroll: true, containment: "window" });
	item.draggable({ 
		revert: 'invalid', 
        // scroll: true,
        containment: '#submain',
        helper: 'clone',
		zIndex: 100,
		// scope: "operator",
        start : function() {
        	this.style.display="none";
        },
        stop: function() {
        	this.style.display="";
        }
	});
	
	
	
	item.click(function(){
		modal_operator_details(operator.id);
	})	
}

function save_operator() {
	var id=$('#operator_id').val();
	var extension=$('#operator_extension').val();
	var password=$('#operator_password').val();
	var edit_operator_button=$('#edit_operator_button');
	
	if (extension.length>0){
		if (password.length>3){
			
			edit_operator_button.html('<i class="fa fa-refresh fa-spin"></i>');
			$.getJSON(api_url+'operators/edit?callback=?', {id:id, extension:extension, password:password}, function(data){
				if(data.status=='success'){
					
					edit_operator_button.html('<i class="fa fa-floppy-o"></i>');
					operators_list();
					launch_alert('<i class="fa fa-smile-o"></i> Operadora Editada','');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> Error al enviar','warning');
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> La contraseña no puede estar vacía','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes elegir una extensión','warning');
}

function add_operator() {
	var extension=$('#new_operator_extension').val();
	var password=$('#new_operator_pass').val();
	var new_operator_button=$('#new_operator_submit');
	
	if (extension.length>0){
		if (password.length>3){
			
			new_operator_button.html('<i class="fa fa-refresh fa-spin"></i>');
			$.getJSON(api_url+'operators/add?callback=?', {extension:extension, password:password}, function(data){
				if(data.status=='success'){
					$('#new_operator_extension').add('#new_operator_pass').val('');
					new_operator_button.html('Nueva');
					unlinked_operators_list();
					launch_alert('<i class="fa fa-smile-o"></i> Nueva operadora creada','');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> Error al enviar','warning');
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> La contraseña no puede estar vacía','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes elegir una extensión','warning');
}

function delete_operator(id) {
	$.getJSON(api_url+'operators/delete?callback=?', {operator_id:id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Operadora eliminada','');
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al eliminar','warning');
	});
}


// CALL NUMBERS
function unlinked_call_numbers_list() {
	var wrapper = $('#unlinked_numbers_subwrapper');
	$.getJSON(api_url+'operators/list_unlinked_call_numbers?callback=?', '', function(data){
		if(data.status=='success'){
			wrapper.empty();
			if(data.data.list.length>0){
				
				$.each(data.data.list, function(index, call_number) {
					draw_call_number_sm(call_number, wrapper);
				});
				
				
			}
			
			$('#delete_numbers').droppable({
			      accept: 'div.item.number',
			      activeClass: "active",
				  hoverClass: "hover",
				  tolerance: "touch",
			      drop: function( event, ui ) {
					  console.log('sssi');
						number_id = ui.draggable.attr("data-id");
						if(number_id!=undefined){
							ui.draggable.remove();
							delete_number(number_id);
						}
			      }
			 });
			 
 			$('#unlinked_numbers_subwrapper').droppable({
 			      accept: 'div.item.number',
 			      activeClass: "active",
 				  hoverClass: "hover",
 				  tolerance: "touch",
 			      drop: function( event, ui ) {
 						number_id = ui.draggable.attr("data-id");
 						if(number_id!=undefined){
 							ui.draggable.remove();
 							link_number_queue(number_id, '');
 						}
 			      }
 			 });
			
		}
		else super_error('Search failure');
	});
	
}

function draw_call_number_sm(call_number, wrapper) {
	
	var item = $('<div></div>').attr({'class':'item number', 'data-id':call_number.id}); wrapper.append(item);
	var number = $('<div></div>').attr({'class':'number'}).text(call_number.number); item.append(number);
	var select = $('<select></select>'); item.append(select);
	draw_radios_select(select,call_number.id,call_number.radio_id);

	item.draggable({ 
		revert: 'invalid', 
        containment: '#submain',
        helper: 'clone',
		zIndex: 100,
        start : function() {
        	this.style.display="none";
        },
        stop: function() {
        	this.style.display="";
        }
	});

}

function draw_radios_select(select,id,radio_id) {
	select.empty();
	if(radios){
		select.append('<option value="">NINGUNA</option>');
		$.each(radios, function(index, radio) {
			select.append('<option value="'+radio.id+'">'+radio.name+'</option>');
		});
		if(radio_id!=null) select.val(radio_id);
		select.change(function(){
			link_radio_number(select, id);
		});
	}
	else{
		setTimeout(function(){
			draw_radios_select(select,id,radio_id);
		},500);
	}
	// console.log(radio_id);
}

function link_radio_number(select, number_id) {
	select.prop('disabled', 'disabled');
	var radio_id=select.val();
	$.getJSON(api_url+'operators/link_radio_number?callback=?', {number_id:number_id, radio_id:radio_id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Cambios guardados correctamente','');
		}
		else{
			launch_alert('<i class="fa fa-frown-o"></i> No se ha vinculado radio','warning');
		}
		select.prop('disabled', false);
	});
	
}

function add_number() {
	var number=$('#new_number').val();
	var new_number_submit=$('#new_number_submit');
	
	if (number.length>0){
		new_number_submit.html('<i class="fa fa-refresh fa-spin"></i>');
		$.getJSON(api_url+'operators/add_call_number?callback=?', {number:number}, function(data){
			if(data.status=='success'){
				$('#new_number').val('');
				unlinked_call_numbers_list();
				launch_alert('<i class="fa fa-smile-o"></i> Nueva numeración creada','');
			}
			else launch_alert('<i class="fa fa-frown-o"></i> No se ha guardado','warning');
			new_number_submit.html('Nueva');
		});
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes elegir una numeración','warning');
}

function delete_number(id) {
	$.getJSON(api_url+'operators/delete_call_number?callback=?', {number_id:id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Numeración eliminada','');
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al eliminar','warning');
	});
}


// QUEUES
function queues_list() {
	var wrapper = $('#queue_list_subwrapper');
	$.getJSON(api_url+'operators/list_queues?callback=?', '', function(data){
		if(data.status=='success'){
			wrapper.empty();
			if(data.data.length>0){
				
				$.each(data.data, function(index, queue) {
					draw_queue_sm(queue, wrapper);
				});
				
			}
			else wrapper.html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin operadoras.</div></div>');
			
		}
	});
}


function draw_queue_sm(queue, wrapper) {
	
	var col6 = $('<div></div>').attr({'class':'col-md-6'}); wrapper.append(col6);
	var enqueue_wrapper = $('<div></div>').attr({'class':'enqueue_wrapper', 'data-id':queue.id}); col6.append(enqueue_wrapper);
		var delete_wrapper = $('<div></div>').attr({'class':'delete pull-right'}).html('<i class="fa fa-trash-o"></i>'); enqueue_wrapper.append(delete_wrapper);
		delete_wrapper.click(function(){
			delete_queue(queue.id);
		});
		var title = $('<div></div>').attr({'class':'title'}).text(queue.name); enqueue_wrapper.append(title);
		var row = $('<div></div>').attr({'class':'row'}); enqueue_wrapper.append(row);
			var col6_operators = $('<div></div>').attr({'class':'col-md-6 col operators'}).html('<div class="title">OPERADORAS</div>'); row.append(col6_operators);
			
			col6_operators.droppable({
			      accept: 'div.item.operator',
			      activeClass: "active",
				  hoverClass: "hover",
				  tolerance: "touch",
			      drop: function( event, ui ) {
						operator_id = ui.draggable.attr("data-id");
						if(operator_id!=undefined){
							ui.draggable.remove();
							link_operator_queue(operator_id, queue.id);
						}
			      }
			 });
			
			$.each(queue.operators, function(index, operator) {
				draw_operator_sm(operator, col6_operators);
			});
			
			
			var col6_numbers = $('<div></div>').attr({'class':'col-md-6 col numbers'}).html('<div class="title">NUMERACIONES</div>'); row.append(col6_numbers);
			
			col6_numbers.droppable({
			      accept: 'div.item.number',
			      activeClass: "active",
				  hoverClass: "hover",
				  tolerance: "touch",
			      drop: function( event, ui ) {
						number_id = ui.draggable.attr("data-id");
						if(number_id!=undefined){
							ui.draggable.remove();
							link_number_queue(number_id, queue.id);
						}
			      }
			 });
			
			$.each(queue.numbers, function(index, number) {
				draw_call_number_sm(number,col6_numbers);
			});
			
}

function link_operator_queue(operator_id, queue_id) {
	$.getJSON(api_url+'operators/link_operator_queue?callback=?', {operator_id:operator_id, queue_id:queue_id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Cambios guardados','');
		}
		else launch_alert('<i class="fa fa-frown-o"></i> No se ha guardado','warning');
		loadTemplate();
	});
}

function link_number_queue(number_id, queue_id) {
	$.getJSON(api_url+'operators/link_queue_number?callback=?', {number_id:number_id, queue_id:queue_id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Cambios guardados','');
		}
		else launch_alert('<i class="fa fa-frown-o"></i> No se ha guardado','warning');
		loadTemplate();
	});
}

function add_queue() {
	var name = $('#new_queue_name').val();
	if(name.length>0){
		$.getJSON(api_url+'operators/add_queue?callback=?', {name:name}, function(data){
			if(data.status=='success'){
				$('#new_queue_name').val('');
				toggleAddQueue();
				launch_alert('<i class="fa fa-smile-o"></i> Cambios guardados','');
			}
			else launch_alert('<i class="fa fa-frown-o"></i> No se ha guardado','warning');
			loadTemplate();
		});
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Escribe el nombre de la plataforma','warning');
}

function delete_queue(queue_id) {
	if (confirm("¿Seguro que quieres eliminar la plataforma?")){
		$.getJSON(api_url+'operators/delete_queue?callback=?', {queue_id:queue_id}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Cambios guardados','');
			}
			else launch_alert('<i class="fa fa-frown-o"></i> No se ha guardado','warning');
			loadTemplate();
		});
	}
}

function toggleAddQueue() {
	if($('#new_queue_form').css('display')=='none') $('#new_queue_form').slideDown();
	else $('#new_queue_form').slideUp();
}


