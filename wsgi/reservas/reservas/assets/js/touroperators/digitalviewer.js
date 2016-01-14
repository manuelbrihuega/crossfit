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



function loadRadio() {
	$.getJSON(api_url+'radios/get?callback=?', {}, function(data){
		if(data.status=='success'){
			myradio = data.data;
			//firebase_updating();
			//checkhash();
			startTouroperators();
			$('#radio_title').html(myradio.name);
			if(myradio.digital){
				$('#radio_map').fadeIn();
			}
		}
		else super_error('Radio info failure');
	});
}

// DRIVERS
function startTouroperators() {
	$.post(base_url+'/partials/radio_touroperators', function(template, textStatus, xhr) {
		$('#submain').html(template);
		$('#new_touroperator_form').submit(false).submit(function(e){
			new_touroperator();
			return false;
		});
		
		touroperators_list();

	});
	
}

function touroperators_list() {

	$.getJSON(api_url+'touroperators/list_by_radio?callback=?', {radio_id:myradio.id}, function(data){
		if(data.status=='success'){
			var wrapper = $('#touroperators_list');
			
			if(data.data.list_touroperator.length>0){
				wrapper.empty();
				$.each(data.data.list_touroperator, function(index, tour) {
					draw_touroperator_md(tour,$('#touroperators_list'));
				});
			}
			else wrapper.empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin touroperadores.</div></div>');
	
			
		}
		else super_error('Touroperators failure');
	});
}

function modal_touroperator_detailss(touroperator_id) {
	var mymodal=newModal('driver_details_modal',true, true);
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	
	
	$.getJSON( api_url+'touroperators/get_foreign?callback=?', {id:touroperator_id}, function(data){
		if(data.status=='success'){
			var body = $('<div></div>').attr({'id':'driver_details_wrapper'});
			$.post(base_url+'/partials/modal_touroperator_details', function(template, textStatus, xhr) {
				body.html(template);
				modalAddBody(mymodal,body);
				
				// AUTH
				$('#touroperator_auth_id').val(data.data.auth_profile.auth_id);
				$('#touroperator_token').val(data.data.auth_profile.token);
				$('#touroperator_name').val(data.data.auth_profile.name);
				$('#touroperator_email').val(data.data.auth_profile.email);
				$('#touroperator_phone').val(data.data.auth_profile.phone);
				$('#touroperator_prefix').val(data.data.auth_profile.prefix);
				
				// DRIVER
				$('#touroperator_id').val(data.data.touroperator_profile.id);
				$('#touroperator_cif').val(data.data.touroperator_profile.cif);
				$('#touroperator_address').val(data.data.touroperator_profile.address);
				$('#touroperator_province').val(data.data.touroperator_profile.province);
				$('#touroperator_locality').val(data.data.touroperator_profile.locality);
				$('#touroperator_cp').val(data.data.touroperator_profile.cp);
				$('#touroperator_web').val(data.data.touroperator_profile.web);
				
				var footer = $('<div></div>').attr({'id':'driver_details_footer'});
				
				var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
				
				var delete_driver_button = $('<button></button>').attr({'type':'button','class':'delete_owner btn btn-default'}).text('ELIMINAR TAXISTA'); group.append(delete_driver_button);
				delete_driver_button.click(function(){ delete_touroperator(data.data.touroperator_profile.id); });
				
				var ninja = $('<button></button>').attr({'type':'button','class':'btn btn-default'}).html('<i class="fa fa-bolt"></i> NINJA MODE'); group.append(ninja);
				ninja.click(function(){ tokin(data.data.auth_profile.token); });
				
				modalAddFooter(mymodal,footer);
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos del touroperador','warning')
	});
}



function draw_touroperator_md(touroperator, wrapper) {
	var row = $('<div></div>').attr({'class':'row item md', 'data-id':touroperator.id}); wrapper.append(row);
	// row.addClass(driver.status);
	row.click(function(){
		modal_touroperator_detailss(touroperator.id);
	});
	var time = $('<div></div>').attr({'class':'col-sm-2 licence'}).text(touroperator.cif); row.append(time);
	var caller = $('<div></div>').attr({'class':'col-sm-4 name'}).text(touroperator.name); row.append(caller);
	var called = $('<div></div>').attr({'class':'col-sm-4 email'}).text(touroperator.email); row.append(called);
	var origin = $('<div></div>').attr({'class':'col-sm-2 phone'}).text(touroperator.phone); row.append(origin);
	
}

function show_new_touroperator() {
	if($('#new_touroperator_wrapper').css('display')=='none'){
		$('#new_touroperator_wrapper').slideDown();
		$('#new_touroperator').submit(false).submit(function(e){
			new_touroperator();
			return false;
		});
	}
	else $('#new_touroperator_wrapper').slideUp();
}

function new_touroperator() {
	
	var name=$('#new_touroperator_name').val();
	var email=$('#new_touroperator_email').val();
	var password=$('#new_touroperator_password').val();
	var prefix=myradio.prefix;
	var phone=$('#new_touroperator_phone').val();
	var cif=$('#new_touroperator_cif').val();
	var address=$('#new_touroperator_address').val();
	var province=$('#new_touroperator_province').val();
	var city=$('#new_touroperator_city').val();
	var cp=$('#new_touroperator_cp').val();
	var web=$('#new_touroperator_web').val();
	
	if (name.length>0){
		if (email.length>0){
			if (password.length>0){
				$('#new_touroperator_button').html('<i class="fa fa-cog fa-spin"></i>');
				
				var params = {	name : name,
								email : email,
								password : password,
								prefix : prefix,
								phone : phone,
								cif : cif,
								address : address,
								province : province,
								locality : city,
								cp : cp,
								web : web,
								radio_id:myradio.id}
				
				$.getJSON(api_url+'touroperators/add?callback=?', params, function(data){
																
					if(data.status=='success'){
						touroperators_list();
						$('#new_touroperator_button').html('CREAR TOUROPERADOR');
						launch_alert('<i class="fa fa-smile-o"></i> Touroperador registrado','');
						$('#new_touroperator_wrapper').slideUp();
					}
					else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
				});
				
			}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una contraseña','warning');
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
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



function clean_new_driver() {
	$('#new_driver_name').val('');
	$('#new_driver_surname').val('');
	$('#new_driver_email').val('');
	$('#new_driver_phone').val('');
}
