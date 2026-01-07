function opkey_scrollAllParents(element) {
	var _element=element;
	while (_element.parentNode != null) {
		_element.scrollIntoView({block: 'center'});
		_element=_element.parentNode;
	}
}