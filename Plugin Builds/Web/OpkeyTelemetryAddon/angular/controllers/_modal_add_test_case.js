
angular.module('myApp').controller("add_test_case_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory) {

        var opkey_end_point =  $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

      
        $scope.OnModalLoad = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divModalElement", OnModalLoad);
        };


        function OnModalLoad() {
            $scope.InitializeTree("divTreeWeb", "txtTreeWebSearch");
            $scope.InitializeTree("divTreeAccelerator", "txtTreeAcceleratorSearch");
            $scope.GetJSTreeNodes();
            $scope.GetAllLabelsWithJobs();
        }

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
            debugger;

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
                    //debugger;

                }),

                $('#' + divTree).on('delete_node.jstree', function (e, data) {


                }),

                $('#' + divTree).on('refresh.jstree', function (e, data) {
                }),

                $('#' + divTree).on("click", ".jstree-anchor", function (e, data) {
                    debugger;
                    e.preventDefault();
                }),

                $('#' + divTree).on('hover_node.jstree', function (e, data) {

                    var $node = $("#" + divTree + " ul li[id=" + data.node.id + "]");

                    var nodeText = DOMPurify.sanitize(data.node.text);

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
                        debugger;
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
                    //debugger;
                    var $node = $("#" + divTree + " ul li[id=" + data.node.id + "]");
                    $('.hover_node_button_wrapper').closest('a').css('padding-right', '0');
                    $node.parent().find(".hover_node_button_wrapper").remove();
                    //$node.find('a').removeClass('jstree-clicked');
                });

            $('#' + divTree).on('contextmenu', '.jstree-anchor', function (e, data) {
            });


            // On Enter Key Search 
            // $('#' + txtSearchTree).bind('keyup', function (e) {
            //     debugger;
            //     var searchValue = $('#' + txtSearchTree).val();
            //     $('#' + divTree).jstree(true).search(searchValue);
            // });
            // bind depericated on jquery 3
            $('#' + txtSearchTree).on('keyup', function (e) {
                var searchValue = $(this).val();
                $('#' + divTree).jstree(true).search(searchValue);
            });
            

            $rootScope.Scope_Main.restrictSpecialCharacterInTreeNodeText(divTree);

        };

        $scope.ClearSearchResultTree = function (call) {
            debugger;

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
            debugger;
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
            $(".platformPanel").bury(true);
            $(".searchPanel").bury(true);
            if (platFormId === "btPlatformWeb") {
                $("#" + platFormId).addClass("active");
                $("#divTreeWeb").bury(false);
                $("#divSearchWeb").bury(false);
            }
            else if (platFormId === "btPlatformAccelerator") {
                $("#" + platFormId).addClass("active");
                $("#divSearchAccelerator").bury(false);
                $("#divTreeAccelerator").bury(false);
            }
            else {
                console.log("Not Implemented")
            }

        }


        $scope.AddArtifact = function (nodeData) {
            debugger;
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


            loadingStart("#divPanelParent", "Please Wait ...", ".btnTest");
            $.ajax({
                url: opkey_end_point + ajaxUrl,
                type: "Post",
                data: ajaxData,
                success: function (result) {
                    loadingStop("#divPanelParent", ".btnTest");
                    AfterSuccessData(result, nodeData);
                },
                error: function (error) {
                    loadingStop("#divPanelParent", ".btnTest");
                    serviceFactory.showError($scope, error);
                }

            });
        }

        function AfterSuccessData(result, nodeData) {
            debugger;

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
            serviceFactory.notifier($scope, 'Artifact added successfully', 'success');

        }
    }]);




