
myApp.factory("FormControlFactory", ['$http', '$rootScope', 'DataFactory', function ($http, $rootScope, DataFactory) {

    var factory = {};

    // Kendo Controls

    factory.BindKendoDropdown = function (element, data) {
        var ddlKendo = $("#" + element).data("kendoDropDownList");
        //ddlKendo.dataSource.data([]); // clears dataSource
        //ddlKendo.text(""); // clears visible text
        //ddlKendo.value(""); // clears invisible value
        ddlKendo.setDataSource(data);
    };//Bind kendo DropDownList

    // Kendo Window

    factory.KendoWindowChangeTitle = function (element, title) {
        var kendoWindow = $("#" + element).data("kendoWindow");
        kendoWindow.title(title);
    }

    // Kendo Grid

    factory.GetKendoGridData = function (element) {
        var gridData = $("#" + element).data("kendoGrid").dataSource.data().toJSON();
        return gridData;
    }

    factory.ClearTextKendoGridData = function (element) {
        $("#" + element).data("kendoDropDownList").text("");
        $("#" + element).data("kendoDropDownList").value("");
        $("#" + element).data("kendoDropDownList").select("");
        $("#" + element).data("kendoDropDownList").refresh();

    }

    factory.ClearTextKendoGridDataNonRefresh = function (element) {
        $("#" + element).data("kendoDropDownList").value("");

    }

    factory.GetKendoGridDataEvents = function (element) {
        var gridData = $("#" + element).data("kendoGrid").dataSource.data();
        return gridData;
    }

    factory.ClearKendoGridData = function (element) {
        var gridData = $("#" + element).data("kendoGrid").dataSource.data([]);
        return gridData;
    }

    factory.GetSelectedKendoGridRowsData = function (element, isGrouped, eventRequire) {
        debugger;
        var grid = $("#" + element).data("kendoGrid");
        var rows = grid.select();
        var selectedRows = [];

        var totalLength = rows.length;

        if (isGrouped) {
            totalLength = rows.length / 2;
        }

        rows.each(function (index, row) {
            if (index <= totalLength - 1) {
                var selectedItem = null;
                if (eventRequire) {
                    selectedItem = grid.dataItem(row);
                }
                else {
                    selectedItem = grid.dataItem(row).toJSON();
                }
                selectedRows.push(selectedItem);
            }
        });

        console.log("Selected Rows");
        console.log(selectedRows);
        return selectedRows;
    }

    factory.GetDataOfSelectedRowOfKendoGrid = function (element) {
        var grid = $("#" + element).data("kendoGrid");
        var selectedRowData = grid.dataItem(grid.select());
        return selectedRowData;
    };

    factory.GetIndexOfSelectedRowOfKendoGrid = function (element) {
        var grid = $("#" + element).data("kendoGrid");
        var index = grid.select().index();
        return index;
    };

    factory.GetDataOfKendoGrid = function (element) {
        var gridData = $("#" + element).data("kendoGrid").dataSource.data();
        return gridData;
    };

    factory.SelectKendoGridRowByIndex = function (element, index) {
        var grid = $("#" + element).data("kendoGrid");
        grid.select("tr:eq(" + (index) + ")");
    }

    //$("#divGridSelectedDataSheet").data("kendoGrid").dataSource.options.data;
    //$("#divGridSelectedDataSheet").data("kendoGrid").dataSource.view();
    //$("#divGridSelectedDataSheet").data("kendoGrid").dataSource.data();
    //$("#divGridSelectedDataSheet").data("kendoGrid").dataSource.data().toJSON();

    factory.GetKendoGrid = function (element) {
        var kendoGrid = $("#" + element).data("kendoGrid")
        return kendoGrid;
    }

    factory.GetKendoGridSelectedRow = function (kendoGrid) { // Delte This Later
        var index = kendoGrid.select().index();
        return index;
    };

    factory.GetKendoGridSelectedRowIndex = function (kendoGrid) {
        var index = kendoGrid.select().index();
        return index;
    };

    factory.GetKendoGridSelectedRowData = function (kendoGrid) {
        var selectedRowData = kendoGrid.dataItem(kendoGrid.select());
        return selectedRowData;
    }

    factory.BindKendoGridData = function (kendoGrid, dataInArray) {
        kendoGrid.dataSource.data(dataInArray);
    };

    factory.GetKendoGridRowDataByUID = function (kendoGridElement, Uid) {
        var kendoGrid = factory.GetKendoGrid(kendoGridElement);
        var kendoGridRow = kendoGrid.tbody.find("tr[data-uid='" + Uid + "']");
        var selectedRowData = kendoGrid.dataItem(kendoGridRow);
        return selectedRowData;
    }
    factory.GetKendoGridRowDataByTr = function (kendoGridElement, trElement) {
        var kendoGrid = factory.GetKendoGrid(kendoGridElement);
        var selectedRowData = kendoGrid.dataItem(trElement);
        return selectedRowData;
    }

    factory.GetKendoGridAllSelectedRowsData = function (kendoGridElement) {

        var allSelectedRows = $("#" + kendoGridElement + " tr.k-state-selected");
        var kendoGrid = factory.GetKendoGrid(kendoGridElement);

        var allSelectedRowsData = [];
        $.each(allSelectedRows, function (e) {
            var row = $(this);
            var dataItem = kendoGrid.dataItem(row);
            allSelectedRowsData.push(dataItem);

        });

        return allSelectedRowsData;
    }

    factory.SelectedKendoGridRowByIndex = function (kendoGridElement, index, isGroup) {
        var kendoGird = factory.GetKendoGrid(kendoGridElement);

        $("#" + kendoGridElement + " .k-grid-content table tr").removeClass("k-state-selected");
        var tr = $("#" + kendoGridElement + " .k-grid-content table tr:eq(" + index + ")");

        if (isGroup) {
            $("#" + kendoGridElement + " .k-grid-content table tr.k-master-row").removeClass("k-state-selected");
            tr = $("#" + kendoGridElement + " .k-grid-content table tr:eq(" + index + ").k-master-row");
        }
        kendoGird.select(tr);

    }







    // Kendo Multiselect 

    factory.DisableKendoMultiSelectBackslash = function (element) {

        var multiselect = $("#" + element).data("kendoMultiSelect");

        var input = multiselect.input;

        input.on('keydown', function (e) {
            if (e.which === 8 && !e.target.value.length) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        });

        $._data(input[0]).events.keydown.reverse();

    };

    // JS Tree

    factory.CheckJsTreeNodeExist = function (treeElement, nodeId) {
        var jsTreeFlag = $('#' + treeElement).jstree(true);
        if (jsTreeFlag) {
            if ($('#' + treeElement).jstree(true).get_node(nodeId)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    factory.CheckJsTreeNodeExist2 = function (treeElement, nodeId) {
        var elementTree = $("#" + treeElement).find("#" + nodeId).length;
        return elementTree === 0 ? false : true;
    };

    factory.TooltipOnMouseenter = function (className) {
        $('.' + className).on({
            //on mouseenter get title from a element and use it in div
            mouseenter: function () {
                var titleText = $(this)[0].textContent;
                $(this).attr("title", titleText);
            },
            mouseleave: function () {
                $(this).attr("title", "");
            }
        });
    }


    factory.resizeKendoSplitterHeight = function (splitterElementID, addClassName, removeClassName) {
        var splitter = $("#" + splitterElementID).data("kendoSplitter");
        if (splitter != undefined) {
            splitter.wrapper.addClass(addClassName);
            splitter.wrapper.removeClass(removeClassName);
            splitter.resize();
        } else {
            console.error("Splitter is undefinced -> " + splitterElementID);
        }
    }

    factory.resizeAutomatedPanelHeight = function (splitterElementID) {
        var totalHeight = window.innerHeight;
        var toolBarHeight = $('#divPanelComponentParent').height();
        var bottomPanelHeight = $('#divBottomMenuComponent').height();
        var tabHeight = $('#divArtifactButton').height() - 9;
        if (DataFactory.JobType === EnumJobType.AcceleratorPortal) {
            tabHeight = $('#divBottomMenuComponent').height() - 9;
        }
        var bottomHeight = totalHeight - (toolBarHeight + bottomPanelHeight) - tabHeight;
        var splitter = $("#" + splitterElementID).data("kendoSplitter");
        $('#' + splitterElementID).attr('style', 'height: ' + bottomHeight + 'px !important');
        splitter.resize();
    }
    factory.resizeOctaneBPMNPanelHeight = function (splitterElementID) {
        var totalHeight = window.innerHeight;
        var toolBarHeight = $('#divPanelComponentParent').height();
        var bottomHeight = totalHeight - toolBarHeight + 9;
        var splitter = $("#" + splitterElementID).data("kendoSplitter");
        if (splitter != undefined) {
            $('#' + splitterElementID).attr('style', 'height: ' + bottomHeight + 'px !important');
            splitter.resize();
        }
    }
    factory.resizeOctanePanelHeight = function (splitterElementID) {
        var totalHeight = window.innerHeight;
        var toolBarHeight = $('#divPanelComponentParent').height();
        var bottomHeight = totalHeight - toolBarHeight + 10;
        var splitter = $("#" + splitterElementID).data("kendoSplitter");
        if (splitter != undefined) {
            $('#' + splitterElementID).attr('style', 'height: ' + bottomHeight + 'px !important');
            splitter.resize();
        }
    }
    factory.resizeOctanePanelHeightOnToggle = function (splitterElementID) {
        var totalHeight = window.innerHeight;
        var toolBarHeight = $('#divPanelComponentParent').height();
        var bottomHeight = totalHeight - toolBarHeight + 10;
        var splitter = $("#" + splitterElementID).data("kendoSplitter");
        if (splitter != undefined) {
            $('#' + splitterElementID).attr('style', 'height: ' + bottomHeight + 'px !important');
            splitter.resize();
        }
    }
    factory.resizeCodedPanelHeight = function (splitterElementID) {
        var totalHeight = window.innerHeight;
        var bottomPanelHeight = $('#BottomTabPane_CFCenterSplitter').height();
        var toolBarHeight = $('#divPanelComponentParent').height();
        var tabHeight = $('#divArtifactButton').height() - 9;
        if (DataFactory.JobType === EnumJobType.AcceleratorPortal) {
            tabHeight = $('#BottomTabPane_CFCenterSplitter').height();
        }
        var bottomHeight = totalHeight - (toolBarHeight + bottomPanelHeight) - tabHeight;

        var splitter = $("#" + splitterElementID).data("kendoSplitter");
        $('#' + splitterElementID).attr('style', 'height: ' + bottomHeight + 'px !important');
        $('#' + splitterElementID).css('width', '100%');
        splitter.resize();
    }


    return factory;
}]);


