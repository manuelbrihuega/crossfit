$(document).ready(function(){
	$.ajaxSetup({ cache: false });
	
    $.when(
		$.getScript('https://cdn.firebase.com/js/client/1.0.11/firebase.js'),
		$.getScript('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js'),
        $.ready.promise()
    ).then(function(){
        status();
		escaleMap();
    });
	
})

var myrole=false;
var myradio=false;
var drivers=false;
var map;
var markers = [];
var lat;
var lon;

$(window).resize(function(){
    escaleMap();
});

function escaleMap() {
	var height_guiade=$('body').height();
	var width_guiade=$('body').width();
	$('#map').css({'height':height_guiade+'px', 'width':width_guiade+'px'});
	$('#drivers_sidebar').css({'height':height_guiade+'px'});
}

function status() {
	var parametros=''
	$.getJSON( api_url+'auth/status?callback=?', parametros, function(data){
		if(data.status=='success' && data.response=='logged' && (data.data.role=='U_Super' || data.data.role=='U_Delegations' || data.data.role=='U_Viewer_Digital_Radios' ) ){
			myrole=data.data.role;
			$('body').attr({'data-role':data.data.role, 'data-auth-id':data.data.auth_id});
			loadRadio();
		}
		else window.close();
	});
}

function loadRadio() {
	var radio_id = $('body').attr('data-radio-id');
	$.getJSON(api_url+'radios/get_foreign?callback=?', {id:radio_id}, function(data){
		if(data.status=='success'){
			myradio=data.data;
			
			if(myradio.digital){
				loadMap();
				loadDrivers();
			}
			//else window.close();
						
		}
		else alert(data.response);
	});
}

function loadDrivers() {
	$.getJSON(api_url+'drivers/list_by_radio?callback=?', {radio_id:myradio.id}, function(data){
		if(data.status=='success'){
			drivers=data.data.list_drivers;
			$('#total_drivers').text(drivers.length);
		}
		else alert(data.response);
	});
}

function draw_driver_sidebar(driver,firebase_driver) {
	var num_invitations=_.size(firebase_driver.invitations);
	var update = active_time(firebase_driver.update);
	if(driver!=undefined){
		if(driver.photo!='' && 'photo' in driver) var photo = driver.photo;
		else var photo = 'http://f.cl.ly/items/0Y2k2I3K373a1u2K3H1d/placeholder1.gif';
		var item = $('<div></div>').attr({'class':'col-xs-12 item', 'data-id':driver.id}).html('<img class="photo pull-left" src="'+photo+'"><div class="name">'+driver.name+'</div><div class="data clearfix"><div class="pull-left">Invitaciones: <span class="invitation">'+num_invitations+'</span></div><div class="pull-right"><i class="fa fa-clock-o"></i> <span class="active">'+update+'</span></div></div>'); $('#drivers_list').append(item);
	
		item.click(function(){
			modal_driver_details(driver.id);
		});
	}
}

function update_connected_count() {
	var connected = $('#drivers_list .item');
	var num = connected.length;
	$('#active_drivers').text(num);
}


function select_driver(driver_id) {
	driver = _.find(drivers, function(r){ return r.id == driver_id; });
	return driver;
}

var servertime = 0;

function upload_servertime() {
	var offsetRef = new Firebase('https://'+myradio.fb_ref+'.firebaseio.com/.info/serverTimeOffset');
	offsetRef.on("value", function(snap) {
	  var offset = snap.val();
	  servertime = new Date().getTime() + offset;
	});
}

function active_time(update) {
	var salida='--';
	if(update!=undefined){
		var meses_short=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
		var transcurso = servertime-update;
		var fecha=new Date(update);
		var transcursoEnMinutos=Math.floor(transcurso/(1000*60));
	    if(transcursoEnMinutos<=1) salida='Recién actualizado';
	    else if(transcursoEnMinutos<60) salida='Hace '+transcursoEnMinutos+' minutos';
	    else if(transcursoEnMinutos<(60*24)) salida='Hace '+Math.floor(transcursoEnMinutos/60)+' horas';
	    else if(transcursoEnMinutos<(60*24*7)) salida='Hace '+Math.floor(transcursoEnMinutos/(60*24))+' días';
	    else salida=fecha.getDate()+' de '+meses_short[fecha.getMonth()];
	}
    return salida;
}

function loadMap() {
	escaleMap();
	$.getScript('https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=getCoordenates');
}

function getCoordenates() {
    var geo = new google.maps.Geocoder();
	
    geo.geocode({'address': myradio.city}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                lat=results[0].geometry.location.lat();
                lon=results[0].geometry.location.lng();
				showMap();
            }
        }
    });
}

function showMap() {
	var map_wrapper=$('#map');
	
    var myOptions = {
      zoom: 14,
      center: new google.maps.LatLng(lat,lon),
      disableDefaultUI: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
	  styles:[{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":60}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]}]
    };
	map = new google.maps.Map(document.getElementById("map"), myOptions);
	
	loadFirebaseDrivers();
	
}

function loadFirebaseDrivers() {
	var firebase_url = 'https://'+myradio.fb_ref+'.firebaseio.com';
	var firebase_ref= new Firebase(firebase_url);
	var drivers_ref= firebase_ref.child('drivers');
	
    drivers_ref.on('value', function(snapshot) {
		if(snapshot.val() === null) {
		    alert('Sin taxistas');
		} else {
			upload_servertime();
			var firebase_drivers = snapshot.val();
			$('#drivers_list').empty();
			$.each(firebase_drivers, function(index, firebase_driver) {
				driver = select_driver(firebase_driver.driver_id);
				draw_driver_sidebar(driver,firebase_driver);
				// console.log(driver);
			});
			update_connected_count();
		}
    });
	
    drivers_ref.on('child_added', function(snapshot) {
		add_driver(snapshot.val());
    });
	
    drivers_ref.on('child_changed', function(snapshot) {
		edit_driver(snapshot.val());
    });
	
    drivers_ref.on('child_removed', function(snapshot) {
		delete_driver(snapshot.val());
    });
}

function add_driver(driver) {
	console.log('Driver entra');
	if(driver.coordinates!=undefined && driver.driver_id!=undefined){
		
		var db_driver = select_driver(driver.driver_id);
		
		var coordinates = driver.coordinates.split('#');
		var marker;
		canvas= canvas_marker(true,db_driver.name);
	    marker=new google.maps.Marker({
	        position: new google.maps.LatLng(coordinates[0],coordinates[1]),
	        map: map,
	        draggable: false,
	        icon: canvas.toDataURL(),
	        title: 'Taxista',
	        animation: google.maps.Animation.DROP,
	        id:driver.driver_id
	    });
		marker.driver_id = driver.driver_id;
	    google.maps.event.addListener(marker, 'click', function() {
			modal_driver_details(this.driver_id);
	    });
		
		var new_marker = {'driver_id':driver.driver_id, 'licence_id':driver.licence_id, 'marker':marker};
		markers[driver.driver_id] = new_marker;
	
		relativeZoom();
	}
}

function relativeZoom() {
	var latlngbounds = new google.maps.LatLngBounds();
	
	$.each(markers, function(index, themarker) {
		if(themarker!=undefined){
			var pos = themarker.marker.position;
			console.log(pos);
			latlngbounds.extend(pos);
			map.setCenter(latlngbounds.getCenter());
			map.fitBounds(latlngbounds); 
		}
	});
}


function edit_driver(driver) {
	console.log('Driver cambia');
	the_marker = markers[driver.driver_id];
	if(the_marker!=undefined && driver.coordinates!=undefined){
		var coordinates = driver.coordinates.split('#');
		var latlng = new google.maps.LatLng(coordinates[0],coordinates[1]);
		markers[driver.driver_id].marker.setPosition(latlng);
		// relativeZoom();
	}
	else add_driver(driver);
}

function delete_driver(driver) {
	console.log('Driver desconecta');
	the_marker = markers[driver.driver_id];
	if(the_marker!=undefined){
		markers[driver.driver_id].marker.setMap(null);
		delete markers[driver.driver_id];
		// relativeZoom();
	}
}


function canvas_marker(libre,id){
    canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 26;
    if (libre) color="rgba(253, 183, 0,0.8)";
    else color="rgba(211,98,97,0.8)";
    ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0,0, 120, 20);
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
    ctx.fillText(id,5,14,110);
    ctx.fillStyle = "rgba(255,255,0,1)";
    return canvas;
}

