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
			startStats();
			$('#radio_title').html(myradio.name);
			if(myradio.digital){
				$('#radio_map').fadeIn();
			}
		}
		else super_error('Radio info failure');
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