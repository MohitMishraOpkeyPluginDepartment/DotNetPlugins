function OpKey_generateUUID() { // Public Domain/MIT                                                          
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available                                       
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function opkey_getScrolledElement(_element) {
	var ele_guid = OpKey_generateUUID();
	_element.scrollIntoView({block: 'center'})
	_element.setAttribute("o_guid", ele_guid);
	var _tagName = _element.nodeName.toLowerCase();
	var _nodes = document.getElementsByTagName(_tagName);
	for (var _n = 0; _n < _nodes.length; _n++) {
		var _node = _nodes[_n];
		var o_guid = _node.getAttribute("o_guid");
		if (o_guid != null) {
			if (o_guid == ele_guid) {
				return _node;
			}
		}
	}
}