window.opkey_trigger = "FAKE_PASS";
window.element_guid = "";

function opkey_getTarget(e) {
	var targ;
	if (!e)
		e = window.event;
	var evType = e.type;
	if (e.target)
		targ = e.target;
	else if (e.srcElement)
		targ = e.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;
	return targ;
}

function opkey_addEvent(elem, event, fn) {
	if (elem.addEventListener) {
		elem.addEventListener(event, fn, false);
	} else {
		elem.attachEvent("on" + event, function() {
			return (fn.call(elem, window.event));
		});
	}
}

if (document.opkeyAttachedListener == null) {
	opkey_addEvent(document, "click", function(e) {
		window.opkey_trigger += "CLICK";
		var _ele = opkey_getTarget(e);
		_ele.setAttribute("opkey_elementGuid", window.element_guid);
	});
	opkey_addEvent(document, "mousedown", function(e) {
		window.opkey_trigger += "MOUSEDOWN";
		var _ele = opkey_getTarget(e);
		_ele.setAttribute("opkey_elementGuid", window.element_guid);
	});
	opkey_addEvent(document, "mouseup", function(e) {
		window.opkey_trigger += "MOUSEUP";
		var _ele = opkey_getTarget(e);
		_ele.setAttribute("opkey_elementGuid", window.element_guid);
	});
	document.opkeyAttachedListener = true;
}

function opkey_setIdentifierOnElement(element, _guid) {
	window.element_guid = _guid;
	if (element.opkeyAttachedListener == null) {
		opkey_addEvent(element, "click", function(e) {
			element.setAttribute("opkey_elementGuid", window.element_guid);
			var ele2 = opkey_getTarget(e);
			ele2.setAttribute("opkey_elementGuid", window.element_guid);
		});
		opkey_addEvent(element, "mousedown", function(e) {
			element.setAttribute("opkey_elementGuid", window.element_guid);
			var ele2 = opkey_getTarget(e);
			ele2.setAttribute("opkey_elementGuid", window.element_guid);
		});
		opkey_addEvent(element, "mouseup", function(e) {
			element.setAttribute("opkey_elementGuid", window.element_guid);
			var ele2 = opkey_getTarget(e);
			ele2.setAttribute("opkey_elementGuid", window.element_guid);
		});
		element.opkeyAttachedListener = true;
	}
}
