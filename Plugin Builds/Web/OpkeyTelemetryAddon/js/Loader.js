//---------For Single Div & Single Buttons---------

var tempElementBlocked = null;
var tempCtrElement = null;
var loaderstarted = false;
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
      '<div style="background-color: white;padding: 10px;border-radius: 5px"><div class="spinner-border spinner-theme-green"></div><span style="display: block; position: relative; padding-top: 8px; color:black; font-size:14px;font-weight: 700;">' +
      msg +
      '</span></div>',
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
}

//---------For Single Div ---------

function loadingStart_BlockLoader(el, msg, ctrl) {
  $(ctrl).attr("disabled", true);
  $("#" + el).block({
    centerX: true,
    centerY: true,
    async: true,
    // message: '<img src="~/Assets/images/loader/1.gif"> <br><span style="color:#fff; font-size:20px">' + msg + '</span>',
    message:
      '<div style="background-color: white;padding: 10px;border-radius: 5px"><div class="spinner-border spinner-theme-green"></div><span style="display: block; position: relative; padding-top: 8px; color:black; font-size:14px;font-weight: 700;">' +
      msg +
      "</span></div>",
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
}

function loadingStop_BlockLoader(el, ctrl) {
    loaderstarted = false;
  $(ctrl).removeAttr("disabled");
  $("#" + el).unblock();
}
//-------end------------

function loadingStartProgressBar(el, msg, ctrl) {
  $(ctrl).attr("disabled", true);
  $(el).block({
    centerX: true,
    centerY: true,
    async: true,
    // message: '<img src="~/Assets/images/loader/1.gif"> <br><span style="color:#fff; font-size:20px">' + msg + '</span>',
    message:
      '<div style="background-color: white;padding: 10px;border-radius: 5px"><div class="spinner-border spinner-theme-green"></div><span style="display: block; position: relative; padding-top: 8px; color:black; font-size:14px;font-weight: 700;">' +
      msg +
      "</span></div>",
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
}

function loadingStart3(el, msg, image, ctrl) {
  $(ctrl).attr("disabled", true);
  $(el).block({
    centerX: true,
    centerY: true,
    async: true,
    // message: '<img src="~/Assets/images/loader/1.gif"> <br><span style="color:#fff; font-size:20px">' + msg + '</span>',
    message:
      '<div style="background-color: white;padding: 10px;border-radius: 5px;">' +
      '<img src="' +
      image +
      '" style="max-width:100%;height:auto" /><br><br><span style="color:black; font-size:15px;font-weight: 700; position: relative;top: -3px;">' +
      msg +
      "</span></div>",
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
}

function loadingStart4(el, msg, image, ctrl) {
  $(ctrl).attr("disabled", true);
  $(el).block({
    centerX: true,
    centerY: true,
    async: true,
    // message: '<img src="~/Assets/images/loader/1.gif"> <br><span style="color:#fff; font-size:20px">' + msg + '</span>',
    message:
      '<p class="blankPageLoader_text">' +
      msg +
      "</p>" +
      '<div class="blankPageLoader">Please wait...</div>',
    css: {
      border: "none",
      padding: "2px",
      backgroundColor: "none",
      "z-index": "9999",
    },
    overlayCSS: {
      backgroundColor: "#f0eff5",
      opacity: 1,
      cursor: "wait",
      "z-index": "9999",
    },
    blockMsgClass: "FullPageLoader",
  });
  // $('.blockUI.blockMsg').center();
}

function loadingStartStatusBar(el, msg, ctrl) {
  $(ctrl).attr("disabled", true);
  $(el).block({
    centerX: true,
    centerY: true,
    async: true,
    // message: '<img src="~/Assets/images/loader/1.gif"> <br><span style="color:#fff; font-size:20px">' + msg + '</span>',
    // message: '<img src="/Assets/images/loader/1.gif" style="background-color: white;padding: 10px;border-radius: 10px;">',
    message:
      '<div style="padding:10px ;background-color:white;border-radius:5px;"><div><i class="fa fa-spinner fa-pulse fa-2x fa-fw margin-bottom"></i>&nbsp;<span id="spLoaderMessage" style="vertical-align: super;font-weight:bold">Processing please wait...</span></div><br>' +
      '<div style="height: 20px;"><div id="divLoaderProgressBar" class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div></div></div>',

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
}

function loadingStartStatusBarHtml(el, msg, ctrl) {
  var html = "";

  html =
    html +
    '  <div style="padding:10px ;background-color:white;border-radius:5px;">';
  html = html + "<div>";
  html =
    html +
    '<i class="fa fa-spinner fa-pulse fa-2x fa-fw margin-bottom"></i>&nbsp;';
  html =
    html +
    '<span id="spLoaderMessage" style="vertical-align: super;font-weight:bold">Processing please wait...</span>';
  html = html + "</div>";
  html = html + "<br>";
  html =
    html +
    '<div id="divLoaderB" class="progress" style="height: 20px; margin-bottom:0">';
  html =
    html +
    '<div id="divLoaderProgressBar" class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100">';
  html = html + "</div>";
  html = html + "</div>";
  html = html + "<br>";
  html = html + '<div id="divButton" style="height: 43px;"><br>';
  html = html + "</div>";
  html = html + "</div>";

  $(ctrl).attr("disabled", true);
  $(el).block({
    centerX: true,
    centerY: true,
    async: true,
    message: html,
    // message: '<img src="~/Assets/images/loader/1.gif"> <br><span style="color:#fff; font-size:20px">' + msg + '</span>',
    // message: '<img src="/Assets/images/loader/1.gif" style="background-color: white;padding: 10px;border-radius: 10px;">',
    //message: '<div style="padding:10px ;background-color:white;border-radius:5px;"><div><i class="fa fa-spinner fa-pulse fa-2x fa-fw margin-bottom"></i>&nbsp;<span id="spLoaderMessage" style="vertical-align: super;font-weight:bold">Processing please wait...</span></div><br>' +
    //    '<div style="height: 20px;"><div id="divLoaderProgressBar" class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div></div></div>',

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
}

function loadingStop(el, ctrl) {
    loaderstarted = false;
  $(ctrl).removeAttr("disabled");
  $(el).unblock();
}

//---------For Single Div & Multiple Buttons---------

function loadingStartMultipleClass(el, msg, ctrl) {
  var classCtrl = ctrl.split(",");
  $.each(classCtrl, function (key, value) {
    $(value).attr("disabled", true);
  });

  $(el).block({
    centerX: true,
    centerY: true,
    async: true,
    // message: '<img src="~/Assets/images/loader/1.gif"> <br><span style="color:#fff; font-size:20px">' + msg + '</span>',
    //message: '<img src="/Assets/images/loader/1.gif" style="background-color: white;padding: 10px;border-radius: 10px;">',
    message:
      '<div style="background-color: white;padding: 10px;border-radius: 5px"><div class="spinner-border spinner-theme-green"></div><span style="display: block; position: relative; padding-top: 8px; color:black; font-size:14px;font-weight: 700;">' +
      msg +
      "</span></div>",

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
}

function loadingStopMultipleClass(el, ctrl) {
    loaderstarted = false;
  var classCtrl = ctrl.split(",");
  $.each(classCtrl, function (key, value) {
    $(value).removeAttr("disabled");
  });
  $(el).unblock();
}

//---------For Single Div With Text---------

function loadingStart2(el, msg, ctrl, ctrl2) {
  var disableCtrl = ctrl.split(",");
  $.each(disableCtrl, function (key, value) {
    $(value).attr("disabled", true);
  });
  var hideCtrl = ctrl2.split(",");
  $.each(hideCtrl, function (key, value) {
    $(value).hide();
  });
  var newMsg =
  msg.trim() == ""
      ? '<div style="background-color: white;padding: 10px;border-radius: 5px"><div class="spinner-border spinner-theme-green"></div><span style="display: block; position: relative; padding-top: 8px; color:black; font-size:14px;font-weight: 700;"></span></div>'
      : '<div style="background-color: white;padding: 10px;border-radius: 5px"><div class="spinner-border spinner-theme-green"></div><span style="display: block; position: relative; padding-top: 8px; color:black; font-size:14px;font-weight: 700;">' +
        msg +
        "</span></div>";
  $(el).block({
    centerX: true,
    centerY: true,
    async: true,
    message: newMsg,
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
}

function loadingStop2(el, ctrl, ctrl2) {
    loaderstarted = false;
  var disableCtrl = ctrl.split(",");
  $.each(disableCtrl, function (key, value) {
    $(value).removeAttr("disabled");
  });
  var hideCtrl = ctrl2.split(",");
  $.each(hideCtrl, function (key, value) {
    $(value).show();
  });
  $(el).unblock();
  $(ctrl).show();
}

//---------For Single Div With Text---------

function loadingStartWithCancelButton(el, msg, ctrl) {
  $(ctrl).attr("disabled", true);
  $(el).block({
    centerX: true,
    centerY: true,
    async: true,
    // message: '<img src="~/Assets/images/loader/1.gif"> <br><span style="color:#fff; font-size:20px">' + msg + '</span>',
    message:
      '<div style="background-color: white;padding: 10px;border-radius: 5px;text-align:center"><i class="<div class="spinner-border spinner-theme-green">' +
      '</div><span style="display: block; position: relative; padding-top: 8px; color:black; font-size:14px;font-weight: 700;">' +
      msg +
      "</span>" +
      '<br><button type="button" class="btn btn-default btn-sm cancelUiBlocking">Cancel</button></div>',
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

  $(".cancelUiBlocking").bind("click", function () {
    ////debugger;
    loadingStop(el, ".btnTestLoader");
  });

  // $('.blockUI.blockMsg').center();
}
