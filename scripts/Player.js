function Player() {
	var playControlEl = document.getElementById('play-control')
		, backMediaEl = document.getElementById('background-media')
		, voiceMediaEl = document.getElementById('voice-media')
		, backTrackEl = document.getElementById('back-track')
		, timeShiftEl = document.getElementById('time-shift')
		, voicePlayedEl = document.getElementById('voice-played')
		, volumeControl = document.getElementById('volume-track')
		, _secToPix = 20
		, _volumeElWidth = 47
		, _voiceTrackLength = 200
		, checkShiftInterval
		, instance = this;

	this.inited = false;
	this.shift = 0;

	/**
	 * Function switchPlayControl
	 * Установить параметры элемента контрола воспроизведения
	 *
	 * @param {String} className class
	 * @param {String} title new title for the element
	 */
	function switchPlayControl(className, title) {
		playControlEl.className = className;
		playControlEl.title = title;
	}

	/**
	 * Function setCheckShiftIntval
	 * Установить интервал проверки разницы между проигрываемыми треками
	 *
	 */
	function setCheckShiftIntval() {
		checkShiftInterval = setInterval(function(){
			if( voiceMediaEl.currentTime < instance.shift ) {
				if( !backMediaEl.paused ) backMediaEl.pause();
			} else {
				if( backMediaEl.paused ) backMediaEl.play();
			}
		}, 50);
	}

	/**
	 * Function cleanCheckShiftIntval
	 * Удалить интервал проверки разницы между проигрываемыми треками
	 *
	 */
	function cleanCheckShiftIntval() {
		clearInterval(checkShiftInterval);
	}

	/**
	 * Function updateShift
	 * Обновить сдвиг между аудио-треками
	 *
	 * @param {Number} shift
	 */
	this.updateShift = function(shift) {
		this.shift = shift/_secToPix;
		timeShiftEl.innerHTML = this.shift + ' sec';

		backMediaEl.currentTime = voiceMediaEl.currentTime - shift/_secToPix;
	};

	/**
	 * Function init
	 * Инициализация плеера
	 *
	 * @public
	 */
	this.init = function() {
		backTrackEl.style.width = backMediaEl.duration * _secToPix + 'px';
		voiceMediaEl.volume = 1;

		//отображение величины сыгранного проигрываемого трека
		voiceMediaEl.addEventListener('timeupdate', function() {
			voicePlayedEl.style.width = voiceMediaEl.currentTime * _voiceTrackLength / voiceMediaEl.duration + 'px';
		});

		playControlEl.addEventListener('click', function() {
			if( !instance.inited ) {
				switchPlayControl('paused', 'Pause');
				instance.play();
				instance.inited = true;
				return;
			}
			if( voiceMediaEl.paused ) {
				switchPlayControl('paused', 'Pause');
				instance.continuePlaying();
				return;
			}
			instance.pause();
			switchPlayControl('', 'Play');
		});

		volumeControl.addEventListener('click', function(e) {
			this.childNodes[1].style.width = e.clientX - this.offsetLeft + 'px';
			voiceMediaEl.volume = (e.clientX - this.offsetLeft) / _volumeElWidth;
		})

	};

	/**
	 * Function play
	 * Начать воспроизведение аудио(в первый раз)
	 *
	 */
	this.play = function() {
		if( this.shift < 0 ) {
			backMediaEl.currentTime = 0;
			backMediaEl.play();
			voiceMediaEl.play();
			return;
		}
		voiceMediaEl.play();
		setCheckShiftIntval();
	};

	/**
	 * Function continuePlaying
	 * Продолжить воспроизведение аудио
	 *
	 */
	this.continuePlaying = function() {
		backMediaEl.play();
		voiceMediaEl.play();
		setCheckShiftIntval();
	};

	/**
	 * Function pause
	 * Остановить воспроизведение аудио
	 *
	 */
	this.pause = function() {
		backMediaEl.pause();
		voiceMediaEl.pause();
		cleanCheckShiftIntval();
	}
}