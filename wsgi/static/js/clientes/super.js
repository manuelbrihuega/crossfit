function get_content() {
	
		$.getScript(media_url+'js/aux/date.js', function(){
			$.getScript(media_url+'js/aux/modals.js', function(){
				$.getScript(media_url+'js/aux/clientes.js', function(){
					$.post(base_url+'/partials/clientes_super', function(template, textStatus, xhr) {
						$('#main').html(template);
						$('#users_submenu div.button.passengers').addClass('active');
						$('#submain').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');

						var role = $('body').attr('data-role');
						loadRates();
						//getPassengersStats();
						active_new_customer_form();
						initialsearch();
						if (!Modernizr.inputtypes.date) {
    						$('input[type=date]').datepicker();
    						$('input[type=date]').css('border-bottom','1px solid lightgray');
    						$('#ui-datepicker-div').css('background-color','white');
        					$('#ui-datepicker-div').css('border','1px solid lightgray');
        					$('#ui-datepicker-div').css('padding','15px');
        					$('#ui-datepicker-div').css('border-radius','8px');
						}
					});
				});
			});
		});
	
}

function show_new() {
	if($('#new_customer_wrapper').css('display')=='none'){
		$('#new_customer_wrapper').slideDown();
	}
	else $('#new_customer_wrapper').slideUp();
}

function getPassengersStats() {
	var input = $('<input>').attr({'id':'input_search_passenger','class':'superinput', 'type':'text', 'placeholder':'Ej. Nombre, apellidos, email, etc.'}); $('#submain').html(input);
	input.focus();
	input.bind({
		keypress: function(e) {
			var code = e.keyCode || e.which;
			if(code == 13) searchPassengers();
		}
	});

	var results = $('<div></div>').attr({'class':'passengers_md_list sublista row', 'id':'results'}).css('margin-top','30px'); $('#submain').append(results);
	var stats = $('<div></div>').attr({'class':'passengers_stats', 'id':'stats'}).css('margin-top','30px'); $('#submain').append(stats);
	stats.html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-bar-chart-o"></i></div><div class="text">No hay clientes para tu búsqueda</div></div>');

}

function loadRates() {
	var select = $('#customer_rate');
	$.getJSON(api_url+'tarifas/list_all?callback=?', {}, function(data){
		////console.log(data.data)
		if(data.status=='success'){
			var list_tarifas=data.data.rates;
			for(var i=0;i<list_tarifas.length;i++){
            	id=list_tarifas[i].id;
            	nombres=list_tarifas[i].name;
            	var option=$('<option></option>').attr({'value':list_tarifas[i].id, 'data-credit-box':list_tarifas[i].credit_box, 'data-credit-wod':list_tarifas[i].credit_wod}).text(list_tarifas[i].name+" ("+list_tarifas[i].price+" €)"); select.append(option);
        	}

		}
		else super_error('Search failure');
	});
}

function searchPassengers() {
	var string = $('#input_search_passenger').val();
	var wrapper = $('#results');
	var wr = $('#stats');
	wrapper.empty();
	$.getJSON(api_url+'customers/search?callback=?', {lookup:string}, function(data){
		////console.log(data.data)
		if(data.status=='success'){

			if(data.data.list.length>0){
				$.each(data.data.list, function(index, passenger) {
					draw_passenger_sm(passenger, wrapper);
				});
			}
			else{ wr.empty(); wrapper.empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">No se han encontrado pasajeros</div></div>');}
		}
		else { wr.empty(); wrapper.empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">No se han encontrado pasajeros</div></div>');}
	});
}

function initialsearch() {
	var string = '*';
	var wrapper = $('#results');
	var wr = $('#stats');
	wrapper.empty();
	$.getJSON(api_url+'customers/search?callback=?', {lookup:string}, function(data){
		////console.log(data.data)
		if(data.status=='success'){

			if(data.data.list.length>0){
				$.each(data.data.list, function(index, passenger) {
					draw_passenger_sm(passenger, wrapper);
				});
			}
			else{ wr.empty(); wrapper.empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">No se han encontrado pasajeros</div></div>');}
		}
		else { wr.empty(); wrapper.empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">No se han encontrado pasajeros</div></div>');}
	});
}

function active_new_customer_form() {
	$('#new_customer_form').submit(false).submit(function(e){
		new_customer();
		return false;
	});
}

function new_customer() {
	var name=$('#new_customer_name').val();
	var surname=$('#new_customer_surname').val();
	var nif=$('#new_customer_nif').val();
	var phone=$('#new_customer_phone').val();
	var email=$('#new_customer_email').val();
	var password=$('#new_customer_password').val();
	var passwordrepeat=$('#new_customer_passwordrepeat').val();
	var birthdate=$('#new_customer_birthdate').val();
	var rate_id=$('#customer_rate').val();
	if($('#new_customer_validated').is(':checked')){
		var validado=1;
	}else{
		var validado=0;
	}
	if($('#new_customer_paid').is(':checked')){
		var pagado=1;
	}else{
		var pagado=0;
	}
	if($('#new_customer_vip').is(':checked')){
		var vip=1;
	}else{
		var vip=0;
	}
	if($('#new_customer_prueba').is(':checked')){
		var prueba=1;
	}else{
		var prueba=0;
	}
	if (name.length>0){
		if (surname.length>0){
			if (nif.length>0){
				if (phone.length>0){
					if (email.length>0){
						if (password.length>0){
							if(password==passwordrepeat){
								if(birthdate.length>0){
									if(rate_id!=-1){
											$('#botonenviar').html('<i class="fa fa-cog fa-spin"></i> ENVIANDO');
											$.getJSON(api_url+'customers/add_super?callback=?', {name:name, 
																							surname:surname,
																							nif:nif,
																							phone:phone,
																							email:email,
																							birthdate:birthdate,
																							rate_id:rate_id,
																							password:password,
																							vip:vip,
																							paid:pagado,
																							validated:validado,
																							prueba:prueba}, function(data){
																								
												if(data.status=='success'){
													show_new();
													$('#new_customer_name').val('');
													$('#new_customer_surname').val('');
													$('#new_customer_nif').val('');
													$('#new_customer_phone').val('');
													$('#new_customer_email').val('');
													$('#new_customer_password').val('');
													$('#new_customer_passwordrepeat').val('');
													$('#new_customer_birthdate').val('');
													$('#customer_rate').val('-1');
													$('#new_customer_validated').prop( "checked", false );
													$('#new_customer_paid').prop( "checked", false );
													$('#new_customer_vip').prop( "checked", false );
													$('#new_customer_prueba').prop( "checked", false );
													$('#botonenviar').html('ENVIAR');
													launch_alert('<i class="fa fa-smile-o"></i> Cliente creado','');
												}
												else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
											});
											
										}
										else launch_alert('<i class="fa fa-frown-o"></i> Debes seleccionar la tarifa','warning');
									}
									else launch_alert('<i class="fa fa-frown-o"></i> Debes introducir la fecha de nacimiento','warning');
								}
								else launch_alert('<i class="fa fa-frown-o"></i> Las contraseñas no coinciden','warning');			
							}
							else launch_alert('<i class="fa fa-frown-o"></i> Debes introducir una contraseña','warning');	
						}
						else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un email','warning');	
					}
					else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un teléfono','warning');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> Debes introducir un DNI','warning');
			}
			else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir los apellidos','warning');
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
	
}