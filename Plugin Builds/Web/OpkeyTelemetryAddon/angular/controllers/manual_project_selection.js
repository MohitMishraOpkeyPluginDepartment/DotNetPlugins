
angular.module('myApp').controller("manual_project_selection_ctrl", ['$rootScope', '$scope', '$state', 'ServiceFactory', 'DataFactory', '$ocLazyLoad',
    function ($rootScope, $scope, $state, serviceFactory, dataFactory, $ocLazyLoad) {

        $rootScope.scope_manual_project_ctrl = $scope;

        $scope.Manual_create_view_option_type = null;

        $scope.Load_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_View", Load_View);
        };


        function Load_View() {
            $("#div_panelOptions").hide();
            $(".navbar.navbar-default").hide();
            $("#Main_HomeBanner").hide();
            $("#div_footer_tutoriol").hide();
            bind_project_DDL();
            get_assigned_project();

            check_for_response();

        }

        $(function () {
            chrome.runtime.sendMessage({
                IsDockerUIShowing: "IsDockerUIShowing"
            }, function (response) {
                if (chrome.runtime.lastError) { }
                if (response != null) {
                    if (response == true) {
                        $("#showDockerButton").prop('checked', true);
                        $("#showDockerButton").prop('title', "Disable Docker");
                    }
                    else {
                        $("#showDockerButton").prop('checked', false);
                        $("#showDockerButton").prop('title', "Enable Docker");
                    }
                }
            });

            $(".label_toggle_btn").on('keyup', function (e) {
                if (e.keyCode == 13) {
                    $scope.toggle_docker(!$("#showDockerButton").prop('checked'));
                }
            })
        });

        function get_assigned_project() {
            opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

            var current_project_id = $rootScope.Scope_Main.Get_Opkey_URL("SELECTED_PROJECT_PID");

            if (current_project_id == null || current_project_id == "") {
                current_project_id = dataFactory.EmptyGuid;
            }
            if (opkey_end_point.indexOf('com/') == -1) {
                opkey_end_point = opkey_end_point + '/';
            }
            $(".current_User_DD_img").prop('src', opkey_end_point + "user/getavatar/" + dataFactory.userDTO?.U_ID);
            $("#current_User_name").html(dataFactory.userDTO?.Name);
            $("#current_User_email_ID").html(dataFactory.userDTO?.email_ID);

            loadingStart("#manual_project_selection_wrapper", "Please Wait ...", ".btnTestLoader");
            $.ajax({
                url: opkey_end_point + "/OpkeyApi/GetListOfAssignedProject",
                type: "GET",
                success: function (result) {
                    debugger;
                    loadingStop("#manual_project_selection_wrapper", ".btnTestLoader");


                    $("#manual_project_ddl").data('kendoDropDownList').dataSource.data(result);
                    if (current_project_id == dataFactory.EmptyGuid) {
                        $("#manual_project_ddl").data('kendoDropDownList').value(result[0].P_ID);
                        $scope.choose_project(result[0].P_ID, result[0].Name);
                    }
                    else {
                        $("#manual_project_ddl").data('kendoDropDownList').value(current_project_id);
                    }



                },
                error: function (error) {
                    loadingStop("#manual_project_selection_wrapper", ".btnTestLoader");
                    if (error != null) {
                        if (JSON.stringify(error).indexOf("Session is terminated") > -1) {
                            $.msgBox({
                                title: "Opkey",
                                content: "<h5>You have logged in from a different location !</h5><br><h6>Please click on Log In to go to the Login Page.</h6>",
                                modal: true,
                                type: "info",
                                buttons: [{ value: "Login" }],
                                success: function (result) {
                                    $scope.ChangePageView("options.login");
                                }

                            });
                            return;
                        }
                    }
                    localStorage.clear();
                    serviceFactory.showError($scope, error);
                    $("#spErrorMessage").text("Unable to Connect to Given Domain");
                    $("#divPanelErrorMessage").show();
                }
            });
        }

        function bind_project_DDL() {
            $("#manual_project_ddl").kendoDropDownList({
                dataSource: [],
                filter: "contains",
                dataTextField: "Name",
                dataValueField: "P_ID",
                valueTemplate: function (e) {

                    let html = "<span title='" + e.Name + "'>" + e.Name + "</span>";
                    return html;
                },
                template: function (e) {
                    let html = "<span title= '" + e.Name + "'>" + e.Name + "</span>";
                    return html;
                },
                select: function (e) {
                    debugger;
                    $scope.choose_project(e.dataItem.P_ID, e.dataItem.Name);
                }
            });

            let manual_project_ddl_wrapper = $("#manual_project_ddl").data("kendoDropDownList").wrapper;

            manual_project_ddl_wrapper.keydown(function (e) {
                if (e.keyCode == 13) {
                    $("#manual_project_ddl").data("kendoDropDownList").toggle();
                }
            });
        }

        $scope.Log_Out_view = function () {
            if (IsRecordingInProgress) {
                serviceFactory.notifier($scope, 'Capture ' + get_inprogress_Recordinf_type() + ' is in progress', 'warning');
                chrome.runtime.sendMessage({
                    ShowVideoEditorInFront: "ShowVideoEditorInFront"
                }, function (response) { });
                return;
            }
            $scope.Log_Out();
        }

        $scope.choose_project = function (projectId, projectName) {
            debugger;
            if (IsRecordingInProgress) {
                serviceFactory.notifier($scope, 'Capture ' + get_inprogress_Recordinf_type() + ' is in progress', 'warning');
                chrome.runtime.sendMessage({
                    ShowVideoEditorInFront: "ShowVideoEditorInFront"
                }, function (response) { });
                return;
            }

            opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");
            var remember_me = true;

            loadingStart("#manual_project_selection_wrapper", "Please Wait ...", ".btnTestLoader");
            $.ajax({
                url: opkey_end_point + "/OpkeyApi/ChooseProject",
                data: { projectId: projectId, remember_project_selection: remember_me },
                type: "GET",
                success: function (result) {
                    debugger;
                    loadingStop("#manual_project_selection_wrapper", ".btnTestLoader");
                    //$("#li_project_info").show();

                    $("#li_project_info").attr('title', 'Switch Project (' + projectName + ')'); //Tooltip should be according to selected project
                    if (projectName.length > 15) {
                        projectName = projectName.substring(0, 15)
                            + "...";
                    }

                    serviceFactory.SetGlobalSetting("OPKEY_PROJECT_NAME", projectName);
                    serviceFactory.SetGlobalSetting("SELECTED_PROJECT_PID", projectId);



                    $("#sp_project_info").text(projectName);

                    //$("#divPanel_Options").removeClass("disabled");
                    //$scope.ChangePageView('options.recording_selection');
                },
                error: function (error) {
                    loadingStop("#manual_project_selection_wrapper", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });
        }

        $scope.toggle_docker = function (isEnable) {
            debugger;
            if (!validate_project()) {
                $("#showDockerButton").prop("checked", !isEnable);
                $("#showDockerButton").prop('title', isEnable ? "Disable Docker" : "Enable Docker");
                return false;
            }


            if (IsRecordingInProgress) {
                $("#showDockerButton").prop("checked", !isEnable);
                $("#showDockerButton").prop('title', isEnable ? "Disable Docker" : "Enable Docker");
                serviceFactory.notifier($scope, 'Capture ' + get_inprogress_Recordinf_type() + ' is in progress', 'warning');
                chrome.runtime.sendMessage({
                    ShowVideoEditorInFront: "ShowVideoEditorInFront"
                }, function (response) { });
                return;
            }

            if (isEnable) {
                $.msgBox({
                    title: "Opkey",
                    content: "Allow addon to access your browser.",
                    modal: true,
                    type: "confirm",
                    buttons: [{ value: "Allow" }, { value: "Cancel" }],
                    success: function (result) {
                        if (result === "Allow") {
                            chrome.runtime.sendMessage({
                                EnableQlmManualAddonDocker: "EnableQlmManualAddonDocker"
                            }, function (response) {
                                if (chrome.runtime.lastError) { }
                                $("#showDockerButton").prop("checked", true);
                                $("#showDockerButton").prop('title', "Disable Docker");
                            });

                        }
                        else {
                            $("#showDockerButton").prop("checked", false);
                            $("#showDockerButton").prop('title', "Enable Docker");
                        }
                    }
                });
            }
            else {

                $.msgBox({
                    title: "Opkey",
                    content: "You will no longer be able to use the docker feature if you disable this feature.",
                    modal: true,
                    type: "confirm",
                    buttons: [{ value: "Disable" }, { value: "Cancel" }],
                    success: function (result) {
                        if (result === "Disable") {
                            chrome.runtime.sendMessage({
                                DisableQlmManualAddonDocker: "DisableQlmManualAddonDocker"
                            }, function (response) {
                                if (chrome.runtime.lastError) { }
                                $("#showDockerButton").prop("checked", false);
                                $("#showDockerButton").prop('title', "Enable Docker");
                            });
                        }
                        else {
                            $("#showDockerButton").prop("checked", true);
                            $("#showDockerButton").prop('title', "Disable Docker");
                        }
                    }
                });
            }
        }


        $scope.open_create_view = function (type) {
            if (!validate_project()) {
                return false;
            }


            if (IsRecordingInProgress) {
                serviceFactory.notifier($scope, 'Capture ' + get_inprogress_Recordinf_type() + ' is in progress', 'warning');
                chrome.runtime.sendMessage({
                    ShowVideoEditorInFront: "ShowVideoEditorInFront"
                }, function (response) { });
                return;
            }

            let data = { type: type, current_TestCase: null, Attachment_data: [], Issue_data: null, CallSource: "options.Manual_project_selection" };
            serviceFactory.SetCallSourceInDataFactory(data, "Manual_Create_view_data");

            $scope.ChangePageView("options.Manual_create_view");
        }

        $scope.open_AUTOFL_window = function () {
            debugger;
            let overlayDiv = document.createElement("div");
            overlayDiv.style.position = "fixed";
            overlayDiv.style.top = "0";
            overlayDiv.style.left = "0";
            overlayDiv.style.width = "100%";
            overlayDiv.style.height = "100%";
            overlayDiv.style.background = "rgba(0, 0, 0, 0.5)";
            overlayDiv.style.zIndex = "999";
            overlayDiv.style.display = "block";
            overlayDiv.style.opacity = "0.5";

            let popup = document.createElement("div");
            popup.style.position = "fixed";
            popup.style.top = "50%";
            popup.style.left = "50%";
            popup.style.transform = "translate(-50%, -50%)";
            popup.style.background = "#fff";
            popup.style.padding = "20px";
            popup.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)";
            popup.style.zIndex = "1000";
            popup.style.borderRadius = "8px";
            popup.style.textAlign = "center";
            popup.style.width = "300px";

            function createStyledButton(text, onClickFunction, removeMarginBottom = false) {
                let button = document.createElement("button");
                button.innerText = text;
                button.style.display = "block";
                button.style.width = "100%";
                if (!removeMarginBottom) {
                    button.style.marginBottom = "10px";
                }
                button.style.padding = "10px";
                button.style.border = "none";
                button.style.borderRadius = "5px";
                button.style.fontSize = "16px";
                button.style.cursor = "pointer";
                button.style.background = "#ddd";
                button.style.color = "black";
                button.style.transition = "0.3s";

                button.onmouseover = function () {
                    button.style.background = "#D9D9D9";
                };
                button.onmouseout = function () {
                    button.style.background = "#ddd";
                };

                button.onclick = onClickFunction;
                return button;
            }

            let closeButton = document.createElement("button");
            closeButton.innerText = "X";
            closeButton.style.position = "absolute";
            closeButton.style.top = "-6px";
            closeButton.style.right = "-6px";
            closeButton.style.border = "none";
            closeButton.style.background = "##D9D9D9";
            closeButton.style.color = "#515151";
            closeButton.style.fontSize = "14px";
            closeButton.style.borderRadius = "50%";
            closeButton.style.width = "25px";
            closeButton.style.height = "25px";
            closeButton.style.cursor = "pointer";

            closeButton.title = "Close";

            closeButton.onclick = function () {
                document.body.removeChild(popup);
                document.body.removeChild(overlayDiv);
            };

            popup.appendChild(closeButton);

            let createReusableBtn = createStyledButton(
                "Create Auto Reusable Component",
                function () {
                    chrome.runtime.sendMessage({ OpenAndGenerateAutoFl: "OpenAndGenerateAutoFl" });
                    localStorage.setItem("flagForTestCase", "false");
                    document.body.removeChild(popup);
                    window.close();
                }
            );

            // Button for "Create Auto Test Case"
            let createFLBtn = createStyledButton(
                "Create Auto Test Case",
                function () {
                    chrome.runtime.sendMessage({ OpenAndGenerateAutoFl: "OpenAndGenerateAutoFl" });
                    localStorage.setItem("flagForTestCase", "true");
                    document.body.removeChild(popup);
                    window.close();
                },
                true
            );

            popup.appendChild(createReusableBtn);
            popup.appendChild(createFLBtn);

            document.body.appendChild(overlayDiv);
            document.body.appendChild(popup);
        };

        $scope.open_OOC_window = function () {
            if (IsRecordingInProgress) {
                serviceFactory.notifier($scope, 'Capture ' + get_inprogress_Recordinf_type() + ' is in progress', 'warning');
                chrome.runtime.sendMessage({
                    ShowVideoEditorInFront: "ShowVideoEditorInFront"
                }, function (response) { });
                return;
            }
            chrome.runtime.sendMessage({ StartRecorderAddon: "StartRecorderAddon" }, function (response) { });
            window.close();
        }

        $scope.capture_snapshot_project = function (selectedText) {
            if (is_dropdown_clicked) {
                is_dropdown_clicked = false;
                return false;
            }
            if (!validate_project()) {
                return false;
            }

            if (IsRecordingInProgress) {
                serviceFactory.notifier($scope, 'Capture ' + get_inprogress_Recordinf_type() + ' is in progress', 'warning');
                chrome.runtime.sendMessage({
                    ShowVideoEditorInFront: "ShowVideoEditorInFront"
                }, function (response) { });
                return;
            }

            chrome.runtime.sendMessage({
                ResetVideoUploadStatus: "ResetVideoUploadStatus"
            }, function (response) { });

            var json_addon = {
                "url": $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME"),
                "Result_ID": '',
                "SessionID": '',
                "tc name": '',
                "utility": 'qlm_snapshot_IssueType'
            };

            if (selectedText.indexOf("Visible Area") > -1) {
                json_addon["captureMode"] = "CAPTUREIMGAEVISIBLEAREA";
            }
            else if (selectedText.indexOf("Full Page") > -1) {
                json_addon["captureMode"] = "CAPTUREIMGAEFULLPAGE";
            }
            else if (selectedText.indexOf("Other Window") > -1) {
                window.close();
                json_addon["captureMode"] = "CAPTUREIMGAEOFOTHERWINDOW";
            }
            else {
                json_addon["captureMode"] = "CAPTUREIMGAEFULLPAGE";
            }
            localStorage.removeItem("QLM_Response");
            localStorage.removeItem("OpkeyTestRunnerSnapData");
            localStorage.setItem("OpkeyTestRunnerSnapData", JSON.stringify(json_addon));


            let local_data = {
                GridRow: null,
                GridID: "",
                type: null,
                Issue_data: null,
            }

            localStorage.setItem("capture_step_data", JSON.stringify(local_data));

            $("#snap_loader").show();
            setTimeout(() => {
                check_for_response();
                //check_for_attachment_success();
            }, 800);
        }

        $scope.selected_image_screan = "Capture Visible Part";
        $scope.Unselected_image_screan = "Capture Full Page";

        $scope.set_capture_image_screen = function () {
            debugger;
            $scope.selected_image_screan = $scope.Unselected_image_screan;
            $scope.Unselected_image_screan = $scope.selected_image_screan == "Capture Visible Part" ? "Capture Full Page" : "Capture Visible Part";
            is_dropdown_clicked = false;
        }

        var is_dropdown_clicked = false;
        $scope.open_capture_image_dropdown = function () {
            is_dropdown_clicked = true;
        }
        var is_video_dropdown_clicked = false;
        $scope.open_capture_video_dropdown = function () {
            is_video_dropdown_clicked = true;
        }
        $scope.selected_video_screan = "Record Current Tab";
        $scope.Unselected_video_screan = "Record Other Tabs";

        $scope.set_capture_video_screen = function () {
            debugger;
            $scope.selected_video_screan = $scope.Unselected_video_screan;
            $scope.Unselected_video_screan = $scope.selected_video_screan == "Record Current Tab" ? "Record Other Tabs" : "Record Current Tab";
            is_video_dropdown_clicked = false;
        }

        $scope.isInsideDocker = function () {
            if (document.URL != null && (document.URL.indexOf("MainDocker.html") > -1 || document.URL.indexOf("callsource=docker") > -1)) {
                return true;
            }
            return false;
        }

        $scope.capture_video_project = function (selectedtText) {
            if (!validate_project()) {
                return false;
            }

            if (is_video_dropdown_clicked) {
                is_video_dropdown_clicked = false;
                return false;
            }

            if (IsRecordingInProgress) {
                serviceFactory.notifier($scope, 'Capture ' + get_inprogress_Recordinf_type() + ' is in progress', 'warning');
                chrome.runtime.sendMessage({
                    ShowVideoEditorInFront: "ShowVideoEditorInFront"
                }, function (response) { });
                return;
            }

            chrome.runtime.sendMessage({
                ResetVideoUploadStatus: "ResetVideoUploadStatus"
            }, function (response) { });

            var json_addon = {
                "url": $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME"),
                "Result_ID": '',
                "SessionID": '',
                "tc name": '',
                "utility": 'qlm_video_IssueType'
            };

            var insideDocker = $scope.isInsideDocker();
            if (insideDocker == false) {
                if (selectedtText == "Current Tab") {
                    json_addon["captureMode"] = "CaptureCurrentWithTabCaptureApi";
                }
                else if (selectedtText == "Other Tabs") {
                    json_addon["captureMode"] = "StartVideoRecording";
                }
                else {
                    json_addon["captureMode"] = "CaptureCurrentWithDisplayModeCurrentTab";
                }
            }
            localStorage.removeItem("QLM_Response");
            localStorage.removeItem("OpkeyTestRunnerSnapData");
            localStorage.setItem("OpkeyTestRunnerSnapData", JSON.stringify(json_addon));

            let local_data = {
                GridRow: null,
                GridID: "",
                type: null,
                Issue_data: null,
            }

            localStorage.setItem("capture_step_data", JSON.stringify(local_data));

            $("#snap_loader").show();
            setTimeout(() => {
                check_for_response();
                //check_for_attachment_success();
            }, 800);

        }

        async function initObiqJourneyUi() {
            let startJourneyTranscript = false;
            chrome.runtime.sendMessage({ getFlagForJourneyTranscript: true }, function (response) {
                startJourneyTranscript = response;
            });

            let obiqEnabled = await checkObiqFeaturesEnabled();

            if (obiqEnabled == false) {
                $('#recordJourneyButtonSpan').parent().hide();
                $('#recordGuideButtonSpan').parent().hide();
                $('#companionAppButton').parent().hide();
                return;
            }

            let allLicenses = await GetModuleLicenses();
            if (allLicenses !== null) {
                let opkeyOneLicenses = allLicenses["OpkeyOne"];
                if (opkeyOneLicenses !== null) {
                    let opkeyOneLicenses = allLicenses["OpkeyOne"];
                    if (opkeyOneLicenses !== null) {
                        let obiqLicenseEnabled = opkeyOneLicenses["Observability"];
                        //hiding button for null also as on "https://myqlm.opkeyone.com/" API not containing OBIQ license data and in that instance we don't have license
                        if (obiqLicenseEnabled == null || (obiqLicenseEnabled != null && obiqLicenseEnabled["LicenseActive"] == false)) {
                            $('#recordJourneyButtonSpan').parent().hide();
                            $('#recordGuideButtonSpan').parent().hide();
                            $('#companionAppButton').parent().hide();
                            return;
                        }
                    }
                }
            }

            var trackUrl = localStorage.getItem("URL_TO_TRACK_FOR_JOURNEY");
            if (trackUrl != null && trackUrl != "" && startJourneyTranscript) {
                if (await isExtensionConnected() == false) {
                    return;
                }
                $("#recordJourneyButtonSpan").text("Stop Recording Journey");
                $("#record_JourneyButton").addClass("border_blink");
                opemSidePanel();
            }
            else {
                $("#recordJourneyButtonSpan").text("Start Recording Journey");
                $("#record_JourneyButton").removeClass("border_blink");
                sendMessageToToggleDocker("HideDockerUI");
                hideSidePanel();
            }
        }

        initObiqJourneyUi();

        async function isExtensionConnected() {
            debugger
            let extensionFlag = await getSessionStorageKeyFromActiveTab("ObiqExtensionDisconnected");
            if (!extensionFlag || extensionFlag == "true") {
                serviceFactory.notifier($scope, "We're having trouble connecting with the OBIQ extension. Try reloading your main page to fix this issue.", "error");
                return false;
            }
            return true;
        }

        async function opemSidePanel() {

            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab?.id) return;

            localStorage.setItem("lastTabId", tab.id.toString());
            let urlPath = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME") + "/docker/home";

            //urlPath = "https://localhost:4200/docker/home";

            await chrome.sidePanel.setOptions({
                tabId: tab.id,
                path: "ObeSidePanel/sidepanel.html?opkeyUrl=" + urlPath,
                enabled: true
            });

            await chrome.sidePanel.open({ tabId: tab.id });
            window.close();
        }

        async function hideSidePanel() {
            const savedTabId = parseInt(localStorage.getItem("lastTabId"), 10);

            if (!savedTabId) {
                return;
            }
            debugger
            sendMessageToToggleDocker("HIDE_TOOL_TIP");
            // wherever you have the tabId
            chrome.runtime.sendMessage({ type: "DISABLE_SIDE_PANEL", tabId: savedTabId });

        }

        async function getSessionStorageKeyFromActiveTab(keyName) {
            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (!tab?.id) return null;

                const [{ result }] = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: (k) => sessionStorage.getItem(k), // runs inside tab
                    args: [keyName],
                });

                return result;
            } catch (e) {
                return "";
            }
        }

        function checkObiqFeaturesEnabled() {
            opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");
            return new Promise(function (resolve) {

                $.ajax({
                    url: opkey_end_point + "/OpkeyObiqServerApi/OpkeyTraceIAAnalyticsApi/ObiqServerCommonController/isObiqAddonFeaturesEnabled",
                    type: "Get",
                    success: function (res) {
                        resolve(res);
                    },
                    error: function (error) {
                        resolve(false);
                    }
                });
            });
        }

        function GetModuleLicenses() {
            opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");
            return new Promise(function (resolve) {

                $.ajax({
                    url: opkey_end_point + "/Helper/GetModuleLicenses",
                    type: "Get",
                    success: function (res) {
                        resolve(res);
                    },
                    error: function (error) {
                        resolve(null);
                    }
                });
            });
        }

        $scope.startCompanionApp = async function () {
            var actiontext = $("#companionAppButtonSpan").text();
            if (actiontext === "Disable Companion App") {
                $("#companionAppButtonSpan").text("Enable Companion App");
                $("#companionAppButton").removeClass("border_blink");
                hideSidePanel();
                return;
            }
            if (await isExtensionConnected() == false) {
                return;
            }
            $("#companionAppButtonSpan").text("Disable Companion App");
            $("#companionAppButton").addClass("border_blink");
            opemSidePanel();
        }

        $scope.startObiqJourneyOfCurrentTab = function () {
            debugger
            // if(serviceFactory.userHavePrivilege && serviceFactory.userHavePrivilege.length == 0){
            // serviceFactory.notifier($scope, "The username '" + dataFactory.userDTO.email_ID + "' is not authorized to perform this action. Please contact the Project Admin for further assistance.");
            //     $.msgBox({
            //         title: "Opkey",
            //         content: "The username '" + dataFactory.userDTO.email_ID + "' is not authorized to perform this action. Please contact the Project Admin for further assistance.",
            //         modal: true,
            //         type: "info",
            //         buttons: [{ value: "ok" }],
            //         success: function (result) {
            //         }

            //     });
            //     return;
            // }
            var actiontext = $("#recordJourneyButtonSpan").text();
            if (actiontext === "Stop Recording Journey") {

                var domainName = localStorage.getItem("URL_TO_TRACK_FOR_JOURNEY");

                serviceFactory.notifier($scope, 'Stoped Tracking ' + domainName, 'error');

                localStorage.removeItem("URL_TO_TRACK_FOR_JOURNEY");
                $("#recordJourneyButtonSpan").text("Start Recording Journey");
                $("#record_JourneyButton").removeClass("border_blink");
                sendMessageToToggleDocker("HideDockerUI");
                sendMessageToSetFlagForJourneyTranscript(false);
                hideSidePanel();
                return;
            }
            chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                let activeTab = tabs[0];
                let activeTabUrl = activeTab.url;
                let domainName = getDomainName(activeTabUrl);
                if (domainName != null) {
                    if (await isExtensionConnected() == false) {
                        return;
                    }
                    localStorage.setItem("URL_TO_TRACK_FOR_JOURNEY", domainName);
                    serviceFactory.notifier($scope, 'Started Tracking ' + domainName, 'success');
                    $("#recordJourneyButtonSpan").text("Stop Recording Journey");
                    $("#record_JourneyButton").addClass("border_blink");
                    sendMessageToToggleDocker("ShowDockerUI");
                    sendMessageToSetFlagForJourneyTranscript(true);
                    opemSidePanel();
                }
            });
        };

        function sendMessageToToggleDocker(_action) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: _action
                }, function (response) {
                    console.log("Response from content script:", response);
                });
            });
        }
        function sendMessageToSetFlagForJourneyTranscript(_action) {
            if (_action) {
                chrome.runtime.sendMessage({ flagForStartJourneyTranscript: true }, function (response) {
                });
            } else {
                chrome.runtime.sendMessage({ flagForStopJourneyTranscript: true }, function (response) {
                });
            }
        }
        function initGuideJourneyUi() {
            var trackUrl = localStorage.getItem("URL_TO_TRACK_FOR_GUIDE");
            if (trackUrl != null && trackUrl != "") {
                $("#recordGuideButtonSpan").text("Stop Custom Job Aid");
                $("#journey_transcript").addClass("border_blink");
                toggleIcons(false)
                chrome.runtime.sendMessage({ userjourney: "tracking started" }, function (response) {
                    console.log("Response from background:", response);
                });
            }
            else {
                $("#recordGuideButtonSpan").text("Create Custom Job Aid");
                toggleIcons(true)
                $("#journey_transcript").removeClass("border_blink");
                chrome.runtime.sendMessage({ userjourney: "tracking stoped" }, function (response) {
                    console.log("Response from background:", response);
                });

            }
        }
        function toggleIcons(showBenchmark) {
            if (showBenchmark) {
                $("#icon1").show();
                $("#icon2").hide();
            } else {
                $("#icon1").hide();
                $("#icon2").show();
            }
        }
        initGuideJourneyUi();

        $scope.startObiqGuideOfCurrentTab = function () {
            debugger
            // if(serviceFactory.userHavePrivilege && serviceFactory.userHavePrivilege.length == 0){
            // serviceFactory.notifier($scope, "The username '" + dataFactory.userDTO.email_ID + "' is not authorized to perform this action. Please contact the Project Admin for further assistance.");
            //     $.msgBox({
            //         title: "Opkey",
            //         content: "The username '" + dataFactory.userDTO.email_ID + "' is not authorized to perform this action. Please contact the Project Admin for further assistance.",
            //         modal: true,
            //         type: "info",
            //         buttons: [{ value: "ok" }],
            //         success: function (result) {
            //         }

            //     });
            //     return;
            // }
            var actiontext = $("#recordGuideButtonSpan").text();
            if (actiontext === "Stop Recording Guide" || actiontext === "Stop Custom Job Aid") {
                chrome.runtime.sendMessage({ userjourney: "tracking stoped" }, function (response) {
                    console.log("Response from background:", response);
                });
                var domainName = localStorage.getItem("URL_TO_TRACK_FOR_GUIDE");

                serviceFactory.notifier($scope, 'Stoped Tracking ' + domainName, 'error');

                localStorage.removeItem("URL_TO_TRACK_FOR_GUIDE");
                chrome.runtime.sendMessage({ getFlagForJourneyTranscript: true }, function (response) {
                    if (response === false) {
                        localStorage.removeItem("URL_TO_TRACK_FOR_JOURNEY");
                    }
                });
                $scope.open_create_view('Recording Guide');

                // $("#recordGuideButtonSpan").text("Start Recording Guide");

                chrome.runtime.sendMessage({
                    TurnOffHighlightElementForUserGuide: "TurnOffHighlightElementForUserGuide"
                }, async function (response) {

                }
                );

                chrome.runtime.sendMessage({
                    StopCreatingNewSessionIDForUserGuide: "StopCreatingNewSessionIDForUserGuide"
                }, async function (response) { });

                return;
            }

            chrome.runtime.sendMessage({
                RESETOPKEYEXECUTIONINFORMATION: "RESETOPKEYEXECUTIONINFORMATION"
            }, function (response) {
                if (chrome.runtime.lastError) { }

                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    let activeTab = tabs[0];
                    let activeTabUrl = activeTab.url;
                    let domainName = getDomainName(activeTabUrl);
                    if (domainName != null) {
                        localStorage.setItem("URL_TO_TRACK_FOR_GUIDE", domainName);
                        localStorage.setItem("URL_TO_TRACK_FOR_JOURNEY", domainName);
                        toggleIcons(false);
                        $("#journey_transcript").addClass("border_blink");
                        chrome.runtime.sendMessage({ userjourney: "tracking started" }, function (response) {
                            console.log("Response from background:", response);
                        });
                        serviceFactory.notifier($scope, 'Started Tracking ' + domainName, 'success');
                        $("#recordGuideButtonSpan").text("Stop Custom Job Aid");
                    }

                    chrome.runtime.sendMessage({
                        TurnOnHighlightElementForUserGuide: "TurnOnHighlightElementForUserGuide"
                    }, async function (response) { }
                    );

                    chrome.runtime.sendMessage({
                        StartCreatingNewSessionIDForUserGuide: "StartCreatingNewSessionIDForUserGuide"
                    }, async function (response) { });
                });
            });

        };

        function getDomainName(url) {
            try {
                // Create a URL object
                const urlObj = new URL(url);
                // Return the hostname, which is the domain name
                return urlObj.hostname;
            } catch (error) {
                console.error("Invalid URL:", error);
                return null;
            }
        }

        var time_out_snap = null;

        function check_for_attachment_success() {
            let response = localStorage.getItem("QLM_Response");
            if (response != null && response != "") {
                var isVideo = false;
                $("#snap_loader").hide();
                clearTimeout(time_out_snap);
                localStorage.removeItem("QLM_Response");
                let qlm_response = JSON.parse(response);
                if (qlm_response.extension == ".png") {
                    isVideo = false;
                }
                else {
                    isVideo = true;
                }
                let type = qlm_response["IssueType"];
                delete qlm_response["IssueType"]
                let data = { type: type, current_TestCase: null, Attachment_data: [qlm_response], Issue_data: null, CallSource: "options.Manual_project_selection" };
                serviceFactory.SetCallSourceInDataFactory(data, "Manual_Create_view_data");

                $scope.ChangePageView("options.Manual_create_view");
                if (document.URL.indexOf('callsource') > -1) {
                    if (isVideo) {
                        let data = { action: "notifier", message: 'Video uploaded successfully', type: 'success' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        let data = { action: "notifier", message: 'Snapshot uploaded successfully', type: 'success' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                }
                else {
                    if (isVideo) {
                        serviceFactory.notifier($scope, 'Video uploaded successfully', 'success');
                    }
                    else {
                        serviceFactory.notifier($scope, 'Snapshot uploaded successfully', 'success');
                    }
                }
                return;
            }
            clearTimeout(time_out_snap);
            time_out_snap = setTimeout(() => {
                check_for_attachment_success();
            }, 800);
        }

        $scope.cancel_check_for_snap = function () {
            clearTimeout(time_out_snap);
            $("#snap_loader").hide();
            chrome.runtime.sendMessage({
                ResetVideoUploadStatus: "STOPSESSION"
            }, function (response) {
                chrome.runtime.sendMessage({
                    ResetVideoUploadStatus: "INCOMPLETE"
                }, function (response) {
                });
            });

        }

        function validate_project() {
            $("#project_error").hide();
            let projectID = $("#manual_project_ddl").data('kendoDropDownList').value();
            if (projectID == "" || projectID == null || projectID == undefined) {
                $("#project_error").show();
                return false;
            }
            return true;
        }

        var IsRecordingInProgress = false;

        var addon_time_out = null;

        function check_for_response() {
            chrome.runtime.sendMessage({
                GetVideoUploadStatus: "GetVideoUploadStatus"
            }, function (response) {

                console.log("project response", response);

                if (response == "COMPLETED") {
                    $("#snap_loader").hide();
                    IsRecordingInProgress = false;
                    loadingStop("body", "");
                    clearTimeout(addon_time_out);
                    check_for_attachment_success();
                    chrome.runtime.sendMessage({
                        ResetVideoUploadStatus: "ResetVideoUploadStatus"
                    }, function (response) { });
                }
                else if (response == "") {
                    IsRecordingInProgress = false;
                }
                else if (response.indexOf("UPLOADATTACHMENTEORROR_") > -1) {
                    $("#snap_loader").hide();
                    IsRecordingInProgress = false;
                    loadingStop("body", "");
                    clearTimeout(addon_time_out);
                    var mess = JSON.parse(response.split("_")[1]);
                    serviceFactory.notifier($scope, mess.message, "warning");
                    chrome.runtime.sendMessage({
                        ResetVideoUploadStatus: "ResetVideoUploadStatus"
                    }, function (response) { });
                }
                else if (response == "FETCHING") {
                    $("#snap_loader").hide();
                    IsRecordingInProgress = false;
                    loadingStart("body", "Please wait uploading data", "");
                    clearTimeout(addon_time_out);
                    addon_time_out = setTimeout(function () {
                        check_for_response();
                    }, 800);
                }
                else if (response == "INCOMPLETE") {
                    loadingStop("body", "");
                    $("#snap_loader").hide();
                    IsRecordingInProgress = false;
                    clearTimeout(addon_time_out);
                    clearTimeout(time_out_snap);
                    chrome.runtime.sendMessage({
                        ResetVideoUploadStatus: "ResetVideoUploadStatus"
                    }, function (response) { });
                }
                else if (response == "STARTINGCAPTURING") {
                    IsRecordingInProgress = false;
                    clearTimeout(addon_time_out);
                    setTimeout(function () {
                        check_for_response();
                    }, 800)
                }
                else {
                    IsRecordingInProgress = true;
                    clearTimeout(addon_time_out);
                    addon_time_out = setTimeout(function () {
                        check_for_response();
                    }, 800);
                }
            });
        }

        function get_inprogress_Recordinf_type() {
            let utility = localStorage.getItem("AppUtilityType");
            if (utility != null) {
                if (utility == "snapshot" || utility == "qlm_snapshot" || utility == "qlm_snapshot_IssueType") {
                    return "Snapshot";
                }
                else {
                    return "Video";
                }
            }
        }


    }]);




