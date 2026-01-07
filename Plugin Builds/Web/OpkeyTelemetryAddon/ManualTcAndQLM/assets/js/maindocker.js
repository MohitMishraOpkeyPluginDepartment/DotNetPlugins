var videoStopped = false;
var divCoordinatesAndMessageCheck = -1;
function getDivPoperties() {
    if (document.URL != null && document.URL.indexOf("MainDocker.html") == -1) {
        debugger
        return
    }
}

function setLocationOfDivCircle() {
    var divElement = document.getElementById("mimimizedRecorderCircle");
    if (divElement != null) {
        if ($(divElement).is(":visible")) {
            var _rect = divElement.getBoundingClientRect();
            var actionObject = new Object();
            actionObject["action"] = "setDivLocation";
            actionObject["data"] = _rect;
            window.parent.postMessage(JSON.stringify(actionObject), "*");
            return _rect;
        }
    }
    return null;
}

function opkey_sendDivCoordinates() {
    divCoordinatesAndMessageCheck = window.setInterval(function () {
        var maindivrect = setLocationOfDivCircle();
        var _viewactiondiv1 = document.getElementById("view_action_create_user_story");
        if (_viewactiondiv1 != null) {
            if ($(_viewactiondiv1).is(":visible")) {
                var _viewactionrect = _viewactiondiv1.getBoundingClientRect();

                if (maindivrect != null) {
                    var widthdiff = _viewactionrect.left - maindivrect.left;
                    _viewactionrect.left = maindivrect.left;
                    _viewactionrect.x = maindivrect.x;
                    _viewactionrect.width = _viewactionrect.width + widthdiff;
                }

                var actionObject = new Object();
                actionObject["action"] = "setDivLocation";
                actionObject["data"] = _viewactionrect;
                window.parent.postMessage(JSON.stringify(actionObject), "*");
            }
        }

        var _viewactiondiv2 = document.getElementById("view_action_create_ticket");
        if (_viewactiondiv2 != null) {
            if ($(_viewactiondiv2).is(":visible")) {
                var _viewactionrect = _viewactiondiv2.getBoundingClientRect();
                if (maindivrect != null) {
                    var widthdiff = _viewactionrect.left - maindivrect.left;
                    _viewactionrect.left = maindivrect.left;
                    _viewactionrect.x = maindivrect.x;
                    _viewactionrect.width = _viewactionrect.width + widthdiff;
                }
                var actionObject = new Object();
                actionObject["action"] = "setDivLocation";
                actionObject["data"] = _viewactionrect;
                window.parent.postMessage(JSON.stringify(actionObject), "*");
            }
        }
        checkForWindowsMessage();
    }, 1000);
}

function checkForWindowsMessage() {
    try {
        chrome.runtime.sendMessage({
            Window_FetchMessage: "Window_FetchMessage"
        }, function (response) {
            if (response != null) {
                $("#action_container").removeClass('show_action_container');
            }
        });
    } catch (e) {
        window.clearInterval(divCoordinatesAndMessageCheck);
    }
}

function mainDockerDivNotClickable() {
    var actionObject = new Object();
    actionObject["action"] = "addFrameStyle";
    window.parent.postMessage(JSON.stringify(actionObject), "*");
}

function showTaskDiv(divtype) {
    videoStopped = false;
    $(".item_action").removeClass('active');
    $(".view_action").hide();

    $("#action_container").removeClass('no_activeAction');

    if (divtype == "CAPTURE_VIDEO") {
        //$("#view_action_capture_video").show();
        // $("#itemCaptureVideo").addClass('active');
    }
    if (divtype == "CAPTURE_IMAGE") {
        // $("#view_action_capture_image").show();
        //$("#itemCaptureImage").addClass('active');
    }
    if (divtype == "USER_STORY") {
        $("#action_container").addClass('show_action_container');
        $("#view_action_create_user_story").show();
        $("#itemUserStory").addClass('active');
    }
    if (divtype == "TICKET") {
        $("#action_container").addClass('show_action_container');
        $("#view_action_create_ticket").show();
        $("#itemTicket").addClass('active');
    }
    if (divtype == "PROJECT_VIEW") {
        $("#view_action_project_view").show();
        $("#itemProject").addClass('active');
    }
    if (divtype == "DISCARD") {
        $(".item_action").removeClass('active');
        $(".view_action").hide();
        $("#action_container").removeClass('show_action_container');
        $("#action_container").addClass('no_activeAction');
        window.setTimeout(function () {
            mainDockerDivNotClickable();
        }, 500);
    }
}

function mainDockerDivClickable() {
    var actionObject = new Object();
    actionObject["action"] = "removeFrameStyle";
    window.parent.postMessage(JSON.stringify(actionObject), "*");
}

function pauseDockerNotClicable() {
    var actionObject = new Object();
    actionObject["action"] = "pauseDockerNotCliackable";
    window.parent.postMessage(JSON.stringify(actionObject), "*");
}

function resumeDockerNotClicable() {
    var actionObject = new Object();
    actionObject["action"] = "resumeDockerNotCliackable";
    window.parent.postMessage(JSON.stringify(actionObject), "*");
}

function addAllOPkeydivEvents() {
    $("#action_Discard").click(function () {
        window.setTimeout(function () {
            pauseDockerNotClicable();
            window.setTimeout(function () {
                mainDockerDivClickable();
            }, 300);
        }, 300);
        $.msgBox({
            title: "Opkey",
            content: "You will no longer be able to use the docker feature if you disable this feature.",
            modal: true,
            type: "confirm",
            buttons: [{ value: "Disable" }, { value: "Cancel" }],
            success: function (result) {
                window.setTimeout(function () {
                    resumeDockerNotClicable();
                    window.setTimeout(function () {
                        mainDockerDivNotClickable();
                    }, 300);
                }, 300);
                if (result === "Disable") {
                    $("#view_action_create_ticket").html('');
                    $("#view_action_create_user_story").html('');
                    localStorage.removeItem("capture_step_data");
                    chrome.runtime.sendMessage({
                        ResetVideoUploadStatus: "STOPSESSION"
                    }, function (response) { });
                    chrome.runtime.sendMessage({
                        DisableQlmManualAddonDocker: "DisableQlmManualAddonDocker"
                    }, function (response) { });
                    showTaskDiv("DISCARD");
                }
            }
        });

    });

    $("#CaptureVisiblePart").click(function (e) {
        chrome.runtime.sendMessage({
            ShowVideoEditorInFront: "ShowVideoEditorInFront"
        }, function (response) { });
        var opkey_end_point = localStorage.getItem("Domain");

        if (opkey_end_point === null || opkey_end_point === "") {
            $.notify('User not logged in.', { position: "bottom right", className: "error" });
            return;
        }

        if ($(".item_action").hasClass('active')) {
            if ($(".item_action.active").prop('id') == 'itemUserStory' || $(".item_action.active").prop('id') == 'itemTicket') {
                let curd_data = localStorage.getItem("capture_step_data");
                if (curd_data != null && curd_data != "") {
                    curd_data = JSON.parse(curd_data);
                    if (curd_data.type == "User Story" || curd_data.type == "Ticket") {
                        let data = { persist: true, type: "CAPTURE_IMAGE" };
                        postMessage(
                            JSON.stringify(data),
                            "*"
                        );
                        return false;
                    }
                }
            }
        }
        if (IsRecordingInProgress) {
            let type = 'Image capture';
            if ($(".item_action.active").prop('id') == 'itemCaptureVideo') {
                type = 'Video recording';
            }

            $.notify(type + ' inprogress', { position: "bottom right", className: "error" });
            return false;
        }

        let manual_ruuner_sessionID = localStorage.getItem("SessionID");
        /*
        if (manual_ruuner_sessionID != null && manual_ruuner_sessionID != "") {
            $.notify('Manual run is in progress.', { position: "bottom right", className: "error" });
            return false;
        }*/

        $("#action_container").removeClass('show_action_container');

        $("#view_action_create_ticket").html('');
        $("#view_action_create_user_story").html('');

        loadDiv("CAPTURE_IMAGE_CURRENT");
        showTaskDiv("CAPTURE_IMAGE");
    });


    $("#CaptureOtherWindow").click(function (e) {
        chrome.runtime.sendMessage({
            ShowVideoEditorInFront: "ShowVideoEditorInFront"
        }, function (response) { });
        var opkey_end_point = localStorage.getItem("Domain");

        if (opkey_end_point === null || opkey_end_point === "") {
            $.notify('User not logged in.', { position: "bottom right", className: "error" });
            return;
        }

        if ($(".item_action").hasClass('active')) {
            if ($(".item_action.active").prop('id') == 'itemUserStory' || $(".item_action.active").prop('id') == 'itemTicket') {
                let curd_data = localStorage.getItem("capture_step_data");
                if (curd_data != null && curd_data != "") {
                    curd_data = JSON.parse(curd_data);
                    if (curd_data.type == "User Story" || curd_data.type == "Ticket") {
                        let data = { persist: true, type: "CAPTURE_IMAGE" };
                        postMessage(
                            JSON.stringify(data),
                            "*"
                        );
                        return false;
                    }
                }
            }
        }
        if (IsRecordingInProgress) {
            let type = 'Image capture';
            if ($(".item_action.active").prop('id') == 'itemCaptureVideo') {
                type = 'Video recording';
            }

            $.notify(type + ' inprogress', { position: "bottom right", className: "error" });
            return false;
        }

        let manual_ruuner_sessionID = localStorage.getItem("SessionID");
        /*
        if (manual_ruuner_sessionID != null && manual_ruuner_sessionID != "") {
            $.notify('Manual run is in progress.', { position: "bottom right", className: "error" });
            return false;
        }*/

        $("#action_container").removeClass('show_action_container');

        $("#view_action_create_ticket").html('');
        $("#view_action_create_user_story").html('');

        loadDiv("CAPTUREIMGAEOFOTHERWINDOW");
        showTaskDiv("CAPTUREIMGAEOFOTHERWINDOW");
    });

    $("#CaptureFullPage").click(function (e) {
        chrome.runtime.sendMessage({
            ShowVideoEditorInFront: "ShowVideoEditorInFront"
        }, function (response) { });
        var opkey_end_point = localStorage.getItem("Domain");

        if (opkey_end_point === null || opkey_end_point === "") {
            $.notify('User not logged in.', { position: "bottom right", className: "error" });
            return;
        }

        if ($(".item_action").hasClass('active')) {
            if ($(".item_action.active").prop('id') == 'itemUserStory' || $(".item_action.active").prop('id') == 'itemTicket') {
                let curd_data = localStorage.getItem("capture_step_data");
                if (curd_data != null && curd_data != "") {
                    curd_data = JSON.parse(curd_data);
                    if (curd_data.type == "User Story" || curd_data.type == "Ticket") {
                        let data = { persist: true, type: "CAPTURE_IMAGE" };
                        postMessage(
                            JSON.stringify(data),
                            "*"
                        );
                        return false;
                    }
                }
            }
        }
        if (IsRecordingInProgress) {
            let type = 'Image capture';
            if ($(".item_action.active").prop('id') == 'itemCaptureVideo') {
                type = 'Video recording';
            }

            $.notify(type + ' inprogress', { position: "bottom right", className: "error" });
            return false;
        }

        let manual_ruuner_sessionID = localStorage.getItem("SessionID");
        /*
        if (manual_ruuner_sessionID != null && manual_ruuner_sessionID != "") {
            $.notify('Manual run is in progress.', { position: "bottom right", className: "error" });
            return false;
        }*/

        $("#action_container").removeClass('show_action_container');

        $("#view_action_create_ticket").html('');
        $("#view_action_create_user_story").html('');

        loadDiv("CAPTURE_IMAGE");
        showTaskDiv("CAPTURE_IMAGE");
    });

    $("#RecordCurrentTab").click(function (e) {
        if ($(".item_action").hasClass('active')) {
            if ($(".item_action.active").prop('id') == 'itemUserStory' || $(".item_action.active").prop('id') == 'itemTicket') {
                let curd_data = localStorage.getItem("capture_step_data");
                if (curd_data != null && curd_data != "") {
                    curd_data = JSON.parse(curd_data);
                    if (curd_data.type == "User Story" || curd_data.type == "Ticket") {
                        let data = { persist: true, type: "CAPTURE_VIDEO" };
                        postMessage(
                            JSON.stringify(data),
                            "*"
                        );
                        return false;
                    }
                }
            }
        }

        var opkey_end_point = localStorage.getItem("Domain");

        if (opkey_end_point === null || opkey_end_point === "") {
            $.notify('User not logged in.', { position: "bottom right", className: "error" });
            return;
        }
        if (IsRecordingInProgress) {
            let type = 'Image capture';
            if ($(".item_action.active").prop('id') == 'itemCaptureVideo') {
                type = 'Video recording';
            }

            $.notify(type + ' inprogress', { position: "bottom right", className: "warning" });
            chrome.runtime.sendMessage({
                ShowVideoEditorInFront: "ShowVideoEditorInFront"
            }, function (response) { });
            return false;
        }

        let manual_ruuner_sessionID = localStorage.getItem("SessionID");
        /*
        if (manual_ruuner_sessionID != null && manual_ruuner_sessionID != "") {
            $.notify('Manual run is in progress.', { position: "bottom right", className: "error" });
            return false;
        }*/

        $("#action_container").removeClass('show_action_container');

        $("#view_action_create_ticket").html('');
        $("#view_action_create_user_story").html('');

        loadDiv("CAPTURE_VIDEO_CURRENT");
        showTaskDiv("CAPTURE_VIDEO");
    });

    $("#RecordOtherTabs").click(function (e) {
        if ($(".item_action").hasClass('active')) {
            if ($(".item_action.active").prop('id') == 'itemUserStory' || $(".item_action.active").prop('id') == 'itemTicket') {
                let curd_data = localStorage.getItem("capture_step_data");
                if (curd_data != null && curd_data != "") {
                    curd_data = JSON.parse(curd_data);
                    if (curd_data.type == "User Story" || curd_data.type == "Ticket") {
                        let data = { persist: true, type: "CAPTURE_VIDEO" };
                        postMessage(
                            JSON.stringify(data),
                            "*"
                        );
                        return false;
                    }
                }
            }
        }

        var opkey_end_point = localStorage.getItem("Domain");

        if (opkey_end_point === null || opkey_end_point === "") {
            $.notify('User not logged in.', { position: "bottom right", className: "error" });
            return;
        }
        if (IsRecordingInProgress) {
            let type = 'Image capture';
            if ($(".item_action.active").prop('id') == 'itemCaptureVideo') {
                type = 'Video recording';
            }

            $.notify(type + ' inprogress', { position: "bottom right", className: "warning" });
            chrome.runtime.sendMessage({
                ShowVideoEditorInFront: "ShowVideoEditorInFront"
            }, function (response) { });
            return false;
        }

        let manual_ruuner_sessionID = localStorage.getItem("SessionID");
        /*
        if (manual_ruuner_sessionID != null && manual_ruuner_sessionID != "") {
            $.notify('Manual run is in progress.', { position: "bottom right", className: "error" });
            return false;
        }*/

        $("#action_container").removeClass('show_action_container');

        $("#view_action_create_ticket").html('');
        $("#view_action_create_user_story").html('');

        loadDiv("CAPTURE_VIDEO");
        showTaskDiv("CAPTURE_VIDEO");
    });

    $("#action_CaptureVideo").click(function () {

        debugger;
        if ($(".item_action").hasClass('active')) {
            if ($(".item_action.active").prop('id') == 'itemUserStory' || $(".item_action.active").prop('id') == 'itemTicket') {
                let curd_data = localStorage.getItem("capture_step_data");
                if (curd_data != null && curd_data != "") {
                    curd_data = JSON.parse(curd_data);
                    if (curd_data.type == "User Story" || curd_data.type == "Ticket") {
                        let data = { persist: true, type: "CAPTURE_VIDEO" };
                        postMessage(
                            JSON.stringify(data),
                            "*"
                        );
                        return false;
                    }
                }
            }
        }

        var opkey_end_point = localStorage.getItem("Domain");

        if (opkey_end_point === null || opkey_end_point === "") {
            $.notify('User not logged in.', { position: "bottom right", className: "error" });
            return;
        }
        if (IsRecordingInProgress) {
            let type = 'Image capture';
            if ($(".item_action.active").prop('id') == 'itemCaptureVideo') {
                type = 'Video recording';
            }

            $.notify(type + ' inprogress', { position: "bottom right", className: "warning" });
            chrome.runtime.sendMessage({
                ShowVideoEditorInFront: "ShowVideoEditorInFront"
            }, function (response) { });
            return false;
        }

        let manual_ruuner_sessionID = localStorage.getItem("SessionID");
        /*
        if (manual_ruuner_sessionID != null && manual_ruuner_sessionID != "") {
            $.notify('Manual run is in progress.', { position: "bottom right", className: "error" });
            return false;
        }*/

        $("#action_container").removeClass('show_action_container');

        $("#view_action_create_ticket").html('');
        $("#view_action_create_user_story").html('');

        loadDiv("CAPTURE_VIDEO");
        showTaskDiv("CAPTURE_VIDEO");
    });

    $("#action_CaptureImage").click(function () {
        debugger;
        chrome.runtime.sendMessage({
            ShowVideoEditorInFront: "ShowVideoEditorInFront"
        }, function (response) { });
        var opkey_end_point = localStorage.getItem("Domain");

        if (opkey_end_point === null || opkey_end_point === "") {
            $.notify('User not logged in.', { position: "bottom right", className: "error" });
            return;
        }

        if ($(".item_action").hasClass('active')) {
            if ($(".item_action.active").prop('id') == 'itemUserStory' || $(".item_action.active").prop('id') == 'itemTicket') {
                let curd_data = localStorage.getItem("capture_step_data");
                if (curd_data != null && curd_data != "") {
                    curd_data = JSON.parse(curd_data);
                    if (curd_data.type == "User Story" || curd_data.type == "Ticket") {
                        let data = { persist: true, type: "CAPTURE_IMAGE" };
                        postMessage(
                            JSON.stringify(data),
                            "*"
                        );
                        return false;
                    }
                }
            }
        }
        if (IsRecordingInProgress) {
            let type = 'Image capture';
            if ($(".item_action.active").prop('id') == 'itemCaptureVideo') {
                type = 'Video recording';
            }

            $.notify(type + ' inprogress', { position: "bottom right", className: "error" });
            return false;
        }

        let manual_ruuner_sessionID = localStorage.getItem("SessionID");
        /*
        if (manual_ruuner_sessionID != null && manual_ruuner_sessionID != "") {
            $.notify('Manual run is in progress.', { position: "bottom right", className: "error" });
            return false;
        }*/

        $("#action_container").removeClass('show_action_container');

        $("#view_action_create_ticket").html('');
        $("#view_action_create_user_story").html('');

        loadDiv("CAPTURE_IMAGE");
        showTaskDiv("CAPTURE_IMAGE");
    });

    $("#action_UserStory").click(function () {
        if ($(".item_action").hasClass('active')) {
            if ($(".item_action.active").prop('id') == 'itemTicket') {
                let curd_data = localStorage.getItem("capture_step_data");
                if (curd_data != null && curd_data != "") {
                    curd_data = JSON.parse(curd_data);
                    if (curd_data.type == "Ticket") {
                        let data = { persist: true, type: "USER_STORY" };
                        postMessage(
                            JSON.stringify(data),
                            "*"
                        );
                        return false;
                    }
                }
            }
        }

        if (IsRecordingInProgress) {
            let type = 'Image capture';
            if ($(".item_action.active").prop('id') == 'itemCaptureVideo') {
                type = 'Video recording';
            }

            $.notify(type + ' inprogress', { position: "bottom right", className: "warning" });
            chrome.runtime.sendMessage({
                ShowVideoEditorInFront: "ShowVideoEditorInFront"
            }, function (response) { });
            return false;
        }

        let manual_ruuner_sessionID = localStorage.getItem("SessionID");
        /*
        if (manual_ruuner_sessionID != null && manual_ruuner_sessionID != "") {
            $.notify('Manual run is in progress.', { position: "bottom right", className: "error" });
            return false;
        }*/

        chrome.runtime.sendMessage({
            ResetVideoUploadStatus: "STOPSESSION"
        }, function (response) { });

        $("#view_action_create_ticket").html('');

        loadDiv("USER_STORY");
        showTaskDiv("USER_STORY");
    });

    $("#action_Ticket").click(function () {
        if ($(".item_action").hasClass('active')) {
            if ($(".item_action.active").prop('id') == "itemUserStory") {
                let curd_data = localStorage.getItem("capture_step_data");
                if (curd_data != null && curd_data != "") {
                    curd_data = JSON.parse(curd_data);
                    if (curd_data.type == "User Story") {
                        let data = { persist: true, type: "TICKET" };
                        postMessage(
                            JSON.stringify(data),
                            "*"
                        );
                        return false;
                    }
                }
            }
        }

        if (IsRecordingInProgress) {
            let type = 'Image capture';
            if ($(".item_action.active").prop('id') == 'itemCaptureVideo') {
                type = 'Video recording';
            }

            $.notify(type + ' inprogress', { position: "bottom right", className: "warning" });
            chrome.runtime.sendMessage({
                ShowVideoEditorInFront: "ShowVideoEditorInFront"
            }, function (response) { });
            return false;
        }

        let manual_ruuner_sessionID = localStorage.getItem("SessionID");
        /*
        if (manual_ruuner_sessionID != null && manual_ruuner_sessionID != "") {
            $.notify('Manual run is in progress.', { position: "bottom right", className: "error" });
            return false;
        }*/

        chrome.runtime.sendMessage({
            ResetVideoUploadStatus: "STOPSESSION"
        }, function (response) { });

        $("#view_action_create_user_story").html('');

        loadDiv("TICKET");
        showTaskDiv("TICKET");
    });

    $("#action_Project").click(function () {
        loadDiv("PROJECT_VIEW");
        showTaskDiv("PROJECT_VIEW");
    });

}

function loadAllDivs() {
    // loadDiv("USER_STORY");
}

function loadDiv(divtype) {
    debugger;
    if (divtype == "CAPTURE_VIDEO" || divtype == "CAPTURE_VIDEO_CURRENT") {

        chrome.runtime.sendMessage({
            ResetVideoUploadStatus: "ResetVideoUploadStatus"
        }, function (response) { });

        LoadVideoEditor(divtype);
        setTimeout(() => {
            check_for_response();
        }, 1000);
        setTimeout(() => {
            let data = { action: "Discard_docker" };
            window.postMessage(JSON.stringify(data), "*");
        }, 1000);
    }


    if (divtype == "CAPTURE_IMAGE" || divtype == "CAPTURE_IMAGE_CURRENT" || divtype == "CAPTUREIMGAEOFOTHERWINDOW") {

        chrome.runtime.sendMessage({
            ResetVideoUploadStatus: "ResetVideoUploadStatus"
        }, function (response) { });
        var hideDocker = { action: "hide_docker" };
        window.postMessage(JSON.stringify(hideDocker), "*");
        LoadImageEditor(divtype);

        setTimeout(() => {
            var showDocker = { action: "close_docker" };
            window.postMessage(JSON.stringify(showDocker), "*");
        }, 1000);

        setTimeout(() => {
            var showDocker = { action: "show_docker" };
            window.postMessage(JSON.stringify(showDocker), "*");
        }, 2000);
        setTimeout(() => {
            let data = { action: "Discard_docker" };
            window.postMessage(JSON.stringify(data), "*");
        }, 1000);
        setTimeout(() => {
            check_for_response();
        }, 1000);
    }
    if (divtype == "USER_STORY") {

        chrome.runtime.sendMessage({ GetUserStoryPage: "GetUserStoryPage" },
            function (response) {
                if (response != null) {
                    var contentHolder = document.getElementById("view_action_create_user_story");
                    var frame1 = contentHolder.getElementsByTagName("iframe")[0];
                    if (frame1 != null) {
                        //  frame1.src = response;
                        return;
                    }
                    var contentFrame = document.createElement("iframe");

                    contentFrame.src = response;
                    contentFrame.id = "userstoryframe";
                    contentFrame.style = "width:100%;height:100%;border:0;"
                    contentHolder.appendChild(contentFrame);
                }
            }
        );

    }
    if (divtype == "TICKET") {

        chrome.runtime.sendMessage({ GetTicketPage: "GetTicketPage" },
            function (response) {
                if (response != null) {
                    var contentHolder = document.getElementById("view_action_create_ticket");
                    var frame1 = contentHolder.getElementsByTagName("iframe")[0];
                    if (frame1 != null) {
                        // frame1.src = response;
                        return;
                    }
                    var contentFrame = document.createElement("iframe");

                    contentFrame.src = response;
                    contentFrame.id = "qlmticketframe";
                    contentFrame.style = "width:100%;height:100%;border:0;"
                    contentHolder.appendChild(contentFrame);
                }
            }
        );
    }
    if (divtype == "PROJECT_VIEW") {

    }
}

function showVideoEditor() {
    if ($("#div_recordVideo").is(":visible") == true) {
        return;
    }
    initVideoEditorUIs();
    $("#div_recordVideo").show();
}

function hideVideoEditor() {
    if ($("#div_recordVideo").is(":visible") == false) {
        return;
    }
    resetVideoEditorUIs();
    $("#div_recordVideo").hide();
}

function videoEditorToggleThread() {
    chrome.runtime.onMessage
        .addListener(function (request, sender, sendResponse) {
            if (request != null && request != "") {
                if (request == "STOPRECORDING") {
                    stopOpkeyBroadcast();
                }
                if (request == "PAUSERECORDING") {
                    pauseRecordngInUiOnly();
                }
                if (request == "RESUMERECORDING") {
                    resumeRecordngInUiOnly();
                }
                if(request=="DISCARDVIDEOEDITOR"){
                    hideVideoEditor();
                }
            }
        });

    window.setInterval(function () {
        var videoEditorStatus = localStorage.getItem("VideoEditorStatus");
        if (videoEditorStatus != null) {
            if (videoEditorStatus == "OPENED") {
                showVideoEditor();
            }

            if (videoEditorStatus == "CLOSED") {
                hideVideoEditor();
            }
            if (videoEditorStatus == "STOPPED") {
                if ($("#div_recordVideo").is(":visible") == true) {
                    return;
                }
                else{
                    $("#div_recordVideo").show();
                    initVideoEditorUIs();
                }
                stopOpkeyBroadcast();
            }
        }
    }, 1000);
}


function LoadVideoEditor(divType) {
    chrome.runtime.sendMessage({
        ResetVideoUploadStatus: "ResetVideoUploadStatus"
    }, function (response) { });

    var json_addon = {
        "url": localStorage.getItem("OPKEY_DOMAIN_NAME"),
        "Result_ID": '',
        "SessionID": '',
        "tc name": '',
        "utility": 'qlm_video_IssueType'
    };

    if (divType == "CAPTURE_VIDEO_CURRENT") {
        json_addon["captureMode"] = "CaptureCurrentWithDisplayModeCurrentTab";
    }
    else {
        json_addon["captureMode"] = "StartVideoRecording";
    }
    localStorage.removeItem("QLM_Response");
    localStorage.removeItem("OpkeyTestRunnerSnapData");
    localStorage.setItem("OpkeyTestRunnerSnapData", JSON.stringify(json_addon));

    let local_data = {
        GridRow: null,
        GridID: "",
        type: null,
        Issue_data: null,
    }

    localStorage.setItem("capture_step_data", JSON.stringify(local_data));
}

function LoadImageEditor(divType) {
    debugger
    chrome.runtime.sendMessage({
        ResetVideoUploadStatus: "ResetVideoUploadStatus"
    }, function (response) { });

    var json_addon = {
        "url": localStorage.getItem("OPKEY_DOMAIN_NAME"),
        "Result_ID": '',
        "SessionID": '',
        "tc name": '',
        "utility": 'qlm_snapshot_IssueType'
    };
    if (divType == "CAPTURE_IMAGE_CURRENT") {
        json_addon["captureMode"] = "CAPTUREIMGAEVISIBLEAREA";
    }
    else if(divType=="CAPTUREIMGAEOFOTHERWINDOW"){
        json_addon["captureMode"] = "CAPTUREIMGAEOFOTHERWINDOW";
    }
    else {
        json_addon["captureMode"] = "CAPTUREIMGAEFULLPAGE";
    }
    localStorage.removeItem("QLM_Response");
    localStorage.removeItem("OpkeyTestRunnerSnapData");
    localStorage.setItem("OpkeyTestRunnerSnapData", JSON.stringify(json_addon));

    let local_data = {
        GridRow: null,
        GridID: "",
        type: null,
        Issue_data: null,
    }

    localStorage.setItem("capture_step_data", JSON.stringify(local_data));
}

var addon_time_out = null;
var IsRecordingInProgress = false;

function check_for_response() {
    chrome.runtime.sendMessage({
        GetVideoUploadStatus: "GetVideoUploadStatus"
    }, function (response) {
        if (response == "COMPLETED") {
            IsRecordingInProgress = false;
            // loadingStop("body","");
            clearTimeout(addon_time_out);
            //$("#snap_loader").hide();
            let res = localStorage.getItem("QLM_Response");
            if (res != null && res != "") {

                let qlm_response = JSON.parse(res);
                let type = qlm_response["IssueType"];
                delete qlm_response["IssueType"];
                localStorage.setItem("QLM_Response", JSON.stringify(qlm_response));
                $("#action_container").addClass('show_action_container');
                $(".item_action").removeClass("active");
                if (type == "Ticket") {
                    $("#view_action_create_ticket").show();
                    $("#itemTicket").addClass('active');
                    loadDiv("TICKET");
                }
                else {
                    $("#view_action_create_user_story").show();
                    $("#itemUserStory").addClass('active');
                    loadDiv("USER_STORY");
                }
            }
        }
        else if (response == "") {
            IsRecordingInProgress = false;
        }
        else if (response.indexOf("UPLOADATTACHMENTEORROR_") > -1) {
            IsRecordingInProgress = false;

            clearTimeout(addon_time_out);
            $.notify(response.split("_")[1], { position: "bottom right", className: "error" });
        }
        else if (response == "FETCHING") {
            IsRecordingInProgress = false;
            clearTimeout(addon_time_out);
            addon_time_out = setTimeout(function () {
                check_for_response();
            }, 800);
        }
        else if (response == "INCOMPLETE") {
            IsRecordingInProgress = false;
            chrome.runtime.sendMessage({
                ResetVideoUploadStatus: "ResetVideoUploadStatus"
            }, function (response) { });
        }
        else if (response == "STARTINGCAPTURING") {
            IsRecordingInProgress = false;
            clearTimeout(addon_time_out);
            addon_time_out = setTimeout(function () {
                check_for_response();
            }, 800);
        }
        else {
            IsRecordingInProgress = true;
            clearTimeout(addon_time_out);
            addon_time_out = setTimeout(function () {
                check_for_response();
            }, 800);
        }
    });
}

var lastDiscarddCalled = false;
function listen_broadcast_message() {

    window.addEventListener(
        "message",
        (e) => {

            if (document.querySelector("iframe") != null && document.querySelector('iframe').contentWindow != null) {
                if (e.origin !== document.querySelector('iframe').contentWindow.origin) {
                    return;
                }
            }

            let event_data = JSON.parse(e.data);
            if (event_data.action != null && event_data.action != "Pin_docker") {
                lastDiscarddCalled = false;
            }
            if (event_data.success == "Yes") {
                chrome.runtime.sendMessage({
                    ResetVideoUploadStatus: "STOPSESSION"
                }, function (response) { });

                localStorage.removeItem('capture_step_data');
                $("#view_action_create_ticket").html('');
                $("#view_action_create_user_story").html('');
                loadDiv(event_data.type);
                showTaskDiv(event_data.type);
            }
            else if (event_data.action == "close_docker") {
                $("#action_container").removeClass('show_action_container');
            }
            else if (event_data.action == "show_docker") {
                $("#mimimizedRecorderCircle").show();
            }
            else if (event_data.action == "hide_docker") {
                $("#mimimizedRecorderCircle").hide();
            }
            else if (event_data.action == "Pin_docker") {
                if (lastDiscarddCalled == true) {
                    lastDiscarddCalled = false;
                    return;
                }
                $("#action_container").addClass('show_action_container');
            }
            else if (event_data.action == "notifier") {
                $.notify(event_data.message, { position: "bottom right", className: event_data.type });
            }
            else if (event_data.action == "active_story") {
                $(".item_action").removeClass('active');
                $("#itemUserStory").addClass('active');
            }
            else if (event_data.action == "active_ticket") {
                $(".item_action").removeClass('active');
                $("#itemTicket").addClass('active');
            }
            else if (event_data.action == "Discard_docker") {
                lastDiscarddCalled = true;
                $("#view_action_create_ticket").html('');
                $("#view_action_create_user_story").html('');
                localStorage.removeItem("capture_step_data");
                $("#action_container").removeClass('show_action_container');
                chrome.runtime.sendMessage({
                    ResetVideoUploadStatus: "STOPSESSION"
                }, function (response) { });
                showTaskDiv("DISCARD");
            }

        },
        false
    );
}

function check_previous_state() {
    let curd_data = localStorage.getItem("capture_step_data");
    if (curd_data != null) {
        curd_data = JSON.parse(curd_data);
        if (curd_data.type != null) {
            if (curd_data.type == "Ticket") {
                //$("#action_container").addClass('show_action_container');
                loadDiv("TICKET");
                showTaskDiv("TICKET");
                $("#action_container").removeClass('show_action_container');
            }
            else if (curd_data.type == "User Story") {
                //$("#action_container").addClass('show_action_container');
                loadDiv("USER_STORY");
                showTaskDiv("USER_STORY");
                $("#action_container").removeClass('show_action_container');
            }
        }
        else if (curd_data.Issue_data != null) {
            if (curd_data.Issue_data.IssueType == "Ticket") {
                //$("#action_container").addClass('show_action_container');
                loadDiv("TICKET");
                showTaskDiv("TICKET");
                $("#action_container").removeClass('show_action_container');
            }
            else if (curd_data.Issue_data.IssueType == "User Story") {
                //$("#action_container").addClass('show_action_container');
                loadDiv("USER_STORY");
                showTaskDiv("USER_STORY");
                $("#action_container").removeClass('show_action_container');
            }
        }
    }
}


$(function () {
    loadAllDivs();
    addAllOPkeydivEvents();
    listen_broadcast_message();
    setTimeout(() => {
        check_for_response();
    }, 1000);
    check_previous_state();
    $("#mimimizedRecorderCircle").mouseleave(function () {
        mainDockerDivNotClickable();
    });

    $("#action_container").mouseleave(function () {
        window.setTimeout(function () {
            mainDockerDivNotClickable();
        }, 300);
    });



    $("#view_action_create_user_story").mouseleave(function () {
        debugger
        //  mainDockerDivNotClickable();
    });

    $("#view_action_create_ticket").mouseleave(function () {
        debugger
        //mainDockerDivNotClickable();
    });

    $(document).mouseup(function (e) {
        var container = $("#mimimizedRecorderCircle");
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $("#action_container").removeClass('show_action_container');
        }
    });

    $(".cancel_btn_span").on('click', function (e) {
        debugger;
        $("#view_action_create_ticket").html('');
        $("#view_action_create_user_story").html('');
        localStorage.removeItem("capture_step_data");
        $("#action_container").removeClass('show_action_container');
        chrome.runtime.sendMessage({
            ResetVideoUploadStatus: "STOPSESSION"
        }, function (response) { });
        showTaskDiv("DISCARD");
    });

    $(".btn_logo_action").on('keydown', function (e) {
        //console.log('btn_logo_action event',e);
        if (e.key == 'Enter') {
            $("#action_container").addClass('show_action_container');
        }
    });

    Mousetrap.bind(['esc'], function (e) {
        $("#view_action_create_ticket").html('');
        $("#view_action_create_user_story").html('');
        localStorage.removeItem("capture_step_data");
        chrome.runtime.sendMessage({
            ResetVideoUploadStatus: "STOPSESSION"
        }, function (response) { });
        showTaskDiv("DISCARD");
        return false;
    });

});

opkey_sendDivCoordinates();
getDivPoperties();
videoEditorToggleThread();