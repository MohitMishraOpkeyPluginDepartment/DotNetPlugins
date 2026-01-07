
angular.module('myApp').controller("recorder_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory) {

        $scope.Load_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_View", Load_View);
        };


        function Load_View() {

        }





    }]);




