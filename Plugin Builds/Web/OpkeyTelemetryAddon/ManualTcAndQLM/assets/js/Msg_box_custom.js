
showError = function (error) {
    var message = null;
    if (error == undefined) {
        return;
    }
    if (error.status == 403) {
        window.location.href = "/Login/LoginView";
        return false;
    }
    // cheking Used By or not in some other artifact 
    if (!!error.message) {
        message = (error.message.search('It is used by') != -1);
        msgbox(error.message, 'error');
        return false;
    }

    if (error != null && error.responseText != null) {
        if (error.responseText.indexOf("The expected token is") != -1) {
            msgbox("Unable to communicate with agent", "error");
            return false;
        }
    }

    //Check that if it is a locked by error then refresh the artifact
    if (!!error.responseJSON) {
        message = error.responseJSON.message;
        if (message.toLowerCase().indexOf("is locked by") >= 0) {
            msgbox(error.data, 'error');
        }
    }
    if (!!error.responseJSON) {
        message = error.responseJSON.message;
        msgbox(message, "Error");
    }
    else if (error.message) {
        message = error.message;
        msgbox(message, "Error");
    }
    else if (error.data) {
        message = error.data.message;
        if (message == "" || message == undefined) {
            msgbox(error.data, 'error');
        } else {
            msgbox(message, "Error");
        }
    } else if (error.responseText == undefined) {
        return false;
    }
    else if (error.responseText == "") {
        return false;
    } else if (typeof (error) === "string") {
        if (error.search("<!DOCTYPE html>") != -1) {
            msgbox(error, 'error');
        }
    }

    else {

        var errorMessage = error.responseText;
        if (errorMessage.indexOf("Version Information") !== -1) {

            var versionError = errorMessage.replace("Version Information:", "")
            errorMessage = versionError.replace("Microsoft .NET Framework Version:4.0.30319; ASP.NET Version:4.7.3282.0", "")


        }

        msgbox(errorMessage, 'error');
    }


};

msgbox = function (msg, msg_type,callback) {
    $.msgBox({
        title: "Opkey",
        content: msg,
        modal: true,
        type: msg_type,
        buttons: [{ value: "ok" }],
        success: function (result) {
            if (result === "ok") {
                if(callback) {
                    callback();
                }
            }
        }

    });
};

msgbox_callback = function (msg, msg_type, callback, data) {
    $.msgBox({
        title: "Opkey",
        content: msg,
        modal: true,
        type: msg_type,
        buttons: [{ value: "Yes" }, { value: "No" }],
        success: function (result) {
            if (result === "Yes") {
                callback(data);
            }
        }

    });
};

notifier = function (msg, type){
    $.notify(msg,type);
}