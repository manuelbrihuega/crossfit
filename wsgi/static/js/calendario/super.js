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
  				restarHoras();
			});
			$( "#horafin" ).change(function() {
  				restarHoras();
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
	var horaini=$('#horaini').val();
	var horafin=$('#horafin').val();
	var duracion=$('#duracion').val();
	var duracionhide=$('#duracionhide').val();
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
									$('#botonadd').html('Enviar');
									show_new();
									launch_alert('<i class="fa fa-smile-o"></i> Horario añadido','');
									//searchRates();
									$('#horaini').val('');
									$('#horafin').val('');
									$('#duracion').val('');
									$('#activity_id').val('-1');
									$('#fecha').val('');
									location.reload();
								}else{ launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning'); $('#botonadd').html('Enviar');}
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
											$('#botonadd').html('Enviar');
											show_new();
											launch_alert('<i class="fa fa-smile-o"></i> Horario añadido','');
											//searchRates();
											$('#horaini').val('');
											$('#horafin').val('');
											$('#duracion').val('');
											$('#activity_id').val('-1');
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
											location.reload();
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

function loadCalendar() {
	
	$('.waiting').show();
	if($('#reservas-tabla').length){
		$('#reservas-tabla').remove();
	}
	$.getJSON(api_url+'schedules/list_all_tabla?callback=?', {}, function(data){
		if(data.status=='success'){
			$('.waiting').hide();
			$('#enterprises_accordion').append('<div id="reservas-tabla"></div>');
			$('#reservas-tabla').append('<div id="hours" class="colday"><div id="hournona"></div><div id="hour07" class="hourbasic"><span>07:00 - 08:00</span></div><div id="hour08" class="hourbasic"><span>08:00 - 09:00</span></div><div id="hour09" class="hourbasic"><span>09:00 - 10:00</span></div><div id="hour10" class="hourbasic"><span>10:00 - 11:00</span></div><div id="hour11" class="hourbasic"><span>11:00 - 12:00</span></div><div id="hour12" class="hourbasic"><span>12:00 - 13:00</span></div><div id="hour13" class="hourbasic"><span>13:00 - 14:00</span></div><div id="hour14" class="hourbasic"><span>14:00 - 15:00</span></div><div id="hour15" class="hourbasic"><span>15:00 - 16:00</span></div><div id="hour16" class="hourbasic"><span>16:00 - 17:00</span></div><div id="hour17" class="hourbasic"><span>17:00 - 18:00</span></div><div id="hour18" class="hourbasic"><span>18:00 - 19:00</span></div><div id="hour19" class="hourbasic"><span>19:00 - 20:00</span></div><div id="hour20" class="hourbasic"><span>20:00 - 21:00</span></div><div id="hour21" class="hourbasic"><span>21:00 - 22:00</span></div></div>');
			var diasemana = parseInt(data.data.dia_semana_inicio);
			var dia = parseInt(data.data.dia_hoy);
			var mes = parseInt(data.data.mes_hoy);
			var year = parseInt(data.data.year_hoy);
			var width = 0;
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
				$('#reservas-tabla').append('<div id="' + idgen + '" class="colday"><div class="daybasic" id="'+idgen+'head"><span>'+nombredia+' '+dia+' '+nombremes+' '+year+'</span></div><div id="'+idgen+'hour07" style="width:auto;"></div><div id="'+idgen+'hour08" style="width:auto;"></div><div id="'+idgen+'hour09" style="width:auto;"></div><div id="'+idgen+'hour10" style="width:auto;"></div><div id="'+idgen+'hour11" style="width:auto;"></div><div id="'+idgen+'hour12" style="width:auto;"></div><div id="'+idgen+'hour13" style="width:auto;"></div><div id="'+idgen+'hour14" style="width:auto;"></div><div id="'+idgen+'hour15" style="width:auto;"></div><div id="'+idgen+'hour16" style="width:auto;"></div><div id="'+idgen+'hour17" style="width:auto;"></div><div id="'+idgen+'hour18" style="width:auto;"></div><div id="'+idgen+'hour19" style="width:auto;"></div><div id="'+idgen+'hour20" style="width:auto;"></div><div id="'+idgen+'hour21" style="width:auto;"></div></div>');
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
				

			}
			$('#reservas-tabla').css('width',width+1);
			/*$('#mycalendar').monthly({
				mode: 'event',
				weekStart: 'Mon',
				disablePast: true,
				xmlUrl: data.data
			});*/
		}
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
		if(transcurridoMinutos >= 0 && transcurridoHoras >= 0){  
		var horas = transcurridoHoras.toString();
		var minutos = transcurridoMinutos.toString();
		  
		if (horas.length < 2) {
		  horas = "0"+horas;
		}
		  
		if (minutos.length < 2) {
		  minutos = "0"+minutos;
		}
		  
		$('#duracion').val(horas+':'+minutos);
		var total = (transcurridoHoras*60)+transcurridoMinutos;
		$('#duracionhide').val(total);
		}
	}
}

function deleteHorario(id) {
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