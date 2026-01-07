var shared = new Object();
const SCROLL_DELAY = 500;
var opkey_mediaRecorder = null;
var opkey_image_stream = null;
function opkey_qlmVideoEditorInjected() {
    return true;
}

function opkey_attachVideoEditorListener() {
    chrome.runtime.onMessage
        .addListener(function (request, sender, sendResponse) {
            if (request) {
                if (request == "StartVideoRecordingCurrentTab") {
                    debugger
                    navigator.mediaDevices.getDisplayMedia({ video: true, preferCurrentTab: true }).then(stream => {
                        opkey_send_videoUploadStatus("INPROGRESS");
                        opkey_send_videoRecorderEditorStatus("INPROGRESS");
                        opkey_video_stream = stream;
                        chrome.runtime.sendMessage({
                            LoadVideoEditorDockOrWindow: "LoadVideoEditorDockOrWindow"
                        }, function (response) { });
                        opkey_video_stream.getVideoTracks()[0].onended = function () {
                            opkey_send_videoRecorderEditorStatus("SHARINGSTOPPED");
                        };
                        var options = {
                            videoBitsPerSecond: 600000,
                            mimeType: 'video/webm;codecs=h264'
                        };
                        opkey_mediaRecorder = new MediaRecorder(opkey_video_stream, options);
                        opkey_mediaRecorder.ondataavailable = opkey_handleVideoData;
                        opkey_mediaRecorder.start();
                    }).catch(err => {
                        opkey_send_videoUploadStatus("INCOMPLETE");
                    });
                    sendResponse("");
                }
                if (request == "StartVideoRecording") {
                    navigator.mediaDevices.getDisplayMedia({ video: true }).then(stream => {
                        opkey_send_videoUploadStatus("INPROGRESS");
                        opkey_send_videoRecorderEditorStatus("INPROGRESS");
                        opkey_video_stream = stream;
                        chrome.runtime.sendMessage({
                            LoadVideoEditorDockOrWindow: "LoadVideoEditorDockOrWindow"
                        }, function (response) { });
                        opkey_video_stream.getVideoTracks()[0].onended = function () {
                            opkey_send_videoRecorderEditorStatus("SHARINGSTOPPED");
                        };
                        var options = {
                            videoBitsPerSecond: 600000,
                            mimeType: 'video/webm;codecs=h264'
                        };
                        opkey_mediaRecorder = new MediaRecorder(opkey_video_stream, options);
                        opkey_mediaRecorder.ondataavailable = opkey_handleVideoData;
                        opkey_mediaRecorder.start();
                    }).catch(err => {
                        opkey_send_videoUploadStatus("INCOMPLETE");
                    });
                    sendResponse("");
                }
                if (request == "StopVideoRecording") {
                    try {
                        if (opkey_video_stream != null) {
                            opkey_video_stream.getTracks()[0].stop();
                        }
                        if (opkey_mediaRecorder != null) {
                            opkey_mediaRecorder.stop();
                        }
                    } catch (e) { }
                    sendResponse("");
                }

                if (request == "PAUSERECORDING") {
                    if (opkey_mediaRecorder != null) {
                        opkey_mediaRecorder.pause();
                    }
                }

                if (request == "RESUMERECORDING") {
                    if (opkey_mediaRecorder != null) {
                        opkey_mediaRecorder.resume();
                    }
                }

                if (request.action != null && request.action == "screenshotScroll") {
                    shared = request.shared;
                    screenshotScroll(request.shared);
                }

                if (request.action != null && request.action == "screenshotBegin") {
                    shared = request.shared;
                    screenshotBegin(request.shared);
                }
                debugger
                if (request.action != null && request.action == "videorecorder_navigator_mediaDevices_getUserMedia") {
                    (async () => {
                        var stream = await videorecorder_navigator_mediaDevices_getUserMedia(request.data.streamId);
                        sendResponse(stream);
                    })();
                }

                if (request.action != null && request.action == "image_stop_stream") {
                    (async () => {
                        var stream = await image_stop_stream();
                        sendResponse(stream);
                    })();
                }


            }

            return true;
        });
}

async function image_stop_stream() {
    return new Promise(function (resolve, reject) {
        if (opkey_image_stream != null) {
            opkey_image_stream.getTracks()[0].stop();
        }

        resolve("Done");
    });

}

async function videorecorder_navigator_mediaDevices_getUserMedia(streamId) {

    return new Promise(function (resolve, reject) {


        navigator.mediaDevices.getUserMedia({
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: streamId,
                }
            }
        }).then(stream => {
            opkey_image_stream = stream;
            setTimeout(function () {


                //         chrome.system.display.getInfo(function (displayInfo) {
                //    var _bounds = displayInfo[0].bounds;
                var _width = 1024;
                var _height = 768;
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
                    image_stop_stream();
                    resolve(image);

                }, false);
                video.srcObject = opkey_image_stream;
                video.play();
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0);

                //      });
            }, 600);
        });

    });
}

function opkey_send_videoUploadStatus(_status) {
    chrome.runtime.sendMessage({
        SetVideoUploadStatus: _status
    }, function (response) { });
}

function opkey_send_videoRecorderEditorStatus(_status) {
    chrome.runtime.sendMessage({
        SetVideoRecorderEditorStatus: _status
    }, function (response) { });
}

/* CxIgnore: Cordova_File_Disclosure
   Reason: Not a Cordova context—input is a validated MediaRecorder Blob from Chrome, not a file path. */
function opkey_handleVideoData(event) {
    const file = event.data;

    // Quick size check
    if (!file || file.size === 0) return;

    // 1) Must be a Blob/File
    if (!(file instanceof Blob || file instanceof File)) {
        console.warn('Not a Blob/File:', file);
        return;
    }

    //  Added type video/x-matroska;codecs=avc1 bcz new 
    // Chromium versions may fallback to Matroska for 
    // H264 when WebM isn’t supported.
    const allowed = ['video/webm', 'video/mp4', 'video/ogg','video/x-matroska;codecs=avc1'];
    if (!allowed.includes(file.type)) {
        console.warn('Unsupported video type:', file.type);
        return;
    }

    // 3) Enforce max size (e.g. 50 MiB)
    const MAX_BYTES = 50 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
        console.warn('Video blob too large:', file.size);
        return;
    }

    // Signal that processing will begin
    chrome.runtime.sendMessage({ SetVideoProcessingStatus: 'INPROGRESS' }, () => { });

    // 4) Read the blob as base-64 DataURL
    const reader = new FileReader();

    reader.onerror = () => {
        console.error('FileReader error:', reader.error);
        chrome.runtime.sendMessage({ VideoProcessingError: reader.error }, () => { });
    };

    reader.onloadend = () => {
        const base64String = reader.result;
        chrome.runtime.sendMessage({ SendVideoBlobData: base64String }, () => { });
    };

    reader.readAsDataURL(file);
}



var H = 18;
function _(e) {
    if (window.DOMMatrix || window.WebKitCSSMatrix) {
        var t = (e = window.getComputedStyle(e)).transform || e.webkitTransform;
        return window.DOMMatrix ? new window.DOMMatrix(t) : new window.WebKitCSSMatrix(t)
    }
}

function f(e, t) {
    for (var n = "boolean" == typeof t ? t : b(e), o = e.getBoundingClientRect(), i = o.width, a = o.height, r = 0, s = 0, l = e; l;) {
        r += isNaN(l.offsetLeft) ? 0 : l.offsetLeft, l === document.body ? s += l.getBoundingClientRect().top + window.scrollY : s += isNaN(l.offsetTop) ? 0 : l.offsetTop;
        var d = _(l);
        d && (r += d.m41, s += d.m42), l = l.offsetParent
    }
    var c, p, h = {
        left: r,
        top: s,
        width: i,
        height: a
    };
    if (n) {
        var u = (c = e, {
            left: y(p = window.getComputedStyle(c), ["borderLeftWidth", "paddingLeft"]),
            right: y(p, ["borderRightWidth", "paddingRight"]),
            top: y(p, ["paddingTop", "borderTopWidth"]),
            bottom: y(p, ["paddingBottom", "borderBottomWidth"])
        });
        h.box = u, h.left += u.left, h.top += u.top, h.width -= u.left + u.right, h.height -= u.top + u.bottom
    }
    return h
}


function b(e) {
    return !!e && new Set(["iframe", "frame"]).has(e.tagName.toLowerCase)
}

function opkey_getFixedStickyEles() {
    var t = {
        fixed: [],
        sticky: [],
        fixedBg: [],
        fixedHeader: [],
        fixedBottom: []
    },
        n = !1;
    var o = document.body;
    if (!o) return t;
    for (var i, a = document.createNodeIterator(o, NodeFilter.SHOW_ELEMENT, null, !1); i = a.nextNode();)
        if (i !== o) {
            var r = window.getComputedStyle(i),
                s = r.position;
            if ("sticky" === s) t.sticky.push(i);
            else if ("fixed" === s) {
                var l = f(i),
                    d = window.innerHeight - l.top - 20;
                if (l.top + l.height <= 0 && l.height > 0 || l.left + l.width <= 0 && l.width > 0 || l.top > window.innerHeight && l.height > 0 || l.left >= window.innerWidth - H && l.width > 0) continue;
                if (l.top < 20 && l.height < d && l.top >= 0 && i.offsetHeight < 2 * window.innerHeight / 3) t.fixedHeader.push(i);
                else if (l.height > 0 && l.height < 350 && l.top + l.height >= window.innerHeight - 20 && "hidden" !== r.visibility) t.fixedBottom.push(i);
                else {
                    if (l.height >= window.innerHeight && l.width >= 2 * window.innerWidth / 3 && (l.width !== window.innerWidth || i.scrollHeight > window.innerHeight)) continue;
                    t.fixed.push(i)
                }
            }
            "fixed" === r.backgroundAttachment && t.fixedBg.push(i)
        }
    console.log(t);
    return t;
}

var opkey_snapshotDivs_headers = [];
var opkey_snapshotDivs_footers = [];
var opkey_styledElement = [];
function hideAllDivs() {
    if (true) {
        return;
    }
    var stickyDivs = opkey_getFixedStickyEles();
    if (stickyDivs.fixedHeader.length > 0) {
        for (var fh = 0; fh < stickyDivs.fixedHeader.length; fh++) {
            var headerElement = stickyDivs.fixedHeader[fh];
            if (opkey_styledElement.indexOf(headerElement) > -1) {
                continue;
            }
            opkey_styledElement.push(headerElement);
            var obj1 = new Object();
            obj1.opkeyElement = headerElement;
            obj1.laststyle = headerElement.style;
            opkey_snapshotDivs_headers.push(obj1);
            /*
           position: absolute !important; transition: none 0s ease 0s !important; right: 0px !important; height: 96px !important; top: 0px !important; width: 1366px !important; max-width: 1366px !important; max-height: 96px !important;
          */
            var _rect = headerElement.getBoundingClientRect();
            headerElement.style.position = "absolute";
            headerElement.style.transition = "none 0s ease 0s !important";
            headerElement.style.right = "0px !important";
            headerElement.style.height = _rect.height + "px !important";
            headerElement.style["max-height"] = _rect.height + "px !important";
            headerElement.style.top = "0px !important";
            if (_rect.width > window.innerWidth) {
                headerElement.style.width = window.innerWidth + "px !important";
                headerElement.style["max-width"] = window.innerWidth + "px !important";
            }
            else {
                headerElement.style.width = _rect.width + "px !important";
                headerElement.style["max-width"] = _rect.width + "px !important";
            }
        }
    }

    if (stickyDivs.sticky.length > 0) {
        for (var fh = 0; fh < stickyDivs.sticky.length; fh++) {
            var headerElement = stickyDivs.sticky[fh];
            if (opkey_styledElement.indexOf(headerElement) > -1) {
                continue;
            }
            opkey_styledElement.push(headerElement);
            var obj1 = new Object();
            obj1.opkeyElement = headerElement;
            obj1.laststyle = headerElement.style;
            opkey_snapshotDivs_headers.push(obj1);
            /*
           position: absolute !important; transition: none 0s ease 0s !important; right: 0px !important; height: 96px !important; top: 0px !important; width: 1366px !important; max-width: 1366px !important; max-height: 96px !important;
          */
            var _rect = headerElement.getBoundingClientRect();
            headerElement.style.position = "absolute";
            headerElement.style.transition = "none 0s ease 0s !important";
            headerElement.style.right = "0px !important";
            headerElement.style.height = _rect.height + "px !important";
            headerElement.style["max-height"] = _rect.height + "px !important";
            headerElement.style.top = "0px !important";
            if (_rect.width > window.innerWidth) {
                headerElement.style.width = window.innerWidth + "px !important";
                headerElement.style["max-width"] = window.innerWidth + "px !important";
            }
            else {
                headerElement.style.width = _rect.width + "px !important";
                headerElement.style["max-width"] = _rect.width + "px !important";
            }
        }
    }

    if (stickyDivs.fixed.length > 0) {
        for (var fh1 = 0; fh1 < stickyDivs.fixed.length; fh1++) {
            var headerElement = stickyDivs.fixed[fh1];
            if (opkey_styledElement.indexOf(headerElement) > -1) {
                continue;
            }
            opkey_styledElement.push(headerElement);
            var obj1 = new Object();
            obj1.opkeyElement = headerElement;
            obj1.laststyle = headerElement.style;
            opkey_snapshotDivs_headers.push(obj1);
            /*
           position: absolute !important; transition: none 0s ease 0s !important; right: 0px !important; height: 96px !important; top: 0px !important; width: 1366px !important; max-width: 1366px !important; max-height: 96px !important;
          */
            var _rect = headerElement.getBoundingClientRect();
            headerElement.style.position = "absolute";
            headerElement.style.transition = "none 0s ease 0s !important";
            headerElement.style.right = "0px !important";
            headerElement.style.height = _rect.height + "px !important";
            headerElement.style["max-height"] = _rect.height + "px !important";
            headerElement.style.top = "0px !important";
            if (_rect.width > window.innerWidth) {
                headerElement.style.width = window.innerWidth + "px !important";
                headerElement.style["max-width"] = window.innerWidth + "px !important";
            }
            else {
                headerElement.style.width = _rect.width + "px !important";
                headerElement.style["max-width"] = _rect.width + "px !important";
            }
        }
    }

    if (stickyDivs.fixedBottom.length > 0) {
        for (var fb = 0; fb < stickyDivs.fixedBottom.length; fb++) {
            var footerElement = stickyDivs.fixedBottom[fb];
            var obj1 = new Object();
            obj1.opkeyElement = footerElement;
            obj1.laststyle = footerElement.style;
            opkey_snapshotDivs_footers.push(obj1);
            footerElement.style.display = "none";
        }
    }
}

function showAllDivs() {

    if (true) {
        return;
    }
    for (var j = 0; j < opkey_snapshotDivs_headers.length; j++) {
        var _obj2 = opkey_snapshotDivs_headers[j];
        var _element = _obj2.opkeyElement;
        _element.style = _obj2.laststyle;
    }
    for (var j1 = 0; j1 < opkey_snapshotDivs_footers.length; j1++) {
        var _obj2 = opkey_snapshotDivs_footers[j1];
        var _element = _obj2.opkeyElement;
        _element.style = _obj2.laststyle;
    }
}

var count = 0;

function screenshotBegin(shared) {
    // Identify which part of the DOM is "scrolling", and store the previous position
    hideAllDivs();
    try {
        document.querySelector('.div_wright_mgs').style.display = 'none';
        const element = document.querySelector('.wilfred_header_main + .wilfred_main_page .wilfred_main_page_height');
        if (element) {
            element.style.setProperty('height', '100vh', 'important');
        }
    } catch (error) { }
    var scrollNode = document.querySelector("main.scrollable") || document.querySelector("#div-wilfred") || document.scrollingElement || document.documentElement;
    

    if (scrollNode.scrollHeight > 32766) {
        // alert("Due to Chrome canvas memory limits, the screenshot will be limited to 32766px height.\n\n");
    }

    shared.originalScrollTop = scrollNode.scrollTop; // ->[] save user scrollTop
    shared.tab.hasVscrollbar = (window.innerHeight < scrollNode.scrollHeight);
    scrollNode.scrollTop = 0;
    setTimeout(function () { screenshotVisibleArea(shared); }, 100);
}

// 2
function screenshotVisibleArea(shared) {
    chrome.runtime.sendMessage({ action: 'screenshotVisibleArea', shared: shared });
    hideAllDivs();
}

// 3
function screenshotScroll(shared) {
    hideAllDivs();
    try {
        hideElements();
    } catch (error) { }
    // Identify which part of the DOM is "scrolling", and store the previous position
    var scrollNode = document.querySelector("main.scrollable") || document.querySelector("#div-wilfred") || document.scrollingElement || document.documentElement;
    var scrollTopBeforeScrolling = scrollNode.scrollTop;

    // Scroll down!
    scrollNode.scrollTop += window.innerHeight;

    if (scrollNode.scrollTop == scrollTopBeforeScrolling || scrollNode.scrollTop > 32766) { // 32766 --> Skia / Chrome Canvas Limitation, see recursiveImageMerge()
        // END ||
        shared.imageDirtyCutAt = scrollTopBeforeScrolling % window.innerHeight;
        scrollNode.scrollTop = shared.originalScrollTop; // <-[] restore user scrollTop
        screenshotEnd(shared);
    } else {
        // LOOP >>
        // This bounces to the screenshot call before coming back in this function.
        setTimeout(function () { screenshotVisibleArea(shared); }, SCROLL_DELAY);
    }
}

var screenshotEnded = false;
function screenshotStart() {
    opkey_styledElement = [];
    if (screenshotEnded == true) {
        return;
    }
    hideAllDivs();
}

// 4
function screenshotEnd(shared) {
    screenshotEnded = true;
    showAllDivs();
    try {
        unhideElements();
    } catch (error) { }
    chrome.runtime.sendMessage({ action: 'screenshotEnd', shared: shared });
    opkey_snapshotDivs_headers = [];
    opkey_snapshotDivs_footers = [];
    count = 0;
    opkey_styledElement = [];
    window.setTimeout(function () {
        screenshotEnded = false;
    }, 500);
}

	
// Function to hide the elements
function hideElements() {
    //hide side bar
    // const elements = [
    //     '.navbar_left',
    //     '.logo-header',
    //     '.main-menu-category',
    //     '.wilfred-tab',
    //     '.nav-link',
    // ];
    // elements.forEach(function (selector) {
    //     document.querySelectorAll(selector).forEach(function (element) {
    //         element.style.display = 'none';
    //     });
    // });
    const headerElement = document.querySelector('header.logo-header');
    if (headerElement) {
        headerElement.style.display = 'none';
    }
    document.querySelector('.main-menu-category').style.display = 'none';
    //hide top bar
    let element = document.getElementById("div_panel_breadcrumb");
    if (element) {
        let outermostDiv = element.closest('app-navigator-right-navigation').parentElement; // Go to <app-navigator-right-navigation>'s parent <div>
        if (outermostDiv) {
            outermostDiv.style.display = "none";
        }
    }
    //hide second top bar
    document.querySelector('.modal_header.wilfred_header_main.border_bottom').style.display = 'none';
    // document.querySelector('.d-flex align-items-center ps-0 position_relative common_margin_center mt-3').style.display = 'none';
    document.querySelector('.div_wright_mgs').style.display = 'none';
    const element2 = document.querySelector('.wilfred_header_main + .wilfred_main_page .wilfred_main_page_height');
    if (element2) {
        console.log("css edit");
        element2.style.setProperty('height', '100vh', 'important');
    }
}
// Function to unhide the elements
function unhideElements() {
    // List of elements to unhide
    const elements = [
        '.navbar_left',
        '.logo-header',
        '.main-menu-category',
        '.wilfred-tab',
        '.nav-link'
    ];
    // Iterate through each element and restore its display property
    elements.forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (element) {
            element.style.display = '';
        });
    });
    let element = document.getElementById("div_panel_breadcrumb");
    if (element) {
        let outermostDiv = element.closest('app-navigator-right-navigation').parentElement; // Go to <app-navigator-right-navigation>'s parent <div>
        if (outermostDiv) {
            outermostDiv.style.display = '';
        }
    }
    document.querySelector('.modal_header.wilfred_header_main.border_bottom').style.display = '';
    // document.querySelector('.d-flex.align-items-center.ps-0.position_relative.common_margin_center.mt-3').style.display = '';
    document.querySelector('.div_wright_mgs').style.display = '';
    const element2 = document.querySelector('.wilfred_header_main + .wilfred_main_page .wilfred_main_page_height');
    if (element2) {
        console.log("css edit");
        element2.style.setProperty('height', 'calc(100vh - 12rem)', 'important');
    }
}



opkey_attachVideoEditorListener();