function get_content() {

	$.getScript(media_url+'js/aux/journeys.js');
	$.getScript(media_url+'js/aux/modals.js');
	$.getScript(media_url+'js/aux/date.js', function(){

		$.post('partials/users_super', function(template, textStatus, xhr) {
			$('#main').html(template);
			// subselect('historical');
			// checkhash();

			var role = $('body').attr('data-role');
			if (role == 'U_Delegations') {
				$('.button.operators').hide();
			}
		});

	});



}
