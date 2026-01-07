function opkey_getClickAbleElement(_element) {
	if (_element.nodeName == "A") {
		return _element;
	}
	if (_element.nodeName == "INPUT") {
		return _element;
	}
	if (_element.nodeName == "BUTTON") {
		return _element;
	}

	if (_element.parentNode != null) {
		var parentNodeName = _element.parentNode.nodeName;
		if (parentNodeName == "A") {
			return _element.parentNode;
		}
		if (parentNodeName == "INPUT") {
			return _element.parentNode;
		}
		if (parentNodeName == "BUTTON") {
			return _element.parentNode;
		}
	}
}

function getTextContent(_element) {
	if (_element.nodeName == "TABLE") {
		return null;
	}
	if (_element.nodeName == "TBODY") {
		return null;
	}
	var _textContent = _element.innerText;
	if (_textContent == null) {
		_textContent = _element.getAttribute("value");
	}
	if (_textContent == null) {
		_textContent = _element.getAttribute("placeholder");
	}
	if (_textContent == null) {
		_textContent = _element.getAttribute("ps-placeholder");
	}
	if (_textContent == null) {
		_textContent = _element.textContent;
	}
	return _textContent;
}

function opkey_triggerFocus(element) {
	var eventType = "onfocusin" in root ? "focusin" : "focus", bubbles = "onfocusin" in root, event;

	if ("createEvent" in document) {
		event = document.createEvent("Event");
		event.initEvent(eventType, bubbles, true);
	} else if ("Event" in window) {
		event = new Event(eventType, {
			bubbles : bubbles,
			cancelable : true
		});
	}

	element.focus();
	element.dispatchEvent(event);
}


function opkey_triggerDeFocus(element) {
	var eventType = "onfocusout" in root ? "focusout" : "focus", bubbles = "onfocusout" in root, event;

	if ("createEvent" in document) {
		event = document.createEvent("Event");
		event.initEvent(eventType, bubbles, true);
	} else if ("Event" in window) {
		event = new Event(eventType, {
			bubbles : bubbles,
			cancelable : true
		});
	}

	element.blur();
	element.dispatchEvent(event);
}

function isApplicableAttributeAvailableForVisibilityCheck(element) {
	var _attributes = element.attributes;
	for (var _ai = 0; _ai < _attributes.length; _ai++) {
		var _attribute = _attributes[_ai];
		if (_attribute.nodeName == "value") {
			return true;
		}
		if (_attribute.nodeName == "data-original-title") {
			return true;
		}
		if (_attribute.nodeName == "title") {
			return true;
		}
	}
	return false;
}

function isElementIsEnable(element) {
	var _attributes = element.attributes;
	for (var _ai = 0; _ai < _attributes.length; _ai++) {
		var _attribute = _attributes[_ai];
		var _attrName = _attribute.nodeName;
		var _attrValue = _attribute.nodeValue;

		if (_attrName == "ng-readonly") {
			return false;
		}

		if (_attrName == "ng-disabled") {
			return false;
		}

		if (_attrName == "readonly") {
			if (_attrValue == null) {
				return false;
			}
			if (_attrValue == "true") {
				return false;
			}
		}

		if (_attrName == "disabled") {
			if (_attrValue == null) {
				return false;
			}
			if (_attrValue == "true") {
				return false;
			}
			if (_attrValue == "disabled") {
				return false;
			}
		}
	}
	return true;
}