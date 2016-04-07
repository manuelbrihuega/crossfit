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
		$( "#clientes" ).click(function() {
			$('#grupos').slideUp();
  			$('#usuarios').slideDown();
		});
		$( "#grupos" ).click(function() {
  			$('#usuarios').slideUp();
  			$('#grupos').slideDown();
  		});
		loadNews();
		
	});
}




function loadNews() {
	$('#new_communication_wrapper').slideUp();
	$('#news_wrapper').empty();
	$.getJSON(api_url+'customers/search?callback=?', {lookup:'*',filtro:'todos',order:'nombreDESC'}, function(data){
		if(data.status=='success'){
			var cad = '<option value="0">TODOS</option>';
			$.each(data.data.list, function(index, cus) {
				cad = cad + '<option value="'+cus.id+'">'+cus.name+' '+cus.surname+'</option>';
			});
			$('#new_destiner').html(cad);
		}
		else super_error('Customers failure');
	});
	$.getJSON(api_url+'schedules/list_all_tabla?callback=?', {}, function(data){
		if(data.status=='success'){
			var cad = '';
			$.each(data.data.actividades, function(index, act) {
				var diasemana = '';
				if(act.dayweek=="0"){
					diasemana = 'Lunes';
				}
				if(act.dayweek=="1"){
					diasemana = 'Martes';
				}
				if(act.dayweek=="2"){
					diasemana = 'Miércoles';
				}
				if(act.dayweek=="3"){
					diasemana = 'Jueves';
				}
				if(act.dayweek=="4"){
					diasemana = 'Viernes';
				}
				if(act.dayweek=="5"){
					diasemana = 'Sábado';
				}
				cad = cad + '<option value="'+act.id+'">Grupo '+act.name+' '+diasemana+' '+act.day+'/'+act.month+'/'+act.year+' ('+act.time_start.split(':')[0]+':'+act.time_start.split(':')[1]+' - '+act.time_end.split(':')[0]+':'+act.time_end.split(':')[1]+')'+'</option>';
			});
			$('#new_destiner_dos').html(cad);
		}
		else super_error('Customers failure');
	});
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
			
			
		
			var i=$('<i></i>').attr('class','fa fa-trash-o'); labels.append(i);
			i.click(function(event) {
				delete_new(anew.id);
			});
		
		
		var title=$('<div></div>').attr('class','title').html(anew.title); item.append(title);
		if (anew.name){
			var date=$('<div></div>').attr('class','date').text(fecha_castellano_sin_hora(anew.date)+' | Destinatario: '+anew.name); item.append(date);
		}else{
			var date=$('<div></div>').attr('class','date').text(fecha_castellano_sin_hora(anew.date)); item.append(date);
		}
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
	var title=$('#new_title').val();
	var body=$('#new_body').val();
	var link=$('#new_link').val();
	var destiner=$('#new_destiner').val();
		if (title.length>0 || body.length>0){
			var params = {title:title, body:body, link:link, destiner:destiner};
			$('#botonnuevacom').html('<i class="fa fa-cog fa-spin"></i>');
			$.getJSON(api_url+'news/add_global_news?callback=?', params, function(data){
				if(data.status=='success'){
					$('#new_title').add('#new_body').add('#new_link').val('');
					loadNews();
					launch_alert('<i class="fa fa-smile-o"></i> Nueva comunicación creada','');
					$('#botonnuevacom').html('ENVIAR');
				}
				else{ launch_alert('<i class="fa fa-frown-o"></i> Error al enviar','warning'); $('#botonnuevacom').html('ENVIAR');}
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> O el título o el cuerpo debe estar definido','warning');
}

