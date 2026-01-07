
angular.module('myApp').controller("project_selection_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory) {

        var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        $scope.Load_Sub_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_sub_View", Load_Sub_View);
        };


        function Load_Sub_View() {
            $("#li_logout").show();
            $("#div_panelOptionsDetails").removeClass("col-sm-12");
            $("#div_panelOptionsDetails").addClass("col-sm-8");
            $("#div_panelOptions").hide();
            $("#divParent").removeClass("UserLogin");
            $("#li_user_info").show();
            $("#Main_HomeBanner").show();
            $("#div_footer_tutoriol").show();
            $("#div_panelOptions").show();
            $(".navbar.navbar-default").show();
            $("#Main_Home").removeClass('col-sm-9');
            $("#Main_Home").addClass('col-sm-12');
            create_grid_project_list();
            get_all_projects();
        }

        function create_grid_project_list() {

            var datasource_queued_Projects = new kendo.data.DataSource({
                data: [],
                //pageSize: 10,
            });

            $("#div_grid_projects").kendoGrid({
                dataSource: datasource_queued_Projects,
                resizable: false,
                sortable: false,
                //filterable: true,
                //pageable: {
                //    alwaysVisible: false,
                //    pageSizes: [25, 50, 100, 500]
                //},
                columns: [
                    {
                        field: "Name", title: "Name", template: function (e) {
                            var html = '';
                            html = html + '<span id="sp_' + e.P_ID + '">';
                            html = html + fakingAngularCharacter(e.Name);
                            html = html + '</span>';
                            return html;
                        }
                    },
                ],
                dataBound: function (e) {

                    $('tr').unbind().click(function (e) {
                        debugger;

                        var kendo_grid = formControlFactory.GetKendoGrid("div_grid_projects");
                        var kendo_grid_row_data = kendo_grid.dataItem($(this).closest('tr'));
                        choose_project(kendo_grid_row_data.P_ID, kendo_grid_row_data.Name);
                    });

                },
                edit: function (e) {
                }
            }).getKendoGrid();



        }

        $scope.On_Search_Projects = function () {

            var value = $("#txt_SearchProject").val();
            On_Search_Projects_Inner(value);
        };

        function On_Search_Projects_Inner(value) {


            $("#div_grid_projects").data("kendoGrid").dataSource.filter({
                logic: "or",
                filters: [

                    { field: "Name", operator: "contains", value: value }


                ]
            });


        }

        $scope.Clear_Search_Projects = function () {
            $('#txt_SearchProject').val('');
            $scope.On_Search_Projects();
        };

        function get_all_projects() {

            opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

            var current_project_id = $rootScope.Scope_Main.Get_Opkey_URL("SELECTED_PROJECT_PID");

            if (current_project_id == null || current_project_id == "") {
                current_project_id = dataFactory.EmptyGuid;
            }
            loadingStart("#divProject_selection", "Please Wait ...", ".btnTestLoader");
            $.ajax({
                url: opkey_end_point + "/OpkeyApi/GetListOfAssignedProject",
                type: "GET",
                success: function (result) {
                    debugger;
                    loadingStop("#divProject_selection", ".btnTestLoader");


                    var kendo_grid = formControlFactory.GetKendoGrid("div_grid_projects");
                    formControlFactory.BindKendoGridData(kendo_grid, result);


                    $("#sp_" + current_project_id).closest("tr").addClass("k-state-selected");

                    setTimeout(function () {
                        var topMargin = $("#div_grid_projects tr.k-state-selected")[0].offsetTop - 100;
                        $("#div_grid_projects .k-grid-content").scrollTop(topMargin);
                    }, 200)


                },
                error: function (error) {
                    loadingStop("#divProject_selection", ".btnTestLoader");
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
                    localStorage.clear();
                    serviceFactory.showError($scope, error);
                    $("#spErrorMessage").text("Unable to Connect to Given Domain");
                    $("#divPanelErrorMessage").show();
                }
            });


        }

        function choose_project(projectId, projectName) {
            debugger;

            opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");
            var remember_me = $("#chk_rememeber_project").is(':checked');

            loadingStart("#divProject_selection", "Please Wait ...", ".btnTestLoader");
            $.ajax({
                url: opkey_end_point + "/OpkeyApi/ChooseProject",
                data: { projectId: projectId, remember_project_selection: remember_me },
                type: "GET",
                success: function (result) {
                    debugger;
                    loadingStop("#divProject_selection", ".btnTestLoader");
                    $("#li_project_info").show();

                    $("#li_project_info").attr('title', 'Switch Project (' + projectName + ')'); //Tooltip should be according to selected project
                    if (projectName.length > 15) {
                        projectName = projectName.substring(0, 15)
                            + "...";
                    }

                    serviceFactory.SetGlobalSetting("OPKEY_PROJECT_NAME", projectName);
                    serviceFactory.SetGlobalSetting("SELECTED_PROJECT_PID", projectId);



                    $("#sp_project_info").text(projectName);

                    $("#divPanel_Options").removeClass("disabled");
                    $scope.ChangePageView('options.recording_selection');
                },
                error: function (error) {
                    loadingStop("#divProject_selection", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });


        }




    }]);




