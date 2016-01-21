function get_content() {
	
		$.getScript(media_url+'js/aux/date.js', function(){
			$.getScript(media_url+'js/aux/modals.js', function(){
				$.getScript(media_url+'js/aux/clientes.js', function(){
					$.post(base_url+'/partials/clientes_super', function(template, textStatus, xhr) {
						$('#main').html(template);
						$('#users_submenu div.button.passengers').addClass('active');
						$('#submain').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');

						var role = $('body').attr('data-role');
						loadRates();
						getPassengersStats();
						if (!Modernizr.inputtypes.date) {
    						$('input[type=date]').datepicker();
    						$('input[type=date]').css('border-bottom','1px solid lightgray');
    						$('#ui-datepicker-div').css('background-color','white');
        					$('#ui-datepicker-div').css('border','1px solid lightgray');
        					$('#ui-datepicker-div').css('padding','15px');
        					$('#ui-datepicker-div').css('border-radius','8px');
						}
					});
				});
			});
		});
	
}

function show_new() {
	if($('#new_customer_wrapper').css('display')=='none'){
		$('#new_customer_wrapper').slideDown();
	}
	else $('#new_customer_wrapper').slideUp();
}

function getPassengersStats() {
	var input = $('<input>').attr({'id':'input_search_passenger','class':'superinput', 'type':'text', 'placeholder':'Ej. Nombre, apellidos, email, etc.'}); $('#submain').html(input);
	input.focus();
	input.bind({
		keypress: function(e) {
			var code = e.keyCode || e.which;
			if(code == 13) searchPassengers();
		}
	});

	var results = $('<div></div>').attr({'class':'passengers_md_list sublista row', 'id':'results'}).css('margin-top','30px'); $('#submain').append(results);
	var stats = $('<div></div>').attr({'class':'passengers_stats', 'id':'stats'}).css('margin-top','30px'); $('#submain').append(stats);
	stats.html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-bar-chart-o"></i></div><div class="text">No hay clientes para tu búsqueda</div></div>');

}

function loadRates() {
	var select = $('#customer_rate');
	$.getJSON(api_url+'tarifas/list_all?callback=?', {}, function(data){
		////console.log(data.data)
		if(data.status=='success'){
			var list_tarifas=data.data.rates;
			for(var i=0;i<list_tarifas.length;i++){
            	id=list_tarifas[i].id;
            	nombres=list_tarifas[i].name;
            	var option=$('<option></option>').attr({'value':list_tarifas[i].id, 'data-credit-box':list_tarifas[i].credit_box, 'data-credit-wod':list_tarifas[i].credit_wod}).text(list_tarifas[i].name+" ("+list_tarifas[i].price+" €)"); select.append(option);
        	}

		}
		else super_error('Search failure');
	});
}

function searchPassengers() {
	var string = $('#input_search_passenger').val();
	var wrapper = $('#results');
	wrapper.empty();
	$.getJSON(api_url+'customers/search?callback=?', {lookup:string}, function(data){
		////console.log(data.data)
		if(data.status=='success'){

			if(data.data.list.length>0){
				$.each(data.data.list, function(index, passenger) {
					draw_passenger_sm(passenger, wrapper);
				});
			}
			else wrapper.empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">No se han encontrado pasajeros</div></div>');
		}
		else super_error('Search failure');
	});
}


