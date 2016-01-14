function loadAddressInMap(e){
	if(e.keyCode === 13){
		if($('#stop_address').val()!=''){
			actualizaMapa();
		}
	}
}

function get_content() {
	$.ajaxSetup({ cache: false });
	
    $.when(
		$.getScript(media_url+'js/aux/drivers.js'),
		$.getScript(media_url+'js/aux/modals.js'),
		$.getScript(media_url+'js/aux/journeys.js'),
		$.getScript(media_url+'js/aux/date.js'),
		$.getScript('https://cdn.firebase.com/js/client/1.0.11/firebase.js'),
		$.getScript('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js'),
        $.ready.promise()
    ).then(function(){
		$.post(base_url+'/partials/radio_super', function(template, textStatus, xhr) {
			$('#main').html(template);
			cargaRadio();
		});
    });
	
	
	
	// $.getScript(media_url+'js/aux/drivers.js', function(){
	// 	$.getScript(media_url+'js/aux/modals.js', function(){
	// 		$.getScript(media_url+'js/aux/journeys.js', function(){
	// 			$.getScript(media_url+'js/aux/date.js', function(){
	// 				$.post(base_url+'/partials/radio_super', function(template, textStatus, xhr) {
	// 					$('#main').html(template);
	// 					cargaRadio();
	// 				
	// 				});
	// 			});
	// 		});
	// 	});
	// });

}

var myradio=false;

function cargaRadio() {
	var radio_id=$('body').attr('data-item-id');
	$.getJSON(api_url+'radios/get_foreign?callback=?', {id:radio_id}, function(data){
		if(data.status=='success'){
			myradio=data.data;
			$('#radio_title').html(myradio.name);
			if(!myradio.digital){
				if(myradio.status=='on'){
					$('#radio_status').attr('title','Conectada');
					$('#radio_status_i').addClass('fa-link');
				}
				else{
					$('#radio_status').attr('title','Desconectada');
					$('#radio_status_i').addClass('fa-unlink');
				}
				$('#radio_status').addClass(myradio.status).fadeIn();
			}
			else {
				$('#gestoresLabel').html('ADMINISTRADOR SISTEMA');
				$('#radio_map').fadeIn();
			}
			
			if(myradio.active)	$('#radio_active').attr('title','Activa').addClass('active').removeClass('inactive').attr('onclick','deactivate_radio_2(this);');
			else $('#radio_active').attr('title','Inactiva').addClass('inactive').removeClass('active').attr('onclick','activate_radio_2(this);');
			
			$('.buttons_tools .item').tooltip();
			checkhash();
		}
		else super_error('Radio failure');
	});
}

// HASH
function checkhash() {
	var hash = window.location.hash.substring(1);
	if(hash.length>0) subselect(hash);
	else subselect('stats');
}


function subselect(subseccion) {
	sethash(subseccion);
	$('#radio_submenu .button').removeClass('active');
	$('#radio_submenu .button.'+subseccion).addClass('active');
	$('#submain').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	
	switch (subseccion) {
		case 'stats': 		startStats(); break;
		case 'historical': 	startHistorical(); break;
		case 'locations': 	startLocations(); break;
		case 'viewers': 	startViewers(); break;
		case 'drivers': 	startDrivers(); break;
		case 'stops': 		startStops(); break;
		case 'profile': 	startProfile(); break;
		default: 			subselect('stats');
	}
}

function startStats() {
	$.post(base_url+'/partials/stats_radio', function(template, textStatus, xhr) {
		$('#submain').html(template);
		loadStats();
	});
}

function loadStats() {
	$.getJSON(api_url+'radios/stats_foreign?callback=?', {id:myradio.id}, function(data){
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
			if (data.response=='radio_analytics_not_found') launch_alert('<i class="fa fa-frown-o"></i> Aun sin datos','warning');
		}
	});
}


// HISTORICAL
function startHistorical() {
	$.getScript('http://code.jquery.com/ui/1.9.1/jquery-ui.min.js').done(function () {
	   
		$.getScript(media_url+'js/lib/jquery.ui.timepicker.js').done(function () {
	   
	   		$.getScript(media_url+'js/lib/jquery.ui.datepicker.es.js').done(function () {
			
				$('<link/>').attr({'rel': "stylesheet", 'type': "text/css", 'href': media_url+"css/lib/jquery-ui-1.10.3.css"}).appendTo('head');
				$('<link/>').attr({'rel': "stylesheet", 'type': "text/css", 'href': media_url+"css/lib/datetimepicker.css"}).appendTo('head');
				$('<link/>').attr({'rel': "stylesheet", 'type': "text/css", 'href': media_url+"css/partials/datetimepicker.css"}).appendTo('head');
				
			    var center=$('<center></center>'); $('#submain').html(center);
			    var datepicker_wrapper=$('<div></div>').attr({'id':'datepicker_wrapper'}); center.append(datepicker_wrapper);
			    var datepicker_input=$('<input>').attr({'type':'hidden','id':'datepicker_input'}); center.append(datepicker_input);
			    var ahora=new Date();
			    datepicker_input.val(ahora.getFullYear()+'/'+(parseInt(ahora.getMonth())+1)+'/'+ahora.getDate());
				
			    $('#datepicker_wrapper').datepicker({ maxDate: "0", altField: "#datepicker_input", altFormat: "dd/mm/yy", onSelect: function(dateText) {
      			  	showDaily(dateText);
    			}});
				
				var wrapper = $('<div></div>').attr({'id':'daily_list','class':'journeys_sm_list'});
				$('#submain').append(wrapper);
				
				showDaily(fecha_hoy_simple());
				
				
			
	   		},true);
	   
		},true);
		
	},true);
	
}

function showDaily(fecha) {
	$('#daily_list').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').css({'margin-top':'40px'});
	
	var mydate=fecha.split("/");
	
	$.getJSON(api_url+'radios/daily?callback=?', {id:myradio.id, day:mydate[0],month:mydate[1], year:mydate[2], offset:local_offset}, function(data){
		if(data.status=='success'){
			
			$('#daily_list').empty();
			$.each(data.data, function(index, journey) {
				draw_journey_sm(journey, $('#daily_list'));
			});
		
			
		}
		else super_error('Historical failure');
	});
}

function calendar() {
	// $('#submain').html('startHistorical');
	
	$.getScript('http://code.jquery.com/ui/1.9.1/jquery-ui.min.js').done(function () {
	   	////console.log('Carga jquery ui');
	   
		$.getScript(media_url+'js/lib/jquery.ui.timepicker.js').done(function () {
		   	////console.log('Carga timepicker');
	   
	   		$.getScript(media_url+'js/lib/jquery.ui.datepicker.es.js').done(function () {
	   	   		////console.log('Carga datepicker');
			
		   		$.getScript(media_url+'js/lib/jquery-ui-sliderAccess.js').done(function () {
		   	   		////console.log('Carga sliderAccess');
				
					$('<link/>').attr({'rel': "stylesheet", 'type': "text/css", 'href': media_url+"css/lib/jquery-ui-1.10.3.css"}).appendTo('head');
					$('<link/>').attr({'rel': "stylesheet", 'type': "text/css", 'href': media_url+"css/lib/datetimepicker.css"}).appendTo('head');
					$('<link/>').attr({'rel': "stylesheet", 'type': "text/css", 'href': media_url+"css/partials/datetimepicker.css"}).appendTo('head');
					
				    var center=$('<center></center>'); $('#submain').html(center);
				    var datepicker_wrapper=$('<div></div>').attr({'id':'datepicker_wrapper'}); center.append(datepicker_wrapper);
				    var datepicker_input=$('<input>').attr({'type':'hidden','id':'datepicker_input'}); center.append(datepicker_input);
				    var timepicker_wrapper=$('<div></div>').attr({'id':'timepicker_wrapper'}); center.append(timepicker_wrapper);
				    var timepicker_input=$('<input>').attr({'type':'hidden','id':'timepicker_input'}); center.append(timepicker_input);
				    var ahora=new Date();
				    datepicker_input.val(ahora.getFullYear()+'/'+(parseInt(ahora.getMonth())+1)+'/'+ahora.getDate());
    
				    $('#datepicker_wrapper').datepicker({ minDate: new Date(), maxDate: "+14D", altField: "#datepicker_input", altFormat: "dd/mm/yy"});
				    $('#timepicker_wrapper').timepicker({altField: "#timepicker_input", hour: ahora.getHours(), minute: ahora.getMinutes(), hourMin: 0, hourMax: 23, stepMinute: 5});
				
		   		},true);
			
	   		},true);
	   
		},true);
		
	},true);
	
	
	
}



// LOCATIONS
function startLocations() {

	$.post(base_url+'/partials/radio_locations_super', function(template, textStatus, xhr) {
		$('#submain').html(template);
		$('#new_location_radio_id').val(myradio.id);
		$('#new_location_locality').val(myradio.city);
		$('#new_location_country_code').val(myradio.country_code);
		$('#new_location_postal_code').focus();
		$('#new_location_form').submit(false).submit(function(e){
			new_location();
			return false;
		});
		location_list();
	});

	
}

function location_list() {
	$.getJSON(api_url+'radios/list_locations?callback=?', {id:myradio.id}, function(data){
		if(data.status=='success'){
			var wrapper = $('#locations_list');
			
			if(data.data.length>0){
				
				wrapper.empty();
				$.each(data.data, function(index, location) {
					var col = $('<div></div>').attr({'class':'col-sm-4'}); wrapper.append(col);
					var item = $('<div></div>').attr({'class':'item'}); col.append(item);
					var minutes = $('<div></div>').attr({'class':'minutes'}).text(location.minutes); item.append(minutes);
					var cp = $('<div></div>').attr({'class':'cp'}).text(location.postal_code); item.append(cp);
					var locality = $('<div></div>').attr({'class':'locality'}).text(location.locality); item.append(locality);
					
					item.click(function(){
						modal_locations_details(location.id);
					})
				});
			}
			else wrapper.empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin carreras pendientes.</div></div>');
	
			
		}
		else super_error('Locations failure');
	});
}

function new_location() {
	var radio_id=$('#new_location_radio_id').val();
	var postal_code=$('#new_location_postal_code').val();
	var locality=$('#new_location_locality').val();
	var country_code=$('#new_location_country_code').val();
	var minutes=$('#new_location_minutes').val();
	$('#new_location_submit').html('<i class="fa fa-cog fa-spin"></i>');
	
	if (postal_code.length>0){
		if(locality.length>0){
		
			$.getJSON(api_url+'locations/add?callback=?', {	radio_id:radio_id, 
															postal_code:postal_code,
															locality:locality,
															country_code:country_code,
															minutes:minutes}, function(data){
																
				if(data.status=='success'){
					location_list();
					launch_alert('<i class="fa fa-smile-o"></i> Localización creada','');
					$('#new_location_submit').html('Enviar');
					$('#new_location_postal_code').focus();
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
				////console.log(data);
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir la localidad','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un código postal','warning');
	
}



// VIEWERS
function startViewers() {
	if(myradio.digital){
		$.post(base_url+'/partials/radio_digital_viewers_super', function(template, textStatus, xhr) {
			$('#submain').html(template);
			digital_viewers_list();
			digital_operator_list();
			$('#new_viewer_prefix').val(myradio.delegation_prefix);
		});
	}
	else{
		$.post(base_url+'/partials/radio_viewers_super', function(template, textStatus, xhr) {
			$('#submain').html(template);
			viewers_list();
			$('#new_viewer_prefix').val(myradio.delegation_prefix);
		});
	}
	
	
}


function viewers_list() {
	$.getJSON(api_url+'radios/list_viewers?callback=?', {id:myradio.id}, function(data){
		if(data.status=='success'){
			var wrapper = $('#viewers_list');
			if(data.data.viewers.length>0){
				wrapper.empty();
				$.each(data.data.viewers, function(index, viewer) {
					dibujaFormularioVisor(viewer);
				});
			}
			else wrapper.empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin visores.</div></div>');
	
			
		}
		else super_error('Locations failure');
	});
}

function digital_viewers_list() {
	$.getJSON(api_url+'radios/list_digital_viewers?callback=?', {id:myradio.id}, function(data){
		if(data.status=='success'){
			var wrapper = $('#viewers_list');
			if(data.data.viewers.length>0){
				wrapper.empty();
				$.each(data.data.viewers, function(index, viewer) {
					dibujaFormularioVisorDigital(viewer);
				});
			}
			else wrapper.empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin visores.</div></div>');
	
			
		}
		else super_error('Locations failure');
	});
}

function digital_operator_list() {
	$.getJSON(api_url+'operators/list_all?callback=?', function(data){
		if(data.status=='success'){
			var wrapper = $('#operators_list');
			if(data.data.list.length>0){
				wrapper.empty();
				$.each(data.data.list, function(index, viewer) {
					dibujaFormularioVisorDigitalOperator(viewer);
				});
			}
			else wrapper.empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin operadoras.</div></div>');
	
			
		}
		else super_error('Locations failure');
	});
}

function show_new_viewer() {
	if($('#new_viewer_wrapper').css('display')=='none'){
		$('#new_viewer_wrapper').slideDown();
		$('#new_viewer').submit(false).submit(function(e){
			new_viewer();
			return false;
		});
	}
	else $('#new_viewer_wrapper').slideUp();
}

function show_new_digital_viewer() {
	if($('#new_viewer_wrapper').css('display')=='none'){
		$('#new_viewer_wrapper').slideDown();
		$('#new_viewer').submit(false).submit(function(e){
			new_digital_viewer();
			return false;
		});
	}
	else $('#new_viewer_wrapper').slideUp();
}

function show_new_digital_operator() {
	if($('#new_viewer_wrapper_operator').css('display')=='none'){
		$('#new_viewer_wrapper_operator').slideDown();
		$('#new_viewer_operator').submit(false).submit(function(e){
			new_digital_viewer_operator();
			return false;
		});
	}
	else $('#new_viewer_wrapper_operator').slideUp();
}

function new_viewer() {
	var name=$('#new_viewer_name').val();
	var surname=$('#new_viewer_surname').val();
	var email=$('#new_viewer_email').val();
	var pass=$('#new_viewer_pass').val();
	var prefix=$('#new_viewer_prefix').val();
	var phone=$('#new_viewer_phone').val();
	if (name.length>0){
		if (email.length>0){
			if (pass.length>0){
				$('#new_viewer_submit').html('<i class="fa fa-cog fa-spin"></i>');
				$.getJSON(api_url+'radios/add_viewer?callback=?', {	radio_id:myradio.id,
																	name:name,
																	surname:surname,
																	email:email,
																	prefix:prefix,
																	phone:phone,
																	password:pass}, function(data){
																
					if(data.status=='success'){
						viewers_list();
						$('#new_viewer_submit').html('Guardar');
						launch_alert('<i class="fa fa-smile-o"></i> Radios creada','');
					}
					else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
				});
			}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una contraseña','warning');
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}

function new_digital_viewer() {
	var name=$('#new_viewer_name').val();
	var surname=$('#new_viewer_surname').val();
	var email=$('#new_viewer_email').val();
	var pass=$('#new_viewer_pass').val();
	var prefix=$('#new_viewer_prefix').val();
	var phone=$('#new_viewer_phone').val();
	if (name.length>0){
		if (email.length>0){
			if (pass.length>0){
				$('#new_viewer_submit').html('<i class="fa fa-cog fa-spin"></i>');
				$.getJSON(api_url+'radios/add_digital_viewer?callback=?', {	radio_id:myradio.id,
																	name:name,
																	surname:surname,
																	email:email,
																	prefix:prefix,
																	phone:phone,
																	password:pass}, function(data){
																
					if(data.status=='success'){
						digital_viewers_list();
						$('#new_viewer_submit').html('Guardar');
						launch_alert('<i class="fa fa-smile-o"></i> Gestor creado','');
					}
					else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
				});
			}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una contraseña','warning');
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}

function new_digital_viewer_operator() {
	var name=$('#new_operator_name').val();
	var email=$('#new_operator_email').val();
	var pass=$('#new_operator_pass').val();
	var radio = myradio.id;
	if (name.length>0){
		if (email.length>0){
			if (pass.length>0){
				$('#new_operator_submit').html('<i class="fa fa-cog fa-spin"></i>');
				$.getJSON(api_url+'operators/add?callback=?', {	name:name, 
																email:email,
																password:pass,
																radio_id:radio}, function(data){
																
					if(data.status=='success'){
						digital_operator_list();
						$('#new_operator_submit').html('Guardar');
						launch_alert('<i class="fa fa-smile-o"></i> Operadora creada','');
					}
					else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
				});
			}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una contraseña','warning');
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}

function dibujaFormularioVisor(viewer) {
	var form=$('<form></form>').attr({'role':'form', 'class':'bateria'}); $('#viewers_list').append(form);
		var row = $('<div></div>').attr({'class':'row viewer', 'data-id':viewer.id}); form.append(row);
			
			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control id', 'type':'hidden'}).val(viewer.id); col.append(input);
				var input = $('<input>').attr({'class':'form-control token', 'type':'hidden'}).val(viewer.token); col.append(input);
				var input = $('<input>').attr({'class':'form-control input-sm name', 'type':'text', 'placeholder':'Nombre'}).val(viewer.name); col.append(input);
			
			var col = $('<div></div>').attr({'class':'form-group col-md-2'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm surname', 'type':'text', 'placeholder':'Apellidos'}).val(viewer.surname); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-3'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm email', 'type':'text', 'placeholder':'Email'}).val(viewer.email); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm password', 'type':'text', 'placeholder':'Pass'}); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm prefix', 'type':'text', 'placeholder':'Prefix'}).val(viewer.prefix); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-2'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm phone', 'type':'text', 'placeholder':'Phone'}).val(viewer.phone); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-2 botonera'}); row.append(col);
				var save = $('<span></span>').attr({'class':'button save', 'title':'Guardar visor'}).html('<i class="fa fa-floppy-o"></i>'); col.append(save);
				var ninja = $('<span></span>').attr({'class':'button ninja', 'title':'Ninja mode'}).html('<i class="fa fa-bolt"></i>'); col.append(ninja);
				var delet = $('<span></span>').attr({'class':'button delet', 'title':'Eliminar visor'}).html('<i class="fa fa-trash-o"></i>'); col.append(delet);
				
				save.click(function(){ edit_viewer(viewer.id); });
				ninja.click(function(){ tokin(viewer.token); });
				delet.click(function(){ delete_viewer(viewer.id);  });
}

function dibujaFormularioVisorDigital(viewer) {
	var form=$('<form></form>').attr({'role':'form', 'class':'bateria'}); $('#viewers_list').append(form);
		var row = $('<div></div>').attr({'class':'row viewer', 'data-id':viewer.id}); form.append(row);
			
			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control id', 'type':'hidden'}).val(viewer.id); col.append(input);
				var input = $('<input>').attr({'class':'form-control token', 'type':'hidden'}).val(viewer.token); col.append(input);
				var input = $('<input>').attr({'class':'form-control input-sm name', 'type':'text', 'placeholder':'Nombre'}).val(viewer.name); col.append(input);
			
			var col = $('<div></div>').attr({'class':'form-group col-md-2'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm surname', 'type':'text', 'placeholder':'Apellidos'}).val(viewer.surname); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-3'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm email', 'type':'text', 'placeholder':'Email'}).val(viewer.email); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm password', 'type':'text', 'placeholder':'Pass'}); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm prefix', 'type':'text', 'placeholder':'Prefix'}).val(viewer.prefix); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-2'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm phone', 'type':'text', 'placeholder':'Phone'}).val(viewer.phone); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-2 botonera'}); row.append(col);
				var save = $('<span></span>').attr({'class':'button save', 'title':'Guardar visor'}).html('<i class="fa fa-floppy-o"></i>'); col.append(save);
				var ninja = $('<span></span>').attr({'class':'button ninja', 'title':'Ninja mode'}).html('<i class="fa fa-bolt"></i>'); col.append(ninja);
				var delet = $('<span></span>').attr({'class':'button delet', 'title':'Eliminar visor'}).html('<i class="fa fa-trash-o"></i>'); col.append(delet);
				
				save.click(function(){ edit_digital_viewer(viewer.id); });
				ninja.click(function(){ tokin(viewer.token); });
				delet.click(function(){ delete_digital_viewer(viewer.id);  });
}

function edit_digital_viewer_operator(id) {
	var form = $('.row.viewer[data-id="'+id+'"]');
	var name = form.find('.form-control.name').val();
	var email = form.find('.form-control.email').val();
	var password = form.find('.form-control.password').val();
	var save_button = form.find('.button.save');
	if (name.length>0){
		if (email.length>0){
			var params = {id:id,name:name,email:email,password:password};
			if (password.length>0) params['password']=password;
			save_button.html('<i class="fa fa-cog fa-spin"></i>');
			$.getJSON(api_url+'operators/edit?callback=?', params, function(data){
				if(data.status=='success'){
					save_button.html('<i class="fa fa-floppy-o"></i>');
					launch_alert('<i class="fa fa-smile-o"></i> Visor guardado','');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});
			
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}

function delete_digital_viewer_operator(id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar la operadora?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'operators/delete?callback=?', {operator_id:id}, function(data){
			if(data.status=='success'){
				digital_operator_list();
				launch_alert('<i class="fa fa-smile-o"></i> Operadora eliminada','');
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});
		
	}
}


function dibujaFormularioVisorDigitalOperator(viewer) {
	if(viewer.radio.id==myradio.id){
	var form=$('<form></form>').attr({'role':'form', 'class':'bateria'}); $('#operators_list').append(form);
		var row = $('<div></div>').attr({'class':'row viewer', 'data-id':viewer.id}); form.append(row);
			
			var col = $('<div></div>').attr({'class':'form-group col-md-3'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control id', 'type':'hidden'}).val(viewer.id); col.append(input);
				var input = $('<input>').attr({'class':'form-control token', 'type':'hidden'}).val(viewer.token); col.append(input);
				var input = $('<input>').attr({'class':'form-control input-sm name', 'type':'text', 'placeholder':'Nombre'}).val(viewer.name); col.append(input);
			
				
			var col = $('<div></div>').attr({'class':'form-group col-md-3'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm email', 'type':'text', 'placeholder':'Email'}).val(viewer.email); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-3'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm password', 'type':'text', 'placeholder':'Pass'}); col.append(input);
				
				
			var col = $('<div></div>').attr({'class':'form-group col-md-2 botonera'}); row.append(col);
				var save = $('<span></span>').attr({'class':'button save', 'title':'Guardar operator'}).html('<i class="fa fa-floppy-o"></i>'); col.append(save);
				var ninja = $('<span></span>').attr({'class':'button ninja', 'title':'Ninja mode'}).html('<i class="fa fa-bolt"></i>'); col.append(ninja);
				var delet = $('<span></span>').attr({'class':'button delet', 'title':'Eliminar visor'}).html('<i class="fa fa-trash-o"></i>'); col.append(delet);
				
				save.click(function(){ edit_digital_viewer_operator(viewer.id); });
				ninja.click(function(){ tokin(viewer.token); });
				delet.click(function(){ delete_digital_viewer_operator(viewer.id);  });
    }
}

function edit_viewer(id) {
	var form = $('.row.viewer[data-id="'+id+'"]');
	var name = form.find('.form-control.name').val();
	var surname = form.find('.form-control.surname').val();
	var email = form.find('.form-control.email').val();
	var password = form.find('.form-control.password').val();
	var prefix = form.find('.form-control.prefix').val();
	var phone = form.find('.form-control.phone').val();
	var save_button = form.find('.button.save');
	if (name.length>0){
		if (email.length>0){
			var params = {viewer_id:id,name:name,surname:surname,email:email,prefix:prefix,phone:phone,password:password};
			if (password.length>0) params['password']=password;
			save_button.html('<i class="fa fa-cog fa-spin"></i>');
			$.getJSON(api_url+'radios/edit_viewer?callback=?', params, function(data){
				if(data.status=='success'){
					save_button.html('<i class="fa fa-floppy-o"></i>');
					launch_alert('<i class="fa fa-smile-o"></i> Visor guardado','');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});
			
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}

function edit_digital_viewer(id) {
	var form = $('.row.viewer[data-id="'+id+'"]');
	var name = form.find('.form-control.name').val();
	var surname = form.find('.form-control.surname').val();
	var email = form.find('.form-control.email').val();
	var password = form.find('.form-control.password').val();
	var prefix = form.find('.form-control.prefix').val();
	var phone = form.find('.form-control.phone').val();
	var save_button = form.find('.button.save');
	if (name.length>0){
		if (email.length>0){
			var params = {viewer_id:id,name:name,surname:surname,email:email,prefix:prefix,phone:phone,password:password};
			if (password.length>0) params['password']=password;
			save_button.html('<i class="fa fa-cog fa-spin"></i>');
			$.getJSON(api_url+'radios/edit_digital_viewer?callback=?', params, function(data){
				if(data.status=='success'){
					save_button.html('<i class="fa fa-floppy-o"></i>');
					launch_alert('<i class="fa fa-smile-o"></i> Visor guardado','');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});
			
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}

function delete_viewer(id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar visor?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'radios/delete_viewer?callback=?', {id:id}, function(data){
			if(data.status=='success'){
				viewers_list();
				launch_alert('<i class="fa fa-smile-o"></i> Visor eliminado','');
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});
		
	}
}

function delete_digital_viewer(id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar visor?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'radios/delete_digital_viewer?callback=?', {id:id}, function(data){
			if(data.status=='success'){
				digital_viewers_list();
				launch_alert('<i class="fa fa-smile-o"></i> Visor eliminado','');
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});
		
	}
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



// STOPS
function startStops() {
	$.post(base_url+'/partials/radio_stops_super', function(template, textStatus, xhr) {
		$('#submain').html(template);
		activeSystemSelect();
		loadStops();
	});
	
}

function activeSystemSelect() {
	if (myradio.stops_system) var clase = 'stops';
	else var clase = 'nostops';
	$('#stops_system_select').removeClass().addClass('row '+clase);
	var items = $('#stops_system_select .item');
	
	items.click(function(){
		if( ($(this).hasClass('near') && myradio.stops_system ) || ($(this).hasClass('stop') && !myradio.stops_system ) ) set_stops_system();
		else console.log('no hago nada');
	});
}

function set_stops_system() {
	$.getJSON(api_url+'radios/set_stops_system?callback=?', {radio_id:myradio.id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Guardado sistema de asignación','');
			actualizaAtStops();
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
	});
}

function loadStops() {
	$.each(myradio.stops_list, function(index, stop) {
		draw_stop_md(stop);
	});
}

function draw_stop_md(stop) {
	// $('#stops_list').append('<div>'+stop.name+'</div>');
	
	var col=$('<div></div>').attr('class','col-md-6'); $('#stops_list').append(col);
	var panel=$('<div></div>').attr({'class':'panel panel-default', 'data-id':stop.id}); col.append(panel);
		var heading=$('<div></div>').attr('class','panel-heading'); panel.append(heading);
			var title=$('<h4></h4>').attr('class','panel-title').text(stop.name); heading.append(title);
			var botonera=$('<div></div>').attr('class','botonera pull-right'); title.append(botonera);
				var delete_button=$('<i></i>').attr('class','fa fa-trash-o'); botonera.append(delete_button);
				delete_button.click(function(){ delete_stop(stop.id); });
				
				var edit_button=$('<i></i>').attr('class','fa fa-pencil'); botonera.append(edit_button);
				edit_button.click(function(){ edit_stop_modal(stop.id); });
			
		var body=$('<div></div>').attr({'class':'panel-body'}); panel.append(body);
			var address=$('<div></div>').attr({'class':'field'}).html('<strong>Dirección:</strong> '+stop.address); body.append(address);
			var coordinates=$('<div></div>').attr({'class':'field'}).html('<strong>Latitud:</strong> '+stop.lat+'&nbsp;&nbsp;<strong>Longitud:</strong> '+stop.lon); body.append(coordinates);
			// var drivers=$('<div></div>').attr({'class':'field drivers'}).html('<strong>Taxistas:</strong><br>'); body.append(drivers);
				// drivers.append('<span class="label label-default">Rafa Paradela</span>');
				// drivers.append('<span class="label label-default">Marcos Gonzalez</span>');

				

	return false

}



function new_stop_modal() {
	var mymodal=newModal('new_stop_modal',true, true);
	modalAddTitle(mymodal,'NUEVA PARADA');
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	$('#new_stop_modal .modal-dialog').css('width','850px');
	$.post(base_url+'/partials/modal_stop_details', function(template, textStatus, xhr) {
		var body = $('<div></div>').attr({'id':'stop_datail_wrapper'});
		body.html(template);
		modalAddBody(mymodal,body);
		
		$('#stop_address').val(myradio.city+', '+myradio.country_code);
		$('#stop_lat').val('40.419445');
		$('#stop_lon').val('-3.69286');
		// centerMap(myradio.city+', '+myradio.country_code);
		$('#stop_address').attr('onkeydown','loadAddressInMap(event)');
		miniModalMapStops();
		
		setTimeout(function(){
			actualizaMapa();
		}, 1000);
		
		var footer = $('<div></div>').attr({'id':'assign_journey_footer'});
		var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
		var save_new_button = $('<button></button>').attr({'type':'button','class':'assign btn btn-default', 'id':'add_new_stop_button'}).text('CREAR NUEVA PARADA'); group.append(save_new_button);
		save_new_button.click(function(){ add_new_stop(this); });
		modalAddFooter(mymodal,footer);
	});
	
	$('#new_stop_modal').on('hidden.bs.modal', function (e) {
		//google.maps.event.clearListeners(map_stops);
		//google.maps.event.clearListeners(window, 'resize');
		$('#mapa_stops').remove();

	})
	
}

function edit_stop_modal(stop_id) {
	var mymodal=newModal('edit_stop_modal',true, true);
	modalAddTitle(mymodal,'EDITAR PARADA');
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	$('#edit_stop_modal .modal-dialog').css('width','850px');
	$.post(base_url+'/partials/modal_stop_details', function(template, textStatus, xhr) {
		var body = $('<div></div>').attr({'id':'stop_datail_wrapper'});
		body.html(template);
		modalAddBody(mymodal,body);
		
		var mystop=_.find(myradio.stops_list, function(r){ return r.id == stop_id; })
		// console.log(mystop.name);
		
		$('#stop_name').val(mystop.name);
		$('#stop_address').val(mystop.address);
		$('#stop_lat').val(mystop.lat);
		$('#stop_lon').val(mystop.lon);
		$('#stop_address').attr('onkeydown','loadAddressInMap(event)');
		miniModalMapStops();
		
		
		
		var footer = $('<div></div>').attr({'id':'assign_journey_footer'});
		var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
		var save_edit_button = $('<button></button>').attr({'type':'button','class':'assign btn btn-default', 'id':'seva_edit_stop_button'}).text('GUARDAR PARADA'); group.append(save_edit_button);
		save_edit_button.click(function(){ save_stop(this,stop_id); });
		modalAddFooter(mymodal,footer);
	});
	
	$('#edit_stop_modal').on('hidden.bs.modal', function (e) {
		$('#mapa_stops').remove();
	})
	
}




function add_new_stop(element) {
	var name = $('#stop_name').val();
	var address = $('#stop_address').val();
	var lat = $('#stop_lat').val();
	var lon = $('#stop_lon').val();
	var radio_id = myradio.id;
	var boton =$(element);
	boton.html('<i class="fa fa-cog fa-spin"></i>');
	
	$.getJSON(api_url+'radios/add_stop?callback=?', {name:name, address:address, radio_id:radio_id, lat:lat, lon:lon}, function(data){
			if(data.status=='success'){
				$('#new_stop_modal').modal('hide');
				launch_alert('<i class="fa fa-smile-o"></i> Parada creada correctamente','');
				actualizaAtStops();
			}
			else{
				launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning'); 
			}
													
	});
	
}

function save_stop(element, stop_id) {
	var name = $('#stop_name').val();
	var address = $('#stop_address').val();
	var lat = $('#stop_lat').val();
	var lon = $('#stop_lon').val();
	var radio_id = myradio.id;
	var boton =$(element);
	boton.html('<i class="fa fa-cog fa-spin"></i>');
	
	$.getJSON(api_url+'radios/edit_stop?callback=?', {stop_id:stop_id, name:name, address:address, radio_id:radio_id, lat:lat, lon:lon}, function(data){
			if(data.status=='success'){
				$('#edit_stop_modal').modal('hide');
				launch_alert('<i class="fa fa-smile-o"></i> Parada guardada correctamente','');
				actualizaAtStops();
			}
			else{
				launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning'); 
			}
													
	});
	
}

function delete_stop(stop_id) {
    if (confirm("¿Seguro que quieres eliminar la parada?")){
        $.getJSON( api_url+'radios/delete_stop?callback=?', {stop_id:stop_id}, function(data){
            if(data.status=='success'){
                launch_alert('<i class="fa fa-smile-o"></i> Parada eliminada','');
                actualizaAtStops();
            }
            else launch_alert('<i class="fa fa-frown-o"></i> Error al eliminar la parada','warning');
        });
    }

}



function actualizaAtStops() {
	$.getJSON(api_url+'radios/get_foreign?callback=?', {id:myradio.id}, function(data){
		if(data.status=='success'){
			myradio=data.data;
			startStops();
		}
	});
}


var map_stops;
var marker;
var onlyone =true;
function MapApiLoaded() {
    console.log('loading Maps API and Places library done');
}

function miniModalMapStops() {
	//if(onlyone)
		$.getScript('https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=showMiniMapStops');
	//else
	//	showMiniMapStops();
	//onlyone=false;
}

function showMiniMapStops() {

	var lat = $('#stop_lat').val();
	var lon = $('#stop_lon').val();
	var pos=new google.maps.LatLng(lat,lon);
	
	
    var myMapOptions = {
      zoom: 16,
      center:pos,
      disableDefaultUI: true,
	  mapTypeControl: false,
	  draggable: true,
	  scaleControl: false,
      zoomControl: true,
	  scrollwheel: false,
	  navigationControl: false,
	  streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
	  styles:[{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":60}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]}]
    };
	map_stops = new google.maps.Map(document.getElementById("mapa_stops"), myMapOptions);
	//google.maps.event.trigger(map_stops,'resize');
	var myMarkerOptions = {
		position:pos,
		map: map_stops,
        draggable: true,
        icon: 'http://f.cl.ly/items/0e3z3S37441J2Q0n0w0S/icono_posicion_usuario.png'
	};

	
    marker = new google.maps.Marker(myMarkerOptions);

    google.maps.event.addListener(marker, 'dragend', function() {
        $('#stop_lat').val( this.position.lat() );
        $('#stop_lon').val( this.position.lng() );
		
		var geocoder=new google.maps.Geocoder();

		geocoder.geocode({ latLng: this.getPosition() }, function(responses) {
	    	if (responses && responses.length > 0) {
	      		$('#stop_address').val(responses[0].formatted_address);
	    	}
	  	});
    });
    
}

function actualizaMapa() {
	
    var geo = new google.maps.Geocoder();
	
    geo.geocode({'address': $('#stop_address').val() }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                var latitud=results[0].geometry.location.lat();
                var longitud=results[0].geometry.location.lng();
				
				$('#stop_lat').val(latitud);
				$('#stop_lon').val(longitud);
				
				moveMark(latitud,longitud);
                
            }
        }
    });
}

function moveMark(latitud,longitud) {
    var pos =  new google.maps.LatLng(latitud,longitud);
    map_stops.panTo(pos);
	marker.setPosition(pos);
}

function drawnMarkup (lat, lng, marker) {
    var pos =  new google.maps.LatLng(lat,lng);
    map.panTo(pos);
	
	if(marker){
	    var marca = new google.maps.Marker({
	              position:  pos,
	              map: map,
	              draggable: true,
	              icon: 'http://f.cl.ly/items/0e3z3S37441J2Q0n0w0S/icono_posicion_usuario.png',
	              animation: google.maps.Animation.DROP
	    });
    
	    google.maps.event.addListener(marca, 'dragend', function() {
			calculateLocation(marca);
	    });
    
	    if (origen!=null) origen.setMap(null);
	    origen=marca; 
	}
}



// PROFILE
function startProfile() {
	$.post(base_url+'/partials/radio_profile_super', function(template, textStatus, xhr) {
		$('#submain').html(template);
		$('#radio_id').val(myradio.id);
		$('#radio_name').val(myradio.name);
		$('#radio_registered_name').val(myradio.registered_name);
		$('#radio_cif').val(myradio.cif);
		$('#radio_prefix').val(myradio.prefix);
		$('#radio_phone').val(myradio.phone);
		$('#radio_email').val(myradio.email);
		$('#radio_address').val(myradio.address);
		$('#radio_city').val(myradio.city);
		$('#radio_num_taxis').val(myradio.num_taxis);
		$('#radio_num_passengers').val(myradio.num_passengers);
		
		if(myradio.digital) $('#radio_digital').attr('checked', true);
		if(myradio.subsidized) $('#subsidized').attr('checked', true);
		
		if(myradio.active) $('#deactivate_radio_button').show();
		else $('#activate_radio_button').show();
		
		if(myradio.digital){
			$('#header_features_list').css('display', 'block');
			$('#features_list').css('display', 'block');
			startFeatures();
		}
	
		
		$('#edit_radio_form').submit(false).submit(function(e){
			save_radio();
			return false;
		});
		load_invoicing();
	});
	
}

function startFeatures() {
	$.post(base_url+'/partials/features_delegation', function(template, textStatus, xhr) {
		$('#features_list').html(template);
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

function toggle_feature(element) {
	var item = $(element);
	var feature_id = item.attr('data-id');
	var i = item.find('i');
	if (i.hasClass('fa-check-square')) var method = 'unassign_to_radio';
	else var method = 'assign_to_radio';
	
	i.removeClass().addClass('fa fa-fw fa-cog fa-spin');
	
	$.getJSON(api_url+'features/'+method+'?callback=?', {radio_id:myradio.id, feature_id:feature_id}, function(data){
		if(data.status=="success"){
			if(method=="unassign_to_radio"){
				i.removeClass('fa fa-fw fa-cog fa-spin');
				i.addClass('fa fa-fw fa-square');
			}
			if(method=="assign_to_radio"){
				i.removeClass('fa fa-fw fa-cog fa-spin');
				i.addClass('fa fa-fw fa-check-square');
			}
		}
	});
}

function draw_feature_car(feature_car) {
	$('#features_list').append('<div class="col-sm-4"> <div class="item" data-id="'+feature_car.id+'" onclick="toggle_feature(this);"><i class="fa fa-fw fa-square"></i> '+feature_car.description+'</div></div>');
}

function active_features_delegarion() {
	$.each(myradio.features, function(index, feature) {
		var i = $('#features_list .item[data-id="'+feature.id+'"] i');
		i.removeClass().addClass('fa fa-fw fa-check-square');
	});
}


function save_radio() {
	var id=$('#radio_id').val();
	var name=$('#radio_name').val();
	var registered_name=$('#radio_registered_name').val();
	var cif=$('#radio_cif').val();
	var prefix=$('#radio_prefix').val();
	var phone=$('#radio_phone').val();
	var email=$('#radio_email').val();
	var address=$('#radio_address').val();
	var city=$('#radio_city').val();
	var num_taxis=$('#radio_num_taxis').val();
	var num_passengers=$('#radio_num_passengers').val();
	
	if($('#radio_digital').prop('checked')) var digital=1;
	else var digital=0;
	if($('#subsidized').prop('checked')) var subsidized=1;
	else var subsidized=0;

	
	if (name.length>0){
		if(registered_name.length>0){
			
			$('#edit_radio_submit').html('<i class="fa fa-cog fa-spin"></i>');
		
			$.getJSON(api_url+'radios/edit?callback=?', {	id:id,
															name:name, 
															registered_name:registered_name,
															cif:cif,
															prefix:prefix,
															phone:phone,
															email:email,
															address:address,
															city:city,
															num_taxis:num_taxis,
															num_passengers:num_passengers,
															digital:digital,
															subsidized:subsidized}, function(data){
																
				if(data.status=='success'){
					launch_alert('<i class="fa fa-smile-o"></i> Radios guardada','');
					$('#edit_radio_submit').html('Guardar');
					$.getJSON(api_url+'radios/get_foreign?callback=?', {id:id}, function(data){
						if(data.status=='success'){
							myradio=data.data;
							$('#radio_title').html(myradio.name);
						}
					});
					
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir la razón social','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un nombre','warning');
}

function deactivate_radio() {
	$('#deactivate_radio_button').html('<i class="fa fa-cog fa-spin"></i>');
	$.getJSON(api_url+'radios/deactivate?callback=?', {radio_id:myradio.id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Radio desactivada','');
			cargaRadio();
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
	});
}

function deactivate_radio_2(obj) {
	$(obj).removeClass('active');
	$(obj).attr('onclick','activate_radio_2(this);');
	$(obj).addClass('inactive');
	$.getJSON(api_url+'radios/deactivate?callback=?', {radio_id:myradio.id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Radio desactivada','');
			cargaRadio();
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
	});
}

function activate_radio_2(obj) {
	$(obj).removeClass('inactive');
	$(obj).attr('onclick','deactivate_radio_2(this);');
	$(obj).addClass('active');
	$.getJSON(api_url+'radios/activate?callback=?', {radio_id:myradio.id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Radio activada','');
			cargaRadio();
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
	});
}

function activate_radio() {
	$('#activate_radio_button').html('<i class="fa fa-cog fa-spin"></i>');
	$.getJSON(api_url+'radios/activate?callback=?', {radio_id:myradio.id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Radio activada','');
			cargaRadio();
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
	});
}

function delete_radio() {
	var confirmacion=confirm('¿Seguro que quieres eliminar la radio?');
	if (confirmacion==true)
	{
		$('#delete_radio_button').html('<i class="fa fa-cog fa-spin"></i>');
		$.getJSON(api_url+'radios/delete_foreign?callback=?', {radio_id:myradio.id}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Radio eliminada','');
				setTimeout(function(){
					goto(base_url+'/radios');
				},2000);
				
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});
		
	}
}

function load_invoicing(){
	if(!myradio.digital){
		$('#invoicing_radio').html('FACTURACIÓN');
		var panel=$('<div></div>').attr({'id':'general_panel_invoicing','class':'panel panel-default', 'style':'margin-bottom:0px; margin-top:20px; border:1px solid #CCCCCC;'}); 
		$('#invoicing_radio').append(panel);
		$('#autoinvoicing_radio').html('AUTOFACTURACIÓN');
		var panelB=$('<div></div>').attr({'id':'general_panel_autoinvoicing','class':'panel panel-default', 'style':'margin-bottom:0px; margin-top:20px; border:1px solid #CCCCCC;'}); 
		$('#autoinvoicing_radio').append(panelB);
		$.getJSON(api_url+'invoices/list_by_radio?callback=?&radio_id='+myradio.id, '', function(data3){
			if(data3.status=='success'){
				for(var i=0; i<data3.data.invoices.length; i++){
					var heading=$('<div></div>').attr({'class':'panel-heading panel-heading-invoice invoice-padding', 'style':'background-color:#FFFFFF'}); 
					$('#general_panel_invoicing').append(heading);
					var div_h4=$('<div></div>').attr('class','responsive-title margin_yes col-md-9');
					var title=$('<h4></h4>').attr('class','panel-title'); 
					div_h4.append(title);
					heading.append(div_h4);
					var toggle=$('<span></span>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#invoicing_radio'}).text(meses[data3.data.invoices[i].month-1]+' '+data3.data.invoices[i].year+' - '+data3.data.invoices[i].num_invoice_complete+' - '+data3.data.invoices[i].amount+' '+data3.data.invoices[i].currency_delgation); 
					title.append(toggle);
					var button_div=$('<div></div>').attr({'class':'responsive-button col-md-2'})
					var location = "location.href=\""+data3.data.invoices[i].url_pdf+"\"";
					var button=$('<button></button>').attr({'onclick':location, 'type':'button', 'id':'edit_delegation_submit', 'class':'responsive-btn btn btn-default'}).text('Descargar en PDF');
					button_div.append(button);
					heading.append(button_div);
				}
				for(var i=0; i<data3.data.autoinvoices.length; i++){
					var heading=$('<div></div>').attr({'class':'panel-heading panel-heading-invoice invoice-padding', 'style':'background-color:#FFFFFF'}); 
					$('#general_panel_autoinvoicing').append(heading);
					var div_h4=$('<div></div>').attr('class','responsive-title margin_yes col-md-9');
					var title=$('<h4></h4>').attr('class','panel-title'); 
					div_h4.append(title);
					heading.append(div_h4);
					var toggle=$('<span></span>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#autoinvoicing_radio'}).text(meses[data3.data.autoinvoices[i].month-1]+' '+data3.data.autoinvoices[i].year+' - '+data3.data.autoinvoices[i].num_invoice_complete+' - '+data3.data.autoinvoices[i].amount+' '+data3.data.autoinvoices[i].currency_delgation); 
					title.append(toggle);
					var button_div=$('<div></div>').attr({'class':'responsive-button col-md-2'})
					var location = "location.href=\""+data3.data.autoinvoices[i].url_pdf+"\"";
					var button=$('<button></button>').attr({'onclick':location, 'type':'button', 'id':'edit_delegation_submit', 'class':'responsive-btn btn btn-default'}).text('Descargar en PDF');
					button_div.append(button);
					heading.append(button_div);
				}
			}else super_error('Data failure');
			if(data3.data.invoices.length==0){
				var heading=$('<div></div>').attr({'class':'panel-heading panel-heading-invoice', 'style':'background-color:#FFFFFF'});
				$('#general_panel_invoicing').append(heading);
				var title=$('<h4></h4>').attr('class','panel-title'); 
				heading.append(title);
				var toggle=$('<span></span>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#invoicing_radio'}).text('No existen facturas'); 
				title.append(toggle);
				$('#invoicing_radio').hide();
			}
			if(data3.data.autoinvoices.length==0){
				var heading=$('<div></div>').attr({'class':'panel-heading panel-heading-invoice', 'style':'background-color:#FFFFFF'});
				$('#general_panel_autoinvoicing').append(heading);
				var title=$('<h4></h4>').attr('class','panel-title'); 
				heading.append(title);
				var toggle=$('<span></span>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#autoinvoicing_radio'}).text('No existen autofacturas'); 
				title.append(toggle);
				$('#autoinvoicing_radio').hide();
			}
		});
	}else{
		$('#invoicing_radio').hide();
		$('#autoinvoicing_radio').hide();
	}
}

function show_radio_map() {
    pulsador = window.open(base_url+'/radiomap/'+myradio.id, "RadioMap", "location=0,status=0,scrollbars=0,width=1024,height=680");
}


