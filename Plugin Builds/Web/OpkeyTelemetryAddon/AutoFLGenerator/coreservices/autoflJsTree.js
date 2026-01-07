let isToAddRc = false;

$(function () {

    $("#btn_add_component").click(function (e) {
        debugger;
        init_KendoTreeFolder();
        selectFL_actionType = $(this).data("action");
        isChecked = false;

        let checkedValues = $('#div_table_FL input[type="checkbox"]:checked').map(function () {
            return {
                id: $(this).attr("id"),
                text: $(this).attr("value")
            }
        }).get();

        if (checkedValues.length == 0) {

            let listItemFL = $('#div_table_FL input[type="checkbox"]').map(function () {
                return {
                    id: $(this).attr("id"),
                    text: $(this).attr("value")
                }
            }).get();

            isChecked = true;
            selected_fl_ID = listItemFL[0].id;

        } else if (checkedValues.length == 1) {
            selected_fl_ID = checkedValues[0].id;
        } else {
            ShowToastMessage("warning", "Select one or unselect all component to add");
            return;
        }

        $("#divModalTestCase").hide();
        $("#divModalFL").show();

    });

    $("#fetchFLButton").click(function (e) {
        isToAddRc = false;
        selectFL_actionType = $(this).data("action");
        init_KendoTreeFolder();
    });

    $("#fetchFLButton2").click(function (e) {
        isToAddRc = true;
        selectFL_actionType = $(this).data("action");
        init_KendoTreeFolder();
    });

    $("#moveUpFLButton2").click(function (e) {
        let messageToSend = new Object();
        messageToSend["action"] = "MoveStepUp";

        window.postMessage(messageToSend, "*");
    });

    $("#moveDownButton2").click(function (e) {
        let messageToSend = new Object();
        messageToSend["action"] = "MoveStepDown";

        window.postMessage(messageToSend, "*");
    });

    $("#deletStepButton").click(function (e) {
        let messageToSend = new Object();
        messageToSend["action"] = "DeleteStep";

        window.postMessage(messageToSend, "*");
    });

    //Action for search folder view
    $("#input_search_folder").on("keydown", function (e) {
        if (e.key === "Enter") {
            debugger;
            let inputValue = $(this).val().trim();
            let safeValue = DOMPurify.sanitize(inputValue);
            if (safeValue == "") { return; }
            selectedKendoTreeDataItem = null
            $("#divTreeviewFolder").hide();
            getTreeDataSearched(safeValue)
        }
    });

    $("#clear_search_folder").click(function (e) {
        debugger;
        $("#input_search_folder").val('');
        $("#input_search_artifact").val("");
        $("#divSearchTreeviewFolder").hide();
        $("#divTreeSearchFolder_noData").hide();
        $("#divTreeviewFolder").show(); 
        // selectedKendoTreeDataItem = {
        //     "ID": "00000000-0000-0000-0000-000000000000",
        //     "Name": "Project Workspace",
        //     "Childs": [],
        //     "index": 0,
        //     "selected": true
        // }
        setTimeout(function () {
            let treeKendoview = $("#divTreeviewFolder").data("kendoTreeView");
            let firstNode = treeKendoview.items().first();
        
            if (firstNode.length) {
                treeKendoview.select(firstNode);
                treeKendoview.trigger("select", { node: firstNode[0] });
            }
            // getAritifactData(selectedKendoTreeDataItem.ID); 
            // clearGridTotal()
        }, 50); 
    
      
    });

    //Action for search artifact view
    $("#input_search_artifact").on("keydown", function (e) {
        if (e.key === "Enter") {
            debugger;
            let inputValue = $(this).val().trim();
            let safeValue = DOMPurify.sanitize(inputValue);
            if (safeValue == "") { return; }
            Search_artifact = safeValue;
            pageSize = 100;
            skip = 0;
            datasource_artifact = [];
            getMoreGridData(selectedKendoTreeDataItem.ID);
        }
    });

    $("#clear_search_artifact").click(function (e) {
        debugger;
        $("#input_search_artifact").val("");
        $("#bt_selectFL").attr("disabled", true);
        Search_artifact = null;
        pageSize = 100;
        skip = 0;
        datasource_artifact = [];
        getMoreGridData(selectedKendoTreeDataItem.ID);
    });

    //modal footer btn acction
    $("#bt_selectFL").click(function (e) {

        if (selectFL_actionType == 'addFLCreateTC') {
            AddNodesId();
        } else {
            GetNodesId();
            $('body').removeClass("modal-open");
            $('.modal-backdrop').remove();
            $('.modal').removeClass('show');
            $('#divModalFL').modal('hide');
            clear_data();
        }
    });

    $("#bt_cancelFL").click(function (e) {

        if (selectFL_actionType == 'addFLCreateTC') {
            $("#divModalTestCase").show();
            $("#divModalFL").hide();
        }

        clear_data();
    });

});
function getTreeDataSearched(searchValue){
    let obj_filter = {
        FolderId: "00000000-0000-0000-0000-000000000000",
        ModuleTypesToFilterOn: ['Folder'],
        SearchString: searchValue,
        Limit: 10000,
        Offset: 0,
        SortingDirection: "Descending",
        SortingColumn:"score",
        includePath: true
    };

    let opkey_end_point = Get_Opkey_URL("OPKEY_DOMAIN_NAME");

    let form_url = opkey_end_point + '/ExplorerTree/GetGridNodesWithFilters';
    let form_data = new FormData();
    form_data.append('strTreeStructureFilterAndSorting', DOMPurify.sanitize(JSON.stringify(obj_filter)));

    loadingStart("#div_modal_body_content", "Please Wait ...", ".btnTestLoader");

    $.ajax({
        url: form_url,
        data: form_data,
        type: 'POST',
        contentType: false,
        processData: false,
        success: function (result) {
            loadingStop("#div_modal_body_content", ".btnTestLoader");
            if (result.data.length == 0) {
                $("#divTreeSearchFolder_noData").show();
                $("#divSearchTreeviewFolder").hide();
            } else {
                $("#divTreeSearchFolder_noData").hide();
                $("#divSearchTreeviewFolder").show();
                initSearchKendoTreeFolder(result.data);
            }
        },
        error: function (error) {
            loadingStop("#div_modal_body_content", ".btnTestLoader");
            // serviceFactory.showError($scope, error);
        }
    });
}
function tree_dataformat_folder_search(node) {
    let tree_data = [];
    let tree_obj = {};
    let added_roots = new Set();

    node.forEach(data => {

        //Convert array into a map (id -> object)
        data.path.forEach(item => {
            if (!tree_obj[item.id]) {
                tree_obj[item.id] = { ID: item.id, Name: item.name, spriteCssClass: "sprite2 Folder", type: "Folder", childs: [] };
            }
        });

        // Bind tree structure
        data.path.forEach(item => {
            if (item.parentId === "00000000-0000-0000-0000-000000000000") {
                if (!added_roots.has(item.id)) {
                    tree_data.push(tree_obj[item.id]);
                    added_roots.add(item.id);
                }
            } else {
                if (tree_obj[item.parentId] && !tree_obj[item.parentId].childs.includes(tree_obj[item.id])) {
                    tree_obj[item.parentId].childs.push(tree_obj[item.id]); // Attach to parent
                }
            }
        });
    });

    return tree_data;

}
function initSearchKendoTreeFolder(result) {
    let treeData = tree_dataformat_folder_search(result)
    function expandAllNodes(nodes) {
        nodes.forEach(function (node) {
            if (node.childs && node.childs.length>0) {
                node.expanded = true;
                expandAllNodes(node.childs);
            } 
        });
    }
    expandAllNodes(treeData);
  
    let inline = new kendo.data.HierarchicalDataSource({
        data:treeData,
        schema: {
            model: {
                id:'ID',
                children: "childs",
               
            }
        }
    });

    let treeSearchview = $("#divSearchTreeviewFolder").kendoTreeView({
        dataSource: inline,
        dataTextField: [ "Name"],
        select: function (e) {
            // Get the selected node
            let dataItem = $("#divSearchTreeviewFolder").data("kendoTreeView").dataItem(e.node);
            
            console.log("Search dataitem", dataItem);
            $("#bt_selectFL").attr("disabled", true);
            $("#input_search_artifact").val("");
            Search_artifact = null;
            datasource_artifact = [];
            skip = 0
            selectedKendoTreeDataItem = dataItem
            getAritifactData(dataItem.ID); 
            clearGridTotal()
        }
    }).data("kendoTreeView");
}

function hideButton() {
    const flag = localStorage.getItem("flagForTestCase");
    const button = document.getElementById("createTestCaseButton");

    if (flag === "false" && button) {
        button.style.display = "none";
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "hideButton") {
        hideButton();
        sendResponse({ success: true });
    }
});

function clear_data() {
    selectFL_actionType = null;
    selected_fl_ID = null;
    isChecked = false;
    selected_node_id = null;
    pageSize = 100;
    skip = 0;
    grid_load_more = true;
    api_call_pending = false;
    Search_artifact = null;
    datasource_artifact = [];
    $("#bt_selectFL").attr("disabled", true);
    $("#input_search_folder").val('');
    $("#input_search_artifact").val("");
}

var selected_node_id = null;

function GetNodesId() {
    if (isToAddRc) {
        let messageToSend = new Object();
        messageToSend["action"] = "AddRCToGrid";
        messageToSend["data"] = selected_node_id;

        window.postMessage(messageToSend, "*");

        return;
    }
    sessionStorage.setItem("choosen_fl_id", JSON.stringify(selected_node_id));
}

var selectFL_actionType = null;
var selected_fl_ID = null;
var isChecked = false;

function AddNodesId() {
    debugger;

    let json_fl_array = sessionStorage.getItem("temp_fl_arrays");
    let temp_FLArray = JSON.parse(json_fl_array);

    //Comment this code because of Aayush Khurana requirenment
    // if (temp_FLArray.some(item => item.id == selected_node_id.id)) {
    //     ShowToastMessage("warning", "This FL already exists. Please select another FL.");
    //     $(this).prop("checked", false);
    //     return
    // }
    let tr_template = `<tr id="tr_item_${DOMPurify.sanitize(selected_node_id.id)}">
                <td>
                    <div class="td_item" id="addFromRC">

                        <div class="item-check">
                            <span class="item-check-label">
                                <input type="checkbox" 
                                       class="item-check-input action_checkbox_FL" 
                                       value="${DOMPurify.sanitize(selected_node_id.text)}" 
                                       id="${DOMPurify.sanitize(selected_node_id.id)}" 
                                       checked="true">
                                <span class="item-check-text" 
                                      data-bs-toggle="tooltip" 
                                      title="${DOMPurify.sanitize(selected_node_id.text)}">
                                    ${DOMPurify.sanitize(selected_node_id.text)}
                                </span>
                            </span>
                        </div>

                    </div>
                </td>
                        
            </tr>`;


    // Sanitize the ID before using it in the selector
    const safeFlId = DOMPurify.sanitize(selected_fl_ID);

    if (isChecked) {
        $("#tr_item_" + safeFlId).before(tr_template);
    } else {
        $("#tr_item_" + safeFlId + " .action_checkbox_FL").prop("checked", false);
        $("#tr_item_" + safeFlId).after(tr_template);
    }


    let obj_temp = { id: selected_node_id.id, text: selected_node_id.text };
    temp_FLArray.push(obj_temp);
    sessionStorage.setItem("temp_fl_arrays", JSON.stringify(temp_FLArray));

    $('[data-bs-toggle="tooltip"]').tooltip();

    $("#divModalTestCase").show();
    $("#divModalFL").hide();
    updateButtonState();
    clear_data();

}

// reason moveup and move down 
function updateButtonState() {
    debugger;
    let selectedRow = getSelectedRow();
    if (!selectedRow) {
        $("#btn_movedown_component").attr("disabled", true);
        $("#btn_moveup_component").attr("disabled", true);
        return;
    }
    $("#btn_moveup_component").attr("disabled", !selectedRow.previousElementSibling);
    $("#btn_movedown_component").attr("disabled", !selectedRow.nextElementSibling);
}

function getSelectedRow() {
    return document.querySelector(".action_checkbox_FL:checked")?.closest("tr");
}


//Reason kendo tree for folder view
selectedKendoTreeDataItem = null;

function init_KendoTreeFolder() {
    let opkey_end_point = Get_Opkey_URL("OPKEY_DOMAIN_NAME");
    var homogeneous = new kendo.data.HierarchicalDataSource({
        transport: {
            read: function (options) {
                var parentID = options.data.ID || "00000000-0000-0000-0000-000000000000";
                if (homogeneous._loadedParents && homogeneous._loadedParents[parentID]) {
                    options.success(homogeneous._loadedParents[parentID]);
                    return;
                }

                loadingStart("#div_modal_body_content", "Please Wait ...", ".btnTestLoader");
                $.ajax({
                    url: opkey_end_point + '/ExplorerTree/GetFoldersOfParentWithCount',
                    type: "POST",
                    data: {
                        parentID: parentID,
                        ModuleTypeToFilter: "Component"
                    },
                    success: function (response) {
                        loadingStop("#div_modal_body_content", ".btnTestLoader");
                        let children = (response.Childs || []).map(function (item) {
                            item.hasChildren = item.FolderCount > 0;
                            return item;
                        });
                        homogeneous._loadedParents = homogeneous._loadedParents || {};
                        homogeneous._loadedParents[parentID] = children;

                        if (parentID === "00000000-0000-0000-0000-000000000000") {
                            let rootNode = {
                                ID: response.ID,
                                Name: response.Name,
                                hasChildren: response.FolderCount > 0,
                                Childs: children,
                                expanded: true,
                                spriteCssClass: "sprite2 folder"
                            };
                            options.success([rootNode]);
                        } else {
                            options.success(children);
                        }
                    },
                    error: function (err) {
                        loadingStop("#div_modal_body_content", ".btnTestLoader");
                        options.error(err);
                    }
                });
            }
        },
        schema: {
            model: {
                id: "ID",
                hasChildren: "hasChildren",
                spriteCssClass: "sprite2 folder"
            }
        }
    });

    var treeview = $("#divTreeviewFolder").kendoTreeView({
        dataSource: homogeneous,
        dataTextField: "Name",
        loadOnDemand: true,
        select: function (e) {
            // Get the selected node
            var treeview = $("#divTreeviewFolder").data("kendoTreeView");
            var dataItem = treeview.dataItem(e.node);
            console.log("Selected node data:", dataItem);
            $("#bt_selectFL").attr("disabled", true);
            $("#input_search_folder").val('');
            $("#input_search_artifact").val("");
            Search_artifact = null;
            datasource_artifact = [];
            skip = 0
            selectedKendoTreeDataItem = dataItem
            getAritifactData(dataItem.ID); 
            clearGridTotal()
        }
    }).data("kendoTreeView");

    treeview.one("dataBound", function () {
        let firstNode = treeview.items().first();
        if (firstNode.length) {
            treeview.select(firstNode);
            treeview.trigger("select", { node: firstNode });
        }
    });
}

// get data for artifact
var pageSize = 100;
var skip = 0;
var grid_load_more = true;
var api_call_pending = false;
var Search_artifact = null;

var datasource_artifact = [];

getAritifactData = function (nodeid) {
    debugger;

    let obj_filter = {
        FolderId: nodeid,
        ModuleTypesToFilterOn: ['Component'],
        SearchString: Search_artifact,
        Limit: pageSize,
        Offset: skip,
        SortingDirection: "Descending",
        SortingColumn:"score"
    };

    let opkey_end_point = Get_Opkey_URL("OPKEY_DOMAIN_NAME");

    let form_url = opkey_end_point + '/ExplorerTree/GetGridNodesWithFilters';
    let form_data = new FormData();
    form_data.append('strTreeStructureFilterAndSorting', DOMPurify.sanitize(JSON.stringify(obj_filter)));

    loadingStart("#div_modal_body_content", "Please Wait ...", ".btnTestLoader");
    api_call_pending = true;
    $.ajax({
        url: form_url,
        data: form_data,
        type: 'POST',
        contentType: false,
        processData: false,
        success: function (result) {
            debugger;
            loadingStop("#div_modal_body_content", ".btnTestLoader");
            api_call_pending = false;
            datasource_artifact = [...datasource_artifact, ...result.data];
            grid_load_more = result.count > datasource_artifact.length;

            if (datasource_artifact.length == 0) {
                $("#divKendoTreeArtifact").hide();
                $("#divArtifact_noData").show();
                return;
            } else {
                $("#divKendoTreeArtifact").show();
                $("#divArtifact_noData").hide();
                // InitializeTreeArtifact(datasource_artifact);
                GetKendoGridNodes(datasource_artifact);
            }

        },
        error: function (error) {
            loadingStop("#div_modal_body_content", ".btnTestLoader");
            api_call_pending = false;
            Search_artifact = null;
            // serviceFactory.showError($scope, error);
        }
    });

};

function clearGridTotal(){
    const gridElement = $("#divKendoTreeArtifact");
    
    if (gridElement.data("kendoGrid")) {
        gridElement.data("kendoGrid").destroy();
        gridElement.off();
        gridElement.empty();
        gridElement.replaceWith('<div id="divKendoTreeArtifact" class="tree-action" style="height: 400px;"></div>');
    }
}

//Reason kendo grid for artifact view
var grid;

function GetKendoGridNodes() {
    const gridElement = $("#divKendoTreeArtifact");

    grid = gridElement.kendoGrid({
        dataSource: {
            transport: {
                read: function (options) {
                    options.success(datasource_artifact);
                }
            },
        },
        change: function(e) {
            const grid = this; 
            const selectedRow = grid.select(); 
            const dataItem = grid.dataItem(selectedRow);
            let item = {
                id :dataItem.id,
                text:dataItem.text,
                icon:dataItem.icon,
                type:"default"
            }
            if (dataItem) {
                $("#bt_selectFL").attr("disabled", false);
                selected_node_id = item;
            } else {
                $("#bt_selectFL").attr("disabled", true);
                selected_node_id = null;
            }
        },
        height:400,
        scrollable: true,
        sortable: true,
        filterable: true,
        pageable: false,
        hideHeader: true, 
        selectable: true,
        columns: [
            { 
                field: "text", 
                title: "Name", 
                template: function (e) {
                    return `<div style="display: flex; flex-direction: row;">
                        <i class="jstree-icon jstree-themeicon jstree-themeicon-custom ${e.icon}"></i>
                        <span class="w-100 ps-1">${e.text}</span>
                    </div>`;
                
                }, 
                width: "180px" 
            },
        ]
    });

    const scrollableContainer = $("#divKendoTreeArtifact").find(".k-grid-content");
    scrollableContainer.on("scroll", function () {
        const scrollHeight = this.scrollHeight;
        const scrollTop = this.scrollTop;
        const clientHeight = this.clientHeight;

       
        if (scrollHeight - scrollTop <= clientHeight + 50) { 
           
            if (!grid_load_more || api_call_pending) return;

            this.scrollTop = scrollTop - 100;

            skip += pageSize; 
   
            getMoreGridData(selectedKendoTreeDataItem.ID)
        }
    });
}

getMoreGridData = function (nodeid) {
    debugger;

    let obj_filter = {
        FolderId: nodeid,
        ModuleTypesToFilterOn: ['Component'],
        SearchString: Search_artifact,
        Limit: pageSize,
        Offset: skip,
        SortingDirection: "Descending",
        SortingColumn:"score"
    };

    let opkey_end_point = Get_Opkey_URL("OPKEY_DOMAIN_NAME");

    let form_url = opkey_end_point + '/ExplorerTree/GetGridNodesWithFilters';
    let form_data = new FormData();
    form_data.append('strTreeStructureFilterAndSorting', DOMPurify.sanitize(JSON.stringify(obj_filter)));

    loadingStart("#div_modal_body_content", "Please Wait ...", ".btnTestLoader");
    api_call_pending = true;
    $.ajax({
        url: form_url,
        data: form_data,
        type: 'POST',
        contentType: false,
        processData: false,
        success: function (result) {
            debugger;
            loadingStop("#div_modal_body_content", ".btnTestLoader");
            api_call_pending = false;
            datasource_artifact = [...datasource_artifact, ...result.data];
            grid_load_more = result.count > datasource_artifact.length;

            if (datasource_artifact.length == 0) {
                $("#divKendoTreeArtifact").hide();
                $("#divArtifact_noData").show();
                return;
            } else {
                $("#divKendoTreeArtifact").show();
                $("#divArtifact_noData").hide();
                let grid = $("#divKendoTreeArtifact").data("kendoGrid")
                let gridData = grid.dataSource
                gridData.read();  
                
            }

        },
        error: function (error) {
            loadingStop("#div_modal_body_content", ".btnTestLoader");
            api_call_pending = false;
            Search_artifact = null;
            // serviceFactory.showError($scope, error);
        }
    });

};