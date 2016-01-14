months=['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
var current_year = (new Date).getFullYear();
var current_month = (new Date).getMonth();
var month_view = current_month;
var year_view = current_year;
function get_content() {
	$.post('partials/invoicing_delegation', function(template, textStatus, xhr) {
		$('#main').html(template);
		if(month_view==1){
			year_view=year_view-1;
			month_view=12;
		}else{
			month_view=month_view-1;
		}
		$('#current_year').html(year_view);
		selectMonth(month_view);
	});
}

function selectMonth(month){
	$('#accordion_wait').show();
	$('#accordion_wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	month_view=month;
	for(var i=0; i<months.length; i++){
		$('#'+months[i]).removeClass('month-selected');
	}
	$('#'+months[month_view]).addClass('month-selected');
	$('#'+months[month_view]).focus();
	loadInvoices(month_view, year_view);
}

function drawDigitalRadio(data){
	var radio_name = data.radio_name;
	var delegation_id = data.delegation;
	var idcollapse = '#invoices_delegation_div'
	for(var j=0; j<data.invoices.length; j++){
		console.log(idcollapse);
		var owner_name = data.invoices[j].owner_name_complete;
		var num_invoice = data.invoices[j].num_invoice_complete;
		var url = data.invoices[j].url_pdf;
		var price = data.invoices[j].amount + ' ' + data.currency_delgation;
		var panel_body=$('<div></div>').attr('class','panel panel-default'); 
		$(idcollapse).show();
		$(idcollapse).append(panel_body);
		var heading_body=$('<div></div>').attr('class','panel-heading panel-heading-invoice panel-heading-invoicing-delegation'); 
		panel_body.append(heading_body);
		var div_h4=$('<div></div>').attr('class','responsive-title margin_yes col-md-9');
		var title_body=$('<h4></h4>').attr('class','panel-title'); 
		div_h4.append(title_body);
		heading_body.append(div_h4);
		var toggle_body=$('<span></span>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#'+idcollapse+'_body'}).text(owner_name+' - '+num_invoice+' - '+price); 
		title_body.append(toggle_body);
		var button_div_body=$('<div></div>').attr({'class':'responsive-button col-md-2'})
		var location_body = "location.href=\""+url+"\"";
		var button_body=$('<button></button>').attr({'onclick':location_body, 'type':'button', 'class':'responsive-btn btn btn-default'}).text('Descargar en PDF');
		button_div_body.append(button_body);
		heading_body.append(button_div_body);
	}
}

function drawDigitalEnterprise(data){
	var enterprise_name = data.enterprise_name;
	var delegation_id = data.delegation;
	var idcollapse = '#invoices_delegation_div';
	for(var j=0; j<data.invoices.length; j++){
		var num_invoice = data.invoices[j].num_invoice_complete;
		var url = data.invoices[j].url_pdf;
		var price = data.invoices[j].amount + ' ' + data.currency_delgation;
		var panel_body=$('<div></div>').attr('class','panel panel-default'); 
		$(idcollapse).show();
		$(idcollapse).append(panel_body);
		var heading_body=$('<div></div>').attr('class','panel-heading panel-heading-invoice panel-heading-invoicing-delegation'); 
		panel_body.append(heading_body);
		var div_h4=$('<div></div>').attr('class','responsive-title margin_yes col-md-9');
		var title_body=$('<h4></h4>').attr('class','panel-title'); 
		div_h4.append(title_body);
		heading_body.append(div_h4);
		var toggle_body=$('<span></span>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#'+idcollapse+'_body'}).text(enterprise_name+' - '+num_invoice+' - '+price); 
		title_body.append(toggle_body);
		var button_div_body=$('<div></div>').attr({'class':'responsive-button col-md-2'})
		var location_body = "location.href=\""+url+"\"";
		var button_body=$('<button></button>').attr({'onclick':location_body, 'type':'button', 'class':'responsive-btn btn btn-default'}).text('Descargar en PDF');
		button_div_body.append(button_body);
		heading_body.append(button_div_body);
	}
}

function drawTraditionalRadio(data){
	var radio_name = data.radio_name;
	var radio_id = data.radio_id;
	var delegation_id = data.delegation;
	var idcollapse = '#invoices_delegation_div';
	for(var j=0; j<data.invoices.length; j++){
		var num_invoice = data.invoices[0].num_invoice_complete;
		var url = data.invoices[0].url_pdf;
		var price = data.invoices[0].amount + ' ' + data.currency_delgation;
		var panel_body=$('<div></div>').attr('class','panel panel-default'); 
		$(idcollapse).show();
		$(idcollapse).append(panel_body);
		var heading_body=$('<div></div>').attr('class','panel-heading panel-heading-invoice panel-heading-invoicing-delegation'); 
		panel_body.append(heading_body);
		var div_h4=$('<div></div>').attr('class','responsive-title margin_yes col-md-9');
		var title_body=$('<h4></h4>').attr('class','panel-title'); 
		div_h4.append(title_body);
		heading_body.append(div_h4);
		var toggle_body=$('<span></span>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#'+idcollapse+'_body'}).text(radio_name+' - '+num_invoice+' - '+price); 
		title_body.append(toggle_body);
		var button_div_body=$('<div></div>').attr({'class':'responsive-button col-md-2'})
		var location_body = "location.href=\""+url+"\"";
		var button_body=$('<button></button>').attr({'onclick':location_body, 'type':'button', 'class':'responsive-btn btn btn-default'}).text('Descargar en PDF');
		button_div_body.append(button_body);
		heading_body.append(button_div_body);
	}
}

function drawDigitalRadioAuto(data){
	var radio_name = data.radio_name;
	var delegation_id = data.delegation;
	var idcollapse = '#autoinvoices_delegation_div';
	for(var j=0; j<data.autoinvoices.length; j++){
		var owner_name = data.autoinvoices[j].owner_name_complete;
		var num_invoice = data.autoinvoices[j].num_invoice_complete;
		var url = data.autoinvoices[j].url_pdf;
		var price = data.autoinvoices[j].amount + ' ' + data.currency_delgation;
		var panel_body=$('<div></div>').attr('class','panel panel-default'); 
		$(idcollapse).show();
		$(idcollapse).append(panel_body);
		var heading_body=$('<div></div>').attr('class','panel-heading panel-heading-invoice panel-heading-invoicing-delegation'); 
		panel_body.append(heading_body);
		var div_h4=$('<div></div>').attr('class','responsive-title margin_yes col-md-9');
		var title_body=$('<h4></h4>').attr('class','panel-title'); 
		div_h4.append(title_body);
		heading_body.append(div_h4);
		var toggle_body=$('<span></span>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#'+idcollapse+'_body'}).text(owner_name+' - '+num_invoice+' - '+price); 
		title_body.append(toggle_body);
		var button_div_body=$('<div></div>').attr({'class':'responsive-button col-md-2'})
		var location_body = "location.href=\""+url+"\"";
		var button_body=$('<button></button>').attr({'onclick':location_body, 'type':'button', 'class':'responsive-btn btn btn-default'}).text('Descargar en PDF');
		button_div_body.append(button_body);
		heading_body.append(button_div_body);
	}
}

function drawTraditionalRadioAuto(data){
	var radio_name = data.radio_name;
	var delegation_id = data.delegation;
	var idcollapse = '#autoinvoices_delegation_div';
	for(var j=0; j<data.autoinvoices.length; j++){
		var num_invoice = data.autoinvoices[j].num_invoice_complete;
		var url = data.autoinvoices[j].url_pdf;
		var price = data.autoinvoices[j].amount + ' ' + data.currency_delgation;
		var panel_body=$('<div></div>').attr('class','panel panel-default'); 
		$(idcollapse).show();
		$(idcollapse).append(panel_body);
		var heading_body=$('<div></div>').attr('class','panel-heading panel-heading-invoice panel-heading-invoicing-delegation'); 
		panel_body.append(heading_body);
		var div_h4=$('<div></div>').attr('class','responsive-title margin_yes col-md-9');
		var title_body=$('<h4></h4>').attr('class','panel-title'); 
		div_h4.append(title_body);
		heading_body.append(div_h4);
		var toggle_body=$('<span></span>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#'+idcollapse+'_body'}).text(radio_name+' - '+num_invoice+' - '+price); 
		title_body.append(toggle_body);
		var button_div_body=$('<div></div>').attr({'class':'responsive-button col-md-2'})
		var location_body = "location.href=\""+url+"\"";
		var button_body=$('<button></button>').attr({'onclick':location_body, 'type':'button', 'class':'responsive-btn btn btn-default'}).text('Descargar en PDF');
		button_div_body.append(button_body);
		heading_body.append(button_div_body);
	}
}

function loadInvoices(month, year){
	$('#accordion').html('');
	month=month+1;
	$.getJSON(api_url+'invoices/list_by_delegation?callback=?&month='+month+'&year='+year, '', function(data){
		if(data.status=='success'){
			var panel=$('<div></div>').attr('class','panel panel-default panel-invoicing-delegation'); 
			$('#accordion').append(panel);
			var heading=$('<div></div>').attr('class','panel-heading'); 
			panel.append(heading);
			var title=$('<h4></h4>').attr('class','panel-title'); 
			heading.append(title);
			var idcollapse = 'invoices_delegation_div';
			var toggle=$('<a></a>').attr({'href':'#'+idcollapse,'data-toggle':'collapse', 'data-parent':'#accordion'}).text('Facturas Taxible Servicios'); 
			title.append(toggle);
			var collapse=$('<div></div>').attr({'class':'panel-collapse collapse in', 'id':idcollapse}); 				
			panel.append(collapse);
			var panelB=$('<div></div>').attr('class','panel panel-default panel-invoicing-delegation'); 
			$('#accordion').append(panelB);
			var headingB=$('<div></div>').attr('class','panel-heading'); 
			panelB.append(headingB);
			var titleB=$('<h4></h4>').attr('class','panel-title'); 
			headingB.append(titleB);
			var idcollapseB = 'autoinvoices_delegation_div';
			var toggleB=$('<a></a>').attr({'href':'#'+idcollapseB,'data-toggle':'collapse', 'data-parent':'#accordion'}).text('Autofacturas'); 
			titleB.append(toggleB);
			var collapseB=$('<div></div>').attr({'class':'panel-collapse collapse in', 'id':idcollapseB}); 				
			panelB.append(collapseB);
			panel.hide();
			panelB.hide();
			var control_empty = true;
			for(var i=0; i<data.data.length; i++){
				if(data.data[i].invoices.length>0){
					panel.show();
					control_empty = false;
					if(data.data[i].radio_digital=="True"){
						if(data.data[i].enterprise=="True"){
							drawDigitalEnterprise(data.data[i]);
						}else{
							drawDigitalRadio(data.data[i]);
						}
					}else{
						if(data.data[i].enterprise=="True"){
							drawDigitalEnterprise(data.data[i]);
						}else{
							drawTraditionalRadio(data.data[i]);
						}
					}
				}
				if(data.data[i].autoinvoices){
					if(data.data[i].autoinvoices.length>0){
						panelB.show();
						control_empty = false;
						if(data.data[i].radio_digital=="True"){
							drawDigitalRadioAuto(data.data[i]);
						}else{
							drawTraditionalRadioAuto(data.data[i]);
							console.log("Pospuesto");
						}
					}
				}
			} 
			if(control_empty){
				var div=$('<div></div>').attr('id','no-invoicing-delegation').html('No existen facturas para el mes seleccionado'); 
				$('#accordion').append(div);
			}
		}else{
			super_error('Data failure');
		}
		$('#accordion_wait').hide();
	});
}

$( document ).ready(function() {
	$( "#next_year" ).click(function() {
  		if (year_view<current_year){
  			year_view=year_view+1;
  			$('#current_year').html(year_view);
  			selectMonth(month_view);
  		}
	});

	$( "#prev_year" ).click(function() {
  		year_view=year_view-1;
  		$('#current_year').html(year_view);
  		selectMonth(month_view);
	});
});