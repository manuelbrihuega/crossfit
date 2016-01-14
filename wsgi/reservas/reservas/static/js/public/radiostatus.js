$(document).ready(function(){
    $.when(
    	$.getScript(media_url+'js/aux/date.js'),
        $.ready.promise()
    ).then(function(){
        getstatus();
		startCounter();
    });
	
	$('#brand').append('<span>STATUS</span>');
	$('#menu').append('<li id="li_counter"><i class="fa fa-refresh"></i> <span></span></li>');
	$('#li_login').add('#li_blog').add('#li_lang').add('#footer').hide();
	

})

//CONTADOR DE RESETEO CADA 30 MINUTOS

var timerReload;
var counterReload;

function startCounter () {
    clearTimeout(timerReload);
    counterReload=30;
    goReload();
}

function goReload() {
    if(counterReload==0){
        document.location.reload(true);
    }else{
		if(counterReload<3) $('#li_counter i').addClass('fa-spin');
        timerReload = setTimeout(function(){
            counterReload--;
            goReload();
        },1000);
    }
	$('#li_counter span').text(counterReload);
}



function getstatus() {
	$('#list_status_radios').empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-refresh fa-spin"></i></div><div class="text">Cargando</div></div>');
	$.getJSON( api_url+'radios/list_status?callback=?',  {offset:local_offset}, function(data){
		if(data.status=='success'){
			if(data.data.length>0){
				$('#list_status_radios').empty();
				$.each(data.data, function(index, radio) {
					drawRadio(radio)
				});
			}
		}
		else{}
		
	});
}


function drawRadio(radio) {
	var sm3 = $('<div></div>').attr({'class':'col-sm-4'}); $('#list_status_radios').append(sm3);

	var item_class = radio.status;

	var item = $('<div></div>').attr({'class':'item '+item_class, 'data-id':radio.id}); sm3.append(item);
	var title = $('<div></div>').attr({'class':'title'}).text(radio.name); item.append(title);
	var country = $('<div></div>').attr({'class':'country'}).text(radio.country+' | '); item.append(country);
		var a = $('<a></a>').attr({'href':'tel:'+radio.phone}).text(radio.phone); country.append(a);
		
	if(radio.status=='on') var fecha='CONECTADO';
	else{
		if(radio.date.length==0) var fecha = 'NUNCA';
		else {
			var fecha = fecha_castellano_dia_mes(radio.date) + ' ' + fecha_solo_hora(radio.date);
		}
	}
	var date = $('<div></div>').attr({'class':'date'}).text(fecha); item.append(date);

	item.click(function(){
		window.location=base_url+'/radio/'+radio.id;
	})
}
