function get_content() {

    $.when(
        $.getScript(media_url+'js/aux/calendario.js'),
		$.getScript(media_url+'js/aux/date.js'),
        $.getScript(media_url+'js/aux/modals.js'),
        $.getScript(media_url+'js/lib/sha1.js'),
        $.ready.promise()
    ).then(function(){
		$.post('partials/calendario_super', function(template, textStatus, xhr) {
			$('#main').html(template);
			listarActividades();
			$('#horaini').timepicker({
    			showPeriodLabels: false,
    			hourText: 'Hora',
    			minuteText: 'Minutos',
    			myPosition: 'left top',
    			atPosition: 'left bottom' 
			});
			$('#horafin').timepicker({
    			showPeriodLabels: false,
    			hourText: 'Hora',
    			minuteText: 'Minutos',
    			myPosition: 'left top',
    			atPosition: 'left bottom'
			});
			$( "#horaini" ).change(function() {
  				restarHoras();
			});
			$( "#horafin" ).change(function() {
  				restarHoras();
			});
			if (!Modernizr.inputtypes.date) {
    			$('input[type=date]').datepicker();
    			$('input[type=date]').css('border-bottom','1px solid lightgray');
    			$('#ui-datepicker-div').css('background-color','white');
        		$('#ui-datepicker-div').css('border','1px solid lightgray');
        		$('#ui-datepicker-div').css('padding','15px');
        		$('#ui-datepicker-div').css('border-radius','8px');
			}
			$( "#fechaconcreta" ).click(function() {
				$('#divpatron').slideUp();
  				$('#divfecha').slideDown();
			});
			$( "#fechapatron" ).click(function() {
  				$('#divfecha').slideUp();
  				$('#divpatron').slideDown();
			});
			$('.waiting').hide();
			$('#mycalendar').monthly();
			//active_new_enterprise_form();
			//startSearch();
		});
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
			
				$('#tablewey').html('<thead><tr><th>Nombre</th><th>Precio</th><th>Crédito WOD</th><th>Crédito BOX</th><th>Observaciones</th></tr></thead><tbody id="tableweybody"></tbody>');
				$.each(data.data, function(index, rate) {
					$('#tableweybody').append('<tr style="cursor:pointer;" onclick="showTarifa('+rate.id+');" data-id="'+rate.id+'">'+'<td>'+rate.name+'</td>'+'<td>'+rate.price+'</td>'+'<td>'+rate.credit_wod+'</td>'+'<td>'+rate.credit_box+'</td>'+'<td>'+rate.observations+'</td>'+'</tr>');
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
				$('#tablewey').html('<thead><tr><th>Nombre</th><th>Precio</th><th>Crédito WOD</th><th>Crédito BOX</th><th>Observaciones</th></tr></thead><tbody id="tableweybody"></tbody>');
				$.each(data.data, function(index, rate) {
					$('#tableweybody').append('<tr style="cursor:pointer;" onclick="showTarifa('+rate.id+');" data-id="'+rate.id+'">'+'<td>'+rate.name+'</td>'+'<td>'+rate.price+'</td>'+'<td>'+rate.credit_wod+'</td>'+'<td>'+rate.credit_box+'</td>'+'<td>'+rate.observations+'</td>'+'</tr>');	
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


function listarActividades() {
	var select = $('#actividad');
	$.getJSON(api_url+'activities/list_all?callback=?', {}, function(data){
		////console.log(data.data)
		if(data.status=='success'){
			var list_tarifas=data.data;
			for(var i=0;i<list_tarifas.length;i++){
            	id=list_tarifas[i].id;
            	nombres=list_tarifas[i].name;
            	var option=$('<option></option>').attr({'value':list_tarifas[i].id}).text(list_tarifas[i].name); select.append(option);
        	}

		}
		else super_error('Search failure');
	});
}

function restarHoras() {
	if($('#horaini').val().length>0 && $('#horafin').val().length>0){
		var inicio=$('#horaini').val();
		var fin=$('#horafin').val();
		var inicioMinutos = parseInt(inicio.substr(3,2));
		var inicioHoras = parseInt(inicio.substr(0,2));
		  
		var finMinutos = parseInt(fin.substr(3,2));
		var finHoras = parseInt(fin.substr(0,2));

		var transcurridoMinutos = finMinutos - inicioMinutos;
		var transcurridoHoras = finHoras - inicioHoras;
		  
		if (transcurridoMinutos < 0) {
		  transcurridoHoras--;
		  transcurridoMinutos = 60 + transcurridoMinutos;
		}
		  
		var horas = transcurridoHoras.toString();
		var minutos = transcurridoMinutos.toString();
		  
		if (horas.length < 2) {
		  horas = "0"+horas;
		}
		  
		if (minutos.length < 2) {
		  minutos = "0"+minutos;
		}
		  
		$('#duracion').val(horas+':'+minutos);
	}
}