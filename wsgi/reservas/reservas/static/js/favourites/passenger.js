function get_content() {
	
	$.post('partials/favourites', function(template, textStatus, xhr) {
		$('#main').html(template);
		
		$.getJSON(api_url+'passengers/list_favourites?callback=?', '', function(data){
			if(data.status=='success'){
				$.each(data.data.favourites, function(index, favourite) {
					addItem(favourite);
				});
			}
			else super_error('Favourites failure');
		});
	});
}


function addItem(favourite) {
	
	var address=favourite.address.split("\n");
	
	if (address[0]!=undefined) var street = address[0];
	else var street = ''
	
	if (address[1]!=undefined) var location = address[1];
	else var location = ''
	
	var item=$('<div></div>').css('margin-bottom','30px').attr({'class':'item col-sm-6 col-md-4','data-id':favourite.id}); $('#favourites_wrapper').append(item);
	
	// item.html('<strong>'+street+'</strong><br>'+location+'<br><small><a href="#" onclick="view_map(this);return false;">Ver mapa</a> | <a href="#" onclick="delete_favourite(this);return false;">Eliminar</a>');
	item.html('<strong>'+street+'</strong><br>'+location+'<br><small><a href="#" onclick="delete_favourite(this);return false;">Eliminar</a>');
	
	return false
}

function delete_favourite(element) {
	var button = $(element);
	var item = button.parent().parent();
	var id = item.attr('data-id');
	if(id!=undefined){
		button.html('<i class="fa fa-cog fa-spin"></i>');
		$.getJSON(api_url+'passengers/del_favourite?callback=?', {id:id}, function(data){
			if(data.status=='success'){
				item.slideUp(function(){
					item.remove();
				});
				launch_alert('<i class="fa fa-smile-o"></i> Eliminado correctamente','')
			}
			else{
				button.html('Eliminar');
				launch_alert('<i class="fa fa-frown-o"></i> No se ha podido eliminar','warning')
			}
		});
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Problema al eliminar','warning')
}

function view_map(element) {
	// body...
}