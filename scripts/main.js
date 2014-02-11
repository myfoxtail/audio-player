window.onload = function() {
	var backMediaEl = document.getElementById('background-media')
		, voiceMediaEl = document.getElementById('voice-media')
		, playControlEl = document.getElementById('play-control')
		, voicePlayedEl = document.getElementById('voice-played')
		, timeShiftEl = document.getElementById('time-shift')
		, shift = 0
		, _voiceTrackLength = 400
		, _secToPix = 20
		, duration = backMediaEl.duration;

	document.getElementById('back-track').style.width = duration * _secToPix + 'px';

	//делаем элемент перетаскиваемым по горизонтали
	setDraggable( document.getElementById('back-track'), function(pos){
		backMediaEl.currentTime -= pos/_secToPix;
		shift = pos/20;
		if( backMediaEl.currentTime < voiceMediaEl.currentTime ) {
			backMediaEl.pause();
			setTimeout(function(){ backMediaEl.play(); }
				, (shift - voiceMediaEl.currentTime) * 1000);
		}
		timeShiftEl.innerHTML = pos/20 + ' sec';
	});

	/**
	 * Function playAudioTracks
	 * Проверка при начальном воспроизведении на сдвиг треков
	 *
	 * @param {Number} shift
	 */
	function playAudioTracks(shift) {
		playControlEl.className = 'paused';
		playControlEl.title = 'Pause';
		if( shift < 0 ) {
			backMediaEl.currentTime = 0;
			backMediaEl.play();
			setTimeout(function(){voiceMediaEl.play(); console.log(Math.abs(shift))}, Math.abs(shift) * 1000);
			return;
		}
		voiceMediaEl.play();
		setTimeout(function(){backMediaEl.play();}, shift * 1000);
	}

	playControlEl.onclick = function() {
		if( !backMediaEl.currentTime || !voiceMediaEl.currentTime ) {
			playAudioTracks(shift);
			return;
		}
		if( backMediaEl.paused ) {
			backMediaEl.play();
			voiceMediaEl.play();
			playControlEl.className = 'paused';
			playControlEl.title = 'Pause';
		} else {
			backMediaEl.pause();
			voiceMediaEl.pause();
			playControlEl.className = '';
			playControlEl.title = 'Play';

		}
	};

	//отображение величины сыгранного проигрываемого трека
	voiceMediaEl.addEventListener('timeupdate', function(){
		voicePlayedEl.style.width = voiceMediaEl.currentTime * _voiceTrackLength / duration + 'px';
	})
};

/**
 * Function setDraggable
 * Сделать элемент перетаскиваемым по оси x
 *
 * @param {Node} obj
 * @param {Function} callback
 */
function setDraggable( obj, callback ) {
	var dom
		, dragdom = dom = obj
		, start
		, startM = dragdom.style.marginLeft.replace('px', '') * 1
		, setpos = function( pos ) {
			startM += pos;
			dragdom.style.marginLeft = startM + "px";
		}
		, downF = function() {
			document.addEventListener('mousemove', moveF);
			document.addEventListener('mouseup', upF);
			return false;
		}, moveF = function(e) {
			e = e || window.event;
			if( !start ) start = e.clientX;
			setpos(e.clientX - start);
			start = e.clientX;
		}, upF = function() {
			document.removeEventListener('mousemove', moveF);
			document.removeEventListener('mouseup', upF);
			callback(dragdom.style.marginLeft.replace('px', '') * 1);
			start = null;
		};
	dom.addEventListener('mousedown', downF);
}