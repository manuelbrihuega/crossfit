var isPlaying = false;

function play_sound(sound) {
	if(!document.getElementById('taxibleaudio')){
		var soundPlayer = document.createElement("audio");
		soundPlayer.setAttribute('id','taxibleaudio');
		soundPlayer.volume = 1;
		soundPlayer.setAttribute("src", media_url+'sounds/'+sound);
	}
	else{
		var soundPlayer = document.getElementById('taxibleaudio');
	}
	if (!isPlaying){
		isPlaying = true
		soundPlayer.play();
		setTimeout(function(){
			isPlaying=false;
		}, 2000);
	}
	return 0;
}

