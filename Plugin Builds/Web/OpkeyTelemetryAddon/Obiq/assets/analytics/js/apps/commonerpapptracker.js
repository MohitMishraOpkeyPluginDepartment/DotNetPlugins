
var timeStampMillis = Date.now();
var oft_divRectClientBounds = null;
var oft_dockerDivClickable = false;
var lastHighlightedElement = null;

var showDockerDivElement = false;
var lastEventCaptured = null;
var CommonErpAppDataTracker = function () {

};

var thisErpApp = new CommonErpAppDataTracker();
var inAppPromptService = new InAppPromptService();
thisErpApp.appType = null;

CommonErpAppDataTracker.prototype.attachListener = function () {


    document.addEventListener("mousedown", async function (e) {
        if (isExtensionDisconnected() == true) {
            return;
        }
        lastEventCaptured = e;
        if (e.isTrusted == false && e?.target?.getAttribute("opkeyJSClick") === null) {
            return;
        }

        if (await thisErpApp.canTrackThisPage() == false) {
            return;
        }
        const targetEle = custom_getElementTargetFromEvent(e);

        document.obiqTitle = document.title;
        document.obiqUrl = document.URL;

        if (checkForUnintendedClick(e)) {
            return;
        }

        if (targetEle.tagName.toLowerCase() === 'input' && (targetEle.id === 'password' || targetEle.type === 'password')) {
            return;
        }

        let _elementtrack = custom_getElementTargetFromEvent(e)

        cacheLastElementRect(_elementtrack);

        let label = thisErpApp.getElementLabel(_elementtrack);
        label = thisErpApp.removeUnwantedDataFromLabel(label);

        let currentFieldJson = thisErpApp.getCurrentFieldInfo(_elementtrack, label);

        _elementtrack.obiq_label = label;
        _elementtrack.obiq_currentFieldJson = currentFieldJson;

        thisErpApp.sendTrackingData(e, "MOUSEDOWN");

    }, { capture: true, passive: true });

    let lastClickTime = 0;
    const debounceDelay = 200;

    document.addEventListener("click", async function (e) {
        if (isExtensionDisconnected() == true) {
            return;
        }
        lastEventCaptured = e;
        if (e.isTrusted === false && e?.target?.getAttribute("opkeyJSClick") === null) {
            return;
        }
        if (checkForUnintendedClick(e)) {
            return;
        }

        const now = Date.now();
        if (now - lastClickTime < debounceDelay) {
            return;
        }
        lastClickTime = now;

        if (await thisErpApp.canTrackThisPage() == false) {
            return;
        }

        cacheLastElementRect(custom_getElementTargetFromEvent(e));
        thisErpApp.detectSubModuleName(e);
        thisErpApp.sendTrackingData(e, "CLICK");
    }, { capture: true, passive: true });


    document.addEventListener("change", async function (e) {
        if (isExtensionDisconnected() == true) {
            return;
        }
        lastEventCaptured = e;
        if (e.isTrusted == false && custom_getElementTargetFromEvent(e) != null && custom_getElementTargetFromEvent(e).nodeName != "SELECT") {
            return;
        }

        if (await thisErpApp.canTrackThisPage() == false) {
            return;
        }

        var keyPressCond = custom_getElementTargetFromEvent(e).getAttribute("obiqkeypresscondition");
        if (keyPressCond == null || keyPressCond != "true") {
            // return;
        }
        custom_getElementTargetFromEvent(e).removeAttribute("obiqkeypresscondition");
        cacheLastElementRect(custom_getElementTargetFromEvent(e));
        thisErpApp.captureUserId(e);
        thisErpApp.sendTrackingData(e, "FOCUSOUT");
    }, { capture: true, passive: true });

    document.addEventListener("focus", function (e) {
        if (isExtensionDisconnected() == true) {
            return;
        }
        lastEventCaptured = e;
        if (e.isTrusted == false) {
            return;
        }
        // thisErpApp.highlightElement(e);
    }, { capture: true, passive: true });

    document.addEventListener("blur", async function (e) {
        if (isExtensionDisconnected() == true) {
            return;
        }
        lastEventCaptured = e;
        if (e.isTrusted == false) {
            return;
        }
        // thisErpApp.highlightElement(e);
        if (await thisErpApp.canTrackThisPage() == false) {
            return;
        }
        thisErpApp.captureUserId(e);
    }, { capture: true, passive: true });

    document.addEventListener("keydown", function (e) {
        if (isExtensionDisconnected() == true) {
            return;
        }
        lastEventCaptured = e;
        if (e.isTrusted == false) {
            return;
        }
        if (custom_getElementTargetFromEvent(e) != null) {
            custom_getElementTargetFromEvent(e).setAttribute("obiqkeypresscondition", "true");
        }
    }, { capture: true });

    document.addEventListener("mousemove", function (event) {
        if (isExtensionDisconnected() == true) {
            return;
        }
        lastEventCaptured = event;
    });

};

function custom_getElementTargetFromEvent(e) {
    return e.target;
}

function cacheLastElementRect(_element) {

    let lastElementRectData = sessionStorage.getItem("lastElementCache");
    if (lastElementRectData !== null && lastElementRectData !== "") {
        return;
    }
    if (_element === null) {
        return;
    }
    let rect = _element.getBoundingClientRect();
    if (isRectAllZero(rect) === true) {
        return;
    }
    sessionStorage.setItem("lastElementCache", JSON.stringify(rect));
}

function IsInAutomation() {
    return (navigator.webdriver != null && navigator.webdriver === true) || window.__OBIQ_AUTOMATION__ === true;
}

function checkForUnintendedClick(e) {
    if (isWorkDayApp() == true) {
        let el = custom_getElementTargetFromEvent(e)
        if (el.nodeName === "UL" && el.getAttribute("role") !== null && el.getAttribute("role") === "presentation") {
            return true;
        }

        if (el.nodeName === "DIV" && el.classList.contains("wd-popup-content")) {
            return true;
        }

        if (IsInAutomation()) {
            //adding this condition hear as in case of click need to skip it only as deepti mam ask
            if (el.getAttribute("data-automation-id") !== null && el.getAttribute("data-automation-id") === "globalSearchInput") {
                return true;
            }
            if (el.nodeName === "DIV" && el.getAttribute("id") !== null && el.getAttribute("id") === "wd-searchInput") {
                return true;
            }
        }

    }
    return false;
}

CommonErpAppDataTracker.prototype.canTrackThisPage = async function () {
    return new Promise(async function (resolve, reject) {
        try {
            if (isCurrentPageIsCompanionAppPage() == true) {
                resolve(false);
                return;
            }
            let currentTab = await sendMessageToBackgroundScriptWithPromise("chrome.tabs.getActiveTabInfo", {});
            if (!currentTab) {
                resolve(false);
                return;
            }
            chrome.runtime.sendMessage({
                GetUrlToTrack: "GetUrlToTrack"
            }, function (tabIdList) {
                if (isExtensionDisconnected() == true) {
                    return;
                }
                if (tabIdList !== null) {
                    if (tabIdList === "IGNORE_IN_AUTOMATED") {
                        resolve(true)
                        return;
                    }
                    if (String(currentTab.id) === tabIdList) {
                        showDockerDivElement = true;
                        resolve(true);
                        return;
                    }
                }
                resolve(false);
            });

        } catch (e) {
            catchObiqFunctionExceptions(e);
            resolve(null);
        }
    });
}


CommonErpAppDataTracker.prototype.getLastSegmentAfterHyphen = function (hostname) {
    try {
        const parts = hostname.split('-');
        return parts.pop();
    } catch (error) {
        return hostname;
    }
}

CommonErpAppDataTracker.prototype.dockerCanBeEnabled = async function () {
    return new Promise(function (resolve, reject) {
        try {
            chrome.runtime.sendMessage({
                GetObiqExecutionMode: "GetObiqExecutionMode"
            }, function (mode) {
                if (isExtensionDisconnected() == true) {
                    return;
                }
                if (mode !== null) {
                    if (mode === "Automated") {
                        resolve(false);
                        return;
                    }
                }
                resolve(true);
            });

        } catch (e) {
            catchObiqFunctionExceptions(e);
            resolve(null);
        }
    });
}

CommonErpAppDataTracker.prototype.detectSubModuleName = function (event) {
    var _element = event.target;

    if (_element.nodeName != "A") {
        var tempElement = _element;
        while (tempElement.parentNode != null) {
            if (tempElement.nodeName == "A") {
                _element = tempElement;
            }
            tempElement = tempElement.parentNode;
        }
    }

    if (_element.nodeName != "A" && _element.nextSibling != null && _element.nextSibling.nodeName == "A") {
        _element = _element.nextSibling;
    }

    if (_element.nodeName != "A" && _element.parentNode != null && _element.parentNode.nextSibling != null && _element.parentNode.nextSibling.nodeName == "A") {
        _element = _element.parentNode.nextSibling;
    }

    if (_element.childNodes.length > 0) {
        var _imgElement = _element.getElementsByTagName("IMG")[0];
        if (_imgElement != null) {
            if (_imgElement.getAttribute("title") != null && _imgElement.getAttribute("title") == "Tasks") {
                return;
            }
        }
    }
    var id_attribute = _element.getAttribute("id");

    if (id_attribute == null || id_attribute == "") {
        id_attribute = _element.getAttribute("target");
    }

    let _groupName = null;
    if (_element.getAttribute("group") != null) {
        _groupName = _element.getAttribute("group");
    }

    if (id_attribute != null) {
        var subModuleName = oft_getSubModuleName(id_attribute, _groupName);
        if (subModuleName != null) {

            chrome.runtime.sendMessage({
                SendOFProcessName: subModuleName
            }, function (response) {
                if (isExtensionDisconnected() == true) {
                    return;
                }
            });
        }
    }

    if (_element.nodeName == "A") {
        var isValidSubActivity = isValidSubActivityName(_element.innerText);

        if (isValidSubActivity == true) {
            chrome.runtime.sendMessage({
                SendOFSubActivityName: _element.innerText
            }, function (response) {
                if (isExtensionDisconnected() == true) {
                    return;
                }
            });
        }
    }


};

var _validSubActivityNamew = ["Create Invoice", "Create Invoice from Spreadsheet", "Create Recurring Invoices", "Manage Invoices", "Apply Missing Conversion Rates", "Validate Invoices", "Initiate Approval Workflow", "Import Invoices", "Correct Import Errors", "Run Payables Exceptions Listing",

    "Create Accounting", "Create Adjustment Journal", "Review Journal Entries", "Payables to Ledger Reconciliation", "Create Mass Additions", "Manage Accounting Periods",


    "Submit Payment Process Request", "Manage Payment Process Requests", "Manage Payment Process Request Templates", "Create Payment", "Manage Payments", "Create Electronic Payment Files", "Create Printed Payment Files", "Create Printed Payment Files", "Manage Payment Files", "Apply Missing Conversion Rates", "Create Positive Pay File", "Send Separate Remittance Advice", "Create Regulatory Reporting",


    "Payment File Accompanying Letter", "Retrieve Disbursement Acknowledgments", "Create Accounting", "Create Adjustment Journal", "Review Journal Entries", "Payables to Ledger Reconciliation",

    "Manage Accounting Periods"
];

function isValidSubActivityName(_subActivity) {
    if (_subActivity == null || _subActivity == "") {
        return false;
    }

    if (_validSubActivityNamew.indexOf(_subActivity) > -1) {
        return true;
    }
}


function oft_getSubModuleName(_idattribute, _groupName) {
    if (_groupName == null) {
        _groupName = "";
    }

    if (_idattribute.indexOf("_payables") > -1 || _groupName.indexOf("_payables") > -1) {
        return "Payables";
    }
    else if (_idattribute.indexOf("_receivables") > -1 || _groupName.indexOf("_receivables") > -1) {
        return "Receivables";
    }

    else if (_idattribute.indexOf("_fixed_assets") > -1 || _groupName.indexOf("_fixed_assets") > -1) {
        return "Fixed Assets";
    }

    else if (_idattribute.indexOf("_general_accounting") > -1 || _groupName.indexOf("_general_accounting") > -1) {
        return "General Accounting";
    }

    else if (_idattribute.indexOf("_cash_management") > -1 || _groupName.indexOf("_cash_management") > -1) {
        return "Cash Management";
    }

    else if (_idattribute.indexOf("_intercompany_accounting") > -1 || _groupName.indexOf("_intercompany_accounting") > -1) {
        return "Intercompany Accounting";
    }

    else if (_idattribute.indexOf("workforce_management") > -1 || _groupName.indexOf("workforce_management") > -1) {
        return "Hire to Retire";
    }


    return "REMOVE_CURRENT_PROCESS";
}

CommonErpAppDataTracker.prototype.captureUserId = function (event) {
    var inputElement = event.target;
    if (inputElement != null) {
        if (inputElement.nodeName == "INPUT") {
            if (inputElement.getAttribute("aria-label") === "User ID") {
                if (inputElement.getAttribute("placeholder") === "User ID") {
                    var userId = inputElement.value;
                    chrome.runtime.sendMessage({
                        SendUserName: { "UserId": userId, "DomainName": obiq_getDomainName(document.URL) }
                    }, function (response) {
                        if (isExtensionDisconnected() == true) {
                            return;
                        }
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
        // Handle invalid URL or unsupported browser
        return null;
    }
}

CommonErpAppDataTracker.prototype.captureUserIdFromLocalStorage = function () {
    for (var key in localStorage) {
        if (key.indexOf("selfDetailsData") > -1) {
            var keyData = localStorage.getItem(key);
            if (keyData != null && keyData !== "") {
                var keyDataObject = JSON.parse(keyData);
                if (keyDataObject["Username"] != null) {
                    var userId = keyDataObject["Username"];
                    chrome.runtime.sendMessage({
                        SendUserName: { "UserId": userId, "DomainName": obiq_getDomainName(document.URL) }
                    }, function (response) {
                        if (isExtensionDisconnected() == true) {
                            return;
                        }
                    });
                }
            }
        }
    }
}

let alreadyProcessElement = [];
let previousElementType = null;

CommonErpAppDataTracker.prototype.sendTrackingData = async function (event, _type) {
    var trackedData = thisErpApp.craeteTrackingData("", "", "", event);

    if (_type === "MOUSEDOWN") {

        if (previousElementType !== null && previousElementType === "INPUT") {
            previousElementType = null;
            return;
        }

        _type = "CLICK";
    }

    var _elementtrack = event.target;
    var _nodeName = _elementtrack.nodeName;
    previousElementType = _nodeName;
    if (_type == "CLICK") {
        if (_nodeName !== "A" && _nodeName !== "INPUT" && _nodeName !== "BUTTON" && _nodeName !== "TEXTAREA") {
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
    if (thisErpApp.isSkipableElement(_elementtrack, _nodeName) == true) {
        return;
    }

    // cacheLastElementRect(_elementtrack);   //commenting it bcz.... hear it is not needed

    var label = thisErpApp.getElementLabel(_elementtrack);
    label = thisErpApp.removeUnwantedDataFromLabel(label);

    if (label == null) {
        return;
    }

    if (_elementtrack.obiq_label != null && _elementtrack.obiq_label != "") {
        label = _elementtrack.obiq_label;
    }

    if (IsInAutomation() == true && isWorkDayApp() == true) {
        if (alreadyProcessElement.indexOf(label) > -1) {
            return;
        } else if (_nodeName === "INPUT") {
            alreadyProcessElement.push(label);
        } else {
            alreadyProcessElement = [];
        }
    }

    if (label != null) {
        if (label.length > 100) {
            return;
        }
    }

    var keywordAction = thisErpApp.getKeywordName(_type, _elementtrack, label);
    if (keywordAction == null) {
        return;
    }

    if (IsInAutomation() == false && isOracleFusionApp() == true) {
        if (alreadyProcessElement.indexOf(keywordAction) > -1) {
            return;
        } else if (_nodeName === "INPUT") {
            alreadyProcessElement.push(keywordAction);
        } else {
            alreadyProcessElement = [];
        }
    }

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
    //console.log(trackedData);

    if (event != null && _elementtrack != null) {
        if (_elementtrack.obiq_currentFieldJson != null && _elementtrack.obiq_currentFieldJson != "") {
            trackedData["currentFieldJson"] = _elementtrack.obiq_currentFieldJson;
        }
        else {
            trackedData["currentFieldJson"] = thisErpApp.getCurrentFieldInfo(_elementtrack, label);
        }
    }
    trackedData["labelText"] = label;
    thisErpApp.sendDataToTelemtryServer(trackedData);
};

CommonErpAppDataTracker.prototype.removeUnwantedDataFromLabel = function (label) {
    if (isWorkDayApp() == true) {
        label = label?.replace("Sort and filter column", "");
        label = label?.replace("Filter column", "");
        label = label?.replace(/\s*\(?\s*\d+\s*\)?/g, '').trim();
    }
    return label;
}

CommonErpAppDataTracker.prototype.isSkipableElement = function (_elementtrack, _nodeName) {
    //this will skip start and stop proxy as deepti mam ask for

    if (isWorkDayApp() == true) {
        if (_nodeName == "INPUT") {
            const v = typeof _elementtrack.value === "string" ? _elementtrack.value.toLowerCase() : "";
            if (v.includes("start proxy") || v.includes("stop proxy")) {
                return true;
            }

            if (_elementtrack.type === "number" && (
                _elementtrack.getAttribute("placeholder") === "DD" ||
                _elementtrack.getAttribute("placeholder") === "YYYY"
            )) {
                return true;
            }

            let type = _elementtrack?.type
            if ((type === "checkbox" && (_elementtrack.getAttribute("data-automation-id") !== null &&
                _elementtrack.getAttribute("data-automation-id") === "checkboxPanel")) || (type === "radio" && (_elementtrack.getAttribute("data-automation-id") !== null &&
                    _elementtrack.getAttribute("data-automation-id") === "radioBtn"))) {
                let parentEle = _elementtrack.parentNode;
                const match = parentEle?.closest('[data-automation-id="menuItem"]');
                if (match) {
                    return true;
                }
            }
        }

        if ((_elementtrack.nodeName === "DIV" || _elementtrack.nodeName === "P") &&
            _elementtrack.getAttribute("data-automation-id") !== null &&
            _elementtrack.getAttribute("data-automation-id") === "promptOption") {
            return true;
        }

        if (_elementtrack.getAttribute("data-automation-id") !== null) {
            let dataAutomationId = _elementtrack.getAttribute("data-automation-id");
            if (dataAutomationId.indexOf("authSelectorOption") > -1) {
                return true;
            }
        }

        if (document.URL != null && document.URL.indexOf("/authgwy/") > -1) {
            if (_elementtrack.innerText != null) {
                if (_elementtrack.innerText.indexOf("Skip") > -1) {
                    return true;
                }
            }
        }

        if (IsInAutomation() == true) {
            if (_elementtrack instanceof SVGElement) {
                return true;
            }
        }

        if (_nodeName === "LABEL") {
            let forProperty = _elementtrack.getAttribute("for");
            if (forProperty) {
                let inputXpath = "//input[@id = '" + forProperty + "']";
                let foundInput = thisErpApp.getElementByXPath(inputXpath);
                if (foundInput !== null) {
                    return true;
                }
            }

            if (IsInAutomation() == true) {
                let labelID = _elementtrack.getAttribute("id");
                if (labelID !== null) {
                    let xpathToFind = "//div[contains(@aria-labelledby, '" + labelID + "')]";
                    let labelAttachedElement = thisErpApp.getElementByXPath(xpathToFind);
                    if (labelAttachedElement) {
                        return true;
                    }
                }
            }
        }

        if (IsInAutomation() == false) {

            if (_nodeName === "BUTTON" && _elementtrack.getAttribute("data-automation-id")?.includes("datePicker")) {
                return true;
            }

            if (_nodeName === "TD" || _nodeName === "TR") {
                let parentEle = _elementtrack.parentNode;
                const match = parentEle?.closest('[data-automation-id="datePicker"]');
                if (match) {
                    return true;
                }

            }
        }

        if (IsInAutomation() == true) { // doing this for bug id: 82095 (if causing issue then revert this) using this approach bcz no other connection found
            if (_nodeName === "TD" && _elementtrack.getAttribute("headers")?.includes("columnheader")) {
                let mainTable = _elementtrack.closest("DIV")?.getAttribute("data-automation-id")?.includes("MainTable");
                if (mainTable) {
                    return true;
                }
            }
        }
    }

    if (isOracleFusionApp() == true) {
        if (_nodeName === "BODY" || _nodeName === "IFRAME") { //to remove afr::PushIframe
            return true;
        }

        if ((_nodeName === "SPAN" && _elementtrack.parentNode?.nodeName === "TD") || _nodeName === "TD" || _nodeName === "TR" || (_nodeName === "DIV" && _elementtrack.parentNode?.nodeName === "TD")) {
            let el = _elementtrack;
            const tableEl = el?.closest('table');
            if (tableEl) {
                const parentEle = tableEl.parentElement;
                const parentId =
                    parentEle?.nodeName === 'DIV' ? parentEle.getAttribute('id') : null;

                if (parentId) {
                    const inputId = removeFromDoubleColon(parentId) + '::content';
                    const inputEl = document.getElementById(inputId);

                    if (inputEl?.nodeName === 'INPUT') {
                        return true;
                    }
                }
            }

            const dynTableEl = el?.closest('OJ-DYNAMIC-TABLE');
            if (dynTableEl) {
                const parentEle = dynTableEl.parentElement;
                const containerId =
                    parentEle?.nodeName === 'DIV'
                        ? parentEle.getAttribute('data-oj-containerid')
                        : null;

                if (containerId) {
                    const inputEl = document.getElementById(containerId + '|input');
                    if (inputEl?.nodeName === 'INPUT') {
                        return true;
                    }
                }
            }

        }

        //need to fix the dropdown and search select of oracle fusion are also getting recorded in journey
        if (IsInAutomation() == true) {
            let isItem = obiq_isFusionDropdownItemLike(_elementtrack);

            console.log("isItem", isItem, _elementtrack);
            if (isItem === true) {
                return true;
            }
            if (isRectAllZero(_elementtrack) === true) {
                return true;
            }

            let CheckForOracleDropdownFlag = sessionStorage.getItem("CheckForOracleDropdownFlag");
            if (CheckForOracleDropdownFlag !== null && CheckForOracleDropdownFlag === "true") {
                sessionStorage.removeItem("CheckForOracleDropdownFlag");
                return true;
            }

        }

        if (IsInAutomation() == false) {
            if (_nodeName == "TD" && _elementtrack.getAttribute("role") !== null && _elementtrack.getAttribute("role") === "gridcell") {
                let tableEle = _elementtrack.closest("table");
                let checkForDateElement = tableEle?.getAttribute("data-afr-yyyymm") ? true : false;
                if (checkForDateElement) {
                    return true;
                }
            }

            if (_nodeName == "LI" && _elementtrack.getAttribute("role") != null && _elementtrack.getAttribute("role") === "option") {

                let eleID = _elementtrack.getAttribute("id");
                if (eleID != null) {
                    const inputId = removeFromDoubleColon(eleID) + '::content';
                    const inputEl = document.getElementById(inputId);

                    if (inputEl?.nodeName === 'INPUT') {
                        return true;
                    }
                }

                let parentUl = _elementtrack.closest("ul");
                if (parentUl?.getAttribute("role") != null && parentUl?.getAttribute("role") === "listbox") {
                    return true;
                }
            }
        }
    }
    return false;
}


function obiq_isFusionDropdownItemLike(el) {

    if (!el) return false;

    let ojEle = el.closest("div[class*='oj-listview']");
    if (ojEle?.getAttribute("role") === "gridcell") {
        return true;
    }
    if (!ojEle) {
        ojEle = el.closest("li[class*='oj-listview']");
        if (ojEle?.getAttribute("role") === "row") {
            return true;
        }
    }

    ojEle = el.closest("div[class*='oj-listbox-searchselect']");
    if (ojEle) {
        let ojEleID = ojEle.getAttribute("data-oj-containerid");
        if (ojEleID) {
            let inputID = "oj-searchselect-filter-" + ojEleID + "|input";
            let inputEle = thisErpApp.getElementByXPath("//input[@id = '" + inputID + "']");
            if (inputEle) {
                return true;
            }
        }
    }

    let foundOJEle = el.closest("OJ-LIST-VIEW");
    if (foundOJEle?.parentNode?.nodeName === "DIV") {
        let OJParentEleContainerID = foundOJEle.parentNode.getAttribute("data-oj-containerid");
        if (OJParentEleContainerID) {
            let inputEleId = "oj-searchselect-filter-" + OJParentEleContainerID + "|input";
            let inputEle = thisErpApp.getElementByXPath("//input[@id = '" + inputEleId + "']");
            if (inputEle) {
                return true;
            }
        }
    }

    foundOJEle = el.closest("OJ-LIST-ITEM-LAYOUT");
    if (foundOJEle?.parentNode?.nodeName === "DIV") {
        if (foundOJEle.parentNode.getAttribute("role") === "gridcell") {
            return true;
        }
    }

    if (IsInAutomation() == true) {
        if (el.nodeName === "SPAN" && el.getAttribute("class")?.includes("oj-highlighttext") && el.parentNode === "SPAN" && el.parentNode?.getAttribute("class") == null) {
            return true;
        }

        if (el.nodeName === "SPAN" && el.getAttribute("class")?.includes("oj-highlighttext")) {
            return true;
        }

    }
    return false;
}


function obiq_custom_closestChild(element, selector) {
    return element.querySelector(selector);
}

CommonErpAppDataTracker.prototype.getCurrentFieldInfo = function (_element, _label) {
    var outInfo = new Object();
    if (_element.getBoundingClientRect() != null) {
        outInfo["elementX"] = _element.getBoundingClientRect().x;
        outInfo["elementY"] = _element.getBoundingClientRect().y;
        outInfo["elementHeight"] = _element.getBoundingClientRect().height;
        outInfo["elementWidth"] = _element.getBoundingClientRect().width;
    }

    if (_label != null) {
        outInfo["elementLabel"] = _label;
    }

    let xpathDataList = thisErpApp.generateXPaths(_element);
    outInfo["elementXpathDataList"] = xpathDataList;

    outInfo["elementOuterHtml"] = _element.outerHTML;

    localStorage.setItem("OPKEY_RECORDING_MODE", "ORACLE FUSION");
    let _script = _opkey.getCustomeKeywordScript("NO_ACTION", _element, "");
    if (_script != null && _script !== "") {
        let _scriptObject = JSON.parse(_script);
        let _arguments = _scriptObject["arguments"];
        outInfo["ORObjectProperties"] = _arguments;
    }

    localStorage.removeItem("OPKEY_RECORDING_MODE");
    return JSON.stringify(outInfo);
}

CommonErpAppDataTracker.prototype.generateXPaths = function (element) {
    if (!(element instanceof Element)) {
        return [];
    }

    function getAbsoluteXPath(el) {
        if (el.id) {
            return `id("${el.id}")`;
        }
        const parts = [];
        while (el && el.nodeType === Node.ELEMENT_NODE) {
            let index = 1;
            let sibling = el.previousSibling;
            while (sibling) {
                if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === el.nodeName) {
                    index++;
                }
                sibling = sibling.previousSibling;
            }
            const tagName = el.nodeName.toLowerCase();
            const part = `${tagName}[${index}]`;
            parts.unshift(part);
            el = el.parentNode;
        }
        return '/' + parts.join('/');
    }

    function getRelativeXPath(el) {
        if (el.id) {
            return `//*[@id="${el.id}"]`;
        }
        const path = [];
        while (el && el.nodeType === Node.ELEMENT_NODE) {
            let selector = el.nodeName.toLowerCase();

            if (typeof el.className === 'string' && el.className.trim()) {
                const classes = el.className.trim().split(/\s+/).filter(Boolean);
                if (classes.length > 0) {
                    selector += '.' + classes.join('.');
                }
            }

            path.unshift(selector);
            el = el.parentNode;
        }
        return '//' + path.join('/');
    }


    function getXPathWithAttributes(el) {
        if (el.id) {
            return `//*[@id="${el.id}"]`;
        }
        const attributes = Array.from(el.attributes)
            .filter(attr => attr.name !== 'id' && attr.name !== 'class')
            .map(attr => `@${attr.name}="${attr.value}"`)
            .join(' and ');
        const tagName = el.nodeName.toLowerCase();
        if (attributes) {
            return `//${tagName}[${attributes}]`;
        } else {
            return `//${tagName}`;
        }
    }

    function getXPathWithIndex(el) {
        const path = [];
        while (el && el.nodeType === Node.ELEMENT_NODE) {
            let index = 1;
            let sibling = el.previousSibling;
            while (sibling) {
                if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === el.nodeName) {
                    index++;
                }
                sibling = sibling.previousSibling;
            }
            const tagName = el.nodeName.toLowerCase();
            const part = `${tagName}[${index}]`;
            path.unshift(part);
            el = el.parentNode;
        }
        return '//' + path.join('/');
    }

    function getXPathWithText(el) {
        const text = el.textContent.trim();
        if (text) {
            const tagName = el.nodeName.toLowerCase();
            return `//${tagName}[text()="${text}"]`;
        }
        return null;
    }

    const xpaths = {
        absoluteXPath: getAbsoluteXPath(element),
        relativeXPath: getRelativeXPath(element),
        xpathWithAttributes: getXPathWithAttributes(element),
        xpathWithIndex: getXPathWithIndex(element),
        xpathWithText: getXPathWithText(element)
    };

    return xpaths;
}
CommonErpAppDataTracker.prototype.isRelevantElement = function (_element) {
    if (_element == null) {
        return false;
    }
    if (_element.nodeName === "DIV" || _element.nodeName === "BUTTON" || _element.nodeName === "SPAN") {
        let dai = _element.getAttribute("data-automation-id");
        if (dai?.includes("titleText") || dai?.includes("inboxItemSelected") || dai?.includes("inboxItem") || dai?.includes("inboxItemWrapper")) {
            return true;
        } else {
            let parentMatch = _element.closest('div[data-automation-id*="titleText"], div[data-automation-id*="inboxItemSelected"], div[data-automation-id*="inboxItem"], div[data-automation-id*="inboxItemWrapper"]');
            if (parentMatch) {
                return true;
            }
        }
    }
}

CommonErpAppDataTracker.prototype.getKeywordName = function (actionType, _element, _label) {
    if (actionType == "CLICK") {

        if (_element.nodeName == "INPUT") {
            if (thisErpApp.checkForOFDropdown(_element)) {
                return "Select data from dropdown '" + _label + "'";
            }
            if (_element.type != null && _element.type == "checkbox") {
                return "Select checkbox '" + _label + "'";
            }
            else if (_element.type != null && _element.type == "radio") {
                return "Select radio button '" + _label + "'";
            }
            else if (_element.type != null && _element.type == "button") {
                return "Click on '" + _label + "'";
            }
            else if (_element.type != null && _element.type == "text" &&
                _element.getAttribute("data-automation-id") !== null &&
                _element.getAttribute("data-automation-id") === "searchBox"
            ) {
                return "Select data in '" + _label + "'";
            }
            else if (_element.type != null && _element.type == "text") {
                return "Click on '" + _label + "'";
            }
            else if (_element.type != null && _element.type == "password") {
                return "Click on '" + _label + "'";
            }
            else if (_element.type != null && _element.type == "number") {
                return "Select '" + _label + "'";
            }
        }

        if (thisErpApp.checkForOFDropdown(_element)) {
            return "Select data from dropdown '" + _label + "'";
        }

        if (_element.nodeName == "SELECT") {
            return null;
        }

        if (_element.nodeName === "DIV" && _element.getAttribute("data-automation-id")?.includes("selectSelectedOption")) {
            return "Select a value from '" + _label + "'";
        }

        if (_element.nodeName === "LI" && _element.getAttribute("data-automation-id")?.includes("menuItem")
            && _element.getAttribute("data-uxi-widget-type")?.includes("selectinputlistitem")) {
            return "Select a value from '" + _label + "'";
        }
        if (thisErpApp.isRelevantElement(_element)) {
            return "Click on Relevant Task";
        }
        if (checkForOFDateDropdown(_element)) {
            return "Select '" + _label + "'";
        }
        return "Click on '" + _label + "'";
    }

    if (actionType == "FOCUSOUT") {
        if (_element.nodeName == "INPUT") {
            if (_element.type != null && _element.type == "password") {
                return "Enter '" + _label + "'";
            }

            if (_element.getAttribute("aria-label") !== null && _element.getAttribute("aria-label") === "Username") {
                return "Enter '" + _label + "'";
            }

            if (_element.type != null && _element.type == "file") {
                return "Upload a file by clicking 'Select files'"
            }

            if (_element.type != null && _element.type == "checkbox") {
                return "Select checkbox '" + _label + "'";
            }

            if (_element.type != null && _element.type == "text" &&
                _element.getAttribute("data-automation-id") !== null &&
                _element.getAttribute("data-automation-id") === "searchBox"
            ) {
                return "Select data in '" + _label + "'";
            }

            if (_element.type != null && _element.type == "number") {
                return "Select '" + _label + "'";
            }

            if (_element.type != null && _element.type == "radio") {
                return "Select radio button '" + _label + "'";
            }
        }
        if (_element.nodeName == "SELECT") {
            var text = _element.options[_element.selectedIndex].text;
            return "Select a value from '" + _label + "'";
            // return "Select '" + text + "' on field '" + _label + "'";
        }
        if (_element.getAttribute("data-automation-id") !== null && _element.getAttribute("data-automation-id") === "globalSearchInput") {
            return "Enter '" + _element.value + "' in '" + _label + "'";
        }
        // return "User has entered text '" + thisErpApp.maskDataIfPrivilegeAssigned(_element.value) + "' on text field '" + _label + "'";

        if (thisErpApp.checkForOFDropdown(_element)) {
            return "Select data from dropdown '" + _label + "'";
        }
        return "Enter data in '" + _label + "'";
    }

    if (actionType == "MOUSEDOWN") {        //only doing this for search bcz in other case it is creating duplicates
        if (IsInAutomation() == false && isWorkDayApp() == true) {
            if (_element.nodeName === "INPUT" && _element.getAttribute("placeholder") == null &&
                _element.getAttribute("data-automation-id") !== null &&
                _element.getAttribute("data-automation-id") === "globalSearchInput") {
                return "Click on '" + _label + "'";
            }
        }
    }
};

function checkForOFDateDropdown(_element) {
    if (isOracleFusionApp()) {
        let dropDownElement = _element.getAttribute("data-afr-adffdow");

        if (dropDownElement != null) {
            return true;
        }
        let idValue = _element.getAttribute("id");

        if (idValue !== null) {
            let splitId = idValue.split("::");
            if (splitId !== null && splitId[0] !== null && checkIsDateDropdownExpamdButton(splitId[1]) === true) {
                let newId = splitId[0] + "::content";

                let inputElement = document.getElementById(newId);
                if (inputElement != null) {
                    return checkForOFDateDropdown(inputElement);
                }
            }
        }
    }
}

function checkIsDateDropdownExpamdButton(_identifier) {
    if (!_identifier || _identifier.trim() === "") {
        return false;
    }
    _identifier = _identifier.trim();

    if (_identifier === "glyph") {
        return true;
    }
    return false;
}

async function getAgentRolesAndPrivileges() {
    return new Promise(function (resolve, reject) {
        try {
            chrome.runtime.sendMessage({
                GetAllAgentRolesAndPrivileges: {}
            }, function (response) {
                if (isExtensionDisconnected() == true) {
                    resolve(null);
                }
                resolve(response);
            });

        } catch (e) {
            catchObiqFunctionExceptions(e);
            resolve(null);
        }
    });
}

CommonErpAppDataTracker.prototype.checkForOFDropdown = function (_element) {
    if (isOracleFusionApp() == true) {

        let dropDownElement = _element.closest('[role="combobox"], [class*="oj-searchselect"]');

        if (dropDownElement != null) {
            return true;
        }

        let idValue = _element.getAttribute("id");

        if (idValue !== null) {
            let splitId = idValue.split("::");
            if (splitId !== null && splitId[0] !== null && checkIsDropdownExpamdButton(splitId[1]) === true) {
                let newId = splitId[0] + "::content";

                let inputElement = document.getElementById(newId);
                if (inputElement != null) {
                    return thisErpApp.checkForOFDropdown(inputElement);
                }
            }
        }
    }
    return false;
};

function checkIsDropdownExpamdButton(_identifier) {
    if (!_identifier || _identifier.trim() === "") {
        return false;
    }
    _identifier = _identifier.trim();

    if (_identifier === "lovIconId") {
        return true;
    }
    return false;
}

function removeFromDoubleColon(str) {
    if (str === null || str === "" || str === undefined) {
        return "";
    }
    const index = str.indexOf("::");
    if (index !== -1) {
        return str.substring(0, index);
    }
    return str;
}

CommonErpAppDataTracker.prototype.maskDataIfPrivilegeAssigned = function (_unmaskedData) {
    if (true) {
        return "#############";
    }
    return _unmaskedData;
}

CommonErpAppDataTracker.prototype.getOJLabelElement = function (_element) {
    var _elementId = _element.getAttribute("id");
    if (_elementId != null) {
        var _allLabels = document.querySelectorAll("label, oj-label");
        for (var i = 0; i < _allLabels.length; i++) {
            var _labelElement = _allLabels[i];
            if (_labelElement) {
                let _labelFor = _labelElement.getAttribute("for");
                if (_labelFor) {

                    if (_labelFor === _elementId) {
                        return _labelElement;
                    }

                    _elementId = _elementId.split("|")[0];

                    _labelFor = _labelFor.split("|")[0];

                    if (_elementId == null || _labelFor == null) {
                        continue;
                    }

                    _elementId = _elementId.trim();
                    _labelFor = _labelFor.trim();

                    if (_labelFor === _elementId) {
                        return _labelElement;
                    }
                }
            }
        }
    }

    let _aria_labelledby = _element.getAttribute("aria-labelledby");

    if (_aria_labelledby != null) {
        let oj_label_element = document.getElementById(_aria_labelledby);
        if (oj_label_element) {
            return oj_label_element;
        }
    }

    return null;
};

CommonErpAppDataTracker.prototype.getElementLabel = function (_element) {

    _element = thisErpApp.filterElementLabel(_element);

    if (_element == null) {
        return;
    }

    let _label = null;
    var _elementId = _element.getAttribute("id");
    if (_elementId != null) {
        var _allLabels = document.querySelectorAll("label, oj-label");
        for (var i = 0; i < _allLabels.length; i++) {
            var _labelElement = _allLabels[i];
            if (_labelElement) {
                let _labelFor = _labelElement.getAttribute("for");
                if (_labelFor) {

                    if (_labelFor === _elementId) {
                        _label = _labelElement.innerText;
                        break;
                    }

                    _elementId = _elementId.split("|")[0];

                    _labelFor = _labelFor.split("|")[0];

                    if (_elementId == null || _labelFor == null) {
                        continue;
                    }

                    _elementId = _elementId.trim();
                    _labelFor = _labelFor.trim();

                    if (_labelFor === _elementId) {
                        _label = _labelElement.innerText;
                        break;
                    }
                }
            }
        }
    }

    if (_element.nodeName === "BUTTON") {
        let dai = _element.getAttribute("data-automation-id");
        if (dai !== null && (dai.includes("_preview"))) {
            let parElement = _element.parentNode;
            if (parElement.nodeName === "DIV") {
                _label = parElement.getAttribute("aria-label");
            }
        }
        if (dai !== null && dai.includes("pex-search-source")) {
            _label = _element.innerText;
        }
    }

    if (thisErpApp.isNotNullOrBlank(_label)) {
        return _label;
    }




    if (_element.parentNode != null) {

        if (_element instanceof HTMLElement && _element.parentNode instanceof HTMLElement) {
            let dataMetadataId = _element.parentNode.getAttribute("data-metadata-id");

            if (dataMetadataId == null && _element.nodeName == "TEXTAREA") {
                let tempParent = _element.parentNode;
                if (tempParent !== null && tempParent.parentNode !== null) {
                    dataMetadataId = tempParent.parentNode.getAttribute("data-metadata-id");
                }
            }


            if (dataMetadataId != null) {
                let foundElement = oft_getElementByXpath("//*[@data-ecid='" + dataMetadataId.trim() + "']", document);
                if (foundElement != null) {
                    if (thisErpApp.isNotNullOrBlank(foundElement.innerText)) {
                        return foundElement.innerText;
                    }
                }
            }
        }
    }
    if (_element.nodeName === "TD") {
        let headerID = _element.getAttribute("headers")
        let headerElement = findAllNodesByXpath(document, "//*[@id='" + headerID + "']")
        if (headerElement.length > 0) {
            return headerElement[0].innerText
        }
    }

    let _aria_labelledby = _element.getAttribute("aria-labelledby");

    if (_aria_labelledby == null) {
        _aria_labelledby = _element.getAttribute("aria-describedby");
    }

    if (_aria_labelledby != null) {
        let oj_label_element = document.getElementById(_aria_labelledby.trim());
        if (oj_label_element) {
            _label = oj_label_element.innerText;
        }
    }

    if (thisErpApp.isNotNullOrBlank(_label)) {
        return _label;
    }

    _label = _element.innerText;
    if (thisErpApp.isNotNullOrBlank(_label)) {
        return _label;
    }

    _label = _element.getAttribute("placeholder");
    if (thisErpApp.isNotNullOrBlank(_label)) {
        return _label;
    }

    _label = _element.getAttribute("aria-label");
    if (thisErpApp.isNotNullOrBlank(_label)) {
        return _label;
    }

    _label = _element.getAttribute("title");
    if (thisErpApp.isNotNullOrBlank(_label)) {
        return _label;
    }

    var firstChild = _element.childNodes[0];
    if (firstChild && firstChild.nodeType === Node.ELEMENT_NODE) {
        var title = firstChild.getAttribute("title");
        if (title) {
            return title;
        }
    }

    _label = thisErpApp.getLabelFromCoordinateLogic(_element);
    if (thisErpApp.isNotNullOrBlank(_label)) {
        return _label;
    }

    _label = _element.getAttribute("id");
    if (thisErpApp.isNotNullOrBlank(_label)) {
        return _label;
    }

    _label = _element.getAttribute("name");
    if (thisErpApp.isNotNullOrBlank(_label)) {
        return _label;
    }

    _label = _element.getAttribute("className");
    if (thisErpApp.isNotNullOrBlank(_label)) {
        return _label;
    }

    if (_element.nodeName === "INPUT") {
        if (_element.value !== null && _element.value !== "") {
            return _element.value;
        }
    }

    return _element.nodeName;
};

CommonErpAppDataTracker.prototype.getLabelFromCoordinateLogic = function (el, opts = {}) {
    if (!el || el.nodeType !== 1) return null;

    if (isWorkDayApp() == false && isOracleFusionApp() == false) {
        const wrappingLabel = el.closest('label');
        if (wrappingLabel && wrappingLabel.textContent) {
            const cleaned = wrappingLabel.textContent.replace(/\*/g, '').replace(/\s+/g, ' ').trim();
            if (cleaned.length > 0) return cleaned;
        }
    }

    const P = {
        leftWeight: 0.7,   // left = highest priority
        aboveWeight: 1.0,  // top = second priority
        rightWeight: 2.0,  // less preferred
        belowWeight: 3.0,  // lowest priority
        radius: opts.radius ?? 0,
    };

    const elRect = rect(el);
    if (!elRect) return null;

    // Table-aware header lookup
    const cell = el.closest('td,th');
    const table = cell ? cell.closest('table') : null;
    if (table) {
        const t = nearestTableHeaderText(table, cell, elRect);
        if (t) return t;
    }

    const doc = el.ownerDocument || document;
    const candidates = [...doc.querySelectorAll('label,th')].filter(n =>
        n !== el && isVisible(n) && hasText(n) && hasBox(n)
    );

    let best = null;
    for (const n of candidates) {
        const r = rect(n);
        if (!r) continue;

        if (P.radius > 0) {
            const d = Math.hypot(centerX(r) - centerX(elRect), centerY(r) - centerY(elRect));
            if (d > P.radius) continue;
        }

        const score = directionalDistance(elRect, r, P);
        if (!best || score < best.score) best = { node: n, score };
    }
    return best ? cleanText(best.node.textContent) : null;

    // -------- helpers --------

    function nearestTableHeaderText(tbl, cellNode, targetRect) {
        const headers = collectAboveHeaders(tbl, cellNode);
        if (!headers.length) return null;

        const ex = centerX(targetRect);
        let best = null;
        for (const h of headers) {
            if (!hasBox(h)) continue;
            const hr = rect(h);
            const dy = Math.max(0, targetRect.top - hr.bottom);
            const dx = Math.abs(centerX(hr) - ex);
            const score = dy * 2 + dx * 1;
            if (!best || score < best.score) best = { node: h, score };
        }
        return best ? cleanText(best.node.textContent) : null;
    }

    function collectAboveHeaders(tbl, cellNode) {
        const result = [];
        const thead = tbl.querySelector('thead');
        if (thead) result.push(...thead.querySelectorAll('th'));
        const allRows = [...tbl.querySelectorAll('tr')];
        const row = cellNode.closest('tr');
        const idx = allRows.indexOf(row);
        if (idx > 0) {
            for (let i = idx - 1; i >= 0; i--) {
                const ths = [...allRows[i].children].filter(n => n.tagName?.toLowerCase() === 'th');
                if (ths.length) { result.push(...ths); break; }
            }
        }
        return [...new Set(result)].filter(n => isVisible(n) && hasText(n) && hasBox(n));
    }

    function directionalDistance(a, b, weights) {
        const ax = centerX(a), ay = centerY(a);
        const bx = centerX(b), by = centerY(b);
        const dx = Math.abs(bx - ax);
        const dy = Math.abs(by - ay);

        let w = weights.belowWeight;
        if (b.right <= a.left) w = weights.leftWeight;       // left = highest priority
        else if (b.bottom <= a.top) w = weights.aboveWeight; // top = second
        else if (b.left >= a.right) w = weights.rightWeight;
        const overlapBonus = (overlapsVert(a, b) || overlapsHoriz(a, b)) ? 0.85 : 1;
        return (dx + dy) * w * overlapBonus;
    }

    function rect(node) {
        const r = node.getBoundingClientRect?.();
        if (!r || (r.width === 0 && r.height === 0)) return null;
        return r;
    }
    function hasBox(node) {
        const r = node.getBoundingClientRect?.();
        return !!(r && (r.width > 0 || r.height > 0));
    }
    function centerX(r) { return r.left + r.width / 2; }
    function centerY(r) { return r.top + r.height / 2; }
    function overlapsHoriz(a, b) { return !(b.right < a.left || b.left > a.right); }
    function overlapsVert(a, b) { return !(b.bottom < a.top || b.top > a.bottom); }

    function isVisible(n) {
        const cs = getComputedStyle(n);
        if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return false;
        return true;
    }
    function hasText(n) { return cleanText(n.textContent || '').length > 0; }
    function cleanText(t) {
        return (t || '')
            .replace(/\*/g, '')   // remove * characters
            .replace(/\s+/g, ' ')
            .trim();
    }
};

CommonErpAppDataTracker.prototype.isNotNullOrBlank = function (s) {
    if (typeof s !== 'string') {
        return s != null && s !== '';
    }

    let trimmed = s.trim();
    if (trimmed === '') return false;

    // Return false if string equals MM, DD, YY, or YYYY (case-insensitive)
    const invalidTokens = ["MM", "DD", "YY", "YYYY"];
    if (invalidTokens.includes(trimmed.toUpperCase())) {
        return false;
    }

    // Check if string is all lowercase
    let isAllLower = trimmed === trimmed.toLowerCase();

    // Check if contains special char or number
    let hasSpecialOrNumber = /[^a-z\s]/.test(trimmed);

    // Ignore case: all lowercase + contains special/number
    if (isAllLower && hasSpecialOrNumber) {
        return false;
    }

    return true;
};




CommonErpAppDataTracker.prototype.filterElementLabel = function (_element) {

    if (isWorkDayApp() == true) {
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

    if (isOracleFusionApp() == true) {
        const hasUsefulAttribute = (el) =>
            el &&
            (
                el.getAttribute("title") !== null ||
                el.getAttribute("aria-label") !== null ||
                el.getAttribute("placeholder") !== null ||
                el.getAttribute("name") !== null ||
                el.nodeName === "LABEL"
            );

        if (_element.nodeName === "BUTTON" && (_element.innerText != null || _element.textContent != null)) {
            return _element;
        }

        if (_element.nodeName === 'A') {
            let ancerID = _element.getAttribute("id");
            if (ancerID?.includes("dropdownPopup::popupsearch") && (_element.innerText != null || _element.textContent != null)) {
                return _element;
            }
        }

        let eleID = _element?.getAttribute("id");
        if (eleID != null) {
            let foundLbl = thisErpApp.getElementByXPath("//label[@for = '" + eleID + "']");
            if (foundLbl) {
                return foundLbl;
            }
            eleID = removeFromDoubleColon(eleID) + '::content';
            foundLbl = thisErpApp.getElementByXPath("//label[@for = '" + eleID + "']");
            if (foundLbl) {
                return foundLbl;
            }
        }

        if (IsInAutomation() == false) {
            if (_element.nodeName === "A" && !_element.hasChildNodes()) {

                if (hasUsefulAttribute(_element)) {
                    return _element;
                }

                let foundLabel = findPreviousLabel(_element);
                if (foundLabel !== null) {
                    return foundLabel;
                }
            }

            if (_element.nodeName === "A" && _element.getAttribute("role") != null && _element.getAttribute("role") === "button" && _element.hasChildNodes()) {

                let childEle = _element.firstChild;
                if (childEle?.nodeName === "SPAN") {
                    let text = childEle.innerText || childEle.textContent;
                    if (text) {
                        return childEle;
                    }
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
    return _element;
}

function findPreviousLabel(elem) {
    // 1) <label for="elem.id">
    if (elem.id) {
        const byFor = document.querySelector(`label[for="${elem.id}"]`);
        if (byFor) return byFor;
    }

    // 2) wrapped label: <label>…<input>…</label>
    const wrapped = elem.closest('label');
    if (wrapped) return wrapped;

    // 3) scan previousElementSibling for a <label>
    let sib = elem.previousElementSibling;
    while (sib) {
        if (sib.tagName.toLowerCase() === 'label') {
            return sib;
        }
        sib = sib.previousElementSibling;
    }

    // 4) fallback: nearest preceding <label> anywhere
    const xpath = 'preceding::label[1]';
    const result = document.evaluate(
        xpath,
        elem,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    );
    return result.singleNodeValue;
}

function getInteractableElementsWithin(container) {

    const xpath = `
    .//a[@href]
    | .//button[not(@disabled)]
    | .//input[not(@type="hidden") and not(@disabled)]
    | .//textarea[not(@disabled)]
    | .//select[not(@disabled)]
  `;

    const result = [];
    const iterator = document.evaluate(
        xpath.trim().replace(/\s+/g, ' '), // flatten whitespace
        container,
        null,                                  // namespace resolver
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
    );

    let node;
    while ((node = iterator.iterateNext())) {
        result.push(node);
    }
    return result;
}

CommonErpAppDataTracker.prototype.getElementByXPath = function (xpath, source = document) {
    return document.evaluate(xpath, source, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

CommonErpAppDataTracker.prototype.craeteTrackingData = function (appEventType, appEventSubType, appEventLog, event) {
    var appType = thisErpApp.appType;
    var pageTitle = document.title;
    var pageUrl = document.URL;

    if (document.obiqTitle != null && document.obiqTitle != "") {
        pageTitle = document.obiqTitle;
    }

    if (document.obiqUrl != null && document.obiqUrl != "") {
        pageUrl = document.obiqUrl;
    }

    var moduleHeader = thisErpApp.getCurrentPageModuleHeader(event);

    var eventLogDelay = thisErpApp.getEventDelayTime();
    var pageLoadDelay = thisErpApp.getCurrentPageLoadTime();
    var trackedData = {
        "appType": appType,
        "dataId": thisErpApp.createUUID(),
        "pageTitle": pageTitle,
        "pageUrl": pageUrl,
        "moduleHeader": moduleHeader,
        "appEventType": appEventType,
        "appEventSubType": appEventSubType,
        "appEventLog": appEventLog,
        "eventLogDelay": eventLogDelay,
        "pageLoadDelay": pageLoadDelay,
        "userId": "",
        "sessionId": "",
        "areasToMaskInImage": thisErpApp.fetchEditableComponentsDimensions(),
        "areaToHighlightInImage": thisErpApp.fetchElementDimensions(event)
    }

    return trackedData;
};

CommonErpAppDataTracker.prototype.isElementInside = function (element1, element2, _devicePixelRatio) {

    try {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();

        return (
            (rect2.top * _devicePixelRatio) >= (rect1.top * _devicePixelRatio) &&
            (rect2.left * _devicePixelRatio) >= (rect1.left * _devicePixelRatio) &&
            (rect2.bottom * _devicePixelRatio) <= (rect1.bottom * _devicePixelRatio) &&
            (rect2.right * _devicePixelRatio) <= (rect1.right * _devicePixelRatio)
        );
    } catch (e) {
        return false;
    }
};

function isRectAllZero(rect) {
    return rect.top === 0 &&
        rect.left === 0 &&
        rect.right === 0 &&
        rect.bottom === 0 &&
        rect.width === 0 &&
        rect.height === 0;
}

function getIframeOffsets(element) {
    let x = 0;
    let y = 0;

    let iframe = element.ownerDocument.defaultView.frameElement;

    while (iframe) {
        const iframeRect = iframe.getBoundingClientRect();
        x += iframeRect.left;
        y += iframeRect.top;

        // move to parent iframe
        iframe = iframe.ownerDocument.defaultView.frameElement;
    }

    return { x, y };
}

let previouseElementDimensions = null;
CommonErpAppDataTracker.prototype.fetchElementDimensions = function (event) {
    if (event !== null) {
        const element = event.target;

        let rect = element.getBoundingClientRect();


        if (isWorkDayApp() == true) {
            if (isRectAllZero(rect)) {
                if (element.getAttribute("data-automation-id") !== null &&
                    element.getAttribute("data-automation-id") === "globalSearchInput" &&
                    previouseElementDimensions !== null) {
                    rect = previouseElementDimensions;
                    previouseElementDimensions = null;
                } else if (element.getAttribute("data-automation-id") !== null &&
                    element.getAttribute("data-automation-id") === "globalSearchInput" &&
                    previouseElementDimensions == null) {
                    let globalSearchElement = document.querySelector("div[id='wd-searchInput']");
                    if (globalSearchElement !== null) {
                        rect = globalSearchElement.getBoundingClientRect();
                    }
                }
            } else if (element.getAttribute("data-automation-id") !== null &&
                element.getAttribute("data-automation-id") === "globalSearchInput") {
                previouseElementDimensions = rect;
            }
        }
        if (isRectAllZero(rect)) {
            let lastElementRectData = sessionStorage.getItem("lastElementCache");
            if (lastElementRectData !== null && lastElementRectData !== "") {
                rect = JSON.parse(lastElementRectData);
            }
        }
        sessionStorage.removeItem("lastElementCache");

        let iframeOffset = getIframeOffsets(element);

        let _x = (rect.left + iframeOffset.x) * devicePixelRatio;
        let _y = (rect.top + iframeOffset.y) * devicePixelRatio;
        let _width = rect.width * devicePixelRatio;
        let _height = rect.height * devicePixelRatio;

        let ojLabelElement = thisErpApp.getOJLabelElement(element);
        if (ojLabelElement != null) {
            if (thisErpApp.isElementInside(element, ojLabelElement, devicePixelRatio) == true) {
                let labelRect = ojLabelElement.getBoundingClientRect();
                _y = _y + (labelRect.height * devicePixelRatio);
                _height = _height - (labelRect.height * devicePixelRatio);
            }
        }

        return {
            tagName: element.tagName.toLowerCase(),
            id: element.id || null,
            classList: element.classList.length ? Array.from(element.classList) : null,
            x: _x,
            y: _y + 8,
            width: _width,
            height: _height - 8,
        };
    }
}

CommonErpAppDataTracker.prototype.fetchEditableComponentsDimensions = function () {
    function isInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const topElement = document.elementFromPoint(centerX, centerY);

        if (!topElement || !element.contains(topElement)) {
            return false;
        }

        return (
            rect.bottom > 0 &&
            rect.right > 0 &&
            rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
            rect.left < (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function isVisible(element) {
        if (!element) return false;

        // Check for semantic hidden attributes.
        if (element.hasAttribute('hidden')) return false;
        if (element.getAttribute('aria-hidden') === 'true') return false;

        // Get the computed styles of the element.
        var style = window.getComputedStyle(element);

        // Check for CSS properties that make the element invisible.
        if (
            style.display === 'none' ||
            style.visibility === 'hidden' ||
            style.visibility === 'collapse' ||
            parseFloat(style.opacity) === 0
        ) {
            return false;
        }

        // Fallback check: if the element has no dimensions or client rects, it's likely not visible.
        if (!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)) {
            return false;
        }

        // Finally, check if any part of the element is in the viewport.
        return isInViewport(element);
    }



    const editableSelectors = [
        'input:not([type="button"]):not([type="checkbox"]):not([type="radio"]):not([data-automation-id="globalSearchInput"])',
        'textarea',
        'select',
        '[role="textbox"]',
        '[contenteditable="true"]',
        'div[data-automation-id="inboxItemWrapper"]',
        'li[role="option"]',
        'div[data-automation-id="banner"]',
        'div[data-automation-id="compositeListContainer"]',
        'h1[data-automation-id="pex-welcome-greeting"]'
    ];

    const tableElementSelectors = [
        '[_leafcolclientids] table > tbody > tr:not(:has(table))',
        '.oj-table-scroller table > tbody > tr > td:not(:has(table))'
    ];

    let visible_editableElements = Array.from(document.querySelectorAll(editableSelectors.join(',')))
        .filter(isVisible);

    visible_editableElements = visible_editableElements.filter(el => {
        if (el.matches('h1[data-automation-id="pex-welcome-greeting"]')) {
            return el.innerText.toLowerCase().includes("on behalf of:");
        }
        return true;
    });

    let visibleTableElements = Array.from(document.querySelectorAll(tableElementSelectors.join(',')))
        .filter(isVisible);

    visibleTableElements = thisErpApp.analytics_filterVisibleElements(visibleTableElements);

    visible_editableElements.push(...visibleTableElements);

    const devicePixelRatio = window.devicePixelRatio;

    const filteredElements = visible_editableElements.filter(element => {
        return !(element.nodeName === "INPUT" && (element.value == null || element.value === ""));
    });

    const componentsInfo = filteredElements.map(element => {

        // USE VISIBLE RECT INSTEAD OF FULL RECT
        const visibleRect = getVisibleRect(element);
        if (!visibleRect) return null;

        const iframeOffset = getIframeOffsets(element);

        let _x = (visibleRect.left + iframeOffset.x) * devicePixelRatio;
        let _y = (visibleRect.top + iframeOffset.y) * devicePixelRatio;
        let _width = visibleRect.width * devicePixelRatio;
        let _height = visibleRect.height * devicePixelRatio;

        const ojLabelElement = thisErpApp.getOJLabelElement(element);
        if (ojLabelElement != null) {
            if (thisErpApp.isElementInside(element, ojLabelElement, devicePixelRatio) == true) {
                const labelRect = ojLabelElement.getBoundingClientRect();
                _y = _y + (labelRect.height * devicePixelRatio);
                _height = _height - (labelRect.height * devicePixelRatio);
            }
        }

        if (_width <= 0 || _height <= 0) return null;

        return {
            tagName: element.tagName.toLowerCase(),
            id: element.id || null,
            classList: element.classList.length ? Array.from(element.classList) : null,
            x: _x,
            y: _y + 8,
            width: _width,
            height: _height - 8,
        };
    }).filter(Boolean);

    return componentsInfo;
};
function getVisibleRect(element) {
    if (!element) return null;

    const rect = element.getBoundingClientRect();

    let left = rect.left;
    let top = rect.top;
    let right = rect.right;
    let bottom = rect.bottom;

    // 🔥 Clip against ALL overflow ancestors
    const clippingParents = getClippingParents(element);

    clippingParents.forEach(parent => {
        const parentRect = parent.getBoundingClientRect();

        left = Math.max(left, parentRect.left);
        top = Math.max(top, parentRect.top);
        right = Math.min(right, parentRect.right);
        bottom = Math.min(bottom, parentRect.bottom);
    });

    // 🔥 Clip against viewport LAST
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    left = Math.max(left, 0);
    top = Math.max(top, 0);
    right = Math.min(right, viewportWidth);
    bottom = Math.min(bottom, viewportHeight);

    const width = right - left;
    const height = bottom - top;

    if (width <= 0 || height <= 0) {
        return null;
    }

    return { left, top, width, height };
}
function getClippingParents(element) {
    const parents = [];
    let parent = element.parentElement;

    while (parent && parent !== document.body) {
        const style = window.getComputedStyle(parent);

        const clipsX = style.overflowX === 'hidden' || style.overflowX === 'auto' || style.overflowX === 'scroll';
        const clipsY = style.overflowY === 'hidden' || style.overflowY === 'auto' || style.overflowY === 'scroll';

        if (clipsX || clipsY) {
            parents.push(parent);
        }

        parent = parent.parentElement;
    }

    return parents;
}


CommonErpAppDataTracker.prototype.createUUID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

CommonErpAppDataTracker.prototype.getEventDelayTime = function () {
    var diffTime = Date.now() - timeStampMillis;
    timeStampMillis = Date.now();
    return Math.round(diffTime);
};

CommonErpAppDataTracker.prototype.getCurrentPageLoadTime = function () {
    if (window.performance) {
        var timing = window.performance.getEntriesByType("navigation")[0];
        if (timing) {
            var pageLoadTime = timing.domComplete;
            return Math.round(pageLoadTime);
        }
    }
    return 0;
};

CommonErpAppDataTracker.prototype.getAppSpecificHeaderXpathList = function (_findPreceeding = true) {
    let outArray = new Array();
    if (isWorkDayApp()) {
        outArray.push(
            _findPreceeding == true ?
                'preceding::*[(self::h1 or self::h2) and contains(@data-automation-id, "pageHeaderTitle")][1]' : '//*[(self::h1 or self::h2) and contains(@data-automation-id, "pageHeaderTitle")][1]'
        );
    }

    else if (isOracleFusionApp()) {
        outArray.push("(//a[normalize-space(@title)='Navigator' and contains(concat(' ', normalize-space(@class), ' '), ' TabletNavigatorIcon ')])[1]/following::h1[1]");
    }
    else {
        outArray.push(_findPreceeding == true ? 'preceding::*[self::h1 or self::h2][1]' : '//*[self::h1 or self::h2][1]');
    }
    return outArray;
}

function findAllNodesByXpath(el, xpath) {
    let results = [];
    let query = document.evaluate(
        xpath,
        el,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );
    for (let i = 0; i < query.snapshotLength; i++) {
        results.push(query.snapshotItem(i));
    }
    return results;
}


CommonErpAppDataTracker.prototype.computeHeaderFromXpath = function (_element, _xpath, _checkVisible) {
    let precedingHeaders = findAllNodesByXpath(_element, _xpath);

    if (_checkVisible == true) {
        precedingHeaders = thisErpApp.getExactHeader(precedingHeaders);
    }
    return precedingHeaders;
}

CommonErpAppDataTracker.prototype.getAllHeadersText = function (_element, _xpath) {
    let elements = thisErpApp.computeHeaderFromXpath(_element, _xpath, false);

    return elements
        .map(el => el?.innerText?.trim())
        .filter(text => text && text.length > 0);
}


CommonErpAppDataTracker.prototype.getCurrentPageModuleHeader = function (event) {

    if (event != null && event.target != null) {
        const _element = event.target;

        let appSpecificHeaderXpathList = thisErpApp.getAppSpecificHeaderXpathList(true);


        const _header = thisErpApp.computeHeaderFromXpath(_element, appSpecificHeaderXpathList[0], true)[0];

        if (_header && _header.innerText && _header.innerText.trim() !== "") {
            return _header.innerText.trim();
        }
    }

    const pageTitle = document.title;
    if (pageTitle) {
        const splittedHeaders = pageTitle.split("-");
        if (splittedHeaders.length > 0) {
            return splittedHeaders[0].trim();
        }
    }
    return pageTitle;
};



CommonErpAppDataTracker.prototype.getExactHeader = function (headers) {

    headers = thisErpApp.analytics_filterVisibleElements(headers);
    if (headers != null && headers.length > 0) {
        return headers;
    }
    return [];
}


CommonErpAppDataTracker.prototype.sendDataToTelemtryServer = async function (dataToSend) {
    //this will skip start and stop proxy as deepti mam ask for
    if (await isDataSkipable(dataToSend)) {
        return;
    }

    let lastAppEventLog = sessionStorage.getItem("OBIQ_LAST_STEPDETAIL");

    if (dataToSend["appEventLog"] != null && lastAppEventLog != null) {
        if (dataToSend["appEventLog"].trim() === lastAppEventLog.trim()) {
            lastAppEventLog = dataToSend["appEventLog"];
            sessionStorage.setItem("OBIQ_LAST_STEPDETAIL", lastAppEventLog);
            return;
        }
    }

    if (dataToSend["appEventLog"] != null) {
        lastAppEventLog = dataToSend["appEventLog"];
        sessionStorage.setItem("OBIQ_LAST_STEPDETAIL", lastAppEventLog);
        window.setTimeout(function () {
            sessionStorage.removeItem("OBIQ_LAST_STEPDETAIL");
        }, 500);
    }

    dataToSend["stepOrderingTimeStamp"] = new Date().getTime();
    dataToSend["stepRecordingType"] = await getUserGuideRecordingType();
    if (await isUserGuideRecording() == true) {
        if ((await isWebUserGuideRecording()) === false) {
            return;
        }
    }
    (window.queueMicrotask || ((fn) => Promise.resolve().then(fn)))(async () => {
        try {
            let finalData = await sendMessageToBackgroundScriptWithPromise("SendDataToTelemetryServer", {
                mainDataDto: dataToSend,
                pageSnapShot: null
            });

            sendTrackedTelemetryDataToCompanionApp(finalData);
        } catch (err) {
            console.error("Telemetry send failed:", err);
        }
    });
};


async function isDataSkipable(dataToSend) {
    if (dataToSend["appType"] === "WORKDAY") {
        if (dataToSend["labelText"] === "Start Proxy" || dataToSend["pageTitle"].includes("Start Proxy")
            || dataToSend["labelText"] === "Stop Proxy" || dataToSend["pageTitle"].includes("Stop Proxy")) {
            return true;
        }
    }

    if (await isJourneyRecording() === false) {
        if (dataToSend["appEventSubType"] === "APPFUNCTIONAL_ERROR") {
            return true;
        }
    }
    return false;
}

CommonErpAppDataTracker.prototype.setCurrentPageSnapshot = async function () {

    return new Promise(function (resolve, reject) {
        try {
            let attempt = 0;
            let thredId = window.setInterval(async function () {
                if (isExtensionDisconnected() == true) {
                    window.clearInterval(thredId);
                }
                let pageSnapshot = await sendMessageToBackgroundScriptWithPromise("chrome.tabs.captureVisibleTab", {
                    format: "jpeg"
                });

                if (pageSnapshot !== null && pageSnapshot !== "") {
                    window.clearInterval(thredId);
                    //        localStorage.setItem("obiq_pagesnapshot", pageSnapshot);
                    resolve(pageSnapshot);
                    return;
                }

                if (attempt > 5) {
                    window.clearInterval(thredId);
                }
                attempt++;
            }, 100);
        } catch (e) {
            catchObiqFunctionExceptions(e);
            resolve(null);
        }
    });
}

CommonErpAppDataTracker.prototype.trackAppFunctionErrors = function () {

    window.setTimeout(function () {
        var labelElements = document.getElementsByTagName("LABEL");
        if (labelElements != null) {
            labelElements = thisErpApp.analytics_filterVisibleElements(labelElements);
            for (var lei = 0; lei < labelElements.length; lei++) {
                var labelElement = labelElements[lei];
                if (labelElement.innerText != null) {
                    var contentProcessId = labelElement.innerText;
                    if (contentProcessId.indexOf("Process") > -1 && contentProcessId.indexOf("submitted") > -1) {
                        contentProcessId = contentProcessId.replace("Process", "").replace("was submitted", "").replace(/\./g, "");
                        contentProcessId = contentProcessId.trim();
                        thisErpApp.sendProcessIdOfCurrentUser(contentProcessId);
                    }
                }
            }
        }


        let otherSceraioDivArray = oft_getElementByXpath("//td[contains(normalize-space(text()), 'Error')]/following::table[1]");

        if (otherSceraioDivArray != null) {
            otherSceraioDivArray = thisErpApp.analytics_filterVisibleElements([otherSceraioDivArray]);
            if (otherSceraioDivArray != null && otherSceraioDivArray.length > 0) {

                let _tableElement = otherSceraioDivArray[0];



                if (_tableElement != null && _tableElement.opkeyErrorHandled == null) {

                    _tableElement.opkeyErrorHandled = true;

                    let trArraysElements = [];

                    let tableBody = _tableElement.getElementsByTagName("TBODY")[0];

                    if (tableBody != null && tableBody.childNodes != null) {
                        for (let chn = 0; chn < tableBody.childNodes.length; chn++) {
                            let trNode = tableBody.childNodes[chn];
                            if (trNode.nodeName == "TR") {
                                trArraysElements.push(trNode);
                            }
                        }

                    }

                    if (trArraysElements.length > 0) {

                        let errorsArray = [];
                        for (let trai = 0; trai < trArraysElements.length; trai++) {
                            var errorObject = new Object();
                            errorObject["appEventLog"] = trArraysElements[trai].innerText;
                            errorsArray.push(errorObject);

                            var trackedData = thisErpApp.craeteTrackingData("DEBUG", "APPFUNCTIONAL_ERROR", errorObject["appEventLog"], null);
                            thisErpApp.sendDataToTelemtryServer(trackedData);
                        }

                        if (errorsArray.length > 0) {
                            var message = new Object();
                            message["action"] = "oft_notifyAppFunctionalError";
                            message["messageBody"] = errorsArray;
                            if (document.title != null) {
                                message["pageTitle"] = document.title;
                            }
                            if (document.obiqTitle != null && document.obiqTitle != "") {
                                message["pageTitle"] = document.obiqTitle;
                            }
                            window.postMessage(message);
                        }
                    }
                }
            }
        }

        var tableElements = document.getElementsByTagName("DIV");
        if (tableElements != null) {
            tableElements = thisErpApp.analytics_filterVisibleElements(tableElements);
            for (var i = 0; i < tableElements.length; i++) {
                var tableElement = tableElements[i];

                if (!(tableElement.classList.contains("AFPopupSelector") || tableElement.classList.contains("AFNoteWindowContent") || (tableElement.id != null && tableElement.id.indexOf(":autoDismissPopup::content") > -1))) {
                    continue;
                }
                if (tableElement.outerHTML != null && tableElement.opkeyErrorHandled == null) {
                    var tBodyElement = tableElement.getElementsByTagName("TBODY")[0];
                    if (tBodyElement == null) {
                        continue;
                    }

                    if (tBodyElement.outerHTML.indexOf("Error") > -1 || tBodyElement.outerHTML.indexOf("qual_error_") > -1) {
                        var errorMessage = tBodyElement.innerText;

                        var msgHederdivElementList = tBodyElement.getElementsByTagName("DIV");

                        var errorsArray = [];
                        for (var mhd = 0; mhd < msgHederdivElementList.length; mhd++) {
                            var msgHederdivElement = msgHederdivElementList[mhd];

                            if (msgHederdivElement.innerText != null && msgHederdivElement.innerText.indexOf("Messages for this page are listed below") > -1) {
                                if (msgHederdivElement.nextSibling && msgHederdivElement.nextSibling.childNodes[0] != null) {
                                    var tbodyElement = msgHederdivElement.nextSibling.childNodes[0];

                                    for (var tri = 0; tri < tbodyElement.childNodes.length; tri++) {
                                        var errorRow = tbodyElement.childNodes[tri];
                                        var errorObject = new Object();
                                        errorObject["appEventLog"] = errorRow.innerText;
                                        errorsArray.push(errorObject);
                                    }
                                }
                            }
                        }

                        tableElement.opkeyErrorHandled = true;

                        var canAdd = true;
                        if (errorMessage != null) {

                            if (errorMessage.indexOf("Ok") > -1 && errorMessage.indexOf("Cancel") > -1) {
                                canAdd = false;
                            }

                            if (errorMessage.indexOf("OK") > -1 && errorMessage.indexOf("Cancel") > -1) {
                                canAdd = false;
                            }

                            if (errorMessage.indexOf("Submit") > -1 && errorMessage.indexOf("Cancel") > -1) {
                                canAdd = false;
                            }

                            if (errorMessage.indexOf("Add Files") > -1) {
                                canAdd = false;
                            }
                        }

                        if (canAdd == true) {
                            var trackedData = thisErpApp.craeteTrackingData("DEBUG", "APPFUNCTIONAL_ERROR", errorMessage, null);
                            thisErpApp.sendDataToTelemtryServer(trackedData);

                            if (errorsArray.length > 0) {
                                var message = new Object();
                                message["action"] = "oft_notifyAppFunctionalError";
                                message["messageBody"] = errorsArray;
                                if (document.title != null) {
                                    message["pageTitle"] = document.title;
                                }

                                if (document.obiqTitle != null && document.obiqTitle != "") {
                                    message["pageTitle"] = document.obiqTitle;
                                }
                                window.postMessage(message);
                            }
                            else {
                                var errorMessageToSend = new Object();
                                errorMessageToSend["appEventLog"] = trackedData["appEventLog"];
                                var message = new Object();
                                message["action"] = "oft_notifyAppFunctionalError";
                                message["messageBody"] = [errorMessageToSend];
                                if (document.title != null) {
                                    message["pageTitle"] = document.title;
                                }
                                if (document.obiqTitle != null && document.obiqTitle != "") {
                                    message["pageTitle"] = document.obiqTitle;
                                }
                                window.postMessage(message);
                            }


                        }
                    }
                }
            }
        }

        let messgaeBasedElement = oft_getElementByXpath("//label[normalize-space(text())='Message']/following::li");
        if (messgaeBasedElement != null && messgaeBasedElement.opkeyErrorHandled == null) {

            let messageEleemntsArray = thisErpApp.analytics_filterVisibleElements([messgaeBasedElement]);
            if (messageEleemntsArray != null && messageEleemntsArray.length > 0) {

                messageEleemntsArray[0].opkeyErrorHandled = true;
                let errorsArray = [];
                var errorObject = new Object();
                errorObject["appEventLog"] = messageEleemntsArray[0].innerText;
                errorsArray.push(errorObject);

                var trackedData = thisErpApp.craeteTrackingData("DEBUG", "APPFUNCTIONAL_ERROR", errorObject["appEventLog"], null);
                thisErpApp.sendDataToTelemtryServer(trackedData);

                var message = new Object();
                message["action"] = "oft_notifyAppFunctionalError";
                message["messageBody"] = errorsArray;
                if (document.title != null) {
                    message["pageTitle"] = document.title;
                }
                if (document.obiqTitle != null && document.obiqTitle != "") {
                    message["pageTitle"] = document.obiqTitle;
                }
                window.postMessage(message);
            }
        }

        thisErpApp.trackAppFunctionErrors();
    }, 500);
};

function oft_getElementByXpath(xpath, context = document) {
    const result = document.evaluate(
        xpath,
        context,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    );
    return result.singleNodeValue;
}

CommonErpAppDataTracker.prototype.analytics_istablevalid = function (_table) {
    var _headres = _table.getElementsByTagName("TBODY");
    if (_headres.length > 0) {
        return true;
    }
    return false;
};

CommonErpAppDataTracker.prototype.analytics_filterVisibleElements = function (_elementsArray) {
    const outArray = [];
    for (const _element of _elementsArray) {
        if (thisErpApp.analytics_IsElementVisible(_element)) {
            outArray.push(_element);
        }
    }
    return outArray;
};



CommonErpAppDataTracker.prototype.analytics_IsElementVisible = function (elem) {
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

function isWorkDayApp() {
    if (thisErpApp.appType == null) {
        return false;
    }

    if (thisErpApp.appType == "WORKDAY") {
        return true;
    }

    return false;
}

function isOracleFusionApp() {
    if (thisErpApp.appType == null) {
        return false;
    }

    if (thisErpApp.appType == "ORACLEFUSION") {
        return true;
    }

    return false;
}

var currentHandledData = null;
CommonErpAppDataTracker.prototype.startTracking = function (_erpAppName) {
    thisErpApp.appType = _erpAppName;
    thisErpApp.trackAppFunctionErrors();
    thisErpApp.attachListener();
    custom_raisePageChangeEvent();

    var guideThread = window.setInterval(function () {
        if (isExtensionDisconnected() == true) {
            window.clearInterval(guideThread);
        }

        try {
            addRemoteJs(chrome.runtime.getURL("Obiq/assets/analytics/js/apps/tools/genericappinterceptor.js"));
        } catch (e) {
            catchObiqFunctionExceptions(e);
        }

        chrome.runtime
            .sendMessage({
                GetOpkeyOneJourneyDtoBinding: "GetOpkeyOneJourneyDtoBinding"
            }, function (response) {
                if (response != null) {
                    if (currentHandledData == null) {
                        var message = new Object();
                        message["action"] = "event_showUserGuide";
                        message["messageBody"] = response;
                        window.postMessage(message);
                        currentHandledData = JSON.stringify(response);
                        window.clearInterval(guideThread);
                    }
                }
            });
    }, 500);

    oft_onPageLoad(function () {

        if (IsInAutomation() == false) {
            addTraceIaSolutionDiv();
            oft_divActivatorListener();

            thisErpApp.attachPostMessageListener();
            oft_listenForMessages();
        }

        if (isCurrentPageIsCompanionAppPage() == true) {
            oft_addPostMessageListener();
        }

    });


};

function custom_raisePageChangeEvent() {

    if (IsInAutomation()) {
        return;
    }
    if (window.OBIQ_RAISE_PAGE_CHANGE_EVENT) {
        return;
    }

    window.OBIQ_RAISE_PAGE_CHANGE_EVENT = true;

    var thread01 = window.setInterval(function () {
        if (isExtensionDisconnected() == true) {
            window.clearInterval(thread01);
        }
        notifyCompanionAppWithSuggestedUserGuides(true);
    }, 1000);

}

function notifyCompanionAppWithSuggestedUserGuides(check) {
    if (lastEventCaptured) {
        try {
            let pageTitle = document.title;
            let moduleHeader = thisErpApp.getCurrentPageModuleHeader(lastEventCaptured);
            let finalKey = pageTitle + "_" + moduleHeader;
            let lastKey = sessionStorage.getItem("CURRENT_TITLE_KEY_SUGGESTION_API");

            if (check === true) {
                if (lastKey) {
                    if (lastKey === finalKey) {
                        return;
                    }
                }
            }
            sessionStorage.setItem("CURRENT_TITLE_KEY_SUGGESTION_API", finalKey);

            let dataToSend = new Object();
            dataToSend["appType"] = thisErpApp.appType;
            dataToSend["pageTitle"] = pageTitle;
            dataToSend["moduleHeader"] = moduleHeader;
            dataToSend["limitBy"] = 50
            let messageObject = getMessageWrapper("COMP_APP_SHOW_SUGGESTED_USER_GUIDES", dataToSend);
            //console.log(messageObject)
            sendDataToCompanionApp(messageObject);
        } catch (e) {
            console.error(e);
        }
    }
}

function notifyCompanionAppWin32RecorderInitialized(responseData) {
    window.setTimeout(function () {
        let messageObject = getMessageWrapper("COMP_APP_WIN32_RECORDER_LOADED", { "responseData": responseData });
        sendDataToCompanionApp(messageObject);
    }, 3000);
}

function notifyCompanionAppInitParams() {
    try {

        let dataToSend = new Object();
        dataToSend["appType"] = thisErpApp.appType;
        let messageObject = getMessageWrapper("OPEN_COMP_APP", dataToSend);
        //console.log(messageObject)
        sendDataToCompanionApp(messageObject);
    } catch (e) {
        console.error(e);
    }
}

function oft_onPageLoad(callback) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        callback();
    } else {
        window.addEventListener('load', callback);
    }
}

CommonErpAppDataTracker.prototype.attachPostMessageListener = function () {
    window.addEventListener('message', async function (event) {
        if (event != null && event.data != null) {
            if (event.data.method != null) {
                if (event.data.method === "OF_SendConsoleError") {
                    var errorData = event.data.errorData;
                    //  thisObject.sendErrorData("CONSOLE_LOG_ERROR", errorData);
                }

                else if (event.data.method === "OF_SendApiRequestError") {
                    var errorData = event.data.errorData;
                    errorData = JSON.stringify(errorData);
                    //  thisObject.sendErrorData("APIREQUEST_LOG_ERROR", errorData);
                }
            }
            var receivedData = event.data;
            if (receivedData["action"] != null) {
                var _action = receivedData["action"];
                if (_action === "oft_notifyAppFunctionalError") {

                    var messageBodyList = receivedData["messageBody"];

                    if (messageBodyList != null && JSON.stringify(messageBodyList).indexOf("View error details from the View") > -1) {
                        return;
                    }

                    let messageObject = getMessageWrapper("COMP_APP_BLINK_ON_ERROR", null);
                    sendDataToCompanionApp(messageObject)

                    var domainUrl = await sendMessageToBackgroundScriptWithPromise("getCurrentMainDomain", {});
                    //navigateDockerIframe(domainUrl + "/docker/error");

                    //  navigateDockerIframe("https://demo.labs.opkeyone.com" + "/docker/error");

                    //  navigateDockerIframe("https://myqlm.preprod.opkeyone.com" + "/docker/error");



                    var pageTitle = receivedData["pageTitle"];

                    var mainObjectToSendArray = [];
                    window.setTimeout(async function () {
                        for (var mli = 0; mli < messageBodyList.length; mli++) {
                            var messageBody = messageBodyList[mli];

                            var retData = await sendMessageToBackgroundScriptWithPromise("oft_getErrorSolutionFromObserveIq", messageBody);
                            var solutionObject = retData["anwer"];
                            var soutionAnswer = JSON.parse(solutionObject)["text"];


                            const errorContent = messageBody["appEventLog"];

                            var mainObjectToSend = new Object();

                            mainObjectToSend["error_code"] = "NoErrorCode";
                            mainObjectToSend["page_title"] = pageTitle;



                            const dataLines = errorContent.split(/\t\n/);

                            if (dataLines[0] != null && dataLines[0] != "") {
                                mainObjectToSend["error_title"] = dataLines[0];
                                var descriptionContent = "";
                                if (dataLines[1] != null) {
                                    descriptionContent += dataLines[1];
                                }
                                if (dataLines[2] != null) {
                                    descriptionContent += dataLines[2];
                                }
                                if (dataLines[3] != null) {
                                    descriptionContent += dataLines[3];
                                }

                                if (dataLines[4] != null) {
                                    descriptionContent += dataLines[4];
                                }

                                if (dataLines[5] != null) {
                                    descriptionContent += dataLines[5];
                                }

                                if (dataLines[6] != null) {
                                    descriptionContent += dataLines[6];
                                }
                                mainObjectToSend["error_description"] = descriptionContent;
                            } else {
                                mainObjectToSend["error_title"] = "";
                                mainObjectToSend["error_description"] = messageBody["appEventLog"];
                            }

                            mainObjectToSend["error_type"] = "Error";

                            if (mainObjectToSend["error_type"] == null || mainObjectToSend["error_type"] == "") {
                                mainObjectToSend["error_type"] = "ERROR";
                            }
                            mainObjectToSend["solution"] = []


                            var solutionToSend = new Object();

                            solutionToSend["solution_code"] = "";
                            solutionToSend["solution_description"] = soutionAnswer;

                            mainObjectToSend["solution"].push(solutionToSend);

                            mainObjectToSendArray.push(mainObjectToSend);


                        }

                        let errorDataObject = getMessageWrapper("COMP_APP_ERP_ERROR_DATA", mainObjectToSendArray);
                        sendDataToCompanionApp(errorDataObject)
                    }, 300);
                }

                if (_action === "event_showUserGuide") {
                    (async function () {
                        var messageBody = receivedData["messageBody"];
                        var domainUrl = await sendMessageToBackgroundScriptWithPromise("getCurrentMainDomain", {});
                        navigateDockerIframe(domainUrl + "/docker/home?journeySessionId=" + messageBody["journeyId"]);

                        // navigateDockerIframe("https://demo.labs.opkeyone.com" + "/docker/home?journeySessionId=" + messageBody["journeyId"]);
                        //  navigateDockerIframe("https://myqlm.preprod.opkeyone.com" + "/docker/home?journeySessionId=" + messageBody["journeyId"]);
                    })();

                }
            }
        }
    });
};

function addRemoteJs(src) {
    //disabled this for debugging execution issues
    if (true) {
        return;
    }
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
        try {
            chrome.runtime.sendMessage({
                "action": _command, "data": _data
            }, function (response) {
                if (isExtensionDisconnected() == true) {
                    resolve(null);
                }
                resolve(response);
            });

        } catch (e) {
            catchObiqFunctionExceptions(e);
            resolve(null);
        }
    });
}

CommonErpAppDataTracker.prototype.sendProcessIdOfCurrentUser = function (_processId) {

    window.setTimeout(async function () {
        chrome.runtime.sendMessage({
            SendOFProcessId: { "processID": _processId }
        }, function (response) {
            if (isExtensionDisconnected() == true) {
                return;
            }
        });
    }, 10);
};


async function addTraceIaSolutionDiv() {
    let traceId = window.setInterval(async function () {
        if (isExtensionDisconnected() == true) {
            window.clearInterval(traceId);
        }
        if (await thisErpApp.canTrackThisPage() == false) {
            return;
        }


        if (await thisErpApp.dockerCanBeEnabled() == false) {
            return;
        }

        if (showDockerDivElement == false) {
            return;
        }

        try {
            if (window.self != window.top) {
                return;
            }



            if (document.getElementById("traceia-solutiondiv-shadow") != null) {
                return;
            }

            var mainBody = document.body;
            if (mainBody == null) {
                return
            }
            var domainUrl = await sendMessageToBackgroundScriptWithPromise("getCurrentMainDomain", {});

            //  domainUrl = "https://localhost:4200";

            if (domainUrl == null || domainUrl == "") {
                return;
            }

            window.clearInterval(traceId);



            (async function () {
                const path = "/docker/home?appType=" + thisErpApp.appType;
                const url = domainUrl + path;

                try {


                    let pageExist = await sendMessageToOffscreenScript("checkUrlExists", { "url": url });

                    if (pageExist == false) {
                        //   return;
                    }

                    openRemoteInSidePanel(url, mainBody);
                }
                catch (err) {
                    console.error("Error checking iframe URL:", err);

                }
                chrome.runtime.sendMessage({ getFlagForJourneyTranscript: true }, function (response) {
                    if (isExtensionDisconnected() == true) {
                        return;
                    }
                    if (response === false) {
                        handleDockerButton(false);
                    }
                });
            })();

        } catch (e) { }

    }, 1000);
}

function openRemoteInSidePanel(url, mainBody) {
    if (true) {
        //this will work with browsers which doesnot support native side panel currently commenting this
        return;
    }
    var recorder_dock = document.createElement("traceia-solutiondiv");
    recorder_dock.id = "traceia-solutiondiv-shadow"
    var recorderdock_shadow = recorder_dock.attachShadow({
        mode: 'open'
    });

    mainBody.prepend(recorder_dock);

    const recorderdock_iframe = document.createElement("iframe");
    recorderdock_iframe.setAttribute("allowFullScreen", "");
    recorderdock_iframe.src = url;
    recorderdock_iframe.id = "traceia_solutiondiv_iframe";
    recorderdock_iframe.setAttribute("divClickAble", "false");
    recorderdock_iframe.style.cssText =
        "position: fixed; inset: 0; width: 100%; height: 100%; border: none; z-index: 2147483647; pointer-events: none; opacity: 1;";

    oft_dockerDivClickable = false;

    recorderdock_shadow.appendChild(recorderdock_iframe);
}





chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "HideDockerUI") {
        handleDockerButton(false);
        sendResponse("hide");
    } else if (message.action === "ShowDockerUI") {
        handleDockerButton(true);
        sendResponse("show");
    }
});

function handleDockerButton(isVisible) {
    let dockerFrame = document.getElementById("traceia-solutiondiv-shadow");
    if (dockerFrame && isVisible) {
        dockerFrame.style.display = "block";
    } else if (dockerFrame && !isVisible) {
        dockerFrame.style.display = "none";
    }
}

function oft_divActivatorListener() {

    function throttle(fn, wait) {
        let lastTime = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastTime >= wait) {
                lastTime = now;
                fn.apply(this, args);
            }
        };
    }

    document.addEventListener("mousemove", throttle(function (e) {
        try {
            let isInsideDiv = false;
            const clientX = e.clientX;
            const clientY = e.clientY;

            if (oft_divRectClientBounds != null) {
                const { left, top, width, height } = oft_divRectClientBounds;

                if (left == 0 || top == 0 || width == 0 || height == 0) {
                    //   console.error("Some Parameter is 0 ", oft_divRectClientBounds);
                    return;
                }

                if (
                    clientX > left &&
                    clientX < (left + width) &&
                    clientY > top &&
                    clientY < (top + height)
                ) {
                    isInsideDiv = true;
                }

                //      console.log("isInsideDiv=", isInsideDiv, "clientX=", clientX, "clientY=", clientY, "left=", left, "top=", top, "width=", (left + width), "height=", (top + height));

                if (isInsideDiv) {
                    mainDockerDivClickable();
                } else if (isInsideDiv == false) {
                    mainDockerDivNotClickable();
                }
            }
            else {
                //  console.log("oft_divRectClientBounds is null")
                mainDockerDivNotClickable();
            }
        } catch (error) {
            console.log(error);
        }
    }, 100), false);
}

function mainDockerDivClickable() {
    try {
        var recorderDiv = document.getElementById('traceia-solutiondiv-shadow');
        if (recorderDiv != null) {
            var elshadowRoot = recorderDiv.shadowRoot;
            var opkeyIframe = elshadowRoot.getElementById('traceia_solutiondiv_iframe');
            opkeyIframe.style = 'position: fixed; inset: 0px; width: 100%; height: 100%; border: none; z-index: 2147483647; opacity: 1;'
            //    console.log("Mouse Inside Companion App Div");
        }
    } catch (e) { }
}



function navigateDockerIframe(_url) {
    try {
        var recorderDiv = document.getElementById('traceia-solutiondiv-shadow');
        if (recorderDiv != null) {
            var elshadowRoot = recorderDiv.shadowRoot;
            var opkeyIframe = elshadowRoot.getElementById('traceia_solutiondiv_iframe');
            opkeyIframe.src = _url;
        }
    } catch (e) { }
}

function mainDockerDivNotClickable() {
    try {
        var recorderDiv = document.getElementById('traceia-solutiondiv-shadow');
        if (recorderDiv != null) {
            var elshadowRoot = recorderDiv.shadowRoot;
            var opkeyIframe = elshadowRoot.getElementById('traceia_solutiondiv_iframe');
            opkeyIframe.style = 'position: fixed; inset: 0px; width: 100%; height: 100%; border: none; z-index: 2147483647; pointer-events: none; opacity: 1;'
            //    console.log("Mouse Inside Erp App Div");
        }
    } catch (e) { }
}

function IsmainDockerDivNotClickable() {
    try {
        var recorderDiv = document.getElementById('traceia-solutiondiv-shadow');
        if (recorderDiv != null) {
            var elshadowRoot = recorderDiv.shadowRoot;
            var opkeyIframe = elshadowRoot.getElementById('traceia_solutiondiv_iframe');

            // console.log("Iframe Style opkeyIframe.style[pointer-events] ", opkeyIframe.style["pointer-events"]);
            if (opkeyIframe.style != null && opkeyIframe.style["pointer-events"] != null && opkeyIframe.style["pointer-events"] == "none") {
                return true;
            }
        }
    } catch (e) {
        debugger
    }

    return false;
}


let _queue = Promise.resolve();
function runExclusive(task) { const n = _queue.then(task, task); _queue = n.catch(() => { }); return n; }

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function waitUntil(pred, { interval = 100, timeout = 5000 } = {}) { const t0 = performance.now(); for (; ;) { if (pred()) return true; if (performance.now() - t0 >= timeout) return false; await sleep(interval); } }
async function waitForReadable() { return waitUntil(() => typeof IsmainDockerDivNotClickable() === 'boolean'); }

function disableCompanionAppPointerEvent() {
    return runExclusive(async () => {
        await waitForReadable();
        if (IsmainDockerDivNotClickable()) return;
        mainDockerDivNotClickable();
        await waitUntil(() => IsmainDockerDivNotClickable() === true);
    });
}

function enableCompanionAppPointerEvent() {
    return runExclusive(async () => {
        await waitForReadable();
        if (!IsmainDockerDivNotClickable()) return;
        mainDockerDivClickable();
        await waitUntil(() => IsmainDockerDivNotClickable() === false);
    });
}

function oft_listenForMessages() {
    var thread02 = window.setInterval(async function () {
        if (isExtensionDisconnected() == true) {
            window.clearInterval(thread02);
        }
        if (window.self != window.top) {
            return;
        }

        let dataFromCompanionApp = await getDataFromCompanionAppInObe();

        if (dataFromCompanionApp) {
            processMessageDataFromCompanionApp(dataFromCompanionApp);
        }

        if (isCurrentPageIsCompanionAppPage() == false) {

            chrome.runtime.sendMessage({
                GET_DOCKER_EVENT_USERGUIDE_DATA: "GET_DOCKER_EVENT_USERGUIDE_DATA"
            }, function (receivedData) {
                if (isExtensionDisconnected() == true) {
                    return;
                }
                if (receivedData != null) {
                    inAppPromptService.initInAppPrompt(receivedData["sessionId"], receivedData["lang"], receivedData["userId"], receivedData["projectId"]);
                }
            });

        }

        chrome.runtime.sendMessage({
            GETDOCKERDATA: "GETDOCKERDATA"
        }, function (receivedData) {
            if (isExtensionDisconnected() == true) {
                return;
            }
            if (chrome.runtime.lastError) { }
            if (receivedData != null) {
                if (receivedData["messageAction"] != null) {

                    var msgAction = receivedData["messageAction"];

                    if (msgAction == "DOCKER_EVENT_MOUSE_LEFT" || msgAction == "DOCKER_MINIMIZED") {
                        disableCompanionAppPointerEvent();
                    }
                    else if (msgAction == "DOCKER_EVENT_COLLAPSED") {
                        disableCompanionAppPointerEvent();
                    }

                    else if (msgAction == "DOCKER_EVENT_EXPANDED") {
                        enableCompanionAppPointerEvent();
                    }
                }
            }
        });

        chrome.runtime.sendMessage({
            GETDOCKERDATA_DIVPOSITION: "GETDOCKERDATA_DIVPOSITION"
        }, function (receivedData) {
            if (isExtensionDisconnected() == true) {
                return;
            }
            if (receivedData != null) {
                if (receivedData["messageAction"] != null) {

                    var msgAction = receivedData["messageAction"];
                    if (msgAction == "DOCKER_EVENT_RECT") {
                        oft_divRectClientBounds = receivedData["messageBody"];
                    }
                }
            }
        });
    }, 300);

}

function oft_addPostMessageListener() {

    var thread03 = window.setInterval(function () {
        if (isExtensionDisconnected() == true) {
            window.clearInterval(thread03);
        }
        chrome.runtime.sendMessage({
            GETERRORBLINKDATA: "GETERRORBLINKDATA"
        }, function (receivedData) {
            if (isExtensionDisconnected() == true) {
                return;
            }
            if (receivedData != null) {
                window.postMessage(receivedData);
            }
        });
    }, 1000);


    var thread04 = window.setInterval(async function () {
        if (isExtensionDisconnected() == true) {
            window.clearInterval(thread04);
        }
        let dataToSendToCompApp = await getDataOfCompanionApp();

        if (dataToSendToCompApp) {
            window.postMessage(dataToSendToCompApp);
        }
    }, 300);

    window.addEventListener('message', function (event) {
        var receivedData = event.data;
        if (receivedData != null) {
            var messageAction = receivedData["messageAction"];
            var messageBody = receivedData["messageBody"];
            if (messageAction == "DOCKER_EVENT_RECT") {
                chrome.runtime.sendMessage({
                    SETDOCKERDATA_DIVPOSITION: receivedData
                }, function (response) {
                    if (isExtensionDisconnected() == true) {
                        return;
                    }
                });
            }
            else if (messageAction == "DOCKER_EVENT_GET_FOUND_ERRORS") {
                (async function () {
                    await getDockerErrorSolution();
                })();
            }

            else if (messageAction == "DOCKER_EVENT_ApplicationNavigation") {
                (async function () {
                    if (messageBody != null) {
                        if (messageBody["redirectURL"] != null) {
                            await sendMessageToBackgroundScriptWithPromise("openExternalUrl", messageBody["redirectURL"]);
                        }
                    }

                })();
            }

            else if (messageAction == "DOCKER_EVENT_REQUESTAPI") {
                (async function () {
                    var returnData = await sendMessageToBackgroundScriptWithPromise("callExternalSideRestApi", messageBody);

                    var responseBody = new Object();

                    responseBody["messageId"] = receivedData["messageId"];

                    responseBody["messageAction"] = "ApiRequestResponse";

                    responseBody["responseBody"] = returnData;

                    window.postMessage(responseBody);

                })();
            }

            else if (messageAction == "DOCKER_EVENT_REQUESTCURRENTDOMAIN") {
                (async function () {
                    var returnData = await sendMessageToBackgroundScriptWithPromise("getCurrentDomain", messageBody);

                    var responseBody = new Object();

                    responseBody["messageId"] = receivedData["messageId"];

                    responseBody["messageAction"] = "CurrentDomainResponse";

                    responseBody["responseBody"] = returnData;

                    window.postMessage(responseBody);

                })();
            }

            else if (messageAction == "DOCKER_EVENT_REQUESTCURRENTPAGETITLE") {
                (async function () {
                    var returnData = await sendMessageToBackgroundScriptWithPromise("chrome.tabs.getActiveTabTitle", messageBody);

                    var responseBody = new Object();

                    responseBody["messageId"] = receivedData["messageId"];

                    responseBody["messageAction"] = "CurrentFocusedPageResponse";

                    responseBody["responseBody"] = returnData;

                    window.postMessage(responseBody);

                })();
            }

            else if (messageAction === "DOCKER_EVENT_USERGUIDE_DATA") {

                chrome.runtime.sendMessage({
                    SET_DOCKER_EVENT_USERGUIDE_DATA: messageBody
                }, function (response) {
                    if (isExtensionDisconnected() == true) {
                        return;
                    }
                });
            }

            else if (messageAction === "MESSAGE_DATA_FROM_COMPANION_APP") {
                setDataFromCompanionAppInObe(messageBody);
            }

            else {
                chrome.runtime.sendMessage({
                    SETDOCKERDATA: receivedData
                }, function (response) {
                    if (isExtensionDisconnected() == true) {
                        return;
                    }
                });
            }


        }
    });
}

function isCurrentPageIsCompanionAppPage() {
    if (document.URL != null) {
        if (document.URL.indexOf("/docker/home") > -1) {
            return true;
        }
        if (document.URL.indexOf("/docker/") > -1) {
            return true;
        }
    }

    return false;
}

function processMessageDataFromCompanionApp(messageObject) {
    if (isCurrentPageIsCompanionAppPage() == true) {
        return;
    }

    let messageAction = messageObject.messageAction;
    let messageBody = messageObject.messageBody;

    if (messageAction == "COMP_APP_SELECTED_STEP") {
        (async function () {
            let _processedAction = await sendMessageToOffscreenScript("get_guide_prompts_data_array", {});
            inAppPromptService.fetchAndDisplayInAppPompt(messageBody.stepNo, _processedAction);
        })();
    }

    if (messageAction == "COMP_APP_FULLY_LOADED") {
        inAppPromptService.setCompanionAppFullyLoaded(true);
    }

    if (messageAction == "START_USERGUIDE_RECORDING") {
        startUserGuideRecording(messageBody);
    }

    if (messageAction == "STOP_USERGUIDE_RECORDING") {
        stopUserGuideRecording();
    }

    if (messageAction == "START_JOURNEY_RECORDING") {
        startJourneyRecording();
    }

    if (messageAction == "STOP_JOURNEY_RECORDING") {
        stopJourneyRecording();
    }

    if (messageAction == "OBE_GET_SUGGESTED_USER_GUIDES") {
        notifyCompanionAppWithSuggestedUserGuides(false);
    }


    if (messageAction == "FETCH_COMP_APP_INIT_PARAMS") {

        notifyCompanionAppInitParams();
    }

    if (messageAction == "FETCH_CURRENT_NATIVE_RECORDED_STEPS") {
        startFethingNativeRecorderSteps();
    }
}

function setDataFromCompanionAppInObe(messageBody) {
    chrome.runtime.sendMessage({
        SET_DATA_FROM_COMPANION_APP: messageBody
    }, function (response) {
        if (isExtensionDisconnected() == true) {
            return;
        }
    });
}

function getDataFromCompanionAppInObe() {
    return new Promise(function (resolve) {
        try {
            chrome.runtime.sendMessage({
                GET_DATA_FROM_COMPANION_APP: "GET_DATA_FROM_COMPANION_APP"
            }, function (response) {
                if (isExtensionDisconnected() == true) {
                    resolve(null);
                }
                resolve(response);
            });

        } catch (e) {
            catchObiqFunctionExceptions(e);
            resolve(null);
        }
    });
}

async function sendInAppPromptsStepsDataToCompanionApp(dataToSend) {
    let headerXpathArrays = thisErpApp.getAppSpecificHeaderXpathList(false);
    var pageObject = await sendMessageToBackgroundScriptWithPromise("chrome.tabs.getActiveTabTitle", { headersXpath: headerXpathArrays });

    let pageHeaders = thisErpApp.getAllHeadersText(document.body, headerXpathArrays[0]);
    pageObject.headers = pageHeaders;

    // console.log("pageObject.headers", pageObject)
    let messageObject = getMessageWrapper("COMP_APP_GRID_STEPS_DATA", { "dataToSend": dataToSend, "pageObject": pageObject });
    sendDataToCompanionApp(messageObject);
}

function sendMoveNextStepDataToCompanionApp() {
    let messageObject = getMessageWrapper("COMP_APP_NEXT_STEP", true);
    sendDataToCompanionApp(messageObject);
}

function sendMovePreviousStepDataToCompanionApp() {
    let messageObject = getMessageWrapper("COMP_APP_PREVIOUS_STEP", true);
    sendDataToCompanionApp(messageObject);
}

function sendCloseInAppPromptDataToCompanionApp() {
    let messageObject = getMessageWrapper("COMP_APP_CLOSE_IN_APP_PROMPT", true);
    sendDataToCompanionApp(messageObject);
}

function sendUserGuideRecorderData(_dataToSend) {
    let messageObject = getMessageWrapper("COMP_APP_USER_GUIDE_RECORDER_STEP", _dataToSend);
    sendDataToCompanionApp(messageObject);
}

function sendJourneyRecorderData(_dataToSend) {
    let messageObject = getMessageWrapper("COMP_APP_JOURNEY_RECORDER_STEP", _dataToSend);
    sendDataToCompanionApp(messageObject);
}


function getMessageWrapper(action, dataObject) {
    let message = new Object();
    message["messageAction"] = action;
    message["messageBody"] = dataObject;

    return message;
}

function sendDataToCompanionApp(dataToSend) {
    chrome.runtime.sendMessage(
        { SET_DATA_FOR_COMPANION_APP: dataToSend },
        function (receivedData) {
            if (isExtensionDisconnected() == true) {
                return;
            }
        }
    );
}

function getDataOfCompanionApp() {
    return new Promise(function (resolve) {
        try {
            chrome.runtime.sendMessage(
                { GET_DATA_FOR_COMPANION_APP: "GET_DATA_FOR_COMPANION_APP" },
                function (receivedData) {
                    if (isExtensionDisconnected() == true) {
                        resolve(null);
                    }
                    resolve(receivedData);
                }
            );

        } catch (e) {
            catchObiqFunctionExceptions(e);
            resolve(null);
        }
    });
}

function getDockerErrorSolution({ timeout = 120000, interval = 1000, maxRetries = 120 } = {}) {

    return new Promise((resolve, reject) => {
        try {
            let retries = 0;
            const startTime = Date.now();

            const attempt = () => {
                chrome.runtime.sendMessage(
                    { GETDOCKERERPERRORSOLUTION: "GETDOCKERERPERRORSOLUTION" },
                    function (receivedData) {
                        if (isExtensionDisconnected() == true) {
                            return;
                        }
                        if (receivedData != null) {
                            window.postMessage(receivedData);
                            resolve(receivedData);
                        } else {
                            retries++;
                            const elapsedTime = Date.now() - startTime;
                            if (retries >= maxRetries || elapsedTime >= timeout) {
                                resolve("Done");
                            } else {
                                setTimeout(attempt, interval);
                            }
                        }
                    }
                );
            };

            attempt();
        } catch (e) {
            catchObiqFunctionExceptions(e);
            resolve(null);
        }
    });
}

async function sendMessageToOffscreenScript(_command, _data) {
    return new Promise((resolve, reject) => {
        try {
            chrome.runtime.sendMessage({
                "action": _command, "data": _data
            }, function (response) {
                if (isExtensionDisconnected() == true) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });

        } catch (e) {
            catchObiqFunctionExceptions(e);
            resolve(null);
        }
    });
}

async function isWebUserGuideRecording() {
    let recordingType = await getUserGuideRecordingType();
    if (!recordingType || recordingType == "") {
        return false;
    }

    if (recordingType === "WEB_RECORDING") {
        return true;
    }
    return false;
}

async function setUserGuideRecordingType(recorderType) {
    await sendMessageToBackgroundScriptWithPromise("setUserGuideRecordingType", recorderType);
}

async function getUserGuideRecordingType() {
    let response = await sendMessageToBackgroundScriptWithPromise("getUserGuideRecordingType", {});
    return response?.UserGuideRecordingType;
}


async function startUserGuideRecording(recordingConfigDto) {
    let recorderType = recordingConfigDto.recorderType;
    await setUserGuideRecordingType(recorderType);
    if (recorderType == "WEB_RECORDING") {
        var tabUrl = await sendMessageToBackgroundScriptWithPromise("chrome.tabs.getActiveTabUrl", null);
        if (!tabUrl) {
            return;
        }
        let domainName = getDomainName(tabUrl);
        if (domainName != null) {
            setUrlToTrack(domainName);
        }
        setObiqRecordingType("USER_GUIDE_RECORDING");

    }

    if (recorderType == "DESKTOP_RECORDING") {
        setObiqRecordingType("USER_GUIDE_RECORDING");
        startDesktopAppRecording(recordingConfigDto.appPath, recordingConfigDto.oocPortNo);
    }
}

async function startDesktopAppRecording(appPath, portNo) {
    let invokeRumResponse = await sendMessageToBackgroundScriptWithPromise("startRumRecorderAgent", { "appPath": appPath, "portNo": portNo });
    if (invokeRumResponse) {
        notifyCompanionAppWin32RecorderInitialized(invokeRumResponse);
    }
}

async function startFethingNativeRecorderSteps() {
    var response = await GetRecordedSteps();
    if (response instanceof Array) {
        if (response.length > 0) {
            response.forEach(async function (step, index, dataArray) {
                await submitNativeRecordedStepsToCompApp(step);
            });
        }
    }
}

async function submitNativeRecordedStepsToCompApp(recordedStep) {

    function transformStepToJourneyStep(recordedData) {
        if (!recordedData) {
            return null;
        }

        let action = recordedData.action.toLowerCase();
        let orObject = (recordedData?.arguments && recordedData?.arguments instanceof Array && recordedData?.arguments[0]) ? recordedData.arguments[0] : null;

        let labelText = orObject?.logicalname;
        let tagName = orObject?.tagName;
        let title = orObject?.title;

        let imageAndRectnagle = orObject.imageAndRectnagle;
        let stepDescription = null;
        let appEventSubType = null

        let currentFieldJson = { ORObjectProperties: [] }

        if (orObject) {
            let clonedOrObject = JSON.parse(JSON.stringify(orObject));
            if (clonedOrObject.imageAndRectnagle) {
                delete clonedOrObject.imageAndRectnagle;
            }
            currentFieldJson = { ORObjectProperties: [clonedOrObject] }

        }
        if (labelText) {
            if (action.indexOf("click") > -1) {
                appEventSubType = "MOUSE";
                stepDescription = "Click on '" + labelText + "'";
            }
            else if (action.indexOf("type") > -1) {
                appEventSubType = "KEYBOARD";
                stepDescription = "Enter data in '" + labelText + "'";
            }
            else if (action.indexOf("checkbox") > -1) {
                appEventSubType = "MOUSE";
                stepDescription = "Select checkbox '" + labelText + "'";
            }
            else if (action.indexOf("radio") > -1) {
                stepDescription = "Select radio button '" + labelText + "'";
            }
            else if (action.indexOf("dropdown") > -1) {
                appEventSubType = "MOUSE";
                stepDescription = "Select data in '" + labelText + "'";
            }
            else if (action.indexOf("list") > -1) {
                appEventSubType = "MOUSE";
                stepDescription = "Select data in '" + labelText + "'";
            }
        }
        if (!stepDescription) {
            return null;
        }

        let pageSnapshot = null;
        let areaToHighlight = null;
        if (imageAndRectnagle && imageAndRectnagle !== "") {
            let imageAndRectnagleObject = JSON.parse(imageAndRectnagle);
            pageSnapshot = "data:image/png;base64," + imageAndRectnagleObject.Base64Window;
            // areaToHighlight = imageAndRectnagleObject.ElementRectRelative;
        }
        return { stepDescription: stepDescription, appEventSubType: appEventSubType, pageTitle: title, pageSnapshot: pageSnapshot, areaToHighlight: areaToHighlight, currentFieldJson: JSON.stringify(currentFieldJson) }
    }

    let journeyStep = transformStepToJourneyStep(recordedStep);

    if (!journeyStep) {
        return null;
    }
    var trackedData = {
        "appType": "GENERICAPP",
        "dataId": thisErpApp.createUUID(),
        "pageTitle": journeyStep.pageTitle,
        "pageUrl": null,
        "moduleHeader": journeyStep.pageTitle,
        "appEventType": "INTERACTION",
        "appEventSubType": journeyStep.appEventSubType,
        "appEventLog": journeyStep.stepDescription,
        "eventLogDelay": 0,
        "pageLoadDelay": 0,
        "userId": "",
        "sessionId": "",
        "areasToMaskInImage": null,
        "currentFieldJson": journeyStep.currentFieldJson,
        "areaToHighlightInImage": journeyStep.areaToHighlight,
        "browserName":"CustomApp"
    }

    trackedData["stepOrderingTimeStamp"] = new Date().getTime();

    trackedData["stepRecordingType"] = await getUserGuideRecordingType();

    (window.queueMicrotask || ((fn) => Promise.resolve().then(fn)))(async () => {
        try {
            let finalData = await sendMessageToBackgroundScriptWithPromise("SendDataToTelemetryServer", {
                mainDataDto: trackedData,
                pageSnapShot: journeyStep.pageSnapshot
            });

            sendTrackedTelemetryDataToCompanionApp(finalData);
        } catch (err) {
            console.error("Telemetry send failed:", err);
        }
    });
}

async function GetRecordedSteps() {
    var returnData = await sendMessageToBackgroundScriptWithPromise("fetchRumAgentRecordedSteps", null);
    if (returnData && returnData !== "") {
        return JSON.parse(returnData);
    }
    return [];
}

function stopUserGuideRecording() {
    setUrlToTrack(null);
    removeObiqRecordingType();
    stopNativeRecording();
}

async function stopNativeRecording() {
    await sendMessageToBackgroundScriptWithPromise("stopRumRecorderAgent", null);
    /*
    chrome.runtime.sendMessage({
        killAllJnlpProcesses: "killAllJnlpProcesses"
    }, function (response) {
        if (chrome.runtime.lastError) { }
    });
    */
}
async function startJourneyRecording() {
    var tabUrl = await sendMessageToBackgroundScriptWithPromise("chrome.tabs.getActiveTabUrl", null);
    if (!tabUrl) {
        return;
    }
    let domainName = getDomainName(tabUrl);
    if (domainName != null) {
        setUrlToTrack(domainName);
    }

    setObiqRecordingType("JOURNEY_RECORDING");
}

function stopJourneyRecording() {
    setUrlToTrack(null);
    removeObiqRecordingType();
}


function setUrlToTrack(_domainName) {
    chrome.runtime.sendMessage({
        SetUrlToTrack: { url: _domainName }
    }, function (urlToTrack) {
        if (isExtensionDisconnected() == true) {
            return;
        }
    });
}

function getObiqRecordingType() {
    return new Promise(function (resolve) {
        try {
            chrome.runtime.sendMessage({
                GET_OBIQ_RECORDING_TYPE: "GET_OBIQ_RECORDING_TYPE"
            }, function (response) {
                if (isExtensionDisconnected() == true) {
                    resolve(null);
                }
                resolve(response);
            });

        } catch (e) {
            catchObiqFunctionExceptions(e);
            resolve(null);
        }
    });
}

function setObiqRecordingType(_recordingType) {
    chrome.runtime.sendMessage({
        SET_OBIQ_RECORDING_TYPE: _recordingType
    }, function (response) {
        if (isExtensionDisconnected() == true) {
            return;
        }
    });
}

function removeObiqRecordingType() {
    chrome.runtime.sendMessage({
        SET_OBIQ_RECORDING_TYPE: "REMOVE_RECORDING_TYPE"
    }, function (response) {
        if (isExtensionDisconnected() == true) {
            return;
        }
    });
}

async function isUserGuideRecording() {
    debugger
    let recordingType = await getObiqRecordingType();
    if (!recordingType) {
        return false;
    }
    if (recordingType === "USER_GUIDE_RECORDING") {
        return true;
    }
    return false;
}

async function isJourneyRecording() {
    let recordingType = await getObiqRecordingType();
    if (!recordingType) {
        return false;
    }
    if (recordingType === "JOURNEY_RECORDING") {
        return true;
    }
    return false;
}

function getDomainName(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch (error) {
        console.error("Invalid URL:", error);
        return null;
    }
}

async function sendTrackedTelemetryDataToCompanionApp(finalData) {
    if (!finalData) {
        return;
    }

    if (await isUserGuideRecording() === true) {

        sendUserGuideRecorderData(finalData);
    }

    if (await isJourneyRecording() === true) {

        sendJourneyRecorderData(finalData);
    }
}

function isExtensionDisconnected() {
    try {
        var extensionFlag = sessionStorage.getItem("ObiqExtensionDisconnected");
        if (!extensionFlag) {
            return false;
        }
        if (extensionFlag == "true") {
            return true;
        }
    } catch (e) {
        catchObiqFunctionExceptions(e);
    }
    return false;
}

function catchObiqFunctionExceptions(err) {
    const message = (err && err.message) ? err.message.toLowerCase() : "";

    if (
        message.includes("context invalidated") ||
        message.includes("execution context was destroyed") ||
        message.includes("disconnected") ||
        message.includes("target closed") ||
        message.includes("worker terminated") ||
        message.includes("cannot access a disposed object")
    ) {
        setExtensionDisconnectedFlag("true");
    }
}

function setExtensionDisconnectedFlag(flag) {
    try {
        sessionStorage.setItem("ObiqExtensionDisconnected", flag);
    } catch (e) {
        catchObiqFunctionExceptions(e);
    }
}

setExtensionDisconnectedFlag("false");