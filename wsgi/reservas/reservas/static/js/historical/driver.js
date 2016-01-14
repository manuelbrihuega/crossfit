
function get_content() {
	
	$.getScript(media_url+'js/aux/date.js', function(){
		$.getScript(media_url+'js/aux/journeys.js', function(){
			$.post(base_url+'/partials/historical_passenger', function(template, textStatus, xhr) {
				$('#main').html(template);
				$.getJSON(api_url+'drivers/count_by_months?callback=?', '', function(data){
					if(data.status=='success'){
				
						$.each(data.data, function(index, group) {
							addPanel(group);
						});
	
				
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
			
			$.getJSON(api_url+'drivers/journeys_by_month?callback=?', {month:group.month, year:group.year, offset:local_offset}, function(data){
				if(data.status=='success'){
					
					if(data.data.length>0){
						
						var table_wrapper=$('<div></div>').attr('class','table-responsive'); body.append(table_wrapper);
							var table=$('<table></table>').attr('class','table'); table_wrapper.append(table);
								var thead=$('<thead></thead>'); table.append(thead);
									var tr=$('<tr></tr>'); thead.append(tr);
										var th=$('<th></th>').text('Fecha'); tr.append(th);
										var th=$('<th></th>').text('Dirección'); tr.append(th);
										var th=$('<th></th>').text('Precio'); tr.append(th);
										var th=$('<th></th>').text('Distancia'); tr.append(th);
										var th=$('<th></th>').text('Duración'); tr.append(th);
		
								var tbody=$('<tbody></tbody>'); table.append(tbody);
								
								$.each(data.data, function(index, journey) {
									
									var tr=$('<tr></tr>').attr({'class':journey.status, 'data-id':journey.id}); tbody.append(tr);
											var td=$('<td></td>').text(journey.date_depart); tr.append(td);
											var td=$('<td></td>').text(journey.origin); tr.append(td);
											var td=$('<td></td>').text(price_to_string(journey.price,journey.currency)); tr.append(td);
											var td=$('<td></td>').text(distance_to_string(journey.distance)); tr.append(td);
											var td=$('<td></td>').text(duration_to_string(journey.duration)); tr.append(td);
									
								});
						
					}
					
				
				
				}
			});
			
	return false
}


