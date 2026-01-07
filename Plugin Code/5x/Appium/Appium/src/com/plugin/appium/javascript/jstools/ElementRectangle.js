function opkey_getElementRectangle(el) {
	var top = el.offsetTop;
	var left = el.offsetLeft;
	var width = el.offsetWidth;
	var height = el.offsetHeight;

	while (el.offsetParent) {
		el = el.offsetParent;
		top += el.offsetTop;
		left += el.offsetLeft;
	}
	var _windowWidth=window.innerWidth;
	var _windowHeight=window.innerHeight;
	
	var _point="{\"X\":"+left+", \"Y\":"+top+", \"Width\":"+width+", \"Height\":"+height+", \"WindowWidth\":"+_windowWidth+", \"WindowHeight\":"+_windowHeight+"}";
	return _point;
}


function opkey_getElementSize(el) {
	var top = 0;
	var left = 0;
	var width = el.offsetWidth;
	var height = el.offsetHeight;

	var _windowWidth=0;
	var _windowHeight=0;
	
	var _point="{\"X\":"+left+", \"Y\":"+top+", \"Width\":"+width+", \"Height\":"+height+", \"WindowWidth\":"+_windowWidth+", \"WindowHeight\":"+_windowHeight+"}";
	return _point;
}