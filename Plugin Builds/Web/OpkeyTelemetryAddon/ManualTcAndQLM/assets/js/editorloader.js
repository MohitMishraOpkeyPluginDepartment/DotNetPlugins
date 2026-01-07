var cropbuttonToggled = false;
var startx = 0;
var starty = 0;
var maxx = 0;
var maxy = 0;
var width = 0;
var height = 0;

var temp_startx = 0;
var temp_starty = 0;
var snapshotName;
var lastbase64Image = null;
var markerArea=null;
var maState=null;
var oldIamgeBase64=null;
var initiatedXhrRequest=null;
var imageCopyToggled=false;
$(function () {
  chrome.runtime.sendMessage(
    {
      GetWindowBase64Image: "GetWindowBase64Image",
    },
    function (response) {
      if (response != null) {
        oldIamgeBase64=response;
        $("#mainimageholder").attr("src", response);
      }
    }
  );

  snapshotName = getSnapshotName();
  initMarker();
});

var threadId=-1;
function initMarker(){
  window.clearInterval(threadId);
  window.setTimeout(function () {
    showMarkerArea("mainimageholder");
    window.setTimeout(function () {
      threadId = window.setInterval(function () {
        addCropButton();
        addDownloadButton();
      addImageCoppyButton();
        addRenameField();
      }, 300);
      changeButtonForQLM();
      addToolTips();

      $(
        "body > div.__markerjs2_.__markerjs2__0_ > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(1) > div:nth-child(3)"
      ).click(function () {
        if (lastbase64Image != null) {
          location.reload();
          lastbase64Image = null;
        }
      });
    }, 200);
  }, 200);
}

function initMarker_copy(){
  window.clearInterval(threadId);
    showMarkerArea("mainimageholder");
      threadId = window.setInterval(function () {
        addCropButton();
        addDownloadButton();
      addImageCoppyButton();
        addRenameField();
      }, 50);
      changeButtonForQLM();
      addToolTips();

      $(
        "body > div.__markerjs2_.__markerjs2__0_ > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(1) > div:nth-child(3)"
      ).click(function () {
        if(maState!=null){
          if(maState.markers.length>0){
            maState.markers.pop();
          }
          markerArea.restoreState(maState);
        }
      });
}

function addToolTips() {
  $(
    "body > div.__markerjs2_.__markerjs2__0_ > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(2) > div:nth-child(1)"
  ).attr("title", "Rectangle");

  $(
    "body > div.__markerjs2_.__markerjs2__0_ > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(2) > div:nth-child(2)"
  ).attr("title", "Pencil");

  $(
    "body > div.__markerjs2_.__markerjs2__0_ > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(2) > div:nth-child(3)"
  ).attr("title", "Arrow");

  $(
    "body > div.__markerjs2_.__markerjs2__0_ > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(2) > div:nth-child(4)"
  ).attr("title", "Text");

  $(
    "body > div.__markerjs2_.__markerjs2__0_ > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(2) > div:nth-child(5)"
  ).attr("title", "Ellipse");

  $(
    "body > div.__markerjs2_.__markerjs2__0_ > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(2) > div:nth-child(6)"
  ).attr("title", "Highlight Marker");

  $(
    "body > div.__markerjs2_.__markerjs2__0_ > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(2) > div:nth-child(7)"
  ).attr("title", "MessageBox");

  var apputilitytype = localStorage.getItem("AppUtilityType");
  if (apputilitytype != null) {
    if (
      apputilitytype != "qlm_snapshot_IssueType" &&
      apputilitytype != "qlm_video_IssueType"
    ) {
      $(
        "body > div.__markerjs2_.__markerjs2__0_ > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(4) > div:nth-child(1)"
      ).attr("title", "Save");

      $(
        "body > div.__markerjs2_.__markerjs2__0_ > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(4) > div:nth-child(2)"
      ).attr("title", "Discard");
    }
  }

  $(
    "body > div.__markerjs2_.__markerjs2__0_ > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(1) > div.__markerjs2__0_toolbar_button.__markerjs2__0_toolbar_active_button"
  ).attr("title", "Pointer");

  $(
    "body > div.__markerjs2_.__markerjs2__0_ > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(1) > div:nth-child(2)"
  ).attr("title", "Delete");

  $(
    "body > div.__markerjs2_.__markerjs2__0_ > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(1) > div:nth-child(3)"
  ).attr("title", "Undo");
}

function changeButtonForQLM() {
  var apputilitytype = localStorage.getItem("AppUtilityType");
  if (apputilitytype != null) {
    if (
      apputilitytype == "qlm_snapshot_IssueType" ||
      apputilitytype == "qlm_video_IssueType"
    ) {
      var firstButton = $(
        "body > div.__markerjs2_.__markerjs2__0_ > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(4) > div:nth-child(1) > svg"
      );
      var secondbutton = $(
        "body > div.__markerjs2_.__markerjs2__0_ > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(4) > div:nth-child(2) > svg"
      );

      if (firstButton != null) {
        firstButton.parent().attr("data-action", "createTicket");
        firstButton.parent().attr("title", "Create Ticket");
        firstButton.parent().html("<i class='oci oci-flag'>");
        var pathelement = $(firstButton).children("path")[0];
        pathelement.setAttributeNS(null, "d", "");
      }

      if (secondbutton != null) {
        secondbutton.parent().attr("data-action", "createUserStory");
        secondbutton.parent().attr("title", "Create User Story");
        secondbutton.parent().html("<i class='oci oci-assignment_add'></i>");
        var pathelement = $(secondbutton).children("path")[0];
        pathelement.setAttributeNS(null, "d", "");
      }
    }
  }
}

function addCropButton() {
  var toolbarHolder = $(
    "body > div > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(2)"
  );
  if (toolbarHolder) {
    if (document.getElementById("dropfeaturebutton") != null) {
      return;
    }
    var _divElement = document.createElement("div");
    _divElement.classList.add("__markerjs2__0_toolbar_button");
    _divElement.classList.add("__markerjs2__0_toolbar_button_colors");
    _divElement.id = "dropfeaturebutton";
    _divElement.setAttribute("data-type-name", "CropFeature");
    _divElement.setAttribute("title", "Crop");

    var _svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    _svgElement.setAttributeNS(null, "viewBox", "0 0 24 24");
    _divElement.appendChild(_svgElement);

    var _pElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    _pElement.setAttributeNS(
      null,
      "d",
      "M5,17 C5,18.1 5.9,19 7,19 L17,19 L17,23 L19,23 L19,19 L23,19 L23,17 L7,17 L7,1 L5,1 L5,5 L1,5 L1,7 L5,7 L5,17 Z M19,15 L19,7 C19,5.9 18.1,5 17,5 L9,5 L9,7 L17,7 L17,15 L19,15 Z"
    );
    _svgElement.appendChild(_pElement);
    toolbarHolder.append(_divElement);

    addCropFeatureFunctionality();

    $(_divElement).click(function (e) {
      var svgElement = document.querySelector(
        "body > div > div > div:nth-child(2) > div > div:nth-child(2) > svg"
      );

      if (
        _divElement.classList.contains("__markerjs2__0_toolbar_button_colors")
      ) {
        _divElement.classList.remove("__markerjs2__0_toolbar_button_colors");
        _divElement.classList.add("__markerjs2__0_toolbar_active_button");
        cropbuttonToggled = true;
        svgElement.style.cursor = "crosshair";
      } else {
        _divElement.classList.add("__markerjs2__0_toolbar_button_colors");
        _divElement.classList.remove("__markerjs2__0_toolbar_active_button");
        cropbuttonToggled = false;
        svgElement.style.cursor = "auto";
      }
      var arrowEle = document.querySelector(
        "body > div > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(1) > div:nth-child(1)"
      );
      arrowEle.click();
    });
  }
}

function addRenameField() {
  var toolbarHolder = $(
    "body > div > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(2)"
  );
  if (toolbarHolder) {
    if (document.getElementById("renametextfieldid") != null) {
      return;
    }
    var _divElement = document.createElement("div");
    _divElement.classList.add("__markerjs2__0_toolbar_button");
    _divElement.classList.add("__markerjs2__0_toolbar_button_colors");
    _divElement.id = "renametextfieldid";
    _divElement.setAttribute("data-type-name", "RenameSnapshot");
    //_divElement.innerHTML = '<i class="oci oci-edit-3 text_edit_icon "></i>';
    toolbarHolder.append(_divElement);

    var renameSnap = document.createElement("input");
    renameSnap.id = "snapshotrenamefield";
    renameSnap.type = "text";
    renameSnap.value = snapshotName;
    _divElement.append(renameSnap);

    $(renameSnap).keyup(function () {
        snapshotName = $("#snapshotrenamefield").val();
    });

    $(renameSnap).focusout(function () {
      debugger
      if ($("#snapshotrenamefield").val() == null || $("#snapshotrenamefield").val() == "") {
        snapshotName = getSnapshotName();
        renameSnap.value = snapshotName;
      } else {
        snapshotName = $("#snapshotrenamefield").val();
      }
    });
  }
}

function addDownloadButton() {
  var toolbarHolder = $(
    "body > div > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(2)"
  );
  if (toolbarHolder) {
    if (document.getElementById("downloadButtonId") != null) {
      return;
    }
    var _divElement = document.createElement("div");
    _divElement.classList.add("__markerjs2__0_toolbar_button");
    _divElement.classList.add("__markerjs2__0_toolbar_button_colors");
    _divElement.id = "downloadButtonId";
    _divElement.setAttribute("data-type-name", "Download");
    _divElement.setAttribute("title", "Download Snapshot");

    _divElement.innerHTML = '<i class="oci oci-download"></i>';
    /*
        var _svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        _svgElement.setAttributeNS(null, "viewBox", "0 0 24 24");
        _divElement.appendChild(_svgElement);

        var _pElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        _pElement.setAttributeNS(null, "d", "M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29");
        _svgElement.appendChild(_pElement);
        */
    toolbarHolder.append(_divElement);

    $(_divElement).click(function (e) {
      var data = document.querySelector(
        "body > div.__markerjs2_.__markerjs2__0_ > div > div:nth-child(2)"
      );
      // console.log(data);

      ShowToastMessage("warning", "Preparing to download image.");
      html2canvas(data).then((canvas) => {
        // Few necessary setting options
        var imgWidth = 208;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;

        var rendredImage = canvas.toDataURL("image/png");
        if (rendredImage != null) {
          if (cropbuttonToggled == true) {
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            var partialImage = document.getElementById("mainimageholder");
            canvas.width = partialImage.width;
            canvas.height = partialImage.height;

            let ratio = window.devicePixelRatio;

            context.drawImage(
              partialImage,
              temp_startx + 3,
              temp_starty + 3,
              width - 5,
              height - 5,
              0,
              0,
              width - 5,
              height - 5
            );
            rendredImage = canvas.toDataURL();
          }

          toggleImageRendering();
          window.setTimeout(function () {
            var renderedImage = getRenderedImageBase64();
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = renderedImage;
            a.download = getRenamedName() + ".png";
            a.target = "_blank";
            a.click();
            ShowToastMessage("", "Image Downloaded!");
            $("body > div.__markerjs2_.__markerjs2__0_").remove();
            initMarker_copy();
            $("#mainimageholder").attr("src", oldIamgeBase64);
            window.setTimeout(function(){
              markerArea.restoreState(maState);
            },50);
          
          }, 500);
        }
      });
    });
  }
}

function addImageCoppyButton() {
  var toolbarHolder = $(
    "body > div > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(2)"
  );
  if (toolbarHolder) {
    if (document.getElementById("imageCopyButtonId") != null) {
      return;
    }
    var _divElement = document.createElement("div");
    _divElement.classList.add("__markerjs2__0_toolbar_button");
    _divElement.classList.add("__markerjs2__0_toolbar_button_colors");
    _divElement.id = "imageCopyButtonId";
    _divElement.setAttribute("data-type-name", "CopyImageToClipboard");
    _divElement.setAttribute("title", "Copy Image To Clipboard");

    _divElement.innerHTML = '<i class="oci oci-content_copy"></i>';
    toolbarHolder.append(_divElement);

    $(_divElement).click(function (e) {
      imageCopyToggled=true;
      toggleImageRendering();
    });

    $(document).unbind().bind('copy', function() {
      imageCopyToggled=true;
      toggleImageRendering();
  }); 
  }
}

function copyImageToClipBoard(){
  window.setTimeout(function () {
    var base64 = getRenderedImageBase64();
    const type = "image/png";
    base64 = base64.replace("data:image/png;base64,", "");
    const blob = b64toBlob(base64, type);
    const data = [new ClipboardItem({ [type]: blob })];
    navigator.clipboard.write(data).then(
      () => {
        ShowToastMessage("", "Image copied to clipboard.");
        $("body > div.__markerjs2_.__markerjs2__0_").remove();
        initMarker_copy();
        $("#mainimageholder").attr("src", oldIamgeBase64);
        window.setTimeout(function(){
          markerArea.restoreState(maState);
        },5);
      
      },
      () => {
        ShowToastMessage("error", "Error in copying image to clipboard.");
        $("body > div.__markerjs2_.__markerjs2__0_").remove();
        initMarker_copy();
        $("#mainimageholder").attr("src", oldIamgeBase64);
        window.setTimeout(function(){
     markerArea.restoreState(maState);
        },5);
      }
    );
  }, 200);
}

const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
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
};

function getRenamedName() {
  if (snapshotName == null || snapshotName == "") {
    return getSnapshotName();
  }
  return snapshotName.replaceAll("<", "_").replaceAll(">", "_");
}

function getSnapshotName() {
  var currentdate = new Date();
  var datetime =
    "" +
    currentdate.getDate() +
    "_" +
    (currentdate.getMonth() + 1) +
    "_" +
    currentdate.getFullYear() +
    "_" +
    currentdate.getHours() +
    "_" +
    currentdate.getMinutes() +
    "_" +
    currentdate.getSeconds();

  return "Snapshot_" + datetime;
}

function addCropFeatureFunctionality() {
  var svgElement = $(
    "body > div > div > div:nth-child(2) > div > div:nth-child(2) > svg"
  );
  var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttributeNS(null, "fill", "transparent");
  rect.setAttributeNS(null, "opacity", "1");
  rect.setAttributeNS(null, "stroke-width", "2");
  rect.setAttributeNS(null, "stroke-dasharray", "");
  rect.setAttributeNS(null, "stroke", "#0033cc");
  svgElement.append(rect);
  var startrect = false;
  svgElement.mousedown(function (e) {
    if (cropbuttonToggled == false) {
      return;
    }
    $(rect).show();
    startx = e.pageX - svgElement.offset().left;
    starty = e.pageY - svgElement.offset().top;
    temp_startx = startx;
    temp_starty = starty;
    rect.setAttributeNS(null, "x", startx);
    rect.setAttributeNS(null, "y", starty);
    startrect = true;
  });

  svgElement.mousemove(function (e) {
    if (cropbuttonToggled == false) {
      return;
    }
    if (startrect == true) {
      maxx = e.pageX - svgElement.offset().left;
      maxy = e.pageY - svgElement.offset().top;
      width = maxx - startx;
      height = maxy - starty;
      rect.setAttributeNS(null, "width", width);
      rect.setAttributeNS(null, "height", height);
    }
  });

  svgElement.mouseup(function (e) {
    if (cropbuttonToggled == false) {
      return;
    }
    startx = 0;
    starty = 0;
    maxx = 0;
    maxy = 0;
    startrect = false;
    $(rect).hide();
    displayCroppedImage();
  });
}

function removeUIs() {
  $(
    "body > div.__markerjs2_.__markerjs2__0_ > div > div:nth-child(2) > div > div:nth-child(2) > svg > g > rect"
  ).remove();

  $(
    "body > div.__markerjs2_.__markerjs2__0_ > div > div:nth-child(2) > div > div:nth-child(2) > svg > g"
  ).remove();
}

function toggleImageRendering() {
  var selector1 =
    "body > div.__markerjs2_.__markerjs2__0_ > div > div.__markerjs2__0_toolbar.__markerjs2__0_fade_in.__markerjs2__0_toolbar_colors > div:nth-child(4) > div:nth-child(1)";
  var dataActionAttr = $(selector1).attr("data-action");
  $(selector1).attr("data-action", "opkeydummyaction");
  $(selector1).trigger("click");
  if (dataActionAttr != null) {
    if (dataActionAttr == "createTicket") {
      $(selector1).attr("data-action", "createTicket");
    }
    if (dataActionAttr == "render") {
      $(selector1).attr("data-action", "render");
    }
  }
}

function displayCroppedImage() {
  toggleImageRendering();
  window.setTimeout(function () {
    removeUIs();
    var rendredImage = getRenderedImageBase64();
    if (rendredImage != null) {
      lastbase64Image = rendredImage;
      if (cropbuttonToggled == true) {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        var partialImage = document.getElementById("mainimageholder");
        canvas.width = partialImage.width;
        canvas.height = partialImage.height;

        let ratio = window.devicePixelRatio;

        context.drawImage(
          partialImage,
          temp_startx + 3,
          temp_starty + 3,
          width - 5,
          height - 5,
          0,
          0,
          width - 5,
          height - 5
        );
        rendredImage = canvas.toDataURL();
        $("#mainimageholder").attr("src", rendredImage);
        $(
          "body > div.__markerjs2_.__markerjs2__0_ > div > div:nth-child(2) > div > img"
        ).attr("src", rendredImage);
        $("#dropfeaturebutton").trigger("click");
      }
    }
  }, 500);
}

function ShowToastMessage(messagetype, message) {
  var toast_object = new Object();
  toast_object.text = message;
  toast_object.duration = 3000;
  toast_object.newWindow = true;
  toast_object.close = true;
  toast_object.gravity = "bottom";
  toast_object.positionLeft = true;
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

function showMarkerArea(target) {
  markerArea = new markerjs2.MarkerArea(document.getElementById(target));
  markerArea.addEventListener("render", (event) => {
    document.getElementById(target).src = event.dataUrl;
    maState=event.state;
    if(imageCopyToggled==true){
      imageCopyToggled=false;
      copyImageToClipBoard();
    }
  });

  document.addEventListener("click", function (e) {
    var _dataAction = getDataAction(e.target);
    if (_dataAction === "render") {
      uploadIamgeToOpkey("");
    }
    if (_dataAction === "close") {
      chrome.runtime.sendMessage(
        {
          CloseEditorWindow: "CloseEditorWindow",
        },
        function (response) {}
      );
    }

    if (_dataAction === "createTicket") {
      uploadIamgeToOpkey("Ticket");
    }
    if (_dataAction === "createUserStory") {
      toggleImageRendering();
      uploadIamgeToOpkey("User Story");
    }
  });
  markerArea.show();
}

function createUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function uploadIamgeToOpkey(IssueType) {
  var applicationUtility = localStorage.getItem("AppUtilityType");
  if (
    applicationUtility != null &&
    (applicationUtility == "qlm_snapshot" ||
      applicationUtility == "qlm_snapshot_IssueType")
  ) {
    uploadIamgeToOpkeyQLM(IssueType);
    return;
  }

  chrome.runtime.sendMessage(
    {
      SetVideoUploadStatus: "FETCHING",
    },
    function (response) {}
  );

  loadingStart(document.body,"Uploading image..",null);
  window.setTimeout(function () {
    var rendredImage = getRenderedImageBase64();

    if (cropbuttonToggled == true) {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      var partialImage = document.getElementById("mainimageholder");
      canvas.width = partialImage.width;
      canvas.height = partialImage.height;

      let ratio = window.devicePixelRatio;

      context.drawImage(
        partialImage,
        temp_startx + 3,
        temp_starty + 3,
        width - 5,
        height - 5,
        0,
        0,
        width - 5,
        height - 5
      );
      rendredImage = canvas.toDataURL();
    }

    rendredImage = rendredImage.replace("data:image/png;base64,", "");
    var domain = localStorage.getItem("Domain");
    var resultid = localStorage.getItem("ResultID");
    var sessionid = localStorage.getItem("SessionID");
    var _outdata = {
      SessionID: sessionid,
      Result_ID: resultid,
      Base64ImageData: rendredImage,
      FileName: getRenamedName(),
      extension: "png",
    };

    initiatedXhrRequest=$.ajax({
      url: domain + "/Result/UploadResultSnapshotUsingAddon",
      type: "POST",
      data: { strAddonSnapshotBinding: JSON.stringify(_outdata) },
      success: function (succ_data) {
        debugger;
        chrome.runtime.sendMessage(
          {
            InjectFid: succ_data,
          },
          function (response) {}
        );

        chrome.runtime.sendMessage(
          {
            SetVideoUploadStatus: "COMPLETED",
          },
          function (response) {}
        );
        loadingStop(document.body,null);
      },
      error: function (err_data) {
        loadingStop(document.body,null);
      },
    });
  }, 500);
}

function uploadIamgeToOpkeyQLM(IssueType) {
  debugger;
  chrome.runtime.sendMessage(
    {
      SetVideoUploadStatus: "FETCHING",
    },
    function (response) {}
  );
  loadingStart(document.body,"Uploading image..",null);
  window.setTimeout(function () {
    var rendredImage = getRenderedImageBase64();

    if (cropbuttonToggled == true) {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      var partialImage = document.getElementById("mainimageholder");
      canvas.width = partialImage.width;
      canvas.height = partialImage.height;

      let ratio = window.devicePixelRatio;

      context.drawImage(
        partialImage,
        temp_startx + 3,
        temp_starty + 3,
        width - 5,
        height - 5,
        0,
        0,
        width - 5,
        height - 5
      );
      rendredImage = canvas.toDataURL();
    }

    rendredImage = rendredImage.replace("data:image/png;base64,", "");
    var domain = localStorage.getItem("Domain");
    var resultid = localStorage.getItem("ResultID");
    var sessionid = localStorage.getItem("SessionID");
    var _outdata = {
      Base64ImageData: rendredImage,
      FileName: getRenamedName(),
      extension: "png",
    };
    debugger;
    initiatedXhrRequest=$.ajax({
      url: domain + "/FileManager/Upload_Temp_Snapshot_Using_Addon",
      type: "POST",
      data: { strAddonSnapshotBinding: JSON.stringify(_outdata) },
      success: function (succ_data) {
        debugger;
        succ_data["IssueType"] = IssueType;
        chrome.runtime.sendMessage(
          {
            InjectQLMResponse: succ_data,
          },
          function (response) {}
        );

        chrome.runtime.sendMessage(
          {
            SetVideoUploadStatus: "COMPLETED",
          },
          function (response) {}
        );

        loadingStop(document.body,null);
      },
      error: function (err_data) {
        loadingStop(document.body,null);
      },
    });
  }, 500);
}

function getRenderedImageBase64() {
  return document.getElementById("mainimageholder").src;
}

function getDataAction(_element) {
  var _temp = _element;
  while (_temp.parentNode != null) {
    if (_temp.getAttribute("data-action") != null) {
      return _temp.getAttribute("data-action");
    }
    _temp = _temp.parentNode;
  }
  return "";
}

$("#create_ticket_btn_recorder").on("click", function () {
  uploadIamgeToOpkey("Ticket");
});

$("#create_requirement_btn_recorder").on("click", function () {
  uploadIamgeToOpkey("User Story");
});


var tempElementBlocked = null;
var tempCtrElement = null;
var loaderstarted = false;
var unblockStarted=false;
function loadingStart(el, msg, ctrl) {
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
      '<div style="background-color: white; height: 90px; padding: 10px;border-radius: 20px; border: 3px solid #2F95B1;"><div class="spinner-border spinner-theme-green"></div><span style="display: block; position: relative; padding-top: 18px; color:black; font-size:14px;font-weight: 600;">' +
      msg +
      '</span><button id="opkeyCancelProcess" class="btn" style="color:black; font-size:15px;font-weight: 500; position: relative; margin-top: 15px; background-color: #fff; border: 1px solid #D0D5DD; border-radius: 5px; padding: 4px 8px;">Cancel</button></div>',
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
    unblockStarted=true;
    unblockUIAddon();
  });
}


function unblockUIAddon() {
  chrome.runtime.sendMessage(
    {
      SetVideoUploadStatus: "STOPAPI",
    },
    function (response) {}
  );
  if(initiatedXhrRequest!=null){
    initiatedXhrRequest.abort();
    initiatedXhrRequest=null;
  }
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

function loadingStop(el, ctrl) {
  if(initiatedXhrRequest!=null){
    initiatedXhrRequest.abort();
    initiatedXhrRequest=null;
  }
  loaderstarted = false;
  $(ctrl).removeAttr("disabled");
  $(el).unblock();
  var addonInititedFrom=localStorage.getItem("initiatedfrom");
  if(addonInititedFrom!=null && addonInititedFrom=="OpkeyTool"){
    confirmationOk_opkeyinitiated(document.body,"<div style='padding-top: 20px;line-height: 2.5;'><span style='padding: 7px 10px; background: #F2F2F2; border-radius: 8px;'>Snapshot Uploaded Successfully. <span style='width: 18px;display: inline-block;height: 18px;background: limegreen;border-radius: 50%;margin-left: 10px;position: relative;vertical-align: text-bottom;'><i class='oci oci-check' style='position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);font-size: 12px;'></i></span></span></div>",null);
  }
  else{
  confirmationOk(document.body,"<div style='padding-top: 20px;line-height: 2.5;'><span style='padding: 7px 10px; background: #F2F2F2; border-radius: 8px;'>Snapshot Uploaded Successfully. <span style='width: 18px;display: inline-block;height: 18px;background: limegreen;border-radius: 50%;margin-left: 10px;position: relative;vertical-align: text-bottom;'><i class='oci oci-check' style='position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);font-size: 12px;'></i></span></span></div><div><i class='oci oci-trending_flat' style='line-height: 1.25; color: #5D5D5D; transform: rotate(90deg);  font-size: 25px;'></i></div><div style='text-align:left; padding: 3px 40px;'><span style='background: #F2F2F2; display: inline-block; padding: 5px 15px; border-radius: 8px;'>Launch the Opkey Browser Extension and start creating a ticket/user story.</span></div>",null);
  }
  unblockStarted=false;
}

function confirmationOk_opkeyinitiated(el, msg, ctrl) {
  if (loaderstarted == true) {
    return;
  }
  if(unblockStarted==true){
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
      '<div style="background-color: white; padding: 10px; border-radius: 20px; height: 125px; border: 3px solid #2F95B1;"><div class="spinner-border spinner-theme-green"></div><span style="display: block; position: relative; padding-top: 8px; color: #5D5D5D; font-size:16px;font-weight: 500; text-align:center;">' +
      msg +
      '</span><button id="okButtonAddon" class="btn" style="color: #fff; font-size: 15px; margin-top: 21px; background: #0D5163; border-radius: 5px; padding: 4px 15px; border: 1px solid #0D5163;">OK</button></div>',
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
  $("#okButtonAddon").click(function (e) {
    localStorage.removeItem("initiatedfrom");
    chrome.runtime.sendMessage(
      {
        CloseEditorWindow: "CloseEditorWindow",
      },
      function (response) {}
    );
  });
}

function confirmationOk(el, msg, ctrl) {
  if (loaderstarted == true) {
    return;
  }
  if(unblockStarted==true){
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
      '<div style="background-color: white; padding: 10px; border-radius: 20px; height: 225px; border: 3px solid #2F95B1;"><div class="spinner-border spinner-theme-green"></div><span style="display: block; position: relative; padding-top: 8px; color: #5D5D5D; font-size:16px;font-weight: 500; text-align:center;">' +
      msg +
      '</span><button id="okButtonAddon" class="btn" style="color: #fff; font-size: 15px; margin-top: 21px; background: #0D5163; border-radius: 5px; padding: 4px 15px; border: 1px solid #0D5163;">OK</button></div>',
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
  $("#okButtonAddon").click(function (e) {
    chrome.runtime.sendMessage(
      {
        CloseEditorWindow: "CloseEditorWindow",
      },
      function (response) {}
    );
  });
}


