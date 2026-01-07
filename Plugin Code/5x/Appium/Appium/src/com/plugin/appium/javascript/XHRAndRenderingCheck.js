var oldOpen = XMLHttpRequest.prototype.open;
window.openHttpURLs = [];
var callback = arguments[arguments.length - 1];

window._setTimeout = window.setTimeout;
window.calledTimeOutFuntion = [];

function OpKey_generateUUID() { // Public Domain/MIT
	var d = new Date().getTime();
	if (typeof performance !== 'undefined'
			&& typeof performance.now === 'function') {
		d += performance.now(); // use high-precision timer if available
	}
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
}

function OpKey_objectContainsInArray(_arrays, _item) {
	for (var _ii = 0; _ii < _arrays.length; _ii++) {
		if (_arrays[_ii] == _item) {
			return _ii;
		}
	}
	return -1;
}

window.setTimeout = function(func, delay) {
	var requirePushPull = false;
	var retFunc = null;
	// previous delay check value was 5000
	if (delay < 1000
			&& OpKey_objectContainsInArray(window.calledTimeOutFuntion, func
					.toString()) == -1) {
		var _timeoutGuid = 'SetTimeOut_' + OpKey_generateUUID();
		window.openHttpURLs.push(_timeoutGuid);
		retFunc = this._setTimeout(func, delay);
		if (delay < 300) {
			delay = 300;
		}
		this._setTimeout(function() {
			var index = OpKey_objectContainsInArray(window.openHttpURLs, _timeoutGuid);
			if (index !== -1) {
				window.openHttpURLs.splice(index, 1);
			}
		}, delay);
	} else {
		retFunc = this._setTimeout(func, delay);
	}
	window.calledTimeOutFuntion.push(func.toString());
	return retFunc;
};

Element.prototype._appendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function(_nodeData) {
	var _renderingGuid = 'ElementRendering_' + OpKey_generateUUID();
	window.openHttpURLs.push(_renderingGuid);
	var retData = this._appendChild(_nodeData);
	window._setTimeout(function() {
		var index = OpKey_objectContainsInArray(window.openHttpURLs,
				_renderingGuid);
		if (index !== -1) {
			window.openHttpURLs.splice(index, 1);
		}
	}, 400);
	return retData;
};

XMLHttpRequest.prototype.open = function(method, url) {
	var urlsToAvoid = OPKEY_URLS_TO_AVOID
	var foundAny = false;
	var i;
	for (i in urlsToAvoid) {
		if (url.includes(urlsToAvoid[i])) {
			foundAny = true;
			break;
		}
	}
	if (foundAny == false) {
		window.openHttpURLs.push(url);
		this.addEventListener('readystatechange', function() {

			if (this.readyState == 4) {
				var index = window.openHttpURLs.indexOf(url);
				if (index != -1) {
					window.openHttpURLs.splice(index, 1);
				}
			} else {
			}
		}, false);
	}
	try {
		oldOpen.call(this, method, url);
	} catch (e) {
		var index = window.openHttpURLs.indexOf(url);
		if (index != -1) {
			window.openHttpURLs.splice(index, 1);
		}
	}
}

XMLHttpRequest.prototype.open = function(method, url, async) {
	if (async == null) {
		async = true;
	}
	var urlsToAvoid = OPKEY_URLS_TO_AVOID
	var foundAny = false;
	var i;
	for (i in urlsToAvoid) {
		if (url.includes(urlsToAvoid[i])) {
			foundAny = true;
			break;
		}
	}
	if (foundAny == false) {
		window.openHttpURLs.push(url);
		this.addEventListener('readystatechange', function() {

			if (this.readyState == 4) {
				var index = window.openHttpURLs.indexOf(url);
				if (index != -1) {
					window.openHttpURLs.splice(index, 1);
				}
			} else {
			}
		}, false);
	}
	try {
		oldOpen.call(this, method, url, async);
	} catch (e) {
		var index = window.openHttpURLs.indexOf(url);
		if (index != -1) {
			window.openHttpURLs.splice(index, 1);
		}
	}
}

XMLHttpRequest.prototype.open = function(method, url, async, user) {
	if (async == null) {
		async = true;
	}
	var urlsToAvoid = OPKEY_URLS_TO_AVOID
	var foundAny = false;
	var i;
	for (i in urlsToAvoid) {
		if (url.includes(urlsToAvoid[i])) {
			foundAny = true;
			break;
		}
	}
	if (foundAny == false) {
		window.openHttpURLs.push(url);
		this.addEventListener('readystatechange', function() {

			if (this.readyState == 4) {
				var index = window.openHttpURLs.indexOf(url);
				if (index != -1) {
					window.openHttpURLs.splice(index, 1);
				}
			} else {
			}
		}, false);
	}
	try {
		oldOpen.call(this, method, url, async, user);
	} catch (e) {
		var index = window.openHttpURLs.indexOf(url);
		if (index != -1) {
			window.openHttpURLs.splice(index, 1);
		}
	}
}

XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
	if (async == null) {
		async = true;
	}
	var urlsToAvoid = OPKEY_URLS_TO_AVOID
	var foundAny = false;
	var i;
	for (i in urlsToAvoid) {
		if (url.includes(urlsToAvoid[i])) {
			foundAny = true;
			break;
		}
	}
	if (foundAny == false) {
		window.openHttpURLs.push(url);
		this.addEventListener('readystatechange', function() {

			if (this.readyState == 4) {
				var index = window.openHttpURLs.indexOf(url);
				if (index != -1) {
					window.openHttpURLs.splice(index, 1);
				}
			} else {
			}
		}, false);
	}
	try {
		oldOpen.call(this, method, url, async, user, pass);
	} catch (e) {
		var index = window.openHttpURLs.indexOf(url);
		if (index != -1) {
			window.openHttpURLs.splice(index, 1);
		}
	}
}

callback('Injection Completed Reported from JS');