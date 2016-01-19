$(document).ready(function(){

    list_radios();
});

var prefix=34;

function list_radios(){
    var lang=$('body').attr('data-lang');
    $.getJSON(api_url+'tarifas/list_all?callback=?', {}, function(data){
        var list_tarifas=[];
        if(data.status=='success') list_tarifas=data.data.rates;
        var select=$('#radio');
        var optioninicial=$('<option></option>').attr({'value':-1}).text('-'); select.append(optioninicial);
        for(var i=0;i<list_tarifas.length;i++){
            id=list_tarifas[i].id;
            nombres=list_tarifas[i].name;
            var option=$('<option></option>').attr({'value':list_tarifas[i].id, 'data-credit-box':list_tarifas[i].credit_box, 'data-credit-wod':list_tarifas[i].credit_wod}).text(list_tarifas[i].name+" ("+list_tarifas[i].price+" €)"); select.append(option);
        }
    });
}



function enviar() {

    var tarifa_id=$('#radio').val();
    var datainput = {
        email: $('#email').val(),
        password: $('#password').val(),
        name: $('#nombre').val(),
        surname: $('#apellidos').val(),
        phone: $('#movil').val(),
        nif: $('#nif').val(),
        birthdate: $('#birthdate').val(),
        rate_id:tarifa_id
    };

	$('#enviar').html('<i class="icon-spinner icon-spin"></i> Enviando');

    $.getJSON(api_url+'customers/add?callback=?',datainput,function(data){

        if(data.status=='success'){

            $('#nif').val('');
            $('#nombre').val('');
            $('#apellidos').val('');
            $('#password').val('');
            $('#email').val('');
            $('#movil').val('');
            $('#birthdate').val('');
            
            $('#nuevo_taxista').empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-smile-o"></i></div><div class="text">¡YA ESTAS REGISTRADO!<br> Descarga la APP AHORA y nos pondremos en contacto contigo para activarla.</div></div>');
            var content_botonera=$('<div></div>').attr({'class':'download_content'}); $('#nuevo_taxista').append(content_botonera);
            var botonera=$('<div></div>').attr({'class':'botonera'}); content_botonera.append(botonera);
            var link = $('<a>').attr({'href':'https://itunes.apple.com/es/app/taxible-driver/id848377763?mt=8'}); botonera.append(link);
            var button = $('<div></div>').attr({'class':'download spritehome sphome_app_store'}); link.append(button);
            var link = $('<a>').attr({'href':'https://play.google.com/store/apps/details?id=com.idearioventures.taxibledriver'}); botonera.append(link);
            var button = $('<div></div>').attr({'class':'download spritehome sphome_google_play'}); link.append(button);
        }

        else{
            var message=data.response;
            var warning='Faltan datos';
            if (message == 'email_registered') warning = 'El email está en uso';
            if (message == 'phone_registered') warning = 'El número de teléfono está en uso';
            if (message == 'email_missed') warning = 'Falta el email del usuario';
            if (message == 'password_missed') warning = 'Falta la contraseña del usuario';
            if (message == 'name_missed') warning = 'Falta el nombre del usuario';
            if (message == 'surname_missed') warning = 'Falta el apellido del usuario';
            if (message == 'phone_missed') warning = 'Falta el número de teléfono del usuario';
            if (message == 'nif_missed') warning = 'Falta el NIF';
            if (message == 'rate_id_missed') warning = 'Falta seleccionar una tarifa';
            launch_alert(warning,'warning');
        }

        $('#enviar').html('ENVIAR');



	});


}