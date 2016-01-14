function get_content() {
	
    $.when(
    	$.getScript(media_url+'js/aux/date.js'),
        $.ready.promise()
    ).then(function(){
		loadTemplate();
    });
	
}




function loadTemplate() {
	$.post('partials/news_super', function(template, textStatus, xhr) {
		$('#main').html(template);
		$('#new_communication_form').submit(false).submit(function(e){
			new_communication();
			return false;
		});
		loadRoles();
		loadDelegations();
		loadNews();
		
	});
}

function loadRoles() {
	$.getJSON(api_url+'auth/list_roles?callback=?', '', function(data){
		if(data.status=='success'){
			$.each(data.data, function(index, role) {
				$('#new_role').append('<option value="'+role.id+'">'+theroles[role.role]+'</option>');
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al leer roles','warning');
	});
}

function loadDelegations() {
	$.getJSON(api_url+'delegations/list_all?callback=?', '', function(data){
		if(data.status=='success'){
			$('#new_delegation').html('<option value="0">Todas las delegaciones</option>');
			$('#new_radio').html('<option value="0">Todas las radios</option>');
			$.each(data.data.delegations, function(index, delegation) {
				$('#new_delegation').append('<option value="'+delegation.id+'">'+delegation.delegation+'</option>');
			});
			$('#new_delegation').change(function(){
				loadRadios();
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al leer las delegaciones','warning');
	});
}

function loadRadios() {
	var delegation_id = $('#new_delegation').val();
	$.getJSON(api_url+'delegations/list_cities?callback=?', {delegation_id:delegation_id}, function(data){
		if(data.status=='success'){
			$('#new_radio').html('<option value="0">Todas las radios</option>');
			$.each(data.data.cities, function(index, city) {
				$('#new_radio').append('<option value="'+city.id+'">'+city.radio+'</option>');
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al leer las ciudades','warning');
	});
}




function loadNews() {
	$('#new_communication_wrapper').slideUp();
	$('#news_wrapper').empty();
	
	$.getJSON(api_url+'news/list_news_foreign?callback=?', '', function(data){
		if(data.status=='success'){
			$.each(data.data.news, function(index, anew) {
				addItem(anew);
			});
		}
		else super_error('News failure');
	});
}


function addItem(anew) {
	
	var item=$('<div></div>').attr({'class':'item super clearfix','data-id':anew.id}); $('#news_wrapper').append(item);
		
		var labels=$('<div></div>').attr('class','labels pull-right'); item.append(labels);
			
			var label_rol=$('<div></div>').attr('class','label label-default').text('Para: '+theroles[anew.role]); labels.append(label_rol);
			if(anew.radio.length>0) var label_radio=$('<div></div>').attr('class','label label-default').text('De: '+anew.radio); labels.append(label_radio);
			if(anew.delegation.length>0) var label_delegation=$('<div></div>').attr('class','label label-default').text('De: '+anew.delegation); labels.append(label_delegation);
			
			var i=$('<i></i>').attr('class','fa fa-trash-o'); labels.append(i);
			i.click(function(event) {
				delete_new(anew.id);
			});
		
		
		var title=$('<div></div>').attr('class','title').html(anew.title); item.append(title);
		var date=$('<div></div>').attr('class','date').text(fecha_castellano_sin_hora(anew.date)); item.append(date);
		var body=$('<div></div>').attr('class','body').html(anew.body); item.append(body);
		if(anew.link){
			var link=$('<div></div>').attr('class','link'); item.append(link);
			var a=$('<a></a>').attr({'href':anew.link, 'target':'_blank'}).text('Link: '+anew.link); link.append(a);
		}
		
	return false
}

function delete_new(id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar esta comunicación?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'news/delete?callback=?', {id:id}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Comunicación eliminada','');
				loadNews();
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});

	}
}


function show_new() {
	if($('#new_communication_wrapper').css('display')=='none'){
		$('#new_communication_wrapper').slideDown();
	}
	else $('#new_communication_wrapper').slideUp();
}

function new_communication() {
	var role_id=$('#new_role').val();
	var delegation_id=$('#new_delegation').val();
	var radio_id=$('#new_radio').val();
	var title=$('#new_title').val();
	var body=$('#new_body').val();
	var link=$('#new_link').val();
	if (role_id.length>0){
		if (title.length>0 || body.length>0){
			var params = {title:title, body:body, link:link, role_id:role_id};
			if (delegation_id!='0') params['delegation_id']=delegation_id;
			if (radio_id!='0') params['radio_id']=radio_id;
			
			$.getJSON(api_url+'news/add_global_news?callback=?', params, function(data){
				if(data.status=='success'){
					$('#new_title').add('#new_body').add('#new_link').val('');
					loadNews();
					launch_alert('<i class="fa fa-smile-o"></i> Nueva comunicación creada','');
				}
				else launch_alert('<i class="fa fa-frown-o"></i> Error al enviar','warning');
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> O el título o el cuerpo debe estar definido','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes elegir un rol','warning');
}

