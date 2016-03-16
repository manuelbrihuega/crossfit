function draw_passenger_sm(passenger, wrapper) {
	var cad='';
	var pay='PAGADO';
	var color='style="color:green;"';
	if(passenger.paid==0){ cad = 'background-color:#f8bfbf;'; pay = 'NO PAGADO'; color='style="color:red;"';}
	if(passenger.validated==0){ cad = cad + 'text-decoration: line-through;';}
		/*var item = $('<div></div>').attr({'class':cad, 'data-id':passenger.id}); sm3.append(item);
			var title = $('<div></div>').attr({'class':'title','style':'max-height: 20px; overflow: hidden;'}).text(passenger.name+' '+passenger.surname); item.append(title);
			var text = $('<div></div>').attr({'class':'text','style':'max-height: 20px; overflow: hidden;'}).text(passenger.email); item.append(text);
			var text = $('<div></div>').attr({'class':'text', 'style':'max-height: 20px; overflow: hidden;'}).text(passenger.phone); item.append(text);

			item.click(function(){
				modal_passenger_details(passenger.id);
			})*/
			$('#tableweybody2').append('<tr style="cursor:pointer; '+cad+'" onclick="modal_passenger_details('+passenger.id+');" data-id="'+passenger.id+'">'+'<td>'+passenger.name+'</td>'+'<td>'+passenger.surname+'</td>'+'<td>'+passenger.credit_wod+'/'+passenger.credit_wod_tarifa+'</td>'+'<td>'+passenger.credit_box+'/'+passenger.credit_box_tarifa+'</td>'+'<td>'+passenger.credit_bono+'/'+passenger.credit_bono_tarifa+'</td>'+'<td>'+passenger.tarifa_vigente+' ('+passenger.tarifa_vigente_precio+')'+'</td>'+'<td '+color+' class="pagador">'+pay+'</td>'+'</tr>');
			
			$('#tablewey2').tablesorter();
			$(".pagador").hover(function(){
    			if($(this).html()=='PAGADO'){
    				$(this).html('<button onclick="revertirPago(this);" style="color:red; margin-top:0px; margin-bottom: 0px; margin-left:auto; margin-right: auto;">REVERTIR PAGO</button>');
    			}else{
    				$(this).html('<button onclick="pagar(this);" style="color:green; margin-top:0px; margin-bottom: 0px; margin-left:auto; margin-right: auto;">PAGAR</button>');
    			}
    		}, function(){
    			if($(this).html()=='<button onclick="revertirPago(this);" style="color:red; margin-top:0px; margin-bottom: 0px; margin-left:auto; margin-right: auto;">REVERTIR PAGO</button>'){
    				$(this).html('PAGADO');
    			}else{
    				$(this).html('NO PAGADO');
    			}
			});
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