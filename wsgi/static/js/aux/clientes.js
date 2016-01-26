function draw_passenger_sm(passenger, wrapper) {
	var cad='';
	if(passenger.paid==0){ cad = 'background-color:#f8bfbf;';}
	if(passenger.validated==0){ cad = cad + 'text-decoration: line-through;';}
		/*var item = $('<div></div>').attr({'class':cad, 'data-id':passenger.id}); sm3.append(item);
			var title = $('<div></div>').attr({'class':'title','style':'max-height: 20px; overflow: hidden;'}).text(passenger.name+' '+passenger.surname); item.append(title);
			var text = $('<div></div>').attr({'class':'text','style':'max-height: 20px; overflow: hidden;'}).text(passenger.email); item.append(text);
			var text = $('<div></div>').attr({'class':'text', 'style':'max-height: 20px; overflow: hidden;'}).text(passenger.phone); item.append(text);

			item.click(function(){
				modal_passenger_details(passenger.id);
			})*/
			$('#tableweybody2').append('<tr style="cursor:pointer; '+cad+'" onclick="modal_passenger_details('+passenger.id+');" data-id="'+passenger.id+'">'+'<td>'+passenger.name+'</td>'+'<td>'+passenger.surname+'</td>'+'<td>'+passenger.nif+'</td>'+'<td>'+passenger.phone+'</td>'+'<td>'+passenger.email+'</td>'+'<td>'+passenger.credit_wod+'</td>'+'<td>'+passenger.credit_box+'</td>'+'</tr>');
			
			$('#tablewey2').tablesorter();
	
}


function draw_passenger_md(passenger, wrapper) {
	var sm3 = $('<div></div>').attr({'class':'col-sm-12'}); wrapper.append(sm3);
		var item = $('<div></div>').attr({'class':'item linkable', 'data-id':passenger.id}); sm3.append(item);
			var title = $('<div></div>').attr({'class':'title','style':'max-height: 20px; overflow: hidden;'}).text(passenger.name); item.append(title);
			var text = $('<div></div>').attr({'class':'text', 'style':'max-height: 20px; overflow: hidden;'}).text(passenger.email); item.append(text);
			var text = $('<div></div>').attr({'class':'text', 'style':'max-height: 20px; overflow: hidden;'}).text(passenger.phone); item.append(text);

			item.click(function(){
				modal_passenger_details(passenger.id);
			})

}

function draw_not_auth_md(passenger, wrapper) {
	var sm3 = $('<div></div>').attr({'class':'col-sm-12'}); wrapper.append(sm3);
		var item = $('<div></div>').attr({'class':'item linkable', 'data-id':passenger.email}); sm3.append(item);
			var title = $('<div></div>').attr({'class':'title'}).text(passenger.email); item.append(title);

}