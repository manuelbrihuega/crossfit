function get_content() {
	$.getJSON(api_url+'passengers/get?callback=?', '', function(data){
		if(data.status=='success'){
			console.log(data.data);
			$.post('partials/profile_passenger', function(template, textStatus, xhr) {
				$('#main').html(template);
				$('#passenger_name').val(data.data.auth_profile.name);
				$('#passenger_surname').val(data.data.auth_profile.surname);
				$('#passenger_email').val(data.data.auth_profile.email);
				$('#passenger_prefix').val(data.data.auth_profile.prefix);
				$('#passenger_phone').val(data.data.auth_profile.phone);
				
				if(data.data.passenger_profile.enterprise_id != null){
					$('#employee_well .content').html('Vinculado a la empresa "'+data.data.passenger_profile.enterprise+'"');
					$('#employee_well').fadeIn();
				}
				
				
				
				$('#save_profile').click(function(){
					save_profile();
				});
		
			});
			
		}
		else super_error('Data failure');
	});
}

function save_profile() {
	var params={	name:$('#passenger_name').val(),
					surname:$('#passenger_surname').val(),
					email:$('#passenger_email').val(),
					password:$('#passenger_password').val(),
					prefix:$('#passenger_prefix').val(),
					phone:$('#passenger_phone').val() 
				};
				
	$.getJSON(api_url+'passengers/edit?callback=?', params, function(data){
		if(data.status=='success') launch_alert('<i class="fa fa-smile-o"></i> Cambiado correctamente','')
		else launch_alert('<i class="fa fa-frown-o"></i> No se ha cambiado','warning')
	});
}

