var order='nombreDESC';

function get_content() {
	
		$.getScript(media_url+'js/aux/date.js', function(){
			$.getScript(media_url+'js/aux/modals.js', function(){
				$.getScript(media_url+'js/aux/configuracion.js', function(){
					$.post(base_url+'/partials/configuracion_super', function(template, textStatus, xhr) {
						$('#main').html(template);
						$('#users_submenu div.button.passengers').addClass('active');

						var role = $('body').attr('data-role');
						initialsearch();
						active_new_fiesta_form();
						active_new_dnipre_form();
						edit_config();
						edit_config_email();
						$.getJSON(api_url+'schedules/get_configuration?callback=?', {}, function(data){
							if(data.status=='success'){
								$('#dias_reserva').val(data.data.dias_reserva);
								$('#dias_atras').val(data.data.dias_atras);
								$('#dias_pago').val(data.data.dias_pago);
								$('#email_coach').val(data.data.email);
								$('#telefono_coach').val(data.data.telefono_coach);				
							}
			
						});
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

function initialsearch() {
	$('#submain').html('');
	$('#submain').append('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div><div class="table-responsive" style="margin-top: 35px;"><table id="tablewey2" class="table table-condensed tablesorter"></table></div>');
	$('#submain .waiting').show();
	$('.table-responsive').hide();
			
	$.getJSON(api_url+'schedules/list_parties?callback=?', {}, function(data){
		////console.log(data.data)
		if(data.status=='success'){
			$('.waiting').hide();
			$('.table-responsive').show();
			$('#tablewey2').html('<thead><tr><th>Fecha</th><th>Nombre</th><th>Acción</th></tr></thead><tbody id="tableweybody2"></tbody>');
			
			if(data.data.length>0){
				$.each(data.data, function(index, party) {
					$('#tableweybody2').append('<tr data-id="'+party.id+'">'+'<td>'+party.date+'</td>'+'<td>'+party.name+'</td>'+'<td><i style="cursor:pointer; font-size:18px;" onclick=eliminarFiesta("'+party.id+'",this); class="fa fa-trash-o"></i></td>'+'</tr>');
				});
				$('#tablewey2').tablesorter();
			}
			else{ $('.waiting').hide();
			$('.table-responsive').show(); }
		}
		else { $('.waiting').hide();
			$('.table-responsive').show();}
	});
	$('#submaindos').html('');
	$('#submaindos').append('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div><div class="table-responsive" style="margin-top: 35px;"><table id="tablewey3" class="table table-condensed tablesorter"></table></div>');
	$('#submaindos .waiting').show();
	$.getJSON(api_url+'schedules/list_dnis?callback=?', {}, function(data){
		////console.log(data.data)
		if(data.status=='success'){
			$('.waiting').hide();
			$('.table-responsive').show();
			$('#tablewey3').html('<thead><tr><th>DNI</th><th>Acción</th></tr></thead><tbody id="tableweybody3"></tbody>');
			
			if(data.data.length>0){
				$.each(data.data, function(index, dni) {
					$('#tableweybody3').append('<tr data-id="'+dni.id+'">'+'<td>'+dni.nif+'</td>'+'<td><i style="cursor:pointer; font-size:18px;" onclick=eliminarDnipre("'+dni.id+'",this); class="fa fa-trash-o"></i></td>'+'</tr>');
				});
				$('#tablewey3').tablesorter();
			}
			else{ $('.waiting').hide();
			$('.table-responsive').show(); }
		}
		else { $('.waiting').hide();
			$('.table-responsive').show();}
	});
}

function eliminarFiesta(id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar el día festivo?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'schedules/delete_party?callback=?', {id:id}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Día festivo eliminado','');
				$('#submain').html('');
				initialsearch();	
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});

	}
}

function eliminarDnipre(id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar el DNI?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'schedules/delete_dni?callback=?', {id:id}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> DNI eliminado','');
				$('#submaindos').html('');
				initialsearch();	
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});

	}
}

function active_new_fiesta_form() {
	$('#new_fiesta_form').submit(false).submit(function(e){
		new_fiesta();
		return false;
	});
}

function active_new_dnipre_form() {
	$('#new_dnipre_form').submit(false).submit(function(e){
		new_dni();
		return false;
	});
}

function edit_config() {
	$('#new_config_form').submit(false).submit(function(e){
		edit_configuracion();
		return false;
	});
}

function edit_config_email() {
	$('#new_configemail_form').submit(false).submit(function(e){
		edit_configuracion_email();
		return false;
	});
}

function new_fiesta() {
	var date=$('#dia_festivo').val();
	var name=$('#nombre_festivo').val();
	if (name.length>0){
		if (date.length>0){
			$('#botonenviarfecha').html('<i class="fa fa-cog fa-spin"></i>');
			$.getJSON(api_url+'schedules/add_party?callback=?', {name:name, 
																date:date}, function(data){
																								
				if(data.status=='success'){
					$('#dia_festivo').val('');
					$('#nombre_festivo').val('');
					$('#submain').html('');
					$('#submain').append('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div><div class="table-responsive" style="margin-top: 35px;"><table id="tablewey2" class="table table-condensed tablesorter"></table></div>');
	$('#submain .waiting').show();
	$('.table-responsive').hide();
					$.getJSON(api_url+'schedules/list_parties?callback=?', {}, function(data){
		////console.log(data.data)
		if(data.status=='success'){
			$('#submain .waiting').hide();
			$('.table-responsive').show();
			$('#tablewey2').html('<thead><tr><th>Fecha</th><th>Nombre</th><th>Acción</th></tr></thead><tbody id="tableweybody2"></tbody>');
			
			if(data.data.length>0){
				$.each(data.data, function(index, party) {
					$('#tableweybody2').append('<tr data-id="'+party.id+'">'+'<td>'+party.date+'</td>'+'<td>'+party.name+'</td>'+'<td><i style="cursor:pointer; font-size:18px;" onclick=eliminarFiesta("'+party.id+'",this); class="fa fa-trash-o"></i></td>'+'</tr>');
				});
				$('#tablewey2').tablesorter();
			}
			else{ $('.waiting').hide();
			$('.table-responsive').show(); }
		}
		else { $('.waiting').hide();
			$('.table-responsive').show();}
	});

					launch_alert('<i class="fa fa-smile-o"></i> Festivo añadido','');
					$('#botonenviarfecha').html('Añadir');
				
				}else{ launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning'); $('#botonenviarfecha').html('Añadir');}
			});
											
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una fecha para el festivo','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un nombre para el festivo','warning');
	
}


function new_dni() {
	var nif=$('#dnipre').val();
	if (nif.length>0){
		$('#botonenviardnipre').html('<i class="fa fa-cog fa-spin"></i>');
			$.getJSON(api_url+'schedules/add_dni?callback=?', {nif:nif}, function(data){
																								
				if(data.status=='success'){
					$('#dnipre').val('');
					$('#submaindos').html('');
					$('#submaindos').append('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div><div class="table-responsive" style="margin-top: 35px;"><table id="tablewey3" class="table table-condensed tablesorter"></table></div>');
					$('#submaindos .waiting').show();
					$('.table-responsive').hide();
	
					$.getJSON(api_url+'schedules/list_dnis?callback=?', {}, function(data){
		////console.log(data.data)
		if(data.status=='success'){
			$('#submaindos .waiting').hide();
			$('.table-responsive').show();
			$('#tablewey3').html('<thead><tr><th>DNI</th><th>Acción</th></tr></thead><tbody id="tableweybody3"></tbody>');
			
			if(data.data.length>0){
				$.each(data.data, function(index, dni) {
					$('#tableweybody3').append('<tr data-id="'+dni.id+'">'+'<td>'+dni.nif+'</td>'+'<td><i style="cursor:pointer; font-size:18px;" onclick=eliminarDnipre("'+dni.id+'",this); class="fa fa-trash-o"></i></td>'+'</tr>');
				});
				$('#tablewey3').tablesorter();
			}
			else{ $('.waiting').hide();
			$('.table-responsive').show(); }
		}
		else { $('.waiting').hide();
			$('.table-responsive').show();}
	});
					launch_alert('<i class="fa fa-smile-o"></i> DNI añadido','');
					$('#botonenviardnipre').html('Añadir');


				
				}else{ launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning'); $('#botonenviardnipre').html('Añadir');}
			});
											
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un DNI','warning');
	
}

function edit_configuracion() {
	var dias_reserva=$('#dias_reserva').val();
	var dias_atras=$('#dias_atras').val();
	var dias_pago=$('#dias_pago').val();
	
			if (dias_reserva.length>0){
				if (dias_atras.length>0){
					if (dias_pago.length>0){
					$('#botonenviar').html('<i class="fa fa-cog fa-spin"></i>');
					$.getJSON(api_url+'schedules/edit_config?callback=?', { dias_reserva:dias_reserva,
																		    dias_atras:dias_atras,
																		    dias_pago:dias_pago}, function(data){
																								
						if(data.status=='success'){
							launch_alert('<i class="fa fa-smile-o"></i> Configuración guardada','');
							$('#botonenviar').html('Guardar');
				
						}else{ launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning'); $('#botonenviar').html('Guardar');}
				
					});
				}
				else launch_alert('<i class="fa fa-frown-o"></i> Debes indicar los días','warning');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> Debes indicar los días','warning');									
			}
			else launch_alert('<i class="fa fa-frown-o"></i> Debes indicar los días','warning');
		
}

function edit_configuracion_email() {
	var email=$('#email_coach').val();
	var telefono_coach=$('#telefono_coach').val();
	if (email.length>0){
		if (telefono_coach.length>0){
		$('#botonenviaremail').html('<i class="fa fa-cog fa-spin"></i>');
		$.getJSON(api_url+'schedules/edit_config_email?callback=?', { email:email, telefono_coach:telefono_coach}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Configuración guardada','');
				$('#botonenviaremail').html('Guardar');
				
			}else{ launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning'); $('#botonenviaremail').html('Guardar');}
		});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Debes indicar el teléfono','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes indicar el email','warning');									
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
													if($('#todos').is(':checked')){ searchPassengers(true,false,false,false,false,order); }
														if($('#pagados').is(':checked')){ searchPassengers(false,true,false,false,false,order); }
														if($('#nopagados').is(':checked')){ searchPassengers(false,false,true,false,false,order); }
														if($('#validados').is(':checked')){ searchPassengers(false,false,false,true,false,order); }
														if($('#novalidados').is(':checked')){ searchPassengers(false,false,false,false,true,order); }
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