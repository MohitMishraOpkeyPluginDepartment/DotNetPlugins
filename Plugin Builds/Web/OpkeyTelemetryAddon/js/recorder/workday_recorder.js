Opkey.prototype.workday_main_getLabel = function(el) {
	var click_el = el;
	var allparentelementsarray = [];
	while (el.parentNode != null && el.parentNode.tagName != "HTML"
			&& el.parentNode.tagName != "BODY") {
		allparentelementsarray.push(el.parentNode);
		el = el.parentNode;
	}
	return this.searchForLabelInParentsArray(allparentelementsarray, click_el);
};
Opkey.prototype.searchForLabelInParentsArray = function(parentelementsarray,
		click_el) {
	var lbl_elem = null;
	for (var elementindex = 0; elementindex < parentelementsarray.length; elementindex++) {
		var parentelement = parentelementsarray[elementindex];
		if (parentelement.nodeType == 1) {
			if (parentelement.hasAttribute("data-automation-id")) {
				if (parentelement.getAttribute("data-automation-id") == "landingPageWorkletSelectionOption") {
					var child_of_parentelement = parentelement.firstElementChild;
					lbl_elem = child_of_parentelement;
					break;
				}
			}
		}
		if (parentelement.tagName == "LABEL") {
			lbl_elem = parentelement;
			break;
		}

		if (click_el.previousSibling) {
			var prevsib = click_el.previousSibling;
			while (prevsib != null) {
				if (prevsib.nodeType == 1) {
					lbl_elem = this.checkWhetherElementIsLabel(prevsib,
							click_el);
					if (lbl_elem)
						break;
				}
				prevsib = prevsib.previousSibling;
			}
			if (lbl_elem)
				break;
		}
		if (click_el.nextSibling) {
			var nextsib = click_el.nextSibling;
			if (nextsib) {
				lbl_elem = this.checkWhetherElementIsLabel(nextsib, click_el);
				if (lbl_elem == "" || lbl_elem == null) {
					nextsib = nextsib.nextSibling;
					if (nextsib && nextsib.tagName == 'LABEL') {
						if ((click_el.getAttribute("id") != null)
								&& (nextsib.getAttribute("for") != null)) {
							if (click_el.getAttribute("id") == nextsib
									.getAttribute("for")) {
								lbl_elem = nextsib;
							}
						}
					}
				}
			}
			if (lbl_elem)
				break;
		}
		if (parentelement.nextSibling) {
			var nextsib = parentelement.nextSibling;
			if (nextsib) {
				lbl_elem = this.checkWhetherElementIsLabel(nextsib, click_el);
				if (lbl_elem)
					break;
				else {
					if (nextsib.tagName == 'DIV') {
						if (click_el.getAttribute("aria-labelledby") != null
								&& nextsib.getAttribute("id") != null) {
							if (click_el.getAttribute("aria-labelledby") == nextsib
									.getAttribute("id")) {
								lbl_elem = nextsib;
								break;
							}
						}
						if (nextsib.getAttribute("data-automation-id") != null
								&& nextsib.getAttribute("id") != null) {
							if (nextsib.getAttribute("id").includes(
									nextsib.getAttribute("data-automation-id"))) {
								lbl_elem = nextsib;
								break;
							}
						}
					}
				}
			}
		}
		if (parentelement.previousSibling) {
			var prevsib = parentelement.previousSibling;
			while (prevsib != null) {
				if (prevsib.nodeType == 1) {
					lbl_elem = this.checkWhetherElementIsLabel(prevsib,
							click_el);
					if (lbl_elem) {
						break;
					} else {
						var child = prevsib.firstElementChild;
						if (child) {
							lbl_elem = this.checkWhetherElementIsLabel(child,
									click_el);
							if (lbl_elem)
								break;
						}
					}
				}
				prevsib = prevsib.previousSibling;
			}
			if (lbl_elem)
				break;
		}
		if (lbl_elem == "" || lbl_elem == null) {
			var childnodes = parentelement.childNodes;
			if (childnodes && childnodes.length > 0) {
				lbl_elem = this.checkWhetherElementIsDIV(parentelement,
						click_el);
				if (lbl_elem)
					break;
			}
		}
	}
	if (lbl_elem) {
		return lbl_elem;
	} else {
		return null;
	}
};
/* checking whether Element is LABEL("for") with matching "id" of Clicked Element("INPUT") */
/* here el is Parent-Element of Current Element(Clicked Element) */
Opkey.prototype.checkWhetherElementIsLabel = function(el, click_el) { //here el may be previousElement,NextElement,ChildElement
	var lbl_elem = null;
	if (el && el.nodeType == 1) {
		if (el.tagName == 'LABEL') {
			if ((click_el.getAttribute("id") != null)
					&& (el.getAttribute("for") != null)) {
				if (click_el.getAttribute("id") == el.getAttribute("for")) {
					lbl_elem = el;
				}
			}
			if (lbl_elem == "" || lbl_elem == null) {
				if ((click_el.getAttribute("aria-labelledby") != null)
						&& (el.getAttribute("id") != null)) {
					if (click_el.getAttribute("aria-labelledby") == el
							.getAttribute("id")) {
						lbl_elem = el;
					}
				}
			}
			if (lbl_elem == "" || lbl_elem == null) {
				if ((el.getAttribute("id") != null)
						&& (el.getAttribute("data-automation-id") != null)) {
					if (el.getAttribute("id").includes(
							el.getAttribute("data-automation-id"))) {
						lbl_elem = el;
					}
				}
			}
		}
	}
	if (lbl_elem)
		return lbl_elem;
	else
		return null;
};
/* checking whether Element is DIV with ID property matches with "aria-labelledby" of Clicked Element */
/* here el is Parent-Element of Current Element(Clicked Element) */
Opkey.prototype.checkWhetherElementIsDIV = function(el, click_el) {
	var lbl_elem = null;
	var childnodes = el.childNodes;
	if (childnodes && childnodes.length > 0) {
		for (var i = 0; i < childnodes.length; i++) {
			if (childnodes[i].nodeType == 1) {
				if (childnodes[i].tagName == 'DIV') {
					if (click_el.getAttribute("aria-labelledby") != null
							&& childnodes[i].getAttribute("id") != null) {
						if (click_el.getAttribute("aria-labelledby") == childnodes[i]
								.getAttribute("id")) {
							lbl_elem = childnodes[i];
							break;
						}
					}
				}
			}
		}
	}
	if (lbl_elem) {
		return lbl_elem;
	} else
		return null;
};