

var empty = "";

var EnumExecutionMode = { Web: "Web", Mobile: "Mobile" };

var EnumQueueMode = { Queued: "Queued", Scheduled: "Scheduled" };

var EnumCURDType = { Create: "Create", Update: "Update", ReadOnly: "ReadOnly", Delete: "Delete" };

var EnumDataRepositoryType = { DataRepository: "DataRepository", Datasheet: "Datasheet" };

var EnumExecutionType = { Local: "Local", Cloud: "Cloud" };

$.fn.bury = function (flag) {
    if (flag) { $(this).hide(); } else { $(this).show(); }
}

var EnumJobType = {
    JobPortal: "JobPortal",
    AcceleratorPortal: "AcceleratorPortal",
    OpkeyPortal: "OpkeyPortal",
    OpkeyProfile: "OpkeyProfile",
    Opkey: "Opkey",
    ImpactAnalysis: "ImpactAnalysis",
    MultiBrowser: "MultiBrowser"
};
var EnumArgumentDataType = {
    String: "String",
    Boolean: "Boolean",
    Integer: "Integer",
    Double: "Double",
    DateTime: "DateTime",
    ORObject: "ORObject",
    MobileDevice: "MobileDevice",
    MobileApplication: "MobileApplication",
    SecuredString: "SecuredString",
    File: "File",
    List: "List",
    Object: "Object",
    KeyValuePair: "KeyValuePair",
    SecuredString: "SecuredString",
    CollectionOfString: "CollectionOfString",
    CollectionOfBoolean: "CollectionOfBoolean",
    CollectionOfDateTime: "CollectionOfDateTime",
    CollectionOfDouble: "CollectionOfDouble",
    CollectionOfInteger: "CollectionOfInteger",
    CollectionOfMobileDevice: "CollectionOfMobileDevice",
    CollectionOfMobileApplication: "CollectionOfMobileApplication",
    CollectionOfFile: "CollectionOfFile",
    CollectionOfObject: "CollectionOfObject",
    CollectionOfSecuredString: "CollectionOfSecuredString",
    CollectionOfKeyValuePair: "CollectionOfKeyValuePair"
};

var EnumAddonOperationType = {
    CreateFollowMe:"CreateFollowMe",
    CreateOpkeyTest:"CreateOpkeyTest",
    RunOpkeyTest: "RunOpkeyTest"
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
function createAsterisk (num) {
    var ast = "";
    for (var i = 0; i < num.length; i++) {
        ast = ast + "*";
    }
    return ast;
};

function stringCutter(str, len) {
    if (str != null) {
        if (str.length > len) {
            str = str.substring(0, len) + "...";
        }
    }
    return str;
}

function isEmptyObject(value) {
    return Object.keys(value).length === 0 && value.constructor === Object;
}
