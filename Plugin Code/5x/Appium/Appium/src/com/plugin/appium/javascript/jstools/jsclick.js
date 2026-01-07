var controlKeyDown = false;
var altKeyDown = false;
var shiftKeyDown = false;
var metaKeyDown = false;

function opkey_triggerMouseEvent(element, eventType, canBubble, clientX,
		clientY, button) {
	clientX = clientX ? clientX : 0;
	clientY = clientY ? clientY : 0;
	var screenX = 0;
	var screenY = 0;

	canBubble = (typeof (canBubble) == undefined) ? true : canBubble;
	var evt;
	if (element.fireEvent && element.ownerDocument
			&& element.ownerDocument.createEventObject) { // IE
		evt = element.ownerDocument.createEventObject(element, controlKeyDown,
				altKeyDown, shiftKeyDown, metaKeyDown);
		evt.detail = 0;
		evt.button = button ? button : 1; // default will be the left mouse
		// click (
		// http://www.javascriptkit.com/jsref/event.shtml
		// )
		evt.relatedTarget = null;
		if (!screenX && !screenY && !clientX && !clientY && !controlKeyDown
				&& !altKeyDown && !shiftKeyDown && !metaKeyDown) {
			element.fireEvent('on' + eventType);
		} else {
			evt.screenX = screenX;
			evt.screenY = screenY;
			evt.clientX = clientX;
			evt.clientY = clientY;
			try {
				window.event = evt;
			} catch (e) {
			}
			element.fireEvent('on' + eventType, evt);
		}
	} else {
		var doc = (element.ownerDocument || element.document);
		var view = (doc.parentWindow || doc.defaultView);

		evt = doc.createEvent('MouseEvents');
		if (evt.initMouseEvent) {
			evt.initMouseEvent(eventType, canBubble, true, view, 1, screenX,
					screenY, clientX, clientY, controlKeyDown, altKeyDown,
					shiftKeyDown, metaKeyDown, button ? button : 0, null);
		} else {
			evt.initEvent(eventType, canBubble, true);
			evt.shiftKey = shiftKeyDown;
			evt.metaKey = metaKeyDown;
			evt.altKey = altKeyDown;
			evt.ctrlKey = controlKeyDown;
			if (button) {
				evt.button = button;
			}
		}
		element.dispatchEvent(evt);
	}
}

function performOpKeyClick(element) {
	try {
		var savedEvent = null;
		element.addEventListener("click", function(evt) {
			savedEvent = evt;
		}, false);
	} catch (e) {

	}

	opkey_triggerMouseEvent(element, "click", true);
	opkey_triggerMouseEvent(element, "mousedown", true);
	window.setTimeout(function() {
		opkey_triggerMouseEvent(element, "mouseup", true);
	}, 300);
}

function performWaitAndClick(element, _interval) {
	window.setTimeout(function(){
		performOpKeyClick(element);
	},_interval);
}

function performMouseOver(element) {
	opkey_triggerMouseEvent(element, "mouseover", true);
}

function opkey_triggerEvent(element, eventtype) {
	opkey_triggerMouseEvent(element, eventtype, true);
}