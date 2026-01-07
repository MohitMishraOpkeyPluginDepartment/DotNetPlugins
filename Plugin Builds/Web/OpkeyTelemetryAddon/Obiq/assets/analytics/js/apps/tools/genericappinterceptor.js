var queueItems = []


const open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url) {
    this.method = method;
    this.startTime = performance.now();
    this.url = getAbsoluteUrl(url);
    open.apply(this, arguments);
};


function getAbsoluteUrl(url) {
    const dummyLink = document.createElement('a');
    dummyLink.href = url;
    return dummyLink.href;
};

XMLHttpRequest.prototype._original_send = XMLHttpRequest.prototype.send;
var interceptor_send = function (data) {

    var _oldonreadystatechange = this.onreadystatechange;

    this.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE) {

            var apiUrl = this.responseURL || this.url;
            var apiMethod = this.method || this._method; // Store the method elsewhere
            var responseCode = this.status;

            if (responseCode > 399 && responseCode < 600) {
                var dataToSend = {};
                dataToSend["requestUrl"] = apiUrl;
                dataToSend["requestMethod"] = apiMethod;
                dataToSend["responseCode"] = responseCode;

                /*
                if (data instanceof FormData) {
                    var formDataEntries = [];
                    for (var pair of data.entries()) {
                        formDataEntries.push(encodeURIComponent(pair[0]) + "=" + encodeURIComponent(pair[1]));
                    }
                    dataToSend["requestBody"] = formDataEntries.join("&");
                }
                else if (typeof data === "object") {
                    dataToSend["requestBody"] = JSON.stringify(data);
                } else {
                    dataToSend["requestBody"] = data ? data.toString() : null;
                }

                // Convert headers to string
                dataToSend["requestHeaders"] = this.headers ? JSON.stringify(this.headers) : null;
*/
                try {
                    if (this.responseText != null) {
                        dataToSend["response"] = this.responseText;
                    }
                } catch (e) { }

                var _postData = {};
                _postData["method"] = "GA_SendApiRequestError";
                _postData["errorData"] = dataToSend;
                if (window != null && typeof window.postMessage === "function") {
                    try {
                        window.postMessage(_postData);
                    } catch (e) { }
                }
            }
        }

        if (_oldonreadystatechange) {
            _oldonreadystatechange.apply(this, arguments);
        }
    };

    this._original_send.apply(this, arguments);
};

XMLHttpRequest.prototype.send = interceptor_send;


XMLHttpRequest.prototype.wrappedSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
    this.wrappedSetRequestHeader(header, value);
    if (!this.headers) {
        this.headers = {};
    }
    if (!this.headers[header]) {
        this.headers[header] = [];
    }

    this.headers[header].push(value);
};


/*
const originalConsoleError = console.error;


console.error = function (...args) {
    if (args.length > 0) {

        var errorDataToSend = args[0];

        args.forEach(arg => {
            if (arg instanceof Error) {
                errorDataToSend = arg.stack;
            }
        });

        var _postData = new Object();
        _postData["method"] = "GA_SendConsoleError";
        _postData["errorData"] = errorDataToSend;
        if (window != null && typeof window.postMessage === "function") {
            try {
                window.postMessage(_postData);
            } catch (e) { }
        }
    }
    originalConsoleError.apply(console, args);
};
*/
