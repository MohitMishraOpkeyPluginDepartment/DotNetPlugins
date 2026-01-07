
angular.module('myApp').controller("result_ctrl", ['$rootScope', '$scope', '$state', 'ServiceFactory', 'DataFactory', '$ocLazyLoad',
    function ($rootScope, $scope, $state, serviceFactory, dataFactory, $ocLazyLoad) {

        var opkey_end_point =  $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        $rootScope.ScopeManageResult = $scope;

        $scope.SplitterResultTreeOrientation = 'horizontal';

        $scope.Load_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_View", Load_View);
        };

        function Load_View() {
        }






    }]);




