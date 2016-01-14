var mydelegation=false;

function get_content() {
	$.post(base_url+'/partials/delegation_super', function(template, textStatus, xhr) {
		$('#main').html(template);
		loadDelegation();
	});

}



function loadDelegation() {
	var delegation_id=$('body').attr('data-item-id');
	var role = $('body').attr('data-role');
	var auth_id = $('body').attr('data-auth-id');

	var callback = function(data){
		if(data.status=='success'){
			mydelegation=data.data;
			$('#delegation_title').html(mydelegation.delegation_profile.country);
			checkhash();
		}
		else {
			console.error(data);
			super_error('delegation failure');
		}
	};

	if (delegation_id == "" && role == "U_Delegations") {
		$.getJSON(api_url + 'delegations/get?callback=?', callback);
	}

	// U_Super
	else {
		$.getJSON(api_url + 'delegations/get_foreign?callback=?', {id:delegation_id}, callback);
	}

}

// HASH
function checkhash() {
	var hash = window.location.hash.substring(1);
	if(hash.length>0) subselect(hash);
	else subselect('stats');
}


function subselect(subseccion) {
	sethash(subseccion);
	$('#delegation_submenu .button').removeClass('active');
	$('#delegation_submenu .button.'+subseccion).addClass('active');
	$('#submain').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');

	switch (subseccion) {
		case 'stats': 		startStats(); break;
		case 'profile': 	startProfile(); break;
		case 'features': 	startFeatures(); break;
		case 'mailchimp': 	mailchimp(); break;
		default: 			subselect('stats');
	}
}

function startStats() {
	$.post(base_url+'/partials/stats_delegation', function(template, textStatus, xhr) {
		$('#submain').html(template);
		loadStats();
	});
}

function loadStats() {
	var role = $('body').attr('data-role');
	var auth_id = $('body').attr('data-auth-id');

	var callback = function(data){
		if(data.status=='success'){
			$('#stat_journeys').text(data.data.total_journeys);
			$('#stat_completed').text(data.data.completed_journeys);
			$('#stat_canceled').text(data.data.canceled_journeys);
			$('#stat_credit_cards').text(parseInt(data.data.credit_card_percent)+'%');
			$('#stat_enterprises').text(data.data.total_enterprises);
			$('#stat_buttons').text(data.data.total_buttons);
			$('#stat_licences').text(data.data.total_licences);
		}
		else{
			if (data.response=='analytics_not_found') launch_alert('<i class="fa fa-frown-o"></i> Aun sin datos','warning');
		}
	};

	if (role == 'U_Delegations') {
		$.getJSON(api_url+'delegations/stats?callback=?', {id:mydelegation.delegation_profile.id}, callback);
	} else if (role == 'U_Super') {
		$.getJSON(api_url+'delegations/stats_foreign?callback=?', {id:mydelegation.delegation_profile.id}, callback);
	} else {
		super_error('Unauthorized');
	}

}



// PROFILE
function startProfile() {
	$.post(base_url+'/partials/delegation_profile_super', function(template, textStatus, xhr) {
		$('#submain').html(template);
		$('#delegation_id').val(mydelegation.delegation_profile.id);
		$('#delegation_country').val(mydelegation.delegation_profile.country);
		$('#delegation_country_code').val(mydelegation.delegation_profile.country_code);
		$('#delegation_currency').val(mydelegation.delegation_profile.currency);
		$('#delegation_address').val(mydelegation.delegation_profile.address);
		$('#delegation_company_name').val(mydelegation.delegation_profile.company_name);
		$('#delegation_cif').val(mydelegation.delegation_profile.cif);
		$('#delegation_postal_code').val(mydelegation.delegation_profile.postal_code);
		$('#delegation_locality').val(mydelegation.delegation_profile.locality);
		$('#delegation_tax').val(mydelegation.delegation_profile.tax);
		$('#delegation_percent').val(mydelegation.delegation_profile.percent);
		$('#edit_delegation_form').submit(false).submit(function(e){
			save_delegation();
			return false;
		});


		users_list();
	});

}

function save_delegation() {
	var id=$('#delegation_id').val();
	var country=$('#delegation_country').val();
	var country_code=$('#delegation_country_code').val();
	var currency=$('#delegation_currency').val();
	var address=$('#delegation_address').val();
	var company_name=$('#delegation_company_name').val();
	var cif=$('#delegation_cif').val();
	var postal_code=$('#delegation_postal_code').val();
	var locality=$('#delegation_locality').val();
	var tax=$('#delegation_tax').val();
	var percent=$('#delegation_percent').val();


	if (country.length>0){
		if(country_code.length>0){

			$('#edit_delegation_submit').html('<i class="fa fa-cog fa-spin"></i>');

			$.getJSON(api_url+'delegations/edit?callback=?', {	id:id,
																country:country,
																country_code:country_code,
																currency:currency,
																address:address,
																company_name:company_name,
																cif:cif,
																postal_code:postal_code,
																locality:locality,
																tax:tax,
																percent:percent}, function(data){

				if(data.status=='success'){
					launch_alert('<i class="fa fa-smile-o"></i> delegations guardada','');
					$('#edit_delegation_submit').html('Guardar');
					$.getJSON(api_url+'delegations/get_foreign?callback=?', {id:id}, function(data){
						if(data.status=='success'){
							mydelegation=data.data;
							$('#delegation_title').html(mydelegation.delegation_profile.country);
						}
					});

				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el código del pais','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un pais','warning');
}



function users_list() {
	var users = mydelegation.profile_list;
	var wrapper = $('#users_list');
	if(users.length>0){
		wrapper.empty();
		$.each(users, function(index, user) {
			dibujaFormularioUsuario(user);
		});
	}
	else wrapper.empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin visores.</div></div>');

}

function show_new_user() {
	if($('#new_user_wrapper').css('display')=='none'){
		$('#new_user_wrapper').slideDown();
		$('#new_user').submit(false).submit(function(e){
			new_user();
			return false;
		});
	}
	else $('#new_user_wrapper').slideUp();
}

function new_user() {
	var name=$('#new_user_name').val();
	var surname=$('#new_user_surname').val();
	var email=$('#new_user_email').val();
	var pass=$('#new_user_pass').val();
	var prefix=$('#new_user_prefix').val();
	var phone=$('#new_user_phone').val();
	if (name.length>0){
		if (email.length>0){
			if (pass.length>0){
				$('#new_user_submit').html('<i class="fa fa-cog fa-spin"></i>');
				$.getJSON(api_url+'delegations/add_user?callback=?', {	id:mydelegation.delegation_profile.id,
																	name:name,
																	surname:surname,
																	email:email,
																	prefix:prefix,
																	phone:phone,
																	password:pass}, function(data){

					if(data.status=='success'){
						$.getJSON(api_url+'delegations/get_foreign?callback=?', {id:mydelegation.delegation_profile.id}, function(data){
							if(data.status=='success'){
								mydelegation=data.data;
								users_list();
								$('#new_user_submit').html('Guardar');
								launch_alert('<i class="fa fa-smile-o"></i> delegations creada','');
							}
							else super_error('delegation failure');
						});

					}
					else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
				});
			}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una contraseña','warning');
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}

function dibujaFormularioUsuario(user) {
	var form=$('<form></form>').attr({'role':'form', 'class':'bateria'}); $('#users_list').append(form);
		var row = $('<div></div>').attr({'class':'row user', 'data-id':user.user_profile.id}); form.append(row);

			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control id', 'type':'hidden'}).val(user.user_profile.id); col.append(input);
				var input = $('<input>').attr({'class':'form-control token', 'type':'hidden'}).val(user.auth_profile.token); col.append(input);
				var input = $('<input>').attr({'class':'form-control input-sm name', 'type':'text', 'placeholder':'Nombre'}).val(user.auth_profile.name); col.append(input);

			var col = $('<div></div>').attr({'class':'form-group col-md-2'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm surname', 'type':'text', 'placeholder':'Apellidos'}).val(user.auth_profile.surname); col.append(input);

			var col = $('<div></div>').attr({'class':'form-group col-md-3'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm email', 'type':'text', 'placeholder':'Email'}).val(user.auth_profile.email); col.append(input);

			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm password', 'type':'text', 'placeholder':'Pass'}); col.append(input);

			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm prefix', 'type':'text', 'placeholder':'Prefix'}).val(user.auth_profile.prefix); col.append(input);

			var col = $('<div></div>').attr({'class':'form-group col-md-2'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm phone', 'type':'text', 'placeholder':'Phone'}).val(user.auth_profile.phone); col.append(input);

			var col = $('<div></div>').attr({'class':'form-group col-md-2 botonera'}); row.append(col);
				var save = $('<span></span>').attr({'class':'button save', 'title':'Guardar usuario'}).html('<i class="fa fa-floppy-o"></i>'); col.append(save);
				var ninja = $('<span></span>').attr({'class':'button ninja', 'title':'Ninja mode'}).html('<i class="fa fa-bolt"></i>'); col.append(ninja);
				var delet = $('<span></span>').attr({'class':'button delet', 'title':'Eliminar usuario'}).html('<i class="fa fa-trash-o"></i>'); col.append(delet);

				save.click(function(){ edit_user(user.user_profile.id); });
				ninja.click(function(){ tokin(user.auth_profile.token); });
				delet.click(function(){ delete_user(user.user_profile.id);  });
}

function edit_user(id) {
	var form = $('.row.user[data-id="'+id+'"]');
	var name = form.find('.form-control.name').val();
	var surname = form.find('.form-control.surname').val();
	var email = form.find('.form-control.email').val();
	var password = form.find('.form-control.password').val();
	var prefix = form.find('.form-control.prefix').val();
	var phone = form.find('.form-control.phone').val();
	var save_button = form.find('.button.save');
	if (name.length>0){
		if (email.length>0){
			var params = {user_id:id,name:name,surname:surname,email:email,prefix:prefix,phone:phone,password:password};
			if (password.length>0) params['password']=password;
			save_button.html('<i class="fa fa-cog fa-spin"></i>');
			$.getJSON(api_url+'delegations/edit_user?callback=?', params, function(data){
				if(data.status=='success'){
					$.getJSON(api_url+'delegations/get_foreign?callback=?', {id:mydelegation.delegation_profile.id}, function(data){
						if(data.status=='success'){
							mydelegation=data.data;
							users_list();
							$('#new_user_submit').html('Guardar');
							launch_alert('<i class="fa fa-smile-o"></i> Visor guardado','');
						}
						else super_error('delegation failure');
					});

				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});

		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}

function delete_user(id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar el usuario?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'delegations/delete_user?callback=?', {user_id:id}, function(data){
			if(data.status=='success'){
				$.getJSON(api_url+'delegations/get_foreign?callback=?', {id:mydelegation.delegation_profile.id}, function(data){
					if(data.status=='success'){
						mydelegation=data.data;
						users_list();
						launch_alert('<i class="fa fa-smile-o"></i> Usuario eliminado','');
					}
					else super_error('delegation failure');
				});




			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});

	}
}


// FEATURES 
function startFeatures() {
	$.post(base_url+'/partials/features_delegation', function(template, textStatus, xhr) {
		$('#submain').html(template);
		loadFeaturesCar();
	});
}

function loadFeaturesCar() {
	$.getJSON(api_url+'features/list_car_features?callback=?', function(data){
		if(data.status=='success'){
			if (data.data.length>0) {
				$('#features_list').empty();
				$.each(data.data, function(index, feature_car) {
					draw_feature_car(feature_car);
				});
				active_features_delegarion();
			}
			else{
				$('#features_list').html('Sin caracterísicas');
			}
			
		}
	});
}

function draw_feature_car(feature_car) {
	$('#features_list').append('<div class="col-sm-4"> <div class="item" data-id="'+feature_car.id+'" onclick="toggle_feature(this);"><i class="fa fa-fw fa-square"></i> '+feature_car.description+'</div></div>');
}


function active_features_delegarion() {
	$.each(mydelegation.features, function(index, feature) {
		var i = $('#features_list .item[data-id="'+feature.id+'"] i');
		i.removeClass().addClass('fa fa-fw fa-check-square');
	});
}

function toggle_feature(element) {
	var item = $(element);
	var feature_id = item.attr('data-id');
	var i = item.find('i');
	if (i.hasClass('fa-check-square')) var method = 'unassign_to_delegation';
	else var method = 'assign_to_delegation';
	
	i.removeClass().addClass('fa fa-fw fa-cog fa-spin');
	
	$.getJSON(api_url+'features/'+method+'?callback=?', {delegation_id:mydelegation.delegation_profile.id, feature_id:feature_id}, function(data){
		loadDelegation();
	});
}

function new_feature() {
	var feature=$('#new_feature_description').val();
	if (feature.length>0){
		$('#new_feature_submit').html('<i class="fa fa-cog fa-spin"></i>');
		$.getJSON(api_url+'features/add?callback=?', {	feature:feature}, function(data){

			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Característica creada','');
				loadDelegation();
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir la característica','warning');
}



