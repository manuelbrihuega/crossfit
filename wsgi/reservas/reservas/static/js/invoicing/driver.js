function get_content() {
	$.getScript(media_url+'js/aux/date.js');
	$.getScript(media_url+'js/aux/journeys.js');
	var meses=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
	var owner_id="";
	$.post('partials/invoicing_driver', function(template, textStatus, xhr) {
		$('#accordion_wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
		$('#main').html(template);
		$.getJSON(api_url+'drivers/get?callback=?', '', function(data2){
			if(data2.status=='success'){
				owner_id=data2.data.owner_profile.id;
			}else{
				super_error('Data failure');
			}

			$.getJSON(api_url+'invoices/list_by_owner?callback=?&owner_id='+owner_id, '', function(data3){
				if(data3.status=='success'){
					var panelA=$('<div><h4>Facturas Taxible Servicios: </h4></div>').attr('id','invoicing_accordion_invoices'); 
					$('#invoicing_accordion').append(panelA);
					var panelB=$('<div><h4>Autofacturas: </h4></div>').attr('id','invoicing_accordion_autoinvoices'); 
					$('#invoicing_accordion').append(panelB);
					panelA.hide();
					panelB.hide();
					for(var i=0; i<data3.data.invoices.length; i++){
						panelA.show();
						var panel=$('<div></div>').attr('class','panel panel-default'); $('#invoicing_accordion_invoices').append(panel);
						var heading=$('<div></div>').attr('class','panel-heading panel-heading-invoice invoice-padding'); 
						panel.append(heading);
						var div_h4=$('<div></div>').attr('class','responsive-title margin_yes col-md-9');
						var title=$('<h4></h4>').attr('class','panel-title'); 
						div_h4.append(title);
						heading.append(div_h4);
						var toggle=$('<span></span>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#invoicing_accordion'}).text(meses[data3.data.invoices[i].month-1]+' '+data3.data.invoices[i].year+' - '+data3.data.invoices[i].num_invoice_complete+' - '+data3.data.invoices[i].amount+' '+data3.data.invoices[i].currency_delgation); 
						title.append(toggle);
						var button_div=$('<div></div>').attr({'class':'responsive-button col-md-2'})
						var location = "location.href=\""+data3.data.invoices[i].url_pdf+"\"";
						var button=$('<button></button>').attr({'onclick':location, 'type':'button', 'class':'responsive-btn btn btn-default'}).text('Descargar en PDF');
						button_div.append(button);
						heading.append(button_div);
					}
					for(var i=0; i<data3.data.autoinvoices.length; i++){
						panelB.show();
						var panel=$('<div></div>').attr('class','panel panel-default'); $('#invoicing_accordion_autoinvoices').append(panel);
						var heading=$('<div></div>').attr('class','panel-heading panel-heading-invoice invoice-padding'); 
						panel.append(heading);
						var div_h4=$('<div></div>').attr('class','responsive-title margin_yes col-md-9');
						var title=$('<h4></h4>').attr('class','panel-title'); 
						div_h4.append(title);
						heading.append(div_h4);
						var toggle=$('<span></span>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#invoicing_accordion'}).text(meses[data3.data.autoinvoices[i].month-1]+' '+data3.data.autoinvoices[i].year+' - '+data3.data.autoinvoices[i].num_invoice_complete+' - '+data3.data.autoinvoices[i].amount+' '+data3.data.autoinvoices[i].currency_delgation); 
						title.append(toggle);
						var button_div=$('<div></div>').attr({'class':'responsive-button col-md-2'})
						var location = "location.href=\""+data3.data.autoinvoices[i].url_pdf+"\"";
						var button=$('<button></button>').attr({'onclick':location, 'type':'button', 'class':'responsive-btn btn btn-default'}).text('Descargar en PDF');
						button_div.append(button);
						heading.append(button_div);
					}
				}else super_error('Data failure');
				
				if(data3.data.invoices.length==0 && data3.data.autoinvoices.length==0){
					var panel=$('<div></div>').attr('class','panel panel-default'); $('#invoicing_accordion').append(panel);
					var heading=$('<div></div>').attr('class','panel-heading panel-heading-invoice'); 
					panel.append(heading);
					var title=$('<h4></h4>').attr('class','panel-title'); 
					heading.append(title);
					var toggle=$('<span></span>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#invoicing_accordion'}).text('No existen facturas'); 
					title.append(toggle);
				}
				
			});
		});
	});
	$('#accordion_wait').hide();
}


