let GUIDE_PROMPTS_DATA_ARRAY = [];
let USER_GUIDE_STEP_CURRENT_INDEX = 0;

let currentPageSnapShot = null;
let temp_currentPageSnapShot = null;
var allAppSessions = [];
chrome.runtime.onMessage
  .addListener(function (request, sender, sendResponse) {
    if (request.action != null) {
      switch (request.action) {
        case "warmup":
          console.log("Offscreen warmed up");
          sendResponse("Done")
          break;
        case "offscreen_localStorage_setItem":
          localStorage.setItem(request.data.key, request.data.value);
          sendResponse("Done")
          break;

        case "offscreen_localStorage_removeItem":
          localStorage.removeItem(request.data.key);
          sendResponse("Done")
          break;

        case "offscreen_localStorage_getItem":
          var value = localStorage.getItem(request.data.key);
          if (value == null) {
            sendResponse(null);
          }
          else {
            sendResponse(value);
          }
          break;

        case "offscreen_createImageOfElement_helper":
          (async function () {
            var response = await offscreen_createImageOfElement_helper(request.data.stepObject, request.data.imageBase64);
            sendResponse(response);
          })();
          break;

        case "offscreen_openSnippingTool_helper":
          (async function () {
            var response = await offscreen_openSnippingTool_helper(request.data.streamId);
            sendResponse(response);
          })();
          break;

        case "offscreen_recursiveImageMerge_helper":
          (async function () {
            var response = await offscreen_recursiveImageMerge_helper(request.data.imageDataURLs, request.data.imageDirtyCutAt, request.data.hasVscrollbar);
            sendResponse(response);
          })();
          break;

        case "offscreen_ysFixWebmDuration":
          (async function () {
            var response = await offscreen_ysFixWebmDuration(request.data.base64String, request.data.duration);
            sendResponse(response);
          })();
          break;

        case "offscreen_createObjectURL":
          (async function () {
            var response = await offscreen_createObjectURL(request.data.recordedChunks);
            sendResponse(response);
          })();

          break;

        case "offscreen_createObjectURL_fixduration":
          (async function () {
            var response = await offscreen_createObjectURL_fixduration(request.data.recordedChunks, request.data.duration);
            sendResponse(response);
          })();
          break;

        case "obiq_userguide_get_steps_info":
          (async function () {
            var response = await getUserGuideStepsInfoFromJourneyId(request.data.journeyId, request.data.lang, request.data.userId, request.data.projectId);
            sendResponse(response);
          })();
          break;
        case "set_guide_prompts_data_array":
          (async function () {
            var response = await set_guide_prompts_data_array(request.data.guideStepsArray);
            sendResponse(response);
          })();
          break;

        case "get_guide_prompts_data_array":
          (async function () {
            var response = await get_guide_prompts_data_array();
            sendResponse(response);
          })();
          break;

        case "clear_guide_prompts_data_array":
          (async function () {
            var response = await clear_guide_prompts_data_array();
            sendResponse(response);
          })();
          break;

        case "set_guide_step_current_index":
          (async function () {
            var response = await set_guide_step_current_index(request.data.currentIndex);
            sendResponse(response);
          })();
          break;

        case "get_guide_step_current_index":
          (async function () {
            var response = await get_guide_step_current_index();
            sendResponse(response);
          })();
          break;

        case "SendDataToTelemetryServer":
          (async function () {
            var response = await SendDataToTelemetryServer(request.data);
            sendResponse(response);
          })();
          break;
      }
    }
    return true;
  });

let currentOpkeyProjectId = null;
let obiqTagObject = null;

function processObiqCommData(commData) {
  if (commData == null) { return }
  if (commData["isTagObjectData"] != null && commData["isTagObjectData"] == true) {
    obiqTagObject = commData["tagObject"];
  }
}


function SendDataToTelemetryServer(requestData) {
  return new Promise(async function (resolve, reject) {
    var dataToSend = requestData["mainDataDto"];
    var pageSnapShot = currentPageSnapShot;
    if (requestData["pageSnapShot"]) {
      pageSnapShot = requestData["pageSnapShot"];
    }
    if (pageSnapShot === null || pageSnapShot === "") {
      pageSnapShot = await getVisiblePageSnapShot();
    }

    if (pageSnapShot === null || pageSnapShot === "") {
      if (temp_currentPageSnapShot !== null && temp_currentPageSnapShot !== "") {
        pageSnapShot = temp_currentPageSnapShot;
      }
    }

    temp_currentPageSnapShot = pageSnapShot;

    var analyticSessionId = getAnalyticSessionIdByUrl(localStorage.getItem("URL_TO_TRACK_FOR_JOURNEY"));

    if (dataToSend["pageUrl"] && dataToSend["pageUrl"].indexOf("oraclecloud.com") > -1) {
      dataToSend["pageUrl"] = dataToSend["pageUrl"].replace("login-", "");
    }

    var opkeytelemetryUrl = null;

    dataToSend["userId"] = getCurrentUserId(dataToSend["pageUrl"]);
    dataToSend["sessionId"] = analyticSessionId;

    markThisSessionDataAsBenchMarked(analyticSessionId);

    if (opkey_execution_info != null) {
      if (opkey_execution_info["trackUserJourney"] == true) {
        if (all_added_artifact_execution.indexOf(opkey_execution_info["artifactExecutionSessionId"]) == -1) {
          dataToSend["trackExecutionJourney"] = opkey_execution_info["trackUserJourney"];
          dataToSend["opkeyDomainName"] = opkey_execution_info["opkeyServerUrl"];
          dataToSend["opkeyProjectId"] = opkey_execution_info["projectID"];
          dataToSend["opkeyProjectName"] = opkey_execution_info["projectName"];
          dataToSend["opkeyArtifactId"] = opkey_execution_info["artifactId"];
          dataToSend["opkeyTestSuiteId"] = opkey_execution_info["testSuiteId"];
          dataToSend["artifactName"] = opkey_execution_info["artifactName"];
          dataToSend["opkeyExecutionSessionId"] = opkey_execution_info["sessionId"];
          dataToSend["opkeySessionExecutionMode"] = opkey_execution_info["executionMode"];
          dataToSend["opkeyArtifactExecutionSessionId"] = opkey_execution_info["artifactExecutionSessionId"];
          dataToSend["sessionId"] = opkey_execution_info["artifactExecutionSessionId"];
          dataToSend["userGuideId"] = opkey_execution_info["userGuideId"];

          dataToSend["categoryFolderName"] = opkey_execution_info["categoryFolderName"];

          dataToSend["moduleName"] = opkey_execution_info["moduleName"];
          dataToSend["subModuleName"] = opkey_execution_info["subModuleName"];
          dataToSend["activityName"] = opkey_execution_info["activityName"];
          dataToSend["subActivityName"] = opkey_execution_info["subActivityName"];
          dataToSend["subActivityStatus"] = opkey_execution_info["subActivityStatus"];

          if (opkey_execution_info["createJourneyOnly"]!==undefined) {
            dataToSend["createJourneyOnly"] = opkey_execution_info["createJourneyOnly"];
          }

          if(opkey_execution_info["dataMaskingEnabled"]!==undefined){
            dataMaskingEnabled=opkey_execution_info["dataMaskingEnabled"];
          }
          current_opkey_execution_info = opkey_execution_info;
          all_added_artifact_execution.push(opkey_execution_info["artifactExecutionSessionId"]);

          currentOpkeyProjectId = dataToSend["opkeyProjectId"];

          obiqTagObject = null;
        }

      }

      if (opkey_execution_info["overrideJourneySessionId"] != null && opkey_execution_info["overrideJourneySessionId"] == true) {
        dataToSend["sessionId"] = opkey_execution_info["artifactExecutionSessionId"];
      }
    }

    //debugger
    localStorage.setItem("obiq_journey_sessionId", dataToSend["sessionId"]);

    if (currentOpkeyProjectId != null) {
      dataToSend["opkeyProjectId"] = currentOpkeyProjectId;
    }

    if (current_opkey_execution_info) {
      dataToSend["opkeyUserId"] = current_opkey_execution_info["opkeyUserId"];
      dataToSend["opkeyAgentId"] = current_opkey_execution_info["opkeyAgentId"];
      dataToSend["originCountry"] = current_opkey_execution_info["originCountry"];
      dataToSend["browserName"] = current_opkey_execution_info["browserName"];
      dataToSend["opkeyComponentName"] = current_opkey_execution_info["opkeyComponentName"];
      dataToSend["opkeyComponentId"] = current_opkey_execution_info["opkeyComponentId"];
    }

    dataToSend["OpkeyTelemetryUrl"] = opkeytelemetryUrl;

    if (opkeySessionData == null || opkeySessionData == "") {
      opkeySessionData = await getOpkeySessionData();
    }
    if (opkeySessionData != null) {
      if (opkeySessionData["ProjectDTO"] != null && opkeySessionData["ProjectDTO"]["P_ID"] != null) {
        dataToSend["opkeyProjectId"] = opkeySessionData["ProjectDTO"]["P_ID"];
      }

      if (opkeySessionData["UserDTO"] != null && opkeySessionData["UserDTO"]["U_ID"] != null) {
        dataToSend["opkeyUserId"] = opkeySessionData["UserDTO"]["U_ID"];
      }

    }


    if (obiqTagObject != null) {

      obiqTagObject["opkeyProjectId"] = dataToSend["opkeyProjectId"];
      obiqTagObject["sessionId"] = dataToSend["sessionId"];


      dataToSend["tagObject"] = obiqTagObject;
    }

    if (!dataToSend["browserName"]) {
      dataToSend["browserName"] = await getBrowserName();
    }

    if (userCountry) {
      dataToSend["originCountry"] = userCountry;
    }


    let areasToMaskInImage = dataToSend["areasToMaskInImage"];

    pageSnapShot = await blackoutImage(pageSnapShot, areasToMaskInImage);

    let areaToHighlightInImage = dataToSend["areaToHighlightInImage"];

    pageSnapShot = await addCircleToImage(pageSnapShot, areaToHighlightInImage);

    var imageDataObject = new Object();
    imageDataObject["sessionId"] = dataToSend["sessionId"];
    imageDataObject["dataId"] = dataToSend["dataId"];
    imageDataObject["pageSnapShot"] = pageSnapShot;

    imageDataObject["OpkeyTelemetryUrl"] = opkeytelemetryUrl;

    if (isUserGuideRecording() === false) {
      all_tacking_data_to_send.push(dataToSend);
      all_tacking_data_snapshot.push(imageDataObject);
    }
    currentPageSnapShot = null;

    resolve({ mainData: dataToSend, imageData: imageDataObject });
  });
}


async function getBrowserName() {
  if (navigator.userAgentData) {
    const data = await navigator.userAgentData.getHighEntropyValues(["brands"]);
    const brands = data.brands.map(b => b.brand);
    if (brands.some(b => b.includes("Edge"))) return "Edge";
    if (brands.some(b => b.includes("Chrome"))) return "Chrome";
    if (brands.some(b => b.includes("Firefox"))) return "Firefox";
    if (brands.some(b => b.includes("Safari"))) return "Safari";
  }

  const userAgent = navigator.userAgent;
  if (userAgent.includes("Edg/")) return "Edge";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";

  return "CustomApp";
}

function isUserGuideRecording() {

  if (!obiqRecordingType || obiqRecordingType === "") {
    return false;
  }

  return obiqRecordingType === "USER_GUIDE_RECORDING";
}

function set_guide_step_current_index(currentStepIndex) {
  return new Promise(function (resolve, reject) {
    USER_GUIDE_STEP_CURRENT_INDEX = currentStepIndex;
    //   console.log("Set USER_GUIDE_STEP_CURRENT_INDEX " + USER_GUIDE_STEP_CURRENT_INDEX)
    resolve("Done");
  });
}

function get_guide_step_current_index() {
  return new Promise(function (resolve, reject) {
    //    console.log("Get USER_GUIDE_STEP_CURRENT_INDEX " + USER_GUIDE_STEP_CURRENT_INDEX)
    resolve(USER_GUIDE_STEP_CURRENT_INDEX);
  });
}

function set_guide_prompts_data_array(guideStepsArray) {
  return new Promise(function (resolve, reject) {
    GUIDE_PROMPTS_DATA_ARRAY = guideStepsArray;
    USER_GUIDE_STEP_CURRENT_INDEX = 0;
    resolve("Done");
  });
}

function get_guide_prompts_data_array() {
  return new Promise(function (resolve, reject) {
    if (GUIDE_PROMPTS_DATA_ARRAY == null) {
      GUIDE_PROMPTS_DATA_ARRAY = [];
    }
    resolve(GUIDE_PROMPTS_DATA_ARRAY);
  });
}

function clear_guide_prompts_data_array() {
  return new Promise(function (resolve, reject) {
    GUIDE_PROMPTS_DATA_ARRAY = [];
    USER_GUIDE_STEP_CURRENT_INDEX = 0;
    resolve("Done");
  });
}

function getUserGuideStepsInfoFromJourneyId(_journeySessionId, _lang, _userId, _projectId) {

  return new Promise(function (resolve, reject) {
    $.ajax({
      url: getRootTraceAiUrl() + '/OpkeyUserGuideController/getUserGuideStepsInfoFromJourneyIdForCompanionApp',
      type: 'POST',
      contentType: 'application/json',
      timeout: 60000,
      data: JSON.stringify({ "journeySessionId": _journeySessionId, "lang": _lang, "userId": _userId, "projectId": _projectId }),
      success: function (response) {
        resolve(response);
      },
      error: function (xhr, status, error) {
        resolve([]);;
      }
    });
  });
}

async function offscreen_createObjectURL_fixduration(base64String, duration) {
  return new Promise(function (resolve, reject) {
    const blob = b64toBlob(base64String, "video/x-matroska;codecs=avc1");
    ysFixWebmDuration(blob, duration, function (fixedBlob) {
      var url = URL.createObjectURL(fixedBlob);
      resolve(url);
    });
  });
}


async function offscreen_createObjectURL(base64String) {
  return new Promise(function (resolve, reject) {
    const blob = b64toBlob(base64String, "video/x-matroska;codecs=avc1");
    var superBuffer = new Blob([blob], {
      type: 'video/mp4'
    });
    var url = URL.createObjectURL(superBuffer);
    resolve(url);
  });
}


async function offscreen_ysFixWebmDuration(base64String, duration) {
  return new Promise(function (resolve, reject) {
    const blob = b64toBlob(base64String, "video/x-matroska;codecs=avc1");
    ysFixWebmDuration(blob, duration, function (fixedBlob) {
      resolve(fixedBlob);
    });
  });
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

async function offscreen_recursiveImageMerge_helper(imageDataURLs, imageDirtyCutAt, hasVscrollbar, images = [], i = 0) {
  if (i >= imageDataURLs.length) {
    // All images have been processed
    return mergeImages(images, imageDirtyCutAt, hasVscrollbar);
  }

  return new Promise((resolve, reject) => {
    //debugger; // Initial debugger statement when processing starts
    const img = new Image();
    img.onload = async function () {
      images[i] = img;
      // Clear the data URL to free memory
      imageDataURLs[i] = null;

      try {
        // Recursive call for the next image
        const result = await offscreen_recursiveImageMerge_helper(
          imageDataURLs,
          imageDirtyCutAt,
          hasVscrollbar,
          images,
          i + 1
        );
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = function (err) {
      reject(new Error(`Failed to load image at index ${i}: ${imageDataURLs[i]}`));
    };
    img.src = imageDataURLs[i]; // Start loading the image
  });
}

function mergeImages(images, imageDirtyCutAt, hasVscrollbar) {
  if (images.length === 0) {
    throw new Error("No images to merge.");
  }

  const canvas = document.createElement('canvas');
  canvas.width = images[0].width - (hasVscrollbar ? 15 : 0);

  if (images.length > 1) {
    canvas.height = (images.length - 1) * images[0].height + imageDirtyCutAt;
  } else {
    canvas.height = images[0].height;
  }

  // Ensure canvas height does not exceed maximum allowed value
  if (canvas.height > 32766) canvas.height = 32766;

  const ctx = canvas.getContext("2d");

  images.forEach((img, j) => {
    let cut = 0;
    if (images.length > 1 && j === images.length - 1) {
      cut = img.height - imageDirtyCutAt;
    }

    const height = img.height - cut;
    const width = img.width;

    ctx.drawImage(
      img,
      0,
      cut,
      width,
      height,
      0,
      j * images[0].height,
      width,
      height
    );
  });

  return canvas.toDataURL("image/png");
}

async function offscreen_createImageOfElement_helper(step_object, current_window_image) {
  return new Promise((resolve, reject) => {
    var object_or = step_object.arguments[0];
    var canvas = null;
    var element_rectangle = new Object();
    element_rectangle.x = parseFloat(object_or["element:x"]);
    element_rectangle.x -= 100;
    element_rectangle.y = parseFloat(object_or["element:y"]);
    element_rectangle.y -= 100;
    element_rectangle.width = parseFloat(object_or["element:width"]);
    element_rectangle.height = parseFloat(object_or["element:height"]);
    element_rectangle.width += 200;
    element_rectangle.height += 200;
    if (element_rectangle != null) {
      if (current_window_image == null || current_window_image == "") {
        step_object.arguments[0]["ObjectImage"] = "";
        resolve(step_object);
        return;
      }
      if (current_window_image != "") {
        // debugger
        if (canvas == null) {
          canvas = document.createElement("canvas");
          document.body.appendChild(canvas);
        }
        var partialImage = new Image();
        let ratio = window.devicePixelRatio;
        partialImage.onload = async function () {
          canvas.width = element_rectangle.width;
          canvas.height = element_rectangle.height;
          var context = canvas.getContext("2d");
          context.drawImage(partialImage, element_rectangle.x * ratio,
            element_rectangle.y * ratio, element_rectangle.width *
          ratio, element_rectangle.height * ratio, 0,
            0, element_rectangle.width, element_rectangle.height);
          var croppedDataUrl = canvas.toDataURL();
          step_object = await scaleImage(step_object, croppedDataUrl, current_window_image, 150, 150);
          resolve(step_object);
        }
        partialImage.src = current_window_image;
      }
    }
  });
}

async function scaleImage(step_object, base_64, full_pagebase64, width, height) {

  let isRecordingUserGuide = (localStorage.getItem("isRecordingUserGuide") != null && localStorage.getItem("isRecordingUserGuide") === "true") ? true : false;

  if (full_pagebase64 == null || full_pagebase64 === "") {
    let fullPageImage = await sendMessageToBackgroundScriptWithPromise("chrome.tabs.captureVisibleTab", {
      format: "jpeg"
    });

    if (fullPageImage == null || fullPageImage == "") {
      fullPageImage = await sendMessageToBackgroundScriptWithPromise("chrome.tabs.captureVisibleTab", {
        format: "jpeg"
      });
    }

    if (fullPageImage == null || fullPageImage == "") {
      fullPageImage = await sendMessageToBackgroundScriptWithPromise("chrome.tabs.captureVisibleTab", {
        format: "jpeg"
      });
    }

    if (fullPageImage != null && fullPageImage != "") {
      full_pagebase64 = fullPageImage;
    }

  }

  //debugger

  return new Promise((resolve, reject) => {
    var img = new Image();
    var width = 100;
    var height = 100;
    img.onload = function () {
      width = img.width;
      height = img.height;

      var is_condition_accepted = false;
      if (is_condition_accepted == false) {
        step_object.arguments[0]["ObjectImage"] = base_64;
        if (isRecordingUserGuide === true) {
          step_object.arguments[0]["FullPageImage"] = full_pagebase64;
          //debugger

        }
        resolve(step_object);
        return;
      }
      var canvas = document.createElement("canvas"),
        ctx = canvas
          .getContext("2d");
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      step_object.arguments[0]["ObjectImage"] = canvas.toDataURL();
      if (isRecordingUserGuide === true) {
        step_object.arguments[0]["FullPageImage"] = full_pagebase64;
        //debugger
      }
      resolve(step_object);
    }
    img.src = base_64;
  });
}

async function offscreen_openSnippingTool_helper(stream_id) {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: stream_id,
        }
      }
    }).then(stream => {

      window.setTimeout(() => {
        const video = document.createElement('video');

        video.addEventListener('loadedmetadata', function () {
          const canvas = document.createElement('canvas');
          canvas.width = this.videoWidth;
          canvas.height = this.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(this, 0, 0);
          const image = canvas.toDataURL();
          localStorage_setItem("IMAGE_CROP_IMAGE", image);
          video.pause();

          resolve(image);
        }, false);

        video.srcObject = stream;
        video.play();
      }, 600);
    }).catch(err => {
      console.error('Could not get stream: ', err);
      reject(null);
    });
  });
}




//################################################### Obiq Area ##########################################

var current_UserId = "";
var WINDOW_CURRENT_IAMGE_BASE64 = "";

var opkey_execution_info = null;
var current_opkey_execution_info = null;
let userCountry = null;
let dataMaskingEnabled=true;

var all_added_artifact_execution = [];

var benchMarkSubActivityJourney = false;

var flag_canHighlightElementForUserGuide = false;

var creatingNewSessionIDForUserGuide = false;

var obiqRecordingType = null;

var get_opkey_domain =

  setCurrentDomainName(getRootUrl());


function getRootUrl() {
  let _tempRootUrl = localStorage.getItem("OPKEY_DOMAIN_NAME");
  if (_tempRootUrl != null) {
    _tempRootUrl = _tempRootUrl.replace(/\/$/, '');
  }
  return _tempRootUrl;
}

function getDebugRootUrl() {
  let _tempRootUrl = localStorage.getItem("OPKEY_DOMAIN_NAME_DEBUG");
  if (_tempRootUrl != null && _tempRootUrl.trim() == "") {
    return null;
  }
  if (_tempRootUrl != null) {
    _tempRootUrl = _tempRootUrl.replace(/\/$/, '');
  }
  return _tempRootUrl;
}

function getRootTraceAiUrl() {
  if (getDebugRootUrl()) {
    return getDebugRootUrl() + "/OpkeyObiqServerApi/OpkeyTraceIAAnalyticsApi";
  }
  return getRootUrl() + "/OpkeyObiqServerApi/OpkeyTraceIAAnalyticsApi";

}

function createUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function of_getProcessName() {
  var of_processName = localStorage.getItem("OF_ProcessName");

  if (of_processName == null || of_processName == "") {
    return null;
  }

  return of_processName;
}

function of_getCurrentSubActivityName() {
  var of_subActivityName = localStorage.getItem("OF_SubActivityName");

  if (of_subActivityName == null || of_subActivityName == "") {
    return null;
  }

  return of_subActivityName;
}

function of_removeCurrentSubActivityName() {
  localStorage.removeItem("OF_SubActivityName");
}


var oracleLoginFlagCalled = false;
function getAnalyticSessionIdByUrl(hostName) {
  for (var ai = 0; ai < allAppSessions.length; ai++) {
    if (allAppSessions[ai]["hostName"] == hostName) {
      return allAppSessions[ai]["sessionId"];
    }
  }

  var sessionObject = new Object();
  sessionObject["sessionId"] = createUUID();

  sessionObject["hostName"] = hostName;

  updateSessionId(sessionObject);
  allAppSessions.push(sessionObject);

  return sessionObject["sessionId"];
}


function updateSessionId(_sessionObject) {
  if (opkey_execution_info != null) {
    if (opkey_execution_info["trackUserJourney"] == true) {
      _sessionObject["sessionId"] = opkey_execution_info["artifactExecutionSessionId"];

    }
  }
}

var docker_data_list = [];
var docker_data_error_solution = null;
var docker_data_error_blink = null;
var docker_data_position = null;

var username_map_domain_list = [];
var docker_userguide_data = null;

let dataFromCompanionApp = [];
let dataForCompanionApp = [];
function addUserInMap(_dataObject) {
  var alreadyAdded = false;

  _dataObject["DomainName"] = _dataObject["DomainName"].replace("login-", "");
  _dataObject["DomainName"] = _dataObject["DomainName"].replace("fa-", "");

  for (var ia = 0; ia < username_map_domain_list.length; ia++) {
    if (username_map_domain_list[ia]["DomainName"] == _dataObject["DomainName"]) {
      alreadyAdded = true;
      if (_dataObject["UserId"] != null && _dataObject["UserId"] != "") {
        username_map_domain_list[ia]["UserId"] = _dataObject["UserId"];
      }
      break;
    }
  }

  if (alreadyAdded == false) {
    username_map_domain_list.push(_dataObject);
  }
}

function getCurrentUserId(_fullUrl) {
  if (_fullUrl == null) {
    return "Unknown User";
  }

  var domainName = obiq_getDomainName(_fullUrl);
  domainName = domainName.replace("login-", "");
  domainName = domainName.replace("fa-", "");
  for (var ia = 0; ia < username_map_domain_list.length; ia++) {
    if (username_map_domain_list[ia]["DomainName"] == domainName) {
      return username_map_domain_list[ia]["UserId"];
    }
  }

  return "Unknown User";
}

function obiq_getDomainName(url) {
  try {
    const urlObject = new URL(url);
    return urlObject.hostname;
  } catch (error) {
    return null;
  }
}


var all_tacking_data_to_send = [];
var all_tacking_data_snapshot = [];
let opkeySessionData = null;
chrome.runtime.onMessage
  .addListener(function (request, sender, sendResponse) {

    if (request.SendDataToIngestControllerThread) {

      sendDataToIngestControllerThread();
      sendImageDataToIngestControllerThread();
      sendResponse("Sent");
    }
    if (request.SendUserName) {
      if (request.SendUserName != null) {
        addUserInMap(request.SendUserName);
      }
      sendResponse("Done");
    }

    if (request.SendOFProcessName) {
      if (request.SendOFProcessName == "REMOVE_CURRENT_PROCESS") {
        localStorage.removeItem("OF_ProcessName");
      }
      else {
        localStorage.setItem("OF_ProcessName", request.SendOFProcessName);
      }
      sendResponse("Done");
    }

    if (request.SendOFSubActivityName) {
      if (request.SendOFSubActivityName == "REMOVE_CURRENT_SUBACTIVITY") {
        localStorage.removeItem("OF_SubActivityName");
      }
      else {
        localStorage.setItem("OF_SubActivityName", request.SendOFSubActivityName);
      }
      sendResponse("Done");
    }

    if (request.SendOFProcessId) {
      sendOracleFusionProcessId(request.SendOFProcessId);
      sendResponse("Done");
    }

    if (request.GetAllAgentWhiteListedUrls) {
      var allWhiteListedUrls = getAllAgentWhiteListedUrls();
      sendResponse(allWhiteListedUrls);
    }

    if (request.GetAllAgentRolesAndPrivileges) {
      var agentRoles = getAllAgentPrivilegesRoles();
      if (agentRoles == null) {
        sendResponse([]);
      }
      else {
        sendResponse(agentRoles);
      }
    }

    if (request.SETDOCKERDATA) {
      let temp_docker_data = request.SETDOCKERDATA;
      docker_data_list.push(temp_docker_data);
      sendResponse("Done");
    }

    if (request.SETOBIQOPKEYCOMMDATA) {
      let commData = request.SETOBIQOPKEYCOMMDATA;
      processObiqCommData(commData);
      sendResponse("Done")
    }

    if (request.SETOPKEYEXECUTIONINFORMATION) {
      allAppSessions = [];
      flag_canHighlightElementForUserGuide = true;
      opkey_execution_info = request.SETOPKEYEXECUTIONINFORMATION;
      var serverRootUrl = opkey_execution_info["opkeyServerUrl"];
      setCurrentDomainName(serverRootUrl);

      if (opkey_execution_info["executionMode"] == "Automated") {
        sessionStorage.setItem("OBIQ_EXECUTION_MODE", "Automated");
        localStorage.setItem("URL_TO_TRACK_FOR_JOURNEY", "IGNORE_IN_AUTOMATED");
      }

      else {
        (async function () {
          sessionStorage.removeItem("OBIQ_EXECUTION_MODE");
          let currentTab = await sendMessageToBackgroundScriptWithPromise("chrome.tabs.getActiveTabInfo", {});
          localStorage.setItem("URL_TO_TRACK_FOR_JOURNEY", currentTab.id);
        })();
      }
      sendResponse("Done");
    }

    if (request.RESETOPKEYEXECUTIONINFORMATION) {
      flag_canHighlightElementForUserGuide = false;
      allAppSessions = [];
      opkey_execution_info = null;
      sendResponse("Done");
    }

    if (request.GETDOCKERDATA) {
      var tempData = docker_data_list.shift();
      sendResponse(tempData);
    }

    if (request.SET_DATA_FOR_COMPANION_APP) {
      let dataToPush = request.SET_DATA_FOR_COMPANION_APP;
      if (dataToPush) {
        dataForCompanionApp.push(dataToPush);
      }
      sendResponse("Done");
    }

    if (request.GET_DATA_FOR_COMPANION_APP) {
      let dataToSend = dataForCompanionApp.shift();
      sendResponse(dataToSend);
    }

    if (request.SET_DATA_FROM_COMPANION_APP) {
      let dataToPush = request.SET_DATA_FROM_COMPANION_APP;
      if (dataToPush) {
        dataFromCompanionApp.push(dataToPush);
      }
      sendResponse("Done");
    }

    if (request.GET_DATA_FROM_COMPANION_APP) {
      let dataToSend = dataFromCompanionApp.shift();
      sendResponse(dataToSend);
    }

    if (request.SET_DOCKER_EVENT_USERGUIDE_DATA) {
      docker_userguide_data = request.SET_DOCKER_EVENT_USERGUIDE_DATA;
      sendResponse("Done")
    }


    if (request.GET_DOCKER_EVENT_USERGUIDE_DATA) {

      var tempData = null;
      if (docker_userguide_data != null) {
        tempData = docker_userguide_data;
        docker_userguide_data = null;
      }
      sendResponse(tempData)
    }

    if (request.SETDOCKERERPERRORSOLUTION) {
      docker_data_error_solution = request.SETDOCKERERPERRORSOLUTION;
      sendResponse("Done");
    }

    if (request.GETDOCKERERPERRORSOLUTION) {
      var tempData = null;
      if (docker_data_error_solution != null) {
        tempData = docker_data_error_solution;
        docker_data_error_solution = null;
      }
      sendResponse(tempData);
    }

    if (request.SETERRORBLINKDATA) {
      docker_data_error_blink = request.SETERRORBLINKDATA;
      sendResponse("Done");
    }

    if (request.GETERRORBLINKDATA) {
      var tempData = null;
      if (docker_data_error_blink != null) {
        tempData = docker_data_error_blink;
        docker_data_error_blink = null;
      }
      sendResponse(tempData);
    }

    if (request.SETDOCKERDATA_DIVPOSITION) {
      docker_data_position = request.SETDOCKERDATA_DIVPOSITION;
    }

    if (request.GETDOCKERDATA_DIVPOSITION) {
      sendResponse(docker_data_position);
    }

    if (request.TakeCurrentPageSnapshot) {
      (async function () {
        currentPageSnapShot = await getVisiblePageSnapShot();
        sendResponse(currentPageSnapShot);
      })();

    }

    if (request.action != null) {
      switch (request.action) {
        case "oft_getErrorSolutionFromObserveIq":
          handle_Async_function(request, sendResponse);
          break;
        case "callExternalSideRestApi":
          handle_Async_function(request, sendResponse);
          break;

        case "getCurrentDomain":
          handle_Async_function(request, sendResponse);
          break;

        case "checkUrlExists":
          handle_Async_function(request, sendResponse);
          break;
        case "getCurrentMainDomain":
          handle_Async_function(request, sendResponse);
          break;

        case "openExternalUrl":
          if (request.data != null && (request.data.indexOf("/incident/create") > -1 || request.data.indexOf("/opkeyone/obiq/incidents") > -1)) {
            sendIncidentDataToServer();
          }

          sendResponse("Done")
          break;
      }
    }

    if (request.CanHighlightElementForUserGuide) {
      sendResponse(flag_canHighlightElementForUserGuide);
    }

    if (request.TurnOnHighlightElementForUserGuide) {
      flag_canHighlightElementForUserGuide = true;
      sendResponse(flag_canHighlightElementForUserGuide);
    }

    if (request.TurnOffHighlightElementForUserGuide) {
      flag_canHighlightElementForUserGuide = false;
      sendResponse(flag_canHighlightElementForUserGuide);
    }

    if (request.StartCreatingNewSessionIDForUserGuide) {
      creatingNewSessionIDForUserGuide = true;
      sendResponse(creatingNewSessionIDForUserGuide);
    }

    if (request.StopCreatingNewSessionIDForUserGuide) {
      creatingNewSessionIDForUserGuide = false;
      sendResponse(creatingNewSessionIDForUserGuide);
    }

    if (request.GetUrlToTrack) {
      sendResponse(localStorage.getItem("URL_TO_TRACK_FOR_JOURNEY"));
    }

    if (request.SetUrlToTrack) {
      (async function () {
        let currentTab = await sendMessageToBackgroundScriptWithPromise("chrome.tabs.getActiveTabInfo", {});
        debugger
        localStorage.setItem("URL_TO_TRACK_FOR_JOURNEY", currentTab.id);
      })();
      sendResponse("Done");
    }

    if (request.GetObiqExecutionMode) {
      sendResponse(sessionStorage.getItem("OBIQ_EXECUTION_MODE"));
    }

    if (request.SET_OBIQ_RECORDING_TYPE) {
      obiqRecordingType = request.SET_OBIQ_RECORDING_TYPE;
      allAppSessions = [];
      sendResponse("Done")
    }

    if (request.GET_OBIQ_RECORDING_TYPE) {
      sendResponse(obiqRecordingType)
    }

    if (request.action != null) {
      switch (request.action) {
        case "offscreen_localStorage_getItem":
          var value = localStorage.getItem(request.data.key);
          if (value == null) {
            sendResponse(null);
          }
          else {
            sendResponse(value);
          }
          break;
      }
    }

    return true;
  });

function of_getMainProcessName(processName) {
  if (processName == null) {
    return null;
  }

  processName = processName.trim();

  //Module Name - Finance

  let finance_array = [
    "Cash Management",
    "Expenses",
    "Record to Report",
    "Receivables",
    "Asset To Retire",
    "Payables"
  ];


  //Module Name - Human Capital Management
  let hcm_array = [
    "Absence Management",
    "Recruiting",
    "Learning",
    "Profile Management to Performance",
    "Talent Management to Learning",
    "Time and Labor to Payroll",
    "Payroll",
    "Hire to Retire",
    "Benefits",
    "Time and Labor to Absence Management",
    "Global HR to Absence Management",
    "Goal Management",
    "Performance Management",
    "Global Payroll",
    "Compensation"
  ];


  //Module Name - Supply Chain Management
  let scm_array = [
    "Inventory Management",
    "Sourcing",
    "Procure to Pay",
    "Back to Back Process",
    "Costing",
    "Supplier Management",
    "Drop-Shipment Process",
    "Order to Cash",
    "Manufacturing"
  ];

  //Module Name - Project Portfolio Management
  let ppm_array = ["Project to Invoice"];

  if (finance_array.indexOf(processName) > -1) {
    return "Finance";
  }

  if (hcm_array.indexOf(processName) > -1) {
    return "Human Capital Management";
  }

  if (scm_array.indexOf(processName) > -1) {
    return "Supply Chain Management";
  }

  if (ppm_array.indexOf(processName) > -1) {
    return "Project Portfolio Management";
  }
  return null;
}

function loadImage(base64Str) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = base64Str;
  });
}

async function blackoutImage(base64Str, fieldsArray) {
  if(dataMaskingEnabled==false){
        return base64Str;
  }
  if (fieldsArray == null || fieldsArray.length == 0) {
    return base64Str;
  }
  try {
    const img = await loadImage(base64Str);
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      ctx.fillStyle = 'rgba(255, 255, 255, 1)';

      //      ctx.fillStyle = 'rgba(255, 0, 0, 1)';


      fieldsArray.forEach(field => {

        let _field_x = field.x;
        let _field_y = field.y;
        let _field_width = field.width;
        let _field_height = field.height;


        if (field.height > 50) {
          _field_x = field.x + 10;
          _field_y = field.y + 10;
          _field_width = field.width - 20;
          _field_height = field.height - 20;
        }
        else {
          _field_x = field.x + 3;
          _field_y = field.y + 3;
          _field_width = field.width - 6;
          _field_height = field.height - 6;
        }
        _field_x = Math.max(0, _field_x);
        _field_y = Math.max(0, _field_y);
        _field_width = Math.min(_field_width, canvas.width - _field_x);
        _field_height = Math.min(_field_height, canvas.height - _field_y);

        ctx.fillRect(_field_x, _field_y, _field_width, _field_height);
      });

      const modifiedBase64 = canvas.toDataURL('image/png');
      //debugger

      resolve(modifiedBase64);
    });
  } catch (error) {
    console.error('Error processing image:', error);
  }

}

async function addCircleToImage(base64Str, fieldsArray) {
  if (fieldsArray == null || fieldsArray.length === 0) {
    return base64Str;
  }

  if (!Array.isArray(fieldsArray)) {
    fieldsArray = [fieldsArray];
  }

  try {
    const img = await loadImage(base64Str);
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      fieldsArray.forEach(field => {

        const centerX = field.x + field.width / 2;
        const centerY = field.y + field.height / 2;

        const radius = 40;

        ctx.fillStyle = "rgba(250, 204, 21, 0.498)";
        ctx.strokeStyle = "rgba(250, 204, 21, 0.75)";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      const modifiedBase64 = canvas.toDataURL('image/png');
      resolve(modifiedBase64);
    });
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

function setCurrentDomainName(_currentDomain) {
  localStorage.setItem("OPKEY_DOMAIN_NAME", _currentDomain);
}

async function getVisiblePageSnapShot() {
  let pageSnapshot = await sendMessageToBackgroundScriptWithPromise("chrome.tabs.captureVisibleTab", {
    format: "jpeg"
  });
  return pageSnapshot;
}

var ingestStatus = "READY";
var imageIngestStatus = "READY";
function sendDataToIngestController(dataToSend) {
  ingestStatus = "BUSY";

  // ingestStatus = "READY";

  let rootUrl = getRootTraceAiUrl();

  if (dataToSend[0] != null && dataToSend[0]["OpkeyTelemetryUrl"] != null) {
    rootUrl = dataToSend[0]["OpkeyTelemetryUrl"];
  }

  $.ajax({
    url: rootUrl + '/AppAnalyticsController/ingestAppTrackingDatav3',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(dataToSend),
    success: function (response) {
      ingestStatus = "READY"
    },
    error: function (xhr, status, error) {
      ingestStatus = "READY"
    }
  });
}

function getOpkeySessionData() {
  let executionMode = sessionStorage.getItem("OBIQ_EXECUTION_MODE");
  if (executionMode != null && executionMode === "Automated") {
    return null;
  }
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: getRootUrl() + "/OpkeyApi/GetSessionStatus",
      type: "GET",
      success: function (result) {
        resolve(result);
      },
      error: function (xhr, status, error) {
        resolve(null);
      }
    });
  });
}

function clearOpkeySessionData() {
  window.setTimeout(function () {
    opkeySessionData = null;
    console.log("opkeySessionData cleared");
    clearOpkeySessionData();
  }, 30000);
}

clearOpkeySessionData();

function uploadStepImageToServer(_dataToSend, _telemetryServerUrl) {

  imageIngestStatus = "BUSY";

  let rootUrl = getRootTraceAiUrl();
  if (_telemetryServerUrl != null) {
    rootUrl = _telemetryServerUrl;
  }
  $.ajax({
    url: rootUrl + '/ImageController/uploadStepImages',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(_dataToSend),
    success: function (response) {
      imageIngestStatus = "READY";
    },
    error: function (xhr, status, error) {
      imageIngestStatus = "READY";
    }
  });
}



async function sendDataToIngestControllerThread() {
  if (all_tacking_data_to_send.length > 0) {
    await sendMessageToBackgroundScriptWithPromise("injectDataProcessVariableToAllTabs", {
      name: "obiq_all_tacking_data_is_queued",
      value: "true"
    });
  }
  else {
    await sendMessageToBackgroundScriptWithPromise("injectDataProcessVariableToAllTabs", {
      name: "obiq_all_tacking_data_is_queued",
      value: "false"
    });
  }

  if (all_tacking_data_to_send.length > 0 && ingestStatus == "READY") {
    let dataArrayLength = all_tacking_data_to_send.length;

    var dataToSend = [];
    for (let vai = 0; vai < dataArrayLength; vai++) {
      dataToSend.push(all_tacking_data_to_send.shift());
    }

    try {
      sendDataToIngestController(dataToSend);
    } catch (e) { ingestStatus == "BUSY" }
  }
}

async function sendImageDataToIngestControllerThread() {

  if (all_tacking_data_snapshot.length > 0) {
    await sendMessageToBackgroundScriptWithPromise("injectDataProcessVariableToAllTabs", {
      name: "obiq_all_tacking_data_snapshot_is_queued",
      value: "true"
    });
  }
  else {
    await sendMessageToBackgroundScriptWithPromise("injectDataProcessVariableToAllTabs", {
      name: "obiq_all_tacking_data_snapshot_is_queued",
      value: "false"
    });
  }

  if (all_tacking_data_snapshot.length > 0 && imageIngestStatus == "READY") {

    let dataArrayLength = all_tacking_data_snapshot.length;

    var dataToSend = [];
    for (let vai = 0; vai < dataArrayLength; vai++) {

      let tempData = all_tacking_data_snapshot.shift();
      let imageObject = {
        "sessionId": tempData["sessionId"],
        "dataId": tempData["dataId"],
        "imageBase64": tempData["pageSnapShot"]
      };

      imageObject["imageBase64"] = imageObject["imageBase64"].replace("data:image/jpeg;base64,", "");
      imageObject["imageBase64"] = imageObject["imageBase64"].replace("data:image/png;base64,", "");

      dataToSend.push(imageObject);
    }

    try {
      uploadStepImageToServer(dataToSend, dataToSend["OpkeyTelemetryUrl"]);
    } catch (e) {

    }
  }
}


function markThisSessionDataAsBenchMarked(_sessionId) {

  if (benchMarkSubActivityJourney == false) {
    return;
  }

  $.ajax({
    url: getRootTraceAiUrl() + '/BenchMarkActivityTrackerController/setBenchMarkAllSubActivityOfThisSession',
    type: 'POST',
    data: { "sessionId": _sessionId },
    success: function (response) {

    },
    error: function (xhr, status, error) {

    }
  });
}

function getTimeInMillisByDays(_days) {
  const currentTimeMillis = Date.now();

  if (_days == 0) {
    return currentTimeMillis;
  }

  const millisPerDay = 1000 * 60 * 60 * 24;
  const daysAgoTimeInMillis = currentTimeMillis - (_days * millisPerDay);

  return daysAgoTimeInMillis;

}

function getTimeInMillisByMinutes(_minutes) {
  const currentTimeMillis = Date.now();

  if (_minutes == 0) {
    return currentTimeMillis;
  }

  const millisPerMinutes = 1000 * 60;
  const daysAgoTimeInMillis = currentTimeMillis - (_minutes * millisPerMinutes);

  return daysAgoTimeInMillis;

}

function getHostnameWithProtocol(url) {
  const parsedUrl = new URL(url);
  return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
}

function getHostname(url) {
  const parsedUrl = new URL(url);
  return parsedUrl.hostname;
}

async function sendIncidentDataToServer() {
  debugger
  var incidentDataToSend = new Object();
  var tabUrl = await sendMessageToBackgroundScriptWithPromise("chrome.tabs.getActiveTabUrl", null);
  var analyticSessionId = getAnalyticSessionIdByUrl(localStorage.getItem("URL_TO_TRACK_FOR_JOURNEY"));

  let erpUserName = getCurrentUserId(tabUrl);
  let erpAppType = "ORACLEFUSION";

  incidentDataToSend["journeyUrl"] = encodeURIComponent(getRootUrl() + "/journey/" + analyticSessionId + "?userName=" + erpUserName + "&appType=" + erpAppType);

  incidentDataToSend["journeyData"] = btoa(JSON.stringify({
    "sessionId": analyticSessionId,
    "journeySplitFromTimeInMillis": getTimeInMillisByMinutes(30), // this has lower value
    "journeySplitToTimeInMillis": getTimeInMillisByMinutes(0) // this has higher value
  }));

  incidentDataToSend["essFilterData"] = btoa(JSON.stringify({
    "envHost": getHostnameWithProtocol(tabUrl),
    "envName": getHostname(tabUrl).toUpperCase(),
    "fromTimeInMillis": "" + getTimeInMillisByDays(30),
    "logToSearch": null,
    "logTypeFilter": ["Error"],
    "toTimeInMillis": "" + getTimeInMillisByDays(0),
    "userNameList": [getCurrentUserId(tabUrl)],
  }));




  // var ajax_data={

  // 'key': "obiq_journey_incident",
  // 'data': JSON.stringify(incidentDataToSend)

  // }

  var formData = new FormData();
  formData.append("key", "obiq_journey_incident");
  formData.append("data", JSON.stringify(incidentDataToSend));


  $.ajax({
    url: getRootUrl() + '/base/SaveTempData',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      localStorage.setItem("Redis_Sessionid", response);
    },
    error: function (xhr, status, error) {

    }
  });
}


async function handle_Async_function(request, sendResponse) {
  if (request.action != null) {
    switch (request.action) {
      case "oft_getErrorSolutionFromObserveIq":
        var response = await oft_getErrorSolutionFromObserveIq(request.data);
        sendResponse(response);
        break;
      case "callExternalSideRestApi":
        var response = await callExternalSideRestApi(request.data);
        sendResponse(response);
        break;
      case "getCurrentDomain":
        var data = { "url": getRootUrl(), "redis_sessionId": localStorage.getItem("Redis_Sessionid") };
        sendResponse(data);
        break;

      case "checkUrlExists":
        const resp = await fetch(request.data.url, { method: "HEAD" });

        if (!resp.ok) {
          sendResponse(false);
        }
        else {
          sendResponse(true);
        }
        break;

      case "getCurrentMainDomain":
        sendResponse(localStorage.getItem("OPKEY_DOMAIN_NAME"));
        break;
    }
  }
}

async function oft_getErrorSolutionFromObserveIq(_data) {
  return new Promise(function (resolve, reject) {

    var errorMessage = _data["appEventLog"];
    var dataToSend = new Object();
    dataToSend["errorText"] = "I have encountered this error in Oracle Fusion ERP " + errorMessage;

    // dataToSend["errorText"] = "You cannot update the distributions because the invoice has been selected for validation";

    $.ajax({
      url: getRootTraceAiUrl() + '/ErpErrorSolutionController/getSolutionOfFunctionalErrorFromWilfred',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(dataToSend),
      success: function (response) {
        resolve(response);
      },
      error: function (xhr, status, error) {

      }
    });
  });
}


async function callExternalSideRestApi(_ajaxData) {
  return new Promise(function (resolve, reject) {
    _ajaxData["url"] = _ajaxData["url"];


      let debugRootUrl = localStorage.getItem("OPKEY_DOMAIN_NAME_DEBUG");
    if (debugRootUrl && debugRootUrl!=="" && _ajaxData["url"] && _ajaxData["url"].indexOf("OpkeyObiqServerApi/OpkeyTraceIAAnalyticsApi") > -1) {
      _ajaxData["url"] = debugRootUrl + _ajaxData["url"];
    }
    else {
      _ajaxData["url"] = getRootUrl() + _ajaxData["url"];
    }

    _ajaxData["success"] = function (response) {
      resolve(response);
    }

    _ajaxData["error"] = function (xhr, status, error) {
      var errorObject = new Object();
      errorObject["type"] = "error";
      errorObject["status"] = status;
      errorObject["errorData"] = xhr.responseText;
      resolve(errorObject);
    }

    $.ajax(_ajaxData);
  });
}


async function LoginWithAgentAuthCode(_data) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: getRootUrl() + 'Account/LoginWithAgentAuthCode?authCode=',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(dataToSend),
      success: function (response) {
        resolve(response);
      },
      error: function (xhr, status, error) {

      }
    });
  });
}

var alreadySentProcessId = [];
async function sendOracleFusionProcessId(_processIdData) {

  var processId = _processIdData["processID"];
  if (processId == null) {
    return;
  }

  if (alreadySentProcessId.indexOf(processId) > -1) {
    return;
  }

  alreadySentProcessId.push(processId);

  var tabUrl = await sendMessageToBackgroundScriptWithPromise("chrome.tabs.getActiveTabUrl", null);

  var userId = getCurrentUserId(tabUrl);


  var formData = new FormData();
  formData.append('processID', processId);
  formData.append('userID', userId);

  $.ajax({
    url: getRootUrl() + '/ESS/AddESSProcessToQueue',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {

    },
    error: function (xhr, status, error) {

    }
  });
}


function sendEnvInformation(_returnDto) {
  if (_returnDto == null || _returnDto == "") {
    return;
  }
  return false;
  var applicatioName = _returnDto["appType"];

  applicatioName = getActualApplicatioName(applicatioName);

  var envName = _returnDto["envName"];

  var envUrl = _returnDto["envHost"];

  var dataToSend = {
    "Application": applicatioName,
    "Identifier": envName,
    "Name": envName,
    "Credentials": {
      "URL": envUrl
    }
  };

  $.ajax({
    url: getRootUrl() + '/api/Environment/CreateNewEnvironmentIfNotExist',
    type: 'POST',
    data: { "strCredentialDTO": JSON.stringify(dataToSend) },
    success: function (response) {

    },
    error: function (xhr, status, error) {

    }
  });
}

function getActualApplicatioName(_appType) {
  if (_appType == "ORACLEFUSION") {
    return "OracleFusion";
  }

  if (_appType == "SALESFORCE") {
    return "Salesforce";
  }

  if (_appType == "WORKDAY") {
    return "Workday";
  }
  return "GenericApp";
}



function getCurrentAgentId() {
  var currentAgentId = localStorage.getItem("TraceIACurrentAgentId");
  return currentAgentId;
}



function getCurrentAgentPriviliges() {

  var agentId = getCurrentAgentId();

  if (agentId != null) {
    $.ajax({
      url: getRootUrl() + '/api/Agent/GetAgentPrivileges?agentID=' + agentId,
      type: 'GET',
      success: function (response) {

      },
      error: function (xhr, status, error) {

      }
    });
  }

}

function getAllAgentPrivilegesRoles() {
  var agentPrivilegesRoles = [];
  var agent_roles = localStorage.getItem("Agent_Roles");
  if (agent_roles != null) {
    var agentRolesObject = JSON.parse(agent_roles);

    for (var ari1 = 0; ari1 < agentRolesObject.length; ari1++) {
      var _obj1 = agentRolesObject[ari1];
      var _objRolesPrivilegesArray = _obj1["role_privileges"];

      for (var rp1 = 0; rp1 < _objRolesPrivilegesArray.length; rp1++) {
        agentPrivilegesRoles.push(_objRolesPrivilegesArray[rp1]["privilege_id"]);
      }
    }
  }

  return agentPrivilegesRoles;
}



function getAllAgentWhiteListedUrls() {
  var agent_whitelistedoutput = [];
  var agent_whitelisted = localStorage.getItem("Agent_WhiteListedUrls");
  if (agent_whitelisted != null) {
    try {
      agent_whitelistedoutput = JSON.parse(agent_whitelisted);
    } catch (e) { }
  }
  return agent_whitelistedoutput;
}

function getCurrentAgentMetaInformation() {

  var agentId = getCurrentAgentId();

  if (agentId != null) {
    $.ajax({
      url: getRootUrl() + '/api/Agent/GetAgentByAuthCode?authCode=' + agentId,
      type: 'GET',
      success: function (response) {

        if (response != null) {
          if (response["agent_roles"] != null) {
            localStorage.setItem("Agent_Roles", JSON.stringify(response["agent_roles"]));
          }

          if (response["whitelisted_urls"] != null) {
            localStorage.setItem("Agent_WhiteListedUrls", JSON.stringify(response["whitelisted_urls"]));
          }

          var userAgentInfo = new Object();

          userAgentInfo["role"] = "";
          userAgentInfo["userFullName"] = "";
          userAgentInfo["emailId"] = "";
          userAgentInfo["_id"] = "";

          if (response["RoleName"] != null) {
            userAgentInfo["role"] = response["RoleName"];
          }

          if (response["agent_name"] != null) {
            userAgentInfo["agentName"] = response["agent_name"];
          }

          if (response["UserDTO"] != null) {
            if (response["UserDTO"]["EmailID"] != null) {
              userAgentInfo["emailId"] = response["UserDTO"]["EmailID"];
            }

            if (response["UserDTO"]["ERP_UserName"] != null) {
              userAgentInfo["ERP_UserName"] = response["UserDTO"]["ERP_UserName"];
            }

            if (response["UserDTO"]["_id"] != null) {
              userAgentInfo["_id"] = response["UserDTO"]["_id"];
            }
          }

          localStorage.setItem("Agent_All_Info", JSON.stringify(userAgentInfo));
        }

        //   var allAgentPrivileges = getAllAgentPrivilegesRoles();
        //  console.log(allAgentPrivileges);

        //  var whiteListedUrls = getAllAgentWhiteListedUrls();
        //   console.log(whiteListedUrls);
      },
      error: function (xhr, status, error) {

      }
    });
  }

}

function listenOnAgentPrivilegesWebSocket() {

  var agentId = getCurrentAgentId();

  if (agentId != null) {
    var socketUrl = getRootUrl();
    socketUrl = socketUrl.replace("https://", "");
    var wsUrl = "wss://" + socketUrl + "/api/ws?type=Agents&agent_id=" + agentId;

    // Create a new WebSocket connection
    const ws = new WebSocket(wsUrl);

    // Connection opened
    ws.addEventListener('open', function (event) {
      console.log('Connected to the WebSocket server');
    });

    // Listen for messages
    ws.addEventListener('message', function (event) {
      console.log('Message from server:', event.data);
    });

    // Listen for possible errors
    ws.addEventListener('error', function (event) {
      console.error('WebSocket error observed:', event);
    });

    // Listen for when the connection is closed
    ws.addEventListener('close', function (event) {
      console.log('WebSocket connection closed:', event);
    });
  }
}

listenOnAgentPrivilegesWebSocket();

function sendAgentIsOnline() {

  var agentId = getCurrentAgentId();

  if (agentId != null) {
    $.ajax({
      url: getRootUrl() + '/api/Agent/Ping?authCode=' + agentId,
      type: 'GET',
      success: function (response) {
        //  console.log(response);
      },
      error: function (xhr, status, error) {

      }
    });
  }
}


function agentOnlineThread() {
  window.setTimeout(function () {
    sendAgentIsOnline();
    agentOnlineThread();
  }, 30000);
}

function currentAgentPrivilegeThread() {
  window.setTimeout(function () {
    getCurrentAgentMetaInformation();
    currentAgentPrivilegeThread();
  }, 2000);
}

async function sendMessageToBackgroundScriptWithPromise(_command, _data) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      "action": _command, "data": _data
    }, function (response) {
      resolve(response);
    });
  });
}


async function detectCountry() {
  try {
    const response = await fetch("https://ipwho.is/");
    const data = await response.json();

    // Set the global variable
    userCountry = data.country;

    console.log("Country detected:", userCountry);
  } catch (error) {
    console.error("Error detecting country:", error);
  }
}

detectCountry();


agentOnlineThread();
currentAgentPrivilegeThread();
