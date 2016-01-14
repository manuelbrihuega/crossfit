function get_content() {
	
	$('#sidebar .nav-sidebar').hide();
	
    $.when(
		$.getScript(media_url+'js/aux/date.js'),
		$.getScript(media_url+'js/aux/modals.js'),
		$.getScript(media_url+'js/aux/journeys.js'),
		$.getScript(media_url+'js/lib/jssip_new.js'),
		$.getScript('https://maps.googleapis.com/maps/api/js?v=3.exp'),
		// $.getScript('http://jssip.net/download/jssip-devel.js'),
		$.getScript(media_url+'js/aux/sip.js'),
	    // $.getScript('http://tryit.jssip.net/js/jquery-1.6.1.min.js'),
	    // $.getScript('http://127.0.0.1:8000/static/js/lib/jssip_new.js'),
	    $.getScript('http://tryit.jssip.net/js/jquery.balloon.min.js'),
	    $.getScript('http://tryit.jssip.net/js/parseuri.js'),
	    $.getScript('http://private.versatica.com/piwik/piwik.js'),
	    // $.getScript('http://tryit.jssip.net/js/init.js'),
	    // $.getScript('http://tryit.jssip.net/js/gui.js'),
		$.getScript('https://cdn.firebase.com/js/client/1.0.11/firebase.js'),
		$.getScript('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js'),
		$.getScript(media_url+'js/aux/sound.js'),
		$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', media_url+'css/partials/call.css') ),
        $.ready.promise()
    ).then(function(){
    	
        loadMapTemplate();
    });
    //setInterval(drawNumbersFlota, 10000);
    drawNumbersFlota();
    avisador = setInterval(alerts_watcher, 4000);
    $('#passenger_save_button').fadeIn();
}

function loadMapTemplate() {
	$.post('partials/dashboard_operator', function(template, textStatus, xhr) {
	 	$('#main').html(template);
		loadMap();
		loadSidebarTemplate();
		$('#menu').prepend('<li style="margin-left:0px;"><input id="buscarLicenciaInput" placeholder="Número de licencia"/><button id="buscarLicenciaButton" onclick="activaButtonBuscador();">Buscar licencia</button></li>');
		$('#menu').prepend('<li style="margin-left:0px; font-size:13px;" id="leyenda"></li>');
		$('#push').hide();
		$('#user_name').css('margin','0px');
		$('#ninja_super').css('margin','0px');
		$('#user_name').css('margin','0px');
		$('#menu > li').css('margin-left', '0px');
		//$('#user_name').prepend('<i id="sip_status" class="fa fa-refresh fa-spin"></i> ');

		

    	//$.getScript("http://maps.google.com/maps/api/js?key=mykey&libraries=places&sensor=false&callback=PlacesApiLoaded");
	});
}

function PlacesApiLoaded() {
	var input = document.getElementById('destino');
	var inputdos = document.getElementById('origen');
    var options = {
    };
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    var autocompletedos = new google.maps.places.Autocomplete(inputdos, options);
}

function loadSidebarTemplate() {
	$.post('partials/dashboard_sidebar_operator', function(template, textStatus, xhr) {
	 	$('#sidebar').html(template);
		loadOperatorData()
		loadDatePicker();
		loadRadios();
		activaInputBuscador();
		activaInputOrigen();
		activaInputEmail();
		activaInputTelefono();
		activaInputLicencia();
		activaQuienPide();
	});
}

function loadOperatorData() {
	$.getJSON(api_url+'operators/get?callback=?', function(data){
		if(data.status=='success'){
			//loadSip(data.data.operator_profile.extension, data.data.operator_profile.password);
		}
		else{
			launch_alert('<i class="fa fa-frown-o"></i> Pareces no estar logado correctamente.', 'warning');
			setTimeout(function(){
				goto(base_url+'/login');
			},2000);
		}
	});
}

function loadSip(extension,password) {
	var ws_uri='ws://cloudpbx10578.vozelia.com:8088/ws';
	var sip_uri='sip:'+extension+'@cloudpbx10578.vozelia.com';
	var sip_pass=password;
	var configuration = {'ws_servers': ws_uri, 'uri': sip_uri, 'password': sip_pass};
	console.log(configuration);
	startsip(configuration);
	

}

function save_passenger_detail() {
	var email=$('#email').val();
	var telefono=$('#telefono').val();
	
	if(email.length>4){
		$.getJSON(api_url+'auth/search_by_email?callback=?', {email:email} ,function(data){
			if(data.status=='success'){
				user = data.data;
				if(user.auth_profile.role=='U_Passengers'){
					if(user.os==''){
						user.os='call';
					}
					$.getJSON(api_url+'passengers/edit_foreign?callback=?', {id:user.profile.id, name:$('#nombre').val(), surname:$('#apellidos').val(), phone:$('#telefono').val(), email:$('#email').val(), indications:$('#observacionescliente').val(), os:user.os, prefix:'34'}, function(data){
						if(data.status=='success'){
							launch_alert('<i class="fa fa-smile-o"></i> Pasajero editado','');
						}
					});
				}else{
					launch_alert('<i class="fa fa-frown-o"></i> No tienes permiso para editar este tipo de usuarios','warning'); 
				}	
			}else{
				if(data.status=='failed'){
					if(telefono.length>3){
						$.getJSON(api_url+'auth/search_by_phone?callback=?', {phone:telefono} ,function(data){
							if(data.status=='success'){
								user = data.data;
								if(user.auth_profile.role=='U_Passengers'){
									if(user.os==''){
										user.os='call';
									}
									$.getJSON(api_url+'passengers/edit_foreign?callback=?', {id:user.profile.id, name:$('#nombre').val(), surname:$('#apellidos').val(), email:$('#email').val(), phone:$('#telefono').val(), indications:$('#observacionescliente').val(), os:user.os, prefix:'34'}, function(data){
										if(data.status=='success'){
											launch_alert('<i class="fa fa-smile-o"></i> Pasajero editado','');
										}
									});
								}else{
									launch_alert('<i class="fa fa-frown-o"></i> No tienes permiso para editar este tipo de usuarios','warning');
								}	
							}else{
								if(data.status=='failed'){
									var params = { phone : $('#telefono').val(), prefix : radio.prefix };
									if( $('#nombre').val().length>0 ) params['name']=$('#nombre').val();
									if( $('#apellidos').val().length>0 ) params['surname']=$('#apellidos').val();
									if( $('#email').val().length>0 ) params['email']=$('#email').val();
									if( $('#observacionescliente').val().length>0 ) params['indications']=$('#observacionescliente').val();
									$.getJSON(api_url+'passengers/add_from_call?callback=?', params, function(data){
										if(data.status=='success'){
											launch_alert('<i class="fa fa-smile-o"></i> Pasajero creado','');
										}
									});
								}
							}
						});
					}else{
						launch_alert('<i class="fa fa-frown-o"></i> El campo teléfono es obligatorio','warning');
					}
				}
			}
		});
	}else{
		if(telefono.length>3){
			$.getJSON(api_url+'auth/search_by_phone?callback=?', {phone:telefono} ,function(data){
				if(data.status=='success'){
					user = data.data;
					if(user.auth_profile.role=='U_Passengers'){
						if(user.os==''){
							user.os='call';
						}
						$.getJSON(api_url+'passengers/edit_foreign?callback=?', {id:user.profile.id, name:$('#nombre').val(), surname:$('#apellidos').val(), email:$('#email').val(), phone:$('#telefono').val(), indications:$('#observacionescliente').val(), os:user.os, prefix:'34'}, function(data){
							if(data.status=='success'){
								launch_alert('<i class="fa fa-smile-o"></i> Pasajero editado','');
							}
						});
					}else{
						launch_alert('<i class="fa fa-frown-o"></i> No tienes permiso para editar este tipo de usuarios','warning');
					}	
				}else{
					var params = { phone : $('#telefono').val(), prefix : radio.prefix };
					if( $('#nombre').val().length>0 ) params['name']=$('#nombre').val();
					if( $('#apellidos').val().length>0 ) params['surname']=$('#apellidos').val();
					params['email']=$('#telefono').val()+'@taxible.call';
					if( $('#observacionescliente').val().length>0 ) params['indications']=$('#observacionescliente').val();
					$.getJSON(api_url+'passengers/add_from_call?callback=?', params, function(data){
						if(data.status=='success'){
							launch_alert('<i class="fa fa-smile-o"></i> Pasajero creado','');
						}
					});
				}
			});
		}else{
			launch_alert('<i class="fa fa-frown-o"></i> Los campos email y teléfono son obligatorios','warning');
		}
	}
}

function loadDatePicker() {
	$.getScript('http://code.jquery.com/ui/1.9.1/jquery-ui.min.js').done(function () {
	   
		$.getScript(media_url+'js/lib/jquery.ui.timepicker.js').done(function () {
	   
	   		$.getScript(media_url+'js/lib/jquery.ui.datepicker.es.js').done(function () {
			
				$('<link/>').attr({'rel': "stylesheet", 'type': "text/css", 'href': media_url+"css/lib/jquery-ui-1.10.3.css"}).appendTo('head');
				$('<link/>').attr({'rel': "stylesheet", 'type': "text/css", 'href': media_url+"css/lib/datetimepicker.css"}).appendTo('head');
				$('<link/>').attr({'rel': "stylesheet", 'type': "text/css", 'href': media_url+"css/partials/datetimepicker.css"}).appendTo('head');
				
			    var ahora=new Date();
			    $('#datepicker_input').val(ahora.getFullYear()+'-'+(parseInt(ahora.getMonth())+1)+'-'+ahora.getDate());
    
	            $('#datepicker_wrapper').datepicker({ minDate: new Date(), maxDate: "+14D", altField: "#datepicker_input", altFormat: "yy-mm-dd"});
	            $('#timepicker_wrapper').timepicker({altField: "#timepicker_input", hour: ahora.getHours(), minute: ahora.getMinutes(), hourMin: 0, hourMax: 23, stepMinute: 5});
				
								
			
	   		},true);
	   
		},true);
		
	},true);
	
}

// OPERATOR DATA // FORMULARIOS

var radios = false;
var radio = false;
var radioUnica = false;
var drivers = false;
var user = false;
var alerts_pending = new Array();
var alerts_reservation = new Array();

function parpadeoAlerta(){
	if($('#spanAlert').css('color')=='rgb(255, 99, 71)'){
		$('#spanAlert').css('color', '#666');	
	}else{
		$('#spanAlert').css('color', 'tomato');
	}
}

function alerts_watcher(){
	$.getJSON(api_url+'radios/list_pending?callback=?', {offset:local_offset, radio_id:radio.radio_id}, function(data){
		if(data.status=='success'){
			if(data.data.journeys.length>0){
				for(var i=0;i<data.data.journeys.length;i++){
					if(data.data.journeys[i].status=='pending'){
			        	var journey_id = data.data.journeys[i].id;
			        	var existe = false;
			            for(var x=0; x<alerts_pending.length; x++){
			            	if(journey_id==alerts_pending[x].id){
			            		existe = true;
			            		alerts_pending[x].time = alerts_pending[x].time + 4;
			            		if(alerts_pending[x].time>=60){
			            			//Pinto la alerta y la pongo a 0 en alerts_pending
			            			var idbsc = '#alerta'+journey_id;
			            			if(!$(idbsc).length){
				            			if($('#alertasContainer').length){
				            				$('#alertasInternal').append('<div class="journeypending" id="alerta'+journey_id+'" style="border-top: 1px solid; padding-top: 4px; padding-bottom:4px;"><span style="cursor:pointer;" onclick="verCarrera('+journey_id+');">CARRERA PENDIENTE</span></div>');
				            				if ($('#alertasContainer').is(':hidden')){
				            					$('#alertasContainer').slideDown();
				            				} 
				            			}else{
				            				$('#main').append('<div id="alertasContainer"><div style="margin-bottom: 4px;"><span id="spanAlert" style="font-weight:700;"><i class="fa fa-exclamation-triangle"></i> ALERTAS <i class="fa fa-exclamation-triangle"></i></span></div><div id="alertasInternal"><div class="journeypending" id="alerta'+journey_id+'" style="border-top: 1px solid; padding-top: 4px; padding-bottom:4px;"><span style="cursor:pointer;" onclick="verCarrera('+journey_id+');">CARRERA PENDIENTE</span></div></div></div>');
				            				$('#alertasContainer').slideDown();
				            				parpadeo = setInterval(parpadeoAlerta, 500);
				            			}
			            			}
			            			play_sound('incoming_journey.mp3');
			            			alerts_pending[x].time=0;
			            		}
			            	}
			            }
			            if(!existe){
			            	alerts_pending.push({"id": journey_id,"time": 0});
			            }
		        	}
		        }
		        for(var r=0; r<alerts_pending.length; r++){
		        	var existedinamic = false;
		        	for(var p=0;p<data.data.journeys.length;p++){
		        		if(data.data.journeys[p].status=='pending'){
		        			if(alerts_pending[r].id==data.data.journeys[p].id){
		        				existedinamic = true;
		        			}
		        		}
		        	}
		        	if(!existedinamic){
		        		$('#alerta'+alerts_pending[r].id).remove();
		        		alerts_pending.splice(r, 1);
		        	}
		        }
		        if(alerts_pending.length==0 && alerts_reservation.length==0){
		        	$('#alertasContainer').slideUp();
		        }
			}
		}
	});
	$.getJSON(api_url+'radios/list_reservations?callback=?', {offset:local_offset, radio_id:radio.radio_id}, function(data){
		if(data.status=='success'){
			if(data.data.journeys.length>0){
				for(var i=0;i<data.data.journeys.length;i++){
					if(data.data.journeys[i].status=='reserved'){
			        	var journey_id = data.data.journeys[i].id;
			        	var existe = false;
			            for(var x=0; x<alerts_reservation.length; x++){
			            	if(journey_id==alerts_reservation[x].id){
			            		existe = true;
			            		alerts_reservation[x].time = alerts_reservation[x].time + 4;
			            		if(alerts_reservation[x].time>=60){
			            			//Pinto la alerta y la pongo a 0 en alerts_pending
			            			var idbsc = '#alerta'+journey_id;
			            			if(!$(idbsc).length){
				            			if($('#alertasContainer').length){
				            				$('#alertasInternal').append('<div class="journeyreserved" id="alerta'+journey_id+'" style="border-top: 1px solid; padding-top: 4px; padding-bottom:4px;"><span style="cursor:pointer;" onclick="verCarrera('+journey_id+');">RESERVA PENDIENTE DE ASIGNACIÓN</span></div>');
				            				if ($('#alertasContainer').is(':hidden')){
				            					$('#alertasContainer').slideDown();
				            				} 
				            			}else{
				            				$('#main').append('<div id="alertasContainer"><div style="margin-bottom: 4px;"><span id="spanAlert" style="font-weight:700;"><i class="fa fa-exclamation-triangle"></i> ALERTAS <i class="fa fa-exclamation-triangle"></i></span></div><div id="alertasInternal"><div class="journeyreserved" id="alerta'+journey_id+'" style="border-top: 1px solid; padding-top: 4px; padding-bottom:4px;"><span style="cursor:pointer;" onclick="verCarrera('+journey_id+');">RESERVA PENDIENTE DE ASIGNACIÓN</span></div></div></div>');
				            				$('#alertasContainer').slideDown();
				            				parpadeo = setInterval(parpadeoAlerta, 500);
				            			}
			            			}
			            			play_sound('incoming_journey.mp3');
			            			alerts_reservation[x].time=0;
			            		}
			            	}
			            }
			            if(!existe){
			            	alerts_reservation.push({"id": journey_id,"time": 0});
			            }
		        	}
		        }
		        for(var r=0; r<alerts_reservation.length; r++){
		        	var existedinamic = false;
		        	for(var p=0;p<data.data.journeys.length;p++){
		        		if(data.data.journeys[p].status=='reserved'){
		        			if(alerts_reservation[r].id==data.data.journeys[p].id){
		        				existedinamic = true;
		        			}
		        		}
		        	}
		        	if(!existedinamic){
		        		$('#alerta'+alerts_reservation[r].id).remove();
		        		alerts_reservation.splice(r, 1);
		        	}
		        }
		        if(alerts_pending.length==0 && alerts_reservation.length==0){
		        	$('#alertasContainer').slideUp();
		        }
			}
		}
	});
}

function verCarrera(journey_id){
	for(var i=0; i<alerts_pending.length; i++){
		if(alerts_pending[i].id==journey_id){
			if($('#alerta'+alerts_pending[i].id).length){
				$('#alerta'+alerts_pending[i].id).remove();
			}
			alerts_pending.splice(i,1);
			if(alerts_pending.length==0 && alerts_reservation.length==0){
				$('#alertasContainer').slideUp();	
			}else{
				if($('#alertasInternal').is(':empty')){
					$('#alertasContainer').slideUp();	
				}
			}
		}
	}
	for(var i=0; i<alerts_reservation.length; i++){
		if(alerts_reservation[i].id==journey_id){
			if($('#alerta'+alerts_reservation[i].id).length){
				$('#alerta'+alerts_reservation[i].id).remove();
			}
			alerts_reservation.splice(i,1);
			if(alerts_pending.length==0 && alerts_reservation.length==0){
				$('#alertasContainer').slideUp();	
			}else{
				if($('#alertasInternal').is(':empty')){
					$('#alertasContainer').slideUp();	
				}
			}
		}
	}
	var url = base_url+'/seguimiento?journey='+journey_id;
	var win = window.open(url, '_blank');
  	win.focus();
}

function loadRadios() {
	$.getJSON(api_url+'operators/radios?callback=?', function(data){
		if(data.status=='success'){
			radios = data.data.radios;
			refillOptionsRadios();
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
	});
}

function refillOptionsRadios() {
	
	$.each(radios, function(index, radio) {
		radioUnica = radio;
		selectRadio();
	});
	
	
	
}


function llamada_entrante(caller_id) {
	if(caller_id.indexOf(':')>-1){
		var numbers = caller_id.split(':');
		called_id = numbers[0];
		caller_id = numbers[1];
	}
	else{
		called_id = '910609842';
	}
	
	console.log(called_id);
	
	selectOptionRadio(called_id);
	setTimeout(function(){
		$('#telefono').val(caller_id);
		searchByPhone(false);
	},1000);
	
	
}

function selectOptionRadio(phone) {
	$('#radio option[data-phone="'+phone+'"]').prop('selected', true);
	selectRadio();
}

function selectRadio() {
	var id = radioUnica.radio_id;
	radio = _.find(radios, function(r){ return r.radio_id == id; });
	if(radio){
		drivers = radio.drivers;
		drawFeatures();
		selectLocation(radio.city);
		delete_all_markers();
		viewFlota();
		//viewStops();
		drawNumbersFlota();
		drawButtons();
	}
	
}

function viewTotalFlota(){
	modal_total_flota(radio.radio_id);
}

function viewDisponibleFlota(){
	modal_disponible_flota();
}

function viewNoDisponibleFlota(){
	modal_no_disponible_flota(radio.radio_id);
}

function desactivarVistaTaxistas(){
	$('#taxistas').removeClass('activeButtonMap');
	$('#taxistas').attr('onclick','activarVistaTaxistas();');
	for(var i=0; i<fisicmarkers.length; i++){
		if(fisicmarkers[i].tipo === 'drivermarker'){
			fisicmarkers[i].setVisible(false);
		}
	}
}

function desactivarVistaParadas(){
	$('#paradas').removeClass('activeButtonMapStop');
	$('#paradas').attr('onclick','activarVistaParadas();');
	for(var i=0; i<fisicmarkers.length; i++){
		if(fisicmarkers[i].tipo === 'stopmarker'){
			fisicmarkers[i].setVisible(false);
		}
	}
}

function activarVistaTaxistas(){
	$('#taxistas').addClass('activeButtonMap');
	$('#taxistas').attr('onclick','desactivarVistaTaxistas();');
	for(var i=0; i<fisicmarkers.length; i++){
		if(fisicmarkers[i].tipo === 'drivermarker'){
			fisicmarkers[i].setVisible(true);
		}
	}
}

function activarVistaParadas(){
	$('#paradas').addClass('activeButtonMapStop');
	$('#paradas').attr('onclick','desactivarVistaParadas();');
	for(var i=0; i<fisicmarkers.length; i++){
		if(fisicmarkers[i].tipo === 'stopmarker'){
			fisicmarkers[i].setVisible(true);
		}
	}
}

function drawButtons(){
	$('#buttons').html('<div id="taxistas" class="activeButtonMap" style="float:left; margin-right:8px; width: 34px; height: 34px; text-align: center; border: 1px solid #999; border-radius: 7px; cursor: pointer; font-weight: bold; background-color: gainsboro;" onclick="desactivarVistaTaxistas();">T</div><div id="paradas" class="activeButtonMapStop" style="float:left; width: 34px; height: 34px; text-align: center; border: 1px solid #999; border-radius: 7px; cursor: pointer; font-weight: bold; background-color: gainsboro;" onclick="desactivarVistaParadas();">P</div>');
	$('#incidenciastip').html('<div onclick="irAIncidencias();" style="color:black; float:right; font-size:23px; cursor:pointer;"><i class="fa fa-question-circle"></i></div>');
	$('#comunicacionestip').html('<div onclick="irAComunicaciones();" style="color:black; float:right; font-size:23px; cursor:pointer;"><i class="fa fa-newspaper-o"></i></div>');
	$('#buttons').attr('style', 'position:absolute; top: 68px;right:9px;font-size:23px;color:white;');
}

function searchLicencia(lic){
	var firebase_url = 'https://'+radio.fb_ref+'.firebaseio.com';
	var firebase_ref= new Firebase(firebase_url);
	var drivers_ref= firebase_ref.child('drivers');
	var busqueda = false;
	drivers_ref.once('value', function(snapshot) {
		var firebase_drivers_aux = snapshot.val();
		$.each(firebase_drivers_aux, function(index, firebase_driver) {
			if(firebase_driver.coordinates!=undefined && firebase_driver.driver_id!=undefined){
				var db_driver = select_driver(firebase_driver.driver_id);
				if(lic==db_driver.num_licence){
					var coordinates = firebase_driver.coordinates.split('#');
					busqueda=true;
					var darwin = new google.maps.LatLng(coordinates[0], coordinates[1]);
	  				map.setCenter(darwin);
				}
			}
		});
		if(!busqueda){
			launch_alert('<i class="fa fa-frown-o"></i> Taxista no disponible','warning');
		}
	});
}

function drawNumbersFlota(){
	$('#leyenda').html('');
	//$('#leyenda').attr('style', 'position:absolute; bottom: 4%;right:0;font-size:23px;');
	$.getJSON(api_url+'drivers/list_by_radio?callback=?', {radio_id:radio.radio_id}, function(data){
		if(data.status=='success'){
			$('#leyenda').html('');
			var numtotal = data.data.list_drivers.length;
			
			var firebase_url = 'https://'+radio.fb_ref+'.firebaseio.com';
			var firebase_ref= new Firebase(firebase_url);
			var drivers_ref= firebase_ref.child('drivers');
			var numdisp = 0;
			drivers_ref.on('value', function(snapshot) {
				if(snapshot.val() === null) {
					numdisp = 0;
				} else {
					var firebase_drivers = snapshot.val();
					numdisp = 0;
					$.each(firebase_drivers, function(index, firebase_driver) {
						if(firebase_driver.driver_id!=null){
							numdisp = numdisp + 1;
						}
					});
				}
				$('#leyenda').html('');
				$('#leyenda').append('<span onclick="irASeguimiento();" style="border-left: 1px solid; border-right: 1px solid; cursor: pointer; padding-left: 9px; padding-right: 9px;">SEGUIMIENTO</span>');
				$('#leyenda').append('<span onclick="viewTotalFlota();" style="border-right: 1px solid; cursor: pointer; padding-left: 9px; padding-right: 9px;">Flota total: '+numtotal+'</span>');
				$('#leyenda').append('<span onclick="viewDisponibleFlota();" style="border-right: 1px solid; cursor: pointer; padding-left: 9px; padding-right: 9px;">Disponibles: '+numdisp+'</span>');
				$('#leyenda').append('<span onclick="viewNoDisponibleFlota();" style="border-right: 1px solid; cursor: pointer; padding-left: 9px; padding-right: 9px;">No disponibles: '+( parseInt(numtotal) -  parseInt(numdisp) )+'</span>');
    		});	
		}else{
			$('#leyenda').html('');
			var numtotal = 0;
			var numdisp = 0;
			$('#leyenda').append('<span onclick="viewTotalFlota();" style="cursor:pointer; margin-right:28px;">Flota total: '+numtotal+'</span>');
			$('#leyenda').append('<span style="cursor:pointer; margin-right:28px;">Disponibles: '+numdisp+'</span>');
			$('#leyenda').append('<span style="cursor:pointer; margin-right:28px;">No disponibles: '+( parseInt(numtotal) -  parseInt(numdisp) )+'</span>');
		}
	});
}

function irASeguimiento(){
	var url = base_url+'/seguimiento';
	var win = window.open(url, '_blank');
  	win.focus();
}

function irAIncidencias(){
	var url = base_url+'/incidencias';
	var win = window.open(url, '_blank', 300, 400);
  	win.focus();
  	$('#salir').css('display','none');
  	//modal_incidencias();
}

function irAComunicaciones(){
	var url = base_url+'/news';
	var win = window.open(url, '_blank', 300, 400);
  	win.focus();
  	//modal_incidencias();
}

function irANews(){
	var url = base_url+'/incidencias';
	var win = window.open(url, '_blank');
  	win.focus();
  	//modal_incidencias();
}

function canvas_marker_stop(id){
	var ocupacion = "0";
	for(var t=0; t<ocupacion_paradas.length; t++){
		if(ocupacion_paradas[t].id_stop==id){
			ocupacion = ocupacion_paradas[t].ocupacion.toString();
		}
	}
	canvas = document.createElement("canvas");
    canvas.width = 42;
    canvas.height = 42;
    color="rgba(211,98,97,0.8)";
    ctx = canvas.getContext("2d");
  	image1 = new Image();
	image1.src = base_url+'/static/img/button/stop.png';
	image1.height = 37;
	image1.width = 32;
  	ctx.drawImage(image1, 2, 5);
    ctx.fillStyle = color;
    if(ocupacion.length>1){
    	ctx.fillRect(0,0, 19, 15);
    }else{
    	ctx.fillRect(0,0, 12, 15);
    }
    
    ctx.lineWidth = 9;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    //ctx.beginPath();
    //ctx.moveTo(55, 20);
    //ctx.lineTo(60,26);
    //ctx.lineTo(65,20);
    //ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFF';
    ctx.font = "bold 12px Courier";
    ctx.fillText(ocupacion,2,12,110);
    ctx.fillStyle = "rgba(255,255,0,2)";
    return canvas;
}


function viewStops() {
	
	$.getJSON(api_url+'radios/get_foreign?callback=?', {id:radio.radio_id}, function(data){
		if(data.status=='success'){
			for(var x=0; x<fisicmarkers.length; x++){
				if(fisicmarkers[x].tipo === 'stopmarker'){
					fisicmarkers[x].setVisible(false);
					fisicmarkers.splice(x,1);
					x--;
				}
			}
			for(var i=0; i<data.data.stops_list.length; i++){
				if(data.data.stops_list[i].lon!=undefined && data.data.stops_list[i].lat!=undefined && data.data.stops_list[i].id!=undefined){
					var marker;
					canvas= canvas_marker_stop(data.data.stops_list[i].id);
	    			marker=new google.maps.Marker({
	        			position: new google.maps.LatLng(data.data.stops_list[i].lat,data.data.stops_list[i].lon),
	        			map: map,
	        			draggable: false,
	        			icon: canvas.toDataURL(),
	        			title: data.data.stops_list[i].name,
	        			id:data.data.stops_list[i].id,
	        			tipo:'stopmarker'
	    			});
	    			fisicmarkers.push(marker);
					var new_marker = {'stop_id':data.data.stops_list[i].id, 'marker':marker};
					stopmarkers[data.data.stops_list[i].id] = new_marker;
				}
			}
		}
	});
}

function viewFlota() {
	var firebase_url = 'https://'+radio.fb_ref+'.firebaseio.com';
	var firebase_ref= new Firebase(firebase_url);
	var drivers_ref= firebase_ref.child('drivers');
	var stop_ref= firebase_ref.child('stops');
    drivers_ref.on('child_added', function(snapshot) {
		add_driver_fb(snapshot.val());
		loadDriversInStops(radio);
		
    });
	
    drivers_ref.on('child_changed', function(snapshot) {
		edit_driver_fb(snapshot.val());
		loadDriversInStops(radio);
    });
	
    drivers_ref.on('child_removed', function(snapshot) {
		delete_driver_fb(snapshot.val());
		loadDriversInStops(radio);
    });

    stop_ref.on('child_added', function(snapshot) {
		loadDriversInStops(radio);
    });
	
    stop_ref.on('child_changed', function(snapshot) {
		loadDriversInStops(radio);
    });
	
    stop_ref.on('child_removed', function(snapshot) {
		loadDriversInStops(radio);
    });
    
}


function select_driver(driver_id) {
	driver = _.find(drivers, function(r){ return r.id == driver_id; });
	return driver;
}

var markers = [];
var stopmarkers = [];
var fisicmarkers = [];

function add_driver_fb(driver) {
	if(driver.coordinates!=undefined && driver.driver_id!=undefined){
		
		var db_driver = select_driver(driver.driver_id);
		for(var x=0; x<fisicmarkers.length; x++){
			if(fisicmarkers[x].tipo === 'drivermarker' && fisicmarkers[x].id==driver.driver_id){
				fisicmarkers[x].setVisible(false);
				fisicmarkers.splice(x,1);
				x--;
			}
		}
		var coordinates = driver.coordinates.split('#');
		console.log(coordinates[0]+' / '+coordinates[1]);
		var marker;
		canvas= canvas_marker_os(true,db_driver.num_licence);
	    marker=new google.maps.Marker({
	        position: new google.maps.LatLng(coordinates[0],coordinates[1]),
	        map: map,
	        draggable: false,
	        icon: canvas.toDataURL(),
	        title: db_driver.name,
	        animation: google.maps.Animation.DROP,
	        id:driver.driver_id,
	        tipo:'drivermarker'
	    });
	    fisicmarkers.push(marker);
		marker.driver_id = driver.driver_id;
	    google.maps.event.addListener(marker, 'click', function() {
			modal_driver_operator_details(this.driver_id);
	    });
		
		var new_marker = {'driver_id':driver.driver_id, 'licence_id':driver.licence_id, 'marker':marker};
		markers[driver.driver_id] = new_marker;
		
		
		
		// relativeZoom();
	}
}

function relativeZoom() {
	var latlngbounds = new google.maps.LatLngBounds();
	
	$.each(markers, function(index, themarker) {
		if(themarker!=undefined){
			var pos = themarker.marker.position;
			latlngbounds.extend(pos);
			map.setCenter(latlngbounds.getCenter());
			map.fitBounds(latlngbounds); 
		}
	});
}


function edit_driver_fb(driver) {
	the_marker = markers[driver.driver_id];
	if(the_marker!=undefined && driver.coordinates!=undefined){
		var coordinates = driver.coordinates.split('#');
		var latlng = new google.maps.LatLng(coordinates[0],coordinates[1]);
		markers[driver.driver_id].marker.setPosition(latlng);
		// relativeZoom();
	}
	else add_driver_fb(driver);
}

function delete_driver_fb(driver) {
	the_marker = markers[driver.driver_id];
	if(the_marker!=undefined){
		markers[driver.driver_id].marker.setMap(null);
		delete markers[driver.driver_id];
		// relativeZoom();
	}
}

function delete_all_markers() {
	$.each(markers, function(index, marker) {
		the_marker = markers[index];
		if(the_marker!=undefined){
			markers[index].marker.setMap(null);
			delete markers[index];
			// relativeZoom();
		}
	});
}




function canvas_marker_os(libre,id){
    canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 26;
    if (libre) color="rgba(253, 183, 0,0.8)";
    else color="rgba(211,98,97,0.8)";
    ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(30,0, 60, 20);
    ctx.lineWidth = 7;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(55, 20);
    ctx.lineTo(60,26);
    ctx.lineTo(65,20);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFF';
    ctx.font = "12px";
    ctx.fillText(id,35,14,110);
    ctx.fillStyle = "rgba(255,255,0,1)";
    return canvas;
}





function drawFeatures() {
	var destino = $('#carateristicas');
	destino.empty();
	if(radio){
		$.each(radio.features, function(index, feature) {
			if(feature.id!=8){
				var opcion = $('<div></div>').attr({'class':'opciones', 'data-feature-id':feature.id}).text(feature.description); destino.append(opcion);
				var check = $('<div></div>').attr({'class':'tools-check'}); opcion.append(check);
				opcion.click(function(){
					ch=$(this).find('.tools-check');
					if ($(ch).hasClass("activo")){
						$(ch).add(this).removeClass("activo");
					} else {
						$(ch).add(this).addClass("activo");
					}
				});
			}
		});
	}
	
	
	
}

function isRadiosSelected() {
	if($('#radio').val()=='0') return false;
	else return true;
}

function activaButtonBuscador(){
	if($('#buscarLicenciaInput').val()!=''){
		searchLicencia($('#buscarLicenciaInput').val());
	}
}

function activaQuienPide() {
	$( "#usuariopide" ).change(function() {
  		$('#usuario_wrapper').slideDown();
	});
	$( "#otropide" ).change(function() {
		limpiaCampos();
  		$('#usuario_wrapper').slideUp();
  		$.getJSON(api_url+'auth/get_otro_default?callback=?',function(data){
			if(data.status=='success'){
				user = data.data;
			}
		});
	});
	$( "#taxistapide" ).change(function() {
		limpiaCampos();
  		$('#usuario_wrapper').slideUp();
  		$.getJSON(api_url+'auth/get_taxista_default?callback=?',function(data){
			if(data.status=='success'){
				user = data.data;
			}
		});
	});
	$( "#ocultopide" ).change(function() {
		limpiaCampos();
  		$('#usuario_wrapper').slideUp();
  		$.getJSON(api_url+'auth/get_oculto_default?callback=?',function(data){
			if(data.status=='success'){
				user = data.data;
			}
		});
	});
}

function activaInputOrigen() {
	$('#origen').bind({
		keypress: function(e) {
			var code = e.keyCode || e.which;
			if(code == 13) makeAddressString();
		}
	});
}

function activaInputBuscador() {
	$('#buscarLicenciaInput').bind({
		keypress: function(e) {
			var code = e.keyCode || e.which;
			if(code == 13) {
				if($('#buscarLicenciaInput').val()!=''){
					searchLicencia($('#buscarLicenciaInput').val());
				}
			}
		}
	});
}

function makeAddressString() {
	if(isRadiosSelected()){
		var cadena = $('#origen').val();
	    if(countWords(cadena)<4){
			if($('body').attr('data-location-city')!=undefined) cadena=cadena+', '+$('body').attr('data-location-city');
			if($('body').attr('data-location-region')!=undefined) cadena=cadena+', '+$('body').attr('data-location-region');
			if($('body').attr('data-location-country-name')!=undefined) cadena=cadena+', '+$('body').attr('data-location-country-name');
		}
		if(cadena.length>0) selectLocation(cadena);
		else launch_alert('<i class="fa fa-frown-o"></i> Inserta una dirección','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Seleccione Radio','warning');
}

function activaInputEmail() {
	$('#email').bind({
		keypress: function(e) {
			var code = e.keyCode || e.which;
			if(code == 13) searchByEmail();
		}
	});
}

function activaInputTelefono() {
	$('#telefono').bind({
		keypress: function(e) {
			var code = e.keyCode || e.which;
			if(code == 13) searchByPhone(false);
		}
	});
}

function activaInputLicencia() {
	$('#licencia').bind({
		keypress: function(e) {
			var code = e.keyCode || e.which;
			if(code == 13) intentaSolicitarTaxiManual('Now');
		}
	});
}

function intentaSolicitarTaxiManual(fecha) {
	$('#wait').css('display', 'block');
	if(user){
		if(user.auth_profile.role=='U_Passengers'){
			if( $('body').attr('data-location-country-code')!=undefined && $('body').attr('data-location-postacode')!=undefined ) {
				var country_code = $('body').attr('data-location-country-code');
				var postal_code = $('body').attr('data-location-postacode');
		
				if(radio){
			
					$.getJSON(api_url+'radios/list_by_location?callback=?', {country_code:country_code, postal_code:postal_code}, function(data){
							
						if(data.status=='success'){
					
							
					
							if(_.find(data.data.radios, function(r){ return r.id == radio.radio_id; })){
						
								if($('#licencia').val()!=''){
									$.getJSON(api_url+'drivers/search_licence?callback=?', {num_licence:$('#licencia').val(), radio_id:radio.radio_id}, function(data){
										if(data.status=='success'){
											add_journey_manual(fecha,data.data.list_drivers[0].id);
											$.getJSON(api_url+'passengers/edit_foreign?callback=?', {id:user.profile.id, indications:$('#observacionescliente').val()}, function(data){
											});	
											
										}else{
											$('#wait').css('display', 'none');
											launch_alert('<i class="fa fa-frown-o"></i> La licencia indicada no existe en esta radio','warning'); 
										}
									});
								}			
								else {launch_alert('<i class="fa fa-frown-o"></i> No ha indicado ningún taxista para asignarle la carrera','warning'); $('#wait').css('display', 'none');}
							}
							else {launch_alert('<i class="fa fa-frown-o"></i> Localización inválida para la radio seleccionada','warning'); $('#wait').css('display', 'none');}
					
						}
						else {launch_alert('<i class="fa fa-frown-o"></i> Ninguna radio da servicio aqui','warning'); $('#wait').css('display', 'none');}
			
					});
			
				}
				else {launch_alert('<i class="fa fa-frown-o"></i> Debe seleccionar una radio','warning'); $('#wait').css('display', 'none');} 
		
			}
			else {launch_alert('<i class="fa fa-frown-o"></i> Localización no detectada','warning'); $('#wait').css('display', 'none');} 
		}
		else {launch_alert('<i class="fa fa-frown-o"></i> Solo pasajeros pueden solicitar taxis','warning'); $('#wait').css('display', 'none');}  
	}
	else{
		var phone = $('#telefono').val();
		if(phone.length>4) searchByPhonePre(fecha);
		else launch_alert('<i class="fa fa-frown-o"></i> Ningún pasajero definido','warning'); 
		$('#wait').css('display', 'none');
	}
}

function searchByEmail() {
	if($('#tituloCaracteristicas').attr('onclick')=="plegarCaracteristicas();"){
		plegarCaracteristicas();
	}
	var email=$('#email').val();
	
	if(email.length>4){
		$.getJSON(api_url+'auth/search_by_email?callback=?', {email:email} ,function(data){
			if(data.status=='success'){
				user = data.data;
				
				if(user.auth_profile.role == 'U_Passengers' || user.auth_profile.role == 'U_Drivers'){
					
					$('#nombre').val(user.auth_profile.name);
					$('#apellidos').val(user.auth_profile.surname);
					$('#email').val(user.auth_profile.email);
					$('#telefono').val(user.auth_profile.phone);
					
					if(user.auth_profile.role == 'U_Passengers'){
						$('#observacionescliente').val(user.profile.indications);
						if(user.profile.discapacitado){
							$('.opciones[data-feature-id=6]').addClass('activo');
							$('.opciones[data-feature-id=6] .tools-check').addClass('activo');
							desplegarCaracteristicas();
						}
						$('#passenger_detail_button').fadeIn();
						launch_alert('<i class="fa fa-smile-o"></i> Pasajero encontrado','');
						buscarCarrera();
					}
					if(user.auth_profile.role == 'U_Drivers'){
						launch_alert('<i class="fa fa-frown-o"></i> Taxista encontrado','');
						modal_driver_operator_details(user.profile.id);
					}
					
				}
				else launch_alert('<i class="fa fa-frown-o"></i> Rol no permitido','warning');
			}
			else{
				launch_alert('<i class="fa fa-frown-o"></i> No se ha encontrado usuario','warning');
				limpiaCampos('Sin usuarios');
			}
		});
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Email demasiado corto','warning');
	
}

function searchByPhone(callback) {
	if($('#tituloCaracteristicas').attr('onclick')=="plegarCaracteristicas();"){
		plegarCaracteristicas();
	}
	var telefono=$('#telefono').val();
	
	if(telefono.length>3){
		$.getJSON(api_url+'auth/search_by_phone?callback=?', {phone:telefono} ,function(data){
			if(data.status=='success'){
				user = data.data;
				
				if(user.auth_profile.role == 'U_Passengers' || user.auth_profile.role == 'U_Drivers'){
					
					$('#nombre').val(user.auth_profile.name);
					$('#apellidos').val(user.auth_profile.surname);
					$('#email').val(user.auth_profile.email);
					$('#telefono').val(user.auth_profile.phone);
					
					if(user.auth_profile.role == 'U_Passengers'){
						$('#observacionescliente').val(user.profile.indications);
						if(user.profile.discapacitado){
							$('.opciones[data-feature-id=6]').addClass('activo');
							$('.opciones[data-feature-id=6] .tools-check').addClass('activo');
							desplegarCaracteristicas();
						}
						$('#passenger_detail_button').fadeIn();
						launch_alert('<i class="fa fa-smile-o"></i> Pasajero encontrado','');
						buscarCarrera();
						if (typeof callback == "function") callback();
					}
					if(user.auth_profile.role == 'U_Drivers'){
						launch_alert('<i class="fa fa-frown-o"></i> Taxista encontrado','');
						modal_driver_operator_details(user.profile.id);
					}
					
				}
				else launch_alert('<i class="fa fa-frown-o"></i> Rol no permitido','warning');
			}
			else{
				launch_alert('<i class="fa fa-frown-o"></i> No se ha encontrado usuario','warning');
				//limpiaCampos('Sin usuarios');
			}
		});
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Numeración demasiada corta','warning');
	
}


function searchByPhonePre(fecha) {
	var telefono=$('#telefono').val();
	
	if(telefono.length>3){
		$.getJSON(api_url+'auth/search_by_phone?callback=?', {phone:telefono} ,function(data){
			if(data.status=='success'){
				user = data.data;
				
				if(user.auth_profile.role == 'U_Passengers' || user.auth_profile.role == 'U_Drivers'){
					
					$('#nombre').val(user.auth_profile.name);
					$('#apellidos').val(user.auth_profile.surname);
					$('#email').val(user.auth_profile.email);
					$('#telefono').val(user.auth_profile.phone);
					
					if(user.auth_profile.role == 'U_Passengers'){
						$('#observacionescliente').val(user.profile.indications);
						if(user.profile.discapacitado){
							$('.opciones[data-feature-id=6]').addClass('activo');
							$('.opciones[data-feature-id=6] .tools-check').addClass('activo');
							desplegarCaracteristicas();
						}
						$('#passenger_detail_button').fadeIn();
						launch_alert('<i class="fa fa-smile-o"></i> Pasajero encontrado','');
						buscarCarreraPre(fecha);
					}
					if(user.auth_profile.role == 'U_Drivers'){
						launch_alert('<i class="fa fa-frown-o"></i> Taxista encontrado','');
						modal_driver_operator_details(user.profile.id);
					}
					
				}
				else launch_alert('<i class="fa fa-frown-o"></i> Rol no permitido','warning');
			}
			else{
				add_passenger(fecha);
			}
		});
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Numeración demasiada corta','warning');
	
}

function buscarCarreraPre(fecha) {
	$.getJSON(api_url+'passengers/last_journey_inradio_foreign?callback=?', {passenger_id:user.profile.id, radio_id:radio.radio_id} ,function(data){
		if(data.status=='success'){
			if(data.data.journeys.length>0){
				var last_journey = data.data.journeys[0];
				if(last_journey.status!='completed' && last_journey.status!='canceled') verCarrera(last_journey.id);
				else{
					intentaSolicitarTaxi(fecha);
				}
			}
			
			
		}
	});
}

function buscarCarrera() {
	$.getJSON(api_url+'passengers/last_journey_inradio_foreign?callback=?', {passenger_id:user.profile.id, radio_id:radio.radio_id} ,function(data){
		if(data.status=='success'){
			if(data.data.journeys.length>0){
				var last_journey = data.data.journeys[0];
				if(last_journey.status!='completed' && last_journey.status!='canceled') verCarrera(last_journey.id);
				else{
					$('#origen').val(last_journey.origin);
					makeAddressString();
				}
			}
			
			
		}
	});
}

function passenger_detail() {
	modal_passenger_details_operator(user.profile.id);
}



/** MAPA **/

var map;
var origen;
var userLat;
var userLng;

$(window).resize(function(){
    escaleMap();
});

function escaleMap() {
	var height_guiade=$('body').height()-1;
	var height_map=height_guiade-37;
	
	var width_guiade=$('body').width();
	var width_sidebar=320;
	// var width_sidebar=$('#callcenter').width();
	var width_main = width_guiade-width_sidebar+5;
	var width_map = width_guiade-width_sidebar+4;
	
	$('#main').css({'height':height_guiade+'px','width':width_main+'px','margin-left':'300px','margin-right':'0px','padding':'0px'});
	$('#map').css({'height':height_map+'px', 'width':width_map+'px'});
}

// GOOGLE MAPS
function loadMap() {
	escaleMap();
	$.getScript('https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&sensor=false&callback=showMap');
}

var ocupacion_paradas = [];

function Parada(id,ocupacion){
	this.id_stop=id;
	this.ocupacion=ocupacion;
}

function loadDriversInStops(radio){
	var firebase_url = 'https://'+radio.fb_ref+'.firebaseio.com';
	var firebase_ref= new Firebase(firebase_url);
	var stops_ref= firebase_ref.child('stops');

	stops_ref.once('value', function(snapshot) {
		var firebase_stops = snapshot.val();
		if(firebase_stops!=undefined){
			$.each(firebase_stops, function(index, firebase_stop) {
				var drivers = firebase_stop;
				var numdrivers = 0;
				$.each(drivers, function(index, driver) {
					for(var y=0; y<markers.length; y++){
						if(markers[y]!=null){
							if(markers[y].driver_id==index){
								numdrivers=numdrivers+1;
							}
						}
					}
				});
				var existe = false;
				for(var i=0; i<ocupacion_paradas.length; i++){
					if(ocupacion_paradas[i].id_stop==index){
						ocupacion_paradas[i].ocupacion=numdrivers;
						existe = true;
					}
				}
				if(!existe){
					ocupacion_paradas.push(new Parada(index,numdrivers));
				}
			});
		}
		for(var z=0; z<ocupacion_paradas.length; z++){
			var existeparada = false;
			if(firebase_stops!=undefined){
				$.each(firebase_stops, function(index, firebase_stop) {
					if(index==ocupacion_paradas[z].id_stop){
						existeparada=true;
					}
				});
			}
			if(!existeparada){
				ocupacion_paradas.splice(z, 1);
				z--;
			}
		}
	});
	viewStops();
}

function showMap() {
	var map_wrapper=$('#map');
	
    var myOptions = {
      zoom: 14,
      center: new google.maps.LatLng(40.419445,-3.69286),
      disableDefaultUI: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
	  styles:[{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":60}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]}]
    };
	map = new google.maps.Map(document.getElementById("map"), myOptions);
	selectLocation(radio.city);
}

function selectLocation(cadena) {
    var geo = new google.maps.Geocoder();
	
    geo.geocode({'address': cadena}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if(results.length>1) showLocationsList(results);
            else{
	            if (results[0]) defineLocation(results[0], false, true);
			}
        }
    });
    PlacesApiLoaded();
}

function calculateLocation(marker) {
   var geo = new google.maps.Geocoder();
   geo.geocode({'latLng': marker.getPosition()}, function(results, status) {
         if (status == google.maps.GeocoderStatus.OK) {
           if (results[0]) {
				   
               defineLocation(results[0], true, false);
			   
           }
        }
    });
}

function showLocationsList(results) {
	$('#locations').empty();
	var i = 10;
	$.each(results, function(index, result) {
		if(i>0)
		{
			var item= $('<div></div>').attr({'class':'item'}).text(result.formatted_address); $('#locations').append(item);  
			item.click(function(){
				var cadena=$(this).text();
				$('#origen').val(cadena);
				makeAddressString();
				$('#locations').slideUp(function(){
					$('#locations').empty();
				});
				// elegirDireccion(val.formatted_address);
				// //console.log(result.formatted_address);
			});
			i--;
		}
	});
	$('#locations').fadeIn();
}

function defineLocation(result, updateInput, redrawMarkup) {
    var formatted_address=result.formatted_address;
    var latitud=result.geometry.location.lat();
    var longitud=result.geometry.location.lng();
    var arrayOrdenado=orderLocationArray(result.address_components);

    $('body').attr('data-location-address',formatted_address);
    $('body').attr('data-location-latitude',latitud);
    $('body').attr('data-location-longitude',longitud);
    $('body').attr('data-location-number',arrayOrdenado.numero);
    $('body').attr('data-location-street',arrayOrdenado.calle);
    $('body').attr('data-location-city',arrayOrdenado.localidad);
    $('body').attr('data-location-province',arrayOrdenado.provincia);
    $('body').attr('data-location-region',arrayOrdenado.comunidad);
    $('body').attr('data-location-country-name',arrayOrdenado.pais_largo);
    $('body').attr('data-location-country-code',arrayOrdenado.pais_corto);
    $('body').attr('data-location-postacode',arrayOrdenado.cp);
	
	if(updateInput) $('#origen').val(formatted_address);
	
	console.log(latitud+' '+longitud);
	
	if(redrawMarkup) drawnMarkup(latitud, longitud, true);
	
	$('#pedir').fadeIn();
	
}

function orderLocationArray (componentes) {
    var numero='';
    var calle='';
    var localidad='';
    var provincia='';
    var comunidad='';
    var pais_largo='';
    var pais_corto='';
    var cp='';
    
    $.each(componentes, function(index, val) {
        switch(val.types[0]){
            case 'street_number':               numero=val.long_name; break;
            case 'route':                       calle=val.long_name; break;
            case 'locality':                    localidad=val.long_name; break;
            case 'administrative_area_level_2': provincia=val.long_name; break;
            case 'administrative_area_level_1': comunidad=val.long_name; break;
            case 'country':                     pais_largo=val.long_name; pais_corto=val.short_name; break;
            case 'postal_code':                 cp=val.long_name; break;
        }
    });

    if(cp=="") cp=localidad;
    
    return {numero:numero,calle:calle,localidad:localidad,provincia:provincia,comunidad:comunidad,pais_largo:pais_largo,pais_corto:pais_corto,cp:cp};
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

function centerMap(cadena) {
    var geo = new google.maps.Geocoder();
	
    geo.geocode({'address': cadena}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                var latitud=results[0].geometry.location.lat();
                var longitud=results[0].geometry.location.lng();
                drawnMarkup(latitud, longitud, true);
            }
        }
    });
}





// LOGICA SOLICITUD 

// LOGICA CARRERA

function intentaSolicitarTaxiMasTarde() {
	$('#taxis').add('#carateristicas').add('#observaciones_wrapper').add('#request_buttons').slideUp();
	$('#reserva').slideDown();
}

function anulaIntentoReserva() {
	$('#taxis').add('#carateristicas').add('#observaciones_wrapper').add('#request_buttons').slideDown();
	$('#reserva').slideUp();
}

function reserva() {
    var dia_peticion=$('#datepicker_input').val();
    var hora_peticion=$('#timepicker_input').val();
	var fecha=dia_peticion+' '+hora_peticion+':00';
	intentaSolicitarTaxi(fecha);
	anulaIntentoReserva();
}

function intentaSolicitarTaxi(fecha) {
	
	if($('#licencia').val()==''){
		$('#wait').css('display', 'block');
		if(user){
			if(user.auth_profile.role=='U_Passengers'){
				if( $('body').attr('data-location-country-code')!=undefined && $('body').attr('data-location-postacode')!=undefined ) {
					var country_code = $('body').attr('data-location-country-code');
					var postal_code = $('body').attr('data-location-postacode');
			
					if(isRadiosSelected() && radio){
				
						$.getJSON(api_url+'radios/list_by_location?callback=?', {country_code:country_code, postal_code:postal_code}, function(data){
								
							if(data.status=='success'){
						
								
						
								if(_.find(data.data.radios, function(r){ return r.id == radio.radio_id; })){
									add_journey(fecha);
									$.getJSON(api_url+'passengers/edit_foreign?callback=?', {id:user.profile.id, indications:$('#observacionescliente').val()}, function(data){
									});						
									
								}
								else{$('#wait').css('display', 'none'); launch_alert('<i class="fa fa-frown-o"></i> Localización inválida para la radio seleccionada','warning');}
						
							}
							else{ $('#wait').css('display', 'none'); launch_alert('<i class="fa fa-frown-o"></i> Ninguna radio da servicio aqui','warning'); }
				
						});
				
					}
					else { $('#wait').css('display', 'none'); launch_alert('<i class="fa fa-frown-o"></i> Debe seleccionar una radio','warning');} 
			
				}
				else { $('#wait').css('display', 'none'); launch_alert('<i class="fa fa-frown-o"></i> Localización no detectada','warning');} 
			}
			else{ $('#wait').css('display', 'none'); launch_alert('<i class="fa fa-frown-o"></i> Solo pasajeros pueden solicitar taxis','warning');}  
		}
		else{
			var phone = $('#telefono').val();
			if(phone.length>4) searchByPhonePre(fecha);
			else launch_alert('<i class="fa fa-frown-o"></i> Ningún pasajero definido','warning'); 
			$('#wait').css('display', 'none');
		}
	}else{
		intentaSolicitarTaxiManual(fecha);
	}
}

function add_passenger(fecha) {
	var params = { phone : $('#telefono').val(), prefix : radio.prefix };
	
	if( $('#nombre').val().length>0 ) params['name']=$('#nombre').val();
	if( $('#apellidos').val().length>0 ) params['surname']=$('#apellidos').val();
	if( $('#email').val().length>0 ) params['email']=$('#email').val();
	if( $('#observacionescliente').val().length>0 ) params['indications']=$('#observacionescliente').val();
	
	$.getJSON(api_url+'passengers/add_from_call?callback=?', params, function(data){
			
		if(data.status=='success'){
			searchByPhone(function(){
				intentaSolicitarTaxi(fecha);
			});
			
	
		}
		else launch_alert('<i class="fa fa-frown-o"></i> No se ha podido crear el pasajero','warning'); 

	});
}

function add_journey(fecha) {
	// var auth_id = $('body').attr('data-auth-id');
	var auth_id = user.auth_profile.id;
	
	var country_code = $('body').attr('data-location-country-code');
	var postal_code = $('body').attr('data-location-postacode');
	var lat_origin = $('body').attr('data-location-latitude');
	var lon_origin = $('body').attr('data-location-longitude');
	var origin = $('body').attr('data-location-address');
	var destination = $('#destino').val();
	var offset = local_offset;
	var date_depart  = fecha;
	var num_passengers = $('#pasajeros').val();
	var indications = $('#observaciones').val();
	var radio_id = radio.radio_id;
	var checkboxes = $('#carateristicas .opciones.activo');
	var features='';
	checkboxes.each(function(index) {
		features+=$(this).attr('data-feature-id')+',';
	});
	
	
	// var boton =$(element);
	// boton.html('<i class="fa fa-cog fa-spin"></i>');
	
	$.getJSON(api_url+'journeys/add_foreign?callback=?', {	
													auth_id:auth_id,
													country_code:country_code, 
													postal_code:postal_code, 
													radio_id:radio_id, 
													lat_origin:lat_origin, 
													lon_origin:lon_origin, 
													origin:origin,
													destination:destination,
													offset:offset,
													date_depart:date_depart,
													num_passengers:num_passengers,
													indications:indications,
													features:features,
													source:'Call'
												}, function(data){
												
			
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Carrera creada correctamente','');
				limpiaCampos();
				$('#wait').css('display', 'none');
			}
			else{
				if(data.response=='concurrent_journeys'){
					launch_alert('<i class="fa fa-frown-o"></i> Ya hay un taxi solicitado','warning'); 
					$('#wait').css('display', 'none');
				}else{
					if(data.response=='no_active_drivers'){
						launch_alert('<i class="fa fa-frown-o"></i> No hay taxistas disponibles con las características indicadas','warning'); 
						$('#wait').css('display', 'none');
					}
					else {launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');$('#wait').css('display', 'none');} 
				}
			}
													
	});
	
}

function add_journey_manual(fecha,driver) {
	// var auth_id = $('body').attr('data-auth-id');
	var auth_id = user.auth_profile.id;
	
	var country_code = $('body').attr('data-location-country-code');
	var postal_code = $('body').attr('data-location-postacode');
	var lat_origin = $('body').attr('data-location-latitude');
	var lon_origin = $('body').attr('data-location-longitude');
	var origin = $('body').attr('data-location-address');
	var destination = $('#destino').val();
	var offset = local_offset;
	var date_depart  = fecha;
	var num_passengers = $('#pasajeros').val();
	var indications = $('#observaciones').val();
	var radio_id = radio.radio_id;
	var checkboxes = $('#carateristicas .opciones.activo');
	var features='';
	checkboxes.each(function(index) {
		features+=$(this).attr('data-feature-id')+',';
	});
	
	
	// var boton =$(element);
	// boton.html('<i class="fa fa-cog fa-spin"></i>');
	
	$.getJSON(api_url+'journeys/add_with_driver_call?callback=?', {	
													auth_id:auth_id,
													country_code:country_code, 
													postal_code:postal_code, 
													radio_id:radio_id, 
													lat_origin:lat_origin, 
													lon_origin:lon_origin, 
													origin:origin,
													destination:destination,
													offset:offset,
													date_depart:date_depart,
													num_passengers:num_passengers,
													indications:indications,
													features:features,
													driver_id:driver,
													source:'Call'
												}, function(data){
												
			
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Carrera creada correctamente','');
				limpiaCampos();
				$('#wait').css('display', 'none');
			}
			else{
				if(data.response=='concurrent_journeys'){
					launch_alert('<i class="fa fa-frown-o"></i> Ya hay un taxi solicitado','warning');
					$('#wait').css('display', 'none'); 
				}else{
					if(data.response=='no_active_drivers'){
						launch_alert('<i class="fa fa-frown-o"></i> No hay taxistas disponibles con las características indicadas','warning'); 
						$('#wait').css('display', 'none');
					}
					else {launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');$('#wait').css('display', 'none');} 
				}
				
			}
													
	});
	
}


function limpiaCampos(motivo) {
	$('#nombre').val('');
	$('#apellidos').val('');
	$('#email').val('');
	$('#telefono').val('');
	$('#origen').val('');
	$('#destino').val('');
	$('#observaciones').val('');
	$('#observacionescliente').val('');
	$('#licencia').val('');
	$('#telefono').focus();
	$('#observacionescliente').val('');
	user = false;
	$('#passenger_detail_button').fadeOut();
	$('.tools-check').removeClass('activo');
	$('.opciones').removeClass('activo');
	$('.tools-check').addClass('inactivo');
	if($('#tituloCaracteristicas').attr('onclick')=="plegarCaracteristicas();"){
		plegarCaracteristicas();
	}
	if($('#usuariopide').is(':checked')){
		$('#usuario_wrapper').slideDown();
	}
	if($('#otropide').is(':checked')){
		$('#usuario_wrapper').slideUp();
  		$.getJSON(api_url+'auth/get_otro_default?callback=?',function(data){
			if(data.status=='success'){
				user = data.data;
			}
		});
	}
	if($('#taxistapide').is(':checked')){
		$('#usuario_wrapper').slideUp();
  		$.getJSON(api_url+'auth/get_taxista_default?callback=?',function(data){
			if(data.status=='success'){
				user = data.data;
			}
		});
	}
	if($('#ocultopide').is(':checked')){
		$('#usuario_wrapper').slideUp();
  		$.getJSON(api_url+'auth/get_oculto_default?callback=?',function(data){
			if(data.status=='success'){
				user = data.data;
			}
		});
	}
}



// TOOL CONTAR PALABRAS
function countWords(s){
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
	return s.split(' ').length;
}

function desplegarCaracteristicas(){
	$('#carateristicas').slideDown();
	$('#tituloCaracteristicas').attr('onclick', 'plegarCaracteristicas();');
	$('.fa-arrow-down').remove();
	$('#tituloCaracteristicas').prepend('<i class="fa fa-arrow-up"></i>');
	$('#tituloCaracteristicas').append('<i class="fa fa-arrow-up"></i>');
}

function plegarCaracteristicas(){
	$('#carateristicas').slideUp();
	$('#tituloCaracteristicas').attr('onclick', 'desplegarCaracteristicas();');
	$('.fa-arrow-up').remove();
	$('#tituloCaracteristicas').prepend('<i class="fa fa-arrow-down"></i>');
	$('#tituloCaracteristicas').append('<i class="fa fa-arrow-down"></i>');
}