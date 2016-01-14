function get_content() {
	
			$.getScript(media_url+'js/aux/modals.js', function(){
				$.getScript(media_url+'js/aux/journeys.js', function(){
					
						$.getScript(media_url+'js/aux/date.js', function(){
							$.getScript(media_url+'js/lib/jquery.keypad.min.js', function(){
								$.getScript(media_url+'js/lib/jquery.keypad-es.js', function(){
									$.post(base_url+'/partials/dashboard_digital_viewer', function(template, textStatus, xhr) {
										$('#main').html(template);
										loadRadio();
									});
								});
							});
						});
					
				});
			});
	

}

var myradio=false;
//var guard=false;
//var firebase_url=false;
//var firebase_ref=false;
//var journeys_ref=false;
//var reservations_ref=false;

function show_radio_map() {
    pulsador = window.open(base_url+'/radiomap/'+myradio.id, "RadioMap", "location=0,status=0,scrollbars=0,width=1024,height=680");
}

function loadRadio() {
	$.getJSON(api_url+'radios/get?callback=?', {}, function(data){
		if(data.status=='success'){
			myradio = data.data;
			//firebase_updating();
			//checkhash();
			startDrivers();
			$('#radio_title').html(myradio.name);
			if(myradio.digital){
				$('#radio_map').fadeIn();
			}
		}
		else super_error('Radio info failure');
	});
}

// DRIVERS
function startDrivers() {
	$.post(base_url+'/partials/radio_drivers_super', function(template, textStatus, xhr) {
		$('#submain').html(template);
		$('#new_driver_owner_nif').change(function(event) {
			var owner_nif = $('#new_driver_owner_nif').val();
			if (owner_nif.length>0) refill_owner(owner_nif);			
		});
		
		$('#new_driver_num_licence').change(function(event) {
			var num_licence = $('#new_driver_num_licence').val();
			if (num_licence.length>0) refill_licence(num_licence);			
		});
		
		$('#new_driver_form').submit(false).submit(function(e){
			new_driver();
			return false;
		});
		
		$('#new_driver_prefix').val(myradio.delegation_prefix);
		
		drivers_list();

	});
	
}

function drivers_list() {

	$.getJSON(api_url+'drivers/list_by_radio?callback=?', {radio_id:myradio.id}, function(data){
		if(data.status=='success'){
			var wrapper = $('#drivers_list');
			
			if(data.data.list_drivers.length>0){
				wrapper.empty();
				$.each(data.data.list_drivers, function(index, driver) {
					draw_driver_md(driver,$('#drivers_list'));
				});
			}
			else wrapper.empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin taxistas.</div></div>');
	
			
		}
		else super_error('Drivers failure');
	});
}

function modal_driver_detailss(driver_id) {
	var mymodal=newModal('driver_details_modal',true, true);
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	
	
	$.getJSON( api_url+'drivers/get_foreign?callback=?', {id:driver_id}, function(data){
		if(data.status=='success'){
			var body = $('<div></div>').attr({'id':'driver_details_wrapper'});
			$.post(base_url+'/partials/modal_driver_details', function(template, textStatus, xhr) {
				body.html(template);
				modalAddBody(mymodal,body);
				
				if(data.data.driver_profile.photo!=''){
					$('#photo_driver img').attr('src',data.data.driver_profile.photo);
				}
				
				var starts='';
				for (var i = 1; i <=data.data.driver_profile.rank; i++) {
					starts+='<i class="fa fa-star"></i>';
				}
				for (var j = 1; j <=5-data.data.driver_profile.rank; j++) {
					starts+='<i class="fa fa-star-o"></i>';
				}
				$('#rank_driver').html(starts);
				
				
				// AUTH
				$('#driver_auth_id').val(data.data.auth_profile.auth_id);
				$('#driver_token').val(data.data.auth_profile.token);
				$('#driver_name').val(data.data.auth_profile.name);
				$('#driver_surname').val(data.data.auth_profile.surname);
				$('#driver_email').val(data.data.auth_profile.email);
				$('#driver_prefix').val(data.data.auth_profile.prefix);
				$('#driver_phone').val(data.data.auth_profile.phone);
				
				// DRIVER
				$('#driver_id').val(data.data.driver_profile.id);
				$('#driver_device_model').val(data.data.driver_profile.device_model);
				$('#driver_so').val(data.data.driver_profile.os);
				
				// LICENCIA
				$('#driver_licence_id').val(data.data.licence_profile.id);
				$('#driver_num_licence').val(data.data.licence_profile.num_licence);
				$('#driver_num_plate').val(data.data.licence_profile.num_plate);
				$('#driver_car_brand').val(data.data.licence_profile.car_brand);
				$('#driver_car_model').val(data.data.licence_profile.car_model);
				
				// PATRON
				$('#driver_owner_id').val(data.data.owner_profile.id);
				$('#driver_owner_name').val(data.data.owner_profile.name);
				$('#driver_owner_surname').val(data.data.owner_profile.surname);
				$('#driver_owner_nif').val(data.data.owner_profile.nif);
				$('#driver_owner_email').val(data.data.owner_profile.email);
				$('#driver_owner_phone').val(data.data.owner_profile.phone);
				$('#driver_owner_address').val(data.data.owner_profile.address);
				$('#driver_owner_postal_code').val(data.data.owner_profile.postal_code);
				$('#driver_owner_locality').val(data.data.owner_profile.locality);
				$('#driver_owner_province').val(data.data.owner_profile.province);
				if(data.data.owner_profile.subsidized){
					$('#subsidized').addClass('fa-check-square');
					$('#subsidized').removeClass('fa-square');
				}else{
					$('#subsidized').addClass('fa-square');
					$('#subsidized').removeClass('fa-check-square');
				}
				$('#driver_owner_iban').val(data.data.owner_profile.iban);
				$('#driver_owner_swift').val(data.data.owner_profile.swift);
                
				$('#radio').hide();
				$('#tituloRadio').hide();

                // FEATRUES
                $.getJSON( api_url+'features/list_by_radio?callback=?', {radio_id:data.data.owner_profile.radio_id}, function(features_data){
                    if(features_data.status=='success'){
                        $('#features_licence').empty();
                        $.each(features_data.data.features, function(index, feature) {
                            var col = $('<div></div>').attr({'class':'col-md-2'}); $('#features_licence').append(col);
                            var checkbox = $('<div></div>').attr({'class':'feature_checkbox','data-licence-id':data.data.licence_profile.id,'data-feature-id':feature.id}).text(' '+feature.description); col.append(checkbox);
                            if(data.data.driver_profile.features[feature.id]!=undefined) var checkboxclass='fa-check-square';
                            else var checkboxclass='fa-square';
                            var i = $('<i></i>').attr({'class':'fa '+checkboxclass}); checkbox.prepend(i);
                            checkbox.click(function(){
                                check_licence_feature(this);
                            });
                        });

                    }
                    else $('#features_licence').html('<center>ERROR AL OBTENER LAS CARACTERÍSTICAS</center>');
                });


				
				
				// ULTIMAS CARRERAS
				$.getJSON( api_url+'drivers/last_journeys_foreign?callback=?', {id:driver_id, offset:local_offset}, function(data){
					if(data.status=='success'){
						
						var table_wrapper=$('<div></div>').attr('class','table-responsive'); $('#driver_detail_journeys').html(table_wrapper);
							var table=$('<table></table>').attr('class','table  table-condensed'); table_wrapper.append(table);
								var thead=$('<thead></thead>'); table.append(thead);
									var tr=$('<tr></tr>'); thead.append(tr);
										var th=$('<th></th>').text('Fecha'); tr.append(th);
										var th=$('<th></th>').text('Dirección'); tr.append(th);
										// var th=$('<th></th>').text('Taxista'); tr.append(th);
										var th=$('<th></th>').text('Precio'); tr.append(th);
										var th=$('<th></th>').text('Distancia'); tr.append(th);
										var th=$('<th></th>').text('Duración'); tr.append(th);
		
								var tbody=$('<tbody></tbody>'); table.append(tbody);
								
								$.each(data.data.journeys, function(index, journey) {
									
									var tr=$('<tr></tr>').attr({'class':journey.status, 'data-id':journey.id}); tbody.append(tr);
											var td=$('<td></td>').text(journey.date_depart); tr.append(td);
											var td=$('<td></td>').text(journey.origin); tr.append(td);
											// var td=$('<td></td>').text(journey.driver); tr.append(td);
											var td=$('<td></td>').text(price_to_string(journey.price,journey.currency)); tr.append(td);
											var td=$('<td></td>').text(distance_to_string(journey.distance)); tr.append(td);
											var td=$('<td></td>').text(duration_to_string(journey.duration)); tr.append(td);
									
								});
						
						
					}
					else $('#driver_detail_journeys').html('<center><i class="fa fa-frown-o"></i> Error al obtener carreras del taxista</center>');
				});
				
				// ESTADISTICAS
				$.getJSON( api_url+'drivers/stats_foreign?callback=?', {id:driver_id}, function(data){
					if(data.status=='success'){
						$('#driver_stats').html('<div class="item"><strong>Carreras:</strong> '+data.data.total_journeys+'</div><div class="item"><strong>Completadas:</strong> '+data.data.completed_journeys+'</div><div class="item"><strong>Canceladas:</strong> '+data.data.canceled_journeys+'</div>');
					}
				});
				
				
				
				var footer = $('<div></div>').attr({'id':'driver_details_footer'});
				
				if(data.data.auth_profile.active) footer.addClass('active');
				else footer.addClass('inactive');
				
				if(data.data.auth_profile.banned) footer.addClass('banned');
				else footer.addClass('unbanned');

                if(data.data.auth_profile.active) footer.addClass('no-validated');
				else footer.addClass('validated');
				
				
				var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
				
				var ban_button = $('<button></button>').attr({'type':'button','class':'ban btn btn-default'}).text('BANEAR'); group.append(ban_button);
				ban_button.click(function(){ ban(data.data.auth_profile.auth_id); });
				
				var unban_button = $('<button></button>').attr({'type':'button','class':'unban btn btn-default'}).text('DESBANEAR'); group.append(unban_button);
				unban_button.click(function(){ unban(data.data.auth_profile.auth_id); });
				
				var activate_button = $('<button></button>').attr({'type':'button','class':'activate btn btn-default'}).text('ACTIVAR'); group.append(activate_button);
				activate_button.click(function(){ activate_driver(data.data.driver_profile.id); });

                var request_validation_button = $('<button></button>').attr({'type':'button','class':'request_validation btn btn-default'}).text('SOLICITAR VALIDACIÓN'); group.append(request_validation_button);
				request_validation_button.click(function(){ request_validation(data.data.driver_profile.id); });
				
				var delete_driver_button = $('<button></button>').attr({'type':'button','class':'delete_owner btn btn-default'}).text('ELIMINAR TAXISTA'); group.append(delete_driver_button);
				delete_driver_button.click(function(){ delete_driver(data.data.driver_profile.id); });
				
				var delete_licence_button = $('<button></button>').attr({'type':'button','class':'delete_owner btn btn-default'}).text('ELIMINAR LICENCIA'); group.append(delete_licence_button);
				delete_licence_button.click(function(){ delete_licence(data.data.licence_profile.id); });
				
				var ninja = $('<button></button>').attr({'type':'button','class':'btn btn-default'}).html('<i class="fa fa-bolt"></i> NINJA MODE'); group.append(ninja);
				ninja.click(function(){ tokin(data.data.auth_profile.token); });
				
				modalAddFooter(mymodal,footer);
			});
			
			
			
			
			
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos del taxista','warning')
	});


}



function draw_driver_md(driver, wrapper) {
	var row = $('<div></div>').attr({'class':'row item md', 'data-id':driver.id}); wrapper.append(row);
	// row.addClass(driver.status);
	row.click(function(){
		modal_driver_detailss(driver.id);
	});
	var time = $('<div></div>').attr({'class':'col-sm-2 licence'}).text(driver.num_licence); row.append(time);
	var caller = $('<div></div>').attr({'class':'col-sm-4 name'}).text(driver.name); row.append(caller);
	var called = $('<div></div>').attr({'class':'col-sm-4 email'}).text(driver.email); row.append(called);
	var origin = $('<div></div>').attr({'class':'col-sm-2 phone'}).text(driver.phone); row.append(origin);
	
}

function show_new_driver() {
	if($('#new_driver_wrapper').css('display')=='none'){
		$('#new_driver_wrapper').slideDown();
		$('#new_driver').submit(false).submit(function(e){
			new_driver();
			return false;
		});
	}
	else $('#new_driver_wrapper').slideUp();
}

function new_driver() {
	
	
	var nif=$('#new_driver_owner_nif').val();
	var name_owner=$('#new_driver_owner_name').val();
	var surname_owner=$('#new_driver_owner_surname').val();
	var email_owner=$('#new_driver_owner_email').val();
	var phone_owner=$('#new_driver_owner_phone').val();
	var address=$('#new_driver_owner_address').val();
	var postal_code=$('#new_driver_owner_postal_code').val();
	var locality=$('#new_driver_owner_locality').val();
	var province=$('#new_driver_owner_province').val();
	
	var num_licence=$('#new_driver_num_licence').val();
	var num_plate=$('#new_driver_num_plate').val();
	var car_brand=$('#new_driver_car_brand').val();
	var car_model=$('#new_driver_car_model').val();
	
	var name=$('#new_driver_name').val();
	var surname=$('#new_driver_surname').val();
	var email=$('#new_driver_email').val();
	var password=$('#new_driver_password').val();
	var prefix=$('#new_driver_prefix').val();
	var phone=$('#new_driver_phone').val();
	
	var device_model=$('#new_driver_device_model').val();
	var os=$('#new_driver_so').val();
	
	if (name.length>0){
		if (email.length>0){
			if (password.length>0){
				$('#new_driver_button').html('<i class="fa fa-cog fa-spin"></i>');
				
				var params = {	nif : nif,
								name_owner : name_owner,
								surname_owner : surname_owner,
								email_owner : email_owner,
								phone_owner : phone_owner,
								address : address,
								postal_code : postal_code,
								locality : locality,
								province : province,
								num_licence : num_licence,
								num_plate : num_plate,
								car_brand : car_brand,
								car_model : car_model,
								name : name,
								surname : surname,
								email : email,
								password : password,
								prefix : prefix,
								phone : phone,
								device_model : device_model,
								radio_id:myradio.id,
								os : os }
				
				$.getJSON(api_url+'drivers/add?callback=?', params, function(data){
																
					if(data.status=='success'){
						drivers_list();
						$('#new_driver_button').html('CREAR TAXISTA');
						launch_alert('<i class="fa fa-smile-o"></i> Taxista registrado','');
						$('#new_driver_wrapper').slideUp();
					}
					else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
				});
				
			}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una contraseña','warning');
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}



function refill_owner(nif) {
	$.getJSON(api_url+'drivers/search_owner?callback=?', {radio_id:myradio.id, nif:nif}, function(data){
		if(data.status=='success'){
			$('#new_driver_owner_id').val(data.data.id);
			$('#new_driver_owner_name').val(data.data.name).attr('disabled','disabled');
			$('#new_driver_owner_surname').val(data.data.surname).attr('disabled','disabled');
			$('#new_driver_owner_email').val(data.data.email).attr('disabled','disabled');
			$('#new_driver_owner_phone').val(data.data.phone).attr('disabled','disabled');
			$('#new_driver_owner_address').val(data.data.address).attr('disabled','disabled');
			$('#new_driver_owner_postal_code').val(data.data.postal_code).attr('disabled','disabled');
			$('#new_driver_owner_locality').val(data.data.locality).attr('disabled','disabled');
			$('#new_driver_owner_province').val(data.data.province).attr('disabled','disabled');
			$('#new_driver_licence_id').val('');
			$('#new_driver_num_plate').val('').removeAttr('disabled');
			$('#new_driver_car_brand').val('').removeAttr('disabled');
			$('#new_driver_car_model').val('').removeAttr('disabled');
			// $('#copy_owner').fadeIn();
		}
		else{
			$('#new_driver_owner_id').val('');
			$('#new_driver_owner_name').val('').removeAttr('disabled');
			$('#new_driver_owner_surname').val('').removeAttr('disabled');
			$('#new_driver_owner_email').val('').removeAttr('disabled');
			$('#new_driver_owner_phone').val('').removeAttr('disabled');
			$('#new_driver_owner_address').val('').removeAttr('disabled');
			$('#new_driver_owner_postal_code').val('').removeAttr('disabled');
			$('#new_driver_owner_locality').val('').removeAttr('disabled');
			$('#new_driver_owner_province').val('').removeAttr('disabled');
			$('#new_driver_licence_id').val('');
			// $('#new_driver_num_plate').val('').removeAttr('disabled');
			// $('#new_driver_car_brand').val('').removeAttr('disabled');
			// $('#new_driver_car_model').val('').removeAttr('disabled');
			// $('#copy_owner').fadeOut();
		}
	});
}

function refill_licence(num_licence) {
	$.getJSON(api_url+'drivers/search_licence?callback=?', {radio_id:myradio.id, num_licence:num_licence}, function(data){
		if(data.status=='success'){
			$('#new_driver_licence_id').val(data.data.licence_data.id);
			$('#new_driver_num_plate').val(data.data.licence_data.num_plate).attr('disabled','disabled');
			$('#new_driver_car_brand').val(data.data.licence_data.car_brand).attr('disabled','disabled');
			$('#new_driver_car_model').val(data.data.licence_data.car_model).attr('disabled','disabled');
			$('#new_driver_owner_id').val(data.data.owner_data.id);
			$('#new_driver_owner_nif').val(data.data.owner_data.nif).attr('disabled','disabled');
			$('#new_driver_owner_name').val(data.data.owner_data.name).attr('disabled','disabled');
			$('#new_driver_owner_surname').val(data.data.owner_data.surname).attr('disabled','disabled');
			$('#new_driver_owner_email').val(data.data.owner_data.email).attr('disabled','disabled');
			$('#new_driver_owner_phone').val(data.data.owner_data.phone).attr('disabled','disabled');
			$('#new_driver_owner_address').val(data.data.owner_data.address).attr('disabled','disabled');
			$('#new_driver_owner_postal_code').val(data.data.owner_data.postal_code).attr('disabled','disabled');
			$('#new_driver_owner_locality').val(data.data.owner_data.locality).attr('disabled','disabled');
			$('#new_driver_owner_province').val(data.data.owner_data.province).attr('disabled','disabled');
			refill_registered_drivers(data.data.list_drivers);
			// $('#copy_owner').fadeIn();
		}
		else{
			$('#new_driver_licence_id').val('');
			$('#new_driver_num_plate').val('').removeAttr('disabled');
			$('#new_driver_car_brand').val('').removeAttr('disabled');
			$('#new_driver_car_model').val('').removeAttr('disabled');
			$('#new_driver_owner_id').val('');
			$('#new_driver_owner_name').val('').removeAttr('disabled');
			$('#new_driver_owner_nif').val('').removeAttr('disabled');
			$('#new_driver_owner_surname').val('').removeAttr('disabled');
			$('#new_driver_owner_email').val('').removeAttr('disabled');
			$('#new_driver_owner_phone').val('').removeAttr('disabled');
			$('#new_driver_owner_address').val('').removeAttr('disabled');
			$('#new_driver_owner_postal_code').val('').removeAttr('disabled');
			$('#new_driver_owner_locality').val('').removeAttr('disabled');
			$('#new_driver_owner_province').val('').removeAttr('disabled');
			$('#drivers_registered').empty();
			// $('#copy_owner').fadeOut();
		}
	});
	
}


function refill_registered_drivers(drivers) {
	$('#drivers_registered').empty();
	$.each(drivers, function(index, driver) {
		var row=$('<div></div>').attr({'class':'row'}); $('#drivers_registered').append(row);
			var col=$('<div></div>').attr({'class':'form-group col-md-2'}); row.append(col);
				var input=$('<input>').attr({'class':'form-control input-sm', 'type':'text', 'disabled':'disabled', 'value':driver.name}); col.append(input);
			var col=$('<div></div>').attr({'class':'form-group col-md-2'}); row.append(col);
				var input=$('<input>').attr({'class':'form-control input-sm', 'type':'text', 'disabled':'disabled', 'value':driver.surname}); col.append(input);
			var col=$('<div></div>').attr({'class':'form-group col-md-3'}); row.append(col);
				var input=$('<input>').attr({'class':'form-control input-sm', 'type':'text', 'disabled':'disabled', 'value':driver.email}); col.append(input);
			var col=$('<div></div>').attr({'class':'form-group col-md-2'}); row.append(col);
				var input=$('<input>').attr({'class':'form-control input-sm', 'type':'password', 'disabled':'disabled', 'value':'******'}); col.append(input);
			var col=$('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input=$('<input>').attr({'class':'form-control input-sm', 'type':'text', 'disabled':'disabled', 'value':driver.prefix}); col.append(input);
			var col=$('<div></div>').attr({'class':'form-group col-md-2'}); row.append(col);
				var input=$('<input>').attr({'class':'form-control input-sm', 'type':'text', 'disabled':'disabled', 'value':driver.phone}); col.append(input);
			
	});

}

function copy_owner() {
	$('#new_driver_name').val($('#new_driver_owner_name').val());
	$('#new_driver_surname').val($('#new_driver_owner_surname').val());
	$('#new_driver_email').val($('#new_driver_owner_email').val());
	$('#new_driver_phone').val($('#new_driver_owner_phone').val());
}

function clean_new_driver() {
	$('#new_driver_name').val('');
	$('#new_driver_surname').val('');
	$('#new_driver_email').val('');
	$('#new_driver_phone').val('');
}