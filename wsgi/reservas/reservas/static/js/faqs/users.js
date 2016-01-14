function get_content() {
	
	$.post('partials/faqs', function(template, textStatus, xhr) {
		$('#main').html(template);
		$.getJSON(api_url+'faqs/list_all?callback=?', '', function(data){
			if(data.status=='success'){
				
				$.each(data.data.sections, function(index, section) {
					addPanel(section);
				});
	
				
			}
			else super_error('FAQS Sections failure');
		});

	});
}


function addPanel(section) {
	
	var panel=$('<div></div>').attr('class','panel panel-default'); $('#faqs_accordion').append(panel);

		var heading=$('<div></div>').attr('class','panel-heading'); panel.append(heading);
			var title=$('<h4></h4>').attr('class','panel-title'); heading.append(title);
				var toggle=$('<a></a>').attr({'class':'accordion-toggle','data-toggle':'collapse', 'data-parent':'#faqs_accordion', 'href':'#section_'+section.id}).text(section.section); title.append(toggle);

		var collapse=$('<div></div>').attr({'class':'panel-collapse collapse','id':'section_'+section.id}); panel.append(collapse);
			var body=$('<div></div>').attr({'class':'panel-body'}); collapse.append(body);
			
			$.each(section.questions, function(index, question) {

				var question_wrapper=$('<div></div>').css('margin-bottom','30px').attr({'class':'faqs_question', 'data-id':question.id}); body.append(question_wrapper);
					var question_title=$('<p><strong>'+question.question+'</strong></p>'); question_wrapper.append(question_title);
					var question_body=$('<p>'+question.answer+'</p>'); question_wrapper.append(question_body);
				
			});
			
	return false
}
