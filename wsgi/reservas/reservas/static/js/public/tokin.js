$(document).ready(function(){
	tokin();
})

function tokin() {
	var token = $('#launcher').attr('data-token');
	if(token!=undefined){
		$.getJSON( api_url+'auth/tokin?callback=?', {token:token}, function(data){
			if(data.status=='success') window.location=base_url+'/dashboard';
			else{
				$('#title').text('ERROR AL AUTENTICAR');
				$('#subtitle').hide();
				// $('#subtitle').html('<i class="fa fa-frown-o"></i>');
			}
		});
	}
	else{
		$('#title').text('Token incorrecto');
		$('#subtitle').hide();
	}
	return false;
}
