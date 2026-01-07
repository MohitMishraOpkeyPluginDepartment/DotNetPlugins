angular.module('myApp').controller("result_closed_tab_debuginfo_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory) {

        var opkey_end_point =  $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        var currentSelectedNode = null;

        var isEncrypted = false;

        var current_session = null;

        $rootScope.scopeDebugInfoDetails = $scope;

        $scope.Load_Sub_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_Sub_View", Load_Sub_View);
        };

        function Load_Sub_View() {
            debugger;
            current_session = dataFactory.Selected_Execution_Node;

            currentSelectedNode = dataFactory.selectedTreeNodeData;

            getDebugInformation(currentSelectedNode.id);
        }
        function getDebugInformation(result_ID) {
            var data, debugURL;
            debugURL = opkey_end_point+"/Result/getDebugInformation"
            data = { Result_ID: result_ID, SessionID: current_session.SessionId  }

            $.ajax({
                url: debugURL,
                type: "Post",
                crossDomain: true,
                data: data,
                success: function (res) {
                    debugger;
                    if (res == "") {
                        $('div[ng-model="DebugInfo"]').addClass('no_ResultData');
                    }
                    else {
                        $('div[ng-model="DebugInfo"]').removeClass('no_ResultData');

                    }
                    $scope.DebugInfo = res;
                    $scope.$apply();
                },
                error: function (error) {
                    if (error.responseJSON != null) {
                        Message(error.responseJSON.message, 'Error');
                    } else {
                        // GetErrorMessage(error.responseText)
                    }
                }
            });
        }
    }]);