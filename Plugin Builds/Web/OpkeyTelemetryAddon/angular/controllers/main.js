
angular.module('myApp').controller("main_ctrl", ['$rootScope', '$scope', '$state', 'ServiceFactory', 'DataFactory', '$ocLazyLoad',
    function ($rootScope, $scope, $state, serviceFactory, dataFactory, $ocLazyLoad) {

        $rootScope.Scope_Main = $scope;

        var ajax_opkey_heart_beat = null;

        var window_Preview_type = null;
        $scope.Get_Opkey_URL = function (flag) {
            var opkey_end_point = serviceFactory.GetGlobalSetting(flag);

            if (opkey_end_point === null || opkey_end_point === "") {

                console.error("No url found in localstorage checking datafactory");

                opkey_end_point = dataFactory.OPKEY_URL;

                return opkey_end_point;
            } else {
                return opkey_end_point;
            }

        }

        $scope.Load_Main_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_Main", Load_Main_View);
        };

        $scope.Pin_Switch_Project = false;

        function Load_Main_View() {

            let manual_ruuner_sessionID = serviceFactory.GetGlobalSetting("SessionID");

            if(manual_ruuner_sessionID == null || manual_ruuner_sessionID == "" || manual_ruuner_sessionID == 'null'){

                let windowType = localStorage.getItem("EXTENSION_OPENED");
                localStorage.setItem("EXTENSION_OPENED", "");

                if(windowType == "WINDOW"){
                    window_Preview_type = windowType;
                    $('body').addClass("width-100 max-popup-win");
                }
                else{
                    $('body').addClass("min-popup-win");
                }
                    
                $scope.ChangePageView("options");

                opkey_end_point = $scope.Get_Opkey_URL("OPKEY_DOMAIN_NAME");
            }
            else {
                $('body').addClass("min-popup-win");
                $scope.check_open_project_selection("ManualRunner");
            }

            
        }

        var opkey_end_point = $scope.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        var parameter_msgbox_opened = false;

        $scope.Validate_opkey_Session = function () {
            debugger;

            opkey_end_point = $scope.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

            // setTimeout(function () {  $scope.Validate_opkey_Session() }, 12000);

            if (opkey_end_point === null || opkey_end_point === "") {
                $scope.ChangePageView("options.login");
                return false;
            }

            ajax_opkey_heart_beat = $.ajax({
                url: opkey_end_point + "/OpkeyApi/GetSessionStatus",
                type: "Get",
                cache: false,
                timeout: 3000,
                success: function (result) {
                    debugger;

                    console.log('ajax_opkey_heart_beat', 'success',result);

                    dataFactory.Session_Data = result;
                    dataFactory.userDTO = result.UserDTO;
                    set_user_on_session_status(result);

                    if(document.URL.indexOf('callsource')>-1){
                        ajax_opkey_heart_beat = null;
                        return;
                    }

                    if (result.User) {

                        var signalR = $.signalR;

                        signalR.hub = $.hubConnection(opkey_end_point + "/signalr", { useDefaultPath: false });

                        signalR.hub.logging = true;

                        $.extend(signalR, signalR.hub.createHubProxies());

                        if(result.User){
                            dataFactory.userDTO = result.UserDTO;
                            set_user_on_session_status(result);
                        }

                       
                        //dataFactory.TimerOnlineUser = setInterval($scope.MaintainOnlineUserCache, 5000);

                        if (result.Project) {



                            set_project_on_session_status(result);



                            if ($scope.viewName === "options" || $scope.viewName === "options.login") {

                                if(window_Preview_type == "WINDOW") {
                                    $('body').addClass("width-100 max-popup-win");
                                    console.log("recording_selection");
                                    $("#li_project_info").show();
                                    $("#divPanel_Options").removeClass("disabled");
                                    $scope.ChangePageView("options.recording_selection");
                                }
                                else {
                                    $('body').addClass("min-popup-win");
                                    $scope.check_open_project_selection("Project");
                                }


                            } else if ($scope.viewName === "options.Manual_project_selection") {

                                if(window_Preview_type == "WINDOW") {
                                    $('body').addClass("width-100 max-popup-win");
                                    console.log("recording_selection");
                                    $("#li_project_info").show();
                                    $("#divPanel_Options").removeClass("disabled");
                                    $scope.ChangePageView("options.recording_selection");
                                }
                                else {
                                    $('body').addClass("min-popup-win");
                                    $scope.check_open_project_selection("Project");
                                }

                            } else if ($scope.viewName === "options.project_selection") {

                                if ($scope.Pin_Switch_Project) {

                                } else {
                                    $('body').addClass("width-100 max-popup-win");
                                    console.log("recording_selection");
                                    $("#li_project_info").show();
                                    $("#divPanel_Options").removeClass("disabled");
                                    $scope.ChangePageView("options.recording_selection");
                                }

                            } else {

                            }

                        } else {

                            if(window_Preview_type == "WINDOW") {
                                $('body').addClass("width-100 max-popup-win");
                                $scope.ChangePageView("options.project_selection");
                            }
                            else {
                                $('body').addClass("min-popup-win");
                                $scope.ChangePageView("options.Manual_project_selection");
                            }
                            //dataFactory.TimerOnlineUser = setInterval($scope.MaintainOnlineUserCache, 30000);
                        }

                    }
                    else {

                        $scope.ChangePageView("options.login");

                    }

                    ajax_opkey_heart_beat = null;
                    if(result && result.ProjectDTO && result.UserDTO && !result.UserDTO.Is_SuperAdmin)
                    {
                        getUserPermissionsList(result.ProjectDTO);

                    }
                },
                error: function (error) {
                    console.log('ajax_opkey_heart_beat', 'error',error);
                    $scope.ChangePageView("options.login");
                    ajax_opkey_heart_beat = null;
                }
            });



        }
         
        function getUserPermissionsList(dto) {
            debugger;
            $.ajax({
                url: opkey_end_point + "/RoleManagement/GetRoleAssignedToUserOnProject",
                type: "POST",
                data: {strProjectDTO : JSON.stringify(dto)},
                success: function(result) {
                    debugger;
                 serviceFactory.privilege_list = result.RolePrivileges;
                 serviceFactory.userHavePrivilege = result.RolePrivileges.filter(privilege => privilege.PrivilegeName === "Can_Create_Journey")
                },
                error: function(error) {
                    serviceFactory.showError($scope, error);
                }
            });
        }

         $scope.check_open_project_selection = function(type){

            let step_data= localStorage.getItem("capture_step_data");
            let AppUtility = localStorage.getItem("AppUtilityType");
            let QLM_res = localStorage.getItem("QLM_Response");
            if(step_data != null) {                
                
                if(QLM_res != null) {
                    
                    let step = JSON.parse(step_data);

                    let data={};
                    if(step.type == null){
                        if(step.Issue_data != null) {
                            step.Issue_data.IssueType = JSON.parse(QLM_res).IssueType;
                        }                        
                      data = {type: JSON.parse(QLM_res).IssueType, current_TestCase: step.GridRow, Attachment_data: [JSON.parse(QLM_res)], Issue_data: step.Issue_data, CallSource: step.GridRow == null?"options.Manual_project_selection":"ManualRunnerView"};
                    }
                    else if(step.type == "TestCase" || step.type == "Step"){
                        $scope.ChangePageView("ManualRunnerView");
                        return;
                    }
                    else{
                        data = {type: step.type, current_TestCase: step.GridRow, Attachment_data: [], Issue_data: step.Issue_data, CallSource: step.GridRow == null?"options.Manual_project_selection":"ManualRunnerView"};
                    }               
                    
                    //localStorage.removeItem('QLM_Response');
                    localStorage.removeItem("capture_step_data");
                    
                    serviceFactory.SetCallSourceInDataFactory(data, "Manual_Create_view_data");

                    $scope.ChangePageView("options.Manual_create_view");
                }
                else if(AppUtility != null){
                    
                    let step = JSON.parse(step_data);
                    if(step.Issue_data == null){
                        if(type == "ManualRunner"){
                            $scope.ChangePageView("ManualRunnerView");
                        }  
                        else {
                            $scope.ChangePageView("options.Manual_project_selection");
                        }  
                    }
                    else {

                        let data = {type: step.type?step.type:"Ticket", current_TestCase: step.GridRow, Attachment_data: [], Issue_data: step.Issue_data, CallSource: step.GridRow == null?"options.Manual_project_selection": 'ManualRunnerView'};                    
                    
                        serviceFactory.SetCallSourceInDataFactory(data, "Manual_Create_view_data");

                        $scope.ChangePageView("options.Manual_create_view");
                    }
                }
                else {
                    console.log("step_data",step_data);
                    localStorage.removeItem("capture_step_data");
                    let step = JSON.parse(step_data);

                    let data = {type: step.type?step.type:"Ticket", current_TestCase: step.GridRow, Attachment_data: [], Issue_data: step.Issue_data, CallSource: step.GridRow == null?"options.Manual_project_selection": 'ManualRunnerView'};                    
                    
                    serviceFactory.SetCallSourceInDataFactory(data, "Manual_Create_view_data");

                    $scope.ChangePageView("options.Manual_create_view");
                }
            }
            else{         
                if(type == "ManualRunner"){
                    $scope.ChangePageView("ManualRunnerView");
                }  
                else {
                    $scope.ChangePageView("options.Manual_project_selection");
                }     
                
            }
        }

        

        function set_user_on_session_status(result) {
            debugger

            // if ($("#sp_user_info").text() === result.UserDTO.Name) {
            //      return false;
            // }

            let opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");
            if(opkey_end_point.indexOf('com/') == -1){
                opkey_end_point = opkey_end_point + '/';
            }
            $(".current_User_DD_img").prop('src',opkey_end_point+"user/getavatar/"+result.UserDTO.U_ID);
            $("#current_User_name").html(DOMPurify.sanitize(result.UserDTO.Name));
            $("#current_User_email_ID").html(DOMPurify.sanitize(result.UserDTO.email_ID));


            $("#li_logout").show();
            $("#li_user_info").show();
            $("#li_project_info").hide();
            $("#sp_user_info").text(result.UserDTO.Name);


        }

        function set_project_on_session_status(result) {

            //var SELECTED_PROJECT_PID = serviceFactory.GetGlobalSetting("SELECTED_PROJECT_PID");

            //if (result.ProjectDTO.P_ID === SELECTED_PROJECT_PID) {
            //    return false;
            //}

            if ($("#li_project_info").attr("data_full_name") === result.ProjectDTO.Name) {
                // return false;
            }


            serviceFactory.SetGlobalSetting("OPKEY_PROJECT_NAME", result.ProjectDTO.Name);
            serviceFactory.SetGlobalSetting("SELECTED_PROJECT_PID", result.ProjectDTO.P_ID);

            if($("#manual_project_ddl").data('kendoDropDownList')){
                $("#manual_project_ddl").data('kendoDropDownList').value(result.ProjectDTO.P_ID);
                $("#manual_project_ddl").data('kendoDropDownList').trigger('change');
                //$rootScope.scope_manual_project_ctrl.choose_project(result.ProjectDTO.P_ID,result.ProjectDTO.Name);
            }
            

            var projectName = cut_project_name(result.ProjectDTO.Name);

            $("#li_project_info").show();
            $("#li_project_info").attr('title', 'Switch Project (' + result.ProjectDTO.Name + ')');
            $("#li_project_info").attr('data_full_name', result.ProjectDTO.Name);
            $("#sp_project_info").text(projectName);
            $("#divPanel_Options").removeClass("disabled");



        }

        function cut_project_name(project_name) {

            if (project_name.length > 15) {
                project_name = project_name.substring(0, 15) + "...";
            }

            return project_name;
        }

        $scope.AddonOperationSelection = function (Operation_Type) {
            debugger;
            
            if (Operation_Type == EnumAddonOperationType.CreateFollowMe) {
                //$scope.ChangePageView('options.create_followme_login');
                serviceFactory.notifier($scope, "Coming soon", "warning");
            }
            else {
                $scope.ChangePageView('options.recording_normal');
            }
            $scope.AddonOperationType = Operation_Type;
        }

        $scope.SelectLocalExecution = function () {
            debugger;

            dataFactory.MultiBrowser_ExecutionType = EnumExecutionType.Local;
            $scope.ChangePageView('multibrowser');

        }

        $scope.ChangePageView = function (viewName) {
            debugger;
            if (dataFactory.userDTO && viewName != "options.login") {
                //$scope.MaintainOnlineUserCache();
            }
            if ($scope.viewName === viewName) {
                return false;
            }
            //if (viewName == 'options.create_followme_login') {     //this code is used to restrict follow me in current build.
            //    serviceFactory.notifier($scope, "coming soon..!", 'warning');
            //    return false;
            //}
            $rootScope.Scope_Main.Pin_Switch_Project = false;

            dataFactory.Clear_Variable();

            $scope.SetRecordingType(viewName);

            $scope.viewName = viewName;
            if ($scope.viewName == 'options.recording_normal' || $scope.viewName == 'options.execution_selection' || $scope.viewName == 'options.create_followme' || $scope.viewName == 'options.recording_responsive') {
                $('#li_Recording_Selection_Info').show();
            }
            else {
                $('#li_Recording_Selection_Info').hide();

            }
            $state.go(viewName);
        };

        $scope.SetRecordingType = function (viewName) {
            if (viewName === "options.recording_responsive") {
                debugger
                localStorage.setItem("OPKEY_RECORDER_BROWSER_RESOLUTION", "800:600");
                localStorage.setItem("OPKEY_RECORDER_TYPE", "RESPONSIVE_RECORDER");
                return;
            }
            localStorage.setItem("OPKEY_RECORDER_TYPE", "NORMAL_RECORDER");
            localStorage.setItem("OPKEY_RECORDER_BROWSER_RESOLUTION", "800:600");
        };

        function addonContinueConfirmation() {
            $.msgBox({
                title: "OpKey",
                content: "Do you want to continue using Addon?",
                modal: true,
                type: "confirm",
                buttons: [{ value: "Yes" }, { value: "No" }],
                success: function (result) {
                    debugger;

                    if (result === "Yes") {

                        parameter_msgbox_opened = false;
                        $scope.ChangePageView("options.recording_normal");

                    }
                    else {

                        chrome.tabs
                            .getCurrent(function (tab) {
                                chrome.tabs.remove(
                                    tab.id,
                                    function () {
                                    });
                            });

                    }
                }
            });
        }

        $scope.Switch_Project = function () {
            debugger;
            $scope.Pin_Switch_Project = true;
            $scope.ChangePageView("options.project_selection");

        }

        $scope.Log_Out = function () {
            debugger;

            if (opkey_end_point === null || opkey_end_point === "") {
                $scope.ChangePageView("options.login");
                return false;
            }
            if(window['keycloak']){
            $.ajax({
                url: opkey_end_point + "/login/opkeyone_clearsession",
                type: "GET",
                data: {
                    UserID: dataFactory.userDTO.U_ID,
                },
                success: function (result) {
                   
                   

                       window['keycloak'].logout();
                    //    localStorage.removeItem("AUTH_SESSION_ID");
                       localStorage.removeItem("keycloak-token");
                       window['keycloak']=null
                       $scope.ChangePageView("options.login");
                   

                }
            });
        }
        else{

            $.ajax({
                url: opkey_end_point + "/Login/Logout",
                success: function (result) {
                    
                    $scope.ChangePageView("options.login");
    
                },
                error: function () { }
            });
        }

          



        }

        $scope.GetOpkeyUserInformation = function () {
            debugger;

            opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

            $.ajax({
                url: opkey_end_point + "/OpkeyApi/GetOpkeyUserInformation",
                type: "GET",
                success: function (result) {
                    $("#sp_user_info").text(result.UserName);
                },
                error: function (error) {

                }
            });
        };

        $scope.GetOpkeyProjectInformation = function () {
            debugger;


            $.ajax({
                url: opkey_end_point + "/OpkeyApi/GetSelectedProjectId",
                type: "GET",
                success: function (result) {
                    var selected_project_pId = result.SelectedProjectId;
                    $scope.get_selected_projectName(selected_project_pId);

                },
                error: function (error) {

                }
            });
        };

        $scope.get_selected_projectName = function (selected_project_pId) {

            loadingStart("#divParent", "Please Wait ...", ".btnTestLoader");

            $.ajax({
                url: opkey_end_point + "/OpkeyApi/GetListOfAssignedProject",
                type: "GET",
                success: function (result) {
                    loadingStop("#divParent", ".btnTestLoader");

                    $.each(result, function (ind, obj) {
                        if (obj.P_ID === selected_project_pId) {

                            serviceFactory.SetGlobalSetting("OPKEY_PROJECT_NAME", obj.Name);
                            serviceFactory.SetGlobalSetting("SELECTED_PROJECT_PID", obj.P_ID);

                            var projectName = obj.Name;

                            $("#li_project_info").show();

                            $("#li_project_info").attr('title', 'Switch Project (' + projectName + ')'); //Tooltip should be according to selected project
                            if (projectName.length > 15) {
                                projectName = projectName.substring(0, 15)
                                    + "...";
                            }
                            $("#sp_project_info").text(projectName);
                            $("#divPanel_Options").removeClass("disabled");

                        }

                    });

                },
                error: function (error) {
                    loadingStop("#divParent", ".btnTestLoader");
                    if(error!=null){
                        if(JSON.stringify(error).indexOf("Session is terminated")>-1){
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
                }
            });
        };

        $scope.restrictSpecialCharacterInTreeNodeText = function (domIdOfTree) {
            $("#" + domIdOfTree).on("keydown", ".jstree-rename-input", function (e) {
                //if (e.key == '\/' || e.key == '\\' || e.keyCode == 111) {
                if (e.key == '\\') {
                    e.preventDefault();
                }
            });
        };

        $scope.Change_options = function (tab_type) {
            debugger;

            if (tab_type === "options.recording_normal") {
                $scope.ChangePageView("options.recording_normal");

            } else if (tab_type === "options.recording_responsive") {
                $scope.ChangePageView("options.recording_responsive");

            } else if (tab_type === "multibrowser") {
                $scope.ChangePageView('multibrowser');

            } else if (tab_type === "result.run_test") {
                $scope.ChangePageView('options.execution_selection');

            } else if (tab_type === "result.queued_sessions") {
                $scope.ChangePageView('queued_sessions');

            } else if (tab_type === "result.sessions") {
                $scope.ChangePageView('result');

            } else if (tab_type === "result.live_sessions") {
                return false;
            } else {
                console.error("tab type (" + tab_type + ") not defined");
            }

            $scope.ChangePageView(tab_type);

        }

        $scope.ViewMoreOption = function () {
            debugger;
            $("#divTab_Queued_Sessions").show();
            $("#anMore_selection").hide();
        }

        $scope.MaintainOnlineUserCache = function () {

            opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");
            let userDTO = dataFactory.userDTO;
            $.ajax({
                url: opkey_end_point +'/Login/MaintainOnlineUserCache',
                type: 'Get',
                data: { userId: userDTO.U_ID, userName: userDTO.UserName, userEmail: userDTO.email_ID },
                success: function (result) {
                    console.log("Online user heartbeat");
                    // console.log(Date.now());


                    if (dataFactory.Application_Logout_Flag) {
                        return false;
                    }

                    if (result === "Logout") {
                        $scope.ChangePageView("options.login");
                    }



                },
                error: function (error) {
                    $scope.ChangePageView("options.login");
                    // console.log(Date.now());
                }
            });
        };


        $.ajaxSetup({
            complete: function (response) {
                debugger;
                $scope.Redirecting_ON_Session_Expire(response);  
            },
        });

        $scope.HeartBeat = function () {
            debugger;

            opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

            $.ajax({
                url: opkey_end_point + "/OpkeyApi/HeartBeat",
                type: "GET",
                success: function (result) {
                   
                },
                error: function (error) {
                   
                }
            });
        };
        

        $scope.Redirecting_ON_Session_Expire = function (response) {
            debugger;
            if (response.hasOwnProperty("responseText")) {
                if (response.responseText.indexOf("Login and experience") > -1 || response.responseText.indexOf('Login into your account') > -1 || response.responseText.indexOf("login_page_main") > -1) {
                    $scope.ChangePageView("options.login");
                    return false;
                }
            } else {
                $scope.ChangePageView("options.login");
                return false;
            }
            return true;
        }

        //$(document).ajaxSuccess(function (event, xhr, settings) {
        //    console.log('XHR Response', xhr);
        //    console.log('XHR settings', settings);
        //    console.log('XHR event', event);
        //});
        //$(document).ajaxError(function (event, xhr, settings) {
        //    console.log('XHR error Response', xhr);
        //    console.log('XHR error settings', settings);
        //    console.log('XHR error event', event);
        //});

        //$(document).ajaxComplete(function (event, xhr, settings) {
        //    console.log('XHR Complete Response', xhr);
        //    console.log('XHR Complete settings', settings);
        //    console.log('XHR Complete event', event);
        //});


    }]);




