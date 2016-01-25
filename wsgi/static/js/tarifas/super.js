function get_content() {

    $.when(
        $.getScript(media_url+'js/aux/tarifas.js'),
		$.getScript(media_url+'js/aux/date.js'),
        $.getScript(media_url+'js/aux/modals.js'),
        $.getScript(media_url+'js/lib/sha1.js'),
        $.getScript(media_url+'js/lib/jquery-latest.js'),
        $.getScript(media_url+'js/lib/jquery.tablesorter.min.js'),
        $.ready.promise()
    ).then(function(){
		$.post('partials/tarifas_super', function(template, textStatus, xhr) {
			$('#main').html(template);
			active_new_enterprise_form();
			startSearch();
			$('#tablewey').tablesorter(); 
		});
    });

}

function active_new_enterprise_form() {
	$('#new_enterprise_form').submit(false).submit(function(e){
		new_enterprise();
		return false;
	});
	
	$.getJSON(api_url+'rates/list_all?callback=?', '', function(data){
		if(data.status=='success'){
			$('.waiting').hide();
			$('#tablewey').html('<thead><tr><th>Nombre</th><th>Precio</th><th>Crédito WOD</th><th>Crédito BOX</th><th>Observaciones</th></tr></thead><tbody id="tableweybody"></tbody>');
			$.each(data.data, function(index, rate) {
				$('#tableweybody').append('<tr data-id="'+rate.id+'">'+'<td>'+rate.name+'</td>'+'<td>'+rate.price+'</td>'+'<td>'+rate.credit_wod+'</td>'+'<td>'+rate.credit_box+'</td>'+'<td>'+rate.observations+'</td>'+'</tr>');
			});
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
	$.getJSON(api_url+'rates/search?callback=?', {lookup:string}, function(data){
		if(data.status=='success'){
			//$('#headertarifas').html('Tarifas');
			$('.waiting').hide();
			$('.table-responsive').show();
			if(data.data.length>0){
				$.each(data.data, function(index, rate) {
					$('#tableweybody').append('<tr data-id="'+rate.id+'">'+'<td>'+rate.name+'</td>'+'<td>'+rate.price+'</td>'+'<td>'+rate.credit_wod+'</td>'+'<td>'+rate.credit_box+'</td>'+'<td>'+rate.observations+'</td>'+'</tr>');	
				});
			}
			else{
				launch_alert('<i class="fa fa-frown-o"></i> No se han encontrado tarifas','warning');
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
	var name=$('#new_tarifa_name').val();
	var price=$('#new_tarifa_price').val();
	var credit_wod=$('#new_tarifa_credit_wod').val();
	var credit_box=$('#new_tarifa_credit_box').val();
	var observations=$('#new_tarifa_observations').val();
	if (name.length>0){
		if (price.length>0){
			if (credit_wod.length>0){
				if (credit_box.length>0){
					$('#botonadd').html('<i class="fa fa-cog fa-spin"></i>');
					$.getJSON(api_url+'rates/add?callback=?', { name:name, 
																price:price,
																credit_wod:credit_wod,
																credit_box:credit_box,
																observations:observations}, function(data){
																								
												if(data.status=='success'){
													$('#botonadd').html('Enviar');
													show_new();
													launch_alert('<i class="fa fa-smile-o"></i> Tarifa creada','');
													searchRates();
													$('#new_tarifa_name').val('');
													$('#new_tarifa_price').val('');
													$('#new_tarifa_credit_wod').val('');
													$('#new_tarifa_credit_box').val('');
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