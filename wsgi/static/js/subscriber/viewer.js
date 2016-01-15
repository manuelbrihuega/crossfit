months=['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
months_complete=['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
var current_year_b = (new Date).getFullYear();
var current_day_b = (new Date).getDate();
var current_month_b = (new Date).getMonth();
var month_view = current_month_b;
var year_view = current_year_b;
function get_content() {
	$.getScript(media_url+'js/aux/date.js', function(){
		$.getScript(media_url+'js/aux/journeys.js', function(){
			$.post(base_url+'/partials/subscriber_service', function(template, textStatus, xhr) {
				$('#main').html(template);
				$('#current_year').html('<i class="fa fa-cog fa-spin"></i>');
	 			$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
				$('#current_year').html(year_view);
				selectMonth(month_view);
			});
		});
	});
}

function addPanel(group) {
	
	var month=months_api[parseInt(group.month)];
	
	
	var panel=$('<div></div>').attr('class','panel panel-default'); $('#subscriber_accordion').append(panel);
	
		var heading=$('<div></div>').attr('class','panel-heading'); panel.append(heading);
			var title=$('<h4></h4>').attr('class','panel-title'); heading.append(title);
				var toggle=$('<a></a>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#subscriber_accordion', 'href':'#group_'+group.year+'_'+group.month}).text('Tickets '+month+' '+group.year); title.append(toggle); 
		        var print_btn = $('<span></span>').attr({'class':'btn', 'title':'Imprimir', 'id':'table-to-print', 'onclick':'print();', 'style':'padding: 0px;'}).html('<i class="fa fa-print fa-fw"></i>'); title.append(print_btn);

	
		var collapse=$('<div></div>').attr({'class':'panel-collapse collapse in','id':'group_'+group.year+'_'+group.month}); panel.append(collapse);
			var body=$('<div></div>').attr({'class':'panel-body journeys_wrapper'}); collapse.append(body);
			
			$.getJSON(api_url+'radios/journeys_corporate_by_month?callback=?', {month:group.month, year:group.year, offset:local_offset}, function(data){
				if(data.status=='success'){
					
					if(data.data.length>0){
						
						var table_wrapper=$('<div></div>').attr('class','table-responsive'); body.append(table_wrapper);
							var table=$('<table></table>').attr('class','table tableSorter'); table_wrapper.append(table);
								var thead=$('<thead></thead>'); table.append(thead);
									var tr=$('<tr></tr>'); thead.append(tr);
										var th=$('<th>Fecha</th>'); tr.append(th);
										var th=$('<th></th>').text('Empresa'); tr.append(th);
										var th=$('<th></th>').text('Dirección'); tr.append(th);
										//var th=$('<th></th>').text('Duración'); tr.append(th);
										var th=$('<th data-sortBy="numeric"></th>').text('Precio'); tr.append(th);
		
								var tbody=$('<tbody ></tbody>'); table.append(tbody);
								
								$.each(data.data, function(index, journey) {
									
									var tr=$('<tr></tr>').attr({'class':journey.status, 'data-id':journey.id}); tbody.append(tr);
											var td=$('<td></td>').text(journey.date_depart); tr.append(td);
											var td=$('<td></td>').text(journey.corporate); tr.append(td);
											var td=$('<td></td>').text(journey.origin); tr.append(td);
											//var td=$('<td></td>').text(duration_to_string(journey.duration)); tr.append(td);
											var td=$('<td data-sortAs="'+journey.pricenum+'"></td>').text(journey.price + ' '+ journey.currency); tr.append(td);
											
											
									
								});
							table.tableSort();
					}
		
		//collapse.removeClass('in');		
				
				}
			});
	return false
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
	$('#subscriber_accordion').html('');
	$.getJSON(api_url+'radios/count_corporate_by_months?callback=?', '', function(data){
		if(data.status=='success'){
			if(data.data.length>0){
				$.each(data.data, function(index, group) {
					if(group.month==month_view+1 && group.year==year_view){
						addPanel(group);
					}
				});
				$('#container-graphical-system').attr({'style':'display:all;'});
				loadFirstGraphical(month_view,year_view);
			}else{
				$('#container-graphical-system').html('');
				$('#subscriber_accordion').append($('<div class="panel panel-default"><div class="panel-heading panel-heading-invoice"><h4 class="panel-title"><span class="accordion-toggle" data-toggle="collapse" data-parent="#invoicing_accordion">No existen servicios abonados</span></h4></div></div>'));
			}	
		}
		else super_error('Subscriber services failure');
	});
}

function loadFirstGraphical(month,year){
	$('#row-calendar-subscriber').attr({'style':'display: all;'});
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
	var height=(width*210)/632;
	if(window.innerWidth<650){
		var height=(width*210)/500;
	}
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
    $.getJSON(api_url+'radios/get?callback=?', function(data){
		if(data.status=='success'){
			var currency = data.data.currency;
			$.getJSON(api_url+'radios/list_income_corporate_by_month?callback=?', {	
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
            		if(month_view==current_month_b && year_view==current_year_b){
            			for (var i=0; i<lista_tooltip.length; i++){
            				if(data2.data.list_incomes[i]==0){
            					lista_tooltip[i] = data2.data.list_incomes[i].toString()+' '+currency;
            				}else{
            					lista_tooltip[i] = data2.data.list_incomes[i].toFixed(2).toString()+' '+currency;
            				}
            			}
						for (var i=0; i<current_day_b; i++){lista_data[i] = data2.data.list_incomes[i];}
					}else{
						for (var i=0; i<lista_tooltip.length; i++){
							if(data2.data.list_incomes[i]==0){
								lista_tooltip[i] = data2.data.list_incomes[i].toString()+' '+currency;
							}else{
								lista_tooltip[i] = data2.data.list_incomes[i].toFixed(2).toString()+' '+currency;
							}
						}
						for (var i=0; i<lista_data.length; i++){lista_data[i] = data2.data.list_incomes[i];}
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
                		.set('colors', ['#075a8f'])
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

function loadGraphicalJourneysYear(){
	$('#rgraph_key').remove();
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	RGraph.ObjectRegistry.Clear();
	$('#link-graphical-journeys-year').addClass('active');
	$('#link-graphical-journeys-month').removeClass('active');
	$('#link-graphical-money-year').removeClass('active');
	$('#link-graphical-money-month').removeClass('active');
	var width= $("#dashboard-graphical").width();
	var height=(width*210)/632;
	if(window.innerWidth<650){
		var height=(width*210)/500;
	}
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
	$.getJSON(api_url+'radios/list_journeys_corporate_by_year?callback=?', {	
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
                							 .set('colors', ['#075a8f'])
                							 .set('tooltips', lista_tooltip)
                							 .set('chart.gutter.left', desp)
                							 .draw();
            $('#graphical-wait').hide();

		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data2.response,'warning');
	});
}

function loadGraphicalIncomesYear(){
	$('#rgraph_key').remove();
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	RGraph.ObjectRegistry.Clear();
	$('#link-graphical-journeys-year').removeClass('active');
	$('#link-graphical-journeys-month').removeClass('active');
	$('#link-graphical-money-year').addClass('active');
	$('#link-graphical-money-month').removeClass('active');
	var width= $("#dashboard-graphical").width();
	var height=(width*210)/632;
	if(window.innerWidth<650){
		var height=(width*210)/500;
	}
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
    $.getJSON(api_url+'radios/get?callback=?', function(data){
		if(data.status=='success'){
			var currency = data.data.currency;
			$.getJSON(api_url+'radios/list_income_corporate_by_year?callback=?', {	
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
                							 .set('colors', ['#075a8f'])
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
	var height=(width*210)/632;
	if(window.innerWidth<650){
		var height=(width*210)/500;
	}
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
	$.getJSON(api_url+'radios/list_journeys_corporate_by_month?callback=?', {	
    															month:month_view+1,
																year:year_view}, function(data2){

		if(data2.status=='success'){
			var lista_dias = new Array(data2.data.num_days);
			for (var i=0; i<lista_dias.length; i++){lista_dias[i] = (i+1).toString();}
			$('#dashboard-graphical').append($('<div style="width:100%;"><table id="rgraph_key" cellspacing="0" cellpadding="0" border="0" style="width:129px;"><tbody><tr><td><div id="legend-color"> </div></td><td><span "="">Carreras / Día</span></td></tr></tbody></table></div>'));
			var lista_tooltip = new Array(data2.data.num_days);
            var lista_data = new Array(data2.data.num_days);
            if(month_view==current_month_b && year_view==current_year_b){
            	for (var i=0; i<lista_tooltip.length; i++){lista_tooltip[i] = data2.data.list_month[i].toString()+' carreras';}
				for (var i=0; i<current_day_b; i++){lista_data[i] = data2.data.list_month[i];}
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
                							 .set('colors', ['#075a8f'])
                							 .set('tickmarks', 'circle')
                							 .set('linewidth', 3)
                							 .set('chart.gutter.left', desp)
                							 .draw();
            $('#graphical-wait').hide();
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data2.response,'warning');
	});
}

function loadGraphicalIncomesMonth(){
	$('#rgraph_key').remove();
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	RGraph.ObjectRegistry.Clear();
    var d = new Date();
	$('#link-graphical-journeys-year').removeClass('active');
	$('#link-graphical-journeys-month').removeClass('active');
	$('#link-graphical-money-year').removeClass('active');
	$('#link-graphical-money-month').addClass('active');
	var width= $("#dashboard-graphical").width();
	var height=(width*210)/632;
	if(window.innerWidth<650){
		var height=(width*210)/500;
	}
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
    $.getJSON(api_url+'radios/get?callback=?', function(data){
		if(data.status=='success'){
			var currency = data.data.currency;
			$.getJSON(api_url+'radios/list_income_corporate_by_month?callback=?', {	
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
            		if(month_view==current_month_b && year_view==current_year_b){

            			for (var i=0; i<lista_tooltip.length; i++){
            				if(data2.data.list_incomes[i]==0){
            					lista_tooltip[i] = data2.data.list_incomes[i].toString()+' '+currency;
            				}else{
            					lista_tooltip[i] = data2.data.list_incomes[i].toFixed(2).toString()+' '+currency;
            				}
            			}
						for (var i=0; i<current_day_b; i++){lista_data[i] = data2.data.list_incomes[i];}
					}else{
						for (var i=0; i<lista_tooltip.length; i++){
							if(data2.data.list_incomes[i]==0){
								lista_tooltip[i] = data2.data.list_incomes[i].toString()+' '+currency;
							}else{
								lista_tooltip[i] = data2.data.list_incomes[i].toFixed(2).toString()+' '+currency;
							}
						}
						for (var i=0; i<lista_data.length; i++){lista_data[i] = data2.data.list_incomes[i];}
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
                		.set('colors', ['#075a8f'])
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

function print(){
	console.log("print");
	$("#subscriber_accordion").printArea();
}

function next_year(){
	if (year_view<current_year_b){
  		year_view=year_view+1;
  		$('#current_year').html(year_view);
  		selectMonth(month_view);
  	}
}

function prev_year(){
	year_view=year_view-1;
  	$('#current_year').html(year_view);
  	selectMonth(month_view);
}