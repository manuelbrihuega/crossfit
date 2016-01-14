function District(id,name,zone){
  this.id = id;
  this.name = name;
  this.zone = zone;
}

var districts = [];

function get_content() {
	
	$.getScript(media_url+'js/aux/date.js');
	$.getScript(media_url+'js/aux/modals.js');
	
	$.post('partials/tariff_delegation', function(template, textStatus, xhr) {
	 	$('#main').html(template);
	 	list_radios_with_tariff = [];
	 	$.getJSON(api_url+'radios/list_with_tariff?callback=?', '', function(data){
			if(data.status=='success'){
				if(data.data.radios.length>0){
					for(var i=0; i<data.data.radios.length; i++){
						
						if(data.data.radios[i].active_tariff){
							var panel=$('<div></div>').attr('class','panel panel-default panel-invoicing-delegation'); 
						}else{
							var panel=$('<div></div>').attr('class','panel panel-default panel-invoicing-delegation disactive-panel'); 
						}
						$('#accordion').append(panel);
						
						if(data.data.radios[i].active_tariff){
							var heading=$('<div></div>').attr('class','panel-heading panel-heading-tariff'); 
						}else{
							var heading=$('<div></div>').attr('class','panel-heading panel-heading-tariff disactive'); 
						}
						panel.append(heading);
						var botonera = $('<div></div>').attr({'class':'botonera col-md-2'});
						var tariff_btn = $('<span></span>').attr({'class':'button tariff', 'title':'Añadir tarifa','onclick':'show_add_tariff('+data.data.radios[i].id+');'}).html('<i class="fa fa-plus-circle fa-lg"></i>'); botonera.append(tariff_btn);
						
						var district_btn = $('<span></span>').attr({'class':'button district', 'title':'Añadir distrito-zona','onclick':'add_district('+data.data.radios[i].id+');'}).html('<i class="fa fa-globe fa-lg"></i>'); botonera.append(district_btn);
						var excel_btn = $('<span></span>').attr({'class':'button excel', 'title':'Cargar archivo con tarifario','onclick':'show_load_excel('+data.data.radios[i].id+');'}).html('<i class="fa fa-upload fa-lg"></i>'); botonera.append(excel_btn);

						
						if(data.data.radios[i].active_tariff){
							var disactive_btn = $('<span></span>').attr({'class':'button disactivebtn', 'title':'Desactivar tarifario','onclick':'disactive_tariff('+data.data.radios[i].id+');'}).html('<i class="fa fa-power-off fa-lg"></i>'); botonera.append(disactive_btn);
						}else{
							var active_btn = $('<span></span>').attr({'class':'button active', 'title':'Activar tarifario','onclick':'active_tariff('+data.data.radios[i].id+');'}).html('<i class="fa fa-lightbulb-o fa-lg"></i>'); botonera.append(active_btn);
						}


						var remove_btn = $('<span></span>').attr({'class':'button remove', 'title':'Eliminar tarifario', 'onclick':'remove_radiotariff('+data.data.radios[i].id+');'}).html('<i class="fa fa-times fa-lg"></i>'); botonera.append(remove_btn);
						
						var title=$('<h4></h4>').attr('class','panel-title'); 
						var div_title=$('<div></div>').attr('class','col-md-10 no-padding-left');
						div_title.append(title);
						heading.append(div_title);
						heading.append(botonera);
						var idcollapse = data.data.radios[i].id+'_delegation_div';
						var toggle=$('<a></a>').attr({'href':'#'+idcollapse,'data-toggle':'collapse', 'data-parent':'#accordion'}).text(data.data.radios[i].name); 
						title.append(toggle);
						var collapse=$('<div></div>').attr({'class':'panel-collapse collapse in', 'id':idcollapse}); 				
						panel.append(collapse);
						list_radios_with_tariff.push(data.data.radios[i].id);
					}

					for(var y=0; y<list_radios_with_tariff.length; y++){
						write_tariff_table(list_radios_with_tariff[y]);
					}


				}else{
					var div=$('<div></div>').attr('id','no-invoicing-delegation').html('No existen radios con tarifario'); 
					$('#accordion').append(div);
				}
			}else{
				super_error('Data failure');
			}
		});
	});
}

function write_tariff_table(id){

	$.getJSON(api_url+'tariff/get_by_radio?callback=?&radio_id='+id, '', function(data2){
		if(data2.status=='success'){
			if(data2.data.tariffs.length>0){

				var idcollapse = id+'_delegation_div';
				var table_wrapper=$('<div></div>').attr({'class':'table-responsive col-md-12 table-responsive-tariff'}); $('#'+idcollapse).html(table_wrapper);
				var table=$('<table></table>').attr('class','table  table-condensed'); table_wrapper.append(table);
				var thead=$('<thead></thead>'); table.append(thead);
				var tr=$('<tr></tr>'); thead.append(tr);
				var th=$('<th style="width: 39%;"></th>').text('Origen'); tr.append(th);
				var th=$('<th style="width: 40%;"></th>').text('Destino'); tr.append(th);
				var th=$('<th style="width: 15%;"></th>').text('Tarifa'); tr.append(th);
				var th=$('<th></th>').text('Eliminar'); tr.append(th);
				var tbody=$('<tbody></tbody>'); table.append(tbody);
				for(var j=0; j<data2.data.tariffs.length; j++){
					var tr=$('<tr></tr>').attr({'data-id':data2.data.tariffs[j].id}); tbody.append(tr);
					var td=$('<td></td>').text(data2.data.tariffs[j].origin); tr.append(td);
					var td=$('<td></td>').text(data2.data.tariffs[j].target); tr.append(td);
					var td=$('<td></td>').text(data2.data.tariffs[j].price); tr.append(td);
					var remove_btn = $('<span></span>').attr({'class':'button remove-tariff', 'title':'Eliminar tarifa', 'onclick':'remove_tariff('+data2.data.tariffs[j].id+');'}).html('<i class="fa fa-times fa-lg"></i>');
					var td=$('<td style="text-align: center;"></td>').append(remove_btn); tr.append(td);
				}	
			}
		}
	});
}

function show_new_tariff(){
	$.post('partials/modal_new_radiotariff', function(template, textStatus, xhr) {

		var mymodal=newModal('new_radiotariff_modal',true, true);
    	//mymodal.attr('data-employee-auth-id',id);
    	modalAddTitle(mymodal,'Añadir tarifario');
		modalAddBody(mymodal,template);
		$.getJSON(api_url+'radios/list_without_tariff?callback=?', '', function(data){
			if(data.status=='success'){
				if(data.data.radios.length>0){
					for(var i=0; i<data.data.radios.length; i++){
						$('#radios_without_tariff').append(new Option(data.data.radios[i].name, data.data.radios[i].id, false, true));
					}
					mymodal.modal('show');
				}else{
					$('#radios_without_tariff').hide();
					$('#label-radio').html('No existen radios sin tarifario');
					$('#save-new-radiotariff-modal').hide();
					mymodal.modal('show');
				}
			}else{
				super_error('Data failure');
			}
		});

		
	});
}

function show_load_excel(id){
	$.post('partials/modal_load_excel', function(template, textStatus, xhr) {

		var mymodal=newModal('view_load_excel_modal',true, true);
    	//mymodal.attr('data-employee-auth-id',id);
    	modalAddTitle(mymodal,'Cargar archivo');
		modalAddBody(mymodal,template);
		$('#load-excel-modal').attr({'onclick':'load_excel('+id+');'});
		$('#radio_id').val(id);
		mymodal.modal('show');
	});
}

function load_excel(id){
	$('#file-content').hide();
	$('#label-origin').hide();
	$('#wait-content').show();
	$('#load-excel-modal').hide();
	if($('#excel').val()==''){
		launch_alert('<i class="fa fa-frown-o"></i> '+'No ha seleccionado ningún archivo','warning');
		$('#file-content').show();
		$('#label-origin').show();
		$('#load-excel-modal').show();
		$('#wait-content').hide();
	}else{
		var ext = $('#excel').val().split('.').pop().toLowerCase();
		if($.inArray(ext, ['xls','xlsx']) == -1) {
	    	launch_alert('<i class="fa fa-frown-o"></i> '+'Archivo no válido','warning');
	    	$('#file-content').show();
			$('#label-origin').show();
			$('#load-excel-modal').show();
			$('#wait-content').hide();
		}else{
			var form=$('#excel_form');
	     	var radio_id=$('#radio_id').val();
	     	var file=$('#excel').val();

	        form.submit(function()
	        {

	            var formObj = $(this);
	            var formURL = formObj.attr("action");
	            var formData = new FormData(this);
	            $.ajax({
	                url: formURL,
	                type: 'POST',
	                data:  formData,
	                mimeType:"multipart/form-data",
	                contentType: false,
	                cache: false,
	                processData:false,
	            success: function(data, textStatus, jqXHR)
	            {
	                if(file=="" || $.parseJSON(data).status=='success'){
	                    
	                    $.getJSON(api_url+'tariff/load_from_file?callback=?&radio_id='+radio_id, '', function(data){
							if(data.status=='success'){
								launch_alert('Datos enviados correctamente');
								$('#view_load_excel_modal').modal('hide');
								get_content();
							}else{
								launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
								$('#file-content').show();
								$('#label-origin').show();
								$('#load-excel-modal').show();
								$('#wait-content').hide();
							}
						});
	                }else{
	                    launch_alert($.parseJSON(data).response,'warning');
	                    $('#file-content').show();
						$('#label-origin').show();
						$('#load-excel-modal').show();
						$('#wait-content').hide();
	                }


	            },
	             error: function(jqXHR, textStatus, errorThrown)
	             {
	             	$('#file-content').show();
					$('#label-origin').show();
					$('#load-excel-modal').show();
					$('#wait-content').hide();
	             }
	            });
	            return false;
	        });
	        form.submit();
		}
	}
}

function save_new_radiotariff(){
	var id_selected = $('#radios_without_tariff').val();
	if(id_selected==-1){
		super_error('No radio selected');
	}else{
		$.getJSON(api_url+'radios/add_tariff?callback=?&radio_id='+id_selected, '', function(data){
			if(data.status=='success'){
				$('#new_radiotariff_modal').modal('hide');
				get_content();
			}else{
				alert("[ERROR] No radio selected");
			}
		});
	}
}

function remove_radiotariff(id){
	$.getJSON(api_url+'radios/remove_tariff?callback=?&radio_id='+id, '', function(data){
		if(data.status=='success'){
			$.getJSON(api_url+'tariff/remove_all_by_radio?callback=?&radio_id='+id, '', function(data){
				if(data.status=='success'){
					launch_alert('<i class="fa fa-smile-o"></i> Tarifario eliminado','');
					get_content();
				}else{
					launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');	
				}
			});
		}else{
			super_error('Data failure');
		}
	});
}

function remove_tariff(id){
	$.getJSON(api_url+'tariff/remove?callback=?&tariff_id='+id, '', function(data){
		if(data.status=='success'){
			get_content();
		}else{
			super_error('Data failure');
		}
	});
}

function add_district(id){
	$.post('partials/modal_new_district', function(template, textStatus, xhr) {

		var mymodal=newModal('new_district_modal',true, true);
    	//mymodal.attr('data-employee-auth-id',id);
    	modalAddTitle(mymodal,'Añadir Distrito - Zona');
		modalAddBody(mymodal,template);
		$('#save_district_btn').attr({'onclick':'save_district('+id+')'});
		load_districts(id);
		mymodal.modal('show');
	
	});
}

function save_district(id){
	var district = $('#district').val();
	var zone = $('#zone').val();
	if(district!='' && zone!=''){
		$.getJSON(api_url+'districts/add?callback=?&district_name='+district+'&district_zone='+zone+'&radio_id='+id, '', function(data){
			if(data.status=='success'){
				load_districts(id);
				launch_alert('<i class="fa fa-smile-o"></i> Datos guardados','');
			}else{
				launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
			}
		});
	}
}

function load_districts(id){
	
	$.getJSON(api_url+'districts/get_by_radio?callback=?&radio_id='+id, '', function(data){
		if(data.status=='success'){
			if(data.data.districts.length>0){
				var table_wrapper=$('<div></div>').attr('class','table-responsive'); $('#district-exist').html(table_wrapper);
				var table=$('<table></table>').attr('class','table  table-condensed'); table_wrapper.append(table);
				var thead=$('<thead></thead>'); table.append(thead);
				var tr=$('<tr></tr>'); thead.append(tr);
				var th=$('<th style="width: 45%;"></th>').text('Distrito'); tr.append(th);
				var th=$('<th style="width: 45%;"></th>').text('Zona'); tr.append(th);
				var th=$('<th></th>').text('Eliminar'); tr.append(th);
				var tbody=$('<tbody></tbody>'); table.append(tbody);
				for(var i=0; i<data.data.districts.length; i++){
					var tr=$('<tr></tr>').attr({'data-id':data.data.districts[i].id}); tbody.append(tr);
					var td=$('<td></td>').text(data.data.districts[i].name); tr.append(td);
					var td=$('<td></td>').text(data.data.districts[i].zone); tr.append(td);
					var remove_btn = $('<span></span>').attr({'class':'button remove-district', 'title':'Eliminar distrito', 'onclick':'remove_district('+data.data.districts[i].id+','+id+');'}).html('<i class="fa fa-times fa-lg"></i>');

					var td=$('<td style="text-align: center;"></td>').append(remove_btn); tr.append(td);
				}
			}else{
				$('#district-exist').html('<p style="text-align:center;">No existen distritos en esta radio</p>');
			}
		}else{
			launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		}
	});							
								
}

function remove_district(id, id_radio){
	$.getJSON(api_url+'districts/remove?callback=?&district_id='+id, '', function(data){
		if(data.status=='success'){
			load_districts(id_radio);
		}else{
			launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		}
	});	
}

function show_add_tariff(id){
	$.post('partials/modal_add_radiotariff', function(template, textStatus, xhr) {

		var mymodal=newModal('add_radiotariff_modal',true, true);
    	//mymodal.attr('data-employee-auth-id',id);
    	modalAddTitle(mymodal,'Añadir tarifa');
		modalAddBody(mymodal,template);
		$('#save-add-radiotariff-modal').attr({'onclick':'save_add_radiotariff('+id+');'});
		$.getJSON(api_url+'districts/get_by_radio?callback=?&radio_id='+id, '', function(data){
			if(data.status=='success'){
				if(data.data.districts.length>0){
					var map = {};
					var list_dist = [];
					for(var i=0; i<data.data.districts.length; i++){
						if(!exist_in_set(data.data.districts[i].name,list_dist)){
							list_dist.push(data.data.districts[i].name);
						}
						var dist = new District(data.data.districts[i].id,data.data.districts[i].name,data.data.districts[i].zone);
						districts.push(dist);
					}
					for(var j=0; j<list_dist.length; j++){
						$('#origin_district').append(new Option(list_dist[j], list_dist[j], false, false));
						$('#target_district').append(new Option(list_dist[j], list_dist[j], false, false));
					}
					for(var z=0; z<districts.length; z++){
						if(districts[z].name==list_dist[0]){
							$('#origin_zone').append(new Option(districts[z].zone, districts[z].id, false, false));
							$('#target_zone').append(new Option(districts[z].zone, districts[z].id, false, false));
						}
					}
					mymodal.modal('show');
				}else{
					$('#origin_district').hide();
					$('#origin_zone').hide();
					$('#target_district').hide();
					$('#target_zone').hide();
					$('#label-origin').html('No existen distritos en esta radio');
					$('#label-origin').attr({'style':'width:100%; text-align:center; position:absolute; font-size:19px; top:26px;'});
					$('#label-target').html('');
					$('#label-tariff').html('');
					$('#selects-target').html('');
					$('#tariff').hide();
					$('#save-add-radiotariff-modal').hide();
					mymodal.modal('show');
				}
			}else{
				super_error('Data failure');
			}
		});

		
	});
}	

function save_add_radiotariff(id){
	var id_origin = $('#origin_zone').val();
	var id_target = $('#target_zone').val();
	var tariff = $('#tariff').val();
	if(tariff==''){tariff=0;}
	$.getJSON(api_url+'tariff/add?callback=?&radio_id='+id+'&origin_district='+id_origin+'&target_district='+id_target+'&price='+tariff, '', function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Datos guardados','');
			$('#add_radiotariff_modal').modal('hide');
			get_content();
		}else{
			launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		}
	});
}	

function active_tariff(id){
	$.getJSON(api_url+'radios/activate_tariff?callback=?&radio_id='+id, '', function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Tarifario activado','');
			get_content();
		}else{
			launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		}
	});	
}

function disactive_tariff(id){
	$.getJSON(api_url+'radios/deactivate_tariff?callback=?&radio_id='+id, '', function(data){
		if(data.status=='success'){
			launch_alert('<i class="fa fa-smile-o"></i> Tarifario desactivado','');
			get_content();
		}else{
			launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		}
	});	
}

function change_district_origin(){
	document.getElementById("origin_zone").options.length = 0;
	for(var z=0; z<districts.length; z++){
		if(districts[z].name==$('#origin_district').val()){
			$('#origin_zone').append(new Option(districts[z].zone, districts[z].id, false, false));
		}
	}
}

function change_district_target(){
	document.getElementById("target_zone").options.length = 0;
	for(var z=0; z<districts.length; z++){
		if(districts[z].name==$('#target_district').val()){
			$('#target_zone').append(new Option(districts[z].zone, districts[z].id, false, false));
		}
	}
}

function exist_in_set(obj, set){
	for(var i=0; i<set.length; i++){
		if(set[i]==obj){
			return true;
		}
	}
	return false;
}
