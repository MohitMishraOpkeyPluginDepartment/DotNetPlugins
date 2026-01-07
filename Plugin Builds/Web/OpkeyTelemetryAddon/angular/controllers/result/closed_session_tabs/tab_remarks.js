angular.module('myApp').controller("result_closed_tab_remark_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory) {

        var opkey_end_point =  $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        var currentSelectedNode = null;


        var current_session = null;

        $rootScope.scopeRemarksDetails = $scope;

        $scope.Load_Sub_View = function () {
            debugger

            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_Sub_View", Load_Sub_View);
        };

        function Load_Sub_View() {
            debugger;
            current_session = dataFactory.Selected_Execution_Node;

            currentSelectedNode = dataFactory.selectedTreeNodeData;

            getRemarks(currentSelectedNode.id);

        }
        function getRemarks(result_id) {
            $.ajax({
                url: opkey_end_point+"/Result/getRemarks",
                type: "Post",
                crossDomain: true,
                data: { SessionID: current_session.SessionId, Result_ID: result_id },
                success: function (res) {
                    $scope.Remark = res;
                    $scope.$apply();

                    $("#Remark_textarea").text(res)
                    $("#Remark_textarea").val(res)

                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });
        }
        $scope.remarkChar = function ($event) {
            debugger;
            var len = $event.currentTarget.value.length;
            if ($event.keyCode == 8 || $event.keyCode == 46) {
                return false;
            }
            if (len >= 256) {
                $.msgBox({
                    title: "OpKey",
                    content: "Remarks can not exceed more than 255 characters.",
                    modal: true,
                    type: "error",
                    buttons: [{ value: "ok" }],
                    success: function (result) {
                        debugger;
                        if (result == "ok") {
                            $event.currentTarget.value = $event.currentTarget.value.substring(0, 255);
                        }
                    }
                });
            } else {
                256 - $('#Remark_textarea').val().length;
            }
        };
        $scope.SaveRemark = function () {
            var txtData = $('#Remark_textarea').val();
            var setRemarks = txtData;
            currentSelectedNode.data.Remarks = txtData;
            saveRemarks(currentSelectedNode.id, setRemarks);

        }
        function saveRemarks(result_id, setRemarks) {           
            $.ajax({
                url: opkey_end_point +"/Result/saveRemarks",
                type: "Post",
                crossDomain: true,
                data: { SessionID: current_session.SessionId, Result_ID: result_id, remarks: setRemarks },
                success: function (res) {
                    serviceFactory.notifier($scope, 'Save Successfully', 'Success');
                },
                error: function (error) {
                    if (error.responseJSON != null) {
                        serviceFactory.showError($scope, error);
                    } 
                }
            });
        }
    }]);