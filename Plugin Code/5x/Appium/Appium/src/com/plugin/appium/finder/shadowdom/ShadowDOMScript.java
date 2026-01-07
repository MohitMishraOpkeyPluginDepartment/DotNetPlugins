package com.plugin.appium.finder.shadowdom;

public class ShadowDOMScript {
	public static String script = "var opkey_allShadowRoots = [];\r\n" + 
			"var opkey_childNodes = []\r\n" + 
			"function opkey_fetchAllShadowRootElements(node) {\r\n" + 
			"	var _allChildNodes = [];\r\n" + 
			"	var _childNodes = node.childNodes;\r\n" + 
			"	for (var chi = 0; chi < _childNodes.length; chi++) {\r\n" + 
			"		var _child = _childNodes[chi];\r\n" + 
			"		_allChildNodes.push(_child);\r\n" + 
			"	}\r\n" + 
			"	if (node.shadowRoot != null) {\r\n" + 
			"		var _shadowChildNodes = node.shadowRoot.childNodes;\r\n" + 
			"		for (var sci = 0; sci < _shadowChildNodes.length; sci++) {\r\n" + 
			"			var _shadowChildNode = _shadowChildNodes[sci];\r\n" + 
			"			_allChildNodes.push(_shadowChildNode);\r\n" + 
			"		}\r\n" + 
			"	}\r\n" + 
			"	for (var i = 0; i < _allChildNodes.length; i++) {\r\n" + 
			"		var child = _allChildNodes[i];\r\n" + 
			"		if (child.shadowRoot != null) {\r\n" + 
			"			opkey_allShadowRoots.push(child);\r\n" + 
			"		}\r\n" + 
			"		opkey_fetchAllShadowRootElements(child);\r\n" + 
			"	}\r\n" + 
			"}\r\n" + 
			"\r\n" + 
			"function opkey_getChildNodes(node, datatype, datas) {\r\n" + 
			"	var _allChildNodes = [];\r\n" + 
			"	var _childNodes = node.childNodes;\r\n" + 
			"	for (var chi = 0; chi < _childNodes.length; chi++) {\r\n" + 
			"		var _child = _childNodes[chi];\r\n" + 
			"		_allChildNodes.push(_child);\r\n" + 
			"	}\r\n" + 
			"	if (node.shadowRoot != null) {\r\n" + 
			"		var _shadowChildNodes = node.shadowRoot.childNodes;\r\n" + 
			"		for (var sci = 0; sci < _shadowChildNodes.length; sci++) {\r\n" + 
			"			var _shadowChildNode = _shadowChildNodes[sci];\r\n" + 
			"			_allChildNodes.push(_shadowChildNode);\r\n" + 
			"		}\r\n" + 
			"	}\r\n" + 
			"	for (var i = 0; i < _allChildNodes.length; i++) {\r\n" + 
			"		var child = _allChildNodes[i];\r\n" + 
			"		if (datatype == \"tag\") {\r\n" + 
			"			if (datas == \"*\") {\r\n" + 
			"				opkey_childNodes.push(child);\r\n" + 
			"			} else {\r\n" + 
			"				if (child.nodeName == datas) {\r\n" + 
			"					opkey_childNodes.push(child);\r\n" + 
			"				}\r\n" + 
			"			}\r\n" + 
			"		}\r\n" + 
			"\r\n" + 
			"		try {\r\n" + 
			"			if (datatype == \"id\") {\r\n" + 
			"				var idattr = child.getAttribute(\"id\");\r\n" + 
			"				if (idattr != null) {\r\n" + 
			"					if (idattr == datas) {\r\n" + 
			"						opkey_childNodes.push(child);\r\n" + 
			"					}\r\n" + 
			"				}\r\n" + 
			"			}\r\n" + 
			"		} catch (e) {\r\n" + 
			"		}\r\n" + 
			"		opkey_getChildNodes(child, datatype, datas);\r\n" + 
			"	}\r\n" + 
			"}\r\n" + 
			"\r\n" + 
			"function opkey_getAllShadowRootElements() {\r\n" + 
			"	opkey_allShadowRoots = [];\r\n" + 
			"	opkey_fetchAllShadowRootElements(document);\r\n" + 
			"	return opkey_allShadowRoots;\r\n" + 
			"}\r\n" + 
			"\r\n" + 
			"function opkey_getAllChildElementsByTagName(_parentNode, _tagName) {\r\n" + 
			"	opkey_childNodes = [];\r\n" + 
			"	opkey_getChildNodes(_parentNode, \"tag\", _tagName);\r\n" + 
			"	return opkey_childNodes;\r\n" + 
			"}\r\n" + 
			"\r\n" + 
			"function opkey_getElementByIdSahdow(_parentNode, idattr) {\r\n" + 
			"	opkey_childNodes = [];\r\n" + 
			"	opkey_getChildNodes(_parentNode, \"id\", idattr);\r\n" + 
			"	return opkey_childNodes;\r\n" + 
			"}\r\n" + 
			"\r\n" + 
			"function opkey_removeFlexClassName(_element) {\r\n" + 
			"	if (_element.classList != null) {\r\n" + 
			"		if (_element.classList.length > 0) {\r\n" + 
			"			if (_element.classList.contains(\"helix--input\")) {\r\n" + 
			"				_element.classList.remove(\"helix--input\");\r\n" + 
			"				return true;\r\n" + 
			"			}\r\n" + 
			"		}\r\n" + 
			"	}\r\n" + 
			"}\r\n" + 
			"\r\n" + 
			"function opkey_simulateKeyEvent(_element, textToType) {\r\n" + 
			"	var eventObject = document.createEvent('TextEvent');\r\n" + 
			"	eventObject.initTextEvent('textInput', true, true, null, textToType);\r\n" + 
			"\r\n" + 
			"	_element.dispatchEvent(eventObject);\r\n" + 
			"}\r\n" + 
			"\r\n" + 
			"function getTextContent(_element) {\r\n" + 
			"	if (_element.nodeName == \"TABLE\") {\r\n" + 
			"		return null;\r\n" + 
			"	}\r\n" + 
			"	if (_element.nodeName == \"TBODY\") {\r\n" + 
			"		return null;\r\n" + 
			"	}\r\n" + 
			"	var _textContent = _element.innerText;\r\n" + 
			"	if (_textContent == null) {\r\n" + 
			"		_textContent = _element.getAttribute(\"value\");\r\n" + 
			"	}\r\n" + 
			"	if (_textContent == null) {\r\n" + 
			"		_textContent = _element.getAttribute(\"placeholder\");\r\n" + 
			"	}\r\n" + 
			"	if (_textContent == null) {\r\n" + 
			"		_textContent = _element.getAttribute(\"ps-placeholder\");\r\n" + 
			"	}\r\n" + 
			"	if (_textContent == null) {\r\n" + 
			"		_textContent = _element.textContent;\r\n" + 
			"	}\r\n" + 
			"	return _textContent;\r\n" + 
			"}";
}
