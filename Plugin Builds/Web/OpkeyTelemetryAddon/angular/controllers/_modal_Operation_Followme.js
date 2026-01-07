angular.module('myApp').controller("modal_operation_followme_ctrl", [
    '$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory', '$kWindow',
    function($rootScope, $scope, serviceFactory, dataFactory, formControlFactory, $kWindow) {

        $scope.Load_View = function() {
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_View", Load_View);
        }

        function Load_View() {
           

        }
        $scope.OperationStopFollowMe=function(){
            $rootScope.ScopeFollowMe.Modal_Instance_OperationFollowMe.close(true);
            $rootScope.ScopeFollowMe.stopFollowMeOperation();
        }



    }
]);