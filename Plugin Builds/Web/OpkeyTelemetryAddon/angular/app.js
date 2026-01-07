(function () {
    'use strict';
    var myApp = window.myApp = angular.module('myApp', ['ui.router', 'oc.lazyLoad', "kendo.window", "kendo.directives"]); //, "ngScrollbars"
    myApp.directive('staticInclude', ['$http', '$templateCache', '$compile', function ($http, $templateCache, $compile) {
        return function (scope, element, attrs) {
            var templatePath = attrs.staticInclude;
            $http.get(templatePath, { cache: $templateCache }).success(function (response) {
                var contents = element.html(response).contents();
                $compile(contents)(scope);
            });
        };
    }]);

    //https://stackoverflow.com/questions/16098430/angular-ie-caching-issue-for-http/19771501#19771501
    myApp.config(['$httpProvider', '$qProvider', function ($httpProvider, $qProvider) {
        debugger

        $qProvider.errorOnUnhandledRejections(false);

        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // Answer edited to include suggestions from comments
        // because previous version of code introduced browser-related errors

        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }]);
    myApp = angular.module('pCloudyCtrl', 'pCloudyCtrl');
    myApp = angular.module('MobileManagementCtrl', 'MobileManagementCtrl');
    myApp = angular.module('MobileRecorderCtrl', 'MobileRecorderCtrl');
    myApp = angular.module('CloudMobileRecorderWindowCtrl', 'CloudMobileRecorderWindowCtrl');

    myApp.directive('onlyDigits', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {
                function inputValue(val) {
                    if (val) {
                        var digits = val.replace(/[^0-9.]/g, '');

                        if (digits.split('.').length > 2) {
                            digits = digits.substring(0, digits.length - 1);
                        }

                        if (digits !== val) {
                            ctrl.$setViewValue(digits);
                            ctrl.$render();
                        }
                        return parseFloat(digits);
                    }
                    return undefined;
                }
                ctrl.$parsers.push(inputValue);
            }
        };
    });

    myApp.directive('elemReady', function ($parse) {
        return {
            restrict: 'A',
            link: function ($scope, elem, attrs) {
                elem.ready(function () {
                    $scope.$apply(function () {
                        var func = $parse(attrs.elemReady);
                        func($scope);
                    })
                })
            }
        }
    })
})();

