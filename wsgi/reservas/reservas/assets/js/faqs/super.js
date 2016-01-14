function get_content() {

    $.when(
        $.getScript(media_url+'js/aux/journeys.js'),
        $.getScript(media_url+'js/aux/enterprises.js'),
		$.getScript(media_url+'js/aux/date.js'),
        $.getScript(media_url+'js/aux/modals.js'),
        $.getScript(media_url+'js/lib/sha1.js'),
        $.getScript('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js')
    ).then(function(){
		$.post('partials/faqs_super', function(template, textStatus, xhr) {
			$('#main').html(template);
			active_new_section_form();
			active_new_faq_form();
			//$('#new_enterprise_wrapper').css('display','none');
			//startSearch();
			//loadPending();
			getFAQList();
			$('.collapse').collapse();
		});
    });

}

function show_new() {
	if($('#new_enterprise_wrapper').css('display')=='none'){
		$('#new_enterprise_wrapper').slideDown();
	}
	else $('#new_enterprise_wrapper').slideUp();
}

var sections_rol=[];
function Section(seccion,role){
	this.seccion=seccion;
	this.role=role;
}

function getFAQList() {

	$.getJSON(api_url+'faqs/list_all?callback=?', '', function(data){
		if(data.status=='success'){

				for(var i=0; i<data.data.sections.length; i++){
					sections_rol.push(new Section(data.data.sections[i].section,data.data.sections[i].role));
				}
				$('#faqs_accordion').empty();
				var agrupadas=_.groupBy(data.data.sections, 'section');
				$.each(agrupadas, function(seccion, preguntas) {
                    var ordenadas = _.sortBy(preguntas,'question');
					addPanel(seccion,ordenadas);
				});
			


		}
		else super_error('FAQS error');
	});
}

function eliminarSeccion(id){
	var confirmacion=confirm('¿Seguro que quieres eliminar la Sección?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'faqs/delete_section?callback=?', {section_id:id}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Sección eliminada','');
				getFAQList();
				updateSections();
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});

	}
}

function addPanel(seccion, preguntas) {
	var sectionarray=seccion.split(" ");
	var section ="";
	for(var i=0; i<sectionarray.length; i++){
		section=section + sectionarray[i]+"_";
	}
	section = section.substring(0, section.length-1);
	for(var y=0; y<sections_rol.length; y++){
		if(sections_rol[y].seccion==seccion){
			var rol ='';
			if(sections_rol[y].role=='U_Passengers'){
				rol = 'Pasajeros';
			}
			if(sections_rol[y].role=='U_Drivers'){
				rol = 'Taxistas';
			}
			if(sections_rol[y].role=='U_Viewer_Radios'){
				rol = 'Operadoras de Radios Tradicionales';
			}
			if(sections_rol[y].role=='U_Admin_Radios'){
				rol = 'Administradores de Radios Tradicionales';
			}
			if(sections_rol[y].role=='U_Buttons'){
				rol = 'Pulsadores';
			}
			if(sections_rol[y].role=='U_Delegations'){
				rol = 'Delegaciones';
			}
			if(sections_rol[y].role=='U_Operators'){
				rol = 'Operadoras de Radios Digitales';
			}
			if(sections_rol[y].role=='U_Supporters'){
				rol = 'Equipo de soporte';
			}
			if(sections_rol[y].role=='U_Admin_Enterprises'){
				rol = 'Administradores de empresas';
			}
			if(sections_rol[y].role=='U_Viewer_Digital_Radios'){
				rol = 'Administradores de Radios Digitales';
			}
			if(sections_rol[y].role=='U_Touroperator'){
				rol = 'Touroperadores';
			}
		}
	}
	////console.log(country+' '+empresas);
	var panel=$('<div></div>').attr('class','panel panel-default'); $('#faqs_accordion').append(panel);

		var heading=$('<div></div>').attr('class','panel-heading'); panel.append(heading);
			var title=$('<h4></h4>').attr('class','panel-title'); heading.append(title);
				var toggle=$('<a></a>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#faqs_accordion', 'href':'#seccion_'+section}).text(seccion+' ('+rol+')'); title.append(toggle); title.append('<i id="eliminadorSeccion" onclick="eliminarSeccion('+preguntas[0].id+');" style="cursor:pointer; float:right;" class="fa fa-trash-o"></i>');

		var collapse=$('<div></div>').attr({'class':'panel-collapse collapse','id':'seccion_'+section}); panel.append(collapse);
			var body=$('<div></div>').attr({'class':'panel-body'}); collapse.append(body);
			var row=$('<div></div>').attr({'class':'row sublista'}); body.append(row);
			draw_faq_sm(preguntas, row);
			//toggle.click(function(){var id=$(toggle).attr('href'); alert(id); $(''+id).removeClass('collapse'); $(id).addClass('in');});
	return false;
}

/*function dibujaListaCiudad(localidad, empresas, destino) {
	var sublista = $('<div></div>').attr({'class':'row sublista', 'data-locality':localidad}); destino.append(sublista);
		var sm12 = $('<div></div>').attr({'class':'col-sm-12 linkable'}); sublista.append(sm12);
			var titular = $('<h4></h4>').attr({'class':'titular'}).text(localidad); sm12.append(titular);

        sm12.click(function(){mostrarSublista(sublista);});

		
}*/

function mostrarSublista(elemento){
    var sublista = $(elemento);

    if (sublista.children.hasClass('collapse')){
        sublista.children.slideDown();
        sublista.removeClass('collapse');
        sublista.addClass('collapsed');
    }

    else{
        sublista.children.slideUp();
        sublista.removeClass('collapsed');
        sublista.addClass('collapse');
    }
}

function draw_faq_sm(preguntas, wrapper) {
	for(var i=0; i<preguntas[0].questions.length; i++){
	var sm3 = $('<div></div>').attr({'class':'col-sm-3 item_row '}); wrapper.append(sm3);
	var id = preguntas[0].questions[i].id;
		var item = $('<div></div>').attr({'class':'item linkable', 'data-id':id}); sm3.append(item);
			var title = $('<div></div>').attr({'class':'title'}).text(preguntas[0].questions[i].question); item.append(title);
			var text = $('<div></div>').attr({'class':'text'}).text(preguntas[0].questions[i].answer); item.append(text);

			item.click(function(){
				modal_faq_details(id);
			})
	}
}

function active_new_section_form() {
	$('#new_section_form').submit(false).submit(function(e){
		new_section();
		return false;
	});
	
	$.getJSON(api_url+'auth/list_roles?callback=?', '', function(data){
		if(data.status=='success'){
			$.each(data.data, function(index, role) {
				var rol ='';
				if(role.role=='U_Passengers'){
					rol = 'Pasajeros';
				}
				if(role.role=='U_Drivers'){
					rol = 'Taxistas';
				}
				if(role.role=='U_Viewer_Radios'){
					rol = 'Operadoras de Radios Tradicionales';
				}
				if(role.role=='U_Admin_Radios'){
					rol = 'Administradores de Radios Tradicionales';
				}
				if(role.role=='U_Buttons'){
					rol = 'Pulsadores';
				}
				if(role.role=='U_Delegations'){
					rol = 'Delegaciones';
				}
				if(role.role=='U_Operators'){
					rol = 'Operadoras de Radios Digitales';
				}
				if(role.role=='U_Supporters'){
					rol = 'Equipo de soporte';
				}
				if(role.role=='U_Admin_Enterprises'){
					rol = 'Administradores de empresas';
				}
				if(role.role=='U_Viewer_Digital_Radios'){
					rol = 'Administradores de Radios Digitales';
				}
				if(role.role=='U_Touroperator'){
					rol = 'Touroperadores';
				}
				$('#new_section_role').append('<option value="'+role.id+'">'+rol+'</option>');
			});
		}
		else super_error('Delegations failure');
	});
}

function updateSections(){
	$('#new_faq_section').html('');
	$.getJSON(api_url+'faqs/list_sections?callback=?', '', function(data){
		if(data.status=='success'){
			$.each(data.data.sections, function(index, section) {
				$('#new_faq_section').append('<option value="'+section.id+'">'+section.section+'</option>');
			});
		}
		else super_error('Delegations failure');
	});
}

function new_section() {
	var section_name=$('#new_section_name').val();
	var role_id=$('#new_section_role').val();
	
	if (section_name.length>0){
		$.getJSON(api_url+'faqs/add_section?callback=?', {section_name:section_name, 
															role_id:role_id}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Sección creada','');
				updateSections();
				getFAQList();
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un nombre a la sección','warning');
}

function active_new_faq_form() {
	$('#new_faq_form').submit(false).submit(function(e){
		new_faq();
		return false;
	});
	
	$.getJSON(api_url+'faqs/list_sections?callback=?', '', function(data){
		if(data.status=='success'){
			$.each(data.data.sections, function(index, section) {
				$('#new_faq_section').append('<option value="'+section.id+'">'+section.section+'</option>');
			});
		}
		else super_error('Delegations failure');
	});
}

function new_faq() {
	var section_id=$('#new_faq_section').val();
	var question=$('#new_faq_question').val();
	var answer=$('#new_faq_response').val();

	if (question.length>0){
		if (answer.length>0){
			if (section_id.length>0){
				$.getJSON(api_url+'faqs/add_faq?callback=?', {section_id:section_id, 
																	question:question,
																	answer:answer}, function(data){
					if(data.status=='success'){
						launch_alert('<i class="fa fa-smile-o"></i> FAQ creada','');
						getFAQList();
					}
					else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
				});
			}
			else launch_alert('<i class="fa fa-frown-o"></i> Debes seleccionar una sección','warning');
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una respuesta','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una pregunta','warning');
}