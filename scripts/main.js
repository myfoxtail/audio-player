window.onload = function() {
	var backTrackEl = document.getElementById('back-track')
		, player = new Player();

	player.init();

	Draggable.setDraggable( backTrackEl, {
		drag: onDrag
	});

	function onDrag(shift) {
		player.updateShift(shift);
	}
};

