months=['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
months_complete=['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
var current_year = (new Date).getFullYear();
var current_month = (new Date).getMonth();
var current_day = (new Date).getDate();
var month_view = current_month;
var year_view = current_year;
var idglobal = 0;
function get_content() {
    $.when(
    	$.getScript(media_url+'js/aux/date.js'),
        $.ready.promise()
    ).then(function(){
		
		$.post(base_url+'/partials/employees_admin_enterprise', function(template, textStatus, xhr) {
			$('#main').html(template);
			employees_list();
		});
		
		
		
	});
	

}


function employees_list() {
	$.getJSON(api_url+'enterprises/list_employees?callback=?', function(data){
		if(data.status=='success'){
			var wrapper = $('#employees_list');
			if(data.data.employees.length>0){
				wrapper.empty();
				
				
				
				var table_wrapper=$('<div></div>').attr('class','table-responsive'); wrapper.append(table_wrapper);
					var table=$('<table></table>').attr('class','table'); table_wrapper.append(table);
						var thead=$('<thead></thead>'); table.append(thead);
							var tr=$('<tr></tr>'); thead.append(tr);
								var th=$('<th></th>').text('Nombre'); tr.append(th);
								var th=$('<th></th>').text('Apellidos'); tr.append(th);
								var th=$('<th></th>').text('Email'); tr.append(th);
								var th=$('<th></th>').text('Teléfono'); tr.append(th);
								var th=$('<th></th>').text('Código'); tr.append(th);
								var th=$('<th></th>').text(''); tr.append(th);

						var tbody=$('<tbody></tbody>'); table.append(tbody);
						
						$.each(data.data.employees, function(index, employee) {
							
							if(employee.corporate_code.length==4) var clase = 'active';
							else var clase = 'inactive';
							
							var tr=$('<tr></tr>').attr({'class':clase, 'data-id':employee.id}); tbody.append(tr);
									var td=$('<td id="name'+employee.id+'"></td>').text(employee.name); tr.append(td);
									var td=$('<td id="surname'+employee.id+'"></td>').text(employee.surname); tr.append(td);
									var td=$('<td id="email'+employee.id+'"></td>').text(employee.email); tr.append(td);
									var td=$('<td id="phone'+employee.id+'"></td>').text(employee.phone); tr.append(td);
									var td=$('<td></td>').text(employee.corporate_code); tr.append(td);
									var td=$('<td></td>').attr({'class':'botonera'}); tr.append(td);
									
									

									var edit_btn = $('<span></span>').attr({'class':'button edit', 'title':'Editar empleado'}).html('<i class="fa fa-pencil-square-o fa-fw"></i>'); td.append(edit_btn);
									edit_btn.click(function(){ edit_employee(employee.id, this); });

									var unlink_btn = $('<span></span>').attr({'class':'button unlink', 'title':'Desvincular empleado'}).html('<i class="fa fa-trash-o fa-fw"></i>'); td.append(unlink_btn);
									unlink_btn.click(function(){ unlink_employee(employee.id, this); });

									if(clase=='active'){
										var sendpin_btn = $('<span></span>').attr({'class':'button sendpin', 'title':'Enviar PIN'}).html('<i class="fa fa-paper-plane-o fa-fw"></i>'); td.append(sendpin_btn);
										sendpin_btn.click(function(){ sendpin_employee(employee.id, this); });
									}

									var stadistics_btn = $('<span></span>').attr({'class':'button stadistics', 'title':'Estadísticas'}).html('<i class="fa fa-bar-chart-o fa-fw"></i>'); td.append(stadistics_btn);
									stadistics_btn.click(function(){ stadistics_employee(employee.auth_id, this); });
									

									var authorize_btn = $('<span></span>').attr({'class':'button authorize', 'title':'Autorizar'}).html('<i class="fa fa-unlock fa-fw"></i>'); td.append(authorize_btn);
									authorize_btn.click(function(){ authorize_employee(employee.id, this); });

									var ban_btn = $('<span></span>').attr({'class':'button ban', 'title':'Desautorizar'}).html('<i class="fa fa-ban fa-fw"></i>'); td.append(ban_btn);
									ban_btn.click(function(){ ban_employee(employee.id, this); });
										
									var project_btn = $('<span></span>').attr({'class':'button project', 'title':'Proyectos'}).html('<i class="fa fa-sitemap fa-fw"></i>'); td.append(project_btn);
									project_btn.click(function(){ modal_projects(employee.id, this); });
									$.getScript(media_url+'js/aux/modals.js', function(){
										$.getScript(media_url+'js/aux/journeys.js', function(){
											var historical_btn = $('<span></span>').attr({'class':'button project', 'title':'Histórico'}).html('<i class="fa fa-h-square fa-fw"></i>'); td.append(historical_btn);
											historical_btn.click(function(){ modal_passenger_details_enterprise(employee.id, this); });
										});
									});
									
						});
				
			}
			
			else wrapper.empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-frown-o"></i></div><div class="text">Sin empleados.</div></div>');
	
			
		}
		else super_error('Locations failure');
	});
}

function modal_projects(id,element){
	idglobal=id;
	$(element).html('<i id="wait-projects" class="fa fa-cog fa-spin"></i>');
	$.getScript(media_url+'js/aux/date.js');
	 $.getScript(media_url+'js/aux/modals.js', function(){
		var mymodal=newModal('projects_modal',true, true);
    	modalAddTitle(mymodal,'Proyectos a los que está vinculado');
    		doModalBigger(mymodal);
    		$('.modal-dialog').css('width','600px');
    		template=$('<div></div>');
    		$.getJSON(api_url+'enterprises/get_projects_employee?callback=?', {	
																	id:id}, function(data){
				if(data.status=='success'){
					$(element).html('<i class="fa fa-sitemap fa-fw"></i>');
					for(var i=0; i<data.data.projects.length; i++){
						template.append('<span>'+data.data.projects[i].name+'</span><br>');	
					}
				}
				else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});
			modalAddBody(mymodal,template);
			mymodal.modal('show');
			
		});
	
}

function edit_employee(id,element){
	if($('#name'+id).hasClass('editactive')){
		$('#name'+id).removeClass('editactive');
		var name=$('#nameemployee').val();
		var surname=$('#surnameemployee').val();
		var email=$('#emailemployee').val();
		var phone=$('#phoneemployee').val();
		$('#name'+id).html('');
		$('#name'+id).text(name);
		$('#surname'+id).html('');
		$('#surname'+id).text(surname);
		$('#email'+id).html('');
		$('#email'+id).text(email);
		$('#phone'+id).html('');
		$('#phone'+id).text(phone);
		$.getJSON(api_url+'enterprises/edit_employee?callback=?', {	
																	id:id,
																	name:name,
																	surname:surname,
																	email:email,
																	phone:phone}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Empleado editado','');
				$(element).html('<i class="fa fa-pencil-square-o fa-fw"></i>');
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});
	}else{
		$(element).html('<i class="fa fa-floppy-o fa-fw"></i>');
		$('#name'+id).addClass('editactive');
		var name=$('#name'+id).html();
		var surname=$('#surname'+id).html();
		var email=$('#email'+id).html();
		var phone=$('#phone'+id).html();
		$('#name'+id).html('<input style="width:100%; height: 19px;" type="text" name="nameemployee" id="nameemployee">');
		$('#nameemployee').val(name);
		$('#surname'+id).html('<input style="width:100%; height: 19px;" type="text" name="surnameemployee" id="surnameemployee">');
		$('#surnameemployee').val(surname);
		$('#email'+id).html('<input style="width:100%; height: 19px;" type="email" name="emailemployee" id="emailemployee">');
		$('#emailemployee').val(email);
		$('#phone'+id).html('<input style="width:100%; height: 19px;" type="text" name="phoneemployee" id="phoneemployee">');
		$('#phoneemployee').val(phone);
	}
}

function show_new_employee() {
	if($('#new_employee_wrapper').css('display')=='none'){
		$('#new_employee_wrapper').slideDown();
		$('#new_employee').submit(false).submit(function(e){
			new_employee();
			return false;
		});
	}
	else $('#new_employee_wrapper').slideUp();
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

function new_employee() {
	var name=$('#new_employee_name').val();
	var surname=$('#new_employee_surname').val();
	var email=$('#new_employee_email').val();
	var pass="";
	var prefix="";
	var phone=$('#new_employee_phone').val();
	$.getJSON(api_url+'auth/get?callback=?', function(data){
		if(data.status=='success'){
			prefix=data.data.auth_profile.prefix;
			pass=passwordgenerate(8);
			if (name.length>0 || true){
				if (email.length>0){
					if (pass.length>0 || true){
						$('#new_employee_submit').html('<i class="fa fa-cog fa-spin"></i>');
						$.getJSON(api_url+'enterprises/add_employee?callback=?', {	
																			name:name,
																			surname:surname,
																			email:email,
																			prefix:prefix,
																			phone:phone,
																			password:pass}, function(data){
																		
							if(data.status=='success'){
								employees_list();
								launch_alert('<i class="fa fa-smile-o"></i> Empleado añadido','');
							}
							else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
							$('#new_employee_submit').html('Guardar');
						});
					}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una contraseña','warning');
				}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
			}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
		}
	});
}


function unlink_employee(id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar empleado?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'enterprises/unlink_employee?callback=?', {id:id}, function(data){
			if(data.status=='success') launch_alert('<i class="fa fa-smile-o"></i> Empleado eliminado','');
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			employees_list();
		});
		
	}
}

function authorize_employee(id, element) {
	$(element).html('<i class="fa fa-cog fa-spin"></i>');
	$.getJSON(api_url+'enterprises/set_corporate_code?callback=?', {id:id}, function(data){
		if(data.status=='success'){ 
			launch_alert('<i class="fa fa-smile-o"></i> Empleado autorizado','');
			$.getJSON(api_url+'enterprises/send_corporate_code?callback=?', {passenger_id:id}, function(data){
				if(data.status=='success'){ 
					launch_alert('<i class="fa fa-smile-o"></i> Empleado autorizado y PIN enviado satisfactoriamente','');
				}else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			});	
		}else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		employees_list();
	});	
}

function sendpin_employee(id, element){
	$(element).html('<i id="wait-send" class="fa fa-cog fa-spin"></i>');
	$.getJSON(api_url+'enterprises/send_corporate_code?callback=?', {passenger_id:id}, function(data){
		if(data.status=='success'){ 
			launch_alert('<i class="fa fa-smile-o"></i> PIN enviado satisfactoriamente','');
		}else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		$(element).html('<i class="fa fa-paper-plane-o fa-fw"></i>');
	});	
	
}


function stadistics_employee(id, element){
	idglobal=id;
	$(element).html('<i id="wait-stadistics" class="fa fa-cog fa-spin"></i>');
	
	$.post('partials/modal_employees_stadistics', function(template, textStatus, xhr) {
		$.getScript(media_url+'js/aux/date.js');
	 	$.getScript(media_url+'js/aux/modals.js', function(){
			var mymodal=newModal('employee_stadistics_modal',true, true);
    		mymodal.attr('data-employee-auth-id',id);
    		modalAddTitle(mymodal,'');
    		doModalBigger(mymodal);
			modalAddBody(mymodal,template);
			mymodal.modal('show');
			$('#current_year').html('<i class="fa fa-cog fa-spin"></i>');
	 		$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
			$('#current_year').html(year_view);
			$('#employee_stadistics_modal > .modal-dialog > .modal-content').attr({'style': 'height: 100%;'});
			selectMonthEmployee(month_view);
			$(element).html('<i class="fa fa-bar-chart-o fa-fw"></i>');
		});
	});
}

function selectMonthEmployee(month){

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
	loadFirstGraphicalEmployee(month_view,year_view);
}

function loadGraphicalJourneysYearEmployee(){
	$('#rgraph_key').remove();
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	RGraph.ObjectRegistry.Clear();
	$('#link-graphical-journeys-year').addClass('active');
	$('#link-graphical-journeys-month').removeClass('active');
	$('#link-graphical-money-year').removeClass('active');
	$('#link-graphical-money-month').removeClass('active');
	var width= $("#dashboard-graphical").width();
	var height=(width*300)/632;
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
    $.getJSON(api_url+'enterprises/get?callback=?', function(data){
		if(data.status=='success'){
			var enterprise_id=data.data.enterprise.id;
			$.getJSON(api_url+'journeys/list_num_journeys_by_employee_year?callback=?', {	
    															enterprise_id:enterprise_id,
    															employee_auth_id:idglobal,
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
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
	});
}

function loadGraphicalExpensesYearEmployee(){
	$('#rgraph_key').remove();
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	RGraph.ObjectRegistry.Clear();
	$('#link-graphical-journeys-year').removeClass('active');
	$('#link-graphical-journeys-month').removeClass('active');
	$('#link-graphical-money-year').addClass('active');
	$('#link-graphical-money-month').removeClass('active');
	var width= $("#dashboard-graphical").width();
	var height=(width*300)/632;
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
    $.getJSON(api_url+'enterprises/get?callback=?', function(data){
		if(data.status=='success'){
			var enterprise_id=data.data.enterprise.id;
			var currency = data.data.enterprise.currency;
			$.getJSON(api_url+'journeys/list_expenses_progress_by_employee_year?callback=?', {	
    															enterprise_id:enterprise_id,
    															employee_auth_id:idglobal,
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

function loadGraphicalJourneysMonthEmployee(){
	$('#rgraph_key').remove();
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	RGraph.ObjectRegistry.Clear();
	$('#link-graphical-journeys-year').removeClass('active');
	$('#link-graphical-journeys-month').addClass('active');
	$('#link-graphical-money-year').removeClass('active');
	$('#link-graphical-money-month').removeClass('active');
	var width= $("#dashboard-graphical").width();
	var height=(width*300)/632;
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
    $.getJSON(api_url+'enterprises/get?callback=?', function(data){
		if(data.status=='success'){
			var enterprise_id=data.data.enterprise.id;
			$.getJSON(api_url+'journeys/list_num_journeys_by_employee_month?callback=?', {	
    															enterprise_id:enterprise_id,
    															employee_auth_id:idglobal,
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

function loadGraphicalExpensesMonthEmployee(){
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
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
    $.getJSON(api_url+'enterprises/get?callback=?', function(data){
		if(data.status=='success'){
			var enterprise_id=data.data.enterprise.id;
			var currency = data.data.enterprise.currency;
			$.getJSON(api_url+'journeys/list_expenses_progress_by_employee_month?callback=?', {	
    															enterprise_id:enterprise_id,
    															employee_auth_id:idglobal,
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

function loadFirstGraphicalEmployee(month,year){
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
	var width= 514;
	var height=(width*300)/632;
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
    $.getJSON(api_url+'enterprises/get?callback=?', function(data){
		if(data.status=='success'){
			var enterprise_id=data.data.enterprise.id;
			var currency = data.data.enterprise.currency;
			$.getJSON(api_url+'journeys/list_expenses_progress_by_employee_month?callback=?', {	
    															enterprise_id:enterprise_id,
    															employee_auth_id:idglobal,
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

function ban_employee(id, element) {
	$(element).html('<i class="fa fa-cog fa-spin"></i>');
	$.getJSON(api_url+'enterprises/ban_employee?callback=?', {id:id}, function(data){
		if(data.status=='success') {
			launch_alert('<i class="fa fa-smile-o"></i> Empleado desautorizado','');
		}else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		employees_list();
	});	
}

