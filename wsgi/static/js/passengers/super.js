function get_content() {
	$.getScript(media_url+'js/aux/journeys.js', function(){
		$.getScript(media_url+'js/aux/date.js', function(){
			$.getScript(media_url+'js/aux/modals.js', function(){
				$.getScript(media_url+'js/aux/passengers.js', function(){
					$.post(base_url+'/partials/passengers_super', function(template, textStatus, xhr) {
						$('#main').html(template);
						$('#users_submenu div.button.passengers').addClass('active');
						$('#submain').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');

						var role = $('body').attr('data-role');
						if (role == 'U_Delegations') {
							$('.button.operators').hide();
						}
						getPassengersStats();
					});
				});
			});
		});
	});


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
	stats.html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-bar-chart-o"></i></div><div class="text">AQUI VAN LAS ESTADISTICAS DE PASAJEROS</div></div>');

}



function searchPassengers() {
	var string = $('#input_search_passenger').val();
	var wrapper = $('#results');
	wrapper.empty();
	$.getJSON(api_url+'passengers/search?callback=?', {lookup:string}, function(data){
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

