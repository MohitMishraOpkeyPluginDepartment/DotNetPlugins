var Opkey_Sender = function() {

}

Opkey_Sender.prototype.sendAndProcessData = function(data) {
	chrome.runtime.sendMessage(data, function(response) {
		if (chrome.runtime.lastError) {
		}
	});

};

Opkey_Sender.prototype.sendDomsData = function(data) {
	chrome.runtime.sendMessage({
		domsdata : data
	}, function(response) {
		if (chrome.runtime.lastError) {
		}
	});

};