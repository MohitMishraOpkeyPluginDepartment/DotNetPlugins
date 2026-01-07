
angular.module('myApp').controller("result_queued_sessions_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory) {

        var opkey_end_point =  $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        var EnumQueuedSessionStatus = { Scheduled: "Scheduled", Running: "Running", Finished: "Finished" };

        var sub_gridID = null;

        $scope.Load_Sub_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_Sub_View", Load_Sub_View);
        };

        function Load_Sub_View() {
            create_html_queued_session();
            getAllQueuedBatch();
            GetMultibrowserAuditTrails();
        }

        $scope.open_internal_tab = function (type) {
            debugger;

            $(".panel_toolbar_queued_sessions").bury(true);
            $(".panel_grid_queued_sessions").bury(true);

            $("#div_panel_toolbar_" + type).bury(false);
            $("#div_panel_" + type).bury(false);

            if (type === "queued_user") {
            } else if (type === "audit_trail") {


            } else {


            }
        }

        function getAllQueuedBatch() {

            var clientTimeZone = getTimezoneName();
            loadingStart('#divGridQueuedBatch', "Please Wait ...", ".btnTestLoader");          //SAS-7919
            $.ajax({
                url: opkey_end_point + "/MultiBrowser/GetAllBatchSessions",
                data: { Type: EnumQueueMode.Queued, timeZone: clientTimeZone },
                type: "GET",
                success: function (result) {
                    loadingStop('#divGridQueuedBatch', ".btnTestLoader");

                    var kendo_grid = formControlFactory.GetKendoGrid("divGridQueuedBatch");
                    formControlFactory.BindKendoGridData(kendo_grid, result);


                },
                error: function (error) {
                    loadingStop('#divGridQueuedBatch', ".btnTestLoader");              //SAS-7919
                    serviceFactory.showError($scope, error);
                }


            });

        }

        $scope.OnSearchQueuedBatch = function () {
            var value = $("#txtClearQueuedBatch").val();
            $("#divGridQueuedBatch").data("kendoGrid").dataSource.filter({
                logic: "or",
                filters: [
                    { field: "Build_Name", operator: "contains", value: value },
                    { field: "Batch_Name", operator: "contains", value: value },
                    { field: "StartTime", operator: "contains", value: value },
                    { field: "StartTimeZone", operator: "contains", value: value },
                    { field: "Status", operator: "contains", value: value },
                    { field: "Execution_Type", operator: "contains", value: value },


                ]
            });
        };

        $scope.ClearSearchQueuedBatchResult = function () {
            $('#txtClearQueuedBatch').val('');
            $scope.OnSearchQueuedBatch();
        };

        $scope.RefreshScheduledBatch = function () {
            debugger;
            $scope.ClearSearchQueuedBatchResult();
            getAllQueuedBatch();
        }

        function delete_session_inner(arrayOfSession) {
            debugger;
            $.msgBox({
                title: "Delete",
                content: "Are you sure want to delete this Batch ?",
                modal: true,
                type: "confirm",
                buttons: [{ value: "Yes" }, { value: "No" }],
                success: function (result) {
                    debugger;


                    if (result == "Yes") {

                        loadingStart($('#divDynamicKendoWindow').parent(), "Please Wait ...", ".btnTestLoader");
                        $.ajax({
                            url: opkey_end_point + "/MultiBrowser/DeleteBatchSession",
                            data: { batchSessionIds: arrayOfSession },
                            type: "Post",
                            success: function (result) {
                                loadingStop($('#divDynamicKendoWindow').parent(), ".btnTestLoader");
                                $scope.RefreshScheduledBatch();
                                serviceFactory.notifier($scope, "Session deleted successfully!!", "success");
                            },
                            error: function (error) {
                                loadingStop($('#divDynamicKendoWindow').parent(), ".btnTestLoader");
                                serviceFactory.showError($scope, error);
                            }
                        });


                    } else {

                    }
                }

            });
        }

        function create_html_queued_session() {


            var datasource_queued_sessions = new kendo.data.DataSource({
                data: [],
            });

            $("#divGridQueuedBatch").kendoGrid({
                dataSource: datasource_queued_sessions,
                resizable: false,
                sortable: true,
                detailInit: initiaize_grid_sub,
                //  detailTemplate: html,
                detailExpand: function (e) {
                    e.sender.tbody.find('.k-detail-row').each(function (idx, item) {
                        if (item !== e.detailRow[0]) {
                            e.sender.collapseRow($(item).prev());
                        }
                    });
                    sub_gridID = e.detailRow.find('[data-role="grid"]').attr('id');

                },
                columns: [
                    {
                        headerTemplate: '<input aria-label="input" type="checkbox"  class="chkAllBatch"/>',
                        template: function (e) {
                            var html = '';
                            if (e.Status !== EnumQueuedSessionStatus.Running) {
                                html = html + '<input type="checkbox" aria-label="input"  class="chkSelectedBatch"/>'
                            }
                            return html;
                        }, width: "30px"
                    },
                    { field: "Build_Name", title: "Build", template: function (e) { return createCoulumnTitle(e.Build_Name) } },
                    { field: "Batch_Name", title: "Session", template: function (e) { return createCoulumnTitle(e.Batch_Name) } },
                    { field: "StartTime ", title: "StartTime ", template: function (e) { return createCoulumnTitle(e.StartTime) } },
                    {
                        field: "Status", title: "Status", template: function (e) {
                            if (e.Status === "Scheduled") {
                                e.Status = "Queued"
                            }
                            return createCoulumnTitle(e.Status)

                        }, width: "100px"
                    },
                    {
                        title: 'Actions',
                        template: function (e) {
                            var html = "";
                            if (e.Status !== EnumQueuedSessionStatus.Running) {
                                html = html + '<a href="Javascript:void(0)" class="queue-delete delete_queued_session"><i class="fa fa-trash fa-lg colorRed" title="Delete file"></i></a>';
                            }
                            return html;
                        },
                        width: "80px",
                        sortable: false
                    }
                ],
                dataBound: function (e) {

                    $('.delete_queued_session').unbind().click(function (e) {
                        debugger;

                        var kendo_grid = formControlFactory.GetKendoGrid("divGridQueuedBatch");
                        var kendo_grid_row_data = kendo_grid.dataItem($(this).closest('tr'));


                        if (kendo_grid_row_data.Status !== "Queued") {
                            serviceFactory.notifier($scope, "Session cannot be deleted when status is in 'Running or Finished' state.", "warning");
                            return false;
                        }


                        delete_session_inner(kendo_grid_row_data.Queued_Batch_ID);
                    });


                    $('.chkAllBatch').click(function (e) {
                        debugger;
                        $("#divGridQueuedBatch .chkSelectedBatch").prop("checked", e.currentTarget.checked);
                        if (sub_gridID!=null && $("#" + sub_gridID).data('kendoGrid') != undefined) {
                            $('#' + sub_gridID + ' .chkAllCombination').prop("checked", e.currentTarget.checked);
                            $('#' + sub_gridID + ' .chkSelectedCombination').prop("checked", e.currentTarget.checked);
                        }
                    });

                    $('.chkSelectedBatch').click(function (e) {
                        var kendo_grid = formControlFactory.GetKendoGrid("divGridQueuedBatch");
                        var kendo_grid_row_data = kendo_grid.dataItem($(this).closest('tr'));
                        $scope.SelectBatch(kendo_grid_row_data,e);
                    });

                    var checkedArtifact = $("#divGridQueuedBatch .chkSelectedBatch:checked").length;
                    var kendoGridTestCase = formControlFactory.GetKendoGrid("divGridQueuedBatch");
                    var totalArtifact = kendoGridTestCase.dataSource.total();

                    if (checkedArtifact === totalArtifact && totalArtifact !== 0) {
                        $('.chkAllBatch').prop("checked", true);
                    }
                    else {
                        $('.chkAllBatch').prop("checked", false);
                    }

                },
                edit: function (e) {
                }
            }).getKendoGrid();

        }

        $scope.SelectBatch = function (rowdata,e) {
            debugger;
            var Queued_Batch_ID = rowdata.Queued_Batch_ID;
            var subGrid = "div_grid_settings_" + Queued_Batch_ID;
            if ($("#" + subGrid).data('kendoGrid') != undefined) {               
                $('#' + subGrid + ' .chkAllCombination').prop("checked", e.currentTarget.checked);
                $('#' + subGrid + ' .chkSelectedCombination').prop("checked", e.currentTarget.checked);
            }
            
        }

        function initiaize_grid_sub(e) {
            debugger;

            var grid_row_data = e.data;
            var Queued_Batch_ID = grid_row_data.Queued_Batch_ID;

            var element_grid_sub = "div_grid_settings_" + Queued_Batch_ID;

            var element_search_box = "txtSearch_Queued_" + Queued_Batch_ID;

            var html = '';

            html = html + '<div class="row rebootGridToolbar" style="margin:0;">';

            html = html + '<div class="col-sm-8 reboot_padding_zero">';
            html = html + '<div class="btn-group btn-group-md toobar_panel">';
            html = html + '<button title="Delete selected combinations" class="btn btn-default btn-sm btn_toolbar_icon" type="button" id="bt_delete_setting_' + Queued_Batch_ID + '"><i class="fa fa-trash"></i></button>';
            html = html + '<h5 class="reboot-margin-top-xs reboot-margin-bottom-xs">Combination</h5>';
            html = html + '</div>';
            html = html + '</div>';

            html = html + '<div class="col-sm-4 reboot_padding_zero pull-right">';
            html = html + '<div class="input-group">';
            html = html + '<span class="input-group-btn">';
            html = html + '</span>';
            html = html + '<input type="text" id="' + element_search_box + '" class="form-control input-sm" placeholder="Search..">';
            html = html + '<span class="input-group-btn">';
            html = html + '<button title="clear search" id="btClear_Setting_' + Queued_Batch_ID + '" class="btn btn-default btn-sm clear_abc" type="button" id="btClearSearch" ng-click="ClearSearch()"><i class="fa fa-eraser"></i></button>';
            html = html + '</span>';
            html = html + '</div>';
            html = html + '</div>';

            html = html + '</div>';
            html = html + '<div id="' + element_grid_sub + '" class="WorkFlowGrid"/>';

            $(document).on('click', "#btClear_Setting_" + Queued_Batch_ID, function () {
                debugger;
                $scope.Grid_Clear_Search_Setting(element_grid_sub, element_search_box);
            });

            $(document).on('click', "#bt_delete_setting_" + Queued_Batch_ID, function () {
                debugger;
                $scope.DeleteMultipleSubCombination(element_grid_sub);
            });

            $(document).on('keyup', "#txtSearch_Queued_" + Queued_Batch_ID, function () {
                debugger;
                $scope.Grid_Search_Setting(element_grid_sub, element_search_box);
            });

            let safeHtml = DOMPurify.sanitize(html);
            $(safeHtml).appendTo(e.detailCell);

            $("#" + element_grid_sub).kendoGrid({
                dataSource: {
                    type: "odata",
                    transport: {
                        read: opkey_end_point + "/MultiBrowser/GetBatchSessionCombinations?batchSessionID=" + Queued_Batch_ID,
                        dataType: "json",
                        data: { batchSessionID: Queued_Batch_ID },
                    },
                    serverPaging: false,
                    serverSorting: false,
                    serverFiltering: false,
                },
                scrollable: false,
                sortable: false,
                pageable: false,
                columns: [
                    {
                        headerTemplate: '<input aria-label="input" type="checkbox"  class="chkAllCombination"/>',
                        template: function (e) {
                            var html = '';
                            if (e.Status !== EnumQueuedSessionStatus.Running) {
                                html = html + '<input type="checkbox" aria-label="input"  class="chkSelectedCombination"/>'
                            }
                            return html;
                        }, width: "28px"
                    },
                    { field: "OS", title: "OS", encoded: false, attributes: { "class": "ellipsisTextSpan", }, template: function (e) { return createCoulumnTitle(fakingAngularCharacter(e.OS)) } },
                    { field: "BrowserOrDevice", title: "Browser", encoded: false, attributes: { "class": "ellipsisTextSpan", }, template: function (e) { return createCoulumnTitle(fakingAngularCharacter(e.BrowserOrDevice)) } },
                    { field: "BrowserResolution", title: "Resolution", encoded: false, attributes: { "class": "ellipsisTextSpan", }, template: function (e) { if (e.BrowserResolution != null) { return e.BrowserResolution.Name } else { return 'NA' } } },
                    { field: "BrowserViewport", title: "Viewport", encoded: false, attributes: { "class": "ellipsisTextSpan", }, template: function (e) { if (e.BrowserViewport != null) { return e.BrowserViewport.Name } else { return 'NA' } } },

                   
                    {
                        title: "Actions", width: 80,
                        template: function (e) {

                            var html = '';
                            html = html + '<a href="Javascript:void(0);"  class=" fa fa-trash fa-lg colorRed delete_combination" title="Delete selected combination"></a>';
                            return html;
                        }
                    }

                ],
                dataBound: function (e) {
                    sub_gridID = element_grid_sub;
                    $('#' + element_grid_sub + ' .chkAllCombination').click(function (e) {
                        debugger;
                        $('#' + element_grid_sub + ' .chkSelectedCombination').prop("checked", e.currentTarget.checked);
                        var ParentGridrow = $("#divGridQueuedBatch").data("kendoGrid").tbody.find("tr[data-uid='" + grid_row_data.uid + "']");
                        ParentGridrow.find('.chkSelectedBatch').prop('checked', e.currentTarget.checked)
                    });

                    $('#' + element_grid_sub + ' .chkSelectedCombination').click(function (e) {
                        debugger;
                        var ParentGridrow = $("#divGridQueuedBatch").data("kendoGrid").tbody.find("tr[data-uid='" + grid_row_data.uid + "']");

                        var allcheckedCheckBox = $('#' + element_grid_sub + ' .chkSelectedCombination:checkbox:checked').length;
                        var allCheckBox = $('#' + element_grid_sub + ' .chkSelectedCombination').length;
                        if (allcheckedCheckBox === allCheckBox) {
                            $('#' + element_grid_sub + ' .chkAllCombination').prop("checked", true);
                            ParentGridrow.find('.chkSelectedBatch').prop('checked', true)
                        } else {
                            $('#' + element_grid_sub + ' .chkAllCombination').prop("checked", false);
                            ParentGridrow.find('.chkSelectedBatch').prop('checked', false);
                        }


                    });



                    var checkedArtifact = $('#' + element_grid_sub + ' .chkSelectedCombination:checked').length;
                    var kendoGridTestCase = formControlFactory.GetKendoGrid(element_grid_sub);
                    var totalArtifact = kendoGridTestCase.dataSource.total();

                    if (checkedArtifact === totalArtifact && totalArtifact !== 0) {
                        $('#' + element_grid_sub + ' .chkAllCombination').prop("checked", true);
                    }
                    else {
                        $('#' + element_grid_sub + ' .chkAllCombination').prop("checked", false);
                    }


                    $("#" + element_grid_sub + " .delete_combination").unbind().click(function () {
                        debugger;

                        var kendo_grid = formControlFactory.GetKendoGrid(element_grid_sub);
                        var kendo_grid_row_data = kendo_grid.dataItem($(this).closest('tr'));
                        var array_Ids_to_delete = [];
                        array_Ids_to_delete.push(kendo_grid_row_data.ID);
                        delete_inner(array_Ids_to_delete);
                    });




                },
                edit: function (e) {
                    $(e.container[0]).find('input').attr('aria-label', 'Enter Value');
                }
            });



        }

        $scope.Grid_Search_Setting = function (element_grid_sub, element_search_box) {
            debugger;
            var value = $("#" + element_search_box).val();


            $("#" + element_grid_sub).data("kendoGrid").dataSource.filter({
                logic: "or",
                filters: [
                    { field: "OS", operator: "contains", value: value },
                    { field: "BrowserOrDevice", operator: "contains", value: value },
                ]
            });

        };

        $scope.Grid_Clear_Search_Setting = function (element_grid_sub, element_search_box) {
            $("#" + element_search_box).val('');
            $scope.Grid_Search_Setting(element_grid_sub, element_search_box);
        };

        $scope.DeleteCombination = function (sub_grid, selectedItem) {
            debugger;


            var selectedCombination = [];
            selectedCombination.push(selectedItem.ID);

            var kendoBatchCombination = formControlFactory.GetKendoGrid(sub_grid);
            var totalGridData = kendoBatchCombination.dataSource.total();

            delete_inner(selectedCombination);


        }
        $scope.DeleteMultipleSubCombination = function (sub_element) {
            debugger;
            var selectedSubCombination = [];
            var grid = formControlFactory.GetKendoGrid(sub_element);
            var gridTrs = $("#" + sub_element+" tbody tr").has('input:checked');

            if (gridTrs.length === 0) {
                serviceFactory.notifier($scope, "Please select atleast one Combination", "warning");
                return false;
            }
            $.each(gridTrs, function (idx, row) {
                debugger;
                var item = grid.dataItem(row);
                selectedSubCombination.push(item.ID);
            });
            delete_inner(selectedSubCombination);

        
        }
        $scope.DeleteMultipleCombination = function () {
            debugger;
            var selectedCombination = [];
            var grid = formControlFactory.GetKendoGrid("divGridQueuedBatch");
            var gridTrs = $("#divGridQueuedBatch tbody tr.k-master-row").has('input:checked');

            if (gridTrs.length === 0) {
                serviceFactory.notifier($scope, "Please select atleast one Combination", "warning");
                return false;
            }
            $.each(gridTrs, function (idx, row) {
                debugger;
                var item = grid.dataItem(row);
                selectedCombination.push(item.Queued_Batch_ID);
            });





            //var kendoBatchCombination = formControlFactory.GetKendoGrid("divGridBatchCombination");
            //var totalGridData = kendoBatchCombination.dataSource.total();

            delete_session_inner(selectedCombination);
           // delete_inner(selectedCombination);




        }
        function GetSubCombination(gridID, Queued_Batch_ID) {
            debugger;
            $.ajax({
                url: opkey_end_point + "/MultiBrowser/GetBatchSessionCombinations?batchSessionID=" + Queued_Batch_ID,
                data: { batchSessionID: Queued_Batch_ID },
                type: "Get",
                success: function (result) {
                    debugger;
                    var grid = $('#' + gridID).data("kendoGrid");
                    grid.setDataSource(result);
                    serviceFactory.notifier($scope, 'Combinations deleted successfully', 'success');
                    if ($('#' + gridID).data("kendoGrid").dataSource.data().length == 0) {
                        var SessionIdToDelete = Queued_Batch_ID;
                                    loadingStart($('#divDynamicKendoWindow').parent(), "Please Wait ...", ".btnTestLoader");
                                    $.ajax({
                                        url: opkey_end_point + "/MultiBrowser/DeleteBatchSession",
                                        data: { batchSessionIds: SessionIdToDelete },
                                        type: "Post",
                                        success: function (result) {
                                            loadingStop($('#divDynamicKendoWindow').parent(), ".btnTestLoader");
                                            $scope.RefreshScheduledBatch();
                                            serviceFactory.notifier($scope, "Session deleted successfully!!", "success");

                                        },
                                        error: function (error) {
                                            loadingStop($('#divDynamicKendoWindow').parent(), ".btnTestLoader");
                                            serviceFactory.showError($scope, error);
                                        }
                                    });
                                        // var QuesedSessionId="div_grid_settings_" + Queued_Batch_ID
                                    }
                },
                error: function (error) {
                    loadingStop($('#divDynamicKendoWindow').parent(), ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });
                    
        }
        function delete_inner(selectedCombination) {
            debugger;

            $.msgBox({
                title: "Delete",
                content: "Are you sure want to delete this Combination ?",
                modal: true,
                type: "confirm",
                buttons: [{ value: "Yes" }, { value: "No" }],
                success: function (result) {

                    if (result == "Yes") {

                        debugger;

                        loadingStart("#divModalPanel", "Please Wait ...", ".btn1");

                        $.ajax({
                            url: opkey_end_point + "/MultiBrowser/DeleteCombinations",
                            data: { combinationsIDs: JSON.stringify(selectedCombination), executionType: 'Web'},
                            type: "Get",
                            success: function (result) {
                                debugger;
                                loadingStop("#divModalPanel", ".btn1");
                                if (sub_gridID != null) {
                                    GetSubCombination(sub_gridID, sub_gridID.split("div_grid_settings_")[1]);
                                }                                

                            },
                            error: function (error) {
                                $(".Combination-delete").removeClass("disabled");
                                loadingStop("#divModalPanel", ".btn1");
                                serviceFactory.showError($scope, error);
                            }

                        });


                    }


                    else {

                    }
                }

            });
        }



        // Audit trails

        function GetMultibrowserAuditTrails() {
            debugger;

            loadingStart('#div_panel_audit_trail', "Please Wait ...", ".btnTestLoader");
            var ajaxUrl = opkey_end_point + "/MultiBrowser/GetMultibrowserAuditTrails";

            $.ajax({
                url: ajaxUrl,
                type: "Get",
                data: { QueueType: "Queued" },
                success: function (result) {
                    loadingStop('#div_panel_audit_trail', ".btnTestLoader");
                    $scope.QueuedBatch_AuditTrail.data(result);
                },
                error: function (error) {
                    loadingStop('#div_panel_audit_trail', ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });
        }

        $scope.Refresh_Audit_Trail = function () {
            debugger;
            $scope.ClearQueuedBatch_AuditTrail();
            GetMultibrowserAuditTrails();
        }

        $scope.ClearQueuedBatch_AuditTrail = function () {
            $('#txtClearQueuedBatch_AuditTrail').val('');
            $scope.OnSearchQueuedBatch_AuditTrail();
        };

        $scope.OnSearchQueuedBatch_AuditTrail = function () {
            var value = $("#txtClearQueuedBatch_AuditTrail").val();
            $("#divGridQueuedBatch_AuditTrail").data("kendoGrid").dataSource.filter({
                logic: "or",
                filters: [
                    { field: "TimeStamp", operator: "contains", value: value },
                    { field: "Task", operator: "contains", value: value },
                    { field: "Build", operator: "contains", value: value },
                    { field: "Batch", operator: "contains", value: value },
                    { field: "Session", operator: "contains", value: value },
                    { field: "OS", operator: "contains", value: value },
                    { field: "BrowserOrDevice", operator: "contains", value: value },
                    { field: "Description", operator: "contains", value: value },


                ]
            });
        };

        $scope.QueuedBatch_AuditTrail = new kendo.data.DataSource({
            data: null, pageSize: 10
        });

        $scope.OptionsGridQueuedBatch_AuditTrail = {
            dataSource: $scope.QueuedBatch_AuditTrail,
            resizable: false,
            //pageable: {
            //    pageSizes: true,
            //    buttonCount: 5
            //},
            columns: [
                { field: 'TimeStamp', encoded: false, attributes: { "class": "ellipsisTextSpan", }, template: function (e) { return createCoulumnTitle(fakingAngularCharacter(e.TimeStamp)) } },
                { field: 'Task', width: "100px", encoded: false, attributes: { "class": "ellipsisTextSpan", }, template: function (e) { return createCoulumnTitle(fakingAngularCharacter(e.Task)) } },
                { field: 'Build', encoded: false, attributes: { "class": "ellipsisTextSpan", }, template: function (e) { return createCoulumnTitle(fakingAngularCharacter(e.Build)) } },
                { field: 'Batch', title: "Session", encoded: false, attributes: { "class": "ellipsisTextSpan", }, template: function (e) { return createCoulumnTitle(fakingAngularCharacter(e.Batch)) } },
                //  { field: 'Session', encoded: false, attributes: { "class": "ellipsisTextSpan", }, template: function (e) { return createCoulumnTitle(fakingAngularCharacter(e.Session)) } },
                {
                    field: 'OS Browser Resolution',
                    encoded: false,
                    attributes: { "class": "ellipsisTextSpan", },
                    template: function (e) {

                        return createCoulumnTitle(fakingAngularCharacter(e.OS) + " " + fakingAngularCharacter(e.BrowserOrDevice) + " " + fakingAngularCharacter(e.Resolution));
                    }
                },
                { field: 'Description', width: "200px", encoded: false, attributes: { "class": "ellipsisTextSpan", }, template: function (e) { return createCoulumnTitle(fakingAngularCharacter(e.Description)) } },
            ],
            dataBound: function (e) {
                debugger;
            },
            edit: function (e) {
            }
        };

    }]);




