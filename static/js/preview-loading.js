function GLOBAL_fadeOut(el, speed = 50) {
	var ele = null;
	if (typeof el == 'string') {
		ele = document.getElementById(ele);
	} else {
		ele = el;
	}
	if (!ele) {
		return;
	}
	var opacitynum = ele.style.opacity || 1;
	var speed = speed / 100 || 10;
	function opacityOff() {
		if (opacitynum > 0) {
			ele.style.opacity = opacitynum = (opacitynum - 0.01).toFixed(2);
		} else {
			clearInterval(opacityt);
			ele.style.display = 'none';
		}
	}
	var opacityt = setInterval(opacityOff, speed);
}
window.addEventListener('load', function(event) {
	GLOBAL_fadeOut('preview_loading', 50);
});
