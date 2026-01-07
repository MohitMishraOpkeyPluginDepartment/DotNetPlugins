/*
function addRemoteJs(src) {
    if (document.getElementById("opkey_loadtetsing_script") != null) {
        return;
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "opkey_loadtetsing_script"
    script.src = src;

    (document.head || document.documentElement).appendChild(script);
    return script;
};



window.setInterval(function () {
    if (document.URL.indexOf("oraclecloud.com") > -1) {
        addRemoteJs(chrome.runtime.getURL("js/loadtestjs/requestinterceptor.js"));
        var ltwebrecordedsteps = sessionStorage.getItem("OPKEY_LT_WEB_STEPS");
        if (ltwebrecordedsteps != null && ltwebrecordedsteps != "") {
            chrome.runtime.sendMessage({
                setwebltrecordedsteps: ltwebrecordedsteps
            }, function (response) {
                if (chrome.runtime.lastError) { }
                sessionStorage.setItem("OPKEY_LT_WEB_STEPS", "");
            });
        }
    }
}, 500);

*/