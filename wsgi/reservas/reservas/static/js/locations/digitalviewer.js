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
			startLocations();
			$('#radio_title').html(myradio.name);
			if(myradio.digital){
				$('#radio_map').fadeIn();
			}
		}
		else super_error('Radio info failure');
	});
}

// LOCATIONS
function startLocations() {

	$.post(base_url+'/partials/radio_locations_super', function(template, textStatus, xhr) {
		$('#submain').html(template);
		$('#new_location_radio_id').val(myradio.id);
		$('#new_location_locality').val(myradio.city);
		$('#new_location_country_code').val(myradio.country_code);
		$('#new_location_postal_code').focus();
		$('#new_location_form').submit(false).submit(function(e){
			new_location();
			return false;
		});
		location_list();
	});

	
}

function location_list() {
	$.getJSON(api_url+'radios/list_locations?callback=?', {id:myradio.id}, function(data){
		if(data.status=='success'){
			var wrapper = $('#locations_list');
			
			if(data.data.length>0){
				
				wrapper.empty();
				$.each(data.data, function(index, location) {
					var col = $('<div></div>').attr({'class':'col-sm-4'}); wrapper.append(col);
					var item = $('<div></div>').attr({'class':'item'}); col.append(item);
					var minutes = $('<div></div>').attr({'class':'minutes'}).text(location.minutes); item.append(minutes);
					var cp = $('<div></div>').attr({'class':'cp'}).text(location.postal_code); item.append(cp);
					var locality = $('<div></div>').attr({'class':'locality'}).text(location.locality); item.append(locality);
					
					item.click(function(){
						modal_locations_details(location.id);
					})
				});
			}
			else wrapper.empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin carreras pendientes.</div></div>');
	
			
		}
		else super_error('Locations failure');
	});
}

function new_location() {
	var radio_id=$('#new_location_radio_id').val();
	var postal_code=$('#new_location_postal_code').val();
	var locality=$('#new_location_locality').val();
	var country_code=$('#new_location_country_code').val();
	var minutes=$('#new_location_minutes').val();
	$('#new_location_submit').html('<i class="fa fa-cog fa-spin"></i>');
	
	if (postal_code.length>0){
		if(locality.length>0){
		
			$.getJSON(api_url+'locations/add?callback=?', {	radio_id:radio_id, 
															postal_code:postal_code,
															locality:locality,
															country_code:country_code,
															minutes:minutes}, function(data){
																
				if(data.status=='success'){
					location_list();
					launch_alert('<i class="fa fa-smile-o"></i> Localización creada','');
					$('#new_location_submit').html('Enviar');
					$('#new_location_postal_code').focus();
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
				////console.log(data);
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir la localidad','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un código postal','warning');
	
}