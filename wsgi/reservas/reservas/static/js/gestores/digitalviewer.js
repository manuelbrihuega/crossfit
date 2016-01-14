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
			startViewers();
			$('#radio_title').html(myradio.name);
			if(myradio.digital){
				$('#radio_map').fadeIn();
			}
		}
		else super_error('Radio info failure');
	});
}

// VIEWERS
function startViewers() {
	if(myradio.digital){
		$.post(base_url+'/partials/radio_digital_viewers_super', function(template, textStatus, xhr) {
			$('#submain').html(template);
			digital_viewers_list();
			digital_operators_list();
			$('#new_viewer_prefix').val(myradio.delegation_prefix);
		});
	}
}


function digital_operators_list() {
	$.getJSON(api_url+'operators/list_all?callback=?', function(data){
		if(data.status=='success'){
			var wrapper = $('#operators_list');
			if(data.data.list.length>0){
				wrapper.empty();
				$.each(data.data.list, function(index, viewer) {
					dibujaFormularioVisorDigitalOperator(viewer);
				});
			}
			else wrapper.empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin operadoras.</div></div>');
	
			
		}
		else super_error('Locations failure');
	});
}


function digital_viewers_list() {
	$.getJSON(api_url+'radios/list_digital_viewers?callback=?', {id:myradio.id}, function(data){
		if(data.status=='success'){
			var wrapper = $('#viewers_list');
			if(data.data.viewers.length>0){
				wrapper.empty();
				$.each(data.data.viewers, function(index, viewer) {
					dibujaFormularioVisorDigital(viewer);
				});
			}
			else wrapper.empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin visores.</div></div>');
	
			
		}
		else super_error('Locations failure');
	});
}

function show_new_digital_operator() {
	if($('#new_viewer_wrapper_operator').css('display')=='none'){
		$('#new_viewer_wrapper_operator').slideDown();
		$('#new_viewer_operator').submit(false).submit(function(e){
			new_digital_viewer_operator();
			return false;
		});
	}
	else $('#new_viewer_wrapper_operator').slideUp();
}

function dibujaFormularioVisorDigitalOperator(viewer) {
	if(viewer.radio.id==myradio.id){
	var form=$('<form></form>').attr({'role':'form', 'class':'bateria'}); $('#operators_list').append(form);
		var row = $('<div></div>').attr({'class':'row viewer', 'data-id':viewer.id}); form.append(row);
			
			var col = $('<div></div>').attr({'class':'form-group col-md-3'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control id', 'type':'hidden'}).val(viewer.id); col.append(input);
				var input = $('<input>').attr({'class':'form-control token', 'type':'hidden'}).val(viewer.token); col.append(input);
				var input = $('<input>').attr({'class':'form-control input-sm name', 'type':'text', 'placeholder':'Nombre'}).val(viewer.name); col.append(input);
			
				
			var col = $('<div></div>').attr({'class':'form-group col-md-3'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm email', 'type':'text', 'placeholder':'Email'}).val(viewer.email); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-3'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm password', 'type':'text', 'placeholder':'Pass'}); col.append(input);
				
				
			var col = $('<div></div>').attr({'class':'form-group col-md-2 botonera'}); row.append(col);
				var save = $('<span></span>').attr({'class':'button save', 'title':'Guardar operator'}).html('<i class="fa fa-floppy-o"></i>'); col.append(save);
				var ninja = $('<span></span>').attr({'class':'button ninja', 'title':'Ninja mode'}).html('<i class="fa fa-bolt"></i>'); col.append(ninja);
				var delet = $('<span></span>').attr({'class':'button delet', 'title':'Eliminar visor'}).html('<i class="fa fa-trash-o"></i>'); col.append(delet);
				
				save.click(function(){ edit_digital_viewer_operator(viewer.id); });
				ninja.click(function(){ tokin(viewer.token); });
				delet.click(function(){ delete_digital_viewer_operator(viewer.id);  });
    }
}

function delete_digital_viewer_operator(id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar la operadora?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'operators/delete?callback=?', {operator_id:id}, function(data){
			if(data.status=='success'){
				digital_operators_list();
				launch_alert('<i class="fa fa-smile-o"></i> Operadora eliminada','');
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});
		
	}
}

function new_digital_viewer_operator() {
	var name=$('#new_operator_name').val();
	var email=$('#new_operator_email').val();
	var pass=$('#new_operator_pass').val();
	var radio = myradio.id;
	if (name.length>0){
		if (email.length>0){
			if (pass.length>0){
				$('#new_operator_submit').html('<i class="fa fa-cog fa-spin"></i>');
				$.getJSON(api_url+'operators/add?callback=?', {	name:name, 
																email:email,
																password:pass,
																radio_id:radio}, function(data){
																
					if(data.status=='success'){
						digital_operators_list();
						$('#new_operator_submit').html('Guardar');
						launch_alert('<i class="fa fa-smile-o"></i> Operadora creada','');
					}
					else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
				});
			}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una contraseña','warning');
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}

function show_new_digital_viewer() {
	if($('#new_viewer_wrapper').css('display')=='none'){
		$('#new_viewer_wrapper').slideDown();
		$('#new_viewer').submit(false).submit(function(e){
			new_digital_viewer();
			return false;
		});
	}
	else $('#new_viewer_wrapper').slideUp();
}


function new_digital_viewer() {
	var name=$('#new_viewer_name').val();
	var surname=$('#new_viewer_surname').val();
	var email=$('#new_viewer_email').val();
	var pass=$('#new_viewer_pass').val();
	var prefix=$('#new_viewer_prefix').val();
	var phone=$('#new_viewer_phone').val();
	if (name.length>0){
		if (email.length>0){
			if (pass.length>0){
				$('#new_viewer_submit').html('<i class="fa fa-cog fa-spin"></i>');
				$.getJSON(api_url+'radios/add_digital_viewer?callback=?', {	radio_id:myradio.id,
																	name:name,
																	surname:surname,
																	email:email,
																	prefix:prefix,
																	phone:phone,
																	password:pass}, function(data){
																
					if(data.status=='success'){
						digital_viewers_list();
						$('#new_viewer_submit').html('Guardar');
						launch_alert('<i class="fa fa-smile-o"></i> Gestor creado','');
					}
					else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
				});
			}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una contraseña','warning');
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}


function dibujaFormularioVisorDigital(viewer) {
	var form=$('<form></form>').attr({'role':'form', 'class':'bateria'}); $('#viewers_list').append(form);
		var row = $('<div></div>').attr({'class':'row viewer', 'data-id':viewer.id}); form.append(row);
			
			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control id', 'type':'hidden'}).val(viewer.id); col.append(input);
				var input = $('<input>').attr({'class':'form-control token', 'type':'hidden'}).val(viewer.token); col.append(input);
				var input = $('<input>').attr({'class':'form-control input-sm name', 'type':'text', 'placeholder':'Nombre'}).val(viewer.name); col.append(input);
			
			var col = $('<div></div>').attr({'class':'form-group col-md-2'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm surname', 'type':'text', 'placeholder':'Apellidos'}).val(viewer.surname); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-3'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm email', 'type':'text', 'placeholder':'Email'}).val(viewer.email); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm password', 'type':'text', 'placeholder':'Pass'}); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-1'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm prefix', 'type':'text', 'placeholder':'Prefix'}).val(viewer.prefix); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-2'}); row.append(col);
				var input = $('<input>').attr({'class':'form-control input-sm phone', 'type':'text', 'placeholder':'Phone'}).val(viewer.phone); col.append(input);
				
			var col = $('<div></div>').attr({'class':'form-group col-md-2 botonera'}); row.append(col);
				var save = $('<span></span>').attr({'class':'button save', 'title':'Guardar visor'}).html('<i class="fa fa-floppy-o"></i>'); col.append(save);
				var ninja = $('<span></span>').attr({'class':'button ninja', 'title':'Ninja mode'}).html('<i class="fa fa-bolt"></i>'); col.append(ninja);
				var delet = $('<span></span>').attr({'class':'button delet', 'title':'Eliminar visor'}).html('<i class="fa fa-trash-o"></i>'); col.append(delet);
				
				save.click(function(){ edit_digital_viewer(viewer.id); });
				ninja.click(function(){ tokin(viewer.token); });
				delet.click(function(){ delete_digital_viewer(viewer.id);  });
}


function edit_digital_viewer(id) {
	var form = $('.row.viewer[data-id="'+id+'"]');
	var name = form.find('.form-control.name').val();
	var surname = form.find('.form-control.surname').val();
	var email = form.find('.form-control.email').val();
	var password = form.find('.form-control.password').val();
	var prefix = form.find('.form-control.prefix').val();
	var phone = form.find('.form-control.phone').val();
	var save_button = form.find('.button.save');
	if (name.length>0){
		if (email.length>0){
			var params = {viewer_id:id,name:name,surname:surname,email:email,prefix:prefix,phone:phone,password:password};
			if (password.length>0) params['password']=password;
			save_button.html('<i class="fa fa-cog fa-spin"></i>');
			$.getJSON(api_url+'radios/edit_digital_viewer?callback=?', params, function(data){
				if(data.status=='success'){
					save_button.html('<i class="fa fa-floppy-o"></i>');
					launch_alert('<i class="fa fa-smile-o"></i> Visor guardado','');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});
			
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}


function edit_digital_viewer_operator(id) {
	var form = $('.row.viewer[data-id="'+id+'"]');
	var name = form.find('.form-control.name').val();
	var email = form.find('.form-control.email').val();
	var password = form.find('.form-control.password').val();
	var save_button = form.find('.button.save');
	if (name.length>0){
		if (email.length>0){
			var params = {id:id,name:name,email:email,password:password};
			if (password.length>0) params['password']=password;
			save_button.html('<i class="fa fa-cog fa-spin"></i>');
			$.getJSON(api_url+'operators/edit?callback=?', params, function(data){
				if(data.status=='success'){
					save_button.html('<i class="fa fa-floppy-o"></i>');
					launch_alert('<i class="fa fa-smile-o"></i> Visor guardado','');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});
			
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}

function delete_digital_viewer(id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar visor?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'radios/delete_digital_viewer?callback=?', {id:id}, function(data){
			if(data.status=='success'){
				digital_viewers_list();
				launch_alert('<i class="fa fa-smile-o"></i> Visor eliminado','');
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});
		
	}
}