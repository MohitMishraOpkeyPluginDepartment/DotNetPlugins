var OpkeyRecorder = function () {
	this.right_click_keyword_image = null;
	this.allrecordedstepsarray = [];
	this.allrecordeddomssarray = [];
	this.currentwindowtitle = "";
	this.fusionHeaderTitle = "";
	this.currentwindowindex = -1;
	this.currentopenedwindow = null;
	this.current_pivot_objectdata = null;
	this.rowidarray = [];
	this.selectedrowidarray = [];
	this.keywords_list = ["Click", "ClickLink", "MouseHover", "TypeTextOnEditBox", "TypeTextAndEnterEditBox", "TypeTextInTextArea", "TypeTextAndEnterTextArea", "ClickButtonInTableCell", "ClickLinkInTableCell", "ClickTableCell", "SelectDropDownItem", "SelectCheckBox", "DeSelectCheckBox", "SelectRadioButton", "SelectWindow", "SelectFrame", "WaitForObject", "Wait", "Image_Click", "Image_DoubleClick", "Image_RightClick", "Image_TypeTextOnEditBox", "Image_VerifyObjectExists"];
	this.oracle_keywords_list = ["Click", "ClickLink", "MouseHover", "TypeTextOnEditBox", "TypeTextAndEnterEditBox",
		"TypeTextInTextArea", "TypeTextAndEnterTextArea", "SelectCheckBox", "DeSelectCheckBox", "SelectRadioButton", "SelectWindow",
		"SelectFrame", "WaitForObject", "Wait"
	];
	this.checkInner64bytes = null;
	this.opened_window_id = -1;
	this.current_selected_domobject = null;
	this.all_objects_array = [];
	this.object_image = "";
	this.document_url = "";
	this.salesforce_keywords = ["Click", "TypeTextOnEditBox", "TypeTextAndEnterEditBox", "SelectDropDownItem", "SelectMultipleDropDownItem", "SelectRadioButton", "SelectCheckBox", "DeSelectCheckBox", "ClickButton", "ClickImage", "ClickLink", "SelectMultipleDropdownItem", "SelectWindow", "SelectFrame", "TypeTextInTextArea", "SelectListItem", "Enter"];
	this.salesforce_metdata_array = [];
	this.veeva_metdata_array = [];
	this.salesforce_quickaction_metdata_array = [];
	this.keywords_type = [];

	this.action_keywords = [];
	this.general_keywords = [];
	this.verify_keywords = [];
	this.salesforce_keyword = [];
	this.oraclefusion_keyword = [];
	this.peoplesoft_keyword = [];
	this.get_keywords = [];
	// this.selectwindow_ignoredkeywords=["SF_SearchAndSelect"];
	this.selectwindow_ignoredkeywords = ["SF_LaunchAppAndSelectItem"];
	this.dynamic_or_keywords = [];
	this.modal_dialog_opened = false;
	this.get_token_called = false;
	this.apex_markup_xml_doc = "";
	this.aura_markup_xml_doc = "";
	this.isChangeTriggered = false;
	this.keywords_info = [{
		keywordname: "Click",
		Info: {
			r_object: true,
			r_data: false
		}
	},
	{
		keywordname: "ClickLink",
		Info: {
			r_object: true,
			r_data: false
		}
	},
	{
		keywordname: "MouseHover",
		Info: {
			r_object: true,
			r_data: false
		}
	},
	{
		keywordname: "TypeTextOnEditBox",
		Info: {
			r_object: true,
			r_data: true
		}
	},
	{
		keywordname: "TypeTextInTextArea",
		Info: {
			r_object: true,
			r_data: true
		}
	},
	{
		keywordname: "TypeTextAndEnterEditBox",
		Info: {
			r_object: true,
			r_data: true
		}
	},
	{
		keywordname: "TypeTextAndEnterTextArea",
		Info: {
			r_object: true,
			r_data: true
		}
	},
	{
		keywordname: "ClickButtonInTableCell",
		Info: {
			r_object: true,
			r_data: true
		}
	},
	{
		keywordname: "ClickLinkInTableCell",
		Info: {
			r_object: true,
			r_data: true
		}
	},
	{
		keywordname: "ClickTableCell",
		Info: {
			r_object: true,
			r_data: true
		}
	},
	{
		keywordname: "SelectDropDownItem",
		Info: {
			r_object: true,
			r_data: true
		}
	},
	{
		keywordname: "SelectCheckBox",
		Info: {
			r_object: true,
			r_data: true
		}
	},
	{
		keywordname: "DeSelectCheckBox",
		Info: {
			r_object: true,
			r_data: false
		}
	},
	{
		keywordname: "SelectRadioButton",
		Info: {
			r_object: true,
			r_data: true
		}
	},
	{
		keywordname: "SelectWindow",
		Info: {
			r_object: false,
			r_data: true
		}
	},
	{
		keywordname: "SelectFrame",
		Info: {
			r_object: true,
			r_data: false
		}
	},
	{
		keywordname: "WaitForObject",
		Info: {
			r_object: true,
			r_data: true
		}
	},
	{
		keywordname: "Wait",
		Info: {
			r_object: false,
			r_data: true
		}
	},
	// "Image_DoubleClick","Image_RightClick","Image_TypeTextOnEditBox","Image_VerifyObjectExists"
	{
		keywordname: "Image_Click",
		Info: {
			r_object: true,
			r_data: false
		}
	},
	{
		keywordname: "Image_DoubleClick",
		Info: {
			r_object: true,
			r_data: false
		}
	},
	{
		keywordname: "Image_RightClick",
		Info: {
			r_object: true,
			r_data: false
		}
	},
	{
		keywordname: "Image_TypeTextOnEditBox",
		Info: {
			r_object: true,
			r_data: true
		}
	},
	{
		keywordname: "Image_VerifyObjectExists",
		Info: {
			r_object: true,
			r_data: false
		}
	}
	];

	this.all_fusion_metadata = [];
};
var previousRecordingName = null;
var loadtestingkeywordadded = false;
var hideOracleEBSLoadTestingKeyword = false;
var oracleEbsLaunchFormUrl = null;
var lastLogicalName = null;
var invokedExecution = false;
var _bgPage = chrome.extension.getBackgroundPage();

var _opkeyrecorder = new OpkeyRecorder();
_opkeyrecorder.allrecordedstepsarray = [];
_opkeyrecorder.allrecordeddomssarray = [];


var saas_object = new Saas();
var is_anchored = false;
// need to be reviewed by neon

var _allEBSReqResponseList = [];
var lastPausePressed = false;
var pausedByUser = true;
var showPlaybackDiv = true;
var currentTabHandleId = -1;

var firstAction = null;
var firstTimeStamp = 0;
var SecondAction = null;
var SecondTimeStamp = 0;

chrome.runtime.sendMessage({
	setDockerCommand_stepcount: 0
}, function (response) {
	if (chrome.runtime.lastError) { }
});

window.setInterval(function () {
	chrome.runtime.sendMessage({
		getElementImage: "getElementImage"
	}, function (response) {
		if (chrome.runtime.lastError) { }
		_opkeyrecorder.object_image = response;
	});
}, 500);


async function GetRecordedSteps() {
	return new Promise(function (resolve, reject) {
		chrome.runtime.sendMessage({
			GetRecordedSteps: "GetRecordedSteps"
		}, function (response) {
			resolve(response);
		});
	});
}

async function GetOOCRecorderPortNo() {
	return new Promise(function (resolve, reject) {
		chrome.runtime.sendMessage({
			GetOOCRecorderPortNo: "GetOOCRecorderPortNo"
		}, function (response) {
			resolve(response);
		});
	});
}

async function GetDOMSData() {
	return new Promise(function (resolve, reject) {
		chrome.runtime.sendMessage({
			GetDOMSData: "GetDOMSData"
		}, function (response) {
			resolve(response);
		});
	});
}

function restoreRecorderWindow() {
	chrome.runtime.sendMessage({
		restoreRecorderWindow: "restoreRecorderWindow"
	}, function (response) {
		if (chrome.runtime.lastError) { }

	});
}

function shrinkRecorderWindow() {
	chrome.runtime.sendMessage({ shrinkRecorderWindow: "shrinkRecorderWindow" }, function (response) {

	});
}

async function getEBSLTRequestResponseList() {
	return new Promise(function (resolve, reject) {
		chrome.runtime.sendMessage({
			getEBSLTRequestResponseList: "getEBSLTRequestResponseList"
		}, function (response) {
			resolve(response);
		});
	});
}

var gotfudiondata = false;
window.setInterval(async function () {
	if (isMobileRecording()) {
		try {
			_opkeyrecorder.addMobileRecorderStepsToRecorderGrid();
		} catch (e) { }
		var response = await GetRecordedSteps();
		_opkeyrecorder.addAllDataToGrid(response, true, true, true);
		return;
	}
	var response = await GetRecordedSteps();
	_opkeyrecorder.addAllDataToGrid(response, true, true, true);
	var _spydata = await GetDOMSData();
	_opkeyrecorder.addAllDataToDomGrid(_spydata);

	var _ebsLTReqResponseList = await getEBSLTRequestResponseList();
	_allEBSReqResponseList = _ebsLTReqResponseList;
}, 500);

function getPcloudyDeviceDto() {
	var pcloudydto = localStorage.getItem("PcloudyDeviceDto");
	if (pcloudydto != null && pcloudydto != "") {
		return JSON.parse(pcloudydto);
	}
	return null;
}

function isMobileRecording() {
	if (localStorage.getItem("RECORDING_MODE") != null && localStorage.getItem("RECORDING_MODE").indexOf("Mobile") > -1) {
		return true;
	}
	return false;
}

function isLocalMobileRecording() {
	var mobileRecorderType = localStorage.getItem("MobileRecorderType");

	if (mobileRecorderType == null || mobileRecorderType == "") {
		return false;
	}

	if (mobileRecorderType == "LocalAndriodRecorder") {
		return true;
	}
	return false;
}

OpkeyRecorder.prototype.stopLocalRecorder = function () {
	if (isLocalMobileRecording() == false) {
		return;
	}
	var sessionId = localStorage.getItem("MobileRecorderSessionId");
	var agentId = localStorage.getItem("MobileRecorderAgentId");
	$.ajax({
		url: localStorage.getItem("OPKEY_DOMAIN_NAME") + '/Recorder/StopLocalRecorder',
		type: 'POST',
		data: { SessionId: sessionId, agentId: agentId },
		success: function (result) {
			//   console.log(result);

		},
		error: function (error) {

		}
	});
};

OpkeyRecorder.prototype.addMobileRecorderStepsToRecorderGrid = function () {

	if (isLocalMobileRecording()) {

		var sessionId = localStorage.getItem("MobileRecorderSessionId");
		var agentId = localStorage.getItem("MobileRecorderAgentId");
		$.ajax({
			url: localStorage.getItem("OPKEY_DOMAIN_NAME") + "/Recorder/GetLocalRecorderSteps",
			type: 'POST',
			data: { SessionId: sessionId, agentId: agentId },
			success: function (result) {
				processMobileRecorderSteps(result);
			},
			error: function (error) {

			}
		});
	}

	else {
		var pcloudyDeviceDto = getPcloudyDeviceDto();

		var pCloudyBookingDtoResult = pcloudyDeviceDto["BookingDTO"];

		var credentials = pcloudyDeviceDto["pCloudyCredentials"];


		var jsonConvertedpCloudyBookingDtoResult = JSON.stringify(pCloudyBookingDtoResult);
		$.ajax({
			url: localStorage.getItem("OPKEY_DOMAIN_NAME") + "/Recorder/GetRecorderSteps",
			type: "POST",
			data: { credentials: credentials, pCloudyBookingDtoResult: jsonConvertedpCloudyBookingDtoResult },
			success: function (result) {
				processMobileRecorderSteps(result);
			},
			error: function (error) {

			}
		});
	}
};


function processMobileRecorderSteps(result) {
	if (result != null && result != "") {
		console.log(result);
		$.grep(result, function (dt) {
			//console.log(dt.recorder_data);
			var tempjson = JSON.parse(dt.recorder_data);
			var status = 0;
			tempjson.forEach(function (item, i) {
				if (item.action == "_setKey") {
					return;
				}
				if (item.hasOwnProperty("action")) {
					if (item.arguments[0].hasOwnProperty("sahiText") && item.arguments[0]["sahiText"] !== "") {
						item.arguments[0]["logicalname"] = DOMPurify.sanitize(item.arguments[0]["sahiText"]);
					}
					else if (item.arguments[0].hasOwnProperty("innertext") && item.arguments[0]["innertext"] !== "") {
						item.arguments[0]["logicalname"] = DOMPurify.sanitize(item.arguments[0]["innertext"]);
					}
					else if (item.arguments[0].hasOwnProperty("text") && item.arguments[0]["text"] !== "") {
						item.arguments[0]["logicalname"] = DOMPurify.sanitize(item.arguments[0]["text"]);
					}
					else if (item.arguments[0].hasOwnProperty("name") && item.arguments[0]["name"] !== "") {
						item.arguments[0]["logicalname"] = DOMPurify.sanitize(item.arguments[0]["name"]);
					}
					else if (item.arguments[0].hasOwnProperty("class") && item.arguments[0]["class"] !== "") {
						item.arguments[0]["logicalname"] = DOMPurify.sanitize(item.arguments[0]["class"]);
					}
					else if (item.arguments[0].hasOwnProperty("className") && item.arguments[0]["className"] !== "") {
						item.arguments[0]["logicalname"] = DOMPurify.sanitize(item.arguments[0]["className"]);
					}
					else {
						item.arguments[0]["logicalname"] = "";
					}
					processRecordedData(item);
				}
				else {
					if (item.hasOwnProperty("class")) {
						//	$scope.addSpyDataToTreeview(dt.recorder_data);
						_opkeyrecorder.addAllDataToDomGrid(dt.recorder_data);
					}
					return false;
				}
			});
		});
	}
}

function processRecordedData(_stepData) {
	if ($("#pausePlayHolder").hasClass("rec_BTNStyle")) {
		return;
	}
	recorder_processDataForGrid(_stepData, false, true, true, -1);
}

OpkeyRecorder.prototype.SendCommandToMobileRecorder = function (_command) {
	$.ajax({
		url: localStorage.getItem("OPKEY_DOMAIN_NAME") + "/Recorder/SendCommandToMobileRecorder",
		type: "POST",
		data: _command,
		success: function () {

		},
		error: function () {

		}
	});
};


OpkeyRecorder.prototype.StartPcloudySpy = function () {
	var artificateType = localStorage.getItem("ArtifactModuleType");
	var recorderType = localStorage.getItem("MobileRecorderType");

	var pcloudtDto = getPcloudyDeviceDto();
	var strBookingDtoResult = pcloudtDto["BookingDTO"];
	var strPCloudyCredentials = pcloudtDto["pCloudyCredentials"];

	strBookingDtoResult = JSON.stringify(strBookingDtoResult);
	strPCloudyCredentials = JSON.stringify(strPCloudyCredentials);

	var dataToSend = {
		moduleType: artificateType,
		agentId: '',
		recorderType: recorderType,
		recorderWindowEvent: 'StartObjectSpy',
		localRecorderSessionId: '',
		strPCloudyCredentials: strPCloudyCredentials,
		strBookingDtoResult: strBookingDtoResult
	};
	_opkeyrecorder.SendCommandToMobileRecorder(dataToSend);
};

OpkeyRecorder.prototype.StartLocalSpy = function () {
	var artificateType = localStorage.getItem("ArtifactModuleType");
	var recorderType = localStorage.getItem("MobileRecorderType");

	var sessionId = localStorage.getItem("MobileRecorderSessionId");
	var agentId = localStorage.getItem("MobileRecorderAgentId");

	var dataToSend = {
		moduleType: artificateType,
		agentId: agentId,
		recorderType: recorderType,
		recorderWindowEvent: 'StartObjectSpy',
		localRecorderSessionId: sessionId,
		strPCloudyCredentials: "",
		strBookingDtoResult: ""
	};
	_opkeyrecorder.SendCommandToMobileRecorder(dataToSend);
};


OpkeyRecorder.prototype.StopPcloudySpy = function () {
	var artificateType = localStorage.getItem("ArtifactModuleType");
	var recorderType = localStorage.getItem("MobileRecorderType");

	var pcloudtDto = getPcloudyDeviceDto();
	var strBookingDtoResult = pcloudtDto["BookingDTO"];
	var strPCloudyCredentials = pcloudtDto["pCloudyCredentials"];

	strBookingDtoResult = JSON.stringify(strBookingDtoResult);
	strPCloudyCredentials = JSON.stringify(strPCloudyCredentials);


	var dataToSend = {
		moduleType: artificateType,
		agentId: '',
		recorderType: recorderType,
		recorderWindowEvent: 'StopObjectSpy',
		localRecorderSessionId: '',
		strPCloudyCredentials: strPCloudyCredentials,
		strBookingDtoResult: strBookingDtoResult
	};
	_opkeyrecorder.SendCommandToMobileRecorder(dataToSend);
};

OpkeyRecorder.prototype.StopLocalSpy = function () {
	var artificateType = localStorage.getItem("ArtifactModuleType");
	var recorderType = localStorage.getItem("MobileRecorderType");

	var sessionId = localStorage.getItem("MobileRecorderSessionId");
	var agentId = localStorage.getItem("MobileRecorderAgentId");

	var dataToSend = {
		moduleType: artificateType,
		agentId: agentId,
		recorderType: recorderType,
		recorderWindowEvent: 'StopObjectSpy',
		localRecorderSessionId: sessionId,
		strPCloudyCredentials: "",
		strBookingDtoResult: ""
	};
	_opkeyrecorder.SendCommandToMobileRecorder(dataToSend);
};

window.setInterval(function () {
	chrome.runtime.sendMessage({
		GetRecordingPageChanged: "GetRecordingPageChanged"
	}, function (response) {
		if (chrome.runtime.lastError) { }
		if (response != null) {
			if (response == true) {
				if (is_anchored == true) {
					$("#set_relation").click();
				}
			}
		}
	});

	chrome.runtime.sendMessage({
		GetSalesForceMetadata: "GetSalesForceMetadata"
	}, function (response) {
		if (chrome.runtime.lastError) { }
		if (response != null) {
			if (response.length > 0) {
				_opkeyrecorder.salesforce_metdata_array = response.slice(0);
			}
		}
	});

	chrome.runtime.sendMessage({
		GetSalesForceMetadata: "GetVeevaMetadata"
	}, function (response) {
		if (chrome.runtime.lastError) { }
		if (response != null) {
			if (response.length > 0) {
				_opkeyrecorder.veeva_metdata_array = response.slice(0);
			}
		}
	});

	chrome.runtime.sendMessage({
		GetQuickActionMetadataForRecorder: "GetQuickActionMetadataForRecorder"
	}, function (response) {
		if (chrome.runtime.lastError) { }
		if (response != null) {
			if (response.length > 0) {
				_opkeyrecorder.salesforce_quickaction_metdata_array = response.slice(0);
			}
		}
	});

	chrome.runtime.sendMessage({
		GetApexMarkupXMLDoc: "GetApexMarkupXMLDoc"
	}, function (response) {
		if (chrome.runtime.lastError) { }
		if (response != null) {
			if (response != "") {
				_opkeyrecorder.apex_markup_xml_doc = response;
			}
		}
	});

	chrome.runtime.sendMessage({
		GetAuraClassProperty: "GetAuraClassProperty"
	}, function (response) {
		if (chrome.runtime.lastError) { }
		if (response != null) {
			if (response != "") {
				_opkeyrecorder.apex_markup_xml_doc = response;
			}
		}
	});

	chrome.runtime.sendMessage({
		GetAuraMarkupXMLDoc: "GetAuraMarkupXMLDoc"
	}, function (response) {
		if (chrome.runtime.lastError) { }
		if (response != null) {
			if (response != "") {
				console.log("APEX MARKUP " + response);
				_opkeyrecorder.aura_markup_xml_doc = response;
			}
		}
	});

	if ($("#pause").hasClass("fa-circle")) {
		//$("#addrow").prop("disabled", true);
	} else {
		if (_opkeyrecorder.all_objects_array.length > 0) {
			$("#addrow").prop("disabled", false);
		} else {
			$("#addrow").prop("disabled", true);
		}
	}
	var main_step_grid = document.getElementById("mainstepgrid");
	var tr_main_step_grid = mainstepgrid.getElementsByTagName("TR");
	if (tr_main_step_grid.length > 1) {
		$("#delrow").prop("disabled", false);
		$("#debugButton").prop("disabled", false);
		$("#executeButton").prop("disabled", false);
		$("#executeButton").addClass("play_btn_override");
		$("#executeButtonHolder").prop("disabled", false);
		if ($("#pause").hasClass("fa-circle")) {
			//$("#editStep").prop("disabled", true);
		} else {
			$("#editStep").prop("disabled", false);
		}
	} else {
		$("#executeButton").removeClass("play_btn_override");
		$("#delrow").prop("disabled", true);
		$("#executeButton").prop("disabled", true);
		$("#executeButtonHolder").prop("disabled", true);
		$("#stop_execution").prop("disabled", true);
		$("#debugButton").prop("disabled", true);
		$("#editStep").prop("disabled", true);
	}

	if (tr_main_step_grid.length > 2) {
		$("#shiftrowup").prop("disabled", false);
		$("#shiftrowdown").prop("disabled", false);
	} else {
		$("#shiftrowup").prop("disabled", true);
		$("#shiftrowdown").prop("disabled", true);
	}

	var spydomgrid_total_records = _opkeyrecorder.allrecordeddomssarray;
	if (spydomgrid_total_records.length > 0) {
		$("#addStepButton").prop("disabled", false);
		$("#set_relation").prop("disabled", false);
		$("#addObjectButton").prop("disabled", false);

		$("#stepsArray").prop("disabled", false);
		$("#addsteptogrid").prop("disabled", false);
		$("#spyStepsArray").prop("disabled", false);
		$("#addStepButton").prop("disabled", false);
	} else {
		$("#addStepButton").prop("disabled", true);
		$("#set_relation").prop("disabled", true);
		$("#addObjectButton").prop("disabled", true);

		$("#stepsArray").prop("disabled", true);
		$("#addsteptogrid").prop("disabled", true);
		$("#spyStepsArray").prop("disabled", true);
		$("#addStepButton").prop("disabled", true);
	}

	if (tr_main_step_grid.length > 0) {
		$("#stepsArray").prop("disabled", false);
		$("#addsteptogrid").prop("disabled", false);
	} else {
		$("#stepsArray").prop("disabled", true);
		$("#addsteptogrid").prop("disabled", true);
	}

}, 800);



OpkeyRecorder.prototype.GetFusionMetadataFromApi = function (_endpoint, _username, _password) {
	saas_object.BlockUI();
	_opkeyrecorder.all_fusion_metadata = []
	console.log("Fetching metadata");
	$.ajax({
		url: _endpoint + "/crmRestApi/resources/latest/describe",
		method: "GET",
		headers: {
			"Authorization": "Basic " + btoa(_username + ":" + _password)
		},
		success: function (data_0) {
			var data_array = new Array();
			var _resources = data_0.Resources
			$.each(_resources, function (key, value) {
				value["ObjectName"] = key;
				console.log(key);
				_opkeyrecorder.all_fusion_metadata.push(value);
			});

			saas_object.UnBlockUI();
			$("#oraclefusionmetadatadialog").dialog("close");
		},
		error: function (error_data) {
			saas_object.UnBlockUI();
			saas_object.ShowToastMessage("error", "Uanble to Fetch Fusion Metadata")
		}
	})
};

OpkeyRecorder.prototype.mapActionOfWebRecorder = function (action, tagname, type, value) {
	if ((action == "_click") || (action == "click")) {
		if (tagname == "A") {
			return "ClickLink";
		} else if (tagname == "Button") {
			return "ClickButton";
		} else if (type == "radio") {
			return "SelectRadioButton";
		} else if (type == "checkbox") {
			if (value == false) {
				return "SelectCheckBox";
			} else {
				return "DeSelectCheckBox";
			}

		} else if (type == "button") {
			return "ClickButton";
		} else {
			return "Click";
		}
	}
	if (action == "setSelected") {
		if (tagname == "SELECT" || tagname.indexOf("DROPDOWN") > -1) {
			return "SelectDropDownItem";
		}
		return "Click";
		// return "SelectDropDownItem";
	}
	if ((action == "_setValue") || (action == "setValue")) {
		if (tagname == "INPUT") {
			if (type == "button") {
				return "ClickButton";
			}
			if (type == "submit") {
				return "ClickButton";
			}
		}
		if (tagname == "INPUT") {
			if (type === "search") {
				return "TypeTextOnEditBox";
			}
			return "TypeTextOnEditBox";
		}
		if (tagname == "TEXTAREA") {
			return "TypeTextInTextArea";
		}
		return "TypeTextOnEditBox";
	}
	if (action == "setValue" || action == "_setKey") {
		if (tagname == "INPUT") {
			return "TypeTextOnEditBox";
		}
		if (tagname == "TEXTAREA") {
			return "TypeTextInTextArea";
		}
		return "TypeTextOnEditBox";
	}

	if (action == "setValueAndEnter") {
		if (tagname == "INPUT") {
			return "TypeTextAndEnterEditBox";
		}
	}

	return action;
};

OpkeyRecorder.prototype.GetAllEnteredArguments = function () {
	var output_data = new Object();
	var table_element = document.getElementById("rightclickarguments_holder");

	var _trelements = table_element.getElementsByTagName("TR");
	for (var _tr = 0; _tr < _trelements.length; _tr++) {
		var _trelement = _trelements[_tr];
		var _tdnodes = _trelement.getElementsByTagName("INPUT");
		if (_tdnodes.length == 2) {
			var _selectionnode = _tdnodes[0];
			var _datanode = _tdnodes[1];

			if (_selectionnode.checked) {
				if (_datanode.type == "checkbox") {
					if (_datanode.checked) {
						output_data[_datanode.fieldName] = "True";
					} else {
						output_data[_datanode.fieldName] = "False";
					}
				} else {
					output_data[_datanode.fieldName] = _datanode.value;
				}
			} else {
				if (_datanode.type == "checkbox") {
					output_data[_datanode.fieldName] = "False";
				} else {
					output_data[_datanode.fieldName] = "";
				}
			}
		}
	}
	return output_data;
};

OpkeyRecorder.prototype.RenderAllObjectAttributesInRightClick = function (or_object) {
	var table_arguments_holder_element = document.getElementById("attributes_table");
	table_arguments_holder_element.innerHTML = "";
	var tbody_element = document.createElement("TBODY");
	$.each(or_object, function (key, value) {
		if (key == "sahiText") {
			key = "innertext";
		}
		if (key != "ObjectImage" && key != "parent" && value != "") {
			var arg_name = key;
			var arg_value = value;
			var tr_element = document.createElement("TR");
			var td_Name_element = document.createElement("TD");
			td_Name_element.id = "Name";
			td_Name_element.innerText = arg_name;
			var td_Type_element = document.createElement("TD");
			td_Type_element.id = "Type";
			var input_element = document.createElement("INPUT");
			input_element.type = "text";
			input_element.value = value;
			$(input_element).attr("readonly", "");
			td_Type_element.appendChild(input_element);
			tr_element.appendChild(td_Name_element);
			tr_element.appendChild(td_Type_element);
			tbody_element.appendChild(tr_element);
		}
	});

	table_arguments_holder_element.appendChild(tbody_element);
};

OpkeyRecorder.prototype.capitalizeFirstLetter = function (string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

var parent_object_array = new Array();
OpkeyRecorder.prototype.GetNestedParent = function (parent_object) {
	parent_object_array.push(parent_object);
	if (parent_object["parent"] != null) {
		_opkeyrecorder.GetNestedParent(parent_object["parent"]);
	}
	return parent_object_array;
};

OpkeyRecorder.prototype.GetParentXml = function (parent_object) {
	var parent_xml = "<ParentProperties>";
	$.each(parent_object, function (key, value) {
		if (value != null) {
			key = _opkeyrecorder.capitalizeFirstLetter(key);
			parent_xml += "<" + key + "><![CDATA[" + value + "]]></" + key + ">";
		}
	})
	parent_xml += "</ParentProperties>";
	return parent_xml;
}

OpkeyRecorder.prototype.GetParentHierarchy = function (parent_object) {
	parent_object_array = new Array();
	var parent_hierarchy = "<?xml version='1.0'?><ArrayOfParentProperties xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>";
	if (parent_object["parent"] != null) {
		if (parent_object["parent"].toString().indexOf("ArrayOfParentProperties") == -1) {
			var parents_array = _opkeyrecorder.GetNestedParent(parent_object["parent"]);
			for (var parent_index = 0; parent_index < parents_array.length; parent_index++) {
				var parent_node = parents_array[parent_index];
				parent_node["parent"] = null;
				var parent_xml = _opkeyrecorder.GetParentXml(parent_node);
				parent_hierarchy += parent_xml;
			}
			parent_hierarchy += "</ArrayOfParentProperties>";
			return parent_hierarchy;
		}
	}
	return null;
}

OpkeyRecorder.prototype.CloneJavaScriptObject = function (in_object) {
	var temp_object = JSON.stringify(in_object);
	return JSON.parse(temp_object);
};

OpkeyRecorder.prototype.convertTohashCode = function (orobject) {
	// return orobject["logicalname"];
	var temp_orbject = _opkeyrecorder.CloneJavaScriptObject(orobject);
	if (temp_orbject["ObjectImage"] != null) {
		temp_orbject["ObjectImage"] = "";
	}
	var str = JSON.stringify(temp_orbject);
	var hash = 0;
	if (str.length == 0) return hash;
	for (i = 0; i < str.length; i++) {
		char = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};


OpkeyRecorder.prototype.GetObjectFromeObjectArray = function (id_of_object) {
	for (var oi = 0; oi < _opkeyrecorder.all_objects_array.length; oi++) {
		var already_added_object = _opkeyrecorder.all_objects_array[oi];
		if (already_added_object["id"] == id_of_object.toString()) {
			return already_added_object["ORObject"];
		}
	}
	return null;
};

OpkeyRecorder.prototype.AddObjectInAddStepDialog = function (or_object) {
	var hash_code = _opkeyrecorder.convertTohashCode(or_object);
	var object_to_add = new Object();
	object_to_add["id"] = hash_code;
	object_to_add["ORObject"] = or_object;
	var existing_object = _opkeyrecorder.GetObjectFromeObjectArray(hash_code);
	if (existing_object != null) {
		return;
	}
	_opkeyrecorder.all_objects_array.push(object_to_add);
	appendSanitizedOption("objectsholder", or_object["logicalname"], hash_code);
	appendSanitizedOption("edit_objectsholder", or_object["logicalname"], hash_code);
	$("#objectsholder").select2();
	$("#edit_objectsholder").select2();

};


OpkeyRecorder.prototype.InitiateStepsAdd = function () {
	var stepholder_selectedkeyword = $('#stepsholder option:selected').val();
	var objectholder_selectedvalue = $('#objectsholder option:selected').val();
	var enetered_dataarguments = $("#dataholder").val();

	// neon will work here
	var orobject = _opkeyrecorder.GetObjectFromeObjectArray(objectholder_selectedvalue);
	_opkeyrecorder.AddStepFromSpy(stepholder_selectedkeyword, orobject, enetered_dataarguments, true, false);
	generateStepNo();
};

OpkeyRecorder.prototype.InitiateStepsEdit = function () {
	// ////debugger;
	var current_row_id = 0;
	var selectedrow = _opkeyrecorder.getSelectedRowOfGrid("mainstepgrid");
	// _opkeyrecorder.deleteRowFromGrid("mainstepgrid",selectedrow);
	current_row_id = selectedrow;
	if (selectedrow != 0) {
		selectedrow--;
	}
	var step_object = _opkeyrecorder.allrecordedstepsarray[selectedrow];
	var stepholder_selectedkeyword = $('#edit_stepsholder option:selected').val();
	var objectholder_selectedvalue = $('#edit_objectsholder option:selected').val();
	var enetered_dataarguments = $("#edit_dataholder").val();

	var orobject = _opkeyrecorder.GetObjectFromeObjectArray(objectholder_selectedvalue);
	step_object.Action = stepholder_selectedkeyword;
	step_object.ObjectData = orobject;
	step_object.Data = enetered_dataarguments;
	step_object.Object = orobject.logicalname;
	var _sistatus = _opkeyrecorder.CheckForSingletonKeyword(step_object);
	_opkeyrecorder.allrecordedstepsarray[selectedrow] = step_object;
	if (step_object["Object"] == "") {
		_opkeyrecorder.clearAllDataInGrid("orpropertygrid");
		$("#recorderLogicalName").val("");
	} else {
		_opkeyrecorder.updateOrGrid(orobject);
	}
	// Updating code to maingrid ui for bug id:79611
	_opkeyrecorder.updateRowInGrid();
	generateStepNo();
};

OpkeyRecorder.prototype.updateRowInGrid = function () {
	_opkeyrecorder.clearAllDataInGrid("mainstepgrid");
	for (var i = 0; i < _opkeyrecorder.allrecordedstepsarray.length; i++) {
		var stepObj = _opkeyrecorder.allrecordedstepsarray[i];
		_opkeyrecorder.addDataToRecorderStepGrid(i + 1, stepObj);
	}
};

OpkeyRecorder.prototype.InitializeStepEdit = function () {
	// ////debugger;
	var selectedrow = _opkeyrecorder.getSelectedRowOfGrid("mainstepgrid");
	if (selectedrow != 0) {
		selectedrow--;
	}
	// debugger;
	var selected_step_object = _opkeyrecorder.allrecordedstepsarray[selectedrow];
	var keyword_name = selected_step_object.Action;
	var data_arguments = selected_step_object.Data;
	var objectdata = selected_step_object.ObjectData;
	var hash_code = _opkeyrecorder.convertTohashCode(objectdata);
	$("#edit_stepsholder").val(keyword_name).change();
	var selected_text = $("#edit_stepsholder").find(":selected").text();
	if (selected_text == "") {
		$("#edit_stepsholder").val("Click").change();
	}
	$("#edit_objectsholder").val(hash_code).change();
	$("#edit_dataholder").val(data_arguments);
};

OpkeyRecorder.prototype.GetModeApplicableKeyWord = function (keyword_name) {
	if (keyword_name.indexOf("Image_") == 0) {
		return keyword_name;
	}
	var recording_mode = saas_object.GetGlobalSetting("RECORDING_MODE");
	if (recording_mode != null) {
		if (recording_mode.indexOf("Salesforce") > -1) {
			if (_opkeyrecorder.salesforce_keywords.indexOf(keyword_name) > -1) {
				keyword_name = "SF_" + keyword_name;
			}
		} else if (recording_mode.indexOf("Workday") > -1) {
			if (_opkeyrecorder.salesforce_keywords.indexOf(keyword_name) > -1) {
				keyword_name = "WD_" + keyword_name;
			}
		} else if (recording_mode.indexOf("Oracle Fusion") > -1) {
			if (_opkeyrecorder.salesforce_keywords.indexOf(keyword_name) > -1) {
				keyword_name = "OracleFusion_" + keyword_name;
			}
		}
		else if (recording_mode.indexOf("JDE") > -1) {
			if (_opkeyrecorder.salesforce_keywords.indexOf(keyword_name) > -1) {
				keyword_name = "JDE_" + keyword_name;
			}
		}
		else if (recording_mode.indexOf("ServiceNow") > -1) {
			if (_opkeyrecorder.salesforce_keywords.indexOf(keyword_name) > -1) {
				keyword_name = "ServiceNow_" + keyword_name;
			}
		}

		else if (recording_mode.indexOf("MSDynamics FSO") > -1) {
			if (_opkeyrecorder.salesforce_keywords.indexOf(keyword_name) > -1) {
				keyword_name = "MSDFSO_" + keyword_name;
			}
		}
		else if (recording_mode.indexOf("Coupa") > -1) {
			if (_opkeyrecorder.salesforce_keywords.indexOf(keyword_name) > -1) {
				keyword_name = "Coupa_" + keyword_name;
			}
		}
		else if (recording_mode.indexOf("Veeva Vault") > -1) {
			if (_opkeyrecorder.salesforce_keywords.indexOf(keyword_name) > -1) {
				keyword_name = "Veeva_" + keyword_name;
			}
		} else if (recording_mode.indexOf("MSDynamics") > -1) {
			if (_opkeyrecorder.salesforce_keywords.indexOf(keyword_name) > -1) {
				keyword_name = "MSD_" + keyword_name;
			}
		} else if (recording_mode.indexOf("SAP Fiori") > -1) {
			if (_opkeyrecorder.salesforce_keywords.indexOf(keyword_name) > -1) {
				keyword_name = "SAPFiori_" + keyword_name;
			}
		} else if (recording_mode.indexOf("SuccessFactors") > -1) {
			if (_opkeyrecorder.salesforce_keywords.indexOf(keyword_name) > -1) {
				keyword_name = "SAPSF_" + keyword_name;
			}
		} else if (recording_mode.indexOf("PeopleSoft") > -1) {
			if (_opkeyrecorder.salesforce_keywords.indexOf(keyword_name) > -1) {
				keyword_name = "PS_" + keyword_name;
			}
		} else if (recording_mode.indexOf("Kronos") > -1) {
			if (_opkeyrecorder.salesforce_keywords.indexOf(keyword_name) > -1) {
				keyword_name = "KRONOS_" + keyword_name;
			}
		} else if (recording_mode.indexOf("Microsoft WPF") > -1) {
			if (_opkeyrecorder.salesforce_keywords.indexOf(keyword_name) > -1) {
				keyword_name = "WPF_" + keyword_name;
			}
		}
	}
	return keyword_name;
};

OpkeyRecorder.prototype.GetApiNameAccordingToMetadata = function (simplified_objects_array, label_name) {
	// label_name=label_name.replace("\\*","");
	debugger;
	label_name = label_name.replace("*", "");
	label_name = label_name.replace(/\n/g, "");
	for (var m_o_i = 0; m_o_i < simplified_objects_array.length; m_o_i++) {
		var m_object = simplified_objects_array[m_o_i];
		if (m_object["Label"] == label_name) {
			return m_object;
		}
		if (m_object["Detail_Label"] == label_name) {
			return m_object;
		}
		if (m_object["ApiName"] == label_name) {
			return m_object;
		}
	}

	var label_name_2 = label_name.replace(":", "").trim();

	for (var m_o_i_1 = 0; m_o_i_1 < simplified_objects_array.length; m_o_i_1++) {
		var m_object = simplified_objects_array[m_o_i_1];
		if (m_object["Label"] == label_name_2) {
			return m_object;
		}
		if (m_object["Detail_Label"] == label_name_2) {
			return m_object;
		}
		if (m_object["ApiName"] == label_name_2) {
			return m_object;
		}
	}
}

OpkeyRecorder.prototype.GetVeevaApiNameAccordingToMetadata = function (simplified_objects_array, label_name) {
	label_name = label_name.replace("*", "");
	label_name = label_name.replace(/\n/g, "");

	for (var m_o_i = 0; m_o_i < simplified_objects_array.length; m_o_i++) {
		var m_object = simplified_objects_array[m_o_i];
		if (m_object["FieldLabel"] == label_name) {
			return m_object;
		}
		if (m_object["FieldName"] == label_name) {
			return m_object;
		}
	}
}

OpkeyRecorder.prototype.GetFusionMetadata = function (object_arguments, object_name, label_name) {
	var is_found = false;
	for (var of_i = 0; of_i < _opkeyrecorder.all_fusion_metadata.length; of_i++) {
		var fusion_object = _opkeyrecorder.all_fusion_metadata[of_i];
		var fuobject_name = fusion_object.ObjectName;
		var _title = fusion_object.title;
		var _pluraltitle = fusion_object.titlePlural;

		var _fusObjectname = _bgPage.GetFusionObjectName();
		if (_title == null) {
			_title = "";
		}

		if (_pluraltitle == null) {
			_pluraltitle = "";
		}
		if (_title.indexOf(_fusObjectname) > -1 || _pluraltitle.indexOf(_fusObjectname) > -1) {
			var _attributes = fusion_object.attributes;
			for (var at_i = 0; at_i < _attributes.length; at_i++) {
				var attr_object = _attributes[at_i];
				if (attr_object.title == label_name) {
					console.log(attr_object.name)
					object_arguments["metadata:ObjectName"] = fuobject_name;
					object_arguments["metadata:ApiName"] = attr_object.name;
					object_arguments["metadata:Type"] = attr_object.type;
					// object_arguments["metadata:Description"]=attr_object.annotations.description;
					is_found = true;
					break;
				}
			}

			if (is_found) {
				break;
			}
		}
	}
};


OpkeyRecorder.prototype.GetMetadatofQuickActions = function (step_object, quick_actionmetadata_array, label_name) {

	step_object.arguments[0]["SectionName"] = "NA";
	for (var q_a_i = 0; q_a_i < quick_actionmetadata_array.length; q_a_i++) {
		var q_metadata_object = quick_actionmetadata_array[q_a_i];
		// //debugger;
		if (q_metadata_object["label"].trim() == label_name.trim()) {
			if (q_metadata_object["section"] != null) {
				step_object.arguments[0]["SectionName"] = q_metadata_object["section"];
			} else {
				step_object.arguments[0]["SectionName"] = "NA"
			}

			if (q_metadata_object["apiName"] != null) {
				step_object.arguments[0]["APIName"] = q_metadata_object["apiName"];
			} else {
				step_object.arguments[0]["APIName"] = "NA"
			}
		}
	}
}

OpkeyRecorder.prototype.ToggleRightClickKeywords = function (keywords_type) {

	// neon will work here to add to test case.
	var step_1_object = $("#rightClickModalContent").attr("step_object");
	var temp_step_object = JSON.parse(step_1_object);
	var tag_name = "";
	var type_name = "";
	if (temp_step_object.arguments[0] != null) {
		if (temp_step_object.arguments[0]["tag"] != null) {
			tag_name = temp_step_object.arguments[0]["tag"];
		}
		if (temp_step_object.arguments[0]["input-type"] != null) {
			type_name = temp_step_object.arguments[0]["input-type"];
		}
		if (type_name == "") {
			if (temp_step_object.arguments[0]["type"] != null) {
				type_name = temp_step_object.arguments[0]["type"];
			}
		}
	}

	var keyprefix = "";
	var recording_mode = saas_object.GetGlobalSetting("RECORDING_MODE");
	if (recording_mode != null) {
		if (recording_mode.indexOf("SAP Fiori") > -1) {
			keyprefix = "SAPFiori_";
		}
	}
	var keyword_dropdown = $("#rightClickKeywords");
	keyword_dropdown.empty();
	if (keywords_type == "ActionKeywords") {
		var keywords_array = _opkeyrecorder.action_keywords.slice(0);
		for (var ak_i = 0; ak_i < keywords_array.length; ak_i++) {
			var action_keyword = keywords_array[ak_i];
			if (action_keyword.keyword.indexOf(keyprefix) == -1) {
				action_keyword.keyword = keyprefix + action_keyword.keyword;
			}
			if (action_keyword["tagName"] == tag_name && action_keyword["type"] == type_name) {
				appendSanitizedKeywordOption(keyword_dropdown, step_1_object, action_keyword);
			} else if (action_keyword["tagName"] == tag_name && action_keyword["type"] == "") {
				appendSanitizedKeywordOption(keyword_dropdown, step_1_object, action_keyword);
			} else if (action_keyword["tagName"] == "") {
				appendSanitizedKeywordOption(keyword_dropdown, step_1_object, action_keyword);

			}
		}
	} else if (keywords_type == "GetKeywords") {
		var keywords_array = _opkeyrecorder.get_keywords.slice(0);
		for (var gk_i = 0; gk_i < keywords_array.length; gk_i++) {
			var get_keyword = keywords_array[gk_i];
			if (get_keyword.keyword.indexOf(keyprefix) == -1) {
				get_keyword.keyword = keyprefix + get_keyword.keyword;
			}

		}
	} else if (keywords_type == "VerifyKeywords") {
		var keywords_array = _opkeyrecorder.verify_keywords.slice(0);
		for (var vk_i = 0; vk_i < keywords_array.length; vk_i++) {
			var verify_keyword = keywords_array[vk_i];
			if (verify_keyword.keyword.indexOf(keyprefix) == -1) {
				if (verify_keyword.keyword != "IsTextPresentOnScreen") {
					verify_keyword.keyword = keyprefix + verify_keyword.keyword;
				}
			}
			if (verify_keyword["tagName"] == tag_name && verify_keyword["type"] == type_name) {
				appendSanitizedKeywordOption(keyword_dropdown, step_1_object, verify_keyword);
			} else if (verify_keyword["tagName"] == tag_name && verify_keyword["type"] == "") {
				appendSanitizedKeywordOption(keyword_dropdown, step_1_object, verify_keyword);
			} else if (verify_keyword["tagName"] == "") {
				appendSanitizedKeywordOption(keyword_dropdown, step_1_object, verify_keyword);
			}


		}
	} else if (keywords_type == "SalesforceKeywords") {

		var keywords_array = _opkeyrecorder.salesforce_keyword.slice(0);
		for (var vk_i = 0; vk_i < keywords_array.length; vk_i++) {
			var salesforce_keyword = keywords_array[vk_i];
			if (salesforce_keyword["tagName"] == tag_name && salesforce_keyword["type"] == type_name) {
				appendSanitizedKeywordOption(keyword_dropdown, step_1_object, salesforce_keyword);
			} else if (salesforce_keyword["tagName"] == tag_name && salesforce_keyword["type"] == "") {
				appendSanitizedKeywordOption(keyword_dropdown, step_1_object, salesforce_keyword);
			} else if (salesforce_keyword["tagName"] == "") {
				appendSanitizedKeywordOption(keyword_dropdown, step_1_object, salesforce_keyword);
			}

		}
	} else if (keywords_type == "OracleFusionKeywords") {

		var keywords_array = _opkeyrecorder.oraclefusion_keyword.slice(0);
		for (var vk_i = 0; vk_i < keywords_array.length; vk_i++) {
			var oraclefusion_keyword = keywords_array[vk_i];
			if (oraclefusion_keyword["tagName"] == tag_name && oraclefusion_keyword["type"] == type_name) {
				appendSanitizedKeywordOption(keyword_dropdown, step_1_object, oraclefusion_keyword);
			} else if (oraclefusion_keyword["tagName"] == tag_name && oraclefusion_keyword["type"] == "") {
				appendSanitizedKeywordOption(keyword_dropdown, step_1_object, oraclefusion_keyword);
			} else if (oraclefusion_keyword["tagName"] == "") {
				appendSanitizedKeywordOption(keyword_dropdown, step_1_object, oraclefusion_keyword);
			}

		}
	} else if (keywords_type == "PeopleSoftKeywords") {

		var keywords_array = _opkeyrecorder.peoplesoft_keyword.slice(0);
		for (var vk_i = 0; vk_i < keywords_array.length; vk_i++) {
			var peoplesoft_keyword = keywords_array[vk_i];
			if (peoplesoft_keyword["tagName"] == tag_name && peoplesoft_keyword["type"] == type_name) {

				appendSanitizedKeywordOption(keyword_dropdown, step_1_object, peoplesoft_keyword);
			} else if (peoplesoft_keyword["tagName"] == tag_name && peoplesoft_keyword["type"] == "") {

				appendSanitizedKeywordOption(keyword_dropdown, step_1_object, peoplesoft_keyword);
			} else if (peoplesoft_keyword["tagName"] == "") {

				appendSanitizedKeywordOption(keyword_dropdown, step_1_object, peoplesoft_keyword);
			}

		}
	}

	_opkeyrecorder.isChangeTriggered = true;
	keyword_dropdown.change();
	_opkeyrecorder.isChangeTriggered = false;
	$("#rightClickKeywords").select2();
};

function appendSanitizedKeywordOption(dropdown, stepObject, keywordObj) {
	// 1) Resolve the dropdown element
	const selectEl =
		typeof dropdown === 'string'
			? document.querySelector(dropdown)
			: dropdown;

	// 2) Prepare sanitized strings
	const cleanKeyword = DOMPurify.sanitize(keywordObj.keyword);
	const cleanStepObj = DOMPurify.sanitize(JSON.stringify(stepObject));
	const cleanKeywordObj = encodeURIComponent(JSON.stringify(keywordObj));

	// 3) Create the <option>
	const optionEl = document.createElement('option');
	optionEl.value = cleanKeyword;                     // safely set value
	optionEl.textContent = cleanKeyword;               // auto-escaped text

	// 4) Attach your extra data as attributes
	optionEl.setAttribute('STEP_OBJECT', cleanStepObj);
	optionEl.setAttribute('KEYWORD_DATA', cleanKeywordObj);

	// 5) Append into the dropdown
	selectEl.appendChild(optionEl);
}

function appendSanitizedOption(selectId, rawText, value) {
	// 1) lookup the <select>
	const dropdownEl = document.getElementById(selectId);
	if (!dropdownEl) {
		console.warn(`No <select> with id="${selectId}" found.`);
		return;
	}

	// 2) create & populate the <option>
	const optionEl = document.createElement('option');
	const cleanText = DOMPurify.sanitize(rawText);
	const cleanValue = (value != null)
		? DOMPurify.sanitize(value)
		: cleanText;

	optionEl.value = cleanValue;
	optionEl.textContent = cleanText;

	// 3) append to the dropdown
	dropdownEl.appendChild(optionEl);
}

OpkeyRecorder.prototype.ProcessRightClickStep = function (step_object) {
	$("#rightClickModalContent").dialog("open");
	$("#rightClickKeywords_type").select2();
	$("#recomendedKeywordName").text(step_object.action);
	$("#recomendedLogicalName").text(step_object.arguments[0].logicalname);
	$("#rightClickKeywords_type").empty();
	$("#rightClickModalContent").attr("step_object", JSON.stringify(step_object));
	_opkeyrecorder.keywords_type = ["ActionKeywords", "VerifyKeywords", "GetKeywords"];
	var recording_mode = saas_object.GetGlobalSetting("RECORDING_MODE");
	if (recording_mode.indexOf("Salesforce") > -1) {
		_opkeyrecorder.keywords_type.push("SalesforceKeywords");
	} else if (recording_mode.indexOf("Oracle Fusion") > -1) {
		_opkeyrecorder.keywords_type.push("OracleFusionKeywords");
	} else if (recording_mode.indexOf("PeopleSoft") > -1) {
		_opkeyrecorder.keywords_type.push("PeopleSoftKeywords");
	}
	for (var rt_k = 0; rt_k < _opkeyrecorder.keywords_type.length; rt_k++) {
		appendSanitizedOption("rightClickKeywords_type", _opkeyrecorder.keywords_type[rt_k]);
	}
	_opkeyrecorder.RenderAllObjectAttributesInRightClick(step_object.arguments[0]);
	if (step_object.action.indexOf("SF_") == 0) {
		$("#rightClickKeywords_type").val("SalesforceKeywords");
		$("#rightClickKeywords_type").change();
		$("#rightClickKeywords").val(step_object.action);
		$("#rightClickKeywords").attr("isTriggered", true);
		_opkeyrecorder.isChangeTriggered = true;
		$("#rightClickKeywords").change();
		_opkeyrecorder.isChangeTriggered = false;
	} else if (step_object.action.indexOf("Oracle Fusion") == 0) {
		$("#rightClickKeywords_type").val("OracleFusionKeywords");
		$("#rightClickKeywords_type").change();
		$("#rightClickKeywords").val(step_object.action);
		$("#rightClickKeywords").attr("isTriggered", true);
		$("#rightClickKeywords").change();
	} else if (step_object.action.indexOf("PS_") == 0) {
		$("#rightClickKeywords_type").val("PeopleSoftKeywords");
		$("#rightClickKeywords_type").change();
		$("#rightClickKeywords").val(step_object.action);
		$("#rightClickKeywords").attr("isTriggered", true);
		$("#rightClickKeywords").change();
	} else {
		$("#rightClickKeywords_type").change();
	}

	if ($("#pause").hasClass("fa-pause")) {
		$("#pausePlayHolder").click();
		pausedByUser = false;
	}
};

OpkeyRecorder.prototype.AddRightClickDataToGrid = function (step_object) {
	var selected_step = $("#rightClickKeywords :selected").val();
	var rightclick_step_object = JSON.parse(step_object);
	rightclick_step_object["action"] = selected_step;
	rightclick_step_object["isAddedFromRightClick"] = "";
	var data_arguments = _opkeyrecorder.GetAllEnteredArguments();
	var data_tosend = JSON.stringify(data_arguments);
	if (data_tosend == "{}") {
		data_tosend = "";
	}
	rightclick_step_object["arguments"][1].data = data_tosend;
	if (rightclick_step_object["arguments"][0]["xpath:relative"] != null) {
		rightclick_step_object["arguments"][0]["xpath:idRelative"] = rightclick_step_object["arguments"][0]["xpath:relative"];
		rightclick_step_object["arguments"][0]["xpath:relative"] = "";
	}
	_opkeyrecorder.addAllDataToGrid([JSON.stringify(rightclick_step_object)], true, true, true);
};

OpkeyRecorder.prototype.CheckForSingletonKeyword = function (keyword_object) {
	var _ostatus = false;
	var _dstatus = false;
	for (var sik_l = 0; sik_l < _opkeyrecorder.keywords_info.length; sik_l++) {
		var current_keyword_object = _opkeyrecorder.keywords_info[sik_l];
		if (current_keyword_object["keywordname"] == keyword_object["Action"].replace("SF_", "").replace("WD_", "").replace("OracleFusion_", "")) {
			var _info = current_keyword_object["Info"];
			if (_info["r_object"] == false) {
				var _parent = keyword_object["ObjectData"]["parent"];
				var _newkeyword = new Object();
				_newkeyword["parent"] = _parent;
				keyword_object["ObjectData"] = _newkeyword;
				keyword_object["Object"] = "";
				_ostatus = true;
			}

			if (_info["r_data"] == false) {
				keyword_object["Data"] = "";
				_dstatus = true;
			}
		}

		if (_ostatus == true || _dstatus == true) {
			return true;
		}
	}
};

OpkeyRecorder.prototype.AddAuraClass = function (meta_object) {
	// debugger;
	var label_text = null;
	if (meta_object["label:text"]) {
		label_text = meta_object["label:text"];
	}

	if (meta_object["innertext"]) {
		label_text = meta_object["innertext"];
	}

	if (meta_object["LabelName"]) {
		label_text = meta_object["LabelName"];
	}
	if (label_text) {
		var xmlDoc = document.createElement("div");
		xmlDoc.innerHTML = _opkeyrecorder.aura_markup_xml_doc;
		var all_nodes = xmlDoc.getElementsByTagName("*");
		for (var _an = 0; _an < all_nodes.length; _an++) {
			var _node = all_nodes[_an];
			if (_node.getAttribute("label")) {
				if (_node.getAttribute("label") == label_text) {
					_node.innerHTML = "";
					var _outerHtml = _node.outerHTML;
					_outerHtml = _outerHtml.replace(/>/g, "&gt;").replace(/</g, "&lt;");
					meta_object["metadata:AuraClass"] = _outerHtml;
				}
			}
		}
	}
};

OpkeyRecorder.prototype.AddApexClassName = function (meta_object) {
	// //debugger;
	var object_name = "";
	var api_name = "";

	if (meta_object["metadata:S_CObject"] != null) {
		object_name = meta_object["metadata:S_CObject"]
	}

	if (meta_object["metadata:ApiName"] != null) {
		api_name = meta_object["metadata:ApiName"];
	}



	var expression_value = "{!" + object_name + "." + api_name + "}";
	if (_opkeyrecorder.apex_markup_xml_doc != "") {
		// debugger;
		_opkeyrecorder.apex_markup_xml_doc = _opkeyrecorder.apex_markup_xml_doc.replace(/apex:/g, '');
		var xmlDoc = document.createElement("div");
		xmlDoc.innerHTML = _opkeyrecorder.apex_markup_xml_doc;
		var all_nodes = xmlDoc.getElementsByTagName("*");
		for (var al_i = 0; al_i < all_nodes.length; al_i++) {
			var _apexnode = all_nodes[al_i];
			if (_apexnode.getAttribute("value") != null) {
				var _value = _apexnode.getAttribute("value");
				if (_value == expression_value) {
					var _outerHtml = _apexnode.outerHTML;
					_outerHtml = _outerHtml.replace(/>/g, "&gt;").replace(/</g, "&lt;");
					meta_object["metadata:ApexClass"] = _outerHtml;
					return;
				}
			}
		}

		var _label = meta_object["label:text"];
		_label = _label.replace("*", "");
		if (_label != null) {
			for (var al_i_0 = 0; al_i_0 < all_nodes.length; al_i_0++) {
				var _apexnode = all_nodes[al_i_0];
				if (_apexnode.getAttribute("label") != null) {
					var _value = _apexnode.getAttribute("label");
					if (_value == _label) {
						var _outerHtml = _apexnode.outerHTML;
						_outerHtml = _outerHtml.replace(">", "&gt;").replace("<", "&lt;");
						meta_object["metadata:ApexClass"] = _outerHtml;
						return;
					}
				}

				if (_apexnode.getAttribute("parsedLabel") != null) {
					var _value = _apexnode.getAttribute("parsedLabel");
					if (_value == _label) {
						var _outerHtml = _apexnode.outerHTML;
						_outerHtml = _outerHtml.replace(">", "&gt;").replace("<", "&lt;");
						meta_object["metadata:ApexClass"] = _outerHtml;
						return;
					}
				}
			}
		}

		if (api_name != "") {
			var expression_value_2 = api_name + "}";
			for (var al_i_0 = 0; al_i_0 < all_nodes.length; al_i_0++) {
				var _apexnode = all_nodes[al_i_0];
				if (_apexnode.getAttribute("value") != null) {
					var _value = _apexnode.getAttribute("value");
					if (_value.indexOf(expression_value_2) > -1) {
						var _outerHtml = _apexnode.outerHTML;
						_outerHtml = _outerHtml.replace(">", "&gt;").replace("<", "&lt;");
						meta_object["metadata:ApexClass"] = _outerHtml;
						return;
					}
				}
			}
		}

		for (var al_i_1 = 0; al_i_1 < all_nodes.length; al_i_1++) {
			var _apexnode = all_nodes[al_i_1];
			if (_apexnode.innerText.trim() == _label) {
				var _outerHtml = _apexnode.outerHTML;
				_outerHtml = _outerHtml.replace(">", "&gt;").replace("<", "&lt;");
				meta_object["metadata:ApexClass"] = _outerHtml;
				return;
			}
		}

		var _splitted_apex_markup

	}
}


OpkeyRecorder.prototype.getVisualValidationCheckpointObject = function () {
	if (this.isResponsiveRecorder() === false) {
		return null;
	}
	var selectwindowobject = new Object();
	selectwindowobject["Action"] = _opkeyrecorder.GetModeApplicableKeyWord("VisualValidation_CheckPoint");
	selectwindowobject["Object"] = "";
	selectwindowobject["Data"] = "";
	//	var object_arguments = new Object();
	//object_arguments["title"] = currenttile;
	//object_arguments["titleIndex"] = currenttileindex;
	//selectwindowobject["Data"] = JSON.stringify(object_arguments);
	var object_0 = new Object();
	selectwindowobject["ObjectData"] = object_0;
	return selectwindowobject;
};

function createUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

OpkeyRecorder.prototype.getVisualValidation_SetConfiguration = function (current_url) {
	if (this.isResponsiveRecorder() === false) {
		return null;
	}
	var selectwindowobject = new Object();
	selectwindowobject["Action"] = _opkeyrecorder.GetModeApplicableKeyWord("VisualValidation_SetConfiguration");
	selectwindowobject["Object"] = "";
	var object_arguments = new Object();
	object_arguments["ServerApiURL"] = "http://184.105.178.243:9297";
	object_arguments["BaselineName"] = "Baseline_" + createUUID();
	object_arguments["CreateBaseline"] = true;
	object_arguments["FullPageScreenshot"] = false;
	selectwindowobject["Data"] = JSON.stringify(object_arguments);
	var object_0 = new Object();
	var parent_1 = new Object();
	parent_1["url"] = current_url;
	object_0["parent"] = parent_1;
	selectwindowobject["ObjectData"] = object_0;
	return selectwindowobject;
};

OpkeyRecorder.prototype.getDeviceName = function () {
	if (this.isResponsiveRecorder() === false) {
		return null;
	}
	var deviceName = localStorage.getItem("OPKEY_RECORDER_BROWSER_RESOLUTION_DEVICE_NAME");
	if (deviceName == null) {
		return null;
	}
	return deviceName;
};

OpkeyRecorder.prototype.getBrowserResolution = function () {
	if (this.isResponsiveRecorder() === false) {
		return null;
	}
	var resolutionData = localStorage.getItem("OPKEY_RECORDER_BROWSER_RESOLUTION");
	if (resolutionData == null) {
		return null;
	}
	var resArray = resolutionData.split(":");
	var _width = resArray[0];
	var _height = resArray[1];

	var resData = new Object();
	resData["width"] = parseInt(_width);
	resData["height"] = parseInt(_height);
	return resData;
};

OpkeyRecorder.prototype.getWeb_ResizeBrowser = function (current_url) {
	if (this.isResponsiveRecorder() === false) {
		return null;
	}
	var resolutionData = _opkeyrecorder.getBrowserResolution();
	var deviceName = _opkeyrecorder.getDeviceName();
	var _width = resolutionData["width"];
	var _height = resolutionData["height"];
	var selectwindowobject = new Object();
	selectwindowobject["Action"] = _opkeyrecorder.GetModeApplicableKeyWord("Web_ResizeBrowser");
	selectwindowobject["Object"] = "";
	var object_arguments = new Object();
	object_arguments["Width"] = _width;
	object_arguments["Height"] = _height;
	object_arguments["Device"] = deviceName;
	selectwindowobject["Data"] = JSON.stringify(object_arguments);
	var object_0 = new Object();
	var parent_1 = new Object();
	parent_1["url"] = current_url;
	object_0["parent"] = parent_1;
	selectwindowobject["ObjectData"] = object_0;
	return selectwindowobject;
};

OpkeyRecorder.prototype.isResponsiveRecorder = function () {
	var recorderType = localStorage.getItem("OPKEY_RECORDER_TYPE");
	if (recorderType === null) {
		return false;
	}
	if (recorderType === "RESPONSIVE_RECORDER") {
		return true;
	}
	return false;
};

var sdata = "";
var lastRecordedUsername = "";
var lastRecordedUrl = "";
OpkeyRecorder.prototype.addAllDataToGrid = function (datas, require_selectwindow, require_objectadd, addInUI) {
	if (datas != null) {
		var datas_length = datas.length;
		if (datas_length > 0) {
			var focusedTabHandleId = -1;
			debugger;
			if (datas_length == 1) {
				var tabHandle = JSON.parse(datas[0])["TabHandle"];
				if (tabHandle != null) {
					focusedTabHandleId = tabHandle;
				}
			}

			if (datas_length == 2) {
				var tabHandle = JSON.parse(datas[0])["TabHandle"];
				if (tabHandle != null) {
					focusedTabHandleId = tabHandle;
				}
			}
			if (datas_length == 2) {
				var data_object_1 = JSON.parse(datas[0]);
				var data_object_2 = JSON.parse(datas[1]);
				if (data_object_1.action == "SF_GlobalSearch") {
					var dataargs_object_1 = data_object_1.arguments[1].data;
					dataargs_object_1 = JSON.parse(dataargs_object_1);
					dataargs_object_1 = dataargs_object_1.Value;
					if (data_object_2.action == "SF_GlobalSearchAndSelect") {
						var datobject_object_2 = data_object_2.arguments[1].data;
						datobject_object_2 = JSON.parse(datobject_object_2);
						datobject_object_2.ValueToSearch = dataargs_object_1;
						data_object_2.arguments[1].data = JSON.stringify(datobject_object_2);
						datas = [];
						datas.push(JSON.stringify(data_object_2));
					}
				}

				if (data_object_1.action == "SF_SearchAndSelect") {
					if (data_object_2.action == "SF_SearchAndSelect") {
						datas = [];
						datas.push(JSON.stringify(data_object_2));
					}
				}

				if (data_object_1["IsCapturedKeyword"] == null) {
					if (data_object_1.action == "click") {
						if (data_object_2.action == "setValue") {
							datas = [];
							datas.push(JSON.stringify(data_object_2));
							datas.push(JSON.stringify(data_object_1));
						}
						else if (data_object_2.action == "TypeSecureText") {
							datas = [];
							datas.push(JSON.stringify(data_object_2));
							datas.push(JSON.stringify(data_object_1));
						}
					}
				}
			}
			if (datas_length > 2) {
				let datas_temp = [];
				let index = 0;
				while (index < datas_length) {
					let isDuplicate = false;
					let jIndex = 0;
					while (jIndex < datas_temp.length) {
						let datas_obj = JSON.parse(datas[index]);
						let datas_temp_obj = JSON.parse(datas_temp[jIndex]);
						if (datas_obj.action == datas_temp_obj.action) {
							isDuplicate = true;
							break;
						}
						jIndex++;
					}

					if (!isDuplicate) {
						datas_temp.push(datas[index]);
					}
					index++;
				}
				datas_temp = datas_temp.reverse();
				datas = [];
				datas = datas_temp;
			}

			var alldatas = datas;

			for (var rowno = 0; rowno < alldatas.length; rowno++) {
				var stobject = alldatas[rowno];
				recorder_processDataForGrid(JSON.parse(stobject), require_selectwindow, require_objectadd, addInUI, focusedTabHandleId);
			}
			if (focusedTabHandleId > -1) {
				currentTabHandleId = focusedTabHandleId;
			}
			//add neon here
		}
	}
};


function recorder_processDataForGrid(stobject, require_selectwindow, require_objectadd, addInUI, focusedTabHandleId) {
	if (firstAction == null) {
		firstAction = stobject.action;
		firstTimeStamp = new Date(stobject["timestamp"]).getTime();
	}
	else if (SecondAction == null) {
		SecondAction = stobject.action;
		SecondTimeStamp = new Date(stobject["timestamp"]).getTime();
	}
	else {
		var tempAction = stobject.action;
		var tempTimeStamp = new Date(stobject["timestamp"]).getTime();
		var diff = tempTimeStamp - firstTimeStamp;
		var diffSec = tempTimeStamp - SecondTimeStamp;

		if (tempAction == firstAction && (tempTimeStamp - firstTimeStamp) < 500 && tempAction == "click") {
			return;
		}
		else if (tempAction == SecondAction && (tempTimeStamp - SecondTimeStamp) < 500 && tempAction == "click") {
			return;
		}
		else {
			firstAction = SecondAction;
			firstTimeStamp = SecondTimeStamp;
			SecondAction = tempAction;
			SecondTimeStamp = tempTimeStamp;
		}
	}
	var isEbsForm = false;
	var data = new Object();
	var action = stobject.action;
	var tagname = "";

	var _ltrecResponse = "";
	if (stobject["requestId"] != null) {
		_ltrecResponse = stobject["requestId"];
	}
	if (lastLogicalName == null) {
		lastLogicalName = "";
	}

	if (action.indexOf("OracleLT_") > -1) {
		var pattern = /[{}][0-9]+[}]/g;
		lastLogicalName = lastLogicalName.replace(pattern, "");
		stobject.arguments[0]["logicalname"] = lastLogicalName;
	}
	hideOracleEBSLoadTestingKeyword = false;

	if (action.indexOf("OracleLT_") > -1) {
		hideOracleEBSLoadTestingKeyword = true;
		if (loadtestingkeywordadded == false) {
			loadtestingkeywordadded = true;

			var initializeformwobject = new Object();
			initializeformwobject["Action"] = _opkeyrecorder.GetModeApplicableKeyWord("OracleLT_InitializeForm");
			initializeformwobject["Object"] = lastLogicalName;
			var object_arguments = new Object();
			initializeformwobject["Data"] = "";
			initializeformwobject["ObjectData"] = new Object();
			initializeformwobject["TimeStamp"] = getCurrentTimeStamp();
			_opkeyrecorder.allrecordedstepsarray.push(initializeformwobject);
			if (addInUI) {
				_opkeyrecorder.addDataToRecorderStepGrid(_opkeyrecorder.allrecordedstepsarray.length, initializeformwobject);
			}

			if (oracleEbsLaunchFormUrl != null) {
				debugger
				lastRecordedUrl = "";
				var _data = oracleEbsLaunchFormUrl;
				_data = _data.replace("//", "OPKEYDOUBLESLASH")
				var _dataArray = _data.split("/");
				var _url = _dataArray[0];
				_url = _url.replace("OPKEYDOUBLESLASH", "//");
				lastRecordedUrl = _url;
				var launchformwobject = new Object();
				launchformwobject["Action"] = _opkeyrecorder.GetModeApplicableKeyWord("OracleLT_JavaAction");
				launchformwobject["Object"] = lastLogicalName;
				launchformwobject["ObjectData"] = new Object();
				var launchformobject_arguments = new Object();
				launchformobject_arguments["HandlerId"] = "0";
				launchformobject_arguments["MethodName"] = "LaunchForm";
				launchformobject_arguments["Data"] = oracleEbsLaunchFormUrl;

				launchformwobject["Data"] = JSON.stringify(launchformobject_arguments);

				launchformwobject["TimeStamp"] = getCurrentTimeStamp();
				_opkeyrecorder.allrecordedstepsarray.push(launchformwobject);
				if (addInUI) {
					_opkeyrecorder.addDataToRecorderStepGrid(_opkeyrecorder.allrecordedstepsarray.length, launchformwobject);
				}
				oracleEbsLaunchFormUrl = null;
			}


			var loginformwobject = new Object();
			loginformwobject["Action"] = _opkeyrecorder.GetModeApplicableKeyWord("OracleLT_LoginToEbsServer");
			loginformwobject["Object"] = lastLogicalName;
			loginformwobject["ObjectData"] = new Object();
			var loginformobject_arguments = new Object();
			loginformobject_arguments["Url"] = lastRecordedUrl;
			loginformobject_arguments["Username"] = lastRecordedUsername;
			loginformobject_arguments["Sdata"] = DOMPurify.sanitize(sdata);
			loginformwobject["Data"] = JSON.stringify(loginformobject_arguments);

			loginformwobject["TimeStamp"] = getCurrentTimeStamp();
			_opkeyrecorder.allrecordedstepsarray.push(loginformwobject);
			if (addInUI) {
				_opkeyrecorder.addDataToRecorderStepGrid(_opkeyrecorder.allrecordedstepsarray.length, loginformwobject);
			}

		}
	}

	if (stobject.arguments[0]["EBSForms"] != null) {
		isEbsForm = true;
		stobject.arguments[0]["EBSForms"] = "";
	}

	if (isEbsForm === true) {
		if (action.indexOf("Oracle_") == -1 && action.indexOf("Win_") == -1) {
			action = "Oracle_" + action;
			stobject.action = action;
		}
	}

	if (stobject.arguments[0]["tag"] != null) {
		tagname = stobject.arguments[0].tag;
	} else {
		tagname = stobject.arguments[0]["class"];
	}
	var parent_object = stobject.arguments[0]["parent"];
	var parent_hierarchy = _opkeyrecorder.GetParentHierarchy(parent_object);
	if (parent_hierarchy != null) {
		parent_object["parent"] = parent_hierarchy;
	}

	if (stobject.arguments[0]["href"] != null) {
		if (stobject.arguments[0]["href"].indexOf("#opkeyjavascript:launchForm") > -1) {
			oracleEbsLaunchFormUrl = stobject.arguments[0]["href"].replaceAll("#opkeyjavascript:launchForm('", "").replaceAll("')", "");
		}
	}
	if (stobject.arguments[0]["dom:index"] != null) {
		stobject.arguments[0]["dom:index"] = "";
	}

	if (stobject.arguments[0]["logicalname"] != null) {
		stobject.arguments[0]["logicalname"] = stobject.arguments[0]["logicalname"].replace("HelpTarget Object cannot be changed while adding/editing the field conditions.", "");
	}

	if (stobject.arguments[0]["OF:label:text"] != null) {
		stobject.arguments[0]["logicalname"] = stobject.arguments[0]["OF:label:text"];
		_opkeyrecorder.GetFusionMetadata(stobject.arguments[0], "", stobject.arguments[0]["OF:label:text"])
	}

	//Neon Will Work Here

	if (stobject.arguments[0]["label:text"] != null) {
		var label_content = stobject.arguments[0]["label:text"];
		label_content = label_content.replace("HelpTarget Object cannot be changed while adding/editing the field conditions.", "");
		stobject.arguments[0]["label:text"] = label_content;
		var meta_object = _opkeyrecorder.GetApiNameAccordingToMetadata(_opkeyrecorder.salesforce_metdata_array, label_content);
		$.each(meta_object, function (key, value) {
			stobject.arguments[0]["metadata:" + key] = value;
		});
		_opkeyrecorder.AddApexClassName(stobject.arguments[0]);
		_opkeyrecorder.AddAuraClass(stobject.arguments[0]);
	}

	if (stobject.arguments[0]["VV:MetadataObject:Name"] != null) {
		var label_content = stobject.arguments[0]["VV:MetadataObject:Name"];
		stobject.arguments[0]["VV:MetadataObject:Name"] = label_content;
		var meta_object = _opkeyrecorder.GetVeevaApiNameAccordingToMetadata(_opkeyrecorder.veeva_metdata_array, label_content);
		$.each(meta_object, function (key, value) {
			stobject.arguments[0]["Veeva:Metadata:" + key] = value;
		});
	} else if (stobject.arguments[0]["VV:label:text"] != null) {
		var label_content = stobject.arguments[0]["VV:label:text"];
		stobject.arguments[0]["VV:label:text"] = label_content;
		var meta_object = _opkeyrecorder.GetVeevaApiNameAccordingToMetadata(_opkeyrecorder.veeva_metdata_array, label_content);
		$.each(meta_object, function (key, value) {
			stobject.arguments[0]["Veeva:Metadata:" + key] = value;
		});
	}

	if (stobject.arguments[0]["xpath:relative"] == null) {
		if (stobject.arguments[0]["xpath:idRelative"] != null) {
			stobject.arguments[0]["xpath:relative"] = stobject.arguments[0]["xpath:idRelative"];
			stobject.arguments[0]["xpath:idRelative"] = "";
		}
	}

	if (stobject.arguments[0]["xpath:relative"] != null) {
		stobject.arguments[0]["css"] = _opkeyrecorder.cssify(stobject.arguments[0]["xpath:relative"]);
	} else if (stobject.arguments[0]["xpath:href"] != null) {
		stobject.arguments[0]["css"] = _opkeyrecorder.cssify(stobject.arguments[0]["xpath:href"]);
	} else if (stobject.arguments[0]["xpath:link"] != null) {
		stobject.arguments[0]["css"] = _opkeyrecorder.cssify(stobject.arguments[0]["xpath:link"]);
	} else if (stobject.arguments[0]["xpath:position"] != null) {
		stobject.arguments[0]["css"] = _opkeyrecorder.cssify(stobject.arguments[0]["xpath:position"]);
	}
	if (stobject.arguments[0]["link"] != null) {
		stobject.arguments[0]["link"] = stobject.arguments[0]["link"].replace("link=", "");
	}

	if (stobject.arguments[0]["pageindex"] == null) {
		if (stobject.arguments[0]["index"] != null) {
			stobject.arguments[0]["pageindex"] = stobject.arguments[0]["index"];
			stobject.arguments[0]["index"] = "0";
		}
	}

	if (stobject.arguments[0]["ObjectImage"] != null) {
		// stobject.arguments[0]["ObjectImage"] =
		// _opkeyrecorder.object_image;
	}

	var typeofobject = stobject.arguments[0].type;
	var valueofobject = stobject.arguments[0].value;
	var actionofopkey = _opkeyrecorder.mapActionOfWebRecorder(action, tagname, typeofobject, valueofobject);
	var currenttile = stobject.arguments[0].parent.title;
	if (currenttile == null) {
		currenttile = "";
	}
	var _fusionHeader = stobject.arguments[0]["OF:Header"];
	if (actionofopkey == "SelectCheckBox") {
		stobject.arguments[1].data = "On";
	}

	if (actionofopkey == "Oracle_CloseForm") {
		var closeformobject = new Object();
		var closeFormData = stobject.arguments[1].data;
		var closeformTitle = "";
		var closeformTitleIndex = "0";
		if (closeFormData != null) {
			closeFormData = closeFormData.substring(1, closeFormData.length - 1);
			var splitedData = closeFormData.split(",");
			closeformTitle = splitedData[0].trim().replaceAll("'", "");
			closeformTitleIndex = splitedData[1].trim();
		}
		closeformobject["Action"] = _opkeyrecorder.GetModeApplicableKeyWord("Oracle_CloseForm");
		closeformobject["Object"] = "";
		var object_arguments = new Object();
		object_arguments["Title"] = closeformTitle;
		if (closeformTitleIndex == null || closeformTitleIndex == "") {
			object_arguments["TitleIndex"] = 0;
		} else {
			object_arguments["TitleIndex"] = parseInt(closeformTitleIndex);
		}
		closeformobject["Data"] = JSON.stringify(object_arguments);
		var object_0 = new Object();
		var parent_1 = new Object();
		parent_1["url"] = current_url;
		object_0["parent"] = parent_1;
		closeformobject["ObjectData"] = object_0;
		closeformobject["TimeStamp"] = getCurrentTimeStamp();
		_opkeyrecorder.allrecordedstepsarray.push(closeformobject);
		_opkeyrecorder.addDataToRecorderStepGrid(_opkeyrecorder.allrecordedstepsarray.length, closeformobject);
		return;
	}

	// sales force keyword

	if (stobject.arguments[0]["type"] != null) {
		stobject.arguments[0]["input-type"] = stobject.arguments[0]["type"];
		stobject.arguments[0]["type"] = "";
	}

	if (actionofopkey == "TypeSecureText") {
		if (stobject.arguments[0]["value"] != null) {
			stobject.arguments[0]["value"] = "";
		}
	}

	if (stobject["isAddedFromRightClick"] != null) {
		if (stobject["isAddedFromRightClick"] == true) {
			var new_cloned_stobject = JSON.stringify(stobject);
			new_cloned_stobject = JSON.parse(new_cloned_stobject);
			_opkeyrecorder.right_click_keyword_image = new_cloned_stobject.arguments[0]["ObjectImage"];
			var temp_action = actionofopkey;
			if (temp_action == "TypeSecureText") {
				temp_action = "TypeTextOnEditBox";
			}
			new_cloned_stobject["action"] = _opkeyrecorder.GetModeApplicableKeyWord(temp_action);
			_opkeyrecorder.ProcessRightClickStep(new_cloned_stobject);
			return;
		}
	}

	if (stobject.arguments[0]["IsSikuliKeyword"] == null && isEbsForm == false) {
		var currenttileindex = stobject.arguments[0].parent.titleindex;
		var current_url = stobject.arguments[0].parent.url;
		// NEON WILL WORK HERE
		if (_opkeyrecorder.allrecordedstepsarray.length > 0) {
			if (_opkeyrecorder.document_url != current_url) {
				var syncbrowser_object = new Object();
				syncbrowser_object["Action"] = _opkeyrecorder.GetModeApplicableKeyWord("SyncBrowser");
				syncbrowser_object["Object"] = "";
				syncbrowser_object["Data"] = "";
				var object_0 = new Object();
				var parent_1 = new Object();
				parent_1["url"] = current_url;
				object_0["parent"] = parent_1;
				syncbrowser_object["ObjectData"] = object_0;
				syncbrowser_object["TimeStamp"] = getCurrentTimeStamp();
				//_opkeyrecorder.allrecordedstepsarray.push(syncbrowser_object);
				if (addInUI) {
					//	_opkeyrecorder.addDataToRecorderStepGrid(_opkeyrecorder.allrecordedstepsarray.length, syncbrowser_object);
				}
			}
		}
		_opkeyrecorder.document_url = current_url
		//Neon Will Work here
		if (_opkeyrecorder.allrecordedstepsarray.length == 0) {
			var _resizeBrowserKeword = _opkeyrecorder.getWeb_ResizeBrowser(current_url);
			if (_resizeBrowserKeword != null) {
				_resizeBrowserKeword["TimeStamp"] = getCurrentTimeStamp();
				_opkeyrecorder.allrecordedstepsarray.push(_resizeBrowserKeword);
				if (addInUI) {
					_opkeyrecorder.addDataToRecorderStepGrid(_opkeyrecorder.allrecordedstepsarray.length, _resizeBrowserKeword);
				}
			}

			var _setConfigurationKeword = _opkeyrecorder.getVisualValidation_SetConfiguration(current_url);
			if (_setConfigurationKeword != null) {
				_setConfigurationKeword["TimeStamp"] = getCurrentTimeStamp();
				_opkeyrecorder.allrecordedstepsarray.push(_setConfigurationKeword);
				if (addInUI) {
					_opkeyrecorder.addDataToRecorderStepGrid(_opkeyrecorder.allrecordedstepsarray.length, _setConfigurationKeword);
				}
			}
		}

		if (_opkeyrecorder.selectwindow_ignoredkeywords.indexOf(action) == -1) {
			if (require_selectwindow == true) {
				if (focusedTabHandleId > -1 && focusedTabHandleId != currentTabHandleId) {
					if (_opkeyrecorder.allrecordedstepsarray.length > 0) {
						var selectwindowobject = new Object();
						console.log("SelectWindow condition 1");
						selectwindowobject["Action"] = _opkeyrecorder.GetModeApplicableKeyWord("SelectWindow");
						selectwindowobject["Object"] = "";
						var object_arguments = new Object();
						object_arguments["Title"] = currenttile;
						object_arguments["TitleIndex"] = currenttileindex;
						selectwindowobject["Data"] = JSON.stringify(object_arguments);
						var object_0 = new Object();
						var parent_1 = new Object();
						parent_1["url"] = current_url;
						object_0["parent"] = parent_1;
						selectwindowobject["ObjectData"] = object_0;
						selectwindowobject["TimeStamp"] = getCurrentTimeStamp();
						if (currenttile !== "") {
							_opkeyrecorder.allrecordedstepsarray.push(selectwindowobject);
							if (addInUI) {
								_opkeyrecorder.addDataToRecorderStepGrid(_opkeyrecorder.allrecordedstepsarray.length, selectwindowobject);
							}
						}
						var _checkPointObject = _opkeyrecorder.getVisualValidationCheckpointObject();
						if (_checkPointObject) {
							_checkPointObject["TimeStamp"] = getCurrentTimeStamp();
							if (currenttile !== "") {
								debugger
								_opkeyrecorder.allrecordedstepsarray.push(_checkPointObject);
								if (addInUI) {
									_opkeyrecorder.addDataToRecorderStepGrid(_opkeyrecorder.allrecordedstepsarray.length, _checkPointObject);
								}
							}
						}
					}
				} else if (_opkeyrecorder.currentwindowindex != currenttileindex) {
					var selectwindowobject = new Object();
					if (_opkeyrecorder.allrecordedstepsarray.length > 0) {
						debugger
						if (focusedTabHandleId > -1 && focusedTabHandleId != currentTabHandleId) {
							console.log("SelectWindow condition 2");
							selectwindowobject["Action"] = _opkeyrecorder.GetModeApplicableKeyWord("SelectWindow");
							selectwindowobject["Object"] = "";
							var object_arguments = new Object();
							object_arguments["Title"] = currenttile;
							object_arguments["TitleIndex"] = currenttileindex;
							selectwindowobject["Data"] = JSON.stringify(object_arguments);
							var object_0 = new Object();
							var parent_1 = new Object();
							parent_1["url"] = current_url;
							object_0["parent"] = parent_1;
							selectwindowobject["ObjectData"] = object_0;
							selectwindowobject["TimeStamp"] = getCurrentTimeStamp();
							if (currenttile !== "") {
								_opkeyrecorder.allrecordedstepsarray.push(selectwindowobject);
								if (addInUI) {
									_opkeyrecorder.addDataToRecorderStepGrid(_opkeyrecorder.allrecordedstepsarray.length, selectwindowobject);
								}
							}
						}
					}
				} else if (_opkeyrecorder.currentwindowtitle == currenttile) {
					if (_opkeyrecorder.currentwindowindex != currenttileindex) {
						var selectwindowobject = new Object();
						if (_opkeyrecorder.allrecordedstepsarray.length > 0) {
							debugger
							if (focusedTabHandleId > -1 && focusedTabHandleId != currentTabHandleId) {
								console.log("SelectWindow condition 3");
								selectwindowobject["Action"] = _opkeyrecorder.GetModeApplicableKeyWord("SelectWindow");
								selectwindowobject["Object"] = "";
								var object_arguments = new Object();
								object_arguments["Title"] = currenttile;
								object_arguments["TitleIndex"] = currenttileindex;
								selectwindowobject["Data"] = JSON.stringify(object_arguments);
								selectwindowobject["ObjectData"] = "";
								selectwindowobject["TimeStamp"] = getCurrentTimeStamp();
								if (currenttile !== "") {
									_opkeyrecorder.allrecordedstepsadebuggerrray.push(selectwindowobject);
									if (addInUI) {
										_opkeyrecorder.addDataToRecorderStepGrid(_opkeyrecorder.allrecordedstepsarray.length, selectwindowobject);
									}
								}
							}
						}
					}
				}
			}
		}
		if (currenttile !== "") {
			_opkeyrecorder.currentwindowtitle = currenttile;
		}
		_opkeyrecorder.currentwindowindex = currenttileindex;
		if (focusedTabHandleId > -1) {
			currentTabHandleId = focusedTabHandleId;
		}
	}

	var recordingMode = saas_object.GetGlobalSetting("RECORDING_MODE");

	if (_fusionHeader && recordingMode != null && recordingMode == "Oracle Fusion") {
		if (_fusionHeader != _opkeyrecorder.fusionHeaderTitle) {
			if (_opkeyrecorder.allrecordedstepsarray.length > 0) {
				debugger
				var selectpageobject = new Object();
				selectpageobject["Action"] = "OracleFusion_SelectPage";
				selectpageobject["Object"] = "";
				var object_arguments = new Object();
				object_arguments["PageTitle"] = _opkeyrecorder.currentwindowtitle;
				object_arguments["PageHeader"] = _fusionHeader;
				selectpageobject["Data"] = JSON.stringify(object_arguments);
				selectpageobject["ObjectData"] = "";
				selectpageobject["TimeStamp"] = getCurrentTimeStamp();
				_opkeyrecorder.allrecordedstepsarray.push(selectpageobject);
				if (addInUI) {
					_opkeyrecorder.addDataToRecorderStepGrid(_opkeyrecorder.allrecordedstepsarray.length, selectpageobject);
				}
			}
		}
		_opkeyrecorder.fusionHeaderTitle = _fusionHeader;
	}

	data["Object"] = stobject.arguments[0].logicalname;

	lastLogicalName = data["Object"];
	if (actionofopkey == "TypeSecureText" || actionofopkey == "Win_TypeSecureText") {
		data["Data"] = "********";
		sdata = stobject.arguments[1].data;
		stobject.arguments[0]["unencryptedData"] = stobject.arguments[1].data;
	} else {
		if (stobject.arguments[1].data != null && stobject.arguments[1].data != "") {
			lastRecordedUsername = stobject.arguments[1].data;
		}
		data["Data"] = stobject.arguments[1].data;
	}

	data["Action"] = _opkeyrecorder.GetModeApplicableKeyWord(actionofopkey);
	data["ObjectData"] = stobject.arguments[0];

	if (require_objectadd) {
		var object_to_be_added_in_add_dialog = stobject.arguments[0];
		_opkeyrecorder.AddObjectInAddStepDialog(object_to_be_added_in_add_dialog);
	}

	_opkeyrecorder.ModifyAndCreateDynamicOr(data);
	var object_data = data.ObjectData;
	if (object_data != null) {
		if (object_data != "") {
			var _label = null;
			if (object_data["LabelName"]) {
				_label = object_data["LabelName"];
			} else if (object_data["labelName"]) {
				_label = object_data["labelName"];
			} else if (object_data["DateEvent"]) {
				_label = object_data["DateEvent"];
			} else if (object_data["TimeEvent"]) {
				_label = object_data["TimeEvent"];
			}

			if (_label != null) {
				var meta_object = _opkeyrecorder.GetApiNameAccordingToMetadata(_opkeyrecorder.salesforce_metdata_array, _label);
				$.each(meta_object, function (key, value) {
					object_data["metadata:" + key] = value;
				});
			}
			_opkeyrecorder.AddAuraClass(object_data);
		}
	}


	if (actionofopkey == "SF_ClickOnQuickAction") {
		var action_name = stobject.arguments[0]["ActionName"];
		_opkeyrecorder.GetMetadatofQuickActions(stobject, _opkeyrecorder.salesforce_quickaction_metdata_array, action_name);
		data["ObjectData"] = stobject.arguments[0];
	}
	_opkeyrecorder.CheckForSingletonKeyword(data);
	data["TimeStamp"] = getCurrentTimeStamp();
	if (_ltrecResponse != null) {
		data["LTResponse"] = _ltrecResponse;
	}

	if (stobject["WebLT:ResponseString"] != null) {
		data["WebLT:ResponseString"] = stobject["WebLT:ResponseString"];
	}

	if (stobject["WebLT:RequestHeaders"] != null) {
		data["WebLT:RequestHeaders"] = stobject["WebLT:RequestHeaders"];
	}

	if (stobject["WebLT:RequestData"] != null) {
		data["WebLT:RequestData"] = stobject["WebLT:RequestData"];
	}

	if (stobject["WebLT:RequestMethod"] != null) {
		data["WebLT:RequestMethod"] = stobject["WebLT:RequestMethod"];
	}

	if (stobject["WebLT:RequestUrl"] != null) {
		data["WebLT:RequestUrl"] = stobject["WebLT:RequestUrl"];
	}

	_opkeyrecorder.allrecordedstepsarray.push(data);
	if (addInUI) {
		_opkeyrecorder.addDataToRecorderStepGrid(_opkeyrecorder.allrecordedstepsarray.length, data);
	}
	// _opkeyrecorder.RefreshDataIngridAndAssignId("mainstepgrid");
	chrome.runtime.sendMessage({
		setDockerCommand_stepcount: _opkeyrecorder.allrecordedstepsarray.length
	}, function (response) {
		if (chrome.runtime.lastError) { }
	});

}

OpkeyRecorder.prototype.CreateDynamicOrKeyword = function (keyword_name, arguments_array) {
	var dynamic_or = new Object();
	dynamic_or["Action"] = keyword_name;
	dynamic_or["DynamicArguments"] = arguments_array;
	_opkeyrecorder.dynamic_or_keywords.push(dynamic_or);
}

OpkeyRecorder.prototype.ModifyAndCreateDynamicOr = function (step_object) {
	// ////debugger;
	var action_1 = step_object.Action;
	var current_dr_keyword = null;
	for (var dyn_o = 0; dyn_o < _opkeyrecorder.dynamic_or_keywords.length; dyn_o++) {
		var temp_dr_object = _opkeyrecorder.dynamic_or_keywords[dyn_o];
		if (temp_dr_object.Action == action_1) {
			current_dr_keyword = temp_dr_object;
			break;
		}
	}
	if (current_dr_keyword != null) {
		var data_1 = step_object.Data;
		var dr_arguments = current_dr_keyword["DynamicArguments"];
		var temp_dr_arguments = [];
		for (var d_a = 0; d_a < dr_arguments.length; d_a++) {
			temp_dr_arguments.push(dr_arguments[d_a].toLowerCase());
		}
		if (data_1.indexOf("{") == 0) {
			var objectdata_1 = step_object.ObjectData;
			data_1 = JSON.parse(data_1);
			var new_data_arguments = new Object();
			$.each(data_1, function (key, value) {
				if (temp_dr_arguments.indexOf(key.toLowerCase()) > -1) {
					// found
					var r_index = temp_dr_arguments.indexOf(key.toLowerCase());
					var real_key = dr_arguments[r_index];
					if (real_key == "LabelName") {
						value = value.replace("HelpTarget Object cannot be changed while adding/editing the field conditions.", "");
					}
					objectdata_1[real_key] = value;
				} else {
					// not found
					new_data_arguments[key] = value;
				}
			});
			var new_stringifid_data = JSON.stringify(new_data_arguments);
			if (new_stringifid_data == "{}") {
				new_stringifid_data = "";
			}
			step_object.Data = new_stringifid_data;
		}
	}
};


OpkeyRecorder.prototype.addAllDataToDomGrid = function (datas) {
	if (datas != null) {
		if (isMobileRecording() == false) {
			if (_opkeyrecorder.modal_dialog_opened == false) {
				var spy_element = document.getElementById("spy");
				spy_element.childNodes[0].click();
			}
		}
		var alldatas = "[" + datas + "]";
		if (isMobileRecording()) {
			alldatas = datas;
		}
		alldatas = JSON.parse(alldatas);
		alldatas.reverse();
		_opkeyrecorder.allrecordeddomssarray = [];
		_opkeyrecorder.clearAllDataInGrid("spydomgrid");
		for (var rowno = 0; rowno < alldatas.length; rowno++) {
			var domobject = alldatas[rowno];
			var parent_object = domobject["parent"];
			var parent_hierarchy = _opkeyrecorder.GetParentHierarchy(parent_object);
			if (parent_hierarchy != null) {
				parent_object["parent"] = parent_hierarchy;
			}
			if (domobject["dom:index"] != null) {
				domobject["dom:index"] = "";
			}
			if (domobject["xpath:idRelative"] != null) {
				domobject["xpath:relative"] = domobject["xpath:idRelative"];
				domobject["xpath:idRelative"] = "";
			}
			if (domobject["xpath:relative"] != null) {
				domobject["css"] = _opkeyrecorder.cssify(domobject["xpath:relative"]);
			} else if (domobject["xpath:href"] != null) {
				domobject["css"] = _opkeyrecorder.cssify(domobject["xpath:href"]);
			} else if (domobject["xpath:link"] != null) {
				domobject["css"] = _opkeyrecorder.cssify(domobject["xpath:link"]);
			} else if (domobject["xpath:position"] != null) {
				domobject["css"] = _opkeyrecorder.cssify(domobject["xpath:position"]);
			}

			if (domobject["link"] != null) {
				domobject["link"] = domobject["link"].replace("link=", "");
			}

			if (domobject["index"] != null) {
				domobject["pageindex"] = domobject["index"]
				domobject["index"] = "0";
			}

			if (domobject["label:text"] != null) {
				var label_content = domobject["label:text"];
				var meta_object = _opkeyrecorder.GetApiNameAccordingToMetadata(_opkeyrecorder.salesforce_metdata_array, label_content);
				$.each(meta_object, function (key, value) {
					domobject["metadata:" + key] = value;
				});
				_opkeyrecorder.AddApexClassName(domobject);
				_opkeyrecorder.AddAuraClass(domobject);
			} else if (domobject["label:placeholder"] != null) {
				var label_content = domobject["label:placeholder"];
				var meta_object = _opkeyrecorder.GetApiNameAccordingToMetadata(_opkeyrecorder.salesforce_metdata_array, label_content);
				$.each(meta_object, function (key, value) {
					domobject["metadata:" + key] = value;
				});
				_opkeyrecorder.AddApexClassName(domobject);
				_opkeyrecorder.AddAuraClass(domobject);

			}

			$.each(domobject, function (key, value) {
				if (key != "parent") {
					if (key.indexOf("xpath:") == -1 && key.indexOf("relation") == -1 && key.indexOf("css") == -1) {
						domobject[key] = _opkeyrecorder.RemoveIndex(_opkeyrecorder.ParseAlternateProperty(value));
					}
				}
			});

			if (domobject["relation"] != null) {
				var relation_str = domobject["relation"];
				relation_str = relation_str.split("Depth=");
				var only_relation = relation_str[0];
				var pivot_index = relation_str[1];
				if (_opkeyrecorder.current_pivot_objectdata != null) {
					if (_opkeyrecorder.current_pivot_objectdata["relation"] != null) {
						_opkeyrecorder.current_pivot_objectdata["relation"] = "";
					}
					if (_opkeyrecorder.current_pivot_objectdata["relationType1"] != null) {
						_opkeyrecorder.current_pivot_objectdata["relationType1"] = "";
					}
					if (_opkeyrecorder.current_pivot_objectdata["pivotObject1"] != null) {
						_opkeyrecorder.current_pivot_objectdata["pivotObject1"] = "";
					}
					if (_opkeyrecorder.current_pivot_objectdata["pivotIndex1"] != null) {
						_opkeyrecorder.current_pivot_objectdata["pivotIndex1"] = "";
					}
					if (_opkeyrecorder.current_pivot_objectdata["pivotPriority1"] != null) {
						_opkeyrecorder.current_pivot_objectdata["pivotPriority1"] = "";
					}
				}

				if (is_anchored) {
					domobject["relation"] = "";
					domobject["relationType1"] = only_relation;
					domobject["pivotObject1"] = JSON.stringify(_opkeyrecorder.current_pivot_objectdata);
					domobject["pivotIndex1"] = pivot_index;
					domobject["pivotPriority1"] = "1";
				}
			}
			if (domobject["tag"] == null) {
				domobject["tag"] = domobject["class"];
			}
			var data = new Object();
			data["Tag"] = domobject["tag"];
			data["Identifier"] = domobject.logicalname;
			data["ObjectData"] = domobject;
			_opkeyrecorder.allrecordeddomssarray.push(data);
			_opkeyrecorder.addDataToDomGrid(rowno, data);

			chrome.runtime.sendMessage({
				setSpyDomForDocker: _opkeyrecorder.allrecordeddomssarray
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
		}
	}
};


OpkeyRecorder.prototype.updateOrGrid = function (objectdata) {
	var orpropertygrid = $("#orpropertygrid");
	_opkeyrecorder.clearAllDataInGrid("orpropertygrid");
	var orrowno = 0;
	for (var key in objectdata) {
		var attribute = key;
		var value = objectdata[key];
		//debugger
		if (attribute == "logicalname") {
			$("#recorderLogicalName").val(value);
		}
		if (attribute == "parent") {
			value = "";
		}
		if (attribute.indexOf("element:") > -1) {
			value = "";
		}
		if (attribute == "IsSikuliKeyword") {
			value = "";
		}
		if (attribute == "unencryptedData") {
			value = "";
		}
		if (value != "") {
			var object = new Object();
			if (attribute == "sahiText") {
				attribute = "innertext";
			}
			object.Attribute = attribute;
			object.Value = value;
			orpropertygrid.jqGrid("addRowData", orrowno, object);
			orrowno++;
		}
	}

	chrome.runtime.sendMessage({
		setRecorderStepsObjectPropertyForDocker: [objectdata]
	}, function (response) {
		if (chrome.runtime.lastError) { }
	});
};

OpkeyRecorder.prototype.updatePivotOrGrid = function (objectdata) {
	_opkeyrecorder.current_pivot_objectdata = objectdata;
	var orpropertygrid = $("#pivotpropertygrid");
	_opkeyrecorder.clearAllDataInGrid("pivotpropertygrid");
	$("#logicalName").val(objectdata["logicalname"]);
	var rowno = 0;
	for (var key in objectdata) {
		var attribute = key;
		var value = objectdata[key];
		if (attribute == "parent") {
			value = "";
		}
		if (value != "") {
			var object = new Object();
			object.Attribute = attribute;
			object.Value = value;
			object.ORObject = objectdata;
			orpropertygrid.jqGrid("addRowData", rowno, object);
			rowno++;
		}
	}
};


OpkeyRecorder.prototype.updateSpyOrGrid = function (objectdata) {
	_opkeyrecorder.current_selected_domobject = objectdata;
	var orpropertygrid = $("#spypropertygrid");
	_opkeyrecorder.clearAllDataInGrid("spypropertygrid");
	$("#logicalName").val(objectdata["logicalname"]);
	var rowno = 0;
	for (var key in objectdata) {
		var attribute = key;
		var value = objectdata[key];
		if (attribute == "parent") {
			value = "";
		}
		if (value != "") {
			var object = new Object();
			object.Attribute = attribute;
			object.Value = value;
			object.ORObject = objectdata;
			orpropertygrid.jqGrid("addRowData", rowno, object);
			rowno++;
		}
	}

	chrome.runtime.sendMessage({
		setSpyDomObjectPropertyForDocker: [objectdata]
	}, function (response) {
		if (chrome.runtime.lastError) { }
	});
};


OpkeyRecorder.prototype.clearAllDataInGrid = function (gridname) {

	$("#" + gridname).jqGrid("clearGridData");
};

OpkeyRecorder.prototype.deleteRowFromGrid = function (gridname, rowno) {
	var currentrow = $("#" + rowno);
	var immediatesibling = currentrow.prev();
	if (immediatesibling.attr("id") == null) {
		immediatesibling = currentrow.next();
	}

	if (immediatesibling != null) {
		$("#" + gridname).jqGrid('delRowData', rowno);
		var mainstepgrid = $("#mainstepgrid");
		mainstepgrid.jqGrid("setSelection", immediatesibling.attr("id"));
		$("#" + mainstepgrid.jqGrid('getGridParam', 'selrow')).focus();
		// ////debugger;
		var step_row_no = immediatesibling.attr("id");
		step_row_no = step_row_no - 1;
		if (_opkeyrecorder.allrecordedstepsarray[step_row_no] != null) {
			var objectdata = _opkeyrecorder.allrecordedstepsarray[step_row_no].ObjectData;
			_opkeyrecorder.updateOrGrid(objectdata);
		}
	}
};

OpkeyRecorder.prototype.deleteMultipleRowFromGrid = function (gridname, rowarray) {
	if (rowarray != null && rowarray.length > 0) {
		for (i = rowarray.length - 1; i >= 0; i--)
			deleteRowFromGrid(gridname, i);
	}
};

function generateUUID() { // Public Domain/MIT
	var d = new Date().getTime(); //Timestamp
	var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0; //Time in microseconds since page-load or 0 if unsupported
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16; //random number between 0 and 16
		if (d > 0) { //Use timestamp until depleted
			r = (d + r) % 16 | 0;
			d = Math.floor(d / 16);
		} else { //Use microseconds since page-load if supported
			r = (d2 + r) % 16 | 0;
			d2 = Math.floor(d2 / 16);
		}
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
}

OpkeyRecorder.prototype.addDataToRecorderStepGrid = function (rowno, stepobject) {
	// ////debugger;
	stepobject["StepId"] = generateUUID();
	_opkeyrecorder.updateDataToMainGrid(rowno, stepobject);
};

OpkeyRecorder.prototype.addDataToDomGrid = function (rowno, domobject) {

	_opkeyrecorder.updateDataToDomGrid(rowno, domobject);
};

OpkeyRecorder.prototype.updateDataToDomGrid = function (rowno, object) {
	var mainstepgrid = $("#spydomgrid");
	mainstepgrid.jqGrid("addRowData", rowno, object);
	var objectdata = _opkeyrecorder.allrecordeddomssarray[_opkeyrecorder.allrecordeddomssarray.length - 1].ObjectData;
	_opkeyrecorder.updateSpyOrGrid(objectdata);
	// _opkeyrecorder.updateOrGrid(objectdata);

};

OpkeyRecorder.prototype.SendToFlowChartController = function (step_object) {
	$.ajax({
		url: saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME") + "/OpkeyApi/BroadcastMessageToUser/",
		type: "POST",
		data: {
			stepJson: JSON.stringify(step_object)
		},
		success: function (returned_data) {
			// console.log(returned_data);
		},
		error: function (error_data) {
			console.error(error_data);
		}
	})
}

OpkeyRecorder.prototype.InjectInFlowTab = function (object) {
	var flow_chart_tab_id = saas_object.GetGlobalSetting("FLOW_CHART_TABID");
	if (flow_chart_tab_id != null) {
		var int_flow_chart_id = parseInt(flow_chart_tab_id);
		var flc_tab_id = int_flow_chart_id;

		var artificate_id = saas_object.GetGlobalSetting("RECORDER_FLOW_DB_ID");
		if (artificate_id != null) {
			chrome.scripting.executeScript(
				{
					target: { tabId: flc_tab_id },
					func: (artifactId) => {
						// Create a script element and execute the desired function with the passed artifact ID
						const s = document.createElement('script');
						s.textContent = `openLiveFlowChartArtifact('${artifactId}');`;
						document.head.appendChild(s);
					},
					args: [artificate_id], // Pass artificate_id as an argument to the function
				},
				function (results) {
					// Handle results if needed
				}
			);


		}
		var stringify_object = JSON.stringify(object);
		var parsed_object = JSON.parse(stringify_object);
		var object_image = parsed_object.ObjectData.ObjectImage;
		parsed_object.ObjectData.ObjectImage = null;
		if (parsed_object.ObjectData.Image != null) {
			object_image = parsed_object.ObjectData.Image;
			parsed_object.ObjectData.Image = null;
		}
		var encoded_string = btoa(JSON.stringify(parsed_object));
		chrome.scripting.executeScript(
			{
				target: { tabId: flc_tab_id },
				func: (encodedString, objectImage) => {
					// Create a script element and inject it to call the setRecorderStepFunction
					const s = document.createElement('script');
					s.textContent = `setRecorderStepFunction('${encodedString}', '${objectImage}');`;
					document.head.appendChild(s);
				},
				args: [encoded_string, object_image], // Pass encoded_string and object_image as arguments to the function
			},
			function (results) {
				// Handle results if needed
			}
		);

	}
}

OpkeyRecorder.prototype.InjectHighlightFunction = function (index_0) {
	if (_opkeyrecorder.opened_window_id != null) {
		if (_opkeyrecorder.opened_window_id != -1) {
			chrome.tabs.query({}, function (tabs) {
				for (var t_i = 0; t_i < tabs.length; t_i++) {
					chrome.scripting.executeScript(
						{
							target: { tabId: tabs[t_i].id },
							func: (index) => {
								AddonsHighlightDom(index);
							},
							args: [index_0], // Pass index_0 as an argument to the function
						},
						function (results) {
							// Handle results if needed
						}
					);

				}
			});
		}
	}
};

OpkeyRecorder.prototype.getRegexFilterData = function () {
	var regexData = localStorage.getItem("OPKEY_REGEX_IGNORE_PATTERN");
	return regexData;
}

OpkeyRecorder.prototype.filterOutRegexProperty = function (object) {
	//debugger
	var _regexFilterData = _opkeyrecorder.getRegexFilterData();
	if (_regexFilterData == null) {
		return;
	}

	if (_regexFilterData.trim() === "") {
		return;
	}

	var _orobject = object.ObjectData;
	var regexStringArray = _regexFilterData.split("||");
	for (var regi = 0; regi < regexStringArray.length; regi++) {
		var attrRegString = regexStringArray[regi].trim();
		var attrRegStringArray = attrRegString.split("=");
		if (attrRegStringArray[0] != null && attrRegStringArray[1] != null) {
			var keyName = attrRegStringArray[0].trim();
			var keyValue = attrRegStringArray[1].trim();
			if (_orobject[keyName] != null) {
				if (_opkeyrecorder.stringMatchesRegex(keyValue, _orobject[keyName]) == true) {
					delete _orobject[keyName];
				}
			}
		}
	}
}

OpkeyRecorder.prototype.stringMatchesRegex = function (regexStr, str) {
	if (str.match(regexStr)) {
		return true;
	}
	return false;
}
OpkeyRecorder.prototype.truncateTextContent = function (textContent) {
	var maxSizeInBytes = 65536;
	var truncatedContent = textContent;
	while (new Blob([truncatedContent]).size > maxSizeInBytes) {
		truncatedContent = truncatedContent.slice(0, -1);
	}
	return truncatedContent;
};

OpkeyRecorder.prototype.checkSize = function (variable) {
	try {
		// Convert the variable to a JSON string

		console.log("here in checksize");
		let jsonString = JSON.stringify(variable);

		// Calculate the size of the JSON string in bytes
		let sizeInBytes = new Blob([jsonString]).size;

		// Define the 64 KB limit
		const MAX_SIZE_IN_BYTES = 64 * 1024;

		// Check if the size is within the limit
		if (sizeInBytes <= MAX_SIZE_IN_BYTES) {
			console.log("The variable size is within the 64 KB limit.");
			return false;
		} else {
			console.log("The variable size exceeds the 64 KB limit.");
			return true;
		}
	} catch (e) {
		console.error("Error checking variable size:", e);
		return false;
	}
};


OpkeyRecorder.prototype.updateDataToMainGrid = function (rowno, object) {
	object["#"] = "<OPKEYSTEPNUMBER><b id=\"gridNoCellopkey\">" + rowno + ".</b></OPKEYSTEPNUMBER>";
	object["Steps"] = getMappedNameOfKeywordStep(object);
	_opkeyrecorder.filterOutRegexProperty(object);
	sendToOpKeyDiv(object);
	try {
		_opkeyrecorder.InjectInFlowTab(object);
	} catch (e) { }
	if (_opkeyrecorder.right_click_keyword_image != null) {
		object.ObjectData["ObjectImage"] = _opkeyrecorder.right_click_keyword_image;
		_opkeyrecorder.right_click_keyword_image = null;
	}
	_opkeyrecorder.current_selected_domobject = null;
	var mainstepgrid = $("#mainstepgrid");
	if (object.Action.indexOf("SelectWindow") > -1) {
		var _clonedObject = _opkeyrecorder.CloneJavaScriptObject(object);
		var _datacloned = _clonedObject.Data;
		_datacloned = JSON.parse(_datacloned);
		var _arrs = new Array();
		$.each(_datacloned, function (k, v) {
			_arrs.push(v);
		});
		_clonedObject.Data = JSON.stringify(_arrs);
		//------------------@Mohit--------------------
		//Adding icons in or record object
		var inserted_action = _clonedObject.Action;
		if ((inserted_action.includes("SF_") || inserted_action.includes("WD_") || inserted_action.includes("MSD_") || inserted_action.includes("PS_") || inserted_action.includes("KRONOS_") || inserted_action.includes("SAPFiori_") || inserted_action.includes("MSDFSO_") || inserted_action.includes("Veeva_") || inserted_action.includes("Coupa_") || inserted_action.includes("OracleFusion_")))
			var checkForIcons = addIconToKeyword(_clonedObject.Steps);
		if (checkForIcons != null)
			_clonedObject.Steps = checkForIcons;
		mainstepgrid.jqGrid("addRowData", rowno, _clonedObject);
	} else {
		//------------------@Mohit--------------------
		//Adding or record icons
		var inserted_action = object.Action;
		if ((inserted_action.includes("SF_") || inserted_action.includes("WD_") || inserted_action.includes("MSD_") || inserted_action.includes("PS_") || inserted_action.includes("KRONOS_") || inserted_action.includes("SAPFiori_") || inserted_action.includes("MSDFSO_") || inserted_action.includes("Veeva_") || inserted_action.includes("Coupa_") || inserted_action.includes("OracleFusion_")))
			var checkForIcons = addIconToKeyword(object.Steps);
		if (checkForIcons != null)
			object.Steps = checkForIcons;
		//console.log("here for checking data entry");
		if (object.Object != null && (inserted_action.indexOf("lick") > -1 || inserted_action.indexOf("Hover") > -1)) {

			//need to fix this and currently commented by neon as it is impacting oracle ebs lt recording
			//		object.Data = null;
		}
		console.log("hesd");
		debugger;
		//@Mohit here making all the change
		if (this.checkSize(object.ObjectData.textContent)) {
			object.ObjectData.textContent = object.ObjectData.textContent.substr(0, 200);
			if (this.checkInner64bytes != null) {
				object.ObjectData["xpath:relative"] = this.checkInner64bytes;
			}
			if (object.ObjectData["xpath:relative"].includes("text()")) {
				var replace64value = object.ObjectData["xpath:relative"];
				replace64value = replace64value.substr(0, (replace64value.lastIndexOf("[")));
				replace64value = replace64value + "[contains(text(), '" + object.ObjectData.textContent + "']";



				object.ObjectData["xpath:relative"] = replace64value;
			}
		}
		mainstepgrid.jqGrid("addRowData", rowno, object);
	}
	var currentselectedrow = _opkeyrecorder.getSelectedRowOfGrid("mainstepgrid");
	if (currentselectedrow != null) {
		var currentrow = $("#" + rowno);
		var alreadyaddedrow = $("#" + currentselectedrow);
		if (hideOracleEBSLoadTestingKeyword === false) {
			currentrow.detach().insertAfter(alreadyaddedrow);
		}
	}

	if (hideOracleEBSLoadTestingKeyword === true) {
		debugger
		$("#" + rowno).hide();
	}

	if (hideOracleEBSLoadTestingKeyword === false) {
		mainstepgrid.jqGrid("setSelection", rowno);
		$("#" + mainstepgrid.jqGrid('getGridParam', 'selrow')).focus();
		var selectedrow = _opkeyrecorder.getSelectedRowOfGrid("mainstepgrid");
		if (selectedrow != 0) {
			selectedrow--;
		}
		var objectdata = _opkeyrecorder.allrecordedstepsarray[selectedrow].ObjectData;
		_opkeyrecorder.updateOrGrid(objectdata);
	}

	sendDataToTestDiscovery(_opkeyrecorder.allrecordedstepsarray);
	sendDataToDockerRecorderGrid(_opkeyrecorder.allrecordedstepsarray);
	addInputKeyUpListner();
	generateStepNo();
};

function generateStepNo() {
	var newrowno = 1;
	var nocellelements = document.getElementsByTagName("OPKEYSTEPNUMBER");
	for (var gcn = 0; gcn < nocellelements.length; gcn++) {
		nocellelements[gcn].childNodes[0].innerText = "" + newrowno;
		newrowno++;
	}
}

function sendDataToTestDiscovery(_allStepsArray) {
	if (true) {
		return;
	}
	chrome.runtime.sendMessage({
		setRecorderStepsForEvolve: _allStepsArray
	}, function (response) {
		if (chrome.runtime.lastError) { }
	});
}

function sendDataToDockerRecorderGrid(_allStepsArray) {
	if (true) {
		return;
	}
	chrome.runtime.sendMessage({
		setRecorderStepsForDocker: _allStepsArray
	}, function (response) {
		if (chrome.runtime.lastError) { }
	});
}

function sendToOpKeyDiv(dataObject) {
	if (true) {
		return;
	}
	var dataToSend = {
		"action": dataObject["Action"],
		"value": dataObject["Data"],
		"objectName": dataObject["Object"]
	}

	var mainData = {
		"action": "recordedstep",
		"data": dataToSend
	}
	chrome.runtime.sendMessage({
		setDockerData: mainData
	}, function (response) { });
}

OpkeyRecorder.prototype.saveUserGuideSteps = function (all_recorded_steps) {
	debugger

	saas_object.BlockUI("Saving User Guide...");
	let afterStepId = localStorage.getItem("OBIQ_AfterStepId");

	let parentStepId = localStorage.getItem("OBIQ_ParentStepId");
	let userGuideSessionId = localStorage.getItem("OBIQ_UserGuideSessionId");
	let userId = localStorage.getItem("OBIQ_UserId");

	if (afterStepId === "null") {
		afterStepId = null;
	}

	if (parentStepId === "null") {
		parentStepId = null;
	}

	if (userId === "null") {
		userId = null;
	}

	let allGuidesStep = [];
	for (let ai = 0; ai < all_recorded_steps.length; ai++) {
		let guideStep = all_recorded_steps[ai];

		let _orObjectData = guideStep["ObjectData"];
		let _stepDetailData = guideStep["Steps"];

		let _imageBase64 = _orObjectData["FullPageImage"];

		let imageBase64List = [];
		if (_imageBase64 && _imageBase64.trim() !== "") {

			_imageBase64 = _imageBase64.replace("data:image/jpeg;base64,", "");
			_imageBase64 = _imageBase64.replace("data:image/png;base64,", "");

			imageBase64List.push(_imageBase64);
		}

		var outInfo = new Object();
		outInfo["ORObjectProperties"] = [_orObjectData];

		let tempDomElement = document.createElement("P");
		tempDomElement.innerHTML = _stepDetailData;

		_stepDetailData = tempDomElement.innerText;

		allGuidesStep.push({ "stepContent": _stepDetailData, "orObjectData": JSON.stringify(outInfo), "imageBase64List": imageBase64List });
	}

	console.log(allGuidesStep);

	let dataToSend = {
		"afterStepId": afterStepId,
		"parentId": parentStepId,
		"userId": userId,
		"stepInsertionList": allGuidesStep
	};

	$.ajax({
		url: saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME") + "/OpkeyObiqServerApi/OpkeyTraceIAAnalyticsApi/OpkeyUserGuideController/recordStepsOfUserGuides",
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(dataToSend),
		success: function (returned_data) {
			debugger
			_opkeyrecorder.stopLocalRecorder();
			saas_object.SetGlobalSetting("TestCaseStepIndex", "");
			chrome.runtime.sendMessage({
				killAllJnlpProcesses: "killAllJnlpProcesses"
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
			chrome.runtime.sendMessage({
				setResume: "setResume"
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
			chrome.runtime.sendMessage({
				ResetRecordingPageId: "ResetRecordingPageId"
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
			_opkeyrecorder.CloseChromeWindow(_opkeyrecorder.opened_window_id);
			saas_object.UnBlockUI();
			_opkeyrecorder.hideContextMenu();
			var image_cropping_win = saas_object.GetGlobalSetting("IMAGE_CROPPING_WIN");
			if (image_cropping_win != null) {
				if (image_cropping_win != "") {
					saas_object.SetGlobalSetting("IMAGE_CROPPING_WIN", "");
					_opkeyrecorder.CloseChromeWindow(parseInt(image_cropping_win));
				}
			}
			var isrecordingfromsaas = saas_object.GetGlobalSetting("isRecordingFromSaas");
			if (isrecordingfromsaas != null) {
				if (isrecordingfromsaas == "true") {
					saas_object.SetGlobalSetting("isRecordingFromSaas", "false");
					chrome.tabs.getCurrent(function (tab) {
						chrome.tabs.remove(tab.id, function () { });
					});
				}
			}

			var flow_chart_tab_id = saas_object.GetGlobalSetting("FLOW_CHART_WinId");
			if (flow_chart_tab_id != null) {
				if (flow_chart_tab_id != "") {
					_opkeyrecorder.CloseChromeWindow(parseInt(flow_chart_tab_id));
				}
			}

			if (localStorage.getItem("ServerAppType") == "OPKEYSTUDIO") {
				chrome.runtime.sendMessage({
					setDockerCommand: {
						"action": "stoprecordingtestdiscovery"
					}
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});
			}

			restoreRecorderWindow();

			chrome.runtime.sendMessage({
				SetCommonCommand: {
					"action": "RefreshUserGuidePage"
				}
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
		},
		error: function (returned_error_data) {
			saas_object.UnBlockUI();
			try {
				var error_jsonobject = JSON.parse(returned_error_data.responseText);
				saas_object.ShowToastMessage("error", error_jsonobject.message);
			} catch (e) {
				saas_object.ShowErrorWithHtmlRendered(returned_error_data.responseText)
			}

		}
	});


};

OpkeyRecorder.prototype.invokeSaveRecording = function () {
	debugger;
	if (localStorage.getItem("ServerAppType") != null) {
		if (localStorage.getItem("ServerAppType") == "TestDiscovery") {
			chrome.runtime.sendMessage({
				setDockerCommand: {
					"action": "stoprecordingtestdiscovery"
				}
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
			return;
		}
	}
	var all_recorded_steps = [];
	var _main_grid = document.getElementById("mainstepgrid");
	var _main_grid_steps = _main_grid.getElementsByTagName("TR");
	for (var _t_i = 0; _t_i < _main_grid_steps.length; _t_i++) {
		var _tr_node = _main_grid_steps[_t_i];
		if (_tr_node.getAttribute("id")) {
			var _id = _tr_node.getAttribute("id");
			_id = parseInt(_id);
			_id = _id - 1;
			var _step = _opkeyrecorder.allrecordedstepsarray[_id];
			all_recorded_steps.push(_step);
		}
	}

	let isRecordingUserGuide = (localStorage.getItem("isRecordingUserGuide") != null && localStorage.getItem("isRecordingUserGuide") === "true") ? true : false;

	if (isRecordingUserGuide === true) {

		_opkeyrecorder.saveUserGuideSteps(all_recorded_steps);
		return;
	}
	var save_call_data_temp = {
		moduleType: "Flow",
		orId: "00000000-0000-0000-0000-000000000000",
		srID: "00000000-0000-0000-0000-000000000000",
		artifactId: "00000000-0000-0000-0000-000000000000",
		insertStepsAt: 0,
		strAllRecordedActionsList: JSON.stringify({}),
		recorderType: "SahiRecorderForSaaS",
		serializedMobileAppDto: "",
		strPCloudyCredentials: "",
		strBookingDtoResult: null,
		pathWindowsApplication: "",
		createLoadTestingDependentArtifacts: false
	};

	saas_object.BlockUI("Saving...");


	$.ajax({
		url: saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME") + "/ComponentFlow/ProcessFunctionalAndLoadTestingRecorderSteps",
		type: "POST",
		datatype: "jsonp",
		data: save_call_data_temp,
		appendOpkeyVersionApi: true,
		success: function (returned_data) {
			window.setTimeout(function () {
				_opkeyrecorder.SaveRecordingLoadTest(all_recorded_steps);
			}, 5000);
		},
		error: function (error_data) {

			window.setTimeout(function () {
				if (error_data != null) {
					if (error_data.status == 404) {
						_opkeyrecorder.SaveRecording(all_recorded_steps);
					}
					else {
						_opkeyrecorder.SaveRecordingLoadTest(all_recorded_steps);
					}
				}
			}, 5000);

		}
	});
}

window.setInterval(function () {
	chrome.runtime.sendMessage({
		getDockerCommand: "getDockerCommand"
	}, function (response) {
		if (response != null) {
			var action = response["action"];
			action = action.toLowerCase();
			if (action == "pause") {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
			if (action == "play") {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
			if (action == "run") {
				$("#executeButton").click();
			}
			if (action == "deletestep") {
				deleteSelectedStep();
			}
			if (action == "changerecordingmode") {
				var _value = response["value"];
				$("#recordingModeSelection").val(_value);
				$("#recordingModeSelection").change();
				saas_object.SetGlobalSetting("RECORDING_MODE", _value.replace(" Recording", ""));
			}
			if (action == "stop") {
				_opkeyrecorder.invokeSaveRecording();
			}
			if (action == "opensnippingtool") {
				$("#snipingtool").click();
			}
			if (action == "openchromebrowser") {
				openNewChromeBrowserWindow();
			}
			if (action == "renamespylogicalname") {
				var _value = response["value"];
				$("#logicalName").val(_value);
				$("#logicalName").change();
				$("#logicalName").keyup();
			}
			if (action == "stoprecordingtestdiscovery") {
				_opkeyrecorder.stopRecordingTestDiscovery();
			}
		}
	});
}, 500);

OpkeyRecorder.prototype.getAllGridData = function (gridname) {
	var datas = $("#" + gridname).jqGrid('getRowData');
	return datas;
};

OpkeyRecorder.prototype.SaveOr = function (db_id) {
	var impactInfoObject = new Object();
	impactInfoObject["IsNeedToImpact"] = false;
	impactInfoObject["AllowedStatsForImpact"] = [];
	var artifact_id = saas_object.GetGlobalSetting("RECORDER_FLOW_DB_ID");
	$.ajax({
		type: "POST",
		data: {
			OR_ID: db_id,
			impactInfo: JSON.stringify(impactInfoObject),
			artifactId: artifact_id
		},
		url: saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME") + "/ObjectRepository/SaveOR",
		success: function (data1) {
			saas_object.ShowToastMessage("", "Object Added");
		},

		error: function (error_data) {
			saas_object.ShowToastMessage("error", "Unable to Add Object");
		}
	});
};

var already_added_objects = [];
OpkeyRecorder.prototype.AddObjectToOR = function (orobject) {
	var or_parent_object = orobject["parent"];
	var pp = new Array();
	var obj = new Array();

	$.each(orobject, function (k, v) {
		if (k == "sahiText") {
			k = "innertext";
		}
		if (k == "objectID") { } else if (k == "parent") { } else if (v == "") { } else if (v == null) { } else if (k == "Image") {
			obj.push({
				"Name": k,
				"Value": DetectFileSize(v),
				"DataType": "Image"
			});
		} else if (k == "ObjectImage") {
			obj.push({
				"Name": k,
				"Value": DetectFileSize(v),
				"DataType": "Image"
			});
		} else {
			obj.push({
				"Name": k,
				"Value": v.toString(),
				"DataType": "String"
			});
		}
	});

	$.each(or_parent_object, function (k, v) {
		if (k == "objectID") { } else if (v == "") { } else if (v == null) { } else {
			pp.push({
				"Name": k,
				"Value": v,
				"DataType": "String"
			});
		}
	});


	var or_id = saas_object.GetGlobalSetting("RECORDER_OR_DB_ID");
	var artifact_id = saas_object.GetGlobalSetting("RECORDER_FLOW_DB_ID");
	debugger;
	_opkeyrecorder.AddObjectInAddStepDialog(orobject);
	$.ajax({
		url: saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME") + '/ObjectRepository/RecordObject',
		type: "POST",
		data: {
			OR_ID: or_id,
			logicalname: orobject["logicalname"],
			strObjectPropertiesList: JSON.stringify(obj),
			strParentPropertiesList: JSON.stringify(pp),
			artifactId: artifact_id
		},
		success: function (data1) {
			var hash_code = _opkeyrecorder.convertTohashCode(orobject);
			for (var aao = 0; aao < already_added_objects.length; aao++) {
				var object_iden = already_added_objects[aao];
				if (object_iden.id == hash_code) {

					saas_object.ShowToastMessage("warning", "Object Already Added");
					return;
				}
			}
			var object_a = new Object();
			object_a.id = hash_code;
			already_added_objects.push(object_a);
			_opkeyrecorder.SaveOr(or_id);
		},

		error: function (error_data) {
			saas_object.ShowToastMessage("error", "Unable to Add Object");
		}
	});
};

OpkeyRecorder.prototype.AddStepFromSpy = function (step_name, orobject, dataarguments, is_adding, require_objectadd) {
	if (orobject != null) {
		var or_object = orobject;
		var or_parent_object = orobject["parent"];
		var step_main_object = new Object();
		var arguments_of_object = new Array();
		var data_arguments = new Object();
		data_arguments["type"] = "string";
		data_arguments["data"] = dataarguments;
		if (orobject.hasOwnProperty("sahiText") && orobject.hasOwnProperty("innertext")) {
			delete orobject["sahiText"];
			debugger
		}
		arguments_of_object.push(orobject);
		arguments_of_object.push(data_arguments);
		step_main_object["action"] = step_name;
		step_main_object["popupName"] = "";
		step_main_object["arguments"] = arguments_of_object;
		if (is_adding == true) {
			_opkeyrecorder.addAllDataToGrid([JSON.stringify(step_main_object)], true, require_objectadd, true);
			saas_object.ShowToastMessage("", "Step Added");
		} else {
			_opkeyrecorder.addAllDataToGrid([JSON.stringify(step_main_object)], false, require_objectadd, true);
			saas_object.ShowToastMessage("", "Step Updated");
		}
	}
};

OpkeyRecorder.prototype.HighlightDom = function (index_0) {

};

OpkeyRecorder.prototype.ParseAlternateProperty = function (input) {
	input = "" + input;
	var init = input.indexOf('(');
	var fin = input.indexOf(')');
	var out = input.substr(init + 1, fin - init - 1);
	if (out != "") {
		return out;
	} else {
		if (input == "undefined") {
			return null;
		} else {
			return input;
		}
	}
};

OpkeyRecorder.prototype.RemoveIndex = function (input) {
	input = "" + input;
	var outdata;
	var init = input.indexOf('[');
	var fin = input.indexOf(']');
	var out = input.substr(init, fin - init);
	if (out != "") {
		if (!isNaN(out.replace("[", ""))) {
			return input.replace(out + "]", "");
		} else {
			return input;
		}
	} else {
		if (input == "null") {
			return null;
		} else {
			return input;
		}
	}
};

OpkeyRecorder.prototype.RedirectToSaas = function (artificate_id) {
	debugger
	if (localStorage.getItem("ServerAppType") == "OPKEYSTUDIO") {
		return;
	}
	if (localStorage.getItem("OpKeySalesforceApp") != null) {
		if (localStorage.getItem("OpKeySalesforceApp") === "true") {
			localStorage.setItem("OpKeySalesforceApp", "false");
			return;
		}
	}
	chrome.tabs.query({}, function (all_tabs) {
		var is_current_saas_tab_found = false;
		for (var tb_i = 0; tb_i < all_tabs.length; tb_i++) {
			var c_tab = all_tabs[tb_i];
			if ((c_tab.title == "Opkey" || c_tab.title == "Opkey - So which project are you gonna work on today ?") && c_tab.title != "Opkey AddOn") {
				var tab_url = c_tab.url;
				var addon_domain = saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME");
				if (tab_url.indexOf(addon_domain) > -1) {
					is_current_saas_tab_found = true;
					chrome.tabs.update(c_tab.id, {
						url: saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME") + "/OpkeyApi/PluginRecorderStop?ArtifactId=" + artificate_id
					}, function (response) { });
				}

			}
		}

		if (is_current_saas_tab_found == false) {
			chrome.windows.create({
				url: saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME") + "/OpkeyApi/PluginRecorderStop?ArtifactId=" + artificate_id,
				state: "maximized"
			}, function (win) { });
		}
	});
};

OpkeyRecorder.prototype.displayContextMenu = function () {
	chrome.runtime.sendMessage({
		CreateContextMenu: "CreateContextMenu"
	}, function (response) {
		if (chrome.runtime.lastError) { }
	});
};

OpkeyRecorder.prototype.hideContextMenu = function () {
	chrome.runtime.sendMessage({
		RemoveContextMenu: "RemoveContextMenu"
	}, function (response) {
		if (chrome.runtime.lastError) { }
	});
};

OpkeyRecorder.prototype.IsImageSizeIsApplicable = function (base_64) {
	var b64_size = _opkeyrecorder.GetBase64ImageSize(base_64);
	// console.log("Image Size "+b64_size);
	// alert(b64_size);
};

function DetectFileSize(_imageData) {
	var _bytes = _imageData.length;
	var _kbytes = _bytes / 1024;
	if (_kbytes > 800) {
		return "R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
	}
	return _imageData;
};


function invokeOrDownloadAgent() {
	saas_object.ShowToastMessage("", "Checking OpKey Lite Agent Running or Not");
	var a = document.createElement('a');
	document.body.appendChild(a);
	a.style = 'display: none';
	if (window.navigator.platform.indexOf("Win") != -1) {
		a.href = "https://s3.amazonaws.com/cdn.opkey.crestech/OpKeyLiteAgent/OpkeyLiteAgent.exe";
	}
	else {
		a.href = "https://s3.amazonaws.com/cdn.opkey.crestech/OpKeyLiteAgent/OpkeyLiteAgent-macos-installer-arm64.pkg";
	}
	a.target = "_blank";
	a.click();
	//protocolError();
	/*window.setTimeout(function() {
		window.protocolCheck("OpKeyLiteAgent:Rec", protocolError, protocolSuccess);
	}, 2000)*/
}

function protocolError() {
	swal({
		html: true,
		title: "",
		text: "<p><b>Step 1:</b> Make sure that you have downloaded the OpkeySmartRecorderTools file(.jar) from the download button present in the toolbar.</p><p><b>Step 2:</b> After downloading gets complete, click the OpkeySmartRecorderTools file(.jar) to start the one time installation process.</p><p><b>Step 3:</b> After successful installation, wait till the plugins get downloaded.</p><p><b>Step 4:</b> Now all set to execute your test.</p><p><b>OR</b></p><p><b>Step 1:</b> If you have already downloaded and installed OpkeySmartRecorderTools file(.jar), go to your desktop and click on Opkey Lite Agent to start the agent.</p>",
		type: "error",
		confirmButtonClass: "btn-success",
		confirmButtonText: "Ok",
		closeOnConfirm: true
	}, function (isConfirm) { });
	//window.open("https://s3.amazonaws.com/cdn.opkey.crestech/OpKeyLiteAgent/OpKeyLiteAgent.exe", "_new");
	return false;
}

function protocolSuccess() {
	return false;
}

var popup_setting_playback_html = "";
$("#download_installation_winintel").click(function (e) {
	popup_setting_playback_html = $("#popup_setting_playback").html();
	$("#popup_install_opkey").hide();
	invokeDownloadWinIntel();
	//_opkeyrecorder.StartExecutionInOpKeyLite_silent("normal");
	$("#div_popup_main").show();
	if (showPlaybackDiv == true) {
		$("#popup_setting_playback").show();
	}
	else {
		$("#div_popup_main").hide();
	}
	showPlaybackDiv = false;
});

$("#download_installation_arm64").click(function (e) {
	popup_setting_playback_html = $("#popup_setting_playback").html();
	$("#popup_install_opkey").hide();
	invokeDownloadMacArm64();
	//	_opkeyrecorder.StartExecutionInOpKeyLite_silent("normal");
	$("#div_popup_main").show();
	if (showPlaybackDiv == true) {
		$("#popup_setting_playback").show();
	}
	else {
		$("#div_popup_main").hide();
	}
	showPlaybackDiv = false;
});

$("#download_installation_macIntel").click(function (e) {
	popup_setting_playback_html = $("#popup_setting_playback").html();
	$("#popup_install_opkey").hide();
	invokeDownloadMacIntel();
	//_opkeyrecorder.StartExecutionInOpKeyLite_silent("normal");
	$("#div_popup_main").show();
	if (showPlaybackDiv == true) {
		$("#popup_setting_playback").show();
	}
	else {
		$("#div_popup_main").hide();
	}
	showPlaybackDiv = false;
});

function invokeDownloadWinIntel() {
	var a = document.createElement('a');
	document.body.appendChild(a);
	a.style = 'display: none';
	a.href = "https://s3.amazonaws.com/cdn.opkey.crestech/OpKeyLiteAgent/OpkeyLiteAgent.exe";
	a.target = "_blank";
	a.click();
}

function invokeDownloadMacArm64() {
	var a = document.createElement('a');
	document.body.appendChild(a);
	a.style = 'display: none';
	a.href = "https://s3.amazonaws.com/cdn.opkey.crestech/OpKeyLiteAgent/OpkeyLiteAgent-macos-installer-arm64.pkg";
	a.target = "_blank";
	a.click();
}

function invokeDownloadMacIntel() {
	var a = document.createElement('a');
	document.body.appendChild(a);
	a.style = 'display: none';
	a.href = "https://s3.amazonaws.com/cdn.opkey.crestech/OpKeyLiteAgent/OpkeyLiteAgent-macos-installer-x64.pkg";
	a.target = "_blank";
	a.click();
}

function showLiteAgentDownloadOption() {
	showPlaybackDiv = false;
	platFormDownloadButtons();
	$("#div_popup_main").show();
	$("#popup_setting_playback").hide();
	$("#popup_install_opkey").show();
}

function platFormDownloadButtons() {
	if (window.navigator.platform.indexOf("Win") != -1) {
		$("#download_installation_winintel").show();
		$("#download_installation_arm64").hide();
		$("#download_installation_macIntel").hide();
	}
	else {
		$("#download_installation_winintel").hide();
		$("#download_installation_arm64").show();
		$("#download_installation_macIntel").show();
	}
}

OpkeyRecorder.prototype.StartExecutionInOpKeyLite = function (execution_mode) {
	popup_setting_playback_html = $("#popup_setting_playback").html();
	console.log("Called StartExecutionInOpKeyLite " + invokedExecution);
	var agentInterval = window.setInterval(function () {
		if (invokedExecution == true) {
			window.clearInterval(agentInterval);
			return;
		}
		invokedExecution = true;
		//	saas_object.ShowToastMessage("", "Connecting to OpKeyLiteAgent");
		$.ajax({
			url: "http://localhost:8090/agentALive",
			type: "GET",
			success: function (returned_data) {
				//saas_object.ShowToastMessage("", "Executing your test.");
				$("#div_popup_main").show();
				$("#popup_setting_playback").show();
				displayProgressNotification("inprogress");
				window.clearInterval(agentInterval);

				window.setTimeout(function () {
					var pluginName = getPluginNameAccordingToRecorder();
					_opkeyrecorder.LaunchPluginInAgent(pluginName, execution_mode);
					//saas_object.ShowToastMessage("", "Execution started successfully.");
					displayProgressNotification("complete");
				}, 2000);
				invokedExecution = false;
			},
			error: function (returned_error_data) {
				window.clearInterval(agentInterval);
				//saas_object.ShowToastMessage("error", "Checking for Opkey Lite Agent.");
				//saas_object.ShowToastMessage("error", "Opkey Lite Agent is not installed on your system.");
				//saas_object.ShowToastMessage("error", "Downloading Opkey Lite Agent.");
				//invokeOrDownloadAgent();
				//saas_object.ShowToastMessage("error", "Install the downloaded Opkey Lite Agent jar.");
				//loadingStart_recorder(document.body,"Waiting for Opkey Lite Agent to come online..",null);
				platFormDownloadButtons();
				$("#div_popup_main").show();
				$("#popup_setting_playback").hide();
				$("#popup_install_opkey").show();
				_opkeyrecorder.StartExecutionInOpKeyLite_silent(execution_mode);
			}
		});
	}, 1000);
};


OpkeyRecorder.prototype.StartExecutionInOpKeyLite_silent = function (execution_mode) {
	var agentInterval = window.setTimeout(function () {
		$.ajax({
			url: "http://localhost:8090/agentALive",
			type: "GET",
			success: function (returned_data) {
				loadingStop_recorder(document.body, null);
				window.clearTimeout(agentInterval);
				displayProgressNotification("inprogress");
				//saas_object.ShowToastMessage("", "Installation Complete. Executing your test.");
				window.setTimeout(function () {
					var pluginName = getPluginNameAccordingToRecorder();
					_opkeyrecorder.LaunchPluginInAgent(pluginName, execution_mode);
					displayProgressNotification("complete");
				}, 2000);
				invokedExecution = false;
			},
			error: function (returned_error_data) {
				_opkeyrecorder.StartExecutionInOpKeyLite_silent(execution_mode);
			}
		});
	}, 1000);
};

function displayProgressNotification(_state) {
	if (_state == "inprogress") {
		$("#installcheck").removeClass();
		$("#installcheck").addClass("fa fa-check-circle icon_size_2rem");
		$("#playbackcheck").removeAttr("style");
		$("#playbackcheck").removeClass();
		$("#playbackcheck").addClass("spinner-border Spinner_timer_div spinner-theme-green");
	}
	if (_state == "complete") {
		$("#playbackcheck").removeClass();
		$("#playbackcheck").addClass("fa fa-check-circle icon_size_2rem");
		window.setTimeout(function () {
			$("#div_popup_main").hide();
			$("#popup_setting_playback").hide();
			$("#popup_install_opkey").hide();
			$("#popup_setting_playback").html(popup_setting_playback_html);
		}, 1000);
	}
}


var tempElementBlocked = null;
var tempCtrElement = null;
var loaderstarted = false;
function loadingStart_recorder(el, msg, ctrl) {
	if (loaderstarted == true) {
		return;
	}
	loaderstarted = true;
	tempElementBlocked = el;
	tempCtrElement = ctrl;
	$(ctrl).attr("disabled", true);
	$(el).block({
		centerX: true,
		centerY: true,
		async: true,
		// message: '<img src="~/Assets/images/loader/1.gif"> <br><span style="color:#fff; font-size:20px">' + msg + '</span>',
		message:
			'<div style="background-color: white;padding: 10px;border-radius: 5px"><div class="spinner-border spinner-theme-green"></div><span style="display: block; position: relative; padding-top: 8px; color:black; font-size:14px;font-weight: 700;">' +
			msg +
			'</span><button id="opkeyCancelProcess" class="btn" style="color:black; font-size:15px;font-weight: 700; position: relative; margin-top: 8px;">Cancel</button></div>',
		css: {
			border: "none",
			padding: "2px",
			backgroundColor: "none",
			"z-index": "9999",
		},
		overlayCSS: {
			backgroundColor: "#000",
			opacity: 0.4,
			cursor: "wait",
			"z-index": "9999",
		},
	});
	// $('.blockUI.blockMsg').center();
	$("#opkeyCancelProcess").click(function (e) {
		unblockUIAddon();
	});
}


function unblockUIAddon() {
	if (tempElementBlocked != null) {
		if (tempCtrElement != null) {
			$(tempCtrElement).removeAttr("disabled");
			tempCtrElement = null;
		}
		$(tempElementBlocked).unblock();
		tempElementBlocked = null;
	}
	loaderstarted = false;
}

function loadingStop_recorder(el, ctrl) {
	loaderstarted = false;
	$(ctrl).removeAttr("disabled");
	$(el).unblock();
}

function getPluginNameAccordingToRecorder() {
	var recorderName = $("#recordingModeSelection").val();
	recorderName = recorderName.replace(" Recording", "");
	console.log("Plugin Name " + recorderName)
	if (recorderName == "Normal") {
		return "Web";
	}
	return recorderName;
}


OpkeyRecorder.prototype.LaunchPluginInAgent = function (pluginName, execution_mode) {

	if ($("#executeButton").hasClass("fa-play")) {
		$("#executeButton").removeClass("fa-play");
		$("#executeButton").addClass("fa-pause")
	}
	var setting = getPluginSettings();
	var playBackData = {
		"pluginName": pluginName,
		"snapShotFrequency": setting["snapShotFrequency"],
		"snapShotQuality": setting["snapShotQuality"],
		"highLightObject": setting["highLightObject"],
		"timeOut": setting["timeOut"],
		"disablePageWait": setting["disablePageWait"],
		"disableNotification": setting["disableNotification"]
	};
	$.ajax({
		url: "http://localhost:8090/launchPlugin",
		type: "GET",
		data: playBackData,
		success: function (returned_data) {
			var all_recorded_steps = [];
			var _main_grid = document.getElementById("mainstepgrid");
			var _main_grid_steps = _main_grid.getElementsByTagName("TR");
			for (var _t_i = 0; _t_i < _main_grid_steps.length; _t_i++) {
				var _tr_node = _main_grid_steps[_t_i];
				if (_tr_node.getAttribute("id")) {
					var _id = _tr_node.getAttribute("id");
					_id = parseInt(_id);
					_id = _id - 1;
					var _step = _opkeyrecorder.allrecordedstepsarray[_id];
					all_recorded_steps.push(_step);
				}
			}
			_opkeyrecorder.ExecuteSteps(all_recorded_steps, execution_mode);
		},
		error: function (returned_error_data) {

		}
	});
};

function getPluginSettings() {
	var timeOut = $("#txtInputStepTimeout").val();
	var highLightObject = "False";
	var disablePageLoad = "False";
	var suppressNotification = "False";
	var snapShotFrequency = "FailedSteps";
	var snapShotQuality = "Medium";

	var highLightObjectChecked = $("#chkIsHighlightObject").is(":checked");
	var disablePageLoadChecked = $("#chksupresswait").is(":checked");
	var suppressNotificationChecked = $("#chksupressnotification").is(":checked");
	if (highLightObjectChecked == true) {
		highLightObject = "True";
	}
	if (disablePageLoadChecked == true) {
		disablePageLoad = "True";
	}
	if (suppressNotificationChecked == true) {
		suppressNotification = "True";
	}
	var setting = new Object();
	setting["timeOut"] = timeOut;
	setting["highLightObject"] = highLightObject;
	setting["snapShotFrequency"] = snapShotFrequency;
	setting["snapShotQuality"] = snapShotQuality;
	setting["disablePageWait"] = disablePageLoad;
	setting["disableNotification"] = suppressNotification;
	return setting;
}


OpkeyRecorder.prototype.ExecuteSteps = function (recorded_data, execution_mode) {
	chrome.runtime.sendMessage({
		setPause: "setPause"
	}, function (response) {
		if (chrome.runtime.lastError) { }
	});
	$("#stop_execution").prop("disabled", false);
	//saas_object.BlockUI("Saving...");
	var all_recorded_data = recorded_data;
	var all_datas = [];
	for (var i = 0; i < all_recorded_data.length; i++) {
		var object_attribute_array = new Array();
		var parent_attribute_array = new Array();
		var step_data = all_recorded_data[i];
		if (step_data != "") {
			// //debugger;
			var action_name = step_data["Action"];
			var logical_name = step_data["Object"];
			var data_args = step_data["Data"];
			var object_data = step_data["ObjectData"];
			logical_name = logical_name.replace(/\n/g, "").replace(/\t/g, "").replace(/  /g, "");
			var parent_object_data = object_data["parent"];
			if (action_name.indexOf("TypeSecureText") > -1) {
				data_args = object_data["unencryptedData"];
			}
			// check here

			$.each(object_data, function (k, v) {
				if (k == "parent") {
					v = null;
				}
				if (k.indexOf("element:") > -1) {
					v = null;
				}
				if (k == "logicalname") {
					logical_name = v;
				}
				if (k == "IsSikuliKeyword") {
					v = null;
				}
				if (k == "sahiText") {
					k = "innertext";
				}
				if (k == "unencryptedData") {
					v = null;
				}
				if (v == "") {
					v = null;
				}
				if (k == "Image") {
					if (v != null) {
						v = v.replace("data:image/png;base64,", "");
						object_attribute_array.push({
							"Name": k,
							"Value": "",
							"DataType": "Image"
						});
					}
				} else if (k == "ObjectImage") {
					if (v != null) {
						v = v.replace("data:image/png;base64,", "");
						object_attribute_array.push({
							"Name": k,
							"Value": "",
							"DataType": "Image"
						});
					}
				} else {
					if (v != null) {
						object_attribute_array.push({
							"Name": k,
							"Value": v.toString(),
							"DataType": "String"
						});
					}
				}
			});

			$.each(parent_object_data, function (k, v) {
				if (v == "") {
					v = null;
				}
				if (v != null) {
					parent_attribute_array.push({
						"Name": k,
						"Value": v.toString(),
						"DataType": "String"
					});
				}
			});

			var validdatas = [];
			if (data_args != null && data_args != "") {
				if (data_args.indexOf("{") == 0) {
					var parsed_dataarray = JSON.parse(data_args);
					$.each(parsed_dataarray, function (key, value) {
						validdatas.push(parsed_dataarray[key]);
					});
				}
			}
			var argumentdata = []
			if (validdatas != null) {
				if (validdatas.length > 0) {
					for (var il = 0; il < validdatas.length; il++) {
						argumentdata.push(validdatas[il])
					}
				}
			}

			if (logical_name.length > 25) {
				logical_name = logical_name.substring(0, 24)
			}

			// console.log("Logical name "+logical_name);
			if (argumentdata.length > 0) {
				var out_data = {
					"action": action_name,
					"logicalname": logical_name,
					"objectProperties": object_attribute_array,
					"parentProperties": parent_attribute_array,
					"dataArgs": argumentdata
				};
				all_datas.push(out_data);
			} else {
				var out_data = {
					"action": action_name,
					"logicalname": logical_name,
					"objectProperties": object_attribute_array,
					"parentProperties": parent_attribute_array,
					"dataArgs": [data_args]
				};
				all_datas.push(out_data);
			}
		}
	}
	if (all_datas.length > 0) {
		var stepsToExecute = JSON.stringify(all_datas);
		$.ajax({
			url: "http://localhost:8090/sendDataToAgent",
			type: "POST",
			data: {
				"functionCall": stepsToExecute,
				"executionMode": execution_mode
			},
			success: function (returned_data) {
				if ($("#executeButton").hasClass("fa-pause")) {
					$("#executeButton").removeClass("fa-pause");
					$("#executeButton").addClass("fa-play");
					$("#executeButtonHolder").attr("title", "Play");
				}
				$("#stop_execution").prop("disabled", true);
				saas_object.UnBlockUI();
				if ($("#pause").hasClass("fa-circle") == false) {
					chrome.runtime.sendMessage({
						setResume: "setResume"
					}, function (response) {
						if (chrome.runtime.lastError) { }
					});
				}
				if (pausedByUser == false) {
					if ($("#pause").hasClass("fa-circle")) {
						$("#pausePlayHolder").click();
						pausedByUser = false;
					}
				}
			},
			error: function (returned_error_data) {
				saas_object.UnBlockUI();
				if ($("#pause").hasClass("fa-circle") == false) {
					chrome.runtime.sendMessage({
						setResume: "setResume"
					}, function (response) {
						if (chrome.runtime.lastError) { }
					});
				}
				if (pausedByUser == false) {
					if ($("#pause").hasClass("fa-circle")) {
						$("#pausePlayHolder").click();
						pausedByUser = false;
					}
				}
			}
		});
	}
};


OpkeyRecorder.prototype.stopRecordingTestDiscovery = function () {
	debugger
	saas_object.SetGlobalSetting("TestCaseStepIndex", "");
	chrome.runtime.sendMessage({
		killAllJnlpProcesses: "killAllJnlpProcesses"
	}, function (response) {
		if (chrome.runtime.lastError) { }
	});
	chrome.runtime.sendMessage({
		setResume: "setResume"
	}, function (response) {
		if (chrome.runtime.lastError) { }
	});
	chrome.runtime.sendMessage({
		ResetRecordingPageId: "ResetRecordingPageId"
	}, function (response) {
		if (chrome.runtime.lastError) { }
	});
	_opkeyrecorder.CloseChromeWindow(_opkeyrecorder.opened_window_id);
	_opkeyrecorder.hideContextMenu();
	var image_cropping_win = saas_object.GetGlobalSetting("IMAGE_CROPPING_WIN");
	if (image_cropping_win != null) {
		if (image_cropping_win != "") {
			saas_object.SetGlobalSetting("IMAGE_CROPPING_WIN", "");
			_opkeyrecorder.CloseChromeWindow(parseInt(image_cropping_win));
		}
	}
	var isrecordingfromsaas = saas_object.GetGlobalSetting("isRecordingFromSaas");
	if (isrecordingfromsaas != null) {
		if (isrecordingfromsaas == "true") {
			saas_object.SetGlobalSetting("isRecordingFromSaas", "false");
			chrome.tabs.getCurrent(function (tab) {
				chrome.tabs.remove(tab.id, function () { });
			});
		}
	}

	var flow_chart_tab_id = saas_object.GetGlobalSetting("FLOW_CHART_WinId");
	if (flow_chart_tab_id != null) {
		if (flow_chart_tab_id != "") {
			_opkeyrecorder.CloseChromeWindow(parseInt(flow_chart_tab_id));
		}
	}
};


OpkeyRecorder.prototype.SaveRecording = function (recorded_data) {
	saas_object.BlockUI("Saving...");
	var all_recorded_data = recorded_data;
	var all_datas = [];
	for (var i = 0; i < all_recorded_data.length; i++) {
		var object_attribute_array = new Array();
		var parent_attribute_array = new Array();
		var step_data = all_recorded_data[i];
		if (step_data != "") {
			// //debugger;
			var action_name = step_data["Action"];
			var logical_name = step_data["Object"];
			var data_args = step_data["Data"];
			var object_data = step_data["ObjectData"];
			logical_name = logical_name.replace(/\n/g, "").replace(/\t/g, "").replace(/  /g, "");
			var parent_object_data = object_data["parent"];
			if (action_name.indexOf("TypeSecureText") > -1) {
				data_args = object_data["unencryptedData"];
			}
			if (action_name == "TypeTextInTextArea") {
				action_name = "TypeText";
			}
			// check here

			$.each(object_data, function (k, v) {
				if (k == "parent") {
					v = null;
				}
				if (k.indexOf("element:") > -1) {
					v = null;
				}
				if (k == "logicalname") {
					logical_name = v;
				}
				if (k == "IsSikuliKeyword") {
					v = null;
				}
				if (k == "sahiText") {
					k = "innertext";
				}
				if (k == "unencryptedData") {
					v = null;
				}
				if (v == "") {
					v = null;
				}
				if (k == "Image") {
					if (v != null) {
						v = v.replace("data:image/png;base64,", "");
						object_attribute_array.push({
							"Name": k,
							"Value": DetectFileSize(v),
							"DataType": "Image"
						});
					}
				} else if (k == "ObjectImage") {
					if (v != null) {
						v = v.replace("data:image/png;base64,", "");
						object_attribute_array.push({
							"Name": k,
							"Value": DetectFileSize(v),
							"DataType": "Image"
						});
					}
				} else {
					if (v != null) {
						object_attribute_array.push({
							"Name": k,
							"Value": v.toString(),
							"DataType": "String"
						});
					}
				}
			});

			$.each(parent_object_data, function (k, v) {
				if (v == "") {
					v = null;
				}
				if (v != null) {
					parent_attribute_array.push({
						"Name": k,
						"Value": v.toString(),
						"DataType": "String"
					});
				}
			});

			var validdatas = [];
			if (data_args != null && data_args != "") {
				if (data_args.indexOf("{") == 0) {
					var parsed_dataarray = JSON.parse(data_args);
					$.each(parsed_dataarray, function (key, value) {
						validdatas.push(parsed_dataarray[key]);
					});
				}
			}
			var argumentdata = []
			if (validdatas != null) {
				if (validdatas.length > 0) {
					for (var il = 0; il < validdatas.length; il++) {
						argumentdata.push(validdatas[il])
					}
				}
			}

			if (logical_name.length > 25) {
				logical_name = logical_name.substring(0, 24)
			}

			// console.log("Logical name "+logical_name);
			if (argumentdata.length > 0) {
				var out_data = {
					"action": action_name,
					"logicalname": logical_name,
					"objectProperties": object_attribute_array,
					"parentProperties": parent_attribute_array,
					"dataArgs": argumentdata
				};
				all_datas.push(out_data);
			} else {
				var out_data = {
					"action": action_name,
					"logicalname": logical_name,
					"objectProperties": object_attribute_array,
					"parentProperties": parent_attribute_array,
					"dataArgs": [data_args]
				};
				all_datas.push(out_data);
			}
		}
	}
	if (all_datas.length > 0 || isMobileRecording() == true) {
		var append_at = "0";
		var append_step_at = saas_object.GetGlobalSetting("TestCaseStepIndex");
		if (append_step_at != null) {
			if (append_step_at != "") {
				append_at = append_step_at;
			}
		}
		var artificate_id = saas_object.GetGlobalSetting("RECORDER_FLOW_DB_ID");
		var or_id = saas_object.GetGlobalSetting("RECORDER_OR_DB_ID");

		var save_call_data = {
			moduleType: "Flow",
			orId: or_id,
			artifactId: artificate_id,
			insertStepsAt: append_at,
			strAllRecordedActionsList: JSON.stringify(all_datas),
			recorderType: "SahiRecorderForSaaS",
			serializedMobileAppDto: "",
			strPCloudyCredentials: "",
			strBookingDtoResult: null,
			pathWindowsApplication: "",
			createLoadTestingDependentArtifacts: false
		};


		if (isMobileRecording()) {
			debugger
			var pcloudtDto = getPcloudyDeviceDto();
			var strBookingDtoResult = pcloudtDto["BookingDTO"];

			var strPCloudyCredentials = pcloudtDto["pCloudyCredentials"];

			var mobileRecorderType = localStorage.getItem("MobileRecorderType");
			if (mobileRecorderType != null && mobileRecorderType == "PcloudyAndriodRecorder") {
				save_call_data["recorderType"] = "MobileAndroidRecorder";
				save_call_data["serializedMobileAppDto"] = localStorage.getItem("MobileAppDto");
			}
			save_call_data["strPCloudyCredentials"] = JSON.stringify(strPCloudyCredentials);
			save_call_data["strBookingDtoResult"] = JSON.stringify(strBookingDtoResult);
		}


		debugger
		$.ajax({
			url: saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME") + "/ComponentFlow/ProcessRecorderSteps",
			type: "POST",
			datatype: "jsonp",
			data: save_call_data,
			appendOpkeyVersionApi: true,
			success: function (returned_data) {
				debugger
				saas_object.SetGlobalSetting("TestCaseStepIndex", "");
				chrome.runtime.sendMessage({
					killAllJnlpProcesses: "killAllJnlpProcesses"
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});
				chrome.runtime.sendMessage({
					setResume: "setResume"
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});
				chrome.runtime.sendMessage({
					ResetRecordingPageId: "ResetRecordingPageId"
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});
				_opkeyrecorder.CloseChromeWindow(_opkeyrecorder.opened_window_id);
				saas_object.UnBlockUI();
				_opkeyrecorder.hideContextMenu();
				var image_cropping_win = saas_object.GetGlobalSetting("IMAGE_CROPPING_WIN");
				if (image_cropping_win != null) {
					if (image_cropping_win != "") {
						saas_object.SetGlobalSetting("IMAGE_CROPPING_WIN", "");
						_opkeyrecorder.CloseChromeWindow(parseInt(image_cropping_win));
					}
				}
				_opkeyrecorder.RedirectToSaas(artificate_id);
				var isrecordingfromsaas = saas_object.GetGlobalSetting("isRecordingFromSaas");
				if (isrecordingfromsaas != null) {
					if (isrecordingfromsaas == "true") {
						saas_object.SetGlobalSetting("isRecordingFromSaas", "false");
						chrome.tabs.getCurrent(function (tab) {
							chrome.tabs.remove(tab.id, function () { });
						});
					}
				}

				var flow_chart_tab_id = saas_object.GetGlobalSetting("FLOW_CHART_WinId");
				if (flow_chart_tab_id != null) {
					if (flow_chart_tab_id != "") {
						_opkeyrecorder.CloseChromeWindow(parseInt(flow_chart_tab_id));
					}
				}

				if (localStorage.getItem("ServerAppType") == "OPKEYSTUDIO") {
					chrome.runtime.sendMessage({
						setDockerCommand: {
							"action": "stoprecordingtestdiscovery"
						}
					}, function (response) {
						if (chrome.runtime.lastError) { }
					});
				}

				restoreRecorderWindow();
				window.location = "/Login.html?action=recorder_stop&success=true";
			},
			error: function (returned_error_data) {
				saas_object.UnBlockUI();
				try {
					try {
						var error_jsonobject = JSON.parse(returned_error_data.responseText);
					} catch (error) { }
					const popupOverlay = document.getElementById("popup-overlay");
					const traceIdElement = document.getElementById("trace-id");
					traceIdElement.textContent = createUUID();
					popupOverlay.style.display = "block";
					const reportIssueButton = document.getElementById("report-issue-button");
					try {
						reportIssueButton.dataset.errorMessage = ":::::: Error from Recorder side:::::: " + error_jsonobject.message;
					} catch (error) {
						reportIssueButton.dataset.errorMessage = ":::::: Error from Recorder side:::::: Step not saved";
					}
					reportIssueButton.dataset.traceId = traceIdElement.textContent;
				} catch (e) {
					saas_object.ShowErrorWithHtmlRendered(returned_error_data.responseText)
				}

			}
		});
	} else {
		if (localStorage.getItem("ServerAppType") == "OPKEYSTUDIO") {
			chrome.runtime.sendMessage({
				setDockerCommand: {
					"action": "stoprecordingtestdiscovery"
				}
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
		}
		chrome.runtime.sendMessage({
			killAllJnlpProcesses: "killAllJnlpProcesses"
		}, function (response) {
			if (chrome.runtime.lastError) { }
		});
		_opkeyrecorder.CloseChromeWindow(_opkeyrecorder.opened_window_id);
		_opkeyrecorder.hideContextMenu();


		var image_cropping_win = saas_object.GetGlobalSetting("IMAGE_CROPPING_WIN");
		if (image_cropping_win != null) {
			if (image_cropping_win != "") {
				saas_object.SetGlobalSetting("IMAGE_CROPPING_WIN", "");
				_opkeyrecorder.CloseChromeWindow(parseInt(image_cropping_win));
			}
		}

		var artificate_id = saas_object.GetGlobalSetting("RECORDER_FLOW_DB_ID");
		if (artificate_id != null) {
			_opkeyrecorder.RedirectToSaas(artificate_id);
		}
		var isrecordingfromsaas = saas_object.GetGlobalSetting("isRecordingFromSaas");
		if (isrecordingfromsaas != null) {
			if (isrecordingfromsaas == "true") {
				saas_object.SetGlobalSetting("isRecordingFromSaas", "false");
				chrome.tabs.getCurrent(function (tab) {
					chrome.tabs.remove(tab.id, function () { });
				});
			}
		}

		var flow_chart_tab_id = saas_object.GetGlobalSetting("FLOW_CHART_WinId");
		if (flow_chart_tab_id != null) {
			if (flow_chart_tab_id != "") {
				_opkeyrecorder.CloseChromeWindow(parseInt(flow_chart_tab_id));
			}
		}

		saas_object.UnBlockUI();
		window.location = "/ProjectSelectionPage.html?showContinueAlert";
	}
};

document.addEventListener("DOMContentLoaded", () => {
	const popupOverlay = document.getElementById("popup-overlay");
	const reportIssueButton = document.getElementById("report-issue-button");
	const cancelButton = document.getElementById("cancel-button");

	// Close the popup on cancel
	cancelButton.addEventListener("click", () => {
		popupOverlay.style.display = "none";
	});

	// Report issue functionality
	reportIssueButton.addEventListener("click", () => {
		const traceId = reportIssueButton.dataset.traceId;
		const errorMessage = reportIssueButton.dataset.errorMessage;

		// Ensure the URL is correct. If the backend is on the same server, you can use a relative URL.
		const apiUrl = saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME") + "/ExceptionHandler/ReportErrorViaMail";

		// Sending the error details to the backend
		fetch(apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json", // Set the content type to JSON
			},
			body: JSON.stringify({
				errorId: traceId, // Sending traceId as error ID
				exception: errorMessage, // Sending error message
			}),
		})
			.then((response) => {
				if (response.ok) {
					popupOverlay.style.display = "none";   // Close the popup
				}
			})
			.catch((error) => {
			});
	});

});

function getLTSRMappedName(action_name) {
	if (action_name === "OracleLT_Cancel") {
		return "Cancel API called on the obejct with name LogicalName";
	}

	if (action_name === "OracleLT_Click") {
		return "Click API called on the object with name LogicalName";
	}

	if (action_name === "OracleLT_ClickMenuItem") {
		return "Click API called on the Menu Item with name LogicalName";
	}

	if (action_name === "OracleLT_ConnectToServer") {
		return "Connect to server API called";
	}

	if (action_name === "OracleLT_DeSelectCheckBox") {
		return "Deselect API called on the Checkbox with name LogicalName";
	}

	if (action_name === "OracleLT_FindInLOV") {
		return "Find API called on the LOV with name LogicalName";
	}

	if (action_name === "OracleLT_JavaAction") {
		return "API called for object with name LogicalName";
	}

	if (action_name === "OracleLT_LoginToEbsServer") {
		return "Login API called";
	}

	if (action_name === "OracleLT_SelectCheckBox") {
		return "Select API called on the Checkbox with name LogicalName";
	}

	if (action_name === "OracleLT_SelectFromLov") {
		return "Select API called on the LOV with name LogicalName";
	}

	if (action_name === "OracleLT_SelectItemFromList") {
		return "Select API called on the List with name LogicalName";
	}

	if (action_name === "OracleLT_SelectRadioButton") {
		return "Select API called on the RadioButton with name LogicalName";
	}

	if (action_name === "OracleLT_SelectTab") {
		return "Select API called on the Tab with name LogicalName";
	}

	if (action_name === "OracleLT_TypeTextOnEditBox") {
		return "Type API called on the editbox with name LogicalName";
	}
	if (action_name === "OracleLT_WindowActivated") {
		return "Activation API called for object with name LogicalName";
	}

	if (action_name == "OracleLT_WebApiCall") {
		return "Oracle Web API called for object with name LogicalName";
	}
}


OpkeyRecorder.prototype.SaveRecordingLoadTest = function (recorded_data) {
	//for (let i = 1; i < recorded_data.length; i++) {
	//    if (recorded_data[i].TimeStamp <= recorded_data[i - 1].TimeStamp) {
	//        recorded_data[i].TimeStamp = recorded_data[i - 1].TimeStamp + 1;
	//    }
	//}
	recorded_data.sort((a, b) => a.TimeStamp - b.TimeStamp);
	debugger
	saas_object.BlockUI("Saving...");
	var all_recorded_data = recorded_data;
	var all_datas = [];
	var all_functionalSteps = [];
	var all_loadtestingSteps = [];
	var ltstep_parentId = "00000000-0000-0000-0000-000000000000";
	for (var i = 0; i < all_recorded_data.length; i++) {
		var object_attribute_array = new Array();
		var parent_attribute_array = new Array();
		var step_data = all_recorded_data[i];
		if (step_data != "") {
			var action_name = step_data["Action"];
			var logical_name = step_data["Object"];
			var data_args = step_data["Data"];
			var object_data = step_data["ObjectData"];
			var _timestamp = getCurrentTimeStampString();

			var _requestId = step_data["LTResponse"];

			var WebLT_ResponseString = step_data["WebLT:ResponseString"];
			var WebLT_RequestHeaders = step_data["WebLT:RequestHeaders"];
			var WebLT_RequestData = step_data["WebLT:RequestData"];
			var WebLT_RequestMethod = step_data["WebLT:RequestMethod"];
			var WebLT_RequestUrl = step_data["WebLT:RequestUrl"];
			var _loadTestApiResponse = null;
			if (_requestId != null && _requestId != "") {
				for (var ri = 0; ri < _allEBSReqResponseList.length; ri++) {
					if (_allEBSReqResponseList[ri]["reqId"] == _requestId) {

						_loadTestApiResponse = _allEBSReqResponseList[ri]["response"];
						break;
					}
				}
			}

			if (_timestamp == null) {
				_timestamp = getCurrentTimeStampString();
			}
			logical_name = logical_name.replace(/\n/g, "").replace(/\t/g, "").replace(/  /g, "");
			var parent_object_data = object_data["parent"];
			if (action_name.indexOf("TypeSecureText") > -1) {
				data_args = object_data["unencryptedData"];
			}
			if (action_name == "TypeTextInTextArea") {
				action_name = "TypeText";
			}
			// check here

			$.each(object_data, function (k, v) {
				if (k == "parent") {
					v = null;
				}
				if (k.indexOf("element:") > -1) {
					v = null;
				}
				if (k == "logicalname") {
					logical_name = v;
				}
				if (k == "IsSikuliKeyword") {
					v = null;
				}
				if (k == "sahiText") {
					k = "innertext";
				}
				if (k == "unencryptedData") {
					v = null;
				}
				if (v == "") {
					v = null;
				}
				if (k == "Image") {
					if (v != null) {
						v = v.replace("data:image/png;base64,", "");
						object_attribute_array.push({
							"Name": k,
							"Value": DetectFileSize(v),
							"DataType": "Image"
						});
					}
				} else if (k == "ObjectImage") {
					if (v != null) {
						v = v.replace("data:image/png;base64,", "");
						object_attribute_array.push({
							"Name": k,
							"Value": DetectFileSize(v),
							"DataType": "Image"
						});
					}
				} else {
					if (v != null) {
						object_attribute_array.push({
							"Name": k,
							"Value": v.toString(),
							"DataType": "String"
						});
					}
				}
			});

			$.each(parent_object_data, function (k, v) {
				if (v == "") {
					v = null;
				}
				if (v != null) {
					parent_attribute_array.push({
						"Name": k,
						"Value": v.toString(),
						"DataType": "String"
					});
				}
			});

			var validdatas = [];
			if (data_args != null && data_args != "") {
				if (data_args.indexOf("{") == 0) {
					try {
						var parsed_dataarray = JSON.parse(data_args);
						$.each(parsed_dataarray, function (key, value) {
							validdatas.push(parsed_dataarray[key]);
						});
					} catch (error) { }
				}
			}
			var argumentdata = []
			if (validdatas != null) {
				if (validdatas.length > 0) {
					for (var il = 0; il < validdatas.length; il++) {
						argumentdata.push(validdatas[il])
					}
				}
			}

			if (logical_name.length > 25) {
				logical_name = logical_name.substring(0, 24)
			}

			if (action_name.indexOf("OracleLT_") > -1 && action_name.indexOf("OracleLT_InitializeForm") == -1) {
				if (_loadTestApiResponse == null) {
					_loadTestApiResponse = "[]";
				}
				if (all_functionalSteps.length > 0) {
					var lastFunctionalStep = all_functionalSteps[all_functionalSteps.length - 1];
					if (lastFunctionalStep != null) {
						lastFunctionalStep["hasChildrens"] = true;
					}
				}
				var out_data = new Object();
				var reqMethod = new Object();
				var reqmethodinputparams = [];
				out_data["ServiceName"] = "Rest Service 1";
				out_data["ParentFunctionalStepID"] = ltstep_parentId;
				out_data["ServiceURI"] = "http://oraserver.crestech.com:8000/";
				out_data["ServiceType"] = "REST";
				out_data["PluginName"] = "Oracle EBS Performance Test";
				out_data["RestMethod"] = reqMethod;

				out_data["action"] = "WebServiceMethod";
				out_data["logicalname"] = null;
				out_data["objectProperties"] = null;
				out_data["parentProperties"] = null;
				out_data["dataArgs"] = null;

				var method_name = action_name;
				if (logical_name != null || logical_name != "") {

					method_name = getLTSRMappedName(action_name);
					method_name = method_name.replaceAll("LogicalName", logical_name)
				}
				reqMethod["MethodName"] = method_name;
				reqMethod["RequestMethodType"] = "POST";

				if (WebLT_RequestMethod != null) {
					reqMethod["RequestMethodType"] = WebLT_RequestMethod;
				}

				reqMethod["ResourcePath"] = "/ebsloadtesting/" + action_name;
				if (WebLT_RequestUrl != null) {
					reqMethod["ResourcePath"] = WebLT_RequestUrl;
				}
				reqMethod["OutputType"] = "HttpBody";
				reqMethod["InputParameters"] = reqmethodinputparams;
				reqMethod["SampleResponse"] = _loadTestApiResponse;
				debugger;
				if (WebLT_ResponseString != null) {
					reqMethod["SampleResponse"] = encodeURI(WebLT_ResponseString);
				}
				reqMethod["RecordingTimeStamp"] = _timestamp;

				if (data_args != null && data_args != "") {
					if (data_args.indexOf("{") == 0) {
						var inputParamObject = JSON.parse(data_args);
						$.each(inputParamObject, function (key, value) {
							var _inputObject = new Object();
							reqmethodinputparams.push(_inputObject);
							_inputObject["ParameterName"] = key;
							_inputObject["DefaultValue"] = inputParamObject[key];
							_inputObject["ParameterType"] = "RequestBody";
							_inputObject["ContentType"] = null;

							if (key === "Value" || action_name == "OracleLT_LoginToEbsServer") {
								_inputObject["IsArgument"] = true;
							}
							else {
								_inputObject["IsArgument"] = false;
							}

							if (key === "Password" && action_name == "OracleLT_LoginToEbsServer") {
								_inputObject["IsEncrypted"] = true;
							}
							else {
								_inputObject["IsEncrypted"] = false;
							}
						});
					}
				}

				all_loadtestingSteps.push(out_data);
				all_datas.push(out_data);
			}
			else {
				if (argumentdata.length > 0) {
					var __uuid = createUUID();
					ltstep_parentId = __uuid;
					var out_data = {
						"action": action_name,
						"actionID": __uuid,
						"logicalname": logical_name,
						"objectProperties": object_attribute_array,
						"parentProperties": parent_attribute_array,
						"dataArgs": argumentdata,
						"RecordingTimeStamp": _timestamp,
						"hasChildrens": false
					};
					all_functionalSteps.push(out_data);
					all_datas.push(out_data);
				} else {
					var __uuid = createUUID();
					ltstep_parentId = __uuid;
					var out_data = {
						"action": action_name,
						"actionID": __uuid,
						"logicalname": logical_name,
						"objectProperties": object_attribute_array,
						"parentProperties": parent_attribute_array,
						"dataArgs": [data_args],
						"RecordingTimeStamp": _timestamp,
						"hasChildrens": false
					};
					all_functionalSteps.push(out_data);
					all_datas.push(out_data);
				}
			}
		}
	}
	if (all_datas.length > 0 || isMobileRecording() == true) {

		var saveDataToOpkey = {
			"FunctionalSteps": all_functionalSteps,
			"PerformanceSteps": all_loadtestingSteps
		};

		debugger
		var append_at = "0";
		var append_step_at = saas_object.GetGlobalSetting("TestCaseStepIndex");
		if (append_step_at != null) {
			if (append_step_at != "") {
				append_at = append_step_at;
			}
		}
		var artificate_id = saas_object.GetGlobalSetting("RECORDER_FLOW_DB_ID");
		var or_id = saas_object.GetGlobalSetting("RECORDER_OR_DB_ID");
		var sr_id = saas_object.GetGlobalSetting("RECORDER_SR_DB_ID");
		if (sr_id == null || sr_id == "") {
			sr_id = "00000000-0000-0000-0000-000000000000";
		}

		let isLoadTesting = all_loadtestingSteps.length > 0 ? true : false;

		var save_call_data = {
			moduleType: "Flow",
			orId: or_id,
			srID: sr_id,
			artifactId: artificate_id,
			insertStepsAt: append_at,
			strAllRecordedActionsList: JSON.stringify(saveDataToOpkey),
			recorderType: "SahiRecorderForSaaS",
			serializedMobileAppDto: "",
			strPCloudyCredentials: "",
			strBookingDtoResult: null,
			pathWindowsApplication: "",
			createLoadTestingDependentArtifacts: isLoadTesting
		};

		if (isMobileRecording()) {
			debugger


			var mobileRecorderType = localStorage.getItem("MobileRecorderType");
			if (mobileRecorderType != null && mobileRecorderType == "PcloudyAndriodRecorder") {
				var pcloudtDto = getPcloudyDeviceDto();
				var strBookingDtoResult = pcloudtDto["BookingDTO"];

				var strPCloudyCredentials = pcloudtDto["pCloudyCredentials"];
				save_call_data["recorderType"] = "MobileAndroidRecorder";
				save_call_data["serializedMobileAppDto"] = localStorage.getItem("MobileAppDto");
				save_call_data["strPCloudyCredentials"] = JSON.stringify(strPCloudyCredentials);
				save_call_data["strBookingDtoResult"] = JSON.stringify(strBookingDtoResult);
			}

			if (mobileRecorderType != null && mobileRecorderType == "PcloudyiOSRecorder") {
				var pcloudtDto = getPcloudyDeviceDto();
				var strBookingDtoResult = pcloudtDto["BookingDTO"];

				var strPCloudyCredentials = pcloudtDto["pCloudyCredentials"];
				save_call_data["recorderType"] = "MobileiOSRecorder";
				save_call_data["serializedMobileAppDto"] = localStorage.getItem("MobileAppDto");
				save_call_data["strPCloudyCredentials"] = JSON.stringify(strPCloudyCredentials);
				save_call_data["strBookingDtoResult"] = JSON.stringify(strBookingDtoResult);
			}

			if (mobileRecorderType != null && mobileRecorderType == "LocalAndriodRecorder") {
				save_call_data["recorderType"] = "LocalAndriodRecorder";
				save_call_data["serializedMobileAppDto"] = localStorage.getItem("MobileAppDto");
			}
		}

		debugger
		$.ajax({
			url: saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME") + "/ComponentFlow/ProcessFunctionalAndLoadTestingRecorderSteps",
			//url: "https://localhost:44392/ComponentFlow/ProcessFunctionalAndLoadTestingRecorderSteps",
			type: "POST",
			datatype: "jsonp",
			data: save_call_data,
			appendOpkeyVersionApi: true,
			success: function (returned_data) {
				debugger
				_opkeyrecorder.stopLocalRecorder();
				saas_object.SetGlobalSetting("TestCaseStepIndex", "");
				chrome.runtime.sendMessage({
					killAllJnlpProcesses: "killAllJnlpProcesses"
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});
				chrome.runtime.sendMessage({
					setResume: "setResume"
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});
				chrome.runtime.sendMessage({
					ResetRecordingPageId: "ResetRecordingPageId"
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});
				_opkeyrecorder.CloseChromeWindow(_opkeyrecorder.opened_window_id);
				saas_object.UnBlockUI();
				_opkeyrecorder.hideContextMenu();
				var image_cropping_win = saas_object.GetGlobalSetting("IMAGE_CROPPING_WIN");
				if (image_cropping_win != null) {
					if (image_cropping_win != "") {
						saas_object.SetGlobalSetting("IMAGE_CROPPING_WIN", "");
						_opkeyrecorder.CloseChromeWindow(parseInt(image_cropping_win));
					}
				}
				_opkeyrecorder.RedirectToSaas(artificate_id);
				var isrecordingfromsaas = saas_object.GetGlobalSetting("isRecordingFromSaas");
				if (isrecordingfromsaas != null) {
					if (isrecordingfromsaas == "true") {
						saas_object.SetGlobalSetting("isRecordingFromSaas", "false");
						chrome.tabs.getCurrent(function (tab) {
							chrome.tabs.remove(tab.id, function () { });
						});
					}
				}

				var flow_chart_tab_id = saas_object.GetGlobalSetting("FLOW_CHART_WinId");
				if (flow_chart_tab_id != null) {
					if (flow_chart_tab_id != "") {
						_opkeyrecorder.CloseChromeWindow(parseInt(flow_chart_tab_id));
					}
				}

				if (localStorage.getItem("ServerAppType") == "OPKEYSTUDIO") {
					chrome.runtime.sendMessage({
						setDockerCommand: {
							"action": "stoprecordingtestdiscovery"
						}
					}, function (response) {
						if (chrome.runtime.lastError) { }
					});
				}

				restoreRecorderWindow();
				window.location = "/Login.html?action=recorder_stop&success=true";
			},
			error: function (returned_error_data) {
				saas_object.UnBlockUI();
				try {
					try {
						var error_jsonobject = JSON.parse(returned_error_data.responseText);
					} catch (error) { }
					const popupOverlay = document.getElementById("popup-overlay");
					const traceIdElement = document.getElementById("trace-id");
					traceIdElement.textContent = createUUID();
					popupOverlay.style.display = "block";
					const reportIssueButton = document.getElementById("report-issue-button");
					try {
						reportIssueButton.dataset.errorMessage = ":::::: Error from Recorder side:::::: " + error_jsonobject.message;
					} catch (error) {
						reportIssueButton.dataset.errorMessage = ":::::: Error from Recorder side:::::: Step not saved";
					}
					reportIssueButton.dataset.traceId = traceIdElement.textContent;
				} catch (e) {
					saas_object.ShowErrorWithHtmlRendered(returned_error_data.responseText)
				}

			}
		});
	} else {
		if (localStorage.getItem("ServerAppType") == "OPKEYSTUDIO") {
			chrome.runtime.sendMessage({
				setDockerCommand: {
					"action": "stoprecordingtestdiscovery"
				}
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
		}
		chrome.runtime.sendMessage({
			killAllJnlpProcesses: "killAllJnlpProcesses"
		}, function (response) {
			if (chrome.runtime.lastError) { }
		});
		_opkeyrecorder.CloseChromeWindow(_opkeyrecorder.opened_window_id);
		_opkeyrecorder.hideContextMenu();


		var image_cropping_win = saas_object.GetGlobalSetting("IMAGE_CROPPING_WIN");
		if (image_cropping_win != null) {
			if (image_cropping_win != "") {
				saas_object.SetGlobalSetting("IMAGE_CROPPING_WIN", "");
				_opkeyrecorder.CloseChromeWindow(parseInt(image_cropping_win));
			}
		}

		var artificate_id = saas_object.GetGlobalSetting("RECORDER_FLOW_DB_ID");
		if (artificate_id != null) {
			_opkeyrecorder.RedirectToSaas(artificate_id);
		}
		var isrecordingfromsaas = saas_object.GetGlobalSetting("isRecordingFromSaas");
		if (isrecordingfromsaas != null) {
			if (isrecordingfromsaas == "true") {
				saas_object.SetGlobalSetting("isRecordingFromSaas", "false");
				chrome.tabs.getCurrent(function (tab) {
					chrome.tabs.remove(tab.id, function () { });
				});
			}
		}

		var flow_chart_tab_id = saas_object.GetGlobalSetting("FLOW_CHART_WinId");
		if (flow_chart_tab_id != null) {
			if (flow_chart_tab_id != "") {
				_opkeyrecorder.CloseChromeWindow(parseInt(flow_chart_tab_id));
			}
		}

		saas_object.UnBlockUI();
		window.location = "/ProjectSelectionPage.html?showContinueAlert";
	}
};

function getCurrentTimeStamp() {
	const timestamp = Date.now();
	return timestamp;
}

function getCurrentTimeStampString() {
	// YYYY-MM-DD H:M:S.ms
	var currentDate = new Date();
	return currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate() + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds() + "." + currentDate.getMilliseconds();
}

OpkeyRecorder.prototype.CloseChromeWindow = function (window_id) {
	if (window_id == -1) {
		return;
	}

	chrome.windows.remove(window_id, function (win) { })
};


OpkeyRecorder.prototype.stringifyData = function (data) {
	return JSON.stringify(data);
};

OpkeyRecorder.prototype.highlightPrev = function (gridname) {
	var gridinstance = $("#" + gridname);
	var key = gridinstance.jqGrid('getGridParam', 'selrow');
	if (!key) return;
	var row = $('#' + key);
};

OpkeyRecorder.prototype.highlightNext = function (gridname) {
	var gridinstance = $("#" + gridname);
	var key = gridinstance.jqGrid('getGridParam', 'selrow');
	if (!key) return;
	var row = $('#' + key);
};


function arraymove(arr, fromIndex, toIndex) {
	fromIndex = fromIndex - 1;
	toIndex = toIndex - 1;
	// debugger;
	var element = arr[fromIndex];
	arr.splice(fromIndex, 1);
	arr.splice(toIndex, 0, element);
}

OpkeyRecorder.prototype.moveRowUpAndDownInGrid = function (gridname, moveUP) {
	var gridinstance = $("#" + gridname);
	var key = gridinstance.jqGrid('getGridParam', 'selrow');
	if (!key) return;
	var row = $(".ui-state-highlight");
	//adding the filteredRows for fix the bug with bugid ID-42019
	var filteredRows = $();
	for (var i = 0; i < row.length; i++) {
		console.log("element is ::: <<" + row[i]);
		var tdElements = row[i].getElementsByTagName("td");
		if (tdElements != null && tdElements.length > 0 && tdElements[0].getAttribute("aria-describedby") != null && tdElements[0].getAttribute("aria-describedby").includes("spydomgrid")) {
			continue;
		}
		filteredRows = filteredRows.add(row[i]);
	}
	if (filteredRows.length === 0) {
		filteredRows = row;
	}
	if (moveUP) {
		var prev = filteredRows.prev('.jqgrow');
		var currentkeyid = filteredRows.attr("id");
		var prevkeyid = prev.attr("id");
		filteredRows.attr("id", prevkeyid);
		prev.attr("id", currentkeyid);
		if (prev.length > 0) {
			changeTimeStamp(prevkeyid, currentkeyid);
			filteredRows.detach().insertBefore(prev);
			$(filteredRows).click();
			arraymove(_opkeyrecorder.allrecordedstepsarray, parseInt(currentkeyid), parseInt(prevkeyid));
			saas_object.ShowToastMessage("", "Selected step Moved up");
			sendDataToDockerRecorderGrid(_opkeyrecorder.allrecordedstepsarray);
			return 1;
		}
	} else {
		var next = filteredRows.next('.jqgrow');
		var currentkeyid = filteredRows.attr("id");
		var nextkeyid = next.attr("id");
		filteredRows.attr("id", nextkeyid);
		next.attr("id", currentkeyid);
		if (next.length > 0) {
			changeTimeStamp(nextkeyid, currentkeyid);
			filteredRows.detach().insertAfter(next);
			$(filteredRows).click();
			arraymove(_opkeyrecorder.allrecordedstepsarray, parseInt(currentkeyid), parseInt(nextkeyid));
			saas_object.ShowToastMessage("", "Selected step Moved down");
			sendDataToDockerRecorderGrid(_opkeyrecorder.allrecordedstepsarray);
			return 1;
		}
	}
	sendDataToDockerRecorderGrid(_opkeyrecorder.allrecordedstepsarray);
};
function changeTimeStamp(prevkeyid, currentkeyid) {
	var prevData = _opkeyrecorder.allrecordedstepsarray[Number(prevkeyid) - 1];
	var currData = _opkeyrecorder.allrecordedstepsarray[Number(currentkeyid) - 1];

	if (prevData && currData) {
		var temp = currData["TimeStamp"];
		currData["TimeStamp"] = prevData["TimeStamp"];
		prevData["TimeStamp"] = temp;

		// Update in UI safely
		$("#yourGridId").jqGrid('setCell', prevkeyid, 'TimeStampColumn', prevData["TimeStamp"]);
		$("#yourGridId").jqGrid('setCell', currentkeyid, 'TimeStampColumn', currData["TimeStamp"]);

		console.log("Timestamp updated for prevkeyid:", prevkeyid, "New Timestamp:", prevData["TimeStamp"]);
		console.log("Timestamp updated for currentkeyid:", currentkeyid, "New Timestamp:", currData["TimeStamp"]);
	} else {
		console.log("No data found for id:", prevkeyid);
	}
}

OpkeyRecorder.prototype.getSelectedRowOfGrid = function (gridname) {
	var selectedRowId = $("#" + gridname).jqGrid('getGridParam', 'selrow');
	return selectedRowId;
};

OpkeyRecorder.prototype.getTotalRowsOfGrid = function (gridname) {
	var totalrows = $("#" + gridname).jqGrid('getGridParam', 'records');
	return totalrows;
};


OpkeyRecorder.prototype.RefreshDataIngridAndAssignId = function (grid_name) {
	var grid_object = document.getElementById(grid_name);
	var rows_of_grid_object = grid_object.getElementsByTagName("TR");
	var row_index = 1;
	for (var tr_index = 0; tr_index < rows_of_grid_object.length; tr_index++) {
		var tr_element = rows_of_grid_object[tr_index];
		if (tr_element.getAttribute("id") != null) {
			$(tr_element).attr("id", row_index);
			row_index++;
		}
	}
};

OpkeyRecorder.prototype.GetAllSelectedRowsOfGrid = function (grid_name) {
	var returned_row_no = [];
	var grid_object = document.getElementById(grid_name);
	var rows_of_grid_object = grid_object.getElementsByTagName("TR");
	for (var tr_index = 0; tr_index < rows_of_grid_object.length; tr_index++) {
		var tr_element = rows_of_grid_object[tr_index];
		if (tr_element.getAttribute("aria-selected") == "true") {
			returned_row_no.push($(tr_element).attr("id"));
		}
	}
	return returned_row_no;
};

OpkeyRecorder.prototype.deleteElementFromArray = function (in_array, select_index) {
	var out_array = new Array();
	// ////debugger;
	for (var s_in = 0; s_in < select_index.length; s_in++) {
		var selected_index = parseInt(select_index[s_in]);
		if (selected_index != 0) {
			selected_index--;
			_opkeyrecorder.allrecordedstepsarray[selected_index] = "";
		}
	}
	sendDataToDockerRecorderGrid(_opkeyrecorder.allrecordedstepsarray);
};

OpkeyRecorder.prototype.AutoNavigate = function () {
	var app_url = saas_object.GetGlobalSetting("APPLICATION_URL");
	if (app_url != null) {
		if (app_url.trim() != "") {
			_opkeyrecorder.Navigate(app_url);
		} else {
			_opkeyrecorder.Navigate("http://sstsinc.com")
		}
	} else {
		_opkeyrecorder.Navigate("http://sstsinc.com")
	}
};

OpkeyRecorder.prototype.GetVeevaAuthToken = function () {
	var accessUrl = $("#accessUrl").val();
	var veevausername = $("#veevauser").val();
	var veevapassword = $("#veevapassword").val();

	if (accessUrl.trim() === "") {
		saas_object.ShowToastMessage("error", "Please Enter Access Url.");
		return;
	}
	if (veevausername.trim() === "") {
		saas_object.ShowToastMessage("error", "Please Enter UserName.");
		return;
	}
	if (veevapassword.trim() === "") {
		saas_object.ShowToastMessage("error", "Please Enter Password.");
		return;
	}

	chrome.runtime.sendMessage({
		InitializeVeevaParameter: {
			"accessURL": accessUrl,
			"username": veevausername,
			"password": veevapassword
		}
	}, function (response) {
		if (chrome.runtime.lastError) { }
	});

	_opkeyrecorder.loginToVeevaInstance(accessUrl, veevausername, veevapassword);
}

OpkeyRecorder.prototype.loginToVeevaInstance = function (accessurl, username, password) {
	saas_object.BlockUI("");
	$.ajax({
		url: accessurl + "/api/v20.3/auth",
		type: "Post",
		data: {
			"username": username,
			"password": password
		},
		success: function (tokens_data) {
			console.log(tokens_data);
			var sessionId = tokens_data["sessionId"];
			_opkeyrecorder.GetAllVeevaObjects(accessurl, sessionId);
		},
		error: function (error_data) { }
	});
}

OpkeyRecorder.prototype.GetAllVeevaObjects = function (accessUrl, sessionId) {
	_opkeyrecorder.veeva_metdata_array = [];
	$.ajax({
		url: accessUrl + "/api/v20.3/metadata/vobjects",
		type: "Get",
		headers: {
			"Authorization": "Bearer " + sessionId
		},
		success: function (objects_data) {
			var allObjects = objects_data["objects"];
			for (var aoi = 0; aoi < allObjects.length; aoi++) {
				var _object = allObjects[aoi];
				_opkeyrecorder.GetAllVeevaObjectsFields(accessUrl, sessionId, _object["name"]);
			}
			unBlockAndCloseVeevaUi();
		},
		error: function (error_object) {

		}
	});
};

OpkeyRecorder.prototype.GetAllVeevaObjectsFields = function (accessUrl, sessionId, objectName) {
	$.ajax({
		url: accessUrl + "/api/v20.3/metadata/vobjects/" + objectName,
		type: "Get",
		async: false,
		headers: {
			"Authorization": "Bearer " + sessionId
		},
		success: function (objects_data) {
			var field_array = objects_data["object"]["fields"];
			if (field_array != null) {
				for (var fai = 0; fai < field_array.length; fai++) {
					var field_object = field_array[fai];
					var newApiObect = new Object();
					newApiObect["ObjectName"] = objectName;
					newApiObect["FieldName"] = field_object["name"];
					newApiObect["FieldLabel"] = field_object["label"];
					//add this in array
					_opkeyrecorder.veeva_metdata_array.push(newApiObect);
				}
			}
		},
		error: function (error_object) {

		}
	});
};

function unBlockAndCloseVeevaUi() {
	saas_object.UnBlockUI();
	$("#veevaAuthorizationTokenDialog").dialog("close");
}

OpkeyRecorder.prototype.GetAuthToken = function () {
	if ($("#tokenAuth").is(":checked")) {
		var accessUrl = $("#accessUrl").val();
		var accessToken = $("#accessToken").val();
		var orgId = $("#orgId").val();

		if (accessUrl.trim() === "") {
			saas_object.ShowToastMessage("error", "Please Enter Access Url.");
			return;
		}
		if (accessToken.trim() === "") {
			saas_object.ShowToastMessage("error", "Please Enter Access Token.");
			return;
		}
		if (orgId.trim() === "") {
			saas_object.ShowToastMessage("error", "Please Enter OrgId.");
			return;
		}
		chrome.runtime.sendMessage({
			InitializeSalesforceParameter: {
				"accessURL": accessUrl,
				"accessToken": accessToken,
				"orgId": orgId
			}
		}, function (response) {
			if (chrome.runtime.lastError) { }
		});
		chrome.runtime.sendMessage({
			SetAuthAcquired: "SetAuthAcquired"
		}, function (response) {
			if (chrome.runtime.lastError) { }
		});

		$("#authorizationTokenDialog").dialog("close");
		return;
	}

	var url_value = $("#url_authtoken").val();
	var environment_type = $("#changeEnvironmentType_authtoken").val();
	var clientid_value = $("#clientid_authtoken").val();
	var clientsecret_value = $("#clientsecret_authtoken").val();
	var username_value = $("#username_authtoken").val();
	var sdata_value = DOMPurify.sanitize($("#sdata_authtoken").val());
	var session_data = {
		environment: environment_type,
		url: url_value,
		clientId: clientid_value,
		clientSecret: clientsecret_value,
		username: username_value,
		password: sdata_value
	}

	saas_object.SetGlobalSetting("OPKEY_INFO", JSON.stringify(session_data));
	var token_url = url_value + "/services/oauth2/token";
	var token_data = {
		"grant_type": "password",
		"client_id": clientid_value,
		"client_secret": clientsecret_value,
		"username": username_value,
		"password": sdata_value
	}
	saas_object.BlockUI("");
	$.ajax({
		url: token_url,
		type: "Post",
		data: token_data,
		success: function (tokens_data) {
			var access_token = tokens_data["access_token"];
			var instance_url = tokens_data["instance_url"];
			var id_url = tokens_data["id"];
			id_url = id_url.split("/id/");
			id_url = id_url[1].split("/");
			id_url = id_url[0];
			$.ajax({
				url: instance_url + "/services/data/v40.0",
				type: "Get",
				headers: {
					"Authorization": "Bearer " + access_token
				},
				contentType: "application/json",
				success: function (returned_data) {
					chrome.runtime.sendMessage({
						InitializeSalesforceParameter: {
							"accessURL": instance_url,
							"accessToken": access_token,
							"orgId": id_url
						}
					}, function (response) {
						if (chrome.runtime.lastError) { }
					});
					var data_args = new Object();
					data_args["Url"] = url_value
					data_args["Consumer Key"] = clientid_value
					data_args["Consumer Secret"] = clientsecret_value
					data_args["Username"] = username_value
					data_args[rotDHX("0a000c200e600e600ee00de00e400c80", 5)] = sdata_value

					var gettokenkeyword_object = new Object();
					var parent_object = new Object();
					parent_object["url"] = url_value;
					var or_object_1 = new Object();
					or_object_1["logicalname"] = ""
					or_object_1["parent"] = parent_object;
					gettokenkeyword_object["Action"] = "SF_GetAuthorizationToken";
					gettokenkeyword_object["Object"] = "";
					gettokenkeyword_object["Data"] = JSON.stringify(data_args);
					gettokenkeyword_object["ObjectData"] = or_object_1;
					gettokenkeyword_object["TimeStamp"] = getCurrentTimeStamp();
					_opkeyrecorder.allrecordedstepsarray.push(gettokenkeyword_object);
					_opkeyrecorder.addDataToRecorderStepGrid(_opkeyrecorder.allrecordedstepsarray.length, gettokenkeyword_object);
					saas_object.UnBlockUI();

					chrome.runtime.sendMessage({
						SetAuthAcquired: "SetAuthAcquired"
					}, function (response) {
						if (chrome.runtime.lastError) { }
					});

					$("#authorizationTokenDialog").dialog("close");
				},
				error: function (error_data) {
					saas_object.UnBlockUI();
					saas_object.ShowToastMessage("error", "Unable to call Salesforce Metadata API. API_IS_DISABLED in your org. You need to enable it.")
				}
			});
		},
		error: function (error_data) {
			saas_object.UnBlockUI();
			saas_object.ShowToastMessage("error", "Unable to fetch token from given Salesforce URL")
		}
	})
};

function rotl16(value, bits) {
	return ((value << bits) | (value >>> (16 - bits))) & 0xFFFF;
}


function rotr16(value, bits) {
	return ((value >>> bits) | (value << (16 - bits))) & 0xFFFF;
}


function rotEHX(plainText, shift) {
	if (shift < 1 || shift > 15) {
		throw new Error('Shift must be between 1 and 15');
	}
	const hexChunks = [];
	for (let ch of plainText) {
		const code = ch.charCodeAt(0);
		const rotated = rotl16(code, shift);
		// toString(16) → hex, pad to 4 chars (0x0000–0xFFFF)
		hexChunks.push(rotated.toString(16).padStart(4, '0'));
	}
	return hexChunks.join('');
}


function rotDHX(hexString, shift) {
	if (shift < 1 || shift > 15) {
		throw new Error('Shift must be between 1 and 15');
	}
	if (hexString.length % 4 !== 0) {
		throw new Error('Invalid hex string');
	}
	let result = '';
	for (let i = 0; i < hexString.length; i += 4) {
		const chunk = hexString.slice(i, i + 4);
		const code = parseInt(chunk, 16);
		const orig = rotr16(code, shift);
		result += String.fromCharCode(orig);
	}
	return result;
}

OpkeyRecorder.prototype.Navigate = function (navigateurl) {
	if ((!navigateurl.startsWith("http://")) && (!navigateurl.startsWith("https://")) && (!navigateurl.startsWith("ftp://")) && (!navigateurl.startsWith("file://"))) {
		navigateurl = "http://" + navigateurl;
	}
	if (_opkeyrecorder.currentopenedwindow == null) {
		_opkeyrecorder.CloseChromeWindow(_opkeyrecorder.opened_window_id);

		if (chrome.system == null) {
			var _bounds = screen;
			var _width = (_bounds.width / 100) * 70;
			var _height = _bounds.height;
			var _x = (_bounds.width / 100) * 30;
			_width = Math.trunc(_width);
			_height = Math.trunc(_height);
			_x = Math.trunc(_x);
			chrome.windows.create({
				url: navigateurl,
				left: _x + 1,
				top: 0,
				width: _width,
				height: _height
			}, function (win) {
				_opkeyrecorder.opened_window_id = win.id;
				enableDockerInRecordingWindow(win.id);
				chrome.runtime.sendMessage({
					setCurrentWindowID: win.id
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});
				_opkeyrecorder.currentopenedwindow = win
			});
		}
		else {
			chrome.system.display.getInfo(function (displayInfo) {
				var _bounds = displayInfo[0].bounds;
				var _width = (_bounds.width / 100) * 70;
				var _height = _bounds.height;
				var _x = (_bounds.width / 100) * 30;
				_width = Math.trunc(_width);
				_height = Math.trunc(_height);
				_x = Math.trunc(_x);
				chrome.windows.create({
					url: navigateurl,
					left: _x + 1,
					top: 0,
					width: _width,
					height: _height
				}, function (win) {
					_opkeyrecorder.opened_window_id = win.id;
					enableDockerInRecordingWindow(win.id);
					chrome.runtime.sendMessage({
						setCurrentWindowID: win.id
					}, function (response) {
						if (chrome.runtime.lastError) { }
					});
					_opkeyrecorder.currentopenedwindow = win
				});
			});
		}
		chrome.windows.onRemoved.addListener(function (win) {
			_opkeyrecorder.currentopenedwindow = null;
		});
	} else {
		chrome.tabs.query({
			windowId: _opkeyrecorder.opened_window_id
		}, function (tabs_inside_window) {
			for (var tab_index = 0; tab_index < tabs_inside_window.length; tab_index++) {
				var tab_of_window = tabs_inside_window[tab_index];
				chrome.tabs.update(tab_of_window.id, {
					url: navigateurl
				}, function (response) { });
				break;
			}

		});

	}
};


OpkeyRecorder.prototype.NavigatePcloudyUrl = function () {
	var navigateurl = null;


	var pcloudyDeviceDto = getPcloudyDeviceDto();
	if (pcloudyDeviceDto == null) {
		return;
	}

	navigateurl = localStorage.getItem("OPKEY_DOMAIN_NAME") + pcloudyDeviceDto["Url"];

	if (navigateurl == null) {
		return;
	}

	if ((!navigateurl.startsWith("http://")) && (!navigateurl.startsWith("https://")) && (!navigateurl.startsWith("ftp://")) && (!navigateurl.startsWith("file://"))) {
		navigateurl = "http://" + navigateurl;
	}
	if (_opkeyrecorder.currentopenedwindow == null) {
		_opkeyrecorder.CloseChromeWindow(_opkeyrecorder.opened_window_id);

		if (chrome.system == null) {
			var _bounds = screen;
			var _width = (_bounds.width / 100) * 70;
			var _height = _bounds.height;
			var _x = (_bounds.width / 100) * 30;
			_width = Math.trunc(_width);
			_height = Math.trunc(_height);
			_x = Math.trunc(_x);
			chrome.windows.create({
				url: navigateurl,
				type: 'panel',
				state: "normal",
				left: _x + 1,
				top: 0,
				width: _width,
				height: _height
			}, function (win) {
				_opkeyrecorder.opened_window_id = win.id;
				enableDockerInRecordingWindow(win.id);
				chrome.runtime.sendMessage({
					setCurrentWindowID: win.id
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});
				_opkeyrecorder.currentopenedwindow = win
			});
		}
		else {
			chrome.system.display.getInfo(function (displayInfo) {
				var _bounds = displayInfo[0].bounds;
				var _width = (_bounds.width / 100) * 70;
				var _height = _bounds.height;
				var _x = (_bounds.width / 100) * 30;
				_width = Math.trunc(_width);
				_height = Math.trunc(_height);
				_x = Math.trunc(_x);
				chrome.windows.create({
					url: navigateurl,
					type: 'panel',
					state: "normal",
					left: _x + 1,
					top: 0,
					width: _width,
					height: _height
				}, function (win) {
					_opkeyrecorder.opened_window_id = win.id;
					enableDockerInRecordingWindow(win.id);
					chrome.runtime.sendMessage({
						setCurrentWindowID: win.id
					}, function (response) {
						if (chrome.runtime.lastError) { }
					});
					_opkeyrecorder.currentopenedwindow = win
				});
			});
		}
		chrome.windows.onRemoved.addListener(function (win) {
			_opkeyrecorder.currentopenedwindow = null;
		});
	} else {
		chrome.tabs.query({
			windowId: _opkeyrecorder.opened_window_id
		}, function (tabs_inside_window) {
			for (var tab_index = 0; tab_index < tabs_inside_window.length; tab_index++) {
				var tab_of_window = tabs_inside_window[tab_index];
				chrome.tabs.update(tab_of_window.id, {
					url: navigateurl
				}, function (response) { });
				break;
			}

		});

	}
};

chrome.runtime.sendMessage({
	setDockerCommand: {
		"action": "COMMAND_ACCEPTED"
	}
}, function (response) {

});

var is_maingrid_mouse_down = false;
var is_maingrid_mouse_up = false;
var is_controlKey_down = false;
$(function () {
	$("#rightClickKeywords_type").change(function (e) {
		_opkeyrecorder.ToggleRightClickKeywords($(this).val());
	});

	$("#changeEnvironmentType_authtoken").change(function (e) {
		var selected_option = $("#changeEnvironmentType_authtoken :selected");
		var selected_option_value = selected_option.val();
		if (selected_option_value == "Production") {
			$("#url_authtoken").val("https://login.salesforce.com");
		} else if (selected_option_value == "SandBox") {
			$("#url_authtoken").val("https://test.salesforce.com");
		}

		$("#clientid_authtoken").val("");
		$("#clientsecret_authtoken").val("");
		$("#username_authtoken").val("");
		$("#sdata_authtoken").val("");
	});

	function initializeAllDropdownKeywords(prepend) {
		var keywords_option = _opkeyrecorder.keywords_list;
		if (prepend == "OracleFusion_") {
			keywords_option = _opkeyrecorder.oracle_keywords_list;
		}
		$("#stepsArray").html('');
		$("#spyStepsArray").html('');
		$("#stepsholder").html('');
		$("#edit_stepsholder").html('');

		for (var i = 0; i < keywords_option.length; i++) {
			if (keywords_option[i].indexOf("Image_") == 0) {
				prepend = "";
			}

			appendSanitizedOption("stepsArray", prepend + keywords_option[i]);
			appendSanitizedOption("spyStepsArray", prepend + keywords_option[i]);
			appendSanitizedOption("stepsholder", prepend + keywords_option[i]);
			appendSanitizedOption("edit_stepsholder", prepend + keywords_option[i]);
		}

		$("#stepsholder").change();
		$("#edit_stepsholder").change();
	}

	$("#stepsholder").change(function (e) {
		var _selectedkeyword = $('#stepsholder option:selected').val();
		if (_selectedkeyword) {
			for (var k_l = 0; k_l < _opkeyrecorder.keywords_info.length; k_l++) {
				var current_keyword_object = _opkeyrecorder.keywords_info[k_l];
				if (current_keyword_object["keywordname"] == _selectedkeyword.replace("SF_", "").replace("WD_", "").replace("OracleFusion_", "").replace("MSD_", "").replace("PS_", "").replace("KRONOS_", "").replace("SAPFiori_", "").replace("MSDFSO_", "").replace("Coupa_", "").replace("Veeva_", "").replace("ServiceNow_", "").replace("JDE_", "")) {
					var _info = current_keyword_object["Info"];
					if (_info["r_object"] == true) {
						$("#objectholder_group").show();
					} else {
						$("#objectholder_group").hide();
					}

					if (_info["r_data"] == true) {
						$("#dataargs_group").show();
					} else {
						$("#dataargs_group").hide();
					}
				}
			}
		}
	});

	$("#edit_stepsholder").change(function (e) {
		debugger
		var _selectedkeyword = $('#edit_stepsholder option:selected').val();
		if (_selectedkeyword) {
			for (var sk_l = 0; sk_l < _opkeyrecorder.keywords_info.length; sk_l++) {
				var current_keyword_object = _opkeyrecorder.keywords_info[sk_l];
				if (current_keyword_object["keywordname"] == _selectedkeyword.replace("SF_", "").replace("WD_", "").replace("OracleFusion_", "").replace("MSD_", "").replace("PS_", "").replace("KRONOS_", "").replace("SAPFiori_", "").replace("MSDFSO_", "").replace("Veeva_", "").replace("Coupa_", "").replace("JDE_", "")) {
					var _info = current_keyword_object["Info"];
					if (_info["r_object"] == true) {
						$("#edit_objectholder_group").show();
					} else {
						$("#edit_objectholder_group").hide();
					}

					if (_info["r_data"] == true) {
						$("#edit_dataargs_group").show();
					} else {
						$("#edit_dataargs_group").hide();
					}
				}
			}
		}
	});

	$("#rightClickKeywords").change(function (e) {
		var isHumanTriggered = false;
		var _isTriggered = _opkeyrecorder.isChangeTriggered;
		// console.log("isTriggered "+_isTriggered);
		if (_isTriggered == false) {
			isHumanTriggered = true;
		}
		// right click keywords==
		var table_arguments_holder_element = document.getElementById("rightclickarguments_holder");
		table_arguments_holder_element.innerHTML = "";
		var arguments_array = [];
		// ////debugger;
		var selected_option = $("#rightClickKeywords :selected")
		var selected_keyword_name = selected_option.text();
		var keyword_data_string = selected_option.attr("keyword_data");
		var step_data_string = selected_option.attr("STEP_OBJECT");
		var step_data_object = JSON.parse(step_data_string);
		var data_arguments_0 = step_data_object.arguments[1];
		var object_arguments_0 = step_data_object.arguments[0];
		var keyword_data_object = JSON.parse(keyword_data_string);
		if (keyword_data_object["requireobject"] == true) {
			$('#rightClickModalContent').attr("mod_or_object", JSON.stringify(object_arguments_0));
			_opkeyrecorder.RenderAllObjectAttributesInRightClick(object_arguments_0);
		} else {
			var stringified_object_arguments = JSON.stringify(object_arguments_0);
			var _object_arguments = JSON.parse(stringified_object_arguments);
			if (_object_arguments != null) {
				var parent_object = _object_arguments["parent"];
				var _new_or_object = new Object();
				_new_or_object["ObjectImage"] = "";
				if (_object_arguments["logicalname"] != null) {
					_new_or_object["logicalname"] = _object_arguments["logicalname"];
				}
				if (_object_arguments["theme"] != null) {
					_new_or_object["theme"] = _object_arguments["theme"];
				}
				if (_object_arguments["hasVisualForcePage"] != null) {
					_new_or_object["hasVisualForcePage"] = _object_arguments["hasVisualForcePage"];
				}
				_new_or_object["parent"] = parent_object;
				// selected_option.attr("OBJECT_ARGUMENTS",JSON.stringify(_new_or_object));
				$('#rightClickModalContent').attr("mod_or_object", JSON.stringify(_new_or_object));
				_opkeyrecorder.RenderAllObjectAttributesInRightClick(_new_or_object);
			}
		}
		var keywords_arguments_1 = keyword_data_object["keywordargumentarray"];
		var keywords_arguments_datatype = keyword_data_object["datatypearray"];

		var keywords_arguments = [];
		for (var k_a = 0; k_a < keywords_arguments_1.length; k_a++) {
			var key_name = keywords_arguments_1[k_a];
			keywords_arguments.push(key_name.toLowerCase());
		}
		var data_arguments_array = [];
		var attribute_arguments_array = [];
		if (data_arguments_0.type == "string") {
			data_arguments_array.push(data_arguments_0.data);
		} else if (data_arguments_0.type == "object") {
			var datas_of_argumnets = data_arguments_0.data;
			datas_of_argumnets = JSON.parse(datas_of_argumnets);
			$.each(datas_of_argumnets, function (key, value) {
				attribute_arguments_array.push(key.toLowerCase());
				data_arguments_array.push(datas_of_argumnets[key])
			});
		}
		for (var k_a_i = 0; k_a_i < keywords_arguments.length; k_a_i++) {
			var argument_object = new Object();
			var arg_name = keywords_arguments[k_a_i];
			var arg_type = keywords_arguments_datatype[k_a_i];
			argument_object["Name"] = arg_name;
			argument_object["Type"] = arg_type;
			arguments_array.push(argument_object);
		}

		var tbody_element = document.createElement("TBODY");

		for (var a_a_i = 0; a_a_i < arguments_array.length; a_a_i++) {
			var arg_object = arguments_array[a_a_i];
			var arg_name = arg_object["Name"];
			var arg_type = arg_object["Type"];
			var tr_element = document.createElement("TR");
			var td_Name_element = document.createElement("TD");
			td_Name_element.id = "Name";
			td_Name_element.innerText = arg_name;
			var td_Type_element = document.createElement("TD");
			td_Type_element.id = "Type";

			var input_element = document.createElement("INPUT");
			if (arg_type == "STRING" || arg_type == "String") {
				input_element.type = "text";
				if (attribute_arguments_array.indexOf(arg_name) > -1) {
					var attribute_arg_index = attribute_arguments_array.indexOf(arg_name.toLowerCase());
					input_element.value = data_arguments_array[attribute_arg_index];
				} else {
					input_element.value = ""
				}
				if (selected_keyword_name == "SF_AccountExists" ||
					selected_keyword_name == "SF_ContactExists" ||
					selected_keyword_name == "SF_LeadExists" ||
					selected_keyword_name == "SF_OpportunityExists" ||
					selected_keyword_name == "SF_GroupExists" ||
					selected_keyword_name == "SF_QuoteExists" ||
					selected_keyword_name == "SF_EditContactInTable" ||
					selected_keyword_name == "SF_EditLeadInTable" ||
					selected_keyword_name == "SF_EditOpportunityInTable" ||
					selected_keyword_name == "SF_EditAccountInTable") {
					input_element.value = "";
				}
				input_element.fieldName = arg_name;
				input_element.placeholder = "Enter " + arg_name + "";
				input_element.title = "Enter " + arg_name + "";
				td_Type_element.appendChild(input_element);
			} else if (arg_type == "INT" || arg_type == "Integer") {
				input_element.type = "number";
				if (attribute_arguments_array.indexOf(arg_name) > -1) {
					var attribute_arg_index = attribute_arguments_array.indexOf(arg_name.toLowerCase());
					input_element.value = data_arguments_array[attribute_arg_index];
				} else {
					input_element.value = ""
				}

				if (isHumanTriggered) {
					if (selected_keyword_name == "SF_VerifyTextFromTableCellByQuery" ||
						selected_keyword_name == "SF_ClickArrowInTableCellByQuery" ||
						selected_keyword_name == "SF_GetTableCellText" ||
						selected_keyword_name == "SF_GetTableRowCount" ||
						selected_keyword_name == "SF_GetObjectTextByLabel" ||
						selected_keyword_name == "SF_ClickButtonInRelatedList" ||
						selected_keyword_name == "SF_PerformActionInRelatedList" ||
						selected_keyword_name == "SF_ClickOnQuickAction" ||
						selected_keyword_name == "SF_DeselectDataFromPickList") {
						input_element.value = "";
					}
				}

				if (selected_keyword_name == "SF_AccountExists" ||
					selected_keyword_name == "SF_ContactExists" ||
					selected_keyword_name == "SF_LeadExists" ||
					selected_keyword_name == "SF_OpportunityExists" ||
					selected_keyword_name == "SF_GroupExists" ||
					selected_keyword_name == "SF_QuoteExists" ||
					selected_keyword_name == "SF_EditContactInTable" ||
					selected_keyword_name == "SF_EditLeadInTable" ||
					selected_keyword_name == "SF_EditOpportunityInTable" ||
					selected_keyword_name == "SF_EditAccountInTable") {
					input_element.value = "";
				}
				input_element.fieldName = arg_name;
				input_element.placeholder = "Enter " + arg_name + "";
				input_element.title = "Enter " + arg_name + "";
				td_Type_element.appendChild(input_element);
			} else if (arg_type == "BOOL") {
				input_element.type = "checkbox";
				if (attribute_arguments_array.indexOf(arg_name) > -1) {
					var attribute_arg_index = attribute_arguments_array.indexOf(arg_name.toLowerCase());
					input_element.value = data_arguments_array[attribute_arg_index];
				} else {
					input_element.value = ""
				}

				if (isHumanTriggered) {
					if (selected_keyword_name == "SF_VerifyTextFromTableCellByQuery" ||
						selected_keyword_name == "SF_ClickArrowInTableCellByQuery" ||
						selected_keyword_name == "SF_GetTableCellText" ||
						selected_keyword_name == "SF_GetTableRowCount" ||
						selected_keyword_name == "SF_GetObjectTextByLabel" ||
						selected_keyword_name == "SF_ClickButtonInRelatedList" ||
						selected_keyword_name == "SF_PerformActionInRelatedList" ||
						selected_keyword_name == "SF_ClickOnQuickAction" ||
						selected_keyword_name == "SF_DeselectDataFromPickList") {
						input_element.value = "";
					}
				}

				if (selected_keyword_name == "SF_AccountExists" ||
					selected_keyword_name == "SF_ContactExists" ||
					selected_keyword_name == "SF_LeadExists" ||
					selected_keyword_name == "SF_OpportunityExists" ||
					selected_keyword_name == "SF_GroupExists" ||
					selected_keyword_name == "SF_QuoteExists" ||
					selected_keyword_name == "SF_EditContactInTable" ||
					selected_keyword_name == "SF_EditLeadInTable" ||
					selected_keyword_name == "SF_EditOpportunityInTable" ||
					selected_keyword_name == "SF_EditAccountInTable") {
					input_element.value = "";
				}
				input_element.fieldName = arg_name;
				input_element.placeholder = "Select " + arg_name + "";
				input_element.title = "Select " + arg_name + "";
				td_Type_element.appendChild(input_element);
			}

			var _selectcheckbox = document.createElement("INPUT");
			_selectcheckbox.type = "checkbox";
			_selectcheckbox.checked = true;
			var _selecttd = document.createElement("TD");
			_selecttd.appendChild(_selectcheckbox);

			if (td_Name_element.textContent.trim() != "") {
				$(_selecttd).prop("width", "10%");
				tr_element.appendChild(_selecttd);
			}
			tr_element.appendChild(td_Name_element);
			tr_element.appendChild(td_Type_element);
			tbody_element.appendChild(tr_element);
		}

		table_arguments_holder_element.appendChild(tbody_element);
	});

	var lastSelection;

	function editRow(gridname, id) {
		if (id && id !== lastSelection) {
			var grid = $("#" + gridname);
			grid.restoreRow(lastSelection);
			grid.editRow(id, true);
			lastSelection = id;
		}
	}

	$("#stepsArray").select2();
	$("#spyStepsArray").select2();
	$("#stepsholder").select2();
	$("#edit_stepsholder").select2();


	var gridWidth = $('.op-step-grid').innerWidth();



	initializeAllDropdownKeywords("");




	$(document).keydown(function (e) {
		if (e.keyCode == 17) {
			is_controlKey_down = true;
		}
	});

	$(document).keyup(function (e) {
		if (e.keyCode == 17) {
			is_controlKey_down = false;
		}
	});

	$("#orpropertygrid").jqGrid({
		autoencode: true,
		width: gridWidth,
		height: 'auto',
		colModel: [{
			name: "Attribute",
			type: "text",
			editable: false,
			sortable: false
		},
		{
			name: "Value",
			type: "text",
			editable: true,
			sortable: false,
			formatter: function myformatter(cellvalue, options, rowObject) {
				if (rowObject.Attribute == "ObjectImage" || rowObject.Attribute == "Image") {
					if (cellvalue.indexOf("data:image/png;base64,") == -1) {
						cellvalue = "data:image/png;base64," + cellvalue;
					}
					return "<img src='" + cellvalue + "'/>";
				}
				return cellvalue;
			}
		},
		{
			name: "ObjectData",
			type: "object",
			hidden: true,
			sortable: false
		}
		],
		onSelectRow: function (id) {
			var selectedrow = _opkeyrecorder.getSelectedRowOfGrid("mainstepgrid");
			if (selectedrow != 0) {
				selectedrow--;
			}
			var all_orgrid_data = _opkeyrecorder.getAllGridData("orpropertygrid");
			if (all_orgrid_data != null) {
				var attribute_object = all_orgrid_data[id];
				if (attribute_object["Attribute"] == "ObjectImage" || attribute_object["Attribute"] == "Image") {
					return;
				}
			}
			var objectdata = null;
			try {
				objectdata = _opkeyrecorder.allrecordedstepsarray[selectedrow].ObjectData;
				if (_opkeyrecorder.current_selected_domobject != null) {
					objectdata = _opkeyrecorder.current_selected_domobject;
				}
			} catch (e) {
				if (_opkeyrecorder.current_selected_domobject != null) {
					objectdata = _opkeyrecorder.current_selected_domobject;
				}
			}
			_opkeyrecorder.updateOrGrid(objectdata);
			editRow("orpropertygrid", id)
		}
	});



	$("#orpropertygrid").keyup(function (e) {
		var target_key_up_node = e.target;
		var parent_of_target = target_key_up_node.parentNode;
		var attribute_name = parent_of_target.previousSibling.innerText;
		var attribute_value = $(target_key_up_node).val();
		var selectedrow = _opkeyrecorder.getSelectedRowOfGrid("mainstepgrid");
		if (selectedrow != 0) {
			selectedrow--;
		}
		var objectdata = _opkeyrecorder.allrecordedstepsarray[selectedrow].ObjectData;
		if (_opkeyrecorder.current_selected_domobject != null) {
			objectdata = _opkeyrecorder.current_selected_domobject;
		}
		$.each(objectdata, function (k, v) {
			if (k == attribute_name) {
				objectdata[attribute_name] = attribute_value;
			}
		});
	});

	$("#spydomgrid").jqGrid({
		autoencode: true,
		width: gridWidth,
		height: 'auto',
		colModel: [{
			name: "Tag",
			type: "text",
			editable: true,
			sortable: false
		},
		{
			name: "Identifier",
			type: "text",
			editable: true,
			sortable: false
		},
		{
			name: "ObjectData",
			type: "object",
			hidden: true,
			sortable: false
		}
		],
		rowNum: 5,
		rowList: [5, 10, 20, 50, 100],
	});

	$("#recorderLogicalName").keyup(function (e) {
		if (_opkeyrecorder.current_selected_domobject != null) {
			_opkeyrecorder.current_selected_domobject["logicalname"] = $("#recorderLogicalName").val();
			return;
		}
		var selectedrow = _opkeyrecorder.getSelectedRowOfGrid("mainstepgrid");
		var gridinstance = $("#mainstepgrid");
		var key = gridinstance.jqGrid('getGridParam', 'selrow');
		$("#" + key + " > td:nth-child(3)").text($("#recorderLogicalName").val());
		$("#" + key + " > td:nth-child(6) > p12:last-child").text($("#recorderLogicalName").val());
		//changes for pankaj bug
		if ($("#" + key + " > td:nth-child(6)").length > 0) {
			var getValue = $("#" + key + " > td:nth-child(6)")[0].innerText;
			if (getValue != null)
				$("#" + key + " > td:nth-child(6)")[0].title = getValue;
		}
		if (selectedrow != 0) {
			selectedrow--;
		}

		var objectdata = _opkeyrecorder.allrecordedstepsarray[selectedrow].ObjectData;
		objectdata["logicalname"] = $("#recorderLogicalName").val();
	});

	$("#logicalName").keyup(function (e) {
		var selectedrow_of_spydom = _opkeyrecorder.getSelectedRowOfGrid("spydomgrid");
		if (selectedrow_of_spydom == null) {
			selectedrow_of_spydom = _opkeyrecorder.allrecordeddomssarray.length - 1;
		}
		var objectdata_ofspydom = _opkeyrecorder.allrecordeddomssarray[selectedrow_of_spydom].ObjectData;
		if (objectdata_ofspydom != null) {
			objectdata_ofspydom["logicalname"] = DOMPurify.sanitize($("#logicalName").val());
			_opkeyrecorder.allrecordeddomssarray[selectedrow_of_spydom].ObjectData = objectdata_ofspydom;
		}
	});


	// neon

	$("#pivotpropertygrid").jqGrid({
		autoencode: true,
		width: gridWidth,
		height: 'auto',
		colModel: [{
			name: "Attribute",
			type: "text",
			editable: false,
			sortable: false
		},
		{
			name: "Value",
			type: "text",
			editable: true,
			sortable: false
		},
		{
			name: "ORObject",
			type: "object",
			hidden: true,
			editable: true,
			sortable: false
		}
		],
		rowNum: 5,
		rowList: [5, 10, 20, 50, 100],
	});


	$("#spypropertygrid").jqGrid({
		autoencode: true,
		width: gridWidth,
		height: 'auto',
		colModel: [{
			name: "Attribute",
			type: "text",
			editable: false,
			sortable: false
		},
		{
			name: "Value",
			type: "text",
			editable: true,
			sortable: false
		},
		{
			name: "ORObject",
			type: "object",
			hidden: true,
			editable: true,
			sortable: false
		}
		],

		onSelectRow: function (id) {
			var selectedrow = _opkeyrecorder.getSelectedRowOfGrid("spydomgrid");
			if (selectedrow == null) {
				selectedrow = _opkeyrecorder.allrecordeddomssarray.length - 1;
			}
			var objectdata = _opkeyrecorder.allrecordeddomssarray[selectedrow].ObjectData;
			_opkeyrecorder.updateSpyOrGrid(objectdata);
			editRow("spypropertygrid", id)
		},
		rowNum: 5,
		rowList: [5, 10, 20, 50, 100],
	});

	$("#spypropertygrid").keyup(function (e) {
		var target_key_up_node = e.target;
		var parent_of_target = target_key_up_node.parentNode;
		var attribute_name = parent_of_target.previousSibling.innerText;
		var attribute_value = $(target_key_up_node).val();
		var selectedrow = _opkeyrecorder.getSelectedRowOfGrid("spydomgrid");
		if (selectedrow == null) {
			selectedrow = _opkeyrecorder.allrecordeddomssarray.length - 1;
		}
		var objectdata = _opkeyrecorder.allrecordeddomssarray[selectedrow].ObjectData;

		$.each(objectdata, function (k, v) {
			if (k == attribute_name) {
				objectdata[attribute_name] = attribute_value;
			}
		});
	});

	$("#snipingtool").click(function (e) {
		chrome.runtime.sendMessage({
			OpenSnippingTool: "OpenSnippingTool"
		}, function (response) {
			if (chrome.runtime.lastError) { }
		});
	});

	$("#set_relation").click(function (e) {
		// ////debugger;
		if (is_anchored == false) {
			$("#set_relation").css("background-color", "orange");
			$("#set_relation").attr("title", "Reset Pivot");
			_opkeyrecorder.clearAllDataInGrid("spypropertygrid")
			_opkeyrecorder.updatePivotOrGrid(_opkeyrecorder.current_selected_domobject);
			chrome.runtime.sendMessage({
				setAnchor: "setAnchor"
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
			is_anchored = true;
		} else if (is_anchored == true) {
			$("#set_relation").css("background-color", "");
			$("#set_relation").attr("title", "Set Pivot");
			_opkeyrecorder.clearAllDataInGrid("pivotpropertygrid");
			_opkeyrecorder.current_selected_domobject = _opkeyrecorder.current_pivot_objectdata;
			_opkeyrecorder.updateSpyOrGrid(_opkeyrecorder.current_pivot_objectdata);
			chrome.runtime.sendMessage({
				resetAnchor: "resetAnchor"
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
			is_anchored = false;
		}
	});

	$("#shiftrowup").click(function (e) {
		_opkeyrecorder.moveRowUpAndDownInGrid("mainstepgrid", true)
		generateStepNo();
	});

	$("#shiftrowdown").click(function (e) {
		_opkeyrecorder.moveRowUpAndDownInGrid("mainstepgrid", false)
		generateStepNo();
	});


	$("#debugButton").click(function (e) {
		invokedExecution = false;
		_opkeyrecorder.StartExecutionInOpKeyLite("debug");
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
	});

	$("#downloadOpKeyLite").click(function (e) {

		if (true) {
			showLiteAgentDownloadOption();
			return;
		}
		var a = document.createElement('a');
		document.body.appendChild(a);
		a.style = 'display: none';
		if (window.navigator.platform.indexOf("Win") != -1) {
			a.href = "https://s3.amazonaws.com/cdn.opkey.crestech/OpKeyLiteAgent/OpkeyLiteAgent.exe";
		}
		else {
			a.href = "https://s3.amazonaws.com/cdn.opkey.crestech/OpKeyLiteAgent/OpkeyLiteAgent-macos-installer-arm64.pkg";
		}
		a.target = "_blank";
		a.click();
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
	});

	$("#executeButtonHolder").click(function (e) {
		showPlaybackDiv = true;
		//var setting_element = document.getElementById("setting");
		//setting_element.childNodes[0].click();
		$('#executeButtonHolder').css('pointer-events', 'none');
		window.setTimeout(function () {
			$('#executeButtonHolder').css('pointer-events', '');
		}, 3000);

		if ($("#pause").hasClass("fa-pause")) {
			$("#pausePlayHolder").click();
			pausedByUser = false;
		}

		if ($("#executeButton").hasClass("fa-pause")) {
			lastPausePressed = true;
			pauseExecution();
			$("#executeButton").removeClass("fa-pause");
			$("#executeButton").addClass("fa-play");
			$("#executeButtonHolder").attr("title", "Play");
			return;
		}

		if ($("#executeButton").hasClass("fa-play")) {
			$("#executeButtonHolder").attr("title", "Pause");
			if (lastPausePressed == true) {
				lastPausePressed = false;
				resumeExecution();
				$("#executeButton").removeClass("fa-play");
				$("#executeButton").addClass("fa-pause");
				return;
			}
		}

		var acc1expanded = $("#bt_accordion_RunSetting").attr("aria-expanded");
		if (acc1expanded == "true") {
			$("#bt_accordion_RunSetting").click();
		}

		var acc2expanded = $("#bt_accordion_Result").attr("aria-expanded");
		if (acc2expanded == "false" || acc2expanded == null) {
			$("#bt_accordion_Result").click();
		}
		window.setTimeout(function () {
			$("#resultdomgrid").jqGrid("clearGridData");
		}, 100);
		invokedExecution = false;
		_opkeyrecorder.StartExecutionInOpKeyLite("normal");
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
	});

	$("#stopandsave").click(function (e) {
		swal({
			title: "",
			text: "Are you sure you want to Save and Close?",
			type: "warning",
			showCancelButton: true,
			confirmButtonClass: "btn-danger",
			confirmButtonText: "Yes",
			cancelButtonText: "No",
			closeOnConfirm: true,
			closeOnCancel: true
		},
			function (isConfirm) {
				if (isConfirm) {
					_opkeyrecorder.invokeSaveRecording();
				}
			});
	});

	function pauseExecution() {
		saas_object.ShowToastMessage("", "Pausing Execution");
		$.ajax({
			url: "http://localhost:8090/pauseExecution",
			type: "GET",
			success: function (returned_data) {
				saas_object.ShowToastMessage("", "Execution Paused");
			},
			error: function (returned_error_data) {
				saas_object.ShowToastMessage("error", "Error in Pausing Execution.");
			}
		});
	}

	function resumeExecution() {
		saas_object.ShowToastMessage("", "Resuming Execution");
		$.ajax({
			url: "http://localhost:8090/resumeExecution",
			type: "GET",
			success: function (returned_data) {
				saas_object.ShowToastMessage("", "Execution Resumed");
			},
			error: function (returned_error_data) {
				saas_object.ShowToastMessage("error", "Error in Resuming Execution.");
			}
		});
	}

	function changeRecorderMode() {
		var selected_recorder_mode = $("#recordingModeSelection").find(":selected").text();

		if (selected_recorder_mode.indexOf("Mobile") == 0) {
			$("#spyInfoHolder").hide();


			$("#navigatetextbox").attr('disabled', 'disabled');

			//$("#snipingtool").hide();
			$("#chrome_icon").hide();
			$("#executeButtonHolder").hide();
			$("#stop_execution").hide();
			$("#downloadOpKeyLite").hide();
			$("#separator1").hide();

			$("#recordingControlsLabel").hide();
			$("#playbackControlLabel").hide();

			$("#recordingModeSelection").prop('disabled', "disabled");
		}
		else {
			$("#spyInfoHolder").show();

			$("#navigatetextbox").removeAttr('disabled');

			$("#snipingtool").show();
			$("#chrome_icon").show();
			$("#executeButtonHolder").show();
			$("#stop_execution").show();
			$("#downloadOpKeyLite").show();
			$("#separator1").show();

			$("#recordingControlsLabel").show();
			$("#playbackControlLabel").show();
		}

		if (selected_recorder_mode.indexOf("Oracle EBS Load Test") == 0) {
			$("#ebsBrowserSelection").dialog("open");
		}

		if (selected_recorder_mode.indexOf("Web ") == 0) {
			$("#webBrowserSelection").dialog("open");
		}

		if (selected_recorder_mode.indexOf("Oracle EBS") == 0) {
			$("#ebsBrowserSelection").dialog("open");
		}

		if (selected_recorder_mode.indexOf("Desktop") == 0) {
			$("#desktopAppSelection").dialog("open");
		}
		if (selected_recorder_mode.indexOf("MainFrame") == 0) {
			debugger;
			$("#MainFrameAppSelection").dialog("open");
		}
		if (selected_recorder_mode.indexOf("SAP Netweaver") == 0) {
			$("#sapNetweaverAppSelection").dialog("open");
		}
		if (selected_recorder_mode.indexOf("Salesforce") == 0) {
			initializeAllDropdownKeywords("SF_");
			var session_data = saas_object.GetGlobalSetting("OPKEY_INFO");
			if (session_data != null) {
				session_data = JSON.parse(session_data);
				if (session_data["environment"] != null) {
					$("#changeEnvironmentType_authtoken").val(session_data["environment"]);
				}
				$("#url_authtoken").val(session_data["url"]);
				$("#clientid_authtoken").val(session_data["clientId"]);
				$("#clientsecret_authtoken").val(session_data["clientSecret"]);
				$("#username_authtoken").val(session_data["username"]);
				$("#sdata_authtoken").val(session_data["password"]);
			}
			// $("#changeEnvironmentType_authtoken").change();
			if ($("#pause").hasClass("fa-pause")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}

			$("#authorizationTokenDialog").dialog("open");
		} else if (selected_recorder_mode.indexOf("Workday") == 0) {
			initializeAllDropdownKeywords("WD_");
		} else if (selected_recorder_mode.indexOf("PeopleSoft") == 0) {
			initializeAllDropdownKeywords("PS_");
		} else if (selected_recorder_mode.indexOf("MSDynamics FSO") == 0) {
			initializeAllDropdownKeywords("MSDFSO_");
		}
		else if (selected_recorder_mode.indexOf("Coupa") == 0) {
			initializeAllDropdownKeywords("Coupa_");
		}
		else if (selected_recorder_mode.indexOf("Veeva Vault") == 0) {
			if ($("#pause").hasClass("fa-pause")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}

			$("#veevaAuthorizationTokenDialog").dialog("open");
			initializeAllDropdownKeywords("Veeva_");
		} else if (selected_recorder_mode.indexOf("MSDynamics") == 0) {
			initializeAllDropdownKeywords("MSD_");
		} else if (selected_recorder_mode.indexOf("SAP Fiori") == 0) {
			initializeAllDropdownKeywords("SAPFiori_");
		} else if (selected_recorder_mode.indexOf("SuccessFactors") == 0) {
			initializeAllDropdownKeywords("SAPSF_");
		} else if (selected_recorder_mode.indexOf("Kronos") == 0) {
			initializeAllDropdownKeywords("KRONOS_");
		}
		else if (selected_recorder_mode.indexOf("ServiceNow") == 0) {
			initializeAllDropdownKeywords("ServiceNow_");
		}
		else if (selected_recorder_mode.indexOf("JDE") == 0) {
			initializeAllDropdownKeywords("JDE_");
		}

		else if (selected_recorder_mode.indexOf("Desktop") == 0) {

			initializeAllDropdownKeywords("Win_");
		}

		else if (selected_recorder_mode.indexOf("SAP Netweaver") == 0) {

			initializeAllDropdownKeywords("SAPNW_");
		}

		else if (selected_recorder_mode.indexOf("Oracle Fusion") == 0) {

			// un comment below lines for feature to be active
			if ($("#pause").hasClass("fa-pause")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
			initializeAllDropdownKeywords("OracleFusion_");
			$("#oraclefusionmetadatadialog").dialog("open");
		} else if (selected_recorder_mode.indexOf("Microsoft WPF") == 0) {
			initializeAllDropdownKeywords("WPF_");
		} else {
			initializeAllDropdownKeywords("");
		}
		saas_object.SetGlobalSetting("RECORDING_MODE", selected_recorder_mode);
		selected_recorder_mode = selected_recorder_mode.replace(" Recording", "").toUpperCase();
		chrome.runtime.sendMessage({
			setRecordingMode: selected_recorder_mode
		}, function (response) {
			if (chrome.runtime.lastError) { }
		});

		switchToMappingRecorderMode();
	}


	function checkRecorderLicenseIsActive(recorderName, allRecorderData) {
		var opkeyRecorderName = getOpKeyRecorderName(recorderName);
		if (allRecorderData[opkeyRecorderName] == null) {
			//added temporarily jugaad
			return true;
		}
		var opkeyRecorder = allRecorderData[opkeyRecorderName];

		return opkeyRecorder["LicenseActive"];
	}



	function getOpKeyRecorderName(recorderName) {
		if (recorderName == "Normal") {
			return "Recorder_Web";
		}
		if (recorderName == "Oracle Fusion") {
			return "Recorder_OracleFusion";
		}
		if (recorderName == "ServiceNow") {
			return "Recorder_ServiceNow";
		}
		if (recorderName == "PeopleSoft") {
			return "Recorder_PeopleSoft";
		}
		if (recorderName == "Salesforce") {
			return "Recorder_Salesforce";
		}
		if (recorderName == "SAP Fiori") {
			return "Recorder_SAPFiori";
		}
		if (recorderName == "Workday") {
			return "Recorder_Workday";
		}
		if (recorderName == "Kronos") {
			return "Recorder_Kronos";
		}
		if (recorderName == "MSDynamics") {
			return "Recorder_MicrosoftDynamics";
		}
		if (recorderName == "MSDynamics FSO") {

			return "Recorder_MicrosoftDynamics_AX";
		}
	}

	var lastRecordingMode = null;
	$("#recordingModeSelection").change(function (e) {
		$.ajax({
			url: saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME") + "/Helper/GetModuleLicenses",
			type: "GET",
			success: function (returned_data) {
				var allRecorders = returned_data["Recorder"];

				var selectedRecorder = $("#recordingModeSelection").find(":selected").val();
				var recorderName = selectedRecorder.replace(" Recording", "");
				var licenseActive = checkRecorderLicenseIsActive(recorderName, allRecorders);
				if (licenseActive == false) {
					chrome.runtime.sendMessage({
						setPause: "setPause"
					}, function (response) {
						if (chrome.runtime.lastError) { }
						if (lastRecordingMode != null) {
							$('#recordingModeSelection').val(lastRecordingMode);
							$('#recordingModeSelection').change();
						} else {
							$('#recordingModeSelection').val("Normal Recording");
							$('#recordingModeSelection').change();
						}
						swal({
							title: "Opkey",
							text: "Oops! Seems this recorder is not included in your subscription. Please contact Opkey Support team at support@opkey.com for more details.",
							type: "warning",
							confirmButtonClass: "btn-danger",
							confirmButtonText: "Ok",
							closeOnConfirm: true
						},
							function (isConfirm) {
								window.close();
							}
						);
					});
					return;
				}
				lastRecordingMode = selectedRecorder;
				changeRecorderMode();
			},
			error: function (returned_errorData) {
				changeRecorderMode();
			}
		});
	});

	$("#backtoorButton").click(function (e) {
		swal({
			title: "Are you sure?",
			text: "This will close recording and open Object Repository page.",
			type: "warning",
			showCancelButton: true,
			confirmButtonClass: "btn-danger",
			confirmButtonText: "Yes",
			cancelButtonText: "No",
			closeOnConfirm: true,
			closeOnCancel: true
		},
			function (isConfirm) {
				if (isConfirm) {
					saas_object.OpenObjectRepositorySelectionPage();
				}
			});
	});


	$("#addObjectButton").click(function (e) {
		var selected_row = _opkeyrecorder.getSelectedRowOfGrid("spydomgrid");
		if (selected_row == null) {
			selected_row = _opkeyrecorder.allrecordeddomssarray.length - 1;
		}
		var current_or_object = _opkeyrecorder.allrecordeddomssarray[selected_row].ObjectData;
		_opkeyrecorder.AddObjectToOR(current_or_object);
	});

	$("#addStepButton").click(function (e) {
		var selected_row = _opkeyrecorder.getSelectedRowOfGrid("spydomgrid");
		if (selected_row == null) {
			selected_row = _opkeyrecorder.allrecordeddomssarray.length - 1;
		}
		var objectdata = _opkeyrecorder.allrecordeddomssarray[selected_row].ObjectData;
		var selected_keyword_name = DOMPurify.sanitize($('#spyStepsArray').find(":selected").text());
		_opkeyrecorder.AddStepFromSpy(selected_keyword_name, objectdata, "", true, true);
		generateStepNo();
	});

	$("#addsteptogrid").click(function (e) {
		var selected_row = _opkeyrecorder.getSelectedRowOfGrid("mainstepgrid");
		if (selected_row != 0) {
			selected_row--;
		}
		var selected_keyword_name = DOMPurify.sanitize($('#stepsArray').find(":selected").text());
		if (_opkeyrecorder.allrecordedstepsarray[selected_row] != null) {
			var objectdata = _opkeyrecorder.allrecordedstepsarray[selected_row].ObjectData;
			if (_opkeyrecorder.current_selected_domobject != null) {
				_opkeyrecorder.AddStepFromSpy(selected_keyword_name, _opkeyrecorder.current_selected_domobject, "", true, true);
				return;
			}
			_opkeyrecorder.AddStepFromSpy(selected_keyword_name, objectdata, "", true, true);
			return;
		}

		if (_opkeyrecorder.current_selected_domobject != null) {
			_opkeyrecorder.AddStepFromSpy(selected_keyword_name, _opkeyrecorder.current_selected_domobject, "", true, true);
			return;
		}

	});

	// start to work here
	chrome.windows.onRemoved.addListener(function (win) {
		if (win == _opkeyrecorder.opened_window_id) {
			_opkeyrecorder.opened_window_id = -1;
		}
	});

	$("#chrome_icon").click(function (e) {
		// ////debugger;

		var app_url = saas_object.GetGlobalSetting("APPLICATION_URL");
		if (app_url == null || app_url.trim() == "") {
			app_url = "http://sstsinc.com";
		}

		if (_opkeyrecorder.opened_window_id == -1) {

			if (chrome.system == null) {
				var _bounds = screen;
				var _width = (_bounds.width / 100) * 70;
				var _height = _bounds.height;
				var _x = (_bounds.width / 100) * 30;
				_width = Math.trunc(_width);
				_height = Math.trunc(_height);
				_x = Math.trunc(_x);
				chrome.windows.create({
					url: app_url,
					type: 'normal',
					left: _x + 1,
					top: 0,
					width: _width,
					height: _height
				}, function (win) {
					_opkeyrecorder.opened_window_id = win.id;
					enableDockerInRecordingWindow(win.id);
					chrome.runtime.sendMessage({
						setCurrentWindowID: win.id
					}, function (response) {
						if (chrome.runtime.lastError) { }
					});
				});
			}
			else {
				chrome.system.display.getInfo(function (displayInfo) {
					var _bounds = displayInfo[0].bounds;
					var _width = (_bounds.width / 100) * 70;
					var _height = _bounds.height;
					var _x = (_bounds.width / 100) * 30;
					_width = Math.trunc(_width);
					_height = Math.trunc(_height);
					_x = Math.trunc(_x);
					chrome.windows.create({
						url: app_url,
						type: 'normal',
						left: _x + 1,
						top: 0,
						width: _width,
						height: _height
					}, function (win) {
						_opkeyrecorder.opened_window_id = win.id;
						enableDockerInRecordingWindow(win.id);
						chrome.runtime.sendMessage({
							setCurrentWindowID: win.id
						}, function (response) {
							if (chrome.runtime.lastError) { }
						});
					});
				});
			}
			return;
		}

		swal({
			title: "Are you sure?",
			text: "This will close current browser and open a new one!",
			type: "warning",
			showCancelButton: true,
			confirmButtonClass: "btn-danger",
			confirmButtonText: "Yes",
			cancelButtonText: "No",
			closeOnConfirm: true,
			closeOnCancel: true
		},
			function (isConfirm) {
				if (isConfirm) {
					_opkeyrecorder.CloseChromeWindow(_opkeyrecorder.opened_window_id);
					var app_url = saas_object.GetGlobalSetting("APPLICATION_URL");
					if (app_url == null || app_url.trim() == "") {
						app_url = "http://sstsinc.com";
					}
					window.setTimeout(function () {
						if (chrome.system == null) {
							var _bounds = screen;
							var _width = (_bounds.width / 100) * 70;
							var _height = _bounds.height;
							var _x = (_bounds.width / 100) * 30;
							_width = Math.trunc(_width);
							_height = Math.trunc(_height);
							_x = Math.trunc(_x);
							chrome.windows.create({
								url: app_url,
								type: 'normal',
								left: _x + 1,
								top: 0,
								width: _width,
								height: _height
							}, function (win) {
								_opkeyrecorder.opened_window_id = win.id;
								chrome.runtime.sendMessage({
									setCurrentWindowID: win.id
								}, function (response) {
									if (chrome.runtime.lastError) { }
								});
							});
						}
						else {
							chrome.system.display.getInfo(function (displayInfo) {
								var _bounds = displayInfo[0].bounds;
								var _width = (_bounds.width / 100) * 70;
								var _height = _bounds.height;
								var _x = (_bounds.width / 100) * 30;
								_width = Math.trunc(_width);
								_height = Math.trunc(_height);
								_x = Math.trunc(_x);
								chrome.windows.create({
									url: app_url,
									type: 'normal',
									left: _x + 1,
									top: 0,
									width: _width,
									height: _height
								}, function (win) {
									_opkeyrecorder.opened_window_id = win.id;
									chrome.runtime.sendMessage({
										setCurrentWindowID: win.id
									}, function (response) {
										if (chrome.runtime.lastError) { }
									});
								});
							});
						}
					}, 500);
				}
			});
	});

	$('#addRegexModalContent').dialog({
		width: 325,
		height: 322,
		title: "Add a Regex Pattern to Ignore Attributes In Recording",
		autoOpen: false,
		modal: true,
		draggable: false,
		show: "slide",
		hide: "scale",
		buttons: [{
			text: "OK",
			click: function () {
				localStorage.setItem("OPKEY_REGEX_IGNORE_PATTERN", $("#regexDataInput").val());
				$(this).dialog("close");
			},
			class: "btn btn-primary btn-sm"
		},
		{
			text: "Close",
			click: function () {
				$(this).dialog("close");
			},
			class: "btn btn-default btn-sm"
		},
		],
		open: function (e) {
			_opkeyrecorder.modal_dialog_opened = true;
			if ($("#pause").hasClass("fa-pause")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
			if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
				var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
				$.ui.dialog.prototype._allowInteraction = function (e) {
					if ($(e.target).closest('.select2-dropdown').length) return true;
					return ui_dialog_interaction.apply(this, arguments);
				};
			}
		},
		close: function (e) {
			_opkeyrecorder.modal_dialog_opened = false;
			if ($("#pause").hasClass("fa-circle")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
		},
		_allowInteraction: function (event) {
			return !!$(event.target).is(".select2-input") || this._super(event);
		}
	});


	$('#addModalContent').dialog({
		width: 325,
		height: 322,
		title: "Add a Step in Recorder Grid",
		autoOpen: false,
		modal: true,
		draggable: false,
		show: "slide",
		hide: "scale",
		buttons: [{
			text: "OK",
			click: function () {
				_opkeyrecorder.InitiateStepsAdd();
				$(this).dialog("close");
			},
			class: "btn btn-primary btn-sm"
		},
		{
			text: "Close",
			click: function () {
				$(this).dialog("close");
			},
			class: "btn btn-default btn-sm"
		},
		],
		open: function (e) {
			_opkeyrecorder.modal_dialog_opened = true;
			if ($("#pause").hasClass("fa-pause")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
			if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
				var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
				$.ui.dialog.prototype._allowInteraction = function (e) {
					if ($(e.target).closest('.select2-dropdown').length) return true;
					return ui_dialog_interaction.apply(this, arguments);
				};
			}
		},
		close: function (e) {
			_opkeyrecorder.modal_dialog_opened = false;
			if ($("#pause").hasClass("fa-circle")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
		},
		_allowInteraction: function (event) {
			return !!$(event.target).is(".select2-input") || this._super(event);
		}
	});

	$('#rightClickModalContent').dialog({
		width: "80%",
		height: window.innerHeight - 80,
		// top:10,
		// left:10,
		title: "Add a Step in Recorder Grid",
		autoOpen: false,
		modal: true,
		draggable: false,
		show: "slide",
		hide: "slide",
		buttons: [{
			text: "ADD",
			click: function () {
				chrome.runtime.sendMessage({
					setResume: "setResume"
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});
				var step_object = $('#rightClickModalContent').attr("step_object");
				var mod_object = $('#rightClickModalContent').attr("mod_or_object");

				var st_ob = JSON.parse(DOMPurify.sanitize(step_object));
				var mod_ob = JSON.parse(DOMPurify.sanitize(mod_object));
				if (st_ob.arguments[0]["ObjectImage"] != null) {
					mod_ob["ObjectImage"] = st_ob.arguments[0]["ObjectImage"];
				}
				if (mod_ob != null) {
					st_ob.arguments[0] = mod_ob;
				}
				_opkeyrecorder.AddRightClickDataToGrid(JSON.stringify(st_ob));
				$(this).dialog("close");
			},
			class: "btn btn-primary btn-sm"
		},
		{
			text: "Close",
			click: function () {
				$(this).dialog("close");
			},
			class: "btn btn-default btn-sm"
		},
		],
		open: function (e) {
			// ////debugger
			_opkeyrecorder.modal_dialog_opened = true;
			$(this).closest('.ui-dialog').addClass('dialog-mid-corner');
			$('div#rightClickModalContent').css('max-height', window.innerHeight - 100);
			if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
				var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
				$.ui.dialog.prototype._allowInteraction = function (e) {
					if ($(e.target).closest('.select2-dropdown').length) return true;
					return ui_dialog_interaction.apply(this, arguments);
				};
			}
		},
		close: function (e) {
			_opkeyrecorder.modal_dialog_opened = false;
			if ($("#pause").hasClass("fa-circle")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
		},
		_allowInteraction: function (event) {
			return !!$(event.target).is(".select2-input") || this._super(event);
		}
	});

	$('#oraclefusionmetadatadialog').dialog({
		width: 370,
		height: 400,
		title: "Oracle Fusion Fetch Metadata",
		autoOpen: false,
		modal: true,
		draggable: false,
		show: "slide",
		hide: "slide",
		buttons: [{
			text: "Get Metadatas",
			click: function () {
				var _url = $("#url_fusionapp").val();
				var _username = $("#username_fusionapp").val();
				var _password = $("#password_fusionapp").val();
				_opkeyrecorder.GetFusionMetadataFromApi(_url, _username, _password);
			},
			class: "btn btn-primary btn-sm"
		},
		{
			text: "Close",
			click: function () {
				$(this).dialog("close");
			},
			class: "btn btn-default btn-sm"
		},
		],
		open: function (e) {
			_opkeyrecorder.modal_dialog_opened = true;
			if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
				var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
				$.ui.dialog.prototype._allowInteraction = function (e) {
					if ($(e.target).closest('.select2-dropdown').length) return true;
					return ui_dialog_interaction.apply(this, arguments);
				};
			}
		},
		close: function (e) {
			_opkeyrecorder.modal_dialog_opened = false;
			if ($("#pause").hasClass("fa-circle")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
		},
		_allowInteraction: function (event) {
			return !!$(event.target).is(".select2-input") || this._super(event);
		}
	});

	$('#webBrowserSelection').dialog({
		width: 370,
		height: 325,
		title: "Select Browser for Web Recording",
		autoOpen: false,
		modal: true,
		draggable: false,
		show: "slide",
		hide: "slide",
		buttons: [{
			text: "Start Recording",
			click: function () {
				if ($('#webChromeBrowser').is(':checked')) {
					$(this).dialog("close");
					return;
				}
				var portNo = $("#oocPortNo_web").val();
				if (portNo == null || portNo == "") {
					portNo = "5201";
				}

				var protocolHandled = false;
				var _dialogReference = $(this);
				var checkServerAlive = window.setInterval(function () {
					$.ajax({
						url: "http://127.0.0.1:" + portNo + "/_s_/dyn/Driver_isAlive",
						type: "GET",
						success: function (succ_data) {
							if (protocolHandled == true) {
								shrinkRecorderWindow();
							}
							window.clearInterval(checkServerAlive);

							if ($('#webChromeBrowser').is(':checked')) {
							}

							if ($('#webEdgeIEBrowser').is(':checked')) {
								chrome.runtime.sendMessage({
									startOracleEBSRecording_LoadTest: { "browser": "msedgeieoracle", "port": portNo }
								}, function (response) {
									if (chrome.runtime.lastError) { }
								});
							}

							_dialogReference.dialog("close");
						},
						error: function (err_data) {
							if (protocolHandled == false) {
								restoreRecorderWindow();
								window.location = "OpKeyRecorder:Rec";
								protocolHandled = true;
							}
						}
					});
				}, 1000);
			},
			class: "btn btn-primary btn-sm"
		},
		{
			text: "Close",
			click: function () {
				$(this).dialog("close");
			},
			class: "btn btn-default btn-sm"
		},
		],
		open: async function (e) {
			var defaultPortNo = await GetOOCRecorderPortNo();
			$("#oocPortNo_web").val(defaultPortNo);
			_opkeyrecorder.modal_dialog_opened = true;
			if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
				var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
				$.ui.dialog.prototype._allowInteraction = function (e) {
					if ($(e.target).closest('.select2-dropdown').length) return true;
					return ui_dialog_interaction.apply(this, arguments);
				};
			}
		},
		close: function (e) {
			_opkeyrecorder.modal_dialog_opened = false;
			if ($("#pause").hasClass("fa-circle")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
		},
		_allowInteraction: function (event) {
			return !!$(event.target).is(".select2-input") || this._super(event);
		}
	});

	$('#ebsBrowserSelection').dialog({
		width: 370,
		height: 325,
		title: "Select Browser for Oracle EBS Recording",
		autoOpen: false,
		modal: true,
		draggable: false,
		show: "slide",
		hide: "slide",
		buttons: [{
			text: "Start Recording",
			click: function () {

				var portNo = $("#oocPortNo").val();
				if (portNo == null || portNo == "") {
					portNo = "5201";
				}

				var protocolHandled = false;
				var _dialogReference = $(this);
				var checkServerAlive = window.setInterval(function () {
					$.ajax({
						url: "http://127.0.0.1:" + portNo + "/_s_/dyn/Driver_isAlive",
						type: "GET",
						success: function (succ_data) {
							if (protocolHandled == true) {
								shrinkRecorderWindow();
							}
							window.clearInterval(checkServerAlive);

							if ($('#ebsChromeBrowser').is(':checked')) {
								chrome.runtime.sendMessage({
									startOracleEBSRecording: { "browser": "chrome", "port": portNo }
								}, function (response) {
									if (chrome.runtime.lastError) { }
								});
							}

							if ($('#ebsIEBrowser').is(':checked')) {
								chrome.runtime.sendMessage({
									startOracleEBSRecording_LoadTest: { "browser": "ieoracle", "port": portNo }
								}, function (response) {
									if (chrome.runtime.lastError) { }
								});
							}

							if ($('#ebsEdgeIEBrowser').is(':checked')) {
								chrome.runtime.sendMessage({
									startOracleEBSRecording_LoadTest: { "browser": "msedgeieoracle", "port": portNo }
								}, function (response) {
									if (chrome.runtime.lastError) { }
								});
							}

							_dialogReference.dialog("close");
						},
						error: function (err_data) {
							if (protocolHandled == false) {
								restoreRecorderWindow();
								window.location = "OpKeyRecorder:Rec";
								protocolHandled = true;
							}
						}
					});
				}, 1000);
			},
			class: "btn btn-primary btn-sm"
		},
		{
			text: "Close",
			click: function () {
				$(this).dialog("close");
			},
			class: "btn btn-default btn-sm"
		},
		],
		open: async function (e) {
			var defaultPortNo = await GetOOCRecorderPortNo();
			$("#oocPortNo").val(defaultPortNo);
			_opkeyrecorder.modal_dialog_opened = true;
			if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
				var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
				$.ui.dialog.prototype._allowInteraction = function (e) {
					if ($(e.target).closest('.select2-dropdown').length) return true;
					return ui_dialog_interaction.apply(this, arguments);
				};
			}
		},
		close: function (e) {
			_opkeyrecorder.modal_dialog_opened = false;
			if ($("#pause").hasClass("fa-circle")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
		},
		_allowInteraction: function (event) {
			return !!$(event.target).is(".select2-input") || this._super(event);
		}
	});

	$('#desktopAppSelection').dialog({
		width: 370,
		height: 325,
		title: "Provide app path to record",
		autoOpen: false,
		modal: true,
		draggable: false,
		show: "slide",
		hide: "slide",
		buttons: [{
			text: "Start Recording",
			click: function () {

				var appPath = $("#applicatinPath_des").val();
				var portNo = $("#oocPortNo_des").val();
				if (portNo == null || portNo == "") {
					portNo = "5201";
				}
				var RemoteDebuggingEnabled = $("#allowChromiumEmbeddedRecording").prop('checked');
				if (RemoteDebuggingEnabled == true) {
					RemoteDebuggingEnabled = "EnableRemoteDebugging";
				}
				else if (RemoteDebuggingEnabled == false) {
					RemoteDebuggingEnabled = "";
				}
				var protocolHandled = false;
				var recorderopened = false;
				var _dialogReference = $(this);
				var checkServerAlive = window.setInterval(function () {
					$.ajax({
						url: "http://127.0.0.1:" + portNo + "/_s_/dyn/Driver_isAlive",
						type: "GET",
						success: function (succ_data) {
							if (protocolHandled == true) {
								shrinkRecorderWindow();
							}
							window.clearInterval(checkServerAlive);

							if (recorderopened == false) {
								chrome.runtime.sendMessage({
									StartDesktopRecording: { "appPath": appPath, "port": portNo, "RemoteDebuggingEnabled": RemoteDebuggingEnabled }
								}, function (response) {
									if (chrome.runtime.lastError) { }
								});
							}
							recorderopened = true;

							_dialogReference.dialog("close");
						},
						error: function (err_data) {
							if (protocolHandled == false) {
								restoreRecorderWindow();
								window.location = "OpKeyRecorder:Rec";
								protocolHandled = true;
							}
						}
					});
				}, 1000);
			},
			class: "btn btn-primary btn-sm"
		},
		{
			text: "Close",
			click: function () {
				$(this).dialog("close");
			},
			class: "btn btn-default btn-sm"
		},
		],
		open: async function (e) {
			var defaultPortNo = await GetOOCRecorderPortNo();
			$("#oocPortNo_des").val(defaultPortNo);
			_opkeyrecorder.modal_dialog_opened = true;
			if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
				var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
				$.ui.dialog.prototype._allowInteraction = function (e) {
					if ($(e.target).closest('.select2-dropdown').length) return true;
					return ui_dialog_interaction.apply(this, arguments);
				};
			}
		},
		close: function (e) {
			_opkeyrecorder.modal_dialog_opened = false;
			if ($("#pause").hasClass("fa-circle")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
		},
		_allowInteraction: function (event) {
			return !!$(event.target).is(".select2-input") || this._super(event);
		}
	});
	$('#MainFrameAppSelection').dialog({

		width: 370,
		height: 325,
		title: "Provide app path to record",
		autoOpen: false,
		modal: true,
		draggable: false,
		show: "slide",
		hide: "slide",
		buttons: [{
			text: "Start Recording",
			click: function () {
				debugger;
				var appPath = $("#applicatinPath_mainf").val();
				var portNo = $("#oocPortNo_mainf").val();
				if (portNo == null || portNo == "") {
					portNo = "5201";
				}
				var RemoteDebuggingEnabled = $("#allowChromiumEmbeddedRecording").prop('checked');
				if (RemoteDebuggingEnabled == true) {
					RemoteDebuggingEnabled = "EnableRemoteDebugging";
				}
				else if (RemoteDebuggingEnabled == false) {
					RemoteDebuggingEnabled = "";
				}
				var protocolHandled = false;
				var recorderopened = false;
				var _dialogReference = $(this);
				var checkServerAlive = window.setInterval(function () {
					$.ajax({
						url: "http://127.0.0.1:" + portNo + "/_s_/dyn/Driver_isAlive",
						type: "GET",
						success: function (succ_data) {
							if (protocolHandled == true) {
								shrinkRecorderWindow();
							}
							window.clearInterval(checkServerAlive);

							if (recorderopened == false) {
								chrome.runtime.sendMessage({
									StartMainFrameRecording: { "appPath": appPath, "port": portNo }
								}, function (response) {
									if (chrome.runtime.lastError) { }
								});
							}
							recorderopened = true;

							_dialogReference.dialog("close");
						},
						error: function (err_data) {
							if (protocolHandled == false) {
								restoreRecorderWindow();
								window.location = "OpKeyRecorder:Rec";
								protocolHandled = true;
							}
						}
					});
				}, 1000);
			},
			class: "btn btn-primary btn-sm"
		},
		{
			text: "Close",
			click: function () {
				$(this).dialog("close");
			},
			class: "btn btn-default btn-sm"
		},
		],
		open: async function (e) {
			var defaultPortNo = await GetOOCRecorderPortNo();
			$("#oocPortNo_mainf").val(defaultPortNo);
			_opkeyrecorder.modal_dialog_opened = true;
			if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
				var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
				$.ui.dialog.prototype._allowInteraction = function (e) {
					if ($(e.target).closest('.select2-dropdown').length) return true;
					return ui_dialog_interaction.apply(this, arguments);
				};
			}
		},
		close: function (e) {
			if ($("#pause").hasClass("fa-circle")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
		},
		_allowInteraction: function (event) {
			return !!$(event.target).is(".select2-input") || this._super(event);
		}
	});

	$('#sapNetweaverAppSelection').dialog({
		width: 370,
		height: 325,
		title: "Provide SAP Netweaver App path to record.",
		autoOpen: false,
		modal: true,
		draggable: false,
		show: "slide",
		hide: "slide",
		buttons: [{
			text: "Start Recording",
			click: function () {
				var appPath = $("#applicatinPath_sap").val();
				var portNo = $("#oocPortNo_sap").val();
				if (portNo == null || portNo == "") {
					portNo = "5201";
				}

				var protocolHandled = false;
				var recorderopened = false;
				var _dialogReference = $(this);
				var checkServerAlive = window.setInterval(function () {
					$.ajax({
						url: "http://127.0.0.1:" + portNo + "/_s_/dyn/Driver_isAlive",
						type: "GET",
						success: function (succ_data) {
							if (protocolHandled == true) {
								shrinkRecorderWindow();
							}
							window.clearInterval(checkServerAlive);
							if (recorderopened == false) {
								chrome.runtime.sendMessage({
									StartDesktopRecording: { "appPath": appPath, "port": portNo }
								}, function (response) {
									if (chrome.runtime.lastError) { }
								});
							}
							recorderopened = true;
							_dialogReference.dialog("close");
						},
						error: function (err_data) {
							if (protocolHandled == false) {
								restoreRecorderWindow();
								window.location = "OpKeyRecorder:Rec";
								protocolHandled = true;
							}
						}
					});
				}, 1000);
			},
			class: "btn btn-primary btn-sm"
		},
		{
			text: "Close",
			click: function () {
				$(this).dialog("close");
			},
			class: "btn btn-default btn-sm"
		},
		],
		open: async function (e) {
			var defaultPortNo = await GetOOCRecorderPortNo();
			$("#oocPortNo_sap").val(defaultPortNo);
			_opkeyrecorder.modal_dialog_opened = true;
			if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
				var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
				$.ui.dialog.prototype._allowInteraction = function (e) {
					if ($(e.target).closest('.select2-dropdown').length) return true;
					return ui_dialog_interaction.apply(this, arguments);
				};
			}
		},
		close: function (e) {
			_opkeyrecorder.modal_dialog_opened = false;
			if ($("#pause").hasClass("fa-circle")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
		},
		_allowInteraction: function (event) {
			return !!$(event.target).is(".select2-input") || this._super(event);
		}
	});


	$('#veevaAuthorizationTokenDialog').dialog({
		width: 370,
		height: 550,
		title: "Veeva AuthToken Required",
		autoOpen: false,
		modal: true,
		draggable: false,
		show: "slide",
		hide: "slide",
		buttons: [{
			text: "Get Token",
			click: function () {
				_opkeyrecorder.GetVeevaAuthToken();
			},
			class: "btn btn-primary btn-sm"
		},
		{
			text: "Close",
			click: function () {
				$(this).dialog("close");
			},
			class: "btn btn-default btn-sm"
		},
		],
		open: function (e) {
			_opkeyrecorder.modal_dialog_opened = true;
			if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
				var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
				$.ui.dialog.prototype._allowInteraction = function (e) {
					if ($(e.target).closest('.select2-dropdown').length) return true;
					return ui_dialog_interaction.apply(this, arguments);
				};
			}
		},
		close: function (e) {
			_opkeyrecorder.modal_dialog_opened = false;
			if ($("#pause").hasClass("fa-circle")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
		},
		_allowInteraction: function (event) {
			return !!$(event.target).is(".select2-input") || this._super(event);
		}
	});


	$('#authorizationTokenDialog').dialog({
		width: 370,
		height: 550,
		title: "Salesforce AuthToken Required",
		autoOpen: false,
		modal: true,
		draggable: false,
		show: "slide",
		hide: "slide",
		buttons: [{
			text: "Get Token",
			click: function () {
				_opkeyrecorder.get_token_called = true;
				_opkeyrecorder.GetAuthToken();
			},
			class: "btn btn-primary btn-sm"
		},
		{
			text: "Close",
			click: function () {
				$(this).dialog("close");
			},
			class: "btn btn-default btn-sm"
		},
		],
		open: function (e) {
			_opkeyrecorder.modal_dialog_opened = true;
			if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
				var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
				$.ui.dialog.prototype._allowInteraction = function (e) {
					if ($(e.target).closest('.select2-dropdown').length) return true;
					return ui_dialog_interaction.apply(this, arguments);
				};
			}
		},
		close: function (e) {
			debugger
			if (_opkeyrecorder.get_token_called == false) {
				_opkeyrecorder.salesforce_metdata_array = [];
				chrome.runtime.sendMessage({
					RemoveAuthAcquired: "RemoveAuthAcquired"
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});
			}
			_opkeyrecorder.get_token_called = false;
			_opkeyrecorder.modal_dialog_opened = false;
			if ($("#pause").hasClass("fa-circle")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
		},
		_allowInteraction: function (event) {
			return !!$(event.target).is(".select2-input") || this._super(event);
		}
	});

	$("#passwordAauth").click(function (e) {
		$("#tokenAuthDiv").hide();
		$("#passwordAuthDiv").show();
	});

	$("#tokenAuth").click(function (e) {
		$("#passwordAuthDiv").hide();
		$("#tokenAuthDiv").show();
	});

	$('#editModalContent').dialog({
		width: 325,
		height: 322,
		title: "Edit Step",
		autoOpen: false,
		draggable: false,
		modal: true,
		show: "slide",
		hide: "scale",
		buttons: [{
			text: "OK",
			click: function () {
				_opkeyrecorder.InitiateStepsEdit();
				$(this).dialog("close");
			},
			class: "btn btn-primary btn-sm"
		},
		{
			text: "Close",
			click: function () {
				$(this).dialog("close");
			},
			class: "btn btn-default btn-sm"
		},
		],
		open: function (e) {
			_opkeyrecorder.modal_dialog_opened = true;
			if ($("#pause").hasClass("fa-pause")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
			if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
				var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
				$.ui.dialog.prototype._allowInteraction = function (e) {
					if ($(e.target).closest('.select2-dropdown').length) return true;
					return ui_dialog_interaction.apply(this, arguments);
				};
			}
		},
		close: function (e) {
			_opkeyrecorder.modal_dialog_opened = false;
			if ($("#pause").hasClass("fa-play") || $("#pause").hasClass("fa-circle")) {
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
		},
		_allowInteraction: function (event) {
			return !!$(event.target).is(".select2-input") || this._super(event);
		}

	});

	$('#addRegexPattern').click(function (e) {
		if (localStorage.getItem("OPKEY_REGEX_IGNORE_PATTERN") != null) {
			$("#regexDataInput").val(localStorage.getItem("OPKEY_REGEX_IGNORE_PATTERN"));
		}
		$("#addRegexModalContent").dialog("open");
	});

	$('#addrow').click(function (e) {
		$("#dataholder").val("");
		$("#addModalContent").dialog("open");
	});

	$('#editStep').click(function (e) {
		_opkeyrecorder.InitializeStepEdit();
		$("#editModalContent").dialog("open");
	});


	$('#chrome_top_feature').click(function () {
		chrome.windows.getCurrent(function (windows) {
			_opkeyrecorder.currentopenedwindow = windows.id;
			// alert(_opkeyrecorder.currentopenedwindow);
		});
		chrome.windows.create({
			"url": chrome.extension.getURL("/Login.html"),
			"pinned": true
		},
			function (tab) {
				tab.highlighted = true;
				tab.active = true;
			});
	});

	$("#delrow").click(function (e) {
		// var selectedrow=_opkeyrecorder.getSelectedRowOfGrid("mainstepgrid");
		var selected_rows = _opkeyrecorder.GetAllSelectedRowsOfGrid("mainstepgrid");
		if (selected_rows != null && selected_rows.length >= 0) {
			swal({
				title: "Are you sure?",
				text: "You will not be able to recover this step!",
				type: "warning",
				showCancelButton: true,
				confirmButtonClass: "btn-danger",
				confirmButtonText: "Yes",
				cancelButtonText: "No",
				closeOnConfirm: false,
				closeOnCancel: true
			},
				function (isConfirm) {
					if (isConfirm) {
						_opkeyrecorder.clearAllDataInGrid("orpropertygrid");
						for (var s_r = 0; s_r < selected_rows.length; s_r++) {
							var selectedrow = selected_rows[s_r];
							_opkeyrecorder.deleteRowFromGrid("mainstepgrid", selectedrow);
						}

						_opkeyrecorder.deleteElementFromArray(_opkeyrecorder.allrecordedstepsarray, selected_rows);
						// neon multi delete of row
						// _opkeyrecorder.RefreshDataIngridAndAssignId("mainstepgrid");
						swal("Deleted!", "Your selected step has been deleted.", "success");
						generateStepNo();
					}
				});
		}
	});

	$("#mainstepgrid").click(function (e) {
		window.setTimeout(function () {

			_opkeyrecorder.rowidarray.push(selectedrow);
			var selectedrow = _opkeyrecorder.getSelectedRowOfGrid("mainstepgrid");
			if (selectedrow != 0) {
				selectedrow--;
			}
			if (_opkeyrecorder.allrecordedstepsarray[selectedrow]) {
				var objectdata = _opkeyrecorder.allrecordedstepsarray[selectedrow].ObjectData;
				_opkeyrecorder.updateOrGrid(objectdata);
				_opkeyrecorder.current_selected_domobject = null;
			}
		}, 200);
	});


	$("#spydomgrid").click(function (e) {
		var total_records = _opkeyrecorder.getTotalRowsOfGrid("spydomgrid");
		var selectedrow = _opkeyrecorder.getSelectedRowOfGrid("spydomgrid");
		_opkeyrecorder.InjectHighlightFunction(selectedrow);
		if (_opkeyrecorder.allrecordedstepsarray) {
			var objectdata = _opkeyrecorder.allrecordeddomssarray[selectedrow].ObjectData;
			_opkeyrecorder.current_selected_domobject = objectdata;
			_opkeyrecorder.updateSpyOrGrid(objectdata);
			_opkeyrecorder.updateOrGrid(objectdata);
		}
	});

	$("#navigatetextbox").keyup(function (e) {
		if (e.keyCode == 13) {
			$("#navigatebutton").click();
		}
		var navigateurl = $("#navigatetextbox").val();
		if (navigateurl == "") {
			$("#navigatebutton").attr('enabled', false);
			$("#navigatebutton").attr('disabled', true);
		} else {
			$("#navigatebutton").attr('disabled', false);
			$("#navigatebutton").attr('enabled', true);
		}
	});
	$("#navigatebutton").click(function (e) {
		var navigateurl = $("#navigatetextbox").val();
		var or_object = new Object();
		var par_object = new Object();
		or_object["logicalname"] = "";
		par_object["url"] = $("#navigatetextbox").val();
		par_object["Title"] = "";
		par_object["TitleIndex"] = "0"
		or_object["parent"] = par_object;
		_opkeyrecorder.AddStepFromSpy("NavigateTo", or_object, DOMPurify.sanitize($("#navigatetextbox").val()), true, false);
		_opkeyrecorder.Navigate(navigateurl);
	});


	// need to fix
	$("#record").click(function (e) {
		if ($("#pause").hasClass("fa-circle")) {
			if ($("#pause").hasClass("pausedfromspy")) {
				$("#pause").removeClass("pausedfromspy");
				$("#pausePlayHolder").click();
				pausedByUser = false;
			}
		}
		if (isMobileRecording()) {
			if (isLocalMobileRecording()) {
				_opkeyrecorder.StopLocalSpy();
			}
			else {
				_opkeyrecorder.StopPcloudySpy();
			}
		}
	});

	$("#spy").click(function (e) {
		if ($("#pause").hasClass("fa-pause")) {
			$("#pause").addClass("pausedfromspy");
			$("#pausePlayHolder").click();
			pausedByUser = false;
		}
		if (isMobileRecording()) {

			if (isLocalMobileRecording()) {
				_opkeyrecorder.StartLocalSpy();
			}
			else {
				_opkeyrecorder.StartPcloudySpy();
			}
		}


	})

	$("#pausePlayHolder").click(function (e) {
		if ($("#pause").hasClass("fa-pause")) {
			$("#pause").removeClass("fa-pause");
			$("#pause").addClass("fa-circle");
			$("#pause").attr("title", "Start Recording");
			$("#pausePlayHolder").attr("title", "Start Recording");
			//$("#snipingtool").prop("disabled", true);
			$("#pausePlayHolder").removeClass("live_Rec_BTNStyle");
			$("#pausePlayHolder").addClass("rec_BTNStyle");
			pausedByUser = true;
			chrome.runtime.sendMessage({
				setPause: "setPause"
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});

			debugger

			chrome.runtime.sendMessage({
				setDockerCommandFromRecorder: {
					"action": "pause"
				}
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
		} else if ($("#pause").hasClass("fa-circle")) {
			pausedByUser = false;
			$("#pausePlayHolder").addClass("live_Rec_BTNStyle");
			$("#pausePlayHolder").removeClass("rec_BTNStyle");
			$("#pause").removeClass("fa-circle");
			$("#pause").addClass("fa-pause");
			$("#pause").attr("title", "Stop Recording");
			$("#pausePlayHolder").attr("title", "Stop Recording");
			$("#snipingtool").prop("disabled", false);
			chrome.runtime.sendMessage({
				setResume: "setResume"
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
			debugger
			chrome.runtime.sendMessage({
				setDockerCommandFromRecorder: {
					"action": "play"
				}
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
		}
	});


	$("#popup_close_install_opkey").click(function (e) {
		$("#div_popup_main").hide();
		$("#popup_install_opkey").hide();
	});

	$("#popup_close_setting_playback").click(function (e) {
		$("#div_popup_main").hide();
		$("#popup_setting_playback").hide();
	});

	var sub_regexes = {
		"tag": "([a-zA-Z][a-zA-Z0-9]{0,10}|\\*)",
		"attribute": "[.a-zA-Z_:][-\\w:.]*(\\(\\))?)",
		"value": "\\s*[\\w/:][-/\\w\\s,:;.]*"
	};

	var validation_re =
		"(?P<node>" +
		"(" +
		"^id\\([\"\\']?(?P<idvalue>%(value)s)[\"\\']?\\)" + // special case!
		// `id(idValue)`
		"|" +
		"(?P<nav>//?(?:following-sibling::)?)(?P<tag>%(tag)s)" + // `//div`
		"(\\[(" +
		"(?P<matched>(?P<mattr>@?%(attribute)s=[\"\\'](?P<mvalue>%(value)s))[\"\\']" + // `[@id="well"]`
		// supported
		// and
		// `[text()="yes"]`
		// is
		// not
		"|" +
		"(?P<contained>contains\\((?P<cattr>@?%(attribute)s,\\s*[\"\\'](?P<cvalue>%(value)s)[\"\\']\\))" + // `[contains(@id,
		// "bleh")]`
		// supported
		// and
		// `[contains(text(),
		// "some")]`
		// is
		// not
		")\\])?" +
		"(\\[\\s*(?P<nth>\\d|last\\(\\s*\\))\\s*\\])?" +
		")" +
		")";

	for (var prop in sub_regexes)
		validation_re = validation_re.replace(new RegExp('%\\(' + prop + '\\)s', 'gi'), sub_regexes[prop]);
	validation_re = validation_re.replace(/\?P<node>|\?P<idvalue>|\?P<nav>|\?P<tag>|\?P<matched>|\?P<mattr>|\?P<mvalue>|\?P<contained>|\?P<cattr>|\?P<cvalue>|\?P<nth>/gi, '');

	function XPathException(message) {
		this.message = message;
		this.name = "[XPathException]";
	}

	OpkeyRecorder.prototype.cssify = function (xpath) {
		var prog, match, res, nav, tag, attr, nth, nodes, css, node_css = '',
			csses = [],
			xindex = 0,
			position = 0;

		// preparse xpath:
		// `contains(concat(" ", @class, " "), " classname ")` =>
		// `@class=classname` => `.classname`
		console.log("Xpath Length " + xpath.length)
		if (xpath.length > 300) {
			return "";
		}
		xpath = xpath.replace(/contains\s*\(\s*concat\(["']\s+["']\s*,\s*@class\s*,\s*["']\s+["']\)\s*,\s*["']\s+([a-zA-Z0-9-_]+)\s+["']\)/gi, '@class="$1"');

		if (typeof xpath == 'undefined' || (
			xpath.replace(/[\s-_=]/g, '') === '' ||
			xpath.length !== xpath.replace(/[-_\w:.]+\(\)\s*=|=\s*[-_\w:.]+\(\)|\sor\s|\sand\s|\[(?:[^\/\]]+[\/\[]\/?.+)+\]|starts-with\(|\[.*last\(\)\s*[-\+<>=].+\]|number\(\)|not\(|count\(|text\(|first\(|normalize-space|[^\/]following-sibling|concat\(|descendant::|parent::|self::|child::|/gi, '').length)) {
			// `number()=` etc or `=normalize-space()` etc, also `a or b` or `a
			// and b` (to fix?) or other unsupported keywords
			// throw new XPathException('Invalid or unsupported XPath: ' +
			// xpath);
		}

		var xpatharr = xpath.split('|');
		while (xpatharr[xindex]) {
			prog = new RegExp(validation_re, 'gi');
			css = [];

			while (nodes = prog.exec(xpatharr[xindex])) {
				if (!nodes && position === 0) {
					// throw new XPathException('Invalid or unsupported XPath: '
					// + xpath);
				}


				match = {
					node: nodes[5],
					idvalue: nodes[12] || nodes[3],
					nav: nodes[4],
					tag: nodes[5],
					matched: nodes[7],
					mattr: nodes[10] || nodes[14],
					mvalue: nodes[12] || nodes[16],
					contained: nodes[13],
					cattr: nodes[14],
					cvalue: nodes[16],
					nth: nodes[18]
				};


				if (position != 0 && match['nav']) {
					if (~match['nav'].indexOf('following-sibling::')) nav = ' + ';
					else nav = (match['nav'] == '//') ? ' ' : ' > ';
				} else {
					nav = '';
				}
				tag = (match['tag'] === '*') ? '' : (match['tag'] || '');

				if (match['contained']) {
					if (match['cattr'].indexOf('@') === 0) {
						attr = '[' + match['cattr'].replace(/^@/, '') + '*=' + match['cvalue'] + ']';
					} else { // if(match['cattr'] === 'text()')
						// throw new XPathException('Invalid or unsupported
						// XPath attribute: ' + match['cattr']);
					}
				} else if (match['matched']) {
					switch (match['mattr']) {
						case '@id':
							attr = '#' + match['mvalue'].replace(/^\s+|\s+$/, '').replace(/\s/g, '#');
							break;
						case '@class':
							attr = '.' + match['mvalue'].replace(/^\s+|\s+$/, '').replace(/\s/g, '.');
							break;
						case 'text()':
						case '.':
						// throw new XPathException('Invalid or unsupported
						// XPath attribute: ' + match['mattr']);
						default:
							if (match['mattr'].indexOf('@') !== 0) {
								// throw new XPathException('Invalid or
								// unsupported XPath attribute: ' +
								// match['mattr']);
							}
							if (match['mvalue'].indexOf(' ') !== -1) {
								match['mvalue'] = '\"' + match['mvalue'].replace(/^\s+|\s+$/, '') + '\"';
							}
							attr = '[' + match['mattr'].replace('@', '') + '=' + match['mvalue'] + ']';
							break;
					}
				} else if (match['idvalue'])
					attr = '#' + match['idvalue'].replace(/\s/, '#');
				else
					attr = '';

				if (match['nth']) {
					if (match['nth'].indexOf('last') === -1) {
						if (isNaN(parseInt(match['nth'], 10))) {
							// throw new XPathException('Invalid or unsupported
							// XPath attribute: ' + match['nth']);
						}
						nth = parseInt(match['nth'], 10) !== 1 ? ':nth-of-type(' + match['nth'] + ')' : ':first-of-type';
					} else {
						nth = ':last-of-type';
					}
				} else {
					nth = '';
				}
				node_css = nav + tag + attr + nth;


				css.push(node_css);
				position++;
			} // while(nodes

			res = css.join('');
			if (res === '') {
				// throw new XPathException('Invalid or unsupported XPath: ' +
				// match['node']);
			}
			csses.push(res);
			xindex++;

		} // while(xpatharr

		return csses.join(', ');
	};





	$(window).resize(function (e) {
		// console.log(e);
		var gridResizeWidth = $('.tab-content').innerWidth() - 30;
		$('#mainstepgrid').setGridWidth(gridResizeWidth);
		$('#orpropertygrid').setGridWidth(gridResizeWidth);
		$('#spydomgrid').setGridWidth(gridResizeWidth);
		$('#spypropertygrid').setGridWidth(gridResizeWidth);
	});
	_opkeyrecorder.clearAllDataInGrid("mainstepgrid");
});

function addKeywords(require_object, keyword, tagname, type, keywordtype, keywordargument_array, attributefilter_array, datatatypepattern_array, requireinput_bool) {
	if (keywordtype == "action") {
		var object_0 = new Object();
		object_0["keyword"] = keyword;
		object_0["tagName"] = tagname;
		object_0["type"] = type;
		object_0["keywordtype"] = keywordtype;
		object_0["attributefilter"] = attributefilter_array;
		object_0["keywordargumentarray"] = keywordargument_array;
		object_0["datatypearray"] = datatatypepattern_array;
		object_0["requireinput"] = requireinput_bool;
		object_0["requireobject"] = require_object;
		_opkeyrecorder.action_keywords.push(object_0);
	} else if (keywordtype == "get") {
		var object_0 = new Object();
		object_0["keyword"] = keyword;
		object_0["tagName"] = tagname;
		object_0["type"] = type;
		object_0["keywordtype"] = keywordtype;
		object_0["attributefilter"] = attributefilter_array;
		object_0["keywordargumentarray"] = keywordargument_array;
		object_0["datatypearray"] = datatatypepattern_array;
		object_0["requireinput"] = requireinput_bool;
		object_0["requireobject"] = require_object;
		_opkeyrecorder.get_keywords.push(object_0);
	} else if (keywordtype == "verify") {
		var object_0 = new Object();
		object_0["keyword"] = keyword;
		object_0["tagName"] = tagname;
		object_0["type"] = type;
		object_0["keywordtype"] = keywordtype;
		object_0["attributefilter"] = attributefilter_array;
		object_0["keywordargumentarray"] = keywordargument_array;
		object_0["datatypearray"] = datatatypepattern_array;
		object_0["requireinput"] = requireinput_bool;
		object_0["requireobject"] = require_object;
		_opkeyrecorder.verify_keywords.push(object_0);
	} else if (keywordtype == "salesforce") {
		var object_0 = new Object();
		object_0["keyword"] = keyword;
		object_0["tagName"] = tagname;
		object_0["type"] = type;
		object_0["keywordtype"] = keywordtype;
		object_0["attributefilter"] = attributefilter_array;
		object_0["keywordargumentarray"] = keywordargument_array;
		object_0["datatypearray"] = datatatypepattern_array;
		object_0["requireinput"] = requireinput_bool;
		object_0["requireobject"] = require_object;
		_opkeyrecorder.salesforce_keyword.push(object_0);
	} else if (keywordtype == "oraclefusion") {
		var object_0 = new Object();
		object_0["keyword"] = keyword;
		object_0["tagName"] = tagname;
		object_0["type"] = type;
		object_0["keywordtype"] = keywordtype;
		object_0["attributefilter"] = attributefilter_array;
		object_0["keywordargumentarray"] = keywordargument_array;
		object_0["datatypearray"] = datatatypepattern_array;
		object_0["requireinput"] = requireinput_bool;
		object_0["requireobject"] = require_object;
		_opkeyrecorder.oraclefusion_keyword.push(object_0);
	} else if (keywordtype == "peoplesoft") {
		var object_0 = new Object();
		object_0["keyword"] = keyword;
		object_0["tagName"] = tagname;
		object_0["type"] = type;
		object_0["keywordtype"] = keywordtype;
		object_0["attributefilter"] = attributefilter_array;
		object_0["keywordargumentarray"] = keywordargument_array;
		object_0["datatypearray"] = datatatypepattern_array;
		object_0["requireinput"] = requireinput_bool;
		object_0["requireobject"] = require_object;
		_opkeyrecorder.peoplesoft_keyword.push(object_0);
	}
}

function InitializeKeyword() {
	addKeywords(true, "ClickButtonInTableCell", "TABLE", "", "action", ["RowIndex*", "ColumnIndex*", "ObjectIndex*"], [""], ["INT", "INT", "INT"], true);
	addKeywords(true, "ClickLinkInTableCell", "TABLE", "", "action", ["RowIndex*", "ColumnIndex*", "ObjectIndex*"], [""], ["INT", "INT", "INT"], true);
	addKeywords(true, "ClickTableCell", "TABLE", "", "action", ["RowIndex*", "ColumnIndex*", "Tag", "ObjectIndex*"], [""], ["INT", "INT", "STRING", "INT"], true);

	addKeywords(true, "ClickOnObjectInTableCell", "TABLE", "", "action", ["RowIndex*", "ColumnIndex*", "Tag*", "Tag Index*"], [""], ["INT", "INT", "STRING", "INT"], true);

	addKeywords(true, "DoubleClickTableCell", "TABLE", "", "action", ["RowIndex*", "ColumnIndex*", "Tag*", "Tag Index*"], [""], ["INT", "INT", "STRING", "INT"], true);

	addKeywords(true, "SelectCheckBoxinTableCell", "TABLE", "", "action", ["RowIndex*", "ColumnIndex*", "ObjectIndex*", "Value*"], [""], ["INT", "INT", "INT", "STRING"], true);

	addKeywords(true, "SelectRadioButtonInTableCell", "TABLE", "", "action", ["RowIndex*", "ColumnIndex*", "ObjectIndex*"], [""], ["INT", "INT", "INT"],
		true);

	addKeywords(true, "DeSelectMultipleDropdownItemInTableCell", "TABLE", "", "action", ["RowIndex*", "ColumnIndex*", "Object Index*", "Value*"], [""], ["INT", "INT", "INT", "STRING"], true);

	addKeywords(true, "SelectDropDownInTableCell", "TABLE", "", "action", ["RowIndex*", "ColumnIndex*", "Object Index*", "SelectValue*"], [""], ["INT", "INT", "INT", "STRING"], true);

	addKeywords(true, "SelectMultipleDropdownItemInTableCell", "TABLE", "", "action", ["RowIndex*", "ColumnIndex*", "Object Index*", "Value*"], [""], ["INT", "INT", "INT", "STRING"], true);

	addKeywords(true, "TypeTextInTableCell", "TABLE", "", "action", ["RowIndex*", "ColumnIndex*", "Tag*", "ObjectIndex*", "Text*"], [""], ["INT", "INT", "STRING", "INT", "STRING"], true);

	addKeywords(true, "TypeOnObjectInTableCell", "TABLE", "", "action", ["RowIndex*", "ColumnIndex*", "Tag*", "Tag Index*", "Text*"], [""], ["INT", "INT", "STRING", "INT", "STRING"], true);

	addKeywords(true, "FetchObjectPropertyInTableCell", "TABLE", "", "action", ["RowIndex*", "ColumnIndex*", "Tag*", "Tag Index", "Property*"], [""], ["INT", "INT", "STRING", "INT", "STRING"], true);

	addKeywords(true, "ClickInTableCellByQuery", "TABLE", "", "action", ["Column Name/Index*", "Object Index", "Header1*", "Value1*", "Header2", "Value2", "Header3", "Value3", "Header4", "Value4", "Header5", "Value5"], [""], ["STRING", "INT", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(true, "TypeTextInTableCellByQuery", "TABLE", "", "action", ["Column Name/Index*", "Object Index", "Header1*", "Value1*", "Header2", "Value2", "Header3", "Value3", "Header4", "Value4", "Header5", "Value5", "Value*"], [""], ["STRING", "INT", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(true, "SelectMultipleDropDownItem", "SELECT", "select-multiple", "action", ["ItemString*"], [""], ["String"], true);
	addKeywords(true, "ClickLink", "A", "", "action", ["", ""], [""], [""], false);
	addKeywords(true, "Click", "", "", "action", ["", ""], [""], [""], false);
	addKeywords(true, "DoubleClick", "", "", "action", ["", ""], [""], [""], false);
	addKeywords(true, "MouseHover", "", "", "action", ["", ""], [""], [""], false);
	addKeywords(true, "Web_ClickByText", "", "", "action", ["TextToSearch", "Index", "PartialText"], [""], ["STRING", "INT", "BOOL"], true);
	addKeywords(true, "Web_SelectListItem", "UL", "", "action", ["Value*"], ["value"], ["String"], true);

	addKeywords(true, "Web_TypeByText", "INPUT", "email", "action", ["TextToSearch", "Index", "PartialText", "TextToType", "Before"], ["placeholder"], ["STRING", "INT", "BOOL", "STRING", "BOOL"], true);
	addKeywords(true, "Web_TypeByText", "INPUT", "tel", "action", ["TextToSearch", "Index", "PartialText", "TextToType", "Before"], ["placeholder"], ["STRING", "INT", "BOOL", "STRING", "BOOL"], true);

	addKeywords(true, "Web_TypeByText", "INPUT", "text", "action", ["TextToSearch", "Index", "PartialText", "TextToType", "Before"], ["placeholder"], ["STRING", "INT", "BOOL", "STRING", "BOOL"], true);

	addKeywords(true, "Web_TypeByText", "INPUT", "password", "action", ["TextToSearch", "Index", "PartialText", "TextToType", "Before"], ["placeholder"], ["STRING", "INT", "BOOL", "STRING", "BOOL"], true);

	addKeywords(true, "Web_TypeByText", "TEXTAREA", "", "action", ["TextToSearch", "Index", "PartialText", "TextToType", "Before"], ["placeholder"], ["STRING", "INT", "BOOL", "STRING", "BOOL"], true);

	addKeywords(true, "GetFullTableText", "TABLE", "", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetTableCellText", "TABLE", "", "get", ["RowIndex", "ColumnIndex", "Before", "After"], [""], ["INT", "INT", "STRING", "STRING"],
		true);

	addKeywords(true, "GetTableColumnCount", "TABLE", "", "get", ["RowIndex*"], [""], ["INT"], true);
	addKeywords(true, "GetTableRowCount", "TABLE", "", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetCompleteTableText", "TABLE", "", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetSelectedDropDownItemInTableCell", "TABLE", "", "get", ["Row Index", "Column Index", "Object Index"], [""], ["INT", "INT", "INT"], true);

	addKeywords(true, "GetTableColumnHeader", "TABLE", "", "get", ["Column Index*"], [""], ["INT"], true);
	addKeywords(true, "GetTableRowNumber", "TABLE", "", "get", ["Column Index*", "Value*"], [""], ["INT", "STRING"], true);
	addKeywords(true, "GetTableColumnNumber", "TABLE", "", "get", ["Row Index*", "Value*"], [""], ["INT", "STRING"], true);
	addKeywords(true, "GetTextFromTableCellByQuery", "TABLE", "", "get", ["Column Name/Index*", "Object Index", "Header1*", "Value1*", "Header2", "Value2", "Header3", "Value3", "Header4", "Value4", "Header5", "Value5"], [""], ["STRING", "INT", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(true, "GetButtonToolTip", "INPUT", "button", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetButtonToolTip", "BUTTON", "", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetImageToolTip", "IMG", "", "get", ["", ""], [""], [""], false);

	addKeywords(true, "GetLinkToolTip", "A", "", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetCheckboxStatus", "INPUT", "checkbox", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetCheckBoxToolTip", "INPUT", "checkbox", "get", ["", ""], [""], [""], false);

	addKeywords(true, "GetEditBoxName", "INPUT", "text", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetEditBoxToolTip", "INPUT", "text", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetTextFromEditBox", "INPUT", "text", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetEditboxDefaultvalue", "INPUT", "text", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetEditboxLength", "INPUT", "text", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetEditboxValue", "INPUT", "text", "get", ["", ""], [""], [""], false);

	addKeywords(true, "GetEditBoxName", "INPUT", "email", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetEditBoxToolTip", "INPUT", "email", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetTextFromEditBox", "INPUT", "email", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetEditboxDefaultvalue", "INPUT", "email", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetEditboxLength", "INPUT", "email", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetEditboxValue", "INPUT", "email", "get", ["", ""], [""], [""], false);

	addKeywords(true, "GetEditBoxName", "INPUT", "tel", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetEditBoxToolTip", "INPUT", "tel", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetTextFromEditBox", "INPUT", "tel", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetEditboxDefaultvalue", "INPUT", "tel", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetEditboxLength", "INPUT", "tel", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetEditboxValue", "INPUT", "tel", "get", ["", ""], [""], [""], false);

	addKeywords(true, "GetEditBoxName", "INPUT", "password", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetEditBoxToolTip", "INPUT", "password", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetTextFromEditBox", "INPUT", "password", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetEditboxDefaultvalue", "INPUT", "password", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetEditboxLength", "INPUT", "password", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetEditboxValue", "INPUT", "password", "get", ["", ""], [""], [""], false);

	addKeywords(true, "GetTextAreaLength", "TEXTAREA", "", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetTextAreaToolTip", "TEXTAREA", "", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetTextAreavalue", "TEXTAREA", "", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetTextfromTextArea", "TEXTAREA", "", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetTextAreaDefaultvalue", "TEXTAREA", "", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetTextAreaName", "TEXTAREA", "", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetDropDownItemCount", "SELECT", "", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetDropDownToolTip", "SELECT", "", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetSelectedDropDownItem", "SELECT", "", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetObjectText", "", "", "get", ["Before", "After"], [""], ["STRING", "STRING"], true);
	addKeywords(true, "GetObjectExistence", "", "", "get", ["", ""], [""], [""], false);
	addKeywords(true, "GetObjectProperty", "", "", "get", ["Property*"], [""], ["STRING"], true);
	addKeywords(true, "GetChildObjectCount", "", "", "get", ["Tag*", "PropertyName*", "PropertyValue"], [""], ["STRING", "STRING", "STRING"], true);
	addKeywords(true, "GetObjectCount", "",
		"", "get", ["PropertyName1*", "PropertyValue1", "PropertyName2", "PropertyValue2", "PropertyName3", "PropertyValue3", "PropertyName4", "PropertyValue4",
		"PropertyName5", "PropertyValue5"
	], [""], ["STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(true, "Web_VerifyListItemExists", "UL", "", "verify", ["ExpectedValue*"], ["value"], ["String"], true);
	addKeywords(true, "VerifyCheckboxStatusInTableCell", "TABLE", "", "verify", ["Row Index*", "Column Index*", "Object Index*", "Status*"], [""], ["INT", "INT", "INT", "STRING"], true);

	addKeywords(true, "VerifyTableColumnHeader", "TABLE", "", "verify", ["Expected Text"], [""], ["String"], true);
	addKeywords(true, "VerifyTextInTableCell", "TABLE", "", "verify", ["Row Index*", "Column Index*", "ExpectedValue*", "Before", "After"], [""], ["INT", "INT", "STRING", "STRING", "STRING"], true);

	addKeywords(true, "VerifyFullTableText", "TABLE", "", "verify", ["Text*"], [""], ["String"], true);
	addKeywords(true, "VerifyTableColumnCount", "TABLE", "", "verify", ["Row Index*", "Count*"], [""], ["INT", "INT"], true);
	addKeywords(true, "VerifyTableRowCount", "TABLE", "", "verify", ["Count*"], [""], ["INT"], true);
	addKeywords(true, "VerifyTableColumnNumber", "TABLE", "", "verify", ["Row Index*", "Value", "ExpectedColumnNumber*"], [""], ["INT", "STRING", "INT"],
		true);

	addKeywords(true, "VerifyTableRowNumber", "TABLE", "", "verify", ["Column Index*", "Value", "Expected Row Number*"], [""], ["INT", "STRING", "INT"],
		true);

	addKeywords(true, "VerifyTableColumnText", "TABLE", "", "verify", ["Row Index*", "Expected Text"], [""], ["INT", "STRING"], true);
	addKeywords(true, "VerifyTableRowText", "TABLE", "", "verify", ["Column Index*", "Expected Text"], [""], ["INT", "STRING"], true);
	addKeywords(true, "VerifyButtonEnabled", "INPUT", "button", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyButtonExist", "INPUT", "button", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyButtonEnabled", "button", "", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyButtonExist", "button", "", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyImageEnabled", "IMG", "", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyImageExist", "IMG", "", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyImageVisible", "IMG", "", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyLinkEnabled", "A", "", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyLinkExist", "A", "", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyLinkVisible", "A", "", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyCheckBoxEnabled", "INPUT", "checkbox", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyCheckBoxExist", "INPUT", "checkbox", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyCheckBoxStatus", "INPUT", "checkbox", "verify", ["Value*"], [""], ["STRING"], true);
	addKeywords(true, "VerifyCheckBoxToolTip", "INPUT", "checkbox", "verify", ["Tooltip"], [""], ["STRING"], true);
	addKeywords(true, "VerifyEditBoxDefaultValue", "INPUT", "text", "verify", ["Value"], [""], ["STRING"], true);
	addKeywords(true, "VerifyEditBoxEditable", "INPUT", "text", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyEditBoxEnabled", "INPUT", "text", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyEditBoxExistAndWait", "INPUT", "text", "verify", ["TimeOut*"], [""], ["INT"], true);
	addKeywords(true, "VerifyEditBoxLength", "INPUT", "text", "verify", ["Length"], ["length"], ["INT"], true);
	addKeywords(true, "VerifyEditBoxName", "INPUT", "text", "verify", ["Expected Name"], ["name"], ["STRING"], true);
	addKeywords(true, "VerifyEditBoxText", "INPUT", "text", "verify", ["Value"], ["value", "innerText"], ["STRING"], true);
	addKeywords(true, "VerifyEditBoxToolTip", "INPUT", "text", "verify", ["Tooltip"], [""], ["STRING"], true);
	addKeywords(true, "VerifyEditBoxValue", "INPUT", "text", "verify", ["Expected Value"], ["value"], ["STRING"], true);

	addKeywords(true, "VerifyEditBoxDefaultValue", "INPUT", "email", "verify", ["Value"], [""], ["STRING"], true);
	addKeywords(true, "VerifyEditBoxEditable", "INPUT", "email", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyEditBoxEnabled", "INPUT", "email", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyEditBoxExistAndWait", "INPUT", "email", "verify", ["TimeOut*"], [""], ["INT"], true);
	addKeywords(true, "VerifyEditBoxLength", "INPUT", "email", "verify", ["Length"], ["length"], ["INT"], true);
	addKeywords(true, "VerifyEditBoxName", "INPUT", "email", "verify", ["Expected Name"], [""], ["STRING"], true);
	addKeywords(true, "VerifyEditBoxText", "INPUT", "email", "verify", ["Value"], ["value", "innerText"], ["STRING"], true);
	addKeywords(true, "VerifyEditBoxToolTip", "INPUT", "email", "verify", ["ToolTip"], [""], ["STRING"], true);
	addKeywords(true, "VerifyEditBoxValue", "INPUT", "email", "verify", ["Expected Value"], [""], ["STRING"], true);

	addKeywords(true, "VerifyEditBoxDefaultValue", "INPUT", "tel", "verify", ["Value"], [""], ["STRING"], true);
	addKeywords(true, "VerifyEditBoxEditable", "INPUT", "tel", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyEditBoxEnabled", "INPUT", "tel", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyEditBoxExistAndWait", "INPUT", "tel", "verify", ["TimeOut*"], [""], ["INT"], true);
	addKeywords(true, "VerifyEditBoxLength", "INPUT", "tel", "verify", ["Length"], ["length"], ["INT"], true);
	addKeywords(true, "VerifyEditBoxName", "INPUT", "tel", "verify", ["Expected Name"], [""], ["STRING"], true);
	addKeywords(true, "VerifyEditBoxText", "INPUT", "tel", "verify", ["Value"], ["value", "innerText"], ["STRING"], true);
	addKeywords(true, "VerifyEditBoxToolTip", "INPUT", "tel", "verify", ["ToolTip"], [""], ["STRING"], true);
	addKeywords(true, "VerifyEditBoxValue", "INPUT", "tel", "verify", ["Expected Value"], [""], ["STRING"], true);

	addKeywords(true, "VerifyEditBoxDefaultValue", "INPUT", "password", "verify", ["Value"], [""], ["STRING"], true);
	addKeywords(true, "VerifyEditBoxEditable", "INPUT", "password", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyEditBoxEnabled", "INPUT", "password", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyEditBoxExistAndWait", "INPUT", "password", "verify", ["TimeOut*"], [""], ["INT"], true);
	addKeywords(true, "VerifyEditBoxLength", "INPUT", "password", "verify", ["Length"], ["length"], ["INT"], true);
	addKeywords(true, "VerifyEditBoxName", "INPUT", "password", "verify", ["Expected Name"], [""], ["STRING"], true);
	addKeywords(true, "VerifyEditBoxText", "INPUT", "password", "verify", ["Value"], [""], ["STRING"], true);
	addKeywords(true, "VerifyEditBoxToolTip", "INPUT", "password", "verify", ["ToolTip"], [""], ["STRING"], true);
	addKeywords(true, "VerifyEditBoxValue", "INPUT", "password", "verify", ["Expected Value"], [""], ["STRING"], true);

	addKeywords(true, "VerifyTextAreaDefaultValue", "TEXTAREA", "", "verify", ["Value"], [""], ["STRING"], true);
	addKeywords(true, "VerifyTextAreaEditable", "TEXTAREA", "", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyTextAreaEnabled", "TEXTAREA", "", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyTextAreaExist", "TEXTAREA", "", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyTextAreaText", "TEXTAREA", "", "verify", ["Value"], ["value", "innerText"], ["STRING"], true);
	addKeywords(true, "VerifyTextAreaToolTip", "TEXTAREA", "", "verify", ["Tooltip"], [""], ["STRING"], true);
	addKeywords(true, "VerifyTextAreaValue", "TEXTAREA", "", "verify", ["Value"], ["value", "innerText"], ["STRING"], true);

	addKeywords(true, "VerifyTextAreaLength", "TEXTAREA", "", "verify", ["Length"], ["length"], ["INT"], true);
	addKeywords(true, "VerifyTextAreaName", "TEXTAREA", "", "verify", ["ExpectedValue"], ["name"], ["STRING"], true);

	addKeywords(true, "VerifyDropDownDefaultItem", "SELECT", "", "verify", ["Item"], [""], ["STRING"], true);
	addKeywords(true, "VerifyDropDownEnabled", "SELECT", "", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyDropDownExist", "SELECT", "", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyDropDownItemCount", "SELECT", "", "verify", ["Value*"], [""], ["INT"], true);
	addKeywords(true, "VerifyDropDownItemExists", "SELECT", "", "verify", ["Item*"], [""], ["STRING"], true);
	addKeywords(true, "VerifyDropDownSelection", "SELECT", "", "verify", ["Item*"], [""], ["STRING"], true);
	addKeywords(true, "VerifyDropDownToolTip", "SELECT", "", "verify", ["ToolTip"], [""], ["String"], true);
	addKeywords(true, "VerifyMultipleDropDownItemExist", "SELECT", "select-multiple", "verify", ["Item String*"], [""], ["STRING"], true);
	addKeywords(true, "VerifyRadioButtonEnabled", "INPUT", "radio", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyRadioButtonExist", "INPUT", "radio", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyRadioButtonSelected", "INPUT", "radio", "verify", ["Index"], [""], ["INT"], true);

	addKeywords(true, "VerifyObjectText", "", "", "verify", ["Value", "Before", "After"], ["innerText", "value"], ["STRING", "STRING", "STRING"], true);
	addKeywords(true, "VerifyObjectValue", "", "", "verify", ["ExpectedValue"], ["value"], ["STRING"], true);
	addKeywords(true, "VerifyObjectPropertyValue", "", "", "verify", ["PropertyName*", "PropertyValue"], [""], ["STRING", "STRING"], true);
	addKeywords(true, "VerifyObjectExists", "", "", "verify", ["", ""], [""], [""], false);
	addKeywords(true, "VerifyObjectEnabled", "", "", "verify", ["", ""], [""], [""], false);

	addKeywords(false, "IsTextPresentOnScreen", "", "", "verify", ["TextToSearch*", "Before", "After"], [""], ["STRING", "STRING", "STRING"], true);

	addKeywords(false, "SF_GoToHome", "", "", "salesforce", ["", ""], [""], [""], false);
	addKeywords(false, "SF_GoToChatter", "", "", "salesforce", ["", ""], [""], [""], false);
	addKeywords(false, "SF_GoToAccounts", "", "", "salesforce", ["", ""], [""], [""], false);
	addKeywords(false, "SF_GoToContacts", "", "", "salesforce", ["", ""], [""], [""], false);
	addKeywords(false, "SF_GoToLeads", "", "", "salesforce", ["", ""], [""], [""], false);
	addKeywords(false, "SF_GoToOpportunities", "", "", "salesforce", ["", ""], [""], [""], false);
	addKeywords(false, "SF_GoToCalendar", "", "", "salesforce", ["", ""], [""], [""], false);
	addKeywords(false, "SF_GoToGroups", "", "", "salesforce", ["", ""], [""], [""], false);
	addKeywords(false, "SF_GoToNotes", "", "", "salesforce", ["", ""], [""], [""], false);
	addKeywords(false, "SF_GoToDashboards", "", "", "salesforce", ["", ""], [""], [""], false);
	addKeywords(false, "SF_GoToTasks", "", "", "salesforce", ["", ""], [""], [""], false);
	addKeywords(false, "SF_GoToFiles", "", "", "salesforce", ["", ""], [""], [""], false);
	addKeywords(false, "SF_GoToForecasts", "", "", "salesforce", ["", ""], [""], [""], false);
	addKeywords(false, "SF_GoToProducts", "", "", "salesforce", ["", ""], [""], [""], false);
	addKeywords(false, "SF_GoToReports", "", "", "salesforce", ["", ""], [""], [""], false);

	addKeywords(false, "SF_SetTime", "", "", "salesforce", ["TimeEvent", "Index", "Time(hh:mm)"], [""], ["STRING", "INT", "STRING"], true);
	addKeywords(false, "SF_SetSalesForceEnvironment", "", "", "salesforce", ["Browser", "Url", "Username", "Password", "RememeberMe(On/Off)"], [""], ["STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(false, "SF_Logout", "", "", "salesforce", ["", ""], [""], [""], false);
	addKeywords(false, "SF_SetDate", "", "", "salesforce", ["DateEvent", "Index", "Date(MM/DD/YYYY)"], [""], ["STRING", "INT", "STRING"], true);

	addKeywords(false, "SF_SelectCheckBoxByText", "", "", "salesforce", ["TextToSearch", "Index", "PartialText", "Before", "Status"], [""], ["STRING", "INT", "BOOL", "BOOL", "STRING"], true);

	addKeywords(false, "SF_DeSelectCheckBoxByText", "", "", "salesforce", ["TextToSearch", "Index", "PartialText", "Before"], [""], ["STRING", "INT", "BOOL", "BOOL"], true);

	addKeywords(false, "SF_SelectDropDownByText", "", "", "salesforce", ["DropDownLabel", "Index", "PartialText", "ValueToSelect", "Before", "IsMultipleDropDown"], [""], ["STRING", "INT", "BOOL", "STRING", "BOOL", "BOOL"], true);

	addKeywords(false, "SF_SelectRadioButtonByText", "", "", "salesforce", ["TextToSearch", "Index", "PartialText", "Before"], [""], ["STRING", "INT", "BOOL", "BOOL"], true);

	addKeywords(false, "SF_ClickByText", "", "", "salesforce", ["TextToSearch", "Index", "PartialText", "Before", "After"], [""], ["STRING", "INT", "BOOL", "STRING", "STRING"], true);

	addKeywords(false, "SF_ClickByTextInSequence", "", "", "salesforce", ["TextToSearch", "Index", "PartialText", "TextToSearch2", "Index2", "PartialText2", "TextToSearch3", "Index3", "PartialText3", "TextToSearch4", "Index4",
		"PartialText4", "TextToSearch5", "Index5", "PartialText5"
	], [""], ["STRING", "INT", "BOOL", "STRING", "INT", "BOOL", "STRING", "INT", "BOOL", "STRING", "INT", "BOOL", "STRING", "INT", "BOOL"], true);

	addKeywords(false, "SF_TypeByText", "", "", "salesforce", ["TextToSearch", "Index", "PartialText", "TextToType", "Before"], [""], ["STRING", "INT", "BOOL", "STRING", "BOOL"], true);

	addKeywords(false, "SF_MouseHoverOnText", "", "", "salesforce", ["TextToSearch", "Index", "PartialText"], [""], ["STRING", "INT", "BOOL"], true);
	addKeywords(false, "SF_RefreshSection", "", "", "salesforce", ["", ""], [""], [""], false);
	addKeywords(false, "SF_ClickNewEvent", "", "", "salesforce", ["", ""], [""], [""], false);
	addKeywords(false, "SF_ClickNewDashboard", "", "", "salesforce", ["", ""], [""], [""], false);

	addKeywords(false, "SF_GoToTab", "", "", "salesforce", ["TabName", "Index"], [""], ["STRING", "INT"], true);
	addKeywords(false, "SF_GlobalSearch", "", "", "salesforce", ["Value"], [""], ["STRING"], true);
	addKeywords(false, "SF_AccountExists", "", "", "salesforce", ["Account Name", "Phone", "Billing State/Province", "Identifier1", "Value1", "Identifier2", "Value2"], [""], ["STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(false, "SF_LeadExists", "", "", "salesforce", ["Name", "Company", "Email", "Identifier1", "Value1", "Identifier2", "Value2"], [""], ["STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(false, "SF_ContactExists", "", "", "salesforce", ["Name", "Phone", "Email", "Identifier1", "Value1", "Identifier2", "Value2"], [""], ["STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(false, "SF_OpportunityExists", "", "", "salesforce", ["Opportunity Name", "Account Name", "Stage", "Identifier1", "Value1", "Identifier2", "Value2"], [""], ["STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(false, "SF_GroupExists", "", "", "salesforce", ["Name", "Members", "Owner", "Identifier1", "Value1", "Identifier2", "Value2"], [""], ["STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(false, "SF_QuoteExists", "", "", "salesforce", ["Quote Name", "Opportunity Name", "Expiration Date", "Identifier1", "Value1", "Identifier2", "Value2"], [""], ["STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(false, "SF_SelectNew", "", "", "salesforce", ["TabName", "Index"], [""], ["STRING", "INT"], true);

	addKeywords(false, "SF_EditOpportunityInTable", "", "", "salesforce", ["NewText", "FieldToBeModified", "Save(Y/N)", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5",
		"Value5"
	], [""], ["STRING", "STRING", "BOOL", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(false, "SF_EditContactInTable", "", "", "salesforce", ["NewText", "FieldToBeModified", "Save(Y/N)", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5",
		"Value5"
	], [""], ["STRING", "STRING", "BOOL", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(false, "SF_EditLeadInTable", "", "", "salesforce", ["NewText", "FieldToBeModified", "Save(Y/N)", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5",
		"Value5"
	], [""], ["STRING", "STRING", "BOOL", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(false, "SF_EditAccountInTable", "", "", "salesforce", ["NewText", "FieldToBeModified", "Save(Y/N)", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5",
		"Value5"
	], [""], ["STRING", "STRING", "BOOL", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(false, "SF_LaunchApp", "", "", "salesforce", ["AppName"], [""], ["STRING"], true);
	addKeywords(false, "SF_SelectListViewControl", "", "", "salesforce", ["List View Text"], [""], ["STRING"], true);
	addKeywords(false, "SF_SelectDisplayAs", "", "", "salesforce", ["Display Text"], [""], ["STRING"], true);
	addKeywords(false, "SF_SelectCalenderView", "", "", "salesforce", ["View"], [""], ["STRING"], true);
	addKeywords(false, "SF_SelectEditView", "", "", "salesforce", ["Page View"], [""], ["STRING"], true);

	addKeywords(true, "SF_ClickInTableCellUsingObject", "", "", "salesforce", ["ColumnName", "Object Index", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["STRING", "INT", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(true, "SF_GetTextFromTableCellUsingObject", "", "", "salesforce", ["ColumnName", "Object Index", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["STRING", "INT", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(true, "SF_TypeTextInTableCellUsingObject", "", "", "salesforce", ["ColumnName", "Object Index", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5", "Text"], [""], ["STRING", "INT", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(false, "SF_GetTextFromTableCellUsingText", "", "", "salesforce", ["TableName", "ColumnName", "Object Index", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["STRING", "STRING", "INT", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	addKeywords(false, "SF_TypeTextInTableCellUsingText", "", "", "salesforce", ["TableName", "ColumnName", "Object Index", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5", "Text"], [""], ["STRING", "STRING", "INT", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"],
		true);

	addKeywords(false, "SF_ClickInTableCellUsingText", "", "", "salesforce", ["TableName", "ColumnName", "Object Index", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5", "TableColumns"], [""], ["STRING", "STRING", "INT", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"], true);

	// OracleFusion Keywords
	addKeywords(true, "OracleFusion_SelectDropDownInTableCell", "", "", "oraclefusion", ["ColumnName", "RowNumber", "ValueToSelect", "ObjectIndex", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "Integer", "String", "Integer", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "OracleFusion_VerifyTableCellValue", "", "", "oraclefusion", ["ColumnName", "RowNumber", "ExpectedText", "ObjectIndex", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "Integer", "String", "Integer", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "OracleFusion_TypeTextInTableCell", "", "", "oraclefusion", ["ColumnName", "RowNumber", "ValueToType", "ObjectIndex", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "Integer", "String", "Integer", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "OracleFusion_ClickTableCell", "", "", "oraclefusion", ["ColumnName", "RowNumber", "ObjectIndex", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "Integer", "Integer", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "OracleFusion_HighlightTableCell", "", "", "oraclefusion", ["ColumnName", "RowNumber", "ObjectIndex", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "Integer", "Integer", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "OracleFusion_GetTableCellValue", "", "", "oraclefusion", ["ColumnName", "RowNumber", "ObjectIndex", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "Integer", "Integer", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);

	//

	// PeopleSoft Keywords

	addKeywords(true, "PS_SelectDropDownInTableCell", "", "", "peoplesoft", ["ColumnName", "RowNumber", "ValueToSelect", "ObjectIndex", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "Integer", "String", "Integer", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "PS_VerifyTableCellValue", "", "", "peoplesoft", ["ColumnName", "RowNumber", "ExpectedText", "ObjectIndex", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "Integer", "String", "Integer", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "PS_TypeTextInTableCell", "", "", "peoplesoft", ["ColumnName", "RowNumber", "ValueToType", "ObjectIndex", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "Integer", "String", "Integer", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "PS_ClickTableCell", "", "", "peoplesoft", ["ColumnName", "RowNumber", "ObjectIndex", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "Integer", "Integer", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "PS_HighlightTableCell", "", "", "peoplesoft", ["ColumnName", "RowNumber", "ObjectIndex", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "Integer", "Integer", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "PS_GetTableCellValue", "", "", "peoplesoft", ["ColumnName", "RowNumber", "ObjectIndex", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "Integer", "Integer", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);

	// Added By Raunak
	addKeywords(true, "SF_GetObjectText", "", "", "salesforce", ["Before", "After"], [""], ["String", "String"], true);
	addKeywords(true, "SF_VerifyDropDownItemExists", "", "", "salesforce", ["Item"], [""], ["String"], true);
	addKeywords(true, "SF_GetObjectExistence", "", "", "salesforce", [""], [""], [""], true);
	addKeywords(true, "SF_GetObjectProperty", "", "", "salesforce", ["Property"], [""], ["String"], true);
	addKeywords(true, "SF_GetChildObjectCount", "", "", "salesforce", ["Tag", "PropertyName", "PropertyValue"], [""], ["String", "String", "String"], true);
	addKeywords(true, "SF_GetObjectCount", "", "", "salesforce", ["AttributeName1", "AttributeValue1", "AttributeName2", "AttributeValue2", "AttributeName3", "AttributeValue3", "AttributeName4", "AttributeValue4", "AttributeName5", "AttributeValue5"], [""], ["String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "SF_VerifyDropDownItemCount", "", "", "salesforce", ["Value"], [""], ["Integer"], true);
	addKeywords(true, "SF_VerifyMultipleDropDownItemExist", "", "", "salesforce", ["Item String"], [""], ["String"], true);
	addKeywords(true, "SF_VerifyRadioButtonSelected", "", "", "salesforce", ["Index"], [""], ["Integer"], true);
	addKeywords(true, "SF_VerifyObjectText", "", "", "salesforce", ["Value", "Before", "After"], [""], ["String", "String", "String"], true);
	addKeywords(true, "SF_VerifyObjectPropertyValue", "", "", "salesforce", ["PropertyName", "PropertyValue"], [""], ["String", "String"], true);
	addKeywords(true, "SF_VerifyObjectExists", "", "", "salesforce", [""], [""], [""], true);
	addKeywords(true, "SF_VerifyObjectEnabled", "", "", "salesforce", [""], [""], [""], true);
	addKeywords(true, "SF_MouseHover", "", "", "salesforce", [""], [""], [""], true);
	addKeywords(true, "SF_VerifyListItemExists", "", "", "salesforce", ["ExpectedValue"], [""], ["String"], true);
	addKeywords(true, "SF_GetAllDropDownItems", "", "", "salesforce", ["Label Name", "Delimiter"], [""], ["String", "String"], true);
	addKeywords(false, "SF_SelectValueFromLookUp", "", "", "salesforce", ["LabelName", "LookUp to Select"], [""], ["String", "String"], true);
	addKeywords(true, "SF_DeSelectCheckBox", "", "", "salesforce", [""], [""], [""], true);

	addKeywords(true, "SF_Click", "", "", "salesforce", [""], [""], [""], true);
	addKeywords(true, "SF_ClickButton", "", "", "salesforce", [""], [""], [""], true);
	addKeywords(true, "SF_ClickImage", "", "", "salesforce", [""], [""], [""], true);
	addKeywords(true, "SF_ClickLink", "", "", "salesforce", [""], [""], [""], true);
	addKeywords(true, "SF_SelectCheckBox", "", "", "salesforce", ["Value"], [""], ["String"], true);
	addKeywords(true, "SF_SelectDropDownItem", "", "", "salesforce", ["Item"], [""], ["String"], true);
	addKeywords(true, "SF_SelectFrame", "", "", "salesforce", [""], [""], [""], true);
	addKeywords(true, "SF_SelectListItem", "", "", "salesforce", ["Value"], [""], ["String"], true);
	addKeywords(true, "SF_SelectMultipleDropdownItem", "", "", "salesforce", ["ItemString"], [""], ["String"], true);
	addKeywords(true, "SF_SelectRadioButton", "", "", "salesforce", ["Index"], [""], ["Integer"], true);
	addKeywords(true, "SF_SelectWindow", "", "", "salesforce", ["Title", "TitleIndex"], [""], ["String", "Integer"], true);
	addKeywords(true, "SF_TypeTextInTextArea", "", "", "salesforce", ["Value"], [""], ["String"], true);
	addKeywords(true, "SF_TypeTextOnEditBox", "", "", "salesforce", ["Value"], [""], ["String"], true);

	addKeywords(false, "SF_ClickImageByTitle/Alt", "", "", "salesforce", ["Title/Alt", "Index", "PartialText", "Object"], [""], ["String", "Integer", "BOOL", "String"], true);

	addKeywords(false, "SF_SelectDataFromPickList", "", "", "salesforce", ["labelName", "Index", "ValueToSelect"], [""], ["String", "Integer", "String"], true);

	addKeywords(false, "SF_SelectTab", "", "", "salesforce", ["TabName", "Index"], [""], ["String", "Integer"], true);
	addKeywords(false, "SF_SelectRecord", "", "", "salesforce", ["RecordName", "Index"], [""], ["String", "Integer"], true);
	addKeywords(false, "SF_GlobalSearchAndSelect", "", "", "salesforce", ["ValueToSearch", "ValueToSelect", "Index"], [""], ["String", "String", "Integer"], true);
	addKeywords(false, "SF_SetDateTime", "", "", "salesforce", ["labelName", "Index", "Value(dd/mm/yyyy hh:mm)"], [""], ["String", "Integer", "String"], true);
	addKeywords(false, "SF_SetTextAlignment", "", "", "salesforce", ["labelName", "Alignment"], [""], ["String", "String"], true);
	addKeywords(false, "SF_TypeTextOnRichTextAreaByText", "", "", "salesforce", ["LabelName", "TextToType", "Bold", "Italic", "Underline", "Strikethrough", "BulletedList", "NumberedList", "Indent", "Outdent", "FontStyle", "FontSize"], [""], ["String", "String", "BOOL", "BOOL", "BOOL", "BOOL", "BOOL", "BOOL", "BOOL", "BOOL", "String", "Integer"], true);
	addKeywords(false, "SF_SetGeoLocationValue", "", "", "salesforce", ["Label", "Index", "Latitude", "Longitude"], [""], ["String", "Integer", "String", "String"], true);
	addKeywords(false, "SF_SearchAndSelect", "", "", "salesforce", ["LabelName", "Index", "MenuItem", "TextToType"], [""], ["String", "Integer", "String", "String"], true);
	addKeywords(false, "SF_GoToQuotes", "", "", "salesforce", [""], [""], [""], false);
	addKeywords(false, "SF_LaunchAppAndSelectItem", "", "", "salesforce", ["Item"], [""], ["String"], true);
	addKeywords(true, "SF_SelectCheckBoxInTableCellByQuery", "", "", "salesforce", ["Column Name", "Identifier1", "Value 1", "Identifier2", "Value 2", "Identifier3", "Value 3", "Identifier4", "Value 4", "Identifier5", "Value 5"], [""], ["String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(false, "SF_SelectMultipleDropDownByText", "", "", "salesforce", ["LabelName", "TextToSelect"], [""], ["String", "String"], true);
	addKeywords(false, "SF_VerifyWidgets", "", "", "salesforce", ["Widget Name", "Widget Index"], [""], ["String", "Integer"], true);

	addKeywords(false, "SF_SwitchToSalesforceLightning", "", "", "salesforce", [""], [""], [""], true);
	addKeywords(false, "SF_SwitchToSalesforceClassic", "", "", "salesforce", [""], [""], [""], true);
	addKeywords(false, "SF_Logout", "", "", "salesforce", [""], [""], [""], true);

	addKeywords(false, "SF_ClickButtonInRelatedList", "", "", "salesforce", ["RelatedListTitle", "ButtonText"], [""], ["String", "String"], true);


	addKeywords(false, "SF_VerifyTextFromTableCellByQuery", "TABLE", "", "salesforce", ["TableName", "ColumnName", "ObjectIndex", "ExpectedText", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "String", "INT", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);

	addKeywords(false, "SF_ClickArrowInTableCellByQuery", "TABLE", "", "salesforce", ["TableName", "ValueToSelect", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);

	addKeywords(true, "SF_GetTableCellText", "TABLE", "", "salesforce", ["Row Index", "Column Index", "Before", "After"], [""], ["INT", "INT", "String", "String"], true);

	addKeywords(true, "SF_GetTableRowCount", "", "", "salesforce", [""], [""], [""], true);

	addKeywords(false, "SF_ClickTextInTableCellUsingText", "TABLE", "", "salesforce", ["TableName", "ColumnName", "TextToClick", "TextIndex", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "String", "String", "INT", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);

	addKeywords(false, "SF_GetObjectTextByLabel", "", "", "salesforce", ["LabelName", "Index"], [""], ["String", "INT"], true);

	addKeywords(false, "SF_PerformActionInRelatedList", "", "", "salesforce", ["RecordId", "RelatedListTitle", "Action", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);

	// addKeywords(false, "SF_ClickOnQuickAction","","","salesforce",
	// ["ActionName","SectionName"],[""],
	// ["String","String"],true);

	addKeywords(false, "SF_DeselectDataFromPickList", "", "", "salesforce", ["LabelName", "Index", "ValueToDeselect"], [""], ["String", "INT", "String"], true);

	addKeywords(false, "SF_GetTextFromRelatedListTable", "", "", "salesforce", ["RelatedListTitle", "ColumnName", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);

	addKeywords(false, "SF_VerifyTextFromRelatedListTable ", "", "", "salesforce", ["RelatedListTitle", "ColumnName", "ExpectedText", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);

	addKeywords(false, "SF_ClickTextInRelatedListTable", "", "", "salesforce", ["RelatedListTitle", "ColumnName", "TextToClick", "TextIndex", "Identifier1", "Value1", "Identifier2", "Value2", "Identifier3", "Value3", "Identifier4", "Value4", "Identifier5", "Value5"], [""], ["String", "String", "String", "String", "INT", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	// Workday Kwywords add by Sachin
	addKeywords(true, "WD_TypeTextOnEditBox", "", "", "workday", ["Object", "Value"], [""], ["String", "String"], true);
	addKeywords(true, "WD_ClickButton", "", "", "workday", ["Object"], [""], ["String"], true);
	addKeywords(true, "WD_SelectWindow", "", "", "workday", ["Title", "TitleIndex"], [""], ["String", "Integer"], true);
	addKeywords(true, "WD_Click", "", "", "workday", ["Object"], [""], ["String"], true);
	addKeywords(true, "WD_SelectRadioButton", "", "", "workday", ["Object", "Index"], [""], ["String", "Integer"], true);
	addKeywords(true, "WD_TypeTextInTextArea", "", "", "workday", ["Object", "Value"], [""], ["String", "String"], true);
	addKeywords(true, "WD_SelectDropDownItem", "", "", "workday", ["Object", "Item"], [""], ["String", "String"], true);
	addKeywords(true, "WD_SelectCheckBox", "", "", "workday", ["Object", "Value"], [""], ["String", "String"], true);
	addKeywords(true, "WD_DeSelectCheckBox", "", "", "workday", ["Object"], [""], ["String"], true);
	addKeywords(true, "WD_ClickImage", "", "", "workday", ["Object"], [""], ["String"], true);
	addKeywords(true, "WD_ClickLink", "", "", "workday", ["Object"], [""], ["String"], true);
	addKeywords(true, "WD_SelectMultipleDropDownItem", "", "", "workday", ["Object", "ItemString"], [""], ["String", "String"], true);
	addKeywords(true, "WD_ClickByText", "", "", "workday", ["TextToSearch", "Index", "PartialText", "Object", "Before", "After"], [""], ["String", "Integer", "Boolean", "String", "String", "String"], true);
	addKeywords(true, "WD_TypeByText", "", "", "workday", ["TextToSearch", "Index", "PartialText", "TextToType", "Before", "Object"], [""], ["String", "Integer", "Boolean", "String", "Boolean", "String"], true);
	addKeywords(true, "WD_SelectRadioButtonByText", "", "", "workday", ["TextToSearch", "Index", "PartialText", "Before", "Object"], [""], ["String", "Integer", "Boolean", "Boolean", "String"], true);
	addKeywords(true, "WD_SelectCheckboxByText", "", "", "workday", ["TextToSearch", "Index", "PartialText", "Before", "Status", "Object"], [""], ["String", "Integer", "Boolean", "Boolean", "String", "String"], true);
	addKeywords(true, "WD_DeSelectCheckboxByText", "", "", "workday", ["TextToSearch", "Index", "PartialText", "Before", "Object"], [""], ["String", "Integer", "Boolean", "Boolean", "String"], true);
	addKeywords(true, "WD_MouseHoverOnText", "", "", "workday", ["TextToSearch", "Index", "PartialText", "Object"], [""], ["String", "Integer", "Boolean", "String"], true);
	addKeywords(true, "WD_SelectFrame", "", "", "workday", ["Frame"], [""], ["String"], true);
	addKeywords(true, "WD_GetObjectText", "", "", "workday", ["Object", "Before", "After"], [""], ["String", "String", "String"], true);
	addKeywords(true, "WD_GetChildObjectCount", "", "", "workday", ["Object", "Tag", "PropertyName", "PropertyValue"], [""], ["String", "String", "String", "String"], true);
	addKeywords(true, "WD_GetObjectCount", "", "", "workday", ["AttributeName1", "AttributeValue1", "AttributeName2", "AttributeValue2", "AttributeName3", "AttributeValue3", "AttributeName4", "AttributeValue4", "AttributeName5", "AttributeValue5"], [""], ["String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "WD_GetObjectExistence", "", "", "workday", ["Object"], [""], ["String"], true);
	addKeywords(true, "WD_GetObjectProperty", "", "", "workday", ["Object", "Property"], [""], ["String", "String"], true);
	addKeywords(true, "WD_MouseHover", "", "", "workday", ["Object"], [""], ["String"], true);
	addKeywords(true, "WD_VerifyObjectEnabled", "", "", "workday", ["Object"], [""], ["String"], true);
	addKeywords(true, "WD_VerifyObjectExists", "", "", "workday", ["Object"], [""], ["String"], true);
	addKeywords(true, "WD_VerifyObjectPropertyValue", "", "", "workday", ["Object", "PropertyName", "PropertyValue"], [""], ["String", "String", "String"], true);
	addKeywords(true, "WD_VerifyObjectText", "", "", "workday", ["Object", "Value", "Before", "After"], [""], ["String", "String", "String", "String"], true);
	addKeywords(true, "WD_VerifyRadioButtonSelected", "", "", "workday", ["Object", "Index"], [""], ["String", "Integer"], true);
	addKeywords(true, "WD_TypeTextAndEnterEditBox", "", "", "workday", ["Object", "Value"], [""], ["String", "String"], true);
	addKeywords(true, "WD_TypeTextAndEnterTextArea", "", "", "workday", ["Object", "Value"], [""], ["String", "String"], true);
	addKeywords(true, "WD_ClickLinkInTableCell", "", "", "workday", ["Object", "Row Index", "Column Index", "Object Index"], [""], ["String", "Integer", "Integer", "Integer"], true);
	addKeywords(true, "WD_ClickButtonInTableCell", "", "", "workday", ["Object", "Row Index", "Column Index", "Object Index"], [""], ["String", "Integer", "Integer", "Integer"], true);
	addKeywords(true, "WD_ClickTableCell", "", "", "workday", ["Object", "Row Index", "Column Index", "Tag", "Tag Index"], [""], ["String", "Integer", "Integer", "String", "Integer"], true);
	addKeywords(true, "WD_Wait", "", "", "workday", ["Timeout"], [""], ["Integer"], true);
	addKeywords(true, "WD_WaitForObject", "", "", "workday", ["Object", "Timeout"], [""], ["String", "Integer"], true);
	addKeywords(true, "WD_SwitchToDefaultContent", "", "", "workday", [""], [""], [""], false);



	addKeywords(true, "WD_AddRowToTable", "", "", "workday", ["Object", "TableName/Index"], [""], ["String", "String"], true);
	addKeywords(true, "WD_ClickInTableCell", "", "", "workday", ["Object", "TableName/Index", "RowIndex", "ColumnName/Index", "Data", "DataIndex"], [""], ["String", "String", "Integer", "String", "String", "Integer"], true);
	addKeywords(true, "WD_ClickInTableCellByQuery", "", "", "workday", ["TableName/Index", "ColumnName/Index", "TextToClick", "ObjectIndex", "Header1", "Value1", "Header2", "Value2", "Header3", "Value3", "Header4", "Value4", "Header5", "Value5"], [""], ["String", "String", "String", "Integer", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "WD_FindAndSelectLov", "", "", "workday", ["LovLabel", "SectionLabel", "ValueToSelect1", "ValueToSelect2", "ValueToSelect3", "ValueToSelect4", "ValueToSelect5", "Object"], [""], ["String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "WD_FindAndSelectLovInTableCell", "", "", "workday", ["Object", "TableName/Index", "RowIndex", "ColumnName/Index", "ObjectIndex", "ValueToSelect1", "ValueToSelect2", "ValueToSelect3", "ValueToSelect4", "ValueToSelect5"], [""], ["String", "String", "Integer", "String", "Integer", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "WD_GetObjectTextByLabel", "", "", "workday", ["Object", "ObjectLabel", "LabelIndex"], [""], ["String", "String", "Integer"], true);
	addKeywords(true, "WD_GetTextFromTableCellByQuery", "", "", "workday", ["TableName/Index", "ColumnName/Index", "Header1", "Value1", "Header2", "Value2", "Header3", "Value3", "Header4", "Value4", "Header5", "Value5"], [""], ["String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "WD_SearchAndSelectLov", "", "", "workday", ["LovLabel", "SectionLabel", "ValueToSelect", "Object"], [""], ["String", "String", "String", "String"], true);
	addKeywords(true, "WD_SearchAndSelectLovInTableCell", "", "", "workday", ["Object", "TableName/Index", "RowIndex", "ColumnName/Index", "ObjectIndex", "ValueToSelect"], [""], ["String", "String", "Integer", "String", "Integer", "String"], true);
	addKeywords(true, "WD_SelectCheckboxInTableCell", "", "", "workday", ["Object", "TableName/Index", "RowIndex", "ColumnName/Index", "Status"], [""], ["String", "String", "Integer", "String", "String"], true);
	addKeywords(true, "WD_SelectDateByText", "", "", "workday", ["Object", "DateLabel", "LabelIndex", "Date"], [""], ["String", "String", "Integer", "String"], true);
	addKeywords(true, "WD_SelectDateFromCalendarView", "", "", "workday", ["DateToSelect"], [""], ["Integer"], true);
	addKeywords(true, "WD_SelectDateInTableCell", "", "", "workday", ["Object", "TableName/Index", "RowIndex", "ColumnIndex", "Date"], [""], ["String", "String", "Integer", "Integer", "String"], true);
	addKeywords(true, "WD_SelectDropdownItemByText", "", "", "workday", ["Object", "DropdownLabel", "ValueToSelect", "ValueIndex"], [""], ["String", "String", "String", "Integer"], true);
	addKeywords(true, "WD_SelectDropdownItemInTableCell", "", "", "workday", ["Object", "TableName/Index", "RowIndex", "ColumnName/Index", "ValueToSelect"], [""], ["String", "String", "Integer", "String", "String"], true);
	addKeywords(true, "WD_SelectFromSuggestionList", "", "", "workday", ["Object", "ValueToSearch", "ValueToSelect", "ValueIndex"], [""], ["String", "String", "String", "Integer"], true);
	addKeywords(true, "WD_SelectRadioButtonInTableCell", "", "", "workday", ["Object", "TableName/Index", "RowIndex", "ColumnName/Index", "TextToSearch"], [""], ["String", "String", "Integer", "String", "String"], true);
	addKeywords(true, "WD_SelectRelatedActionInTableCell", "", "", "workday", ["Object", "TableName/Index", "ColumnName/Index", "Text", "TextIndex", "RowIndex"], [""], ["String", "String", "String", "String", "Integer", "Integer"], true);
	addKeywords(true, "WD_SelectRelatedActionInTableCellByQuery", "", "", "workday", ["TableName/Index", "ColumnName/Index", "Text", "TextIndex", "Header1", "Value1", "Header2", "Value2", "Header3", "Value3", "Header4", "Value4", "Header5", "Value5"], [""], ["String", "String", "String", "Integer", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "WD_TypeTextInTableCell", "", "", "workday", ["Object", "TableName/Index", "RowIndex", "ColumnName/Index", "TextToType"], [""], ["String", "String", "Integer", "String", "String"], true);
	addKeywords(true, "WD_TypeTextInTableCellByQuery", "", "", "workday", ["TableName/Index", "ColumnName/Index", "ObjectIndex", "TextToType", "Header1", "Value1", "Header2", "Value2", "Header3", "Value3", "Header4", "Value4", "Header5", "Value5"], [""], ["String", "String", "Integer", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);
	addKeywords(true, "WD_VerifyTextFromTableCellByQuery", "", "", "workday", ["TableName/Index", "ColumnName/Index", "Text", "Header1", "Value1", "Header2", "Value2", "Header3", "Value3", "Header4", "Value4", "Header5", "Value5"], [""], ["String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"], true);

}

InitializeKeyword();

_opkeyrecorder.displayContextMenu();
_opkeyrecorder.CreateDynamicOrKeyword("SF_SelectDataFromPickList", ["LabelName", "Index"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_LaunchAppAndSelectItem", ["Item", "Index"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_LaunchApp", ["AppName"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_SearchAndSelect", ["LabelName", "MenuItem", "Index"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_GlobalSearchAndSelect", ["ValueToSearch", "Index"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_GoToTab", ["TabName", "Index"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_SelectRecordType", ["RecordType"]);

// By Shikhar
_opkeyrecorder.CreateDynamicOrKeyword("SF_SelectListViewControl", ["List View Text"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_SelectDisplayAs", ["Display Text"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_SelectCalenderView", ["View"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_VerifyWidgets", ["Widget Name", "Widget Index"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_SelectEditView", ["Page View"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_SetDateTime", ["LabelName", "Index"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_SetTextAlignment", ["LabelName", "Alignment"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_TypeTextOnRichTextAreaByText", ["LabelName"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_SetGeoLocationValue", ["Label", "Index"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_SelectValueFromLookUp", ["LabelName"]);

// Additional
_opkeyrecorder.CreateDynamicOrKeyword("SF_SelectDropDownByText", ["DropdownLabel", "Index", "PartialText", "Before", "IsMultipleDropdown"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_SetDate", ["DateEvent", "Index"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_SetTime", ["TimeEvent", "Index"]);

// ByText
_opkeyrecorder.CreateDynamicOrKeyword("SF_ClickByText", ["TextToSearch", "Index", "PartialText", "Before", "After"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_ClickImageByTitle/Alt", ["PartialText", "Index", "Title/Alt"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_DeSelectCheckBoxByText", ["TextToSearch", "Index", "PartialText", "Before"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_MouseHoverOnText", ["TextToSearch", "Index", "PartialText", "Before", "After"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_SelectCheckBoxByText", ["TextToSearch", "Index", "PartialText", "Before"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_SelectMultipleDropDownByText", ["LabelName"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_SelectNew", ["LabelName", "TabName", "Index"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_SelectRadioButtonByText", ["TextToSearch", "Index", "PartialText", "Before"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_SelectRecord", ["RecordName", "Index"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_SelectTab", ["TabName", "Index"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_TypeByText", ["TextToSearch", "Index", "PartialText", "Before"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_ClickByTextInSequence", ["TextToSearch", "Index", "PartialText", "TextToSearch2", "Index2", "PartialText2", "TextToSearch3", "Index3", "PartialText3", "TextToSearch4", "Index4", "PartialText4", "TextToSearch5", "Index5", "PartialText5"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_ClickOnQuickAction", ["ActionName"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_PerformActionInRelatedList", ["RecordId"]);

_opkeyrecorder.CreateDynamicOrKeyword("SF_GetObjectTextByLabel", ["LabelName", "Index"]);
_opkeyrecorder.CreateDynamicOrKeyword("SF_DeselectDataFromPickList", ["LabelName", "Index"]);

var dockerIOnterval = -1;

function enableDockerInRecordingWindow(window_id) {
	if (true) {
		return;
	}
	if (dockerIOnterval != -1) {
		window.clearInterval(dockerIOnterval);
		dockerIOnterval = -1;
	}
	dockerIOnterval = window.setInterval(function () {
		chrome.tabs.query({
			windowId: window_id
		}, function (tabs) {
			for (var ti = 0; ti < tabs.length; ti++) {
				var _tab = tabs[ti];
				chrome.scripting.executeScript(
					{
						target: { tabId: _tab.id, allFrames: true },
						func: () => {
							sessionStorage.setItem('OPKEY_DOCKER_ENABLED', 'true');
						},
					},
					function (results) {
						if (chrome.runtime.lastError) {
							console.error(chrome.runtime.lastError.message);
						}
					}
				);

			}
		});
	}, 500);
}


function openNewChromeBrowserWindow() {
	_opkeyrecorder.CloseChromeWindow(_opkeyrecorder.opened_window_id);
	window.setTimeout(function () {
		var app_url = saas_object.GetGlobalSetting("APPLICATION_URL");
		if (app_url == null || app_url.trim() == "") {
			app_url = "http://sstsinc.com";
		}

		if (chrome.system == null) {
			var _bounds = screen;
			var _width = (_bounds.width / 100) * 70;
			var _height = _bounds.height;
			var _x = (_bounds.width / 100) * 30;
			_width = Math.trunc(_width);
			_height = Math.trunc(_height);
			_x = Math.trunc(_x);
			chrome.windows.create({
				url: app_url,
				type: 'normal',
				left: _x + 1,
				top: 0,
				width: _width,
				height: _height
			}, function (win) {
				_opkeyrecorder.opened_window_id = win.id;
				enableDockerInRecordingWindow(win.id);
				chrome.runtime.sendMessage({
					setCurrentWindowID: win.id
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});
			});
		}
		else {
			chrome.system.display.getInfo(function (displayInfo) {
				var _bounds = displayInfo[0].bounds;
				var _width = (_bounds.width / 100) * 70;
				var _height = _bounds.height;
				var _x = (_bounds.width / 100) * 30;
				_width = Math.trunc(_width);
				_height = Math.trunc(_height);
				_x = Math.trunc(_x);
				chrome.windows.create({
					url: app_url,
					type: 'normal',
					left: _x + 1,
					top: 0,
					width: _width,
					height: _height
				}, function (win) {
					_opkeyrecorder.opened_window_id = win.id;
					enableDockerInRecordingWindow(win.id);
					chrome.runtime.sendMessage({
						setCurrentWindowID: win.id
					}, function (response) {
						if (chrome.runtime.lastError) { }
					});
				});
			});
		}
	}, 500);
}

$(function () {
	initializeRecorderStepGrid();
	var recording_mode = saas_object.GetGlobalSetting("RECORDING_MODE");
	console.log("Recording Mode " + recording_mode);
	if (recording_mode != null) {
		if (recording_mode == "WebRecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "NORMAL");
			$("#recordingModeSelection").val("Normal Recording");
			$("#recordingModeSelection").change();

			_opkeyrecorder.AutoNavigate();

		} else if (recording_mode == "SalesforceRecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "Salesforce");
			$("#recordingModeSelection").val("Salesforce Recording");
			$("#recordingModeSelection").change();

			_opkeyrecorder.AutoNavigate();

		} else if (recording_mode == "WorkdayRecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "Workday");
			$("#recordingModeSelection").val("Workday Recording");
			$("#recordingModeSelection").change();

			_opkeyrecorder.AutoNavigate();

		} else if (recording_mode == "OracleFusionRecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "Oracle Fusion");
			$("#recordingModeSelection").val("Oracle Fusion Recording");
			$("#recordingModeSelection").change();

			_opkeyrecorder.AutoNavigate();

		}

		else if (recording_mode == "JDERecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "JDE");
			$("#recordingModeSelection").val("JDE Recording");
			$("#recordingModeSelection").change();

			_opkeyrecorder.AutoNavigate();

		}
		else if (recording_mode == "ServiceNowRecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "ServiceNow");
			$("#recordingModeSelection").val("ServiceNow Recording");
			$("#recordingModeSelection").change();

			_opkeyrecorder.AutoNavigate();

		}

		else if (recording_mode == "PeopleSoftRecorder" || recording_mode == "PropleSoftRecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "PeopleSoft");
			$("#recordingModeSelection").val("PeopleSoft Recording");
			$("#recordingModeSelection").change();

			_opkeyrecorder.AutoNavigate();

		} else if (recording_mode == "MicrosoftDynamicsRecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "MSDynamics");
			$("#recordingModeSelection").val("MSDynamics Recording");
			$("#recordingModeSelection").change();

			_opkeyrecorder.AutoNavigate();

		} else if (recording_mode == "KronosRecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "Kronos");
			$("#recordingModeSelection").val("Kronos Recording");
			$("#recordingModeSelection").change();


			_opkeyrecorder.AutoNavigate();

		} else if (recording_mode == "SAPSuccessFactorsRecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "SAP Fiori");
			$("#recordingModeSelection").val("SAP Fiori Recording");
			$("#recordingModeSelection").change();


			_opkeyrecorder.AutoNavigate();

		} else if (recording_mode == "MSDynamicsFSORecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "MSDynamics FSO");
			$("#recordingModeSelection").val("MSDynamics FSO Recording");
			$("#recordingModeSelection").change();


			_opkeyrecorder.AutoNavigate();

		}
		else if (recording_mode == "CoupaRecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "Coupa");
			$("#recordingModeSelection").val("Coupa Recording");
			$("#recordingModeSelection").change();


			_opkeyrecorder.AutoNavigate();

		}
		else if (recording_mode == "VeevaVaultRecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "Veeva Vault");
			$("#recordingModeSelection").val("Veeva Vault Recording");
			$("#recordingModeSelection").change();

			_opkeyrecorder.AutoNavigate();

		} else if (recording_mode == "OracleRecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "Oracle EBS");
			$("#recordingModeSelection").val("Oracle EBS Recording");
			$("#recordingModeSelection").change();

			_opkeyrecorder.AutoNavigate();

		}
		else if (recording_mode == "OracleRecorderLT") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "Oracle EBS LT");
			$("#recordingModeSelection").val("Oracle EBS Load Test Recording");
			$("#recordingModeSelection").change();

			_opkeyrecorder.AutoNavigate();

		}
		else if (recording_mode == "Microsoft WPF Recorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "Microsoft WPF");
			$("#recordingModeSelection").val("Microsoft WPF Recording");
			$("#recordingModeSelection").change();


			_opkeyrecorder.AutoNavigate();

		}
		else if (recording_mode == "OpkeyDesktopRecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "Desktop");
			$("#recordingModeSelection").val("Desktop Recording");
			$("#recordingModeSelection").change();
		}
		else if (recording_mode == "MainframeRecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "MainFrame");
			$("#recordingModeSelection").val("MainFrame Recording");
			$("#recordingModeSelection").change();
		}
		else if (recording_mode == "SAPNetweaverRecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "SAP Netweaver");
			$("#recordingModeSelection").val("SAP Netweaver Recording");
			$("#recordingModeSelection").change();
		}
		else if (recording_mode == "SAPFioriRecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "SAP Fiori");
			$("#recordingModeSelection").val("SAP Fiori Recording");
			$("#recordingModeSelection").change();
			_opkeyrecorder.AutoNavigate();
		}
		else if (recording_mode == "MobileRecorder") {
			saas_object.SetGlobalSetting("RECORDING_MODE", "Mobile");
			$("#recordingModeSelection").val("Mobile Recording");
			$("#recordingModeSelection").change();
			_opkeyrecorder.NavigatePcloudyUrl();
		}
		else {
			saas_object.SetGlobalSetting("RECORDING_MODE", "NORMAL");
			_opkeyrecorder.AutoNavigate();
		}
	} else {
		saas_object.SetGlobalSetting("RECORDING_MODE", "NORMAL");
	}
});

var mapGenKeywords = [
	{
		"KeyowrdName": "AcceptPopup",
		"MappedName": "Accept browser alert"
	},
	{
		"KeyowrdName": "Image_Click",
		"MappedName": "Click on '$obj'"
	},
	{
		"KeyowrdName": "Image_DoubleClick",
		"MappedName": "Double Click on '$obj'"
	},
	{
		"KeyowrdName": "Image_RightClick",
		"MappedName": "Right Click on '$obj'"
	},
	{
		"KeyowrdName": "Image_TypeTextOnEditBox",
		"MappedName": "Type Text on '$obj'"
	},
	{
		"KeyowrdName": "Image_VerifyObjectExists",
		"MappedName": "Verify Object on '$obj'"
	},
	{
		"KeyowrdName": "AssertTextPresent",
		"MappedName": "Validate whether the text <$ExpectedText> is present"
	},
	{
		"KeyowrdName": "AuthenticatePopup",
		"MappedName": "Authenticate browser alert with username <$UserName> and password <$Password>"
	},
	{
		"KeyowrdName": "CaptureObjectSnapshot",
		"MappedName": "Capture snapshot of '$obj'"
	},
	{
		"KeyowrdName": "CapturePageSnapshot",
		"MappedName": "Capture snapshot of web page"
	},
	{
		"KeyowrdName": "CaptureSnapshot",
		"MappedName": "Capture snapshot and save it to path <$ImagePath>"
	},
	{
		"KeyowrdName": "ClearEditField",
		"MappedName": "Clear value in edit field '$obj'"
	},
	{
		"KeyowrdName": "ClearTextArea",
		"MappedName": "Clear value in text area '$obj'"
	},
	{
		"KeyowrdName": "Click",
		"MappedName": "Click on '$obj'"
	},
	{
		"KeyowrdName": "ClickAt",
		"MappedName": "Click on '$obj' with co-ordinates <$Co-Ordinate>"
	},
	{
		"KeyowrdName": "ClickButton",
		"MappedName": "Click on button '$obj'"
	},
	{
		"KeyowrdName": "ClickButtonAndWait",
		"MappedName": "Click on button '$obj' and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "ClickImage",
		"MappedName": "Click on image '$obj'"
	},
	{
		"KeyowrdName": "ClickImageByTitle/Alt",
		"MappedName": "Click on image having Title/Alt <$Title/Alt>"
	},
	{
		"KeyowrdName": "ClickLink",
		"MappedName": "Click on link '$obj'"
	},
	{
		"KeyowrdName": "CloseAllBrowsers",
		"MappedName": "Close all browser(s)"
	},
	{
		"KeyowrdName": "CloseBrowser",
		"MappedName": "Close browser with title <$Title>"
	},
	{
		"KeyowrdName": "CloseSelectedWindow",
		"MappedName": "Close selected window with title <$Title> and index <$Index>"
	},
	{
		"KeyowrdName": "CopyFromClipBoard",
		"MappedName": "Copy value from clipboard"
	},
	{
		"KeyowrdName": "DeFocusObject",
		"MappedName": "Remove focus from the object"
	},
	{
		"KeyowrdName": "DeSelectAllDropDownItemsAndWait",
		"MappedName": "Deselect all items in dropdown '$obj' and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "DeSelectCheckBox",
		"MappedName": "Deselect checkbox '$obj'"
	},
	{
		"KeyowrdName": "DeSelectCheckBoxAndWait",
		"MappedName": "Deselect checkbox '$obj' and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "DeSelectDropDownItem",
		"MappedName": "Deselect value <$ItemString> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "DeSelectDropDownItemAndWait",
		"MappedName": "Deselect value <$ItemString> in dropdown '$obj' and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "DeSelectMultipleDropDownItem",
		"MappedName": "Deselect mutiple value(s) <$ItemString> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "DismissPopup",
		"MappedName": "Dismiss browser alert"
	},
	{
		"KeyowrdName": "DoubleClick",
		"MappedName": "Double click on '$obj'"
	},
	{
		"KeyowrdName": "DoubleClickAndWait",
		"MappedName": "Double click on '$obj' and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "DoubleClickAt",
		"MappedName": "Double click on '$obj' with co-ordinates <$Co-ordinates>"
	},
	{
		"KeyowrdName": "DoubleClickButton",
		"MappedName": "Double click on button '$obj'"
	},
	{
		"KeyowrdName": "DoubleClickImage",
		"MappedName": "Double click on image '$obj'"
	},
	{
		"KeyowrdName": "DragAndDrop",
		"MappedName": "Drag and Drop '$obj' to co-ordinates <$Co-ordinates>"
	},
	{
		"KeyowrdName": "DragAndDropAndWait",
		"MappedName": "Drag and Drop '$obj' to co-ordinates <$Co-ordinates> wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "DragAndDropOnObject",
		"MappedName": "Drag '$obj1' and drop on '$obj2'"
	},
	{
		"KeyowrdName": "Enter",
		"MappedName": "Press Enter key"
	},
	{
		"KeyowrdName": "FetchBrowserTitle",
		"MappedName": "Fetch title of <$BrowserName> browser"
	},
	{
		"KeyowrdName": "FetchBrowserURL",
		"MappedName": "Fetch browser URL"
	},
	{
		"KeyowrdName": "FocusButton",
		"MappedName": "Set focus on button '$obj'"
	},
	{
		"KeyowrdName": "FocusCheckBox",
		"MappedName": "Set focus on checkbox '$obj'"
	},
	{
		"KeyowrdName": "FocusRadioButton",
		"MappedName": "Set focus on radio button '$obj'"
	},
	{
		"KeyowrdName": "GetAlertText",
		"MappedName": "Get value of browser alert"
	},
	{
		"KeyowrdName": "GetAllButtons",
		"MappedName": "Get all button(s)"
	},
	{
		"KeyowrdName": "GetAllFields",
		"MappedName": "Get all edit field(s)"
	},
	{
		"KeyowrdName": "GetAllLinks",
		"MappedName": "Get all link(s)"
	},
	{
		"KeyowrdName": "GetAllTitles",
		"MappedName": "Get all title(s) of <$BrowserName> browser"
	},
	{
		"KeyowrdName": "GetButtonToolTip",
		"MappedName": "Get tooltip of button '$obj'"
	},
	{
		"KeyowrdName": "GetCheckboxStatus",
		"MappedName": "Get status of checkbox '$obj'"
	},
	{
		"KeyowrdName": "GetCheckBoxToolTip",
		"MappedName": "Get tooltip of checkbox '$obj'"
	},
	{
		"KeyowrdName": "GetChildObjectCount",
		"MappedName": "Get child count with attribute(s) tag <$Tag> , property name <$PropertyName> of '$obj'"
	},
	{
		"KeyowrdName": "GetDropdownDefaultItem",
		"MappedName": "Get default item of dropdown '$obj'"
	},
	{
		"KeyowrdName": "GetDropDownItemCount",
		"MappedName": "Get item count from dropdown '$obj'"
	},
	{
		"KeyowrdName": "GetDropDownToolTip",
		"MappedName": "Get tooltip of dropdown '$obj'"
	},
	{
		"KeyowrdName": "GetEditboxDefaultvalue",
		"MappedName": "Get default value of edit box '$obj'"
	},
	{
		"KeyowrdName": "GetEditBoxLength",
		"MappedName": "Get length of editbox '$obj'"
	},
	{
		"KeyowrdName": "GetEditBoxName",
		"MappedName": "Get name of edit box '$obj'"
	},
	{
		"KeyowrdName": "GetEditBoxToolTip",
		"MappedName": "Get tooltip of edit box '$obj'"
	},
	{
		"KeyowrdName": "GetEditboxValue",
		"MappedName": "Get value from edit box '$obj'"
	},
	{
		"KeyowrdName": "GetElementIndex",
		"MappedName": "Get index of '$obj'"
	},
	{
		"KeyowrdName": "GetImageCount",
		"MappedName": "Get image(s) count"
	},
	{
		"KeyowrdName": "GetImageToolTip",
		"MappedName": "Get tooltip of image '$obj'"
	},
	{
		"KeyowrdName": "GetLinkCount",
		"MappedName": "Get link(s) count"
	},
	{
		"KeyowrdName": "GetLinkToolTip",
		"MappedName": "Get tooltip of link '$obj'"
	},
	{
		"KeyowrdName": "GetLoadTime",
		"MappedName": "Get page load time"
	},
	{
		"KeyowrdName": "GetObjectCount",
		"MappedName": "Get count of object with attribute(s) Attribute1 <$AttributeName1> , Attribute2 <$AttributeValue1>"
	},
	{
		"KeyowrdName": "GetObjectCSSProperty",
		"MappedName": "Get CSS property <$Property> of '$obj'"
	},
	{
		"KeyowrdName": "GetObjectEnabled",
		"MappedName": "Validate whether '$obj' is enabled or not"
	},
	{
		"KeyowrdName": "GetObjectExistence",
		"MappedName": "Validate whether '$obj' exists or not"
	},
	{
		"KeyowrdName": "GetObjectProperty",
		"MappedName": "Get property <$Property> of '$obj'"
	},
	{
		"KeyowrdName": "GetObjectText",
		"MappedName": "Get text of '$obj'"
	},
	{
		"KeyowrdName": "GetObjectToolTip",
		"MappedName": "Get tooltip of '$obj'"
	},
	{
		"KeyowrdName": "GetObjectValue",
		"MappedName": "Get value of '$obj'"
	},
	{
		"KeyowrdName": "GetObjectVisibility",
		"MappedName": "Validate whether '$obj' is visible or not"
	},
	{
		"KeyowrdName": "GetPopupText",
		"MappedName": "Get text of browser alert"
	},
	{
		"KeyowrdName": "GetPropertyValue",
		"MappedName": "Get <$PropertyName> value of '$obj'"
	},
	{
		"KeyowrdName": "GetRadioButtonCount",
		"MappedName": "Get count of radio button '$obj'"
	},
	{
		"KeyowrdName": "GetSelectedDropDownItem",
		"MappedName": "Get selected value from dropdown '$obj'"
	},
	{
		"KeyowrdName": "GetSelectedRadioButtonFromGroup",
		"MappedName": "Get selected radio button from a group '$obj'"
	},
	{
		"KeyowrdName": "GetTextAreaColumnRowLength",
		"MappedName": "Get column and row length of text area '$obj'"
	},
	{
		"KeyowrdName": "GetTextAreaDefaultvalue",
		"MappedName": "Get default value of text area '$obj'"
	},
	{
		"KeyowrdName": "GetTextAreaLength",
		"MappedName": "Get length of text area '$obj'"
	},
	{
		"KeyowrdName": "GetTextAreaName",
		"MappedName": "Get name of text area '$obj'"
	},
	{
		"KeyowrdName": "GetTextAreaToolTip",
		"MappedName": "Get tooltip of text area '$obj'"
	},
	{
		"KeyowrdName": "GetTextAreavalue",
		"MappedName": "Get value from text area '$obj'"
	},
	{
		"KeyowrdName": "GetTextFromEditBox",
		"MappedName": "Get value from edit box '$obj'"
	},
	{
		"KeyowrdName": "GetTextfromTextArea",
		"MappedName": "Get value from text area '$obj'"
	},
	{
		"KeyowrdName": "GoBackAndWait",
		"MappedName": "Go back to previous web page and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "GoForward",
		"MappedName": "Go forward to next web page"
	},
	{
		"KeyowrdName": "GoForwardAndWait",
		"MappedName": "Go forward to next web page and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "HighlightObject",
		"MappedName": "Highlight '$obj'"
	},
	{
		"KeyowrdName": "IgnoreXMLHttpRequest",
		"MappedName": "Ignore XMLHttpRequest for URL <$URL>"
	},
	{
		"KeyowrdName": "IsTextPresentOnScreen",
		"MappedName": "Validate whether text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&} exists"
	},
	{
		"KeyowrdName": "KeyLeft",
		"MappedName": "Press Left Arrow key"
	},
	{
		"KeyowrdName": "KeyPressNative",
		"MappedName": "Press <$KeyName> key"
	},
	{
		"KeyowrdName": "KeyRight",
		"MappedName": "Press Right Arrow key"
	},
	{
		"KeyowrdName": "MaximizeBrowser",
		"MappedName": "Maximize browser"
	},
	{
		"KeyowrdName": "MinimizeBrowser",
		"MappedName": "Minimze browser"
	},
	{
		"KeyowrdName": "MouseHover",
		"MappedName": "Hover mouse on '$obj'"
	},
	{
		"KeyowrdName": "MouseHoverOnText",
		"MappedName": "Hover mouse on text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "NavigateTo",
		"MappedName": "Navigate to URL <$URL>"
	},
	{
		"KeyowrdName": "NextPageObject",
		"MappedName": "Validate whether '$obj' is on next web page or not and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "OpenBrowser",
		"MappedName": "Launch URL <$URL> in <$Browser> browser"
	},
	{
		"KeyowrdName": "PressTAB",
		"MappedName": "Press TAB key"
	},
	{
		"KeyowrdName": "RefreshAndWait",
		"MappedName": "Refresh browser and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "RefreshBrowser",
		"MappedName": "Refresh browser"
	},
	{
		"KeyowrdName": "ReportMessage",
		"MappedName": "Report message <$Message> and set status as <$Status>"
	},
	{
		"KeyowrdName": "ReturnConcatenated",
		"MappedName": "Concatenate First String <$First String> , Second String <$Second String> and Third String <$Third String>"
	},
	{
		"KeyowrdName": "RightClickAndSelectByText",
		"MappedName": "Right click on '$obj' and select text <$TextToSelect>"
	},
	{
		"KeyowrdName": "RightClickOnObject",
		"MappedName": "Right click on '$obj'"
	},
	{
		"KeyowrdName": "RunScriptAndWait",
		"MappedName": "Run script <$Script> for '$obj' and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "SelectCheckBox",
		"MappedName": "Select checkbox '$obj'"
	},
	{
		"KeyowrdName": "SelectCheckBoxAndWait",
		"MappedName": "Select checkbox '$obj' and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "SelectDropdownItem",
		"MappedName": "Select <$Item> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "SelectDropDownItemAndWait",
		"MappedName": "Select value <$Item> in dropdown '$obj' and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "SelectFrame",
		"MappedName": "Select iframe '$obj'"
	},
	{
		"KeyowrdName": "SelectGroupRadioButton",
		"MappedName": "Select radio button in a group '$obj'"
	},
	{
		"KeyowrdName": "SelectMultipleDropDownItem",
		"MappedName": "Select multiple value(s) <$ItemString> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "SelectMultipleDropDownItemAndWait",
		"MappedName": "Select multiple value(s) <$Item String> in dropdown '$obj' and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "SelectRadioButton",
		"MappedName": "Select radio button '$obj'"
	},
	{
		"KeyowrdName": "SelectRadioButtonAndWait",
		"MappedName": "Select radio button '$obj' and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "SelectRadioButtonOnIndexBasis",
		"MappedName": "Select radio button '$obj' and index <$Index>"
	},
	{
		"KeyowrdName": "SelectWindow",
		"MappedName": "Select browser window with title <$Title> and title index <$TitleIndex>"
	},
	{
		"KeyowrdName": "SetBrowserCapability",
		"MappedName": "Set the browser capability with Key <$Key> , Value <$Value> , Value Type <$Value Type> and Browser Name <$Browser Name>"
	},
	{
		"KeyowrdName": "SetFocus",
		"MappedName": "Set focus on '$obj'"
	},
	{
		"KeyowrdName": "SetfocusEditField",
		"MappedName": "Set focus on edit field '$obj'"
	},
	{
		"KeyowrdName": "SetFocusonDropDown",
		"MappedName": "Set focus on dropdown '$obj'"
	},
	{
		"KeyowrdName": "SetFocusOnWindow",
		"MappedName": "Set focus on browser tab with index <$Index>"
	},
	{
		"KeyowrdName": "SetfocusTextArea",
		"MappedName": "Set focus on text area '$obj'"
	},
	{
		"KeyowrdName": "SetPage",
		"MappedName": "Set page with '$obj'"
	},
	{
		"KeyowrdName": "SwitchToDefaultContent",
		"MappedName": "Switch to default content"
	},
	{
		"KeyowrdName": "SyncBrowser",
		"MappedName": "Sync browser"
	},
	{
		"KeyowrdName": "SynchronizeBrowser",
		"MappedName": "Synchronize browser "
	},
	{
		"KeyowrdName": "TypeKeysAndWait",
		"MappedName": "Enter key(s) <$Value> in edit box '$obj' and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "TypeKeysInTextArea",
		"MappedName": "Enter key(s) <$Value> in text area '$obj'"
	},
	{
		"KeyowrdName": "TypeKeysOnEditBox",
		"MappedName": "Enter key(s) <$Value> in edit box '$obj'"
	},
	{
		"KeyowrdName": "TypeSecureText",
		"MappedName": "Enter secure value <$Value> in edit box '$obj'"
	},
	{
		"KeyowrdName": "TypeTextAndEnterEditBox",
		"MappedName": "Enter <$Value> in edit box '$obj' and press Enter"
	},
	{
		"KeyowrdName": "TypeTextAndEnterTextArea",
		"MappedName": "Enter <$Value> in text area '$obj' and press Enter"
	},
	{
		"KeyowrdName": "TypeTextAndWait",
		"MappedName": "Enter <$Value> in edit box '$obj' and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "TypeTextInPTag",
		"MappedName": "Enter <$TextToType> in ptag '$obj'"
	},
	{
		"KeyowrdName": "TypeTextInTextArea",
		"MappedName": "Enter <$Value> in text area '$obj'"
	},
	{
		"KeyowrdName": "TypeTextOnEditBox",
		"MappedName": "Enter <$Value> in edit box '$obj'"
	},
	{
		"KeyowrdName": "VerifyAllButtons",
		"MappedName": "Validate whether button(s) <$AllButtons> exists or not"
	},
	{
		"KeyowrdName": "VerifyAllDropDownItemExist",
		"MappedName": "Validate whether value(s) <$Item String> exists in dropdown '$obj' or not"
	},
	{
		"KeyowrdName": "VerifyAllDropDownItems",
		"MappedName": "Validate whether value(s) <$ValueString> exists in dropdown '$obj' or not"
	},
	{
		"KeyowrdName": "VerifyAllLink",
		"MappedName": "Validate whether link <$Expected Link> exists or not"
	},
	{
		"KeyowrdName": "VerifyAllLinkExist",
		"MappedName": "Validate whether link <$Expected Link> exists or not"
	},
	{
		"KeyowrdName": "VerifyBrowserExist",
		"MappedName": "Validate whether browser with title <$Title> exists or not"
	},
	{
		"KeyowrdName": "VerifyBrowserTitle",
		"MappedName": "Validate whether <$Expected Title> is title of <$Browser Name> browser"
	},
	{
		"KeyowrdName": "VerifyButtonDisabled",
		"MappedName": "Validate whether button '$obj' is disabled"
	},
	{
		"KeyowrdName": "VerifyButtonEnabled",
		"MappedName": "Validate whether the button with name '$obj' is enabled"
	},
	{
		"KeyowrdName": "VerifyButtonExist",
		"MappedName": "Validate whether button '$obj' exists or not"
	},
	{
		"KeyowrdName": "VerifyButtonToolTip",
		"MappedName": "Validate whether <$ToolTip> is tooltip of button '$obj'"
	},
	{
		"KeyowrdName": "VerifyCheckBoxDisabled",
		"MappedName": "Validate whether checkbox '$obj' is disabled"
	},
	{
		"KeyowrdName": "VerifyCheckBoxEnabled",
		"MappedName": "Validate whether checkbox '$obj' is enabled"
	},
	{
		"KeyowrdName": "VerifyCheckBoxExist",
		"MappedName": "Validate whether checkbox '$obj' exists or not"
	},
	{
		"KeyowrdName": "VerifyCheckBoxStatus",
		"MappedName": "Validate whether status is <$Value> of checkbox '$obj'"
	},
	{
		"KeyowrdName": "VerifyCheckBoxToolTip",
		"MappedName": "Validate whether <$Tooltip> is tooltip of checkbox '$obj'"
	},
	{
		"KeyowrdName": "VerifyChildObjectCount",
		"MappedName": "Validate whether child object '$obj' and attribute value tag <$Tag> , property name <$Property Name> , property value <$Property Value> and count <$Count>  exists or not"
	},
	{
		"KeyowrdName": "VerifyDropDownDefaultItem",
		"MappedName": "Validate whether <$Item> is default item of dropdown '$obj'"
	},
	{
		"KeyowrdName": "VerifyDropDownDisabled",
		"MappedName": "Validate whether dropdown '$obj' is disabled"
	},
	{
		"KeyowrdName": "VerifyDropDownEnabled",
		"MappedName": "Validate whether dropdown '$obj' is enabled"
	},
	{
		"KeyowrdName": "VerifyDropDownExist",
		"MappedName": "Validate whether dropdown '$obj' exists or not"
	},
	{
		"KeyowrdName": "VerifyDropDownItemCount",
		"MappedName": "Validate whether <$Value> is count of item(s) in dropdown '$obj'"
	},
	{
		"KeyowrdName": "VerifyDropDownItemExists",
		"MappedName": "Validate whether value <$Item> exists in dropdown '$obj' or not"
	},
	{
		"KeyowrdName": "VerifyDropDownSelection",
		"MappedName": "Validate whether value <$Item> is selected in dropdown '$obj'"
	},
	{
		"KeyowrdName": "VerifyDropDownToolTip",
		"MappedName": "Validate whether <$ToolTip> is tooltip of dropdown '$obj'"
	},
	{
		"KeyowrdName": "VerifyEditable",
		"MappedName": "Validate whether edit box '$obj' is editable"
	},
	{
		"KeyowrdName": "VerifyEditBoxDefaultValue",
		"MappedName": "Validate whether <$Value> is default value in edit box '$obj'"
	},
	{
		"KeyowrdName": "VerifyEditBoxDisabled",
		"MappedName": "Validate whether edit box '$obj' is disabled"
	},
	{
		"KeyowrdName": "VerifyEditBoxEditable",
		"MappedName": "Validate whether edit box '$obj' is editable"
	},
	{
		"KeyowrdName": "VerifyEditBoxEnabled",
		"MappedName": "Validate whether edit box '$obj' is enabled"
	},
	{
		"KeyowrdName": "VerifyEditBoxExistAndWait",
		"MappedName": "Validate whether edit box '$obj' exists or not and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "VerifyEditBoxLength",
		"MappedName": "Validate whether <$Length> is length of edit box '$obj'"
	},
	{
		"KeyowrdName": "VerifyEditBoxName",
		"MappedName": "Validate whether <$Expected Name> is name of edit box '$obj'"
	},
	{
		"KeyowrdName": "VerifyEditBoxNonEditable",
		"MappedName": "Validate whether edit box '$obj' is non-editable"
	},
	{
		"KeyowrdName": "VerifyEditBoxNotExist",
		"MappedName": "Validate whether edit box '$obj' exists for <$Timeout> second(s) or not"
	},
	{
		"KeyowrdName": "VerifyEditBoxText",
		"MappedName": "Validate whether text <$Value> is available in edit box '$obj'"
	},
	{
		"KeyowrdName": "VerifyEditBoxToolTip",
		"MappedName": "Validate whether <$Tooltip> is tooltip of editbox '$obj'"
	},
	{
		"KeyowrdName": "VerifyEditBoxValue",
		"MappedName": "Validate whether value <$Expected Value> is available in edit box '$obj'"
	},
	{
		"KeyowrdName": "VerifyImageCount",
		"MappedName": "Validate whether <$Expected Value> is count of image(s) "
	},
	{
		"KeyowrdName": "VerifyImageDisabled",
		"MappedName": "Validate whether image '$obj' is disabled"
	},
	{
		"KeyowrdName": "VerifyImageEnabled",
		"MappedName": "Validate whether image '$obj' is enabled"
	},
	{
		"KeyowrdName": "VerifyImageExist",
		"MappedName": "Validate whether image '$obj' exists or not"
	},
	{
		"KeyowrdName": "VerifyImageNotVisible",
		"MappedName": "Validate whether image '$obj' is not visible"
	},
	{
		"KeyowrdName": "VerifyImageToolTip",
		"MappedName": "Validate whether <$ToolTip> is tooltip of image '$obj'"
	},
	{
		"KeyowrdName": "VerifyImageVisible",
		"MappedName": "Validate whether image '$obj' is visible"
	},
	{
		"KeyowrdName": "VerifyLinkCount",
		"MappedName": "Validate whether <$Expected Link Count> is count of link(s)"
	},
	{
		"KeyowrdName": "VerifyLinkDisabled",
		"MappedName": "Validate whether link '$obj' is disabled"
	},
	{
		"KeyowrdName": "VerifyLinkEnabled",
		"MappedName": "Validate whether link '$obj' is enabled"
	},
	{
		"KeyowrdName": "VerifyLinkExist",
		"MappedName": "Validate whether link '$obj' exists or not"
	},
	{
		"KeyowrdName": "VerifyLinkToolTip",
		"MappedName": "Validate whether <$ToolTip> is tooltip of link '$obj'"
	},
	{
		"KeyowrdName": "VerifyLinkVisible",
		"MappedName": "Validate whether link '$obj' is visible"
	},
	{
		"KeyowrdName": "VerifyMultipleDropDownItemExist",
		"MappedName": "Validate whether multiple value(s) <$Item String> exists in dropdown '$obj'"
	},
	{
		"KeyowrdName": "VerifyMultipleObjectProperty",
		"MappedName": "Validate whether property name <$Property Name 1> , property value <$Property Value 1> is available in '$obj'"
	},
	{
		"KeyowrdName": "VerifyObjectDisabled",
		"MappedName": "Validate whether '$obj' is disabled"
	},
	{
		"KeyowrdName": "VerifyObjectDoesNotExists",
		"MappedName": "Validate whether '$obj' exists or not"
	},
	{
		"KeyowrdName": "VerifyObjectEnabled",
		"MappedName": "Validate whether '$obj' is enabled"
	},
	{
		"KeyowrdName": "VerifyObjectExists",
		"MappedName": "Validate whether '$obj' exists"
	},
	{
		"KeyowrdName": "VerifyObjectPropertyValue",
		"MappedName": "Validate whether property <$PropertyName> is available in '$obj'"
	},
	{
		"KeyowrdName": "VerifyObjectText",
		"MappedName": "Validate whether text <$Value> is available in '$obj'"
	},
	{
		"KeyowrdName": "VerifyObjectToolTip",
		"MappedName": "Validate whether <$Tooltip> is tooltip of '$obj'"
	},
	{
		"KeyowrdName": "VerifyObjectValue",
		"MappedName": "Validate whether value <$ExpectedValue> is available in '$obj'"
	},
	{
		"KeyowrdName": "VerifyObjectVisible",
		"MappedName": "Validate whether '$obj' is visible"
	},
	{
		"KeyowrdName": "VerifyPopupPresent",
		"MappedName": "Validate whether browser alert is present"
	},
	{
		"KeyowrdName": "VerifyPopUpText",
		"MappedName": "Validate whether <$Expected Text> is text of browser alert"
	},
	{
		"KeyowrdName": "VerifyRadioButtonDisabled",
		"MappedName": "Validate whether radio button '$obj' is disabled"
	},
	{
		"KeyowrdName": "VerifyRadioButtonEnabled",
		"MappedName": "Validate whether radio button '$obj' is enabled"
	},
	{
		"KeyowrdName": "VerifyRadioButtonExist",
		"MappedName": "Validate whether radio button '$obj' exists or not"
	},
	{
		"KeyowrdName": "VerifyRadioButtonNotSelected",
		"MappedName": "Validate whether radio button '$obj' is not selected"
	},
	{
		"KeyowrdName": "VerifyRadioButtonSelected",
		"MappedName": "Validate whether radio button '$obj' is selected"
	},
	{
		"KeyowrdName": "VerifyTextareaColsRowLength",
		"MappedName": "Validate whether <$RowIndex> and <$Column Index> is row and column length of text area '$obj'"
	},
	{
		"KeyowrdName": "VerifyTextAreaDefaultValue",
		"MappedName": "Validate whether <$Value> is default value of text area '$obj'"
	},
	{
		"KeyowrdName": "VerifyTextAreaDisabled",
		"MappedName": "Validate whether text area '$obj' is disabled"
	},
	{
		"KeyowrdName": "VerifyTextAreaEditable",
		"MappedName": "Validate whether text area '$obj' is editable"
	},
	{
		"KeyowrdName": "VerifyTextAreaEnabled",
		"MappedName": "Validate whether text area '$obj' is enabled"
	},
	{
		"KeyowrdName": "VerifyTextAreaExist",
		"MappedName": "Validate whether text area '$obj' exists or not"
	},
	{
		"KeyowrdName": "VerifyTextAreaLength",
		"MappedName": "Validate whether <$Length> is length of text area '$obj'"
	},
	{
		"KeyowrdName": "VerifyTextAreaName",
		"MappedName": "Validate whether <$ExpectedValue> is name of text area '$obj'"
	},
	{
		"KeyowrdName": "VerifyTextAreaNotEditable",
		"MappedName": "Validate whether text area '$obj' is not editable"
	},
	{
		"KeyowrdName": "VerifyTextAreaNotExist",
		"MappedName": "Validate whether text area '$obj' exists or not"
	},
	{
		"KeyowrdName": "VerifyTextAreaText",
		"MappedName": "Validate whether text <$Value> is available in the text area with name '$obj' or not"
	},
	{
		"KeyowrdName": "VerifyTextAreaToolTip",
		"MappedName": "Validate whether <$Tooltip> is tooltip of text area '$obj'"
	},
	{
		"KeyowrdName": "VerifyTextAreaValue",
		"MappedName": "Validate whether value <$Value> is available in text area '$obj'"
	},
	{
		"KeyowrdName": "VisualComparisonForPage",
		"MappedName": ""
	},
	{
		"KeyowrdName": "VisualValidation_CheckPoint",
		"MappedName": ""
	},
	{
		"KeyowrdName": "VisualValidation_CheckPointObject",
		"MappedName": ""
	},
	{
		"KeyowrdName": "VisualValidation_SetConfiguration",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Wait",
		"MappedName": "Wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "WaitAndClick",
		"MappedName": "Wait for <$WaitTime> second(s) and click on '$obj'"
	},
	{
		"KeyowrdName": "WaitForEditBoxDisabled",
		"MappedName": "Wait <$Timeout> second(s) for edit box '$obj' to get disabled"
	},
	{
		"KeyowrdName": "WaitForEditBoxEnabled",
		"MappedName": "Wait <$Timeout> second(s) for edit box '$obj' to get enabled"
	},
	{
		"KeyowrdName": "WaitforImageLoad",
		"MappedName": "Wait <$Timeout> second(s) for image '$obj' to load"
	},
	{
		"KeyowrdName": "WaitforLink",
		"MappedName": "Wait <$Timeout> second(s) for link '$obj'"
	},
	{
		"KeyowrdName": "WaitForObject",
		"MappedName": "Wait <$Timeout> second(s) for '$obj'"
	},
	{
		"KeyowrdName": "WaitForObjectDisable",
		"MappedName": "Wait <$WaitTime> second(s) for '$obj' to get disabled"
	},
	{
		"KeyowrdName": "WaitForObjectEditable",
		"MappedName": "Wait <$Timeout> second(s) for '$obj' to get editable"
	},
	{
		"KeyowrdName": "WaitForObjectEnable",
		"MappedName": "Wait <$Timeout> second(s) for '$obj' to get enable"
	},
	{
		"KeyowrdName": "WaitForObjectProperty",
		"MappedName": "Wait <$Timeout> second(s) for property name <$PropertyName> of '$obj'"
	},
	{
		"KeyowrdName": "WaitForObjectVisible",
		"MappedName": "Wait <$Timeout> second(s) for visibility of '$obj'"
	},
	{
		"KeyowrdName": "Web_ClickByText",
		"MappedName": "Click on text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Web_ClickByTextInSequence",
		"MappedName": "Click in sequence on text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch1>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Web_DeSelectCheckBoxByText",
		"MappedName": "Deselect checkbox with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Web_DoubleClickByText",
		"MappedName": "Double click on text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Web_GoBack",
		"MappedName": "Go back to previous web page"
	},
	{
		"KeyowrdName": "Web_ResizeBrowser",
		"MappedName": "Resize browser window to width <$Width> and height <$Height>"
	},
	{
		"KeyowrdName": "Web_RightClickByText",
		"MappedName": "Right click on text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Web_SelectByText",
		"MappedName": "Select text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Web_SelectCheckBoxByText",
		"MappedName": "Select checkbox with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Web_SelectDropDownByText",
		"MappedName": "Select value <$ValueToSelect> in dropdown with text {&IIF(''$obj.DisplayValue'' = '' ,'<$DropdownLabel>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Web_SelectRadioButtonByText",
		"MappedName": "Select radio button with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Web_SetFocusOnCurrentWindow",
		"MappedName": "Set focus on current web browser window"
	},
	{
		"KeyowrdName": "Web_TypeByText",
		"MappedName": "Enter <$TextToType> in edit box with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Web_TypeKeysByText",
		"MappedName": "Enter keys <$TextToType> in edit box with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Web_WaitForWindowLoad",
		"MappedName": "Wait <$TimeOut> second(s) for window to load with title <$WindowTitle> and index <$TitleIndex>"
	},
	{
		"KeyowrdName": "SF_TypeTextInTextArea",
		"MappedName": "Enter <$Value> in text area '$obj'"
	},
	{
		"KeyowrdName": "ClickTableCell",
		"MappedName": "Click in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "GetTableCellText",
		"MappedName": "Get value from the table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "GetFullTableText",
		"MappedName": "Get complete data from table '$obj'"
	},
	{
		"KeyowrdName": "VerifyTextInTableCell",
		"MappedName": "Validate whether <$ExpectedCellValue> is available in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "ClickTableCellAndWait",
		"MappedName": "Click in table '$obj' having row number <$Row Index> , column number <$Column Index> and wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "VerifyTableColumnNumber",
		"MappedName": "Validate whether <$ExpectedColumnNumber> is column number of table '$obj' having row number <$Row Index>"
	},
	{
		"KeyowrdName": "VerifyTableColumnText",
		"MappedName": "Validate whether <$ExpectedColumnText> is column value of table '$obj' having row number <$Row Index>"
	},
	{
		"KeyowrdName": "VerifyTableRowText",
		"MappedName": "Validate whether <$ExpectedRowText> is row value of table '$obj' having column number <$Column Index>"
	},
	{
		"KeyowrdName": "VerifyTableColumnHeader",
		"MappedName": "Validate whether <$Expected Text> is column header of table '$obj'"
	},
	{
		"KeyowrdName": "ClickLinkInTableCell",
		"MappedName": "Click on link in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "VerifyTableRowNumber",
		"MappedName": "Validate whether <$Expected Row Number> is row number of table '$obj' having column number <$Column Index>"
	},
	{
		"KeyowrdName": "ClickButtonInTableCell",
		"MappedName": "Click on button in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "GetTableRowNumber",
		"MappedName": "Get row number of table '$obj' having column number <$Column Index>"
	},
	{
		"KeyowrdName": "GetTableColumnNumber",
		"MappedName": "Get column number of table '$obj' having row number <$Row Index>"
	},
	{
		"KeyowrdName": "GetTableRowCount",
		"MappedName": "Get row count of table '$obj'"
	},
	{
		"KeyowrdName": "GetTableColumnCount",
		"MappedName": "Get column count of table '$obj' having row number <$Row Index>"
	},
	{
		"KeyowrdName": "VerifyCheckboxStatusInTableCell",
		"MappedName": "Validate whether status is <$Status> of checkbox in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "SelectRadioButtonInTableCell",
		"MappedName": "Select radio button in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "SelectCheckBoxinTableCell",
		"MappedName": "Select checkbox with <$Value> in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "TypeTextInTableCell",
		"MappedName": "Enter <$Text> in table '$obj' having tag name <$Tag> , row number  <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "ClickInTableCellByQuery",
		"MappedName": "Click in table '$obj' by query having column name/number <$Column Name/Index> , header1 <$Header1> , value1 <$Value1>"
	},
	{
		"KeyowrdName": "ClickOnObjectInTableCell",
		"MappedName": "Click on object in table '$obj' having tag name <$Tag> , row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "ClickOnObjectInTableCellByQuery",
		"MappedName": "Click on object in table '$obj' by query having column name/number <$Column Name/Index> , header1 <$Header1> , value1 <$Value1>"
	},
	{
		"KeyowrdName": "Web_GetTableRowCount",
		"MappedName": "Get row count in table '$obj'"
	},
	{
		"KeyowrdName": "Web_GetTableColumnCount",
		"MappedName": "Get column count of table '$obj' having row number <$Row Index>"
	},
	{
		"KeyowrdName": "DeSelectMultipleDropdownItemInTableCell",
		"MappedName": "Deselect multiple dropdown items <$Value> in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "DoubleClickTableCell",
		"MappedName": "Double click in table '$obj' having tag name <$Tag> , row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "FetchObjectPropertyInTableCell",
		"MappedName": "Get object property <$Property> in table '$obj' having tag name <$Tag> , row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "GetAllColumnText",
		"MappedName": "Get column(s) value of table '$obj' with column delimiter <$Column Delimiter> , row delimiter <$Row Delimiter>"
	},
	{
		"KeyowrdName": "GetAllRowText",
		"MappedName": "Get row(s) value of table '$obj' with row delimiter <$Row Delimiter> , column delimiter <$Column Delimiter>"
	},
	{
		"KeyowrdName": "GetCompleteTableText",
		"MappedName": "Get complete data of table '$obj'"
	},
	{
		"KeyowrdName": "GetSelectedDropDownItemInTableCell",
		"MappedName": "Get selected dropdown item in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "GetSingleTableColumnText",
		"MappedName": "Get column value of table '$obj' having column number <$Column Index>"
	},
	{
		"KeyowrdName": "GetSingleTableRowText",
		"MappedName": "Get row value table '$obj' having row number <$Row Index>"
	},
	{
		"KeyowrdName": "GetTableColumnHeader",
		"MappedName": "Get column header of table '$obj' having column number <$Column Index>"
	},
	{
		"KeyowrdName": "GetTextFromTableCellByQuery",
		"MappedName": "Get value from table '$obj' by query having column name/number <$Column Name/Index> , header1 <$Header1> , value1 <$Value1>"
	},
	{
		"KeyowrdName": "SelectDropDownInTableCell",
		"MappedName": "Select dropdown with value <$SelectValue> in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "TypeOnObjectInTableCell",
		"MappedName": "Enter <$Text> on object in table '$obj' having tag name <$Tag> , row number <$Row Index> , column number <$Column Index>'"
	},
	{
		"KeyowrdName": "TypeTextInTableCellByQuery",
		"MappedName": "Enter <$Text> in table '$obj' by query having column name/number <$Column Name/Index> , header1 <$Header1> , value1 <$Value1>"
	},
	{
		"KeyowrdName": "VerifyFullTableText",
		"MappedName": "Validate whether <$Text> is complete data of table '$obj'"
	},
	{
		"KeyowrdName": "VerifyTableColumnCount",
		"MappedName": "Validate whether <$ExpectedColumnCount> is column count of table '$obj' having row number <$Row Index>"
	},
	{
		"KeyowrdName": "VerifyTableRowCount",
		"MappedName": "Validate whether <$ExpectedRowCount> is row count of table '$obj'"
	},
	{
		"KeyowrdName": "Web_ClearTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_ClickImageInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_ClickLinkInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_ClickTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_ClickTextInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_DeSelectCheckBoxInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_DoubleClickTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_GetCheckBoxStatusInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_GetColumnNameByRowNumber",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_GetObjectPropertyInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_GetRowNumberByColumnName",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_GetTableCellValue",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_GetCountOfTableColumn",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_GetTableColumnNameORNumber",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_GetTableColumnValue",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_GetCountOfTableRow",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_GetTableRowValue",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_HighlightTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_MouseHoverInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_SelectCheckBoxInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_SelectDropDownInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_SelectRadioButtonInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_TypeTextAndEnterInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_TypeTextInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_VerifyCheckBoxStatusInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Web_VerifyTableCellValue",
		"MappedName": ""
	}
];

var salesforceMapKeywords = [
	{
		"KeyowrdName": "SF_AccountExists",
		"MappedName": "Validate whether account with name <$AccountName> exists or not"
	},
	{
		"KeyowrdName": "SF_ClearEditFieldByText",
		"MappedName": "Clear value in the edit field with name <$TextToSearch>"
	},
	{
		"KeyowrdName": "SF_TypeTextAndEnterTextArea",
		"MappedName": "Enter <$Value> in text area '$obj' and press Enter"
	},
	{
		"KeyowrdName": "SF_ClearTableCell",
		"MappedName": "Clear value in table cell having column name/number <$ColumnName/Number> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_TypeTextAndEnterEditBox",
		"MappedName": "Enter <$Value> in edit box '$obj' and press Enter"
	},
	{
		"KeyowrdName": "SF_Wait",
		"MappedName": "Wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "SF_WaitForObject",
		"MappedName": "Wait <$Timeout> second(s) for '$obj'"
	},
	{
		"KeyowrdName": "SF_Click",
		"MappedName": "Click on the object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_ClickArrowByWidgetName",
		"MappedName": "Click on the arrow of widget <$WidgetName> and perform action <$Action>"
	},
	{
		"KeyowrdName": "SF_ClickArrowInTableCellByQuery",
		"MappedName": "Click on the arrow in table cell having table name <$TableName>, value <$ValueToSelect>, identifier1 <$Identifier1> and value1 <$Value1>"
	},
	{
		"KeyowrdName": "SF_ClickButton",
		"MappedName": "Click on the button with name '$obj'"
	},
	{
		"KeyowrdName": "SF_ClickButtonInRelatedList",
		"MappedName": "Click on the button <$ButtonText> in related list <$RelatedListTitle>"
	},
	{
		"KeyowrdName": "SF_ClickButtonInTableCell",
		"MappedName": "Click on the button in table cell having column name/number <$ColumnName/Number> and row number <$RowNo> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_ClickByText",
		"MappedName": "Click on the object with text {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_ClickByTextInSequence",
		"MappedName": "Click on the object with name <$TextToSearch1>"
	},
	{
		"KeyowrdName": "SF_ClickImage",
		"MappedName": "Click on the image with name '$obj'"
	},
	{
		"KeyowrdName": "SF_ClickImageByTitle/Alt",
		"MappedName": "Click on the image having Title/Alt {&IIF(''$obj.DisplayValue'' = '','<$Title/Alt>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_ClickImageInTableCell",
		"MappedName": "Click on the image in table cell having column name/number <$ColumnName/Number> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_ClickInTableCellUsingObject",
		"MappedName": "Click in the table cell having column name <$Column Name> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_ClickInTableCellUsingText",
		"MappedName": "Click in the table cell having column name <$columnName> and table name <$TableName>"
	},
	{
		"KeyowrdName": "SF_ClickLink",
		"MappedName": "Click on the link with name '$obj'"
	},
	{
		"KeyowrdName": "SF_ClickLinkInTableCell",
		"MappedName": "Click on the link in table cell having column name/number <$ColumnName/Number> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_ClickNewDashboard",
		"MappedName": "Click on the new dashboard"
	},
	{
		"KeyowrdName": "SF_ClickNewEvent",
		"MappedName": "Click on the new event"
	},
	{
		"KeyowrdName": "SF_ClickOnQuickAction",
		"MappedName": "Click on the quick action button and select action {&IIF(''$obj.DisplayValue'' = '','<$ActionName>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_ClickTableCell",
		"MappedName": "Click in the table cell having column name/number <$ColumnName/Number> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_ClickTextInCell",
		"MappedName": "Click on the text <$TextToClick> in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_ClickTextInRelatedListInTileView",
		"MappedName": "Click on the text <$TextToClick> having field name <$FieldName> in related list tile <$RelatedListTitle>"
	},
	{
		"KeyowrdName": "SF_ClickTextInRelatedListTable",
		"MappedName": "Click on the text <$TextToClick> in related list having column name <$ColumnName> and related list title <$RelatedListTitle>"
	},
	{
		"KeyowrdName": "SF_ClickTextInTableCell",
		"MappedName": "Click on the text <$TextToClick> in table cell having column name/number <$ColumnName/Index> and table name <$TableName>"
	},
	{
		"KeyowrdName": "SF_ClickTextInTableCellUsingText",
		"MappedName": "Click on the text <$TextToClick> in table cell having column name/number <$ColumnName/Index> and table name <$TableName>"
	},
	{
		"KeyowrdName": "SF_ContactExists",
		"MappedName": "Validate whether contact with name <$Name> exists or not"
	},
	{
		"KeyowrdName": "SF_DeSelectCheckBox",
		"MappedName": "DeSelect the checkbox with name '$obj'"
	},
	{
		"KeyowrdName": "SF_DeSelectCheckBoxByText",
		"MappedName": "DeSelect the checkbox with the name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_DeSelectCheckBoxInTableCell",
		"MappedName": "DeSelect the checkbox in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_DeselectDataFromPickList",
		"MappedName": "DeSelect value \"ValueToDeselect\" from the picklist with name {&IIF(''$obj.DisplayValue'' = '','<$LabelName>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_DragAndDrop",
		"MappedName": "Drag the object with name '$obj1' and drop into the object with name '$obj2'"
	},
	{
		"KeyowrdName": "SF_EditAccountInTable",
		"MappedName": "Modify existing field <$FieldToBeModified> of account in table with value <$New Text>, identifier1 <$Identifier1> and value1 <$Value1>"
	},
	{
		"KeyowrdName": "SF_EditContactInTable",
		"MappedName": "Modify existing field <$FieldToBeModified> of contact in table with value <$New Text>, identifier1 <$Identifier1> and value1 <$Value1>"
	},
	{
		"KeyowrdName": "SF_EditDataInTableCell",
		"MappedName": "Modify existing data <$FieldToBeModified> in table with value <$New Text> and table name <$TableName>"
	},
	{
		"KeyowrdName": "SF_EditLeadInTable",
		"MappedName": "Modify existing field <$FieldToBeModified> of lead in table with value <$New Text>, identifier1 <$Identifier1> and value1 <$Value1>"
	},
	{
		"KeyowrdName": "SF_EditOpportunityInTable",
		"MappedName": "Modify existing field <$FieldToBeModified> of opportunity in table with value <$New Text>, identifier1 <$Identifier1> and value1 <$Value1>"
	},
	{
		"KeyowrdName": "SF_ExecuteBulkOperation",
		"MappedName": ""
	},
	{
		"KeyowrdName": "SF_ExecuteSOQLQuery",
		"MappedName": "Execute SOQL query <$Query>"
	},
	{
		"KeyowrdName": "SF_GetAllColumnText",
		"MappedName": "Get value of the table columns having column delimiter <$Column Delimiter>, row delimiter <$Row Delimiter> and table name <$TableName>"
	},
	{
		"KeyowrdName": "SF_GetAllDropDownItems",
		"MappedName": "Get all the items from dropdown with name <$Label Name>"
	},
	{
		"KeyowrdName": "SF_GetAuthorizationToken",
		"MappedName": "Get the authorization token from URL <$Url> with consumer key <$Consumer Key>, consumer secret <$Consumer Secret>, username <$Username> and password <$Password>"
	},
	{
		"KeyowrdName": "SF_GetChildObjectCount",
		"MappedName": "Get child count with attribute(s) <$Tag>, <$PropertyName> of the object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetColumnNameByRowNumber",
		"MappedName": "Get column name of the table having cell value <$CellValue> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetFieldError",
		"MappedName": "Get error from the field with name <$LabelName>"
	},
	{
		"KeyowrdName": "SF_GetFieldNameHavingError",
		"MappedName": "Get the field name having error message"
	},
	{
		"KeyowrdName": "SF_GetMultiplePickListItems",
		"MappedName": "Get the multiple items from the picklist with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetObjectCount",
		"MappedName": "Get count of the object with attribute(s) <$AttributeName1>, <$AttributeValue1>"
	},
	{
		"KeyowrdName": "SF_GetObjectExistence",
		"MappedName": "Check existence of the object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetObjectProperty",
		"MappedName": "Get property <$Property> of the object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetObjectPropertyInTableCell",
		"MappedName": "Get property of the object in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber>, object tag <$ObjectTag>, property name <$PropertyName> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetObjectText",
		"MappedName": "Get text of the object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetObjectTextByLabel",
		"MappedName": "Get text of the object with name {&IIF(''$obj.DisplayValue'' = '','<$LabelName>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_GetPageError",
		"MappedName": "Get the error(s) on the page"
	},
	{
		"KeyowrdName": "SF_GetRowCount",
		"MappedName": "Get count of the table row having table name <$Table Name>"
	},
	{
		"KeyowrdName": "SF_GetRowNumberByColumnName",
		"MappedName": "Get row number of the table having column name/number <$ColumnName/Number>, cell value <$CellValue> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetSingleTableColumnText",
		"MappedName": "Get value of the table column having column name <$ColumnName> and table name <$TableName>"
	},
	{
		"KeyowrdName": "SF_GetTableCellText",
		"MappedName": "Get value of the table cell having column number <$Column Index>, row number <$Row Index> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetTableCellValue",
		"MappedName": "Get value of the table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetTableColumnCount",
		"MappedName": "Get count of the column in table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetTableColumnName",
		"MappedName": "Get name or number of the column(s) in table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetTableColumnValue",
		"MappedName": "Get value of the table column column name/number <$ColumnName/Number> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetTableRowCount",
		"MappedName": "Get count of the row(s) in table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetTableRowValue",
		"MappedName": "Get value of the table row having row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetTextCountInTableColumn",
		"MappedName": "Get count of text <$TextToSearch> in table column having column name/number <$ColumnName/Number> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetTextCountInTableRow",
		"MappedName": "Get count of text <$TextToSearch> in table row having row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetTextFromRelatedListInTileView",
		"MappedName": "Get text from the related list in tile view having field name <$FieldName> and related list title <$RelatedListTitle>"
	},
	{
		"KeyowrdName": "SF_GetTextFromRelatedListTable",
		"MappedName": "Get text from the related list table having column name <$ColumnName> and related list title <$RelatedListTitle>"
	},
	{
		"KeyowrdName": "SF_GetTextFromTableCellUsingObject",
		"MappedName": "Get value from the table cell having column name <$Column Name>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_GetTextFromTableCellUsingText",
		"MappedName": "Get value from the table cell having column name <$Column Name> and table name with name <$TableName>"
	},
	{
		"KeyowrdName": "SF_GlobalSearch",
		"MappedName": "Search value <$Value> in the salesforce application"
	},
	{
		"KeyowrdName": "SF_GlobalSearchAndSelect",
		"MappedName": "Search and select value \"ValueToSelect\" in the object with name {&IIF(''$obj.DisplayValue'' = '','<$ValueToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_GoToAccounts",
		"MappedName": "Navigate to Accounts Tab"
	},
	{
		"KeyowrdName": "SF_GoToCalendar",
		"MappedName": "Navigate to Calendar Tab"
	},
	{
		"KeyowrdName": "SF_GoToChatter",
		"MappedName": "Navigate to Chatter Tab"
	},
	{
		"KeyowrdName": "SF_GoToContacts",
		"MappedName": "Navigate to Contacts Tab"
	},
	{
		"KeyowrdName": "SF_GoToDashboards",
		"MappedName": "Navigate to Dashboards Tab"
	},
	{
		"KeyowrdName": "SF_GoToFiles",
		"MappedName": "Navigate to Files Tab"
	},
	{
		"KeyowrdName": "SF_GoToForecasts",
		"MappedName": "Navigate to Forecasts Tab"
	},
	{
		"KeyowrdName": "SF_GoToGroups",
		"MappedName": "Navigate to Groups Tab"
	},
	{
		"KeyowrdName": "SF_GoToHome",
		"MappedName": "Navigate to Home Tab"
	},
	{
		"KeyowrdName": "SF_GoToLeads",
		"MappedName": "Navigate to Leads Tab"
	},
	{
		"KeyowrdName": "SF_GoToNotes",
		"MappedName": "Navigate to Notes Tab"
	},
	{
		"KeyowrdName": "SF_GoToOpportunities",
		"MappedName": "Navigate to Opportunities Tab"
	},
	{
		"KeyowrdName": "SF_GoToProducts",
		"MappedName": "Navigate to Products Tab"
	},
	{
		"KeyowrdName": "SF_GoToQuotes",
		"MappedName": "Navigate to Quotes Tab"
	},
	{
		"KeyowrdName": "SF_GoToReports",
		"MappedName": "Navigate to Reports Tab"
	},
	{
		"KeyowrdName": "SF_GoToTab",
		"MappedName": "Navigate to tab with name \"$obj'"
	},
	{
		"KeyowrdName": "SF_GoToTasks",
		"MappedName": "Navigate to Tasks Tab"
	},
	{
		"KeyowrdName": "SF_GroupExists",
		"MappedName": "Validate whether group with name <$Name> exists or not"
	},
	{
		"KeyowrdName": "SF_HighlightTableCell",
		"MappedName": "Highlight the table cell having column name/number <$ColumnName/Number> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_IsTextPresentOnScreen",
		"MappedName": "Validate whether the object with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}  is present on current web page"
	},
	{
		"KeyowrdName": "SF_LaunchApp",
		"MappedName": "Launch the App with name {&IIF(''$obj.DisplayValue'' = '','<$AppName>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_LaunchAppAndSelectItem",
		"MappedName": "Launch the App and select item with name {&IIF(''$obj.DisplayValue'' = '','<$Item>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_LeadExists",
		"MappedName": "Validate whether lead with name <$Name> exists or not"
	},
	{
		"KeyowrdName": "SF_Logout",
		"MappedName": "Logout from the salesforce application"
	},
	{
		"KeyowrdName": "SF_MouseHover",
		"MappedName": "Hover mouse on the object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_MouseHoverInTableCell",
		"MappedName": "Hover mouse on the table cell having column name/number <$ColumnName/Number> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_MouseHoverOnText",
		"MappedName": "Hover mouse on the text {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_OpportunityExists",
		"MappedName": "Validate whether opportunity with name <$Opportunity Name> exists or not"
	},
	{
		"KeyowrdName": "SF_PerformActionInRelatedList",
		"MappedName": "Perform action <$Action> in related list with name <$RelatedListTitle>"
	},
	{
		"KeyowrdName": "SF_QuoteExists",
		"MappedName": "Validate whether quote with name <$Quote Name> exists or not"
	},
	{
		"KeyowrdName": "SF_RefreshSection",
		"MappedName": "Refresh section of the page"
	},
	{
		"KeyowrdName": "SF_SearchAndSelect",
		"MappedName": "Search and select value \"<$TextToType>\" in the object with name \"$obj\""
	},
	{
		"KeyowrdName": "SF_SearchDataInLookup",
		"MappedName": "Search the lookup with name {&IIF(''$obj.DisplayValue'' = '','<$LabelName>',''$obj'')&}, enter value <$TextToType> and select data with name <$SelectItem>"
	},
	{
		"KeyowrdName": "SF_SearchRecordInTable",
		"MappedName": "Search record with name <$RecordToSearch> in table object"
	},
	{
		"KeyowrdName": "SF_SelectCalenderView",
		"MappedName": "Select calendar view as {&IIF(''$obj.DisplayValue'' = '','<$View>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SelectCheckBox",
		"MappedName": "Select the checkbox with name '$obj'"
	},
	{
		"KeyowrdName": "SF_SelectCheckboxByText",
		"MappedName": "Select the checkbox with the name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SelectCheckBoxInTableCell",
		"MappedName": "Select the checkbox in table cell having column name/number <$Column Name/Column Index> and table name <$Table Name/Table Index>"
	},
	{
		"KeyowrdName": "SF_SelectCheckBoxInTableCellByQuery",
		"MappedName": "Select the checkbox in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_SelectDataFromPickList",
		"MappedName": "Select value <$ValueToSelect> in the picklist with name {&IIF(''$obj.DisplayValue'' = '','<$LabelName>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SelectDisplayAs",
		"MappedName": "Select display as {&IIF(''$obj.DisplayValue'' = '','<$DisplayText>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SelectDropdownByText",
		"MappedName": "Select <$ValueToSelect> in the dropdown with name {&IIF(''$obj.DisplayValue'' = '','<$DropdownLabel>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SelectDropDownInCell",
		"MappedName": "Select the dropdown with value <$ValueToSelect> in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_SelectDropdownInTableCell",
		"MappedName": "Select the dropdown with value <$TextToSelect> in table cell having column name <$ColumnName> and table name <$TableName>"
	},
	{
		"KeyowrdName": "SF_SelectDropDownItem",
		"MappedName": "Select value <$Item> in the dropdown with name '$obj'"
	},
	{
		"KeyowrdName": "SF_SelectEditView",
		"MappedName": "Select edit view with name {&IIF(''$obj.DisplayValue'' = '','<$PageView>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SelectFrame",
		"MappedName": "Select the iframe with name '$obj'"
	},
	{
		"KeyowrdName": "SF_SelectListItem",
		"MappedName": "Select value <$Value> in the list with name '$obj'"
	},
	{
		"KeyowrdName": "SF_SelectListViewControl",
		"MappedName": "Select list view with name {&IIF(''$obj.DisplayValue'' = '','<$ListViewText>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SelectMultipleDropDownByText",
		"MappedName": "Select value(s) <$TextToSelect> in the dropdown with name {&IIF(''$obj.DisplayValue'' = '','<$LabelName>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SelectMultipleDropdownItem",
		"MappedName": "Select value(s) <$ItemString> in the dropdown with name '$obj'"
	},
	{
		"KeyowrdName": "SF_SelectNew",
		"MappedName": "Select new tab with name {&IIF(''$obj.DisplayValue'' = '','<$TabName>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SelectRadioButton",
		"MappedName": "Select the radio button with name '$obj'"
	},
	{
		"KeyowrdName": "SF_SelectRadioButtonByText",
		"MappedName": "Select the radio button with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SelectRadioButtonInTableCell",
		"MappedName": "Select the radio button in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_SelectRecord",
		"MappedName": "Select record with name {&IIF(''$obj.DisplayValue'' = '','<$RecordName>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SelectRecordType",
		"MappedName": "Select record type with name {&IIF(''$obj.DisplayValue'' = '','<$RecordType>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SelectTab",
		"MappedName": "Select tab with name {&IIF(''$obj.DisplayValue'' = '','<$TabName>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SelectValueFromLookUp",
		"MappedName": "Select value <$LookUp to Select> in the lookup with name {&IIF(''$obj.DisplayValue'' = '','<$LabelName>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SelectWindow",
		"MappedName": "Select the browser window with title <$Title> and title index <$TitleIndex>"
	},
	{
		"KeyowrdName": "SF_SetDate",
		"MappedName": "Enter value \"<$Date(MM/DD/YYYY> in the object with name {&IIF(''$obj.DisplayValue'' = '','<$DateEvent>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SetDateTime",
		"MappedName": "Enter value \"<$Value> in the object with name {&IIF(''$obj.DisplayValue'' = '','<$LabelName>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SetGeoLocationValue",
		"MappedName": "Set geo location to latitude <$Latitude> and longitude <$Longitude> of the object with name {&IIF(''$obj.DisplayValue'' = '','<$Label>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SetSalesForceEnvironment",
		"MappedName": "Set salesforce environment with browser name <$Browser>, URL <$URL>, username <$UserName> and password <$Password>"
	},
	{
		"KeyowrdName": "SF_SetTextAlignment",
		"MappedName": "Set alignment of the text with name {&IIF(''$obj.DisplayValue'' = '','<$LabelName>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SetTime",
		"MappedName": "Enter value <$Time(hh:mm AM/PM)> in the object with name {&IIF(''$obj.DisplayValue'' = '','<$TimeEvent>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_SwitchtoSalesforceClassic",
		"MappedName": "Switch mode of the salesforce application to Classic"
	},
	{
		"KeyowrdName": "SF_SwitchtoSalesforceLightning",
		"MappedName": "Switch mode of the salesforce application to Lightning"
	},
	{
		"KeyowrdName": "SF_TypeByText",
		"MappedName": "Enter value <$TextToType> in the object with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_TypeTextAndEnterInTableCell",
		"MappedName": "Enter value <$Expected Text> and press Enter in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_TypeTextInTableCell",
		"MappedName": "Enter value <$ValueToType> in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_TypeTextInTableCellUsingObject",
		"MappedName": "Enter value <$Text> in table cell having column name <$Column Name> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_TypeTextInTableCellUsingText",
		"MappedName": "Enter value <$Text> in table cell having column name <$Column Name> and table name <$TableName>"
	},
	{
		"KeyowrdName": "SF_TypeTextInTextArea",
		"MappedName": "Enter value <$Value> in the text area with name '$obj'"
	},
	{
		"KeyowrdName": "SF_TypeTextOnEditbox",
		"MappedName": "Enter value <$Value> in the object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_TypeTextOnRichTextArea",
		"MappedName": "Enter value <$TextToType> in the rich text area with name '$obj'"
	},
	{
		"KeyowrdName": "SF_TypeTextOnRichTextAreaByText",
		"MappedName": "Enter value <$TextToType> in the rich textarea with name {&IIF(''$obj.DisplayValue'' = '','<$LabelName>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SF_VerifyDropDownItemCount",
		"MappedName": "Validate whether value <$Value> is count of item in the dropdown with name '$obj' or not"
	},
	{
		"KeyowrdName": "SF_VerifyDropDownItemExists",
		"MappedName": "Validate whether value <$Item> exists in the dropdown with name '$obj' or not"
	},
	{
		"KeyowrdName": "SF_VerifyListItemExists",
		"MappedName": "Validate whether value <$ExpectedValue> exists in the list item with name '$obj' or not"
	},
	{
		"KeyowrdName": "SF_VerifyMultipleDropDownItemExist",
		"MappedName": "Validate whether value(s) <$Item String> exists in the dropdown with name '$obj' or not"
	},
	{
		"KeyowrdName": "SF_VerifyObjectEnabled",
		"MappedName": "Validate whether the object with name '$obj' is enabled or not"
	},
	{
		"KeyowrdName": "SF_VerifyObjectExists",
		"MappedName": "Validate whether the object with name 'obj' exists or not"
	},
	{
		"KeyowrdName": "SF_VerifyObjectPropertyValue",
		"MappedName": "Validate whether value <$PropertyName> is available in the object with name 'obj' or not"
	},
	{
		"KeyowrdName": "SF_VerifyObjectText",
		"MappedName": "Validate whether value <$Value> is available in the object with name '$obj' or not"
	},
	{
		"KeyowrdName": "SF_VerifyRadioButtonSelected",
		"MappedName": "Validate whether the radio button with name 'obj' is selected or not"
	},
	{
		"KeyowrdName": "SF_VerifyTableCellValue",
		"MappedName": "Validate whether value  <$Expected Text> is available in table cell having column name/Number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "SF_VerifyTextFromRelatedListInTileView",
		"MappedName": "Validate whether value <$ExpectedText> is available in related list tile view having field name <$FieldName> and related list title <$RelatedListTitle>"
	},
	{
		"KeyowrdName": "SF_VerifyTextFromRelatedListTable",
		"MappedName": "Validate whether value <$ExpectedText> is available in related list table having field name <$FieldName> and related list title <$RelatedListTitle>"
	},
	{
		"KeyowrdName": "SF_VerifyTextFromTableCellByQuery",
		"MappedName": "Validate whether value  <$Expected Text> is available in table cell having column name <$ColumnNamr> and table name <$TableName>"
	},
	{
		"KeyowrdName": "SF_VerifyWidgets",
		"MappedName": "Validate whether widget with name {&IIF(''$obj.DisplayValue'' = '','<$WidgetName>',''$obj'')&} exists or not"
	}
];

var oraclefusionMapKeywords = [
	{
		"KeyowrdName": "OracleFusion_ClearEditField",
		"MappedName": "Clear value in edit field '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_ClearEditFieldUsingText",
		"MappedName": "Clear value in edit field with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "OracleFusion_Click",
		"MappedName": "Click on '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_ClickButton",
		"MappedName": "Click on button '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_ClickByText",
		"MappedName": "Click on text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "OracleFusion_ClickDownloadButton",
		"MappedName": "Click on download button"
	},
	{
		"KeyowrdName": "OracleFusion_ClickImage",
		"MappedName": "Click on image '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_ClickLink",
		"MappedName": "Click on link '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_DeSelectCheckBox",
		"MappedName": "Deselect checkbox '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_DeSelectCheckBoxByText",
		"MappedName": "Deselect checkbox with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "OracleFusion_DeSelectCheckBoxItemsInDropDown",
		"MappedName": "Deselect checkbox value(s) <$Value(s)> in text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "OracleFusion_GetObjectExistence",
		"MappedName": "Validate whether '$obj' exists or not"
	},
	{
		"KeyowrdName": "OracleFusion_GetObjectText",
		"MappedName": "Get text of '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_GetObjectTextByLabel",
		"MappedName": "Get value of label {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "OracleFusion_IsTextPresentOnScreen",
		"MappedName": "Validate whether text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&} exists"
	},
	{
		"KeyowrdName": "OracleFusion_MouseHover",
		"MappedName": "Hover mouse on '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_NavigateToWorkArea",
		"MappedName": "Navigate to work area with parent responsibility <$Parent Responsibility> and child responsibility <$Child Responsibility>"
	},
	{
		"KeyowrdName": "OracleFusion_SelectCheckBox",
		"MappedName": "Select checkbox '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_SelectCheckBoxByText",
		"MappedName": "Select checkbox with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "OracleFusion_SelectCheckBoxItemsInDropDown",
		"MappedName": "Select checkbox value(s) <$Value(s)> in text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "OracleFusion_SelectDropDownByText",
		"MappedName": "Select <$ValueToSelect> in dropdown with text {&IIF(''$obj.DisplayValue'' = '' ,'<$DropdownLabel>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "OracleFusion_SelectDropDownItem",
		"MappedName": "Select <$Item> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_SelectFrame",
		"MappedName": "Select iframe '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_SelectListItem",
		"MappedName": "Select item <$Value> in list '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_SelectMultipleDropDownItem",
		"MappedName": "Select multiple value(s) <$ItemString> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_SelectPage",
		"MappedName": "Select page with page title <$PageTitle> and page header <$PageHeader>"
	},
	{
		"KeyowrdName": "OracleFusion_SelectRadioButton",
		"MappedName": "Select radio button '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_SelectRadioButtonByText",
		"MappedName": "Select radio button with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "OracleFusion_SelectWindow",
		"MappedName": "Select browser window with title <$Title> and title index <$TitleIndex>"
	},
	{
		"KeyowrdName": "OracleFusion_SetDate",
		"MappedName": "Enter date <$TextToType> in edit box with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "OracleFusion_SetMetaData",
		"MappedName": "Set metadata to module <$Module> and sub-module <$Sub-Module>"
	},
	{
		"KeyowrdName": "OracleFusion_TypeByText",
		"MappedName": "Enter <$TextToType> in edit box with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "OracleFusion_TypeByTextAndEnter",
		"MappedName": "Enter <$TextToType> in edit box with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&} and press Enter"
	},
	{
		"KeyowrdName": "OracleFusion_TypeTextAndEnterEditBox",
		"MappedName": "Enter <$Value> in edit box '$obj' and press Enter"
	},
	{
		"KeyowrdName": "OracleFusion_TypeTextAndEnterTextArea",
		"MappedName": "Enter <$Value> in text area '$obj' and press Enter"
	},
	{
		"KeyowrdName": "OracleFusion_TypeTextInTextArea",
		"MappedName": "Enter <$Value> in text area '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_TypeTextOnEditBox",
		"MappedName": "Enter <$Value> in edit box '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_VerifyObjectText",
		"MappedName": "Validate whether text <$Value> is available in '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_Wait",
		"MappedName": "Wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "OracleFusion_WaitForObject",
		"MappedName": "Wait <$Timeout> second(s) for '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_ClearTableCell",
		"MappedName": "Clear value in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_ClickImageInTableCell",
		"MappedName": "Click on image in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber> "
	},
	{
		"KeyowrdName": "OracleFusion_ClickLinkInTableCell",
		"MappedName": "Click on link in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_ClickTableCell",
		"MappedName": "Click in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_ClickTextInTableCell",
		"MappedName": "Click on text <$TextToClick> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_DeSelectCheckBoxInTableCell",
		"MappedName": "Deselect checkbox in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_DoubleClickTableCell",
		"MappedName": "Double click in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_GetCheckBoxStatusInTableCell",
		"MappedName": "Get checkbox status of table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_GetColumnNameByRowNumber",
		"MappedName": "Get column name of table '$obj' having cell value <$CellValue> and row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_GetObjectPropertyInTableCell",
		"MappedName": "Get property of object in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber> , object tag <$ObjectTag> , property name <$PropertyName>"
	},
	{
		"KeyowrdName": "OracleFusion_GetRowNumberByColumnName",
		"MappedName": "Get row number of table '$obj' having column name <$ColumnName> , cell value <$CellValue>"
	},
	{
		"KeyowrdName": "OracleFusion_GetRowsCountHavingSameData",
		"MappedName": "Get row(s) count with same data in table '$obj' having column name <$ColumnName> , identifier 1 <$Identifier1> , value 1 <$Value1>"
	},
	{
		"KeyowrdName": "OracleFusion_GetTableCellValue",
		"MappedName": "Get value of table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_GetTableColumnCount",
		"MappedName": "Get column count of table '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_GetTableColumnName/Number",
		"MappedName": "Get column(s) name or number of table '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_GetTableColumnValue",
		"MappedName": "Get column value of table '$obj' having column name <$ColumnName>"
	},
	{
		"KeyowrdName": "OracleFusion_GetTableRowCount",
		"MappedName": "Get row(s) count of table '$obj'"
	},
	{
		"KeyowrdName": "OracleFusion_GetTableRowValue",
		"MappedName": "Get row value of table '$obj' having row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_GetTextCountInTableColumn",
		"MappedName": "Get count of text <$TextToSearch> in column of table '$obj' having column number <$ColumnName>"
	},
	{
		"KeyowrdName": "OracleFusion_GetTextCountInTableRow",
		"MappedName": "Get count of text <$TextToSearch> in row of table '$obj' having row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_HighlightTableCell",
		"MappedName": "Highlight cell of table '$obj'' having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_MouseHoverInTableCell",
		"MappedName": "Hover mouse on table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_SelectCheckBoxInTableCell",
		"MappedName": "Select checkbox in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_SelectDropDownInTableCell",
		"MappedName": "Select dropdown with value <$ValueToSelect> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_SelectRadioButtonInTableCell",
		"MappedName": "Select radio button in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_SelectRowsFromTable",
		"MappedName": "Select row(s) in table '$obj' having column name <$ColumnName> , row number <$RowNumbers>"
	},
	{
		"KeyowrdName": "OracleFusion_TypeTextAndEnterInTableCell",
		"MappedName": "Enter <$ValueToType> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber> and press Enter"
	},
	{
		"KeyowrdName": "OracleFusion_TypeTextInTableCell",
		"MappedName": "Enter <$ValueToType> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_VerifyCheckBoxStatusInTableCell",
		"MappedName": "Validate whether status is <$ExpectedStatus> of checkbox in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "OracleFusion_VerifyTableCellValue",
		"MappedName": "Validate whether <$ExpectedText> is available in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	}
];

var oracleEBSMappedKeywords = [
	{
		"KeyowrdName": "Oracle_ClearTextField",
		"MappedName": "Clear value in the text field '$obj'"
	},
	{
		"KeyowrdName": "Oracle_Click",
		"MappedName": "Click on '$obj'"
	},
	{
		"KeyowrdName": "Oracle_ClickButton",
		"MappedName": "Click on button '$obj'"
	},
	{
		"KeyowrdName": "Oracle_ClickImage",
		"MappedName": "Click on image '$obj'"
	},
	{
		"KeyowrdName": "Oracle_ClickMenu",
		"MappedName": "Click on menu '$obj'"
	},
	{
		"KeyowrdName": "Oracle_ClickMenuCheckBox",
		"MappedName": "Click on menu checkbox '$obj'"
	},
	{
		"KeyowrdName": "Oracle_ClickMenuItem",
		"MappedName": "Click on menu item '$obj'"
	},
	{
		"KeyowrdName": "Oracle_ClickMenuRadioButton",
		"MappedName": "Click on the menu radio button with name '$obj'"
	},
	{
		"KeyowrdName": "Oracle_ClickOnText",
		"MappedName": "Click on text '$obj'"
	},
	{
		"KeyowrdName": "Oracle_ClickTextArea",
		"MappedName": "Click on text area '$obj'"
	},
	{
		"KeyowrdName": "Oracle_ClickTextField",
		"MappedName": "Click on text field '$obj'"
	},
	{
		"KeyowrdName": "Oracle_CloseForm",
		"MappedName": "Close the form with title <$FormTitle> and index <$Index>"
	},
	{
		"KeyowrdName": "Oracle_DeSelectCheckBox",
		"MappedName": "Deselect checkbox '$obj'"
	},
	{
		"KeyowrdName": "Oracle_EBSCleanup",
		"MappedName": "Close all instances of Oracle Forms"
	},
	{
		"KeyowrdName": "Oracle_FindInLOV",
		"MappedName": "Find <$value> in the LOV '$obj'"
	},
	{
		"KeyowrdName": "Oracle_GetAllDropdownItem",
		"MappedName": "Get all item(s) of the dropdown '$obj'"
	},
	{
		"KeyowrdName": "Oracle_GetCheckBoxStatus",
		"MappedName": "Get status of checkbox '$obj'"
	},
	{
		"KeyowrdName": "Oracle_GetChildObjects",
		"MappedName": "Get child object(s) of the parent object '$obj'"
	},
	{
		"KeyowrdName": "Oracle_GetItemInList",
		"MappedName": "Get item from list '$obj' with index <$value>"
	},
	{
		"KeyowrdName": "Oracle_GetLabelText",
		"MappedName": "Get text of label '$obj'"
	},
	{
		"KeyowrdName": "Oracle_GetObjectExistence",
		"MappedName": "Validate whether '$obj' exists"
	},
	{
		"KeyowrdName": "Oracle_GetProperty",
		"MappedName": "Get property <$Property> of '$obj'"
	},
	{
		"KeyowrdName": "Oracle_GetRadioButtonStatus",
		"MappedName": "Get status of the radio button '$obj'"
	},
	{
		"KeyowrdName": "Oracle_GetSelectedDropdownItem",
		"MappedName": "Get selected item from dropdown '$obj'"
	},
	{
		"KeyowrdName": "Oracle_GetSelectedItemInList",
		"MappedName": "Get selected item from list '$obj'"
	},
	{
		"KeyowrdName": "Oracle_GetTextFromTextArea",
		"MappedName": "Get text from text area '$obj'"
	},
	{
		"KeyowrdName": "Oracle_GetTextFromTextField",
		"MappedName": "Get text from text field '$obj'"
	},
	{
		"KeyowrdName": "Oracle_GetWindowText",
		"MappedName": "Get text of window having window title <$WindowTitle> and index <$Index>"
	},
	{
		"KeyowrdName": "Oracle_HandlePopUp",
		"MappedName": "Handle Oracle Forms Java popup(s)"
	},
	{
		"KeyowrdName": "Oracle_IsTextPresentOnScreen",
		"MappedName": "Validate whether the text {&IIF(''$obj.DisplayValue'' = '' ,'<$Text to Search>' ,''$obj'')&} exists"
	},
	{
		"KeyowrdName": "Oracle_OpenDialog",
		"MappedName": "Click and open dialog '$obj'"
	},
	{
		"KeyowrdName": "Oracle_Output",
		"MappedName": "Return output value of '$obj'"
	},
	{
		"KeyowrdName": "Oracle_PressToolBarButton",
		"MappedName": "Press <$value> button on toolbar '$obj'"
	},
	{
		"KeyowrdName": "Oracle_ProcessState",
		"MappedName": "Wait <$TimeOut> second(s) for process <$ProcessName> to get complete with '$obj1' and button '$obj2'"
	},
	{
		"KeyowrdName": "Oracle_SelectCheckBox",
		"MappedName": "Select checkbox '$obj'"
	},
	{
		"KeyowrdName": "Oracle_SelectDropDownItem",
		"MappedName": "Select <$value> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "Oracle_SelectFromLov",
		"MappedName": "Select <$value> in LOV '$obj'"
	},
	{
		"KeyowrdName": "Oracle_SelectItemFromList",
		"MappedName": "Select <$value> in list '$obj'"
	},
	{
		"KeyowrdName": "Oracle_SelectRadioButton",
		"MappedName": "Select radio button '$obj'"
	},
	{
		"KeyowrdName": "Oracle_SelectTab",
		"MappedName": "Select tab '$obj'"
	},
	{
		"KeyowrdName": "Oracle_SyncForm",
		"MappedName": "Wait for Oracle form to load"
	},
	{
		"KeyowrdName": "Oracle_ToString",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Oracle_TypeTextInTextArea",
		"MappedName": "Enter <$value> in text area '$obj'"
	},
	{
		"KeyowrdName": "Oracle_TypeTextOnEditBox",
		"MappedName": "Enter <$value> in edit box '$obj'"
	},
	{
		"KeyowrdName": "Oracle_VerifyCheckBoxStatus",
		"MappedName": "Validate whether status is <$Value> of checkbox '$obj'"
	},
	{
		"KeyowrdName": "Oracle_VerifyLabelText",
		"MappedName": "Validate whether <$Value> is text of label '$obj'"
	},
	{
		"KeyowrdName": "Oracle_VerifyProperty",
		"MappedName": "Validate whether value is <$value> and property is <$property> of '$obj'"
	},
	{
		"KeyowrdName": "Oracle_VerifyRadioButtonStatus",
		"MappedName": "Validate whether status is <$Value> of the radio button '$obj'"
	},
	{
		"KeyowrdName": "Oracle_VerifyTextInTextArea",
		"MappedName": "Validate whether value <$value> is available in text area '$obj'"
	},
	{
		"KeyowrdName": "Oracle_VerifyTextInTextField",
		"MappedName": "Validate whether value <$value> is available in text field '$obj'"
	},
	{
		"KeyowrdName": "Oracle_WaitForOracleObject",
		"MappedName": "Wait <$Timeout> second(s) for '$obj'"
	},
	{
		"KeyowrdName": "Oracle_WaitForProperty",
		"MappedName": "Wait <$Timeout> second(s) for value <$value> and property <$Property> of '$obj'"
	},
	{
		"KeyowrdName": "Oracle_VerifyValue",
		"MappedName": "Validate whether value <$value> is available in '$obj'"
	},
	{
		"KeyowrdName": "Oracle_ClearCell",
		"MappedName": "Clear value in table '$obj' cell having column name <$Column> , row number <$Row>"
	},
	{
		"KeyowrdName": "Oracle_ClickCell",
		"MappedName": "Click in table '$obj' cell having column name <$column> , row number <$row>"
	},
	{
		"KeyowrdName": "Oracle_EnterCellValue",
		"MappedName": "Enter <$value> in table '$obj' cell having column name <$column> , row number <$row>"
	},
	{
		"KeyowrdName": "Oracle_GetCellChild",
		"MappedName": "Get child value of table '$obj' cell having column name <$Column> , row number <$Row>"
	},
	{
		"KeyowrdName": "Oracle_GetCellProperty",
		"MappedName": "Get property <$Property> value of table '$obj' cell having column name <$Column> , row number <$Row>"
	},
	{
		"KeyowrdName": "Oracle_GetCellType",
		"MappedName": "Get cell type of table '$obj' cell having column name <$Column> , row number <$Row>"
	},
	{
		"KeyowrdName": "Oracle_GetCellValue",
		"MappedName": "Get value of table '$obj' cell having column name <$Column> , row number <$Row>"
	},
	{
		"KeyowrdName": "Oracle_GetFullTableText",
		"MappedName": "Get complete data of table object '$obj'"
	},
	{
		"KeyowrdName": "Oracle_GetTableColumnCount",
		"MappedName": "Get column(s) count of table '$obj'"
	},
	{
		"KeyowrdName": "Oracle_GetTableColumnName",
		"MappedName": "Get column(s) name of table '$obj' having cell value <$Value> , row number <$Row>"
	},
	{
		"KeyowrdName": "Oracle_GetTableRowCount",
		"MappedName": "Get row(s) count of table '$obj'"
	},
	{
		"KeyowrdName": "Oracle_GetTableRowNumber",
		"MappedName": "Get row number of table '$obj' having column name <$Column> , cell value <$Value>"
	},
	{
		"KeyowrdName": "Oracle_IsCellEditable",
		"MappedName": "Validate whether table '$obj' cell having column name <$Column> , row number <$Row> is editable"
	},
	{
		"KeyowrdName": "Oracle_OpenDialogInTable",
		"MappedName": "Open dialog in table '$obj' cell having column name <$Column> , row number <$Row>"
	},
	{
		"KeyowrdName": "Oracle_SelectDropdownValueInTableCell",
		"MappedName": "Select <$ValueToSelect> in table '$obj' cell having column name <$Column> , row number <$Row>"
	},
	{
		"KeyowrdName": "Oracle_SetFocusToCell",
		"MappedName": "Set focus to table '$obj' cell having column name <$Column> , row number <$Row>"
	},
	{
		"KeyowrdName": "Oracle_VerifyCellProperty",
		"MappedName": "Validate whether value <$value> and property <$property> is available in table '$obj' cell having column name <$Column> , row number <$Row>"
	},
	{
		"KeyowrdName": "Oracle_VerifyCellValue",
		"MappedName": "Validate whether value <$value> is available in table '$obj' cell having column name <$Column> , row number <$Row>"
	},
	{
		"KeyowrdName": "Oracle_InitializeForm",
		"MappedName": "Initializing Oracle form"
	}
];

var coupaMapKeywords = [
	{
		"KeyowrdName": "Coupa_ClearEditField",
		"MappedName": "Clear value in the edit field with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_ClickButtonInTableCell",
		"MappedName": "Click on the button in table cell having column name/number <$ColumnName/Number> and row number <$RowNo> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_ClearEditFieldUsingText",
		"MappedName": "Clear value in the edit field with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "Coupa_Click",
		"MappedName": "Click on the object with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_ClickButton",
		"MappedName": "Click on the button with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_ClickByText",
		"MappedName": "Click on the object with text {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "Coupa_ClickImage",
		"MappedName": "Click on the image with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_ClickLink",
		"MappedName": "Click on the link with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_DeSelectCheckBox",
		"MappedName": "DeSelect the checkbox with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_DeSelectCheckBoxByText",
		"MappedName": "DeSelect the checkbox with the name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "Coupa_GetObjectExistence",
		"MappedName": "Check existence of the object with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_GetObjectText",
		"MappedName": "Get text of the object with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_GetObjectTextByLabel",
		"MappedName": "Get text of the object with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "Coupa_IsTextPresentOnScreen",
		"MappedName": "Validate whether the object with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}  is present on current web page"
	},
	{
		"KeyowrdName": "Coupa_MouseHover",
		"MappedName": "Hover mouse on the object with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_NavigateToWorkArea",
		"MappedName": "Navigate to work area with parent responsibility <$Parent Responsibility> and child responsibility <$Child Responsibility>"
	},
	{
		"KeyowrdName": "Coupa_SelectCheckBox",
		"MappedName": "Select the checkbox with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_SelectCheckBoxByText",
		"MappedName": "Select the checkbox with the name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "Coupa_SelectDropDownByText",
		"MappedName": "Select value <$ValueToSelect> in the dropdown with name {&IIF(''$obj.DisplayValue'' = '','<$DropdownLabel>',''$obj'')&}"
	},
	{
		"KeyowrdName": "Coupa_SelectDropDownItem",
		"MappedName": "Select value <$Item> in the dropdown with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_SelectFrame",
		"MappedName": "Select the iframe with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_SelectMultipleDropDownItem",
		"MappedName": "Select value(s) <$ItemString> in the dropdown with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_SelectPage",
		"MappedName": "Select page with page title <$PageTitle> and page header <$PageHeader>"
	},
	{
		"KeyowrdName": "Coupa_SelectRadioButton",
		"MappedName": "Select the radio button with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_SelectRadioButtonByText",
		"MappedName": "Select the radio button with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "Coupa_SelectWindow",
		"MappedName": "Select the browser window with title <$Title> and title index <$TitleIndex>"
	},
	{
		"KeyowrdName": "Coupa_SetDate",
		"MappedName": "Enter date <$TextToType> in the object with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "Coupa_SetMetaData",
		"MappedName": "Set metadata to module <$Module> and sub-module <$Sub-Module>"
	},
	{
		"KeyowrdName": "Coupa_TypeByText",
		"MappedName": "Enter value <$TextToType> in the object with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "Coupa_TypeByTextAndEnter",
		"MappedName": "Enter value <$TextToType> in the object with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&} and press Enter"
	},
	{
		"KeyowrdName": "Coupa_TypeTextAndEnterEditBox",
		"MappedName": "Enter value <$Value> in the editbox with name '$obj' and press Enter"
	},
	{
		"KeyowrdName": "Coupa_TypeTextAndEnterTextArea",
		"MappedName": "Enter value <$Value> in the text area with name '$obj' and press Enter"
	},
	{
		"KeyowrdName": "Coupa_TypeTextInTextArea",
		"MappedName": "Enter value <$Value> in the text area with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_TypeTextOnEditBox",
		"MappedName": "Enter value <$Value> in the editbox with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_VerifyObjectText",
		"MappedName": "Validate whether value <$Value> is available in the object with name '$obj' or not"
	},
	{
		"KeyowrdName": "Coupa_Wait",
		"MappedName": "Wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "Coupa_WaitForObject",
		"MappedName": "Wait <$Timeout> second(s) for the object with name '$obj'"
	},
	{
		"KeyowrdName": "Coupa_ClearTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_ClickImageInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_ClickLinkInTableCell",
		"MappedName": "Click on link in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "Coupa_ClickTableCell",
		"MappedName": "Click in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "Coupa_ClickTextInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_DeSelectCheckBoxInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_DoubleClickTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_GetCheckBoxStatusInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_GetColumnNameByRowNumber",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_GetObjectPropertyInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_GetRowNumberByColumnName",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_GetRowsCountHavingSameData",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_GetTableCellValue",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_GetTableColumnCount",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_GetTableColumnName/Number",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_GetTableColumnValue",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_GetTableRowCount",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_GetTableRowValue",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_GetTextCountInTableRow",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_HighlightTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_MouseHoverInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_SelectCheckBoxInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_SelectDropDownInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_SelectRadioButtonInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_TypeTextAndEnterInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_TypeTextInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_VerifyCheckBoxStatusInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "Coupa_VerifyTableCellValue",
		"MappedName": ""
	}
];

var msdynamicsMapKeywords = [
	{
		"KeyowrdName": "MSD_AuthenticatePopup",
		"MappedName": "Authenticate browser popup with username <$Username> and password <$Password>"
	},
	{
		"KeyowrdName": "MSD_ClearEditField",
		"MappedName": "Clear value in the edit field with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_ClearEditFieldUsingText",
		"MappedName": "Clear value in the edit field with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSD_ClearLOVByText",
		"MappedName": "Clear value in the LOV with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSD_Click",
		"MappedName": "Click on the object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_ClickButton",
		"MappedName": "Click on the button with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_ClickByText",
		"MappedName": "Click on the object with text {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSD_ClickImage",
		"MappedName": "Click on the image with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_ClickLink",
		"MappedName": "Click on the link with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_DeSelectCheckBox",
		"MappedName": "DeSelect the checkbox with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_DeSelectCheckBoxByText",
		"MappedName": "DeSelect the checkbox with the name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSD_GetObjectExistence",
		"MappedName": "Check existence of the object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_GetObjectText",
		"MappedName": "Get text of the object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_GetObjectTextByLabel",
		"MappedName": "Get text of the object with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSD_IsTextPresentOnScreen",
		"MappedName": "Validate whether the object with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}  is present on current web page"
	},
	{
		"KeyowrdName": "MSD_MouseHover",
		"MappedName": "Hover mouse on the object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_SearchAndSelect",
		"MappedName": "Search the object with name {&IIF(''$obj.DisplayValue'' = '','<$LabelName>',''$obj'')&} and select value with name <$TextToSearch>"
	},
	{
		"KeyowrdName": "MSD_SelectAvailableTimeSlot",
		"MappedName": "Select the available time slot"
	},
	{
		"KeyowrdName": "MSD_SelectCheckBox",
		"MappedName": "Select the checkbox with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_SelectCheckBoxByText",
		"MappedName": "Select the checkbox with the name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSD_SelectDropDownByText",
		"MappedName": "Select value <$ValueToSelect> in the dropdown with name {&IIF(''$obj.DisplayValue'' = '','<$DropdownLabel>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSD_SelectDropDownItem",
		"MappedName": "Select value <$Item> in the dropdown with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_SelectMultipleDropDownItem",
		"MappedName": "Select value(s) <$ItemString> in the dropdown with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_SelectRadioButton",
		"MappedName": "Select the radio button with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_SelectRadioButtonByText",
		"MappedName": "Select the radio button with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSD_SelectWindow",
		"MappedName": "Select the browser window with title <$Title> and title index <$TitleIndex>"
	},
	{
		"KeyowrdName": "MSD_TypeByText",
		"MappedName": "Enter value <$TextToType> in the object with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSD_TypeByTextAndEnter",
		"MappedName": "Enter value <$TextToType> in the object with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&} and press Enter"
	},
	{
		"KeyowrdName": "MSD_TypeTextAndEnterEditBox",
		"MappedName": "Enter value <$Value> in the editbox with name '$obj' and press Enter"
	},
	{
		"KeyowrdName": "MSD_TypeTextAndEnterTextArea",
		"MappedName": "Enter value <$Value> in the text area with name '$obj' and press Enter"
	},
	{
		"KeyowrdName": "MSD_TypeTextInTextArea",
		"MappedName": "Enter value <$Value> in the text area with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_TypeTextOnEditBox",
		"MappedName": "Enter value <$Value> in the editbox with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_VerifyObjectText",
		"MappedName": "Validate whether value <$Value> is available in the object with name '$obj' or not"
	},
	{
		"KeyowrdName": "MSD_Wait",
		"MappedName": "Wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "MSD_WaitForObject",
		"MappedName": "Wait <$Timeout> second(s) for the object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_ClearTableCell",
		"MappedName": "Clear value in table cell having column name <$ColumnName/Number> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_ClickImageInTableCell",
		"MappedName": "Click on the image in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_ClickLinkInTableCell",
		"MappedName": "Click on the link in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_ClickButtonInTableCell",
		"MappedName": "Click on the button in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_ClickTableCell",
		"MappedName": "Click in the table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_ClickTextInTableCell",
		"MappedName": "Click on the text <$TextToClick> in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_DeSelectCheckBoxInTableCell",
		"MappedName": "DeSelect the checkbox in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_GetCheckBoxStatusInTableCell",
		"MappedName": "Get status of the checkbox in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_GetColumnNameByRowNumber",
		"MappedName": "Get column name of the table having cell value <$CellValue> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_GetObjectPropertyInTableCell",
		"MappedName": "Get property of the object in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber>, object tag <$ObjectTag>, property name <$PropertyName> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_GetRowNumberByColumnName",
		"MappedName": "Get row number of the table having column name/number <$ColumnName/Number>, cell value <$CellValue> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_GetRowsCountHavingSameData",
		"MappedName": "Get row count with same data in table having column name/number <$ColumnName/Number>, identifier 1 <$Identifier1>, value 1 <$Value1> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_GetTableCellValue",
		"MappedName": "Get value of the table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_GetTableColumnCount",
		"MappedName": "Get count of the column in table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_GetTableColumnName/Number",
		"MappedName": "Get name or number of the column(s) in table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_GetTableColumnValue",
		"MappedName": "Get value of the table column column name/number <$ColumnName/Number> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_GetTableRowCount",
		"MappedName": "Get count of the row(s) in table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_GetTableRowValue",
		"MappedName": "Get value of the table row having row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_GetTextCountInTableColumn",
		"MappedName": "Get count of text <$TextToSearch> in table column having column name/number <$ColumnName/Number> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_GetTextCountInTableRow",
		"MappedName": "Get count of text <$TextToSearch> in table row having row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_HighlightTableCell",
		"MappedName": "Highlight the table cell having column name/number <$ColumnName/Number> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_MouseHoverInTableCell",
		"MappedName": "Hover mouse on the table cell having column name/number <$ColumnName/Number> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_SelectCheckBoxInTableCell",
		"MappedName": "Select the checkbox in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_SelectDropDownInTableCell",
		"MappedName": "Select the dropdown with value <$ValueToSelect> in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_SelectRadioButtonInTableCell",
		"MappedName": "Select the radio button in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_TypeTextAndEnterInTableCell",
		"MappedName": "Enter value <$ValueToType> and press Enter in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_TypeTextInTableCell",
		"MappedName": "Enter value <$ValueToType> in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_VerifyCheckBoxStatusInTableCell",
		"MappedName": "Validate whether status is <$ExpectedStatus> of the checkbox in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_VerifyTableCellValue",
		"MappedName": "Validate whether value <$ExpectedText> is available in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSD_SelectFrame",
		"MappedName": "Select iframe '$obj'"
	}
];

var msdynamicsFsoMapKeywords = [
	{
		"KeyowrdName": "MSDFSO_ClearEditField",
		"MappedName": "Clear value in the edit field with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_ClearEditFieldUsingText",
		"MappedName": "Clear value in the edit field with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSDFSO_Click",
		"MappedName": "Click on the object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_ClickButton",
		"MappedName": "Click on the button with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_ClickByText",
		"MappedName": "Click on the object with text {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSDFSO_ClickImage",
		"MappedName": "Click on the image with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_ClickLink",
		"MappedName": "Click on the link with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_DeSelectCheckBox",
		"MappedName": "DeSelect the checkbox with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_DeSelectCheckBoxByText",
		"MappedName": "DeSelect the checkbox with the name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSDFSO_GetObjectExistence",
		"MappedName": "Check existence of the object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_GetObjectText",
		"MappedName": "Get text of the object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_GetObjectTextByLabel",
		"MappedName": "Get text of the object with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSDFSO_IsTextPresentOnScreen",
		"MappedName": "Validate whether the object with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}  is present on current web page"
	},
	{
		"KeyowrdName": "MSDFSO_MouseHover",
		"MappedName": "Hover mouse on the object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_MouseHoverOnText",
		"MappedName": "Hover mouse on the text {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSDFSO_SelectCheckBox",
		"MappedName": "Select the checkbox with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_SelectCheckBoxByText",
		"MappedName": "Select the checkbox with the name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSDFSO_SelectDropDownByText",
		"MappedName": "Select value <$ValueToSelect> in the dropdown with name {&IIF(''$obj.DisplayValue'' = '','<$DropdownLabel>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSDFSO_SelectDropDownItem",
		"MappedName": "Select value <$Item> in the dropdown with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_SelectMultipleDropDownItem",
		"MappedName": "Select value(s) <$ItemString> in the dropdown with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_SelectRadioButton",
		"MappedName": "Select the radio button with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_SelectRadioButtonByText",
		"MappedName": "Select the radio button with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSDFSO_SelectWindow",
		"MappedName": "Select the browser window with title <$Title> and title index <$TitleIndex>"
	},
	{
		"KeyowrdName": "MSDFSO_TypeByText",
		"MappedName": "Enter value <$TextToType> in the object with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "MSDFSO_TypeByTextAndEnter",
		"MappedName": "Enter value <$TextToType> in the object with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&} and press Enter"
	},
	{
		"KeyowrdName": "MSDFSO_TypeTextAndEnterEditBox",
		"MappedName": "Enter value <$Value> in the editbox with name '$obj' and press Enter"
	},
	{
		"KeyowrdName": "MSDFSO_TypeTextAndEnterTextArea",
		"MappedName": "Enter value <$Value> in the text area with name '$obj' and press Enter"
	},
	{
		"KeyowrdName": "MSDFSO_TypeTextInTextArea",
		"MappedName": "Enter value <$Value> in the text area with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_TypeTextOnEditBox",
		"MappedName": "Enter value <$Value> in the editbox with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_VerifyObjectText",
		"MappedName": "Validate whether value <$Value> is available in the object with name '$obj' or not"
	},
	{
		"KeyowrdName": "MSDFSO_Wait",
		"MappedName": "Wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "MSDFSO_WaitForObject",
		"MappedName": "Wait <$Timeout> second(s) for the object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_ClearTableCell",
		"MappedName": "Clear value in table cell having column name <$ColumnName/Number> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_ClickImageInTableCell",
		"MappedName": "Click on the image in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_ClickLinkInTableCell",
		"MappedName": "Click on the link in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_ClickButtonInTableCell",
		"MappedName": "Click on the button in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_ClickTableCell",
		"MappedName": "Click in the table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_ClickTextInTableCell",
		"MappedName": "Click on the text <$TextToClick> in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_DeSelectCheckBoxInTableCell",
		"MappedName": "DeSelect the checkbox in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_GetCheckBoxStatusInTableCell",
		"MappedName": "Get status of the checkbox in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_GetColumnNameByRowNumber",
		"MappedName": "Get column name of the table having cell value <$CellValue> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_GetObjectPropertyInTableCell",
		"MappedName": "Get property of the object in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber>, object tag <$ObjectTag>, property name <$PropertyName> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_GetRowNumberByColumnName",
		"MappedName": "Get row number of the table having column name/number <$ColumnName/Number>, cell value <$CellValue> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_GetRowsCountHavingSameData",
		"MappedName": "Get row count with same data in table having column name/number <$ColumnName/Number>, identifier 1 <$Identifier1>, value 1 <$Value1> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_GetTableCellValue",
		"MappedName": "Get value of the table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_GetTableColumnCount",
		"MappedName": "Get count of the column in table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_GetTableColumnName/Number",
		"MappedName": "Get name or number of the column(s) in table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_GetTableColumnValue",
		"MappedName": "Get value of the table column column name/number <$ColumnName/Number> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_GetTableRowCount",
		"MappedName": "Get count of the row(s) in table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_GetTableRowValue",
		"MappedName": "Get value of the table row having row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_GetTextCountInTableColumn",
		"MappedName": "Get count of text <$TextToSearch> in table column having column name/number <$ColumnName/Number> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_GetTextCountInTableRow",
		"MappedName": "Get count of text <$TextToSearch> in table row having row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_HighlightTableCell",
		"MappedName": "Highlight the table cell having column name/number <$ColumnName/Number> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_MouseHoverInTableCell",
		"MappedName": "Hover mouse on the table cell having column name/number <$ColumnName/Number> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_SelectCheckBoxInTableCell",
		"MappedName": "Select the checkbox in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_SelectDropDownInTableCell",
		"MappedName": "Select the dropdown with value <$ValueToSelect> in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_SelectRadioButtonInTableCell",
		"MappedName": "Select the radio button in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_TypeTextAndEnterInTableCell",
		"MappedName": "Enter value <$ValueToType> and press Enter in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_TypeTextInTableCell",
		"MappedName": "Enter value <$ValueToType> in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_VerifyCheckBoxStatusInTableCell",
		"MappedName": "Validate whether status is <$ExpectedStatus> of the checkbox in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_VerifyTableCellValue",
		"MappedName": "Validate whether value <$ExpectedText> is available in table cell having column name/number <$ColumnName/Number>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "MSDFSO_SelectFrame",
		"MappedName": "Select iframe '$obj'"
	}
];


var workdayMappedKeywords = [
	{
		"KeyowrdName": "WD_Click",
		"MappedName": "Click on the object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_ClickButton",
		"MappedName": "Click on the button with name '$obj'"
	},
	{
		"KeyowrdName": "WD_ClickByText",
		"MappedName": "Click on the object with text {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "WD_ClickImage",
		"MappedName": "Click on the image with name '$obj'"
	},
	{
		"KeyowrdName": "WD_ClickLink",
		"MappedName": "Click on the link with name '$obj'"
	},
	{
		"KeyowrdName": "WD_DeSelectCheckBox",
		"MappedName": "DeSelect the checkbox with name '$obj'"
	},
	{
		"KeyowrdName": "WD_DeSelectCheckboxByText",
		"MappedName": "DeSelect the checkbox with the name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "WD_FindAndSelectLov",
		"MappedName": "Find and Select value <$ValueToSelect1> in the LOV with name {&IIF(''$obj.DisplayValue'' = '','<$LovLabel>',''$obj'')&}"
	},
	{
		"KeyowrdName": "WD_FindAndSelectMultipleLov",
		"MappedName": "Find and Select multiple value(s) <$ValueToSelect> in the LOV with name {&IIF(''$obj.DisplayValue'' = '','<$LovLabel>',''$obj'')&}"
	},
	{
		"KeyowrdName": "WD_GetChildObjectCount",
		"MappedName": "Get child count with attribute(s) <$Tag>, <$PropertyName> of the object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_GetObjectCount",
		"MappedName": "Get count of the object with attribute(s) <$AttributeName1>, <$AttributeValue1>"
	},
	{
		"KeyowrdName": "WD_GetObjectExistence",
		"MappedName": "Check existence of the object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_GetObjectProperty",
		"MappedName": "Get property <$Property> of the object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_GetObjectText",
		"MappedName": "Get text of the object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_GetObjectTextByLabel",
		"MappedName": "Get text of the object with name {&IIF(''$obj.DisplayValue'' = '','<$ObjectLabel>',''$obj'')&}"
	},
	{
		"KeyowrdName": "WD_MouseHover",
		"MappedName": "Hover mouse on the object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_MouseHoverOnText",
		"MappedName": "Hover mouse on the text {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "WD_SearchAndSelectLov",
		"MappedName": "Search and Select value <$ValueToSelect> in the LOV with name {&IIF(''$obj.DisplayValue'' = '','<$LovLabel>',''$obj'')&}"
	},
	{
		"KeyowrdName": "WD_SelectCheckBox",
		"MappedName": "Select the checkbox with name '$obj'"
	},
	{
		"KeyowrdName": "WD_SelectCheckboxByText",
		"MappedName": "Select the checkbox with the name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "WD_SelectDateAndTime",
		"MappedName": "Select date <$Date>, month <$Month>, year <$Year>, hour <$Hour>, minute <$Minute>, second <$Second> and daytime <$DayTime> in the  object with name {&IIF(''$obj.DisplayValue'' = '','<$TextSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "WD_SelectDateByText",
		"MappedName": "Select date <$Date> in the object with name {&IIF(''$obj.DisplayValue'' = '','<$DateLabel>',''$obj'')&}"
	},
	{
		"KeyowrdName": "WD_SelectDateFromCalendarView",
		"MappedName": "Select date <$DatetoSelect> from the calendar view"
	},
	{
		"KeyowrdName": "WD_SelectDropDownItem",
		"MappedName": "Select value <$Item> in the dropdown with name '$obj'"
	},
	{
		"KeyowrdName": "WD_SelectDropdownItemByText",
		"MappedName": "Select value <$ValueToSelect> in the dropdown with name {&IIF(''$obj.DisplayValue'' = '','<$DropdownLabel>',''$obj'')&}"
	},
	{
		"KeyowrdName": "WD_SelectFrame",
		"MappedName": "Select the iframe with name '$obj'"
	},
	{
		"KeyowrdName": "WD_SelectFromSuggestionList",
		"MappedName": "Select value <$ValueToSelect> from the suggestion list with name {&IIF(''$obj.DisplayValue'' = '','<$ValueToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "WD_SelectMultipleDropDownItem",
		"MappedName": "Select value(s) <$ItemString> in the dropdown with name '$obj'"
	},
	{
		"KeyowrdName": "WD_SelectRadioButton",
		"MappedName": "Select the radio button with name '$obj'"
	},
	{
		"KeyowrdName": "WD_SelectRadioButtonByText",
		"MappedName": "Select the radio button with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "WD_SelectWindow",
		"MappedName": "Select the browser window with title <$Title> and title index <$TitleIndex>"
	},
	{
		"KeyowrdName": "WD_SwitchToDefaultContent",
		"MappedName": "Switch to the default content"
	},
	{
		"KeyowrdName": "WD_TypeByText",
		"MappedName": "Enter value <$TextToType> in the object with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "WD_TypeTextAndEnterEditBox",
		"MappedName": "Enter value <$Value> in the editbox with name '$obj' and press Enter"
	},
	{
		"KeyowrdName": "WD_TypeTextAndEnterTextArea",
		"MappedName": "Enter value <$Value> in the text area with name '$obj' and press Enter"
	},
	{
		"KeyowrdName": "WD_TypeTextInPTagByText",
		"MappedName": "Enter value <$TextToType> in the object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_TypeTextInTextArea",
		"MappedName": "Enter value <$Value> in the text area with name '$obj'"
	},
	{
		"KeyowrdName": "WD_TypeTextOnEditBox",
		"MappedName": "Enter value <$Value> in the editbox with name '$obj'"
	},
	{
		"KeyowrdName": "WD_VerifyObjectEnabled",
		"MappedName": "Validate whether the object with name '$obj' is enabled or not"
	},
	{
		"KeyowrdName": "WD_VerifyObjectExists",
		"MappedName": "Validate whether the object with name '$obj' exists or not"
	},
	{
		"KeyowrdName": "WD_VerifyObjectPropertyValue",
		"MappedName": "Validate whether value <$PropertyName> is available in the object with name 'obj' or not"
	},
	{
		"KeyowrdName": "WD_VerifyObjectText",
		"MappedName": "Validate whether value <$Value> is available in the object with name '$obj' or not"
	},
	{
		"KeyowrdName": "WD_VerifyRadioButtonSelected",
		"MappedName": "Validate whether the radio button with name '$obj' is selected or not"
	},
	{
		"KeyowrdName": "WD_Wait",
		"MappedName": "Wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "WD_WaitForObject",
		"MappedName": "Wait <$Timeout> second(s) for the object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_ClearTableCell",
		"MappedName": "Clear value in table cell having column name <$ColumnName> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_ClickImageInTableCell",
		"MappedName": "Click on the image in table cell having column name <$ColumnName>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_ClickLinkInTableCell",
		"MappedName": "Click on the link in table cell having column name <$ColumnName>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_ClickTableCell",
		"MappedName": "Click in the table cell having column name <$ColumnName>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_ClickTextInTableCell",
		"MappedName": "Click on the text <$TextToClick> in table cell having column name <$ColumnName>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_ClickButtonInTableCell",
		"MappedName": "Click on the button in table cell having column name/number <$ColumnName/Number> and row number <$RowNo> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_DeSelectCheckBoxInTableCell",
		"MappedName": "DeSelect the checkbox in table cell having column name <$ColumnName>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_DoubleClickInTableCell",
		"MappedName": "Double click in the table cell having column name <$ColumnName>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_GetCheckBoxStatusInTableCell",
		"MappedName": "Get status of the checkbox in table cell having column name <$ColumnName>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_GetColumnNameByRowNumber",
		"MappedName": "Get column name of the table having cell value <$CellValue> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_GetObjectPropertyInTableCell",
		"MappedName": "Get property of the object in table cell having column name <$ColumnName>, row number <$RowNumber>, object tag <$ObjectTag>, property name <$PropertyName> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_GetRowNumberByColumnName",
		"MappedName": "Get row number of the table having column name <$ColumnName>, cell value <$CellValue> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_GetTableCellValue",
		"MappedName": "Get value of the table cell having column name <$ColumnName>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_GetTableColumnCount",
		"MappedName": "Get count of the column in table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_GetTableColumnName/Number",
		"MappedName": "Get name or number of the column(s) in table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_GetTableColumnValue",
		"MappedName": "Get value of the table column column name <$ColumnName> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_GetTableRowCount",
		"MappedName": "Get count of the row(s) in table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_GetTableRowValue",
		"MappedName": "Get value of the table row having row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_HighlightTableCell",
		"MappedName": "Highlight the table cell having column name <$ColumnName> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_MouseHoverInTableCell",
		"MappedName": "Hover mouse on the table cell having column name <$ColumnName> and row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_SearchAndSelectLOVInTableCell",
		"MappedName": "Search and select value <$ValueToSelect> in the LOV in table cell having column name <$ColumnName>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_SelectCheckBoxInTableCell",
		"MappedName": "Select the checkbox in table cell having column name <$ColumnName>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_SelectDateInTableCell",
		"MappedName": "Select date <$Date> in the table cell having column name <$ColumnName>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_SelectDropDownInTableCell",
		"MappedName": "Select the dropdown with value <$ValueToSelect> in table cell having column name <$ColumnName>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_SelectRadioButtonInTableCell",
		"MappedName": "Select the radio button in table cell having column name <$ColumnName>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_TypeTextAndEnterInTableCell",
		"MappedName": "Enter value <$ValueToType> and press Enter in table cell having column name <$ColumnName>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_TypeTextInTableCell",
		"MappedName": "Enter value <$ValueToType> in table cell having column name <$ColumnName>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_VerifyCheckBoxStatusInTableCell",
		"MappedName": "Validate whether status is <$ExpectedStatus> of the checkbox in table cell having column name <$ColumnName>, row number <$RowNumber> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "WD_VerifyTableCellValue",
		"MappedName": "Validate whether value <$ExpectedText> is available in table cell having column name <$ColumnName>, row number <$RowNumber> and table object with name '$obj'"
	}
];


var desktopMappedKeywords = [
	{
		"KeyowrdName": "Win_ClearEditField",
		"MappedName": "Clear value in edit field '$obj'"
	},
	{
		"KeyowrdName": "Win_Click",
		"MappedName": "Click on '$obj'"
	},
	{
		"KeyowrdName": "Win_ClickButton",
		"MappedName": "Click on button '$obj'"
	},
	{
		"KeyowrdName": "Win_ClickLink",
		"MappedName": "Click on the link with name '$obj'"
	},
	{
		"KeyowrdName": "Win_ClickButtonInGridCell",
		"MappedName": "Click on button in grid '$obj' cell having row index <$Row Index> and column index <$Column Index>"
	},
	{
		"KeyowrdName": "Win_ClickEditBox",
		"MappedName": "Click on edit box '$obj'"
	},
	{
		"KeyowrdName": "Win_ClickGridCell",
		"MappedName": "Click in grid '$obj' cell having row index <$Row Index> and column index <$Column Index>"
	},
	{
		"KeyowrdName": "Win_ClickHeaderItem",
		"MappedName": "Click on header item '$obj'"
	},
	{
		"KeyowrdName": "Win_ClickHyperlink",
		"MappedName": "Click on hyperlink '$obj'"
	},
	{
		"KeyowrdName": "Win_ClickHyperlinkInGridCell",
		"MappedName": "Click on hyperlink in grid '$obj' cell having row index <$Row Index> and column index <$Column Index>"
	},
	{
		"KeyowrdName": "Win_ClickImage",
		"MappedName": "Click on image '$obj'"
	},
	{
		"KeyowrdName": "Win_ClickMenuBar",
		"MappedName": "Click on menu bar '$obj'"
	},
	{
		"KeyowrdName": "Win_ClickTabItem",
		"MappedName": "Click on tab item '$obj'"
	},
	{
		"KeyowrdName": "Win_ClickText",
		"MappedName": "Click on text object '$obj'"
	},
	{
		"KeyowrdName": "Win_ClickThumb",
		"MappedName": "Click on thumb '$obj'"
	},
	{
		"KeyowrdName": "Win_ClickToolTip",
		"MappedName": "Click on tooltip '$obj'"
	},
	{
		"KeyowrdName": "Win_ClickButtonInTableCell",
		"MappedName": "Click on button in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "Win_ClickLinkInTableCell",
		"MappedName": "Click on link in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "Win_ClickTableCell",
		"MappedName": "Click in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "Win_Close",
		"MappedName": "Close the window '$obj'"
	},
	{
		"KeyowrdName": "Win_CloseApplication",
		"MappedName": "Close the current application"
	},
	{
		"KeyowrdName": "Win_DeselectCheckBox",
		"MappedName": "Deselect checkbox '$obj'"
	},
	{
		"KeyowrdName": "Win_DeselectCheckBoxInGridCell",
		"MappedName": "Deselect checkbox in grid '$obj' cell having row index <$Row Index> and column index <$Column Index>"
	},
	{
		"KeyowrdName": "Win_DoubleClick",
		"MappedName": "Double click on '$obj'"
	},
	{
		"KeyowrdName": "Win_GetChildObjectCount",
		"MappedName": "Get child object count of '$obj'"
	},
	{
		"KeyowrdName": "Win_GetChildObjectText",
		"MappedName": "Get child object text of '$obj'"
	},
	{
		"KeyowrdName": "Win_GetFullGridText",
		"MappedName": "Get full text from grid '$obj'"
	},
	{
		"KeyowrdName": "Win_GetGridCellText",
		"MappedName": "Get text from grid '$obj' cell having row index <$Row Index> and column index <$Column Index>"
	},
	{
		"KeyowrdName": "Win_GetGridColumnsCount",
		"MappedName": "Get column count of grid '$obj' having row index <$Row Index>"
	},
	{
		"KeyowrdName": "Win_TypeTextOnEditBox",
		"MappedName": "Enter value <$Value> in the editbox with name '$obj'"
	},
	{
		"KeyowrdName": "Win_TypeTextAndEnterEditBox",
		"MappedName": "Enter <$Value> in edit box '$obj' and press Enter"
	},
	{
		"KeyowrdName": "Win_TypeTextInTextArea",
		"MappedName": "Enter value <$Value> in the text area with name '$obj'"
	},
	{
		"KeyowrdName": "Win_TypeTextAndEnterTextArea",
		"MappedName": "Enter <$Value> in text area '$obj' and press Enter"
	},
	{
		"KeyowrdName": "Win_GetGridRowsCount",
		"MappedName": "Get row count of grid '$obj'"
	},
	{
		"KeyowrdName": "Win_GetObjectExistence",
		"MappedName": "Validate whether '$obj' exists or not"
	},
	{
		"KeyowrdName": "Win_GetObjectPropertyValue",
		"MappedName": "Get value of property <$Property Name>  from '$obj'"
	},
	{
		"KeyowrdName": "Win_GetObjectText",
		"MappedName": "Get text of '$obj'"
	},
	{
		"KeyowrdName": "Win_GetObjectValue",
		"MappedName": "Get value from '$obj'"
	},
	{
		"KeyowrdName": "Win_GetSingleGridColumnText",
		"MappedName": "Get text of single column from grid '$obj' having column index <$Column Index>"
	},
	{
		"KeyowrdName": "Win_GetSingleGridRowText",
		"MappedName": "Get text of single row from grid '$obj' having row index <$Row Index>"
	},
	{
		"KeyowrdName": "Win_LaunchApplication",
		"MappedName": "Launch the application from path <$Application Path>"
	},
	{
		"KeyowrdName": "Win_Maximize",
		"MappedName": "Maximize application window '$obj'"
	},
	{
		"KeyowrdName": "Win_Minimize",
		"MappedName": "Minimize application window '$obj'"
	},
	{
		"KeyowrdName": "Win_Resize",
		"MappedName": "Resize application window '$obj'"
	},
	{
		"KeyowrdName": "Win_Restore",
		"MappedName": "Restore application window '$obj'"
	},
	{
		"KeyowrdName": "Win_RightClick",
		"MappedName": "Right click on '$obj'"
	},
	{
		"KeyowrdName": "Win_ScrollThumb",
		"MappedName": "Scroll thumb to <$Set Percentage> percent of scroll bar '$obj'"
	},
	{
		"KeyowrdName": "Win_SelectCheckBox",
		"MappedName": "Select checkbox '$obj'"
	},
	{
		"KeyowrdName": "Win_SelectCheckBoxInGridCell",
		"MappedName": "Select checkbox in grid '$obj' cell having row index <$Row Index> and column index <$Column Index>"
	},
	{
		"KeyowrdName": "Win_SelectDropDownItem",
		"MappedName": "Select <$value> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "Win_SelectDropDownItemInGridCell",
		"MappedName": "Select \"\"Item\"\" in dropdown of grid '$obj' cell having row index <$Row Index> and column index <$Column Index>"
	},
	{
		"KeyowrdName": "Win_MouseHover",
		"MappedName": "Hover mouse on the object with name '$obj'"
	},
	{
		"KeyowrdName": "Win_SelectListItem",
		"MappedName": "Select item <$value> in list '$obj'"
	},
	{
		"KeyowrdName": "Win_SelectRadioButton",
		"MappedName": "Select radio button '$obj'"
	},
	{
		"KeyowrdName": "Win_SelectRadioButtonInGridCell",
		"MappedName": "Select radio button in grid '$obj' cell having row index <$Row Index> and column index <$Column Index>"
	},
	{
		"KeyowrdName": "Win_SelectTreeItem",
		"MappedName": "Select item <$value> in tree '$obj'"
	},
	{
		"KeyowrdName": "Win_SelectTreeViewItem",
		"MappedName": "Select item <$value> in tree view '$obj'"
	},
	{
		"KeyowrdName": "Win_SelectDropDownItem",
		"MappedName": "Select value <$Item> in the dropdown with name '$obj'"
	},
	{
		"KeyowrdName": "Win_TypeSecureText",
		"MappedName": "Enter secure value <$value> in edit box '$obj'"
	},
	{
		"KeyowrdName": "Win_TypeTextInGridCell",
		"MappedName": "Enter <$value> in grid '$obj' cell having row index <$Row Index> and column index <$Column Index>"
	},
	{
		"KeyowrdName": "Win_TypeTextOnEditBox",
		"MappedName": "Enter <$value> in edit box '$obj'"
	},
	{
		"KeyowrdName": "Win_VerifyGridCellText",
		"MappedName": "Validate whether text <$Expected Text> is present in grid '$obj' cell having row index <$Row Index> and column index <$Column Index>"
	},
	{
		"KeyowrdName": "Win_VerifyGridColumnCount",
		"MappedName": "Validate whether <$Expected Column Count> is column count of grid '$obj' having row index <$Row Index>"
	},
	{
		"KeyowrdName": "Win_VerifyGridRowCount",
		"MappedName": "Validate whether <$Expected Row Count> is row count of grid '$obj'"
	},
	{
		"KeyowrdName": "Win_VerifyObjectEnabled",
		"MappedName": "Validate whether '$obj' is enabled or not"
	},
	{
		"KeyowrdName": "Win_VerifyObjectExists",
		"MappedName": "Validate whether '$obj' exists or not"
	},
	{
		"KeyowrdName": "Win_VerifyObjectPropertyValue",
		"MappedName": "Validate whether <$Expected Property Value> is the expected value of property having property name <$Property Name> and table object with name '$obj'"
	},
	{
		"KeyowrdName": "Win_VerifyObjectText",
		"MappedName": "Validate whether text <$Expected Text> is available in  '$obj'"
	},
	{
		"KeyowrdName": "Win_VerifyObjectValue",
		"MappedName": "Validate whether value <$ExpectedValue> is available in '$obj'"
	},
	{
		"KeyowrdName": "Win_VerifyObjectVisible",
		"MappedName": "Validate whether '$obj' is visible"
	},
	{
		"KeyowrdName": "Win_SwitchExecutionMode",
		"MappedName": "Switch execution mode to <$Mode>"
	},
	{
		"KeyowrdName": "Win_WaitForWindow",
		"MappedName": "Wait for window having title <$Title>"
	},
	{
		"KeyowrdName": "Win_GetAllWindowTitles",
		"MappedName": "Get title(s) of all windows"
	},
	{
		"KeyowrdName": "Win_GetCurrentWindowTitle",
		"MappedName": "Get title of current window"
	},
	{
		"KeyowrdName": "Win_ClickByText",
		"MappedName": "Click on text <$TextToSearch>"
	},
	{
		"KeyowrdName": "Win_TypeByText",
		"MappedName": "Enter <$TextToType> in edit box with text <$TextToSearch>"
	},
	{
		"KeyowrdName": "Win_ClearEditFieldInGridCell",
		"MappedName": "\"Clear the edit field in grid cell having row index <$Row Index>"
	},
	{
		"KeyowrdName": "Win_GetCheckboxStatusInGridCell",
		"MappedName": "\"Get checkbox status in grid cell having row index <$Row Index>"
	},
	{
		"KeyowrdName": "Win_VerifyCheckboxStatusInGridCell",
		"MappedName": "\"Validate checkbox status in grid cell having row index <$Row Index>"
	},
	{
		"KeyowrdName": "Win_IsTextPresentOnScreen",
		"MappedName": "Validate whether text <$Text> is present on screen or not"
	},
	{
		"KeyowrdName": "Win_SelectFrame",
		"MappedName": "Select the iframe with name '$obj'"
	},
	{
		"KeyowrdName": "Win_Wait",
		"MappedName": "Wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "Win_WaitForObject",
		"MappedName": "Wait <$Timeout> second(s) for '$obj'"
	}
];
var serviceNowMappedKeywords = [
	{
		"KeyowrdName": "ServiceNow_ClearEditField",
		"MappedName": "Clear value in edit field '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_ClearEditFieldUsingText",
		"MappedName": "Clear value in edit field with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "ServiceNow_Click",
		"MappedName": "Click on '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_ClickButton",
		"MappedName": "Click on button '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_ClickByText",
		"MappedName": "Click on text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "ServiceNow_ClickImage",
		"MappedName": "Click on image '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_ClickLink",
		"MappedName": "Click on link '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_ClickButtonInTableCell",
		"MappedName": "Click on button in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "ServiceNow_DeSelectCheckBox",
		"MappedName": "Deselect checkbox '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_DeSelectCheckBoxByText",
		"MappedName": "Deselect checkbox with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&} "
	},
	{
		"KeyowrdName": "ServiceNow_GetObjectExistence",
		"MappedName": "Validate whether '$obj' exists or not"
	},
	{
		"KeyowrdName": "ServiceNow_GetObjectText",
		"MappedName": "Get text of '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_GetObjectTextByLabel",
		"MappedName": "Get value of label {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "ServiceNow_IsTextPresentOnScreen",
		"MappedName": "Validate whether text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&} exists"
	},
	{
		"KeyowrdName": "ServiceNow_MouseHover",
		"MappedName": "Hover mouse on '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_SelectCheckBox",
		"MappedName": "Select checkbox '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_SelectCheckBoxByText",
		"MappedName": "Select checkbox with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "ServiceNow_SelectDropDownByText",
		"MappedName": "Select <$ValueToSelect> in dropdown with text {&IIF(''$obj.DisplayValue'' = '' ,'<$DropdownLabel>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "ServiceNow_SelectDropDownItem",
		"MappedName": "Select <$Item> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_SelectFrame",
		"MappedName": "Select iframe '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_SelectMultipleDropDownItem",
		"MappedName": "Select multiple value(s) <$ItemString> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_SelectRadioButton",
		"MappedName": "Select radio button '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_SelectRadioButtonByText",
		"MappedName": "Select radio button with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "ServiceNow_SelectWindow",
		"MappedName": "Select browser window with title <$Title> and title index <$TitleIndex>"
	},
	{
		"KeyowrdName": "ServiceNow_TypeByText",
		"MappedName": "Enter <$TextToType> in edit box with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "ServiceNow_TypeByTextAndEnter",
		"MappedName": "Enter <$TextToType> in edit box with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&} and press Enter"
	},
	{
		"KeyowrdName": "ServiceNow_TypeTextAndEnterEditBox",
		"MappedName": "Enter <$Value> in edit box '$obj' and press Enter"
	},
	{
		"KeyowrdName": "ServiceNow_TypeTextAndEnterTextArea",
		"MappedName": "Enter <$Value> in text area '$obj' and press Enter"
	},
	{
		"KeyowrdName": "ServiceNow_TypeTextInTextArea",
		"MappedName": "Enter <$Value> in text area '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_TypeTextOnEditBox",
		"MappedName": "Enter <$Value> in edit box '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_VerifyObjectText",
		"MappedName": "Validate whether text <$Value> is available in '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_Wait",
		"MappedName": "Wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "ServiceNow_WaitForObject",
		"MappedName": "Wait <$Timeout> second(s) for '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_ClearTableCell",
		"MappedName": "Clear value in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_ClickImageInTableCell",
		"MappedName": "Click on image in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_ClickLinkInTableCell",
		"MappedName": "Click on link in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_ClickTableCell",
		"MappedName": "Click in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_DoubleClickTableCell",
		"MappedName": "Double click in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_GetCheckBoxStatusInTableCell",
		"MappedName": "Get checkbox status of table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_GetColumnNameByRowNumber",
		"MappedName": "Get column name of table '$obj' having cell value <$CellValue> and row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_GetObjectPropertyInTableCell",
		"MappedName": "Get property of object in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber> , object tag <$ObjectTag> , property name <$PropertyName>"
	},
	{
		"KeyowrdName": "ServiceNow_GetRowNumberByColumnName",
		"MappedName": "Get row number of table '$obj' having column name <$ColumnName> , cell value <$CellValue>"
	},
	{
		"KeyowrdName": "ServiceNow_GetTableCellValue",
		"MappedName": "Get value of table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_GetTableColumnCount",
		"MappedName": "Get column count of table '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_GetTableColumnName/Number",
		"MappedName": "Get column(s) name or number of table '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_GetTableColumnValue",
		"MappedName": "Get column value of table '$obj' having column name <$ColumnName>"
	},
	{
		"KeyowrdName": "ServiceNow_GetTableRowCount",
		"MappedName": "Get row(s) count of table '$obj'"
	},
	{
		"KeyowrdName": "ServiceNow_GetTableRowValue",
		"MappedName": "Get row value of table '$obj' having row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_HighlightTableCell",
		"MappedName": "Highlight cell of table '$obj'' having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_MouseHoverInTableCell",
		"MappedName": "Hover mouse on table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_SelectDropDownInTableCell",
		"MappedName": "Select dropdown with value <$ValueToSelect> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_SelectRadioButtonInTableCell",
		"MappedName": "Select radio button in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_TypeTextAndEnterInTableCell",
		"MappedName": "Enter <$ValueToType> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber> and press Enter"
	},
	{
		"KeyowrdName": "ServiceNow_TypeTextInTableCell",
		"MappedName": "Enter <$ValueToType> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_VerifyCheckBoxStatusInTableCell",
		"MappedName": "Validate whether status is <$ExpectedStatus> of checkbox in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_VerifyTableCellValue",
		"MappedName": "Validate whether <$ExpectedText> is available in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_DeSelectCheckBoxInTableCell",
		"MappedName": "Deselect checkbox in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_SelectCheckBoxInTableCell",
		"MappedName": "Select checkbox in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "ServiceNow_ClickTextInTableCell",
		"MappedName": "Click on text <$TextToClick> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	}
];

var sapFioriMapKeywords = [
	{
		"KeyowrdName": "SAPFiori_Click",
		"MappedName": "Click on '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_ClickButton",
		"MappedName": "Click on button '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_ClickByText",
		"MappedName": "Click on text {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SAPFiori_ClickImage",
		"MappedName": "Click on image '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_ClickLink",
		"MappedName": "Click on link '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_ClickTableCell",
		"MappedName": "Click in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "SAPFiori_ClickLinkInTableCell",
		"MappedName": "Click on link in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "SAPFiori_DeSelectCheckBox",
		"MappedName": "Deselect checkbox '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_Enter",
		"MappedName": "Press Enter key"
	},
	{
		"KeyowrdName": "SAPFiori_GetObjectExistence",
		"MappedName": "Validate whether '$obj' exists or not"
	},
	{
		"KeyowrdName": "SAPFiori_GetObjectText",
		"MappedName": "Get text of '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_MouseHover",
		"MappedName": "Hover mouse on '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_SelectCheckBox",
		"MappedName": "Select checkbox '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_SelectDropDownItem",
		"MappedName": "Select <$Item> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_SelectMultipleDropDownItem",
		"MappedName": "Select multiple value(s) <$ItemString> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_SelectFrame",
		"MappedName": "Select iframe '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_SelectRadioButton",
		"MappedName": "Select radio button '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_SelectWindow",
		"MappedName": "Select browser window with title <$Title> and title index <$TitleIndex>"
	},
	{
		"KeyowrdName": "SAPFiori_TypeByText",
		"MappedName": "Enter <$TextToType> in edit box with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "SAPFiori_TypeTextAndEnterEditBox",
		"MappedName": "Enter <$Value> in edit box '$obj' and press Enter"
	},
	{
		"KeyowrdName": "SAPFiori_TypeTextAndEnterTextArea",
		"MappedName": "Enter <$Value> in text area '$obj' and press Enter"
	},
	{
		"KeyowrdName": "SAPFiori_TypeTextInTextArea",
		"MappedName": "Enter <$Value> in text area '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_TypeTextOnEditBox",
		"MappedName": "Enter <$Value> in edit box '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_VerifyObjectText",
		"MappedName": "Validate whether text <$Value> is available in '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_Wait",
		"MappedName": "Wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "SAPFiori_WaitForObject",
		"MappedName": "Wait <$Timeout> second(s) for '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_SelectListItem",
		"MappedName": "Select <$Value> in list '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_ClearEditField",
		"MappedName": "Clear value in edit field '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_SearchAndSelect",
		"MappedName": "Search and Select <$TextToSearch> in {&IIF(''$obj.DisplayValue'' = '' ,'<$LabelName>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "SAPFiori_ClearTableCell",
		"MappedName": "Clear value in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "SAPFiori_ClickLinkInTableCell",
		"MappedName": "Click on link in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "SAPFiori_ClickTableCell",
		"MappedName": "Click in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "SAPFiori_ClickTextInTableCell",
		"MappedName": "Click on text <$TextToClick> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "SAPFiori_GetTableCellValue",
		"MappedName": "Get value of table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "SAPFiori_GetTableColumnCount",
		"MappedName": "Get column count of table '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_GetTableColumnValue",
		"MappedName": "Get column value of table '$obj' having column name <$ColumnName>"
	},
	{
		"KeyowrdName": "SAPFiori_GetTableRowCount",
		"MappedName": "Get row(s) count of table '$obj'"
	},
	{
		"KeyowrdName": "SAPFiori_GetTableRowValue",
		"MappedName": "Get row value of table '$obj' having row number <$RowNumber>"
	},
	{
		"KeyowrdName": "SAPFiori_SelectCheckBoxInTableCell",
		"MappedName": "Select checkbox in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "SAPFiori_SelectDropDownInTableCell",
		"MappedName": "Select dropdown with value <$ValueToSelect> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "SAPFiori_TypeTextAndEnterInTableCell",
		"MappedName": "Enter <$ValueToType> in table '$obj' cell having column name <$ColumnName/Number> , row number <$RowNumber> and press Enter"
	},
	{
		"KeyowrdName": "SAPFiori_TypeTextInTableCell",
		"MappedName": "Enter <$ValueToType> in table '$obj' cell having column name <$ColumnName/Number> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "SAPFiori_VerifyTableCellValue",
		"MappedName": "Validate whether <$ExpectedText> is available in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "SAPFiori_ClickButtonInTableCell",
		"MappedName": "Click on button in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	}
];

var SAPNetWeaverMapKeywords = [
	{
		"KeyowrdName": "SAPNW_ClearEditField",
		"MappedName": "Clear value in edit field '$obj'"
	},
	{
		"KeyowrdName": "SAPNW_ClearTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "SAPNW_Click",
		"MappedName": "Click on the object with name '$obj'"
	},
	{
		"KeyowrdName": "SAPNW_ClickButton",
		"MappedName": "Click on the button with name '$obj'"
	},
	{
		"KeyowrdName": "SAPNW_ClickByText",
		"MappedName": "Click on the object with text {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SAPNW_ClickImage",
		"MappedName": "Click on ` image with name '$obj'"
	},
	{
		"KeyowrdName": "SAPNW_ClickLink",
		"MappedName": "Click on the link with name '$obj'"
	},
	{
		"KeyowrdName": "SAPNW_ClickButtonInTableCell",
		"MappedName": "Click on button in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "SAPNW_ClickLinkInTableCell",
		"MappedName": "Click on link in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "SAPNW_ClickTableCell",
		"MappedName": "Click in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "SAPNW_ClickInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "SAPNW_ClickTextInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "SAPNW_DeSelectCheckBox",
		"MappedName": "DeSelect the checkbox with name '$obj'"
	},
	{
		"KeyowrdName": "SAPNW_GetObjectExistence",
		"MappedName": "Check existence of the object with name '$obj'"
	},
	{
		"KeyowrdName": "SAPNW_GetObjectText",
		"MappedName": "Get text of the object with name '$obj'"
	},
	{
		"KeyowrdName": "SAPNW_GetTableCellValue",
		"MappedName": ""
	},
	{
		"KeyowrdName": "SAPNW_GetTableColumnCount",
		"MappedName": ""
	},
	{
		"KeyowrdName": "SAPNW_GetTableColumnValue",
		"MappedName": ""
	},
	{
		"KeyowrdName": "SAPNW_GetTableRowCount",
		"MappedName": ""
	},
	{
		"KeyowrdName": "SAPNW_GetTableRowValue",
		"MappedName": ""
	},
	{
		"KeyowrdName": "SAPNW_MouseHover",
		"MappedName": "Hover mouse on the object with name '$obj'"
	},
	{
		"KeyowrdName": "SAPNW_SelectCheckBox",
		"MappedName": "Select the checkbox with name '$obj'"
	},
	{
		"KeyowrdName": "SAPNW_SelectCheckBoxInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "SAPNW_SelectDropDownInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "SAPNW_SelectDropDownItem",
		"MappedName": "Select value <$Item> in the dropdown with name '$obj'"
	},
	{
		"KeyowrdName": "SAPNW_SelectRadioButton",
		"MappedName": "Select the radio button with name '$obj'"
	},
	{
		"KeyowrdName": "SAPNW_SelectWindow",
		"MappedName": "Select the browser window with title <$Title> and title index <$TitleIndex>"
	},
	{
		"KeyowrdName": "SAPNW_TypeByText",
		"MappedName": "Enter value <$TextToType> in the object with name {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "SAPNW_TypeByTextAndEnter",
		"MappedName": "Enter value <$Value> in the input with name '$obj' and press Enter"
	},
	{
		"KeyowrdName": "SAPNW_TypeTextAndEnterInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "SAPNW_TypeTextAndEnterTextArea",
		"MappedName": "Enter value <$Value> in the text area with name '$obj' and press Enter"
	},
	{
		"KeyowrdName": "SAPNW_TypeTextInTableCell",
		"MappedName": ""
	},
	{
		"KeyowrdName": "SAPNW_TypeTextInTextArea",
		"MappedName": "Enter value <$Value> in the text area with name '$obj'"
	},
	{
		"KeyowrdName": "SAPNW_TypeTextOnEditBox",
		"MappedName": "Enter value <$Value> in the editbox with name '$obj'"
	},
	{
		"KeyowrdName": "SAPNW_VerifyObjectText",
		"MappedName": "Validate whether value <$Value> is available in the object with name '$obj' or not"
	},
	{
		"KeyowrdName": "SAPNW_VerifyTableCellValue",
		"MappedName": ""
	},
	{
		"KeyowrdName": "SAPNW_TypeTextAndEnterEditBox",
		"MappedName": "Enter <$Value> in edit box '$obj' and press Enter"
	},
	{
		"KeyowrdName": "SAPNW_Wait",
		"MappedName": "Wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "SAPNW_SelectFrame",
		"MappedName": "Select the iframe with name '$obj'"
	},
	{
		"KeyowrdName": "SAPNW_WaitForObject",
		"MappedName": "Wait <$Timeout> second(s) for the object with name '$obj'"
	}
];

var veevaVaultMappedKeywords = [
	{
		"KeyowrdName": "Veeva_ClearEditField",
		"MappedName": "Clear value in edit field '$obj'"
	},
	{
		"KeyowrdName": "Veeva_ClearEditFieldUsingText",
		"MappedName": "Clear value in edit field with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Veeva_Click",
		"MappedName": "Click on '$obj'"
	},
	{
		"KeyowrdName": "Veeva_ClickButton",
		"MappedName": "Click on button '$obj'"
	},
	{
		"KeyowrdName": "Veeva_ClickByText",
		"MappedName": "Click on text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Veeva_ClickImage",
		"MappedName": "Click on image '$obj'"
	},
	{
		"KeyowrdName": "Veeva_ClickLink",
		"MappedName": "Click on link '$obj'"
	},
	{
		"KeyowrdName": "Veeva_DeSelectCheckBox",
		"MappedName": "Deselect checkbox '$obj'"
	},
	{
		"KeyowrdName": "Veeva_DeSelectCheckBoxByText",
		"MappedName": "Deselect checkbox with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Veeva_GetObjectExistence",
		"MappedName": "Validate whether '$obj' exists or not"
	},
	{
		"KeyowrdName": "Veeva_GetObjectText",
		"MappedName": "Get text of '$obj'"
	},
	{
		"KeyowrdName": "Veeva_GetObjectTextByLabel",
		"MappedName": "Get value of label {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Veeva_IsTextPresentOnScreen",
		"MappedName": "Validate whether text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&} exists"
	},
	{
		"KeyowrdName": "Veeva_MouseHover",
		"MappedName": "Hover mouse on '$obj'"
	},
	{
		"KeyowrdName": "Veeva_SelectCheckBox",
		"MappedName": "Select checkbox '$obj'"
	},
	{
		"KeyowrdName": "Veeva_SelectCheckBoxByText",
		"MappedName": "Select checkbox with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Veeva_SelectDropDownItem",
		"MappedName": "Select <$Item> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "Veeva_SelectMultipleDropDownItem",
		"MappedName": "Select multiple value(s) <$ItemString> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "Veeva_SelectRadioButton",
		"MappedName": "Select radio button '$obj'"
	},
	{
		"KeyowrdName": "Veeva_SelectRadioButtonByText",
		"MappedName": "Select radio button with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Veeva_SelectWindow",
		"MappedName": "Select browser window with title <$Title> and title index <$TitleIndex>"
	},
	{
		"KeyowrdName": "Veeva_TypeByText",
		"MappedName": "Enter <$TextToType> in edit box with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Veeva_TypeByTextAndEnter",
		"MappedName": "Enter <$TextToType> in edit box with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&} and press Enter"
	},
	{
		"KeyowrdName": "Veeva_TypeTextAndEnterEditBox",
		"MappedName": "Enter <$Value> in edit box '$obj' and press Enter"
	},
	{
		"KeyowrdName": "Veeva_TypeTextAndEnterTextArea",
		"MappedName": "Enter <$Value> in text area '$obj' and press Enter"
	},
	{
		"KeyowrdName": "Veeva_TypeTextInTextArea",
		"MappedName": "Enter <$Value> in text area '$obj'"
	},
	{
		"KeyowrdName": "Veeva_TypeTextOnEditBox",
		"MappedName": "Enter <$Value> in edit box '$obj'"
	},
	{
		"KeyowrdName": "Veeva_VerifyObjectText",
		"MappedName": "Validate whether text <$Value> is available in '$obj'"
	},
	{
		"KeyowrdName": "Veeva_Wait",
		"MappedName": "Wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "Veeva_WaitForObject",
		"MappedName": "Wait <$Timeout> second(s) for '$obj'"
	},
	{
		"KeyowrdName": "Veeva_SelectDropDownByText",
		"MappedName": "Select <$ValueToSelect> in dropdown with text {&IIF(''$obj.DisplayValue'' = '' ,'<$DropdownLabel>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Veeva_ClearTableCell",
		"MappedName": "Clear value in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_ClickImageInTableCell",
		"MappedName": "Click on image in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_ClickLinkInTableCell",
		"MappedName": "Click on link in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_ClickTextInTableCell",
		"MappedName": "Click on text <$TextToClick> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_DeSelectCheckBoxInTableCell",
		"MappedName": "Deselect checkbox in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_GetCheckBoxStatusInTableCell",
		"MappedName": "Get checkbox status of table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_GetColumnNameByRowNumber",
		"MappedName": "Get column name of table '$obj' having cell value <$CellValue> and row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_GetRowsCountHavingSameData",
		"MappedName": "Get row(s) count with same data in table '$obj' having column name <$ColumnName> , identifier 1 <$Identifier1> , value 1 <$Value1>"
	},
	{
		"KeyowrdName": "Veeva_GetTableCellValue",
		"MappedName": "Get value of table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_GetTableColumnCount",
		"MappedName": "Get column count of table '$obj'"
	},
	{
		"KeyowrdName": "Veeva_GetTableColumnName/Number",
		"MappedName": "Get column(s) name or number of table '$obj'"
	},
	{
		"KeyowrdName": "Veeva_GetTableColumnValue",
		"MappedName": "Get column value of table '$obj' having column name <$ColumnName>"
	},
	{
		"KeyowrdName": "Veeva_GetTableRowCount",
		"MappedName": "Get row(s) count of table '$obj'"
	},
	{
		"KeyowrdName": "Veeva_GetTableRowValue",
		"MappedName": "Get row value of table '$obj' having row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_GetTextCountInTableColumn",
		"MappedName": "Get count of text <$TextToSearch> in column of table '$obj' having column number <$ColumnName>"
	},
	{
		"KeyowrdName": "Veeva_GetTextCountInTableRow",
		"MappedName": "Get count of text <$TextToSearch> in row of table '$obj' having row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_HighlightTableCell",
		"MappedName": "Highlight cell of table '$obj'' having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_MouseHoverInTableCell",
		"MappedName": "Hover mouse on table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_SelectCheckBoxInTableCell",
		"MappedName": "Select checkbox in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_SelectDropDownInTableCell",
		"MappedName": "Select dropdown with value <$ValueToSelect> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_SelectRadioButtonInTableCell",
		"MappedName": "Select radio button in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_TypeTextInTableCell",
		"MappedName": "Enter <$ValueToType> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_VerifyCheckBoxStatusInTableCell",
		"MappedName": "Validate whether status is <$ExpectedStatus> of checkbox in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_VerifyTableCellValue",
		"MappedName": "Validate whether <$ExpectedText> is available in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_TypeTextAndEnterInTableCell",
		"MappedName": "Enter <$ValueToType> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber> and press Enter"
	},
	{
		"KeyowrdName": "Veeva_MouseHoverOnText",
		"MappedName": "Hover mouse on text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Veeva_GetRowNumberByColumnName",
		"MappedName": "Get row number of table '$obj' having column name <$ColumnName> , cell value <$CellValue>"
	},
	{
		"KeyowrdName": "Veeva_ClickTableCell",
		"MappedName": "Click in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_GetObjectPropertyInTableCell",
		"MappedName": "Get property of object in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber> , object tag <$ObjectTag> , property name <$PropertyName>"
	},
	{
		"KeyowrdName": "Veeva_DoubleClickInTableCell",
		"MappedName": "Double click in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "Veeva_SearchAndSelect",
		"MappedName": "Search and Select value <$TextToSearch> in the object with name  {&IIF(''$obj.DisplayValue'' = '' ,'<$LabelName>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "Veeva_ClickButtonInTableCell",
		"MappedName": "Click on button in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "Veeva_SelectFrame",
		"MappedName": "Select iframe '$obj'"
	}
];

var mainframeMappedKeywords = [
	{
		"KeyowrdName": "MF_Enter",
		"MappedName": "Press Enter key"
	},
	{
		"KeyowrdName": "MF_SendTextOnObject",
		"MappedName": "Type <$Value> On '$obj'"
	},
	{
		"KeyowrdName": "MF_GetTextUsingObject",
		"MappedName": "Get Text Of '$obj'"
	},
	{
		"KeyowrdName": "MF_SetCursorOnObject",
		"MappedName": "Set Cursor On '$obj'"
	},
	{
		"KeyowrdName": "MF_DisconnectPS",
		"MappedName": "Disconnect Current Session"
	},
	{
		"KeyowrdName": "MF_ConnectPS_PCSHLL",
		"MappedName": "Connect to mainframe with session name '$obj'"
	},
	{
		"KeyowrdName": "MF_PressFunctionKey",
		"MappedName": "Press Function key <$Value>"
	}
];

var kronosMappedKeywords = [
	{
		"KeywordName": "KRONOS_ClearEditField",
		"MappedName": "Clear value in edit field '$obj'"
	},
	{
		"KeywordName": "KRONOS_ClearEditFieldUsingText",
		"MappedName": "Clear value in edit field with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeywordName": "KRONOS_Click",
		"MappedName": "Click on '$obj'"
	},
	{
		"KeywordName": "KRONOS_ClickButton",
		"MappedName": "Click on button '$obj'"
	},
	{
		"KeywordName": "KRONOS_ClickByText",
		"MappedName": "Click on text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeywordName": "KRONOS_ClickImage",
		"MappedName": "Click on image '$obj'"
	},
	{
		"KeywordName": "KRONOS_ClickLink",
		"MappedName": "Click on link '$obj'"
	},
	{
		"KeywordName": "KRONOS_DeSelectCheckBox",
		"MappedName": "Deselect checkbox '$obj'"
	},
	{
		"KeywordName": "KRONOS_DeSelectCheckBoxByText",
		"MappedName": "Deselect checkbox with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeywordName": "KRONOS_GetObjectExistence",
		"MappedName": "Validate whether '$obj' exists or not"
	},
	{
		"KeywordName": "KRONOS_GetObjectText",
		"MappedName": "Get text of '$obj'"
	},
	{
		"KeywordName": "KRONOS_GetObjectTextByLabel",
		"MappedName": "Get value of label {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeywordName": "Kronos_HoverAndGetText",
		"MappedName": "Hover mouse and get text of '$obj'"
	},
	{
		"KeywordName": "KRONOS_IsTextPresentOnScreen",
		"MappedName": "Validate whether text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&} exists"
	},
	{
		"KeywordName": "KRONOS_MouseHover",
		"MappedName": "Hover mouse on '$obj'"
	},
	{
		"KeywordName": "Kronos_RightClick",
		"MappedName": "Right click on '$obj'"
	},
	{
		"KeywordName": "KRONOS_SelectCheckBox",
		"MappedName": "Select checkbox '$obj'"
	},
	{
		"KeywordName": "KRONOS_SelectCheckBoxByText",
		"MappedName": "Select checkbox with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeywordName": "KRONOS_SelectDropDownByText",
		"MappedName": "Select <$ValueToSelect> in dropdown with text {&IIF(''$obj.DisplayValue'' = '' ,'<$DropdownLabel>' ,''$obj'')&}"
	},
	{
		"KeywordName": "KRONOS_SelectDropDownItem",
		"MappedName": "Select <$Item> in dropdown '$obj'"
	},
	{
		"KeywordName": "KRONOS_SelectFrame",
		"MappedName": "Select iframe '$obj'"
	},
	{
		"KeywordName": "KRONOS_SelectMultipleDropDownItem",
		"MappedName": "Select multiple value(s) <$ItemString> in dropdown $obj'"
	},
	{
		"KeywordName": "KRONOS_SelectRadioButton",
		"MappedName": "Select radio button '$obj'"
	},
	{
		"KeywordName": "KRONOS_SelectRadioButtonByText",
		"MappedName": "Select radio button with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeywordName": "KRONOS_SelectWindow",
		"MappedName": "Select browser window with title <$Title> and title index <$TitleIndex>"
	},
	{
		"KeywordName": "KRONOS_TypeByText",
		"MappedName": "Enter <$TextToType> in edit box with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeywordName": "KRONOS_TypeByTextAndEnter",
		"MappedName": "Enter <$TextToType> in edit box with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&} and press Enter"
	},
	{
		"KeywordName": "KRONOS_TypeTextAndEnterEditBox",
		"MappedName": "Enter <$Value> in edit box '$obj' and press Enter"
	},
	{
		"KeywordName": "KRONOS_TypeTextAndEnterTextArea",
		"MappedName": "Enter <$Value> in text area '$obj' and press Enter"
	},
	{
		"KeywordName": "KRONOS_TypeTextInTextArea",
		"MappedName": "Enter <$Value> in text area '$obj'"
	},
	{
		"KeywordName": "KRONOS_TypeTextOnEditBox",
		"MappedName": "Enter <$Value> in edit box '$obj'"
	},
	{
		"KeywordName": "KRONOS_VerifyObjectText",
		"MappedName": "Validate whether <$Value> is available in '$obj'"
	},
	{
		"KeywordName": "KRONOS_Wait",
		"MappedName": "Wait for <$Timeout> second(s)"
	},
	{
		"KeywordName": "KRONOS_WaitForObject",
		"MappedName": "Wait <$Timeout> second(s) for '$obj'"
	},
	{
		"KeywordName": "KRONOS_ClearTableCell",
		"MappedName": "Clear value in table '$obj' having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeywordName": "KRONOS_ClickImageInTableCell",
		"MappedName": "Click on image in table '$obj' having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeywordName": "KRONOS_ClickLinkInTableCell",
		"MappedName": "Click on link in table '$obj' having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeywordName": "KRONOS_ClickTableCell",
		"MappedName": "Click in table '$obj' having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeywordName": "KRONOS_ClickTextInTableCell",
		"MappedName": "Click on text <$TextToClick> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeywordName": "KRONOS_DeSelectCheckBoxInTableCell",
		"MappedName": "Deselect checkbox in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeywordName": "KRONOS_DoubleClickInTableCell",
		"MappedName": "Double click in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeywordName": "KRONOS_GetColumnNameByRowNumber",
		"MappedName": "Get column name of table '$obj' having cell value <$CellValue> and row number <$RowNumber>"
	},
	{
		"KeywordName": "KRONOS_GetObjectPropertyInTableCell",
		"MappedName": "Get property of object in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber> , object tag <$ObjectTag> , property name <$PropertyName>"
	},
	{
		"KeywordName": "KRONOS_GetRowNumberByColumnName",
		"MappedName": "Get row number of table '$obj' having column name <$ColumnName> , cell value <$CellValue>"
	},
	{
		"KeywordName": "KRONOS_GetTableCellValue",
		"MappedName": "Get value of table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeywordName": "KRONOS_GetTableColumnCount",
		"MappedName": "Get column count of table '$obj'"
	},
	{
		"KeywordName": "KRONOS_GetTableColumnName/Number",
		"MappedName": "Get column(s) name or number of table '$obj'"
	},
	{
		"KeywordName": "KRONOS_GetTableColumnValue",
		"MappedName": "Get column value of table '$obj' having column name <$ColumnName>"
	},
	{
		"KeywordName": "KRONOS_GetTableRowCount",
		"MappedName": "Get row(s) count of table '$obj'"
	},
	{
		"KeywordName": "KRONOS_GetTableRowValue",
		"MappedName": "Get row value of table '$obj' having row number <$RowNumber>"
	},
	{
		"KeywordName": "KRONOS_GetTextCountInTableColumn",
		"MappedName": "Get count of text <$TextToSearch> in column of table '$obj' having column number <$ColumnName>"
	},
	{
		"KeywordName": "KRONOS_GetTextCountInTableRow",
		"MappedName": "Get count of text <$TextToSearch> in row of table '$obj' having row number <$RowNumber>"
	},
	{
		"KeywordName": "KRONOS_HighlightTableCell",
		"MappedName": "Highlight cell of table '$obj'' having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeywordName": "KRONOS_MouseHoverInTableCell",
		"MappedName": "Hover mouse on table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeywordName": "Kronos_RightClickInTableCell",
		"MappedName": "Right click in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeywordName": "KRONOS_SelectCheckBoxInTableCell",
		"MappedName": "Select checkbox in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeywordName": "KRONOS_SelectDropDownInTableCell",
		"MappedName": "Select dropdown with value <$ValueToSelect> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeywordName": "KRONOS_SelectRadioButtonInTableCell",
		"MappedName": "Select radio button in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeywordName": "Kronos_TypeKeysInTableCellAndTab",
		"MappedName": "Enter keys <$ValueToType> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber> and press Tab"
	},
	{
		"KeywordName": "KRONOS_TypeTextAndEnterInTableCell",
		"MappedName": "Enter <$ValueToType> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber> and press Enter"
	},
	{
		"KeywordName": "KRONOS_TypeTextInTableCell",
		"MappedName": "Enter <$ValueToType> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeywordName": "KRONOS_ClickButtonInTableCell",
		"MappedName": "Click on button in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeywordName": "KRONOS_VerifyTableCellValue",
		"MappedName": "Validate whether <$ExpectedText> is available in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	}
];

var peoplesoftMappedKeywords = [
	{
		"KeyowrdName": "PS_ClearEditField",
		"MappedName": "Clear value in edit field '$obj'"
	},
	{
		"KeyowrdName": "PS_ClearEditFieldUsingText",
		"MappedName": "Clear value in edit field with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "PS_Click",
		"MappedName": "Click on '$obj'"
	},
	{
		"KeyowrdName": "PS_ClickButton",
		"MappedName": "Click on button '$obj'"
	},
	{
		"KeyowrdName": "PS_ClickByText",
		"MappedName": "Click on text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "PS_ClickImage",
		"MappedName": "Click on image '$obj'"
	},
	{
		"KeyowrdName": "PS_ClickLink",
		"MappedName": "Click on link '$obj'"
	},
	{
		"KeyowrdName": "PS_DeSelectCheckBox",
		"MappedName": "Deselect checkbox '$obj'"
	},
	{
		"KeyowrdName": "PS_DeSelectCheckBoxByText",
		"MappedName": "Deselect checkbox with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "PS_GetObjectExistence",
		"MappedName": "Validate whether '$obj' exists or not"
	},
	{
		"KeyowrdName": "PS_GetObjectText",
		"MappedName": "Get text of '$obj'"
	},
	{
		"KeyowrdName": "PS_GetObjectTextByLabel",
		"MappedName": "Get value of label {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "PS_IsTextPresentOnScreen",
		"MappedName": "Validate whether text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&} exists"
	},
	{
		"KeyowrdName": "PS_MouseHover",
		"MappedName": "Hover mouse on '$obj'"
	},
	{
		"KeyowrdName": "PS_SelectCheckBox",
		"MappedName": "Select checkbox '$obj'"
	},
	{
		"KeyowrdName": "PS_SelectCheckBoxByText",
		"MappedName": "Select checkbox with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "PS_SelectDropDownByText",
		"MappedName": "Select <$ValueToSelect> in dropdown with text {&IIF(''$obj.DisplayValue'' = '' ,'<$DropdownLabel>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "PS_SelectDropDownItem",
		"MappedName": "Select <$Item> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "PS_SelectFrame",
		"MappedName": "Select iframe '$obj'"
	},
	{
		"KeyowrdName": "PS_SelectListItem",
		"MappedName": "Select <$Value> in list item '$obj'"
	},
	{
		"KeyowrdName": "PS_SelectMultipleDropDownItem",
		"MappedName": "Select multiple value(s) <$ItemString> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "PS_SelectRadioButton",
		"MappedName": "Select radio button '$obj'"
	},
	{
		"KeyowrdName": "PS_SelectRadioButtonByText",
		"MappedName": "Select radio button with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "PS_SelectWindow",
		"MappedName": "Select browser window with title <$Title> and title index <$TitleIndex>"
	},
	{
		"KeyowrdName": "PS_SetDate",
		"MappedName": "Enter date <$TextToType> in date field {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "PS_TypeByText",
		"MappedName": "Enter <$TextToType> in edit field with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "PS_TypeByTextAndEnter",
		"MappedName": "Enter <$TextToType> in edit field with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&} and press Enter"
	},
	{
		"KeyowrdName": "PS_TypeByTextAndTab",
		"MappedName": "Enter <$TextToType> in  edit field with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&} and press Tab"
	},
	{
		"KeyowrdName": "PS_TypeTextAndEnterEditBox",
		"MappedName": "Enter <$Value> in the edit box '$obj' and press Enter"
	},
	{
		"KeyowrdName": "PS_TypeTextAndEnterTextArea",
		"MappedName": "Enter <$Value> in text area '$obj' and press Enter"
	},
	{
		"KeyowrdName": "PS_TypeTextInTextArea",
		"MappedName": "Enter <$Value> in text area '$obj'"
	},
	{
		"KeyowrdName": "PS_TypeTextOnEditBox",
		"MappedName": "Enter <$Value> in editbox '$obj'"
	},
	{
		"KeyowrdName": "PS_VerifyObjectText",
		"MappedName": "Validate whether value <$Value> is available in '$obj'"
	},
	{
		"KeyowrdName": "PS_Wait",
		"MappedName": "Wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "PS_WaitForObject",
		"MappedName": "Wait <$Timeout> second(s) for '$obj'"
	},
	{
		"KeyowrdName": "PS_ClearTableCell",
		"MappedName": "Clear value in table '$obj' cell having column name <$ColumnName/Number> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "PS_ClickImageInTableCell",
		"MappedName": "Click on image in table '$obj' cell having column name <$ColumnName/Number> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "PS_ClickLinkInTableCell",
		"MappedName": "Click on link in table '$obj' cell having column name <$ColumnName/Number> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "PS_ClickTableCell",
		"MappedName": "Click in table '$obj' cell having column name <$ColumnName/Number> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "PS_ClickTextInTableCell",
		"MappedName": "Click on text <$TextToClick> in table '$obj' cell having column name <$ColumnName/Number> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "PS_DeSelectCheckBoxInTableCell",
		"MappedName": "Deselect checkbox in table '$obj' cell having column name <$ColumnName/Number> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "PS_GetColumnNameByRowNumber",
		"MappedName": "Get column name of table '$obj' having cell value <$CellValue> and row number <$RowNumber>"
	},
	{
		"KeyowrdName": "PS_GetObjectPropertyInTableCell",
		"MappedName": "Get property of object in table '$obj' having column name/number <$ColumnName/Number> , row number <$RowNumber> , object tag <$ObjectTag> , property name <$PropertyName>"
	},
	{
		"KeyowrdName": "PS_GetRowNumberByColumnName",
		"MappedName": "Get row number of table '$obj' having column name/number <$ColumnName/Number> , cell value <$CellValue>"
	},
	{
		"KeyowrdName": "PS_GetTableCellValue",
		"MappedName": "Get value of table '$obj' cell having column name <$ColumnName/Number> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "PS_GetTableColumnCount",
		"MappedName": "Get column count of table '$obj'"
	},
	{
		"KeyowrdName": "PS_GetTableColumnNameORNumber",
		"MappedName": "Get column(s) name or number of table '$obj'"
	},
	{
		"KeyowrdName": "PS_GetTableColumnValue",
		"MappedName": "Get column value of table '$obj' having column name <$ColumnName/Number>"
	},
	{
		"KeyowrdName": "PS_GetTableRowCount",
		"MappedName": "Get row(s) count of table '$obj'"
	},
	{
		"KeyowrdName": "PS_GetTableRowValue",
		"MappedName": "Get row value of table '$obj' having row number <$RowNumber>"
	},
	{
		"KeyowrdName": "PS_GetTextCountInTableColumn",
		"MappedName": "Get count of text <$TextToSearch> in column of table '$obj' having column number <$ColumnName/Number>"
	},
	{
		"KeyowrdName": "PS_GetTextCountInTableRow",
		"MappedName": "Get count of text <$TextToSearch> in row of table '$obj' having row number <$RowNumber>"
	},
	{
		"KeyowrdName": "PS_HighlightTableCell",
		"MappedName": "Highlight cell of table '$obj'' having column name <$ColumnName/Number> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "PS_MouseHoverInTableCell",
		"MappedName": "Hover mouse on table '$obj' cell having column name <$ColumnName/Number> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "PS_SelectCheckBoxInTableCell",
		"MappedName": "Select checkbox in table '$obj' cell having column name <$ColumnName/Number> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "PS_SelectDropDownInTableCell",
		"MappedName": "Select dropdown with value <$ValueToSelect> in table '$obj' cell having column name <$ColumnName/Number> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "PS_SelectRadioButtonInTableCell",
		"MappedName": "Select radio button in table '$obj' cell having column name <$ColumnName/Number> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "PS_TypeTextAndEnterInTableCell",
		"MappedName": "Enter <$ValueToType> in table '$obj' cell having column name <$ColumnName/Number> , row number <$RowNumber> and press Enter"
	},
	{
		"KeyowrdName": "PS_TypeTextInTableCell",
		"MappedName": "Enter <$ValueToType> in table '$obj' cell having column name <$ColumnName/Number> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "PS_ClickButtonInTableCell",
		"MappedName": "Click on button in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "PS_VerifyTableCellValue",
		"MappedName": "Validate whether <$ExpectedText> is available in table '$obj' cell having column name <$ColumnName/Number> , row number <$RowNumber>"
	}
];

var jdeMappedKeywords = [
	{
		"KeyowrdName": "JDE_ClearEditField",
		"MappedName": "Clear value in edit field '$obj'"
	},
	{
		"KeyowrdName": "JDE_ClearEditFieldUsingText",
		"MappedName": "Clear value in edit field with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "JDE_Click",
		"MappedName": "Click on '$obj'"
	},
	{
		"KeyowrdName": "JDE_ClickByText",
		"MappedName": "Click on text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "JDE_ClickButton",
		"MappedName": "Click on button '$obj'"
	},
	{
		"KeyowrdName": "JDE_ClickImage",
		"MappedName": "Click on image '$obj'"
	},
	{
		"KeyowrdName": "JDE_ClickImageInTableCell",
		"MappedName": "Click on image in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_ClickLink",
		"MappedName": "Click on link '$obj'"
	},
	{
		"KeyowrdName": "JDE_DeSelectCheckBox",
		"MappedName": "DeSelect checkbox '$obj'"
	},
	{
		"KeyowrdName": "JDE_DeSelectCheckboxByText",
		"MappedName": "DeSelect checkbox with the text {&IIF(''$obj.DisplayValue'' = '','<$TextToSearch>',''$obj'')&}"
	},
	{
		"KeyowrdName": "JDE_GetObjectExistence",
		"MappedName": "Validate whether '$obj' exists or not"
	},
	{
		"KeyowrdName": "JDE_GetObjectText",
		"MappedName": "Get text of '$obj'"
	},
	{
		"KeyowrdName": "JDE_GetObjectTextByLabel",
		"MappedName": "Get value of label {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "JDE_IsTextPresentOnScreen",
		"MappedName": "Validate whether text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&} exists"
	},
	{
		"KeyowrdName": "JDE_SelectCheckBox",
		"MappedName": "Select checkbox '$obj'"
	},
	{
		"KeyowrdName": "JDE_SelectCheckBoxByText",
		"MappedName": "Select checkbox with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "JDE_TypeByText",
		"MappedName": "Enter <$TextToType> in edit box with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "JDE_TypeByTextAndEnter",
		"MappedName": "Enter <$TextToType> in edit box with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&} and press Enter"
	},
	{
		"KeyowrdName": "JDE_TypeTextAndEnterEditBox",
		"MappedName": "Enter <$Value> in edit box '$obj' and press Enter"
	},
	{
		"KeyowrdName": "JDE_TypeTextAndEnterTextArea",
		"MappedName": "Enter <$Value> in text area '$obj' and press Enter"
	},
	{
		"KeyowrdName": "JDE_TypeTextInTextArea",
		"MappedName": "Enter <$Value> in text area '$obj'"
	},
	{
		"KeyowrdName": "JDE_TypeTextOnEditBox",
		"MappedName": "Enter <$Value> in edit box '$obj'"
	},
	{
		"KeyowrdName": "JDE_TypeTextAndEnterTextArea",
		"MappedName": "Enter <$Value> in text area '$obj' and press Enter"
	},
	{
		"KeyowrdName": "JDE_SelectDropDownByText",
		"MappedName": "Select <$ValueToSelect> in dropdown with text {&IIF(''$obj.DisplayValue'' = '' ,'<$DropdownLabel>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "JDE_SelectDropDownItem",
		"MappedName": "Select <$Item> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "JDE_ClickButtonInTableCell",
		"MappedName": "Click on button in table '$obj' having row number <$Row Index> , column number <$Column Index>"
	},
	{
		"KeyowrdName": "JDE_ClickLinkInTableCell",
		"MappedName": "Click on link in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_ClickTableCell",
		"MappedName": "Click in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_ClickTextInTableCell",
		"MappedName": "Click on text <$TextToClick> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_SelectMultipleDropDownItem",
		"MappedName": "Select multiple value(s) <$ItemString> in dropdown '$obj'"
	},
	{
		"KeyowrdName": "JDE_SelectRadioButton",
		"MappedName": "Select radio button '$obj'"
	},
	{
		"KeyowrdName": "JDE_SelectRadioButtonByText",
		"MappedName": "Select radio button with text {&IIF(''$obj.DisplayValue'' = '' ,'<$TextToSearch>' ,''$obj'')&}"
	},
	{
		"KeyowrdName": "JDE_SelectCheckBox",
		"MappedName": "Select the checkbox with name '$obj'"
	},
	{
		"KeyowrdName": "JDE_DeSelectCheckBox",
		"MappedName": "DeSelect the checkbox with name '$obj'"
	},
	{
		"KeyowrdName": "JDE_MouseHover",
		"MappedName": "Hover mouse on '$obj'"
	},
	{
		"KeyowrdName": "JDE_SelectWindow",
		"MappedName": "Select browser window with title <$Title> and title index <$TitleIndex>"
	},
	{
		"KeyowrdName": "JDE_SelectFrame",
		"MappedName": "Select iframe '$obj'"
	},
	{
		"KeyowrdName": "JDE_VerifyObjectText",
		"MappedName": "Validate whether text <$Value> is available in '$obj'"
	},
	{
		"KeyowrdName": "JDE_Wait",
		"MappedName": "Wait for <$Timeout> second(s)"
	},
	{
		"KeyowrdName": "JDE_WaitForObject",
		"MappedName": "Wait <$Timeout> second(s) for '$obj'"
	},
	{
		"KeyowrdName": "JDE_ClearTableCell",
		"MappedName": "Clear value in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_DeSelectCheckBoxInTableCell",
		"MappedName": "Deselect checkbox in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_DoubleClickTableCell",
		"MappedName": "Double click in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_GetCheckBoxStatusInTableCell",
		"MappedName": "Get checkbox status of table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_GetColumnNameByRowNumber",
		"MappedName": "Get column name of table '$obj' having cell value <$CellValue> and row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_GetObjectPropertyInTableCell",
		"MappedName": "Get property of object in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber> , object tag <$ObjectTag> , property name <$PropertyName>"
	},
	{
		"KeyowrdName": "JDE_GetRowNumberByColumnName",
		"MappedName": "Get row number of table '$obj' having column name <$ColumnName> , cell value <$CellValue>"
	},
	{
		"KeyowrdName": "JDE_GetRowsCountHavingSameData",
		"MappedName": "Get row(s) count with same data in table '$obj' having column name <$ColumnName> , identifier 1 <$Identifier1> , value 1 <$Value1>"
	},
	{
		"KeyowrdName": "JDE_GetTableCellValue",
		"MappedName": "Get value of table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_GetTableColumnCount",
		"MappedName": "Get column count of table '$obj'"
	},
	{
		"KeyowrdName": "JDE_GetTableColumnName/Number",
		"MappedName": "Get column(s) name or number of table '$obj'"
	},
	{
		"KeyowrdName": "JDE_GetTableColumnValue",
		"MappedName": "Get column value of table '$obj' having column name <$ColumnName>"
	},
	{
		"KeyowrdName": "JDE_GetTableRowCount",
		"MappedName": "Get row(s) count of table '$obj'"
	},
	{
		"KeyowrdName": "JDE_GetTableRowValue",
		"MappedName": "Get row value of table '$obj' having row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_GetTextCountInTableColumn",
		"MappedName": "Get count of text <$TextToSearch> in column of table '$obj' having column number <$ColumnName>"
	},
	{
		"KeyowrdName": "JDE_GetTextCountInTableRow",
		"MappedName": "Get count of text <$TextToSearch> in row of table '$obj' having row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_HighlightTableCell",
		"MappedName": "Highlight cell of table '$obj'' having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_MouseHoverInTableCell",
		"MappedName": "Hover mouse on table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_SelectCheckBoxInTableCell",
		"MappedName": "Select checkbox in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_SelectDropDownInTableCell",
		"MappedName": "Select dropdown with value <$ValueToSelect> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_SelectRadioButtonInTableCell",
		"MappedName": "Select radio button in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_SelectRowsFromTable",
		"MappedName": "Select row(s) in table '$obj' having column name <$ColumnName> , row number <$RowNumbers>"
	},
	{
		"KeyowrdName": "JDE_TypeTextAndEnterInTableCell",
		"MappedName": "Enter <$ValueToType> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber> and press Enter"
	},
	{
		"KeyowrdName": "JDE_TypeTextInTableCell",
		"MappedName": "Enter <$ValueToType> in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_VerifyCheckBoxStatusInTableCell",
		"MappedName": "Validate whether status is <$ExpectedStatus> of checkbox in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	},
	{
		"KeyowrdName": "JDE_VerifyTableCellValue",
		"MappedName": "Validate whether <$ExpectedText> is available in table '$obj' cell having column name <$ColumnName> , row number <$RowNumber>"
	}
];

function getRawMappedName(_keywordName) {
	for (var i = 0; i < mapGenKeywords.length; i++) {
		var _keyWordMap = mapGenKeywords[i];
		if (_keyWordMap.KeyowrdName.toLowerCase() == _keywordName.toLowerCase()) {
			return _keyWordMap.MappedName;
		}
	}

	for (var i = 0; i < salesforceMapKeywords.length; i++) {
		var _keyWordMap = salesforceMapKeywords[i];
		if (_keyWordMap.KeyowrdName.toLowerCase() == _keywordName.toLowerCase()) {
			return _keyWordMap.MappedName;
		}
	}

	for (var i = 0; i < oraclefusionMapKeywords.length; i++) {
		var _keyWordMap = oraclefusionMapKeywords[i];
		if (_keyWordMap.KeyowrdName.toLowerCase() == _keywordName.toLowerCase()) {
			return _keyWordMap.MappedName;
		}
	}

	for (var i = 0; i < coupaMapKeywords.length; i++) {
		var _keyWordMap = coupaMapKeywords[i];
		if (_keyWordMap.KeyowrdName.toLowerCase() == _keywordName.toLowerCase()) {
			return _keyWordMap.MappedName;
		}
	}

	for (var i = 0; i < msdynamicsMapKeywords.length; i++) {
		var _keyWordMap = msdynamicsMapKeywords[i];
		if (_keyWordMap.KeyowrdName.toLowerCase() == _keywordName.toLowerCase()) {
			return _keyWordMap.MappedName;
		}
	}

	for (var i = 0; i < msdynamicsFsoMapKeywords.length; i++) {
		var _keyWordMap = msdynamicsFsoMapKeywords[i];
		if (_keyWordMap.KeyowrdName.toLowerCase() == _keywordName.toLowerCase()) {
			return _keyWordMap.MappedName;
		}
	}

	for (var i = 0; i < workdayMappedKeywords.length; i++) {
		var _keyWordMap = workdayMappedKeywords[i];
		if (_keyWordMap.KeyowrdName.toLowerCase() == _keywordName.toLowerCase()) {
			return _keyWordMap.MappedName;
		}
	}
	for (var i = 0; i < desktopMappedKeywords.length; i++) {
		var _keyWordMap = desktopMappedKeywords[i];
		if (_keyWordMap.KeyowrdName.toLowerCase() == _keywordName.toLowerCase()) {
			return _keyWordMap.MappedName;
		}
	}
	for (var i = 0; i < serviceNowMappedKeywords.length; i++) {
		var _keyWordMap = serviceNowMappedKeywords[i];
		if (_keyWordMap.KeyowrdName.toLowerCase() == _keywordName.toLowerCase()) {
			return _keyWordMap.MappedName;
		}
	}
	for (var i = 0; i < sapFioriMapKeywords.length; i++) {
		var _keyWordMap = sapFioriMapKeywords[i];
		if (_keyWordMap.KeyowrdName.toLowerCase() == _keywordName.toLowerCase()) {
			return _keyWordMap.MappedName;
		}
	}
	for (var i = 0; i < veevaVaultMappedKeywords.length; i++) {
		var _keyWordMap = veevaVaultMappedKeywords[i];
		if (_keyWordMap.KeyowrdName.toLowerCase() == _keywordName.toLowerCase()) {
			return _keyWordMap.MappedName;
		}
	}
	// for (var i = 0; i < oracleEBSMappedKeywords.length; i++) {
	// 	var _keyWordMap = oracleEBSMappedKeywords[i];
	// 	if (_keyWordMap.KeyowrdName.toLowerCase() == _keywordName.toLowerCase()) {
	// 		return _keyWordMap.MappedName;
	// 	}
	// }
	for (var i = 0; i < jdeMappedKeywords.length; i++) {
		var _keyWordMap = jdeMappedKeywords[i];
		if (_keyWordMap.KeyowrdName.toLowerCase() == _keywordName.toLowerCase()) {
			return _keyWordMap.MappedName;
		}
	}
	for (var i = 0; i < kronosMappedKeywords.length; i++) {
		var _keyWordMap = kronosMappedKeywords[i];
		if (_keyWordMap.KeywordName.toLowerCase() == _keywordName.toLowerCase()) {
			return _keyWordMap.MappedName;
		}
	}
	for (var i = 0; i < peoplesoftMappedKeywords.length; i++) {
		var _keyWordMap = peoplesoftMappedKeywords[i];
		if (_keyWordMap.KeyowrdName.toLowerCase() == _keywordName.toLowerCase()) {
			return _keyWordMap.MappedName;
		}
	}
	/*
	for (var i = 0; i < SAPNetWeaverMapKeywords.length; i++) {
		var _keyWordMap = SAPNetWeaverMapKeywords[i];
		if (_keyWordMap.KeyowrdName.toLowerCase() == _keywordName.toLowerCase()) {
			return _keyWordMap.MappedName;
		}
	}
	for (var i = 0; i < mainframeMappedKeywords.length; i++) {
		var _keyWordMap = mainframeMappedKeywords[i];
		if (_keyWordMap.KeyowrdName.toLowerCase() == _keywordName.toLowerCase()) {
			return _keyWordMap.MappedName;
		}
	}
	*/
	return "";
}


function switchToMappingRecorderMode() {
	var recordingMode = saas_object.GetGlobalSetting("RECORDING_MODE");

	if (recordingMode != null) {
		debugger
		var isopkeystudio = localStorage.getItem("ServerAppType") == "OPKEYSTUDIO";
		if (isopkeystudio == true && (recordingMode.indexOf("Web") > -1 || recordingMode.indexOf("Salesforce") > -1 || recordingMode.indexOf("Oracle Fusion") > -1 || recordingMode.indexOf("MSDynamics Recording") > -1 || recordingMode.indexOf("Coupa Recording") > -1 || recordingMode.indexOf("MSDynamics FSO Recording") > -1 || recordingMode.indexOf("Workday Recording") > -1 || recordingMode.indexOf("SAP Fiori Recording") > -1
			|| recordingMode.indexOf("Veeva Vault Recording") > -1 || recordingMode.indexOf("ServiceNow Recording") > -1 || recordingMode.indexOf("Kronos Recording") > -1 || recordingMode.indexOf("PeopleSoft Recording") > -1 || /*recordingMode.indexOf("Oracle EBS Recording") > -1 || */ recordingMode.indexOf("JDE Recording") > -1)) {
			$("#mainstepgrid").jqGrid('hideCol', ["Action", "Object", "Data"]);
			$("#mainstepgrid").jqGrid('showCol', ["#", "Steps"]);

			var gridWidth = $('.op-step-grid').innerWidth();
			$('#gbox_list_requisitos').css('width', gridWidth + 'px');
			$('#gview_list_requisitos').css('width', gridWidth + 'px');
			$('#gview_list_requisitos').css('width', gridWidth + 'px');
			$('.ui-state-default').css('width', gridWidth + 'px');
			$('.ui-jqgrid-hdiv').css('width', gridWidth + 'px');
			$('.ui-jqgrid-bdiv').css('width', gridWidth + 'px');
			$('#pager_requisitos').css('width', gridWidth + 'px');
			$("#mainstepgrid").addClass("stepGridTable");

		}
		else {
			$("#mainstepgrid").jqGrid('hideCol', ["#", "Steps"]);
			$("#mainstepgrid").jqGrid('showCol', ["Action", "Object", "Data"]);
			$("#mainstepgrid").removeClass("stepGridTable");
		}
	}

}




function initializeRecorderStepGrid() {
	var gridWidth = $('.op-step-grid').innerWidth();
	var colModelArray = [
		{
			name: "#",
			type: "text",
			hidden: true,
			editable: true,
			sortable: false
		},

		{
			name: "Action",
			type: "text",
			hidden: false,
			editable: true,
			sortable: false
		},
		{
			name: "Object",
			type: "text",
			hidden: false,
			editable: true,
			sortable: false
		},
		{
			name: "Data",
			type: "text",
			hidden: false,
			editable: true,
			sortable: false
		},
		{
			name: "ObjectData",
			type: "object",
			hidden: true,
			sortable: false
		},
		{
			name: "Steps",
			type: "text",
			hidden: true,
			sortable: false
		}
	];

	/*
	var recordingMode = saas_object.GetGlobalSetting("RECORDING_MODE");

	if (recordingMode != null) {
		if (recordingMode == "NORMAL" || recordingMode == "Salesforce") {
			colModelArray[0].hidden = true;
			colModelArray[1].hidden = true;
			colModelArray[2].hidden = true;
			colModelArray[3].hidden = true;
			colModelArray[4].hidden = true;
			colModelArray[5].hidden = false;
		}
	}*/

	$("#mainstepgrid").jqGrid({
		autoencode: false,
		width: gridWidth,
		height: 'auto',
		shrinkToFit: true,
		colModel: colModelArray,
		viewrecords: true,
	});
}




function getEditableComponent(_key, _value, _isEditable) {
	let _element = document.createElement("p12");
	_element.id = _key;
	_element.contentEditable = _isEditable;
	_element.innerText = _value;
	_element.style = "color:#007bff; font-weight: bold";

	return _element.outerHTML;
}
//icon IMPELEMENTATION @Mohit
function justCheckForIcons(_checkForIcons) {
	debugger;
	if (previousRecordingName == null) {
		console.log("here123 @mOHIT")
		previousRecordingName = saas_object.GetGlobalSetting("RECORDING_MODE");
	}
	else if (previousRecordingName != saas_object.GetGlobalSetting("RECORDING_MODE")) {
		console.log("here123 @mOHIT PART 2")
		previousRecordingName = saas_object.GetGlobalSetting("RECORDING_MODE");
		return true;
	}
	return false;
}
function addIconToKeyword(_keywordObject) {
	debugger;
	if (_keywordObject.includes("</i>")) {
		return _keywordObject;
	}
	var recordingMode_check = saas_object.GetGlobalSetting("RECORDING_MODE");

	if (recordingMode_check == "MSDynamics FSO Recording") {
		var _fso = `<i _ngcontent-pfe-c81="" class="oci oci-MsDynamicsFSO"></i>`
		_keywordObject = _fso + " " + _keywordObject;
	}
	if (recordingMode_check == "SAP Netweaver Recording") {
		var _sap = `<i _ngcontent-pfe-c81="" class="oci oci-SAPNetWeaver"></i>`;
		_keywordObject = _sap + " " + _keywordObject;
	}
	if (recordingMode_check == "MSDynamics Recording") {
		var _msdyn = `<i _ngcontent-pfe-c81="" class="oci oci-MsDynamicsFSO"></i>`
		_keywordObject = _msdyn + " " + _keywordObject;
	}
	if (recordingMode_check == "Oracle Fusion Recording") {
		var _oraclefusion = `<i _ngcontent-pfe-c81="" class="oci oci-Oracle"></i>`
		_keywordObject = _oraclefusion + " " + _keywordObject;
	}
	if (recordingMode_check == "Coupa Recording") {
		var _coupa = `<i _ngcontent-pfe-c81="" class="oci oci-Coupa"></i>`
		_keywordObject = _coupa + " " + _keywordObject;
	}
	if (recordingMode_check == "Salesforce Recording") {
		var _salesforce = `<i _ngcontent-pfe-c81="" class="oci oci-Salesforce"></i>`
		_keywordObject = _salesforce + " " + _keywordObject;
	}
	if (recordingMode_check == "Workday Recording") {
		var _workday = `<i _ngcontent-pfe-c81="" class="oci oci-Workday"></i>`
		_keywordObject = _workday + " " + _keywordObject;
	}
	if (recordingMode_check == "Oracle EBS Recording") {
		var _oraclefusion = `<i _ngcontent-pfe-c81="" class="oci oci-Oracle"></i>`
		_keywordObject = _oraclefusion + " " + _keywordObject;
	}
	// if (recordingMode_check == "PeopleSoft Recording") {
	// 	var _oraclefusion = `<i _ngcontent-pfe-c81="" class="oci oci-Oracle"></i>`
	// 	_keywordObject = _oraclefusion + " " + _keywordObject;
	// }
	// if (recordingMode_check == "Kronos Recording") {
	// 	var _oraclefusion = `<i _ngcontent-xpu-c81="" class="oci oci-Kronos" style=""></i>`
	// 	_keywordObject = _oraclefusion + " " + _keywordObject;
	// }
	// if (recordingMode_check == "SAPFiori Recording") {
	// 	var _oraclefusion = `<i _ngcontent-xpu-c81="" class="oci oci-SAPFiori" style=""></i>`
	// 	_keywordObject = _oraclefusion + " " + _keywordObject;
	// }

	return _keywordObject;
}
function addInputKeyUpListner() {
	$("p12").unbind().keyup(function (e) {
		//console.log(e);
		var _target = e.target;
		var _id = _target.id;
		var _innerText = _target.innerText;

		var current_row_id = 0;
		var selectedrow = _opkeyrecorder.getSelectedRowOfGrid("mainstepgrid");
		// _opkeyrecorder.deleteRowFromGrid("mainstepgrid",selectedrow);
		current_row_id = selectedrow;
		if (selectedrow != 0) {
			selectedrow--;
		}
		var step_object = _opkeyrecorder.allrecordedstepsarray[selectedrow];

		if (_id == "DataValue") {
			step_object.Data = _innerText;
		}
		else {
			let dataObject = JSON.parse(step_object.Data);
			Object.keys(dataObject).forEach(function (key) {
				if (key == _id) {
					dataObject[key] = _innerText;
				}
			});

			step_object.Data = JSON.stringify(dataObject);
		}

		var _sistatus = _opkeyrecorder.CheckForSingletonKeyword(step_object);
		_opkeyrecorder.allrecordedstepsarray[selectedrow] = step_object;
	});
}


function getMappedNameOfKeywordStep(_keywordObject) {
	var _action = _keywordObject["Action"];
	var _objectName = _keywordObject["Object"];
	var _data = _keywordObject["Data"];
	var _objectData = _keywordObject["ObjectData"];
	var mapName = getRawMappedName(_action);
	mapName = mapName.replace("{&IIF(''$obj.DisplayValue'' = '',", "");
	mapName = mapName.replace(",''$obj'')&}", "");
	if (_objectData != null) {
		Object.keys(_objectData).forEach(function (key) {
			mapName = mapName.replace("<$" + key + ">", "'" + getEditableComponent(key, _objectData[key], true) + "'");
		});
	}

	mapName = mapName.replace("$obj", "'" + getEditableComponent("Object", _objectName, false) + "'");
	if (_data.indexOf("{") == -1) {
		mapName = mapName.replace("<$Value>", "'" + getEditableComponent("DataValue", _data, true) + "'");
		mapName = mapName.replace("<$Item>", "'" + getEditableComponent("DataValue", _data, true) + "'");
		mapName = mapName.replace("<$Title>", "'" + getEditableComponent("DataValue", _data, true) + "'");
		mapName = mapName.replace("<$Application Path>", "'" + getEditableComponent("DataValue", _data, true) + "'");
		mapName = mapName.replace("<$Timeout>", "'" + getEditableComponent("DataValue", _data, true) + "'");
	}
	else {
		let dataObject = JSON.parse(_data);
		Object.keys(dataObject).forEach(function (key) {
			mapName = mapName.replace("<$" + key + ">", "'" + getEditableComponent(key, dataObject[key], true) + "'");
		});
	}
	if (mapName.includes("<$URL>")) {
		debugger;
		var mapName_forData = _data;
		if (mapName_forData != null && mapName_forData != '')
			mapName = mapName.replace("<$URL>", getEditableComponent("DataValue", mapName_forData, true));
	}
	if (mapName.includes("<$Timeout>")) {
		debugger;
		var mapName_forData = _data;
		if (mapName_forData != null && mapName_forData != '')
			mapName = mapName.replace("<$Timeout>", getEditableComponent("DataValue", mapName_forData, true));
	}
	if (mapName.includes("<$Row Index>") || mapName.includes("<$RowNo>") || mapName.includes("<$Column Index>") || mapName.includes("<$ColumnName/Number>") ||
		mapName.includes("<$ColumnName>") || mapName.includes("<$RowNumber>")) {
		mapName = mapName.replace("<$Row Index>", "''");
		mapName = mapName.replace("<$Column Index>", "''");
		mapName = mapName.replace("<$ColumnName/Number>", "''");
		mapName = mapName.replace("<$RowNo>", "''");
		mapName = mapName.replace("<$ColumnName>", "''");
		mapName = mapName.replace("<$RowNumber>", "''");
	}
	return mapName;
}