function get_content() {

	$.getJSON(api_url+'drivers/get?callback=?', '', function(data){
		if(data.status=='success'){
			$.post('partials/profile_driver', function(template, textStatus, xhr) {
				$('#main').html(template);
				$('#driver_name').val(data.data.auth_profile.name);
				$('#driver_surname').val(data.data.auth_profile.surname);
				$('#driver_email').val(data.data.auth_profile.email);
				$('#driver_prefix').val(data.data.auth_profile.prefix);
				$('#driver_phone').val(data.data.auth_profile.phone);
				$('#driver_device_model').val(data.data.driver_profile.device_model);
				$('#driver_os').val(data.data.driver_profile.os);
				$('#driver_token').val(data.data.auth_profile.token);
				$('#save_profile').click(function(){
					save_profile();
				});
				$('#driver_num_licence').val(data.data.licence_profile.num_licence);
				$('#driver_num_plate').val(data.data.licence_profile.num_plate);
				$('#driver_car_brand').val(data.data.licence_profile.car_brand);
				$('#driver_car_model').val(data.data.licence_profile.car_model);
				$('#save_licence').click(function(){
					save_licence();
				});
				$('#download_doc').click(function(){
					download_document();
				});
				$('#upload_doc').click(function(){
					upload_document();
				});
				$('#driver_owner_name').val(data.data.owner_profile.name);
				$('#driver_owner_surname').val(data.data.owner_profile.surname);
				$('#driver_owner_nif').val(data.data.owner_profile.nif);
				$('#driver_owner_email').val(data.data.owner_profile.email);
				$('#driver_owner_phone').val(data.data.owner_profile.phone);
				$('#driver_owner_address').val(data.data.owner_profile.address);
				$('#driver_owner_postal_code').val(data.data.owner_profile.postal_code);
				$('#driver_owner_locality').val(data.data.owner_profile.locality);
				$('#driver_owner_province').val(data.data.owner_profile.province);
				$('#driver_owner_iban').val(data.data.owner_profile.iban);
				$('#driver_owner_swift').val(data.data.owner_profile.swift);
				$('#save_owner').click(function(){
					save_owner();
				});
			});
			
		}
		else super_error('Data failure');
	});
}

function save_profile() {
	var params={	name:$('#driver_name').val(),
					surname:$('#driver_surname').val(),
					email:$('#driver_email').val(),
					password:$('#driver_password').val(),
					prefix:$('#driver_prefix').val(),
					phone:$('#driver_phone').val(),
					device_model:$('#driver_device_model').val(),
					os:$('#driver_os').val()  
				};
				
	$.getJSON(api_url+'drivers/edit?callback=?', params, function(data){
		if(data.status=='success') launch_alert('<i class="fa fa-smile-o"></i> Cambiado correctamente','')
		else {console.log(data.response); launch_alert('<i class="fa fa-frown-o"></i> No se ha cambiado','warning')}
	});
}

function save_licence() {
	var params={	car_model:$('#driver_car_model').val(),
					car_brand:$('#driver_car_brand').val(),
					num_licence:$('#driver_num_licence').val(),
					num_plate:$('#driver_num_plate').val()
				};
				
	$.getJSON(api_url+'drivers/edit_licence?callback=?', params, function(data){
		if(data.status=='success') launch_alert('<i class="fa fa-smile-o"></i> Cambiado correctamente','')
		else {console.log(data.response); launch_alert('<i class="fa fa-frown-o"></i> No se ha cambiado','warning')}
	});
}

function save_owner() {
	var params={	name_owner:$('#driver_owner_name').val(),
					surname_owner:$('#driver_owner_surname').val(),
					nif:$('#driver_owner_nif').val(),
					email_owner:$('#driver_owner_email').val(),
					phone_owner:$('#driver_owner_phone').val(),
					address:$('#driver_owner_address').val(),
					postal_code:$('#driver_owner_postal_code').val(),
					locality:$('#driver_owner_locality').val(),
					province:$('#driver_owner_province').val(),
					iban:$('#driver_owner_iban').val(),
					swift:$('#driver_owner_swift').val()
				};
				
	$.getJSON(api_url+'drivers/edit_owner?callback=?', params, function(data){
		if(data.status=='success') launch_alert('<i class="fa fa-smile-o"></i> Cambiado correctamente','')
		else {console.log(data.response); launch_alert('<i class="fa fa-frown-o"></i> No se ha cambiado','warning')}
	});
}