var ShadowDom = function() {

}

ShadowDom.prototype.attachShadowEvents = function(_element) {
	if (_element.hasAttached)
		return;
	_element.addEventListener("click", function(e) {
		alert("Clicked " + e.target.nodeName);
	});
	_element.hasAttached = true;
};
