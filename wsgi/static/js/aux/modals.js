var map;
var markers = [];
var markers_home = [];

function newModal(id,title,foot) {
	
	if($('#'+id+'.modal').length>0) $('#'+id+'.modal').remove();
	
	var modal = $('<div></div>').attr({'class':'modal fade', 'id':id}); $('body').append(modal);
	var dialog = $('<div></div>').attr({'class':'modal-dialog'}); modal.append(dialog);
	var content = $('<div></div>').attr({'class':'modal-content'}); dialog.append(content);
	
	if(title){
		var header = $('<div></div>').attr({'class':'modal-header'}); content.append(header);
		var button = $('<button></button>').attr({'class':'close', 'type':'button', 'data-dismiss':'modal', 'aria-hidden':'true'}).html('&times;'); header.append(button);
		var h4 = $('<h4></h4>').attr({'class':'modal-title'}).text(title); header.append(h4);
	}
	
	var body = $('<div></div>').attr({'class':'modal-body'}).text('body'); content.append(body);
	
	if(foot){
		var footer = $('<div></div>').attr({'class':'modal-footer'}).text(''); content.append(footer);
	}

    modal.trigger('reveal:close');
	
	return modal;
}

function modalAddTitle(modal,title) {
	var modal_title = $(modal).find('.modal-title');
	modal_title.html(title);
	return true;
}

function modalAddBody(modal,body) {
	var modal_body = $(modal).find('.modal-body');
	modal_body.html(body);
	return true;
}

function modalAddFooter(modal,footer) {
	var modal_footer = $(modal).find('.modal-footer');
	modal_footer.html(footer);
	return true;
}

function doModalBigger(modal) {
	var modal_dialog = $(modal).find('.modal-dialog');
	modal_dialog.addClass('modal-lg');
	return true;
}

function doModalSmaller(modal) {
	var modal_dialog = $(modal).find('.modal-dialog');
	modal_dialog.addClass('modal-sm');
	return true;
}

function doModalNotPadding(modal) {
	var modal_dialog = $(modal).find('.modal-dialog');
	modal_dialog.addClass('modal-not-padding');
	return true;
}

function modal_journey_details(journey_id) {
	var mymodal=newModal('journey_details_modal',true, true);
    mymodal.attr('data-id',journey_id);
    modalAddTitle(mymodal,'');
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	
	$.getJSON(api_url+'journeys/get_foreign?callback=?', {id:journey_id, offset:local_offset}, function(data){
		if(data.status=='success'){
			var body = $('<div></div>').attr({'id':'journey_details_wrapper'});
			$.post(base_url+'/partials/modal_journey_details', function(template, textStatus, xhr) {
                var mystatus = translate_journey_status(data.data.journey.status,'es');
                mymodal.addClass(data.data.journey.status);
				body.html(template);
				modalAddBody(mymodal,body);
				$('#journey_detail_status').text('Carrera '+mystatus);
				$('#journey_detail_date').text(fecha_castellano_sin_hora(data.data.journey.date_depart));
				$('#journey_detail_time').text(getTimeFromString(data.data.journey.date_depart));
				$('#journey_detail_address').text(data.data.journey.origin.address+' '+data.data.journey.origin.postal_code+' '+data.data.journey.origin.locality);
				$('#journey_detail_origin').html('Lat.: <span>'+data.data.journey.origin.lat_origin.substring(0,10)+'</span>  Long.: <span>'+data.data.journey.origin.lon_origin.substring(0,10)+'</span>');
				
				if(data.data.journey.user.role=='U_Buttons') var role_request = 'EMPPRESA';
				else var role_request = 'PASAJERO';
				
				$('#journey_detail_user').attr({'data-id':data.data.journey.user.id}).html('<div class="title">'+role_request+'</div><strong>'+data.data.journey.user.name+' '+data.data.journey.user.surname+'</strong><br><span>'+data.data.journey.user.phone+'<br>'+data.data.journey.user.email+'</span>');
				$('#journey_detail_user').click(function(){
					modal_user_details(data.data.journey.user.id);
				});
				
				
				$('#journey_detail_radio').attr({'data-id':data.data.journey.radio.id}).html('<div class="title">RADIO</div><strong>'+data.data.journey.radio.name+'</strong><br><span>'+data.data.journey.radio.phone+'</span>');
				$('#journey_detail_radio').click(function(){
					window.location=base_url+'/radio/'+data.data.journey.radio.id;
				});
				
				if(data.data.journey.indications!='') $('#journey_detail_indications').append('<strong>Indicaciones</strong><br>"'+data.data.journey.indications+'"');
				
				$.each(data.data.journey.features, function(index, feature) {
					$('#journey_detail_details').append('<span class="item"><i class="fa fa-check-square-o"></i> '+feature.description+'</span>');
				});
				
				if(data.data.journey.distance!='0') $('#journey_detail_details').append('<span class="item"><i class="fa fa-arrows-h"></i> '+distance_to_string(data.data.journey.distance)+'</span>');
				if(data.data.journey.duration!='0') $('#journey_detail_details').append('<span class="item"><i class="fa fa-clock-o"></i> '+duration_to_string(data.data.journey.duration)+'</span>');
				if(data.data.journey.price!='0') $('#journey_detail_details').append('<span class="item"><i class="fa fa-money"></i> '+price_to_string(data.data.journey.price,data.data.journey.currency)+'</span>');
				
				add_tracing(data.data.journey);

                setTimeout(function(){update_tracing(journey_id);},5000);


				$('#minimap').attr({ 'data-lat':data.data.journey.origin.lat_origin, 'data-long':data.data.journey.origin.lon_origin});
				miniModalMap();
				
				addStatusesFooter(mymodal,data);
				
				
				
				
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos de la carrera','warning')
	});
	
	
	mymodal.on('hidden.bs.modal', function (e) {
		console.log('borrar mapa');
		removeMarkers();
		$("#minimap").remove();
	})
	
}

function modal_incidencias(){
	var mymodal=newModal('incidencias_modal',true, true);
	
	$.post(base_url+'/incidencias', function(template, textStatus, xhr) {
		modalAddBody(mymodal,template);
		modalAddTitle(mymodal,'');
		doModalBigger(mymodal);
		mymodal.modal('show');
	});
}

function modal_journey_details_operator(journey_id) {
	$.when(
		$.getScript('https://cdn.firebase.com/js/client/1.0.11/firebase.js'),
		$.getScript('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js')
	 ).then(function(){
		var mymodal=newModal('journey_details_modal',true, true);
	    mymodal.attr('data-id',journey_id);
	    modalAddTitle(mymodal,'');
		modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
		mymodal.modal('show');
		
		$.getJSON(api_url+'journeys/get_foreign?callback=?', {id:journey_id, offset:local_offset}, function(data){
			if(data.status=='success'){
				var body = $('<div></div>').attr({'id':'journey_details_wrapper'});
				$.post(base_url+'/partials/modal_journey_details', function(template, textStatus, xhr) {
	                var mystatus = translate_journey_status(data.data.journey.status,'es');
	                mymodal.addClass(data.data.journey.status);
					body.html(template);
					modalAddBody(mymodal,body);
					$('#journey_detail_status').text('Carrera '+mystatus);
					$('#journey_detail_date').text(fecha_castellano_sin_hora(data.data.journey.date_depart));
					$('#journey_detail_time').text(getTimeFromString(data.data.journey.date_depart));
					$('#journey_detail_address').text(data.data.journey.origin.address+' '+data.data.journey.origin.postal_code+' '+data.data.journey.origin.locality);
					$('#journey_detail_origin').html('Lat.: <span>'+data.data.journey.origin.lat_origin.substring(0,10)+'</span>  Long.: <span>'+data.data.journey.origin.lon_origin.substring(0,10)+'</span>');
					
					if(data.data.journey.user.role=='U_Buttons') var role_request = 'EMPPRESA';
					else var role_request = 'PASAJERO';
					
					$('#journey_detail_user').attr({'data-id':data.data.journey.user.id}).html('<div class="title">'+role_request+'</div><strong>'+data.data.journey.user.name+' '+data.data.journey.user.surname+'</strong><br><span>'+data.data.journey.user.phone+'<br>'+data.data.journey.user.email+'</span>');
					$('#journey_detail_user').click(function(){
						modal_user_details(data.data.journey.user.id);
					});
					
					
					$('#journey_detail_radio').attr({'data-id':data.data.journey.radio.id}).html('<div class="title">RADIO</div><strong>'+data.data.journey.radio.name+'</strong><br><span>'+data.data.journey.radio.phone+'</span>');
					$('#journey_detail_radio').click(function(){
						window.location=base_url+'/radio/'+data.data.journey.radio.id;
					});
					
					if(data.data.journey.indications!='') $('#journey_detail_indications').append('<strong>Indicaciones</strong><br>"'+data.data.journey.indications+'"');
					
					$.each(data.data.journey.features, function(index, feature) {
						$('#journey_detail_details').append('<span class="item"><i class="fa fa-check-square-o"></i> '+feature.description+'</span>');
					});
					
					if(data.data.journey.distance!='0') $('#journey_detail_details').append('<span class="item"><i class="fa fa-arrows-h"></i> '+distance_to_string(data.data.journey.distance)+'</span>');
					if(data.data.journey.duration!='0') $('#journey_detail_details').append('<span class="item"><i class="fa fa-clock-o"></i> '+duration_to_string(data.data.journey.duration)+'</span>');
					if(data.data.journey.price!='0') $('#journey_detail_details').append('<span class="item"><i class="fa fa-money"></i> '+price_to_string(data.data.journey.price,data.data.journey.currency)+'</span>');
					
					add_tracing(data.data.journey);

	                setTimeout(function(){update_tracing(journey_id);},5000);


					$('#minimap').attr({ 'data-lat':data.data.journey.origin.lat_origin, 'data-long':data.data.journey.origin.lon_origin});
					miniModalMap();
					
					addStatusesFooter(mymodal,data);
					if(data.data.journey.status=='assigned' || data.data.journey.status=='picked' || data.data.journey.status=='accepted'){





						var firebase_url = 'https://'+radio.fb_ref+'.firebaseio.com';
						var firebase_ref= new Firebase(firebase_url);
						var drivers_ref= firebase_ref.child('drivers');
		
	    				drivers_ref.once('value', function(snapshot) {
							var firebase_drivers = snapshot.val();
							$.each(firebase_drivers, function(index, firebase_driver) {
								if(firebase_driver.driver_id==data.data.journey.driver.driver_id){
									if(firebase_driver.coordinates!=undefined && firebase_driver.driver_id!=undefined){
										var coordinates = firebase_driver.coordinates.split('#');
										var marker;
										canvas= canvas_marker(true,data.data.journey.driver.licence);
		    							marker=new google.maps.Marker({
		        							position: new google.maps.LatLng(coordinates[0],coordinates[1]),
		        							map: map,
		        							draggable: false,
		        							icon: canvas.toDataURL(),
		        							title: data.data.journey.driver.name,
		        							id:firebase_driver.driver_id
		    							});
										marker.driver_id = firebase_driver.driver_id;
		    							google.maps.event.addListener(marker, 'click', function() {
											modal_driver_details(this.driver_id);
		    							});
		    							markers[firebase_driver.driver_id] = marker;
		    						}
								}
							});
						});







					}
					
					
					
				});
			}
			else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos de la carrera','warning')
		});
		
		
		mymodal.on('hidden.bs.modal', function (e) {
			console.log('borrar mapa');
		})
	});
	
}

function modal_journey_details_operator_home(journey_id) {
	$.when(
		$.getScript('https://cdn.firebase.com/js/client/1.0.11/firebase.js'),
		$.getScript('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js')
	 ).then(function(){
		var mymodal=newModal('journey_details_modal',true, true);
	    mymodal.attr('data-id',journey_id);
	    modalAddTitle(mymodal,'');
		modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
		mymodal.modal('show');
		
		$.getJSON(api_url+'journeys/get_foreign?callback=?', {id:journey_id, offset:local_offset}, function(data){
			if(data.status=='success'){
				var body = $('<div></div>').attr({'id':'journey_details_wrapper'});
				$.post(base_url+'/partials/modal_journey_details', function(template, textStatus, xhr) {
	                var mystatus = translate_journey_status(data.data.journey.status,'es');
	                mymodal.addClass(data.data.journey.status);
					body.html(template);
					modalAddBody(mymodal,body);
					$('#journey_detail_status').text('Carrera '+mystatus);
					$('#journey_detail_date').text(fecha_castellano_sin_hora(data.data.journey.date_depart));
					$('#journey_detail_time').text(getTimeFromString(data.data.journey.date_depart));
					$('#journey_detail_address').text(data.data.journey.origin.address+' '+data.data.journey.origin.postal_code+' '+data.data.journey.origin.locality);
					$('#journey_detail_origin').html('Lat.: <span>'+data.data.journey.origin.lat_origin.substring(0,10)+'</span>  Long.: <span>'+data.data.journey.origin.lon_origin.substring(0,10)+'</span>');
					
					if(data.data.journey.user.role=='U_Buttons') var role_request = 'EMPPRESA';
					else var role_request = 'PASAJERO';
					
					$('#journey_detail_user').attr({'data-id':data.data.journey.user.id}).html('<div class="title">'+role_request+'</div><strong>'+data.data.journey.user.name+' '+data.data.journey.user.surname+'</strong><br><span>'+data.data.journey.user.phone+'<br>'+data.data.journey.user.email+'</span>');
					$('#journey_detail_user').click(function(){
						modal_user_details(data.data.journey.user.id);
					});
					
					
					$('#journey_detail_radio').attr({'data-id':data.data.journey.radio.id}).html('<div class="title">RADIO</div><strong>'+data.data.journey.radio.name+'</strong><br><span>'+data.data.journey.radio.phone+'</span>');
					$('#journey_detail_radio').click(function(){
						window.location=base_url+'/radio/'+data.data.journey.radio.id;
					});
					
					if(data.data.journey.indications!='') $('#journey_detail_indications').append('<strong>Indicaciones</strong><br>"'+data.data.journey.indications+'"');
					
					$.each(data.data.journey.features, function(index, feature) {
						$('#journey_detail_details').append('<span class="item"><i class="fa fa-check-square-o"></i> '+feature.description+'</span>');
					});
					
					if(data.data.journey.distance!='0') $('#journey_detail_details').append('<span class="item"><i class="fa fa-arrows-h"></i> '+distance_to_string(data.data.journey.distance)+'</span>');
					if(data.data.journey.duration!='0') $('#journey_detail_details').append('<span class="item"><i class="fa fa-clock-o"></i> '+duration_to_string(data.data.journey.duration)+'</span>');
					if(data.data.journey.price!='0') $('#journey_detail_details').append('<span class="item"><i class="fa fa-money"></i> '+price_to_string(data.data.journey.price,data.data.journey.currency)+'</span>');
					
					add_tracing(data.data.journey);

	                setTimeout(function(){update_tracing_home(journey_id);},5000);


					$('#minimap').attr({ 'data-lat':data.data.journey.origin.lat_origin, 'data-long':data.data.journey.origin.lon_origin});
					miniModalMapHome();
					
					addStatusesFooter(mymodal,data);
					if(data.data.journey.status=='assigned' || data.data.journey.status=='picked' || data.data.journey.status=='accepted'){





						var firebase_url = 'https://'+radio.fb_ref+'.firebaseio.com';
						var firebase_ref= new Firebase(firebase_url);
						var drivers_ref= firebase_ref.child('drivers');
		
	    				drivers_ref.once('value', function(snapshot) {
							var firebase_drivers = snapshot.val();
							$.each(firebase_drivers, function(index, firebase_driver) {
								if(firebase_driver.driver_id==data.data.journey.driver.driver_id){
									if(firebase_driver.coordinates!=undefined && firebase_driver.driver_id!=undefined){
										var coordinates = firebase_driver.coordinates.split('#');
										var marker;
										canvas= canvas_marker(true,data.data.journey.driver.licence);
		    							marker=new google.maps.Marker({
		        							position: new google.maps.LatLng(coordinates[0],coordinates[1]),
		        							map: map,
		        							draggable: false,
		        							icon: canvas.toDataURL(),
		        							title: data.data.journey.driver.name,
		        							id:firebase_driver.driver_id
		    							});
										marker.driver_id = firebase_driver.driver_id;
		    							google.maps.event.addListener(marker, 'click', function() {
											modal_driver_details(this.driver_id);
		    							});
		    							markers_home[firebase_driver.driver_id] = marker;
		    						}
								}
							});
						});







					}
					
					
					
				});
			}
			else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos de la carrera','warning')
		});
		
		
		mymodal.on('hidden.bs.modal', function (e) {
			console.log('borrar mapa');
		})
	});
	
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


function add_tracing(journey){
    if(journey.date_created!='') $('#journey_detail_tracing').append('<div class="item">Creada: '+fecha_con_hora(journey.date_created)+' desde '+journey.source+'</div>');
    if(journey.date_created!=journey.date_depart) $('#journey_detail_tracing').append('<div class="item">Reserva: '+fecha_con_hora(journey.date_depart)+'</div>');

    if(journey.list_rejections.length>0) {

        for(var r=0;r<journey.list_rejections.length;r++){
            $('#journey_detail_tracing').append('<div class="item" data-id="'+journey.list_rejections[r].id+'">Rechazado: '+journey.list_rejections[r].driver+' ('+journey.list_rejections[r].licence+') '+fecha_con_hora(journey.list_rejections[r].date)+'</div>');
        }
    }
	if(journey.jumps>0) $('#journey_detail_tracing').append('<div class="item jumps">Saltos en búsqueda de taxistas: '+journey.jumps+'</div>');
    
    if(journey.guest_drivers!=''){
    	var cadena = journey.guest_drivers.substring(0, journey.guest_drivers.length-1);
    	var res = cadena.split(",");
    	var contadorsaltos = 0;
    	var listaids ='';
    	for(var i=0; i<res.length; i++){
    		if(res[i].toLowerCase().indexOf("salto") >= 0){
    			//contadorsaltos++;
    			console.log("Salto");
    		}else{
    			listaids = listaids + res[i] + ','; 			
    		}
    	}
    	var listaidsdefinitiva = listaids.substring(0, listaids.length-1);

    	
    	$.getJSON(api_url+'drivers/list_by_ids?callback=?', {drivers_ids:listaidsdefinitiva}, function(data){
    		if(data.status=="success"){
    			var driversensalto =0;
    			for(var i=0; i<res.length; i++){
    				if(res[i].toLowerCase().indexOf("salto") >= 0){
    					
    					if(driversensalto==0 && i!=0){
    						$('#journey_detail_tracing').append('<div class="item detailjump jump'+contadorsaltos+'">En el Salto '+contadorsaltos+' se ha invitado a: Nadie</div>');
    					}
    					contadorsaltos++;

    					driversensalto=0;
    				}else{
    					driversensalto++;
    					for(var y=0; y<data.data.list_drivers.length; y++){
    						if(data.data.list_drivers[y].id==res[i]){
    							$('#journey_detail_tracing').append('<div class="item detailjump jump'+contadorsaltos+'">En el Salto '+contadorsaltos+' se ha invitado a: '+data.data.list_drivers[y].name+'</div>');
    						}
    					}		
    				}
    			}
    			if(res[res.length-1].toLowerCase().indexOf("salto") >= 0){
    				$('#journey_detail_tracing').append('<div class="item detailjump jump'+contadorsaltos+'">En el Salto '+contadorsaltos+' se ha invitado a: Nadie</div>');
    			}
    			
    		}
    	});		
	}
	if(journey.date_assigned!='') $('#journey_detail_tracing').append('<div class="item assigned">Asignada: '+fecha_con_hora(journey.date_assigned)+'</div>');
	if(journey.date_onway!='') $('#journey_detail_tracing').append('<div class="item onway">En camino: '+fecha_con_hora(journey.date_onway)+'</div>');
	if(journey.date_picked!='') $('#journey_detail_tracing').append('<div class="item picked">Montado: '+fecha_con_hora(journey.date_picked)+'</div>');
	if(journey.date_completed!='') $('#journey_detail_tracing').append('<div class="item completed">Completado: '+fecha_con_hora(journey.date_completed)+'</div>');
	if(journey.date_canceled!=''){
		$('#journey_detail_tracing').append('<div class="item canceled">Cancelado: '+fecha_con_hora(journey.date_canceled)+'</div>');
		$('#journey_detail_tracing').append('<div class="item reason">Info cancelación: '+journey.reason_cancelation+'</div>');
	}

	if(journey.driver!=''){
		if(journey.driver.photo!='') var photo=journey.driver.photo;
		else var photo='http://f.cl.ly/items/0Y2k2I3K373a1u2K3H1d/placeholder1.gif';

		var starts='';
		for (var i = 1; i <=journey.driver.rank; i++) {
			starts+='<i class="fa fa-star"></i>';
		}
		for (var j = 1; j <=5-journey.driver.rank; j++) {
			starts+='<i class="fa fa-star-o"></i>';
		}

		$('#journey_detail_driver').attr({'data-id':journey.driver.driver_id}).html('<div class="title">TAXISTA</div><img class="pull-left" src="'+photo+'"><strong>'+journey.driver.name+'</strong><br>'+starts+'<br>'+journey.driver.phone+'</span>');
		$('#journey_detail_driver').click(function(){
			modal_driver_details(journey.driver.driver_id);
		});
	}

	if (journey.licence!='') {
		$('#journey_detail_driver').html('<div class="title">TAXISTA</div><img class="pull-left" src="http://f.cl.ly/items/0Y2k2I3K373a1u2K3H1d/placeholder1.gif"><br><strong>Lic. '+journey.licence+'</strong><br></span>');
	}
    
}

function update_tracing(journey_id){
	console.log("update_tracing");
	removeMarkers();
	console.log('actualiza');
    if($('#journey_details_modal').css('display') == 'block' && $('#journey_details_modal').attr('data-id') == journey_id){
        $.getJSON(api_url+'journeys/get_foreign?callback=?', {id:journey_id, offset:local_offset}, function(data){
            var journey = data.data.journey;
            if(journey.list_rejections.length>0) {

                for(var r=0;r<journey.list_rejections.length;r++){
                    var found = $('#journey_detail_tracing').find('.item[data-id="'+journey.list_rejections[r].id+'"]');
                    if (found.length == 0){
                        $('#journey_detail_tracing').append('<div class="item" data-id="'+journey.list_rejections[r].id+'">Rechazado: '+journey.list_rejections[r].driver+' ('+journey.list_rejections[r].licence+') '+fecha_con_hora(journey.list_rejections[r].date)+'</div>');
                    }
                }
            }
            if(journey.jumps>0) $('#journey_detail_tracing>.jumps').html('<div class="item jumps">Saltos en búsqueda de taxistas: '+journey.jumps+'</div>');
            
            if(journey.guest_drivers!=''){
            	$('.detailjump').remove();
		    	var cadena = journey.guest_drivers.substring(0, journey.guest_drivers.length-1);
		    	var res = cadena.split(",");
		    	var contadorsaltos = 0;
		    	var listaids ='';
		    	for(var i=0; i<res.length; i++){
		    		if(res[i].toLowerCase().indexOf("salto") >= 0){
		    			//contadorsaltos++;
		    			console.log("Salto");
		    		}else{
		    			listaids = listaids + res[i] + ','; 			
		    		}
		    	}
		    	var listaidsdefinitiva = listaids.substring(0, listaids.length-1);

		    	
		    	$.getJSON(api_url+'drivers/list_by_ids?callback=?', {drivers_ids:listaidsdefinitiva}, function(data){
		    		if(data.status=="success"){
		    			var driversensalto =0;
		    			for(var i=0; i<res.length; i++){
		    				if(res[i].toLowerCase().indexOf("salto") >= 0){
		    					
		    					if(driversensalto==0 && i!=0){
		    						$('#journey_detail_tracing').append('<div class="item detailjump jump'+contadorsaltos+'">En el Salto '+contadorsaltos+' se ha invitado a: Nadie</div>');
		    					}
		    					contadorsaltos++;

		    					driversensalto=0;
		    				}else{
		    					driversensalto++;
		    					for(var y=0; y<data.data.list_drivers.length; y++){
		    						if(data.data.list_drivers[y].id==res[i]){
		    							$('#journey_detail_tracing').append('<div class="item detailjump jump'+contadorsaltos+'">En el Salto '+contadorsaltos+' se ha invitado a: '+data.data.list_drivers[y].name+'</div>');
		    						}
		    					}		
		    				}
		    			}
		    			if(res[res.length-1].toLowerCase().indexOf("salto") >= 0){
		    				$('#journey_detail_tracing').append('<div class="item detailjump jump'+contadorsaltos+'">En el Salto '+contadorsaltos+' se ha invitado a: Nadie</div>');
		    			}
		    			
		    		}
		    	});		
			}
			if(journey.date_assigned!='' && $('#journey_detail_tracing').find('.assigned').length == 0) $('#journey_detail_tracing').append('<div class="item assigned">Asignada: '+fecha_con_hora(journey.date_assigned)+'</div>');
            if(journey.date_onway!='' && $('#journey_detail_tracing').find('.onway').length == 0) $('#journey_detail_tracing').append('<div class="item onway">En camino: '+fecha_con_hora(journey.date_onway)+'</div>');
            if(journey.date_picked!='' && $('#journey_detail_tracing').find('.picked').length == 0) $('#journey_detail_tracing').append('<div class="item picked">Montado: '+fecha_con_hora(journey.date_picked)+'</div>');
            if(journey.date_completed!='' && $('#journey_detail_tracing').find('.completed').length == 0) $('#journey_detail_tracing').append('<div class="item completed">Completado: '+fecha_con_hora(journey.date_completed)+'</div>');
            if(journey.date_canceled!='' && $('#journey_detail_tracing').find('.canceled').length == 0){
				$('#journey_detail_tracing').append('<div class="item canceled">Cancelado: '+fecha_con_hora(journey.date_canceled)+'</div>');
				$('#journey_detail_tracing').append('<div class="item reason">Info cancelación: '+journey.reason_cancelation+'</div>');
			}

            if(journey.driver!='' && !$('#journey_detail_driver').attr('data-id')){
                if(journey.driver.photo!='') var photo=journey.driver.photo;
                else var photo='http://f.cl.ly/items/0Y2k2I3K373a1u2K3H1d/placeholder1.gif';

                var starts='';
                for (var i = 1; i <=journey.driver.rank; i++) {
                    starts+='<i class="fa fa-star"></i>';
                }
                for (var j = 1; j <=5-journey.driver.rank; j++) {
                    starts+='<i class="fa fa-star-o"></i>';
                }

		        $('#journey_detail_driver').attr({'data-id':journey.driver.driver_id}).html('<div class="title">TAXISTA</div><img class="pull-left" src="'+photo+'"><strong>'+journey.driver.name+'</strong><br>'+starts+'<br>'+journey.driver.phone+'</span>');
		        $('#journey_detail_driver').click(function(){
		            modal_driver_details(journey.driver.driver_id);
		        });
            }

            if (journey.licence!='') {
                $('#journey_detail_driver').html('<div class="title">TAXISTA</div><img class="pull-left" src="http://f.cl.ly/items/0Y2k2I3K373a1u2K3H1d/placeholder1.gif"><br><strong>Lic. '+journey.licence+'</strong><br></span>');
            }
            if(data.data.journey.status=='assigned' || data.data.journey.status=='picked' || data.data.journey.status=='accepted'){





						var firebase_url = 'https://'+radio.fb_ref+'.firebaseio.com';
						var firebase_ref= new Firebase(firebase_url);
						var drivers_ref= firebase_ref.child('drivers');
		
	    				drivers_ref.once('value', function(snapshot) {
							var firebase_drivers = snapshot.val();
							$.each(firebase_drivers, function(index, firebase_driver) {
								if(firebase_driver.driver_id==data.data.journey.driver.driver_id){
									if(firebase_driver.coordinates!=undefined && firebase_driver.driver_id!=undefined){
										var coordinates = firebase_driver.coordinates.split('#');
										var marker;
										canvas= canvas_marker(true,data.data.journey.driver.licence);
		    							marker=new google.maps.Marker({
		        							position: new google.maps.LatLng(coordinates[0],coordinates[1]),
		        							map: map,
		        							draggable: false,
		        							icon: canvas.toDataURL(),
		        							title: data.data.journey.driver.name,
		        							id:firebase_driver.driver_id
		    							});
										marker.driver_id = firebase_driver.driver_id;
		    							google.maps.event.addListener(marker, 'click', function() {
											modal_driver_details(this.driver_id);
		    							});
		    							markers[firebase_driver.driver_id] = marker;
		    						}
								}
							});
						});







					}
            setTimeout(function(){update_tracing(journey_id);},5000);
        });



    }

}

function update_tracing_home(journey_id){
	console.log("update_tracing_home");
	removeMarkersHome();
	console.log('actualiza');
    if($('#journey_details_modal').css('display') == 'block' && $('#journey_details_modal').attr('data-id') == journey_id){
        $.getJSON(api_url+'journeys/get_foreign?callback=?', {id:journey_id, offset:local_offset}, function(data){
            var journey = data.data.journey;
            if(journey.list_rejections.length>0) {

                for(var r=0;r<journey.list_rejections.length;r++){
                    var found = $('#journey_detail_tracing').find('.item[data-id="'+journey.list_rejections[r].id+'"]');
                    if (found.length == 0){
                        $('#journey_detail_tracing').append('<div class="item" data-id="'+journey.list_rejections[r].id+'">Rechazado: '+journey.list_rejections[r].driver+' ('+journey.list_rejections[r].licence+') '+fecha_con_hora(journey.list_rejections[r].date)+'</div>');
                    }
                }
            }
            if(journey.jumps>0) $('#journey_detail_tracing>.jumps').html('<div class="item jumps">Saltos en búsqueda de taxistas: '+journey.jumps+'</div>');
            
            if(journey.guest_drivers!=''){
            	$('.detailjump').remove();
		    	var cadena = journey.guest_drivers.substring(0, journey.guest_drivers.length-1);
		    	var res = cadena.split(",");
		    	var contadorsaltos = 0;
		    	var listaids ='';
		    	for(var i=0; i<res.length; i++){
		    		if(res[i].toLowerCase().indexOf("salto") >= 0){
		    			//contadorsaltos++;
		    			console.log("Salto");
		    		}else{
		    			listaids = listaids + res[i] + ','; 			
		    		}
		    	}
		    	var listaidsdefinitiva = listaids.substring(0, listaids.length-1);

		    	
		    	$.getJSON(api_url+'drivers/list_by_ids?callback=?', {drivers_ids:listaidsdefinitiva}, function(data){
		    		if(data.status=="success"){
		    			var driversensalto =0;
		    			for(var i=0; i<res.length; i++){
		    				if(res[i].toLowerCase().indexOf("salto") >= 0){
		    					
		    					if(driversensalto==0 && i!=0){
		    						$('#journey_detail_tracing').append('<div class="item detailjump jump'+contadorsaltos+'">En el Salto '+contadorsaltos+' se ha invitado a: Nadie</div>');
		    					}
		    					contadorsaltos++;

		    					driversensalto=0;
		    				}else{
		    					driversensalto++;
		    					for(var y=0; y<data.data.list_drivers.length; y++){
		    						if(data.data.list_drivers[y].id==res[i]){
		    							$('#journey_detail_tracing').append('<div class="item detailjump jump'+contadorsaltos+'">En el Salto '+contadorsaltos+' se ha invitado a: '+data.data.list_drivers[y].name+'</div>');
		    						}
		    					}		
		    				}
		    			}
		    			if(res[res.length-1].toLowerCase().indexOf("salto") >= 0){
		    				$('#journey_detail_tracing').append('<div class="item detailjump jump'+contadorsaltos+'">En el Salto '+contadorsaltos+' se ha invitado a: Nadie</div>');
		    			}
		    			
		    		}
		    	});		
			}
			if(journey.date_assigned!='' && $('#journey_detail_tracing').find('.assigned').length == 0) $('#journey_detail_tracing').append('<div class="item assigned">Asignada: '+fecha_con_hora(journey.date_assigned)+'</div>');
            if(journey.date_onway!='' && $('#journey_detail_tracing').find('.onway').length == 0) $('#journey_detail_tracing').append('<div class="item onway">En camino: '+fecha_con_hora(journey.date_onway)+'</div>');
            if(journey.date_picked!='' && $('#journey_detail_tracing').find('.picked').length == 0) $('#journey_detail_tracing').append('<div class="item picked">Montado: '+fecha_con_hora(journey.date_picked)+'</div>');
            if(journey.date_completed!='' && $('#journey_detail_tracing').find('.completed').length == 0) $('#journey_detail_tracing').append('<div class="item completed">Completado: '+fecha_con_hora(journey.date_completed)+'</div>');
            if(journey.date_canceled!='' && $('#journey_detail_tracing').find('.canceled').length == 0){
				$('#journey_detail_tracing').append('<div class="item canceled">Cancelado: '+fecha_con_hora(journey.date_canceled)+'</div>');
				$('#journey_detail_tracing').append('<div class="item reason">Info cancelación: '+journey.reason_cancelation+'</div>');
			}

            if(journey.driver!='' && !$('#journey_detail_driver').attr('data-id')){
                if(journey.driver.photo!='') var photo=journey.driver.photo;
                else var photo='http://f.cl.ly/items/0Y2k2I3K373a1u2K3H1d/placeholder1.gif';

                var starts='';
                for (var i = 1; i <=journey.driver.rank; i++) {
                    starts+='<i class="fa fa-star"></i>';
                }
                for (var j = 1; j <=5-journey.driver.rank; j++) {
                    starts+='<i class="fa fa-star-o"></i>';
                }

		        $('#journey_detail_driver').attr({'data-id':journey.driver.driver_id}).html('<div class="title">TAXISTA</div><img class="pull-left" src="'+photo+'"><strong>'+journey.driver.name+'</strong><br>'+starts+'<br>'+journey.driver.phone+'</span>');
		        $('#journey_detail_driver').click(function(){
		            modal_driver_details(journey.driver.driver_id);
		        });
            }

            if (journey.licence!='') {
                $('#journey_detail_driver').html('<div class="title">TAXISTA</div><img class="pull-left" src="http://f.cl.ly/items/0Y2k2I3K373a1u2K3H1d/placeholder1.gif"><br><strong>Lic. '+journey.licence+'</strong><br></span>');
            }
            if(data.data.journey.status=='assigned' || data.data.journey.status=='picked' || data.data.journey.status=='accepted'){





						var firebase_url = 'https://'+radio.fb_ref+'.firebaseio.com';
						var firebase_ref= new Firebase(firebase_url);
						var drivers_ref= firebase_ref.child('drivers');
		
	    				drivers_ref.once('value', function(snapshot) {
							var firebase_drivers = snapshot.val();
							$.each(firebase_drivers, function(index, firebase_driver) {
								if(firebase_driver.driver_id==data.data.journey.driver.driver_id){
									if(firebase_driver.coordinates!=undefined && firebase_driver.driver_id!=undefined){
										var coordinates = firebase_driver.coordinates.split('#');
										var marker;
										canvas= canvas_marker(true,data.data.journey.driver.licence);
		    							marker=new google.maps.Marker({
		        							position: new google.maps.LatLng(coordinates[0],coordinates[1]),
		        							map: map,
		        							draggable: false,
		        							icon: canvas.toDataURL(),
		        							title: data.data.journey.driver.name,
		        							id:firebase_driver.driver_id
		    							});
										marker.driver_id = firebase_driver.driver_id;
		    							google.maps.event.addListener(marker, 'click', function() {
											modal_driver_details(this.driver_id);
		    							});
		    							markers_home[firebase_driver.driver_id] = marker;
		    						}
								}
							});
						});







					}
            setTimeout(function(){update_tracing_home(journey_id);},5000);
        });



    }

}

function translate_journey_status(status,language){
    var result = '';
    switch (status){
        case 'pending':         result = 'pendiente'; break;
        case 'assigned':        result = 'asignada'; break;
        case 'accepted':        result = 'aceptada'; break;
        case 'picked':          result = 'recogida'; break;
        case 'completed':       result = 'completada'; break;
        case 'canceled':        result = 'cancelada'; break;
        case 'reserved':        result = 'reservada'; break;
        case 'purged':          result = 'purgada'; break;
        case 'cancelation_request': result = 'con petición de cancelación'; break;
        default:                result = '';
    }

    return result;
}


function addStatusesFooter(mymodal,data) {
	switch (myrole) {
		case 'U_Viewer_Radios': 	var role = 'viewer'; break;
		case 'U_Super': 			var role = 'super'; break;
		case 'U_Delegations': 		var role = 'delegation'; break;
		case 'U_Operators': 		var role = 'operator'; break;
		default: 					var role = '';
	}
	
	var footer = $('<div></div>').attr({'id':'journey_details_footer'});
	footer.addClass(data.data.journey.status);
	footer.addClass(role);
	
	var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
	
	if(myrole=='U_Viewer_Radios'){
		var pending = $('<button></button>').attr({'type':'button','class':'pending btn btn-default'}).text('PONER PENDIENTE'); group.append(pending);
		pending.click(function(){ setpending_journey_viewer(data.data.journey.id); });
	
		var cancel_button = $('<button></button>').attr({'type':'button','class':'cancel btn btn-default'}).text('CANCELAR'); group.append(cancel_button);
		cancel_button.click(function(){ cancel_journey_viewer(data.data.journey.id); });

        var assign_button = $('<button></button>').attr({'type':'button','class':'assign btn btn-default'}).text('ASIGNAR'); group.append(assign_button);
		assign_button.click(function(){ assign_journey_viewer(data.data.journey.id); });
	}
	
	if(myrole=='U_Super' || myrole == 'U_Delegations' || myrole == 'U_Operators'){
		var cancel_button = $('<button></button>').attr({'type':'button','class':'cancel btn btn-default'}).text('CANCELAR'); group.append(cancel_button);
		cancel_button.click(function(){ cancel_journey(data.data.journey.id); });
	
		var complete_button = $('<button></button>').attr({'type':'button','class':'complete btn btn-default'}).text('COMPLETAR'); group.append(complete_button);
		complete_button.click(function(){ complete_journey(data.data.journey.id); });

        var pending = $('<button></button>').attr({'type':'button','class':'pending btn btn-default'}).text('PONER PENDIENTE'); group.append(pending);
		pending.click(function(){ setpending_journey(data.data.journey.id); });


	}

    if(myrole == 'U_Super' || myrole == 'U_Delegations'){
        var purge = $('<button></button>').attr({'type':'button','class':'purge btn btn-default'}).text('PURGAR'); group.append(purge);
		purge.click(function(){ purge_journey(data.data.journey.id); });
    }
	
	
	
	modalAddFooter(mymodal,footer);
}



function modal_assign_journey(journey_id) {
	var mymodal=newModal('assign_journey_modal',false, true);
	doModalSmaller(mymodal);
	modalAddBody(mymodal,'<br><input type="text" class="form-control" placeholder="Número de licencia (opcional)" id="licence_assigned">');
	mymodal.modal('show');
	
	
	var footer = $('<div></div>').attr({'id':'assign_journey_footer'});
	var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
	var cancel = $('<button></button>').attr({'type':'button','class':'assign btn btn-default', 'id':'viewer_assign_button'}).text('ASIGNAR CARRERA'); group.append(cancel);
	cancel.click(function(){ viewer_assign_journey(journey_id); });
	modalAddFooter(mymodal,footer);
}

function modal_cancel_journey(journey_id,pasajero) {
	var mymodal=newModal('cancel_journey_modal',false, false);
	doModalSmaller(mymodal);
	
	var form = $('<form></form>').attr({'role':'form'}).css({'margin-top':'30px'});
	var group = $('<div></div>').attr({'class':'group'}); form.append(group);
	var input = $('<input>').attr({'class':'form-control', 'type':'text', 'id':'reason_cancelation','placeholder':'Escribe motivo (Opcional)'}); group.append(input);
	if(pasajero) input.val('Cancelado por el pasajero');
	var separator = $('<div></div>').css({'margin-top':'20px','text-align':'center'}); form.append(separator);
	var button = $('<button></button>').attr({'type':'submit','class':'btn btn-default','id':'viewer_cancel_button'}).text('CANCELAR CARRERA'); separator.append(button);
	
	
	
	form.submit(false).submit(function(e){
		viewer_cancel_journey(journey_id);
		return false;
	});
	
	modalAddBody(mymodal,form);
	mymodal.modal('show');
	
	mymodal.on('shown.bs.modal', function (e) {
	  input.focus();
	})
	
	
	
	// var footer = $('<div></div>').attr({'id':'cancel_journey_footer'});
	// var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
	// var cancel = $('<button></button>').attr({'type':'button','class':'cancel btn btn-default', 'id':'viewer_cancel_button'}).text('CANCELAR CARRERA'); group.append(cancel);
	// cancel.click(function(){ viewer_cancel_journey(journey_id); });
	// modalAddFooter(mymodal,footer);
}




function modal_user_details(auth_id) {
	$.getJSON( api_url+'auth/get_user?callback=?', {id:auth_id}, function(data){
		////console.log(data);
		if(data.status=='success'){
			if(data.data.role=='U_Passengers') modal_passenger_details(data.data.user_id);
			if(data.data.role=='U_Buttons') modal_enterprise_details(data.data.enterprise);
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos de usuario','warning');
	});			
}

function loadRatesDos(rate_id){
	$.getJSON(api_url+'tarifas/list_all?callback=?', {}, function(data){
        var list_tarifas=[];
        if(data.status=='success') list_tarifas=data.data.rates;
        var select=$('#passenger_rate_id');
        for(var i=0;i<list_tarifas.length;i++){
            id=list_tarifas[i].id;
            nombres=list_tarifas[i].name;
            if(rate_id==list_tarifas[i].id){
            	var option=$('<option></option>').attr({'selected':'selected','value':list_tarifas[i].id, 'data-credit-box':list_tarifas[i].credit_box, 'data-credit-wod':list_tarifas[i].credit_wod}).text(list_tarifas[i].name+" ("+list_tarifas[i].price+" €)"); select.append(option);
            }else{
            	var option=$('<option></option>').attr({'value':list_tarifas[i].id, 'data-credit-box':list_tarifas[i].credit_box, 'data-credit-wod':list_tarifas[i].credit_wod}).text(list_tarifas[i].name+" ("+list_tarifas[i].price+" €)"); select.append(option);
            }
            
        }
    });
}

function ban(auth_id) {
	$.getJSON(api_url+'auth/ban?callback=?',{id:auth_id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Cliente baneado','');
			var footer = $('.modal-footer').find('.unbanned');
			footer.removeClass('unbanned').addClass('banned');
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al banear','warning');
	});
}

function unban(auth_id) {
	$.getJSON(api_url+'auth/unban?callback=?',{id:auth_id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Cliente un-baneado','');
			var footer = $('.modal-footer').find('.banned');
			footer.removeClass('banned').addClass('unbanned');
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al un-banear','warning');
	});
}

function activate(auth_id) {
	$.getJSON(api_url+'auth/activate?callback=?',{id:auth_id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Cliente validado','');
			var footer = $('.modal-footer').find('.inactive');
			footer.removeClass('inactive').addClass('active');
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al validar','warning');
	});
}





function modal_passenger_details(passenger_id) {
	var mymodal=newModal('passenger_details_modal',true, true);
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	
	
	$.getJSON( api_url+'customers/get_foreign?callback=?', {customer_id:passenger_id}, function(data){
		if(data.status=='success'){
			var body = $('<div></div>').attr({'id':'passenger_details_wrapper'});
			$.post(base_url+'/partials/modal_passenger_details', function(template, textStatus, xhr) {
				body.html(template);
				modalAddBody(mymodal,body);
				
				$('#passenger_auth_id').val(data.data.auth_profile.auth_id);
				$('#passenger_id').val(passenger_id);
				$('#passenger_name').val(data.data.auth_profile.name);
				$('#passenger_surname').val(data.data.auth_profile.surname);
				$('#passenger_email').val(data.data.auth_profile.email);
				loadRatesDos(data.data.customer_profile.rate_id);
				$('#passenger_phone').val(data.data.auth_profile.phone);

				
				$('#passenger_nif').val(data.data.customer_profile.nif);
				var fecha=data.data.customer_profile.birthdate.split(" ");
				var fechados=fecha[0].split("-");
				var year=fechados[0];
				var mes=fechados[1];
				var dia=fechados[2];
				$('#passenger_birthdate').val(year+"-"+mes+"-"+dia);
				$('#passenger_credit_wod').val(data.data.customer_profile.credit_wod);
				$('#passenger_credit_box').val(data.data.customer_profile.credit_box);

				if(data.data.customer_profile.paid){
					$( "#passenger_paid" ).prop( "checked", true );
				}else{
					$( "#passenger_paid" ).prop( "checked", false );
				}
				if(data.data.customer_profile.test_user){
					$( "#passenger_test_user" ).prop( "checked", true );
				}else{
					$( "#passenger_test_user" ).prop( "checked", false );
				}
				if(data.data.customer_profile.vip){
					$( "#passenger_vip" ).prop( "checked", true );
				}else{
					$( "#passenger_vip" ).prop( "checked", false );
				}
				if(data.data.customer_profile.validated){
					$( "#passenger_validated" ).prop( "checked", true );
				}else{
					$( "#passenger_validated" ).prop( "checked", false );
				}
				
				
				
				var footer = $('<div></div>').attr({'id':'passenger_details_footer'});
				
				if(data.data.auth_profile.active) footer.addClass('active');
				else footer.addClass('inactive');
				
				if(data.data.auth_profile.banned) footer.addClass('banned');
				else footer.addClass('unbanned');
				
				if(myrole=='U_Super'){
				var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
				
				var ban_button = $('<button></button>').attr({'type':'button','class':'ban btn btn-default'}).text('BANEAR'); group.append(ban_button);
				ban_button.click(function(){ ban(data.data.auth_profile.auth_id); });
				
				var unban_button = $('<button></button>').attr({'type':'button','class':'unban btn btn-default'}).text('DESBANEAR'); group.append(unban_button);
				unban_button.click(function(){ unban(data.data.auth_profile.auth_id); });
				
				var activate = $('<button></button>').attr({'type':'button','class':'activate btn btn-default'}).text('VALIDAR'); group.append(activate);
				activate.click(function(){ 
					activate.html('<i class="fa fa-cog fa-spin"></i>');
					$.getJSON(api_url+'auth/activate?callback=?',{id:data.data.auth_profile.auth_id}, function(data){
						if(data.status=='success'){
							activate.html('VALIDAR');
							$('.deactivate').css('display','block');
							$('.activate').css('display','none');
							launch_alert('<i class="fa fa-smile-o"></i> Cliente validado','');
							var footer = $('.modal-footer').find('.inactive');
							footer.removeClass('inactive').addClass('active');
							if($('#todos').is(':checked')){ searchPassengers(true,false,false,false,false,'nombreDESC'); }
							if($('#pagados').is(':checked')){ searchPassengers(false,true,false,false,false,'nombreDESC'); }
							if($('#nopagados').is(':checked')){ searchPassengers(false,false,true,false,false,'nombreDESC'); }
							if($('#validados').is(':checked')){ searchPassengers(false,false,false,true,false,'nombreDESC'); }
							if($('#novalidados').is(':checked')){ searchPassengers(false,false,false,false,true,'nombreDESC'); }
						}
						else launch_alert('<i class="fa fa-frown-o"></i> Error al validar','warning');
					});

				});
				
				var deactivate = $('<button></button>').attr({'type':'button','class':'deactivate btn btn-default'}).text('INVALIDAR'); group.append(deactivate);
				deactivate.click(function(){ 
					deactivate.html('<i class="fa fa-cog fa-spin"></i>');
					$.getJSON(api_url+'auth/deactivate?callback=?',{id:data.data.auth_profile.auth_id}, function(data){
						if(data.status=='success'){
							deactivate.html('INVALIDAR');
							$('.activate').css('display','block');
							$('.deactivate').css('display','none');
							launch_alert('<i class="fa fa-smile-o"></i> Cliente invalidado','');
							var footer = $('.modal-footer').find('.inactive');
							footer.removeClass('inactive').addClass('active');
							if($('#todos').is(':checked')){ searchPassengers(true,false,false,false,false,'nombreDESC'); }
							if($('#pagados').is(':checked')){ searchPassengers(false,true,false,false,false,'nombreDESC'); }
							if($('#nopagados').is(':checked')){ searchPassengers(false,false,true,false,false,'nombreDESC'); }
							if($('#validados').is(':checked')){ searchPassengers(false,false,false,true,false,'nombreDESC'); }
							if($('#novalidados').is(':checked')){ searchPassengers(false,false,false,false,true,'nombreDESC'); }
						}
						else launch_alert('<i class="fa fa-frown-o"></i> Error al invalidar','warning');
					});

				});
				
				var delete_passenger_button = $('<button></button>').attr({'type':'button','class':'btn btn-default'}).text('ELIMINAR'); group.append(delete_passenger_button);
				delete_passenger_button.click(function(){ delete_passenger(passenger_id); });
				
				var ninja = $('<button></button>').attr({'type':'button','class':'btn btn-default'}).html('<i class="fa fa-bolt"></i> NINJA MODE'); group.append(ninja);
				ninja.click(function(){ tokin(data.data.auth_profile.token); });
				}
				modalAddFooter(mymodal,footer);
				
			});
			
			
			
			
			
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos del pasajero','warning')
	});
	

	
}



function showTarifa(tarifa_id) {
	var mymodal=newModal('tarifa_details_modal',true, true);
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	
	
	$.getJSON( api_url+'rates/get_foreign?callback=?', {id:tarifa_id}, function(data){
		if(data.status=='success'){
			var body = $('<div></div>').attr({'id':'passenger_details_wrapper'});
			$.post(base_url+'/partials/modal_tarifa_details', function(template, textStatus, xhr) {
				body.html(template);
				modalAddBody(mymodal,body);
				
				$('#tarifa_id').val(data.data.rate.id);
				$('#tarifa_name').val(data.data.rate.name);
				$('#tarifa_price').val(data.data.rate.price);
				$('#tarifa_credit_wod').val(data.data.rate.credit_wod);
				$('#tarifa_credit_box').val(data.data.rate.credit_box);
				$('#tarifa_observations').val(data.data.rate.observations);
				
				
				
				
				var footer = $('<div></div>').attr({'id':'passenger_details_footer'});
				
				
				if(myrole=='U_Super'){
				var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
				
				var delete_passenger_button = $('<button></button>').attr({'type':'button','class':'btn btn-default', 'id':'botonremove'}).text('ELIMINAR'); group.append(delete_passenger_button);
				delete_passenger_button.click(function(){ delete_tarifa(tarifa_id); });
				
				}
				modalAddFooter(mymodal,footer);
				
			});
			
			
			
			
			
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos de la tarifa','warning')
	});
	

	
}


function showActividad(actividad_id) {
	var mymodal=newModal('actividad_details_modal',true, true);
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	
	
	$.getJSON( api_url+'activities/get_foreign?callback=?', {id:actividad_id}, function(data){
		if(data.status=='success'){
			var body = $('<div></div>').attr({'id':'actividad_details_wrapper'});
			$.post(base_url+'/partials/modal_actividad_details', function(template, textStatus, xhr) {
				body.html(template);
				modalAddBody(mymodal,body);
				
				$('#actividad_id').val(data.data.activity.id);
				$('#actividad_name').val(data.data.activity.name);
				$('#actividad_description').val(data.data.activity.description);
				$('#actividad_queue_capacity').val(data.data.activity.queue_capacity);
				$('#actividad_credit_wod').val(data.data.activity.credit_wod);
				$('#actividad_credit_box').val(data.data.activity.credit_box);
				$('#actividad_max_capacity').val(data.data.activity.max_capacity);
				$('#actividad_min_capacity').val(data.data.activity.min_capacity);
				
				
				
				
				var footer = $('<div></div>').attr({'id':'actividad_details_footer'});
				
				
				if(myrole=='U_Super'){
				var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
				
				var delete_passenger_button = $('<button></button>').attr({'type':'button','class':'btn btn-default', 'id':'botonremove'}).text('ELIMINAR'); group.append(delete_passenger_button);
				delete_passenger_button.click(function(){ delete_actividad(actividad_id); });
				
				}
				modalAddFooter(mymodal,footer);
				
			});
			
			
			
			
			
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos de la actividad','warning')
	});
	

	
}



function modal_passenger_details_enterprise(passenger_id) {
	var mymodal=newModal('passenger_details_modal',true, true);
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	
	
	$.getJSON( api_url+'passengers/get_foreign?callback=?', {passenger_id:passenger_id}, function(data){
		if(data.status=='success'){
			var body = $('<div></div>').attr({'id':'passenger_details_wrapper'});
			$.post(base_url+'/partials/modal_passenger_details_enterprise', function(template, textStatus, xhr) {
				body.html(template);
				modalAddBody(mymodal,body);
				$('#passenger_auth_id').val(data.data.auth_profile.auth_id);
				$('#passenger_id').val(passenger_id);
				$('#passenger_name').html('<strong>Nombre:</strong> '+data.data.auth_profile.name+' '+data.data.auth_profile.surname+'      <strong>Email:</strong> '+data.data.auth_profile.email+'      <strong>Teléfono:</strong> '+data.data.auth_profile.prefix+data.data.auth_profile.phone);
				
				$.getJSON( api_url+'passengers/all_journeys_enterprise?callback=?', {passenger_id:passenger_id, offset:local_offset}, function(data){
					if(data.status=='success'){
						
						var table_wrapper=$('<div></div>').attr('class','table-responsive'); $('#passenger_detail_journeys').html(table_wrapper);
							var table=$('<table></table>').attr('class','table  table-condensed sortable'); table_wrapper.append(table);
								table.attr('id','tableToOrder');
								var thead=$('<thead></thead>'); table.append(thead);
									var tr=$('<tr></tr>'); thead.append(tr);
										var th=$('<th></th>').text('Fecha'); th.css('cursor','pointer'); tr.append(th);
										var th=$('<th></th>').text('Dirección'); th.css('cursor','pointer'); tr.append(th);
										var th=$('<th></th>').text('Taxista'); th.css('cursor','pointer'); tr.append(th);
										var th=$('<th></th>').text('Precio'); th.css('cursor','pointer'); tr.append(th);
										var th=$('<th></th>').text('Distancia'); th.css('cursor','pointer'); tr.append(th);
										var th=$('<th></th>').text('Duración'); th.css('cursor','pointer'); tr.append(th);
		
								var tbody=$('<tbody></tbody>'); table.append(tbody);
								$('.table-responsive').css('max-height', '340px');
								$('.table-responsive').css('overflow', 'auto');
								$.each(data.data.journeys, function(index, journey) {
									
									var tr=$('<tr></tr>').attr({'class':journey.status, 'data-id':journey.id}); tbody.append(tr);
											var td=$('<td></td>').text(journey.date_depart); tr.append(td);
											var td=$('<td></td>').text(journey.origin); tr.append(td);
											var td=$('<td></td>').text(journey.driver); tr.append(td);
											if(journey.driver_id!='--'){
												td.attr('onclick','modal_driver_operator_details('+journey.driver_id+');');
												td.css('cursor','pointer');
											}
											var td=$('<td sorttable_customkey=\"'+journey.price+'\"></td>').text(price_to_string(journey.price,journey.currency)); tr.append(td);
											var td=$('<td sorttable_customkey=\"'+journey.distance+'\"></td>').text(distance_to_string(journey.distance)); tr.append(td);
											var td=$('<td sorttable_customkey=\"'+journey.duration+'\"></td>').text(duration_to_string(journey.duration)); tr.append(td);
									
								});
						var elto = document.getElementById('tableToOrder');
						sorttable.makeSortable(elto);
						
					}
					else $('#passenger_detail_journeys').html('<center><i class="fa fa-frown-o"></i> Error al obtener carreras del usuario</center>');
				});
				
				
				var footer = $('<div></div>').attr({'id':'passenger_details_footer'});
				
				if(data.data.auth_profile.active) footer.addClass('active');
				else footer.addClass('inactive');
				
				if(data.data.auth_profile.banned) footer.addClass('banned');
				else footer.addClass('unbanned');
				
				if(myrole=='U_Super'){
				var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
				
				var ban_button = $('<button></button>').attr({'type':'button','class':'ban btn btn-default'}).text('BANEAR'); group.append(ban_button);
				ban_button.click(function(){ ban(data.data.auth_profile.auth_id); });
				
				var unban_button = $('<button></button>').attr({'type':'button','class':'unban btn btn-default'}).text('DESBANEAR'); group.append(unban_button);
				unban_button.click(function(){ unban(data.data.auth_profile.auth_id); });
				
				var activate = $('<button></button>').attr({'type':'button','class':'activate btn btn-default'}).text('ACTIVAR'); group.append(activate);
				activate.click(function(){ activate(data.data.auth_profile.auth_id); });
				
				var deactivate = $('<button></button>').attr({'type':'button','class':'deactivate btn btn-default'}).text('DESACTIVAR'); group.append(deactivate);
				deactivate.click(function(){ deactivate(data.data.auth_profile.auth_id); });
				
				var delete_passenger_button = $('<button></button>').attr({'type':'button','class':'btn btn-default'}).text('ELIMINAR'); group.append(delete_passenger_button);
				delete_passenger_button.click(function(){ delete_passenger(passenger_id); });
				
				var ninja = $('<button></button>').attr({'type':'button','class':'btn btn-default'}).html('<i class="fa fa-bolt"></i> NINJA MODE'); group.append(ninja);
				ninja.click(function(){ tokin(data.data.auth_profile.token); });
				}
				modalAddFooter(mymodal,footer);
				
			});
			
			
			
			
			
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos del pasajero','warning')
	});
	

	
}

function modal_passenger_details_operator(passenger_id) {
	var mymodal=newModal('passenger_details_modal',true, true);
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	
	
	$.getJSON( api_url+'passengers/get_foreign?callback=?', {passenger_id:passenger_id}, function(data){
		if(data.status=='success'){
			var body = $('<div></div>').attr({'id':'passenger_details_wrapper'});
			$.post(base_url+'/partials/modal_passenger_details', function(template, textStatus, xhr) {
				body.html(template);
				modalAddBody(mymodal,body);
				$('.edit_passenger_button').hide();
				$('#passenger_password').hide();
				$('#passenger_password').parent().removeClass('col-md-2');
				$('#passenger_password').parent().removeClass('form-group');
				$('#passenger_auth_id').val(data.data.auth_profile.auth_id);
				$('#passenger_id').val(passenger_id);
				$('#passenger_name').val(data.data.auth_profile.name);
				$('#passenger_surname').val(data.data.auth_profile.surname);
				$('#passenger_email').val(data.data.auth_profile.email);
				$('#passenger_prefix').val(data.data.auth_profile.prefix);
				$('#passenger_phone').val(data.data.auth_profile.phone);
				$('#passenger_name').attr('disabled', 'disabled');
				$('#passenger_surname').attr('disabled', 'disabled');
				$('#passenger_email').attr('disabled', 'disabled');
				$('#passenger_prefix').attr('disabled', 'disabled');
				$('#passenger_phone').attr('disabled', 'disabled');
				
				$.getJSON( api_url+'passengers/last_journeys_foreign?callback=?', {passenger_id:passenger_id, offset:local_offset}, function(data){
					if(data.status=='success'){
						
						var table_wrapper=$('<div></div>').attr('class','table-responsive'); $('#passenger_detail_journeys').html(table_wrapper);
							var table=$('<table></table>').attr('class','table  table-condensed'); table_wrapper.append(table);
								var thead=$('<thead></thead>'); table.append(thead);
									var tr=$('<tr></tr>'); thead.append(tr);
										var th=$('<th></th>').text('Fecha'); tr.append(th);
										var th=$('<th></th>').text('Dirección'); tr.append(th);
										var th=$('<th></th>').text('Taxista'); tr.append(th);
										var th=$('<th></th>').text('Precio'); tr.append(th);
										var th=$('<th></th>').text('Distancia'); tr.append(th);
										var th=$('<th></th>').text('Duración'); tr.append(th);
		
								var tbody=$('<tbody></tbody>'); table.append(tbody);
								
								$.each(data.data.journeys, function(index, journey) {
									
									var tr=$('<tr></tr>').attr({'class':journey.status, 'data-id':journey.id}); tbody.append(tr);
											var td=$('<td></td>').text(journey.date_depart); tr.append(td);
											var td=$('<td></td>').text(journey.origin); tr.append(td);
											var td=$('<td></td>').text(journey.driver); tr.append(td);
											if(journey.driver_id!='--'){
												td.attr('onclick','modal_driver_operator_details('+journey.driver_id+');');
												td.css('cursor','pointer');
											}
											var td=$('<td></td>').text(price_to_string(journey.price,journey.currency)); tr.append(td);
											var td=$('<td></td>').text(distance_to_string(journey.distance)); tr.append(td);
											var td=$('<td></td>').text(duration_to_string(journey.duration)); tr.append(td);
									
								});
						
						
					}
					else $('#passenger_detail_journeys').html('<center><i class="fa fa-frown-o"></i> Error al obtener carreras del usuario</center>');
				});
				
				
				var footer = $('<div></div>').attr({'id':'passenger_details_footer'});
				
				if(data.data.auth_profile.active) footer.addClass('active');
				else footer.addClass('inactive');
				
				if(data.data.auth_profile.banned) footer.addClass('banned');
				else footer.addClass('unbanned');
				
				if(myrole=='U_Super'){
				var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
				
				var ban_button = $('<button></button>').attr({'type':'button','class':'ban btn btn-default'}).text('BANEAR'); group.append(ban_button);
				ban_button.click(function(){ ban(data.data.auth_profile.auth_id); });
				
				var unban_button = $('<button></button>').attr({'type':'button','class':'unban btn btn-default'}).text('DESBANEAR'); group.append(unban_button);
				unban_button.click(function(){ unban(data.data.auth_profile.auth_id); });
				
				var activate = $('<button></button>').attr({'type':'button','class':'activate btn btn-default'}).text('ACTIVAR'); group.append(activate);
				activate.click(function(){ activate(data.data.auth_profile.auth_id); });
				
				var deactivate = $('<button></button>').attr({'type':'button','class':'deactivate btn btn-default'}).text('DESACTIVAR'); group.append(deactivate);
				deactivate.click(function(){ deactivate(data.data.auth_profile.auth_id); });
				
				var delete_passenger_button = $('<button></button>').attr({'type':'button','class':'btn btn-default'}).text('ELIMINAR'); group.append(delete_passenger_button);
				delete_passenger_button.click(function(){ delete_passenger(passenger_id); });
				
				var ninja = $('<button></button>').attr({'type':'button','class':'btn btn-default'}).html('<i class="fa fa-bolt"></i> NINJA MODE'); group.append(ninja);
				ninja.click(function(){ tokin(data.data.auth_profile.token); });
				}
				modalAddFooter(mymodal,footer);
				
			});
			
			
			
			
			
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos del pasajero','warning')
	});
	

	
}

function delete_passenger(passenger_id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar el cliente?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'customers/delete?callback=?', {id:passenger_id}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Cliente eliminado','');
				$('#passenger_details_modal').modal('hide');
				
				// CALLABACKS
				if ( typeof searchPassengers == 'function' ) { if($('#todos').is(':checked')){ searchPassengers(true,false,false,false,false,order); }
		if($('#pagados').is(':checked')){ searchPassengers(false,true,false,false,false,order); }
		if($('#nopagados').is(':checked')){ searchPassengers(false,false,true,false,false,order); }
		if($('#validados').is(':checked')){ searchPassengers(false,false,false,true,false,order); }
		if($('#novalidados').is(':checked')){ searchPassengers(false,false,false,false,true,order); }	}
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});

	}
}

function delete_tarifa(tarifa_id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar la tarifa?');
	if (confirmacion==true)
	{
		$('#botonremove').html('<i class="fa fa-cog fa-spin"></i>');
		$.getJSON(api_url+'rates/delete?callback=?', {id:tarifa_id}, function(data){
			if(data.status=='success'){
				$('#botonremove').html('ELIMINAR');
				launch_alert('<i class="fa fa-smile-o"></i> Tarifa eliminada','');
				$('#tarifa_details_modal').modal('hide');
				searchRates();
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});

	}
}

function delete_actividad(actividad_id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar la actividad?');
	if (confirmacion==true)
	{
		$('#botonremove').html('<i class="fa fa-cog fa-spin"></i>');
		$.getJSON(api_url+'activities/delete?callback=?', {id:actividad_id}, function(data){
			if(data.status=='success'){
				$('#botonremove').html('ELIMINAR');
				launch_alert('<i class="fa fa-smile-o"></i> Actividad eliminada','');
				$('#actividad_details_modal').modal('hide');
				searchActivities();
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});

	}
}

function eliminarReserva(id,obj) {
	var confirmacion=confirm('¿Seguro que quieres eliminar la reserva de este cliente?');
	if (confirmacion==true)
	{
		$(obj).parent().html('<i class="fa fa-cog fa-spin"></i>');
		$.getJSON(api_url+'schedules/delete_reservation?callback=?', {id:id}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Reserva eliminada','');
				//$('#horario_details_modal').modal('hide');
				$('#celda_'+id).remove();
				$('#tituloreservas').html('Reservas <i onclick="addReserva();" style="cursor:pointer;" class="fa fa-plus-square"></i>');
				if(parseInt($('#disponibles_cola').val())==0){
					$('#disponibles_cola').val(1);
					var ocupacol = parseInt($('#ocupadas_cola').val());
					$('#ocupadas_cola').val(ocupacol-1);
				}
				if(parseInt($('#disponibles_cola').val())>0 && parseInt($('#disponibles').val())==0){
					var discol = parseInt($('#disponibles_cola').val());
					if(parseInt($('#aforo_cola').val())>discol){
						$('#disponibles_cola').val(discol+1);
						var ocupacol = parseInt($('#ocupadas_cola').val());
						$('#ocupadas_cola').val(ocupacol-1);
					}else{
						var dis = parseInt($('#disponibles').val());
						$('#disponibles').val(dis+1);
						var ocu = parseInt($('#ocupadas').val());
						$('#ocupadas').val(ocu-1);
					}
					
				}
				if(parseInt($('#disponibles').val())>0){
					var dis = parseInt($('#disponibles').val());
					if(parseInt($('#aforo').val())>dis){
						$('#disponibles').val(dis+1);
						var ocu = parseInt($('#ocupadas').val());
						$('#ocupadas').val(ocu-1);
					}

				}
				var schedule_time_id_important = $('#idscheduletime').val();
				$('#tableweyclientes').html('<i class="fa fa-cog fa-spin"></i>');
				$.getJSON( api_url+'schedules/hay_plazas?callback=?', {id:schedule_time_id_important}, function(data){
					if(data.status=='success'){
						if(parseInt(data.data.disponibles)>0 || parseInt(data.data.disponibles_cola)>0){
							$('#tituloreservas').html('Reservas <i onclick="addReserva();" style="cursor:pointer;" class="fa fa-plus-square"></i>');
						}else{
							$('#tituloreservas').html('Reservas:');
						}
						$('#disponibles').val(data.data.disponibles);
						$('#disponibles_cola').val(data.data.disponibles_cola);
						$('#ocupadas').val(data.data.ocupadas);
						$('#ocupadas_cola').val(data.data.ocupadas_cola);
						$('#aforo').val(data.data.aforo);
						$('#aforo_cola').val(data.data.aforo_cola);
					}
					else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos de la actividad','warning')
				});
				$.getJSON( api_url+'schedules/get_foreign?callback=?', {id:schedule_time_id_important}, function(data){
					if(data.status=='success'){
						$('#tableweyclientes').html('<thead><tr><th>Nombre</th><th>Apellidos</th><th>Email</th><th>Teléfono</th><th>En cola</th><th>Acción</th></tr></thead><tbody id="tableweyclientesbody"></tbody>');
        				var cadcola = '';
						$.each(data.data.reservations, function(index, res) {
							if(res.queue==true){
								cadcola = res.position_queue+'º';
							}else{
								cadcola = 'NO';
							}
							$('#tableweyclientesbody').append('<tr id="celda_'+res.id+'" style="cursor:pointer;" data-id="'+res.id+'">'+'<td>'+res.name+'</td>'+'<td>'+res.surname+'</td>'+'<td>'+res.email+'</td>'+'<td>'+res.phone+'</td>'+'<td>'+cadcola+'</td>'+'<td><i style="cursor:pointer; font-size:18px;" onclick=eliminarReserva("'+res.id+'",this); class="fa fa-trash-o"></i></td>'+'</tr>');
						});
						$('#tableweyclientes').tablesorter();
					}
				});

			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});

	}
}

function addReserva(){
	var optionsname ='<option value="-1">-----</option>';
	var optionssurname='<option value="-1">-----</option>';
	$.getJSON(api_url+'customers/search?callback=?', {lookup:'*',filtro:'todos',order:'nombreDESC'}, function(data){
		if(data.status=='success'){
			var vector = new Array();
		    $.each(data.data.list, function(index, cus) {
		    	var controlador = false;
		    	for (var i = 0; i < vector.length; i++) {
        			if (vector[i] == cus.name) {
            			controlador=true;
        			}
    			}
    			if(!controlador){
    				vector.push(cus.name);
    				optionsname = optionsname + '<option value="'+cus.name+'">'+cus.name+'</option>';
    			}
				
			});
		
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
	
	
	var primerselect=$('<select class="name"></select>').append(optionsname);
	var segundoselect=$('<select class="surname"></select>').append(optionssurname);
	var fila = $('<tr></tr>');
	
	var primeracol = $('<td></td>').append(primerselect);
	var segundacol = $('<td></td>').append(segundoselect);
	var terceracol = $('<td></td>').append('-');
	var cuartacol = $('<td></td>').append('-');
	if($('#disponibles').val()>0){
		var quintacol = $('<td></td>').append('<select class="queue"><option value="false">NO</option></select>');	
	}
	if($('#disponibles').val()==0 && $('#disponibles_cola').val()>0){
		var quintacol = $('<td></td>').append('<select class="queue"><option value="true">SI</option></select>');	
	}
	var botonguardar=$('<i style="cursor:pointer; font-size:18px;" class="fa fa-floppy-o"></i>');
	var sextacol = $('<td></td>').append(botonguardar);
	fila.append(primeracol);
	fila.append(segundacol);
	fila.append(terceracol);
	fila.append(cuartacol);
	fila.append(quintacol);
	fila.append(sextacol);
	primerselect.change(function(){ 
		var nuevocontent = '<option value="-1">-----</option>';
		$.getJSON(api_url+'customers/search?callback=?', {lookup:$(this).val(),filtro:'todos',order:'nombreDESC'}, function(data){
			if(data.status=='success'){
				$.each(data.data.list, function(index, cusap) {
		    		nuevocontent = nuevocontent + '<option value="'+cusap.id+'">'+cusap.surname+'</option>';
				});
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		
		segundoselect.html(nuevocontent);
		});
	});
	segundoselect.change(function(){ 
		$.getJSON(api_url+'customers/get_foreign?callback=?', {customer_id:$(this).val()}, function(data){
			if(data.status=='success'){
				terceracol.html(data.data.auth_profile.email);
				cuartacol.html(data.data.auth_profile.phone);
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});
	});
	botonguardar.click(function(){
		var fila = $(this).parent().parent();
		var id_customer = fila.find('.surname').val();
		var queue = fila.find('.queue').val(); 
		var id_schedule_time = $('#idscheduletime').val();
		var disponibles = $('#disponibles').val();
		var disponibles_cola = $('#disponibles_cola').val();
		if(disponibles_cola==0 && disponibles==0){
			launch_alert('<i class="fa fa-frown-o"></i> '+'No hay plazas disponibles para esta actividad','warning');
		}else{
			$(this).parent().html('<i class="fa fa-cog fa-spin"></i>');
            $.getJSON(api_url+'schedules/add_reservation?callback=?', {schedule_time_id:id_schedule_time, customer_id:id_customer}, function(data){
				if(data.status=='success'){
					launch_alert('<i class="fa fa-smile-o"></i> Reserva añadida','');
					var schedule_time_id_important = $('#idscheduletime').val();
				$('#tableweyclientes').html('<i class="fa fa-cog fa-spin"></i>');

				$.getJSON( api_url+'schedules/hay_plazas?callback=?', {id:schedule_time_id_important}, function(data){
					if(data.status=='success'){
						if(parseInt(data.data.disponibles)>0 || parseInt(data.data.disponibles_cola)>0){
							$('#tituloreservas').html('Reservas <i onclick="addReserva();" style="cursor:pointer;" class="fa fa-plus-square"></i>');
						}else{
							$('#tituloreservas').html('Reservas:');
						}
						$('#disponibles').val(data.data.disponibles);
						$('#disponibles_cola').val(data.data.disponibles_cola);
						$('#ocupadas').val(data.data.ocupadas);
						$('#ocupadas_cola').val(data.data.ocupadas_cola);
						$('#aforo').val(data.data.aforo);
						$('#aforo_cola').val(data.data.aforo_cola);
					}
					else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos de la actividad','warning')
				});

				$.getJSON( api_url+'schedules/get_foreign?callback=?', {id:schedule_time_id_important}, function(data){
					if(data.status=='success'){
						$('#tableweyclientes').html('<thead><tr><th>Nombre</th><th>Apellidos</th><th>Email</th><th>Teléfono</th><th>En cola</th><th>Acción</th></tr></thead><tbody id="tableweyclientesbody"></tbody>');
        				var cadcola = '';
						$.each(data.data.reservations, function(index, res) {
							if(res.queue==true){
								cadcola = res.position_queue+'º';
							}else{
								cadcola = 'NO';
							}
							$('#tableweyclientesbody').append('<tr id="celda_'+res.id+'" style="cursor:pointer;" data-id="'+res.id+'">'+'<td>'+res.name+'</td>'+'<td>'+res.surname+'</td>'+'<td>'+res.email+'</td>'+'<td>'+res.phone+'</td>'+'<td>'+cadcola+'</td>'+'<td><i style="cursor:pointer; font-size:18px;" onclick=eliminarReserva("'+res.id+'",this); class="fa fa-trash-o"></i></td>'+'</tr>');
						});
						$('#tableweyclientes').tablesorter();
					}
				});

				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
				

			});
		}
	});
	//AHORA HACER FUNCION PARA GUARDAR Y EN PYTHON COLOCAR BIEN LA COLA AL ELIMINAR RESERVA
	$('#tableweyclientesbody').append(fila);
	});
}

function delete_faq(faq_id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar la FAQ?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'faqs/delete?callback=?', {faq_id:faq_id}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> FAQ eliminada','');
				$('#enterprise_details_modal').modal('hide');
				
				getFAQList();
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});

	}
}


function modal_operator_details(operator_id) {
	var mymodal=newModal('operator_details_modal',true, true);
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	
	
	$.getJSON( api_url+'operators/get_foreign?callback=?', {id:operator_id}, function(data){
		if(data.status=='success'){
			var body = $('<div></div>').attr({'id':'operator_details_wrapper'});
			$.post(base_url+'/partials/modal_operator_details', function(template, textStatus, xhr) {
				body.html(template);
				modalAddBody(mymodal,body);
				
				var operator = data.data.operator_profile;
				var myradios = data.data.list_radios;
				
				$('#operator_id').val(operator.id);
				$('#operator_extension').val(operator.extension);
				$('#operator_password').val(operator.password);
				
								
				$.getJSON( api_url+'radios/list_all?callback=?', function(data){
					if(data.status=='success'){
						
						$('#operators_linked_radios').empty();
						
						var ordenados=_.groupBy(data.data, 'country');
						$.each(ordenados, function(pais, radios) {
							var country=pais.replace(' ','_');
							$('#operators_linked_radios').append('<h3>'+pais+'</h3>');
							var wrapper=$('<div></div>').attr('class','row sublista');
							$('#operators_linked_radios').append(wrapper);
							
							
							
							$.each(radios, function(index, radio) {
								
								var sm3 = $('<div></div>').attr({'class':'col-sm-4'}); wrapper.append(sm3);
								
								if(_.find(myradios, function(r){ return r.id == radio.id; })) var clase = 'btn-warning';
								else var clase = 'btn-default';
								
								var item = $('<div></div>').attr({'class':'btn btn-xs '+clase, 'data-id':radio.id}).text(radio.name); sm3.append(item);
								
								item.click(function(){
									var boton = $(this);
									if(boton.hasClass('btn-warning')){
										var method = 'unlink';
										var oldClass = 'btn-warning';
										var newClass = 'btn-default';
									}
									else{
										var method = 'link';
										var newClass = 'btn-warning';
										var oldClass = 'btn-default';
									}
									var name = boton.text();
									boton.html('<i class="fa fa-cog fa-spin"></i>');
									$.getJSON( api_url+'operators/'+method+'?callback=?', {radio_id:radio.id, operator_id:operator.id}, function(data){
										if(data.status=='success'){
											boton.text(name).removeClass(oldClass).addClass(newClass);
											launch_alert('<i class="fa fa-frown-o"></i> Cambiado correctamente','');
										}
										else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
									});
									
								});
								
								
								
							});
							
						});
						
						
						
						
							
						
						
					}
					else $('#operators_linked_radios').html('<center><i class="fa fa-frown-o"></i> Error al obtener las radios</center>');
				});
				
				
				var footer = $('<div></div>').attr({'id':'operator_details_footer'});
				
				var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
				
				var delete_button = $('<button></button>').attr({'type':'button','class':'btn btn-default'}).text('ELIMINAR'); group.append(delete_button);
				delete_button.click(function(){ delete_operator(this, operator.id); });
				
				var ninja = $('<button></button>').attr({'type':'button','class':'btn btn-default'}).html('<i class="fa fa-bolt"></i> NINJA MODE'); group.append(ninja);
				ninja.click(function(){ tokin(data.data.auth_profile.token); });
				
				modalAddFooter(mymodal,footer);
				
			});
			
			
			
			
			
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos de la operadora','warning')
	});
	

	
}


function showHorario(id) {
	var mymodal=newModal('horario_details_modal',true, true);
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	$('#horario_details_modal .close').click(function(){
		location.reload();
	});
	
	$.getJSON( api_url+'schedules/get_foreign?callback=?', {id:id}, function(data){
		if(data.status=='success'){
			var body = $('<div></div>').attr({'id':'actividad_details_wrapper'});
			$.post(base_url+'/partials/modal_calendario_details', function(template, textStatus, xhr) {
				body.html(template);
				modalAddBody(mymodal,body);
				
                $('#nameactivity').html(data.data.schedule.activity_name);
                $('#houractivity').html('De '+data.data.schedule.time_start.split(' ')[1].split(':')[0]+':'+data.data.schedule.time_start.split(' ')[1].split(':')[1]+' a '+data.data.schedule.time_end.split(' ')[1].split(':')[0]+':'+data.data.schedule.time_end.split(' ')[1].split(':')[1]);
                $('#idactivity').val(data.data.schedule.activity_id);
                $('#idscheduletime').val(data.data.schedule.schedule_time_id);
                $('#idschedule').val(data.data.schedule.schedule_id);
	            $('#tableweyclientes').html('<thead><tr><th>Nombre</th><th>Apellidos</th><th>Email</th><th>Teléfono</th><th>En cola</th><th>Acción</th></tr></thead><tbody id="tableweyclientesbody"></tbody>');
                var cadcola = '';
				$.each(data.data.reservations, function(index, res) {
					if(res.queue==true){
						cadcola = res.position_queue+'º';
					}else{
						cadcola = 'NO';
					}
					$('#tableweyclientesbody').append('<tr id="celda_'+res.id+'" style="cursor:pointer;" data-id="'+res.id+'">'+'<td>'+res.name+'</td>'+'<td>'+res.surname+'</td>'+'<td>'+res.email+'</td>'+'<td>'+res.phone+'</td>'+'<td>'+cadcola+'</td>'+'<td><i style="cursor:pointer; font-size:18px;" onclick=eliminarReserva("'+res.id+'",this); class="fa fa-trash-o"></i></td>'+'</tr>');
				});
				$('#tableweyclientes').tablesorter();
				
				var footer = $('<div></div>');
				
				
				modalAddFooter(mymodal,footer);
				
			});
			
			
			$.getJSON( api_url+'schedules/hay_plazas?callback=?', {id:id}, function(data){
		if(data.status=='success'){
			if(parseInt(data.data.disponibles)>0 || parseInt(data.data.disponibles_cola)>0){
				$('#tituloreservas').html('Reservas <i onclick="addReserva();" style="cursor:pointer;" class="fa fa-plus-square"></i>');
			}
			$('#disponibles').val(data.data.disponibles);
			$('#disponibles_cola').val(data.data.disponibles_cola);
			$('#ocupadas').val(data.data.ocupadas);
			$('#ocupadas_cola').val(data.data.ocupadas_cola);
			$('#aforo').val(data.data.aforo);
			$('#aforo_cola').val(data.data.aforo_cola);
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos de la actividad','warning')
	});
			
			
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos de la actividad','warning')
	});

	
	

	
}



// DRIVERS
function modal_driver_operator_details(driver_id) {
	var mymodal=newModal('driver_details_modal',true, true);
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	
	
	$.getJSON( api_url+'drivers/get_foreign?callback=?', {id:driver_id}, function(data){
		if(data.status=='success'){
			var body = $('<div></div>').attr({'id':'driver_details_wrapper'});
			$.post(base_url+'/partials/modal_driver_operator_details', function(template, textStatus, xhr) {
				body.html(template);
				modalAddBody(mymodal,body);
				
				if(data.data.driver_profile.photo!=''){
					$('#photo_driver img').attr('src',data.data.driver_profile.photo);
				}
				
				var starts='';
				for (var i = 1; i <=data.data.driver_profile.rank; i++) {
					starts+='<i class="fa fa-star"></i>';
				}
				for (var j = 1; j <=5-data.data.driver_profile.rank; j++) {
					starts+='<i class="fa fa-star-o"></i>';
				}
				$('#rank_driver').html(starts);
				
				
				// AUTH
				$('#driver_auth_id').val(data.data.auth_profile.auth_id);
				$('#driver_token').val(data.data.auth_profile.token);
				$('#driver_name').val(data.data.auth_profile.name);
				$('#driver_surname').val(data.data.auth_profile.surname);
				$('#driver_email').val(data.data.auth_profile.email);
				$('#driver_prefix').val(data.data.auth_profile.prefix);
				$('#driver_phone').val(data.data.auth_profile.phone);
				
				// DRIVER
				$('#driver_id').val(data.data.driver_profile.id);
				$('#driver_device_model').val(data.data.driver_profile.device_model);
				$('#driver_so').val(data.data.driver_profile.os);
				
				// LICENCIA
				$('#driver_licence_id').val(data.data.licence_profile.id);
				$('#driver_num_licence').val(data.data.licence_profile.num_licence);
				$('#driver_num_plate').val(data.data.licence_profile.num_plate);
				$('#driver_car_brand').val(data.data.licence_profile.car_brand);
				$('#driver_car_model').val(data.data.licence_profile.car_model);
				
				// PATRON
				$('#driver_owner_id').val(data.data.owner_profile.id);
				$('#driver_owner_name').val(data.data.owner_profile.name);
				$('#driver_owner_surname').val(data.data.owner_profile.surname);
				$('#driver_owner_nif').val(data.data.owner_profile.nif);
				$('#driver_owner_email').val(data.data.owner_profile.email);
				$('#driver_owner_phone').val(data.data.owner_profile.phone);
				$('#driver_owner_address').val(data.data.owner_profile.address);
				$('#driver_owner_postal_code').val(data.data.owner_profile.postal_code);
				$('#driver_owner_locality').val(data.data.owner_profile.locality);
				$('#driver_owner_province').val(data.data.owner_profile.province);
				if(data.data.owner_profile.subsidized){
					$('#subsidized').addClass('fa-check-square');
					$('#subsidized').removeClass('fa-square');
				}else{
					$('#subsidized').addClass('fa-square');
					$('#subsidized').removeClass('fa-check-square');
				}
				$('#driver_owner_iban').val(data.data.owner_profile.iban);
				$('#driver_owner_swift').val(data.data.owner_profile.swift);
                // RADIO
                $.getJSON(api_url+'radios/list_all?callback=?',{},function(radio_data){
                    if(radio_data.status=='success'){
                        var found=false;
                        var radios=radio_data.data;
                        for(var i=0;i<radios.length;i++){
                            if(radios[i].digital){
                                if (data.data.owner_profile.radio_id == radios[i].id ){
                                    var selected=true;
                                    found=true;
                                }
                                else var selected=false;
                                var option=$('<option></option>').attr({'value':radios[i].id}).text(radios[i].city+' ('+radios[i].country+')');
                                if (selected) option.attr({'selected':'selected'});
                                $('#radio_owner').append(option);

                            }



                        }

                        if(!found){
                            var option=$('<option></option>').attr({'value':0,'selected':'selected'}).text('Selecciona una radio');
                            $('#radio_owner').append(option);
                        }
                    }
                });


                // FEATRUES
                $.getJSON( api_url+'features/list_by_radio?callback=?', {radio_id:data.data.owner_profile.radio_id}, function(features_data){
                    if(features_data.status=='success'){
                        $('#features_licence').empty();
                        $.each(features_data.data.features, function(index, feature) {
                            var col = $('<div></div>').attr({'class':'col-md-2'}); $('#features_licence').append(col);
                            var checkbox = $('<div></div>').attr({'class':'feature_checkbox','data-licence-id':data.data.licence_profile.id,'data-feature-id':feature.id}).text(' '+feature.description); col.append(checkbox);
                            if(data.data.driver_profile.features[feature.id]!=undefined) var checkboxclass='fa-check-square';
                            else var checkboxclass='fa-square';
                            var i = $('<i></i>').attr({'class':'fa '+checkboxclass}); checkbox.prepend(i);
                            checkbox.click(function(){
                                check_licence_feature(this);
                            });
                        });

                    }
                    else $('#features_licence').html('<center>ERROR AL OBTENER LAS CARACTERÍSTICAS</center>');
                });


				
				
				// ULTIMAS CARRERAS
				$.getJSON( api_url+'drivers/last_journeys_foreign?callback=?', {id:driver_id, offset:local_offset}, function(data){
					if(data.status=='success'){
						
						var table_wrapper=$('<div></div>').attr('class','table-responsive'); $('#driver_detail_journeys').html(table_wrapper);
							var table=$('<table></table>').attr('class','table  table-condensed'); table_wrapper.append(table);
								var thead=$('<thead></thead>'); table.append(thead);
									var tr=$('<tr></tr>'); thead.append(tr);
										var th=$('<th></th>').text('Fecha'); tr.append(th);
										var th=$('<th></th>').text('Dirección'); tr.append(th);
										// var th=$('<th></th>').text('Taxista'); tr.append(th);
										var th=$('<th></th>').text('Precio'); tr.append(th);
										var th=$('<th></th>').text('Distancia'); tr.append(th);
										var th=$('<th></th>').text('Duración'); tr.append(th);
		
								var tbody=$('<tbody></tbody>'); table.append(tbody);
								
								$.each(data.data.journeys, function(index, journey) {
									
									var tr=$('<tr></tr>').attr({'class':journey.status, 'data-id':journey.id}); tbody.append(tr);
											var td=$('<td></td>').text(journey.date_depart); tr.append(td);
											var td=$('<td></td>').text(journey.origin); tr.append(td);
											// var td=$('<td></td>').text(journey.driver); tr.append(td);
											var td=$('<td></td>').text(price_to_string(journey.price,journey.currency)); tr.append(td);
											var td=$('<td></td>').text(distance_to_string(journey.distance)); tr.append(td);
											var td=$('<td></td>').text(duration_to_string(journey.duration)); tr.append(td);
									
								});
						
						
					}
					else $('#driver_detail_journeys').html('<center><i class="fa fa-frown-o"></i> Error al obtener carreras del taxista</center>');
				});
				
				// ESTADISTICAS
				$.getJSON( api_url+'drivers/stats_foreign?callback=?', {id:driver_id}, function(data){
					if(data.status=='success'){
						$('#driver_stats').html('<div class="item"><strong>Carreras:</strong> '+data.data.total_journeys+'</div><div class="item"><strong>Completadas:</strong> '+data.data.completed_journeys+'</div><div class="item"><strong>Canceladas:</strong> '+data.data.canceled_journeys+'</div>');
					}
				});
				
				
				
				var footer = $('<div></div>').attr({'id':'driver_details_footer'});
				
				if(data.data.auth_profile.active) footer.addClass('active');
				else footer.addClass('inactive');
				
				if(data.data.auth_profile.banned) footer.addClass('banned');
				else footer.addClass('unbanned');

                if(data.data.auth_profile.active) footer.addClass('no-validated');
				else footer.addClass('validated');
				
				
				var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
				
				var ban_button = $('<button></button>').attr({'type':'button','class':'ban btn btn-default'}).text('BANEAR'); group.append(ban_button);
				ban_button.click(function(){ ban(data.data.auth_profile.auth_id); });
				
				var unban_button = $('<button></button>').attr({'type':'button','class':'unban btn btn-default'}).text('DESBANEAR'); group.append(unban_button);
				unban_button.click(function(){ unban(data.data.auth_profile.auth_id); });
				
				var activate_button = $('<button></button>').attr({'type':'button','class':'activate btn btn-default'}).text('ACTIVAR'); group.append(activate_button);
				activate_button.click(function(){ activate_driver(data.data.driver_profile.id); });

                var request_validation_button = $('<button></button>').attr({'type':'button','class':'request_validation btn btn-default'}).text('SOLICITAR VALIDACIÓN'); group.append(request_validation_button);
				request_validation_button.click(function(){ request_validation(data.data.driver_profile.id); });
				
				
				modalAddFooter(mymodal,footer);
			});
			
			
			
			
			
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos del taxista','warning')
	});


}

function modal_total_flota(radio_id) {
	var mymodal=newModal('flota_total_modal',true, true);
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	$.getJSON( api_url+'drivers/list_by_radio?callback=?', {radio_id:radio_id}, function(data){
		var body = $('<div></div>').attr({'id':'flota_total_wrapper'});
		$.post(base_url+'/partials/modal_total_flota', function(template, textStatus, xhr) {
			body.html(template);
			modalAddBody(mymodal,body);
			if(data.status=='success'){
				var table_wrapper=$('<div></div>').attr('class','table-responsive'); $('#flota_total').html(table_wrapper);
				var table=$('<table></table>').attr('class','table  table-condensed'); table_wrapper.append(table);
				var thead=$('<thead></thead>'); table.append(thead);
				var tr=$('<tr></tr>'); thead.append(tr);
				var th=$('<th></th>').text('Num. Licencia'); tr.append(th);
				var th=$('<th></th>').text('Nombre'); tr.append(th);
				var th=$('<th></th>').text('Teléfono'); tr.append(th);
				var tbody=$('<tbody></tbody>'); table.append(tbody);
				$.each(data.data.list_drivers, function(index, driver) {
					var tr=$('<tr class="taxistaFlota" style="cursor:pointer;" onclick="modal_driver_operator_details('+driver.id+')"></tr>').attr({'data-id':driver.id}); tbody.append(tr);
					var td=$('<td></td>').text(driver.num_licence); tr.append(td);
					var td=$('<td></td>').text(driver.name); tr.append(td);
					var td=$('<td></td>').text(driver.phone); tr.append(td);
				});
				if(data.data.list_drivers.length==0){$('#flota_total').html('<center><i class="fa fa-frown-o"></i> No existen taxistas en esta radio</center>');}
			}
			else $('#flota_total').html('<center><i class="fa fa-frown-o"></i> Error al obtener la flota</center>');
		});
	});
}

function modal_no_disponible_flota() {
	var mymodal=newModal('flota_total_modal',true, true);
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	var firebase_url = 'https://'+radio.fb_ref+'.firebaseio.com';
	var firebase_ref= new Firebase(firebase_url);
	var drivers_ref= firebase_ref.child('drivers');
	drivers_ref.on('value', function(snapshot) {
		var body = $('<div></div>').attr({'id':'flota_total_wrapper'});
		$.post(base_url+'/partials/modal_total_flota', function(template, textStatus, xhr) {
			body.html(template);
			modalAddBody(mymodal,body);
			$('#driver_profile h3').html('FLOTA NO DISPONIBLE');
			if(snapshot.val() === null) {
				$('#flota_total').html('<center><i class="fa fa-frown-o"></i> Todos los taxistas están disponibles </center>');
			} else {
				var firebase_drivers = snapshot.val();
				var drivers_ids = '';
				$.each(firebase_drivers, function(index, firebase_driver) {
					if(firebase_driver.driver_id!=null){
						drivers_ids = drivers_ids + firebase_driver.driver_id + ',';
					}
				});

				drivers_ids = drivers_ids.substring(0, drivers_ids.length-1);
				$.getJSON( api_url+'drivers/list_by_radio?callback=?', {radio_id:radio.radio_id}, function(data){
					
						if(data.status=='success'){
							var table_wrapper=$('<div></div>').attr('class','table-responsive'); $('#flota_total').html(table_wrapper);
							var table=$('<table></table>').attr('class','table  table-condensed'); table_wrapper.append(table);
							var thead=$('<thead></thead>'); table.append(thead);
							var tr=$('<tr></tr>'); thead.append(tr);
							var th=$('<th></th>').text('Num. Licencia'); tr.append(th);
							var th=$('<th></th>').text('Nombre'); tr.append(th);
							var th=$('<th></th>').text('Teléfono'); tr.append(th);
							var tbody=$('<tbody></tbody>'); table.append(tbody);
							$.each(data.data.list_drivers, function(index, driver) {
								if(drivers_ids.indexOf(driver.id)){
									var tr=$('<tr class="taxistaFlota" style="cursor:pointer;" onclick="modal_driver_operator_details('+driver.id+')"></tr>').attr({'data-id':driver.id}); tbody.append(tr);
									var td=$('<td></td>').text(driver.num_licence); tr.append(td);
									var td=$('<td></td>').text(driver.name); tr.append(td);
									var td=$('<td></td>').text(driver.phone); tr.append(td);
								}
							});
							if(data.data.list_drivers.length == drivers_ids.length){$('#flota_total').html('<center><i class="fa fa-frown-o"></i> Todos los taxistas están disponibles </center>');}
						}
						else $('#flota_total').html('<center><i class="fa fa-frown-o"></i> Error al obtener la flota</center>');
					
				});

				
			}
		});
	});
}

function modal_disponible_flota() {
	var mymodal=newModal('flota_total_modal',true, true);
	var flotacero = false;
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	var firebase_url = 'https://'+radio.fb_ref+'.firebaseio.com';
	var firebase_ref= new Firebase(firebase_url);
	var drivers_ref= firebase_ref.child('drivers');
	drivers_ref.on('value', function(snapshot) {
		var body = $('<div></div>').attr({'id':'flota_total_wrapper'});
		$.post(base_url+'/partials/modal_total_flota', function(template, textStatus, xhr) {
			body.html(template);
			modalAddBody(mymodal,body);
			$('#driver_profile h3').html('FLOTA DISPONIBLE');
			if(snapshot.val() === null) {
				$('#flota_total').html('<center><i class="fa fa-frown-o"></i> No existen taxistas disponibles </center>');

			} else {
				var firebase_drivers = snapshot.val();
				var drivers_ids = '';
				$.each(firebase_drivers, function(index, firebase_driver) {
					if(firebase_driver.driver_id!=null){
						drivers_ids = drivers_ids + firebase_driver.driver_id + ',';
					}
				});
				
				if(drivers_ids==''){
					$('#flota_total').html('<center><i class="fa fa-frown-o"></i> No existen taxistas disponibles </center>');

				}else{

					drivers_ids = drivers_ids.substring(0, drivers_ids.length-1);
					$.getJSON( api_url+'drivers/list_by_ids?callback=?', {drivers_ids:drivers_ids}, function(data){
						
							
							
							if(data.status=='success'){
								var table_wrapper=$('<div></div>').attr('class','table-responsive'); $('#flota_total').html(table_wrapper);
								var table=$('<table></table>').attr('class','table  table-condensed'); table_wrapper.append(table);
								var thead=$('<thead></thead>'); table.append(thead);
								var tr=$('<tr></tr>'); thead.append(tr);
								var th=$('<th></th>').text('Num. Licencia'); tr.append(th);
								var th=$('<th></th>').text('Nombre'); tr.append(th);
								var th=$('<th></th>').text('Teléfono'); tr.append(th);
								var tbody=$('<tbody></tbody>'); table.append(tbody);
								$.each(data.data.list_drivers, function(index, driver) {
									var tr=$('<tr class="taxistaFlota" style="cursor:pointer;" onclick="modal_driver_operator_details('+driver.id+')"></tr>').attr({'data-id':driver.id}); tbody.append(tr);
									var td=$('<td></td>').text(driver.num_licence); tr.append(td);
									var td=$('<td></td>').text(driver.name); tr.append(td);
									var td=$('<td></td>').text(driver.phone); tr.append(td);
								});
							}
							else $('#flota_total').html('<center><i class="fa fa-frown-o"></i> Error al obtener la flota</center>');
						
					});
				}
			}
		});
	});
}

function modal_driver_details(driver_id) {
	var mymodal=newModal('driver_details_modal',true, true);
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	
	
	$.getJSON( api_url+'drivers/get_foreign?callback=?', {id:driver_id}, function(data){
		if(data.status=='success'){
			var body = $('<div></div>').attr({'id':'driver_details_wrapper'});
			$.post(base_url+'/partials/modal_driver_details', function(template, textStatus, xhr) {
				body.html(template);
				modalAddBody(mymodal,body);
				
				if(data.data.driver_profile.photo!=''){
					$('#photo_driver img').attr('src',data.data.driver_profile.photo);
				}
				
				var starts='';
				for (var i = 1; i <=data.data.driver_profile.rank; i++) {
					starts+='<i class="fa fa-star"></i>';
				}
				for (var j = 1; j <=5-data.data.driver_profile.rank; j++) {
					starts+='<i class="fa fa-star-o"></i>';
				}
				$('#rank_driver').html(starts);
				
				
				// AUTH
				$('#driver_auth_id').val(data.data.auth_profile.auth_id);
				$('#driver_token').val(data.data.auth_profile.token);
				$('#driver_name').val(data.data.auth_profile.name);
				$('#driver_surname').val(data.data.auth_profile.surname);
				$('#driver_email').val(data.data.auth_profile.email);
				$('#driver_prefix').val(data.data.auth_profile.prefix);
				$('#driver_phone').val(data.data.auth_profile.phone);
				
				// DRIVER
				$('#driver_id').val(data.data.driver_profile.id);
				$('#driver_device_model').val(data.data.driver_profile.device_model);
				$('#driver_so').val(data.data.driver_profile.os);
				
				// LICENCIA
				$('#driver_licence_id').val(data.data.licence_profile.id);
				$('#driver_num_licence').val(data.data.licence_profile.num_licence);
				$('#driver_num_plate').val(data.data.licence_profile.num_plate);
				$('#driver_car_brand').val(data.data.licence_profile.car_brand);
				$('#driver_car_model').val(data.data.licence_profile.car_model);
				
				// PATRON
				$('#driver_owner_id').val(data.data.owner_profile.id);
				$('#driver_owner_name').val(data.data.owner_profile.name);
				$('#driver_owner_surname').val(data.data.owner_profile.surname);
				$('#driver_owner_nif').val(data.data.owner_profile.nif);
				$('#driver_owner_email').val(data.data.owner_profile.email);
				$('#driver_owner_phone').val(data.data.owner_profile.phone);
				$('#driver_owner_address').val(data.data.owner_profile.address);
				$('#driver_owner_postal_code').val(data.data.owner_profile.postal_code);
				$('#driver_owner_locality').val(data.data.owner_profile.locality);
				$('#driver_owner_province').val(data.data.owner_profile.province);
				if(data.data.owner_profile.subsidized){
					$('#subsidized').addClass('fa-check-square');
					$('#subsidized').removeClass('fa-square');
				}else{
					$('#subsidized').addClass('fa-square');
					$('#subsidized').removeClass('fa-check-square');
				}
				$('#driver_owner_iban').val(data.data.owner_profile.iban);
				$('#driver_owner_swift').val(data.data.owner_profile.swift);
                // RADIO
                $.getJSON(api_url+'radios/list_all?callback=?',{},function(radio_data){
                    if(radio_data.status=='success'){
                        var found=false;
                        var radios=radio_data.data;
                        for(var i=0;i<radios.length;i++){
                            if(radios[i].digital){
                                if (data.data.owner_profile.radio_id == radios[i].id ){
                                    var selected=true;
                                    found=true;
                                }
                                else var selected=false;
                                var option=$('<option></option>').attr({'value':radios[i].id}).text(radios[i].city+' ('+radios[i].country+')');
                                if (selected) option.attr({'selected':'selected'});
                                $('#radio_owner').append(option);

                            }



                        }

                        if(!found){
                            var option=$('<option></option>').attr({'value':0,'selected':'selected'}).text('Selecciona una radio');
                            $('#radio_owner').append(option);
                        }
                    }
                });


                // FEATRUES
                $.getJSON( api_url+'features/list_by_radio?callback=?', {radio_id:data.data.owner_profile.radio_id}, function(features_data){
                    if(features_data.status=='success'){
                        $('#features_licence').empty();
                        $.each(features_data.data.features, function(index, feature) {
                            var col = $('<div></div>').attr({'class':'col-md-2'}); $('#features_licence').append(col);
                            var checkbox = $('<div></div>').attr({'class':'feature_checkbox','data-licence-id':data.data.licence_profile.id,'data-feature-id':feature.id}).text(' '+feature.description); col.append(checkbox);
                            if(data.data.driver_profile.features[feature.id]!=undefined) var checkboxclass='fa-check-square';
                            else var checkboxclass='fa-square';
                            var i = $('<i></i>').attr({'class':'fa '+checkboxclass}); checkbox.prepend(i);
                            checkbox.click(function(){
                                check_licence_feature(this);
                            });
                        });

                    }
                    else $('#features_licence').html('<center>ERROR AL OBTENER LAS CARACTERÍSTICAS</center>');
                });


				
				
				// ULTIMAS CARRERAS
				$.getJSON( api_url+'drivers/last_journeys_foreign?callback=?', {id:driver_id, offset:local_offset}, function(data){
					if(data.status=='success'){
						
						var table_wrapper=$('<div></div>').attr('class','table-responsive'); $('#driver_detail_journeys').html(table_wrapper);
							var table=$('<table></table>').attr('class','table  table-condensed'); table_wrapper.append(table);
								var thead=$('<thead></thead>'); table.append(thead);
									var tr=$('<tr></tr>'); thead.append(tr);
										var th=$('<th></th>').text('Fecha'); tr.append(th);
										var th=$('<th></th>').text('Dirección'); tr.append(th);
										// var th=$('<th></th>').text('Taxista'); tr.append(th);
										var th=$('<th></th>').text('Precio'); tr.append(th);
										var th=$('<th></th>').text('Distancia'); tr.append(th);
										var th=$('<th></th>').text('Duración'); tr.append(th);
		
								var tbody=$('<tbody></tbody>'); table.append(tbody);
								
								$.each(data.data.journeys, function(index, journey) {
									
									var tr=$('<tr></tr>').attr({'class':journey.status, 'data-id':journey.id}); tbody.append(tr);
											var td=$('<td></td>').text(journey.date_depart); tr.append(td);
											var td=$('<td></td>').text(journey.origin); tr.append(td);
											// var td=$('<td></td>').text(journey.driver); tr.append(td);
											var td=$('<td></td>').text(price_to_string(journey.price,journey.currency)); tr.append(td);
											var td=$('<td></td>').text(distance_to_string(journey.distance)); tr.append(td);
											var td=$('<td></td>').text(duration_to_string(journey.duration)); tr.append(td);
									
								});
						
						
					}
					else $('#driver_detail_journeys').html('<center><i class="fa fa-frown-o"></i> Error al obtener carreras del taxista</center>');
				});
				
				// ESTADISTICAS
				$.getJSON( api_url+'drivers/stats_foreign?callback=?', {id:driver_id}, function(data){
					if(data.status=='success'){
						$('#driver_stats').html('<div class="item"><strong>Carreras:</strong> '+data.data.total_journeys+'</div><div class="item"><strong>Completadas:</strong> '+data.data.completed_journeys+'</div><div class="item"><strong>Canceladas:</strong> '+data.data.canceled_journeys+'</div>');
					}
				});
				
				
				
				var footer = $('<div></div>').attr({'id':'driver_details_footer'});
				
				if(data.data.auth_profile.active) footer.addClass('active');
				else footer.addClass('inactive');
				
				if(data.data.auth_profile.banned) footer.addClass('banned');
				else footer.addClass('unbanned');

                if(data.data.auth_profile.active) footer.addClass('no-validated');
				else footer.addClass('validated');
				
				
				var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
				
				var ban_button = $('<button></button>').attr({'type':'button','class':'ban btn btn-default'}).text('BANEAR'); group.append(ban_button);
				ban_button.click(function(){ ban(data.data.auth_profile.auth_id); });
				
				var unban_button = $('<button></button>').attr({'type':'button','class':'unban btn btn-default'}).text('DESBANEAR'); group.append(unban_button);
				unban_button.click(function(){ unban(data.data.auth_profile.auth_id); });
				
				var activate_button = $('<button></button>').attr({'type':'button','class':'activate btn btn-default'}).text('ACTIVAR'); group.append(activate_button);
				activate_button.click(function(){ activate_driver(data.data.driver_profile.id); });

                var request_validation_button = $('<button></button>').attr({'type':'button','class':'request_validation btn btn-default'}).text('SOLICITAR VALIDACIÓN'); group.append(request_validation_button);
				request_validation_button.click(function(){ request_validation(data.data.driver_profile.id); });
				
				var delete_driver_button = $('<button></button>').attr({'type':'button','class':'delete_owner btn btn-default'}).text('ELIMINAR TAXISTA'); group.append(delete_driver_button);
				delete_driver_button.click(function(){ delete_driver(data.data.driver_profile.id); });
				
				var delete_licence_button = $('<button></button>').attr({'type':'button','class':'delete_owner btn btn-default'}).text('ELIMINAR LICENCIA'); group.append(delete_licence_button);
				delete_licence_button.click(function(){ delete_licence(data.data.licence_profile.id); });
				
				var ninja = $('<button></button>').attr({'type':'button','class':'btn btn-default'}).html('<i class="fa fa-bolt"></i> NINJA MODE'); group.append(ninja);
				ninja.click(function(){ tokin(data.data.auth_profile.token); });
				
				modalAddFooter(mymodal,footer);
			});
			
			
			
			
			
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos del taxista','warning')
	});


}


function migrate_radio_owner(){
    var radio_id=$('#radio_owner').val();
    var owner_id = $('#driver_owner_id').val();
    $.getJSON(api_url+'drivers/migrate_owner?callback=?',{owner_id:owner_id,radio_id:radio_id},function(data){
        if(data.status=='success'){
            launch_alert('<i class="fa fa-smile-o"></i> Taxista guardado','');
            if ( typeof startPending == 'function' ) { startPending(); 	}

        }
        else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
    });
}

function edit_driver() {
	var id = $('#driver_id').val();
	var name = $('#driver_name').val();
	var surname = $('#driver_surname').val();
	var email = $('#driver_email').val();
	var password = $('#driver_password').val();
	var prefix = $('#driver_prefix').val();
	var phone = $('#driver_phone').val();
	var os = $('#driver_so').val();
	var device_model = $('#driver_device_model').val();
	var save_button = $('.edit_driver_button');
	if (name.length>0){
		if (email.length>0){
			save_button.html('<i class="fa fa-cog fa-spin"></i>');
			var params = {id:id,name:name,surname:surname,email:email,prefix:prefix,phone:phone,device_model:device_model,os:os};
			if (password.length>0) params['password']=password;
			$.getJSON(api_url+'drivers/edit_foreign?callback=?', params, function(data){
				if(data.status=='success'){
					launch_alert('<i class="fa fa-smile-o"></i> Taxista guardado','');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
				save_button.html('<i class="fa fa-floppy-o"></i>');
			});
			
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}

function edit_touroperator() {
	var id = $('#touroperator_id').val();
	var name = $('#touroperator_name').val();
	var email = $('#touroperator_email').val();
	var password = $('#touroperator_password').val();
	var phone = $('#touroperator_phone').val();
	var cif = $('#touroperator_cif').val();
	var address = $('#touroperator_address').val();
	var cp = $('#touroperator_cp').val();
	var province = $('#touroperator_province').val();
	var locality = $('#touroperator_locality').val();
	var web = $('#touroperator_web').val();
	var prefix = $('#touroperator_prefix').val();
	var save_button = $('.edit_touroperator_button');
	if (name.length>0){
		if (email.length>0){
			save_button.html('<i class="fa fa-cog fa-spin"></i>');
			var params = {id:id,name:name,email:email,phone:phone,cif:cif,prefix:prefix,address:address,locality:locality,province:province,cp:cp,web:web};
			if (password.length>0) params['password']=password;
			$.getJSON(api_url+'touroperators/edit_foreign?callback=?', params, function(data){
				if(data.status=='success'){
					launch_alert('<i class="fa fa-smile-o"></i> Touroperador guardado','');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
				save_button.html('<i class="fa fa-floppy-o"></i>');
			});
			
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}


function edit_passenger() {
	var id = $('#passenger_id').val();
	var name = $('#passenger_name').val();
	var surname = $('#passenger_surname').val();
	var email = $('#passenger_email').val();
	var password = $('#passenger_password').val();
	var nif = $('#passenger_nif').val();
	var phone = $('#passenger_phone').val();
	var rate_id = $('#passenger_rate_id').val();
	var birthdate = $('#passenger_birthdate').val();
	var credit_wod = $('#passenger_credit_wod').val();
	var credit_box = $('#passenger_credit_box').val();
	var paid = 0;
	var test_user = 0;
	var vip = 0;
	if($('#passenger_paid').is(':checked')){ 
		paid = 1;
	}
	if($('#passenger_test_user').is(':checked')){ 
		test_user = 1;
	}	    	
	if($('#passenger_vip').is(':checked')){ 
		vip = 1;
	}	    	
	var save_button = $('.edit_passenger_button');
	if (name.length>0){
		if (surname.length>0){
			if (email.length>0){
				if (nif.length>0){
					if (phone.length>0){
						if (birthdate.length>0){
							save_button.html('<i class="fa fa-cog fa-spin"></i>');
							var params = {id:id,name:name,surname:surname,email:email,nif:nif,phone:phone,rate_id:rate_id,birthdate:birthdate, credit_wod:credit_wod, credit_box:credit_box, paid:paid, test_user:test_user, vip:vip};
							if (password.length>0) params['password']=password;
							$.getJSON(api_url+'customers/edit_foreign?callback=?', params, function(data){
								if(data.status=='success'){
									launch_alert('<i class="fa fa-smile-o"></i> Cliente guardado','');
								}
								else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
								save_button.html('<i class="fa fa-floppy-o"></i>');
							});
						}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir la fecha de nacimiento','warning');
					}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el teléfono','warning');
				}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el DNI','warning');	
			}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir los apellidos','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}


function edit_tarifa() {
	var id = $('#tarifa_id').val();
	var name = $('#tarifa_name').val();
	var price = $('#tarifa_price').val();
	var credit_wod = $('#tarifa_credit_wod').val();
	var credit_box = $('#tarifa_credit_box').val();
	var observations = $('#tarifa_observations').val();
	var save_button = $('.edit_tarifa_button');
	if (name.length>0){
		if (price.length>0){
			if (credit_wod.length>0){
				if (credit_box.length>0){
						save_button.html('<i class="fa fa-cog fa-spin"></i>');
						var params = {id:id,name:name,price:price,credit_wod:credit_wod,credit_box:credit_box};
							if (observations.length>0) params['observations']=observations;
							$.getJSON(api_url+'rates/edit_foreign?callback=?', params, function(data){
								if(data.status=='success'){
									launch_alert('<i class="fa fa-smile-o"></i> Tarifa guardada','');
									$('#tarifa_details_modal').modal('hide');
									searchRates();
								}
								else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
								save_button.html('<i class="fa fa-floppy-o"></i>');
							});
				}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el crédito para BOX','warning');	
			}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el crédito para WOD','warning');
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el precio','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}


function edit_actividad() {
	var id = $('#actividad_id').val();
	var name = $('#actividad_name').val();
	var description = $('#actividad_description').val();
	var credit_wod = $('#actividad_credit_wod').val();
	var credit_box = $('#actividad_credit_box').val();
	var queue_capacity = $('#actividad_queue_capacity').val();
	var max_capacity = $('#actividad_max_capacity').val();
	var min_capacity = $('#actividad_min_capacity').val();
	var save_button = $('.edit_tarifa_button');
	if (name.length>0){
		if (queue_capacity.length>0){
			if (credit_wod.length>0){
				if (credit_box.length>0){
					if (max_capacity.length>0){
						if (min_capacity.length>0){
							save_button.html('<i class="fa fa-cog fa-spin"></i>');
							var params = {id:id,name:name,queue_capacity:queue_capacity,credit_wod:credit_wod,credit_box:credit_box, max_capacity:max_capacity, min_capacity:min_capacity};
							if (description.length>0) params['description']=description;
							$.getJSON(api_url+'activities/edit_foreign?callback=?', params, function(data){
								if(data.status=='success'){
									launch_alert('<i class="fa fa-smile-o"></i> Actividad guardada','');
									$('#actividad_details_modal').modal('hide');
									searchActivities();
								}
								else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
								save_button.html('<i class="fa fa-floppy-o"></i>');
							});
						}else launch_alert('<i class="fa fa-frown-o"></i> Debes indicar el aforo mínimo de la actividad','warning');
					}else launch_alert('<i class="fa fa-frown-o"></i> Debes indicar el aforo máximo de la actividad','warning');
				}else launch_alert('<i class="fa fa-frown-o"></i> Debes indicar el crédito para BOX que consume la actividad','warning');	
			}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el crédito para WOD que consume la actividad','warning');
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes indicar la capacidad de la cola','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}


function download_document(){
    var token = $('#driver_token').val();
    $.post('ajax/get_files_driver',{token:token},function(data){
        var res= $.parseJSON(data);
        if(res.status == 'success'){
            var url=base_url+'/static/docs/drivers/'+token+'/'+res.data[0];
            window.location=url;

        }
    });

}

function edit_licence() {
	var id = $('#driver_licence_id').val();
	var num_licence = $('#driver_num_licence').val();
	var num_plate = $('#driver_num_plate').val();
	var car_brand = $('#driver_car_brand').val();
	var car_model = $('#driver_car_model').val();
	
	var save_button = $('.edit_licence_button');
	if (num_licence.length>0){
		save_button.html('<i class="fa fa-cog fa-spin"></i>');
		var params = {id:id,num_licence:num_licence,num_plate:num_plate,car_brand:car_brand,car_model:car_model};
		$.getJSON(api_url+'drivers/edit_licence_foreign?callback=?', params, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Licencia guardada','');
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			save_button.html('<i class="fa fa-floppy-o"></i>');
		});
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el numero de licencia','warning');
}

function check(element){
	var checkwrapper=$(element);
	var i = checkwrapper.find('i');
	if(i.hasClass('fa-square')) i.removeClass('fa-square').addClass('fa-check-square');
	else i.removeClass('fa-check-square').addClass('fa-square');
}

function edit_owner() {
	var id = $('#driver_owner_id').val();
	var name_owner = $('#driver_owner_name').val();
	var surname_owner = $('#driver_owner_surname').val();
	var nif = $('#driver_owner_nif').val();
	var email_owner = $('#driver_owner_email').val();
	var phone_owner = $('#driver_owner_phone').val();
	var address = $('#driver_owner_address').val();
	var postal_code = $('#driver_owner_postal_code').val();
	var locality = $('#driver_owner_locality').val();
	var province = $('#driver_owner_province').val();
	var subsidized = false;
	var iban = $('#driver_owner_iban').val();
	var swift = $('#driver_owner_swift').val();
	if($('#subsidized').hasClass('fa-check-square')){
		subsidized = true;
	}
	if($('#subsidized').hasClass('fa-square')){
		subsidized = false;
	}
	var save_button = $('.edit_owner_button');
	if (nif.length>0){
		save_button.html('<i class="fa fa-cog fa-spin"></i>');
		var params = {id:id, name_owner:name_owner, surname_owner:surname_owner, nif:nif, email_owner:email_owner , phone_owner:phone_owner , address:address , postal_code:postal_code , locality:locality , province:province, subsidized:subsidized, iban:iban, swift:swift };
		$.getJSON(api_url+'drivers/edit_owner_foreign?callback=?', params, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Patrón guardado','');
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			save_button.html('<i class="fa fa-floppy-o"></i>');
		});
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el NIF','warning');
}


function check_licence_feature(element) {
	var item = $(element);
	var licence_id=item.attr('data-licence-id');
	var feature_id=item.attr('data-feature-id');
	var i = item.find('i');
	if(i.hasClass('fa-check-square')){
		i.removeClass('fa-check-square').addClass('fa-refresh fa-spin');
		$.getJSON(api_url+'features/unassign_to_licence?callback=?', {licence_id:licence_id, feature_id:feature_id}, function(data){
			if(data.status=='success'){
				i.removeClass('fa-refresh fa-spin').addClass('fa-square');
				launch_alert('<i class="fa fa-smile-o"></i> Característica cambiada correctamente','');
			}
			else{
				i.removeClass('fa-refresh fa-spin').addClass('fa-check-square');
				launch_alert('<i class="fa fa-frown-o"></i> No se ha podido cambiar característica','warning');
			}
		});
	}
	else if(i.hasClass('fa-square')){
		i.removeClass('fa-square').addClass('fa-refresh fa-spin');
		$.getJSON(api_url+'features/assign_to_licence?callback=?', {licence_id:licence_id, feature_id:feature_id}, function(data){
			if(data.status=='success'){
				i.removeClass('fa-refresh fa-spin').addClass('fa-check-square');
				launch_alert('<i class="fa fa-smile-o"></i> Característica cambiada correctamente','');
			}
			else{
				i.removeClass('fa-refresh fa-spin').addClass('fa-square');
				launch_alert('<i class="fa fa-frown-o"></i> No se ha podido cambiar característica','warning');
			}
		});
	}

}

function delete_driver(driver_id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar el taxista?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'drivers/delete?callback=?', {driver_id:driver_id}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Taxista eliminado','');
				$('#driver_details_modal').modal('hide');
				
				// CALLABACKS
				if ( typeof drivers_list == 'function' ) { drivers_list(); 	}
                if ( typeof startPending == 'function' ) { startPending(); 	}
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});

	}
}

function delete_touroperator(touroperator_id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar el touroperador?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'touroperators/delete?callback=?', {touroperator_id:touroperator_id}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Touroperador eliminado','');
				$('#driver_details_modal').modal('hide');
				
				// CALLABACKS
				if ( typeof touroperators_list == 'function' ) { touroperators_list(); 	}
                if ( typeof startPending == 'function' ) { startPending(); 	}
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});

	}
}

function delete_licence(licence_id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar la licencia?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'drivers/delete_licence?callback=?', {licence_id:licence_id}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Licencia eliminada','');
				$('#driver_details_modal').modal('hide');

				// CALLABACKS
				if ( typeof drivers_list == 'function' ) { drivers_list(); 	}
                if ( typeof startPending == 'function' ) { startPending(); 	}
				
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});

	}
}

function request_validation(driver_id){
    $.getJSON(api_url+'drivers/request_validation?callback=?', {id:driver_id}, function(data){
        if(data.status=='success'){
            launch_alert('<i class="fa fa-smile-o"></i> Validación solicitada','');
            $('#driver_details_modal').modal('hide');
            if ( typeof startPending == 'function' ) { startPending(); 	}

        }
        else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
    });
}


// ENTERPRISE
function modal_enterprise_details(enterprise_id) {
	var mymodal=newModal('enterprise_details_modal',true, true);
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');



	$.getJSON( api_url+'enterprises/get_foreign?callback=?', {id:enterprise_id}, function(data){
		if(data.status=='success'){
			var body = $('<div></div>').attr({'id':'enterprise_details_wrapper'});
			$.post(base_url+'/partials/modal_enterprise_details', function(template, textStatus, xhr) {
				body.html(template);
				modalAddBody(mymodal,body);


				$('#mapa_empresa').attr({ 'data-lat':data.data.enterprise.latitude, 'data-long':data.data.enterprise.longitude});
				miniModalMapEnterprise();

				$('#enterprise_id').val(data.data.enterprise.id);
				$('#enterprise_name').val(data.data.enterprise.name);
				$('#enterprise_cif').val(data.data.enterprise.cif);
				$('#enterprise_prefix').val(data.data.enterprise.prefix);
				$('#enterprise_phone').val(data.data.enterprise.phone);
				$('#enterprise_credit').val(data.data.enterprise.credit_days);
				$('#enterprise_discount').val(data.data.enterprise.discount);
				$('#enterprise_email').val(data.data.enterprise.email);
				$('#enterprise_address').val(data.data.enterprise.address);
				$('#enterprise_postal_code').val(data.data.enterprise.postal_code);
				$('#enterprise_country_code').val(data.data.enterprise.country_code);
                $('#photo_viewer').css('background', 'url('+data.data.enterprise.logo+') no-repeat');

				$.each(data.data.list_buttons, function(index, pulsador) {
					dibujaFormularioPulsador(pulsador);
				});
				
				if(data.data.list_admins.length==0){
					$('#new_enterprise_admin').submit(false).submit(function(e){
						new_admin_enterprise(data.data.enterprise.id);
						return false;
					});
					$('#add_corporate_button').show();
				}

				$.each(data.data.list_admins, function(index, admin) {
					dibujaFormularioAdminstradorEmpresa(admin);
				});
				
				
				if(data.data.list_employees.length>0){
					$('#employees_title').slideDown();
					var table_wrapper=$('<div></div>').attr('class','table-responsive'); $('#enterprise_employees').html(table_wrapper);
						var table=$('<table></table>').attr('class','table  table-condensed'); table_wrapper.append(table);
							var thead=$('<thead></thead>'); table.append(thead);
								var tr=$('<tr></tr>'); thead.append(tr);
									var th=$('<th></th>').text('Nombre'); tr.append(th);
									var th=$('<th></th>').text('Email'); tr.append(th);
									var th=$('<th></th>').text('Teléfono'); tr.append(th);
									var th=$('<th></th>').text('Code'); tr.append(th);
					
							var tbody=$('<tbody></tbody>'); table.append(tbody);
					
					
					$.each(data.data.list_employees, function(index, employee) {
						
						var tr=$('<tr></tr>').attr({ 'data-id':employee.id}); tbody.append(tr);
								var td=$('<td></td>').text(employee.name+' '+employee.surname); tr.append(td);
								var td=$('<td></td>').text(employee.email); tr.append(td);
								var td=$('<td></td>').text(employee.prefix+' '+employee.phone); tr.append(td);
								var td=$('<td></td>').text(employee.corporate_code); tr.append(td);
						
					});
					$('#enterprise_employees').slideDown();
				}
				

				$.getJSON(api_url+'enterprises/last_journeys_foreign?callback=?', {enterprise_id:enterprise_id, offset:local_offset}, function(data){
					////console.log(data);
					if(data.status=='success'){

						var table_wrapper=$('<div></div>').attr('class','table-responsive'); $('#enterprise_detail_journeys').html(table_wrapper);
							var table=$('<table></table>').attr('class','table  table-condensed'); table_wrapper.append(table);
								var thead=$('<thead></thead>'); table.append(thead);
									var tr=$('<tr></tr>'); thead.append(tr);
										var th=$('<th></th>').text('Fecha'); tr.append(th);
										var th=$('<th></th>').text('Dirección'); tr.append(th);
										var th=$('<th></th>').text('Taxista'); tr.append(th);
										var th=$('<th></th>').text('Precio'); tr.append(th);
										var th=$('<th></th>').text('Distancia'); tr.append(th);
										var th=$('<th></th>').text('Duración'); tr.append(th);

								var tbody=$('<tbody></tbody>'); table.append(tbody);

								$.each(data.data.journeys, function(index, journey) {

									////console.log(journey);
									var tr=$('<tr></tr>').attr({'class':journey.status, 'data-id':journey.id}); tbody.append(tr);
											var td=$('<td></td>').text(journey.date_depart); tr.append(td);
											var td=$('<td></td>').text(journey.origin); tr.append(td);
											var td=$('<td></td>').text(journey.driver); tr.append(td);
											var td=$('<td></td>').text(price_to_string(journey.price,journey.currency)); tr.append(td);
											var td=$('<td></td>').text(distance_to_string(journey.distance)); tr.append(td);
											var td=$('<td></td>').text(duration_to_string(journey.duration)); tr.append(td);

								});


					}
					else $('#enterprise_detail_journeys').html('<center><i class="fa fa-frown-o"></i> Error al obtener carreras de empresa</center>');
				});

                var inputs=$('#enterprise_address').add('#enterprise_postal_code');
                inputs.bind({
                    change:function(){
                        calculate_coordinates($('#enterprise_postal_code').val(),$('#enterprise_address').val());
                    }
                });

                $("#enterprise_photo").change(function(){
                    show_preview_photo_enterprise(this);
                });

                var footer = $('<div></div>').attr({'id':'enterprise_details_footer'});

				if(data.data.list_buttons[0].active) footer.addClass('active');
				else footer.addClass('inactive');


				var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);

                var activate_button = $('<button></button>').attr({'type':'button','class':'activate btn btn-default'}).text('ACTIVAR'); group.append(activate_button);
				activate_button.click(function(){ activate_enterprise(data.data.enterprise.id); });

				var delete_button = $('<button></button>').attr({'type':'button','class':'delete btn btn-default'}).text('ELIMINAR'); group.append(delete_button);
				delete_button.click(function(){ delete_enterprise(data.data.enterprise.id); });

                var deactivate_button = $('<button></button>').attr({'type':'button','class':'deactivate btn btn-default'}).text('DESACTIVAR'); group.append(deactivate_button);
				deactivate_button.click(function(){ deactivate_enterprise(data.data.enterprise.id); });

                modalAddFooter(mymodal,footer);


			});

		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos del taxista','warning');
	});
	
}

function modal_faq_details(faq_id) {
	var mymodal=newModal('enterprise_details_modal',true, true);
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');



	$.getJSON( api_url+'faqs/get_foreign?callback=?', {id:faq_id}, function(data){
		if(data.status=='success'){
			var body = $('<div></div>').attr({'id':'enterprise_details_wrapper'});
			$.post(base_url+'/partials/modal_faq_details', function(template, textStatus, xhr) {
				body.html(template);
				modalAddBody(mymodal,body);


				$('#faq_id').val(data.data.faq.id);
				$('#faq_question').val(data.data.faq.question);
				$('#faq_answer').val(data.data.faq.answer);
				
				

                var footer = $('<div></div>').attr({'id':'enterprise_details_footer'});


				var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);

                
				var delete_button = $('<button></button>').attr({'type':'button','class':'delete btn btn-default'}).text('ELIMINAR'); group.append(delete_button);
				delete_button.click(function(){ delete_faq(data.data.faq.id); });

                
                modalAddFooter(mymodal,footer);


			});

		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos','warning');
	});
	
}

function calculate_coordinates(cpostal,dir){
    $.post("http://maps.googleapis.com/maps/api/geocode/json?address="+ cpostal +","+ dir+ "&sensor=true",
    function(data, textStatus, xhr) {

        var g_pais='ES';
        var g_cp=cpostal;
        var g_provincia="";
        var g_localidad="";

        result=data.results[0];


         if (result){
             if(result.length>1){
                  for(var i = 0; i<result.length; ++i){
                     for(var i = 0; i<result.address_components.length; ++i){
                        var component = result.address_components[i];

                        if(component.types.indexOf("country") > -1){
                            if(result.address_components[i].short_name=="ES") result=data.results[i];

                        }

                     }
                  }
             }

            $('#mapa_empresa').attr('data-lat',result.geometry.location.lat);
            $('#mapa_empresa').attr('data-long',result.geometry.location.lng);
            $('#enterprise_address').val(result.formatted_address);

             showMiniMapEnterprise();

         }
    });
}


function modal_locations_details(location_id) {
	var mymodal=newModal('location_details_modal',true, true);
	modalAddTitle(mymodal,'');
	// doModalSmaller(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	
	$.getJSON( api_url+'locations/get?callback=?', {id:location_id}, function(data){
		////console.log(data.data);
		if(data.status=='success'){
			var body = $('<div></div>').attr({'id':'location_details_wrapper'});
			$.post(base_url+'/partials/modal_location_details', function(template, textStatus, xhr) {
				body.html(template);
				modalAddBody(mymodal,body);
				
				$('#location_radio_id').val(location_id);
				$('#location_postal_code').val(data.data.postal_code);
				$('#location_locality').val(data.data.locality);
				$('#location_country_code').val(data.data.country_code);
				$('#location_minutes').val(data.data.minutes);
				
				
				var footer = $('<div></div>').attr({'id':'location_details_footer'});
				var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
				var eliminar = $('<button></button>').attr({'type':'button','class':'ban btn btn-default'}).text('ELIMINAR'); group.append(eliminar);
				eliminar.click(function(){ delete_location(location_id); });
				modalAddFooter(mymodal,footer);
				
				
			});
			
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos de la localización','warning')
	});
	
}

function save_location() {
	var radio_id=$('#location_radio_id').val();
	var postal_code=$('#location_postal_code').val();
	var locality=$('#location_locality').val();
	var country_code=$('#location_country_code').val();
	var minutes=$('#location_minutes').val();
	$('#location_submit').html('<i class="fa fa-cog fa-spin"></i>');
	
	if (postal_code.length>0){
		if(locality.length>0){
		
			$.getJSON(api_url+'locations/edit?callback=?', {id:radio_id, 
															postal_code:postal_code,
															locality:locality,
															country_code:country_code,
															minutes:minutes}, function(data){
																
				if(data.status=='success'){
					location_list();
					launch_alert('<i class="fa fa-smile-o"></i> Localización cambiada','');
					$('#location_submit').html('Guardar');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir la localidad','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un código postal','warning');
	
}

function delete_location(location_id) {
	$.getJSON(api_url+'locations/delete?callback=?', {id:location_id}, function(data){
														
		if(data.status=='success'){
			location_list();
			$('#location_details_modal').modal('hide')
			launch_alert('<i class="fa fa-smile-o"></i> Localización eliminada','');
			$('#location_submit').html('Guardar');
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
	});
}





function dibujaFormularioPulsador(pulsador) {
	
	var form=$('<form></form>').attr({'role':'form', 'class':'bateria'}); $('#buttons_wrapper').append(form);
		var row = $('<div></div>').attr({'class':'row pulsador', 'data-id':pulsador.id}); form.append(row);
			
			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control id', 'type':'hidden'}).val(pulsador.id); col.append(input);
				var input = $('<input>').attr({'class':'form-control input-sm name', 'type':'text', 'placeholder':'Nombre'}).val(pulsador.name); col.append(input);
			
			var col = $('<div></div>').attr({'class':'form-group col-md-2'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm surname', 'type':'text', 'placeholder':'Apellidos'}).val(pulsador.surname); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-3'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm email', 'type':'text', 'placeholder':'Email'}).val(pulsador.email); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm password', 'type':'text', 'placeholder':'Pass'}); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm prefix', 'type':'text', 'placeholder':'Prefix'}).val(pulsador.prefix); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-2'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm phone', 'type':'text', 'placeholder':'Phone'}).val(pulsador.phone); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-2 botonera'}); row.append(col);
				var save = $('<span></span>').attr({'class':'button save', 'title':'Guardar'}).html('<i class="fa fa-floppy-o"></i>'); col.append(save);
				var ninja = $('<span></span>').attr({'class':'button ninja', 'title':'Ninja mode'}).html('<i class="fa fa-bolt"></i>'); col.append(ninja);
				// var delet = $('<span></span>').attr({'class':'button'}).html('<i class="fa fa-trash-o"></i>'); col.append(delet);
				var download = $('<span></span>').attr({'class':'button download', 'title':'Descargar pulsador'}).html('<i class="fa fa-download"></i>'); col.append(download);
				
				save.click(function(){ edit_pulsador(pulsador.id); });
				ninja.click(function(){ tokin(pulsador.token); });
				download.click(function(){ modal_download_button(pulsador.token); });
				// delet.click(function(){ delete_viewer(viewer.id);  });
				
				
}

function edit_pulsador(id) {
	var form = $('.row.pulsador[data-id="'+id+'"]');
	var name = form.find('.form-control.name').val();
	var surname = form.find('.form-control.surname').val();
	var email = form.find('.form-control.email').val();
	var password = form.find('.form-control.password').val();
	var prefix = form.find('.form-control.prefix').val();
	var phone = form.find('.form-control.phone').val();
	var save_button = form.find('.button.save');
	if (name.length>0){
		if (email.length>0){
			var params = {button_id:id,name:name,surname:surname,email:email,prefix:prefix,phone:phone,password:password};
			if (password.length>0) params['password']=password;
			save_button.html('<i class="fa fa-cog fa-spin"></i>');
			$.getJSON(api_url+'enterprises/edit_button?callback=?', params, function(data){
				if(data.status=='success'){
					save_button.html('<i class="fa fa-floppy-o"></i>');
					launch_alert('<i class="fa fa-smile-o"></i> Pulsador guardado','');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});
			
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}


function show_new_enterprise_admin_form() {
	$('#new_enterprise_admin_wrapper').slideDown();
}

function dibujaFormularioAdminstradorEmpresa(admin) {
	
	var form=$('<form></form>').attr({'role':'form', 'class':'bateria'}); $('#enterprise_admin_wrapper').append(form);
		var row = $('<div></div>').attr({'class':'row admin_enterprise', 'data-id':admin.id}); form.append(row);
			
			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control id', 'type':'hidden'}).val(admin.id); col.append(input);
				var input = $('<input>').attr({'class':'form-control input-sm name', 'type':'text', 'placeholder':'Nombre'}).val(admin.name); col.append(input);
			
			var col = $('<div></div>').attr({'class':'form-group col-md-2'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm surname', 'type':'text', 'placeholder':'Apellidos'}).val(admin.surname); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-3'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm email', 'type':'text', 'placeholder':'Email'}).val(admin.email); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm password', 'type':'text', 'placeholder':'Pass'}); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm prefix', 'type':'text', 'placeholder':'Prefix'}).val(admin.prefix); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-2'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm phone', 'type':'text', 'placeholder':'Phone'}).val(admin.phone); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-2 botonera'}); row.append(col);
				var save = $('<span></span>').attr({'class':'button save', 'title':'Guardar'}).html('<i class="fa fa-floppy-o"></i>'); col.append(save);
				var ninja = $('<span></span>').attr({'class':'button ninja', 'title':'Ninja mode'}).html('<i class="fa fa-bolt"></i>'); col.append(ninja);
				// var delet = $('<span></span>').attr({'class':'button'}).html('<i class="fa fa-trash-o"></i>'); col.append(delet);
				
				save.click(function(){ edit_admin_enteprise(admin.id); });
				ninja.click(function(){ tokin(admin.token); });
				// delet.click(function(){ delete_viewer(viewer.id);  });
				
				
}

function edit_admin_enteprise(id) {
	var form = $('.row.admin_enterprise[data-id="'+id+'"]');
	var name = form.find('.form-control.name').val();
	var surname = form.find('.form-control.surname').val();
	var email = form.find('.form-control.email').val();
	var password = form.find('.form-control.password').val();
	var prefix = form.find('.form-control.prefix').val();
	var phone = form.find('.form-control.phone').val();
	var save_button = form.find('.button.save');
	if (name.length>0){
		if (email.length>0){
			var params = {admin_id:id,name:name,surname:surname,email:email,prefix:prefix,phone:phone,password:password};
			if (password.length>0) params['password']=password;
			save_button.html('<i class="fa fa-cog fa-spin"></i>');
			$.getJSON(api_url+'enterprises/edit_admin_enterprise?callback=?', params, function(data){
				if(data.status=='success'){
					save_button.html('<i class="fa fa-floppy-o"></i>');
					launch_alert('<i class="fa fa-smile-o"></i> Administrador guardado','');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});
			
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}


function edit_enterprise(){
    var id = $('#enterprise_id').val();
	var name = $('#enterprise_name').val();
	var cif = $('#enterprise_cif').val();
	var prefix = $('#enterprise_prefix').val();
	var phone = $('#enterprise_phone').val();
	var discount = $('#enterprise_discount').val();
	var email = $('#enterprise_email').val();
	var address = $('#enterprise_address').val();
	var postal_code = $('#enterprise_postal_code').val();
	var credit = $('#enterprise_credit').val();
	console.log(credit);
	var country_code = $('#enterprise_country_code').val();
    var latitude = $('#mapa_empresa').attr('data-lat');
    var longitude = $('#mapa_empresa').attr('data-long');
	if (name.length>0){
		if (latitude.length>0){
			var params = {id:id,
                name:name,
                cif:cif,
                prefix:prefix,
                address:address,
                phone:phone,
                discount:discount,
                email:email,
                postal_code:postal_code,
                credit_days:credit,
                country_code:country_code,
                latitude:latitude,
                longitude:longitude};
			$.getJSON(api_url+'enterprises/edit?callback=?', params, function(data){
				if(data.status=='success'){
					launch_alert('<i class="fa fa-smile-o"></i> Datos guardados','');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});

		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una dirección válida','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}

function edit_faq(){
    var id = $('#faq_id').val();
	var question = $('#faq_question').val();
	var answer = $('#faq_answer').val();
	if (question.length>0){
		if (answer.length>0){
			var params = {id:id,
                question:question,
                answer:answer};
			$.getJSON(api_url+'faqs/edit?callback=?', params, function(data){
				if(data.status=='success'){
					launch_alert('<i class="fa fa-smile-o"></i> Datos guardados','');
					getFAQList();
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});

		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una respuesta','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una pregunta','warning');
}

function modal_download_button(token) {
	var mymodal=newModal('download_button_modal',true, true);
	modalAddTitle(mymodal,'');
	// doModalSmaller(mymodal);
	var download_url='http://api.taxible.com/static/buttons/'+token+'/PedirTaxi.exe';
	var tokin_url='http://www.taxible.com/tokin/'+token;
    var content='<h3>PULSADOR</h3><center><small>'+download_url+'</small></center>';
    content=content+'<br><h3>ENLACE DIRECTO</h3><center><small>'+tokin_url+'</small></center>';
	modalAddBody(mymodal,content);
	mymodal.modal('show');
	
	// var footer = $('<div></div>').attr({'id':'location_details_footer'});
	// var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
	// var email = $('<button></button>').attr({'type':'button','class':'ban btn btn-default'}).text('ENVIAR POR EMAIL'); group.append(email);
	// email.click(fxunction(){ send_button(); });
	// modalAddFooter(mymodal,footer);
}

function upload_photo_enterprise(){

    var photoviewer=$('#photo_viewer');
    var photo = photoviewer.attr('data-image');

    var timestamp_actual=new Date().getTime();
    var raw_input_params="timestamp="+timestamp_actual.toString()+"Q9eAZCIdRr1N9ecKXmT4j1d7XoM";
    var signature = SHA1(raw_input_params);
    var data_input = {file:photo,
                    api_key:'887587895112958',
                    timestamp:timestamp_actual.toString(),
                    signature:signature};
    var spinner = $('<i></i>').attr({'class':'fa fa-cog fa-spin'});
    spinner.css({'position': 'relative','top': '-110px','font-size':'60px','left':'170px'});
    photoviewer.append(spinner);
    $('.fa-floppy-o').css('display','none');
    $.ajax({
		url: "https://api.cloudinary.com/v1_1/dgcbgj5ab/image/upload",
        method:'post',
        data:data_input,
		success: function(data){
            var id = $('#enterprise_id').val();
            var params={id:id,logo:data.url};
            $.getJSON(api_url+'enterprises/edit?callback=?', params, function(data){
				if(data.status=='success'){

					launch_alert('<i class="fa fa-smile-o"></i> Imagen subida','');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');

                $('.fa-floppy-o').css('display','inline');
                spinner.remove();
			});

        },

        error: function(data){

            $('.fa-floppy-o').css('display','inline');
            launch_alert('<i class="fa fa-frown-o"></i> Error al subir la imagen','warning');
            spinner.remove();
        }

    });


}

function show_preview_photo_enterprise(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#photo_viewer').css('background', 'url('+e.target.result+') no-repeat');
            $('#photo_viewer').attr('data-image', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}





function miniModalMap() {
	$.getScript('https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=showMiniMap');
}

function miniModalMapHome() {
	showMiniMap();
}

function removeMarkers()
{
    for (var i = 0; i < markers.length; i++) {
    	if(markers[i]){
        	markers[i].setMap(null);
    	}
    }
}

function removeMarkersHome()
{
    for (var i = 0; i < markers_home.length; i++) {
    	if(markers_home[i]){
        	markers_home[i].setMap(null);
    	}
    }
}

function showMiniMap() {
	var lat = $('#minimap').attr('data-lat');
	var lon = $('#minimap').attr('data-long');
	var pos=new google.maps.LatLng(lat,lon);
	
    var myMapOptions = {
      zoom: 16,
      center:pos,
      disableDefaultUI: false,
	  mapTypeControl: false,
	  draggable: true,
	  scaleControl: false,
	  scrollwheel: true,
	  navigationControl: true,
	  streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
	  styles:[{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":60}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]}]
    };
	map = new google.maps.Map(document.getElementById("minimap"), myMapOptions);
	
	var myMarkerOptions = {
		position:pos,
		map: map,
        icon: 'http://f.cl.ly/items/0e3z3S37441J2Q0n0w0S/icono_posicion_usuario.png'
	}
	
    var marker = new google.maps.Marker(myMarkerOptions);
}


var map_enterprise;

function miniModalMapEnterprise() {
	$.getScript('https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=showMiniMapEnterprise');
}

function showMiniMapEnterprise() {
	var lat = $('#mapa_empresa').attr('data-lat');
	var lon = $('#mapa_empresa').attr('data-long');
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
	map_enterprise = new google.maps.Map(document.getElementById("mapa_empresa"), myMapOptions);
	
	var myMarkerOptions = {
		position:pos,
		map: map_enterprise,
        draggable: true,
        icon: 'http://f.cl.ly/items/0e3z3S37441J2Q0n0w0S/icono_posicion_usuario.png'
	};

	
    var marker = new google.maps.Marker(myMarkerOptions);

    google.maps.event.addListener(marker, 'dragend', function() {
        $('#mapa_empresa').attr('data-lat',this.position.lat());
        $('#mapa_empresa').attr('data-long',this.position.lng());

        geocodePosition(this.getPosition());

    });
}


function geocodePosition(pos) {

  var geocoder=new google.maps.Geocoder();

  geocoder.geocode({
    latLng: pos
  }, function(responses) {
    if (responses && responses.length > 0) {
      $('#enterprise_address').val(responses[0].formatted_address);
    }
  });
}