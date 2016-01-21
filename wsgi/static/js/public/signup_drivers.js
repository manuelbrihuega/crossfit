$(document).ready(function(){

    list_radios();
    if (!Modernizr.inputtypes.date) {
        $('input[type=date]').datepicker();
    }
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

if($('#password').val()==$('#password_repeat').val()){
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

	$('#enviar').html('<i class="fa fa-cog fa-spin"></i> Enviando');

    $.getJSON(api_url+'customers/add?callback=?',datainput,function(data){

        if(data.status=='success'){

            $('#nif').val('');
            $('#nombre').val('');
            $('#apellidos').val('');
            $('#password').val('');
            $('#email').val('');
            $('#movil').val('');
            $('#birthdate').val('');
            
            $('#nuevo_taxista').empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-smile-o"></i></div><div class="text">¡YA ESTAS REGISTRADO!<br> Podrás acceder a tu cuenta cuando uno de nuestros monitores valide tu registro. Gracias por registrarte en nuestro sistema de reservas!</div></div>');
            var content_botonera=$('<div></div>').attr({'class':'download_content'}); $('#nuevo_taxista').append(content_botonera);
            var botonera=$('<div></div>').attr({'class':'botonera','style':'width:200px;'}); content_botonera.append(botonera);
            var img = $('<img>').attr({'src':base_url+'/static/img/common/iconoregistro.png'}); botonera.append(img);
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
}else{
    launch_alert('Las contraseñas no coinciden','warning');
}

}