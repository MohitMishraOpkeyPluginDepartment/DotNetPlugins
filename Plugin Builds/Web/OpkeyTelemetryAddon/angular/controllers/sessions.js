



angular.module('myApp').controller("sessions_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory) {

        var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        var array_Ids_to_delete = [];

        var array_OS = [];

        var array_Browser = [];

        var array_Resolution = [];

        var dictionary_OS = [];

        var dictionary_Browser = [];

        var dictionary_Resolution = [];

        $scope.Load_Main_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_Main_View", Load_Main_View);
        };

        function Load_Main_View() {
            debugger;

            //create_ddl("ddl_OS");
            //create_ddl("ddl_Browser");
            //create_ddl("ddl_Resolution");

            date_initializer();

            create_html_queued_session();

            setTimeout(function () {
                GetSessionsByProjectAndPortal();
            }, 1000);
        }

        function create_html_queued_session() {


            var datasource_queued_sessions = new kendo.data.DataSource({
                data: [],
                pageSize: 25,
            });

            $("#div_grid_sessions").kendoGrid({
                dataSource: datasource_queued_sessions,
                resizable: false,
                sortable: false,
                filterable: true,
                pageable: {
                    alwaysVisible: false,
                    pageSizes: [25, 50, 100, 500]
                },
                columns: [
                    {
                        headerTemplate: '<input aria-label="input" type="checkbox"  class="chk_all_sessions"/>',
                        template: function (e) {

                            var html = '';

                            // if (e.SessionState === "Closed") {
                            html = html + '<input type="checkbox" aria-label="input"  class="chk_selected_session"/>'
                            //  }

                            return html;

                        }, width: "28px"
                    },
                    { field: "BatchName", title: "Session", template: function (e) { return createCoulumnTitle(e.BatchName) }, width: "150px" },
                    { field: "OS", title: "OS", template: function (e) { if (e.OS != null && e.OS != "") { return createCoulumnTitle(e.OS) } else { return "NA" } } },
                    { field: "Browser", title: "Browser", template: function (e) { if (e.Browser != null && e.Browser != "") { return createCoulumnTitle(e.Browser) } else { return "NA" } } },
                    { field: "Resolution", title: "SystemResolution", width: "100px", headerTemplate: '<span title="SystemResolution">System Resolution</span>', template: function (e) { if (e.Resolution != null && e.Resolution != "") { return createCoulumnTitle(e.Resolution) } else { return "NA" } } },
                    { field: "ViewPort", title: "BrowserViewport", width: "100px", headerTemplate: '<span title="BrowserViewport">Browser Viewport</span>', template: function (e) { if (e.BrowserViewport != "") { return createCoulumnTitle(e.BrowserViewport) } else { return "NA" } } },
                    { field: "SessionStart", title: "Start", width: "120px", template: function (e) { return createCoulumnTitle(e.SessionStart) } },
                    {
                        field: "SessionEnd", title: "End", width: "120px", template: function (e) {
                            if (e.SessionState === "Closed") {
                                return createCoulumnTitle(e.SessionEnd)
                            }
                            else {
                                return "";
                            }
                        }
                    },
                    {
                        field: "SessionState", title: "Status", width: "100px", template: function (e) {
                            var html = "";

                            if (e.SessionState === "Closed") {

                                html = html + '<span title="' + e.SessionStatus + '" class="label ' + e.SessionStatus + '">' + e.SessionStatus + '</span>';


                            } else {
                                html = html + '<span title="' + e.SessionState + '" class="label ' + e.SessionState + '">' + e.SessionState + '</span>';

                            }
                            return html;
                        }
                    },
                    { field: "CreatedBy_Name", title: "CreatedBy", template: function (e) { return createCoulumnTitle(e.CreatedBy_Name) } },
                    {
                        title: 'Actions',
                        template: function (e) {
                            var html = "";
                            debugger;
                            if (e.SessionState === "Closed") {

                                html = html + '<a href="Javascript:void(0)" class="view_closed_session" style="font-size: 9px;"><i class="oci oci-result fa-lg" title="View Session"></i></a>&nbsp;&nbsp;';
                                html = html + '<a href="Javascript:void(0)" class="delete_closed_session"><i class="fa fa-trash fa-lg colorRed" title="Delete Session"></i></a>';

                            } else if (e.SessionState === "Running" || e.SessionState === "Paused") {

                                html = html + '<a href="Javascript:void(0)" class="view_running_session" id="an_view_log"><i class="fa fa-lg fa-lightbulb-o" title="View Log"></i></a>&nbsp;&nbsp;&nbsp;';
                                if (e.BatchName.indexOf('Local_Execution') != 0) {
                                    html = html + '<a href="Javascript:void(0)" class="view_running_session_screen"><i class="fa fa fa-desktop" title="View Live Screen"></i></a>&nbsp;&nbsp;&nbsp;';
                                }
                                html = html + '<a href="Javascript:void(0)" class="stop_closed_session"><i class="fa fa-stop colorRed" title="Stop Session"></i></a>';

                            }
                            



                            return html;
                        },
                        width: "90px",
                        sortable: false
                    }
                ],
                dataBound: function (e) {
                    debugger;
                    if (dataFactory.MultiBrowser_ExecutionType == EnumExecutionType.Local) {
                        $(".view_running_session_screen").hide();
                    }

                    $('.delete_closed_session').unbind().click(function (e) {
                        debugger;

                        var kendo_grid = formControlFactory.GetKendoGrid("div_grid_sessions");
                        var kendo_grid_row_data = kendo_grid.dataItem($(this).closest('tr'));
                        array_Ids_to_delete = [];
                        array_Ids_to_delete.push(kendo_grid_row_data.SessionId);
                        delete_session_inner(array_Ids_to_delete);
                    });

                    $('.Stop_closed_session').unbind().click(function (e) {
                        debugger;
                        var kendo_grid = formControlFactory.GetKendoGrid("div_grid_sessions");
                        var kendo_grid_row_data = kendo_grid.dataItem($(this).closest('tr'));
                        stop_session_inner(kendo_grid_row_data.SessionId);
                    });

                    $('.view_closed_session').unbind().click(function (e) {
                        debugger;

                        var kendo_grid = formControlFactory.GetKendoGrid("div_grid_sessions");
                        var kendo_grid_row_data = kendo_grid.dataItem($(this).closest('tr'));

                        dataFactory.Selected_Execution_Node = kendo_grid_row_data;
                        $scope.ChangePageView('result.closed_session');

                    });

                    $('.view_running_session').unbind().click(function (e) {
                        debugger;

                        var kendo_grid = formControlFactory.GetKendoGrid("div_grid_sessions");
                        var kendo_grid_row_data = kendo_grid.dataItem($(this).closest('tr'));

                        dataFactory.Select_live_Window = "Log";
                        dataFactory.Selected_Execution_Node = kendo_grid_row_data;

                        $scope.ChangePageView('result.live_session');

                    });

                    $('.view_running_session_screen').unbind().click(function (e) {
                        debugger;

                        var kendo_grid = formControlFactory.GetKendoGrid("div_grid_sessions");
                        var kendo_grid_row_data = kendo_grid.dataItem($(this).closest('tr'));

                        dataFactory.Select_live_Window = "Window";
                        dataFactory.Selected_Execution_Node = kendo_grid_row_data;

                        $scope.ChangePageView('result.live_session');

                    });


                    $('.pin_running_session').unbind().click(function (e) {
                        debugger;
                        var kendo_grid = formControlFactory.GetKendoGrid("div_grid_sessions");
                        var kendo_grid_row_data = kendo_grid.dataItem($(this).closest('tr'));
                        if (dataFactory.Pin_Live_Executions.hasOwnProperty(kendo_grid_row_data.SessionId)) {
                            delete dataFactory.Pin_Live_Executions[kendo_grid_row_data.SessionId];

                            serviceFactory.notifier($scope, "Execution Unpined Successfully", "success");
                        } else {
                            GetBrowserCloudScreenURL(true, kendo_grid_row_data.SessionId);
                            // dataFactory.Pin_Live_Executions[sessionId] = sessionId;
                        }
                        $scope.Reload_Sessions();

                    });




                    $('.chk_all_sessions').click(function (e) {
                        $("#div_grid_sessions .chk_selected_session").prop("checked", e.currentTarget.checked);
                    });

                    $('.chk_selected_session').click(function (e) {

                    });

                    var checkedArtifact = $("#div_grid_sessions .chk_selected_session:checked").length;
                    var kendoGridTestCase = formControlFactory.GetKendoGrid("div_grid_sessions");
                    var totalArtifact = kendoGridTestCase.dataSource.total();

                    if (checkedArtifact === totalArtifact && totalArtifact !== 0) {
                        $('.chk_all_sessions').prop("checked", true);
                    }
                    else {
                        $('.chk_all_sessions').prop("checked", false);
                    }

                },
                edit: function (e) {
                }
            }).getKendoGrid();

        }

        function GetBrowserCloudScreenURL(flag, sessionId) {
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

                    dataFactory.Pin_Live_Executions[sessionId] = result;
                    if (flag) {
                        serviceFactory.notifier($scope, "Execution Pined Successfully", "success");
                    }

                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function create_ddl(element) {
            debugger;

            $("#" + element).kendoDropDownList({
                dataSource: [],
                index: 0,
                select: function (e) {
                    debugger;

                    var selected_value = e.dataItem;

                    search_filter();
                }
            });

        }

        function search_filter() {
            debugger;
            var value1 = $("#txt_clear_session").val();
            var ddl_OS = $("#ddl_OS").data("kendoDropDownList").value();
            var ddl_Browser = $("#ddl_Browser").data("kendoDropDownList").value();
            var ddl_Resolution = $("#ddl_Resolution").data("kendoDropDownList").value();

            var final_value = value1 + " " + ddl_OS + " " + ddl_Browser + " " + ddl_Resolution;

            On_Search_Sessions_Inner(final_value);

        }

        function date_initializer() {

            $(".maskDateA").inputmask("dd/mm/yyyy", { "placeholder": "dd/mm/yyyy" });
            var d = new Date();

            var month = d.getMonth() + 1;
            var day = d.getDate();

            var output =
                (day < 10 ? '0' : '') + day + '/' +
                (month < 10 ? '0' : '') + month + '/' + d.getFullYear();


            setTimeout(function () {
                $(".maskDateA").val(output);
            }, 200);


            $("#txt_start_date").kendoDatePicker({
                format: "dd/MM/yyyy",
                // disableDates: disable_start_date,
                change: function () { },
                close: function () { },
                open: function () { }
            });

            $("#txt_end_date").kendoDatePicker({
                format: "dd/MM/yyyy",
                //  disableDates: disable_end_date,
                change: function () { },
                close: function () { },
                open: function () { }
            });


            function disable_start_date(date) {
                debugger;
                return (date && date.getTime() > (new Date()).getTime());
            }


            function disable_end_date(date) {
                debugger;
                var start_date = $("#txt_start_date").data('kendoDatePicker');
                var current_date_value = (start_date == undefined || start_date.value() == null) ? new Date('1999-01-01T03:24:00') : start_date.value();

                var current_date = new Date();
                current_date = current_date.getFullYear() + '/' + (current_date.getMonth() + 1) + '/' + current_date.getDate();
                current_date_value = current_date_value.getFullYear() + '/' + (current_date_value.getMonth() + 1) + '/' + current_date_value.getDate();

                if (new Date(current_date_value) <= date && new Date(current_date) >= date) {
                    return false;
                }
                return true;
            }

        }

        function GetSessionsByProjectAndPortal() {
            debugger;

            var startDate = $("#txt_start_date").val();
            var endDate = $("#txt_end_date").val();


            loadingStart('#div_grid_sessions', "Please Wait ...", ".btnTestLoader");

            $.ajax({
                url: opkey_end_point + "/MultiBrowser/GetSessionsByDateAndPortal",
                data: { startDate: startDate, endDate: endDate, job_type: "MultiBrowser" },
                type: "GET",
                success: function (result, status, response) {
                    debugger;
                    loadingStop('#div_grid_sessions', ".btnTestLoader");

                    if (response.hasOwnProperty("responseText")) {
                        if (response.responseText.indexOf("Login and experience") > -1 || response.responseText.indexOf('Login into your account') > -1) {
                            $scope.ChangePageView("options.login");
                        }
                    } else {
                        $scope.ChangePageView("options.login");
                    }

                    var kendo_grid = formControlFactory.GetKendoGrid("div_grid_sessions");
                    formControlFactory.BindKendoGridData(kendo_grid, result);


                    $.each(result, function (ind, obj) {

                        if (obj.OS !== "") {

                            if (!dictionary_OS.hasOwnProperty(obj.OS)) {
                                array_OS.push(obj.OS)
                            } else {
                                dictionary_OS[obj.OS] = obj.OS;
                            }
                        }

                        if (obj.Browser !== "") {
                            if (!dictionary_Browser.hasOwnProperty(obj.Browser)) {
                                array_Browser.push(obj.Browser)
                            } else {
                                dictionary_Browser[obj.Browser] = obj.Browser;
                            }
                        }

                        if (obj.Resolution !== "") {
                            if (!dictionary_Resolution.hasOwnProperty(obj.Resolution)) {
                                array_Resolution.push(obj.Resolution)
                            } else {
                                dictionary_Resolution[obj.Resolution] = obj.Resolution;
                            }
                        }


                    });

                    //$("#ddl_OS").data("kendoDropDownList").setDataSource(array_OS);
                    //$("#ddl_Browser").data("kendoDropDownList").setDataSource(array_Browser);
                    //$("#ddl_Resolution").data("kendoDropDownList").setDataSource(array_Resolution);

                    // $("#ddlRegions").data("kendoDropDownList").value(result[0]);



                },
                complete: function (response) {

                    console.log("response");
                    console.log(response);

                    if (response.hasOwnProperty("responseText")) {
                        if (response.responseText.indexOf("Login and experience") > -1) {
                            $scope.ChangePageView("options.login");
                        }
                    } else {
                        $scope.ChangePageView("options.login");
                    }

                },
                error: function (error) {
                    loadingStop('#div_grid_sessions', ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }


            });

        }

        $scope.On_Search_Sessions = function () {

            var value = $("#txt_clear_session").val();
            On_Search_Sessions_Inner(value);
        };

        function On_Search_Sessions_Inner(value) {


            $("#div_grid_sessions").data("kendoGrid").dataSource.filter({
                logic: "or",
                filters: [

                    { field: "BatchName", operator: "contains", value: value },
                    { field: "OS", operator: "contains", value: value },
                    { field: "Browser", operator: "contains", value: value },
                    { field: "Resolution", operator: "contains", value: value },
                    { field: "SessionStart", operator: "contains", value: value },
                    { field: "SessionEnd", operator: "contains", value: value },
                    { field: "SessionState", operator: "contains", value: value },
                    { field: "SessionStatus", operator: "contains", value: value },
                    { field: "CreatedBy_Name", operator: "contains", value: value },


                ]
            });


        }

        $scope.Clear_Search_Sessions = function () {
            $('#txt_clear_session').val('');
            $scope.On_Search_Sessions();
        };

        $scope.Reload_Sessions = function () {
            debugger;
            $scope.Clear_Search_Sessions();
            GetSessionsByProjectAndPortal();
        }

        $scope.Delete_Sessions = function () {
            debugger;
            var Session_kendo_grid = formControlFactory.GetKendoGrid("div_grid_sessions");
            array_Ids_to_delete = [];
            if (Session_kendo_grid != undefined) {
                var allSelectedSession = $("#div_grid_sessions tbody tr").has('input:checked');
                if (allSelectedSession.length === 0) {
                    serviceFactory.notifier($scope, "Please select atleast one session", "warning");
                    return false;
                }
                $.each(allSelectedSession, function (idx, row) {
                    debugger;
                    var item = Session_kendo_grid.dataItem(row);
                    array_Ids_to_delete.push(item.SessionId);
                });
            }
            delete_session_inner(array_Ids_to_delete);
        }

        function stop_session_inner(sessionId) {
            debugger;
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
                                debugger;
                                $scope.Reload_Sessions();
                                serviceFactory.notifier($scope, "Execution stopped", "warning");
                            },
                            error: function (error) {
                                serviceFactory.showError($scope, error);
                            }
                        });

                    }


                }

            });
        }

        function delete_session_inner(sessionIDs) {
            debugger;



            $.msgBox({
                title: "Delete",
                content: "Are you sure want to delete this session ?",
                modal: true,
                type: "confirm",
                buttons: [{ value: "Yes" }, { value: "No" }],
                success: function (result) {
                    debugger;


                    if (result == "Yes") {

                        loadingStart('#div_grid_sessions', "Please Wait ...", ".btnTestLoader");
                        $.ajax({
                            url: opkey_end_point + "/Result/deleteMultipleSessions",
                            data: { str_sessionIDs: JSON.stringify(sessionIDs) },
                            type: "Post",
                            success: function (result) {
                                loadingStop("#div_grid_sessions", ".btnTestLoader");
                                $scope.Reload_Sessions();
                                serviceFactory.notifier($scope, "session deleted successfully!!", "success");

                            },
                            error: function (error) {
                                loadingStop("#div_grid_sessions", ".btnTestLoader");
                                serviceFactory.showError($scope, error);
                            }
                        });


                    } else {
                        arrayOfSession = [];
                    }
                }

            });
        }

     
    }]);




