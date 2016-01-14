function get_content() {
	
	$.getScript(media_url+'js/aux/date.js', function(){
		$.getScript(media_url+'js/aux/journeys.js', function(){
			$.post(base_url+'/partials/historical_enterprise', function(template, textStatus, xhr) {
				$('#main').html(template);
				$.getJSON(api_url+'enterprises/count_by_months?callback=?', '', function(data){
					if(data.status=='success'){
				
						$.each(data.data, function(index, group) {
							addPanel(group);
						});
						if(data.data.length==0){
							super_error('No hay carreras');
						}
				
					}
					else super_error('Historical failure');
				});

			});
		});
	});
}


function addPanel(group) {
	
	var month=months_api[parseInt(group.month)];
	
	
	var panel=$('<div></div>').attr('class','panel panel-default'); $('#historical_accordion').append(panel);
	
		var heading=$('<div></div>').attr('class','panel-heading'); panel.append(heading);
			var title=$('<h4></h4>').attr('class','panel-title'); heading.append(title);
				var toggle=$('<a></a>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#historical_accordion', 'href':'#group_'+group.year+'_'+group.month}).text(month+' '+group.year); title.append(toggle);
	
		var collapse=$('<div></div>').attr({'class':'panel-collapse collapse','id':'group_'+group.year+'_'+group.month}); panel.append(collapse);
			var body=$('<div></div>').attr({'class':'panel-body journeys_wrapper'}); collapse.append(body);
			
			$.getJSON(api_url+'enterprises/journeys_by_month?callback=?', {month:group.month, year:group.year, offset:local_offset}, function(data){
				if(data.status=='success'){
					
					if(data.data.length>0){
						
						var table_wrapper=$('<div></div>').attr('class','table-responsive'); body.append(table_wrapper);
							var table=$('<table></table>').attr({'class':'table sortable','id':'tableToOrder'}); table_wrapper.append(table);
								var thead=$('<thead></thead>'); table.append(thead);
									var tr=$('<tr></tr>'); thead.append(tr);
										var th=$('<th></th>').text('Fecha'); th.css('cursor','pointer'); tr.append(th);
										var th=$('<th></th>').text('Origen'); th.css('cursor','pointer'); tr.append(th);
										var th=$('<th></th>').text('Ciudad'); th.css('cursor','pointer'); tr.append(th);
										var th=$('<th></th>').text('Empleado'); th.css('cursor','pointer'); tr.append(th);
										var th=$('<th></th>').text('Precio'); th.css('cursor','pointer'); tr.append(th);
										var th=$('<th></th>').text('Distancia'); th.css('cursor','pointer'); tr.append(th);
										var th=$('<th></th>').text('Duración'); th.css('cursor','pointer'); tr.append(th);
		
								var tbody=$('<tbody></tbody>'); table.append(tbody);
								
								$.each(data.data, function(index, journey) {
									
									var tr=$('<tr></tr>').attr({'class':journey.status, 'data-id':journey.id}); tbody.append(tr);
											var td=$('<td></td>').text(journey.date_depart); tr.append(td);
											var td=$('<td></td>').text(journey.origin); tr.append(td);
											var td=$('<td></td>').text(journey.locality); tr.append(td);
											var td=$('<td></td>').text(journey.employee); tr.append(td);
											var td=$('<td sorttable_customkey=\"'+journey.price+'\"></td>').text(price_to_string(journey.price,journey.currency)); tr.append(td);
											var td=$('<td sorttable_customkey=\"'+journey.distance+'\"></td>').text(distance_to_string(journey.distance)); tr.append(td);
											var td=$('<td sorttable_customkey=\"'+journey.duration+'\"></td>').text(duration_to_string(journey.duration)); tr.append(td);
									
								});
								var elto = document.getElementById('tableToOrder');
								sorttable.makeSortable(elto);
					}
					
				
				
				}
			});
			
	return false
}