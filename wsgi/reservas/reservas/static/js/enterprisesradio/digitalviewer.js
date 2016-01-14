function get_content() {

    $.when(
        $.getScript(media_url+'js/aux/journeys.js'),
        $.getScript(media_url+'js/aux/enterprises.js'),
		$.getScript(media_url+'js/aux/date.js'),
        $.getScript(media_url+'js/aux/modals.js'),
        $.getScript(media_url+'js/lib/sha1.js'),
        $.ready.promise()
    ).then(function(){
		$.post('partials/enterprisesradio_super', function(template, textStatus, xhr) {
			$('#main').html(template);
			active_new_enterprise_form();
			startSearch();
			loadPending();
			getEnterprisesList();
		});
    });

}

function active_new_enterprise_form() {
	$('#new_enterprise_form').submit(false).submit(function(e){
		calculate_coordinates_initial($('#new_enterprise_postal_code').val(),$('#new_enterprise_address').val());
		return false;
	});
	
	$.getJSON(api_url+'delegations/list_all?callback=?', '', function(data){
		if(data.status=='success'){
			$.each(data.data.delegations, function(index, delegation) {
				$('#new_enterprise_delegation').append('<option value="'+delegation.id+'" data-prefix="'+delegation.prefix+'">'+delegation.delegation+'</option>');
			});
			
			$('#new_enterprise_delegation').change(function(){
				var selected = $('#new_enterprise_delegation option:selected');
				var prefix = selected.attr('data-prefix');
				$('#new_enterprise_prefix').val(prefix);
			});
			
			if(data.data.delegations.length==1) $('#new_enterprise_prefix').val(data.data.delegations[0].prefix);
		}
		else super_error('Delegations failure');
	});
}

function startSearch() {
	var input = $('#enterprises_search');
	input.focus();
	input.bind({
		keypress: function(e) {
			var code = e.keyCode || e.which;
			if(code == 13) searchEnterprises();
		}
	});
	
}

function searchEnterprises() {
	$('h1.page-header i').show();
	var string = $('#enterprises_search').val();
	var wrapper = $('#result_enterprises');
	wrapper.empty();
	$.getJSON(api_url+'enterprises/search_in_radio?callback=?', {lookup:string}, function(data){
		if(data.status=='success'){
			if(data.data.length>0){
				$.each(data.data, function(index, empresa) {
					draw_enterprise_sm(empresa, wrapper, '');
				});
				$('#title_search_results').slideDown();
			}
			else{
				launch_alert('<i class="fa fa-frown-o"></i> No se han encontrado empresas','warning');
				$('#title_search_results').slideUp();
			}
			
		}
		else{
			launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			$('#title_search_results').slideUp();
		}
		$('h1.page-header i').hide();
	});
}

function loadPending() {
	var wrapper = $('#pending_enterprises');
	var title = $('#title_pending');
	wrapper.empty();
	$.getJSON(api_url+'enterprises/list_by_radio?callback=?', function(data){
		if(data.status=='success'){
			if(data.data.length>0){
				$.each(data.data, function(index, empresa) {
					draw_enterprise_sm(empresa, wrapper, '');
					$('.waiting').hide();
				});
				wrapper.add(title).slideDown();
			}
			else{
				wrapper.add(title).slideUp();
			}
			
		}
		else{
			wrapper.add(title).slideUp();
		}
		$('h1.page-header i').hide();
	});
}

function getEnterprisesList() {

	$.getJSON(api_url+'enterprises/list_by_radio?callback=?', '', function(data){
		if(data.status=='success'){

			$.getScript('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js', function(){
				$('#enterprises_accordion').empty();
				var agrupadas=_.groupBy(data.data, 'country');
				$.each(agrupadas, function(pais, empresas) {
                    var ordenadas = _.sortBy(empresas,'locality');
					addPanel(pais,ordenadas);
				});
			});


		}
		else super_error('Enterprises error');
	});
}

function addPanel(pais, empresas) {
	var country=pais.replace(' ','_');
	////console.log(country+' '+empresas);
	var panel=$('<div></div>').attr('class','panel panel-default'); $('#enterprises_accordion').append(panel);

		var heading=$('<div></div>').attr('class','panel-heading'); panel.append(heading);
			var title=$('<h4></h4>').attr('class','panel-title'); heading.append(title);
				var toggle=$('<a></a>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#enterprises_accordion', 'href':'#pais_'+country}).text(pais); title.append(toggle);

		var collapse=$('<div></div>').attr({'class':'panel-collapse collapse','id':'pais_'+country}); panel.append(collapse);
			var body=$('<div></div>').attr({'class':'panel-body'}); collapse.append(body);

				var ordenadas=_.groupBy(empresas, 'locality');
				$.each(ordenadas, function(localidad, empresas) {
					dibujaListaCiudad(localidad,empresas,body, 'oculto');
				});

	return false
}

function dibujaListaCiudad(localidad, empresas, destino) {
	var sublista = $('<div></div>').attr({'class':'row sublista', 'data-locality':localidad}); destino.append(sublista);
		var sm12 = $('<div></div>').attr({'class':'col-sm-12 linkable'}); sublista.append(sm12);
			var titular = $('<h4></h4>').attr({'class':'titular'}).text(localidad); sm12.append(titular);

        sm12.click(function(){mostrarSublista(sublista);});

		$.each(empresas, function(index, empresa) {
            draw_enterprise_sm(empresa, sublista, 'oculto');
		});
}

function mostrarSublista(elemento){
    var sublista = $(elemento);

    if (sublista.hasClass('on')){
        sublista.children('.item_row').slideUp();
        sublista.removeClass('on');
    }

    else{
        sublista.children('.item_row').slideDown();
        sublista.addClass('on');
    }
}

function show_new() {
	if($('#new_enterprise_wrapper').css('display')=='none'){
		$('#new_enterprise_wrapper').slideDown();
	}
	else $('#new_enterprise_wrapper').slideUp();
}

function passwordgenerate(length, special) {
	var iteration = 0;
	var password = "";
	var randomNumber;
	if(special == undefined){
		var special = false;
	}
	while(iteration < length){
		randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
		if(!special){
			if ((randomNumber >=33) && (randomNumber <=47)) { continue; }
			if ((randomNumber >=58) && (randomNumber <=64)) { continue; }
			if ((randomNumber >=91) && (randomNumber <=96)) { continue; }
			if ((randomNumber >=123) && (randomNumber <=126)) { continue; }
		}
		iteration++;
		password += String.fromCharCode(randomNumber);
	}
	return password;
}

function new_oficina_employee(enterprise_name, enterprise_id, enterprise_email, enterprise_phone, enterprise_prefix) {
	var name="Oficina";
	var surname=enterprise_name;
	var email=enterprise_email;
	var pass="";
	var prefix=enterprise_prefix;
	var phone=enterprise_phone;
	pass=passwordgenerate(8);
	$.getJSON(api_url+'enterprises/add_employee?callback=?', {	
																enterprise_id:enterprise_id,
																name:name,
																surname:surname,
																email:email,
																prefix:prefix,
																phone:phone,
																password:pass}, function(data){
																		
	});
					
}

function calculate_coordinates_initial(cpostal,dir){
	console.log("antes");
	var pais = $('#new_enterprise_delegation option:selected').text();
	console.log(pais);
    $.post("http://maps.googleapis.com/maps/api/geocode/json?address="+ cpostal +","+ dir+ "&sensor=true",
    function(data, textStatus, xhr) {
    	var address = "not_found_address";
        var g_pais='ES';
        var g_cp=cpostal;
        var g_provincia="";
        var g_localidad="";

        result=data.results[0];


         if (result){
             if(result.length>1){
                  for(var i = 0; i<result.length; ++i){
                     for(var i = 0; i<result.address_components.length; ++i){
                        var component = result.address_components[i];

                        if(component.types.indexOf("country") > -1){
                        	console.log("ole");
                            if(result.address_components[i].long_name==pais) result=data.results[i];

                        }

                     }
                  }
             }
            console.log(address);
            address = result.formatted_address;
            console.log(address);
           
         }
         if(address=='not_found_address'){
         	launch_alert('<i class="fa fa-frown-o"></i> Dirección imposible de geolocalizar','warning')
         }else{
         	$('#new_enterprise_address').val(address);
         	$('#new_enterprise_address_latitude').val(result.geometry.location.lat);
         	$('#new_enterprise_address_longitude').val(result.geometry.location.lng);
         	new_enterprise();
         }
    });
}

function new_enterprise() {
	console.log("hola");
	var enterprise_name=$('#new_enterprise_name').val();
	var delegation_id=$('#new_enterprise_delegation').val();
	var cif=$('#new_enterprise_cif').val();
	var prefix=$('#new_enterprise_prefix').val();
	var phone=$('#new_enterprise_phone').val();
	var phone_pulsador=$('#new_enterprise_phone_pulsador').val();
	var discount=$('#new_enterprise_discount').val();
	var email_pulsador=$('#new_enterprise_email_pulsador').val();
	var credit=$('#enterprise_credit').val();
	var address=$('#new_enterprise_address').val();
	var latitude = $('#new_enterprise_address_latitude').val();
	var longitude= $('#new_enterprise_address_longitude').val();
		console.log(address);
		var postal_code=$('#new_enterprise_postal_code').val();
		var email_pure=$('#new_enterprise_pure_email').val();
		var name=$('#new_enterprise_name').val();
		var password=$('#new_enterprise_cif').val();
		var pulsador=$('#new_enterprise_pulsador').val();
		
		if (name.length>0){
			if (postal_code.length>0){
				if (address.length>0){
					if (pulsador.length>0){
						if (phone.length>0 && phone_pulsador.length>0){
							if (email_pulsador.length>0 && email_pure.length>0){
								if(phone!=phone_pulsador){
									if(email_pure!=email_pulsador){
										if(enterprise_name.length>0){
											if(!discount.length>0){
												discount=0;
											}
											$.getJSON(api_url+'enterprises/add?callback=?', {enterprise_name:enterprise_name, 
																							postal_code:postal_code,
																							cif:cif,
																							prefix:prefix,
																							phone_enterprise:phone,
																							discount:discount,
																							email_pure:email_pure,
																							credit_days:credit,
																							delegation_id:delegation_id,
																							address:address,
																							latitude:latitude,
																							longitude:longitude,
																							email:email_pulsador,
																							name:pulsador,
																							phone:phone_pulsador,
																							password:password}, function(data){
																								
												if(data.status=='success'){
													new_oficina_employee(enterprise_name, data.data.id, email_pure, phone, prefix);
													modal_enterprise_details(data.data.id);
													show_new();
													launch_alert('<i class="fa fa-smile-o"></i> Empresa creada','');
												}
												else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
											});
											
										}
										else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir la empresa','warning');
									}
									else launch_alert('<i class="fa fa-frown-o"></i> Los emails de empresa y pulsador deben ser distintos','warning');
								}
								else launch_alert('<i class="fa fa-frown-o"></i> Los teléfonos de empresa y pulsador deben ser distintos','warning');			
							}
							else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un email','warning');	
						}
						else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un teléfono','warning');	
					}
					else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un nombre al pulsador','warning');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una dirección','warning');
			}
			else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un código postal','warning');
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un nombre a la empresa','warning');
	
}