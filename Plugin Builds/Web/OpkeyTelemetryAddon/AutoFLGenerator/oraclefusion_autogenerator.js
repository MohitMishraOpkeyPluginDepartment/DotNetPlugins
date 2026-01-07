var of_all_processed_elements = [];
var of_all_processed_table_elements= [];
var allpopsXpath = [];
var of_popuXpathArrays = [];
var ReserveLabel = null;
var of_xpathArrays = ["//body[contains(@class, 'AFMaximized') or contains(@class, 'oj-body')]", "//div[@class='content']","//body"];
var labelCountMap = new Map();
var findAllinnerText = [];
var check_forOtherAttributes = false;
var label_indexForClickByText = -1;
var myIndex = 0;
var all_elements_contains_opkeyID = new Map();

function of_applyStoredOpkeyIdsFromMap() {
  if (!all_elements_contains_opkeyID || !(all_elements_contains_opkeyID instanceof Map)) {
    console.warn("all_elements_contains_opkeyID is not a valid Map");
    return;
  }

  for (const [xpath, meta] of all_elements_contains_opkeyID.entries()) {
    const matchedElements = of_findByXPath(xpath, document, true); 

    matchedElements.forEach(el => {
      if (el) {
        el.setAttribute("opkey-autofl-element-id", meta.opkey_autofl_element_id);
      }
    });
  }
}


function OracleFusion_getCurrentPageSnapshotJSON() {
    const stored = localStorage.getItem("opkey-scanned-elements");
    if (!stored || stored.trim() === "") {
        all_elements_contains_opkeyID = new Map();
    } else {
        try {
            const parsed = JSON.parse(stored);
            all_elements_contains_opkeyID = new Map(parsed);
        } catch (e) {
            console.error("Failed to parse stored map:", e);
            all_elements_contains_opkeyID = new Map();
        }
    }
    of_applyStoredOpkeyIdsFromMap()
    localStorage.removeItem("opkey-scanned-elements");

    console.log(all_elements_contains_opkeyID);
    
    debugger
    of_all_processed_elements = [];

    var of_allPageElements = of_getCurrentPageElements();

    of_allPageElements = of_utils_filterVisibleElements(of_allPageElements, false);

    of_allPageElements = of_alignElements(of_allPageElements);

    var computedHeaders = of_computeHeaderGroup(of_allPageElements);

    computedHeaders = of_addElementType(computedHeaders);
    labelCountMap.clear();
    allpopsXpath = [];
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

   localStorage.setItem("opkey-scanned-elements", JSON.stringify(Array.from(all_elements_contains_opkeyID.entries())));
    return computedHeaders;
}

function of_alignElements(outArray) {
   
   
    var newArray = [];

    var lastPositionElements = []
    for (var oai = 0; oai < outArray.length; oai++) {
        
        var tempElement = outArray[oai];
        if(tempElement.nodeName == "LI" || tempElement.nodeName == "A")
        {
            // debugger;
        }
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

function of_getCurrentPageElements() {
    var outArray = [];
    var popupOverLayFound = false;

    for (var pxpi = 0; pxpi < of_popuXpathArrays.length; pxpi++) {
        var xpathElements = of_findByXPath(of_popuXpathArrays[pxpi], document, true);

        var xpathElementsArray = [];
        //Spread Operator
        xpathElementsArray.push(...xpathElements);

        xpathElementsArray = of_utils_filterVisibleElements(xpathElementsArray, true);
        for (var pxpei = 0; pxpei < xpathElementsArray.length; pxpei++) {
            var of_allLables = of_getAllLabels(xpathElementsArray[pxpei]);
            var of_allTables = of_getAllTabels(xpathElementsArray[pxpei]);
            var of_buttonshyperlinks = of_getButtonAndHyperLinks(xpathElementsArray[pxpei]);
            // Write logic to get all the oj Elements
            var of_ojActionCards = of_getAllOjElements(xpathElementsArray[pxpei])

            outArray.push(...of_allLables);
            outArray.push(...of_allTables);
            outArray.push(...of_buttonshyperlinks);
            outArray.push(...of_ojActionCards);
            popupOverLayFound = true;
        }
    }

    if (popupOverLayFound == false) {
        for (var xpi = 0; xpi < of_xpathArrays.length; xpi++) {
            var xpathElements = of_findByXPath(of_xpathArrays[xpi], document, true);

            var xpathElementsArray = [];
            xpathElementsArray.push(...xpathElements);

            xpathElementsArray = of_utils_filterVisibleElements(xpathElementsArray, true);
            //................................................POP'US............................................
            of_checkForPopsXpath(xpathElementsArray[pxpei]);
            //................................................POP'US............................................
            if (allpopsXpath.length != 0) {
                xpathElementsArray = allpopsXpath;
            }
            for (var xpei = 0; xpei < xpathElementsArray.length; xpei++) {
                var of_allLables=null;
                var of_allTables=null;
                var of_buttonshyperlinks=null;
                of_allLables= of_getAllLabels(xpathElementsArray[xpei]);
                if (allpopsXpath.length != 0) {
                   of_allTables = of_getAllTabelsforPopus(xpathElementsArray[xpei]);
                   of_buttonshyperlinks = of_getButtonAndHyperLinksforPopus(xpathElementsArray[xpei]);
                }
                else
                {
                 of_allTables = of_getAllTabels(xpathElementsArray[xpei]);
                 of_buttonshyperlinks = of_getButtonAndHyperLinks(xpathElementsArray[xpei]);
                }
                // Write logic to get all the oj Elements
                var of_ojActionCards = of_getAllOjElements(xpathElementsArray[xpei])
                outArray.push(...of_allLables);
                outArray.push(...of_allTables);
                outArray.push(...of_buttonshyperlinks);
                outArray.push(...of_ojActionCards);
            }
        }
    }
    outArray.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

    return outArray;
}

function of_addElementType(computedHeaders) {

    for (var cg = 0; cg < computedHeaders.length; cg++) {
        var computedHeader = computedHeaders[cg];
        computedHeader["StepObject"] = [];

        for (var re = 0; re < computedHeader["RawElements"].length; re++) {
            var rawElement = computedHeader["RawElements"][re];


            if (rawElement.nodeName == "LABEL") {
                ReserveLabel = rawElement;
                of_addElementTypeForLabelElement(rawElement, computedHeader["StepObject"]);
            }

            if (rawElement.nodeName == "A" || rawElement.nodeName == "BUTTON" || rawElement.nodeName == "LI" || rawElement.nodeName == "INPUT" || rawElement.nodeName == "IMG" || rawElement.nodeName == "SELECT") {
                of_addElementTypeForClickableElement(rawElement, computedHeader["StepObject"]);
            }

            if ((rawElement.nodeName == "DIV" && rawElement.getAttribute("_leafcolclientids") == null) || rawElement.nodeName == "OJ-ACTION-CARD" || rawElement.nodeName == "OJ-SP-FILTER-CHIP") {
                of_addElementTypeForClickableElement(rawElement, computedHeader["StepObject"]);
            }

            if ((rawElement.nodeName == "DIV" && rawElement.getAttribute("_leafcolclientids") != null)) {
                of_addElementTypeForTableElementWithDiv(rawElement, computedHeader["StepObject"]);
            }
            if(rawElement.nodeName == "TABLE"){
                of_addElementTypeForTableElement(rawElement, computedHeader["StepObject"])
            }
        }
    }

    return computedHeaders;
}

function of_getFLInputParameterName(_keywordObject) {
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
        // return parameterName.replace(/ /g, "_") + "_" + "inputPrameter"
        //    return parameterName.replace(/ /g, "_");
        return parameterName;
    }
}

function of_addElementTypeForTableElement(tableElement, stepArrays) {
    //console.log(tableElement)

    var tableName = "";
    var _tableName = "";
    var captionElement = tableElement.getElementsByTagName("CAPTION")[0];

    if (captionElement != null) {
        _tableName=captionElement.innerText;
    }
    var tableHeaders = [];

    var tableHeadElement = tableElement.getElementsByTagName("THEAD")[0];

    var tableBodyElement = tableElement.getElementsByTagName("TBODY")[0];

    if (tableHeadElement == null || tableBodyElement == null) {
        return;
    }

    var headerElements = [];
    headerElements.push(...tableHeadElement.getElementsByTagName("TD"));
    headerElements.push(...tableHeadElement.getElementsByTagName("TH"));

    for (var hei = 0; hei < headerElements.length; hei++) {
        if( (headerElements[hei].innerText == "No Data")  ){
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
        var trElem = rowElements[tri];

        var rowColumnElements = [];
        rowColumnElements.push(...trElem.getElementsByTagName("TD"));
        of_addKeywordsToTableElement(rowColumnElements, tableHeaders, tableName, tri, stepArrays,tableElement)

        // for (var tdi = 0; tdi < rowColumnElements.length; tdi++) {

        //     var conditionFound = false;

        //     var rowColumnElement = rowColumnElements[tdi];

        //     if (
        //         tableHeaders[tdi] === '' &&
        //         rowColumnElement.innerText.trim() === '' &&
        //         rowColumnElement.children.length === 0
        //     ) {
        //         continue;
        //     }

        //     var columnName = tableHeaders[tdi];

        //     var columnElements = [];
        //     columnElements.push(...rowColumnElement.getElementsByTagName("INPUT"));
        //     columnElements.push(...rowColumnElement.getElementsByTagName("BUTTON"));
        //     columnElements.push(...rowColumnElement.getElementsByTagName("A"));
        //     columnElements.push(...rowColumnElement.getElementsByTagName("IMG"));
        //     columnElements.push(...of_findByXPath(".//div[contains(@data-automation-id, 'date')]", rowColumnElement, true));
        //     columnElements.push(...of_findByXPath(".//div[contains(@data-automation-id, 'selectedItem')]", rowColumnElement, true));
        //     columnElements.push(...of_findByXPath(".//div[@role='textbox']", rowColumnElement, true));
        //     columnElements.push(...of_findByXPath(".//div[@data-automation-id=\"textArea\"]", rowColumnElement, true));
        //     debugger
        //     const emptyStates = of_findByXPath(".//oj-sp-empty-state", rowColumnElement, true);

        //     if(emptyStates.length !=0){
        //         continue
        //     }

        //     if (columnElements.length == 0) {
        //         var _keywordObject = new Object();
        //         _keywordObject["StepId"] = opkey_createUUID();
        //         _keywordObject["StepSelected"] = true;
        //         _keywordObject["Keyword"] = "OracleFusion_ClickTableCell";
        //         _keywordObject["TableName"] = tableName;
        //         _keywordObject["RowNumber"] = tri;
        //         _keywordObject["TableHeaders"] = tableHeaders;
        //         _keywordObject["ColumnName"] = columnName;
        //         _keywordObject["ElementType"] = "tableCell"
        //         _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
        //         _keywordObject["StepElement"] = rowColumnElement;
        //         _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
        //         stepArrays.push(_keywordObject);
        //         conditionFound = true;
        //     }

        //     for (var cei = 0; cei < columnElements.length; cei++) {
        //         var columnElement = columnElements[cei];

        //         var dataAutomationId = null;
        //         if (columnElement.getAttribute("data-automation-id") != null) {
        //             dataAutomationId = columnElement.getAttribute("data-automation-id");
        //         }

        //         if (dataAutomationId == null || dataAutomationId == "") {
        //             if (columnElement.getAttribute("data-uxi-widget-type") != null) {
        //                 dataAutomationId = columnElement.getAttribute("data-uxi-widget-type");
        //             }
        //         }

        //         if (tableName == null || tableName == "") {
        //             debugger
        //             var finalHeaderXpath = "";
        //             for (var hi = 1; hi < 7; hi++) {
        //                 if (finalHeaderXpath != "") {
        //                     finalHeaderXpath += " | ";
        //                 }
        //                 finalHeaderXpath += "preceding::h" + hi + "[not(contains(@data-automation-id, 'accordionHeaderTitle'))]";
        //             }
                    

        //             var _headers = of_findByXPath(finalHeaderXpath, columnElement, true);
        //             if (_headers.length > 0 && _headers[_headers.length - 1].innerText != null && _headers[_headers.length - 1].innerText != "") {
                        
        //                 // tableName = of_getTableName(_headers)
        //                 var hiele=_headers.length - 1;
        //                 tableName = _headers[hiele].innerText;
        //                 tableName = tableName.trim()
        //                 while(tableName == "" || tableName == null ){
        //                     if(of_IsElementVisible(_headers[hiele])){
        //                         tableName = _headers[hiele].innerText;
        //                     }
        //                     hiele--;
        //                 }
        //             }
        //         }

        //         if (conditionFound == false && columnElement.nodeName == "IMG") {
        //             var _keywordObject = new Object();
        //             _keywordObject["StepId"] = opkey_createUUID();
        //             _keywordObject["StepSelected"] = true;
        //             _keywordObject["Keyword"] = "OracleFusion_ClickImageInTableCell";
        //             _keywordObject["TableName"] = tableName;
        //             _keywordObject["RowNumber"] = tri;
        //             _keywordObject["TableHeaders"] = tableHeaders;
        //             _keywordObject["ColumnName"] = columnName;
        //             _keywordObject["ElementType"] = "tableCell"
        //             _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
        //             _keywordObject["StepElement"] = rowColumnElement;
        //             _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
        //             stepArrays.push(_keywordObject);
        //             conditionFound = true;
        //         }

        //         if (conditionFound == false && columnElement.nodeName == "A") {
        //             var _keywordObject = new Object();
        //             _keywordObject["StepId"] = opkey_createUUID();
        //             _keywordObject["StepSelected"] = true;
        //             _keywordObject["Keyword"] = "OracleFusion_ClickLinkInTableCell";
        //             _keywordObject["TableName"] = tableName;
        //             _keywordObject["RowNumber"] = tri;
        //             _keywordObject["TableHeaders"] = tableHeaders;
        //             _keywordObject["ColumnName"] = columnName;
        //             _keywordObject["ElementType"] = "tableCell"
        //             _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
        //             _keywordObject["StepElement"] = rowColumnElement;
        //             _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
        //             stepArrays.push(_keywordObject);
        //             conditionFound = true;
        //         }

        //         if (conditionFound == false && columnElement.nodeName == "BUTTON") {
        //             var _keywordObject = new Object();
        //             _keywordObject["StepId"] = opkey_createUUID();
        //             _keywordObject["StepSelected"] = true;
        //             _keywordObject["Keyword"] = "OracleFusion_ClickTableCell";
        //             _keywordObject["TableName"] = tableName;
        //             _keywordObject["RowNumber"] = tri;
        //             _keywordObject["TableHeaders"] = tableHeaders;
        //             _keywordObject["ColumnName"] = columnName;
        //             _keywordObject["ElementType"] = "tableCell"
        //             _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
        //             _keywordObject["StepElement"] = rowColumnElement;
        //             _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
        //             stepArrays.push(_keywordObject);
        //             conditionFound = true;
        //         }
        //         if (conditionFound == false && columnElement.nodeName == "DIV" && dataAutomationId != null && dataAutomationId.indexOf("date") > -1) {

        //             var _keywordObject = new Object();
        //             _keywordObject["StepId"] = opkey_createUUID();
        //             _keywordObject["StepSelected"] = true;
        //             _keywordObject["Keyword"] = "OracleFusion_SelectDateInTableCell";
        //             _keywordObject["TableName"] = tableName;
        //             _keywordObject["RowNumber"] = tri;
        //             _keywordObject["TableHeaders"] = tableHeaders;
        //             _keywordObject["ColumnName"] = columnName;
        //             _keywordObject["ElementType"] = "tableCell"
        //             _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
        //             _keywordObject["StepElement"] = rowColumnElement;
        //             _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
        //             _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
        //             stepArrays.push(_keywordObject);
        //             conditionFound = true;
        //         }

        //         if (conditionFound == false && columnElement.nodeName == "DIV" && dataAutomationId != null && dataAutomationId.indexOf("selectedItem") > -1) {

        //             var _keywordObject = new Object();
        //             _keywordObject["StepId"] = opkey_createUUID();
        //             _keywordObject["StepSelected"] = true;
        //             _keywordObject["Keyword"] = "OracleFusion_SearchAndSelectLOVInTableCell";
        //             _keywordObject["TableName"] = tableName;
        //             _keywordObject["RowNumber"] = tri;
        //             _keywordObject["TableHeaders"] = tableHeaders;
        //             _keywordObject["ColumnName"] = columnName;
        //             _keywordObject["ElementType"] = "tableCell"
        //             _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
        //             _keywordObject["StepElement"] = rowColumnElement;
        //             _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
        //             _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
        //             stepArrays.push(_keywordObject);
        //             conditionFound = true;
        //         }

        //         if (conditionFound == false && columnElement.nodeName == "DIV" && dataAutomationId != null && dataAutomationId.indexOf("textArea") > -1) {

        //             var _keywordObject = new Object();
        //             _keywordObject["StepId"] = opkey_createUUID();
        //             _keywordObject["StepSelected"] = true;
        //             _keywordObject["Keyword"] = "OracleFusion_TypeTextInTableCell";
        //             _keywordObject["TableName"] = tableName;
        //             _keywordObject["RowNumber"] = tri;
        //             _keywordObject["TableHeaders"] = tableHeaders;
        //             _keywordObject["ColumnName"] = columnName;
        //             _keywordObject["ElementType"] = "tableCell"
        //             _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
        //             _keywordObject["StepElement"] = rowColumnElement;
        //             _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
        //             _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
        //             stepArrays.push(_keywordObject);
        //             conditionFound = true;
        //         }

        //         if (conditionFound == false && columnElement.nodeName == "INPUT") {

        //             if (columnElement.type != null) {
        //                 if (columnElement.type == "checkbox") {
        //                     var _keywordObject = new Object();
        //                     _keywordObject["StepId"] = opkey_createUUID();
        //                     _keywordObject["StepSelected"] = true;
        //                     _keywordObject["Keyword"] = "OracleFusion_SelectCheckBoxInTableCell";
        //                     _keywordObject["TableName"] = tableName;
        //                     _keywordObject["RowNumber"] = tri;
        //                     _keywordObject["TableHeaders"] = tableHeaders;
        //                     _keywordObject["ColumnName"] = columnName;
        //                     _keywordObject["ElementType"] = "tableCell"
        //                     _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
        //                     _keywordObject["StepElement"] = rowColumnElement;
        //                     _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
        //                     _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
        //                     stepArrays.push(_keywordObject);
        //                     conditionFound = true;
        //                 }
        //                 else if (columnElement.type == "radio") {
        //                     var _keywordObject = new Object();
        //                     _keywordObject["StepId"] = opkey_createUUID();
        //                     _keywordObject["StepSelected"] = true;
        //                     _keywordObject["Keyword"] = "OracleFusion_SelectRadioButtonInTableCell";
        //                     _keywordObject["TableName"] = tableName;
        //                     _keywordObject["RowNumber"] = tri;
        //                     _keywordObject["TableHeaders"] = tableHeaders;
        //                     _keywordObject["ColumnName"] = columnName;
        //                     _keywordObject["ElementType"] = "tableCell"
        //                     _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
        //                     _keywordObject["StepElement"] = rowColumnElement;
        //                     _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
        //                     stepArrays.push(_keywordObject);
        //                     conditionFound = true;
        //                 }

        //                 else if (columnElement.type == "text" || columnElement.type == "password" || columnElement.type == "search") {

        //                     if (dataAutomationId != null && dataAutomationId.indexOf("date") > -1) {
        //                         var _keywordObject = new Object();
        //                         _keywordObject["StepId"] = opkey_createUUID();
        //                         _keywordObject["StepSelected"] = true;
        //                         _keywordObject["Keyword"] = "OracleFusion_SelectDateInTableCell";
        //                         _keywordObject["TableName"] = tableName;
        //                         _keywordObject["RowNumber"] = tri;
        //                         _keywordObject["TableHeaders"] = tableHeaders;
        //                         _keywordObject["ColumnName"] = columnName;
        //                         _keywordObject["ElementType"] = "tableCell"
        //                         _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
        //                         _keywordObject["StepElement"] = rowColumnElement;
        //                         _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
        //                         _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
        //                         stepArrays.push(_keywordObject);
        //                         conditionFound = true;
        //                     }
        //                     else if (dataAutomationId != null && (dataAutomationId.indexOf("searchBox") > -1 || dataAutomationId.indexOf("selectinput") > -1)) {
        //                         var _keywordObject = new Object();
        //                         _keywordObject["StepId"] = opkey_createUUID();
        //                         _keywordObject["StepSelected"] = true;
        //                         _keywordObject["Keyword"] = "OracleFusion_SearchAndSelectLOVInTableCell";
        //                         _keywordObject["TableName"] = tableName;
        //                         _keywordObject["RowNumber"] = tri;
        //                         _keywordObject["TableHeaders"] = tableHeaders;
        //                         _keywordObject["ColumnName"] = columnName;
        //                         _keywordObject["ElementType"] = "tableCell"
        //                         _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
        //                         _keywordObject["StepElement"] = rowColumnElement;
        //                         _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
        //                         _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
        //                         stepArrays.push(_keywordObject);
        //                         conditionFound = true;
        //                     }
        //                 }
        //             }
        //         }
        //     }

        //     if (conditionFound == false) {

        //         if (dataAutomationId != null && dataAutomationId.indexOf("date") > -1) {
        //             var _keywordObject = new Object();
        //             _keywordObject["StepId"] = opkey_createUUID();
        //             _keywordObject["StepSelected"] = true;
        //             _keywordObject["Keyword"] = "OracleFusion_SelectDateInTableCell";
        //             _keywordObject["TableName"] = tableName;
        //             _keywordObject["RowNumber"] = tri;
        //             _keywordObject["TableHeaders"] = tableHeaders;
        //             _keywordObject["ColumnName"] = columnName;
        //             _keywordObject["ElementType"] = "tableCell"
        //             _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
        //             _keywordObject["StepElement"] = rowColumnElement;
        //             _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
        //             _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
        //             stepArrays.push(_keywordObject);
        //             conditionFound = true;
        //         }

        //         else if ((columnElement.getAttribute("role") != null && columnElement.getAttribute("role") == "textbox") || (columnElement.type != null && columnElement.type == "text")) {
        //             var _keywordObject = new Object();
        //             _keywordObject["StepId"] = opkey_createUUID();
        //             _keywordObject["StepSelected"] = true;
        //             _keywordObject["Keyword"] = "OracleFusion_TypeTextInTableCell";
        //             _keywordObject["TableName"] = tableName;
        //             _keywordObject["RowNumber"] = tri;
        //             _keywordObject["TableHeaders"] = tableHeaders;
        //             _keywordObject["ColumnName"] = columnName;
        //             _keywordObject["ElementType"] = "tableCell"
        //             _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
        //             _keywordObject["StepElement"] = rowColumnElement;
        //             _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
        //             _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
        //             stepArrays.push(_keywordObject);
        //             conditionFound = true;
        //         }
        //         else {
        //             var _keywordObject = new Object();
        //             _keywordObject["StepId"] = opkey_createUUID();
        //             _keywordObject["StepSelected"] = true;
        //             _keywordObject["Keyword"] = "OracleFusion_ClickTableCell";
        //             _keywordObject["TableName"] = tableName;
        //             _keywordObject["RowNumber"] = tri;
        //             _keywordObject["TableHeaders"] = tableHeaders;
        //             _keywordObject["ColumnName"] = columnName;
        //             _keywordObject["ElementType"] = "tableCell"
        //             _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
        //             _keywordObject["StepElement"] = rowColumnElement;
        //             _keywordObject["StepElementId"] = generateStepElementId(rowColumnElement);
        //             stepArrays.push(_keywordObject);
        //         }
        //     }
        // }
    }

}
function of_isADFSpacerElement(elem){
    const tag = elem.tagName.toUpperCase();
    const id = elem.id || "";
    const src = elem.src || "";
    const idParts = id.split(":");
    const lastPart = idParts[idParts.length - 1];
    const isSpacerId = lastPart.startsWith("s") && !isNaN(lastPart.slice(1));
    const isSpacerGif = src.endsWith("/t.gif") || src.endsWith("/spacer.gif");

    if (tag === "IMG") {
        const widthOK = elem.width <= 10;
        const heightOK = elem.height <= 10;
        return isSpacerId && isSpacerGif && widthOK && heightOK;
    }

    if (tag === "SPAN" || tag === "DIV") {
        const style = getComputedStyle(elem);
        const width = parseInt(style.width);
        const height = parseInt(style.height);
        const isEmpty = elem.innerText.trim().length === 0;
        const hasSpacerSize = (!isNaN(width) && width <= 10) && (!isNaN(height) && height <= 10);

        return isSpacerId && isEmpty && hasSpacerSize;
    }

    return false;

}
function isPushableTd(td) {
    if (!td) {
        return false;
    }

    var tagName = td.nodeName;
    if (tagName !== "TD") {
        return false;
    }

    var nestedTable = td.querySelector('table');
    var hasNestedTable = nestedTable !== null;

    var disclosureElement = td.querySelector("a[id$='::di']");
    var hasDisclosureIcon = disclosureElement !== null;

    // var decoratorElement = td.querySelector(".x1hn, .x1kv, .x1ks, .af_icon");
    // var hasDecorators = decoratorElement !== null;

    var isVisible = of_IsElementVisible(td, true);

    if (hasNestedTable) {
        return false;
    }

    if (hasDisclosureIcon) {
        return false;
    }

    // if (hasDecorators) {
    //     return false;
    // }

    if (!isVisible) {
        return false;
    }

    return true;
}

function of_isValidColumnElement(columnElement) {
    if(columnElement.nodeName == "INPUT" && columnElement.type=="checkbox"){
        return true
    }
    if (!of_IsElementVisible(columnElement, true)) {
        return false;
    }

    if (of_isADFSpacerElement(columnElement)) {
        return false;
    }

    return true;
}

function of_addKeywordsToTableElement(rowColumnElements, tableHeaders, tableName, tri=0, stepArrays,tableElement){
    let thi=0;
    for (var tdi = 0; tdi < rowColumnElements.length; tdi++) {

        var conditionFound = false;

        var rowColumnElement = rowColumnElements[tdi];

        if (
            rowColumnElement == null ||
            (
                tableHeaders[tdi] === '' &&
                rowColumnElement.innerText.trim() === '' &&
                rowColumnElement.children.length === 0
            )
        ) {
            continue;
        }
    

        var columnName = tableHeaders[thi];
        if(columnName){
            columnName=columnName.trim();
            columnName = columnName.replace(/[^a-zA-Z0-9]/g, "");
        }
        if(columnName === "" || !columnName){
            thi++;
            continue;
        }

        var columnElements = [];
        columnElements.push(...rowColumnElement.getElementsByTagName("INPUT"));
        columnElements.push(...rowColumnElement.getElementsByTagName("IMG"));
        columnElements.push(...rowColumnElement.getElementsByTagName("BUTTON"));
        // columnElements.push(...rowColumnElement.getElementsByTagName("A"));
        columnElements.push(...of_findByXPath(".//div[contains(@data-automation-id, 'date')]", rowColumnElement, true));
        columnElements.push(...of_findByXPath(".//div[contains(@data-automation-id, 'selectedItem')]", rowColumnElement, true));
        columnElements.push(...of_findByXPath(".//div[@role='textbox']", rowColumnElement, true));
        columnElements.push(...of_findByXPath(".//div[@data-automation-id=\"textArea\"]", rowColumnElement, true));
        columnElements.push(...of_findByXPath(".//a[not(contains(@id, 'lovIconId'))]", rowColumnElement, true));
        // debugger
        const emptyStates = of_findByXPath(".//oj-sp-empty-state", rowColumnElement, true);

        if (emptyStates.length != 0) {
            continue
        }
        

        if (columnElements.length == 0) {
            var _keywordObject = new Object();
            _keywordObject["StepId"] = opkey_createUUID();
            _keywordObject["StepSelected"] = true;
            _keywordObject["Keyword"] = "OracleFusion_ClickTableCell";
            _keywordObject["TableName"] = tableName;
            _keywordObject["RowNumber"] = tri;
            _keywordObject["TableHeaders"] = tableHeaders;
            _keywordObject["ColumnName"] = columnName;
            _keywordObject["ElementType"] = "tableCell"
            _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
            _keywordObject["StepElement"] = rowColumnElement;
            _keywordObject["StepElementId"] =  of_generateStepElementId(rowColumnElement);
            stepArrays.push(_keywordObject);
            conditionFound = true;
            thi++;
        }

        for (var cei = 0; cei < columnElements.length; cei++) {
            var columnElement = columnElements[cei];
            // if of_isValidColumnElement is false then continue(skip) else if true continue execution
            if (!of_isValidColumnElement(columnElement)) {
                conditionFound = true;
                continue
            }

            var dataAutomationId = null;
            if (columnElement.getAttribute("data-automation-id") != null) {
                dataAutomationId = columnElement.getAttribute("data-automation-id");
            }

            if (dataAutomationId == null || dataAutomationId == "") {
                if (columnElement.getAttribute("data-uxi-widget-type") != null) {
                    dataAutomationId = columnElement.getAttribute("data-uxi-widget-type");
                }
            }

            if (tableName == null || tableName == "") {
                // debugger
                var finalHeaderXpath = "";
                for (var hi = 1; hi < 7; hi++) {
                    if (finalHeaderXpath != "") {
                        finalHeaderXpath += " | ";
                    }
                    finalHeaderXpath += "preceding::h" + hi + "[not(contains(@data-automation-id, 'accordionHeaderTitle'))]";
                }


                var _headers = of_findByXPath(finalHeaderXpath, columnElement, true);
                if (_headers.length > 0 && _headers[_headers.length - 1].innerText != null && _headers[_headers.length - 1].innerText != "") {

                    // tableName = of_getTableName(_headers)
                    var hiele = _headers.length - 1;
                    tableName = _headers[hiele].innerText;
                    tableName = tableName.trim()
                    while (tableName == "" || tableName == null) {
                        if (of_IsElementVisible(_headers[hiele])) {
                            tableName = _headers[hiele].innerText;
                        }
                        hiele--;
                    }
                }
            }
            of_all_processed_table_elements.push(columnElement)
            if (conditionFound == false && columnElement.nodeName == "IMG") {
                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "OracleFusion_ClickImageInTableCell";
                _keywordObject["TableName"] = tableName;
                _keywordObject["RowNumber"] = tri;
                _keywordObject["TableHeaders"] = tableHeaders;
                _keywordObject["ColumnName"] = columnName;
                _keywordObject["ElementType"] = "tableCell"
                _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
                _keywordObject["StepElement"] = rowColumnElement;
                _keywordObject["StepElementId"] =  of_generateStepElementId(rowColumnElement);
                stepArrays.push(_keywordObject);
                conditionFound = true;
            }

            if (conditionFound == false && columnElement.nodeName == "A") {
                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "OracleFusion_ClickLinkInTableCell";
                _keywordObject["TableName"] = tableName;
                _keywordObject["RowNumber"] = tri;
                _keywordObject["TableHeaders"] = tableHeaders;
                _keywordObject["ColumnName"] = columnName;
                _keywordObject["ElementType"] = "tableCell"
                _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
                _keywordObject["StepElement"] = rowColumnElement;
                _keywordObject["StepElementId"] =  of_generateStepElementId(rowColumnElement);
                stepArrays.push(_keywordObject);
                conditionFound = true;
            }

            if (conditionFound == false && columnElement.nodeName == "BUTTON" && (!of_isDropdown(columnElement))) {
                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "OracleFusion_ClickTableCell";
                _keywordObject["TableName"] = tableName;
                _keywordObject["RowNumber"] = tri;
                _keywordObject["TableHeaders"] = tableHeaders;
                _keywordObject["ColumnName"] = columnName;
                _keywordObject["ElementType"] = "tableCell"
                _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
                _keywordObject["StepElement"] = rowColumnElement;
                _keywordObject["StepElementId"] =  of_generateStepElementId(rowColumnElement);
                stepArrays.push(_keywordObject);
                conditionFound = true;
            }
            if (conditionFound == false && columnElement.nodeName == "DIV" && dataAutomationId != null && dataAutomationId.indexOf("date") > -1) {

                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "OracleFusion_SelectDateInTableCell";
                _keywordObject["TableName"] = tableName;
                _keywordObject["RowNumber"] = tri;
                _keywordObject["TableHeaders"] = tableHeaders;
                _keywordObject["ColumnName"] = columnName;
                _keywordObject["ElementType"] = "tableCell"
                _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
                _keywordObject["StepElement"] = rowColumnElement;
                _keywordObject["StepElementId"] =  of_generateStepElementId(rowColumnElement);
                _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
                stepArrays.push(_keywordObject);
                conditionFound = true;
            }

            if (conditionFound == false && columnElement.nodeName == "DIV" && dataAutomationId != null && dataAutomationId.indexOf("selectedItem") > -1) {

                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "OracleFusion_SearchAndSelectLOVInTableCell";
                _keywordObject["TableName"] = tableName;
                _keywordObject["RowNumber"] = tri;
                _keywordObject["TableHeaders"] = tableHeaders;
                _keywordObject["ColumnName"] = columnName;
                _keywordObject["ElementType"] = "tableCell"
                _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
                _keywordObject["StepElement"] = rowColumnElement;
                _keywordObject["StepElementId"] =  of_generateStepElementId(rowColumnElement);
                _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
                stepArrays.push(_keywordObject);
                conditionFound = true;
            }

            if (conditionFound == false && columnElement.nodeName == "DIV" && dataAutomationId != null && dataAutomationId.indexOf("textArea") > -1) {

                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "OracleFusion_TypeTextInTableCell";
                _keywordObject["TableName"] = tableName;
                _keywordObject["RowNumber"] = tri;
                _keywordObject["TableHeaders"] = tableHeaders;
                _keywordObject["ColumnName"] = columnName;
                _keywordObject["ElementType"] = "tableCell"
                _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
                _keywordObject["StepElement"] = rowColumnElement;
                _keywordObject["StepElementId"] =  of_generateStepElementId(rowColumnElement);
                _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
                stepArrays.push(_keywordObject);
                conditionFound = true;
            }

            if (conditionFound == false && columnElement.nodeName == "INPUT") {

                if (columnElement.type != null) {
                    if (columnElement.type == "checkbox") {
                        var _keywordObject = new Object();
                        _keywordObject["StepId"] = opkey_createUUID();
                        _keywordObject["StepSelected"] = true;
                        _keywordObject["Keyword"] = "OracleFusion_SelectCheckBoxInTableCell";
                        _keywordObject["TableName"] = tableName;
                        _keywordObject["RowNumber"] = tri;
                        _keywordObject["TableHeaders"] = tableHeaders;
                        _keywordObject["ColumnName"] = columnName;
                        _keywordObject["ElementType"] = "tableCell"
                        _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject,columnElement);
                        _keywordObject["StepElement"] = rowColumnElement;
                        _keywordObject["StepElementId"] =  of_generateStepElementId(rowColumnElement);
                        _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
                        stepArrays.push(_keywordObject);
                        conditionFound = true;
                    }
                    else if (columnElement.type == "radio") {
                        var _keywordObject = new Object();
                        _keywordObject["StepId"] = opkey_createUUID();
                        _keywordObject["StepSelected"] = true;
                        _keywordObject["Keyword"] = "OracleFusion_SelectRadioButtonInTableCell";
                        _keywordObject["TableName"] = tableName;
                        _keywordObject["RowNumber"] = tri;
                        _keywordObject["TableHeaders"] = tableHeaders;
                        _keywordObject["ColumnName"] = columnName;
                        _keywordObject["ElementType"] = "tableCell"
                        _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
                        _keywordObject["StepElement"] = rowColumnElement;
                        _keywordObject["StepElementId"] =  of_generateStepElementId(rowColumnElement);
                        stepArrays.push(_keywordObject);
                        conditionFound = true;
                    }

                    else if (columnElement.type == "text" || columnElement.type == "password" || columnElement.type == "search") {

                        if (dataAutomationId != null && dataAutomationId.indexOf("date") > -1) {
                            var _keywordObject = new Object();
                            _keywordObject["StepId"] = opkey_createUUID();
                            _keywordObject["StepSelected"] = true;
                            _keywordObject["Keyword"] = "OracleFusion_SelectDateInTableCell";
                            _keywordObject["TableName"] = tableName;
                            _keywordObject["RowNumber"] = tri;
                            _keywordObject["TableHeaders"] = tableHeaders;
                            _keywordObject["ColumnName"] = columnName;
                            _keywordObject["ElementType"] = "tableCell"
                            _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
                            _keywordObject["StepElement"] = rowColumnElement;
                            _keywordObject["StepElementId"] =  of_generateStepElementId(rowColumnElement);
                            _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
                            stepArrays.push(_keywordObject);
                            conditionFound = true;
                        }
                        else if (dataAutomationId != null && (dataAutomationId.indexOf("searchBox") > -1 || dataAutomationId.indexOf("selectinput") > -1)) {
                            var _keywordObject = new Object();
                            _keywordObject["StepId"] = opkey_createUUID();
                            _keywordObject["StepSelected"] = true;
                            _keywordObject["Keyword"] = "OracleFusion_SearchAndSelectLOVInTableCell";
                            _keywordObject["TableName"] = tableName;
                            _keywordObject["RowNumber"] = tri;
                            _keywordObject["TableHeaders"] = tableHeaders;
                            _keywordObject["ColumnName"] = columnName;
                            _keywordObject["ElementType"] = "tableCell"
                            _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
                            _keywordObject["StepElement"] = rowColumnElement;
                            _keywordObject["StepElementId"] =  of_generateStepElementId(rowColumnElement);
                            _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
                            stepArrays.push(_keywordObject);
                            conditionFound = true;
                        }
                        else if (of_isDropdown(columnElement)){
                            var _keywordObject = new Object();
                            _keywordObject["StepId"] = opkey_createUUID();
                            _keywordObject["StepSelected"] = true;
                            _keywordObject["Keyword"] = "OracleFusion_SelectDropDownInTableCell";
                            _keywordObject["TableName"] = tableName;
                            _keywordObject["RowNumber"] = tri;
                            _keywordObject["TableHeaders"] = tableHeaders;
                            _keywordObject["ColumnName"] = columnName;
                            _keywordObject["ElementType"] = "tableCell"
                            _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject,columnElement);
                            _keywordObject["StepElement"] = rowColumnElement;
                            _keywordObject["StepElementId"] =  of_generateStepElementId(rowColumnElement);
                            _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
                            stepArrays.push(_keywordObject);
                            conditionFound = true;
                        }
                    }
                }
            }
            thi++;
        }

        if (conditionFound == false) {

            if (dataAutomationId != null && dataAutomationId.indexOf("date") > -1) {
                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "OracleFusion_SelectDateInTableCell";
                _keywordObject["TableName"] = tableName;
                _keywordObject["RowNumber"] = tri;
                _keywordObject["TableHeaders"] = tableHeaders;
                _keywordObject["ColumnName"] = columnName;
                _keywordObject["ElementType"] = "tableCell"
                _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
                _keywordObject["StepElement"] = rowColumnElement;
                _keywordObject["StepElementId"] =  of_generateStepElementId(rowColumnElement);
                _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
                stepArrays.push(_keywordObject);
                conditionFound = true;
            }

            else if ((columnElement.getAttribute("role") != null && columnElement.getAttribute("role") == "textbox") || (columnElement.type != null && columnElement.type == "text")) {
                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "OracleFusion_TypeTextInTableCell";
                _keywordObject["TableName"] = tableName;
                _keywordObject["RowNumber"] = tri;
                _keywordObject["TableHeaders"] = tableHeaders;
                _keywordObject["ColumnName"] = columnName;
                _keywordObject["ElementType"] = "tableCell"
                _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
                _keywordObject["StepElement"] = rowColumnElement;
                _keywordObject["StepElementId"] =  of_generateStepElementId(rowColumnElement);
                _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
                stepArrays.push(_keywordObject);
                conditionFound = true;
            }
            else {
                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "OracleFusion_ClickTableCell";
                _keywordObject["TableName"] = tableName;
                _keywordObject["RowNumber"] = tri;
                _keywordObject["TableHeaders"] = tableHeaders;
                _keywordObject["ColumnName"] = columnName;
                _keywordObject["ElementType"] = "tableCell"
                _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
                _keywordObject["StepElement"] = rowColumnElement;
                _keywordObject["StepElementId"] =  of_generateStepElementId(rowColumnElement);
                stepArrays.push(_keywordObject);
            }
            thi++;
        }
    }
}
function of_addElementTypeForTableElementWithDiv(tableElement, stepArrays) {
    
    // console.log(tableElement) 
    var tableName = "";

// this attribute '_leafcolclientids' contains all the id that contains the header of the table
    var colArraysStr = tableElement.getAttribute("_leafcolclientids");
    var tableElementID = tableElement.getAttribute("id")
    var tableDataID;
    if(tableElementID){
    tableDataID = tableElementID+"::db"

    }
    

    if (colArraysStr == null || colArraysStr == "") {
        return;
    }

    colArraysStr = colArraysStr.replace(/'/g, '"');
    var colArrayObject = JSON.parse(colArraysStr);

    var allThElements = [];
    var tableHeaders = [];

    for (var cai = 0; cai < colArrayObject.length; cai++) {
        var thId = colArrayObject[cai];
        if (thId != null) {
            var thElement = document.getElementById(thId);
            if(thElement){
                allThElements.push(thElement);
                tableHeaders.push(thElement.innerText);
            }
        }
    }
    

    var firstInnerTableTR;
    var rowElements = [];
    if (tableDataID) {
        var tableDataElement = document.getElementById(tableDataID)
        var innerTable = tableDataElement.querySelector("TABLE")
        if (innerTable) {
            var innerTableBody = innerTable.querySelector("TBODY")
            if (innerTableBody) {
                // firstInnerTableTR = innerTableBody.querySelector("TR")

                rowElements.push(...innerTableBody.getElementsByTagName("TR"));

                if (rowElements.length == 0) {
                    return;
                }
                var thi=0;
                for (var tri = 0; tri < 1; tri++) {
                    var trElem = rowElements[tri];

                    var rowColumnElements = [];
                    const tdList = trElem.querySelectorAll('table > tbody > tr:first-of-type > td');

                     tdList.forEach(td => {
                        if (isPushableTd(td)) {
                            rowColumnElements.push(td);
                            thi++;
                        }
                    });
                    


                    of_addKeywordsToTableElement(rowColumnElements, tableHeaders, tableName, tri, stepArrays,tableElement)
                }
            }
        }
        
    }
    
    // console.log("Inner Table::",firstInnerTableTR);
    // if(!firstInnerTableTR){
    //     return;
    // }
    // Implementing correct keywords 

    // for (var thia = 0; thia < tableHeaders.length; thia++) {
    //     var columnName = tableHeaders[thia];
    //     var _keywordObject = new Object();
    //     _keywordObject["StepId"] = opkey_createUUID();
    //     _keywordObject["StepSelected"] = true;
    //     _keywordObject["Keyword"] = "OracleFusion_ClickTableCell";
    //     _keywordObject["TableName"] = "";
    //     _keywordObject["RowNumber"] = 0;
    //     _keywordObject["TableHeaders"] = tableHeaders;
    //     _keywordObject["ColumnName"] = columnName;
    //     _keywordObject["ElementType"] = "tableCell"
    //     _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
    //     _keywordObject["StepElement"] = tableElement;
    //     stepArrays.push(_keywordObject);
    // }
    

    



}

function of_checkForPopsXpath(mainElement) {
    allpopsXpath.push(...of_findByXPath("//div[contains(@id, '::popup-container')]", mainElement, true));
    allpopsXpath.push(...of_findByXPath("//div[contains(@class, 'TLpanelform')]", mainElement, true));
    if(allpopsXpath.length>0)
    {
    allpopsXpath.push(...of_findByXPath("//div[contains(@class, 'x2jl xn1 x1a') and @align='center']", mainElement, true));
    }

    return allpopsXpath;
}
function of_ignoreElement(_element) {
    if (_element.nodeName == "IMG" && _element.parentNode != null && _element.parentNode.nodeName == "A") {
        if (_element.parentNode.classList != null && _element.classList.length > 0 && JSON.stringify(_element.parentNode.classList).indexOf("AFIconOnly") > -1) {
            return true;
        }
    }
    return false;
}
function of_CheckLabelText(rawElement, _labelText) {

    if (rawElement.getAttribute("accesskey") != null && rawElement.getAttribute("accesskey") != '') {
        // debugger;
        var accessKey = rawElement.getAttribute("accesskey");
        // Create a dynamic regular expression to remove the access key and any following space
        if (accessKey && rawElement.nodeName !== "A" && rawElement.nodeName !== "BUTTON" ) {
            const regex = new RegExp(`^${accessKey}\\s*`, 'i');
            // Remove the access key from the text content
            _labelText = _labelText.replace(regex, '');
            return _labelText;
        }

    }
    if ((_labelText != null && _labelText.includes("mm/dd/yy"))||(_labelText != null && _labelText.includes("m/d/yy")) ) {
        if (rawElement.getAttribute("aria-label") != null) {
            var ChecklableText_forDate1 = rawElement.getAttribute("aria-label");
            var ChecklableText_forDate2 = rawElement.innerText;

            if (ChecklableText_forDate1 != null && !ChecklableText_forDate1.includes("mm/dd/yy")) {
                _labelText = ChecklableText_forDate1;
                return _labelText;
            } else if (ChecklableText_forDate2 != null && !ChecklableText_forDate2.includes("mm/dd/yy")) {
                _labelText = ChecklableText_forDate2;
                return _labelText;
            } else {
                if (rawElement.parentElement != null && rawElement.parentElement.nodeName === "TD") {
                    var _newLabelText = of_getLabelText(rawElement.parentElement);
                    if (_newLabelText != null && _newLabelText !== "") {
                        return _newLabelText;
                    }
                }
            }
        }
    }

    return _labelText;
}
function of_filterDisabledAndReadOnlyElements(element){
    if (element) {

        var isReadableOnly = element.hasAttribute("readonly")
        var isDisabled = element.hasAttribute("disabled")
        if (isReadableOnly || isDisabled) {
            return true;
        }
    }

    return false;
}
function of_isElementTypeDate(rawElement){
    var inputId = rawElement.getAttribute("id");
    var placeholder = rawElement?.getAttribute("placeholder")
    if (!inputId) {
        return false;
    }
    var baseId  = inputId.split("|")[0];
    var ojElement = document.getElementById(baseId)
    if(ojElement.nodeName =="OJ-INPUT-DATE"){
        return true
    }
    if (rawElement.nodeName == "INPUT") {
        if (rawElement?.getAttribute("placeholder") == "m/d/yy" || rawElement?.getAttribute("placeholder") == "mm/dd/yyyy" || rawElement?.getAttribute("aria-label")?.toLowerCase().includes("date")) {
            return true;
        }
    }
    else {
        return false
    }
    
}

function of_isDropdown(rawElement) {
    
    if (!rawElement) {
        return false;
    };
    let placeholder = rawElement?.getAttribute("placeholder")
    let ariaLabel = rawElement?.getAttribute("aria-label")
    if(ariaLabel){
        ariaLabel = ariaLabel.replace(/[^a-zA-Z0-9]+$/g, "")
    }
    if(ariaLabel === "Search" && placeholder === "Search"){
        return false;
    }
    let id = "";
    let ariaOwns = "";
    let ariaControls = "";
    let role = "";

    if (rawElement.getAttribute("id") !== null) {
        id = rawElement.getAttribute("id");
    }

    if (rawElement.getAttribute("aria-owns") !== null) {
        ariaOwns = rawElement.getAttribute("aria-owns");
    }

    if (rawElement.getAttribute("aria-controls") !== null) {
        ariaControls = rawElement.getAttribute("aria-controls");
    }

    if (rawElement.getAttribute("role") !== null) {
        role = rawElement.getAttribute("role");
    }

    if (of_isElementTypeDate(rawElement)) {
        return false;
    };


    let hasDropdownIcon = false;
    const wrapper = rawElement.closest("span, div");
    if (wrapper) {
        var dropDownIcon = wrapper.querySelector("a[id$='::drop'], span[role='button'], svg");
        if (dropDownIcon) {
            hasDropdownIcon = true;
        }
    }

    const classList = rawElement.classList;
    let isADFComboBox = false;
    let isJETComboBox = false;

    if (role === "combobox" || rawElement.getAttribute("aria-autocomplete") === "list") {
        if (
            id.startsWith("oj-searchselect") ||
            classList.contains("oj-searchselect-input") ||
            classList.contains("oj-combobox-input") ||
            classList.contains("oj-inputtext-input") ||
            id.includes("|input") ||
            ariaControls.startsWith("lovDropdown_")
        ) {
            isJETComboBox = true;
        }
    }


    if (
        role === "combobox" ||
        rawElement.getAttribute("aria-autocomplete") === "list"
    ) {
        if (
            id.endsWith("::content") ||
            ariaOwns.includes("::_afrautosuggestpopup") ||
            ariaOwns.includes("::pop") ||
            hasDropdownIcon
        ) {
            isADFComboBox = true;
        }
    }

    return isADFComboBox || isJETComboBox;
}





function of_addElementTypeForClickableElement(rawElement, stepArrays) {
    if (of_ignoreElement(rawElement)) {
        return;
    }

    var _lableText = of_getLabelText(rawElement);
    if (!Number.isInteger(_lableText)) {
        _lableText = of_CheckLabelText(rawElement, _lableText);
    }
    if (_lableText == null) {
        _lableText = "";
    }
    if (_lableText != null) {
        if (of_all_processed_elements.indexOf(rawElement) > -1) {
            return;
        }
        if (of_all_processed_table_elements.indexOf(rawElement) > -1) {
            return;
        }

    }
    if (_lableText == "") {
        if (rawElement.getAttribute("id") != null) {
            if (of_all_processed_elements.indexOf(rawElement) > -1) {
                return;
            }

            of_all_processed_elements.push(rawElement);

            // var elementId = rawElement.getAttribute("id");
            // var labelXpath = "//label[@for='" + elementId + "']";

            // var elements = of_findByXPath(labelXpath, document, true);
            // if (elements != null && elements.length > 0) {
            //     _lableText = elements[0].innerText;
            // }
            _lableText = of_getTextFromLabel(rawElement)
        }
    }
    if(_lableText !=null){
        of_all_processed_elements.push(rawElement);
    }
    
    if (_lableText == "") {
        return;
    }
    var liRole;
    if(rawElement.nodeName=="LI"){
        const anchor = of_findByXPath("a", rawElement, false);
        if (anchor) {
            liRole = anchor.getAttribute("role")
        }
    }
    // if(of_filterDisabledAndReadOnlyElements(rawElement)){
    //     return;
    // }

    if ((rawElement.nodeName == "INPUT" && rawElement.type != null && (rawElement.type == "text" || rawElement.type == "password" || rawElement.type == "search")) &&!of_isDropdown(rawElement)) {      
        var _keywordObject = new Object();
        _keywordObject["StepId"] = opkey_createUUID();
        _keywordObject["StepSelected"] = true;
        _keywordObject["Keyword"] = "OracleFusion_TypeByText";
        _keywordObject["LabelName"] = _lableText;
        _keywordObject["ElementType"] = "editor"
        _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject,rawElement);
        _keywordObject["StepElement"] = rawElement;
        _keywordObject["StepElementId"] =  of_generateStepElementId(rawElement);
        _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
        stepArrays.push(_keywordObject);
    }

    else if (rawElement.nodeName == "LI") {
        if ((rawElement.getAttribute("role") != null && rawElement.getAttribute("role") == "tab")|| (rawElement.getAttribute("role") != null && liRole == "tab")) {
            var _keywordObject = new Object();
            _keywordObject["StepId"] = opkey_createUUID();
            _keywordObject["StepSelected"] = true;
            _keywordObject["Keyword"] = "OracleFusion_ClickByText";
            _keywordObject["LabelName"] = _lableText;
            _keywordObject["ElementType"] = "tabItem"
            _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
            _keywordObject["StepElement"] = rawElement;
            _keywordObject["StepElementId"] =  of_generateStepElementId(rawElement);
            stepArrays.push(_keywordObject);
        }
    }
    else if (rawElement.nodeName == "SELECT") {
        var _keywordObject = new Object();
        _keywordObject["StepId"] = opkey_createUUID();
        _keywordObject["StepSelected"] = true;
        _keywordObject["Keyword"] = "OracleFusion_SelectDropDownByText";
        //labelName Check
        if (ReserveLabel != null) {
            var _lableText_new = of_getLabelText(ReserveLabel);
            if (_lableText_new != null && !(_lableText == _lableText_new)) {
                //console.log(_lableText_new);
                _lableText = _lableText_new;
            }
        }
        _keywordObject["LabelName"] = _lableText;
        _keywordObject["ElementType"] = "combobox";
        _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject,rawElement);
        _keywordObject["StepElement"] = rawElement;
        _keywordObject["StepElementId"] =  of_generateStepElementId(rawElement);
        _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
        stepArrays.push(_keywordObject);

    }
    else if ((rawElement.nodeName == "DIV" && rawElement.role=="menuitem") || (of_isDropdown(rawElement))){
        var _keywordObject = new Object();
        _keywordObject["StepId"] = opkey_createUUID();
        _keywordObject["StepSelected"] = true;
        _keywordObject["Keyword"] = "OracleFusion_SelectDropDownByText";
        _keywordObject["LabelName"] = _lableText;
        _keywordObject["ElementType"] = "combobox";
        _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject,rawElement);
        _keywordObject["StepElement"] = rawElement;
        _keywordObject["StepElementId"] =  of_generateStepElementId(rawElement);
        _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
        stepArrays.push(_keywordObject);
    }
    else if (rawElement.nodeName == "OJ-ACTION-CARD" ) {
        var _keywordObject = new Object();
        _keywordObject["StepId"] = opkey_createUUID();
        _keywordObject["StepSelected"] = true;
        _keywordObject["Keyword"] = "Custom_OracleFusion_SelectToggleByText ";
        _keywordObject["LabelName"] = _lableText;
        _keywordObject["ElementType"] = "editor"
        _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject,rawElement);
        _keywordObject["StepElement"] = rawElement;
        _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
        stepArrays.push(_keywordObject);
    }
    else {
        var _keywordObject = new Object();
        _keywordObject["StepId"] = opkey_createUUID();
        _keywordObject["StepSelected"] = true;
        _keywordObject["Keyword"] = "OracleFusion_ClickByText";
        _keywordObject["LabelName"] = _lableText;
        _keywordObject["ElementType"] = "button"
        _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
        if (rawElement.getAttribute("id") != null && rawElement.getAttribute("id").includes(":dismiss")) {
            return;
        }
        if (_lableText.length > 2000) {
            // console.log("Done raw Element :" + rawElement);
            return;
        }
        _keywordObject["StepElement"] = rawElement;
        _keywordObject["StepElementId"] =  of_generateStepElementId(rawElement);

        stepArrays.push(_keywordObject);
    }
}

function of_isElementIsBefore(el1, el2) {
    return (el1.compareDocumentPosition(el2) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}

function of_isElementIsAfter(el1, el2) {
    return (el1.compareDocumentPosition(el2) & Node.DOCUMENT_POSITION_PRECEDING) !== 0;
}

function of_addElementTypeForLabelElement(rawElement, stepArrays) {
    var forProperty = rawElement.getAttribute("for");

    var _labelText = of_getLabelText(rawElement);

    if (_labelText == null) {
        _labelText = "";
    }

    if (_labelText == "") {
        return;
    }
    if (forProperty != null) {
        var labelAttachedElement = document.getElementById(forProperty);
        if(of_filterDisabledAndReadOnlyElements(labelAttachedElement)){
            return;
        }

        if (labelAttachedElement == null) {
            return;
        }
        if (of_all_processed_table_elements.indexOf(rawElement) > -1) {
            return;
        }

        if (of_all_processed_elements.indexOf(labelAttachedElement) > -1) {
            return;
        }

        of_all_processed_elements.push(labelAttachedElement);

        var dataAutomationId = "";
        if (labelAttachedElement != null) {
            if ((labelAttachedElement.getAttribute("placeholder") == "Search") || (labelAttachedElement.getAttribute("placeholder") == "Search for people and actions"))
                return;
        }
        var elementRole = labelAttachedElement.getAttribute("role");
        if (elementRole == null) {
            elementRole = labelAttachedElement.getAttribute("data-uxi-widget-type");
        }

        if (elementRole == null) {
            elementRole = labelAttachedElement.getAttribute("type");
        }
        if (elementRole == null) {
            elementRole = labelAttachedElement.getAttribute("data-automation-id");
        }

        if (labelAttachedElement.getAttribute("data-automation-id") != null) {
            dataAutomationId = labelAttachedElement.getAttribute("data-automation-id");
        }
        if (elementRole == null) {
            if (of_isElementTypeDate(labelAttachedElement)) {
                elementRole = "text"
            }
        }
        if (elementRole != null) {

            if (elementRole == "text" || elementRole == "textbox" || elementRole === "password") {
                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "OracleFusion_TypeByText";
                _keywordObject["LabelName"] = _labelText;
                _keywordObject["ElementType"] = "text"
                _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject,rawElement);
                _keywordObject["StepElement"] = rawElement;
                _keywordObject["StepElementId"] =  of_generateStepElementId(labelAttachedElement);
                _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);

                stepArrays.push(_keywordObject);
            }
            else if (elementRole == "radio") {
                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "OracleFusion_SelectRadioButtonByText";
                _keywordObject["LabelName"] = _labelText;
                _keywordObject["ElementType"] = "radio"
                _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
                _keywordObject["StepElement"] = rawElement;
                _keywordObject["StepElementId"] =  of_generateStepElementId(labelAttachedElement);
                _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);

                stepArrays.push(_keywordObject);
            }
            else if (elementRole == "checkbox") {
                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "OracleFusion_SelectCheckboxByText";
                _keywordObject["LabelName"] = _labelText;
                _keywordObject["ElementType"] = "checkbox"

                _keywordObject["IsBefore"] = of_isElementIsBefore(labelAttachedElement, rawElement);
                _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject,rawElement);
                _keywordObject["StepElement"] = rawElement;
                _keywordObject["StepElementId"] =  of_generateStepElementId(labelAttachedElement);
                _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);

                stepArrays.push(_keywordObject);
            }
            else if (elementRole == "button" && dataAutomationId != "selectWidget") {
                var _keywordObject = new Object();
                _keywordObject["StepId"] = opkey_createUUID();
                _keywordObject["StepSelected"] = true;
                _keywordObject["Keyword"] = "OracleFusion_ClickByText";
                _keywordObject["LabelName"] = _labelText;
                _keywordObject["ElementType"] = "button"
                _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
                _keywordObject["StepElement"] = rawElement;
                _keywordObject["StepElementId"] =  of_generateStepElementId(labelAttachedElement);
                _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);

                stepArrays.push(_keywordObject);
            }
            else {
                if (dataAutomationId != null && dataAutomationId.indexOf("date") > -1) {
                    var _keywordObject = new Object();
                    _keywordObject["StepId"] = opkey_createUUID();
                    _keywordObject["StepSelected"] = true;
                    _keywordObject["Keyword"] = "OracleFusion_TypeByText";
                    _keywordObject["LabelName"] = _labelText;
                    _keywordObject["ElementType"] = "text"
                    _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject,rawElement);
                    _keywordObject["StepElement"] = rawElement;
                    _keywordObject["StepElementId"] =  of_generateStepElementId(labelAttachedElement);
                    _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
                    stepArrays.push(_keywordObject);
                }
                else if (elementRole != null && elementRole == "combobox") {
                    var _keywordObject = new Object();
                    _keywordObject["StepId"] = opkey_createUUID();
                    _keywordObject["StepSelected"] = true;
                    _keywordObject["Keyword"] = "OracleFusion_SelectDropDownByText";
                    _keywordObject["LabelName"] = _labelText;
                    _keywordObject["ElementType"] = "combobox"
                    _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject,rawElement);
                    _keywordObject["StepElement"] = rawElement;
                    _keywordObject["StepElementId"] =  of_generateStepElementId(labelAttachedElement);
                    _keywordObject["ComponentInputParameterName"] = of_getFLInputParameterName(_keywordObject);
                    stepArrays.push(_keywordObject);
                }
                else {
                    var _keywordObject = new Object();
                    _keywordObject["StepId"] = opkey_createUUID();
                    _keywordObject["StepSelected"] = true;
                    _keywordObject["Keyword"] = "OracleFusion_ClickByText";
                    _keywordObject["LabelName"] = _labelText;
                    _keywordObject["ElementType"] = "otherControl"
                    _keywordObject["DataArguments"] = of_getKeywordDataArgument(_keywordObject);
                    _keywordObject["StepElement"] = rawElement;
                    _keywordObject["StepElementId"] =  of_generateStepElementId(labelAttachedElement);
                    stepArrays.push(_keywordObject);
                }
            }
        }

    }
}

function of_generateStepElementId(_element) {
  let elementId = _element.getAttribute("opkey-autofl-element-id");

  if (elementId != null && elementId !== "") {
    return elementId;
  }

  elementId = opkey_createUUID();
  _element.setAttribute("opkey-autofl-element-id", elementId);

  const xpath = getUniqueXPath(_element);

  all_elements_contains_opkeyID.set(xpath, {
    opkey_autofl_element_id: elementId,
    tag: _element.nodeName.toLowerCase()
  });
  return elementId;
}

function getUniqueXPath(el) {
    if (!el || el.nodeType !== 1) return "";
    const parts = [];
    while (el && el.nodeType === 1 && el !== document.documentElement) {
        let index = 1;
        let sibling = el.previousElementSibling;
        while (sibling) {
            if (sibling.nodeName === el.nodeName) {
                index++;
            }
            sibling = sibling.previousElementSibling;
        }
        const tagName = el.nodeName.toLowerCase();
        const part = `${tagName}${index > 1 ? `[${index}]` : ""}`;
        parts.unshift(part);
        el = el.parentElement;
    }
    return "/" + ["html"].concat(parts).join("/");
}


function opkey_createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function of_getLogicalName(step_data) {
    var logical_name = step_data["LabelName"];

    if (logical_name == null) {
        logical_name = step_data["TableName"];
    }

    if (logical_name == null) {
        logical_name = step_data["ColumnName"];
    }

    return logical_name;
}
function of_getEnteredTableValue(ele){
    var inputValue="";
    if(ele){
        inputValue = ele.value
        if (ele.nodeName == "INPUT") {
            inputValue = ele.value
            if (ele.type == "checkbox") {
                if (inputValue) {
                    inputValue = "ON"
                } else {
                    inputValue = "OFF"
                }
            }
        }
        
        // console.log("Element from table::::",ele,"  \n value is",ele.value);
    }
    return inputValue
}
function of_getEnteredValue(ele){
    // console.log("Raw Element:-",ele);
    
    var inputValue='';
    if(ele){
        if(ele.nodeName=="OJ-ACTION-CARD"){
            var inputInsideParent = of_findByXPath(".//input[@type='checkbox']", ele);
            if (inputInsideParent) {
                inputValue = inputInsideParent.checked;
            }

        }else if(ele.nodeName=="LABEL"){
            // debugger
            // console.log("Element::::", ele, "  \n value is", ele.value);
            var forProperty = ele.getAttribute("for");
            if(forProperty){
                var labelAttachedElement = document.getElementById(forProperty);

                if (labelAttachedElement != null) {
                    if(labelAttachedElement.nodeName="INPUT"){
                        inputValue = labelAttachedElement.value;
                        var isChecked = labelAttachedElement.checked
                        if (labelAttachedElement.type == "checkbox") {
                            if (inputValue == "true" || isChecked) {
                                inputValue = "ON"
                            } else {
                                inputValue = "OFF"
                            }
                        }
                    }
                }
                
            }
        }else if(ele.nodeName == "SELECT"){
            var tempInputValue = ele.value
            if(tempInputValue){

                var xpath = ".//option[@value='" + tempInputValue + "']";
                var selectedOption = of_findByXPath(xpath, ele, true);
                if(selectedOption.length >0){
                    inputValue = selectedOption[0].innerText
                }
            }
        }else if(ele.nodeName=="INPUT"){
            inputValue = ele.value
            if(ele.type == "checkbox"){
                var isChecked = ele.checked
                if (inputValue == "true" || isChecked) {
                    inputValue = "ON"
                } else {
                    inputValue = "OFF"
                }
            }
        }
        // console.log("Element::::", ele, "  \n value is", inputValue);

    }
    return inputValue;
}
function of_getKeywordDataArgument(_keywordObject,rawElement) {

    var _keywordName = _keywordObject["Keyword"];
    var _labelText = _keywordObject["LabelName"];
    if (labelCountMap.has(_labelText)) {
        myIndex=labelCountMap.get(_labelText) + 1;
        labelCountMap.set(_labelText, labelCountMap.get(_labelText) + 1);
    } else {
        myIndex=0;
        labelCountMap.set(_labelText, 0);
    }
    
    if (_labelText == null) {
        _labelText = "";
    }
    var _tableName = _keywordObject["TableName"];
    var _columnName = _keywordObject["ColumnName"];

    var _rowNumber = _keywordObject["RowNumber"];
    if (_rowNumber == null) {
        _rowNumber = 0;
    }

    if (_keywordName == "Custom_OracleFusion_SelectToggleByText ") {

        /*

        TextToSearch
Index
PartialText
Before
After

*/
        var retObject = new Object();

        retObject["1. TextToSearch"] = _labelText;

        retObject["2. Status"] = of_getEnteredValue(rawElement);
        retObject["3. Index"] = myIndex;
        myIndex = 0;
        retObject["4. PartialText"] = false;

        retObject["5. Before"] = "";



        var dynamicOrObject = new Object();

        dynamicOrObject["TextToSearch"] = _labelText;

        dynamicOrObject["Status"] = of_getEnteredValue(rawElement);
        dynamicOrObject["Index"] = 0;

        dynamicOrObject["PartialText"] = false;

        dynamicOrObject["Before"] = "";


        dynamicOrObject["logicalName"] = of_getLogicalName(_keywordObject);

        _keywordObject["DynamicOrObject"] = dynamicOrObject;

        return retObject;
    }

    if (_keywordName == "OracleFusion_SelectDropDownByText") {

        /*

        DropdownLabel
Index
PartialText
ValueToSelect
Before
IsMultipleDropdown

*/

        var retObject = new Object();
        retObject["1. DropdownLabel"] = _labelText;
        retObject["2. Index"] = 0;
        retObject["3. PartialText"] = false;
        retObject["4. ValueToSelect"] = of_getEnteredValue(rawElement);
        retObject["5. Before"] = "";
        retObject["6. IsMultipleDropdown"] = false;

        var dynamicOrObject = new Object();
        dynamicOrObject["DropdownLabel"] = _labelText;
        dynamicOrObject["Index"] = 0;
        dynamicOrObject["PartialText"] = false;
        dynamicOrObject["ValueToSelect"] = of_getEnteredValue(rawElement);
        dynamicOrObject["Before"] = "";
        dynamicOrObject["IsMultipleDropdown"] = false;
        dynamicOrObject["logicalName"] = of_getLogicalName(_keywordObject);
        _keywordObject["InputParameterDefaultValue"] = of_getEnteredValue(rawElement);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;
        return retObject;
    }

    if (_keywordName == "OracleFusion_ClickByText") {

        /*

        TextToSearch
Index
PartialText
Before
After

*/
        var retObject = new Object();

        retObject["1. TextToSearch"] = _labelText;

        retObject["2. Index"] = myIndex;
        myIndex=0;
        retObject["3. PartialText"] = false;

        retObject["4. Before"] = "";

        retObject["5. After"] = "";


        var dynamicOrObject = new Object();

        dynamicOrObject["TextToSearch"] = _labelText;

        dynamicOrObject["Index"] = 0;

        dynamicOrObject["PartialText"] = false;

        dynamicOrObject["Before"] = "";

        dynamicOrObject["After"] = "";

        dynamicOrObject["logicalName"] = of_getLogicalName(_keywordObject);

        _keywordObject["DynamicOrObject"] = dynamicOrObject;
        return retObject;
    }

    if (_keywordName == "OracleFusion_TypeByText") {

        /*

        TextToSearch
Index
PartialText
TextToType
Before
Object

*/
        var retObject = new Object();

        retObject["1. TextToSearch"] = _labelText;

        retObject["2. Index"] = 0;

        retObject["3. PartialText"] = false;

        retObject["4. TextToType"] = of_getEnteredValue(rawElement);

        retObject["5. Before"] = false;


        var dynamicOrObject = new Object();

        dynamicOrObject["TextToSearch"] = _labelText;

        dynamicOrObject["Index"] = 0;

        dynamicOrObject["PartialText"] = false;

        dynamicOrObject["TextToType"] = "";

        dynamicOrObject["Before"] = false;

        dynamicOrObject["logicalName"] = of_getLogicalName(_keywordObject);
        _keywordObject["InputParameterDefaultValue"]= of_getEnteredValue(rawElement);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;

        return retObject;
    }

    if (_keywordName == "OracleFusion_SelectRadioButtonByText") {

        /*

        TextToSearch
Index
PartialText
Before

*/
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

        dynamicOrObject["logicalName"] = of_getLogicalName(_keywordObject);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;
        return retObject;
    }

    if (_keywordName == "OracleFusion_SelectCheckboxByText") {

        /*

        TextToSearch
Index
PartialText
Before
Status

*/
        var retObject = new Object();

        retObject["1. TextToSearch"] = _labelText;

        retObject["2. Index"] = 0;

        retObject["3. PartialText"] = false;

        retObject["4. Before"] = _keywordObject["IsBefore"];

        retObject["5. Status"] = of_getEnteredValue(rawElement);


        var dynamicOrObject = new Object();


        dynamicOrObject["TextToSearch"] = _labelText;

        dynamicOrObject["Index"] = 0;

        dynamicOrObject["PartialText"] = false;

        dynamicOrObject["Before"] = _keywordObject["IsBefore"];

        dynamicOrObject["Status"] = of_getEnteredValue(rawElement);

        dynamicOrObject["logicalName"] = of_getLogicalName(_keywordObject);
        _keywordObject["InputParameterDefaultValue"] = of_getEnteredValue(rawElement);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;
        return retObject;
    }

    if (_keywordName == "OracleFusion_DeSelectCheckboxByText") {

        /*

        TextToSearch
Index
PartialText
Before

*/
        var retObject = new Object();

        retObject["1. TextToSearch"] = _labelText;

        retObject["2. Index"] = 0;

        retObject["3. PartialText"] = false;

        retObject["4. Before"] = false;

        //  retObject["5. Status"] = "Off";


        var dynamicOrObject = new Object();

        dynamicOrObject["TextToSearch"] = _labelText;

        dynamicOrObject["Index"] = 0;

        dynamicOrObject["PartialText"] = false;

        dynamicOrObject["Before"] = false;

        // dynamicOrObject["Status"] = "Off";

        dynamicOrObject["logicalName"] = of_getLogicalName(_keywordObject);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;
        return retObject;
    }

    if (_keywordName == "OracleFusion_ClickTableCell") {

        /*

        Object
ColumnName
RowNumber
ObjectIndex
Identifier1
Value1
Identifier2
Value2
Identifier3
Value3
Identifier4
Value4
Identifier5
Value5
TableName

*/
        var retObject = new Object();

        retObject["01. ColumnName"] = _columnName;

        retObject["02. RowNumber"] = _rowNumber;

        retObject["03. ObjectIndex"] = 0;

        retObject["04. Identifier1"] = "";

        retObject["05. Value1"] = "";

        retObject["06. Identifier2"] = "";

        retObject["07. Value2"] = "";

        retObject["08. Identifier3"] = "";

        retObject["09. Value3"] = "";

        retObject["10. Identifier4"] = "";

        retObject["11. Value4"] = "";

        retObject["12. Identifier5"] = "";

        retObject["13. Value5"] = "";
        retObject["14. TableName"] = _tableName;



        var dynamicOrObject = new Object();

        dynamicOrObject["logicalName"] = of_getLogicalName(_keywordObject);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;
        return retObject;
    }

    if (_keywordName == "OracleFusion_ClickImageInTableCell") {

        /*
        Object
ColumnName
RowNumber
ObjectIndex
Identifier1
Value1
Identifier2
Value2
Identifier3
Value3
Identifier4
Value4
Identifier5
Value5
TableName

*/
        var retObject = new Object();



        retObject["01. ColumnName"] = _columnName;

        retObject["02. RowNumber"] = _rowNumber;

        retObject["03. ObjectIndex"] = 0;

        retObject["04. Identifier1"] = "";

        retObject["05. Value1"] = "";

        retObject["06. Identifier2"] = "";

        retObject["07. Value2"] = "";

        retObject["08. Identifier3"] = "";

        retObject["09. Value3"] = "";

        retObject["10. Identifier4"] = "";

        retObject["11. Value4"] = "";

        retObject["12. Identifier5"] = "";

        retObject["13. Value5"] = "";
        retObject["15. TableName"] = _tableName;


        var dynamicOrObject = new Object();

        dynamicOrObject["logicalName"] = of_getLogicalName(_keywordObject);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;

        return retObject;
    }

    if (_keywordName == "OracleFusion_ClickLinkInTableCell") {

        /*

        Object
ColumnName
RowNumber
ObjectIndex
Identifier1
Value1
Identifier2
Value2
Identifier3
Value3
Identifier4
Value4
Identifier5
Value5
TableName

*/
        var retObject = new Object();



        retObject["01. ColumnName"] = _columnName;
        
        retObject["02. RowNumber"] = _rowNumber;

        retObject["03. ObjectIndex"] = 0;

        retObject["04. Identifier1"] = "";

        retObject["05. Value1"] = "";

        retObject["06. Identifier2"] = "";

        retObject["07. Value2"] = "";

        retObject["08. Identifier3"] = "";

        retObject["09. Value3"] = "";
        
        retObject["10. Identifier4"] = "";
        
        retObject["11. Value4"] = "";
        
        retObject["12. Identifier5"] = "";
        
        retObject["13. Value5"] = "";
        retObject["14. TableName"] = _tableName;



        var dynamicOrObject = new Object();

        dynamicOrObject["logicalName"] = of_getLogicalName(_keywordObject);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;


        return retObject;
    }

    if (_keywordName == "OracleFusion_SelectCheckBoxInTableCell") {

        /*

        Object
ColumnName
RowNumber
ObjectIndex
Status
Identifier1
Value1
Identifier2
Value2
Identifier3
Value3
Identifier4
Value4
Identifier5
Value5
TableName

*/
        var retObject = new Object();



        retObject["01. ColumnName"] = _columnName;
        
        retObject["02. RowNumber"] = _rowNumber;
        
        retObject["03. ObjectIndex"] = 0;

        retObject["04. Status"] = of_getEnteredTableValue(rawElement);

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
        retObject["15. TableName"] = _tableName;


        var dynamicOrObject = new Object();

        dynamicOrObject["logicalName"] = of_getLogicalName(_keywordObject);
        _keywordObject["InputParameterDefaultValue"] = of_getEnteredTableValue(rawElement);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;


        return retObject;
    }

    if (_keywordName == "OracleFusion_SelectRadioButtonInTableCell") {

        /*

        Object
ColumnName
RowNumber
ObjectIndex
Index
Identifier1
Value1
Identifier2
Value2
Identifier3
Value3
Identifier4
Value4
Identifier5
Value5
TableName

*/
        var retObject = new Object();

        
        retObject["01. ColumnName"] = _columnName;
        
        retObject["02. RowNumber"] = _rowNumber;
        
        retObject["03. ObjectIndex"] = 0;

        retObject["04. Status"] = "On";

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
        retObject["15. TableName"] = _tableName;



        var dynamicOrObject = new Object();

        dynamicOrObject["logicalName"] = of_getLogicalName(_keywordObject);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;


        return retObject;
    }

    if (_keywordName == "OracleFusion_TypeTextInTableCell") {

        /*

        Object
ColumnName
RowNumber
ValueToType
ObjectIndex
Identifier1
Value1
Identifier2
Value2
Identifier3
Value3
Identifier4
Value4
Identifier5
Value5
TableName

*/
        var retObject = new Object();

        
        retObject["01. ColumnName"] = _columnName;
        
        retObject["02. RowNumber"] = _rowNumber;
        
        retObject["03. ValueToType"] = of_getEnteredTableValue(rawElement);

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
        retObject["15. TableName"] = _tableName;
        
        var dynamicOrObject = new Object();

        dynamicOrObject["logicalName"] = of_getLogicalName(_keywordObject);
        _keywordObject["InputParameterDefaultValue"] = of_getEnteredTableValue(rawElement);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;

        return retObject;
    }

    if (_keywordName == "OracleFusion_ClickTextInTableCell") {

        /*
        Object
ColumnName
RowNumber
TextToClick
TextIndex
Identifier1
Value1
Identifier2
Value2
Identifier3
Value3
Identifier4
Value4
Identifier5
Value5
TableName
*/

        var retObject = new Object();
        
        
        retObject["01. ColumnName"] = _columnName;
        
        retObject["02. RowNumber"] = _rowNumber;
        
        retObject["03. TextToClick"] = _labelText;

        retObject["04. TextIndex"] = "";

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
        retObject["15. TableName"] = _tableName;

        var dynamicOrObject = new Object();

        dynamicOrObject["logicalName"] = of_getLogicalName(_keywordObject);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;

        return retObject;
    }

    if (_keywordName == "OracleFusion_DeSelectCheckBoxInTableCell") {

        /*

        Object
ColumnName
RowNumber
ObjectIndex
Identifier1
Value1
Identifier2
Value2
Identifier3
Value3
Identifier4
Value4
Identifier5
Value5
TableName

*/
        var retObject = new Object();

        
        retObject["01. ColumnName"] = _columnName;
        
        retObject["02. RowNumber"] = _rowNumber;
        
        retObject["03. ObjectIndex"] = 0;

        retObject["04. Status"] = "On";


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
        retObject["15. TableName"] = _tableName;


        var dynamicOrObject = new Object();

        dynamicOrObject["logicalName"] = of_getLogicalName(_keywordObject);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;

        return retObject;
    }

    if (_keywordName == "OracleFusion_SelectDropDownInTableCell") {

        /*

        Object
ColumnName
RowNumber
ValueToSelect
ObjectIndex
Identifier1
Value1
Identifier2
Value2
Identifier3
Value3
Identifier4
Value4
Identifier5
Value5
TableName

*/
        var retObject = new Object();
        
        
        retObject["01. ColumnName"] = _columnName;
        
        retObject["02. RowNumber"] = _rowNumber;
        
        retObject["03.  ValueToSelect"] = of_getEnteredTableValue(rawElement);
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
        retObject["15. TableName"] = _tableName;

        var dynamicOrObject = new Object();

        dynamicOrObject["logicalName"] = of_getLogicalName(_keywordObject);
        _keywordObject["InputParameterDefaultValue"] = of_getEnteredTableValue(rawElement);
        _keywordObject["DynamicOrObject"] = dynamicOrObject;

        return retObject;
    }
    return {};
}
function of_getTextFromLabel(rawElement){
    var _lableText="";
    var elementId = rawElement.getAttribute("id");
    var labelXpath = "//label[@for='" + elementId + "']";
    var elements = of_findByXPath(labelXpath, document, true);
    if (elements != null && elements.length > 0) {
        _lableText = elements[0].innerText;
    }
    return _lableText;
}
function of_getLabelText(rawElement) {
    var _lableText = "";
    
    if (_lableText == "" || _lableText == "\t") {
        if (rawElement.nodeName == "INPUT" ) {
            if (rawElement.getAttribute("placeholder") == "m/d/yy" ||rawElement.getAttribute("placeholder") == "mm/dd/yyyy" || rawElement.getAttribute("placeholder")?.toLowerCase().includes("date")){
                _lableText = of_getTextFromLabel(rawElement);
            }
        }
    }
    if (_lableText == "" || _lableText == "\t") {
        if (rawElement.nodeName == "INPUT" && rawElement.role == "combobox" ) {
            _lableText = "";
            return _lableText;
        }
    }
    // For OJ-ACTION-CARD
    if (_lableText == "" || _lableText == "\t") {
        if (rawElement.nodeName == "OJ-ACTION-CARD" ) {
            _lableText = rawElement.innerText;
            if(_lableText){

                _lableText = _lableText.split(/[\n\t]/)[0]
            }
            return _lableText;
        }
    }


    _lableText = of_getTextFromLabel(rawElement);
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
        // _lableText = _lableText.replace(/\n[\s\S]*/, '');
    }
    //innerText Replace
    if(_lableText =="Show more quick actions")
    {
        _lableText = rawElement.innerText;
    }
    if (_lableText != null) {
        try {
            _lableText = _lableText.trim();
        } catch (e) { }
    }

    if (_lableText != null && _lableText != "") {
        return _lableText;
    }
    return "";
}

function of_getHeaderObject(_headerName, _headerObjectList) {
    for (var hli = 0; hli < _headerObjectList.length; hli++) {
        if (_headerObjectList[hli]["HeaderName"] == _headerName) {
            return _headerObjectList[hli];
        }
    }
    return null;
}

function of_computeHeaderGroup(_elementArray) {
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


        var _headers = of_findByXPath(finalHeaderXpath, _elementObject, true);
        _headers = of_utils_filterVisibleElements(_headers);
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
        var addedHeader = of_getHeaderObject(_headerText, outArray);

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

function of_getAllHeaders() {
    var outArray = [];

    var popupOverLayFound = false;

    for (var pxpi = 0; pxpi < of_popuXpathArrays.length; pxpi++) {
        var xpathElements = of_findByXPath(of_popuXpathArrays[pxpi], document, true);

        var xpathElementsArray = [];
        xpathElementsArray.push(...xpathElements);

        xpathElementsArray = of_utils_filterVisibleElements(xpathElementsArray, true);
        for (var pxpei = 0; pxpei < xpathElementsArray.length; pxpei++) {
            var tempArray = [];

            tempArray.push(...of_findByXPath("//h1[not(contains(@data-automation-id, 'accordionHeaderTitle'))]", xpathElementsArray[pxpei], true));

            tempArray.push(...of_findByXPath("//h2[not(contains(@data-automation-id, 'accordionHeaderTitle'))]", xpathElementsArray[pxpei], true));

            tempArray.push(...of_findByXPath("//h3[not(contains(@data-automation-id, 'accordionHeaderTitle'))]", xpathElementsArray[pxpei], true));

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
        for (var xpi = 0; xpi < of_xpathArrays.length; xpi++) {
            var xpathElements = of_findByXPath(of_xpathArrays[xpi], document, true);

            var xpathElementsArray = [];
            xpathElementsArray.push(...xpathElements);

            xpathElementsArray = of_utils_filterVisibleElements(xpathElementsArray, true);
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

function of_getAllLabels(mainElement) {
    var outArray = [];
    outArray.push(...mainElement.getElementsByTagName("LABEL"));
    return outArray;
}

function of_getAllTabels(mainElement) {
    var outArray = [];
    var alltables = mainElement.getElementsByTagName("TABLE");
    for (_table of alltables) {
        if (of_istablevalid(_table)) {
            var tableOfTh = of_getTableFromTh(_table);
            if (tableOfTh == null) {
                continue;
            }
            if (outArray.indexOf(tableOfTh) == -1) {
                outArray.push(tableOfTh);
            }
        }
    }
    outArray.push(...of_findByXPath("//div[@_leafColClientIds]", mainElement, true));
    return outArray;
}
function of_istablevalid(_table) {
    var _headres = _table.getElementsByTagName("TH");
    if (_headres.length > 0) {
        return true;
    }
    return false;
}
function of_getTableFromTh(_table) {
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
function of_getAllOjElements(mainElement) {
    var outArray = [];
    outArray.push(...of_findByXPath("//*[starts-with(name(), 'oj-')]", mainElement, true));
    return outArray;
}
function of_getAllTabelsforPopus(mainElement) {
    var outArray = []; 
    outArray.push(...of_findByXPathForPopus("//div[@_leafColClientIds]", mainElement, true));
    return outArray;
}
function of_getTableFromTh(_table) {
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

function of_getButtonAndHyperLinksforPopus(mainElement) {
    var outArray = [];
    // debugger;
        outArray.push(...mainElement.getElementsByTagName("LI"));
        outArray.push(...mainElement.getElementsByTagName("INPUT"));

        outArray.push(...of_findByXPathForPopus("//a[@role='button']", mainElement, true));
        outArray.push(...of_findByXPathForPopus("//button[@type='submit']", mainElement, true));
        outArray.push(...of_findByXPathForPopus("//select", mainElement, true));

        outArray.push(...of_findByXPathForPopus("//button[contains(@class, 'AFTextOnly')]", mainElement, true));

        outArray.push(...of_findByXPathForPopus("//img[contains(@id, 'icon')]", mainElement, true));

        outArray.push(...of_findByXPathForPopus("//div[contains(@class, 'navmenu-header')]", mainElement, true));
        outArray.push(...of_findByXPathForPopus("//a[contains(@class, 'navmenu')]", mainElement, true));
        outArray.push(...of_findByXPathForPopus("//a[contains(@class, 'AFIconOnly')]", mainElement, true));
        outArray.push(...of_findByXPathForPopus("//div[contains(@class, 'xow xjl p_AFStretched')]", mainElement, true));
        //outArray.push(...of_findByXPathForPopus("//a[contains(@class, 'AFIconOnly') and not(@title='Search')]", mainElement, true));
        outArray.push(...of_findByXPathForPopus("//div[contains(@class, 'showDetailItem')]//li//a", mainElement, true));

        outArray.push(...of_findByXPathForPopus("//a[contains(@class, 'flat-tabs-text')]", mainElement, true));

        outArray.push(...of_findByXPathForPopus("//a[contains(@class, 'app-nav-label')]", mainElement, true));

        outArray.push(...of_findByXPathForPopus("//a[contains(@id, 'disclosureAnchor')]", mainElement, true));
        outArray.push(...of_findByXPathForPopus("//a[contains(@id, 'disclosureAnchor')]", mainElement, true));
        outArray.push(...of_findByXPathForPopus("//a[contains(@id, 'forgotLink')]", mainElement, true));
        outArray.push(...of_findByXPathForPopus("//img[contains(@title, 'Settings and Actions')]", mainElement, true));
        outArray.push(...of_findByXPathForPopus("//tr[@role='menuitem']", mainElement, true));
        outArray.push(...of_findByXPathForPopus("//div[@role='menuitem' and @aria-label='View']", mainElement, true));
    
    return outArray;
}

function of_istablevalid(_table) {
    var _headres = _table.getElementsByTagName("TH");
    if (_headres.length > 0) {
        return true;
    }
    return false;
}


function of_utils_filterVisibleElements(_elementsArray, checkAllCond) {
    var outArray = [];
    for (_element of _elementsArray) {
        if (of_IsElementVisible(_element, checkAllCond)) {
            outArray.push(_element);
        }
    }
    return outArray;
}
function of_getButtonAndHyperLinks(mainElement) {
    var outArray = [];
    outArray.push(...mainElement.getElementsByTagName("LI"));
    outArray.push(...mainElement.getElementsByTagName("INPUT"));

    outArray.push(...of_findByXPath("//div[@role='menuitem']", mainElement, true));
    outArray.push(...of_findByXPath("//button[not(ancestor::table)]", mainElement, true));
    outArray.push(...of_findByXPath("//a[@role='button' and not(contains(@aria-label, 'Collapse'))]", mainElement, true));
    outArray.push(...of_findByXPath("//a[not(@role='button')]/div[@role='img']", mainElement, true));
    // outArray.push(...of_findByXPath("//oj-c-button/button", mainElement, true));
    // outArray.push(...of_findByXPath("//oj-button/button", mainElement, true));
    outArray.push(...of_findByXPath("//button[@type='submit']", mainElement, true));
    outArray.push(...of_findByXPath("//select", mainElement, true));

    outArray.push(...of_findByXPath("//button[contains(@class, 'AFTextOnly')]", mainElement, true));
    outArray.push(...of_findByXPath("//img[contains(@id, 'icon')]", mainElement, true));

    outArray.push(...of_findByXPath("//div[contains(@class, 'navmenu-header')]", mainElement, true));
    outArray.push(...of_findByXPath("//a[contains(@class, 'navmenu')]", mainElement, true));
    outArray.push(...of_findByXPath("//a[contains(@class, 'AFIconOnly') and not(@title='Help')]", mainElement, true));
    outArray.push(...of_findByXPath("//div[contains(@class, 'xow xjl p_AFStretched')]", mainElement, true));
    //outArray.push(...of_findByXPath("//a[contains(@class, 'AFIconOnly') and not(@title='Search')]", mainElement, true));
    outArray.push(...of_findByXPath("//div[contains(@class, 'showDetailItem')]//li//a", mainElement, true));

    outArray.push(...of_findByXPath("//a[contains(@class, 'flat-tabs-text')]", mainElement, true));

    outArray.push(...of_findByXPath("//a[contains(@class, 'app-nav-label')]", mainElement, true));

    outArray.push(...of_findByXPath("//a[contains(@id, 'disclosureAnchor')]", mainElement, true));
    outArray.push(...of_findByXPath("//a[contains(@id, 'disclosureAnchor')]", mainElement, true));
    outArray.push(...of_findByXPath("//a[contains(@id, 'forgotLink')]", mainElement, true));
    outArray.push(...of_findByXPath("//img[contains(@title, 'Settings and Actions')]", mainElement, true));
     outArray.push(...of_findByXPath("//tr[@role='menuitem']", mainElement, true));

        outArray.push(...of_findByXPath("//div[@role='menuitem' and @aria-label='View']", mainElement, true));
        if(of_findByXPath("//a[@aria-label='Collapse Invoice Header']" , mainElement, true)!=null)
        {
        outArray.push(...of_findByXPath("//a[normalize-space(text())='Show More']", mainElement, true));
        }
        if(of_findByXPath("//div[@title='About this title']" , mainElement, true)!=null)
        {
        outArray.push(...of_findByXPath("//a[normalize-space(text())='Invoice Actions']", mainElement, true));
        }

    outArray.push(...of_findByXPath("//a[contains(@id, 'idcs-signin-basic-signin-form')]", mainElement, true));
    return outArray;
}

function of_istablevalid(_table) {
    var _headres = _table.getElementsByTagName("TH");
    if (_headres.length > 0) {
        return true;
    }
    return false;
}


function of_IsElementVisible(element, checkAllCond) {

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
        const topValue = parseFloat(style.top);
        const fontSize = parseFloat(style.fontSize);
        if (
            style.position === 'absolute' &&
            !isNaN(topValue) &&
            topValue < -1000 &&
            fontSize === 0
        ) {
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



function of_areAllParentsVisible(element) {
    let currentElement = element;

    while (currentElement) {
        var parentVisible = of_IsElementVisible(element, true);

        if (parentVisible == false) {
            return parentVisible;
        }
        currentElement = currentElement.parentElement;
    }

    return true;
}
function of_findByXPathForPopus(xpath, context = document, all) {
    if (allpopsXpath.length != 0) {
        all = true;
    }

    // Adjust the XPath to be relative to the context
    const resultType = all ? XPathResult.ORDERED_NODE_SNAPSHOT_TYPE : XPathResult.FIRST_ORDERED_NODE_TYPE;
    const result = document.evaluate(xpath, context, null, resultType, null); // Still using document.evaluate

    if (all) {
        const nodes = [];
        for (let i = 0; i < result.snapshotLength; i++) {
            const node = result.snapshotItem(i);
            if (context.contains(node)) { // Check if the node is within the context
                nodes.push(node);
            }
        }
        return nodes;
    } else {
        const node = result.singleNodeValue;
        return context.contains(node) ? node : null; // Ensure the node is within the context
    }
}
function of_findByXPath(xpath, context = document, all = false) {
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