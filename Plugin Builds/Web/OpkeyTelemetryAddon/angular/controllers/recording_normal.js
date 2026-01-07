
angular.module('myApp').controller("normal_recording_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory) {

        var DEFAULT_OPKEY_LOCATION_ID = "47d772f3-e08f-4874-9585-a2bdb34eee04";

        $scope.FileTypeToCreate = "Flow";
        var fileTypes = [{ ArtifactName: "Test Case", ArtifactType: "Flow", icon: "sprite2 Flow" }, { ArtifactName: "Function Library", ArtifactType: "Component", icon: "sprite2 Component" }];

        $scope.RecordTypeToCreate = "Web";
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

        $scope.Load_Sub_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_sub_View", Load_Sub_View);
        };

        function Load_Sub_View() {
            debugger;

            console.log('rootScope.Scope_Main.AddonOperationType', $rootScope.Scope_Main.AddonOperationType);
            $("#div_panelOptions").show();
            if ($rootScope.Scope_Main.AddonOperationType == EnumAddonOperationType.CreateOpkeyTest) {
                $('#divPanel_Options').hide();
                $('#divPanel_Options_CreateOpkeyTest').show();
                  if ($rootScope.Scope_Main.viewName === "options.recording_normal") {
                    $scope.Select_Option_Tab("Normal_Recording");
                    // $("#divSelectResoposve").show();
                } else if ($rootScope.Scope_Main.viewName === "options.recording_responsive") {
                    $scope.Select_Option_Tab("Resposive_Recording");
                      $("#divSelectResoposve").show();
                } else {
                    $scope.Select_Option_Tab("Normal_Recording");
                }
                //end 

                $("#divPanel_New_Artifact").show();
                $("#divPanel_Options").removeClass("disabled");
                PopulateUniqueName(DEFAULT_OPKEY_LOCATION_ID);
                $("#btBack").hide();
                $("#btNext").hide();
                $("#btStartRecording").show();
                InitializeJsTree("divTree_Test_Case", "txtSearch_TestCase");
                InitializeJsTree("divTree_OR", "txtSearch_ObjectRepository");
                initializeFileTypeDropdown();
                initializeRecordTypeDropdown();

                $('#div_footer_recording_Normal').show();

            }
            else {
                $('#divPanel_Options_CreateOpkeyTest').hide();
                $('#divPanel_Options').show();
                

                $scope.ChangePageView('options.execution_selection');
                $scope.Select_Option_Tab("RunBrowser");

            }

            //Opetions selection modifications
            $("#div_panelOptionsDetails").removeClass("col-sm-12");
            $("#div_panelOptionsDetails").addClass("col-sm-8");
            $("#Main_HomeBanner").show();
            $("#div_footer_tutoriol").show();
            $("#Main_Home").removeClass('col-sm-12');
            $("#Main_Home").addClass('col-sm-9');
            $("#div_panelOptions").show();
            //$scope.GetAll_TestCase();
        }
        function initializeFileTypeDropdown() {
            $("#SelectFileTypeList").kendoDropDownList({
                dataTextField: "ArtifactName",
                dataValueField: "ArtifactType",
                template: '<div class=\"dropdown_panel\"><span class="k-state-default #:data.icon#"></span>&nbsp&nbsp<span class=\"k-state-default\" style=\"padding: 3px;\">#: data.ArtifactName #</span></div>',
                valueTemplate: '<div class=\"dropdown_panel\"><span class="selected-value #:data.icon#"></span><span>#:data.ArtifactName#</span></div>',
                dataSource: fileTypes,
                select: function (e) {
                    var SelectedObject = this.dataItem(e.item.index());
                    $scope.FileTypeToCreate = SelectedObject.ArtifactType;
                }

            }).data("kendoDropDownList");
        }
        $scope.onFileTypeChange = function (event) {
            //  debugger;
            // alert($scope.FileType);
        }

        function initializeRecordTypeDropdown() {
            setRecorderMode("Web");
            $("#SelectRecordTypeList").kendoDropDownList({
                dataTextField: "recordName",
                dataValueField: "recordType",
                template: '<div class=\"dropdown_panel\"><span class="k-state-default #:data.icon#"></span><span class=\"k-state-default\" style=\"padding-left: 5px;\">#: data.recordName #</span></div>',
                valueTemplate: '<div class=\"dropdown_panel\"><span class="selected-value #:data.icon#"></span><span>#:data.recordName#</span></div>',
                dataSource: recordTypes,
                select: function (e) {
                    debugger
                    var SelectedObject = this.dataItem(e.item.index());
                    setRecorderMode(SelectedObject.recordType);
                    $scope.RecordTypeToCreate = SelectedObject.recordType;
                }

            }).data("kendoDropDownList");
        }

        function setRecorderMode(recorderMode) {
            recorderMode = recorderMode + "Recorder";
            if (recorderMode == "MicrosoftDynamics_AXRecorder") {
                recorderMode = "MicrosoftDynamicsAXRecorder";
            }
            localStorage.setItem("RECORDING_MODE", recorderMode);
        }
        $("#NewRecordResponsiveList").change(function (event) {
            if ($(this).val() == "Responsive") {
                $('#divCustomResolution').show();
            }
            else {
                $('#divCustomResolution').hide();
            }
        });
        $("#anSwitch_Existing_Artifact").on('click', function () {
            debugger;
            $(this).text($(this).text() == 'Existing TC/FL' ? 'New TC/FL' : 'Existing TC/FL');

            $("#anChooseOr").removeClass("active");
            $(this).addClass("active");

            var btnText = $(this).text();

            $(".panel_artifact").removeClass("active");
            $(".panel_artifact").hide();
            $(".recording_actions").hide();

            if (btnText === "New TC/FL") {
                $("#divPanel_New_Artifact").addClass("active");
                //  $(".panel_artifact.active").attr("id", "divPanel_Existing_Artifact");
            }
            else {
                $('#divPanel_Existing_Artifact').addClass("active");
                // $(".panel_artifact.active").attr("id", "divPanel_New_Artifact");

            }

            var panelId = $(".panel_artifact.active").attr("id");
            var optionId = $(".record_selection_item.active").attr("id");

            if (panelId === "divPanel_New_Artifact") {
                if (optionId === "divTab_Resposive_Recording") {
                    $("#divSelectResoposve_existing").show();
                    $("#divTree_Wrapper_Test_Case, #divTree_Wrapper_OR").addClass("jsTree_dynamicHeight");
                }
                $('#divPanel_Existing_Artifact').show();
                //  $(".panel_artifact.active").attr("id", "divPanel_Existing_Artifact");

                $('#btNext').show();
                $('.panel_artifact_type').hide();
                $('.panel_artifact_type').removeClass("active");
                $('#divTree_Wrapper_Test_Case').addClass("active");
                $('#divTree_Wrapper_Test_Case').show();
                $scope.GetAll_TestCase();

            } else {

                $('#divPanel_New_Artifact').show();
                $('#divPanel_New_Artifact').addClass("active");
                $("#NewOrRecordName").select();
                $('#btStartRecording').show();
                $("#btStartRecording").removeClass("disabled");

            }

        });

        $("#anChooseOr").on('click', function () {
            debugger;
            //var panelId = $(".panel_artifact.active").attr("id");

            //if (panelId != "divPanel_New_Artifact") {
            //    var TestCaseSelectedNode = serviceFactory.getSelectedNode("divTree_Test_Case");
            //    if (TestCaseSelectedNode.type == "Folder") {
            //        serviceFactory.notifier($scope, "Please select a test case", "error");
            //        return false;
            //    }
            //} 
            $("#anSwitch_Existing_Artifact").removeClass("active");
            $(this).addClass("active");

            $(".panel_artifact").removeClass("active");
            $(".panel_artifact").hide();
            $(".recording_actions").hide();
            $("#divPanel_Existing_Artifact").addClass("active");

            var optionId = $(".record_selection_item.active").attr("id");

            if (optionId === "divTab_Resposive_Recording") {
                $("#divSelectResoposve_existing").show();
                $("#divTree_Wrapper_Test_Case, #divTree_Wrapper_OR").addClass("jsTree_dynamicHeight");
            }
            $('#divPanel_Existing_Artifact').show();
            $("#btStartRecording").show();
            $("#btStartRecording").addClass("disabled");
            $('.panel_artifact_type').hide();
            $('.panel_artifact_type').removeClass("active");
            $('#divTree_Wrapper_OR').addClass("active");
            $('#divTree_Wrapper_OR').show();
            $scope.GetAll_ObjectRepository();

        });

        // Common

        $scope.Artifact_Selection = function (type) {
            debugger;

            node_copy = null;
            node_copy_type = null;

            if (type === "Next") {

                var selectedNode = serviceFactory.getSelectedNode("divTree_Test_Case");
                if (selectedNode === null || selectedNode.type == "Folder") {
                    //alert("Please select a test case");
                    serviceFactory.notifier($scope, "Please select a test case", "error");
                    return false;
                }

                $(".panel_artifact_type").hide();
                $(".recording_actions").hide();

                $('#btBack').show();
                $('#btStartRecording').show();
                $("#btStartRecording").addClass("disabled");
                $('#divTree_Wrapper_OR').show();
                $('.panel_artifact_type').removeClass("active");
                $('#divTree_Wrapper_OR').addClass("active");
                $scope.AcquireLock(selectedNode.type, selectedNode.id);

            } else if (type === "Back") {

                $(".panel_artifact_type").hide();
                $(".recording_actions").hide();

                $('#btNext').show();

                $('#divTree_Wrapper_Test_Case').show();
                $('.panel_artifact_type').removeClass("active");
                $('#divTree_Wrapper_Test_Case').addClass("active");
            }

        }

        $scope.AcquireLock = function (module_type, db_id) {
            debugger;
            var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

            $.ajax({
                url: opkey_end_point + "/Base/AcquireLock?moduleType=" + module_type + "&DB_ID=" + db_id,
                type: "Get",
                success: function (returned_data) {
                    if (module_type == "Flow") {
                        $scope.GetAll_ObjectRepository();
                    } else if (module_type == "Component") {
                        $scope.GetAll_ObjectRepository();
                    } else if (module_type == "ObjectRepository") {
                        //$scope.ChangePageView("recorder");
                        //alert("ChangePageView;");
                        $scope.openRecorderWindow();
                    }
                },
                error: function (returned_error_data) {
                    var response_text = returned_error_data.responseText;
                    var response_text_object = JSON.parse(response_text);
                    saas_object.ShowToastMessage("error",
                        response_text_object.message);
                }
            });
        };


        $scope.ReleaseLock = function (db_id) {

            debugger;
            var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

            $.ajax({
                url: opkey_end_point + "/Base/ReleaseLock?DB_ID=" + db_id,
                type: "Get",
                success: function (returned_data) {

                },
                error: function (returned_error_data) {
                    var response_text = returned_error_data.responseText;
                    var response_text_object = JSON.parse(response_text);
                    saas_object.ShowToastMessage("error",
                        response_text_object.message);
                }
            });


        };

        function PopulateUniqueName(parent_id) {
            $.ajax({
                url: $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME")
                    + "/ExplorerTree/getNewNodeName?parentID=" + parent_id,
                type: "POST",
                success: function (returned_node_name) {

                    $("#NewOrRecordName").val(returned_node_name);
                    $("#NewOrRecordName").attr("default_value", returned_node_name);
                    $("#NewOrRecordName").select();
                }
            });
        };

        $scope.ResetArtificateTextField = function () {
            var default_value = $("#NewOrRecordName").attr("default_value");
            if (default_value != null) {
                $("#NewOrRecordName").val(default_value);
                $("#NewOrRecordName").select();
            }
        };

        function get_current_tree_id() {

            var panelId = $(".panel_artifact_type.active").attr("id");

            if (panelId == "divTree_Wrapper_Test_Case") {
                return "divTree_Test_Case";
            } else {
                return "divTree_OR";
            }

        }

        $scope.StartRecording = function () {
            debugger;

            var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");
            $.ajax({
                url: opkey_end_point + "/Application/HeartBeat",
                type: "GET",
                success: function (result, status, response) {
                    var flag = $scope.Redirecting_ON_Session_Expire(response);
                    if (!flag) {
                        return false;
                    }

                    $scope.SetAppPath();
                    var panelId = $(".panel_artifact.active").attr("id");
                    var selectedResolution = $("#NewRecordResponsiveList option:selected").val();
                    var selectedDeviceName = $("#NewRecordResponsiveList option:selected").text();
                    if (selectedResolution == "Responsive") {
                        var width = $('#CustomRecordResponsive_width').val().trim();
                        var height = $('#CustomRecordResponsive_height').val().trim();
                        if (width == empty || height == empty) {
                            serviceFactory.notifier($scope, "Custom Resolution cannot be blank", "error");
                            return false;
                        }
                        else if ((isNaN(width) || isNaN(height)) || $('.customresolution:invalid').length > 0) {
                            serviceFactory.notifier($scope, "Please provide valid resolution !", "warning");
                            return false;
                        }
                    }
                    if (panelId == "divPanel_New_Artifact") {


                        var artifact_name = $("#NewOrRecordName").val().trim();

                        if (artifact_name === "") {
                            alert("Artifact name cannot be blank.");
                            $scope.ResetArtificateTextField();
                            return false;
                        }

                        $scope.Get_Default_Parent_Node();


                    } else {

                        var panelId = $(".panel_artifact_type.active").attr("id");

                        if (panelId == "divTree_Wrapper_Test_Case") {

                            alert("it should not have come here")

                        } else {

                            var current_tree_id = get_current_tree_id();

                            var selectedNode = serviceFactory.getSelectedNode(current_tree_id);
                            if (selectedNode === null) {
                                alert("Please select a object repository");
                                return false;
                            }

                            $scope.AcquireLock(selectedNode.type, selectedNode.id)



                        }

                    }
                    if (selectedResolution != empty) {
                        localStorage.setItem("OPKEY_RECORDER_TYPE", "RESPONSIVE_RECORDER");
                        if (selectedResolution == "Responsive") {
                            var customResolution = $('#CustomRecordResponsive_width').val() + ":" + $('#CustomRecordResponsive_height').val();
                            localStorage.setItem("OPKEY_RECORDER_BROWSER_RESOLUTION", customResolution);
                        }
                        else {
                            localStorage.setItem("OPKEY_RECORDER_BROWSER_RESOLUTION", selectedResolution);
                            localStorage.setItem("OPKEY_RECORDER_BROWSER_RESOLUTION_DEVICE_NAME", selectedDeviceName);
                        }
                    }
                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });
        }

        $scope.SetAppPath = function () {
            var appUrl = $("#ApplicationURL").val();
            if (appUrl == null) {
                return;
            }
            localStorage.setItem("APPLICATION_URL", appUrl);
        }
        // New Recording

        $scope.Get_Default_Parent_Node = function () {
            debugger;
            var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");
            loadingStart('#divPanel_New_Artifact', "Please Wait ...", ".btn");          //SAS-7919
            $.ajax({
                url: opkey_end_point + "/ExplorerTree/CreateDefaultParentNodeOnDashboard",
                type: "POST",
                success: function (result) {
                    debugger;
                    var parent_id = result.id;
                    //saas_object.AddDefaultArticiateInTree(parent_id);
                    $scope.Create_Component(parent_id);

                },
                error: function (error) {
                    loadingStop("#divPanel_New_Artifact", ".btn");
                    serviceFactory.showError($scope, error);
                    saas_object.UnBlockUI();
                }
            });
        };

        $scope.Create_Component = function (parent_id) {
            debugger;
            var artifact_type = $scope.FileTypeToCreate;

            var artifact_name = $("#NewOrRecordName").val();

            var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

            $.ajax({
                url: opkey_end_point + "/ExplorerTree/AddFileFolderForDialer",
                type: "POST",
                datatype: "jsonp",
                data: {
                    moduleType: artifact_type,
                    name: artifact_name,
                    description: dataFactory.Empty,
                    parentID: parent_id
                },
                success: function (result) {
                    debugger;

                    // serviceFactory.SetGlobalSetting("RECORDER_FLOW_DB_ID", result.id);


                    $.ajax({
                        url: opkey_end_point + "/Base/AcquireLock?moduleType=" + result.type + "&DB_ID=" + result.id,
                        type: "Get",
                        success: function (result_AcquireLock) {
                            debugger;
                            serviceFactory.SetGlobalSetting("RECORDER_FLOW_DB_ID", result.id);
                            $scope.Create_Object_Repository("OR_" + result.text, parent_id);

                        },
                        error: function (error) {
                            loadingStop("#divPanel_New_Artifact", ".btn");
                            serviceFactory.showError($scope, error);
                        }

                    });




                },
                error: function (error) {
                    loadingStop("#divPanel_New_Artifact", ".btn");
                    serviceFactory.showError($scope, error);
                }



            });




        };

        $scope.Create_Object_Repository = function (Or_Name, parent_id) {
            debugger
            var node_module_type = "ObjectRepository";

            var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

            //$.ajax({
            //    url: opkey_end_point + "/ExplorerTree/getNewNodeName?parentID=" + parent_id,
            //    type: "POST",
            //    success: function (result) {
            //        debugger;

            $.ajax({
                url: opkey_end_point + "/ExplorerTree/AddFileFolderForDialer_With_Timestamp",
                type: "POST",
                datatype: "jsonp",
                data: {
                    moduleType: node_module_type,
                    name: Or_Name,
                    description: dataFactory.Empty,
                    parentID: parent_id,
                    add_timestamp: true
                },
                success: function (result_node) {
                    debugger;
                    serviceFactory.SetGlobalSetting("RECORDER_OR_DB_ID", result_node.id);
                    $.ajax({
                        url: opkey_end_point + "/Base/AcquireLock?moduleType=" + node_module_type + "&DB_ID=" + result_node.id,
                        type: "Get",
                        success: function (result) {
                            debugger;
                            loadingStop("#divPanel_New_Artifact", ".btn");
                            $scope.openRecorderWindow();
                        },
                        error: function (error) {
                            loadingStop("#divPanel_New_Artifact", ".btn");
                            serviceFactory.showError($scope, error);

                        }
                    });

                },
                error: function (error) {
                    loadingStop("#divPanel_New_Artifact", ".btn");
                    serviceFactory.showError($scope, error);
                }
            });
            //    }
            //});
        };

        // Existing TC FL

        $scope.GetAll_TestCase = function () {
            debugger;

            loadingStart("#divTree_Test_Case", "Please Wait ...", ".btnTestLoader");
            var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

            $.ajax({
                url: opkey_end_point + "/ExplorerTree/GetFlowComponentJSTreeNodes?moduleType=Flow&isDTORequired=false",
                type: "Get",
                success: function (result) {
                    debugger;
                    loadingStop("#divTree_Test_Case", ".btnTestLoader");
                    result[0].text = "Test Case and Function Library";

                    var tree = serviceFactory.getTreeInstance("divTree_Test_Case");

                    if (tree != false) {

                        tree.settings.core.data = result;
                        tree.refresh();

                        setTimeout(function () {
                            serviceFactory.ExpandTree("divTree_Test_Case", dataFactory.EmptyGuid);
                            $scope.select_NodeTree();
                        }, 100);

                        var targetScroll = document.getElementById(dataFactory.EmptyGuid);

                        if (targetScroll != null) {
                            $("#divTree_Test_Case").scrollTop(targetScroll.offsetTop - 110);
                        }

                    }



                },
                error: function () {
                    loadingStop("#divTree_Test_Case", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });
        };

        $scope.GetAll_ObjectRepository = function () {
            debugger;
            loadingStart("#divTree_OR", "Please Wait ...", ".btnTestLoader");
            var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

            $.ajax({
                url: opkey_end_point + "/ExplorerTree/GetJSTreeNodes?moduleType=ObjectRepository&isDTORequired=true",
                type: "Get",
                success: function (result) {
                    debugger;
                    loadingStop("#divTree_OR", ".btnTestLoader");
                    var tree = serviceFactory.getTreeInstance("divTree_OR");

                    if (tree != false) {

                        tree.settings.core.data = result;
                        tree.refresh();
                        setTimeout(function () {
                            serviceFactory.ExpandTree("divTree_OR", dataFactory.EmptyGuid);
                            $scope.select_NodeTree();
                        }, 100);


                        var targetScroll = document.getElementById(dataFactory.EmptyGuid);

                        if (targetScroll != null) {
                            $("#divTree_OR").scrollTop(targetScroll.offsetTop - 110);
                        }

                    }

                },
                error: function () {
                    loadingStop("#divTree_OR", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });
        };

        // --------------Select Tree Node-----------------
        $scope.select_NodeTree = function () {
            debugger;
            var current_tree_id = get_current_tree_id();
            var panelId = $(".panel_artifact_type.active").attr("id");

            var selectedNode = serviceFactory.getSelectedNode(current_tree_id);
            if (selectedNode.id === "00000000-0000-0000-0000-000000000000") {
                $("#" + panelId + " #btArtifact_Delete").prop("disabled", true);
                $("#" + panelId + " #btArtifact_Rename").prop("disabled", true);
            }

            $("#" + current_tree_id).on('select_node.jstree', function (e, data) {
                debugger;
                var tree_node = data.node;
                var isRestricted = tree_node.original.IsRestricted;
                var node_type = tree_node["type"];
                var node_id = tree_node["id"];
                //console.log(node_type);
                //console.log(node_id);
                if (node_id == "00000000-0000-0000-0000-000000000000") {
                    $("#" + panelId + " #btArtifact_Delete").prop("disabled", true);
                    $("#" + panelId + " #btArtifact_Rename").prop("disabled", true);
                } else {
                    $("#" + panelId + " #btArtifact_Delete").prop("disabled", false);
                    $("#" + panelId + " #btArtifact_Rename").prop("disabled", false);
                }

                if (node_type == "Folder") {
                    $("#" + panelId + " #btArtifact_Create").prop("disabled", false);
                    $("#" + panelId + " #btArtifact_Create_OR").prop("disabled", false);
                    $("#" + panelId + " #btArtifact_Create_Folder").prop("disabled", false);
                    $("#btStartRecording").addClass("disabled");
                } else if ((node_type == "Flow") || (node_type == "Component")) {
                    serviceFactory.SetGlobalSetting("RECORDER_FLOW_DB_ID", node_id);

                    $("#" + panelId + " #btArtifact_Create").prop("disabled", true);
                    $("#" + panelId + " #btArtifact_Create_OR").prop("disabled", true);
                    $("#" + panelId + " #btArtifact_Create_Folder").prop("disabled", true);
                } else if (node_type == "ObjectRepository") {
                    serviceFactory.SetGlobalSetting("RECORDER_OR_DB_ID", node_id);

                    $("#" + panelId + " #btArtifact_Create").prop("disabled", true);
                    $("#" + panelId + " #btArtifact_Create_OR").prop("disabled", true);
                    $("#" + panelId + " #btArtifact_Create_Folder").prop("disabled", true);
                    $("#btStartRecording").removeClass("disabled");
                }

                if (isRestricted) {
                    $("#" + panelId + " #btArtifact_Delete").prop("disabled", true);
                    $("#" + panelId + " #btArtifact_Rename").prop("disabled", true);
                    $("#" + panelId + " #btArtifact_Create").prop("disabled", true);
                    $("#" + panelId + " #btArtifact_Create_Folder").prop("disabled", true);
                    $("#" + panelId + " #btArtifact_Create_OR").prop("disabled", true);
                }
            })
        }

        // -- Tree actions

        var items = {};

        var node_copy = null;

        var node_copy_type = null;

        var CopyCutNode_id = "";

        function InitializeJsTree(treeId, txtSearchTree) {
            debugger;
            $('#' + treeId).jstree(
                {
                    'core': {
                        "check_callback": true,
                        "animation": false,
                        "force_text": true,
                        "error": function (err) {
                            if (err.id === 'unique_01') {

                                $('#search').val('');
                                $('#' + treeId).jstree(true).search('');
                                saas_object.ShowToastMessage("error",
                                    "Name must be unique");
                            }
                        },
                        'cache': false,
                        "themes": {
                            "name": "default-dark",
                            "dots": true,
                            "icons": false
                        },
                        'multiple': false,
                    },

                    "types": {
                        "Folder": {
                            "icon": "sprite2 folder"
                        },
                        "ObjectRepository": {
                            "icon": "sprite2 ObjectRepository",
                            "max_children": 0
                        },
                        "Component": {
                            "icon": "sprite2 Component",
                            "max_children": 0
                        },
                        "Flow": {
                            "icon": "sprite2 Flow",
                            "max_children": 0
                        },
                    },

                    "plugins": ["contextmenu", "types", "changed",
                        "unique", "search", "themes", "state"],

                    search: {
                        case_insensitive: true,
                        show_only_matches: true
                    },
                    "contextmenu": {
                        items: customMenu
                    }
                });

            $('#' + treeId).on('refresh.jstree', function (e, data) {
            });
            $('#' + treeId).on('hover_node.jstree', function (e, data) {
                var $node = $("#" + data.node.id);
                var node_text = data.node.text;
                $("#" + data.node.id).prop('title', node_text);
            });
            $("#" + treeId).on("keydown", ".jstree-rename-input", function (e) {
                if (e.key == '\\') {
                    e.preventDefault();
                }
            });

            $('#' + treeId).on('rename_node.jstree', function (e, data) {
                debugger;
                var divTree = get_current_tree_id();
                //if (data.node.parent == "#") {
                //    serviceFactory.notifier($scope, "Parent node can not be modified !!!", "Error");
                //    $scope.GetAll_TestCase();
                //    return false;
                //}

                var treeInstance = serviceFactory.getTreeInstance(divTree);
                var node = data.node;
                var id = node.id;
                if (data.text.length <= 255) {

                    var nodeText = node.text.trim();

                    if (nodeText == "") {

                        node.text = data.old;
                        treeInstance.edit(id);
                        return false;
                    }
                    else {


                        var ajaxUrl = null;
                        var ajaxData = null;
                        var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

                        ajaxUrl = opkey_end_point + "/ExplorerTree/RenameTreeItem";
                        ajaxData = { moduleType: node.type, nodeID: node.id, newName: nodeText };

                        $.ajax({
                            url: ajaxUrl,
                            data: ajaxData,
                            type: "Post",
                            success: function (result) {
                                debugger;
                                loadingStop("#divPanel_Tree", ".btnTestLoader");
                                node.original.text = result.name;
                                serviceFactory.selectTreeNode(divTree, node.original.id);
                                //play_tree_toolbar();
                            },
                            error: function (error) {
                                loadingStop("#divPanel_Tree", ".btnTestLoader");
                                serviceFactory.SetTreeNodeText(divTree, node, data.old);
                                serviceFactory.selectTreeNode(divTree, node.original.id);
                                treeInstance.edit(id);
                                serviceFactory.showError($scope, error);
                            }
                        });
                    }
                }
                else {

                    data.node.text = data.old;
                    treeInstance.edit(id);
                    serviceFactory.notifier($scope, 'Name cannot exceed 255 characters.', "Error");
                    return false;

                }

            });

            // On Enter Key Search 
            $('#' + txtSearchTree).bind('keyup', function (e) {
                debugger;
                var searchValue = $('#' + txtSearchTree).val();
                $('#' + treeId).jstree(true).search(searchValue);
            });

        }

        $scope.Tree_Clear = function (call) {
            debugger;

            if (call === "Test Case") {
                $("#txtSearch_TestCase").val('');
                $('#divTree_Test_Case').jstree(true).search('');
            }
            else {
                $("#txtSearch_ObjectRepository").val('');
                $('#divTree_OR').jstree(true).search('');
            }

        }

        function customMenu(node) {
            debugger;

            var divTree = get_current_tree_id();

            if (divTree == "divTree_Test_Case") {

                if (node.type == "Folder") {

                    if (node.id == dataFactory.EmptyGuid) {

                        items = {

                            AddFolder: {
                                label: "Create Folder",
                                icon: "sprite2 folder",
                                action: function (obj) {
                                    $scope.Tree_Folder_File("Folder");
                                }
                            },
                            AddFile: {
                                label: "Create New",
                                icon: "sprite2 addFile",
                                submenu: {
                                    TestCase: {
                                        label: "Test Case",
                                        icon: "sprite2 Flow",
                                        action: function (obj) {
                                            $scope.Tree_Folder_File("Flow");
                                        }
                                    },
                                    FunctionLibarary: {
                                        label: "Function Library",
                                        icon: "sprite2 Component",
                                        action: function (obj) {
                                            $scope.Tree_Folder_File("Component");
                                        }
                                    }
                                }
                            }
                        }

                    } else {

                        items = {
                            AddFolder: {
                                label: "Create Folder",
                                icon: "sprite2 folder",
                                action: function (obj) {
                                    $scope.Tree_Folder_File("Folder");
                                }
                            },
                            AddFile: {
                                label: "Create New",
                                icon: "sprite2 addFile",
                                submenu: {
                                    TestCase: {
                                        label: "Test Case",
                                        icon: "sprite2 Flow",
                                        action: function (obj) {
                                            $scope.Tree_Folder_File("Flow");
                                        }
                                    },
                                    FunctionLibarary: {
                                        label: "Function Library",
                                        icon: "sprite2 Component",
                                        action: function (obj) {
                                            $scope.Tree_Folder_File("Component");
                                        }
                                    }
                                }
                            },
                            Rename: {
                                label: "Rename",
                                icon: "sprite2 edit-rename",
                                action: function (obj) {
                                    $scope.Tree_Rename();
                                }
                            },
                            Delete: {
                                label: "Delete",
                                icon: "sprite2 DeleteIcon",
                                action: function (obj) {
                                    $scope.Tree_Delete();
                                }
                            },
                            cut: {
                                label: "Cut",
                                icon: "sprite2 cut",
                                action: function (obj) {
                                    $scope.Tree_Copy_Cut("Cut");
                                }
                            },
                            copy: {
                                label: "Copy",
                                icon: "sprite2 copy",
                                action: function (obj) {
                                    $scope.Tree_Copy_Cut("Copy");
                                }
                            },
                            paste: {
                                label: "Paste",
                                icon: "sprite2 paste",

                                action: function (obj) {
                                    $scope.Tree_Paste();
                                }
                            },

                        };

                    }
                } else {

                    items = {

                        Rename: {
                            label: "Rename",
                            icon: "sprite2 edit-rename",
                            action: function (obj) {
                                $scope.Tree_Rename();
                            }
                        },
                        Delete: {
                            label: "Delete",
                            icon: "sprite2 DeleteIcon",
                            action: function (obj) {
                                $scope.Tree_Delete();
                            }
                        },
                        cut: {
                            label: "Cut",
                            icon: "sprite2 cut",
                            action: function (obj) {
                                $scope.Tree_Copy_Cut("Cut");
                            }
                        },
                        copy: {
                            label: "Copy",
                            icon: "sprite2 copy",
                            action: function (obj) {
                                $scope.Tree_Copy_Cut("Copy");
                            }
                        }
                    };

                }
            }
            else {

                if (node.type == "Folder") {

                    if (node.id == "00000000-0000-0000-0000-000000000000") {

                        items = {
                            AddFolder: {
                                label: "Create Folder",
                                icon: "sprite2 folder",
                                action: function (obj) {
                                    $scope.Tree_Folder_File("Folder");
                                }
                            },
                            AddFile: {
                                label: "Create New",
                                icon: "sprite2 addFile",
                                submenu: {
                                    ObjectRepository: {
                                        label: "Object Repository",
                                        icon: "sprite2 ObjectRepository",
                                        action: function (obj) {
                                            $scope.Tree_Folder_File("ObjectRepository");
                                        }
                                    }
                                }

                            },
                        }

                    } else {

                        items = {
                            AddFolder: {
                                label: "Create Folder",
                                icon: "sprite2 folder",
                                action: function (obj) {
                                    $scope.Tree_Folder_File("Folder");
                                }
                            },
                            AddFile: {
                                label: "Create New",
                                icon: "sprite2 addFile",
                                submenu: {
                                    ObjectRepository: {
                                        label: "Object Repository",
                                        icon: "sprite2 ObjectRepository",
                                        action: function (obj) {
                                            $scope.Tree_Folder_File("ObjectRepository");
                                        }
                                    }
                                }

                            },
                            Rename: {
                                label: "Rename",
                                icon: "sprite2 edit-rename",
                                action: function (obj) {
                                    $scope.Tree_Rename();
                                }
                            },
                            Delete: {
                                label: "Delete",
                                icon: "sprite2 DeleteIcon",
                                action: function (obj) {
                                    $scope.Tree_Delete();
                                }
                            },
                            cut: {
                                label: "Cut",
                                icon: "sprite2 cut",
                                action: function (obj) {
                                    $scope.Tree_Copy_Cut("Cut");
                                }
                            },
                            copy: {
                                label: "Copy",
                                icon: "sprite2 copy",
                                action: function (obj) {
                                    $scope.Tree_Copy_Cut("Copy");
                                }
                            },
                            paste: {
                                label: "Paste",
                                icon: "sprite2 paste",

                                action: function (obj) {
                                    $scope.Tree_Paste();
                                }
                            },

                        };

                    }
                } else {

                    items = {
                        Rename: {
                            label: "Rename",
                            icon: "sprite2 edit-rename",
                            action: function (obj) {
                                $scope.Tree_Rename();
                            }
                        },
                        Delete: {
                            label: "Delete",
                            icon: "sprite2 DeleteIcon",
                            action: function (obj) {
                                $scope.Tree_Delete();
                            }
                        },
                        cut: {
                            label: "Cut",
                            icon: "sprite2 cut",
                            action: function (obj) {
                                $scope.Tree_Copy_Cut("Cut");
                            }
                        },
                        copy: {
                            label: "Copy",
                            icon: "sprite2 copy",
                            action: function (obj) {
                                $scope.Tree_Copy_Cut("Copy");
                            }
                        }
                    };

                }
            }
            if (node.id != "00000000-0000-0000-0000-000000000000") {

                if (node_copy == null) {
                    if (items.paste != null) {
                        items.paste._disabled = true;
                    }
                } else if (node.id == CopyCutNode_id) {
                    if (items.paste != null) {
                        items.paste._disabled = true;
                    }
                } else {
                    if (items.paste != null) {
                        items.paste._disabled = false;
                    }
                }
            }

            if (node.original.IsRestricted) {

                if (node.type == "Folder") {
                    items.AddFolder._disabled = true;
                    items.AddFile._disabled = true;
                    items.paste._disabled = true;
                }

                items.Delete._disabled = true;
                items.Rename._disabled = true;
                items.cut._disabled = true;

                if (node.type == "Folder") {
                    if (saas_object.current_Tree_ID == "testCaseSelectionTree") {
                        items.AddFile.submenu.TestCase._disabled = true
                        items.AddFile.submenu.FunctionLibarary._disabled = true
                    } else {
                        items.AddFile.submenu.ObjectRepository._disabled = true
                    }
                }

            }
            return items

        }

        $scope.Tree_Reload = function () {

            var panelId = $(".panel_artifact_type.active").attr("id");

            if (panelId == "divTree_Wrapper_Test_Case") {
                $scope.Tree_Clear("Test Case");
                $scope.GetAll_TestCase();
            } else {
                $scope.Tree_Clear("OR");
                $scope.GetAll_ObjectRepository();
            }

        };

        $scope.Tree_Folder_File = function (node_type) {
            debugger;


            var divTree = get_current_tree_id();
            var selectedNode = serviceFactory.getSelectedNode(divTree);
            var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

            if (selectedNode === null) {
                alert("First select a node");
                return false;
            }

            var parentId = selectedNode.id;

            var treeInstance = serviceFactory.getTreeInstance(divTree);


            $.ajax({
                url: opkey_end_point + "/ExplorerTree/getNewNodeName?parentID=" + parentId,
                type: "POST",
                success: function (result) {
                    debugger;
                    var node_name = result;

                    var allChildrenOfSelectedNode = selectedNode.children;

                    var nodePositionToInsert = 0;

                    for (var index = 0; index < allChildrenOfSelectedNode.length; index++) {

                        var childNode = serviceFactory.getTreeNode(divTree, allChildrenOfSelectedNode[index]);

                        if (childNode.type == 'Folder') {
                            nodePositionToInsert = index + 1;

                            continue;

                        } else {

                            nodePositionToInsert = index;

                            break;
                        }
                    }

                    var newNode_TempId = treeInstance.create_node(parentId, { "text": node_name, "type": node_type }, nodePositionToInsert);

                    serviceFactory.selectTreeNode(divTree, newNode_TempId);

                    // Step 2 create node at server side

                    if (newNode_TempId) {

                        var new_temp_node = treeInstance.get_node(newNode_TempId);

                        $.ajax({
                            url: opkey_end_point +  "/ExplorerTree/AddFileFolder?moduleType=" + node_type + "&startName=" + node_name + "&description=" + "&parentID=" + parentId,
                            type: "Get",
                            datatype: "jsonp",
                            success: function (result) {
                                debugger
                                var new_db_node = result;

                                new_temp_node.original = new_db_node;

                                new_temp_node.text = new_db_node.text;

                                treeInstance.set_id(new_temp_node.id, new_db_node.id);

                                serviceFactory.ExpandTree(divTree, new_db_node.id);

                                treeInstance.edit(new_db_node);

                                $('.jstree-rename-input').attr('maxLength', 254); // used for check node maxLength

                                $("#" + treeInstance.rootid).scrollTop($("#" + treeInstance.rootid).scrollTop());

                                var message = new_db_node.type + " ( " + new_db_node.text + " ) created successfully";

                                serviceFactory.notifier($scope, message, 'success');


                            },
                            error: function (error) {

                            }
                        });


                    }


                },
                error: function (error) {
                    serviceFactory.showError($scope, error);

                }

            });

        };

        $scope.Tree_Rename = function () {
            debugger;
            var divTree = get_current_tree_id();
            var selectedNode = serviceFactory.getSelectedNode(divTree);
            if (selectedNode === null) {
                alert("Please select a node");
                return false;
            }
            if (selectedNode.parent == "#") {
                serviceFactory.notifier($scope, "Parent node can not be modified !!!", "Error");
                alert("Parent node can not be modified");
                return false;
            }
            var treeInstance = serviceFactory.getTreeInstance(divTree);
            var selectedNodeData = serviceFactory.getSelectedNode(divTree);
            if (selectedNodeData.id !== null && selectedNodeData.id != 'j2_1') {
                treeInstance.edit(selectedNodeData.id);

            }
        };

        $scope.Tree_Delete = function () {
            var divTree = get_current_tree_id();
            var selectedNode = serviceFactory.getSelectedNode(divTree);
            if (selectedNode === null) {
                alert("Please select a node");
                return false;
            }

            var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

            $.ajax({
                url: opkey_end_point + "/ExplorerTree/DeleteTreeItem?&DB_ID=" + selectedNode.id + "&moduleType=" + selectedNode.type,
                type: "Get",
                datatype: "jsonp",
                success: function (result) {

                    $scope.Tree_Reload();
                },
                error: function (error) {
                    serviceFactory.showError($scope, error);

                }
            });

        };

        $scope.Tree_Copy_Cut = function (type) {
            debugger;

            var divTree = get_current_tree_id();
            var selectedNode = serviceFactory.getSelectedNode(divTree);

            if (selectedNode === null) {
                alert("Please select a node");
                return false;
            }
            CopyCutNode_id = selectedNode.id;

            node_copy_type = type;
            node_copy = selectedNode;
        };

        $scope.Tree_Paste = function () {
            debugger;

            var divTree = get_current_tree_id();
            var selectedNode = serviceFactory.getSelectedNode(divTree);

            if (selectedNode === null) {
                alert("Please select a node");
                return false;
            }

            if (node_copy === null) {
                alert("nothing to paste ");
                return false;
            }




            var ajaxUrl = empty;
            //var ajaxData = null;

            sourceID = null;
            destinationID = null;

            if (node_copy_type == "Copy") {
                ajaxUrl = "/ExplorerTree/CopyPasteFileFolder";
                sourceID = node_copy.original.id;
                destinationID = selectedNode.original.id;
                //ajaxData = {
                //    strSourceDTO: JSON.stringify(node_copy.original),
                //    strDestinationDTO: JSON.stringify(selectedNode.original)
                //};
            }
            else if (node_copy_type == "Cut") {

                ajaxUrl = "/ExplorerTree/CutPasteFileFolder";
                sourceID = node_copy.original.id;
                destinationID = selectedNode.original.id;
                //ajaxData = {
                //    strSourceDTO: JSON.stringify(node_copy.original),
                //    strDestinationDTO: JSON.stringify(selectedNode.original)
                //};
            }


            var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");



            $.ajax({
                url: opkey_end_point + ajaxUrl,
                data: { sourceID: sourceID, destinationID: destinationID },
                type: "Post",
                success: function (result) {
                    debugger;
                    $scope.Tree_Reload();
                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });
        };

        $scope.openRecorderWindow = function () {
            chrome.runtime.sendMessage({ shrinkRecorderWindow: "shrinkRecorderWindow" }, function (response) {
                if (chrome.runtime.lastError) { }
                window.location = "/Recorder.html";
                chrome.runtime.sendMessage({ setResume: "setResume" }, function (response) {
                    if (chrome.runtime.lastError) { }
                });
            });
        };

        // focus on click input pencil icon
        $(".custome-editPencil").on("click", function (e) {
            //debugger;
            $("#" + e.currentTarget.children[0].id).focus();
        });
    }]);




