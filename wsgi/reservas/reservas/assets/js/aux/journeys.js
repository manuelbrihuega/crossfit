function draw_journey_sm(journey, wrapper) {
	var row = $('<div></div>').attr({'class':'row item sm', 'data-id':journey.id}); wrapper.append(row);
	row.addClass(journey.status);
	row.click(function(){
		modal_journey_details(journey.id);
	})
	
	if(journey.date) var mydate=fecha_con_hora(journey.date);
	var date = $('<div></div>').attr({'class':'col-sm-2 date'}).text(mydate); row.append(date);
	var caller = $('<div></div>').attr({'class':'col-sm-3 caller'}).text(journey.user); row.append(caller);
	var called = $('<div></div>').attr({'class':'col-sm-3 called'}).text(journey.radio); row.append(called);
	var origin = $('<div></div>').attr({'class':'col-sm-4 origin'}).text(journey.address); row.append(origin);
	
}

function draw_journey_sm_operator(journey, wrapper) {
    var row = $('<div></div>').attr({'class':'row item sm', 'data-id':journey.id}); wrapper.append(row);
    row.addClass(journey.status);
    row.click(function(){
        modal_journey_details_operator(journey.id);
    })
    if(journey.status=='completed'){
        var status = $('<div></div>').attr({'class':'col-sm-2 date','style':'color:#94C522;'}).text('COMPLETADA'); row.append(status);
    }
    if(journey.status=='canceled'){
        var status = $('<div></div>').attr({'class':'col-sm-2 date','style':'color:#98000A;'}).text('CANCELADA'); row.append(status);
    }
    if(journey.status=='pending'){
        var status = $('<div></div>').attr({'class':'col-sm-2 date','style':'color:#f19209;'}).text('PENDIENTE'); row.append(status);
    }
    if(journey.status=='assigned'){
        var status = $('<div></div>').attr({'class':'col-sm-2 date','style':'color:#419959;'}).text('ASIGNADA'); row.append(status);
    }
    if(journey.status=='accepted'){
        var status = $('<div></div>').attr({'class':'col-sm-2 date','style':'color:#419959;'}).text('ACEPTADA'); row.append(status);
    }
    if(journey.status=='picked'){
        var status = $('<div></div>').attr({'class':'col-sm-2 date','style':'color:#1ecbf0;'}).text('RECOGIDA'); row.append(status);
    }
    if(journey.status=='reserved'){
        var status = $('<div></div>').attr({'class':'col-sm-2 date','style':'color:#999;'}).text('RESERVA'); row.append(status);
    }
    if(journey.date) var mydate=fecha_con_hora(journey.date);
    
    var date = $('<div></div>').attr({'class':'col-sm-2 date'}).text(mydate); row.append(date);
    var caller = $('<div></div>').attr({'class':'col-sm-2 caller'}).text(journey.user); row.append(caller);
    var called = $('<div></div>').attr({'class':'col-sm-1 called'}).text(journey.user_phone); row.append(called);
    var origin = $('<div></div>').attr({'class':'col-sm-4 origin'}).text(journey.address); row.append(origin);
    var licence = $('<div></div>').attr({'class':'col-sm-1 date'}).text(journey.driver); row.append(licence);
}

function modify_journey_sm(journey) {
    var row=$('.item[data-id="'+journey.id+'"]');
    if (!row.hasClass(journey.status)) {
        row.removeClass();
        row.addClass('row item sm');
        row.addClass(journey.status);
    }
}

function delete_journey_sm(journey_id) {
    var row=$('.item[data-id="'+journey_id+'"]');
    row.remove();
}

function draw_journey_md(journey, wrapper) {
	var row = $('<div></div>').attr({'class':'row item md', 'data-id':journey.id}); wrapper.append(row);
	row.addClass(journey.status);
	row.click(function(){
		modal_journey_details(journey.id);
	})
	
	if(journey.date) var mydate=fecha_con_hora(journey.date);
	var time = $('<div></div>').attr({'class':'col-sm-2 date'}).text(mydate); row.append(time);
	var caller = $('<div></div>').attr({'class':'col-sm-3 caller'}).text(journey.user); row.append(caller);
	var called = $('<div></div>').attr({'class':'col-sm-3 called'}).text(journey.radio); row.append(called);
	var origin = $('<div></div>').attr({'class':'col-sm-4 origin'}).text(journey.address); row.append(origin);
	
}

function draw_journey_viewer(journey, wrapper, assigment) {
	var row = $('<div></div>').attr({'class':'row item viewer', 'data-id':journey.id}); wrapper.append(row);
	row.addClass(journey.status);
	
	if(journey.date_depart){
       var mydate=fecha_castellano_dia_mes(journey.date_depart);
       var mytime=fecha_solo_hora(journey.date_depart);
    }
    if(journey.role=='U_Passengers') var mytype="Pasajero"
    if(journey.role=='U_Buttons') var mytype="Empresa"

	var date = $('<div></div>').attr({'class':'col-md-1 date'}); row.append(date);
	var day = $('<div></div>').attr({'class':'date'}).text(mydate); date.append(day);
	var time = $('<div></div>').attr({'class':'time'}).text(mytime); date.append(time);
	var caller = $('<div></div>').attr({'class':'col-md-3 caller'}); row.append(caller);
	    var type = $('<div></div>').attr({'class':'title'}).text(mytype+':'); caller.append(type);
	    var name = $('<div></div>').attr({'class':'caller'}).text(journey.user); caller.append(name);
	    var email = $('<div></div>').attr({'class':'caller'}).text(journey.email); caller.append(email);
	    var phone = $('<div></div>').attr({'class':'caller_phone'}).text(journey.phone); caller.append(phone);
	var address = $('<div></div>').attr({'class':'col-md-4 origin'}); row.append(address);
	    var origin = $('<div></div>').attr({'class':'title'}).text("Dirección de recogida"); address.append(origin);
	    var origin = $('<div></div>').attr({'class':'origin'}).text(journey.origin); address.append(origin);
        if (journey.destination.address!="") {
            var destination = $('<div></div>').attr({'class':'title'}).text("Destino"); address.append(destination);
	        var destination = $('<div></div>').attr({'class':'origin'}).text(journey.destination.address); address.append(destination);
        }

    var features = $('<div></div>').attr({'class':'col-md-2 caller'}); row.append(features);
    if(journey.features.length>0){
        var feat_title = $('<div></div>').attr({'class':'title'}).text("Características"); features.append(feat_title);
        for(var i=0;i<journey.features.length;i++){
            var feat = $('<div></div>').attr({'class':'features'}).text(journey.features[i].description); features.append(feat);
        }
    }

    if(journey.indications!=""){
        var indications_title = $('<div></div>').attr({'class':'title'}).text("Indicaciones:"); features.append(indications_title);
        var indications = $('<div></div>').attr({'class':'features'}).text(journey.indications); features.append(indications);
    }


	var actions = $('<div></div>').attr({'class':'col-sm-2 actions clearfix'}); row.append(actions);
	
	date.add(caller).add(address).add(features).click(function(){ modal_journey_details(journey.id); });
	
	if(journey.status=='cancelation_request'){
		var request_longbutton = $('<div></div>').attr({'class':'longbutton request pull-right'}); actions.append(request_longbutton);
		var label = $('<div></div>').attr({'class':'aviso'}).html('CANCELADO POR<BR>EL PASAJERO'); request_longbutton.append(label);
		request_longbutton.click(function(){ modal_cancel_journey(journey.id,true); });
	}
	else{
		if(assigment){
			var assign_longbutton = $('<div></div>').attr({'class':'longbutton assign pull-right'}); actions.append(assign_longbutton);
			var label = $('<div></div>').attr({'class':'label'}).html('IDENTIFICADOR'); assign_longbutton.append(label);
			var licence = $('<input>').attr({'class':'licence-input', 'type':'text'}); assign_longbutton.append(licence);
		
			licence.bind({
				keypress: function(e) {
					var code = e.keyCode || e.which;
					if(code == 13){
						var num_licence = licence.val();
						label.html('<i class="fa fa-cog fa-spin"></i>');
						$.getJSON(api_url+'journeys/assigned_viewer?callback=?', {id:journey.id,licence:num_licence}, function(data){
							if(data.status=='success') launch_alert('<i class="fa fa-smile-o"></i> Carrera assignada','');
							else launch_alert('<i class="fa fa-frown-o"></i> Error al asignar carrera','warning');
						});
					}
				}
			});

            studyTactil(journey,licence);
		}
		
		var cancel_button = $('<div></div>').attr({'class':'longbutton cancel pull-right'}).html('CANCELAR'); actions.append(cancel_button);
        if(!assigment){
            var aviso = $('<div></div>').attr({'class':'col-sm-11', 'style':'float:right; padding-right:0px; font-size: 12px;'}).html('<span>Recuerda que pasará a pendiente cuando queden 15 min para su inicio</span>'); actions.append(aviso);    
        }
        cancel_button.click(function(){ modal_cancel_journey(journey.id,false); });
		
	}

}

function price_to_string(price, currency)
{
	return currency+' '+price;
}

function distance_to_string(distance)
{
	if(distance==0) return '';
	else if(distance<1000) return distance+' m.';
	else return (distance/1000).toFixed(1)+ ' kms.'
}

function duration_to_string(duration)
{
	if(duration==0) return '';
	else if(duration<60) return duration+' seg.';
	else return parseInt(duration/60)+ ' min.'
}


function studyTactil(journey,licence){
    var navegador = navigator.userAgent.toLowerCase();
    var label=$(licence).siblings('.label');

    if ("ontouchstart" in document.documentElement && (navegador.search(/iphone|ipod|android/) <0))
        {
        licence.keypad({regional:'es', prompt: '', keypadOnly:false,
            layout: ['123', '456', '789','0'+$.keypad.CLEAR],
            beforeShow: function(div, inst) {

                var boton=$('<div></div>').addClass('keypad-key asignar').html('Asignar');
                    boton.
                        appendTo(div).click(function() {
                            var num_licence = licence.val();
                            label.html('<i class="fa fa-cog fa-spin"></i>');
                            $.getJSON(api_url+'journeys/assigned_viewer?callback=?', {id:journey.id,licence:num_licence}, function(data){
                                if(data.status=='success') launch_alert('<i class="fa fa-smile-o"></i> Carrera assignada','');
                                else launch_alert('<i class="fa fa-frown-o"></i> Error al asignar carrera','warning');
                            });
                    });


                }
            });

        }


}



function cancel_journey(journey_id) {
    if (confirm("¿Seguro que quieres cancelar la carrera?")){
		if(theroles[myrole]!=undefined) var reason = 'Cancelado por '+theroles[myrole];
		else var reason = 'Cancelado desde el backend';
		
        $.getJSON( api_url+'journeys/cancel_foreign?callback=?', {id:journey_id, reason_cancelation:reason}, function(data){
            if(data.status=='success'){
                $('#journey_details_modal').modal('hide');
                launch_alert('<i class="fa fa-smile-o"></i> Carrera cancelada','');
                if (typeof startHistorical == 'function') startHistorical();

            }
            else launch_alert('<i class="fa fa-frown-o"></i> Error al cancelar carrera','warning');
        });
    }

}

function complete_journey(journey_id) {
    if (confirm("¿Seguro que quieres completar la carrera?")){
        $.getJSON( api_url+'journeys/complete_foreign?callback=?', {id:journey_id}, function(data){
            if(data.status=='success'){
                $('#journey_details_modal').modal('hide');
                launch_alert('<i class="fa fa-smile-o"></i> Carrera completada','');
                if (typeof startHistorical == 'function') startHistorical();

            }
            else launch_alert('<i class="fa fa-frown-o"></i> Error al completar carrera','warning');
        });
    }
}

function setpending_journey(journey_id) {
    if (confirm("¿Seguro que quieres poner a pendiente la carrera?")){
        $.getJSON( api_url+'journeys/set_pending_foreign?callback=?', {id:journey_id}, function(data){
            if(data.status=='success'){
                $('#journey_details_modal').modal('hide');
                launch_alert('<i class="fa fa-smile-o"></i> Carrera cambiada a pendiente','');
                if (typeof startHistorical == 'function') startHistorical();

            }
            else launch_alert('<i class="fa fa-frown-o"></i> Error al poner pendiente la carrera','warning');
        });
    }
}

function purge_journey(journey_id) {
    if (confirm("¿Seguro que quieres purgar la carrera?")){
        $.getJSON( api_url+'journeys/purge_foreign?callback=?', {id:journey_id}, function(data){
            if(data.status=='success'){
                $('#journey_details_modal').modal('hide');
                launch_alert('<i class="fa fa-smile-o"></i> Carrera purgada','');
                if (typeof startHistorical == 'function') startHistorical();

            }
            else launch_alert('<i class="fa fa-frown-o"></i> Error al purgar la carrera','warning');
        });
    }
}


function setpending_journey_viewer(journey_id) {
    if (confirm("¿Seguro que quieres poner pendiente la carrera?")){
        $.getJSON( api_url+'journeys/set_pending_viewer?callback=?', {id:journey_id}, function(data){
            if(data.status=='success'){
                $('#journey_details_modal').modal('hide');
                launch_alert('<i class="fa fa-smile-o"></i> Carrera cambiada a pendiente','');
                if (typeof startHistorical == 'function') startHistorical();

            }
            else launch_alert('<i class="fa fa-frown-o"></i> Error al poner pendiente la carrera','warning');
        });
    }
}

function cancel_journey_viewer(journey_id) {
    if (confirm("¿Seguro que quieres cancelar la carrera?")){
		
		if(theroles[myrole]!=undefined) var reason = 'Cancelado por '+theroles[myrole];
		else var reason = 'Cancelado desde el backend por el gestor';
		
		
        $.getJSON( api_url+'journeys/canceled_viewer?callback=?', {id:journey_id, reason_cancelation:reason}, function(data){
            if(data.status=='success'){
                $('#journey_details_modal').modal('hide');
                launch_alert('<i class="fa fa-smile-o"></i> Carrera cancelada','');
                if (typeof startHistorical == 'function') startHistorical();

            }
            else launch_alert('<i class="fa fa-frown-o"></i> Error al cancelar la carrera','warning');
        });
    }
}

function assign_journey_viewer(journey_id) {
    if (confirm("¿Seguro que quieres asignar la carrera?")){
        $.getJSON( api_url+'journeys/assigned_viewer?callback=?', {id:journey_id}, function(data){
            if(data.status=='success'){
                $('#journey_details_modal').modal('hide');
                launch_alert('<i class="fa fa-smile-o"></i> Carrera asignada','');
                if (typeof startHistorical == 'function') startHistorical();

            }
            else launch_alert('<i class="fa fa-frown-o"></i> Error al asignar la carrera','warning');
        });
    }
}