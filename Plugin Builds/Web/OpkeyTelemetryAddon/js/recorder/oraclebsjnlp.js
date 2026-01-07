var jnlpDataSent = false;

window.setInterval(function () {
    var recordingMode = getOpKeyRecordingMode();
    if (recordingMode == "ORACLE EBS") {
        chrome.runtime.sendMessage({
            getHighlightStatus: "getHighlightStatus"
        }, function (response) {
            if (chrome.runtime.lastError) {}
            if (response === true) {
                var headElement = document.getElementsByTagName("HEAD")[0];
                if (headElement != null) {
                    var opkeyScriptElement = document.getElementById("OPKEYJNLPSCRIPT");
                    if (opkeyScriptElement == null) {
                        var scriptElement = document.createElement("SCRIPT");
                        scriptElement.id = "OPKEYJNLPSCRIPT";
                        scriptElement.text = "window.launchForm=function(url){            };" +
                            "var customOpKeyWinOpen = window.open;\r\n" +
                            "window.open = function (...args) {\r\n" +
                            "    try {\r\n" +
                            "        if (args != null) {\r\n" +
                            "            if (args.length > 0) {\r\n" +
                            "                var clickedUrl = args[0];\r\n" +
                            "                localStorage.setItem(\"OPKEY_CLICKED_URL\", clickedUrl);\r\n" +
                            "            }\r\n" +
                            "        }\r\n" +
                            "        return customOpKeyWinOpen(...args);\r\n" +
                            "    } catch (e) {\r\n" +
                            "        return customOpKeyWinOpen(...args);\r\n" +
                            "    }\r\n" +
                            "}";
                        headElement.append(scriptElement);
                    }
                }
            }
        });

        var opkeyclickedUrl = localStorage.getItem("OPKEY_CLICKED_URL");
        if (opkeyclickedUrl != null && opkeyclickedUrl != "") {
            localStorage.setItem("OPKEY_CLICKED_URL", "");
            OpKey_doGET(opkeyclickedUrl);

            var _jnlpDataThread = window.setInterval(function () {
                var _jnlpData = window.opkey_JNLPResponse;
                if (_jnlpData != null) {
                    if (_jnlpData != "NO_JNLP_REPONSE") {
                        if (_jnlpData.toLowerCase().indexOf("<jnlp") > -1) {
                            window.clearInterval(_jnlpDataThread);
                            if (jnlpDataSent == false) {
                                jnlpDataSent = true;
                                chrome.runtime.sendMessage({
                                    LaunchOracleEBSByJnLpData: _jnlpData
                                }, function (response) {
                                    if (chrome.runtime.lastError) {}
                                });

                                window.setTimeout(function () {
                                    jnlpDataSent = false;
                                }, 2000);
                            }
                        }
                    }
                }
            }, 1000);
        }
    }
}, 1000);


function OpKey_doGET(path) {
    window.opkey_JNLPResponse = 'NO_JNLP_REPONSE';
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.opkey_JNLPResponse = xhttp.responseText;
        }
    };
    xhttp.open('GET', path, true);
    xhttp.send();
}

function getOpKeyRecordingMode() {
    try{
    var recording_mode = localStorage.getItem("OPKEY_RECORDING_MODE");
    if (recording_mode == null) {
        return "NORMAL";
    } else {
        return recording_mode;
    }
}catch(e){
    return "NORMAL";
}
}