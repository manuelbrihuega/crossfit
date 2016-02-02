$(document).ready(function(){
	status();
	
	$('#li_login').hide();
	
	$('#login_form').submit(function(){
		signin();
		return false;
	})
})

function status() {
	$.getJSON( api_url+'auth/status?callback=?', '', function(data){
		if(data.status=='success' && data.response=='logged'){
			window.location=base_url+'/calendario';
		}
		else $('#signin').show();
	});
}


function signin() {
	
	$.getJSON(api_url+'auth/login?callback=?', {email:$('#email').val(), password:$('#password').val()}, function(data){
		////console.log(data);
		
		if(data.status=='success'){
			window.location=base_url+'/calendario';
			//console.log(data.response);
		
		}
		else{
            if(data.response == 'not_activated') login_alert('Usuario no validado');
            else login_alert(data.response);
        }
		
		
		
		
	});
	
}

function login_alert(message) {
	$('#alert_form').text(message);
}