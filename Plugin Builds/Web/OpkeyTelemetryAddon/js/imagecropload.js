
var image_name_counter = 0;
var keywords_option = ["Click", "ClickLink", "MouseHover", "TypeTextOnEditBox", "TypeTextAndEnterEditBox", "TypeTextInTextArea", "TypeTextAndEnterTextArea", "ClickButtonInTableCell", "ClickLinkInTableCell", "ClickTableCell", "SelectDropDownItem", "SelectCheckBox", "DeSelectCheckBox", "SelectRadioButton", "SelectWindow", "SelectFrame", "WaitForObject", "Wait", "Image_Click", "Image_DoubleClick", "Image_RightClick", "Image_TypeTextOnEditBox", "Image_VerifyObjectExists"];
var temp_dkrm = null;
var _newImage_base64 = "";
var is_init = false;

var IS_SIZE_LARGER_THAN_64KB = false;

function loadCroppedImageInCanvas() {
  var image_crop_image = localStorage.getItem("IMAGE_CROP_IMAGE");
  if (image_crop_image != null) {

    image_crop_image = DOMPurify.sanitize(image_crop_image);
    var _rawimage = new Image();
    _rawimage.src = image_crop_image;
    _rawimage.id = "target";
    var image_holder = document.getElementById("imageholder");
    image_holder.appendChild(_rawimage);
    if (is_init == false) {
      var dkrm = new Darkroom('#target', {
        backgroundColor: '#000',
        plugins: {
          save: false,
          crop: {
            quickCropKey: 67, // key "c"
          }
        },
        initialize: function () {
          var cropPlugin = this.plugins['crop'];
          cropPlugin.requireFocus();
          this.addEventListener('core:transformation', function (e) {
            var newImage = dkrm.canvas.toDataURL();
            if (newImage.length > 62000) {

              ShowToastMessage("error", "Image size is more than allowed limit (64 Kb). Please recapture smaller image.");
              window.setTimeout(function () {
                //         window.location = "/ImageCrop.html?" + image_name_counter;
              }, 2000);

              return;
            }
            $("#objectImage").attr("src", newImage);
            $("#objectImageLogicalName").val("Image_" + image_name_counter);
            image_name_counter++;
            $("#addImageDialog").show();
            $("#addImageDialog").dialog("open");
            $("#stepsholder").change();
          });
        }
      });
      is_init = true;
    }
  }
}

$('#addImageDialog').dialog({
  width: 350,
  // height:400,
  title: "Add Image in Recorder Grid",
  autoOpen: false,
  modal: true,
  draggable: false,
  show: "slide",
  closeText: "",
  hide: "scale",
  buttons: [
    {
      text: "OK",
      click: function () {
        addImageStep();
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
    if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
      var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
      $.ui.dialog.prototype._allowInteraction = function (e) {
        if ($(e.target).closest('.select2-dropdown').length) return true;
        return ui_dialog_interaction.apply(this, arguments);
      };
    }
  },
  close: function (e) {
    // window.location = "/ImageCrop.html?" + image_name_counter;
    $("#imageholder > div > div.darkroom-toolbar > div:nth-child(1) > button:nth-child(1)").click();
  },
  _allowInteraction: function (event) {
    return !!$(event.target).is(".select2-input") || this._super(event);
  }
});

$(function () {
  $("button, svg, use").mouseup(function (e) {
    var _node = e.target;
    // //debugger;
    if (_node.nodeName != "use") {
      _node = _node.getElementsByTagName("use")[0];
    }
    if (_node != null) {
      if (_node.nodeName == "use") {
        var _xlink_href = _node.getAttribute("xlink:href");
        // //debugger;
        if (_xlink_href == "#done") {

        }
        else if (_xlink_href == "#close") {
          //  window.location = "/ImageCrop.html?" + image_name_counter;
        }
      }
    }
  });
});


$("#stepsholder").change(function (e) {
  var _keyword = $('#stepsholder option:selected').val();
  if (_keyword == "Image_TypeTextOnEditBox" || _keyword == "TypeTextOnEditBox" || _keyword == "TypeTextAndEnterEditBox"
    || _keyword == "TypeTextInTextArea" || _keyword == "TypeTextAndEnterTextArea") {
    $("#dataargs_group").show();
  }
  else {
    $("#dataholder").val("");
    $("#dataargs_group").hide();
  }
});

$(document).mousemove(function (e) {
  var _bnodes = document.getElementsByTagName("BUTTON");
  for (var bn = 0; bn < _bnodes.length; bn++) {
    var _bnode = _bnodes[bn];
    var _usenode = _bnode.getElementsByTagName("use")[0];
    if (_usenode != null) {
      var _xlinkhref = _usenode.getAttribute("xlink:href");
      if (_xlinkhref != null) {
        if (_xlinkhref == "#undo") {
          if (_bnode.getAttribute("title") == null) {
            $(_bnode).attr("title", "Undo");
          }
        }

        if (_xlinkhref == "#redo") {
          if (_bnode.getAttribute("title") == null) {
            $(_bnode).attr("title", "Redo");
          }
        }

        if (_xlinkhref == "#rotate-left") {
          if (_bnode.getAttribute("title") == null) {
            $(_bnode).attr("title", "Rotate Image Left");
          }
        }

        if (_xlinkhref == "#rotate-right") {
          if (_bnode.getAttribute("title") == null) {
            $(_bnode).attr("title", "Rotate Image Right");
          }
        }

        if (_xlinkhref == "#crop") {
          if ($(_bnode).hasClass("darkroom-button-active")) {
            $(_bnode).attr("title", "Stop Croping Image");
          }
          else {
            $(_bnode).attr("title", "Start Croping Image");
          }
        }

        if (_xlinkhref == "#done") {
          if (_bnode.getAttribute("title") == null) {
            $(_bnode).attr("title", "Add Image To OpKey");
          }
        }

        if (_xlinkhref == "#close") {
          if (_bnode.getAttribute("title") == null) {
            $(_bnode).attr("title", "Abort");
          }
        }
      }
    }
  }
});

function ShowToastMessage(messagetype, message) {

  var toast_object = new Object();
  toast_object.text = message;
  toast_object.duration = 5000;
  toast_object.newWindow = true;
  toast_object.close = true;
  toast_object.gravity = "bottom";
  toast_object.positionLeft = false;
  toast_object.backgroundColor = "green";
  if (messagetype == "error") {
    toast_object.backgroundColor = "red";
  } else if (messagetype == "warning") {
    toast_object.backgroundColor = "orange";
  } else if (messagetype == "greeting") {
    toast_object.backgroundColor = "yellow";
  }
  Toastify(toast_object).showToast();
}

function addImageStep() {
  var _keyword = $('#stepsholder option:selected').val();
  var _image = $("#objectImage").attr("src");
  var _data = $("#dataholder").val();
  var main_object = new Object();
  main_object["action"] = _keyword;
  main_object["popupName"] = "";
  var or_object = new Object();
  or_object["logicalname"] = $("#objectImageLogicalName").val();
  or_object["Tolerance"] = 0.7;
  var relativeLeft = sessionStorage.getItem("opkey_relativeleft");
  var relativeTop = sessionStorage.getItem("opkey_relativetop");
  sessionStorage.setItem("opkey_relativeleft", "");
  sessionStorage.setItem("opkey_relativetop", "");
  if (relativeLeft != null) {
    if (relativeLeft != "") {
      or_object["RelativeLeft"] = relativeLeft;
    }
  }

  if (relativeTop != null) {
    if (relativeTop != "") {
      or_object["RelativeTop"] = relativeTop;
    }
  }
  or_object["Image"] = _image;
  or_object["IsSikuliKeyword"] = true;

  var pr_object = new Object();
  pr_object["tag"] = "HTML";
  pr_object["url"] = "https://<yourwebsite>.com";
  pr_object["title"] = "";

  or_object["parent"] = pr_object;

  var _argarray = new Array();
  _argarray.push(or_object);

  var _dataargs = new Object();
  _dataargs["type"] = "string";
  _dataargs["data"] = _data;
  _argarray.push(_dataargs);
  main_object["arguments"] = _argarray;
  chrome.runtime.sendMessage({ recordeddata: "[" + JSON.stringify(main_object) + "]" }, function (response) {
    if (chrome.runtime.lastError) { }
  });
  $("#objectImage").attr("src", "");
  // window.location = "/ImageCrop.html?" + image_name_counter;
};

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

$(function () {
  $("#stepsholder").html('');

  for (var i = 0; i < keywords_option.length; i++) {

    appendSanitizedOption("stepsholder",keywords_option[i],keywords_option[i]);
  }

  var _currentlocation = window.location.toString();
  _currentlocation = _currentlocation.split("?");
  if (_currentlocation[1] != null) {
    try {
      var _current_increment_counter = parseInt(_currentlocation[1]);
      image_name_counter = _current_increment_counter;
    } catch (e) {
      image_name_counter = 0;
    }
  }

  window.setInterval(function () {
    var switchFlag = sessionStorage.getItem("canDoRelativeCrop");
    if (switchFlag == null) {
      $("#opkey_fetchRelativeCoordinate").removeClass("RelativeCoordinateButtonClicked");
      $("#opkey_fetchRelativeCoordinate").prop("disabled", true);
    }
    if (switchFlag == "false") {
      $("#opkey_fetchRelativeCoordinate").removeClass("RelativeCoordinateButtonClicked");
      $("#opkey_fetchRelativeCoordinate").prop("disabled", true);
    }
    if (switchFlag == "true") {
      $("#opkey_fetchRelativeCoordinate").prop("disabled", false);
    }
  }, 500);
});


// function loadImageSelector() {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

//     var currentTab = tabs[0];

//     var mainRecorderWindowStrId = localStorage.getItem("MAIN_RECORDER_WIN_ID");

//     let mainRecorderWindowId = parseInt(mainRecorderWindowStrId);
//     const desktopCaptureRequestId = chrome.desktopCapture.chooseDesktopMedia(['window', 'screen', 'tab'], currentTab, function (stream_id) {
//       if (stream_id) {
//         navigator.mediaDevices.getUserMedia({
//           video: {
//             mandatory: {
//               chromeMediaSource: 'desktop',
//               chromeMediaSourceId: stream_id,
//             }
//           }
//         }).then(stream => {
//           chrome.windows.getCurrent({}, function (window) {
//             chrome.windows.update(window.id, {
//               state: "minimized"
//             }, function (callback) { });
//           });

//           chrome.windows.update(mainRecorderWindowId, {
//             state: "minimized"
//           }, function (callback) { });

//           setTimeout(() => {
//             chrome.desktopCapture.cancelChooseDesktopMedia(desktopCaptureRequestId);
//             const video = document.createElement('video');

//             video.addEventListener('loadedmetadata', function () {
//               const canvas = document.createElement('canvas');
//               canvas.width = this.videoWidth;
//               canvas.height = this.videoHeight;
//               const ctx = canvas.getContext("2d");
//               ctx.drawImage(this, 0, 0);
//               const image = canvas.toDataURL();
//               localStorage.setItem("IMAGE_CROP_IMAGE", image);
//               video.pause();
//               loadCroppedImageInCanvas();
//               stream.getTracks()[0].stop();
//               chrome.windows.getCurrent({}, function (window) {
//                 chrome.windows.update(window.id, { focused: true });
//               });


//               chrome.windows.update(mainRecorderWindowId, { focused: true });

//               chrome.windows.onRemoved.addListener(async function (windowId) {
//                 const imageWinId = localStorage.setItem("IMAGE_CROPPING_WIN");
//                 if (imageWinId == windowId && stream) {
//                   stream.getTracks()[0].stop();
//                 }
//               });
//             }, false);

//             video.srcObject = stream;
//             video.play();
//           }, 600);
//         }).catch(err => {
//           console.error('Could not get stream: ', err);
//         });
//       }
//     });
//   });
// }

//manish fix for closing opkey smart image snipper when click on cancle.(previous code commented above.)
function loadImageSelector() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

    var currentTab = tabs[0];

    var mainRecorderWindowStrId = localStorage.getItem("MAIN_RECORDER_WIN_ID");

    let mainRecorderWindowId = parseInt(mainRecorderWindowStrId);

    // Get the ID of the current window (Opkey Smart Image Snipper)
    chrome.windows.getCurrent({}, function (opkeyWindow) {
      const desktopCaptureRequestId = chrome.desktopCapture.chooseDesktopMedia(['window', 'screen', 'tab'], currentTab, function (stream_id) {
        if (!stream_id) {
          // User clicked "Cancel" on the screen share dialog, so close the Opkey window
          chrome.windows.remove(opkeyWindow.id);
          return; // Exit function
        }

        navigator.mediaDevices.getUserMedia({
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: stream_id,
            }
          }
        }).then(stream => {
          chrome.windows.getCurrent({}, function (window) {
            chrome.windows.update(window.id, {
              state: "minimized"
            }, function (callback) { });
          });

          chrome.windows.update(mainRecorderWindowId, {
            state: "minimized"
          }, function (callback) { });

          setTimeout(() => {
            chrome.desktopCapture.cancelChooseDesktopMedia(desktopCaptureRequestId);
            const video = document.createElement('video');

            video.addEventListener('loadedmetadata', function () {
              const canvas = document.createElement('canvas');
              canvas.width = this.videoWidth;
              canvas.height = this.videoHeight;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(this, 0, 0);
              const image = canvas.toDataURL();
              localStorage.setItem("IMAGE_CROP_IMAGE", image);
              video.pause();
              loadCroppedImageInCanvas();
              stream.getTracks()[0].stop();
              chrome.windows.getCurrent({}, function (window) {
                chrome.windows.update(window.id, { focused: true });
              });
              chrome.windows.update(mainRecorderWindowId, { focused: true });

              chrome.windows.onRemoved.addListener(async function (windowId) {
                const imageWinId = localStorage.setItem("IMAGE_CROPPING_WIN");
                if (imageWinId == windowId && stream) {
                  stream.getTracks()[0].stop();
                }
              });
            }, false);

            video.srcObject = stream;
            video.play();
          }, 600);
        }).catch(err => {
          console.error('Could not get stream: ', err);
        });
      }
      );
    });
  });
}

loadImageSelector();