(function (exports) {
    "use strict";

    function recordResponsiveTestPage() { };

    exports.recordResponsiveTestPage = recordResponsiveTestPage;


    recordResponsiveTestPage.recordResponsiveTestInitializer = function (saas_object) {

        return new recordResponsiveTestPage.Initializer(saas_object);
    }
  

    recordResponsiveTestPage.Initializer = function (saas_object) {

        if (!(this instanceof recordResponsiveTestPage.Initializer)) {
            console.war("recordResponsiveTestPage constructor is not used!");
            return new recordResponsiveTestPage.Initializer();
        }
        console.log(saas_object)





    }

})(this);