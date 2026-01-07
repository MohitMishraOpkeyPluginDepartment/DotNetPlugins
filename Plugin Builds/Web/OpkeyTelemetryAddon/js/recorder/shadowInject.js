var injectedScript = document.createElement('script');
injectedScript.src = chrome.extension
		.getURL('/js/recorder/shadowdom_recorder.js');
var highlightCssPath = chrome.extension.getURL('/css/OpkeyHighlight.css');
if (document.body) {
	document.body.setAttribute("opkey_csspath", highlightCssPath);
}
// (document.head || document.documentElement).prepend(injectedScript);
(document.head || document.documentElement).appendChild(injectedScript);