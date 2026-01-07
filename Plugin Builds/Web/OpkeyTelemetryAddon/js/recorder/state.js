/**
 * Sahi - Web Automation and Test Tool
 *
 * Copyright  2006  V Narayan Raman
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
try {
	_opkey.sid = '$sessionId';
	_opkey.isWinOpen = $isWindowOpen;
	_opkey.createCookie('sahisid', '$sessionId');
	_opkey._isPaused = $isSahiPaused;
	_opkey._isPlaying = $isSahiPlaying;
	_opkey._isRecording = $isSahiRecording;
	_opkey.hotKey = '$hotkey';

	_opkey.INTERVAL = $interval;
	_opkey.ONERROR_INTERVAL = $onErrorInterval;
	_opkey.MAX_RETRIES = $maxRetries;
	_opkey.SAHI_MAX_WAIT_FOR_LOAD = $maxWaitForLoad;

	_opkey.waitForLoad = _opkey.SAHI_MAX_WAIT_FOR_LOAD;
	_opkey.interval = _opkey.INTERVAL;

	_opkey.__scriptName = "$scriptName";
	_opkey.__scriptPath = "$scriptPath";

	_opkey.strictVisibilityCheck = $strictVisibilityCheck;
	_opkey.STABILITY_INDEX = $stabilityIndex;
	_opkey.controllerMode = "$controllerMode";
	_opkey.setWaitForXHRReadyStates("$waitReadyStates");
	_opkey.escapeUnicode = $escapeUnicode;
	_opkey.commonDomain = "$commonDomain";
	_opkey.ignorableIdsPattern = new RegExp('$ignorableIdsPattern');
	_opkey.chromeExplicitCheckboxRadioToggle = $chromeExplicitCheckboxRadioToggle;
	_opkey.strictVisibilityCheck = $strictVisibilityCheck;
	_opkey.isSingleSession = $isSingleSession;
	// Pro start
} catch (e) {
}
function addLangPack() {
	var s = document.createElement("script");
	s.setAttribute("src", "/_s_/spr/language_pack.js");
	s.setAttribute("id", "langpack");
	s.setAttribute("type", "text/javascript");
	document.getElementsByTagName("head")[0].appendChild(s);
}
//addLangPack();
