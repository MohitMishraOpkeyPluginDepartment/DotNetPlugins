/** -- Java Recorder Start -- **/

/** -- OpKey Recorder Start -- * */
if (_opkey.controllerMode == "opkey") {

	/* Selenium locatorBuilders start */
	// var test = JSON.stringify("/_s_/spr/ext/selenium/locatorBuilders.js")
	// eval(_opkey.sendToServer("/_s_/spr/ext/selenium/locatorBuilders.js"));
	var Log = function () {
	};
	Log.info = Log.warn = Log.prototype.exception = Log.prototype.error = Log.prototype.debug = function (
		s) {
	};

	DummyBot = function () {
		this.locationStrategies = []
	};
	DummyBot.prototype.findElement = function (locator) {
		return _opkey._bySeleniumLocator(locator);
	}
	LocatorBuilders.prototype.pageBot = function () {
		return new DummyBot();
	};
	/* Selenium locatorBuilders end */

	_opkey.controllerURL = "/_s_/spr/opkeycontroller.htm";
	_opkey.controllerHeight = 250;
	_opkey.controllerWidth = 420;
	_opkey.recorderClass = "StepWiseRecorder";
	Opkey.prototype.getExpectPromptScript = function (s, retVal) {
		return this.toJSON([this.getStepObj("expectPrompt", this
			.quotedEscapeValue(s), this.quotedEscapeValue(retVal))]);
	}
	Opkey.prototype.getExpectConfirmScript = function (s, retVal) {
		return this.toJSON([this.getStepObj("expectConfirm", this
			.quotedEscapeValue(s), retVal)]);
	}

	Opkey.prototype.getNavigateToScript = function (url) {
		return this.toJSON([
			this.getStepObj("navigateTo", "", this.quotedEscapeValue(url)),
			this.getStepObj("navigateTo", "", this.quotedEscapeValue(url),
				"selenium")]);
	}
	Opkey.prototype.getStepObj = function (accessor, accessorType, accessorArr) {
		try {
			if (accessorType != "index") {
				accessorArr[accessorType.replace(/\\"/g, '')] = accessor
					.replace(/\\"/g, '').replace(/\"/g, "");
			} else {
				accessorArr[accessorType] = accessor;
			}
		} catch (e) {
			accessorArr[accessorType] = accessor;
		}
	}

	Opkey.prototype.escapeNullValue = function (value) {
		return (value) ? value : '';
	}

	Opkey.prototype._getFinalFramesList = function () {
		var finalAr = {};
		var secAr = finalAr;

		for (var i = 0; i < this._framesList.length; i++) {
			secAr["parent"] = {};
			secAr = secAr["parent"];
			Object.assign(secAr, JSON.parse(FJSON.stringify(this._framesList[i])));
		}

		return finalAr["parent"];
	}


	Opkey.prototype._getFrames = function (win) {
		if (typeof index == "undefined")
			index = 0;
		var _opkey = this;
		var currentFrame = (_opkey.currentIframeDetails) ? _opkey.currentIframeDetails
			: {
				"parentTitle": _opkey.getTitle(),
				"parentURL": _opkey.getURL()
			};
		try {
			if (win.self === win.top) {
				var opkeywindowid = null;
				// if(_opkey.windowidentiferontitle==null){
				opkeywindowid = _opkey
					.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
				if (opkeywindowid == "") {
					opkeywindowid = _opkey.windowidentiferontitle;
				}
				// }
				// else{
				// opkeywindowid=_opkey.windowidentiferontitle;
				// }
				try {
					var title = currentFrame.parentTitle.replace(/\"/g,
						"&#x0022;").replace("'", "&#x0027;");
					if (title == "") {
						title = ""
					}
					this._framesList.push({
						"type": "HTML PAGE",
						"tag": "html",
						"index": "0",
						"titleindex": _opkey.indexofurrenttab,
						"title": title,
						"x": "0",
						"y": "0",
						"url": currentFrame.parentURL.replace(/{/g, '')
							.replace(/}/g, '').replace(/\"/g, "&#x0022;")
					});
				} catch (e) {
					// _opkey._debug(e)
				}
			} else {
				try {
					var currentFrame = null;
					try {
						currentFrame = win.frameElement;
						if (currentFrame == null) {
							currentFrame = _opkey.currentIframeDetails;
						}
					} catch (e) {
						currentFrame = _opkey.currentIframeDetails;
					}
					var frameindex = 0;
					try {
						var arrframes = win.parent.document
							.getElementsByTagName(currentFrame.nodeName)
						for (var i = 0; i < arrframes.length; i++) {
							var iframenode = arrframes[i]
							if (iframenode == currentFrame) {
								frameindex = i
								break
							}
						}
					} catch (e) {
					}
					var htmltitle = ""
					try {
						htmltitle = _opkey.getTitle();
						if (htmltitle == "") {
							htmltitle = currentFrame.contentDocument.title
						}
					} catch (e) {
						htmltitle = currentFrame.parentTitle
					}
					if (currentFrame != null && currentFrame.name != "mywindow") {
						var framesrc = "";
						try {
							framesrc = currentFrame.getAttribute("src");
						} catch (e) {
							framesrc = currentFrame.src;
						}
						try {
							if (framesrc != null) {
								framesrc = framesrc.replace(/\"/g, "&#x0022;")
									.replace("'", "&#x0027;");
							}
						} catch (e) {
						}

						var _documentUrl = document.URL;
						if (_documentUrl == null) {
							_documentUrl = "";
						}
						if (frameindex == 0) {
							var _frame_index = "0";
							if (currentFrame.opkeyindex != null) {
								_frame_index = currentFrame.opkeyindex
									.toString();
							}
							this._framesList.push({
								"type": "Frame",
								"tag": "iframe",
								"src": _opkey.escapeNullValue(framesrc),
								"url": _documentUrl,
								"index": _frame_index,
								"id": _opkey.escapeNullValue(currentFrame.id),
								"name": _opkey
									.escapeNullValue(currentFrame.name),
								"title": htmltitle,
								"x": currentFrame.x,
								"y": currentFrame.y
							});
						} else {
							this._framesList.push({
								"type": "Frame",
								"tag": "iframe",
								"src": _opkey.escapeNullValue(framesrc),
								"url": _documentUrl,
								"index": frameindex,
								"id": _opkey.escapeNullValue(currentFrame.id),
								"name": _opkey
									.escapeNullValue(currentFrame.name),
								"title": htmltitle,
								"x": currentFrame.x,
								"y": currentFrame.y
							});
						}
						// //console.log(currentFrame.src)
					}
				} catch (e) {
					// _opkey._debug(e)
				}
				_opkey._getFrames(win.parent);
			}
		} catch (e) {
			// _opkey._debug(e)
		}
	}

	Opkey.prototype.escapeNullValue = function (value) {
		return (value) ? value : '';
	}

	Opkey.prototype.arrayContains = function (a, obj) {
		var i = a.length;

		while (i--) {
			if (a[i] === obj) {
				return true;

			}
		}
		return false;
	}
	Opkey.prototype.arrayIndexOf = function (a, obj) {
		var i = a.length;
		while (i--) {
			if (a[i] === obj) {
				return i;
			}
		}
		return -1;
	}
	Opkey.prototype.triggerEvent = function (target, evtType) {
		// //this._debug("target" + target);
		if (target.nodeName != "INPUT") {
			if (this.lastMouseDownEl != null
				&& this.lastMouseDownEl.nodeName != "INPUT") {
				evtType.preventDefault();
				// return;
			}
		}
		if ("createEvent" in document) {
			// //this._debug("createevents")
			var event = target.ownerDocument.createEvent("HTMLEvents");
			event.initEvent(evtType, false, true);
			target.dispatchEvent(event);
		} else {
			try {
				target.fireEvent(evtType);
			} catch (e) {
			}
		}
	}
	Opkey.prototype.getURL = function () {
		return this.top().location.href;
	}

	Opkey.prototype.GetAttributeNode = function (_key, _value) {
		var _node = document.createElement(_key);
		_node.innerText = "<![CDATA[" + _value + "]]>";
		return _node;
	};

	Opkey.prototype.GetPropertiesInXML = function (_element) {
		var main_node = document.createElement("ChildProperties");
		main_node
			.appendChild(_opkey.GetAttributeNode("tag", _element.nodeName));
		if (_element.id) {
			main_node.appendChild(_opkey.GetAttributeNode("id", _element.id));
		}

		if (_element.name) {
			main_node.appendChild(_opkey
				.GetAttributeNode("name", _element.name));
		}

		if (_element.className) {
			main_node.appendChild(_opkey.GetAttributeNode("className",
				_element.className));
		}

		if (_element.type) {
			main_node.appendChild(_opkey
				.GetAttributeNode("type", _element.type));
		}

		main_node.appendChild(_opkey.GetAttributeNode("innertext",
			_element.textContent));
		var child_nodes = _element.parentNode.childNodes;
		var child_elements_array = new Array();
		for (var c_h = 0; c_h < child_nodes.length; c_h++) {
			if (child_nodes[c_h].nodeName == _element.nodeName) {
				child_elements_array.push(child_nodes[c_h]);
			}
		}

		main_node.appendChild(_opkey.GetAttributeNode("childIndex",
			child_elements_array.indexOf(_element).toString()));
		var _locators = this.getSeleniumAccessors(_element);
		for (var i = 0; i < _locators.length; i++) {
			var _key = _locators[i][1];
			var _value = _locators[i][0];
			main_node.appendChild(_opkey.GetAttributeNode(
				_key.replace(":", ""), _value));
		}
		var _outerHtml = "<?xml version='1.0' encoding='UTF-8'?>"
			+ main_node.outerHTML;
		_outerHtml = _outerHtml.replace(/>/g, "&gt;").replace(/</g, "&lt;");
		return _outerHtml;
	}

	Opkey.prototype.getScriptReturnedData = function (action, el, datavalue) {
		if (action == "setValue" || action == "_setValue") {
			if (datavalue == "") {
				return;
			}
			datavalue = datavalue.replace(/\"/g, '').replace(/\[/g, '&#91;')
				.replace(/\]/g, '&#93;')
		}

		if (el.type == "password") {
			action = "TypeSecureText";
		}
		try {
			if (action == "_click" || action == "click") {
				if (el.nodeName == "INPUT") {
					if (el.type == "text") {
						return;
					}
				}
			}
		} catch (e) {
		}
		// if(document.domain != "rediff.com" && e.type == "blur") return;
		var popupName = this.getPopupName();
		// this._debug("evType" + evType + " :el: " + el );
		var toSendAr = new Object();
		toSendAr["isAddedFromRightClick"] = true;
		toSendAr["action"] = action;
		datavalue = datavalue.replace(/\n+/g, "").replace(/\\/g, "&#x5c;");
		var dataArguments = {
			"type": "string",
			"data": datavalue
			// "data" : encodeURIComponent(this.escapeNullValue(value))
		}
		// toSendAr["popupName"] = popupName.replace(/\"/g, "&quote;");

		var elementProperties = new Object();
		elementProperties["ObjectImage"] = "";
		var previousAccessorType = [];
		var visitedAccessorType = 0;
		var checkstatus = "";
		if (el.innerText != null) {
			if (el.innerText != "") {
				this.getStepObj(el.innerText, "sahiText", elementProperties);
				if (el.textContent != null) {
					if (el.textContent != "") {
						var text_content = el.textContent;
						if (text_content.length > 250) {
							text_content = text_content.substring(0, 249);
						}
						this.getStepObj(text_content, "textContent",
							elementProperties);
					}
				}
			}
		}

		if (el.className != null && !el instanceof SVGElement) {
			var class_name = el.className;
			class_name = class_name.replace("OPkeyHighlighter", "").trim();
			this.getStepObj(class_name, "class", elementProperties);
		}
		this.getStepObj(el.tagName, "tag", elementProperties);
		if (typeof el.type != "undefined")
			this.getStepObj(el.type, "type", elementProperties);
		// Selenium accessors start
		var locators = this.getSeleniumAccessors(el);
		for (var i = 0; i < locators.length; i++) {
			try {
				if (locators[i][1] != "name") {
					this.getStepObj(locators[i][0], locators[i][1],
						elementProperties);
				}
			} catch (e) {
			}
		}
		if (el.getAttribute("href") != null) {
			elementProperties["href"] = el.getAttribute("href");
		}

		if (el.getAttribute("title") != null) {
			elementProperties["alt"] = el.getAttribute("title");
		}

		if (el.getAttribute("alt") != null) {
			elementProperties["alt"] = el.getAttribute("alt");
		}
		try {
			var backgroundcolorofelement = window.getComputedStyle(el, null)
				.getPropertyValue("background-color")
			var colorofelement = window.getComputedStyle(el, null)
				.getPropertyValue("color")

			// elementProperties["background-color"] = backgroundcolorofelement;
			// elementProperties["color"] = colorofelement;
			var rect = el.getBoundingClientRect();
			// elementProperties["width"]=(rect.right - rect.left)
			// elementProperties["height"]=(rect.bottom - rect.top)
			// elementProperties["x"]=rect.left
			// elementProperties["y"]=rect.top
			elementProperties["index"] = "0"
		} catch (e) {
		}
		var logicalname = el.nodeName;
		try {
			logicalname = _opkey.getLogicalNameOfObject(el,
				elementProperties["sahiText"])
			if (typeof logicalname === "object") {
				logicalname = el.nodeName
			}
		} catch (e) {
		}
		if (logicalname.length > 25) {
			logicalname = logicalname.substring(0, 25);
		}
		this.getStepObj(logicalname, "logicalname", elementProperties);
		try {

			if (el.nodeName == "INPUT" || el.nodeName == "TEXTAREA") {
				if (el.maxLength != -1) {
					elementProperties["length"] = el.maxLength
				}
				if (el.placeholder) {
					elementProperties["placeholder"] = el.placeholder.replace(
						/\"/g, "&#x0022;").replace("'", "&#x0027;");
				}
			}
			if (el.nodeName == "LI") {
				var parent = el.parentNode;
				var childnodes = parent.childNodes
				for (var k = 0; k < childnodes.length; k++) {
					if (childnodes[k] == el) {
						elementProperties["itemIndex"] = k
						break;
					}
				}
			}
			if (el.nodeName == "UL" || el.nodeName == "SELECT") {
				var count = el.childnodes.length
				elementProperties["itemCount"] = count
			}
		} catch (e) {
		}
		// Selenium accessors end
		_opkey.CreateBase64ImageAttributes(el, elementProperties);
		var recordingmode = _opkey.GetRecordingMode();
		if (recordingmode == "ORACLE FUSION") {
			var _oraclefusion = new OracleFusion();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}

		if (recordingmode == "JDE") {
			var _jdeRecorder = new JDERecorder();
			_jdeRecorder.GetLabelProperties(el, elementProperties);
		}

		if (recordingmode == "SERVICENOW") {
			var _servicenow = new ServiceNow();
			_servicenow.GetLabelProperties(el, elementProperties);
		}

		if (recordingmode == "SAP FIORI") {
			var _oraclefusion = new SAPFIORI();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}

		if (recordingmode == "SUCCESSFACTORS") {
			var _oraclefusion = new SuccessFactors();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}

		if (recordingmode == "MSDYNAMICS") {
			var _oraclefusion = new MSDynamics();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "MSDynamics FSO") {
			var _oraclefusion = new MSDynamicsAX();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "VEEVA VAULT") {
			var _oraclefusion = new VeevaVault();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "PEOPLESOFT") {
			var _peoplesoft = new PeopleSoft_OpKey();
			_peoplesoft.GetLabelProperties(el, elementProperties);
		}

		if (recordingmode == "SALESFORCE") {
			try {
				elementProperties["hasVisualForcePage"] = _opkey
					.HasVisualForcePage(el).toString();
				elementProperties["theme"] = _opkey.GetSalesforceMode();
				var label = _opkey.getMatchingLabelWithTextBoxNDropDown(el);
				if (label == null) {
					var keyword_mapped = _opkey.GetSalesForceRelatedData(
						action, el, dataArguments.data, null, null);
					//	@Mohit this is how we skip keyword
					if (keyword_mapped != null) {
						if (keyword_mapped == "SKIP_KEYWORD") {
							return;
						}
						return FJSON.stringify(keyword_mapped);
					}
				}
				if (label) {
					elementProperties["label:index"] = _opkey
						.CreateLabelPropertyIndex(label).toString();
					var label_content = label.innerText;
					if (label.childNodes.length > 0) {
						for (var ch_n = 0; ch_n < label.childNodes.length; ch_n++) {
							var first_child = label.childNodes[ch_n];
							if (first_child.nodeName != "#text"
								&& first_child.nodeName != "#comment"
								&& first_child.nodeName != "SELECT") {
								var text_content = first_child.innerText;
								if (text_content != null) {
									text_content = text_content.trim();
									if (text_content != "") {
										if (text_content.trim() != "*") {
											label_content = text_content;
											break;
										}
									}
								}
							}
						}
					}
					elementProperties["label:text"] = label_content;

					var keyword_mapped = _opkey.GetSalesForceRelatedData(
						action, el, dataArguments.data, elementProperties,
						label);
					if (keyword_mapped != null) {
						if (keyword_mapped == "SKIP_KEYWORD") {
							return;
						}
						return FJSON.stringify(keyword_mapped);
					}
					var labellocators = this.getSeleniumAccessors(label);
					for (var li = 0; li < labellocators.length; li++) {
						elementProperties["label:" + labellocators[li][1]] = labellocators[li][0]
					}
				}
				if (el.placeholder) {
					elementProperties["label:placeholder"] = el.placeholder
						.replace(/\"/g, "&#x0022;")
						.replace("'", "&#x0027;");
					;
				}
				if (el.aria - label) {
					elementProperties["label:arialabel"] = el.aria - label;
				}
			} catch (e) {
				// alert(e);
			}
		}
		// WORKDAY_RECORDER
		var isLOV = false;
		if (recordingmode == "WORKDAY") {
			try {
				try {
					if (el.tagName == 'SPAN'
						&& el.getAttribute("data-automation-id") == "promptIcon") {
						isLOV = true;
					}
					if (isLOV == false) {
						if (el.tagName == 'SPAN'
							&& el.getAttribute("data-automation-id") == "promptSelectionLabel") {
							isLOV = true;
						}
					}
					if (isLOV == false) {
						if (el.tagName == 'DIV'
							&& el.getAttribute("data-automation-id") == "promptSearchButton") {
							isLOV = true;
						}
					}
					if (isLOV == false) {
						if (el.tagName == 'DIV'
							&& el.getAttribute("data-automation-id") == "icon") {
							var child = el.firstElementChild;
							if ((child.tagName == 'svg' || child.tagName == 'SVG')
								&& child.getAttribute("id") == "wd-icon-prompts") {
								isLOV = true;
							}
						}
					}
					if (isLOV == true) {
						elementProperties["label:element_isLOV"] = "true";
					}
				} catch (e) {
				}
				if (el.hasAttribute("title")) {
					elementProperties["label:element_title"] = el
						.getAttribute("title");
				}
				if (el.hasAttribute("aria-label")) {
					elementProperties["label:element_aria-label"] = el
						.getAttribute("aria-label");
				}
				if (el.hasAttribute("placeholder")) {
					elementProperties["label:element_placeholder"] = el
						.getAttribute("placeholder").replace(/\"/g,
							"&#x0022;").replace("'", "&#x0027;");
				}
				if (el.hasAttribute("data-automation-id")) {
					elementProperties["label:element_data-automation-id"] = el
						.getAttribute("data-automation-id");
				}
				if (el.hasAttribute("data-automation-label")) {
					elementProperties["label:element_data-automation-label"] = el
						.getAttribute("data-automation-label");
				}
			} catch (e) {
			}
			var workdayelement = _opkey.workday_main_getLabel(el);
			if (workdayelement != null) {
				try {
					if (workdayelement.hasAttribute("aria-label")) {
						elementProperties["label:arialabel"] = workdayelement
							.getAttribute("aria-label");
					}
					if (workdayelement.hasAttribute("placeholder")) {
						elementProperties["label:placeholder"] = workdayelement
							.getAttribute("placeholder").replace(/\"/g,
								"&#x0022;").replace("'", "&#x0027;");
					}
					if (workdayelement.hasAttribute("data-automation-id")) {
						elementProperties["label:data-automation-id"] = workdayelement
							.getAttribute("data-automation-id");
					}
					if (workdayelement.hasAttribute("data-automation-label")) {
						elementProperties["label:data-automation-label"] = workdayelement
							.getAttribute("data-automation-label");
					}
				} catch (e) {
				}
				elementProperties["label:text"] = workdayelement.textContent;
				elementProperties["label:tagName"] = workdayelement.tagName;
				var workdaylabellocators = this
					.getSeleniumAccessors(workdayelement);
				for (var li = 0; li < workdaylabellocators.length; li++) {
					elementProperties["label:" + workdaylabellocators[li][1]] = workdaylabellocators[li][0]
				}
			} else {
				if (el.tagName == 'svg' || el.tagName == 'SVG') {
					var parentnode = el.parentNode;
					if (parentnode && parentnode.nodeType == 1
						&& parentnode.tagName == 'DIV') {
						if (parentnode.getAttribute("data-automation-id") != null) {
							if (parentnode.getAttribute("data-automation-id") == "icon"
								&& parentnode.parentNode
									.getAttribute("data-automation-id") == "gridFullscreenIconButton") {
								var parent_node = parentnode.parentNode;
								if (parent_node
									.getAttribute("data-automation-id") != null)
									elementProperties["label:element_data-automation-id"] = parent_node
										.getAttribute("data-automation-id");
								if (parent_node.getAttribute("aria-label") != null)
									elementProperties["label:element_aria-label"] = parent_node
										.getAttribute("aria-label");
								if (parent_node.getAttribute("title") != null)
									elementProperties["label:element_title"] = parent_node
										.getAttribute("title");
							} else {
								if (parentnode
									.getAttribute("data-automation-id") != null)
									elementProperties["label:element_data-automation-id"] = parentnode
										.getAttribute("data-automation-id");
								if (parentnode.getAttribute("aria-label") != null)
									elementProperties["label:element_aria-label"] = parentnode
										.getAttribute("aria-label");
								if (parentnode.getAttribute("title") != null)
									elementProperties["label:element_title"] = parentnode
										.getAttribute("title");
							}
						} else {
							var parent_node = parentnode.parentNode;
							if (parent_node.getAttribute("data-automation-id") != null)
								elementProperties["label:element_data-automation-id"] = parent_node
									.getAttribute("data-automation-id");
							if (parent_node.getAttribute("aria-label") != null)
								elementProperties["label:element_aria-label"] = parent_node
									.getAttribute("aria-label");
							if (parent_node.getAttribute("title") != null)
								elementProperties["label:element_title"] = parent_node
									.getAttribute("title");
						}
					}
				}
				if (el.tagName == 'path' || el.tagName == 'PATH') {
					var parentnode = el.parentNode;
					if (parentnode && parentnode.tagName == 'svg') {
						var parent_node = parentnode.parentNode;
						if (parent_node && parent_node.nodeType == 1
							&& parent_node.tagName == 'DIV') {
							if (parent_node.getAttribute("data-automation-id") != null) {
								if (parent_node
									.getAttribute("data-automation-id") == "icon"
									&& parent_node.parentNode
										.getAttribute("data-automation-id") == "gridFullscreenIconButton") {
									var parentElem = parent_node.parentNode;
									if (parentElem
										.getAttribute("data-automation-id") != null)
										elementProperties["label:element_data-automation-id"] = parentElem
											.getAttribute("data-automation-id");
									if (parentElem.getAttribute("aria-label") != null)
										elementProperties["label:element_aria-label"] = parentElem
											.getAttribute("aria-label");
									if (parentElem.getAttribute("title") != null)
										elementProperties["label:element_title"] = parentElem
											.getAttribute("title");
								} else {
									if (parent_node
										.getAttribute("data-automation-id") != null)
										elementProperties["label:element_data-automation-id"] = parent_node
											.getAttribute("data-automation-id");
									if (parent_node.getAttribute("aria-label") != null)
										elementProperties["label:element_aria-label"] = parent_node
											.getAttribute("aria-label");
									if (parent_node.getAttribute("title") != null)
										elementProperties["label:element_title"] = parent_node
											.getAttribute("title");
								}
							} else {
								var parentElem = parent_node.parentNode;
								if (parentElem
									.getAttribute("data-automation-id") != null)
									elementProperties["label:element_data-automation-id"] = parentElem
										.getAttribute("data-automation-id");
								if (parentElem.getAttribute("aria-label") != null)
									elementProperties["label:element_aria-label"] = parentElem
										.getAttribute("aria-label");
								if (parentElem.getAttribute("title") != null)
									elementProperties["label:element_title"] = parentElem
										.getAttribute("title");
							}
						}
					}
				}
			}
		}

		if (elementProperties["sahiText"]) {
			elementProperties["logicalname"] = elementProperties["sahiText"];
		} else if (elementProperties["label:element_aria-label"]) {
			elementProperties["logicalname"] = elementProperties["label:element_aria-label"];
		} else if (elementProperties["label:element_data-automation-label"]) {
			elementProperties["logicalname"] = elementProperties["label:element_data-automation-label"];
		} else if (elementProperties["label:element_placeholder"]) {
			elementProperties["logicalname"] = elementProperties["label:element_placeholder"];
		} else if (elementProperties["label:element_title"]) {
			elementProperties["logicalname"] = elementProperties["label:element_title"];
		} else if (elementProperties["label:text"]) {
			elementProperties["logicalname"] = elementProperties["label:text"];
		} else if (elementProperties["label:arialabel"]) {
			elementProperties["logicalname"] = elementProperties["label:arialabel"];
		} else if (elementProperties["label:element_data-automation-id"]) {
			elementProperties["logicalname"] = elementProperties["label:element_data-automation-id"];
		} else if (elementProperties["label:data-automation-id"]) {
			elementProperties["logicalname"] = elementProperties["label:data-automation-id"];
		}

		this._framesList = new Array();
		this._tempframesList = new Array();
		var htmltitle;
		var titleindex;
		var doc = el.ownerDocument;
		var win = doc.defaultView || doc.parentWindow;
		this._getFrames(win);
		var baseurl = "";
		for (var i = 0; i < this._framesList.length; i++) {
			var parentobject = this._framesList[i]
			if (parentobject["tag"] == "html") {
				htmltitle = parentobject["title"]
				toSendAr["popupName"] = htmltitle;
				titleindex = parentobject["titleindex"]
				baseurl = parentobject["url"]
			}
		}
		for (var j = 0; j < this._framesList.length; j++) {
			var parentobject = this._framesList[j]
			parentobject["title"] = htmltitle;
			parentobject["titleindex"] = titleindex;
			if (parentobject["src"] == null || parentobject["src"] == "") {
				parentobject["src"] = baseurl;
			}
			this._tempframesList.push(parentobject)
		}
		this._framesList = this._tempframesList
		var parentobject = this._getFinalFramesList();
		if (parentobject == null) {
			var opkeywindowid = null;
			opkeywindowid = _opkey
				.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
			if (opkeywindowid == "") {
				opkeywindowid = _opkey.windowidentiferontitle;
			}
			var probject = new Object();
			probject["tag"] = "HTML";
			probject["type"] = "html page";
			probject["title"] = _opkey.getTitle().replace(/{/g, '').replace(
				/}/g, '');
			probject["url"] = _opkey.getURL().replace(/{/g, '').replace(/}/g,
				'').replace(/\"/g, "&#x0022;");
			;
			probject["titleindex"] = _opkey.indexofurrenttab;
			parentobject = probject;
		}
		elementProperties["parent"] = parentobject;
		if (el.nodeName == "TD" || el.nodeName == "TR") {
			while (el.parentNode) {
				if (el.nodeName == "TABLE") {
					var tableobject = new Object()
					tableobject["tag"] = el.nodeName
					tableobject["type"] = "table"
					tableobject["id"] = el.id
					tableobject["name"] = el.name
					tableobject["class"] = el.className
					elementProperties["parent"] = tableobject
					break;
				}
				el = el.parentNode;
			}
		}

		toSendAr["arguments"] = [elementProperties, dataArguments];

		var retdata = FJSON.stringify(toSendAr)
		var tempscript = null;
		try {
			tempscript = retdata;
			var tempobject = toSendAr;
			tempobject.arguments[0].ObjectImage = null;
			tempobject.arguments[0]["parent"] = null;
			for (var key in tempobject.arguments[0]) {
				if (tempobject.arguments[0][key]) {
					tempobject.arguments[0][key] = removeindex(tempobject.arguments[0][key]);
				}
			}
			if (tempobject["action"] == "click") {
				tempobject.arguments[1]["data"] = null;
			}
			tempscript = JSON.stringify(tempobject)

		} catch (e) {
			tempscript = null;
		}

		if (tempscript != null) {
			if (this.hasEventBeenRecorded(tempscript)) {
				return; // IE
			}
		} else {
			if (this.hasEventBeenRecorded(retdata)) {
				return; // IE
			}
		}
		for (var k = 0; k < 1000; k++) {
			retdata = retdata.toString().replace('\\"', '"')
			retdata = retdata.toString().replace('arguments":"[{',
				'arguments":[{')
			retdata = retdata.toString().replace(']"}', ']}')
		}
		return retdata;
	}

	Opkey.prototype.getCustomeKeywordScript = function (action, el, datavalue) {
		if (action == "setValue" || action == "_setValue" || action == "setValueAndEnter") {
			if (datavalue == "") {
				return;
			}
			datavalue = datavalue.replace(/\"/g, '').replace(/\[/g, '&#91;')
				.replace(/\]/g, '&#93;')
		}

		if (el.type == "password") {
			action = "TypeSecureText";
		}
		try {
			if (datavalue != "OPKEY_IGNORE_CHECK") {
				if (action == "_click" || action == "click") {
					if (el.nodeName == "INPUT") {
						if (el.type == "text") {
							return;
						}
					}
				}
			}
		} catch (e) {
		}
		if (datavalue == "OPKEY_IGNORE_CHECK") {
			datavalue = "";
		}
		// if(document.domain != "rediff.com" && e.type == "blur") return;
		try {
			el.classList.remove("OPkeyHighlighter");
		} catch (e) {
		}
		var popupName = this.getPopupName();
		// this._debug("evType" + evType + " :el: " + el );
		var toSendAr = new Object();

		toSendAr["action"] = action;
		datavalue = datavalue.replace(/\n+/g, "").replace(/\\/g, "&#x5c;");
		var dataArguments = {
			"type": "string",
			"data": datavalue
			// "data" : encodeURIComponent(this.escapeNullValue(value))
		}
		// toSendAr["popupName"] = popupName.replace(/\"/g, "&quote;");

		var elementProperties = new Object();
		elementProperties["ObjectImage"] = "";
		try {
			var text_c_array = GetTextPropertyArray(el);
			for (var t_c_i = 0; t_c_i < text_c_array.length; t_c_i++) {
				var text_c_object = text_c_array[t_c_i];
				for (var _key in text_c_object) {
					var attr_key = _key;
					var attr_value = text_c_object[attr_key];
					elementProperties[attr_key] = attr_value;
				}
			}
		} catch (e) {
		}
		var previousAccessorType = [];
		var visitedAccessorType = 0;
		var checkstatus = "";
		if (el.innerText != null) {
			if (el.innerText != "") {
				this.getStepObj(el.innerText, "sahiText", elementProperties);
				if (el.textContent != null) {
					if (el.textContent != "") {
						var text_content = el.textContent;
						if (text_content.length > 250) {
							text_content = text_content.substring(0, 249);
						}
						this.getStepObj(text_content, "textContent",
							elementProperties);
					}
				}
			}
		}

		if (el.getAttribute("contenteditable") != null) {
			this.getStepObj(el.getAttribute("contenteditable").toString(),
				"contenteditable", elementProperties);
		}
		if (el.className != null && !el instanceof SVGElement) {
			this.getStepObj(el.className, "class", elementProperties);
		}
		this.getStepObj(el.tagName, "tag", elementProperties);
		if (typeof el.type != "undefined")
			this.getStepObj(el.type, "type", elementProperties);
		// Selenium accessors start
		var locators = this.getSeleniumAccessors(el);
		for (var i = 0; i < locators.length; i++) {
			try {
				if (locators[i][1] != "name") {
					this.getStepObj(locators[i][0], locators[i][1],
						elementProperties);
				}
			} catch (e) {
			}
		}
		if (el.getAttribute("href") != null) {
			elementProperties["href"] = el.getAttribute("href");
		}

		if (el.getAttribute("title") != null) {
			elementProperties["alt"] = el.getAttribute("title").replace(/\"/g, "&#x0022;");
		}

		if (el.getAttribute("alt") != null) {
			elementProperties["alt"] = el.getAttribute("alt").replace(/\"/g, "&#x0022;");
		}
		try {
			var backgroundcolorofelement = window.getComputedStyle(el, null)
				.getPropertyValue("background-color")
			var colorofelement = window.getComputedStyle(el, null)
				.getPropertyValue("color")

			// elementProperties["background-color"] = backgroundcolorofelement;
			// elementProperties["color"] = colorofelement;
			var rect = el.getBoundingClientRect();
			// elementProperties["width"]=(rect.right - rect.left)
			// elementProperties["height"]=(rect.bottom - rect.top)
			// elementProperties["x"]=rect.left
			// elementProperties["y"]=rect.top
			if (el.getAttribute("value") != null) {
				elementProperties["value"] = el.getAttribute("value");
			}

			elementProperties["index"] = "0"
		} catch (e) {
		}
		var logicalname = el.nodeName;
		try {
			logicalname = _opkey.getLogicalNameOfObject(el,
				elementProperties["sahiText"])
			if (typeof logicalname === "object") {
				logicalname = el.nodeName
			}
		} catch (e) {
		}
		if (logicalname.length > 25) {
			logicalname = logicalname.substring(0, 25);
		}
		this.getStepObj(logicalname, "logicalname", elementProperties);
		try {

			if (el.nodeName == "INPUT" || el.nodeName == "TEXTAREA") {
				if (el.maxLength != -1) {
					elementProperties["length"] = el.maxLength
				}
				if (el.placeholder) {
					elementProperties["placeholder"] = el.placeholder.replace(
						/\"/g, "&#x0022;").replace("'", "&#x0027;");
				}
			}
			if (el.nodeName == "LI") {
				var parent = el.parentNode;
				var childnodes = parent.childNodes
				for (var k = 0; k < childnodes.length; k++) {
					if (childnodes[k] == el) {
						elementProperties["itemIndex"] = k
						break;
					}
				}
			}
			if (el.nodeName == "UL" || el.nodeName == "SELECT") {
				var count = el.childnodes.length
				elementProperties["itemCount"] = count
			}
		} catch (e) {
		}
		// Selenium accessors end
		_opkey.CreateBase64ImageAttributes(el, elementProperties);
		var recordingmode = _opkey.GetRecordingMode();

		if (recordingmode == "WEB") {
			debugger
			var _servicenow = new OracleFusion();
			_servicenow.GetLabelProperties(el, elementProperties);
		}

		if (recordingmode == "ORACLE FUSION") {
			var _servicenow = new OracleFusion();
			_servicenow.GetLabelProperties(el, elementProperties);
		}

		if (recordingmode == "JDE") {
			var _jdeRecorder = new JDERecorder();
			_jdeRecorder.GetLabelProperties(el, elementProperties);
		}

		if (recordingmode == "SERVICENOW") {
			var _oraclefusion = new ServiceNow();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}

		if (recordingmode == "SAP FIORI") {
			var _oraclefusion = new SAPFIORI();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "SUCCESSFACTORS") {
			var _oraclefusion = new SuccessFactors();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "MSDYNAMICS") {
			var _oraclefusion = new MSDynamics();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "MSDynamics FSO") {
			var _oraclefusion = new MSDynamicsAX();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "VEEVA VAULT") {
			var _oraclefusion = new VeevaVault();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "PEOPLESOFT") {
			var _peoplesoft = new PeopleSoft_OpKey();
			_peoplesoft.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "SAP FIORI") {
			var _oraclefusion = new SAPFIORI();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "SUCCESSFACTORS") {
			var _oraclefusion = new SuccessFactors();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "SALESFORCE") {
			try {
				elementProperties["hasVisualForcePage"] = _opkey
					.HasVisualForcePage(el).toString();
				elementProperties["theme"] = _opkey.GetSalesforceMode();
				var label = _opkey.getMatchingLabelWithTextBoxNDropDown(el);
				if (label == null) {
					var keyword_mapped = _opkey.GetSalesForceRelatedData(
						action, el, dataArguments.data, null, null);
					if (keyword_mapped != null) {
						if (keyword_mapped == "SKIP_KEYWORD") {
							return;
						}
						return FJSON.stringify(keyword_mapped);
					}
				}
				if (label) {
					elementProperties["label:index"] = _opkey
						.CreateLabelPropertyIndex(label).toString();
					var label_content = label.innerText;
					if (label.childNodes.length > 0) {
						for (var ch_n = 0; ch_n < label.childNodes.length; ch_n++) {
							var first_child = label.childNodes[ch_n];
							if (first_child.nodeName != "#text"
								&& first_child.nodeName != "#comment"
								&& first_child.nodeName != "SELECT") {
								var text_content = first_child.innerText;
								if (text_content != null) {
									text_content = text_content.trim();
									if (text_content != "") {
										if (text_content.trim() != "*") {
											label_content = text_content;
											break;
										}
									}
								}
							}
						}
					}
					elementProperties["label:text"] = label_content;

					var keyword_mapped = _opkey.GetSalesForceRelatedData(
						action, el, dataArguments.data, elementProperties,
						label);
					if (keyword_mapped != null) {
						if (keyword_mapped == "SKIP_KEYWORD") {
							return;
						}
						return FJSON.stringify(keyword_mapped);
					}
					var labellocators = this.getSeleniumAccessors(label);
					for (var li = 0; li < labellocators.length; li++) {
						elementProperties["label:" + labellocators[li][1]] = labellocators[li][0]
					}
				}
				if (el.placeholder) {
					elementProperties["label:placeholder"] = el.placeholder
						.replace(/\"/g, "&#x0022;")
						.replace("'", "&#x0027;");
					;
				}
				if (el.aria - label) {
					elementProperties["label:arialabel"] = el.aria - label;
				}
			} catch (e) {
				// alert(e);
			}
		}
		// WORKDAY_RECORDER
		var isLOV = false;
		if (recordingmode == "WORKDAY") {
			try {
				try {
					if (el.tagName == 'SPAN'
						&& el.getAttribute("data-automation-id") == "promptIcon") {
						isLOV = true;
					}
					if (isLOV == false) {
						if (el.tagName == 'SPAN'
							&& el.getAttribute("data-automation-id") == "promptSelectionLabel") {
							isLOV = true;
						}
					}
					if (isLOV == false) {
						if (el.tagName == 'DIV'
							&& el.getAttribute("data-automation-id") == "promptSearchButton") {
							isLOV = true;
						}
					}
					if (isLOV == false) {
						if (el.tagName == 'DIV'
							&& el.getAttribute("data-automation-id") == "icon") {
							var child = el.firstElementChild;
							if ((child.tagName == 'svg' || child.tagName == 'SVG')
								&& child.getAttribute("id") == "wd-icon-prompts") {
								isLOV = true;
							}
						}
					}
					if (isLOV == true) {
						elementProperties["label:element_isLOV"] = "true";
					}
				} catch (e) {
				}
				if (el.hasAttribute("title")) {
					elementProperties["label:element_title"] = el
						.getAttribute("title");
				}
				if (el.hasAttribute("aria-label")) {
					elementProperties["label:element_aria-label"] = el
						.getAttribute("aria-label");
				}
				if (el.hasAttribute("placeholder")) {
					elementProperties["label:element_placeholder"] = el
						.getAttribute("placeholder").replace(/\"/g,
							"&#x0022;").replace("'", "&#x0027;");
				}
				if (el.hasAttribute("data-automation-id")) {
					elementProperties["label:element_data-automation-id"] = el
						.getAttribute("data-automation-id");
				}
				if (el.hasAttribute("data-automation-label")) {
					elementProperties["label:element_data-automation-label"] = el
						.getAttribute("data-automation-label");
				}
			} catch (e) {
			}
			var workdayelement = _opkey.workday_main_getLabel(el);
			if (workdayelement != null) {
				try {
					if (workdayelement.hasAttribute("aria-label")) {
						elementProperties["label:arialabel"] = workdayelement
							.getAttribute("aria-label");
					}
					if (workdayelement.hasAttribute("placeholder")) {
						elementProperties["label:placeholder"] = workdayelement
							.getAttribute("placeholder").replace(/\"/g,
								"&#x0022;").replace("'", "&#x0027;");
					}
					if (workdayelement.hasAttribute("data-automation-id")) {
						elementProperties["label:data-automation-id"] = workdayelement
							.getAttribute("data-automation-id");
					}
					if (workdayelement.hasAttribute("data-automation-label")) {
						elementProperties["label:data-automation-label"] = workdayelement
							.getAttribute("data-automation-label");
					}
				} catch (e) {
				}
				elementProperties["label:text"] = workdayelement.textContent;
				elementProperties["label:tagName"] = workdayelement.tagName;
				var workdaylabellocators = this
					.getSeleniumAccessors(workdayelement);
				for (var li = 0; li < workdaylabellocators.length; li++) {
					elementProperties["label:" + workdaylabellocators[li][1]] = workdaylabellocators[li][0]
				}
			} else {
				if (el.tagName == 'svg' || el.tagName == 'SVG') {
					var parentnode = el.parentNode;
					if (parentnode && parentnode.nodeType == 1
						&& parentnode.tagName == 'DIV') {
						if (parentnode.getAttribute("data-automation-id") != null) {
							if (parentnode.getAttribute("data-automation-id") == "icon"
								&& parentnode.parentNode
									.getAttribute("data-automation-id") == "gridFullscreenIconButton") {
								var parent_node = parentnode.parentNode;
								if (parent_node
									.getAttribute("data-automation-id") != null)
									elementProperties["label:element_data-automation-id"] = parent_node
										.getAttribute("data-automation-id");
								if (parent_node.getAttribute("aria-label") != null)
									elementProperties["label:element_aria-label"] = parent_node
										.getAttribute("aria-label");
								if (parent_node.getAttribute("title") != null)
									elementProperties["label:element_title"] = parent_node
										.getAttribute("title");
							} else {
								if (parentnode
									.getAttribute("data-automation-id") != null)
									elementProperties["label:element_data-automation-id"] = parentnode
										.getAttribute("data-automation-id");
								if (parentnode.getAttribute("aria-label") != null)
									elementProperties["label:element_aria-label"] = parentnode
										.getAttribute("aria-label");
								if (parentnode.getAttribute("title") != null)
									elementProperties["label:element_title"] = parentnode
										.getAttribute("title");
							}
						} else {
							var parent_node = parentnode.parentNode;
							if (parent_node.getAttribute("data-automation-id") != null)
								elementProperties["label:element_data-automation-id"] = parent_node
									.getAttribute("data-automation-id");
							if (parent_node.getAttribute("aria-label") != null)
								elementProperties["label:element_aria-label"] = parent_node
									.getAttribute("aria-label");
							if (parent_node.getAttribute("title") != null)
								elementProperties["label:element_title"] = parent_node
									.getAttribute("title");
						}
					}
				}
				if (el.tagName == 'path' || el.tagName == 'PATH') {
					var parentnode = el.parentNode;
					if (parentnode && parentnode.tagName == 'svg') {
						var parent_node = parentnode.parentNode;
						if (parent_node && parent_node.nodeType == 1
							&& parent_node.tagName == 'DIV') {
							if (parent_node.getAttribute("data-automation-id") != null) {
								if (parent_node
									.getAttribute("data-automation-id") == "icon"
									&& parent_node.parentNode
										.getAttribute("data-automation-id") == "gridFullscreenIconButton") {
									var parentElem = parent_node.parentNode;
									if (parentElem
										.getAttribute("data-automation-id") != null)
										elementProperties["label:element_data-automation-id"] = parentElem
											.getAttribute("data-automation-id");
									if (parentElem.getAttribute("aria-label") != null)
										elementProperties["label:element_aria-label"] = parentElem
											.getAttribute("aria-label");
									if (parentElem.getAttribute("title") != null)
										elementProperties["label:element_title"] = parentElem
											.getAttribute("title");
								} else {
									if (parent_node
										.getAttribute("data-automation-id") != null)
										elementProperties["label:element_data-automation-id"] = parent_node
											.getAttribute("data-automation-id");
									if (parent_node.getAttribute("aria-label") != null)
										elementProperties["label:element_aria-label"] = parent_node
											.getAttribute("aria-label");
									if (parent_node.getAttribute("title") != null)
										elementProperties["label:element_title"] = parent_node
											.getAttribute("title");
								}
							} else {
								var parentElem = parent_node.parentNode;
								if (parentElem
									.getAttribute("data-automation-id") != null)
									elementProperties["label:element_data-automation-id"] = parentElem
										.getAttribute("data-automation-id");
								if (parentElem.getAttribute("aria-label") != null)
									elementProperties["label:element_aria-label"] = parentElem
										.getAttribute("aria-label");
								if (parentElem.getAttribute("title") != null)
									elementProperties["label:element_title"] = parentElem
										.getAttribute("title");
							}
						}
					}
				}
			}
		}

		if (elementProperties["sahiText"]) {
			elementProperties["logicalname"] = elementProperties["sahiText"];
		} else if (elementProperties["label:element_aria-label"]) {
			elementProperties["logicalname"] = elementProperties["label:element_aria-label"];
		} else if (elementProperties["label:element_data-automation-label"]) {
			elementProperties["logicalname"] = elementProperties["label:element_data-automation-label"];
		} else if (elementProperties["label:element_placeholder"]) {
			elementProperties["logicalname"] = elementProperties["label:element_placeholder"];
		} else if (elementProperties["label:element_title"]) {
			elementProperties["logicalname"] = elementProperties["label:element_title"];
		} else if (elementProperties["label:text"]) {
			elementProperties["logicalname"] = elementProperties["label:text"];
		} else if (elementProperties["label:arialabel"]) {
			elementProperties["logicalname"] = elementProperties["label:arialabel"];
		} else if (elementProperties["label:element_data-automation-id"]) {
			elementProperties["logicalname"] = elementProperties["label:element_data-automation-id"];
		} else if (elementProperties["label:data-automation-id"]) {
			elementProperties["logicalname"] = elementProperties["label:data-automation-id"];
		}
		if (label_text_input != null) {
			elementProperties["logicalname"] = label_text_input;
			label_text_input = null;
		}
		if (elementProperties["tag"] === "INPUT") {
			if (elementProperties["logicalname"][0] == "*") {
				elementProperties["logicalname"] = elementProperties["logicalname"].substring(1);
			}

			else {
				elementProperties["logicalname"] = elementProperties["logicalname"];
			}

		}

		this._framesList = new Array();
		this._tempframesList = new Array();
		var htmltitle;
		var titleindex;
		var doc = el.ownerDocument;
		var win = doc.defaultView || doc.parentWindow;
		this._getFrames(win);
		var baseurl = "";
		for (var i = 0; i < this._framesList.length; i++) {
			var parentobject = this._framesList[i]
			if (parentobject["tag"] == "html") {
				htmltitle = parentobject["title"]
				toSendAr["popupName"] = htmltitle;
				titleindex = parentobject["titleindex"]
				baseurl = parentobject["url"]
			}
		}
		for (var j = 0; j < this._framesList.length; j++) {
			var parentobject = this._framesList[j]
			parentobject["title"] = htmltitle;
			parentobject["titleindex"] = titleindex;
			if (parentobject["src"] == null || parentobject["src"] == "") {
				parentobject["src"] = baseurl;
			}
			this._tempframesList.push(parentobject)
		}
		this._framesList = this._tempframesList
		var parentobject = this._getFinalFramesList();
		if (parentobject == null) {
			var opkeywindowid = null;
			opkeywindowid = _opkey
				.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
			if (opkeywindowid == "") {
				opkeywindowid = _opkey.windowidentiferontitle;
			}
			var probject = new Object();
			probject["tag"] = "HTML";
			probject["type"] = "html page";
			probject["title"] = _opkey.getTitle().replace(/{/g, '').replace(
				/}/g, '');
			probject["url"] = _opkey.getURL().replace(/{/g, '').replace(/}/g,
				'').replace(/\"/g, "&#x0022;");
			;
			probject["titleindex"] = _opkey.indexofurrenttab;
			parentobject = probject;
		}
		elementProperties["parent"] = parentobject;

		toSendAr["arguments"] = [elementProperties, dataArguments];

		var retdata = FJSON.stringify(toSendAr)
		var tempscript = null;
		try {
			tempscript = retdata;
			var tempobject = toSendAr;
			tempobject.arguments[0].ObjectImage = null;
			tempobject.arguments[0]["parent"] = null;
			for (var key in tempobject.arguments[0]) {
				if (tempobject.arguments[0][key]) {
					tempobject.arguments[0][key] = removeindex(tempobject.arguments[0][key]);
				}
			}
			if (tempobject["action"] == "click") {
				tempobject.arguments[1]["data"] = null;
			}
			tempscript = JSON.stringify(tempobject)

		} catch (e) {
			tempscript = null;
		}

		if (tempscript != null) {
			if (this.hasEventBeenRecorded(tempscript)) {
				return; // IE
			}
		} else {
			if (this.hasEventBeenRecorded(retdata)) {
				return; // IE
			}
		}
		for (var k = 0; k < 50; k++) {
			retdata = retdata.toString().replace('\\"', '"')
			retdata = retdata.toString().replace('arguments":"[{',
				'arguments":[{')
			retdata = retdata.toString().replace(']"}', ']}')
		}


		if (action != null && action !== "NO_ACTION") {
			_opkey.recordStep(retdata, el);
		}

		return retdata;
	}

	Opkey.prototype.getPageIndex = function (el) {
		try {
			var node_lists = document.getElementsByTagName(el.nodeName);
			for (var n_l_i = 0; n_l_i < node_lists.length; n_l_i++) {
				var c_el = node_lists[n_l_i];
				if (c_el == el) {
					return n_l_i;
				}
			}
		} catch (e) {
			return 0;
		}
	};

	Opkey.prototype.getCustomeKeywordScriptReturnedData = function (action, el,
		datavalue, require_composite_keyword) {
		// ////////debugger;
		if (datavalue == "") {
			return;
		}

		if (datavalue == "OPKEY_VALUE_IGNORE") {
			datavalue = "";
		}
		if (el.type == "password") {
			action = "TypeSecureText";
		}

		try {
			el.classList.remove("OPkeyHighlighter")
		} catch (e) {

		}
		// if(document.domain != "rediff.com" && e.type == "blur") return;
		var popupName = this.getPopupName();
		// this._debug("evType" + evType + " :el: " + el );
		var toSendAr = new Object();

		toSendAr["action"] = action;
		datavalue = datavalue.replace(/\n+/g, "").replace(/\\/g, "&#x5c;");
		var dataArguments = {
			"type": "string",
			"data": datavalue
			// "data" : encodeURIComponent(this.escapeNullValue(value))
		}
		// toSendAr["popupName"] = popupName.replace(/\"/g, "&quote;");

		var elementProperties = new Object();
		elementProperties["ObjectImage"] = "";

		var previousAccessorType = [];
		var visitedAccessorType = 0;
		var checkstatus = "";

		if (el.nodeName != "SELECT") {
			if (el.innerText != null) {
				if (el.innerText != "") {
					this
						.getStepObj(el.innerText, "sahiText",
							elementProperties);
					if (el.textContent != null) {
						if (el.textContent != "") {
							var text_content = el.textContent;
							if (text_content.length > 250) {
								text_content = text_content.substring(0, 249);
							}
							this.getStepObj(text_content, "textContent",
								elementProperties);
						}
					}
				}
			}
		}
		if (el.className != null && !el instanceof SVGElement) {
			this.getStepObj(el.className, "class", elementProperties);
		}
		this.getStepObj(el.tagName, "tag", elementProperties);
		if (typeof el.type != "undefined")
			this.getStepObj(el.type, "type", elementProperties);
		// Selenium accessors start
		var locators = this.getSeleniumAccessors(el);
		for (var i = 0; i < locators.length; i++) {
			try {
				if (locators[i][1] != "name") {
					this.getStepObj(locators[i][0], locators[i][1],
						elementProperties);
				}
			} catch (e) {
			}
		}
		try {
			var backgroundcolorofelement = window.getComputedStyle(el, null)
				.getPropertyValue("background-color")
			var colorofelement = window.getComputedStyle(el, null)
				.getPropertyValue("color")

			if (el.getAttribute("value") != null) {
				elementProperties["value"] = el.getAttribute("value");
			}

			if (el.getAttribute("alt") != null) {
				elementProperties["alt"] = el.getAttribute("alt").replace(/\"/g, "&#x0022;");
			}

			if (el.getAttribute("title") != null) {
				elementProperties["alt"] = el.getAttribute("title").replace(/\"/g, "&#x0022;");
			}

			elementProperties["index"] = _opkey.getPageIndex(el).toString();
			// elementProperties["background-color"] = backgroundcolorofelement;
			// elementProperties["color"] = colorofelement;
			var rect = el.getBoundingClientRect();
			// elementProperties["width"]=(rect.right - rect.left)
			// elementProperties["height"]=(rect.bottom - rect.top)
			// elementProperties["x"]=rect.left
			// elementProperties["y"]=rect.top
			// var
			// imagebase64=_opkey.sendToServer('/_s_/dyn/Driver_getRealtimeObjectImage?width='+rect.width+'&height='+rect.height);
			if (el.type != null) {
				elementProperties["type"] = el.type;
			}
		} catch (e) {
		}
		var logicalname = el.nodeName;
		try {
			logicalname = _opkey.getLogicalNameOfObject(el,
				elementProperties["sahiText"])
			if (typeof logicalname === "object") {
				logicalname = el.nodeName
			}
		} catch (e) {
		}
		if (logicalname.length > 25) {
			logicalname = logicalname.substring(0, 25);
		}
		this.getStepObj(logicalname, "logicalname", elementProperties);
		try {

			if (el.nodeName == "INPUT" || el.nodeName == "TEXTAREA") {
				if (el.maxLength != -1) {
					elementProperties["length"] = el.maxLength
				}
				if (el.placeholder) {
					elementProperties["placeholder"] = el.placeholder.replace(
						/\"/g, "&#x0022;").replace("'", "&#x0027;");
				}
			}
			if (el.nodeName == "LI") {
				var parent = el.parentNode;
				var childnodes = parent.childNodes
				for (var k = 0; k < childnodes.length; k++) {
					if (childnodes[k] == el) {
						elementProperties["itemIndex"] = k
						break;
					}
				}
			}
			if (el.nodeName == "UL" || el.nodeName == "SELECT") {
				var count = el.childnodes.length
				elementProperties["itemCount"] = count
			}
		} catch (e) {
		}
		// Selenium accessors end
		if (el.getAttribute("contenteditable") != null) {
			elementProperties["contenteditable"] = el
				.getAttribute("contenteditable");
		}
		_opkey.CreateBase64ImageAttributes(el, elementProperties);
		var recordingmode = _opkey.GetRecordingMode();

		if (recordingmode == "ORACLE FUSION") {
			var _oraclefusion = new OracleFusion();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}

		if (recordingmode == "JDE") {
			var _jdeRecorder = new JDERecorder();
			_jdeRecorder.GetLabelProperties(el, elementProperties);
		}

		if (recordingmode == "SERVICENOW") {
			var _oraclefusion = new ServiceNow();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "SAP FIORI") {
			var _oraclefusion = new SAPFIORI();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "SUCCESSFACTORS") {
			var _oraclefusion = new SuccessFactors();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "MSDYNAMICS") {
			var _oraclefusion = new MSDynamics();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "VEEVA VAULT") {
			var _oraclefusion = new VeevaVault();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "MSDynamics FSO") {
			var _oraclefusion = new MSDynamicsAX();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "PEOPLESOFT") {
			var _peoplesoft = new PeopleSoft_OpKey();
			_peoplesoft.GetLabelProperties(el, elementProperties);
		}

		if (recordingmode == "SALESFORCE") {
			try {
				elementProperties["hasVisualForcePage"] = _opkey
					.HasVisualForcePage(el).toString();
				elementProperties["theme"] = _opkey.GetSalesforceMode();
				var label = _opkey.getMatchingLabelWithTextBoxNDropDown(el);
				if (label == null) {
					if (require_composite_keyword) {
						var keyword_mapped = _opkey.GetSalesForceRelatedData(
							action, el, dataArguments.data, null, null);
						if (keyword_mapped != null) {
							if (keyword_mapped == "SKIP_KEYWORD") {
								return;
							}
							return FJSON.stringify(keyword_mapped);
						}
					}
				}
				if (label) {
					elementProperties["label:index"] = _opkey
						.CreateLabelPropertyIndex(label).toString();
					var label_content = label.innerText;
					if (label.childNodes.length > 0) {
						for (var ch_n = 0; ch_n < label.childNodes.length; ch_n++) {
							var first_child = label.childNodes[ch_n];
							if (first_child.nodeName != "#text"
								&& first_child.nodeName != "#comment"
								&& first_child.nodeName != "SELECT") {
								var text_content = first_child.innerText;
								if (text_content != null) {
									text_content = text_content.trim();
									if (text_content != "") {
										if (text_content.trim() != "*") {
											label_content = text_content;
											break;
										}
									}
								}
							}
						}
					}
					elementProperties["label:text"] = label_content;
					if (require_composite_keyword) {
						var keyword_mapped = _opkey.GetSalesForceRelatedData(
							action, el, dataArguments.data,
							elementProperties, label);
						if (keyword_mapped != null) {
							if (keyword_mapped == "SKIP_KEYWORD") {
								return;
							}
							return FJSON.stringify(keyword_mapped);
						}
					}
					var labellocators = this.getSeleniumAccessors(label);
					for (var li = 0; li < labellocators.length; li++) {
						elementProperties["label:" + labellocators[li][1]] = labellocators[li][0]
					}
				}
				if (el.placeholder) {
					elementProperties["label:placeholder"] = el.placeholder
						.replace(/\"/g, "&#x0022;")
						.replace("'", "&#x0027;");
				}
				if (el.aria - label) {
					elementProperties["label:arialabel"] = el.aria - label;
				}
			} catch (e) {
				// alert(e);
			}
		}
		// WORKDAY_RECORDER
		var isLOV = false;
		if (recordingmode == "WORKDAY") {
			try {
				try {
					if (el.tagName == 'SPAN'
						&& el.getAttribute("data-automation-id") == "promptIcon") {
						isLOV = true;
					}
					if (isLOV == false) {
						if (el.tagName == 'SPAN'
							&& el.getAttribute("data-automation-id") == "promptSelectionLabel") {
							isLOV = true;
						}
					}
					if (isLOV == false) {
						if (el.tagName == 'DIV'
							&& el.getAttribute("data-automation-id") == "promptSearchButton") {
							isLOV = true;
						}
					}
					if (isLOV == false) {
						if (el.tagName == 'DIV'
							&& el.getAttribute("data-automation-id") == "icon") {
							var child = el.firstElementChild;
							if ((child.tagName == 'svg' || child.tagName == 'SVG')
								&& child.getAttribute("id") == "wd-icon-prompts") {
								isLOV = true;
							}
						}
					}
					if (isLOV == true) {
						elementProperties["label:element_isLOV"] = "true";
					}
				} catch (e) {
				}
				if (el.hasAttribute("title")) {
					elementProperties["label:element_title"] = el
						.getAttribute("title");
				}
				if (el.hasAttribute("aria-label")) {
					elementProperties["label:element_aria-label"] = el
						.getAttribute("aria-label");
				}
				if (el.hasAttribute("placeholder")) {
					elementProperties["label:element_placeholder"] = el
						.getAttribute("placeholder").replace(/\"/g,
							"&#x0022;").replace("'", "&#x0027;");
				}
				if (el.hasAttribute("data-automation-id")) {
					elementProperties["label:element_data-automation-id"] = el
						.getAttribute("data-automation-id");
				}
				if (el.hasAttribute("data-automation-label")) {
					elementProperties["label:element_data-automation-label"] = el
						.getAttribute("data-automation-label");
				}
			} catch (e) {
			}
			var workdayelement = _opkey.workday_main_getLabel(el);
			if (workdayelement != null) {
				try {
					if (workdayelement.hasAttribute("aria-label")) {
						elementProperties["label:arialabel"] = workdayelement
							.getAttribute("aria-label").replace(/\"/g,
								"&#x0022;").replace("'", "&#x0027;");
					}
					if (workdayelement.hasAttribute("placeholder")) {
						elementProperties["label:placeholder"] = workdayelement
							.getAttribute("placeholder").replace(/\"/g,
								"&#x0022;").replace("'", "&#x0027;");
					}
					if (workdayelement.hasAttribute("data-automation-id")) {
						elementProperties["label:data-automation-id"] = workdayelement
							.getAttribute("data-automation-id");
					}
					if (workdayelement.hasAttribute("data-automation-label")) {
						elementProperties["label:data-automation-label"] = workdayelement
							.getAttribute("data-automation-label");
					}
				} catch (e) {
				}
				elementProperties["label:text"] = workdayelement.textContent;
				elementProperties["label:tagName"] = workdayelement.tagName;
				var workdaylabellocators = this
					.getSeleniumAccessors(workdayelement);
				for (var li = 0; li < workdaylabellocators.length; li++) {
					elementProperties["label:" + workdaylabellocators[li][1]] = workdaylabellocators[li][0]
				}
			} else {
				if (el.tagName == 'svg' || el.tagName == 'SVG') {
					var parentnode = el.parentNode;
					if (parentnode && parentnode.nodeType == 1
						&& parentnode.tagName == 'DIV') {
						if (parentnode.getAttribute("data-automation-id") != null) {
							if (parentnode.getAttribute("data-automation-id") == "icon"
								&& parentnode.parentNode
									.getAttribute("data-automation-id") == "gridFullscreenIconButton") {
								var parent_node = parentnode.parentNode;
								if (parent_node
									.getAttribute("data-automation-id") != null)
									elementProperties["label:element_data-automation-id"] = parent_node
										.getAttribute("data-automation-id");
								if (parent_node.getAttribute("aria-label") != null)
									elementProperties["label:element_aria-label"] = parent_node
										.getAttribute("aria-label");
								if (parent_node.getAttribute("title") != null)
									elementProperties["label:element_title"] = parent_node
										.getAttribute("title");
							} else {
								if (parentnode
									.getAttribute("data-automation-id") != null)
									elementProperties["label:element_data-automation-id"] = parentnode
										.getAttribute("data-automation-id");
								if (parentnode.getAttribute("aria-label") != null)
									elementProperties["label:element_aria-label"] = parentnode
										.getAttribute("aria-label");
								if (parentnode.getAttribute("title") != null)
									elementProperties["label:element_title"] = parentnode
										.getAttribute("title");
							}
						} else {
							var parent_node = parentnode.parentNode;
							if (parent_node.getAttribute("data-automation-id") != null)
								elementProperties["label:element_data-automation-id"] = parent_node
									.getAttribute("data-automation-id");
							if (parent_node.getAttribute("aria-label") != null)
								elementProperties["label:element_aria-label"] = parent_node
									.getAttribute("aria-label");
							if (parent_node.getAttribute("title") != null)
								elementProperties["label:element_title"] = parent_node
									.getAttribute("title");
						}
					}
				}
				if (el.tagName == 'path' || el.tagName == 'PATH') {
					var parentnode = el.parentNode;
					if (parentnode && parentnode.tagName == 'svg') {
						var parent_node = parentnode.parentNode;
						if (parent_node && parent_node.nodeType == 1
							&& parent_node.tagName == 'DIV') {
							if (parent_node.getAttribute("data-automation-id") != null) {
								if (parent_node
									.getAttribute("data-automation-id") == "icon"
									&& parent_node.parentNode
										.getAttribute("data-automation-id") == "gridFullscreenIconButton") {
									var parentElem = parent_node.parentNode;
									if (parentElem
										.getAttribute("data-automation-id") != null)
										elementProperties["label:element_data-automation-id"] = parentElem
											.getAttribute("data-automation-id");
									if (parentElem.getAttribute("aria-label") != null)
										elementProperties["label:element_aria-label"] = parentElem
											.getAttribute("aria-label");
									if (parentElem.getAttribute("title") != null)
										elementProperties["label:element_title"] = parentElem
											.getAttribute("title");
								} else {
									if (parent_node
										.getAttribute("data-automation-id") != null)
										elementProperties["label:element_data-automation-id"] = parent_node
											.getAttribute("data-automation-id");
									if (parent_node.getAttribute("aria-label") != null)
										elementProperties["label:element_aria-label"] = parent_node
											.getAttribute("aria-label");
									if (parent_node.getAttribute("title") != null)
										elementProperties["label:element_title"] = parent_node
											.getAttribute("title");
								}
							} else {
								var parentElem = parent_node.parentNode;
								if (parentElem
									.getAttribute("data-automation-id") != null)
									elementProperties["label:element_data-automation-id"] = parentElem
										.getAttribute("data-automation-id");
								if (parentElem.getAttribute("aria-label") != null)
									elementProperties["label:element_aria-label"] = parentElem
										.getAttribute("aria-label");
								if (parentElem.getAttribute("title") != null)
									elementProperties["label:element_title"] = parentElem
										.getAttribute("title");
							}
						}
					}
				}
			}
		}

		if (elementProperties["sahiText"]) {
			elementProperties["logicalname"] = elementProperties["sahiText"];
		} else if (elementProperties["MD:label:text"]) {
			elementProperties["logicalname"] = elementProperties["MD:label:text"];
		}
		else if (elementProperties["label:element_aria-label"]) {
			elementProperties["logicalname"] = elementProperties["label:element_aria-label"];
		} else if (elementProperties["label:element_data-automation-label"]) {
			elementProperties["logicalname"] = elementProperties["label:element_data-automation-label"];
		} else if (elementProperties["label:element_placeholder"]) {
			elementProperties["logicalname"] = elementProperties["label:element_placeholder"];
		} else if (elementProperties["label:element_title"]) {
			elementProperties["logicalname"] = elementProperties["label:element_title"];
		} else if (elementProperties["label:text"]) {
			elementProperties["logicalname"] = elementProperties["label:text"];
		} else if (elementProperties["label:arialabel"]) {
			elementProperties["logicalname"] = elementProperties["label:arialabel"];
		} else if (elementProperties["label:element_data-automation-id"]) {
			elementProperties["logicalname"] = elementProperties["label:element_data-automation-id"];
		} else if (elementProperties["label:data-automation-id"]) {
			elementProperties["logicalname"] = elementProperties["label:data-automation-id"];
		}

		this._framesList = new Array();
		this._tempframesList = new Array();
		var htmltitle;
		var titleindex;
		var doc = el.ownerDocument;
		var win = doc.defaultView || doc.parentWindow;
		this._getFrames(win);
		var baseurl = "";
		for (var i = 0; i < this._framesList.length; i++) {
			var parentobject = this._framesList[i]
			if (parentobject["tag"] == "html") {
				htmltitle = parentobject["title"]
				toSendAr["popupName"] = htmltitle;
				titleindex = parentobject["titleindex"]
				baseurl = parentobject["url"]
			}
		}
		for (var j = 0; j < this._framesList.length; j++) {
			var parentobject = this._framesList[j]
			parentobject["title"] = htmltitle;
			parentobject["titleindex"] = titleindex;
			if (parentobject["src"] == null || parentobject["src"] == "") {
				parentobject["src"] = baseurl;
			}
			this._tempframesList.push(parentobject)
		}
		this._framesList = this._tempframesList
		var parentobject = this._getFinalFramesList();
		if (parentobject == null) {
			var opkeywindowid = null;
			opkeywindowid = _opkey
				.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
			if (opkeywindowid == "") {
				opkeywindowid = _opkey.windowidentiferontitle;
			}
			var probject = new Object();
			probject["tag"] = "HTML";
			probject["type"] = "html page";
			probject["title"] = _opkey.getTitle().replace(/{/g, '').replace(
				/}/g, '');
			probject["url"] = _opkey.getURL().replace(/{/g, '').replace(/}/g,
				'').replace(/\"/g, "&#x0022;");
			;
			probject["titleindex"] = _opkey
				.sendToServer("/_s_/dyn/Driver_getPageTitleIndex?id="
					+ opkeywindowid
					+ "&title="
					+ encodeURIComponent(_opkey.getTitle().replace(
						/\"/g, "&#x0022;").replace("'", "&#x0027;")));
			parentobject = probject;
		}
		elementProperties["parent"] = parentobject;
		if (el.nodeName == "TABLE") {
			elementProperties["logicalname"] = el.nodeName;
		}

		toSendAr["arguments"] = [elementProperties, dataArguments];

		var retdata = FJSON.stringify(toSendAr)
		var tempscript = null;
		try {
			tempscript = retdata;
			var tempobject = toSendAr;
			tempobject.arguments[0].ObjectImage = null;
			tempobject.arguments[0]["parent"] = null;
			for (var key in tempobject.arguments[0]) {
				if (tempobject.arguments[0][key]) {
					tempobject.arguments[0][key] = removeindex(tempobject.arguments[0][key]);
				}
			}
			if (tempobject["action"] == "click") {
				tempobject.arguments[1]["data"] = null;
			}
			tempscript = JSON.stringify(tempobject)

		} catch (e) {
			tempscript = null;
		}

		if (tempscript != null) {
			if (this.hasEventBeenRecorded(tempscript)) {
				return; // IE
			}
		} else {
			if (this.hasEventBeenRecorded(retdata)) {
				return; // IE
			}
		}
		for (var k = 0; k < 50; k++) {
			retdata = retdata.toString().replace('\\"', '"')
			retdata = retdata.toString().replace('arguments":"[{',
				'arguments":[{')
			retdata = retdata.toString().replace(']"}', ']}')
		}
		// //console.log(retdata)
		// this.sendToServer('/_s_/dyn/' + 'StepWiseRecorder_record?step=' +
		// encodeURIComponent(retdata), false);
		return retdata;
	}

	Opkey.prototype.getLogicalNameOfObject = function (el, innertext) {
		if (innertext != null) {
			if (innertext != "" && innertext != " ") {
				try {
					return removeindex(parseAlternateProperty(innertext, 0))
				} catch (e) {
				}
			}
		}
		try {
			if (el.nodeName == "BUTTON") {
				if (el.value != null) {
					if (el.value.trim() != "") {
						return el.value;
					}
				}
			}

			if (el.nodeName == "INPUT") {
				if (el.type != null) {
					if (el.type.toLowerCase() == "button"
						|| el.type.toLowerCase() == "submit") {
						if (el.value != null) {
							if (el.value.trim() != "") {
								return el.value;
							}
						}
					}
				}
			}
		} catch (e) {
		}
		let recording_mode = _opkey.GetRecordingMode();
		el = filterElementLabel(el, recording_mode);

		let label_name = getElementLabelName(el, recording_mode);

		if (label_name != null && label_name !== "") {
			return label_name;
		}

		if (el.name && el.id && el.name + "::content" === el.id) {
			const parentName = checkParentNodeName(el);
			if (parentName) return parentName;
		}

		if (el.id && el.id.endsWith('-input') || el.getAttribute("data-automation-id") === "datePickerButton") {
			const parentName = checkParentNodeName(el);
			if (parentName) return parentName;
		}
		if (el.placeholder) {
			return el.placeholder;
		}
		if (el.name) {
			return el.name;
		}
		if (el.alt) {
			return el.alt;
		}
		if (el.title) {
			return el.title;
		}
		if (el.id) {
			return el.id;
		}
		if (el.className && !el instanceof SVGElement) {
			return el.className;
		}
		if (el.href) {
			return el.href;
		}
		if (el.src) {
			return el.src;
		}
		if (el.nodeName) {
			return el.nodeName;
		}
	};

	function getElementLabelName(el, recording_mode) {
		if (recording_mode === "COUPA") {
			if (el.nodeName === "LABEL") {
				let labelName = el.innerText || el.textContent;
				if (labelName !== null && labelName !== "") {
					return labelName;
				}
			}
		}
		return;
	}

	function filterElementLabel(_element, recording_mode) {
		if (_element == null) {
			return;
		}

		if (recording_mode == "WORKDAY") {
			if (_element.nodeName === "INPUT" && (_element.getAttribute("title") == null &&
				_element.getAttribute("aria-label") == null &&
				_element.getAttribute("placeholder") == null &&
				_element.getAttribute("name") == null)) {
				let forProperty = _element.getAttribute("id");
				if (forProperty !== null) {
					let labelXpath = "//label[@for = '" + forProperty + "']";
					let foundLabel = thisErpApp.getElementByXPath(labelXpath);
					if (foundLabel !== null) {
						_element = foundLabel;
					} else if (_element.type == "radio" || _element.type == "checkbox") {
						let parentEle = _element;
						let depth = 0;
						const match = parentEle?.closest("div[data-automation-id='promptOption'][data-automation-label]");
						if (match) {
							_element = match;
						}

					}
				} else if (forProperty == null && _element.getAttribute("data-automation-id") !== null && _element.getAttribute("data-automation-id") === "textInputBox") {
					let pEl = _element.parentNode;
					if (pEl.nodeName === "DIV" && pEl.getAttribute("data-automation-id") !== null && pEl.getAttribute("data-automation-id") === "textInput") {
						forProperty = pEl.getAttribute("id") + "-formLabel";

						let labelXpath = "//label[@id = '" + forProperty + "']";
						let foundLabel = thisErpApp.getElementByXPath(labelXpath);
						if (foundLabel !== null) {
							return foundLabel;
						}
					}
				}
			}

			let tempTarget = _element;
			if (_element instanceof SVGElement) {
				let depth = 0;
				while (tempTarget.parentNode != null && depth < 50) {
					tempTarget = tempTarget.parentNode;
					if (!(tempTarget instanceof SVGElement) &&
						(tempTarget.getAttribute("title") !== null ||
							tempTarget.getAttribute("aria-label") !== null ||
							tempTarget.getAttribute("id") !== null ||
							tempTarget.getAttribute("placeholder") !== null ||
							tempTarget.getAttribute("name") !== null ||
							tempTarget.innerText !== "")) {
						_element = tempTarget;
						break;
					}
					depth++;
				}
			}

			const hasUsefulAttribute = (el) =>
				el &&
				(
					el.getAttribute("title") !== null ||
					// el.getAttribute("aria-label") !== null ||
					el.getAttribute("placeholder") !== null ||
					el.getAttribute("name") !== null ||
					el.nodeName === "LABEL"
				);

			function findUsefulDescendant(el) {
				if (hasUsefulAttribute(el)) return el;
				const children = el.children || [];
				for (let i = 0; i < children.length; i++) {
					const match = findUsefulDescendant(children[i]);
					if (match) return match;
				}
				return null;
			}

			if ((!_element.getAttribute("data-automation-id")?.includes("pex-search-source"))) {
				const matchInChildren = findUsefulDescendant(_element);
				if (matchInChildren) _element = matchInChildren;
			}
			// For quantity for in workday remove if doesn't work
			if (_element.nodeName == "DIV" && _element.getAttribute("data-automation-id") == null) {
				let divWithAutomationID = _element.querySelector('div[data-automation-id="numericWidget"]');
				if (divWithAutomationID != null) {
					_element = divWithAutomationID
				}
			}

			const dai = _element.getAttribute("data-automation-id");
			if (dai !== null && (
				dai === "multiselectInputContainer" ||
				dai === "multiSelectContainer" ||
				dai === "numericWidget" ||
				dai === "checkbox" ||
				dai === "checkboxPanel"
			)) {
				let inputElement = _element.querySelector('input');

				if (inputElement !== null) {
					if (inputElement.nodeName === "INPUT" && inputElement.type === "checkbox") {
						let pele = inputElement.parentNode;
						if (pele.nodeName === "DIV" &&
							pele.getAttribute("data-automation-id") !== null &&
							pele.getAttribute("data-automation-id") === "checkboxPanel") {
							let eleID = inputElement.getAttribute("id");
							inputElement = thisErpApp.getElementByXPath("//label[@for='" + eleID + "']");
							if (inputElement !== null) {
								return inputElement;
							}
							eleID = eleID.replace("-input", "");
							inputElement = thisErpApp.getElementByXPath("//th[@data-ecid='" + eleID + "']");
						}
					}
					if (inputElement !== null) {
						return inputElement;
					}
				}
			}

			if (_element.nodeName === "SPAN" && _element.getAttribute("class")?.includes("pexsearch")) {
				let tempElement = _element;
				let depth = 0;
				while (tempElement && tempElement.parentNode && depth < 50 &&
					(tempElement.nodeName !== "BUTTON" && !tempElement.getAttribute("data-automation-id")?.includes("pex-search-source"))) {
					tempElement = tempElement.parentNode;
					depth++;
				}
				return tempElement;
			}

			if (_element.nodeName === "TD") {
				const matches = getInteractableElementsWithin(_element);
				if (Array.isArray(matches) && matches.length) {
					_element = matches[0];
				}
			}

			if (_element?.getAttribute("data-automation-id") !== null) {
				let dataAutomationId = _element.getAttribute("data-automation-id");
				if (dataAutomationId == "selectSelectedOption") {
					try {
						let tempElement = findPreviousLabel(_element);
						if (tempElement != null) {
							_element = tempElement;
						}
					} catch (e) {
						debugger;
					}
				}
			}

			if (_element.nodeName === "INPUT" &&
				_element.getAttribute("type") === "number" &&
				_element.getAttribute("data-automation-id")?.includes("dateSection")
			) {
				let allDateIDs = ["dateSectionDay", "dateSectionMonth", "dateSectionYear"];
				let forProperty = _element.getAttribute("id");

				for (let i = 0; i < allDateIDs.length; i++) {
					if (forProperty) {
						let id = allDateIDs[i];
						let replacedId = forProperty.replace("dateSectionMonth", id);
						let labelXpath = `//label[@for='${replacedId}']`;
						let foundLabel = thisErpApp.getElementByXPath(labelXpath);
						if (foundLabel) {
							return foundLabel;
						}
					}
				}
				//if not found with above approach then find with this(ivytech)
				let dateDiv = _element;
				let depth = 0;
				while (dateDiv && dateDiv.getAttribute("data-automation-id") !== "dateInputWrapper" && depth < 50) {
					dateDiv = dateDiv.parentNode;
					depth++;
				}
				if (dateDiv) {
					let divId = dateDiv.getAttribute("id");
					if (divId) {
						let hiddenId = "hiddenDateValueId-" + divId;
						let divAriaLabelledBy = dateDiv.getAttribute("aria-labelledby");

						if (divAriaLabelledBy) {

							divAriaLabelledBy = divAriaLabelledBy.replace(hiddenId, "").trim();

							let labelIds = divAriaLabelledBy.split(/\s+/);

							for (let lblId of labelIds) {
								if (!lblId) continue;

								let foundLabel = thisErpApp.getElementByXPath(`//label[@id='${lblId}']`);
								if (foundLabel) {
									return foundLabel;
								}
							}

							if (divAriaLabelledBy.includes("formLabel")) {
								let cleanId = divAriaLabelledBy.split("formLabel")[0] + "formLabel";
								foundLabel = thisErpApp.getElementByXPath(`//label[@id='${cleanId}']`);
								if (foundLabel) return foundLabel;
							}
						}
					}
				}
			}
		}

		if (recording_mode == "ORACLE FUSION") {
			if (_element.nodeName === "A" && !_element.hasChildNodes()) {
				let foundLabel = findPreviousLabel(_element);
				if (foundLabel !== null) {
					return foundLabel;
				}
			}
		}

		if (recording_mode == "COUPA") {

			if (_element.nodeName === "INPUT" || _element.nodeName === "TEXTAREA" || _element.nodeName === "SELECT") {
				let forProperty = _element.getAttribute("id");
				if (forProperty !== null) {
					let foundAttachedLabel = thisErpApp.getElementByXPath("//label[@for = '" + forProperty + "']");

					if (foundAttachedLabel !== null) {
						return foundAttachedLabel;
					}
				}
			}

			let nearestLabel = findPreviousLabel(_element);
			if (nearestLabel != null) {
				return nearestLabel;
			}
		}
		return _element;
	}

	function checkParentNodeName(el) {
		debugger;
		if (!el || !el.parentNode) return null;

		if (el.id) {
			const label = document.querySelector(`label[for="${el.id}"]`);
			if (label && label.textContent.trim()) {
				return label.textContent.trim();
			}
		}
	
		// let parent = el.parentNode;
		// while (parent && parent.nodeName !== "BODY") {
		// 	if (parent.nodeName === "LABEL" && parent.textContent.trim()) {
		// 		return parent.textContent.trim();
		// 	}
		// 	parent = parent.parentNode;
		// }
				
		return null;
	}

	/* for checking previous sibling */
	Opkey.prototype.checkPreviousSibling = function (el, lbl_element,
		id_Attr_Value) {
		var lbl_elem = null;
		var prevSib = el.previousSibling;
		if (prevSib) {
			while (prevSib != null) {
				if (prevSib.nodeType == 1) {
					var lbl_tag_name = prevSib.tagName;
					if (lbl_element.tagName == "LABEL")// lbl_element.tagName
						// added
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
							if (el.getAttribute("data-aura-rendered-by") != null) {
								if (prevSib
									.getAttribute("data-aura-rendered-by") != null) {
									lbl_elem = prevSib;
									break;
								}
							}
							if (prevSib.getAttribute("class") == "testlabel") {// attr_value!=null
								// condition
								// removed
								lbl_elem = prevSib;
								break;
							}
						} else {
							lbl_elem = this.checkChildNode(prevSib,
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
	Opkey.prototype.checkNextSibling = function (el, lbl_element, id_Attr_Value) {
		var nextSib = el.nextSibling;
		if (nextSib) {
			while (nextSib != null) {
				if (nextSib.nodeType == 1) {
					var lbl_tag_name = nextSib.tagName;
					if (lbl_element.tagName == "LABEL")// lbl_element.tagName
						// added
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
	Opkey.prototype.checkParentNode = function (el, lbl_element, id_Attr_Value) {
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
					lbl_element = this.checkPreviousSibling(par_node,
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
	Opkey.prototype.checkChildNode = function (el, lbl_element, id_Attr_Value) {
		// var child = el.childNodes?el.childNodes:el.children;
		var child = el.childNodes;
		if (child && child.length > 0) {
			for (var j = 0; j < child.length; j++) {
				// while(child!=null){
				if (child[j].nodeType == 1) {
					var lbl_tag_name = child[j].tagName;
					if (lbl_element.tagName == "LABEL")// lbl_element.tagName
						// added
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
							if (lbl_element == "" || lbl_element == null) {
								if (child[j].getAttribute("class") == "testlabel") {
									lbl_element = child[j];
									break;
								}
							}
							if (lbl_element == "" || lbl_element == null) {
								if (child[j]
									.hasAttribute("data-aura-rendered-by")) {
									lbl_element = child[j];
									break;
								}
							}
						} else {
							var child_of_child = child[j].firstElementChild;
							if (child_of_child
								&& child_of_child.tagName == 'LABEL') {
								if (child_of_child.getAttribute("for") != null) {
									if (id_Attr_Value == child_of_child
										.getAttribute("for")) {
										lbl_element = child_of_child;
										break;
									}
								}
								if (lbl_element == "" || lbl_element == null) {
									if (child_of_child.getAttribute("class") == "testlabel") {
										lbl_element = child_of_child;
										break;
									}
								}
								if (lbl_element == "" || lbl_element == null) {
									if (child_of_child
										.hasAttribute("data-aura-rendered-by")) {
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
		/*
		 * var child=el.getElementsByTagName("*"); for(var j=0;j<child.length;j++){
		 * //while(child!=null){ if(child[j].nodeType==1){ var lbl_tag_name =
		 * child[j].tagName; if(lbl_element=="LABEL") break; else{
		 * if(lbl_tag_name=='LABEL'){ if(child[j].getAttribute){ var attr_value =
		 * child[j].getAttribute("for"); if(attr_value!=null){
		 * if(attr_value==id_Attr_Value){ lbl_element = child; break; } } } } } } //
		 * child = child.children; }
		 */
		return lbl_element;
	};

	/* main function */
	Opkey.prototype.getMatchingLabelWithTextBoxNDropDown = function (el) {
		// ////////debugger;
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

		try {
			if (el.nodeName == "SELECT") {
				if (el.previousSibling.previousSibling != null) {
					if (el.previousSibling.previousSibling.nodeName == "SELECT") {
						return null;
					}
				}
			}
		} catch (e) {
		}
		var lbl_element = "", lbl_tagname = "", lbl_text = "", id_Attr_Value = "", name_Attr_Value = "", class_Attr_Value = "";
		var clicked_elem = el;
		var tagname = el.tagName;
		var type_of_element = el.getAttribute("type");
		// if((tagname=='INPUT' &&
		// (type_of_element.toLowerCase()=='text'||type_of_element.toLowerCase()=='textarea'||type_of_element.toLowerCase()=='phone'||type_of_element.toLowerCase()=='number'||type_of_element.toLowerCase()=='email'||type_of_element.toLowerCase()=='range'))||(tagname=='SELECT')){
		if (el.getAttribute("id") != "" || el.getAttribute("id") != null
			|| el.getAttribute("name") != ""
			|| el.getAttribute("name") != null
			|| el.getAttribute("class") != ""
			|| el.getAttribute("class") != null) {
			id_Attr_Value = el.getAttribute("id");
			name_Attr_Value = el.getAttribute("name");
			class_Attr_Value = el.getAttribute("class");
		}
		// //////debugger;

		if (lbl_element == "") {
			var temp_element = el;
			var searched_td_element = null;
			while (temp_element.parentNode != null) {
				if (temp_element.nodeName == "TD") {
					searched_td_element = temp_element;
					break;
				}
				temp_element = temp_element.parentNode;
			}
			// ////////debugger;
			if (searched_td_element != null) {
				var th_element = searched_td_element.previousSibling;
				if (th_element != null) {
					if (th_element.classList != null) {
						if (th_element.classList.contains("labelCol")
							|| th_element.classList.contains("label1Col")
							|| th_element.classList.contains("label2Col")) {
							var label_element = th_element
								.getElementsByTagName("LABEL")[0];
							if (label_element != null) {
								return label_element;
							} else {
								return th_element;
							}
						}
					}
				}
			}

			// highlighy impact full in label
			if (searched_td_element != null) {
				var span_element = searched_td_element
					.getElementsByTagName("SPAN")[1];
				if (span_element != null) {
					if (span_element.getAttribute("style") != null) {
						if (span_element.getAttribute("style").indexOf(
							"padding-right") > -1) {
							return span_element;
						}
					}
				}
			}

		}

		if (el.previousSibling) {
			lbl_element = this.checkPreviousSibling(el, lbl_element,
				id_Attr_Value);
		}
		if (lbl_element == "" || lbl_element == null) {
			if (el.nextSibling) {
				lbl_element = this.checkNextSibling(el, lbl_element,
					id_Attr_Value);
			}
			if (lbl_element == "" || lbl_element == null) {
				if (el.parentNode) {
					lbl_element = this.checkParentNode(el, lbl_element,
						id_Attr_Value);
				}
				if (lbl_element == "" || lbl_element == null) {
					if (el.childNodes || el.children) {
						lbl_element = this.checkChildNode(el, lbl_element,
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
					if (childnode_parent === el) {
						break;
					}
					if (childnode_parent.nodeName === "#text") {
						if (childnode_parent.textContent.trim() != "") {
							// highly impact full in label comment this if any
							// issue found
							return childnode_parent;
						}
					}

					if (childnode_parent.nodeName === "B") {
						if (childnode_parent.textContent.trim() != "") {
							// highly impact full in label comment this if any
							// issue found
							return childnode_parent;
						}
					}
				}
			}
		}

		var id_attribute = id_Attr_Value;
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

			if (el.nodeName == "SELECT") {
				// ////debugger;
				var _labels = document.getElementsByTagName("LABEL");
				for (var _lb = 0; _lb < _labels.length; _lb++) {
					var _label = _labels[_lb];
					if (_label.getAttribute("for") != null) {
						if (_label.getAttribute("for") == id_attribute.replace(
							"_mlktp", "")) {
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
			var select_present = lbl_element.getElementsByTagName("SELECT")[0];
			if (select_present) {
				var child_nodes = lbl_element.childNodes;
				for (var c_n = 0; c_n < child_nodes.length; c_n++) {
					var _child = child_nodes[c_n];
					if (_child.nodeName == "#text") {
						return _child;
					}
				}
			}
			if (type_of_element == "" || type_of_element == null) {
				return lbl_element;
			} else {
				return lbl_element;
			}
		}
	};

	Opkey.prototype.GetKeywordWithOutObject = function (action_name,
		data_arguments, data_type, el) {
		if (action_name == "SF_GoToTab") {
			if (el.textContent.toLowerCase().trim().indexOf(
				"opens in a new tab") > -1) {
				return null;
			}
			if (el.innerText.toLowerCase().trim().indexOf("opens in a new tab") > -1) {
				return null;
			}
			if (el.textContent.toLowerCase().trim()
				.indexOf("open in a new tab") > -1) {
				return null;
			}
			if (el.innerText.toLowerCase().trim().indexOf("open in a new tab") > -1) {
				return null;
			}
		}
		if (data_type == null) {
			data_type = "string";
		}

		if (data_type == "object") {
			data_arguments = JSON.stringify(data_arguments);
		}
		var main_object = new Object();
		main_object["action"] = action_name;
		main_object["popupName"] = "";
		var main_array = new Array();
		var or_object = new Object();
		var text_content = null;
		if (el.nodeName == "A") {
			text_content = el.textContent;
		} else if (el.nodeName == "BUTTON") {
			if (el.value != null) {
				text_content = el.value;
			}
		} else if (el.nodeName == "INPUT") {
			if (el.getAttribute("placeholder") != null) {
				text_content = el.getAttribute("placeholder");
			}
		}

		var logical_namme_0 = "";
		var label_01 = _opkey.getMatchingLabelWithTextBoxNDropDown(el);
		if (label_01 != null) {
			logical_namme_0 = label_01.textContent.trim();
		}
		if (logical_namme_0 == "") {
			logical_namme_0 = _opkey.getLogicalNameOfObject(el, text_content);
		}
		// ////////debugger;
		if (data_type == "object") {
			var data_arguments_objects = JSON.parse(data_arguments);
			if (data_arguments_objects["labelName"] != null) {
				logical_namme_0 = data_arguments_objects["labelName"];
			} else if (data_arguments_objects["LabelName"] != null) {
				logical_namme_0 = data_arguments_objects["LabelName"];
			} else if (data_arguments_objects["TabName"] != null) {
				logical_namme_0 = data_arguments_objects["TabName"];
			} else if (data_arguments_objects["Label"] != null) {
				logical_namme_0 = data_arguments_objects["Label"];
			} else if (data_arguments_objects["AppName"] != null) {
				logical_namme_0 = data_arguments_objects["AppName"];
			} else if (data_arguments_objects["Action"] != null) {
				logical_namme_0 = data_arguments_objects["Action"];
			} else if (data_arguments_objects["DateEvent"] != null) {
				logical_namme_0 = data_arguments_objects["DateEvent"];
			}

			else if (data_arguments_objects["TimeEvent"] != null) {
				logical_namme_0 = data_arguments_objects["TimeEvent"];
			} else if (data_arguments_objects["RecordType"] != null) {
				logical_namme_0 = data_arguments_objects["RecordType"];
			}
		}

		if (contextmenu_opened == true) {
			contextmenu_opened = false;
			var returned_script = _opkey.getCustomeKeywordScriptReturnedData(
				"Click", el, "OPKEY_VALUE_IGNORE", false);
			returned_script = JSON.parse(returned_script);
			var or_arguments_object = returned_script.arguments[0];
			for (var _key in or_arguments_object) {
				var attr_key = _key;
				var attr_value = or_arguments_object[attr_key];
				if (attr_key != "parent") {
					or_object[attr_key] = attr_value;
				}
			}
		}
		or_object["ObjectImage"] = "";
		or_object["logicalname"] = logical_namme_0;

		if (_opkey.GetRecordingMode() == "SALESFORCE") {
			or_object["theme"] = _opkey.GetSalesforceMode();
			or_object["hasVisualForcePage"] = _opkey.HasVisualForcePage(el)
				.toString();
		}

		_opkey.CreateBase64ImageAttributes(el, or_object);
		this._framesList = new Array();
		this._tempframesList = new Array();
		var htmltitle;
		var titleindex;
		var doc = el.ownerDocument;
		var win = doc.defaultView || doc.parentWindow;

		this._getFrames(win);
		if (this._framesList.length > 1000) {
			var singleframe = this._framesList[0];
			this._framesList = new Array();
			this._framesList.push(singleframe);
		}
		var baseurl = "";
		for (var i = 0; i < this._framesList.length; i++) {
			var parentobject = this._framesList[i]
			if (parentobject["tag"] == "html") {
				htmltitle = parentobject["title"]
				main_object["popupName"] = htmltitle;
				titleindex = parentobject["titleindex"]
				baseurl = parentobject["url"]
			}
		}
		for (var j = 0; j < this._framesList.length; j++) {
			var parentobject = this._framesList[j]
			parentobject["title"] = htmltitle;
			parentobject["titleindex"] = titleindex;
			if (parentobject["src"] == null || parentobject["src"] == "") {
				parentobject["src"] = baseurl;
			}
			this._tempframesList.push(parentobject)
		}
		this._framesList = this._tempframesList;
		var parentobject = this._getFinalFramesList();
		if (parentobject == null) {
			var opkeywindowid = null;
			opkeywindowid = _opkey
				.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
			if (opkeywindowid == "") {
				opkeywindowid = _opkey.windowidentiferontitle;
			}
			var probject = new Object();
			probject["tag"] = "HTML";
			probject["type"] = "html page";
			probject["title"] = _opkey.getTitle();
			probject["url"] = _opkey.getURL().replace(/{/g, '').replace(/}/g,
				'').replace(/\"/g, "&#x0022;");
			probject["titleindex"] = _opkey.indexofurrenttab;

			parentobject = probject;
		}
		if (parentobject["title"] == null) {
			parentobject["title"] = _opkey.getTitle();
		}
		if (parentobject["titleindex"] == null) {
			var opkeywindowid = null;
			opkeywindowid = _opkey
				.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
			if (opkeywindowid == "") {
				opkeywindowid = _opkey.windowidentiferontitle;
			}
			parentobject["titleindex"] = _opkey.indexofurrenttab;
		}
		or_object["parent"] = parentobject;
		var data_args = new Object();
		data_args["type"] = data_type;
		data_args["data"] = data_arguments;
		main_array.push(or_object);
		main_array.push(data_args);
		main_object["arguments"] = main_array;
		// console.log(JSON.stringify(main_object));
		// console.log(FJSON.stringify(main_object));
		return main_object;
	}

	var keyword_queue = [];
	var keyword_argument = null;
	var date_picker_text_box = null;

	Opkey.prototype.GetLabelComponent = function (el) {
		var label = _opkey.getMatchingLabelWithTextBoxNDropDown(el);
		if (label) {
			var label_content = label.innerText;
			if (label.childNodes.length > 0) {
				for (var ch_n = 0; ch_n < label.childNodes.length; ch_n++) {
					var first_child = label.childNodes[ch_n];
					if (first_child.nodeName != "#text"
						&& first_child.nodeName != "#comment"
						&& first_child.nodeName != "SELECT") {
						var text_content = first_child.innerText;
						if (text_content != null) {
							text_content = text_content.trim();
							if (text_content != "") {
								if (text_content.trim() != "*") {
									label_content = text_content;
									break;
								}
							}
						}
					}
				}
			}
			return label_content;
		}
		return "";
	}

	Opkey.prototype.CheckSalesforceCondition = function (element, event_0) {
		// ////////debugger;
		if (event_0.type == "keyup" || event_0.type == "keydown") {
			if (element.nodeName == "INPUT") {
				if (element.parentNode != null) {
					if (element.parentNode.classList != null) {
						if (element.parentNode.classList
							.contains("lookupInput")) {
							if (keyword_queue.indexOf("TYPEDONLOOKUPINPUT") == -1) {
								keyword_queue.push("TYPEDONLOOKUPINPUT");
							}
						}
					}
				}
			}
		}

		if (element.nodeName == "INPUT") {
			if (element.type != null) {
				if (element.type == "text") {
					var limit = 0;
					var temp_element = element;
					while (temp_element.parentNode != null && limit < 10) {
						if (temp_element.classList != null) {
							if (temp_element.classList.contains("uiInputDate")) {
								var label_data = "";
								if (label_data == "") {
									// ////////debugger;
									var temp_element_2 = element;
									while (temp_element_2.parentNode != null) {
										if (temp_element_2.nodeName == "FIELDSET") {
											var label_temp_element = temp_element_2.childNodes[0];
											if (label_temp_element != null) {
												if (label_temp_element.nodeName == "LEGEND") {
													label_data = label_temp_element.childNodes[0].textContent;
												}
											}
										}
										temp_element_2 = temp_element_2.parentNode;
									}
								}
								if (label_data == "") {
									if (element.getAttribute("id") != null) {
										var input_of_id = element
											.getAttribute("id");
										var labels = document
											.getElementsByTagName("LABEL");
										for (var l_i = 0; l_i < labels.length; l_i++) {
											var label = labels[l_i];
											if (label.getAttribute("for") != null) {
												if (label.getAttribute("for") == input_of_id) {
													label_data = label.innerText;
												}
											}
										}
									}
								}

								var object2 = new Object();
								object2["Label"] = label_data;
								keyword_argument = object2;
								keyword_queue.push("DATEPICKER");
								break;
							}

							else if (temp_element.classList
								.contains("uiInputDateTime")) {
								// ////////debugger;
								var label_datetime = "";
								if (label_datetime == "") {
									var temp_element_2 = element;
									while (temp_element_2.parentNode != null) {
										if (temp_element_2.nodeName == "FIELDSET") {
											var label_temp_element = temp_element_2.childNodes[0];
											if (label_temp_element != null) {
												if (label_temp_element.nodeName == "LEGEND") {
													label_datetime = label_temp_element.childNodes[0].textContent;
													var input_elements = temp_element
														.getElementsByTagName("INPUT");
													var object2 = new Object();
													object2["Label"] = label_datetime;
													object2["DateTimeElemnts"] = input_elements;
													keyword_argument = object2;
													keyword_queue
														.push("TIMEPICKER");
													keyword_queue
														.push("DATEPICKER");
													return;
												}
											}
										}
										temp_element_2 = temp_element_2.parentNode;
									}
								}

								if (label_datetime == "") {

									if (element.getAttribute("id") != null) {
										var input_of_id = element
											.getAttribute("id");
										var labels = document
											.getElementsByTagName("LABEL");
										for (var l_i = 0; l_i < labels.length; l_i++) {
											var label = labels[l_i];
											if (label.getAttribute("for") != null) {

												if (label.getAttribute("for") == input_of_id) {
													var input_elements = temp_element
														.getElementsByTagName("INPUT");
													var input_elements = temp_element
														.getElementsByTagName("INPUT");
													var label_content = label.innerText;
													var object2 = new Object();
													object2["Label"] = label_content;
													object2["DateTimeElemnts"] = input_elements;
													keyword_argument = object2;
													keyword_queue
														.push("TIMEPICKER");
													keyword_queue
														.push("DATEPICKER");
													return;
												}
											}
										}
									}
								}

							}

							else if (temp_element.classList
								.contains("dateInput")) {
								// ////////debugger;
								var label_content = _opkey
									.GetLabelComponent(element);
								// console.log("Classic Label Content
								// "+label_content);
								var object2 = new Object();
								var datetime_array = [];
								datetime_array.push(element);
								var id_element = element.getAttribute("id");
								if (id_element != null) {
									var time_id_element = id_element + "_time";
									var time_element = document
										.getElementById(time_id_element);
									if (time_element != null) {
										datetime_array.push(time_element);
									}
								}
								object2["Label"] = label_content;
								object2["DateTimeElemnts"] = datetime_array;
								keyword_argument = object2;
								keyword_queue.push("DATEPICKER");
								break;
							}

							else if (temp_element.classList
								.contains("timeInput")) {
								// ////////debugger;
								var datetime_array = [];
								var label_content = _opkey
									.GetLabelComponent(element);
								var id_element = element.getAttribute("id");
								if (id_element != null) {
									var date_id_element = id_element.replace(
										"_time", "");
									var date_element = document
										.getElementById(date_id_element);
									if (date_element != null) {
										if (label_content == "") {
											label_content = _opkey
												.GetLabelComponent(date_element);
										}
										datetime_array.push(date_element);
									}
								}
								datetime_array.push(element);
								var object2 = new Object();
								object2["Label"] = label_content;
								object2["DateTimeElemnts"] = datetime_array;
								keyword_argument = object2;
								keyword_queue.push("TIMEPICKER");
								keyword_queue.push("DATEPICKER");
								break;
							}
						}
						temp_element = temp_element.parentNode;
						limit++;
					}
				}
			}
		}

		if (element.nodeName == "INPUT") {
			if (element.getAttribute("placeholder") != null) {
				if (element.getAttribute("placeholder") == "Find an app or item") {
					if (element.value != null) {
						if (element.value != "") {
							keyword_queue = [];
						}
					}
				}
			}
		}

		if (element.nodeName == "INPUT") {
			//debugger
			var object_2 = new Object();
			object_2["MenuItem"] = "";
			if (element.classList.contains("uiInput--lookup") || element.classList.contains("slds-combobox__input")) {
				if (element.getAttribute("readOnly") != null) {
					return null;
				}
				if (element.readOnly != null) {
					if (element.readOnly == false) {
						return null;
					}
				}

				keyword_queue.push("SETLOOKUP");
				if (element.parentNode != null) {
					if (element.parentNode.parentNode != null) {
						var div_element = element.parentNode.parentNode;
						if (div_element.nodeName == "DIV") {
							var img_element = div_element
								.getElementsByTagName("IMG")[0];
							var temp_img_element = img_element;
							var require_menu = false;

							if (img_element != null) {
								while (temp_img_element.parentNode != null) {
									if (temp_img_element.nodeName == "A") {
										if (temp_img_element.classList != null) {
											if (temp_img_element.nodeName == "A") {
												if (temp_img_element
													.getAttribute("role") != null) {
													if (temp_img_element
														.getAttribute("role") == "button") {
														if (temp_img_element.classList
															.contains("entityMenuTrigger")) {
															require_menu = true;
														}
													}
												}
											}
										}
									}
									temp_img_element = temp_img_element.parentNode;
								}
								if (require_menu == true) {
									if (img_element.getAttribute("src") != null) {
										if (img_element.getAttribute("title") != null) {
											if (_opkey
												.IsElementVisible(img_element)) {
												object_2["MenuItem"] = img_element
													.getAttribute("title");
											} else {
												object_2["MenuItem"] = "";
											}
										} else if (img_element
											.getAttribute("alt") != null) {
											if (_opkey
												.IsElementVisible(img_element)) {
												object_2["MenuItem"] = img_element
													.getAttribute("alt");
											} else {
												object_2["MenuItem"] = "";
											}

										}
									}
								}
							}

						}
					}
				}
				var label_0 = _opkey.GetLabelComponent(element);
				object_2["Label"] = label_0;
				keyword_argument = object_2;
			}
		}

		if (element.nodeName == "INPUT") {

			if (element.getAttribute("id") != null) {
				if (element.getAttribute("id") == "phSearchInput") {
					if (element.getAttribute("role") != null) {
						if (element.getAttribute("role") == "combobox") {
							if (element.placeholder != null) {
								if (element.placeholder.indexOf("Search") == 0) {
									localStorage.setItem("GLOBAL_SEARCH_VALUE",
										element.value);
									//keyword_queue.push("GLOBALSEARCHANDSELECT");
								}
							}
						}
					}
				}
			}
		}

		if (element.nodeName == "INPUT") {
			if (element.classList != null) {
				if (element.classList.contains("uiInputTextForAutocomplete")) {
					if (element.getAttribute("role") != null) {
						if (element.getAttribute("role") == "combobox") {
							if (element.placeholder != null) {
								if (element.placeholder.indexOf("Search") == 0) {
									localStorage.setItem("GLOBAL_SEARCH_VALUE",
										element.value);
									//keyword_queue.push("GLOBALSEARCHANDSELECT");
								}
							}
						}
					}
				}

			}
		}
	};

	Opkey.prototype.IsElementVisible = function (elem) {
		if (elem.isShadowDomChild === true) {
			return true;
		}

		if (elem.nodeName == "INPUT") {
			return true;
		}

		// return !!(elem.offsetWidth || elem.offsetHeight ||
		// elem.getClientRects().length );
		if (!(elem instanceof Element)) {
			// ////debugger;
			return true;
		}
		var style = getComputedStyle(elem);
		// ////debugger;
		if (style.display === 'none')
			return false;
		if (style.visibility !== 'visible')
			return false;
		if (style.opacity < 0.1)
			return false;
		if (elem.offsetWidth + elem.offsetHeight
			+ elem.getBoundingClientRect().height
			+ elem.getBoundingClientRect().width === 0) {
			// ////debugger;
			return false;
		}
		var elemCenter = {
			x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
			y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
		};
		if (elemCenter.x < 0)
			return false;
		if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth))
			return false;
		if (elemCenter.y < 0)
			return false;
		if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight))
			return false;
		try {
			var pointContainer = document.elementFromPoint(elemCenter.x,
				elemCenter.y);
			do {
				// ////debugger;
				if (pointContainer === elem)
					return true;
			} while (pointContainer = pointContainer.parentNode);
		} catch (e) {
			// ////debugger;
			return true;
		}
		// ////debugger;
		return false;

	};

	Opkey.prototype.CreateTextIndexInsideParent = function (parent_eleemnt,
		element) {
		// ////////debugger;
		var tag_nodelists = parent_eleemnt.getElementsByTagName("*");
		var tag_name = element.nodeName;
		var text_content = element.textContent.trim();
		var indexed_elements = [];
		if (text_content == "") {
			if (element.getAttribute("value") != null) {
				text_content = element.getAttribute("value");
			} else if (element.getAttribute("title") != null) {
				text_content = element.getAttribute("title");
			} else if (element.getAttribute("alt") != null) {
				text_content = element.getAttribute("alt");
			}
		}
		if (text_content != "") {

			for (var t_n_i = 0; t_n_i < tag_nodelists.length; t_n_i++) {
				var tag_node = tag_nodelists[t_n_i];
				if (_opkey.IsElementVisible(tag_node)) {
					var tag_node_textcontent = tag_node.textContent.trim();
					if (tag_node_textcontent == "") {
						if (tag_node.getAttribute("value") != null) {
							tag_node_textcontent = tag_node
								.getAttribute("value");
						} else if (tag_node.getAttribute("title") != null) {
							tag_node_textcontent = tag_node
								.getAttribute("title");
						} else if (tag_node.getAttribute("alt") != null) {
							tag_node_textcontent = tag_node.getAttribute("alt");
						}
					}
					if (tag_node.nodeName == "DIV") {
						if (tag_node.classList != null) {
							if (tag_node.classList
								.contains("slds-lookup__result-text")
								|| tag_node.classList
									.contains("slds-lookup__result-meta")) {
								if (tag_node_textcontent == text_content) {
									indexed_elements.push(tag_node);
								}
							}
						}
					}
				}
			}

			var index_element = indexed_elements.indexOf(element);
			if (index_element != -1) {
				return index_element;
			}
		}
		return 0;
	};

	Opkey.prototype.GetParentDivOfSelectedItemInLightning = function (element) {
		var temp_element = element;
		while (temp_element.parentNode != null) {
			if (temp_element.nodeName == "DIV") {
				if (temp_element.getAttribute("role") != null) {
					if (temp_element.getAttribute("role") == "listbox") {
						if (temp_element.classList != null) {
							if (temp_element.classList.contains("lookup__menu")) {
								return temp_element;
							}
						}
					}
				}
			}
			temp_element = temp_element.parentNode;
		}
	};

	Opkey.prototype.CreateLabelPropertyIndex = function (label_node) {
		// //debugger;
		// ////////debugger;
		if (label_node == null) {
			return 0;
		}
		var indexed_elements = [];
		var labels_0 = document.getElementsByTagName(label_node.nodeName);
		for (var l_i = 0; l_i < labels_0.length; l_i++) {
			var label_0 = labels_0[l_i];
			if (_opkey.IsElementVisible(label_0)) {
				var label_0_textcontent = label_0.textContent.trim();
				if (label_0_textcontent == label_node.textContent.trim()) {
					if (label_0.nodeName == "LABEL") {
						indexed_elements.push(label_0);
					} else {
						var label_nodes = label_0
							.getElementsByTagName(label_node.nodeName)[0];
						if (label_nodes == null) {
							indexed_elements.push(label_0);
						}
					}
				}
			}
		}

		var index_element = indexed_elements.indexOf(label_node);
		if (index_element != -1) {
			return index_element;
		}
		return 0;
	};

	Opkey.prototype.CreateGoToTabIndex = function (_element) {
		var _sameNodesElemnts = [];
		var _labelNodeTitle = _element.getAttribute("title");
		if (_labelNodeTitle != null) {
			if (_labelNodeTitle != "") {
				var _labelNodes = document
					.getElementsByTagName(_element.nodeName);
				for (var _ln = 0; _ln < _labelNodes.length; _ln++) {
					var _nodeTitle = _labelNodes[_ln].getAttribute("title");
					if (_nodeTitle) {
						if (_nodeTitle == _labelNodeTitle) {
							_sameNodesElemnts.push(_labelNodes[_ln]);
						}
					}
				}
			}
		}

		var _index = _sameNodesElemnts.indexOf(_element);
		if (_index == -1) {
			return "0";
		}
		return _index.toString();
	};

	Opkey.prototype.CreateTextIndexByTagName = function (element) {
		try {
			if (element == null) {
				return "0";
			}
			var _mode = _opkey.GetSalesforceMode();
			var parent_element_2 = element;
			while (parent_element_2 != null) {
				if (_mode == "CLASSIC") {
					if (parent_element_2.nodeName == "UL") {
						if (parent_element_2.classList != null) {
							if (parent_element_2.classList
								.contains("zen-tabMenu")) {
								break;
							}
						}
					}

					if (parent_element_2.nodeName == "DIV") {
						if (parent_element_2.classList != null) {
							if (parent_element_2.classList
								.contains("menuButtonMenu")) {
								break;
							}
						}
					}

					if (parent_element_2.nodeName == "TABLE") {
						if (parent_element_2.classList != null) {
							if (parent_element_2.classList
								.contains("detailList")) {
								break;
							}
						}
					}
				} else if (_mode == "LIGHTNING") {
					if (parent_element_2.nodeName == "NAV") {
						if (parent_element_2.getAttribute("role") != null) {
							if (parent_element_2.getAttribute("role") == "navigation") {
								break;
							}
						}
					}

					if (parent_element_2.nodeName == "DIV") {
						if (parent_element_2.getAttribute("data-aura-class") != null) {
							if (parent_element_2
								.getAttribute("data-aura-class") == "oneAppLauncherItemList") {
								break;
							}
						}
					}

					if (parent_element_2.nodeName == "DIV") {
						if (parent_element_2.getAttribute("role") != null) {
							if (parent_element_2.getAttribute("role") == "menu") {
								break;
							}
						}
					}
				}
				parent_element_2 = parent_element_2.parentNode;
			}

			var ret_index = "0";
			var tag_nodelists = parent_element_2
				.getElementsByTagName(element.nodeName);
			// //////debugger;
			var tag_name = element.nodeName;
			var text_content = element.textContent.trim();
			var indexed_elements = [];
			if (text_content != "") {

				for (var t_n_i = 0; t_n_i < tag_nodelists.length; t_n_i++) {
					var tag_node = tag_nodelists[t_n_i];
					if (_opkey.IsElementVisible(tag_node)) {
						var tag_node_textcontent = tag_node.textContent.trim();
						if (tag_node_textcontent == text_content) {
							indexed_elements.push(tag_node);
						}
					}
				}

				var index_element = indexed_elements.indexOf(element);
				if (index_element != -1) {
					return index_element.toString();
				}
			}

		} catch (e) {
			return "0";
		}
		return ret_index;
	};

	Opkey.prototype.CreateTextIndex = function (element) {
		var tag_nodelists = document.querySelectorAll('a,button,input');
		var tag_name = element.nodeName;
		var text_content = element.textContent.trim();
		var indexed_elements = [];
		if (text_content == "") {
			if (element.getAttribute("value") != null) {
				text_content = element.getAttribute("value");
			} else if (element.getAttribute("title") != null) {
				text_content = element.getAttribute("title").replace(/\"/g, "&#x0022;");
			} else if (element.getAttribute("alt") != null) {
				text_content = element.getAttribute("alt").replace(/\"/g, "&#x0022;");
			}
		}
		if (text_content != "") {

			for (var t_n_i = 0; t_n_i < tag_nodelists.length; t_n_i++) {
				var tag_node = tag_nodelists[t_n_i];
				if (_opkey.IsElementVisible(tag_node)) {
					var tag_node_textcontent = tag_node.textContent.trim();
					if (tag_node_textcontent == "") {
						if (tag_node.getAttribute("value") != null) {
							tag_node_textcontent = tag_node
								.getAttribute("value");
						} else if (tag_node.getAttribute("title") != null) {
							tag_node_textcontent = tag_node
								.getAttribute("title").replace(/\"/g, "&#x0022;");
						} else if (tag_node.getAttribute("alt") != null) {
							tag_node_textcontent = tag_node.getAttribute("alt").replace(/\"/g, "&#x0022;");
						}
					}
					if (tag_node_textcontent == text_content) {
						indexed_elements.push(tag_node);
					}
				}
			}

			var index_element = indexed_elements.indexOf(element);
			if (index_element != -1) {
				return index_element;
			}
		}
		return 0;
	};

	Opkey.prototype.HasVisualForcePage = function (el) {
		// ////////debugger;
		var temp_element = el;
		while (temp_element.parentNode != null) {
			if (temp_element.nodeName == "FORM") {
				if (temp_element.getAttribute("action") != null) {
					var action_url = temp_element.getAttribute("action");
					if (action_url.indexOf("visual.force.com") > -1) {
						return true;
					}
				}
			}
			temp_element = temp_element.parentNode;
		}

		var _url = _opkey.getURL();
		if (_url) {
			if (_url.indexOf("visual.force.com") > -1) {
				return true;
			}
		}
		return false;
	};

	Opkey.prototype.GetSalesforceMode = function () {
		// //////debugger;
		var classic_header_image = document.getElementById("phHeaderLogoImage");
		if (classic_header_image != null) {
			return "CLASSIC";
		}

		try {
			var parent_0 = document.defaultView.parent.frameElement;
			if (parent_0 != null) {
				// sreturn "LIGHTNING";
			}
		} catch (e) {
			// return "LIGHTNING";
		}

		var body_element = document.getElementsByTagName("BODY")[0];
		if (body_element != null) {
			if (body_element.classList != null) {
				if (body_element.classList.contains("desktop")) {
					return "LIGHTNING";
				}
			}
		}

		if (_opkey.currentIframeDetails != null) {
			var _url = _opkey.currentIframeDetails.parentURL;
			if (_url != null) {
				if (_url.indexOf("lightning") > -1) {
					return "LIGHTNING";
				}
			}
		}
		return "CLASSIC";
	};

	Opkey.prototype.CheckTablePresents = function (el) {
		var temp_element = el;
		while (temp_element.parentNode != null) {
			if (temp_element.nodeName == "TD" || temp_element.nodeName == "TR"
				|| temp_element.nodeName == "TBODY"
				|| temp_element.nodeName == "TABLE") {
				return true;
			}
			temp_element = temp_element.parentNode;
		}
		return false;
	};

	Opkey.prototype.IgnoreSalesforceKeyword = function (el) {
		if (el.nodeName == "IMG") {
			if (el.classList != null) {
				if (el.classList.contains("calLeft")
					|| el.classList.contains("calRight")
					|| el.classList.contains("calLeftOn")
					|| el.classList.contains("calRightOn")) {
					// _opkey.CaptureSkipedKeyword(el);
					// return "SKIP_KEYWORD";
				}

				if (el.classList.contains("picklistArrowLeft")) {
					var select_data = localStorage
						.getItem("OPKEY_QUEUE_KEYWORD");
					if (select_data != null) {
						_opkey.CaptureSkipedKeyword(el);
						return "SKIP_KEYWORD";
					}
				}
			}
		}
		if (el.nodeName == "A") {
			if (el.classList != null) {
				if (el.classList.contains("calToday")) {
					_opkey.CaptureSkipedKeyword(el);
					return "SKIP_KEYWORD";
				}
			}
		}
		if (el.nodeName == "SELECT") {
			if (el.getAttribute("id") != null) {
				if (el.getAttribute("id") == "calMonthPicker") {
					// _opkey.CaptureSkipedKeyword(el);
					// return "SKIP_KEYWORD";
				}
				if (el.getAttribute("id") == "calYearPicker") {
					// _opkey.CaptureSkipedKeyword(el);
					// return "SKIP_KEYWORD";
				}
			}
		}

		if (el.nodeName == "A") {

			var temp_a = el;
			while (temp_a.parentNode != null) {
				if (temp_a.nodeName == "DIV") {
					if (temp_a.classList != null) {
						if (temp_a.classList.contains("entityMenu")
							|| temp_a.classList.contains("entityMenuList")) {

							return "SKIP_KEYWORD";
						}
					}
				}
				temp_a = temp_a.parentNode;
			}
		}
		_opkey.DispatchedSkipedKeyword();
		localStorage.setItem("OPKEY_QUEUE_ITEM", "");
		keyword_queue = [];
		return null;
	}

	Opkey.prototype.CaptureSkipedKeyword = function (element) {
		_opkey
			.ShowToastMessage("",
				"OpKeyRecorder- Trying to capture a composite keyword with multiple actions");
		if (element.nodeName != "SELECT") {
			var script_0 = _opkey.getCustomeKeywordScriptReturnedData("click",
				element, "OPKEY_VALUE_IGNORE", false);
			if (script_0 != null) {
				script_0 = JSON.parse(script_0);
				script_0["IsCapturedKeyword"] = "true";
				script_0 = JSON.stringify(script_0);
				var sce_handle = false;
				var prev_step = localStorage.getItem("CAPTURED_SKIPED_KEYWORD");
				if (prev_step != null) {
					if (prev_step != "") {
						sce_handle = true;
						var new_step = prev_step + ", " + script_0;
						localStorage.setItem("CAPTURED_SKIPED_KEYWORD",
							new_step);
					}
				}
				if (sce_handle == false) {
					localStorage.setItem("CAPTURED_SKIPED_KEYWORD", script_0);
				}
			}
		}

	};

	Opkey.prototype.CaptureSkipedKeywordWithValue = function (element,
		data_value) {
		_opkey
			.ShowToastMessage("",
				"OpKeyRecorder- Trying to capture a composite keyword with multiple actions");
		if (element.nodeName == "SELECT") {
			var script_0 = _opkey.getCustomeKeywordScriptReturnedData(
				"setSelected", element, data_value, false);
			if (script_0 != null) {
				var sce_handle = false;
				var prev_step = localStorage.getItem("CAPTURED_SKIPED_KEYWORD");
				if (prev_step != null) {
					if (prev_step != "") {
						sce_handle = true;
						var new_step = prev_step + ", " + script_0;
						localStorage.setItem("CAPTURED_SKIPED_KEYWORD",
							new_step);
					}
				}
				if (sce_handle == false) {
					localStorage.setItem("CAPTURED_SKIPED_KEYWORD", script_0);
				}
			}
		}

	};

	Opkey.prototype.DispatchedSkipedKeyword = function () {
		var cap_keyword = localStorage.getItem("CAPTURED_SKIPED_KEYWORD");
		if (cap_keyword != null) {
			if (cap_keyword != "") {
				localStorage.setItem("CAPTURED_SKIPED_KEYWORD", "");
				_opkey.recordStepCapturedKeyword(cap_keyword, "");
			}
		}
	};

	Opkey.prototype.ClearSkipedKeyword = function () {
		localStorage.setItem("CAPTURED_SKIPED_KEYWORD", "");
	};

	Opkey.prototype.GetSelectTitleAttributeIndex = function (element_0) {
		var select_elements_array = [];
		var element_title = element_0.getAttribute("title");
		if (element_title != null) {
			var select_elements = document
				.getElementsByTagName(element_0.nodeName);
			for (var s_e = 0; s_e < select_elements.length; s_e++) {
				var select_eleemnt = select_elements[s_e];
				if (select_eleemnt.getAttribute("title") != null) {
					if (select_eleemnt.getAttribute("title").trim() == element_title) {
						select_elements_array.push(select_eleemnt);
					}
				}
			}
		}

		var s_index = select_elements_array.indexOf(element_0);
		if (s_index > -1) {
			return s_index;
		}
		return 0;
	};

	Opkey.prototype.ShowToastMessage = function (messagetype, message) {
		if (_opkey.canHighlight == false) {
			return;
		}
		if (_opkey.alreadyToastVis == true) {
			return;
		}
		console.log("Toast Visible " + _opkey.alreadyToastVis);
		_opkey.alreadyToastVis = true
		var toast_object = new Object();
		toast_object.text = message;
		toast_object.duration = 5000;
		toast_object.newWindow = true;
		toast_object.close = true;
		toast_object.gravity = "bottom";
		toast_object.positionLeft = false;
		toast_object.backgroundColor = "green";
		if (messagetype == "error") {
			toast_object.backgroundColor = "red";
		} else if (messagetype == "warning") {
			toast_object.backgroundColor = "orange";
		} else if (messagetype == "greeting") {
			toast_object.backgroundColor = "yellow";
		}
		Toastify(toast_object).showToast();
		window.setTimeout(function () {
			_opkey.alreadyToastVis = false
		}, 2000);
	};

	Opkey.prototype.ShowToastMessageForObiq = function (messagetype, message) {
		_opkey.alreadyToastVis = true
		var toast_object = new Object();
		toast_object.text = message;
		toast_object.duration = 5000;
		toast_object.newWindow = true;
		toast_object.close = true;
		toast_object.gravity = "bottom";
		toast_object.positionLeft = true;
		toast_object.backgroundColor = "green";
		if (messagetype == "error") {
			toast_object.backgroundColor = "red";
		} else if (messagetype == "warning") {
			toast_object.backgroundColor = "orange";
		} else if (messagetype == "greeting") {
			toast_object.backgroundColor = "yellow";
		}
		Toastify(toast_object).showToast();
		window.setTimeout(function () {
			_opkey.alreadyToastVis = false
		}, 2000);
	};

	Opkey.prototype.IsInsideLookup = function (element) {
		var temp_element = element;
		while (temp_element.parentNode != null) {
			if (temp_element.nodeName == "FORM") {
				if (temp_element.getAttribute("action") != null) {
					var action_data = temp_element.getAttribute("action");
					action_data = action_data.toLowerCase().trim();
					if (action_data.indexOf("lookup") > -1) {
						return true;
					}
				}
			}
			temp_element = temp_element.parentNode;
		}
		return false;
	};

	Opkey.prototype.GetSalesForceRelatedDataForLatestSalesforce = function (action_name, element,
		data_value, element_properties, label_node) {
		//will write here
		if (element.getAttribute("lightning-basecombobox_basecombobox") != null || element.nodeName == "LIGHTNING-BASE-COMBOBOX-FORMATTED-TEXT") {
			debugger
			if (element.readOnly != null) {
				if (element.readOnly == false) {
					return null;
				}
			}
			if (element.getAttribute("readOnly") == null) {
				keyword_queue.push("SETLOOKUP");
				_opkey.CaptureSkipedKeywordWithValue(element, data_value);
				return "SKIP_KEYWORD";
			}
		}
	}

	var current_table_data = null;
	var current_perform_row_element = null;
	var selectnew_element = null;
	var recordtype_item = null;
	var label_text_input = null;
	var ll34 = null;
	Opkey.prototype.GetSalesForceRelatedData = function (action_name, element,
		data_value, element_properties, label_node) {
		var ele_sales = element;
		if (action_name == "click") {
			if (element.nodeName == "SPAN") {
				if (ele_sales.parentNode.classList.contains("slds-media__body"))
					ele_sales = ele_sales.parentNode.parentNode;
				else if (ele_sales.classList.contains("slds-media__body")) {
					ele_sales = ele_sales.parentNode;
				}


			}
			if (ele_sales.nodeName == "LIGHTNING-BASE-COMBOBOX-ITEM" && ele_sales.classList.contains("slds-listbox__option") && ele_sales.classList.contains("slds-listbox__option_plain")) {
				if (ele_sales.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].nodeName == "LABEL")
					ll34 = ele_sales.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].innerText;
			}
			if (ll34 != null && ll34[0] == "*") {
				ll34 = ll34.substring(1);
			}
		}
		//added salesforce not recording label properly		
		if (action_name == "setValue" || action_name == "_setValue" || action_name == "setSelected" || action_name == "_setSelected") {
			if (element.nodeName == "SELECT" || element.nodeName == "INPUT") {
				var flag2 = 0;
				var label_text = null;
				var element_check = element;
				if (element_check.parentNode !== null &&
					element_check.parentNode.tagName === "DIV" &&
					(element_check.parentNode.classList.contains("slds-form-element__control") || element_check.parentNode.classList.contains("slds-select_container"))) {
					if (element_check.parentNode.parentNode.parentNode.parentNode.parentNode != null && (element_check.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains("flowruntime-input") || element_check.parentNode.parentNode.parentNode.parentNode.classList.contains("slds-form-element_check") || element_check.parentNode.parentNode.parentNode.parentNode.classList.contains("flowruntime-input"))) {
						if (element_check.parentNode.parentNode.parentNode.parentNode.classList.contains("flowruntime-input")) {
							element_check = element_check.parentNode.parentNode.parentNode.parentNode;
						}
						else {
							element_check = element_check.parentNode.parentNode.parentNode.parentNode.parentNode;
						}


						element_check.getElementsByTagName("DIV");
						for (var i = 0; i < element_check.getElementsByTagName("DIV").length; i++) {


							if (element_check.getElementsByTagName("DIV")[i].classList.contains("flowruntime-input-label")) {
								element_check = element_check.getElementsByTagName("DIV")[i];
								break;
							}

						}
						for (var i = 0; i < element_check.childNodes.length; i++) {
							if (element_check.childNodes[i].nodeType === 1 && element_check.childNodes[i].tagName === "LIGHTNING-FORMATTED-RICH-TEXT") {
								flag2 = 1;
								element_check = element_check.childNodes[i];
								break;
							}
						}
						if (flag2 == 1) {
							element_check = element_check.getElementsByTagName("SPAN")[0];
							flag2 = 0;
							label_text_input = element_check.innerText[0] == "*" ? element_check.innerText.substr(1) : element_check.innerText;
						}
					}

				}
			}
		}
		var retdata = _opkey.GetSalesForceRelatedDataForLatestSalesforce(action_name, element, data_value, element_properties, label_node);
		if (retdata != null) {
			return retdata;
		}
		if (action_name == "setSelected" || action_name == "_setSelected") {
			// //////debugger;
			debugger
			if (_opkey.IsInsideLookup(element)) {
				_opkey.DispatchedSkipedKeyword();
				localStorage.setItem("OPKEY_QUEUE_ITEM", "");
				localStorage.setItem("OPKEY_QUEUE_KEYWORD", "");
				return null;
			}
			var ret_value = _opkey.IgnoreSalesforceKeyword(element);
			if (ret_value != null) {
				localStorage.setItem("OPKEY_QUEUE_ITEM", "");
				return ret_value;
			}

			if (element.nodeName == "SELECT") {
				if (element.parentNode != null) {
					if (element.parentNode.nodeName == "DIV") {
						if (element.parentNode.classList != null) {
							if (element.parentNode.classList
								.contains("quickActionFieldElement")) {
								localStorage.setItem("CLASSIC_LOOKUP_MENUITEM",
									data_value);
								_opkey.CaptureSkipedKeywordWithValue(element,
									data_value);
								return "SKIP_KEYWORD";
							}
						}
					}
					var parent_node = element.parentNode;
					var img_elements = parent_node.getElementsByTagName("IMG");
					for (var i_a = 0; i_a < img_elements.length; i_a++) {
						var img_elememnt = img_elements[i_a];
						if (img_elememnt.classList != null) {
							if (img_elememnt.classList.contains("lookupIcon")
								|| img_elememnt.classList
									.contains("lookupIconOn")) {
								_opkey.CaptureSkipedKeywordWithValue(element,
									data_value);
								return "SKIP_KEYWORD";
							}
						}
					}
				}
				// ////////debugger;
				var index_value = _opkey.CreateLabelPropertyIndex(label_node)
					.toString();
				// //////debugger;
				// var label_text = null;
				if (element_properties != null) {
					if (element_properties["label:text"] != null) {
						label_text = element_properties["label:text"];
					}
				}

				if (label_text == null) {
					if (element.getAttribute("title") != null) {
						index_value = _opkey.GetSelectTitleAttributeIndex(
							element).toString();
						label_text = element.getAttribute("title").replace(/\"/g, "&#x0022;");
					} else if (element.getAttribute("alt") != null) {
						label_text = element.getAttribute("alt").replace(/\"/g, "&#x0022;");
					}
				}

				if (label_text == null) {
					return null;
				}

				if (label_text.toLowerCase().indexOf("record type") > -1) {
					recordtype_item = data_value;
					_opkey.CaptureSkipedKeyword(element);
					return "SKIP_KEYWORD";
				}

				if (_opkey.GetSalesforceMode() == "CLASSIC") {
					if (label_text.indexOf("-") > -1) {
						label_text = label_text.replace("- Available", "")
							.replace("- Chosen", "");
						label_text = label_text.trim();
					}
				}

				var selected_item = data_value;
				var temp_element = element;
				if (keyword_queue.indexOf("DATEPICKER") > -1) {
					var limit = 0;
					while (temp_element.parentNode != null && limit < 10) {
						if (temp_element.nodeName == "DIV") {
							if (temp_element.classList != null) {
								if (temp_element.classList
									.contains("uiDatePicker")) {
									// _opkey.CaptureSkipedKeyword(element);
									// commented for releases
									// return "SKIP_KEYWORD";
								}
							}
						}
						temp_element = temp_element.parentNode;
						limit++;
					}
				}

				if (label_text != null) {
					if (label_text.indexOf(":") > -1) {
						var splitStr = label_text.split(":");
						label_text = splitStr[0] + ":";
					}
				}

				if (element.nodeName == "SELECT") {
					var labelChilds = label_node.getElementsByTagName("DIV");
					for (var li = 0; li < labelChilds.length; li++) {
						var labelChildNode = labelChilds[li];
						if (labelChildNode.classList.contains("uiOutputRichText")) {
							label_text = labelChildNode.textContent;
							break;
						}
					}
				}
				if (label_text_input != null) {
					label_text = label_text_input;
					label_text_input = null;
				}


				if (element.nodeName === "SELECT") {
					selected_item = element.options[element.selectedIndex].value;
				}
				var select_data = _opkey.GetKeywordWithOutObject(
					"SF_SelectDataFromPickList", {
					LabelName: label_text,
					Index: index_value,
					ValueToSelect: selected_item
				}, "object", element);
				// //////debugger;
				if (element.getAttribute("multiple") != null) {
					if (element.getAttribute("name") != null) {
						if (element.getAttribute("name") == "ref") {
							return null;
						}
					}
					if (element.getAttribute("data-aura-rendered-by") == null) {
						localStorage.setItem("OPKEY_QUEUE_KEYWORD", JSON
							.stringify(select_data));
						_opkey.CaptureSkipedKeyword(element);
						return "SKIP_KEYWORD";
					} else if (element.getAttribute("data-aura-rendered-by") != null) {
						return select_data;
					}
				} else {
					return select_data;
				}
			}
		}

		if (action_name == "_click" || action_name == "click") {
			if (element.nodeName === "INPUT") {
				if (element.getAttribute("lightning-basecombobox_basecombobox") != null) {
					debugger
					if (element.getAttribute("placeholder") != null && element.getAttribute("placeholder").indexOf("Search") > -1) {
						try {
							keyword_queue.push("SETLOOKUP");
							keyword_argument = new Object();
							if (element.labels != null && element.labels.length > 0) {
								keyword_argument["Label"] = element.labels[0].innerText.replace(/\*/g, '');
							}

							_opkey.CaptureSkipedKeywordWithValue(element, data_value);
						} catch (e) {
							console.log(e);
						}
						return "SKIP_KEYWORD";
					}
				}
			}


			//Commented for Salesforce
			if (keyword_queue.indexOf("SETLOOKUP") > -1) {
				debugger
				var args = {
					LabelName: keyword_argument["Label"],
					MenuItem: "",
					TextToType: element.innerText,
					Index: 0
				};
				keyword_queue = [];
				_opkey.ClearSkipedKeyword();
				return _opkey.GetKeywordWithOutObject(
					"SF_SearchAndSelect", args, "object",
					element);

			}

			if (element.nodeName == "SPAN" || element.nodeName == "DIV"
				|| element.nodeName == "INPUT") {
				if (element.parentNode != null) {
					if (element.parentNode.classList != null) {
						if (element.parentNode.classList
							.contains("changeRecordTypeOptionLeftColumn")) {
							var _itemParent = element.parentNode.parentNode;
							if (_itemParent) {
								var _divElements = _itemParent
									.getElementsByTagName("DIV");
								for (var _de = 0; _de < _divElements.length; _de++) {
									var _node = _divElements[_de];
									if (_node.classList) {
										if (_node.classList
											.contains("changeRecordTypeOptionRightColumn")) {
											var _itemNode = _node
												.getElementsByTagName("SPAN")[0];
											if (_itemNode) {
												recordtype_item = _itemNode;
												_opkey
													.CaptureSkipedKeyword(element);
												return "SKIP_KEYWORD";
											}
										}
									}
								}
							}
						}

						if (element.parentNode.classList
							.contains("changeRecordTypeOptionRightColumn")) {
							if (element.previousSibling == null
								|| element.previousSibling.nodeName != "SPAN") {
								recordtype_item = element;
								_opkey.CaptureSkipedKeyword(element);
								return "SKIP_KEYWORD";
							} else {
								recordtype_item = element.previousSibling;
								_opkey.CaptureSkipedKeyword(element);
								return "SKIP_KEYWORD";
							}
						}

						if (element.classList != null) {
							if (element.classList
								.contains("changeRecordTypeOptionRightColumn")) {
								if (element.firstChild != null) {
									if (element.firstChild.nodeName == "SPAN") {
										recordtype_item = element.firstChild;
										_opkey.CaptureSkipedKeyword(element);
										return "SKIP_KEYWORD";
									}
								}
							}
						}
					}
				}
			}

			if (recordtype_item != null) {
				if (element.nodeName == "BUTTON") {
					if (element.innerText.trim() == "Next") {
						var _recordText = recordtype_item.innerText;
						if (_recordText == null) {
							_recordText = recordtype_item;
						}
						recordtype_item = null;
						_opkey.ClearSkipedKeyword();
						return _opkey.GetKeywordWithOutObject(
							"SF_SelectRecordType", {
							RecordType: _recordText
						}, "object", element);
					}
				}

				if (element.nodeName == "INPUT") {
					if (element.value.trim() == "Continue") {
						var _recordText = recordtype_item;
						recordtype_item = null;
						_opkey.ClearSkipedKeyword();
						return _opkey.GetKeywordWithOutObject(
							"SF_SelectRecordType", {
							RecordType: _recordText
						}, "object", element);
					}
				}

			}

			recordtype_item = null;
			try {
				var check_element = element;
				while (check_element.parentNode != null) {
					if (check_element.nodeName == "DIV") {
						if (check_element.getAttribute("id") != null) {
							if (check_element.getAttribute("id") == "tryLexDialog") {
								if (check_element.classList != null) {
									if (check_element.classList
										.contains("tryLightning")) {
										_opkey.CaptureSkipedKeyword(element);
										return "SKIP_KEYWORD";
									}
								}
							}
						}
					}
					check_element = check_element.parentNode;
				}
			} catch (e) {
			}
			if (element.nodeName == "IMG") {
				if (keyword_queue.indexOf("SELECTPICKLIST") > -1) {
					keyword_queue = [];
					_opkey.ClearSkipedKeyword();
					return _opkey.GetKeywordWithOutObject(
						"SF_SelectDataFromPickList", {
						LabelName: keyword_argument["Label"],
						Index: _opkey.CreateLabelPropertyIndex(
							keyword_argument["label_element"])
							.toString(),
						ValueToSelect: keyword_argument["Data"]
					}, "object", element);
				}
			}

			if (element.classList.contains("menuButtonButton")
				|| element.parentNode.classList
					.contains("menuButtonButton")
				|| element.classList.contains("menuButtonLabel")) {
				// ////////debugger;
				if (element.getAttribute("id") == "tsidLabel"
					|| element.getAttribute("id") == "tsidButton") {
					keyword_queue.push("APP_LAUNCHER");
					_opkey.CaptureSkipedKeyword(element);
					return "SKIP_KEYWORD"
				}
			}

			if (element.classList.contains("menuButtonButton")
				|| element.parentNode.classList
					.contains("menuButtonButton")
				|| element.classList.contains("menuButtonLabel")) {
				if (element.getAttribute("id") == "userNavLabel") {
					keyword_queue.push("USER_LAUNCHER");
					_opkey.CaptureSkipedKeyword(element);
					return "SKIP_KEYWORD"
				}
			}

			if (element.nodeName == "DIV") {
				if (element.classList != null) {
					if (element.classList.contains("tsid-buttonArrow")) {
						if (element.getAttribute("id") == "tsid-arrow") {
							keyword_queue.push("APP_LAUNCHER");
							_opkey.CaptureSkipedKeyword(element);
							return "SKIP_KEYWORD"
						}
					}
				}
			}

			if (element.nodeName == "INPUT") {
				if (element.type != null) {
					if (element.getAttribute("title") != null) {
						if (element.classList.contains("btn")) {
							if (element.type == "button") {
								// return
								// _opkey.GetKeywordWithOutObject("SF_ClickByText",{TextToSearch:element.getAttribute("title"),Index:_opkey.CreateTextIndex(element),PartialText:false,Before:"",After:""},"object",element);
							}
							// return
							// _opkey.GetKeywordWithOutObject("SF_ClickByText",{TextToSearch:element.getAttribute("title"),Index:_opkey.CreateTextIndex(element),PartialText:false,Before:"",After:""},"object",element);
						}
					} else if (element.getAttribute("value") != null) {
						if (element.classList.contains("btn")) {
							if (element.type == "button") {
								// return
								// _opkey.GetKeywordWithOutObject("SF_ClickByText",{TextToSearch:element.getAttribute("value"),Index:_opkey.CreateTextIndex(element),PartialText:false,Before:"",After:""},"object",element);
							}
							// return
							// _opkey.GetKeywordWithOutObject("SF_ClickByText",{TextToSearch:element.getAttribute("value"),Index:_opkey.CreateTextIndex(element),PartialText:false,Before:"",After:""},"object",element);
						}
					}
				}
			}



			var key_word_queue = sessionStorage.getItem("OPKEY_QUEUE_ITEM");
			if (keyword_queue.indexOf("APP_LAUNCHER") > -1
				|| key_word_queue == "APP_LAUNCHER") {
				if (element.nodeName == "A") {
					if (element.hasAttribute("one-applauncherapptile_applauncherapptile") || element.getAttribute("rel") == "noopener") {
						keyword_queue = [];
						_opkey.ClearSkipedKeyword();
						return _opkey.GetKeywordWithOutObject(
							"SF_LaunchApp", {
							AppName: element.textContent.trim()
						}, "object", element);
					}


					if (element.classList.contains("app-launcher-link") || element.hasAttribute("one-applauncherapptile_applauncherapptile") || element.hasAttribute("one-applaunchertabitem_applaunchertabitem")) {
						keyword_queue = [];
						_opkey.ClearSkipedKeyword();
						return _opkey.GetKeywordWithOutObject(
							"SF_LaunchAppAndSelectItem", {
							Item: element.textContent.trim(),
							Index: _opkey
								.CreateTextIndexByTagName(element)
						}, "object", element);
					}

					if (element.classList.contains("listRelatedObject") || element.hasAttribute("one-applauncherapptile_applauncherapptile") || element.hasAttribute("one-applaunchertabitem_applaunchertabitem")) {
						// //////debugger;
						keyword_queue = [];
						_opkey.ClearSkipedKeyword();
						return _opkey.GetKeywordWithOutObject(
							"SF_LaunchAppAndSelectItem", {
							Item: element.textContent.trim(),
							Index: _opkey
								.CreateTextIndexByTagName(element)
						}, "object", element);
					}
					//fixing here SF_LaunchAppAndSelectItem

					if (element.classList.contains("al-tab-item") && keyword_queue.length >= 1) {
						// //////debugger;
						keyword_queue = [];
						_opkey.ClearSkipedKeyword();
						return _opkey.GetKeywordWithOutObject(
							"SF_LaunchAppAndSelectItem", {
							Item: element.textContent.trim(),
							Index: _opkey
								.CreateTextIndexByTagName(element)
						}, "object", element);
					}
				}
				if (element.nodeName == "IMG") {
					if (element.classList != null) {

						if (element.hasAttribute("one-applauncherapptile_applauncherapptile")) {
							if (element.getAttribute("title") != null) {
								var title_text = element.getAttribute("title");
								keyword_queue = [];
								sessionStorage.setItem("OPKEY_QUEUE_ITEM", "");
								_opkey.ClearSkipedKeyword();
								return _opkey
									.GetKeywordWithOutObject(
										"SF_LaunchApp",
										{
											Item: title_text.trim()
										}, "object", element);
							}
						}
						if (element.classList.contains("relatedListIcon") || element.hasAttribute("one-applauncherapptile_applauncherapptile") || element.hasAttribute("one-applaunchertabitem_applaunchertabitem")) {
							if (element.getAttribute("title") != null) {
								var title_text = element.getAttribute("title");
								keyword_queue = [];
								sessionStorage.setItem("OPKEY_QUEUE_ITEM", "");
								_opkey.ClearSkipedKeyword();
								return _opkey
									.GetKeywordWithOutObject(
										"SF_LaunchAppAndSelectItem",
										{
											Item: title_text.trim(),
											Index: _opkey
												.CreateTextIndexByTagName(element)
										}, "object", element);
							}
						}
					}
				}
			}

			if (element.nodeName == "A") {
				if (element.classList.contains("select")) {
					var aria_describeby = element
						.getAttribute("aria-describedby");
					if (aria_describeby != null) {
						// ////////debugger;
						// console.log("ARIA DESCRIBED BY "+aria_describeby)
						aria_describeby = aria_describeby.trim();
						var label_element = document
							.getElementById(aria_describeby);
						if (label_element != null) {
							// console.log("LABEL DROP DOWN
							// "+label_element.textContent);
							keyword_queue.push("SELECTPICKLIST");
							var argument = new Object();
							argument["Label"] = label_element.textContent;
							argument["label_element"] = label_element;
							keyword_argument = argument;
							_opkey.CaptureSkipedKeyword(element);
							return "SKIP_KEYWORD";
						} else {
							if (element_properties != null) {
								if (element_properties["label:text"] != null) {
									keyword_queue.push("SELECTPICKLIST");
									var argument = new Object();
									argument["Label"] = element_properties["label:text"];
									keyword_argument = argument;
									_opkey.CaptureSkipedKeyword(element);
									return "SKIP_KEYWORD";
								}
							}
						}

						var element_temp = element;
						while (element_temp.parentNode != null) {
							if (element_temp.nodeName == "DIV") {
								if (element_temp.classList != null) {
									if (element_temp.classList
										.contains("slds-form-element")) {
										var child_node = element_temp.childNodes[0];
										if (child_node != null) {
											var span_node = child_node
												.getElementsByTagName("SPAN")[0];
											if (span_node != null) {
												keyword_queue
													.push("SELECTPICKLIST");
												var argument = new Object();
												argument["Label"] = span_node.textContent
													.trim();
												keyword_argument = argument;
												_opkey
													.CaptureSkipedKeyword(element);
												return "SKIP_KEYWORD";

											}
										}
									}
								}
							}

							if (element_temp.nodeName == "LIGHTNING-COMBOBOX") {
								if (element_temp.classList != null) {
									if (element_temp.classList
										.contains("slds-form-element")) {
										var child_node = element_temp.childNodes[0];
										if (child_node != null) {
											var span_node = child_node
												.getElementsByTagName("SPAN")[0];
											if (span_node != null) {
												keyword_queue
													.push("SELECTPICKLIST");
												var argument = new Object();
												argument["Label"] = span_node.textContent
													.trim();
												keyword_argument = argument;
												_opkey
													.CaptureSkipedKeyword(element);
												return "SKIP_KEYWORD";

											}
										}
									}
								}
							}
							element_temp = element_temp.parentNode;
						}
					}
				}
			}

			if (element.nodeName == "BUTTON" && (element.getAttribute("lightning-basecombobox_basecombobox") != null || element.getAttribute("role") === "combobox")) {

				var select_label = "";
				var aria_label = element.getAttribute("aria-label");
				if (aria_label != null) {
					select_label = aria_label.split(",")[0];
				}
				keyword_queue
					.push("SELECTPICKLIST");
				var argument = new Object();
				argument["Label"] = select_label;
				keyword_argument = argument;
				_opkey
					.CaptureSkipedKeyword(element);
				return "SKIP_KEYWORD";
			}

			if (element.nodeName == "INPUT") {
				//debugger
				var element_temp = element;
				while (element_temp.parentNode != null) {
					if (element_temp.nodeName == "LIGHTNING-COMBOBOX") {
						if (element_temp.classList != null) {
							if (element_temp.classList
								.contains("slds-form-element")) {
								var child_node = element_temp.childNodes[0];
								if (child_node != null) {
									keyword_queue
										.push("SELECTPICKLIST");
									var argument = new Object();
									argument["Label"] = child_node.textContent
										.trim();
									keyword_argument = argument;
									_opkey
										.CaptureSkipedKeyword(element);
									return "SKIP_KEYWORD";
								}
							}
						}
					}
					element_temp = element_temp.parentNode;
				}
			}

			if (ll34 != null) {
				keyword_argument["Label"] = ll34;
				ll34 = null;
			}
			if (element.nodeName == "SPAN") {
				//debugger
				if (keyword_queue.indexOf("SELECTPICKLIST") > -1) {
					keyword_queue = [];
					_opkey.ClearSkipedKeyword();
					return _opkey
						.GetKeywordWithOutObject(
							"SF_SelectDataFromPickList",
							{
								LabelName: keyword_argument["Label"],
								Index: _opkey
									.CreateLabelPropertyIndex(
										keyword_argument["label_element"])
									.toString(),
								ValueToSelect: element.textContent
							}, "object", element);
				}
			}
			if (element.nodeName == "LIGHTNING-BASE-COMBOBOX-ITEM") {
				//debugger
				if (keyword_queue.indexOf("SELECTPICKLIST") > -1) {
					keyword_queue = [];
					_opkey.ClearSkipedKeyword();
					return _opkey
						.GetKeywordWithOutObject(
							"SF_SelectDataFromPickList",
							{
								LabelName: keyword_argument["Label"],
								Index: _opkey
									.CreateLabelPropertyIndex(
										keyword_argument["label_element"])
									.toString(),
								ValueToSelect: element.textContent
							}, "object", element);
				}
			}
			if (element.nodeName == "A") {
				var role_a = element.getAttribute("role");
				if (role_a != null) {
					if (role_a == "menuitemradio") {
						if (keyword_queue.indexOf("SELECTPICKLIST") > -1) {
							keyword_queue = [];
							_opkey.ClearSkipedKeyword();
							return _opkey
								.GetKeywordWithOutObject(
									"SF_SelectDataFromPickList",
									{
										LabelName: keyword_argument["Label"],
										Index: _opkey
											.CreateLabelPropertyIndex(
												keyword_argument["label_element"])
											.toString(),
										ValueToSelect: element
											.getAttribute("title")
									}, "object", element);
						}
					}
				}
			}

			if (element.nodeName == "A") {
				// ////////debugger;
				var parent_element = element.parentNode;
				if (parent_element != null) {
					if (parent_element.nodeName == "LI") {
						if (parent_element.classList != null) {
							if (parent_element.classList
								.contains("zen-moreTabs")) {
								if (parent_element.getAttribute("id") != null) {
									if (parent_element.getAttribute("id") == "MoreTabs_Tab") {
										keyword_queue.push("GOTOMORETAB");
										_opkey.CaptureSkipedKeyword(element);
										return "SKIP_KEYWORD";
									}
								}
							}
						}
					}
				}
			}

			if (element.nodeName == "A") {
				if (element.getAttribute("aria-haspopup") != null) {
					if (element.getAttribute("aria-haspopup") == "true") {
						if (element.getAttribute("role") != null) {
							if (element.getAttribute("role") == "button") {
								if (element.getAttribute("title") != null) {
									if (element.getAttribute("title").indexOf(
										"more action") > -1) {
										// //////debugger
										if (_opkey.sales_auth_acquired) {
											var primaryfieldrow_found = false;
											var parent_div = element;
											while (parent_div.parentNode != null) {
												if (parent_div.nodeName == "DIV") {
													if (parent_div.classList != null) {
														if (parent_div.classList
															.contains("primaryFieldRow")
															|| parent_div.classList
																.contains("forceListViewManagerGrid")) {
															primaryfieldrow_found = true;
															break;
														}
													}
												}
												parent_div = parent_div.parentNode;
											}
											if (primaryfieldrow_found) {
												if (opkey_datetime_required) {
													return null;
												}
												keyword_queue
													.push("CLICKONQUICKACTIOON")
												// _opkey.CaptureSkipedKeyword(element);
												return "SKIP_KEYWORD";
											}
										}
									}
								}
							}
						}
					}
				}
			}

			if (element.nodeName == "A") {
				var parent_element = element.parentNode;
				if (parent_element.nodeName == "LI") {
					if (element.classList != null) {
						if (element.classList.contains("tabHeader")) {
							if (parent_element.classList != null) {
								if (parent_element.classList
									.contains("uiTabItem")) {
									var ul_found = false;
									var section_found = false;
									var temp_element = element;
									while (temp_element.parentNode != null) {
										if (temp_element.classList != null) {
											if (temp_element.nodeName == "UL") {
												if (temp_element.classList
													.contains("tabs__nav")) {
													ul_found = true;
												}
											}

											if (temp_element.nodeName == "SECTION") {
												if (temp_element.classList != null) {
													if (temp_element.classList
														.contains("uiTab")) {
														section_found = true;
													}
												}
											}
										}
										temp_element = temp_element.parentNode;
									}

									if (ul_found == true) {
										if (section_found == false) {
											// return "SKIP_KEYWORD";
											return null;
										}
									}
								}
							}
						}
					}
				}
			}

			if (element.nodeName == "A") {
				if (element.getAttribute("id") != null) {
					if (element.getAttribute("id") == "publisherDropdown") {
						if (element.getAttribute("title") != null) {
							// / if(element.getAttribute("title")=="Click to see
							// more options")
							// {
							if (_opkey.sales_auth_acquired) {
								return "SKIP_KEYWORD";
							}
							// }
						}
					}
				}
			}
			if (element.nodeName == "BUTTON") {
				if (element.classList != null) {
					if (element.classList.contains("slds-button")) {
						if (element.classList.contains("slds-button_reset")) {

							var temp_element_4 = element;
							while (temp_element_4.parentNode != null) {
								if (temp_element_4.nodeName == "LI") {
									temp_element_4 = temp_element_4
										.getElementsByTagName("A")[0];
									if (temp_element_4 != null) {
										if (temp_element_4
											.getAttribute("title") != null) {
											selectnew_element = temp_element_4;
											localStorage
												.setItem(
													"SELECTNEW_TAB",
													temp_element_4
														.getAttribute("title"));
											break;
										}
									}
								}
								temp_element_4 = temp_element_4.parentNode;
							}

							keyword_queue.push("SELECTNEW");
							_opkey.CaptureSkipedKeyword(element);
							return "SKIP_KEYWORD";
						}
					}
				}
			}

			if (element.nodeName == "A") {
				if (element.parentNode != null) {
					if (element.parentNode.nodeName == "ONE-APP-NAV-BAR-MENU-BUTTON") {
						if (element.parentNode.classList != null) {
							if (element.parentNode.classList
								.contains("more-button")) {
								_opkey.CaptureSkipedKeyword(element);
								return "SKIP_KEYWORD";
							}
						}
					}
				}
			}

			if (element.nodeName == "LI") {
				if (element.classList != null) {
					if (element.classList.contains("zen-moreTabs")) {
						if (element.getAttribute("id") != null) {
							if (element.getAttribute("id") == "MoreTabs_Tab") {
								keyword_queue.push("GOTOMORETAB");
								_opkey.CaptureSkipedKeyword(element);
								return "SKIP_KEYWORD";
							}
						}
					}
				}
			}

			if (keyword_queue.indexOf("SELECTNEW") > -1) {
				// ////////debugger;
				if (element.nodeName == "A") {
					if (element.textContent.trim().indexOf("New ") == 0) {
						var splited_text = element.textContent.trim().replace(
							"New ", "");
						var tab_name = localStorage.getItem("SELECTNEW_TAB");
						if (tab_name != null) {
							splited_text = tab_name;
						}
						_opkey.ClearSkipedKeyword();
						keyword_queue = [];
						return _opkey
							.GetKeywordWithOutObject(
								"SF_SelectNew",
								{
									TabName: splited_text,
									Index: _opkey
										.CreateTextIndexByTagName(selectnew_element)
								}, "object", element);
					} else {
						keyword_queue = [];
						_opkey.DispatchedSkipedKeyword();
						return null;
					}
				}
			}

			if (element.nodeName == "A") {
				var parent_element = element.parentNode;
				if (parent_element != null) {
					if (parent_element.nodeName == "LI") {
						var id_of_li = parent_element.getAttribute("id");
						if (id_of_li != null) {
							if (id_of_li.indexOf("_Tab") > -1) {
								if (element.textContent.trim() == "") {
									_opkey.CaptureSkipedKeyword(element);
									return "SKIP_KEYWORD";
								}
								_opkey.ClearSkipedKeyword();
								return _opkey
									.GetKeywordWithOutObject(
										"SF_GoToTab",
										{
											TabName: element.textContent,
											Index: _opkey
												.CreateTextIndexByTagName(element)
										}, "object", element);
							}
						}
					}
				}
			}

			if (element.nodeName == "A") {
				if (element.classList.contains("forceActionLink")) {
					if (element.getAttribute("title") != null) {
						// return
						// _opkey.GetKeywordWithOutObject("SF_ClickByText",{TextToSearch:element.getAttribute("title"),Index:_opkey.CreateTextIndex(element),PartialText:false,Before:"",After:""},"object",element);
					}
				}
			}

			if (element.nodeName == "LI") {
				var id_of_li = element.getAttribute("id");
				if (id_of_li != null) {
					if (id_of_li.indexOf("_Tab") > -1) {
						if (element.textContent.trim() == "") {
							_opkey.CaptureSkipedKeyword(element);
							return "SKIP_KEYWORD";
						}
						_opkey.ClearSkipedKeyword();
						return _opkey.GetKeywordWithOutObject("SF_GoToTab", {
							TabName: element.textContent,
							Index: _opkey.CreateTextIndexByTagName(element)
						}, "object", element);
					}
				}
			}
			if (element.nodeName == "SPAN") {
				var parent_element = element.parentNode;
				if (parent_element != null) {
					if (parent_element.nodeName == "A") {
						var href_of_a = parent_element.getAttribute("href");
						var _tabText = parent_element.getAttribute("title");
						if (_tabText == null) {
							_tabText = element.textContent;
						}
						// console.log(href_of_a);
						if (href_of_a != null) {
							// //debugger
							if (href_of_a.indexOf("sObject") > -1) {
								if (element.textContent.trim() == "") {
									_opkey.CaptureSkipedKeyword(element);
									return "SKIP_KEYWORD";
								}
								_opkey.ClearSkipedKeyword();
								return _opkey
									.GetKeywordWithOutObject(
										"SF_GoToTab",
										{
											TabName: _tabText,
											Index: _opkey
												.CreateGoToTabIndex(parent_element)
										}, "object", element);
							} else if (href_of_a.indexOf("/lightning/") > -1) {
								if (element.textContent.trim() == "") {
									_opkey.CaptureSkipedKeyword(element);
									return "SKIP_KEYWORD";
								}
								_opkey.ClearSkipedKeyword();
								return _opkey
									.GetKeywordWithOutObject(
										"SF_GoToTab",
										{
											TabName: _tabText,
											Index: _opkey
												.CreateGoToTabIndex(parent_element)
										}, "object", element);
							} else if (href_of_a.indexOf("/lightning/page/") > -1) {
								if (element.textContent.trim() == "") {
									_opkey.CaptureSkipedKeyword(element);
									return "SKIP_KEYWORD";
								}
								_opkey.ClearSkipedKeyword();
								return _opkey
									.GetKeywordWithOutObject(
										"SF_GoToTab",
										{
											TabName: _tabText,
											Index: _opkey
												.CreateGoToTabIndex(parent_element)
										}, "object", element);
							} else if (href_of_a.indexOf("/one/one.app") > -1) {
								if (element.textContent.trim() == "") {
									_opkey.CaptureSkipedKeyword(element);
									return "SKIP_KEYWORD";
								}
								if (element.getAttribute("title") == null) {
									return null;
								}
								if (element.getAttribute("title") != "Home"
									&& element.getAttribute("title") != "Chatter") {
									return null;
								}
								_opkey.ClearSkipedKeyword();
								return _opkey
									.GetKeywordWithOutObject(
										"SF_GoToTab",
										{
											TabName: _tabText,
											Index: _opkey
												.CreateGoToTabIndex(parent_element)
										}, "object", element);
							}
						}
					}
				}
			}

			if (element.nodeName == "A") {
				if (element != null) {
					if (element.nodeName == "A") {
						// //debugger
						var href_of_a = element.getAttribute("href");
						var _tabText = element.getAttribute("title");
						if (_tabText == null) {
							_tabText = element.textContent;
						}
						var _dnditem_class_present = element.classList
							.contains("dndItem");
						if (element.getAttribute("role") != null
							|| _dnditem_class_present == true) {

							if (element.getAttribute("role") == "menuitem"
								|| element.getAttribute("role") == "menuitemcheckbox"
								|| element.getAttribute("role") == "tab"
								|| _dnditem_class_present == true) {
								if (href_of_a != null) {
									if (href_of_a.indexOf("sObject") > -1) {
										if (element.textContent.trim() == "") {
											_opkey
												.CaptureSkipedKeyword(element);
											return "SKIP_KEYWORD";
										}
										_opkey.ClearSkipedKeyword();
										return _opkey
											.GetKeywordWithOutObject(
												"SF_GoToTab",
												{
													TabName: _tabText,
													Index: _opkey
														.CreateGoToTabIndex(element)
												}, "object", element);
									} else if (href_of_a.indexOf("/lightning/") > -1) {
										if (element.textContent.trim() == "") {
											_opkey
												.CaptureSkipedKeyword(element);
											return "SKIP_KEYWORD";
										}
										_opkey.ClearSkipedKeyword();
										return _opkey
											.GetKeywordWithOutObject(
												"SF_GoToTab",
												{
													TabName: _tabText,
													Index: _opkey
														.CreateGoToTabIndex(element)
												}, "object", element);
									} else if (href_of_a
										.indexOf("/lightning/page/") > -1) {
										if (element.textContent.trim() == "") {
											_opkey
												.CaptureSkipedKeyword(element);
											return "SKIP_KEYWORD";
										}
										_opkey.ClearSkipedKeyword();
										return _opkey
											.GetKeywordWithOutObject(
												"SF_GoToTab",
												{
													TabName: _tabText,
													Index: _opkey
														.CreateGoToTabIndex(element)
												}, "object", element);
									} else if (href_of_a
										.indexOf("/one/one.app") > -1) {
										if (element.textContent.trim() == "") {
											_opkey
												.CaptureSkipedKeyword(element);
											return "SKIP_KEYWORD";
										}
										if (element.getAttribute("title") == null) {
											return null;
										}
										if (element.getAttribute("title") != "Home"
											&& element
												.getAttribute("title") != "Chatter") {
											return null;
										}
										_opkey.ClearSkipedKeyword();
										return _opkey
											.GetKeywordWithOutObject(
												"SF_GoToTab",
												{
													TabName: _tabText,
													Index: _opkey
														.CreateGoToTabIndex(element)
												}, "object", element);
									}
								}
							}
						}
					}
				}
			}

			if (element.nodeName == "A") {
				var href_of_a = element.getAttribute("href");
				var parent_of_a = element.parentNode;
				if (parent_of_a.nodeName == "LI") {
					if ($(parent_of_a).hasClass(
						"slds-context-bar__item slds-shrink-none")) {
						if (href_of_a != null) {
							if (href_of_a.indexOf("sObject") > -1) {
								if (element.textContent.trim() == "") {
									_opkey.CaptureSkipedKeyword(element);
									return "SKIP_KEYWORD";
								}
								_opkey.ClearSkipedKeyword();
								return _opkey
									.GetKeywordWithOutObject(
										"SF_GoToTab",
										{
											TabName: element.textContent,
											Index: _opkey
												.CreateTextIndexByTagName(element)
										}, "object", element);
							} else if (href_of_a.indexOf("/lightning/") > -1) {
								if (element.textContent.trim() == "") {
									_opkey.CaptureSkipedKeyword(element);
									return "SKIP_KEYWORD";
								}
								_opkey.ClearSkipedKeyword();
								return _opkey
									.GetKeywordWithOutObject(
										"SF_GoToTab",
										{
											TabName: element.textContent,
											Index: _opkey
												.CreateTextIndexByTagName(element)
										}, "object", element);
							} else if (href_of_a.indexOf("/lightning/page/") > -1) {
								if (element.textContent.trim() == "") {
									_opkey.CaptureSkipedKeyword(element);
									return "SKIP_KEYWORD";
								}
								_opkey.ClearSkipedKeyword();
								return _opkey
									.GetKeywordWithOutObject(
										"SF_GoToTab",
										{
											TabName: element.textContent,
											Index: _opkey
												.CreateTextIndexByTagName(element)
										}, "object", element);
							} else if (href_of_a.indexOf("/one/one.app") > -1) {
								if (element.textContent.trim() == "") {
									_opkey.CaptureSkipedKeyword(element);
									return "SKIP_KEYWORD";
								}

								if (element.getAttribute("title") == null) {
									return null;
								}
								if (element.getAttribute("title") != "Home"
									&& element.getAttribute("title") != "Chatter") {
									return null;
								}
								_opkey.ClearSkipedKeyword();
								return _opkey
									.GetKeywordWithOutObject(
										"SF_GoToTab",
										{
											TabName: element.textContent,
											Index: _opkey
												.CreateTextIndexByTagName(element)
										}, "object", element);
							}
						}
					}
				}
			}

			if (element.nodeName == "A") {
				var text_content = element.textContent;
				text_content = text_content.trim();
				if (text_content == "Switch to Salesforce Classic") {
					if (keyword_queue.indexOf("SWITCHLIGHTNING") > -1) {
						keyword_queue = [];
						_opkey.ClearSkipedKeyword();
						return _opkey.GetKeywordWithOutObject(
							"SF_SwitchToSalesforceClassic", "", "string",
							element);
					}
				} else if (text_content == "Log Out") {
					if (keyword_queue.indexOf("SWITCHLIGHTNING") > -1) {
						keyword_queue = [];
						_opkey.ClearSkipedKeyword();
						return _opkey.GetKeywordWithOutObject("SF_LogOut", "",
							"string", element);
					}
				} else if (text_content == "Switch to Lightning Experience") {
					_opkey.ClearSkipedKeyword();
					return _opkey.GetKeywordWithOutObject(
						"SF_SwitchToSalesforceLightning", "", "string",
						element);
				}
			}

			if (element.nodeName == "DIV") {
				if (element.getAttribute("data-scoped-scroll") != null) {
					if (element.getAttribute("data-scoped-scroll") == "true") {
						_opkey.CaptureSkipedKeyword(element);
						return "SKIP_KEYWORD";
					}
				}
			}

			if (element.nodeName == "INPUT") {
				if (element.type != null) {
					if (element.type == "button") {
						if (element.value != null) {
							if (element.value == "Search") {
								if (element.id != null) {
									if (element.id == "phSearchButton") {
										_opkey.CaptureSkipedKeyword(element);
										return "SKIP_KEYWORD";
									}
								}
							}
						}
					}
				}
			}

			// add more
			if (element.nodeName == "A") {
				if (element.classList != null) {
					if (element.classList.contains("datePicker-openIcon")) {

						var label_datetime = "";
						if (label_datetime == "") {
							var temp_element_2 = element;
							while (temp_element_2.parentNode != null) {
								if (temp_element_2.nodeName == "FIELDSET") {
									var label_temp_element = temp_element_2.childNodes[0];
									if (label_temp_element != null) {
										if (label_temp_element.nodeName == "LEGEND") {
											label_datetime = label_temp_element.childNodes[0].textContent;
										}
									}
								}
								temp_element_2 = temp_element_2.parentNode;
							}
						}
						var parent_node = element.parentNode;
						if (parent_node != null) {
							var input_element = parent_node
								.getElementsByTagName("INPUT")[0];
							if (input_element != null) {
								// console.log(" input node
								// "+input_element.nodeName);
								if (input_element.getAttribute("id") != null) {
									var input_of_id = input_element
										.getAttribute("id");
									var labels = document
										.getElementsByTagName("LABEL");
									for (var l_i = 0; l_i < labels.length; l_i++) {
										var label = labels[l_i];
										if (label.getAttribute("for") != null) {
											if (label.getAttribute("for") == input_of_id) {
												var temp_input_element = input_element;
												var all_input_eleemnts = null;
												while (temp_input_element.parentNode != null) {
													if (temp_input_element.classList != null) {
														if (temp_input_element.classList
															.contains("uiInputDateTime")) {
															all_input_eleemnts = temp_input_element
																.getElementsByTagName("INPUT");
															break;
														}
													}
													temp_input_element = temp_input_element.parentNode;
												}

												var label_content = label.innerText;
												var object2 = new Object();
												if (all_input_eleemnts != null) {
													object2["DateTimeElemnts"] = all_input_eleemnts;
												}

												if (label_datetime != "") {
													object2["Label"] = label_datetime;
												} else {
													object2["Label"] = label_content;
												}
												keyword_argument = object2;
											}
										}
									}
								}
								date_picker_text_box = input_element;
								keyword_queue.push("DATEPICKER")
								// _opkey.CaptureSkipedKeyword(element);
								// return "SKIP_KEYWORD"
							}
						}
					}

					else if (element.classList.contains("timePicker-openIcon")) {

						var label_datetime = "";
						if (label_datetime == "") {
							var temp_element_2 = element;
							while (temp_element_2.parentNode != null) {
								if (temp_element_2.nodeName == "FIELDSET") {
									var label_temp_element = temp_element_2.childNodes[0];
									if (label_temp_element != null) {
										if (label_temp_element.nodeName == "LEGEND") {
											label_datetime = label_temp_element.childNodes[0].textContent;
										}
									}
								}
								temp_element_2 = temp_element_2.parentNode;
							}
						}
						var parent_node = element.parentNode;
						if (parent_node != null) {
							var input_element = parent_node
								.getElementsByTagName("INPUT")[0];
							if (input_element != null) {
								// console.log(" input node
								// "+input_element.nodeName);
								if (input_element.getAttribute("id") != null) {
									var input_of_id = input_element
										.getAttribute("id");
									var labels = document
										.getElementsByTagName("LABEL");
									for (var l_i = 0; l_i < labels.length; l_i++) {
										var label = labels[l_i];
										if (label.getAttribute("for") != null) {
											if (label.getAttribute("for") == input_of_id) {
												var temp_input_element = input_element;
												var all_input_eleemnts = null;
												while (temp_input_element.parentNode != null) {
													if (temp_input_element.classList != null) {
														if (temp_input_element.classList
															.contains("uiInputDateTime")) {
															all_input_eleemnts = temp_input_element
																.getElementsByTagName("INPUT");
															break;
														}
													}
													temp_input_element = temp_input_element.parentNode;
												}

												var label_content = label.innerText;
												var object2 = new Object();
												if (all_input_eleemnts != null) {
													object2["DateTimeElemnts"] = all_input_eleemnts;
												}

												if (label_datetime != "") {
													object2["Label"] = label_datetime;
												} else {
													object2["Label"] = label_content;
												}
												keyword_argument = object2;
												keyword_queue
													.push("TIMEPICKER");
												// _opkey.CaptureSkipedKeyword(element);
												// return "SKIP_KEYWORD"
											}
										}
									}
								}
							}
						}
					}
				}
			}

			if (keyword_queue.indexOf("TIMEPICKER") > -1) {
				// ////////debugger;

				if (element.nodeName == "DIV") {
					if (element.classList != null) {
						if (element.classList.contains("simpleHour")) {
							keyword_queue = [];

							if (keyword_argument["DateTimeElemnts"] != null) {

								var input_elements_0 = keyword_argument["DateTimeElemnts"];
								var args = {
									"Label": keyword_argument["Label"],
									"Index": "0",
									"Value": input_elements_0[0].value + " "
										+ element.textContent.trim()
								};
								// return
								// _opkey.GetKeywordWithOutObject("SF_SetDateTime",args,"object",element);
							}

							var args = {
								"TimeEvent": keyword_argument["Label"],
								"Index": "0",
								"Time(hh:mm)": element.textContent.trim()
							};
							// return
							// _opkey.GetKeywordWithOutObject("SF_SetTime",args,"object",element);

						}
					}
				}

				if (element.nodeName == "LI") {
					if (element.getAttribute("role") != null) {
						if (element.getAttribute("role") == "menuitem") {
							keyword_queue = [];

							if (keyword_argument["DateTimeElemnts"] != null) {

								var input_elements_0 = keyword_argument["DateTimeElemnts"];
								var args = {
									"Label": keyword_argument["Label"],
									"Index": "0",
									"Value": input_elements_0[0].value + " "
										+ element.textContent.trim()
								};
								// return
								// _opkey.GetKeywordWithOutObject("SF_SetDateTime",args,"object",element);
							}

							var args = {
								"TimeEvent": keyword_argument["Label"],
								"Index": "0",
								"Time(hh:mm)": element.textContent.trim()
							};
							// return
							// _opkey.GetKeywordWithOutObject("SF_SetTime",args,"object",element);

						}
					}
				}
			}

			if (keyword_queue.indexOf("DATEPICKER") > -1) {
				// ////////debugger;
				if (element.nodeName == "SPAN") {
					var temp_element = element;
					while (temp_element.parentNode != null) {
						if (temp_element.nodeName == "TABLE") {
							if (temp_element.classList != null) {
								if (temp_element.classList.contains("calGrid")) {
									var td_element = element.parentNode;
									var date_value = td_element
										.getAttribute("data-datevalue");
									date_value = date_value.split("-");
									var year_value = date_value[0];
									var month_value = date_value[1];
									var date = date_value[2];
									date_value = month_value + "/" + date + "/"
										+ year_value;
									// ////////debugger;
									keyword_queue = [];
									var label_0 = keyword_argument["Label"];
									if (label_0.indexOf("\n") > -1
										&& label_0.indexOf("\n") != 0) {
										label_0 = label_0.split("\n");
										label_0 = label_0[0];
									}

									if (keyword_argument["DateTimeElemnts"] != null) {

										var input_elements_0 = keyword_argument["DateTimeElemnts"];
										var args = {
											"Label": label_0,
											"Index": "0",
											"Value": date_value + " "
												+ input_elements_0[1].value
										};
										// return
										// _opkey.GetKeywordWithOutObject("SF_SetDateTime",args,"object",temp_element);
									}

									var args = {
										"DateEvent": label_0,
										"Index": "0",
										"Date(MM/DD/YYYY)": date_value
									};
									// return
									// _opkey.GetKeywordWithOutObject("SF_SetDate",args,"object",temp_element);

								}
							}
						}
						temp_element = temp_element.parentNode;
					}
				} else if (element.nodeName == "TD") {
					var temp_element = element;
					while (temp_element.parentNode != null) {
						if (temp_element.nodeName == "TABLE") {
							if (temp_element.classList != null) {
								if (temp_element.classList.contains("calGrid")) {
									var date_value = element
										.getAttribute("data-datevalue");
									var parts = date_value.split('-');
									var current_date = new Date(parts[0],
										parts[1] - 1, parts[2]);
									keyword_queue = [];
									var label_0 = keyword_argument["Label"];
									if (label_0.indexOf("\n") > -1
										&& label_0.indexOf("\n") != 0) {
										label_0 = label_0.split("\n");
										label_0 = label_0[0];
									}

									if (keyword_argument["DateTimeElemnts"] != null) {

										var input_elements_0 = keyword_argument["DateTimeElemnts"];
										var args = {
											"Label": label_0,
											"Index": "0",
											"Value": current_date
												.toDateString()
												+ " "
												+ input_elements_0[1].value
										};
										// return
										// _opkey.GetKeywordWithOutObject("SF_SetDateTime",args,"object",temp_element);
									}
									var args = {
										"DateEvent": label_0,
										"Index": "0",
										"Date(MM/DD/YYYY)": current_date
											.toDateString()
									};
									// return
									// _opkey.GetKeywordWithOutObject("SF_SetDate",args,"object",temp_element);

								}
							}
						}
						temp_element = temp_element.parentNode;
					}

					if (element.classList != null) {
						// ////////debugger;
						if (element.classList.contains("weekday")) {
							var date = element.textContent;
							var month_element = document
								.getElementById("calMonthPicker");
							var year_element = document
								.getElementById("calYearPicker");

							var month_value = month_element.options[month_element.selectedIndex].value;
							month_value = parseInt(month_value) + 1;
							var year_value = year_element.options[year_element.selectedIndex].value;

							if (keyword_argument["DateTimeElemnts"] != null) {

								var input_elements_0 = keyword_argument["DateTimeElemnts"];
								var args = {
									"Label": keyword_argument["Label"],
									"Index": "0",
									"Value": month_value + "/" + date + "/"
										+ year_value + " "
										+ input_elements_0[1].value
								};
								// return
								// _opkey.GetKeywordWithOutObject("SF_SetDateTime",args,"object",element);
							}
							// keyword_queue=[];
							var args = {
								"DateEvent": keyword_argument["Label"],
								"Index": "0",
								"Date(MM/DD/YYYY)": month_value + "/" + date
									+ "/" + year_value
							};
							// return
							// _opkey.GetKeywordWithOutObject("SF_SetDate",args,"object",element);

						}
					}
				}

				else {
					var temp_element_0 = element;
					while (temp_element_0.parentNode != null) {
						if (temp_element_0.nodeName == "DIV") {
							if (temp_element_0.classList != null) {
								if (temp_element_0.classList
									.contains("uiDatePicker")) {
									// _opkey.CaptureSkipedKeyword(element);
									// commented for release
									// return "SKIP_KEYWORD";
								}
							}
						}
						temp_element_0 = temp_element_0.parentNode;
					}
				}
			}

			if (element.nodeName == "SPAN") {
				// ////////debugger;
				if (element.childNodes != null) {
					if (element.childNodes.length > 0) {
						element = element.getElementsByTagName("A")[0];
						if (element == null) {
							return null;
						}
						if (element.nodeName == "A") {
							if (element.getAttribute("href") != null) {
								if (element.getAttribute("href").indexOf(
									"DatePicker.insertDate") > -1) {
									// ////////debugger;
									var label_content = "";
									var href_element = element
										.getAttribute("href");
									href_element = href_element
										.replace(
											"javascript:DatePicker.insertDate(",
											"");
									href_element = href_element.replace(");",
										"");
									href_element = href_element
										.replace(" ", "");
									href_element = href_element.split(",");

									var id_of_label = href_element[1].replace(
										"'", "").trim();
									id_of_label = id_of_label.replace("'", "");
									var label_elements = document
										.getElementsByTagName("LABEL");
									for (var l_e = 0; l_e < label_elements.length; l_e++) {
										var label_element = label_elements[l_e];
										if (label_element.getAttribute("for") != null) {
											if (label_element
												.getAttribute("for") == id_of_label) {
												label_content = label_element.textContent
													.trim();
												break;
											}
										}
									}
									var text_content = element.textContent;
									text_content = text_content.trim();
									var splited_text_content = text_content
										.split(" ");
									if (splited_text_content.length == 1) {
										// ////////debugger;
										var parent_date = element.parentNode.parentNode.parentNode.parentNode;
										var label_element = parent_date
											.getElementsByTagName("LABEL")[0];
										if (label_content == "") {
											if (label_element != null) {
												label_content = label_element.textContent
													.trim();
											}
										}
										var args = {
											"DateEvent": label_content,
											"Index": "0",
											"Date(MM/DD/YYYY)": text_content
										};
										// return
										// _opkey.GetKeywordWithOutObject("SF_SetDate",args,"object",element);
									} else if (splited_text_content.length > 1) {

										var label_content = "";
										var parent_date = element.parentNode.parentNode.parentNode.parentNode;
										var label_element = parent_date
											.getElementsByTagName("LABEL")[0];
										if (label_content == "") {
											if (label_element != null) {
												label_content = label_element.textContent
													.trim();
											}
										}
										var args = {
											"Label": label_content,
											"Index": "0",
											"Value": text_content
										};
										// return
										// _opkey.GetKeywordWithOutObject("SF_SetDateTime",args,"object",element);
									}
								}
							}
						}
					}
				}
			}

			if (element.nodeName == "A") {
				if (element.getAttribute("href") != null) {
					if (element.getAttribute("href").indexOf(
						"DatePicker.insertDate") > -1) {
						// ////////debugger;
						var label_content = "";
						var href_element = element.getAttribute("href");
						href_element = href_element.replace(
							"javascript:DatePicker.insertDate(", "");
						href_element = href_element.replace(");", "");
						href_element = href_element.replace(" ", "");
						href_element = href_element.split(",");

						var id_of_label = href_element[1].replace("'", "")
							.trim();
						id_of_label = id_of_label.replace("'", "");
						var label_elements = document
							.getElementsByTagName("LABEL");
						for (var l_e = 0; l_e < label_elements.length; l_e++) {
							var label_element = label_elements[l_e];
							if (label_element.getAttribute("for") != null) {
								if (label_element.getAttribute("for") == id_of_label) {
									label_content = label_element.textContent
										.trim();
									break;
								}
							}
						}
						var text_content = element.textContent;
						text_content = text_content.trim();
						var splited_text_content = text_content.split(" ");
						if (splited_text_content.length == 1) {
							// ////////debugger;
							var parent_date = element.parentNode.parentNode.parentNode.parentNode;
							var label_element = parent_date
								.getElementsByTagName("LABEL")[0];
							if (label_content == "") {
								if (label_element != null) {
									label_content = label_element.textContent
										.trim();
								}
							}
							var args = {
								"DateEvent": label_content,
								"Index": "0",
								"Date(MM/DD/YYYY)": text_content
							};
							// return
							// _opkey.GetKeywordWithOutObject("SF_SetDate",args,"object",element);
						} else if (splited_text_content.length > 1) {

							var label_content = "";
							var parent_date = element.parentNode.parentNode.parentNode.parentNode;
							var label_element = parent_date
								.getElementsByTagName("LABEL")[0];
							if (label_content == "") {
								if (label_element != null) {
									label_content = label_element.textContent
										.trim();
								}
							}
							var args = {
								"Label": label_content,
								"Index": "0",
								"Value": text_content
							};
							// return
							// _opkey.GetKeywordWithOutObject("SF_SetDateTime",args,"object",element);
						}
					}
				}
			}

			if (element.nodeName == "BUTTON") {
				// ////////debugger;
				if (element.textContent.indexOf(" Menu") > 0) {

					var temp_element_4 = element;
					while (temp_element_4.parentNode != null) {
						if (temp_element_4.nodeName == "LI") {
							temp_element_4 = temp_element_4
								.getElementsByTagName("A")[0];
							if (temp_element_4 != null) {
								if (temp_element_4.getAttribute("title") != null) {
									selectnew_element = temp_element_4;
									localStorage.setItem("SELECTNEW_TAB",
										temp_element_4
											.getAttribute("title"));
									break;
								}
							}
						}
						temp_element_4 = temp_element_4.parentNode;
					}
					keyword_queue.push("SELECTNEW");
					_opkey.CaptureSkipedKeyword(element);
					return "SKIP_KEYWORD";
				}
			}

			if (element.nodeName == "A") {
				// ////////debugger;
				if (element.getAttribute("role") != null) {
					if (element.getAttribute("role") == "button") {
						if (element.classList != null) {
							if (element.classList.contains("slds-button")) {
								if (element.classList
									.contains("slds-button_reset")) {
									var temp_element_4 = element;
									while (temp_element_4.parentNode != null) {
										if (temp_element_4.nodeName == "LI") {
											temp_element_4 = temp_element_4
												.getElementsByTagName("A")[0];
											if (temp_element_4 != null) {
												if (temp_element_4
													.getAttribute("title") != null) {
													selectnew_element = temp_element_4;
													localStorage
														.setItem(
															"SELECTNEW_TAB",
															temp_element_4
																.getAttribute("title"));
													break;
												}
											}
										}
										temp_element_4 = temp_element_4.parentNode;
									}
									keyword_queue.push("SELECTNEW");
									_opkey.CaptureSkipedKeyword(element);
									return "SKIP_KEYWORD";
								}
							}
						}
					}
				}
			}

			if (element.nodeName == "BUTTON") {
				// ////////debugger;
				if (element.classList != null) {
					if (element.classList.contains("slds-button")) {
						if (element.classList.contains("slds-button_reset")) {

							var temp_element_4 = element;
							while (temp_element_4.parentNode != null) {
								if (temp_element_4.nodeName == "LI") {
									temp_element_4 = temp_element_4
										.getElementsByTagName("A")[0];
									if (temp_element_4 != null) {
										if (temp_element_4
											.getAttribute("title") != null) {
											selectnew_element = temp_element_4;
											localStorage
												.setItem(
													"SELECTNEW_TAB",
													temp_element_4
														.getAttribute("title"));
											break;
										}
									}
								}
								temp_element_4 = temp_element_4.parentNode;
							}

							keyword_queue.push("SELECTNEW");
							_opkey.CaptureSkipedKeyword(element);
							return "SKIP_KEYWORD";
						}
					}
				}
			}

			if (element.nodeName == "BUTTON") {
				if (element.textContent == "App Launcher") {
					keyword_queue.push("APP_LAUNCHER");
					_opkey.CaptureSkipedKeyword(element);
					return "SKIP_KEYWORD"
				}
			}

			if (element.nodeName == "IMG") {
				if (element.classList != null) {
					if (element.classList.contains("allTabsArrow")) {
						keyword_queue.push("APP_LAUNCHER");
						sessionStorage.setItem("OPKEY_QUEUE_ITEM",
							"APP_LAUNCHER");
						_opkey.CaptureSkipedKeyword(element);
						return "SKIP_KEYWORD"
					}
				}
			}

			if (keyword_queue.indexOf("USER_LAUNCHER") > -1) {
				if (element.nodeName == "A") {
					if (element.getAttribute("title") != null) {
						if (element.getAttribute("title") == "Switch to Lightning Experience") {
							keyword_queue = [];
							_opkey.ClearSkipedKeyword();
							return _opkey.GetKeywordWithOutObject(
								"SF_SwitchToSalesforceLightning", "",
								"string", element);
						} else if (element.getAttribute("title") == "Logout") {
							keyword_queue = [];
							_opkey.ClearSkipedKeyword();
							return _opkey.GetKeywordWithOutObject("SF_LogOut",
								"", "string", element);
						}
					}
				}
			}
			if (element.nodeName == "BUTTON") {
				if (element.parentNode.nodeName.toLowerCase() != "one-tmp-button-menu") {
					if (element.classList.contains("slds-button")) {
						if (element.getAttribute("title") != null) {
							// return
							// _opkey.GetKeywordWithOutObject("SF_ClickByText",{TextToSearch:element.getAttribute("title"),Index:_opkey.CreateTextIndex(element),PartialText:false,Before:"",After:""},"object",element);
						} else if (element.getAttribute("value") != null) {
							// return
							// _opkey.GetKeywordWithOutObject("SF_ClickByText",{TextToSearch:element.getAttribute("value"),Index:_opkey.CreateTextIndex(element),PartialText:false,Before:"",After:""},"object",element);
						} else {
							var text_content = element.textContent;
							text_content = text_content.trim();
							if (text_content != "") {
								// return
								// _opkey.GetKeywordWithOutObject("SF_ClickByText",{TextToSearch:text_content,Index:_opkey.CreateTextIndex(element),PartialText:false,Before:"",After:""},"object",element);
							}
						}
					}
				}
			}
			if (element.nodeName == "IMG") {
				if (element.getAttribute("alt") != null) {
					if (element.getAttribute("alt") == "User") {
						keyword_queue.push("SWITCHLIGHTNING")
						_opkey.CaptureSkipedKeyword(element);
						return "SKIP_KEYWORD";
					}
				}
			}

			if (element.nodeName == "BUTTON") {
				if (element.classList != null) {
					if (element.classList
						.contains("branding-userProfile-button")) {
						keyword_queue.push("SWITCHLIGHTNING")
						_opkey.CaptureSkipedKeyword(element);
						return "SKIP_KEYWORD";
					}
				}
			}
			if (keyword_queue.indexOf("APP_LAUNCHER") > -1) {
				if (element.nodeName == "BUTTON") {
					_opkey.CaptureSkipedKeyword(element);
					return "SKIP_KEYWORD";
				}
				if (element.nodeName == "LIGHTNING-BUTTON") {
					_opkey.CaptureSkipedKeyword(element);
					return "SKIP_KEYWORD";
				}
				if (element.nodeName == "A") {
					var div_elements = element.getElementsByTagName("DIV");
					for (var dv_i = 0; dv_i < div_elements.length; dv_i++) {
						var div_element = div_elements[dv_i];
						if (div_element.classList.contains("appTileTitle")
							|| div_element.classList
								.contains("appTileTitleNoDesc")) {
							var title_attribute = div_element
								.getAttribute("title");
							if (title_attribute != null) {
								keyword_queue = [];
								_opkey.ClearSkipedKeyword();
								return _opkey.GetKeywordWithOutObject(
									"SF_LaunchApp", {
									AppName: title_attribute
								}, "object", element);
							}
						}
					}
					if (element.classList.contains("menuButtonMenuLink") || element.classList.contains("al-menu-item")) {
						var app_name = element.textContent.trim();
						keyword_queue = [];
						_opkey.ClearSkipedKeyword();
						return _opkey.GetKeywordWithOutObject("SF_LaunchApp", {
							AppName: app_name
						}, "object", element);
					}
				}

				var tempelement = element;
				while (tempelement.parentNode != null) {
					if (tempelement.nodeName == "A") {
						anchorElement = tempelement;
						var div_elements = tempelement
							.getElementsByTagName("DIV");
						for (var dv_i = 0; dv_i < div_elements.length; dv_i++) {
							var div_element = div_elements[dv_i];
							if (div_element.classList.contains("appTileTitle")) {
								var title_attribute = div_element
									.getAttribute("title");
								if (title_attribute != null) {
									keyword_queue = [];
									_opkey.ClearSkipedKeyword();
									return _opkey.GetKeywordWithOutObject(
										"SF_LaunchApp", {
										AppName: title_attribute
									}, "object", element);
								}
							}
						}
					}
					tempelement = tempelement.parentNode;
				}

				// fixing here @Mohit for Sf_launch app add to keyword quene
				var c = 3;
				var checkForLaunchAppEle = element;
				while (checkForLaunchAppEle.parentNode != null && c != 0) {
					checkForLaunchAppEle = checkForLaunchAppEle.parentNode;
					c--;
					if (keyword_queue != 0) {
						// 	console.log("Mohit logs 4")
						if (checkForLaunchAppEle.nodeName == "DIV" && (checkForLaunchAppEle.classList.contains("slds-app-launcher__tile"))) {
							keyword_queue = [];
							var title_123 = checkForLaunchAppEle.getAttribute("data-name");
							_opkey.ClearSkipedKeyword();
							return _opkey.GetKeywordWithOutObject(
								"SF_LaunchApp", {
								AppName: title_123
							}, "object", element);
						}
					}

				}

				if (element.nodeName == "IMG") {
					var temp_element = element;
					var anchorElement = null;
					while (temp_element.parentNode != null) {
						if (temp_element.nodeName == "A") {
							anchorElement = temp_element;
							var div_elements = temp_element
								.getElementsByTagName("DIV");
							for (var dv_i = 0; dv_i < div_elements.length; dv_i++) {
								var div_element = div_elements[dv_i];
								if (div_element.classList
									.contains("appTileTitle")
									|| div_element.classList
										.contains("appTileTitleNoDesc")) {
									var title_attribute = div_element
										.getAttribute("title");
									if (title_attribute != null) {
										keyword_queue = [];
										_opkey.ClearSkipedKeyword();
										return _opkey.GetKeywordWithOutObject(
											"SF_LaunchApp", {
											AppName: title_attribute
										}, "object", temp_element);
									}
								}
							}
						}
						temp_element = temp_element.parentNode;
					}
					if (anchorElement != null) {
						if (anchorElement.classList.contains("menuButtonMenuLink") || anchorElement.classList.contains("al-menu-item")) {
							var app_name = anchorElement.textContent.trim();
							keyword_queue = [];
							_opkey.ClearSkipedKeyword();
							return _opkey.GetKeywordWithOutObject("SF_LaunchApp", {
								AppName: app_name
							}, "object", anchorElement);
						}
					}
				}

				if (element.nodeName == "A") {
					if (element.classList != null) {
						if (element.classList.contains("appTileTitle")) {
							var title_attribute = element.textContent.trim();
							if (title_attribute != null) {
								keyword_queue = [];
								_opkey.ClearSkipedKeyword();
								return _opkey.GetKeywordWithOutObject(
									"SF_LaunchApp", {
									AppName: title_attribute
								}, "object", element);
							}
						}
					}
				}

				var _anchro_node = element.getElementsByTagName("A")[0];
				if (_anchro_node) {
					if (_anchro_node.classList != null) {
						if (_anchro_node.classList.contains("appTileTitle")) {
							var title_attribute = _anchro_node.textContent
								.trim();
							if (title_attribute != null) {
								keyword_queue = [];
								_opkey.ClearSkipedKeyword();
								return _opkey.GetKeywordWithOutObject(
									"SF_LaunchApp", {
									AppName: title_attribute
								}, "object", _anchro_node);
							}
						}
					}
				}

				var _anchro_node_0 = element.parentNode
					.getElementsByTagName("A")[0];
				if (_anchro_node_0) {
					if (_anchro_node_0.classList != null) {
						if (_anchro_node_0.classList.contains("appTileTitle")) {
							var title_attribute = _anchro_node_0.textContent
								.trim();
							if (title_attribute != null) {
								keyword_queue = [];
								_opkey.ClearSkipedKeyword();
								return _opkey.GetKeywordWithOutObject(
									"SF_LaunchApp", {
									AppName: title_attribute
								}, "object", _anchro_node_0);
							}
						}
					}
				}
			}

			if (element.nodeName == "IMG") {
				if (element.classList != null) {
					if (element.classList.contains("lookupIconOn")
						|| element.classList.contains("lookupIcon")) {
						// ////////debugger;
						var img_label = "";
						var form_name = "";
						if (element.parentNode != null) {
							if (element.parentNode.nodeName == "A") {
								if (element.parentNode.getAttribute("title") != null) {
									img_label = element.parentNode
										.getAttribute("title");
									img_label = img_label.trim();
								}
							}
						}
						if (img_label == "") {
							if (element.getAttribute("title") != null) {
								img_label = element.getAttribute("title")
									.replace("Lookup (New Window)", "");
								img_label = img_label.trim();
							}
						}

						var img_elements = document.getElementsByTagName("H2");
						for (var i_e = 0; i_e < img_elements.length; i_e++) {
							var img_element = img_elements[i_e];
							if (img_element.classList != null) {
								if (img_element.classList
									.contains("pageDescription")) {
									form_name = img_element.textContent.trim();
								}
							}
						}

						if (form_name == "") {
							var h1_eleemnts = document
								.getElementsByTagName("H1");
							for (var h1_i = 0; h1_i < h1_eleemnts.length; h1_i++) {
								var h1_element = h1_eleemnts[h1_i];
								if (h1_element.classList != null) {
									if (h1_element.classList
										.contains("pageType")) {
										form_name = h1_element.textContent
											.trim();
									}
								}
							}
						}

						if (form_name == "") {
							var anchor_elements = document
								.getElementsByTagName("A");
							for (var ap_i = 0; ap_i < anchor_elements.length; ap_i++) {
								var anchor_element = anchor_elements[ap_i];
								if (anchor_element.classList != null) {
									if (anchor_element.classList
										.contains("publisherattach")) {
										if (anchor_element.classList
											.contains("withArrowAttached")) {
											if (anchor_element
												.getAttribute("title")) {
												form_name = anchor_element
													.getAttribute("title");
												break;
											}
										}
									}
								}
							}
						}

						if (form_name == "") {
							var dropdown_anchor = document
								.getElementById("publisherDropdown");
							if (dropdown_anchor != null) {
								var span_inside_dropdown_anchor = dropdown_anchor
									.getElementsByTagName("SPAN");
								for (var s_i_d = 0; s_i_d < span_inside_dropdown_anchor.length; s_i_d++) {
									var span_element = span_inside_dropdown_anchor[s_i_d];
									if (span_element.classList != null) {
										if (span_element.classList
											.contains("publisherTypeOverflowSelected")) {
											if (dropdown_anchor
												.getAttribute("title") != null) {
												form_name = dropdown_anchor
													.getAttribute("title");
											}
										}
									}
								}
							}
						}

						var menuitem = "";
						var p_p_node = element.parentNode.parentNode.parentNode;
						// ////////debugger;
						if (p_p_node != null) {
							var select_element = p_p_node
								.getElementsByTagName("SELECT")[0];
							if (select_element != null) {
								menuitem = select_element.options[select_element.selectedIndex].text;
							}
						}

						if (menuitem == "") {
							// ////////debugger;
							var parent_anchor_image = element.parentNode;
							if (parent_anchor_image.nodeName == "A") {
								if (parent_anchor_image.getAttribute("secid") != null) {
									var sec_id = parent_anchor_image
										.getAttribute("secid");
									sec_id = sec_id.replace("_mlbtn", "");
									sec_id = sec_id + "_mlktp";
									var select_element = document
										.getElementById(sec_id);
									if (select_element.nodeName == "SELECT") {

										menuitem = select_element.options[select_element.selectedIndex].text;
									}
								}
							}
						}
						img_label = img_label
							.replace("Lookup (New Window)", "");
						img_label = img_label.trim();
						localStorage.setItem("OPKEY_QUEUE_ITEM",
							"CLASSIC_LOOKUP")
						localStorage.setItem("CLASSIC_LOOKUP_LABEL", img_label);
						localStorage.setItem("CLASSIC_LOOKUP_FORMNAME",
							form_name);
						localStorage.setItem("CLASSIC_LOOKUP_MENUITEM",
							menuitem);
						_opkey.CaptureSkipedKeyword(element);
						return "SKIP_KEYWORD";
					}
				}
			}

			var queue_item = localStorage.getItem("OPKEY_QUEUE_ITEM");
			// ////////debugger;
			if (queue_item == "CLASSIC_LOOKUP") {
				var can_dispatch_lookup = true;
				var input_elements_lookup = document
					.getElementsByTagName("INPUT")
				{
					for (var i_e_l = 0; i_e_l < input_elements_lookup.length; i_e_l++) {
						var input_element_lookup = input_elements_lookup[i_e_l];
						if (input_element_lookup.type != null) {
							if (input_element_lookup.type == "button") {
								if (input_element_lookup.classList != null) {
									if (input_element_lookup.classList
										.contains("btn")) {
										if (input_element_lookup
											.getAttribute("name") != null) {
											if (input_element_lookup
												.getAttribute("name") == "name") {
												can_dispatch_lookup = false;
											}
										}
									}
								}
							}
						}
					}
				}
				if (element.nodeName == "INPUT") {
					if (element.type == "submit") {
						if (element.classList != null) {
							if (element.classList.contains("btn")) {
								if (element.getAttribute("name") != null) {
									if (element.getAttribute("name") == "go") {
										if (element.getAttribute("title") != null) {
											if (element.getAttribute("title") == "Go!") {
												_opkey
													.CaptureSkipedKeyword(element);
												return "SKIP_KEYWORD";
											}
										}
									}
								}
							}
						}
					}
				}

				if (element.nodeName == "A") {
					if (element.classList != null) {
						if (element.classList.contains("dataCell")) {
							if (can_dispatch_lookup == true) {
								var lookup_label = localStorage
									.getItem("CLASSIC_LOOKUP_LABEL");
								var form_name = localStorage
									.getItem("CLASSIC_LOOKUP_FORMNAME");
								var menu_item = localStorage
									.getItem("CLASSIC_LOOKUP_MENUITEM");
								var args = {
									// FormName:form_name,
									LabelName: lookup_label,
									MenuItem: menu_item,
									TextToType: element.textContent,
									Index: _opkey.CreateTextIndex(element)
								};

								localStorage.setItem("OPKEY_QUEUE_ITEM", "")
								localStorage
									.setItem("CLASSIC_LOOKUP_LABEL", "");
								localStorage.setItem("CLASSIC_LOOKUP_FORMNAME",
									"");
								localStorage.setItem("CLASSIC_LOOKUP_MENUITEM",
									"");
								_opkey.ClearSkipedKeyword();
								return _opkey.GetKeywordWithOutObject(
									"SF_SearchAndSelect", args, "object",
									element);
							}
						}
					}
				}
			}

			if (keyword_queue.indexOf("GLOBALSEARCHANDSELECT") > -1) {
				// ////////debugger;
				if (element.nodeName == "LI") {
					if (element.getAttribute("id") != null) {
						if (element.getAttribute("id").indexOf("phSearchInput") > -1) {

							var value_to_search = localStorage
								.getItem("GLOBAL_SEARCH_VALUE");
							if (value_to_search == null) {
								value_to_search = "";
							}

							if (value_to_search == "") {
								value_to_search = element.textContent.trim();
							}
							var args = {
								"ValueToSearch": value_to_search,
								"ValueToSelect": element.textContent.trim(),
								"Index": "0"
							}
							keyword_queue = [];
							_opkey.ClearSkipedKeyword();
							//	return _opkey.GetKeywordWithOutObject(
							//	"SF_GlobalSearchAndSelect", args, "object",
							//		element);
						}
					}
				}

				if (element.nodeName == "A") {
					if (element.classList != null) {
						if (element.classList.contains("autoCompleteRowLink")) {

							var value_to_search = localStorage
								.getItem("GLOBAL_SEARCH_VALUE");
							if (value_to_search == null) {
								value_to_search = "";
							}
							if (value_to_search == "") {
								value_to_search = element.textContent.trim();
							}
							var args = {
								"ValueToSearch": value_to_search,
								"ValueToSelect": element.textContent.trim(),
								"Index": "0"
							}
							keyword_queue = [];
							_opkey.ClearSkipedKeyword();
							//	return _opkey.GetKeywordWithOutObject(
							//		"SF_GlobalSearchAndSelect", args, "object",
							//		element);

						}
					}
				}

				if (element.nodeName == "LI") {
					var anchor_element = element.getElementsByTagName("A")[0];
					if (anchor_element != null) {
						element = anchor_element;
					}

					if (element.nodeName == "A") {
						if (element.getAttribute("role") != null) {
							if (element.getAttribute("role") == "option") {
								var value_to_search = localStorage
									.getItem("GLOBAL_SEARCH_VALUE");
								if (value_to_search == null) {
									value_to_search = "";
								}

								var value_to_select = "";
								var div_elements = element
									.getElementsByTagName("DIV");
								for (var d_v_i = 0; d_v_i < div_elements.length; d_v_i++) {
									var div_element = div_elements[d_v_i];
									if (div_element.classList != null) {
										if (div_element.classList
											.contains("uiOutputRichText")) {
											value_to_select = div_element.textContent
												.trim();
											break;
										}
									}
								}
								if (value_to_search == "") {
									value_to_search = value_to_select;
								}
								var args = {
									"ValueToSearch": value_to_search,
									"ValueToSelect": value_to_select,
									"Index": "0"
								}
								keyword_queue = [];
								_opkey.ClearSkipedKeyword();
								//return _opkey.GetKeywordWithOutObject(
								//		"SF_GlobalSearchAndSelect", args,
								//		"object", element);

							}
						}
					}
				}
				if (element.nodeName == "A") {
					if (element.getAttribute("role") != null) {
						if (element.getAttribute("role") == "option") {
							var value_to_search = localStorage
								.getItem("GLOBAL_SEARCH_VALUE");
							if (value_to_search == null) {
								value_to_search = "";
							}

							var value_to_select = "";
							var div_elements = element
								.getElementsByTagName("DIV");
							for (var d_v_i = 0; d_v_i < div_elements.length; d_v_i++) {
								var div_element = div_elements[d_v_i];
								if (div_element.classList != null) {
									if (div_element.classList
										.contains("uiOutputRichText")) {
										value_to_select = div_element.textContent
											.trim();
										break;
									}
								}
							}

							if (value_to_search == "") {
								value_to_search = value_to_select;
							}
							var args = {
								"ValueToSearch": value_to_search,
								"ValueToSelect": value_to_select,
								"Index": "0"
							}
							keyword_queue = [];
							_opkey.ClearSkipedKeyword();
							//return _opkey.GetKeywordWithOutObject(
							//		"SF_GlobalSearchAndSelect", args, "object",
							//		element);

						}
					}
				}
			}

			// all conditions need to be added before this
			try {
				var temp_element = element;
				var find_element = element;
				var table_element = null;
				var tr_element = null;
				var current_td_element = null;
				var head_tr_element = null;
				while (find_element.parentNode != null) {
					if (find_element.nodeName == "TABLE") {
						table_element = find_element;
						break;
					}
					find_element = find_element.parentNode;
				}

				if (temp_element.nodeName == "TD"
					|| temp_element.nodeName == "TH") {
					current_td_element = temp_element;
				}
				if (current_td_element == null) {
					find_element = element;
					while (find_element.parentNode != null) {
						if (find_element.nodeName.length == 2) {
							if (find_element.nodeName.indexOf("T") == 0) {
								current_td_element = find_element;
								// console.log("CURRENT TD TEXT
								// "+current_td_element.textContent);
								break;
							}
						}
						find_element = find_element.parentNode;
					}
				}

				find_element = element;
				while (find_element.parentNode != null) {
					if (find_element.nodeName == "TR") {
						tr_element = find_element;
						break;
					}
					find_element = find_element.parentNode;
				}
				// ////////debugger;
				if (table_element != null) {
					var head_element = table_element
						.getElementsByTagName("THEAD")[0];
					if (head_element != null) {
						var tr_element_1 = head_element
							.getElementsByTagName("TR")[0];
						if (tr_element_1 != null) {
							head_tr_element = tr_element_1;
						}
					} else {
						var tbody_element = table_element
							.getElementsByTagName("TBODY")[0];
						if (tbody_element != null) {
							var tr_element_2 = tbody_element
								.getElementsByTagName("TR")[0];
							if (tr_element_2 != null) {
								head_tr_element = tr_element_2;
							}

						}
					}
				}
				if (tr_element != null) {
					if (current_td_element != null) {
						if (head_tr_element != null) {
							var headers_array = [];
							var columns_array = [];
							var th_elements = head_tr_element.childNodes;
							for (var th_i = 0; th_i < th_elements.length; th_i++) {
								var th_element = th_elements[th_i];
								if (th_element.nodeName.length == 2) {
									if (th_element.nodeName.indexOf("T") == 0) {
										if (th_element.nodeName != "TR") {
											var elements_of_header = th_element
												.getElementsByTagName("*");
											if (elements_of_header.length > 0) {
												for (var e_f_h = 0; e_f_h < elements_of_header.length; e_f_h++) {
													var element_of_header = elements_of_header[e_f_h];
													if (element_of_header
														.getAttribute("title") != null) {
														headers_array
															.push(element_of_header
																.getAttribute("title"));
														break;
													}
												}
											} else {
												headers_array
													.push(th_element.textContent
														.trim());
											}
										}
									}
								}
							}

							var td_elements = tr_element.childNodes;
							for (var td_i = 0; td_i < td_elements.length; td_i++) {
								var td_element = td_elements[td_i];
								if (td_element.nodeName.length == 2) {
									if (td_element.nodeName.indexOf("T") == 0) {
										if (td_element.nodeName != "TR") {
											var is_text_content_found = false;
											var elements_of_column = td_element
												.getElementsByTagName("*");
											if (elements_of_column.length > 0) {
												var is_text_found = false;
												for (var e_f_c = 0; e_f_c < elements_of_column.length; e_f_c++) {
													var element_of_column = elements_of_column[e_f_c];
													if (element_of_column.classList != null) {
														if (element_of_column.classList
															.contains("slds-truncate")) {
															if (element_of_column
																.getAttribute("title") != null) {
																is_text_content_found = true;
																columns_array
																	.push(element_of_column
																		.getAttribute("title"));
																break;
															} else {
																is_text_content_found = true;
																columns_array
																	.push(element_of_column.textContent
																		.trim());
																break;
															}
														}
													}
												}
											} else {
												// ////////debugger;
												columns_array
													.push(td_element.textContent
														.trim());
											}

											if (is_text_content_found == false) {
												// ////////debugger;
												columns_array
													.push(td_element.textContent
														.trim());
											}
										}
									}
								}
							}

							var current_td_text = "";
							var elements_of_current_td_element = current_td_element
								.getElementsByTagName("*");
							if (elements_of_current_td_element.length > 0) {
								for (var e_f_h_e = 0; e_f_h_e < elements_of_current_td_element.length; e_f_h_e++) {
									var element_of_current_td_element = elements_of_current_td_element[e_f_h_e];
									if (element_of_current_td_element
										.getAttribute("title") != null) {
										if (element_of_current_td_element
											.getAttribute("title") != "") {
											current_td_text = element_of_current_td_element
												.getAttribute("title");
											break;
										}
									}
								}
							} else {
								current_td_text = current_td_element.textContent
									.trim();
							}

							var temp_columns_array = columns_array.slice(0);
							var temp_headers_array = headers_array.slice(0);
							var current_td_index = temp_columns_array
								.indexOf(current_td_text);
							var current_column_name = headers_array[current_td_index];
							if (current_td_index != -1) {
								temp_columns_array.splice(current_td_index, 1);
								temp_headers_array.splice(current_td_index, 1);
							}

							var selected_table_name = "";
							var table_name_parents_h2 = document
								.getElementsByTagName("H1");
							// ////////debugger;
							for (var t_n_p_i = 0; t_n_p_i < table_name_parents_h2.length; t_n_p_i++) {
								var table_name_parent_h2 = table_name_parents_h2[t_n_p_i];
								if (table_name_parent_h2.classList != null) {
									if (table_name_parent_h2.classList
										.contains("slds-page-header__title")) {
										var childs_of_table = table_name_parent_h2
											.getElementsByTagName("*");
										for (var c_o_t = 0; c_o_t < childs_of_table.length; c_o_t++) {
											var child_of_table = childs_of_table[c_o_t];
											if (child_of_table.nodeName == "SPAN") {
												if (child_of_table.classList != null) {
													if (child_of_table.classList
														.contains("selectedListView")) {
														selected_table_name = child_of_table.textContent
															.trim();
														break;
													}
												}
											}
										}
									}
								}
							}

							if (selected_table_name == "") {
								var select_element = document
									.getElementById("fcf");
								if (select_element != null) {
									if (select_element.getAttribute("name") != null) {
										if (select_element.getAttribute("name") == "fcf") {
											selected_table_name = select_element.options[select_element.selectedIndex].textContent
												.trim();
										}
									}
								}
							}
							var args = {
								"TableName": selected_table_name,
								"columnName": current_column_name,
								"ObjectIndex": "0",
							};

							var headers_objects_value = [];
							for (var hr_i = 0; hr_i < temp_headers_array.length; hr_i++) {
								var header_name = temp_headers_array[hr_i];
								var column_name = temp_columns_array[hr_i];
								var object_1 = new Object();
								object_1["Header"] = header_name;
								object_1["Value"] = column_name;
								headers_objects_value.push(object_1);
							}

							var header_index = 1;
							for (var h_v_o = 0; h_v_o < headers_objects_value.length; h_v_o++) {
								var h_c_object = headers_objects_value[h_v_o];
								if (h_c_object["Value"] != "") {
									args["Header" + header_index] = h_c_object["Header"];
									args["Value" + header_index] = h_c_object["Value"];
									header_index++;
								}
							}

							// console.log("**TR element
							// "+JSON.stringify(temp_headers_array));
							// console.log("**TD element
							// "+JSON.stringify(temp_columns_array));
							// console.log("Head Tr ELEMENTS
							// "+head_tr_element.textContent);

							// by query to be implemented

							// return _opkey.GetKeywordWithOutObject("
							// SF_ClickInTableCellUsingText",args,"object",element);
						}
					}
				}
			} catch (e) {
			}

			if (element.nodeName == "IMG") {
				// //////debugger;
				if (element.classList != null) {
					if (element.classList.contains("picklistArrowRight")
						|| element.classList.contains("picklistArrowLeft")
						|| element.classList.contains("rightArrowIcon")
						|| element.classList.contains("leftArrowIcon")) {
						var recorded_select = localStorage
							.getItem("OPKEY_QUEUE_KEYWORD");
						if (recorded_select != null) {
							var parsed_json = JSON.parse(recorded_select);
							if (element.classList.contains("picklistArrowLeft")
								|| element.classList
									.contains("leftArrowIcon")) {
								parsed_json["action"] = "SF_DeselectDataFromPickList";
								return parsed_json;
							}
							return parsed_json;
						}
					}
				}
			}

			if (element.nodeName == "A") {
				if (element.parentNode.nodeName == "SPAN") {
					if (element.parentNode.classList != null) {
						if (element.parentNode.classList.contains("dateFormat")) {
							if (element.getAttribute("onclick") != null) {
								var st1_string = "getElementByIdCS";
								var st2_string = ";if (inputField";
								var onlclick_attribute = element
									.getAttribute("onclick");
								var index_of_getelementbycsid = onlclick_attribute
									.indexOf("getElementByIdCS")
									+ st1_string.length;
								var index_of_end = onlclick_attribute
									.indexOf(";if (inputField");
								var datettime_id = onlclick_attribute
									.substr(index_of_getelementbycsid,
										index_of_end);
								datettime_id = datettime_id.replace(
									";if (inputField", "");
								datettime_id = datettime_id.replace("(", "");
								datettime_id = datettime_id.replace(")", "");
								datettime_id = datettime_id.replace("\"", "");
								datettime_id = datettime_id.replace("\"", "");
								datettime_id = datettime_id.split("&&");
								datettime_id = datettime_id[0].trim();
								datettime_id = datettime_id.replace("'", "");
								datettime_id = datettime_id.replace("'", "");
								var time_input_element = document
									.getElementById(datettime_id);
								var date_id = datettime_id.replace("_time", "");
								var date_input_element = document
									.getElementById(date_id);

								var label_content = _opkey
									.GetLabelComponent(date_input_element);
								var args = {
									"Label": label_content,
									"Index": "0",
									"Value": date_input_element.value + " "
										+ element.textContent.trim()
								};
								// return
								// _opkey.GetKeywordWithOutObject("SF_SetDateTime",args,"object",element);

							}
						}
					}
				}
			}

			if (element.nodeName == "A") {
				if (element.classList != null) {
					if (element.classList.contains("cke_button")) {
						return null;
					}
				}
				var temp_element = element;
				while (temp_element.parentNode != null) {
					if (temp_element.nodeName == "DIV") {
						if (temp_element.classList != null) {
							if (temp_element.classList.contains("customPanel")) {
								return null;
							}

							if (temp_element.classList
								.contains("publishercontainer")) {
								// //////debugger;
								if (_opkey.sales_auth_acquired) {
									if (opkey_datetime_required) {
										return null;
									}

									if (element.getAttribute("title") == null) {
										return null;
									}

									var args = {
										"ActionName": element
											.getAttribute("title")
									};
									return _opkey.GetKeywordWithOutObject(
										"SF_ClickOnQuickAction", args,
										"object", element);
								}
							}
						}
					}
					temp_element = temp_element.parentNode;
				}
			}

			if (element.nodeName == "IMG") {
				if (element.parentNode.nodeName == "A") {

					var temp_element = element.parentNode;
					if (temp_element.classList != null) {
						if (temp_element.classList.contains("cke_button")) {
							return null;
						}
					}
					while (temp_element.parentNode != null) {
						if (temp_element.nodeName == "DIV") {
							if (temp_element.classList != null) {
								if (temp_element.classList
									.contains("publishercontainer")) {
									// //////debugger
									if (_opkey.sales_auth_acquired) {
										if (opkey_datetime_required) {
											return null;
										}
										if (element.parentNode
											.getAttribute("title") == null) {
											return null;
										}
										var args = {
											"ActionName": element.parentNode
												.getAttribute("title")
										};
										return _opkey.GetKeywordWithOutObject(
											"SF_ClickOnQuickAction", args,
											"object", element);
									}
								}
							}
						}
						temp_element = temp_element.parentNode;
					}
				}
			}

			if (element.nodeName == "A") {
				if (element.classList != null) {
					if (element.classList.contains("cke_button")) {
						return null;
					}
				}

				if (element.classList != null) {
					if (element.classList.contains("forceActionLink")) {
						var primaryfieldrow_found = false;
						var parent_div = element;
						while (parent_div.parentNode != null) {
							if (parent_div.nodeName == "DIV") {
								if (parent_div.classList != null) {
									if (parent_div.classList
										.contains("primaryFieldRow")) {
										primaryfieldrow_found = true;
										break;
									}
								}
							}
							parent_div = parent_div.parentNode;
						}

						if (primaryfieldrow_found == true) {
							// //////debugger
							if (_opkey.sales_auth_acquired) {
								if (opkey_datetime_required) {
									return null;
								}

								if (element.getAttribute("title") == null) {
									return null;
								}

								var args = {
									"ActionName": element
										.getAttribute("title")
								};
								return _opkey.GetKeywordWithOutObject(
									"SF_ClickOnQuickAction", args,
									"object", element);
							}

						}
					}
				}

				if (keyword_queue.indexOf("CLICKONQUICKACTIOON") > -1) {
					if (element.getAttribute("role") != null) {
						if (element.getAttribute("role") == "menuitem") {
							var first_div = element.getElementsByTagName("DIV")[0];
							if (first_div != null) {
								if (first_div.classList != null) {
									if (first_div.classList
										.contains("forceActionLink")) {
										// //////debugger
										if (_opkey.sales_auth_acquired) {
											if (opkey_datetime_required) {
												return null;
											}
											keyword_queue = [];
											if (first_div.getAttribute("title") == null) {
												return null;
											}

											var args = {
												"ActionName": first_div
													.getAttribute("title")
											};
											return _opkey
												.GetKeywordWithOutObject(
													"SF_ClickOnQuickAction",
													args, "object",
													element);
										}
									}
								}
							}
						}
					}
				}

				if (element.classList != null) {
					if (element.classList.contains("tabHeader")) {
						if (element.getAttribute("role") != null) {
							if (element.getAttribute("role") == "tab") {
								if (element.parentNode != null) {
									if (element.parentNode.nodeName == "LI") {
										if (element.parentNode.classList != null) {
											if (element.parentNode.classList
												.contains("uiTabItem")) {
												// //////debugger
												if (_opkey.sales_auth_acquired) {
													if (opkey_datetime_required) {
														return null;
													}

													if (element
														.getAttribute("title") == null) {
														return null;
													}

													var args = {
														"ActionName": element
															.getAttribute("title")
													};
													return _opkey
														.GetKeywordWithOutObject(
															"SF_ClickOnQuickAction",
															args,
															"object",
															element);

												}

											}
										}
									}
								}
							}
						}
					}
				}
			}

			if (element.nodeName == "INPUT") {
				if (element.type != null) {
					if (element.type == "button") {
						var parent_td = element.parentNode;
						if (parent_td != null) {
							if (parent_td.nodeName == "TD") {
								if (parent_td.classList != null) {
									if (parent_td.classList
										.contains("pbButton")
										|| parent_td.classList
											.contains("pbButtonb")) {
										var previous_td = parent_td.previousSibling;
										if (previous_td != null) {
											if (previous_td.nodeName == "TD") {
												if (previous_td.classList != null) {
													if (previous_td.classList
														.contains("pbTitle")) {
														var noStandardTab_v = false;
														var temp_p_1 = element;
														while (temp_p_1.parentNode != null) {
															if (temp_p_1.nodeName == "DIV") {
																if (temp_p_1.classList != null) {
																	if (temp_p_1.classList
																		.contains("noStandardTab")) {
																		noStandardTab_v = true;
																		break;
																	}

																	if (temp_p_1.classList
																		.contains("listRelatedObject")) {
																		noStandardTab_v = true;
																		break;
																	}
																}
															}
															temp_p_1 = temp_p_1.parentNode;
														}

														var node_applicable = false;
														var c_element = element.parentNode;
														if (c_element != null) {
															var input_nodelist = c_element
																.getElementsByTagName("INPUT");
															if (input_nodelist.length > 2) {
																node_applicable = true;
															}
														}

														if (noStandardTab_v == false) {
															if (node_applicable == true) {
																// //////debugger
																if (_opkey.sales_auth_acquired) {
																	if (opkey_datetime_required) {
																		return null;
																	}

																	var _val = element
																		.getAttribute("title")
																	if (_val == null) {
																		return null;
																	}
																	var args = {
																		"ActionName": _val
																	};
																	return _opkey
																		.GetKeywordWithOutObject(
																			"SF_ClickOnQuickAction",
																			args,
																			"object",
																			element);
																}
															}

														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}

			if (element.nodeName == "A") {
				var header_title = "";
				if (element.classList != null) {
					if (element.classList.contains("actionLink")
						|| element.classList.contains("delLink")
						|| element.classList.contains("editLink")
						|| element.classList.contains("clsLink")) {
						var related_list_found = false;
						var parent_element = element;
						while (parent_element.parentNode != null) {
							if (parent_element.nodeName == "DIV") {
								if (parent_element.classList != null) {
									if (parent_element.classList
										.contains("bRelatedList")
										|| parent_element.classList
											.contains("listRelatedObject")
										|| parent_element.classList
											.contains("noStandardTab")) {
										var h3_element = parent_element
											.getElementsByTagName("H3")[0];
										if (h3_element == null) {
											h3_element = parent_element
												.getElementsByTagName("H2")[0];
										}
										if (h3_element != null) {
											header_title = h3_element.textContent;
										}
										related_list_found = true;
										break;
									}

									var class_found = false;
									var class_list = parent_element.classList;
									for (var _c_l = 0; _c_l < class_list.length; _c_l++) {
										var _class_name = class_list[_c_l];
										if (_class_name.indexOf("Custom") > -1) {
											if (_class_name.indexOf("Block") > -1) {
												var h3_element = parent_element
													.getElementsByTagName("H3")[0];
												if (h3_element == null) {
													h3_element = parent_element
														.getElementsByTagName("H2")[0];
												}
												if (h3_element != null) {
													header_title = h3_element.textContent;
												}
												related_list_found = true;
												break;
											}
										}
									}
								}
							}
							parent_element = parent_element.parentNode;
						}

						if (related_list_found) {
							var table_element = element;
							var headers_array = [];
							var values_array = [];
							var record_id = "";
							while (table_element.parentNode != null) {
								if (table_element.nodeName == "TABLE") {
									var first_row = table_element
										.getElementsByTagName("TR")[0];
									if (first_row != null) {
										var th_nodes = first_row
											.getElementsByTagName("TH");
										for (var th_i = 0; th_i < th_nodes.length; th_i++) {
											var th_node = th_nodes[th_i];
											if (th_node.classList != null) {
												if (!th_node.classList
													.contains("actionColumn")) {
													headers_array
														.push(th_node.textContent);
												}
											}
										}
										break;
									}
								}
								table_element = table_element.parentNode;
							}

							var current_row = element;
							while (current_row.parentNode != null) {
								if (current_row.nodeName == "TR") {
									var td_nodes = current_row.childNodes;
									for (var td_n = 0; td_n < td_nodes.length; td_n++) {
										var td_node = td_nodes[td_n];
										if (td_node.nodeName.length == 2) {
											if (td_node.nodeName.indexOf("T") == 0) {
												if (td_node.classList != null) {
													if (!td_node.classList
														.contains("actionColumn")) {
														if (td_n == 1) {
															var record_id_element = td_node
																.getElementsByTagName("A")[0];
															if (record_id_element != null) {
																var _record_id = record_id_element
																	.getAttribute("href");
																if (_record_id != null) {
																	record_id = _record_id
																		.replace(
																			"/",
																			"");
																}
															}
														}
														values_array
															.push(td_node.textContent);
													}
												}
											}
										}
									}
									break;
								}
								current_row = current_row.parentNode;
							}

							var args = {
								"RelatedListTitle": header_title,
								"Action": element.textContent,
								"RecordId": record_id
							};
							var inc_counter = 1;
							for (var v_a_i = 0; v_a_i < values_array.length; v_a_i++) {
								var _value = values_array[v_a_i];
								if (_value != "") {
									var _header = headers_array[v_a_i];
									args["Identifier" + inc_counter] = _header;
									args["Value" + inc_counter] = _value;
									inc_counter++;
								}
							}
							_opkey.ClearSkipedKeyword();
							return _opkey.GetKeywordWithOutObject(
								"SF_PerformActionInRelatedList", args,
								"object", element);

						}
					}
				}
			}

			if (element.nodeName == "A") {
				if (element.classList != null) {
					// //////debugger;
					if (element.getAttribute("aria-haspopup") != null) {
						if (element.getAttribute("aria-haspopup") == "true") {
							if (element.getAttribute("role") != null) {
								if (element.getAttribute("role") == "button") {

									if (opkey_datetime_required) {
										return null;
									}
									var current_row = null;
									var is_table_found = true;
									var table_element = element;
									var element_p_0 = element;
									var should_exit = false;
									while (table_element.parentNode != null) {

										if (table_element.nodeName == "TR") {
											var record_id = "";
											var table_script = _opkey
												.GetTableKeyword(element);
											var anchor_tags = table_element
												.getElementsByTagName("A");
											for (var _a_i = 0; _a_i < anchor_tags.length; _a_i++) {
												var anchor_tag = anchor_tags[_a_i];
												if (anchor_tag
													.getAttribute("data-recordid") != null) {
													record_id = anchor_tag
														.getAttribute("data-recordid");
													break;
												}
											}
											table_script.arguments[0]["RecordID"] = record_id;
											current_table_data = table_script;
										}
										if (table_element.nodeName == "DIV") {
											if (table_element.classList != null) {
												if (table_element.classList
													.contains("forceVirtualActionMarker")) {
													should_exit = true;
												}
											}
										}
										table_element = table_element.parentNode;
									}

									if (should_exit) {
										_opkey.CaptureSkipedKeyword(element);
										return "SKIP_KEYWORD";
									}

								}
							}
						}
					}
				}
			}

			if (element.nodeName == "A") {
				var _headers_array = [];
				var _values_array = [];
				var _record_id = "";

				if (element.getAttribute("role") != null) {
					if (element.getAttribute("role") == "menuitem") {
						if (current_table_data != null) {
							// //////debugger;
							if (current_table_data.arguments[0]["RecordID"] != null) {
								_record_id = current_table_data.arguments[0]["RecordID"];
							}
							var data_1 = current_table_data.arguments[1].data;
							data_1 = JSON.parse(data_1);
							for (var _key in data_1) {
								var _value = data_1[_key];
								if (_key.indexOf("Identifier") > -1) {
									_headers_array.push(_value);
								}
								if (_key.indexOf("Value") > -1) {
									_values_array.push(_value);
								}
							}
							var _list_title = "";
							var related_list_titles = document
								.getElementsByTagName("NAV");
							// //////debugger;
							for (var _n_i = 0; _n_i < related_list_titles.length; _n_i++) {
								var related_list_title = related_list_titles[_n_i];
								if (related_list_title.getAttribute("role") != null) {
									if (related_list_title.getAttribute("role") == "navigation") {
										var h1_inside_related_list = related_list_title.nextSibling;
										if (h1_inside_related_list != null) {
											if (h1_inside_related_list.nodeName == "H1") {
												if (h1_inside_related_list != null) {
													if (h1_inside_related_list
														.getAttribute("title") != null) {
														if (_opkey
															.IsElementVisible(h1_inside_related_list)) {
															_list_title = h1_inside_related_list
																.getAttribute("title");
															break;
														}
													}
												}
											}
										}
									}
								}
							}

							if (current_table_data == null) {
								_opkey.DispatchedSkipedKeyword();
								return null;
							}
							if (_list_title == "") {
								_opkey.DispatchedSkipedKeyword();
								return null;
							}
							var args = {
								"RelatedListTitle": _list_title,
								"Action": element.getAttribute("title"),
								"RecordId": _record_id
							};
							var inc_counter_0 = 1;
							for (var _v_a_i = 0; _v_a_i < _values_array.length; _v_a_i++) {
								var _value = _values_array[_v_a_i];
								if (_value != "") {
									var _header = _headers_array[_v_a_i];
									args["Identifier" + inc_counter_0] = _header;
									args["Value" + inc_counter_0] = _value;
									inc_counter_0++;
								}
							}
							_opkey.ClearSkipedKeyword();
							return _opkey.GetKeywordWithOutObject(
								"SF_PerformActionInRelatedList", args,
								"object", element);
						}
					}
				}
			}

			if (element.nodeName == "INPUT") {
				if (element.type != null) {
					if (element.type == "button" || element.type == "submit") {
						var related_list_found = false;
						var parent_element = element;
						while (parent_element.parentNode != null) {
							if (parent_element.nodeName == "DIV") {
								if (parent_element.classList != null) {
									// //////debugger;
									if (parent_element.classList
										.contains("bRelatedList")
										|| parent_element.classList
											.contains("listRelatedObject")
										|| parent_element.classList
											.contains("noStandardTab")) {
										related_list_found = true;
										break;
									}

									var class_found = false;
									var class_list = parent_element.classList;
									for (var _c_l = 0; _c_l < class_list.length; _c_l++) {
										var _class_name = class_list[_c_l];
										if (_class_name.indexOf("Custom") > -1) {
											if (_class_name.indexOf("Block") > -1) {
												// console.log("Class found");
												related_list_found = true;
												break;
											}
										}
									}
								}
							}
							parent_element = parent_element.parentNode;
						}

						if (related_list_found) {
							var tr_element = element;
							while (tr_element.parentNode != null) {
								if (tr_element.nodeName == "TR") {
									var h3_element = tr_element
										.getElementsByTagName("H3")[0];
									if (h3_element == null) {
										h3_element = tr_element
											.getElementsByTagName("H2")[0];
									}
									if (h3_element != null) {
										// console.log("h3 found");
										var related_title = h3_element.textContent;
										var args = {
											"RelatedListTitle": related_title,
											"ButtonText": element.value
										};
										if (opkey_datetime_required == true) {
											// console.log("Sending data");
											return _opkey
												.GetKeywordWithOutObject(
													"SF_ClickButtonInRelatedList",
													args, "object",
													element);
										}
									}
								}
								tr_element = tr_element.parentNode;
							}
						}
					}
				}
			}

			if (element.nodeName == "A") {
				if (element.classList != null) {
					if (element.classList.contains("forceActionLink")) {
						var parent_element = element;
						var related_list_found = false;
						var header_text = "";
						while (parent_element.parentNode != null) {
							if (parent_element.nodeName == "ARTICLE") {
								if (parent_element.classList != null) {
									if (parent_element.classList
										.contains("forceRelatedListCardDesktop")) {
										related_list_found = true;
										var h2_related = parent_element
											.getElementsByTagName("H2")[0];
										if (h2_related != null) {
											var span_related = h2_related
												.getElementsByTagName("SPAN")[0];
											if (span_related != null) {
												if (span_related
													.getAttribute("title") != null) {
													header_text = span_related
														.getAttribute("title");
												}
											}
										}
										break;
									}
								}
							}
							parent_element = parent_element.parentNode;
						}
						if (related_list_found) {
							var args = {
								"RelatedListTitle": header_text,
								"ButtonText": element.textContent
							};
							if (opkey_datetime_required == true) {
								return _opkey.GetKeywordWithOutObject(
									"SF_ClickButtonInRelatedList", args,
									"object", element);
							}
						}
					}
				}
			}
			if (element.nodeName == "A") {
				var span_elements = element.getElementsByTagName("SPAN");
				for (var _s_i = 0; _s_i < span_elements.length; _s_i++) {
					var span_element = span_elements[_s_i];
					if (span_element.classList != null) {
						if (span_element.classList.contains("view-all-label")) {
							_opkey.CaptureSkipedKeyword(element);
							return "SKIP_KEYWORD";
						}
					}
				}
			}

			// Rest Keywords will be implemented here

		}

		else if (action_name == "setValue" || action_name == "_setValue") {

			if (element.nodeName == "INPUT") {
				if (element.parentNode != null) {
					if (element.parentNode.classList != null) {
						if (element.parentNode.classList
							.contains("lookupInput")) {
							if (keyword_queue.indexOf("TYPEDONLOOKUPINPUT") > -1) {
								keyword_queue = [];
								return "SKIP_KEYWORD";
							}

							/*
							//Commented for Demo
							var img_label = element_properties["label:text"];
							var form_name = "";

							var img_elements = document
									.getElementsByTagName("H2");
							for (var i_e = 0; i_e < img_elements.length; i_e++) {
								var img_element = img_elements[i_e];
								if (img_element.classList != null) {
									if (img_element.classList
											.contains("pageDescription")) {
										form_name = img_element.textContent
												.trim();
									}
								}
							}

							if (form_name == "") {
								var h1_eleemnts = document
										.getElementsByTagName("H1");
								for (var h1_i = 0; h1_i < h1_eleemnts.length; h1_i++) {
									var h1_element = h1_eleemnts[h1_i];
									if (h1_element.classList != null) {
										if (h1_element.classList
												.contains("pageType")) {
											form_name = h1_element.textContent
													.trim();
										}
									}
								}
							}

							var menuitem = "";
							var p_p_node = element.parentNode.parentNode.parentNode;
							// ////////debugger;
							if (p_p_node != null) {
								var select_element = p_p_node
										.getElementsByTagName("SELECT")[0];
								if (select_element != null) {
									menuitem = select_element.options[select_element.selectedIndex].text;
								}
							}

							var args = {
								// FormName:form_name,
								LabelName : img_label,
								MenuItem : menuitem,
								TextToType : data_value,
								Index : 0
							};
							// commented for typetext and tab
							_opkey.ClearSkipedKeyword();
							return _opkey.GetKeywordWithOutObject(
									"SF_SearchAndSelect", args, "object",
									element);
						*/
						}
					}
				}
			}

			if (element.nodeName == "INPUT") {
				if (element.parentNode != null) {
					if (element.parentNode.nodeName == "SPAN") {
						if (element.parentNode.classList != null) {
							if (element.parentNode.classList
								.contains("dateOnlyInput")
								|| element.parentNode.classList
									.contains("dateInput")) {
								var label_datetime = "";
								if (label_datetime == "") {
									var temp_element_2 = element;
									while (temp_element_2.parentNode != null) {
										if (temp_element_2.nodeName == "FIELDSET") {
											var label_temp_element = temp_element_2.childNodes[0];
											if (label_temp_element != null) {
												if (label_temp_element.nodeName == "LEGEND") {
													label_datetime = label_temp_element.childNodes[0].textContent;
												}
											}
										}
										temp_element_2 = temp_element_2.parentNode;
									}
								}

								if (label_datetime == "") {
									element_properties["label:text"]
								}
								var splited_text_content = data_value
									.split(" ");
								if (splited_text_content.length > 1) {
									var args = {
										"Label": label_datetime,
										"Index": "0",
										"Value": data_value
									};
									if (opkey_datetime_required == true) {
										return _opkey.GetKeywordWithOutObject(
											"SF_SetDateTime", args,
											"object", element);
									}
								}

								var args = {
									"DateEvent": element_properties["label:text"],
									"Index": "0",
									"Date(MM/DD/YYYY)": data_value
								};
								if (opkey_datetime_required == true) {
									return _opkey.GetKeywordWithOutObject(
										"SF_SetDate", args, "object",
										element);
								}
							}
						}
					}
				}
			}
			if (element.nodeName == "INPUT") {
				if (element.getAttribute("id") != null) {
					if (element.getAttribute("id") == "lksrch") {
						if (element.getAttribute("placeholder") != null) {
							if (element.getAttribute("placeholder").indexOf(
								"Search") == 0) {
								var lookup_label = localStorage
									.getItem("CLASSIC_LOOKUP_LABEL");
								var form_name = localStorage
									.getItem("CLASSIC_LOOKUP_FORMNAME");
								var menu_item = localStorage
									.getItem("CLASSIC_LOOKUP_MENUITEM");
								var args = {
									// FormName:form_name,
									LabelName: lookup_label,
									MenuItem: menu_item,
									TextToType: data_value,
									Index: "0"
								};

								// localStorage.setItem("OPKEY_QUEUE_ITEM","")
								// localStorage.setItem("CLASSIC_LOOKUP_LABEL","");
								// localStorage.setItem("CLASSIC_LOOKUP_FORMNAME","");
								// localStorage.setItem("CLASSIC_LOOKUP_MENUITEM","");
								_opkey.ClearSkipedKeyword();
								return "SKIP_KEYWORD";
								// return
								// _opkey.GetKeywordWithOutObject("SF_SearchAndSelect",args,"object",element);
							}
						}
					}
				}
			}
			if (element.nodeName == "INPUT") {
				debugger
			}
			if (element.nodeName == "INPUT") {
				//debugger
				var object_2 = new Object();
				object_2["MenuItem"] = "";
				if (element.classList.contains("uiInput--lookup") || element.classList.contains("slds-combobox__input")) {
					debugger;
					if (element.getAttribute("placeholder") == null) {
						return null;
					}

					if (element.getAttribute("readOnly") != null) {
						return null;
					}

					keyword_queue.push("SETLOOKUP");
					if (element.parentNode != null) {
						if (element.parentNode.parentNode != null) {
							var div_element = element.parentNode.parentNode;
							if (div_element.nodeName == "DIV") {
								var img_element = div_element
									.getElementsByTagName("IMG")[0];
								if (img_element != null) {
									var temp_img_element = img_element;
									var require_menu = false;
									while (temp_img_element.parentNode != null) {
										if (temp_img_element.nodeName == "A") {
											if (temp_img_element.classList != null) {
												if (temp_img_element.classList
													.contains("entityMenuTrigger")) {
													require_menu = true;
												}
											}
										}
										temp_img_element = temp_img_element.parentNode;
									}

									if (require_menu == true) {
										if (img_element.getAttribute("src") != null) {
											if (img_element
												.getAttribute("title") != null) {
												if (_opkey
													.IsElementVisible(img_element)) {
													object_2["MenuItem"] = img_element
														.getAttribute("title");
												} else {
													object_2["MenuItem"] = "";
												}

											} else if (img_element
												.getAttribute("alt") != null) {
												if (_opkey
													.IsElementVisible(img_element)) {
													object_2["MenuItem"] = img_element
														.getAttribute("alt");
												} else {
													object_2["MenuItem"] = "";
												}
											}
										}
									}
								}
							}
						}
					}
					if (element_properties["label:text"] != null) {
						object_2["Label"] = element_properties["label:text"];
						keyword_argument = object_2;
					}
					//_opkey.CaptureSkipedKeyword(element);
					//return "SKIP_KEYWORD"
				}
			}

			if (element.nodeName == "INPUT") {
				if (element.classList != null) {
					if (element.classList
						.contains("slds-input") && element.getAttribute("lightning-basecombobox_basecombobox") == null) {
						//if (element.getAttribute("role") != null) {
						//if (element.getAttribute("role") == "combobox") {
						if (element.placeholder != null) {
							if (element.placeholder.indexOf("Search") == 0) {
								_opkey.ClearSkipedKeyword();
								//return _opkey.GetKeywordWithOutObject(
								//		"SF_GlobalSearch", {
								//			Value : data_value
								//		}, "object", element);
							}
						}
						//}
						//}
					}

				}

				if (element.getAttribute("id") != null) {
					if (element.getAttribute("id") == "phSearchInput") {
						if (element.getAttribute("role") != null) {
							if (element.getAttribute("role") == "combobox") {
								if (element.placeholder != null) {
									if (element.placeholder.indexOf("Search") == 0) {
										_opkey.ClearSkipedKeyword();
										//	return _opkey.GetKeywordWithOutObject(
										//			"SF_GlobalSearch", {
										//				Value : data_value
										//			}, "object", element);
									}
								}
							}
						}
					}
				}
			}

			if (element.nodeName == "INPUT") {
				var temp_element = element;
				while (temp_element.parentNode != null) {
					if (temp_element.nodeName == "DIV") {
						if (temp_element.classList != null) {
							if (temp_element.classList.contains("uiInputDate")) {
								var args = {
									"DateEvent": element_properties["label:text"],
									"Index": "0",
									"Date(MM/DD/YYYY)": data_value
								};
								if (opkey_datetime_required == true) {
									return _opkey.GetKeywordWithOutObject(
										"SF_SetDate", args, "object",
										temp_element);
								}
							}
						}
					}
					temp_element = temp_element.parentNode;
				}
			}

			if (element.nodeName == "INPUT") {
				// ////////debugger;
				if (element.getAttribute("placeholder") != null) {
					if (element.getAttribute("placeholder") == "HH:MM") {
						var args = {
							"TimeEvent": element_properties["label:text"],
							"Index": "0",
							"Time(hh:mm)": data_value
						};
						if (opkey_datetime_required == true) {
							return _opkey.GetKeywordWithOutObject("SF_SetTime",
								args, "object", element);
						}
					}
				}
			}
			// typetext end area
		}
		//-----handled here ----- @Mohit for sf-launch app
		if (element.nodeName == "INPUT") {
			if (action_name == "setValue" || action_name == "_setValue" || action_name == "_click" || action_name == "click") {


				debugger;
				if (keyword_queue.length > 0) {
					if (element.parentNode.nodeName == "DIV" && element.getAttribute("type") != null && element.getAttribute("type") == "search") {
						if (element.parentNode.classList.contains("slds-form-element__control") &&
							element.parentNode.getAttribute("part") != null && element.parentNode.getAttribute("part") == "input-container") {
							keyword_queue.push("APP_LAUNCHER");
							_opkey.CaptureSkipedKeyword(element);
							return "SKIP_KEYWORD"
						}
					}
				}
			}
		}
		return _opkey.IgnoreSalesforceKeyword(element);
		// return _opkey.GetKeywordWithOutObject("Click","Hello","string");
	}

	function GetTextPropertyArray(element) {
		var textArray = [];
		try {
			var recordingmode = _opkey.GetRecordingMode();

			if (recordingmode == "ORACLE FUSION") {
				var _oraclefusion = new OracleFusion();
				_oraclefusion.GetLabelProperties(el, elementProperties);
			}

			if (recordingmode == "JDE") {
				var _jdeRecorder = new JDERecorder();
				_jdeRecorder.GetLabelProperties(el, elementProperties);
			}

			if (recordingmode == "SERVICENOW") {
				var _servicenow = new ServiceNow();
				_servicenow.GetLabelProperties(el, elementProperties);
			}


			if (recordingmode == "SAP FIORI") {
				var _oraclefusion = new SAPFIORI();
				_oraclefusion.GetLabelProperties(el, elementProperties);
			}

			if (recordingmode == "SUCCESSFACTORS") {
				var _oraclefusion = new SuccessFactors();
				_oraclefusion.GetLabelProperties(el, elementProperties);
			}
			if (recordingmode == "VEEVA VAULT") {
				var _oraclefusion = new VeevaVault();
				_oraclefusion.GetLabelProperties(el, elementProperties);
			}
			if (recordingmode == "MSDYNAMICS") {
				var _oraclefusion = new MSDynamics();
				_oraclefusion.GetLabelProperties(el, elementProperties);
			}
			if (recordingmode == "MSDynamics FSO") {
				var _oraclefusion = new MSDynamicsAX();
				_oraclefusion.GetLabelProperties(el, elementProperties);
			}
			if (recordingmode == "PEOPLESOFT") {
				var _peoplesoft = new PeopleSoft_OpKey();
				_peoplesoft.GetLabelProperties(el, elementProperties);
			}

			if (recordingmode == "SALESFORCE") {
				if (element.nodeName != "SELECT") {
					var position = Number(0);
					for (var i = 0; i < element.childNodes.length; i++) {
						var curNode = element.childNodes[i];
						if (curNode.nodeName === "#text") {
							var textObject = new Object();
							position = position + Number(1);
							var textPosition = "text#" + (position);
							textObject[textPosition] = curNode.nodeValue;
							if (curNode.nodeValue.trim() != "") {
								textArray.push(textObject);
							}
						}
					}
				}
			}
		} catch (e) {
		}
		return textArray;
	}

	var date1 = new Date();
	var timer1 = date1.getTime();
	var timertv = date1.getTime();
	var setvalueflag = false;
	Opkey.prototype.getScript = function (infoAr, el, evType, e) {
		// //console.log("Tag name "+el.nodeName)
		// ////////debugger;
		if (el.nodeName == "OPTGROUP") {
			if (el.parentNode != null) {
				if (el.parentNode.nodeName == "SELECT") {
					el = el.parentNode;
				}
			}
		}
		if (el.id.indexOf("IGNOREINOPKEYRECORDER") > -1) {
			return;
		}
		try {
			el.classList.remove("OPkeyHighlighter")
		} catch (e) {

		}
		if (!((el.nodeName == "A") || (el.nodeName == "IMG")
			|| (el.nodeName == "INPUT") || (el.nodeName == "BUTTON"))) {
			// //console.log("Running code")
			try {
				var el2 = el
				var i = 0;
				var k1 = 0;
				var runloop = true

				var child_xml_attribute = "";
				// comment from here
				try {
					if (el2.nodeName == "LABEL") {
						var siblings = el2.parentNode
							.getElementsByTagName("INPUT");
						var forattribute = null;
						try {
							forattribute = el2.getAttribute("for");
						} catch (e) {
						}
						for (var sb = 0; siblings.length; sb++) {
							var node = siblings[sb]
							if (node.nodeName == "A"
								|| node.nodeName == "INPUT"
								|| node.nodeName == "BUTTON") {
								if (forattribute != null) {

									if (node.id == forattribute) {
										if (node.nodeName == "INPUT") {
											if (node.type == "text"
												|| node.type == "search"
												|| node.type == "email"
												|| node.type == "password"
												|| node.type == "tel"
												|| node.type == "number") {
												break;
											}
										}
										var elInfo2 = this.identify(node);
										var ids2 = elInfo2.apis;
										infoAr = ids2
										el = node
										runloop = false
										break;
									}
								}
							}
						}
					}
				} catch (e) {
				}
				try {
					if (el2.parentNode != null) {
						if (el2.parentNode.nodeName == "LABEL") {
							var forattribute = null;
							try {
								forattribute = el2.getAttribute("for");
							} catch (e) {
							}
							var siblings = el2.parentNode
								.getElementsByTagName("INPUT");
							for (var sb = 0; siblings.length; sb++) {
								var node = siblings[sb]
								if (node.nodeName == "INPUT"
									|| node.nodeName == "BUTTON") {
									if (forattribute != null) {
										if (node.id == forattribute) {
											var elInfo2 = this.identify(node);
											var ids2 = elInfo2.apis;
											infoAr = ids2
											el = node
											runloop = false
											break;
										}
									}
								}
							}
						}
					}
				} catch (e) {
				}

				if (runloop) {
					try {
						if (el2.parentNode.parentNode != null) {
							if (el2.parentNode.parentNode.nodeName == "LABEL") {
								var forattribute = null;
								try {
									forattribute = el2.getAttribute("for");
								} catch (e) {
								}
								var siblings = el2.parentNode.parentNode
									.getElementsByTagName("INPUT");
								for (var sb = 0; siblings.length; sb++) {
									var node = siblings[sb]
									if (node.nodeName == "A"
										|| node.nodeName == "INPUT"
										|| node.nodeName == "BUTTON") {
										if (forattribute != null) {
											if (node.id == forattribute) {
												var elInfo2 = this
													.identify(node);
												var ids2 = elInfo2.apis;
												infoAr = ids2
												el = node
												runloop = false
												break;
											}
										}
									}
								}
							}
						}
					} catch (e) {
					}
				}
				// comment upto here
				if (runloop) {
					var _element = el2;
					if (el2.nodeName != "TABLE") {
						while (i < 10) {
							el2 = el2.parentNode
							if (el2 != null) {
								if (el2.nodeName == "A"
									|| el2.nodeName == "INPUT"
									|| el2.nodeName == "BUTTON") {
									child_xml_attribute = _opkey
										.GetPropertiesInXML(_element);
									var elInfo2 = this.identify(el2);
									var ids2 = elInfo2.apis;
									infoAr = ids2
									el = el2
									break;
								}
							} else {
								break;
							}
							i++;
						}
					} else {
						// ////debugger;
						var elInfo2 = this.identify(el2);
						var ids2 = elInfo2.apis;
						infoAr = ids2
						el = el2
					}
				}
			} catch (e) {
			}
		}

		// if(document.domain != "rediff.com" && e.type == "blur") return;
		var popupName = this.getPopupName();
		// this._debug("evType" + evType + " :el: " + el );
		var toSendAr = new Object();
		var accessorArr;
		var winArr;
		if (evType == "focusout") {
			if (el.nodeName == "INPUT") {
				this.triggerEvent(el, "change");
			} else
				return;
		}
		if (infoAr.length > 0) {
			var info = infoAr[0];
			var action = info.event.replace(/^_/, '');
			// //console.log("action:"+action);
			if (action.search("click") > -1
				|| action.search("setSelected") > -1) {
				var date2 = new Date();
				var timer2 = date2.getTime();
				if ((timer2 - timer1) < 900) {
					return;
				} else {
					timer1 = timer2
				}
			}
			if (action.search("setValue") > -1) {
				// //console.log("action:"+action);
				if (setvalueflag == true) {
					var date2 = new Date();
					var timer2 = date2.getTime();
					if ((timer2 - timertv) < 400) {
						setvalueflag = false;
						return;
					} else {
						timertv = timer2
					}

					// return;
				}
				setvalueflag = true
			} else {
				setvalueflag = false;
			}

			var value = null;
			if (action == "") {
				return;
			}
			if (action == "setValue" || action == "_setValue") {
				_opkey.textbox = null;
				_opkey.typekeysoccured = false
			} else {
				_opkey.textbox = null;
				_opkey.typekeysoccured = false
			}

			var _temp_value = "";
			if (action == "setValue" || action == "setSelected"
				|| action == "setFile") {
				var value = info.value;
				// //this._debug("info.value: " +info.value);
				if (value == null)
					value = "";
				if (value == "")
					return;
				value = value.replace(/\n+/g, "").replace(/\\/g, "&#x5c;");
				value = this.toJSON(value);
				_temp_value = value;
			}
			if (action == "setSelected" || action == "") {
				if (el.nodeName == "OPTION") {
					var tempoption = el;
					action = "setSelected"
					el = el.parentNode
					if (el.nodeName == "OPTGROUP") {
						if (el.parentNode.nodeName == "SELECT") {
							el = el.parentNode;
						}
					}
					value = tempoption.innerText
					if (value == "") {
						value = _temp_value;
					}

					var elInfo = this.identify(el);
					infoAr = elInfo.apis;
				}

				if (_opkey.GetRecordingMode() == "SALESFORCE") {
					try {
						if (el.nodeName == "SELECT") {
							var _selectedObject = el.options[el.selectedIndex].value;
							if (_selectedObject != null) {
								chrome.runtime.sendMessage({
									GetExtraMetadataOfObject: _selectedObject
								}, function (response) {
									if (chrome.runtime.lastError) { }
								});
							}
						}
					} catch (e) {
					}
				}
			}
			if (_opkey.otherselectnodefound) {
				try {
					var value = _opkey._getSelectedText(el)
						|| _opkey.getOptionId(el, el.value) || el.value;
					value = this.toJSON(value);
					_opkey.otherselectnodefound = false;
				} catch (e) {
				}
			}
			try {
				if (el.nodeName == "A") {
					if (el.target) {
						if (el.target.toLowerCase() == "_blank") {
							_opkey
								.sendToServer("/_s_/dyn/Driver_setBlankWindowsOpened");
						}
					}
				}
			} catch (e) {
			}
			var elProp = this.getAD(el);
			var elPropEnd = false;
			if (elProp.length > 0) {
				var elPropLength = elProp.length;
				for (var elPropLen = 0; elPropLen < elPropLength; elPropLen++) {
					// this._debug("22: " + elProp[elPropLen].tag + ";" +
					// elProp[elPropLen].type + ";" + e.type + ";" +
					// elProp[elPropLen].event);
					var elEvents = elProp[elPropLen].event
						.split("__xxSAHIDIVIDERxx__");
					if (!this.arrayContains(elEvents, e.type))
						continue;
					else {
						elPropEnd = true;
						var actionIndex = this.arrayIndexOf(elEvents, e.type);
						var actionEvents = elProp[0].action
							.split("__xxSAHIDIVIDERxx__");
						action = actionEvents[actionIndex];
						if (elProp[elPropLen].tag == "DIV") {
							value = el.innerText;
						}
					}
					if (elPropEnd == true)
						break;
				}
			}

			if (elPropEnd == false) {

				var elPropparent = this.getAD(el.parentNode);
				if (elPropparent.length > 0) {
					var elPropparentLength = elPropparent.length;

					for (var elPropparentLen = 0; elPropparentLen < elPropparentLength; elPropparentLen++) {
						// this._debug("22: " + elProp[elPropLen].tag + ";" +
						// elProp[elPropLen].type + ";" + e.type + ";" +
						// elProp[elPropLen].event);
						var elEvents = elPropparent[elPropparentLen].event
							.split("__xxSAHIDIVIDERxx__");
						if (!this.arrayContains(elEvents, e.type))
							continue;
						else {
							elPropEnd = true;
							var actionIndex = this.arrayIndexOf(elEvents,
								e.type);
							var actionEvents = elProp[0].action
								.split("__xxSAHIDIVIDERxx__");
							action = actionEvents[actionIndex];
							if (elPropparent[elPropparentLen].tag == "DIV") {
								value = el.innerText;
							}
						}
						if (elPropEnd == true)
							break;
					}
				}
			}

			if (el.nodeName == "SELECT" && el.type == "select-multiple") {
				toSendAr["action"] = "SelectMultipleDropDownItem";
			} else if (el.nodeName == "INPUT" && el.type == "password") {
				toSendAr["action"] = "TypeSecureText";
			} else {
				toSendAr["action"] = action;
			}
			var valueofelement = this.escapeNullValue(value).replace(/\"/g, '')
				.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;')
			if (valueofelement == _opkey.textboxtext) {
				return;
			}

			if (el.nodeName == "HTML") {
				if (toSendAr["action"] == "setSelected") {
					toSendAr["action"] = "click";
					valueofelement = "";
				}
			}
			var dataArguments = {
				"type": "string",
				// "data" : this.escapeNullValue(value).replace(/\"/g,
				// '').replace(/[\[\]]+/g,'')
				"data": valueofelement
				// "data" : this.escapeNullValue(value).replace(/\"/g, '')
				// "data" : encodeURIComponent(this.escapeNullValue(value))
			}
			// toSendAr["popupName"] = popupName.replace(/\"/g, "&quote;");

			var elementProperties = new Object();

			var previousAccessorType = [];
			var visitedAccessorType = 0;
			try {
				var positionInfo = el.getBoundingClientRect();
				var height = positionInfo.height;
				var width = positionInfo.width;
			} catch (e) {

			}
			this.getStepObj("", "ObjectImage", elementProperties);
			try {
				var text_c_array = GetTextPropertyArray(el);
				for (var t_c_i = 0; t_c_i < text_c_array.length; t_c_i++) {
					var text_c_object = text_c_array[t_c_i];
					for (var _key in text_c_object) {
						var attr_key = _key;
						var attr_value = text_c_object[attr_key];
						elementProperties[attr_key] = attr_value;
					}
				}
			} catch (e) {
			}

			if (child_xml_attribute != "") {
				elementProperties["custom:childXml"] = child_xml_attribute;
			}

			if (el.getAttribute("href") != null) {
				elementProperties["href"] = el.getAttribute("href");
			}

			if (el.getAttribute("title") != null) {
				elementProperties["alt"] = el.getAttribute("title").replace(/\"/g, "&#x0022;");
			}

			if (el.getAttribute("alt") != null) {
				elementProperties["alt"] = el.getAttribute("alt").replace(/\"/g, "&#x0022;");
			}

			if (el.getAttribute("contenteditable") != null) {
				elementProperties["contenteditable"] = el
					.getAttribute("contenteditable");
			}

			if (el.innerText != null) {
				if (el.innerText != "") {
					if (el.textContent != null) {
						if (el.textContent != "") {
							var text_content = el.textContent;
							if (text_content.length > 250) {
								text_content = text_content.substring(0, 249);
							}
							this.getStepObj(text_content, "textContent",
								elementProperties);
						}
					}
				}
			}
			for (var i = 0; i < infoAr.length; i++) {
				try {
					var info = infoAr[i];
					// ////console.log(info);
					var accessor = this.escapeDollar(this.getAccessor1(info));
					var accessorType = this.getAccessorType(info);
					/*
					 * //this._debug("accessorType: " + accessorType);
					 * //this._debug("type: "+ typeof accessorType + "; "+
					 * previousAccessorType.length);
					 */
					for (var j = 0; j < previousAccessorType.length; j++) {
						if (previousAccessorType[j] == accessorType)
							visitedAccessorType = 1;
					}

					// //this._debug("Accessor Type: " + accessorType + ";
					// Accessor:" + accessor);
					if (visitedAccessorType != 1) {
						this.getStepObj(el.innerText.replace(/^\s+|\s+$/g, ''),
							"sahiText", elementProperties);
						this.getStepObj(accessor, accessorType,
							elementProperties);
						previousAccessorType.push(accessorType);
						// //this._debug("recorded: " + accessorType+ ";
						// Accessor:" + accessor);
						visitedAccessorType = 0;
					} else
						visitedAccessorType = 0;

					// added by ganesh adding value in element properties
					if (i == 0) {
						var value = info.value;
						this.getStepObj(value, "value", elementProperties);
					}

					// end
				} catch (e) {
				}
			}

			var checkstatus = ""
			this.getStepObj(el.tagName, "tag", elementProperties);
			if (el.type == "checkbox") {
				if (checkstatus == "") {
					checkstatus = "" + el.checked
				}
				this.getStepObj(checkstatus, "checked", elementProperties);
			}
			if (el.nodeName == "SELECT") {
				try {
					if (elementProperties["sahiText"]) {
						elementProperties["sahiText"] = "";
					}
					if (elementProperties["value"]) {
						elementProperties["value"] = "";
					}
					if (elementProperties["textContent"]) {
						elementProperties["textContent"] = "";
					}
				} catch (e) {
				}
			}
			var logicalname = el.nodeName;
			try {
				logicalname = _opkey.getLogicalNameOfObject(el,
					elementProperties["sahiText"])
				if (typeof logicalname === "object") {
					logicalname = el.nodeName
				}
			} catch (e) {
			}
			if (logicalname.length > 25) {
				logicalname = logicalname.substring(0, 25);
			}
			this.getStepObj(logicalname, "logicalname", elementProperties);
			if (el.nodeName == "TD") {
				this.getStepObj("\"" + el.cellIndex + "\"", "column",
					elementProperties);
				if (el.parentNode.nodeName == "TR") {
					this.getStepObj("\"" + el.parentNode.rowIndex + "\"",
						"row", elementProperties);
				}
			}
			if (typeof el.type != "undefined")
				this.getStepObj(el.type, "type", elementProperties);
			// Selenium accessors start
			var locators = this.getSeleniumAccessors(el);
			for (var i = 0; i < locators.length; i++) {
				try {
					// toSendAr[toSendAr.length] = this.getStepObj(action,
					// this.quotedEscapeValue(locators[i][0]), value,
					// "selenium", popupName);
					// //this._debug(locators[i][0] + ":" + locators[i][1]);

					// //console.log("Text is "+locators[i][1])

					if (locators[i][1] != "name") {
						this.getStepObj(locators[i][0], locators[i][1],
							elementProperties);
					}
					if (locators[i][1] == "link") {
						var linkcon = locators[i][0]
						linkcon = linkcon.replace("link=", "")
						this.getStepObj(linkcon, locators[i][1],
							elementProperties);
					}

				} catch (e) {
				}
			}
			// Selenium accessors end
			_opkey.CreateBase64ImageAttributes(el, elementProperties);
			var recordingmode = _opkey.GetRecordingMode();
			// SALESFORCE_RECORDER
			// ////////debugger;

			if (recordingmode == "ORACLE FUSION") {
				var _oraclefusion = new OracleFusion();
				_oraclefusion.GetLabelProperties(el, elementProperties);
			}

			if (recordingmode == "JDE") {
				var _jdeRecorder = new JDERecorder();
				_jdeRecorder.GetLabelProperties(el, elementProperties);
			}

			if (recordingmode == "SERVICENOW") {
				var _oraclefusion = new ServiceNow();
				_oraclefusion.GetLabelProperties(el, elementProperties);
			}

			if (recordingmode == "SAP FIORI") {
				var _oraclefusion = new SAPFIORI();
				_oraclefusion.GetLabelProperties(el, elementProperties);
			}
			if (recordingmode == "SUCCESSFACTORS") {
				var _oraclefusion = new SuccessFactors();
				_oraclefusion.GetLabelProperties(el, elementProperties);
			}
			if (recordingmode == "MSDYNAMICS") {
				var _oraclefusion = new MSDynamics();
				_oraclefusion.GetLabelProperties(el, elementProperties);
			}
			if (recordingmode == "MSDynamics FSO") {
				var _oraclefusion = new MSDynamicsAX();
				_oraclefusion.GetLabelProperties(el, elementProperties);
			}
			if (recordingmode == "VEEVA VAULT") {
				var _oraclefusion = new VeevaVault();
				_oraclefusion.GetLabelProperties(el, elementProperties);
			}
			if (recordingmode == "PEOPLESOFT") {
				var _peoplesoft = new PeopleSoft_OpKey();
				_peoplesoft.GetLabelProperties(el, elementProperties);
			}
			if (recordingmode == "SALESFORCE") {
				try {
					elementProperties["hasVisualForcePage"] = _opkey
						.HasVisualForcePage(el).toString();
					elementProperties["theme"] = _opkey.GetSalesforceMode();
					var label = _opkey.getMatchingLabelWithTextBoxNDropDown(el);
					if (label == null) {
						var keyword_mapped = _opkey.GetSalesForceRelatedData(
							action, el, dataArguments.data, null, null);
						if (keyword_mapped != null) {
							if (keyword_mapped == "SKIP_KEYWORD") {
								return;
							}
							return FJSON.stringify(keyword_mapped);
						}
					}

					if (label) {
						elementProperties["label:index"] = _opkey
							.CreateLabelPropertyIndex(label).toString();
						var label_content = label.innerText;
						if (label.childNodes.length > 0) {
							for (var ch_n = 0; ch_n < label.childNodes.length; ch_n++) {
								var first_child = label.childNodes[ch_n];
								if (first_child.nodeName != "#text"
									&& first_child.nodeName != "#comment"
									&& first_child.nodeName != "SELECT") {
									var text_content = first_child.innerText;
									if (text_content != null) {
										text_content = text_content.trim();
										if (text_content != "") {
											if (text_content.trim() != "*") {
												label_content = text_content;
												break;
											}
										}
									}
								}
							}
						}
						elementProperties["label:text"] = label_content;

						var keyword_mapped = _opkey.GetSalesForceRelatedData(
							action, el, dataArguments.data,
							elementProperties, label);
						if (keyword_mapped != null) {
							if (keyword_mapped == "SKIP_KEYWORD") {
								return;
							}
							return FJSON.stringify(keyword_mapped);
						}
						var labellocators = this.getSeleniumAccessors(label);
						for (var li = 0; li < labellocators.length; li++) {
							elementProperties["label:" + labellocators[li][1]] = labellocators[li][0]
						}
					}
					if (el.placeholder) {
						elementProperties["label:placeholder"] = el.placeholder
							.replace(/\"/g, "&#x0022;").replace("'",
								"&#x0027;");
					}
					if (el.aria - label) {
						elementProperties["label:arialabel"] = el.aria - label;
					}
				} catch (e) {
					// alert(e);
				}
			}

			// WORKDAY_RECORDER
			var isLOV = false;
			if (recordingmode == "WORKDAY") {
				try {
					try {
						if (el.tagName == 'SPAN'
							&& el.getAttribute("data-automation-id") == "promptIcon") {
							isLOV = true;
						}
						if (isLOV == false) {
							if (el.tagName == 'SPAN'
								&& el.getAttribute("data-automation-id") == "promptSelectionLabel") {
								isLOV = true;
							}
						}
						if (isLOV == false) {
							if (el.tagName == 'DIV'
								&& el.getAttribute("data-automation-id") == "promptSearchButton") {
								isLOV = true;
							}
						}
						if (isLOV == false) {
							if (el.tagName == 'DIV'
								&& el.getAttribute("data-automation-id") == "icon") {
								var child = el.firstElementChild;
								if ((child.tagName == 'svg' || child.tagName == 'SVG')
									&& child.getAttribute("id") == "wd-icon-prompts") {
									isLOV = true;
								}
							}
						}
						if (isLOV == true) {
							elementProperties["label:element_isLOV"] = "true";
						}
					} catch (e) {
					}
					if (el.hasAttribute("title")) {
						elementProperties["label:element_title"] = el
							.getAttribute("title");
					}
					if (el.hasAttribute("aria-label")) {
						elementProperties["label:element_aria-label"] = el
							.getAttribute("aria-label");
					}
					if (el.hasAttribute("placeholder")) {
						elementProperties["label:element_placeholder"] = el
							.getAttribute("placeholder").replace(/\"/g,
								"&#x0022;").replace("'", "&#x0027;");
					}
					if (el.hasAttribute("data-automation-id")) {
						elementProperties["label:element_data-automation-id"] = el
							.getAttribute("data-automation-id");
					}
					if (el.hasAttribute("data-automation-label")) {
						elementProperties["label:element_data-automation-label"] = el
							.getAttribute("data-automation-label");
					}
				} catch (e) {
				}
				var workdayelement = _opkey.workday_main_getLabel(el);
				if (workdayelement != null) {
					try {
						if (workdayelement.hasAttribute("aria-label")) {
							elementProperties["label:arialabel"] = workdayelement
								.getAttribute("aria-label");
						}
						if (workdayelement.hasAttribute("placeholder")) {
							elementProperties["label:placeholder"] = workdayelement
								.getAttribute("placeholder").replace(/\"/g,
									"&#x0022;")
								.replace("'", "&#x0027;");
						}
						if (workdayelement.hasAttribute("data-automation-id")) {
							elementProperties["label:data-automation-id"] = workdayelement
								.getAttribute("data-automation-id");
						}
						if (workdayelement
							.hasAttribute("data-automation-label")) {
							elementProperties["label:data-automation-label"] = workdayelement
								.getAttribute("data-automation-label");
						}
					} catch (e) {
					}
					elementProperties["label:text"] = workdayelement.textContent;
					elementProperties["label:tagName"] = workdayelement.tagName;
					var workdaylabellocators = this
						.getSeleniumAccessors(workdayelement);
					for (var li = 0; li < workdaylabellocators.length; li++) {
						elementProperties["label:"
							+ workdaylabellocators[li][1]] = workdaylabellocators[li][0]
					}
				} else {
					if (el.tagName == 'svg' || el.tagName == 'SVG') {
						var parentnode = el.parentNode;
						if (parentnode && parentnode.nodeType == 1
							&& parentnode.tagName == 'DIV') {
							if (parentnode.getAttribute("data-automation-id") != null) {
								if (parentnode
									.getAttribute("data-automation-id") == "icon"
									&& parentnode.parentNode
										.getAttribute("data-automation-id") == "gridFullscreenIconButton") {
									var parent_node = parentnode.parentNode;
									if (parent_node
										.getAttribute("data-automation-id") != null)
										elementProperties["label:element_data-automation-id"] = parent_node
											.getAttribute("data-automation-id");
									if (parent_node.getAttribute("aria-label") != null)
										elementProperties["label:element_aria-label"] = parent_node
											.getAttribute("aria-label");
									if (parent_node.getAttribute("title") != null)
										elementProperties["label:element_title"] = parent_node
											.getAttribute("title");
								} else {
									if (parentnode
										.getAttribute("data-automation-id") != null)
										elementProperties["label:element_data-automation-id"] = parentnode
											.getAttribute("data-automation-id");
									if (parentnode.getAttribute("aria-label") != null)
										elementProperties["label:element_aria-label"] = parentnode
											.getAttribute("aria-label");
									if (parentnode.getAttribute("title") != null)
										elementProperties["label:element_title"] = parentnode
											.getAttribute("title");
								}
							} else {
								var parent_node = parentnode.parentNode;
								if (parent_node
									.getAttribute("data-automation-id") != null)
									elementProperties["label:element_data-automation-id"] = parent_node
										.getAttribute("data-automation-id");
								if (parent_node.getAttribute("aria-label") != null)
									elementProperties["label:element_aria-label"] = parent_node
										.getAttribute("aria-label");
								if (parent_node.getAttribute("title") != null)
									elementProperties["label:element_title"] = parent_node
										.getAttribute("title");
							}
						}
					}
					if (el.tagName == 'path' || el.tagName == 'PATH') {
						var parentnode = el.parentNode;
						if (parentnode && parentnode.tagName == 'svg') {
							var parent_node = parentnode.parentNode;
							if (parent_node && parent_node.nodeType == 1
								&& parent_node.tagName == 'DIV') {
								if (parent_node
									.getAttribute("data-automation-id") != null) {
									if (parent_node
										.getAttribute("data-automation-id") == "icon"
										&& parent_node.parentNode
											.getAttribute("data-automation-id") == "gridFullscreenIconButton") {
										var parentElem = parent_node.parentNode;
										if (parentElem
											.getAttribute("data-automation-id") != null)
											elementProperties["label:element_data-automation-id"] = parentElem
												.getAttribute("data-automation-id");
										if (parentElem
											.getAttribute("aria-label") != null)
											elementProperties["label:element_aria-label"] = parentElem
												.getAttribute("aria-label");
										if (parentElem.getAttribute("title") != null)
											elementProperties["label:element_title"] = parentElem
												.getAttribute("title");
									} else {
										if (parent_node
											.getAttribute("data-automation-id") != null)
											elementProperties["label:element_data-automation-id"] = parent_node
												.getAttribute("data-automation-id");
										if (parent_node
											.getAttribute("aria-label") != null)
											elementProperties["label:element_aria-label"] = parent_node
												.getAttribute("aria-label");
										if (parent_node.getAttribute("title") != null)
											elementProperties["label:element_title"] = parent_node
												.getAttribute("title");
									}
								} else {
									var parentElem = parent_node.parentNode;
									if (parentElem
										.getAttribute("data-automation-id") != null)
										elementProperties["label:element_data-automation-id"] = parentElem
											.getAttribute("data-automation-id");
									if (parentElem.getAttribute("aria-label") != null)
										elementProperties["label:element_aria-label"] = parentElem
											.getAttribute("aria-label");
									if (parentElem.getAttribute("title") != null)
										elementProperties["label:element_title"] = parentElem
											.getAttribute("title");
								}
							}
						}
					}
				}
			}
			// <!--5->
			if (elementProperties["sahiText"]) {
				elementProperties["logicalname"] = elementProperties["sahiText"];
			} else if (elementProperties["label:element_aria-label"]) {
				elementProperties["logicalname"] = elementProperties["label:element_aria-label"];
			} else if (elementProperties["label:element_data-automation-label"]) {
				elementProperties["logicalname"] = elementProperties["label:element_data-automation-label"];
			} else if (elementProperties["label:element_placeholder"]) {
				elementProperties["logicalname"] = elementProperties["label:element_placeholder"];
			} else if (elementProperties["label:element_title"]) {
				elementProperties["logicalname"] = elementProperties["label:element_title"];
			} else if (elementProperties["label:text"]) {
				elementProperties["logicalname"] = elementProperties["label:text"];
			} else if (elementProperties["label:arialabel"]) {
				elementProperties["logicalname"] = elementProperties["label:arialabel"];
			} else if (elementProperties["label:element_data-automation-id"]) {
				elementProperties["logicalname"] = elementProperties["label:element_data-automation-id"];
			} else if (elementProperties["label:data-automation-id"]) {
				elementProperties["logicalname"] = elementProperties["label:data-automation-id"];
			}
			if (elementProperties["tag"] === "SPAN") {
				if (elementProperties["logicalname"][0] == "*") {
					elementProperties["logicalname"] = elementProperties["logicalname"].substring(1);
				}

				else {
					elementProperties["logicalname"] = elementProperties["logicalname"];
				}


			}
			if (label_text_input != null) {
				elementProperties["logicalname"] = label_text_input
				label_text_input = null;
			}


			this._framesList = new Array();
			this._tempframesList = new Array();
			var htmltitle;
			var titleindex;
			var doc = el.ownerDocument;
			var win = doc.defaultView || doc.parentWindow;

			this._getFrames(win);
			if (this._framesList.length > 1000) {
				var singleframe = this._framesList[0];
				this._framesList = new Array();
				this._framesList.push(singleframe);
			}
			var baseurl = "";
			for (var i = 0; i < this._framesList.length; i++) {
				var parentobject = this._framesList[i]
				if (parentobject["tag"] == "html") {
					htmltitle = parentobject["title"]
					toSendAr["popupName"] = htmltitle;
					titleindex = parentobject["titleindex"]
					baseurl = parentobject["url"]
				}
			}
			for (var j = 0; j < this._framesList.length; j++) {
				var parentobject = this._framesList[j]
				parentobject["title"] = htmltitle;
				parentobject["titleindex"] = titleindex;
				if (parentobject["src"] == null || parentobject["src"] == "") {
					parentobject["src"] = baseurl;
				}
				this._tempframesList.push(parentobject)
			}
			this._framesList = this._tempframesList;
			var parentobject = this._getFinalFramesList();
			if (parentobject == null) {
				var opkeywindowid = null;
				opkeywindowid = _opkey
					.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
				if (opkeywindowid == "") {
					opkeywindowid = _opkey.windowidentiferontitle;
				}
				var probject = new Object();
				probject["tag"] = "HTML";
				probject["type"] = "html page";
				probject["title"] = _opkey.getTitle();
				probject["url"] = _opkey.getURL().replace(/{/g, '').replace(
					/}/g, '').replace(/\"/g, "&#x0022;");
				probject["titleindex"] = _opkey.indexofurrenttab;

				parentobject = probject;
			}
			if (parentobject["title"] == null) {
				parentobject["title"] = _opkey.getTitle();
			}
			if (parentobject["titleindex"] == null) {
				var opkeywindowid = null;
				opkeywindowid = _opkey
					.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
				if (opkeywindowid == "") {
					opkeywindowid = _opkey.windowidentiferontitle;
				}
				parentobject["titleindex"] = _opkey.indexofurrenttab;
			}
			elementProperties["parent"] = parentobject;
			if (el.className && !el instanceof SVGElement) {
				elementProperties["className"] = el.className.toString();
			}

			if (elementProperties["className"] != null) {
				elementProperties["className"] = elementProperties["className"]
					.replace(" OPkeyHighlighter", "").replace(
						"OPkeyHighlighter", "")
			}
			if (elementProperties["href"] != null) {
				try {
					if (el.getAttribute("href") != null) {
						elementProperties["href"] = el.getAttribute("href")
							.replace(/\"/g, "&#x0022;").replace("'",
								"&#x0027;");
					}
				} catch (e) {

				}
			}
			if (elementProperties["sahiText"] != null) {
				if (elementProperties["sahiText"].length > 200) {
					elementProperties["sahiText"] = elementProperties["sahiText"]
						.substring(0, 199);
				}
			}
			toSendAr["arguments"] = [elementProperties, dataArguments];
		}

		var retdata = FJSON.stringify(toSendAr)
		for (var k = 0; k < 1000; k++) {
			retdata = retdata.toString().replace('\\"', '"')
			retdata = retdata.toString().replace('arguments":"[{',
				'arguments":[{')
			retdata = retdata.toString().replace(']"}', ']}')
		}
		// //console.log(retdata)

		return retdata;
	}

	Opkey.prototype.getOpkeyDummyCustomScript = function (infoAr, el, evType, e) {
		// //console.log("Tag name "+el.nodeName)

		if (el.id.indexOf("IGNOREINOPKEYRECORDER") > -1) {
			return;
		}
		try {
			el.classList.remove("OPkeyHighlighter")
		} catch (e) {

		}

		// if(document.domain != "rediff.com" && e.type == "blur") return;
		var popupName = this.getPopupName();
		// this._debug("evType" + evType + " :el: " + el );
		var toSendAr = new Object();
		var accessorArr;
		var winArr;
		if (evType == "focusout") {
			if (el.nodeName == "INPUT") {
				this.triggerEvent(el, "change");
			} else
				return;
		}
		if (infoAr.length > 0) {
			var info = infoAr[0];
			var action = info.event.replace(/^_/, '');
			var value = null;

			if (action == "setValue" || action == "_setValue") {
				_opkey.textbox = null;
				_opkey.typekeysoccured = false
			} else {
				_opkey.textbox = null;
				_opkey.typekeysoccured = false
			}
			if (action == "setValue" || action == "setSelected"
				|| action == "setFile") {
				var value = info.value;
				// //this._debug("info.value: " +info.value);
				if (value == null)
					value = "";
				if (value == "")
					return;
				value = value.replace(/\n+/g, "").replace(/\\/g, "&#x5c;");
				value = this.toJSON(value);
			}
			if (action == "setSelected" || action == "") {
				if (el.nodeName == "OPTION") {
					var tempoption = el;
					action = "setSelected"
					el = el.parentNode
					value = tempoption.innerText
					var elInfo = this.identify(el);
					infoAr = elInfo.apis;
				}
			}
			var elProp = this.getAD(el);
			var elPropEnd = false;
			if (elProp.length > 0) {
				var elPropLength = elProp.length;

				for (var elPropLen = 0; elPropLen < elPropLength; elPropLen++) {
					// this._debug("22: " + elProp[elPropLen].tag + ";" +
					// elProp[elPropLen].type + ";" + e.type + ";" +
					// elProp[elPropLen].event);
					var elEvents = elProp[elPropLen].event
						.split("__xxSAHIDIVIDERxx__");
					if (!this.arrayContains(elEvents, e.type))
						continue;
					else {
						elPropEnd = true;
						var actionIndex = this.arrayIndexOf(elEvents, e.type);
						var actionEvents = elProp[0].action
							.split("__xxSAHIDIVIDERxx__");
						action = actionEvents[actionIndex];
						if (elProp[elPropLen].tag == "DIV") {
							value = el.innerText;
						}
					}
					if (elPropEnd == true)
						break;
				}
			}

			if (elPropEnd == false) {

				var elPropparent = this.getAD(el.parentNode);
				if (elPropparent.length > 0) {
					var elPropparentLength = elPropparent.length;

					for (var elPropparentLen = 0; elPropparentLen < elPropparentLength; elPropparentLen++) {
						// this._debug("22: " + elProp[elPropLen].tag + ";" +
						// elProp[elPropLen].type + ";" + e.type + ";" +
						// elProp[elPropLen].event);
						var elEvents = elPropparent[elPropparentLen].event
							.split("__xxSAHIDIVIDERxx__");
						if (!this.arrayContains(elEvents, e.type))
							continue;
						else {
							elPropEnd = true;
							var actionIndex = this.arrayIndexOf(elEvents,
								e.type);
							var actionEvents = elProp[0].action
								.split("__xxSAHIDIVIDERxx__");
							action = actionEvents[actionIndex];
							if (elPropparent[elPropparentLen].tag == "DIV") {
								value = el.innerText;
							}
						}
						if (elPropEnd == true)
							break;
					}
				}
			}

			// if(elPropEnd==false) return;

			// //console.log("Doing")
			if (el.nodeName == "SELECT" && el.type == "select-multiple") {
				toSendAr["action"] = "SelectMultipleDropDownItem";
			} else if (el.nodeName == "INPUT" && el.type == "password") {
				toSendAr["action"] = "TypeSecureText";
			} else {
				toSendAr["action"] = action;
			}
			var valueofelement = this.escapeNullValue(value).replace(/\"/g, '')
				.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;')
			if (valueofelement == _opkey.textboxtext) {
				return;
			}

			var dataArguments = {
				"type": "string",
				// "data" : this.escapeNullValue(value).replace(/\"/g,
				// '').replace(/[\[\]]+/g,'')
				"data": valueofelement
				// "data" : this.escapeNullValue(value).replace(/\"/g, '')
				// "data" : encodeURIComponent(this.escapeNullValue(value))
			}
			// toSendAr["popupName"] = popupName.replace(/\"/g, "&quote;");

			var elementProperties = new Object();
			var previousAccessorType = [];
			var visitedAccessorType = 0;
			try {
				var positionInfo = el.getBoundingClientRect();
				var height = positionInfo.height;
				var width = positionInfo.width;
			} catch (e) {

			}
			for (var i = 0; i < infoAr.length; i++) {
				try {
					var info = infoAr[i];
					// ////console.log(info);
					var accessor = this.escapeDollar(this.getAccessor1(info));
					var accessorType = this.getAccessorType(info);
					/*
					 * //this._debug("accessorType: " + accessorType);
					 * //this._debug("type: "+ typeof accessorType + "; "+
					 * previousAccessorType.length);
					 */
					for (var j = 0; j < previousAccessorType.length; j++) {
						if (previousAccessorType[j] == accessorType)
							visitedAccessorType = 1;
					}

					// //this._debug("Accessor Type: " + accessorType + ";
					// Accessor:" + accessor);
					if (visitedAccessorType != 1) {
						this.getStepObj(el.innerText.replace(/^\s+|\s+$/g, ''),
							"sahiText", elementProperties);
						this.getStepObj(accessor, accessorType,
							elementProperties);
						previousAccessorType.push(accessorType);
						// //this._debug("recorded: " + accessorType+ ";
						// Accessor:" + accessor);
						visitedAccessorType = 0;
					} else
						visitedAccessorType = 0;

					// added by ganesh adding value in element properties
					if (i == 0) {
						var value = info.value;
						this.getStepObj(value, "value", elementProperties);
					}

					// end
				} catch (e) {
				}
			}
			var checkstatus = ""
			this.getStepObj(el.tagName, "tag", elementProperties);
			if (el.type == "checkbox") {
				if (checkstatus == "") {
					checkstatus = "" + el.checked
				}
				this.getStepObj(checkstatus, "checked", elementProperties);
			}
			if (el.nodeName == "SELECT") {
				try {
					if (elementProperties["sahiText"]) {
						elementProperties["sahiText"] = "";
					}
					if (elementProperties["value"]) {
						elementProperties["value"] = "";
					}
				} catch (e) {
				}
			}
			var logicalname = el.nodeName;
			try {
				logicalname = _opkey.getLogicalNameOfObject(el,
					elementProperties["sahiText"])
				if (typeof logicalname === "object") {
					logicalname = el.nodeName
				}
			} catch (e) {
			}
			if (logicalname.length > 25) {
				logicalname = logicalname.substring(0, 25);
			}
			this.getStepObj(logicalname, "logicalname", elementProperties);
			if (el.nodeName == "TD") {
				this.getStepObj("\"" + el.cellIndex + "\"", "column",
					elementProperties);
				if (el.parentNode.nodeName == "TR") {
					this.getStepObj("\"" + el.parentNode.rowIndex + "\"",
						"row", elementProperties);
				}
			}
			if (typeof el.type != "undefined")
				this.getStepObj(el.type, "type", elementProperties);
			// Selenium accessors start
			var locators = this.getSeleniumAccessors(el);
			for (var i = 0; i < locators.length; i++) {
				try {
					// toSendAr[toSendAr.length] = this.getStepObj(action,
					// this.quotedEscapeValue(locators[i][0]), value,
					// "selenium", popupName);
					// //this._debug(locators[i][0] + ":" + locators[i][1]);

					// //console.log("Text is "+locators[i][1])

					if (locators[i][1] != "name") {
						this.getStepObj(locators[i][0], locators[i][1],
							elementProperties);
					}
					if (locators[i][1] == "link") {
						var linkcon = locators[i][0]
						linkcon = linkcon.replace("link=", "")
						this.getStepObj(linkcon, locators[i][1],
							elementProperties);
					}

				} catch (e) {
				}
			}
			// Selenium accessors end
			this._framesList = new Array();
			this._tempframesList = new Array();
			var htmltitle;
			var titleindex;
			var doc = el.ownerDocument;
			var win = doc.defaultView || doc.parentWindow;
			this._getFrames(win);
			var baseurl = "";
			for (var i = 0; i < this._framesList.length; i++) {
				var parentobject = this._framesList[i]
				if (parentobject["tag"] == "html") {
					htmltitle = parentobject["title"]
					toSendAr["popupName"] = htmltitle;
					titleindex = parentobject["titleindex"]
					baseurl = parentobject["url"]
				}
			}
			for (var j = 0; j < this._framesList.length; j++) {
				var parentobject = this._framesList[j]
				parentobject["title"] = htmltitle;
				parentobject["titleindex"] = titleindex;
				if (parentobject["src"] == null || parentobject["src"] == "") {
					parentobject["src"] = baseurl;
				}
				this._tempframesList.push(parentobject)
			}
			this._framesList = this._tempframesList
			var parentobject = this._getFinalFramesList();
			if (parentobject == null) {
				var opkeywindowid = null;
				opkeywindowid = _opkey
					.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
				if (opkeywindowid == "") {
					opkeywindowid = _opkey.windowidentiferontitle;
				}
				var probject = new Object();
				probject["tag"] = "HTML";
				probject["type"] = "html page";
				probject["title"] = _opkey.getTitle();
				probject["url"] = _opkey.getURL().replace(/{/g, '').replace(
					/}/g, '').replace(/\"/g, "&#x0022;");
				probject["titleindex"] = _opkey.indexofurrenttab;
				parentobject = probject;
			}
			elementProperties["parent"] = parentobject;
			if (el.className && !el instanceof SVGElement) {
				elementProperties["className"] = el.className.toString();
			}

			if (elementProperties["className"] != null) {
				elementProperties["className"] = elementProperties["className"]
					.replace(" OPkeyHighlighter", "").replace(
						"OPkeyHighlighter", "")
			}

			if (elementProperties["href"] != null) {
				try {
					if (el.getAttribute("href") != null) {
						elementProperties["href"] = el.getAttribute("href")
							.replace(/\"/g, "&#x0022;").replace("'",
								"&#x0027;");
					}
				} catch (e) {

				}
			}

			toSendAr["arguments"] = [elementProperties, dataArguments];
		}

		var retdata = FJSON.stringify(toSendAr)
		// //console.log(retdata)

		return retdata;
	}

	Opkey.prototype.getSeleniumAccessors = function (el) {
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
	}
	Opkey.prototype.escapeDollar = function (s) {
		return s;
		if (s == null)
			return null;
		return s.replace(/[$]/g, "\\$");
	}
	Opkey.prototype.queuedMouseOver = function () {
		var el = this.__lastMousedOverElement;

		var lastRelationElement = this
			.getServerVarNew("__opkey__lastIdentifiedRelation");
		this.setParentElementForRelation(lastRelationElement);
		try {
			this.identifyAndDisplay(el);
			var controlWin = this.getController();
			if (controlWin && !controlWin.closed) {
				controlWin.clearUpDownHistory();
			}
		} catch (e) {
		}
	}
	Opkey.prototype.getServerVarNew = function (name, isGlobal) {
		var v = this.sendToServer("/_s_/dyn/SessionState_getVar?name="
			+ this.encode(name) + "&isglobal=" + (isGlobal ? 1 : 0));
		return this.withoutQuotedEscapeValue(decodeURIComponent(v));
	};
	Opkey.prototype.withoutQuotedEscapeValue = function (s) {
		return this.withoutQuoted(this.escapeValue(s));
	};
	Opkey.prototype.withoutQuoted = function (s) {
		return s.replace(/"/g, '\\"').replace(new RegExp("\\+", "g"), ' ');
	};
	Opkey.prototype.escapeForScript = function (s) {
		if (typeof s == "number")
			return s;
		return this.withoutQuotedEscapeValue(s);
	}
	Opkey.prototype.setAnchor = function (s) {
		this.anchorStr = s;
		try {
			this.anchor = eval(this.addOpkey(s).replace(new RegExp("\\+", "g"),
				' ').replace(/\\"/g, '"'));
		} catch (e) {
		}
	}
	Opkey.prototype.getAccessor1 = function (info, type) {
		if (info == null)
			return null;
		if ("" == ("" + info.shortHand) || info.shortHand == null)
			return null;
		this.lastIdentifiedElementType = info.type;
		var accessor;
		if (type == "identify") {
			var accessorType = this.getAccessorType(info);
			accessor = info.type + "(" + this.escapeForScript(info.shortHand)
				+ ")__xxSAHIDIVIDERxx__" + accessorType;
		} else
			accessor = this.escapeForScript(info.shortHand);
		/*
		 * if (typeof accessor == "string" && accessor.indexOf("_") == 0)
		 * accessor = accessor.substring(1);
		 */
		if (type == "identify" && info.relationStr)
			this.lastIdentifiedRelation = info.relationStr;
		else
			this.lastIdentifiedRelation = null;
		return accessor;
	};
	Opkey.prototype.setParentElementForRelation = function (parentEl) {
		if (parentEl != null) {
			this.setAnchor(parentEl);
		}
		return true;
	};
	Opkey.prototype.domToJSON = function (el) {
		var s = new Object();
		var f = "";
		var j = 0;
		if (typeof el == "array") {
			for (var i = 0; i < el.length; i++) {
				s[i] = el[i];
			}
		}
		if (typeof el == "object") {
			for (var i in el) {
				try {
					if (el[i] && el[i] != el) {
						if (("" + el[i]).indexOf("function") == 0) {
						} else {
							if (typeof el[i] == "object"
								&& el[i] != el.parentNode) {
								s[i] = "{{" + el[i].replace(/object /g, "")
									+ "}}";
							}
							s[i] = el[i];
							j++;
						}
					}
				} catch (e) {
					// s += "" + i + ",";
				}
			}
		}
		// this._debug(JSON.stringify(s));
		return JSON.stringify(s);
	};

	if (_opkey._isSafari()) {
		var originalStringify = JSON.stringify;
		JSON.stringify = function (obj) {
			var seen = [];

			var result = originalStringify(obj, function (key, val) {
				// to support IE8 added by ganesh
				if (!window.HTMLElement)
					HTMLElement = window.Element;

				if (!Array.prototype.indexOf) {
					Array.prototype.indexOf = function (elt, from) {
						var len = this.length >>> 0;

						var from = Number(arguments[1]) || 0;
						from = (from < 0) ? Math.ceil(from) : Math.floor(from);
						if (from < 0)
							from += len;

						for (; from < len; from++) {
							if (from in this && this[from] === elt)
								return from;
						}
						return -1;
					};
				}
				// end
				if (val instanceof HTMLElement) {
					return val.outerHTML
				}
				if (typeof val == "object") {
					if (seen.indexOf(val) >= 0) {
						return null;
					}
					seen.push(val);
				}
				return val;
			});
			return result;
		};
	}

	_opkey.sendToServer("/_s_/dyn/Driver_setDom?element="
		+ encodeURIComponent("reset"));

	function parseAlternateProperty(input, flag) {

		// flag:0 replace with single quote
		// flag:3 do not push data
		if (input.charAt(0) == "_") {
			input = "" + input;
			var init = input.indexOf('(');
			var fin = input.indexOf(')');
			var out = input.substr(init + 1, fin - init - 1);
			if (out != "") {
				if (input != null) {
					if (flag == 0) {
						input = input.replace("(", "('");
						input = input.replace(")", "')");
					}
					var a = {
						Action: input
					};

				}
				return out;
			} else {
				if (input == "undefined") {
					return null;
				} else {
					return input;
				}
			}
		} else {
			return input;
		}
	}

	Opkey.prototype.sendIdentifierInfo = function (accessors, escapedAccessor,
		escapedValue, popupName, assertions, el, cantakeimage) {

		// //console.log("part 0")
		try {
			// el.classList.remove("OPkeyHighlighter")
		} catch (e) {

		}
		var assertions = this.identify(el).assertions;
		var elementProperties = new Object()
		elementProperties["tag"] = el.nodeName
		for (var i = 0; i < accessors.length; i++) {
			var accessorPart = accessors[i].split("__xxSAHIDIVIDERxx__");
			if (elementProperties[accessorPart[1]] == null) {
				try {
					if (accessorPart[1] == "sahiText") {
						accessorPart[0] = parseAlternateProperty(el.innerText,
							0)
					}
				} catch (e) {
				}
				elementProperties[accessorPart[1]] = accessorPart[0];
			}
		}

		// //console.log("part 1")
		var locators = this.getSeleniumAccessors(el);
		var selAccessors = [];
		for (var i = 0; i < locators.length; i++) {
			if (locators[i][1] != "name") {
				this.getStepObj(locators[i][0], locators[i][1],
					elementProperties);
			}
		}
		var logicalname = el.nodeName;
		try {
			logicalname = _opkey.getLogicalNameOfObject(el,
				elementProperties["sahiText"])
			if (typeof logicalname === "object") {
				logicalname = el.nodeName
			}
		} catch (e) {
		}
		if (logicalname.length > 25) {
			logicalname = logicalname.substring(0, 25);
		}
		elementProperties["logicalname"] = logicalname
		// //console.log("part 2")
		if (el.nodeName == "TD") {
			this.getStepObj("\"" + el.cellIndex + "\"", "column",
				elementProperties);
			if (el.parentNode.nodeName == "TR") {
				this.getStepObj("\"" + el.parentNode.rowIndex + "\"", "row",
					elementProperties);
			}
		}
		// //console.log("part 3")
		if (el.getAttribute("href") != null) {
			elementProperties["href"] = el.getAttribute("href");
		}

		if (el.getAttribute("title") != null) {
			elementProperties["alt"] = el.getAttribute("title");
		}

		if (el.getAttribute("alt") != null) {
			elementProperties["alt"] = el.getAttribute("alt");
		}

		try {
			var backgroundcolorofelement = window.getComputedStyle(el, null)
				.getPropertyValue("background-color")
			var colorofelement = window.getComputedStyle(el, null)
				.getPropertyValue("color")

			// elementProperties["background-color"] = backgroundcolorofelement;
			// elementProperties["color"] = colorofelement;
			var rect = el.getBoundingClientRect();
			// elementProperties["width"]=(rect.right - rect.left)
			// elementProperties["height"]=(rect.bottom - rect.top)
			// elementProperties["x"]=rect.left
			// elementProperties["y"]=rect.top
			if (cantakeimage != 1) {
				// var
				// imagebase64=_opkey.sendToServer('/_s_/dyn/Driver_getRealtimeObjectImage?width='+rect.width+'&height='+rect.height);
				elementProperties["ObjectImage"] = "";
			}
		} catch (e) {
		}
		try {

			if (el.nodeName == "INPUT" || el.nodeName == "TEXTAREA") {
				if (el.maxLength != -1) {
					elementProperties["length"] = el.maxLength
				}
				if (el.placeholder) {
					elementProperties["placeholder"] = el.placeholder.replace(
						/\"/g, "&#x0022;").replace("'", "&#x0027;");
				}
			}
			if (el.nodeName == "LI") {
				var parent = el.parentNode;
				var childnodes = parent.childNodes
				for (var k = 0; k < childnodes.length; k++) {
					if (childnodes[k] == el) {
						elementProperties["itemIndex"] = k
						break;
					}
				}
			}
			if (el.nodeName == "UL" || el.nodeName == "SELECT") {
				var count = el.childnodes.length
				elementProperties["itemCount"] = count
			}
		} catch (e) {
		}
		_opkey.CreateBase64ImageAttributes(el, elementProperties);
		var recordingmode = _opkey.GetRecordingMode();
		// SALESFORCE_RECORDER
		if (recordingmode == "ORACLE FUSION") {
			var _oraclefusion = new OracleFusion();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}

		if (recordingmode == "JDE") {
			var _jdeRecorder = new JDERecorder();
			_jdeRecorder.GetLabelProperties(el, elementProperties);
		}

		if (recordingmode == "SERVICENOW") {
			var _oraclefusion = new ServiceNow();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}

		if (recordingmode == "SAP FIORI") {
			var _oraclefusion = new SAPFIORI();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "SUCCESSFACTORS") {
			var _oraclefusion = new SuccessFactors();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "MSDYNAMICS") {
			var _oraclefusion = new MSDynamics();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "MSDynamics FSO") {
			var _oraclefusion = new MSDynamicsAX();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "VEEVA VAULT") {
			var _oraclefusion = new VeevaVault();
			_oraclefusion.GetLabelProperties(el, elementProperties);
		}
		if (recordingmode == "PEOPLESOFT") {
			var _peoplesoft = new PeopleSoft_OpKey();
			_peoplesoft.GetLabelProperties(el, elementProperties);
		}

		if (recordingmode == "SALESFORCE") {
			try {
				elementProperties["hasVisualForcePage"] = _opkey
					.HasVisualForcePage(el).toString();
				elementProperties["theme"] = _opkey.GetSalesforceMode();
				var label = _opkey.getMatchingLabelWithTextBoxNDropDown(el);
				if (label == null) {
					var keyword_mapped = _opkey.GetSalesForceRelatedData(
						action, el, dataArguments.data, null, null);
					if (keyword_mapped != null) {
						if (keyword_mapped == "SKIP_KEYWORD") {
							return;
						}
						return FJSON.stringify(keyword_mapped);
					}
				}
				if (label) {
					elementProperties["label:index"] = _opkey
						.CreateLabelPropertyIndex(label).toString();
					var label_content = label.innerText;
					if (label.childNodes.length > 0) {
						for (var ch_n = 0; ch_n < label.childNodes.length; ch_n++) {
							var first_child = label.childNodes[ch_n];
							if (first_child.nodeName != "#text"
								&& first_child.nodeName != "#comment"
								&& first_child.nodeName != "SELECT") {
								var text_content = first_child.innerText;
								if (text_content != null) {
									text_content = text_content.trim();
									if (text_content != "") {
										if (text_content.trim() != "*") {
											label_content = text_content;
											break;
										}
									}
								}
							}
						}
					}
					elementProperties["label:text"] = label_content;
					var keyword_mapped = _opkey.GetSalesForceRelatedData(
						action, el, dataArguments.data, elementProperties,
						label);
					if (keyword_mapped != null) {
						if (keyword_mapped == "SKIP_KEYWORD") {
							return;
						}
						return FJSON.stringify(keyword_mapped);
					}
					var labellocators = this.getSeleniumAccessors(label);
					for (var li = 0; li < labellocators.length; li++) {
						elementProperties["label:" + labellocators[li][1]] = labellocators[li][0]
					}
				}
				if (el.placeholder) {
					elementProperties["label:placeholder"] = el.placeholder
						.replace(/\"/g, "&#x0022;")
						.replace("'", "&#x0027;");
				}
				if (el.aria - label) {
					elementProperties["label:arialabel"] = el.el.aria - label;
				}
			} catch (e) {
				// alert(e);
			}
		}
		// WORKDAY_RECORDER
		var isLOV = false;
		if (recordingmode == "WORKDAY") {
			try {
				try {
					if (el.tagName == 'SPAN'
						&& el.getAttribute("data-automation-id") == "promptIcon") {
						isLOV = true;
					}
					if (isLOV == false) {
						if (el.tagName == 'SPAN'
							&& el.getAttribute("data-automation-id") == "promptSelectionLabel") {
							isLOV = true;
						}
					}
					if (isLOV == false) {
						if (el.tagName == 'DIV'
							&& el.getAttribute("data-automation-id") == "promptSearchButton") {
							isLOV = true;
						}
					}
					if (isLOV == false) {
						if (el.tagName == 'DIV'
							&& el.getAttribute("data-automation-id") == "icon") {
							var child = el.firstElementChild;
							if ((child.tagName == 'svg' || child.tagName == 'SVG')
								&& child.getAttribute("id") == "wd-icon-prompts") {
								isLOV = true;
							}
						}
					}
					if (isLOV == true) {
						elementProperties["label:element_isLOV"] = "true";
					}
				} catch (e) {
				}
				if (el.hasAttribute("title")) {
					elementProperties["label:element_title"] = el
						.getAttribute("title");
				}
				if (el.hasAttribute("aria-label")) {
					elementProperties["label:element_aria-label"] = el
						.getAttribute("aria-label");
				}
				if (el.hasAttribute("placeholder")) {
					elementProperties["label:element_placeholder"] = el
						.getAttribute("placeholder").replace(/\"/g,
							"&#x0022;").replace("'", "&#x0027;");
				}
				if (el.hasAttribute("data-automation-id")) {
					elementProperties["label:element_data-automation-id"] = el
						.getAttribute("data-automation-id");
				}
				if (el.hasAttribute("data-automation-label")) {
					elementProperties["label:element_data-automation-label"] = el
						.getAttribute("data-automation-label");
				}
			} catch (e) {
			}
			var workdayelement = _opkey.workday_main_getLabel(el);
			if (workdayelement != null) {
				try {
					if (workdayelement.hasAttribute("aria-label")) {
						elementProperties["label:arialabel"] = workdayelement
							.getAttribute("aria-label");
					}
					if (workdayelement.hasAttribute("placeholder")) {
						elementProperties["label:placeholder"] = workdayelement
							.getAttribute("placeholder").replace(/\"/g,
								"&#x0022;").replace("'", "&#x0027;");
					}
					if (workdayelement.hasAttribute("data-automation-id")) {
						elementProperties["label:data-automation-id"] = workdayelement
							.getAttribute("data-automation-id");
					}
					if (workdayelement.hasAttribute("data-automation-label")) {
						elementProperties["label:data-automation-label"] = workdayelement
							.getAttribute("data-automation-label");
					}
				} catch (e) {
				}
				elementProperties["label:text"] = workdayelement.textContent;
				elementProperties["label:tagName"] = workdayelement.tagName;
				var workdaylabellocators = this
					.getSeleniumAccessors(workdayelement);
				for (var li = 0; li < workdaylabellocators.length; li++) {
					elementProperties["label:" + workdaylabellocators[li][1]] = workdaylabellocators[li][0]
				}
			} else {
				if (el.tagName == 'svg' || el.tagName == 'SVG') {
					var parentnode = el.parentNode;
					if (parentnode && parentnode.nodeType == 1
						&& parentnode.tagName == 'DIV') {
						if (parentnode.getAttribute("data-automation-id") != null) {
							if (parentnode.getAttribute("data-automation-id") == "icon"
								&& parentnode.parentNode
									.getAttribute("data-automation-id") == "gridFullscreenIconButton") {
								var parent_node = parentnode.parentNode;
								if (parent_node
									.getAttribute("data-automation-id") != null)
									elementProperties["label:element_data-automation-id"] = parent_node
										.getAttribute("data-automation-id");
								if (parent_node.getAttribute("aria-label") != null)
									elementProperties["label:element_aria-label"] = parent_node
										.getAttribute("aria-label");
								if (parent_node.getAttribute("title") != null)
									elementProperties["label:element_title"] = parent_node
										.getAttribute("title");
							} else {
								if (parentnode
									.getAttribute("data-automation-id") != null)
									elementProperties["label:element_data-automation-id"] = parentnode
										.getAttribute("data-automation-id");
								if (parentnode.getAttribute("aria-label") != null)
									elementProperties["label:element_aria-label"] = parentnode
										.getAttribute("aria-label");
								if (parentnode.getAttribute("title") != null)
									elementProperties["label:element_title"] = parentnode
										.getAttribute("title");
							}
						} else {
							var parent_node = parentnode.parentNode;
							if (parent_node.getAttribute("data-automation-id") != null)
								elementProperties["label:element_data-automation-id"] = parent_node
									.getAttribute("data-automation-id");
							if (parent_node.getAttribute("aria-label") != null)
								elementProperties["label:element_aria-label"] = parent_node
									.getAttribute("aria-label");
							if (parent_node.getAttribute("title") != null)
								elementProperties["label:element_title"] = parent_node
									.getAttribute("title");
						}
					}
				}
				if (el.tagName == 'path' || el.tagName == 'PATH') {
					var parentnode = el.parentNode;
					if (parentnode && parentnode.tagName == 'svg') {
						var parent_node = parentnode.parentNode;
						if (parent_node && parent_node.nodeType == 1
							&& parent_node.tagName == 'DIV') {
							if (parent_node.getAttribute("data-automation-id") != null) {
								if (parent_node
									.getAttribute("data-automation-id") == "icon"
									&& parent_node.parentNode
										.getAttribute("data-automation-id") == "gridFullscreenIconButton") {
									var parentElem = parent_node.parentNode;
									if (parentElem
										.getAttribute("data-automation-id") != null)
										elementProperties["label:element_data-automation-id"] = parentElem
											.getAttribute("data-automation-id");
									if (parentElem.getAttribute("aria-label") != null)
										elementProperties["label:element_aria-label"] = parentElem
											.getAttribute("aria-label");
									if (parentElem.getAttribute("title") != null)
										elementProperties["label:element_title"] = parentElem
											.getAttribute("title");
								} else {
									if (parent_node
										.getAttribute("data-automation-id") != null)
										elementProperties["label:element_data-automation-id"] = parent_node
											.getAttribute("data-automation-id");
									if (parent_node.getAttribute("aria-label") != null)
										elementProperties["label:element_aria-label"] = parent_node
											.getAttribute("aria-label");
									if (parent_node.getAttribute("title") != null)
										elementProperties["label:element_title"] = parent_node
											.getAttribute("title");
								}
							} else {
								var parentElem = parent_node.parentNode;
								if (parentElem
									.getAttribute("data-automation-id") != null)
									elementProperties["label:element_data-automation-id"] = parentElem
										.getAttribute("data-automation-id");
								if (parentElem.getAttribute("aria-label") != null)
									elementProperties["label:element_aria-label"] = parentElem
										.getAttribute("aria-label");
								if (parentElem.getAttribute("title") != null)
									elementProperties["label:element_title"] = parentElem
										.getAttribute("title");
							}
						}
					}
				}
			}
		}

		if (elementProperties["sahiText"]) {
			elementProperties["logicalname"] = elementProperties["sahiText"];
		} else if (elementProperties["label:element_aria-label"]) {
			elementProperties["logicalname"] = elementProperties["label:element_aria-label"];
		} else if (elementProperties["label:element_data-automation-label"]) {
			elementProperties["logicalname"] = elementProperties["label:element_data-automation-label"];
		} else if (elementProperties["label:element_placeholder"]) {
			elementProperties["logicalname"] = elementProperties["label:element_placeholder"];
		} else if (elementProperties["label:element_title"]) {
			elementProperties["logicalname"] = elementProperties["label:element_title"];
		} else if (elementProperties["label:text"]) {
			elementProperties["logicalname"] = elementProperties["label:text"];
		} else if (elementProperties["label:arialabel"]) {
			elementProperties["logicalname"] = elementProperties["label:arialabel"];
		} else if (elementProperties["label:element_data-automation-id"]) {
			elementProperties["logicalname"] = elementProperties["label:element_data-automation-id"];
		} else if (elementProperties["label:data-automation-id"]) {
			elementProperties["logicalname"] = elementProperties["label:data-automation-id"];
		}

		elementProperties["value"] = escapedValue;
		elementProperties["type"] = el.type;
		elementProperties["relation"] = GetRelationWithString(el);
		////console.log("part 4")
		this._framesList = new Array();
		this._tempframesList = new Array();
		var htmltitle;
		var titleindex;
		var doc = el.ownerDocument;
		var win = doc.defaultView || doc.parentWindow;
		this._getFrames(win);
		if (this._framesList.length > 1000) {
			var singleframe = this._framesList[0];
			this._framesList = new Array();
			this._framesList.push(singleframe);
		}
		var baseurl = "";
		for (var i = 0; i < this._framesList.length; i++) {
			var parentobject = this._framesList[i]
			if (parentobject["tag"] == "html") {
				htmltitle = parentobject["title"]
				titleindex = parentobject["titleindex"]
				baseurl = parentobject["url"]
			}
		}
		for (var j = 0; j < this._framesList.length; j++) {
			var parentobject = this._framesList[j]
			parentobject["title"] = htmltitle;
			parentobject["titleindex"] = titleindex;
			if (parentobject["src"] == null || parentobject["src"] == "") {
				parentobject["src"] = baseurl;
			}
			this._tempframesList.push(parentobject)
		}
		this._framesList = this._tempframesList;
		var parentobject = this._getFinalFramesList();
		if (parentobject == null) {
			var opkeywindowid = null;
			opkeywindowid = _opkey
				.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
			if (opkeywindowid == "") {
				opkeywindowid = _opkey.windowidentiferontitle;
			}
			var probject = new Object();
			probject["tag"] = "HTML";
			probject["type"] = "html page";
			probject["title"] = _opkey.getTitle();
			probject["url"] = _opkey.getURL().replace(/{/g, '').replace(/}/g,
				'').replace(/\"/g, "&#x0022;");
			probject["titleindex"] = _opkey.indexofurrenttab;
			parentobject = probject;
		}
		if (parentobject["title"] == null) {
			parentobject["title"] = _opkey.getTitle();
		}
		if (parentobject["titleindex"] == null) {
			var opkeywindowid = null;
			opkeywindowid = _opkey
				.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
			if (opkeywindowid == "") {
				opkeywindowid = _opkey.windowidentiferontitle;
			}
			parentobject["titleindex"] = _opkey.indexofurrenttab;
		}
		elementProperties["parent"] = parentobject;

		//NEON
		////console.log("Part 6")
		if (el.className && !el instanceof SVGElement) {
			elementProperties["className"] = el.className.toString();
		}

		if (elementProperties["className"] != null) {
			elementProperties["className"] = elementProperties["className"]
				.replace(" OPkeyHighlighter", "").replace(
					"OPkeyHighlighter", "")
		}
		if (elementProperties["href"] != null) {
			elementProperties["href"] = elementProperties["href"].replace(
				/\"/g, "&#x0022;").replace("'", "&#x0027;");
		}

		if (elementProperties["href"] != null) {
			try {
				if (el.getAttribute("href") != null) {
					elementProperties["href"] = el.getAttribute("href")
						.replace(/\"/g, "&#x0022;")
						.replace("'", "&#x0027;");
				}
			} catch (e) {

			}
		}
		var toSendAr = FJSON.stringify(elementProperties);
		for (var k = 0; k < 1000; k++) {
			toSendAr = toSendAr.toString().replace('\\"', '"')
			toSendAr = toSendAr.toString().replace('arguments":"[{',
				'arguments":[{')
			toSendAr = toSendAr.toString().replace(']"}', ']}')
		}
		////console.log("Part 7")
		this.sendToServer("/_s_/dyn/Driver_setLastIdentifiedElement?element="
			+ encodeURIComponent(toSendAr));
	};
	Opkey.prototype.getAccessorType = function (info) {
		if (info == null)
			return null;
		if ("" == ("" + info.accessorType) || info.accessorType == null)
			return null;
		var accessor = (typeof info.accessorType == "function") ? "url"
			: info.accessorType;
		return accessor;
	};
	//	Opkey.prototype.openWin = function(){};
	//	Opkey.prototype.openController = function(){};	
	_opkey.language = {
		ASSERT_EXISTS: "assertExists__xxSAHIDIVIDERxx__<accessor>__xxSAHIDIVIDERxx__",
		ASSERT_VISIBLE: "assertVisible__xxSAHIDIVIDERxx__<accessor>__xxSAHIDIVIDERxx__",
		//ASSERT_EQUAL_TEXT: "assertEqual__xxSAHIDIVIDERxx__getText(<accessor>)__xxSAHIDIVIDERxx__<value>",
		ASSERT_CONTAINS_TEXT: "assertContainsText__xxSAHIDIVIDERxx__<value>__xxSAHIDIVIDERxx__<accessor>",
		ASSERT_EQUAL_VALUE: "assertEqual__xxSAHIDIVIDERxx__<accessor>.value__xxSAHIDIVIDERxx__<value>",
		//ASSERT_SELECTION: "assertEqual__xxSAHIDIVIDERxx__getSelectedText(<accessor>)__xxSAHIDIVIDERxx__<value>",
		//ASSERT_CHECKED: "assert__xxSAHIDIVIDERxx__<accessor>.checked__xxSAHIDIVIDERxx__",
		ASSERT_NOT_CHECKED: "assertChecked__xxSAHIDIVIDERxx__<accessor>__xxSAHIDIVIDERxx__",
		POPUP: "popup(<window_name>).",
		DOMAIN: "domain(<domain>)."
	};
}
/** -- OpKey Recorder End -- **/
