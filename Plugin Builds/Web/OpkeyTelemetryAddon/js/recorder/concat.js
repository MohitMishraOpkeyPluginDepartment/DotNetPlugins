var Opkey = function () {
	// if triggerType is set to mousedown, textbox _setValues will be recorded
	// AFTER button clicks. Is wrong
	this.domelements = [];
	var pivotindex1
	var anchindex;
	var pivotindex
	this.sales_auth_acquired = false;
	this.triggerType = "click";
	this.mouseDownEl = null;
	this.lastMouseDownEl = null;
	this.cmds = new Array();
	this.cmdDebugInfo = new Array();

	this.cmdsLocal = new Array();
	this.cmdDebugInfoLocal = new Array();

	this.promptReturnValue = new Array();

	this.locals = [];

	this.INTERVAL = 500;
	this.ONERROR_INTERVAL = 1000;
	this.MAX_RETRIES = 5;
	this.SAHI_MAX_WAIT_FOR_LOAD = 30;
	this.STABILITY_INDEX = 5;
	this.waitForLoad = this.SAHI_MAX_WAIT_FOR_LOAD;
	this.interval = this.INTERVAL;

	this.localIx = 0;
	this.buffer = "";

	this.controller = null;
	this.lastAccessedInfo = null;
	this.execSteps = null; // from OpkeyScript through script.js

	this.sahiBuffer = "";

	this.real_alert = window.alert;
	this.real_confirm = window.confirm;
	this.real_prompt = window.prompt;
	this.real_print = window.print;
	this.wrapped = new Array();
	// this.mockDialogs(window);

	this.lastQs = "";
	this.lastTime = 0;

	this.XHRs = [];
	this.XHRTimes = [];
	this.escapeMap = {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"': '\\"',
		'\\': '\\\\'
	};
	this.lastStepId = 0;
	this.strictVisibilityCheck = false;
	this.isSingleSession = false;
	this.ADs = [];
	// this.controllerURL = "/_s_/spr/controller7.htm";
	this.controllerURL = "/_s_/spr/opkeycontroller.htm";
	this.controllerHeight = 550;
	this.controllerWidth = 485;
	this.recorderClass = "Recorder";
	this.stabilityIndex = this.STABILITY_INDEX;
	this.xyoffsets = new Opkey.Dict();
	this.escapeUnicode = false;
	this.CHECK_REGEXP = /^\/.*\/i?$/;
	// this.navigator = {"userAgent": navigator.userAgent, "appName":
	// navigator.appName};
	this.navigator = {
		"userAgent": navigator.userAgent,
		"appName": navigator.appName,
		"appVersion": navigator.appVersion
	};
	this.textboxTypes = ["text", "number", "password", "textarea", "date", "datetime", "datetime-local", "email", "month", "number", "range", "search", "tel", "time", "url", "week"];
	this.isOREnabled = false;
	this.browserType = "";
	this.currentelement;
	this.pivotstatus = 0;
	this.textboxtext;
	this.highlightedelements = []
	this.textbox = null;
	this.lasthighlightedelementfordomfetching;
	this.lastObiqHighlightedElement = null;
	this.typekeysoccured = false
	this.cellindexintable = null;
	this.rowindexintable = null;
	this.windowidentiferontitle = null;
	this.issettimecalled = false;
	this.setidcanbecalled = true;
	this.otherids = null;
	this.otherselectnodefound = false;
	this.controllerMode = "opkey"
	this.indexofurrenttab = 0;
	this.canrecordfromopkey = false;
	this.canHighlight = false;
	this.contenteditableelement = null;
	this.temptypedtextvalue = null;
	this.recording_mode = "NORMAL";
	this.OBJECT_BASE64_IMAGE = "";
	this.mouse_pointed_element = null;
	this.addtotestcaseflag = false;
	this.anchored_element = null;
	this.can_record = true;
	this.ignore_highlight = false;
	this.fiori_dropdown = null;
	this.fiori_showvaluebutton = null;
	this.fiori_valuesearched = false;
	this.alreadyToastVis = false
};

var veeva_searchAndSelectRecording = false;
var veeva_lookupbutton = null;
var jnlpDataSent = false;
var normalRecordingDropdown = null;
let lastPerformedActon = null;
function sToggleRecorderOff() {
	_opkey.can_record = false;
	_opkey.ignore_highlight = true;
	return "TOGGLED";
};

function AddonsHighlightDom(index_0) {
	_opkey.highlightForAddon(index_0);
};

Opkey.prototype.GetRecordingMode = function () {
	var recording_mode = localStorage.getItem("OPKEY_RECORDING_MODE");
	if (recording_mode == null) {
		return "NORMAL";
	} else {
		return recording_mode;
	}
};

var current_apexclassname = "";
Opkey.prototype.GetApexClassName = function (e) {
	var temp_element = e.target;
	while (temp_element.parentNode != null) {
		if (temp_element.nodeName == "FORM") {
			if (temp_element.getAttribute("action") != null) {
				var apex_classname = temp_element.getAttribute("action");
				apex_classname = apex_classname.split("/apex/");
				apex_classname = apex_classname[1];
				if (apex_classname != null) {
					apex_classname = apex_classname.split("?");
					if (apex_classname[0] != null) {
						apex_classname = apex_classname[0];
					}
				}

				if (apex_classname != null) {
					if (apex_classname != current_apexclassname) {
						chrome.runtime.sendMessage({
							GetApexClassProperty: {
								"apexClassName": apex_classname
							}
						}, function (response) {
							if (chrome.runtime.lastError) { }
						});
					}
					current_apexclassname = apex_classname;
				}
				return;
			}
		}
		temp_element = temp_element.parentNode;
	}

	var apex_classname_0 = _opkey.getURL();
	apex_classname_0 = apex_classname_0.split("/apex/");
	apex_classname_0 = apex_classname_0[1];
	if (apex_classname_0 != null) {
		apex_classname_0 = apex_classname_0.split("?");
		if (apex_classname_0[0] != null) {
			apex_classname_0 = apex_classname_0[0];
		}
	}

	if (apex_classname_0 != null) {
		if (apex_classname_0 != current_apexclassname) {
			chrome.runtime.sendMessage({
				GetApexClassProperty: {
					"apexClassName": apex_classname_0
				}
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
		}
		current_apexclassname = apex_classname_0;
	}
};

var sendingCheckData = false;
Opkey.prototype.CheckRecorderEnabled = function () {
	if (sendingCheckData == false) {
		sendingCheckData = true;
		chrome.runtime.sendMessage({
			getHighlightStatus: "getHighlightStatus"
		}, function (response) {
			sendingCheckData = false;
			if (chrome.runtime.lastError) { }
			_opkey.canHighlight = response;
			if (document != null && document.title != null && (document.title === "TestDiscovery" || document.title === "Test Discovery")) {
				_opkey.canHighlight = false;
			}
			if (document.URL != null && document.URL.indexOf("/opkeyone/") > -1) {
				if (response == true) {
					_opkey.canHighlight = true;
				}
			}
		});
	}
};

Opkey.prototype.RuntimeMessageGatherer = function () {
	try {
		chrome.runtime.sendMessage({
			getHighlightStatus: "getHighlightStatus"
		}, function (response) {
			if (chrome.runtime.lastError) { }
			_opkey.canHighlight = response;
			if (document != null && document.title != null && (document.title === "TestDiscovery" || document.title === "Test Discovery")) {
				_opkey.canHighlight = false;
			}
			if (document.URL != null && document.URL.indexOf("/opkeyone/") > -1) {
				if (response == true) {
					_opkey.canHighlight = true;
				}
			}
			if (_opkey.canHighlight == true) {
				chrome.runtime.sendMessage({
					currentindexoftab: "fefef"
				}, function (response) {
					if (chrome.runtime.lastError) { }
					_opkey.indexofurrenttab = response;
					chrome.runtime.sendMessage({
						getplaybackdata: "fefef"
					}, function (response) {
						if (chrome.runtime.lastError) { }
						chrome.runtime.sendMessage({
							getRecordingMode: "getRecordingMode"
						}, function (response) {
							if (chrome.runtime.lastError) { }
							_opkey.recording_mode = response;
							localStorage.setItem("OPKEY_RECORDING_MODE", response);
							chrome.runtime.sendMessage({
								getHighLightPosition: "getHighLightPosition"
							}, function (response) {
								if (chrome.runtime.lastError) { }
								_opkey.highlightForAddon(response);
								chrome.runtime.sendMessage({
									GetAuthAcquired: "GetAuthAcquired"
								}, function (response) {
									if (chrome.runtime.lastError) { }
									_opkey.sales_auth_acquired = response;
									chrome.runtime.sendMessage({
										getAnchor: "setAnchors"
									}, function (response) {
										if (chrome.runtime.lastError) { }
										if (response != null) {
											if (response == true) {
												if (_opkey.currentelement != null) {
													if (_opkey.anchored_element == null) {
														_opkey.anchored_element = _opkey.currentelement;
													}
												}
											} else {
												_opkey.anchored_element = null;
											}
										}
									});
								});
							});
						});
					});
				});
			}
		});


	} catch (e) { }
}


function GetRelationWithString(el) {
	var anchor = _opkey.anchored_element;
	var relationStr = "";
	if (anchor) {
		var anchorStr = "";
		var elInfo = _opkey.identify(_opkey.getKnownTags(anchor));
		// console.log(JSON.stringify(elInfo));
		anchorStr = elInfo.apis[0].type + "(" + elInfo.apis[0].shortHand + ")";
		var elp = getAbsPosition(el)
		var anch = getAbsPosition(anchor)
		var elementtop = elp[0]
		var elementleft = elp[1]
		var anchortop = anch[0]
		var anchorleft = anch[1]

		if (anchor == el) {
			// do nothing
		} else {
			relation = "";
			var nodelist = document.getElementsByTagName("*");
			var i;
			for (i = 0; i < nodelist.length; i++) {
				if (nodelist[i] == el) {
					pivotindex1 = i
				}
				if (nodelist[i] == anchor) {
					anchindex = i
				}
			}
			if (pivotindex1 < anchindex) {
				pivotindex = anchindex - pivotindex1
			} else if (pivotindex1 > anchindex) {
				pivotindex = pivotindex1 - anchindex
			}
			relationStr = "_in(" + anchorStr + ") Depth=" + pivotindex
			// //console.log("Relation is "+relationStr)
			if (elementtop < anchortop && (anchortop - elementtop) > 30) {
				var nodelist = document.getElementsByTagName("*");
				var i;
				for (i = 0; i < nodelist.length; i++) {
					if (nodelist[i] == el) {
						pivotindex1 = i
					}
					if (nodelist[i] == anchor) {
						anchindex = i
					}
				}

				if (pivotindex1 < anchindex) {
					pivotindex = anchindex - pivotindex1
				} else if (pivotindex1 > anchindex) {
					pivotindex = pivotindex1 - anchindex
				}
				relationStr = "_aboveOf(" + anchorStr + ") Depth=" + pivotindex
			} else if (elementtop > anchortop && (elementtop - anchortop) > 30) {
				var nodelist = document.getElementsByTagName("*");
				var i;

				for (i = 0; i < nodelist.length; i++) {

					if (nodelist[i] == el) {
						pivotindex1 = i
					}

					if (nodelist[i] == anchor) {
						anchindex = i
					}
				}

				if (pivotindex1 < anchindex) {
					pivotindex = anchindex - pivotindex1
				} else if (pivotindex1 > anchindex) {
					pivotindex = pivotindex1 - anchindex
				}
				relationStr = "_belowOf(" + anchorStr + ") Depth=" + pivotindex
			} else if (elementleft < anchorleft) {
				var nodelist = document.getElementsByTagName("*");
				var i;
				for (i = 0; i < nodelist.length; i++) {

					if (nodelist[i] == el) {
						pivotindex1 = i
					}
					if (nodelist[i] == anchor) {
						anchindex = i
					}
				}

				if (pivotindex1 < anchindex) {
					pivotindex = anchindex - pivotindex1
				} else if (pivotindex1 > anchindex) {
					pivotindex = pivotindex1 - anchindex
				}
				relationStr = "_leftOf(" + anchorStr + ") Depth=" + pivotindex
			} else if (elementleft > anchorleft) {
				var nodelist = document.getElementsByTagName("*");
				var i;

				for (i = 0; i < nodelist.length; i++) {
					if (nodelist[i] == el) {
						pivotindex1 = i
					}
					if (nodelist[i] == anchor) {
						anchindex = i
					}
				}

				if (pivotindex1 < anchindex) {
					pivotindex = anchindex - pivotindex1
				} else if (pivotindex1 > anchindex) {
					pivotindex = pivotindex1 - anchindex
				}
				relationStr = "_rightOf(" + anchorStr + ") Depth=" + pivotindex;
				// //console.log("Relation is "+relationStr)
			}
		}
	}
	return relationStr;
}


Opkey.prototype.checkIsFirefox = function () {
	if (navigator.userAgent.indexOf("Firefox") != -1) {
		return true;
	}
	return false;
};

Opkey.prototype.isBlankOrNull = function (s) {
	return (s == "" || s == null);
};

Opkey.prototype.CreateBase64Image = function (action_event) {
	var width_bound = 0;
	var height_bound = 0;
	var x_cord = 0;
	var y_cord = 0;
	chrome.runtime.sendMessage({
		"captureElementImage": {
			x: x_cord,
			y: y_cord,
			width: width_bound,
			height: height_bound
		}
	}, function (response) {
		if (chrome.runtime.lastError) { }
	});
};


Opkey.prototype.CreateBase64ImageAttributes = function (element, object_refernce) {
	var width_bound = 0;
	var height_bound = 0;
	var _rect = element.getBoundingClientRect();
	var _offl = 0;
	var _offt = 0;
	width_bound = _rect.width;
	height_bound = _rect.height;
	if (width_bound == 0) {
		if (element.offsetWidth) {
			width_bound = element.offsetWidth;
		}
	}

	if (height_bound == 0) {
		if (element.offsetHeight) {
			height_bound = element.offsetHeight;
		}
	}
	if (width_bound == 0) {
		width_bound = 200;
	}
	if (height_bound == 0) {
		height_bound = 100;
	}
	if (window.top != window.self) {
		try {
			// var doc = element.ownerDocument;
			// var win = doc.defaultView || doc.parentWindow;
			// this._getFrames(win);
			if (this._framesList == null) {
				_offl = parseFloat(_opkey.currentIframeDetails.x);
				_offt = parseFloat(_opkey.currentIframeDetails.y);
			} else {
				if (this._framesList.length > 0) {
					for (var i = 0; i < this._framesList.length; i++) {
						var parentobject = this._framesList[i]
						_offl += parseFloat(parentobject.x);
						_offt += parseFloat(parentobject.y);
					}
				} else {
					_offl = parseFloat(_opkey.currentIframeDetails.x);
					_offt = parseFloat(_opkey.currentIframeDetails.y);
				}
			}
		} catch (e) {
			// _offl = parseFloat(_opkey.currentIframeDetails.x);
			// _offt = parseFloat(_opkey.currentIframeDetails.y);
		}
	}
	var x_cord = _offl + _rect.left;
	var y_cord = _offt + _rect.top;
	object_refernce["element:x"] = x_cord.toString();
	object_refernce["element:y"] = y_cord.toString();
	object_refernce["element:width"] = width_bound.toString();
	object_refernce["element:height"] = height_bound.toString();
};


Opkey.Dict = function () {
	this.keys = [];
	this.values = [];
	this.put = function (k, v) {
		this.keys.push(k);
		this.values.push(v);
	}
	this.get = function (k) {
		for (var i = 0; i < this.keys.length; i++) {
			if (this.keys[i] === k) return this.values[i];
		}
	}
}
Opkey.BLUR_TIMEOUT = 5000; // change 5000 to 1000
Opkey.DRAG_DROP_SPEED = 1;
Opkey.DRAG_DROP_SEGMENTS = 200;
Opkey.DRAG_DROP_WAVER = 1;
Opkey.DRAG_DROP_MAX_HOVER_AT_END = 5;
Opkey.prototype.storeDiagnostics = function () {
	if (this.diagnostics) return;
	this.diagnostics = new Object();
	var d = this.diagnostics;
	d["UserAgent"] = navigator.userAgent;
	d["Browser Name"] = navigator.appName;
	d["Browser Version"] = navigator.appVersion.substring(0, navigator.appVersion.indexOf(")") + 1);
	d["Native XMLHttpRequest"] = typeof XMLHttpRequest != "undefined";
	d["Java Enabled"] = navigator.javaEnabled();
	d["Cookie Enabled"] = ("" + document.cookie).indexOf("sahisid") != -1 // navigator.cookieEnabled
	// throws
	// an
	// exception
	// on
	// IE
	// on
	// showModalDialogs.
	this.addDiagnostics("OS");
	this.addDiagnostics("Java");
	gan();
};
Opkey.prototype.addDiagnostics = function (type) {
	var s = this.sendToServer("/_s_/dyn/ControllerUI_get" + type + "Info");
	if (s) {
		var properties = s.split("_$sahi$_;");
		for (var i = 0; i < properties.length; i++) {
			var prop = properties[i].split("_$sahi$_:");
			if (prop.length == 2) this.diagnostics[prop[0]] = prop[1];
		}
	}
};
Opkey.prototype.getDiagnostics = function (name) {
	if (!this.diagnostics) this.storeDiagnostics();
	if (name) {
		var v = this.diagnostics[name];
		return (v != null) ? v : "";
	}
	var s = "";
	for (var key in this.diagnostics) {
		s += key + ": " + this.diagnostics[key] + "\n";
	}
	return s;
};
Opkey.prototype.wrap = function (fn) {
	var el = this;
	if (this.wrapped[fn] == null) {
		this.wrapped[fn] = function () {
			return fn.apply(el, arguments);
		};
	}
	return this.wrapped[fn];
};
Opkey.prototype.alertMock = function (s) {
	if (this.isPlaying()) {
		this.setServerVar("lastAlertText", s);
		return null;
	} else {
		return this._alert(s);
	}
};
Opkey.prototype.confirmMock = function (s) {
	if (this.isPlaying()) {
		var retVal = eval(this.getServerVar("confirm: " + s));
		if (retVal == null) retVal = true;
		this.setServerVar("lastConfirmText", s);
		this.setServerVar("confirm: " + s, null);
		return retVal;
	} else {
		var retVal = this.callFunction(this.real_confirm, window, s);
		if (this.isRecording()) {
			this.recordStep(this.getExpectConfirmScript(s, retVal));
		}
		return retVal;
	}
};
Opkey.prototype.getExpectPromptScript = function (s, retVal) {
	return "_expectPrompt(" + this.quotedEscapeValue(s) + ", " + this.quotedEscapeValue(retVal) + ")";
}
Opkey.prototype.getExpectConfirmScript = function (s, retVal) {
	return "_expectConfirm(" + this.quotedEscapeValue(s) + ", " + retVal + ");"
}
Opkey.prototype.getNavigateToScript = function (url) {
	return "_navigateTo(" + this.quotedEscapeValue(url) + ");";
}
Opkey.prototype.promptMock = function (s) {
	if (this.isPlaying()) {
		var retVal = this.getServerVar("prompt: " + s); // this.promptReturnValue[s];
		if (retVal == null) retVal = "";
		this.setServerVar("lastPromptText", s);
		this.setServerVar("prompt: " + s, null);
		return retVal;
	} else {
		var retVal = this.callFunction(this.real_prompt, window, s);
		this.recordStep(this.getExpectPromptScript(s, retVal));
		return retVal;
	}
};
Opkey.prototype.printMock = function () {
	if (this.isPlaying()) {
		this.setServerVar("printCalled", true);
		return null;
	} else {
		return this.callFunction(this.real_print, window);
	}
};
Opkey.prototype.mockDialogs = function (win) {
	try {
		win.alert = this.wrap(this.alertMock);
		win.confirm = this.wrap(this.confirmMock);
		win.prompt = this.wrap(this.promptMock);
		win.print = this.wrap(this.printMock);
	} catch (b) {
		// //console.log(b);
	}

};
var _opkey = new Opkey();
var tried = false;
var _opkey_top = window.top;
_opkey.selfWin = window;
_opkey.windowWin = window;
_opkey.parentWin = window.parent;

Opkey.prototype.self = function () {
	return _opkey.selfWin;
}
Opkey.prototype.parent = function () {
	return _opkey.parentWin;
}
Opkey.prototype.top = function () {
	// Hack for frames named "top"
	try {
		// alert(_opkey_top.location.href);
		var x = _opkey_top.location.href; // test
		return _opkey_top;
	} catch (e) {
		var p = window;
		while (p != p._opkey.parent()) {
			try {
				var y = p._opkey.parent().location.href; // test
				p = p._opkey.parent();
			} catch (e) {
				return p;
			}
		}
		return p;
	}
};

// added by ganesh
Opkey.prototype.backupWindowVariables = function () {
	this.oldDocDomain = document.domain;
	this.__top = window.top;
	this.windowWin = this.selfWin = window;
	this.parentWin = window.parent;
	this.prevOnError = window.onerror;
	window.onerror = this.wrap(this.onError);
	this.real_execCommand = document.execCommand;
	document.execCommand = function () {
		return _opkey_dummyExecCommand.apply(document, arguments)
	}
};

/*
 * Opkey.prototype.top = function() { return
 * this.findFirstAccessibleFrame(this.absoluteTop()) };
 */
Opkey.prototype.absoluteTop = function () {
	return document.domain == this.oldDocDomain ? this.__top : window.top
};
Opkey.prototype.isWindowAccessible = function (a) {
	if (window == a) return !0;
	try {
		if (a.location.protocol) return !0
	} catch (b) {
		b = null
	}
	return !1
};
Opkey.prototype.findFirstAccessibleFrame = function (a) {
	if (this.isWindowAccessible(a)) return a;
	for (var b = 0; b < a.frames.length; b++) {
		// //this._debug("findFirstAccessibleFrame: b: " + b+" frame of b: " +
		// a.frames[b])
		var c = this.findFirstAccessibleFrame(a.frames[b]);
		if (c) return c
	}
	return null
};


Opkey.prototype.getKnownTags = function (src) {
	var el = src;
	// while (true) {
	if (!el) return el;
	if (!el.tagName) return null;
	var tagLC = el.tagName.toLowerCase();
	/*
	 * if (tagLC == "html" || tagLC == "body") { return null; }
	 */
	// else{
	// ////console.log("DONE RETURNIING")
	return el;
	// }
	/*
	 * for (var i=0; i<this.ADs.length; i++){ var d = this.ADs[i]; if
	 * (d.tag.toLowerCase() == tagLC){ return el; } } el = el.parentNode;
	 */
	// }
};
Opkey.prototype.byId = function (src) {
	var s = src.id;
	if (this.isBlankOrNull(s)) return "";
	return "getElementById('" + s + "')";
};
Opkey.prototype.getLink = function (src) {
	var lnx = this.getElementsByTagName("A", window.document);
	for (var j = 0; j < lnx.length; j++) {
		if (lnx[j] == src) {
			return "links[" + j + "]";
		}
	}
	return null;
};
Opkey.prototype.getElementsByTagName = function (tagName, doc) {
	return doc.getElementsByTagName(tagName.toLowerCase());
}

Opkey.prototype.areTagNamesEqual = function (tagName1, tagName2) {
	if (tagName1 == tagName2) return true;
	if (tagName1 == null || tagName2 == null) return false;
	return (tagName1.toLowerCase() == tagName2.toLowerCase());
}
Opkey.prototype.getImg = function (src) {
	var lnx = window.document.images;
	for (var j = 0; j < lnx.length; j++) {
		if (lnx[j] == src) {
			return "images[" + j + "]";
		}
	}
	return null;
};

Opkey.prototype.getForm = function (src) {
	if (!this.isBlankOrNull(src.name) && this.nameNotAnInputElement(src)) {
		return "forms['" + src.name + "']";
	}
	var fs = window.document.forms;
	for (var j = 0; j < fs.length; j++) {
		if (fs[j] == src) {
			return "forms[" + j + "]";
		}
	}
	return null;
};
Opkey.prototype.nameNotAnInputElement = function (src) {
	return (typeof src.name != "object");
};
// Opkey.prototype.getFormElement = function (src) {
// return this.getByTagName(src);
// };

// Opkey.prototype.getByTagName = function (src) {
// var tagName = src.tagName.toLowerCase();
// var els = this.getElementsByTagName(tagName, window.document);
// return "getElementsByTagName('" + tagName + "')[" + this.findInArray(els,
// src) + "]";
// };

// Opkey.prototype.getTable = function (src) {
// var tables = this.getElementsByTagName("table", window.document);
// if (src.id && src.id != null && src ==
// window.document.getElementById(src.id)) {
// return "getElementById('" + src.id + "')";
// }
// return "getElementsByTagName('table')[" + this.findInArray(tables, src) +
// "]";
// };

// Opkey.prototype.getTableCell = function (src) {
// var tables = window.document.getElementsByTagName("table");
// var row = this.getRow(src);
// if (row.id && row.id != null && row ==
// window.document.getElementById(row.id)) {
// return "getElementById('" + row.id + "').cells[" + src.cellIndex + "]";
// }
// var table = this.getTableEl(src);
// if (table.id && table.id != null && table ==
// window.document.getElementById(table.id)) {
// return "getElementById('" + table.id + "').rows[" + this.getRow(src).rowIndex
// + "].cells[" + src.cellIndex + "]";
// }
// return "getElementsByTagName('table')[" + this.findInArray(tables,
// this.getTableEl(src)) + "].rows[" + this.getRow(src).rowIndex + "].cells[" +
// src.cellIndex + "]";
// };

// Opkey.prototype.getRow = function (src) {
// return this.getParentNode(src, "tr");
// };

// Opkey.prototype.getTableEl = function (src) {
// return this.getParentNode(src, "table");
// };

Opkey.prototype.getArrayElement = function (s, src) {
	var tag = src.tagName.toLowerCase();
	if (tag == "input" || tag == "textarea" || tag.indexOf("select") != -1) {
		var el2 = eval(s);
		if (el2 == src) return s;
		var ix = -1;
		if (el2 && el2.length) {
			ix = this.findInArray(el2, src);
			return s + "[" + ix + "]";
		}
	}
	return s;
};

Opkey.prototype.getEncapsulatingLink = function (src) {
	return (this.areTagNamesEqual(src.tagName, "A") || this.areTagNamesEqual(src.tagName, "AREA")) ? src : this._parentNode(src, "A");
};
Opkey.prototype.linkClick = function (e) {
	if (!e) e = window.event;
	var performDefault = true;
	var el = this.getTarget(e);
	this.lastLink = this.getEncapsulatingLink(el);
	if (this.lastLink.__opkey__prevClick) {
		try {
			performDefault = this.lastLink.__opkey__prevClick.apply(this.lastLink, arguments);
		} catch (ex) { }
	}
	this.lastLinkEvent = e;
	if (performDefault != false && this.lastLink.getAttribute("href") != null) {
		window.setTimeout(function () {
			_opkey.navigateLink()
		}, 0);
	} else {
		return false;
	}
};
Opkey.prototype._dragDrop = function (draggable, droppable, offsetX, offsetY) {
	if (this.isFlexObj(draggable)) {
		droppable.setAsDroppable();
		return draggable.dragDrop();
	}
	this.fork();
	this.checkNull(draggable, "_dragDrop", 1, "draggable");
	this.checkNull(droppable, "_dragDrop", 2, "droppable");
	this.dragDropXYCommon(draggable, droppable, offsetX, offsetY, "DROP_RELATIVE");
};
Opkey.prototype.addBorder = function (el) {
	el.style.border = "1px solid red";
};
Opkey.prototype.getScrollOffsetY = function () {
	if (document.body.scrollTop) return document.body.scrollTop;
	if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop;
	if (window.pageYOffset) return window.pageYOffset;
	if (window.scrollY) return window.scrollY;
	return 0;
};
Opkey.prototype.getScrollOffsetX = function () {
	if (document.body.scrollLeft) return document.body.scrollLeft;
	if (document.documentElement && document.documentElement.scrollLeft) return document.documentElement.scrollLeft;
	if (window.pageXOffset) return window.pageXOffset;
	if (window.scrollX) return window.scrollX;
	return 0;
};
Opkey.prototype._dragDropXY = function (draggable, x, y, isRelative) {
	this.fork();
	if (this.isFlexObj(draggable)) {
		return draggable.dragDropXY(x, y);
	}
	this.checkNull(draggable, "_dragDropXY", 1, "draggable");
	return this.dragDropXYCommon(draggable, null, x, y, isRelative ? "DRAG_RELATIVE" : false);
};

var OpkeyDTProxy = function () {
	this.data = {};
};
OpkeyDTProxy.prototype.setData = function (df, d) {
	this.data[df] = d;
	return true;
};
OpkeyDTProxy.prototype.getData = function (df) {
	return this.data[df];
};
OpkeyDTProxy.prototype.clearData = function (df) {
	if (df) delete this.data[df];
	else this.data = {};
};
Opkey.DragDropper = function (draggable, droppable, offsetX, offsetY, isRelative) {
	this.draggable = draggable;
	this.droppable = droppable;
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	this.isRelative = isRelative;
	this.start = function () {
		// _opkey._alert(_opkey.findClientPos(this.droppable));
		this.dataTransfer = new OpkeyDTProxy();

		_opkey.simulateMouseEvent(this.draggable, "mouseover");
		_opkey.simulateMouseEvent(this.draggable, "mousemove");


		_opkey.simulateMouseEvent(this.draggable, "mousedown");
		_opkey.simulateMouseEvent(this.draggable, "mousemove");
		_opkey.simulateDragEvent(this.draggable, "dragstart", this.dataTransfer);
		_opkey.simulateDragEvent(this.draggable, "drag", this.dataTransfer);
		var initPos = _opkey.findClientPos(this.draggable);
		this.initPos = initPos;
		this.initX = initPos[0];
		this.initY = initPos[1];
		this.destX = 0;
		this.destY = 0;
		this.stage = 0;
		this.segments = Opkey.DRAG_DROP_SEGMENTS;
		this.endHoverCount = 0;
		this.lastMovedEl = null;
	}
	this.execute = function () {
		this.start();
		this.proceed();
	}
	this.proceed = function () {
		if (this.stage < this.segments) {
			this.stage++;
			this.move(this.stage);
			var o = this;
			window.setTimeout(function () {
				o.proceed()
			}, Opkey.DRAG_DROP_SPEED);
		} else {
			if (this.endHoverCount++ < Opkey.DRAG_DROP_MAX_HOVER_AT_END) {
				this.move(this.stage);
				var o = this;
				window.setTimeout(function () {
					o.proceed()
				}, Opkey.DRAG_DROP_SPEED);
			} else {
				this.finish();
				_opkey.afterEval();
			}
		}
	}

	this.move = function (i) {
		// recalculate the dest coordinates because it shifts if a containing
		// div scrolls.
		// Digite: 895227
		var pos = [0, 0];
		if (this.isRelative == "DRAG_RELATIVE") {
			var pos = this.initPos;
		} else if (this.isRelative == "DROP_RELATIVE") {
			var pos = _opkey.findClientPos(this.droppable);
		}
		this.destX = pos[0] + (this.offsetX ? this.offsetX : 0);
		this.destY = pos[1] + (this.offsetY ? this.offsetY : 0);
		var x1 = Math.floor(this.initX + i * (this.destX - this.initX) / this.segments);
		var y1 = Math.floor(this.initY + i * (this.destY - this.initY) / this.segments + (i % 2 == 0 ? Opkey.DRAG_DROP_WAVER : 0));
		var el2 = document.elementFromPoint(x1, y1);
		if (el2 != null) {
			try {
				if (this.lastMovedEl != el2) {
					if (this.lastMovedEl) {
						_opkey.simulateMouseEventXY(this.lastMovedEl, "mouseout", x1, y1);
						_opkey.simulateDragEventXY(this.lastMovedEl, "dragleave", x1, y1, this.dataTransfer);
					}
					_opkey.simulateMouseEventXY(el2, "mouseenter", x1, y1);
					_opkey.simulateMouseEventXY(el2, "mousemove", x1, y1);
					_opkey.simulateMouseEventXY(el2, "mouseover", x1, y1);
					_opkey.simulateMouseEventXY(el2, "mousemove", x1, y1);
					_opkey.simulateDragEventXY(el2, "dragenter", x1, y1, this.dataTransfer);
					// _opkey._highlight(el2);
					//                  
					this.lastMovedEl = el2;
				}
				// //_opkey._debug(this.initX + " " + this.destX + " " + x1 + "
				// " + y1);
				try {
					_opkey.simulateMouseEventXY(this.draggable, "mousemove", x1, y1);
					_opkey.simulateMouseEventXY(el2, "mousemove", x1, y1);
				} catch (e) {
					// _opkey._debug(e);
				}
				_opkey.simulateDragEventXY(this.draggable, "drag", x1, y1, this.dataTransfer);
				_opkey.simulateDragEventXY(el2, "dragover", x1, y1, this.dataTransfer);
				// _opkey._highlight(el2);
			} catch (e) {
				// _opkey._debug(e);
			}
		}
	}

	this.finish = function () {
		var x = this.destX;
		var y = this.destY;

		if (this.droppable) {
			_opkey.simulateMouseEventXY(this.droppable, "mousemove", x, y);
		}
		_opkey.simulateMouseEventXY(this.draggable, "mousemove", x, y);
		_opkey.simulateDragEventXY(this.draggable, "drag", x, y, this.dataTransfer);
		if (this.droppable && this.lastMovedEl != this.droppable) {
			_opkey.simulateMouseEventXY(this.lastMovedEl, "mouseout", x, y);
			_opkey.simulateDragEventXY(this.lastMovedEl, "dragleave", x, y, this.dataTransfer);
			_opkey.simulateDragEventXY(this.droppable, "dragenter", x, y, this.dataTransfer);
			_opkey.simulateMouseEventXY(this.droppable, "mouseover", x, y);
		}
		_opkey.simulateDragEventXY(this.draggable, "drag", x, y, this.dataTransfer);
		// this._alert('2');
		if (this.droppable) {
			_opkey.simulateDragEventXY(this.droppable, "dragover", x, y, this.dataTransfer);
			_opkey.simulateMouseEventXY(this.droppable, "mouseup", x, y); // needed
		}
		// draggable mouseup should be after droppable mouseup.
		// http://gramam/extjs/examples/dd/field-to-grid-dd.html
		// Not necessary.
		_opkey.simulateMouseEventXY(this.draggable, "mouseup", x, y);
		if (this.droppable) _opkey.simulateDragEventXY(this.droppable, "drop", x, y, this.dataTransfer);
		try {
			_opkey.simulateDragEventXY(this.draggable, "dragend", x, y, this.dataTransfer);
			_opkey.simulateMouseEventXY(this.draggable, "click", x, y);
			_opkey.simulateMouseEventXY(this.draggable, "mousemove", x, y);
			_opkey.simulateMouseEventXY(this.draggable, "mouseout", x, y);
		} catch (e) {
			// _opkey._debug(e);
			// Ignore. Can happen sometimes on IE. Digite issue 786516
		}
	}
}
Opkey.prototype.dragDropXYCommon = function (draggable, droppable, offsetX, offsetY, isRelative) {
	new Opkey.DragDropper(draggable, droppable, offsetX, offsetY, isRelative).execute();
}
Opkey.prototype.checkNull = function (el, fnName, paramPos, paramName) {
	if (el == null || !this._exists(el)) {
		var error = new Error("The " +
			(paramPos == 1 ? "first " : paramPos == 2 ? "second " : paramPos == 3 ? "third " : "") +
			"parameter passed to " + fnName + " was not found on the browser")
		error.isOpkeyError = true;
		throw error;
	}
};
Opkey.prototype.checkVisible = function (el) {
	if (this.strictVisibilityCheck && !this._isVisible(el)) {
		throw "" + el + " is not visible";
	}
};
Opkey.prototype.checkElementVisible = function (el) {
	if (!this.strictVisibilityCheck) return true;
	if (el.type && el.type == "hidden") return true;
	return this._isVisible(el);
}
Opkey.prototype._setStrictVisibilityCheck = function (b) {
	this.setServerVar("strictVisibilityCheck", b);
	this.strictVisibilityCheck = b;
}
Opkey.prototype._isVisible = function (el) {
	if (this.isFlexObj(el)) return el.isVisible();
	try {
		if (el == null) return false;
		var elOrig = el;
		var display = true;
		while (true) {
			display = display && this.isStyleDisplay(el);
			if (!display || el.parentNode == el || this.areTagNamesEqual(el.tagName, "BODY")) break;
			el = el.parentNode;
		}
		el = elOrig;
		var visible = true;
		while (true) {
			visible = visible && this.isStyleVisible(el);
			if (!visible || el.parentNode == el || this.areTagNamesEqual(el.tagName, "BODY")) break;
			el = el.parentNode;
		}
		return display && visible;
	} catch (e) {
		return false;
	}
};
Opkey.prototype._exists = function (el) {
	if (this.isFlexObj(el)) return el.exists();
	if (this.isApplet(el)) return el.exists();
	return el != null;
}
Opkey.prototype.isStyleDisplay = function (el) {
	var d = this._style(el, "display");
	return d == null || d != "none";
};
Opkey.prototype.isStyleVisible = function (el) {
	var v = this._style(el, "visibility");
	return v == null || v != "hidden";
};
Opkey.prototype.invokeLastBlur = function () {
	if (this.lastBlurFn) {
		window.clearTimeout(this.lastBlurTimeout);
		this.doNotRecord = true;
		this.lastBlurFn();
		this.doNotRecord = false;
		this.lastBlurFn = null;
	}
}
Opkey.prototype.setLastBlurFn = function (fn) {
	if (this.lastBlurTimeout) window.clearTimeout(this.lastBlurTimeout);
	this.lastBlurFn = fn;
	this.lastBlurTimeout = window.setTimeout(this.wrap(this.invokeLastBlur), Opkey.BLUR_TIMEOUT);
}
Opkey.prototype._click = function (el, combo) {

	this.checkNull(el, "_click");
	this.checkVisible(el);
	if (this.isApplet(el)) return el.click();
	if (this.isFlexObj(el)) return el.click();
	this.simulateClick(el, false, false, combo);
};

Opkey.prototype._doubleClick = function (el, combo) {
	this.checkNull(el, "_doubleClick");
	this.checkVisible(el);
	if (this.isFlexObj(el)) return el.doubleClick();
	this.simulateDoubleClick(el, false, true, combo);
};

Opkey.prototype._rightClick = function (el, combo) {
	this.checkNull(el, "_rightClick");
	this.checkVisible(el);
	if (this.isFlexObj(el)) return el.rightClick();
	this.simulateRightClick(el, true, false, combo);
};

Opkey.prototype._mouseOver = function (el, combo) {
	var el = this.__lastMousedOverElement
	this.checkNull(el, "_mouseOver");
	this.checkVisible(el);
	if (this.isFlexObj(el)) return el.mouseOver();
	this.simulateMouseEvent(el, "mousemove");
	this.simulateMouseEvent(el, "mouseover");

	this.setLastBlurFn(function () {
		try {
			_opkey.simulateMouseEvent(el, "mousemove");
			_opkey.simulateMouseEvent(el, "mouseout");
			_opkey.simulateMouseEvent(el, "blur");
		} catch (e) { }
	});
};
Opkey.prototype._mouseDown = function (el, isRight, combo) {
	if (this.isFlexObj(el)) return el.mouseDown();
	this.simulateMouseEvent(el, "mousedown", isRight, false, combo);
}
Opkey.prototype._mouseUp = function (el, isRight, combo) {
	if (this.isFlexObj(el)) return el.mouseUp();
	this.simulateMouseEvent(el, "mouseup", isRight, false, combo);
}
Opkey.prototype._keyPress = function (el, val, combo) {
	var append = (el && el.type && (el.type == "text" || el.type == "password" || el.type == "textarea") && this.shouldAppend(el));
	this.simulateKeyPressEvents(el, val, combo, append);
}
Opkey.prototype.simulateKeyPressEvents = function (el, val, combo, append) {
	var origVal = el.value;
	var keyCode = 0;
	var charCode = 0;
	var c = null;
	if (typeof val == "number") {
		charCode = val;
		keyCode = this.getKeyCode(charCode);
		c = String.fromCharCode(charCode);
	} else if (typeof val == "object") {
		keyCode = val[0];
		charCode = val[1];
		c = String.fromCharCode(charCode);
	} else if (typeof val == "string") {
		charCode = val.charCodeAt(0);
		keyCode = this.getKeyCode(charCode);
		c = val;
	}
	var isShift = (charCode >= 65 && charCode <= 90);
	if (isShift) combo = "" + combo + "|SHIFT|";
	this.simulateKeyEvent([(isShift ? 16 : keyCode), 0], el, "keydown", combo);
	if (this.isSafariLike()) {
		this.simulateKeyEvent([keyCode, charCode], el, "keypress", combo);
	} else {
		this.simulateKeyEvent([0, charCode], el, "keypress", combo);
	}
	if (append && charCode != 10 && origVal == el.value) {
		if (!this._isFF4Plus() || (this._isFF4Plus() && !(combo == "CTRL" || combo == "ALT")))
			el.value += c;
	}
	this.simulateKeyEvent([keyCode, 0], el, "keyup", combo);
};
Opkey.prototype._keyPressEvent = function (el, codes, combo) {
	this.checkNull(el, "_keyPressEvent", 1);
	this.checkVisible(el);
	this.simulateKeyEvent(((typeof codes == "object") ? codes : [0, codes]), el, "keypress", combo);
};
Opkey.prototype._focus = function (el) {
	try {
		el.focus();
	} catch (e) { }
	this.simulateEvent(el, "focus");
};

Opkey.prototype._blur = function (el) {
	this.simulateEvent(el, "blur");
};
Opkey.prototype._removeFocus = Opkey.prototype._blur;
Opkey.prototype._keyDown = function (el, codes, combo) {
	this.checkNull(el, "_keyDown", 1);
	this.checkVisible(el);
	this.simulateKeyEvent(((typeof codes == "number") ? [codes, 0] : codes), el, "keydown", combo);
};
Opkey.prototype._keyUp = function (el, codes, combo) {
	this.checkNull(el, "_keyUp", 1);
	this.checkVisible(el);
	this.simulateKeyEvent(((typeof codes == "number") ? [codes, 0] : codes), el, "keyup", combo);
};
Opkey.prototype._closeWindow = function (win) {
	if (!win) {
		try {
			win = _opkey_top.window;
		} catch (e) {
			win = window;
		}
	}
	if (win) {
		win.open("", "_self");
		win.close();
	}
};
Opkey.prototype._activeElement = function (win) {
	if (!win) win = this.top();
	var el = win.document.activeElement;
	var tagLC = el.tagName.toLowerCase();
	if (tagLC == "iframe" || tagLC == "frame") {
		return this._activeElement(el.contentWindow);
	}
	return el;
}
// Opkey.prototype._readFile = function (fileName) {
// return this._evalOnRhino("_readFile("+this.quotedEscapeValue(fileName)+")");
// };
// Opkey.prototype._readCSVFile = function (fileName) {
// return
// this._evalOnRhino("_readCSVFile("+this.quotedEscapeValue(fileName)+")");
// };
Opkey.prototype._getDB = function (driver, jdbcurl, username, password) {
	return new Opkey.dB(driver, jdbcurl, username, password, this);
};
Opkey.dB = function (driver, jdbcurl, username, password, sahi) {
	this.driver = driver;
	this.jdbcurl = jdbcurl;
	this.username = username;
	this.password = password;
	this.select = function (sql) {
		var qs = "driver=" + this.driver + "&jdbcurl=" + this.jdbcurl + "&username=" + this.username + "&password=" + this.password + "&sql=" + sql;
		return eval(sahi._callServer("net.sf.sahi.plugin.DBClient_select", qs));
	};
	this.update = function (sql) {
		var qs = "driver=" + this.driver + "&jdbcurl=" + this.jdbcurl + "&username=" + this.username + "&password=" + this.password + "&sql=" + sql;
		return eval(sahi._callServer("net.sf.sahi.plugin.DBClient_execute", qs));
	};
};

Opkey.prototype.isCheckboxRadioSimulationRequired = function () {
	if (this._isChrome()) {
		return this.chromeExplicitCheckboxRadioToggle;
	}
	return this.isSafariLike();
};
Opkey.prototype.simulateDoubleClick = function (el, isRight, isDouble, combo) {
	var n = el;
	var callBlur = true;
	if (this._isFF() || this.isSafariLike() || this._isOpera()) {
		this.simulateMouseEvent(el, "mousemove");
		this.simulateMouseEvent(el, "mouseover");
		this.simulateMouseEvent(el, "mousedown", isRight, false, combo);
		this.invokeLastBlur();
		callBlur = this.isFocusableFormElement(el);
		if (callBlur) this.simulateEvent(el, "focus");
		this.simulateMouseEvent(el, "mouseup", isRight, false, combo);
		this.simulateMouseEvent(el, "click", isRight, false, combo);
		this.simulateMouseEvent(el, "mousedown", isRight, isDouble, combo);
		this.simulateMouseEvent(el, "mouseup", isRight, isDouble, combo);
		this.simulateMouseEvent(el, "click", isRight, isDouble, combo);
		this.simulateMouseEvent(el, "dblclick", isRight, isDouble, combo);
	} else if (this._isIE() && !this._isIE9PlusStrictMode()) {
		this.simulateMouseEvent(el, "mousemove");
		this.simulateMouseEvent(el, "mouseover");
		this.simulateMouseEvent(el, "mousedown", isRight, false, combo);
		this.invokeLastBlur();
		if (this._isIE()) this.simulateEvent(el, "focusin");
		this.simulateMouseEvent(el, "focus");
		this.simulateMouseEvent(el, "mouseup", isRight, false, combo);
		this.simulateMouseEvent(el, "click", isRight, false, combo);
		this.simulateMouseEvent(el, "mouseup", isRight, false, combo);
		this.simulateMouseEvent(el, "dblclick", isRight, isDouble, combo);
	} else if (this._isIE9PlusStrictMode()) {
		this.simulateMouseEvent(el, "mousemove");
		this.simulateMouseEvent(el, "mouseover");
		this.simulateMouseEvent(el, "mousedown", isRight, false, combo);
		this.invokeLastBlur();
		if (this._isIE11Plus()) {
			this.simulateEvent(el, "beforeactivate");
			this.simulateEvent(el, "activate");
		}
		if (this._isIE()) this.simulateEvent(el, "focusin");
		this.simulateMouseEvent(el, "focus");
		this.simulateMouseEvent(el, "mouseup", isRight, false, combo);
		this.simulateMouseEvent(el, "click", isRight, false, combo);
		this.simulateMouseEvent(el, "mousedown", isRight, isDouble, combo);
		this.simulateMouseEvent(el, "mouseup", isRight, isDouble, combo);
		this.simulateMouseEvent(el, "click", isRight, isDouble, combo);
		this.simulateMouseEvent(el, "dblclick", isRight, isDouble, combo);
		if (this._isIE11Plus()) {
			this.simulateEvent(el, "deactivate");
		}
	}
	if (callBlur) {
		this.setLastBlurFn(function () {
			try {
				_opkey.simulateMouseEvent(el, "mousemove");
				_opkey.simulateMouseEvent(el, "mouseout");
				if (!(_opkey._isFF() || _opkey._isIE9PlusStrictMode() || _opkey._isOpera()) && (el.type == "checkbox" || el.type == "radio")) {
					_opkey.simulateEvent(el, "change");
				}
				if (_opkey._isIE()) _opkey.simulateEvent(el, "focusout");
				_opkey.simulateEvent(el, "blur");
			} catch (e) { }
		});
	}
};
Opkey.prototype.simulateRightClick = function (el, isRight, isDouble, combo) {
	var n = el;
	var callBlur = true;
	if (this._isFF() || this.isSafariLike() || this._isOpera()) {
		this.simulateMouseEvent(el, "mousemove");
		this.simulateMouseEvent(el, "mouseover");
		this.simulateMouseEvent(el, "mousedown", isRight, false, combo);
		this.invokeLastBlur();

		callBlur = this.isFocusableFormElement(el);
		if (callBlur) {
			this.simulateEvent(el, "focus");
		}
		this.simulateMouseEvent(el, "mouseup", isRight, false, combo);
		this.simulateMouseEvent(el, "contextmenu", isRight, false, combo);
	} else if (this._isIE()) {
		this.simulateMouseEvent(el, "mousemove");
		this.simulateMouseEvent(el, "mouseover");
		this.simulateMouseEvent(el, "mousedown", isRight, false, combo);
		this.invokeLastBlur();
		if (this._isIE11Plus()) {
			this.simulateEvent(el, "beforeactivate");
			this.simulateEvent(el, "activate");
		}
		this.simulateEvent(el, "focusin");
		this.simulateMouseEvent(el, "focus");
		this.simulateMouseEvent(el, "mouseup", isRight, false, combo);
		this.simulateMouseEvent(el, "contextmenu", isRight, false, combo);
		if (this._isIE11Plus()) {
			this.simulateEvent(el, "deactivate");
		}
	}
	if (callBlur) {
		this.setLastBlurFn(function () {
			try {
				_opkey.simulateMouseEvent(el, "mousemove");
				_opkey.simulateMouseEvent(el, "mouseout");
				if (!(_opkey._isFF() || _opkey._isIE9PlusStrictMode() || _opkey._isOpera()) && (el.type == "checkbox" || el.type == "radio")) {
					_opkey.simulateEvent(el, "change");
				}
				if (_opkey._isIE()) _opkey.simulateEvent(el, "focusout");
				_opkey.simulateEvent(el, "blur");
			} catch (e) { }
		});
	}
};
Opkey.prototype.isFocusableFormElement = function (el) {
	if (!this.isFormElement(el)) return false;
	if (this.isSafariLike() && (el.type == "checkbox" || el.type == "radio" || el.type == "button")) return false;
	return true;
}
Opkey.prototype.simulateClick = function (el, isRight, isDouble, combo) {
	var n = el;

	var link = this.getEncapsulatingLink(n);
	// This is required only for FF right now.
	// Definitely FF3.6
	// Need to check which other versions
	if (link != null && (this._isFF())) {
		link.__opkey__prevClick = link.onclick;
		var elWin = this.getWindow(link);
		link.onclick = function (e) {
			// test with docWriteIFrame
			return _opkey.wrap(_opkey.linkClick)(e ? e : elWin.event);
		};
	}

	this.simulateMouseEvent(el, "mousemove");
	this.simulateMouseEvent(el, "mouseover");
	this.simulateMouseEvent(el, "mousedown", isRight, false, combo);
	this.invokeLastBlur();
	if (this._isIE11Plus()) {
		this.simulateEvent(el, "beforeactivate");
		this.simulateEvent(el, "activate");
	}
	var focusBlur = this.isFocusableFormElement(el);
	if (focusBlur) {
		if (this._isIE()) this.simulateEvent(el, "focusin");
		this.simulateEvent(el, "focus");
	}
	this.simulateMouseEvent(el, "mouseup", isRight, false, combo);
	try {
		if (this._isIE() && el && (this.areTagNamesEqual(el.tagName, "LABEL") ||
			(link != null) ||
			(el.type && (el.type == "submit" ||
				el.type == "reset" || el.type == "image" ||
				el.type == "checkbox" || el.type == "radio")))) {
			if (link != null) {
				this.markStepDone(this.currentStepId, this.currentType);
			}
			el.click();
		} else {
			if (window.opera) {
				// for opera single clicks don't simulate click event;
				// Ignoring old comment, seems click is required now. 01 Nov
				// 2010
				this.simulateMouseEvent(el, "click", isRight, isDouble, combo);
				if (this.areTagNamesEqual(el.tagName, "INPUT") && (el.type == "radio" || el.type == "checkbox")) {
					this.simulateEvent(el, "change");
				}
			} else {
				var done = false;
				if (this.isCheckboxRadioSimulationRequired()) {
					if (this.areTagNamesEqual(el.tagName, "INPUT")) {
						if (el.type == "radio" || el.type == "checkbox") {
							done = true;
							el.checked = (el.type == "radio") ? true : !el.checked;
							this.simulateEvent(el, "change");
							this.simulateMouseEvent(el, "click", isRight, isDouble, combo);
						}
					}
				}
				if (!done) this.simulateMouseEvent(el, "click", isRight, isDouble, combo);
			}
		}
	} catch (e) { }
	if (this._isIE11Plus()) {
		this.simulateEvent(el, "deactivate");
	}
	if (focusBlur) {
		this.setLastBlurFn(function () {
			try {
				_opkey.simulateMouseEvent(el, "mousemove");
				_opkey.simulateMouseEvent(el, "mouseout");
				if (!(_opkey._isFF() || _opkey._isIE9PlusStrictMode() || _opkey._isOpera()) && (el.type == "checkbox" || el.type == "radio")) {
					_opkey.simulateEvent(el, "change");
				}
				if (_opkey._isIE()) _opkey.simulateEvent(el, "focusout");
				_opkey.simulateEvent(el, "blur");
			} catch (e) { }
		});
	}
	if (link != null && (this._isFF())) {
		link.onclick = link.__opkey__prevClick;
	}
};
Opkey.prototype.getWebkitVersion = function () {
	var exp = /AppleWebKit\/(.*) \(/;
	exp.test(this.navigator.userAgent);
	return RegExp.$1;
}
Opkey.prototype.getChromeBrowserVersion = function () {
	var exp = /Chrome\/(.*) /;
	exp.test(this.navigator.userAgent);
	return RegExp.$1
}
Opkey.prototype.simulateMouseEvent = function (el, type, isRight, isDouble, combo) {
	var xy = this.findClientPos(el);
	var x = xy[0];
	var y = xy[1];
	this.simulateMouseEventXY(el, type, xy[0], xy[1], isRight, isDouble, combo);
};
Opkey.prototype.simulateDragEvent = function (el, type, dataTransfer, combo) {
	var xy = this.findClientPos(el);
	var x = xy[0];
	var y = xy[1];
	this.simulateDragEventXY(el, type, xy[0], xy[1], dataTransfer, combo);
}
Opkey.prototype.simulateDragEventXY = function (el, type, x, y, dataTransfer, combo) {
	var isRight = false;
	var isDouble = false;
	if (!combo) combo = "";
	var isShift = combo.indexOf("SHIFT") != -1;
	var isCtrl = combo.indexOf("CTRL") != -1;
	var isAlt = combo.indexOf("ALT") != -1;
	var isMeta = combo.indexOf("META") != -1;

	if (this._isIE() && !this._isIE11Plus()) {
		var evt = el.ownerDocument.createEventObject();
		evt.clientX = x;
		evt.clientY = y;
		evt.ctrlKey = isCtrl;
		evt.altKey = isAlt;
		evt.metaKey = isMeta;
		evt.shiftKey = isShift;
		if (type == "mousedown" || type == "mouseup" || type == "mousemove") {
			evt.button = isRight ? 2 : 1;
		}
		// evt.dataTransfer = dataTransfer;
		el.fireEvent(this.getEventTypeName(type), evt);
		evt.cancelBubble = true;
	} else if (this._isFF()) {
		var evt = el.ownerDocument.createEvent("DragEvents");
		evt.initDragEvent(
			type,
			true, // can bubble
			true, // cancelable
			el.ownerDocument.defaultView, // view
			(isDouble ? 2 : 1), // detail
			x, // screen x
			y, // screen y
			x, // client x
			y, // client y
			isCtrl,
			isAlt,
			isShift,
			isMeta,
			isRight ? 2 : 0, // button
			null, // relatedTarget
			dataTransfer
		);
		el.dispatchEvent(evt);
	} else if (this._isChrome() || this._isIE11Plus()) {
		var evt = el.ownerDocument.createEvent("HTMLEvents");
		evt.initEvent(
			type,
			true, // can bubble
			true, // cancelable
			el.ownerDocument.defaultView, // view
			(isDouble ? 2 : 1), // detail
			x, // screen x
			y, // screen y
			x, // client x
			y, // client y
			isCtrl,
			isAlt,
			isShift,
			isMeta,
			isRight ? 2 : 0, // button
			null // relatedTarget
		);
		evt.dataTransfer = dataTransfer;
		el.dispatchEvent(evt);
	}
}
Opkey.prototype.simulateMouseEventXY = function (el, type, x, y, isRight, isDouble, combo) {
	if (!combo) combo = "";
	var isShift = combo.indexOf("SHIFT") != -1;
	var isCtrl = combo.indexOf("CTRL") != -1;
	var isAlt = combo.indexOf("ALT") != -1;
	var isMeta = combo.indexOf("META") != -1;

	if (!this._isIE() || (this._isIE9PlusStrictMode() && !(type == "click" && isDouble))) {
		if (this.isSafariLike() || this._isIE9PlusStrictMode() || this._isOpera()) {
			if (el.ownerDocument.createEvent) {
				var evt = el.ownerDocument.createEvent('HTMLEvents');
				type = type;
				evt.initEvent(type, true, true);
				evt.clientX = x;
				evt.clientY = y;
				evt.pageX = x + this.getScrollOffsetX();
				evt.pageY = y + this.getScrollOffsetY();
				evt.screenX = x;
				evt.screenY = y;
				evt.button = isRight ? 2 : 0;
				evt.which = isRight ? 3 : 1;
				evt.detail = isDouble ? 2 : (type == "contextmenu" ? 0 : 1);
				evt.ctrlKey = isCtrl;
				evt.altKey = isAlt;
				evt.metaKey = isMeta;
				evt.shiftKey = isShift;
				el.dispatchEvent(evt);
			}
		} else {
			// FF
			var evt = el.ownerDocument.createEvent("MouseEvents");
			evt.initMouseEvent(
				type,
				true, // can bubble
				true, // cancelable
				el.ownerDocument.defaultView, // view
				(isDouble ? 2 : 1), // detail
				x + this.getScrollOffsetX(), // screen x
				y + this.getScrollOffsetY(), // screen y
				x, // client x
				y, // client y
				isCtrl,
				isAlt,
				isShift,
				isMeta,
				isRight ? 2 : 0, // button
				null // relatedTarget
			);
			el.dispatchEvent(evt);
		}
	}
	if (this.checkForDuplicateEventsOnIE9Plus(el, type) && !this._isIE11Plus()) {
		// IE
		var evt = el.ownerDocument.createEventObject();
		evt.clientX = x + this.getScrollOffsetX();
		evt.clientY = y + this.getScrollOffsetY();
		evt.ctrlKey = isCtrl;
		evt.altKey = isAlt;
		evt.metaKey = isMeta;
		evt.shiftKey = isShift;
		if (type == "mousedown" || type == "mouseup" || type == "mousemove") {
			evt.button = isRight ? 2 : 1;
		}
		el.fireEvent(this.getEventTypeName(type), evt);
		evt.cancelBubble = true;
	}
};
Opkey.prototype.checkForDuplicateEventsOnIE9Plus = function (el, type) {
	if (!this._isIE()) return false;
	if (!this._isIE9Plus()) return true;
	return ((el["on" + type] == null) || (el["on" + type] != null && !this._isIE9PlusStrictMode()));
}
Opkey.prototype.addOffset = function (el, origin) {
	var x = origin[0];
	var y = origin[1];
	var offsets = this.xyoffsets.get(el);
	if (offsets) {
		var ox = offsets[0];
		var width = parseInt(this._style(el, "width"));
		if (ox < 0 && (("" + width) != "NaN")) ox = width + ox;
		x += ox;

		var oy = offsets[1];
		var height = parseInt(this._style(el, "height"));
		if (oy < 0 && (("" + height) != "NaN")) oy = height + oy;
		y += oy;
	}
	return [x, y];
}
Opkey.prototype.isWindowAccessible = function (win) {
	if (window == win) return true;
	// ////console.log("iswindowaccessible");
	try {
		var x = win.location.protocol;
		if (x) return true;
	} catch (e) {
		e = null;
	}
	return false;
};
Opkey.prototype._getSelectionText = function (win) {
	if (!win) win = this.top();
	if (this.isWindowAccessible(win)) {
		var el = win.document.activeElement;
		var selectedText = null;
		if ((this._isFF() || this._isIE11Plus()) && el && ((this.findInArray(this.textboxTypes, el.type) != -1) || el.type == "textarea")) {
			var startPos = el.selectionStart;
			var endPos = el.selectionEnd;
			selectedText = el.value.substring(startPos, endPos);
		} else {
			var userSelection;
			if (win.getSelection && (!this._isIE9PlusStrictMode() || this._isIE11Plus())) {
				userSelection = win.getSelection();
			} else if (win.document.selection) {
				userSelection = win.document.selection.createRange();
			}
			selectedText = userSelection;
			if (userSelection.text != undefined)
				selectedText = userSelection.text;
			else
				selectedText = "" + userSelection;
		}
		if (!this.isBlankOrNull(selectedText)) return selectedText;
	}
	for (var i = 0; i < win.frames.length; i++) {
		var f = win.frames[i];
		var t = this._getSelectionText(f);
		if (!this.isBlankOrNull(t)) return t;
	}
	return "";
}
Opkey.pointTimer = 0;
Opkey.prototype.highlightandkeep = function (el) {
	try {
		if (_opkey.lasthighlightedelementfordomfetching != null) {
			_opkey.lasthighlightedelementfordomfetching.classList.remove("OPkeyHighlighter")
		}
		if (!el.classList.contains("LoaderOverlay")) {
			el.classList.add("OPkeyHighlighter");
		}
		_opkey.lasthighlightedelementfordomfetching = el
	} catch (e) { }
};

Opkey.prototype._highlightForObiq = function (el) {
	return new Promise(resolve => {
		try {
			if (!el) {
				resolve();
				return;
			}

			// Remove previous highlight if any
			if (_opkey.lastObiqHighlightedElement) {
				_opkey.lastObiqHighlightedElement.classList.remove("OPkeyHighlighter");
				_opkey.lastObiqHighlightedElement = null;
			}

			// Add the highlight class
			el.classList.add("OPkeyHighlighter");
			_opkey.lastObiqHighlightedElement = el;

			// If the class is already applied, resolve immediately.
			if (el.classList.contains("OPkeyHighlighter")) {
				resolve();
				return;
			}

			// Otherwise, watch for changes to the class attribute.
			const observer = new MutationObserver(mutations => {
				for (const mutation of mutations) {
					if (
						mutation.attributeName === "class" &&
						el.classList.contains("OPkeyHighlighter")
					) {
						observer.disconnect();
						resolve();
						break;
					}
				}
			});
			observer.observe(el, { attributes: true });
		} catch (e) {
			console.error(e);
			resolve();
		}
	});
};




Opkey.prototype._unhighlightForObiq = function (el) {
	debugger
	window.setTimeout(function () {


		try {
			if (el == null) {
				return;
			}

			el.classList.remove("OPkeyHighlighter");
		} catch (e) { }
	}, 500);
}
Opkey.prototype._highlight = function (el) {
	//fixed for highlight issue of Service NOW
	if (_opkey.lasthighlightedelementfordomfetching != null) {

		_opkey.lasthighlightedelementfordomfetching.classList.remove("OPkeyHighlighter")
		if (el.style.outline != null && el.style.outline.indexOf("red dotted 2px") > -1) {
			el.style.outline = '';
			el.style.boxShadow = '';
			el.style.outlineOffset = '';
		}
	}
	if (this.isFlexObj(el)) return el.highlight();
	if (this.isApplet(el)) return el.highlight();
	if (Opkey.lastUnhighlight) {
		Opkey.lastUnhighlight();
		window.clearTimeout(Opkey.unhighlightTimer);
	}

	try {
		if (!el.classList.contains("LoaderOverlay")) {
			el.classList.add("OPkeyHighlighter")
			if (el.style.outline != null && el.style.outline.indexOf("red dotted 2px") == -1) {


				el.style.outline = 'red dotted 2px ';
				el.style.boxShadow = 'none ';
				el.style.outlineOffset = '-2px ';
			}
		}
		/*
		 * var oldBorder = el.style.border; var oldOutline = el.style.outline;
		 * el.style.border = "0.5px solid red"; el.style.outline = "0.5px solid
		 * red";
		 */
		Opkey.lastUnhighlight = function () {


			el.classList.remove("OPkeyHighlighter")
			if (el.style.outline != null && el.style.outline.indexOf("red dotted 2px") > -1) {

				el.style.outline = '';
				el.style.boxShadow = '';
				el.style.outlineOffset = '';
			}
		}
		Opkey.unhighlightTimer = window.setTimeout(Opkey.lastUnhighlight, 1000);
	} catch (e) { }
};
Opkey.prototype._position = function (el) {
	return this.findPos(el);
};
Opkey.prototype.findPosX = function (obj) {
	return this.findPos(obj)[0];
};
Opkey.prototype.findPosY = function (obj) {
	return this.findPos(obj)[1];
};
Opkey.prototype.findClientPos = function (el) {
	if (typeof el.getBoundingClientRect == "function") {
		var r = el.getBoundingClientRect();
		return this.addOffset(el, [r.left, Math.round(r.top)]); // trying
		// clientRect
		// for now.
		// Remove below
		// code later.
	} else {
		var xy = this.findPos(el);
		// alert(xy[1] +" " + (xy[1]-this.getScrollOffsetY()));
		return [xy[0] - this.getScrollOffsetX(), xy[1] - this.getScrollOffsetY()];
	}
}
Opkey.prototype.findPos = function (el, isClient) {
	var obj = el;
	var x = 0,
		y = 0;
	if (obj.offsetParent) {
		while (obj) {
			if (this.areTagNamesEqual(obj.tagName, "MAP")) {
				var res = this.getBlankResult();
				obj = this.findTagHelper("#" + obj.name, this.getDomRelAr(this.getWindow(obj)), "IMG", res, "useMap").element;
				if (obj == null) break;
			}
			var wasStatic = null;
			/*
			 * if (this._style(obj, "position") == "static"){ wasStatic =
			 * obj.style.position; obj.style.position = "relative"; }
			 */
			x += obj.offsetLeft;
			y += obj.offsetTop;
			if (wasStatic != null) obj.style.position = wasStatic;
			obj = obj.offsetParent;
		}
	} else if (obj.x) {
		x = obj.x;
		y = obj.y;
	}
	return this.addOffset(el, [x, y]);
};
Opkey.prototype.getWindow = function (el) {
	var win;
	if (this.isSafariLike()) {
		win = this.getWin(el);
	} else {
		win = el.ownerDocument.defaultView; // FF
		if (!win) win = el.ownerDocument.parentWindow; // IE
	}
	return win;
};

Opkey.prototype.navigateLink = function () {
	var ln = this.lastLink;
	if (!ln) return;
	if (this.lastLinkEvent.getPreventDefault) {
		if (this.lastLinkEvent.getPreventDefault()) return;
	}
	if ((this._isIE() || this.isSafariLike()) && this.lastLinkEvent.returnValue == false) return;
	var win = this.getWindow(ln);
	if (ln.href.indexOf("javascript:") == 0) {
		var s = ln.href.substring(11);
		win.setTimeout(unescape(s), 0);
	} else {
		var target = ln.target;
		if (ln.target == null || ln.target == "") {
			target = this.getBaseTarget(win);
			if (target == null || target == "") target = "_self";
		}
		// if (!this.loaded) return; // happens if onclick caused unload via
		// form submit. uncomment only if needed.
		var ancestor = this.getNamedWindow(win, target);
		if (ancestor) {
			if (this.isSafariLike()) {
				try {
					ancestor._opkey.onBeforeUnLoad();
				} catch (e) {
					// //this._debug(e.message);
				}
			}
			ancestor.location = ln.href;
		} else {
			win.open(ln.href, target);
		}
	}
};
Opkey.prototype.getNamedWindow = function (win, target) {
	return this.getNamedAncestor(win, target) || this.getNamedFrame(win, target);
}
Opkey.prototype.getNamedAncestor = function (win, target) {
	try {
		var w = win;
		if (target == "_self") return w;
		if (target == "_parent") return win.parent;
		if (target == "_top") return win.top;
		for (var i = 0; i < 100; i++) {
			if (w.name == target) return w;
			if (w == w.parent) return null;
			w = w.parent;
		}
	} catch (e) { }
}
Opkey.prototype.getNamedFrame = function (win, target) {
	try {
		var res = this.getBlankResult();
		var el = this.findTagHelper(target, win, "iframe", res, "name").element;
		if (el != null) return (el.contentWindow ? el.contentWindow : el);
		res = this.getBlankResult();
		el = this.findTagHelper(target, win, "frame", res, "name").element;
		if (el != null) return el;
	} catch (e) { }
}
Opkey.prototype.getBaseTarget = function (win) {
	var bs = this.getElementsByTagName("BASE", win.document);
	for (var i = bs.length - 1; i >= 0; i--) {
		var t = bs[i].target;
		if (t && t != "") return t;
	}
}
Opkey.prototype.getClickEv = function (el) {
	var e = new Object();
	if (this._isIE()) el.srcElement = e;
	else e.target = el;
	e.stopPropagation = this.noop;
	return e;
};

Opkey.prototype.noop = function () { };

// api for link click end

Opkey.prototype._type = function (el, val) {
	for (var i = 0; i < val.length; i++) {
		var charCode = val.charAt(i).charCodeAt(0);
		this.simulateKeyEvent(charCode, el, "keydown");
		this.simulateKeyEvent(charCode, el, "keypress");
		this.simulateKeyEvent(charCode, el, "keyup");
	}
};

Opkey.prototype._setValue = function (el, val) {
	if (val == null) {
		return
	};
	if (this.isApplet(el)) return el.setValue(val);
	if (this.isFlexObj(el)) return el.setValue(val);
	this.invokeLastBlur();
	this.setValue(el, val);
};

Opkey.prototype.shouldAppend = function (el) {
	return !((this._isFF() && !this._isFF4Plus() && !this._isHTMLUnit()) || el.readOnly || el.disabled);
}
// api for set value start
Opkey.prototype.setValue = function (el, val) {
	this.checkNull(el, "_setValue", 1);
	this.checkVisible(el);
	if (el.nodeName == "DIV") {
		el.innerText = val;
		return;
	}
	// try{
	// this.getWindow(el).focus();
	// }catch(e){}
	if (this._isIE()) {
		el.setActive();
		this.simulateEvent(el, "focusin");
	}
	this.simulateEvent(el, "focus");

	val = "" + val;
	var ua = this.navigator.userAgent.toLowerCase();
	if (ua.indexOf("windows") != -1) {
		val = val.replace(/\r/g, '');
		if (!this._isFF() || this._getFFVersion() >= 12) val = val.replace(/\n/g, '\r\n');
	} else if (ua.indexOf("macintosh")) {
		val = val.replace(/\r\n/g, '\r');
		val = val.replace(/\n/g, '\r');
	} else if (ua.indexOf("linux") != -1) {
		val = val.replace(/\r\n/g, '\n');
		val = val.replace(/\r/g, '\n');
	}
	var prevVal = el.value;
	// if (!window.document.createEvent) el.value = val;
	if (this._isFF4Plus()) this._focus(el); // test with textarea.sah
	if (el.type && (el.type == "hidden")) {
		el.value = val;
		return;
	} else if (el.type && (el.type == "range" || el.type == "date")) {
		el.value = val;
	} else if (el.type && el.type.indexOf("select") != -1) { } else {
		var append = (el && el.type && (this.findInArray(this.textboxTypes, el.type) != -1) && this.shouldAppend(el));
		el.value = "";
		if (typeof val == "string") {
			var len = val.length;
			if (el.maxLength && el.maxLength >= 0 && val.length > el.maxLength)
				len = el.maxLength;
			for (var i = 0; i < len; i++) {
				var c = val.charAt(i);
				this.simulateKeyPressEvents(el, c, null, append);
			}
		}
	}
	if (el.hasAttribute("ng-model") && typeof angular !== "undefined") {
		const model = el.getAttribute('ng-model');

		// Sanitize element ID and model name
		const cleanElId = el.id.replace(/[^a-zA-Z0-9\-_]/g, '');
		const cleanModel = model.replace(/[^a-zA-Z0-9\._]/g, '');

		// Optional: Validate model against whitelist (recommended for security)
		const ALLOWED_MODELS = ['username', 'email', 'comment']; // Add your allowed model names
		if (!ALLOWED_MODELS.includes(cleanModel.split('.')[0])) {
			console.warn(`Blocked unsafe model name: ${cleanModel}`);
			return;
		}

		const element = document.getElementById(cleanElId);
		if (element) {
			const scope = angular.element(element).scope();
			if (scope) {
				// Resolve nested scope paths like "user.name"
				const parts = cleanModel.split('.');
				let obj = scope;
				for (let i = 0; i < parts.length - 1; i++) {
					obj = obj[parts[i]];
					if (typeof obj === 'undefined') return;
				}
				obj[parts[parts.length - 1]] = val;
				scope.$apply();
			} else {
				console.warn("Angular scope not found.");
			}
		} else {
			console.warn("Element not found for ID:", cleanElId);
		}
	}

	var triggerOnchange = prevVal != val;
	this.setLastBlurFn(function () {
		try {
			// on IE9, sequence is change, deactivate, focusout, blur
			// others change, blur, focusout
			if (triggerOnchange) {
				if (!_opkey._isFF3())
					_opkey.simulateEvent(el, "change");
			}
			if (_opkey._isIE()) {
				_opkey.simulateEvent(el, "deactivate");
				_opkey.simulateEvent(el, "focusout");
			}
			if (_opkey._isIE()) {
				el.blur();
			}
			_opkey.simulateEvent(el, "blur");
			if (!_opkey._isIE()) _opkey.simulateEvent(el, "focusout");
		} catch (e) { }
	});
};
Opkey.prototype._setFile = function (el, v, url) {
	if (v == null) return;
	if (!url) {
		url = (!el.form || this.isBlankOrNull(el.form.action) || (typeof el.form.action != "string")) ? this.getWindow(el).location.href : el.form.action;
		if (url && (q = url.indexOf("?")) != -1) url = url.substring(0, q);
		if (url.indexOf("http") != 0) {
			var loc = window.location;
			if (url.indexOf("/") == 0) {
				url = loc.protocol + "//" + loc.hostname + (loc.port ? (':' + loc.port) : '') + url;
			} else {
				var winUrl = loc.href;
				url = winUrl.substring(0, winUrl.lastIndexOf('/') + 1) + url;
			}
		}
	}
	var msg = this._callServer("FileUpload_setFile", "n=" + el.name + "&v=" + this.encode(v) + "&action=" + this.encode(url));
	if (msg != "true") {
		throw new Error(msg);
	}
};
Opkey.prototype._setFile2 = function (el, v, url) {
	this._setFile(el, v, url);
	if (this._isIE()) {
		el.outerHTML = el.outerHTML.replace(/type=['"]?file['"]?/, "type=text");
		var idn = el.name;
		if (idn == "") idn = el.id;
		if (idn != "") {
			var el2 = this._textbox(idn);
			this._setValue(el2, v);
			this._blur(el2);
		}
	} else {
		el.type = "text";
		this._setValue(el, v);
		this._blur(el);
	}
}
Opkey.prototype.simulateEvent = function (target, evType) {
	// fix for tramada IE9 onchange not triggered.
	// IE9 in strict mode requires both useCreateEvent and useCreateEventObject

	var useCreateEvent = !this._isIE() || this._isIE11Plus(); // IE 9 in
	// strict mode
	// or any non IE
	// browser
	var useCreateEventObject = this._isIE() && !this._isIE11Plus();
	if (useCreateEvent) {
		var evt = new Object();
		evt.type = evType;
		evt.button = 0;
		evt.bubbles = true;
		evt.cancelable = true;
		// //this._debug("simulateEvent: " + evt.type + " target: " + target);
		if (!target) return;
		var event = target.ownerDocument.createEvent("HTMLEvents");
		event.initEvent(evt.type, evt.bubbles, evt.cancelable);
		target.dispatchEvent(event);
	}
	if (useCreateEventObject) {
		var evt = target.ownerDocument.createEventObject();
		evt.type = evType;
		evt.bubbles = true;
		evt.cancelable = true;
		evt.cancelBubble = true;
		target.fireEvent(this.getEventTypeName(evType), evt);
	}
};
Opkey.prototype.getKeyCode = function (charCode) {
	return (charCode >= 97 && charCode <= 122) ? charCode - 32 : charCode;
}
Opkey.prototype.simulateKeyEvent = function (codes, target, evType, combo) {
	var keyCode = codes[0];
	var charCode = codes[1];
	if (!combo) combo = "";
	var isShift = combo.indexOf("SHIFT") != -1;
	var isCtrl = combo.indexOf("CTRL") != -1;
	var isAlt = combo.indexOf("ALT") != -1;
	var isMeta = combo.indexOf("META") != -1;

	if (!this._isIE() || this._isIE9PlusStrictMode()) { // FF chrome safari
		// opera
		if (this.isSafariLike() || window.opera || this._isIE9PlusStrictMode()) {
			if (target.ownerDocument.createEvent) {
				var event = target.ownerDocument.createEvent('HTMLEvents');

				var bubbles = true;
				var cancelable = true;
				var evt = event;
				if (!window.opera) {
					// this may not have any effect.
					evt.bubbles = bubbles;
					evt.cancelable = cancelable;
				}
				evt.ctrlKey = isCtrl;
				evt.altKey = isAlt;
				evt.metaKey = isMeta;
				evt.charCode = charCode;
				evt.keyCode = (evType == "keypress") ? charCode : keyCode;
				evt.shiftKey = isShift;
				evt.which = evt.keyCode;
				evt.initEvent(evType, bubbles, cancelable); // don't use
				// evt.bubbles etc.
				// because it may be
				// readonly and
				// never be set to
				// true. Chrome
				// enter on extjs.
				target.dispatchEvent(evt);
			}
		} else { // FF
			var evt = new Object();
			evt.type = evType;
			evt.bubbles = true;
			evt.cancelable = true;
			evt.ctrlKey = isCtrl;
			evt.altKey = isAlt;
			evt.metaKey = isMeta;
			evt.keyCode = keyCode;
			evt.charCode = charCode;
			evt.shiftKey = isShift;

			if (!target) return;
			var event = target.ownerDocument.createEvent("KeyEvents");
			event.initKeyEvent(evt.type, evt.bubbles, evt.cancelable, target.ownerDocument.defaultView,
				evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, evt.keyCode, evt.charCode);
			target.dispatchEvent(event);
		}
	}
	if (this._isIE() && !this._isIE11Plus()) { // IE
		var evt = target.ownerDocument.createEventObject();
		evt.type = evType;
		evt.bubbles = true;
		evt.cancelable = true;
		var xy = this.findClientPos(target);
		evt.clientX = xy[0];
		evt.clientY = xy[1];
		evt.ctrlKey = isCtrl;
		evt.altKey = isAlt;
		evt.metaKey = isMeta;
		evt.keyCode = (this._isIE() && evType == "keypress") ? charCode : keyCode;
		evt.shiftKey = isShift; // c.toUpperCase().charCodeAt(0) ==
		// evt.charCode;
		evt.shiftLeft = isShift;
		evt.cancelBubble = true;
		evt.target = target;
		target.fireEvent(this.getEventTypeName(evType), evt);
	}
};
Opkey.prototype.getEventTypeName = function (type) {
	return ((typeof MooTools) == "object") ? type : ("on" + type);
};
Opkey.prototype._simulateMouseEvent = Opkey.prototype.simulateMouseEvent;
Opkey.prototype._simulateMouseEventXY = Opkey.prototype.simulateMouseEventXY;
Opkey.prototype._simulateKeyEvent = Opkey.prototype.simulateKeyEvent;
Opkey.prototype.selectOption = function (el, val, isCTRL) {
	var combo = isCTRL ? "CTRL" : null;
	var optionEl = this._option(val, this._in(el));
	if (!optionEl) throw new Error("Option not found: " + val);
	if (this._isIE()) {
		this.simulateMouseEvent(el, "mousedown", false, false, combo);
		this.simulateMouseEvent(el, "mouseup", false, false, combo);
		optionEl.selected = true;
		this.simulateMouseEvent(el, "change");
		this.simulateMouseEvent(el, "click", false, false, combo);
	} else if (this._isFF()) {
		optionEl.selected = true;
		this.simulateMouseEvent(optionEl, "mousedown", false, false, combo);
		this.simulateMouseEvent(optionEl, "mouseup", false, false, combo);
		this.simulateMouseEvent(el, "change");
		this.simulateMouseEvent(optionEl, "click", false, false, combo);
	} else {
		optionEl.selected = true;
		this.simulateMouseEvent(el, "change");
	}
}
Opkey.prototype._setSelected = function (el, val, append) {
	if (val == null) return;
	this.checkNull(el, "_setSelected");
	this.checkVisible(el);
	if (this.isApplet(el)) return el.setSelected(val);
	if (this.isFlexObj(el)) return el.set(val);
	// reset _under related params so that option does not use _under
	this.xyoffsets = new Opkey.Dict();
	// this.alignY = this.alignX = null;


	var l = el.options.length;
	var optionEl = null;
	if (el.type == "select-one") {
		this.simulateMouseEvent(el, "mousedown");
		if (this._isIE()) this.simulateEvent(el, "focusin");
		this.simulateEvent(el, "focus");
		this.simulateMouseEvent(el, "mouseup");
		this.simulateMouseEvent(el, "click");
		this.selectOption(el, val);
		return;
	} else {
		if (!this.isArray(val)) val = [val];
		if (!append) {
			for (var i = 0; i < l; i++) {
				el.options[i].selected = false;
			}
		}
		for (var i = 0; i < val.length; i++) {
			var isCTRL = (i > 0 || append); // use ctrl for first option if
			// append is true.
			this.selectOption(el, val[i], isCTRL);
		}
	}
	this.setLastBlurFn(function () {
		try {
			if (_opkey._isIE()) _opkey.simulateEvent(el, "focusout");
			_opkey.simulateEvent(el, "blur");
		} catch (e) { }
	});
};

// api for set value end
Opkey.prototype._check = function (el) {
	this.checkNull(el, "_check");
	if (el.checked) return;
	this._click(el);
}
Opkey.prototype._uncheck = function (el) {
	this.checkNull(el, "_uncheck");
	if (!el.checked) return;
	this._click(el);
}
Opkey.prototype._wait = function (i, condn) {
	return condn ? eval(condn) : false;
};
Opkey.prototype._accessor = function (n) {
	return eval(n);
};
Opkey.prototype._byId = function (id) {
	return this.findElementById(this.top(), id);
};
Opkey.prototype._byText = function (text, tag) {
	var res = this.getBlankResult();
	return this.tagByText({
		relations: [],
		window: this.top(),
		positionals: []
	}, text, tag, res).element;
};
Opkey.prototype._byXPath = function (xpath, inEl) {
	inEl = (inEl && inEl.type == "dom" && inEl.relation == "_in") ? inEl.element : inEl;
	var doc = inEl ? this.getWindow(inEl).document : this.top().document;
	var prefix = "";
	if (inEl) {
		var tagName = inEl.tagName;
		var ix = this.findInArray(this.getElementsByTagName(tagName, doc), inEl);
		prefix = "//" + tagName.toLowerCase() + "[" + (ix + 1) + "]";
	}
	// if (!inEl) inEl = this.top().document;
	var res = doc.evaluate(prefix + xpath, doc, null, 0, null);
	switch (res.resultType) {
		case 1:
			return res.numberValue;
		case 2:
			return res.stringValue;
		case 3:
			return res.booleanValue;
	}
	var el = res.iterateNext();
	return el;
	// var els = new Array();
	// while (true) {
	// var el = res.iterateNext();
	// if (!el) break;
	// els.push(el);
	// }
	// return els;
}
Opkey.prototype._byClassName = function (className, tagName, inEl) {
	var inEl = this.getDomRelAr(arguments);
	var res = this.getBlankResult();
	var el = this.findTagHelper(className, inEl, tagName, res, "className").element;
	return el;
};
Opkey.prototype.byName = function (name, tagName, inEl) {
	var inEl = this.getDomRelAr(arguments);
	var res = this.getBlankResult();
	var el = this.findTagHelper(name, inEl, tagName, res, "name").element;
	return el;
};
Opkey.prototype._spandiv = function (id, inEl) {
	var el = this._span.apply(this, arguments);
	if (el == null) el = this._div.apply(this, arguments);
	return el;
};
Opkey.prototype.tagByText = function (win, id, tagName, res) {
	var o = this.getArrayNameAndIndex(id);
	var ix = o.index;
	var fetch = o.name;
	var els = this.getElementsByTagName(tagName, this.getDoc(win));
	for (var i = 0; i < els.length; i++) {
		var el = els[i];
		var text = this._getText(el);

		if (this.isTextMatch(text, fetch)) {
			res.cnt++;
			if (res.cnt == ix || ix == -1) {
				res.element = this.innerMost(el, id, tagName);
				res.found = true;
				return res;
			}
		}
	}
	return this.recurseInFrames(this.tagByText, win, res, arguments);
};
Opkey.prototype.isTextMatch = function (sample, pattern) {
	if (pattern instanceof RegExp)
		return sample.match(pattern);
	return (sample == pattern);
};
Opkey.prototype.innerMost = function (el, re, tagName) {
	for (var i = 0; i < el.childNodes.length; i++) {
		var child = el.childNodes[i];
		var text = this._getText(child);
		if (text && this.contains(text, re)) {
			var inner = this.innerMost(child, re, tagName);
			if (this.areTagNamesEqual(inner.nodeName, tagName)) return inner;
		}
	}
	return el;
};
Opkey.prototype._simulateEvent = function (el, ev) {
	if (this._isIE()) {
		var newFn = (eval("el.on" + ev.type)).toString();
		newFn = newFn.replace("anonymous()", "s_anon(s_ev)", "g").replace("event", "s_ev", "g");
		eval(newFn);
		s_anon(ev);
	} else {
		eval("el.on" + ev.type + "(ev);");
	}
};
Opkey.prototype._setGlobal = function (name, value) {
	// //this._debug("SET name="+name+" value="+value);
	this.setServerVar(name, value, true);
};
Opkey.prototype._getGlobal = function (name) {
	var value = this.getServerVar(name, true);
	// //this._debug("GET name="+name+" value="+value);
	return value;
};
Opkey.prototype._set = function (name, value) {
	this.locals[name] = value;
};
Opkey.prototype._get = function (name) {
	var value = this.locals[name];
	return value;
};
Opkey.prototype._assertNotNull = function (n, s) {
	if (n == null) throw new OpkeyAssertionException(1, s);
	if (this.isFlexObj(n) && !n.exists()) throw new OpkeyAssertionException(1, s);
	return true;
};
Opkey.prototype._assertExists = Opkey.prototype._assertNotNull;
Opkey.prototype._assertNull = function (n, s) {
	if (n != null) throw new OpkeyAssertionException(2, s);
	return true;
};
Opkey.prototype._assertNotExists = Opkey.prototype._assertNull;
Opkey.prototype._assertTrue = function (n, s) {
	if (n != true) throw new OpkeyAssertionException(5, s);
	return true;
};
Opkey.prototype._assert = Opkey.prototype._assertTrue;
Opkey.prototype._assertNotTrue = function (n, s) {
	if (n) throw new OpkeyAssertionException(6, s);
	return true;
};
Opkey.prototype._assertFalse = Opkey.prototype._assertNotTrue;


Opkey.prototype._assertEqual = function (expected, actual, s) {
	if (this.isArray(expected) && this.isArray(actual))
		return this._assertEqualArrays(expected, actual, s);
	if (!this.areEqualParams(this.trim(actual), this.checkRegex(this.trim(expected))))
		throw new OpkeyAssertionException(3, (s ? s : "") + "\nExpected:" + this.toJSON(expected) + "\nActual:" + this.toJSON(actual) + "");
	return true;
};

Opkey.prototype._extract = function (str, pattern, onlyGroups) {
	var match = str.match(this.checkRegex(pattern));
	if (match == null) return false; // in case of no matches
	if (onlyGroups) match.splice(0, 1);
	return match;
};

Opkey.prototype.isArray = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}
Opkey.prototype._assertEqualArrays = function (expected, actual, s) {
	var compareResult = this.compareArrays(expected, actual);
	if (compareResult != "equal") throw new OpkeyAssertionException(3, (s ? s : "") + "\n" + compareResult);
	return true;
};

Opkey.prototype._assertNotEqual = function (expected, actual, s) {
	if (this.areEqualParams(this.trim(actual), this.checkRegex(this.trim(expected))))
		throw new OpkeyAssertionException(4, s);
	return true;
};
Opkey.prototype._assertContainsText = function (expected, el, s) {
	if (!this._containsText(el, expected))
		throw new OpkeyAssertionException(3, (s ? s : "") + "\nExpected:" + this.toJSON(expected) + " to be part of " + this.toJSON(this._getText(el)) + "");
	return true;
};
Opkey.prototype._assertNotContainsText = function (expected, el, s) {
	if (this._containsText(el, expected))
		throw new OpkeyAssertionException(3, (s ? s : "") + "\nExpected:" + this.toJSON(expected) + " not to be part of " + this.toJSON(this._getText(el)) + "");
	return true;
};
Opkey.prototype._imageCompareScoreExtractorFn = function (s) {
	var ar = s.split(" ");
	return parseInt(ar[ar.length - 1]);
}
Opkey.prototype._getSelectedText = function (el) {
	return this.getSelectBoxText(el, true);
}
Opkey.prototype.getSelectBoxText = function (el, selectedOnly) {
	try {
		if (selectedOnly && el.type == "select-one") return this._getText(el.options[el.selectedIndex]);
		var ar = [];
		var opts = el.options;
		var l = el.options.length;
		var val = "";
		for (var i = 0; i < l; i++) {
			var opt = opts[i];
			if (!selectedOnly || opt.selected) {
				ar.push(this._getText(opt));
				if (val != "") {
					val += ";";
				}
				val += this._getText(opt)
			}
		}
		if (ar.length > 0) return val;
	} catch (e) { }
};
// Opkey.prototype._option = function (el, val) {
// var o = this.getArrayNameAndIndex(id);
// var imgIx = o.index;
//
// var opts = el.options;
// var l = opts.length;
// var optionEl = null;
// if (typeof val == "string" || val instanceof RegExp){
// for (var i = 0; i < l; i++) {
// var opt = opts[i];
// if (this.areEqual(opt, "sahiText", val) ||
// this.areEqual(opt, "value", val) ||
// this.areEqual(opt, "id", val)) {
// optionEl = opt;
// }
// }
// } else if (typeof val == "number" && opts.length > val){
// optionEl = opts[val];
// }
// return optionEl;
// };
Opkey.prototype._getText = function (el) {
	if (this.isApplet(el)) return el.getText();
	if (this.isFlexObj(el)) return el.getText();
	this.checkNull(el, "_getText");
	if (el && el.type) {
		if ((el.type == "text" || el.type == "password" || (el.type == "button" && this.areTagNamesEqual(el.tagName, "INPUT")) || el.type == "textarea" || el.type == "submit") && el.value) return el.value;
		// if (el.type=="select-one" || el.type == "select-multiple") return
		// this._getSelectedText(el);
	}
	return this.trim(this._getTextNoTrim(el));
};
Opkey.prototype._getValue = function (el) {
	if (this.isFlexObj(el)) return el.getValue();
	if (this.isApplet(el)) return el.getValue();
	return el.value;
};
Opkey.prototype._getAttribute = function (el, attr) {
	return el[attr];
};
Opkey.prototype._getTextNoTrim = function (el) {
	this.checkNull(el, "_getTextNoTrim");
	if (el.tagName) {
		if (el.tagName.toLowerCase() == "option") return el.text.replace(/\u00A0/g, ' ');
		else if (el.type == "select-one" || el.type == "select-multiple") {
			return this.getSelectBoxText(el, false);
		}
	}
	// if (this._isIE() || this.isSafariLike()) return el.innerText;
	if (this._isIE() || (this.isSafariLike() && !this._isChrome())) return el.innerText || el.textContent || "";
	var html = el.innerHTML;
	if (!html) return el.textContent; // text nodes
	if (html.indexOf("<br") == -1 && html.indexOf("<BR") == -1) return el.textContent;
	if (document.createElement) {
		var x = document.createElement(el.tagName);
		x.innerHTML = el.innerHTML.replace(/<br[\/]*>/ig, " ");
		return x.textContent;
	}
	return el.textContent;
};
Opkey.prototype._getCellText = Opkey.prototype._getText;
Opkey.prototype.getRowIndexWith = function (txt, tableEl) {
	var r = this.getRowWith(txt, tableEl);
	return (r == null) ? -1 : r.rowIndex;
};
Opkey.prototype.getRowWith = function (txt, tableEl) {
	for (var i = 0; i < tableEl.rows.length; i++) {
		var r = tableEl.rows[i];
		for (var j = 0; j < r.cells.length; j++) {
			if (this.areEqualParams(this._getText(r.cells[j]), this.checkRegex(txt))) {
				return r;
			}
		}
	}
	return null;
};
Opkey.prototype.getColIndexWith = function (txt, tableEl) {
	for (var i = 0; i < tableEl.rows.length; i++) {
		var r = tableEl.rows[i];
		for (var j = 0; j < r.cells.length; j++) {
			if (this.areEqualParams(this._getText(r.cells[j]), this.checkRegex(txt))) {
				return j;
			}
		}
	}
	return -1;
};
Opkey.prototype._alert = function (s) {
	return this.callFunction(this.real_alert, window, s);
};
Opkey.prototype._lastAlert = function () {
	var v = this.getServerVar("lastAlertText");
	return v;
};
Opkey.prototype._clearLastAlert = function () {
	this.setServerVar("lastAlertText", null);
};
Opkey.prototype._clearLastConfirm = function () {
	this.setServerVar("lastConfirmText", null);
};
Opkey.prototype._clearLastPrompt = function () {
	this.setServerVar("lastPromptText", null);
};
Opkey.prototype._eval = function (s) {
	this.xyoffsets = new Opkey.Dict();
	// this.alignY = this.alignX = null;
	return eval(s);
};
Opkey.prototype._call = function (s) {
	return s;
};
Opkey.prototype._random = function (n) {
	return Math.floor(Math.random() * (n + 1));
};
Opkey.prototype._savedRandom = function (id, min, max) {
	if (min == null) min = 0;
	if (max == null) max = 10000;
	var r = this.getServerVar("srandom" + id);
	if (r == null || r == "") {
		r = min + this._random(max - min);
		this.setServerVar("srandom" + id, r);
	}
	return r;
};
Opkey.prototype._resetSavedRandom = function (id) {
	this.setServerVar("srandom" + id, "");
};


Opkey.prototype._expectConfirm = function (text, value) {
	this.setServerVar("confirm: " + text, value);
};
Opkey.prototype._saveDownloadedAs = function (filePath) {
	this._callServer("SaveAs_saveLastDownloadedAs", "destination=" + this.encode(filePath));
};
Opkey.prototype._lastDownloadedFileName = function () {
	var fileName = this._callServer("SaveAs_getLastDownloadedFileName");
	if (fileName == "-1") return null;
	return fileName;
};
Opkey.prototype._clearLastDownloadedFileName = function () {
	this._callServer("SaveAs_clearLastDownloadedFileName");
};
Opkey.prototype._saveFileAs = function (filePath) {
	this._callServer("SaveAs_saveTo", filePath);
};
Opkey.prototype.callFunction = function (fn, obj, args) {
	if (fn.apply) {
		return fn.apply(obj, [args]);
	} else {
		return fn(args);
	}
};
Opkey.prototype._lastConfirm = function () {
	var v = this.getServerVar("lastConfirmText");
	return v;
};
Opkey.prototype._lastPrompt = function () {
	var v = this.getServerVar("lastPromptText");
	return v;
};

Opkey.prototype._expectPrompt = function (text, value) {
	this.setServerVar("prompt: " + text, value);
};
Opkey.prototype._prompt = function (s) {
	this.fork(60000);
	var r = this.callFunction(this.real_prompt, window, s);
	this.afterEval();
	return r;
};
Opkey.prototype._confirm = function (s) {
	this.fork(60000);
	var r = this.callFunction(this.real_confirm, window, s);
	this.afterEval();
	return r;
};
Opkey.prototype._print = function (s) {
	return this.callFunction(this.real_print, window, s);
};
Opkey.prototype._printCalled = function () {
	return this.getServerVar("printCalled");
};
Opkey.prototype._clearPrintCalled = function () {
	return this.setServerVar("printCalled", null);
};

Opkey.prototype.arrayIndexOf = function (array, value) {
	for (var itr = 0; itr < array.length; itr++) {
		if (array[itr] === value) return itr;
	}
	return -1;
};
Opkey.prototype._cell = function (id, row, col) {
	if (id == null) return null;
	if (row == null && col == null) {
		return this.findCell(id, this.getDomRelAr(arguments));
	}
	if (row != null && (this.arrayIndexOf(["_in", "_near", "_under", "_above", "_leftOf", "_rightOf", "_rowOf", "_colOf"], row.relation) != -1)) {
		return this.findCell(id, this.getDomRelAr(arguments));
	}

	var rowIx = row;
	var colIx = col;
	if (typeof row == "string" || row instanceof RegExp) {
		rowIx = this.getRowIndexWith(row, id);
		if (rowIx == -1) return null;
	}
	if (typeof col == "string" || col instanceof RegExp) {
		colIx = this.getColIndexWith(col, id);
		if (colIx == -1) return null;
	}
	if (id.rows[rowIx] == null) return null;
	return id.rows[rowIx].cells[colIx];
};
Opkey.prototype.x_row = function (tableEl, rowIx) {
	if (typeof rowIx == "string") {
		return this.getRowWith(rowIx, tableEl);
	}
	if (typeof rowIx == "number") {
		return tableEl.rows[rowIx];
	}
	return null;
};
Opkey.prototype._containsHTML = function (el, htm) {
	return this.contains(el.innerHTML, htm)
};
Opkey.prototype._containsText = function (el, txt) {
	return this.contains(this._getText(el), txt)
};
Opkey.prototype.contains = function (orig, substr) {
	substr = this.checkRegex(substr);
	if (substr instanceof RegExp)
		return orig.match(substr) != null;
	return orig.indexOf(substr) != -1;
}

Opkey.prototype._contains = function (parent, child) {
	if (parent == null) return false;
	var c = child;
	while (true) {
		// //console.log("Running relationloop")
		if (c == parent) return true;
		if (c == null || c == c.parentNode) return false;
		c = c.parentNode;
	}
};
Opkey.prototype._popup = function (n) {
	if (this.top().name == n || this.getTitle() == n) {
		return this.top();

	}
	throw new OpkeyNotMyWindowException(n);
};
Opkey.prototype._domain = function (n) {
	if (document.domain == n) {
		return this.top();
	}
	throw new OpkeyNotMyDomainException(n);
};
Opkey.prototype._log = function (s, type) {
	if (!type) type = "info";
	this.logPlayBack(s, type);
};
Opkey.prototype._navigateTo = function (url, force) {
	if (force || this.top().location.href != url) {
		// this.top().location.href = url;
		window.setTimeout("_opkey.top().location.href = '" + url.replace(/'/g, "\\'") + "'", 0); // for
		// _navigateTo(relUrl)
		// from
		// controller
	}
};
Opkey.prototype._callServer = function (cmd, qs) {
	return this.sendToServer("/_s_/dyn/" + cmd + (qs == null ? "" : ("?" + qs)));
};
Opkey.prototype._removeMock = function (pattern) {
	return this._callServer("MockResponder_remove", "pattern=" + pattern);
};
Opkey.prototype._addMock = function (pattern, clazz) {
	if (clazz == null) clazz = "MockResponder_simple";
	return this._callServer("MockResponder_add", "pattern=" + pattern + "&class=" + clazz);
};
Opkey.prototype._mockImage = function (pattern, clazz) {
	if (clazz == null) clazz = "MockResponder_mockImage";
	return this._callServer("MockResponder_add", "pattern=" + pattern + "&class=" + clazz);
};
Opkey.prototype._debug = function (s) {
	return this._callServer("Debug_toOut", "msg=Debug: " + this.encode(s));
};
Opkey.prototype._debugToErr = function (s) {
	return this._callServer("Debug_toErr", "msg=" + this.encode(s));
};
Opkey.prototype._debugToFile = function (s, file) {
	if (file == null) return;
	return this._callServer("Debug_toFile", "msg=" + this.encode(s) + "&file=" + this.encode(file));
};
Opkey.prototype._enableKeepAlive = function () {
	this.sendToServer('/_s_/dyn/Configuration_enableKeepAlive');
};
Opkey.prototype._disableKeepAlive = function () {
	this.sendToServer('/_s_/dyn/Configuration_disableKeepAlive');
};
Opkey.prototype.getWin = function (el) {
	if (el == null) return this.self();
	if (el.nodeName.indexOf("document") != -1) return this.getFrame1(this.top(), el);
	return this.getWin(el.parentNode);
};
// finds window to which a document belongs
Opkey.prototype.getFrame1 = function (win, doc) {
	if (win.document == doc) return win;
	var frs = win.frames;
	for (var j = 0; j < frs.length; j++) {
		var sub = this.getFrame1(frs[j], doc);
		if (sub != null) {
			return sub;
		}
	}
	return null;
};
Opkey.prototype.areEqual2 = function (el, param, value) {
	if (param == "sahiText") {
		var str = this._getTextNoTrim(el);
		if (value instanceof RegExp) {
			str = this.trim(str);
			return str != null && str.match(value) != null;
		}
		if (str.length - value.length > 1000) return false;
		return (this.trim(str) == this.trim(value));
	} else {
		return this.areEqualParams(el[param], value);
	}
};
Opkey.prototype.areEqualParams = function (actual, input) {
	if (input instanceof RegExp)
		return actual != null && (typeof actual == "string") && actual.match(input) != null;
	return (actual == input);
}
Opkey.prototype.areEqual = function (el, param, value) {
	if (param == "associative_array") {
		var retVal = true;
		for (var k in value) {
			retVal = retVal && this.areEqual(el, k, value[k]);
			if (!retVal) return false;
		}
		return true;
	}
	if (typeof param == "function") {
		return this.areEqualParams(this.callFunction(param, this, el), value);
	}
	if (param == null || param.indexOf("|") == -1)
		return this.areEqual2(el, param, value);
	var params = param.split("|");
	for (var i = 0; i < params.length; i++) {
		var param = params[i];
		if (this.areEqual2(el, param, value)) return true;
	}
	return false;
};
Opkey.prototype.findLink = function (id, inEl) {
	var inEl = inEl ? inEl : this.top();
	var res = this.getBlankResult();
	var retVal = this.findImageHelper(id, inEl, res, "sahiText", false).element;
	if (retVal != null) return retVal;

	res = this.getBlankResult();
	return this.findImageHelper(id, inEl, res, "id", false).element;
};
Opkey.prototype.findImage = function (id, inEl) {
	inEl = inEl ? inEl : this.top();
	var res = this.getBlankResult();
	var retVal = this.findImageHelper(id, inEl, res, "title|alt", true).element;
	if (retVal != null) return retVal;

	res = this.getBlankResult();
	retVal = this.findImageHelper(id, inEl, res, "id", true).element;
	if (retVal != null) return retVal;

	retVal = this.findImageHelper(id, inEl, res, this.getImageSrc, true).element;
	return retVal;
};
Opkey.prototype.getImageSrc = function (el) {
	var src = el.src;
	return src.substring(src.lastIndexOf("/") + 1);
};
Opkey.prototype.findImageHelper = function (id, win, res, param, isImg) {
	if ((typeof id) == "number") {
		res.cnt = 0;
		res = this.findImageByIx(id, win, res, isImg);
		return res;
	} else {
		var o = this.getArrayNameAndIndex(id);
		var imgIx = o.index;
		var fetch = o.name;
		var doc = this.getDoc(win);
		var imgs = isImg ? this.getElementsByTagName("IMG", doc) : this.getElementsByTagName("A", doc);
		for (var i = 0; i < imgs.length; i++) {
			if (this.areEqual(imgs[i], param, fetch)) {
				res.cnt++;
				if (res.cnt == imgIx || imgIx == -1) {
					res.element = imgs[i];
					res.found = true;
					return res;
				}
			}
		}
	}
	return this.recurseInFrames(this.findImageHelper, win, res, arguments);
};

Opkey.prototype.findImageByIx = function (ix, win, res, isImg) {
	var doc = this.getDoc(win);
	var imgs = isImg ? this.getElementsByTagName("IMG", doc) : this.getElementsByTagName("A", doc);
	// var imgs = isImg ? win.document.images :
	// win.document.getElementsByTagName("A");
	if (imgs[ix - res.cnt]) {
		res.element = imgs[ix - res.cnt];
		res.found = true;
		return res;
	}
	res.cnt += imgs.length;
	return this.recurseInFrames(this.findImageByIx, win, res, arguments);
};

Opkey.prototype.findLinkIx = function (id, toMatch) {
	var res = this.getBlankResult();
	if (id == null || id == "") {
		var retVal = this.findImageIxHelper(id, toMatch, this.top(), res, null, false).cnt;
		if (retVal != -1) return retVal;
	}

	res = this.getBlankResult();
	var retVal = this.findImageIxHelper(id, toMatch, this.top(), res, "sahiText", false).cnt;
	if (retVal != -1) return retVal;

	res = this.getBlankResult();
	return this.findImageIxHelper(id, toMatch, this.top(), res, "id", false).cnt;
};
Opkey.prototype.findImageIx = function (id, toMatch) {
	var res = this.getBlankResult();
	if (id == null || id == "") {
		var retVal = this.findImageIxHelper(id, toMatch, this.top(), res, null, true).cnt;
		if (retVal != -1) return retVal;
	}

	res = this.getBlankResult();
	var retVal = this.findImageIxHelper(id, toMatch, this.top(), res, this.getImageSrc, true).cnt;
	if (retVal != -1) return retVal;

	res = this.getBlankResult();
	var retVal = this.findImageIxHelper(id, toMatch, this.top(), res, "title|alt", true).cnt;
	if (retVal != -1) return retVal;

	res = this.getBlankResult();
	return this.findImageIxHelper(id, toMatch, this.top(), res, "id", true).cnt;
};
Opkey.prototype.findImageIxHelper = function (id, toMatch, win, res, param, isImg) {
	if (res && res.found) return res;

	var imgs = isImg ? win.document.images : this.getElementsByTagName("A", win.document);
	for (var i = 0; i < imgs.length; i++) {
		if (param == null || this.areEqual(imgs[i], param, id)) {
			res.cnt++;
			if (imgs[i] == toMatch) {
				res.found = true;
				return res;
			}
		}
	}
	return this.recurseInFrames(this.findImageIxHelper, win, res, arguments);
};
Opkey.prototype.findElementById = function (win, id) {
	var res = null;
	if (win.document.getElementById(id) != null) {
		return win.document.getElementById(id);
	}
	return this.recurseInFrames(this.findElementById, win, res, arguments);
};
Opkey.prototype.findFormElementByIndex = function (ix, win, type, res, tagName) {
	var els = this.getElementsByTagName(tagName, this.getDoc(win));
	els = this.isWithinBounds(els, win);
	for (var j = 0; j < els.length; j++) {
		var el = els[j];
		if (el != null && this.areEqualTypes(this.getElementType(el), type) && this.checkElementVisible(el)) {
			res.cnt++;
			if (res.cnt == ix) {
				res.element = el;
				res.found = true;
				return res;
			}
		}
	}
	return this.recurseInFrames(this.findFormElementByIndex, win, res, arguments);
};

Opkey.prototype.getElementType = function (el) {
	var t1 = el.getAttribute("type");
	if (el.type == "text" && el.type != t1) {
		if (this.findInArray(this.textboxTypes, t1) == -1) return "text";
		return t1;
	}
	return el.type;
}

Opkey.prototype.findElementHelper = function (id, win, type, res, param, tagName) {
	if ((typeof id) == "number") {
		res = this.findFormElementByIndex(id, win, type, res, tagName);
		if (res.found) return res;
	} else {
		// for elements with name like usernames[]
		if (param != "associative_array") {
			var doc = this.getDoc(win);
			var els = this.getElementsByTagName(tagName, doc);
			els = this.isWithinBounds(els, win);
			for (var j = 0; j < els.length; j++) {
				var el = els[j];
				if (this.areEqualTypes(this.getElementType(el), type) && this.areEqual(el, param, id) && this.checkElementVisible(el)) {
					res.element = el;
					res.found = true;
					return res;
				}
			}
		}

		// normal
		var o = this.getArrayNameAndIndex(id);
		var ix = o.index;
		var fetch = o.name;
		els = this.getElementsByTagName(tagName, this.getDoc(win));
		els = this.isWithinBounds(els, win);
		for (var j = 0; j < els.length; j++) {
			var el = els[j];
			if (this.areEqualTypes(this.getElementType(el), type) && this.areEqual(el, param, fetch) && this.checkElementVisible(el)) {
				res.cnt++;
				if (res.cnt == ix || ix == -1) {
					res.element = el;
					res.found = true;
					return res;
				}
			}
		}


	}
	return this.recurseInFrames(this.findElementHelper, win, res, arguments);
};
Opkey.prototype.findElementIxHelper = function (id, type, toMatch, win, res, param, tagName) {
	if (res && res.found) return res;
	var els = this.getElementsByTagName(tagName, this.getDoc(win));
	for (var j = 0; j < els.length; j++) {
		if (this.areEqualTypes(this.getElementType(els[j]), type) && this.areEqual(els[j], param, id) && this.checkElementVisible(els[j])) {
			res.cnt++;
			if (els[j] == toMatch) {
				res.found = true;
				return res;
			}
		}
	}
	return this.recurseInFrames(this.findElementIxHelper, win, res, arguments);
};
Opkey.prototype.areEqualTypes = function (type1, type2) {
	if (type1 == type2) return true;
	return (type1.indexOf("select") != -1 && type2.indexOf("select") != -1);
};
Opkey.prototype.findCell = function (id, inEl) {
	var res = this.getBlankResult();
	res = this.findTagHelper(id, inEl, "td", res, "sahiText").element;
	if (res != null) return res;
	var res = this.getBlankResult();
	res = this.findTagHelper(id, inEl, "td", res, "id").element;
	if (res != null) return res;
	res = this.getBlankResult();
	return this.findTagHelper(id, inEl, "td", res, "className").element;
};
Opkey.prototype.getBlankResult = function () {
	var res = new Object();
	res.cnt = -1;
	res.found = false;
	res.element = null;
	return res;
};
Opkey.prototype.getArrayNameAndIndex = function (id, makeRegexGlobal) {
	var o = new Object();
	if (!(id instanceof RegExp)) {
		if (typeof id == "object") {
			o.index = (id.sahiIndex != null) ? id.sahiIndex : -1;
			o.name = {};
			for (var k in id) {
				if (k != "sahiIndex") o.name[k] = this.checkRegex(id[k], makeRegexGlobal);
			}
			return o;
		} else {
			var m = id.match(/(.*)\[([0-9]*)\]$/);
			if (m) {
				o.name = this.checkRegex(m[1], makeRegexGlobal);
				o.index = m[2];
				return o;
			}
		}
	}
	o.name = this.checkRegex(id, makeRegexGlobal);
	o.index = -1;
	return o;
};
Opkey.prototype.checkRegex = function (s, makeRegexGlobal) {
	try {
		return ((typeof s) == "string" && s.match(this.CHECK_REGEXP)) ? eval(s + ((!s.match(/\/i$/)) ? "i" : "") + (makeRegexGlobal ? "g" : "")) : s;
	} catch (e) {
		return s;
	}
};
Opkey.prototype.findInForms = function (id, win, type) {
	var fms = win.document.forms;
	if (fms == null) return null;
	for (var j = 0; j < fms.length; j++) {
		var el = this.findInForm(id, fms[j], type);
		if (el != null) return el;
	}
	return null;
};
Opkey.prototype.findInForm = function (name, fm, type) {
	var els = fm.elements;
	var matchedEls = new Array();
	for (var i = 0; i < els.length; i++) {
		var el = els[i];
		if (el.name == name && el.type && this.areEqualTypes(this.getElementType(el), type)) {
			matchedEls[matchedEls.length] = el;
		} else if ((el.type == "button" || el.type == "submit") && el.value == name && el.type == type) {
			matchedEls[matchedEls.length] = el;
		}
	}
	return (matchedEls.length > 0) ? (matchedEls.length == 1 ? matchedEls[0] : matchedEls) : null;
};
Opkey.prototype.findTable = function (id, inEl) {
	var inEl = this.getDomRelAr(arguments);
	// if (!inEl) inEl = this.top();
	var res = this.getBlankResult();
	return this.findTagHelper(id, inEl, "table", res, "id").element;
};
Opkey.prototype._iframe = function (id, inEl) {
	var inEl = this.getDomRelAr(arguments);

	var res = this.getBlankResult();
	var el = this.findTagHelper(id, inEl, "iframe", res, "id").element;
	if (el != null) return el;

	res = this.getBlankResult();
	el = this.findTagHelper(id, inEl, "iframe", res, "name").element;
	if (el != null) return el;
};
// used from lib.js
Opkey.prototype.getArgsAr = function (args, start, end) {
	if (start == null) start = 0;
	if (end == null) end = args.length;
	var ar = []
	for (var i = start; i < end; i++) {
		ar.push(args[i]);
	}
	return ar;
}
Opkey.prototype._count = function (apiType, id, inEl) {
	var upper = 2048;
	var lower = 0;
	var origArgs = this.getArgsAr(arguments, 2);
	var fn = this[apiType];
	if (fn.apply(this, [id].concat(origArgs)) == null) return 0;
	var j = 20;
	while (true && j-- >= 0) {
		var diff = Math.floor((upper - lower) / 2);
		if (diff == 0) return lower + 1;
		var lookAt = lower + diff;
		if (typeof id == "object" && !(id instanceof RegExp)) {
			var id2 = id;
			id2.sahiIndex = lookAt;
		} else {
			var id2 = id + "[" + lookAt + "]";
		}
		var args = [id2].concat(origArgs);
		var el = fn.apply(this, args);
		if (el == null) {
			upper = lookAt;
		} else {
			lower = lookAt;
		}
		if (upper == lower) return lower + 1;
	}
	return 0;
};
// used on browser
Opkey.prototype._collect = function (apiType, id, inEl) {
	var els = [];
	var origArgs = this.getArgsAr(arguments, 2);
	var fn = this[apiType];
	for (var i = 0; i < 2048; i++) {
		if (typeof id == "object" && !(id instanceof RegExp)) {
			var id2 = id;
			id2.sahiIndex = i;
		} else {
			var id2 = id + "[" + i + "]";
		}
		var args = [id2].concat(origArgs);
		var el = fn.apply(this, args);
		if (el == null) break;
		els.push(el);
	}
	return els;
}
Opkey.prototype._rte = Opkey.prototype._iframe;
Opkey.prototype.findResByIndexInList = function (ix, win, type, res) {
	var tags = this.getElementsByTagName(type, this.getDoc(win));
	tags = this.isWithinBounds(tags, win);
	if (tags[ix - res.cnt]) {
		res.element = tags[ix - res.cnt];
		res.found = true;
		return res;
	}
	res.cnt += tags.length;
	return this.recurseInFrames(this.findResByIndexInList, win, res, arguments);
};

Opkey.prototype.is_defined = function (variable) { // Check if variable is
	// defined
	return !(typeof variable === "undefined");
};

Opkey.prototype.getBoundedRectangle = function (positionals) {
	return {
		calcXleft: function (alignX) {
			this.xleft = (((!_opkey.is_defined(this.xleft)) || (alignX > this.xleft)) ? alignX : this.xleft);
		},
		calcXright: function (alignXOuter) {
			this.xright = (((!_opkey.is_defined(this.xright)) || (alignXOuter < this.xright)) ? alignXOuter : this.xright);
		},
		calcYtop: function (alignY) {
			this.ytop = (((!_opkey.is_defined(this.ytop)) || (alignY > this.ytop)) ? alignY : this.ytop);
		},
		calcYbottom: function (alignYOuter) {
			this.ybottom = (((!_opkey.is_defined(this.ybottom)) || (alignYOuter < this.ybottom)) ? alignYOuter : this.ybottom);
		},
		calculateRectangle: function (positionals) { // calculate rectangle
			// coordinates based on
			// positional relations
			this.isCompleteDoc = (positionals.length == 0);
			for (var itr = 0; itr < positionals.length; itr++) {
				var positional = positionals[itr];
				if (positional.relation == "_under") {
					this.calcXleft(positional.alignX);
					this.calcXright(positional.alignXOuter);
					this.calcYtop(positional.limitY);
					if (typeof positional.limitUnder !== "undefined") {
						this.calcYbottom(positional.limitUnder);
					}
				} else if (positional.relation == "_above") {
					this.calcXleft(positional.alignX);
					this.calcXright(positional.alignXOuter);
					this.calcYbottom(positional.limitY);
					if (typeof positional.limitTop !== "undefined") {
						this.calcYtop(positional.limitTop);
					}
				} else if (positional.relation == "_leftOf") {
					this.calcYtop(positional.alignY)
					this.calcYbottom(positional.alignYOuter)
					this.calcXright(positional.limitX);
				} else if (positional.relation == "_rightOf") {
					this.calcYtop(positional.alignY)
					this.calcYbottom(positional.alignYOuter)
					this.calcXleft(positional.limitX);
				} else if (positional.relation == "_rowOf") {
					this.calcYtop(positional.alignY)
					this.calcYbottom(positional.alignYOuter)
				} else if (positional.relation == "_colOf") {
					this.calcXleft(positional.alignX);
					this.calcXright(positional.alignXOuter);
				}
			}
			return this;

		},
		hasNoRectanlge: function () {
			return !(
				((!_opkey.is_defined(this.xleft)) || (!_opkey.is_defined(this.xright)) || (this.xleft < this.xright)) &&
				((!_opkey.is_defined(this.ytop)) || (!_opkey.is_defined(this.ybottom)) || (this.ytop < this.ybottom)));
		},
		contains: function (xy) { // if xy coordinates lie within the
			// rectangle
			return (
				(((!_opkey.is_defined(this.xleft))) || (this.xleft <= xy[0])) &&
				(((!_opkey.is_defined(this.xright))) || (this.xright >= xy[0])) &&
				(((!_opkey.is_defined(this.ytop))) || (this.ytop <= xy[1])) &&
				(((!_opkey.is_defined(this.ybottom))) || (this.ybottom >= xy[1])));



		}
	}.calculateRectangle(positionals);

};

Opkey.prototype.isWithinBounds = function (tags, relPos) {
	var rectangle = this.getBoundedRectangle(relPos.positionals);
	var filtered = [];
	if (rectangle.isCompleteDoc) {
		return tags;
	} // Incase no positionals
	// were passed so entire doc
	// is the rectangle so all
	// tags returned
	if (rectangle.hasNoRectanlge()) {
		return filtered;
	} // Incase no
	// rectanlge is
	// formed using
	// positionals

	for (var itr = 0; itr < tags.length; itr++) {
		if (rectangle.contains(this.getLeftTop(tags[itr]))) {
			filtered.push(tags[itr]);
		}
	}
	return filtered;
};

Opkey.prototype.withinOffset = function (actual, left, right, offset) {
	return actual >= (left - offset) && actual < (right + offset);
	// return Math.abs(a - b) <= offset;
};

Opkey.prototype.findTagHelper = function (id, win, type, res, param) {
	if ((typeof id) == "number") {
		res.cnt = 0;
		res = this.findResByIndexInList(id, win, type, res);
		return res;
	} else {
		// this._alert(1);
		var o = this.getArrayNameAndIndex(id);
		var ix = o.index;
		var fetch = o.name;
		var tags = this.getElementsByTagName(type, this.getDoc(win));
		tags = this.isWithinBounds(tags, win);
		if (tags) {
			for (var i = 0; i < tags.length; i++) {
				if (this.areEqual(tags[i], param, fetch)) {
					var el = tags[i];
					if ((param == "sahiText" && (this.innerMost(el, fetch, type) != el)) || !this.checkElementVisible(el)) {
						continue;
					}
					res.cnt++;
					if (res.cnt == ix || ix == -1) {
						res.element = el;
						res.found = true;
						return res;
					}
				}
			}
		}
	}
	// window based search without relations
	return this.recurseInFrames(this.findTagHelper, win, res, arguments);
};
Opkey.prototype.recurseInFrames = function (fn, win, res, paramsAr) {
	paramsAr = this.getArgsAr(paramsAr);
	var ix = this.findInArray(paramsAr, win);
	var frs = win.window.frames;
	if (frs) {
		for (var j = 0; j < frs.length; j++) {
			try {
				var win2 = {
					relations: [],
					window: frs[j],
					positionals: win.positionals
				};
				paramsAr[ix] = win2;
				res = fn.apply(this, paramsAr);
			} catch (diffDomain) { }
			if (res && res.found) return res;
		}
	}
	return res;
};

Opkey.prototype.findTagIxHelper = function (id, toMatch, win, type, res, param) {
	if (res && res.found) return res;

	var tags = this.getElementsByTagName(type, this.getDoc(win));
	if (tags) {
		for (var i = 0; i < tags.length; i++) {
			if ((param == null || this.areEqual(tags[i], param, id)) && this.checkElementVisible(tags[i])) {
				res.cnt++;
				if (tags[i] == toMatch) {
					res.found = true;
					return res;
				}
			}
		}
	}
	return this.recurseInFrames(this.findTagIxHelper, win, res, arguments);
};
Opkey.prototype.canSimulateClick = function (el) {
	return (el.click || el.dispatchEvent);
};
Opkey.prototype.recordStep = async function (step, _element) {
	if (_opkey.contenteditableelement != null) {
		var recordedreturndata = _opkey.getCustomeKeywordScriptReturnedData("_setValue", _opkey.contenteditableelement, _opkey.contenteditableelement.innerText, true);
		step = recordedreturndata + ", " + step;
		_opkey.contenteditableelement = null;
		var steptosend_0 = step;

		if (_element) {
			await _opkey._highlightForObiq(_element);
		}

		chrome.runtime.sendMessage({
			recordeddata: "[" + steptosend_0 + "]"
		}, function (response) {
			if (chrome.runtime.lastError) { }

			if (_element) {
				_opkey._unhighlightForObiq(_element);
			}
		});
		return;
	}

	if (_element) {
		await _opkey._highlightForObiq(_element);
	}

	var steptosend = step;
	chrome.runtime.sendMessage({
		recordeddata: steptosend
	}, function (response) {
		if (chrome.runtime.lastError) { }

		if (_element) {
			_opkey._unhighlightForObiq(_element);
		}
	});
}

Opkey.prototype.recordStepCapturedKeyword = function (step, OREntry, fromController) {

	var steptosend = step;
	chrome.runtime.sendMessage({
		recordeddata: "[" + steptosend + "]"
	}, function (response) {
		if (chrome.runtime.lastError) {
		}
	});
}

Opkey.prototype.isRecording = function () {
	// this.topOpkey() gives undefined and is not a object in safari
	if (this.topOpkey() != null && this.topOpkey()._isRecording == null) {
		this.topOpkey()._isRecording = this.sendToServer("/_s_/dyn/SessionState_isRecording") == "1";
	}
	return true;
};
Opkey.prototype.createCookie = function (name, value, days, path, domain, secure) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString();
	}
	var s = name + "=" + value + expires;
	s += "; path=" + (path ? path : "/");
	if (domain) s += "; domain=" + domain;
	if (secure) s += "; secure=" + secure;
	window.document.cookie = s;
};
Opkey.prototype._createCookie = Opkey.prototype.createCookie;
Opkey.prototype.readCookie = function (name) {
	return this.sendToServer("/_s_/dyn/Cookies_read?name=" + name);
};
Opkey.prototype._cookie = Opkey.prototype.readCookie;
Opkey.prototype.eraseCookie = function (name, path) {
	return this.sendToServer("/_s_/dyn/Cookies_delete?name=" + name + (path ? ("&path=" + encodeURIComponent(path)) : ""));
};
Opkey.prototype._deleteCookie = Opkey.prototype.eraseCookie;
Opkey.prototype._event = function (type, keyCode) {
	this.type = type;
	this.keyCode = keyCode;
};
var OpkeyAssertionException = function (msgNum, msgText) {
	_opkey.lastAssertStatus = "failure";
	this.messageNumber = msgNum;
	this.messageText = msgText;
	this.exceptionType = "OpkeyAssertionException";
};
var OpkeyNotMyWindowException = function (n) {
	this.name = "OpkeyNotMyWindowException";
	if (n) {
		this.message = "Window with name [" + n + "] not found";
	} else {
		this.message = "Base window not found";
	}
};
var OpkeyNotMyDomainException = function (n) {
	this.name = "OpkeyNotMyDomainException";
	if (n) {
		this.message = "Window with domain [" + n + "] not found";
	} else {
		this.message = "Base domain not found!";
	}
};
Opkey.prototype.onMouseDownEv = function (e) {
	// <<## PERFORMING EVENTS AFTER MOUSE IS DOWN AND CHANGING THE TRIGGER EVENTS ACCORDING TO THE NEEDS
	var targ = this.getKnownTags(this.getTarget(e));
	// //this._debug("onmousedown: ********: " + targ + " ----- event: ****: "
	// +e);
	this.mouseDownEl = targ;
	if ( /* this.mouseDownEl.nodeName */ targ.nodeName == "INPUT" || targ.nodeName == "LABEL") {
		this.lastMouseDownEl = targ;
	}

	if (this.lastMouseDownEl != targ) {
		if (targ.nodeName != "INPUT" /* && targ.nodeName != "DIV" */ && targ.nodeName != "A") {
			this.triggerEvent(targ, "click");
			this.lastMouseDownEl = targ;

		} else return;
	} else {
		return;
	}
}

Opkey.prototype.CheckDateTimeEditableElement = function (element) {
	var temp_element = element;
	while (temp_element.parentNode != null) {
		if (temp_element.classList != null) {
			if (temp_element.classList.contains("uiInputDate") ||
				temp_element.classList.contains("uiInputDateTime") ||
				temp_element.classList.contains("dateInput") ||
				temp_element.classList.contains("dateOnlyInput") ||
				temp_element.classList.contains("timeContainer")) {
				return true;
			}
		}
		temp_element = temp_element.parentNode;
	}

	var temp_element_2 = element;
	while (temp_element_2.parentNode != null) {
		if (temp_element_2.nodeName == "LIGHTNING-TIMEPICKER") {
			return true;
		}
		temp_element_2 = temp_element_2.parentNode;
	}

	var temp_element_3 = element;
	while (temp_element_3.parentNode != null) {
		if (temp_element_3.nodeName == "LIGHTNING-BASE-COMBOBOX") {
			return true;
		}
		temp_element_3 = temp_element_3.parentNode;
	}

	/*
	 * var temp_element_4=element; while(temp_element_4.parentNode!=null) {
	 * if(temp_element_4.getAttribute("role")!=null) {
	 * if(temp_element_4.getAttribute("role")!="combobox") { return true; } }
	 * temp_element_4=temp_element_4.parentNode; }
	 */
	return false;
};


var divelement;
var ismousedownondiv;
var isclickedondiv;

function getListItemOfDiv(element) {
	if (element.nodeName == "LI") {
		return element;
	}

	var tempElement = element;
	while (tempElement.parentNode != null) {
		if (tempElement.nodeName == "LI") {
			return tempElement;
		}
		tempElement = tempElement.parentNode;
	}

	if (element.nodeName === "DIV") {
		if (element.getAttribute("class")?.includes("Listbox") && element.getAttribute("role") != null && element.getAttribute("role") === "option") {
			return element;
		}
	}
	return null;
}

function getButtonOFSpan(element, tagName) {
	if (element.nodeName == tagName) {
		return element;
	}

	var tempElement = element;
	while (tempElement.parentNode != null) {
		if (tempElement.nodeName == tagName) {
			return tempElement;
		}
		tempElement = tempElement.parentNode;
	}
	return null;
}

function sendDataToRecorder(recordedObject) {
	var retdata = FJSON.stringify(recordedObject)
	console.log(retdata);
	_opkey.recordStep(retdata);
}

function OpKey_doGET(path) {
	window.opkey_JNLPResponse = 'NO_JNLP_REPONSE';
	var xhttp;
	if (window.XMLHttpRequest) {
		xhttp = new XMLHttpRequest();
	} else {
		xhttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			window.opkey_JNLPResponse = xhttp.responseText;
		}
	};
	xhttp.open('GET', path, true);
	xhttp.send();
}

Opkey.prototype.resolveOracleEBSClicks = function (_element, event) {
	var recordingmode = _opkey.GetRecordingMode();
	if (recordingmode !== "ORACLE EBS") {
		return;
	}
	var tempElement = _element;
	if (tempElement.nodeName !== "A") {
		if (tempElement.parentNode != null && tempElement.parentNode.nodeName === "A") {
			tempElement = tempElement.parentNode;
		}
	}
	var _href = tempElement.getAttribute("href");
	if (_href != null) {

		if (_href.indexOf("javascript:launchForm") > -1) {
			event.preventDefault(); // Prevents the default action (navigation)
			event.stopPropagation(); // Stops the event from propagating to parent elements
			_href = _href.replaceAll("javascript:launchForm('", "").replaceAll("')", "");
			OpKey_doGET(_href);

			var _jnlpDataThread = window.setInterval(function () {
				var _jnlpData = window.opkey_JNLPResponse;
				if (_jnlpData != null) {
					if (_jnlpData != "NO_JNLP_REPONSE") {
						if (_jnlpData.toLowerCase().indexOf("<jnlp") > -1) {
							window.clearInterval(_jnlpDataThread);
							if (jnlpDataSent == false) {
								jnlpDataSent = true;
								chrome.runtime.sendMessage({
									LaunchOracleEBSByJnLpData: _jnlpData
								}, function (response) {
									if (chrome.runtime.lastError) { }
								});

								window.setTimeout(function () {
									jnlpDataSent = false;
								}, 2000);
							}
						}
					}
				}
			}, 1000);
		}
	}

	if (_element.nodeName == "BUTTON") {
		if (_element.type != null && _element.type == "submit") {
			var onclickattr = _element.getAttribute("onclick");
			if (onclickattr != null && onclickattr.indexOf("submitForm") > -1 && onclickattr.indexOf("_FORM_SUBMIT_BUTTON") > -1) {
				chrome.runtime.sendMessage({
					launchLastDownloadedJnlp: "launchLastDownloadedJnlp"
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});
			}
		}
	}
};

Opkey.prototype.handleUserGuideRecordSnapshot = async function (e) {

	if (_opkey.canHighlight == false) {
		return;
	}
	if (_opkey.can_record == false) {
		return;
	}
	if (e.opkeyIntercepted) {
		return;
	}
	debugger
	//_opkey._highlight(e.target);

	//	let imageData = await asyncTakePageSnapshotOnMouseHover();
	//	e.opkeyIntercepted = true;
};


function asyncTakePageSnapshotOnMouseHover() {
	return new Promise(function (resolve) {
		chrome.runtime.sendMessage({
			TakePageSnapshotOnMouseHover: "TakePageSnapshotOnMouseHover"
		}, function (response) {
			resolve(response);
		});
	});
}

Opkey.prototype.onEv = function (e) {
	// <<## ONEV function
	if (_opkey.canHighlight == false) {
		return;
	}
	if (_opkey.can_record == false) {
		return;
	}


	try {
		var isRightMB;
		e = e || window.event;
		if ("which" in e) // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
			isRightMB = e.which == 3;
		else if ("button" in e) // IE, Opera
			isRightMB = e.button == 2;
		if (isRightMB) {
			return;
		}
	} catch (e) { }

	if (e.handled == true) {
		return; // FF
	}

	var targ = this.getKnownTags(this.getTarget(e));
	if (targ != null && targ.nodeName != null && targ.nodeName == "FLT-GLASS-PANE") {
		return
	}

	var actualElement = targ;
	//console.log("onEV : e.type: " +e.type + " targ: " + e.target);
	if (e.type == "click" || e.type == "mouseup" || e.type == "mousedown") {
		if (e.screenX && e.screenX != 0 && e.screenY && e.screenY != 0) {

		} else {
			if (targ.getAttribute("aria-hidden") != null && targ.getAttribute("aria-hidden") == "true") {
				return;
			}
		}
	}
	// if (this.doNotRecord || this.getServerVar("sahiEvaluateExpr") == true)
	// return;
	if (this.doNotRecord) return;

	if (targ) {
		this.resolveOracleEBSClicks(targ, e);
		if (targ.isShadowRootElement === true) {
			return;
		}
		if (targ.getAttribute("opkeydockerid") != null) {
			return;
		}

		if (targ.getAttribute("veeva_lisitem") == "true") {
			window.setTimeout(function () {
				targ.setAttribute("veeva_lisitem", "false");
			}, 1500);
			return;
		}
	}

	if (targ.shadowRoot != null) {
		if (targ.isLowerMostShadowNode != null) {
			if (targ.isLowerMostShadowNode == false) {
				return;
			}
		}
	}
	_opkey.CheckSalesforceCondition(targ, e);

	if (targ.nodeName == "A" && e.type != "mouseup") {
		// return;
	}

	if (targ == divelement) {
		if (ismousedownondiv) {
			ismousedownondiv = false;
			divelement = null;
			return;
		} else if (isclickedondiv) {
			isclickedondiv = false;
			divelement = null;
			return;
		}
	}

	if (targ.nodeName == "DIV" && e.type == "mousedown") {
		divelement = targ;
		ismousedownondiv = true;
	}
	if (targ.nodeName == "DIV" && e.type == "click") {
		isclickedondiv = true;
		if (targ.classList.contains("gwt-Label WFLO")) {
			targ.addEventListener('click', function (e) {
				_opkey.getCustomeKeywordScript("click", targ, "")
			}, true);
		}
	}

	if (targ.nodeName == "SELECT" && e.type == "change" && targ.isShadowDomChild === true) {
		_opkey.getCustomeKeywordScript("setSelected", targ, targ.options[targ.selectedIndex].text)
		targ.alreadyopkeydone = true;
		e.handled = true;
		return;
	}

	var recordingmode = _opkey.GetRecordingMode();

	if (recordingmode == "WEB") {
		var tempTarg = targ;
		if (normalRecordingDropdown != null) {
			var listFound = null;
			if (tempTarg.nodeName == "LI" && tempTarg.classList.contains("k-item")) {
				listFound = tempTarg;
			}

			if (listFound == null) {
				tempTarg = targ;
				var limit = 0;
				while (tempTarg.parentNode != null && limit < 10) {
					if (tempTarg.parentNode.nodeName == "LI" && tempTarg.parentNode.classList.contains("k-item")) {
						listFound = targ;
						break;
					}
					limit += 1;
					tempTarg = tempTarg.parentNode;
				}

			}

			if (listFound == null) {
				tempTarg = targ;
				var limit = 0;
				while (tempTarg.parentNode != null && limit < 10) {
					if (tempTarg.parentNode.classList.contains("dropdown-item")) {
						listFound = targ;
						break;
					}
					limit += 1;
					tempTarg = tempTarg.parentNode;
				}

			}


			if (listFound != null) {
				var tempObject = normalRecordingDropdown;
				normalRecordingDropdown = null;
				_opkey.getCustomeKeywordScript("setSelected", tempObject, listFound.innerText)
				targ.alreadyopkeydone = true;
				e.handled = true;
				return;
			}
		}
		tempTarg = targ;
		var limit = 0;
		while (tempTarg.parentNode != null && limit < 10) {
			if (tempTarg.parentNode.nodeName == "KENDO-DROPDOWNLIST" || tempTarg.parentNode.nodeName == "APP-LAZY-SPRINT-DROPDOWN") {
				normalRecordingDropdown = tempTarg.parentNode;
				targ.alreadyopkeydone = true;
				e.handled = true;
				return;
			}
			limit += 1;
			tempTarg = tempTarg.parentNode;
		}
	}

	if (recordingmode == "MSDYNAMICS") {
		if (targ.nodeName == "TD") {
			var targrole = targ.getAttribute("role");
			if (targrole != null) {
				if (targrole == "gridcell") {
					if (targ.firstChild != null) {
						targ = targ.firstChild;
					}
				}
			}
		}
		if (e.type == "click" || e.type == "mousedown" || e.type == "mouseup") {
			if (targ.type) {
				var type = targ.type;
				if (type == "text" || type == "textarea" || type == "password" || type == "email" || type == "search" || type == "tel" || type == "search" || type == "url") {
					var roleAattr = targ.getAttribute("role");
					if (roleAattr != null || targ.getAttribute("data-id") != null) {
						_opkey.getCustomeKeywordScript("click", targ, "OPKEY_IGNORE_CHECK");
						return;
					}
				}
			}
		}
	}


	if (recordingmode == "VEEVA VAULT") {
		var lookup_button = targ;
		if (targ.nodeName == "path") {
			lookup_button = targ.parentNode;
		}
		if (lookup_button.nodeName == "svg") {
			lookup_button = lookup_button.parentNode;
		}
		if (lookup_button.nodeName == "SPAN") {
			if (lookup_button.classList != null) {
				if (lookup_button.classList.contains("vv-record-select-icon-wrapper")) {
					if (lookup_button.getAttribute("title") != null) {
						if (lookup_button.getAttribute("title") === "More search options") {
							veeva_searchAndSelectRecording = true;
							veeva_lookupbutton = lookup_button;
							return;
						}
					}
				}
			}
		}
		if (veeva_searchAndSelectRecording == true) {
			if (targ.classList != null) {
				if (targ.classList.contains("vv-vof-lookup-table-name-cell") || targ.classList.contains("vv-vof-lookup-table-name-label")) {
					targ.setAttribute("veeva_lisitem", "true");
					var labelObject = new Object();
					var _oraclefusion = new VeevaVault();
					_oraclefusion.GetLabelProperties(veeva_lookupbutton, labelObject);
					var args = {
						LabelName: labelObject["VV:label:text"],
						Index: 0,
						PartialText: false,
						TextToType: targ.textContent,
						Before: false
					};
					var recordedObject = _opkey.GetKeywordWithOutObject(
						"Veeva_SearchAndSelect", args, "object",
						targ);
					targ.alreadyopkeydone = true;
					e.handled = true;
					sendDataToRecorder(recordedObject);
					return;
				} else {
					if (targ.nodeName == "BUTTON") {
						if (targ.classList != null) {
							if (targ.classList.contains("vv-ibtn-ghost")) {
								veeva_searchAndSelectRecording = false;
								return;
							}
						}

						if (targ.getAttribute("title") != null) {
							if (targ.getAttribute("title") === "Close") {
								targ.setAttribute("veeva_lisitem", "true");
								veeva_searchAndSelectRecording = false;
								return;
							}
						}
					}
					return;
				}
			}
		}

		if (targ.nodeName === "svg") {
			if (targ.parentNode.nodeName == "DIV") {
				if (targ.parentNode.classList != null) {
					if (targ.parentNode.classList.contains("vv-input-container")) {
						var _divInput = targ.parentNode.getElementsByTagName("INPUT")[0];
						if (_divInput != null) {
							if (_divInput.nodeName == "INPUT") {
								if (_divInput.type) {
									if (_divInput.type === "search") {
										if (_divInput.getAttribute("aria-haspopup") != null) {
											if (_divInput.getAttribute("aria-haspopup") === "true") {
												_opkey.fiori_dropdown = _divInput;
												targ.alreadyopkeydone = true;
												e.handled = true;
												return;
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
		if (targ.nodeName == "INPUT") {
			if (targ.type) {
				if (targ.type === "search") {
					if (targ.getAttribute("aria-haspopup") != null) {
						if (targ.getAttribute("aria-haspopup") === "true") {
							_opkey.fiori_dropdown = targ;
							targ.alreadyopkeydone = true;
							e.handled = true;
							return;
						}
					}
				}
			}

			if (targ.classList != null) {
				if (targ.classList.contains("ui-combobox-input") || targ.classList.contains("multiItemSelectInput")) {
					_opkey.fiori_dropdown = targ;
					targ.alreadyopkeydone = true;
					e.handled = true;
					return;
				}
			}
		}

		if (targ.nodeName == "A") {
			if (targ.classList) {
				if (targ.classList.contains("showAll")) {
					if (targ.previousSibling != null) {
						if (targ.previousSibling.classList.contains("ui-combobox-input") || targ.previousSibling.classList.contains("multiItemSelectInput")) {
							_opkey.fiori_dropdown = targ.previousSibling;
							targ.alreadyopkeydone = true;
							e.handled = true;
							return;
						}
					}
				}
				if (targ.classList.contains("dropdown")) {
					_opkey.fiori_dropdown = targ;
					targ.alreadyopkeydone = true;
					e.handled = true;
					return;
				}
			}
		}

		if (targ.nodeName == "BUTTON") {
			if (targ.getAttribute("data-toggle") != null) {
				if (targ.getAttribute("data-toggle") === "dropdown") {
					_opkey.fiori_dropdown = targ;
					targ.alreadyopkeydone = true;
					e.handled = true;
					return;
				}
			}
		}

		if (targ.nodeName == "SPAN") {
			if (targ.parentNode) {
				if (targ.parentNode.nodeName === "BUTTON") {
					if (targ.parentNode.getAttribute("data-toggle") != null) {
						if (targ.parentNode.getAttribute("data-toggle") === "dropdown") {
							_opkey.fiori_dropdown = targ.parentNode;
							targ.alreadyopkeydone = true;
							e.handled = true;
							return;
						}
					}
				}
				if (targ.parentNode.nodeName === "A") {
					if (targ.parentNode.classList != null) {
						if (targ.parentNode.classList.contains("vv_button_menu")) {
							_opkey.fiori_dropdown = targ.parentNode;
							targ.alreadyopkeydone = true;
							e.handled = true;
							return;
						}
					}
				}
			}
		}

		if (targ.nodeName === "A") {
			if (targ.classList != null) {
				if (targ.classList.contains("vv_button_menu")) {
					_opkey.fiori_dropdown = targ;
					targ.alreadyopkeydone = true;

					e.handled = true;
					return;
				}
			}
		}

		if (_opkey.fiori_dropdown != null) {
			if (targ.nodeName == "A") {
				if (targ.classList != null) {
					if (targ.classList.contains("searchTab")) {
						var optionText = targ.textContent;
						targ.alreadyopkeydone = true;
						targ.setAttribute("veeva_lisitem", "true");
						_opkey.getCustomeKeywordScript("Veeva_SelectDropDownItem", _opkey.fiori_dropdown, optionText);
						_opkey.fiori_dropdown = null;
						e.handled = true;
						return;
					}
				}

				if (targ.parentNode != null) {
					if (targ.parentNode.nodeName == "LI") {
						var optionText = targ.textContent;
						targ.alreadyopkeydone = true;
						targ.setAttribute("veeva_lisitem", "true");
						_opkey.getCustomeKeywordScript("Veeva_SelectDropDownItem", _opkey.fiori_dropdown, optionText);
						_opkey.fiori_dropdown = null;
						e.handled = true;
						return;
					}
				}

			}
			if (targ.nodeName == "SPAN") {
				if (targ.classList != null) {
					if (targ.classList.contains("tab_name")) {
						var optionText = targ.textContent;
						targ.alreadyopkeydone = true;
						targ.setAttribute("veeva_lisitem", "true");
						_opkey.getCustomeKeywordScript("Veeva_SelectDropDownItem", _opkey.fiori_dropdown, optionText);
						_opkey.fiori_dropdown = null;
						e.handled = true;
						return;
					}
				}
			}
			if (targ.nodeName == "LI") {
				var optionText = targ.textContent;
				targ.alreadyopkeydone = true;
				targ.setAttribute("veeva_lisitem", "true");
				_opkey.getCustomeKeywordScript("Veeva_SelectDropDownItem", _opkey.fiori_dropdown, optionText);
				_opkey.fiori_dropdown = null;
				e.handled = true;
				return;
			}

			if (targ.nodeName == "STRONG") {
				if (targ.parentNode) {
					if (targ.parentNode.parentNode) {
						if (targ.parentNode.parentNode.nodeName == "LI") {
							var optionText = targ.textContent;
							targ.alreadyopkeydone = true;
							targ.setAttribute("veeva_lisitem", "true");
							_opkey.getCustomeKeywordScript("Veeva_SelectDropDownItem", _opkey.fiori_dropdown, optionText);
							_opkey.fiori_dropdown = null;
							e.handled = true;
							return;
						}
					}
				}
			}
		}
		if (_opkey.fiori_dropdown != null) {
			//  _opkey.getCustomeKeywordScript("click", _opkey.fiori_dropdown, "OPKEY_IGNORE_CHECK");
			_opkey.fiori_dropdown = null;
		}
	}

	if (recordingmode == "MSDynamics FSO") {
		if (targ.nodeName == "DIV") {
			if (targ.classList != null) {
				if (targ.classList.contains("lookupButton")) {
					var lookup_parentnode = targ.parentNode.parentNode;
					if (lookup_parentnode != null) {
						if (lookup_parentnode.classList != null) {
							if (lookup_parentnode.classList.contains("lookupDock-comboBox")) {
								var input_label_element = lookup_parentnode.getElementsByTagName("INPUT")[0];
								if (input_label_element != null) {
									_opkey.fiori_dropdown = input_label_element;
								} else {
									_opkey.fiori_dropdown = targ;
								}
								targ.alreadyopkeydone = true;
								e.handled = true;
								return;
							}
						}
					}
				}
			}
			var _role = targ.getAttribute("role");
			if (_role != null) {
				if (_role == "combobox") {
					_opkey.fiori_dropdown = targ;
					targ.alreadyopkeydone = true;
					e.handled = true;
					return;
				}
			}
		}
		if (targ.nodeName == "LI") {
			if (_opkey.fiori_dropdown != null) {
				var _role = targ.getAttribute("role");
				if (_role != null) {
					if (_role == "option") {
						var optionText = targ.textContent;
						targ.alreadyopkeydone = true;
						_opkey.getCustomeKeywordScript("MSDAX_SelectDropDownItem", _opkey.fiori_dropdown, optionText);
						_opkey.fiori_dropdown = null;
						e.handled = true;
						return;
					}
				}
			}
		}
		if (_opkey.fiori_dropdown != null) {
			_opkey.getCustomeKeywordScript("click", _opkey.fiori_dropdown, "OPKEY_IGNORE_CHECK");
			_opkey.fiori_dropdown = null;
		}

		if (e.type == "click" || e.type == "mousedown" || e.type == "mouseup") {
			if (targ.type) {
				var type = targ.type;
				if (type == "text" || type == "textarea" || type == "password" || type == "email" || type == "search" || type == "tel" || type == "search" || type == "url") {
					var roleAattr = targ.getAttribute("role");
					if (roleAattr != null) {
						console.log("Releasing Click Input");
						_opkey.getCustomeKeywordScript("click", targ, "OPKEY_IGNORE_CHECK");
						return;
					}
				}
			}
		}
	}

	if (recordingmode == "SAP FIORI") {
		if (e.type == "click" || e.type == "mousedown" || e.type == "mouseup") {
			if (targ.type) {
				var type = targ.type;
				if (type == "text" || type == "textarea" || type == "password" || type == "email" || type == "search" || type == "tel" || type == "search" || type == "url") {
					var roleAattr = targ.getAttribute("role");
					if (roleAattr != null) {
						if (roleAattr == "combobox") {
							_opkey.getCustomeKeywordScript("click", targ, "OPKEY_IGNORE_CHECK");
							return;
						}
					}
				}
			}

			if (targ.nodeName === "INPUT") {
				if (targ.getAttribute("role") != null && targ.getAttribute("role") === "listbox" && targ.getAttribute("aria-roledescription")?.includes("Dropdown")) {
					_opkey.fiori_dropdown = targ;
					targ.alreadyopkeydone = true;
					e.handled = true;
					return;
				}
			}

			if (targ.nodeName == "SPAN") {
				if (targ.id != null) {
					if (targ.id.indexOf("-arrow") > -1) {
						if (targ.textContent == "Select Options") {
							_opkey.fiori_dropdown = targ;
							targ.alreadyopkeydone = true;
							e.handled = true;
							return;
						}
					}
				}
				if (targ.parentNode != null) {
					if (targ.parentNode.nodeName == "DIV") {
						if (targ.parentNode.getAttribute("role") != null) {
							if (targ.parentNode.getAttribute("role") == "combobox") {
								_opkey.fiori_dropdown = targ.parentNode;
								targ.alreadyopkeydone = true;
								e.handled = true;
								return;
							}
						}
					}
				}
				if (targ.getAttribute("role") != null) {
					if (targ.getAttribute("role") == "button") {
						if (targ.getAttribute("aria-label") != null) {
							if (targ.getAttribute("aria-label") == "Show Value Help") {
								_opkey.fiori_showvaluebutton = targ;
								targ.alreadyopkeydone = true;
								e.handled = true;
								return;
							}
						}
					}
				}

				if (targ.classList.contains("sapMSltArrow")) {
					_opkey.fiori_dropdown = targ;
					targ.alreadyopkeydone = true;
					e.handled = true;
					return;
				}
			}

			if (targ.nodeName == "LABEL") {
				var nextSib = targ.nextSibling;
				if (nextSib.classList.contains("sapMSltArrow")) {
					_opkey.fiori_dropdown = nextSib;
					targ.alreadyopkeydone = true;
					e.handled = true;
					return;
				}
			}

			if (_opkey.fiori_showvaluebutton != null) {
				if (_opkey.fiori_valuesearched == true) {
					var buttonElement = getButtonOFSpan(targ, "BUTTON");
					if (buttonElement != null) {
						if (buttonElement.title != null) {
							if (buttonElement.title == "Go") {
								targ.alreadyopkeydone = true;
								e.handled = true;
								return;
							}
						}
					}
				}
			}

			if (_opkey.fiori_showvaluebutton != null) {
				if (_opkey.fiori_valuesearched == true) {
					targ.alreadyopkeydone = true;
					var labelObject = new Object();
					var _oraclefusion = new SAPFIORI();
					_oraclefusion.GetLabelProperties(_opkey.fiori_showvaluebutton, labelObject);
					var buttonElement = getButtonOFSpan(targ, "TD");
					if (buttonElement.getAttribute("role") != null) {
						if (buttonElement.getAttribute("role") == "gridcell") {
							var args = {
								LabelName: labelObject["SAPFIORI:label:text"],
								Index: 0,
								PartialText: false,
								TextToType: buttonElement.textContent,
								Before: false
							};
							var recordedObject = _opkey.GetKeywordWithOutObject(
								"SAPFiori_SearchAndSelect", args, "object",
								targ);
							targ.alreadyopkeydone = true;
							buttonElement.alreadyopkeydone = true;
							e.handled = true;
							_opkey.fiori_showvaluebutton = null;
							_opkey.fiori_valuesearched = false;
							sendDataToRecorder(recordedObject);
							return;
						}
					}
				}
			}
			if (_opkey.fiori_dropdown != null) {
				if (targ.nodeName == "DIV" || targ.nodeName == "LI") {
					var optionItem = getListItemOfDiv(targ);
					if (optionItem != null) {
						if (optionItem.getAttribute("role") != null) {
							if (optionItem.getAttribute("role") == "option") {
								var optionText = optionItem.textContent;
								targ.alreadyopkeydone = true;
								_opkey.getCustomeKeywordScript("SAPFiori_SelectDropDownItem", _opkey.fiori_dropdown, optionText);
								_opkey.fiori_dropdown = null;
								e.handled = true;
								return;
							}
						}
					}
				}
			}

			if (_opkey.fiori_showvaluebutton != null) {
				_opkey.getCustomeKeywordScript("click", _opkey.fiori_showvaluebutton, "OPKEY_IGNORE_CHECK");
			}
			_opkey.fiori_showvaluebutton = null;
			_opkey.fiori_dropdown = null;
		}
	}

	if (recordingmode == "SALESFORCE") {
		if (e.type == "click" || e.type == "mousedown" || e.type == "mouseup") { // check
			if (targ.nodeName == "SB-SELECT") {
				return;
			}
			//for lightening keyword input is taking placeholder name which is coming wrong so done like this 
			if (targ.nodeName == "INPUT" || targ.nodeName == "SELECT") {
				var flag = 0;
				if (targ.parentNode !== null &&
					targ.parentNode.tagName === "DIV" &&
					(targ.parentNode.classList.contains("slds-form-element__control") || targ.parentNode.classList.contains("slds-select_container"))) {
					if (targ.parentNode.parentNode.parentNode.parentNode.parentNode != null && targ.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains("flowruntime-input")) {
						targ = targ.parentNode.parentNode.parentNode.parentNode.parentNode;



						targ.getElementsByTagName("DIV");
						for (var i = 0; i < targ.getElementsByTagName("DIV").length; i++) {


							if (targ.getElementsByTagName("DIV")[i].classList.contains("flowruntime-input-label")) {
								targ = targ.getElementsByTagName("DIV")[i];
								break;
							}
						}
						for (var i = 0; i < targ.childNodes.length; i++) {
							if (targ.childNodes[i].nodeType === 1 && targ.childNodes[i].tagName === "LIGHTNING-FORMATTED-RICH-TEXT") {
								targ = targ.childNodes[i];
								flag = 1;
								break;
							}
						}


						if (flag == 1)
							targ = targ.getElementsByTagName("SPAN")[0];
						flag = 0;

					}
				}





			}
			if (targ.type) {
				var type = targ.type;
				if (type == "text" || type == "textarea" || type == "password" || type == "email" || type == "search" || type == "tel" || type == "search" || type == "url") {
					if (_opkey.CheckDateTimeEditableElement(targ)) {
						_opkey.getCustomeKeywordScript("click", targ, "OPKEY_IGNORE_CHECK");
						return;
					}
					var next_sibling = targ.nextSibling;
					if (next_sibling) {
						if (next_sibling.nodeName == "LIGHTNING-BUTTON-ICON") {
							var _buttonNode = next_sibling.getElementsByTagName("BUTTON")[0];
							if (_buttonNode) {
								targ = _buttonNode;
								targ.opkeyIgnoreReturnCondition = true;
							}

						}
					}

				}
			}
		}

		if (targ.nodeName == "HTML") {
			return;
		}

		if (targ.nodeName == "DIV") {
			if (targ.getAttribute("one-applaunchermodal_applaunchermodal") != null) {
				return;
			}
		}
	}

	if (e.type == "click" || e.type == "mousedown" || e.type == "mouseup") {
		if (targ.type) {
			var type = targ.type;
			if (recordingmode == "SALESFORCE") {
				if (e.type == "mousedown") {
					var _triggerType = targ.getAttribute("last_opkey_trigger");
					if (_triggerType != null && _triggerType == "click") {
						return;
					}
				}
				if (e.type == "mouseup") {
					var _triggerType = targ.getAttribute("last_opkey_trigger");
					if (_triggerType != null && (_triggerType == "mousedown" || _triggerType == "click")) {
						return;
					}
				}
				if (e.type == "click") {
					var _triggerType = targ.getAttribute("last_opkey_trigger");
					if (_triggerType != null && (_triggerType == "mousedown" || _triggerType == "mouseup")) {
						return;
					}
				}
				targ.setAttribute("last_opkey_trigger", e.type);
			}
			if (type == "text" || type == "textarea" || type == "email" || type == "search") {
				_opkey.getCustomeKeywordScript("click", targ, "OPKEY_IGNORE_CHECK");
				return;
			}
			if (targ.nodeName == "INPUT" && type !== "password" && type !== "checkbox" && type !== "radio") {
				_opkey.getCustomeKeywordScript("click", targ, "OPKEY_IGNORE_CHECK");
				return;
			}
		} else {
			if (targ.nodeName == "INPUT") {
				_opkey.getCustomeKeywordScript("click", targ, "OPKEY_IGNORE_CHECK");
				return;
			}
		}
	}

	if (targ.nodeName == "INPUT" && targ.type == "tel") {
		return;
	}

	if (targ.nodeName == "INPUT" && targ.type == "url") {
		return;
	}

	if (targ.nodeName == "INPUT" && targ.type == "number") {
		return;
	}
	if (e.type == "click" || e.type == "mousedown" || e.type == "mouseup") {
		if (_opkey.textbox != null) {
			if (_opkey.textbox != targ) {
				var elInfo = this.identify(_opkey.textbox);
				var ids = elInfo.apis;
				var OREntry = this.isOREnabled ? this.getOREntry(ids) : null;
				var script = this.getScript(ids, _opkey.textbox, e.type, e);
				this.recordStep(script, _opkey.textbox);
				_opkey.textbox = null
			}
		}
	}
	if (targ.id && targ.id.indexOf("_opkey_ignore_") != -1) return;

	if (e.type == this.triggerType || e.type == "click" || e.type == "mousedown" || e.type == "mouseup") { // check
		// for
		// the
		// problem
		if (targ.type) {
			var type = targ.type;
			if (type == "text" || type == "textarea" || type == "password" || type == "email" || type == "search" ||
				type == "select-one" || type == "select-multiple") {
				var roleAattr = targ.getAttribute("role");
				if (roleAattr != null) {
					if (roleAattr == "combobox") {
						_opkey.getCustomeKeywordScript("click", targ, "OPKEY_IGNORE_CHECK");
						return;
					}
				}
				//mohit here fixed 
				else if (!(recordingmode == "SERVICENOW" && targ.classList != null && targ.classList.contains("form-control")))
					return;

			}
		}
	}

	if (targ.alreadyopkeydone) {
		if (targ.opkeyIgnoreReturnCondition == null) {
			return;
		}
	}

	/*
	if (targ instanceof SVGElement) {
		var tempTarget = targ;
		while (tempTarget.parentNode != null) {
			if (!(tempTarget instanceof SVGElement)) {
				targ = tempTarget;
				targ.alreadyopkeydone = null;
				break;
			}
			tempTarget = tempTarget.parentNode;
		}
	}*/



	var elInfo = this.identify(targ);
	var ids = elInfo.apis;
	if (ids.length == 0) {
		this.addAD({
			tag: targ.nodeName,
			type: null,
			event: "click",
			name: "_" + targ.nodeName,
			attributes: ["id", "className", "index"],
			action: "click",
			value: null
		});
		var elInfo = this.identify(targ);
		ids = elInfo.apis;
	}
	if (ids.length == 0) {
		if (_opkey.otherids != null) {
			if (_opkey.otherids.length > 0) {
				ids = _opkey.otherids;
			}
			if (targ.type != "select-multiple") {
				_opkey.otherselectnodefound = true;
			}
		}
	}
	if (ids.length == 0) {
		var elInfo = this.identify(targ.parentNode);
		if (elInfo != null) {
			ids = elInfo.apis;
			targ = targ.parentNode
			if (targ.nodeName == "BODY" || targ.nodeName == "HTML") {
				return;
			}
		}
	}
	if (targ.nodeName != "INPUT") {
		if (targ.type) {
			if (targ.type != "checkbox") {
				targ.alreadyopkeydone = true;
			}
		} else {
			targ.alreadyopkeydone = true;
		}
	}
	var OREntry = this.isOREnabled ? this.getOREntry(ids) : null;
	var script = this.getScript(ids, targ, e.type, e);
	if (script == null) {
		return;
	}

	if (script === "{}") {
		_opkey.getCustomeKeywordScript("click", actualElement, "OPKEY_IGNORE_CHECK");

		e.handled = true;
		return;
	}

	var tempscript = null;
	try {
		tempscript = script;
		var tempobject = JSON.parse(tempscript);
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
		if (this.hasEventBeenRecorded(script)) {
			return; // IE
		}
	}

	this.recordStep(script, targ);
	e.handled = true;
};
Opkey.prototype.showStepsInController = function (s, isRecorded) {
	try {
		var c = this.getController();
		if (c) {
			c.showSteps(s, isRecorded);
		}
	} catch (ex2) {
		// throw ex2;
	}
};
Opkey.prototype.showInController = function (info) {
	this.showStepsInController(this.getScript([info]));
};
Opkey.prototype.hasEventBeenRecorded = function (qs) {
	var now = (new Date()).getTime();
	if ((qs == this.lastQs) && ((now - this.lastTime) < 800)) {
		this.lastTime = now;
		return true;
	}
	this.lastQs = qs;
	this.lastTime = now;
	return false;
};
Opkey.prototype.getPopupName = function () {
	var n = null;
	if (this.isPopup()) {
		n = this.top().name;
		if (!n || n == "") {
			try {
				n = this.getTitle();
			} catch (e) { }
		}
	}
	return n ? n : "";
};
Opkey.prototype._title = function () {
	return this.getTitle();
}
Opkey.prototype.getTitle = function () {
	return this.trim(this.top().document.title);
}
Opkey.prototype.isPopup = function () {
	if (this.top().opener == null) return false;
	if (_opkey.top().opener.closed) return true;
	try {
		var x = _opkey.top().opener._opkey;
	} catch (openerFromDiffDomain) {
		return true;
	}
	if (_opkey.top().opener._opkey != null && _opkey.top().opener._opkey.top() != window._opkey.top()) {
		return true;
	}
	return false;
};
Opkey.prototype.addWait = function (time) {
	var val = parseInt(time);
	if (("" + val) == "NaN" || val < 200) throw new Error();
	this.showInController(new AccessorInfo("", "", "", "wait", time));
	// this.sendToServer('/_s_/dyn/Recorder_record?event=wait&value='+val);
};
Opkey.prototype.mark = function (s) {
	this.showInController(new AccessorInfo("", "", "", "mark", s));
};
Opkey.prototype.doAssert = function (s, v) {
	try {
		var el = eval(this.addOpkey(s));
		if ((typeof el) == "string" || (typeof el) == "boolean" || (typeof el) == "number") {
			var steps = "_assertEqual(" + this.quoted(v) + ", " + s + ");";
			this.addPopupDomainPrefixes(steps);
			this.showStepsInController(steps);
		} else if (el) {
			if (this.isFlexObj(el)) {
				var steps = [this.language.ASSERT_EXISTS, this.language.ASSERT_EQUAL_VALUE].join("\n");
				steps = steps.replace(/<accessor>/g, s);
				steps = steps.replace(/<value>/g, this.toJSON(v));
				steps = steps.replace(/<popup>/g, this.getPopupDomainPrefixes())
				this.showStepsInController(steps);
			} else {
				var elInfo = this.identify(el);
				var ids = elInfo.apis;
				if (ids.length == 0) return;
				var OREntry = this.isOREnabled ? this.getOREntry(ids) : null;

				var assertions = elInfo.assertions;
				var steps = assertions.join("\n");
				steps = steps.replace(/<accessor>/g, s);
				steps = steps.replace(/<value>/g, this.toJSON(v));
				steps = steps.replace(/<popup>/g, this.getPopupDomainPrefixes())
				this.showStepsInController(steps);
				this.lastOREntry = OREntry;
			}
		}
		// this.showInController(lastAccessedInfo);
		// this.sendToServer('/_s_/dyn/Recorder_record?'+getOpkeyPopUpQS()+this.getAccessorInfoQS(this.top()._lastAccessedInfo,
		// true));
	} catch (ex) {
		this.handleException(ex);
	}
};
Opkey.prototype.getTarget = function (e) {
	// <<##USEFUL TO GET OBJECT FROM TARGET COORDINATES getTarget
	var targ;
	if (!e) e = window.event;
	var evType = e.type;
	if (e.target) targ = e.target;
	else if (e.srcElement) targ = e.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;
	return targ;
};
var AccessorInfo = function (accessor, shortHand, type, event, value, valueType, relationStr, accessorType) {
	this.accessor = accessor;
	this.shortHand = shortHand;
	this.type = type;
	this.event = event;
	this.value = value;
	this.valueType = valueType;
	this.relationStr = relationStr;
	this.accessorType = accessorType;
};

Opkey.prototype.getAccessorInfoQS = function (ai, isAssert) {
	if (ai == null || ai.event == null) return;
	var s = "event=" + (isAssert ? "assert" : ai.event);
	s += "&accessor=" + this.encode(this.convertUnicode(ai.accessor));
	s += "&shorthand=" + this.encode(this.convertUnicode(ai.shortHand));
	s += "&type=" + ai.type;
	if (ai.value) {
		s += "&value=" + this.encode(this.convertUnicode(ai.value));
	}
	return s;
};
Opkey.prototype.addHandlersToAllFrames = function (win) {
	var fs = win.frames;
	try {
		this.addHandlers(win);
	} catch (e) { }
	if (fs && fs.length > 0) {
		for (var i = 0; i < fs.length; i++) {
			try {
				this.addHandlersToAllFrames(fs[i]);
			} catch (e) { }
		}
	}
};


Opkey.prototype.sendEnterKeyPressed = function (event) {

	if (event.keyCode === 13) {

		var recordingmode = _opkey.GetRecordingMode();
		if (recordingmode == "SAP FIORI") {
			debugger
			let targ = event.target;
			if (targ.hasEnterAlreadyPressed !== null && targ.hasEnterAlreadyPressed == true) {
				return;
			}
			targ.hasEnterAlreadyPressed = true;
			var recordedObject = _opkey.GetKeywordWithOutObject(
				"Enter", "", "string",
				targ);
			//	targ.alreadyopkeydone = true;
			event.handled = true;
			window.setTimeout(function () {
				targ.hasEnterAlreadyPressed = false;
				if (targ.nodeName === "INPUT" || targ.nodeName === "TEXTAREA") {
					lastPerformedActon = "SAP_FIORI_ENTER";
					return;
				}

				sendDataToRecorder(recordedObject);
			}, 500);
		}
	}
}


Opkey.prototype.docEventHandler = function (e) {
	if (!e) e = window.event;
	var t = this.getKnownTags(this.getTarget(e));
	if (t) {
		this.attachEvents(t);
	}
	//commented for Docker as it is reducing performnace
	this.AttachEventsInShadowDomElement();
};

Opkey.prototype.AttachEventsInShadowDomElement = function () {

	if (document.body) {
		if (document.body.getAttribute("SHADOW_DOM_RECORDING") == null) {
			//console.log("Shadow Dom Not Found Returning")
			//return; 
		}
	}

	var _shadowNodes = this.GetAllShadowRootsElements(null);
	for (var _sn = 0; _sn < _shadowNodes.length; _sn++) {
		var shadowNode = _shadowNodes[_sn];
		var shadowChilds = shadowNode.shadowRoot.querySelectorAll("*");
		for (var _ch = 0; _ch < shadowChilds.length; _ch++) {
			var _child = shadowChilds[_ch];
			_child.OPKEY_PARENT_NODE = shadowNode;
			var _child_Tags = this.getKnownTags(_child);
			if (_child_Tags) {
				if (_child_Tags.nodeName == "SN-COLLAPSIBLE-LIST")
					_child_Tags.isShadowDomElement = true;
				this.attachEvents(_child_Tags);
				if (_child_Tags.isShadowMouseOverAttached == null) {
					this.addWrappedEvent(_child_Tags, "mousemove", this.mouseOverShadowDom);
					_child_Tags.isShadowMouseOverAttached = true;
				}
			}
		}
	}
};

Opkey.prototype.GetAllShadowRootsElements = function (_node) {
	if (_node == null) {
		_node = document;
	}

	_node.isLowerMostShadowNode = false;

	var _allShadowNodes = [];
	var _childNodes = _node.childNodes;

	for (var _cn = 0; _cn < _childNodes.length; _cn++) {
		var _cnode = _childNodes[_cn];
		_cnode.isLowerMostShadowNode = true;
		_cnode.OPKEY_PARENT_NODE = _node;
		if (_cnode.shadowRoot != null) {
			_allShadowNodes.push(_cnode);
			var _innerNodes = this.GetAllShadowRootsElements(_cnode.shadowRoot);
			if (_innerNodes.length == 0) {
				_cnode.isLowerMostShadowNode = true;
			}

			for (var _in_0 = 0; _in_0 < _innerNodes.length; _in_0++) {
				var _innode = _innerNodes[_in_0];
				_innode.OPKEY_PARENT_NODE = _cnode;
				if (_innode.shadowRoot != null) {
					_cnode.isLowerMostShadowNode = false;
					_allShadowNodes.push(_innode);
				}
			}
		}

		var _innerNodes = this.GetAllShadowRootsElements(_cnode);
		for (var _in = 0; _in < _innerNodes.length; _in++) {
			var _innode = _innerNodes[_in];
			_innode.OPKEY_PARENT_NODE = _cnode;
			if (_innode.shadowRoot != null) {
				_cnode.isLowerMostShadowNode = false;
				_allShadowNodes.push(_innode);
			}
		}
	}
	return _allShadowNodes;
};

Opkey.prototype.addHandlers = function (win) {
	if (!win) win = this.self();
	var doc = win.document;
	this.addWrappedEvent(doc, "keyup", this.docEventHandler);
	this.addWrappedEvent(doc, "keyup", this.sendEnterKeyPressed);
	this.addWrappedEvent(doc, "mousemove", this.docEventHandler);


	// if(doc.hasOpkeyContextMenu) return;
	// doc.addEventListener('contextmenu', onContextMenu, false);
	// doc.hasOpkeyContextMenu=true
};
Opkey.prototype.attachEvents = function (el) {

	if (el.hasAttached) return;
	var tagName = el.tagName.toLowerCase();
	if (tagName.indexOf("nwh") > -1) {
		el.hasAttached = true;
		return;
	}
	this.addEvent(el, "contextmenu", OnAddTestCase);
	if (this.isFormElement(el)) {
		this.attachFormElementEvents(el);
	} else {
		this.attachImageEvents(el);
		this.addKeyListenertoContentEditable(el);
	}
	el.hasAttached = true;
};

Opkey.prototype.addKeyListenertoContentEditable = function (el) {
	try {
		if (el.hasAttribute("contenteditable") || el.isContentEditable == true) {
			this.addEvent(el, "keydown", this.onKeyUpInContentEditAble);
			this.addEvent(el, "focusout", this.onFocusOutInContentEditAble);
		}
	} catch (e) { }
};

Opkey.prototype.GetFramesOnInterval = function () {
	try {
		//debugger;
		if ((window.location.href.includes("force.com") && window.location.href.includes("-sf") || window.location.href.includes("oraclecloud.com"))) {


			window.onmessage = (event) => {

				//HERE WINDOW PARENT MESSAGE IS INTERFERING  WITH THE MESSAGE WHICH ARE DOING INTERACTION WITHIN SALESFORCE	  
				if (event.data == null && event.data == undefined) {
					window.parent.postMessage("{\"state\":\"loaded\"}", "*");
				}

			};
		}

		else {
			window.parent.postMessage("{\"state\":\"loaded\"}", "*");
		}



	} catch (e) {

	}
};

Opkey.prototype.onKeyUpInContentEditAble = async function (e) {
	if (_opkey.canHighlight == false) {
		return;
	}

	if (_opkey.ignore_highlight == true) {
		return;
	}
	_opkey.RuntimeMessageGatherer();
	_opkey.GetApexClassName(e);
	_opkey.GetFramesOnInterval();
	var e1 = e; // for trans-browser compatibility
	var charCode = e1.which || e1.keyCode;
	_opkey.contenteditableelement = e.target;

	await _opkey._highlightForObiq(e.target);

	if (charCode == 9) {
		_opkey.contenteditableelement = null;
		_opkey.getCustomeKeywordScript("_setValue", e.target, e.target.innerText);
		return;
	}
};

Opkey.prototype.onFocusOutInContentEditAble = function (e) {
	if (_opkey.canHighlight == false) {
		return;
	}

	if (_opkey.ignore_highlight == true) {
		return;
	}
	_opkey.GetFramesOnInterval();
	_opkey.RuntimeMessageGatherer();
	_opkey.GetApexClassName(e);
	if (_opkey.contenteditableelement != null) {
		_opkey.contenteditableelement = null;
		_opkey.getCustomeKeywordScript("_setValue", e.target, e.target.innerText);
		return;
	}
};


Opkey.prototype.onKeyUpInTextField = async function (e) {
	if (_opkey.canHighlight == false) {
		return;
	}

	if (_opkey.ignore_highlight == true) {
		return;
	}
	_opkey.GetFramesOnInterval();
	_opkey.RuntimeMessageGatherer();
	_opkey.GetApexClassName(e);
	var e1 = e; // for trans-browser compatibility
	var charCode = e1.which || e1.keyCode;
	if (charCode == 9) {
		return;
	}
	if (charCode == 13) {
		return;
	}
	var targ = _opkey.getKnownTags(_opkey.getTarget(e));
	if (!_opkey.IsElementVisible(targ)) {
		return;
	}

	await _opkey._highlightForObiq(targ);

	if (_opkey.fiori_showvaluebutton != null) {
		if (targ.type == "search") {
			_opkey.fiori_valuesearched = true;
			return;
		}
	}
	if (veeva_searchAndSelectRecording == true) {
		return;
	}
	_opkey.CheckSalesforceCondition(targ, e);
	_opkey.temptypedtextvalue = targ.value;
	_opkey.typekeysoccured = true
	_opkey.textbox = targ
};

Opkey.prototype.FocusInCheckSalesForceCondition = function (e) {
	var targ = e.target;
	_opkey.CheckSalesforceCondition(targ, e);
};

Opkey.prototype.typeTextOnFocusOut = function (e) {



	var targ = _opkey.getKnownTags(_opkey.getTarget(e));
	if (!_opkey.IsElementVisible(targ)) {
		return;
	}
	if (_opkey.fiori_showvaluebutton != null) {
		if (targ.type == "search") {
			_opkey.fiori_valuesearched = true;
			return;
		}
	}
	if (veeva_searchAndSelectRecording == true) {
		return;
	}
	if (_opkey.textbox != null) {

		_opkey.handleUserGuideRecordSnapshot(e);

		if (_opkey.textbox == targ) {

			var elInfo = _opkey.identify(_opkey.textbox);
			var ids = elInfo.apis;
			var OREntry = _opkey.isOREnabled ? _opkey.getOREntry(ids) : null;
			var script = _opkey.getScript(ids, _opkey.textbox, e.type, e);
			if (OREntry == null) {
				try {
					var script_object = JSON.parse(script);
					if (script_object.action.indexOf("SF_") == -1) {
						_opkey.textbox = null;
						_opkey.getCustomeKeywordScript("setValue", targ, _opkey.temptypedtextvalue);
						return;
					}
				} catch (e) {
					_opkey.textbox = null;
					_opkey.getCustomeKeywordScript("setValue", targ, _opkey.temptypedtextvalue);
					return;
				}
			}
			var tempscript = null;
			try {
				tempscript = script;
				var tempobject = JSON.parse(tempscript);
				tempobject.arguments[0].ObjectImage = null;
				tempobject.arguments[0]["parent"] = null;
				for (var key in tempobject.arguments[0]) {
					if (tempobject.arguments[0][key]) {
						tempobject.arguments[0][key] = removeindex(tempobject.arguments[0][key]);
					}
				}
				tempobject["action"] = "setValue";
				if (tempobject["action"] == "click") {
					tempobject.arguments[1]["data"] = null;
				}
				tempscript = JSON.stringify(tempobject)

			} catch (e) {
				tempscript = null;
			}

			if (tempscript != null) {
				if (_opkey.hasEventBeenRecorded(tempscript)) {
					_opkey.textbox = null
					_opkey.typekeysoccured = false
					return; // IE
				}
			} else {
				if (_opkey.hasEventBeenRecorded(script)) {
					_opkey.textbox = null
					_opkey.typekeysoccured = false
					return; // IE
				}
			}

			_opkey.recordStep(script, targ);
			_opkey.textbox = null
			_opkey.typekeysoccured = false
		}
	}
};

Opkey.prototype.typeTextOnChange = function (e) {

	var targ = _opkey.getKnownTags(_opkey.getTarget(e));
	if (!_opkey.IsElementVisible(targ)) {
		return;
	}

	if (_opkey.fiori_showvaluebutton != null) {
		if (targ.type == "search") {
			_opkey.fiori_valuesearched = true;
			return;
		}
	}
	if (veeva_searchAndSelectRecording == true) {
		return;
	}
	if (targ.isShadowDomChild === true) {
		_opkey.textbox = targ;
		_opkey.temptypedtextvalue = targ.value;
	}
	if (_opkey.textbox != null) {
		_opkey.handleUserGuideRecordSnapshot(e);
		if (_opkey.textbox == targ) {
			var elInfo = _opkey.identify(_opkey.textbox);
			var ids = elInfo.apis;
			var OREntry = _opkey.isOREnabled ? _opkey.getOREntry(ids) : null;
			var script = _opkey.getScript(ids, _opkey.textbox, e.type, e);
			if (OREntry == null) {
				try {
					var script_object = JSON.parse(script);
					if (script_object.action.indexOf("SF_") == -1) {
						_opkey.textbox = null;
						if (lastPerformedActon != null && lastPerformedActon === "SAP_FIORI_ENTER") {
							lastPerformedActon = null;
							_opkey.getCustomeKeywordScript("setValueAndEnter", targ, _opkey.temptypedtextvalue);
							return;
						}
						_opkey.getCustomeKeywordScript("setValue", targ, _opkey.temptypedtextvalue);
						return;
					}
				} catch (e) {
					_opkey.textbox = null;
					_opkey.getCustomeKeywordScript("setValue", targ, _opkey.temptypedtextvalue);
					return;
				}
			}
			var tempscript = null;
			try {
				tempscript = script;
				var tempobject = JSON.parse(tempscript);
				tempobject.arguments[0].ObjectImage = null;
				tempobject.arguments[0]["parent"] = null;
				for (var key in tempobject.arguments[0]) {
					if (tempobject.arguments[0][key]) {
						tempobject.arguments[0][key] = removeindex(tempobject.arguments[0][key]);
					}
				}
				tempobject["action"] = "setValue";
				if (tempobject["action"] == "click") {
					tempobject.arguments[1]["data"] = null;
				}
				tempscript = JSON.stringify(tempobject)

			} catch (e) {
				tempscript = null;
			}

			if (tempscript != null) {
				if (_opkey.hasEventBeenRecorded(tempscript)) {
					_opkey.textbox = null
					_opkey.typekeysoccured = false
					return; // IE
				}
			} else {
				if (_opkey.hasEventBeenRecorded(script)) {
					_opkey.textbox = null
					_opkey.typekeysoccured = false
					return; // IE
				}
			}
			_opkey.recordStep(script, targ);
			_opkey.textbox = null
			_opkey.typekeysoccured = false
		}
	}
	/*
	 * else{ alert("abc") if(_opkey.typekeysoccured==false){
	 * 
	 * try{ var targ = _opkey.getKnownTags(_opkey.getTarget(e)); var elInfo =
	 * _opkey.identify(targ); var ids = elInfo.apis; var OREntry =
	 * _opkey.isOREnabled ? _opkey.getOREntry(ids) : null; var script =
	 * _opkey.getScript(ids, targ, e.type, e); _opkey.recordStep(script,
	 * OREntry); }catch(e){ } } }
	 */
};

Opkey.prototype.GetTableKeyword = function (element) {
	try {
		var record_id = "";
		var selected_table_name = "";
		var table_name_parents_h2 = document.getElementsByTagName("H1");
		// debugger;
		for (var t_n_p_i = 0; t_n_p_i < table_name_parents_h2.length; t_n_p_i++) {
			var table_name_parent_h2 = table_name_parents_h2[t_n_p_i];
			if (table_name_parent_h2.classList != null) {
				if (table_name_parent_h2.classList.contains("slds-page-header__title")) {
					var childs_of_table = table_name_parent_h2.getElementsByTagName("*");
					for (var c_o_t = 0; c_o_t < childs_of_table.length; c_o_t++) {
						var child_of_table = childs_of_table[c_o_t];
						if (child_of_table.nodeName == "SPAN") {
							if (child_of_table.classList != null) {
								if (child_of_table.classList.contains("selectedListView")) {
									if (_opkey.IsElementVisible(child_of_table)) {
										selected_table_name = child_of_table.textContent.trim();

										break;
									}
								}
							}
						}
					}
				}
			}
		}

		if (selected_table_name == "") {
			var select_elements = document.getElementsByTagName("SELECT");
			for (var s_i = 0; s_i < select_elements.length; s_i++) {
				var select_element = select_elements[s_i];
				if (select_element != null) {
					if (select_element.getAttribute("name") != null) {
						if (select_element.getAttribute("name") == "fcf") {
							if (_opkey.IsElementVisible(select_element)) {
								selected_table_name = select_element.options[select_element.selectedIndex].textContent.trim();
							}
						}
					}
				}
			}
		}

		if (selected_table_name == "") {
			return null;
		}
		var temp_element = element;
		var find_element = element;
		var table_element = null;
		var tr_element = null;
		var current_td_element = null;
		var head_tr_element = null;

		var current_selected_cellText = element.textContent;
		while (find_element.parentNode != null) {
			if (find_element.nodeName == "TABLE") {
				var tr_size = find_element.getElementsByTagName("TR").length;
				if (tr_size > 1) {
					table_element = find_element;
					break;
				}
			}
			find_element = find_element.parentNode;
		}


		if (temp_element.nodeName == "TD" || temp_element.nodeName == "TH") {
			current_td_element = temp_element;
		}
		if (current_td_element == null) {
			find_element = element;
			while (find_element.parentNode != null) {
				if (find_element.nodeName.length == 2) {
					if (find_element.nodeName.indexOf("T") == 0) {
						current_td_element = find_element;
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
		// //////debugger;
		if (table_element != null) {
			var head_element = table_element.getElementsByTagName("THEAD")[0];
			if (head_element != null) {
				var tr_element_1 = head_element.getElementsByTagName("TR")[0];
				if (tr_element_1 != null) {
					head_tr_element = tr_element_1;
				}
			} else {
				var tbody_element = table_element.getElementsByTagName("TBODY")[0];
				if (tbody_element != null) {
					var tr_element_2 = tbody_element.getElementsByTagName("TR")[0];
					if (tr_element_2 != null) {
						head_tr_element = tr_element_2;
					}

				}
			}
		}

		var all_headersName = [];
		if (tr_element != null) {
			if (current_td_element != null) {
				if (head_tr_element != null) {
					var headers_array = [];
					var columns_array = [];
					var th_elements = head_tr_element.childNodes;
					for (var th_i = 0; th_i < th_elements.length; th_i++) {
						var th_element = th_elements[th_i];

						if (_opkey.IsElementVisible(th_element)) {
							if (th_element.nodeName.length == 2) {
								if (th_element.nodeName.indexOf("T") == 0) {
									if (th_element.nodeName != "TR") {
										var elements_of_header = th_element.getElementsByTagName("*");
										if (elements_of_header.length > 0) {
											for (var e_f_h = 0; e_f_h < elements_of_header.length; e_f_h++) {
												var element_of_header = elements_of_header[e_f_h];
												if (element_of_header.getAttribute("title") != null) {
													headers_array.push(element_of_header.getAttribute("title"));
													break;
												}
											}
										} else {
											headers_array.push(th_element.textContent.trim());
										}
									}
								}
							}
						}
					}

					var td_elements = tr_element.childNodes;
					for (var td_i = 0; td_i < td_elements.length; td_i++) {
						var td_element = td_elements[td_i];
						if (_opkey.IsElementVisible(td_element)) {
							if (td_element.nodeName.length == 2) {
								if (td_element.nodeName.indexOf("T") == 0) {
									if (td_element.nodeName != "TR") {
										var is_text_content_found = false;
										if (!td_element.classList.contains("x-grid3-td-LIST_RECORD_ID") && !td_element.classList.contains("x-grid3-td-ACTION_COLUMN")) {
											var elements_of_column = td_element.getElementsByTagName("*");
											if (elements_of_column.length > 0) {
												var is_text_found = false;
												for (var e_f_c = 0; e_f_c < elements_of_column.length; e_f_c++) {
													var element_of_column = elements_of_column[e_f_c];
													if (element_of_column.classList != null) {
														if (element_of_column.classList.contains("slds-truncate")) {
															if (element_of_column.getAttribute("title") != null) {
																is_text_content_found = true;
																columns_array.push(element_of_column.getAttribute("title"));
																break;
															} else {
																is_text_content_found = true;
																columns_array.push(element_of_column.textContent.trim());
																break;
															}
														}

													}

												}
											} else {
												if (_opkey.GetSalesforceMode() == "CLASSIC") {
													is_text_content_found = true;
													// //////debugger;
													columns_array.push(td_element.textContent.trim());
												}
											}


											if (is_text_content_found == false) {
												if (_opkey.GetSalesforceMode() == "CLASSIC") {
													// //////debugger;
													columns_array.push(td_element.textContent.trim());
												}
											}
										}
									}
								}
							}
						}
					}

					var current_td_text = "";
					var elements_of_current_td_element = current_td_element.getElementsByTagName("*");
					if (elements_of_current_td_element.length > 0) {
						for (var e_f_h_e = 0; e_f_h_e < elements_of_current_td_element.length; e_f_h_e++) {
							var element_of_current_td_element = elements_of_current_td_element[e_f_h_e];
							if (_opkey.IsElementVisible(element_of_current_td_element)) {
								if (element_of_current_td_element.classList.contains("slds-truncate")) {
									if (element_of_current_td_element.getAttribute("title") != null) {
										if (element_of_current_td_element.getAttribute("title") != "") {
											current_td_text = element_of_current_td_element.getAttribute("title");
											break;
										} else {
											current_td_text = element_of_current_td_element.textContent.trim();
											break;
										}
									} else {
										current_td_text = element_of_current_td_element.textContent.trim();
										break;
									}
								}
							}
						}
					} else {
						current_td_text = current_td_element.textContent.trim();
					}

					if (current_td_text == "") {
						if (_opkey.GetSalesforceMode() == "CLASSIC") {
							current_td_text = current_td_element.textContent.trim();
						}
					}

					if (current_td_text == "") {
						current_td_text = current_td_element.textContent.trim();
					}

					// ////debugger;
					var temp_columns_array = columns_array.slice(0);
					var temp_headers_array = headers_array.slice(0);
					// alert(current_cell_index);
					var current_td_index = temp_columns_array.indexOf(current_td_text);
					var current_column_name = headers_array[current_td_index];
					var current_cell_index = current_td_element.cellIndex;
					for (var cc_i = current_cell_index; cc_i > -1; cc_i--) {
						var c_column = temp_columns_array[cc_i];
						if (c_column != null) {
							if (current_td_text == c_column) {
								current_td_index = cc_i;
								current_column_name = headers_array[cc_i];
								temp_columns_array.splice(current_td_index, 1);
								temp_headers_array.splice(current_td_index, 1);
								break;
							}
						}
					}
					if (current_td_index != -1) {
						// temp_columns_array.splice(current_td_index,1);
						// temp_headers_array.splice(current_td_index,1);
					}

					var args = {
						"TableName": selected_table_name,
						"ColumnName": current_column_name,
						"Object Index": "0",
						"TextToClick": current_selected_cellText,
						"TextIndex": "0"
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
							args["Identifier" + header_index] = h_c_object["Header"];
							args["Value" + header_index] = h_c_object["Value"];
							header_index++;
						}
					}


					var headersdelimited_string = "";
					for (var h_v_o_1 = 0; h_v_o_1 < headers_array.length; h_v_o_1++) {
						var h_c_object_1 = headers_array[h_v_o_1];
						if (headersdelimited_string != "") {
							headersdelimited_string += ";";
						}
						headersdelimited_string += h_c_object_1;
					}

					args["TableColumns"] = headersdelimited_string;
					return _opkey.GetKeywordWithOutObject("SF_ClickInTableCellUsingText", args, "object", table_element);
				}
			}
		}
	} catch (e) { }
	return null;
}

Opkey.prototype.GetPeopleSoftTableKeyword = function (element) {
	var ps = new PeopleSoft_OpKey();
	var tableDataObject = ps.GetTableProp(element);

	if (tableDataObject == null) {
		return null;
	} else {
		var args = {
			"TableName": "",
			"ColumnName": tableDataObject.currentHeader,
			"Object Index": "0",
			"TextToClick": tableDataObject.currentCol,
			"TextIndex": "0",
			"RowNumber": tableDataObject.currentRowNumber
		};

		var temp_headers_array = tableDataObject.allheader_InnerText;
		var temp_columns_array = tableDataObject.allcols_InnerText;
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
				args["Identifier" + header_index] = h_c_object["Header"];
				args["Value" + header_index] = h_c_object["Value"];
				header_index++;
			}
		}
		// args["RowNumber"] = tableDataObject.currentRowNumber;
		return _opkey.GetKeywordWithOutObject("PS_ClickTableCell", args, "object", tableDataObject.tableObject);
	}


}


Opkey.prototype.GetOracleFusionTableKeyword = function (element) {
	var of = new OracleFusion();
	var tableDataObject = of.GetTableProp(element);

	if (tableDataObject == null) {
		return null;
	} else {
		var args = {
			"TableName": "",
			"ColumnName": tableDataObject.currentHeader,
			"Object Index": "0",
			"TextToClick": tableDataObject.currentCol,
			"TextIndex": "0"
		};

		var temp_headers_array = tableDataObject.allheader_InnerText;
		var temp_columns_array = tableDataObject.allcols_InnerText;
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
				args["Identifier" + header_index] = h_c_object["Header"];
				args["Value" + header_index] = h_c_object["Value"];
				header_index++;
			}
		}
		// args["RowNumber"] = tableDataObject.currentRowNumber;
		return _opkey.GetKeywordWithOutObject("OracleFusion_ClickTableCell", args, "object", tableDataObject.tableObject);
	}


}


function getRawAction(element) {
	if (element.nodeName == "SELECT") {
		return "setSelected";
	}
	if (element.nodeName == "INPUT") {
		if (element.type != null) {
			if (element.type == "button") {
				return "click";
			}

			if (element.type == "submit") {
				return "click";
			}
		}
	}
	if (element.nodeName == "INPUT") {
		if (element.type != null) {
			return "setValue";
		}
	}
	if (element.nodeName == "TEXTAREA") {
		return "setValue";
	}
	return "click";
}

var lastQs_1;
var lastTime_1;

function hasRightClickInvoked(qs_1) {
	var now = (new Date()).getTime();
	if ((qs_1 == lastQs_1) && ((now - lastTime_1) < 500)) {
		lastTime_1 = now;
		return true;
	}
	lastQs_1 = qs_1;
	lastTime_1 = now;
	return false;
}

function TriggerContextMenuEvent(element) {
	if (window.CustomEvent) {
		element.dispatchEvent(new CustomEvent('contextmenu'));
	} else if (document.createEvent) {
		var ev = document.createEvent('HTMLEvents');
		ev.initEvent('contextmenu', true, false);
		element.dispatchEvent(ev);
	} else { // Internet Explorer
		element.fireEvent('oncontextmenu');
	}
}

function CheckDateTimeKeyword(element) {
	// ////debugger;
	if (element.nodeName == "A") {
		if (element.classList != null) {
			if (element.classList.contains("datePicker-openIcon") || element.classList.contains("timePicker-openIcon")) {
				var parent_element = element.parentNode;
				if (parent_element != null) {
					var input_0 = parent_element.getElementsByTagName("INPUT")[0];
					if (input_0 != null) {
						element = input_0;
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
								// //////debugger;
								var temp_element_2 = element;
								while (temp_element_2.parentNode != null) {
									if (temp_element_2.nodeName == "FIELDSET") {
										var label_temp_element = temp_element_2.childNodes[0];
										if (label_temp_element != null) {
											if (label_temp_element.nodeName == "LEGEND") {
												var child_nodes = label_temp_element.childNodes;
												for (var c_h = 0; c_h < child_nodes.length; c_h++) {
													var c_node = child_nodes[c_h];
													if (c_node.nodeName != "#text" && c_node.nodeName != "#comment") {
														label_data = c_node.textContent;
														break;
													}
												}
												break;
											}
										}
									}
									temp_element_2 = temp_element_2.parentNode;
								}
							}
							if (label_data == "") {
								if (element.getAttribute("id") != null) {
									var input_of_id = element.getAttribute("id");
									var labels = document.getElementsByTagName("LABEL");
									for (var l_i = 0; l_i < labels.length; l_i++) {
										var label = labels[l_i];
										if (label.getAttribute("for") != null) {
											if (label.getAttribute("for") == input_of_id) {
												label_data = label.textContent;
												break;
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
						} else if (temp_element.classList.contains("uiInputDateTime")) {
							// //////debugger;
							var label_datetime = "";
							if (label_datetime == "") {
								var temp_element_2 = element;
								while (temp_element_2.parentNode != null) {
									if (temp_element_2.nodeName == "FIELDSET") {
										var label_temp_element = temp_element_2.childNodes[0];
										if (label_temp_element != null) {
											if (label_temp_element.nodeName == "LEGEND") {
												var child_nodes = label_temp_element.childNodes;
												for (var c_h_0 = 0; c_h_0 < child_nodes.length; c_h_0++) {
													var c_node = child_nodes[c_h_0];
													if (c_node.nodeName != "#text" && c_node.nodeName != "#comment") {
														label_datetime = c_node.textContent;
														break;
													}
												}

												var input_elements = temp_element.getElementsByTagName("INPUT");
												var object2 = new Object();
												object2["Label"] = label_datetime;
												object2["DateTimeElemnts"] = input_elements;
												if (object2["DateTimeElemnts"] != null) {

													var input_elements_0 = object2["DateTimeElemnts"];
													var args = {
														"labelName": label_datetime,
														"Index": "0",
														"Value": input_elements_0[0].value + " " + input_elements_0[1].value
													};
													// ////debugger;
													return _opkey.GetKeywordWithOutObject("SF_SetDateTime", args, "object", temp_element);
												}

												var args = {
													"DateEvent": label_datetime,
													"Index": "0",
													"Date(MM/DD/YYYY)": element.value
												};
												// ////debugger;
												return _opkey.GetKeywordWithOutObject("SF_SetDate", args, "object", temp_element);


											}
										}
									}
									temp_element_2 = temp_element_2.parentNode;
								}
							}

							if (label_datetime == "") {

								if (element.getAttribute("id") != null) {
									var input_of_id = element.getAttribute("id");
									var labels = document.getElementsByTagName("LABEL");
									for (var l_i = 0; l_i < labels.length; l_i++) {
										var label = labels[l_i];
										if (label.getAttribute("for") != null) {

											if (label.getAttribute("for") == input_of_id) {
												var input_elements = temp_element.getElementsByTagName("INPUT");
												var input_elements = temp_element.getElementsByTagName("INPUT");
												var label_content = label.textContent;
												var object2 = new Object();
												object2["Label"] = label_content;
												object2["DateTimeElemnts"] = input_elements;
												if (object2["DateTimeElemnts"] != null) {

													var input_elements_0 = object2["DateTimeElemnts"];
													var args = {
														"labelName": label_content,
														"Index": "0",
														"Value": input_elements_0[0].value + " " + input_elements_0[1].value
													};
													// ////debugger;
													return _opkey.GetKeywordWithOutObject("SF_SetDateTime", args, "object", temp_element);
												}

												var args = {
													"DateEvent": label_content,
													"Index": "0",
													"Date(MM/DD/YYYY)": element.value
												};
												// ////debugger;
												return _opkey.GetKeywordWithOutObject("SF_SetDate", args, "object", temp_element);

											}
										}
									}
								}
							}

						} else if (temp_element.classList.contains("dateInput")) {
							// debugger;
							var label_content = _opkey.GetLabelComponent(element);
							// console.log("Classic Label Content
							// "+label_content);
							var object2 = new Object();
							var datetime_array = [];
							datetime_array.push(element);
							var id_element = element.getAttribute("id");
							if (id_element != null) {
								var time_id_element = id_element + "_time";
								var time_element = document.getElementById(time_id_element);
								if (time_element != null) {
									datetime_array.push(time_element);
								}
							}
							object2["Label"] = label_content;
							object2["DateTimeElemnts"] = datetime_array;
							if (object2["DateTimeElemnts"] != null) {
								var input_elements_0 = object2["DateTimeElemnts"];
								if (input_elements_0.length > 1) {
									var args = {
										"labelName": label_content,
										"Index": "0",
										"Value": input_elements_0[0].value + " " + input_elements_0[1].value
									};
									// ////debugger;
									return _opkey.GetKeywordWithOutObject("SF_SetDateTime", args, "object", temp_element);

								} else if (input_elements_0.length == 1) {
									if (input_elements_0[0].parentNode.classList != null) {
										if (input_elements_0[0].parentNode.classList.contains("dateInput")) {
											if (!input_elements_0[0].parentNode.classList.contains("dateOnlyInput")) {
												if (_opkey.GetSalesforceMode() != "CLASSIC") {
													var args = {
														"DateEvent": label_content,
														"Index": "0",
														"Date(MM/DD/YYYY)": input_elements_0[0].value
													};
													// ////debugger;
													return _opkey.GetKeywordWithOutObject("SF_SetDate", args, "object", temp_element);
												}

												var args = {
													"labelName": label_content,
													"Index": "0",
													"Value": input_elements_0[0].value
												};
												// ////debugger;
												return _opkey.GetKeywordWithOutObject("SF_SetDateTime", args, "object", temp_element);
											}
										}
									}
								}
							}

							var args = {
								"DateEvent": label_content,
								"Index": "0",
								"Date(MM/DD/YYYY)": element.value
							};
							// ////debugger;
							return _opkey.GetKeywordWithOutObject("SF_SetDate", args, "object", temp_element);

						} else if (temp_element.classList.contains("timeInput")) {
							// //////debugger;
							var datetime_array = [];
							var label_content = _opkey.GetLabelComponent(element);
							var id_element = element.getAttribute("id");
							if (id_element != null) {
								var date_id_element = id_element.replace("_time", "");
								var date_element = document.getElementById(date_id_element);
								if (date_element != null) {
									if (label_content == "") {
										label_content = _opkey.GetLabelComponent(date_element);
									}
									datetime_array.push(date_element);
								}
							}
							datetime_array.push(element);
							var object2 = new Object();
							object2["Label"] = label_content;
							object2["DateTimeElemnts"] = datetime_array;

							if (object2["DateTimeElemnts"] != null) {

								var input_elements_0 = object2["DateTimeElemnts"];
								var args = {
									"labelName": label_content,
									"Index": "0",
									"Value": input_elements_0[0].value + " " + element.textContent.trim()
								};
								return _opkey.GetKeywordWithOutObject("SF_SetDateTime", args, "object", element);
							}


							var args = {
								"TimeEvent": label_content,
								"Index": "0",
								"Time(hh:mm)": element.value
							};
							return _opkey.GetKeywordWithOutObject("SF_SetTime", args, "object", element);

						}
					}
					temp_element = temp_element.parentNode;
					limit++;
				}
			}
		}
	}

	var temp_element2 = element;
	while (temp_element2.parentNode != null) {
		if (temp_element2.nodeName == "LIGHTNING-TIMEPICKER") {
			var label_content = "";
			var label_element = temp_element2.getElementsByTagName("LABEL")[0];
			if (label_element != null) {
				label_content = label_element.textContent;
			}
			var args = {
				"TimeEvent": label_content,
				"Index": "0",
				"Time(hh:mm)": element.value
			};
			return _opkey.GetKeywordWithOutObject("SF_SetTime", args, "object", element);
		}
		temp_element2 = temp_element2.parentNode;
	}

	return null;
}

var contextmenu_opened = false;
var current_context_element = null;
var prev_nano_time = 0;
var opkey_datetime_required = false;
var clickbuttoninrelatedlistrequired = false;

function GetExactNode(el) {
	if (el.nodeName != "A" && el.nodeName != "BUTTON" && el.nodeName != "INPUT") {
		var temp_element = el;
		while (temp_element.parentNode != null) {
			if (temp_element.nodeName == "A" || temp_element.nodeName == "BUTTON" || temp_element.nodeName == "INPUT") {
				return temp_element;
			}
			temp_element = temp_element.parentNode;
		}
	}
	return el;
}

function OnAddTestCase(e) {
	// console.log("ON ADD TEST CASE");
	if (_opkey.can_record == false) {
		return;
	}
	var targ = e.target;

	if (hasRightClickInvoked(targ)) {
		return;
	}

	contextmenu_opened = true;
	targ = GetExactNode(targ);

	var RecordingMode = _opkey.GetRecordingMode();
	if (RecordingMode == "ORACLE FUSION") {
		var OFTableScript = _opkey.GetOracleFusionTableKeyword(targ)
		if (OFTableScript != null) {
			contextmenu_opened = false;
			OFTableScript["isAddedFromRightClick"] = true;
			chrome.runtime.sendMessage({
				rightClickKeywordData: JSON.stringify(OFTableScript)
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
			return;
		}
	}

	if (RecordingMode == "PEOPLESOFT") {
		var PSTableScript = _opkey.GetPeopleSoftTableKeyword(targ)
		if (PSTableScript != null) {
			contextmenu_opened = false;
			PSTableScript["isAddedFromRightClick"] = true;
			chrome.runtime.sendMessage({
				rightClickKeywordData: JSON.stringify(PSTableScript)
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
			return;
		}
	}

	_opkey.CheckSalesforceCondition(targ, e);

	var date_data = CheckDateTimeKeyword(targ);
	if (date_data != null) {
		contextmenu_opened = false;
		date_data["isAddedFromRightClick"] = true;
		// console.log("*****DATE KEYWORD DATA "+JSON.stringify(date_data));
		chrome.runtime.sendMessage({
			rightClickKeywordData: JSON.stringify(date_data)
		}, function (response) {
			if (chrome.runtime.lastError) { }
		});
		return;
	}

	var table_script = _opkey.GetTableKeyword(targ);
	if (table_script != null) {
		contextmenu_opened = false;
		table_script["isAddedFromRightClick"] = true;
		chrome.runtime.sendMessage({
			rightClickKeywordData: JSON.stringify(table_script)
		}, function (response) {
			if (chrome.runtime.lastError) { }
		});
		return;
	}
	var value = "OPKEY_VALUE_IGNORE";
	if (targ.value != null) {
		if (targ.value != "") {
			value = targ.value;
		}
	}
	if (targ.nodeName == "SELECT") {
		value = targ.options[targ.selectedIndex].textContent;
	}
	opkey_datetime_required = true;
	var script_0 = _opkey.getCustomeKeywordScriptReturnedData(getRawAction(targ), targ, value, true);
	opkey_datetime_required = false;
	// ////debugger;
	if (script_0 != null) {
		script_0 = JSON.parse(script_0);
		script_0["isAddedFromRightClick"] = true;
		contextmenu_opened = false;
		chrome.runtime.sendMessage({
			rightClickKeywordData: JSON.stringify(script_0)
		}, function (response) {
			if (chrome.runtime.lastError) { }
		});
		return;
	}
};

Opkey.prototype.attachFormElementEvents = function (el) {
	// <<##MAIN RECORDING STARTED AFTER CLICK!!!!
	var type = el.type;
	var wrapped = this.wrappedOnEv;
	var wrappedOnMouseDown = this.wrappedOnMouseDownEv;
	if (el.hasEnterPressListner == null) {
		this.addWrappedEvent(el, "keyup", this.sendEnterKeyPressed);
		el.hasEnterPressListner = true;
	}
	if (el.nodeName == "INPUT") {
		if (el.type == "text") {
			var recordingmode = _opkey.GetRecordingMode();
			if (recordingmode == "MSDynamics FSO") {
				this.addWrappedEvent(el, "mousedown", this.onEv);
				this.addWrappedEvent(el, "click", this.onEv);
				this.addWrappedEvent(el, "mouseup", this.onEv);
			}
		}
	}
	if (el.onchange == this.typeTextOnChange || el.onblur == wrapped || el.onclick == wrapped || el.onkeyup == this.onKeyUpInTextField) return;
	if (type == "text") {
		try {
			if (el.classList.contains("input") || el.classList.contains("slds-combobox__input")) {
				el.addEventListener('click', function (e) {
					_opkey.getCustomeKeywordScript("click", e.target, "")
				}, true);
			}

			if (el.classList.contains("input") || el.classList.contains("publishertextarea")) {
				el.addEventListener('click', function (e) {
					_opkey.getCustomeKeywordScript("click", e.target, "")
				}, true);
			}
		} catch (e) { }
	}
	if (el.nodeName == "TEXTAREA") {
		if (el.classList.contains("publishertextarea") || el.classList.contains("cuf-commentTextArea") || el.classList.contains("gwt-TextArea")) {
			el.addEventListener('mousedown', function (e) {
				_opkey.getCustomeKeywordScript("click", e.target, "")
			}, true);
		}
	}
	if (type == "email" || type == "tel" || type == "search" || type == "url") {
		if (el.readonly != null) {
			el.addEventListener('click', function (e) {
				_opkey.getCustomeKeywordScript("click", e.target, "")
			}, true);
		}
		this.addEvent(el, "keyup", this.onKeyUpInTextField);
		this.addEvent(el, "change", this.typeTextOnChange);
		this.addEvent(el, "focusout", this.typeTextOnFocusOut);
		this.addEvent(el, "focusin", this.FocusInCheckSalesForceCondition);
		if (type == "search")
			this.addEvent(el, "keyup", this.onKeyUpInTextField);
		this.addEvent(el, "focusout", this.typeTextOnFocusOut);
		this.addEvent(el, "focusin", this.FocusInCheckSalesForceCondition);
		// this.addEvent(el, "mousedown", wrappedOnMouseDown);
	} else if (type == "text" || type == "file" || type == "textarea" || type == "password" || type == "number") {
		if (el.readonly != null) {
			el.addEventListener('click', function (e) {
				_opkey.getCustomeKeywordScript("click", e.target, "")
			}, true);
		}
		this.addEvent(el, "change", this.typeTextOnChange);
		this.addEvent(el, "focusout", this.typeTextOnFocusOut);
		this.addEvent(el, "focusin", this.FocusInCheckSalesForceCondition);
		this.addEvent(el, "keyup", this.onKeyUpInTextField);
	} else if (type == "select-one" || type == "select-multiple") {
		this.addEvent(el, "change", wrapped);
	} else if (type == "button" || type == "submit" || type == "reset" || type == "checkbox" || type == "radio" || type == "image") {
		this.addEvent(el, "mouseup", wrapped);
		// this.addEvent(el, "dblclick", wrapped);
		// this.addEvent(el, "mousedown", wrappedOnMouseDown);
	}
	if (el.hasopkeycontextattached == null) {
		el.hasopkeycontextattached = true;
		// this.addEvent(el, "contextmenu", OnAddTestCase);
	}
};
Opkey.prototype.attachLinkEvents = function (el) {
	// this.addWrappedEvent(el, "mousedown", this.onMouseDownEv);
	this.addWrappedEvent(el, this.triggerType, this.onEv);
	// this.addWrappedEvent(el, "dblclick", this.onEv);
};
Opkey.prototype.attachImageEvents = function (el) {
	if (el.hasEnterPressListner == null) {
		this.addWrappedEvent(el, "keyup", this.sendEnterKeyPressed);
		el.hasEnterPressListner = true;
	}
	if (el.nodeName == "DIV") {
		// adding mousedown event on DIV element is not triggering click event
		// on particular element in Firefox --- added by ganesh
		if (!_opkey.checkIsFirefox()) {
			if (el.getAttribute("role") != null && el.getAttribute("role") == "option") {
				this.addWrappedEvent(el, "mousedown", this.onEv);
			}
		}

		this.addWrappedEvent(el, "click", this.onEv);
		// this.addWrappedEvent(el, this.triggerType, this.onEv);
		if (el.hasopkeycontextattached == null) {
			el.hasopkeycontextattached = true;
			// this.addEvent(el, "contextmenu", OnAddTestCase);
		}

	} else if (el.nodeName == "A") {
		this.addWrappedEvent(el, "mouseup", this.onEv);
		// this.addWrappedEvent(el, "click", this.onEv);
	} else {

		// this.addWrappedEvent(el, "mouseup", this.onMouseDownEv);
		if (!_opkey.checkIsFirefox()) {
			this.addWrappedEvent(el, "mousedown", this.onEv);
		}

		this.addWrappedEvent(el, "click", this.onEv);
		this.addWrappedEvent(el, "mouseup", this.onEv);
		// this.addWrappedEvent(el, this.triggerType, this.onEv);
		if (el.hasopkeycontextattached == null) {
			el.hasopkeycontextattached = true;
			// this.addEvent(el, "contextmenu", OnAddTestCase);
		}
	}
};
Opkey.prototype.addWrappedEvent = function (el, ev, fn) {
	this.addEvent(el, ev, this.wrap(fn));
};
Opkey.prototype.addEvent = function (el, ev, fn) {
	//!!!!<<##CHECK FOR EVENT!!!!!! 
	if (!el) return;
	if (el.attachEvent) {
		el.attachEvent("on" + ev, fn);
	} else if (el.addEventListener) {
		el.addEventListener(ev, fn, true);
	}
};
Opkey.prototype.removeEvent = function (el, ev, fn) {
	if (!el) return;
	if (el.attachEvent) {
		el.detachEvent("on" + ev, fn);
	} else if (el.removeEventListener) {
		el.removeEventListener(ev, fn, true);
	}
};
Opkey.prototype.setRetries = function (i) {
	// if(this.isRecording()) return;
	this.sendToServer("/_s_/dyn/Player_setRetries?retries=" + i);
	// this.setServerVar("sahi_retries", i);
};
Opkey.prototype.getRetries = function () {
	// if(this.isRecording()) return true;
	var i = parseInt(this.sendToServer("/_s_/dyn/Player_getRetries"));
	return ("" + i != "NaN") ? i : 0;
};
Opkey.prototype.getExceptionString = function (e) {
	var stack = e.isOpkeyError ? "" : ("\n" + (e.stack ? e.stack : "No trace available"));
	return e.name + ": " + e.message + stack;
};

Opkey.prototype.onError = function (msg, url, lno) {
	try {
		var debugInfo = "Javascript error on page";
		if (!url) url = "";
		if (!lno) lno = "";
		var jsMsg = msg + " (" + url + ":" + lno + ")";
		if (msg && msg.indexOf("Access to XPConnect service denied") == -1) { // FF
			// hack
			this.setJSError(jsMsg, lno);
		}
		if (this.prevOnError && this.prevOnError != this.onError) {
			this.prevOnError(msg, url, lno);
		}
	} catch (swallow) { }
};
Opkey.prototype.setJSError = function (msg, lno) {
	this.__jsError = {
		'message': msg,
		'lineNumber': lno
	};
};
Opkey.prototype.openWin = function (e) {
	try {
		if (!e) e = window.event;
		// this.controller = window.open("", "sahiControl",
		// this.getWinParams(e));
		var diffDom = false;
		try {
			var checkDiffDomain = this.controller.document.domain;
		} catch (domainInaccessible) {
			diffDom = true;
		}
		if (diffDom || !this.controller.isWinOpen) {
			// this.controller = window.open(this.controllerURL, "sahiControl",
			// this.getWinParams(e));
		}
		if (this.controller) this.controller.opener = window;
		if (e) this.controller.focus();
		// if (e) window.setTimeout("this.controller.focus()",200);
	} catch (ex) {
		this.handleException(ex);
	}
};

/*
 * Opkey.prototype.openWin = function (e) { try { if (!e) e = window.event;
 * if(this.controller && !this.controller.closed) this.controller.focus(); else {
 * if(this.controller = window.open(this.controllerURL, "sahiControl",
 * this.getWinParams(e))) this.controller.opener = window; if (e)
 * window.setTimeout("this.controller.focus()",200); } } catch(ex) {
 * this.handleException(ex); } };
 */

Opkey.prototype.openController = Opkey.prototype.openWin;
Opkey.prototype.closeController = function () {
	var controlWin = this.getController();
	if (controlWin && !controlWin.closed) {
		controlWin.close();
	}
};

Opkey.prototype.getWinParams = function (e) {
	var positionParams = "";

	var x = e ? e.screenX - 40 : window.screen.width - this.controllerWidth - 50;
	var y = e ? e.screenY - 60 : 100;

	if (this._isIE()) positionParams = ",left=" + x + ",top=" + y;
	else positionParams = ",screenX=" + x + ",screenY=" + y;

	return "height=" + this.controllerHeight + "px,width=" + this.controllerWidth + "px,resizable=yes,toolbar=no,status=no" + positionParams;
};
Opkey.prototype.getController = function () {
	var controller = this.topOpkey().controller;
	if (controller && !controller.closed) return controller;
};
Opkey.prototype.xopenControllerWindow = function (e) {
	if (!e) e = window.event;
	if (!this.isHotKeyPressed(e)) return true;
	this.topOpkey().openWin(e);
	return true;
};
Opkey.prototype.openControllerWindow = function (e) {
	if (!e) e = window.event;
	if (!this.isHotKeyPressed(e)) return true;
	if (this._isChrome()) {
		window.setTimeout(function () {
			_opkey.topOpkey().openWin(e)
		}, 100);
	} else {
		this.topOpkey().openWin(e);
	}
	return true;
};
Opkey.prototype.isHotKeyPressed = function (e) {
	return ((this.hotKey == "SHIFT" && e.shiftKey) ||
		(this.hotKey == "CTRL" && e.ctrlKey) ||
		(this.hotKey == "ALT" && e.altKey) ||
		(this.hotKey == "META" && e.metaKey));
};


Opkey.prototype.mouseOver = function (e) {
	_opkey.CheckRecorderEnabled();
	if (_opkey.canHighlight == false) {
		return;
	}

	if (_opkey.ignore_highlight == true) {
		return;
	}
	_opkey.RuntimeMessageGatherer();
	//Salesforce Bug Coming from here 
	_opkey.GetFramesOnInterval();
	_opkey.GetApexClassName(e);
	if (!e) e = window.event;
	try {
		if (this.getTarget(e) == null) {
			return;
		}
		var el2 = this.getTarget(e);
		this.attachEvents(el2);
		if (el2) {
			if (el2.getAttribute("opkeydockerid") != null) {
				return;
			}
		}
		if (el2.alreadyopkeydone) {
			el2.alreadyopkeydone = false;
		}
		if (el2.id.indexOf("iw-contextMenu") != -1) {
			return;
		}
		if (el2.id.indexOf("IGNOREINOPKEYRECORDER") > -1) {
			return;
		}
		this._highlight(el2);
		_opkey.CreateBase64Image(e);
		if (el2.nodeName == "SELECT") {
			var elInfo = this.identify(el2);
			var ids = elInfo.apis;
			_opkey.otherids = ids;
		}

		if (!e.altKey || this.isInsideFlex) return;
		this.showCoords(e);
		var el = this.getTarget(e);

		this.__lastMousedOverElement = el;
		_opkey.currentelement = el
		if (this.__queuedMouseOverTimer) window.clearTimeout(this.__queuedMouseOverTimer);
		this.__queuedMouseOverTimer = window.setTimeout(this.wrap(this.queuedMouseOver), 50);
		// }
	} catch (ex) {
		// throw ex;
	}
};

Opkey.prototype.mouseOverShadowDom = function (e) {
	if (_opkey.canHighlight == false) {
		return;
	}

	if (_opkey.ignore_highlight == true) {
		return;
	}
	if (!e) e = window.event;
	try {
		if (this.getTarget(e) == null) {
			return;
		}
		var el2 = this.getTarget(e);
		if (el2.nodeName === "SLOT") {
			return;
		}
		if (el2.alreadyopkeydone) {
			el2.alreadyopkeydone = false;
		}
		if (el2.id.indexOf("iw-contextMenu") != -1) {
			return;
		}
		if (el2.id.indexOf("IGNOREINOPKEYRECORDER") > -1) {
			return;
		}
		this._highlight(el2);
		if (el2.nodeName == "SELECT") {
			var elInfo = this.identify(el2);
			var ids = elInfo.apis;
			_opkey.otherids = ids;
		}

		if (!e.altKey || this.isInsideFlex) return;
		this.showCoords(e);
		//        var controlWin = this.getController();
		//        if (controlWin) {
		var el = this.getTarget(e);

		this.__lastMousedOverElement = el;
		_opkey.currentelement = el
		if (this.__queuedMouseOverTimer) window.clearTimeout(this.__queuedMouseOverTimer);
		this.__queuedMouseOverTimer = window.setTimeout(this.wrap(this.queuedMouseOver), 50);
		//        }
	} catch (ex) {
		// throw ex;
	}
};

Opkey.prototype.queuedMouseOver = function () {
	var el = this.__lastMousedOverElement;
	try {
		this.identifyAndDisplay(el);
		var controlWin = this.getController();
		if (controlWin && !controlWin.closed) {
			controlWin.clearUpDownHistory();
		}
	} catch (e) { }
};


Opkey.prototype.fetchalldom = function (accessors, escapedAccessor,
	escapedValue, popupName, assertions, el) {

	// ////console.log("Element is "+element.parentElement.nodeName)
	var assertions = this.identify(el).assertions;
	// ////console.log(assertions);
	// var json = "{type: " +
	// this.quotedEscapeValue(this.lastIdentifiedElementType) + ", accessors:
	// {sahi:" + this.toJSON(accessors) + ",selenium:" +
	// this.toJSON(selAccessors) + "}, relation: \"" +
	// this.escapeNullValue(this.lastIdentifiedRelation) + "\", value:" +
	// this.quotedEscapeValue(escapedValue) +", properties:" +
	// this.domToJSON(el) + "}";
	// var elementProperties = eval("(" + this.domToJSON(el) + ")");
	// ////console.log(elementProperties)
	var elementProperties = new Object()
	elementProperties["tag"] = el.nodeName
	if (el.getAttribute("href") != null) {
		elementProperties["href"] = el.getAttribute("href");
	}

	if (el.getAttribute("title") != null) {
		elementProperties["alt"] = el.getAttribute("title").replace(/\"/g, "&#x0022;");
	}

	if (el.getAttribute("alt") != null) {
		elementProperties["alt"] = el.getAttribute("alt").replace(/\"/g, "&#x0022;");
	}
	if ((el.nodeName == "A") || (el.nodeName == "SPAN") || (el.nodeName == "INPUT") || (el.nodeName == "BUTTON")) {
		elementProperties["innertext"] = el.innerText;
	}
	for (var i = 0; i < accessors.length; i++) {
		if (accessors[i] !== null) {
			var accessorPart = accessors[i].split("__xxSAHIDIVIDERxx__");
			elementProperties[accessorPart[1]] = accessorPart[0];
		}
	}
	var locators = this.getSeleniumAccessors(el);
	var selAccessors = [];
	for (var i = 0; i < locators.length; i++) {
		// this._debug(locators[i][1]);
		// ////console.log(locators[i][1])
		// toSendAr["properties"]['"' + locators[i][1] + '"'] =
		// this.quotedEscapeValue(locators[i][0]);
		this.getStepObj(locators[i][0], locators[i][1], elementProperties);
	}

	if (el.nodeName == "TABLE") {
		if (_opkey.cellindexintable != null) {
			elementProperties["CurrentColumnIndex"] = _opkey.cellindexintable
		}
		if (_opkey.rowindexintable != null) {
			elementProperties["CurrentRowIndex"] = _opkey.rowindexintable
		}
	}

	if (el.nodeName == "TD" || el.nodeName == "TH") {
		_opkey.cellindexintable = el.cellIndex
		elementProperties["column"] = el.cellIndex
		if (el.parentNode.nodeName == "TR") {
			_opkey.rowindexintable = el.parentNode.rowIndex
			elementProperties["row"] = el.parentNode.rowIndex
		}
	}


	if (el.innerText != null) {
		if (el.innerText != "") {
			if (el.textContent != null) {
				if (el.textContent != "") {
					if (el.nodeName != "SELECT") {
						elementProperties["textContent"] = el.textContent;
					}
				}
			}
		}
	}
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

	if (recordingmode == "SuccessFactors") {
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
			var label = _opkey.getMatchingLabelWithTextBoxNDropDown(el);
			if (label) {
				elementProperties["label:text"] = label.textContent;
				var labellocators = this.getSeleniumAccessors(label);
				for (var li = 0; li < labellocators.length; li++) {
					elementProperties["label:" + labellocators[li][1]] = labellocators[li][0]
				}
			}
			if (el.placeholder) {
				elementProperties["label:placeholder"] = el.placeholder.replace(/\"/g, "&#x0022;").replace("'", "&#x0027;");
			}
			if (el.aria - label) {
				elementProperties["label:arialabel"] = el.el.aria - label;
			}
		} catch (e) { }
	}

	if (recordingmode == "WORKDAY") {
		try {
			try {
				if (el.tagName == 'SPAN') {
					if (el.getAttribute("data-automation-id") != null) {
						if (el.getAttribute("data-automation-id") == "promptIcon")
							isLOV = true;
					}
				}
				if (isLOV == false) {
					if (el.tagName == 'SPAN') {
						if (el.getAttribute("data-automation-id") != null) {
							if (el.getAttribute("data-automation-id") == "promptSelectionLabel")
								isLOV = true;
						}
					}
				}
				if (isLOV == false) {
					if (el.tagName == 'DIV') {
						if (el.getAttribute("data-automation-id") != null) {
							if (el.getAttribute("data-automation-id") == "promptSearchButton") {
								isLOV = true;
							}
						}
					}
				}
				if (isLOV == false) {
					if (el.tagName == 'DIV') {
						if (el.getAttribute("data-automation-id") != null) {
							if (el.getAttribute("data-automation-id") == "icon") {
								var child = el.firstElementChild;
								if (child.tagName == 'svg' || child.tagName == 'SVG') {
									if (child.getAttribute("id") != null) {
										if (child.getAttribute("id") == "wd-icon-prompts") {
											isLOV = true;
										}
									}
								}
							}
						}
					}
				}
				if (isLOV == true) {
					elementProperties["label:element_isLOV"] = "true";
				}
			} catch (e) { }
			if (el.hasAttribute("title")) {
				elementProperties["label:element_title"] = el.getAttribute("title");
			}
			if (el.hasAttribute("aria-label")) {
				elementProperties["label:element_aria-label"] = el.getAttribute("aria-label");
			}
			if (el.hasAttribute("placeholder")) {
				elementProperties["label:element_placeholder"] = el.getAttribute("placeholder").replace(/\"/g, "&#x0022;").replace("'", "&#x0027;");
			}
			if (el.hasAttribute("data-automation-id")) {
				elementProperties["label:element_data-automation-id"] = el.getAttribute("data-automation-id");
			}
			if (el.hasAttribute("data-automation-label")) {
				elementProperties["label:element_data-automation-label"] = el.getAttribute("data-automation-label");
			}
		} catch (e) { }
		var workdayelement = _opkey.workday_main_getLabel(el);
		if (workdayelement != null) {
			try {
				if (workdayelement.hasAttribute("aria-label")) {
					elementProperties["label:aria-label"] = workdayelement.getAttribute("aria-label");
				}
				if (workdayelement.hasAttribute("placeholder")) {
					elementProperties["label:placeholder"] = workdayelement.getAttribute("placeholder").replace(/\"/g, "&#x0022;").replace("'", "&#x0027;");
				}
				if (workdayelement.hasAttribute("data-automation-id")) {
					elementProperties["label:data-automation-id"] = workdayelement.getAttribute("data-automation-id");
				}
				if (workdayelement.hasAttribute("data-automation-label")) {
					elementProperties["label:data-automation-label"] = workdayelement.getAttribute("data-automation-label");
				}
			} catch (e) { }
			elementProperties["label:text"] = workdayelement.textContent;
			elementProperties["label:tagName"] = workdayelement.tagName;
			var workdaylabellocators = this.getSeleniumAccessors(workdayelement);
			for (var li = 0; li < workdaylabellocators.length; li++) {
				elementProperties["label:" + workdaylabellocators[li][1]] = workdaylabellocators[li][0]
			}
		}
	}

	if (elementProperties["innertext"]) {
		elementProperties["logicalname"] = elementProperties["innertext"];
	} else if (elementProperties["MD:label:text"]) {
		elementProperties["logicalname"] = elementProperties["MD:label:text"];
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

	try {
		var backgroundcolorofelement = window.getComputedStyle(el, null).getPropertyValue("background-color")
		var colorofelement = window.getComputedStyle(el, null).getPropertyValue("color")


		// elementProperties["background-color"] = backgroundcolorofelement;
		// elementProperties["color"] = colorofelement;
		var rect = el.getBoundingClientRect();
		// elementProperties["width"]=(rect.right - rect.left)
		// elementProperties["height"]=(rect.bottom - rect.top)
		// elementProperties["x"]=rect.left
		// elementProperties["y"]=rect.top
		// var
		// imagebase64=_opkey.sendToServer('/_s_/dyn/Driver_getRealtimeObjectImage?width='+rect.width+'&height='+rect.height);
		elementProperties["ObjectImage"] = "";
	} catch (e) { }
	try {

		if (el.nodeName == "INPUT" || el.nodeName == "TEXTAREA") {
			if (el.maxLength != -1) {
				elementProperties["length"] = el.maxLength
			}
			if (el.placeholder) {
				elementProperties["placeholder"] = el.placeholder.replace(/\"/g, "&#x0022;").replace("'", "&#x0027;");
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
	} catch (e) { }

	if (el.className) {
		elementProperties["className"] = el.className.toString();
	}

	if (elementProperties["className"] != null) {
		elementProperties["className"] = elementProperties["className"].replace(" OPkeyHighlighter", "").replace("OPkeyHighlighter", "")
	}
	// elementProperties["value"] = escapedValue;
	elementProperties["type"] = el.type;
	elementProperties["relation"] = GetRelationWithString(el);
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
	for (var i = 0; i < this._framesList.length; i++) {
		var parentobject = this._framesList[i]
		if (parentobject["tag"] == "html") {
			htmltitle = parentobject["title"]
			titleindex = parentobject["titleindex"]
		}
	}
	for (var j = 0; j < this._framesList.length; j++) {
		var parentobject = this._framesList[j]
		parentobject["title"] = htmltitle;
		parentobject["titleindex"] = titleindex;
		this._tempframesList.push(parentobject)
	}
	this._framesList = this._tempframesList;
	var parentobject = this._getFinalFramesList();
	if (parentobject == null) {
		var opkeywindowid = null;
		opkeywindowid = _opkey.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
		if (opkeywindowid == "") {
			opkeywindowid = _opkey.windowidentiferontitle;
		}
		var probject = new Object();
		probject["tag"] = "HTML";
		probject["type"] = "html page";
		probject["title"] = _opkey.getTitle();
		probject["url"] = _opkey.getURL().replace(/{/g, '').replace(/}/g, '').replace(/\"/g, "&#x0022;");
		probject["titleindex"] = _opkey.sendToServer("/_s_/dyn/Driver_getPageTitleIndex?id=" + opkeywindowid + "&title=" + encodeURIComponent(_opkey.getTitle().replace(/\"/g, "&#x0022;").replace("'", "&#x0027;")));
		parentobject = probject;
	}
	if (parentobject["title"] == null) {
		parentobject["title"] = _opkey.getTitle();
	}
	if (parentobject["titleindex"] == null) {
		var opkeywindowid = null;
		opkeywindowid = _opkey.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
		if (opkeywindowid == "") {
			opkeywindowid = _opkey.windowidentiferontitle;
		}
		parentobject["titleindex"] = _opkey.sendToServer("/_s_/dyn/Driver_getPageTitleIndex?id=" + opkeywindowid + "&title=" + encodeURIComponent(_opkey.getTitle().replace(/\"/g, "&#x0022;").replace("'", "&#x0027;")));
	}
	if (elementProperties["href"] != null) {
		elementProperties["href"] = elementProperties["href"].replace(/\"/g, "&#x0022;").replace("'", "&#x0027;");
	}
	elementProperties["parent"] = parentobject;
	return elementProperties;


};

function removeindex(input) {

	input = "" + input
	var outdata;
	var init = input.indexOf('[');
	var fin = input.indexOf(']');
	var out = input.substr(init, fin - init)

	if (out != "") {
		if (!isNaN(out.replace("[", ""))) {

			return input.replace(out + "]", "")
		} else {
			return input
		}
	} else {
		return input
	}


}



var domid = -1
var domel;

var domelementarray = []

Opkey.prototype._getAllDoms = function () {
	// ////console.log(domel)
	// //console.log("Dom fetching")

	var maindata = []
	window.clearInterval(domid)
	domid = window.setInterval(function () {
		var el = domel
		if (domel != null) {
			if ((el.nodeName == "BODY") || (el.nodeName == "HEADER") || (el.nodeName == "HTML") || (el.nodeName == "#document-fragment")) {
				window.clearInterval(domid)

				_opkey.domelements = _opkey.domelements.reverse();
				try {
					if (window.top != null) {
						window.top.spyDomElements = _opkey.domelements;
					}
				} catch (e) {
					window.spyDomElements = _opkey.domelements;
				}
				var opkeysender = new Opkey_Sender();
				opkeysender.sendDomsData(domelementarray);
				// //console.log("Dom element "+domelementarray)
			}
			if (el != null) {
				var elementProperties = new Object()

				var elInfo = _opkey.identify(_opkey.getKnownTags(el));
				if (elInfo == null || elInfo.apis == null) return;
				if (elInfo.apis.length > 0) acc = elInfo.apis[0];
				else acc = null;
				var logicalname = ""
				if (acc) {
					var accessors = [];
					for (var i = 0; i < elInfo.apis.length; i++) {

						if ((elInfo.apis[i]["shortHand"] != "") && elInfo.apis[i]["shortHand"] != 0) {
							if (logicalname == "") {

								if (elInfo.apis[i]["accessorType"] == "sahiText") {
									logicalname = elInfo.apis[i]["shortHand"]
								} else if (elInfo.apis[i]["accessorType"] == "index") {
									logicalname = elInfo.apis[i]["shortHand"]
								} else {
									// logicalname=elInfo.apis[i]["accessorType"]+"="+elInfo.apis[i]["shortHand"]
									logicalname = elInfo.apis[i]["shortHand"]
								}
							}
						}
						accessors[i] = _opkey.escapeDollar(_opkey.getAccessor1(elInfo.apis[i], "identify"));
					}

					elementProperties["tagName"] = el.nodeName
					if ((el.nodeName == "A") || (el.nodeName == "SPAN") || (el.nodeName == "INPUT") || (el.nodeName == "BUTTON")) {
						elementProperties["innertext"] = el.innerText;
					}
					// elementProperties["logicalname"]="["+removeindex(logicalname)+"]"
					var logicalname = el.nodeName;
					try {
						logicalname = _opkey.getLogicalNameOfObject(el, elementProperties["innertext"])
						if (typeof logicalname === "object") {
							logicalname = el.nodeName
						}
					} catch (e) { }
					if (logicalname.length > 25) {
						logicalname = logicalname.substring(0, 25);
					}
					elementProperties["logicalname"] = logicalname
					var retdata = _opkey.fetchalldom(accessors,
						_opkey.escapeDollar(_opkey.getAccessor1(acc, "identify")),
						_opkey.escapeValue(acc.value),
						_opkey.getPopupDomainPrefixes(el),
						elInfo.assertions, el);
					var logicalname = el.nodeName;
					try {
						logicalname = _opkey.getLogicalNameOfObject(el, elementProperties["innertext"])
						if (typeof logicalname === "object") {
							logicalname = el.nodeName
						}
					} catch (e) { }
					if (logicalname.length > 25) {
						logicalname = logicalname.substring(0, 25);
					}

					retdata["relation"] = GetRelationWithString(el);
					retdata["logicalname"] = logicalname
					var recordingmode = _opkey.GetRecordingMode();
					if (recordingmode == "ORACLE FUSION") {
						var _oraclefusion = new OracleFusion();
						_oraclefusion.GetLabelProperties(el, retdata);
					}
					if (recordingmode == "JDE") {
						var _jdeRecorder = new JDERecorder();
						_jdeRecorder.GetLabelProperties(el, retdata);
					}
					if (recordingmode == "SERVICENOW") {
						var _servicenow = new ServiceNow();
						_servicenow.GetLabelProperties(el, retdata);
					}
					if (recordingmode == "SAP FIORI") {
						var _oraclefusion = new SAPFIORI();
						_oraclefusion.GetLabelProperties(el, retdata);
					}
					if (recordingmode == "SUCCESSFACTORS") {
						var _oraclefusion = new SuccessFactors();
						_oraclefusion.GetLabelProperties(el, retdata);
					}
					if (recordingmode == "PEOPLESOFT") {
						var _peoplesoft = new PeopleSoft_OpKey();
						_peoplesoft.GetLabelProperties(el, retdata);
					}
					if (recordingmode == "SALESFORCE") {
						if (retdata["label:text"]) {
							retdata["logicalname"] = retdata["label:text"]
						} else if (retdata["label:placeholder"]) {
							retdata["logicalname"] = retdata["label:placeholder"]
						} else if (retdata["label:arialabel"]) {
							retdata["logicalname"] = retdata["label:arialabel"]
						}

					}

					if (recordingmode == "WORKDAY") {

						if (retdata["label:element_aria-label"]) {
							retdata["logicalname"] = retdata["label:element_aria-label"];
						} else if (retdata["label:element_data_automation_label"]) {
							retdata["logicalname"] = retdata["label:element_data_automation_label"];
						} else if (retdata["label:element_placeholder"]) {
							retdata["logicalname"] = retdata["label:element_placeholder"];
						} else if (retdata["label:element_title"]) {
							retdata["logicalname"] = retdata["label:element_title"];
						} else if (retdata["label:element_data-automation-id"]) {
							retdata["logicalname"] = retdata["label:element_data-automation-id"];
						} else if (retdata["label:text"]) {
							retdata["logicalname"] = retdata["label:text"];
						} else if (retdata["label:aria-label"]) {
							retdata["logicalname"] = retdata["label:aria-label"];
						} else if (retdata["label:data-automation-id"]) {
							retdata["logicalname"] = retdata["label:data-automation-id"];
						}
					}
					domelementarray.push(FJSON.stringify(retdata))
					_opkey.domelements.push(el)
				}
			}
			domel = el.parentNode;


		}
	}, 50);

}

Opkey.prototype._highlighterfordiv = function (index) {
	var el = _opkey.domelements[index]
	this.highlightandkeep(el)
};

Opkey.prototype.highlightForAddon = function (index) {
	try {
		var el = null;
		if (_opkey.domelements.count > 0) {
			el = _opkey.domelements[index];
		} else {
			if (window.top != null) {
				el = window.top.spyDomElements[index];
			}
		}

		if (el != null) {
			this.highlightandkeep(el)
		}
	} catch (e) { }
};

Opkey.prototype._fetchDomProperty = function (index) {

	var el = _opkey.domelements[index]
	this.highlightandkeep(el)
	var elInfo = this.identify(this.getKnownTags(el));
	if (elInfo == null || elInfo.apis == null) return;
	if (elInfo.apis.length > 0) acc = elInfo.apis[0];
	else acc = null;
	if (acc) {
		var accessors = [];
		for (var i = 0; i < elInfo.apis.length; i++) {
			accessors[i] = this.escapeDollar(this.getAccessor1(elInfo.apis[i], "identify"));

		}

		this.sendIdentifierInfo(accessors,
			this.escapeDollar(this.getAccessor1(acc, "identify")),
			this.escapeValue(acc.value),
			this.getPopupDomainPrefixes(el),
			elInfo.assertions, el, 1);
	}
}


Opkey.prototype.identifyAndDisplay = function (el) {
	_opkey.sendToServer("/_s_/dyn/Driver_setDom?element=" +
		encodeURIComponent([]));
	window.clearInterval(domid)
	try {
		el.classList.remove("OPkeyHighlighter")
	} catch (e) {

	}
	domelementarray = []
	// _opkey.domelements = []
	domel = el
	this._getAllDoms()
	var innertext = ""
	var elInfo = this.identify(this.getKnownTags(el));
	if (elInfo == null || elInfo.apis == null) return;
	if (elInfo.apis.length > 0) acc = elInfo.apis[0];
	else acc = null;
	if (acc) {
		var accessors = [];
		for (var i = 0; i < elInfo.apis.length; i++) {

			accessors[i] = this.escapeDollar(this.getAccessor1(elInfo.apis[i], "identify"));

		}
		this.sendIdentifierInfo(accessors,
			this.escapeDollar(this.getAccessor1(acc, "identify")),
			this.escapeValue(acc.value),
			this.getPopupDomainPrefixes(el),
			elInfo.assertions, el);
	}


	// ////console.log("Fetching from dom "+maindata)

}
Opkey.prototype.sendIdentifierInfo = function (accessors, escapedAccessor, escapedValue, popupName, assertions, el) {
	var controlWin = this.getController();
	controlWin.displayInfo(accessors, escapedAccessor, escapedValue, popupName, assertions);
}
Opkey.prototype.showCoords = function (e) {
	var x = e.clientX;
	var y = e.clientY;
	try {
		var controlWin = this.getController();
		if (controlWin && !controlWin.closed) {
			controlWin.showCoords(x, y);
		}
	} catch (ex) { }

}
Opkey.prototype.escapeDollar = function (s) {
	if (s == null) return null;
	return s.replace(/[$]/g, "\\$");
};
Opkey.prototype.getAccessor1 = function (info) {
	if (info == null) return null;
	if ("" == ("" + info.shortHand) || info.shortHand == null) return null;
	return info.type + "(" + this.escapeForScript(info.shortHand) + (info.relationStr ? (", " + info.relationStr) : "") + ")";
};
Opkey.prototype.escapeForScript = function (s) {
	return this.quoteIfString(s);
};
Opkey.prototype.schedule = function (cmd, debugInfo) {
	if (!this.cmds) return;
	var i = this.cmds.length;
	this.cmds[i] = cmd;
	this.cmdDebugInfo[i] = debugInfo;
};
Opkey.prototype.instant = function (cmd, debugInfo) {
	if (!this.cmds) return;
	var i = this.cmdsLocal.length;
	this.cmdsLocal[i] = cmd;
	this.cmdDebugInfoLocal[i] = debugInfo;
};
Opkey.prototype.play = function () {
	// commanded by ganesh
	this.execNextStep(false, this.INTERVAL);
};
Opkey.prototype._setXHRReadyStatesToWaitFor = function (s) {
	this.setWaitForXHRReadyStates(s);
	this.sendToServer("/_s_/dyn/SessionState_setXHRReadyStatesToWaitFor?states=" + this.encode(s));
}
Opkey.prototype.setWaitForXHRReadyStates = function (s) {
	this.waitWhenXHRReadyState1 = s.indexOf("1") != -1;
	this.waitWhenXHRReadyState2 = s.indexOf("2") != -1;
	this.waitWhenXHRReadyState3 = s.indexOf("3") != -1;
}
Opkey.prototype.showOpenXHRs = function () {
	var xs = this.XHRs;
	var s = "";
	for (var i = 0; i < xs.length; i++) {
		var xsi = xs[i];
		if (xsi) {
			try {
				if (xsi.readyState != 4) {
					s += "this.XHRs[" + i + "] " + xsi + ": xsi.readyState=" + xsi.readyState + "\n";
				}
			} catch (e) {
				s += e;
			}
		}
	}
	return s;
}
/*
 * Opkey.prototype.areXHRsDone = function (){ var xs = this.XHRs; var maxTime =
 * this.SAHI_MAX_WAIT_FOR_LOAD * this.INTERVAL; var now = new Date().getTime();
 * for (var i=0; i<xs.length; i++){ var xsi = xs[i];
 * //this.d("xsi.readyState="+xsi.readyState) if (xsi){ var t =
 * this.XHRTimes[i]; if (t == -1) continue; if (now - t > maxTime) { // AJAX
 * request has been around for more than 2 minutes. Consider as Comet
 * this.XHRTimes[i] = -1; continue; } if (xsi.readyState==2 ||
 * xsi.readyState==3){ // //this._debug("xsi.readyState="+xsi.readyState); } if
 * (xsi.readyState==1 && this.waitWhenXHRReadyState1) { return false; } if
 * (xsi.readyState==2 && this.waitWhenXHRReadyState2) { return false; } if
 * (xsi.readyState==3){ if (this.waitWhenXHRReadyState3) return false; try{ var
 * m = xsi.responseText; }catch(e){return false;} } } } return true; };
 */
Opkey.prototype.areXHRsDone = function () {
	for (var a = this.XHRs, b = [], c = [], d = this.SAHI_MAX_WAIT_FOR_LOAD * this.INTERVAL, e = (new Date).getTime(), f = 0; f < a.length; f++) try {
		var h = a[f];
		if (h) {
			var g = this.XHRTimes[f];
			if (-1 != g)
				if (e - g > d) this.XHRTimes[f] = -1;
				else {
					4 != h.readyState && (b.push(h), c.push(this.XHRTimes[f]));
					var k = this.waitWhenXHRReadyState1 || 1000 > e - g,
						l = h.readyState;
					if (1 == l && k || 2 == l && this.waitWhenXHRReadyState2 || 3 == l && this.waitWhenXHRReadyState3) return !1
				}
		}
	} catch (q) { }
	this.resetOpenXHRs(b, c);
	return !0
};
Opkey.prototype.resetOpenXHRs = function (a, b) {
	this.XHRs = a;
	this.XHRTimes = b
};
Opkey.prototype.areFlexAppsLoaded = function (win) {
	var els = [];
	if (this._isIE()) {
		els = win.document.getElementsByTagName("OBJECT");
	} else {
		els = win.document.getElementsByTagName("EMBED");
	}
	for (var i = 0; i < els.length; i++) {
		var el = els[i];
		try {
			var id = el._opkey_getFlexId();
			var fl = this.getFlexWrapper(el);
			try {
				if (fl.currentCursorID() != 0) return false;
			} catch (e3) { }
			if (this.flexWaitCondition && !this.flexWaitCondition(fl)) return false;
		} catch (e) {
			// //this._debug("" + e);
			try {
				if (el.PercentLoaded() != 100) return false;
			} catch (e2) { }
		}
	}

	var frs = win.frames;
	if (frs && win.frames) {
		var loaded = true;
		for (var j = 0; j < frs.length; j++) {
			try {
				loaded = this.areFlexAppsLoaded(frs[j]);
				if (!loaded) return false;
			} catch (e) { }
		}
	}
	return true;
};

Opkey.prototype.d = function (s) {
	this.updateControlWinDisplay(s);
};

Opkey.prototype.areWindowsLoaded = function (win) {
	try {
		if (win.location.href == "about:blank") return true;
	} catch (e) {
		return true;
		// diff domain
	}
	try {
		var fs = win.frames;
		if (!fs || fs.length == 0) {
			try {
				return (this._isIE() && (win.document.readyState == "complete")) || this.loaded;
			} catch (e) {
				// this.d("**********");
				return true;
				// diff domain; don't bother
			}
		} else {
			if (win.name == "listIframe") this.d("fs.length=" + fs.length);
			for (var i = 0; i < fs.length; i++) {
				// this.d("" + i + ") " +fs[i].name);
				try {
					if ("" + fs[i].location != "about:blank" && !fs[i]._opkey.areWindowsLoaded(fs[i])) return false;
				} catch (e) {
					// skip if error. can happen for ""+fs[i].location if diff
					// domain.
				}
			}
			if (win.document && this.getElementsByTagName("frameset", win.document).length == 0)
				return (this._isIE() && (win.document.readyState == "complete")) || this.loaded;
			else return true;
		}
	} catch (ex) {
		// this.d("2 to " + ex);
		// //this._debugToErr("3 pr " + ex.prototype);
		return true;
		// for diff domains.
	}
};


Opkey.prototype.areWindowsLoadedNEW = function (a) {
	// //this._debug("arewindow")
	try {
		if ("about:blank" == a.location.href) return !0
	} catch (b) {
		return !0
	}
	try {
		var c = a.frames;
		if (c && 0 != c.length) {
			/*
			 * if("listIframe" == a.name) { this.d("fs.length=" + c.length); }
			 */
			"listIframe" == a.name && this.d("fs.length=" + c.length);
			for (var d = 0; d < c.length; d++) try {
				/*
				 * if(this._isChrome()){
				 * if(c[d].document.documentURI.indexOf("about:blank") != -1)
				 * continue; if(c[d]._opkey.areWindowsLoaded(c[d]) == undefined)
				 * continue; //this._debug("c[d]: " + c[d].document.documentURI + "
				 * this.windowaccess: " + c[d]._opkey.areWindowsLoaded(c[d]));
				 * //return true; window.setTimeout("",1000) }
				 */
				if (this.isWindowAccessible(c[d]) && ("about:blank" != "" + c[d].location) && !c[d]._opkey.areWindowsLoaded(c[d])) {
					return !1;
				}
			} catch (e) { }
			/*
			 * return a.document && 0 == this.getElementsByTagName("frameset",
			 * a.document).length ? (this._isIE()|| this._isChrome()) &&
			 * "complete" == a.document.readyState || this.loaded : !0
			 */
			if (a.document && this.getElementsByTagName("frameset", a.document).length == 0) {
				// //this._debug("arewindowloaded: false" +((this._isIE() /*||
				// this._isChrome()*/) && (a.document.readyState == "complete"))
				// || this.loaded);
				// return true;
				return ((this._isIE() /* || this._isChrome() */) && (a.document.readyState == "complete")) || this.loaded;
			} else {
				// this._debug("arewindowloaded: true");
				return true;
			}
		}
		try {
			return this._isIE() && "complete" == a.document.readyState || this.loaded
		} catch (f) {
			return !0
		}
	} catch (h) {
		return !0
	}
};
var _isLocal = false;
Opkey._timer = null

Opkey.prototype.execNextStep = function (isStep, interval) {
	// if (isStep || !this.isPlaying())
	// return;
	// if (isStep || !this.isPlaying()) return;
	if (Opkey._timer) window.clearTimeout(Opkey._timer);
	Opkey._timer = window.setTimeout("try{_opkey.ex();}catch(ex){}", 500);
};
Opkey.prototype.hasErrors = function () {
	var i = this.sendToServer("/_s_/dyn/Player_hasErrors");
	return i == "true";
};
Opkey.prototype.getCurrentStep = function () {
	var wasOpened = 1;
	var windowName = "";
	var windowTitle = "";
	var windowURL = "";
	try {
		wasOpened = (this.top().opener == null || (this.top().opener._opkey.top() == this.top())) ? 0 : 1;
	} catch (e) { }
	try {
		windowName = this.top().name;
	} catch (e) { }
	try {
		windowTitle = this.getTitle();
	} catch (e) { }
	try {
		windowURL = this.top().location.href;
	} catch (e) { }
	// if(this.isRecording()) return;
	var v = this.sendToServer("/_s_/dyn/Player_getCurrentStep?derivedName=" + this.getPopupName() +
		"&wasOpened=" + wasOpened + "&windowName=" + this.encode(windowName) +
		"&windowTitle=" + this.encode(windowTitle) +
		"&windowURL=" + this.encode(windowURL) +
		"&domain=" + this.encode(this.getDomainContext()));
	var dec = this.decode(v);
	// this.d(dec);
	return eval("(" + dec + ")");
};

Opkey.prototype.getWindowDomainQS = function () {
	var a = 1,
		b = "",
		c = "",
		d = "";
	try {
		a = null == this.top().opener || this.top().opener._opkey.top() == this.top() ? 0 : 1
	} catch (e) { }
	try {
		b = this.top().name
	} catch (f) { }
	try {
		c = this.getTitle()
	} catch (h) { }
	try {
		d = this.top().location.href
	} catch (g) { }
	return "derivedName=" + this.getPopupName() + "&wasOpened=" + a + "&windowName=" + this.encode(b) + "&windowTitle=" + this.encode(c) + "&windowURL=" + this.encode(d) + "&domain=" + this.encode(this.getDomainContext());
};

/*
 * Opkey.prototype.getDomainContext = function(){ return (this.top() ==
 * _opkey_top) ? "" : document.domain; }
 */
Opkey.prototype.getDomainContext = function () {
	return this.top() == this.absoluteTop() ? "" : document.domain
};
Opkey.prototype.markStepDone = function (stepId, type, failureMsg) {
	// duplicate checking needed for IE8 link clicks
	if (this.lastStepInfo && stepId == this.lastStepInfo[0] && type == this.lastStepInfo[1] && failureMsg == this.lastStepInfo[2]) return;
	this.lastStepInfo = [stepId, type, failureMsg];
	var qs = "stepId=" + stepId + (failureMsg ? ("&failureMsg=" + this.encode(failureMsg)) : "") + "&type=" + type;
	this.sendToServer("/_s_/dyn/Player_markStepDone?" + qs);
};
Opkey.prototype.markStepInProgress = function (stepId, type, timeout) {
	var qs = "stepId=" + stepId + "&type=" + type;
	if (timeout) qs += "&timeout=" + timeout;
	this.sendToServer("/_s_/dyn/Player_markStepInProgress?" + qs);
};

Opkey.prototype.skipTill = function (n) {
	var stepId = -1;
	var lastStepId = -1;
	while (true) {
		var stepInfo = this.getCurrentStep();
		var stepId = stepInfo['stepId'];
		if (stepId == null) return;
		if (lastStepId == stepId) {
			continue;
		}
		lastStepId = stepId;
		var type = stepInfo['type'];
		if (type == "STOP") {
			this.showStopPlayingMessage();
			this.topOpkey()._isPlaying = false;
			return;
		}
		var step = stepInfo['step'];
		if (step == null || step == 'null') continue;
		if (stepId < n) {
			this.markStepDone(stepId, "skipped");
		} else {
			break;
		}
	}
};
// This is needed for non Opkey drivers.
Opkey.prototype.ping = function () {
	try {
		_opkey.pingTimer = window.setTimeout(function () {
			_opkey.ping()
		}, 5000); // as
		// backup
		// Should be top window, or first frame of particular domain
		var topWin = this.top();
		if (topWin != window) { // not top window, or first frame of particular
			// domain
			// if frame domain is same as _opkey_top, stop pinging totally
			if (topWin == _opkey_top) {
				if (_opkey.pingTimer) window.clearTimeout(_opkey.pingTimer); // remove
				// backup
				return;
			}
			// cancel ping
			this.pingReset();
			return;
		}
		try {
			if (this._isChrome() && window.document.readyState == "complete") {
				this.onWindowLoad();
			}
		} catch (e) { }
		var pinger = this.createRequestObject();
		pinger.onreadystatechange = function () {
			if (pinger.readyState == 4) {
				try {
					if (pinger.status == 200) {
						var s = pinger.responseText;
						var obj;
						try {
							obj = JSON.parse(s);
						} catch (e) {
							//   obj = window.eval("(" + s + ")");
							obj = null
						}

						_opkey.pingCallback(obj);
					} else {
						// _opkey._alert( "HTTP "+req.status+". An error was
						// encountered: "+ req.statusText );
					}
				} catch (e) {
					// ////console.log(e);
				}
			}
		}
		pinger.open("POST", this.makeFullURL("/_s_/dyn/SessionState_ping"), true);
		this.pinger.open("GET", "/_s_/dyn/SessionState_ping?sahisid=" + this.sid, true);
		pinger.send();
		var rand = (new Date()).getTime() + Math.floor(Math.random() * (10000));
		pinger.send("sahisid=" + encodeURIComponent(this.sid) + "&t=" + encodeURIComponent(rand) + "&" + this.getWindowDomainQS());
	} catch (e) {
		// ////console.log(e);
	}
}



/*
 * Opkey.prototype.ping = function() { try { _opkey.pingTimer =
 * window.setTimeout(function() { _opkey.ping() }, 5000); var a = this.top(); if
 * (a != window) { // not top window, or first frame of particular domain // if
 * frame domain is same as _opkey_top, stop pinging totally if (a ==
 * this.absoluteTop()) { if (_opkey.pingTimer)
 * window.clearTimeout(_opkey.pingTimer); // remove backup //return; } else //
 * cancel ping this.pingReset(); //return; } // if (a != window) a ==
 * this.absoluteTop() ? _opkey.pingTimer &&
 * window.clearTimeout(_opkey.pingTimer) : this.pingReset(); /*else { try { if
 * (this.isChrome33Minus() && "complete" == window.document.readyState)
 * this.onWindowLoad() } catch (b) {}
 */

/*
 * else{ var c = this.createRequestObject(); c.onreadystatechange = function() {
 * if (c.readyState == 4) try { if (c.status == 200) { var a = window.eval("(" +
 * c.responseText + ")"); // _opkey.pingCallback(a) this.ex(); } } catch (b) {} };
 * c.open("GET", this.makeFullURL("/_s_/dyn/SessionState_ping"), true);
 * ////this._debug("ping: " + this.makeFullURL("/_s_/dyn/SessionState_ping"));
 * var d = (new Date).getTime() + Math.floor(10000 * Math.random());
 * c.send("sahisid=" + encodeURIComponent(this.sid) + "&t=" +
 * encodeURIComponent(d) + "&" + this.getWindowDomainQS()) } } catch (e) {} };
 */
Opkey.prototype.makeFullURL = function (a) {
	var b = window.location.href,
		b = b.substring(0, b.indexOf("/", 8));
	return b + a
};

Opkey.prototype.pingReset = function () {
	if (_opkey.pingTimer) window.clearTimeout(_opkey.pingTimer);
	_opkey.pingTimer = window.setTimeout(function () {
		// //this._debug("pingReset")
		_opkey.ping()
	}, 400)
};


Opkey.prototype.setState = function (o) {
	if (this.topOpkey()._isRecording != o.isRecording) {
		if (o.isRecording)
			this.startRecording();
		else
			this.stopRecording();
	}
	this.topOpkey()._isRecording = o.isRecording;

	this.topOpkey()._isPaused = o.isPaused;

	var wasPlaying = this.topOpkey()._isPlaying;
	this.topOpkey()._isPlaying = o.isPlaying;
	if (o.isPlaying && wasPlaying != o.isPlaying) {
		this.play();
	}
}
// Opkey.prototype.checkExecution = function(){
// ////this._debug("checkExecution " + (new Date() - this.exLastTimeStamp));
// if (new Date() - this.exLastTimeStamp > 5000) {
// this.execNextStep(this.exIsStep, this.interval);
// }
// }
Opkey.prototype.ex = function (isStep) {
	// //this._debug("Ex")
	// this.exLastTimeStamp = new Date();
	this.exIsStep = isStep;
	var stepId = -1;
	try {
		if (this.isPaused() && !isStep) return;
		// //this._debug(this.byPassWaitMechanism + ";
		// "+this.areWindowsLoaded(this.top())+ "; "+this.areXHRsDone() +"; "+
		// this.areFlexAppsLoaded(this.top()) + "; "+ this.waitForLoad + "; ");
		if (!this.byPassWaitMechanism && ((!this.areWindowsLoaded(this.top()) || !this.areXHRsDone() || !this.areFlexAppsLoaded(this.top())) && this.waitForLoad > 0)) {
			this.stabilityIndex = 0;
		}
		/*
		 * if (this.stabilityIndex < this.STABILITY_INDEX){ this.stabilityIndex =
		 * this.stabilityIndex + 1; this.waitForLoad = this.waitForLoad - 1; if
		 * (!this._isIE() && this.waitForLoad % 20 == 0){
		 * this.check204Response(this.top()); }
		 */
		this.execNextStep(isStep, this.interval);
		// return;
		// }
		if (this.__jsError) {
			var msg = this.getJSErrorMessage(this.__jsError);
			this._log(msg, "custom1");
			this.d(this.__jsError.message);
			this.__jsError = null;
		}
		var stepInfo = this.getCurrentStep();
		// added by ganesh
		// //this._debug("stepInfo1: " + stepInfo);
		// if(stepInfo == undefined) {
		// //this._debug("stepInfo: " + stepInfo);
		// return;
		// }

		var type = stepInfo['type'];
		if (type == "NO_SCRIPT") {
			return;
		}
		if (type == "STOP") {
			this.showStopPlayingMessage();
			if (!this.isSingleSession) {
				this.topOpkey()._isPlaying = false;
				// this.stopPlaying();
				return;
			}
		}
		if (this.waitForLoad == 0) {
			this._log("Page has not loaded. Proceeding further due to timeout.", "CUSTOM");
			this.waitForLoad = -1; // reduce it further so that it does not
			// come into this if condition again.
			// Happens on error.
		}
		var step = stepInfo['step'];
		// //this._debug(this.getPopupName() + "::" + type+"::"+ new Date());
		if (type == "WAIT") {
			if (step != null && step != 'null') {
				var stepId = stepInfo['stepId']
				this.updateControlWinDisplay(step, stepId);
				try {
					var res = eval(step);
				} catch (e) { }
				if (res) this.markStepDone(stepId, "info");
			}
			this.execNextStep(isStep, this.interval);
			return;
		}
		if (step == null || step == 'null') {
			this.execNextStep(isStep, this.interval);
			return;
		}
		stepId = stepInfo['stepId'];
		if (this.lastStepId == stepId) {
			this.execNextStep(isStep, this.interval);
			return;
		}
		var debugInfo = stepInfo['debugInfo'];
		var origStep = stepInfo['origStep'];
		if (type == 'JSERROR') {
			var m = (stepInfo.message) ? stepInfo.message : "Logs may have details.";
			this.updateControlWinDisplay("Error in script: " + origStep + "\n" + m);
			return;
		}
		var type = (step.indexOf("_opkey._assert") != -1) ? "success" : (type == "NO_LOG" ? "NO_LOG" : "info");
		this.markStepInProgress(stepId, type);
		this.updateControlWinDisplay(origStep, stepId);
		// commended by ganesh
		this.reAttachEvents();
		this.xyoffsets = new Opkey.Dict();
		// this.alignY = this.alignX = null;
		if (step.indexOf("_opkey._assert") != -1) this.lastAssertStatus = "success";
		this.currentStepId = stepId;
		this.currentType = type;
		// this._alert(this.loaded);
		if (this.getServerVar("screenCapture")) {
			this._takeScreenShot();
			// this.checkForScrollAndCapture(stepId);
		}
		if (step.indexOf("_assertSnapShot") != -1) {
			// img compare takes much longer than normal steps. should not auto
			// proceed
			this.markStepInProgress(stepId, type, 30000);
			// Force no retrying
			this.setRetries(this.MAX_RETRIES + 1);

		}
		this.forked = false;
		eval(step);
		if (!this.forked) {
			this.afterEval();
		}
		// if (this.getServerVar("screenCapture"))
		// this.checkForScrollAndCapture(stepId);
	} catch (e) {
		var retries = this.getRetries();
		if (retries < this.MAX_RETRIES) {
			retries = retries + 1;
			this.setRetries(retries);
			this.interval = this.ONERROR_INTERVAL; // 100 * (2^retries);
			this.execNextStep(isStep, this.interval);
			return;
		} else {
			if (e instanceof OpkeyAssertionException) {
				var failureMsg = "Assertion Failed. " + (e.messageText ? e.messageText : "");
				this.setRetries(0);
				this.markStepDone(stepId, "failure", failureMsg);
				this.execNextStep(isStep, this.interval);
			} else {
				if (this.isPlaying()) {
					var msg = this.getJSErrorMessage(e);
					this.markStepDone(stepId, "error", msg);
				}
				this.execNextStep(isStep, this.interval);
			}
		}
	}
};
Opkey.prototype.fork = function (timeout) {
	// this.markStepInProgress(this.currentStepId, this.currentType,
	// timeout?timeout:3000);
	this.forked = true;
}
Opkey.prototype.afterEval = function () {
	this.lastStepId = this.currentStepId;
	this.markStepDone(this.currentStepId, this.currentType);
	this.waitForLoad = this.SAHI_MAX_WAIT_FOR_LOAD;
	this.interval = this.INTERVAL;
	this.execNextStep(this.exIsStep, this.interval);
}
Opkey.prototype.getWinDimensions = function () {
	var winW = 630,
		winH = 460;
	if (this._isIE() && document.body && document.body.clientWidth) {
		winW = document.body.clientWidth;
		winH = document.body.clientHeight;
	} else if (this._isFF()) {
		winW = document.body.offsetWidth;
		if (window.innerWidth < winW) winW = window.innerWidth;
		winH = window.innerHeight;
	} else if (this._isChrome()) {
		winW = document.body.offsetWidth;
		winH = document.body.offsetHeight;
	} else {
		if (document.body && document.body.offsetWidth) {
			winW = document.body.offsetWidth;
			winH = document.body.offsetHeight;
		}
		if (document.compatMode == 'CSS1Compat' &&
			document.documentElement &&
			document.documentElement.offsetWidth) {
			winW = document.documentElement.offsetWidth;
			winH = document.documentElement.offsetHeight;
		}
		if (window.innerWidth && window.innerHeight) {
			winW = window.innerWidth;
			winH = window.innerHeight;
		}
	}
	return [winW, winH];
}
Opkey.prototype.xgetWinDimensions = function () {
	var winW = 630,
		winH = 460;
	if (document.body && document.body.offsetWidth) {
		winW = document.body.offsetWidth;
		winH = document.body.offsetHeight;
	}
	if (document.compatMode == 'CSS1Compat' &&
		document.documentElement &&
		document.documentElement.offsetWidth) {
		winW = document.documentElement.offsetWidth;
		winH = document.documentElement.offsetHeight;
	}
	if (window.innerWidth && window.innerHeight) {
		winW = window.innerWidth;
		winH = window.innerHeight;
	}
	return [winW, winH];
}
Opkey.prototype.getWinPosition = function () {
	// var ADDONS_BAR_HEIGHT = 28;
	var ADDONS_BAR_HEIGHT = 8;
	if (this._isFF() || this._isSafari() || this._isChrome()) {
		var l = window.screenX + (window.outerWidth - window.innerWidth) - 8;
		var t = window.screenY + (window.outerHeight - window.innerHeight) - ADDONS_BAR_HEIGHT;
		return [l, t];
	}
	if (this._isIE()) {
		var l = window.screenLeft + 2;
		var t = window.screenTop + 2;
		return [l, t];
	}
	return [window.screenLeft, window.screenTop];
}
Opkey.prototype.checkForScrollAndCapture = function (stepId) {
	var p = this.getWinPosition();
	var l = p[0];
	var t = p[1];
	var d = this.getWinDimensions();
	var w = d[0];
	var h = d[1];

	window.scrollTo(0, 0);
	var i = 0;
	// //this._debug("t="+t+" l="+l+" h="+h +" w=" + w);
	// this.takeHorSnapShots(stepId, i, t, l, h, w);
	this.takeSnapShot(stepId, i, t, l, h, w);
	i++;
	var innerHeight = this._isIE() ? parseInt(document.body.clientHeight) : parseInt(window.innerHeight);
	var scrollHeight = parseInt(document.body.scrollHeight);
	while ((scrollHeight - innerHeight) > innerHeight) {
		window.scrollBy(0, innerHeight);
		scrollHeight -= innerHeight;
		// this.takeHorSnapShots(stepId, i, t, l, h, w);
		this.takeSnapShot(stepId, i, t, l, h, w);
		i++;
	}
	if ((scrollHeight - innerHeight < innerHeight) && (scrollHeight - innerHeight > 0)) {
		window.scrollBy(0, scrollHeight - innerHeight);
		scrollHeight -= innerHeight;
		// this._alert(scrollHeight);
		var t2 = t + innerHeight - scrollHeight;
		// this.takeHorSnapShots(stepId, i, t, l, h, w);
		this.takeSnapShot(stepId, i, t2, l, scrollHeight, w);
		i++;
	}
	return this.stitchSnapShots(stepId, i, "V");
};
Opkey.prototype.takeHorSnapShots = function (stepId, vertIx, t, l, h, w) {
	stepId = stepId + "temp" + vertIx;
	window.scrollTo(0, this.getScrollOffsetY());
	var i = 0;
	// //this._debug("t="+t+" l="+l+" h="+h +" w=" + w);
	this.takeSnapShot(stepId, i, t, l, h, w);
	i++;
	var innerWidth = (this._isIE()) ? parseInt(document.body.clientWidth) : parseInt(window.innerWidth);
	var scrollWidth = parseInt(document.body.scrollWidth);
	while ((scrollWidth - innerWidth) > innerWidth) {
		window.scrollBy(innerWidth, 0);
		scrollWidth -= innerWidth;
		this.takeSnapShot(stepId, i, t, l, h, w);
		i++;
	}
	if ((scrollWidth - innerWidth < innerWidth) && (scrollWidth - innerWidth > 0)) {
		window.scrollBy(scrollWidth - innerWidth, 0);
		scrollWidth -= innerWidth;
		// this._alert(scrollWidth);
		var l2 = l + innerWidth - scrollWidth;
		this.takeSnapShot(stepId, i, t, l2, h, scrollWidth);
		i++;
	}
	return this.stitchSnapShots(stepId, i, "H");
}
Opkey.prototype.stitchSnapShots = function (stepId, index, dir) {
	return this.sendToServer("/_s_/dyn/Player_stitchSnapShots?stepId=" + stepId + "&finalIx=" + index + "&dir=" + dir);
};
Opkey.prototype.getJSErrorMessage2 = function (msg, lineNumber) {
	// this._debug("jserror");
	if (_opkey.controllerMode == "sahi") {
		var url = "/_s_/dyn/Log_getBrowserScript?href=" + this._scriptPath() + "&n=" + lineNumber;
		msg += "\n<a href='" + url + "'><b>Click for browser script</b></a>";
	}
	return msg;
};
Opkey.prototype.getJSErrorMessage = function (e) {
	var msg = this.getExceptionString(e);
	var lineNumber = (e.lineNumber) ? e.lineNumber : -1;
	return e.isOpkeyError ? msg : this.getJSErrorMessage2(msg, lineNumber);
};
Opkey.prototype.check204Response = function (win) {
	if (win._opkey.loaded != true) {
		var was204 = this.sendToServer("/_s_/dyn/Player_check204");
		// this._alert(was204+ " " + (typeof was204));
		if (was204 == "true") win._opkey.loaded = true;
	}
	var frs = win.frames;
	if (frs) {
		for (var j = 0; j < frs.length; j++) {
			try {
				this.check204Response(frs[j]);
			} catch (e) { }
		}
	}
};
Opkey.prototype.xcanEvalInBase = function (cmd) {
	return (this.top().opener == null && !this.isForPopup(cmd)) || (this.top().opener && this.top().opener._opkey.top() == this.top());
};
Opkey.prototype.xisForPopup = function (cmd) {
	return cmd.indexOf("_opkey._popup") == 0;
};
Opkey.prototype.xcanEval = function (cmd) {
	return (this.top().opener == null && !this.isForPopup(cmd)) // for base
		// window
		||
		(this.top().opener && this.top().opener._opkey.top() == this.top()) // for
		// links
		// in
		// firefox
		||
		(this.top().opener != null && this.isForPopup(cmd));
	// for popups
};
Opkey.prototype.pause = function () {
	this.topOpkey()._isPaused = true;
	this.setServerVar("sahi_paused", 1);
};
Opkey.prototype.unpause = function () {
	// TODO
	this.topOpkey()._isPaused = false;
	this.setServerVar("sahi_paused", 0);
	this.topOpkey()._isPlaying = true;
};
Opkey.prototype.isPaused = function () {
	if (this.topOpkey()._isPaused == null)
		this.topOpkey()._isPaused = this.getServerVar("sahi_paused") == 1;
	return this.topOpkey()._isPaused;
};
Opkey.prototype.topOpkey = function () {
	//   alert(this.top());
	if (this.top() != null && this.top()._opkey == null) {
		this.top()._opkey = new Opkey();
	}
	return this.top()._opkey;
}
Opkey.prototype.updateControlWinDisplay = function (s, i) {
	try {
		var controlWin = this.getController();
		if (controlWin && !controlWin.closed) {
			// controller2.js checks if this i has already been displayed.
			controlWin.displayLogs(s.replace(/_opkey[.]/g, ""), i);
			if (i != null) controlWin.displayStepNum(i);
		}
	} catch (ex) { }
};
Opkey.prototype.setCurrentIndex = function (i) {
	this.startFromStep = i;
	return;
	if (_isLocal) {
		this.setServerVar("this.localIx", i);
	} else this.setServerVar("this.ix", i);
};
Opkey.prototype.xgetCurrentIndex = function () {
	if (this.cmdsLocal.length > 0) {
		var i = parseInt(this.getServerVar("this.localIx"));
		var localIx = ("" + i != "NaN") ? i : 0;
		if (this.cmdsLocal.length == localIx) {
			this.cmdsLocal = new Array();
			this.setServerVar("this.localIx", 0);
			_isLocal = false;
		} else {
			return localIx;
		}
	}
	var i = parseInt(this.getServerVar("this.ix"));
	return ("" + i != "NaN") ? i : 0;
};
Opkey.prototype.isPlaying = function () {
	if (this.topOpkey()._isPlaying == null) {
		this.topOpkey()._isPlaying = this.sendToServer("/_s_/dyn/SessionState_isPlaying") == "1";
	}
	return this.topOpkey()._isPlaying;
};
Opkey.prototype.playManual = function (ix) {
	this.skipTill(ix);
	// this.setCurrentIndex(ix);
	this.unpause();
	this.ex();
};
Opkey.prototype.startPlaying = function () {
	this.sendToServer("/_s_/dyn/Player_start");
};
Opkey.prototype.stepWisePlay = function () {
	this.sendToServer("/_s_/dyn/Player_stepWisePlay");
};
Opkey.prototype.showStopPlayingMessage = function () {
	this.updateControlWinDisplay("--Stopped Playback: " + (this.hasErrors() ? "FAILURE" : "SUCCESS") + "--");
};
Opkey.prototype.stopPlaying = function () {
	this.sendToServer("/_s_/dyn/Player_stop");
	this.showStopPlayingMessage();
	this.topOpkey()._isPlaying = false;
};
Opkey.prototype.startRecording = function () {
	this.topOpkey()._isRecording = true;
	this.addHandlersToAllFrames(this.top());
	// this.sendToServer("/_s_/dyn/Recorder_start");
};
Opkey.prototype.stopRecording = function () {
	this.topOpkey()._isRecording = false;
	this.sendToServer("/_s_/dyn/Recorder_stop");
	// this.setServerVar("sahi_record", 0);
};
Opkey.prototype.getLogQS = function (msg, type, debugInfo, failureMsg) {
	var qs = "msg=" + this.encode(msg) + "&type=" + type +
		(debugInfo ? "&debugInfo=" + this.encode(debugInfo) : "") +
		(failureMsg ? "&failureMsg=" + this.encode(failureMsg) : "");
	return qs;
};
Opkey.prototype.logPlayBack = function (msg, type, debugInfo, failureMsg) {
	this.sendToServer("/_s_/dyn/TestReporter_logTestResult?" + this.getLogQS(msg, type, debugInfo, failureMsg));
};

Opkey.prototype.compareArrays = function (a1, a2) {
	if (a1 == null || a2 == null) return "One of the arrays is null";
	if (a1.length != a2.length && typeof (a1) == typeof (a2)) return "Difference in length of arrays:\nExpected Length:[" + a1.length + "]\nActual Length:[" + a2.length + "]";
	for (var i = 0; i < a1.length; i++) {
		// if ((typeof a1[i]) != (typeof a2[i])) return "Type mis-match error at
		// index " + i;
		if ((typeof a1[i]) == "object" && (typeof a2[i]) == "object" && a1[i].length && a2[i].length) {
			if (this.compareArrays(a1[i], a2[i]) != "equal") return "Expected:" + this.toJSON(a1[i]) + "\nActual:" + this.toJSON(a2[i]) + " at index " + i;
		} else if (!this.areEqualParams(this.trim(a2[i]), this.checkRegex(this.trim(a1[i])))) {
			return "Expected:" + this.toJSON(a1[i]) + "\nActual:" + this.toJSON(a2[i]) + " at index " + i;
		}
	}
	return "equal"
};

Opkey.prototype.trim = function (s) {
	if (s == null) return s;
	if ((typeof s) != "string") return s;
	s = s.replace(/\xA0/g, ' ').replace(/\s\s*/g, ' ');
	var ws = /\s/;
	var t1 = (ws.test(s.charAt(0))) ? 1 : 0;
	var t2 = (ws.test(s.charAt(s.length - 1))) ? s.length - 1 : s.length;
	return s.slice(t1, t2);
};
Opkey.prototype.list = function (el) {
	if (this.isFlexObj(el)) return el.introspect() + "\n" + el.listProperties();
	var s = "";
	var f = "";
	var j = 0;
	if (typeof el == "array") {
		for (var i = 0; i < el.length; i++) {
			s += i + "=" + el[i];
		}
	}
	if (typeof el == "object") {
		for (var i in el) {
			try {
				if (el[i] && el[i] != el) {
					if (("" + el[i]).indexOf("function") == 0) {
						f += i + "\n";
					} else {
						if (typeof el[i] == "object" && el[i] != el.parentNode) {
							s += i + "={{" + el[i] + "}};\n";
						}
						s += i + "=" + el[i] + ";\n";
						j++;
					}
				}
			} catch (e) {
				s += "" + i + "\n";
			}
		}
	} else {
		s += el;
	}
	return s + "\n\n-----Functions------\n\n" + f;
};

Opkey.prototype.findInArray = function (ar, el) {
	var len = ar.length;
	for (var i = 0; i < len; i++) {
		if (ar[i] == el) return i;
	}
	return -1;
};
Opkey.prototype._isIE = function () {
	return this.navigator.appName == "Microsoft Internet Explorer";
}
Opkey.prototype._isIE6 = function () {
	return /MSIE 6[.]/.test(this.navigator.userAgent);
};
Opkey.prototype._isIE7 = function () {
	return /MSIE 7[.]/.test(this.navigator.userAgent);
};
Opkey.prototype._isIE8 = function () {
	return /MSIE 8[.]/.test(this.navigator.userAgent);
};
Opkey.prototype._isIE9 = function () {
	return /MSIE 9[.]/.test(this.navigator.userAgent);
};
Opkey.prototype._isIE10 = function () {
	return /MSIE 10[.]/.test(this.navigator.userAgent);
};
Opkey.prototype._isIE11 = function () {
	return !this._isChrome() && this._isIE() && document.documentMode == 11;
};
Opkey.prototype._isIE11Plus = function () {
	return !this._isChrome() && this._isIE() && document.documentMode >= 11;
};
Opkey.prototype._isIE9Plus = function () {
	return this._isIE() && !(/MSIE [0-8][.]/.test(this.navigator.userAgent));
};
Opkey.prototype._isIE9StrictMode = function () {
	return this._isIE() && document.documentMode == 9;
};
Opkey.prototype._isIE9PlusStrictMode = function () {
	return this._isIE() && document.documentMode >= 9;
};

Opkey.prototype._isFF2 = function () {
	return /Firefox\/2[.]|Iceweasel\/2[.]|Shiretoko\/2[.]/.test(this.navigator.userAgent);
};
Opkey.prototype._isFF3 = function () {
	return /Firefox\/3[.]|Iceweasel\/3[.]|Shiretoko\/3[.]/.test(this.navigator.userAgent);
};
Opkey.prototype._isFF4 = function () {
	return /Firefox\/4[.]|Iceweasel\/4[.]|Shiretoko\/4[.]/.test(this.navigator.userAgent);
};
Opkey.prototype._isFF5 = function () {
	return /Firefox\/5[.]|Iceweasel\/5[.]|Shiretoko\/5[.]/.test(this.navigator.userAgent);
};
Opkey.prototype._isFF4Plus = function () {
	return (this._isFF() && !this._isFF2() && !this._isFF3());
};
Opkey.prototype._isFF = function () {
	return /Firefox|Iceweasel|Shiretoko/.test(this.navigator.userAgent);
};
Opkey.prototype._isChrome = function () {
	return /Chrome/.test(this.navigator.userAgent);
};
Opkey.prototype._isSafari = function () {
	return /Safari/.test(this.navigator.userAgent) && !(/Chrome/.test(this.navigator.userAgent));
};
Opkey.prototype._isOpera = function () {
	return /Opera/.test(this.navigator.userAgent);
};
Opkey.prototype.isSafariLike = function () {
	return /Konqueror|Safari|KHTML/.test(this.navigator.userAgent);
};
Opkey.prototype._isHTMLUnit = function () {
	return /HTMLUnit/.test(this.navigator.userAgent);
}
Opkey.prototype.createRequestObject = function () {
	var obj;
	if (window.XMLHttpRequest) {
		// If IE7, Mozilla, Safari, etc: Use native object
		obj = new XMLHttpRequest()
	} else {
		if (window.ActiveXObject) {
			// ...otherwise, use the ActiveX control for IE5.x and IE6
			obj = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	return obj;
};
Opkey.prototype._getFFVersion = function () {
	var m = navigator.userAgent.match(/(Firefox|Iceweasel|Shiretoko)[/]([0-9]+)/);
	return (m && m.length == 3) ? parseInt(m[2]) : -1;
}
Opkey.prototype.getServerVar = function (name, isGlobal) {
	var v = this.sendToServer("/_s_/dyn/SessionState_getVar?name=" + this.encode(name) + "&isglobal=" + (isGlobal ? 1 : 0));
	return eval("(" + this.decode(v) + ")");
};
Opkey.prototype.setServerVar = function (name, value, isGlobal) {
	this.sendToServer("/_s_/dyn/SessionState_setVar?name=" + this.encode(name) + "&value=" + this.encode(this.toJSON(value)) + "&isglobal=" + (isGlobal ? 1 : 0));
};
Opkey.prototype.getVarRemember = function (name, isGlobal) {
	var v = this.sendToServer("/_s_/dyn/SessionState_getVarRemember?name=" + this.encode(name) + "&isglobal=" + (isGlobal ? 1 : 0));
	return eval("(" + this.decode(v) + ")");
};
Opkey.prototype.setVarRemember = function (name, value, isGlobal) {
	this.sendToServer("/_s_/dyn/SessionState_setVarRemember?name=" + this.encode(name) + "&value=" + this.encode(this.toJSON(value)) + "&isglobal=" + (isGlobal ? 1 : 0));
};
Opkey.prototype.getVarStatic = function (name, isGlobal) {
	var v = this.sendToServer("/_s_/dyn/SessionState_getVarStatic?name=" + this.encode(name) + "&isglobal=" + (isGlobal ? 1 : 0));
	return eval("(" + this.decode(v) + ")");
};
Opkey.prototype.setVarStatic = function (name, value, isGlobal) {
	this.sendToServer("/_s_/dyn/SessionState_setVarStatic?name=" + this.encode(name) + "&value=" + this.encode(this.toJSON(value)) + "&isglobal=" + (isGlobal ? 1 : 0));
};
Opkey.prototype.logErr = function (msg) {
	// return;
	this.sendToServer("/_s_/dyn/Log?msg=" + this.encode(msg) + "&type=err");
};

Opkey.prototype.getParentNode = function (el, tagName, occurrence, maxPossible) {
	if (!occurrence) occurrence = 1;
	var cnt = 0;
	var parent = el.parentNode;
	var maxParent = parent;
	while (parent && !this.areTagNamesEqual(parent.tagName, "body") && !this.areTagNamesEqual(parent.tagName.toLowerCase(), "html")) {
		if (this.areTagNamesEqual(tagName, "ANY") || this.areTagNamesEqual(parent.tagName, tagName)) {
			cnt++;
			if (occurrence == cnt) return parent;
		}
		maxParent = parent;
		parent = parent.parentNode;
	}
	if (maxPossible) return maxParent;
	return null;
};
Opkey.prototype.sendToServer = function (url, isAsync) {
	/*
	 * try { chrome.runtime.sendMessage({calledapi:url},function(response){
	 * //console.log("RETURNED DATA "+response); }); return ""; } catch(ex) {
	 * this.handleException(ex) }
	 */
	return "";
};

Opkey.prototype.sendToServerViaRecorder = function (url, isAsync) {

	return "";

};
var s_v = function (v) {
	var type = typeof v;
	if (type == "number") return v;
	else if (type == "string") return "\"" + v.replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/"/g, '\\"') + "\"";
	else return v;
};
Opkey.prototype.quoted = function (s) {
	return '"' + s.replace(/"/g, '\\"') + '"';
};
Opkey.prototype.handleException = function (e) {
	// alert(e);
	// throw e;
};
Opkey.prototype.convertUnicode = function (s) {
	return _opkey.escapeUnicode ? this.unicode(s) : s;
}
Opkey.prototype.unicode = function (source) {
	if (source == null) return null;
	var result = '';
	for (var i = 0; i < source.length; i++) {
		if (source.charCodeAt(i) > 127)
			result += this.addSlashU(source.charCodeAt(i).toString(16));
		else result += source.charAt(i);
	}
	return result;
};
Opkey.prototype.addSlashU = function (num) {
	var buildU
	switch (num.length) {
		case 1:
			buildU = "\\u000" + num
			break
		case 2:
			buildU = "\\u00" + num
			break
		case 3:
			buildU = "\\u0" + num
			break
		case 4:
			buildU = "\\u" + num
			break
	}
	return buildU;
};
Opkey.prototype.reAttachEvents = function () {
	/*
	 * if (!this.areWindowsLoaded(this.top())) { ////this._debug("uri:
	 * "+this.top().document.documentURI); this.ping(); return; }
	 */
	this.reAttachOpkey(this.top());
	if (this.isRecording())
		this.addHandlersToAllFrames(this.top());
}

if (_opkey.top() == window) {
	window.setInterval(_opkey.wrap(_opkey.reAttachEvents), 500);
}
Opkey.prototype.reAttachOpkey = function (win) {
	try {
		if (!win._opkey) {
			this.reAttachOpkeyToWin(win);
		}
	} catch (e) { }
	var fs = win.frames;
	// //this._debug("fs: " + fs )
	if (fs && fs.length > 0) {
		// //this._debug("1. fs: " + fs.length )
		for (var i = 0; i < fs.length; i++) {
			try {
				if (this._isHTMLUnit() && fs[i].location.href && fs[i].location.href.indexOf(".gif") != -1) continue;
				this.reAttachOpkey(fs[i]);
			} catch (e) { }
		}
	}
}
Opkey.prototype.reAttachOpkeyToWin = function (win) {
	// this.mockDialogs(win);
	this.activateHotKey(win);
}
Opkey.prototype.onBeforeUnLoad = function () {
	this.loaded = false;
};
Opkey.prototype.onWindowLoad = function (e) {
	// //this._debug("onwindow load")
	try {
		this.loaded = true;
		this.activateHotKey();
	} catch (ex) {
		this.handleException(ex);
	}
	if (this.self() == this.top()) {
		__opkeyDebug__("onWindowLoad: this.self() == this.top(), play()");
		this.play();
		// this.ping();
	}
	if (this.isRecording()) {
		// __opkeyDebug__("init: isRecording() addHandlersToAllFrames");
		this.addHandlersToAllFrames(this.top());
	}
}
Opkey.onWindowLoad = function (e) {
	eval("_opkey.onWindowLoad()");
};

Opkey.prototype.init = function (e) {
	// <<##!!!!RECORDING START!!!!!!
	// __opkeyDebug__("init: start");

	if (this.initTimer) window.clearTimeout(this.initTimer);
	if (this.initialized) return;
	this.initialized = true;
	try {
		this.activateHotKey();
	} catch (ex) {
		this.handleException(ex);
	}
	this.prepareADs();
	this.backupWindowVariables();
	this.makeLibFunctionsAvailable();
	try {
		// if (self == this.top() && self.parent == this.top()) {
		// Replaced above condition on addition of domain support. check.
		// __opkeyDebug__("init: in try");
		if (this.self() == this.top()) {
			// __opkeyDebug__("init: self == this.top(), play()");
			// this.ping();
		}
		/*
		 * if (this.isRecording()) { //__opkeyDebug__("init: isRecording()
		 * addHandlersToAllFrames"); this.addHandlersToAllFrames(this.top()); }
		 */
	} catch (ex) {
		// throw ex;
		this.handleException(ex);
	}
	// __opkeyDebug__("init: before isHTMLUnit");

	this.wrappedOnEv = this.wrap(this.onEv);
	this.wrappedOnMouseDownEv = this.wrap(this.onMouseDownEv);
	// this.isHTMLUnit = this._isHTMLUnit();
	// alert("Cookies: " + document.domain + " " + document.cookie);
	// this.listen();
	/*
	 * _opkey.pingTimer = window.setTimeout(function() { _opkey.ping() }, 100);
	 */
	// __opkeyDebug__("init: end");
};
Opkey.prototype.activateHotKey = function (win) {
	if (!win) win = this.self();
	try {
		var doc = win.document;
		this.addWrappedEvent(doc, "dblclick", this.reAttachEvents);
		this.addWrappedEvent(doc, "dblclick", this.openControllerWindow);
		this.addWrappedEvent(doc, "mousemove", this.mouseOver);
		// if (this.isSafariLike()) {
		// var prev = doc.ondblclick;
		// doc.ondblclick = function(e) {
		// if (prev != null) prev(e);
		// _opkey.openControllerWindow(e);
		// };
		// }
	} catch (ex) {
		this.handleException(ex);
	}
};
Opkey.prototype.xisFirstExecutableFrame = function () {
	var fs = this.top().frames;
	for (var i = 0; i < fs.length; i++) {
		if (this.self() == this.top().frames[i]) return true;
		if ("" + (typeof this.top().frames[i].location) != "undefined") { // =
			// undefined
			// when
			// previous
			// frames
			// are
			// not
			// accessible
			// due
			// to
			// some
			// reason
			// (may
			// be
			// from
			// diff
			// domain)
			return false;
		}
	}
	return false;
};
Opkey.prototype.getOREntry = function (infoAr) {
	var info = infoAr[0];
	var s = this.escapeDollar(this.getAccessor1(info));
	return this.getOREntry2(s);
}
Opkey.prototype.getOREntry2 = function (s) {
	if (s.charAt(0) == '$') return {
		name: s,
		value: s
	};
	var ORName = "$_" + s.toUpperCase().replace(/_/g, '').replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_/, '').replace(/_$/, '')
		.replace(/_[^_]*_NEAR_[^_]*_/g, '_').replace(/_[^_]*_IN_[^_]*_/g, '_');
	return {
		name: ORName,
		value: s
	}
}
/*
 * ESC 27 Enter 13 home 33,34,35,36 arrows 37,38,39,40
 */
Opkey.prototype.isRecordabeKeyDown = function (el, e) {
	return false; // records in wrong sequence causing failures. return false
	// for now.
	if (!e || (e.charCode != 0 && e.charCode != null)) return false;
	var k = e.keyCode;
	return ((k >= 112 && k <= 123) ||
		(k >= 33 && k <= 40) ||
		k == 27 ||
		k == 13);

}
Opkey.prototype.getDocumentNode = function (el) {
	if (el.tagName.toLowerCase() == 'iframe') {
		el = el.contentWindow.document.body;
	} else if (this.isWindow(el)) {
		el = el.document.body;
	}
	return el;
}
Opkey.prototype._selectTextRange = function (el, text, type) {
	this.checkNull(el, "_selectTextRange");
	var start = 0;
	var end = 0;
	var el = this.getDocumentNode(el);
	if (this.findInArray(this.textboxTypes, el.type) != -1 || el.type == "textarea") {
		var s = el.value;
	} else {
		var s = el.textContent;
	}
	if (s) {
		var ixes = this.getStartEndIndexes(text, s);
		start = ixes[0];
		end = ixes[1];
	}
	this._selectRange(el, start, end, type);

}
Opkey.prototype.getTextNodesIn = function (node) {
	var textNodes = [];
	if (node.nodeType == 3) {
		textNodes.push(node);
	} else {
		var children = node.childNodes;
		for (var i = 0, len = children.length; i < len; ++i) {
			textNodes.push.apply(textNodes, this.getTextNodesIn(children[i]));
		}
	}
	return textNodes;
}
Opkey.prototype.getStartEndIndexes = function (searchFor, searchIn) {
	var start = -1;
	var end = -1;
	var o = this.getArrayNameAndIndex(searchFor, true);
	var ix = o.index;
	var toMatch = o.name;
	if (ix == -1) ix = 0;
	if (toMatch instanceof RegExp) {
		var res = null;
		for (var i = 0; i <= ix; i++) {
			res = toMatch.exec(searchIn);
			if (res == null) break;
		}
		if (res) {
			start = res.index;
			end = toMatch.lastIndex;
		}

	} else {
		var startIx = -1;
		for (var i = 0; i <= ix; i++) {
			startIx = searchIn.indexOf(toMatch, startIx + 1);
			if (startIx == -1) break;
		}
		if (startIx != -1) {
			start = startIx;
			end = start + toMatch.length;
		}
	}
	return [start, end];
}
Opkey.prototype._selectRange = function (el, start, end, type) {
	if (start == -1 || end == -1) return;
	if (type == "after") start = end;
	this.checkNull(el, "_selectRange");
	var el = this.getDocumentNode(el);
	var win = this.getWindow(el);
	if (this.findInArray(this.textboxTypes, el.type) != -1 || el.type == "textarea") {
		if (type == "before") end = start;
		if (el.createTextRange) {
			// IE10
			var selRange = el.createTextRange();
			selRange.collapse(true);
			selRange.moveStart('character', start);
			if (this._isIE()) end = end - start;
			selRange.moveEnd('character', end);
			selRange.select();
			el.focus();
		} else if (typeof el.selectionStart != 'undefined') {
			el.selectionStart = start;
			el.selectionEnd = end;
			el.focus();
		} else if (el.setSelectionRange) {
			el.focus();
			el.setSelectionRange(start, end);
		}
		return;
	}

	if (document.createRange && window.getSelection) {
		var range = win.document.createRange();
		range.selectNodeContents(el);

		var textNodes = this.getTextNodesIn(el);
		var foundStart = false;
		var charCount = 0,
			endCharCount;

		for (var i = 0, textNode; textNode = textNodes[i++];) {
			endCharCount = charCount + textNode.length;

			if (!foundStart &&
				start >= charCount &&
				(start < endCharCount || (start == endCharCount && i < textNodes.length))) {
				if (type == "before") {
					if (start - charCount == textNode.length && end != start) {
						if (i + 1 < textNodes.length) {
							var nextTextNode = textNodes[i];
							range.setStartBefore(nextTextNode);
							range.setEnd(nextTextNode, 0);
							range.collapse(true);
							break;
						}
					}
					range.setStart(textNode, start - charCount);
					range.setEnd(textNode, start - charCount);
					break;
				}
				range.setStart(textNode, start - charCount);
				foundStart = true;
			}

			if (foundStart && end <= endCharCount) {
				range.setEnd(textNode, end - charCount);
				break;
			}

			charCount = endCharCount;
		}

		var sel = win.getSelection();

		sel.removeAllRanges();
		sel.addRange(range);
	} else if (document.selection && document.body.createTextRange) {
		var textRange = this.getWindow(el).document.body.createTextRange();

		textRange.moveToElementText(el);
		textRange.collapse(true);
		textRange.moveEnd('character', end);
		textRange.moveStart('character', start);
		textRange.select();
	}
}
Opkey.prototype.getScript = function (infoAr, el, evType, e) {
	var info = infoAr[0];
	var accessor = this.escapeDollar(this.getAccessor1(info));
	if (accessor == null) return null;
	var ev = info.event;
	var value = info.value;
	var type = info.type;
	if (evType != null) evType = evType.toLowerCase();

	var cmd = null;
	if (value == null)
		value = "";

	// handle F12 and contextmenu
	if (evType == "keydown" || evType == "contextmenu") {
		if (evType == "keydown") {
			// this._alert(this.isRecordabeKeyDown(el, e));
			if (this.isRecordabeKeyDown(el, e)) {
				cmd = "_keyPress(" + accessor + ", [" + e.keyCode + "," + 0 + "]);";
				// this._alert(cmd);
			}
		} else {
			cmd = "_rightClick(" + accessor + ");";
		}
		if (!cmd) return null;
	} else {
		if (ev == "_click") {
			cmd = "_click(" + accessor + ");";
		} else if (ev == "_setValue") {
			cmd = "_setValue(" + accessor + ", " + this.quotedEscapeValue(value) + ");";
		} else if (ev == "_setSelected") {
			cmd = "_setSelected(" + accessor + ", " + this.toJSON(value) + ");";
		} else if (ev == "wait") {
			cmd = "_wait(" + value + ");";
		} else if (ev == "mark") {
			cmd = "//MARK: " + value;
		} else if (ev == "_setFile") {
			if (!this.isBlankOrNull(value)) {
				cmd = "_setFile2(" + accessor + ", " + this.quotedEscapeValue(value) + ");";
			} else {
				return null;
			}
		}
	}
	return this.addPopupDomainPrefixes(cmd);
};
Opkey.prototype.addPopupDomainPrefixes = function (cmd) {
	return this.getPopupDomainPrefixes() + cmd;
}
Opkey.prototype.getPopupDomainPrefixes = function () {
	var popup = this.getPopupName();
	var domain = this.getDomainContext();
	var prefix = "";
	if (prefix != null && domain != null && domain != "") {
		prefix = this.language.DOMAIN.replace(/<domain>/g, this.quoted(domain)); // "_domain(\""
		// +
		// domain
		// +
		// "\").";
	}
	if (prefix != null && popup != null && popup != "") {
		prefix += this.language.POPUP.replace(/<window_name>/g, this.quoted(popup));
	}
	return prefix;
}
Opkey.prototype.quotedEscapeValue = function (s) {
	return this.quoted(this.escapeValue(s));
};

Opkey.prototype.escapeValue = function (s) {
	if (s == null || typeof s != "string") return s;
	return this.convertUnicode(s.replace(/\r/g, "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n"));
};

Opkey.prototype.escape = function (s) {
	if (s == null) return s;
	return this.encode(s);
};

Opkey.prototype.quoteIfString = function (shortHand) {
	// if (("" + shortHand).match(/^[0-9]+$/)) return shortHand;
	if (typeof shortHand == "number") return shortHand;
	return this.quotedEscapeValue(shortHand);
};


Opkey.prototype._execute = function (command, sync) {
	var is_sync = sync ? "true" : "false";
	var status = this._callServer("CommandInvoker_execute", "command=" + this.encode(command) + "&sync=" + is_sync);
	if ("success" != status) {
		throw new Error("Execute Command Failed!");
	}
};

_opkey.activateHotKey();

Opkey.prototype._style = function (el, style) {
	var value = el.style[this.toCamelCase(style)];

	if (!value) {
		if (el.ownerDocument && el.ownerDocument.defaultView) // FF
			value = el.ownerDocument.defaultView.getComputedStyle(el, "").getPropertyValue(style);
		else if (el.currentStyle)
			value = el.currentStyle[this.toCamelCase(style)];
	}

	return value;
};

Opkey.prototype.toCamelCase = function (s) {
	var exp = /-([a-z])/
	for (; exp.test(s); s = s.replace(exp, RegExp.$1.toUpperCase()));
	return s;
};
Opkey.init = function (e) {
	eval("_opkey.init()");
};
Opkey.onBeforeUnLoad = function (e) {
	_opkey.onBeforeUnLoad(e);
};
// ff xhr start
if (!_opkey._isIE()) {
	if ((XMLHttpRequest.prototype.__opkeyModified__ == null)) {
		XMLHttpRequest.prototype._opkey_openOld = XMLHttpRequest.prototype.open;
		XMLHttpRequest.prototype.__opkeyModified__ = true;
		XMLHttpRequest.prototype.open = function (method, url, async, username, password) {
			var opened = this._opkey_openOld.apply(this, arguments);
			url = "" + url;
			if (url.indexOf("/_s_/") == -1) {
				try {
					if (!_opkey.isComet(url)) {
						var xs = _opkey.topOpkey().XHRs;
						var j = xs.length;
						xs[j] = this;
						_opkey.topOpkey().XHRTimes[j] = new Date().getTime();
					}
				} catch (e) {
					// _opkey._debug("concat.js: Diff domain: Could not add XHR
					// to list for automatic monitoring "+e);
				}
				// Add sahi-isxhr if same domain
				// Repurcussions:
				// https://developer.mozilla.org/en/http_access_control
				// if (url.indexOf("://") != -1 ||
				// url.indexOf("://"+location.host) == -1) {
				if (url.indexOf("://") == -1 || url.indexOf("://" + location.host) != -1) {
					if (!url.indexOf("xml?seed=i1-j1"))
						this.setRequestHeader("sahi-isxhr", "true");
				}
			}
			return opened;
		}
		new_ActiveXObject = function (s) { // Some custom implementation of
			// ActiveXObject
			return new ActiveXObject(s);
		}
	}
} else {
	new_ActiveXObject = function (s, s1, s2, s3, s4, s5, s6) { // ,s1,s2,s3,s4,s5,s6
		// Fix for
		// ACIWorldWide
		var lower = s.toLowerCase();
		if (lower.indexOf("microsoft.xmlhttp") != -1 || lower.indexOf("msxml2.xmlhttp") != -1 || _opkey.isIE()) {
			return new OpkeyXHRWrapper(s, true);
		} else {
			return new ActiveXObject(s, s1, s2, s3, s4, s5, s6);
		}
	}
}
// ff xhr end
OpkeyXHRWrapper = function (s, isActiveX) {
	try {
		// change made by ganesh
		this.xhr = isActiveX ? new ActiveXObject(s) : new real_XMLHttpRequest();
		// this.xhr = new real_XMLHttpRequest();
	} catch (e) {
		if (_opkey._isIE() && window.ActiveXObject) {
			this.xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	var xs = _opkey.topOpkey().XHRs;
	xs[xs.length] = this;
	// changes made to async to true
	this._async = false;
};
OpkeyXHRWrapper.prototype.open = function (method, url, async, username, password) {
	url = "" + url;
	this._async = async;
	var opened = this.xhr.open(method, url, async, username, password);
	if (url.indexOf("/_s_/") == -1) {
		try {
			if (!_opkey.isComet(url)) {
				var xs = _opkey.topOpkey().XHRs;
				xs[xs.length] = this;
			}
		} catch (e) { }
		// Add sahi-isxhr if same domain
		// Repurcussions: https://developer.mozilla.org/en/http_access_control
		// Does not affect IE really, but not taking chances.
		if (url.indexOf("://") == -1 || url.indexOf(location.host) != -1) {
			// this.xhr.setRequestHeader("sahi-isxhr", "true");

		}

	}
	fn = this.stateChange;
	var obj = this;
	this.xhr.onreadystatechange = function () {
		fn.apply(obj, arguments);
	}
	return opened;
};
OpkeyXHRWrapper.prototype.getAllResponseHeaders = function () {
	return this.xhr.getAllResponseHeaders();
};
OpkeyXHRWrapper.prototype.getResponseHeader = function (s) {
	return this.xhr.getResponseHeader(s);
};
OpkeyXHRWrapper.prototype.setRequestHeader = function (k, v) {
	return this.xhr.setRequestHeader(k, v);
};
OpkeyXHRWrapper.prototype.send = function (s) {
	var sent = this.xhr.send(s);
	if (!this._async) this.populateProps();
	// this.debug("send: " + sent);
	return sent;
};
OpkeyXHRWrapper.prototype.stateChange = function () {
	this.readyState = this.xhr.readyState;
	if (this.readyState == 4) {
		this.populateProps();
	}
	if (this.onreadystatechange) this.onreadystatechange();
};
OpkeyXHRWrapper.prototype.abort = function () {
	return this.xhr.abort();
}
OpkeyXHRWrapper.prototype.populateProps = function () {
	this.responseText = this.xhr.responseText;
	this.responseXML = this.xhr.responseXML;
	// this.responseXml = this.xhr.responseXML;
	this.status = this.xhr.status;
	this.statusText = this.xhr.statusText;
};
if (_opkey._isIE() && typeof XMLHttpRequest != "undefined") {
	window.real_XMLHttpRequest = XMLHttpRequest;
	XMLHttpRequest = OpkeyXHRWrapper;
}
OpkeyHashMap = function () {
	this.keys = new Array();
	this.values = new Array();
	this.put = function (k, v) {
		var i = this.getIndex(this.keys, k);
		if (i == -1) i = this.keys.length;
		this.keys[i] = k;
		this.values[i] = v;
	}
	this.get = function (k) {
		var i = this.getIndex(this.keys, k);
		return this.values[i];
	}
	this.getIndex = function (ar, k) {
		for (var i = 0; i < ar.length; i++) {
			if (k === ar[i]) return i;
		}
		return -1;
	}
}
Opkey.prototype.toJSON = function (el, map) {
	try {
		if (!map) map = new OpkeyHashMap();
		var j = map.get(el);
		if (j && j == "___in_progress___") {
			return '"recursive_access"';
		}
		map.put(el, '___in_progress___');
		var v = this.toJSON2(el, map);
		map.put(el, v);
		return v;
	} catch (e) {
		return "error during toJSON conversion";
	}
}
Opkey.prototype.toJSON2 = function (el, map) {
	if (el == null || el == undefined) return 'null';
	if (el instanceof RegExp) return el.toString();
	if (el instanceof Date) {
		return String(el);
	} else if (typeof el == 'string') {
		if (/["\\\x00-\x1f]/.test(el)) {
			return '"' + el.replace(/([\x00-\x1f\\"])/g, function (a, b) {
				var c = _opkey.escapeMap[b];
				if (c) {
					return c;
				}
				c = b.charCodeAt();
				return '\\u00' +
					Math.floor(c / 16).toString(16) +
					(c % 16).toString(16);
			}) + '"';
		}
		return '"' + el + '"';
	} else if (el instanceof Array) {
		var ar = [];
		for (var i = 0; i < el.length; i++) {
			ar[i] = this.toJSON(el[i], map);
		}
		return '[' + ar.join(',') + ']';
	} else if (typeof el == 'number') {
		return new String(el);
	} else if (typeof el == 'boolean') {
		return String(el);
	} else if (el instanceof Object) {
		if (el.tagName) {
			var elInfo = this.identify(el, true);
			if (elInfo == null || elInfo.apis == null) return null;
			return (elInfo.apis.length > 0) ? "_opkey." + this.escapeDollar(this.getAccessor1(elInfo.apis[0])) : null;
		} else {
			var ar = [];
			for (var k in el) {
				var v = el[k];
				if (typeof v != 'function') {
					ar[ar.length] = this.toJSON(k, map) + ':' + this.toJSON(v, map);
				}
			}
			return '{' + ar.join(',') + '}';
		}
	}
};
Opkey.prototype.isComet = function (u) {
	return /\/comet[\/.]/.test(u);
}
Opkey.prototype.isIgnorableId = function (id) {
	return this.ignorableIdsPattern.test(id);
};
Opkey.prototype.iframeFromStr = function (iframe) {
	if (typeof iframe == "string") return this._byId(iframe);
	return iframe;
};
Opkey.prototype._rteWrite = function (iframe, s) {
	this.iframeFromStr(iframe).contentWindow.document.body.innerHTML = s;
};
Opkey.prototype._rteHTML = function (iframe) {
	return this.iframeFromStr(iframe).contentWindow.document.body.innerHTML;
};
Opkey.prototype._rteText = function (iframe) {
	return this._getText(this.iframeFromStr(iframe).contentWindow.document.body);
};
Opkey.prototype._re = function (s) {
	return eval("/" + s.replace(/\s+/g, '\\s+') + "/");
};
// Opkey.prototype._scriptName = function(){
// this._evalOnRhino("_scriptName()");
// // return this.__scriptName;
// };
// Opkey.prototype._scriptPath = function(){
// return this.__scriptPath;
// };
Opkey.prototype._parentNode = function (el, tagName, occurrence) {
	if (tagName == null && occurrence == null) {
		tagName = "ANY";
	} else if (typeof (tagName) == "number") {
		occurrence = tagName;
		tagName = "ANY";
	}
	return this.getParentNode(el, tagName, occurrence);
};
Opkey.prototype._parentCell = function (el, occurrence) {
	return this._parentNode(el, "TD", occurrence);
};
Opkey.prototype._parentRow = function (el, occurrence) {
	return this._parentNode(el, "TR", occurrence);
};
Opkey.prototype._parentTable = function (el, occurrence) {
	return this._parentNode(el, "TABLE", occurrence);
};
Opkey.prototype.getDoc = function (constraints) {
	if (constraints.relations.length == 0) return constraints.window.document;
	return this.getDoc2(constraints.relations);
}
Opkey.prototype.getDoc2 = function (relations) {
	if (this.isArray(relations)) {
		var nodes = [];
		for (var i = 0; i < relations.length; i++) {
			var relation = relations[i];
			if (!relation.type && this.isWindow(relation)) {
				nodes.push(relation.document); // window
			}
			if (relation.relation && relation.relation == "_near") {
				nodes = nodes.concat(this.getDoc2(relation).nodes);
			}
		}
		var inEl = null;
		for (var i = 0; i < relations.length; i++) {
			var relation = relations[i];
			if (relation.relation && relation.relation == "_in") {
				var relEl = relation.element;
				if (inEl != null && !this._contains(inEl, relEl) && !this._contains(relEl, inEl)) {
					// mutually exclusive nodes
					return new OpkeyDocProxy([]);
				}
				if (inEl == null || this._contains(inEl, relEl)) {
					// inner element
					inEl = relEl;
				}
			}
		}
		if (inEl == null) return new OpkeyDocProxy(nodes);
		if (nodes.length == 0) return inEl;
		var narrowed = [];
		for (var i = 0; i < nodes.length; i++) {
			if (this._contains(inEl, nodes[i])) {
				narrowed.push(nodes[i]);
			}
			if (this._contains(nodes[i], inEl)) {
				narrowed.push(inEl);
			}
		}
		return new OpkeyDocProxy(narrowed);
	}
	if (relations.relation) {
		if (relations.relation == "_in") return relations.element;
		if (relations.relation == "_near") {
			var parents = [];
			for (var i = 1; i < 7; i++) {
				parents[parents.length] = this.getParentNode(relations.element, "ANY", i);
			}
			return new OpkeyDocProxy(parents);
		}
	}
	return relations.document;
};
OpkeyDocProxy = function (nodes) {
	this.nodes = nodes;
};
OpkeyDocProxy.prototype.getElementsByTagName = function (tag) {
	var tags = [];
	for (var i = 0; i < this.nodes.length; i++) {
		if (this.nodes[i] == null) continue;
		var childNodes = _opkey.getElementsByTagName(tag, this.nodes[i]);
		for (var j = 0; j < childNodes.length; j++) {
			var childNode = childNodes[j];
			var alreadyAdded = false;
			for (var k = 0; k < tags.length; k++) {
				if (tags[k] === childNode) {
					alreadyAdded = true;
					break;
				}
			}
			if (!alreadyAdded) {
				tags[tags.length] = childNode;
			}
		}
	}
	return tags;
};
Opkey.prototype._in = function (el) {
	this.checkNull(el, "_in");
	return {
		"element": el,
		"relation": "_in",
		"type": "dom"
	};
};
Opkey.prototype._near = function (el) {
	this.checkNull(el, "_near");
	return {
		"element": el,
		"relation": "_near",
		"type": "dom"
	};
};

Opkey.prototype.getLeftTop = function (el) {
	var pos = el.getBoundingClientRect();
	return [pos.left, pos.top];
};

Opkey.prototype._under = function (el, offset, limitUnder) {
	this.checkNull(el, "_under");

	var xy = this.getLeftTop(el);
	var alignX = xy[0];
	var alignXOuter = alignX + el.offsetWidth;
	var h = el.offsetHeight;
	var limitY = xy[1] + (isNaN(h) ? 0 : h / 2);
	var underOffset = offset == null ? 0 : offset;
	if (this.is_defined(limitUnder)) limitUnder += limitY;
	return {
		"element": el,
		"relation": "_under",
		"type": "position",
		alignX: (alignX - underOffset),
		alignXOuter: (alignXOuter + underOffset),
		limitY: limitY,
		limitUnder: limitUnder
	};
};

Opkey.prototype._above = function (el, offset, limitTop) {
	this.checkNull(el, "_above");

	var xy = this.getLeftTop(el);
	var alignX = xy[0];
	var alignXOuter = alignX + el.offsetWidth;
	var h = el.offsetHeight;
	var limitY = xy[1] - (isNaN(h) ? 0 : h / 2);
	var aboveOffset = offset == null ? 0 : offset;
	if (this.is_defined(limitTop)) limitTop = limitY - limitTop;
	return {
		"element": el,
		"relation": "_above",
		"type": "position",
		alignX: (alignX - aboveOffset),
		alignXOuter: (alignXOuter + aboveOffset),
		limitY: limitY,
		limitTop: limitTop
	};

};

Opkey.prototype._leftOf = function (el, offset) {
	this.checkNull(el, "_leftOf");

	var xy = this.getLeftTop(el);
	var alignY = xy[1];
	var alignYOuter = alignY + el.offsetHeight;
	var w = el.offsetWidth;
	var limitX = xy[0];
	offset = this.fixOffset(offset);
	return {
		"element": el,
		"relation": "_leftOf",
		"type": "position",
		alignY: (alignY - offset[0]),
		alignYOuter: (alignYOuter + offset[1]),
		limitX: limitX
	};
};

Opkey.prototype._rightOf = function (el, offset) {
	this.checkNull(el, "_rightOf");

	var xy = this.getLeftTop(el);
	var alignY = xy[1];
	var alignYOuter = alignY + el.offsetHeight;
	var w = el.offsetWidth;
	var limitX = xy[0] + (isNaN(w) ? 0 : w / 2);

	offset = this.fixOffset(offset);
	return {
		"element": el,
		"relation": "_rightOf",
		"type": "position",
		alignY: (alignY - offset[0]),
		alignYOuter: (alignYOuter + offset[1]),
		limitX: limitX
	};
};

Opkey.prototype._leftOrRightOf = function (el, offset) {
	this.checkNull(el, "_leftOrRightOf");

	var alignY = this.getLeftTop(el)[1];
	var alignYOuter = alignY + el.offsetHeight;
	offset = this.fixOffset(offset);
	return {
		"element": el,
		"relation": "_rowOf",
		"type": "position",
		alignY: (alignY - offset[0]),
		alignYOuter: (alignYOuter + offset[1])
	};
};
Opkey.prototype._aboveOrUnder = function (el, offset) {
	this.checkNull(el, "_aboveOrUnder");

	var alignX = this.getLeftTop(el)[0];
	var alignXOuter = alignX + el.offsetWidth;
	var aboveOffset = offset == null ? 0 : offset;

	return {
		"element": el,
		"relation": "_colOf",
		"type": "position",
		alignX: (alignX - aboveOffset),
		alignXOuter: (alignXOuter + aboveOffset)
	};
};

Opkey.prototype.fixOffset = function (offset) {
	if (offset == null) offset = [0, 0];
	else if (typeof offset == 'number') {
		offset = [offset, offset];
	}
	return offset;
}

Opkey.prototype._xy = function (el, x, y) {
	this.checkNull(el, "_xy");
	this.xyoffsets.put(el, [x, y]);
	return el;
}

Opkey.prototype.addOpkey = function (s) {
	return this.decode(this.sendToServer("/_s_/dyn/ControllerUI_getOpkeyScript?code=" + this.encode(s)));
};
_opkey.prevOnError = window.onerror;
window.onerror = _opkey.wrap(_opkey.onError);
Opkey.prototype.setServerVarPlain = function (name, value, isGlobal) {
	// if (name == "___lastValue___") //this._debug(name+"="+value);
	this.sendToServer("/_s_/dyn/SessionState_setVar?name=" + this.encode(name) + "&value=" + this.encode(value) + "&isglobal=" + (isGlobal ? 1 : 0));
};
/* execCommand start */
if (_opkey._isIE()) {
	_opkey.real_execCommand = document.execCommand;
	document.execCommand = function () {
		return _opkey_dummyExecCommand.apply(document, arguments);
	};
}
Opkey.prototype.encode = function (str) {
	return encodeURIComponent(str).replace(/%20/g, '+').replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
		replace(/\)/g, '%29').replace(/\*/g, '%2A');
}
Opkey.prototype.decode = function (msg) {
	if (!msg) return msg;
	return decodeURIComponent(msg.replace(/[+]/g, ' '));
}

function _opkey_dummyExecCommand() {
	if (arguments[0] == 'ClearAuthenticationCache') {
		_opkey.sendToServer("/_s_/dyn/SessionState_removeAllCredentials");
		return true;
	} else {
		return _opkey.real_execCommand.apply(window.document, arguments);
	}
}
/* execCommand end */

/** id start * */
Opkey.prototype.getOptionId = function (sel, val) {
	if (sel.selectedIndex != -1)
		return sel.options[sel.selectedIndex].id;
};
Opkey.prototype.addADAr = function (a) {
	this.ADs[this.ADs.length] = a;
};
Opkey.prototype.getAD = function (el) {
	var defs = [];
	for (var i = 0; i < this.ADs.length; i++) {
		var d = this.ADs[i];
		if (this.areTagNamesEqual(d.tag, el.tagName)) {
			if (!el.type) defs[defs.length] = d;
			else if (!d.type || this.getElementType(el) == d.type) defs[defs.length] = d;
		}
	}
	return defs;
};
Opkey.prototype.getDomRelAr = function (args) {
	var rels = [];
	var poss = [];
	var w = null;
	for (var i = 1; i < args.length; i++) {
		var a = args[i];
		if (a) {
			if (this.isWindow(a)) w = a;
			if (a.type == "dom") rels.push(a);
			if (a.type == "position") poss.push(a);
		}
	}
	if (!w) w = this.top();
	return {
		relations: rels,
		positionals: poss,
		window: w
	};
}
Opkey.prototype.isWindow = function (o) {
	return (o && o.location && o.document) != null;
}
Opkey.prototype.addAD = function (a) {
	this.addADAr(a);
	var old = Opkey.prototype[a.name];
	var newFn = function (identifier) {
		var inEl = this.getDomRelAr(arguments);
		if (old) {
			var el = old.apply(this, arguments);
			if (el) return el;
		}
		var attributes = a.attributes;
		if (typeof identifier == "object" && !(identifier instanceof RegExp)) {
			attributes = ["associative_array"];
		}
		for (var i = 0; i < a.attributes.length; i++) {
			var res = this.getBlankResult();
			if (a.type) {
				var el = this.findElementHelper(identifier, inEl, a.type, res, attributes[i], a.tag).element;
			} else {
				var el = this.findTagHelper(identifier, inEl, a.tag, res, attributes[i]).element;
			}
			if (el != null) return el;
		}
	};
	if (!a.idOnly) Opkey.prototype[a.name] = newFn;
};

var getAbsPosition = function (el) {
	var el2 = el;
	if (el2 != null) {
		var curtop = 0;
		var curleft = 0;
		if (document.getElementById || document.all) {
			do {
				if (el == "undefined") {
					break;
				}

				if (el != "undefined") {
					curleft += el.offsetLeft - el.scrollLeft;
					curtop += el.offsetTop - el.scrollTop;
				}
				el = el.offsetParent;

				el2 = el2.parentNode;
				while (el2 != el) {
					curleft -= el2.scrollLeft;
					curtop -= el2.scrollTop;
					el2 = el2.parentNode;
				}

			} while (el != null && el.offsetParent);

		} else if (document.layers) {
			curtop += el.y;
			curleft += el.x;
		}
	}
	return [curtop, curleft];
};

Opkey.prototype.identifyForShadowDOM = function (el, ignoreEncaps) {
	// this.alignY = this.alignX = null;
	try {
		//checking for list getting sn -collapsibe-list as label
		if (el.nodeName == "SN-COLLAPSIBLE-LIST") {
			el = null;
		}
		if (el == null) return null;
		var apis = [];
		var assertions = [];
		var tagLC = el.tagName.toLowerCase();
		var accs = this.getAD(el);
		var relation = null;
		var relationStr = null;
		var anchor = this.topOpkey().anchor;
		if (anchor == null) {
			if (_opkey.anchored_element != null) {
				anchor = _opkey.anchored_element;
			}
		}
		if (anchor) {
			var elp = getAbsPosition(el)
			var anch = getAbsPosition(anchor)
			var elementtop = elp[0]
			var elementleft = elp[1]
			var anchortop = anch[0]
			var anchorleft = anch[1]
			// //console.log("Element Left "+elementleft)
			// //console.log("Anchor left "+anchorleft)
			// //console.log("Element Top "+elementtop)
			// //console.log("Anchor Top "+anchortop)
			if (anchor == el) {
				// do nothing
			} else if (this._contains(anchor, el)) {
				relation = this._in(anchor);
				var nodelist = document.getElementsByTagName("*");

				var i;
				for (i = 0; i < nodelist.length; i++) {
					if (nodelist[i] == el) {
						pivotindex1 = i
					}
					if (nodelist[i] == anchor) {
						anchindex = i
					}
				}
				if (pivotindex1 < anchindex) {
					pivotindex = anchindex - pivotindex1
				} else if (pivotindex1 > anchindex) {
					pivotindex = pivotindex1 - anchindex
				}
				relationStr = "_in(" + this.topOpkey().anchorStr + ") Depth=" + pivotindex
				// //console.log("Relation is "+relationStr)
			}
			/*
			 * else if (this._contains(this.getParentNode(anchor, "ANY", 7,
			 * true), el)){ relation = this._near(anchor); relationStr =
			 * "_near(" + this.topOpkey().anchorStr + ")";
			 * ////console.log("Relation is "+relationStr) }
			 */
			else if (elementtop < anchortop && (anchortop - elementtop) > 30) {
				var nodelist = document.getElementsByTagName("*");

				var i;
				for (i = 0; i < nodelist.length; i++) {
					if (nodelist[i] == el) {
						pivotindex1 = i
					}
					if (nodelist[i] == anchor) {
						anchindex = i
					}
				}
				if (pivotindex1 < anchindex) {
					pivotindex = anchindex - pivotindex1
				} else if (pivotindex1 > anchindex) {
					pivotindex = pivotindex1 - anchindex
				}
				relationStr = "_aboveOf(" + this.topOpkey().anchorStr + ") Depth=" + pivotindex
				// //console.log("Relation is "+relationStr)
			} else if (elementtop > anchortop && (elementtop - anchortop) > 30) {
				var nodelist = document.getElementsByTagName("*");

				var i;
				for (i = 0; i < nodelist.length; i++) {
					if (nodelist[i] == el) {
						pivotindex1 = i
					}
					if (nodelist[i] == anchor) {
						anchindex = i
					}
				}
				if (pivotindex1 < anchindex) {
					pivotindex = anchindex - pivotindex1
				} else if (pivotindex1 > anchindex) {
					pivotindex = pivotindex1 - anchindex
				}
				// //console.log(elementtop-anchortop)
				relationStr = "_belowOf(" + this.topOpkey().anchorStr + ") Depth=" + pivotindex
				// //console.log("Relation is "+relationStr)
			} else if (elementleft < anchorleft) {

				var nodelist = document.getElementsByTagName("*");

				var i;
				for (i = 0; i < nodelist.length; i++) {
					if (nodelist[i] == el) {
						pivotindex1 = i
					}
					if (nodelist[i] == anchor) {
						anchindex = i
					}
				}
				if (pivotindex1 < anchindex) {
					pivotindex = anchindex - pivotindex1
				} else if (pivotindex1 > anchindex) {
					pivotindex = pivotindex1 - anchindex
				}
				relationStr = "_leftOf(" + this.topOpkey().anchorStr + ") Depth=" + pivotindex
			} else if (elementleft > anchorleft) {
				var nodelist = document.getElementsByTagName("*");

				var i;
				for (i = 0; i < nodelist.length; i++) {
					if (nodelist[i] == el) {
						pivotindex1 = i
					}
					if (nodelist[i] == anchor) {
						anchindex = i
					}
				}
				if (pivotindex1 < anchindex) {
					pivotindex = anchindex - pivotindex1
				} else if (pivotindex1 > anchindex) {
					pivotindex = pivotindex1 - anchindex
				}
				relationStr = "_rightOf(" + this.topOpkey().anchorStr + ") Depth=" + pivotindex;
				// //console.log("Relation is "+relationStr)
			}


		}

		if (accs.length == 0) {
			// neon will work
			this.addAD({
				tag: el.nodeName,
				type: null,
				event: "click",
				name: "_" + el.nodeName,
				attributes: ["id", "className", "name", "sahiText", "index"],
				action: "click",
				value: null
			});
			accs = this.getAD(el);
		}
		for (var k = 0; k < accs.length; k++) {
			var acc = accs[k];
			if (acc && acc.attributes) {
				var r = acc.attributes;
				for (var i = 0; i < r.length; i++) {
					try {
						var attr = r[i];
						// //debugger;
						if (attr == "index") {
							var ix = this.getIdentifyIx(null, el, null, relation);
							if (ix != -1 && this[acc.name](ix) == el) {
								apis[apis.length] = this.buildAccessorInfo(el, acc, ix, relationStr, attr);
							}
						} else if (typeof attr == "string" && !ignoreEncaps && attr.indexOf("encaps") == 0) {
							var parentTag = attr.substring(attr.indexOf("_") + 1);
							var p = this._parentNode(el, parentTag);
							var pAccs = this.identify(p);
							// TODO: check this assertions get added to both
							// child and parent. may come out incorrect.
							if (pAccs) {
								apis = apis.concat(pAccs.apis);
								assertions = assertions.concat(pAccs.assertions);
							}
						} else {
							var val = this.getAttribute(el, attr);
							// //debugger;
							if (el.nodeName.toLowerCase() == "button") {
								if (el) {
									apis[apis.length] = this.buildAccessorInfo(el, acc, val, relationStr, attr);
								} else {
									var ix = this.getIdentifyIx(val, el, attr, relation);
									val = val + "[" + ix + "]";
									if (ix != -1 && this[acc.name](val) == el) {
										apis[apis.length] = this.buildAccessorInfo(el, acc, val, relationStr, attr);
									}
								}
							} else {
								if (val && !(attr == "sahiText" && val.length > 200)) {
									if (el) {
										apis[apis.length] = this.buildAccessorInfo(el, acc, val, relationStr, attr);
									} else {
										var ix = this.getIdentifyIx(val, el, attr, relation);
										val = val + "[" + ix + "]";
										if (ix != -1 && this[acc.name](val) == el) {
											apis[apis.length] = this.buildAccessorInfo(el, acc, val, relationStr, attr);
										}
									}
								}
							}
						}
					} catch (e) {
						// console.error(e +" " + attr + " " + el.tagName);
					}
				}
			}
		}

		if (apis.length > 0) {
			assertions = assertions.concat(this.getAssertions(accs, apis[0]));
		}

		return {
			apis: apis,
			assertions: assertions
		};
	} catch (e) { }
};
function isInShadowDOM(element) {
	return element.getRootNode() instanceof ShadowRoot;
}
Opkey.prototype.identify = function (el, ignoreEncaps) {
	// this.alignY = this.alignX = null;
	if (el != null) {
		if (el.isShadowDomElement || isInShadowDOM(el)) {
			return this.identifyForShadowDOM(el, ignoreEncaps);
		}
	}
	try {
		if (el == null) return null;
		var apis = [];
		var assertions = [];
		var tagLC = el.tagName.toLowerCase();
		var accs = this.getAD(el);
		var relation = null;
		var relationStr = null;
		var anchor = this.topOpkey().anchor;
		if (anchor == null) {
			if (_opkey.anchored_element != null) {
				anchor = _opkey.anchored_element;
			}
		}
		if (anchor) {
			var elp = getAbsPosition(el)
			var anch = getAbsPosition(anchor)
			var elementtop = elp[0]
			var elementleft = elp[1]
			var anchortop = anch[0]
			var anchorleft = anch[1]
			// //console.log("Element Left "+elementleft)
			// //console.log("Anchor left "+anchorleft)
			// //console.log("Element Top "+elementtop)
			// //console.log("Anchor Top "+anchortop)
			if (anchor == el) {
				// do nothing
			} else if (this._contains(anchor, el)) {
				relation = this._in(anchor);
				var nodelist = document.getElementsByTagName("*");

				var i;
				for (i = 0; i < nodelist.length; i++) {
					if (nodelist[i] == el) {
						pivotindex1 = i
					}
					if (nodelist[i] == anchor) {
						anchindex = i
					}
				}
				if (pivotindex1 < anchindex) {
					pivotindex = anchindex - pivotindex1
				} else if (pivotindex1 > anchindex) {
					pivotindex = pivotindex1 - anchindex
				}
				relationStr = "_in(" + this.topOpkey().anchorStr + ") Depth=" + pivotindex
				// //console.log("Relation is "+relationStr)
			}
			/*
			 * else if (this._contains(this.getParentNode(anchor, "ANY", 7,
			 * true), el)){ relation = this._near(anchor); relationStr =
			 * "_near(" + this.topOpkey().anchorStr + ")";
			 * ////console.log("Relation is "+relationStr) }
			 */
			else if (elementtop < anchortop && (anchortop - elementtop) > 30) {
				var nodelist = document.getElementsByTagName("*");

				var i;
				for (i = 0; i < nodelist.length; i++) {
					if (nodelist[i] == el) {
						pivotindex1 = i
					}
					if (nodelist[i] == anchor) {
						anchindex = i
					}
				}
				if (pivotindex1 < anchindex) {
					pivotindex = anchindex - pivotindex1
				} else if (pivotindex1 > anchindex) {
					pivotindex = pivotindex1 - anchindex
				}
				relationStr = "_aboveOf(" + this.topOpkey().anchorStr + ") Depth=" + pivotindex
				// //console.log("Relation is "+relationStr)
			} else if (elementtop > anchortop && (elementtop - anchortop) > 30) {
				var nodelist = document.getElementsByTagName("*");

				var i;
				for (i = 0; i < nodelist.length; i++) {
					if (nodelist[i] == el) {
						pivotindex1 = i
					}
					if (nodelist[i] == anchor) {
						anchindex = i
					}
				}
				if (pivotindex1 < anchindex) {
					pivotindex = anchindex - pivotindex1
				} else if (pivotindex1 > anchindex) {
					pivotindex = pivotindex1 - anchindex
				}
				// //console.log(elementtop-anchortop)
				relationStr = "_belowOf(" + this.topOpkey().anchorStr + ") Depth=" + pivotindex
				// //console.log("Relation is "+relationStr)
			} else if (elementleft < anchorleft) {

				var nodelist = document.getElementsByTagName("*");

				var i;
				for (i = 0; i < nodelist.length; i++) {
					if (nodelist[i] == el) {
						pivotindex1 = i
					}
					if (nodelist[i] == anchor) {
						anchindex = i
					}
				}
				if (pivotindex1 < anchindex) {
					pivotindex = anchindex - pivotindex1
				} else if (pivotindex1 > anchindex) {
					pivotindex = pivotindex1 - anchindex
				}
				relationStr = "_leftOf(" + this.topOpkey().anchorStr + ") Depth=" + pivotindex
			} else if (elementleft > anchorleft) {
				var nodelist = document.getElementsByTagName("*");

				var i;
				for (i = 0; i < nodelist.length; i++) {
					if (nodelist[i] == el) {
						pivotindex1 = i
					}
					if (nodelist[i] == anchor) {
						anchindex = i
					}
				}
				if (pivotindex1 < anchindex) {
					pivotindex = anchindex - pivotindex1
				} else if (pivotindex1 > anchindex) {
					pivotindex = pivotindex1 - anchindex
				}
				relationStr = "_rightOf(" + this.topOpkey().anchorStr + ") Depth=" + pivotindex;
				// //console.log("Relation is "+relationStr)
			}


		}
		for (var k = 0; k < accs.length; k++) {
			var acc = accs[k];
			if (acc && acc.attributes) {
				var r = acc.attributes;
				for (var i = 0; i < r.length; i++) {
					try {
						var attr = r[i];
						// //debugger;
						if (attr == "index") {
							var ix = this.getIdentifyIx(null, el, null, relation);
							if (ix != -1 && this[acc.name](ix) == el) {
								apis[apis.length] = this.buildAccessorInfo(el, acc, ix, relationStr, attr);
							}
						} else if (typeof attr == "string" && !ignoreEncaps && attr.indexOf("encaps") == 0) {
							var parentTag = attr.substring(attr.indexOf("_") + 1);
							var p = this._parentNode(el, parentTag);
							var pAccs = this.identify(p);
							// TODO: check this assertions get added to both
							// child and parent. may come out incorrect.
							if (pAccs) {
								apis = apis.concat(pAccs.apis);
								assertions = assertions.concat(pAccs.assertions);
							}
						} else {
							var val = this.getAttribute(el, attr);
							// //debugger;
							if (el.nodeName.toLowerCase() == "button") {
								if (this[acc.name](val, relation) == el) {
									apis[apis.length] = this.buildAccessorInfo(el, acc, val, relationStr, attr);
								} else {
									var ix = this.getIdentifyIx(val, el, attr, relation);
									val = val + "[" + ix + "]";
									if (ix != -1 && this[acc.name](val) == el) {
										apis[apis.length] = this.buildAccessorInfo(el, acc, val, relationStr, attr);
									}
								}
							}
							else if ((val || val == "") && !(attr == "sahiText" && val.length > 200) && _opkey.GetRecordingMode() == "SERVICENOW" && (el.baseURI.includes("SERVICE") || el.baseURI.includes("ervice") || el.baseURI.includes("kpmg"))) {
								debugger;
								//mohit spy changes
								apis[apis.length] = this.buildAccessorInfo(el, acc, val, relationStr, attr);
							}
							else {
								if (val && !this.isIgnorableId(val) && !(attr == "sahiText" && val.length > 200)) {
									if (this[acc.name](val, relation) == el) {
										apis[apis.length] = this.buildAccessorInfo(el, acc, val, relationStr, attr);
									} else {
										var ix = this.getIdentifyIx(val, el, attr, relation);
										val = val + "[" + ix + "]";
										if (ix != -1 && this[acc.name](val) == el) {
											apis[apis.length] = this.buildAccessorInfo(el, acc, val, relationStr, attr);
										}
									}
								}
							}
						}
					} catch (e) {
						// alert(e +" " + attr + " " + el.tagName);
					}
				}
			}
		}

		if (apis.length > 0) {
			assertions = assertions.concat(this.getAssertions(accs, apis[0]));
		}

		return {
			apis: apis,
			assertions: assertions
		};
	} catch (e) { }
};
Opkey.prototype.buildAccessorInfo = function (el, acc, identifier, relationStr, accessorType) {
	return new AccessorInfo("", identifier, acc.name, acc.action, (acc.value ? this.getAttribute(el, acc.value) : null), acc.value, relationStr, accessorType);
};
Opkey.prototype.getIdentifyIx = function (val, el, attr, inEl) {
	var inEl = this.getDomRelAr(arguments);
	var tagLC = el.tagName.toLowerCase();
	var res = this.getBlankResult();
	if (this.isFormElement(el)) {
		return this.findElementIxHelper(val, el.type, el, inEl, res, attr, tagLC).cnt;
	} else {
		return this.findTagIxHelper(val, el, inEl, tagLC, res, attr).cnt;
	}
};
Opkey.prototype.isFormElement = function (el) {
	var n = el.tagName.toLowerCase();
	return n == "input" || n == "button" || n == "textarea" || n == "select" || n == "option";
}
Opkey.prototype.getAttribute = function (el, attr) {
	if (typeof attr == "function") {
		return attr(el);
	}
	if (attr.indexOf("|") != -1) {
		var attrs = attr.split("|");
		for (var i = 0; i < attrs.length; i++) {
			var v = this.getAttribute(el, attrs[i]);
			if (v != null && v != "") return v;
		}
	} else {
		if (attr == "sahiText") {
			return this._getText(el);
		}
		return el[attr];
	}
};
Opkey.prototype.makeLibFunctionsAvailable = function () {
	var fns = ["_scriptName", "_scriptPath", "_suiteInfo", "_userDataDir",
		"_sessionInfo", "_userDataPath", "_readFile", "_readCSVFile",
		"_readURL", "_scriptStatus", "_stackTrace", "_selectWindow",
		"_resolvePath"
	];
	for (var i = 0; i < fns.length; i++) {
		this.addRhinoFn(fns[i]);
	}
}
Opkey.prototype.addRhinoFn = function (fnName) {
	this[fnName] = function () {
		var s = "";
		for (var i = 0; i < arguments.length; i++) {
			if (i != 0) s += ", ";
			s += this.toJSON(arguments[i]);
		}
		return this._evalOnRhino(fnName + "(" + s + ")");
	}
}
Opkey.prototype._evalOnRhino = function (s) {
	try {
		var v = this.sendToServer("/_s_/dyn/RhinoRuntime_eval?toEval=" + this.encode(s));
		return eval("(" + this.decode(v) + ")");
	} catch (e) {
		return null;
	}
}
Opkey.prototype.getFileFromURL = function (el) {
	var src = el.src;
	src = src.replace(/[;?].*$/, '');
	return src.substring(src.lastIndexOf("/") + 1);
}
// Opkey.prototype.getXPathCrumb = function(el){
// var locators = {
// A:["sahiText", "link="],
// ANY: ["id", ]
// }
// if (el.id) return el.tagName "[@id=" +
// }
Opkey.prototype.getXPath = function (el) {
	var n = el;
	var s = "";
	while (true) {
		var p = n.parentNode;
		if (p == n || p == null) break;
		var ix = this.findInArray(this.getElementsByTagName(n.tagName, p), n);
		var sfx = ix > 0 ? "[" + (ix + 1) + "]" : "";
		s = n.tagName.toLowerCase() + sfx + (s == "" ? "" : ("/" + s));
		n = p;
	}
	return "/" + s;
}
Opkey.prototype.prepareADs = function () {
	this.addAD({
		tag: "RECT",
		type: null,
		event: "click",
		name: "_svg_rect",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "TSPAN",
		type: null,
		event: "click",
		name: "_svg_tspan",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "CIRCLE",
		type: null,
		event: "click",
		name: "_svg_circle",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "ELLIPSE",
		type: null,
		event: "click",
		name: "_svg_ellipse",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "POLYGON",
		type: null,
		event: "click",
		name: "_svg_polygon",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "POLYLINE",
		type: null,
		event: "click",
		name: "_svg_polyline",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "PATH",
		type: null,
		event: "click",
		name: "_svg_path",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "TEXT",
		type: null,
		event: "click",
		name: "_svg_text",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "VIDEO",
		type: null,
		event: "click",
		name: "_svg_text",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "IMAGE",
		type: null,
		event: "click",
		name: "_svg_image",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: ""
	});


	this.addAD({
		tag: "TABLE",
		type: null,
		event: "click",
		name: "_table",
		attributes: ["id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "TBODY",
		type: null,
		event: "click",
		name: "_tableBody",
		attributes: ["id", "className", "index"],
		action: null,
		value: "sahiText"
	});
	this.addAD({
		tag: "TR",
		type: null,
		event: "click",
		name: "_row",
		attributes: ["id", "className", "sahiText", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "TD",
		type: null,
		event: "click",
		name: "_cell",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		idOnly: true,
		value: "sahiText"
	});
	this.addAD({
		tag: "TH",
		type: null,
		event: "click",
		name: "_tableHeader",
		attributes: ["sahiText", "id", "className"],
		action: "click",
		value: "sahiText"
	});

	this.addAD({
		tag: "ARTICLE",
		type: null,
		event: "click",
		name: "_span",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "FIGURE",
		type: null,
		event: "click",
		name: "_span",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});

	this.addAD({
		tag: "SPAN",
		type: null,
		event: "click",
		name: "_span",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "DIV",
		type: null,
		event: "click",
		name: "_div",
		attributes: ["id", "className", "index"],
		action: "click",
		value: null
	});

	this.addAD({
		tag: "A",
		type: null,
		event: "mouseup__xxSAHIDIVIDERxx__blur",
		name: "_link",
		attributes: ["sahiText", "title|alt", "id", "index", "href", "className"],
		action: "click",
		value: "sahiText"
	});

	this.addAD({
		tag: "U",
		type: null,
		event: "click",
		name: "_u",
		attributes: ["sahiText", "title|alt", "id", "index", "href", "className"],
		action: "click",
		value: "sahiText"
	});

	this.addAD({
		tag: "SVG",
		type: null,
		event: "click",
		name: "_svg",
		attributes: ["id", "index"],
		action: "click",
		value: null
	});
	this.addAD({
		tag: "PATH",
		type: null,
		event: "click",
		name: "_path",
		attributes: ["id", "index"],
		action: "click",
		value: null
	});
	this.addAD({
		tag: "G",
		type: null,
		event: "click",
		name: "_g",
		attributes: ["id", "index"],
		action: "click",
		value: null
	});

	this.addAD({
		tag: "svg",
		type: null,
		event: "click",
		name: "_svg",
		attributes: ["id", "index"],
		action: "click",
		value: null
	});
	this.addAD({
		tag: "path",
		type: null,
		event: "click",
		name: "_path",
		attributes: ["id", "index"],
		action: "click",
		value: null
	});
	this.addAD({
		tag: "g",
		type: null,
		event: "click",
		name: "_g",
		attributes: ["id", "index"],
		action: "click",
		value: null
	});

	this.addAD({
		tag: "IMG",
		type: null,
		event: "click",
		name: "_image",
		attributes: ["sahiText", "title|alt", "id",
			this.getFileFromURL, "index", "className"
		],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "IMG",
		type: null,
		event: "mouseup",
		name: "_image",
		attributes: ["sahiText", "title|alt", "id",
			this.getFileFromURL, "index", "className"
		],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "LABEL",
		type: null,
		event: "click",
		name: "_label",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "LI",
		type: null,
		event: "click",
		name: "_listItem",
		attributes: ["sahiText", "title|alt", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "UL",
		type: null,
		event: "click",
		name: "_list",
		attributes: ["id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "OL",
		type: null,
		event: "click",
		name: "_list",
		attributes: ["id", "className", "index"],
		action: "click",
		value: "sahiText"
	});


	this.addAD({
		tag: "INPUT",
		type: "file",
		event: "mouseup",
		name: "_file",
		attributes: ["value", "name", "id", "index", "className"],
		action: "click",
		value: "value"
	});
	this.addAD({
		tag: "INPUT",
		type: "button",
		event: "mouseup",
		name: "_button",
		attributes: ["value", "name", "id", "index", "className"],
		action: "click",
		value: "value"
	});
	// this.addAD({tag: "BUTTON", type: "button", event:"click", name:
	// "_button", attributes: ["sahiText", "name", "id", "className", "index"],
	// action: "click", value: "sahiText"});

	this.addAD({
		tag: "BUTTON",
		type: "button",
		event: "mouseup",
		name: "_button",
		attributes: ["sahiText", "name", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});

	this.addAD({
		tag: "INPUT",
		type: "checkbox",
		event: "mouseup",
		name: "_checkbox",
		attributes: ["name", "id", "value", "className", "index"],
		action: "click",
		value: "checked",
		assertions: function (value) {
			return [("true" == ("" + value)) ? _opkey.language.ASSERT_CHECKED : _opkey.language.ASSERT_NOT_CHECKED];
		}
	});
	this.addAD({
		tag: "INPUT",
		type: "password",
		event: "change",
		name: "_password",
		attributes: ["name", "id", "index", "className"],
		action: "_setValue",
		value: "value"
	});
	this.addAD({
		tag: "INPUT",
		type: "radio",
		event: "mouseup",
		name: "_radio",
		attributes: ["id", "name", "value", "className", "index"],
		action: "click",
		value: "checked",
		assertions: function (value) {
			return [("true" == ("" + value)) ? _opkey.language.ASSERT_CHECKED : _opkey.language.ASSERT_NOT_CHECKED];
		}
	});
	this.addAD({
		tag: "MD-RADIO-BUTTON",
		type: "null",
		event: "click",
		name: "_radio",
		attributes: ["id", "name", "value", "className", "index"],
		action: "click",
		value: "checked",
		assertions: function (value) {
			return [("true" == ("" + value)) ? _opkey.language.ASSERT_CHECKED : _opkey.language.ASSERT_NOT_CHECKED];
		}
	});
	this.addAD({
		tag: "INPUT",
		type: "submit",
		event: "mouseup",
		name: "_submit",
		attributes: ["value", "name", "id", "className", "index"],
		action: "click",
		value: "value"
	});
	this.addAD({
		tag: "BUTTON",
		type: "submit",
		event: "mouseup",
		name: "_submit",
		attributes: ["sahiText", "name", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});

	this.addAD({
		tag: "INPUT",
		type: "text",
		event: "change",
		name: "_textbox",
		attributes: ["name", "id", "index", "className"],
		action: "_setValue",
		value: "value"
	});
	this.addAD({
		tag: "BODY",
		type: null,
		event: "change",
		name: "_body",
		attributes: ["name", "id", "index", "className"],
		action: "click",
		value: "value"
	});
	this.addAD({
		tag: "DATE",
		type: null,
		event: "click",
		name: "_textbox",
		attributes: ["name", "id", "index", "className"],
		action: "_setValue",
		value: "value"
	});

	this.addAD({
		tag: "INPUT",
		type: "reset",
		event: "mouseup",
		name: "_reset",
		attributes: ["value", "name", "id", "className", "index"],
		action: "click",
		value: "value"
	});
	this.addAD({
		tag: "BUTTON",
		type: "reset",
		event: "mouseup",
		name: "_reset",
		attributes: ["sahiText", "name", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});

	this.addAD({
		tag: "INPUT",
		type: "hidden",
		event: "",
		name: "_hidden",
		attributes: ["name", "id", "className", "index"],
		action: "_setValue",
		value: "value"
	});

	this.addAD({
		tag: "INPUT",
		type: "file",
		event: "click",
		name: "_file",
		attributes: ["name", "id", "index", "className"],
		action: "_setFile",
		value: "value"
	});
	this.addAD({
		tag: "INPUT",
		type: "image",
		event: "mouseup",
		name: "_imageSubmitButton",
		attributes: ["title|alt", "name", "id",
			this.getFileFromURL, "index", "className"
		],
		action: "click"
	});
	this.addAD({
		tag: "INPUT",
		type: "date",
		event: "change",
		name: "_datebox",
		attributes: ["name", "id", "index", "className"],
		action: "_setValue",
		value: "value"
	});
	this.addAD({
		tag: "INPUT",
		type: "datetime",
		event: "change",
		name: "_datetimebox",
		attributes: ["name", "id", "index", "className"],
		action: "_setValue",
		value: "value"
	});
	this.addAD({
		tag: "INPUT",
		type: "datetime-local",
		event: "change",
		name: "_datetimelocalbox",
		attributes: ["name", "id", "index", "className"],
		action: "_setValue",
		value: "value"
	});
	this.addAD({
		tag: "INPUT",
		type: "email",
		event: "change",
		name: "_emailbox",
		attributes: ["name", "id", "index", "className"],
		action: "_setValue",
		value: "value"
	});
	this.addAD({
		tag: "INPUT",
		type: "month",
		event: "change",
		name: "_monthbox",
		attributes: ["name", "id", "index", "className"],
		action: "_setValue",
		value: "value"
	});
	this.addAD({
		tag: "INPUT",
		type: "number",
		event: "change",
		name: "_numberbox",
		attributes: ["name", "id", "index", "className"],
		action: "_setValue",
		value: "value"
	});
	this.addAD({
		tag: "INPUT",
		type: "range",
		event: "change",
		name: "_rangebox",
		attributes: ["name", "id", "index", "className"],
		action: "_setValue",
		value: "value"
	});
	this.addAD({
		tag: "INPUT",
		type: "search",
		event: "change",
		name: "_searchbox",
		attributes: ["name", "id", "index", "className"],
		action: "_setValue",
		value: "value"
	});
	this.addAD({
		tag: "INPUT",
		type: "tel",
		event: "change",
		name: "_telephonebox",
		attributes: ["name", "id", "index", "className"],
		action: "_setValue",
		value: "value"
	});
	this.addAD({
		tag: "INPUT",
		type: "time",
		event: "change",
		name: "_timebox",
		attributes: ["name", "id", "index", "className"],
		action: "_setValue",
		value: "value"
	});
	this.addAD({
		tag: "INPUT",
		type: "url",
		event: "change",
		name: "_urlbox",
		attributes: ["name", "id", "index", "className"],
		action: "_setValue",
		value: "value"
	});
	this.addAD({
		tag: "INPUT",
		type: "week",
		event: "change",
		name: "_weekbox",
		attributes: ["name", "id", "index", "className"],
		action: "_setValue",
		value: "value"
	});
	this.addAD({
		tag: "FIELDSET",
		type: null,
		event: "",
		name: "_fieldset",
		attributes: ["name", "id", "className", this.getAssociatedLegendName, "index", "disabled"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "IFRAME",
		type: null,
		event: "",
		name: "_iframe",
		attributes: ["id", "name", "className", "index"],
		action: "",
		value: ""
	});
	this.addAD({
		tag: "FRAME",
		type: null,
		event: "",
		name: "_frame",
		attributes: ["id", "name", "className", "index"],
		action: "",
		value: ""
	});

	this.addAD({
		tag: "SELECT",
		type: null,
		event: "change",
		name: "_select",
		attributes: ["name", "id", "index", "className"],
		action: "setSelected",
		value: function (el) {
			return _opkey._getSelectedText(el) || _opkey.getOptionId(el, el.value) || el.value;
		},
		assertions: function (value) {
			return [_opkey.language.ASSERT_SELECTION];
		}
	});
	this.addAD({
		tag: "OPTION",
		type: null,
		event: "none",
		name: "_option",
		attributes: ["name", "id", "index", "className"],
		action: "setSelected",
		value: "sahiText"
	});
	this.addAD({
		tag: "TEXTAREA",
		type: null,
		event: "change",
		name: "_textarea",
		attributes: ["name", "id", "index", "className"],
		action: "_setValue",
		value: "value"
	});
	this.addAD({
		tag: "H1",
		type: null,
		event: "click",
		name: "_heading1",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "H2",
		type: null,
		event: "click",
		name: "_heading2",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "H3",
		type: null,
		event: "click",
		name: "_heading3",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "H4",
		type: null,
		event: "click",
		name: "_heading4",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "H5",
		type: null,
		event: "click",
		name: "_heading5",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "H6",
		type: null,
		event: "click",
		name: "_heading6",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});

	this.addAD({
		tag: "AREA",
		type: null,
		event: "click",
		name: "_area",
		attributes: ["id", "title|alt", "href", "shape", "className", "index"],
		action: "click"
	});
	this.addAD({
		tag: "MAP",
		type: null,
		event: "click",
		name: "_map",
		attributes: ["name", "id", "title", "className", "index"],
		action: "click"
	});

	this.addAD({
		tag: "P",
		type: null,
		event: "click",
		name: "_paragraph",
		attributes: ["encaps_A", "id", "className", "sahiText", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "I",
		type: null,
		event: "click",
		name: "_italic",
		attributes: ["encaps_A", "sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "EM",
		type: null,
		event: "click",
		name: "_emphasis",
		attributes: ["encaps_A", "sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "B",
		type: null,
		event: "click",
		name: "_bold",
		attributes: ["encaps_A", "sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "STRONG",
		type: null,
		event: "click",
		name: "_strong",
		attributes: ["encaps_A", "sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "PRE",
		type: null,
		event: "click",
		name: "_preformatted",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "CODE",
		type: null,
		event: "click",
		name: "_code",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "BLOCKQUOTE",
		type: null,
		event: "click",
		name: "_blockquote",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "CANVAS",
		type: null,
		event: "click",
		name: "_canvas",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "ABBR",
		type: null,
		event: "click",
		name: "_abbr",
		attributes: ["encaps_A", "sahiText", "title", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "HR",
		type: null,
		event: "click",
		name: "_hr",
		attributes: ["id", "className", "index"],
		action: "click",
		value: ""
	});
	this.addAD({
		tag: "FONT",
		type: null,
		event: "click",
		name: "_font",
		attributes: ["sahiText", "color", "face", "size"],
		action: "click",
		value: ""
	});
	var o_fn1 = function (o) {
		try {
			return o._opkey_getFlexId();
		} catch (e) { }
	};
	var o_fn2 = function (o) {
		try {
			return o._opkey_getUID();
		} catch (e) { }
	};
	this.addAD({
		tag: "OBJECT",
		type: null,
		event: "click",
		name: "_object",
		attributes: ["id", "name", "data", o_fn1, o_fn2],
		action: "click",
		value: ""
	});
	this.addAD({
		tag: "EMBED",
		type: null,
		event: "click",
		name: "_embed",
		attributes: ["id", "name", o_fn1, o_fn2],
		action: "click",
		value: ""
	});

	this.addAD({
		tag: "DL",
		type: null,
		event: "click",
		name: "_dList",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "DT",
		type: null,
		event: "click",
		name: "_dTerm",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "DD",
		type: null,
		event: "click",
		name: "_dDesc",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
	this.addAD({
		tag: "USE",
		type: null,
		event: "click",
		name: "_use",
		attributes: ["sahiText", "id", "className", "index"],
		action: "click",
		value: "sahiText"
	});
};
Opkey.prototype.getAssertions = function (accs, info) {
	var a = [this.language.ASSERT_EXISTS, this.language.ASSERT_VISIBLE];
	for (var k = 0; k < accs.length; k++) {
		var acc = accs[k];
		if (acc.assertions)
			a = a.concat(acc.assertions(info.value));
	}
	if (info.valueType == "sahiText") {
		a[a.length] = this.language.ASSERT_EQUAL_TEXT;
		a[a.length] = this.language.ASSERT_CONTAINS_TEXT;
	} else if (info.valueType == "value") {
		a[a.length] = this.language.ASSERT_EQUAL_VALUE;
	}
	return a;
};
var sahiLanguage = {
	ASSERT_EXISTS: "<popup>_assertExists(<accessor>);",
	ASSERT_VISIBLE: "<popup>_assert(_isVisible(<accessor>));",
	ASSERT_EQUAL_TEXT: "<popup>_assertEqual(<value>, _getText(<accessor>));",
	ASSERT_CONTAINS_TEXT: "<popup>_assertContainsText(<value>, <accessor>);",
	ASSERT_EQUAL_VALUE: "<popup>_assertEqual(<value>, _getValue(<accessor>));",
	ASSERT_SELECTION: "<popup>_assertEqual(<value>, _getSelectedText(<accessor>));",
	ASSERT_CHECKED: "<popup>_assert(<accessor>.checked);",
	ASSERT_NOT_CHECKED: "<popup>_assertNotTrue(<accessor>.checked);",
	POPUP: "_popup(<window_name>).",
	DOMAIN: "_domain(<domain>)."
};
_opkey.language = sahiLanguage;
/** id end * */
_opkey.init();
/** Selenium start * */
Opkey.prototype._bySeleniumLocator = function (locator, popupTarget, frameTarget) {
	if (locator.indexOf("//") == 0) return this._byXPath(locator);
	else if (locator.indexOf("xpath=") == 0) return this._byXPath(locator.replace("xpath=", ""));
	else {
		var selenium = new BrowserBot(this.top());
		if (popupTarget != ("" || "undefined" || "null" || null)) selenium.selectWindow(popupTarget);
		else if (frameTarget != ("" || "undefined" || "null" || null)) selenium.selectFrame(frameTarget);
		return selenium.findElementOrNull(locator);
	}
	// else if (locator.indexOf("document") == 0) return
	// this._accessor(locator);
	// else if (locator.indexOf("link=") == 0) return
	// this._link(locator.replace("link=", ""));
	// else return this._byId(locator) || this.byName(locator, "*");
}

Opkey.prototype._doSeleniumSelect = function (selectLocator, optionLocator, append) {
	var optionItem = new OptionLocatorFactory();
	var selectItem = this._bySeleniumLocator(selectLocator);
	this._setSelected(selectItem, optionItem.fromLocatorString(optionLocator).findOption(selectItem).index, append);
}

/** Selenium end * */
Opkey.prototype.loadXPathScript = function () {
	if (this._isFF() || this._isHTMLUnit()) return false;
	if (!(document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("XPath", null))) {
		this.loadScript('/_s_/spr/ext/javascript-xpath/javascript-xpath.js', "_opkey_concat");
	}
}
Opkey.prototype.loadScript = function (src, id) {
	var newcontent = document.createElement('script');
	newcontent.src = src;
	var bef = document.getElementById(id);
	bef.parentNode.insertBefore(newcontent, bef);
}
// document.body.onclick = function(){alert(window.event.clientX + " " +
// window.event.clientY)}
Opkey.prototype.setLastHTMLSnapShotFile = function (filePath) {
	try {
		var $htmlUnitViewer = new Packages.com.pushtotest.sahi.OpkeyHTMLUnit();
		if ($htmlUnitViewer) {
			if (filePath) {
				var $file = new Packages.java.io.File(filePath);
				filePath = $htmlUnitViewer.takeSnapShot($file);
			}
		}
	} catch (e) { }
}

// __opkeyDebug__("concat.js: end");

/** Pro start * */
Opkey.prototype.setAnchor = function (s) {
	this.anchorStr = s;
	try {
		this.anchor = eval(this.addOpkey(s));
	} catch (e) { }
};
Opkey.prototype.removeAnchor = function () {
	this.anchorStr = null;
	this.anchor = null;
}
/** Flex start * */
Opkey.prototype.isFlexObj = function (el) {
	try {
		return el.isSFL;
	} catch (e) {
		return false;
	}
}

function isOpkeyAvailable() {
	return true;
}

function SflWrapper(o) {
	this.isSFL = true;
	this.object = o;
	this.id = o._opkey_getFlexId();
	this.accessorAPINames = new Array();
	this.addAccessorFns();

}
__fl_debugStr = "";
SflWrapper.prototype.debug = function (s) {
	// //_opkey._debug(s);
	return;
	__fl_debugStr += "\n" + s;
	_opkey.showStepsInController(__fl_debugStr);
}
SflWrapper.prototype.display = function (s) {
	var val = "";
	if (typeof _opkey == "object") {
		var ar = eval("(" + s + ")");
		var alts = [];
		for (var i = 0; i < ar.length; i++) {
			var item = ar[i];
			alts.push(SflWrapper.convertToFn(item));
		}
		_opkey.sendIdentifierInfo(alts,
			alts[0],
			ar[0].value,
			"", []);
	}
}
SflWrapper.prototype.record = function (elJSON, action, value) {
	if (action == "click") value = null;
	if (typeof _opkey == "object") {
		var s = SflWrapper.convertToFn(elJSON);
		if (_opkey.isRecording()) {
			_opkey.recordStep(this.getStep(action, s, value));
		}
	}
}
SflWrapper.prototype.getStep = function (action, accessorS, value) {
	return "_" + action + "(" + accessorS + (value ? (", " + value) : "") + ");";
}
SflWrapper.prototype.exists = function () {
	return this.fetch("constructor") != "Error:null_object";
}
SflWrapper.prototype.isVisible = function () {
	if (!this.exists()) return false;
	try {
		return this.get("visible") == "true";
	} catch (e) {
		return false;
	}
}
SflWrapper.prototype.xgetFlexApp = function (id) {
	if (navigator.appName.indexOf("Microsoft") != -1) return window[id];
	return document[id];
}
SflWrapper.prototype.addAccessorFns = function () {
	var actionMethodNames = ["click", "mouseDown", "mouseOver", "mouseUp", "dragDrop", "dragDropXY", "setAsDroppable",
		"setValue", "choose", "listProperties",
		"introspect", "fetch", "executeFn",
		"set", "get", "highlight", "getValue",
		"getText", "getRowNo", "getColumnNo", "getGridData",
		"getTextOrToolTip", "getDataProviderData",
		"rightClick", "doubleClick"
	];
	for (var i = 0; i < actionMethodNames.length; i++) {
		var methodName = actionMethodNames[i];
		this[methodName] = this.getFlexFn(methodName, true);
	}
}
SflWrapper.prototype.getFlexFn = function (methodName, isAction) {
	return function () {
		var ar = new Array();
		if (this.command) ar[0] = this.command;
		for (var i = 0; i < arguments.length; i++) {
			ar[ar.length] = arguments[i];
		}
		var command = {
			api: methodName,
			args: ar
		};
		// _opkey._alert(_opkey.toJSON(command));
		if (isAction) {
			var s = this.object._opkey_eval(command);
			if (s && (typeof s == "string") && s.indexOf("SAHI_FLEX_ERROR") == 0) throw new Error(s);
			return s;
		} else {
			this.command = command;
			return this;
		}
	}
}
/*
 * SflWrapper.prototype.getAPIObj = function(apiName, args){ if
 * (_opkey.isArray(args)) args = [args]; return {api:apiName, args:args}; }
 */
SflWrapper.convertToFn = function (s) {
	var o = (typeof s == "string") ? eval("(" + s + ")") : s;
	return '_flex("' + o.objectId + '").' + o.api + '(' + _opkey.toJSON(o.args[0]) + ')';
}
SflWrapper.prototype.addMetaData = function (metadata) {
	if (!metadata.apiName) metadata.apiName = this.getAccessorAPIName(metadata.qn);
	SflWrapper.prototype[metadata.apiName] = this.getFlexFn(metadata.apiName);
	this.object._opkey_addMetaData(metadata);
}
SflWrapper.prototype.find = function (type, identifier) {
	return this[type](identifier);
}
SflWrapper.prototype.getAccessorAPIName = function (qn) {
	var ix = qn.indexOf("::");
	if (ix != -1) {
		var a = qn.substring(ix + 2).toLowerCase();
		return (qn.indexOf("spark") == 0) ? ("s_" + a) : a;
	}
	return qn;
}

SflWrapper.prototype.addAllRecorderListeners = function () {
	this.object._opkey_addAllRecorderListeners();
}
SflWrapper.prototype.near = function (nearObj) {
	this.command.args[0] = {
		id: this.command.args[0],
		near: nearObj.command
	};
	return this;
}
SflWrapper.prototype.inside = function (inObj) {
	this.command.args[0] = {
		id: this.command.args[0],
		inside: inObj.command
	};
	return this;
}
SflWrapper.prototype.getData = function () {
	return eval("(" + this.getDataProviderData().replace(/[\r\n]/g, "") + ")");
}
SflWrapper.prototype.currentCursorID = function () {
	return this.object._opkey_currentCursorID();
}
SflWrapper.prototype.addAllMetaData = function () {
	// this.addMetaData({qn: "mx.core::UIComponent", attributes: ["label",
	// "text", "name", "automationName", "toolTip", "id", "autoGeneratedName",
	// "index"], action: "click", value: "label"});
	this.addMetaData({
		qn: "mx.core::UITextField",
		attributes: ["encaps_mx.controls::DateField", "encaps_mx.controls::DateChooser", "encaps_mx.controls::ComboBox",
			"encaps_mx.controls::TextInput", "encaps_mx.controls::TextArea",
			"label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"
		],
		action: "",
		value: "text"
	});

	this.addMetaData({
		qn: "mx.controls::AdvancedDataGrid",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::AdvancedDataGridBaseEx",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::AdvancedDataGridGroupItemRenderer",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::Alert",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::Button",
		attributes: ["encaps_mx.controls::ColorPicker", "encaps_mx.controls::DateField", "encaps_mx.controls::ComboBox", "label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::ButtonBar",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::ButtonLabelPlacement",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::CheckBox",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "selected"
	});
	this.addMetaData({
		qn: "mx.controls::ColorPicker",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setValue",
		value: "selectedColor"
	});
	this.addMetaData({
		qn: "mx.controls::ComboBase",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::ComboBox",
		attributes: ["label", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setSelected",
		value: "selectedItemLabel"
	});
	this.addMetaData({
		qn: "mx.controls::DataGrid",
		attributes: ["encaps_spark.components::PopUpAnchor", "label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls.dataGridClasses::DataGridHeader",
		attributes: ["text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "text"
	});
	this.addMetaData({
		qn: "mx.controls.dataGridClasses::DataGridColumn",
		attributes: ["headerText", "dataField", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "text"
	});
	this.addMetaData({
		qn: "mx.controls.dataGridClasses::DataGridItemRenderer",
		attributes: ["text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "text"
	});
	this.addMetaData({
		qn: "mx.controls::DateChooser",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setValue",
		value: "selectedDate"
	});
	this.addMetaData({
		qn: "mx.controls::DateField",
		attributes: ["label", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setValue",
		value: "selectedDate"
	});
	this.addMetaData({
		qn: "mx.controls::FileSystemComboBox",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::FileSystemDataGrid",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::FileSystemEnumerationMode",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::FileSystemHistoryButton",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::FileSystemList",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::FileSystemSizeDisplayMode",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::FileSystemTree",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::FlexNativeMenu",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::FormItemLabel",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::HorizontalList",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::HRule",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::HScrollBar",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::HSlider",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setValue",
		value: "sliderValue"
	});
	this.addMetaData({
		qn: "mx.controls::HTML",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::Image",
		attributes: ["text", "name", "content", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "toolTip"
	});
	this.addMetaData({
		qn: "mx.controls::Label",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "",
		value: "text"
	});
	this.addMetaData({
		qn: "mx.controls::LinkBar",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::LinkButton",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::List",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::Menu",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::MenuBar",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls.menuClasses::MenuBarItem",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::MXFTETextInput",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::NavBar",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::NumericStepper",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setValue",
		value: "value"
	});
	this.addMetaData({
		qn: "mx.controls::OLAPDataGrid",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::PopUpButton",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::PopUpMenuButton",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::ProgressBar",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::ProgressBarDirection",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::ProgressBarLabelPlacement",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::ProgressBarMode",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::RadioButton",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::RadioButtonGroup",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::RichTextEditor",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::Spacer",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::SWFLoader",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::TabBar",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::Text",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "text"
	});
	this.addMetaData({
		qn: "mx.controls::TextArea",
		attributes: ["label", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setValue",
		value: "text"
	});
	this.addMetaData({
		qn: "mx.controls::TextInput",
		attributes: ["encaps_mx.controls::DateField", "label", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setValue",
		value: "text"
	});
	this.addMetaData({
		qn: "mx.controls::TileList",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::ToggleButtonBar",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::ToolTip",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::Tree",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::VideoDisplay",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::VRule",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::VScrollBar",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls::VSlider",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setValue",
		value: "sliderValue"
	});
	this.addMetaData({
		qn: "mx.controls.scrollClasses::ScrollThumb",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});

	this.addMetaData({
		qn: "mx.charts::PieChart",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.charts.series::PieSeries",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.charts.renderers::WedgeItemRenderer",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.charts.series::ColumnSet",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.charts.series::ColumnSeries",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});

	// move this to user_ext.js
	this.addMetaData({
		qn: "siteAnalysis.view.components::SiteColumnChart",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "categoryAnalysis.view.components::CategoryColumnChart",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});


	this.addMetaData({
		qn: "mx.controls.listClasses::ListItemRenderer",
		attributes: ["data", "label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "data"
	});
	this.addMetaData({
		qn: "mx.controls.listClasses::ListBaseContentHolder",
		attributes: ["text", "data", "label", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "data"
	});
	this.addMetaData({
		qn: "mx.controls.listClasses::AdvancedListBaseContentHolder",
		attributes: ["text", "data", "label", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "data"
	});
	this.addMetaData({
		qn: "mx.controls.tabBarClasses::Tab",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls.buttonBarClasses::ButtonBarButton",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls.sliderClasses::SliderLabel",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.controls.sliderClasses::SliderThumb",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});

	this.addMetaData({
		qn: "mx.containers::Accordion",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::ApplicationControlBar",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::Box",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::BoxDirection",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::Canvas",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::ControlBar",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::DividedBox",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::Form",
		attributes: ["encaps_spark.components::PopUpAnchor", "label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::FormHeading",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::FormItem",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::FormItemDirection",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::Grid",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::GridItem",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::GridRow",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::HBox",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::HDividedBox",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::Panel",
		attributes: ["title", "label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::TabNavigator",
		attributes: ["spark.components::NavigatorContent", "label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::Tile",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::TileDirection",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::TitleWindow",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::VBox",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::VDividedBox",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.containers::ViewStack",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "mx.charts::ColumnChart",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});

	// Spark Components Start
	this.addMetaData({
		qn: "spark.components::Panel",
		attributes: ["title", "label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::Label",
		attributes: ["encaps_spark.components::FormItem", "encaps_spark.components::DropDownList", "encaps_spark.components::ComboBox", "encaps_spark.components::FormHeading", "label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "",
		value: "text"
	});
	this.addMetaData({
		qn: "spark.components::TextInput",
		attributes: ["encaps_spark.components::FormItem", "encaps_spark.components::NumericStepper", "label", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setValue",
		value: "text"
	});
	this.addMetaData({
		qn: "spark.components::Button",
		attributes: ["encaps_spark.components::FormItem", "encaps_spark.components::Spinner", "encaps_spark.components::VScrollBar", "encaps_spark.components::HScrollBar", "encaps_spark.components::VSlider", "encaps_spark.components::HSlider",
			"encaps_spark.components::DropDownList", "encaps_spark.components::NumericStepper", "encaps_spark.components::ComboBox",
			"label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"
		],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::HSlider",
		attributes: ["encaps_spark.components::VGroup", "label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setValue",
		value: "value"
	});
	this.addMetaData({
		qn: "spark.components::VSlider",
		attributes: ["encaps_spark.components::VGroup", "label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setValue",
		value: "value"
	});
	this.addMetaData({
		qn: "spark.components::DropDownList",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setSelected",
		value: "selectedItemLabel"
	});
	this.addMetaData({
		qn: "spark.components::NumericStepper",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setValue",
		value: "value"
	});
	this.addMetaData({
		qn: "spark.components::CheckBox",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "selected"
	});
	// this.addMetaData({qn: "mx.controls::Text", attributes: ["label", "text",
	// "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
	// action: "click", value: "text"});
	// this.addMetaData({qn: "mx.controls::TextArea", attributes: ["label",
	// "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
	// action: "setValue", value: "text"});

	// Theeran Start
	this.addMetaData({
		qn: "spark.components::TextArea",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setValue",
		value: "name"
	});
	this.addMetaData({
		qn: "spark.components::ButtonBar",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::ButtonBarButton",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::CheckBox",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "selected"
	});
	this.addMetaData({
		qn: "spark.components::ComboBox",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setSelected",
		value: "selectedItemLabel"
	});
	this.addMetaData({
		qn: "spark.components::DataGroup",
		attributes: ["encaps_spark.components::Label", "encaps_spark.components::List", "encaps_spark.components::ButtonBar", "encaps_spark.components::TabBar", "label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::DropDownList",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setSelected",
		value: "selectedItemLabel"
	});
	// this.addMetaData({qn: "spark.components::Group", attributes:
	// ["encaps_spark.components::Form","encaps_spark.components::DataGrid","encaps_spark.components::VideoPlayer","encaps_spark.components::TitleWindow","encaps_spark.components::RichText","encaps_spark.components::VScrollBar","encaps_spark.components::TextArea","encaps_spark.components::NavigatorContent","encaps_spark.components::PopUpAnchor","label",
	// "text", "name", "automationName", "toolTip", "id", "autoGeneratedName",
	// "index"], action: "click", value: "label"});
	// this.addMetaData({qn: "spark.components::HGroup", attributes:
	// ["encaps_spark.components::VScrollBar","label", "text", "name",
	// "automationName", "toolTip", "id", "autoGeneratedName", "index"], action:
	// "click", value: "name"});
	// this.addMetaData({qn: "spark.components::VGroup", attributes:
	// ["encaps_spark.components::DataGrid","encaps_spark.components::HSlider","encaps_spark.components::HSrollBar","encaps_spark.components::NumericStepper","label",
	// "text", "name", "automationName", "toolTip", "id", "autoGeneratedName",
	// "index"], action: "click", value: "name"});
	this.addMetaData({
		qn: "spark.components::HScrollBar",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "change",
		value: "value"
	});
	this.addMetaData({
		qn: "spark.components::HSlider",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "change",
		value: "value"
	});
	this.addMetaData({
		qn: "spark.components::List",
		attributes: ["encaps_spark.components::Label", "label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setSelected",
		value: "selectedItem"
	});
	this.addMetaData({
		qn: "spark.components::NavigatorContent",
		attributes: ["encaps_spark.components::Label", "label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::NumericStepper",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "value"
	});
	this.addMetaData({
		qn: "spark.components::PopUpAnchor",
		attributes: ["title", "label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "",
		value: ""
	});
	this.addMetaData({
		qn: "spark.components::RadioButton",
		attributes: ["encaps_spark.components::RadioButtonGroup", "label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::TextArea",
		attributes: ["label", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setValue",
		value: "text"
	});
	this.addMetaData({
		qn: "spark.components::VScrollBar",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "change",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::RadioButtonGroup",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::RichEditableText",
		attributes: ["encaps_spark.components::TextArea", "encaps_spark.components::TextInput", "label", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setValue",
		value: "text"
	});
	// this.addMetaData({qn: "spark.components::Scroller", attributes: ["label",
	// "text", "name", "automationName", "toolTip", "id", "autoGeneratedName",
	// "index"], action: "click", value: "value"});
	this.addMetaData({
		qn: "spark.components::Spinner",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "value"
	});
	this.addMetaData({
		qn: "spark.components::TabBar",
		attributes: ["label", "text", "name", "automationName", "tool-Tip", "id", "autoGeneratedName", "index"],
		action: "change",
		value: "selectedItem"
	});
	this.addMetaData({
		qn: "spark.components::TileGroup",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::TitleWindow",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::ToggleButton",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::VideoDisplay",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::VideoPlayer",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::PopUpAnchor",
		attributes: ["title", "label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "",
		value: ""
	});
	this.addMetaData({
		qn: "spark.components::RadioButtonGroup",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::RichText",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "setValue",
		value: "text"
	});
	this.addMetaData({
		qn: "spark.components::TileGroup",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::DataGrid",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::DataItem",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::Form",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::FormHeading",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::FormItem",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components.gridClasses::GridColumn",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "dataField"
	});
	this.addMetaData({
		qn: "spark.components::Grid",
		attributes: ["encaps_spark.components::DataItem", "label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::GridColumnHeaderGroup",
		attributes: ["label", "text", "name", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "label"
	});
	this.addMetaData({
		qn: "spark.components::Image",
		attributes: ["text", "name", "content", "automationName", "toolTip", "id", "autoGeneratedName", "index"],
		action: "click",
		value: "toolTip"
	});

	// Theeran End
	// Spark Components End
	SflWrapper.prototype.cell = this.getFlexFn("cell");

	this.addCustomMetaData();
}
Opkey.prototype.getFlexWrapper = function (o) {
	var win = this.getWindow(o);
	var t = win.SflWrapper;
	return new t(o);
}
Opkey.prototype._flex = function (id) {
	var o = this._embed(id) || this._object(id);
	return this.getFlexWrapper(o);
}
Opkey.prototype._findFlexElement = function (fl, api, id, rel) {
	var el = fl[api](id);
	if (rel && rel.type == "dom") {
		if (rel.relation == "_in") return el.inside(rel.element);
		if (rel.relation == "_near") return el.near(rel.element);
	}
	return el;
}
Opkey.prototype._sfl_executeFn = function (el, fnName) {
	return el.executeFn.apply(el, this.getArgsAr(arguments, 1));
}
Opkey.prototype._sfl_set = function (el, key, value) {
	return el.set(key, value);
}
Opkey.prototype._sfl_get = function (el, key) {
	return el.get(key);
}
Opkey.prototype._sfl_listProperties = function (el, fn) {
	return el.listProperties();
}
Opkey.prototype._sfl_introspect = function (el) {
	return el.introspect();
}
Opkey.prototype._sfl_getGridData = function (el) {
	return el.getGridData();
}
Opkey.prototype._sfl_getData = function (el) {
	return el.getData();
}
Opkey.prototype.setMyFlexId = function (uid) {
	try {
		var o = this._embed(uid) || this._object(uid);
		// alert(uid + " " + o);
		if (!o) return null;
		var flexId = (!this.isBlankOrNull(o.id)) ? o.id : o.name;
		o._opkey_setFlexId(flexId);
	} catch (e) {
		alert(e);
	}
}
Opkey.prototype.isApplet = function () {
	return false;
}
/** Flex end * */



/** Pro end * */
/*
 * // Event listener listening code var __old_addEvLis =
 * HTMLInputElement.prototype.addEventListener;
 * HTMLInputElement.prototype.addEventListener = function(type, listener,
 * useCapture){ //_opkey._debug(type + " " + this.id + " " + listener);
 * __old_addEvLis.apply(this, arguments); }
 */


if (window.self === window.top) {
	_opkey.RuntimeMessageGatherer();
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

	eventer(messageEvent, function (e) {
		var key = e.message ? "message" : "data";
		var data = e[key];
		try {
			if (data == "loaded" || data.indexOf("Loaded") > -1 || data.indexOf("loaded") > -1) {
				_opkey.RuntimeMessageGatherer();
				var framesInsideLength = window.frames.length;
				for (var i = 0; i < framesInsideLength; i++) {
					var framesElement = _opkey._iframe(i) ? _opkey._iframe(i) : _opkey._frame(i);
					var framesType = _opkey._iframe(i) ? "iframe" : "frame";
					var src = framesElement.src;
					var id = framesElement.id;
					var name = framesElement.name;
					var _x = 0;
					var _y = 0;
					try {
						var _rect = framesElement.getBoundingClientRect();
						_x = _rect.left;
						_y = _rect.top;
					} catch (e) { }
					framesElement.contentWindow.postMessage("{\"parentTitle\":\"" + _opkey.getTitle() + "\",\"framesType\":\"" + framesType + "\",\"parentURL\":\"" + _opkey.getURL() + "\",\"id\":\"" + id + "\", \"src\":\"" + src + "\", \"name\":\"" + name + "\", \"opkeyindex\":\"" + i + "\" , \"x\":\"" + _x + "\" , \"y\":\"" + _y + "\"}", "*");
				}
			}
		} catch (e) { }
	}, false);
} else {
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
	eventer(messageEvent, function (e) {
		var key = e.message ? "message" : "data";
		var data = e[key];
		// console.log("Data is " + data)
		try {
			if (data == "loaded" || data.indexOf("Loaded") > -1 || data.indexOf("loaded") > -1) {
				var framesInsideLength = window.frames.length;
				for (var i = 0; i < framesInsideLength; i++) {
					var framesElement = _opkey._iframe(i) ? _opkey._iframe(i) : _opkey._frame(i);
					var framesType = _opkey._iframe(i) ? "iframe" : "frame";
					var src = framesElement.src;
					var id = framesElement.id;
					var name = framesElement.name;
					var _x = 0;
					var _y = 0;
					try {
						var _rect = framesElement.getBoundingClientRect();
						_x = _rect.left;
						_y = _rect.top;
					} catch (e) { }
					framesElement.contentWindow.postMessage("{\"parentTitle\":\"" + _opkey.currentIframeDetails.parentTitle + "\",\"framesType\":\"" + framesType + "\",\"parentURL\":\"" + _opkey.currentIframeDetails.parentURL + "\",\"id\":\"" + id + "\", \"src\":\"" + src + "\", \"name\":\"" + name + "\", \"opkeyindex\":\"" + i + "\", \"x\":\"" + _x + "\", \"y\":\"" + _y + "\"}", "*");
				}
			} else {
				try {
					if (data.indexOf("parentTitle") > -1) {
						try {
							_opkey.currentIframeDetails = eval(data);
						} catch (e) {
							data = data.substring(1, data.length - 1)
							_opkey.currentIframeDetails = JSON.parse(data);
						}
					}
				} catch (e) { }
			}
		} catch (e) { }
	}, false);
	if (!(window.location.href.includes("force.com") && window.location.href.includes("-sf") || window.location.href.includes("oraclecloud.com"))) {
		_opkey.addEvent(document, "load", function () {
			window.parent.postMessage("{\"state\":\"loaded\"}", "*");
		});
	}
	else {
		console.log("here 123334444444444444");
		_opkey.addEvent(document, "load", function () {
			//commented for salesforce error fixes need to fix
			try {
				window.onmessage = (event) => {
					console.log("EVENT DATA IS ::::" + event.data);
					//HERE WINDOW PARENT MESSAGE IS INTERFERING  WITH THE MESSAGE WHICH ARE DOING INTERACTION WITHIN SALESFORCE
					if (event.data == null && event.data == undefined) {
						window.parent.postMessage("{\"state\":\"loaded\"}", "*");
					}
				};
			} catch (e) { }
		});
	}
}

chrome.runtime.sendMessage({
	SetRecordingPageChanged: "SetRecordingPageChanged"
}, function (response) {
	if (chrome.runtime.lastError) { }
});

