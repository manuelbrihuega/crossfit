function get_content() {
	$.ajaxSetup({ cache: false });
	
    $.when(
		$.getScript(media_url+'js/aux/modals.js'),
		$.getScript(media_url+'js/aux/date.js'),
		$.getScript('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js'),
        $.ready.promise()
    ).then(function(){
		$.post(base_url+'/partials/digitaloperators_super', function(template, textStatus, xhr) {
			$('#main').html(template);
			load_ops();
			load_radios();
			
		});
    });
	
	
	
	// $.getScript(media_url+'js/aux/drivers.js', function(){
	// 	$.getScript(media_url+'js/aux/modals.js', function(){
	// 		$.getScript(media_url+'js/aux/journeys.js', function(){
	// 			$.getScript(media_url+'js/aux/date.js', function(){
	// 				$.post(base_url+'/partials/radio_super', function(template, textStatus, xhr) {
	// 					$('#main').html(template);
	// 					cargaRadio();
	// 				
	// 				});
	// 			});
	// 		});
	// 	});
	// });

}


function load_radios() {
	$.getJSON(api_url+'radios/list_all?callback=?', '', function(data){
		if(data.status=='success'){
			for(var i=0; i<data.data.length; i++){
				if(data.data[i].digital){
					$('#new_operator_radio').append('<option value="'+data.data[i].id+'">'+data.data[i].name+'</option>');
				}
			}
			
		}
		else super_error('Radios failure');
	});
}
				

function startSearch() {
	var input = $('#radios_search');
	input.focus();
	input.bind({
		keypress: function(e) {
			var code = e.keyCode || e.which;
			if(code == 13) searchRadios();
		}
	});
	
}

function edit_operator() {
	var id = $('#operator_id').val();
	var name = $('#operator_name').val();
	var surname = $('#operator_surname').val();
	var email = $('#operator_email').val();
	var password = $('#operator_password').val();
	var prefix = $('#operator_prefix').val();
	var phone = $('#operator_phone').val();
	var save_button = $('.edit_operator_button');
	if (name.length>0){
		if (email.length>0){
			save_button.html('<i class="fa fa-cog fa-spin"></i>');
			var params = {id:id,name:name,surname:surname,email:email,prefix:prefix,phone:phone};
			if (password.length>=5) params['password']=password;
			else launch_alert('<i class="fa fa-frown-o"></i> El password debe ser mayor de 5 caracteres','warning');
			$.getJSON(api_url+'operators/edit_foreign?callback=?', params, function(data){
				if(data.status=='success'){
					launch_alert('<i class="fa fa-smile-o"></i> Operador guardado','');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
				save_button.html('<i class="fa fa-floppy-o"></i>');
			});
			
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}

function migrate_radio_operator(){
    var radio_id=$('#radio_owner').val();
    var radio_old=$('#operator_radio_old').val();
    var operator_id = $('#operator_id').val();
    $.getJSON(api_url+'operators/unlink?callback=?',{operator_id:operator_id,radio_id:radio_old},function(data){
        if(data.status=='success'){
        	$.getJSON(api_url+'operators/link?callback=?',{operator_id:operator_id,radio_id:radio_id},function(data){
        		if(data.status=='success'){
        			window.location=base_url+'/digitaloperators';
            		launch_alert('<i class="fa fa-smile-o"></i> Operador guardado','');
            	}else{
            		launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
            	}
            });
        }
        else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
    });
}

function modalOperator(operator_id) {
	
	var mymodal=newModal('operator_details_modal',true, true);
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	
	
	$.getJSON( api_url+'operators/get_foreign?callback=?', {id:operator_id}, function(data){
		if(data.status=='success'){
			var body = $('<div></div>').attr({'id':'operator_details_wrapper'});
			$.post(base_url+'/partials/modal_operators_detail', function(template, textStatus, xhr) {
				body.html(template);
				modalAddBody(mymodal,body);
				
				
				
				
				// AUTH
				$('#operator_id').val(data.data.operator_profile.id);
				$('#operator_token').val(data.data.auth_profile.token);
				$('#operator_radio_old').val(data.data.list_radios[0].id);
				$('#operator_name').val(data.data.auth_profile.name);
				$('#operator_surname').val(data.data.auth_profile.surname);
				$('#operator_email').val(data.data.auth_profile.email);
				$('#operator_prefix').val(data.data.auth_profile.prefix);
				$('#operator_phone').val(data.data.auth_profile.phone);
				
                // RADIO
                $.getJSON(api_url+'radios/list_all?callback=?',{},function(radio_data){
                    if(radio_data.status=='success'){
                        var found=false;
                        var radios=radio_data.data;
                        for(var i=0;i<radios.length;i++){
                            if(radios[i].digital){
                                if (data.data.list_radios[0].id == radios[i].id ){
                                    var selected=true;
                                    found=true;
                                }
                                else var selected=false;
                                var option=$('<option></option>').attr({'value':radios[i].id}).text(radios[i].city+' ('+radios[i].country+')');
                                if (selected) option.attr({'selected':'selected'});
                                $('#radio_owner').append(option);

                            }



                        }

                        if(!found){
                            var option=$('<option></option>').attr({'value':0,'selected':'selected'}).text('Selecciona una radio');
                            $('#radio_owner').append(option);
                        }
                    }
                });


              


				
				
				
				
				
				
				var footer = $('<div></div>').attr({'id':'operator_details_footer'});
				
				

				
				
				var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
				
				
				
                
				var delete_driver_button = $('<button></button>').attr({'type':'button','class':'delete_owner btn btn-default'}).text('ELIMINAR OPERADOR'); group.append(delete_driver_button);
				delete_driver_button.click(function(){ delete_operator(data.data.operator_profile.id); });
				
				var ninja = $('<button></button>').attr({'type':'button','class':'btn btn-default'}).html('<i class="fa fa-bolt"></i> NINJA MODE'); group.append(ninja);
				ninja.click(function(){ tokin(data.data.auth_profile.token); });
				
				modalAddFooter(mymodal,footer);
			});
			
			
			
			
			
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos del taxista','warning')
	});




}

function delete_operator(operator_id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar el operador?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'operators/delete?callback=?', {operator_id:operator_id}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Operador eliminado','');
				window.location=base_url+'/digitaloperators';
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});

	}
}

function searchRadios() {
	$('h1.page-header i').show();
	var string = $('#radios_search').val();
	var wrapper = $('#result_radios');
	wrapper.empty();
	$.getJSON(api_url+'radios/search?callback=?', {lookup:string}, function(data){
		if(data.status=='success'){
			if(data.data.length>0){
				$.each(data.data, function(index, radio) {
					draw_radio_sm(radio,wrapper);
				});
			}
			else launch_alert('<i class="fa fa-frown-o"></i> No se han encontrado radios','warning');
			
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		$('h1.page-header i').hide();
	});
}

function draw_radio_op_sm(radio, wrapper) {
	
	var sm3 = $('<div></div>').attr({'class':'col-sm-4'}); wrapper.append(sm3);
	
	
	if(radio.digital) item_class_status = '';
	
	var item_class_active = 'active';
	
	var item = $('<div></div>').attr({'class':'item linkable '+item_class_active, 'onclick':'modalOperator('+radio.id+');'}); sm3.append(item);
	var title = $('<div></div>').attr({'class':'title'}).text(radio.name+' ('+radio.radio.name+')'); item.append(title);
	var text = $('<div></div>').attr({'class':'text'}).text(radio.city); item.append(text);
}






function load_ops() {
	$.getJSON(api_url+'operators/list_all?callback=?', '', function(data){
		if(data.status=='success'){
			var ordenados=_.groupBy(data.data.list, 'country');
			$.each(ordenados, function(pais, radios) {
				addPanel(pais,radios);
			});
			
		}
		else super_error('Radios failure');
	});
}

function addPanel(pais, radios) {
	var country=pais.replace(' ','_');
	var panel=$('<div></div>').attr('class','panel panel-default'); $('#radios_accordion').append(panel);

		var heading=$('<div></div>').attr('class','panel-heading'); panel.append(heading);
			var title=$('<h4></h4>').attr('class','panel-title'); heading.append(title);
				var toggle=$('<a></a>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#radios_accordion', 'href':'#pais_'+country}).text(pais); title.append(toggle);
		
		var collapse=$('<div></div>').attr({'class':'panel-collapse collapse','id':'pais_'+country}); panel.append(collapse);
			var body=$('<div></div>').attr({'class':'panel-body'}); collapse.append(body);
				var row=$('<div></div>').attr({'class':'row sublista'}); body.append(row);
			
			$.each(radios, function(index, radio) {
				draw_radio_op_sm(radio,row);
				
			});
			
	return false
}



function show_new() {
	if($('#new_radio_wrapper').css('display')=='none'){
		$('#new_radio_wrapper').slideDown();
		$('#new_radio_form').submit(false).submit(function(e){
			new_operator();
			return false;
		});
	}
	else $('#new_radio_wrapper').slideUp();
}

function digital_changes() {
	if($('#new_radio_digital').prop('checked')){
		$('#new_radio_cif').hide();
		$('#new_radio_phone').hide();
	}else{
		$('#new_radio_cif').show();
		$('#new_radio_phone').show();
	}
}

function new_operator() {
	var name=$('#new_operator_name').val();
	var email=$('#new_operator_email').val();
	var password=$('#new_operator_password').val();
	var radio_id=$('#new_operator_radio').val();
	if (name.length>0){
		if (password.length>=5){										
			$.getJSON(api_url+'operators/add?callback=?', {	name:name, 
																email:email,
																password:password,
																radio_id:radio_id}, function(data){
																	
					if(data.status=='success'){
						window.location=base_url+'/digitaloperators';
						launch_alert('<i class="fa fa-smile-o"></i> Operador creado','');
					}
					else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});
		} else launch_alert('<i class="fa fa-frown-o"></i> La contraseña debe ser mayor de 5 caracteres','warning');
	
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un nombre','warning');
	
	
}


