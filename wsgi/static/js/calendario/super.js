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
			$('#horaini0').timepicker({
		    			showPeriodLabels: false,
		    			hourText: 'Hora',
		    			minuteText: 'Minutos',
		    			myPosition: 'left top',
		    			atPosition: 'left bottom' 
			});
			$('#horafin0').timepicker({
		    			showPeriodLabels: false,
		    			hourText: 'Hora',
		    			minuteText: 'Minutos',
		    			myPosition: 'left top',
		    			atPosition: 'left bottom'
			});
				
			
			$( "#horaini0" ).change(function() {
				restarHoras(0);
			});
			$( "#horafin0" ).change(function() {
  				restarHoras(0);
			});
			$('#rmhoraini0').timepicker({
		    			showPeriodLabels: false,
		    			hourText: 'Hora',
		    			minuteText: 'Minutos',
		    			myPosition: 'left top',
		    			atPosition: 'left bottom' 
			});
			$('#rmhorafin0').timepicker({
		    			showPeriodLabels: false,
		    			hourText: 'Hora',
		    			minuteText: 'Minutos',
		    			myPosition: 'left top',
		    			atPosition: 'left bottom'
			});
				
			
			$( "#rmhoraini0" ).change(function() {
				rmrestarHoras(0);
			});
			$( "#rmhorafin0" ).change(function() {
  				rmrestarHoras(0);
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
			$( "#rmfechaconcreta" ).click(function() {
				$('#rmdivpatron').slideUp();
  				$('#rmdivfecha').slideDown();
  				$('#rmmarru').slideDown();
			});
			$( "#rmfechapatron" ).click(function() {
  				$('#rmdivfecha').slideUp();
  				$('#rmdivpatron').slideDown();
  				$('#rmmarru').slideDown();
			});
			$('.waiting').hide();
			active_new_enterprise_form();
			active_rm_enterprise_form();
			loadCalendar();
			$( ".mes" ).click(function() {
				$('#todoslosmeses').prop('checked','');
			});
			$( ".dia" ).click(function() {
				$('#todoslosdias').prop('checked','');
			});
			$( ".mes" ).click(function() {
				$('#rmtodoslosmeses').prop('checked','');
			});
			$( ".dia" ).click(function() {
				$('#rmtodoslosdias').prop('checked','');
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
			$( "#rmtodoslosmeses" ).click(function() {
  				if($('#rmtodoslosmeses').is(":checked")){
  					$('#rmenero').prop('checked','checked');
  					$('#rmfebrero').prop('checked','checked');
  					$('#rmmarzo').prop('checked','checked');
  					$('#rmabril').prop('checked','checked');
  					$('#rmmayo').prop('checked','checked');
  					$('#rmjunio').prop('checked','checked');
  					$('#rmjulio').prop('checked','checked');
  					$('#rmagosto').prop('checked','checked');
  					$('#rmseptiembre').prop('checked','checked');
  					$('#rmoctubre').prop('checked','checked');
  					$('#rmnoviembre').prop('checked','checked');
  					$('#rmdiciembre').prop('checked','checked');
  				}else{
  					$('#rmenero').prop('checked','');
  					$('#rmfebrero').prop('checked','');
  					$('#rmmarzo').prop('checked','');
  					$('#rmabril').prop('checked','');
  					$('#rmmayo').prop('checked','');
  					$('#rmjunio').prop('checked','');
  					$('#rmjulio').prop('checked','');
  					$('#rmagosto').prop('checked','');
  					$('#rmseptiembre').prop('checked','');
  					$('#rmoctubre').prop('checked','');
  					$('#rmnoviembre').prop('checked','');
  					$('#rmdiciembre').prop('checked','');
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
			$( "#rmtodoslosdias" ).click(function() {
  				if($('#rmtodoslosdias').is(":checked")){
  					$('#rmlunes').prop('checked','checked');
  					$('#rmmartes').prop('checked','checked');
  					$('#rmmiercoles').prop('checked','checked');
  					$('#rmjueves').prop('checked','checked');
  					$('#rmviernes').prop('checked','checked');
  					$('#rmsabado').prop('checked','checked');
  					$('#rmdomingo').prop('checked','checked');
  				}else{
  					$('#rmlunes').prop('checked','');
  					$('#rmmartes').prop('checked','');
  					$('#rmmiercoles').prop('checked','');
  					$('#rmjueves').prop('checked','');
  					$('#rmviernes').prop('checked','');
  					$('#rmsabado').prop('checked','');
  					$('#rmdomingo').prop('checked','');
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

function active_rm_enterprise_form() {
	$('#rm_enterprise_form').submit(false).submit(function(e){
		rm_horario();
		return false;
	});
}


function show_new() {
	if($('#new_enterprise_wrapper').css('display')=='none'){
		$('#new_enterprise_wrapper').slideDown();
	}
	else $('#new_enterprise_wrapper').slideUp();
}

function show_delete() {
	if($('#rm_enterprise_wrapper').css('display')=='none'){
		$('#rm_enterprise_wrapper').slideDown();
	}
	else $('#rm_enterprise_wrapper').slideUp();
}

function rm_horario(){
	var error = false;
	var numerodetramos = 0;
	var horaini='';
	var horafin='';
	var duracion='';
	var duracionhide='';
	for(var i=0; i<100; i++){
		if($('#rmhoraini'+i).length){
			numerodetramos = numerodetramos + 1;
			horaini=horaini + $('#rmhoraini'+i).val() + ',';
			horafin=horafin + $('#rmhorafin'+i).val() + ',';
			duracion= duracion + $('#rmduracion'+i).val() + ',';
			duracionhide= duracionhide + $('#rmduracionhide'+i).val() + ',';
		}
	}
	var activity_id=$('#rmactividad').val();
	if($('#rmfechaconcreta').is(":checked")){
		var fecha = $('#rmfecha').val();
		if(fecha.length>0){
			if(horaini.length>0){
				if(horafin.length>0){
					if(duracion.length>0){
						if(activity_id!=-1){
							$('#rmbotonadd').html('<i class="fa fa-cog fa-spin"></i>');
							$.getJSON(api_url+'schedules/rm_concrete?callback=?', { time_start:horaini, 
																							 time_end:horafin,
																							 duration:duracionhide,
																							 activity_id:activity_id,
																							 date:fecha,
																							 numerodetramos: numerodetramos,
																					}, function(data){
																												
										if(data.status=='success'){
											launch_alert('<i class="fa fa-smile-o"></i> Horario eliminado','');
											$('#rmmastercontainer').html('');
											$('#rmmastercontainer').append('<div class="row"><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Hora de inicio: </label><input style="width: 78px;" id="rmhoraini0" class="horainiaction" type="time" name="horaini0"></div><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Hora de fin: </label><input style="width: 78px;" id="rmhorafin0" class="horafinaction" type="time" name="horafin0"></div><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Duración: </label><input style="width: 78px; float:left;" id="rmduracion0" type="text" name="duracion0" readonly><input id="rmduracionhide0" type="hidden"><div class="item" onclick="rmnewhorario();" style="cursor:pointer; float: left; margin-left: 11px;"><span class="fa-stack fa"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-plus fa-stack-1x fa-inverse"></i></span></div></div></div><br>');
											$( "#rmhoraini0" ).change(function() {
												rmrestarHoras(0);
											});
											$( "#rmhorafin0" ).change(function() {
								  				rmrestarHoras(0);
											});
											$('#rmhoraini0').timepicker({
									    			showPeriodLabels: false,
									    			hourText: 'Hora',
									    			minuteText: 'Minutos',
									    			myPosition: 'left top',
									    			atPosition: 'left bottom' 
											});
											$('#rmhorafin0').timepicker({
										    			showPeriodLabels: false,
										    			hourText: 'Hora',
										    			minuteText: 'Minutos',
										    			myPosition: 'left top',
										    			atPosition: 'left bottom'
											});
											$('#rmbotonadd').html('Enviar');
											show_delete();
											$('#rmactivity_id').val('-1');
											$('#rmfecha').val('');
											$('#rmlunes').prop('checked','');
											$('#rmmartes').prop('checked','');
											$('#rmmiercoles').prop('checked','');
											$('#rmjueves').prop('checked','');
											$('#rmviernes').prop('checked','');
											$('#rmsabado').prop('checked','');
											$('#rmdomingo').prop('checked','');
											$('#rmtodoslosdias').prop('checked','');
											$('#rmenero').prop('checked','');
											$('#rmfebrero').prop('checked','');
											$('#rmmarzo').prop('checked','');
											$('#rmabril').prop('checked','');
											$('#rmmayo').prop('checked','');
											$('#rmjunio').prop('checked','');
											$('#rmjulio').prop('checked','');
											$('#rmagosto').prop('checked','');
											$('#rmseptiembre').prop('checked','');
											$('#rmoctubre').prop('checked','');
											$('#rmnoviembre').prop('checked','');
											$('#rmdiciembre').prop('checked','');
											$('#rmtodoslosmeses').prop('checked','');
											loadCalendar();		
										}else{
											error = true;
											launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning'); $('#rmbotonadd').html('Enviar');}
									});
								}else{launch_alert('<i class="fa fa-frown-o"></i> Debes seleccionar una actividad','warning');}
							}else{launch_alert('<i class="fa fa-frown-o"></i> El intervalo horario es erróneo','warning');}
						}else{launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una hora de fin para la actividad','warning');}
					}else{launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una hora de inicio para la actividad','warning');}
				}else{launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una fecha para la actividad','warning');}
			}else{
				if($('#rmfechapatron').is(":checked")){
					var lunes = false;
					var martes = false;
					var miercoles = false;
					var jueves = false;
					var viernes = false;
					var sabado = false;
					var domingo = false;
					if($('#rmlunes').is(":checked")){ lunes=true; }
					if($('#rmmartes').is(":checked")){ martes=true; }
					if($('#rmmiercoles').is(":checked")){ miercoles=true; }
					if($('#rmjueves').is(":checked")){ jueves=true; }
					if($('#rmviernes').is(":checked")){ viernes=true; }
					if($('#rmsabado').is(":checked")){ sabado=true; }
					if($('#rmdomingo').is(":checked")){ domingo=true; }

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
					if($('#rmenero').is(":checked")){ enero=true; }
					if($('#rmfebrero').is(":checked")){ febrero=true; }
					if($('#rmmarzo').is(":checked")){ marzo=true; }
					if($('#rmabril').is(":checked")){ abril=true; }
					if($('#rmmayo').is(":checked")){ mayo=true; }
					if($('#rmjunio').is(":checked")){ junio=true; }
					if($('#rmjulio').is(":checked")){ julio=true; }
					if($('#rmagosto').is(":checked")){ agosto=true; }
					if($('#rmseptiembre').is(":checked")){ septiembre=true; }
					if($('#rmoctubre').is(":checked")){ octubre=true; }
					if($('#rmnoviembre').is(":checked")){ noviembre=true; }
					if($('#rmdiciembre').is(":checked")){ diciembre=true; }
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
											$('#rmbotonadd').html('<i class="fa fa-cog fa-spin"></i>');
											$.getJSON(api_url+'schedules/rm_interval?callback=?', { time_start:horaini, 
																								 time_end:horafin,
																								 duration:duracionhide,
																								 activity_id:activity_id,
																								 monthly:cad_meses,
																								 weekly:cad_dias,
																								 numerodetramos:numerodetramos}, function(data){
																													
												if(data.status=='success'){
													
													launch_alert('<i class="fa fa-smile-o"></i> Horarios eliminados','');
													//searchRates();
													$('#rmmastercontainer').html('');
													$('#rmmastercontainer').append('<div class="row"><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Hora de inicio: </label><input style="width: 78px;" id="rmhoraini0" class="horainiaction" type="time" name="horaini0"></div><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Hora de fin: </label><input style="width: 78px;" id="rmhorafin0" class="horafinaction" type="time" name="horafin0"></div><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Duración: </label><input style="width: 78px; float:left;" id="rmduracion0" type="text" name="duracion0" readonly><input id="rmduracionhide0" type="hidden"><div class="item" onclick="rmnewhorario();" style="cursor:pointer; float: left; margin-left: 11px;"><span class="fa-stack fa"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-plus fa-stack-1x fa-inverse"></i></span></div></div></div><br>');
													$( "#rmhoraini0" ).change(function() {
												rmrestarHoras(0);
											});
											$( "#rmhorafin0" ).change(function() {
								  				rmrestarHoras(0);
											});
											$('#rmhoraini0').timepicker({
									    			showPeriodLabels: false,
									    			hourText: 'Hora',
									    			minuteText: 'Minutos',
									    			myPosition: 'left top',
									    			atPosition: 'left bottom' 
											});
											$('#rmhorafin0').timepicker({
										    			showPeriodLabels: false,
										    			hourText: 'Hora',
										    			minuteText: 'Minutos',
										    			myPosition: 'left top',
										    			atPosition: 'left bottom'
											});
											$('#rmbotonadd').html('Enviar');
											show_delete();
											$('#rmactivity_id').val('-1');
											$('#rmfecha').val('');
											$('#rmlunes').prop('checked','');
											$('#rmmartes').prop('checked','');
											$('#rmmiercoles').prop('checked','');
											$('#rmjueves').prop('checked','');
											$('#rmviernes').prop('checked','');
											$('#rmsabado').prop('checked','');
											$('#rmdomingo').prop('checked','');
											$('#rmtodoslosdias').prop('checked','');

											$('#rmenero').prop('checked','');
											$('#rmfebrero').prop('checked','');
											$('#rmmarzo').prop('checked','');
											$('#rmabril').prop('checked','');
											$('#rmmayo').prop('checked','');
											$('#rmjunio').prop('checked','');
											$('#rmjulio').prop('checked','');
											$('#rmagosto').prop('checked','');
											$('#rmseptiembre').prop('checked','');
											$('#rmoctubre').prop('checked','');
											$('#rmnoviembre').prop('checked','');
											$('#rmdiciembre').prop('checked','');
											$('#rmtodoslosmeses').prop('checked','');
													loadCalendar();

								
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

function new_horario() {
	var error = false;
	var numerodetramos = 0;
	var horaini='';
	var horafin='';
	var duracion='';
	var duracionhide='';
	for(var i=0; i<100; i++){
		if($('#horaini'+i).length){
			numerodetramos = numerodetramos + 1;
			horaini=horaini + $('#horaini'+i).val() + ',';
			horafin=horafin + $('#horafin'+i).val() + ',';
			duracion= duracion + $('#duracion'+i).val() + ',';
			duracionhide= duracionhide + $('#duracionhide'+i).val() + ',';
		}
	}
			var activity_id=$('#actividad').val();
			if($('#fechaconcreta').is(":checked")){
				var fecha = $('#fecha').val();
				if(fecha.length>0){
					if(horaini.length>0){
						if(horafin.length>0){
							if(duracion.length>0){
								if(activity_id!=-1){
									$('#botonadd').html('<i class="fa fa-cog fa-spin"></i>');
									var minutes_pre = $('#minutos_reserva').val();
									var minutes_post = $('#minutos_cancela').val();

									$.getJSON(api_url+'schedules/add_concrete?callback=?', { time_start:horaini, 
																							 time_end:horafin,
																							 duration:duracionhide,
																							 activity_id:activity_id,
																							 date:fecha,
																							 numerodetramos: numerodetramos,
																							 minutes_pre:minutes_pre,
																							 minutes_post:minutes_post}, function(data){
																												
										if(data.status=='success'){
											launch_alert('<i class="fa fa-smile-o"></i> Horario añadido','');
											$('#mastercontainer').html('');
											$('#mastercontainer').append('<div class="row"><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Hora de inicio: </label><input style="width: 78px;" id="horaini0" class="horainiaction" type="time" name="horaini0"></div><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Hora de fin: </label><input style="width: 78px;" id="horafin0" class="horafinaction" type="time" name="horafin0"></div><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Duración: </label><input style="width: 78px; float:left;" id="duracion0" type="text" name="duracion0" readonly><input id="duracionhide0" type="hidden"><div class="item" onclick="addnewhorario();" style="cursor:pointer; float: left; margin-left: 11px;"><span class="fa-stack fa"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-plus fa-stack-1x fa-inverse"></i></span></div></div></div><br>');
											$( "#horaini0" ).change(function() {
												restarHoras(0);
											});
											$( "#horafin0" ).change(function() {
								  				restarHoras(0);
											});
											$('#horaini0').timepicker({
									    			showPeriodLabels: false,
									    			hourText: 'Hora',
									    			minuteText: 'Minutos',
									    			myPosition: 'left top',
									    			atPosition: 'left bottom' 
											});
											$('#horafin0').timepicker({
										    			showPeriodLabels: false,
										    			hourText: 'Hora',
										    			minuteText: 'Minutos',
										    			myPosition: 'left top',
										    			atPosition: 'left bottom'
											});
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
											loadCalendar();		
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
							var minutes_pre = $('#minutos_reserva').val();
							var minutes_post = $('#minutos_cancela').val();
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
																								 weekly:cad_dias,
																								 numerodetramos:numerodetramos,
																								 minutes_pre:minutes_pre,
																								 minutes_post:minutes_post}, function(data){
																													
												if(data.status=='success'){
													
													launch_alert('<i class="fa fa-smile-o"></i> Horario añadido','');
													//searchRates();
													$('#mastercontainer').html('');
													$('#mastercontainer').append('<div class="row"><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Hora de inicio: </label><input style="width: 78px;" id="horaini0" class="horainiaction" type="time" name="horaini0"></div><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Hora de fin: </label><input style="width: 78px;" id="horafin0" class="horafinaction" type="time" name="horafin0"></div><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Duración: </label><input style="width: 78px; float:left;" id="duracion0" type="text" name="duracion0" readonly><input id="duracionhide0" type="hidden"><div class="item" onclick="addnewhorario();" style="cursor:pointer; float: left; margin-left: 11px;"><span class="fa-stack fa"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-plus fa-stack-1x fa-inverse"></i></span></div></div></div><br>');
													$( "#horaini0" ).change(function() {
												restarHoras(0);
											});
											$( "#horafin0" ).change(function() {
								  				restarHoras(0);
											});
											$('#horaini0').timepicker({
									    			showPeriodLabels: false,
									    			hourText: 'Hora',
									    			minuteText: 'Minutos',
									    			myPosition: 'left top',
									    			atPosition: 'left bottom' 
											});
											$('#horafin0').timepicker({
										    			showPeriodLabels: false,
										    			hourText: 'Hora',
										    			minuteText: 'Minutos',
										    			myPosition: 'left top',
										    			atPosition: 'left bottom'
											});
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
													loadCalendar();

								
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
	$('#actividad').html('');
	$('#rmactividad').html('');
	var select = $('#actividad');
	var selectrm = $('#rmactividad');
	$.getJSON(api_url+'activities/list_all?callback=?', {}, function(data){
		////console.log(data.data)
		if(data.status=='success'){
			var list_tarifas=data.data;
			for(var i=0;i<list_tarifas.length;i++){
            	id=list_tarifas[i].id;
            	nombres=list_tarifas[i].name;
            	var option=$('<option></option>').attr({'value':list_tarifas[i].id}).text(list_tarifas[i].name); select.append(option);
            	var optionrm=$('<option></option>').attr({'value':list_tarifas[i].id}).text(list_tarifas[i].name); selectrm.append(optionrm);
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

function rmnewhorario(){
	for(var i=0;i<100; i++){
		if(!$('#rmhoraini'+String(i)).length){
			$('#rmmastercontainer').append('<div class="row"><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Hora de inicio: </label><input style="width: 78px;" id="rmhoraini'+i+'" class="horainiaction" type="time" name="horaini'+i+'"></div><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Hora de fin: </label><input style="width: 78px;" id="rmhorafin'+i+'" class="horafinaction" type="time" name="horafin'+i+'"></div><div class="col-md-3"><label style="width:100%; margin-right: 20px; color: #555; margin-top: 7px; font-weight: 500;">Duración: </label><input style="width: 78px; float:left;" id="rmduracion'+i+'" type="text" name="duracion'+i+'" readonly><input id="rmduracionhide'+i+'" type="hidden"><div class="item" onclick="rmnewhorario();" style="cursor:pointer; float: left; margin-left: 11px;"><span class="fa-stack fa"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-plus fa-stack-1x fa-inverse"></i></span></div></div></div><br>');
			$('#rmhoraini'+String(i)).timepicker({
		    			showPeriodLabels: false,
		    			hourText: 'Hora',
		    			minuteText: 'Minutos',
		    			myPosition: 'left top',
		    			atPosition: 'left bottom' 
			});
			$('#rmhorafin'+String(i)).timepicker({
		    			showPeriodLabels: false,
		    			hourText: 'Hora',
		    			minuteText: 'Minutos',
		    			myPosition: 'left top',
		    			atPosition: 'left bottom'
			});
			$( "#rmhoraini"+String(i) ).change(function() {
				rmrestarHoras(i);
			});
			$( "#rmhorafin"+String(i) ).change(function() {
  				rmrestarHoras(i);
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
		$.ajaxSetup({ cache: true });
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
					$('#'+idgen+'hour08').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white;');
					$('#'+idgen+'hour08').css('text-align','center');
					$('#'+idgen+'hour08').css('color','black');
					$('#'+idgen+'hour08').css('font-weight','600');
					$('#'+idgen+'hour08').css('font-size','11px');
					$('#'+idgen+'hour08').css('padding-top','8px');
					$('#'+idgen+'hour08').html('Box cerrado');
					$('#'+idgen+'hour09').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white; border-bottom: 1px solid white;');
					$('#'+idgen+'hour13').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 2px solid white; border-top: 2px solid white;');
					$('#'+idgen+'hour14').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 2px solid white;');
					$('#'+idgen+'hour15').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 2px solid white;');
					$('#'+idgen+'hour16').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white;');
					$('#'+idgen+'hour17').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white;');
					$('#'+idgen+'hour17').css('text-align','center');
					$('#'+idgen+'hour17').css('color','black');
					$('#'+idgen+'hour17').css('font-weight','600');
					$('#'+idgen+'hour17').css('font-size','11px');
					$('#'+idgen+'hour17').css('padding-top','8px');
					$('#'+idgen+'hour17').html('Box cerrado');
					$('#'+idgen+'hour18').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white;');
					$('#'+idgen+'hour19').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white;');
					$('#'+idgen+'hour20').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white;');
					$('#'+idgen+'hour21').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white; border-bottom: 1px solid white;');
				}
				if(diasemana==4){
					$('#'+idgen+'hour21').attr('style', 'width:auto;text-align: center;overflow:auto; background-color: #f2f2f2; border-left: 2px solid white; border-right: 1px solid white; border-top: 2px solid white; border-bottom: 1px solid white;');
					$('#'+idgen+'hour21').css('text-align','center');
					$('#'+idgen+'hour21').css('color','black');
					$('#'+idgen+'hour21').css('font-weight','600');
					$('#'+idgen+'hour21').css('font-size','11px');
					$('#'+idgen+'hour21').css('padding-top','8px');
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
						$('#'+idgen+'hour14').attr('style', 'width:auto; overflow:auto; background-color: #f2f2f2;');
						$('#'+idgen+'hour14').addClass('boxcerrado');
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
				var tamannitofuente = '';
				if(data.data.actividades[i].name.replace(/\s/g, '').length>=11){
					tamannitofuente='style="font-size:9.4px;"';
				}else{
					if(data.data.actividades[i].name.replace(/\s/g, '').length>=8){
						tamannitofuente='style="font-size:12px;"';
					}else{
						if(data.data.actividades[i].name.replace(/\s/g, '').length>=7){
							tamannitofuente='style="font-size:13px;"';
						}
					}
				}
				$('#'+idcontainer).append('<div id="'+data.data.actividades[i].id+'" onclick="showHorario('+data.data.actividades[i].id+');" data-izqoder="'+String(izqoder)+'" class="'+cadestado+'"><div class="actup"><div class="nombreactividad" '+tamannitofuente+'>'+data.data.actividades[i].name+' <span class="nombreactividadspan">'+data.data.actividades[i].time_start.split(':')[0]+':'+data.data.actividades[i].time_start.split(':')[1]+'</span></div></div><div class="actdown"><div class="capacidadactividad"><span class="'+cadestadodos+'">'+data.data.actividades[i].estado+'</span>'+data.data.actividades[i].disponibles+'/'+data.data.actividades[i].aforo+'</div></div></div>');
				
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
				if(idcontainer.indexOf('4hour21')>-1){
					if($('#'+idcontainer).hasClass('unaact')){
						$('#'+idcontainer).css('border-width','0px 0px 0px 0px');
						$('#'+idcontainer).css('padding-top','0px');
						var poliglota = $('#'+idcontainer).html();
						poliglota=poliglota.replace("Box cerrado", "");
						$('#'+idcontainer).html(poliglota);
					}
				}
			}
			// TERCERA VUELTA (POR DIVS)
			$(".marcado").each(function (index){ 
				$(this).children().each(function (index){ 
					if($(this).hasClass('dosact') && !$(this).hasClass('tresact')){
						$(this).children().each(function (index){ 
							$(this).css('width','50%');
							if($(this).attr('data-izqoder')=='2' && $(this).css('height')=='70px'){
								
								var contadhunt = parseInt($(this).parent().attr('data-contad'))+1;
								$(".marcado").each(function (index){ 
									$(this).children().each(function (index){ 
										if($(this).attr('data-contad')==contadhunt){
											if($(this).attr('id').split('hour')[1]!='13' && $(this).attr('id').split('hour')[1]!='14' && $(this).attr('id').split('hour')[1]!='15'){
												$(this).children().each(function (index){ 
													$(this).attr('style','width: 50% !important');

												})
											}
										}
									})
								})
							}
							/*if($(this).attr('data-izqoder')=='1' && $(this).css('height')=='70px'){
								var contadhunt = parseInt($(this).parent().attr('data-contad'))+1;
								$(".marcado").each(function (index){ 
									$(this).children().each(function (index){ 
										if($(this).attr('data-contad')==contadhunt){
											if($(this).attr('id').split('hour')[1]!=13 && $(this).attr('id').split('hour')[1]!=14 && $(this).attr('id').split('hour')[1]!=15){
												$(this).children().each(function (index){ 
													$(this).css('width','50% !important');
													$(this).css('float','right');
												})
											}
										}
									})
								})
							}*/
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
			$(".horavacia").each(function (index) {
				var cadid = $(this).attr('id');
				if (cadid.indexOf("hour12") >= 0){
					$(this).css('border-top','2px solid white');
				}
				var diasemanita = parseInt(data.data.dia_semana_inicio);
				var diita = parseInt(data.data.dia_hoy);
				if (cadid.indexOf(diasemanita+"hour12") >= 0){
					if (cadid.indexOf("ay"+diita) >= 0){
						//alert("Web en reformas:"+cadid);
						var styleattr = $(this).attr('style');
						styleattr = styleattr + ' border-left: 2px solid white !important;';
						$(this).attr('style',styleattr);
					}
				}
				if (cadid.indexOf("hour13") >= 0){
					var cadsup = cadid.replace('hour13','hour12');
					if($('#'+cadsup).hasClass('horavacia')){
						$(this).css('border-top','0px solid white');
					}
				}
				if (cadid.indexOf("5hour13") >= 0){
					$(this).css('border-left','0px solid white');
					$(this).css('border-right','0px solid white');
				}
				if (cadid.indexOf("5hour14") >= 0){
					$(this).css('border-left','0px solid white');
					$(this).css('border-right','0px solid white');
				}
				if (cadid.indexOf("5hour15") >= 0){
					$(this).css('border-left','0px solid white');
					$(this).css('border-right','0px solid white');
				}
				if (cadid.indexOf("4hour13") >= 0){
					$(this).css('border-right','0px solid white');
				}
				if (cadid.indexOf("4hour14") >= 0){
					$(this).css('border-right','0px solid white');
				}
				if (cadid.indexOf("4hour15") >= 0){
					$(this).css('border-right','0px solid white');
				}
				if (cadid.indexOf("ay"+diita) < 0){
					if (cadid.indexOf("0hour13") >= 0){
						$(this).css('border-left','0px solid white');
					}
					if (cadid.indexOf("0hour14") >= 0){
						$(this).css('border-left','0px solid white');
					}
					if (cadid.indexOf("0hour15") >= 0){
						$(this).css('border-left','0px solid white');
					}
				}
				$(this).css('background-color','#f2f2f2');
			}); 
			//$('#reservas-tabla').css('width',width+100);
			/*$('#mycalendar').monthly({
				mode: 'event',
				weekStart: 'Mon',
				disablePast: true,
				xmlUrl: data.data
			});*/
		listarActividades();
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

function rmrestarHoras(id) {
	if($('#rmhoraini'+id).val().length>0 && $('#rmhorafin'+id).val().length>0){
		var inicio=$('#rmhoraini'+id).val();
		var fin=$('#rmhorafin'+id).val();
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
		  
		$('#rmduracion'+id).val(horas+':'+minutos);
		var total = (transcurridoHoras*60)+transcurridoMinutos;
		$('#rmduracionhide'+id).val(total);
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
				//location.reload();
				loadCalendar();
				$('#horario_details_modal').modal('hide');
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});

	}
}