/*
Monthly 2.0.3 by Kevin Thornbloom is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.
*/

var titulos = new Array();

(function($) {
	$.fn.extend({
		monthly: function(options) {
			// These are overridden by options declared in footer
			var defaults = {
				weekStart: 'Sun',
				mode: '',
				xmlUrl: '',
				target: '',
				eventList: true,
				maxWidth: false,
				startHidden: false,
				showTrigger: '',
				stylePast: false,
				disablePast: false
			}

			var options = $.extend(defaults, options),
				that = this,
				uniqueId = $(this).attr('id'),
				d = new Date(),
				currentMonth = d.getMonth() + 1,
				currentYear = d.getFullYear(),
				currentDay = d.getDate(),
				monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
				dayNames = ['DOM','LUN','MAR','MIE','JU','VI','SAB'];

		if (options.maxWidth != false){
			$('#'+uniqueId).css('maxWidth',options.maxWidth);
		}

		if (options.startHidden == true){
			$('#'+uniqueId).addClass('monthly-pop').css({
				'position' : 'absolute',
				'display' : 'none'
			});
			$(document).on('focus', ''+options.showTrigger+'', function (e) {
				$('#'+uniqueId).show();
				e.preventDefault();
			});
			$(document).on('click', ''+options.showTrigger+', .monthly-pop', function (e) {
				e.stopPropagation();
				e.preventDefault();
			});
			$(document).on('click', function (e) {
				$('#'+uniqueId).hide();
			});
		}

		// Add Day Of Week Titles
		if (options.weekStart == 'Sun') {
			$('#' + uniqueId).append('<div class="monthly-day-title-wrap"><div>Dom</div><div>Lun</div><div>Mar</div><div>Mie</div><div>Ju</div><div>Vie</div><div>Sab</div></div><div class="monthly-day-wrap"></div>');
		} else if (options.weekStart == 'Mon') {
			$('#' + uniqueId).append('<div class="monthly-day-title-wrap"><div>Lun</div><div>Mar</div><div>Mie</div><div>Ju</div><div>Vie</div><div>Sab</div><div>Dom</div></div><div class="monthly-day-wrap"></div>');
		} else {
			console.log('Incorrect entry for weekStart variable.')
		}

		// Add Header & event list markup
		$('#' + uniqueId).prepend('<div class="monthly-header"><div class="monthly-header-title"></div><a href="#" class="monthly-prev"></a><a href="#" class="monthly-next"></a></div>').append('<div class="monthly-event-list"></div>');

		// How many days are in this month?
		function daysInMonth(m, y){
			return m===2?y&3||!(y%25)&&y&15?28:29:30+(m+(m>>3)&1);
		}

		// Massive function to build the month
		function setMonthly(m, y){
			$('#' + uniqueId).data('setMonth', m).data('setYear', y);

			// Get number of days
			var dayQty = daysInMonth(m, y),
				// Get day of the week the first day is
				mZeroed = m -1,
				firstDay = new Date(y, mZeroed, 1, 0, 0, 0, 0).getDay();

			// Remove old days
			$('#' + uniqueId + ' .monthly-day, #' + uniqueId + ' .monthly-day-blank').remove();
			$('#'+uniqueId+' .monthly-event-list').empty();
			// Print out the days
			if (options.mode == 'event') {
				for(var i = 0; i < dayQty; i++) {
					
					var day = i + 1; // Fix 0 indexed days
					var dayNamenum = new Date(y, mZeroed, day, 0, 0, 0, 0).getDay()
					
					$('#' + uniqueId + ' .monthly-day-wrap').append('<a href="#" class="monthly-day monthly-day-event" data-number="'+day+'"><div class="monthly-day-number">'+day+'</div><div class="monthly-indicator-wrap"></div></a>');
					$('#' + uniqueId + ' .monthly-event-list').append('<div class="monthly-list-item" id="'+uniqueId+'day'+day+'" data-number="'+day+'"><div class="monthly-event-list-date">'+dayNames[dayNamenum]+'<br>'+day+'</div></div>');
					
				}
			} else {
				for(var i = 0; i < dayQty; i++) {
					// Fix 0 indexed days
					var day = i + 1;

					// Check if it's a day in the past
					if(((day < currentDay && m === currentMonth) || y < currentYear || (m < currentMonth && y == currentYear)) && options.stylePast == true){
							$('#' + uniqueId + ' .monthly-day-wrap').append('<a href="#" class="monthly-day monthly-day-pick monthly-past-day" data-number="'+day+'"><div class="monthly-day-number">'+day+'</div><div class="monthly-indicator-wrap"></div></a>');
					} else {
						$('#' + uniqueId + ' .monthly-day-wrap').append('<a href="#" class="monthly-day monthly-day-pick" data-number="'+day+'"><div class="monthly-day-number">'+day+'</div><div class="monthly-indicator-wrap"></div></a>');
					}
				}
			}
			

			// Set Today
			var setMonth = $('#' + uniqueId).data('setMonth'),
				setYear = $('#' + uniqueId).data('setYear');
			if (setMonth == currentMonth && setYear == currentYear) {
				$('#' + uniqueId + ' *[data-number="'+currentDay+'"]').addClass('monthly-today');
			}

			// Reset button
			if (setMonth == currentMonth && setYear == currentYear) {
				$('#' + uniqueId + ' .monthly-header-title').html(monthNames[m - 1] +' '+ y);
			} else {
				$('#' + uniqueId + ' .monthly-header-title').html(monthNames[m - 1] +' '+ y +'<a href="#" class="monthly-reset" title="Back To This Month"></a> ');
			}

			// Account for empty days at start
			if(options.weekStart == 'Sun' && firstDay != 7) {
				for(var i = 0; i < firstDay; i++) {
					$('#' + uniqueId + ' .monthly-day-wrap').prepend('<div class="monthly-day-blank"><div class="monthly-day-number"></div></div>');
				}
			} else if (options.weekStart == 'Mon' && firstDay == 0) {
				for(var i = 0; i < 6; i++) {
					$('#' + uniqueId + ' .monthly-day-wrap').prepend('<div class="monthly-day-blank" ><div class="monthly-day-number"></div></div>');
				}
			} else if (options.weekStart == 'Mon' && firstDay != 1) {
				for(var i = 0; i < (firstDay - 1); i++) {
					$('#' + uniqueId + ' .monthly-day-wrap').prepend('<div class="monthly-day-blank" ><div class="monthly-day-number"></div></div>');
				}
			}

			//Account for empty days at end
			var numdays = $('#' + uniqueId + ' .monthly-day').length,
				numempty = $('#' + uniqueId + ' .monthly-day-blank').length,
				totaldays = numdays + numempty,
				roundup = Math.ceil(totaldays/7) * 7,
				daysdiff = roundup - totaldays;
			if(totaldays % 7 != 0) {
				for(var i = 0; i < daysdiff; i++) {
					$('#' + uniqueId + ' .monthly-day-wrap').append('<div class="monthly-day-blank"><div class="monthly-day-number"></div></div>');
				}
			}

			// Events
			if (options.mode == 'event') {
				// Remove previous events
				// Add Events
				$.get(''+options.xmlUrl+'', function(d){
					$(d).find('event').each(function(){
						// Year [0]   Month [1]   Day [2]
						var fullstartDate = $(this).find('startdate').text(),
							startArr = fullstartDate.split("-"),
							startYear = startArr[0],
							startMonth = parseInt(startArr[1], 10),
							startDay = parseInt(startArr[2], 10),
							fullendDate = $(this).find('enddate').text(),
							endArr = fullendDate.split("-"),
							endYear = endArr[0],
							endMonth = parseInt(endArr[1], 10),
							endDay = parseInt(endArr[2], 10),
							eventURL = $(this).find('url').text(),
							eventOc = $(this).find('oc').text(),
							eventDis = $(this).find('dis').text(),
							eventYa = $(this).find('yareservada').text(),
							eventPres = $(this).find('sepuedereservar').text(),
							eventPcan = $(this).find('sepuedecancelar').text(),
							eventDisCol = $(this).find('discol').text(),
							eventAf = $(this).find('af').text(),
							eventAfcol = $(this).find('afcol').text(),
							eventTitle = $(this).find('name').text(),
							eventColor = $(this).find('color').text(),
							eventId = $(this).find('id').text(),
							startTime = $(this).find('starttime').text(),
							startSplit = startTime.split(":");
							startPeriod = 'AM',
							endTime = $(this).find('endtime').text(),
							endSplit = endTime.split(":");
							endPeriod = 'AM',
							eventLink = '';

						/* Convert times to 12 hour & determine AM or PM */
						if(parseInt(startSplit[0]) >= 12) {
							var startTime = (startSplit[0] - 12)+':'+startSplit[1]+'';
							var startPeriod = 'PM'
						}
						

						if(parseInt(startTime) == 0) {
							var startTime = '12:'+startSplit[1]+'';
						}

						if(parseInt(endSplit[0]) >= 12) {
							var endTime = (endSplit[0] - 12)+':'+endSplit[1]+'';
							var endPeriod = 'PM'
						}
						if(parseInt(endTime) == 0) {
							var endTime = '12:'+endSplit[1]+'';
						}
						if (eventURL){
							var eventLink = 'href="'+eventURL+'"';
						}

						// function to print out list for multi day events
						var colordis = 'color:green;';
						if(eventDis==0){
							colordis = 'color:red;';
						}
						var colorcola = 'color:green;';
						if(eventDisCol==0){
							colorcola = 'color:red;';
						}
						var backgr = 'background-color: lightgray;';
						if(eventYa=='SI'){
							backgr = 'background-color: palegreen;';
						}
						var coloraforo = 'color: black;';
						if(eventPcan=='NO' && eventPres=='NO'){
							colorcola = 'color:transparent;';
							colordis = 'color:transparent;';
							backgr = 'background-color: gray; color: lightgray !important;'
							coloraforo = 'color: transparent;';
						}
						if(eventPcan=='NO' && eventYa=='SI'){
							colorcola = 'color:transparent;';
							colordis = 'color:transparent;';
							backgr = 'background-color: gray; color: lightgray !important;'
							coloraforo = 'color: transparent;';
						}
						var cadaction = '';
						if(eventYa=='SI'){
							cadaction = '<i onclick="deleteMiReserva('+eventId+');" class="fa fa-ban" style="cursor:pointer; font-size: 35px; margin-top: 3px; float: left; margin-right: 11px;"></i>';
							if(eventPcan=='NO'){
								cadaction = '';
							}
						}
						if(eventYa=='NO'){
							cadaction = '<i onclick="addReservaCliente('+eventId+');" class="fa fa-plus-square" style="cursor:pointer; font-size: 35px; margin-top: 3px; float: left; margin-right: 11px;"></i>';
							if(eventPres=='NO'){
								cadaction = '';
							}
						}
						function multidaylist(){
							if(eventColor==''){
							    $('#'+uniqueId+' .monthly-list-item[data-number="'+i+'"]').addClass('item-has-event').append('<div class="listed-event"  data-eventid="'+ eventId +'" style="'+backgr+' border: 1px solid lightgray; border-radius: 7px; margin-left: auto; margin-right: auto; overflow: auto; padding-top: 0; width: 100%;"><div style="margin-top: 0px; overflow: auto; width: -moz-max-content; float: left;">'+cadaction+'<div id="contentActivity" style="margin-top: 0px; overflow: auto; width: -moz-max-content; float: left;"><span style="min-width: 165px; overflow: auto; margin-right: 14px; cursor: pointer; float: left; clear: both; display: block;">'+eventTitle+'</span><div style="overflow: auto; float: left; clear: left;"><div class="monthly-list-time-start">'+startTime+' '+startPeriod+'</div><div class="monthly-list-time-end">'+endTime+' '+endPeriod+'</div></div></div><div id="contentActions" style="overflow: auto; width: 400px; float: left;"><div id="contentPlazas" style="overflow: auto; width: 200px;"><span style="font-size: 11px; font-weight: 600; text-transform: uppercase; display: block; float: left; padding-top: 3px; margin-left: 0px; '+colordis+'">Plazas disponibles: '+eventDis+'</span><span style="font-size: 11px; font-weight: 600; text-transform: uppercase; display: block; float: left; margin-left: 0px; '+colorcola+'">Plazas en la cola: '+eventDisCol+'</span></div><div id="contentAforo" style="overflow: auto; width: 140px; float: left; margin-top: 1px;"><span style="font-size: 11px; text-transform: uppercase; padding-top: 2px; display: block; float: left; margin-left: 0px; '+coloraforo+'">Aforo: '+eventAf+'</span><span style="font-size: 11px; text-transform: uppercase; display: block; float: left; margin-left: 0px; '+coloraforo+'">Aforo de la cola: '+eventAfcol+'</span></div></div></div>');
							                                                
							}
						
						}
						
						var cuidador = false;
						for(var i=0; i<titulos.length; i++){
							if(titulos[i]==eventTitle+startDay+startMonth+startYear){
								cuidador = true;
							}
						}

						if(!cuidador){
							titulos.push(eventTitle+startDay+startMonth+startYear);
						}

						// If event is one day & within month
						if (!fullendDate && startMonth == setMonth && startYear == setYear) {
							if(eventColor==''){
							if(!cuidador){
							// Add Indicators
							if (eventTitle.indexOf("BOX") >= 0){
								$('#'+uniqueId+' *[data-number="'+startDay+'"] .monthly-indicator-wrap').append('<div class="monthly-event-indicator"  data-eventid="'+ eventId +'" style="background: #b9e164;" title="'+eventTitle+'">'+eventTitle+'</div>');
							// Print out event list for single day event
							}else{
								$('#'+uniqueId+' *[data-number="'+startDay+'"] .monthly-indicator-wrap').append('<div class="monthly-event-indicator"  data-eventid="'+ eventId +'" style="background:'+eventColor+'" title="'+eventTitle+'">'+eventTitle+'</div>');

							}
							}
							//BONO EN TARIFAS
							//EDITAR NOMBRE DE ACTIVIDADES
							//PREVALIDACION DNIS
							$('#'+uniqueId+' .monthly-list-item[data-number="'+startDay+'"]').addClass('item-has-event').append('<div class="listed-event"  data-eventid="'+ eventId +'" style="'+backgr+' border: 1px solid lightgray; border-radius: 7px; margin-left: auto; margin-right: auto; overflow: auto; padding-top: 0; width: 100%;"><div style="margin-top: 0px; overflow: auto; width: -moz-max-content; float: left;">'+cadaction+'<div id="contentActivity" style="margin-top: 0px; overflow: auto; width: -moz-max-content; float: left;"><span style="min-width: 165px; overflow: auto; margin-right: 14px; cursor: pointer; float: left; clear: both; display: block;">'+eventTitle+'</span><div style="overflow: auto; float: left; clear: left;"><div class="monthly-list-time-start">'+startTime+' '+startPeriod+'</div><div class="monthly-list-time-end">'+endTime+' '+endPeriod+'</div></div></div><div id="contentActions" style="overflow: auto; width: 400px; float: left;"><div id="contentPlazas" style="overflow: auto; width: 200px;"><span style="font-size: 11px; font-weight: 600; text-transform: uppercase; display: block; float: left; padding-top: 3px; margin-left: 0px; '+colordis+'">Plazas disponibles: '+eventDis+'</span><span style="font-size: 11px; font-weight: 600; text-transform: uppercase; display: block; float: left; margin-left: 0px; '+colorcola+'">Plazas en la cola: '+eventDisCol+'</span></div><div id="contentAforo" style="overflow: auto; width: 140px; float: left; margin-top: 1px;"><span style="font-size: 11px; text-transform: uppercase; padding-top: 2px; display: block; float: left; margin-left: 0px; '+coloraforo+'">Aforo: '+eventAf+'</span><span style="font-size: 11px; text-transform: uppercase; display: block; float: left; margin-left: 0px; '+coloraforo+'">Aforo de la cola: '+eventAfcol+'</span></div></div></div>');
							//.append('<div class="listed-event" data-eventid="'+ eventId +'" style="'+backgr+' padding-top:0px;"><span style="min-width: 165px; float: left; overflow: auto; margin-right: 14px;">'+eventTitle+'</span><div style="overflow:auto; width:400px;">'+cadaction+'<div style="overflow: auto; width: 200px; float: left;"><span style="font-size: 11px; font-weight: 600; text-transform: uppercase; display: block; float: left; padding-top: 3px; margin-left: 20px; '+colordis+'">Plazas disponibles: '+eventDis+'</span><span style="font-size: 11px; font-weight: 600; text-transform: uppercase; display: block; float: left; margin-left: 20px; '+colorcola+'">Plazas en la cola: '+eventDisCol+'</span></div><div style="overflow: auto; width: 140px; float: left; margin-top: 1px;"><span style="font-size: 11px; text-transform: uppercase; padding-top: 2px; display: block; float: left; margin-left: 20px; '+coloraforo+'">Aforo: '+eventAf+'</span><span style="font-size: 11px; text-transform: uppercase; display: block; float: left; margin-left: 20px; '+coloraforo+'">Aforo de la cola: '+eventAfcol+'</span></div></div><div style="width: auto; float: none; margin-top: -17px; max-width: 165px;"><div class="monthly-list-time-start">'+startTime+' '+startPeriod+'</div><div class="monthly-list-time-end">'+endTime+' '+endPeriod+'</div></div></div>');
							}else{
								$('#'+uniqueId+' *[data-number="'+startDay+'"] .monthly-indicator-wrap').append('<div class="monthly-event-indicator"  data-eventid="'+ eventId +'" style="background: #fbb6b6; font-size:22px; height:auto; white-space: normal;" title="'+eventTitle+'">'+eventTitle+'</div>');
								$('#'+uniqueId+' *[data-number="'+startDay+'"] .monthly-indicator-wrap').parent().css('background-color','#fbb6b6');
							}
							

						// If event is multi day & within month
						} else if (startMonth == setMonth && startYear == setYear && endMonth == setMonth && endYear == setYear){
							for(var i = parseInt(startDay); i <= parseInt(endDay); i++) {
								// If first day, add title 
								if (i == parseInt(startDay)) {
									$('#'+uniqueId+' *[data-number="'+i+'"] .monthly-indicator-wrap').append('<div class="monthly-event-indicator" data-eventid="'+ eventId +'" style="background:'+eventColor+'" title="'+eventTitle+'">'+eventTitle+'</div>');
								} else {
									$('#'+uniqueId+' *[data-number="'+i+'"] .monthly-indicator-wrap').append('<div class="monthly-event-indicator" data-eventid="'+ eventId +'" style="background:'+eventColor+'" title="'+eventTitle+'"></div>');
								}
								multidaylist();
							}

						// If event is multi day, starts in prev month, and ends in current month
						} else if ((endMonth == setMonth && endYear == setYear) && ((startMonth < setMonth && startYear == setYear) || (startYear < setYear))) {
							for(var i = 0; i <= parseInt(endDay); i++) {
								// If first day, add title 
								if (i==1){
									$('#'+uniqueId+' *[data-number="'+i+'"] .monthly-indicator-wrap').append('<div class="monthly-event-indicator" data-eventid="'+ eventId +'" style="background:'+eventColor+'" title="'+eventTitle+'">'+eventTitle+'</div>');
								} else {
									$('#'+uniqueId+' *[data-number="'+i+'"] .monthly-indicator-wrap').append('<div class="monthly-event-indicator" data-eventid="'+ eventId +'" style="background:'+eventColor+'" title="'+eventTitle+'"></div>');
								}
								multidaylist();
							}

						// If event is multi day, starts in this month, but ends in next
						} else if ((startMonth == setMonth && startYear == setYear) && ((endMonth > setMonth && endYear == setYear) || (endYear > setYear))){
							for(var i = parseInt(startDay); i <= dayQty; i++) {
								// If first day, add title 
								if (i == parseInt(startDay)) {
									$('#'+uniqueId+' *[data-number="'+i+'"] .monthly-indicator-wrap').append('<div class="monthly-event-indicator" data-eventid="'+ eventId +'" style="background:'+eventColor+'" title="'+eventTitle+'">'+eventTitle+'</div>');
								} else {
									$('#'+uniqueId+' *[data-number="'+i+'"] .monthly-indicator-wrap').append('<div class="monthly-event-indicator" data-eventid="'+ eventId +'" style="background:'+eventColor+'" title="'+eventTitle+'"></div>');
								}
								multidaylist();
							}

						// If event is multi day, starts in a prev month, ends in a future month
						} else if (((startMonth < setMonth && startYear == setYear) || (startYear < setYear)) && ((endMonth > setMonth && endYear == setYear) || (endYear > setYear))){
							for(var i = 0; i <= dayQty; i++) {
								// If first day, add title 
								if (i == 1){
									$('#'+uniqueId+' *[data-number="'+i+'"] .monthly-indicator-wrap').append('<div class="monthly-event-indicator" data-eventid="'+ eventId +'" style="background:'+eventColor+'" title="'+eventTitle+'">'+eventTitle+'</div>');
								} else {
									$('#'+uniqueId+' *[data-number="'+i+'"] .monthly-indicator-wrap').append('<div class="monthly-event-indicator" data-eventid="'+ eventId +'" style="background:'+eventColor+'" title="'+eventTitle+'"></div>');
								}
								multidaylist();
							}

						}
					});
				});

			}
			
		}

		// Set the calendar the first time
		setMonthly(currentMonth, currentYear);

		// Function to go back to the month view
		function viewToggleButton(){
			if($('#'+uniqueId+' .monthly-event-list').is(":visible")) {
				$('#'+uniqueId+' .monthly-cal').remove();
				$('#'+uniqueId+' .monthly-header-title').prepend('<a href="#" class="monthly-cal" title="Back To Month View"><div></div></a>');
			}
		}

		// Advance months
		$(document.body).on('click', '#'+uniqueId+' .monthly-next', function (e) {
			titulos.length=0;
			var setMonth = $('#' + uniqueId).data('setMonth'),
				setYear = $('#' + uniqueId).data('setYear');
			if (setMonth == 12) {
				var newMonth = 1,
					newYear = setYear + 1;
				setMonthly(newMonth, newYear);
			} else {
				var newMonth = setMonth + 1,
					newYear = setYear;
				setMonthly(newMonth, newYear);
			}
			viewToggleButton();
			e.preventDefault();
		});

		// Go back in months
		$(document.body).on('click', '#'+uniqueId+' .monthly-prev', function (e) {
			titulos.length=0;
			var setMonth = $('#' + uniqueId).data('setMonth'),
				setYear = $('#' + uniqueId).data('setYear');
			if (setMonth == 1) {
				var newMonth = 12,
					newYear = setYear - 1;
				setMonthly(newMonth, newYear);
			} else {
				var newMonth = setMonth - 1,
					newYear = setYear;
				setMonthly(newMonth, newYear);
			}
			viewToggleButton();
			e.preventDefault();
		});

		// Reset Month
		$(document.body).on('click', '#'+uniqueId+' .monthly-reset', function (e) {
			setMonthly(currentMonth, currentYear);
			viewToggleButton();
			e.preventDefault();
			e.stopPropagation();
		});

		// Back to month view
		$(document.body).on('click', '#'+uniqueId+' .monthly-cal', function (e) {
			$(this).remove();
				$('#' + uniqueId+' .monthly-event-list').css('transform','scale(0)').delay('800').hide();
			e.preventDefault();
		});

		// Click A Day
		$(document.body).on('click', '#'+uniqueId+' a.monthly-day', function (e) {
			
			// If events, show events list
			if(options.mode == 'event' && options.eventList == true) {
				var whichDay = $(this).data('number');
				$('#' + uniqueId+' .monthly-event-list').show();
				$('#' + uniqueId+' .monthly-event-list').css('transform');
				$('#' + uniqueId+' .monthly-event-list').css('transform','scale(1)');
				//cai$('#'+uniqueId+' .monthly-list-item[data-number="'+whichDay+'"]').show();

				var myElement = document.getElementById(uniqueId+'day'+whichDay);
				var topPos = myElement.offsetTop;
				//document.getElementByClassname('scrolling_div').scrollTop = topPos;
				$('#'+uniqueId+' .monthly-event-list').scrollTop(topPos);
				viewToggleButton();
			// If picker, pick date
			} else if (options.mode == 'picker') {
				var whichDay = $(this).data('number'),
				setMonth = $('#' + uniqueId).data('setMonth'),
				setYear = $('#' + uniqueId).data('setYear');

				// Should days in the past be disabled?
				if($(this).hasClass('monthly-past-day') && options.disablePast == true) {
					// If so, don't do anything.
					e.preventDefault();
				} else {
					// Otherwise, select the date ...
					$(''+options.target+'').val(setMonth+'/'+whichDay+'/'+setYear);
					// ... and then hide the calendar if it started that way
					if(options.startHidden == true) {
						$('#'+uniqueId).hide();
					}
				}
			}
			e.preventDefault();
		
		});
		
		// Clicking an event within the list
		/*$(document.body).on('click', '#'+uniqueId+' .listed-event', function (e) {
			var href = $(this).attr('href');
			// If there isn't a link, don't go anywhere
			if(!href) {
				e.preventDefault();
			}
		});*/

		}
	});
})(jQuery);
