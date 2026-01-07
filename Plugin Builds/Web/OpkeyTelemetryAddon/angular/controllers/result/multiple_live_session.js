



angular.module('myApp').controller("result_multiple_live_session_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory) {

        var opkey_end_point =  $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        $scope.Load_Sub_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_Sub_View", Load_Sub_View);
        };

        function Load_Sub_View() {
            debugger;
            create_html_windows();
        }

        function create_html_windows() {
            debugger;

            if (isEmptyObject(dataFactory.Pin_Live_Executions)) {

                $("#div_multiple_live_sessions").addClass('GST_noDataOnGrid').attr('data-msg', 'No live sessions available !');
                return false;
            }
            var html = '';
            $.each(dataFactory.Pin_Live_Executions, function (ind, obj) {

                html = html + '<div class="col-lg-4">';
                html = html + '<iframe id="iframe_live_' + ind + '" src=""  width="100%"  height="200px" style="border:1px solid #ddd;"></iframe>';
                html = html + '</div>';

            });

            $("#div_multiple_live_sessions").html(html)

        }



    }]);




