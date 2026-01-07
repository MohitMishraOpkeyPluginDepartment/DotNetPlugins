var opkey_allShadowRoots = [];
var opkey_childNodes = []
function opkey_fetchAllShadowRootElements(node) {
	var _allChildNodes = [];
	var _childNodes = node.childNodes;
	for (var chi = 0; chi < _childNodes.length; chi++) {
		var _child = _childNodes[chi];
		_allChildNodes.push(_child);
	}
	if (node.shadowRoot != null) {
		var _shadowChildNodes = node.shadowRoot.childNodes;
		for (var sci = 0; sci < _shadowChildNodes.length; sci++) {
			var _shadowChildNode = _shadowChildNodes[sci];
			_allChildNodes.push(_shadowChildNode);
		}
	}
	for (var i = 0; i < _allChildNodes.length; i++) {
		var child = _allChildNodes[i];
		if (child.shadowRoot != null) {
			opkey_allShadowRoots.push(child);
		}
		opkey_fetchAllShadowRootElements(child);
	}
}

function opkey_getChildNodes(node, datatype, datas) {
	var _allChildNodes = [];
	var _childNodes = node.childNodes;
	for (var chi = 0; chi < _childNodes.length; chi++) {
		var _child = _childNodes[chi];
		_allChildNodes.push(_child);
	}
	if (node.shadowRoot != null) {
		var _shadowChildNodes = node.shadowRoot.childNodes;
		for (var sci = 0; sci < _shadowChildNodes.length; sci++) {
			var _shadowChildNode = _shadowChildNodes[sci];
			_allChildNodes.push(_shadowChildNode);
		}
	}
	for (var i = 0; i < _allChildNodes.length; i++) {
		var child = _allChildNodes[i];
		if (datatype == "tag") {
			if (datas == "*") {
				opkey_childNodes.push(child);
			} else {
				if (child.nodeName == datas) {
					opkey_childNodes.push(child);
				}
			}
		}

		try {
			if (datatype == "id") {
				var idattr = child.getAttribute("id");
				if (idattr != null) {
					if (idattr == datas) {
						opkey_childNodes.push(child);
					}
				}
			}
		} catch (e) {
		}
		opkey_getChildNodes(child, datatype, datas);
	}
}

function opkey_getAllShadowRootElements() {
	opkey_allShadowRoots = [];
	opkey_fetchAllShadowRootElements(document);
	return opkey_allShadowRoots;
}

function opkey_getAllChildElementsByTagName(_parentNode, _tagName) {
	opkey_childNodes = [];
	opkey_getChildNodes(_parentNode, "tag", _tagName);
	return opkey_childNodes;
}

function opkey_getElementByIdSahdow(_parentNode, idattr) {
	opkey_childNodes = [];
	opkey_getChildNodes(_parentNode, "id", idattr);
	return opkey_childNodes;
}

function opkey_removeFlexClassName(_element) {
	if (_element.classList != null) {
		if (_element.classList.length > 0) {
			if (_element.classList.contains("helix--input")) {
				_element.classList.remove("helix--input");
				return true;
			}
		}
	}
}

function opkey_simulateKeyEvent(_element, textToType) {
	var eventObject = document.createEvent('TextEvent');
	eventObject.initTextEvent('textInput', true, true, null, textToType);

	_element.dispatchEvent(eventObject);
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