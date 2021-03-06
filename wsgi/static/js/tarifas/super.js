function get_content() {

    $.when(
        $.getScript(media_url+'js/aux/tarifas.js'),
		$.getScript(media_url+'js/aux/date.js'),
        $.getScript(media_url+'js/aux/modals.js'),
        $.getScript(media_url+'js/lib/sha1.js'),
        $.getScript(media_url+'js/lib/tableExport.js'), 
		$.getScript(media_url+'js/lib/jquery.base64.js'),
        $.ready.promise()
    ).then(function(){
		$.post('partials/tarifas_super', function(template, textStatus, xhr) {
			$('#main').html(template);
			active_new_enterprise_form();
			startSearch();
			onchangeTipoBono();
		});
    });

}

function onchangeTipoBono(){
	$('#tipobono').click(function(){
    	if($(this).is(':checked')){
        	$('#mostradorbox').hide();
        	$('#mostradorwod').hide();
        	$('#mostradorbono').show();
    	} else {
        	$('#mostradorbox').show();
        	$('#mostradorwod').show();
        	$('#mostradorbono').hide();
    	}
	});

}

function active_new_enterprise_form() {
	$('#new_enterprise_form').submit(false).submit(function(e){
		new_enterprise();
		return false;
	});
	if($('#nohay').length){$('#nohay').hide();}
	$.getJSON(api_url+'rates/list_all?callback=?', '', function(data){
		if(data.status=='success'){
			$('.waiting').hide();
			if(data.data.length>0){
			
				$('#tablewey').html('<thead><tr><th>Nombre</th><th>Precio</th><th>Crédito WOD</th><th>Crédito OPEN</th><th>Crédito BONO</th><th>Observaciones</th></tr></thead><tbody id="tableweybody"></tbody>');
				$.each(data.data, function(index, rate) {
					$('#tableweybody').append('<tr style="cursor:pointer;" onclick="showTarifa('+rate.id+');" data-id="'+rate.id+'">'+'<td>'+rate.name+'</td>'+'<td>'+rate.price+' €</td>'+'<td>'+rate.credit_wod+'</td>'+'<td>'+rate.credit_box+'</td>'+'<td>'+rate.credit_bono+'</td>'+'<td>'+rate.observations+'</td>'+'</tr>');
				});
				$('#tablewey').tablesorter();
			}else{
				if($('#nohay').length){
					$('#nohay').show();
				}else{
					$('#enterprises_accordion').append('<div id="nohay" class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">No se han encontrado tarifas</div></div>');
				}
			}  
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
			if(code == 13) searchRates();
		}
	});
	
}

function searchRates() {
	var string = $('#enterprises_search').val();
	var wrapper = $('#tableweybody');
	if(string==''){
		string='*';
	}
	wrapper.empty();
	//$('#headertarifas').append('<i class="fa fa-cog fa-spin"></i>');
	$('.waiting').show();
	$('.table-responsive').hide();
	if($('#nohay').length){$('#nohay').hide();}
	$.getJSON(api_url+'rates/search?callback=?', {lookup:string}, function(data){
		if(data.status=='success'){
			//$('#headertarifas').html('Tarifas');
			$('.waiting').hide();
			if(data.data.length>0){
				$('.table-responsive').show();
				$('#tablewey').html('<thead><tr><th>Nombre</th><th>Precio</th><th>Crédito WOD</th><th>Crédito OPEN</th><th>Crédito BONO</th><th>Observaciones</th></tr></thead><tbody id="tableweybody"></tbody>');
				$.each(data.data, function(index, rate) {
					$('#tableweybody').append('<tr style="cursor:pointer;" onclick="showTarifa('+rate.id+');" data-id="'+rate.id+'">'+'<td>'+rate.name+'</td>'+'<td>'+rate.price+' €</td>'+'<td>'+rate.credit_wod+'</td>'+'<td>'+rate.credit_box+'</td>'+'<td>'+rate.credit_bono+'</td>'+'<td>'+rate.observations+'</td>'+'</tr>');	
				});
				$('#tablewey').tablesorter(); 
			}
			else{
				if($('#nohay').length){
					$('#nohay').show();
				}else{
					$('#enterprises_accordion').append('<div id="nohay" class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">No se han encontrado tarifas</div></div>');
				}
			}
			
		}
		else{
			launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		}
	});
}



function show_new() {
	if($('#new_enterprise_wrapper').css('display')=='none'){
		$('#new_enterprise_wrapper').slideDown();
	}
	else $('#new_enterprise_wrapper').slideUp();
}



function new_enterprise() {
	if($('#tipobono').is(':checked')){
		var name=$('#new_tarifa_name').val();
	var price=$('#new_tarifa_price').val();
	var credit_bono=$('#new_tarifa_credit_bono').val();
	var credit_box=0;
	var credit_wod=0;
	var observations=$('#new_tarifa_observations').val();
	if($('#tipobono').is(':checked')){
		var tipobono=1;
	}else{
		var tipobono=0;
	}
	if (name.length>0){
		if (price.length>0){
			if (credit_bono.length>0){
					$('#botonadd').html('<i class="fa fa-cog fa-spin"></i>');
					$.getJSON(api_url+'rates/add?callback=?', { name:name, 
																price:price,
																credit_wod:credit_wod,
																credit_box:credit_box,
																credit_bono:credit_bono,
																observations:observations,
																tipobono:tipobono}, function(data){
																								
												if(data.status=='success'){
													$('#botonadd').html('Enviar');
													show_new();
													launch_alert('<i class="fa fa-smile-o"></i> Tarifa creada','');
													searchRates();
													$('#new_tarifa_name').val('');
													$('#new_tarifa_price').val('');
													$('#new_tarifa_credit_wod').val('');
													$('#new_tarifa_credit_bono').val('');
													$('#new_tarifa_credit_box').val('');
													$('#new_tarifa_observations').val('');
												}
												else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
											});
											
									}
									else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el crédito para el BONO','warning');
								}
								else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el precio','warning');			
							}
							else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un nombre para la tarifa','warning');
	}else{
	var name=$('#new_tarifa_name').val();
	var price=$('#new_tarifa_price').val();
	var credit_wod=$('#new_tarifa_credit_wod').val();
	var credit_box=$('#new_tarifa_credit_box').val();
	var credit_bono=0;
	var observations=$('#new_tarifa_observations').val();
	if($('#tipobono').is(':checked')){
		var tipobono=1;
	}else{
		var tipobono=0;
	}
	if (name.length>0){
		if (price.length>0){
			if (credit_wod.length>0){
				if (credit_box.length>0){
					$('#botonadd').html('<i class="fa fa-cog fa-spin"></i>');
					$.getJSON(api_url+'rates/add?callback=?', { name:name, 
																price:price,
																credit_wod:credit_wod,
																credit_box:credit_box,
																credit_bono:credit_bono,
																observations:observations,
																tipobono:tipobono}, function(data){
																								
												if(data.status=='success'){
													$('#botonadd').html('Enviar');
													show_new();
													launch_alert('<i class="fa fa-smile-o"></i> Tarifa creada','');
													searchRates();
													$('#new_tarifa_name').val('');
													$('#new_tarifa_price').val('');
													$('#new_tarifa_credit_wod').val('');
													$('#new_tarifa_credit_box').val('');
													$('#new_tarifa_credit_bono').val('');
													$('#new_tarifa_observations').val('');
												}
												else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
											});
											
										}
										else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el crédito para BOX','warning');
									}
									else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el crédito para WOD','warning');
								}
								else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el precio','warning');			
							}
							else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un nombre para la tarifa','warning');	
						
	}
}