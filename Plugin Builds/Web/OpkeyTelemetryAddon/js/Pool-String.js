
// Cut string with provided length and append triple dots ... 

function stringCutter(str, len) {
    if (str != null) {
        if (str.length > len) {
            str = str.substring(0, len) + "...";
        }
    }
    return str;
}
function isEmptyObject(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function formatChecker(string) {
    var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    if (format.test(string)) {
        return true;
    } else {
        return false;
    }
}
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}



String.prototype.includes = function () {
    'use strict';
    return String.prototype.indexOf.apply(this, arguments) !== -1;
};


// prototype for Math.sign not works on IE
if (typeof Math.sign === 'undefined') {
    Math.sign = function (x) { return x > 0 ? 1 : x < 0 ? -1 : x; };
}


String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


$.fn.bury = function (flag) {
    if (flag) { $(this).hide(); } else { $(this).show(); }
}

$.fn.disable = function (flag) {
    if ($(this).is("button")) {
        $(this).prop("disabled", flag);
    }
    else {
        if (flag) { $(this).addClass("disabled"); } else { $(this).removeClass("disabled"); }
    }
}
$.fn.disableclass = function (flag) {
    if (flag) { $(this).addClass("disabled"); } else { $(this).removeClass("disabled"); }
}


//(function ($) {
//    debugger;
//    var App = function () { };//constructor

//    App.prototype.callables = {//Return closure
//        bury: function (flag) {
//            if (flag) { $(this).hide(); } else { $(this).show(); }
//       
//        disable: function (flag) {
//            if (flag) { $(this).addClass("diabled"); } else { $(this).removeClass("disbaled"); }
//        }
//    }

//    $.fn.app = function () {
//        return new App().callables;//basically send back an instance of your plugin class with the closure
//    }
//})(jQuery)

//var x = $('#test').app();
//x.hello();//call individual functions
//x.hi();



//https://developer.mozilla.org/en-US/docs/Web/API/Element/closest

if (!Element.prototype.matches)
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;

if (!Element.prototype.closest)
    Element.prototype.closest = function (s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement;
        } while (el !== null);
        return null;
    };


// Create remove function if not exist
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}
//

function stringCutterAndDecoder(str, len) {
    str = decodeURIComponent(str);
    if (str.length > len) {
        str = str.substring(0, len) + "...";
    }
    return str;
}

function stringCutterA(string, len) {
    var str = string.trim();
    if (str.length > len) {
        str = str.substring(0, len) + "...";
    } else {
        var remainingLength = len - (str.length);
        var spaces = new Array(remainingLength).join(' ');
        str = str.concat(spaces);
    }
    return str;
}
$.extend($.expr[":"], {
    "containsIN": function (elem, i, match, array) {
        return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
    }
});
String.prototype.repeat = function (times) {
    return (new Array(times + 1)).join(this);
};

function stringBuilderWithSpace(str, len) {
    if (str.length < len) {
        Array(11).join(" ");
        str = str.substring(0, len) + "...";
    }
    return str;
}

function stringRemoveSpace(str) {

    return str.replace(/\s/g, '');
}

function stringLengthCutter(str, len1, len2) {
    return str.substring(len1, str.length - len2);
}

function getFileExtension(fileName) {
    var ext = fileName.split('.');

    //var loc = window.location.href
    //var fileNameIndex = loc.lastIndexOf("/") + 1;
    //var dotIndex = loc.lastIndexOf('.');

    //var output = loc.substr(fileNameIndex, dotIndex < fileNameIndex ? loc.length : dotIndex);
    return ext[ext.length - 1];
}

function isValidUrl(url) {

    var myVariable = url;
    if (/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(myVariable)) {
        return true;
    } else {
        return false;
    }
}

function fakingAngularCharacter(string) {
    var str = string.trim();
    if (typeof str === 'undefined' || str === null) {
        return "";
    } else {
        var newString = str.replace(/</g, '&lt;').replace(/>/g, '&gt');
        return newString;
    }

}



function reverseFakingAngularCharacter(string) {

    var str = string.trim();
    if (typeof str === 'undefined' || str === null) {
        return "";
    } else {
        var newString = str.replace(/&lt;/g, '<').replace(/&gt/g, '>');
        return newString;
    }

}

function getFileSizeByBytes(bytes, decimals) {
    if (bytes == 0) return '0 Byte';
    var k = 1000;
    var dm = decimals + 1 || 3;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];

    //if (typeof bytes !== 'number') {
    //    return '';
    //}
    //if (bytes >= 1000000000) {
    //    return (bytes / 1000000000).toFixed(2) + ' GB';
    //}
    //if (bytes >= 1000000) {
    //    return (bytes / 1000000).toFixed(2) + ' MB';
    //}
    //return (bytes / 1000).toFixed(2) + ' KB';
}

function minTwoDigits(n) {
    return (n < 10 ? '0' : '') + n;
}

function splitTimeToHour(time) {
    debugger;
    var timeArray = time.split(':');
    var timeHourPlace = timeArray[0];
    var timeMinutePlace = timeArray[1];
    if (timeMinutePlace > 59) {
        timeHourPlace = parseInt(timeHourPlace) + 1;
        timeMinutePlace = parseInt(timeMinutePlace) - 60;
    }
    return minTwoDigits(timeHourPlace) + ":" + minTwoDigits(timeMinutePlace);
}

function compareTwoString(string1, string2) {
    string1 = string1.toLowerCase().trim();
    string2 = string2.toLowerCase().trim();
    return string1 == string2 ? true : false;
};

String.prototype.checkSubString = function (subString) {
    const string =this.toLocaleLowerCase().indexOf(subString.toLocaleLowerCase().trim())
    return string.trim() >= 0;
};


function validateEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
};

function sanitize(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function htmlDecode(value) {
    return value.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}


function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}
function saveByteArray(reportName, byte, extension) {
    //var blob = new Blob([byte]);
    //var link = document.createElement('a');
    //link.href = window.URL.createObjectURL(blob);
    //var fileName = reportName + extension;
    //link.download = fileName;
    //link.class = "213213";
    //link.click();

    //  var contentType = "application/octet-stream";
    var contentType = "application/java-archive";
    var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
    if (urlCreator) {
        var blob = new Blob([byte], { type: contentType });
        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, reportName + extension);
        } else {
            var url = urlCreator.createObjectURL(blob);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.id = "tempA";
            a.href = url;
            a.download = reportName + extension; //you may assign this value from header as well 
            a.click();
            window.URL.revokeObjectURL(url);
        }
    }

};
function BrowserDetection() {

    //Check if browser is IE or not
    if (navigator.userAgent.search("MSIE") >= 0) {
        alert("Browser is InternetExplorer");
    }
    //Check if browser is Chrome or not
    else if (navigator.userAgent.search("Chrome") >= 0) {
        alert("Browser is Chrome");
    }
    //Check if browser is Firefox or not
    else if (navigator.userAgent.search("Firefox") >= 0) {
        alert("Browser is FireFox");
    }
    //Check if browser is Safari or not
    else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
        alert("Browser is Safari");
    }
    //Check if browser is Opera or not
    else if (navigator.userAgent.search("Opera") >= 0) {
        alert("Browser is Opera");
    }
}

function ClearSpaceAndConvertToLower(str) {
    return (str.replace(/\s+/g, '')).toLowerCase();
}

function ClearSpaceAndConvertToLowerSelectorRemover(str) {
    return (str.replace(/\s+/g, '')).toLowerCase().replace('#', "_").replace(/\./g, '_');
}

function createCoulumnTitle(text) {
    return text === null ? "" : '<span class="ellipsisTextSpan" style="white-space: pre;" title="' + fakingAngularCharacter(text) + '">' + fakingAngularCharacter(text) + '</span>';
}
function createColumnTitleWithStyle(text, style) {
    return text === null ? "" : '<span class="ellipsisTextSpan" style="white-space: pre;' + style + '" title="' + fakingAngularCharacter(text) + '">' + fakingAngularCharacter(text) + '</span>';
}

function createColumnWithDataType(text, dataType) {
    return text === null ? "" : '<img style="margin-left: 5px; text-align:left;" title="' + dataType + '" src = "/IconImages/ArgumentDataType/' + dataType + '.png" alt="Data Type Image" /> &nbsp'
        + '<span class="ellipsisTextSpan" style="white-space: pre;" title="' + fakingAngularCharacter(text) + '">' + fakingAngularCharacter(text) + '</span>';
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function IsVarObject(yourVariable) {

    if (typeof yourVariable === 'object' && yourVariable !== null) {

        return true;
    }
    return false;

}
function createBrowserColumn(text) {
    var html = '';
    if (text.toLowerCase().indexOf("windows") >= 0) {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-windows colorBlue"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    else if (text.toLowerCase().indexOf("linux") >= 0) {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-linux"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    else if (text.toLowerCase().indexOf("android") >= 0) {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-android colorGreen"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    else if (text.toLowerCase().indexOf("ios") >= 0) {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-apple colorGrey"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    else if (text.toLowerCase().indexOf("ipad") >= 0) {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-apple colorGrey"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    else if (text.toLowerCase().indexOf("iphone") >= 0) {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-apple colorGrey"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    else if (text.toLowerCase().indexOf("firefox") >= 0) {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-firefox"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    else if (text.toLowerCase().indexOf("chrome") >= 0) {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-chrome"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    else if (text.toLowerCase().indexOf("safari") >= 0) {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-safari"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    else if (text.toLowerCase().indexOf("opera") >= 0) {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-opera"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    else if (text.toLowerCase().indexOf("explorer") >= 0) {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-internet-explorer"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    else if (text.toLowerCase().indexOf("edge") >= 0) {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-edge"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    else {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-apple"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    return html;
}

function LoadCustomScroller() { }
//var contentType = "application/octet-stream";
//var contentType = "application/java-archive";
//var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
//if (urlCreator) {
//    var blob = new Blob([result.FileByte], { type: contentType });
//    var url = urlCreator.createObjectURL(blob);
//    var a = document.createElement("a");
//    document.body.appendChild(a);
//    a.style = "display: none";
//    a.href = url;
//    a.download = result.fileData.FileName + ".jar"; //you may assign this value from header as well 
//    a.click();
//    window.URL.revokeObjectURL(url);
//}


function removeWhiteSpace(str) {

    return str.replace(/\s/g, '');
}
function removeWhiteSpaceSpecialCharater(str) {
    var str1 = str.replace(/\s/g, '');
    var str2 = str1.replace(/[^a-zA-Z ]/g, "");
    return str2;
}


function getBrowser() {
    var type = "";
    // Firefox 1.0+
    if (typeof InstallTrigger !== 'undefined') {
        type = "Firefox";
    }

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    else if (/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification)) {
        type = "Safari";
    }

    // Internet Explorer 6-11
    else if (false || !!document.documentMode) {
        type = "InternetExplorer";
    }

    // Chrome 1+
    //else if (!!window.chrome && !!window.chrome.webstore) {
    //    type = "Chrome";
    //}
    else if (navigator.vendor === "Google Inc.") {
        type = "Chrome";
    }

    return type;
}

function getOperatingSystem() {
    var platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        os = null;
    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS';
    }
    else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    }
    return os;
}




function makeTextFile(text) {
    var textFile = null;
    var data = new Blob([text], { type: 'text/plain' });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.

    textFile = window.URL.createObjectURL(data);

    return textFile;
};


function restrictSpecialCharacterInInputBox() {
    $('input.restrictSpecialCharacterInInputBox').on('keydown', function (e) {
        //if (e.key == '\/' || e.key == '\\' || e.keyCode == 111) {
        if (e.key == '\\') {
            e.preventDefault();
        }
    });
}


function createDeviceColumn(text, type) {
    var html = '';
    if (type.toLowerCase().indexOf("android") >= 0) {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-android colorGreen"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    else if (type.toLowerCase().indexOf("ios") >= 0) {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-apple colorGrey"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    else if (type.toLowerCase().indexOf("ipad") >= 0) {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-apple colorGrey"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    else if (type.toLowerCase().indexOf("iphone") >= 0) {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-apple colorGrey"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    else {
        html = '<span class="ellipsisTextSpan" title="' + text + '"><strong class="fa fa-apple"></strong>&nbsp;&nbsp;' + text + '</span>';
    }
    return html;
}

//function randomTokenGenerator(tokenLength) {
//    var token = "";
//    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//    for (var i = 0; i < tokenLength; i++)
//        token += possible.charAt(Math.floor(Math.random() * possible.length));

//    return token;
//}
function randomTokenGenerator() {
    var token = "";
    var stringLength = 5;
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < stringLength; i++)
        token += possible.charAt(Math.floor(Math.random() * possible.length));

    return token;
}


function GetDataFromDictionary(dataObject, nodeId) {

    if (typeof dataObject[nodeId] === 'undefined' || dataObject[nodeId] === null) {
        return null;
    } else {
        return dataObject[nodeId];
    }


}


function checkStringContainSpecialCharaters(str) {
    debugger;
    var specialChars = "<>@!#$%^&*()+[]{}?:;|'\"\\,./~`-=";
    for (i = 0; i < specialChars.length; i++) {
        if (str.indexOf(specialChars[i]) > -1) {
            return true
        }
    }
    return false;
}

function toDate(dateStr) {

    if (dateStr.indexOf("-") !== -1) {
        var parts = dateStr.split("-")
        return new Date(parts[2], parts[1] - 1, parts[0])
    }

    return dateStr;
}

function GetComponentTypeFromAccelerator(type) {
    if (type === "ModifyBusinessComponent") { return EnumArtifact.Component; }
    else if (type === "ModifyBusinessProcess") { return EnumArtifact.Flow }
    else if (type === "ModifyTestCase") { return EnumArtifact.BP_Group }
    else {
        console.error("Type doest match " + type + " in  GetComponentTypeFromAccelerator")
    }
}

function getColorByText(text) {
    if (text === "") {
        return "";
    }

    var colorText = text.toLowerCase();

    if (colorText === "pass") {
        return "#4c8410";
    }
    else if (colorText === "fail") {
        return "#d83c31";
    }
    else if (colorText === "incomplete") {
        return "#ffa500";
    }
    else if (colorText === "skippedover") {
        return "#8f6e61";
    }
    else if (colorText === "inprogress") {
        return "#00b0ff";
    }
    else if (colorText === "notExecuted") {
        return "#ccc";
    }
    else {
        return "#FFD700";
    }

}

function secondsTimeSpanToHMS(s) {
    var h = Math.floor(s / 3600); //Get whole hours
    s -= h * 3600;
    var m = Math.floor(s / 60); //Get remaining minutes
    s -= m * 60;
    return h + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s); //zero padding on minutes and seconds
}


var emptyValue = [{ "color": "#EBEBEB", "labelColor": null, "name": "No test executed yet!", "y": 100 }];

var emptyArtifactValue = [{ "color": "#EBEBEB", "labelColor": null, "name": "No artifact share available!", "y": 100, "Count": 0 }];

var emptyDataDisplay = '<div class="rebootContainer"><div class="rebootOverlay" style="height: 20vh"><div>No Data to display</div></div></div>';

var emptyGagueLiveNewData = {
    "BuildName": "No build execution in-progress!", "BuildId": "00000000-0000-0000-0000-000000000000", "Total": 0, "Pass": 0, "Fail": 0, "NotExecuted": 0, "CountTestCaseFail": 0, "Incomplete": 0, "InProgress": 0, "SkippedOver": 0,
    "PercentPass": 0, "PercentFail": 0, "PercentNotExecuted": 0, "PercentIncomplete": 0, "PercentInProgress": 0, "PercentSkippedOver": 0, "PercentCurrentProgress": 0, "PercentComplete": 0, "CreatedOn": ""
};

var emptyGagueClosedData = {
    "BuildName": "No build executed yet", "BuildId": "00000000-0000-0000-0000-000000000000", "Total": 0, "Pass": 0, "Fail": 0, "NotExecuted": 0, "CountTestCaseFail": 0, "Incomplete": 0, "InProgress": 0, "SkippedOver": 0,
    "PercentPass": 0, "PercentFail": 0, "PercentNotExecuted": 0, "PercentIncomplete": 0, "PercentInProgress": 0, "PercentSkippedOver": 0, "PercentCurrentProgress": 0, "PercentComplete": 0, "CreatedOn": ""
};


function dataTypeCasting(DataType_Enum) {
    var castedDataType = "";
    if (DataType_Enum === "String") {
        castedDataType = "CollectionOfString";
    }
    else if (DataType_Enum === "Boolean") {
        castedDataType = "CollectionOfBoolean";
    }
    else if (DataType_Enum === "DateTime") {
        castedDataType = "CollectionOfDateTime";
    }
    else if (DataType_Enum === "Double") {
        castedDataType = "CollectionOfDouble";
    }
    else if (DataType_Enum === "Integer") {
        castedDataType = "CollectionOfInteger";
    }
    else if (DataType_Enum === "MobileDevice") {
        castedDataType = "CollectionOfMobileDevice";
    }
    else if (DataType_Enum === "MobileApplication") {
        castedDataType = "CollectionOfMobileApplication";
    }
    else if (DataType_Enum === "File") {
        castedDataType = "CollectionOfFile";
    }
    else if (DataType_Enum === "SecuredString") {
        castedDataType = "CollectionOfSecuredString";
    }
    else if (DataType_Enum === "KeyValuePair") {
        castedDataType = "CollectionOfKeyValuePair";
    }
    else {
        castedDataType = DataType_Enum;
    }
    return castedDataType;
}


function isIE() {
    const ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
    const msie = ua.indexOf('MSIE '); // IE 10 or older
    const trident = ua.indexOf('Trident/'); //IE 11

    return (msie > 0 || trident > 0);
}




function GetSizeInUnit(size, unit) {
    debugger;
    // consideering size is in bytes

    if (unit === "KB") {
        return (size / 1000);
    }
    else if (unit === "MB") {
        return ((size / 1000) / 1000);
    }
    else if (unit === "GB") {
        return ((size / 1000) / 1000) / 1000;
    }

}


function msToHMS(ms) {
    // 1- Convert to seconds:
    var seconds = ms / 1000;
    // 2- Extract hours:
    var hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    var minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = seconds % 60;


    return (hours + ":" + minutes + ":" + parseFloat(seconds).toFixed(0));
}

function getCookieByName(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}




function get_feature_display_name(License_Name) {

    var license_display_name = License_Name;

    switch (License_Name) {

        case "Impact_OracleFusion":
            license_display_name = "Oracle Impact Analysis"
            break;

        case "Impact_Salesforce":
            license_display_name = "Salesforce Impact Analysis"
            break;


        case "Impact_SAP":
            license_display_name = "SAP Impact Analysis"
            break;

        case "Impact_OracleEBS":
            license_display_name = "OracleEBS Impact Analysis"
            break;


        case "Impact_Workday":
            license_display_name = "Workday Impact Analysis"
            break;
        case "Impact_PeopleSoft":
            license_display_name = "PeopleSoft Impact Analysis"
            break;
        case "Recorder_Web":
            license_display_name = "Web Recorder"
            break;
        case "Recorder_Mobile":
            license_display_name = "Mobile Recorder"
            break;
        case "Recorder_Desktop":
            license_display_name = "Desktop Recorder"
            break;
        case "Recorder_Salesforce":
            license_display_name = "Salesforce Recorder"
            break;
        case "Recorder_Workday":
            license_display_name = "Workday Recorder"
            break;
        case "Recorder_OracleEBS":
            license_display_name = "OracleEBS Recorder"
            break;
        case "Recorder_OracleFusion":
            license_display_name = "OracleFusion Recorder"
            break;
        case "Recorder_PeopleSoft":
            license_display_name = "PeopleSoft Recorder"
            break;
        case "Recorder_Mainframe":
            license_display_name = "Mainframe Recorder"
            break;
        case "Recorder_Kronos":
            license_display_name = "Kronos Recorder"
            break;
        case "Recorder_VeevaVault":
            license_display_name = "Veeva Vault Recorder"
            break;
        case "Recorder_MicrosoftDynamics":
            license_display_name = "Microsoft Dynamics Recorder"
            break;
        case "Recorder_SAPSuccessFactors":
            license_display_name = "SAP Fiori Recorder "
            break;
        case "Recorder_SAPS4HANA":
            license_display_name = "SAP NetWeaver Recorder"
            break;

        case "Recorder_SAPFiori":
            license_display_name = "SAP Fiori Recorder "
            break;
        case "Recorder_SAPNetWeaver":
            license_display_name = "SAP NetWeaver Recorder"
            break;
        case "Recorder_MicrosoftDynamics_AX":
            license_display_name = "Microsoft Dynamics AX Recorder"
            break;


    }


    return license_display_name;
}