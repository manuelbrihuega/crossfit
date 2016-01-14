function get_content() {
	
	$.getScript(media_url+'js/aux/date.js');
	$.getScript(media_url+'js/aux/modals.js');
	
	$.post('partials/get_taxi_admin_enterprise', function(template, textStatus, xhr) {
	 	$('#main').html(template);
		loadGeolocationEnterprise();
		loadEmployees();
		setInterval(listPending, 3000);
		$('#source_input').bind({
			click: function() {
	    		  $('#locations').fadeOut();
	 		 	},
			blur: function() {
	    		  $('#locations').fadeOut();
	 		 	},
			keypress: function(e) {
				var code = e.keyCode || e.which;
				if(code == 13) searchGeolocation();
			}
		});
			
	
	
	});
}

var currect_radio=false;

var map;
var origen;
var userLat;
var userLng;
var entLat;
var entLng;
var entAddress;
var pendings = new Array();
var asignados = new Array();
function Pendiente(id,status,fecha,empleado,direccion,radio,taxista){
	this.id=id;
	this.status=status;
	this.fecha=fecha;
	this.empleado=empleado;
	this.direccion=direccion;
	this.radio=radio;
	this.taxista=taxista;
}

$(window).resize(function(){
    escaleMap();
});

function mostrarCarrerasPendientes(){
	var mymodal=newModal('carreras_pendientes','Taxis pendientes',false);
	doModalBigger(mymodal);
	pintarModal();
	//modalAddBody(mymodal,body);
	mymodal.modal('show');
}

function pintarModal(){
	$('#carreras_pendientes .modal-body').html('');
	if(pendings.length>0){
		var table_wrapper=$('<div></div>').attr('class','table-responsive'); $('#carreras_pendientes .modal-body').append(table_wrapper);
		var table=$('<table></table>').attr({'class':'table sortable','id':'tableToOrder'}); table_wrapper.append(table);
		var thead=$('<thead></thead>'); table.append(thead);
		var tr=$('<tr></tr>'); thead.append(tr);
		var th=$('<th></th>').text('Estado'); th.css('cursor','pointer'); tr.append(th);
		var th=$('<th></th>').text('Fecha'); th.css('cursor','pointer'); tr.append(th);
		var th=$('<th></th>').text('Origen'); th.css('cursor','pointer'); tr.append(th);
		var th=$('<th></th>').text('Empleado'); th.css('cursor','pointer'); tr.append(th);
		var th=$('<th></th>').text('Radio'); th.css('cursor','pointer'); tr.append(th);
		var th=$('<th></th>').text('Taxista'); th.css('cursor','pointer'); tr.append(th);
		var tbody=$('<tbody></tbody>'); table.append(tbody);
		for(var i=0; i<pendings.length; i++){
			var tr=$('<tr></tr>').attr({'class':pendings[i].status, 'data-id':pendings[i].id}); tbody.append(tr);
			if(pendings[i].status=='pending'){
				var td=$('<td></td>').text('Pendiente'); tr.append(td);
			}
			if(pendings[i].status=='assigned'){
				var td=$('<td></td>').text('Asignado'); tr.append(td);
			}
			if(pendings[i].status=='picked'){
				var td=$('<td></td>').text('Recogido'); tr.append(td);
			}
			if(pendings[i].status=='accepted'){
				var td=$('<td></td>').text('Aceptado'); tr.append(td);
			}
			if(pendings[i].status=='onway'){
				var td=$('<td></td>').text('En camino'); tr.append(td);
			}
			var td=$('<td></td>').text(pendings[i].fecha); tr.append(td);
			var td=$('<td></td>').text(pendings[i].direccion); tr.append(td);
			var td=$('<td></td>').text(pendings[i].empleado); tr.append(td);
			var td=$('<td></td>').text(pendings[i].radio); tr.append(td);
			var td=$('<td></td>').text(pendings[i].taxista); tr.append(td);						
		}					
	}
	
}

function listPending(){
	$.getJSON(api_url+'enterprises/list_pending_journeys_admin?callback=?', {offset:local_offset}, function(data){
		if(data.status=='success'){
			pendings=[];
			if(data.data.journeys.length>0){
				for(var i=0; i<data.data.journeys.length; i++){
					pend = new Pendiente(data.data.journeys[i].id,data.data.journeys[i].status,data.data.journeys[i].date,data.data.journeys[i].user+' ('+data.data.journeys[i].user_phone+')',data.data.journeys[i].address,data.data.journeys[i].radio,data.data.journeys[i].driver);
					pendings.push(pend);
					if(data.data.journeys[i].status=='assigned'){
						if(asignados.indexOf(data.data.journeys[i].id)==-1){
							asignados.push(data.data.journeys[i].id);
							alert("El taxi para "+data.data.journeys[i].user+" ha sido asignado.");
						}
					}
				}
				if(!$('#pendientes').length){
					$('#main').append('<div id="pendientes" onclick="mostrarCarrerasPendientes();">TAXIS PENDIENTES</div>');
				}
				pintarModal();
				
			}else{
				if($('#pendientes').length){
					$('#pendientes').remove();
				}
			}
		}
	});
}

function searchGeolocation() {
	var cadena = $('#source_input').val();
    if(countWords(cadena)<4){
		if($('body').attr('data-location-city')!=undefined) cadena=cadena+', '+$('body').attr('data-location-city');
		if($('body').attr('data-location-region')!=undefined) cadena=cadena+', '+$('body').attr('data-location-region');
		if($('body').attr('data-location-country-name')!=undefined) cadena=cadena+', '+$('body').attr('data-location-country-name');
	}
	////console.log(cadena);
	if(cadena.length>0) selectLocation(cadena);
	else launch_alert('<i class="fa fa-frown-o"></i> Inserta una dirección','warning') 
}

function escaleMap() {
	var height_guiade=$('body').height()-1;
	var height_map=height_guiade-37;
	var width_guiade=$('body').width();
	var width_sidebar=320;
	var width_main = width_guiade-width_sidebar+96;
	var width_map = width_guiade-width_sidebar+96;
	$('#push').hide();
	$('#main').css({'height':height_guiade+'px','width':width_main+'px','margin-left':'209px','margin-right':'0px','padding':'0px'});
	$('#map').css({'height':height_map+'px', 'width':width_map+'px'});
}

var employees_projects=[];
function Empleado (idemp,nameemp,surnameemp,idproject,nameproject){
   this.id_empleado = idemp;
   this.name_empleado = nameemp;
   this.surname_empleado = surnameemp;
   this.id_proyecto = idproject;
   this.name_proyecto = nameproject;
}

function loadProjects(){
	if($('#select_employees').val()!=-1){
		$("#select_projects option").each(function(){
   			if($(this).attr('value')!=-1){
   				$(this).remove();
   			}
		});
		var id = $('#select_employees').val();
		for(var i=0; i<employees_projects.length; i++){
			if(employees_projects[i].id_empleado==id){
				$('#select_projects').append( new Option(employees_projects[i].name_proyecto, employees_projects[i].id_proyecto) );
			}
		}
	}
}

function loadEmployees(){
	$.getJSON(api_url+'enterprises/list_employees?callback=?', function(data){
		if(data.status=='success'){
			var select= $('<select></select>').attr({'id':'select_employees'});
			var selectprojects= $('<select></select>').attr({'id':'select_projects'});  
			$('#employees').append(select);
			$('#projects').append(selectprojects);
			$('#select_employees').append( new Option('Seleccionar empleado', -1) );
			$('#select_employees').attr('onchange','loadProjects();');
			$('#select_projects').append( new Option('Seleccionar proyecto', -1) );
			for(var i=0; i<data.data.employees.length; i++){
				$('#select_employees').append( new Option(data.data.employees[i].name+" "+data.data.employees[i].surname, data.data.employees[i].auth_id) );
				for(var j=0; j<data.data.employees[i].projects.length; j++){
					emp = new Empleado(data.data.employees[i].auth_id, data.data.employees[i].name, data.data.employees[i].surname, data.data.employees[i].projects[j].id, data.data.employees[i].projects[j].name);
					employees_projects.push(emp);
				}
			}
		}else{
			var select= $('<select></select>').attr({'id':'select_employees'});  
			$('#employees').append(select);
			$('#select_employees').append( new Option('No existen empleados', -1) );
		}
	});
}

function loadGeolocationEnterprise(){
	$.getJSON(api_url+'enterprises/get?callback=?', function(data){
		if(data.status=='success'){
			entLng = data.data.enterprise.longitude;
			entLat = data.data.enterprise.latitude;	
			entAddress = data.data.enterprise.address;
			loadMap();	
		}else{
			launch_alert('<i class="fa fa-frown-o"></i> La empresa no ha podido ser geolocalizada','warning');
			entLat = 40.420088;
			entLng = -3.688810;
			loadMap();
		}
	});
}

// GOOGLE MAPS
function loadMap() {
	escaleMap();
	$.getScript('https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=showMap');
}

function showMap() {
	var map_wrapper=$('#map');
	console.log(entLat);
    var myOptions = {
      zoom: 14,
      center: new google.maps.LatLng(entLat,entLng),
      disableDefaultUI: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
	  styles:[{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":60}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]}]
    };
    console.log(entLng);
	map = new google.maps.Map(document.getElementById("map"), myOptions);
	getLocation();
	$('#source_input').val(entAddress);
	selectLocation(entAddress);
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
				$('#source_input').val(cadena);
				searchGeolocation();
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

function defineLocation(result,updateInput, redrawMarkup) {
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
	
	if(updateInput) $('#source_input').val(formatted_address);
	
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



// LOGICA CARRERA
function getListRadios() {
	if( $('body').attr('data-location-country-code')!=undefined && $('body').attr('data-location-postacode')!=undefined ) {
		if($('#select_employees').val()!=-1){
			var country_code = $('body').attr('data-location-country-code');
			var postal_code = $('body').attr('data-location-postacode');
			
			

			$.getJSON(api_url+'radios/list_by_location?callback=?', {country_code:country_code, postal_code:postal_code}, function(data){
				// //console.log(data);
				
				if(data.status=='success'){

					if(data.data.radios.length==1) {
						currect_radio=data.data.radios[0];
						pretaxirequest();
					}
					else{
					
						var body = $('<div></div>').attr({'id':'radios_list', 'class':'clearfix'});
						$.each(data.data.radios, function(index, radio) {
							var item = $('<div></div>').attr({'class':'item', 'data-id':radio.id}).text(radio.name); body.append(item);
							item.click(function(){
								select_radio(radio);
							})
						});
					
						var mymodal=newModal('select_radio','Elige compañía',false);
						modalAddBody(mymodal,body);
						mymodal.modal('show');
					
					}
				
				}
				else launch_alert('<i class="fa fa-frown-o"></i> Lo sentimos, aun no ofrecemos servicio en esta ciudad','warning'); 
				
				
				
				
			});
		}else launch_alert('<i class="fa fa-frown-o"></i> No hay ningún empleado seleccionado','warning') 
		
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Localización no detectada','warning') 
}



function select_radio(radio) {
	$('#select_radio').modal('hide');
	currect_radio=radio;
	pretaxirequest();
}

function pretaxirequest() {
	var mymodal=newModal('add_journey','Opciones',false);
	
	$.post('partials/modal_new_journey', function(template, textStatus, xhr) {
		modalAddBody(mymodal,template);
		modalAddTitle(mymodal,currect_radio.name);
		var dir= $('#source_input').val();
		$('#dir-journey').html(dir);
		// Numero de pasajeros
		var num_passengers= parseInt(currect_radio.max_passengers);
		for (var i=1;i<=num_passengers;i++)
		{ 
			$('#num_passengers_journey').append('<option value="'+i+'">'+i+'</option>');
		}
		
		var features=currect_radio.features;
		$.each(currect_radio.features, function(index, feature) {
			if(feature.description=="Servicio Corporate"){
				$('#features_wrapper').append('<div class="col-sm-4" id="check-corporate"><div class="checkbox"><label><input type="checkbox" id="'+feature.id+'" checked>'+feature.description+'</label></div></div>');
				$('#check-corporate').hide();
			}else{
				if(feature.description=="Servicio de mensajería"){
					$('#features_wrapper').append('<div class="col-sm-4"><div class="checkbox"><label><input type="checkbox" id="'+feature.id+'">Mensajero</label></div></div>');
				}else{
					if(feature.description=="Personas con discapacidad"){
						$('#features_wrapper').append('<div class="col-sm-4"><div class="checkbox"><label><input type="checkbox" id="'+feature.id+'">Discapacitado</label></div></div>');
					}else{
						$('#features_wrapper').append('<div class="col-sm-4"><div class="checkbox"><label><input type="checkbox" id="'+feature.id+'">'+feature.description+'</label></div></div>');
					}
				}
			}
			
		});
		
		mymodal.modal('show');
	
	});

}

function add_journey(element) {
	var auth_id = $('#select_employees').val();
	var project_id = $('#select_projects').val();
	var country_code = $('body').attr('data-location-country-code');
	var postal_code = $('body').attr('data-location-postacode');
	var lat_origin = $('body').attr('data-location-latitude');
	var lon_origin = $('body').attr('data-location-longitude');
	var origin = $('body').attr('data-location-address');
	var offset = local_offset;
	var date_depart  = 'Now';
	var num_passengers = $('#num_passengers_journey').val();
	var indications = $('#indication_journey').val();
	var radio_id = currect_radio.id;
	var checkboxes = $('#features_wrapper input');
	var features='';
	checkboxes.each(function(index) {
		if (this.checked) features+=$(this).attr('id')+',';
	});
	console.log(features);
	var boton =$(element);
	boton.html('<i class="fa fa-cog fa-spin"></i>');
	
	$.getJSON(api_url+'journeys/add_foreign?callback=?', {	auth_id:auth_id,
													country_code:country_code, 
													postal_code:postal_code, 
													radio_id:radio_id, 
													project_id:project_id,
													lat_origin:lat_origin, 
													lon_origin:lon_origin, 
													origin:origin,
													offset:offset,
													date_depart:date_depart,
													num_passengers:num_passengers,
													indications:indications,
													features:features,
													corporate:true,
													source:'Backend del Admmin Enterprise'
												}, function(data){
												
////console.log(data);
			if(data.status=='success'){
				$('#add_journey').modal('hide');
				launch_alert('<i class="fa fa-smile-o"></i> Carrera creada correctamente','');
			}
			else{
				if(data.response=='concurrent_journeys'){
					launch_alert('<i class="fa fa-frown-o"></i> Ya hay un taxi solicitado','warning'); 
					$('#add_journey').modal('hide');
				}
				if(data.response=='no_active_drivers'){
					launch_alert('<i class="fa fa-frown-o"></i> No hay taxistas disponibles en este momento','warning');
					$('#pedir-taxi-modal').html('PEDIR TAXI');
				}
				else alert_add_journey('<i class="fa fa-frown-o"></i> '+data.response,'warning'); 
			}
													
	});
	
}

function alert_add_journey(message,style) {
	$('#alert_add_journey').html(message).show();
}





// GEOLOCALIZAR
function getLocation() {
    $.getScript('http://www.geoplugin.net/javascript.gp', function() 
    {
 	   $('body').attr({	'data-location-city': geoplugin_city(),
 	   					'data-location-region': geoplugin_region(),
 	   					'data-location-region-code': geoplugin_regionCode(),
 	   					'data-location-region-name': geoplugin_regionName(),
 	   					'data-location-country-code': geoplugin_countryCode(),
 	   					'data-location-country-name': geoplugin_countryName(),
 	   					'data-location-latitude': geoplugin_latitude(),
 	   					'data-location-longitude': geoplugin_longitude()
    				});
		centerMap(entLat+','+entLng);
					
    });
	
	if (navigator.geolocation && false) navigator.geolocation.getCurrentPosition(setLocationBrowser);
}

function setLocationBrowser(position){
   	$('body').attr({'data-location-latitude': position.coords.latitude, 'data-location-longitude': position.coords.longitude });
	centerMap(position.coords.latitude+','+position.coords.longitude);
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



// TOOL CONTAR PALABRAS
function countWords(s){
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
	return s.split(' ').length;
}