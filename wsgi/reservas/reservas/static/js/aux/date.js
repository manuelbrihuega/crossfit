var semana=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
var meses=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
var meses_short=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
var months_api=['','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

var local_offset = getLocalOffset();

function getLocalOffset(){
	var d = new Date()
	return d.getTimezoneOffset()/60*-1;
}

function current_day(){
	var d = new Date();
	return d.getDate();
}

function current_month(){
	var d = new Date();
	return d.getMonth()+1;
}

function current_year(){
	var d = new Date();
	return d.getFullYear();
}

function getTimeFromString(date) {
    var time = date.split(' ')[1].split(':');
  	return time[0]+':'+time[1];
}

function fecha_castellano_sin_hora (date) {
	var date =date.replace(/-/g,'/');
	var f = new Date(date);
    return semana[f.getDay()]+', '+f.getDate()+' de '+meses[f.getMonth()]+' de '+f.getFullYear();
}


function fecha_castellano_con_hora (date) {
	var date =date.replace(/-/g,'/');
	var f = new Date(date);
    return semana[f.getDay()]+', '+f.getDate()+' de '+meses[f.getMonth()]+' de '+f.getFullYear()+' | '+addZero(f.getHours())+':'+addZero(f.getMinutes());
}

function fecha_castellano_corta_sin_hora (date) {
	var date =date.replace(/-/g,'/');
	var f = new Date(date);
    return semana[f.getDay()]+', '+f.getDate()+' de '+meses[f.getMonth()];
}

function fecha_castellano_dia_mes (date) {
	var date =date.replace(/-/g,'/');
	var f = new Date(date);
    return f.getDate()+' '+meses_short[f.getMonth()];
}

function fecha_con_hora (date) {
	var date =date.replace(/-/g,'/');
	var f = new Date(date);
    return f.getDate()+'/'+addZero(f.getMonth()+1)+'/'+f.getFullYear()+' '+addZero(f.getHours())+':'+addZero(f.getMinutes());
}

function fecha_solo_hora (date) {
	var date =date.replace(/-/g,'/');
	var f = new Date(date);
    return addZero(f.getHours())+':'+addZero(f.getMinutes());
}

function fecha_hoy_simple () {
	var f = new Date();
    return f.getDate()+'/'+addZero(f.getMonth()+1)+'/'+f.getFullYear();
}


function addZero(i)
{
	if (i<10) i="0" + i;
	return i;
}

