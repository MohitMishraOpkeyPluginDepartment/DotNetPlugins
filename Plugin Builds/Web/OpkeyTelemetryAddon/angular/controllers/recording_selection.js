angular.module('myApp').controller("recording_selection_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory) {

        var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        $scope.Load_Sub_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_sub_View", Load_Sub_View);
        };
        function Load_Sub_View() {
            $("#div_footer_tutoriol").show();
            $(".navbar.navbar-default").show();
            $("#div_panelOptionsDetails").removeClass("col-sm-8");
            $("#div_panelOptionsDetails").addClass("col-sm-12");
            $(".homepage_body").addClass("d-flex");
            $("#div_panelOptions").hide();
            $("#Main_HomeBanner").hide();
            $("#Main_Home").removeClass('col-sm-9');
            $("#Main_Home").addClass('col-sm-12');
        }
    }]);