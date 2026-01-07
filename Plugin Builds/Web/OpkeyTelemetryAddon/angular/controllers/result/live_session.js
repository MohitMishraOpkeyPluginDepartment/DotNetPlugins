



angular.module('myApp').controller("result_live_session_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory) {
        var opkey_end_point =  $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        $rootScope.Scope_Session_Live = $scope;

        $scope.Load_Sub_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_Sub_View", Load_Sub_View);
        };

        var sessionId = dataFactory.EmptyGuid;

        function Load_Sub_View() {
            debugger;

            sessionId = dataFactory.Selected_Execution_Node.SessionId;
            //var session_name = dataFactory.Selected_Execution_Node.OS + " " + dataFactory.Selected_Execution_Node.Browser + " " + dataFactory.Selected_Execution_Node.Resolution;
            //$("#sp_session_name").text(stringCutter(session_name, 100));
            if (dataFactory.MultiBrowser_ExecutionType == EnumExecutionType.Local || dataFactory.Selected_Execution_Node.OS==null) {
                $("#div_livePlatform").hide();
                $("#div_liveBrowser").hide();
                $("#div_liveResolution").hide();
                $("#div_liveViewport").hide();
                $('#bt_desktop').addClass('disabled');
                $("#div_logs").addClass("logs_onLocalExecution");
            }
            else {
               // console.log("dataFactory.Selected_Execution_Node", dataFactory.Selected_Execution_Node);
                $('#bt_desktop').removeClass('disabled');
                $("#divPlatform_text").text(dataFactory.Selected_Execution_Node.OS);
                $("#Browser_text").text(dataFactory.Selected_Execution_Node.Browser);
                $("#Resolution_text").text(dataFactory.Selected_Execution_Node.Resolution);
                $("#txt_BrowserViewport").text(dataFactory.Selected_Execution_Node.ViewPort);

                $("#divPlatform_text").attr("title" , dataFactory.Selected_Execution_Node.OS);
                $("#Browser_text").attr("title", dataFactory.Selected_Execution_Node.Browser);
                $("#Resolution_text").attr("title", dataFactory.Selected_Execution_Node.Resolution);
                $("#txt_BrowserViewport").attr("title", dataFactory.Selected_Execution_Node.ViewPort);
            }
            GetSessionInfoDtoBySessionId();

            if (dataFactory.Select_live_Window === "Window") {
                $scope.Execution_Live_Screen();
                dataFactory.Select_live_Window = null;
            }
            if (dataFactory.Pin_Live_Executions.hasOwnProperty(sessionId)) {
                $('#bt_result').addClass('colorRed');
                $("#bt_result").attr("title", "Unpin Execution");
            }

        }

        // $.connection.hub.url = "https://qa1.stg.smartopkey.com/signalr/hubs";

        $.connection.fn.log = function (msg) {
            //  console.log(msg);
        }

        $.connection.hub.connectionSlow(function () {
            console.log('We are currently experiencing difficulties with the connection.')
        });

        $.connection.hub.error(function (error) {
            console.log('SignalR error: ' + error)
        });

        $(function () {
            connectSignalRHub();
        });

        function connectSignalRHub() {

            //setInterval(function () {
            //    console.log("Signalr-state : " + $.connection.hub.state);
            //}, 5000);

            if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.disconnected) {

                console.log("Connecting SignalR");


                $.connection.hub.logging = true;
                $.connection.hub.start().
                    done(function () {
                        //console.log('SignalR now connected, connection ID=' + $.connection.hub.id);
                        //console.log("-----   $.connection  -----")
                        //console.log($.connection.sessionProgressProvider)
                        //console.log($.connection.hub);

                    })
                    .fail(function () {
                        console.log('SignalR could not connect!');
                    });;
            }




            //$.connection.error(function (error) {
            //    console.log('SignalR error: ' + error)
            //});
        }

        $.connection.hub.disconnected(function () {
            setTimeout(function () {
                connectSignalRHub();
            }, 5000);
        });


        $.connection.sessionProgressProvider.client.sendMessage = function (message, sessionId) {
            $rootScope.Scope_Session_Live.get_live_session_logs(message, sessionId)
        };

        $.connection.loginHub.client.addNewMessageToPage = function (sessionId, type) {
            //alert("i was called ")
            //if (type === "Login") {
            //    alert("show some message here telling user you have been lout or sign from some other location ")
            //    $scope.Log_Out();
            //}

        };


        $scope.Execution_Resume = function () {
            debugger;

            $.ajax({
                url: opkey_end_point + "/Result/ResumeExecution",
                type: "Post",
                data: { sessionID: sessionId },
                success: function (result) {

                    $(".btn_execution_actions").removeClass("disabled");
                    if (dataFactory.MultiBrowser_ExecutionType == EnumExecutionType.Local) {
                        $('#bt_desktop').addClass('disabled');
                    }
                    $('#bt_show_result').addClass('disabled');
                    $("#bt_play").addClass("disabled");
                    if (dataFactory.MultiBrowser_ExecutionType == EnumExecutionType.Local || dataFactory.Selected_Execution_Node.OS == null) {
                        $('#bt_desktop').addClass('disabled');
                    }

                    serviceFactory.notifier($scope, "Execution resumed", "warning");
                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });

        };

        $scope.Execution_Pause = function () {
            debugger;

            $.ajax({
                url: opkey_end_point + "/Result/PauseExecution",
                type: "Post",
                data: { sessionID: sessionId },
                success: function (result) {
                    $(".btn_execution_actions").removeClass("disabled");
                    if (dataFactory.MultiBrowser_ExecutionType == EnumExecutionType.Local) {
                        $('#bt_desktop').addClass('disabled');
                    }
                    $('#bt_show_result').addClass('disabled');
                    $("#bt_pause").addClass("disabled");           
                    $('#bt_play').removeClass('disabled');
                    if (dataFactory.MultiBrowser_ExecutionType == EnumExecutionType.Local || dataFactory.Selected_Execution_Node.OS == null) {
                        $('#bt_desktop').addClass('disabled');                        
                    }

                    serviceFactory.notifier($scope, "Execution paused", "warning");
                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });
        };

        $scope.Execution_Stop = function () {
            debugger;

            $.msgBox({
                title: "OpKey",
                content: "Are you sure you want to stop execution?",
                modal: true,
                type: "confirm",
                buttons: [{ value: "Yes" }, { value: "No" }],
                success: function (result) {

                    if (result == "Yes") {

                        $.ajax({
                            url: opkey_end_point + "/Result/StopExecution",
                            type: "Post",
                            data: { sessionID: sessionId },
                            success: function (result) {
                                $(".btn_execution_actions").addClass("disabled");
                                serviceFactory.notifier($scope, "Execution stopped", "warning");
                            },
                            error: function (error) {
                                serviceFactory.showError($scope, error);
                            }
                        });

                    }


                }

            });

        };

        $scope.Execution_Pin = function () {
            debugger;
            if (dataFactory.Pin_Live_Executions.hasOwnProperty(sessionId)) {
                delete dataFactory.Pin_Live_Executions[sessionId];
                $('#bt_result').attr("title", "Pin Execution");
                $('#bt_result').removeClass('colorRed');

                serviceFactory.notifier($scope, "Execution Unpined Successfully", "success");
            } else {
                GetBrowserCloudScreenURL(true);
               // dataFactory.Pin_Live_Executions[sessionId] = sessionId;
            }



        };
        $scope.Execution_Show_Result = function () {
            debugger;
            
            $scope.ChangePageView('result.closed_session');


            //$.ajax({
            //    url: opkey_end_point + "/MultiBrowser/GetSessionDataById",
            //    type: "Post",
            //    data: { sessionID: sessionId },
            //    success: function (result) {
            //        $(".btn_execution_actions").addClass("disabled");
            //        serviceFactory.notifier($scope, "Execution stopped", "warning");
            //    },
            //    error: function (error) {
            //        serviceFactory.showError($scope, error);
            //    }
            //});
        }

        $scope.Execution_Live_Screen = function () {
            debugger;

            if ($('#div_panel_live_logs').css('display') == 'none') {

                $("#div_panel_live_logs").show();
                $("#div_panel_live_screen").hide();
              //  $("#btn-show-result").show();

                $("#bt_desktop i.fa").removeClass("fa-file-text");
                $("#bt_desktop i.fa").addClass("fa-desktop");
                $("#bt_desktop").attr("title", "Live Screen");

            } else {

                $("#div_panel_live_logs").hide();
                $("#div_panel_live_screen").show();
               // $("#btn-show-result").hide();
                $("#bt_desktop i.fa").removeClass("fa-desktop");
                $("#bt_desktop i.fa").addClass("fa-file-text");
                $("#bt_desktop").attr("title", "Show Log");

                GetBrowserCloudScreenURL(false);
            }

        };

        function GetBrowserCloudScreenURL(flag) {
            debugger;
            $.ajax({
                url: opkey_end_point + "/MultiBrowser/GetBrowserCloudScreenURL",
                type: "Post",
                data: { sessionId: sessionId },
                success: function (result) {
                    debugger;
                    if (!flag) {
                        $("#iframe_live").attr("src", result);
                    }                    
                    if (flag) {
                        $('#bt_result').attr("title", "Unpin Execution");
                        $('#bt_result').addClass('colorRed');
                        dataFactory.Pin_Live_Executions[sessionId] = result;
                        serviceFactory.notifier($scope, "Execution Pined Successfully", "success");
                    }

                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function GetSessionInfoDtoBySessionId() {

            $.ajax({
                url: opkey_end_point + "/Result/GetSessionInfoDtoBySessionId",
                type: "Post",
                crossDomain: true,
                data: { sessionId: sessionId },
                success: function (result) {
                    debugger;
                    var sessionState = result.Item1.SessionDTO.SessionState_ENUM;

                    if (sessionState == "Running" || sessionState== "Scheduled") {
                       // $('#bt_play').removeClass('disabled');
                        $('#bt_pause').removeClass('disabled');
                        $('#bt_stop').removeClass('disabled');
                        if (dataFactory.MultiBrowser_ExecutionType !== EnumExecutionType.Local || dataFactory.Selected_Execution_Node.OS !== null) {
                            $('#bt_desktop').removeClass('disabled');
                        }                      
                        $('#bt_result').removeClass('disabled');
                    }   
                    else if (sessionState == "Paused") {
                        $("#bt_play").removeClass("disabled");
                    }
                    else {
                        $('#btn-show-result').prop('disabled', false);
                        serviceFactory.notifier($scope, "Execution is Complete or Closed", "error");
                    }


                    $.connection.hub.start().done(function () {
                        $.connection.sessionProgressProvider.server.getExecutionLiveTelecast(JSON.stringify(result.Item3), JSON.stringify(result.Item1.SessionDTO));
                    });

                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });


        }

        var logStatus = {
            SEVERE: "SEVERE",
            WARNING: "WARNING",
            INFO: "INFO",
            VERBOSE: "VERBOSE",
            TRACE: "TRACE",
            FAIL: "FAIL ",
            PASS: "PASS "
        };

        function encodeHtml(str) {
            str = str.replace(/\</g, "&lt;"); //for <
            str = str.replace(/\>/g, "&gt;"); //for >
            return str;
        }

        $scope.get_live_session_logs = function (msg, sessionId) {
            debugger;


            if (msg != 'SESSION_CLOSED_TOKEN_c9448c9b-7285-4ff5-8710-3be53fbf44f6') {

                var search = "";
                msg.replace(/[\r\n]/g, "");
                msg = encodeHtml(msg);
                if (msg.includes(logStatus.INFO)) {
                    search = logStatus.INFO;
                } else if (msg.includes(logStatus.WARNING)) {
                    search = logStatus.WARNING;
                } else if (msg.includes(logStatus.SEVERE)) {
                    search = logStatus.SEVERE;
                } else if (msg.includes(logStatus.TRACE)) {
                    search = logStatus.TRACE;
                } else if (msg.includes(logStatus.VERBOSE)) {
                    search = logStatus.VERBOSE;
                } else if (msg.includes(logStatus.FAIL)) {
                    search = logStatus.FAIL;
                } else if (msg.includes(logStatus.PASS)) {
                    search = logStatus.PASS;
                }

                var regex = new RegExp(search, 'i');
                msg = msg.replace('<soap', '&lt;soap');
                msg = msg.replace(regex, "<span class='" + search + "'>" + search + "</span>");


                var logs_total = dataFactory.Session_logs.hasOwnProperty(sessionId) ? dataFactory.Session_logs[sessionId] + msg: msg;

                var line_count = 160;

                var lines = logs_total.split('\n');

                var logs_to_display = "";

                if (lines.length > line_count) {
                    lines.splice(0, 1);
                    logs_to_display = lines.join("\n");
                } else {
                    logs_to_display = logs_total;
                }


                var div_logs = $("#div_logs");
                div_logs.text(logs_to_display);

                dataFactory.Session_logs[sessionId] = logs_to_display;

                if (div_logs.selectionStart == div_logs.selectionEnd) {
                    div_logs.scrollTop = div_logs.scrollHeight;
                }

            } else {


                $(".btn_execution_actions").addClass("disabled");
                $("#bt_show_result").removeClass("disabled");
                $("#bt_show_result").addClass("enabled");

                serviceFactory.notifier($scope, "Execution completed successfully", "success");
            }
        };



    }]);




