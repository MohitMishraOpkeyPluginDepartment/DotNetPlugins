angular.module('myApp').controller("result_closed_tab_step_detail_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory) {

        var opkey_end_point =  $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        var currentSelectedNode = null;

        var isEncrypted = false;

        var current_session = null;

        $rootScope.scopeStepDetails = $scope;

        $scope.Load_Sub_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_Sub_View", Load_Sub_View);
        };

        function Load_Sub_View() {
            debugger;
            current_session = dataFactory.Selected_Execution_Node;

            currentSelectedNode = dataFactory.selectedTreeNodeData;

            $scope.bindStepdetailsData(currentSelectedNode);
        }
        $scope.bindStepdetailsData=function(treeNode) {
            $('.div_DataSet').show();

            if (treeNode.original.type == "Suite" || treeNode.original.type == "Sparkin" || treeNode.original.type == "BP_Group" || treeNode.original.type == "Flow" || treeNode.original.type == "Gherkin" || treeNode.original.type == "Component" || treeNode.original.type == "DataSet" || treeNode.original.type == "Datasheet" || treeNode.original.type == "FlowStepGroup" || treeNode.original.type == "FlowStepGroupIteration") {
                $('.type_suite_Gherkin_TC_FL').removeClass('col-sm-6').addClass('col-sm-12');
                $('#div_Data_arguments').hide();
                $('#div_artifact_graph').show();
                $('.div_DataSet').hide();
                $('.type_All').hide();
                $scope.getSelectedSuiteDataBySessionId(treeNode);
                if (treeNode.original.type == "DataSet") {
                    $('.ArtifactSettingsInfo').hide();
                  //  $scope.ArtifactSettingsInfo = true;
                    $('.type_suite_Gherkin_TC_FL').removeClass('col-sm-12').addClass('col-sm-6');
                    $('.div_DataSet').show();
                    if (treeNode.data.Input == "Click to view") {
                        //$scope.getresultStepInputArgOfItration(treeNode);
                    } else {
                        $("#div_IterationGrid").html('');
                        $('#runtimedrHeader').html("Run-Time Data Repository");
                        $('#div_IterationGrid').addClass('no_ResultData');
                    }
                    $('#Status_type_data').html('Steps / Step Group / Function Library(s)');
                }

                if (treeNode.original.type == "Datasheet") {
                    $('#Status_type_data').html('Iteration(s)');
                }

                if (treeNode.original.type == "Suite") {
                    $('.ArtifactSettingsInfo').hide();

                   // $scope.ArtifactSettingsInfo = true;
                    if (dataFactory.JobType === EnumJobType.AcceleratorPortal) {
                        $('#Status_type_data').html('Test Case(s)');
                    } else {
                        $('#Status_type_data').html('Gherkin(s) / Test Case(s)');
                    }
                }
                if (treeNode.original.type == "BP_Group") {
                   // $scope.ArtifactSettingsInfo = true;
                    $('.ArtifactSettingsInfo').hide();

                    $('#Status_type_data').html('Business Process');
                    // $('#Status_type_data').html('Iteration(s) / Local Data Repository');
                }
                if (treeNode.original.type == "Flow") {
                    $('.ArtifactSettingsInfo').hide();
                   // $scope.ArtifactSettingsInfo = true;
                    $('#Status_type_data').html('Iteration(s) / Local Data Repository');
                }
                if (treeNode.original.type == "Gherkin") {
                    $('.ArtifactSettingsInfo').hide();
                  //  $scope.ArtifactSettingsInfo = true;
                    $('#Status_type_data').html('Test Case(s)');
                }
                if (treeNode.original.type == "Sparkin") {
                    $('.ArtifactSettingsInfo').hide();
                  //  $scope.ArtifactSettingsInfo = true;
                    $('#Status_type_data').html('Test Case(s)');
                }
                if (treeNode.original.type == "Component") {
                    $('.ArtifactSettingsInfo').hide();
                   // $scope.ArtifactSettingsInfo = true;
                    $('#Status_type_data').html('Steps / Function Library(s)');
                }
                if (treeNode.original.type == "FlowStepGroupIteration") {
                    $('.ArtifactSettingsInfo').hide();
                   // $scope.ArtifactSettingsInfo = true;
                    $('#Status_type_data').html('Steps / Function Library(s)');
                }
                if (treeNode.original.type == "FlowStepGroup") {
                    $('.ArtifactSettingsInfo').hide();
                    //$scope.ArtifactSettingsInfo = true;
                    $('#Status_type_data').html('Step Group Iteration(s)');
                }
            } else {
                    $('.ArtifactSettingsInfo').show();
               // $scope.ArtifactSettingsInfo = false;
                $('.type_suite_Gherkin_TC_FL').removeClass('col-sm-12').addClass('col-sm-6');
                $('#div_Data_arguments').show();
                $('#div_artifact_graph').hide();
                $('.type_All').show();
                $('.div_DataSet').hide();
            }


            // used to set value
            $('#td_Name').html( DOMPurify.sanitize(treeNode.text));
            $('#td_Name').prop("title",treeNode.text);
           // $scope.Name = treeNode.text;
            $('#td_PluginName').html(treeNode.data.PluginName);
            
        //    $scope.PluginName = treeNode.data.PluginName;
            if (treeNode.data.PluginName == null) {
                $('#td_PluginName').closest('tr').hide();
            } else {
                $('#td_PluginName').closest('tr').show();
            }
            $('#td_TotalTime').html(treeNode.data.TotalTime);

          //  $scope.TotalTime = treeNode.data.TotalTime;
           // $scope.PercentageTime = treeNode.data.PercentageTime;

            if (treeNode.data.ContinueOnError == true) {
                $('#td_ContinueOnError').removeClass('fa-square-o');

                $('#td_ContinueOnError').addClass('fa-check-square-o');
              //  $scope.ContinueOnError = 'fa-check-square-o';
            } else {
                $('#td_ContinueOnError').removeClass('fa-check-square-o');

                $('#td_ContinueOnError').addClass('fa-square-o');

                //$scope.ContinueOnError = 'fa-square-o';
            }
            $('#div_Status').html(treeNode.data.Status);
            $('#div_Status').addClass(treeNode.data.Status);
           // $scope.Status = treeNode.data.Status;
            if (treeNode.data.IsNegative == false) {
                $('#td_IsNegative').removeClass('fa-check-square-o');

                $('#td_IsNegative').addClass('fa-square-o');

                //$scope.IsNegative = 'fa-square-o';
            } else {
                $('#td_IsNegative').removeClass('fa-square-o');

                $('#td_IsNegative').addClass('fa-check-square-o');

                //$scope.IsNegative = 'fa-check-square-o';
            }
          //  $scope.$apply();
            // using for get screenshot output and input data
            if (treeNode.original.type == "Suite" || treeNode.original.type == "Flow" || treeNode.original.type == "Gherkin" || treeNode.original.type == "" || treeNode.original.type == "DataSet") {
                return false;
            } else {
                dataFactory.selectedTreeNodeData = treeNode;
                getScreenShot(treeNode.id);
                $scope.getOutput(treeNode.id);
                getInput(treeNode.id, isEncrypted);
            }
        }
        function getScreenShot(resultId) {
            $("#img_preview").attr('src', '');
            var data, screenShotURL;
            screenShotURL = opkey_end_point + "/Result/getScreenShot"
            data = { Result_ID: resultId, SessionID: current_session.SessionId }
            loadingStart("#div_ScreenShot", "Please Wait ...", ".btnTestLoader");
            $.ajax({
                url: screenShotURL,//dataFactory.RESULT_SERVER_URL + "/Result/getScreenShot",
                type: "Post",
                crossDomain: true,
                data: data,//{ SessionInfoDTO: JSON.stringify(dataFactory.SelectedSessionDto), Result_ID: resultId },
                success: function (res) {
                    debugger;
                    if (res == "") {
                        $("#img_screenShot").attr('src', 'icons/no_CapturedScreen.png');
                        $("#img_screenShot").addClass('noSnapshot_available');
                        loadingStop("#div_ScreenShot", ".btnTestLoader");
                        return;
                    }
                    if (res.indexOf("http") == 0) {
                        $("#img_screenShot").attr('src', res);
                        $("#img_screenShot").removeClass('noSnapshot_available');
                        $("#img_screenShot").on('load', function () {
                            loadingStop("#div_ScreenShot", ".btnTestLoader");

                        });
                    } else {
                        $("#img_screenShot").attr('src', 'data:image/png;base64,' + res + '');
                        $("#img_screenShot").removeClass('noSnapshot_available');
                        $("#img_screenShot").on('load', function () {
                            loadingStop("#div_ScreenShot", ".btnTestLoader");
                        });
                        //   $("#img_screenShot").attr('src', 'data:image/png;base64,' + res + '');
                    }

                },
                error: function (error) {
                    loadingStop("#div_ScreenShot", ".btnTestLoader");
                    //  loadingStop($('#ScreenShot_popup').parent(), ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });
        }
        function getInput(result_id, isEncrypted) {
            var data, InpuURL;
            InpuURL = opkey_end_point+"/Result/getInput"
            data = { Result_ID: result_id, decryptData: isEncrypted, SessionID: current_session.SessionId }
            $.ajax({
                url: InpuURL,//dataFactory.RESULT_SERVER_URL + "/Result/getInput",
                type: "Post",
                data: data,
                crossDomain: true,      
                success: function (res) {
                    if (res == "") {
                        $('#div_result_inputdata').addClass('no_ResultData');
                    }
                    else {
                        $('#div_result_inputdata').removeClass('no_ResultData');

                    }
                    $('#div_result_inputdata').html(DOMPurify.sanitize(res));                
                },
                error: function (error) {
                    if (error.responseJSON != null) {
                        Message(error.responseJSON.message, "Error");
                    } else {
                        // GetErrorMessage(error.responseText)
                    }
                }
            });
        }
        $('#img_screenShot').unbind().click(function (e) {
            debugger;
            $('.fullSizeIMGHeader').attr('style', "");

            $('#newSourceProperty').html('');
            debugger;
            var newSource = e.currentTarget.getAttribute('src');//e.currentTarget.currentSrc;
            if (newSource.includes("no_CapturedScreen.png")) {
                return false;
            }
            // alert(newSource);
            $('.fullSizeImageBGColorClick,.fullSizeImageBGColor').show();
            $('#newSourceImg').show();
            $('#newSourceImg').attr('src', newSource);


            setTimeout(function () {
                var position = $(".fullSizeImage").position();
                var width = $('.fullSizeImage')[0].offsetWidth;
                $('.fullSizeIMGHeader').css('left', position.left);
                $('.fullSizeIMGHeader').css('top', position.top);
                $('.fullSizeIMGHeader').css('width', width);

            }, 100);
            $('#btCloseImage').click(function () {
                $('.fullSizeImageBGColorClick,.fullSizeImageBGColor').hide();
                $('.fullSizeIMGHeader').attr('style', '');
            });
        })
        $scope.getOutput = function (resultId) {
            debugger;
            var data, OutputURL;
            OutputURL = opkey_end_point+"/Result/getOutput"
            data = { Result_ID: resultId, SessionID: current_session.SessionId }
            $.ajax({
                url: OutputURL,//dataFactory.RESULT_SERVER_URL + "Result/getOutput",
                type: "Post",
                crossDomain: true,
                data: data,//{ SessionID: serviceFactory.GetTreeNodeIdForDB(dataFactory.SelectedSessionId), Result_ID: resultId },
                success: function (res) {
                    debugger;
                    if (res == "") {
                        $('#div_result_outputdata').addClass('no_ResultData');
                    }
                    else {
                        $('#div_result_outputdata').removeClass('no_ResultData');

                    }
                    $('#div_result_outputdata').html(DOMPurify.sanitize(res));
                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });
        };
        $scope.getSelectedSuiteDataBySessionId = function (sessionDto) {
            var sessionId = sessionDto.data.Session_ID;
            var Parentresult_ID = sessionDto.original.id;
            $.ajax({
                url: opkey_end_point +"/Result/getSelectedSuiteDataBySessionId",
                type: "Post",
                crossDomain: true,
                data: { sessionId: sessionId, Parentresult_ID: Parentresult_ID, isSkipped: false },
                success: function (res) {
                    debugger;
                    $('#spn_Pass').text(res[0].Pass);
                    $('#spn_Fail').text(res[0].Fail);
                    $('#spn_InComplete').text(res[0].InComplete);
                   // $('#spn_NotExecuted').val(res[0].InProgress);
                    $('#spn_NotExecuted').text(res[0].NotExecuted);
                    $('#spn_Total').text(res[0].Total);
                    $('#spn_SkippedOver').text(res[0].SkippedOver);

                    createExecutionTotalResultStepsChart(res);
                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });
        };

        function createExecutionTotalResultStepsChart(chartData) {
            debugger;
            var dynamicData = "";
            if (chartData[0].Pass == 0 && chartData[0].Fail == 0 && chartData[0].NotExecuted == 0 && chartData[0].SkippedOver == 0 && chartData[0].InComplete == 0) {
                dynamicData = [{
                    category: "Pass",
                    value: 0,
                    color: "#74ca12"
                }, {
                    category: "Fail",
                    value: 0,
                    color: "#da4439"
                }, {
                    category: "NotExecuted",
                    value: 1,
                    color: "#ccc"
                },
                {
                    category: "SkippedOver",
                    value: 0,
                    color: "#af968a"
                },
                {
                    category: "InComplete",
                    value: 0,
                    color: "#ffa500"
                }];
            }
            else {
                dynamicData = [{
                    category: "Pass",
                    value: chartData[0].Pass,
                    color: "#74ca12"
                }, {
                    category: "Fail",
                    value: chartData[0].Fail,
                    color: "#da4439"
                }, {
                    category: "NotExecuted",
                    value: chartData[0].NotExecuted,
                    color: "#ccc"
                },
                {
                    category: "SkippedOver",
                    value: chartData[0].SkippedOver,
                    color: "#af968a"
                },
                {
                    category: "InComplete",
                    value: chartData[0].InComplete,
                    color: "#ffa500"
                }];
            }

            $("#divChartPieExecution").kendoChart({
                title: {
                    text: "&nbsp;"
                },
                legend: {
                    visible: false,
                    position: "right",
                    labels: {
                        margin: 2,
                        template:
                            function (e) {
                                return e.text + " -  (" + e.dataItem.value + ")";
                            },
                    }
                },
                seriesDefaults: {
                    labels: {
                        template:
                            function (e) {
                                return e.category + " - " + kendo.format('{0:P}', e.percentage);
                            },
                        position: "outsideEnd",
                        visible: true,
                        background: "transparent",
                        align: "circle"
                    }
                },
                series: [{
                    type: "pie",
                    data: dynamicData
                }],
                tooltip: {
                    visible: true,
                    template: "#= category # - #= kendo.format('{0:P}', percentage) #"
                }
            });
        }
    }]);