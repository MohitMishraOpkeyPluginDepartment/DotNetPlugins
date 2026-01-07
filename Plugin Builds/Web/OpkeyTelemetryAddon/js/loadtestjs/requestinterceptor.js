

console.log("Injected RequestInterceptor")

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

  var _oldonreadstatechange = this.onreadystatechange;
  this.onreadystatechange = function () {
    if (this.readyState == XMLHttpRequest.DONE) {
      //console.log("Request Header " + this.headers)
      //console.log(this.headers);
      //console.log("Request Data " + data);
      //console.log("Response Headers " + this.getAllResponseHeaders());
      //console.log("Response Data " + this.responseText);

try{
      if (this.responseText.indexOf("<svg") == -1) {
        var responseText = this.responseText;
        var requestHeaders = this.headers;
        var requestData = data;
        var method = this.method;
        var url = this.url;
        console.log(this);
        var temp_mainaction = new Object();
        var temp_dataarguments = new Object();
        var temp_object = new Object();

        temp_object["title"] = "";
        temp_object["logicalname"] = "";
        var temp_parentobject = new Object();
        temp_parentobject["title"] = "";
        temp_object["parent"] = temp_parentobject;
        var temp_arguments = [];
        temp_mainaction["action"] = "OracleLT_WebApiCall";
        temp_mainaction["popupName"] = "";
        temp_mainaction["WebLT:ResponseString"] = responseText;
        temp_mainaction["WebLT:RequestHeaders"] = requestHeaders;
        temp_mainaction["WebLT:RequestData"] = requestData;
        temp_mainaction["WebLT:RequestMethod"] = method;
        temp_mainaction["WebLT:RequestUrl"] = url;
        temp_dataarguments["type"] = "string";
        temp_dataarguments["data"] = "";
        temp_arguments.push(temp_object);
        temp_arguments.push(temp_dataarguments);
        temp_mainaction["arguments"] = temp_arguments;
        queueItems.push(temp_mainaction);
        console.log("Added QueueItems Length " + queueItems.length);
      }
    }catch(e){}
    }
    if (_oldonreadstatechange) {
      _oldonreadstatechange.apply(this, arguments)
    }
  }

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
}


window.setInterval(function () {
  var step = sessionStorage.getItem("OPKEY_LT_WEB_STEPS");
  if (step == null || step == "") {
    if (queueItems.length > 0) {
      var currentItem = queueItems.shift();
      console.log("QueueItems Length " + queueItems.length);
      if (currentItem != null && currentItem != "") {
        sessionStorage.setItem("OPKEY_LT_WEB_STEPS", JSON.stringify([currentItem]));
      }
    }
  }
}, 500);