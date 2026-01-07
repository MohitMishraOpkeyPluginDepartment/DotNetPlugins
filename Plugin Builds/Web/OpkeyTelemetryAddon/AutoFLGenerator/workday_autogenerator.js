var all_processed_elements = [];

var wd_popuXpathArrays = ["//div[@role=\"dialog\" and @data-uxi-widget-type=\"popup\"]", "//div[@id=\"content-container\"][.//button[@data-automation-id=\"closeButton\"]]","//main[@data-testid='login-page']"];

var wd_xpathArrays = [
    "//div[@id=\"app-chrome-container\"]",
    "//div[@role=\"dialog\" and @aria-label=\"Global Navigation\"]",
    "//div[@data-automation-id=\"signoutPage\"]", "//div[@id=\"container\"]", "//div[@id=\"content-container\"]"];


function wd_RefreshElements() {
    var allElements = wd_findByXPath("//*[@opkey-autofl-element-id]", document, true);
    for (var aei = 0; aei < allElements.length; aei++) {
        allElements[aei].removeAttribute('opkey-autofl-element-id');
    }
}

function Workday_getCurrentPageSnapshotJSON(dataToObject) {
    debugger
    if (dataToObject != null) {
        if (dataToObject["action"] != null) {
            if (dataToObject["action"] == "Wd_RefreshElements") {
                wd_RefreshElements();
            }
        }
    }
    all_processed_elements = [];

    var of_allPageElements = wd_getCurrentPageElements();

    of_allPageElements = wd_utils_filterVisibleElements(of_allPageElements, false);

    of_allPageElements = wd_alignElements(of_allPageElements);

    var computedHeaders = wd_computeHeaderGroup(of_allPageElements);
    computedHeaders = wd_addElementType(computedHeaders);
    console.log(computedHeaders);

    if (document.title != null) {
        let _sectionHeader = document.title.split("-")[0];

        if (_sectionHeader != null) {
            _sectionHeader = _sectionHeader.trim();
            computedHeaders.forEach(function (_object, _index, _array) {
                _object["SectionHeader"] = _sectionHeader;
            });
        }
    }
    //alert("Fetch Done")
    return computedHeaders;
}

function wd_alignElements(outArray) {

    var newArray = [];

    var lastPositionElements = []
    for (var oai = 0; oai < outArray.length; oai++) {
        var tempElement = outArray[oai];
        if (tempElement.nodeName == "BUTTON" && tempElement.parentNode != null && tempElement.parentElement.getAttribute("data-automation-id") != null && tempElement.parentElement.getAttribute("data-automation-id") == "dropDownCommandButton") {
            var elementStyle = window.getComputedStyle(tempElement);
            if (elementStyle != null && elementStyle.position != null && elementStyle.position == "relative") {

                lastPositionElements.push(tempElement);

                continue;
            }
        }
        newArray.push(tempElement);
    }

    newArray.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

    newArray.push(...lastPositionElements);

    return newArray;
}

function wd_getCurrentPageElements() {
    var outArray = [];
    var popupOverLayFound = false;

    for (var pxpi = 0; pxpi < wd_popuXpathArrays.length; pxpi++) {
        var xpathElements = wd_findByXPath(wd_popuXpathArrays[pxpi], document, true);

        var xpathElementsArray = [];
        xpathElementsArray.push(...xpathElements);

        xpathElementsArray = wd_utils_filterVisibleElements(xpathElementsArray, true);
        for (var pxpei = 0; pxpei < xpathElementsArray.length; pxpei++) {
            var of_allLables = wd_getAllLabels(xpathElementsArray[pxpei]);
            var of_allTables = wd_getAllTabels(xpathElementsArray[pxpei]);
            var of_buttonshyperlinks = wd_getButtonAndHyperLinks(xpathElementsArray[pxpei]);

            outArray.push(...of_allLables);
            outArray.push(...of_allTables);
            outArray.push(...of_buttonshyperlinks);
            popupOverLayFound = true;
        }
    }

    if (popupOverLayFound == false) {
        for (var xpi = 0; xpi < wd_xpathArrays.length; xpi++) {
            var xpathElements = wd_findByXPath(wd_xpathArrays[xpi], document, true);

            var xpathElementsArray = [];
            xpathElementsArray.push(...xpathElements);

            xpathElementsArray = wd_utils_filterVisibleElements(xpathElementsArray, true);
            for (var xpei = 0; xpei < xpathElementsArray.length; xpei++) {
                var of_allLables = wd_getAllLabels(xpathElementsArray[xpei]);
                var of_allTables = wd_getAllTabels(xpathElementsArray[xpei]);
                var of_buttonshyperlinks = wd_getButtonAndHyperLinks(xpathElementsArray[xpei]);

                outArray.push(...of_allLables);
                outArray.push(...of_allTables);
                outArray.push(...of_buttonshyperlinks);
            }
        }
    }
    outArray.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

    return outArray;
}

function wd_addElementType(computedHeaders) {

    for (var cg = 0; cg < computedHeaders.length; cg++) {
        var computedHeader = computedHeaders[cg];
        computedHeader["StepObject"] = [];

        for (var re = 0; re < computedHeader["RawElements"].length; re++) {
            var rawElement = computedHeader["RawElements"][re];


            if (rawElement.nodeName == "LABEL") {
                wd_addElementTypeForLabelElement(rawElement, computedHeader["StepObject"]);
            }
            // Maheep Gupta add TEXTAREA
            if (rawElement.nodeName == "A" || rawElement.nodeName == "BUTTON" || rawElement.nodeName == "LI" || rawElement.nodeName == "INPUT" || rawElement.nodeName == "TEXTAREA") {
                wd_addElementTypeForClickableElement(rawElement, computedHeader["StepObject"]);
            }

            if (rawElement.nodeName == "DIV") {
                wd_addElementTypeForClickableElement(rawElement, computedHeader["StepObject"]);
            }

            if (rawElement.nodeName == "TABLE") {
                debugger
                wd_addElementTypeForTableElement(rawElement, computedHeader["StepObject"]);
            }
        }
    }

    return computedHeaders;
}

function wd_getFLInputParameterName(_keywordObject) {
    var parameterName = null;
    if (parameterName == null) {
        if (_keywordObject["ColumnName"] != null) {
            parameterName = _keywordObject["ColumnName"];
        }
    }

    if (parameterName == null) {
        if (_keywordObject["LabelName"] != null) {
            parameterName = _keywordObject["LabelName"];
        }
    }

    if (parameterName == null) {
        if (_keywordObject["TableName"] != null) {
            parameterName = _keywordObject["TableName"];
        }
    }

    if (parameterName != null) {
        //  return parameterName.replace(/ /g, "_") + "_" + "inputPrameter"
        // return parameterName.replace(/ /g, "_");
        return parameterName;
    }
}

function wd_addElementTypeForTableElement(tableElement, stepArrays) {
    //console.log(tableElement)

    var tableName = "";

    var tableHeaders = [];

    var captionElement = tableElement.getElementsByTagName("CAPTION")[0];

    if (captionElement != null) {
        tableName = captionElement.innerText;
    }



    var tableHeadElement = tableElement.getElementsByTagName("THEAD")[0];

    var tableBodyElement = tableElement.getElementsByTagName("TBODY")[0];

    // if (tableHeadElement == null || tableBodyElement == null) {
    //     return;
    // }

    // Changed By Maheep Gupta
    var headerElements = [];
    if (tableHeadElement != null) {
        if (tableBodyElement == null) {

            return;
        }
    }
    if (tableHeadElement == null) {
        if (tableBodyElement != null) {
            // Here i have to make the first two tr of tbody as header
            const rows = tableBodyElement.getElementsByTagName("TR");

            if (rows.length > 0) {
                headerElements.push(...rows[0].children);
            }
            if (rows.length > 1) {
                headerElements.push(...rows[1].children);
            }
        }
    }
    if (tableHeadElement != null) {
        headerElements.push(...tableHeadElement.getElementsByTagName("TD"));
        headerElements.push(...tableHeadElement.getElementsByTagName("TH"));
    }

    for (var hei = 0; hei < headerElements.length; hei++) {
        if (headerElements[hei].innerText == "No Data") {
            continue;
        }
        tableHeaders.push(headerElements[hei].innerText);
    }

    var rowElements = [];

    rowElements.push(...tableBodyElement.getElementsByTagName("TR"));

    if (rowElements.length == 0) {
        return;
    }
    for (var tri = 0; tri < 1; tri++) {
        if(tableHeadElement == null){
            tri = 2
        }
        var trElem = rowElements[tri];

        var rowColumnElements = [];
        // Changes by Maheep Gupta
        rowColumnElements.push(...trElem.getElementsByTagName("TH"));
        rowColumnElements.push(...trElem.getElementsByTagName("TD"));

        for (var tdi = 0; tdi < rowColumnElements.length; tdi++) {

            var conditionFound = false;

            var rowColumnElement = rowColumnElements[tdi];

            var columnName = tableHeaders[tdi];
            columnName = removeUnwantedDataFromLabel(columnName);

            var columnElements = [];
            columnElements.push(...rowColumnElement.getElementsByTagName("INPUT"));
            columnElements.push(...rowColumnElement.getElementsByTagName("BUTTON"));
            columnElements.push(...rowColumnElement.getElementsByTagName("A"));
            columnElements.push(...rowColumnElement.getElementsByTagName("IMG"));
            columnElements.push(...wd_findByXPath(".//div[contains(@data-automation-id, 'date')]", rowColumnElement, true));
            columnElements.push(...wd_findByXPath(".//div[contains(@data-automation-id, 'selectedItem')]", rowColumnElement, true));
            columnElements.push(...wd_findByXPath(".//div[@role='textbox']", rowColumnElement, true));
            columnElements.push(...wd_findByXPath(".//div[@data-automation-id=\"textArea\"]", rowColumnElement, true));
            debugger

            if (columnElements.length == 0) {
                if (tableName == null || tableName == "") {
                    debugger
                    var finalHeaderXpath = "";
                    for (var hi = 1; hi < 7; hi++) {
                        if (finalHeaderXpath != "") {
                            finalHeaderXpath += " | ";
                        }
                        finalHeaderXpath += "preceding::h" + hi + "[not(contains(@data-automation-id, 'accordionHeaderTitle'))]";
                    }


                    var _headers = wd_findByXPath(finalHeaderXpath, rowColumnElement, true);
                    if (_headers.length > 0 && _headers[_headers.length - 1].innerText != null && _headers[_headers.length - 1].innerText != "") {
                        tableName = _headers[_headers.length - 1].innerText;
                    }
                }
                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "WD_ClickTableCell";
                _keywordObject["TableName"] = tableName;
                _keywordObject["RowNumber"] = tri;
                _keywordObject["TableHeaders"] = tableHeaders;
                _keywordObject["ColumnName"] = columnName;
                _keywordObject["ElementType"] = "tableCell"
                _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject,columnElement);
                _keywordObject["StepElement"] = rowColumnElement;
                _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
                stepArrays.push(_keywordObject);
                conditionFound = true;
            }

            for (var cei = 0; cei < columnElements.length; cei++) {
                var columnElement = columnElements[cei];

                var dataAutomationId = null;
                if (columnElement.getAttribute("data-automation-id") != null) {
                    dataAutomationId = columnElement.getAttribute("data-automation-id");
                    // Changes by Maheep Gupta
                    if (dataAutomationId != null && dataAutomationId.indexOf("selectedItem") > -1) {
                        var containDivs = columnElement.querySelectorAll("div");
                        if (containDivs.length > 0) {
                            var _divAutomationId = "";

                            for (let _divi = 0; _divi < containDivs.length; _divi++) {
                                var promptOption = containDivs[_divi].getAttribute("data-automation-id");
                                if (promptOption !== null && promptOption === "promptOption") {
                                    _divAutomationId = promptOption;
                                    dataAutomationId = promptOption;
                                }
                            }
                        }
                    }
                }

                if (dataAutomationId == null || dataAutomationId == "") {
                    if (columnElement.getAttribute("data-uxi-widget-type") != null) {
                        dataAutomationId = columnElement.getAttribute("data-uxi-widget-type");
                    }
                }

                if (tableName == null || tableName == "") {
                    debugger
                    var finalHeaderXpath = "";
                    for (var hi = 1; hi < 7; hi++) {
                        if (finalHeaderXpath != "") {
                            finalHeaderXpath += " | ";
                        }
                        finalHeaderXpath += "preceding::h" + hi + "[not(contains(@data-automation-id, 'accordionHeaderTitle'))]";
                    }


                    var _headers = wd_findByXPath(finalHeaderXpath, columnElement, true);
                    if (_headers.length > 0 && _headers[_headers.length - 1].innerText != null && _headers[_headers.length - 1].innerText != "") {
                        tableName = _headers[_headers.length - 1].innerText;
                    }
                }

                if (conditionFound == false && columnElement.nodeName == "IMG") {
                    var _keywordObject = new Object();
                    _keywordObject["StepId"] = opkey_createUUID();
                    _keywordObject["StepSelected"] = true;
                    _keywordObject["Keyword"] = "WD_ClickImageInTableCell";
                    _keywordObject["TableName"] = tableName;
                    _keywordObject["RowNumber"] = tri;
                    _keywordObject["TableHeaders"] = tableHeaders;
                    _keywordObject["ColumnName"] = columnName;
                    _keywordObject["ElementType"] = "tableCell"
                    _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject,columnElement);
                    _keywordObject["StepElement"] = rowColumnElement;
                    _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
                    stepArrays.push(_keywordObject);
                    conditionFound = true;
                }

                if (conditionFound == false && columnElement.nodeName == "A") {
                    var _keywordObject = new Object();
                    _keywordObject["StepId"] = opkey_createUUID();
                    _keywordObject["StepSelected"] = true;
                    _keywordObject["Keyword"] = "WD_ClickLinkInTableCell";
                    _keywordObject["TableName"] = tableName;
                    _keywordObject["RowNumber"] = tri;
                    _keywordObject["TableHeaders"] = tableHeaders;
                    _keywordObject["ColumnName"] = columnName;
                    _keywordObject["ElementType"] = "tableCell"
                    _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject,columnElement);
                    _keywordObject["StepElement"] = rowColumnElement;
                    _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
                    stepArrays.push(_keywordObject);
                    conditionFound = true;
                }

                if (conditionFound == false && columnElement.nodeName == "BUTTON") {
                    var _keywordObject = new Object();
                    _keywordObject["StepId"] = opkey_createUUID();
                    _keywordObject["StepSelected"] = true;
                    _keywordObject["Keyword"] = "WD_ClickTableCell";
                    _keywordObject["TableName"] = tableName;
                    _keywordObject["RowNumber"] = tri;
                    _keywordObject["TableHeaders"] = tableHeaders;
                    _keywordObject["ColumnName"] = columnName;
                    _keywordObject["ElementType"] = "tableCell"
                    _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject,columnElement);
                    _keywordObject["StepElement"] = rowColumnElement;
                    _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
                    stepArrays.push(_keywordObject);
                    conditionFound = true;
                }
                if (conditionFound == false && columnElement.nodeName == "DIV" && dataAutomationId != null && dataAutomationId.indexOf("date") > -1) {

                    var _keywordObject = new Object();
                    _keywordObject["StepId"] = opkey_createUUID();
                    _keywordObject["StepSelected"] = true;
                    _keywordObject["Keyword"] = "WD_SelectDateInTableCell";
                    _keywordObject["TableName"] = tableName;
                    _keywordObject["RowNumber"] = tri;
                    _keywordObject["TableHeaders"] = tableHeaders;
                    _keywordObject["ColumnName"] = columnName;
                    _keywordObject["ElementType"] = "tableCell"
                    _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject,columnElement);
                    _keywordObject["StepElement"] = rowColumnElement;
                    _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
                    _keywordObject["ComponentInputParameterName"] = wd_getFLInputParameterName(_keywordObject);
                    stepArrays.push(_keywordObject);
                    conditionFound = true;
                }

                if (conditionFound == false && columnElement.nodeName == "DIV" && dataAutomationId != null && dataAutomationId.indexOf("selectedItem") > -1) {

                    var _keywordObject = new Object();
                    _keywordObject["StepId"] = opkey_createUUID();
                    _keywordObject["StepSelected"] = true;
                    _keywordObject["Keyword"] = "WD_SearchAndSelectLOVInTableCell";
                    _keywordObject["TableName"] = tableName;
                    _keywordObject["RowNumber"] = tri;
                    _keywordObject["TableHeaders"] = tableHeaders;
                    _keywordObject["ColumnName"] = columnName;
                    _keywordObject["ElementType"] = "tableCell"
                    _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject,columnElement);
                    _keywordObject["StepElement"] = rowColumnElement;
                    _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
                    _keywordObject["ComponentInputParameterName"] = wd_getFLInputParameterName(_keywordObject);
                    stepArrays.push(_keywordObject);
                    conditionFound = true;
                }

                if (conditionFound == false && columnElement.nodeName == "DIV" && dataAutomationId != null && dataAutomationId.indexOf("textArea") > -1) {

                    var _keywordObject = new Object();
                    _keywordObject["StepId"] = opkey_createUUID();
                    _keywordObject["StepSelected"] = true;
                    _keywordObject["Keyword"] = "WD_TypeTextInTableCell";
                    _keywordObject["TableName"] = tableName;
                    _keywordObject["RowNumber"] = tri;
                    _keywordObject["TableHeaders"] = tableHeaders;
                    _keywordObject["ColumnName"] = columnName;
                    _keywordObject["ElementType"] = "tableCell"
                    _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject,columnElement);
                    _keywordObject["StepElement"] = rowColumnElement;
                    _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
                    _keywordObject["ComponentInputParameterName"] = wd_getFLInputParameterName(_keywordObject);
                    stepArrays.push(_keywordObject);
                    conditionFound = true;
                }

                if (conditionFound == false && columnElement.nodeName == "INPUT") {

                    if (columnElement.type != null) {
                        if (columnElement.type == "checkbox") {
                            var _keywordObject = new Object();
                            _keywordObject["StepId"] = opkey_createUUID();
                            _keywordObject["StepSelected"] = true;
                            _keywordObject["Keyword"] = "WD_SelectCheckBoxInTableCell";
                            _keywordObject["TableName"] = tableName;
                            _keywordObject["RowNumber"] = tri;
                            _keywordObject["TableHeaders"] = tableHeaders;
                            _keywordObject["ColumnName"] = columnName;
                            _keywordObject["ElementType"] = "tableCell"
                            _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject,columnElement);
                            _keywordObject["StepElement"] = rowColumnElement;
                            _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
                            _keywordObject["ComponentInputParameterName"] = wd_getFLInputParameterName(_keywordObject);
                            stepArrays.push(_keywordObject);
                            conditionFound = true;
                        }
                        else if (columnElement.type == "radio") {
                            var _keywordObject = new Object();
                            _keywordObject["StepId"] = opkey_createUUID();
                            _keywordObject["StepSelected"] = true;
                            _keywordObject["Keyword"] = "WD_SelectRadioButtonInTableCell";
                            _keywordObject["TableName"] = tableName;
                            _keywordObject["RowNumber"] = tri;
                            _keywordObject["TableHeaders"] = tableHeaders;
                            _keywordObject["ColumnName"] = columnName;
                            _keywordObject["ElementType"] = "tableCell"
                            _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject,columnElement);
                            _keywordObject["StepElement"] = rowColumnElement;
                            _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
                            stepArrays.push(_keywordObject);
                            conditionFound = true;
                        }

                        else if (columnElement.type == "text" || columnElement.type == "password" || columnElement.type == "search") {

                            if (dataAutomationId != null && dataAutomationId.indexOf("date") > -1) {
                                var _keywordObject = new Object();
                                _keywordObject["StepId"] = opkey_createUUID();
                                _keywordObject["StepSelected"] = true;
                                _keywordObject["Keyword"] = "WD_SelectDateInTableCell";
                                _keywordObject["TableName"] = tableName;
                                _keywordObject["RowNumber"] = tri;
                                _keywordObject["TableHeaders"] = tableHeaders;
                                _keywordObject["ColumnName"] = columnName;
                                _keywordObject["ElementType"] = "tableCell"
                                _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject,columnElement);
                                _keywordObject["StepElement"] = rowColumnElement;
                                _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
                                _keywordObject["ComponentInputParameterName"] = wd_getFLInputParameterName(_keywordObject);
                                stepArrays.push(_keywordObject);
                                conditionFound = true;
                            }
                            else if (dataAutomationId != null && (dataAutomationId.indexOf("searchBox") > -1 || dataAutomationId.indexOf("selectinput") > -1)) {
                                var _keywordObject = new Object();
                                _keywordObject["StepId"] = opkey_createUUID();
                                _keywordObject["StepSelected"] = true;
                                _keywordObject["Keyword"] = "WD_SearchAndSelectLOVInTableCell";
                                _keywordObject["TableName"] = tableName;
                                _keywordObject["RowNumber"] = tri;
                                _keywordObject["TableHeaders"] = tableHeaders;
                                _keywordObject["ColumnName"] = columnName;
                                _keywordObject["ElementType"] = "tableCell"
                                _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject,columnElement);
                                _keywordObject["StepElement"] = rowColumnElement;
                                _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
                                _keywordObject["ComponentInputParameterName"] = wd_getFLInputParameterName(_keywordObject);
                                stepArrays.push(_keywordObject);
                                conditionFound = true;
                            }
                        }
                    }
                }
            }

            if (conditionFound == false) {

                if (dataAutomationId != null && dataAutomationId.indexOf("date") > -1) {
                    var _keywordObject = new Object();
                    _keywordObject["StepId"] = opkey_createUUID();
                    _keywordObject["StepSelected"] = true;
                    _keywordObject["Keyword"] = "WD_SelectDateInTableCell";
                    _keywordObject["TableName"] = tableName;
                    _keywordObject["RowNumber"] = tri;
                    _keywordObject["TableHeaders"] = tableHeaders;
                    _keywordObject["ColumnName"] = columnName;
                    _keywordObject["ElementType"] = "tableCell"
                    _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject,columnElement);
                    _keywordObject["StepElement"] = rowColumnElement;
                    _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
                    _keywordObject["ComponentInputParameterName"] = wd_getFLInputParameterName(_keywordObject);
                    stepArrays.push(_keywordObject);
                    conditionFound = true;
                }

                else if ((columnElement.getAttribute("role") != null && columnElement.getAttribute("role") == "textbox") || (columnElement.type != null && columnElement.type == "text")) {
                    var _keywordObject = new Object();
                    _keywordObject["StepId"] = opkey_createUUID();
                    _keywordObject["StepSelected"] = true;
                    _keywordObject["Keyword"] = "WD_TypeTextInTableCell";
                    _keywordObject["TableName"] = tableName;
                    _keywordObject["RowNumber"] = tri;
                    _keywordObject["TableHeaders"] = tableHeaders;
                    _keywordObject["ColumnName"] = columnName;
                    _keywordObject["ElementType"] = "tableCell"
                    _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject,columnElement);
                    _keywordObject["StepElement"] = rowColumnElement;
                    _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
                    _keywordObject["ComponentInputParameterName"] = wd_getFLInputParameterName(_keywordObject);
                    stepArrays.push(_keywordObject);
                    conditionFound = true;
                }
                else {
                    var _keywordObject = new Object();
                    _keywordObject["StepId"] = opkey_createUUID();
                    _keywordObject["StepSelected"] = true;
                    _keywordObject["Keyword"] = "WD_ClickTableCell";
                    _keywordObject["TableName"] = tableName;
                    _keywordObject["RowNumber"] = tri;
                    _keywordObject["TableHeaders"] = tableHeaders;
                    _keywordObject["ColumnName"] = columnName;
                    _keywordObject["ElementType"] = "tableCell"
                    _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject,columnElement);
                    _keywordObject["StepElement"] = rowColumnElement;
                    _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
                    stepArrays.push(_keywordObject);
                }
            }
        }
    }

}


function ignoreElement(_element) {
    if (_element.nodeName == "A") {
        if (_element.parentNode.classList.contains("cke_toolgroup")) {
            return true;
        }

        if (_element.getAttribute("data-automation-id") != null && _element.getAttribute("data-automation-id").indexOf("richText") > -1) {
            return true;
        }
    }

    if (_element.nodeName == "INPUT") {
        if (_element.getAttribute("placeholder") != null && _element.getAttribute("placeholder") == "Search") {
            if (_element.getAttribute("data-uxi-widget-type") != null && _element.getAttribute("data-uxi-widget-type") == "selectinput") {
                return true;
            }
        }

        if (_element.getAttribute("aria-label") != null) {
            var ariaLabel = _element.getAttribute("aria-label");

            if (ariaLabel == "Month" || ariaLabel == "Day" || ariaLabel == "Year") {
                return true;
            }
        }
    }

    if (_element.nodeName == "DIV") {
        if (_element.getAttribute("aria-label") != null) {
            var ariaLabel = _element.getAttribute("aria-label");

            if (ariaLabel == "Calendar") {
                return true;
            }
        }
    }

    if (_element.nodeName == "DIV") {
        if (_element.getAttribute("data-automation-id") != null) {
            var ariaLabel = _element.getAttribute("data-automation-id");

            if (ariaLabel == "selectWidget") {
                return true;
            }
        }
    }

    return false;
}
var inputText = [];
function wd_addElementTypeForClickableElement(rawElement, stepArrays) {
    if (ignoreElement(rawElement)) {
        return;
    }
    inputText = wd_getInputText(rawElement);
    var _lableText = wd_getLabelText(rawElement);
    _labelText = removeUnwantedDataFromLabel(_lableText);
    if (_lableText == null) {
        _lableText = "";
    }
    if (_lableText == "") {
        if (rawElement.getAttribute("id") != null) {
            if (all_processed_elements.indexOf(rawElement) > -1) {
                return;
            }

            all_processed_elements.push(rawElement);

            var elementId = rawElement.getAttribute("id");
            var labelXpath = "//label[@for='" + elementId + "']";

            var elements = wd_findByXPath(labelXpath, document, true);
            if (elements != null && elements.length > 0) {
                _lableText = elements[0].innerText;
                if (_lableText === null || _lableText === "") {
                    // Added by Maheep Gupta
                    _lableText = wd_filterLegendAsLabelNotFound(elements[0])
                }
            }
        }
    }

    if (_lableText == "") {
        return;
    }
    // Maheep Gupta add TEXTAREA
    if (rawElement.nodeName == "TEXTAREA" || rawElement.nodeName == "INPUT" && rawElement.type != null && (rawElement.type == "text" || rawElement.type == "password" || rawElement.type == "search")) {
        var _keywordObject = new Object();
        _keywordObject["StepId"] = opkey_createUUID();
        _keywordObject["StepSelected"] = true;
        _keywordObject["Keyword"] = "WD_TypeByText";
        _keywordObject["LabelName"] = _lableText;
        _keywordObject["ElementType"] = "editor"
        _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject);
        _keywordObject["StepElement"] = rawElement;
        _keywordObject["StepElementId"] = generateStepElementId(rawElement);
        _keywordObject["ComponentInputParameterName"] = wd_getFLInputParameterName(_keywordObject);
        stepArrays.push(_keywordObject);
    }

    else if (rawElement.nodeName == "LI") {
        if (rawElement.getAttribute("role") != null && rawElement.getAttribute("role") == "tab") {
            var _keywordObject = new Object();
            _keywordObject["StepId"] = opkey_createUUID();
            _keywordObject["StepSelected"] = true;
            _keywordObject["Keyword"] = "WD_ClickByText";
            _keywordObject["LabelName"] = _lableText;
            _keywordObject["ElementType"] = "tabItem"
            _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject);
            _keywordObject["StepElement"] = rawElement;
            _keywordObject["StepElementId"] = generateStepElementId(rawElement);
            stepArrays.push(_keywordObject);
        }
    }
    else {
        var _keywordObject = new Object();
        _keywordObject["StepId"] = opkey_createUUID();
        _keywordObject["StepSelected"] = true;
        _keywordObject["Keyword"] = "WD_ClickByText";
        _keywordObject["LabelName"] = _lableText;
        _keywordObject["ElementType"] = "button"
        _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject);
        _keywordObject["StepElement"] = rawElement;
        _keywordObject["StepElementId"] = generateStepElementId(rawElement);
        stepArrays.push(_keywordObject);
    }
}
// Added by Maheep Gupta
function wd_filterLegendAsLabelNotFound(_element) {
    var parentElement = _element.parentNode
    while (parentElement) {
        var tempElement = parentElement
        var containsLegend = tempElement.getElementsByTagName("LEGEND")
        if (containsLegend.length > 0) {
            return containsLegend[0].innerText || ""
        }
        parentElement = tempElement.parentNode
    }
}

function wd_isElementIsBefore(el1, el2) {
    return (el1.compareDocumentPosition(el2) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}

function wd_isElementIsAfter(el1, el2) {
    return (el1.compareDocumentPosition(el2) & Node.DOCUMENT_POSITION_PRECEDING) !== 0;
}

function wd_addElementTypeForLabelElement(rawElement, stepArrays) {
    var forProperty = rawElement.getAttribute("for");

    var _labelText = wd_getLabelText(rawElement);
    _labelText = removeUnwantedDataFromLabel(_labelText);

    if (_labelText == null) {
        _labelText = "";
    }

    if (_labelText == "") {
        return;
    }

    // Changes by Maheep Gupta
    if (forProperty == null) {
        forProperty = rawElement.getAttribute("id");
        if (forProperty !== null) {
            var labelItself = document.getElementById(forProperty);
            if (labelItself !== null) {
                var li = labelItself.closest('li');
                const firstInputInsideLi = li.querySelector('input');
                if (firstInputInsideLi !== null) {
                    firstInputInsideLi.setAttribute("opkey-label",forProperty)
                }
            }
        }
    }

    if (forProperty != null) {
        var labelAttachedElement = document.getElementById(forProperty);

        if (labelAttachedElement == null) {
            return;
        }

        // Changes by Maheep Gupta
        if (labelAttachedElement?.nodeName === "LABEL") {
            var opkeyLabelledElement = document.querySelector(`[opkey-label="${forProperty}"]`)

            if (opkeyLabelledElement != null) {
                labelAttachedElement = opkeyLabelledElement;
            }
        }

        if (all_processed_elements.indexOf(labelAttachedElement) > -1) {
            return;
        }

        all_processed_elements.push(labelAttachedElement);

        var dataAutomationId = "";
        var elementRole = labelAttachedElement.getAttribute("role");
        if (elementRole == null) {
            elementRole = labelAttachedElement.getAttribute("data-uxi-widget-type");
        }

        if (elementRole == null) {
            elementRole = labelAttachedElement.getAttribute("type");
        }
        if (elementRole == null) {
            elementRole = labelAttachedElement.getAttribute("data-automation-id");
            debugger
        }

        if (labelAttachedElement.getAttribute("data-automation-id") != null) {
            dataAutomationId = labelAttachedElement.getAttribute("data-automation-id");
        }
        if (elementRole != null) {
            if (elementRole == "combobox" || elementRole == "selectinput") {

                if (labelAttachedElement.parentNode != null && labelAttachedElement.parentNode.classList != null && JSON.stringify(labelAttachedElement.parentNode.classList).indexOf("SearchBarContainer") > -1) {
                    var _keywordObject = new Object();
                    _keywordObject["StepId"] = opkey_createUUID();
                    _keywordObject["StepSelected"] = true;
                    _keywordObject["Keyword"] = "WD_SearchAndSelectLOV";
                    _keywordObject["LabelName"] = _labelText;
                    _keywordObject["ElementType"] = "lov"
                    _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject);
                    _keywordObject["StepElement"] = labelAttachedElement;
                    _keywordObject["StepElementId"] = generateStepElementId(labelAttachedElement);
                    _keywordObject["ComponentInputParameterName"] = wd_getFLInputParameterName(_keywordObject);
                    stepArrays.push(_keywordObject);
                }
            }

            else if (elementRole == "text" || elementRole == "textbox") {
                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "WD_TypeByText";
                _keywordObject["LabelName"] = _labelText;
                _keywordObject["ElementType"] = "text"
                _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject);
                _keywordObject["StepElement"] = labelAttachedElement;
                _keywordObject["StepElementId"] = generateStepElementId(labelAttachedElement);
                _keywordObject["ComponentInputParameterName"] = wd_getFLInputParameterName(_keywordObject);
                stepArrays.push(_keywordObject);
            }
            else if (elementRole == "radio") {
                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "WD_SelectRadioButtonByText";
                _keywordObject["LabelName"] = _labelText;
                _keywordObject["ElementType"] = "radio"
                _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject);
                _keywordObject["StepElement"] = labelAttachedElement;
                _keywordObject["StepElementId"] = generateStepElementId(labelAttachedElement);
                stepArrays.push(_keywordObject);
            }
            else if (elementRole == "checkbox") {
                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "WD_SelectCheckboxByText";
                _keywordObject["LabelName"] = _labelText;
                _keywordObject["ElementType"] = "checkbox"

                _keywordObject["IsBefore"] = wd_isElementIsBefore(labelAttachedElement, rawElement);
                _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject);
                _keywordObject["StepElement"] = labelAttachedElement;
                _keywordObject["StepElementId"] = generateStepElementId(labelAttachedElement);
                _keywordObject["ComponentInputParameterName"] = wd_getFLInputParameterName(_keywordObject);
                stepArrays.push(_keywordObject);
            }
            else if (elementRole == "button" && dataAutomationId != "selectWidget") {
                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "WD_ClickByText";
                _keywordObject["LabelName"] = _labelText;
                _keywordObject["ElementType"] = "button"
                _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject);
                _keywordObject["StepElement"] = labelAttachedElement;
                _keywordObject["StepElementId"] = generateStepElementId(labelAttachedElement);
                stepArrays.push(_keywordObject);
            }
            else {
                if (dataAutomationId != null && dataAutomationId.indexOf("date") > -1) {
                    var _keywordObject = new Object();
                    _keywordObject["StepId"] = opkey_createUUID();
                    _keywordObject["StepSelected"] = true;
                    _keywordObject["Keyword"] = "WD_SelectDateByText";
                    _keywordObject["LabelName"] = _labelText;
                    _keywordObject["ElementType"] = "text"
                    _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject);
                    _keywordObject["StepElement"] = labelAttachedElement;
                    _keywordObject["StepElementId"] = generateStepElementId(labelAttachedElement);
                    _keywordObject["ComponentInputParameterName"] = wd_getFLInputParameterName(_keywordObject);
                    stepArrays.push(_keywordObject);
                }
                else if (dataAutomationId != null && dataAutomationId == "selectWidget") {
                    var _keywordObject = new Object();
                    _keywordObject["StepId"] = opkey_createUUID();
                    _keywordObject["StepSelected"] = true;
                    _keywordObject["Keyword"] = "WD_SelectDropdownItemByText";
                    _keywordObject["LabelName"] = _labelText;
                    _keywordObject["ElementType"] = "combobox"
                    _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject);
                    _keywordObject["StepElement"] = labelAttachedElement;
                    _keywordObject["StepElementId"] = generateStepElementId(labelAttachedElement);
                    _keywordObject["ComponentInputParameterName"] = wd_getFLInputParameterName(_keywordObject);
                    stepArrays.push(_keywordObject);
                }
                else {
                    var _keywordObject = new Object();
                    _keywordObject["StepId"] = opkey_createUUID();
                    _keywordObject["StepSelected"] = true;
                    _keywordObject["Keyword"] = "WD_ClickByText";
                    _keywordObject["LabelName"] = _labelText;
                    _keywordObject["ElementType"] = "otherControl"
                    _keywordObject["DataArguments"] = wd_getKeywordDataArgument(_keywordObject);
                    _keywordObject["StepElement"] = labelAttachedElement;
                    _keywordObject["StepElementId"] = generateStepElementId(labelAttachedElement);
                    stepArrays.push(_keywordObject);
                }
            }
        }

    }
}

function generateStepElementId(_element) {
    var elementId = _element.getAttribute("opkey-autofl-element-id");
    if (elementId != null && elementId != "") {
        return elementId;
    }

    elementId = opkey_createUUID();
    _element.setAttribute("opkey-autofl-element-id", elementId);
    return elementId;
}

function opkey_createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function wd_getLogicalName(step_data) {
    var logical_name = step_data["LabelName"];

    if (logical_name == null) {
        logical_name = step_data["TableName"];
    }

    if (logical_name == null) {
        logical_name = step_data["ColumnName"];
    }

    return logical_name;
}

function wd_getKeywordDataArgument(_keywordObject,rawElement) {

    var _keywordName = _keywordObject["Keyword"];
    var _labelText = _keywordObject["LabelName"];

    if (_labelText == null) {
        _labelText = "";
    }
    var _tableName = _keywordObject["TableName"];
    var _columnName = _keywordObject["ColumnName"];

    var _rowNumber = _keywordObject["RowNumber"];
    if (_rowNumber == null) {
        _rowNumber = 0;
    }
    if (_keywordName == "WD_SelectDropdownItemByText") {

        var retObject = new Object();
        retObject["1. DropdownLabel"] = _labelText;
        retObject["2. ValueToSelect"] = wd_getValue(_labelText, inputText);
        retObject["3. ValueIndex"] = 0;

        var dynamicOrObject = new Object();
        dynamicOrObject["DropdownLabel"] = _labelText;
        dynamicOrObject["ValueIndex"] = 0;
        dynamicOrObject["logicalName"] = wd_getLogicalName(_keywordObject);
        _keywordObject["InputParameterDefaultValue"]= wd_getValue(_labelText, inputText);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;
        return retObject;
    }

    if (_keywordName == "WD_SearchAndSelectLOV") {

        var retObject = new Object();
        retObject["1. LovLabel"] = _labelText;
        retObject["2. SectionLabel"] = "";
        retObject["3. ValueToSelect"] = wd_getValue(_labelText, inputText);

        var dynamicOrObject = new Object();
        dynamicOrObject["LovLabel"] = _labelText;
        dynamicOrObject["SectionLabel"] = "";
        dynamicOrObject["logicalName"] = wd_getLogicalName(_keywordObject);
        _keywordObject["InputParameterDefaultValue"]= wd_getValue(_labelText, inputText);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;

        return retObject;
    }

    if (_keywordName == "WD_SelectDateByText") {

        var retObject = new Object();

        retObject["1. DateLabel"] = _labelText;

        retObject["2. LabelIndex"] = 0;

        retObject["3. Date"] = wd_getValue(_labelText, inputText);


        var dynamicOrObject = new Object();
        dynamicOrObject["DateLabel"] = _labelText;

        dynamicOrObject["LabelIndex"] = 0;

        dynamicOrObject["logicalName"] = wd_getLogicalName(_keywordObject);
        _keywordObject["InputParameterDefaultValue"]= wd_getValue(_labelText, inputText);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;

        return retObject;
    }

    if (_keywordName == "WD_ClickByText") {

        var retObject = new Object();

        retObject["1. TextToSearch"] = _labelText;

        retObject["2. Index"] = 0;

        retObject["3. PartialText"] = false;

        retObject["4. Before"] = "";

        retObject["5. After"] = "";


        var dynamicOrObject = new Object();

        dynamicOrObject["TextToSearch"] = _labelText;

        dynamicOrObject["Index"] = 0;

        dynamicOrObject["PartialText"] = false;

        dynamicOrObject["Before"] = "";

        dynamicOrObject["After"] = "";

        dynamicOrObject["logicalName"] = wd_getLogicalName(_keywordObject);

        _keywordObject["DynamicOrObject"] = dynamicOrObject;
        return retObject;
    }

    if (_keywordName == "WD_TypeByText") {

        var retObject = new Object();

        retObject["1. TextToSearch"] = _labelText;

        retObject["2. Index"] = 0;

        retObject["3. PartialText"] = false;

        retObject["4. TextToType"] = wd_getValue(_labelText, inputText);

        retObject["5. Before"] = false;


        var dynamicOrObject = new Object();

        dynamicOrObject["TextToSearch"] = _labelText;

        dynamicOrObject["Index"] = 0;

        dynamicOrObject["PartialText"] = false;

        dynamicOrObject["TextToType"] = wd_getValue(_labelText, inputText);

        dynamicOrObject["Before"] = false;

        dynamicOrObject["logicalName"] = wd_getLogicalName(_keywordObject);
        _keywordObject["InputParameterDefaultValue"]= wd_getValue(_labelText, inputText);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;

        return retObject;
    }

    if (_keywordName == "WD_SelectRadioButtonByText") {

        var retObject = new Object();

        retObject["1. TextToSearch"] = _labelText;

        retObject["2. Index"] = 0;

        retObject["3. PartialText"] = false;

        retObject["4. Before"] = false;


        var dynamicOrObject = new Object();

        dynamicOrObject["TextToSearch"] = _labelText;

        dynamicOrObject["Index"] = 0;

        dynamicOrObject["PartialText"] = false;

        dynamicOrObject["Before"] = false;

        dynamicOrObject["logicalName"] = wd_getLogicalName(_keywordObject);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;
        return retObject;
    }

    if (_keywordName == "WD_SelectCheckboxByText") {

        var retObject = new Object();

        retObject["1. TextToSearch"] = _labelText;

        retObject["2. Index"] = 0;

        retObject["3. PartialText"] = false;

        retObject["4. Before"] = _keywordObject["IsBefore"];

        retObject["5. Status"] = wd_getValue(_labelText, inputText);


        var dynamicOrObject = new Object();


        dynamicOrObject["TextToSearch"] = _labelText;

        dynamicOrObject["Index"] = 0;

        dynamicOrObject["PartialText"] = false;

        dynamicOrObject["Before"] = _keywordObject["IsBefore"];

        dynamicOrObject["Status"] = wd_getValue(_labelText, inputText);

        dynamicOrObject["logicalName"] = wd_getLogicalName(_keywordObject);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;
        _keywordObject["InputParameterDefaultValue"]= wd_getValue(_labelText, inputText);
        return retObject;
    }

    if (_keywordName == "WD_DeSelectCheckboxByText") {

        var retObject = new Object();

        retObject["1. TextToSearch"] = _labelText;

        retObject["2. Index"] = 0;

        retObject["3. PartialText"] = false;

        retObject["4. Before"] = false;

        retObject["5. Status"] = "Off";


        var dynamicOrObject = new Object();

        dynamicOrObject["TextToSearch"] = _labelText;

        dynamicOrObject["Index"] = 0;

        dynamicOrObject["PartialText"] = false;

        dynamicOrObject["Before"] = false;

        dynamicOrObject["Status"] = "Off";

        dynamicOrObject["logicalName"] = wd_getLogicalName(_keywordObject);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;
        return retObject;
    }

    if (_keywordName == "WD_ClickTableCell") {

        var retObject = new Object();

        retObject["01. TableName"] = _tableName;

        retObject["02. ColumnName"] = _columnName;

        retObject["03. RowNumber"] = _rowNumber;

        retObject["04. ObjectIndex"] = 0;

        retObject["05. Identifier1"] = "";

        retObject["06. Value1"] = "";

        retObject["07. Identifier2"] = "";

        retObject["08. Value2"] = "";

        retObject["09. Identifier3"] = "";

        retObject["10. Value3"] = "";

        retObject["11. Identifier4"] = "";

        retObject["12. Value4"] = "";

        retObject["13. Identifier5"] = "";

        retObject["14. Value5"] = "";

        retObject["15. LabelName"] = _labelText;


        var dynamicOrObject = new Object();

        dynamicOrObject["logicalName"] = wd_getLogicalName(_keywordObject);
        dynamicOrObject["IgnoreDynamicOR"] = true;
        _keywordObject["DynamicOrObject"] = dynamicOrObject;

        return retObject;
    }

    if (_keywordName == "WD_ClickImageInTableCell") {

        var retObject = new Object();

        retObject["01. TableName"] = _tableName;

        retObject["02. ColumnName"] = _columnName;

        retObject["03. RowNumber"] = _rowNumber;

        retObject["04. ObjectIndex"] = 0;

        retObject["05. Identifier1"] = "";

        retObject["06. Value1"] = "";

        retObject["07. Identifier2"] = "";

        retObject["08. Value2"] = "";

        retObject["09. Identifier3"] = "";

        retObject["10. Value3"] = "";

        retObject["11. Identifier4"] = "";

        retObject["12. Value4"] = "";

        retObject["13. Identifier5"] = "";

        retObject["14. Value5"] = "";

        retObject["15. LabelName"] = _labelText;


        var dynamicOrObject = new Object();

        dynamicOrObject["logicalName"] = wd_getLogicalName(_keywordObject);
        dynamicOrObject["IgnoreDynamicOR"] = true;
        _keywordObject["DynamicOrObject"] = dynamicOrObject;

        return retObject;
    }

    if (_keywordName == "WD_ClickLinkInTableCell") {

        var retObject = new Object();

        retObject["01. TableName"] = _tableName;

        retObject["02. ColumnName"] = _columnName;

        retObject["03. RowNumber"] = _rowNumber;

        retObject["04. ObjectIndex"] = 0;

        retObject["05. Identifier1"] = "";

        retObject["06. Value1"] = "";

        retObject["07. Identifier2"] = "";

        retObject["08. Value2"] = "";

        retObject["09. Identifier3"] = "";

        retObject["10. Value3"] = "";

        retObject["11. Identifier4"] = "";

        retObject["12. Value4"] = "";

        retObject["13. Identifier5"] = "";

        retObject["14. Value5"] = "";

        retObject["15. LabelName"] = _labelText;


        var dynamicOrObject = new Object();

        dynamicOrObject["logicalName"] = wd_getLogicalName(_keywordObject);
        dynamicOrObject["IgnoreDynamicOR"] = true;
        _keywordObject["DynamicOrObject"] = dynamicOrObject;


        return retObject;
    }

    if (_keywordName == "WD_SelectCheckBoxInTableCell") {
        var retObject = new Object();

        retObject["01. TableName"] = _tableName;

        retObject["02. ColumnName"] = _columnName;

        retObject["03. RowNumber"] = _rowNumber;

        retObject["04. ObjectIndex"] = 0;

        retObject["05. Identifier1"] = "";

        retObject["06. Value1"] = "";

        retObject["07. Identifier2"] = "";

        retObject["08. Value2"] = "";

        retObject["09. Identifier3"] = "";

        retObject["10. Value3"] = "";

        retObject["11. Identifier4"] = "";

        retObject["12. Value4"] = "";

        retObject["13. Identifier5"] = "";

        retObject["14. Value5"] = "";

        retObject["15. LabelName"] = _labelText;

        retObject["16. Status"] = wd_getValueInTable(rawElement);

        var dynamicOrObject = new Object();

        dynamicOrObject["logicalName"] = wd_getLogicalName(_keywordObject);
        dynamicOrObject["IgnoreDynamicOR"] = true;
        _keywordObject["DynamicOrObject"] = dynamicOrObject;
        _keywordObject["InputParameterDefaultValue"] = wd_getValueInTable(rawElement);

        return retObject;
    }

    if (_keywordName == "WD_SelectRadioButtonInTableCell") {

        var retObject = new Object();

        retObject["01. TableName"] = _tableName;

        retObject["02. ColumnName"] = _columnName;

        retObject["03. RowNumber"] = _rowNumber;

        retObject["04. ObjectIndex"] = 0;

        retObject["05. Identifier1"] = "";

        retObject["06. Value1"] = "";

        retObject["07. Identifier2"] = "";

        retObject["08. Value2"] = "";

        retObject["09. Identifier3"] = "";

        retObject["10. Value3"] = "";

        retObject["11. Identifier4"] = "";

        retObject["12. Value4"] = "";

        retObject["13. Identifier5"] = "";

        retObject["14. Value5"] = "";

        retObject["15. LabelName"] = _labelText;


        var dynamicOrObject = new Object();

        dynamicOrObject["logicalName"] = wd_getLogicalName(_keywordObject);
        dynamicOrObject["IgnoreDynamicOR"] = true;
        _keywordObject["DynamicOrObject"] = dynamicOrObject;


        return retObject;
    }

    if (_keywordName == "WD_TypeTextInTableCell") {

        var retObject = new Object();

        retObject["01. TableName"] = _tableName;

        retObject["02. ColumnName"] = _columnName;

        retObject["03. RowNumber"] = _rowNumber;

        retObject["04. ValueToType"] = wd_getValueInTable(rawElement);

        retObject["05. ObjectIndex"] = 0;

        retObject["06. Identifier1"] = "";

        retObject["07. Value1"] = "";

        retObject["08. Identifier2"] = "";

        retObject["09. Value2"] = "";

        retObject["10. Identifier3"] = "";

        retObject["11. Value3"] = "";

        retObject["12. Identifier4"] = "";

        retObject["13. Value4"] = "";

        retObject["14. Identifier5"] = "";

        retObject["15. Value5"] = "";

        retObject["16. LabelName"] = _labelText;

        var dynamicOrObject = new Object();

        dynamicOrObject["logicalName"] = wd_getLogicalName(_keywordObject);
        dynamicOrObject["IgnoreDynamicOR"] = true;
        _keywordObject["DynamicOrObject"] = dynamicOrObject;
        _keywordObject["InputParameterDefaultValue"] = wd_getValueInTable(rawElement);
        return retObject;
    }

    if (_keywordName == "WD_SearchAndSelectLOVInTableCell") {

        var retObject = new Object();

        retObject["01. TableName"] = _tableName;

        retObject["02. ColumnName"] = _columnName;

        retObject["03. LabelName"] = _labelText;

        retObject["04. RowNumber"] = _rowNumber;

        retObject["05. ObjectIndex"] = 0;

        retObject["06. ValueToSelect"] = wd_getValueInTable(rawElement);

        retObject["07. Identifier1"] = "";

        retObject["08. Value1"] = "";

        retObject["09. Identifier2"] = "";

        retObject["10. Value2"] = "";

        retObject["11. Identifier3"] = "";

        retObject["12. Value3"] = "";

        retObject["13. Identifier4"] = "";

        retObject["14. Value4"] = "";

        retObject["15. Identifier5"] = "";

        retObject["16. Value5"] = "";

        var dynamicOrObject = new Object();

        dynamicOrObject["logicalName"] = wd_getLogicalName(_keywordObject);
        dynamicOrObject["IgnoreDynamicOR"] = true;
        _keywordObject["DynamicOrObject"] = dynamicOrObject;
        _keywordObject["InputParameterDefaultValue"] = wd_getValueInTable(rawElement);
        return retObject;
    }

    if (_keywordName == "WD_SelectDateInTableCell") {

        var retObject = new Object();

        retObject["01. TableName"] = _tableName;

        retObject["02. ColumnName"] = _columnName;

        retObject["03. RowNumber"] = _rowNumber;

        retObject["04. ObjectIndex"] = 0;

        retObject["05. Date"] = wd_getValueInTable(rawElement);

        retObject["06. Identifier1"] = "";

        retObject["07. Value1"] = "";

        retObject["08. Identifier2"] = "";

        retObject["09. Value2"] = "";

        retObject["10. Identifier3"] = "";

        retObject["11. Value3"] = "";

        retObject["12. Identifier4"] = "";

        retObject["13. Value4"] = "";

        retObject["14. Identifier5"] = "";

        retObject["15. Value5"] = "";

        retObject["16. LabelName"] = _labelText;

        var dynamicOrObject = new Object();

        dynamicOrObject["logicalName"] = wd_getLogicalName(_keywordObject);
        dynamicOrObject["IgnoreDynamicOR"] = true;
        _keywordObject["DynamicOrObject"] = dynamicOrObject;
        _keywordObject["InputParameterDefaultValue"] = wd_getValueInTable(rawElement);
        return retObject;
    }
    return {};
}

function wd_getInputText() {
    var labels = document.querySelectorAll(`
        [data-automation-id="formLabel"], 
        [data-automation-id="userName"], 
        [data-automation-id="password"], 
        [data-automation-id="timeOffTypeField"], 
        [data-automation-id="durationInput"], 
        [data-automation-id="dateFormLabelField"]
    `);
    
    var results = [];

    var searchbar = document.querySelectorAll('[data-automation-id="globalSearchInput"]');
    if (searchbar.length > 0) { 
        var element = searchbar[0]; 
        results.push({
            label: element.getAttribute("placeholder"), 
            value: element.value 
        });
    }

    labels.forEach(function(label) {
        var labelText = label.innerText || label.textContent;
        var inputId = label.getAttribute("for") || label.getAttribute("class");
        if (!inputId) return;

        var inputElement = document.getElementById(inputId);
        var inputValue = "";

        if (inputElement) {
            if (inputElement.type === "checkbox") {
                inputValue = inputElement.checked ? "on" : "";
            } else {
                inputValue = inputElement.value || inputElement.innerText || inputElement.textContent;
            }
        }

        var durationWrapper = label.closest('[data-automation-id="durationInput"]');
        if (durationWrapper) {
            var durationInput = durationWrapper.querySelector('input[data-automation-id="numberInput"]');
            if (durationInput) {
                inputValue = durationInput.value.trim();
            }
        }

        if (inputId.includes("-dateSection")) {
            var inputElement = document.getElementById(inputId);
            
            var dateWrapper = inputElement?.closest('[data-automation-id="dateTimeWidget"]') ||
                inputElement?.closest('[data-automation-id="datePicker"]') ||
                inputElement?.closest('[data-automation-id="dateFieldContainer"]');
            if (dateWrapper) {
               
                var monthInput = dateWrapper.querySelector('[data-automation-id="dateSectionMonth-input"]');
                var dayInput = dateWrapper.querySelector('[data-automation-id="dateSectionDay-input"]');
                var yearInput = dateWrapper.querySelector('[data-automation-id="dateSectionYear-input"]');

                var month = monthInput?.value.trim() || "";
                var day = dayInput?.value.trim() || "";
                var year = yearInput?.value.trim() || "";

                if (month && day && year) {
                    inputValue = `${month}/${day}/${year}`;
                }
            }
        }

        if (!inputValue && inputId) {
            var hiddenDateField = document.getElementById(`hiddenDateValueId-${inputId}`);
            if (!hiddenDateField) {
                var dateWrapper = document.getElementById(inputId)?.closest('[data-automation-id="dateTimeWidget"]');
                hiddenDateField = dateWrapper ? dateWrapper.querySelector('.css-11dqxqm-AccessibleHide') : null;
            }
            
            if (hiddenDateField) {
                inputValue = hiddenDateField.innerText.trim() || hiddenDateField.textContent.trim();
            }
        }

        if (!inputValue && inputElement) {
            var multiselectContainer = inputElement.closest('[data-automation-id="multiSelectContainer"]');
            if (multiselectContainer) {
                var selectedItems = multiselectContainer.querySelectorAll('[data-automation-id="promptOption"]');
                
                if (selectedItems.length > 0) {
                    inputValue = Array.from(selectedItems)
                        .map(item => item.innerText.trim() || item.textContent.trim())
                        .join(', '); 
                }
            }
        }
 
        if (labelText.includes("Username")) {
            var usernameInput = document.querySelector('[data-automation-id="userName"] input[type="text"]');
            if (usernameInput) {
                inputValue = usernameInput.value || "";
            }
        }
       
        else if (labelText.includes("Password")) {
            var passwordInput = document.querySelector('[data-automation-id="password"] input[type="password"]');
            if (passwordInput) {
                inputValue = passwordInput.value || "";
            }
        }

        if (label.closest('[data-automation-id="timeOffTypeField"]')) {
            labelText = label.querySelector('label').innerText;
            var selectedOption = document.querySelector('li[data-automation-id="menuItem"] p[data-automation-id="promptOption"]');
            if (selectedOption) {
                inputValue = selectedOption.textContent;
            }
        }

        if (labelText != "" && inputValue == "") {
            if (labelText.includes("Start Date") || labelText.includes("End Date")) {
                let nearestSibling = label.parentElement.querySelector('[data-automation-id]:not([data-automation-id="dateFormLabelField"])');
                inputValue = nearestSibling.innerText;
            }   
        }
        results.push({
            label: labelText.trim(),
            value: inputValue.trim()
        });
    });

    return results;
}

function wd_getValue(label, pairs) {
    label = label.toLowerCase().trim();
    for (let pair of pairs) {
        if (pair.label.toLowerCase() === label) {
            return pair.value;
        }
    }
    return "";
}
//  Function to Find Table Based on Table Name
function findTableObjectByTableName(tableName) {
    console.log("Searching for Table Name:", tableName);

    // Select all SPAN elements containing table names
    let tableElements = document.querySelectorAll("span");

    // Find all matching elements (in case of duplicates)
    let matchedElements = Array.from(tableElements).filter(span => span.textContent.trim() === tableName);

    if (matchedElements.length === 0) {
        console.warn("Table name not found:", tableName);
        return null;
    }

    console.log("Table Matches Found:", matchedElements.length);

    // Allow selecting the correct table if multiple matches exist
    let selectedElement = matchedElements[0]; // Change if needed
    let tableParentElement = selectedElement;

    // Traverse 4 levels up in the DOM hierarchy to find the actual table container
    for (let i = 0; i < 4; i++) {
        if (!tableParentElement.parentElement) break;
        tableParentElement = tableParentElement.parentElement;
    }

    if (!tableParentElement) {
        console.warn("Parent table container not found.");
        return null;
    }

    // if (matchedElements.length === 0) {
    //     console.warn("Table name not found:", tableName);
    //     return null;
    // }

    // console.log("Table Matches Found:", matchedElements.length);

    // // Allow selecting the correct table if multiple matches exist
    // let selectedElement = tableElements[0]; // Change if needed
    // let tableParentElement = selectedElement;

    // // Traverse 4 levels up in the DOM hierarchy to find the actual table container
    // for (let i = 0; i < 4; i++) {
    //     if (!tableParentElement.parentElement) break;
    //     tableParentElement = tableParentElement.parentElement;
    // }

    // if (!tableParentElement) {
    //     console.warn("Parent table container not found.");
    //     return null;
    // }

    // console.log("Table Parent Found:", tableParentElement);
    
}

//  Extract Table Data from a Workday Table
function wd_getTableData(table) {
    let results = [];

    // Extract headers (column names)
    let headers = [];
    let headerRow = table.querySelector('[data-automation-id="ghostRow"]') || table.querySelector('thead tr');

    if (headerRow) {
        headers = Array.from(headerRow.querySelectorAll("th, td"))
            .map(cell => cell.innerText.trim())
        // .filter(text => text.length > 0);
    }

    console.log(`Table Headers:`, headers);

    let rows = null;
    try {
        // Select all rows
        rows = headerRow.closest("table").querySelectorAll("tbody tr");
    } catch (error) {
        return;
    }

    if (rows === null) {
        return;
    }

    console.log(`Rows Found:`, rows.length);

    rows.forEach((row) => {
        let cells = row.querySelectorAll('td')

        headers.forEach((header) => {
            let headerIndex = headers.indexOf(header);
            cells.forEach((cell, colIndex) => {
                if (colIndex === headerIndex) {
                    let valueText = "";

                    //  Extract Text Input Field
                    let textField = cell.querySelector('input[type="text"]');
                    if (textField) {
                        valueText = textField.value.trim();
                    }

                    //  Extract Multi-Select Dropdown Field
                    let multiSelectContainer = cell.querySelector('[data-automation-id="responsiveMonikerInput"]');
                    if (multiSelectContainer) {
                        valueText = Array.from(multiSelectContainer.querySelectorAll('[data-automation-id="promptOption"]'))
                            .map(option => option.innerText.trim())
                            .filter(text => text.length > 0)
                            .join(", ");
                    }

                    //  Extract Checkbox Status
                    let checkbox = cell.querySelector('input[type="checkbox"]');
                    if (checkbox) {
                        valueText = checkbox.checked ? "on" : "off";
                    }

                    //  Extract Date from Workday Date Picker
                    let dateWidget = cell.querySelector('[data-automation-id="dateTimeWidget"]');
                    if (dateWidget) {
                        let monthInput = dateWidget.querySelector('input[data-automation-id="dateSectionMonth-input"]');
                        let dayInput = dateWidget.querySelector('input[data-automation-id="dateSectionDay-input"]');
                        let yearInput = dateWidget.querySelector('input[data-automation-id="dateSectionYear-input"]');

                        let month = monthInput?.value.trim() || "";
                        let day = dayInput?.value.trim() || "";
                        let year = yearInput?.value.trim() || "";

                        if (month && day && year) {
                            valueText = `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
                        } else {
                            valueText = dateWidget.textContent.trim();
                        }
                    }

                    // Store extracted value
                    results.push({
                        label: headers[colIndex],
                        value: valueText
                    });
                }
            });
        }
        )





    });

    console.log("Final Extracted Data:", results);
    return results;
}


function wd_getValueInTable(ele) {

    console.log("Raw Element for Cell :-", ele);

    var valueText = '';

    if (ele) {
        if (ele?.nodeName === "INPUT") {
            let inputRole = ele?.getAttribute("role");
            let type = ele?.getAttribute("type")

            if (type === "checkbox") {
                valueText = ele?.checked ? "on" : "off";
            }

            if (inputRole != null && inputRole === "textbox") {
                let dai = ele?.getAttribute("data-automation-id")
                if (dai != null && dai === "textInputBox") {
                    valueText = ele?.value.trim();
                }
            } else {
                let inputWidgetType = ele?.getAttribute("data-uxi-widget-type");
                if (inputWidgetType != null && inputWidgetType === "selectinput") {
                    let dumi = ele?.getAttribute("data-uxi-multiselect-id")
                    if (dumi != null) {
                        let multiSelectContainer = ele?.closest("div[data-automation-id='responsiveMonikerInput']")
                        if (multiSelectContainer) {
                            valueText = Array.from(multiSelectContainer.querySelectorAll('[data-automation-id="promptOption"]'))
                                .map(option => option.innerText.trim())
                                .filter(text => text.length > 0)
                                .join(", ");
                        }
                    }
                }
            }


        }
        if (ele?.nodeName === "DIV") {
            let dai = ele?.getAttribute("data-automation-id")
            if (dai != null && dai === "dateTimeWidget") {

                let monthInput = ele?.querySelector('input[data-automation-id="dateSectionMonth-input"]');
                let dayInput = ele?.querySelector('input[data-automation-id="dateSectionDay-input"]');
                let yearInput = ele?.querySelector('input[data-automation-id="dateSectionYear-input"]');
                let month = monthInput?.value.trim() || "";
                let day = dayInput?.value.trim() || "";
                let year = yearInput?.value.trim() || "";
                if (month && day && year) {
                    valueText = `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
                } else {
                    valueText = ele?.textContent.trim();
                }

                console.log('Final Date', valueText);
            }

        }

    }
    console.log("Its value from Cell :- ", valueText)
    return valueText

}





//  Function to Extract a Specific Column's Value from a Workday Table
// function wd_getValueInTable(tableName, columnName) {
//     let results = [];
//     debugger
//     // Find the table by its name
//     let table = findTableObjectByTableName(tableName);
//     if (table.length<0) {
//         console.log("Table not found:", tableName);
//         return "";
//     }else{
//         table = table[0]
//     }

//     // Get table data
//     results = wd_getTableData(table);

//     if (results === null || results === undefined) {
//         return "";
//     }

//     //  Return the value of the requested column
//     columnName = columnName.toLowerCase().trim();
//     for (let pair of results) {
//         if (pair.label.toLowerCase() === columnName) {
//             return pair.value;
//         }
//     }

//     return "";
// }

function wd_getLabelText(rawElement) {
    var _lableText = "";

    if (_lableText == "" || _lableText == "\t") {
        if (rawElement.getAttribute("placeholder") != null) {
            _lableText = rawElement.getAttribute("placeholder");
        }
    }

    if (_lableText == "" || _lableText == "\t") {
        if (rawElement.getAttribute("title") != null) {
            _lableText = rawElement.getAttribute("title");
        }
    }

    if (_lableText == "" || _lableText == "\t") {
        if (rawElement.getAttribute("aria-label") != null) {
            _lableText = rawElement.getAttribute("aria-label");
        }
    }

    if (_lableText == "" || _lableText == "\t") {
        if (rawElement.nodeName != "INPUT" && rawElement.value != null && rawElement.value != "") {
            _lableText = rawElement.value;
        }
    }

    if (_lableText == "" || _lableText == "\t") {
        if (rawElement.nodeName == "INPUT" && rawElement.type == "submit" && rawElement.value != null && rawElement.value != "") {
            _lableText = rawElement.value;
        }
    }

    if (_lableText == "" || _lableText == "\t") {
        _lableText = rawElement.innerText;
    }

    if (_lableText != null) {
        _lableText = _lableText.trim();
    }

    if (_lableText != null && _lableText != "") {
        return _lableText;
    }
    return "";
}

function removeUnwantedDataFromLabel(label) {
    if (label == null && label == "") {
        return;
    }
    label = label?.replace("Required. Sort and filter column", "");
    label = label?.replace("Sort and filter column", "");
    label = label?.replace("Filter column", "");
    label = label?.replace(/\s*\(?\s*\d+\s*\)?/g, '').trim();

    return label;
}

function wd_getHeaderObject(_headerName, _headerObjectList) {
    for (var hli = 0; hli < _headerObjectList.length; hli++) {
        if (_headerObjectList[hli]["HeaderName"] == _headerName) {
            return _headerObjectList[hli];
        }
    }
    return null;
}

function wd_computeHeaderGroup(_elementArray) {
    var outArray = [];
    var addedElements = [];

    for (var eli = 0; eli < _elementArray.length; eli++) {
        var _elementObject = _elementArray[eli];

        var finalHeaderXpath = "";
        for (var hi = 1; hi < 7; hi++) {
            if (finalHeaderXpath != "") {
                finalHeaderXpath += " | ";
            }
            finalHeaderXpath += "preceding::h" + hi + "[not(contains(@data-automation-id, 'accordionHeaderTitle'))]";
        }


        var _headers = wd_findByXPath(finalHeaderXpath, _elementObject, true);
        _headers = wd_utils_filterVisibleElements(_headers);
        var _headerText = "";
        var _header = null;
        if (_headers.length > 0) {
            _header = _headers[_headers.length - 1];
            _headerText = _header.innerText;
        }

        if (_headerText != null) {
            if (_headerText == "Worker Information") {
                _header = _headers[_headers.length - 2];
                if (_header != null) {
                    _headerText = _header.innerText;
                }
            }
        }

        if (_header == null) {
            _header = document.createElement("H1");
            _header.innerText = "";
        }
        var addedHeader = wd_getHeaderObject(_headerText, outArray);

        if (addedElements.indexOf(_elementObject) > -1) {
            continue;
        }

        addedElements.push(_elementObject);

        if (addedHeader != null) {
            addedHeader["RawElements"].push(_elementObject);
            addedHeader["HeaderElement"] = _header;
        }
        else {
            var headerObject = new Object();
            headerObject["HeaderName"] = _headerText;
            headerObject["RawElements"] = [];

            headerObject["RawElements"].push(_elementObject);
            headerObject["HeaderElement"] = _header;
            outArray.push(headerObject);
        }
    }

    outArray.sort((a, b) => a["HeaderElement"].getBoundingClientRect().top - b["HeaderElement"].getBoundingClientRect().top);
    return outArray;
}

function wd_getAllHeaders() {
    var outArray = [];

    var popupOverLayFound = false;

    for (var pxpi = 0; pxpi < wd_popuXpathArrays.length; pxpi++) {
        var xpathElements = wd_findByXPath(wd_popuXpathArrays[pxpi], document, true);

        var xpathElementsArray = [];
        xpathElementsArray.push(...xpathElements);

        xpathElementsArray = wd_utils_filterVisibleElements(xpathElementsArray, true);
        for (var pxpei = 0; pxpei < xpathElementsArray.length; pxpei++) {
            var tempArray = [];

            tempArray.push(...wd_findByXPath("//h1[not(contains(@data-automation-id, 'accordionHeaderTitle'))]", xpathElementsArray[pxpei], true));

            tempArray.push(...wd_findByXPath("//h2[not(contains(@data-automation-id, 'accordionHeaderTitle'))]", xpathElementsArray[pxpei], true));

            tempArray.push(...wd_findByXPath("//h3[not(contains(@data-automation-id, 'accordionHeaderTitle'))]", xpathElementsArray[pxpei], true));

            for (var ti = 0; ti < tempArray.length; ti++) {
                var cond3 = (tempArray[ti].childNodes.length == 1 && (tempArray[ti].childNodes[0].nodeName == "#text" || tempArray[ti].childNodes[0].nodeName == "SPAN"));
                if (tempArray[ti] != null && (tempArray[ti].childNodes.length == 0 || cond3 == true)) {
                    outArray.push(tempArray[ti]);
                    popupOverLayFound = true;
                }
            }

        }
    }


    if (popupOverLayFound == false) {
        for (var xpi = 0; xpi < wd_xpathArrays.length; xpi++) {
            var xpathElements = wd_findByXPath(wd_xpathArrays[xpi], document, true);

            var xpathElementsArray = [];
            xpathElementsArray.push(...xpathElements);

            xpathElementsArray = wd_utils_filterVisibleElements(xpathElementsArray, true);
            for (var xpei = 0; xpei < xpathElementsArray.length; xpei++) {
                var tempArray = [];

                tempArray.push(...xpathElementsArray[xpei].getElementsByTagName("H1"));
                tempArray.push(...xpathElementsArray[xpei].getElementsByTagName("H2"));
                tempArray.push(...xpathElementsArray[xpei].getElementsByTagName("H3"));

                for (var ti = 0; ti < tempArray.length; ti++) {
                    var cond3 = (tempArray[ti].childNodes.length == 1 && (tempArray[ti].childNodes[0].nodeName == "#text" || tempArray[ti].childNodes[0].nodeName == "SPAN"));
                    if (tempArray[ti] != null && (tempArray[ti].childNodes.length == 0 || cond3 == true)) {
                        outArray.push(tempArray[ti]);
                    }
                }

            }
        }
    }
    outArray.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

    return outArray;
}

function wd_getAllLabels(mainElement) {
    var outArray = [];
    outArray.push(...mainElement.getElementsByTagName("LABEL"));
    return outArray;
}

function wd_getAllTabels(mainElement) {
    var outArray = [];
    var alltables = mainElement.getElementsByTagName("TABLE");
    // Added by Maheep Gupta
    alltables = wd_utils_filterVisibleElements(alltables);
    for (_table of alltables) {
        // Added by Maheep Gupta
        if (wd_istablevalid(_table) || wd_istablevalidWithoutTH(_table)) {

            var tableOfTh = wd_getTableFromTh(_table);
            if (tableOfTh == null) {
                var tableOfTbodyOnly = wd_getTableFromTBody(_table);
                if (tableOfTbodyOnly == null) {
                    continue;
                }
            }
            if (tableOfTh != null) {
                if (outArray.indexOf(tableOfTh) == -1) {
                    outArray.push(tableOfTh);
                }
            }
            if (tableOfTbodyOnly != null) {
                if (outArray.indexOf(tableOfTbodyOnly) == -1) {
                    outArray.push(tableOfTbodyOnly);
                }
            }
        }
    }
    return outArray;
}

function wd_getTableFromTh(_table) {
    var _thElement = _table.getElementsByTagName("TH")[0];
    if (_thElement != null) {
        var _tempElement = _thElement.parentNode;
        while (_tempElement != null) {
            if (_tempElement.nodeName == "TABLE") {
                return _tempElement;
            }

            _tempElement = _tempElement.parentNode;
        }
    }
    return null;
}
// Added by Maheep
function wd_getTableFromTBody(_table) {
    var _tbody = _table.getElementsByTagName("TBODY")[0];
    var _thElement = _tbody.getElementsByTagName("TR")[0]

    if (_thElement != null) {
        var _tempElement = _thElement.parentNode;
        while (_tempElement != null) {
            if (_tempElement.nodeName == "TABLE") {
                return _tempElement;
            }

            _tempElement = _tempElement.parentNode;
        }
    }
    return null;
}

function wd_getButtonAndHyperLinks(mainElement) {
    var outArray = [];
    outArray.push(...mainElement.getElementsByTagName("A"));
    outArray.push(...mainElement.getElementsByTagName("LI"));
    outArray.push(...mainElement.getElementsByTagName("INPUT"));
    // Change by Maheep Gupta
    outArray.push(...mainElement.getElementsByTagName("TEXTAREA"));


    outArray.push(...wd_findByXPath("//div[@role='button' and not(contains(@data-automation-id, 'grid')) and not(contains(@data-automation-id, 'Button')) and not(contains(@data-automation-id, 'relatedIconContainer')) and not(contains(@data-automation-id, 'errorWidgetBarCanvas'))]", mainElement, true));

    outArray.push(...wd_findByXPath("//div[@data-automation-id=\"dropDownCommandButton\"]//button", mainElement, true));

    outArray.push(...wd_findByXPath("//button[@data-automation-id=\"seamlessSavePopupRestore\"]", mainElement, true));

    outArray.push(...wd_findByXPath("//button[@data-automation-id=\"panelSetAddButton\"]", mainElement, true));

    outArray.push(...wd_findByXPath("//button[@data-automation-id=\"goButton\"]", mainElement, true));

    outArray.push(...wd_findByXPath("//button[@data-automation-id=\"label\"]", mainElement, true));

    outArray.push(...wd_findByXPath("//button[contains(@data-automation-id, 'addButton') or contains(@data-automation-id, 'AddButton') or contains(@data-automation-id, 'ButtonApi')]", mainElement, true));

    outArray.push(...wd_findByXPath("//button[contains(@data-automation-id, 'segmentedButton')]", mainElement, true));

    outArray.push(...wd_findByXPath("//button[contains(@data-automation-id, 'cancelButton') or contains(@data-automation-id,'submitButton')]", mainElement, true));

    outArray.push(...wd_findByXPath("//li[@role=\"menuitem\"]", mainElement, true));

    outArray.push(...wd_findByXPath("//div[@data-automation-id=\"hammy_profile_link\"]", mainElement, true));

    outArray.push(...wd_findByXPath("//h3[@data-automation-id=\"pex-card-title\"]", mainElement, true));

    outArray.push(...wd_findByXPath("//h4[@data-automation-id=\"pex-card-title\"]", mainElement, true));
    return outArray;
}

function wd_istablevalid(_table) {
    var _headres = _table.getElementsByTagName("TH");
    if (_headres.length > 0) {
        return true;
    }
    return false;
}
function wd_istablevalidWithoutTH(_table) {
    const tbody = _table.querySelector("TBODY");
    if (tbody) {
        const rows = tbody.getElementsByTagName("TR");
        const headerRows = [];
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].getAttribute("data-automation-id") === "gridHeaderRow") {
                headerRows.push(rows[i])
            }
        }
        if (headerRows.length == 2 && rows.length > 2) {
            return true
        }
    }
    return false;
}


function wd_utils_filterVisibleElements(_elementsArray, checkAllCond) {
    var outArray = [];
    for (_element of _elementsArray) {
        if (wd_IsElementVisible(_element, checkAllCond)) {
            outArray.push(_element);
        }
    }
    return outArray;
}


function wd_IsElementVisible(element, checkAllCond) {

    // Check if the element exists
    if (!element) {
        return false;
    }

    // Check if the element is connected to the DOM
    if (!element.isConnected) {
        return false;
    }

    // Check if the element or any of its ancestors are hidden
    let currentElement = element;
    while (currentElement) {
        const style = window.getComputedStyle(currentElement);

        if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
            return false;
        }

        var ariaHidden = currentElement.getAttribute("aria-hidden");

        if (ariaHidden != null && ariaHidden == "true") {
            return false;
        }
        currentElement = currentElement.parentElement;
    }

    // Check if the element is within the viewport
    const rect = element.getBoundingClientRect();
    const viewportHeight = (window.innerHeight || document.documentElement.clientHeight);
    const viewportWidth = (window.innerWidth || document.documentElement.clientWidth);

    /*
        const inViewport = (
            rect.top >= 0 &&
            rect.left >= 0
        );
        */
    return true;
};



function WD_areAllParentsVisible(element) {
    let currentElement = element;

    while (currentElement) {
        var parentVisible = wd_IsElementVisible(element, true);

        if (parentVisible == false) {
            return parentVisible;
        }
        currentElement = currentElement.parentElement;
    }

    return true;
}

function wd_findByXPath(xpath, context = document, all = false) {
    const resultType = all ? XPathResult.ORDERED_NODE_SNAPSHOT_TYPE : XPathResult.FIRST_ORDERED_NODE_TYPE;
    const result = document.evaluate(xpath, context, null, resultType, null);

    if (all) {
        const nodes = [];
        for (let i = 0; i < result.snapshotLength; i++) {
            nodes.push(result.snapshotItem(i));
        }
        return nodes;
    } else {
        return result.singleNodeValue;
    }
}

