(function (exports) {
    "use strict";

    function mainRecorderAddOnPage() { };

    exports.mainRecorderAddOnPage = mainRecorderAddOnPage;


    mainRecorderAddOnPage.mainRecorderInitializer = function (saas_object) {

        return new mainRecorderAddOnPage.Initializer(saas_object);
    }


    mainRecorderAddOnPage.Initializer = function (saas_object) {

        if (!(this instanceof mainRecorderAddOnPage.Initializer)) {
            console.war("mainRecorderAppOnPage constructor is not used!");
            return new mainRecorderAddOnPage.Initializer();
        }
        console.log(saas_object)
        




    }

})(this);