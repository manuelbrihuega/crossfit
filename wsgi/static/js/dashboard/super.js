function get_content() {
	
    $.when(
    	$.getScript(media_url+'js/aux/tarifas.js'),
    	$.getScript(media_url+'js/aux/clientes.js'),
    	$.getScript(media_url+'js/aux/modals.js'),
    	$.getScript(media_url+'js/aux/date.js'),
        $.ready.promise()
    ).then(function(){
		$.post('partials/dashboard_super', function(template, textStatus, xhr) {
			$('#main').html(template);
			//startSearch();
		});
    });

}

/*
function startSearch() {
	var input = $('#global_search');
	input.focus();
	input.bind({
		keypress: function(e) {
			var code = e.keyCode || e.which;
			if(code == 13) globalSearch();
		}
	});
	
}

function globalSearch() {
	$('h1.page-header i').show();
	searchJourneys(0);
}


function searchJourneys(flag) {
	var string = $('#global_search').val();
	var category=$('#result_journeys');
	var result_wrapper = category.find('.results');
	
	$.getJSON(api_url+'journeys/search?callback=?', {lookup:string, offset:local_offset}, function(data){
		if(data.status=='success'){
			if(data.data.journeys.length>0){
				var wrapper = $('<div></div>').attr({'class':'journeys_md_list'}).css('margin-top','30px'); result_wrapper.html(wrapper);
				$.each(data.data.journeys, function(index, journey) {
					draw_journey_md(journey, wrapper);
				});
				category.slideDown();
				searchPassengers(flag+1);
			}
			else{
				category.slideUp();
				searchPassengers(flag);
			}
			
		}
		else result_wrapper.html('<p class="text-danger">Error al buscar carreras</p>');
	});
}

function searchPassengers(flag) {
	var string = $('#global_search').val();
	var category=$('#result_pasajeros');
	var result_wrapper = category.find('.results');
	result_wrapper.empty();
	$.getJSON(api_url+'passengers/search?callback=?', {lookup:string}, function(data){
		
		if(data.status=='success'){
			if(data.data.list.length>0){
				$.each(data.data.list, function(index, passenger) {
					draw_passenger_sm(passenger, result_wrapper);
				});
				category.slideDown();
				searchRadios(flag+1);
			}
			else{
				category.slideUp();
				searchRadios(flag);
			}
			
		}
		else result_wrapper.html('<p class="text-danger">Error al buscar pasajeros</p>');

	});
	
}


function searchRadios(flag) {
	var string = $('#global_search').val();
	var category=$('#result_radios');
	var result_wrapper = category.find('.results');
	result_wrapper.empty();
	$.getJSON(api_url+'radios/search?callback=?', {lookup:string}, function(data){
		
		if(data.status=='success'){
			if(data.data.length>0){
				$.each(data.data, function(index, radio) {
					draw_radio_sm(radio, result_wrapper);
				});
				category.slideDown();
				searchEnterprises(flag+1);
			}
			else{
				category.slideUp();
				searchEnterprises(flag);
			}
			
		}
		else result_wrapper.html('<p class="text-danger">Error al buscar radios</p>');

	});
	

	
}

function searchEnterprises(flag) {
	var string = $('#global_search').val();
	var category=$('#result_enterprises');
	var result_wrapper = category.find('.results');
	result_wrapper.empty();
	$.getJSON(api_url+'enterprises/search?callback=?', {lookup:string}, function(data){
		
		if(data.status=='success'){
			if(data.data.length>0){
				$.each(data.data, function(index, empresa) {
					draw_enterprise_sm(empresa, result_wrapper, '');
				});
				category.slideDown();
				searchDrivers(flag+1);
			}
			else{
				category.slideUp();
				searchDrivers(flag);
			}
			
		}
		else result_wrapper.html('<p class="text-danger">Error al buscar empresas</p>');

	});
	

	
}


function searchDrivers(flag) {
	var string = $('#global_search').val();
	var category=$('#result_taxistas');
	var result_wrapper = category.find('.results');
	result_wrapper.empty();
	$.getJSON(api_url+'drivers/search?callback=?', {lookup:string}, function(data){
		
		if(data.status=='success'){
			if(data.data.list_drivers.length>0){
				$.each(data.data.list_drivers, function(index, driver) {
					draw_driver_sm(driver, result_wrapper);
				});
				category.slideDown();
				studyflag(flag+1);
			}
			else{
				category.slideUp();
				studyflag(flag);
			}
			
		}
		else result_wrapper.html('<p class="text-danger">Error al buscar taxistas</p>');

	});

}

function studyflag(flag) {
	$('h1.page-header i').hide();
	if(flag) $('#flag').empty();
	else $('#flag').html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin resultados.</div></div>');
	
}
*/

