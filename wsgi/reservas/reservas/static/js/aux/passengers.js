function draw_passenger_sm(passenger, wrapper) {
	var sm3 = $('<div></div>').attr({'class':'col-sm-3'}); wrapper.append(sm3);
		var item = $('<div></div>').attr({'class':'item linkable', 'data-id':passenger.id}); sm3.append(item);
			var title = $('<div></div>').attr({'class':'title'}).text(passenger.name+' '+passenger.surname); item.append(title);
			var text = $('<div></div>').attr({'class':'text'}).text(passenger.email); item.append(text);

			item.click(function(){
				modal_passenger_details(passenger.id);
			})
	
}


function draw_passenger_md(passenger, wrapper) {
	var sm3 = $('<div></div>').attr({'class':'col-sm-12'}); wrapper.append(sm3);
		var item = $('<div></div>').attr({'class':'item linkable', 'data-id':passenger.id}); sm3.append(item);
			var title = $('<div></div>').attr({'class':'title'}).text(passenger.name); item.append(title);
			var text = $('<div></div>').attr({'class':'text'}).text(passenger.email); item.append(text);
			var text = $('<div></div>').attr({'class':'text'}).text(passenger.phone); item.append(text);

			item.click(function(){
				modal_passenger_details(passenger.id);
			})

}

function draw_not_auth_md(passenger, wrapper) {
	var sm3 = $('<div></div>').attr({'class':'col-sm-12'}); wrapper.append(sm3);
		var item = $('<div></div>').attr({'class':'item linkable', 'data-id':passenger.email}); sm3.append(item);
			var title = $('<div></div>').attr({'class':'title'}).text(passenger.email); item.append(title);

}