
var InAppPromptService = function () {

};

var lastAlertTooltip = null;
var lastTooltipElement = null;
let previousElementName = null;

var thisInstance = new InAppPromptService();

let debugMode = false;
let companionAppFullyLoaded = false;
let stopDesktopNavAssist = false;
InAppPromptService.prototype.setCompanionAppFullyLoaded = function (isloaded) {
    companionAppFullyLoaded = isloaded;
}
InAppPromptService.prototype.initInAppPrompt = async function (journeySessionId, lang, userId, projectId) {
    sendLoadingPopupStartDataToCompanionApp();


    if (journeySessionId != null || (journeySessionId != null && journeySessionId === "STOP_PROMPT")) {
        await sendMessageToOffscreenScript("clear_guide_prompts_data_array", {});

        if ((journeySessionId != null && journeySessionId === "STOP_PROMPT")) {
            hideToolTipElement();
            hideAlertTooltip();
            sendLoadingPopupStopDataToCompanionApp();
            stopDesktopInAppPrompt();
            return;
        }
    }

    let promptDataArray = await sendMessageToOffscreenScript("obiq_userguide_get_steps_info", { "journeyId": journeySessionId, "lang": lang, "userId":userId, "projectId":projectId });

    sendInAppPromptsStepsDataToCompanionApp(promptDataArray);

    if (promptDataArray == null || promptDataArray.length == 0) {
        return;
    }
    await sendMessageToOffscreenScript("set_guide_prompts_data_array", { "guideStepsArray": promptDataArray });

    sendLoadingPopupStopDataToCompanionApp();
}

InAppPromptService.prototype.fetchAndDisplayInAppPompt = function (stepIndex, stepsArray) {
    return new Promise(async function (resolve) {

        let actualStepNo = stepIndex;
        try {
            hideToolTipElement();
            hideAlertTooltip();
            let currentData = stepsArray[stepIndex - 1];

            if (currentData == null) {
                resolve(false);
                return;
            }
            if (checkConditionForDesktopInAppPromot(currentData) === true) {
                await sendMessageToBackgroundScriptWithPromise("startWin32InAppPromptService", currentData["journeySessionId"]);
                let dataToSendToDesktopRecorder = currentData;
                dataToSendToDesktopRecorder.totalSteps = stepsArray.length;
                await fetchAndDisplayDesktopInAppPrompt(dataToSendToDesktopRecorder);
                return;
            }

            let fieldInfoJson = JSON.parse(currentData["fieldInfoJson"]);
            let _orObject = fieldInfoJson["ORObjectProperties"];

            let mainObject = _orObject[0];
            let parentObject = mainObject["parent"];

            let parent_object_title = currentData.pageTitle;
            let pageHeader = currentData.pageHeader;
            let page_title = document.title;

            let _stepDetail = getFormattedStepDetail(currentData);

            let titleConditionMet = isTitleOrHeaderPresent(page_title, parent_object_title, pageHeader);

            if (excludeTitleCheckSpecific(_stepDetail) === true) {
                titleConditionMet = true;
            }

            if (titleConditionMet === true) {



                showDebugLogNew("Step \"" + _stepDetail + "\" Element Finding");

                let status = await findElementAndDisplaySuggestion(actualStepNo, _stepDetail, currentData, mainObject, stepsArray, 30000, 50);

                if (status == true) {
                    resolve(true);
                    return;
                }
                else {
                    showDebugLogNew("Step \"" + _stepDetail + "\" Element Not Found");
                    setStepStatusInCompanionApp(actualStepNo, "Fail");
                    setStepMessageInCompanionApp(actualStepNo, "Element not found");
                    setStepDebugInfoInCompanionApp(actualStepNo, "Element not found");
                    resolve(false);
                }
            }
            else {

                /*
                let status = await findElementAndDisplaySuggestion(actualStepNo, _stepDetail, currentData, mainObject, stepsArray, 30000, 50);
                if (status == false) {
                    setStepStatusInCompanionApp(actualStepNo, "Fail");
                    setStepMessageInCompanionApp(actualStepNo, "Title " + parent_object_title + " page not found");
                    setStepDebugInfoInCompanionApp(actualStepNo, "Title " + parent_object_title + " page not found");
                }
                resolve(status);
                */

                setStepStatusInCompanionApp(actualStepNo, "Fail");
                setStepMessageInCompanionApp(actualStepNo, "Title " + parent_object_title + " page not found");
                setStepDebugInfoInCompanionApp(actualStepNo, "Title " + parent_object_title + " page not found");

                resolve(false);
            }
        } catch (e) {

            if (e == null) {
                setStepDebugInfoInCompanionApp(actualStepNo, "Exception Raised but it is Null!");
                resolve(false);
                return;
            }
            setStepDebugInfoInCompanionApp(actualStepNo, "Exception Raised - " + e);
            resolve(false);
            return;
        }
    });
}

async function handlePromptStatus() {

    const data = await sendMessageToBackgroundScriptWithPromise("checkInAppPromptStatus", null);

    if (data == null || data.status == null) {
        return;
    }

    if (data.status === "NEXT") {
        await sendMessageToBackgroundScriptWithPromise("resetWin32InAppPromptStatus", null);
        sendMoveNextStepDataToCompanionApp();

    } else if (data.status === "PREVIOUS") {
        await sendMessageToBackgroundScriptWithPromise("resetWin32InAppPromptStatus", null);
        sendMovePreviousStepDataToCompanionApp();

    } else if (data.status === "PASS") {
        setStepStatusInCompanionApp(data.actualStepNo, "Pass");
        await sendMessageToBackgroundScriptWithPromise("resetWin32InAppPromptStatus", null);

    } else if (data.status === "FAIL") {
        setStepStatusInCompanionApp(data.actualStepNo, "Fail");
        await sendMessageToBackgroundScriptWithPromise("resetWin32InAppPromptStatus", null);
    }
}
async function fetchAndDisplayDesktopInAppPrompt(currentData) {
    stopDesktopNavAssist = false;
    await sendMessageToBackgroundScriptWithPromise("fetchAndUpdateWin32InAppPromptService", currentData);
    let navAssistInterval = setInterval(async () => {
        if (stopDesktopNavAssist === true) {
            clearInterval(navAssistInterval);
            return;
        }
        await handlePromptStatus();
    }, 500);
}

async function stopDesktopInAppPrompt() {
    stopDesktopNavAssist = true;
    await sendMessageToBackgroundScriptWithPromise("stopWin32InAppPromptService", null);
}

function checkConditionForDesktopInAppPromot(currentData) {
    let stepRecordingType = currentData["stepRecordingType"];
    return stepRecordingType != null && stepRecordingType === "DESKTOP_RECORDING";
}

async function findElementAndDisplaySuggestion(actualStepNo, _stepDetail, currentData, mainObject, stepsArray, timeout = 10000, interval = 500) {
    let _elementFound = await waitForElement(_stepDetail, mainObject, timeout, interval);

    if (_elementFound != null) {
        let returnValue = await checkConditionElementAndReturnOnTrue(_elementFound);

        if (returnValue == true) {
            setStepStatusInCompanionApp(actualStepNo, "Pass");
            return true;
        }
        showDebugLogNew("Step \"" + _stepDetail + "\" Element Found");
        addSuggestionToolTip(_elementFound, currentData, _stepDetail, actualStepNo, stepsArray.length);
        setStepStatusInCompanionApp(actualStepNo, "Pass");
        setStepMessageInCompanionApp(actualStepNo, "Element found, and the in‑app prompt was shown successfully.");
        return true;
    }

    return false;
}

function enableOrDisablePreviousNextButton(actualStepNo, stepsLength) {
    window.setTimeout(function () {


        const prevBtn = document.getElementById('obiqcmpapp_prevBtn');
        const nextBtn = document.getElementById('obiqcmpapp_nextBtn');

        if (prevBtn != null && nextBtn != null) {
            if (actualStepNo == 1) {
                //disbale previouse
                //enable next
                prevBtn.disabled = true;
                nextBtn.disabled = false;
            }
            else if (actualStepNo == stepsLength && stepsLength > 1) {
                prevBtn.disabled = false;
                nextBtn.disabled = true;
            }
            else if (actualStepNo == stepsLength) {
                prevBtn.disabled = true;
                nextBtn.disabled = true;
            }
        }
    }, 300);
}

function sendLoadingPopupStartDataToCompanionApp() {
    let messageObject = getMessageWrapper("COMP_APP_LOADING_POPUP_START", true);
    sendDataToCompanionApp(messageObject);
}

function sendLoadingPopupStopDataToCompanionApp() {
    let messageObject = getMessageWrapper("COMP_APP_LOADING_POPUP_END", true);
    sendDataToCompanionApp(messageObject);
}

function setStepStatusInCompanionApp(stepNo, statusType) {
    let messageObject = getMessageWrapper("COMP_APP_SET_STEP_STATUS", { "stepNo": stepNo, "statusType": statusType });
    sendDataToCompanionApp(messageObject);
}

function setStepMessageInCompanionApp(stepNo, message) {
    let messageObject = getMessageWrapper("COMP_APP_SET_STEP_MESSAGE", { "stepNo": stepNo, "message": message });
    sendDataToCompanionApp(messageObject);
}

function setStepDebugInfoInCompanionApp(stepNo, debugInfo) {
    if (true) {
        return;
    }
    let messageObject = getMessageWrapper("COMP_APP_SET_STEP_DEBUG_INFO", { "stepNo": stepNo, "debugInfo": debugInfo });
    sendDataToCompanionApp(messageObject);
}

function excludeTitleCheckSpecific(_stepDetail) {

    if (isWorkDayApp() === true) {
        if (_stepDetail.trim() == "Click on 'Home'") {
            return true;
        }
    }

    return false;
}

function isTitleOrHeaderPresent(_currentPageTitle, _pageObjectTitle, _pageHeader) {

    function findAllH1ByText(desiredText) {
        function xpathLiteral(str) {
            if (!str.includes('"')) return `"${str}"`;
            if (!str.includes("'")) return `'${str}'`;
            return 'concat("' + str.replace(/"/g, '", \'"\', "') + '")';
        }

        const text = desiredText.trim().replace(/\s+/g, ' ');
        const xpath = `//*[self::h1 or self::h2][normalize-space(.)=${xpathLiteral(text)}]`;

        const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );


        const elements = [];
        for (let i = 0; i < result.snapshotLength; i++) {
            elements.push(result.snapshotItem(i));
        }
        return elements;
    }


    if (_pageObjectTitle == null || _currentPageTitle == null || _pageObjectTitle == null || _pageObjectTitle == "") {
        return false;
    }

    if (_currentPageTitle === _pageObjectTitle) {
        return true;
    }


    let splitTitles = _pageObjectTitle.split("-");
    let headerTitle = splitTitles[0];

    let h1Headers = findAllH1ByText(_pageHeader);

    if (h1Headers.length == 0) {
        h1Headers = findAllH1ByText(_pageHeader + ":");
    }
    if (h1Headers.length == 0) {
        h1Headers = findAllH1ByText(headerTitle);
    }



    if (h1Headers.length > 0) {
        showDebugLog("Page " + _pageObjectTitle + " Found");
        return true;
    }
    else if (_currentPageTitle.split("-")[0].trim() === _pageObjectTitle.split("-")[0].trim()) {
        return true;
    }
    showDebugLog("Page " + _pageObjectTitle + " Not Found Found");
    return false;
}

let lastFoundElement = null;
function waitForElement(_stepDetail, mainObject, timeout = 10000, interval = 500) {
    console.log("Finding by Object");
    console.log(mainObject);

    debugger
    return new Promise((resolve, reject) => {
        waitForCursorInactive(30000)
            .then(() => {
                const startTime = Date.now();

                const check = () => {
                    debugger
                    let _elementFound = findElementsByParsedText(_stepDetail, false, true, true);

                    if (_elementFound == null) {
                        _elementFound = findUniqueElementByText(mainObject);
                    }

                    if (_elementFound == null) {
                        _elementFound = findUniqueElement(mainObject);
                    }

                    if (checkForWrongElement(_elementFound, _stepDetail)) {
                        lastFoundElement = _elementFound;
                        _elementFound = null;
                    }

                    if (_elementFound == null) {
                        _elementFound = findElementsByParsedText(_stepDetail, false, false, false);
                    }

                    if (_elementFound == null) {
                        _elementFound = findElementsByParsedText(_stepDetail, true, false, false);
                    }

                    if (_elementFound == null && lastFoundElement != null) {
                        _elementFound = lastFoundElement;
                        lastFoundElement = null;
                    }

                    if (_elementFound != null) {
                        if (isElementVisibleByCSSNew(_elementFound)) {
                            showConsoleLog("Element Found")
                            showConsoleLog(_elementFound);
                            resolve(_elementFound);
                            return;
                        }
                    }

                    if (Date.now() - startTime >= timeout) {
                        showConsoleLog("Element Not Found")
                        resolve(null);
                        return;
                    }

                    // Schedule the next check
                    setTimeout(check, interval);
                };

                // Start the first check
                check();
            });
    }).catch((error) => {
        console.error(error.message);
    });
}

function checkForWrongElement(_element, _stepDetail) {
    
    let stepLabel = formateStepLabel(_stepDetail);

    if (_element == null || stepLabel == null) {
        return false;
    }

    if (_element.nodeName === "BUTTON" || _element.nodeName === "DIV") {
        let eleLabel = _element.innerText || _element.textContent;

        if (eleLabel != null && eleLabel != "") {
            eleLabel = eleLabel.replace(/[0-9]/g, '').replace(/[()]/g, '').trim();
            if (eleLabel != stepLabel) {
                return true;
            }
        }
    }

    if (isRectAllZero(_element.getBoundingClientRect())) {
        return true;
    }

    return false;
}

function formateStepLabel(str) {
    const m = str.match(/'([^']+)'/);
    if (!m) return null;
    let text = m[1];

    text = text.replace(/[0-9]/g, '').replace(/[()]/g, '').trim();
    if (!text) return null;

    return text;
}

async function checkConditionElementAndReturnOnTrue(_element) {

    return new Promise(async function (resolve) {
        let elementLabel = new CommonErpAppDataTracker().getElementLabel(_element);
        if (elementLabel == "Show Less") {
            let drawerOpened = await checkNavigationDrawerOpened();
            if (drawerOpened) {
                return resolve(true);
            }
        }


        if (elementLabel == "Show More") {
            let drawerOpened = await checkNavigationDrawerOpened();
            if (drawerOpened) {

                if (_element.getAttribute("aria-label") != null && _element.getAttribute("aria-label") == "Show more quick actions") {
                    return resolve(true);
                }
            }
        }

        if (elementLabel == "Navigator") {
            console.log("Nvaigatot clicked");

            let drawerOpened = await checkNavigationDrawerOpened();

            console.log("Navigation Drawer Opened " + drawerOpened);
            return resolve(drawerOpened);
        }

        return resolve(false);
    });
}

function getFormattedStepDetail(_currentData) {
    let stepDetail = _currentData["detail"];
    if (stepDetail == null) {
        return null;
    }
    return stepDetail;
}

function showDebugLogNew(_log) {
    if (debugMode == false) {
        return;
    }
}

function showDebugLog(_log) {
    if (debugMode == false) {
        return;
    }
    showConsoleLog(_log);
}

function showConsoleLog(_log) {
    if (debugMode == false) {
        return;
    }
    console.log(_log);
}


function addSuggestionToolTip(_element, _currentData, stepDetail, currentStepNo, arrayLength) {
    if (!_element) return;

    // ---------------------------
    // helpers (new + existing)
    // ---------------------------

    function getMainPanel(fromEl) {
        if (isWorkDayApp() == true) {
            // keep existing behavior to avoid clipping/stacks issues
            return document.body;
            // If you ever want panel scoping, you can restore the below:
            // return fromEl.closest('[data-automation-id="panelSet"], [data-automation-id="formContainer"], [role="region"], [data-automation-id="activeList"]')
            //     || document.querySelector('[data-automation-id="panelSet"], [data-automation-id="formContainer"]')
            //     || document.body;
        } else if (isOracleFusionApp() == true) {
            let selector1 = '.fusion-side-nav, .oj-navigationdrawer, [data-test="sideNav"]';
            return fromEl.closest(selector1)
                || document.querySelector(selector1)
                || document.body;
        } else {
            return document.body;
        }
    }

    function armWorkdayGuard(instance, panelEl, triggerEl) {
        const popper = instance.popper;
        const keepFocus = (e) => {
            const path = e.composedPath ? e.composedPath() : [];
            if (path.includes(popper)) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        };
        ['mousedown', 'pointerdown', 'touchstart']
            .forEach(t => window.addEventListener(t, keepFocus, true));

        const hushBubble = (e) => {
            e.stopPropagation();
        };
        ['click', 'pointerup', 'touchend', 'focusout']
            .forEach(t => popper.addEventListener(t, hushBubble, false));

        instance._wg = { keepFocus, hushBubble };
    }

    function disarmWorkdayGuard(instance) {
        const g = instance._wg;
        if (!g) return;

        ['mousedown', 'pointerdown', 'touchstart']
            .forEach(t => window.removeEventListener(t, g.keepFocus, true));

        ['click', 'pointerup', 'touchend', 'focusout']
            .forEach(t => instance.popper.removeEventListener(t, g.hushBubble, false));

        instance._wg = null;
    }

    // ---- unchanged but slightly hardened
    function createDummyAnchorFromElement(
        el,
        {
            freeze = true,
            follow = false,             // we'll drive following ourselves (we still keep option)
            container = document.body,
            freezeOnZero = true,
            useObservers = false
        } = {}
    ) {
        const isZeroRect = (r) => !r || (r.width === 0 && r.height === 0);
        const isRenderable = (node) => {
            if (!node || !node.isConnected) return false;
            const style = node.nodeType === 1 ? getComputedStyle(node) : null;
            return !style || (style.display !== 'none' && style.visibility !== 'hidden');
        };
        const measure = () => {
            if (!isRenderable(el)) return null;
            // getBoundingClientRect is fine; if inline/complex, getClientRects() could help
            const r = el.getBoundingClientRect?.();
            return r || null;
        };

        const initialRect = measure() || { left: 0, top: 0, width: 0, height: 0 };
        let lastGoodRect = isZeroRect(initialRect) ? null : initialRect;

        const anchor = document.createElement('div');
        anchor.setAttribute('role', 'presentation');
        anchor.setAttribute('aria-hidden', 'true');
        anchor.style.position = 'fixed';
        anchor.style.pointerEvents = 'none';
        anchor.style.background = 'transparent';
        anchor.style.left = (initialRect.left || 0) + 'px';
        anchor.style.top = (initialRect.top || 0) + 'px';
        anchor.style.width = (initialRect.width || 0) + 'px';
        anchor.style.height = (initialRect.height || 0) + 'px';
        anchor.style.zIndex = '2147483646';
        container.appendChild(anchor);

        function positionFromRect(r) {
            anchor.style.left = r.left + 'px';
            anchor.style.top = r.top + 'px';
            anchor.style.width = r.width + 'px';
            anchor.style.height = r.height + 'px';
        }

        let rafId = null;
        let hardFrozen = freeze;

        const recompute = () => {
            if (hardFrozen) return;
            const r = measure();
            if (r && !isZeroRect(r)) {
                lastGoodRect = r;
                positionFromRect(r);
                return;
            }
            if (lastGoodRect) {
                positionFromRect(lastGoodRect);
            } else {
                positionFromRect(initialRect);
            }
            if (freezeOnZero) {
                detachListeners();
                hardFrozen = true;
            }
        };

        const scheduleRecompute = () => {
            if (hardFrozen) return;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(recompute);
        };

        const listeners = [];
        function addListener(target, evt, fn, opts) {
            target.addEventListener(evt, fn, opts);
            listeners.push([target, evt, fn, opts]);
        }
        function detachListeners() {
            for (const [t, e, f, o] of listeners) t.removeEventListener(e, f, o);
            listeners.length = 0;
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            if (resizeObs) { resizeObs.disconnect(); resizeObs = null; }
            if (intersectObs) { intersectObs.disconnect(); intersectObs = null; }
        }

        if (follow && !hardFrozen) {
            addListener(window, 'scroll', scheduleRecompute, { passive: true });
            addListener(window, 'resize', scheduleRecompute, { passive: true });
        }

        let resizeObs = null, intersectObs = null;
        if (useObservers && follow && !hardFrozen && el instanceof Element) {
            if ('ResizeObserver' in window) {
                resizeObs = new ResizeObserver(() => scheduleRecompute());
                resizeObs.observe(el);
            }
            if ('IntersectionObserver' in window) {
                intersectObs = new IntersectionObserver(() => scheduleRecompute(), { root: null, threshold: [0, 0.01, 1] });
                intersectObs.observe(el);
            }
        }

        return {
            anchor,
            freezeNow() {
                const r = anchor.getBoundingClientRect();
                positionFromRect(r);
                lastGoodRect = r;
                hardFrozen = true;
                detachListeners();
            },
            updateFromElement() {
                if (hardFrozen) return;
                const r = measure();
                if (r && !isZeroRect(r)) {
                    lastGoodRect = r;
                    positionFromRect(r);
                } else if (lastGoodRect) {
                    positionFromRect(lastGoodRect);
                } else {
                    positionFromRect(initialRect);
                }
            },
            destroy() {
                detachListeners();
                anchor.remove();
            }
        };
    }

    // NEW: collect all scrollable ancestors so we can react when any of them scrolls
    function getScrollableAncestors(el) {
        const list = [];
        const overflowRe = /(auto|scroll|overlay)/;
        let p = el && el.parentElement;
        while (p && p !== document.body) {
            const cs = getComputedStyle(p);
            if (overflowRe.test(cs.overflowY) || overflowRe.test(cs.overflowX)) list.push(p);
            p = p.parentElement;
        }
        list.push(window); // always include window
        return list;
    }

    // NEW: drive repositioning—updates dummy rect and asks Popper to recompute placement
    function setupAutoReposition(tippyInst, target, dummy) {
        let rafId = null;
        const schedule = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                // 1) move dummy to current element rect
                dummy.updateFromElement();
                // 2) tell Popper/Tippy to recalc
                if (tippyInst.popperInstance) {
                    tippyInst.popperInstance.update(); // or .forceUpdate()
                }
            });
        };

        const listeners = [];
        const add = (node, evt, opts) => {
            node.addEventListener(evt, schedule, opts);
            listeners.push([node, evt, schedule, opts]);
        };

        // listen to ALL scrollable ancestors
        for (const a of getScrollableAncestors(target)) {
            add(a, 'scroll', { passive: true });
            if (a === window) add(a, 'resize', { passive: true });
        }

        // observe size/layout changes on the target
        let ro = null;
        if ('ResizeObserver' in window && target instanceof Element) {
            ro = new ResizeObserver(schedule);
            ro.observe(target);
        }

        // intersection changes often indicate virtualized list swaps in Workday
        let io = null;
        if ('IntersectionObserver' in window && target instanceof Element) {
            io = new IntersectionObserver(schedule, { root: null, threshold: [0, 0.01, 1] });
            io.observe(target);
        }

        // style/class changes may reflow layout
        const mo = new MutationObserver(schedule);
        if (target instanceof Element) {
            mo.observe(target, { attributes: true, attributeFilter: ['style', 'class'] });
        }

        // run once now
        schedule();

        // teardown API
        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            for (const [n, e, f, o] of listeners) n.removeEventListener(e, f, o);
            if (ro) ro.disconnect();
            if (io) io.disconnect();
            mo.disconnect();
        };
    }

    // ---------------------------
    // main flow
    // ---------------------------

    if (!isElementVisibleNewInner(_element)) {
        _element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }

    function showDialog(title, content) {
        // Ensure trigger element exists
        let trigger = document.getElementById('dialogTrigger');
        if (!trigger) {
            trigger = document.createElement("div");
            trigger.id = "dialogTrigger";
            document.body.appendChild(trigger);
        }

        trigger.style.position = 'fixed';
        trigger.style.left = "50%";
        trigger.style.top = "50%";
        trigger.style.transform = 'translateX(-50%, -50%)';
        trigger.style.width = '1px';
        trigger.style.height = '1px';

        // Create dialog HTML
        const dialogHTML = `
            <div style="padding:12px; max-width:300px; text-align:center; word-wrap:break-word; overflow-wrap:break-word; white-space:normal;">
                <h3 style="margin:0 0 8px 0; font-size:16px; color:#FFE4B5;">${title}</h3>
                <p style="margin:0 0 12px 0; color:white;">${content}</p>
                <button id="okBtn" style="padding:6px 12px; cursor:pointer;">OK</button>
            </div>
        `;

        // Destroy any previous instance
        if (trigger._tippy) {
            trigger._tippy.destroy();
        }

        // Create new Tippy instance
        const instance = tippy(trigger, {
            content: dialogHTML,
            allowHTML: true,
            interactive: true,
            trigger: 'manual',
            placement: 'auto',
            hideOnClick: false,
            arrow: false,
            popperOptions: {
                strategy: 'fixed',
                modifiers: [
                    {
                        name: 'flip',
                        options: {
                            // Restrict auto to vertical choices so it can go up or down
                            allowedAutoPlacements: ['top', 'bottom'],
                            // If a preferred side is needed, we could set placement:'top' and use:
                            // fallbackPlacements: ['bottom']
                        }
                    },
                    {
                        name: 'preventOverflow',
                        options: {
                            boundary: 'viewport', // keep inside the viewport
                            altAxis: true         // also shift on cross axis if needed
                        }
                    }
                ]
            },
            // Keep position updated if sizes/layout change
            sticky: true,
            onShown(inst) {
                // Ensure latest measurements for correct flip/shift
                if (inst.popperInstance && inst.popperInstance.update) {
                    inst.popperInstance.update();
                }
                const okBtn = inst.popper.querySelector('#okBtn');
                if (okBtn) okBtn.addEventListener('click', () => inst.hide());
            }
        });
        hideAlertTooltip();
        showAlertTooltip(instance);
        setAlertTooltip(instance);
    }

    setTimeout(function () {
        let target = _element;
        let panel = getMainPanel(target);

        console.log("Current Data", _currentData);
        const stepNoteDetail = _currentData.contentCallouts.find(c => c.calloutType === "HOT_TIP")?.content;

        const alertMessage = _currentData.contentCallouts.find(c => c.calloutType === "ALERT")?.content;
        if (alertMessage != null) {
            showDialog("Opkey Nav Assist Alert",alertMessage);
        }

        // we'll inject our auto-reposition wiring in onShow/onHide
        const tippyConfigObject = {
            content: generateContent(stepDetail, stepNoteDetail),
            theme: 'light',
            allowHTML: true,
            interactive: true,
            placement: 'auto',
            trigger: 'manual',
            zIndex: 2147483647,
            hideOnClick: false,
            ignoreAttributes: true,
            appendTo: (ref) => panel,
            popperOptions: { strategy: 'fixed' },
            onCreate(instance) {
                const pop = instance.popper;
                const strip = () => pop.removeAttribute('tabindex');
                strip();
                const mo = new MutationObserver(strip);
                mo.observe(pop, { attributes: true, attributeFilter: ['tabindex'] });
                instance._noTabMo = mo;
            },
            onShow(instance) {
                instance.popper.style.zIndex = '2147483647';
                instance.popper.style.pointerEvents = 'auto';

                armWorkdayGuard(instance, panel, target);
                attachEventListenersScoped(instance);
                enableOrDisablePreviousNextButton(currentStepNo, arrayLength);

                // NEW: start following target on scroll/resize/layout changes
                if (!instance._teardownFollow && instance.reference && instance.reference.__dummyApi) {
                    instance._teardownFollow = setupAutoReposition(instance, target, instance.reference.__dummyApi);
                } else if (!instance._teardownFollow && dummyApi) {
                    // fallback if reference is not patched (shouldn't happen)
                    instance._teardownFollow = setupAutoReposition(instance, target, dummyApi);
                }
            },
            onHide(instance) {
                disarmWorkdayGuard(instance);
                if (instance._teardownFollow) {
                    instance._teardownFollow();
                    instance._teardownFollow = null;
                }
            }
        };

        // keep your sibling logic
        let sibling = method_getSiblingElement(target);
        if (sibling != null) {
            target = sibling;
        }

        tippyConfigObject["placement"] = getTooltipPosition(target);

        // create the fixed dummy anchor; we'll control updates via setupAutoReposition
        const dummy = createDummyAnchorFromElement(target, {
            freeze: false,
            follow: false,          // IMPORTANT: we'll do updates ourselves + call popper.update()
            container: document.body
        });

        // expose dummy API to onShow via the tippy reference node
        dummy.anchor.__dummyApi = {
            updateFromElement: dummy.updateFromElement,
            destroy: dummy.destroy
        };
        const dummyApi = dummy.anchor.__dummyApi;

        // build tooltip on the dummy (fixed) anchor
        const tooltip = tippy(dummy.anchor, tippyConfigObject);

        hideToolTipElement();
        showToolTipElement(tooltip);
        setTooltipElement(tooltip);

    }, 1000);
}


function getTippyOffSet(target, placement) {
    let isTop = false;
    let isBottom = false;
    if (placement.indexOf("top") > -1) {
        isTop = true;
    }
    else if (placement.indexOf("bottom") > -1) {
        isBottom = true;
    }
    if (isToolTipWillOverlapElement(target)) {
        if (isTop == true) {
            return [0, -10];
        }
        else if (isBottom == true) {
            return [0, 10];
        }
        return [50, 0];
    }

    return [0, 10];
}

function method_getSiblingElement(_element) {
    // Return null if element is null/undefined or not an Element
    if (!_element || _element.nodeType !== 1) return null;

    const labelId = (_element.id || "").trim();
    const labelFor = (_element.getAttribute && _element.getAttribute("for")) || "";

    // Visible = has layout box and not hidden
    const isVisible = (el) => {
        const cs = window.getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
    };

    // Walk the DOM in *document order* starting right after _element
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT
    );

    // Advance to the label node first
    let node = walker.nextNode();
    while (node && node !== _element) node = walker.nextNode();

    // Then continue to the next nodes looking for the first matching input
    while ((node = walker.nextNode())) {
        //  if (node.tagName === "INPUT") {
        const input = node;

        // 1) aria-labelledby contains label's id (space-separated tokens)
        let matchesAria = false;
        if (labelId) {
            const al = input.getAttribute("aria-labelledby");
            if (al) {
                const tokens = al.trim().split(/\s+/);
                matchesAria = tokens.includes(labelId);
            }
        }

        // 2) label[for] === input.id
        const matchesFor = labelFor && input.id && labelFor === input.id;

        // 3) input.id === label.id (element id compare)
        const matchesIdEq = labelId && input.id && input.id === labelId;

        if ((matchesAria || matchesFor || matchesIdEq) && isVisible(input)) {
            return input;
        }
        //    }
    }

    return null; // nothing matched
}





function isToolTipWillOverlapElement(_element) {
    if (_element == null) {
        return false;
    }

    let dataUxWidgetType = _element.getAttribute("data-uxi-widget-type");

    if (dataUxWidgetType != null) {
        if (dataUxWidgetType === "selectinput") {
            return true;
        }
    }

    return false;
}

function getTooltipPosition(_element) {
    if (_element == null) {
        return "top-end";
    }

    if (_element.nodeName == "LABEL") {
        return "top-end";
    }

    return "top-end";
}


function generateContent(text, stepNoteDetail) {
    const uniqueId = 'info-icon-' + Math.random().toString(36).substr(2, 9);

    const iconHtml = stepNoteDetail
        ? `<span id="${uniqueId}" 
                 style="cursor:pointer; font-weight:bold; color:#0073e6; font-size:14px;">
              ℹ️
           </span>`
        : '';

    const html = `
      <div style="position: relative; max-width: 450px;">
        ${stepNoteDetail ? 
            `<div style="position: absolute; top: 0; right: 0;">
                ${iconHtml}
             </div>` 
            : ''}
        <div style="padding-right: 25px; white-space: normal; word-break: break-word; max-width: 100%;">
          ${text}
        </div>
        <div class="tour-buttons" style="margin-top: 8px;">
          <button id="obiqcmpapp_closeBtn" title="Close">&#10006;</button>
          <button id="obiqcmpapp_prevBtn" title="Previous">&#129128;</button>
          <button id="obiqcmpapp_nextBtn" title="Next">&#129130;</button>
        </div>
      </div>
    `;

    if (stepNoteDetail) {
        setTimeout(() => {
            const iconEl = document.getElementById(uniqueId);
            if (iconEl) {
                tippy(iconEl, {
                    content: `<div style="white-space: normal; word-break: break-word; max-width: 350px;">
                                ${stepNoteDetail}
                              </div>`,
                    theme: 'rect-tooltip',
                    placement: 'bottom-start',
                    maxWidth: '350px',
                    allowHTML: true,
                    interactive: true,
                    offset: [0, 8]
                });
            }
        }, 0);
    }

    return html;
}



function attachEventListenersScoped(instance) {
    setTimeout(() => {
        const root = instance.popper;
        const prevBtn = root.querySelector('#obiqcmpapp_prevBtn');
        const nextBtn = root.querySelector('#obiqcmpapp_nextBtn');
        const closeBtn = root.querySelector('#obiqcmpapp_closeBtn');

        // keep the mousedown guard to avoid focus changes
        const guardDown = (e) => { e.preventDefault(); e.stopImmediatePropagation(); };
        [prevBtn, nextBtn, closeBtn].forEach(el => {
            el?.addEventListener('mousedown', guardDown, { capture: true, passive: false });
            el?.addEventListener('touchstart', guardDown, { capture: true, passive: false });
        });

        // clicks now fire normally on the target, then bubble gets hushed at popper
        prevBtn?.addEventListener('click', (e) => { sendMovePreviousStepDataToCompanionApp(); });
        nextBtn?.addEventListener('click', (e) => { sendMoveNextStepDataToCompanionApp(); });
        closeBtn?.addEventListener('click', (e) => { instance.hide(); });
    }, 0);
}




function setAlertTooltip(element) {
    lastAlertTooltip = element;
}

function hideAlertTooltip() {
    if (lastAlertTooltip != null) {
        lastAlertTooltip.hide();
        lastAlertTooltip = null;
    }
}

function showAlertTooltip(element) {
    element.show();
}

function setTooltipElement(element) {
    lastTooltipElement = element;
}

function hideToolTipElement() {
    if (lastTooltipElement != null) {
        lastTooltipElement.hide();
        lastTooltipElement = null;
    }
}

function showToolTipElement(element) {
    element.show();
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "HIDE_TOOL_TIP") {
    hideToolTipElement();
  }
});

function waitForCursorInactive(timeoutMs, checkIntervalMs = 50) {

    function isWaitCursor(cursorStyle) {
        if (cursorStyle == null) {
            return false;
        }
        const waitCursors = ['wait', 'progress', 'wait-continue', 'wait-reverse'];
        return waitCursors.includes(cursorStyle);
    }

    return new Promise((resolve, reject) => {
        let waitCursorActive = false;

        const checkCursor = () => {
            try {
                const computedStyle = window.getComputedStyle(document.body);
                if (isWaitCursor(computedStyle.cursor)) {
                    waitCursorActive = true;
                    showDebugLogNew("waitCursorActive " + waitCursorActive);
                } else {
                    waitCursorActive = false;
                    showDebugLogNew("waitCursorActive " + waitCursorActive);
                    debugger
                    clearInterval(intervalId);
                    clearTimeout(timeoutId);
                    resolve();
                }
            } catch (e) {
                resolve();
            }
        };

        const intervalId = setInterval(checkCursor, checkIntervalMs);

        const timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            showConsoleLog("waitCursorActive did not become false within timeout.");
            resolve();
        }, timeoutMs);

        checkCursor();
    });
}

function findUniqueElementByText(options) {
    if (!options.tag) {
        console.error("Tag name is required.");
        return null;
    }
    const { tag, sahiText, textContent, innerText, alt, title } = options;

    // Helper function to escape quotes in XPath strings
    function escapeXPathString(str) {
        if (str.includes("'") && str.includes('"')) {
            const parts = str.split("'");
            return "concat('" + parts.join("', \"'\", '") + "')";
        }
        if (str.includes("'")) {
            return `"${str}"`;
        }
        return `'${str}'`;
    }

    // Array to hold XPath expressions in order of priority
    const xpaths = [];

    // 1. Tag + sahiText (assuming sahiText corresponds to text())
    if (sahiText) {
        const escapedText = escapeXPathString(sahiText);
        // Text equals
        xpaths.push(`//${tag}[normalize-space(text()) = ${escapedText}]`);
        // Text contains
        xpaths.push(`//${tag}[contains(normalize-space(text()), ${escapedText})]`);
    }

    // 2. Tag + textContent
    if (textContent) {
        const escapedText = escapeXPathString(textContent);
        // Text equals
        xpaths.push(`//${tag}[normalize-space(text()) = ${escapedText}]`);
        // Text contains
        xpaths.push(`//${tag}[contains(normalize-space(text()), ${escapedText})]`);
    }

    // 3. Tag + innerText
    if (innerText) {
        const escapedText = escapeXPathString(innerText);
        // Text equals
        xpaths.push(`//${tag}[normalize-space(text()) = ${escapedText}]`);
        // Text contains
        xpaths.push(`//${tag}[contains(normalize-space(text()), ${escapedText})]`);
    }

    // 4. Tag + alt attribute
    if (alt) {
        const escapedAlt = escapeXPathString(alt);
        // Alt equals
        xpaths.push(`//${tag}[@alt = ${escapedAlt}]`);
        // Alt contains
        xpaths.push(`//${tag}[contains(@alt, ${escapedAlt})]`);
    }

    // 5. Tag + title attribute
    if (title) {
        const escapedTitle = escapeXPathString(title);
        // Title equals
        xpaths.push(`//${tag}[@title = ${escapedTitle}]`);
        // Title contains
        xpaths.push(`//${tag}[contains(@title, ${escapedTitle})]`);
    }

    // Function to evaluate XPath and return matching elements
    function evaluateXPath(xpath) {
        const result = [];
        const xpathResult = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        for (let i = 0; i < xpathResult.snapshotLength; i++) {
            result.push(xpathResult.snapshotItem(i));
        }
        return result;
    }

    // Iterate through XPath expressions and return the first unique match
    for (const xpath of xpaths) {
        const elements = evaluateXPath(xpath);
        if (elements.length === 1) {
            return elements[0];
        }
        if (elements.length > 1) {
            let filteredElements = [];
            for (const element of elements) {
                if (!isRectAllZero(element.getBoundingClientRect())) {
                    filteredElements.push(element);
                }
            }
            if (filteredElements.length === 1) {
                return filteredElements[0];
            }
        }
    }

    return null;
}


function findElementsByParsedText(str, useContains = false, isUnique = false, isVisible = false) {
    const m = str.match(/'([^']+)'/);
    if (!m) return null;
    let text = m[1];

    text = text.replace(/[0-9]/g, '').replace(/[()]/g, '').trim();
    if (!text) return null;

    const quoted = `'${text}'`;
    const tags = ['input', 'button', 'a', 'label', 'span'];
    const found = [];

    for (const tag of tags) {
        let xpath;
        if (tag === 'input') {
            xpath = useContains
                ? `//input[starts-with(normalize-space(@value), ${quoted})]`
                : `//input[normalize-space(@value) = ${quoted}]`;
        } else {
            xpath = useContains
                ? `//${tag}[starts-with(normalize-space(.), ${quoted})]`
                : `//${tag}[normalize-space(.) = ${quoted}]`;
        }

        const res = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        for (let i = 0; i < res.snapshotLength; i++) {
            found.push(res.snapshotItem(i));
        }
    }

    if (!found.length) return null;

    // filter out parents — keep only deepest nodes
    const deepest = found.filter(node =>
        !found.some(other => other !== node && node.contains(other))
    );

    deepest.sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    );

    if (isUnique && deepest.length !== 1) {
        return null;
    }

    if (isVisible == true) {
        let clientRect = deepest[0].getBoundingClientRect();
        if (clientRect.width == 0 && clientRect.width == 0) {
            return null;
        }
    }

    return deepest[0] ?? null;
}



function findUniqueElement(elementObj) {
    // List of XPath keys in the order of priority
    const xpathKeys = [
        "xpath:customAttributes",
        "xpath:attributes",
        "xpath:idRelative",
        "xpath:position"
    ];

    // Helper function to evaluate XPath and return matching elements
    function evaluateXPath(xpath) {
        try {
            const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            const elements = [];
            for (let i = 0; i < result.snapshotLength; i++) {
                elements.push(result.snapshotItem(i));
            }
            return elements;
        } catch (error) {
            console.error(`Invalid XPath: ${xpath}`, error);
            return [];
        }
    }

    // Attempt to find the element using existing XPaths
    for (const key of xpathKeys) {
        if (elementObj[key]) {
            const elements = evaluateXPath(elementObj[key]);

            if (elements.length === 1) {
                console.log("Found By " + elementObj[key]);
                return elements[0];
            }
        }
    }

    // If no unique element is found using existing XPaths, attempt to create a new unique XPath
    // Collect unique attributes to build the XPath
    const uniqueAttributes = {
        id: elementObj.id || null,
        'aria-label': elementObj['xpath:customAttributes'] ? extractAttribute(elementObj['xpath:customAttributes'], 'aria-label') : null,
        placeholder: elementObj.placeholder || null,
        type: elementObj.type || null,
        name: elementObj.name || null,
        // Add other unique attributes as needed
    };

    // Helper function to extract attribute value from XPath
    function extractAttribute(xpath, attribute) {
        const match = xpath.match(new RegExp(`${attribute}=['"]([^'"]+)['"]`));
        return match ? match[1] : null;
    }

    // Build XPath based on available unique attributes
    let constructedXPath = "//" + elementObj["tag"];
    const conditions = [];

    for (const [attr, value] of Object.entries(uniqueAttributes)) {
        if (value) {
            conditions.push(`@${attr}='${value}'`);
        }
    }

    if (conditions.length > 0) {
        constructedXPath += "[" + conditions.join(" and ") + "]";
    }

    // Evaluate the constructed XPath
    const constructedElements = evaluateXPath(constructedXPath);

    if (constructedElements.length === 1) {
        console.log("Found By " + constructedXPath);
        return constructedElements[0];
    }

    return null;
}

function isElementVisibleByCSSNew(element) {
    //need to check this code due to this some elemnts was not able to find
    if (true) {
        return true;
    }
    if (!(element instanceof HTMLElement)) {
        return false;
    }

    let clientBounds = element.getBoundingClientRect();
    return clientBounds.width > 0 && clientBounds.height > 0;
}

function checkNavigationDrawerOpened() {
    return new Promise((resolve) => {
        const xpath = "//a[contains(@class, 'svg-navmenu') and contains(normalize-space(.), 'Home')]";
        const timeoutDuration = 5000; // Total time to keep retrying (in milliseconds)
        const retryInterval = 100;    // Time between retries (in milliseconds)
        const startTime = Date.now();

        /**
         * Attempts to find and verify the visibility of the target element.
         * If not found, schedules the next retry until the timeout is reached.
         */
        function attemptFind() {
            const result = document.evaluate(
                xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            );

            const element = result.singleNodeValue;

            if (element) {
                const rect = element.getBoundingClientRect();
                const isVisible = rect.width > 0 && rect.height > 0;
                if (isVisible == true) {
                    resolve(isVisible);
                }
            } else {
                const elapsedTime = Date.now() - startTime;
                if (elapsedTime >= timeoutDuration) {
                    resolve(false);
                } else {
                    setTimeout(attemptFind, retryInterval);
                }
            }
        }

        // Start the first attempt to find the element
        attemptFind();
    });
}

function isElementVisibleNewInner(el) {
    if (!el) return false;

    // Check CSS properties
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
        return false;
    }

    // Function to determine if the entire element is within the visible bounds of a container
    function isFullyVisibleWithin(el, container) {
        const elRect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        return (
            elRect.top >= containerRect.top &&
            elRect.bottom <= containerRect.bottom &&
            elRect.left >= containerRect.left &&
            elRect.right <= containerRect.right
        );
    }

    // Check full visibility against all scrollable parents
    let currentElement = el;
    while (currentElement) {
        const parent = currentElement.parentElement;
        if (!parent) break;

        const style = getComputedStyle(parent);
        const isScrollable = /(auto|scroll|overlay)/.test(
            style.overflow + style.overflowY + style.overflowX
        );

        if (isScrollable) {
            if (!isFullyVisibleWithin(el, parent)) {
                return false;
            }
        }

        currentElement = parent;
    }

    // Finally, check full visibility within the viewport
    const viewportRect = {
        top: 0,
        left: 0,
        bottom: window.innerHeight || document.documentElement.clientHeight,
        right: window.innerWidth || document.documentElement.clientWidth
    };

    const elRect = el.getBoundingClientRect();

    return (
        elRect.top >= viewportRect.top &&
        elRect.bottom <= viewportRect.bottom &&
        elRect.left >= viewportRect.left &&
        elRect.right <= viewportRect.right
    );
}

function waitForPageFullyReady(timeout = 30000, stableDuration = 500, titleStableDuration = 2000) {
    return new Promise((resolve, reject) => {
        let timer = setTimeout(() => {
            cleanup();
            reject(new Error('waitForPageFullyReady: Timeout reached.'));
        }, timeout);

        let isPageLoaded = false;
        let isDomStable = false;
        let isTitleStable = false;
        let lastKnownTitle = document.title;
        let titleObserver = null;
        let titleStabilityTimer = null;

        // Universal Fusion Page Readiness Check (works for Redwood and non-Redwood)
        function isPageVisiblyReady() {
            // Redwood-style page container
            const redwoodRoot = document.querySelector('.oracle-fusion-redwood-page, oj-app, oj-router');

            // Classic/Legacy UI container (e.g., common table or content wrappers)
            const classicContent = document.querySelector('#pt1\\:main, #contentArea, .x1u');

            // If no recognizable container exists, assume no special UI so far
            if (redwoodRoot == null && classicContent == null) {
                return true;
            }
            // Common Oracle loading indicators
            const loadingIndicators = document.querySelector(
                '.oj-progress-bar, .oj-spinner, .loading-spinner, .af_busyWait, [id*="Busy"]'
            );

            const hasContent = redwoodRoot || classicContent;
            const isLoading = !!loadingIndicators;

            return hasContent && !isLoading;
        }

        function checkConditions() {
            showConsoleLog("isPageLoaded: " + isPageLoaded + " | isDomStable: " + isDomStable + " | isTitleStable: " + isTitleStable);
            if (!isPageLoaded || !isDomStable || !isTitleStable) return;

            if (!isPageVisiblyReady()) {
                showConsoleLog("Page visually not ready (UI content/spinner check failed)");
                return;
            }

            clearTimeout(timer);
            cleanup();
            resolve();
        }

        // Page Load Detection
        function onLoad() {
            isPageLoaded = true;
            // Instead of using a MutationObserver to detect DOM stability,
            // assume the DOM is stable after a brief delay.
            setTimeout(() => {
                isDomStable = true;
                setupTitleObserver();
                checkConditions();
            }, stableDuration);
        }

        if (document.readyState === 'complete') {
            onLoad();
        } else {
            window.addEventListener('load', onLoad);
        }

        // Title Observer: waits for title changes to settle
        function setupTitleObserver() {
            const titleElement = document.querySelector('title');
            if (!titleElement) {
                // No title element? Assume it's stable.
                isTitleStable = true;
                return;
            }
            titleObserver = new MutationObserver(() => {
                const currentTitle = document.title;
                if (currentTitle !== lastKnownTitle) {
                    lastKnownTitle = currentTitle;
                    if (titleStabilityTimer) clearTimeout(titleStabilityTimer);
                    isTitleStable = false;
                    titleStabilityTimer = setTimeout(() => {
                        isTitleStable = true;
                        titleObserver.disconnect();
                        checkConditions();
                    }, titleStableDuration);
                }
            });
            titleObserver.observe(titleElement, {
                childList: true,
                subtree: true
            });
            // If the title doesn't change at all, mark it stable after the duration.
            if (!titleStabilityTimer) {
                titleStabilityTimer = setTimeout(() => {
                    isTitleStable = true;
                    checkConditions();
                }, titleStableDuration);
            }
        }

        // Cleanup all observers and event listeners
        function cleanup() {
            if (titleObserver) titleObserver.disconnect();
            if (titleStabilityTimer) clearTimeout(titleStabilityTimer);
            window.removeEventListener('load', onLoad);
        }
    });
}