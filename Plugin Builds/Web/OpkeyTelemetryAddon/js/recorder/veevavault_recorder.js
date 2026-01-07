//init Oracle Fusion
var VeevaVault = function() {

}

VeevaVault.prototype.IsElementIsVisible = function(el) {
	if (el) {
		if (el.offsetWidth == 0 && el.offsetHeight == 0) {
			return false;
		}
	}
	return true;
};

VeevaVault.prototype.getMSDynamicsAXLabelComponent = function(el) {
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

VeevaVault.prototype.checkPreviousSiblingForOF = function(el, lbl_element,
	id_Attr_Value) {
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
VeevaVault.prototype.checkNextSiblingForOF = function(el, lbl_element,
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
VeevaVault.prototype.checkParentNodeForOF = function(el, lbl_element,
	id_Attr_Value) {
	var iterationrate = 0;
	var par_node = el.parentNode;
	while (par_node != null) {
		// start
		if (iterationrate == 5) {
			break;
		}
		iterationrate++;
		
		if(par_node.tagName=="DIV"){
			if(par_node.classList){
				if(par_node.classList.contains("fieldSelectorRow")){
					var childLabelDiv=par_node.getElementsByClassName("groupByLabel")[0];
					if(childLabelDiv!=null){
						return childLabelDiv;
					}
				}
				if(par_node.classList.contains("sortSelectorRow")){
					var span_childLabelDiv=par_node.getElementsByClassName("sortLabel")[0];
					if(span_childLabelDiv!=null){
						return span_childLabelDiv;
					}
				}
			}
		}
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
VeevaVault.prototype.checkChildNodeForOF = function(el, lbl_element,
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

VeevaVault.prototype.checkInputElementsForOF = function(el) {
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

					var labelElement = document.querySelector(selector)
					return labelElement;
				}

			} else {
				return null;
			}
		}
	}

};

VeevaVault.prototype.getSeleniumAccessorsForOF = function(el) {
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

VeevaVault.prototype.GetNodeFromXath = function(_refNode, _xpath) {
	if (_refNode == null) {
		_refNode = document;
	}
	var opkey_results = [];
	var _query = document.evaluate(_xpath, _refNode, null,
		XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	for (var _i = 0, length = _query.snapshotLength; _i < length; ++_i) {
		opkey_results.push(_query.snapshotItem(_i));
	}
	return opkey_results;
}

VeevaVault.prototype.FusionGetPopUp = function() {
	var _popups = this.GetNodeFromXath(null, "//*[@data-afr-popupid]");
	if (_popups.length > 0) {
		return _popups[0];
	}
	return null;
}

VeevaVault.prototype.GetObjectHeader = function() {
	var _popup = this.FusionGetPopUp();
	var headers = [];
	if (_popup != null) {
		headers = this.GetNodeFromXath(_popup, ".//h1");
	} else {
		headers = this.GetNodeFromXath(null, "//h1");
	}

	if (headers.length == 1) {
		return headers[0].innerText;
	} else if (headers.length > 1) {
		return headers[0].innerText;
	}
	return null;
};


VeevaVault.prototype.GetSpanLabelComponent = function(_component) {
var _newComponent=_component;
while(_newComponent!=null){
	if(_newComponent.nodeName=="DIV"){
		if(_newComponent.classList!=null){
			if(_newComponent.classList.contains("vv_field_row")){
				var _divLabel=_newComponent.getElementsByTagName("LABEL")[0];
				return _divLabel;
			}
		}
	}
	_newComponent=_newComponent.parentNode;
}

return null;
};


VeevaVault.prototype.GetLabelProperties = function(_component, ref_object) {
	try {
		if (_component.nodeName == "BUTTON" || _component.nodeName == "A") {
			var _title = _component.textContent.trim();
			if (_title.indexOf("Create") == 0) {
				_title = _title.replace("Create", "")
				_title = _title.trim();
				ref_object["fusObjectTitle"] = _title;
				chrome.runtime.sendMessage({
					SetFusionObjectName: _title
				}, function(response) {
					if (chrome.runtime.lastError) { }
				});
			}
		}

		var _label = this.GetSpanLabelComponent(_component);
		if (_label == null) {
			_label = this.getMSDynamicsAXLabelComponent(_component);
		}
		if (_label == null) {
			_label = this.checkInputElementsForOF(_component);
		}

		var _header = this.GetObjectHeader();
		if (_header) {
			ref_object["VV:Header"] = _header;
		}
		if (_label != null) {
			// debugger;
			ref_object["VV:label:text"] = _label.textContent;
			ref_object["logicalname"] = _label.textContent;
			var _locators = this.getSeleniumAccessorsForOF(_label);
			for (var _li = 0; _li < _locators.length; _li++) {
				_locators[_li][1] = "VV:" + _locators[_li][1];
				ref_object[_locators[_li][1]] = _locators[_li][0];
			}
		}
		else {
			var _ariaLabel = _component.getAttribute("aria-label");
			if (_ariaLabel != null) {
				ref_object["VV:label:text"] = _ariaLabel.replace(", (Blank)", "");
				ref_object["VV:arialabel"] = _ariaLabel.replace(", (Blank)", "");
				ref_object["logicalname"] = _ariaLabel.replace(", (Blank)", "");
				var _locators = this.getSeleniumAccessorsForOF(_component);
				for (var _li = 0; _li < _locators.length; _li++) {
					_locators[_li][1] = "VV:" + _locators[_li][1];
					ref_object[_locators[_li][1]] = _locators[_li][0];
				}
			}
			
			var _ariarole = _component.getAttribute("role");
			if (_ariarole != null) {
				ref_object["VV:role"] = _ariarole;
			}

			var _ariaposinset = _component.getAttribute("aria-posinset");
			if (_ariaposinset != null) {
				ref_object["VV:ariaposinset"] = _ariaposinset;
			}

			var _ariahaspopup = _component.getAttribute("aria-haspopup");
			if (_ariahaspopup != null) {
				ref_object["VV:ariahaspopup"] = _ariahaspopup;
			}
			
			var _ariacontrols = _component.getAttribute("aria-controls");
			if (_ariacontrols != null) {
				debugger
				var inputElement=_component.nextSibling;
				if(inputElement!=null){
				var _ariaLabel = inputElement.getAttribute("aria-label");
			    if (_ariaLabel != null) {
					ref_object["VV:Input:arialabel"] = _ariaLabel.replace(", (Blank)", "");
				}
				}
			}
			
			var _controlName = _component.getAttribute("controlname");
			if (_controlName != null) {
				ref_object["VV:controlname"] = _controlName;
			}
		}
	} catch (e) {
		return null;
	}
};

var _fusionComboBox = null;
var _fusionComboBoxRefObject = null;
VeevaVault.prototype.GetCompositeKeywords = function(_element, ref_object) {
	var _mainNode = _element;
	if (_element.nodeName == "A") {
		var _prevSibling = _element.previousSibling;
		if (_prevSibling.nodeName == "INPUT") {
			if (_prevSibling.getAttribute("role") != null) {
				if (_prevSibling.getAttribute("role") == "combobox") {
					fusionComboBox = _prevSibling;
					_fusionComboBoxRefObject = ref_object;
					return "SKIP_KEYWORD";
				}
			}
		}
	}

	if (_fusionComboBox != null) {
		if (_element.nodeName == "LI") {

		}
	}

	return "DONE";
};

VeevaVault.prototype.GetClosestElement = function(element, selector) { // Find
	// closest
	// Required
	// Element
	// Will only continue for 20 iterations
	let counter = 0;
	while (element.getAttribute(selector) == null || counter < 20) {
		element = element.parentNode;
		counter++;
	}
	if (element.getAttribute(selector) != null) {
		return element;
	} else {
		return null;
	}
};

VeevaVault.prototype.GetTableProp = function(_currentelement) {

	let univIndex = 0;
	let divWithHeaders = "";
	let currentWorkingRow = "";
	let currentColumn = "";
	let currentHeader = "";
	let correctedTableCells = [];
	let header_InnerText = [];
	let cols_InnerText = [];

	// DIV Containing Headers
	if (!Element.prototype.closest) {
		divWithHeaders = this.GetClosestElement(_currentelement,
			'_leafcolclientids')
	} else {
		divWithHeaders = _currentelement.closest('[_leafcolclientids]');
	}

	if (divWithHeaders == null || divWithHeaders == undefined) {
		// The Table pattern is not matched hence it is not a table structure
		return null;
	}

	// Creating normalized table
	var normalizedTable = document.createElement('TABLE');
	normalizedTable.setAttribute("id",
		"normalizedTable_cd184797-170b-4a24-8216-566c51403e2b")
	var row = document.createElement('TR');
	var row2 = document.createElement('TR');

	// Get Current Working Row
	if (!Element.prototype.closest) {
		currentWorkingRow = this.GetClosestElement(_currentelement, '_afrrk')
	} else {
		currentWorkingRow = _currentelement.closest('[_afrrk]');
	}

	if (currentWorkingRow == null || currentWorkingRow == undefined) {
		// No Row to work on, hence cannot work on table
		return null;
	}

	// Get All TableCells
	let tableCells = currentWorkingRow.getElementsByTagName('TD');

	for (tdIndex = 0; tdIndex < tableCells.length; tdIndex++) {

		let element = tableCells[tdIndex];
		if (element.className.includes("xer")) { // Ultimate TD, no more
			// tables are available
			var cln = element.cloneNode(true);
			row2.appendChild(cln);
			correctedTableCells.push(element);
			if (element.contains(_currentelement)) {
				univIndex = correctedTableCells.length - 1;
			}
		}
	}

	let _leafcolclientids = divWithHeaders.getAttribute('_leafcolclientids')
		.replace("[", "").replace("]", "")
		.replace(new RegExp("'", 'g'), "").split(",");
	_leafcolclientids = _leafcolclientids.filter(function checkAdult(leaf) {
		return leaf != "null";
	});
	for (var index = 0; index < _leafcolclientids.length; index++) {
		let id = _leafcolclientids[index].replace(new RegExp("'", 'g'), "");
		let tableHeader = document.getElementById(id);

		let clonedTableHeader = tableHeader.cloneNode(true);
		if (clonedTableHeader.innerText.trim() != "") {
			row.appendChild(clonedTableHeader);
		}

	}

	// Appending Children in Table
	normalizedTable.appendChild(row);
	normalizedTable.appendChild(row2);

	// Data Creation for Keywords
	var headers = normalizedTable
		.querySelectorAll('#normalizedTable_cd184797-170b-4a24-8216-566c51403e2b>tr>th')
	let cols = normalizedTable
		.querySelectorAll('#normalizedTable_cd184797-170b-4a24-8216-566c51403e2b>tr>td')

	for (let headerIndex = 0; headerIndex < headers.length; headerIndex++) {
		if ((headers[headerIndex].querySelector('[class=af_column_label-text]') != null)) {
			header_InnerText.push(headers[headerIndex]
				.querySelector('[class=af_column_label-text]').textContent);
		} else {
			header_InnerText.push(headers[headerIndex].textContent);
		}

		var innerTextObj = {
			inner_Text: cols[headerIndex].textContent
		}
		var cIText = SetInnerTextForColumns(cols[headerIndex], innerTextObj);

		if (cIText == "no-data-found") {
			cIText = innerTextObj.inner_Text;
		}

		cols_InnerText.push(cIText.trim());
	}

	currentColumn = cols_InnerText[univIndex];
	currentHeader = header_InnerText[univIndex];

	var TableData = {
		tableObject: divWithHeaders,
		allheaders: headers,
		allcolumns: cols,
		allheader_InnerText: header_InnerText,
		allcols_InnerText: cols_InnerText,
		currentCol: currentColumn,
		currentHeader: currentHeader,
		currentRowNumber: currentWorkingRow.getAttribute('_afrrk')
	};
	return TableData;
};

function getLeafNodes(master) {
	var nodes = Array.prototype.slice.call(master.getElementsByTagName("*"), 0);
	var leafNodes = nodes.filter(function(elem) {
		return !elem.hasChildNodes();
	});
	return leafNodes;
}

function SetInnerTextForColumns(element, ifBlankInnerText) {
	var childs = element.children;
	let i = 0;
	for (i = 0; i < childs.length; i++) {
		var childElement = childs[i];

		if (childElement.nodeType == 1
			&& childElement.style.display != "none"
			&& (childElement.children.length == 0 || childElement.tagName == "SELECT")) {
			if (childElement.tagName == "INPUT") {
				if (childElement.value != null) {
					return childElement.value;
				}
			} else if (childElement.tagName == "SELECT") {
				return childElement.options[childElement.selectedIndex].text;
			} else if (childElement.textContent != null
				&& childElement.textContent.trim() != "") {
				return childElement.textContent;
			}
		} else if (childElement.style.display != "none"
			&& childElement.children.length > 0) {
			var data = SetInnerTextForColumns(childElement, ifBlankInnerText);
			if (data != "no-data-found") {
				return data;
			}
		} else if (childElement.style.display == "none") {
			ifBlankInnerText.inner_Text = ifBlankInnerText.inner_Text.replace(
				childElement.textContent, "")
		}

	}
	return "no-data-found";

}