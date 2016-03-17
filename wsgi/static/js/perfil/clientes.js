

function get_content() {
	
		$.getScript(media_url+'js/aux/date.js', function(){
			$.getScript(media_url+'js/aux/modals.js', function(){
				$.getScript(media_url+'js/aux/perfil.js', function(){
					$.getScript(media_url+'js/lib/sha1.js', function(){
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
								$('#new_customer_direccion').val(data.data.customer_profile.direccion);
								if(data.data.customer_profile.photo!=''){
									$('#photo_viewer').css('background', 'url('+data.data.customer_profile.photo+') no-repeat');
            						$('#photo_viewer').attr('data-image', data.data.customer_profile.photo);
								}else{
									$('#photo_viewer').css('background', 'url('+'http://f.cl.ly/items/0Y2k2I3K373a1u2K3H1d/placeholder1.gif'+') no-repeat');
            						$('#photo_viewer').attr('data-image', 'http://f.cl.ly/items/0Y2k2I3K373a1u2K3H1d/placeholder1.gif');
								}
								var fecha=data.data.customer_profile.birthdate.split(" ");
								var fechados=fecha[0].split("-");
								var year=fechados[0];
								var mes=fechados[1];
								var dia=fechados[2];
								$('#new_customer_birthdate').val(year+'-'+mes+'-'+dia);
		
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
		});
	
}



function active_new_customer_form() {
	$('#new_customer_form').submit(false).submit(function(e){
		edit_customer();
		return false;
	});
	$("#enterprise_photo").change(function(){
        show_preview_photo_enterprise(this);
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
	var direccion=$('#new_customer_direccion').val();
	if (name.length>0){
		if (surname.length>0){
			if (nif.length>0){
				if (phone.length>0){
					if (email.length>0){
						
							if(password==passwordrepeat){
								if(birthdate.length>0){
										$('#botonenviar').html('<i class="fa fa-cog fa-spin"></i>');
										$.getJSON(api_url+'customers/edit_client?callback=?', {name:name, 
																							surname:surname,
																							nif:nif,
																							phone:phone,
																							email:email,
																							birthdate:birthdate,
																							direccion:direccion,
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

function show_preview_photo_enterprise(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#photo_viewer').css('background', 'url('+e.target.result+') no-repeat');
            $('#photo_viewer').attr('data-image', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function upload_photo_enterprise(){

    var photoviewer=$('#photo_viewer');
    var photo = photoviewer.attr('data-image');

    var timestamp_actual=new Date().getTime();
    var raw_input_params="timestamp="+timestamp_actual.toString()+"OZf0hPozV90ajcvqFlWVX1EyKBk";
    var signature = SHA1(raw_input_params);
    var data_input = {file:photo,
                    api_key:'681813545162725',
                    timestamp:timestamp_actual.toString(),
                    signature:signature};
    var spinner = $('<i></i>').attr({'class':'fa fa-cog fa-spin'});
    spinner.css({'position': 'relative','top': '-110px','font-size':'60px','left':'170px'});
    $('.linkable').append(spinner);
    $('.fa-floppy-o').css('display','none');
    $.ajax({
		url: "https://api.cloudinary.com/v1_1/crossfitjerez/image/upload",
        method:'post',
        data:data_input,
		success: function(data){
            var params={photo:data.url};
            $.getJSON(api_url+'customers/edit_photo?callback=?', params, function(data){
				if(data.status=='success'){

					launch_alert('<i class="fa fa-smile-o"></i> Imagen subida','');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');

                $('.fa-floppy-o').css('display','inline');
                spinner.remove();
			});

        },

        error: function(data){

            $('.fa-floppy-o').css('display','inline');
            launch_alert('<i class="fa fa-frown-o"></i> Error al subir la imagen','warning');
            spinner.remove();
        }

    });


}
