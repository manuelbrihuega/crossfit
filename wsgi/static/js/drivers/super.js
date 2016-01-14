function get_content() {
	
	$.getScript(media_url+'js/aux/journeys.js', function(){
		$.getScript(media_url+'js/aux/date.js', function(){
			$.getScript(media_url+'js/aux/drivers.js', function(){
				$.getScript(media_url+'js/aux/modals.js', function(){
					$.post('partials/drivers_super', function(template, textStatus, xhr) {
						$('#main').html(template);
                        subselect('pending');
					});
				});
			});
		});
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
	$('#drivers_submenu .button').removeClass('active');
	$('#drivers_submenu .button.'+subseccion).addClass('active');
	$('#submain').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');

	switch (subseccion) {
		case 'validated': 	startValidated(); break;
		case 'pending': 	startPending(); break;
		case 'new_radio': 	startNewRadio(); break;
		case 'search': 		startSearch(); break;
		default: 			subselect('pending');
	}
}

function startPending() {
    var wrapper = $('<div></div>').attr({'id':'pending_drivers','class':'drivers_list_md'});
    $('#submain').html(wrapper);
	$.getJSON(api_url+'drivers/list_pending?callback=?', function(data){
		wrapper.empty();
		if(data.status=='success'){
			$.each(data.data, function(index, driver) {
                if(driver.radio_id && driver.validated!='1') draw_driver_md(driver, wrapper);
			});
		}
	});
}




function startSearch() {
	var input = $('<input>').attr({'id':'drivers_search','class':'superinput','type':'text','placeholder':'Ej. Nombre, email, licencia etc.'});
    var wrapper = $('<div></div>').attr({'id':'result_taxistas','class':'row sublista'});
    $('#submain').html(input);
    $('#submain').append(wrapper);

	input.focus();
	input.bind({
		keypress: function(e) {
			var code = e.keyCode || e.which;
			if(code == 13) searchDrivers();
		}
	});
	
}


function searchDrivers() {
	$('h1.page-header i').show();
	var string = $('#drivers_search').val();
	var wrapper = $('#result_taxistas');
	wrapper.empty();
	$.getJSON(api_url+'drivers/search?callback=?', {lookup:string}, function(data){
		if(data.status=='success'){
			if(data.data.list_drivers.length>0){
				$.each(data.data.list_drivers, function(index, driver) {
					draw_driver_sm(driver, wrapper);
				});
			}
			else wrapper.empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">No se han encontrado taxistas</div></div>');
			
		}
		else super_error('Search failure');
		$('h1.page-header i').hide();
	});
}




function startValidated(){
    var wrapper = $('<div></div>').attr({'id':'pending_drivers','class':'drivers_list_md'});
    $('#submain').html(wrapper);
	$.getJSON(api_url+'drivers/list_pending?callback=?', function(data){
		wrapper.empty();
		if(data.status=='success'){
			$.each(data.data, function(index, driver) {
                if(driver.radio_id && driver.validated=='1') draw_driver_md(driver, wrapper);
			});
		}
	});

}

function startNewRadio(){
    var wrapper = $('<div></div>').attr({'id':'pending_drivers','class':'drivers_list_md'});
    $('#submain').html(wrapper);
	$.getJSON(api_url+'drivers/list_pending?callback=?', function(data){
		wrapper.empty();
		if(data.status=='success'){
			$.each(data.data, function(index, driver) {
                if(driver.radio_id=="0") draw_driver_md(driver, wrapper);
			});
		}
	});
}

