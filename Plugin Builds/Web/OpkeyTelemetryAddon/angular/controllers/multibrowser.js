
angular.module('myApp').controller("multibrowser_ctrl", [
    '$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory', '$kWindow',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory, $kWindow) {

        var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        var execution_type = dataFactory.MultiBrowser_ExecutionType;

        $rootScope.ScopeMultibrowser = $scope;

        $scope.SelectedBuild = null;

        $scope.SplitterMultiBrowserOrientation = 'horizontal';

        var selectedRowDataForCopy = [];

        var kendoGridTestCase = null;

        var selectedExecutionMode = EnumExecutionMode.Web;

        var selectedbatchId = dataFactory.EmptyGuid;

        var selectedAgentId = dataFactory.EmptyGuid;

        var selectedPluginId = dataFactory.EmptyGuid;

        var browsers_window = ['Chrome', 'Firefox', 'IE', 'Edge'];

        var browsers_mac = ['Safari', 'Chrome', 'Firefox'];

        var spock_agent_id = "000d9a20-93ff-442a-b3a1-f3c1cf1b88d4";

        var selectedPlugin = null;

        $scope.ToBeSaveDate = "";

        $scope.ToBeSaveTime = "";

        $scope.ToBeSaveTimeZone = "";

        var current_user = null;

        var selectedBrowserDeviceElement = $("#btSelectBrowser");

        $scope.Load_View = function () {
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_View", Load_View);
        }

        function Load_View() {
            
            dataFactory.TempDataOfExecutionSessionSettings = new Object();
            dataFactory.TempDataOfExecutionTagSettings = [];
            dataFactory.TempDataOfExecutionGlobalSettings = [];
            dataFactory.TempDataOfExecutionSettings = new Object();
            dataFactory.AdvanceSettingAgentId = dataFactory.EmptyGuid;
            
            if (execution_type === EnumExecutionType.Local) {
                getGridLocalExecutionInformation();
                $("#btTab_Run_Test").addClass('active');
            }
            else {
                getGridExecutionInformation();
                $("#btTab_Normal_Recording").addClass('active');
            }
            //right side tree operation methods
            $scope.InitializeTree("divTreeWeb", "txtTreeWebSearch");
            $scope.InitializeTree("divTreeAccelerator", "txtTreeAcceleratorSearch");
            $scope.GetJSTreeNodes();
            $scope.GetAllLabelsWithJobs();
            getAllPlugin();
            BindBrowsersDropdowns();

            //End of right side tree operation methods
            $scope.ChangeTab("Select_Test_Case");

            kendoGridTestCase = formControlFactory.GetKendoGrid("divGridTestCase");
            setTimeout(function () {
                setAllTagsdata();
                BindUserDetails();
            }, 1000);

            $(".custom_graybtn").click(function (e) {
                $(".custom_graybtn").removeClass('active');
                $(e.currentTarget).addClass('active');
            })
        }

        //right side tree operation

        function BindUserDetails() {
            $.ajax({
                url: opkey_end_point + '/Base/getCurrentUserDetails',
                type: 'Get',
                success: function (res) {
                    
                    current_user = res;
                },
                error: function (error) {
                    //do nothing
                }
            });
        }

        function getAllPlugin() {
            $.ajax({
                url: opkey_end_point + "/Base/getAllPlugins",
                type: "Post",
                success: function (result) {
                    
                    RemoveUnusedPlugin(result);
                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });
        }
       

        function RemoveUnusedPlugin(All_Plugins) {
            debugger
            var UsedPlugins = { "Web": "Web", "Workday": "Workday", "Salesforce": "Salesforce", "OracleFusion": "OracleFusion", "PeopleSoft": "PeopleSoft", "Kronos": "Kronos", "MS Dynamics": "MS Dynamics", "MSDynamics FSO": "MSDynamics FSO", "SAP Fiori": "SAP Fiori", "Utility": "Utility", "OpKey-IE-Plugin": "OpKey-IE-Plugin", "Veeva Vault": "Veeva Vault" };
            var UsedPluginArr = [];
            for (var i = 0; i < All_Plugins.length; i++) {
                if (UsedPlugins.hasOwnProperty(All_Plugins[i].Name)) {
                    UsedPluginArr.push(All_Plugins[i]);
                }
            }
            createPluginDropdownList(UsedPluginArr);
            if (dataFactory.TempDataOfExecutionSessionSettings.PluginId == dataFactory.EmptyGuid) {
                $("#ddlKeywordPluginList").data("kendoDropDownList").select(0);
                selectedPluginId = UsedPluginArr[0].PluginID;
            }
            else {
                $("#ddlKeywordPluginList").data("kendoDropDownList").value(dataFactory.TempDataOfExecutionSessionSettings.PluginId);
                selectedPluginId = dataFactory.TempDataOfExecutionSessionSettings.PluginId;

            }
            dataFactory.TempDataOfExecutionSessionSettings.PluginId = selectedPluginId;
        }

        var setAllTagsdata = function () {
            
            var tagsData = serviceFactory.getAllTagsData();
            if (tagsData == null) {
                $.ajax({
                    url: opkey_end_point + "/Tag/getAllTagKeyValue",
                    type: "Get",
                    success: function (res) {
                        debugger
                        serviceFactory.setAllTagsData(res);

                    },
                    error: function (error) {
                        serviceFactory.showError($scope, error);
                    }
                });
            }
        };

        $scope.GetJSTreeNodes = function () {

            loadingStart("#divTreeWeb", "Please Wait ...", ".btnTestLoader");
            $.ajax({
                url: opkey_end_point + "/ExplorerTree/GetFlowGherkinJSTreeNodes",
                type: "Post",
                //data: { moduleType: "Flow", isDTORequired: false },
                success: function (result) {
                    loadingStop("#divTreeWeb", ".btnTestLoader");
                    bindTree("divTreeWeb", result);
                },
                error: function (error) {
                    loadingStop("#divTreeWeb", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });

        };

        $scope.GetAllLabelsWithJobs = function () {

            loadingStart("#divTreeAccelerator", "Please Wait ...", ".btnTestLoader");

            $.ajax({
                url: opkey_end_point + "/Label/GetAllLabelsWithArtifact",
                type: "Get",
                data: { moduleType: "BP_Group" },
                success: function (result) {
                    loadingStop("#divTreeAccelerator", ".btnTestLoader");
                    bindTree("divTreeAccelerator", result);
                },
                error: function (error) {
                    loadingStop("#divTreeAccelerator", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });

        };

        // Tree Operations 

        $scope.InitializeTree = function (divTree, txtSearchTree) {
            

            $('#' + divTree).jstree({
                'core': {
                    "check_callback": true,
                    "animation": false,
                    "force_text": true,
                    "error": function (err) {
                        if (err.id === 'unique_01') {
                            serviceFactory.selectTreeNode("Tree", $scope.selectedNodeID);
                            serviceFactory.notifier($scope, 'Label name must be unique in same hierarchy', 'error');
                            $('#search').val('');
                            $('#' + divTree).jstree(true).search('');
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
                    "label": { "icon": "sprite2 label" },
                    "BP_Group": { "icon": "acsprite1 TC28", "max_children": 0 },
                    "Folder": { "icon": "sprite2 folder" },
                    "Flow": { "icon": "sprite2 Flow", "max_children": 0 },
                },
                "plugins": ["state", "types", "changed", "unique", "search", "themes"],
                search: {
                    case_insensitive: true,
                    show_only_matches: true
                },
                "contextmenu": {
                    //items: function (e) {
                    //    $scope.EnableDisableButton(divTree, EnumTreeClickCallSource.Right);
                    //    return customMenu(e, divTree)
                    //}
                },
            }),

                $('#' + divTree).on('hover_node.jstree', function (e, data) {
                    var url = data.node.text;
                    $("#" + data.node.id).prop('title', url);
                }),
                $('#' + divTree).on('rename_node.jstree', function (e, data) {
                    //

                }),

                $('#' + divTree).on('delete_node.jstree', function (e, data) {


                }),

                $('#' + divTree).on('refresh.jstree', function (e, data) {
                }),

                $('#' + divTree).on("click", ".jstree-anchor", function (e, data) {
                    
                    e.preventDefault();
                }),

                $('#' + divTree).on('hover_node.jstree', function (e, data) {

                    var $node = $("#" + divTree + " ul li[id=" + data.node.id + "]");

                    var nodeText = data.node.text;

                    nodeText= DOMPurify.sanitize(nodeText);
                    
                    $node.prop('title', nodeText);

                    $node.find(".nodeBtn").remove();

                    if (data.node.original.type == "Flow" || data.node.original.type == "BP_Group" || data.node.original.type == "BDD_Gherkin_Stories" || data.node.original.type == "Sparkin") {

                        var hoverhtml = '';
                        hoverhtml = hoverhtml + '<div class="hover_node_button_wrapper">';
                        hoverhtml = hoverhtml + '<div class="media-bodyMB">';
                        hoverhtml = hoverhtml + '<a class="circle-icon theme-background-color"  id="btAddArtifact" style="cursor:pointer; left:5px!important;  padding:1px!important;" title="Add ' + nodeText + '"><i class="fa fa-plus-circle"></i></a>';
                        hoverhtml = hoverhtml + '</div>';
                        hoverhtml = hoverhtml + '</div>';

                        $node.find('.jstree-anchor').closest("a").prepend(hoverhtml);

                    }


                    //bind events

                    $('#btAddArtifact').click(function (event) {
                        
                        //select node 
                        serviceFactory.selectTreeNode(divTree, data.node.id);

                        if (data.node.original.type == "Flow" || data.node.original.type == "BP_Group") {

                            $scope.AddArtifact(data.node.original);
                        }
                        else {
                            var objResult = new Object();
                            objResult["FlowDataType"] = "";
                            objResult["DatasheetDTOs"] = [];
                            AfterSuccessData(objResult, data.node.original);
                        }

                    });

                }),

                $('#' + divTree).on('dehover_node.jstree', function (e, data) {
                    //
                    var $node = $("#" + divTree + " ul li[id=" + data.node.id + "]");
                    $('.hover_node_button_wrapper').closest('a').css('padding-right', '0');
                    $node.parent().find(".hover_node_button_wrapper").remove();
                    //$node.find('a').removeClass('jstree-clicked');
                });

            $('#' + divTree).on('contextmenu', '.jstree-anchor', function (e, data) {
            });


            // On Enter Key Search 
            $('#' + txtSearchTree).bind('keyup', function (e) {
                
                var searchValue = $('#' + txtSearchTree).val();
                $('#' + divTree).jstree(true).search(searchValue);


            });

            $rootScope.Scope_Main.restrictSpecialCharacterInTreeNodeText(divTree);

        };

        $scope.ClearSearchResultTree = function (call) {
            

            if (call === "Web") {
                $("#txtTreeWebSearch").val('');
                $('#divTreeWeb').jstree(true).search('');
            }
            else {
                $("#txtTreeAcceleratorSearch").val('');
                $('#divTreeAccelerator').jstree(true).search('');
            }

        }

        $scope.ReloadResultTree = function (call) {
            
            $scope.ClearSearchResultTree(call);
            if (call === "Web") {
                $scope.GetJSTreeNodes();
                //setTimeout(function () {
                //    bindTree("divTreeWeb", dataFactory.ProjectTreeFlows);
                //}, 2000);
            }
            else {
                $scope.GetAllLabelsWithJobs();
                //setTimeout(function () {
                //    bindTree("divTreeAccelerator", dataFactory.LabelTreeFlows);
                //}, 2000);
            }


        }

        function bindTree(treeId, nodes) {
            var tree = serviceFactory.getTreeInstance(treeId);
            tree.settings.core.data = nodes;
            tree.refresh();
            setTimeout(function () {
                serviceFactory.selectTreeNode(treeId, dataFactory.EmptyGuid);
                serviceFactory.expandTreeNode(treeId, dataFactory.EmptyGuid);
            }, 100);

        }

        $scope.ChangeApplicationPlatform = function (platFormId) {

            $(".selectTabApplicationPlatform").removeClass("active");
            $(".treeTab").bury(true);
            $(".searchPanel").bury(true);
            if (platFormId === "btPlatformWeb") {
                $("#" + platFormId).addClass("active");
                $("#divTreeWeb").show();
                $("#divTreeAccelerator").hide();
                $("#divTreeWeb").bury(false);
                $("#divSearchWeb").bury(false);
            }
            else if (platFormId === "btPlatformAccelerator") {
                $("#" + platFormId).addClass("active");
                $("#divTreeWeb").hide();
                $("#divTreeAccelerator").show();
                $("#divSearchAccelerator").bury(false);
                $("#divTreeAccelerator").bury(false);
            }
            else {
                console.log("Not Implemented")
            }

        }

        $scope.AddArtifact = function (nodeData) {
            
            GetFlowDataRepositoryTypeAndDataSheet(nodeData)
        }

        function GetFlowDataRepositoryTypeAndDataSheet(nodeData) {


            var ajaxUrl = "/ComponentFlow/GetFlowDataRepositoryTypeAndDataSheet";
            var ajaxData = {
                ArtifactID: nodeData.id
            }

            var selectedPlatformTab = $(".selectTabApplicationPlatform.active");

            if ($(selectedPlatformTab).attr("id") !== "btPlatformWeb") {
                ajaxUrl = "/BusinessProcess/GetBPGroupDataSheets";
                ajaxData = {
                    BPGropID: nodeData.id
                }
            }


            loadingStart("#divGridTestCase", "Please Wait ...", ".btnTest");
            $.ajax({
                url: opkey_end_point + ajaxUrl,
                type: "Post",
                data: ajaxData,
                success: function (result) {
                    loadingStop("#divGridTestCase", ".btnTest");
                    AfterSuccessData(result, nodeData);
                },
                error: function (error) {
                    loadingStop("#divGridTestCase", ".btnTest");
                    serviceFactory.showError($scope, error);
                }

            });
        }

        function AfterSuccessData(result, nodeData) {
            

            var kendoGridTestCase = formControlFactory.GetKendoGrid("divGridTestCase");
            var selectedIndex = formControlFactory.GetKendoGridSelectedRow(kendoGridTestCase);
            var selectedPlatformTab = $(".selectTabApplicationPlatform.active");

            var platform = $(selectedPlatformTab).attr("id") === "btPlatformWeb" ? "Flow" : "BP_Group";

            if ($(selectedPlatformTab).attr("id") === "btPlatformWeb") {
                platform = nodeData.type;
            }

            var selectedDataSheetId = dataFactory.EmptyGuid;

            var selectedDataSheetName = "";

            if (result.Item1 === EnumDataRepositoryType.Datasheet || result.Item1 === "DynamicDataSource") {

                if (result.Item2.length > 0) {

                    $.each(result.Item2, function (ind, obj) {

                        if (obj.IsDefault) {

                            selectedDataSheetId = obj.DataSheet_ID;
                            selectedDataSheetName = obj.Name;
                        }

                    });


                }
            }

            if (platform === "BDD_Gherkin_Stories" || platform === "Sparkin") {
                result.Item1 = "StaticDataSource";
            }

            var newRow = {
                ArtifactType: platform,
                ArtifactName: nodeData.text,
                ArtifactID: nodeData.id,
                DataSheetID: selectedDataSheetId,
                DataSheetName: selectedDataSheetName,
                FlowDataType: result.Item1,
                DatasheetDTOs: result.Item2,
                icon: nodeData.icon,
                IsSelected: false
            };

            kendoGridTestCase = formControlFactory.GetKendoGrid("divGridTestCase");
            kendoGridTestCase.dataSource.insert(selectedIndex + 1, newRow);
            formControlFactory.SelectedKendoGridRowByIndex("divGridTestCase", selectedIndex + 1, false);
            var selectedRowTopMargin = $("#divGridTestCase tr.k-state-selected").position().top;

            $("#divGridTestCase .k-grid-content").scrollTop(selectedRowTopMargin);
            serviceFactory.notifier($scope, 'Artifact added successfully', 'success');

        }

        //end

        $scope.AddTestCase = function () {
            

            $scope.Modal_Instance_Add_Test_Case = $kWindow.open({
                options: {


                    width: "600px",
                    height: "500px",
                    close: function () { },
                    open: function () { },
                    resizable: false,
                    draggable: false,
                    closeOnEscape: true,
                    modal: true,
                    close: function () { },
                    open: function () { },
                    visible: false,
                    title: "Add Test Case",

                },
                templateUrl: 'views/views_multibrowser/_modal_test_case.html',
                controller: 'add_test_case_ctrl'
            });


        }

        function BindIfInUpdateMode() {

            
            var selectedData = dataFactory.SelectedCURDData;
            selectedbatchId = selectedData.Batch_ID;
            $("#txtSessionName").val(selectedData.BatchName);
            $("#ddlBuilds").val(selectedData.BuildName);
            selectedExecutionMode = selectedData.ExecutionType;
            selectedPluginId = selectedData.DefaultPlugin_ID;
            selectedAgentId = selectedData.Agent_ID;
            selectedStartTime = selectedData.StartTime;


            $("#divGridTestCase").data("kendoGrid").dataSource.data(selectedData.SuiteArtifacts);

            $.each(selectedData.Browsers, function (ind, obj) {
                selectedBrowserVersion[obj.Browser_Version_ID] = obj;
            })

            $.each(selectedData.MobileDevices, function (ind, obj) {
                selectedDeviceVersion[obj.MobileDevice_ID] = obj;
            })

            dataFactory.TempDataOfExecutionSessionSettings = selectedData.LocalExecutionUserSettingsBinding;



        }

        $scope.RunOnLocal = function () {
            $("#div_spokeBrowsers").bury(false);
            $("#btAction_TestCase_Next").bury(true);
            $("#btAction_Run_Local_Execution").bury(false);
            SelectLocalExecution()
        }

        // Tab Functions 

        $scope.ChangeTab = function (type) {
            

            pureAllStartBrowserObject = [];
            pureAllStartPlatformObject = [];


            if (type === "Select_Test_Case") {


                $(".btn_Action").bury(true);
                $(".panelselectTabJob").bury(true);
                $("#div_select_test_cases").bury(false);
                changeBrowserDevice(selectedExecutionMode);
                $("#btAction_TestCase_Back").bury(false);
                $("#btAction_TestCase_Next").bury(false);
                $("#btAction_Execution_Back").bury(false);
                $("#btAction_AdvancedSettings").bury(false);

                if (dataFactory.MultiBrowser_ExecutionType == EnumExecutionType.Local) {
                    $("#div_spokeBrowsers").bury(false);
                    $("#btAction_TestCase_Next").bury(true);
                    $("#btAction_Run_Local_Execution").bury(false);
                }

                create_ddl_spock_region();
                create_ddl_spock_browser();
                getAgentSpockRegions();


            }
            else if (type === "Select_Browser") {

                var formValidator = sessionFormvalidator();
                if (!formValidator) {
                    return false;
                }

                var formValidatorTestCase = TestCaseValidator();
                if (!formValidatorTestCase) {
                    return false;
                }
                $(".btn_Action").bury(true);
                $(".panelselectTabJob").bury(true);
                $("#div_select_browsers").bury(false);
                $('.selectTestBrowsers').bury(false);
                $("#btAction_Browser_Back").bury(false);
                $("#btAction_Browser_Next").bury(false);

            }
            else if (type === "Selection_Summary") {






                var formValidatorTestCase = TestCaseValidator();
                if (!formValidatorTestCase) {
                    return false;
                }

                var formValidatorBrowserDevice = browserDeviceValidator();
                if (!formValidatorBrowserDevice) {
                    return false;
                }

                loadWindow_Summary();

            }
            else if (type === "View_Queued_Session") {
                $rootScope.Scope_Main.ChangePageView('queued_sessions');
            }
            else if (type == 'result.sessions') {
                $rootScope.Scope_Main.ChangePageView(type);
            }
            else if (type === "View_All_Session") {
                alert("Yet to be implement");
            }
            else {
                console.log("button not implemented");
            }

        }



        // DropDowns

        function createPluginDropdownList(Plugins) {


            $('#ddlKeywordPluginList').kendoDropDownList({
                dataTextField: "Name",
                dataValueField: "PluginID",
                dataSource: Plugins,
                animation: false,
                suggest: true,
                select: function (e) {
                    
                    selectedPlugin = e.dataItem;
                    selectedPluginId = selectedPlugin.PluginID;
                    dataFactory.TempDataOfExecutionSessionSettings.PluginId = selectedPluginId;
                },
                dataBound: function () {
                    //this.select(0);
                },
                change: function () { },
                close: function () { debugger;}
            });
        };

        function BindBrowsersDropdowns() {
            var isPlatformWindows = (navigator.platform.indexOf('Win') == -1) ? false : true;
            $("#ddlBrowserList").kendoDropDownList({
                dataSource: (isPlatformWindows ? browsers_window : browsers_mac),
                index: 0,
                valueTemplate: '<i class="k-PopupSprite SVG_#:data#"></i> #:data#',
                template: '<span class="k-state-default"><i class="k-PopupSprite SVG_#:data#"></i> #: data #</span>',
                close: function (e) {
                }
            });
        }

        function createDropdownForBuilds(listOfBuilds, lastUsedBuildName) {

            $("#ddlBuilds").kendoComboBox({
                dataSource: listOfBuilds,
                filter: "contains",
                template: '<span class="k-state-default app_Text_overflowDot" title = "#: data #">#: data #</span>',
                select: function (e) {
                    

                },
                close: function () {
                    debugger;
                }
            });

            var createBuild = $("#ddlBuilds").data("kendoComboBox");
            createBuild.input.keydown(function (e) {
                
                var inputVal = e.which;
                var specialChar = inputVal == 186 || inputVal == 191 || inputVal == 220 || inputVal == 222 || inputVal == 188 || inputVal == 190 || inputVal == 188 || inputVal == 186
                    || inputVal == 190 || inputVal == 191 || inputVal == 192 || inputVal == 220 || inputVal == 222 || inputVal == 106 || (e.shiftKey && inputVal == 56) || inputVal == 111 || (e.shiftKey && inputVal == 59) || inputVal == 59;

                if ($("#ddlBuilds").val().length == 0) {
                    if (specialChar == true) {
                        e.preventDefault();
                    } else {
                        $('#spErrorBuild').html('');
                    }
                } else {
                    if (specialChar == true) {
                        e.preventDefault();
                    }
                }
            });
            createBuild.input.bind("cut copy paste", function (e) {
                e.preventDefault();
            });
            createBuild.value(lastUsedBuildName);

        }

        // Ajax Calls

        function getGridLocalExecutionInformation() {
            loadingStart("#div_select_test_cases", "Please Wait ...", ".btnTestLoader");
            $.ajax({
                url: opkey_end_point + "/Execution/getRunNowFlowBP_GroupExecutionInformation",
                type: "Post",
                success: function (result) {
                    debugger;
                    loadingStop("#div_select_test_cases", ".btnTestLoader");
                    console.log("LocalExecutionSetting", result);
                    if (result.LastUsedBuildName == "" || result.LastUsedBuildName == null) {
                        createDropdownForBuilds(result.AllBuildNames, result.NewBuildName);
                    }
                    else {
                        createDropdownForBuilds(result.AllBuildNames, result.LastUsedBuildName);
                    }

                    selectedSession = result.SessionName;
                   

                    dataFactory.TempDataOfExecutionSessionSettings = result.LastExecutedSessionSettings;

                    dataOfSmtpSetting = result.SmtpSettings;


                    result.LastExecutedSessionSettings["DefaultStepTimeOut"] = result.LastExecutedSessionSettings.StepTimeOut;

                    // If Someone open custom Setting then load this seeting at window 1
                    dataFactory.TempDataOfExecutionSettings = result.LastExecutedSessionSettings;

                    dataFactory.TempDataOfSmtpSettings = result.SmtpSettings;

                    $('#txtSessionName').val(fakingAngularCharacter(result.SessionName));

                    // Date related stuff

                    var objDate = new Date(result.CurrentDate);
                    var objYear = objDate.getFullYear();
                    var objMonth = objDate.getMonth();
                    var objMyDate = objDate.getDate();

                    var d = new Date(); // for now
                    var hour = d.getHours(); // => 9
                    var minutes = d.getMinutes(); // =>  30

                    hour = hour < 10 ? "0" + hour : hour;
                    minutes = minutes < 10 ? "0" + minutes : minutes;

                    // $scope.DisplayDate = result.CurrentDate;

                    dataFactory.DisplayDate = objMonth + 1 + "/" + objMyDate + "/" + objYear

                    dataFactory.DisplayTime = hour + ":" + minutes;
                },
                error: function (error) {
                    loadingStop("#div_select_test_cases", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });
        }
        function getGridExecutionInformation() {
            
            loadingStart("#div_select_test_cases", "Please Wait ...", ".btnTestLoader");
            $.ajax({
                url: opkey_end_point + "/Execution/GetMultiBrowserPreExecutionInformation",
                type: "POST",
                success: function (result) {
                    

                    loadingStop("#div_select_test_cases", ".btnTestLoader");
                    if (result.LastUsedBuildName == "" || result.LastUsedBuildName == null) {
                        createDropdownForBuilds(result.AllBuildNames, result.NewBuildName);
                    }
                    else {
                        createDropdownForBuilds(result.AllBuildNames, result.LastUsedBuildName);
                    }

                    selectedSession = result.SessionName;
                    // Get list of Plugins 

                    listOfAllPlugins = result.AllPlugins;
                    // Bind Agent Data
                    //var agentobj = new Object();
                    //agentobj.AgentName = "--- Select Agent ---";
                    //agentobj.AgentID = 0;
                    //agentobj.IsOnline = true;
                    //result.AllAgents.sort(function (a, b) {
                    //    return (a.IsOnline == true) - (a.IsOnline == true) || -(a.IsOnline > b.IsOnline) || +(a.IsOnline < b.IsOnline);
                    //});
                    //result.AllAgents.unshift(agentobj);
                    //listOfAllAgents = result.AllAgents;

                    // Others

                    dataFactory.TempDataOfExecutionSessionSettings = result.SessionSettings;

                    dataOfSmtpSetting = result.SmtpSettings;


                    result.SessionSettings["DefaultStepTimeOut"] = result.SessionSettings.StepTimeOut;

                    // If Someone open custom Setting then load this seeting at window 1
                    dataFactory.TempDataOfExecutionSettings = result.SessionSettings;

                    dataFactory.TempDataOfSmtpSettings = result.SmtpSettings;

                    $('#txtSessionName').val(fakingAngularCharacter(result.SessionName));

                    // Date related stuff

                    var objDate = new Date(result.CurrentDate);
                    var objYear = objDate.getFullYear();
                    var objMonth = objDate.getMonth();
                    var objMyDate = objDate.getDate();

                    var d = new Date(); // for now
                    var hour = d.getHours(); // => 9
                    var minutes = d.getMinutes(); // =>  30

                    hour = hour < 10 ? "0" + hour : hour;
                    minutes = minutes < 10 ? "0" + minutes : minutes;

                    // $scope.DisplayDate = result.CurrentDate;

                    dataFactory.DisplayDate = objMonth + 1 + "/" + objMyDate + "/" + objYear

                    dataFactory.DisplayTime = hour + ":" + minutes;

                    if (dataFactory.SelectedCURDType === EnumCURDType.Update) {
                        BindIfInUpdateMode();
                    }

                    dataFactory.ListOfTimeZone = result.ListOfTimeZones;

                },
                error: function (error) {
                    loadingStop("#div_select_test_cases", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });
        };

        // Test Case Grid 

        $scope.DataGridTestCase = new kendo.data.DataSource({
            data: null,
            schema: {
                model: {
                    fields: {
                        ArtifactType: { type: "string", editable: false },
                        ArtifactName: { type: "string", editable: false },
                        FlowDataType: { type: "string", editable: false },
                    }
                },
            },
            change: function (e) {
                
                if (e.action === 'itemchange') {
                }
            }
        });

        $scope.OptionsGridTestCase = {
            dataSource: $scope.DataGridTestCase,
            resizable: false,
            selectable: "row",
            columns: [
                {
                    headerTemplate: '<input aria-label="input" type="checkbox"  class="chkAllArtifact"/>',
                    template: function (e) {

                        var checked = '';
                        if (e.IsSelected) {
                            checked = 'checked="checked"'
                        }

                        var html = '';
                        html = html + '<input type="checkbox" ' + checked + ' aria-label="input"  class="chkSelectedArtifact"/>';
                        return html;

                    }, width: "28px"
                },
                {
                    field: "ArtifactType", title: "Platform", template: function (e) {

                        if (e.ArtifactType === "Flow" || e.ArtifactType === "BDD_Gherkin_Stories" || e.ArtifactType === "Sparkin") {
                            return "OpKey Web";
                        }
                        else {

                            return "Accelerator";
                        }

                    }, width: "100px"
                },
                {
                    field: "ArtifactName", title: "Name", template: function (e) {

                        return '<i class="' + e.icon + '"></i>&nbsp;&nbsp;<span title="' + e.ArtifactName + '">' + e.ArtifactName + '</span>';
                    }
                },
                {
                    field: "DataSheetName",
                    title: "Local Data Repository",
                    template: function (e) {

                        if (e.FlowDataType === EnumDataRepositoryType.DataRepository) {
                            return "No Local Data Repository Used";
                        }
                        else {
                            return e.DataSheetName === "" ? "No Local Data Repository Used" : e.DataSheetName;
                        }
                    },
                    editor: editorDataSheet
                },
                {
                    width: "40px", template: function (e) {

                        var html = '';
                        html = html + '<a href="Javascript:void(0)" ng-click="DeleteArtifact()" class="queue-delete" title="Delete"><i class="fa fa-trash fa-lg colorRed"></i></a>';

                        html = html + '';

                        return html;
                    }
                },

            ],
            editable: true,
            editable: {
                confirmation: false
            },
            dataBound: function () {
                

                $('.chkAllArtifact').click(function (e) {
                    
                    $("#divGridTestCase .chkSelectedArtifact").prop("checked", e.currentTarget.checked);
                    dataBoundEvent();

                    var selectedTr = $(this).closest("tr");
                    var selectedRow = formControlFactory.GetKendoGridRowDataByTr(selectedTr)
                    selectedRow.set("IsSelected", e.currentTarget.checked);

                });

                $('.chkSelectedArtifact').click(function (e) {
                    
                    dataBoundEvent();

                    var rowsOfKendoGrid = $("#divGridTestCase .chkSelectedArtifact:checked").closest("tr");
                    $.each(rowsOfKendoGrid, function (ind, obj) {
                        var selectedRow = formControlFactory.GetKendoGridRowDataByTr(obj)
                        selectedRow.set("IsSelected", e.currentTarget.checked);

                    });

                });


                dataBoundEvent();


            },
            edit: function (e) {
                $(e.container[0]).find('input').attr('aria-label', 'Enter Value');
            }
        };

        function dataBoundEvent() {
            


            var checkedArtifact = $("#divGridTestCase .chkSelectedArtifact:checked").length;
            kendoGridTestCase = formControlFactory.GetKendoGrid("divGridTestCase");
            var totalArtifact = kendoGridTestCase.dataSource.total();

            if (checkedArtifact === totalArtifact && totalArtifact !== 0) {
                $('.chkAllArtifact').prop("checked", true);
            }
            else {
                $('.chkAllArtifact').prop("checked", false);
            }


            if (checkedArtifact > 0) {
                $("#btStepDelete").prop("disabled", false);
                $("#btStepCopy").prop("disabled", false);
                $("#btStepPaste").prop("disabled", false);
                $("#btStepMoveUp").prop("disabled", false);
                $("#btStepMoveDown").prop("disabled", false);
                $("#btAdvanceSettings").prop("disabled", false);
            }
            else {
                $("#btStepDelete").prop("disabled", true);
                $("#btStepCopy").prop("disabled", true);
                $("#btStepPaste").prop("disabled", true);
                $("#btStepMoveUp").prop("disabled", true);
                $("#btStepMoveDown").prop("disabled", true);
                $("#btAdvanceSettings").prop("disabled", true);

            }
            if (checkedArtifact > 1) {
                $("#btStepMoveUp").prop("disabled", true);
                $("#btStepMoveDown").prop("disabled", true);
            }


        }

        function editorDataSheet(container, options) {
            

            if (options.model.FlowDataType === EnumDataRepositoryType.DataRepository || options.model.FlowDataType === "StaticDataSource") {

                var html = '';
                html = html + 'No Local Data Repository Used';
                $(container[0]).html(html);
                return false;
            }



            if (options.model.DatasheetDTOs.length > 0) {

                if (options.model.DatasheetDTOs[0].DataSheet_ID !== dataFactory.EmptyGuid) {
                    var selectObject = new Object();
                    selectObject["Name"] = "No LDR Used";
                    selectObject["DataSheet_ID"] = dataFactory.EmptyGuid;
                    options.model.DatasheetDTOs.unshift(selectObject);

                }



            }


            $('<input value=' + options.model.DataSheetName + ' />')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: true,
                    dataSource: options.model.DatasheetDTOs,
                    dataBound: function (e) {
                        //  $(e)[0].sender.open();
                        $(e)[0].sender.text(options.model.DataSheetName);
                    },
                    dataTextField: "Name",
                    dataValueField: "DataSheet_ID",
                    select: function (e) {
                        
                        options.model.set("DataSheetID", e.dataItem.DataSheet_ID);
                        options.model.set("DataSheetName", e.dataItem.Name);

                    }
                });

        }

        $scope.OnSearchTestCase = function () {
            var value = $("#txtClearTestCase").val();
            $("#divGridTestCase").data("kendoGrid").dataSource.filter({
                logic: "or",
                filters: [
                    { field: "ArtifactType", operator: "contains", value: value },
                    { field: "ArtifactName", operator: "contains", value: value },
                    { field: "FlowDataType", operator: "contains", value: value },
                    { field: "DataSheetName", operator: "contains", value: value }
                ]
            });
        };

        $scope.ClearSearchTestCase = function () {
            $('#txtClearTestCase').val('');
            $scope.OnSearchTestCase();
        };

        $scope.StepAction = function (action) {
            
            if (action === "Copy") {
                CopyStep();
            } else if (action === "Paste") {
                PasteStep();
            } else if (action === "MoveUp") {
                MoveUpStep();
            } else if (action === "MoveDown") {
                MoveDownStep();
            } else {
                console.log("Step Action Not Implemented")
            }

        }

        $scope.OpenAdvancedSettings = function () {
            // dataFactory.CallSourceAdvanceSettings = "MultiBrowser";
            $scope.Modal_Instance_Addvance_Settings = $kWindow.open({
                options: {


                    width: "80%",
                    height: "495px",
                    close: function () { },
                    open: function () { },
                    resizable: false,
                    draggable: false,
                    closeOnEscape: true,
                    modal: true,
                    close: function () { },
                    open: function () { },
                    visible: false,
                    title: "Advanced Settings",

                },
                templateUrl: 'views/views_multibrowser/_modal_advanced_settings.html',
                controller: 'advanced_settings_ctrl'
            });
        }

        function CopyStep() {
            
            selectedRowDataForCopy = [];
            var selectedRowsData = formControlFactory.GetKendoGridAllSelectedRowsData("divGridTestCase");
            if (selectedRowsData.length === 0) {
                serviceFactory.notifier($scope, 'Nothing to copy ', 'error');
                return false;
            }
            selectedRowDataForCopy = selectedRowsData;
            serviceFactory.notifier($scope, 'Row copied successfully ', 'success');
        }

        function PasteStep() {
            

            if (selectedRowDataForCopy.length === 0) {
                serviceFactory.notifier($scope, 'Nothing to paste ', 'error');
                return false;
            }

            var selectedIndex = formControlFactory.GetKendoGridSelectedRow(kendoGridTestCase);

            $.each(selectedRowDataForCopy, function (ind, obj) {

                selectedIndex = selectedIndex + 1;


                var newRow = {
                    ArtifactType: obj.ArtifactType,
                    ArtifactName: obj.ArtifactName,
                    ArtifactID: obj.ArtifactID,
                    DataSheetID: obj.DataSheetID,
                    DataSheetName: obj.DataSheetName,
                    FlowDataType: obj.FlowDataType,
                    DatasheetDTOs: obj.DatasheetDTOs,
                    icon: obj.icon,
                    IsSelected: obj.IsSelected
                };


                kendoGridTestCase = formControlFactory.GetKendoGrid("divGridTestCase");
                kendoGridTestCase.dataSource.insert(selectedIndex, newRow);
                formControlFactory.SelectedKendoGridRowByIndex("divGridTestCase", selectedIndex, false);

            })


            //   kendoGridTestCase.element.find('tbody tr:eq(' + (selectedIndex + 1) + ')').addClass('k-state-selected');
            serviceFactory.notifier($scope, 'Step Pasted Successfully ', 'success');

        }

        function MoveUpStep() {

            
            kendoGridTestCase = formControlFactory.GetKendoGrid("divGridTestCase");
            var selectedIndex = formControlFactory.GetKendoGridSelectedRow(kendoGridTestCase);
            var selectedRowData = formControlFactory.GetKendoGridSelectedRowData(kendoGridTestCase);

            var newIndex = Math.max(0, selectedIndex - 1);

            if (newIndex != selectedIndex && selectedIndex !== -1) {

                kendoGridTestCase.dataSource.remove(selectedRowData);
                kendoGridTestCase = formControlFactory.GetKendoGrid("divGridTestCase");
                kendoGridTestCase.dataSource.insert(newIndex, selectedRowData);


                var newIndex = selectedIndex - 1;
                if (newIndex < 0) {
                    newIndex = 0;
                }

                kendoGridTestCase.element.find('tbody tr:eq(' + (newIndex) + ')').addClass('k-state-selected');
                serviceFactory.notifier($scope, 'Selected Test Case Moved Up', 'success');

            }
            else {
                serviceFactory.notifier($scope, 'Unable to Move Up ', 'error');
            }



        }

        function MoveDownStep() {

            
            kendoGridTestCase = formControlFactory.GetKendoGrid("divGridTestCase");
            var selectedIndex = formControlFactory.GetKendoGridSelectedRow(kendoGridTestCase);
            var selectedRowData = formControlFactory.GetKendoGridSelectedRowData(kendoGridTestCase);



            var newIndex = selectedIndex + 1;
            var divScrollDown = [9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 99];
            if (newIndex != selectedIndex && selectedIndex < kendoGridTestCase.dataSource.total() - 1) {

                kendoGridTestCase.dataSource.remove(selectedRowData);
                kendoGridTestCase = formControlFactory.GetKendoGrid("divGridTestCase");
                kendoGridTestCase.dataSource.insert(newIndex, selectedRowData);

                if (newIndex >= kendoGridTestCase.dataSource.total()) {
                    newIndex = kendoGridTestCase.dataSource.total() - 1;
                } else if (newIndex < 0) {
                    newIndex = 0;
                }

                kendoGridTestCase.element.find('tbody tr:eq(' + (newIndex) + ')').addClass('k-state-selected');

                serviceFactory.notifier($scope, 'Selected Test Case Moved Down', 'success');

                var trHeight = $('#divGridTestCase tr:eq(1)').outerHeight();
                var selectedRowIndex = $('#divGridTestCase tr.k-state-selected').index();
                var totalHeightofDiv = trHeight * (selectedRowIndex);
                if (divScrollDown.indexOf(selectedRowIndex) >= 0)
                    $('#divGridTestCase div:eq(3)').scrollTop(totalHeightofDiv);


                serviceFactory.notifier($scope, 'Selected Test Case Step Moved Down', 'success');

            }
            else {
                serviceFactory.notifier($scope, 'Unable to Move Down ', 'error');
            }




        }

        function DeleteStep(selectedItem) {
            
            kendoGridTestCase = formControlFactory.GetKendoGrid("divGridTestCase");
            var selectedIndex = formControlFactory.GetKendoGridSelectedRow(kendoGridTestCase);


            $.msgBox({
                title: "Delete",
                content: "Are you sure want to delete this step ?",
                modal: true,
                type: "confirm",
                buttons: [{ value: "ok" }, { value: "Cancel" }],
                success: function (status) {
                    if (status == "ok") {
                        

                        kendoGridTestCase.dataSource.remove(selectedItem);

                        kendoGridTestCase = formControlFactory.GetKendoGrid("divGridTestCase");

                        var newIndex = selectedIndex - 1;
                        if (newIndex < 0) {
                            newIndex = 0;
                        }
                        var dataSource = kendoGridTestCase.dataSource.data();
                        if (dataSource.length !== 0) {
                            kendoGridTestCase.element.find('tbody tr:eq(' + (newIndex) + ')').addClass('k-state-selected');
                        }

                        serviceFactory.notifier($scope, 'Step Deleted Successfully ', 'success');
                    }
                }

            });

        }

        $scope.DeleteArtifact = function () {
            
            var selectedItem = this.dataItem;
            DeleteStep(selectedItem);
        }

        $scope.DeleteAll = function () {
            
            kendoGridTestCase = formControlFactory.GetKendoGrid("divGridTestCase");
            var rowsOfKendoGrid = $("#divGridTestCase .chkSelectedArtifact:checked").closest("tr");

            $.msgBox({
                title: "Delete",
                content: "Are you sure want to delete this step ?",
                modal: true,
                type: "confirm",
                buttons: [{ value: "ok" }, { value: "Cancel" }],
                success: function (status) {
                    if (status == "ok") {
                        

                        $.each(rowsOfKendoGrid, function (ind, obj) {
                            kendoGridTestCase.removeRow(obj);
                        });


                        kendoGridTestCase = formControlFactory.GetKendoGrid("divGridTestCase");
                        kendoGridTestCase.element.find('tbody tr:eq(' + (0) + ')').addClass('k-state-selected');
                        serviceFactory.notifier($scope, 'Rows deleted successfully ', 'success');

                    }
                }

            });
        }

        $scope.OpenAdvanceSetting = function () {
            
            dataFactory.CallSourceAdvanceSettings = "MultiBrowser";
            $rootScope.ModalScope.OpenModalExecutionAdvanceSettings();

        }

        $scope.OpenSMTPSetting = function () {
            
            dataFactory.CallSourceAdvanceSettings = "MultiBrowser";
            $rootScope.ModalScope.openSMTPSettingModal();

        }

        //Catgory Grid 

        $(".tab-platform").click(function () {
            debugger;
            selectedBrowserDeviceElement = this;
            LetsChangeBrowserDeviceTab();

        });

        function LetsChangeBrowserDeviceTab() {
            debugger;
            var platFormId = $(selectedBrowserDeviceElement).attr("id");

            var msg = 'Switching platform type will clear all your existing selections.<br> Are you sure you want to continue?"';


            var requestedType = EnumExecutionMode.Web;

            if (platFormId === "btSelectBrowser") {
                requestedType = EnumExecutionMode.Web;
            }
            else {
                requestedType = EnumExecutionMode.Mobile;
            }

            if (selectedExecutionMode !== requestedType) {

                if (selectedExecutionMode === EnumExecutionMode.Web) {

                    if ($.isEmptyObject(selectedBrowserVersion)) {

                        //Just Change 
                        changeBrowserDevice(requestedType);

                    }
                    else {

                        // Msg Box

                        $.msgBox({
                            title: "Delete",
                            content: msg,
                            modal: true,
                            type: "confirm",
                            buttons: [{ value: "Yes" }, { value: "No" }],
                            success: function (status) {
                                if (status == "Yes") {

                                    selectedBrowserVersion = {};
                                    selectedDeviceVersion = {};
                                    changeBrowserDevice(requestedType);
                                }
                            }

                        });


                    }

                }
                else if (selectedExecutionMode === EnumExecutionMode.Mobile) {

                    if ($.isEmptyObject(selectedDeviceVersion)) {

                        //Just Change 
                        changeBrowserDevice(requestedType);
                    }
                    else {

                        // Msg Box

                        $.msgBox({
                            title: "Delete",
                            content: msg,
                            modal: true,
                            type: "confirm",
                            buttons: [{ value: "Yes" }, { value: "No" }],
                            success: function (status) {
                                if (status == "Yes") {


                                    selectedBrowserVersion = {};
                                    object_browser_version_resolution = {};
                                    object_browser_version_viewport = {};
                                    selectedDeviceVersion = {};
                                    changeBrowserDevice(requestedType);
                                }
                            }

                        });


                    }

                }


            }
            else {
                changeBrowserDevice(requestedType);
            }


        }

        function changeBrowserDevice(type) {
            debugger;
            $(".tab-platform").removeClass("active");
            $(".panelBrowserDevice").bury(true);
            $(".gridCategory").bury(true);

            selectedExecutionMode = type;
            if (type === EnumExecutionMode.Web) {

                $(selectedBrowserDeviceElement).addClass("active");
                pureAllStartPlatformObject = [];
                $("#divGridCategory").bury(false);
                $("#divGridBrowserSubCategory").bury(false);



                objectOfDevice = new Object();
                arrayOfPlatform = [];
                selectedDeviceVersion = new Object();


                var columnBrowser = browserCategoryColumn();
                BindCategory(columnBrowser);
                GetBrowserCombinations();
            }
            else {

                $(selectedBrowserDeviceElement).addClass("active");
                pureAllStartBrowserObject = [];
                //     selectedDeviceVersion = {};
                $("#divGridPlatform").bury(false);
                $("#divGridMobileDevice").bury(false);

                arrayOperatingSystem = [];
                objectBrowser = new Object();
                selectedOperatingSystem = new Object();
                objectOfDeviceVersion = new Object();
                objectBrowserAttribute = "";
                browserGuids = [];
                selectedBrowserVersion = new Object();
                object_browser_version_resolution = new Object();
                object_browser_version_viewport = new Object();
                GetMobileCombinations();
            }

        }

        $scope.ReloadGrid = function () {
            
            if (selectedExecutionMode === EnumExecutionMode.Web) {
                GetBrowserCombinations();
            }
            else {
                GetMobileCombinations();

            }

        }

        // Browsers Operation

        var arrayOperatingSystem = [];

        var objectBrowser = new Object();

        var selectedOperatingSystem = new Object();

        var objectOfDeviceVersion = new Object();

        var objectBrowserAttribute = "";

        var browserGuids = [];

        var selectedBrowserVersion = new Object();

        var pureAllStartBrowserObject = new Object();

        var object_browser_version_resolution = new Object();

        var object_browser_version_viewport = new Object();

        var all_browser_data = [];

        function GetBrowserCombinations() {
            



            var ajax_url = empty;
            var ajax_data = {};

            if (execution_type === EnumExecutionType.Local) {
                ajax_url = opkey_end_point + "/Admin/GetBrowserCombinations";
            } else if (execution_type === EnumExecutionType.Cloud) {
                ajax_url = opkey_end_point + "/BrowserCloud/getAvailableBrowsers";
                ajax_data = { browserCloudRelayServer: dataFactory.Response_pcloudy_credentials.browserCloudRelayServer, browserCloudAuthToken: dataFactory.Response_pcloudy_credentials.AuthToken };
            }


            loadingStart(".selectTestBrowsers", "Please Wait ...", ".btnTestLoader");


            $.ajax({
                url: ajax_url,
                data: ajax_data,
                type: "POST",
                success: function (result) {
                    debugger;
                    
                    loadingStop(".selectTestBrowsers", ".btnTestLoader");

                    if (all_browser_data.length === 0) {
                        

                        // Step 1 Ok Lets Vreate Binding

                        objectBrowser = new Object();
                        arrayOperatingSystem = [];
                        selectedOperatingSystem = new Object();
                        objectOfDeviceVersion = new Object();
                        objectBrowserAttribute = "";
                        browserGuids = [];
                        pureAllStartBrowserObject = new Object();


                        $.each(result, function (ind, obj) {
                            debugger;
                            var theOsKey = obj.OS_Name + obj.OS_Version;
                            var theBrowserKey = "B" + obj.Browser_ID.replace(/\-/g, '');
                            var theBrowserVersionKey = obj.Browser_Version_ID;
                            var tempBrowserVersionObject = new Object();
                            var tempBrowserObject = new Object();
                            var keyBrowserObject = new Object();
                            var totalBrowsersInOS = 1;

                            var allStartKey = obj.OS_Name + obj.OS_Version + obj.Browser_Name + obj.Browser_Version;

                            if (pureAllStartBrowserObject.hasOwnProperty(allStartKey)) {
                                return true;
                            }
                            else {
                                pureAllStartBrowserObject[allStartKey] = allStartKey;

                            }


                            // All Versions

                            if (!objectOfDeviceVersion.hasOwnProperty(obj.Browser_Version_ID)) {
                                objectOfDeviceVersion[obj.Browser_Version_ID] = obj
                            }


                            // Grids

                            if (objectBrowser.hasOwnProperty(theOsKey)) {

                                keyBrowserObject = objectBrowser[theOsKey];

                                totalBrowsersInOS = keyBrowserObject["Total"]

                                if (keyBrowserObject.hasOwnProperty(theBrowserKey)) {

                                    tempBrowserObject = keyBrowserObject[theBrowserKey];
                                    tempBrowserVersionObject = tempBrowserObject["Versions"];


                                    var totalVersion = tempBrowserVersionObject["Total"] + 1;

                                    if (totalBrowsersInOS < totalVersion) {
                                        totalBrowsersInOS = totalVersion;
                                    }

                                    tempBrowserVersionObject["Total"] = totalVersion;
                                    tempBrowserVersionObject[totalVersion] = obj.Browser_Version_ID;
                                }
                                else {


                                    tempBrowserVersionObject[0] = obj.Browser_Version_ID;
                                    tempBrowserVersionObject["Total"] = 0;


                                    tempBrowserObject["Name"] = obj.Browser_Name;
                                    tempBrowserObject["Versions"] = tempBrowserVersionObject;
                                }

                            }
                            else {

                                tempBrowserVersionObject[0] = obj.Browser_Version_ID;
                                tempBrowserVersionObject["Total"] = 0;
                                tempBrowserObject["Name"] = obj.Browser_Name;
                                tempBrowserObject["Versions"] = tempBrowserVersionObject;


                                var osObject = new Object();
                                osObject["OS_Name"] = obj.OS_Name;
                                osObject["OS_Version"] = obj.OS_Version;
                                arrayOperatingSystem.push(osObject);
                            }


                            keyBrowserObject[theBrowserKey] = tempBrowserObject;


                            //tempBrowserVersionObject["Browsers"] = "";
                            keyBrowserObject["Total"] = totalBrowsersInOS;

                            objectBrowser[theOsKey] = keyBrowserObject;

                        });


                    }
                    all_browser_data = result;
                    var Arranged_OS = arrayOperatingSystem.sort(Arrange_OS("OS_Name"));
                    $("#divGridCategory").data("kendoGrid").dataSource.data(Arranged_OS);
                    if (arrayOperatingSystem.length == 0) {
                        $('#divGridBrowserSubCategory').addClass('Banner_NoBrowser_Step')
                    }
                    else {
                        $('#divGridBrowserSubCategory').removeClass('Banner_NoBrowser_Step')
                    }
                },
                error: function (error) {
                    loadingStop(".selectTestBrowsers", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });
        };

        function Arrange_OS(property) {
            var sort_order = -1;
            return function (a, b) {
                // a should come before b in the sorted order
                if (a[property] < b[property]) {
                    return -1 * sort_order;
                    // a should come after b in the sorted order
                } else if (a[property] > b[property]) {
                    return 1 * sort_order;
                    // a and b are the same
                } else {
                    return 0 * sort_order;
                }
            }
        }

        function browserCategoryColumn() {
            var arrayOfBrowserColumn = [];
            var objectColumn = new Object();
            objectColumn["field"] = "OS_Name";
            objectColumn["title"] = "Operating System";
            objectColumn["template"] = function (e) {
                
                var osname = e.OS_Name + " " + e.OS_Version;
                // var osmac = e.OS_Name;

                var html = '';

                var osSprite = "mbspriteB Window10";
                
                if (osname.toLowerCase().indexOf("windows 10") != -1) {
                    osSprite = "mbspriteB window10";
                } else if (osname.toLowerCase().indexOf("windows 8.1") != -1) {
                    osSprite = "mbspriteB window7";
                } else if (osname.toLowerCase().indexOf("windows 7") != -1) {
                    osSprite = "mbspriteB window7";

                } else if (osname.toLowerCase().indexOf("mac") != -1) {
                    osSprite = "mbspriteB mac";
                }
                

                return '<span class="' + osSprite + '" style="vertical-align:bottom;"></span>' + e.OS_Name + " " + e.OS_Version;

            }
            arrayOfBrowserColumn.push(objectColumn);

            return arrayOfBrowserColumn;
        }

        function BindCategory(gridColumnData) {
            debugger;
            $("#divGridCategory").kendoGrid({
                dataSource: new kendo.data.DataSource({
                    data: [],
                }),
                selectable: "row",
                scrollable: false,
                columns: gridColumnData,
                change: function (e) {
                    debugger;
                    var selectedItem = e.sender.dataItem(e.sender.select());
                    var osKey = selectedItem["OS_Name"] + selectedItem["OS_Version"]
                    var selectedOSData = objectBrowser[osKey];
                    selectedOperatingSystem = selectedOSData;
                    var gridColumn = browserSubCategoryColumn(selectedOSData);
                    var gridData = browserSubCategoryData(selectedOSData);
                    BindBrowserSubCategory(gridColumn, gridData)

                },
                editable: false,
                edit: function (e) {
                    
                },
                dataBound: function (e) {
                    
                    var data = e.sender.dataSource.data();
                    if (data.length != 0) {
                        e.sender.select("tr:eq(1)");
                    }
                },

            }).getKendoGrid();


        }

        function getSpecificResolutionList(AllResolutions) {
            var DeviceResolution = [];
            var ScreanResolution = [];
            var customObj = {};
            $.each(AllResolutions, function (ind, obj) {
                if (obj.Type == "BrowserViewPort") {
                    DeviceResolution.push(obj);
                }
                else {
                    ScreanResolution.push(obj);
                }
            })
            customObj['ScreenResolution'] = ScreanResolution;
            customObj['BrowserViewPort'] = DeviceResolution;
            return customObj;
        }

        function browserSubCategoryColumn(browserData) {
            

            var arrayOfBrowserColumn = [];

            var tempObject = new Object();

            browserGuids = [];

            $.each(browserData, function (ind, obj) {

           
                if (ind !== "Total") {

                    var objectColumn = new Object();

                    objectColumn["field"] = ind;

                    objectColumn["title"] = obj.Name;

                    objectColumn["template"] = function (e) {
                        
            
                        var html = '';

                        var versionId = e[ind];

                        if (versionId !== "") {
                            var obj_browser_verion = objectOfDeviceVersion[versionId];

                            var checked = '';

                            if (selectedBrowserVersion.hasOwnProperty(obj_browser_verion.Browser_Version_ID)) {
                                checked = 'checked="checked"'
                            }

                            html = html + '<div id="div_browserPanel" style="display:flex; justify-content: space-around;">';
                            html = html + '<div style="width: 45px;">';
                            html = html + '<div class="reboot-margin-bottom-sm text-center"> <b>Browser Version</b></div > ';
                            html = html + '<div style="display: flex;"><input aria-label="Select Browser"  id = "chkBrowser_' + versionId + '" class="selectVersion" ' + checked + ' data-browserId="' + versionId + '" type = "checkbox" >&nbsp;&nbsp;<div title="' + obj_browser_verion.Browser_Version + ' ">' + stringCutter(obj_browser_verion.Browser_Version, 5) + '</div></div>';
                            html = html + '</div>';

                            // lets check if browser with verion  have any resolution (or add default)


                            if (obj_browser_verion.SupportedMachineResolutions.length === 0) {

                                var object_resolution = {};
                                object_resolution["Height"] = "1024";
                                object_resolution["Name"] = "1024x768";
                                object_resolution["Type"] = "ScreenResolution";
                                object_resolution["Height"] = "768";

                                obj_browser_verion.SupportedMachineResolutions.push(object_resolution);
                            }

                            var ddl_resolution_ = 'ddl_resolution_' + versionId;

                            html = html + '<div style="width: 65px;">';
                            html = html + '<div class="reboot-margin-bottom-xs text-center"><b>System Resolution</b></div> <div id="' + ddl_resolution_ + '" data_versionId="' + versionId + '" ></div>';
                            html = html + '</div>';

                            setTimeout(function () {
                                create_dropdown_resolution(ddl_resolution_, versionId, obj_browser_verion.SupportedMachineResolutions);
                            }, 500);


                            if (obj_browser_verion.SupportedBrowserViewPorts.length > 0) {

                                var ddl_viewport_ = 'ddl_viewport_' + versionId;

                                html = html + '<div style="width: 65px;">';
                                html = html + '<div class="reboot-margin-bottom-xs text-center"><b>Browser Viewport</b></div> <div id="' + ddl_viewport_ + '" data_versionId="' + versionId + '" ></div>';
                                html = html + '</div>';

                                html = html + '</div>';


                                setTimeout(function () {

                                    create_dropdown_viewport(ddl_viewport_, versionId, obj_browser_verion.SupportedBrowserViewPorts );

                                }, 500);

                            }

                        }
                        return html;
                    };
                    objectColumn["headerTemplate"] = function (e) {

                        var browsername = obj.Name

                        var html = '';

                        var browserSprite = "mbspriteB chrome";

                        if (browsername.toLowerCase().indexOf("chrome") != -1) {
                            browsername = "Google Chrome";
                            browserSprite = "mbspriteB chrome";
                        } else if (browsername.toLowerCase().indexOf("internet") != -1) {
                            browsername = "Internet Explorer";
                            browserSprite = "mbspriteB ie";
                        } else if (browsername.toLowerCase().indexOf("firefox") != -1) {
                            browsername = "Mozilla Firefox";
                            browserSprite = "mbspriteB firefox";
                        } else if (browsername.toLowerCase().indexOf("safari") != -1) {
                            browsername = "Safari";
                            browserSprite = "mbspriteB safari";
                        } else if (browsername.toLowerCase().indexOf("msedge") != -1) {
                            browsername = "Microsoft Edge";
                            browserSprite = "mbspriteB msedge";
                        }


                        else if (browsername.toLowerCase().indexOf("ie") != -1) {
                            browsername = "Internet Explorer";
                            browserSprite = "mbspriteB ie";
                        }
                        else if (browsername.toLowerCase().indexOf("mozilla") != -1) {
                            browsername = "Mozilla Firefox";
                            browserSprite = "mbspriteB firefox";
                        }

                        html = html + '<div data-item="' + browsername + '" class="' + browserSprite + '"></div><div class="BrowserName" data-item="' + browsername + '" >' + browsername + '</div>';


                        return html;


                    }



                    arrayOfBrowserColumn.push(objectColumn);
                    browserGuids.push(ind);
                    tempObject[ind] = "";
                }

            });


            objectBrowserAttribute = JSON.stringify(tempObject);

            return arrayOfBrowserColumn;
        }

        function create_dropdown_resolution(id, versionId, data) {

            $("#" + id).kendoDropDownList({
                dataTextField: "Name",
                dataValueField: "Name",
                groupTemplate: "Group: #: data #",
                optionLabel: "-- Select --",
                template: '<span title = "#: Name #">#: Name #</span>',
                valueTemplate: '<span title = "#: Name #">#: Name #</span>',
                dataSource: {
                    data: data,
                    group: { field: "Type" }
                },
                select: function (e) {
                    debugger
                    var dataItem = e.dataItem;

                    var browser_version_id = e.sender.element.attr("data_versionId");

                    if (dataItem.Name === "") {
                        delete object_browser_version_resolution[browser_version_id];
                    } else {
                        object_browser_version_resolution[browser_version_id] = dataItem;
                    }

                }

            });


            if (object_browser_version_resolution.hasOwnProperty(versionId)) {
                $("#" + id).data("kendoDropDownList").value(object_browser_version_resolution[versionId].Name);
            }

        }


        function create_dropdown_viewport(id, versionId, data) {

            $("#" + id).kendoDropDownList({
                dataTextField: "Name",
                dataValueField: "Name",
                groupTemplate: "Group: #: data #",
                optionLabel: "-- Select --",
                template: '<span title = "#: Name #">#: Name #</span>',
                valueTemplate: '<span title = "#: Name #">#: Name #</span>',
                dataSource: {
                    data: data,
                    group: { field: "Type" }
                },
                select: function (e) {
                    debugger
                    var dataItem = e.dataItem;

                    var browser_version_id = e.sender.element.attr("data_versionId");

                    if (dataItem.Name === "") {
                        delete object_browser_version_viewport[browser_version_id];
                    } else {
                        object_browser_version_viewport[browser_version_id] = dataItem;
                    }
                }

            });




            if (object_browser_version_viewport.hasOwnProperty(versionId)) {
                $("#" + id).data("kendoDropDownList").value(object_browser_version_viewport[versionId].Name);
            }
        }




        function browserSubCategoryData(browserData) {
            debugger;

            var arrayOfGridData = [];

            for (var i = 0; i <= browserData.Total; i++) {

                var objectRow = new Object();
                objectRow = JSON.parse(objectBrowserAttribute);


                $.each(browserGuids, function (ind, obj) {
                    debugger;
                    if (selectedOperatingSystem[obj] !== undefined) {
                        if (selectedOperatingSystem[obj].Versions[i] !== undefined) {
                            objectRow[obj] = selectedOperatingSystem[obj].Versions[i];
                        } else {
                            objectRow[obj] = "";
                        }
                    }
                    else {
                        objectRow[obj] = "";
                    }

                });
                arrayOfGridData.push(objectRow);

            }
            return arrayOfGridData;
        }

        function BindBrowserSubCategory(gridColumn, gridData) {
            debugger;

            var dictionary_columns = {};

            $.each(gridColumn, function (ind, obj) {



                if (obj.title.toLowerCase().indexOf("chrome") != -1) {
                    dictionary_columns[0] = obj;
                }
                else if (obj.title.toLowerCase().indexOf("firefox") != -1) {
                    dictionary_columns[1] = obj;
                } else if (obj.title.toLowerCase().indexOf("msedge") != -1) {
                    dictionary_columns[2] = obj;
                }
                else if (obj.title.toLowerCase().indexOf("ie") != -1) {
                    dictionary_columns[3] = obj;
                } else if (obj.title.toLowerCase().indexOf("safari") != -1) {
                    dictionary_columns[4] = obj;
                }
                else {

                    var ind_dict = ind + 20;
                    dictionary_columns[ind_dict] = obj;
                }

            });


            console.log("dictionary_columns");
            console.log(dictionary_columns);



            var my_new_array_columns = [];


            $.each(dictionary_columns, function (ind, obj) {
                my_new_array_columns.push(obj);
            });



            $("#divGridBrowserSubCategory").html('');

            $("#divGridBrowserSubCategory").kendoGrid({
                dataSource: new kendo.data.DataSource({
                    data: gridData,
                }),
                selectable: "row",
                columns: my_new_array_columns,
                change: function (e) {
                    

                },
                editable: false,
                edit: function (e) {
                    
                },
                dataBound: function (e) {
                    

                    $(".selectVersion").unbind().bind("click", function () {

                        
                        var checkedState = this.checked;
                        var browserVersionId = $(this).attr("data-browserId");

                        if (checkedState) {
                            if (!selectedBrowserVersion.hasOwnProperty(browserVersionId)) {
                                selectedBrowserVersion[browserVersionId] = objectOfDeviceVersion[browserVersionId];
                            }
                        }
                        else {
                            delete selectedBrowserVersion[browserVersionId];
                            delete object_browser_version_resolution[browserVersionId];
                            delete object_browser_version_viewport[browserVersionId];

                            $("#ddl_resolution_" + browserVersionId).val("Select");


                            var ddlResolution = $("#ddl_resolution_" + browserVersionId).data("kendoDropDownList");
                            ddlResolution.select(0);


                            var ddlviewport = $("#ddl_viewport_" + browserVersionId).data("kendoDropDownList");
                            ddlviewport.select(0);

                        }

                    });


                    //$(".resolution_selection").unbind().bind("change", function () {
                    //    

                    //    var browser_version_id = $(this).attr("data_versionId");

                    //    var changed_resolution = $(this).val();


                    //    if (changed_resolution === "Select") {
                    //        delete object_browser_version_resolution[browser_version_id];
                    //    } else {
                    //        object_browser_version_resolution[browser_version_id] = changed_resolution;
                    //    }



                    //});




                },

            }).getKendoGrid();

            // This is very important 

            //var currentlyCheckedVersionInGrid = new Object();

            //var checkedVersion = $("#divGridBrowserSubCategory tr td .selectVersion:checked");

            //$.each(checkedVersion, function (ind, obj) {

            //    var checkedVersion = $(this).attr("data-browserid");

            //    if (selectedBrowserVersion.hasOwnProperty(checkedVersion)) {
            //        currentlyCheckedVersionInGrid[checkedVersion] = selectedBrowserVersion[checkedVersion]
            //    }


            //})

            //selectedBrowserVersion = new Object();

            //selectedBrowserVersion = currentlyCheckedVersionInGrid;




        }

        // Device Operation

        var objectOfDevice = new Object();

        var arrayOfPlatform = [];

        var selectedDeviceVersion = new Object();

        var pureAllStartPlatformObject = new Object();

        function GetMobileCombinations() {
            



            var ajax_url = empty;
            var ajax_data = {};

            if (execution_type === EnumExecutionType.Local) {
                ajax_url = opkey_end_point + "/Admin/GetMobileCombinations";
            } else if (execution_type === EnumExecutionType.Cloud) {
            }



            loadingStart(".selectTestBrowsers", "Please Wait ...", ".btnTestLoader");
            $.ajax({
                url: ajax_url,
                data: ajax_data,
                type: "POST",
                success: function (result) {

                    
                    loadingStop(".selectTestBrowsers", ".btnTestLoader");

                    objectOfDevice = new Object();
                    arrayOfPlatform = [];
                    pureAllStartPlatformObject = new Object();

                    $.each(result, function (ind, obj) {

                        var thePlatform = obj.Platform + obj.MobileDevice_Version;

                        var allStartKey = obj.Platform + obj.MobileDevice_Version + obj.MobileDevice_Name;

                        if (pureAllStartPlatformObject.hasOwnProperty(allStartKey)) {
                            return true;
                        }
                        else {
                            pureAllStartPlatformObject[allStartKey] = allStartKey;

                        }


                        var arrayOfMobileDevice = []

                        if (objectOfDevice.hasOwnProperty(thePlatform)) {
                            arrayOfMobileDevice = objectOfDevice[thePlatform];
                        }
                        else {
                            var objectPlatform = new Object();
                            objectPlatform["Platform"] = obj.Platform;
                            objectPlatform["PlatformVersion"] = obj.MobileDevice_Version;

                            arrayOfPlatform.push(objectPlatform);
                        }
                        arrayOfMobileDevice.push(obj)
                        objectOfDevice[thePlatform] = arrayOfMobileDevice;
                    });

                    $scope.DataGridPlatform.data(arrayOfPlatform);
                    if (arrayOfPlatform.length == 0) {
                        $('#divGridMobileDevice').addClass('Banner_NoDevice_Step')
                    }
                    else {
                        $('#divGridMobileDevice').removeClass('Banner_NoDevice_Step')
                    }

                },
                error: function (error) {
                    loadingStop(".selectTestBrowsers", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });
        };

        $scope.DataGridPlatform = new kendo.data.DataSource({
            data: null,
        });

        $scope.OptionsGridPlatform = {
            dataSource: $scope.DataGridPlatform,
            resizable: false,
            selectable: "row",
            columns: [
                {
                    field: "Platform", title: "Platform", template: function (e) {

                        return e.Platform + " " + e.PlatformVersion;
                    }
                },

            ],
            editable: false,
            dataBound: function (e) {
                
                var data = e.sender.dataSource.data();
                if (data.length != 0) {
                    e.sender.select("tr:eq(0)");
                }

            },
            edit: function (e) {
                $(e.container[0]).find('input').attr('aria-label', 'Enter Value');
            }
        };

        $scope.OnGridPlatformChange = function (data, dataItem, columns) {
            
            debugger;
            var platformKey = data["Platform"] + data["PlatformVersion"];
            var arrayOfDevices = objectOfDevice[platformKey];
            $scope.DataGridMobileDevice.data([]);
            $scope.DataGridMobileDevice.data(arrayOfDevices);

        }

        $scope.DataGridMobileDevice = new kendo.data.DataSource({
            data: null,
        });

        $scope.OptionsGridMobileDevice = {
            dataSource: $scope.DataGridMobileDevice,
            resizable: false,
            selectable: "row",
            columns: [
                {
                    field: "MobileDevice_Name", title: "Mobile Name", template: function (e) {

                        var checked = '';

                        if (selectedDeviceVersion.hasOwnProperty(e.MobileDevice_ID)) {
                            checked = 'checked="checked"'
                        }

                        var html = '';
                        html = html + '<input id="chkDevice_' + e.MobileDevice_ID + '"  class="selectMobileDevice" data-deviceId="' + e.MobileDevice_ID + '" ' + checked + ' type="checkbox">&nbsp;&nbsp;' + fakingAngularCharacter(e.MobileDevice_Name);
                        return html;
                    }
                },

            ],
            dataBound: function (e) {
                


                $(".selectMobileDevice").unbind().bind("click", function () {

                    
                    var checkedState = this.checked;

                    var mobileDeviceId = $(this).attr("data-deviceId")

                    var selectedTr = $(this).closest("tr");
                    var selectedRowData = formControlFactory.GetKendoGridRowDataByTr("divGridMobileDevice", selectedTr);
                    selectedRowData.IsSelected = checkedState;

                    if (checkedState) {
                        if (!selectedDeviceVersion.hasOwnProperty(mobileDeviceId)) {
                            selectedDeviceVersion[mobileDeviceId] = selectedRowData;
                        }
                    }
                    else {
                        delete selectedDeviceVersion[mobileDeviceId];
                    }



                });


            },
            edit: function (e) {
                $(e.container[0]).find('input').attr('aria-label', 'Enter Value');
            }
        };

        //Screen 3

        function sessionFormvalidator() {
            


            var txtSessionName = $("#txtSessionName").val();
            var txtBuildName = $("#ddlBuilds").val();

            if (txtSessionName.trim() === "") {
                serviceFactory.notifier($scope, 'Session Name is require', 'error');
                return false;
            }

            if (txtBuildName.trim() === "") {
                serviceFactory.notifier($scope, 'Please select a build', 'error');
                return false;
            }


            if (dataFactory.MultiBrowser_ExecutionType == EnumExecutionType.Local) {

                var ddlRegions = $('#ddlRegions').data('kendoDropDownList').value();
                var ddlBrowsers = $('#ddlBrowsers').data('kendoDropDownList').value();

                if (ddlRegions === "") {
                    serviceFactory.notifier($scope, 'Region is require', 'error');
                    return false;
                }
                if (ddlBrowsers === "") {
                    serviceFactory.notifier($scope, 'Browser is require', 'error');
                    return false;
                }

            }

            return true;
        }

        function TestCaseValidator() {
            
            var testCaseGridData = $("#divGridTestCase").data("kendoGrid").dataSource.data();
            if (testCaseGridData.length === 0) {
                serviceFactory.notifier($scope, 'Please select atleast one test case', 'error');
                return false;
            }
            return true;
        }

        function browserDeviceValidator() {


            if (selectedExecutionMode === EnumExecutionMode.Web) {

                if ($.isEmptyObject(selectedBrowserVersion)) {
                    serviceFactory.notifier($scope, 'Please select atleast one browser', 'error');
                    return false;
                }
            }
            else {

                if ($.isEmptyObject(selectedDeviceVersion)) {
                    serviceFactory.notifier($scope, 'Please select atleast one device', 'error');
                    return false;
                }

            }

            return true;
        }

        var isCompatibeError = false;

        function loadWindow_Summary() {
            

            var objectExecution = new Object();

            objectExecution = getExecutionObjectBinding();

            loadingStart("#divGridSessionSummary", "Please Wait ...", ".btnTest");
            $.ajax({
                url: opkey_end_point + "/MultiBrowser/checkAgentCapability",
                type: "Post",
                data: { batchSessionData: JSON.stringify(objectExecution) },
                success: function (result) {
                    
                    loadingStop("#divGridSessionSummary", ".btnTest");

                    var dictionaryOfBrowser = new Object();

                    $.each(result.Browsers, function (ind, obj) {
                        isCompatibeError = true;
                        var browserKey = obj.OS_Name + obj.OS_Version + obj.Browser_Name + obj.Browser_Version;
                        dictionaryOfBrowser[browserKey] = browserKey;

                    });

                    var dictionaryOfDevice = new Object();

                    $.each(result.Devices, function (ind, obj) {
                        isCompatibeError = true;
                        var deviceKey = obj.Platform + obj.MobileDevice_Version + obj.MobileDevice_Name;
                        dictionaryOfDevice[deviceKey] = deviceKey;

                    });

                    var arraySummaryGrid = [];

                    if (selectedExecutionMode === EnumExecutionMode.Web) {

                        $.each(selectedBrowserVersion, function (ind, obj) {
                            
                            var objectGridSummaryRow = new Object();
                            var browserKey = obj.OS_Name + obj.OS_Version + obj.Browser_Name + obj.Browser_Version;

                            objectGridSummaryRow["Type"] = "Browser";
                            objectGridSummaryRow["SessionName"] = $("#txtSessionName").val();
                            objectGridSummaryRow["Category"] = obj.OS_Name + " " + obj.OS_Version;
                            objectGridSummaryRow["SubCategory"] = obj.Browser_Name + " " + obj.Browser_Version;
                            objectGridSummaryRow["Id"] = obj.Browser_Version_ID;

                            objectGridSummaryRow["Resolution"] = empty;
                            objectGridSummaryRow["ViewPort"] = empty;

                            if (object_browser_version_resolution.hasOwnProperty(obj.Browser_Version_ID)) {
                                objectGridSummaryRow["Resolution"] = object_browser_version_resolution[obj.Browser_Version_ID];
                            }

                            if (object_browser_version_viewport.hasOwnProperty(obj.Browser_Version_ID)) {
                                objectGridSummaryRow["ViewPort"] = object_browser_version_viewport[obj.Browser_Version_ID];
                            }
                            objectGridSummaryRow["Error"] = false;
                            if (dictionaryOfBrowser.hasOwnProperty(browserKey)) {
                                objectGridSummaryRow["Error"] = true;
                            }

                            arraySummaryGrid.push(objectGridSummaryRow);

                        });

                    }
                    else {

                        $.each(selectedDeviceVersion, function (ind, obj) {
                            var deviceKey = obj.Platform + obj.MobileDevice_Version + obj.MobileDevice_Name;
                            var objectGridSummaryRow = new Object();

                            objectGridSummaryRow["Type"] = "Browser";
                            objectGridSummaryRow["SessionName"] = $("#txtSessionName").val();
                            objectGridSummaryRow["Category"] = obj.Platform + " " + obj.MobileDevice_Version;
                            objectGridSummaryRow["SubCategory"] = obj.MobileDevice_Name;
                            objectGridSummaryRow["Id"] = obj.MobileDevice_ID;

                            objectGridSummaryRow["Error"] = false;
                            if (dictionaryOfDevice.hasOwnProperty(deviceKey)) {
                                objectGridSummaryRow["Error"] = true;
                            }

                            arraySummaryGrid.push(objectGridSummaryRow);
                        });

                    }

                    $scope.DataGridSessionSummary.data(arraySummaryGrid);

                    var msg = "Total selected browser combinations (browser) :  " + arraySummaryGrid.length;

                    if (selectedExecutionMode === EnumExecutionMode.Mobile) {
                        msg = "Total selected device combinations (device) :  " + arraySummaryGrid.length;
                    }

                    $("#spSummaryTagLine").text(msg);


                    $(".btn_Action").bury(true);
                    $(".panelselectTabJob").bury(true);

                    $("#div_selection_summary").bury(false);
                    $("#btAction_Summary_Back").bury(false);
                    $("#btAction_Summary_Next").bury(false);

                },
                error: function (error) {
                    loadingStop("#divGridSessionSummary", ".btnTest");
                    serviceFactory.showError($scope, error);
                }
            });

        }

        $scope.DataGridSessionSummary = new kendo.data.DataSource({
            data: null,
        });

        $scope.OptionsGridSessionSummary = {
            dataSource: $scope.DataGridSessionSummary,
            resizable: false,
            selectable: "row",
            columns: [
                { field: "SessionName", title: "Test" },
                { field: "Category", title: "Platform" },
                { field: "SubCategory", title: "Browser/Device", width: "150px", },
                { field: "Resolution", title: "System Resolution", width: "150px", headerTemplate: '<span title="SystemResolution">SystemResolution</span>', template: function (e) {  if (e.Resolution != undefined && e.Resolution != '') { return e.Resolution.Name } else { return 'NA' } } },
                { field: "ViewPort", title: "Browser Viewport", width: "150px", headerTemplate: '<span title="BrowserViewport">BrowserViewport</span>', template: function (e) {  if (e.ViewPort != undefined && e.ViewPort != '') { return e.ViewPort.Name } else { return 'NA' } } },
                {
                    width: "40px", template: function (e) {

                        var html = '';
                        html = html + '<a href="Javascript:void(0)" ng-click="DeleteEntry()" class="queue-delete" title="Delete"><i class="fa fa-trash fa-lg colorRed"></i></a>';

                        html = html + '';

                        return html;
                    }
                },

            ],
            editable: false,
            dataBound: function (e) {
                

            },
            edit: function (e) {
                $(e.container[0]).find('input').attr('aria-label', 'Enter Value');
            }
        };

        $scope.DeleteEntry = function () {
            

            var selectedItem = this.dataItem;

            $.msgBox({
                title: "Delete",
                content: "Are you sure want to delete this step ?",
                modal: true,
                type: "confirm",
                buttons: [{ value: "ok" }, { value: "Cancel" }],
                success: function (status) {
                    if (status == "ok") {
                        

                        if (selectedExecutionMode === EnumExecutionMode.Web) {
                            delete selectedBrowserVersion[selectedItem.Id];
                            $("#chkBrowser_" + selectedItem.Id).prop("checked", false);
                        }
                        else {
                            delete selectedDeviceVersion[selectedItem.Id];
                            $("#chkDevice_" + selectedItem.Id).prop("checked", false);
                        }

                        var kendoGridSessionSummary = formControlFactory.GetKendoGrid("divGridSessionSummary");
                        kendoGridSessionSummary.dataSource.remove(selectedItem);


                        var msg = "Total selected combinations (browser) :  " + kendoGridSessionSummary.dataSource.data().length;

                        if (selectedExecutionMode === EnumExecutionMode.Mobile) {
                            msg = "Total selected combinations (device) :  " + kendoGridSessionSummary.dataSource.data().length;
                        }

                        $("#spSummaryTagLine").text(msg);

                        if (kendoGridSessionSummary.dataSource.data().length === 0) {
                            $(".actionExecute").bury(true);



                            $("#btTabBrowserDevice").removeClass("MB_CS_Step_icon");
                            $("#btTabBrowserDevice").removeClass("MB_CS_Step_icon_step");
                            $("#btTabBrowserDevice").removeClass("MB_CS_Step_icon_step_complete");
                            $("#btTabBrowserDevice").addClass("MB_CS_Step_icon");

                        }
                        else {
                            $(".actionExecute").bury(false);

                        }

                    }
                }

            });




        }

        $scope.ScheduleBatch = function () {
            

            var formValidator = sessionFormvalidator();
            if (!formValidator) {
                return false;
            }

            var formValidatorTestCase = TestCaseValidator();
            if (!formValidatorTestCase) {
                return false;
            }

            var formValidatorBrowserDevice = browserDeviceValidator();
            if (!formValidatorBrowserDevice) {
                return false;
            }
            dataFactory.SelectedCURDType = EnumCURDType.Create;
            $rootScope.ModalScope.OpenModalScheduleBatchTime();

        }

        $scope.NextTestCase = function () {
            
            pureAllStartBrowserObject = [];
            pureAllStartPlatformObject = [];
            $("#btTabBrowserDevice")[0].click();
        }

        $scope.BackBrowserDevice = function () {
            
            $("#btTabTestCase")[0].click();
        }

        $scope.NextBrowserDevice = function () {
            
            $("#btTabSummary")[0].click();
        }

        $scope.BackSummary = function () {
            
            $("#btTabBrowserDevice")[0].click();
        }

        $scope.QueueBatch = function (modeType) {
            


            var formValidator = sessionFormvalidator();
            if (!formValidator) {
                return false;
            }

            var formValidatorTestCase = TestCaseValidator();
            if (!formValidatorTestCase) {
                return false;
            }

            var formValidatorBrowserDevice = browserDeviceValidator();
            if (!formValidatorBrowserDevice) {
                return false;
            }


            var startDate = "";
            var startTime = "";
            var timeZone = "";



            if ($scope.ToBeSaveDate !== "") {
                startDate = $scope.ToBeSaveDate;
                startTime = $scope.ToBeSaveTime;
                timeZone = $scope.ToBeSaveTimeZone;
            }

            queueScheduleBatch(modeType, startDate, startTime, timeZone);

        }

        function getExecutionObjectBinding() {
            debugger

            var objectExecution = new Object();
            objectExecution["Batch_ID"] == selectedbatchId;
            objectExecution["BatchName"] = $("#txtSessionName").val();
            objectExecution["BuildName"] = $("#ddlBuilds").val();
            objectExecution["ExecutionType"] = selectedExecutionMode;
            objectExecution["DefaultPlugin_ID"] = selectedPluginId;
            objectExecution["Agent_ID"] = dataFactory.AdvanceSettingAgentId;
            objectExecution["StartTime"] = "";



            var suiteData = $("#divGridTestCase").data("kendoGrid").dataSource.data();

            var arrayOFTestCase = [];

            $.each(suiteData, function (ind, obj) {

                var objTestCase = new Object();
                objTestCase["ArtifactType"] = obj.ArtifactType;
                objTestCase["ArtifactID"] = obj.ArtifactID;
                objTestCase["ArtifactName"] = obj.ArtifactName;
                objTestCase["DataSheetID"] = obj.DataSheetID;
                objTestCase["DataSheetName"] = obj.DataSheetName;
                objTestCase["Position"] = ind;
                arrayOFTestCase.push(objTestCase);

            });


            var arrayOfBrowsers = [];

            $.each(selectedBrowserVersion, function (ind, obj) {
                
                var selected_browser_binding = obj;

                var Custom_ResolutionObj = {};


                if (object_browser_version_resolution.hasOwnProperty(selected_browser_binding.Browser_Version_ID)) {
                    Custom_ResolutionObj["MachineResolution"] = object_browser_version_resolution[selected_browser_binding.Browser_Version_ID];
                } 

                if (object_browser_version_viewport.hasOwnProperty(selected_browser_binding.Browser_Version_ID)) {
                    Custom_ResolutionObj["BrowserViewPort"] = object_browser_version_viewport[selected_browser_binding.Browser_Version_ID];
                }

                obj['SelectedResolutions'] = Custom_ResolutionObj;

                if (dataFactory.MultiBrowser_ExecutionType === EnumExecutionType.Cloud) {
                    obj["BrowserProvider"] = "BrowserCloudOfPCloudy";
                } else {
                    obj["BrowserProvider"] = "NetworkBrowserRegisteredInDB";
                }


                arrayOfBrowsers.push(selected_browser_binding);

            });

            var arrayOfDevice = [];

            $.each(selectedDeviceVersion, function (ind, obj) {
                arrayOfDevice.push(selectedDeviceVersion[ind]);
            });



            objectExecution["SuiteArtifacts"] = arrayOFTestCase;
            objectExecution["Browsers"] = arrayOfBrowsers;
            objectExecution["MobileDevices"] = arrayOfDevice;

            var LocalExecutionUserSettingsBinding = new Object();

            if (dataFactory.TempDataOfExecutionSessionSettings !== null) {

                LocalExecutionUserSettingsBinding = dataFactory.TempDataOfExecutionSessionSettings;
                LocalExecutionUserSettingsBinding["SessionTags"] = dataFactory.TempDataOfExecutionTagSettings;
                LocalExecutionUserSettingsBinding["GlobalVariablesBinding"] = dataFactory.TempDataOfExecutionGlobalSettings;

            }
            else {
                LocalExecutionUserSettingsBinding = dataFactory.TempDataOfExecutionSettings;
                LocalExecutionUserSettingsBinding["SessionTags"] = [];
                LocalExecutionUserSettingsBinding["GlobalVariablesBinding"] = [];
            }

            LocalExecutionUserSettingsBinding["SmtpSettings"] = dataFactory.TempDataOfSmtpSettings;
            LocalExecutionUserSettingsBinding["AgentID"] = selectedAgentId;
            LocalExecutionUserSettingsBinding["PluginID"] = selectedPluginId;
            LocalExecutionUserSettingsBinding["F_ID"] = dataFactory.EmptyGuid;
            LocalExecutionUserSettingsBinding["ReportId"] = dataFactory.EmptyGuid;
            LocalExecutionUserSettingsBinding["IsRememberExecutionSettings"] = true;
            LocalExecutionUserSettingsBinding["BuildName"] = $("#ddlBuilds").val();

            objectExecution["LocalExecutionUserSettingsBinding"] = LocalExecutionUserSettingsBinding;
            objectExecution.LocalExecutionUserSettingsBinding["SessionInitiatedBy"] = "OpKeyOnChrome";

            return objectExecution;

        }

        function queueScheduleBatch(modeType, startDate, startTime, timeZone) {

            

            var objectExecution = new Object();
            objectExecution = getExecutionObjectBinding(modeType);
            objectExecution["QueueType"] = modeType;
            objectExecution["ScheduleDate"] = startDate;
            objectExecution["ScheduleTime"] = startTime;
            objectExecution["SelectedTimeZone"] = timeZone;



            if (dataFactory.MultiBrowser_ExecutionType === EnumExecutionType.Cloud) {
                objectExecution["browserCloudCredentials"] = dataFactory.Response_pcloudy_credentials;
            }




            if (dataFactory.AdvanceSettingAgentId === dataFactory.EmptyGuid) {
                CreateBatchSession(modeType, objectExecution);
                return false;
            }


            if (!isCompatibeError) {
                CreateBatchSession(modeType, objectExecution);
            }
            else {
                $.msgBox({
                    title: "Delete",
                    content: "Some of your selected combinations are not compatible as per your selected agent.<br> Are you sure you want to continue?",
                    modal: true,
                    type: "confirm",
                    buttons: [{ value: "Yes" }, { value: "No" }],
                    success: function (status) {
                        if (status == "Yes") {
                            
                            //objectExecution["Agent_ID"] = dataFactory.EmptyGuid;
                            CreateBatchSession(modeType, objectExecution);

                        }
                    }

                });
            }


        }

        function CreateBatchSession(modeType, objectExecution) {

            loadingStart("#divGridSessionSummary", "Please Wait ...", ".btn");
            $.ajax({
                url: opkey_end_point + "/MultiBrowser/CreateBatchSession",
                type: "Post",
                data: {
                    batchSessionData: JSON.stringify(objectExecution)
                },
                success: function (result) {
                    loadingStop("#divGridSessionSummary", ".btn");

                    var successMessage = "Session queued successfully";




                    if (dataFactory.SelectedCURDType === EnumCURDType.Update) {

                        if (modeType === EnumQueueMode.Scheduled) {
                            successMessage = "Session schedule successfully";
                        }

                        serviceFactory.notifier($scope, successMessage, 'success');
                        $("#img--RequestJob_00000000-0000-0000-0000-000000000001").click();
                    }
                    else {

                        if (modeType === EnumQueueMode.Scheduled) {
                            successMessage = "Scheduled session details updated successfully";
                            setTimeout(function () {
                                $rootScope.ModalScope.ModalInstanceScheduleBatchTime.close(true);
                            }, 1);
                        }
                        else {
                            successMessage = "Queued session details updated successfully";
                        }


                        serviceFactory.notifier($scope, successMessage, 'success');
                        $("#img--RequestJob_00000000-0000-0000-0000-000000000001").click();
                    }


                    $(".btn_Action").bury(true);
                    $(".panelselectTabJob").bury(true);
                    $("#div_select_execution_summary").bury(false);
                    $("#btAction_View_Queued_Sessions").bury(false);


                },
                error: function (error) {
                    loadingStop("#divGridSessionSummary", ".btn");

                    serviceFactory.showError($scope, error);
                }

            });


        }


        //*******************************************************region Spock Work********************************//

        var objSpockInterval, customSpockToken;

        function tokenGenerator() {
            var token = "";
            var stringLength = 5;
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < stringLength; i++)
                token += possible.charAt(Math.floor(Math.random() * possible.length));

            return token;
        }

        function fakeLoaderOpen_Spock() {
            
            $('#divFakeLoaderForAgentSpock').show();
        }

        function fakeLoaderClose_Spock() {
            
            $('#divFakeLoaderForAgentSpock').hide();
        }

        function getEnvironmentType(spockToken) {
            fakeLoaderOpen_Spock();
            $.ajax({
                url: opkey_end_point + "/Execution/GetEnvironmentName",
                type: "get",
                success: function (environmentType) {
                    
                    var spockArgument = environmentType + "_" + spockToken + "@#@" + opkey_end_point;
                    customSpockToken = environmentType + "_" + spockToken;
                    var uri = "OpKeyTeleportingTunnel:" + btoa(spockArgument);
                    window.protocolCheck(uri, function () {
                        serviceFactory.notifier($scope, "Please invoke the downloaded jar and then finish your Execution.", 'Info');
                        downloadSSHClient(spockArgument);
                        startIntervalSpockStatus();

                    }, function () {
                        
                        startIntervalSpockStatus();

                    });

                },
                error: function (error) {
                    
                    fakeLoaderClose_Spock();
                }
            });
        }

        function startIntervalSpockStatus() {
            
            objSpockInterval = setInterval(getSpockStatus, 3500);

            //If user perform nothing clear Interval.
            setTimeout(function () { endIntervalSpockStatus(); }, 300000);
        }

        function endIntervalSpockStatus() {
            
            clearInterval(objSpockInterval);
            fakeLoaderClose_Spock();
        }

        function getSpockStatus() {
            $.ajax({
                url: opkey_end_point + "/SpockAgentApi/GetTokenStatus",
                type: "get",
                data: { token: customSpockToken },
                success: function (status) {
                    
                    if (status == "Awake") {
                        endIntervalSpockStatus();
                        loadingStart("#div_select_test_cases", "Please Wait ...", ".btnTestLoader");
                        Execute_Local_Inner();
                    }

                },
                error: function (error) {
                    
                    endIntervalSpockStatus();
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function downloadSSHClient(spockArgument) {
            
            window.location = opkey_end_point + '/Execution/GetSSHClientJar?fileName=OpkeyTeleportingTunnelUtility_' + btoa(spockArgument) + '.jar';
        }

        $scope.closeAgentSpockLoader = function () {
            
            fakeLoaderClose_Spock();
            clearInterval(objSpockInterval);
        };

        function create_ddl_spock_region() {
            

            $("#ddlRegions").kendoDropDownList({
                dataSource: [],
                index: 0,
                close: function (e) {
                }
            });

        }

        function create_ddl_spock_browser() {
            

            var isPlatformWindows = (navigator.platform.indexOf('Win') == -1) ? false : true;

            $("#ddlBrowsers").kendoDropDownList({
                dataSource: (isPlatformWindows ? browsers_window : browsers_mac),
                index: 0,
                valueTemplate: '<i class="k-PopupSprite SVG_#:data#"></i> #:data#',
                template: '<span class="k-state-default"><i class="k-PopupSprite SVG_#:data#"></i> #: data #</span>',
                close: function (e) {
                }
            });

        }

        function getAgentSpockRegions() {
            
            $.ajax({
                url: opkey_end_point + "/Execution/GetAgentSpockRegions",
                type: "Get",
                success: function (result) {
                    $("#ddlRegions").data("kendoDropDownList").setDataSource(result);

                    $("#ddlRegions").data("kendoDropDownList").value(result[0]);
                },
                error: function (error) {

                    serviceFactory.showError($scope, error);
                }
            });

        }

        $scope.Execute_Local = function () {

            var formValidator = sessionFormvalidator();
            if (!formValidator) {
                return false;
            }

            var formValidatorTestCase = TestCaseValidator();
            if (!formValidatorTestCase) {
                return false;
            }

            var spockToken = tokenGenerator();
            getEnvironmentType(spockToken);

        }

        function create_execution_object() {
            debugger

            var divGridTestCase = $("#divGridTestCase").data("kendoGrid").dataSource.data();

            var array_testcases = [];

            $.each(divGridTestCase, function (ind, obj) {
                
                var objTestCase = new Object();
                objTestCase["DB_ID"] = obj.ArtifactID;
                objTestCase["DSheet_ID"] = obj.DataSheetID;
                array_testcases.push(objTestCase);

            });


            var object_execution_binding = new Object();




            if (dataFactory.TempDataOfExecutionSessionSettings !== null) {

                object_execution_binding = dataFactory.TempDataOfExecutionSessionSettings;
                object_execution_binding["SessionTags"] = dataFactory.TempDataOfExecutionTagSettings;
                object_execution_binding["GlobalVariablesBinding"] = dataFactory.TempDataOfExecutionGlobalSettings;

            }
            else {
                object_execution_binding = dataFactory.TempDataOfExecutionSettings;
                object_execution_binding["SessionTags"] = [];
                object_execution_binding["GlobalVariablesBinding"] = [];
            }

            object_execution_binding["SmtpSettings"] = dataFactory.TempDataOfSmtpSettings;
            object_execution_binding["AgentID"] = spock_agent_id;
            object_execution_binding["spockAgentClientID"] = spock_agent_id;
            object_execution_binding["PluginID"] = selectedPluginId;
            object_execution_binding["F_ID"] = dataFactory.EmptyGuid;
            object_execution_binding["ReportId"] = dataFactory.EmptyGuid;
            object_execution_binding["OctaneSuiteId"] = dataFactory.EmptyGuid;
            object_execution_binding["OctaneManualTestID"] = dataFactory.EmptyGuid;
            object_execution_binding["TestCycleId"] = dataFactory.EmptyGuid;


            object_execution_binding.UserOptedToQueue = false;
            object_execution_binding.UserAllowedKeywordVersionMismatch = true;
            object_execution_binding.Region = $('#ddlRegions').data('kendoDropDownList').value();
            object_execution_binding.SpockAgentBrowser_ENUM = $('#ddlBrowsers').data('kendoDropDownList').value();

            object_execution_binding["SessionName"] = $("#txtSessionName").val();
            object_execution_binding["BuildName"] = $("#ddlBuilds").val();
            object_execution_binding["RuntimeContinueOnError"] = "ALL";
            //
            var object_execution = new Object();

            object_execution["execution_binding"] = object_execution_binding;
            object_execution["test_cases"] = array_testcases;

            return object_execution;

        }

        function Execute_Local_Inner() {
            debugger;
            var object_execution = create_execution_object();


            $.ajax({
                url: opkey_end_point + "/Execution/RunNowFlowBP_Group",
                type: "Post",
                data: {
                    strFlowBpGrpDetails: JSON.stringify(object_execution.test_cases),
                    strExecutionSettings: JSON.stringify(object_execution.execution_binding),
                    QueueSessionType: "MultiBrowser",
                    sessionInitiationType:"OpKeyOnChrome"
                },
                success: function (result) {
                    
                    dataFactory.local_Exection_SessionId = result;
                    //$(".btn_Action").bury(true);
                    //$(".panelselectTabJob").bury(true);
                    //$('#div_select_Local_execution_summary').bury(false);
                    //$('#btAction_View_All_Sessions').bury(false);
                    updateArgsRedisServer(result);
                },
                error: function (error) {
                    loadingStop("#div_select_test_cases", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function updateArgsRedisServer(sessionId) {
            debugger
            // console.log("$('#ddlBrowsers').data('kendoDropDownList').value()", $('#ddlBrowsers').data('kendoDropDownList').value());
            $.ajax({
                url: opkey_end_point + "/SpockAgentApi/PutArgJson",
                type: "GET",
                data: { session_Id: sessionId, token: customSpockToken, userName: current_user.UserName, apiKey: current_user.ApiKey, Domain: opkey_end_point, browser: $('#ddlBrowsers').data('kendoDropDownList').value(), cloudType: 'NotCloud' },
                success: function (result) {
                    
                    loadingStop("#div_select_test_cases", ".btnTestLoader");
                    getCurrentSessionDtoById(sessionId);
                }, error: function (error) {
                    
                    loadingStop("#div_select_test_cases", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function getCurrentSessionDtoById(sessionId) {
            
            $.ajax({
                url: opkey_end_point + "/Multibrowser/GetSessionDataById",
                type: "GET",
                data: { sessionId: sessionId },
                success: function (result) {
                    
                    loadingStop("#div_select_test_cases", ".btnTestLoader");

                    dataFactory.Selected_Execution_Node = result;
                    dataFactory.Select_live_Window = "Log";
                    $scope.ChangePageView('result.live_session');



                }, error: function (error) {
                    
                    loadingStop("#div_select_test_cases", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });
        }
    }]);

