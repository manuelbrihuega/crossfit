 $(document).ready(function() {
 	$('#link-graphical-journeys-year').change(function() {
 		if($(this).val()=="loadGraphicalJourneysYear"){
 			loadGraphicalJourneysYear();
 		}
 		if($(this).val()=="loadGraphicalJourneysCompletedYear"){
 			loadGraphicalJourneysCompletedYear();
 		}
 		if($(this).val()=="loadGraphicalUsersYear"){
 			loadGraphicalUsersYear();
 		}
 		if($(this).val()=="loadGraphicalEnterprisesYear"){
 			loadGraphicalEnterprisesYear();
 		}
 		if($(this).val()=="loadResumen"){
 			loadResumen();
 		}
 	});

 	$( "#next_year" ).click(function() {
  		if (year_view<current_year_b){
  			year_view=year_view+1;
  			$('#current_year').html(year_view);
  			selectYear(year_view,'second');
  		}
	});

	$( "#prev_year" ).click(function() {
  		year_view=year_view-1;
  		$('#current_year').html(year_view);
  		selectYear(year_view,'second');
	});
 });
months=['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
months_complete=['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
var current_year_b = (new Date).getFullYear();
var year_view = current_year_b;
function get_content() {
	$.getScript(media_url+'js/aux/date.js', function(){
		$.getScript(media_url+'js/aux/journeys.js', function(){
			$.post(base_url+'/partials/stadistics_super_delegation', function(template, textStatus, xhr) {
				$('#main').html(template);
				$('#current_year').html('<i class="fa fa-cog fa-spin"></i>');
	 			$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
				$('#current_year').html(year_view);
				selectYear(year_view,'first');
			});
		});
	});
}

function selectYear(year,type){

	$('#accordion_wait').show();
	$('#accordion_wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>');
	year_view=year;
	$('#graphical-content').attr({'style':'display:all;'});
	$('#accordion_wait').hide();
	$('#subscriber_accordion').html('');
	$('#container-graphical-system').attr({'style':'display:all;'});
	if($('#link-graphical-journeys-year').val()=="loadGraphicalJourneysYear" && type=='second'){
 		loadGraphicalJourneysYear();
 	}
 	if($('#link-graphical-journeys-year').val()=="loadGraphicalJourneysCompletedYear" && type=='second'){
 		loadGraphicalJourneysCompletedYear();
 	}
 	if($('#link-graphical-journeys-year').val()=="loadGraphicalUsersYear" && type=='second'){
 		loadGraphicalUsersYear();
 	}
 	if($('#link-graphical-journeys-year').val()=="loadGraphicalEnterprisesYear" && type=='second'){
 		loadGraphicalEnterprisesYear();
 	}
 	if($('#link-graphical-journeys-year').val()=="loadResumen" && type=='second'){
 		loadResumen();
 	}
 	if(type=='first'){
 		loadFirstGraphical(year_view);
 	}
}

function loadFirstGraphical(year){
	if($('#containerResumen')){
		$('#containerResumen').remove();
	}
	if($('#totalCarreras')){
		$('#totalCarreras').remove();
	}
	$('#row-calendar').attr({'style':'display: all;'});
	$('#rgraph_key').remove();
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	var canvas = $('#cvs');
	RGraph.ObjectRegistry.Clear();
	RGraph.Reset(canvas);
	loadResumen();

	
}

function loadGraphicalJourneysYear(){
	if($('#containerResumen')){
		$('#containerResumen').remove();
	}
	$('#rgraph_key').remove();
	if($('#totalCarreras')){
		$('#totalCarreras').remove();
	}
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	RGraph.ObjectRegistry.Clear();
	$('#link-graphical-journeys-year').addClass('activeIn');
	//$('#link-graphical-money-year').removeClass('activeIn');
	var width= $("#dashboard-graphical").width();
	var height=(width*300)/632;
	if(window.innerWidth<500){
		var height=(width*210)/500;
	}
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
	$.getJSON(api_url+'journeys/list_num_journeys_by_year?callback=?', {	
																year:year_view}, function(data2){

		if(data2.status=='success'){
			var total = 0;
			for(var i=0; i<data2.data.length; i++){
				total = total + data2.data[i];
			}
			var lista_meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
   			$('#dashboard-graphical').append($('<div style="width:100%;"><table id="rgraph_key" cellspacing="0" cellpadding="0" border="0" style="width:129px;"><tbody><tr><td><div id="legend-color"> </div></td><td><span "="">Carreras / Mes</span></td></tr></tbody></table></div><div id="totalCarreras" style="text-align: right; margin-top: -26px; margin-right: 22px;"><span>Total = '+total+'</span></div>'));
			lista_tooltip=new Array(12);
         	for (var i=0; i<lista_tooltip.length; i++){
           		lista_tooltip[i] = data2.data[i].toString()+' carreras';
           	}
           	var desp=0;
           	if(window.innerWidth>992){
				desp=100;
          	}else{
        		desp=40;
           	}
			var bar4 = new RGraph.Bar('cvs', data2.data)
                							 .set('labels', lista_meses)
                							 .set('colors', ['#FDB700'])
                							 .set('tooltips', lista_tooltip)
                							 .set('chart.gutter.left', desp)
                							 .draw();
            $('#graphical-wait').hide();

		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data2.response,'warning');
	});
}

function loadResumen(){
	if($('#containerResumen')){
		$('#containerResumen').remove();
	}
	$('#rgraph_key').remove();
	if($('#totalCarreras')){
		$('#totalCarreras').remove();
	}
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	RGraph.ObjectRegistry.Clear();
	$('#link-graphical-journeys-year').addClass('activeIn');
	//$('#link-graphical-money-year').removeClass('activeIn');
	//var width= $("#dashboard-graphical").width();
	//var height=(width*300)/632;
	//if(window.innerWidth<500){
	//	var height=(width*210)/500;
	//}
	//$("#cvs").attr({'width':width});
	//$("#cvs").attr({'height':height});
	$.getJSON(api_url+'journeys/list_all_by_year?callback=?', {	
																year:year_view}, function(data2){

		if(data2.status=='success'){
			var totaljourneys = data2.data.journeys;
			var journeyscompleted = data2.data.journeyscompleted;
			var users = data2.data.users;
			var enterprises = data2.data.enterprises;
			var buttons = data2.data.buttons;
			$("#dashboard-graphical").prepend($('<div id="containerResumen" style="margin-top:40px;"><div class="stat" style="text-align: center; width: 140px; height: 140px; background-color: #eee; margin: 0px auto; border-radius: 50%;"><div id="stat_journeys" class="number" style="font-size: 50px; line-height: 70px; padding-top: 20px;">'+totaljourneys+'</div><div class="text" style="font-weight: bold; color: #888;">Carreras</div></div><div style="overflow: auto; margin-top: 20px;"><div class="col-sm-6"><div class="item" style="background-color: #EEEEEE; height: 44px; margin-bottom: 20px; overflow: hidden;"><div id="stat_completed" class="number" style="background-color: #FDB702; float: left; font-size: 24px; font-weight: bold; height: 44px; line-height: 40px; margin-right: 10px; text-align: center; vertical-align: middle; width: 80px;">'+journeyscompleted+'</div><div class="text" style="font-size: 18px; line-height: 44px; margin-bottom: 0; padding-bottom: 0; vertical-align: middle;">Carreras finalizadas</div></div></div><div class="col-sm-6"><div class="item" style="background-color: #EEEEEE; height: 44px; margin-bottom: 20px; overflow: hidden;"><div id="stat_completed" class="number" style="background-color: #FDB702; float: left; font-size: 24px; font-weight: bold; height: 44px; line-height: 40px; margin-right: 10px; text-align: center; vertical-align: middle; width: 80px;">'+users+'</div><div class="text" style="font-size: 18px; line-height: 44px; margin-bottom: 0; padding-bottom: 0; vertical-align: middle;">Usuarios registrados</div></div></div><div class="col-sm-6"><div class="item" style="background-color: #EEEEEE; height: 44px; margin-bottom: 20px; overflow: hidden;"><div id="stat_completed" class="number" style="background-color: #FDB702; float: left; font-size: 24px; font-weight: bold; height: 44px; line-height: 40px; margin-right: 10px; text-align: center; vertical-align: middle; width: 80px;">'+enterprises+'</div><div class="text" style="font-size: 18px; line-height: 44px; margin-bottom: 0; padding-bottom: 0; vertical-align: middle;">Empresas registradas</div></div></div><div class="col-sm-6"><div class="item" style="background-color: #EEEEEE; height: 44px; margin-bottom: 20px; overflow: hidden;"><div id="stat_completed" class="number" style="background-color: #FDB702; float: left; font-size: 24px; font-weight: bold; height: 44px; line-height: 40px; margin-right: 10px; text-align: center; vertical-align: middle; width: 80px;">'+buttons+'</div><div class="text" style="font-size: 18px; line-height: 44px; margin-bottom: 0; padding-bottom: 0; vertical-align: middle;">Pulsadores registrados</div></div></div></div></div>'));

            $('#graphical-wait').hide();
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data2.response,'warning');
	});
}

function loadGraphicalEnterprisesYear(){
	if($('#containerResumen')){
		$('#containerResumen').remove();
	}
	$('#rgraph_key').remove();
	if($('#totalCarreras')){
		$('#totalCarreras').remove();
	}
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	RGraph.ObjectRegistry.Clear();
	$('#link-graphical-journeys-year').addClass('activeIn');
	//$('#link-graphical-money-year').removeClass('activeIn');
	var width= $("#dashboard-graphical").width();
	var height=(width*300)/632;
	if(window.innerWidth<500){
		var height=(width*210)/500;
	}
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
	$.getJSON(api_url+'enterprises/list_num_enterprises_by_year?callback=?', {	
																year:year_view}, function(data2){

		if(data2.status=='success'){
			var total = 0;
			for(var i=0; i<data2.data.length; i++){
				total = total + data2.data[i];
			}
			var lista_meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
   			$('#dashboard-graphical').append($('<div style="width:100%;"><table id="rgraph_key" cellspacing="0" cellpadding="0" border="0" style="width:154px;"><tbody><tr><td><div id="legend-color"> </div></td><td><span "="">Pulsadores / Mes</span></td></tr></tbody></table></div><div id="totalCarreras" style="text-align: right; margin-top: -26px; margin-right: 22px;"><span>Total = '+total+'</span></div>'));
			lista_tooltip=new Array(12);
         	for (var i=0; i<lista_tooltip.length; i++){
           		lista_tooltip[i] = data2.data[i].toString()+' pulsadores';
           	}
           	var desp=0;
           	if(window.innerWidth>992){
				desp=100;
          	}else{
        		desp=40;
           	}
			var bar4 = new RGraph.Bar('cvs', data2.data)
                							 .set('labels', lista_meses)
                							 .set('colors', ['#FDB700'])
                							 .set('tooltips', lista_tooltip)
                							 .set('chart.gutter.left', desp)
                							 .draw();
            $('#graphical-wait').hide();

		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data2.response,'warning');
	});
}

function loadGraphicalUsersYear(){
	if($('#containerResumen')){
		$('#containerResumen').remove();
	}
	$('#rgraph_key').remove();
	if($('#totalCarreras')){
		$('#totalCarreras').remove();
	}
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	RGraph.ObjectRegistry.Clear();
	$('#link-graphical-journeys-year').addClass('activeIn');
	//$('#link-graphical-money-year').removeClass('activeIn');
	var width= $("#dashboard-graphical").width();
	var height=(width*300)/632;
	if(window.innerWidth<500){
		var height=(width*210)/500;
	}
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
	$.getJSON(api_url+'auth/list_num_users_by_year?callback=?', {	
																year:year_view}, function(data2){

		if(data2.status=='success'){
			var total = 0;
			for(var i=0; i<data2.data.length; i++){
				total = total + data2.data[i];
			}
			var lista_meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
   			$('#dashboard-graphical').append($('<div style="width:100%;"><table id="rgraph_key" cellspacing="0" cellpadding="0" border="0" style="width:136px;"><tbody><tr><td><div id="legend-color"> </div></td><td><span "="">Usuarios / Mes</span></td></tr></tbody></table></div><div id="totalCarreras" style="text-align: right; margin-top: -26px; margin-right: 22px;"><span>Total = '+total+'</span></div>'));
			lista_tooltip=new Array(12);
         	for (var i=0; i<lista_tooltip.length; i++){
           		lista_tooltip[i] = data2.data[i].toString()+' usuarios';
           	}
           	var desp=0;
           	if(window.innerWidth>992){
				desp=100;
          	}else{
        		desp=40;
           	}
			var bar4 = new RGraph.Bar('cvs', data2.data)
                							 .set('labels', lista_meses)
                							 .set('colors', ['#FDB700'])
                							 .set('tooltips', lista_tooltip)
                							 .set('chart.gutter.left', desp)
                							 .draw();
            $('#graphical-wait').hide();

		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data2.response,'warning');
	});
}

function loadGraphicalJourneysCompletedYear(){
	if($('#containerResumen')){
		$('#containerResumen').remove();
	}
	$('#rgraph_key').remove();
	if($('#totalCarreras')){
		$('#totalCarreras').remove();
	}
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	RGraph.ObjectRegistry.Clear();
	$('#link-graphical-journeys-year').addClass('activeIn');
	//$('#link-graphical-money-year').removeClass('activeIn');
	var width= $("#dashboard-graphical").width();
	var height=(width*300)/632;
	if(window.innerWidth<500){
		var height=(width*210)/500;
	}
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
	$.getJSON(api_url+'journeys/list_num_journeys_completed_by_year?callback=?', {	
																year:year_view}, function(data2){

		if(data2.status=='success'){
			var total = 0;
			for(var i=0; i<data2.data.length; i++){
				total = total + data2.data[i];
			}
			var lista_meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
   			$('#dashboard-graphical').append($('<div style="width:100%;"><table id="rgraph_key" cellspacing="0" cellpadding="0" border="0" style="width:129px;"><tbody><tr><td><div id="legend-color"> </div></td><td><span "="">Carreras / Mes</span></td></tr></tbody></table></div><div id="totalCarreras" style="text-align: right; margin-top: -26px; margin-right: 22px;"><span>Total = '+total+'</span></div>'));
			lista_tooltip=new Array(12);
         	for (var i=0; i<lista_tooltip.length; i++){
           		lista_tooltip[i] = data2.data[i].toString()+' carreras';
           	}
           	var desp=0;
           	if(window.innerWidth>992){
				desp=100;
          	}else{
        		desp=40;
           	}
			var bar4 = new RGraph.Bar('cvs', data2.data)
                							 .set('labels', lista_meses)
                							 .set('colors', ['#FDB700'])
                							 .set('tooltips', lista_tooltip)
                							 .set('chart.gutter.left', desp)
                							 .draw();
            $('#graphical-wait').hide();

		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data2.response,'warning');
	});
}

/*function loadGraphicalIncomesYear(){
	if($('#containerResumen')){
		$('#containerResumen').remove();
	}
	$('#rgraph_key').remove();
	$('#graphical-wait').html('<div class="waiting"><i class="fa fa-cog fa-spin"></i></div>').show();
	RGraph.ObjectRegistry.Clear();
	$('#link-graphical-journeys-year').removeClass('activeIn');
	$('#link-graphical-money-year').addClass('activeIn');
	var width= $("#dashboard-graphical").width();
	var height=(width*210)/632;
	$("#cvs").attr({'width':width});
	$("#cvs").attr({'height':height});
    $.getJSON(api_url+'journeys/list_incomes_by_year?callback=?', {	
    															year:year_view}, function(data2){
		if(data2.status=='success'){
			var lista_meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
   			currency='Euros'; 
   			$('#dashboard-graphical').append($('<div style="width:100%;"><table id="rgraph_key" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td><div id="legend-color"> </div></td><td><span "="">'+currency+' / Mes</span></td></tr></tbody></table></div>'));
   			lista_tooltip=new Array(12);
            for (var i=0; i<lista_tooltip.length; i++){
            	if(data2.data[i]==0){
            		lista_tooltip[i] = data2.data[i].toString()+' '+currency;
            	}else{
            		lista_tooltip[i] = data2.data[i].toFixed(2).toString()+' '+currency;
            	}
            }
			var bar4 = new RGraph.Bar('cvs', data2.data)
                							 .set('labels', lista_meses)
                							 .set('colors', ['#FDB700'])
                							 .set('tooltips', lista_tooltip)
                							 .draw();
      		$('#graphical-wait').hide();
		}
		else launch_alert('<i class="fa fa-frown-o"></i> '+data2.response,'warning');
	});
}
*/

