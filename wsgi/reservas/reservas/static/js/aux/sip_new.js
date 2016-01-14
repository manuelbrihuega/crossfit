
_Session = null;
var ws_was_connected = false;
var coolPhone;
var register_checkbox = $("#register");
var soundPlayer = document.createElement("audio");
soundPlayer.volume = 1;


function startsip(configuration) {
		
	try { coolPhone = new JsSIP.UA(configuration);} 
	catch(e) {
	    console.log(e.toString());
		return;
	}
	
	coolPhone.on('connected', function(e){
		$('#conexion').html('<span class="label label-success">CONECTADO</span>');
		GUI.setStatus("connected");
		ws_was_connected = true;
	});

	coolPhone.on('disconnected', function(e){
		$('#conexion').html('<span class="label label-danger">DESCONECTADO</span>');
		GUI.setStatus("disconnected");
        $("#sessions > .session").each(function(i, session) {
        	GUI.removeSession(session, 500);
        });
        if (! ws_was_connected) { alert("WS connection error:\n\n- WS close code: " + e.data.code + "\n- WS close reason: " + e.data.reason); }
	});
	
	coolPhone.on('registered', function(e){
		GUI.setStatus("registered");
	});
	
	coolPhone.on('unregistered', function(e){
		GUI.setStatus("unregistered");
	});
    
	coolPhone.on('registrationFailed', function(e){
		$('#registro').html('<span class="label label-warning">REGISTRO FALLIDO</span>');
	});
	
    coolPhone.on('newRTCSession', function(e) {
    	_Session = e.data.session;
		// var origen = e.data.session.remote_identity.display_name || e.data.session.remote_identity.uri.user;
		// var destino = '910082130';
		// llamadaEntrante(origen,destino);
      	GUI.new_session(e)
    });

	// coolPhone.on('newMessage', function(e){ });

	coolPhone.start();
}

function sonido(file) {
	soundPlayer.setAttribute("src", base_url+"assets/sonidos/desk/"+file);
  	soundPlayer.play();
}


window.GUI = {

    setStatus : function(status) {
      if(status == "registered") $('#registro').html('<span class="label label-success">REGISTRADO</span>');
      if(status == "unregistered") $('#registro').html('<span class="label label-danger">NO REGISTRADO</span>');
      if(status == "connected") $('#conexion').html('<span class="label label-success">CONECTADO</span>');
	  if(status == "disconnected") $('#conexion').html('<span class="label label-danger">DESCONECTADO</span>');
    },
    removeSession : function(session, time, force) {
     	$(session).fadeTo(time, 0.7, function() {
      		$(session).slideUp(100, function() {
        		$(session).remove();
        	});
      	});
    },
    jssipCall : function(target) {
        try {
			coolPhone.call(target, {
          		mediaConstraints: { audio: true, video:false },
			  	RTCConstraints: {"optional": [{'DtlsSrtpKeyAgreement': 'true'}]}
			});
        } catch(e){
          	throw(e);
          	return;
        }
    },
    getSession : function(uri) {
    	var session_found = null;
      	$("#sessions > .session").each(function(i, session) {
        	if (uri == $(this).find(".peer > .uri").text()) {
          		session_found = session;
          		return false;
        	}
      	});
      	if (session_found) return session_found;
      	else return false;
    },
	createSession : function(display_name, uri) {
		var session = $('<div></div>').attr('class','session'); 									$('#sessions').append(session);
			var wrapper = $('<div></div>').attr('class','wrapper'); 								session.append(wrapper);
				var peer = $('<div></div>').attr('class','peer'); 									wrapper.append(peer);
					var dn = $('<span></span>').attr('class','display-name').text(display_name); 	peer.append(dn);
					var un = $('<span></span>').attr('class','uri').text(uri); 						peer.append(un);
				var call = $('<div></div>').attr('class','call inactive'); 							wrapper.append(call);
					var dial = $('<div></div>').attr('class','btn btn-success dial');				call.append(dial);
						var i = $('<i></i>').attr('class','icon-phone');							dial.append(i);
					var hangup = $('<div></div>').attr('class','btn btn-danger hangup');			call.append(hangup);
						var i = $('<i></i>').attr('class','icon-phone icon-rotate-135');			hangup.append(i);
					var st = $('<div></div>').attr('class','call-status');			call.append(st);
		
	   
		
	    session.fadeIn(100);
	    return session;
		
		
	},
    setCallSessionStatus : function(session, status, description) {
      var session = session;
      var uri = $(session).find(".peer > .uri").text();
      var call = $('.call');
      var status_text = $(session).find(".call-status");
      var button_dial = $(session).find(".btn.dial");
      var button_hangup = $(session).find(".btn.hangup");

      button_dial.unbind("click");
      button_hangup.unbind("click");

      if (session.call && session.call.status !== JsSIP.C.SESSION_TERMINATED) {
		  button_hangup.click(function() {
			  GUI.setCallSessionStatus(session, "terminated", "terminated");
          	  session.call.terminate();
			  GUI.removeSession(session, 500);
		  });
      }

	  switch(status) {
	  	case "inactive":
			$('.call').removeClass().addClass("call inactive");
			$('.dial').show();
			$('.hangup').hide();
          	status_text.text("");

          	button_dial.click(function() {
            	GUI.jssipCall(uri);
          	});
			
			break;

        case "trying":
			$('.call').removeClass().addClass("call trying");
			$('.dial').hide();
			$('.hangup').show();
          	status_text.text(description || "Intentando...");
			break;

        case "in-progress":
          	$('.call').removeClass().addClass("call in-progress");
			$('.dial').hide();
			$('.hangup').show();
          	status_text.text(description || "En prograso...");
			sonido('outgoing-call2.ogg');
			break;

        case "answered":
          	$('.call').removeClass().addClass("call answered");
			$('.dial').hide();
			$('.hangup').show();
          	status_text.text(description || "Contestada");
			break;

        case "terminated":
          	$('.call').removeClass().addClass("call terminated");
			$('.dial').hide();
			$('.hangup').hide();
          	status_text.text(description || "Terminada");
          	button_hangup.unbind("click");
			break;

        case "incoming":
          	$('.call').removeClass().addClass("call incoming");
			$('.dial').show();
			$('.hangup').show();
          	status_text.text("Llamada entrante...");
			sonido('incoming-call2.ogg');
          	button_dial.click(function() {
            	session.call.answer({
              	  mediaConstraints: { audio: true, video: false }
            	});
          	});
			break;

        default:
          	alert("ERROR: setCallSessionStatus() called with unknown status '" + status + "'");
          	break;
      	}
		
    },
    new_session : function(e) { 
		
		var request = e.data.request;
		var call = e.data.session;
		var uri = call.remote_identity.uri;
		var session = GUI.getSession(uri);
		var display_name = call.remote_identity.display_name || call.remote_identity.uri.user;
		
      	if (call.direction === 'incoming') var status = "incoming";
		else var status = "trying";
    
      	if (session && !$(session).find(".call").hasClass("inactive")) {
        	call.terminate();
        	return false;
      	}

      	if (!session) session = GUI.createSession(display_name, uri); 

      	session.call = call;
      	GUI.setCallSessionStatus(session, status);
     
      	call.on('progress',function(e){
			if (e.data.originator === 'remote') GUI.setCallSessionStatus(session, 'in-progress');
      	});

      	call.on('started',function(e){
			
			if ( call.getLocalStreams().length > 0) {
				// selfView.src = window.URL.createObjectURL(call.getLocalStreams()[0]);
				// selfView.volume = 0;
			}
			if ( call.getRemoteStreams().length > 0) {
				//remoteView.src = window.URL.createObjectURL(call.getRemoteStreams()[0]);
			}
			sonido("dialpad/1.ogg");
        	GUI.setCallSessionStatus(session, 'answered');
      	});
		
      	call.on('failed',function(e) {
        	var cause = e.data.cause;
			var response = e.data.response;

        	if (e.data.originator === 'remote' && cause.match("SIP;cause=200", "i")) cause = 'answered_elsewhere';

			GUI.setCallSessionStatus(session, 'terminated', cause);
			sonido("outgoing-call-rejected.wav");
        	GUI.removeSession(session, 1500);
      	});

     	call.on('newDTMF',function(e) {
			
       		if (e.data.originator === 'remote') {
         	   sound_file = e.data.dtmf.tone;
			   sonido("dialpad/" + sound_file + ".ogg");
       		}
     	});

      	call.on('ended', function(e) {
        	var cause = e.data.cause;
			GUI.setCallSessionStatus(session, "terminated", cause);
        	GUI.removeSession(session, 1500);
      	});
    }
	
  
};

