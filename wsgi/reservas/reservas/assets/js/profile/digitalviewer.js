function get_content() {
	
			$.getScript(media_url+'js/aux/modals.js', function(){
				$.getScript(media_url+'js/aux/journeys.js', function(){
						$.getScript(media_url+'js/aux/date.js', function(){
							$.getScript(media_url+'js/lib/jquery.keypad.min.js', function(){
								$.getScript(media_url+'js/lib/jquery.keypad-es.js', function(){
									$.post(base_url+'/partials/dashboard_digital_viewer', function(template, textStatus, xhr) {
										$('#main').html(template);
										$.when(
										$.getScript('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js')
										).then(function(){
											loadRadio();
										});
									});
								});
							});
						});
					
				});
			});
	

}

var myradio=false;
//var guard=false;
//var firebase_url=false;
//var firebase_ref=false;
//var journeys_ref=false;
//var reservations_ref=false;

function show_radio_map() {
    pulsador = window.open(base_url+'/radiomap/'+myradio.id, "RadioMap", "location=0,status=0,scrollbars=0,width=1024,height=680");
}

function loadRadio() {
	$.getJSON(api_url+'radios/get?callback=?', {}, function(data){
		if(data.status=='success'){
			myradio = data.data;
			//firebase_updating();
			//checkhash();
			startProfile();
			$('#radio_title').html(myradio.name);
			if(myradio.digital){
				$('#radio_map').fadeIn();
			}
		}
		else super_error('Radio info failure');
	});
}

// PROFILE
function startProfile() {
	$.post(base_url+'/partials/radio_profile_super', function(template, textStatus, xhr) {
		$('#submain').html(template);
		$('#radio_id').val(myradio.id);
		$('#radio_name').val(myradio.name);
		$('#radio_registered_name').val(myradio.registered_name);
		$('#radio_cif').val(myradio.cif);
		$('#radio_prefix').val(myradio.prefix);
		$('#radio_phone').val(myradio.phone);
		$('#radio_email').val(myradio.email);
		$('#radio_address').val(myradio.address);
		$('#radio_city').val(myradio.city);
		$('#radio_num_taxis').val(myradio.num_taxis);
		$('#radio_num_passengers').val(myradio.num_passengers);
		
		$('#digitalRadio').remove();
		$('#bonificadaRadio').remove();
		$('#acciones_radios_titulo').remove();
		$('#acciones_radios').remove();
		if(myradio.active) $('#deactivate_radio_button').show();
		else $('#activate_radio_button').show();
		
		if(myradio.digital){
			$('#header_features_list').css('display', 'block');
			$('#features_list').css('display', 'block');
			startFeatures();
		}
	
		
		$('#edit_radio_form').submit(false).submit(function(e){
			save_radio();
			return false;
		});
		load_invoicing();
	});
	
}

function startFeatures() {
	$.post(base_url+'/partials/features_delegation', function(template, textStatus, xhr) {
		$('#features_list').html(template);
		loadFeaturesCar();
	});
}

function loadFeaturesCar() {
	$.getJSON(api_url+'features/list_car_features?callback=?', function(data){
		if(data.status=='success'){
			if (data.data.length>0) {
				$('#features_list').empty();
				$.each(data.data, function(index, feature_car) {
					draw_feature_car(feature_car);
				});
				active_features_delegarion();
			}
			else{
				$('#features_list').html('Sin caracterísicas');
			}
			
		}
	});
}

function toggle_feature(element) {
	var item = $(element);
	var feature_id = item.attr('data-id');
	var i = item.find('i');
	if (i.hasClass('fa-check-square')) var method = 'unassign_to_radio';
	else var method = 'assign_to_radio';
	
	i.removeClass().addClass('fa fa-fw fa-cog fa-spin');
	
	$.getJSON(api_url+'features/'+method+'?callback=?', {radio_id:myradio.id, feature_id:feature_id}, function(data){
		if(data.status=="success"){
			if(method=="unassign_to_radio"){
				i.removeClass('fa fa-fw fa-cog fa-spin');
				i.addClass('fa fa-fw fa-square');
			}
			if(method=="assign_to_radio"){
				i.removeClass('fa fa-fw fa-cog fa-spin');
				i.addClass('fa fa-fw fa-check-square');
			}
		}
	});
}

function draw_feature_car(feature_car) {
	$('#features_list').append('<div class="col-sm-4"> <div class="item" data-id="'+feature_car.id+'" onclick="toggle_feature(this);"><i class="fa fa-fw fa-square"></i> '+feature_car.description+'</div></div>');
}

function active_features_delegarion() {
	$.each(myradio.features, function(index, feature) {
		var i = $('#features_list .item[data-id="'+feature.id+'"] i');
		i.removeClass().addClass('fa fa-fw fa-check-square');
	});
}


function save_radio() {
	var id=$('#radio_id').val();
	var name=$('#radio_name').val();
	var registered_name=$('#radio_registered_name').val();
	var cif=$('#radio_cif').val();
	var prefix=$('#radio_prefix').val();
	var phone=$('#radio_phone').val();
	var email=$('#radio_email').val();
	var address=$('#radio_address').val();
	var city=$('#radio_city').val();
	var num_taxis=$('#radio_num_taxis').val();
	var num_passengers=$('#radio_num_passengers').val();
	
	var digital=1;

	
	if (name.length>0){
		if(registered_name.length>0){
			
			$('#edit_radio_submit').html('<i class="fa fa-cog fa-spin"></i>');
		
			$.getJSON(api_url+'radios/edit?callback=?', {	id:id,
															name:name, 
															registered_name:registered_name,
															cif:cif,
															prefix:prefix,
															phone:phone,
															email:email,
															address:address,
															city:city,
															num_taxis:num_taxis,
															num_passengers:num_passengers,
															digital:digital}, function(data){
																
				if(data.status=='success'){
					launch_alert('<i class="fa fa-smile-o"></i> Radio guardada','');
					$('#edit_radio_submit').html('Guardar');
					$.getJSON(api_url+'radios/get_foreign?callback=?', {id:id}, function(data){
						if(data.status=='success'){
							myradio=data.data;
							$('#radio_title').html(myradio.name);
						}
					});
					
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir la razón social','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un nombre','warning');
}

function deactivate_radio() {
	$('#deactivate_radio_button').html('<i class="fa fa-cog fa-spin"></i>');
	$.getJSON(api_url+'radios/deactivate?callback=?', {radio_id:myradio.id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Radio desactivada','');
			cargaRadio();
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
	});
}

function deactivate_radio_2(obj) {
	$(obj).removeClass('active');
	$.getJSON(api_url+'radios/deactivate?callback=?', {radio_id:myradio.id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Radio desactivada','');
			cargaRadio();
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
	});
}

function activate_radio() {
	$('#activate_radio_button').html('<i class="fa fa-cog fa-spin"></i>');
	$.getJSON(api_url+'radios/activate?callback=?', {radio_id:myradio.id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Radio activada','');
			cargaRadio();
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
	});
}

function delete_radio() {
	var confirmacion=confirm('¿Seguro que quieres eliminar la radio?');
	if (confirmacion==true)
	{
		$('#delete_radio_button').html('<i class="fa fa-cog fa-spin"></i>');
		$.getJSON(api_url+'radios/delete_foreign?callback=?', {radio_id:myradio.id}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Radio eliminada','');
				setTimeout(function(){
					goto(base_url+'/radios');
				},2000);
				
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});
		
	}
}

function load_invoicing(){
	if(!myradio.digital){
		$('#invoicing_radio').html('FACTURACIÓN');
		var panel=$('<div></div>').attr({'id':'general_panel_invoicing','class':'panel panel-default', 'style':'margin-bottom:0px; margin-top:20px; border:1px solid #CCCCCC;'}); 
		$('#invoicing_radio').append(panel);
		$('#autoinvoicing_radio').html('AUTOFACTURACIÓN');
		var panelB=$('<div></div>').attr({'id':'general_panel_autoinvoicing','class':'panel panel-default', 'style':'margin-bottom:0px; margin-top:20px; border:1px solid #CCCCCC;'}); 
		$('#autoinvoicing_radio').append(panelB);
		$.getJSON(api_url+'invoices/list_by_radio?callback=?&radio_id='+myradio.id, '', function(data3){
			if(data3.status=='success'){
				for(var i=0; i<data3.data.invoices.length; i++){
					var heading=$('<div></div>').attr({'class':'panel-heading panel-heading-invoice invoice-padding', 'style':'background-color:#FFFFFF'}); 
					$('#general_panel_invoicing').append(heading);
					var div_h4=$('<div></div>').attr('class','responsive-title margin_yes col-md-9');
					var title=$('<h4></h4>').attr('class','panel-title'); 
					div_h4.append(title);
					heading.append(div_h4);
					var toggle=$('<span></span>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#invoicing_radio'}).text(meses[data3.data.invoices[i].month-1]+' '+data3.data.invoices[i].year+' - '+data3.data.invoices[i].num_invoice_complete+' - '+data3.data.invoices[i].amount+' '+data3.data.invoices[i].currency_delgation); 
					title.append(toggle);
					var button_div=$('<div></div>').attr({'class':'responsive-button col-md-2'})
					var location = "location.href=\""+data3.data.invoices[i].url_pdf+"\"";
					var button=$('<button></button>').attr({'onclick':location, 'type':'button', 'id':'edit_delegation_submit', 'class':'responsive-btn btn btn-default'}).text('Descargar en PDF');
					button_div.append(button);
					heading.append(button_div);
				}
				for(var i=0; i<data3.data.autoinvoices.length; i++){
					var heading=$('<div></div>').attr({'class':'panel-heading panel-heading-invoice invoice-padding', 'style':'background-color:#FFFFFF'}); 
					$('#general_panel_autoinvoicing').append(heading);
					var div_h4=$('<div></div>').attr('class','responsive-title margin_yes col-md-9');
					var title=$('<h4></h4>').attr('class','panel-title'); 
					div_h4.append(title);
					heading.append(div_h4);
					var toggle=$('<span></span>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#autoinvoicing_radio'}).text(meses[data3.data.autoinvoices[i].month-1]+' '+data3.data.autoinvoices[i].year+' - '+data3.data.autoinvoices[i].num_invoice_complete+' - '+data3.data.autoinvoices[i].amount+' '+data3.data.autoinvoices[i].currency_delgation); 
					title.append(toggle);
					var button_div=$('<div></div>').attr({'class':'responsive-button col-md-2'})
					var location = "location.href=\""+data3.data.autoinvoices[i].url_pdf+"\"";
					var button=$('<button></button>').attr({'onclick':location, 'type':'button', 'id':'edit_delegation_submit', 'class':'responsive-btn btn btn-default'}).text('Descargar en PDF');
					button_div.append(button);
					heading.append(button_div);
				}
			}else super_error('Data failure');
			if(data3.data.invoices.length==0){
				var heading=$('<div></div>').attr({'class':'panel-heading panel-heading-invoice', 'style':'background-color:#FFFFFF'});
				$('#general_panel_invoicing').append(heading);
				var title=$('<h4></h4>').attr('class','panel-title'); 
				heading.append(title);
				var toggle=$('<span></span>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#invoicing_radio'}).text('No existen facturas'); 
				title.append(toggle);
				$('#invoicing_radio').hide();
			}
			if(data3.data.autoinvoices.length==0){
				var heading=$('<div></div>').attr({'class':'panel-heading panel-heading-invoice', 'style':'background-color:#FFFFFF'});
				$('#general_panel_autoinvoicing').append(heading);
				var title=$('<h4></h4>').attr('class','panel-title'); 
				heading.append(title);
				var toggle=$('<span></span>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#autoinvoicing_radio'}).text('No existen autofacturas'); 
				title.append(toggle);
				$('#autoinvoicing_radio').hide();
			}
		});
	}else{
		$('#invoicing_radio').hide();
		$('#autoinvoicing_radio').hide();
	}
}