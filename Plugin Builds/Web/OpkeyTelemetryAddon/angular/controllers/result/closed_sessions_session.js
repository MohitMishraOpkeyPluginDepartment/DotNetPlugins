



angular.module('myApp').controller("result_closed_session_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory) {

        var opkey_end_point =  $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        $scope.Load_Sub_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_Sub_View", Load_Sub_View);
        };

        function Load_Sub_View() {
            debugger;
            Get_Sessions_From_Batch(dataFactory.Closed_Session_BatchId);


        }




        //   --   Batch


        function Get_Sessions_From_Batch(batchId) {
            debugger;

            $.ajax({
                url: opkey_end_point + "/ExplorerTree/Get_Sessions_From_Batch",
                type: "Get",
                data: { batchId: batchId },
                success: function (result) {

                    create_html_batch_sessions(result)

                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }


            });

        }


        function create_html_batch_sessions(result) {
            debugger;

            var html = '';

            html = html + '';
            html = html + '';
            html = html + '';
            html = html + '';
            html = html + '';


            $.each(result, function (ind, obj) {


                html = html + '<div class="col-lg-12">';
                html = html + '<a></a>';
                html = html + '</div>';


            });





            return html;


        }


        // Sessions 


        function getSessionTags(sessionId) {
            debugger;

            $.ajax({




                url: opkey_end_point + "/Result/getSessionTags",
                type: "Post",
                data: { SessionId: sessionId },
                success: function (res) {
                    debugger;


                    $("sp_browser_name").val(fakingAngularCharacter(res[i].Key));
                    $("sp_browser_name").val(fakingAngularCharacter(res[i].Key));



                    var html = "";

                    html = html + '<div class="appScroll_xy" tabindex="0"><table width="100%" border="0" cellspacing="0" cellpadding="0" class="table BottomGridtableStyle table-bordered">';
                    html = html + '<tbody>';

                    for (var i = 0; i < res.length; i++) {
                        html = html + '<tr><th>' + fakingAngularCharacter(res[i].Key) + '</th>';
                        html = html + '<td>' + fakingAngularCharacter(res[i].Value) + '</td></tr>';
                    }

                    html = html + ' </tbody></table></div>';

                    $("#Div_Execution_Result_Info").html(DOMPurify.sanitize(html));

                }, error: function (error) {
                    serviceFactory.showError($scope, error);
                }





            });

        }





    }]);




