
angular.module('myApp').controller("option_execution_selection_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory) {

        var opkey_end_point =  $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        $scope.Load_Sub_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_Sub_View", Load_Sub_View);
        };

        function Load_Sub_View() {
          //  $scope.Select_Option_Tab("Run_Test");
           // $scope.GetEnvironmentType();
           // $scope.ChangeExecutionType(EnumExecutionType.Local);
            checkBrowserCloudCredentials();
            $("#div_panelOptions").show();
            $("#Main_Home").removeClass("col-sm-9");
            $("#Main_Home").addClass("col-sm-12");
            $(".homepage_body").addClass("d-flex");
        }

        function checkBrowserCloudCredentials() {

            $.ajax({
                url: opkey_end_point + "/BrowserCloud/getBrowserCloudCredentials",
                success: function (result) {
                    debugger;
                    if (result.rememberMe) {
                        dataFactory.MultiBrowser_ExecutionType = EnumExecutionType.Cloud;

                        
                        $("#txtBrowserCloudRelayServer").val(result.browserCloudRelayServer);
                        $("#txtpCloudyEndpoint").val(result.pCloudyEndPoint);
                        $("#txtUserEmail").val(result.userEmail);
                        $("#txtpCloudyAccessKey").val(result.pCloudyAccessKey);
                        $("#rememberme").prop("checked", result.rememberMe);

                        //$scope.SelectCloud();
                    }
                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            })
        }

        $scope.ChangeExecutionType = function (type) {
            debugger;
            $("#div_formCloud").bury(true);
            $(".featur_execution_tab").removeClass("active");
            $(".panel_execution_type").bury(true);
            $(".action_execution_selection").bury(true);

            $("#div_Selection_" + type).addClass("active");


            if (type === EnumExecutionType.Local) {

                $("#div_formLocal").bury(false);
                $("#btSelection_Local").bury(false);

            } else if (type === EnumExecutionType.Cloud) {
                $("#div_formCloud").bury(false);
                $("#btSelection_Browser").bury(false);

                $("#txtBrowserCloudRelayServer").val('https://prod-browsercloud-in.pcloudy.com');
                $("#txtpCloudyEndpoint").val('https://device.pcloudy.com/');
                //$("#txtUserEmail").val('santanu.pradhan@sstsinc.com');
                //$("#txtpCloudyAccessKey").val('cfp2mzt5xbh6kvyk2y6j32dv');
            }

        }

        function form_validator() {
            debugger;

            var txtBrowserCloudRelayServer = $("#txtBrowserCloudRelayServer").val().trim();
            var txtpCloudyEndpoint = $("#txtpCloudyEndpoint").val().trim();
            var txtUserEmail = $("#txtUserEmail").val().trim();
            var txtpCloudyAccessKey = $("#txtpCloudyAccessKey").val().trim();


            if (txtBrowserCloudRelayServer == empty) {
                $("#spError_BrowserCloudRelayServer").text("Browser cloud relay server is required");
                return false;
            }

            if (txtpCloudyEndpoint == empty) {
                $("#spError_pCloudyEndpoint").text("pcloudy end point is required");
                return false;
            }

            if (txtUserEmail == empty) {
                $("#spError_UserEmail").text("pcloudy user email is required");
                return false;
            }


            if (txtpCloudyAccessKey == empty) {
                $("#spError_pCloudyAccessKey").text("pcloudy access key is required");
                return false;
            }

            return true;

        }

        $scope.SelectCloud = function () {
            debugger;
            

            var form_validator_response = form_validator();

            if (!form_validator_response) {
                return false;
            }

            var txtBrowserCloudRelayServer = $("#txtBrowserCloudRelayServer").val().trim();
            var txtpCloudyEndpoint = $("#txtpCloudyEndpoint").val().trim();
            var txtUserEmail = $("#txtUserEmail").val().trim();
            var txtpCloudyAccessKey = $("#txtpCloudyAccessKey").val().trim();
            var rememberme = $("#rememberme").prop("checked");

            var strBrowserCloudCredentials = new Object();
            strBrowserCloudCredentials["browserCloudRelayServer"] = txtBrowserCloudRelayServer;
            strBrowserCloudCredentials["pCloudyEndPoint"] = txtpCloudyEndpoint;
            strBrowserCloudCredentials["userEmail"] = txtUserEmail;
            strBrowserCloudCredentials["pCloudyAccessKey"] = txtpCloudyAccessKey;
            strBrowserCloudCredentials["rememberMe"] = rememberme;

            loadingStart("#div_panel_run_now", "Please Wait ...", ".btnTestLoader");
            $.ajax({
                url: opkey_end_point + '/BrowserCloud/authenticate',
                data: { browserCloudRelayServer: txtBrowserCloudRelayServer, pCloudyEndPoint: txtpCloudyEndpoint, userEmail: txtUserEmail, pCloudyAccessKey: txtpCloudyAccessKey, rememberMe: rememberme },
                success: function (result) {
                    loadingStop("#div_panel_run_now", ".btnTestLoader");
                    //alert("success");
                    //serviceFactory.notifier($scope, 'Login success', 'success');
                    dataFactory.MultiBrowser_ExecutionType = EnumExecutionType.Cloud;

                    var object_pcloudy = new Object();
                    object_pcloudy["browserCloudRelayServer"] = txtBrowserCloudRelayServer;
                    object_pcloudy["pCloudyEndpoint"] = txtpCloudyEndpoint;
                    object_pcloudy["userEmail"] = txtUserEmail;
                    object_pcloudy["pCloudyAccessKey"] = txtpCloudyAccessKey;
                    object_pcloudy["AuthToken"] = result;

                    dataFactory.Response_pcloudy_credentials = object_pcloudy;

                    $scope.ChangePageView('multibrowser');


                },
                error: function (error) {
                    loadingStop("#divPanel_Login_pCloudy", ".btnTestLoader");
                    loadingStop("#div_panel_run_now", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }


            });



        }

        //$scope.SelectLocal = function () {
        //    debugger;

        //    dataFactory.MultiBrowser_ExecutionType = EnumExecutionType.Local;
        //    $scope.ChangePageView('multibrowser');

        //}



        $scope.GetEnvironmentType = function () {
            debugger;

            loadingStart("#div_panel_run_now", "Please Wait ...", ".btnTestLoader");
            $.ajax({
                url: opkey_end_point + '/Login/GetEnvironmentType',
               success: function (result) {
                   loadingStop("#div_panel_run_now", ".btnTestLoader");
                   play_tabs_execution(result);        
                },
                error: function (error) {
                    loadingStop("#divPanel_Login_pCloudy", ".btnTestLoader");
                   // serviceFactory.showError($scope, error);
                    play_tabs_execution("Cloud"); 
                }
            });
        }




        function play_tabs_execution(result) {
            if (result === "Local") {
                $("#div_selection_local").removeClass("col-sm-6");
                $("#div_selection_cloud").removeClass("col-sm-6");
                $("#div_selection_local").addClass("col-sm-12");
                $("#div_Selection_Cloud").hide();
                $("#div_selection_local").removeClass("padding-right-zero");
            }

        }

    }]);




