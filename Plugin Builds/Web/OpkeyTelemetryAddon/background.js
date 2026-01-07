var recordingsteps = null;
var currentallrecordedsteps = [];
var ebsRequestResponseList = [];
var cacheofrecordedsteps = [];
var spyanddomsdata = null;
var currentplybackdata = null;
var currenttabindex = 0;
var alltabsidandtitle = [];
var allpreviouslyopenedtabs = []
var currentopenedrecorderwindow = null;
var isPaused = false;

var canHighlight = false;
var recording_mode = "NORMAL";
var navigation_url = null;
var highlighted_index = -1;
var recording_page_window_id = -1;

var can_start_identifying_tabs = false;
var OBJECT_BASE64_IMAGE = "";
var current_navigate_window = -1;
var metadata_array_of_simplified_object = [];
var current_tab_title = "";
var simplified_field_objects_array = [];
var initiate_test_case_add = false;
var start_salesforce_metadata = -1;
var right_click_keyword_data = null;
var main_recorder_win_id = -1;
var current_salesforce_host_name = null;
var global_keyprefixes_array = [];
var current_session_id = "";
var is_anchor = false;
var current_host_reference = null;
var is_contextmenu_created = false;
var current_org_id = "";
var current_access_url = "";
var current_access_token = "";
var is_salesforce_recording = false;
var quick_list_actiondata = [];
var recording_page_changed = false;

var auth_token_acquired = false;
var iamgecropping_win_id = -1;
var image_cropping_fullpage_win_id = -1;
var aura_markup_xml = "";

var apex_markup_xml = "";

var oracle_fusion_object = "";

var WINDOW_CURRENT_IAMGE_BASE64 = "";

var opkey_stream = null;
var opkey_video_stream = null;
var BROWSER_OPENED_BY_OPKEY_E_RECORDER = -1;
var RECORDING_FROM_OPKEYERECORDER = false;

var opkey_divLocation = null;
var recorder_dockdata = null;
var recorder_dockcommand = null;
var recorder_dockcommand_temp = null;

var veeva_accessurl = "";
var veeva_username = "";
var veeva_password = "";

var recorder_steps_evolve = [];
var recorder_dockcommand_dock = null;

//var opkey_stream;
//var iamgecropping_win_id = -1;
var Local_store_data = null;
var videouploadstatus = "";
var videorecordereditorstatus = "";
var dockerShowing = false;
var last_dockerShowingStatus = false;
var qlm_desktopCaptureRequestId = -1;
var videoProcessingStatus = "";
var screenshotEnd = false;
var opkey_allImages = [];
var screenShotDirtCut;
var opkey_mediaRecorder = null;
var videoRecordStartTime = Date.now();
var videoRecordEndTime = Date.now();
var videoRecorderTimeArray = [];

var currentTabIdForAutoFl = -1;
var currentFocusedTabObject = null;
var opkeyOneManualBinding = null;

let current_pagesnapshot_mousehover = null;
let flagForJourneyTranscript = false;
let userGuideRecordingType = null;
createOffScreenDocuments();


chrome.action.onClicked.addListener(function (tab) {
	//StartRecorderAddon();
});

disableQlmManualAddonDocker();

function openAutoFlCreationUi() {
	chrome.windows.create({
		url: chrome.runtime.getURL("/AutoFLGenerator/UI/autoflui.html"),
		type: 'popup', // or 'normal'
		state: "maximized"
	}, function (win) {
		if (chrome.runtime.lastError) { }
		setTimeout(() => {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				if (tabs.length > 0) {
					chrome.tabs.sendMessage(tabs[0].id, { action: "hideButton" }, function (response) { });
				}
			});
		}, 1000);
	});
}

function createAutoFlMenu() {
	chrome.contextMenus.create({
		"title": "Generate Automatic Function Library",
		"contexts": ["all"],
		"id": "GENERATEAUTOMATICFL_MENU",
	});

	chrome.contextMenus.onClicked.addListener(function (object_clicked) {
		var clicked_object = object_clicked.menuItemId;
		if (clicked_object.indexOf("GENERATEAUTOMATICFL_MENU") > -1) {
			openAndGenerateAutoFl();
			return;
		}
	});
}

//createAutoFlMenu();


function openAndGenerateAutoFl() {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (tabs != null && tabs.length > 0) {
			currentTabIdForAutoFl = tabs[0].id;
			currentFocusedTabObject = tabs[0];
			debugger
			openAutoFlCreationUi();
		}
	});
}

function submitRecorderCommandToOpkey(bindingObject) {
	bindingObject = JSON.stringify(bindingObject);
	chrome.tabs.query({}, function (tabs) {
		for (var t_i = 0; t_i < tabs.length; t_i++) {
			if (tabs[t_i].url.indexOf("opkeyone")) {
				chrome.scripting.executeScript({
					target: { tabId: tabs[t_i].id },
					func: (bindingObject) => {
						localStorage.setItem("TESTDISCOVERY_COMMANDS_RECORDER", bindingObject);
					},
					args: [bindingObject]
				}, (results) => { });
			}
		}
	});
}

function turnOffManualRun() {
	chrome.tabs.query({}, function (tabs) {
		for (var t_i = 0; t_i < tabs.length; t_i++) {
			chrome.scripting.executeScript({
				target: { tabId: tabs[t_i].id },
				func: () => {
					localStorage_setItem("RemoveObiqManualExecutionData", "true");
				}
			}, (results) => { });

		}
	});
}

function enableQLMAddonIfLastEnabled() {
	if (last_dockerShowingStatus == true) {
		enableQlmManualAddonDocker();
	}
}
function setOpkeyVars() {
	localStorage_removeItem("OPKEY_DOMAIN_NAMES_ARRAY");
	localStorage_removeItem("VideoEditorStatus");
	var opkeyUrlArrays = [];
	chrome.tabs.query({}, function (tabs) {
		if (chrome.runtime.lastError) { }
		for (var ck = 0; ck < tabs.length; ck++) {
			var c_tab = tabs[ck];
			if (c_tab.url != null) {
				if (c_tab.url.indexOf(".opkeyone.com") > -1) {
					console.log(c_tab.url);
					let preurl = c_tab.url
					if (preurl.indexOf("sstsauth") > -1) {
						preurl = preurl.replace('sstsauth', 'myqlm')
					}
					var domain = new URL(preurl);
					var url = domain.protocol + "//" + domain.host;
					if (opkeyUrlArrays.indexOf(url) == -1) {
						opkeyUrlArrays.push(url);
					}
				}
			}

		}


		if (opkeyUrlArrays.length == 1) {
			localStorage_setItem("OPKEY_DOMAIN_NAME", opkeyUrlArrays[0]);
			localStorage_setItem("Domain", opkeyUrlArrays[0]);
			localStorage_setItem("OPKEY_DOMAIN_NAMES_ARRAY", JSON.stringify(opkeyUrlArrays));
		}
		else if (opkeyUrlArrays.length > 1) {
			localStorage_setItem("OPKEY_DOMAIN_NAMES_ARRAY", JSON.stringify(opkeyUrlArrays));
		}
	});
}

setOpkeyVars();

function injectQLMAddonInAllTabs() {
	setTimeout(function () {
		if (canHighlight == false && dockerShowing == true) {
			chrome.tabs.query({}, function (tabs) {
				if (chrome.runtime.lastError) { }
				for (var ck = 0; ck < tabs.length; ck++) {
					var c_tab = tabs[ck];
					if (c_tab != null && c_tab.status != null && c_tab.status == "complete") {
						if (c_tab.url != null && c_tab.url.indexOf("chrome://") == -1 && c_tab.url.indexOf("chrome-extension://") == -1 && c_tab.url.indexOf("edge://") == -1 && c_tab.url.indexOf("chrome-extension://") == -1 && c_tab.url.indexOf("about:") == -1) {
							injectQLMAddonJs(c_tab.id);
						}
					}
				}
			});
		}
		injectQLMAddonInAllTabs();
	}, 1000);

}

function injectVideoRecorderScripts(_type, callback) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		console.log(tabs);
		if (tabs.length == 0) {
			if (_type == "Image") {
				let error = { message: "Image capturing is not allowed on blank pages and browser pages. If any Chrome Devtools is open please close it." };
				videouploadstatus = "UPLOADATTACHMENTEORROR_" + JSON.stringify(error);
			}
			if (_type == "Video") {
				let error = { message: "Video capturing is not allowed on blank pages and browser pages. If any Chrome Devtools is open please close it." };
				videouploadstatus = "UPLOADATTACHMENTEORROR_" + JSON.stringify(error);
			}
			return;
		}
		if (tabs.length > 0) {
			if (tabs[0].url == null || tabs[0].url == "" || tabs[0].url.indexOf("chrome://") > -1 || tabs[0].url.indexOf("edge://") > -1 || tabs[0].url.indexOf("about:") > -1) {
				if (_type == "Image") {
					let error = { message: "Image capturing is not allowed on blank pages and browser pages" };
					videouploadstatus = "UPLOADATTACHMENTEORROR_" + JSON.stringify(error);
				}
				if (_type == "Video") {
					let error = { message: "Video capturing is not allowed on blank pages and browser pages" };
					videouploadstatus = "UPLOADATTACHMENTEORROR_" + JSON.stringify(error);
				}
				return;
			}
		}
		if (chrome.runtime.lastError) { }
		for (var ck = 0; ck < tabs.length; ck++) {
			var c_tab = tabs[ck];
			var _tabid = c_tab.id;
			if (c_tab.url != null && c_tab.url.indexOf("chrome.google.com/webstore") > -1) {
				if (_type == "Image") {
					let error = { message: "Image capturing is not allowed on blank pages and browser pages" };
					videouploadstatus = "UPLOADATTACHMENTEORROR_" + JSON.stringify(error);
					return;
				}
				if (_type == "Video") {
					let error = { message: "Video capturing is not allowed on blank pages and browser pages" };
					videouploadstatus = "UPLOADATTACHMENTEORROR_" + JSON.stringify(error);
					return;
				}
			}
			if (c_tab.url != null && c_tab.url.indexOf("microsoftedge.microsoft.com/addons") > -1) {
				if (_type == "Image") {
					let error = { message: "Image capturing is not allowed on blank pages and browser pages" };
					videouploadstatus = "UPLOADATTACHMENTEORROR_" + JSON.stringify(error);
					return;
				}
				if (_type == "Video") {
					let error = { message: "Video capturing is not allowed on blank pages and browser pages" };
					videouploadstatus = "UPLOADATTACHMENTEORROR_" + JSON.stringify(error);
					return;
				}
			}
			chrome.scripting.executeScript(
				{
					target: { tabId: _tabid, allFrames: false },
					func: function () {
						try {
							return opkey_qlmVideoEditorInjected();
						} catch (e) {
							// Handle the error if needed
						}
					},
				},
				(results) => {
					// Check if the results are null or if the function was not successfully injected
					if (results == null || (results.length == 1 && results[0].result == null)) {
						chrome.scripting.executeScript(
							{
								target: { tabId: _tabid, allFrames: false },
								files: ['ManualTcAndQLM/divinjector/videorecorderinjector.js'],
							},
							() => {
								callback();
							}
						);
					} else {
						callback();
					}
				}
			);

		}
	});
}

function injectQLMAddonJs(_tabid) {
	chrome.scripting.executeScript(
		{
			target: { tabId: _tabid, allFrames: false },
			func: function () {
				try {
					return opkey_qlmaddoninstalled();
				} catch (e) {
					// Handle the error if needed
				}
			},
		},
		function (results) {
			if (results == null || (results.length === 1 && results[0].result == null)) {
				chrome.scripting.executeScript(
					{
						target: { tabId: _tabid, allFrames: false },
						files: ['ManualTcAndQLM/divinjector/divinjector.js'],
					},
					function () {
						if (chrome.runtime.lastError) {
							console.error(chrome.runtime.lastError.message);
						}
					}
				);
			}
		}
	);
}


injectQLMAddonInAllTabs();

//injectAutoFlAddonInAllTabs();


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (canHighlight == false && dockerShowing == true) {
		if (changeInfo != null && changeInfo.status != null && changeInfo.status == "complete") {
			chrome.scripting.executeScript(
				{
					target: { tabId: tabId, allFrames: false },
					func: function () {
						try {
							return opkey_qlmaddoninstalled();
						} catch (e) {
							// Handle the error if needed
						}
					},
				},
				function (results) {
					// Check if the script injection was unsuccessful
					if (results == null || (results.length === 1 && results[0].result == null)) {
						chrome.scripting.executeScript(
							{
								target: { tabId: tabId, allFrames: false },
								files: ['ManualTcAndQLM/divinjector/divinjector.js'],
							},
							function () {
								if (chrome.runtime.lastError) {
									console.error(chrome.runtime.lastError.message);
								}

								if (dockerShowing === true) {
									chrome.scripting.executeScript(
										{
											target: { tabId: tabId, allFrames: true },
											func: () => {
												sessionStorage.setItem('OPKEY_QLMMANUALDOCKER_ENABLED', 'true');
											},
										},
										function () {
											if (chrome.runtime.lastError) {
												console.error(chrome.runtime.lastError.message);
											}
										}
									);
								}
							}
						);
					}
				}
			);

		}
	}
});

function sendFullPageScreenShotCall() {
	chrome.tabs.query({
		active: true, currentWindow: true
	}, (tabs) => {
		for (var ck = 0; ck < tabs.length; ck++) {
			var c_tab = tabs[ck];
			console.log(c_tab);
			chrome.tabs.sendMessage(c_tab.id, "TakeFullPageScreenShot");
		}
	});
}


chrome.tabs.query({}, function (tabs) {
	if (chrome.runtime.lastError) {
		console.error(chrome.runtime.lastError.message);
	}
	for (var ck = 0; ck < tabs.length; ck++) {
		var c_tab = tabs[ck];
		if (c_tab.title.includes("Opkey") || c_tab.url.includes("opkeyone123") || c_tab.title === "Opkey" ||
			c_tab.title.includes("Salesforce") || c_tab.title.includes("TestDiscovery") || c_tab.title.includes("Test Discovery")) {

			chrome.scripting.executeScript({
				target: { tabId: c_tab.id },
				files: ["js/jquery-3.6.1.js"]
			}, function (results) {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError.message);
				}
			});

			chrome.scripting.executeScript({
				target: { tabId: c_tab.id },
				files: ["js/recorder/addonexternalcommunicator.js"]
			}, function (results) {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError.message);
				}
			});
		}
	}
});



function closeOpKeyERecordingBrowser() {
	if (BROWSER_OPENED_BY_OPKEY_E_RECORDER > -1) {
		console.log("Closing Window " + BROWSER_OPENED_BY_OPKEY_E_RECORDER);
		chrome.windows.remove(BROWSER_OPENED_BY_OPKEY_E_RECORDER, function () {

		});
		BROWSER_OPENED_BY_OPKEY_E_RECORDER = -1;
	}
}

function navigateOpKeyERecordingBrowser(browser_url) {
	if (BROWSER_OPENED_BY_OPKEY_E_RECORDER > -1) {
		chrome.tabs.query({
			windowId: BROWSER_OPENED_BY_OPKEY_E_RECORDER
		}, function (tabs_inside_window) {
			for (var tab_index = 0; tab_index < tabs_inside_window.length; tab_index++) {
				var tab_of_window = tabs_inside_window[tab_index];
				chrome.tabs.update(tab_of_window.id, {
					url: browser_url
				}, function (response) { });
				break;
			}
		});
	}
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

var parent_object_array = new Array();

function GetNestedParent(parent_object) {
	parent_object_array.push(parent_object);
	if (parent_object["parent"] != null) {
		GetNestedParent(parent_object["parent"]);
	}
	return parent_object_array;
};

function GetParentXml(parent_object) {
	var parent_xml = "<ParentProperties>";
	$.each(parent_object, function (key, value) {
		if (value != null) {
			key = capitalizeFirstLetter(key);
			parent_xml += "<" + key + "><![CDATA[" + value + "]]></" + key + ">";
		}
	})
	parent_xml += "</ParentProperties>";
	return parent_xml;
}

function GetParentHierarchy(parent_object) {
	parent_object_array = new Array();
	var parent_hierarchy = "<?xml version='1.0'?><ArrayOfParentProperties xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>";
	if (parent_object["parent"] != null) {
		if (parent_object["parent"].toString().indexOf("ArrayOfParentProperties") == -1) {
			var parents_array = GetNestedParent(parent_object["parent"]);
			for (var parent_index = 0; parent_index < parents_array.length; parent_index++) {
				var parent_node = parents_array[parent_index];
				parent_node["parent"] = null;
				var parent_xml = GetParentXml(parent_node);
				parent_hierarchy += parent_xml;
			}
			parent_hierarchy += "</ArrayOfParentProperties>";
			return parent_hierarchy;
		}
	}
	return null;
}

function formatRecorderStepArray(allRecordedSteps) {
	var outArray = [];
	for (var dvi = 0; dvi < allRecordedSteps.length; dvi++) {
		var recorderStepString = allRecordedSteps[dvi];
		var recordedStepObject = JSON.parse(recorderStepString);
		if (recordedStepObject["arguments"] != null) {
			if (recordedStepObject["arguments"][0] != null) {
				if (recordedStepObject["arguments"][0]["parent"] != null) {
					var parentObject = recordedStepObject["arguments"][0]["parent"];
					var parentHierarchy = GetParentHierarchy(parentObject);
					if (parentHierarchy != null) {
						parentObject["parent"] = parentHierarchy;
					}
				}
			}
		}
		outArray[dvi] = recordedStepObject;
	}
	return outArray;
}

var startOpKeyERecorderThread = -1;



function setRecordingModeForOpKeyE(_recordingMode) {
	//console.log("Recording Mode "+_recordingMode);
}

var opkeystudiocommandgenerationthread = -1;


function processCommandFetched(command_fetched) {
	try {
		var command_object = JSON.parse(command_fetched);
		if (command_object.command === "CLOSEBROWSER") {
			canHighlight = false;
			closeOpKeyERecordingBrowser();
		}
		if (command_object.command === "NAVIGATEBROWSER") {
			var currentUrl = command_object.data;
			navigateOpKeyERecordingBrowser(currentUrl);
		}

		if (command_object.command === "SETPIVOT") {
			is_anchor = true;
			chrome.runtime.sendMessage({
				setAnchor: "setAnchor"
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
		}

		if (command_object.command === "RESETPIVOT") {
			is_anchor = false;
			chrome.runtime.sendMessage({
				resetAnchor: "resetAnchor"
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
		}

		if (command_object.command === "SETHIGHLIGHT") {
			canHighlight = true;
		}

		if (command_object.command === "RESETHIGHLIGHT") {
			canHighlight = false;
		}

		if (command_object.command === "SETHIGHLIGHTPOSITION") {
			highlighted_index = command_object.data;
			highlightOnBrowser(highlighted_index);
		}

		if (command_object.command === "SETRECORDINGMODE") {
			canHighlight = true;
			isPaused = false;
			currentallrecordedsteps = [];
			var rmode = command_object.data;
			recording_mode = rmode;
			chrome.runtime.sendMessage({
				setRecordingMode: rmode
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
		}

		if (command_object.command === "RESETALLDATA") {
			currentallrecordedsteps = [];
		}
	} catch (e) { }
}

function highlightOnBrowser(index_0) {
	if (BROWSER_OPENED_BY_OPKEY_E_RECORDER != null) {
		if (BROWSER_OPENED_BY_OPKEY_E_RECORDER != -1) {
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
}

var opkeyethreadstarted = false;

function GetFusionMetadataObjects() {
	return all_fusion_metadata;
}


chrome.runtime.onMessage.addListener(function (e) {
	switch (e.action) {
		//  case "grab": self.grab(); break;
		case "screenshotVisibleArea": opkey_screenshotVisibleArea(e.shared); break;
		case "screenshotEnd": opkey_screenshotEnd(e.shared); break;
	}
});

var notificationInvoked = false;
var notificationid = null;
var _inc = 0;
function opkey_screenshotBegin(shared) {
	videouploadstatus = "INPROGRESS";
	if (notificationInvoked == false) {
		notificationInvoked = true;
		chrome.notifications.create(createUUID(), {
			type: 'basic',
			iconUrl: 'icons/addon128.png',
			title: "Opkey",
			message: "Image Capture is in progress!",
			priority: 2
		}, function (id) {
			notificationid = id;
		});
	}
	sendMessageToActiveTab({ action: 'screenshotBegin', shared: shared });
}

function opkey_screenshotVisibleArea(shared) {
	videouploadstatus = "INPROGRESS";
	if (currentFocusedTabForImage != -1) {
		chrome.tabs.update(currentFocusedTabForImage, {
			active: true
		}, function (callback) {
			if (chrome.runtime.lastError) {
				opkey_screenshotVisibleArea(shared)
				return;
			}
			chrome.tabs.captureVisibleTab(null, { format: "png" /* png, jpeg */, quality: 80 }, function (dataUrl) {
				if (chrome.runtime.lastError) {
					opkey_screenshotVisibleArea(shared)
					return;
				}
				if (dataUrl) {
					opkey_allImages.push(dataUrl);
					opkey_screenshotScroll(shared);
				}
			});
		})
	}
}

function opkey_screenshotVisibleAreaNoScroll(shared) {
	videouploadstatus = "INPROGRESS";
	if (currentFocusedTabForImage != -1) {
		chrome.tabs.update(currentFocusedTabForImage, {
			active: true
		}, function (callback) {

			if (callback != null && callback.url.indexOf("file:") > -1) {
				openImageCaptureForOtherTabs();
				return;
			}
			if (chrome.runtime.lastError) {
				opkey_screenshotVisibleAreaNoScroll(shared)

				return;
			}

			chrome.tabs.captureVisibleTab(null, { format: "png" /* png, jpeg */, quality: 80 }, function (dataUrl) {

				if (chrome.runtime.lastError) {
					opkey_screenshotVisibleAreaNoScroll(shared)
					return;
				}
				if (dataUrl) {
					opkey_allImages.push(dataUrl);
					opkey_screenshotEnd(shared);
				}
			});
		})
	}
}

async function opkey_screenshotEnd(shared) {
	if (notificationid != null) {
		chrome.notifications.clear(notificationid);
	}
	_inc = 0;
	notificationInvoked = false;
	notificationid = null;

	let imageData = await sendMessageToOffscreenScript("offscreen_recursiveImageMerge_helper", { "imageDataURLs": opkey_allImages, "imageDirtyCutAt": shared.imageDirtyCutAt, "hasVscrollbar": shared.tab.hasVscrollbar });
	debugger
	if (imageData != null) {
		opkey_allImages = [];
		WINDOW_CURRENT_IAMGE_BASE64 = imageData;
	}
}

function opkey_screenshotScroll(shared) {
	videouploadstatus = "INPROGRESS";
	/*
	if (notificationid != null) {
		chrome.notifications.update(notificationid, { progress: _inc }, function (updated) { });
		_inc += 5;
	}*/
	chrome.tabs.update(currentFocusedTabForImage, {
		active: true
	}, function (callback) {
		if (chrome.runtime.lastError) {
			opkey_screenshotScroll(shared)
			return;
		}
		sendMessageToActiveTab({ action: 'screenshotScroll', shared: shared });
	});
}


function SaveWindowImageInMemory() {
	setTimeout(function () {
		if (canHighlight === true) {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				if (tabs.length > 0) {
					var activeTab = tabs[0];

					if (activeTab.title != null && activeTab.title.indexOf("Recorder") == -1) {
						chrome.tabs.captureVisibleTab(null, { format: "png" }, function (image) {
							if (chrome.runtime.lastError) {
							}
							if (image != null) {
								WINDOW_CURRENT_IAMGE_BASE64 = image;
							}
						});
					}
				}

				// Continue the loop
				SaveWindowImageInMemory();
			});
		} else {
			SaveWindowImageInMemory();
		}
	}, 300);
}



function SendDataToSassRecorder(_url) {
	fetch(_url, {
		method: "GET"
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			// Handle success if needed
			return response.text(); // or response.json(), depending on the expected response type
		})
		.catch(err_data => {

		});
}


function SendRecordedStepsToSaasRecorder() {
	setTimeout(
		function () {
			for (var st_p = 0; st_p < currentallrecordedsteps.length; st_p++) {
				var _step = currentallrecordedsteps[st_p];
				SendDataToSassRecorder("http://localhost:9999/_s_/dyn/Driver_setMobileSteps?step=" +
					_step);
			}
			currentallrecordedsteps = [];

			if (spyanddomsdata != null) {
				var temp_spydomdata = spyanddomsdata;
				spyanddomsdata = null;
				var temp_array = new Array();
				for (var t_s = 0; t_s < temp_spydomdata.length; t_s++) {
					temp_array.push(JSON
						.parse(temp_spydomdata[t_s]));
				}

				var _stringifiedarray = JSON.stringify(temp_array);
				_stringifiedarray = _stringifiedarray.substring(1,
					_stringifiedarray.length - 1);
				SendDataToSassRecorder("http://localhost:9999/_s_/dyn/Driver_setSpyDataForDesktopRecorder?element=" +
					_stringifiedarray);
			}
			SendRecordedStepsToSaasRecorder();
		}, 1000);
}

function StartRecorderAddon() {
	disableQlmManualAddonDocker();
	localStorage_setItem("ServerAppType", "WEB")
	if (currentopenedrecorderwindow == null) {
		isPaused = false;
		chrome.tabs.query({}, function (tabs) {
			if (chrome.runtime.lastError) { }
			for (var ck = 0; ck < tabs.length; ck++) {
				allpreviouslyopenedtabs.push(tabs[ck]);
			}
		});

		if (chrome.system == null) {
			var _bounds = screen;
			var _width = (_bounds.width / 100) * 100;
			var _height = _bounds.height;
			_width = Math.trunc(_width);
			_height = Math.trunc(_height);
			chrome.windows.create({
				url: chrome.runtime.getURL("/Login.html"),
				type: 'panel',
				state: "normal",
				left: 0,
				top: 0,
				width: _width,
				height: _height,
			}, function (win) {
				if (chrome.runtime.lastError) { }
				main_recorder_win_id = win.id;
				localStorage_setItem("MAIN_RECORDER_WIN_ID", main_recorder_win_id);
				currentopenedrecorderwindow = win;
				alltabsidandtitle = [];
			});
		}
		else {
			chrome.system.display.getInfo(function (displayInfo) {
				var _bounds = displayInfo[0].bounds;
				var _width = (_bounds.width / 100) * 100;
				var _height = _bounds.height;
				_width = Math.trunc(_width);
				_height = Math.trunc(_height);
				chrome.windows.create({
					url: chrome.runtime.getURL("/Login.html"),
					type: 'panel',
					state: "normal",
					left: 0,
					top: 0,
					width: _width,
					height: _height,
				}, function (win) {
					if (chrome.runtime.lastError) { }
					main_recorder_win_id = win.id;
					localStorage_setItem("MAIN_RECORDER_WIN_ID", main_recorder_win_id);
					currentopenedrecorderwindow = win;
					alltabsidandtitle = [];
				});
			});
		}

	}
	chrome.windows.onRemoved.addListener(async function (win) {
		if (chrome.runtime.lastError) { }
		var flow_chart_winid = -1;
		var flow_chart_tabid = await localStorage_getItem("FLOW_CHART_WinId");
		if (flow_chart_tabid != null) {
			if (flow_chart_tabid != "") {
				flow_chart_winid = parseInt(flow_chart_tabid);
			}
		}

		if (opkey_stream != null) {
			opkey_stream.getTracks()[0].stop();
		}
		if (currentopenedrecorderwindow != null) {
			if (main_recorder_win_id == win) {
				stopLocalRecorder();
				enableQLMAddonIfLastEnabled();
				ResetFlowChartTab();
				closeAgentResultUI();
				currentopenedrecorderwindow = null;
				canHighlight = false;
				removeContextMenu();
				auth_token_acquired = false;
				if (recording_page_window_id != -1) {
					chrome.windows.remove(recording_page_window_id, function (
						win) {
						if (chrome.runtime.lastError) { }
					});
					recording_page_window_id = -1;
				}

				if (iamgecropping_win_id != -1) {
					chrome.windows.remove(iamgecropping_win_id, function (win) {
						if (chrome.runtime.lastError) { }
					});
					iamgecropping_win_id = -1;
				}

				if (flow_chart_winid != -1) {
					chrome.windows.remove(flow_chart_winid, function (win) {
						if (chrome.runtime.lastError) { }
					});
					flow_chart_winid = -1;
				}

			} else if (win == recording_page_window_id) {
				recording_page_window_id = -1;
			} else if (win == iamgecropping_win_id) {
				iamgecropping_win_id = -1;
			} else if (win == flow_chart_winid) {
				localStorage_setItem("FLOW_CHART_WinId", "");
			}
		}
	});
}

async function stopLocalRecorder() {
	var sessionId = await localStorage_getItem("MobileRecorderSessionId");
	var agentId = await localStorage_getItem("MobileRecorderAgentId");

	if (sessionId == null || sessionId == "") {
		return;
	}

	if (agentId == null || agentId == "") {
		return;
	}

	try {
		const response = await fetch(await localStorage_getItem("OPKEY_DOMAIN_NAME") + '/Recorder/StopLocalRecorder', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				SessionId: sessionId,
				agentId: agentId
			})
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		//const result = await response.text(); // or response.json(), depending on the expected response type
		// Handle the result if needed
		// console.log(result);

	} catch (error) {
		console.error('There was a problem with the fetch operation:', error);
	}
}


function StartRecorderAddon_RecorderPage() {
	disableQlmManualAddonDocker();
	if (currentopenedrecorderwindow != null) {
		currentopenedrecorderwindow = null;
		chrome.windows.remove(main_recorder_win_id, function (win) {
			if (chrome.runtime.lastError) { }
		})
	}

	if (currentopenedrecorderwindow == null) {
		isPaused = false;
		chrome.tabs.query({}, function (tabs) {
			if (chrome.runtime.lastError) { }
			for (var ck = 0; ck < tabs.length; ck++) {
				allpreviouslyopenedtabs.push(tabs[ck]);
			}
		});

		if (chrome.system == null) {
			var _bounds = screen;
			var _width = (_bounds.width / 100) * 30;
			var _height = _bounds.height;
			_width = Math.trunc(_width);
			_height = Math.trunc(_height);
			chrome.windows.create({
				url: chrome.runtime.getURL("/Recorder.html"),
				type: 'panel',
				state: "normal",
				left: 0,
				top: 0,
				width: _width,
				height: _height,
			}, function (win) {
				if (chrome.runtime.lastError) { }
				main_recorder_win_id = win.id;
				localStorage_setItem("MAIN_RECORDER_WIN_ID", main_recorder_win_id);
				currentopenedrecorderwindow = win;
				alltabsidandtitle = [];
			});
		}
		else {
			chrome.system.display.getInfo(function (displayInfo) {
				var _bounds = displayInfo[0].bounds;
				var _width = (_bounds.width / 100) * 30;
				var _height = _bounds.height;
				_width = Math.trunc(_width);
				_height = Math.trunc(_height);
				chrome.windows.create({
					url: chrome.runtime.getURL("/Recorder.html"),
					type: 'panel',
					state: "normal",
					left: 0,
					top: 0,
					width: _width,
					height: _height,
				}, function (win) {
					if (chrome.runtime.lastError) { }
					main_recorder_win_id = win.id;
					localStorage_setItem("MAIN_RECORDER_WIN_ID", main_recorder_win_id);
					currentopenedrecorderwindow = win;
					alltabsidandtitle = [];
				});
			});
		}
	}
	chrome.windows.onRemoved.addListener(async function (win) {
		var flow_chart_winid = -1;
		var flow_chart_tabid = await localStorage_getItem("FLOW_CHART_WinId");
		if (flow_chart_tabid != null) {
			if (flow_chart_tabid != "") {
				flow_chart_winid = parseInt(flow_chart_tabid);
			}
		}
		if (opkey_stream != null) {
			opkey_stream.getTracks()[0].stop();
		}
		if (currentopenedrecorderwindow != null) {
			if (main_recorder_win_id == win) {
				stopLocalRecorder();
				enableQLMAddonIfLastEnabled();
				recorder_dockdata = null;
				closeAgentResultUI();
				//add your code here
				ResetFlowChartTab();
				currentopenedrecorderwindow = null;
				canHighlight = false;
				removeContextMenu();
				auth_token_acquired = false;

				if (recording_page_window_id != -1) {
					chrome.windows.remove(recording_page_window_id, function (
						win) {
						if (chrome.runtime.lastError) { }
					});
					recording_page_window_id = -1;
				}

				if (iamgecropping_win_id != -1) {
					chrome.windows.remove(iamgecropping_win_id, function (win) {
						if (chrome.runtime.lastError) { }
					});
					iamgecropping_win_id = -1;
				}

				if (flow_chart_winid != -1) {
					chrome.windows.remove(flow_chart_winid, function (win) {
						if (chrome.runtime.lastError) { }
					});
					flow_chart_winid = -1;
				}

			} else if (win == recording_page_window_id) {
				recording_page_window_id = -1;
			} else if (win == iamgecropping_win_id) {
				iamgecropping_win_id = -1;
			} else if (win == flow_chart_winid) {
				localStorage_setItem("FLOW_CHART_WinId", "");
			}
		}

	});
}


function closeAgentResultUI() {
	fetch("http://localhost:8090/agentCommand?command=CLOSERESULTUI", {
		method: "GET"
	});
}


async function ResetFlowChartTab() {

	var flow_chart_tab_id = await localStorage_getItem("FLOW_CHART_TABID");
	if (flow_chart_tab_id != null) {
		var int_flow_chart_id = parseInt(flow_chart_tab_id);
		var flc_tab_id = int_flow_chart_id;
		chrome.scripting.executeScript(
			{
				target: { tabId: flc_tab_id },
				func: () => {
					// Create a script element and execute the desired function
					const s = document.createElement('script');
					s.textContent = "recorderClearStepCache();";
					document.head.appendChild(s);
				},
			},
			function (results) {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError.message);
				}
			}
		);

	}
}

function createContextMenu() {
	chrome.contextMenus.create({
		"title": "Add To OpKey Test Case",
		"contexts": ["all"],
		"id": "ADDTOTESTCASE_MENU",
	});
	chrome.contextMenus.create({
		"title": "Add OpKey Keywords",
		"contexts": ["all"],
		"id": "ADDOPKEYKEYWORDS_MENU",
	});
	createOpkeyKeywordsMenu();
}

function removeContextMenu() {
	chrome.contextMenus.remove("ADDTOTESTCASE_MENU");
	chrome.contextMenus.remove("SELECTSALESFORCEOBJECT_MENU");
	chrome.contextMenus.remove("ADDOPKEYKEYWORDS_MENU");
	is_contextmenu_created = false;
}

function removeSelectObjectContextMenu() {
	chrome.contextMenus.remove("SELECTSALESFORCEOBJECT_MENU");
	is_contextmenu_created = false;
}

function createSalesforceContextMenu() {
	// chrome.contextMenus.remove("SELECTSALESFORCEOBJECT_MENU");
	chrome.contextMenus.removeAll();
	createContextMenu();
	chrome.contextMenus.create({
		"title": "Select Salesforce Object",
		"contexts": ["all"],
		"id": "SELECTSALESFORCEOBJECT_MENU",
	});

}

function createOpkeyKeywordsMenu() {
	chrome.contextMenus.create({
		"parentId": "ADDOPKEYKEYWORDS_MENU",
		"title": "MouseHover",
		"contexts": ["all"],
		"id": "ADDOPKEYKEYWORDS_MENUITEM_MouseHover"
	});
}

function createObjectSelectItem(item_name, sobject_name) {
	try {
		chrome.contextMenus.create({
			"parentId": "SELECTSALESFORCEOBJECT_MENU",
			"title": item_name,
			"contexts": ["all"],
			"id": "OPKEY_SOBJECT_ITEM" + sobject_name
		});
	} catch (e) {
		is_contextmenu_created = false;
	}
}

function shrinkRecorderWindow() {
	if (chrome.system == null) {
		var _bounds = screen;
		var _width = (_bounds.width / 100) * 30;
		var _height = _bounds.height;
		_width = Math.trunc(_width);
		_height = Math.trunc(_height);
		chrome.windows.update(main_recorder_win_id, {
			width: _width,
			height: _height
		});
	}
	else {
		chrome.system.display.getInfo(function (displayInfo) {
			var _bounds = displayInfo[0].bounds;
			var _width = (_bounds.width / 100) * 30;
			var _height = _bounds.height;
			_width = Math.trunc(_width);
			_height = Math.trunc(_height);
			chrome.windows.update(main_recorder_win_id, {
				width: _width,
				height: _height
			});
		});
	}
}

function restoreRecorderWindow() {
	if (chrome.system == null) {
		var _bounds = screen;
		var _width = (_bounds.width / 100) * 100;
		var _height = _bounds.height;
		_width = Math.trunc(_width);
		_height = Math.trunc(_height);
		chrome.windows.update(main_recorder_win_id, {
			width: _width,
			height: _height
		});
	}
	else {
		chrome.system.display.getInfo(function (displayInfo) {
			var _bounds = displayInfo[0].bounds;
			var _width = (_bounds.width / 100) * 100;
			var _height = _bounds.height;
			_width = Math.trunc(_width);
			_height = Math.trunc(_height);
			chrome.windows.update(main_recorder_win_id, {
				width: _width,
				height: _height
			});
		});
	}
}

chrome.contextMenus.onClicked.addListener(function (object_clicked) {
	var clicked_object = object_clicked.menuItemId;
	if (clicked_object.indexOf("OPKEY_SOBJECT_ITEM") > -1) {
		clicked_object = clicked_object.replace("OPKEY_SOBJECT_ITEM", "");
		// //console.log("MenuItem clicked "+clicked_object);
		FetchContextSObjectMetadata(clicked_object);
		return;
	}

	if (clicked_object.indexOf("ADDTOTESTCASE_MENU") > -1) {
		if (right_click_keyword_data != null) {
			recordingsteps = right_click_keyword_data;
			createImageOfElement(JSON.parse(right_click_keyword_data), WINDOW_CURRENT_IAMGE_BASE64);
			right_click_keyword_data = null;
		}
	}

	if (clicked_object.indexOf("ADDOPKEYKEYWORDS_MENUITEM") > -1) {
		if (right_click_keyword_data != null) {
			var keyword_name = clicked_object.replace(
				"ADDOPKEYKEYWORDS_MENUITEM_", "")
			recordingsteps = right_click_keyword_data;
			var keyword_object = JSON.parse(right_click_keyword_data);
			keyword_object.action = keyword_name;
			keyword_object["isAddedFromRightClick"] = "";
			createImageOfElement(keyword_object, WINDOW_CURRENT_IAMGE_BASE64);
			right_click_keyword_data = null;
		}
	}
});

function GetSoapRequestData(label_expression) {
	var _data = '<?xml version="1.0" encoding="utf-8"?>' +
		'<env:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/">' +
		'<env:Header>' +
		'<n1:SessionHeader xmlns:n1="http://soap.sforce.com/2006/04/metadata">' +
		'<n1:sessionId>' +
		current_access_token +
		'</n1:sessionId>' +
		'</n1:SessionHeader>' +
		'</env:Header>' +
		'<env:Body>' +
		'<n1:readMetadata xmlns:n1="http://soap.sforce.com/2006/04/metadata">' +
		'<n1:type type="xsd:string">CustomLabel</n1:type>' +
		'<n1:fullNames type="xsd:string">' + label_expression +
		'</n1:fullNames>' + '</n1:readMetadata>' + '</env:Body>' +
		'</env:Envelope>';

	return _data;
}

function GetCustomLabelAttributes(apex_markup_document) {
	var _alreday_added_holder = document
		.getElementById("OPKEY_APEX_MARKUP_HOLDER");
	if (_alreday_added_holder) {
		_alreday_added_holder.innerHTML = "";
	}
	var _tempContent = document.createElement("div");
	_tempContent.id = "OPKEY_APEX_MARKUP_HOLDER";
	_tempContent.innerHTML = DOMPurify.sanitize(apex_markup_document);
	document.body.appendChild(_tempContent);
	var _nodelist = _tempContent.getElementsByTagName("*");

	for (var _n_l = 0; _n_l < _nodelist.length; _n_l++) {
		var _node = _nodelist[_n_l];
		if (_node.getAttribute("label")) {
			var _label = _node.getAttribute("label");
			if (_label.indexOf("{!$Label.") > -1) {
				_label = _label.replace("{!$Label.", "").trim();
				_label = _label.replace("}", "");

				$
					.ajax({
						url: current_access_url + "/services/Soap/m/38.0/" +
							current_org_id,
						type: "POST",
						data: GetSoapRequestData(_label),
						async: false,
						dataType: "xml",
						contentType: "text/xml; charset=\"utf-8\"",
						headers: {
							"SOAPAction": current_access_url
						},
						success: function (ret_data) {
							var _records_nodes = ret_data
								.getElementsByTagName("records")[0];
							if (_records_nodes) {
								var _record_value_node = _records_nodes
									.getElementsByTagName("value")[0];
								if (_record_value_node) {
									var _record_value = _record_value_node.textContent
										.trim();
									_node.setAttribute("parsedLabel",
										_record_value);
								}
							}
						},
						error: function (error_data) { }
					});

			}
		}
	}

	var _all_mod_apex_markup = document
		.getElementById("OPKEY_APEX_MARKUP_HOLDER");
	if (_all_mod_apex_markup) {
		apex_markup_xml = _all_mod_apex_markup.outerHTML;
	}
}

function FetchContextSObjectMetadata(s_object) {
	current_host_reference["hostName"] = current_access_url;
	current_host_reference["ST_C_Object"] = s_object;
	GetMetaDataOfSObjects(current_host_reference, current_access_token, -1);
}

function createRequestObject() {
	var obj;
	if (window.XMLHttpRequest) {
		obj = new XMLHttpRequest()
	} else {
		if (window.ActiveXObject) {
			obj = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	return obj;
};

function iscontainsObject(object1, object2) {
	for (var ir = 0; ir < object1.length; ir++) {
		if (object1[ir].tabid == object2.tabid) {
			if (object1[ir].tabTitle == object2.tabTitle) {
				return true;
			}
		}
	}
	return false;
}

function isTabContains(tab1, tab2) {
	for (var currenttab = 0; currenttab < allpreviouslyopenedtabs.length; currenttab++) {
		var tab = allpreviouslyopenedtabs[currenttab]
		if (tab.id == tab2.id && tab.title == tab2.title) {
			return true;
		}
	}
	return false;
}

async function refreshSnippingTool() {
	var imagewinid = await localStorage_getItem("IMAGE_CROPPING_WIN");
	chrome.windows.update(iamgecropping_win_id, {
		state: "minimized"
	}, function (callback) { });
	chrome.windows.update(main_recorder_win_id, {
		state: "minimized"
	}, function (callback) { });
	setTimeout(function () {
		var video = document.createElement('video');
		video.addEventListener('loadedmetadata', function () {
			var canvas = document.createElement('canvas');
			canvas.width = this.videoWidth;
			canvas.height = this.videoHeight;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(this, 0, 0);
			var image = canvas.toDataURL();
			localStorage_setItem("IMAGE_CROP_IMAGE", image);
			video.pause();
			chrome.windows.update(main_recorder_win_id, {
				state: "normal"
			}, function (callback) { })
			chrome.windows.update(iamgecropping_win_id, {
				state: "normal"
			}, function (callback) { })
			chrome.tabs.query({
				windowId: iamgecropping_win_id
			}, function (tabs) {
				var _tab = tabs[0];
				chrome.tabs.update(_tab.id, {
					url: chrome.runtime.getURL("/ImageCrop.html")
				}, function (callback) { })
			});
			// opkey_stream.getTracks()[0].stop();
		}, false);
		video.srcObject = opkey_stream;
		video.play();
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext("2d");
		ctx.drawImage(video, 0, 0);
	}, 600);

}

function openSnippingTool() {
	chrome.windows.create({
		url: chrome.runtime.getURL("/ImageCrop.html"),
		type: 'panel',
		state: "normal",
		left: 0,
		top: 0,
		width: 800,
		height: 600
	}, (win) => {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
		}
		const imageCroppingWinId = win.id;
		localStorage_setItem("IMAGE_CROPPING_WIN", imageCroppingWinId);
	});
}



async function createImageOfElement(step_object, _fullPageImage) {
	return new Promise(async function (resolve) {


		var object_or = step_object.arguments[0];
		if (object_or["IsSikuliKeyword"] != null) {
			var sikuli_append = JSON.stringify(step_object);
			currentallrecordedsteps.push(sikuli_append);
			recordingsteps = sikuli_append;
			return;
		}

		let pageSnapshot = await chrome_tabs_captureVisibleTab({
			format: "jpeg"
		});

		if (pageSnapshot != null) {
			debugger
			_fullPageImage = pageSnapshot;
		}
		step_object = await sendMessageToOffscreenScript("offscreen_createImageOfElement_helper", { "stepObject": step_object, "imageBase64": _fullPageImage });
		var data_2_append = JSON.stringify(step_object);
		currentallrecordedsteps.push(data_2_append);
		recordingsteps = data_2_append;
		resolve(true);
	});
}

function StartTabIndexGeneration() {
	if (can_start_identifying_tabs == true) {
		chrome.tabs.query({
			windowId: recording_page_window_id
		}, function (tabs) {
			for (var k = 0; k < tabs.length; k++) {
				if (!isTabContains(allpreviouslyopenedtabs, tabs[k])) {
					var tabinfo = new Object();
					tabinfo.tabid = tabs[k].id;
					tabinfo.tabTitle = tabs[k].title;
					if (!iscontainsObject(alltabsidandtitle, tabinfo)) {
						alltabsidandtitle.push(tabinfo)
					}
				}
			}
			var indexvariables = [];
			for (var k = 0; k < tabs.length; k++) {
				var tab = tabs[k];
				if (tab.active && tab.title != "OpKey Recorder AddOn" &&
					!isTabContains(allpreviouslyopenedtabs, tab)) {
					var tabtitle = tab.title;
					for (var k1 = 0; k1 < alltabsidandtitle.length; k1++) {
						var tempobject = alltabsidandtitle[k1];
						if (tempobject.tabTitle == tabtitle) {
							indexvariables.push(tempobject);
						}
					}
					for (var k2 = 0; k2 < indexvariables.length; k2++) {
						var itertab = indexvariables[k2];
						if (itertab.tabid == tab.id) {
							var tabindex = k2;
							current_tab_title = tab.title;
							currenttabindex = tabindex;
							break;
						}
					}
				}
			}
		});
	}
}

function sendToServer(url, isAsync) {
	try {
		var rand = (new Date()).getTime() + Math.floor(Math.random() * (10000));
		var http = createRequestObject();
		url = url + (url.indexOf("?") == -1 ? "?" : "&") + "t=" + rand;
		url = url +
			"&sahisid=" +
			encodeURIComponent("opkey_885ae0450d9bd0440408d4308a50c0de0de2");
		var post = url.substring(url.indexOf("?") + 1);
		url = url.substring(0, url.indexOf("?"));
		url = "http://localhost:9999" + url;
		http.open("POST", url, isAsync === true); // needed for IE
		http.send(post);
		return http.responseText;
	} catch (ex) { }
};

function GetContextMenuObject(reference_object) {
	// //console.log("Context Status "+is_contextmenu_created);
	if (auth_token_acquired == false) {
		return;
	}
	if (is_contextmenu_created) {
		return;
	}

	// //console.log("RECORDING WINDOW ID "+recording_page_window_id);
	if (recording_page_window_id == -1) {
		removeContextMenu();
		return;
	}

	if (is_salesforce_recording == false) {
		return;
	}

	current_host_reference = reference_object;
	var host = reference_object.hostName;
	fetch(current_access_url + "/services/data/v43.0/tabs", {
		method: "GET",
		headers: {
			"Authorization": "Bearer " + current_access_token,
			"Content-Type": "application/json"
		}
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			// return response.json();

		})
		.then(returned_tabs_data => {
			createSalesforceContextMenu();
			const MAX_TABS = 100;
			if (!Array.isArray(returned_tabs_data)) {
				console.error("Invalid tab data");
				return;
			}
			const safe_tabs_data = returned_tabs_data.slice(0, MAX_TABS);
			const maxIterations = safe_tabs_data.length;
			for (let r_t_d = 0; r_t_d < maxIterations; r_t_d++) {
				let tab_data = safe_tabs_data[r_t_d];
				let label_object = tab_data.label;
				let sobject_name = tab_data.sobjectName;
				createObjectSelectItem(label_object, sobject_name);
				is_contextmenu_created = true;
			}
		})
		.catch(error => {

		});

};

function GetApexMarkUpOfSobject(sobject_name) {
	if (auth_token_acquired == false) {
		return;
	}

	$
		.ajax({
			url: current_access_url +
				"/services/data/v43.0/tooling/query?q=select Markup from apexpage where name='" +
				sobject_name + "'",
			headers: {
				"Authorization": "Bearer " + current_access_token
			},
			contentType: "application/json",
			type: "Get",
			success: function (returned_apexmarkup) {
				if (returned_apexmarkup != null) {
					if (returned_apexmarkup.records[0] != null) {
						if (returned_apexmarkup.records[0]["Markup"] != null) {
							var apex_markup = returned_apexmarkup.records[0]["Markup"];
							GetCustomLabelAttributes(apex_markup);
						}
					}
				}
			},
			error: function (error_data) {
				console.error(error_data);
			}
		});
};

function GetAuraMarkupOfObject() {
	if (auth_token_acquired == false) {
		return;
	}

	if (aura_markup_xml != "") {
		return;
	}

	$
		.ajax({
			url: current_access_url +
				"/services/data/v43.0/tooling/query?q=select Source from AuraDefinition where DefType='Component'",
			headers: {
				"Authorization": "Bearer " + current_access_token
			},
			contentType: "application/json",
			type: "Get",
			success: function (returned_auramarkup) {
				var aura_markup_records = returned_auramarkup["records"];
				for (var a_m = 0; a_m < aura_markup_records.length; a_m++) {
					var aura_markup_record = aura_markup_records[a_m];
					if (aura_markup_record["Source"]) {
						aura_markup_xml += aura_markup_record["Source"];
					}
				}
			},
			error: function (error_data) {
				console.error(error_data);
			}
		});
}

var current_s_object = "";

function GetMetaDataOfSObjects(reference_object, session_id, thread_id) {
	if (auth_token_acquired == false) {
		return;
	}
	var host = reference_object.hostName;
	var sessid = reference_object.SID;
	var st_ct_object_name = reference_object.ST_C_Object;
	if (st_ct_object_name == null) {
		window.clearInterval(thread_id);
		return;
	}

	if (current_s_object == st_ct_object_name) {
		window.clearInterval(thread_id);
		return;
	}
	st_ct_object_name = st_ct_object_name.trim();
	$
		.ajax({
			url: current_access_url + "/services/data/v43.0/sobjects/" +
				st_ct_object_name + "/describe/layouts",
			headers: {
				"Authorization": "Bearer " + current_access_token
			},
			contentType: "application/json",
			type: "Get",
			success: function (returned_metadat) {
				// //console.log("Success Clearing Interval "+thread_id);
				current_s_object = st_ct_object_name;
				if (returned_metadat["layouts"] != null) {
					var data_1 = jsonPath(returned_metadat,
						"$.layouts[0].[*].layoutItems");
					var data_2 = jsonPath(returned_metadat,
						"$.layouts[0].[*].components");
					CreateSimplifiedField(data_1, st_ct_object_name, true,
						false);
					CreateSimplifiedField(data_2, st_ct_object_name, false,
						true);
				} else {
					var recordTypeMappings = returned_metadat["recordTypeMappings"];
					// //console.log("RECORD TYPE MAPPINGS
					// "+JSON.stringify(recordTypeMappings));
					for (var rc_i = 0; rc_i < recordTypeMappings.length; rc_i++) {
						var recordtypemapping = recordTypeMappings[rc_i];
						var recordtypemapping_url = recordtypemapping.urls.layout;
						var index = rc_i + 1;
						// //console.log("INDEX 1"+index+"
						// "+recordTypeMappings.length);
						$
							.ajax({
								url: "https://" + host + "" +
									recordtypemapping_url,
								headers: {
									"Authorization": "Bearer " +
										session_id
								},
								contentType: "application/json",
								type: "Get",
								success: function (
									returned_metadat_recordtypemappings) {
									// //console.log("Success Clearing
									// Interval "+thread_id);
									// //console.log(returned_metadat_recordtypemappings);
									current_s_object = st_ct_object_name;
									var data_1 = jsonPath(
										returned_metadat_recordtypemappings,
										"$.[*].layoutItems");
									var data_2 = jsonPath(
										returned_metadat_recordtypemappings,
										"$.[*].components");
									// //console.log("INDEX "+index+"
									// "+recordTypeMappings.length);
									if (index == 1) {
										// //console.log("********IN 1ST
										// CONDITION");
										CreateSimplifiedField(data_1,
											st_ct_object_name,
											true, false);
										CreateSimplifiedField(data_2,
											st_ct_object_name,
											false, false);
									} else if (index == recordTypeMappings.length) {
										// //console.log("********IN 2ND
										// CONDITION");
										CreateSimplifiedField(data_1,
											st_ct_object_name,
											false, false);
										CreateSimplifiedField(data_2,
											st_ct_object_name,
											false, true);
									} else {
										// //console.log("********IN 3RD
										// CONDITION");
										CreateSimplifiedField(data_1,
											st_ct_object_name,
											false, false);
										CreateSimplifiedField(data_2,
											st_ct_object_name,
											false, false);
									}
								}
							});
					}
				}

				window.clearInterval(thread_id);
			},
			error: function (returned_api_error, xhr) {
				console.error(JSON.stringify(xhr));
				window.clearInterval(thread_id);
			}
		});
};

function GetAttributeOfS_CObject(field_name, s_cobject) {
	// //console.log(current_tab_title);
	return s_cobject[field_name];
};

function CreateSimplifiedField(fields_array, s_c_object_name, clear_array,
	send_simplified) {
	if (clear_array) {
		metadata_array_of_simplified_object = [];
		simplified_field_objects_array = [];
	}
	for (var f_ai = 0; f_ai < fields_array.length; f_ai++) {
		var raw_field_object = fields_array[f_ai];
		for (var rf_i = 0; rf_i < raw_field_object.length; rf_i++) {
			var simplified_field_object = new Object();
			var secondary_raw_object = raw_field_object[rf_i];
			var label_1 = secondary_raw_object["label"];
			var label_2 = null;
			var apiname = null;
			var data_type = null;
			simplified_field_object["S_CObject"] = s_c_object_name;
			if (secondary_raw_object["layoutComponents"] != null) {
				if (secondary_raw_object["layoutComponents"][0] != null) {
					if (secondary_raw_object["layoutComponents"][0]["details"] != null) {
						label_2 = secondary_raw_object["layoutComponents"][0]["details"]["label"];
						apiname = secondary_raw_object["layoutComponents"][0]["details"]["name"];
						data_type = secondary_raw_object["layoutComponents"][0]["details"]["type"];
					}
				}
			} else {
				label_1 = secondary_raw_object["details"]["label"];
				label_2 = secondary_raw_object["details"]["label"];
				apiname = secondary_raw_object["details"]["name"];
				data_type = secondary_raw_object["details"]["type"];
			}
			if (label_1 != null) {
				simplified_field_object["Label"] = label_1;
			}
			if (label_2 != null) {
				simplified_field_object["Detail_Label"] = label_2;
			}
			if (apiname != null) {
				simplified_field_object["ApiName"] = apiname;
			}
			if (data_type != null) {
				simplified_field_object["DataType"] = data_type;
			}
			simplified_field_objects_array.push(simplified_field_object);
		}
	}
	if (send_simplified) {
		metadata_array_of_simplified_object = simplified_field_objects_array
			.slice(0);
	}
};

function CreateQuickActionMetadata(record_id) {
	if (auth_token_acquired == false) {
		return;
	}
	$
		.ajax({
			url: current_access_url +
				"/services/data/v43.0/ui-api/actions/record/" +
				record_id,
			headers: {
				"Authorization": "Bearer " + current_access_token
			},
			contentType: "application/json",
			type: "Get",
			success: function (returned_metadat) {
				var actions_related = returned_metadat["actions"][record_id]["actions"];
				quick_list_actiondata = actions_related.slice(0);
				// console.log(JSON.stringify(quick_list_actiondata));

			},
			error: function (error_returneddata) {

			}
		});
};

function GetRecordedSteps() {
	if (recordingsteps != null) {
		var temp_array = currentallrecordedsteps.slice(0);
		currentallrecordedsteps = []
		recordingsteps = null;
		return temp_array;
	}
	return [];
}

function getEBSLTRequestResponseList() {
	return ebsRequestResponseList;
}


function GetDOMSData() {
	if (spyanddomsdata != null) {
		var temp_spydomdata = spyanddomsdata;
		spyanddomsdata = null;
		return temp_spydomdata;
	}
	return null;
}

function GetFusionObjectName() {
	return oracle_fusion_object;
}

function parseGuidId(_guid) {
	if (_guid.indexOf("_") > -1) {
		return _guid.split("_")[1];
	}
	return _guid;
}

var opkey_url_toblock = "OPKEY_NO_NEED_TO_BLOCK_ANYTHING";
var auth_token_windowID = -1;
var docker_stepcount = 0;
let common_command = null;
var recorderstepsfordocker = [];
var recorderstepobjectproperty = [];
var spydomsteps = [];
var spydomstepsobjectproperty = [];

var timer_hh = 0;
var timer_mm = 0;
var timer_ss = 0;
var timerTickStarted = false;
var tickTime = "00:00:00";
var tickThread = -1;
var pauseTimer = false;

function getVideoRecordingTime() {
	var totalTime = 0;
	var pauseTime = 0;
	var pauseTimeObject = null;
	var startTimeObject = null;
	for (var i = 0; i < videoRecorderTimeArray.length; i++) {
		var timeObject = videoRecorderTimeArray[i];
		if (timeObject.state == "PAUSE") {
			pauseTimeObject = timeObject;
			if (videoRecorderTimeArray[i + 1] != null) {
				var tempStepObject = videoRecorderTimeArray[i + 1];
				if (tempStepObject.state == "STOP") {
					pauseTime += (tempStepObject.time - pauseTimeObject.time);
					break;
				}
			}
		}
		if (timeObject.state == "RESUME") {
			if (pauseTimeObject != null) {
				pauseTime += (timeObject.time - pauseTimeObject.time);
				pauseTimeObject = null;
			}
		}
	}

	var stopTimeObjectFound = false;
	for (var j = 0; j < videoRecorderTimeArray.length; j++) {
		var timeObject_1 = videoRecorderTimeArray[j];
		if (timeObject_1.state == "START") {
			startTimeObject = timeObject_1;
		}
		if (timeObject_1.state == "STOP") {
			if (startTimeObject != null) {
				stopTimeObjectFound = true;
				totalTime += (timeObject_1.time - startTimeObject.time);
				startTimeObject = null;
				break;
			}
		}
	}
	if (stopTimeObjectFound == false) {
		totalTime = Date.now() - startTimeObject.time;
	}
	var out = (totalTime - pauseTime);
	debugger
	return (out + 1000);
}

function startTimerTick() {
	pauseTimer = false;
	if (timerTickStarted == true) {
		return;
	}
	videoRecorderTimeArray = [];
	videoRecorderTimeArray.push({ "time": Date.now(), "state": "START" });
	timerTickStarted = true;

	(function tickThreadLoop() {
		if (pauseTimer === false) {
			timer_ss = (getVideoRecordingTime() - 1000) / 1000;
			timer_ss = Math.floor(timer_ss);
			const totalMinutes = Math.floor(timer_ss / 60);

			let seconds = timer_ss % 60;
			let hours = Math.floor(totalMinutes / 60);
			let minutes = totalMinutes % 60;

			if (seconds < 10) {
				seconds = "0" + seconds;
			}

			if (hours < 10) {
				hours = "0" + hours;
			}

			if (minutes < 10) {
				minutes = "0" + minutes;
			}

			const timer_totaltime = hours + ":" + minutes + ":" + seconds;

			tickTime = timer_totaltime;
		}

		// Call the anonymous function again after 1000 milliseconds
		tickThread = setTimeout(tickThreadLoop, 1000);
	})();

}

function getTimerData() {
	return tickTime;
}

function resetTimer() {
	timerTickStarted = false;
	if (tickThread > -1) {
		clearTimeout(tickThread);
	}
	timer_hh = 0;
	timer_mm = 0;
	timer_ss = 0;
}

var postMessageData = null;

// In case you previously enabled "openPanelOnActionClick: true", turn it OFF:
chrome.runtime.onInstalled.addListener(() => {
	chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
});
chrome.runtime.onStartup.addListener(() => {
	chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
	if (msg?.type === "DISABLE_SIDE_PANEL") {
		(async () => {
			try {
				const tabId = Number(msg.tabId);
				debugger
				if (!Number.isInteger(tabId)) {
					sendResponse({ ok: false, error: "Invalid tabId" });
					return;
				}

				// Disable the side panel for that tab
				await chrome.sidePanel.setOptions({
					tabId,
					enabled: false,
				});

				sendResponse({ ok: true });
			} catch (err) {
				// Common causes: tab was closed, bad tabId
				sendResponse({ ok: false, error: String(err?.message || err) });
			}
		})();

		// Required for async response in MV3
		return true;
	}
});


chrome.runtime.onMessage
	.addListener(function (request, sender, sendResponse) {

		if (request.TakePageSnapshotOnMouseHover) {
			debugger
			(async function () {
				let tempImageData = await chrome_tabs_captureVisibleTab({
					format: "jpeg"
				});

				if (tempImageData != null && tempImageData !== "") {
					current_pagesnapshot_mousehover = tempImageData;
				}

				sendResponse(current_pagesnapshot_mousehover);
			})();

		}

		if (request.flagForStartJourneyTranscript) {
			flagForJourneyTranscript = true;
		}
		if (request.flagForStopJourneyTranscript) {
			flagForJourneyTranscript = false;
		}
		if (request.getFlagForJourneyTranscript) {
			sendResponse(flagForJourneyTranscript);
		}

		if (request.GetRecordedSteps) {
			sendResponse(GetRecordedSteps());
		}
		if (request.GetDOMSData) {
			sendResponse(GetDOMSData());
		}
		if (request.GetOOCRecorderPortNo) {
			(async () => {
				sendResponse(await getOOCRecorderPortNo());
			})();
		}
		if (request.getEBSLTRequestResponseList) {
			sendResponse(getEBSLTRequestResponseList());
		}
		if (request.GetWindowBase64Image) {
			var temp = WINDOW_CURRENT_IAMGE_BASE64;
			//WINDOW_CURRENT_IAMGE_BASE64 = null;
			sendResponse(temp);
		}

		if (request.SetWindowBase64Image) {
			WINDOW_CURRENT_IAMGE_BASE64 = request.SetWindowBase64Image;
			//WINDOW_CURRENT_IAMGE_BASE64 = null;
			sendResponse("");
		}
		if (request.screenshotEnd) {
			screenShotDirtCut = request.screenshotEnd;
			screenshotEnd = true;
			sendResponse("");
		}
		if (request.SendVideoBlobData) {
			(async function () {


				videoRecorderTimeArray.push({ "time": Date.now(), "state": "STOP" });
				recordedChunks = [];
				var duration = getVideoRecordingTime();
				globalDuration = duration;
				var base64String = request.SendVideoBlobData;
				base64String = base64String.replace("data:video/x-matroska;codecs=avc1;base64,", "");
				base64String = base64String.replace("data:video/x-matroska;codecs=avc1,opus;base64,", "");

				currentVideoBase64 = base64String;

				var fixedBlob = await sendMessageToOffscreenScript("offscreen_ysFixWebmDuration", { "base64String": base64String, "duration": duration });
				//ysFixWebmDuration(blob, duration, function (fixedBlob) {
				debugger
				currentFixedVideoBlob = fixedBlob;
				recordedChunks.push(fixedBlob);
				videoProcessingStatus = "COMPLETED";
				videoRecorderTimeArray = [];
				//});
			})();
			sendResponse("");
		}
		if (request.LoadVideoEditorDockOrWindow) {
			loadVideoEditorDockOrWindow();
			sendResponse("");
		}
		if (request.SetFullPageScreenShot) {
			fullPageScreenshotbase64 = request.SetFullPageScreenShot;
			sendResponse("");
		}
		if (request.message) {
			sendResponse("1.0");
		}
		if (request.StartimerTick) {
			startTimerTick();
			sendResponse("");
		}
		if (request.GetTimerTick) {
			sendResponse(getTimerData());
		}

		if (request.ResetTimerTick) {
			resetTimer();
			sendResponse("");
		}

		if (request.GetApexMarkupXMLDoc) {
			if (apex_markup_xml != "") {
				var temp_apex_markup = apex_markup_xml;
				apex_markup_xml = "";
				sendResponse(temp_apex_markup);
			}
		}
		if (request.GetAddonInstalled) {
			sendResponse(true)
		}

		if (request.SetFusionObjectName) {
			oracle_fusion_object = request.SetFusionObjectName;
		}

		if (request.GetAuraMarkupXMLDoc) {
			if (aura_markup_xml != "") {
				var temp_apex_markup = aura_markup_xml;
				// apex_markup_xml = "";
				sendResponse(aura_markup_xml);
			}
		}

		if (request.GetApexClassProperty) {
			var ret_data = request.GetApexClassProperty;
			GetApexMarkUpOfSobject(ret_data.apexClassName);
		}

		if (request.GetAuraClassProperty) {
			// var ret_data = request.GetApexClassProperty;
			GetAuraMarkupOfObject();
		}

		if (request.GetQuickActionMetaData) {
			var ret_data = request.GetQuickActionMetaData;
			CreateQuickActionMetadata(ret_data["recordid"]);
		}

		if (request.OpenSnippingTool) {
			openSnippingTool();
		}

		if (request.RefreshSnippingTool) {
			refreshSnippingTool();
		}

		if (request.SetAuthAcquired) {
			auth_token_acquired = true;
		}

		if (request.RemoveAuthAcquired) {
			metadata_array_of_simplified_object = [];
			auth_token_acquired = false;
		}

		if (request.GetAuthAcquired) {
			sendResponse(auth_token_acquired);
		}

		if (request.SendQuickActionMetaData) {
			if (quick_list_actiondata != null) {
				if (quick_list_actiondata.length > 0) {
					sendResponse(quick_list_actiondata);
				}
			}
		}

		if (request.SetRecordingPageChanged) {
			recording_page_changed = true;
		}

		if (request.GetRecordingPageChanged) {
			if (recording_page_changed == true) {
				var page_status = recording_page_changed;
				recording_page_changed = false;
				sendResponse(page_status);
				return;
			}
			sendResponse(recording_page_changed);
		}

		if (request.StartAddonFromMarketPlace) {
			localStorage_removeItem("isRecordingUserGuide");
			console.log("StartAddonFromMarketPlace")
			StartRecorderAddon();
		}

		if (request.StartAddon) {

			localStorage_removeItem("isRecordingUserGuide");
			localStorage_removeItem("PcloudyDeviceDto");
			localStorage_removeItem("MobileRecorderType");
			localStorage_removeItem("MobileAppDto");

			currentallrecordedsteps = [];
			var init_data = request.StartAddon;
			if (init_data["SalesforceApp"] != null) {
				StartRecorderAddon();
				return;
			}
			var domain_name = init_data["DomainProtocol"] + "//" +
				init_data["Domain"];
			var tc_id = init_data["TestCase"];
			var or_id = init_data["ObjectRepository"];
			tc_id = parseGuidId(tc_id);
			or_id = parseGuidId(or_id);

			var sr_id = init_data["ServiceRepository"];
			if (sr_id != null) {
				sr_id = parseGuidId(sr_id);
			}

			if (sr_id == null) {
				sr_id = "";
			}
			var append_at_step = init_data["TestCaseIndex"];
			var recording_mode_0 = init_data["RecorderMode"];
			var opkey_redirecturl = init_data["OpKeyRedirectURL"];

			var serverapptypeurl = init_data["ServerAppTypeUrl"];
			if (serverapptypeurl != null && serverapptypeurl != "") {
				localStorage_setItem("ServerAppTypeUrl", serverapptypeurl);
			}
			console.log(JSON.stringify(init_data));

			var appUrl = init_data["AppUrl"];
			if (appUrl != null && appUrl !== "") {
				localStorage_setItem("APPLICATION_URL", appUrl);
			}
			else {
				localStorage_setItem("APPLICATION_URL", "");
			}
			if (init_data["ServerAppType"] != null) {
				localStorage_setItem("ServerAppType", init_data["ServerAppType"]);
			}
			else {
				localStorage_setItem("ServerAppType", "");
			}


			if (init_data["PcloudyDeviceDto"] != null) {
				localStorage_setItem("PcloudyDeviceDto", JSON.stringify(init_data["PcloudyDeviceDto"]));
			}

			if (init_data["MobileAppDto"] != null) {
				localStorage_setItem("MobileAppDto", JSON.stringify(init_data["MobileAppDto"]));
			}

			if (init_data["MobileRecorderSessionId"] != null) {
				localStorage_setItem("MobileRecorderSessionId", init_data["MobileRecorderSessionId"]);
			}

			if (init_data["MobileRecorderAgentId"] != null) {
				localStorage_setItem("MobileRecorderAgentId", init_data["MobileRecorderAgentId"]);
			}

			if (init_data["MobileRecorderType"] != null) {
				var mobileRecorderType = init_data["MobileRecorderType"];
				localStorage_setItem("MobileRecorderType", mobileRecorderType);
			}

			if (init_data["ArtifactModuleType"] != null) {
				localStorage_setItem("ArtifactModuleType", init_data["ArtifactModuleType"]);
			}

			localStorage_setItem("OPKEY_DOMAIN_NAME", domain_name);
			localStorage_setItem("RECORDER_FLOW_DB_ID", tc_id);
			localStorage_setItem("RECORDER_OR_DB_ID", or_id);
			localStorage_setItem("RECORDER_SR_DB_ID", sr_id);
			localStorage_setItem("TestCaseStepIndex", append_at_step
				.toString());
			localStorage_setItem("RECORDING_MODE", recording_mode_0);
			localStorage_setItem("isRecordingFromSaas", "true");


			if (tc_id == "" || or_id == "") {
				StartRecorderAddon();
			} else {

				if (opkey_redirecturl) {
					localStorage_setItem("OpKeySalesforceApp", "true");
					fetch(opkey_redirecturl, { method: "GET" })
						.catch(() => {
						})
						.finally(() => {
							StartRecorderAddon_RecorderPage();
						});
				} else {
					StartRecorderAddon_RecorderPage();
				}

			}
		}

		if (request.OBIQ_StartUserGuideRecording) {
			let init_data = request.OBIQ_StartUserGuideRecording;
			console.log(init_data);

			var domain_name = init_data["DomainProtocol"] + "//" +
				init_data["Domain"];

			var serverapptypeurl = init_data["ServerAppTypeUrl"];
			if (serverapptypeurl != null && serverapptypeurl != "") {
				localStorage_setItem("ServerAppTypeUrl", serverapptypeurl);
			}

			var appUrl = init_data["AppUrl"];
			if (appUrl != null && appUrl !== "") {
				localStorage_setItem("APPLICATION_URL", appUrl);
			}
			else {
				localStorage_setItem("APPLICATION_URL", "");
			}

			if (init_data["ServerAppType"] != null) {
				localStorage_setItem("ServerAppType", init_data["ServerAppType"]);
			}
			else {
				localStorage_setItem("ServerAppType", "");
			}

			let action = init_data["Action"];
			let afterStepId = init_data["AfterStepId"];
			let parentStepId = init_data["ParentStepId"];
			let userGuideSessionId = init_data["UserGuideSessionId"];
			let userId = init_data["UserId"];


			localStorage_setItem("OBIQ_Action", action);
			localStorage_setItem("OBIQ_AfterStepId", afterStepId);
			localStorage_setItem("OBIQ_ParentStepId", parentStepId);
			localStorage_setItem("OBIQ_UserGuideSessionId", userGuideSessionId);
			localStorage_setItem("OBIQ_UserId", userId);

			localStorage_setItem("OPKEY_DOMAIN_NAME", domain_name);
			localStorage_setItem("RECORDING_MODE", "WebRecorder");
			localStorage_setItem("isRecordingFromSaas", "true");
			localStorage_setItem("isRecordingUserGuide", "true");

			setTimeout(function () {
				StartRecorderAddon_RecorderPage();
			}, 500);

			sendResponse("");
		}

		if (request.recordeddata) {
			(async function () {
				await addRecordedData(request.recordeddata)

				sendResponse("Done");
			})();
		}

		if (request.setPause) {
			isPaused = true;
			sendResponse("");
		}

		if (request.GetSalesForceMetadata) {
			if (metadata_array_of_simplified_object.length > 0) {
				sendResponse(metadata_array_of_simplified_object);
			}
		}

		if (request.GetQuickActionMetadataForRecorder) {
			if (quick_list_actiondata.length > 0) {
				sendResponse(quick_list_actiondata);
			}
		}

		if (request.ResetRecordingPageId) {
			recording_page_window_id = -1;
		}

		if (request.SetSalesforceHostName) {
			if (auth_token_acquired == false) {
				return;
			}
			current_salesforce_host_name = request.SetSalesforceHostName;
			// //console.log("REQUESTED CLASSIC
			// "+current_salesforce_host_name);
			var host_name = current_salesforce_host_name.host;
			var current_url = current_salesforce_host_name.currenturl;
			if (global_keyprefixes_array.length > -1) {
				// //console.log("Calling Metadata");
				if (global_keyprefixes_array.length > 0) {
					// return;
				}
				$
					.ajax({
						url: current_access_url +
							"/services/data/v43.0/sobjects",
						headers: {
							"Authorization": "Bearer " +
								current_access_token
						},
						contentType: "application/json",
						type: "Get",
						success: function (returned_objects) {
							// //debugger;
							var key_prefixes_array = [];
							current_session_id = current_access_token;
							// //console.log("FIRST SESSION ID
							// "+current_session_id);
							current_host = current_salesforce_host_name;
							var keyprefixes_sobject = jsonPath(
								returned_objects,
								"$.sobjects[*].keyPrefix");
							var sobject_names = jsonPath(
								returned_objects,
								"$.sobjects[*].name");
							for (var i = 0; i < keyprefixes_sobject.length; i++) {
								var key_object = new Object();
								key_object["keyPrefix"] = keyprefixes_sobject[i];
								key_object["Name"] = sobject_names[i];
								key_prefixes_array.push(key_object);
							}
							global_keyprefixes_array = key_prefixes_array
								.slice(0);
						}
					});
			}

			// write here
			var key_prefix = current_url;
			key_prefix = key_prefix.replace("https://", "");
			key_prefix = key_prefix.replace("http://", "");
			key_prefix = key_prefix.replace(host_name, "");
			if (key_prefix.indexOf("/apex/") == 0) {
				key_prefix = key_prefix.replace("/apex/", "");
				var quest_index = key_prefix.indexOf("?");
				if (quest_index > -1) {
					key_prefix = key_prefix.substring(0, quest_index);
					// //console.log("NEW PREFIX "+key_prefix);
				}
			} else if (key_prefix.indexOf("/") == 0) {
				key_prefix = key_prefix.substring(1, 4);
				// //console.log("KEY PREFIX "+key_prefix);
			}

			for (var g_i = 0; g_i < global_keyprefixes_array.length; g_i++) {
				var keyprefix_object = global_keyprefixes_array[g_i];
				if (keyprefix_object["keyPrefix"] == key_prefix) {
					st_ct_object_name = keyprefix_object["Name"];
					// //console.log("SOBJECT CTOBJECT NAME
					// "+st_ct_object_name);
					// //console.log("SECOND SESSION ID
					// "+current_session_id);
					$
						.ajax({
							url: current_access_url +
								"/services/data/v43.0/sobjects/" +
								st_ct_object_name +
								"/describe/layouts",
							headers: {
								"Authorization": "Bearer " +
									current_access_token
							},
							contentType: "application/json",
							type: "Get",
							success: function (returned_metadat) {
								// //debugger;
								if (returned_metadat["layouts"] != null) {
									current_s_object = st_ct_object_name;
									var data_1 = jsonPath(
										returned_metadat,
										"$.layouts[0].[*].layoutItems");
									var data_2 = jsonPath(
										returned_metadat,
										"$.layouts[0].[*].components");
									CreateSimplifiedField(data_1,
										st_ct_object_name, true,
										false);
									CreateSimplifiedField(data_2,
										st_ct_object_name, false,
										true);
								} else {
									var recordTypeMappings = returned_metadat["recordTypeMappings"];
									// //console.log("RECORD TYPE
									// MAPPINGS
									// "+JSON.stringify(recordTypeMappings));
									for (var rc_i_0 = 0; rc_i_0 < recordTypeMappings.length; rc_i_0++) {
										// //debugger;
										var recordtypemapping = recordTypeMappings[rc_i_0];
										var recordtypemapping_url = recordtypemapping.urls.layout;
										var index_0 = rc_i_0 + 1;
										// //console.log("INDEX
										// 1"+index_0+"
										// "+recordTypeMappings.length);

										$
											.ajax({
												url: current_access_url +
													"" +
													recordtypemapping_url,
												headers: {
													"Authorization": "Bearer " +
														current_access_token
												},
												contentType: "application/json",
												type: "Get",
												success: function (
													returned_metadat_recordtypemappings) {
													// //console.log("Success
													// Clearing
													// Interval
													// "+thread_id);
													// //console.log(returned_metadat_recordtypemappings);
													current_s_object = st_ct_object_name;
													var data_1 = jsonPath(
														returned_metadat_recordtypemappings,
														"$.[*].layoutItems");
													var data_2 = jsonPath(
														returned_metadat_recordtypemappings,
														"$.[*].components");
													// //console.log("INDEX
													// "+index_0+"
													// "+recordTypeMappings.length);
													if (index_0 == 1) {
														// //console.log("********IN
														// 1ST
														// CONDITION");
														CreateSimplifiedField(
															data_1,
															st_ct_object_name,
															true,
															false);
														CreateSimplifiedField(
															data_2,
															st_ct_object_name,
															false,
															false);
													} else if (index_0 == recordTypeMappings.length) {
														// //console.log("********IN
														// 2ND
														// CONDITION");
														CreateSimplifiedField(
															data_1,
															st_ct_object_name,
															false,
															false);
														CreateSimplifiedField(
															data_2,
															st_ct_object_name,
															false,
															true);
													} else {
														// //console.log("********IN
														// 3RD
														// CONDITION");
														CreateSimplifiedField(
															data_1,
															st_ct_object_name,
															false,
															false);
														CreateSimplifiedField(
															data_2,
															st_ct_object_name,
															false,
															false);
													}
												}
											});

									}
								}

							},
							error: function (returned_api_error, xhr) {
								console.error(JSON.stringify(xhr));
							}
						});
					break;
				}
			}
		}

		if (request.InitializeSalesforceParameter) {
			aura_markup_xml = "";
			var data_init = request.InitializeSalesforceParameter;
			current_access_url = data_init["accessURL"];
			current_access_token = data_init["accessToken"]
			current_org_id = data_init["orgId"];
			// SFConfigurataor.endpoint=current_access_url;
			// SFConfigurataor.authorization_token=current_access_token;
			// SFConfigurataor.GetAllObjectsName();
		}

		if (request.InitializeVeevaParameter) {
			aura_markup_xml = "";
			var data_init = request.InitializeVeevaParameter;
			veeva_accessurl = data_init["accessURL"];
			veeva_username = data_init["username"]
			veeva_password = data_init["password"];
		}

		if (request.GetExtraMetadataOfObject) {
			var _sobject = request.GetExtraMetadataOfObject;

			FetchContextSObjectMetadata(_sobject);
		}

		if (request.StartSalesForceMetadataFetching) {

			var thread_id = window.setInterval(function () {
				GetMetaDataOfSObjects(
					request.StartSalesForceMetadataFetching,
					current_access_token, thread_id);
			}, 1000);
		}

		if (request.CreateSOBjectContextMenu) {
			GetContextMenuObject(request.CreateSOBjectContextMenu);
		}

		if (request.GetFloWChartData) {
			sendResponse(["Hello Kunal"])
		}

		if (request.setRecordingMode) {
			recording_mode = request.setRecordingMode;
			if (recording_mode.toLowerCase().indexOf("salesforce") > -1) {
				is_salesforce_recording = true;
			} else {
				removeSelectObjectContextMenu();
				is_contextmenu_created = false;
				is_salesforce_recording = false;
			}
		}

		if (request.CreateContextMenu) {
			createContextMenu();
		}

		if (request.RemoveContextMenu) {
			removeContextMenu();
		}

		if (request.getAnchor) {
			sendResponse(is_anchor);
		}

		if (request.setAnchor) {
			is_anchor = true;
		}

		if (request.resetAnchor) {
			is_anchor = false;
		}

		if (request.rightClickKeywordData) {
			right_click_keyword_data = request.rightClickKeywordData;
			// //console.log("Received Right Click Data
			// "+right_click_keyword_data);
		}

		if (request.getRecordingMode) {
			// //debugger;
			sendResponse(recording_mode);
		}

		if (request.setNavigationUrl) {
			navigation_url = request.setNavigationUrl;
		}

		if (request.setCurrentWindowID) {
			recording_page_window_id = request.setCurrentWindowID;
		}

		if (request.setHighLightPosition) {
			highlighted_index = request.setHighLightPosition;
		}

		if (request.getHighLightPosition) {
			if (highlighted_index != -1) {
				var send_highlight_index = highlighted_index;
				if (send_highlight_index != -1) {
					highlighted_index = -1;
					sendResponse(send_highlight_index);
				}
			}
		}

		if (request.getNavigationURL) {
			var navigation_to = navigation_url;
			if (navigation_to != null) {
				navigation_url = null;
				sendResponse(navigation_to);
			}
		}

		if (request.captureElementImage) {
			StartTabIndexGeneration();
		}

		if (request.getElementImage) {
			if (OBJECT_BASE64_IMAGE != "") {
				var image_base64_string = OBJECT_BASE64_IMAGE;
				// OBJECT_BASE64_IMAGE="";
				sendResponse(image_base64_string);
			} else {
				sendResponse("");
			}
		}

		if (request.CheckAddToTestCaseClicked) {
			if (initiate_test_case_add) {
				var data_to_send = initiate_test_case_add;
				initiate_test_case_add = false;
				sendResponse(data_to_send);
			} else {
				sendResponse(initiate_test_case_add);
			}
		}

		if (request.setResume) {
			isPaused = false;
		}

		if (request.cleanUp) {
			if (currentallrecordedsteps.length > 0) {
				currentallrecordedsteps = []
			}
			recorder_steps_evolve = [];
		}

		if (request.removeHighlight) {
			canHighlight = false;
		}

		if (request.CurrentNavigateWindow) {
			current_navigate_window = request.CurrentNavigateWindow;
		}

		if (request.setHighlight) {
			canHighlight = true;
		}

		if (request.getHighlightStatus) {
			sendResponse(canHighlight);
		}

		if (request.check) {
			if (recordingsteps != null) {
				sendResponse(currentallrecordedsteps)
				currentallrecordedsteps = []
				recordingsteps = null;
			}
		}
		if (request.domsdata) {
			spyanddomsdata = request.domsdata;
		}
		if (request.getDomsData) {
			if (spyanddomsdata != null) {
				sendResponse(spyanddomsdata);
				spyanddomsdata = null;
			}
		}
		if (request.calledapi) {
			var responsefromserver = sendToServer(request.calledapi);
			sendResponse(responsefromserver);
		}
		if (request.currentindexoftab) {
			sendResponse(currenttabindex);
		}

		if (request.setplaybackdata) {
			currentplybackdata = request.setplaybackdata
		}

		if (request.startIdentifyingTabs) {
			can_start_identifying_tabs = true;
		}

		if (request.stopIdentifyingTabs) {
			alltabsidandtitle = [];
			can_start_identifying_tabs = false;
		}

		if (request.getplaybackdata) {
			if (currentplybackdata != null) {
				sendResponse(currentplybackdata);
				currentplybackdata = null;
			}
		}

		if (request.addFrameStyle) {
			debugger
			chrome.tabs.query({}, function (tabs) {
				if (chrome.runtime.lastError) { }
				for (var ck = 0; ck < tabs.length; ck++) {
					var c_tab = tabs[ck];
					if (c_tab.active) {
						chrome.scripting.executeScript(
							{
								target: { tabId: c_tab.id },
								func: () => {
									try {
										const elshadowRoot = document.getElementById('opkey-recorderdiv-shadow').shadowRoot;
										const opkeyIframe = elshadowRoot.getElementById('opkey_recorder_iframe');
										opkeyIframe.style = 'position: fixed; inset: 0px; width: 100%; height: 100%; border: none; z-index: 2147483647; pointer-events: none; opacity: 1;';
									} catch (e) {
										// Handle error if needed
									}
								},
							},
							function (results) {
								if (chrome.runtime.lastError) {
									console.error(chrome.runtime.lastError.message);
								}
							}
						);

					}
				}
			});
			sendResponse("Done");
		}

		if (request.removeFrameStyle) {
			chrome.tabs.query({}, function (tabs) {
				if (chrome.runtime.lastError) { }
				for (var ck = 0; ck < tabs.length; ck++) {
					var c_tab = tabs[ck];
					if (c_tab.active) {
						chrome.scripting.executeScript(
							{
								target: { tabId: c_tab.id, allFrames: true },
								func: () => {
									try {
										const elshadowRoot = document.getElementById('opkey-recorderdiv-shadow').shadowRoot;
										const opkeyIframe = elshadowRoot.getElementById('opkey_recorder_iframe');
										opkeyIframe.style = 'position: fixed; inset: 0px; width: 100%; height: 100%; border: none; z-index: 2147483647; opacity: 1;';
									} catch (e) {
										// Handle error if needed
									}
								},
							},
							function (results) {
								if (chrome.runtime.lastError) {
									console.error(chrome.runtime.lastError.message);
								}
							}
						);

					}
				}
			});
			sendResponse("Done");
		}

		if (request.setDivLocation) {
			opkey_divLocation = request.setDivLocation
			sendResponse("Done");
		}

		if (request.getDivLocation) {
			sendResponse(opkey_divLocation);
		}

		if (request.getDockerData) {
			sendResponse(recorder_dockdata);
		}

		if (request.cleanDockerData) {
			recorder_dockdata = null;
		}

		if (request.setDockerData) {
			recorder_dockdata = request.setDockerData;
		}

		if (request.getDockerCommand) {
			var tempCommand = recorder_dockcommand;
			recorder_dockcommand = null;
			sendResponse(tempCommand);
		}

		if (request.getDockerCommand_temp) {
			(async () => {
				if (recorder_dockcommand_temp != null) {
					var response = JSON.parse(JSON.stringify(recorder_dockcommand_temp));
					response["TC_Id"] = await localStorage_getItem("RECORDER_FLOW_DB_ID");
					response["OR_Id"] = await localStorage_getItem("RECORDER_OR_DB_ID");
					response["TCStepIndex"] = await localStorage_getItem("TestCaseStepIndex");
					response["StepsCount"] = docker_stepcount;

					console.log("Data From Recorder " + JSON.stringify(response));
					var _action = response["action"];
					var _commandObject = new Object();
					_commandObject["TC_Id"] = response["TC_Id"];
					_commandObject["OR_Id"] = response["OR_Id"];
					_commandObject["TCStepIndex"] = response["TCStepIndex"];
					_commandObject["StepsCount"] = response["StepsCount"];
					if (_action === "pause") {
						_commandObject["Command"] = "PAUSE_RECORDING";
						submitRecorderCommandToOpkey(_commandObject);
					}

					if (_action === "play") {
						_commandObject["Command"] = "RESUME_RECORDING";
						submitRecorderCommandToOpkey(_commandObject);
					}

					if (_action === "run") {
						//	_commandObject["Command"]="";
						//	localStorage_setItem("TESTDISCOVERY_COMMANDS_RECORDER", JSON.stringify(_commandObject));
					}

					if (_action === "stoprecordingtestdiscovery") {
						debugger
						_commandObject["Command"] = "STOP_RECORDING";
						submitRecorderCommandToOpkey(_commandObject);
					}

					if (_action === "deleteStep") {
						_commandObject["Command"] = "DELETESTEP_RECORDING";
						submitRecorderCommandToOpkey(_commandObject);
					}
					recorder_dockcommand_temp = null;
					sendResponse(tempCommand);
				}
				else {
					sendResponse(null);
				}
			})();
		}

		if (request.setDockerCommand) {
			recorder_dockcommand = request.setDockerCommand;
			recorder_dockcommand_temp = request.setDockerCommand;

			//			console.log("In");
			console.log(recorder_dockcommand_temp);
		}

		if (request.setDockerCommandFromRecorder) {
			recorder_dockcommand_temp = request.setDockerCommandFromRecorder;
		}

		if (request.getDockerCommand_stepcount) {
			sendResponse(docker_stepcount);
		}

		if (request.setDockerCommand_stepcount) {
			docker_stepcount = request.setDockerCommand_stepcount;
		}

		if (request.SetCommonCommand) {
			common_command = request.SetCommonCommand;

			setTimeout(function () {
				common_command = null;
			}, 2000);

			sendResponse("Done");
		}

		if (request.RemoveCommonCommand) {
			common_command = null;

			sendResponse("Done");
		}

		if (request.GetCommonCommand) {
			let temp_data = common_command;
			sendResponse(temp_data);
		}

		if (request.getDockerCommand_dock) {
			var data = recorder_dockcommand_dock;
			if (data != null) {
				if (data.action == "deleteStep") {
					recorder_dockcommand_dock = null;
				}
				if (data.action == "notifymessage") {
					recorder_dockcommand_dock = null;
				}
			}
			sendResponse(data);
		}

		if (request.setDockerCommand_dock) {
			var _command = request.setDockerCommand_dock;
			if (_command.action == "deleteStep") {
				recorder_dockdata = null;
			}
			recorder_dockcommand_dock = _command;
		}

		if (request.startOracleEBSRecording) {
			setTimeout(async function () {
				var browser = request.startOracleEBSRecording.browser;
				var portNo = request.startOracleEBSRecording.port;
				setOOCRecorderPortNo(portNo);
				fetch("http://127.0.0.1:" + await getOOCRecorderPortNo() + "/_s_/dyn/Driver_startEBSLoadTestingApi", {
					method: "GET"
				})
					.then(response => {
						if (!response.ok) {
							throw new Error('Network response was not ok');
						}
						return response.text(); // or response.text(), depending on the expected response type
					})
					.then(succ_data => {
						stopFetchingEBSDomSpySteps();
						stopFetchingEBSSteps();
						startOracleEBSRecording();
					})
					.catch(err_data => {

					});
			}, 1000);
		}

		if (request.startOracleEBSRecording_LoadTest) {
			debugger
			setTimeout(async function () {
				debugger
				var browser = request.startOracleEBSRecording_LoadTest.browser;
				var portNo = request.startOracleEBSRecording_LoadTest.port;
				setOOCRecorderPortNo(portNo);
				console.log("Called startOracleEBSRecording_LoadTest");
				fetch("http://127.0.0.1:" + await getOOCRecorderPortNo() + "/_s_/dyn/Driver_launchAndRecord?browser=" + browser, {
					method: "GET"
				})
					.then(response => {
						if (!response.ok) {
							throw new Error('Network response was not ok');
						}
						return response.text(); // or response.text(), depending on the expected response type
					})
					.then(succ_data => {
						stopFetchingEBSDomSpySteps();
						stopFetchingEBSSteps();
						startFetchingEBS_LT_Steps();
					})
					.catch(err_data => {
					});
			}, 1000);
		}

		if (request.LaunchOracleEBSByJnLpData) {
			setTimeout(async function () {
				debugger
				var _jnlpData = request.LaunchOracleEBSByJnLpData;
				if (_jnlpData != null) {

					const url = "http://127.0.0.1:" + await getOOCRecorderPortNo() + "/_s_/dyn/Driver_launchFormsJNLPandStartOracleRecordingWithJNLPContent";
					const params = new URLSearchParams({
						"jnlpContent": btoa(_jnlpData)
					});

					fetch(url + "?" + params, {
						method: "GET",
					})
						.then(response => {
							if (!response.ok) {
								throw new Error('Network response was not ok');
							}
							return response.text(); // or response.text(), depending on the expected response type
						})
						.then(succ_data => {
							startOracleEBSRecording();
						})
						.catch(err_data => {
						});

				}
			}, 1000);
		}
		if (request.killAllJnlpProcesses) {
			stopFetchingEBSSteps();
			stopFetchingEBSDomSpySteps();
			killAllJnlpProcesses();
		}

		if (request.setRecorderStepsForEvolve) {

			var data = request.setRecorderStepsForEvolve;
			if (data != null) {
				recorder_steps_evolve = data;
			}
			sendResponse("");
		}

		if (request.getRecorderStepsForEvolve) {
			if (recorder_steps_evolve != null) {
				sendResponse(recorder_steps_evolve);
			}
			else {
				sendResponse([]);
			}
		}

		if (request.setRecorderStepsForDocker) {
			//recorderstepsfordocker = request.setRecorderStepsForDocker;
		}

		if (request.setRecorderStepsObjectPropertyForDocker) {
			recorderstepobjectproperty = request.setRecorderStepsObjectPropertyForDocker;
		}

		if (request.setSpyDomForDocker) {
			spydomsteps = request.setSpyDomForDocker;
		}

		if (request.setSpyDomObjectPropertyForDocker) {
			spydomstepsobjectproperty = request.setSpyDomObjectPropertyForDocker;
		}


		if (request.getRecorderStepsForDocker) {
			var tempData = recorderstepsfordocker;
			recorderstepsfordocker = [];
			sendResponse(tempData);
		}

		if (request.getRecorderStepsObjectPropertyForDocker) {
			var tempData = recorderstepobjectproperty;
			recorderstepobjectproperty = [];
			sendResponse(tempData);
		}

		if (request.getSpyDomForDocker) {
			var tempData = spydomsteps;
			spydomsteps = [];
			sendResponse(tempData);
		}

		if (request.getSpyDomObjectPropertyForDocker) {
			var tempData = spydomstepsobjectproperty;
			spydomstepsobjectproperty = [];
			sendResponse(tempData);
		}

		if (request.shrinkRecorderWindow) {
			shrinkRecorderWindow();
		}

		if (request.restoreRecorderWindow) {
			restoreRecorderWindow();
		}

		if (request.setwebltrecordedsteps) {

			var succ_data = request.setwebltrecordedsteps;
			if (succ_data != null) {
				debugger
				if (isPaused == false) {
					let MAX_STEPS = 500;
					var currentArrays = JSON.parse(succ_data);
					const safeSteps = currentArrays.slice(0, MAX_STEPS);
					for (var ai = 0; ai < safeSteps.length; ai++) {
						var stepObject = safeSteps[ai];

						if (Array.isArray(stepObject)) {
							for (var ai2 = 0; ai2 < stepObject.length; ai2++) {
								var stepObject2 = stepObject[ai2];
								//stepObject2.arguments[0]["EBSForms"] = "true";
								var logicalName = "";
								if (stepObject2.arguments[0]["column"] != null) {
									logicalName = stepObject2.arguments[0]["column"];
								}
								else if (stepObject2.arguments[0]["sahiText"] != null) {
									logicalName = stepObject2.arguments[0]["sahiText"];
								} else if (stepObject2.arguments[0]["innertext"] != null) {
									logicalName = stepObject2.arguments[0]["innertext"];
								} else if (stepObject2.arguments[0]["name"] != null) {
									logicalName = stepObject2.arguments[0]["name"];
								} else if (stepObject2.arguments[0]["prompt"] != null) {
									logicalName = stepObject2.arguments[0]["prompt"];
								} else if (stepObject2.arguments[0]["class"] != null) {
									logicalName = stepObject2.arguments[0]["class"];
								}
								stepObject2.arguments[0]["logicalname"] = logicalName;
								currentallrecordedsteps.push(JSON.stringify(stepObject2));
							}
						}
						else {
							//stepObject.arguments[0]["EBSForms"] = "true";
							var logicalName = "";
							if (stepObject.arguments[0]["column"] != null) {
								logicalName = stepObject.arguments[0]["column"];
							}
							else if (stepObject.arguments[0]["sahiText"] != null) {
								logicalName = stepObject.arguments[0]["sahiText"];
							} else if (stepObject.arguments[0]["innertext"] != null) {
								logicalName = stepObject.arguments[0]["innertext"];
							} else if (stepObject.arguments[0]["name"] != null) {
								logicalName = stepObject.arguments[0]["name"];
							} else if (stepObject.arguments[0]["prompt"] != null) {
								logicalName = stepObject.arguments[0]["prompt"];
							} else if (stepObject.arguments[0]["class"] != null) {
								logicalName = stepObject.arguments[0]["class"];
							}
							stepObject.arguments[0]["logicalname"] = logicalName;
							currentallrecordedsteps.push(JSON.stringify(stepObject));
							debugger
						}
					}
					recordingsteps = succ_data;
				}
			}
			sendResponse({});
		}

		if (request.launchLastDownloadedJnlp) {
			launchLastDownloadedJnlp();
			sendResponse({});
		}


		if (request.LaunchOpkeyTestRunner) {
			launchImageUtility(request.LaunchOpkeyTestRunner);
			sendResponse("");
		}

		if (request.CloseEditorWindow) {
			closeEditorOfDocker();
			sendResponse("");
		}

		if (request.InjectFid) {
			injectFidInOpkeyOne(request.InjectFid);
			sendResponse("");
		}

		if (request.InjectQLMResponse) {
			if (request.InjectQLMResponse != null) {
				if (useExt) {
					localStorage_setItem("QLM_Response", JSON.stringify(request.InjectQLMResponse));
				}
				injectQLMResponseInOpkeyOne(request.InjectQLMResponse);
			}
			sendResponse("");
		}

		if (request.SetOpkeyOneManualBinding) {
			var bindingObject = request.SetOpkeyOneManualBinding;

			localStorage_removeItem("QLM_Response");
			localStorage_removeItem("AppUtilityType");
			localStorage_removeItem("capture_step_data");

			localStorage_setItem("ManualFlowBPGroupID", bindingObject["ManualFlowBPGroupID"]);
			localStorage_setItem("SessionID", bindingObject["SessionID"]);
			localStorage_setItem("Domain", bindingObject["url"]);

			blinkIcon();
			chrome.notifications.create(createUUID(), {
				type: 'basic',
				iconUrl: 'icons/addon128.png',
				title: 'OpkeyTestRunner',
				message: 'Click on OpkeyTestRunner icon to edit.',
				priority: 2
			})
			sendResponse("");
		}

		if (request.SetOpkeyOneJourneyDtoBinding) {
			opkeyOneManualBinding = request.SetOpkeyOneJourneyDtoBinding;
			sendResponse("Done");
		}

		if (request.GetOpkeyOneJourneyDtoBinding) {
			var tempData = opkeyOneManualBinding;
			opkeyOneManualBinding = null;
			sendResponse(tempData);
		}

		if (request.SetOpkeyOne_addon_binding) {
			var bindingObject = request.SetOpkeyOne_addon_binding;
			if (bindingObject != null) {
				console.log(bindingObject);
				if (bindingObject["state"] == "Close") {
					stopBlinking();
				}
			}
			Local_store_data = bindingObject;
			bindingObject = JSON.stringify(bindingObject);
			//bindingObject = JSON.stringify(bindingObject);
			chrome.tabs.query({}, function (tabs) {
				for (var t_i = 0; t_i < tabs.length; t_i++) {
					if (tabs[t_i].url.indexOf("opkeyone")) {
						chrome.scripting.executeScript(
							{
								target: { tabId: tabs[t_i].id },
								func: (bindingObject) => {
									localStorage.setItem("manual_runner_addon_state", bindingObject);
								},
								args: [bindingObject], // Pass bindingObject as an argument to the function
							},
							function (results) {
								// Handle results if needed
							}
						);

					}
				}
			});
			sendResponse("");
		}
		if (request.get_local_store_data) {
			var tempVar = Local_store_data;
			//Local_store_data = null;
			sendResponse(tempVar);
		}

		if (request.StartDesktopRecording) {
			var appPath = request.StartDesktopRecording.appPath;
			var portNo = request.StartDesktopRecording.port;
			var isRemoteDebuggingEnabled = request.StartDesktopRecording.RemoteDebuggingEnabled;
			setOOCRecorderPortNo(portNo);
			setIsRemoteDebuggingEnabled(isRemoteDebuggingEnabled);

			startDesktopRecording(appPath, isRemoteDebuggingEnabled);
			sendResponse("");
		}



		if (request.StartMainFrameRecording) {
			var appPath = request.StartMainFrameRecording.appPath;
			var portNo = request.StartMainFrameRecording.port;
			setOOCRecorderPortNo(portNo);

			startMainframeRecording(appPath);
			sendResponse("");
		}

		if (request.StartRecorderAddon) {
			localStorage_setItem("EXTENSION_OPENED", "WINDOW");
			StartRecorderAddon();
			sendResponse("");
		}

		if (request.stopVideoRecording) {
			videoRecorderTimeArray.push({ "time": Date.now(), "state": "STOP" });
			stopVideoRecorderBlinking();
			stopVideoRecording(request.stopVideoRecording);
			sendVideoEditorWindowMessage("STOPRECORDING");
			sendResponse("");
		}

		if (request.sendMessageToAllTabs) {
			sendVideoEditorWindowMessage(request.sendMessageToAllTabs);
			sendResponse("");
		}

		if (request.FetchRecordedVideo) {
			(async function () {
				if (videoProcessingStatus != null && videoProcessingStatus == "INPROGRESS") {
					sendResponse("INPROGRESS");
					return;
				}

				var url = await sendMessageToOffscreenScript("offscreen_createObjectURL_fixduration", { "recordedChunks": currentVideoBase64, "duration": globalDuration });

				sendResponse(url);
			})();
		}

		if (request.CancelVideoUploadRequest) {
			if (uploadVideoXhrRequest != null) {
				uploadVideoXhrRequest.abort();
				uploadVideoXhrRequest = null;
			}
			sendResponse("");
		}

		if (request.uploadVideoRecording) {
			UploadCapturedVideo(request.uploadVideoRecording);
			sendResponse("");
		}

		if (request.GetVideoUploadStatus) {
			sendResponse(videouploadstatus);
		}

		if (request.ResetVideoUploadStatus) {
			if (request.ResetVideoUploadStatus != null && request.ResetVideoUploadStatus == "STOPSESSION") {
				closeEditorOfDocker();
			}
			if (videouploadstatus != "STARTINGCAPTURING") {
				videouploadstatus = "";
			}
			sendResponse("");
		}


		if (request.SetVideoProcessingStatus) {
			videoProcessingStatus = request.SetVideoProcessingStatus;
			sendResponse("");
		}

		if (request.SetVideoUploadStatus) {
			videouploadstatus = request.SetVideoUploadStatus;
			if (videouploadstatus != null && videouploadstatus == "INCOMPLETE") {
				stopVideoRecorderBlinking();
			}
			sendResponse("");
		}

		if (request.SetVideoRecorderEditorStatus) {
			videorecordereditorstatus = request.SetVideoRecorderEditorStatus;
			sendResponse("");
		}

		if (request.pauseVideoRecording) {
			videoRecorderTimeArray.push({ "time": Date.now(), "state": "PAUSE" });
			pauseVideoRecording();
			sendVideoEditorWindowMessage("PAUSERECORDING");
			sendResponse("");
		}

		if (request.resumeVideoRecording) {
			videoRecorderTimeArray.push({ "time": Date.now(), "state": "RESUME" });
			resumeVideoRecording();
			sendVideoEditorWindowMessage("RESUMERECORDING");
			sendResponse("");
		}
		if (request.downloadRecordedVideo) {
			downloadRecordedVideo(request.downloadRecordedVideo);
			sendResponse("");
		}

		if (request.downloadRecordedVideoForDocker) {
			(async function () {
				if (videoProcessingStatus != null && videoProcessingStatus == "INPROGRESS") {
					sendResponse("INPROGRESS");
					return;
				}
				var url = await sendMessageToOffscreenScript("offscreen_createObjectURL", { "recordedChunks": currentVideoBase64 });
				sendResponse(url);
			})();
		}

		if (request.GetQLMCompaninionUrl) {
			sendResponse(chrome.runtime.getURL("ManualTcAndQLM/MainDocker.html"));
		}

		if (request.GetAutoflUiUrl) {
			sendResponse(chrome.runtime.getURL("AutoFLGenerator/UI/autoflui.html"));
		}

		if (request.GetUserStoryPage) {
			sendResponse(chrome.runtime.getURL("/Login.html?callsource=docker&automaticview=createuserstory"));
		}

		if (request.GetTicketPage) {
			sendResponse(chrome.runtime.getURL("/Login.html?callsource=docker&automaticview=createticket"));
		}

		if (request.GetQlmVideoEditorPage) {
			sendResponse(chrome.runtime.getURL("/Login.html?callsource=docker&automaticview=captureqlmvideo"));
		}

		if (request.GetQlmImageEditorPage) {
			sendResponse(chrome.runtime.getURL("/Login.html?callsource=docker&automaticview=captureqlmimage"));
		}

		if (request.GetVideoEditorStatus) {
			var temp = videorecordereditorstatus;
			videorecordereditorstatus = null;
			sendResponse(temp);
		}

		if (request.ShowVideoEditorInFront) {
			try {
				chrome.windows.update(iamgecropping_win_id, {
					focused: true
				});
			} catch (e) { }
			setTimeout(function () {
				try {
					chrome.windows.update(image_cropping_fullpage_win_id, {
						focused: true
					});
				} catch (e) { }
			}, 1000);
			sendResponse("");
		}
		if (request.ResizeVideoEditorWindow) {
			chrome.system.display.getInfo(function (displayInfo) {
				var _bounds = displayInfo[0].bounds;
				var _height = _bounds.height;
				_height = Math.trunc(_height);
				_height = _height - 50;
				var fromTop = _height - 400;
				chrome.windows.update(iamgecropping_win_id, {
					left: 0,
					top: fromTop,
					width: 450,
					height: 400
				});

			});

			sendResponse("");
		}

		if (request.Window_PostMessage) {
			postMessageData = request.Window_PostMessage;
			sendResponse("");
		}

		if (request.Window_FetchMessage) {
			var tempdata = postMessageData;
			postMessageData = null;
			sendResponse(tempdata);
		}

		if (request.EnableQlmManualAddonDocker) {
			last_dockerShowingStatus = true;
			enableQlmManualAddonDocker();
			sendResponse("");
		}

		if (request.DisableQlmManualAddonDocker) {
			last_dockerShowingStatus = false;
			disableQlmManualAddonDocker();
			sendResponse("");
		}

		if (request.IsDockerUIShowing) {
			sendResponse(dockerShowing);
		}

		if (request.DownloadSnapshotData) {
			downloadImage(request.DownloadSnapshotData);
			sendResponse("");
		}

		if (request.SetOpkeyOneVars) {
			setOpkeyVars();
			sendResponse("");
		}

		if (request.RESETOPKEYEXECUTIONINFORMATION) {
			turnOffManualRun();
			sendResponse("");
		}
		if (request.userjourney === "tracking started") {
			blink_User_Guide_Icon();
			sendResponse({ status: "Tracking started successfully" });
		}
		if (request.userjourney === "tracking stoped") {
			debugger;
			stopBlinking();
			sendResponse({ status: "Tracking Stoped successfully" });
		}
		return true;
	});


function addRecordedData(recordeddata) {

	return new Promise(function (resolve) {
		setTimeout(function () {



			if (isPaused == false) {
				chrome.tabs.query({
					active: true, currentWindow: true
				}, async (tabs) => {
					var focusedTabHandleId = -1;
					if (tabs.length > 0) {
						if (tabs.length > 0) {
							focusedTabHandleId = tabs[tabs.length - 1].id;
						}
						if (recordeddata.indexOf("[") == 0) {
							var temp_step_array = JSON.parse(recordeddata);
							for (var t_s_a = 0; t_s_a < temp_step_array.length; t_s_a++) {
								var temp_object = temp_step_array[t_s_a];
								temp_object["TabHandle"] = focusedTabHandleId;
								await createImageOfElement(temp_object, WINDOW_CURRENT_IAMGE_BASE64);
							}
						} else {
							var temp_object = JSON.parse(recordeddata);
							temp_object["TabHandle"] = focusedTabHandleId;
							await createImageOfElement(temp_object, WINDOW_CURRENT_IAMGE_BASE64);
						}
					}
				});
			}
			resolve(true);
		}, 200);
	});
}

function sendVideoEditorWindowMessage(_message) {
	chrome.tabs.query({}, function (tabs) {
		for (var ti = 0; ti < tabs.length; ti++) {
			var _tab = tabs[ti];
			chrome.tabs.sendMessage(_tab.id, _message);
		}
	});
}

function sendMessageToActiveTab(_message) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		for (var ti = 0; ti < tabs.length; ti++) {
			var _tab = tabs[ti];
			chrome.tabs.sendMessage(_tab.id, _message);
		}
	});
}

function downloadImage(pngData) {
	var a = document.createElement('a');
	a.style = 'display: none';
	a.href = pngData;
	a.download = "Neoon" + '.png';
	a.click();
}

var ebsFetchThreadId = -1;
var ebsDomSpyFetchThreadId = -1;

async function startRumWin32Recording(requestData) {
	let appPath = requestData.appPath
	let portNo = requestData.portNo
	setOOCRecorderPortNo(portNo)

	let oocPortNo = await getOOCRecorderPortNo();
	return new Promise(async function (resolve) {

		fetch("http://127.0.0.1:" + await getOOCRecorderPortNo() + "/_s_/dyn/Driver_startRumWin32Recording?appPath=" + encodeURIComponent(appPath), {
			method: "GET"
		})
			.then(response => {
				if (!response.ok) {
					return "Error: Port No is not valid!";
				}
				return response.text();
			})
			.then(succ_data => {
				resolve(succ_data);
			})
			.catch(err_data => {
				resolve("Error: Check Smart Recorder is running and provided Port no is correct or not!");
			});

	});
}

async function stopRumWin32Recording() {
	fetch("http://127.0.0.1:" + await getOOCRecorderPortNo() + "/_s_/dyn/Driver_stopRumWin32Recording", {
		method: "GET"
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.text(); // or response.text(), depending on the expected response type
		})
		.then(succ_data => {
		})
		.catch(err_data => {
		});
}

async function fetchRumRecordedSteps() {
	let oocPortNo = await getOOCRecorderPortNo();
	return new Promise(async function (resolve) {

		fetch("http://127.0.0.1:" + oocPortNo + "/_s_/dyn/Driver_fetchRumRecordedSteps", {
			method: "GET"
		})
			.then(response => {
				if (!response.ok) {
					return null;
				}
				return response.text(); // or response.text(), depending on the expected response type
			})
			.then(succ_data => {
				resolve(succ_data);
			})
			.catch(err_data => {
				resolve(null);
			});

	});
}

async function startWin32InAppPromptService(requestData) {
	let oocPortNo = await getOOCRecorderPortNo();
	let journeySessionId = JSON.stringify(requestData);
	fetch("http://127.0.0.1:" + oocPortNo + "/_s_/dyn/Driver_startWin32InAppPrompt", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: "journeySessionId=" + encodeURIComponent(journeySessionId)
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.text(); // or response.text(), depending on the expected response type
		})
		.then(succ_data => {
		})
		.catch(err_data => {
		});
}

async function stopWin32InAppPromptService() {
	let oocPortNo = await getOOCRecorderPortNo();
	fetch("http://127.0.0.1:" + oocPortNo + "/_s_/dyn/Driver_stopWin32InAppPrompt", {
		method: "GET"
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.text(); // or response.text(), depending on the expected response type
		})
		.then(succ_data => {
		})
		.catch(err_data => {
		});
}

async function fetchAndUpdateWin32InAppPromptService(requestData) {
	console.log("Data we got", requestData);
	let oocPortNo = await getOOCRecorderPortNo();

	let dataToSend = JSON.stringify(requestData);

	return new Promise(async function (resolve) {

		fetch("http://127.0.0.1:" + oocPortNo + "/_s_/dyn/Driver_fetchAndUpdateWin32InAppPrompt", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: "currentData=" + encodeURIComponent(dataToSend)
		})
			.then(response => {
				if (!response.ok) {
					resolve("Error: Port No is not valid!");
					return;
				}
				return response.text();
			})
			.then(succ_data => {
				resolve(succ_data);
			})
			.catch(err_data => {
				resolve("Error: Check Smart Recorder is running and provided Port no is correct or not!");
			});

	});
}

async function checkInAppPromptStatus() {
	let oocPortNo = await getOOCRecorderPortNo();
	return new Promise(async (resolve, reject) => {

		try {
			const response = await fetch("http://127.0.0.1:" + oocPortNo + "/_s_/dyn/Driver_getWin32InAppPromptStatus", {
				method: "GET"
			});

			const data = await response.json();

			resolve(data);

		} catch (err) {
			console.error("Error checking prompt status", err);
			reject(err);
		}
	});
}

async function resetWin32InAppPromptStatus() {
	let oocPortNo = await getOOCRecorderPortNo();
	fetch("http://127.0.0.1:" + oocPortNo + "/_s_/dyn/Driver_resetWin32InAppPromptStatus", {
		method: "GET"
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.text(); // or response.text(), depending on the expected response type
		})
		.then(succ_data => {
		})
		.catch(err_data => {
		});
}

async function startOracleEBSRecording() {
	fetch("http://127.0.0.1:" + await getOOCRecorderPortNo() + "/_s_/dyn/Driver_resumeOpkeyRecording", {
		method: "GET"
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.text(); // or response.text(), depending on the expected response type
		})
		.then(succ_data => {
			//startFetchingEBSSteps();
			startFetchingEBS_LT_Steps();
		})
		.catch(err_data => {
		});
}



async function startDesktopRecording(_appPath, _isRemoteDebuggingEnabled) {
	debugger
	fetch("http://127.0.0.1:" + await getOOCRecorderPortNo() + "/_s_/dyn/Driver_startNativeRecording?path=" + encodeURIComponent(_appPath) + "&isRemoteDebuggingEnabled=" + encodeURIComponent(_isRemoteDebuggingEnabled), {
		method: "GET"
	})
		.then(response => {
			debugger
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.text(); // or response.text(), depending on the expected response type
		})
		.then(succ_data => {
			debugger
			stopFetchingEBSSteps();
			startFetchingEBS_LT_Steps();
		})
		.catch(err_data => {
			debugger
		});
}

async function startMainframeRecording(_appPath) {
	debugger
	fetch("http://127.0.0.1:" + await getOOCRecorderPortNo() + "/_s_/dyn/Driver_startNativeMainFrameRecording?path=" + encodeURIComponent(_appPath), {
		method: "GET"
	})
		.then(response => {
			debugger
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.text(); // or response.text(), depending on the expected response type
		})
		.then(succ_data => {
			debugger
			stopFetchingEBSSteps();
			startFetchingEBS_LT_Steps();
		})
		.catch(err_data => {
			debugger
		});
}


async function killAllJnlpProcesses() {
	fetch("http://127.0.0.1:" + await getOOCRecorderPortNo() + "/_s_/dyn/Driver_killRecorder", {
		method: "GET"
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.text(); // or response.text(), depending on the expected response type
		})
		.then(succ_data => {
			stopFetchingEBSSteps();
			stopFetchingEBSDomSpySteps();
		})
		.catch(err_data => {
		});
}


async function fetchEBS_LT_ResponseData() {
	fetch("http://127.0.0.1:" + await getOOCRecorderPortNo() + "/_s_/dyn/Driver_getFiddlerResponseData", {
		method: "GET"
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.text(); // Assuming the response is a text that needs to be parsed as JSON
		})
		.then(succ_data => {
			if (succ_data !== "") {
				var responseList = JSON.parse(succ_data);
				//console.log(responseList);
				ebsRequestResponseList = responseList;
			}
		})
		.catch(err_data => {
			// Handle any potential errors here, if needed
			console.error('There was a problem with the fetch operation:', err_data);
		});
}

let isFetchingEBS = false;
const MAX_PAYLOAD_LENGTH = 500000; // maximum allowed JSON string length
const MAX_OUTER_ITEMS = 1000;   // maximum outer array length
const MAX_INNER_ITEMS = 500;    // maximum inner array length
const FETCH_INTERVAL_MS = 1000;   // 1 second polling interval

function startFetchingEBS_LT_Steps() {
	// Start the polling loop
	fetchLoop();
}

async function fetchLoop() {
	// Prevent overlapping fetch requests
	if (isFetchingEBS) {
		setTimeout(fetchLoop, FETCH_INTERVAL_MS);
		return;
	}
	isFetchingEBS = true;

	// Perform the data fetch (replace URL or logic as needed)
	fetch("http://127.0.0.1:" + await getOOCRecorderPortNo() + "/_s_/dyn/Driver_getNativeRecordedSteps")
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.text();
		})
		.then(text => {
			fetchEBS_LT_ResponseData();
			if (text == null || text == "") {
				return;
			}
			// Cap JSON payload length to prevent large payload DoS
			if (text.length > MAX_PAYLOAD_LENGTH) {
				console.warn('Payload exceeds maximum allowed length, skipping processing.');
				return;
			}
			let data;
			try {
				data = JSON.parse(text);
			} catch (err) {
				console.error('Failed to parse JSON:', err);
				return;
			}

			// Ensure data is an array for iteration
			const items = Array.isArray(data) ? data : [data];

			// Iterate through outer array with explicit cap
			for (let i = 0; i < MAX_OUTER_ITEMS; i++) {
				if (i >= items.length) break;
				const item = items[i];
				if (Array.isArray(item)) {
					// If inner array, iterate with cap
					for (let j = 0; j < MAX_INNER_ITEMS; j++) {
						if (j >= item.length) break;
						enrichAndPush(item[j]);
					}
				} else {
					// Process non-array item
					enrichAndPush(item);
				}
			}

			recordingsteps = text;
		})
		.catch(err => {
			console.error('Error during fetch or processing:', err);
		})
		.finally(() => {
			isFetchingEBS = false;
			// Schedule the next fetch
			setTimeout(fetchLoop, FETCH_INTERVAL_MS);
			setTimeout(startFetchingEBSDomSpySteps, FETCH_INTERVAL_MS);
		});
}


function enrichAndPush(stepObj) {
	if (checkIsRecorderRecordingItSelf(stepObj)) {
		return;
	}
	if (isPaused == false) {
		const args = stepObj.arguments?.[0] || {};
		const candidates = ['column', 'sahiText', 'innertext', 'name', 'prompt', 'class', 'className', 'tagName'];
		let logicalName = '';

		for (const key of candidates) {
			if (args[key]) {
				logicalName = args[key];
				break;
			}
		}

		args.logicalname = logicalName;
		currentallrecordedsteps.push(JSON.stringify(stepObj));
	}
}

function checkIsRecorderRecordingItSelf(stepObj) {
	let pageTitle = stepObj?.arguments[0]?.title;
	let pageData = stepObj?.arguments[1]?.data;
	if (pageTitle != null && (pageTitle?.toLowerCase() === "recorder" || pageData?.toLowerCase() === "recorder")) {
		return true;
	}
	return false;
}


async function startFetchingEBSDomSpySteps() {
	stopFetchingEBSDomSpySteps();
	fetch("http://127.0.0.1:" + await getOOCRecorderPortNo() + "/_s_/dyn/Driver_getSpyDataForDesktopRecorder", {
		method: "GET"
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.text(); // Assuming the response is text
		})
		.then(succ_data => {
			if (succ_data !== "") {
				spyanddomsdata = succ_data.substring(1, succ_data.length - 1);
			}
		})
		.catch(err_data => {
			stopFetchingEBSDomSpySteps();
		});
}


function stopFetchingEBSSteps() {
	clearTimeout(ebsFetchThreadId);
}

function stopFetchingEBSDomSpySteps() {
	clearTimeout(ebsDomSpyFetchThreadId);
}

function setOOCRecorderPortNo(portNo) {
	localStorage_setItem("OOC_RECORDER_PORTNO", portNo);
}
function setIsRemoteDebuggingEnabled(isRemoteDebuggingEnabled) {
	localStorage_setItem("isRemoteDebuggingEnabled", isRemoteDebuggingEnabled);
}

async function getOOCRecorderPortNo() {
	var oocPortNo = await localStorage_getItem("OOC_RECORDER_PORTNO");
	if (oocPortNo == null || oocPortNo == "") {
		localStorage_setItem("OOC_RECORDER_PORTNO", "5201");
		return "5201";
	}
	return oocPortNo;
}
async function getRemoteDebuggingEnabled() {
	var IsRemoteDebuggingEnabled = await localStorage_getItem("isRemoteDebuggingEnabled");
	// if (IsRemoteDebuggingEnabled == null || oocPortNo == "") {
	// 	localStorage_setItem("OOC_RECORDER_PORTNO", "5201");
	// 	return "5201";
	// }
	return IsRemoteDebuggingEnabled;
}


async function launchLastDownloadedJnlp() {
	fetch("http://127.0.0.1:" + await getOOCRecorderPortNo() + "/_s_/dyn/Driver_launchLatestDownloadedJnlp", {
		method: "GET"
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			// Handle success if needed
			return response.text(); // or response.json(), depending on expected response type
		})
		.catch(err_data => {

		});
}



SaveWindowImageInMemory();



// OPkey Test Runner area


//
var _stopblinking = false;
var _stopVideoblinking = false;
function blinkIcon() {
	_stopblinking = false;
	setTimeout(function () {
		if (_stopblinking == true) {
			_stopblinking = false;
			return;
		}
		chrome.action.setIcon({ path: "ManualTcAndQLM/icons/blink1.png" });
		setTimeout(function () {
			if (_stopblinking == true) {
				_stopblinking = false;
				return;
			}
			chrome.action.setIcon({ path: "ManualTcAndQLM/icons/blink2.png" });
			blinkIcon();
		}, 500);
	}, 500);
}
function blink_User_Guide_Icon() {
	_stopblinking = false;

	setTimeout(function () {
		if (_stopblinking) return;
		chrome.action.setIcon({ path: "ManualTcAndQLM/icons/blink1.png" });

		setTimeout(function () {
			if (_stopblinking) return;
			chrome.action.setIcon({ path: "ManualTcAndQLM/icons/blink3.png" });

			if (!_stopblinking) {
				blink_User_Guide_Icon();
			}
		}, 500);
	}, 500);
}


function stopBlinking() {
	debugger;
	_stopblinking = true;
	setTimeout(function () {
		chrome.action.setIcon({ path: "ManualTcAndQLM/icons/addon128.png" });
	}, 800);
}

function blinkVideoRecorderIcon() {
	_stopVideoblinking = false;
	setTimeout(function () {
		if (_stopVideoblinking == true) {
			_stopVideoblinking = false;
			return;
		}
		chrome.action.setIcon({ path: "ManualTcAndQLM/icons/blink1.png" });
		setTimeout(function () {
			if (_stopVideoblinking == true) {
				_stopVideoblinking = false;
				return;
			}
			chrome.action.setIcon({ path: "ManualTcAndQLM/icons/blink3.png" });
			blinkVideoRecorderIcon();
		}, 500);
	}, 500);
}

function stopVideoRecorderBlinking() {
	_stopVideoblinking = true;
	setTimeout(function () {
		chrome.action.setIcon({ path: "ManualTcAndQLM/icons/addon128.png" });
	}, 800);
}

//this method invoke when using extension for recording img
let useExt = false;
function fetchDataFromOpkeyAndInvoke() {
	setTimeout(async function () {
		var ldata = await localStorage_getItem("OpkeyTestRunnerSnapData");
		if (ldata != null && ldata != "") {
			var utilidata = JSON.parse(ldata);
			localStorage_setItem("OpkeyTestRunnerSnapData", "");
			launchImageUtility(utilidata);
			useExt = true;
		}
		fetchDataFromOpkeyAndInvoke();
	}, 500);
}

fetchDataFromOpkeyAndInvoke();

function turnOffVideoEditor() {
	sendVideoEditorWindowMessage("StopVideoRecording");
	if (videouploadstatus != "FETCHING" && videouploadstatus != "COMPLETED" && videouploadstatus != "" && videouploadstatus != "STARTINGCAPTURING") {
		console.log("sETTING STATUS " + videouploadstatus);
		stopVideoRecorderBlinking();
		videouploadstatus = "INCOMPLETE";
	}
	sendVideoEditorWindowMessage("DISCARDVIDEOEDITOR");
	localStorage_setItem("VideoEditorStatus", "CLOSED");
}

function closeEditorWindow() {
	if (iamgecropping_win_id == -1) {
		return;
	}
	chrome.windows.remove(iamgecropping_win_id, function () { });
	iamgecropping_win_id = -1;
	if (image_cropping_fullpage_win_id == -1) {
		return;
	}
	chrome.windows.remove(image_cropping_fullpage_win_id, function () { });
	image_cropping_fullpage_win_id = -1;
}

function closeEditorOfDocker() {
	turnOffVideoEditor();
	if (image_cropping_fullpage_win_id != -1) {
		chrome.windows.remove(image_cropping_fullpage_win_id, function () { });
		image_cropping_fullpage_win_id = -1;
	}
	if (iamgecropping_win_id == -1) {
		return;
	}
	chrome.windows.remove(iamgecropping_win_id, function () { });
	iamgecropping_win_id = -1;

}

function injectFidInOpkeyOne(fid) {
	var _obj = {
		"F_ID": fid
	};
	var _data = JSON.stringify(_obj);
	localStorage_setItem("ManualRunnerSnapshotF_ID", _data);
	//_data = JSON.stringify(_data);
	console.log(_data);
	chrome.tabs.query({}, function (tabs) {
		for (var t_i = 0; t_i < tabs.length; t_i++) {
			if (tabs[t_i].url.indexOf("opkeyone")) {
				chrome.scripting.executeScript(
					{
						target: { tabId: tabs[t_i].id },
						func: (_data) => {
							localStorage.setItem("ManualRunnerSnapshotF_ID", _data);
						},
						args: [_data], // Pass _data as an argument to the function
					},
					function (results) {
						// Handle results if needed
					}
				);

			}
		}
	});
}

function injectQLMResponseInOpkeyOne(_obj) {
	var _data = JSON.stringify(_obj);
	//	_data = JSON.stringify(_data);
	chrome.tabs.query({}, function (tabs) {
		for (var t_i = 0; t_i < tabs.length; t_i++) {
			if (tabs[t_i].url.indexOf("opkeyone")) {
				chrome.scripting.executeScript(
					{
						target: { tabId: tabs[t_i].id },
						func: (_data) => {
							localStorage.setItem("QLM_Response", _data);
						},
						args: [_data], // Pass _data as an argument to the function
					},
					function (results) {
						// Handle results if needed
					}
				);

			}
		}
	});
}

var opkey_image_stream = null;
function enableQlmManualAddonDocker() {
	dockerShowing = true;
	chrome.tabs.query({}, function (tabs) {
		for (var ti = 0; ti < tabs.length; ti++) {
			var _tab = tabs[ti];
			chrome.scripting.executeScript(
				{
					target: { tabId: _tab.id, allFrames: true },
					func: () => {
						sessionStorage.setItem('OPKEY_QLMMANUALDOCKER_ENABLED', 'true');
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
}

function disableQlmManualAddonDocker() {
	dockerShowing = false;
	chrome.tabs.query({}, function (tabs) {
		for (let ti = 0; ti < tabs.length; ti++) {
			const _tab = tabs[ti];
			chrome.scripting.executeScript(
				{
					target: { tabId: _tab.id, allFrames: true },
					func: () => {
						sessionStorage.setItem('OPKEY_QLMMANUALDOCKER_ENABLED', 'false');
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
}




function focusOnSharedTab() {
	chrome.tabs.query({}, function (tabs) {
		for (var ti = 0; ti < tabs.length; ti++) {
			var _tab = tabs[ti];
			console.log(_tab);
		}
	});
}


var fullPageScreenshotbase64 = null;
var triggerFullPageScreenShot = false;
var imageFetchThreadId = -1;
function openImageSnapshotWindow_new_fullpage(captureMode) {
	clearTimeout(imageFetchThreadId);
	WINDOW_CURRENT_IAMGE_BASE64 = null;
	triggerFullPageScreenShot = true;
	screenshotEnd = false;
	var shared = new Object();
	shared.originalScrollTop = null;
	shared.tab = new Object();
	shared.tab.hasVscrollbar = null;
	try {
		if (qlm_desktopCaptureRequestId != -1) {
			chrome.desktopCapture.cancelChooseDesktopMedia(qlm_desktopCaptureRequestId);
		}
	} catch (e) { }
	closeEditorWindow();

	if (captureMode != null && captureMode == "CAPTUREIMGAEVISIBLEAREA") {
		opkey_screenshotVisibleAreaNoScroll(shared);
	}
	else if (captureMode != null && captureMode == "CAPTUREIMGAEFULLPAGE") {
		opkey_screenshotBegin(shared);
	}
	else if (captureMode != null && captureMode == "CAPTUREIMGAEOFOTHERWINDOW") {
		openImageCaptureForOtherTabs();
	}
	else {
		opkey_screenshotBegin(shared);
	}

	videouploadstatus = "STARTINGCAPTURING";
	var breakTimeoutLoop = false;
	imageFetchThreadId = setTimeout(function imageFetch() {
		if (WINDOW_CURRENT_IAMGE_BASE64 != null) {
			clearTimeout(imageFetchThreadId);
			breakTimeoutLoop = true;
			videouploadstatus = "INPROGRESS";
			chrome.system.display.getInfo(function (displayInfo) {
				var _bounds = displayInfo[0].bounds;
				var _width = _bounds.width;
				var _height = _bounds.height;
				_width = Math.trunc(_width);
				_height = Math.trunc(_height);
				chrome.windows.create({
					url: chrome.runtime.getURL("/ManualTcAndQLM/ImageEditor.html"),
					type: 'panel',
					state: "normal",
					left: 0,
					top: 0,
					width: _width,
					height: _height
				}, async function (win) {
					if (chrome.runtime.lastError) { }
					//video.pause();
					image_cropping_fullpage_win_id = win.id;
					localStorage_setItem("IMAGE_CROPPING_WIN", win.id);
					await sendMessageToCurrentTab("image_stop_stream", {});
				});

			});

			chrome.windows.onRemoved.addListener(async function (window_id) {
				var imagewinid = await localStorage_getItem("IMAGE_CROPPING_WIN");
				if (imagewinid == window_id) {
					if (videouploadstatus != "FETCHING" && videouploadstatus != "COMPLETED") {
						videouploadstatus = "INCOMPLETE";
						stopVideoRecorderBlinking();
					}
					if (opkey_image_stream != null) {
						opkey_image_stream.getTracks()[0].stop();
					}
				}
			});
		}
		if (breakTimeoutLoop == false) {
			imageFetchThreadId = setTimeout(imageFetch, 1000);
		}
	}, 1000);
}

function openImageSnapshotWindow_existing() {
	videouploadstatus = "INPROGRESS";
	closeEditorWindow();
	chrome.tabs.query({}, function (tabs) {
		for (var ti = 0; ti < tabs.length; ti++) {
			var _tab = tabs[ti];
			debugger
			if (_tab.active != null && _tab.active == true) {
				chrome.tabCapture.getMediaStreamId(
					{ targetTabId: _tab.id },
					function (stream_id) {
						if (stream_id != null) {
							navigator.mediaDevices.getUserMedia({
								video: {
									mandatory: {
										chromeMediaSource: 'tab',
										chromeMediaSourceId: stream_id,
									}
								}
							}).then(stream => {
								videouploadstatus = "INPROGRESS";
								opkey_image_stream = stream;
								setTimeout(function () {
									chrome.system.display.getInfo(function (displayInfo) {
										var _bounds = displayInfo[0].bounds;
										var _width = _bounds.width;
										var _height = _bounds.height;
										_width = Math.trunc(_width);
										_height = Math.trunc(_height);
										var video = document.createElement('video');
										video.videoWidth = _width;
										video.videoHeight = _height;
										video.addEventListener('loadedmetadata', function () {

											var canvas = document.createElement('canvas');
											canvas.width = this.videoWidth;
											canvas.height = this.videoHeight;
											var ctx = canvas.getContext("2d");
											ctx.drawImage(this, 0, 0);
											var image = canvas.toDataURL();
											localStorage_setItem("IMAGE_CROP_IMAGE", image);
											//video.pause();
											chrome.windows.create({
												url: chrome.runtime.getURL("/ManualTcAndQLM/ImageEditor.html"),
												type: 'panel',
												state: "normal",
												left: 0,
												top: 0,
												width: _width,
												height: _height
											}, function (win) {
												if (chrome.runtime.lastError) { }
												//video.pause();
												iamgecropping_win_id = win.id;
												localStorage_setItem("IMAGE_CROPPING_WIN", win.id);
												if (opkey_image_stream != null) {
													opkey_image_stream.getTracks()[0].stop();
												}
											});

											chrome.windows.onRemoved.addListener(async function (window_id) {
												var imagewinid = await localStorage_getItem("IMAGE_CROPPING_WIN");
												if (imagewinid == window_id) {
													if (videouploadstatus != "FETCHING" && videouploadstatus != "COMPLETED") {
														videouploadstatus = "INCOMPLETE";
														stopVideoRecorderBlinking();
													}
													if (opkey_image_stream != null) {
														opkey_image_stream.getTracks()[0].stop();
													}
												}
											});
										}, false);
										video.srcObject = opkey_image_stream;
										video.play();
										var canvas = document.createElement('canvas');
										var ctx = canvas.getContext("2d");
										ctx.drawImage(video, 0, 0);

									});
								}, 600);

							}).catch(err => {
								console.error('Could not get stream: ', err);
								videouploadstatus = "INCOMPLETE";
								stopVideoRecorderBlinking();
								debugger
							});
						}
					});


			}
		}
	});
}

var currentFocusedTabForImage = -1;
function openImageSnapshotWindow(captureMode) {
	if (true) {
		injectVideoRecorderScripts("Image", function () {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				if (chrome.runtime.lastError) { }
				currentFocusedTabForImage = tabs[0].id;
				openImageSnapshotWindow_new_fullpage(captureMode);
			});
		});
		return;
	}
}

function openImageCaptureForOtherTabs() {
	try {
		if (qlm_desktopCaptureRequestId != -1) {
			chrome.desktopCapture.cancelChooseDesktopMedia(qlm_desktopCaptureRequestId);
		}
	} catch (e) { }
	videouploadstatus = "STARTINGCAPTURING";
	closeEditorWindow();
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		var currentTab = tabs[0];
		qlm_desktopCaptureRequestId = chrome.desktopCapture.chooseDesktopMedia(['screen', "window", 'tab'],
			currentTab,
			async function (stream_id) {
				if (stream_id != null) {

					var image = await sendMessageToCurrentTab("videorecorder_navigator_mediaDevices_getUserMedia", { "streamId": stream_id })
					if (image != null) {
						videouploadstatus = "INPROGRESS";

						chrome.desktopCapture.cancelChooseDesktopMedia(qlm_desktopCaptureRequestId);

						WINDOW_CURRENT_IAMGE_BASE64 = image;
						await sendMessageToCurrentTab("image_stop_stream", {});
						chrome.windows.onRemoved.addListener(async function (window_id) {
							var imagewinid = await localStorage_getItem("IMAGE_CROPPING_WIN");
							if (imagewinid == window_id) {
								if (videouploadstatus != "FETCHING" && videouploadstatus != "COMPLETED") {
									videouploadstatus = "INCOMPLETE";
									stopVideoRecorderBlinking();
								}
								await sendMessageToCurrentTab("image_stop_stream", {});
							}
						});

					}
					else {
						console.error('Could not get stream: ');
						videouploadstatus = "INCOMPLETE";
						stopVideoRecorderBlinking();
					}
				}
			});
	});
}


var mediaRecorder = null;
var recordedChunks = [];
var currentVideoBase64 = null;
var globalDuration = 0;
var currentFixedVideoBlob = null;
function openVideoSnapshotWindow_new(_message) {
	injectVideoRecorderScripts("Video", function () {
		videoProcessingStatus = "";
		videouploadstatus = "STARTINGCAPTURING";
		recordedChunks = []
		closeEditorWindow();
		blinkVideoRecorderIcon();
		sendMessageToActiveTab(_message);
	});
}

function loadVideoEditorDockOrWindow() {
	setTimeout(async function () {
		if (await localStorage_getItem("VideoEditorStatus") != "STOPPED") {
			localStorage_setItem("VideoEditorStatus", "OPENED");
		}
		if (dockerShowing == false) {
			chrome.system.display.getInfo(function (displayInfo) {
				var _bounds = displayInfo[0].bounds;
				var _height = _bounds.height;
				_height = Math.trunc(_height);
				_height = _height - 50;
				var fromTop = _height - 200;
				chrome.windows.create({
					url: chrome.runtime.getURL("/ManualTcAndQLM/VideoEditor.html"),
					type: 'panel',
					state: "normal",
					left: 0,
					top: fromTop,
					width: 450,
					height: 200
				}, function (win) {
					if (chrome.runtime.lastError) { }
					iamgecropping_win_id = win.id;
					localStorage_setItem("IMAGE_CROPPING_WIN", win.id);
				});
			});

		}
		chrome.windows.onRemoved.addListener(async function (window_id) {
			var imagewinid = await localStorage_getItem("IMAGE_CROPPING_WIN");
			if (imagewinid == window_id) {
				resetTimer();
				console.log("Last Status " + videouploadstatus);
				if (videouploadstatus != "FETCHING" && videouploadstatus != "COMPLETED") {
					videouploadstatus = "INCOMPLETE";
					stopVideoRecorderBlinking();
				}
				localStorage_setItem("VideoEditorStatus", "CLOSED");
				sendVideoEditorWindowMessage("StopVideoRecording");
			}
		});
	}, 600);
}

function openVideoSnapshotWindow(captureMode) {
	_stopblinking = false;
	_stopVideoblinking = false;
	if (captureMode != null && captureMode == "CaptureCurrentWithTabCaptureApi") {
		//	openVideoSnapshotWindow_tabsCapture();
		openVideoSnapshotWindow_new("StartVideoRecordingCurrentTab");
		return;
	}
	if (captureMode != null && captureMode == "CaptureCurrentWithDisplayModeCurrentTab") {
		openVideoSnapshotWindow_new("StartVideoRecordingCurrentTab");
		return;
	}
	if (true) {
		openVideoSnapshotWindow_new("StartVideoRecording");
		return;
	}
	try {
		if (qlm_desktopCaptureRequestId != -1) {
			chrome.desktopCapture.cancelChooseDesktopMedia(qlm_desktopCaptureRequestId);
		}
	} catch (e) { }
	videouploadstatus = "STARTINGCAPTURING";
	recordedChunks = []
	closeEditorWindow();
	qlm_desktopCaptureRequestId = chrome.desktopCapture.chooseDesktopMedia(['tab', 'screen'],
		null,
		function (stream_id) {
			if (stream_id != null) {
				navigator.mediaDevices.getUserMedia({
					video: {
						mandatory: {
							chromeMediaSource: 'desktop',
							chromeMediaSourceId: stream_id,
						}
					}

				}).then(stream => {
					videouploadstatus = "INPROGRESS";
					videorecordereditorstatus = "INPROGRESS";
					opkey_video_stream = stream;
					opkey_video_stream.getVideoTracks()[0].onended = function () {
						//console.log("Video stream ended!");
						videorecordereditorstatus = "SHARINGSTOPPED";
					};
					var options = {
						videoBitsPerSecond: 600000,
						mimeType: 'video/webm;codecs=h264'
					};
					mediaRecorder = new MediaRecorder(opkey_video_stream, options);
					mediaRecorder.ondataavailable = handleVideoData;
					mediaRecorder.start();

					setTimeout(function () {
						chrome.desktopCapture.cancelChooseDesktopMedia(qlm_desktopCaptureRequestId);
						localStorage_setItem("VideoEditorStatus", "OPENED");
						if (dockerShowing == false) {
							chrome.system.display.getInfo(function (displayInfo) {
								var _bounds = displayInfo[0].bounds;
								var _height = _bounds.height;
								_height = Math.trunc(_height);
								_height = _height - 50;
								var fromTop = _height - 200;
								chrome.windows.create({
									url: chrome.runtime.getURL("/ManualTcAndQLM/VideoEditor.html"),
									type: 'panel',
									state: "normal",
									left: 0,
									top: fromTop,
									width: 450,
									height: 200
								}, function (win) {
									if (chrome.runtime.lastError) { }
									iamgecropping_win_id = win.id;
									localStorage_setItem("IMAGE_CROPPING_WIN", win.id);
								});
							});

						}
						chrome.windows.onRemoved.addListener(function (window_id) {
							var imagewinid = localStorage_getItem("IMAGE_CROPPING_WIN");
							if (imagewinid == window_id) {
								console.log("Last Status " + videouploadstatus);
								if (videouploadstatus != "FETCHING" && videouploadstatus != "COMPLETED") {
									videouploadstatus = "INCOMPLETE";
									stopVideoRecorderBlinking();
								}
								if (opkey_video_stream != null) {
									opkey_video_stream.getTracks()[0].stop();
								}
								if (mediaRecorder != null) {
									mediaRecorder.stop();
								}
							}
						});
					}, 600);

				}).catch(err => {
					console.error('Could not get stream: ', err);
					videouploadstatus = "INCOMPLETE";
					stopVideoRecorderBlinking();
					debugger
				});
			}
		});
}


function openVideoSnapshotWindow_tabsCapture() {
	try {
		if (qlm_desktopCaptureRequestId != -1) {
			chrome.desktopCapture.cancelChooseDesktopMedia(qlm_desktopCaptureRequestId);
		}
	} catch (e) { }
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		if (tabs.length > 0) {
			if (tabs[0].url == null || tabs[0].url == "" || tabs[0].url.indexOf("chrome://") > -1 || tabs[0].url.indexOf("edge://") > -1 || tabs[0].url.indexOf("about:") > -1) {
				let error = { message: "Video capturing is not allowed on blank pages and browser pages" };
				videouploadstatus = "UPLOADATTACHMENTEORROR_" + JSON.stringify(error);
				return;
			}

			if (tabs[0].url != null && tabs[0].url.indexOf("chrome.google.com/webstore") > -1) {
				let error = { message: "Video capturing is not allowed on blank pages and browser pages" };
				videouploadstatus = "UPLOADATTACHMENTEORROR_" + JSON.stringify(error);
				return;
			}
			if (tabs[0].url != null && tabs[0].url.indexOf("microsoftedge.microsoft.com/addons") > -1) {
				let error = { message: "Video capturing is not allowed on blank pages and browser pages" };
				videouploadstatus = "UPLOADATTACHMENTEORROR_" + JSON.stringify(error);
				return;
			}

		}
		videouploadstatus = "STARTINGCAPTURING";
		recordedChunks = []
		closeEditorWindow();
		blinkVideoRecorderIcon();
		chrome.tabCapture.capture({
			audio: false,
			video: true,
			videoConstraints: {
				mandatory: {
					chromeMediaSource: "tab",
					maxWidth: 3840,
					maxHeight: 2160
				}
			}
		}, function (stream) {
			videouploadstatus = "INPROGRESS";
			videorecordereditorstatus = "INPROGRESS";
			opkey_video_stream = stream;
			opkey_video_stream.getVideoTracks()[0].onended = function () {
				//console.log("Video stream ended!");
				videorecordereditorstatus = "SHARINGSTOPPED";
			};
			var options = {
				videoBitsPerSecond: 600000,
				mimeType: 'video/webm;codecs=h264'
			};
			opkey_mediaRecorder = new MediaRecorder(opkey_video_stream, options);
			opkey_mediaRecorder.ondataavailable = handleVideoData;
			opkey_mediaRecorder.start();

			setTimeout(function () {
				chrome.desktopCapture.cancelChooseDesktopMedia(qlm_desktopCaptureRequestId);
				localStorage_setItem("VideoEditorStatus", "OPENED");
				if (dockerShowing == false) {
					chrome.system.display.getInfo(function (displayInfo) {
						var _bounds = displayInfo[0].bounds;
						var _height = _bounds.height;
						_height = Math.trunc(_height);
						_height = _height - 50;
						var fromTop = _height - 200;
						chrome.windows.create({
							url: chrome.runtime.getURL("/ManualTcAndQLM/VideoEditor.html"),
							type: 'panel',
							state: "normal",
							left: 0,
							top: fromTop,
							width: 450,
							height: 200
						}, function (win) {
							if (chrome.runtime.lastError) { }
							iamgecropping_win_id = win.id;
							localStorage_setItem("IMAGE_CROPPING_WIN", win.id);
						});
					});

				}
				chrome.windows.onRemoved.addListener(async function (window_id) {
					var imagewinid = await localStorage_getItem("IMAGE_CROPPING_WIN");
					if (imagewinid == window_id) {
						resetTimer();
						console.log("Last Status " + videouploadstatus);
						if (videouploadstatus != "FETCHING" && videouploadstatus != "COMPLETED") {
							videouploadstatus = "INCOMPLETE";
							stopVideoRecorderBlinking();
						}
						if (opkey_video_stream != null) {
							opkey_video_stream.getTracks()[0].stop();
						}
						if (mediaRecorder != null) {
							mediaRecorder.stop();
						}
						localStorage_setItem("VideoEditorStatus", "CLOSED");
					}
				});
			}, 600);
		});
	});
}

function handleVideoData(event) {
	if (event.data.size > 0) {
		var duration = getVideoRecordingTime();
		ysFixWebmDuration(event.data, duration, function (fixedBlob) {
			recordedChunks.push(fixedBlob);
			videoRecorderTimeArray = [];
		});
	} else {
	}
}

function pauseVideoRecording() {
	pauseTimer = true;
	if (mediaRecorder != null) {
		mediaRecorder.pause();
	}
	if (opkey_mediaRecorder != null) {
		opkey_mediaRecorder.pause();
	}
}

function resumeVideoRecording() {
	pauseTimer = false;
	if (mediaRecorder != null) {
		mediaRecorder.resume();
	}
	if (opkey_mediaRecorder != null) {
		opkey_mediaRecorder.resume();
	}
}

function stopVideoRecording(_issuetype) {
	sendVideoEditorWindowMessage("StopVideoRecording");
	if (opkey_video_stream != null) {
		opkey_video_stream.getTracks()[0].stop();
	}
	if (opkey_mediaRecorder != null) {
		opkey_mediaRecorder.stop();
	}
}

function UploadCapturedVideo(dtoObject) {
	var _issuetype = dtoObject["issueType"];
	var filename = dtoObject["filename"];
	videouploadstatus = "FETCHING";
	setTimeout(async function () {

		const blob = b64toBlob(currentVideoBase64, "");
		debugger
		var applicationUtility = await localStorage_getItem("AppUtilityType");
		if (applicationUtility != null && (applicationUtility == "qlm_video" || applicationUtility == "qlm_video_IssueType")) {
			uploadIamgeToOpkeyQLM(blob, _issuetype, filename);
			return;
		}
		uploadVideoToOpkey(blob, filename);
	}, 300);
}


const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
	const byteCharacters = atob(b64Data);
	const byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);

		const byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}

	const blob = new Blob(byteArrays, { type: contentType });
	return blob;
}

var uploadVideoXhrRequest = null;

// CxSuppress: Missing_HSTS_Header
// Reason: HSTS is enforced at the server; client cannot add this header client-side.
async function uploadVideoToOpkey(_base64, filename) {
	const domain = await localStorage_getItem("Domain");
	if (!domain.startsWith("https://")) {
		console.error("Insecure domain—refusing to send over HTTP:", domain);
		return;
	}

	const sessionid = await localStorage_getItem("SessionID");
	const resultid = await localStorage_getItem("ResultID");
	const fdata = new FormData();
	fdata.append("file", _base64, filename + ".mp4");

	try {
		const response = await fetch(domain + "/Result/UploadResultVideoUsingAddon", {
			method: "POST",
			headers: {
				'Session_ID': sessionid,
				'Result_ID': resultid
			},
			body: fdata
		});

		const hsts = response.headers.get("strict-transport-security");
		if (!hsts) {
			// throw new Error("HSTS header missing from server response");
		}

		if (response.ok) {
			const succ_data = await response.json();
			injectFidInOpkeyOne(succ_data);
			videouploadstatus = "COMPLETED";
			turnOffVideoEditor();
			closeEditorOfDocker();
		} else {
			console.error("Failed to upload video:", response.status, response.statusText);
		}

	} catch (error) {
		console.error("Error during upload:", error);
	}
}



function uploadIamgeToOpkeyQLM(_base64, _issueType, filename) {
	videouploadstatus = "FETCHING";
	var fileSize = _base64.size;
	var MaxFileSizeLimit = 100;
	var convertedValidateFileSize = parseInt(MaxFileSizeLimit) * 1024 * 1024;

	if (fileSize > convertedValidateFileSize) {
		let error = { message: 'File size exceed maximum limit is 100 MB.' };
		videouploadstatus = "UPLOADATTACHMENTEORROR_" + JSON.stringify(error);
		return false;
	}
	setTimeout(async function () {
		var domain = await localStorage_getItem("Domain");

		var fdata = new FormData();
		fdata.append("file", _base64, filename + ".mp4");
		const uploadVideoXhrRequest = fetch(domain + "/FileManager/Upload_Temp_Video_Using_Addon", {
			method: "POST",
			body: fdata,
			headers: {
				// Since contentType is false, it will be set automatically by the browser
			}
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json(); // Assuming the response is JSON
			})
			.then(succ_data => {
				if (succ_data != null) {
					if (_issueType != null && _issueType != "" && _issueType != "opkey_unknown") {
						succ_data["IssueType"] = _issueType;
					}
					localStorage_removeItem("AppUtilityType");
					localStorage_setItem("QLM_Response", JSON.stringify(succ_data));
					injectQLMResponseInOpkeyOne(succ_data);
				}
				videouploadstatus = "COMPLETED";
				turnOffVideoEditor();
				closeEditorOfDocker();
			})
			.catch(error => {
			});

	}, 200);
}


function downloadRecordedVideo(_filename) {
	if (_filename == null || _filename == "") {
		_filename = "OpkeyRecordedVideo";
	}
	var blob = new Blob(recordedChunks, {
		type: 'video/mp4'
	});
	var url = URL.createObjectURL(blob);
	var a = document.createElement('a');
	document.body.appendChild(a);
	a.style = 'display: none';
	a.href = url;
	a.download = _filename + '.mp4';
	a.click();
	window.URL.revokeObjectURL(url);
}


function launchImageUtility(data) {
	console.log(data);
	var resultId = data["Result_ID"];
	var sessionid = data["SessionID"];
	var tcname = data["tc name"];
	var domain = data["url"];
	var utility = data["utility"];
	var captureMode = data["captureMode"];
	var initiatedfrom = data["initiatedfrom"];
	localStorage_setItem("ResultID", resultId);
	localStorage_setItem("SessionID", sessionid);
	localStorage_setItem("Domain", domain);
	localStorage_setItem("AppUtilityType", utility);
	localStorage_removeItem("initiatedfrom");

	if (initiatedfrom != null) {
		localStorage_setItem("initiatedfrom", initiatedfrom);
	}

	if (utility == "snapshot" || utility == "qlm_snapshot" || utility == "qlm_snapshot_IssueType") {
		openImageSnapshotWindow(captureMode);
	}
	else {
		openVideoSnapshotWindow(captureMode);
	}
}

function createUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}






//------------------------------------------------------------------------------------

//Auto FL Creation Area

chrome.runtime.onMessage
	.addListener(function (request, sender, sendResponse) {
		if (request.FetchAutoFlCreationData) {
			handle_callAutoFlCreationFunction(sendResponse, JSON.stringify(request.FetchAutoFlCreationData));
		}
		if (request.OpenAndGenerateAutoFl) {
			openAndGenerateAutoFl();
			sendResponse("Done")
		}
		return true;
	});

async function handle_callAutoFlCreationFunction(_sendResponse, _dataToSend) {
	var outResult = [];
	var retData = await callAutoFlCreationFunction(_dataToSend);
	debugger

	for (var rdi = 0; rdi < retData.length; rdi++) {
		if (retData[rdi].result != null) {
			outResult.push(...retData[rdi].result);
		}
	}
	_sendResponse([outResult])
}

async function callAutoFlCreationFunction(_dataToSend) {
	return new Promise((resolve, reject) => {
		const tabUrl = currentFocusedTabObject.url;
		if (tabUrl) {
			if (tabUrl.includes("oraclecloud.com") || tabUrl.includes("oraclepdemos.com")) {

				chrome.scripting.executeScript({
					target: { tabId: currentTabIdForAutoFl, allFrames: true },
					func: () => {
						return OracleFusion_getCurrentPageSnapshotJSON();
					}
				}, (results) => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
					} else {
						resolve(results);
					}
				});
			} else if (tabUrl.includes("workday.com")) {
				chrome.scripting.executeScript({
					target: { tabId: currentTabIdForAutoFl, allFrames: true },
					func: (_dataToSend) => {
						return Workday_getCurrentPageSnapshotJSON(_dataToSend);
					}
				}, (results) => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
					} else {
						resolve(results);
					}
				});
			}
		} else {
			reject('Tab URL is null');
		}
	});
}



const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';

async function createOffScreenDocuments() {
	if (!(await hasDocument())) {
		await chrome.offscreen.createDocument({
			url: OFFSCREEN_DOCUMENT_PATH,
			reasons: [chrome.offscreen.Reason.DOM_PARSER],
			justification: 'Parse DOM'
		});

		chrome.runtime.sendMessage({ action: "warmup" });
	}
}

async function hasDocument() {
	// Check all windows controlled by the service worker if one of them is the offscreen document
	const matchedClients = await clients.matchAll();
	for (const client of matchedClients) {
		if (client.url.endsWith(OFFSCREEN_DOCUMENT_PATH)) {
			return true;
		}
	}
	return false;
}


async function sendMessageToOffscreenScript(_command, _data) {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage({
			"action": _command, "data": _data
		}, function (response) {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve(response);
			}
		});
	});
}

async function sendMessageToCurrentTab(_command, _data) {
	return new Promise((resolve, reject) => {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			for (var ti = 0; ti < tabs.length; ti++) {
				var _tab = tabs[ti];
				chrome.tabs.sendMessage(_tab.id, {
					"action": _command, "data": _data
				}, function (response) {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
					} else {
						resolve(response);
					}
				});
			}
		});
	});
}

function localStorage_removeItem(_keyName) {
	sendMessageToOffscreenScript("offscreen_localStorage_removeItem", { "key": _keyName });
}

async function localStorage_getItem(_keyName) {
	return await sendMessageToOffscreenScript("offscreen_localStorage_getItem", { "key": _keyName });
}

function localStorage_setItem(_keyName, _value) {
	sendMessageToOffscreenScript("offscreen_localStorage_setItem", { "key": _keyName, "value": _value });
}





//################################################### Obiq Area ##########################################


async function injectDataProcessVariableToAllTabs(name, value) {
	return new Promise(function (resolve, reject) {


		chrome.tabs.query({}, (tabs) => {
			for (const tab of tabs) {
				chrome.scripting.executeScript({
					target: { tabId: tab.id, allFrames: true },
					func: (name, value) => {
						sessionStorage.setItem(name, value);
					},
					args: [name, value]
				},
					() => {
						if (chrome.runtime.lastError) {
						}
					});
			}
			resolve("Done");
		});

	});
}

async function chrome_tabs_captureVisibleTab(_data) {
	return new Promise(function (resolve, reject) {
		let attempt = 0;
		function capturePageImage() {
			let thredId = setTimeout(async function () {

				chrome.tabs.captureVisibleTab(null, _data, function (image) {
					if (image !== null && image !== "") {
						clearTimeout(thredId);
						resolve(image);
						return;
					}
					else {
						capturePageImage();
					}
				});

				if (attempt > 5000) {
					resolve(null);
					clearTimeout(thredId);
					return;
				}
				attempt++;
			}, 10);
		}
		capturePageImage();
	});
}

async function chrome_tabs_getActiveTabUrl(_data) {
	return new Promise(function (resolve, reject) {

		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			var currentTab = tabs[0];
			resolve(currentTab.url);
		});

	});
}

async function chrome_tabs_getActiveTabInfo(_data) {
	return new Promise(function (resolve, reject) {

		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			var currentTab = tabs[0];
			resolve(currentTab);
		});

	});
}

async function chrome_tabs_getActiveTabTitle(requestData) {
	var data = {
		pageTitle: "",
		headers: []
	};

	return new Promise((resolve) => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (!tabs.length) {
				resolve(null);
				return;
			}

			const tab = tabs[0];
			data.pageTitle = tab.title;

			resolve(data);
		});
	});
}



async function handle_Async_function(request, sendResponse) {
	if (request.action != null) {
		switch (request.action) {
			case "chrome.tabs.captureVisibleTab":
				var response = await chrome_tabs_captureVisibleTab(request.data);
				sendResponse(response);
				break;
			case "injectDataProcessVariableToAllTabs":
				var response = await injectDataProcessVariableToAllTabs(request.data.name, request.data.value);
				sendResponse(response);
				break;
			case "chrome.tabs.getActiveTabUrl":
				var response = await chrome_tabs_getActiveTabUrl(request.data);
				sendResponse(response);
				break;
			case "chrome.tabs.getActiveTabInfo":
				var response = await chrome_tabs_getActiveTabInfo(request.data);
				sendResponse(response);
				break;
			case "chrome.tabs.getActiveTabTitle":
				var response = await chrome_tabs_getActiveTabTitle(request.data);
				sendResponse(response);
				break;

			case "openExternalUrl":
				if (request.data != null && request.data.indexOf("/incident/create") == -1) {
					openExternalUrl(request.data);
				}
				sendResponse("Done")
				break;
			case "openExternalUrlv2":
				openExternalUrl(request.data);
				sendResponse("Done")
				break;
			case "startRumRecorderAgent":
				var response = await startRumWin32Recording(request.data);
				sendResponse(response);
				break;
			case "stopRumRecorderAgent":
				var response = await stopRumWin32Recording();
				sendResponse(response);
				break;
			case "fetchRumAgentRecordedSteps":
				var response = await fetchRumRecordedSteps();
				sendResponse(response);
				break;
			case "startWin32InAppPromptService":
				var response = await startWin32InAppPromptService(request);
				sendResponse(response);
				break;
			case "stopWin32InAppPromptService":
				var response = await stopWin32InAppPromptService();
				sendResponse(response);
				break;
			case "fetchAndUpdateWin32InAppPromptService":
				var response = await fetchAndUpdateWin32InAppPromptService(request);
				sendResponse(response);
				break;
			case "checkInAppPromptStatus":
				var response = await checkInAppPromptStatus();
				sendResponse(response);
				break;
			case "resetWin32InAppPromptStatus":
				var response = await resetWin32InAppPromptStatus();
				sendResponse(response);
				break;
		}
	}
}

async function openExternalUrl(_subUrl) {
	var currentDomain = await localStorage_getItem("OPKEY_DOMAIN_NAME");
	var _fullurl = currentDomain + "/" + _subUrl;
	chrome.tabs.create({ url: _fullurl });
}



chrome.runtime.onMessage
	.addListener(function (request, sender, sendResponse) {
		if (request.action != null) {
			switch (request.action) {
				case "chrome.tabs.captureVisibleTab":
					handle_Async_function(request, sendResponse);
					break;
				case "chrome.tabs.getActiveTabUrl":
					handle_Async_function(request, sendResponse);
					break;
				case "openExternalUrl":
					handle_Async_function(request, sendResponse);
					break;
				case "openExternalUrlv2":
					handle_Async_function(request, sendResponse);
					break;
				case "injectDataProcessVariableToAllTabs":
					handle_Async_function(request, sendResponse);
					break;
				case "chrome.tabs.getActiveTabTitle":
					handle_Async_function(request, sendResponse);
					break;
				case "chrome.tabs.getActiveTabInfo":
					handle_Async_function(request, sendResponse);
					break;
				case "startRumRecorderAgent":
					handle_Async_function(request, sendResponse);
					break;
				case "stopRumRecorderAgent":
					handle_Async_function(request, sendResponse);
					break;
				case "fetchRumAgentRecordedSteps":
					handle_Async_function(request, sendResponse);
					break;
				case "startWin32InAppPromptService":
					handle_Async_function(request, sendResponse);
					break;
				case "stopWin32InAppPromptService":
					handle_Async_function(request, sendResponse);
					break;
				case "fetchAndUpdateWin32InAppPromptService":
					handle_Async_function(request, sendResponse);
					break;
				case "checkInAppPromptStatus":
					handle_Async_function(request, sendResponse);
					break;
				case "resetWin32InAppPromptStatus":
					handle_Async_function(request, sendResponse);
					break;
			}
		}
		return true;
	});


function sendDataToIngestControllerThread() {
	setTimeout(() => {
		chrome.runtime.sendMessage({ SendDataToIngestControllerThread: true });
		sendDataToIngestControllerThread();
	}, 1000);

}

sendDataToIngestControllerThread();


const KEY = "URL_TO_TRACK_FOR_JOURNEY";

chrome.tabs.onReplaced.addListener((newTabId, oldTabId) => {
	const storedTabId = localStorage.getItem(KEY);

	if (storedTabId && storedTabId === String(oldTabId)) {
		localStorage.setItem(KEY, String(newTabId));
		console.log(`[Journey] Tab replaced: ${oldTabId} → ${newTabId}`);
	}
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (!request.action) return;

	switch (request.action) {
		case "setUserGuideRecordingType":
			userGuideRecordingType = request.data;
			sendResponse({ success: true });
			return true;

		case "getUserGuideRecordingType":
			sendResponse({UserGuideRecordingType: userGuideRecordingType });
			return true;
	}
});