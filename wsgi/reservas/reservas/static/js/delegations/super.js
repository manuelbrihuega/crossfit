function get_content() {
	
	$.getScript('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js', function(){
		$.post('partials/delegations_super', function(template, textStatus, xhr) {
			$('#main').html(template);
			load_delegations();

		});
	});
}


function load_delegations() {
	$.getJSON(api_url+'delegations/list_all?callback=?', '', function(data){
		var wrapper = $('#delegations_list_wrapper');
		if(data.status=='success'){
			wrapper.empty();
			
			$.each(data.data.delegations, function(index,delegation) {
				draw_delegation(delegation);
			});
			
		}
		else super_error('delegations failure');
	});
}

function draw_delegation(delegation) {
	////console.log(delegation);
	var wrapper = $('#delegations_list_wrapper');
	
	var col = $('<div></div>').attr({'class':'col-sm-4'}); wrapper.append(col);
	var item = $('<div></div>').attr({'class':'item'}); col.append(item);
	var number = $('<div></div>').attr({'class':'number'}).text(delegation.country_code); item.append(number);
	var title = $('<div></div>').attr({'class':'title'}).text(delegation.delegation); item.append(title);
	
	item.click(function(){
		window.location=base_url+'/delegation/'+delegation.id;
	})
				
			
}


//NEW DELEGATION

function show_new() {
	if($('#new_delegation_wrapper').css('display')=='none'){
		$('#new_delegation_wrapper').slideDown();
		$('#new_delegation_form').submit(false).submit(function(e){
			new_delegation();
			return false;
		});
	}
	else $('#new_delegation_wrapper').slideUp();
}

function new_delegation() {
	var name=$('#new_delegation_name').val();
	var surname=$('#new_delegation_surname').val();
	var email=$('#new_delegation_email').val();
	var password=$('#new_delegation_password').val();
	var prefix=$('#new_delegation_prefix').val();
	var phone=$('#new_delegation_phone').val();
	var country=$('#new_delegation_country').val();
	var country_code=$('#new_delegation_country_code').val();
	var currency=$('#new_delegation_currency').val();
	var address=$('#new_delegation_address').val();
	var company_name=$('#new_delegation_company_name').val();
	var cif=$('#new_delegation_cif').val();
	var postal_code=$('#new_delegation_postal_code').val();
	var locality=$('#new_delegation_locality').val();
	var tax=$('#new_delegation_tax').val();
	var percent=$('#new_delegation_percent').val();
	
	
	if (name.length>0){
		if(email.length>0){
			if(password.length>4){
		
				$.getJSON(api_url+'delegations/add?callback=?', {	name:name, 
																surname:surname,
																email:email,
																prefix:prefix,
																phone:phone,
																password:password,
																country:country,
																country_code:country_code,
																currency:currency,
																address:address,
																company_name:company_name,
																cif:cif,
																postal_code:postal_code,
																locality:locality,
																tax:tax,
																percent:percent}, function(data){
																
					if(data.status=='success'){
						window.location=base_url+'/delegation/'+data.data.delegation_id;
						launch_alert('<i class="fa fa-smile-o"></i> Delegación creada','');
					}
					else launch_alert('<i class="fa fa-frown-o"></i> '+data.response,'warning');
					//console.log(data);
				});
			}
			else launch_alert('<i class="fa fa-frown-o"></i> La contraseña debe tener al menos 5 caracteres','warning');
		}
		else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un email','warning');
	}
	else launch_alert('<i class="fa fa-frown-o"></i> Debes añadir un nombre','warning');
	
	
}
