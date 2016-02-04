

function get_content() {
	
		$.getScript(media_url+'js/aux/date.js', function(){
			$.getScript(media_url+'js/aux/modals.js', function(){
				$.getScript(media_url+'js/aux/perfil.js', function(){
					$.post(base_url+'/partials/perfil_clientes', function(template, textStatus, xhr) {
						$('#main').html(template);
						//$('#users_submenu div.button.passengers').addClass('active');
						//$('#submain').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');

						//var role = $('body').attr('data-role');
						//loadRates();
						//getPassengersStats();
						$.getJSON(api_url+'customers/get?callback=?', {}, function(data){
							if(data.status=='success'){
								$('#new_customer_name').val(data.data.auth_profile.name);
								$('#new_customer_surname').val(data.data.auth_profile.surname);
								$('#new_customer_nif').val(data.data.customer_profile.nif);
								$('#new_customer_phone').val(data.data.auth_profile.phone);
								$('#new_customer_email').val(data.data.auth_profile.email);
								$('#new_customer_birthdate').val(data.data.customer_profile.birthdate);
		
							}else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
						});
						active_new_customer_form();
						//initialsearch();
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



function active_new_customer_form() {
	$('#new_customer_form').submit(false).submit(function(e){
		edit_customer();
		return false;
	});
}

function edit_customer() {
	var name=$('#new_customer_name').val();
	var surname=$('#new_customer_surname').val();
	var nif=$('#new_customer_nif').val();
	var phone=$('#new_customer_phone').val();
	var email=$('#new_customer_email').val();
	var password=$('#new_customer_password').val();
	var passwordrepeat=$('#new_customer_passwordrepeat').val();
	var birthdate=$('#new_customer_birthdate').val();
	if (name.length>0){
		if (surname.length>0){
			if (nif.length>0){
				if (phone.length>0){
					if (email.length>0){
						if (password.length>0){
							if(password==passwordrepeat){
								if(birthdate.length>0){
										$('#botonenviar').html('<i class="fa fa-cog fa-spin"></i>');
										$.getJSON(api_url+'customers/edit_client?callback=?', {name:name, 
																							surname:surname,
																							nif:nif,
																							phone:phone,
																							email:email,
																							birthdate:birthdate,
																							password:password}, function(data){
																								
											if(data.status=='success'){
												$('#botonenviar').html('GUARDAR');
												launch_alert('<i class="fa fa-smile-o"></i> Perfil guardado satisfactoriamente','');
											}else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
										});
											
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