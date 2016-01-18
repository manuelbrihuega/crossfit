$(document).ready(function(){
	$.ajaxSetup({ cache: false });
	status();
	main_waiting();

})

// HASH
function sethash(hash) {
	window.location.hash = hash;
}

var myrole=false;

function status() {
	var parametros=''
	var pass = true;
	$.getJSON( api_url+'auth/status?callback=?', parametros, function(data){
		if(data.status=='success' && data.response=='logged'){
			if(data.data.role=='U_Drivers'){
				$.getJSON(api_url+'drivers/get?callback=?', '', function(data){
					if(data.status=='success'){
						if (data.data.driver_profile.validated == '0'){
							pass=false;
							window.location.href="/validate_driver/"+data.data.auth_profile.token;
						}
					}
				});
			}
			if(pass){
				myrole=data.data.role;
				$('body').attr({'data-role':data.data.role, 'data-auth-id':data.data.auth_id});
				$.jCookie(data.data.role,data.data.token);
				identify(data.data.role);
			}
		}
		else window.location=base_url;
	});
}

function logout() {
	$.getJSON( api_url+'auth/logout?callback=?', '', function(data){
		if(data.status=='success' || data.response=='not_logged'){
			$.jCookie('U_Super',null);
			$.jCookie('U_Delegations',null);
			window.location=base_url;
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al desconectar','warning')
	});
	return false;
}

function tokin(token) {
	$.getJSON( api_url+'auth/tokin?callback=?', {token:token}, function(data){
		if(data.status=='success') window.location=base_url+'/dashboard';
		else launch_alert('<i class="fa fa-frown-o"></i> Error al identificar con token','warning')
	});
	return false;
}


function identify(role) {
	switch(role){
		case 'U_Super': 		var method_url=api_url+'auth/get?callback=?';
								update_tickets_badge();
								update_pending_drivers_badge();
								update_pending_enterprises_badge();
								break;

		case 'U_Delegations': 	var method_url=api_url+'auth/get?callback=?';
								update_tickets_badge();
								update_pending_drivers_badge();
								update_pending_enterprises_badge();
								ninja_jumps();
								break;

		case 'U_Passengers': 	var method_url=api_url+'passengers/get?callback=?';
								update_tickets_badge();
								ninja_jumps();
								break;

		case 'U_Drivers': 		var method_url=api_url+'auth/get?callback=?';
								update_tickets_badge();
								ninja_jumps();
								break;

		case 'U_Buttons': 		var method_url=api_url+'auth/get?callback=?';
								ninja_jumps();
								break;

		case 'U_Viewer_Radios': var method_url=api_url+'auth/get?callback=?';
								update_tickets_badge();
								ninja_jumps();
								break;

		case 'U_Viewer_Digital_Radios': var method_url=api_url+'auth/get?callback=?';
								update_tickets_badge();
								ninja_jumps();
								break;

		case 'U_Admin_Enterprises':var method_url=api_url+'auth/get?callback=?';
								update_tickets_badge();
								ninja_jumps();
								break;

		case 'U_Operators': 	var method_url=api_url+'auth/get?callback=?';
								ninja_jumps();
								break;

        case 'U_Supporters': var method_url=api_url+'auth/get?callback=?';
                                update_tickets_supporter_badge();
                                ninja_jumps();
                                break;

		default: ninja_jumps();
	}

	if(method_url){
		$.getJSON( method_url, '', function(data){
			if(data.status=='success'){
				var name=data.data.auth_profile.name+' '+data.data.auth_profile.surname;
				$('#user_name').text(name);
				select_content();

			}
			else super_error('Data failure');
		});
	}
	else super_error('Permission denied');

}


function select_content() {
	var section = $('body').attr('data-section');
	var role = $('body').attr('data-role');
	var javascript=false;


	switch (section) {
		case 'dashboard': 			if(role=='U_Passengers') javascript='dashboard/passenger.js';
									if(role=='U_Drivers') javascript='historical/driver.js';
									if(role=='U_Buttons') javascript='dashboard/button.js';
									if(role=='U_Viewer_Radios') javascript='dashboard/viewer.js';
									if(role=='U_Viewer_Digital_Radios') javascript='dashboard/digitalviewer.js';
									if(role=='U_Delegations') javascript='delegations/delegation_super.js';
									if(role=='U_Super') javascript='dashboard/super.js';
									if(role=='U_Supporters') javascript='tickets/supporters.js';
									if(role=='U_Operators') javascript='dashboard/operator.js';
									if(role=='U_Admin_Enterprises') javascript='dashboard/admin_enterprise.js';

									break;

		case 'locations': 			if(role=='U_Viewer_Digital_Radios') javascript='locations/digitalviewer.js';
									break;

		case 'flota': 				if(role=='U_Viewer_Digital_Radios') javascript='flota/digitalviewer.js';
									break;

		case 'touroperators': 		if(role=='U_Viewer_Digital_Radios') javascript='touroperators/digitalviewer.js';
									break;

		case 'gestores': 			if(role=='U_Viewer_Digital_Radios') javascript='gestores/digitalviewer.js';
									break;

		case 'seguimiento': 		if(role=='U_Operators') javascript='seguimiento/operator.js';
									if(role=='U_Super') javascript='seguimiento/operator.js';
									if(role=='U_Viewer_Digital_Radios') javascript='seguimiento/operator.js';
									break;

		case 'journeys': 			if(role=='U_Super') javascript='journeys/super.js';
									if(role=='U_Delegations') javascript='journeys/super.js';
									break;

		case 'users': 				if(role=='U_Super') javascript='users/super.js';
									if(role=='U_Delegations') javascript='users/super.js';
									break;

		case 'enterprises': 		if(role=='U_Super') javascript='enterprises/super.js';
									if(role=='U_Delegations') javascript='enterprises/super.js';
									break;

		case 'passengers': 			if(role=='U_Super') javascript='passengers/super.js';
									if(role=='U_Delegations') javascript='passengers/super.js';
									break;

		case 'call': 				if(role=='U_Super') javascript='operators/super.js';
									break;

		case 'digitaloperators': 	if(role=='U_Super') javascript='digitaloperators/super.js';
									break;

		case 'operators': 			if(role=='U_Super') javascript='operators/super.js';
									break;

		case 'get_taxi': 			if(role=='U_Admin_Enterprises') javascript='get_taxi/admin_enterprise.js';
									break;

		case 'projects': 			if(role=='U_Admin_Enterprises') javascript='projects/admin_enterprise.js';
									break;

		case 'tariff': 				if(role=='U_Delegations') javascript='tariff/delegation.js';
									break;

		case 'drivers': 			if(role=='U_Super') javascript='drivers/super.js';
									if(role=='U_Delegations') javascript='drivers/super.js';
									if(role=='U_Viewer_Digital_Radios') javascript='drivers/digitalviewer.js';
									break;

		case 'subscriber_service': 	if(role=='U_Drivers') javascript='subscriber/driver.js';
									if(role=='U_Viewer_Radios') javascript='subscriber/viewer.js';
									break;

		case 'radios': 				if(role=='U_Super') javascript='radios/super.js';
									if(role=='U_Delegations') javascript='radios/super.js';
									break;

		case 'radio': 				if(role=='U_Super') javascript='radios/radio_super.js';
									if(role=='U_Delegations') javascript='radios/radio_super.js';
									break;

		case 'delegations': 		if(role=='U_Super') javascript='delegations/super.js';
									break;

		case 'delegation': 			if(role=='U_Super') javascript='delegations/delegation_super.js';
									break;

		case 'profile': 			if(role=='U_Passengers') javascript='profile/passenger.js';
									if(role=='U_Drivers') javascript='profile/driver.js'; 
									if(role=='U_Admin_Enterprises') javascript='profile/admin_enterprise.js';
									if(role=='U_Viewer_Digital_Radios') javascript='profile/digitalviewer.js';
									break;

		case 'enterprisesradio': 	if(role=='U_Viewer_Digital_Radios') javascript='enterprisesradio/digitalviewer.js';
									break;

		case 'stadistics': 			if(role=='U_Super') javascript='stadistics/super.js';
									if(role=='U_Delegations') javascript='stadistics/super.js'; 
									break;

		case 'invoicing': 			if(role=='U_Drivers') javascript='invoicing/driver.js'; 
									if(role=='U_Delegations') javascript='invoicing/delegation.js'; 
									if(role=='U_Super') javascript='invoicing/super.js';
									if(role=='U_Admin_Enterprises') javascript='invoicing/admin_enterprise.js';
									if(role=='U_Viewer_Digital_Radios') javascript='invoicing/digitalviewer.js';
									break;

		case 'employees': 			if(role=='U_Admin_Enterprises') javascript='employees/admin_enterprise.js';
									break;

		case 'historical': 			if(role=='U_Passengers') javascript='historical/passenger.js';
									if(role=='U_Admin_Enterprises') javascript='historical/admin_enterprise.js';
									if(role=='U_Viewer_Digital_Radios') javascript='historical/digitalviewer.js';
									break;

		case 'favourites': 			if(role=='U_Passengers') javascript='favourites/passenger.js';
									break;

		case 'news': 				if(role=='U_Super') javascript='news/super.js';
									if(role=='U_Passengers') javascript='news/users.js';
									if(role=='U_Operators') javascript='news/operator.js';
									if(role=='U_Viewer_Radios') javascript='news/users.js';
									if(role=='U_Viewer_Digital_Radios') javascript='news/adminradios.js';
									if(role=='U_Drivers') javascript='news/users.js';
									if(role=='U_Admin_Enterprises') javascript='news/users.js';
									break;

		case 'tickets': 			if(role=='U_Passengers') javascript='tickets/users.js';
									if(role=='U_Operators') javascript='tickets/users.js';
									if(role=='U_Viewer_Radios') javascript='tickets/users.js';
									if(role=='U_Viewer_Digital_Radios') javascript='tickets/users.js';
									if(role=='U_Drivers') javascript='tickets/users.js';
									if(role=='U_Delegations') javascript='tickets/users.js';
									if(role=='U_Super') javascript='tickets/users.js';
									if(role=='U_Admin_Enterprises') javascript='tickets/users.js';

									break;

		case 'faqs': 				if(role=='U_Passengers') javascript='faqs/users.js';
									if(role=='U_Viewer_Radios') javascript='faqs/users.js';
									if(role=='U_Drivers') javascript='faqs/users.js';
									if(role=='U_Delegations') javascript='faqs/users.js';
									if(role=='U_Admin_Enterprises') javascript='faqs/users.js';
									if(role=='U_Super') javascript='faqs/super.js';
									break;


	}

	if(javascript){
		//console.log(javascript);
		$.getScript(media_url+'js/'+javascript, function(){
			get_content();
		});
	}

	else {
		super_error('Route failure');
	}

}

//NINJA
function ninja_jumps() {
	if($.jCookie('U_Super')) $('#ninja_super').show();
	if($.jCookie('U_Delegations') && myrole!='U_Delegations') $('#ninja_delegation').show();

}

function restoreNinjaSuper() {
	if($.jCookie('U_Super')) tokin($.jCookie('U_Super'));
	else launch_alert('<i class="fa fa-frown-o"></i> Error al cambiar identidad','warning')
}

function restoreNinjaDelegation() {
	if($.jCookie('U_Delegations')) tokin($.jCookie('U_Delegations'));
	else launch_alert('<i class="fa fa-frown-o"></i> Error al cambiar identidad','warning')
}

function restoreRadioViewer() {
	if($.jCookie('U_Viewer_Radios')) tokin($.jCookie('U_Viewer_Radios'));
	else document.location.reload(true);
}

// AUTH
function ban(auth_id) {
	$.getJSON(api_url+'auth/ban?callback=?',{id:auth_id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Usuario baneado','');
			var footer = $('.modal-footer').find('.unbanned');
			footer.removeClass('unbanned').addClass('banned');
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al banear','warning');
	});
}

function unban(auth_id) {
	$.getJSON(api_url+'auth/unban?callback=?',{id:auth_id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Usuario un-baneado','');
			var footer = $('.modal-footer').find('.banned');
			footer.removeClass('banned').addClass('unbanned');
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al un-banear','warning');
	});
}

function activate(auth_id) {
	$.getJSON(api_url+'auth/activate?callback=?',{id:auth_id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Usuario activado','');
			var footer = $('.modal-footer').find('.inactive');
			footer.removeClass('inactive').addClass('active');
			if ( typeof load_pending_drivers == 'function' ) { load_pending_drivers(); 	}
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al activar','warning');
	});
}

function activate_driver(auth_id) {
	$.getJSON(api_url+'drivers/activate?callback=?',{id:auth_id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Usuario activado','');
			var footer = $('.modal-footer').find('.inactive');
			footer.removeClass('inactive').addClass('active');
			if ( typeof startPending == 'function' ) { startPending(); 	}
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al activar','warning');
	});
}



function deactivate(auth_id) {
	// body...
}

// BADGES

function update_tickets_badge() {
	$.getJSON(api_url+'tickets/notifications?callback=?','', function(data){
		if(data.status=='success'){
			notifications=parseInt(data.data);
			if(notifications>0)$('#badge_tickets').text(notifications).fadeIn();
			else $('#badge_tickets').text(notifications).fadeOut();
		}
	});
}

function update_tickets_supporter_badge() {
	$.getJSON(api_url+'tickets/notifications_supporters?callback=?','', function(data){
		if(data.status=='success'){
			notifications=parseInt(data.data);
			if(notifications>0)$('#badge_tickets_supporter').text(notifications).fadeIn();
			else $('#badge_tickets_supporter').text(notifications).fadeOut();
		}
	});
}

function update_pending_drivers_badge() {
	$.getJSON(api_url+'drivers/list_pending_notification?callback=?','', function(data){
		if(data.status=='success'){
			notifications=parseInt(data.data);
			if(notifications>0)$('#badge_drivers').text(notifications).fadeIn();
			else $('#badge_drivers').text(notifications).fadeOut();
		}
	});
}

function update_pending_enterprises_badge() {
	$.getJSON(api_url+'enterprises/list_pending_notification?callback=?','', function(data){
		if(data.status=='success'){
			notifications=parseInt(data.data);
			if(notifications>0)$('#badge_enterprises').text(notifications).fadeIn();
			else $('#badge_enterprises').text(notifications).fadeOut();
		}
	});
}


var theroles = {	'U_Super' : 'Super',
					'U_Passengers' : 'Pasajeros',
					'U_Drivers' : 'Taxistas', 
					'U_Viewer_Radios' : 'Gestores de solicitures (Radios tradicionales)', 
					'U_Viewer_Digital_Radios' : 'Administrador de Radios digitales', 
					'U_Admin_Radios' : 'Administradores de Radios Tradicionales', 
					'U_Delegations' : 'Delegaciones', 
					'U_Supporters' : 'Soporte', 
					'U_Operators' : 'Operadoras', 
					'U_Buttons' : 'Pulsadores',
					'U_Admin_Enterprises' : 'Administradores de Empresas'
				};


// ALERTA

function launch_alert(message,type) {
	$('#alert').removeClass().addClass('animated fadeInDown '+type).html(message).show();
	setTimeout(function(){
		$('#alert').slideUp(function(){
			$('#alert').removeClass('warning').empty().hide();
		});
	},3000);
}

function super_error(message) {
	$('#main').empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">'+message+'</div></div>');
}

function main_waiting() {
	$('#main').empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-refresh fa-spin"></i></div><div class="text">Cargando</div></div>');
}

function goto(url){
	window.location=url;
}

function goback() {
	history.back();
}

/*coockies*/
jQuery.jCookie=function(i,b,l,j){if(!navigator.cookieEnabled){return false}var j=j||{};if(typeof(arguments[0])!=="string"&&arguments.length===1){j=arguments[0];i=j.name;b=j.value;l=j.expires}i=encodeURI(i);if(b&&(typeof(b)!=="number"&&typeof(b)!=="string"&&b!==null)){return false}var e=j.path?"; path="+j.path:"";var f=j.domain?"; domain="+j.domain:"";var d=j.secure?"; secure":"";var g="";if(b||(b===null&&arguments.length==2)){l=(l===null||(b===null&&arguments.length==2))?-1:l;if(typeof(l)==="number"&&l!="session"&&l!==undefined){var k=new Date();k.setTime(k.getTime()+(l*24*60*60*1000));g=["; expires=",k.toGMTString()].join("")}document.cookie=[i,"=",encodeURI(b),g,f,e,d].join("");return true}if(!b&&typeof(arguments[0])==="string"&&arguments.length==1&&document.cookie&&document.cookie.length){var a=document.cookie.split(";");var h=a.length;while(h--){var c=a[h].split("=");if(jQuery.trim(c[0])===i){return decodeURI(c[1])}}}return false};