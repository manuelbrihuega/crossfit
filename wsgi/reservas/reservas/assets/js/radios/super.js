function get_content() {
	
    $.when(
    	$.getScript(media_url+'js/aux/radios.js'),
    	$.getScript('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js'),
        $.ready.promise()
    ).then(function(){
		$.post('partials/radios_super', function(template, textStatus, xhr) {
			$('#main').html(template);
			load_delegations();
			load_radios();
			startSearch();
		});
    });

}


function startSearch() {
	var input = $('#radios_search');
	input.focus();
	input.bind({
		keypress: function(e) {
			var code = e.keyCode || e.which;
			if(code == 13) searchRadios();
		}
	});
	
}


function searchRadios() {
	$('h1.page-header i').show();
	var string = $('#radios_search').val();
	var wrapper = $('#result_radios');
	wrapper.empty();
	$.getJSON(api_url+'radios/search?callback=?', {lookup:string}, function(data){
		if(data.status=='success'){
			if(data.data.length>0){
				$.each(data.data, function(index, radio) {
					draw_radio_sm(radio,wrapper);
				});
			}
			else launch_alert('<i class="fa fa-frown-o"></i> No se han encontrado radios','warning');
			
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
		$('h1.page-header i').hide();
	});
}





function load_delegations() {
	$.getJSON(api_url+'delegations/list_all?callback=?', '', function(data){
		if(data.status=='success'){
			$.each(data.data.delegations, function(index, delegation) {
				$('#new_radio_delegation').append('<option value="'+delegation.id+'">'+delegation.delegation+'</option>');
			});
		}
		else super_error('Delegations failure');
	});
}

function load_radios() {
	$.getJSON(api_url+'radios/list_all?callback=?', '', function(data){
		if(data.status=='success'){
			var ordenados=_.groupBy(data.data, 'country');
			$.each(ordenados, function(pais, radios) {
				addPanel(pais,radios);
			});
			
		}
		else super_error('Radios failure');
	});
}

function addPanel(pais, radios) {
	var country=pais.replace(' ','_');
	var panel=$('<div></div>').attr('class','panel panel-default'); $('#radios_accordion').append(panel);

		var heading=$('<div></div>').attr('class','panel-heading'); panel.append(heading);
			var title=$('<h4></h4>').attr('class','panel-title'); heading.append(title);
				var toggle=$('<a></a>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#radios_accordion', 'href':'#pais_'+country}).text(pais); title.append(toggle);
		
		var collapse=$('<div></div>').attr({'class':'panel-collapse collapse','id':'pais_'+country}); panel.append(collapse);
			var body=$('<div></div>').attr({'class':'panel-body'}); collapse.append(body);
				var row=$('<div></div>').attr({'class':'row sublista'}); body.append(row);
			
			$.each(radios, function(index, radio) {
				draw_radio_sm(radio,row);
				
			});
			
	return false
}



function show_new() {
	if($('#new_radio_wrapper').css('display')=='none'){
		$('#new_radio_wrapper').slideDown();
		$('#new_radio_form').submit(false).submit(function(e){
			new_radio();
			return false;
		});
	}
	else $('#new_radio_wrapper').slideUp();
}

function digital_changes() {
	if($('#new_radio_digital').prop('checked')){
		$('#new_radio_cif').hide();
		$('#new_radio_phone').hide();
	}else{
		$('#new_radio_cif').show();
		$('#new_radio_phone').show();
	}
}

function new_radio() {
	var name=$('#new_radio_name').val();
	var registered_name=$('#new_radio_registered_name').val();
	var cif=$('#new_radio_cif').val();
	var prefix='';
	var phone=$('#new_radio_phone').val();
	var email=$('#new_radio_email').val();
	var delegation_id=$('#new_radio_delegation').val();
	var address=$('#new_radio_address').val();
	var city=$('#new_radio_city').val();
	var num_taxis=$('#new_radio_num_taxis').val();
	var num_passengers=$('#new_radio_num_passengers').val();
	
	if($('#new_radio_digital').prop('checked')) var digital=1;
	else var digital=0;
	
	if (name.length>0){
		if(registered_name.length>0){
			$.getJSON(api_url+'delegations/get_foreign?callback=?', {id:delegation_id}, function(datos){											
				if(datos.status=='success'){
					prefix = datos.data.delegation_profile.prefix;

				}
				$.getJSON(api_url+'radios/add?callback=?', {	name:name, 
																registered_name:registered_name,
																cif:cif,
																prefix:prefix,
																phone:phone,
																email:email,
																delegation_id:delegation_id,
																address:address,
																city:city,
																num_taxis:num_taxis,
																num_passengers:num_passengers,
																digital:digital}, function(data){
																	
					if(data.status=='success'){
						window.location=base_url+'/radio/'+data.data.radio_id;
						launch_alert('<i class="fa fa-smile-o"></i> Radios creada','');
					}
					else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
				});
			});
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir la razón social','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un nombre','warning');
	
	
}
