
var timeStampMillis = Date.now();

var GenericAppDataTracker = function () {
};

var thisObject = new GenericAppDataTracker();

GenericAppDataTracker.prototype.attachListener = function () {
    document.addEventListener("click", function (e) {
        if (e.isTrusted == false) {
            return;
        }
        thisObject.sendTrackingData(e, "CLICK");
    }, true);

    document.addEventListener("change", function (e) {
        if (e.isTrusted == false) {
            return;
        }
        thisObject.captureUserId(e);
        thisObject.sendTrackingData(e, "FOCUSOUT");
    }, true);

    document.addEventListener("blur", function (e) {
        if (e.isTrusted == false) {
            return;
        }
        thisObject.captureUserId(e);
    }, true);
};

GenericAppDataTracker.prototype.captureUserId = function (event) {
    var inputElement = event.target;
    if (inputElement != null) {
        if (inputElement.nodeName == "INPUT") {
            if (inputElement.getAttribute("name") === "username") {
                if (inputElement.getAttribute("placeholder") === "Enter Your Email") {
                    var userId = inputElement.value;
                    chrome.runtime.sendMessage({
                        SendUserName: { "UserId": userId, "DomainName": obiq_getDomainName(document.URL) }
                    }, function (response) {
                        if (chrome.runtime.lastError) { }
                    });
                }
            }
        }
    }
};

function obiq_getDomainName(url) {
    try {
        const urlObject = new URL(url);
        return urlObject.hostname;
    } catch (error) {
        return null;
    }
}


GenericAppDataTracker.prototype.sendTrackingData = function (event, _type) {
    var trackedData = thisObject.craeteTrackingData("", "", "");

    var _elementtrack = event.target;
    var _nodeName = _elementtrack.nodeName;
    if (_type == "CLICK") {
        if (_nodeName !== "A" || _nodeName !== "INPUT" || _nodeName !== "BUTTON" || _nodeName !== "TEXTAREA") {
            var tempElement = _elementtrack;
            let max = 0;
            while (tempElement.parentNode != null && max < 5) {
                if (tempElement.nodeName == "A" || tempElement.nodeName == "INPUT" || tempElement.nodeName == "BUTTON" || tempElement.nodeName == "TEXTAREA") {
                    _elementtrack = tempElement;
                    break;
                }
                max++;
                tempElement = tempElement.parentNode;
            }
        }
    }

    var label = thisObject.getElementLabel(_elementtrack);
    var keywordAction = thisObject.getKeywordName(_type, _elementtrack, label);

    if (_type == "CLICK") {
        trackedData["appEventType"] = "INTERACTION";
        trackedData["appEventSubType"] = "MOUSE";
        var _appEventLog = keywordAction;
        trackedData["appEventLog"] = _appEventLog;
    }

    if (_type == "FOCUSOUT") {
        trackedData["appEventType"] = "INTERACTION";
        trackedData["appEventSubType"] = "KEYBOARD";
        var _appEventLog = keywordAction;
        trackedData["appEventLog"] = _appEventLog;
    }

    if (event != null && _elementtrack != null) {
        trackedData["currentFieldJson"] = thisObject.getCurrentFieldInfo(_elementtrack);
    }

    thisObject.sendDataToTelemtryServer(trackedData);
};

GenericAppDataTracker.prototype.getCurrentFieldInfo = function (_element) {
    var outInfo = new Object();
    if (_element.getBoundingClientRect() != null) {
        outInfo["elementX"] = _element.getBoundingClientRect().x;
        outInfo["elementY"] = _element.getBoundingClientRect().y;
        outInfo["elementHeight"] = _element.getBoundingClientRect().height;
        outInfo["elementWidth"] = _element.getBoundingClientRect().width;
    }
    return JSON.stringify(outInfo);
}

GenericAppDataTracker.prototype.getKeywordName = function (actionType, _element, _label) {
    if (actionType == "CLICK") {

        if (_element.nodeName == "INPUT") {
            if (_element.type != null && _element.type == "checkbox") {
                return "User has selected checkbox '" + _label + "'";
            }
            else if (_element.type != null && _element.type == "radio") {
                return "User has selected radio '" + _label + "'";
            }
            else if (_element.type != null && _element.type == "button") {
                return "User has clicked on button '" + _label + "'";
            }
            else if (_element.type != null && _element.type == "text") {
                return "User has clicked on text field '" + _label + "'";
            }
            else if (_element.type != null && _element.type == "password") {
                return "User has clicked on password field '" + _label + "'";
            }
        }
        return "User has clicked on '" + _label + "'";
    }

    if (actionType == "FOCUSOUT") {
        if (_element.nodeName == "INPUT") {
            if (_element.type != null && _element.type == "password") {
                return "User has entered text ******** on password field '" + _label + "'";
            }
        }
        return "User has entered text '" + _element.value + "' on text field '" + _label + "'";
    }
};
var thisErpApp = new CommonErpAppDataTracker();
GenericAppDataTracker.prototype.getElementLabel = function (_element) {

    _element = thisErpApp.filterElementLabel(_element);

    var _elementId = _element.getAttribute("id");
    if (_elementId != null) {
        var _allLabels = document.getElementsByTagName("LABEL");
        for (var i = 0; i < _allLabels.length; i++) {
            var _labelElement = _allLabels[i];
            if (_labelElement != null) {
                if (_labelElement.getAttribute("for") == _elementId) {
                    _label = _labelElement.innerText;
                    break;
                }
            }
        }
    }
    if (thisObject.isNotNullOrBlank(_label)) {
        return _label;
    }


    var _label = _element.innerText;
    if (thisObject.isNotNullOrBlank(_label)) {
        return _label;
    }

    _label = _element.getAttribute("placeholder");
    if (thisObject.isNotNullOrBlank(_label)) {
        return _label;
    }

    _label = _element.getAttribute("aria-label");
    if (thisObject.isNotNullOrBlank(_label)) {
        return _label;
    }

    _label = _element.getAttribute("title");
    if (thisObject.isNotNullOrBlank(_label)) {
        return _label;
    }

    _label = _element.getAttribute("id");
    if (thisObject.isNotNullOrBlank(_label)) {
        return _label;
    }
    _label = _element.getAttribute("name");
    if (thisObject.isNotNullOrBlank(_label)) {
        return _label;
    }

    _label = _element.getAttribute("className");
    if (thisObject.isNotNullOrBlank(_label)) {
        return _label;
    }

    return _element.nodeName;
};

GenericAppDataTracker.prototype.isNotNullOrBlank = function (_data) {
    if (_data == null) {
        return false;
    }

    if (_data == "") {
        return false;
    }
    return true;
};


GenericAppDataTracker.prototype.craeteTrackingData = function (appEventType, appEventSubType, appEventLog) {
    var appType = "GENERICAPP";
    var pageTitle = document.title;
    var pageUrl = document.URL;
    var moduleHeader = thisObject.getCurrentPageModuleHeader();

    var eventLogDelay = thisObject.getEventDelayTime();
    var pageLoadDelay = thisObject.getCurrentPageLoadTime();
    var trackedData = {
        "appType": appType,
        "dataId": thisObject.createUUID(),
        "pageTitle": pageTitle,
        "pageUrl": pageUrl,
        "moduleHeader": moduleHeader,
        "appEventType": appEventType,
        "appEventSubType": appEventSubType,
        "appEventLog": appEventLog,
        "eventLogDelay": eventLogDelay,
        "pageLoadDelay": pageLoadDelay,
        "userId": "",
        "sessionId": ""
    }

    return trackedData;
};

GenericAppDataTracker.prototype.createUUID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

GenericAppDataTracker.prototype.getEventDelayTime = function () {
    var diffTime = Date.now() - timeStampMillis;
    timeStampMillis = Date.now();
    return Math.round(diffTime);
};

GenericAppDataTracker.prototype.getCurrentPageLoadTime = function () {
    if (window.performance) {
        var timing = window.performance.getEntriesByType("navigation")[0];
        if (timing) {
            var pageLoadTime = timing.domComplete;
            return Math.round(pageLoadTime);
        }
    }
    return 0;
};


GenericAppDataTracker.prototype.getCurrentPageModuleHeader = function () {

    var headers = document.getElementsByTagName("h5");
    var _header = thisObject.getExactHeader(headers);

    if (_header == null) {
        headers = document.getElementsByTagName("h4");
        _header = thisObject.getExactHeader(headers);
    }

    if (_header == null) {
        headers = document.getElementsByTagName("h3");
        _header = thisObject.getExactHeader(headers);
    }

    if (_header == null) {
        headers = document.getElementsByTagName("h2");
        _header = thisObject.getExactHeader(headers);
    }

    if (_header == null) {
        headers = document.getElementsByTagName("h1");
        _header = thisObject.getExactHeader(headers);
    }

    if (_header != null && _header.innerText != null && _header.innerText !== "") {
        return _header.innerText;
    }
    return document.title;
};

GenericAppDataTracker.prototype.getExactHeader = function (headers) {
    headers = thisObject.analytics_filterVisibleElements(headers);
    if (headers != null && headers.length > 0) {
        return headers[headers.length - 1];
    }
    return null;
}


GenericAppDataTracker.prototype.sendDataToTelemtryServer = async function (dataToSend) {

    let sendStatus = await sendMessageToBackgroundScriptWithPromise("SendDataToTelemetryServer", {
        "mainDataDto": dataToSend, "pageSnapShot": null
    });


};


GenericAppDataTracker.prototype.trackAppCommonFunctions = function () {

    window.setTimeout(function () {
        var emailElement = document.querySelector("#sp_user_profile_mail");
        if (emailElement != null) {
            var userId = emailElement.innerText;
            chrome.runtime.sendMessage({
                SendUserName: { "UserId": userId, "DomainName": obiq_getDomainName(document.URL) }
            }, function (response) {
                if (chrome.runtime.lastError) { }
            });
        }
        thisObject.trackAppCommonFunctions();
    }, 500);
};

GenericAppDataTracker.prototype.analytics_istablevalid = function (_table) {
    var _headres = _table.getElementsByTagName("TBODY");
    if (_headres.length > 0) {
        return true;
    }
    return false;
};

GenericAppDataTracker.prototype.analytics_filterVisibleElements = function (_elementsArray) {
    var outArray = [];
    for (_element of _elementsArray) {
        if (thisObject.analytics_IsElementVisible(_element)) {
            outArray.push(_element);
        }
    }
    return outArray;
};


GenericAppDataTracker.prototype.analytics_IsElementVisible = function (elem) {
    //  return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
    if (!(elem instanceof Element)) {
        return true;
    }
    var style = getComputedStyle(elem);
    if (style.display === 'none') return false;
    if (style.visibility !== 'visible') return false;
    if (style.opacity < 0.1) return false;
    if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
        elem.getBoundingClientRect().width === 0) {
        return false;
    }
    var elemCenter = {
        x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
        y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
    };

    try {
        if (elemCenter.x < 0) return false;
        if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
        if (elemCenter.y < 0) return false;
        if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
        var pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
        do {
            if (pointContainer === elem) return true;
        } while (pointContainer = pointContainer.parentNode);
        return false;
    }
    catch (e) {
        return true;
    }
};

GenericAppDataTracker.prototype.sendErrorData = function (_errorType, _errorData) {
    var trackedData = thisObject.craeteTrackingData("DEBUG", _errorType, _errorData);
    thisObject.sendDataToTelemtryServer(trackedData);
}


GenericAppDataTracker.prototype.startTracking = function () {
    thisObject.trackAppCommonFunctions();
    thisObject.attachListener();
    thisObject.attachPostMessageListener();

    window.setInterval(function () {
        addRemoteJs(chrome.runtime.getURL("Obiq/assets/analytics/js/apps/tools/genericappinterceptor.js"));
    }, 500);
};

GenericAppDataTracker.prototype.attachPostMessageListener = function () {
    window.addEventListener('message', function (event) {
        if (event != null && event.data != null) {
            if (event.data.method != null) {
                if (event.data.method === "GA_SendConsoleError") {
                    var errorData = event.data.errorData;
                    thisObject.sendErrorData("CONSOLE_LOG_ERROR", errorData);
                }

                else if (event.data.method === "GA_SendApiRequestError") {
                    var errorData = event.data.errorData;
                    errorData = JSON.stringify(errorData);
                    thisObject.sendErrorData("APIREQUEST_LOG_ERROR", errorData);
                }
            }
        }
    }, false);
};

function addRemoteJs(src) {
    try {
        if (document.getElementById("opkey_interceptor_script") != null) {
            return;
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.id = "opkey_interceptor_script"
        script.src = src;

        (document.head || document.documentElement).appendChild(script);
        return script;
    } catch (e) { }
};






async function sendMessageToBackgroundScriptWithPromise(_command, _data) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            "action": _command, "data": _data
        }, function (response) {
            resolve(response);
        });
    });
}