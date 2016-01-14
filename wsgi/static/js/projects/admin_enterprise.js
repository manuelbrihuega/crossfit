function get_content() {

    $.when(
        $.getScript(media_url+'js/aux/journeys.js'),
        $.getScript(media_url+'js/aux/enterprises.js'),
		$.getScript(media_url+'js/aux/date.js'),
        $.getScript(media_url+'js/aux/modals.js'),
        $.getScript(media_url+'js/lib/sha1.js'),
        $.ready.promise()
    ).then(function(){
		$.post('partials/projects_admin_enterprise', function(template, textStatus, xhr) {
			$('#main').html(template);
			$('#new_project_wrapper').css('display','none');
			active_new_project_form();
			getProjectList();
		});
    });

}


function active_new_project_form() {
	
	$('#new_project_form').submit(false).submit(function(e){
		new_project();
		return false;
	});

	$.getJSON(api_url+'enterprises/list_employees?callback=?', '', function(data){
		if(data.status=='success'){
			$.each(data.data.employees, function(index, employee) {
				$('#new_project_employee').append('<option value="'+employee.id+'">'+employee.name+' '+employee.surname+'</option>');
			});
		}
		else super_error('Delegations failure');
	});
}


function getProjectList() {

	$.getJSON(api_url+'enterprises/get_projects?callback=?', '', function(data){
		if(data.status=='success'){
			$('#projects_accordion').empty();
			$.each(data.data.projects, function(index, project) {
            	addPanel(index,project);
			});
		}
		else super_error('Projects error');
	});
}

function removeProject(id) {

	$.getJSON(api_url+'enterprises/delete_project?callback=?', {id:id}, function(data){
		if(data.status=='success'){
			getProjectList();
		}
		else super_error('No pudo eliminarse el proyecto');
	});
}


function addPanel(index, project) {
	var id=project.id;
	////console.log(country+' '+empresas);
	var panel=$('<div></div>').attr('class','panel panel-default'); $('#projects_accordion').append(panel);
	var heading=$('<div></div>').attr('class','panel-heading'); panel.append(heading);
	var title=$('<h4></h4>').attr('class','panel-title'); heading.append(title);
	var toggle=$('<a></a>').attr({'id':'edit_'+project.id,'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#projects_accordion', 'href':'#project_'+id}).text(project.name); title.append(toggle); title.append('<i onclick="modalAddEmployees('+project.id+');" style="float:right; cursor:pointer;" class="fa fa-plus-square"></i>'); title.append('<i onclick="removeProject('+project.id+');" style="float:right; cursor:pointer; margin-right: 10px;" class="fa fa-trash-o"></i>'); title.append('<i onclick="editProject('+project.id+');" style="float:right; cursor:pointer; margin-right: 10px;" class="fa fa-pencil-square-o"></i>');
	var collapse=$('<div></div>').attr({'class':'panel-collapse collapse','id':'project_'+id}); panel.append(collapse);
	var body=$('<div></div>').attr({'class':'panel-body'}); collapse.append(body);
	var sublista = $('<div></div>').attr({'class':'row sublista'}); body.append(sublista);
	$.each(project.employees, function(index, employee) {
		draw_employee_sm(employee,sublista,project.id);

	});

	return false
}

function editProject(id){
	if($('#edit_'+id).is(':hidden')){
		var name = $('#edit_input_'+id).val();
		$.getJSON(api_url+'enterprises/edit_project?callback=?', {id:id, 
																name_project:name}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Proyecto guardado','');
				$('#edit_input_'+id).remove();
				$('#edit_'+id).val(name);
				$('#edit_'+id).show();
				getProjectList();
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});
	}else{
		var name = $('#edit_'+id).html(); 
		$('#edit_'+id).hide();
		$('#edit_'+id).parent().prepend('<input style="width:50%;" id="edit_input_'+id+'" />');
		$('#edit_input_'+id).val(name);
	}
}

function draw_employee_sm(employee, wrapper, id) {
	
	var sm3 = $('<div></div>').attr({'class':'col-sm-4'}); wrapper.append(sm3);
	var item_class_active = 'active';
	
	var item = $('<div></div>').attr({'class':'item linkable '+item_class_active}); sm3.append(item);
	var title = $('<div></div>').attr({'class':'title'}).text(employee.name+' '+employee.surname+' ('+employee.phone+')'); item.append(title); title.append('<i onclick="desvincularEmpleado('+id+','+employee.id+')" style="float:right;" class="fa fa-minus-square"></i>');
	//var text = $('<div></div>').attr({'class':'text'}).text(radio.city); item.append(text);
}

function desvincularEmpleado(project_id, employee_id){
	$.getJSON(api_url+'enterprises/unlink_employee_project?callback=?', {project_id:project_id, employee_id:employee_id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Empleado desvinculado','');
			getProjectList();
		}
		else super_error('No pudo desvincularse el empleado del proyecto');
	});
}

function show_new() {
	if($('#new_project_wrapper').css('display')=='none'){
		$('#new_project_wrapper').slideDown();
	}
	else $('#new_project_wrapper').slideUp();
}


function new_project() {
	var project_name=$('#new_project_name').val();
	var project_employees=$('#new_project_employee').val();
	var employees = '';
	for(var i=0; i<project_employees.length; i++){
		employees = employees + project_employees[i] + ',';
	}
	var employees = employees.substring(0, employees.length-1);
	if (project_name.length>0){
		$.getJSON(api_url+'enterprises/add_project?callback=?', {project_name:project_name, 
																employees:employees}, function(data){
			if(data.status=='success'){
				show_new();
				launch_alert('<i class="fa fa-smile-o"></i> Proyecto creado','');
				getProjectList();
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un nombre al proyecto','warning');
}

function add_employees(project_id){
	var project_employees=$('#new_add_employees').val();
	var employees = '';
	if(project_employees!=null){
		for(var i=0; i<project_employees.length; i++){
			employees = employees + project_employees[i] + ',';
		}
	}
	var employees = employees.substring(0, employees.length-1);
	if (employees.length>0){
		$.getJSON(api_url+'enterprises/edit_project?callback=?', {id:project_id, 
																employees:employees}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Proyecto guardado','');
				getProjectList();
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Selecciona algún empleado para añadir al proyecto','warning');
}

function modalAddEmployees(project_id) {
	
	var mymodal=newModal('project_add_employees_modal',true, true);
	modalAddTitle(mymodal,'');
	doModalBigger(mymodal);
	modalAddBody(mymodal,'<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	mymodal.modal('show');
	
	
	$.getJSON( api_url+'enterprises/list_employees?callback=?', function(data){
		if(data.status=='success'){
			var body = $('<div></div>').attr({'id':'project_add_employees_details_wrapper'});
			$.post(base_url+'/partials/modal_project_add_employees_detail', function(template, textStatus, xhr) {
				body.html(template);
				modalAddBody(mymodal,body);
				$.each(data.data.employees, function(index, employee) {
					$('#new_add_employees').append('<option value="'+employee.id+'">'+employee.name+' '+employee.surname+'</option>');
				});	


				var footer = $('<div></div>').attr({'id':'operator_details_footer'});
				var group = $('<div></div>').attr({'class':'btn-group'}); footer.append(group);
				var add_employees_button = $('<button></button>').attr({'type':'button','class':'delete_owner btn btn-default'}).text('AÑADIR EMPLEADOS'); group.append(add_employees_button);
				add_employees_button.click(function(){ add_employees(project_id); mymodal.modal('hide'); });
				modalAddFooter(mymodal,footer);
			
			});	
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al obtener datos','warning')
	});
}

