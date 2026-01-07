var opkey_renderedPageoUT = null;
var isSnapshotTaken = false;
var divRectClientBounds = null;
var pauseDockerNotClicable = false;
var recorderAddThread = -1;
var dockerDivClickable = false;
//alert("Check 123")
function opkey_autofladdoninstalled() {
    return true;
}

function addOpKeyRecorderDocker() {
    try {
        if (window.self != window.top) {
            return;
        }

        /*
        var dockerEnabled = sessionStorage.getItem("OPKEY_QLMMANUALDOCKER_ENABLED");
        if (dockerEnabled == null) {
            return;
        }

        if (dockerEnabled == "false") {
            hideDockerShadow();
            return;
        }
*/


        if (document.getElementById("opkey-recorderdiv-shadow") != null) {
            return;
        }

        var mainBody = document.body;
        if (mainBody == null) {
            return
        }

        chrome.runtime.sendMessage({ GetAutoflUiUrl: "GetAutoflUiUrl" },
            function (response) {
                if (response != null) {
                    var recorder_dock = document.createElement("opkey-recorderdiv");
                    recorder_dock.id = "opkey-recorderdiv-shadow"
                    var recorderdock_shadow = recorder_dock.attachShadow({
                        mode: 'open'
                    });
                    mainBody.prepend(recorder_dock);


                    var recorderdock_iframe = document.createElement("iframe");
                    recorderdock_iframe.setAttribute('allowFullScreen', '')
                    recorderdock_iframe.src = response
                    recorderdock_iframe.id = "opkey_recorder_iframe";
                    recorderdock_iframe.setAttribute("divClickAble", "false");
                    dockerDivClickable = false;
               //     recorderdock_iframe.style = "position: fixed; inset: 0px; width: 100%; height: 100%; border: none; z-index: 2147483647; pointer-events: none; opacity: 1;"
                
               recorderdock_iframe.style = "position: fixed; inset: 0px; width: 100%; height: 100%; border: none; z-index: 2147483647; opacity: 1;"
               recorderdock_shadow.appendChild(recorderdock_iframe);
                }

            });

    } catch (e) { }
}
var isMouseDown = false;

function mainDockerDivClickable() {
    if (dockerDivClickable == false) {
        try {
            var recorderDiv = document.getElementById('opkey-recorderdiv-shadow');
            if (recorderDiv != null) {
                var elshadowRoot = recorderDiv.shadowRoot;
                var opkeyIframe = elshadowRoot.getElementById('opkey_recorder_iframe');
                var divClickAble = opkeyIframe.getAttribute("divClickAble");
                if (divClickAble == "false") {
                    //  console.log("mainDockerDivClickable");
                    dockerDivClickable = true;
                    opkeyIframe.setAttribute("divClickAble", "true");
                    opkeyIframe.style = 'position: fixed; inset: 0px; width: 100%; height: 100%; border: none; z-index: 2147483647; opacity: 1;'
                }
            }
        } catch (e) { }
    }
}

var opkey_mediaRecorder = null;
var opkey_video_stream = null;
function opkey_addWindowEventListner() {
    window.addEventListener(
        "message",
        (e) => {
            try {
                //  console.log("Neon Event Data "+e.data);
                var event_data = JSON.parse(e.data);
                if (event_data != null && event_data["action"] != null) {
                    if (event_data["action"] == "setDivLocation") {
                        divRectClientBounds = event_data["data"];
                    }
                    if (event_data["action"] == "addFrameStyle") {
                        mainDockerDivNotClickable();
                    }
                    if (event_data["action"] == "removeFrameStyle") {
                        mainDockerDivClickable()
                    }

                    if (event_data["action"] == "pauseDockerNotCliackable") {
                        pauseDockerNotClicable = true;
                    }


                    if (event_data["action"] == "resumeDockerNotCliackable") {
                        pauseDockerNotClicable = false;
                    }
                }
            } catch (e) { }
        });
}


function mainDockerDivNotClickable() {
    if (dockerDivClickable == true) {
        try {
            var recorderDiv = document.getElementById('opkey-recorderdiv-shadow');
            if (recorderDiv != null) {
                var elshadowRoot = recorderDiv.shadowRoot;
                var opkeyIframe = elshadowRoot.getElementById('opkey_recorder_iframe');
                var divClickAble = opkeyIframe.getAttribute("divClickAble");
                if (divClickAble == "true") {
                    //      console.log("mainDockerDivNotClickable");
                    dockerDivClickable = false;
                    opkeyIframe.setAttribute("divClickAble", "false");
                    opkeyIframe.style = 'position: fixed; inset: 0px; width: 100%; height: 100%; border: none; z-index: 2147483647; pointer-events: none; opacity: 1;'
                }
            }
        } catch (e) { }
    }
}


document.addEventListener("mousemove", function (e) {
    try {
        var isInsideDiv = false;
        var clientX = e.clientX;
        var clientY = e.clientY;
        if (divRectClientBounds != null) {

            var opkey_div_clientx = divRectClientBounds.left;
            var opkey_div_clienty = divRectClientBounds.top;
            var opkey_div_clientwidth = divRectClientBounds.width;
            var opkey_div_clientheight = divRectClientBounds.height;

            if (clientX > opkey_div_clientx && clientX < (opkey_div_clientx + opkey_div_clientwidth)) {
                if (clientY > opkey_div_clienty && clientY < (opkey_div_clienty + opkey_div_clientheight)) {
                    isInsideDiv = true;
                }
            }

            if (isInsideDiv == true) {
                mainDockerDivClickable();
            }

            if (isInsideDiv == false) {
                if (pauseDockerNotClicable == false) {
                    mainDockerDivNotClickable();
                }
            }
        }


    } catch (e) { }
}, false);


document.addEventListener("mouseup", function (e) {
    // console.log("Called mouseup");
    try {
        let data = { action: "close_docker" };
        chrome.runtime.sendMessage({
            Window_PostMessage: JSON.stringify(data)
        }, function (response) {
        });
    } catch (e) { }
}, false);

document.addEventListener("click", function (e) {
    // console.log("Called mouseup");
    try {
        let data = { action: "close_docker" };
        chrome.runtime.sendMessage({
            Window_PostMessage: JSON.stringify(data)
        }, function (response) {
        });
    } catch (e) { }
}, false);


function opkey_startDockerThreads() {
    if (recorderAddThread > -1) {
        window.clearInterval(recorderAddThread);
        recorderAddThread = -1;
    }
    recorderAddThread = window.setInterval(function () {
        try {
            addOpKeyRecorderDocker();
        } catch (e) {
            window.clearInterval(recorderAddThread);
        }
    }, 1000);

    // checkQlmAddonInstalled();
}

function checkQlmAddonInstalled() {
    if (window.self != window.top) {
        return;
    }
    window.clearInterval(installCheckThread);
    var installCheckThread = window.setInterval(function () {
        try {
            chrome.runtime.sendMessage({
                GetAddonInstalled: "GetAddonInstalled"
            }, function (response) {
            });
        } catch (e) {
            sessionStorage.removeItem("OPKEY_QLMMANUALDOCKER_ENABLED");
            hideDockerShadow();
            window.clearInterval(installCheckThread);
        }

    }, 2000);
}

function showDockerShadow() {
    var recorderDivShadow = document.getElementById("opkey-recorderdiv-shadow");
    if (recorderDivShadow != null) {
        var elshadowRoot = recorderDivShadow.shadowRoot;
        var opkeyIframe = elshadowRoot.getElementById('opkey_recorder_iframe');
        opkeyIframe.style.display = "block";
    }
}

function hideDockerShadow() {

    var recorderDivLists = document.getElementsByTagName("opkey-recorderdiv");
    for (let i = 0; i < recorderDivLists.length; i++) {
        recorderDivLists[i].remove();
    }
}

opkey_startDockerThreads();
opkey_addWindowEventListner();