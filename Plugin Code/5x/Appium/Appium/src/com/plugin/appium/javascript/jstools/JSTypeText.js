function OpKey_triggerKeyEvent(el, type){
if ('createEvent' in document) {
        // modern browsers, IE9+
        var e = document.createEvent('HTMLEvents');
        e.initEvent(type, false, true);
        el.dispatchEvent(e);
    } else {
        // IE 8
        var e = document.createEventObject();
        e.eventType = type;
        el.fireEvent('on'+e.eventType, e);
    }
}

function performOpKeyTypeText(_element,_value)
{
	_element.value="";
	_element.value=_value;
	OpKey_triggerKeyEvent(_element,"keydown");
	OpKey_triggerKeyEvent(_element,"keyup");
}