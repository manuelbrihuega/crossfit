function get_content() {
	$.getScript('https://cdn.firebase.com/js/client/1.0.11/firebase.js', function(){
		$.getScript(media_url+'js/aux/sound.js', function(){
			$.getScript(media_url+'js/aux/modals.js', function(){
				$.getScript(media_url+'js/aux/journeys.js', function(){
					$.getScript(media_url+'js/aux/date.js', function(){
					$.getScript(media_url+'js/lib/jquery.keypad.min.js', function(){
					$.getScript(media_url+'js/lib/jquery.keypad-es.js', function(){
						$.post(base_url+'/partials/dashboard_viewer', function(template, textStatus, xhr) {
							$('#main').html(template);
							loadRadio();
							loadGuard();
							startWakeup();
							startStatus();
						});
					});
					});
					});
				});
			});
		});
	});

}

var myradio=false;
var guard=false;
var firebase_url=false;
var firebase_ref=false;
var journeys_ref=false;
var reservations_ref=false;

function loadRadio() {
	$.getJSON(api_url+'radios/get?callback=?', {}, function(data){
		if(data.status=='success'){
			myradio = data.data;
			firebase_updating();
			checkhash();
		}
		else super_error('Radio info failure');
	});
}

function loadGuard () {
	guard = window.open(base_url+'/guard', "Guard", "location=0,status=0,scrollbars=0,width=200,height=220");
	guard.moveTo(5000,5000);
	window.focus();
}

window.onbeforeunload = function(event){
    var mensaje='Las solicitudes de servicios no se atenderán';
    if(typeof event == 'undefined') event = window.event;
    if(event) event.returnValue=mensaje;
    return mensaje;
}

// Firebase
function firebase_updating() {
	firebase_url = 'https://'+myradio.fb_ref+'.firebaseio.com';
	firebase_ref= new Firebase(firebase_url);
	journeys_ref= firebase_ref.child('journeys');
	reservations_ref= firebase_ref.child('reservations');
	journeys_updating();
}

function journeys_updating() {
    journeys_ref.on('value', function(snapshot) {
       load_pending(); 
	   load_reservations();
    });
}

function load_pending() {
	$.getJSON(api_url+'radios/pending_journeys?callback=?', {offset:local_offset}, function(data){
		if(data.status=='success'){
			var num = data.data.journeys.length;
			if(num>0){
				$('#badge_viewer_pending').text(num).fadeIn();
				play_sound('incoming_journey.mp3');
				if(!$('#viewer_submenu .button.pending').hasClass('active')) subselect('pending');
			}
			else{
				$('#badge_viewer_pending').text(num).fadeOut();
			}
			if($('#viewer_submenu .button.pending').hasClass('active')){
				startPending();
			}
			
		}
		else{}
	});
}

function load_reservations() {
	var no_visited = false;
	$.getJSON(api_url+'radios/reservations?callback=?', {offset:local_offset}, function(data){
		if(data.status=='success'){
			var num = data.data.journeys.length;
			if(num>0){
				$('#badge_viewer_reservations').text(num).fadeIn();
				$.each(data.data.journeys, function(index, journey) {
					if(!journey.visited){
						no_visited = true;
					}
				});
				if(no_visited){
					play_sound('reserva.mp3');
				}
			}
			else{
				$('#badge_viewer_reservations').text(num).fadeOut();
			}
			if($('#viewer_submenu .button.reservations').hasClass('active')){
				startReservations();
			}
			
		}
		else{}
	});
}



// HASH
function checkhash() {
	var hash = window.location.hash.substring(1);
	if(hash.length>0) subselect(hash);
	else subselect('pending');
}

function subselect(subseccion) {
	sethash(subseccion);
	$('#viewer_submenu .button').removeClass('active');
	$('#viewer_submenu .button.'+subseccion).addClass('active');
	$('#submain').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	
	switch (subseccion) {
		case 'pending': 	startPending(); break;
		case 'reservations':startReservations(); break;
		case 'historical': 	startHistorical(); break;
		default: 			subselect('pending');
	}
}


// PENDING
function startPending() {
	$.getJSON(api_url+'radios/pending_journeys?callback=?', {offset:local_offset}, function(data){
		if(data.status=='success'){

			if(data.data.journeys.length>0){
				var wrapper = $('<div></div>').attr({'class':'journeys_viewer_list'});
				$('#submain').html(wrapper);
				$.each(data.data.journeys, function(index, journey) {
					draw_journey_viewer(journey, wrapper, true);
				});
			}
			else $('#submain').empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin carreras pendientes</div></div>');

			
		}
		else super_error('Pending failure');
	});
	
}



function viewer_assign_journey(id) {
	var licence = $('#licence_assigned').val();
	$('#viewer_assign_button').html('<i class="fa fa-cog fa-spin"></i>');
	$.getJSON(api_url+'journeys/assigned_viewer?callback=?', {id:id,licence:licence}, function(data){
		if(data.status=='success') launch_alert('<i class="fa fa-smile-o"></i> Carrera assignada','');
		else launch_alert('<i class="fa fa-frown-o"></i> Error al asignar carrera','warning');
		$('#assign_journey_modal').modal('hide');
	});
}

function viewer_cancel_journey(id) {
	var reason = $('#reason_cancelation').val();
	$('#viewer_cancel_button').html('<i class="fa fa-cog fa-spin"></i>');
	$.getJSON(api_url+'journeys/canceled_viewer?callback=?', {id:id,reason_cancelation:reason}, function(data){
		if(data.status=='success')launch_alert('<i class="fa fa-smile-o"></i> Carrera cancelada','');
		else launch_alert('<i class="fa fa-frown-o"></i> Error al cancelar carrera','warning');
		$('#cancel_journey_modal').modal('hide');
	});
}


//RESERVATIONS
function startReservations() {
	$.getJSON(api_url+'radios/reservations?callback=?', {offset:local_offset}, function(data){
		if(data.status=='success'){

			if(data.data.journeys.length>0){
				var wrapper = $('<div></div>').attr({'class':'journeys_viewer_list'});
				$('#submain').html(wrapper);
				$.each(data.data.journeys, function(index, journey) {
					console.log(journey);
					draw_journey_viewer(journey, wrapper, false);
				});
				
				$.getJSON(api_url+'radios/visit_reservations?callback=?');
				
			}
			else $('#submain').empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin reservas</div></div>');

			
		}
		else super_error('Pending failure');
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
			////console.log(data.data);
			
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





var timerStatus;
var counterStatus;
var viewer_counter=false;

function startStatus () {
    clearTimeout(timerStatus);
    counterStatus=30;
    goStatus();
	drawStatus();
}

function drawStatus() {
	if(!viewer_counter){
		viewer_counter = $('<div></div>').attr('id','viewer_counter'); $('#sidebar').append(viewer_counter);
		var title = $('<div></div>').attr('class','title').text('PRÓXIMA ACTUALIZACIÓN'); viewer_counter.append(title);
		var time = $('<div></div>').attr({'class':'time','id':'timecounter'}); viewer_counter.append(time);
	}
}

function goStatus() {
    if(counterStatus==-2){
		$('#timecounter').html('<i class="fa fa-refresh fa-spin"></i>');
		updateStatus();
		if(guard) guard.iniciaContador();
		firebase_updating();
		
    }else{
        timerStatus = setTimeout(function(){
			$('#timecounter').text(counterStatus);
            counterStatus--;
            goStatus();
        },1000);
    }
	$('body').attr('data-counter-status',counterStatus);
}

function updateStatus() {
	$.getJSON(api_url+'radios/update_status?callback=?', {}, function(data){
		if(data.status=='success'){
			startStatus();
		}
		else{
			window.onbeforeunload = null;
			restoreRadioViewer();
		}
	});
}



//CONTADOR DE RESETEO CADA 30 MINUTOS

var timerWakeup;
var counterWakeup;

function startWakeup () {
    clearTimeout(timerWakeup);
    counterWakeup=1800;
    goWakeup();
}

function goWakeup() {
    if(counterWakeup==-2){
		window.onbeforeunload = null;
        document.location.reload(true);
    }else{
        timerWakeup = setTimeout(function(){
            counterWakeup--;
            goWakeup();
        },1000);
    }
	$('body').attr('data-counter-wakeup',counterWakeup);
}