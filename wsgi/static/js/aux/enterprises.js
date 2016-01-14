function draw_enterprise_sm(empresa, wrapper, oculto) {
    if (empresa.country == 'Sin delegación') oculto = '';
	var sm3 = $('<div></div>').attr({'class':'col-sm-3 item_row '+oculto}); wrapper.append(sm3);
		var item = $('<div></div>').attr({'class':'item linkable', 'data-id':empresa.id}); sm3.append(item);
			var title = $('<div></div>').attr({'class':'title'}).text(empresa.name); item.append(title);
			var text = $('<div></div>').attr({'class':'text'}).text(empresa.address); item.append(text);

			item.click(function(){
				modal_enterprise_details(empresa.id);
			})
}


function activate_enterprise(enterprise_id) {
	$.getJSON(api_url+'enterprises/activate?callback=?',{id:enterprise_id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Empresa activada','');
			var footer = $('.modal-footer').find('.inactive');
			footer.removeClass('inactive').addClass('active');
			if ( typeof loadPending == 'function' ) { loadPending(); 	}
			if ( typeof update_pending_enterprises_badge == 'function' ) { update_pending_enterprises_badge(); 	}
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al activar','warning');
	});
}

function deactivate_enterprise(enterprise_id) {
	$.getJSON(api_url+'enterprises/deactivate?callback=?',{id:enterprise_id}, function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Empresa desactivada','');
			var footer = $('.modal-footer').find('.inactive');
			footer.removeClass('active').addClass('inactive');
			if ( typeof loadPending == 'function' ) { loadPending(); 	}
			if ( typeof update_pending_enterprises_badge == 'function' ) { update_pending_enterprises_badge(); 	}
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Error al desactivar','warning');
	});
}

function delete_enterprise(enterprise_id) {
	var confirmacion=confirm('¿Seguro que quieres eliminar la empresa?');
	if (confirmacion==true)
	{
		$.getJSON(api_url+'enterprises/delete?callback=?', {enterprise_id:enterprise_id}, function(data){
			if(data.status=='success'){
				launch_alert('<i class="fa fa-smile-o"></i> Empresa eliminada','');
				$('#enterprise_details_modal').modal('hide');
				if ( typeof getEnterprisesList == 'function' ){
					$('#enterprises_accordion').empty(); 
					getEnterprisesList();
				}
			}
			else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		});

	}
}

function new_admin_enterprise(enterprise_id) {
	var name=$('#new_enterprise_admin_name').val();
	var surname=$('#new_enterprise_admin_surname').val();
	var email=$('#new_enterprise_admin_email').val();
	var pass=$('#new_enterprise_admin_pass').val();
	var prefix=$('#new_enterprise_admin_prefix').val();
	var phone=$('#new_enterprise_admin_phone').val();
	if (name.length>0){
		if (email.length>0){
			if (pass.length>0){
				$('#new_enterprise_admin_submit').html('<i class="fa fa-cog fa-spin"></i>');
				$.getJSON(api_url+'enterprises/add_admin_enterprise?callback=?', {	enterprise_id:enterprise_id,
																	name:name,
																	surname:surname,
																	email:email,
																	prefix:prefix,
																	phone:phone,
																	password:pass}, function(data){

					if(data.status=='success'){
						launch_alert('<i class="fa fa-smile-o"></i> Administrador creado','');
						$('#enterprise_details_modal').modal('hide');
						setTimeout(function(){
							modal_enterprise_details(enterprise_id);
						},1400);

					}
					else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
				});
			}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir una contraseña','warning');
		}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el email','warning');
	}else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir el nombre','warning');
}


