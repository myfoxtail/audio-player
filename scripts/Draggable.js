var Draggable = new (function(){
	/**
	 * Function setDraggable
	 * Сделать элемент перетаскиваемым по оси x
	 *
	 * @param {Node} obj
	 * @param {Object} callbacks
	 */
	this.setDraggable = function(obj, callbacks){
		var dom
			, dragdom = dom = obj
			, start
			, startM = dragdom.style.marginLeft.replace('px', '') * 1
			, setpos = function( pos ) {
				startM += pos;
				dragdom.style.marginLeft = startM + "px";
				callbacks.drag && callbacks.drag(startM);
				//shift = startM / 20;
			}
			, downF = function() {
				document.addEventListener('mousemove', moveF);
				document.addEventListener('mouseup', upF);
				callbacks.dragStart && callbacks.dragStart();
				return false;
			}, moveF = function(e) {
				e = e || window.event;
				if( !start ) start = e.clientX;

				setpos(e.clientX - start);
				start = e.clientX;
			}, upF = function() {
				document.removeEventListener('mousemove', moveF);
				document.removeEventListener('mouseup', upF);
				callbacks.dragEnd && callbacks.dragEnd();
				start = null;
			};
		dom.addEventListener('mousedown', downF);
	};
})();