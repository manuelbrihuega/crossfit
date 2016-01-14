function draw_viewer_md(viewer, wrapper) {
	var sm3 = $('<div></div>').attr({'class':'col-sm-12'}); wrapper.append(sm3);
		var item = $('<div></div>').attr({'class':'item linkable', 'data-id':viewer.id}); sm3.append(item);
			var title = $('<div></div>').attr({'class':'title'}).text(viewer.name); item.append(title);
			var title = $('<div></div>').attr({'class':'title'}).text(viewer.radio); item.append(title);
			var text = $('<div></div>').attr({'class':'text'}).text(viewer.email); item.append(text);
			var text = $('<div></div>').attr({'class':'text'}).text(viewer.phone); item.append(text);

			item.click(function(){
				modal_radio_details(viewer.id);
			});
	
}

function draw_radio_sm(radio, wrapper) {
	
	var sm3 = $('<div></div>').attr({'class':'col-sm-4'}); wrapper.append(sm3);
	
	var item_class_status = radio.status;
	if(radio.digital) item_class_status = '';
	
	if(radio.active) var item_class_active = 'active';
	else var item_class_active = 'inactive';
	
	var item = $('<div></div>').attr({'class':'item linkable '+item_class_status+' '+item_class_active, 'data-id':radio.id}); sm3.append(item);
	var title = $('<div></div>').attr({'class':'title'}).text(radio.name); item.append(title);

	item.click(function(){
		window.location=base_url+'/radio/'+radio.id;
	})	
}



