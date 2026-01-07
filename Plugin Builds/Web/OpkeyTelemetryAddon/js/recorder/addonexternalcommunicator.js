var SalesForceApi = function () {
	this.metadata_array_of_simplified_object = [];
}
var _salesforceapi = new SalesForceApi();
var sessionid = "BLANK";

SalesForceApi.prototype.GetSalesforceDomain = function () {
	var sales_force_url = window.location.host;
	return sales_force_url;
};

SalesForceApi.prototype.GetSalesforceDomainHref = function () {
	var sales_force_url = window.location.href;
	return sales_force_url;
};

SalesForceApi.prototype.GetSessionId = function (c_name) {
	var i, x, y, ARRcookies = document.cookie.split(";");
	for (i = 0; i < ARRcookies.length; i++) {
		x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
		y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
		x = x.replace(/^\s+|\s+$/g, "");
		if (x == c_name) {
			// return unescape(y);
			return y;
		}
	}
};

var dropdown_opened = false;
SalesForceApi.prototype.GetCurrentS_CObject_OLD = function () {
	var url = window.location.host;
	// //console.log("URL: "+url);
	var img_nodes = document.getElementsByTagName("IMG");
	for (var im_i = 0; im_i < img_nodes.length; im_i++) {
		var img_node = img_nodes[im_i];
		if (img_node != null) {
			if ($(img_node).hasClass("pageTitleIcon")) {
				var title_img = img_node.getAttribute("alt");
				if (title_img != null) {
					// ////console.log("IMG ALT "+title_img);
					return title_img;
				}
			}
		}
	}
	var h2_nodes = document.getElementsByTagName("H2");
	for (var h_i = 0; h_i < h2_nodes.length; h_i++) {
		var h2_node = h2_nodes[h_i];
		if ($(h2_node).hasClass("pageDescription")) {
			var h2_text = $(h2_node).text();
			if (h2_text.indexOf("New ") > -1) {
				h2_text = h2_text.replace("New ", "");
				// //console.log(h2_text);
				return h2_text.trim();
			}
		} else if ($(h2_node).hasClass("title")) {
			var h2_text = $(h2_node).text();
			if (h2_text.indexOf("New ") > -1) {
				h2_text = h2_text.replace("New ", "");
				// //console.log(h2_text);
				return h2_text.trim();
			}
		}
	}
	return null;
};

SalesForceApi.prototype.GetCurrentS_CObject = function () {
	try {
		var url_salesforce = window.location.href;
		// ////console.log("Current Url "+url_salesforce);
		var sobject_index = url_salesforce.indexOf("/sObject/");
		var object_index = url_salesforce.indexOf("/o/");
		if (sobject_index != -1) {
			var url_without_sobject = url_salesforce.substring(sobject_index,
				url_salesforce.length);
			url_without_sobject = url_without_sobject.replace("/sObject/", "");
			if (url_without_sobject.indexOf("/") != -1) {
				url_without_sobject = url_without_sobject.split("/");
				url_without_sobject = url_without_sobject[0];
				// //console.log(url_without_sobject);
				return url_without_sobject.trim();
			} else {
				return url_without_sobject;
			}
		} else if (object_index != -1) {
			var url_without_sobject = url_salesforce.substring(object_index,
				url_salesforce.length);
			url_without_sobject = url_without_sobject.replace("/o/", "");
			if (url_without_sobject.indexOf("/") != -1) {
				url_without_sobject = url_without_sobject.split("/");
				url_without_sobject = url_without_sobject[0];
				// //console.log(url_without_sobject);
				return url_without_sobject.trim();
			} else {
				return url_without_sobject;
			}
		}

		if (sobject_index != -1) {
			var url_without_sobject = url_salesforce.substring(sobject_index,
				url_salesforce.length);
			url_without_sobject = url_without_sobject.replace("/sObject/", "");
			if (url_without_sobject.indexOf("/") != -1) {
				url_without_sobject = url_without_sobject.split("/");
				url_without_sobject = url_without_sobject[0];
				// //console.log(url_without_sobject);
				return url_without_sobject.trim();
			} else {
				return url_without_sobject;
			}
		}

		var img_nodes = document.getElementsByTagName("IMG");
		for (var im_i = 0; im_i < img_nodes.length; im_i++) {
			var img_node = img_nodes[im_i];
			if (img_node != null) {
				if ($(img_node).hasClass("pageTitleIcon")) {
					var title_img = img_node.getAttribute("alt");
					if (title_img != null) {
						// ////console.log("IMG ALT "+title_img);
						return title_img;
					}
				}
			}
		}
		var h2_nodes = document.getElementsByTagName("H2");
		for (var h_i = 0; h_i < h2_nodes.length; h_i++) {
			var h2_node = h2_nodes[h_i];
			if ($(h2_node).hasClass("pageDescription")) {
				var h2_text = $(h2_node).text();
				if (h2_text.indexOf("New ") > -1) {
					h2_text = h2_text.replace("New ", "");
					// ////console.log(h2_text);
					return h2_text.trim();
				}
			} else if ($(h2_node).hasClass("title")) {
				var h2_text = $(h2_node).text();
				if (h2_text.indexOf("New ") > -1) {
					h2_text = h2_text.replace("New ", "");
					// ////console.log(h2_text);
					return h2_text.trim();
				}
			}
		}
	} catch (e) { }
	return null;
};

var reverted = false;



function opkeyaddon_attachListener() {
	document.addEventListener("mouseover", function (e) {

		var opkeyoneelement = document.getElementById("myopkey-fed2bfd7-f6ca-4d2d-b2aa-5a370d94dccd");
		if (opkeyoneelement != null) {
			opkeyoneelement.setAttribute("data-install", "true");
		}

		var install_element = document
			.getElementById("myopkey-91bd4731-bf2f-48e8-8b60-f7fa02f921ef");
		var isLaunchPadUrl = false;
		if (document != null && document.URL != null && document.URL.indexOf("/launchpad/") > -1) {
			isLaunchPadUrl = true;
		}
		if (install_element != null && isLaunchPadUrl == false) {
			if (reverted == false) {
				install_element
					.setAttribute("data-install", "true");
			} else {
				install_element.setAttribute("data-install",
					"false");
			}
		}

		var salesforceAppRecordButton_1 = document.getElementsByClassName("chrome_addon_invoke_33935b46-fd0d-40eb-b274-fef542e65d9abc")[0];
		if (salesforceAppRecordButton_1) {
			if (reverted == false) {
				salesforceAppRecordButton_1.setAttribute("opkey-addoninstall", "true");
			} else {
				salesforceAppRecordButton_1.setAttribute("opkey-addoninstall", "false");
			}
		}
		resolveSecondarQuickActionCondition();

	});

	document.addEventListener("mousedown", function (e) {
		resolveClicks(e);
	});

	document.addEventListener("click", function (e) {
		resolveClicks(e);
	});
}

opkeyaddon_attachListener();

function resolveSecondarQuickActionCondition() {
	var anchor_tags = document.getElementsByTagName("A");
	for (var _a_i = 0; _a_i < anchor_tags.length; _a_i++) {
		var anchor_tag = anchor_tags[_a_i];
		if (anchor_tag.getAttribute("data-recordid") != null) {
			var record_id = anchor_tag.getAttribute("data-recordid");
			chrome.runtime.sendMessage({
				GetQuickActionMetaData: {
					recordid: record_id
				}
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
			break;
		}
	}
}

function resolveClicks(e) {

	try {
		var opkeyData = localStorage.getItem("OpkeyTestRunnerSnapData");
		if (opkeyData != null && opkeyData != "") {
			opkeyData = JSON.parse(opkeyData);
			chrome.runtime
				.sendMessage({
					LaunchOpkeyTestRunner: opkeyData
				},
					function (response) { });
			localStorage.setItem("OpkeyTestRunnerSnapData", "");
		}
	} catch (e) { }

	try {
		var element_node = e.target;
		var temp_element = element_node;
		if (temp_element != null) {
			if (temp_element.nodeName == "BUTTON") {
				if (temp_element.parentNode != null) {
					if (temp_element.parentNode.nodeName == "LIGHTNING-BUTTON") {
						temp_element = temp_element.parentNode;
					}
				}
			}

			var buttonId = temp_element.classList.contains("chrome_addon_invoke_33935b46-fd0d-40eb-b274-fef542e65d9abc");
			if (buttonId != null) {
				if (buttonId == true) {
					var check_id = window
						.setInterval(
							function () {
								var chrome_addon_direct_base64 = null
								var lsKeyName = ""
								for (var di = 0; di < 100; di++) {
									var lsData = localStorage.getItem("" + di);
									if (lsData != null) {
										if (lsData != "") {
											chrome_addon_direct_base64 = lsData;
											lsKeyName = "" + di;
											break;
										}
									}
								}


								if (chrome_addon_direct_base64 != null) {
									if (chrome_addon_direct_base64 != "") {
										localStorage.setItem(lsKeyName, "");
										var chrome_addon_direct_stringify = decodeURIComponent(atob(chrome_addon_direct_base64));
										var chrome_addon_direct_object = JSON
											.parse(chrome_addon_direct_stringify);
										chrome.runtime
											.sendMessage({
												StartAddon: chrome_addon_direct_object
											},
												function (
													response) { });
										window.clearInterval(check_id);
									}
								}
							}, 1000);
				}
			}
		}


		if (temp_element != null) {
			if (temp_element.nodeName == "A") {
				if (temp_element.getAttribute("href") != null) {
					var record_id = temp_element.getAttribute("href");
					record_id = record_id.replace("/", "");
					chrome.runtime.sendMessage({
						GetQuickActionMetaData: {
							recordid: record_id
						}
					}, function (response) {
						if (chrome.runtime.lastError) { }
					});
				}
			}

			if (temp_element.nodeName == "A") {
				if (temp_element.getAttribute("data-recordid") != null) {
					var record_id = temp_element.getAttribute("data-recordid");
					chrome.runtime.sendMessage({
						GetQuickActionMetaData: {
							recordid: record_id
						}
					}, function (response) {
						if (chrome.runtime.lastError) { }
					});
				}
			}

			if (temp_element.nodeName == "TH") {
				temp_element = temp_element.getElementsByTagName("A")[0];
				if (temp_element != null) {

					if (temp_element.getAttribute("data-recordid") != null) {
						var record_id = temp_element
							.getAttribute("data-recordid");
						chrome.runtime.sendMessage({
							GetQuickActionMetaData: {
								recordid: record_id
							}
						}, function (response) {
							if (chrome.runtime.lastError) { }
						});
					} else if (temp_element.getAttribute("href") != null) {
						var record_id = temp_element.getAttribute("href");
						record_id = record_id.replace("/", "");
						chrome.runtime.sendMessage({
							GetQuickActionMetaData: {
								recordid: record_id
							}
						}, function (response) {
							if (chrome.runtime.lastError) { }
						});
					}
				}
			}

			while (element_node.parentNode != null) {
				if (element_node.nodeName == "A") {
					if (element_node.href != null) {
						// //console.log("Clicked URL "+element_node.href);
						chrome.runtime.sendMessage({
							SetSalesforceHostName: {
								"currenturl": element_node.href,
								"host": window.location.host
							}
						}, function (response) {
							if (chrome.runtime.lastError) { }
						});
						break;
					}
				}
				element_node = element_node.parentNode;
			}

			if (temp_element.nodeName == "I") {
				if (temp_element.parentNode.nodeName == "BUTTON") {
					temp_element = temp_element.parentNode;
				}
			}
			var text_content = temp_element.innerText;
			text_content = text_content.trim();
			var _id = temp_element.getAttribute("id");
			if ((_id == "StartWebRecordingBtn") || (_id == "bt_trigger_opkeyonchrome_recording")) {
				// localStorage.setItem("ChromeAddOnDirect","");
				if (text_content == "Start Recording" || (_id == "bt_trigger_opkeyonchrome_recording")) {
					if (text_content == "Start Recording") {
						localStorage.setItem("ChromeAddOnDirect", "");
					}
					try {
						sessionStorage.setItem("RECORDED_STEPS_TESTDISCOVERY", "");
					} catch (e) { }
					chrome.runtime.sendMessage({
						cleanUp: {}
					}, function (response) {
						if (chrome.runtime.lastError) { }
					});
					var check_id = window
						.setInterval(
							function () {
								var chrome_addon_direct_base64 = localStorage
									.getItem("ChromeAddOnDirect");
								if (chrome_addon_direct_base64 != null) {
									if (chrome_addon_direct_base64 != "") {
										localStorage
											.setItem(
												"ChromeAddOnDirect",
												"");
										var chrome_addon_direct_stringify = decodeURIComponent(atob(chrome_addon_direct_base64));
										var chrome_addon_direct_object = JSON
											.parse(chrome_addon_direct_stringify);

										chrome_addon_direct_object["ServerAppTypeUrl"] = document.URL;
										chrome.runtime
											.sendMessage({
												StartAddon: chrome_addon_direct_object
											},
												function (
													response) { });
										window.clearInterval(check_id);
									}
								}
							}, 1000);

				}
			}
		}
	} catch (e) { }
};

var _tickid = window
	.setInterval(
		function () {
			/*
			try {
				chrome.runtime.sendMessage({
					GetAddonInstalled: "GetAddonInstalled"
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});
			} catch (e) {
				var _recorderButton = document.getElementById("StartWebRecordingBtn");
				if (_recorderButton) {
					reverted = true;
					_recorderButton.innerHTML = "<i class=\"fa fa-video-camera\"></i>&nbsp;Add Extension";
					window.clearInterval(_tickid);
				}
			}*/
		}, 1000);
var current_st_object = null;
var current_host_name = null;
var context_location_href = null;
window.setInterval(function () {
	var st_ct_object = _salesforceapi.GetCurrentS_CObject();
	var current_url = _salesforceapi.GetSalesforceDomainHref();
	var string_url_href = window.location.href.toLowerCase();
	if (string_url_href.indexOf("salesforce") > -1) {
		// //console.log("Location :"+window.location.href);
		if (context_location_href != window.location.href) {
			chrome.runtime.sendMessage({
				CreateSOBjectContextMenu: {
					"currenturl": window.location.href,
					"hostName": _salesforceapi.GetSalesforceDomain(),
					"SID": _salesforceapi.GetSessionId('sid'),
					"ST_C_Object": st_ct_object
				}
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
		}
		context_location_href = window.location.href;
	}

	if (current_host_name != current_url) {
		var sobject_index = current_url.indexOf("/sObject/");
		var o_index = current_url.indexOf("/o/");
		if (sobject_index == -1 && o_index == -1) {
			// //console.log("SENDING URL FOR PARSING");
			chrome.runtime.sendMessage({
				SetSalesforceHostName: {
					"currenturl": current_url,
					"host": window.location.host
				}
			}, function (response) {
				if (chrome.runtime.lastError) { }
			});
		}
	}
	current_host_name = current_url;

	if (st_ct_object != null) {
		if (current_st_object != null) {
			if (current_st_object == st_ct_object) {
				return;
			}
		}
		current_st_object = st_ct_object;
		chrome.runtime.sendMessage({
			StartSalesForceMetadataFetching: {
				"currenturl": window.location.href,
				"hostName": _salesforceapi.GetSalesforceDomain(),
				"SID": _salesforceapi.GetSessionId('sid'),
				"ST_C_Object": st_ct_object
			}
		}, function (response) {
			if (chrome.runtime.lastError) { }
		});
	}


}, 1000);

var getRecStepsThreadid = window.setInterval(function () {
	try {
		getRecordedStepAndSave();
	} catch (e) {
		window.clearInterval(getRecStepsThreadid);
	}
}, 1000);


function getRecordedStepAndSave() {
	chrome.runtime.sendMessage({
		getRecorderStepsForEvolve: {}
	}, function (response) {
		if (chrome.runtime.lastError) {
			processTestDiscoveryCommands();
		}
		else {
			processTestDiscoveryCommands();
		}
		if (response != null) {
			try {
				sessionStorage.setItem("RECORDED_STEPS_TESTDISCOVERY", JSON.stringify(response));
			} catch (e) { }
		}

	});
}
function clearCommand() {
	window.setTimeout(function () {
		//sessionStorage.setItem("TESTDISCOVERY_COMMANDS_RECORDER","COMMAND_ACCEPTED");
	}, 2000);
}
function processTestDiscoveryCommands() {
	if (document.URL != null && document.URL.indexOf("opkeyone") == -1 && document.URL.indexOf("testdiscovery") == -1) {
		//	console.log(">>processTestDiscoveryCommands returnm");
		return;
	}
	//console.log(">>processTestDiscoveryCommands");
	chrome.runtime.sendMessage({
		getDockerCommand_temp: {}
	}, function (response) {
		if (response != null) {

		}
	});

	var _command = sessionStorage.getItem("RECORDER_COMMANDS_TESTDISCOVERY");
	if (_command != null && _command != "" && _command != "COMMAND_ACCEPTED") {
		sessionStorage.setItem("RECORDER_COMMANDS_TESTDISCOVERY", "COMMAND_ACCEPTED");
		var _commandObject = JSON.parse(_command);
		if (_commandObject["Command"] != null) {
			var _commandForRecorder = _commandObject["Command"];
			if (_commandForRecorder === "STOP_RECORDING") {
				try {
					sessionStorage.setItem("RECORDED_STEPS_TESTDISCOVERY", "");
				} catch (e) { }
				chrome.runtime.sendMessage({
					setDockerCommand: {
						"action": "stopRecordingTestDiscovery"
					}
				}, function (response) {
					chrome.runtime.sendMessage({
						removeHighlight: {}
					}, function (response) {
						if (chrome.runtime.lastError) { }
						chrome.runtime.sendMessage({
							cleanUp: {}
						}, function (response) {
							if (chrome.runtime.lastError) { }
						});
					});
				});
			}
			else if (_commandForRecorder === "OPEN_NEW_CHROME_WINDOW") {
				chrome.runtime.sendMessage({
					setDockerCommand: {
						"action": "openchromebrowser"
					}
				}, function (response) {

				});
			}

			else if (_commandForRecorder === "CHANGE_RECORDER_MODE") {
				chrome.runtime.sendMessage({
					setDockerCommand: {
						"action": "changerecordingmode", "value": _commandObject["Value"]
					}
				}, function (response) {

				});
			}

			else if (_commandForRecorder === "PAUSE_RECORDING") {

				chrome.runtime.sendMessage({
					setPause: {}
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});

			} else if (_commandForRecorder === "RESUME_RECORDING") {

				chrome.runtime.sendMessage({
					setResume: {}
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});

			}
		}
	}
}


SalesForceApi.prototype.GetAllMetadataOfCurrent_S_C_Object = function () {
	var salesfor_metadata = localStorage.getItem("SALESFORCE_META");
	return metadata_array_of_simplified_object;
};



var installElement = document.getElementById("myopkey-fed2bfd7-f6ca-4d2d-b2aa-5a370d94dccd");
if (installElement != null) {
	installElement.setAttribute("data-install", "true");
}


var threadId12 = window.setInterval(function () {
	try {
		if (document.URL != null && document.URL.indexOf("opkeyone") > -1) {
			var manualRunnerData = localStorage.getItem("SnapshotManualTestRunnerAddon");
			if (manualRunnerData != null && manualRunnerData != "") {
				var manualRunnerObject = JSON.parse(manualRunnerData);
				if (manualRunnerObject["binding"] != null) {
					var bindingObject = manualRunnerObject["binding"];
					chrome.runtime
						.sendMessage({
							SetOpkeyOneManualBinding: bindingObject
						},
							function (response) { });
					localStorage.setItem("SnapshotManualTestRunnerAddon", "");
				}

				if (manualRunnerObject["obiqData"] != null) {
					var obiqDataObject = manualRunnerObject["obiqData"];
					localStorage.setItem("ObiqManualExecutionData", JSON.stringify(obiqDataObject));
				}

			}

			var journeyDto = localStorage.getItem("JourneyDTO");
			if (journeyDto != null && journeyDto != "") {
				localStorage.removeItem("JourneyDTO");
				var journeyDtoObject = JSON.parse(journeyDto);
				chrome.runtime
					.sendMessage({
						SetOpkeyOneJourneyDtoBinding: journeyDtoObject
					},
						function (response) { });
			}

			let obiqGuideRecordingDto = localStorage.getItem("UserGuideRecorderDto");
			if (obiqGuideRecordingDto != null && obiqGuideRecordingDto != "") {
				localStorage.removeItem("UserGuideRecorderDto");
				var obiqGuideRecordingDtoObject = JSON.parse(obiqGuideRecordingDto);
				chrome.runtime
					.sendMessage({
						OBIQ_StartUserGuideRecording: obiqGuideRecordingDtoObject
					},
						function (response) { });
			}

			try {
				/*
				chrome.runtime
					.sendMessage({
						get_local_store_data: "get_local_store_data"
					},
						function (response) {
							if (response) {
								//console.log("get_local_store_data")
								//console.log(response);
								//localStorage.setItem("manual_runner_addon_state", JSON.stringify(response));
							}
						});
						*/
			} catch (e) {
				window.clearInterval(threadId12);
			}
		}
	} catch (e) { }
}, 1500);

function attachTopWindowListener() {
	if (window.top !== window.self) return;

	if (window.__OBIQ_TOP_LISTENER_ATTACHED__) {
		return;
	}
	window.__OBIQ_TOP_LISTENER_ATTACHED__ = true;

	window.addEventListener("message", (event) => {

		const data = event.data;
		if (data === null || data.type === null) return;

		const cmd = data.payload;

		if (!cmd) {
			return;
		}

		if (data.type === "OBIQ_COMMAND") {
			if (cmd.action === "TakePageSnapshot") {
				const correlationId = cmd.correlationId || Date.now();
				chrome.runtime.sendMessage({
					TakeCurrentPageSnapshot: "TakeCurrentPageSnapshot"
				}, function (response) {
					window.postMessage({ type: 'OBIQ_RESPONSE', payload: { correlationId: correlationId, snapshot: response } }, '*');
					localStorage.removeItem("OBIQCommonData");
					if (chrome.runtime.lastError) { }

				});
			}
		}


	});
};


function obiq_addOpkeyPluginListner() {

	attachTopWindowListener();

	window.setInterval(function () {
		try {
			let obiqOpkeyData = localStorage.getItem("OBIQOpkeyData");
			if (obiqOpkeyData != null && obiqOpkeyData != "") {
				let receivedData = JSON.parse(obiqOpkeyData);
				if (receivedData != null) {
					if (receivedData["action"] != null) {
						if (receivedData["action"] == "OpkeyInformationForObiqAddon") {
							var messageBody = receivedData["messageBody"];



							chrome.runtime.sendMessage({
								SETOPKEYEXECUTIONINFORMATION: messageBody
							}, function (response) {
								if (chrome.runtime.lastError) { }
								localStorage.removeItem("OBIQOpkeyData");
							});
						}
					}
				}
			}

			let obiqCommonData = localStorage.getItem("OBIQCommonData");
			if (obiqCommonData != null && obiqCommonData != "") {
				let receivedData = JSON.parse(obiqCommonData);
				if (receivedData != null) {
					if (receivedData["action"] != null) {
						if (receivedData["action"] == "TakePageSnapshot") {
							chrome.runtime.sendMessage({
								TakeCurrentPageSnapshot: "TakeCurrentPageSnapshot"
							}, function (response) {
								if (chrome.runtime.lastError) { }
								localStorage.removeItem("OBIQCommonData");
							});
						}
					}
				}
			}

			var obiqOpkeyCommData = localStorage.getItem("OBIQOpkeyCommData");
			if (obiqOpkeyCommData != null && obiqOpkeyCommData != "") {
				var receivedData = JSON.parse(obiqOpkeyCommData);
				if (receivedData != null) {

					chrome.runtime.sendMessage({
						SETOBIQOPKEYCOMMDATA: receivedData
					}, function (response) {
						if (chrome.runtime.lastError) { }
						localStorage.removeItem("OBIQOpkeyCommData");
					});
				}
			}

			var obiqManualExecutionData = localStorage.getItem("ObiqManualExecutionData");
			if (obiqManualExecutionData != null && obiqManualExecutionData != "") {
				var obiqManualExecutionDataObject = JSON.parse(obiqManualExecutionData);
				obiqManualExecutionDataObject["artifactExecutionSessionId"] = createUUID();
				chrome.runtime.sendMessage({
					SETOPKEYEXECUTIONINFORMATION: obiqManualExecutionDataObject
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});
				localStorage.removeItem("ObiqManualExecutionData");
			}

			var removeObiqManualExecutionData = localStorage.getItem("RemoveObiqManualExecutionData");
			if (removeObiqManualExecutionData != null && removeObiqManualExecutionData != "") {
				chrome.runtime.sendMessage({
					RESETOPKEYEXECUTIONINFORMATION: "RESETOPKEYEXECUTIONINFORMATION"
				}, function (response) {
					if (chrome.runtime.lastError) { }
				});
				localStorage.removeItem("RemoveObiqManualExecutionData");
			}

			chrome.runtime
				.sendMessage({
					GetCommonCommand: "GetCommonCommand"
				},
					function (response) {
						if (response != null) {
							debugger
							if (response.action == "RefreshUserGuidePage") {
								let obiqRefreshButton = document.querySelector("body > ngb-modal-window > div > div > app-obiq-erp-guide-steps-modal > app-obiq-erp-guide-steps-inner > div > div.modal-header.border_bottom > div:nth-child(2) > div > button:nth-child(2)");

								if (obiqRefreshButton == null) {
									obiqRefreshButton = document.querySelector("#divUserGuide > div.modal-header.border_bottom > div:nth-child(2) > div > button");
								}

								if (obiqRefreshButton != null) {
									chrome.runtime
										.sendMessage({
											RemoveCommonCommand: "RemoveCommonCommand"
										},
											function (response) {
												window.setTimeout(function () {
													try {
														obiqRefreshButton.click();
														window.setTimeout(function () {
															obiqRefreshButton.click();
														}, 300);
													} catch (e) { }
												}, 1000);
											});
								}
							}
						}
					});
		} catch (e) { }
	}, 300);
}

obiq_addOpkeyPluginListner();