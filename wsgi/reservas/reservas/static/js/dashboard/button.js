function get_content() {
	
	$.post(base_url+'/partials/dashboard_button', function(template, textStatus, xhr) {
	 	$('#main').html(template);
		
		abre_pulsador();
			
	
	
	});
	
	
}


var pulsador=false;

function abre_pulsador () {
    pulsador = window.open(base_url+'/button', "PedirTaxi", "location=0,status=0,scrollbars=0,width=440,height=680");
    
    
    setTimeout(function() {
    	if (pulsador && pulsador.outerHeight != 0 && !pulsador.closed){
    	    pulsador.moveTo(0,0);
        	window.focus();
        	$('#loading').add('#error').hide();
        	$('#success').show();
    	
    	}
    	else{
    	    $('#loading').add('#success').hide();
        	$('#error').show();
    	}
	}, 2000);
}


function cierra () {
    if (pulsador && pulsador.outerHeight != 0){
        if (navigator.userAgent.indexOf('MSIE 6.0') > 0)
            window.opener='x';
        if (parent.window.location == window.location)
        {
            window.open("","_self");
            window.close();
        }
        else
            parent.window.close();
    }
}

function ver_tutorial () {
    if($('#tutorial').css('display')=='none') $('#tutorial').slideDown();
    else $('#tutorial').slideUp();
}