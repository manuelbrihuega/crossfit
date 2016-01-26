function get_content() {

    $.when(
        $.getScript(media_url+'js/aux/actividades.js'),
		$.getScript(media_url+'js/aux/date.js'),
        $.getScript(media_url+'js/aux/modals.js'),
        $.getScript(media_url+'js/lib/sha1.js'),
        $.ready.promise()
    ).then(function(){
		$.post('partials/actividades_super', function(template, textStatus, xhr) {
			$('#main').html(template);
			active_new_enterprise_form();
			startSearch();
		});
    });

}

function active_new_enterprise_form() {
	$('#new_enterprise_form').submit(false).submit(function(e){
		new_enterprise();
		return false;
	});
	
	$.getJSON(api_url+'activities/list_all?callback=?', '', function(data){
		if(data.status=='success'){
			$('.waiting').hide();
			$('#tablewey').html('<thead><tr><th>Nombre</th><th>Crédito WOD</th><th>Crédito BOX</th><th>Aforo máximo</th><th>Aforo mínimo</th></tr></thead><tbody id="tableweybody"></tbody>');
			$.each(data.data, function(index, activity) {
				$('#tableweybody').append('<tr style="cursor:pointer;" onclick="showActividad('+activity.id+');" data-id="'+activity.id+'">'+'<td>'+activity.name+'</td>'+'<td>'+activity.credit_wod+'</td>'+'<td>'+activity.credit_box+'</td>'+'<td>'+activity.max_capacity+'</td>'+'<td>'+activity.min_capacity+'</td>'+'</tr>');
			});
			$('#tablewey').tablesorter(); 
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
			if(code == 13) searchActivities();
		}
	});
	
}

function searchActivities() {
	var string = $('#enterprises_search').val();
	var wrapper = $('#tableweybody');
	if(string==''){
		string='*';
	}
	wrapper.empty();
	//$('#headertarifas').append('<i class="fa fa-cog fa-spin"></i>');
	$('.waiting').show();
	$('.table-responsive').hide();
	$.getJSON(api_url+'activities/search?callback=?', {lookup:string}, function(data){
		if(data.status=='success'){
			//$('#headertarifas').html('Tarifas');
			$('.waiting').hide();
			$('.table-responsive').show();
			if(data.data.length>0){
				$.each(data.data, function(index, activity) {
					$('#tableweybody').append('<tr style="cursor:pointer;" onclick="showActividad('+activity.id+');" data-id="'+activity.id+'">'+'<td>'+activity.name+'</td>'+'<td>'+activity.credit_wod+'</td>'+'<td>'+activity.credit_box+'</td>'+'<td>'+activity.max_capacity+'</td>'+'<td>'+activity.min_capacity+'</td>'+'</tr>');	
				});
				$('#tablewey').tablesorter(); 
			}
			else{
				launch_alert('<i class="fa fa-frown-o"></i> No se han encontrado actividades','warning');
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
	var name=$('#new_actividad_name').val();
	var description=$('#new_actividad_description').val();
	var credit_wod=$('#new_actividad_credit_wod').val();
	var credit_box=$('#new_actividad_credit_box').val();
	var max_capacity=$('#new_actividad_max_capacity').val();
	var min_capacity=$('#new_actividad_min_capacity').val();
	var queue_capacity=$('#new_actividad_queue_capacity').val();
	if (name.length>0){
		if (queue_capacity.length>0){
			if (credit_wod.length>0){
				if (credit_box.length>0){
					if (max_capacity.length>0){
						if (min_capacity.length>0){
							$('#botonadd').html('<i class="fa fa-cog fa-spin"></i>');
							$.getJSON(api_url+'activities/add?callback=?', { name:name, 
																description:description,
																credit_wod:credit_wod,
																credit_box:credit_box,
																max_capacity:max_capacity,
																min_capacity:min_capacity,
																queue_capacity}, function(data){
																								
								if(data.status=='success'){
									$('#botonadd').html('Enviar');
									show_new();
									launch_alert('<i class="fa fa-smile-o"></i> Actividad creada','');
									searchActivities();
									$('#new_actividad_name').val('');
									$('#new_actividad_description').val('');
									$('#new_actividad_credit_wod').val('');
									$('#new_actividad_credit_box').val('');
									$('#new_actividad_queue_capacity').val('');
									$('#new_actividad_max_capacity').val('');
									$('#new_actividad_min_capacity').val('');
								}
								else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
							});
						}else launch_alert('<i class="fa fa-frown-o"></i> Debes indicar el aforo mínimo para la actividad','warning');	
					}else launch_alert('<i class="fa fa-frown-o"></i> Debes indicar el aforo máximo para la actividad','warning');					
				}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el crédito que consume para BOX','warning');
			}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el crédito que consume para WOD','warning');
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes indicar la capacidad de la cola','warning');			
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un nombre para la actividad','warning');	
						
}