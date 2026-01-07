/** -- Java Recorder Start -- **/
if (_sahi.controllerMode == "java"){
	_sahi.controllerURL = "/_s_/spr/controllertw.htm";
	_sahi.controllerHeight = 250;
	_sahi.controllerWidth = 420;
	_sahi.recorderClass = "StepWiseRecorder";
	Sahi.prototype.getExpectPromptScript = function(s, retVal){
		return "browser." + this.getPopupDomainPrefixes() + "expectPrompt(" + this.quotedEscapeValue(s) + ", " + this.quotedEscapeValue(retVal) + ")";
	}
	Sahi.prototype.getExpectConfirmScript = function(s, retVal){
		return "browser." + this.getPopupDomainPrefixes() + "expectConfirm(" + this.quotedEscapeValue(s) + ", " + retVal + ")";
	}
	Sahi.prototype.getNavigateToScript = function(url){
		return "browser." + this.getPopupDomainPrefixes() + "navigateTo(" + this.quotedEscapeValue(url) + ");"
	}
	Sahi.prototype.getScript = function (infoAr, el, evType, e) {
		var info = infoAr[0];
	    var accessor = this.escapeDollar(this.getAccessor1(info));
	    if (accessor == null) return null;
	    if (accessor.indexOf("_") == 0) accessor = accessor.substring(1);
	    var ev = info.event;
	    var value = info.value;
	    var type = info.type;
	    var popup = this.getPopupName();
	
	    var cmd = null;
	    if (value == null)
	        value = "";
	 // handle F12 and contextmenu
	    if (evType == "keydown") {
	    	if (e && e.keyCode >= 112 && e.keyCode <= 123 && !e.charCode){
	    		cmd =  accessor + ".keyPress(\"[" + e.keyCode + "," + 0 + "]\");";
	    	}
		    if (!cmd) return null;
	    } else { 
		    if (ev == "_click") {
		    	if (evType && evType.toLowerCase() == "contextmenu") {
		    		cmd = accessor + ".rightClick();";
		    	}
		    	else cmd = accessor + ".click();";
		    } else if (ev == "_setValue") {
		        cmd = accessor + ".setValue(" + this.quotedEscapeValue(value) + ");";
		    } else if (ev == "_setSelected") {
		        cmd = accessor + ".choose(" + this.quotedEscapeValue(value) + ");";
		    } else if (ev == "_setFile") {
		        cmd = accessor + ".setFile(" + this.quotedEscapeValue(value) + ");";
		    }
	    }
	    cmd = this.addPopupDomainPrefixes(cmd);
	    cmd = "browser." + cmd;
	    return cmd;
	};
	Sahi.prototype.escapeDollar = function (s) {
		return s;
	    if (s == null) return null;
	    return s.replace(/[$]/g, "\\$");
	};	
	Sahi.prototype.getAccessor1 = function (info) {
	    if (info == null) return null;
	    if ("" == (""+info.shortHand) || info.shortHand == null) return null;
	    var accessor = info.type + "(" + this.escapeForScript(info.shortHand) + ")";
	    if (accessor.indexOf("_") == 0) accessor = accessor.substring(1);
	    return accessor;
	};	
	_sahi.language = {
			ASSERT_EXISTS: "assertTrue(<accessor>.exists());",
			ASSERT_VISIBLE: "assertTrue(<accessor>.isVisible());",			
			ASSERT_EQUAL_TEXT: "assertEquals(<value>, <accessor>.text());",
			ASSERT_CONTAINS_TEXT: "assertTrue(<accessor>.text().contains(<value>));",
			ASSERT_EQUAL_VALUE: "assertEquals(<value>, <accessor>.value());",
			ASSERT_SELECTION: "assertEquals(<value>, <accessor>.selectedText());",
			ASSERT_CHECKED: "assertTrue(<accessor>.checked());",
			ASSERT_NOT_CHECKED: "assertFalse(<accessor>.checked());",
			POPUP: "popup(<window_name>).",
			DOMAIN: "domain(<domain>)."				
	};		
}
/** -- Java Recorder End -- **/


/** -- OpKey Recorder Start -- **/
if (_sahi.controllerMode == "opkey"){
	/* Selenium locatorBuilders start */
	eval(_sahi.sendToServer("/_s_/spr/ext/selenium/locatorBuilders.js"));
	var Log = function(){};
	Log.info = Log.warn = Log.prototype.exception = Log.prototype.error = Log.prototype.debug = function(s){};
	DummyBot = function(){this.locationStrategies=[]};
	DummyBot.prototype.findElement = function(locator){
		return _sahi._bySeleniumLocator(locator);
	}	
	LocatorBuilders.prototype.pageBot = function(){return new DummyBot();};
	/* Selenium locatorBuilders end */

	_sahi.controllerURL = "/_s_/spr/opkeycontroller.htm";
	_sahi.controllerHeight = 250;
	_sahi.controllerWidth = 420;
	_sahi.recorderClass = "StepWiseRecorder";
	Sahi.prototype.getExpectPromptScript = function(s, retVal){
		return this.toJSON([this.getStepObj("expectPrompt", this.quotedEscapeValue(s), this.quotedEscapeValue(retVal))]);
	}
	Sahi.prototype.getExpectConfirmScript = function(s, retVal){
		return this.toJSON([this.getStepObj("expectConfirm", this.quotedEscapeValue(s), retVal)]);
	}
	Sahi.prototype.getNavigateToScript = function(url){
		return this.toJSON([this.getStepObj("navigateTo", "", this.quotedEscapeValue(url)), this.getStepObj("navigateTo", "", this.quotedEscapeValue(url), "selenium")]);
	}	
	Sahi.prototype.getStepObj = function(accessor, accessorType, accessorArr){
		accessorArr[accessorType] = accessor; 
	}
	Sahi.prototype.escapeNullValue = function (value){
		return (value) ? value : '';
	}
	
	Sahi.prototype._getFinalFramesList = function(){
		var finalAr = new Object();
		var secAr = new Object();
		for(var i=0; i<this._framesList.length; i++){
			var str = "finalAr";
			for(var j=0; j<=i; j++){
				str +="[\"parent\"]"
			}
			console.log(str);
			eval(str + "=new Object()");
			eval(str + "=" + JSON.stringify(this._framesList[i]));
		}
		return finalAr["parent"];
	}
	
	Sahi.prototype._getFrames = function(win){
		if (typeof index == "undefined") index = 0;
		var _sahi = this;
		if(win.self === win.top){
			var title = this.escapeNullValue(this.getTitle());
			var url = this.escapeNullValue(this.getURL());
			try{
				this._framesList.push({
							"type": "HTML PAGE",
							"tag": "html",
				            "index": index,
				            "title": title,
				            "url": url
						});
	        }catch(e){_sahi._debug(e)}
		} else {
			var currentFrame = win.frameElement;
			try{
				this._framesList.push({
							"Type": "Frame",
				            "Tag": "iframe",
				            "src":_sahi.escapeNullValue(currentFrame.src),
				            "index": index++,
				            "id": _sahi.escapeNullValue(currentFrame.id),
				            "name": _sahi.escapeNullValue(currentFrame.name),
						});
			}catch(e){_sahi._debug(e)}
			_sahi._getFrames(win.parent);
		}
	}
	Sahi.prototype.escapeNullValue = function (value){
		return (value) ? value : '';
	}
	Sahi.prototype.getScript = function (infoAr, el, evType, e) {
		var popupName = this.getPopupName();
		
		var toSendAr = new Object();
		var accessorArr;
		var winArr;
		if(infoAr.length > 0){
			var info = infoAr[0];
			var action = info.event.replace(/^_/, '');
			var value = null;
			if (action == "setValue" || action == "setSelected" || action == "setFile"){
				var value = info.value;
			    if (value == null) value = "";
			    value = this.toJSON(value);
			}
			
			var elProp = this.getAD(el);
			if(elProp.length > 0){
				if(e.type != elProp[0].event) return;
			}
			
			toSendAr["action"] = action;
			var dataArguments = {
					"type" : "string",
					"data" : this.escapeNullValue(value).replace(/\"/g, '')
			}
			toSendAr["popupName"] = popupName;
			var elementProperties = new Object();
			for (var i=0; i<infoAr.length; i++){
				try{
					var info = infoAr[i];
					var accessor = this.escapeDollar(this.getAccessor1(info));
					var accessorType = this.getAccessorType(info);
					this.getStepObj(accessor, accessorType, elementProperties);
				}catch(e){}
			}
			// Selenium accessors start
			var locators = this.getSeleniumAccessors(el);
			for (var i=0; i<locators.length; i++){
				try{
				//toSendAr[toSendAr.length] = this.getStepObj(action, this.quotedEscapeValue(locators[i][0]), value, "selenium", popupName);
				//this._debug(locators[i][0] + ":" + locators[i][1]);
					this.getStepObj(locators[i][0], locators[i][1], elementProperties);
				} catch(e){}
			}
			// Selenium accessors end
			this._framesList = new Array();
			var doc = el.ownerDocument;
			var win = doc.defaultView || doc.parentWindow;
			this._getFrames(win);
			elementProperties["parent"] = this._getFinalFramesList();
			toSendAr["arguments"] = [elementProperties, dataArguments];
		}			

		//this._debug(this.toJSON(toSendAr));
		return this.toJSON(toSendAr);
	};
	Sahi.prototype.getURL = function(){
		return this.top().location.href;
	}
	Sahi.prototype.getSeleniumAccessors = function(el){
		var l = new LocatorBuilders(window);
		return l.buildAll(el);
	}
	Sahi.prototype.escapeDollar = function (s) {
		return s;
	    if (s == null) return null;
	    return s.replace(/[$]/g, "\\$");
	};	
	Sahi.prototype.getAccessor1 = function (info, type) {
	    if (info == null) return null;
	    if ("" == (""+info.shortHand) || info.shortHand == null) return null;
	    this.lastIdentifiedElementType = info.type;
	    var accessor;
	    if(type == "identify") accessor = info.type + "(" + this.escapeForScript(info.shortHand) + ")";
	    else accessor = this.escapeForScript(info.shortHand);
	    if (accessor.indexOf("_") == 0) accessor = accessor.substring(1);
	    return accessor;
	};
	Sahi.prototype.domToJSON = function (el) {
	    var s = new Object();
	    var f = "";
	    var j = 0;
	    if (typeof el == "array"){
	        for (var i=0; i<el.length; i++) {
	            s[i] = el[i];
	        }
	    }
	    if (typeof el == "object") {
	        for (var i in el) {
	            try {
	                if (el[i] && el[i] != el) {
	                	if (("" + el[i]).indexOf("function") == 0) {
	                    }else{
	                        if (typeof el[i] == "object" && el[i] != el.parentNode) {
	                            s[i] = "{{" + el[i].replace(/object /g, "") + "}}";
	                        }
	                        s[i] = el[i];
	                        j++;
	                    }
	                }
	            } catch(e) {
	                //s += "" + i + ",";
	            }
	        }
	    }
	    //this._debug(JSON.stringify(s));
	    return JSON.stringify(s);
	};
	Sahi.prototype.sendIdentifierInfo = function(accessors, escapedAccessor, escapedValue, popupName, assertions, el){
		var assertions = this.identify(el).assertions;
		var locators = this.getSeleniumAccessors(el);
		var selAccessors = [];
		for (var i=0; i<locators.length; i++){
			selAccessors[selAccessors.length] = this.quotedEscapeValue(locators[i][0]);
		}
		var json = "{type: " + this.lastIdentifiedElementType + ", accessors: {sahi:" + this.toJSON(accessors) + ",selenium:" +
			this.toJSON(selAccessors) + "}, value:" + escapedValue +", properties:" + this.domToJSON(el) + "}";
		//this._debug(json);
		this.sendToServer("/_s_/dyn/Driver_setLastIdentifiedElement?element=" + encodeURIComponent(json));
	};
	Sahi.prototype.getAccessorType = function (info) {
	    if (info == null) return null;
	    if ("" == (""+info.accessorType) || info.accessorType == null) return null;
	    var accessor = info.accessorType;
	    return accessor;
	};
//	Sahi.prototype.openWin = function(){};
//	Sahi.prototype.openController = function(){};	
	_sahi.language = {
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

/** -- Ruby Recorder Start -- **/
if (_sahi.controllerMode == "ruby"){
	_sahi.controllerURL = "/_s_/spr/controllertw.htm";
	_sahi.controllerHeight = 250;
	_sahi.controllerWidth = 420;
	_sahi.recorderClass = "StepWiseRecorder";
	Sahi.prototype.getExpectPromptScript = function(s, retVal){
		return "browser." + this.getPopupDomainPrefixes() + "expect_prompt(" + this.quotedEscapeValue(s) + ", " + this.quotedEscapeValue(retVal) + ")";
	}
	Sahi.prototype.getExpectConfirmScript = function(s, retVal){
		return "browser." + this.getPopupDomainPrefixes() + "expect_confirm(" + this.quotedEscapeValue(s) + ", " + retVal + ")"
	}
	Sahi.prototype.getNavigateToScript = function(url){
		return "browser." + this.getPopupDomainPrefixes() + "navigate_to(" + this.quotedEscapeValue(url) + ")"
	}
	Sahi.prototype.getScript = function (infoAr, el, evType, e) {
		var info = infoAr[0];
	    var accessor = this.escapeDollar(this.getAccessor1(info));
	    if (accessor == null) return null;
	    if (accessor.indexOf("_") == 0) accessor = accessor.substring(1);
	    var ev = info.event;
	    var value = info.value;
	    var type = info.type;
	    var popup = this.getPopupName();
	
	    var cmd = null;
	    if (value == null)
	        value = "";
		 // handle F12 and contextmenu
	    if (evType == "keydown") {
	    	if (e && e.keyCode >= 112 && e.keyCode <= 123 && !e.charCode){
	    		cmd =  accessor + ".key_press(\"[" + e.keyCode + "," + 0 + "]\");";
	    	}
		    if (!cmd) return null;
	    } else { 	    
		    if (ev == "_click") {
		    	if (evType && evType.toLowerCase() == "contextmenu") {
		    		cmd =  accessor + ".right_click;";
		    	}
		    	else cmd = accessor + ".click";
		    } else if (ev == "_setValue") {
		        cmd = accessor + ".value = " + this.quotedEscapeValue(value);
		    } else if (ev == "_setSelected") {
		        cmd = accessor + ".choose(" + this.quotedEscapeValue(value) + ")";
		    } else if (ev == "_setFile") {
		        cmd = accessor + ".file = " + this.quotedEscapeValue(value);
		    }
	    }
	    cmd = this.addPopupDomainPrefixes(cmd);
	    cmd = "browser." + cmd;
	    return cmd;
	};
	Sahi.prototype.escapeDollar = function (s) {
		return s;
	    if (s == null) return null;
	    return s.replace(/[$]/g, "\\$");
	};	
	Sahi.prototype.getAccessor1 = function (info) {
	    if (info == null) return null;
	    if ("" == (""+info.shortHand) || info.shortHand == null) return null;
	    var accessor = info.type + "(" + this.escapeForScript(info.shortHand) + ")";
	    if (accessor.indexOf("_") == 0) accessor = accessor.substring(1);
	    return accessor;
	};	
	_sahi.language = {
			ASSERT_EXISTS: "assert(<accessor>.exists?)",
			ASSERT_VISIBLE: "assert(<accessor>.visible?);",			
			ASSERT_EQUAL_TEXT: "assert_equal(<value>, <accessor>.text);",
			ASSERT_CONTAINS_TEXT: "assert(<accessor>.text.contains(<value>));",
			ASSERT_EQUAL_VALUE: "assert_equal(<value>, <accessor>.value);",
			ASSERT_SELECTION: "assert_equal(<value>, <accessor>.selected_text);",
			ASSERT_CHECKED: "assert(<accessor>.checked?);",
			ASSERT_NOT_CHECKED: "assert(!<accessor>.checked?);",
			POPUP: "popup(<window_name>).",
			DOMAIN: "domain(<domain>)."		
	};		
}
/** -- Ruby Recorder End -- **/

/** -- TestMaker Recorder Start -- **/
if (_sahi.controllerMode == "testmaker"){
	/* Selenium locatorBuilders start */
	eval(_sahi.sendToServer("/_s_/spr/ext/selenium/locatorBuilders.js"));
	var Log = function(){};
	Log.info = Log.warn = Log.prototype.exception = Log.prototype.error = Log.prototype.debug = function(s){};
	DummyBot = function(){this.locationStrategies=[]};
	DummyBot.prototype.findElement = function(locator){
		return _sahi._bySeleniumLocator(locator);
	}	
	LocatorBuilders.prototype.pageBot = function(){return new DummyBot();};
	/* Selenium locatorBuilders end */

	_sahi.recorderClass = "StepWiseRecorder";
	Sahi.prototype.getExpectPromptScript = function(s, retVal){
		return this.toJSON([this.getStepObj("expectPrompt", this.quotedEscapeValue(s), this.quotedEscapeValue(retVal))]);
	}
	Sahi.prototype.getExpectConfirmScript = function(s, retVal){
		return this.toJSON([this.getStepObj("expectConfirm", this.quotedEscapeValue(s), retVal)]);
	}
	Sahi.prototype.getNavigateToScript = function(url){
		return this.toJSON([this.getStepObj("navigateTo", "", this.quotedEscapeValue(url)), this.getStepObj("navigateTo", "", this.quotedEscapeValue(url), "selenium")]);
	}	
	Sahi.prototype.getStepObj = function(action, accessor, value, dialect, popupName){
		var toSend = new Object();
		toSend["popup"] = popupName ? popupName : "";
		toSend["dialect"] = dialect ? dialect : "sahi";
		toSend["action"] = action;
		toSend["accessor"] = accessor;
		toSend["value"] = value;
		return toSend;
		
	}
	Sahi.prototype.getScript = function (infoAr, el) {
		var popupName = this.getPopupName();
		
		var toSendAr = new Array();
		for (var i=0; i<infoAr.length; i++){
			try{
				var info = infoAr[i];
				var action = info.event.replace(/^_/, '');
				var accessor = this.escapeDollar(this.getAccessor1(info));
				var value = null;
				if (action == "setValue" || action == "setSelected" || action == "setFile"){
					var value = info.value;
				    if (value == null) value = "";
				    value = this.toJSON(value);
				}
				toSendAr[toSendAr.length] = this.getStepObj(action, accessor, value, "sahi", popupName);
			}catch(e){}
		}	
		// Selenium accessors start
		var locators = this.getSeleniumAccessors(el);
		for (var i=0; i<locators.length; i++){
			try{
			toSendAr[toSendAr.length] = this.getStepObj(action, this.quotedEscapeValue(locators[i][0]), value, "selenium", popupName);
			} catch(e){_sahi._alert(e)}
		}
		// Selenium accessors end

		//this._alert(this.toJSON(toSendAr));
		return this.toJSON(toSendAr);
	};
	Sahi.prototype.getSeleniumAccessors = function(el){
		var l = new LocatorBuilders(window);
		return l.buildAll(el);
	}
	Sahi.prototype.escapeDollar = function (s) {
		return s;
	    if (s == null) return null;
	    return s.replace(/[$]/g, "\\$");
	};	
	Sahi.prototype.getAccessor1 = function (info) {
	    if (info == null) return null;
	    if ("" == (""+info.shortHand) || info.shortHand == null) return null;
	    this.lastIdentifiedElementType = info.type;
	    var accessor = info.type + "(" + this.escapeForScript(info.shortHand) + ")";
	    if (accessor.indexOf("_") == 0) accessor = accessor.substring(1);
	    return accessor;
	};	
	Sahi.prototype.sendIdentifierInfo = function(accessors, escapedAccessor, escapedValue, popupName){
		var el = eval(this.addSahi("_" + escapedAccessor));
		var assertions = this.identify(el).assertions;
		var locators = this.getSeleniumAccessors(el);
		var selAccessors = [];
		for (var i=0; i<locators.length; i++){
			selAccessors[selAccessors.length] = this.quotedEscapeValue(locators[i][0]);
		}		
		
		var json = this.toJSON({type: this.lastIdentifiedElementType, accessors: {sahi: accessors,
		           selenium: selAccessors}, assertions: assertions, value: escapedValue});
		this.sendToServer("/_s_/dyn/Driver_setLastIdentifiedElement?element=" + encodeURIComponent(json));
	}
//	Sahi.prototype.openWin = function(){};
//	Sahi.prototype.openController = function(){};	
	_sahi.language = {
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
/** -- TestMaker Recorder End -- **/