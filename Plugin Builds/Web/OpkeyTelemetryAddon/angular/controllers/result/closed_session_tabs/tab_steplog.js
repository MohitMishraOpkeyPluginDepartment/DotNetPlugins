angular.module('myApp').controller("result_closed_tab_steplog_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory) {

        var opkey_end_point =  $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        var currentSelectedNode = null;


        var current_session = null;

        $rootScope.scopeStepLogDetails = $scope;

        var logData = null;

        $scope.Load_Sub_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_Sub_View", Load_Sub_View);
        };

        function Load_Sub_View() {
            debugger;
            current_session = dataFactory.Selected_Execution_Node;

            currentSelectedNode = dataFactory.selectedTreeNodeData;

            GetStepLogs(currentSelectedNode.id);
        }
            function GetStepLogs (result_id) {
            debugger;
            logData = null;
            $.ajax({
                url: opkey_end_point+"/Result/GetResultAttachments",
                type: "Post",
                data: { sessionId: current_session.SessionId, resultID: result_id },
                success: function (result) {

                    $("#divDownloadStepLog").html('');

                    $("#divPanelStepLogs").addClass("no_ResultData");

                    var html = '';
                    logData = result !== null ? result : null;
                    $.each(result, function (ind, obj) {


                        html = html + '<div>' + fakingAngularCharacter(obj.LogData) + '</div>';
                        html = html + '<br>';


                    });

                    if (result.length > 0) {

                        $("#divPanelStepLogs").removeClass("no_ResultData");
                        $("#divDownloadStepLog").html(html);
                    }

                    $('#divPanelStepLogs').scrollTop(0);
                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            })

        }


        $scope.DownloadLogs = function () {
            debugger;
            if (logData != null) {

                $.ajax({
                    url: opkey_end_point +"/Result/DownloadStepLog",
                    type: "Post",
                    data: { sessionId: current_session.SessionId, resultID: currentSelectedNode.id },
                    success: function (res) {
                        download(res.LogData, logData[0].Name + ".txt", "text/plain");
                    },
                    error: function (error) {

                        serviceFactory.showError($scope, error);
                    }
                })
            }
            else {
                serviceFactory.notifier($scope, 'Nothing to download', 'error');
            }

        }
    }]);