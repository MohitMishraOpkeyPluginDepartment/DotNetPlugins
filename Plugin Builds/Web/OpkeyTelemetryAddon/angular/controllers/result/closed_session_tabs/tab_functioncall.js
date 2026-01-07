angular.module('myApp').controller("result_closed_tab_fun_call_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory) {

        var opkey_end_point =  $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        var currentSelectedNode = null;

        var isEncrypted = false;

        var current_session = null;

        $rootScope.scopeFunctionCallDetails = $scope;

        $scope.Load_Sub_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_Sub_View", Load_Sub_View);
        };

        function Load_Sub_View() {
            debugger;
            current_session = dataFactory.Selected_Execution_Node;

            currentSelectedNode = dataFactory.selectedTreeNodeData;

            getFunctionCall(currentSelectedNode.id, isEncrypted);
        }
        function getFunctionCall(result_id, isEncrypted) {
            var data, functionCallURL;
            functionCallURL = opkey_end_point+"/Result/getFunctionCall"
            data = { Result_ID: result_id, decryptData: isEncrypted, SessionID: current_session.SessionId }
            $.ajax({
                url: functionCallURL,//dataFactory.RESULT_SERVER_URL +"/Result/getFunctionCall",
                type: "POST",
                data: data,
                crossDomain: true,
                success: function (res) {
                    debugger;
                    if (res == "") {
                        $('[ng-model="FunctionCall"]').parent().addClass('no_ResultData');
                    }
                    else {
                        $('[ng-model="FunctionCall"]').parent().removeClass('no_ResultData');

                    }
                    $scope.FunctionCall = res;

                    $scope.$apply();
                    $('#idForLabel1').scrollTop(0);
                },
                error: function (error) {
                    if (error.responseJSON != null) {
                        serviceFactory.showError($scope, error);
                    }
                }
            })
        }

    }]);