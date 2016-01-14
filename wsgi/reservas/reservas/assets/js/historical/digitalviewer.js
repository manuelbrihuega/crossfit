function get_content() {
	
			$.getScript(media_url+'js/aux/modals.js', function(){
				$.getScript(media_url+'js/aux/journeys.js', function(){
					$.getScript(media_url+'js/aux/date.js', function(){
					$.getScript(media_url+'js/lib/jquery.keypad.min.js', function(){
					$.getScript(media_url+'js/lib/jquery.keypad-es.js', function(){
						$.post(base_url+'/partials/dashboard_digital_viewer', function(template, textStatus, xhr) {
							$('#main').html(template);
							loadRadio();
							//loadGuard();
							//startWakeup();
							//startStatus();
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
			startHistorical();
			$('#radio_title').html(myradio.name);
			if(myradio.digital){
				$('#radio_map').fadeIn();
			}
		}
		else super_error('Radio info failure');
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