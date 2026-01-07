/*
 * Copyright 2005 Shinya Kasatani
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function checkXpathPositionNodeCountIsUnique(_xpathPos)
{
	if(_xpathPos==null)
	{
		return true;
	}
	var opkey_results = [];
	var _query = document.evaluate(_xpathPos, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	
	for (var _i = 0, length = _query.snapshotLength; _i < length; ++_i) {
		opkey_results.push(_query.snapshotItem(_i));
	}

	if(opkey_results.length==1)
	{
		//console.log("Unique Xpath Found "+_xpathPos);
		return true;
	}
	return false;
}

function LocatorBuilders(window) {
	this.window = window;
	//this.log = new Log("LocatorBuilders");
}

LocatorBuilders.prototype.detach = function() {
    if (this.window._locator_pageBot) {
        this.window._locator_pageBot = undefined;
        // Firefox 3 (beta 5) throws "Security Manager vetoed action" when we use delete operator like this:
        // delete this.window._locator_pageBot;
    }
}

LocatorBuilders.prototype.pageBot = function() {
	var pageBot = this.window._locator_pageBot;
	if (pageBot == null) {
        //pageBot = BrowserBot.createForWindow(this.window);
        pageBot = new MozillaBrowserBot(this.window);
        var self = this;
        pageBot.getCurrentWindow = function() {
            return self.window;
        }
		this.window._locator_pageBot = pageBot;
	}
	return pageBot;
}

LocatorBuilders.prototype.buildWith = function(name, e, opt_contextNode) {
	return LocatorBuilders.builderMap[name].call(this, e, opt_contextNode);
}

LocatorBuilders.prototype.build = function(e) {
    var locators = this.buildAll(e);
    if (locators.length > 0) {
        return locators[0][0];
    } else {
        return "LOCATOR_DETECTION_FAILED";
    }
}

LocatorBuilders.prototype.buildAll = function(el) {
	var i = 0;
	var xpathLevel = 0;
	var maxLevel = 10;
	var locator;
    var locators = [];

	for (var i = 0; i < LocatorBuilders.order.length; i++) {
		var finderName = LocatorBuilders.order[i];
        try{
		locator = this.buildWith(finderName, el);
		if (locator) {
			locator = String(locator);
			if(locator.search("document")>-1) {
				locators.push([ locator, finderName ]);
				//return locators;
			}
			else{
				locators.push([ locator, finderName ]);
			}
		
			// test the locator. If a is_fuzzy_match() heuristic function is
            // defined for the location strategy, use it to determine the
            // validity of the locator's results. Otherwise, maintain existing
            // behavior.
  
    
		}
        } catch (e) {
      // TODO ignore the buggy locator builder for now
          if (el == this.findElement(locator)) {
            locators.push([ locator, finderName ]);
          }
		  else{
			  if(finderName=="xpath:idRelative")
			  {
				locators.push([this.getAbsolutePath(el), finderName ]);
		      }
		  }
    }
	}
    return locators;
}

LocatorBuilders.prototype.preciseXPath = function(xpath, e){
  //only create more precise xpath if needed
  if (this.findElement(xpath) != e) {
    var result = e.ownerDocument.evaluate(xpath, e.ownerDocument, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //skip first element (result:0 xpath index:1)
    for (var i=0, len=result.snapshotLength; i < len; i++) {
      var newPath = 'xpath=(' +  xpath + ')[' + (i +1 )+']';
      if ( this.findElement(newPath) == e ) {
		  newPath = newPath.replace("xpath=", "");
          return newPath ;
      }
    }
  }
  return xpath;
}

LocatorBuilders.prototype.findElement = function(locator) {
	try {
		return this.pageBot().findElement(locator);
	} catch (error) {
		return null;
	}
}

/*
 * Class methods
 */

LocatorBuilders.order = [];
LocatorBuilders.builderMap = {};

LocatorBuilders.add = function(name, finder) {
	this.order.push(name);
	this.builderMap[name] = finder;
}



/*
 * Utility function: Encode XPath attribute value.
 */
LocatorBuilders.prototype.attributeValue = function(value) {
	if (value.indexOf("'") < 0) {
		return "'" + value + "'";
	} else if (value.indexOf('"') < 0) {
		return '"' + value + '"';
	} else {
		var result = 'concat(';
		while (true) {
			var apos = value.indexOf("'");
			var quot = value.indexOf('"');
			if (apos < 0) {
				result += "'" + value + "'";
				break;
			} else if (quot < 0) {
				result += '"' + value + '"';
				break;
			} else if (quot < apos) {
				var part = value.substring(0, apos);
				result += "'" + part + "'";
				value = value.substring(part.length);
			} else {
				var part = value.substring(0, quot);
				result += '"' + part + '"';
				value = value.substring(part.length);
			}
			result += ',';
		}
		result += ')';
		return result;
	}
}

LocatorBuilders.prototype.xpathHtmlElement = function(name) {
    if (this.window.document.contentType == 'application/xhtml+xml') {
        // "x:" prefix is required when testing XHTML pages
        return "x:" + name;
    } else {
        return name;
    }
}

LocatorBuilders.prototype.relativeXPathFromParent = function(current) {
    var childNodes = current.parentNode.childNodes;
    var total = 0;
    var index = -1;
    for (var i = 0; i < childNodes.length; i++) {
        var child = childNodes[i];
        if (child.nodeName == current.nodeName) {
            if (child == current) {
                index = total;
            }
            total++;
        }
    }
    var currentPath = '/' + this.xpathHtmlElement(current.nodeName.toLowerCase());
    if (total > 1 && index >= 0) {
        currentPath += '[' + (index + 1) + ']';
    }
    return currentPath;
}

/*
 * ===== builders =====
 */

//LocatorBuilders.add('ui', function(pageElement) {
//    return UIMap.getInstance().getUISpecifierString(pageElement,
//        this.window.document);
//    });
    
LocatorBuilders.add('id', function(e) {
		if (e.id) {
			return e.id;
		}
		return null;
	});

LocatorBuilders.add('link', function(e) {
		if (e.nodeName == 'A') {
			var text = LocatorBuilders.textContent(e);
			if (!text.match(/^\s*$/)) {
				return "link=" + LocatorBuilders.exactMatchPattern(text.replace(/\xA0/g, " ").replace(/^\s*(.*?)\s*$/, "$1"));
			}
		}
		return null;
	});

LocatorBuilders.add('name', function(e) {
		if (e.name) {
			return e.name;
		}
		return null;
	});

/*
 * This function is called from DOM locatorBuilders
 */
LocatorBuilders.prototype.findDomFormLocator = function(form) {
	if (form.name!=null) {
		var name = form.name;
		var locator = "document." + name;
		if (this.findElement(locator) == form) {
			return locator;
		}
		locator = "document.forms['" + name + "']";
		if (this.findElement(locator) == form) {
			return locator;
		}
	}
	var forms = this.window.document.forms;
	for (var i = 0; i < forms.length; i++) {
		if (form == forms[i]) {
			return "document.forms[" + i + "]";
		}
	}
	return null;
}

LocatorBuilders.add('dom:name', function(e) {
		if (e.form && e.name) {
			var formLocator = this.findDomFormLocator(e.form);
			var candidates = [formLocator + "." + e.name,
							  formLocator + ".elements['" + e.name + "']"];
			for (var c = 0; c < candidates.length; c++) {
				var locator = candidates[c];
				var found = this.findElement(locator);
				if (found) {
					if (found == e) {
						return locator;
					} else if (found.length && found.length > 0) {
						// multiple elements with same name
						for (var i = 0; i < found.length; i++) {
							if (found[i] == e) {
								return locator + "[" + i + "]";
							}
						}
					}
				}
			}
		}
		return null;
	});

 /*LocatorBuilders.add('xpath:link', function(e) {
		if (e.nodeName == 'A') {
			var text = LocatorBuilders.textContent(e);
			if (!text.match(/^\s*$/)) {
				return "//" + this.xpathHtmlElement("a") + "[contains(text(),'" + text.replace(/^\s+/,'').replace(/\s+$/,'') + "')]";
			}
		}
		return null;
	});*/


LocatorBuilders.add('xpath:customAttributes', function(e) {
	var attrValue="";
	var role=e.getAttribute("role");
    var title=e.getAttribute("title");
    var draggable=e.getAttribute("draggable");
    var ariacurrent=e.getAttribute("aria-current");
    var ariaposinset=e.getAttribute("aria-posinset");
    var ariasetsize=e.getAttribute("aria-setsize");
    var ariahaspopup=e.getAttribute("aria-haspopup");
    var ariaexpanded=e.getAttribute("aria-expanded");
    var tabindex=e.getAttribute("tabindex");
    var arialabel=e.getAttribute("aria-label");
    if(arialabel!=null && arialabel!==""){
		if(attrValue!=""){
			attrValue+=" and ";
		}
		attrValue+="@aria-label='"+arialabel.replace(/\"/g, "&#x0022;")+"'";
	}
	else{
		if(attrValue!=""){
			//attrValue+=" and ";
		}
		//attrValue+="NOT @aria-label";
	}
	
	if(tabindex!=null){
		if(attrValue!=""){
			attrValue+=" and ";
		}
		attrValue+="@tabindex";
	}
	else{
		if(attrValue!=""){
			//attrValue+=" and ";
		}
		//attrValue+="NOT @aria-label";
	}
	
	
	if(ariaexpanded!=null){
		if(attrValue!=""){
			attrValue+=" and ";
		}
		attrValue+="@aria-expanded='"+ariaexpanded.replace(/\"/g, "&#x0022;")+"'";
	}
	else{
		if(attrValue!=""){
			//attrValue+=" and ";
		}
		//attrValue+="NOT @aria-expanded";
	}
	
	if(ariahaspopup!=null){
		if(attrValue!=""){
			attrValue+=" and ";
		}
		attrValue+="@aria-haspopup='"+ariahaspopup.replace(/\"/g, "&#x0022;")+"'";
	}
	else{
		if(attrValue!=""){
			//attrValue+=" and ";
		}
		//attrValue+="NOT @aria-haspopup";
	}
	
	if(ariasetsize!=null){
		if(attrValue!=""){
			attrValue+=" and ";
		}
		attrValue+="@aria-setsize";
	}
	else{
		if(attrValue!=""){
			//attrValue+=" and ";
		}
		//attrValue+="NOT @aria-setsize";
	}
	
	if(ariaposinset!=null){
		if(attrValue!=""){
			attrValue+=" and ";
		}
		attrValue+="@aria-posinset='"+ariaposinset.replace(/\"/g, "&#x0022;")+"'";
	}
	else{
		if(attrValue!=""){
			//attrValue+=" and ";
		}
		//attrValue+="NOT @aria-posinset";
	}
	
	if(ariacurrent!=null){
		if(attrValue!=""){
			attrValue+=" and ";
		}
		attrValue+="@aria-current='"+ariacurrent.replace(/\"/g, "&#x0022;")+"'";
	}
	else{
		if(attrValue!=""){
			//attrValue+=" and ";
		}
		//attrValue+="NOT @aria-current";
	}
	
	if(draggable!=null){
		if(attrValue!=""){
			attrValue+=" and ";
		}
		attrValue+="@draggable='"+draggable.replace(/\"/g, "&#x0022;")+"'";
	}
	else{
		if(attrValue!=""){
			//attrValue+=" and ";
		}
		//attrValue+="NOT @draggable";
	}
	
	if(role!=null){
		if(attrValue!=""){
			attrValue+=" and ";
		}
		attrValue+="@role='"+role.replace(/\"/g, "&#x0022;")+"'";
	}
	else{
		if(attrValue!=""){
			//attrValue+=" and ";
		}
		//attrValue+="NOT @role";
	}
	
	if(title!=null){
		if(attrValue!=""){
			attrValue+=" and ";
		}
		attrValue+="@title='"+title.replace(/\"/g, "&#x0022;")+"'";
	}
	else{
		if(attrValue!=""){
			//attrValue+=" and ";
		}
		//attrValue+="NOT @title";
	}
	if(attrValue==""){
		return null;
	}
	
	var fullXpath="//"+ e.nodeName + "["+attrValue+"]";
	
    return fullXpath;
});


LocatorBuilders.add('xpath:img', function(e) {
  if (e.nodeName == 'IMG') {
    if (e.alt != '') {
      return this.preciseXPath("//" + this.xpathHtmlElement("img") + "[@alt=" + this.attributeValue(e.alt) + "]", e);
    } else if (e.title != '') {
      return this.preciseXPath("//" + this.xpathHtmlElement("img") + "[@title=" + this.attributeValue(e.title) + "]", e);
    } else if (e.src != '') {
      return this.preciseXPath("//" + this.xpathHtmlElement("img") + "[contains(@src," + this.attributeValue(e.src) + ")]", e);
    }
  }
  return null;
});

LocatorBuilders.add('xpath:attributes', function(e) {
		var PREFERRED_ATTRIBUTES = ['id','name','value','type','action','onclick'];
		
		function attributesXPath(name, attNames, attributes) {
			var locator = "//" + this.xpathHtmlElement(name) + "[";
			for (var i = 0; i < attNames.length; i++) {
				if (i > 0) {
					locator += " and ";
				}
				var attName = attNames[i];
				locator += '@' + attName + "=" + this.attributeValue(attributes[attName]);
			}
			locator += "]";
			return locator;
		}

		if (e.attributes) {
			var atts = e.attributes;
			var attsMap = {};
			for (var i = 0; i < atts.length; i++) {
				var att = atts[i];
				attsMap[att.name] = att.value;
			}
			var names = [];
			// try preferred attributes
			for (var i = 0; i < PREFERRED_ATTRIBUTES.length; i++) {
				var name = PREFERRED_ATTRIBUTES[i];
				if (attsMap[name] != null) {
					names.push(name);
					var locator = attributesXPath.call(this, e.nodeName.toLowerCase(), names, attsMap);
					if (e == this.findElement(locator)) {
						return locator;
					}
				}
			}
		}
		return null;
	});

	LocatorBuilders.prototype.getAbsolutePath = function (el) {
		var path = '';
		var current = el;
		var counter=0;
		while (current != null) {
			
			var foundShadow=false;
			var _parentNode =  current.parentNode;
			if (_parentNode == null || _parentNode.nodeName=="#document-fragment") {
				if (current.OPKEY_PARENT_NODE != null) {
					foundShadow=true;
					_parentNode = current.OPKEY_PARENT_NODE;
				}
			}
			if (_parentNode != null) {
				var currentXpath=this.relativeXPathFromParent(current);
				if(foundShadow){
					currentXpath="/"+currentXpath;
				}
				path = currentXpath + path;
			}

			if(counter==0){
				if(current.nodeName.toLowerCase()!=="select" && current.nodeName.toLowerCase()!=="div" && current.innerText!=null && current.innerText!==""){
					if(!checksize64(current.innerText))
					{						
					path=path+"[text()='"+current.innerText+"']";
					}
				}
			}
			counter++;
			current = _parentNode;
		}
		return path;
	};
	
LocatorBuilders.add('xpath:idRelative', function(e) {
		var path = '';
		var current = e;

		if(current.OPKEY_PARENT_NODE!=null){

			return this.getAbsolutePath(current);
		}

		while (current != null) {
			if (current.parentNode != null) {
				
                path = this.relativeXPathFromParent(current) + path;
                if (current.parentNode.id) {
	            if(stringContainsNumber(current.parentNode.id)==false){
					var _attributeValue=this.attributeValue(current.parentNode.id);
					_attributeValue=handleKronosXpath(_attributeValue);
                    return "//" + this.xpathHtmlElement(current.parentNode.nodeName.toLowerCase()) + 
                        "[@id=" + _attributeValue + "]" + path;
                }
                }
				if (current.parentNode.name) {
					var _attributeValue=this.attributeValue(current.parentNode.name);
					_attributeValue=handleKronosXpath(_attributeValue);
                    return "//" + this.xpathHtmlElement(current.parentNode.nodeName.toLowerCase()) + 
                        "[@name=" + _attributeValue + "]" + path;
                }
				try{
		        if (current.parentNode.getAttribute("data-automation-id")!=null) {
					var _attributeValue=this.attributeValue(current.parentNode.getAttribute("data-automation-id"));
					_attributeValue=handleKronosXpath(_attributeValue);
                    return "//" + this.xpathHtmlElement(current.parentNode.nodeName.toLowerCase()) + 
                        "[@data-automation-id=" + _attributeValue + "]" + path;
                }
				if (current.parentNode.getAttribute("aria-label")!=null && current.parentNode.getAttribute("aria-label")!=="") {
					var _attributeValue=this.attributeValue(current.parentNode.getAttribute("aria-label"));
					_attributeValue=handleKronosXpath(_attributeValue);
                    return "//" + this.xpathHtmlElement(current.parentNode.nodeName.toLowerCase()) + 
                        "[@aria-label=" + _attributeValue + "]" + path;
                }
				if (current.parentNode.getAttribute("data-dyn-controlname")!=null) {
					var _attributeValue=this.attributeValue(current.parentNode.getAttribute("data-dyn-controlname"));
					_attributeValue=handleKronosXpath(_attributeValue);
                    return "//" + this.xpathHtmlElement(current.parentNode.nodeName.toLowerCase()) + 
                        "[@data-dyn-controlname=" + _attributeValue + "]" + path;
                }
				}catch(e){}

			}
			current = current.parentNode;
		}
		return path;
	});


function stringContainsNumber(_inputString){
	if(_inputString.indexOf("_")>-1){
		return true;
	}
	  var hasNumber = /\d/;   
      return hasNumber.test(_inputString);
}

function handleKronosXpath(_value) {
	var recording_mode = GetRecordingMode();
	if (recording_mode ==  "KRONOS") {

		var _text = _value;
		var _startIndex = -1;
		var _lastIndex  = -1;
		for (var i  = 0; i < _text.length; i++)  {
			var _char =   _text[i];
			var _isNan = isNaN(_char);
			if (_isNan ==  false)  {
				if (_startIndex  === -1) {
					_startIndex = i;
				}
				else {
					_lastIndex =  i;
				}
			}
		}
		
		if(_startIndex===-1 || _lastIndex===-1){
			return _value;
		}
		var res = _text.substring(_startIndex  - 1, _lastIndex + 1);
		res = formatKronosResult(res);
		_text  = _text.replace(res,  "OPKEY_KRONOS_REGEX");
		return _text;
	}
	return _value;
}
function checksize64(variable){
	try {
		// Convert the variable to a JSON string

	//	console.log("here in checksize");
		let jsonString = JSON.stringify(variable);

		// Calculate the size of the JSON string in bytes
		let sizeInBytes = new Blob([jsonString]).size;

		// Define the 64 KB limit
		const MAX_SIZE_IN_BYTES = 64 * 1024;

		// Check if the size is within the limit
		if (sizeInBytes <= MAX_SIZE_IN_BYTES) {
	//		console.log("The variable size is within the 64 KB limit.");
			return false;
		} else {
	//		console.log("The variable size exceeds the 64 KB limit.");
			return true;
		}
	} catch (e) {
		console.error("Error checking variable size:", e);
		return false;
	}
}
function formatKronosResult(_result){
	if(_result.length>12){
		var startIndex=_result.length-12;
		return  _result.substring(startIndex - 1, _result.length+1);
	}
	
	return _result;
}


function GetRecordingMode() {
    var recording_mode = localStorage.getItem("OPKEY_RECORDING_MODE");
    if (recording_mode == null) {
        return "NORMAL";
    } else {
        return recording_mode;
    }
};
 /*LocatorBuilders.add('xpath:href', function(e) {
		if (e.attributes && e.href!=null) {
			href = e.href;
			if (href.search(/^http?:\/\//) >= 0) {
				return "//" + this.xpathHtmlElement("a") + "[@href=" + this.attributeValue(href) + "]";
			} else {
				// use contains(), because in IE getAttribute("href") will return absolute path
				return "//" + this.xpathHtmlElement("a") + "[contains(@href, " + this.attributeValue(href) + ")]";
			}
		}
		return null;
	});*/

LocatorBuilders.add('dom:index', function(e) {
		if (e.form) {
			var formLocator = this.findDomFormLocator(e.form);
			var elements = e.form.elements;
			for (var i = 0; i < elements.length; i++) {
				if (elements[i] == e) {
					return formLocator + ".elements[" + i + "]";
				}
			}
		}
		return null;
	});

LocatorBuilders.add('xpath:position', function(e, opt_contextNode) {
	////debugger
		var path = '';
		var current = e;
		while (current != null && current != opt_contextNode) {
            var currentPath;
			if (current.parentNode != null) {
                currentPath = this.relativeXPathFromParent(current);
			} else {
                currentPath = '/' + this.xpathHtmlElement(current.nodeName.toLowerCase());
            }
			path = currentPath + path;
			var locator = '/' + path;
			if (e == this.findElement(locator)) {
			if(checkXpathPositionNodeCountIsUnique(locator)==true)
			{
				return locator;
			}
			}
			current = current.parentNode;
			if(current==null)
			{
			if(checkXpathPositionNodeCountIsUnique(locator)==true)
			{
				return locator;
			}
			}
			if(current.nodeName == "#document") {
				//locator = locator.replace("//","//#document/");
			if(checkXpathPositionNodeCountIsUnique(locator)==true)
			{
				return locator;
			}
			}

		}
		return null;
	});

// You can change the priority of builders by setting LocatorBuilders.order.
//LocatorBuilders.order = ['id', 'link', 'name', 'dom:name', 'xpath:link', 'xpath:img', 'xpath:attributes', 'xpath:href', 'dom:index', 'xpath:position'];

/* added */
LocatorBuilders.exactMatchPattern = function (string) {
    if (string != null && (string.match(/^\w*:/) || string.indexOf('?') >= 0 || string.indexOf('*') >= 0)) {
            return "exact:" + string;
    } else {
            return string;
    }
}
LocatorBuilders.hasAttribute = function(el, attr){
	return el.getAttribute(attr) != null;
}
LocatorBuilders.textContent = function(el){
	return el.innerText ? el.innerText : el.textContent;
}
