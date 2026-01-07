
angular.module('myApp').controller("Options2Ctrl", ['$rootScope', '$scope', '$state', 'ServiceFactory', 'DataFactory', '$ocLazyLoad',
    function ($rootScope, $scope, $state, serviceFactory, dataFactory, $ocLazyLoad) {

        $scope.Load_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_View", Load_View);
        };


        function Load_View() {

        }

    



    }]);




