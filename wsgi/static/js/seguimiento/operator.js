function get_content() {
    $.when(
        $.getScript(media_url+'js/aux/journeys.js'),
	    $.getScript(media_url+'js/aux/modals.js'),
	    $.getScript(media_url+'js/aux/sound.js'),
    	$.getScript(media_url+'js/aux/date.js'),
    	$.getScript('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js'),
        $.ready.promise()
    ).then(function(){
		
		$.post('partials/journeys_operator', function(template, textStatus, xhr) {
			$('#main').html(template);
			// subselect('historical');
			loadRadios();
			checkhash();
			var journeymodal = getQueryVariable('journey');
			if(journeymodal){
				modal_journey_details_operator(journeymodal);
			}
		});
		
	});
	
	
	
}

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("?");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

// HASH
function checkhash() {
	var hash = window.location.hash.substring(1);
	if(hash.length>0) subselect(hash);
	else subselect('pending');
}


function subselect(subseccion) {
	sethash(subseccion);
	$('#journeys_submenu .button').removeClass('active');
	$('#journeys_submenu .button.'+subseccion).addClass('active');
	$('#submain').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	
	switch (subseccion) {
		case 'historical': 	startHistorical(); break;
		case 'pending': 	startPending(); break;
		case 'reserves': 	startReserves(); break;
		case 'search': 		startSearch(); break;
		default: 			subselect('pending');
	}
}




// HISTORICAL
function startHistorical() {
	// $('#submain').html('startHistorical');
	
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

// OPERATOR DATA // FORMULARIOS

var radios = false;
var radio = false;
var radioUnica = false;

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

function selectRadio() {
	var id = radioUnica.radio_id;
	radio = _.find(radios, function(r){ return r.radio_id == id; });
}

function showDaily(fecha) {
	if($('#rowVacio')){
		$('#rowVacio').remove();
	}
	$('#daily_list').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').css({'margin-top':'40px'});
	
	var mydate=fecha.split("/");
	
	
	$.getJSON(api_url+'radios/daily?callback=?', {day:mydate[0], id:radio.radio_id, month:mydate[1], year:mydate[2], offset:local_offset}, function(data){
		if(data.status=='success'){
			
			$('#daily_list').empty();
			$.each(data.data, function(index, journey) {
				draw_journey_sm_operator(journey, $('#daily_list'));
			});
			if(data.data.length==0){
				$('#main').append('<div id="rowVacio" style="font-size: 21px; text-align: center;"><span>No hay carreras para este día</span></div>')
			}
			
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


// PENDING
function startPending() {
	if($('#rowVacio')){
		$('#rowVacio').remove();
	}
	$.getScript('http://code.jquery.com/ui/1.9.1/jquery-ui.min.js').done(function () {
	    if($('.button.pending').hasClass('active')){
	    	var rad = radio.radio_id;
	    	if (rad!=''){
		        $.getJSON(api_url+'radios/list_pending?callback=?', {offset:local_offset, radio_id:rad}, function(data){
		            if(data.status=='success'){
		                if(data.data.journeys.length>0){
							
		                    var submain = $('#submain');
							var items = $('.journeys_sm_list>.item').length;
							var wrapper = $('<div></div>').attr({'class':'journeys_sm_list'});
							submain.empty().html(wrapper);;
							
		                    for(var i=0;i<data.data.journeys.length;i++){
		                        var journey = data.data.journeys[i];
		                        draw_journey_sm_operator(journey, wrapper);
		                    }
							
							if(data.data.journeys.length>0 && data.data.journeys.length!=items) play_sound('incoming_journey.mp3');
							
		                    

		                }

		                else $('#submain').empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin carreras pendientes.</div></div>');
						
						if($('.button.pending').hasClass('active')) setTimeout(function(){startPending();},5000);
		            }
		            else super_error('Pending failure');
		        });
			}
	    }
	},true);

}


// RESERVES
function startReserves() {
	if($('#rowVacio')){
		$('#rowVacio').remove();
	}
    if($('.button.reserves').hasClass('active')){
        $.getJSON(api_url+'radios/list_actives_reserves?callback=?', {offset:local_offset, radio_id:radio.radio_id}, function(data){
            if(data.status=='success'){

                if(data.data.journeys.length>0){

                    var submain = $('#submain');
					var wrapper = $('<div></div>').attr({'class':'journeys_sm_list'});
					submain.empty().html(wrapper);;
					
                    for(var i=0;i<data.data.journeys.length;i++){
                        var journey = data.data.journeys[i];
                        draw_journey_sm_operator(journey, wrapper);
                    }
					
					if(data.data.journeys.length>0) play_sound('incoming_journey.mp3');

                }

                else $('#submain').empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin carreras reservadas.</div></div>');

            }
            else super_error('Reserves failure');
        });
    }


}


// SEARCH
function startSearch() {
	if($('#rowVacio')){
		$('#rowVacio').remove();
	}
	var input = $('<input>').attr({'id':'input_search_journey','class':'superinput', 'type':'text', 'placeholder':'Ej. Dirección, código postal, etc.'}); $('#submain').html(input);
	input.focus();
	input.bind({
		keypress: function(e) {
			var code = e.keyCode || e.which;
			if(code == 13) searchJourneys();
		}
	});
	
}

function searchJourneys() {
	if($('.journeys_md_list')){
		$('.journeys_md_list').remove();
	}
	var string = $('#input_search_journey').val();
	$.getJSON(api_url+'radios/search_journeys?callback=?', {lookup:string, offset:local_offset,radio_id:radio.radio_id}, function(data){
		if(data.status=='success'){
			if(data.data.journeys.length>0){
				var wrapper = $('<div></div>').attr({'class':'journeys_md_list'}).css('margin-top','30px'); $('#submain').append(wrapper);
				$.each(data.data.journeys, function(index, journey) {
					
					draw_journey_sm_operator(journey, wrapper);
				});
			}
			else $('#submain').empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin carreras.</div></div>');
			
		}
		else super_error('Search failure');
	});
}
