months=['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
months_complete=['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
var current_year = (new Date).getFullYear();
var current_day = (new Date).getDate();
var current_month = (new Date).getMonth();
var month_view = current_month;
var year_view = current_year;
function get_content() {
	
	$.getScript(media_url+'js/aux/date.js');
	$.getScript(media_url+'js/aux/modals.js');
	$.post('partials/dashboard_admin_enterprise', function(template, textStatus, xhr) {
	 	$('#main').html(template);
		$('#current_year').html('<i class="fa fa-cog fa-spin"></i>');
	 	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
		$('#current_year').html(year_view);
		selectMonth(month_view);
	});
}

function selectMonth(month){

	$('#accordion_wait').show();
	$('#accordion_wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	month_view=month;
	for(var i=0; i<months.length; i++){
		$('#'+months[i]).removeClass('month-selected');
	}
	$('#'+months[month_view]).addClass('month-selected');
	$('#'+months[month_view]).focus();
	$('#graphical-content').attr({'style':'display:all;'});
	$('#accordion_wait').hide();
	loadFirstGraphical(month_view,year_view);
}

function loadGraphicalJourneysYear(){
	$('#rgraph_key').remove();
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	RGraph.ObjectRegistry.Clear();
	$('#link-graphical-journeys-year').addClass('active');
	$('#link-graphical-journeys-month').removeClass('active');
	$('#link-graphical-money-year').removeClass('active');
	$('#link-graphical-money-month').removeClass('active');
	var width= $("#dashboard-graphical").width();
	var height=(width*300)/632;
	if(window.innerWidth<500){
		var height=(width*210)/500;
	}
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
    $.getJSON(api_url+'enterprises/get?callback=?', function(data){
		if(data.status=='success'){
			var enterprise_id=data.data.enterprise.id;
			$.getJSON(api_url+'journeys/list_num_journeys_by_enterprise_year?callback=?', {	
    															enterprise_id:enterprise_id,
																year:year_view}, function(data2){

				if(data2.status=='success'){
					var lista_meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
   					$('#dashboard-graphical').append($('<div style="width:100%;"><table id="rgraph_key" cellspacing="0" cellpadding="0" border="0" style="width:129px;"><tbody><tr><td><div id="legend-color"> </div></td><td><span "="">Carreras / Mes</span></td></tr></tbody></table></div>'));
					lista_tooltip=new Array(12);
            		for (var i=0; i<lista_tooltip.length; i++){
            			lista_tooltip[i] = data2.data[i].toString()+' carreras';
            		}
            		var desp=0;
           			if(window.innerWidth>992){
						desp=50;
           			}else{
           				desp=40;
           			}
					var bar4 = new RGraph.Bar('cvs', data2.data)
                							 .set('labels', lista_meses)
                							 .set('colors', ['#0474be'])
                							 .set('tooltips', lista_tooltip)
                							 .set('chart.gutter.left', desp)
                							 .draw();
                	$('#graphical-wait').hide();

				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data2.response,'warning');
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
	});
}

function loadGraphicalExpensesYear(){
	$('#rgraph_key').remove();
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	RGraph.ObjectRegistry.Clear();
	$('#link-graphical-journeys-year').removeClass('active');
	$('#link-graphical-journeys-month').removeClass('active');
	$('#link-graphical-money-year').addClass('active');
	$('#link-graphical-money-month').removeClass('active');
	var width= $("#dashboard-graphical").width();
	var height=(width*300)/632;
	if(window.innerWidth<500){
		var height=(width*210)/500;
	}
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
    $.getJSON(api_url+'enterprises/get?callback=?', function(data){
		if(data.status=='success'){
			var enterprise_id=data.data.enterprise.id;
			var currency = data.data.enterprise.currency;
			$.getJSON(api_url+'journeys/list_expenses_progress_by_enterprise_year?callback=?', {	
    															enterprise_id:enterprise_id,
																year:year_view}, function(data2){

				if(data2.status=='success'){
					var lista_meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
   					if(currency=='EUR'){
   						currency='Euros'; 
   					}
   					$('#dashboard-graphical').append($('<div style="width:100%;"><table id="rgraph_key" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td><div id="legend-color"> </div></td><td><span "="">'+currency+' / Mes</span></td></tr></tbody></table></div>'));
   					lista_tooltip=new Array(12);
            		for (var i=0; i<lista_tooltip.length; i++){
            			if(data2.data[i]==0){
            				lista_tooltip[i] = data2.data[i].toString()+' '+currency;
            			}else{
            				lista_tooltip[i] = data2.data[i].toFixed(2).toString()+' '+currency;
            			}
            		}
            		var desp=0;
           			if(window.innerWidth>992){
						desp=50;
           			}else{
           				desp=40;
           			}
                	var bar4 = new RGraph.Bar('cvs', data2.data)
                							 .set('labels', lista_meses)
                							 .set('colors', ['#0474be'])
                							 .set('tooltips', lista_tooltip)
                							 .set('chart.gutter.left', desp)
                							 .draw();
                	$('#graphical-wait').hide();
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data2.response,'warning');
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
	});
}

function loadGraphicalJourneysMonth(){
	$('#rgraph_key').remove();
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	RGraph.ObjectRegistry.Clear();
	$('#link-graphical-journeys-year').removeClass('active');
	$('#link-graphical-journeys-month').addClass('active');
	$('#link-graphical-money-year').removeClass('active');
	$('#link-graphical-money-month').removeClass('active');
	var width= $("#dashboard-graphical").width();
	var height=(width*300)/632;
	if(window.innerWidth<500){
		var height=(width*210)/500;
	}
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
    $.getJSON(api_url+'enterprises/get?callback=?', function(data){
		if(data.status=='success'){
			var enterprise_id=data.data.enterprise.id;
			$.getJSON(api_url+'journeys/list_num_journeys_by_enterprise_month?callback=?', {	
    															enterprise_id:enterprise_id,
																month:month_view+1,
																year:year_view}, function(data2){

				if(data2.status=='success'){
					var lista_dias = new Array(data2.data.num_days);
					for (var i=0; i<lista_dias.length; i++){lista_dias[i] = (i+1).toString();}
					$('#dashboard-graphical').append($('<div style="width:100%;"><table id="rgraph_key" cellspacing="0" cellpadding="0" border="0" style="width:129px;"><tbody><tr><td><div id="legend-color"> </div></td><td><span "="">Carreras / Día</span></td></tr></tbody></table></div>'));
					var lista_tooltip = new Array(data2.data.num_days);
            		var lista_data = new Array(data2.data.num_days);
            		if(month_view==current_month && year_view==current_year){
            			for (var i=0; i<lista_tooltip.length; i++){lista_tooltip[i] = data2.data.list_month[i].toString()+' carreras';}
						for (var i=0; i<current_day; i++){lista_data[i] = data2.data.list_month[i];}
					}else{
						for (var i=0; i<lista_tooltip.length; i++){lista_tooltip[i] = data2.data.list_month[i].toString()+' carreras';}
						for (var i=0; i<lista_data.length; i++){lista_data[i] = data2.data.list_month[i];}
					}
					var desp=0;
           			if(window.innerWidth>992){
						desp=50;
           			}else{
           				desp=40;
           			}
					var line = new RGraph.Line('cvs', lista_data)
         									 .set('labels', lista_dias)
                							 .set('tooltips', lista_tooltip)
                							 .set('colors', ['#0474be'])
                							 .set('tickmarks', 'circle')
                							 .set('linewidth', 3)
                							 .set('chart.gutter.left', desp)
                							 .draw();
                	$('#graphical-wait').hide();
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data2.response,'warning');
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
	});
}

function loadGraphicalExpensesMonth(){
	$('#rgraph_key').remove();
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	RGraph.ObjectRegistry.Clear();
    var d = new Date();
	$('#link-graphical-journeys-year').removeClass('active');
	$('#link-graphical-journeys-month').removeClass('active');
	$('#link-graphical-money-year').removeClass('active');
	$('#link-graphical-money-month').addClass('active');
	var width= $("#dashboard-graphical").width();
	var height=(width*300)/632;
	if(window.innerWidth<500){
		var height=(width*210)/500;
	}
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
    $.getJSON(api_url+'enterprises/get?callback=?', function(data){
		if(data.status=='success'){
			var enterprise_id=data.data.enterprise.id;
			var currency = data.data.enterprise.currency;
			$.getJSON(api_url+'journeys/list_expenses_progress_by_enterprise_month?callback=?', {	
    															enterprise_id:enterprise_id,
																month:month_view+1,
																year:year_view}, function(data2){

				if(data2.status=='success'){
					var lista_dias = new Array(data2.data.num_days);
					for (var i=0; i<lista_dias.length; i++){lista_dias[i] = (i+1).toString();}
   					
   					if(currency=='EUR'){
   						currency='Euros'; 
   					}
					$('#dashboard-graphical').append($('<div style="width:100%;"><table id="rgraph_key" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td><div id="legend-color"> </div></td><td><span "="">'+currency+' / Día</span></td></tr></tbody></table></div>'));
   					var lista_tooltip = new Array(data2.data.num_days);
            		var lista_data = new Array(data2.data.num_days);
            		if(month_view==current_month && year_view==current_year){
            			for (var i=0; i<lista_tooltip.length; i++){
            				if(data2.data.list_expenses[i]==0){
            					lista_tooltip[i] = data2.data.list_expenses[i].toString()+' '+currency;
            				}else{
            					lista_tooltip[i] = data2.data.list_expenses[i].toFixed(2).toString()+' '+currency;
            				}
            			}
						for (var i=0; i<current_day; i++){lista_data[i] = data2.data.list_expenses[i];}
					}else{
						for (var i=0; i<lista_tooltip.length; i++){
							if(data2.data.list_expenses[i]==0){
								lista_tooltip[i] = data2.data.list_expenses[i].toString()+' '+currency;
							}else{
								lista_tooltip[i] = data2.data.list_expenses[i].toFixed(2).toString()+' '+currency;
							}
						}
						for (var i=0; i<lista_data.length; i++){lista_data[i] = data2.data.list_expenses[i];}
					}
					var desp=0;
           			if(window.innerWidth>992){
						desp=50;
           			}else{
           				desp=40;
           			}
					var line = new RGraph.Line('cvs', lista_data)
         				.set('labels', lista_dias)
                		.set('tooltips', lista_tooltip)
                		.set('colors', ['#0474be'])
                		.set('tickmarks', 'circle')
                		.set('linewidth', 3)
                		.set('chart.gutter.left', desp)
                		.draw();
                	$('#graphical-wait').hide();
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data2.response,'warning');
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
	});
}

function loadFirstGraphical(month,year){
	$('#row-calendar').attr({'style':'display: all;'});
	$('#rgraph_key').remove();
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	var canvas = $('#cvs');
	RGraph.ObjectRegistry.Clear();
	RGraph.Reset(canvas);
	var string_aux = 'Informe de importes ('+months_complete[month_view]+')';
	$('#link-graphical-money-month').html(string_aux);
	var string_aux = 'Informe de importes ('+year_view+')';
	$('#link-graphical-money-year').html(string_aux);
	var string_aux = 'Informe de carreras ('+months_complete[month_view]+')';
	$('#link-graphical-journeys-month').html(string_aux);
	var string_aux = 'Informe de carreras ('+year_view+')';
	$('#link-graphical-journeys-year').html(string_aux);
	$('#link-graphical-journeys-year').removeClass('active');
	$('#link-graphical-journeys-month').removeClass('active');
	$('#link-graphical-money-year').removeClass('active');
	$('#link-graphical-money-month').addClass('active');
	var width= $("#dashboard-graphical").width();
	var height=(width*300)/632;
	if(window.innerWidth<500){
		var height=(width*300)/500;
	}
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
    $.getJSON(api_url+'enterprises/get?callback=?', function(data){
		if(data.status=='success'){
			var enterprise_id=data.data.enterprise.id;
			var currency = data.data.enterprise.currency;
			$.getJSON(api_url+'journeys/list_expenses_progress_by_enterprise_month?callback=?', {	
    															enterprise_id:enterprise_id,
																month:month_view+1,
																year:year_view}, function(data2){

				if(data2.status=='success'){
					var lista_dias = new Array(data2.data.num_days);
					for (var i=0; i<lista_dias.length; i++){lista_dias[i] = (i+1).toString();}
   					if(currency=='EUR'){
   						currency='Euros'; 
   					}
   					$('#dashboard-graphical').append($('<div style="width:100%;"><table id="rgraph_key" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td><div id="legend-color"> </div></td><td><span "="">'+currency+' / Día</span></td></tr></tbody></table></div>'));
   					var lista_tooltip = new Array(data2.data.num_days);
            		var lista_data = new Array(data2.data.num_days);
            		if(month_view==current_month && year_view==current_year){
            			for (var i=0; i<lista_tooltip.length; i++){
            				if(data2.data.list_expenses[i]==0){
            					lista_tooltip[i] = data2.data.list_expenses[i].toString()+' '+currency;
            				}else{
            					lista_tooltip[i] = data2.data.list_expenses[i].toFixed(2).toString()+' '+currency;
            				}
            			}
						for (var i=0; i<current_day; i++){lista_data[i] = data2.data.list_expenses[i];}
					}else{
						for (var i=0; i<lista_tooltip.length; i++){
							if(data2.data.list_expenses[i]==0){
								lista_tooltip[i] = data2.data.list_expenses[i].toString()+' '+currency;
							}else{
								lista_tooltip[i] = data2.data.list_expenses[i].toFixed(2).toString()+' '+currency;
							}
						}
						for (var i=0; i<lista_data.length; i++){lista_data[i] = data2.data.list_expenses[i];}
					}
					var desp=0;
           			if(window.innerWidth>992){
						desp=50;
           			}else{
           				desp=40;
           			}
					var line = new RGraph.Line('cvs', lista_data)
         				.set('labels', lista_dias)
                		.set('tooltips', lista_tooltip)
                		.set('colors', ['#0474be'])
                		.set('tickmarks', 'circle')
                		.set('linewidth', 3)
                		.set('chart.gutter.left', desp)
                		.draw();

                	$('#graphical-wait').hide();

				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data2.response,'warning');
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
	});
	
}

$( document ).ready(function() {
	$( "#next_year" ).click(function() {
  		if (year_view<current_year){
  			year_view=year_view+1;
  			$('#current_year').html(year_view);
  			selectMonth(month_view);
  		}
	});

	$( "#prev_year" ).click(function() {
  		year_view=year_view-1;
  		$('#current_year').html(year_view);
  		selectMonth(month_view);
	});
});