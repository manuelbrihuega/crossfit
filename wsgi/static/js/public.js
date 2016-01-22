$(document).ready(function(){
	$.ajaxSetup({ cache: false });
	loadLocation();
	load_progress(1);
    activa_idiomas();
    //setTimeout(function(){loadLastPostBlog();},1000);
    jQuery.fn.reset = function () {
      $(this).each (function() { this.reset(); });
    }

})

var langs=['CR','PA','PE'];
var prefix=34;

function loadLocation() {
	var lang=$('body').attr('data-lang');
    if (lang==""){
        $.getScript('http://www.geoplugin.net/javascript.gp', function()
        {
            var countryCode = geoplugin_countryCode();
            // countryCode='CR';
            alert(countryCode);
            if(countryCode=='CR' && lang!='cr') setLang('cr',true);
            if(countryCode=='PA' && lang!='pa') setLang('pa',true);
            if(countryCode=='PE' && lang!='pe') setLang('pe',true);
            if(langs.indexOf(countryCode)==-1) setLang('es', false);
        });
    }
}

function lanzarModalRestore(){
    var mymodal=newModal('modal_passengers_download',true, false);
    mymodal.find('.modal-dialog');
    modalAddTitle(mymodal,'');
    var body=$('<div></div>').attr('class','home');
    body.html('<h1>RESTAURAR CONTRASEÑA</h1><h3 style="text-transform: none;">Si no recuerdas tu contraseña introduce el email con el que te registraste en el sistema y pulsa en restaurar, te enviaremos una nueva contraseña que podrás cambiar más tarde desde tu perfil </h3><input type="text" class="form-control" placeholder="Introduce tu email" id="email" name="email" style="width: 300px; margin-top: 29px; margin-left: auto; margin-right: auto;"><div class="botonera" style="margin-top: 18px; margin-bottom: 37px;"><div style="text-align:center;"><button style="background-color: #075a8f; border-color: #075a8f;" id="botonenviar" type="submit" onclick="restaurarPass();" class="btn btn-warning">RESTAURAR</button></div></div>');
    modalAddBody(mymodal,body);

    mymodal.modal('show');
}

function setLang(lang,reload) {
	$.post(base_url+'/ajax/set_lang', {country_code:lang}, function(data, textStatus, xhr) {
		////console.log(data);
		var res=$.parseJSON(data);
        if(res.status=="success" && reload) location.reload();
		load_progress(1);
	});
}

function restaurarPass(){
    $.getJSON(api_url+'auth/restorepass?callback=?', {
                email:email
                }, function(data){
                        if(data.status=='success'){
                            launch_alert('<i class="fa fa-frown-o"></i> Cambiado correctamente','');
                            $('#modal_passengers_download').modal('hide');
                        }
                        else{
                            launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');

                        }

            });
}

function load_progress(percent) {
    var bar=$('#progress_bar');
    if (bar.css('display')!="none" && percent<=100){
        bar.css('width',percent.toString()+"%");
		percent+=1;
		delay=(0.0001*percent*percent*percent)+10;
        setTimeout(function(){load_progress(percent);},delay);
    }
}


function loadLastPostBlog(){
    var wrapperBlog= $('#preblog');
    wrapperBlog.css('opacity','0');

    var lang=$('body').attr('data-lang');

    var loadingblog=$('#loadingblog');
    var url_root="http://api.tumblr.com/v2/blog/taxible.tumblr.com/posts?";
    if (lang=='es') url_root="http://api.tumblr.com/v2/blog/taxible.tumblr.com/posts?";
    if (lang=='cr') url_root="http://api.tumblr.com/v2/blog/taxiblecr.tumblr.com/posts?";
    if (lang=='pa') url_root="http://api.tumblr.com/v2/blog/taxiblepa.tumblr.com/posts?";
    if (lang=='pe') url_root="http://api.tumblr.com/v2/blog/taxiblepe.tumblr.com/posts?";
	var tumblr_params="limit=1&jsonp=leePost&api_key=";
	var tumblr_key="YcyuzunXCSr7XgkXVtNez8MtcE6U0NaKeAwRwmX4ubqp1o1Rb6";

	var urltumblr=url_root+tumblr_params+tumblr_key;

	$.ajax({
		url: urltumblr,
	  	dataType: 'jsonp',
		crossDomain: true,
		cache: false,
		jsonpCallback: 'leePost',
		success: function(datos){
            if(datos.response.posts.length>0){
                var post=datos.response.posts[0];

                if (post.type=='photo'){
                    var titulo='';
                    var cuerpo='';
                    var contenthtml=$.parseHTML(post.caption);
                    var foundparrafos=$(contenthtml);
                    for(var i=0;i<foundparrafos.length;i++){
                        var foundtitulo=$(foundparrafos)[i];
                        var foundcuerpo=$(foundparrafos)[i+1];

                        if (titulo=="" && foundtitulo && $(foundtitulo).html()) titulo=$(foundtitulo).text().substring(0,40);
                        if (cuerpo=="" && foundcuerpo && $(foundcuerpo).html()) cuerpo=$(foundcuerpo).text().substring(0,335);
                    }


                    var imagen=post.photos[0].original_size.url;
                }
                else{
                    var titulo=post.title;
                    var imagen='';
                    var cuerpo='';
                    var contenthtml=$.parseHTML(post.body);
                    var temp_blog=$('<div></div>').attr({'id':'temp_blog'});
                    temp_blog.append($(contenthtml));
                    $('body').append(temp_blog);
                    var foundimages=$(contenthtml).find('img');
                    if (foundimages.length>0) var imagen=$(foundimages[0]).attr('src');
                    var foundparrafos=temp_blog.find('p');
                    ////console.log(foundparrafos);
                    for(var i=0;i<foundparrafos.length;i++){
                        var foundcuerpo=$(foundparrafos)[i];
                        ////console.log($(foundcuerpo));

                        if (cuerpo=="" && foundcuerpo && $(foundcuerpo).text()) cuerpo=$(foundcuerpo).text().substring(0,335);
                    }

                    $('#temp_blog').remove();

                }

                $('#blogtitle').text(titulo);
                $('#blogcuerpo').html(cuerpo);
                if(imagen!='') $('#blogimg').attr('src', imagen);
                else $('#blogimg').hide();
                loadingblog.fadeOut(function(){
                    wrapperBlog.fadeIn();
                });


                wrapperBlog.hide().slideDown().animate({'opacity':'1'});
                seturltumblr();
            }
        }
	});
}


function seturltumblr(){
    var url_tumblr='http://taxible.tumblr.com';
    var lang=$('body').attr('data-lang');
    if(lang=='es') url_tumblr='http://taxible.tumblr.com';
    if(lang=='cr') url_tumblr='http://taxiblecr.tumblr.com';
    if(lang=='pa') url_tumblr='http://taxiblepa.tumblr.com';
    if(lang=='pe') url_tumblr='http://taxiblepe.tumblr.com';

    $('#bloglink').attr('href',url_tumblr);
}

function modal_passengers_info() {
	var mymodal=newModal('modal_passengers_info',false, false);
    mymodal.find('.modal-dialog');
    modalAddTitle(mymodal,'');
	doModalNotPadding(mymodal);
    var body=$('<div></div>').attr({'class':''});
    var button = $('<button></button>').attr({'class':'close', 'type':'button', 'data-dismiss':'modal', 'aria-hidden':'true'}).css({'font-size':'30px','padding':'10px'}).html('&times;'); body.append(button);
    modalAddBody(mymodal,body);

	mymodal.modal('show');



}

function modal_passengers_download() {
	var mymodal=newModal('modal_passengers_download',true, false);
    mymodal.find('.modal-dialog');
    modalAddTitle(mymodal,'');
    var body=$('<div></div>').attr('class','home');
    var h1 = $('<h1></h1>').text('DESCARGAR APP'); body.append(h1);
    var h3 = $('<h3></h3>').text('ELIGE TU SISTEMA OPERATIVO'); body.append(h3);
    var botonera=$('<div></div>').attr({'class':'botonera'}); body.append(botonera);
    var link = $('<a>').attr({'href':'https://itunes.apple.com/es/app/taxible/id602835004?mt=8'}); botonera.append(link);
    var button = $('<div></div>').attr({'class':'download spritehome sphome_app_store'}); link.append(button);
    var link = $('<a>').attr({'href':'https://play.google.com/store/apps/details?id=com.idearioventures.taxible&hl=es'}); botonera.append(link);
    var button = $('<div></div>').attr({'class':'download spritehome sphome_google_play'}); link.append(button);
    modalAddBody(mymodal,body);


	mymodal.modal('show');



}


function modal_drivers_info() {
	var mymodal=newModal('modal_drivers_info',false, false);
    mymodal.find('.modal-dialog');
    modalAddTitle(mymodal,'');
	doModalNotPadding(mymodal);
    var body=$('<div></div>').attr({'class':''});
    var button = $('<button></button>').attr({'class':'close', 'type':'button', 'data-dismiss':'modal', 'aria-hidden':'true'}).css({'font-size':'30px','padding':'10px'}).html('&times;'); body.append(button);
    modalAddBody(mymodal,body);

	mymodal.modal('show');



}

function modal_drivers_download() {
	var mymodal=newModal('modal_drivers_download',true, false);
    mymodal.find('.modal-dialog');
    modalAddTitle(mymodal,'');
    var body=$('<div></div>').attr('class','home');
    var h1 = $('<h1></h1>').text('DESCARGAR APP'); body.append(h1);
    var h3 = $('<h3></h3>').text('ELIGE TU SISTEMA OPERATIVO'); body.append(h3);
    var botonera=$('<div></div>').attr({'class':'botonera'}); body.append(botonera);
    var link = $('<a>').attr({'href':'https://itunes.apple.com/es/app/taxible-driver/id848377763?mt=8'}); botonera.append(link);
    var button = $('<div></div>').attr({'class':'download spritehome sphome_app_store'}); link.append(button);
    var link = $('<a>').attr({'href':'https://play.google.com/store/apps/details?id=com.idearioventures.taxibledriver'}); botonera.append(link);
    var button = $('<div></div>').attr({'class':'download spritehome sphome_google_play'}); link.append(button);
    modalAddBody(mymodal,body);


	mymodal.modal('show');



}

function modal_enterprises_info() {
	var mymodal=newModal('modal_enterprises_info',false, false);
    mymodal.find('.modal-dialog');
    modalAddTitle(mymodal,'');
	doModalNotPadding(mymodal);
    var body=$('<div></div>').attr({'class':''});
    var button = $('<button></button>').attr({'class':'close', 'type':'button', 'data-dismiss':'modal', 'aria-hidden':'true'}).css({'font-size':'30px','padding':'10px'}).html('&times;'); body.append(button);
    modalAddBody(mymodal,body);

	mymodal.modal('show');



}

function modal_enterprises_sent() {
	var mymodal=newModal('modal_enterprises_sent',false, false);
    mymodal.find('.modal-dialog');
    modalAddTitle(mymodal,'');
	doModalNotPadding(mymodal);
    var body=$('<div></div>').attr({'class':''});
    var button = $('<button></button>').attr({'class':'close', 'type':'button', 'data-dismiss':'modal', 'aria-hidden':'true'}).css({'font-size':'30px','padding':'10px'}).html('&times;'); body.append(button);
    modalAddBody(mymodal,body);

	mymodal.modal('show');

}

function modal_enterprise_register() {

    $.post(base_url+'/partials/modal_enterprise_register', function(template, textStatus, xhr) {
        var mymodal=newModal('modal_enterprise_register',true, true);
        mymodal.find('.modal-dialog');
        modalAddTitle(mymodal,'');

        var body=$('<div></div>');
        body.html(template);
        modalAddBody(mymodal,body);

        var footer=$('<div></div>');
        var button=$('<button></button>').attr({'type':'button','data-loading-text':'ENVIANDO','class':'btn btn-warning'}).text('ENVIAR'); footer.append(button);
        button.click(function(){

            var language=$('body').attr('data-lang').split('-');
            if (language.length>1) var country_code=language[1];
            else var country_code=language[0];

            var name=$('#e_contact_input').val();
            var surname='';
            var email=$('#e_email_input').val();
            var cif=$('#e_cif_input').val();
            var password=$('#e_cif_input').val();
            var phone=$('#e_phone_input').val();
            var enterprise_name=$('#e_name_input').val();
            var address=$('#e_address_input').val();
            var postal_code=$('#e_postal_input').val();
            var locality=$('#e_locality_input').val();

            $.getJSON(api_url+'enterprises/signup_request?callback=?', {
                name:name,
                surname:surname,
                email:email,
                cif:cif,
                password:password,
                prefix:prefix,
                phone:phone,
                enterprise_name:enterprise_name,
                address:address,
                postal_code:postal_code,
                locality:locality,
                country_code:country_code
                }, function(data){
                        if(data.status=='success'){
                            $('#form_enterprise_signup_request').reset();
                            mymodal.modal('hide');
                            modal_enterprises_sent();

                        }
                        else{
                            launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');

                        }

            });
        });
        modalAddFooter(mymodal,footer);

        mymodal.modal('show');

    });





}


function launch_alert(message,type) {
	$('#alert').removeClass().addClass('animated fadeInDown '+type).html(message).show();
	setTimeout(function(){
		$('#alert').slideUp(function(){
			$('#alert').removeClass().empty().hide();
		});
	},3000);
}


function activa_idiomas(){
    var boton=$('#menu>li.lang');

    var items='';
    items += '<li class="flag es" data-lang="es" onclick="selectlang(this)">España</li>';
    items += '<li class="flag cr" data-lang="cr" onclick="selectlang(this)">Costa Rica</li>';
    items += '<li class="flag pa" data-lang="pa" onclick="selectlang(this)">Panamá</li>';
    items += '<li class="flag pe" data-lang="pe" onclick="selectlang(this)">Perú</li>';
    items += '<li class="flag ad" data-lang="ad" onclick="selectlang(this)">Andorra</li>';

	boton.popover({'content':'<ul id="languages">'+items+'</ul>', 'placement':'bottom','html':true});


}


function selectlang(element){
    var lang=$(element).attr('data-lang');
    setLang(lang,true);

}


function modal_eula(name) {
	var mymodal=newModal('modal_eula_',true, false);
    modalAddTitle(mymodal,'');
    $.post(base_url+'/partials/'+name, function(template, textStatus, xhr) {
        var body=$('<div></div>');
        body.html(template);
        modalAddBody(mymodal,body);
        mymodal.modal('show');

    });


}

function mandaFormularioNewsletter () {
    var formulario=$('#form-subscription');
    var input=$('#mce-EMAIL');
    var item=input.parent().parent();
    if(input.val().length>0) formulario.submit();
}


function goto(url){
	window.location=url;
}


function play_video_home(){
    var mymodal=newModal('video_home','', false);
    doModalNotPadding(mymodal);
    var body=$('<div></div>');
    var item = $('<iframe></iframe>').attr({'src':'//player.vimeo.com/video/90757157?title=0&amp;byline=0&amp;portrait=0&amp;autoplay=1','width':'500','height':'281','frameborder':'0','webkitallowfullscreen':'','mozallowfullscreen':'','allowfullscreen':''});
    body.html(item);
    modalAddBody(mymodal,body);
    mymodal.modal('show');
}