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
	$('#submain').append('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div><div class="table-responsive" style="margin-top: 35px;"><table id="tablewey2" class="table table-condensed tablesorter"></table></div>');
	$('.waiting').show();
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


function active_new_fiesta_form() {
	$('#new_fiesta_form').submit(false).submit(function(e){
		new_fiesta();
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
					initialsearch();
					launch_alert('<i class="fa fa-smile-o"></i> Festivo añadido','');
				
				}else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});
											
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una fecha para el festivo','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un nombre para el festivo','warning');
	
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