function get_content() {
	
			$.getScript(media_url+'js/aux/modals.js', function(){
				$.getScript(media_url+'js/aux/journeys.js', function(){
						$.getScript(media_url+'js/aux/date.js', function(){
							$.getScript(media_url+'js/lib/jquery.keypad.min.js', function(){
								$.getScript(media_url+'js/lib/jquery.keypad-es.js', function(){
									$.post(base_url+'/partials/dashboard_digital_viewer', function(template, textStatus, xhr) {
										$('#main').html(template);
										$.when(
										$.getScript('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js')
										).then(function(){
											loadRadio();
										});
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
			startStops();
			$('#radio_title').html(myradio.name);
			if(myradio.digital){
				$('#radio_map').fadeIn();
			}
		}
		else super_error('Radio info failure');
	});
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
	
	$.post(base_url+'/partials/modal_stop_details', function(template, textStatus, xhr) {
		var body = $('<div></div>').attr({'id':'stop_datail_wrapper'});
		body.html(template);
		modalAddBody(mymodal,body);
		
		$('#stop_address').val(myradio.city+', '+myradio.country_code);
		$('#stop_lat').val('40.419445');
		$('#stop_lon').val('-3.69286');
		// centerMap(myradio.city+', '+myradio.country_code);
		
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
		$('#mapa_stops').remove();
	})
	
}

function edit_stop_modal(stop_id) {
	var mymodal=newModal('edit_stop_modal',true, true);
	modalAddTitle(mymodal,'EDITAR PARADA');
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	
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

function miniModalMapStops() {
	$.getScript('https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=showMiniMapStops');
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