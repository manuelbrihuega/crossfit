function draw_driver_sm(driver, wrapper) {
	var sm3 = $('<div></div>').attr({'class':'col-sm-4'}); wrapper.append(sm3);
		var item = $('<div></div>').attr({'class':'item linkable', 'data-id':driver.id}); sm3.append(item);
			var title = $('<div></div>').attr({'class':'title'}).text(driver.name); item.append(title);
			var text = $('<div></div>').attr({'class':'text'}).text(driver.radio); item.append(text);
		
			item.click(function(){
				modal_driver_details(driver.id);
			})
	
}

function draw_driver_md(driver, wrapper) {
	var row = $('<div></div>').attr({'class':'row item md', 'data-id':driver.id}); wrapper.append(row);
	// row.addClass(driver.status);
	row.click(function(){
		modal_driver_details(driver.id);
	})
	
	var time = $('<div></div>').attr({'class':'col-sm-2 licence'}).text(driver.num_licence); row.append(time);
	var caller = $('<div></div>').attr({'class':'col-sm-4 name'}).text(driver.name); row.append(caller);
	var called = $('<div></div>').attr({'class':'col-sm-4 email'}).text(driver.email); row.append(called);
	var origin = $('<div></div>').attr({'class':'col-sm-2 phone'}).text(driver.phone); row.append(origin);
	
}

function draw_driver_supporter(driver, wrapper) {
	var sm3 = $('<div></div>').attr({'class':'col-sm-12'}); wrapper.append(sm3);
		var item = $('<div></div>').attr({'class':'item linkable', 'data-id':driver.id}); sm3.append(item);
			var title = $('<div></div>').attr({'class':'title'}).text(driver.name); item.append(title);
			var text = $('<div></div>').attr({'class':'text'}).text(driver.radio); item.append(text);
			var text = $('<div></div>').attr({'class':'text'}).text(driver.email); item.append(text);
			var text = $('<div></div>').attr({'class':'text'}).text(driver.phone); item.append(text);

			item.click(function(){
				modal_driver_details(driver.id);
			})

}
