



angular.module('myApp').controller("result_closed_tab_attachment_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory) {

        var opkey_end_point =  $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        var currentSelectedNode = null;


        var current_session = null;

        $rootScope.scopeStepAttachmentDetails = $scope;

        var logData = null;

        $scope.Load_Sub_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_Sub_View", Load_Sub_View);
        };

        function Load_Sub_View() {
            debugger;
            current_session = dataFactory.Selected_Execution_Node;

            currentSelectedNode = dataFactory.selectedTreeNodeData;

            GetStepAttachments();
            
        }
        function GetStepAttachments() {
            debugger;

            $("#divDownloadStepAttachment").html('');

            $("#divPanelStepAttachments").addClass("no_ResultData")
            logData = null;


            if (currentSelectedNode.original.type != "Flow" && currentSelectedNode.original.type != "BP_Group") {
                return false;
            }

            $.ajax({
                url: opkey_end_point+"/Result/GetStepAttachments",
                type: "Post",
                data: { sessionId: current_session.SessionId, resultID: currentSelectedNode.id, type: currentSelectedNode.original.type },
                success: function (result) {


                    var html = '';
                    logData = result !== null ? result : null;
                    $.each(result, function (ind, obj) {

                        html = html + '<div class="reboot-Table-Body-B">';
                        html = html + '<div style="width:70% !important"><span>' + obj.Name + '</span></div>';
                        html = html + '<div style="width:30% !important">';
                        html = html + '<a class="downloadAttachment" an-data="' + obj.LogData + '" an-name="' + obj.Name + '" target="_blank"><i class="fa fa-download"></i>&nbsp;Download</a>'
                        html = html + '</div>';
                        html = html + '</div>';


                    });
                    if (result.length > 0) {
                        $("#divPanelStepAttachments").removeClass("no_ResultData");
                        $("#divDownloadStepAttachment").html(html);


                        $(".downloadAttachment").bind("click", function () {
                            debugger;

                            var actualPath = $(this).attr("an-data");

                            if (actualPath.indexOf("s3.amazonaws") != -1) {
                                window.location.href = actualPath;
                            }
                            else {

                                var filePath = $(this).attr("an-data").replace("/", /\\/g);
                                window.location.href = opkey_end_point +"/Helper/DownloadFileByPath?filePath=" + filePath;
                            }
                        })

                        $(".downloadAll").bind("click", function () {
                            debugger;

                            var allFiles = $(".downloadAttachment");

                            $.each(allFiles, function (ind, obj) {

                                console.log(obj)
                                setTimeout(function () {
                                    var filePath = $(obj).attr("an-data").replace("/", /\\/g);
                                    window.location.href = opkey_end_point +"/Helper/DownloadFileByPath?filePath=" + filePath;
                                }, 100)

                            });

                        })

                    }


                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            })

        }
    }]);




