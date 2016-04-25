$(document).ready(function() {
    $.ajaxSetup({ cache: false });
	start();
    cierraPadre();
    setInterval(load_assigned, 2000);
});


function cierraPadre () {
    window.focus();
    window.opener.cierra();
}

var api_url='http://crossfitjerez.com/api/';
var offset = getLocalOffset();
var myenterprise = false;


function start(){
	
	revisaInputs();
	
	$.getJSON(api_url+'enterprises/get?callback=?', {}, function(data){
		if(data.status=='success'){
			
            myenterprise=data.data.enterprise;

            if (myenterprise.logo!=""){
                var logo=$("#logo_empresa");
                var img=$('<img>').attr('src',myenterprise.logo).hide();
                logo.append(img);
                img.fadeIn();
            }
			
			$('#input_origen').val(myenterprise.address);

            $('#btn_pulsador').click(function(){
                solicitaTaxi('Now');
            });

            $('#btn_reservar').click(function(){
               abreCalendarioReserva(myenterprise);
            });
			
			$('#input_taxis').focus();
            var inputs=$('#input_taxis').add($('#input_pasajeros')).add($('#input_indicaciones')).add($('#input_destino1')).add($('#input_destino2'));

            inputs.each(function(){
                var prota=$(this);
                prota.bind({
                    keydown: function(e) {
                        var code= e.keyCode;
                        if (code=="13") $('#btn_pulsador').click();
                    }
                });
            })
			
			loadFeatures();
            //loadRadio();
			
			
		}
		else muestraErrorSesion();
	});

}

function loadFeatures() {
	$.getJSON(api_url+'radios/list_by_location?callback=?', {postal_code:myenterprise.postal_code, country_code:myenterprise.country_code}, function(data){
		if(data.status=='success'){
			var features = data.data.radios[0].features;
			$.each(features, function(index, feature) {
	            var opcion=$('<div></div>').attr({'data-id':feature.id,'class':'opcion'}); $('#caracteristicas').append(opcion);
	            var marcador=$('<div></div>').attr({'class':'marcador'}); opcion.append(marcador);
	            var texto=$('<div></div>').attr({'class':'texto'}).text(feature.description); opcion.append(texto);
				
	            opcion.click(function(){
	                var marca=$(this);
	                if (marca.hasClass("marcado")) marca.removeClass('marcado');
	                else marca.addClass('marcado');
	            });
			});
           
		}
		else modalError('Error al cargar características');
	});
}

function revisaInputs(){
    var taxis=$('#input_taxis');
    var pasajeros=$('#input_pasajeros');

    taxis.bind({
        keyup: function(e){
            var code= e.keyCode;
            if ((code>53 && code<97 )||code>101 || (taxis.val()>6)  ) taxis.val("");
            if(taxis.val()>1){
               pasajeros.attr('disabled','disabled');
               pasajeros.val("");
               pasajeros.parent().addClass('disabled');
            }
            else{
                pasajeros.parent().removeClass('disabled');
                pasajeros.removeAttr('disabled');
            }
        }

    });

    pasajeros.bind({
        keyup: function(e){
            var code= e.keyCode;
            if ((code>52 && code<97 )||code>100 || (pasajeros.val()>4)) pasajeros.val("");
        }

    });

}


var requests_taxis=0;
var requests_success=0;
var requests_failed=0;

// Solicitar Taxi
function solicitaTaxi(fecha){
	
    var taxis=$('#input_taxis').val();
    var pasajeros=$('#input_pasajeros').val();
    var indicaciones=$('#input_indicaciones').val();

    var destino="";
    if ($('#input_destino1').val()!="" || $('#input_destino2').val()!="") destino=$('#input_destino1').val()+", "+$('#input_destino2').val();

    var inputs=$('#input_taxis').add($('#input_pasajeros')).add($('#input_indicaciones')).add($('#input_destino1')).add($('#input_destino2'));

    if(taxis=="") taxis=1;
    if(taxis>5) taxis=5;
    if(pasajeros=="") pasajeros=1;
    var corporate = false;
	var features='';
	var marcadas=$('div.opcion.marcado');
	marcadas.each(function(index) {
        if($(this).attr('data-id')=='8'){
            corporate=true;
        }
		features+=$(this).attr('data-id')+',';
	});
	
	requests_taxis=taxis;
	requests_success=0;
	requests_failed=0;
	
    if(corporate){
	
        var params={    country_code:myenterprise.country_code, 
                        postal_code:myenterprise.postal_code, 
                        radio_id:myenterprise.radio.id, 
                        lat_origin:myenterprise.latitude, 
                        lon_origin:myenterprise.longitude, 
                        origin:myenterprise.address,
                        offset:offset,
                        date_depart:fecha,
                        num_passengers:pasajeros,
                        indications:indicaciones,
                        features:features,
                        corporate:true,
                        source:'Pulsador'
                };
    }else{
        var params={    country_code:myenterprise.country_code, 
                    postal_code:myenterprise.postal_code, 
                    radio_id:myenterprise.radio.id, 
                    lat_origin:myenterprise.latitude, 
                    lon_origin:myenterprise.longitude, 
                    origin:myenterprise.address,
                    offset:offset,
                    date_depart:fecha,
                    num_passengers:pasajeros,
                    indications:indicaciones,
                    features:features,
                    source:'Pulsador'
                };
    
    }
	modal_carreras();
	for (var i = 0; i < taxis; i++) {
		send_journey(params);
	}
	
	
}

function send_journey(params) {
    
	$.getJSON(api_url+'journeys/add?callback=?',params, function(data){
		////console.log(data);
		if(data.status=='success') requests_success++;
		else requests_failed++;
		var restante=requests_taxis-requests_success-requests_failed;
		$('#num_taxis').text(restante);
		if(requests_success+requests_failed<=requests_taxis) cerrarAlert(false);
													
	});
}

function modal_carreras() {
    $('#overlay').fadeIn(function(){
		$('#modal').removeClass('calendario');
        var found=$('#modal>.input');
        if (found.length>0) $('#modal>.input').remove();
        $('#modal>.texto').html('Solicitando <span id="num_taxis">'+requests_taxis+'</span> taxis').show();
        $('#modal').fadeIn();
    });
}



function loadRadio() {
	$.getJSON(api_url+'enterprises/get?callback=?', {}, function(data){
		if(data.status=='success'){
			myradio = data.data.enterprise.radio;
			firebase_updating();
			checkhash();
		}
		else super_error('Enterprise info failure');
	});
}

// Firebase
function firebase_updating() {
	firebase_url = 'https://'+myradio.fb_ref+'.firebaseio.com';
	firebase_ref= new Firebase(firebase_url);
	journeys_ref= firebase_ref.child('journeys');
	journeys_updating();
}

function journeys_updating() {
    journeys_ref.on('value', function(snapshot) {
       load_pending();
    });
}
var idtimeout = 0;
var journeys_pending=[];
var asignadas = new Array();

function load_assigned() {
    $.getJSON(api_url+'enterprises/active_journeys?callback=?', {offset:local_offset}, function(data){
        if(data.status=='success'){
            for(var k=0; k<data.data.length; k++){
                if(data.data[k].status=='assigned'){
                    if(asignadas.indexOf(data.data[k].id)==-1){
                        asignadas.push(data.data[k].id);
                        var fecha = data.data[k].date_depart.split(" ");
                        alert("El taxi solicitado a las "+fecha[1]+" ha sido asignado.");
                    }
                }
            }
        }
    });
}

function load_pending() {
	$.getJSON(api_url+'enterprises/active_journeys?callback=?', {offset:local_offset}, function(data){
		if(data.status=='success'){
            var actual_journeys=[];
            for(var i=0;i<data.data.length;i++){
                var elemento = data.data[i];
                actual_journeys.push(elemento.id);
                var found=$('.item[data-id="'+elemento.id+'"]');
                if (found.length<1){
                    creaElemento(elemento);
                    if(journeys_pending.indexOf(elemento.id)<0) journeys_pending.push(elemento.id);
                }
                else modificaElemento(elemento);
            }

            for(var i=0;i<journeys_pending.length;i++){
                if (actual_journeys.indexOf(journeys_pending[i])<0) eliminaElemento(journeys_pending[i]);
            }

            if($('#btn_solicitudes').hasClass('on')) idtimeout=setTimeout(function(){load_pending();},5000);

		}
		else{}
	});
}















var timer;
var limite=10;
var c_pendientes=[];
var cuenta_paso=1;
var aviso_curso=false;
var aviso_alternativo=false;
var aviso_cancelado=false;

function iniciaContador () {
    var solicitudes=$('#solicitudes');
    clearTimeout(timer);
    segundos=limite;
    muestraSolicitudes();
    avanza();
}

function avanza () {
    var solicitudes=$('#solicitudes');

    if (solicitudes.css('display')=="block" && solicitudes.hasClass('curso')){
        if (segundos==0){
            segundos=limite;
            avanza();
            muestraSolicitudes();

         }
        else{
            timer = setTimeout(function(){
                segundos--;
                avanza();
            },1000);
        }
    }


}









function esperaEstadoTaxi(carrera_id){

    var continua=false;
    hoy=new Date();
    offset=hoy.getTimezoneOffset()/60*-1;

    $.post(base_url+'api/get_carreras_usuarios',{offset:offset},function(datos){
        var res= $.parseJSON(datos);

        var encontrado=false;

         if (res.length>0){
            for(var i=0;i<res.length;i++){
                var carrera=res[i];

                if (carrera.id==carrera_id){
                    encontrado=true;
                    if (carrera.estado=="pendiente"){ continua=true;}
                    else if (carrera.estado=="ocupado" || carrera.estado=="alternativo"){
//                        if (carrera.estado=="ocupado"){
//                            var texto_info="Todos los taxis están ocupados. ¿Desea esperar o cancelar?";
//                            var texto_boton="ESPERAR";
//
//                        }
//                        else{
//                            var texto_info="No hay taxis disponibles con esas características. ¿Desea recibir un taxi sin esas características o cancelar?";
//                            var texto_boton="ENVIAR TAXI";
//
//                        }
//                        $('#modal>.texto').text(texto_info);
//
//
//                        var found=$('#modal>.input');
//                        if (found.length>0) $('#modal>.input').remove();
//                        var div_input=$('<div></div>').attr({'class':'input'});
//                        var esperar=$('<div></div>').attr({'class':'btn corto'}).text(texto_boton).click(function(){cambiarTaxi(carrera);});
//                        var cancelar=$('<div></div>').attr({'class':'btn corto'}).text('CANCELAR').click(function(){cambiaEstado(carrera,'cancelado');});
//                        div_input.append(esperar);
//                        div_input.append(cancelar);
//                        $('#modal').append(div_input);

                        continua=true;

                        if (cuenta_paso>2){
                            cambiaEstado(carrera,'cancelado');
                        }

                        else{
                            cuenta_paso++;

                           cambiarTaxi(carrera);

                        }




                    }
                    else if(carrera.estado=="asignado"){
                        if (!aviso_curso){

                            if(carrera.tipo=="digital"){
                                $.post(base_url+"api/get_distancia_taxista",{id:carrera_id},function(data){
                                    var res= $.parseJSON(data);
                                    var tiempo="";
                                    if (res.tiempo>0) tiempo="Llegada aproximada en "+Math.round(res.tiempo/60)+" minutos";
                                    $('#modal>.texto').text('El taxi ha sido asignado a la licencia '+carrera.licencia+". "+tiempo);
                                    var found=$('#modal>.input');
                                    if (found.length>0) $('#modal>.input').remove();
                                    var div_input=$('<div></div>').attr({'class':'input'});
                                    var aceptar=$('<div></div>').attr({'class':'btn'}).text('ACEPTAR').click(function(){cerrarAlert(0);});
                                    div_input.append(aceptar);
                                    $('#modal').append(div_input);
                                    var found=$('#modal');
                                    if (found.css('display')=="none"){
                                        found.fadeIn();
                                        $('#modal>.texto').fadeIn();
                                    }


                                });
                            }

                            else{
                                $('#modal>.texto').text('El taxi ha sido asignado a la licencia '+carrera.licencia);
                                var found=$('#modal>.input');
                                if (found.length>0) $('#modal>.input').remove();
                                var div_input=$('<div></div>').attr({'class':'input'});
                                var aceptar=$('<div></div>').attr({'class':'btn'}).text('ACEPTAR').click(function(){cerrarAlert(0);});
                                div_input.append(aceptar);
                                $('#modal').append(div_input);
                                var found=$('#modal');
                                if (found.css('display')=="none"){
                                    found.fadeIn();
                                    $('#modal>.texto').fadeIn();
                                }

                            }


                            aviso_curso=true;






                        }

                        continua=true;

                    }


                    else if(carrera.estado=="cancelado"){
                        var modal=$('#modal');
                        modal.find(".texto").text('El taxi ha sido cancelado');
                        var found=modal.find('.input');
                        if (found.length>0) modal.find('.input').remove();
                        var div_input=$('<div></div>').attr({'class':'input'});
                        var aceptar=$('<div></div>').attr({'class':'btn'}).text('ACEPTAR').click(function(){cerrarAlert(0);});
                        div_input.append(aceptar);
                        modal.append(div_input);
                        if (modal.css('display')=="none"){
                            modal.fadeIn();
                        }

                        aviso_curso=true;
                    }
                }
            }
        }

//        else{
//
//            cerrarAlert(0);
//        }


        if (continua){
            setTimeout(function(){esperaEstadoTaxi(carrera_id);},4000);
        }


     });
}




function esperaEstadoVariosTaxi(){

    var continua=false;
    var alternativo=false;
    var asignado=false;
    var hoy=new Date();
    var offset=hoy.getTimezoneOffset()/60*-1;
    $.post(base_url+'api/get_carreras_usuarios',{offset:offset},function(datos){
        var res= $.parseJSON(datos);
         if (res.length>0){
            for(var i=0;i<res.length;i++){
                var carrera=res[i];
                if (carrera.estado=="pendiente") continua=true;
                else if (carrera.estado=="ocupado"){

                    if (cuenta_paso>2){
                        cambiaEstado(carrera,'cancelado');
                    }

                    else{
                       cuenta_paso++;

                       cambiarTaxi(carrera);

                    }

                }

                else if(carrera.estado=="asignado" || carrera.estado=="montado"){
                    asignado=true;
                    continua=true;
                    alternativo=false;

                }
                else if(carrera.estado=="alternativo"){

                    alternativo=true;
                    continua=true;
                    asignado=false;

                }

            }

        }

        else{

            cerrarAlert(0);
             continua=false;
        }

        if (asignado && !aviso_curso){
            $('#modal>.texto').text("Uno de los taxis ha sido asignado. Para continuar con el seguimiento de los otros, diríjase a la pestaña \"En curso\"");
            var found=$('#modal>.input');
            if (found.length>0) $('#modal>.input').remove();
            var div_input=$('<div></div>').attr({'class':'input'});
            var cancelar=$('<div></div>').attr({'class':'btn'}).text('ACEPTAR').click(function(){cerrarAlert(0);});
            div_input.append(cancelar);
            $('#modal').append(div_input);

            var found=$('#modal');
            if (found.css('display')=="none"){
                found.fadeIn();
            }

            aviso_curso=true;

        }
        else if (alternativo && !aviso_alternativo) {
            var texto_info="No hay taxis disponibles con esas características. ¿Desea recibir un taxi sin esas características o cancelar?";
            var texto_boton="ENVIAR TAXI";

            $('#modal>.texto').text(texto_info);


            var found=$('#modal>.input');
            if (found.length>0) $('#modal>.input').remove();
            var div_input=$('<div></div>').attr({'class':'input'});
            var esperar=$('<div></div>').attr({'class':'btn corto'}).text(texto_boton).click(function(){cambiarTodosTaxi();});
            var cancelar=$('<div></div>').attr({'class':'btn corto'}).text('CANCELAR').click(function(){cambiaEstado(carrera,'cancelado');});
            div_input.append(esperar);
            div_input.append(cancelar);
            $('#modal').append(div_input);

            var found=$('#modal');
            if (found.css('display')=="none"){
                found.fadeIn();
            }

            aviso_alternativo=true;
            aviso_curso=false;

        }
        if (continua) setTimeout(function(){esperaEstadoVariosTaxi();},4000);




     });
}


function cambiarTaxi(carrera){

    datos={id:carrera.id};

    $.post(base_url+'api/edita_peticion_taxi',datos,function(data){

        if (data=="ok") {
            $('#modal').removeClass("error");
            $('#modal>.texto').text('Buscando el taxista más cercano');
            var cargando=$('<div></div>').attr({'class':'loading'});
            $('#modal>.texto').append(cargando);
            var found=$('#modal>.input');
            if (found.length>0) $('#modal>.input').remove();
            var div_input=$('<div></div>').attr({'class':'input'});
            var cancelar=$('<div></div>').attr({'class':'btn'}).text('CANCELAR').click(function(){cambiaEstado(carrera,'cancelado');});
            div_input.append(cancelar);
            $('#modal').append(div_input);
            if (c_pendientes.length<2) esperaEstadoTaxi(carrera.id);

        }

        else{
            muestraErrorSesion();
        }


    });
}

function cambiarTodosTaxi(){
    hoy=new Date();
    offset=hoy.getTimezoneOffset()/60*-1;

    $.post(base_url+'api/get_carreras_usuarios',{offset:offset},function(datos){
        var res= $.parseJSON(datos);
         if (res.length>0){
            for(var i=0;i<res.length;i++){
                var carrera=res[i];

                if (carrera.estado=="pendiente" || carrera.estado=="alternativo"){

                    datos={id:carrera.id};

                    $.post(base_url+'api/edita_peticion_taxi',datos,function(data){

                        if (data=="ok") {
                            $('#modal').removeClass("error");
                            $('#modal>.texto').text('Buscando el taxista más cercano');
                            var cargando=$('<div></div>').attr({'class':'loading'});
                            $('#modal>.texto').append(cargando);
                            var found=$('#modal>.input');
                            if (found.length>0) $('#modal>.input').remove();
                            var div_input=$('<div></div>').attr({'class':'input'});
                            var cancelar=$('<div></div>').attr({'class':'btn'}).text('CANCELAR').click(function(){cambiaEstado(carrera,'cancelado');});
                            div_input.append(cancelar);
                            $('#modal').append(div_input);
                            if (c_pendientes.length<2) esperaEstadoTaxi(carrera.id);

                        }

                        else{
                            muestraErrorSesion();
                        }


                    });
                }
            }
         }
    });
}

function cambiaEstado(carrera,estado){

    $.post(base_url+'api/solicita_cancelacion',{'id_carrera':carrera.id},function(data){


        if (!aviso_cancelado){
            $('#overlay').fadeIn(function(){
                if(carrera.tipo=="digital") $('#modal>.texto').text('Taxi cancelado.');
                else $('#modal>.texto').text('SOLICITUD DE CANCELACIÓN ENVIADA. Espere confirmación.');
                var found=$('#modal>.input');
                if (found.length>0) $('#modal>.input').remove();
                var found=$('.item[data-id="'+carrera.id+'"]');
                var div_input=$('<div></div>').attr({'class':'input'});
                var aceptar=$('<div></div>').attr({'class':'btn'}).text('CERRAR').click(function(){cerrarAlert(0);});
                div_input.append(aceptar);
                $('#modal').append(div_input);
                $('#modal').fadeIn(function(){
                    found.fadeOut(function(){
                        found.remove();
                    });
                });
            });
        }

//        else{
//            $('#overlay').fadeIn(function(){
//                $('#modal>.texto').text('Para cancelar este taxi debe llamar al teléfono '+carrera.telefono);
//                var found=$('#modal>.input');
//                if (found.length>0) $('#modal>.input').remove();
//                var div_input=$('<div></div>').attr({'class':'input'});
//                var aceptar=$('<div></div>').attr({'class':'btn'}).text('CERRAR').click(function(){cerrarAlert(0);});
//                div_input.append(aceptar);
//                $('#modal').append(div_input);
//                $('#modal').fadeIn();
//            });
//        }

        aviso_cancelado=true;

    });



}

function cambiaEstadoTodos(){
    hoy=new Date();
    offset=hoy.getTimezoneOffset()/60*-1;

    $.post(base_url+'api/get_carreras_usuarios',{offset:offset},function(datos){
        var res= $.parseJSON(datos);
         if (res.length>0){
            for(var i=0;i<res.length;i++){
                var carrera=res[i];

                if (carrera.estado=="pendiente" || carrera.estado=="alternativo"){
                    $.post(base_url+'api/solicita_cancelacion',{'id_carrera':carrera.id},function(data){

                        if(i==(res.length-1)){
                            if (carrera.tipo=="digital"){
                                $('#overlay').fadeIn(function(){
                                    $('#modal>.texto').text('Solicitud cancelada con éxito');
                                    var found=$('#modal>.input');
                                    if (found.length>0) $('#modal>.input').remove();
                                    var found=$('.item[data-id="'+carrera.id+'"]');
                                    $('#modal').fadeIn(function(){
                                        found.fadeOut(function(){
                                            found.remove();
                                        });
                                        setTimeout(function(){$('#modal').fadeOut(function(){$('#overlay').fadeOut();})},2000)
                                    });
                                });
                            }

                            else{
                                $('#overlay').fadeIn(function(){
                                    $('#modal>.texto').text('Para cancelar este taxi debe llamar al teléfono '+carrera.telefono);
                                    var found=$('#modal>.input');
                                    if (found.length>0) $('#modal>.input').remove();
                                    var div_input=$('<div></div>').attr({'class':'input'});
                                    var aceptar=$('<div></div>').attr({'class':'btn'}).text('CERRAR').click(function(){cerrarAlert(0);});
                                    div_input.append(aceptar);
                                    $('#modal').append(div_input);
                                    $('#modal').fadeIn();
                                });
                            }
                        }

                    });
                }


            }
         }
    });





}


function abreCalendarioReserva(){
    $('#overlay').fadeIn(function(){


            $('#modal').addClass('calendario');
            // $('#modal>.texto').text('Indicar fecha y hora de recogida');
            $('#modal>.texto').hide();
            var found=$('#modal>.input');
            if (found.length>0) $('#modal>.input').remove();
            var div_input=$('<div></div>').attr({'class':'input'}); $('#modal').append(div_input);
            
            var center=$('<center></center>'); div_input.append(center);
            var datepicker_wrapper=$('<div></div>').attr({'id':'datepicker_wrapper'}); center.append(datepicker_wrapper);
            var datepicker_input=$('<input>').attr({'type':'hidden','id':'datepicker_input'}); center.append(datepicker_input);
            var timepicker_wrapper=$('<div></div>').attr({'id':'timepicker_wrapper'}); center.append(timepicker_wrapper);
            var timepicker_input=$('<input>').attr({'type':'hidden','id':'timepicker_input'}); center.append(timepicker_input);
            var ahora=new Date();
            datepicker_input.val(ahora.getFullYear()+'/'+(parseInt(ahora.getMonth())+1)+'/'+ahora.getDate());
            
            $('#datepicker_wrapper').datepicker({ minDate: new Date(), maxDate: "+14D", altField: "#datepicker_input", altFormat: "yy-mm-dd"});
            $('#timepicker_wrapper').timepicker({altField: "#timepicker_input", hour: ahora.getHours(), minute: ahora.getMinutes(), hourMin: 0, hourMax: 23, stepMinute: 5});
            
            var cerrar=$('<div></div>').attr({'class':'btn corto'}).text('CANCELAR').click(function(){cerrarAlert(0);});
            var aceptar=$('<div></div>').attr({'class':'btn corto'}).text('RESERVAR').click(function(){reservarTaxi();});

            div_input.append(cerrar);
            div_input.append(aceptar);


        $('#modal').fadeIn();
    });
}

function reservarTaxi(){
    var dia_peticion=$('#datepicker_input').val();
    var hora_peticion=$('#timepicker_input').val();
    var fecha=dia_peticion+' '+hora_peticion+':00';

    // $('#modal>.texto').show();
    solicitaTaxi(fecha);


}




function muestraSolicitudes(){
    var solicitudes=$('#solicitudes');
    if (solicitudes.css('display')=="none"){
        solicitudes.empty();
        solicitudes.fadeIn();

    }

    var destino=$('#solicitudes');

    hoy=new Date();
    offset=hoy.getTimezoneOffset()/60*-1;

    $.ajax({
	    url: "api/get_carreras_usuarios",
	    data: {offset:offset},
	    type: 'post',
	    error: function(XMLHttpRequest, textStatus, errorThrown){
            muestraErrorSesion();

	    },
	    success: function(data, textStatus, xhr){
            var res= $.parseJSON(data);
            pendientes=[];
            if(res.length>0){
                destino.html("");
                for(var i=0;i<res.length;i++){
                    var elemento=res[i];
                    var id=elemento.id;
                    if (!Array.prototype.indexOf){
                      Array.prototype.indexOf = function(elt /*, from*/)
                      {
                        var len = this.length >>> 0;

                        var from = Number(arguments[1]) || 0;
                        from = (from < 0)
                             ? Math.ceil(from)
                             : Math.floor(from);
                        if (from < 0)
                          from += len;

                        for (; from < len; from++)
                        {
                          if (from in this &&
                              this[from] === elt)
                            return from;
                        }
                        return -1;
                      };
                    }


                    if(pendientes.indexOf(id)<0) pendientes.push(id);


                    var found=$('.item[data-id="'+id+'"]');
                    if (found.length<1) creaElemento(elemento);
                    else modificaElemento(elemento);
                }



            }

            else{

                var found=destino.find('.mensaje');
                if (found.length<1){
                    var mensaje=$('<div></div>').attr({'class':'mensaje'}).text("No hay solicitudes pendientes en curso");
                    destino.append(mensaje);
                }


            }

            var todos=$('.item');
            todos.each(function(){
                var actual=$(this);
                if(pendientes.indexOf(parseInt(actual.attr('data-id')))<0) actual.fadeOut(function(){actual.remove();});
            });

        }

    });
}



function creaElemento (elemento) {

    if (elemento.status=="pending" || elemento.status=="assigned" || elemento.status=="reserved" || elemento.status=="cancelation_request"){
        var destino=$('#solicitudes');


        var id=elemento.id;

        var clase_estado=elemento.status;
        var hora=elemento.date_depart.substring(11,16);
        var fecha_recogida=elemento.date_depart;
        var tipo=elemento.radio.type;
        if(tipo == 'digital'){
            if (elemento.driver!='') var taxista=elemento.driver.name;
            else var taxista='';
            if (elemento.driver!='') var licencia=elemento.driver.licence;
            else var licencia='';
        }
        else{
            var taxista='';
            var licencia=elemento.licence;
        }


        var fecha=elemento.date_depart.substring(0,10).replace(/-/g,'/');

        var estado=clase_estado;

        if (clase_estado=='pending') estado='pendiente';
        if (clase_estado=='assigned') estado='asignado';
        if (clase_estado=='picked') estado='montado';
        if (clase_estado=='canceled') estado='cancelado';
        if (clase_estado=='completed') estado='completado';
        if (clase_estado=='reserved') estado='reservado';
        if (clase_estado=='cancelation_request') estado='Pendiente de cancelación';


        var item= $('<div></div>').attr({'class':'item '+clase_estado, 'data-id':id, 'data-estado':clase_estado, 'data-hora':hora,  'data-fecha-recogida':fecha_recogida});

            var intra= $('<div></div>').attr({'class':'intra izquierda pasajero'}); item.append(intra);

                var col1= $('<div></div>').attr({'class':'col1'});       intra.append(col1);
                    var top= $('<div></div>').attr({'class':'top'}).text(fecha);                  col1.append(top);
                    var floor= $('<div></div>').attr({'class':''}).text(hora);                  col1.append(floor);

                var separador= $('<div></div>').attr({'class':'separador'});                  intra.append(separador);

                var col2= $('<div></div>').attr({'class':'col2'});                  intra.append(col2);
                    var top= $('<div></div>').attr({'class':'top'}).text('TAXI '+estado);                  col2.append(top);
                    var floor= $('<div></div>').attr({'class':'floor'});  col2.append(floor);
                    var ind= $('<div></div>').attr({'class':'indications'}).text("Indicaciones: "+elemento.indications);
                    col2.append(ind);
                    if (tipo=="digital" && taxista!='') floor.text(licencia+" - "+taxista);
                    else{
                        if(licencia!='') floor.text('LIC.Nº: '+licencia);
                    }

                var separador= $('<div></div>').attr({'class':'separador'});                  intra.append(separador);

                var col3= $('<div></div>').attr({'class':'col3'});       intra.append(col3);
                    var boton_cancelado=     $('<div></div>').attr({'class':'boton cancelado'}).html('<i>X</i>').click(function(){ cancelJourney(id); });          col3.append(boton_cancelado);



        destino.append(item);

    }


}

function cancelJourney(id){
    $.getJSON(api_url+'journeys/cancelation_request?callback=?', {id:id}, function(data){
		if(data.status=='success'){
			modalInfo('Petición de cancelación enviada correctamente. Espere confirmación.');

		}
		else modalError('Solicitud de cancelación ya enviada');
	});

}


function modificaElemento(elemento) {
    var found=$('.item[data-id="'+elemento.id+'"]');
    if(found.attr('data-estado')!=elemento.status){
        found.removeClass(found.attr('data-estado'));
        found.addClass(elemento.status);
        found.attr('data.estado',elemento.status);

        var estado=elemento.status;

        if (estado=='pending') estado='pendiente';
        if (estado=='assigned') estado='asignado';
        if (estado=='picked') estado='montado';
        if (estado=='canceled') estado='cancelado';
        if (estado=='completed') estado='completado';
        if (estado=='cancelation_request') estado='Pendiente de cancelación';

        var tipo=elemento.radio.type;
        if(tipo == 'digital'){
            if (elemento.driver!='') var taxista=elemento.driver.name;
            else var taxista='';
            if (elemento.driver!='') var licencia=elemento.driver.licence;
            else var licencia='';
        }
        else{
            var taxista='';
            var licencia=elemento.licence;
        }

        found.find('.intra>.col2>.top').text(estado);
        if (elemento.driver!='') found.find('.intra>.col2>.floor').text(licencia);
        if (elemento.type=="digital" && elemento.driver!='') found.find('.intra>.col2>.floor').text(elemento.driver.licence+" - "+elemento.driver.name);
    }



}

function eliminaElemento(id){
    var found=$('.item[data-id="'+id+'"]');
    if (found){
        found.remove();
    }
}






function muestraCalendario(){
    var destino=$('#solicitudes');

    var cargando=$('<div></div>').attr({'class':'cargando'}).text("Cargando...");
    destino.append(cargando);
    $.getJSON(api_url+'buttons/count_by_months?callback=?', function(data){
        if(data.status=='success'){
            cargando.fadeOut(function(){
                cargando.remove();
            });

            var elementos=data.data;

            if (elementos.length>0){
                var anos = [];
                for (var i=0;i<elementos.length;i++){
                    if (anos.indexOf(elementos[i].year)==-1){
                        anos.push(elementos[i].year);
                        var div_pulsa_anyo=$('<div></div>').attr({'class':'pulsa_anyo','data-anyo':elementos[i].year});
                        var texto_anyo=$('<span></span>').text(elementos[i].year).click(function(){pulsa_anyo($(this).parent())});
                        div_pulsa_anyo.append(texto_anyo);
                        destino.append(div_pulsa_anyo);
                    }


                }


            }else{
                var div_pulsa_anyo=$('<div></div>').attr({'class':'pulsa_anyo'});
                var texto_anyo=$('<span></span>').text("No hay carreras en el historial");
                div_pulsa_anyo.append(texto_anyo);
                destino.append(div_pulsa_anyo);
            }
        }else{
            muestraErrorSesion();
        }
    });
}

function pulsa_anyo(elemento){
    var prota=$(elemento);

    var anyo=prota.attr('data-anyo');


    var div_mes=$('.bloque_mes[data-anyo="'+anyo+'"]');


    if(!prota.hasClass('on')){
        var cargando=$('<div></div>').attr({'class':'cargando'}).text("Cargando...");
        prota.append(cargando);

        $.getJSON(api_url+'buttons/count_by_months?callback=?', function(data){
            var lista = [];
            for(var i=0; i<data.data.length; i++){
                if(data.data[i].year==anyo){
                    lista.push(data.data[i]);
                }
            }
            cargando.fadeOut(function(){
                cargando.remove();
                var div_mes=$('<div></div>').attr({'class':'bloque_mes','data-anyo':anyo}); prota.append(div_mes);

                var div_pulsa_ene=$('<div></div>').attr({'class':'pulsa_mes','data-mes':1}).text("ENERO").click(function(){muestraHistorial(this)});
                var div_pulsa_feb=$('<div></div>').attr({'class':'pulsa_mes','data-mes':2}).text("FEBRERO").click(function(){muestraHistorial(this)});
                var div_pulsa_mar=$('<div></div>').attr({'class':'pulsa_mes','data-mes':3}).text("MARZO").click(function(){muestraHistorial(this)});
                var div_pulsa_abr=$('<div></div>').attr({'class':'pulsa_mes','data-mes':4}).text("ABRIL").click(function(){muestraHistorial(this)});
                var div_pulsa_may=$('<div></div>').attr({'class':'pulsa_mes','data-mes':5}).text("MAYO").click(function(){muestraHistorial(this)});
                var div_pulsa_jun=$('<div></div>').attr({'class':'pulsa_mes','data-mes':6}).text("JUNIO").click(function(){muestraHistorial(this)});
                var div_pulsa_jul=$('<div></div>').attr({'class':'pulsa_mes','data-mes':7}).text("JULIO").click(function(){muestraHistorial(this)});
                var div_pulsa_ago=$('<div></div>').attr({'class':'pulsa_mes','data-mes':8}).text("AGOSTO").click(function(){muestraHistorial(this)});
                var div_pulsa_sep=$('<div></div>').attr({'class':'pulsa_mes','data-mes':9}).text("SEPTIEMBRE").click(function(){muestraHistorial(this)});
                var div_pulsa_oct=$('<div></div>').attr({'class':'pulsa_mes','data-mes':10}).text("OCTUBRE").click(function(){muestraHistorial(this)});
                var div_pulsa_nov=$('<div></div>').attr({'class':'pulsa_mes','data-mes':11}).text("NOVIEMBRE").click(function(){muestraHistorial(this)});
                var div_pulsa_dic=$('<div></div>').attr({'class':'pulsa_mes','data-mes':12}).text("DICIEMBRE").click(function(){muestraHistorial(this)});

                for(var j=0; j<lista.length; j++){
                    if (lista[j].month==1 && lista[j].total>0) div_mes.append(div_pulsa_ene);
                    if (lista[j].month==2 && lista[j].total>0) div_mes.append(div_pulsa_feb);
                if (lista[j].month==3 && lista[j].total>0) div_mes.append(div_pulsa_mar);
                if (lista[j].month==4 && lista[j].total>0) div_mes.append(div_pulsa_abr);
                if (lista[j].month==5 && lista[j].total>0) div_mes.append(div_pulsa_may);
                if (lista[j].month==6 && lista[j].total>0) div_mes.append(div_pulsa_jun);
                if (lista[j].month==7 && lista[j].total>0) div_mes.append(div_pulsa_jul);
                if (lista[j].month==8 && lista[j].total>0) div_mes.append(div_pulsa_ago);
                if (lista[j].month==9 && lista[j].total>0) div_mes.append(div_pulsa_sep);
                if (lista[j].month==10 && lista[j].total>0) div_mes.append(div_pulsa_oct);
                if (lista[j].month==11 && lista[j].total>0) div_mes.append(div_pulsa_nov);
                if (lista[j].month==12 && lista[j].total>0) div_mes.append(div_pulsa_dic);  
                }
                



                div_mes.slideDown(function(){
                    prota.addClass('on');

                });
            });



         });


    }

    else{

        div_mes.slideUp(function(){
            prota.removeClass('on');
            prota.find('.pulsa_mes').fadeOut(function(){
                prota.find('.pulsa_mes').remove();
            });
        });

    }




}








// Menu

function abreSolicitudes(){
    var boton=$('#btn_solicitudes');
    var formulario=$('#form_pulsador');
    var solicitudes=$('#solicitudes');
    if(!boton.hasClass('on')){
        formulario.fadeOut(function(){
            solicitudes.html("");
            solicitudes.fadeIn(function(){
                solicitudes.removeClass();
                solicitudes.addClass('curso');
                load_pending();
                boton.siblings().removeClass('on');
                boton.addClass('on');
            });

        });

    }

}

function abrePulsador(){
    var boton=$('#btn_principal');
    var formulario=$('#form_pulsador');
    var solicitudes=$('#solicitudes');

    if(!boton.hasClass('on')){

        solicitudes.fadeOut(function(){
            formulario.fadeIn();
            boton.siblings().removeClass('on');
            boton.addClass('on');
        });

    }
}

function abreHistorial(){
    var boton=$('#btn_historial');
    var formulario=$('#form_pulsador');
    var solicitudes=$('#solicitudes');
    if(idtimeout!=0){
        clearTimeout(idtimeout);
    }
    if(!boton.hasClass('on')){
        formulario.fadeOut(function(){
            solicitudes.html("");
            solicitudes.fadeIn(function(){
                solicitudes.removeClass();
                solicitudes.addClass('historial');
                muestraCalendario();
                boton.siblings().removeClass('on');
                boton.addClass('on');
            });

        });

    }
}


// HISTORIAL
function muestraHistorial(boton){
    var solicitudes=$('#solicitudes');
    if (solicitudes.css('display')=="none"){
        solicitudes.fadeIn();
    }

    var destino_inicial=$(boton);



    var anyo=destino_inicial.parent().attr('data-anyo');
    var mes=destino_inicial.attr('data-mes');

    var destino=$('<div></div>').attr({'class':'historial','data-fecha':anyo+mes});

    if(!destino_inicial.hasClass('on')){

        destino_inicial.append(destino);

        var cargando=$('<div></div>').attr({'class':'cargando'}).text("Cargando...");
        destino.append(cargando);


        $.getJSON(api_url+'buttons/journeys_by_month?callback=?', {year:anyo, month:mes, offset:offset} , function(data){
            destino.slideDown(function(){

                cargando.fadeOut(function(){
                    cargando.remove();

                    destino_inicial.addClass('on');

                    
                    var elementos=data.data;

                    if(elementos.length>0){
                        var canceladas = 0;
                        var completadas = 0;
                        for(var j=0;j<elementos.length;j++){
                            if(elementos[j].status=='completed'){
                                completadas++;
                            }
                            if(elementos[j].status=='canceled'){
                                canceladas++;
                            }
                        }
                        for(var i=0;i<elementos.length;i++){
                            var elemento=elementos[i];
                            var id=elemento.id;
                           creaElementoHistorico(elemento,destino);
                        }
                        creaResumen(canceladas,completadas,destino);

                        var formulario=$('<form></form>').attr({'target':'informe_pulsador', 'class':'form_informe','method':'post', 'action':base_url+'informe_pulsador','data-fecha':anyo+mes});
                        var informe=$('<div></div>').attr({'class':'btn_informe linkable'}).text("Informe PDF"); formulario.append(informe);
                        var input_y = $('<input></input>').attr({'name':'year', 'type':'hidden', 'value':anyo});
                        var input_m = $('<input></input>').attr({'name':'month', 'type':'hidden', 'value':mes});
                        formulario.append(input_y);
                        formulario.append(input_m);

                        informe.click(function(){

                            var formulario=$('.form_informe[data-fecha="'+anyo+mes+'"]');

                            formulario.submit();
                        });
                        //destino.append(formulario);


                    }

                    else{

                        var found=destino.find('.mensaje');
                        if (found.length<1){
                            var mensaje=$('<div></div>').attr({'class':'mensaje'}).text("No hay solicitudes");
                            destino.append(mensaje);
                        }


                    }
                });
            });



        });

    }


    else{
        var destino=$('.historial[data-fecha="'+anyo+mes+'"]');
        destino.slideUp(function(){
            destino.remove();
            destino_inicial.removeClass('on');
        });

    }
}

function creaElementoHistorico(elemento,destino) {

    if (elemento.status=="completed" || elemento.status=="canceled"){



        var id=elemento.id;
        var estado = '';
        if(elemento.status=='completed'){
            estado = 'completado';
        }else{
            if(elemento.status=='canceled'){
                estado = 'cancelado';
            }
        }
        var fechita = elemento.date_depart.split(" ");
        var hora=fechita[1];
        var fecha_recogida=fechita[0];
        var tipo ='';
        if(elemento.digital=='true'){
            tipo = "digital";
        }else{
            tipo = "tradicional";
        }
        var taxista=elemento.driver;

        var licencia=elemento.licence;


        var fecha=elemento.date_depart.substring(0,10);

        var item= $('<div></div>').attr({'class':'item '+elemento.status, 'data-id':id, 'data-estado':estado, 'data-hora':hora,  'data-fecha-recogida':fecha_recogida});

            var intra= $('<div></div>').attr({'class':'intra izquierda pasajero'}); item.append(intra);

                var col1= $('<div></div>').attr({'class':'col1'});       intra.append(col1);
                    var top= $('<div></div>').attr({'class':'top'}).text(fecha);                  col1.append(top);
                    var floor= $('<div></div>').attr({'class':''}).text(hora);                  col1.append(floor);

                var separador= $('<div></div>').attr({'class':'separador'});                  intra.append(separador);

                var col2= $('<div></div>').attr({'class':'col2'});                  intra.append(col2);
                    var top= $('<div></div>').attr({'class':'top'}).text('TAXI '+estado);                  col2.append(top);
                    var floor= $('<div></div>').attr({'class':'floor'});  col2.append(floor);

                    if (tipo=="digital" && taxista!=0) floor.text(licencia+" - "+taxista);
                    else{
                        if(licencia!=0) floor.text('LIC.Nº: '+licencia);
                    }

                var separador= $('<div></div>').attr({'class':'separador'});                  intra.append(separador);

                var col3= $('<div></div>').attr({'class':'col3'});       intra.append(col3);
                    if (estado=="completado") var icono_carrera="icon-ok";
                    else var icono_carrera="icon-remove";

                    var estado_carrera=$('<div></div>').attr({'class':'icono_carrera'}).html('<i class="'+icono_carrera+' icon-large"></i>');          col3.append(estado_carrera);



        destino.append(item);

    }


}

function creaResumen(canceladas,completadas,destino) {

        var item= $('<div></div>').attr({'class':'item resumen'});

            var intra= $('<div></div>').attr({'class':'intra izquierda pasajero'}); item.append(intra);

                var col1= $('<div></div>').attr({'class':'col1'}).css({'width':'89px'});       intra.append(col1);
                    var top= $('<div></div>').attr({'class':'top'}).text('RESUMEN');                  col1.append(top);
                    var floor= $('<div></div>').attr({'class':'floor'}).text('MES');                  col1.append(floor);

                var separador= $('<div></div>').attr({'class':'separador'});                  intra.append(separador);

                var col2= $('<div></div>').attr({'class':'col2'}).css({'text-align':'right'});                  intra.append(col2);
                    var top= $('<div></div>').attr({'class':'top'}).text('COMPLETADAS: '+completadas).css({'width':'150px'});                  col2.append(top);
                    var floor= $('<div></div>').attr({'class':'floor'}).text('CANCELADAS: '+canceladas).css({'width':'150px'});  col2.append(floor);


                var separador= $('<div></div>').attr({'class':'separador'});                  intra.append(separador);

                var col3= $('<div></div>').attr({'class':'col3'});       intra.append(col3);

                    var estado_carrera=$('<div></div>').attr({'class':'icono_carrera'}).html('<i class="icon-ok icon-large"></i>').css({'margin':'0px auto'});          col3.append(estado_carrera);
                    var estado_carrera=$('<div></div>').attr({'class':'icono_carrera'}).html('<i class="icon-remove icon-large"></i>').css({'margin':'0px auto'});          col3.append(estado_carrera);



        destino.append(item);


}






// Cerrar sesion
function abreCerrarSesion(){
    $('#modal').removeClass("error");
    var found=$('#modal>.input');
    if (found.length>0) $('#modal>.input').remove();
    var div_input=$('<div></div>').attr({'class':'input'});
    $('#modal>.texto').text('¿Quieres cerrar sesión?');
    var div_input=$('<div></div>').attr({'class':'input'});
    var esperar=$('<div></div>').attr({'class':'btn corto'}).text('ACEPTAR').click(function(){cerrarSesion();});
    var cancelar=$('<div></div>').attr({'class':'btn corto'}).text('CANCELAR').click(function(){cerrarAlert(0);});
    div_input.append(esperar);
    div_input.append(cancelar);
    $('#modal').append(div_input);
    $('#modal').fadeIn(function(){});
}

function cerrarSesion(){
	$.getJSON(api_url+'auth/logout?callback=?', {}, function(data){
		window.close();
	});
}


// modales
function cerrarAlert(tipo){

    $('#modal').fadeOut(function(){
        $('#overlay').fadeOut(function(){
            var found=$('#modal>.input');
            if (found.length>0) $('#modal>.input').remove();
            $('#modal>.btn').remove();
            $('#modal').removeClass('error');}
        );
        if(tipo) window.close();

    });
}

function muestraErrorSesion(){
    $('#overlay').fadeIn(function(){
        var found=$('#modal>.input');
        if (found.length>0) $('#modal>.input').remove();
        $('#modal').addClass('error');
        $('#modal>.texto').text('Se ha cerrado la sesión. Vuelva a iniciar sesión para solicitar taxis');
        var found=$('#modal>.input');
        if (found.length>0) $('#modal>.input').remove();
        var div_input=$('<div></div>').attr({'class':'input'});
        var aceptar=$('<div></div>').attr({'class':'btn'}).text('CERRAR').click(function(){cerrarAlert(1);});
        div_input.append(aceptar);
        $('#modal').append(div_input);
        $('#modal').fadeIn();
    });
}

function modalError(message){
    $('#overlay').fadeIn(function(){
        var found=$('#modal>.input');
        if (found.length>0) $('#modal>.input').remove();
        $('#modal').addClass('error');
        $('#modal>.texto').text(message);
        var div_input=$('<div></div>').attr({'class':'input'});
        var aceptar=$('<div></div>').attr({'class':'btn'}).text('CERRAR').click(function(){cerrarAlert(0);});
        div_input.append(aceptar);
        $('#modal').append(div_input);
        $('#modal').fadeIn();
    });
}

function modalInfo(message){
    $('#overlay').fadeIn(function(){
        var found=$('#modal>.input');
        if (found.length>0) $('#modal>.input').remove();
        $('#modal').addClass('info');
        $('#modal>.texto').text(message);
        var div_input=$('<div></div>').attr({'class':'input'});
        var aceptar=$('<div></div>').attr({'class':'btn'}).text('CERRAR').click(function(){cerrarAlert(0);});
        div_input.append(aceptar);
        $('#modal').append(div_input);
        $('#modal').fadeIn();
    });
}


// Tools
function getLocalOffset(){
	var d = new Date()
	return d.getTimezoneOffset()/60*-1;
}


