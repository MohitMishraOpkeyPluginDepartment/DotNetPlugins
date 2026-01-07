
var videosourceattached = false;
var timer_paused = false;
var sharingStopped = false;
$(function () {
    chrome.runtime.sendMessage({
        IsDockerUIShowing: "IsDockerUIShowing"
    }, function (response) {
        if (chrome.runtime.lastError) { }
        if (response != null) {
            if (response == false) {
                initVideoEditorUIs();
            }
        }
    });
});

function initVideoEditorUIs() {
    if(isInsideDocker()){
        loadingStop($("#div_recorder_view"), null);
    }
    videosourceattached = false;
    timer_paused = false;
    $("#timerClock").text("00:00:00");
    $("#stoprecording").show();
    $("#create_Ticket").hide();
    $("#create_Userstory").hide();
    $("#downloadvideo").hide();
    $("#uploadtoopkey").hide();
    $("#opkeyviewer").hide();
    $("#div_recorder_view").hide();
    $("#videoname").hide();
    $("#videoname").val(getRecordedVideoName());
    $("#pause_play_btn").show();
    var button = $("#playPauseButtonHolder");
    if(localStorage.getItem("VideoEditorPauseStatus")=="PAUSED"){
        button.removeClass("oci-pause");
        button.addClass("oci-play");
        $("#pause_play_btn").removeClass('shadow_red');
        timerTickThread();
    }
    else {
        button.removeClass("oci-play");
        button.addClass("oci-pause");
        $("#pause_play_btn").addClass('shadow_red');
        startTimer();
    }
    $("#pause_play_btn").unbind().click(function () {
        if (button.hasClass("oci-pause")) {
            button.removeClass("oci-pause");
            button.addClass("oci-play");
            $(this).removeClass('shadow_red');
            pauseTimer();
            pauseRecording();
            localStorage.setItem("VideoEditorPauseStatus","PAUSED");
        }
        else {
            button.removeClass("oci-play");
            button.addClass("oci-pause");
            $(this).addClass('shadow_red');
            resumeTimer();
            resumeRecording();
            localStorage.setItem("VideoEditorPauseStatus","PLAY");
        }
    });

    $("#stoprecording").unbind().click(function () {
        localStorage.removeItem("VideoEditorPauseStatus");
        var button = $("#playPauseButtonHolder");
        button.removeClass("oci-play");
        button.addClass("oci-pause");
        button.addClass('shadow_red');

        localStorage.setItem("VideoEditorStatus", "STOPPED");
        pauseTimer();
        toggleButtons();
        stopGifEncoder("opkey_unknown");
        $("#action_container").removeClass('no_activeAction');
    });

    $("#discardrecording").unbind().click(function () {
        localStorage.removeItem("VideoEditorPauseStatus");
        var button = $("#playPauseButtonHolder");
        button.removeClass("oci-play");
        button.addClass("oci-pause");
        button.addClass('shadow_red');
        stopTimer();
        closeEditorWindow_discard();
    });

    $("#create_Ticket").unbind().click(function () {
        uploadVideoToServer("Ticket");
    });

    $("#create_Userstory").unbind().click(function () {
        uploadVideoToServer("User Story");
    });

    $("#downloadvideo").unbind().click(function () {
        downloadVideo();
    });

    $("#uploadtoopkey").unbind().click(function () {
        uploadVideoToServer("opkey_unknown");
    });
    fetchSystemCalls();
}

function pauseRecordngInUiOnly() {
    pauseTimer();
    var button = $("#playPauseButtonHolder");
    button.removeClass("oci-pause");
    button.addClass("oci-play");
    $(button).removeClass('shadow_red');
    chrome.runtime.sendMessage({
        GetTimerTick: "GetTimerTick"
    }, function (response) {
        if (response != null) {
            $("#timerClock").text(response);
        }
    });
}

function resumeRecordngInUiOnly() {
    resumeTimer();
    var button = $("#playPauseButtonHolder");
    button.removeClass("oci-play");
    button.addClass("oci-pause");
    $(button).addClass('shadow_red');
}

function resetVideoEditorUIs() {
    stopTimer();
    stopFetchSystemCall();
}

function getRecordedVideoName() {
    var currentdate = new Date();
    var datetime = "" + currentdate.getDate() + "_"
        + (currentdate.getMonth() + 1) + "_"
        + currentdate.getFullYear() + "_"
        + currentdate.getHours() + "_"
        + currentdate.getMinutes() + "_"
        + currentdate.getSeconds();

    return "RecordedVideo_" + datetime;
}

function toggleButtons() {
    var apputilitytype = localStorage.getItem("AppUtilityType");
    if (apputilitytype != null) {
        if (apputilitytype == "qlm_snapshot_IssueType" || apputilitytype == "qlm_video_IssueType") {
            $("#create_Ticket").show();
            $("#create_Userstory").show();
            $("#downloadvideo").show()
            $("#uploadtoopkey").hide();
            $("#pause_play_btn").hide();
            $("#stoprecording").hide();
        }
        else {
            $("#create_Ticket").hide();
            $("#create_Userstory").hide();
            $("#downloadvideo").show();
            $("#uploadtoopkey").show();
            $("#pause_play_btn").hide();
            $("#stoprecording").hide();
        }
    }

    chrome.runtime.sendMessage({
        IsDockerUIShowing: "IsDockerUIShowing"
    }, function (response) {
        if (chrome.runtime.lastError) { }
        if (response != null) {
            if (response == false) {
                chrome.runtime
                    .sendMessage({
                        ResizeVideoEditorWindow: "ResizeVideoEditorWindow"
                    },
                        function (response) {
                            $("#opkeyviewer").show();
                            $("#videoname").show();
                            stopTimer();
                        });
            }
            else {
                $("#div_recorder_view").show();
                $("#opkeyviewer").show();
                $("#videoname").show();
            }
        }
    });

    chrome.runtime
        .sendMessage({
            ResizeVideoEditorWindow: "ResizeVideoEditorWindow"
        },
            function (response) {
                $("#opkeyviewer").show();
                $("#videoname").show();

            });


}

var timerInterval = -1;
var fetchSystemCallThread = -1;
function fetchSystemCalls() {
    if (fetchSystemCallThread > -1) {
        window.clearInterval(fetchSystemCallThread);
    }
    fetchSystemCallThread = window.setInterval(function () {
        try {
            chrome.runtime.sendMessage({
                GetVideoEditorStatus: "GetVideoEditorStatus"
            }, function (response) {
                if (response) {
                    if (response === "SHARINGSTOPPED") {
                        pauseTimer();
                        toggleButtons();
                        stopGifEncoder("opkey_unknown");
                        window.clearInterval(fetchSystemCallThread);
                    }
                }
            });
        } catch (e) {
            window.clearInterval(fetchSystemCallThread);
        }
    }, 1000);
}

function stopOpkeyBroadcast() {
    pauseTimer();
    toggleButtons();
    loadRecordedVideo();
}

function stopFetchSystemCall() {
    if (fetchSystemCallThread > -1) {
        window.clearInterval(fetchSystemCallThread);
        fetchSystemCallThread = -1;
    }
}

function pauseRecording() {
    pauseTimer();
    chrome.runtime.sendMessage({
        pauseVideoRecording: "pauseVideoRecording"
    }, function (response) {

    });
}

function resumeRecording() {
    resumeTimer();
    chrome.runtime.sendMessage({
        resumeVideoRecording: "resumeVideoRecording"
    }, function (response) {
    });
}

function startTimer() {
    chrome.runtime.sendMessage({
        StartimerTick: "StartimerTick"
    }, function (response) {
    });
    timerTickThread();
}

function timerTickThread(){
    window.clearInterval(timerInterval);
    timerInterval = window.setInterval(function () {
        if (timer_paused == true) {
            return;
        }

        try {
            chrome.runtime.sendMessage({
                GetTimerTick: "GetTimerTick"
            }, function (response) {
                if (response != null) {
                    $("#timerClock").text(response);
                }
            });
        } catch (e) {
            window.clearInterval(timerInterval);
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval > -1) {
        window.clearInterval(timerInterval);
        timerInterval = -1;
    }

    chrome.runtime.sendMessage({
        ResetTimerTick: "ResetTimerTick"
    }, function (response) {
    });
}

function resumeTimer() {
    timer_paused = false;
}

function pauseTimer() {
    timer_paused = true;
}


function stopGifEncoder(_issuetype) {
    videosourceattached=false;
    chrome.runtime.sendMessage({
        stopVideoRecording: _issuetype
    }, function (response) {
        var thrId = window.setInterval(function () {
            chrome.runtime.sendMessage({
                FetchRecordedVideo: "FetchRecordedVideo"
            }, function (response) {
                if (response != null && response != "INPROGRESS") {
                    if (videosourceattached == false) {
                        var videoPlayer= document.getElementById("opkeyviewer");
                        videoPlayer.onloadeddata = function() {
                            var timerTick=  convertSecondsToTimeStamp(videoPlayer.duration);
                            debugger
                            $("#timerClock").text(timerTick);
                          }
                        videoPlayer.src = response;
                        videosourceattached = true;
                    }
                    window.clearInterval(thrId);
                }
            });
        }, 1000);
    });
}

function loadRecordedVideo() {
    videosourceattached=false;
    var thrId = window.setInterval(function () {
        chrome.runtime.sendMessage({
            FetchRecordedVideo: "FetchRecordedVideo"
        }, function (response) {
            if (response != null && response != "INPROGRESS") {
                if (videosourceattached == false) {
                    var videoPlayer= document.getElementById("opkeyviewer");
                    videoPlayer.onloadeddata = function() {
                        var timerTick=  convertSecondsToTimeStamp(videoPlayer.duration);
                        debugger
                        $("#timerClock").text(timerTick);
                    }

                    videoPlayer.src = response;
                    videosourceattached = true;
                }
                window.clearInterval(thrId);
            }
        });
    }, 1000);
}

function convertSecondsToTimeStamp(timer_ss){
    timer_ss=Math.floor(timer_ss)

    const totalMinutes = Math.floor(timer_ss / 60);

    var seconds = timer_ss % 60;
    var hours = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
    if(seconds<10){
        seconds="0"+seconds;
    }

    if(hours<10){
        hours="0"+hours;
    }

    if(minutes<10){
        minutes="0"+minutes;
    }
    var timer_totaltime = hours + ":" + minutes + ":" + seconds;
    return timer_totaltime;
}

function uploadVideoToServer(_issuetype) {
    if(isInsideDocker()){
        loadingStart($("#div_recorder_view"),"Uploading video..",null);
    }
    else{
    loadingStart(document.body,"Uploading video..",null);
    }
    chrome.runtime.sendMessage({
        uploadVideoRecording: { "issueType": _issuetype, "filename": $("#videoname").val() }
    }, function (response) {
        closeEditorWindow();
    });
}


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
      '<div style="background-color: white;padding: 2px;border-radius: 5px"><div class="spinner-border spinner-theme-green"></div><span style="display: block; position: relative; padding-top: 8px; color:black; font-size:14px;font-weight: 700;">' +
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


function isInsideDocker() {
    if (document.URL != null && (document.URL.indexOf("MainDocker.html") > -1 || document.URL.indexOf("callsource=docker") > -1)) {
        return true;
    }
    return false;
}


function unblockUIAddon() {
    chrome.runtime.sendMessage(
        {
          SetVideoUploadStatus: "STOPAPI",
        },
        function (response) {}
      );
    chrome.runtime
    .sendMessage({
        CancelVideoUploadRequest: "CancelVideoUploadRequest"
    },
        function (response) { });
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
    chrome.runtime
    .sendMessage({
        CancelVideoUploadRequest: "CancelVideoUploadRequest"
    },
        function (response) { });
  loaderstarted = false;
  $(ctrl).removeAttr("disabled");
  $(el).unblock();
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
};

function downloadVideo() {
    ShowToastMessage("warning","Preparing to download video.");
    var thrId = window.setInterval(function () {
        chrome.runtime.sendMessage({
            downloadRecordedVideoForDocker: $("#videoname").val()
        }, function (response) {
            if (response != null && response!="INPROGRESS") {
                window.clearInterval(thrId);
                var _filename = $("#videoname").val();
                if (_filename == null || _filename == "") {
                    _filename = "OpkeyRecordedVideo";
                }
                var a = document.createElement('a');
                document.body.appendChild(a);
                a.style = 'display: none';
                a.href = response;
                a.download = _filename + '.mp4';
                a.click();
                ShowToastMessage("","Video Downloaded!");
            }
        });
    }, 1000);
}

function closeEditorWindow() {

    $("#action_container").addClass('no_activeAction');

    /*
    chrome.runtime
        .sendMessage({
            CloseEditorWindow: "CloseEditorWindow"
        },
            function (response) { });
            */
}

function closeEditorWindow_discard() {

    $("#action_container").addClass('no_activeAction');
    chrome.runtime
        .sendMessage({
            CloseEditorWindow: "CloseEditorWindow"
        },
            function (response) { });
}