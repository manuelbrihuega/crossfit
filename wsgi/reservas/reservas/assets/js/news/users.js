function get_content() {
	$.getScript(media_url+'js/aux/date.js', function(){
		$.post('partials/news', function(template, textStatus, xhr) {
			$('#main').html(template);
		
			$.getJSON(api_url+'news/list_news?callback=?', '', function(data){
				////console.log(data);
				if(data.status=='success'){
					$.each(data.data.news, function(index, anew) {
						addItem(anew);
					});
				}
				else super_error('News failure');
			});
		});
	});
	
	
}


function addItem(anew) {
	
	var item=$('<div></div>').attr({'class':'item clearfix','data-id':anew.id}); $('#news_wrapper').append(item);

		var title=$('<div></div>').attr('class','title').text(anew.title); item.append(title);
		var date=$('<div></div>').attr('class','date').text(fecha_castellano_sin_hora(anew.date)); item.append(date);
		var body=$('<div></div>').attr('class','body').html(anew.body); item.append(body);
		if(anew.link.length>0){
			var link=$('<div></div>').attr('class','link pull-right'); item.append(link);
			var a=$('<a></a>').attr({'href':anew.link, 'target':'_blank'}).text('Saber más'); link.append(a);
		}
		
	return false
}
