//init Oracle Fusion
var PeopleSoft_OpKey = function() {

}

PeopleSoft_OpKey.prototype.IsElementIsVisible = function(el) {
	if (el) {
		console.log(el.offsetWidth)
		console.log(el.offsetHeight)
		if (el.offsetWidth == 0 && el.offsetHeight == 0) {
			return false;
		}
	}
	return true;
};

PeopleSoft_OpKey.prototype.getPeopleSoftLabelComponent = function(el) {
	// ////debugger;
	if (el.nodeName == "INPUT") {
		if (el.type) {
			if (el.type.toLowerCase() == "button"
					|| el.type.toLowerCase() == "submit") {
				return null;
			}
		}
	}

	if (el.nodeName == "BUTTON") {
		return null;
	}

	var lbl_element = "", lbl_tagname = "", lbl_text = "", id_Attr_Value = "", name_Attr_Value = "", class_Attr_Value = "";
	var clicked_elem = el;
	var tagname = el.tagName;
	var type_of_element = el.getAttribute("type");
	if (el.getAttribute("id") != "" || el.getAttribute("id") != null
			|| el.getAttribute("name") != "" || el.getAttribute("name") != null
			|| el.getAttribute("class") != ""
			|| el.getAttribute("class") != null) {
		id_Attr_Value = el.getAttribute("id");
		name_Attr_Value = el.getAttribute("name");
		class_Attr_Value = el.getAttribute("class");
	}
	if (el.previousSibling) {
		lbl_element = this.checkPreviousSiblingForOF(el, lbl_element,
				id_Attr_Value);
	}
	if (lbl_element == "" || lbl_element == null) {
		if (el.nextSibling) {
			lbl_element = this.checkNextSiblingForOF(el, lbl_element,
					id_Attr_Value);
		}
		if (lbl_element == "" || lbl_element == null) {
			if (el.parentNode) {
				lbl_element = this.checkParentNodeForOF(el, lbl_element,
						id_Attr_Value);
			}
			if (lbl_element == "" || lbl_element == null) {
				if (el.childNodes || el.children) {
					lbl_element = this.checkChildNodeForOF(el, lbl_element,
							id_Attr_Value);
				}
			}
		}
	}
	if (lbl_element == "") {
		var parent_node = el.parentNode;
		if (parent_node != null) {
			var childnodes_parent = parent_node.childNodes;
			for (var ch_p = 0; ch_p < childnodes_parent.length; ch_p++) {
				var childnode_parent = childnodes_parent[ch_p];
				if (childnode_parent.nodeName === "#text") {
					if (childnode_parent.textContent.trim() != "") {
						// highly impact full in label comment this if any issue
						// found
						return childnode_parent;
					}
				}
			}
		}
	}

	if (lbl_element == "") {
		if (el.nodeName == "SELECT") {
			id_Attr_Value = id_Attr_Value.split("_");
			if (id_Attr_Value[0] != null) {
				id_Attr_Value = id_Attr_Value[0];
			}

			var _labels = document.getElementsByTagName("LABEL");
			for (var _lb = 0; _lb < _labels.length; _lb++) {
				var _label = _labels[_lb];
				if (_label.getAttribute("for") != null) {
					if (_label.getAttribute("for") == id_Attr_Value) {
						return _label;
					}
				}
			}
		}
	}

	if (lbl_element == "") {
		if (type_of_element == "" || type_of_element == null) {
			if ((id_Attr_Value == "") && (name_Attr_Value == "")
					&& (class_Attr_Value == ""))
				return null;
			else if ((id_Attr_Value == "") && (name_Attr_Value == ""))
				return null;
			else if ((id_Attr_Value == "") && (class_Attr_Value == ""))
				return null;
			else
				return null;
		} else
			return null;
	} else {
		if (type_of_element == "" || type_of_element == null) {
			return lbl_element;
		} else {
			return lbl_element;
		}
	}
};

PeopleSoft_OpKey.prototype.checkPreviousSiblingForOF = function(el,
		lbl_element, id_Attr_Value) {
	var lbl_elem = null;
	var prevSib = el.previousSibling;
	if (prevSib) {
		while (prevSib != null) {
			if (prevSib.nodeType == 1) {
				var lbl_tag_name = prevSib.tagName;
				if (lbl_element.tagName == "LABEL")// lbl_element.tagName added
					break;
				else {
					if (lbl_tag_name == 'LABEL') {
						if (prevSib.getAttribute("for") != null) {// attr_value!=null
																	// condition
																	// removed
							var attr_value = prevSib.getAttribute("for");
							if (attr_value == id_Attr_Value) {
								lbl_elem = prevSib;
								break;
							}
						}
					} else {
						lbl_elem = this.checkChildNodeForOF(prevSib,
								lbl_element, id_Attr_Value);
						if (lbl_elem)
							break;
					}
				}
			}
			prevSib = prevSib.previousSibling;
		}
	}
	if (lbl_elem)
		lbl_element = lbl_elem;
	return lbl_element;
};

/* for checking next sibling */
PeopleSoft_OpKey.prototype.checkNextSiblingForOF = function(el, lbl_element,
		id_Attr_Value) {
	var nextSib = el.nextSibling;
	if (nextSib) {
		while (nextSib != null) {
			if (nextSib.nodeType == 1) {
				var lbl_tag_name = nextSib.tagName;
				if (lbl_element.tagName == "LABEL")// lbl_element.tagName added
					break;
				else {
					if (lbl_tag_name == 'LABEL') {
						if (nextSib.getAttribute("for") != null) {// attr_value!=null
																	// condition
																	// removed
							var attr_value = nextSib.getAttribute("for");
							if (attr_value == id_Attr_Value) {
								lbl_element = nextSib;
								break;
							}
						}
					}
				}
			}
			nextSib = nextSib.nextSibling;
		}
	}
	return lbl_element;
};

/* for checking Parent node */
PeopleSoft_OpKey.prototype.checkParentNodeForOF = function(el, lbl_element,
		id_Attr_Value) {
	var iterationrate = 0;
	var par_node = el.parentNode;
	while (par_node != null) {
		// start
		if (iterationrate == 5) {
			break;
		}
		iterationrate++;
		if (par_node.tagName == 'LABEL') {
			lbl_element = par_node;
			break;
		} else {
			var allchilds = par_node.childNodes;
			for (var k = 0; k < allchilds.length; k++) {
				if (allchilds[k].nodeType == 1) {
					var lbl_tag_name = allchilds[k].tagName;
					if (lbl_element.tagName == "LABEL")// lbl_element.tagName
														// added
						break;
					else {
						if (lbl_tag_name == 'LABEL') {
							if (allchilds[k].getAttribute("for") != null) {// attr_value!=null
																			// condition
																			// removed
								var attr_value = allchilds[k]
										.getAttribute("for");
								if (attr_value == id_Attr_Value) {
									lbl_element = allchilds[k];
									break;
								}
							}
						}
					}
				}
			}
			if (lbl_element == "" || lbl_element == null) {
				var firstchild = par_node.firstElementChild;
				if (firstchild && firstchild.tagName == 'LABEL') {
					lbl_element = firstchild;
					break;
				}
			}
			if (lbl_element == "" || lbl_element == null) {
				lbl_element = this.checkPreviousSiblingForOF(par_node,
						lbl_element, id_Attr_Value);
				if (lbl_element)
					break;
			}
		}
		// end;
		par_node = par_node.parentNode;
	}
	return lbl_element;
};

/* for checking child node */
PeopleSoft_OpKey.prototype.checkChildNodeForOF = function(el, lbl_element,
		id_Attr_Value) {
	// var child = el.childNodes?el.childNodes:el.children;
	var child = el.childNodes;
	if (child && child.length > 0) {
		for (var j = 0; j < child.length; j++) {
			// while(child!=null){
			if (child[j].nodeType == 1) {
				var lbl_tag_name = child[j].tagName;
				if (lbl_element.tagName == "LABEL")// lbl_element.tagName added
					break;
				else {
					if (lbl_tag_name == 'LABEL') {
						if (child[j].getAttribute("for") != null) {// attr_value!=null
																	// condition
																	// removed
							var attr_value = child[j].getAttribute("for");
							if (attr_value == id_Attr_Value) {
								lbl_element = child[j];
								break;
							}
						}
					} else {
						var child_of_child = child[j].firstElementChild;
						if (child_of_child && child_of_child.tagName == 'LABEL') {
							if (child_of_child.getAttribute("for") != null) {
								if (id_Attr_Value == child_of_child
										.getAttribute("for")) {
									lbl_element = child_of_child;
									break;
								}
							}
						}
					}
				}
			}
		}
		// child = child.children;
	}
	return lbl_element;
};

PeopleSoft_OpKey.prototype.checkInputElementsForOF = function(el) {
	let iteration = 3; // Only 3 iterations will be executed in orer to find
						// closest input element.
	let id_Attr_Value = el.getAttribute('id');
	let element = el;
	while (iteration > 0) {
		iteration--;
		element = element.parentNode;
		let inputElementList = element.getElementsByTagName('INPUT');
		let inputElement = null;
		if (inputElementList.length > 0) {
			inputElement = inputElementList[0];

			let inputParentID = inputElement.id.split('::');
			let elParentID = el.id.split('::');

			if (inputParentID[0] == elParentID[0]) {
				id_Attr_Value = inputElement.id;
				if (id_Attr_Value.trim() == "" || id_Attr_Value == null
						|| id_Attr_Value == undefined) {
					return null;
				} else {
					selector = "[for = " + inputElement.id + "]";
					selector = selector.replace(new RegExp(":", 'g'), "\\:");
					try {
						var labelElement = document.querySelector(selector)
						return labelElement;
					} catch (e) {
						return null;
					}
				}

			} else {
				return null;
			}
		}
	}

};

PeopleSoft_OpKey.prototype.getSeleniumAccessorsForOF = function(el) {
	var locators = [];
	try {
		var l = new LocatorBuilders(window);
		// LocatorBuilders.order = ['id', 'link', 'name', 'dom:name',
		// 'xpath:link', 'xpath:img','xpath:attributes', 'xpath:href',
		// 'dom:index', 'xpath:position'];
		locators = l.buildAll(el);
	} catch (e) {
	}
	return locators;
};

PeopleSoft_OpKey.prototype.GetRecursiveLabel = function(_element) {
	//debugger
	var _parentNode = _element;

	while (_parentNode != null) {
		if (_parentNode.nodeName == "BODY") {
			break;
		}
		_parentNode = _parentNode.parentNode;
	}

	var _elementId = _element.getAttribute("id");
	if (_elementId) {
		var _labelsArray = _parentNode.getElementsByTagName("LABEL");
		for (var _li = 0; _li < _labelsArray.length; _li++) {
			var _label = _labelsArray[_li];
			var _label_for = _label.getAttribute("for");
			//debugger
			if (_label_for) {
				if (_label_for == _elementId) {
					return _label;
				}
			}

		}
	}

	return null;
};

PeopleSoft_OpKey.prototype.GetLabelProperties = function(_component, ref_object) {

	var _label = this.getPeopleSoftLabelComponent(_component);

	if (_label == null) {
		_label = this.checkInputElementsForOF(_component);
	}

	if (_label == null) {
		_label = this.GetRecursiveLabel(_component);
	}
	if (_label != null) {
		// debugger;
		ref_object["PS:label:text"] = _label.textContent;
		ref_object["logicalname"] = _label.textContent;
		var _locators = this.getSeleniumAccessorsForOF(_label);
		for (var _li = 0; _li < _locators.length; _li++) {
			_locators[_li][1] = "PS:" + _locators[_li][1];
			ref_object[_locators[_li][1]] = _locators[_li][0];
		}
	}
};

PeopleSoft_OpKey.prototype.GetTableProp = function(_currentelement) {
	var _currentClickedRowIndex = 0;
	var _currentClickedColumnIndex = 0;

	var _allColumns = null;
	var _allHeaders = null;

	var _firstTable = null;
	var _secondTable = null;
	var _mainTable = null;

	var _tempElement = _currentelement;
	while (_tempElement.parentNode != null) {
		if (_tempElement.nodeName == "TD") {
			_currentClickedColumnIndex = _tempElement.cellIndex
		}

		if (_tempElement.nodeName == "TR") {
			_currentClickedRowIndex = _tempElement.rowIndex
			break;
		}
		_tempElement = _tempElement.parentNode;
	}

	var _tempElement_0 = _currentelement;
	while (_tempElement_0.parentNode != null) {
		if (_tempElement_0.nodeName == "TABLE") {
			_firstTable = _tempElement_0;
			_allColumns = _tempElement_0.getElementsByTagName("TD");
			break;
		}
		_tempElement_0 = _tempElement_0.parentNode;
	}

	var _tableCount = 0;
	while (_firstTable.parentNode != null) {
		if (_firstTable.parentNode.nodeName == "TABLE") {
			_mainTable = _firstTable.parentNode;
			_tableCount++;
			if (_tableCount == 2) {
				break;
			}
		}
		_firstTable = _firstTable.parentNode;
	}

	if (_mainTable != null) {
		_allHeaders = _mainTable.getElementsByTagName("TH");
	}

	var headers_innerText = [];
	var columns_innerText = [];

	for (var h_i = 0; h_i < _allHeaders.length; h_i++) {
		var _innerText = _allHeaders[h_i].innerText.trim();
		headers_innerText.push(_innerText);
	}

	for (var c_i = 0; c_i < _allColumns.length; c_i++) {
		var _innerText = _allColumns[c_i].innerText.trim();
		columns_innerText.push(_innerText);
	}

	var TableData = {
		tableObject : _mainTable,
		allheaders : _allHeaders,
		allcolumns : _allColumns,
		allheader_InnerText : headers_innerText,
		allcols_InnerText : columns_innerText,
		currentCol : _currentClickedColumnIndex,
		currentHeader : headers_innerText[_currentClickedColumnIndex],
		currentRowNumber : _currentClickedRowIndex
	};

	return TableData;
};
