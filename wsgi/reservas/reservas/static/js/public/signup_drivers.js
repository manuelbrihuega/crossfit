$(document).ready(function(){

    list_radios();
});

var prefix=34;

function list_radios(){
    var lang=$('body').attr('data-lang');
    $.getJSON(api_url+'delegations/list_all?callback=?', {}, function(data){
        var list_delegations=[];
        var country=0;
        if(data.status=='success') list_delegations=data.data.delegations;
        for(var i=0;i<list_delegations.length;i++){
            if (list_delegations[i].country_code.toUpperCase()==lang.toUpperCase()){
                country=list_delegations[i].id;
                prefix=list_delegations[i].prefix;
            }
        }

        $.getJSON(api_url+'delegations/list_cities?callback=?', {delegation_id:country}, function(data){
            var list_cities=data.data.cities;
            var select=$('#radio');
            var optioninicial=$('<option></option>').attr({'value':-1}).text('-'); select.append(optioninicial);
            var optioninicial=$('<option></option>').attr({'value':0}).text('Sugerir una nueva ciudad Taxible'); select.append(optioninicial);
            for(var i=0;i<list_cities.length;i++){
                var option=$('<option></option>').attr({'value':list_cities[i].id}).text(list_cities[i].city); select.append(option);
            }

            select.bind({
                change:function(){

                    change_radio();

                }
            });

            change_radio();
        });

    });
}

function change_radio(){

    var value=$('#radio').val();
    if(value>-1){
        $.getJSON(api_url+'features/list_by_radio?callback=?',{radio_id:value},function(data){
            var destination=$('#checkboxes>div');
            destination.empty();
            if (data.status=='success'){
                for(var i=0;i<data.data.features.length;i++){
                    var divcheck=$('<div></div>').attr({'class':'checkbox'});
                    var textcheck=$('<i></i>').attr({'id':data.data.features[i].id,'class':'fa fa-square'}).text(' '+data.data.features[i].description);

                    divcheck.click(function(){
                       check(this);
                    });

                    divcheck.append(textcheck);
                    destination.append(divcheck);
                }



            }

            $('#form_driver').css('display','block');
            $('#form_driver').removeClass('oculto');

        });
    }

    else{
        $('#form_driver').addClass('oculto');
        $('#form_driver').css('display','none');

    }

}

function check(element) {
	var checkwrapper=$(element);
	var i = checkwrapper.find('i');
	if(i.hasClass('fa-square')) i.removeClass('fa-square').addClass('fa-check-square');
	else i.removeClass('fa-check-square').addClass('fa-square');
}

function mismo(element) {
	var i = $(element).find('i');
	if(i.hasClass('fa-square')){
		i.removeClass('fa-square').addClass('fa-check-square');
		$('#t_email').val( $('#email').val() );
        $('#t_nombre').val($('#nombre').val() );
        $('#t_apellidos').val($('#apellidos').val() );
		$('#t_movil').val( $('#movil').val() );
	}
	else{
		i.removeClass('fa-check-square').addClass('fa-square');
	}
}

function enviar() {

    var checks=$('#checkboxes .fa-check-square');

    var radio_id=$('#radio').val();

    var features="";

    checks.each(function(){
        features+=$(this).attr('id')+","
    });

    var lang=$('body').attr('data-lang');



    var datainput = {
        nif: $('#nif').val(),
        num_licence: $('#licencia').val(),
        name_owner: $('#nombre').val(),
        surname_owner: $('#apellidos').val(),
        address: $('#direccion').val(),
        password: $('#password').val(),
        locality: $('#localidad').val(),
        postal_code: $('#cp').val(),
        province: $('#provincia').val(),
        email_owner: $('#email').val(),
        phone_owner: $('#movil').val(),
        num_plate: $('#matricula').val(),
        car_brand: $('#marca').val(),
        car_model: $('#modelo').val(),
		features:features,
        email: $('#t_email').val(),
        name: $('#t_nombre').val(),
        surname: $('#t_apellidos').val(),
        phone: $('#t_movil').val(),
        prefix: prefix,
        device_model: $('#t_modelo').val(),
        radio_id:radio_id
    };

	$('#enviar').html('<i class="icon-spinner icon-spin"></i> Enviando');

    $.getJSON(api_url+'drivers/add?callback=?',datainput,function(data){

        if(data.status=='success'){

            $('#nif').val('');
            $('#licencia').val('');
            $('#nombre').val('');
            $('#apellidos').val('');
            $('#direccion').val('');
            $('#localidad').val('');
            $('#password').val('');
            $('#cp').val('');
            $('#provincia').val('');
            $('#email').val('');
            $('#movil').val('');
            $('#matricula').val('');
            $('#marca').val('');
            $('#modelo').val('');
            $('#t_email').val('');
            $('#t_nombre').val('');
            $('#t_napellidos').val('');
            $('#t_movil').val('');
            $('#t_modelo').val('');

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

            if (message == 'owner_name_missed') warning = 'Falta el nombre del dueño de la licencia';
            if (message == 'owner_surname_missed') warning = 'Falta el apellido del dueño de la licencia';
            if (message == 'owner_email_missed') warning = 'Falta el email del dueño de la licencia';
            if (message == 'owner_nif_missed') warning = 'Falta el NIF del dueño de la licencia';
            if (message == 'nif_missed') warning = 'Falta el NIF del dueño de la licencia';
            if (message == 'owner_phone_missed') warning = 'Falta el teléfono del dueño de la licencia';
            if (message == 'owner_address_missed') warning = 'Falta la dirección del dueño de la licencia';
            if (message == 'owner_postal_code_missed') warning = 'Falta el código postal del dueño de la licencia';
            if (message == 'owner_locality_missed') warning = 'Falta la localidad del dueño de la licencia';
            if (message == 'owner_province_missed') warning = 'Falta la provincia del dueño de la licencia';

            if (message == 'licence_num_licence_missed') warning = 'Falta el número de la licencia';
            if (message == 'num_licence_missed') warning = 'Falta el número de la licencia';
            if (message == 'licence_num_plate_missed') warning = 'Falta el número de la matrícula';
            if (message == 'licence_car_brand_missed') warning = 'Falta la marca del vehículo';
            if (message == 'licence_car_model_missed') warning = 'Falta el modelo del vehículo';
            launch_alert(warning,'warning');
        }

        $('#enviar').html('ENVIAR');



	});


}