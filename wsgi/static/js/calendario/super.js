function get_content() {

    $.when(
        $.getScript(media_url+'js/aux/calendario.js'),
        $.getScript(media_url+'js/lib/monthly.js'),
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
				restarHoras('');
			});
			$( "#horafin" ).change(function() {
  				restarHoras('');
			});

			if (!Modernizr.inputtypes.date) {
    			$('input[type=date]').datepicker({
  					dateFormat: "yy-mm-dd"
				});
    			$('input[type=date]').css('border-bottom','1px solid lightgray');
    			$('#ui-datepicker-div').css('background-color','white');
        		$('#ui-datepicker-div').css('border','1px solid lightgray');
        		$('#ui-datepicker-div').css('padding','15px');
        		$('#ui-datepicker-div').css('border-radius','8px');
			}
			$( "#fechaconcreta" ).click(function() {
				$('#divpatron').slideUp();
  				$('#divfecha').slideDown();
  				$('#marru').slideDown();
			});
			$( "#fechapatron" ).click(function() {
  				$('#divfecha').slideUp();
  				$('#divpatron').slideDown();
  				$('#marru').slideDown();
			});
			$('.waiting').hide();
			active_new_enterprise_form();
			loadCalendar();
			$( ".mes" ).click(function() {
				$('#todoslosmeses').prop('checked','');
			});
			$( ".dia" ).click(function() {
				$('#todoslosdias').prop('checked','');
			});
			$( "#todoslosmeses" ).click(function() {
  				if($('#todoslosmeses').is(":checked")){
  					$('#enero').prop('checked','checked');
  					$('#febrero').prop('checked','checked');
  					$('#marzo').prop('checked','checked');
  					$('#abril').prop('checked','checked');
  					$('#mayo').prop('checked','checked');
  					$('#junio').prop('checked','checked');
  					$('#julio').prop('checked','checked');
  					$('#agosto').prop('checked','checked');
  					$('#septiembre').prop('checked','checked');
  					$('#octubre').prop('checked','checked');
  					$('#noviembre').prop('checked','checked');
  					$('#diciembre').prop('checked','checked');
  				}else{
  					$('#enero').prop('checked','');
  					$('#febrero').prop('checked','');
  					$('#marzo').prop('checked','');
  					$('#abril').prop('checked','');
  					$('#mayo').prop('checked','');
  					$('#junio').prop('checked','');
  					$('#julio').prop('checked','');
  					$('#agosto').prop('checked','');
  					$('#septiembre').prop('checked','');
  					$('#octubre').prop('checked','');
  					$('#noviembre').prop('checked','');
  					$('#diciembre').prop('checked','');
  				}
			});
			$( "#todoslosdias" ).click(function() {
  				if($('#todoslosdias').is(":checked")){
  					$('#lunes').prop('checked','checked');
  					$('#martes').prop('checked','checked');
  					$('#miercoles').prop('checked','checked');
  					$('#jueves').prop('checked','checked');
  					$('#viernes').prop('checked','checked');
  					$('#sabado').prop('checked','checked');
  					$('#domingo').prop('checked','checked');
  				}else{
  					$('#lunes').prop('checked','');
  					$('#martes').prop('checked','');
  					$('#miercoles').prop('checked','');
  					$('#jueves').prop('checked','');
  					$('#viernes').prop('checked','');
  					$('#sabado').prop('checked','');
  					$('#domingo').prop('checked','');
  				}
			});
		});
    });

}

function active_new_enterprise_form() {
	$('#new_enterprise_form').submit(false).submit(function(e){
		new_horario();
		return false;
	});
}



function show_new() {
	if($('#new_enterprise_wrapper').css('display')=='none'){
		$('#new_enterprise_wrapper').slideDown();
	}
	else $('#new_enterprise_wrapper').slideUp();
}



function new_horario() {
	var error = false;
	for(var i=0; i<100; i++){
		if($('#horaini'+i).length){
			var horaini=$('#horaini'+i).val();
			var horafin=$('#horafin'+i).val();
			var duracion=$('#duracion'+i).val();
			var duracionhide=$('#duracionhide'+i).val();
			var activity_id=$('#actividad').val();
			if($('#fechaconcreta').is(":checked")){
				var fecha = $('#fecha').val();
				if(fecha.length>0){
					if(horaini.length>0){
						if(horafin.length>0){
							if(duracion.length>0){
								if(activity_id!=-1){
									$('#botonadd').html('<i class="fa fa-cog fa-spin"></i>');
									$.getJSON(api_url+'schedules/add_concrete?callback=?', { time_start:horaini, 
																							 time_end:horafin,
																							 duration:duracionhide,
																							 activity_id:activity_id,
																							 date:fecha}, function(data){
																												
										if(data.status=='success'){
											launch_alert('<i class="fa fa-smile-o"></i> Horario añadido','');
											$('#horaini'+i).val('');
											$('#horafin'+i).val('');
											$('#duracion'+i).val('');
										}else{
											error = true;
											launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning'); $('#botonadd').html('Enviar');}
									});
								}else{launch_alert('<i class="fa fa-frown-o"></i> Debes seleccionar una actividad','warning');}
							}else{launch_alert('<i class="fa fa-frown-o"></i> El intervalo horario es erróneo','warning');}
						}else{launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una hora de fin para la actividad','warning');}
					}else{launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una hora de inicio para la actividad','warning');}
				}else{launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una fecha para la actividad','warning');}
			}else{
				if($('#fechapatron').is(":checked")){
					var lunes = false;
					var martes = false;
					var miercoles = false;
					var jueves = false;
					var viernes = false;
					var sabado = false;
					var domingo = false;
					if($('#lunes').is(":checked")){ lunes=true; }
					if($('#martes').is(":checked")){ martes=true; }
					if($('#miercoles').is(":checked")){ miercoles=true; }
					if($('#jueves').is(":checked")){ jueves=true; }
					if($('#viernes').is(":checked")){ viernes=true; }
					if($('#sabado').is(":checked")){ sabado=true; }
					if($('#domingo').is(":checked")){ domingo=true; }

					var enero = false;
					var febrero = false;
					var marzo = false;
					var abril = false;
					var mayo = false;
					var junio = false;
					var julio = false;
					var agosto = false;
					var septiembre = false;
					var octubre = false;
					var noviembre = false;
					var diciembre = false;
					if($('#enero').is(":checked")){ enero=true; }
					if($('#febrero').is(":checked")){ febrero=true; }
					if($('#marzo').is(":checked")){ marzo=true; }
					if($('#abril').is(":checked")){ abril=true; }
					if($('#mayo').is(":checked")){ mayo=true; }
					if($('#junio').is(":checked")){ junio=true; }
					if($('#julio').is(":checked")){ julio=true; }
					if($('#agosto').is(":checked")){ agosto=true; }
					if($('#septiembre').is(":checked")){ septiembre=true; }
					if($('#octubre').is(":checked")){ octubre=true; }
					if($('#noviembre').is(":checked")){ noviembre=true; }
					if($('#diciembre').is(":checked")){ diciembre=true; }
					if(enero || febrero || marzo || abril || mayo || junio || julio || agosto || septiembre || octubre || noviembre || diciembre){
						if(lunes || martes || miercoles || jueves || viernes || sabado || domingo){
							var d1 = lunes ? 1 : 0;
							var d2 = martes ? 1 : 0;
							var d3 = miercoles ? 1 : 0;
							var d4 = jueves ? 1 : 0;
							var d5 = viernes ? 1 : 0;
							var d6 = sabado ? 1 : 0;
							var d7 = domingo ? 1 : 0;
							var cad_dias = d1+','+d2+','+d3+','+d4+','+d5+','+d6+','+d7;
							var m1 = enero ? 1 : 0;
							var m2 = febrero ? 1 : 0;
							var m3 = marzo ? 1 : 0;
							var m4 = abril ? 1 : 0;
							var m5 = mayo ? 1 : 0;
							var m6 = junio ? 1 : 0;
							var m7 = julio ? 1 : 0;
							var m8 = agosto ? 1 : 0;
							var m9 = septiembre ? 1 : 0;
							var m10 = octubre ? 1 : 0;
							var m11 = noviembre ? 1 : 0;
							var m12 = diciembre ? 1 : 0;
							var cad_meses = m1+','+m2+','+m3+','+m4+','+m5+','+m6+','+m7+','+m8+','+m9+','+m10+','+m11+','+m12;
							if(horaini.length>0){
								if(horafin.length>0){
									if(duracion.length>0){
										if(activity_id!=-1){
											$('#botonadd').html('<i class="fa fa-cog fa-spin"></i>');
											$.getJSON(api_url+'schedules/add_interval?callback=?', { time_start:horaini, 
																								 time_end:horafin,
																								 duration:duracionhide,
																								 activity_id:activity_id,
																								 monthly:cad_meses,
																								 weekly:cad_dias}, function(data){
																													
												if(data.status=='success'){
													
													launch_alert('<i class="fa fa-smile-o"></i> Horario añadido','');
													//searchRates();
													$('#horaini'+i).val('');
													$('#horafin'+i).val('');
													$('#duracion'+i).val('');

								
												}else{ launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');}
											});
										}else{launch_alert('<i class="fa fa-frown-o"></i> Debes seleccionar una actividad','warning');}
									}else{launch_alert('<i class="fa fa-frown-o"></i> El intervalo horario es erróneo','warning');}
								}else{launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una hora de fin para la actividad','warning');}
							}else{launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una hora de inicio para la actividad','warning');}
						}else{launch_alert('<i class="fa fa-frown-o"></i> Debes seleccionar algun día de la semana para la actividad','warning');}
					}else{launch_alert('<i class="fa fa-frown-o"></i> Debes seleccionar algun mes para la actividad','warning');}




				}		
			}
		}	
		if(i==99){
			$('#botonadd').html('Enviar');
			show_new();
			$('#activity_id').val('-1');
			$('#fecha').val('');
			$('#lunes').prop('checked','');
			$('#martes').prop('checked','');
			$('#miercoles').prop('checked','');
			$('#jueves').prop('checked','');
			$('#viernes').prop('checked','');
			$('#sabado').prop('checked','');
			$('#domingo').prop('checked','');
			$('#todoslosdias').prop('checked','');

			$('#enero').prop('checked','');
			$('#febrero').prop('checked','');
			$('#marzo').prop('checked','');
			$('#abril').prop('checked','');
			$('#mayo').prop('checked','');
			$('#junio').prop('checked','');
			$('#julio').prop('checked','');
			$('#agosto').prop('checked','');
			$('#septiembre').prop('checked','');
			$('#octubre').prop('checked','');
			$('#noviembre').prop('checked','');
			$('#diciembre').prop('checked','');
			$('#todoslosmeses').prop('checked','');
		}	
	}	
	
		
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

function addnewhorario(){
	for(var i=0;i<100; i++){
		if(!$('#horaini'+String(i)).length){
			$('#mastercontainer').append('<div class="row"><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Hora de inicio: </label><input style="width: 78px;" id="horaini'+i+'" class="horainiaction" type="time" name="horaini'+i+'"></div><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Hora de fin: </label><input style="width: 78px;" id="horafin'+i+'" class="horafinaction" type="time" name="horafin'+i+'"></div><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Duración: </label><input style="width: 78px; float:left;" id="duracion'+i+'" type="text" name="duracion'+i+'" readonly><input id="duracionhide'+i+'" type="hidden"><div class="item" onclick="addnewhorario();" style="cursor:pointer; float: left; margin-left: 11px;"><span class="fa-stack fa"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-plus fa-stack-1x fa-inverse"></i></span></div></div></div><br>');
			$('#horaini'+String(i)).timepicker({
		    			showPeriodLabels: false,
		    			hourText: 'Hora',
		    			minuteText: 'Minutos',
		    			myPosition: 'left top',
		    			atPosition: 'left bottom' 
			});
			$('#horafin'+String(i)).timepicker({
		    			showPeriodLabels: false,
		    			hourText: 'Hora',
		    			minuteText: 'Minutos',
		    			myPosition: 'left top',
		    			atPosition: 'left bottom'
			});
			$( "#horaini"+String(i) ).change(function() {
				restarHoras(i);
			});
			$( "#horafin"+String(i) ).change(function() {
  				restarHoras(i);
			});
			break;
		}
	}
}

function loadCalendar() {
	
	$('.waiting').show();
	if($('#reservas-tabla').length){
		$('#reservas-tabla').remove();
	}
	$.getJSON(api_url+'schedules/list_all_tabla?callback=?', {}, function(data){
		if(data.status=='success'){
			$('.waiting').hide();
			$('#enterprises_accordion').append('<div id="reservas-tabla" style="overflow-x: scroll; white-space: nowrap;"></div>');
			$('#reservas-tabla').append('<div id="hours" class="colday" style="float:left;"><div id="hournona"></div><div id="hour07" class="hourbasic"><span>07:00 - 08:00</span></div><div id="hour08" class="hourbasic"><span>08:00 - 09:00</span></div><div id="hour09" class="hourbasic"><span>09:00 - 10:00</span></div><div id="hour10" class="hourbasic"><span>10:00 - 11:00</span></div><div id="hour11" class="hourbasic"><span>11:00 - 12:00</span></div><div id="hour12" class="hourbasic"><span>12:00 - 13:00</span></div><div id="hour13" class="hourbasic"><span>13:00 - 14:00</span></div><div id="hour14" class="hourbasic"><span>14:00 - 15:00</span></div><div id="hour15" class="hourbasic"><span>15:00 - 16:00</span></div><div id="hour16" class="hourbasic"><span>16:00 - 17:00</span></div><div id="hour17" class="hourbasic"><span>17:00 - 18:00</span></div><div id="hour18" class="hourbasic"><span>18:00 - 19:00</span></div><div id="hour19" class="hourbasic"><span>19:00 - 20:00</span></div><div id="hour20" class="hourbasic"><span>20:00 - 21:00</span></div><div id="hour21" class="hourbasic"><span>21:00 - 22:00</span></div></div>');
			var diasemana = parseInt(data.data.dia_semana_inicio);
			var dia = parseInt(data.data.dia_hoy);
			var mes = parseInt(data.data.mes_hoy);
			var year = parseInt(data.data.year_hoy);
			var width = 0;
			var contador = 0;
			for(var i=0; i<data.data.dias_a_mostrar; i++){
				var idgen = 'day'+ dia + '-' + mes + '-' + year + '-' + diasemana;
				var nombredia = 'Lunes';
				var nombremes = 'Enero';
				if (diasemana == 0){
					nombredia = 'Lunes';
				}
				if (diasemana == 1){
					nombredia = 'Martes';
				}
				if (diasemana == 2){
					nombredia = 'Miércoles';
				}
				if (diasemana == 3){
					nombredia = 'Jueves';
				}
				if (diasemana == 4){
					nombredia = 'Viernes';
				}
				if (diasemana == 5){
					nombredia = 'Sábado';
				}
				if (mes == 1){
					nombremes = 'Enero';
				}
				if (mes == 2){
					nombremes = 'Febrero';
				}
				if (mes == 3){
					nombremes = 'Marzo';
				}
				if (mes == 4){
					nombremes = 'Abril';
				}
				if (mes == 5){
					nombremes = 'Mayo';
				}
				if (mes == 6){
					nombremes = 'Junio';
				}
				if (mes == 7){
					nombremes = 'Julio';
				}
				if (mes == 8){
					nombremes = 'Agosto';
				}
				if (mes == 9){
					nombremes = 'Septiembre';
				}
				if (mes == 10){
					nombremes = 'Octubre';
				}
				if (mes == 11){
					nombremes = 'Noviembre';
				}
				if (mes == 12){
					nombremes = 'Diciembre';
				}
				$('#reservas-tabla').append('<div id="' + idgen + '" class="colday"><div class="daybasic" id="'+idgen+'head"><span>'+nombredia+' '+dia+' '+nombremes+' '+year+'</span></div><div id="'+idgen+'hour07" data-contad="'+String(contador+1)+'" class="horavacia" style="width:auto; overflow:auto;"></div><div id="'+idgen+'hour08" data-contad="'+String(contador+2)+'" class="horavacia" style="width:auto;overflow:auto;"></div><div id="'+idgen+'hour09" data-contad="'+String(contador+3)+'" class="horavacia" style="width:auto;overflow:auto;"></div><div id="'+idgen+'hour10" data-contad="'+String(contador+4)+'" class="horavacia" style="width:auto;overflow:auto;"></div><div id="'+idgen+'hour11" data-contad="'+String(contador+5)+'" class="horavacia" style="width:auto;overflow:auto;"></div><div id="'+idgen+'hour12" data-contad="'+String(contador+6)+'" class="horavacia" style="width:auto;overflow:auto;"></div><div id="'+idgen+'hour13" data-contad="'+String(contador+7)+'" class="horavacia" style="width:auto;overflow:auto;"></div><div id="'+idgen+'hour14" data-contad="'+String(contador+8)+'" class="horavacia" style="width:auto;overflow:auto;"></div><div id="'+idgen+'hour15" data-contad="'+String(contador+9)+'" class="horavacia" style="width:auto;overflow:auto;"></div><div id="'+idgen+'hour16" data-contad="'+String(contador+10)+'" class="horavacia" style="width:auto;overflow:auto;"></div><div id="'+idgen+'hour17" data-contad="'+String(contador+11)+'" class="horavacia" style="width:auto;overflow:auto;"></div><div id="'+idgen+'hour18" data-contad="'+String(contador+12)+'" class="horavacia" style="width:auto;overflow:auto;"></div><div id="'+idgen+'hour19" data-contad="'+String(contador+13)+'" class="horavacia" style="width:auto;overflow:auto;"></div><div id="'+idgen+'hour20" data-contad="'+String(contador+14)+'" class="horavacia" style="width:auto;overflow:auto;"></div><div id="'+idgen+'hour21" data-contad="'+String(contador+15)+'" class="horavacia" style="width:auto;overflow:auto;"></div></div>');
				if(diasemana==5){
					$('#'+idgen+'hour07').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white; border-top: 2px solid white;');
					$('#'+idgen+'hour08').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white; text-align: center; color: black;font-weight: 600;font-size: 11px;padding-top: 8px;');
					$('#'+idgen+'hour08').html('Box cerrado');
					$('#'+idgen+'hour09').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white; border-bottom: 1px solid white;');
					$('#'+idgen+'hour13').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 2px solid white; border-top: 2px solid white;');
					$('#'+idgen+'hour14').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 2px solid white;');
					$('#'+idgen+'hour15').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 2px solid white;');
					$('#'+idgen+'hour16').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white;');
					$('#'+idgen+'hour17').attr('style', 'text-align: center; color: black;font-weight: 600;font-size: 11px;padding-top: 8px; width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white;');
					$('#'+idgen+'hour17').html('Box cerrado');
					$('#'+idgen+'hour18').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white;');
					$('#'+idgen+'hour19').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white;');
					$('#'+idgen+'hour20').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white;');
					$('#'+idgen+'hour21').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white; border-bottom: 1px solid white;');
				}
				if(diasemana==4){
					$('#'+idgen+'hour21').attr('style', 'width:auto;text-align: center;overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white; border-top: 2px solid white; border-bottom: 1px solid white;color: black;font-weight: 600;font-size: 11px;padding-top: 8px;');
					$('#'+idgen+'hour21').html('Box cerrado');
				}
				contador = contador + 15;
				width = width + $('#'+idgen).width();
				diasemana = diasemana + 1;
				dia = dia + 1;
				mes = mes - 1;
				var fechajavascript = new Date(year, mes, dia, 12, 12, 12);
				year = fechajavascript.getFullYear();
				dia = fechajavascript.getDate();
				mes = fechajavascript.getMonth() + 1;
				if(diasemana==6){
					diasemana = 0;
					dia = dia + 1;
					mes = mes - 1;
					var fechajavascriptdos = new Date(year, mes, dia, 12, 12, 12);
					year = fechajavascriptdos.getFullYear();
					dia = fechajavascriptdos.getDate();
					mes = fechajavascriptdos.getMonth() + 1;
				}
				if(diasemana!=0){
					if(i==0){
						$('#'+idgen+'hour13').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white;border-top: 2px solid white;');
						$('#'+idgen+'hour14').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white;');
						$('#'+idgen+'hour15').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white;border-bottom: 1px solid white;');
					}else{
						if(i<(data.data.dias_a_mostrar-1)){
							$('#'+idgen+'hour13').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-top: 2px solid white;');
							$('#'+idgen+'hour14').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2;');
							$('#'+idgen+'hour15').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-bottom: 1px solid white;');
						}else{
							$('#'+idgen+'hour13').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-right: 1px solid white;border-top: 2px solid white;');
							$('#'+idgen+'hour14').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-right: 1px solid white;');
							$('#'+idgen+'hour15').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-right: 1px solid white;border-bottom: 1px solid white;');
						}
					}
					
					if(i==1){
						$('#'+idgen+'hour14').html('Box cerrado');
						$('#'+idgen+'hour14').attr('style', 'text-align: center; color: black;font-weight: 600;font-size: 11px;padding-top: 8px; width:auto; overflow:auto; background-color: #f2f2f2;');
					
					}
				}
				if(diasemana==5){
					$('#'+idgen+'hour13').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2;  border-right: 1px solid white; border-top: 2px solid white;');
					$('#'+idgen+'hour14').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2;  border-right: 1px solid white;');
					$('#'+idgen+'hour15').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2;  border-right: 1px solid white;');
					
				}
				if(diasemana==1){
					$('#'+idgen+'hour13').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2;  border-left: 1px solid white; border-top: 2px solid white;');
					$('#'+idgen+'hour14').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2;  border-left: 1px solid white;');
					$('#'+idgen+'hour15').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2;  border-left: 1px solid white;');
					
				}

			}

			for (var i=0; i<data.data.actividades.length; i++){
				var horastart = parseInt(data.data.actividades[i].time_start.split(':')[0]);
				var horaend = parseInt(data.data.actividades[i].time_end.split(':')[0]);
				var minutostart = parseInt(data.data.actividades[i].time_start.split(':')[1]);
				var minutoend = parseInt(data.data.actividades[i].time_end.split(':')[1]);
				var fechatimestart = new Date(2016, 5, 5, horastart, minutostart, 0);
				var fechatimeend = new Date(2016, 5, 5, horaend, minutoend, 0);
				var duration = (fechatimeend - fechatimestart)/(1000*60*60);
				var izqoder = 3;
				var idcontainer = 'day'+data.data.actividades[i].day+'-'+data.data.actividades[i].month+'-'+data.data.actividades[i].year+'-'+data.data.actividades[i].dayweek+'hour'+data.data.actividades[i].time_start.split(':')[0];
				if($('#'+idcontainer).hasClass('unaact')){
					$('#'+idcontainer).removeClass('unaact');
					$('#'+idcontainer).addClass('dosact');
					izqoder = 2;
				}
				if($('#'+idcontainer).hasClass('horavacia')){
					$('#'+idcontainer).removeClass('horavacia');
					$('#'+idcontainer).addClass('unaact');
					izqoder = 1;
				}
				if(izqoder==3){
					$('#'+idcontainer).parent().addClass('marcado');
					$('#'+idcontainer).addClass('tresact');
				}
				var cadestado = '';
				var cadestadodos = '';
				if(data.data.actividades[i].estado=='DISPONIBLE'){
					cadestado = 'actividad';
					cadestadodos = 'spandisponible';
				}
				if(data.data.actividades[i].estado=='COMPLETA'){
					cadestado = 'actividadcompleta';
					cadestadodos = 'spancompleta';
				}
				if(data.data.actividades[i].estado=='CERRADA'){
					cadestado = 'actividadcerrada';
					cadestadodos = 'spancerrada';
				}
				if(data.data.actividades[i].estado=='FINALIZADA'){
					cadestado = 'actividadfinalizada';
					cadestadodos = 'spanfinalizada';
				}
				$('#'+idcontainer).append('<div id="'+data.data.actividades[i].id+'" onclick="showHorario('+data.data.actividades[i].id+');" data-izqoder="'+String(izqoder)+'" class="'+cadestado+'"><div class="actup"><div class="nombreactividad">'+data.data.actividades[i].name+' <span class="nombreactividadspan">'+data.data.actividades[i].time_start.split(':')[0]+':'+data.data.actividades[i].time_start.split(':')[1]+'</span></div></div><div class="actdown"><div class="capacidadactividad"><span class="'+cadestadodos+'">'+data.data.actividades[i].estado+'</span>'+data.data.actividades[i].disponibles+'/'+data.data.actividades[i].aforo+'</div></div></div>');
				
			}

			// SEGUNDA VUELTA
			for (var i=0; i<data.data.actividades.length; i++){
				var horastart = parseInt(data.data.actividades[i].time_start.split(':')[0]);
				var horaend = parseInt(data.data.actividades[i].time_end.split(':')[0]);
				var minutostart = parseInt(data.data.actividades[i].time_start.split(':')[1]);
				var minutoend = parseInt(data.data.actividades[i].time_end.split(':')[1]);
				var fechatimestart = new Date(2016, 5, 5, horastart, minutostart, 0);
				var fechatimeend = new Date(2016, 5, 5, horaend, minutoend, 0);
				var duration = (fechatimeend - fechatimestart)/(1000*60*60)
				var idcontainer = 'day'+data.data.actividades[i].day+'-'+data.data.actividades[i].month+'-'+data.data.actividades[i].year+'-'+data.data.actividades[i].dayweek+'hour'+data.data.actividades[i].time_start.split(':')[0];
				var izqoder = $('#'+data.data.actividades[i].id).attr('data-izqoder');
				if(duration > 1){
					$('#'+data.data.actividades[i].id).attr('style','height:70px !important;');
					$('#'+data.data.actividades[i].id+' > .actup').attr('style','margin-top: 15px;');
					var conty = parseInt($('#'+idcontainer).attr('data-contad'));
					var conty = conty + 1;
					$(".horavacia").each(function (index) 
        			{ 
            			if($(this).attr('data-contad')==conty){
            				$(this).attr('style','width:auto; overflow:auto; margin-top:-35px;');
            				if($(this).hasClass('unaact')){
            					if(izqoder=="1"){
            						$(this).children('div').attr('style','width:auto !important; float:right;');
            					}
            					if(izqoder=="2"){
            						$(this).children('div').attr('style','width:auto !important;');
            					}
            				}
            			}
        			})
        			$(".unaact").each(function (index) 
        			{ 
            			if($(this).attr('data-contad')==conty){
            				$(this).attr('style','width:auto; overflow:auto; margin-top:-35px;');
            				if($(this).hasClass('unaact')){
            					if(izqoder=="1"){
            						$(this).children('div').attr('style','width:auto !important; float:right;');
            					}
            					if(izqoder=="2"){
            						$(this).children('div').attr('style','width:auto !important;');
            					}
            				}
            			}
        			})
        			$(".dosact").each(function (index) 
        			{ 
            			if($(this).attr('data-contad')==conty){
            				$(this).attr('style','width:auto; overflow:auto; margin-top:-35px;');
            				if($(this).hasClass('unaact')){
            					if(izqoder=="1"){
            						$(this).children('div').attr('style','width:auto !important; float:right;');
            					}
            					if(izqoder=="2"){
            						$(this).children('div').attr('style','width:auto !important;');
            					}
            				}
            			}
        			})
				}
				if(duration > 2){
					$('#'+data.data.actividades[i].id).attr('style','height:105px !important;');
					$('#'+data.data.actividades[i].id+' > .actup').attr('style','margin-top: 30px;');
					var conty = parseInt($('#'+idcontainer).attr('data-contad'));
					var conty = conty + 1;
					$(".horavacia").each(function (index) 
        			{ 
            			if($(this).attr('data-contad')==conty){
            				$(this).attr('style','width:auto; overflow:auto; margin-top:-70px;');
            				if($(this).hasClass('unaact')){
            					if(izqoder=="1"){
            						$(this).children('div').attr('style','width:auto !important; float:right;');
            					}
            					if(izqoder=="2"){
            						$(this).children('div').attr('style','width:auto !important;');
            					}
            				}
            			}
        			})
        			$(".unaact").each(function (index) 
        			{ 
            			if($(this).attr('data-contad')==conty){
            				$(this).attr('style','width:auto; overflow:auto; margin-top:-70px;');
            				if($(this).hasClass('unaact')){
            					if(izqoder=="1"){
            						$(this).children('div').attr('style','width:auto !important; float:right;');
            					}
            					if(izqoder=="2"){
            						$(this).children('div').attr('style','width:auto !important;');
            					}
            				}
            			}
        			})
        			$(".dosact").each(function (index) 
        			{ 
            			if($(this).attr('data-contad')==conty){
            				$(this).attr('style','width:auto; overflow:auto; margin-top:-70px;');
            				if($(this).hasClass('unaact')){
            					if(izqoder=="1"){
            						$(this).children('div').attr('style','width:auto !important; float:right;');
            					}
            					if(izqoder=="2"){
            						$(this).children('div').attr('style','width:auto !important;');
            					}
            				}
            			}
        			})
        			var conty = conty + 1;
					$(".horavacia").each(function (index) 
        			{ 
            			if($(this).attr('data-contad')==conty){
            				$(this).attr('style','width:auto; overflow:auto; margin-top:-70px;');
            				if($(this).hasClass('unaact')){
            					if(izqoder=="1"){
            						$(this).children('div').attr('style','width:auto !important; float:right;');
            					}
            					if(izqoder=="2"){
            						$(this).children('div').attr('style','width:auto !important;');
            					}
            				}
            			}
        			})
					$(".unaact").each(function (index) 
        			{ 
            			if($(this).attr('data-contad')==conty){
            				$(this).attr('style','width:auto; overflow:auto; margin-top:-70px;');
            				if($(this).hasClass('unaact')){
            					if(izqoder=="1"){
            						$(this).children('div').attr('style','width:auto !important; float:right;');
            					}
            					if(izqoder=="2"){
            						$(this).children('div').attr('style','width:auto !important;');
            					}
            				}
            			}
        			})
        			$(".dosact").each(function (index) 
        			{ 
            			if($(this).attr('data-contad')==conty){
            				$(this).attr('style','width:auto; overflow:auto; margin-top:-70px;');
            				if($(this).hasClass('unaact')){
            					if(izqoder=="1"){
            						$(this).children('div').attr('style','width:auto !important; float:right;');
            					}
            					if(izqoder=="2"){
            						$(this).children('div').attr('style','width:auto !important;');
            					}
            				}
            			}
        			})
				}
			}
			// TERCERA VUELTA (POR DIVS)
			$(".marcado").each(function (index){ 
				$(this).children().each(function (index){ 
					if($(this).hasClass('dosact') && !$(this).hasClass('tresact')){
						$(this).children().each(function (index){ 
							$(this).attr('style','width:50%;');
						})
					}
				})
        	})
        	
			for (var i=0; i<data.data.festivos.length; i++){
				var identifier= 'day'+data.data.festivos[i].day+'-'+data.data.festivos[i].month+'-'+data.data.festivos[i].year+'-'+data.data.festivos[i].dayweek;
				$('#'+identifier).children().each(function (index){ 
					if(!$(this).hasClass('daybasic')){
						$(this).remove();
					}
				})
				$('#'+identifier).append('<div style="background-color:#f5f5f5;border-left: 2px solid white;border-right: 1px solid white;border-top: 2px solid white;text-transform: uppercase;padding-top: 231px;padding-bottom: 250px;text-align: center;font-size: 14px;padding-left: 15px;padding-right: 15px;color: black;font-weight: 600;"><span style="text-decoration: underline;">Día Festivo:</span><br><span>'+data.data.festivos[i].name+'</span></div>');
			}

			//$('#reservas-tabla').css('width',width+100);
			/*$('#mycalendar').monthly({
				mode: 'event',
				weekStart: 'Mon',
				disablePast: true,
				xmlUrl: data.data
			});*/
		}
	});
}

function restarHoras(id) {
	if($('#horaini'+id).val().length>0 && $('#horafin'+id).val().length>0){
		var inicio=$('#horaini'+id).val();
		var fin=$('#horafin'+id).val();
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
		if(transcurridoMinutos >= 0 && transcurridoHoras >= 0){  
		var horas = transcurridoHoras.toString();
		var minutos = transcurridoMinutos.toString();
		  
		if (horas.length < 2) {
		  horas = "0"+horas;
		}
		  
		if (minutos.length < 2) {
		  minutos = "0"+minutos;
		}
		  
		$('#duracion'+id).val(horas+':'+minutos);
		var total = (transcurridoHoras*60)+transcurridoMinutos;
		$('#duracionhide'+id).val(total);
		}
	}
}

function deleteHorario() {
	var id = $('#idscheduletime').val();
	var confirmacion=confirm('¿Seguro que quieres eliminar este evento?');
	if (confirmacion==true)
	{
		$('.waiting').show();
		$('#mycalendar').remove();
		$.getJSON(api_url+'schedules/delete?callback=?', {id:id}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Evento eliminado','');
				location.reload();
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});

	}
}