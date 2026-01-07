package com.plugin.appium.javascript.jstools;

public class JSClickStringScript {
	public static String script = "var controlKeyDown = false;\r\n" + 
			"var altKeyDown = false;\r\n" + 
			"var shiftKeyDown = false;\r\n" + 
			"var metaKeyDown = false;\r\n" + 
			"\r\n" + 
			"function opkey_triggerMouseEvent(element, eventType, canBubble, clientX,\r\n" + 
			"		clientY, button) {\r\n" + 
			"	clientX = clientX ? clientX : 0;\r\n" + 
			"	clientY = clientY ? clientY : 0;\r\n" + 
			"	var screenX = 0;\r\n" + 
			"	var screenY = 0;\r\n" + 
			"\r\n" + 
			"	canBubble = (typeof (canBubble) == undefined) ? true : canBubble;\r\n" + 
			"	var evt;\r\n" + 
			"	if (element.fireEvent && element.ownerDocument\r\n" + 
			"			&& element.ownerDocument.createEventObject) { // IE\r\n" + 
			"		evt = element.ownerDocument.createEventObject(element, controlKeyDown,\r\n" + 
			"				altKeyDown, shiftKeyDown, metaKeyDown);\r\n" + 
			"		evt.detail = 0;\r\n" + 
			"		evt.button = button ? button : 1; // default will be the left mouse\r\n" + 
			"		// click (\r\n" + 
			"		// http://www.javascriptkit.com/jsref/event.shtml\r\n" + 
			"		// )\r\n" + 
			"		evt.relatedTarget = null;\r\n" + 
			"		if (!screenX && !screenY && !clientX && !clientY && !controlKeyDown\r\n" + 
			"				&& !altKeyDown && !shiftKeyDown && !metaKeyDown) {\r\n" + 
			"			element.fireEvent('on' + eventType);\r\n" + 
			"		} else {\r\n" + 
			"			evt.screenX = screenX;\r\n" + 
			"			evt.screenY = screenY;\r\n" + 
			"			evt.clientX = clientX;\r\n" + 
			"			evt.clientY = clientY;\r\n" + 
			"			try {\r\n" + 
			"				window.event = evt;\r\n" + 
			"			} catch (e) {\r\n" + 
			"			}\r\n" + 
			"			element.fireEvent('on' + eventType, evt);\r\n" + 
			"		}\r\n" + 
			"	} else {\r\n" + 
			"		var doc = (element.ownerDocument || element.document);\r\n" + 
			"		var view = (doc.parentWindow || doc.defaultView);\r\n" + 
			"\r\n" + 
			"		evt = doc.createEvent('MouseEvents');\r\n" + 
			"		if (evt.initMouseEvent) {\r\n" + 
			"			evt.initMouseEvent(eventType, canBubble, true, view, 1, screenX,\r\n" + 
			"					screenY, clientX, clientY, controlKeyDown, altKeyDown,\r\n" + 
			"					shiftKeyDown, metaKeyDown, button ? button : 0, null);\r\n" + 
			"		} else {\r\n" + 
			"			evt.initEvent(eventType, canBubble, true);\r\n" + 
			"			evt.shiftKey = shiftKeyDown;\r\n" + 
			"			evt.metaKey = metaKeyDown;\r\n" + 
			"			evt.altKey = altKeyDown;\r\n" + 
			"			evt.ctrlKey = controlKeyDown;\r\n" + 
			"			if (button) {\r\n" + 
			"				evt.button = button;\r\n" + 
			"			}\r\n" + 
			"		}\r\n" + 
			"		element.dispatchEvent(evt);\r\n" + 
			"	}\r\n" + 
			"}\r\n" + 
			"\r\n" + 
			"function performOpKeyClick(element) {\r\n" + 
			"	try {\r\n" + 
			"		var savedEvent = null;\r\n" + 
			"		element.addEventListener(\"click\", function(evt) {\r\n" + 
			"			savedEvent = evt;\r\n" + 
			"		}, false);\r\n" + 
			"	} catch (e) {\r\n" + 
			"\r\n" + 
			"	}\r\n" + 
			"\r\n" + 
			"	opkey_triggerMouseEvent(element, \"click\", true);\r\n" + 
			"	opkey_triggerMouseEvent(element, \"mousedown\", true);\r\n" + 
			"	window.setTimeout(function() {\r\n" + 
			"		opkey_triggerMouseEvent(element, \"mouseup\", true);\r\n" + 
			"	}, 300);\r\n" + 
			"}\r\n" + 
			"\r\n" + 
			"function performWaitAndClick(element, _interval) {\r\n" + 
			"	window.setTimeout(function(){\r\n" + 
			"		performOpKeyClick(element);\r\n" + 
			"	},_interval);\r\n" + 
			"}\r\n" + 
			"\r\n" + 
			"function performMouseOver(element) {\r\n" + 
			"	opkey_triggerMouseEvent(element, \"mouseover\", true);\r\n" + 
			"}\r\n" + 
			"\r\n" + 
			"function opkey_triggerEvent(element, eventtype) {\r\n" + 
			"	opkey_triggerMouseEvent(element, eventtype, true);\r\n" + 
			"}";
}
