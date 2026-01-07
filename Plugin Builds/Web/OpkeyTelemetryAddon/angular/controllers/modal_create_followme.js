angular.module('myApp').controller("modal_create_followme_ctrl", [
    '$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory', '$kWindow',
    function($rootScope, $scope, serviceFactory, dataFactory, formControlFactory, $kWindow) {


        $scope.RecordTypeToCreate = "Web";

        var ModalData={};
        var recordTypes = [
            { recordName: "Web", recordType: "Web", icon: "singleSprite recorder_web" },
            { recordName: "Salesforce", recordType: "Salesforce", icon: "singleSprite recorder_salesforce" },
            { recordName: "Workday", recordType: "Workday", icon: "singleSprite recorder_workday" },
            { recordName: "Oracle Fusion", recordType: "OracleFusion", icon: "singleSprite recorder_oraclefusion" },
            { recordName: "PeopleSoft", recordType: "PeopleSoft", icon: "singleSprite recorder_peoplesoft" },
            { recordName: "Kronos", recordType: "Kronos", icon: "singleSprite recorder_kronos" },
            { recordName: "Veeva Vault", recordType: "VeevaVault", icon: "singleSprite recorder_veevavault" },
            { recordName: "MS Dynamics", recordType: "MicrosoftDynamics", icon: "singleSprite recorder_msdynamics" },
            { recordName: "MS Dynamics FSO", recordType: "MicrosoftDynamics_AX", icon: "singleSprite recorder_microsoftdynamics_ax" },
            { recordName: " SAP Fiori", recordType: "SAPSuccessFactors", icon: "singleSprite recorder_sapsuccessfactors" }
        ];

        $scope.Load_View = function() {
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_View", Load_View);
        }

        function Load_View() {
            initializeRecordTypeDropdown();

        }

        function initializeRecordTypeDropdown() {
            $("#SelectRecordTypeList").kendoDropDownList({
                dataTextField: "recordName",
                dataValueField: "recordType",
                template: '<div class=\"dropdown_panel\"><span class="k-state-default #:data.icon#"></span><span class=\"k-state-default\" style=\"padding-left: 5px;\">#: data.recordName #</span></div>',
                valueTemplate: '<div class=\"dropdown_panel\"><span class="selected-value #:data.icon#"></span><span>#:data.recordName#</span></div>',
                dataSource: recordTypes,
                select: function(e) {
                    debugger
                    var SelectedObject = this.dataItem(e.item.index());
                    //setRecorderMode(SelectedObject.recordType);
                    $scope.RecordTypeToCreate = SelectedObject.recordType;
                }

            }).data("kendoDropDownList");
        }

        $scope.DestroyModalInstanceFollowME = function() {
            $rootScope.ScopeFollowMe.Modal_Instance_CreateFollowMe.close(true);
        }

        $scope.StartFollowMeInModal = function() {
            debugger;
            if ($('#txtURL').val() == empty) {
                serviceFactory.notifier($scope, 'Please provide url', 'error');
                return false;
            }
            ModalData={};
            ModalData['App_Url']=$('#txtURL').val();
            ModalData['Plugin_name']=$scope.RecordTypeToCreate;
            dataFactory.FollowMeModalData=ModalData;

            $rootScope.ScopeFollowMe.Modal_Instance_CreateFollowMe.close(true);

            setTimeout(function() {
                $rootScope.ScopeFollowMe.CreatefollowMeOperation();
            }, 500);
        }

    }
]);