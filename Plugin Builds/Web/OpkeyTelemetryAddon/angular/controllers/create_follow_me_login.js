angular.module('myApp').controller("createFollowMeLogin_ctrl", [
    '$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory', '$kWindow',
    function($rootScope, $scope, serviceFactory, dataFactory, formControlFactory, $kWindow) {

        var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        $scope.Load_Sub_View = function() {
            debugger;
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_Sub_View", Load_View);
        }

        function Load_View() {
            debugger;
            $("#Main_HomeBanner").hide();
            $("#Main_Home").removeClass('col-sm-9');
            $("#Main_Home").addClass('col-sm-12');
            $('#li_Recording_Selection_Info').show();
            //$("#txtBrowserCloudRelayServer").val('https://dev1-browsercloud-in.pcloudy.com');
            //$("#txtpCloudyEndpoint").val('https://test.pcloudy.com');
            //$("#txtUserEmail").val('rishabh.verma@sstsinc.com');
            //$("#txtpCloudyAccessKey").val('rdz4mtrprbz7wcysp98fh3g5');

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
        $scope.SelectCloud = function() {
            debugger;


            var form_validator_response = form_validator();

            if (!form_validator_response) {
                return false;
            }

            var txtBrowserCloudRelayServer = $("#txtBrowserCloudRelayServer").val().trim();
            var txtpCloudyEndpoint = $("#txtpCloudyEndpoint").val().trim();
            var txtUserEmail = $("#txtUserEmail").val().trim();
            var txtpCloudyAccessKey = $("#txtpCloudyAccessKey").val().trim();


            loadingStart("#div_panel_run_now", "Please Wait ...", ".btnTestLoader");
            $.ajax({
                url: opkey_end_point + '/BrowserCloud/authenticate',
                data: { browserCloudRelayServer: txtBrowserCloudRelayServer, pCloudyEndpoint: txtpCloudyEndpoint, userEmail: txtUserEmail, pCloudyAccessKey: txtpCloudyAccessKey, rememberMe: true },
                success: function(result) {
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

                    $scope.ChangePageView('options.create_followme');


                },
                error: function(error) {
                    loadingStop("#divPanel_Login_pCloudy", ".btnTestLoader");
                    loadingStop("#div_panel_run_now", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }


            });



        }
    }
]);