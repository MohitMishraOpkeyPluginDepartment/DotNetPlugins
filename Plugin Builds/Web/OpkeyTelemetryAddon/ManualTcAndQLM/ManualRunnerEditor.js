

var opkey_url = "";
function get_Session_data() {
    let Session_ID = localStorage.getItem("SessionID");
    let ManualFlowBPGroup_ID = localStorage.getItem("ManualFlowBPGroupID");

    bind_events();
   

    if(Session_ID != null && ManualFlowBPGroup_ID != null){

        opkey_url = localStorage.getItem("OPKEY_DOMAIN_NAME");
        let data = { "SessionID": Session_ID, "ManualFlowBPGroupID": ManualFlowBPGroup_ID };
        
        get_current_cookie_binding();
        get_Suite_data(data);
        

    }
    else{
        msgbox("Invalid page!", "Info");
    }

    
}

var SessionID = "00000000-0000-0000-0000-000000000000"
var Suite_Steps = [];
var Current_TC = new Object();
var Suite_Binding = new Object();
var Current_Index = 0;

var empty_guid = "00000000-0000-0000-0000-000000000000";

var Current_cookie_DTO = null;

var statusArray = ["Pass", "Incomplete", "NotExecuted", "SkippedOver", "Fail"];

var DynamicCollapseRow = false;

var isChange = false;

function get_Suite_data(data){
    let store_data_binding = localStorage.getItem("ManualRunExecutionData");
    SessionID = data.SessionID;
    if(store_data_binding!=null) {
        var store_data = JSON.parse(store_data_binding);
        if(store_data.SessionID==data.SessionID && store_data.ManualFlowBPGroupID == data.ManualFlowBPGroupID){

            ManualExecution_data_binding(store_data.ManualRunExecutionData);

            Current_Index = store_data.Current_Index;
            Current_TC = store_data.ManualRunExecutionData.SuiteSteps[Current_Index];

            $(".testCase_step_class").removeClass("active");
            $("#" + Current_TC.Result_ID).addClass("active");
            let TestCaseStatusDDL = $("#TestCaseStatusDDL").data('kendoDropDownList');
            TestCaseStatusDDL.value(Current_TC.Status);
            $("#TestCaseName_bold").html(DOMPurify.sanitize(Current_TC.Name));
            $("#TestCaseTittle_span").attr('title', Current_TC.Name);

            $("#TC_counter_bold").html(DOMPurify.sanitize(`${Current_Index + 1} out of ${Suite_Steps.length}`));

            set_kendo_grid();            

            let grid = $("#ManualExecutionSteps_grid").data('kendoGrid');

            grid.dataSource.data(store_data.Selected_TC_binding);

            return;

        }
    }

    get_Suite_data_inner(data);
}

function get_Suite_data_inner(data) {
    
    
    debugger;
    let bindingObject = {state: "Opened"}
    chrome.runtime
        .sendMessage({
            SetOpkeyOne_addon_binding: bindingObject
        },
            function (response) { });
    
    let ManualFlowBPGroupID = data.ManualFlowBPGroupID;

    $.ajax({
        url: opkey_url + "/Result/GetManualRunExecutionData",
        data: { SessionID: SessionID, manualFlowResultID: ManualFlowBPGroupID },
        type: "Post",
        success: function (res) {
            debugger;
            localStorage.setItem("ManualRunExecutionData",JSON.stringify({ SessionID: SessionID, ManualFlowBPGroupID: ManualFlowBPGroupID, ManualRunExecutionData: res}));
            ManualExecution_data_binding(res);

            Set_current_TestCase(res.SuiteSteps[0], 0);

        },
        error: function (error) {
            debugger;
            showError(error);
        }
    });
}

function ManualExecution_data_binding(res){
    set_kendo_dropwdown();
    console.log("res", res);
    Suite_Steps = res.SuiteSteps;
    Suite_Binding = res.Suite;
    set_Suite_data(Suite_Binding, Suite_Steps);
    
}



function Set_current_TestCase(step, index) {
    Current_Index = index;
    Current_TC = step;

    $(".testCase_step_class").removeClass("active");
    $("#" + Current_TC.Result_ID).addClass("active");
    let TestCaseStatusDDL = $("#TestCaseStatusDDL").data('kendoDropDownList');
    TestCaseStatusDDL.value(Current_TC.Status);
    $("#TestCaseName_bold").html(DOMPurify.sanitize(Current_TC.Name));
    $("#TestCaseTittle_span").attr('title', Current_TC.Name);

    $("#TC_counter_bold").html(DOMPurify.sanitize(`${index + 1} out of ${Suite_Steps.length}`));

    get_testCase_steps(Current_TC.Result_ID, "ManualFlow");
}

function get_testCase_steps(ResultID, type) {
    $.ajax({
        url: opkey_url + "/Result/GetManualRunComponentFlowChildSteps",
        data: { SessionID: SessionID, resultID: ResultID },
        type: "get",
        success: function (res) {
            debugger;
            res.forEach(function (item) {
                item['Parent_Type'] = type;
            })
            set_step_dataSource(res, ResultID, type);

        },
        error: function (error) {
            debugger;
            showError(error);
        }
    });
}

function set_Suite_data(Suite_binding, Suite_TC_Steps) {
    $("#span_suite_title").attr('title', Suite_binding.Name);
    $("#bold_suite_name").html(DOMPurify.sanitize(Suite_binding.Name));
    $("#SuiteStatusDDL").html(DOMPurify.sanitize('<i class="status_icon ' + Suite_binding.Status + '"></i> '));
    $("#SuiteStatusDDL").prop('title', Suite_binding.Status);

    let html = "";

    Suite_TC_Steps.forEach((element, ind) => {
        html = html + `<li class="col px-0 TcStepsTab TCstatus_ ${element.Status}"><a id="${element.Result_ID}" class="testCase_step_class" onclick="Set_current_TestCase(${element},${ind})"></a></li>`;
    });

    $("#Suite_step_ul_list").html(html);

    $(".testCase_step_class").removeClass("active");
    $("#" + Current_TC.Result_ID).addClass("active");

}

function set_step_dataSource(data, Result_ID, type) {
    if (type == "ManualComponent") {
        $("#tempDetailFLSteps_" + Result_ID).data('kendoGrid').dataSource.data(data);
    }
    else {
        set_kendo_grid();

        let store_data_binding = localStorage.getItem("ManualRunExecutionData");
        var store_data = JSON.parse(store_data_binding);

        store_data["Selected_TC_binding"] = data;
        store_data["Current_Index"] = Current_Index;
        localStorage.setItem("ManualRunExecutionData",JSON.stringify(store_data));

        let grid = $("#ManualExecutionSteps_grid").data('kendoGrid');
        grid.dataSource.data(data);
    }
}


var CommonGridColumns = [

    {
        field: "Result_ID", hidden: true, template: function (e) {

            var html = '';
            html = html + '<span id="ManualspStep--' + e.Result_ID + '"></span>';
            return html;

        }
    },
    {
        field: "Text",
        title: "Test Step Description",
        editable: function () { return false; },
        template: function (e) {
            var html = '';
            html = html + "<div class='d-flex align-items-center'>";
            if (e.Type === "ManualComponent") {

                html = html + '<i class="oci oci-Manual-FL font_16px"></i>'
                //html = html + '<img src="./Assets/images/Icons/fl16x16.png" />';
            }
            else {
                html = html + '<i class="oci oci-manual_step font_16px"></i>'
                // html = html + '<img src="../Assets/images/Icons/manual_step.png" />';
            }
            html = html + '<span title="' + e.Name + '" style="max-width: calc(100% - 1rem); text-wrap: wrap;" class="k_grid_text ps-2">' + e.Name + '</span>';
            html = html + '</div>'
            html = html + "<div class='d-flex'>";
            if (e.Type != "ManualComponent") {
                let expectedOutput = e.ExpectedResult == null ? 'Expected output' : e.ExpectedResult;
                html = html + '<div class="d-flex col-sm-5 ps-0 justify-content-between tableRightSection" style="text-wrap: wrap;">'
                html = html + "<span class='exepected_Output font_tialic font_12px text-muted text_wrap' style='max-width: calc(100% - 5rem)'>"+expectedOutput+"</span>"
                html = html + "<div class='d-flex align-items-start btn_onhover'>";
                if (e.ExpectedResult_FID == empty_guid) {
                    html = html + "<span style='cursor: pointer; font-size: 16px;'><i class='oci oci-attach_file_add'></i></span>";
                }
                else {
                    html = html + `<div class="hover_div" style='cursor: border: 1px solid gray; display: none;'>
                                    <ul class='parent_of_li px-2 d-flex'
                                        <li><li title="view snapshot" class="view_expected_snapShot_li"><a><i class='oci oci-picture'></i></a></li></li>
                                    </ul>
                                </div>`;
                    html = html + "<span style='cursor: pointer; font-size: 16px;'><i class='oci oci-attach_file' style='color: green;'></i></span>";
                }
                
                html = html + '</div>';
                html = html + '</div>';


            }

            if (e.Type != "ManualComponent") {
                let expectedOutput = e.ActualResult == null ? '' : e.ActualResult;
                html = html + '<div class="d-flex col-sm-6 pe-0 justify-content-between tableRightSection">'
                html = html + `<div class='stepEdit text_wrap'><span class='span_actual_Output font_tialic font_12px text-muted'>${expectedOutput ==""?"Provide actual output":expectedOutput}</span>`;
                html = html + "<input type='text' class='actual_Output input_step_Edit text-ellipsis font_tialic font_12px text-muted hidden' placeholder='Provide actual output' value='" + expectedOutput + "'></div>"
                html = html + `<div class="d-flex justify-content-end"'>`
                html = html + "<span class='expand_comment_input pe-3' style='cursor: pointer; font-size: 16px; display: none;'><i class='oci oci-message-circle'></i></i></span>";
                html = html + "<div class='d-flex align-items-start btn_onhover'>";
                if (e.ActualResult_FID == empty_guid) {
                    
                html = html + `<div class="hover_div" style='cursor: border: 1px solid gray; display: none;'>
                    <ul class='parent_of_li px-2 d-flex'
                         <li><li title="Capture Snapshot" class="add_snapShot_li"><a><i class='oci oci-picture'></i></a></li></li>
                        <li title="upload from computer" class="upload_local_snapShot_li"><a><i class='oci oci-monitor'></i></a></li>
                        <li title="Caprure Video" class="add_gif_snapShot_li"><a><i class='oci oci-video font_16px'></i></a></li>
                    </ul>
                </div>`;

                html = html + "<span style='cursor: pointer; font-size: 16px;'><i class='oci oci-attach_file_add'></i></span>";
                }
                else {
                    html = html + `<div class="hover_div" style='cursor: border: 1px solid gray; display: none;'>
                        <ul class='parent_of_li px-2 d-flex'
                            <li><li title="View attachment" class="view_snapShot_li"><a><i class='oci oci-picture'></i></a></li></li>
                            <li title="Remove attachment" class="remove_snapShot_li"><a><i class='oci oci-x-circle'></i></a></li>
                        </ul>
                    </div>`;

                    html = html + "<span style='cursor: pointer; font-size: 16px;'><i class='oci oci-attach_file'></i></span>";
                }

                

            }
            html = html + '</div>';
            html = html + `</div>`;    
            html = html + '</div>';
            html = html + '</div>';

            return html;
        }
    },
    {
        field: "Status",
        title: "Status",
        width: "55px",
        attributes: {
            "class": "td_ddl_cell",
        },
        editor: ChangeStepStatus,
        template: function (e) {
            let btnID = e.Result_ID;
            return '<span class="text-center d-block pb-1" title="' + e.Status + '" id="btn_' + btnID + '"><strong class="status_icon ' + e.Status + '"></strong></span>'
        }
    }
];

function set_kendo_dropwdown() {
    $("#TestCaseStatusDDL").kendoDropDownList({
        dataSource: statusArray,
        valueTemplate: function (e) {
            return '<span class="dropdown-item-step-val align-items-center spStepVal_' + e + '" title="' + e + '"><span><i class="status_icon ' + e + '"></i></span><span>'
        },
        template: function (e) {
            return '<span class="dropdown-item-step d-flex align-items-center spStep_' + e + '" title="' + e + '"><span class="pe-2"><i class="status_icon ' + e + '"></i></span>' + e + '<span>'
        },
        animation: false,
        popup: {
            origin: "top left"
        },
        select: function (e) {
            debugger;
            let old_status = Current_TC.Status;
            Update_step_status(null, null, e.dataItem, Current_TC, old_status, false);
        },
        dataBound: function (e) {
            debugger;
            e.sender.close();
            setTimeout(function () {
                e.sender.list.parent().addClass("ManualStatusDropdownList");
            }, 50);
        }
    });
}
function set_kendo_grid() {
    $("#ManualExecutionSteps_grid").kendoGrid({
        autoBind: false,
        dataSource: [],
        resizable: false,
        editable: true,
        selectable: "true",
        columns: CommonGridColumns,
        detailTemplate: function (e, row) {
            debugger;
            return CallTemplate(e);
        },
        detailCollapse: function (e) {
            e.masterRow.removeClass("selected_row_expand");
        },
        detailInit: function (e) {
            debugger;
            ManualExecutionDetailInit(e);
        },
        dataBound: function (e) {
            debugger;
            $(e.sender.element).find(".k-grid-header").hide();
            $.each(e.sender.items(), function (k, v) {
                if (e.sender.dataItem(v).Type != "ManualComponent") {
                    $(v).find(".k-hierarchy-cell").find('a').hide();
                }
            });

            BindEditEventFor_actual_input();
        },
        detailExpand: function (e) {
            debugger;
            if (DynamicCollapseRow) {
                DynamicCollapseRow = false;
                e.detailRow.remove()
                e.isDefaultPrevented();
                return false;
            }
            e.masterRow.addClass("selected_row_expand");
            var grid = e.sender;
            var rows = grid.element.find(".k-master-row").not(e.masterRow);

            rows.each(function (e) {
                grid.collapseRow(this);
            });
        },

    });


}

function changeTCTab(index) {
    Current_Index = Current_Index + index;
    if (Current_Index == -1) {
        Current_Index = 0;
        notifier("Cannot move further",'warning');
        return;
    }
    else if (Current_Index == Suite_Steps.length) {
        Current_Index = Suite_Steps.length - 1;
        notifier("Cannot move further",'warning');
        return;
    }

    Set_current_TestCase(Suite_Steps[Current_Index], Current_Index);
}

obj_expand_dto={Type:null, expendRow: null};


function ChangeStepStatus(container, options) {
    var Status_Value = options.model.Status;
    $('<input value=' + options.model.Status + '/>')
        .appendTo(container)
        .kendoDropDownList({
            dataSource: statusArray,
            valueTemplate: function (e) {
                return '<span class="dropdown-item-step-val align-items-center align-items-center spStepVal_' + e + '" title="' + e + '"><span><i class="status_icon ' + e + '"></i></span><span>'

            },
            template: function (e) {
                return '<span class="dropdown-item-step align-items-center d-flex spStep_' + e + '" title="' + e + '"><span class="pe-2"><i class="status_icon ' + e + '"></i></span>' + e + '<span>'
            },
            animation: false,
            select: function (e) {
                debugger;
                let GridID = e.sender._inputWrapper.closest(".k-grid-content")[0].parentElement.id;
                let grid = $('#' + GridID).data('kendoGrid');
                let row = e.sender._inputWrapper.closest("tr");
                let GridRow = grid.dataItem(row);
                let old_status = GridRow.Status;
                Update_step_status(grid, row, e.dataItem, GridRow, old_status, false);
            },
            dataBound: function (e) {
                debugger;
                e.sender.value(Status_Value);
                e.sender.open();
                setTimeout(function () {
                    e.sender.list.parent().addClass("ManualStatusDropdownList");
                }, 50)
            }
        });
}

function CallTemplate(e) {
    debugger

    if (e.Type == "ManualComponent") {
        return "<div class='detail_container' id='tempDetailFLSteps_" + e.Result_ID + "'></div>"
    }
    else {
        let val = e.Remarks?e.Remarks:'';
        return '<input type="text" placeholder="// #Comment---" style="font-style: italic;" id="tempDetailCommentSteps_' + e.Result_ID + '" value="'+ val +'"/>'
    }
}

function ManualExecutionDetailInit(e) {
    debugger;

    if (e.data.Type == "ManualComponent") {
        $("#tempDetailFLSteps_" + e.data.Result_ID).kendoGrid({
            dataSource: null,
            resizable: false,
            selectable: "true",
            editable: true,
            columns: CommonGridColumns,
            detailTemplate: function (e, row) {
                debugger;
                return CallTemplate(e);
            },
            dataBound: function (e) {
                $(e.sender.element).find(".k-grid-header").hide()
                $.each(e.sender.items(), function (k, v) {
                    if (e.sender.dataItem(v).Type != "ManualComponent") {
                        $(v).find(".k-hierarchy-cell").find('a').hide();
                    }
                })
                BindEditEventFor_actual_input();
            },
            detailInit: function (e) {
                debugger;
                ManualExecutionDetailInit(e);
            },
            detailExpand: function (e) {
                debugger;
                if (DynamicCollapseRow) {
                    DynamicCollapseRow = false;
                    e.detailRow.remove()
                    e.isDefaultPrevented();
                    return false;
                }
                e.masterRow.addClass("selected_row_expand");
                var grid = e.sender;
                var rows = grid.element.find(".k-master-row").not(e.masterRow);
                rows.each(function (e) {
                    grid.collapseRow(this);
                });
            },
            detailCollapse: function (e) {
                e.masterRow.removeClass("selected_row_expand");
            }
        });

        get_testCase_steps(e.data.Result_ID, e.data.Type);
    }
    else{
        var Result_ID=e.data.Result_ID;
        var old_value = e.Remarks;
        $("#tempDetailCommentSteps_"+Result_ID).unbind().bind('blur',function(ev){
            debugger;
            let txt=ev.target.value;
            let GridID = $($("#btn_" + Result_ID).closest(".k-grid-content"))[0].parentElement.id;
            let grid = $('#' + GridID).data('kendoGrid');
            let row = $("#btn_" + Result_ID).closest('tr');
            let data_row = grid.dataItem(row);
            data_row.set("Remarks",txt);
            if(GridID == "ManualExecutionSteps_grid"){
                let store_data_binding = localStorage.getItem("ManualRunExecutionData");
                var store_data = JSON.parse(store_data_binding);

                store_data["Selected_TC_binding"] = grid.dataItems();
                localStorage.setItem("ManualRunExecutionData",JSON.stringify(store_data));
            }            

            if(old_value != txt){
                edit_step_remark(GridID, grid, row, data_row, txt);
            }
            
        })
    }

}

function bind_events() {
    $("#btn_move_left").on('click', function (e) {
        changeTCTab(-1);
    });

    $("#btn_move_right").on('click', function (e) {
        changeTCTab(1);
    });

    $("#finish_btn").on('click', function (e) {
        turnOffManualRun();
        SaveManualRunSteps();
    });

    $("#cancel_btn").on('click', function (e) {
        turnOffManualRun();
        DiscardManualRunSteps();
    });

    $('#upload_file_local_input').on('change', function (e) {
        debugger;
        let resultID = $("#upload_file_local_input").attr("data-id");
        let file = e.target.files[0];
        e.target.value = null;
        upload_snapShot_local(file, resultID)
    });

    $('#changeViewDDL').kendoDropDownList({
        dataSource:["Capture Video", "Create Ticket", "Create User Story"],
        valueTemplate: '<i class="oci oci-plus"></i>',
        template: function (e) {
            if(e == "Capture Video"){
                return `<a><i class="oci-video"></i> ${e}</a>`;
            }
            else if(e == "Create Ticket") {
                return `<a><i class="oci oci-flag"></i> ${e}</a>`;  
            }
            else if(e == "Create User Story") {
                return `<a><i class="oci oci-assignment_add"></i> ${e}</a>`;
            }
            
        },
        select: function(e) {
            debugger;
            if(e.dataItem == "Capture Video"){

            }
            else if(e.dataItem == "Create Ticket") {
                $('#ManualExecutionModel_div').addClass('hidden');
                $('#create_form_userStory_ticket_wrapper').load("/ManualTcAndQLM/UserStoryTicket/Create_userStoryTicket.html",function(e){
                    load_Create_form('Ticket')
                });     
            }
            else if(e.dataItem == "Create User Story") {
                $('#ManualExecutionModel_div').addClass('hidden');

                $('#create_form_userStory_ticket_wrapper').load("/ManualTcAndQLM/UserStoryTicket/Create_userStoryTicket.html",function(e){
                    load_Create_form('User Story')
                });
            }
        }
        
    })

    document.addEventListener("beforeunload", function () {
        if (isChange) {
            DiscardManualRunSteps();
        }
    });
}

function turnOffManualRun() {
    chrome.runtime.sendMessage({
        RESETOPKEYEXECUTIONINFORMATION: "RESETOPKEYEXECUTIONINFORMATION"
    }, function (response) {
        if (chrome.runtime.lastError) { }
    });
}

function get_current_cookie_binding() {
    
    $.ajax({
        url: opkey_url + "/Login/Get_Opkey_Cookies",
        data: { },
        type: "get",
        success: function (res) {
            debugger;

            Current_cookie_DTO = res;

        },
        error: function (error) {
            showError(error);
        }
    });
}

function upload_snapShot_local(file, resultID) {
    debugger;
    // let data = new Object();
    // data[file.name]=file;
    // data["SessionID"]=SessionID;
    // data["ResultID"]=resultID;

    let form_data = new FormData();
    form_data.append(file.name, file);

    $.ajax({
        url: opkey_url + "/Result/UploadActualResultSnapshot?SessionID=" + SessionID + "&Result_ID=" + resultID,
        data: form_data,
        dataType: 'json',
        type: "post",
        contentType: false,
        processData: false,
        success: function (res) {
            debugger;
            isChange = true;
            let GridID = $($("#btn_" + resultID).closest(".k-grid-content"))[0].parentElement.id;
            let grid = $('#' + GridID).data('kendoGrid');
            let row = $("#btn_" + resultID).closest('tr');

            let data_row = grid.dataItem(row);
            data_row.set("ActualResult_FID", res);

            if(GridID == "ManualExecutionSteps_grid"){
                let store_data_binding = localStorage.getItem("ManualRunExecutionData");
                var store_data = JSON.parse(store_data_binding);

                store_data["Selected_TC_binding"] = grid.dataItems();
                localStorage.setItem("ManualRunExecutionData",JSON.stringify(store_data));
            }      
            edit_manual_step(grid, row, data_row);

        },
        error: function (error) {
            debugger;
            showError(error);
        }
    });

}

$(document).ready(function () {
    get_Session_data();
});

function edit_step_remark(GridID, grid, row, step, comment) {

    $.ajax({
        url: opkey_url + "/Result/EditRemarks",
        data: { "SessionID": SessionID, "Result_ID": step.Result_ID, "remarks": comment },
        type: "get",
        success: function (res) {
            debugger;
            isChange = true;

            step.set("Remarks",comment);
            if(GridID == "ManualExecutionSteps_grid"){
                let store_data_binding = localStorage.getItem("ManualRunExecutionData");
                var store_data = JSON.parse(store_data_binding);

                store_data["Selected_TC_binding"] = grid.dataItems();
                localStorage.setItem("ManualRunExecutionData",JSON.stringify(store_data));
            }      
            notifier("Comment added","success");
            //edit_manual_step(grid, row, step);
            grid.collapseRow(row);
            delete dict_expand_row[step.Result_ID];
            //$("#tempDetailCommentSteps_"+step.Result_ID).remove();

        },
        error: function (error) {
            debugger;
            showError(error);
        }
    });
}

function edit_manual_step(grid, row, step) {

    $.ajax({
        url: opkey_url + "/Result/EditManualRunStep",
        data: { "ResultID": step.Result_ID, "SessionID": SessionID, "strComponentFlowStepData": JSON.stringify(step) },
        type: "get",
        success: function (res) {
            debugger;
            isChange = true;

            //grid.dataItem(row) = res;

        },
        error: function (error) {
            debugger;
            showError(error);
        }
    });
}

function Update_step_status(grid, row, status, dataItem, old_status, IsForce) {
    $.ajax({
        url:  opkey_url+ "/Result/EditManualRunStepStatus",
        data: { "SessionID": SessionID, "ResultID": dataItem.Result_ID, "status": status, forcefulUpdate: IsForce },
        type: "get",
        success: function (res) {
            debugger;
            isChange = true;


            res.forEach(function (item) {
                if (item.Type == "ManualFlow") {
                    Current_TC.Status = item.Status;
                    let TestCaseStatusDDL = $("#TestCaseStatusDDL").data('kendoDropDownList');
                    TestCaseStatusDDL.value(Current_TC.Status);
                    $(".testCase_step_class").removeClass("active");
                    $("#" + Current_TC.Result_ID).addClass("active");
                    $($("#" + Current_TC.Result_ID).closest('li')).removeClass("NotExecuted");
                    $($("#" + Current_TC.Result_ID).closest('li')).removeClass("Pass");
                    $($("#" + Current_TC.Result_ID).closest('li')).removeClass("Fail");
                    $($("#" + Current_TC.Result_ID).closest('li')).removeClass("Incomplete");
                    $($("#" + Current_TC.Result_ID).closest('li')).removeClass("SkippedOver");
                    $($("#" + Current_TC.Result_ID).closest('li')).addClass(Current_TC.Status);

                    let store_data_binding = localStorage.getItem("ManualRunExecutionData");
                    let store_data = JSON.parse(store_data_binding);
                    store_data.ManualRunExecutionData.SuiteSteps[Current_Index].Status = item.Status;

                    localStorage.setItem("ManualRunExecutionData",JSON.stringify(store_data));

                }
                else if (item.Type == "Suite") {
                    $("#SuiteStatusDDL").html(DOMPurify.sanitize('<i class="status_icon ' + item.Status + '"></i> '));
                    $("#SuiteStatusDDL").prop('title', item.Status);

                    let store_data_binding = localStorage.getItem("ManualRunExecutionData");
                    let store_data = JSON.parse(store_data_binding);
                    store_data['ManualRunExecutionData'].Suite.Status = item.Status;
                    localStorage.setItem("ManualRunExecutionData",JSON.stringify(store_data));
                }
                else {
                    if (item.ParentResult_ID == Current_TC.Result_ID) {
                        let TCgrid = $("#ManualExecutionSteps_grid").data('kendoGrid');
                        let row = $("#btn_" + item.Result_ID).closest('tr');
                        let data = TCgrid.dataItem(row);
                        data.set('Status', item.Status);
                        let store_data_binding = localStorage.getItem("ManualRunExecutionData");
                        let store_data = JSON.parse(store_data_binding);
            
                        store_data["Selected_TC_binding"] = TCgrid.dataItems();
                        localStorage.setItem("ManualRunExecutionData",JSON.stringify(store_data));

                        $($("#btn_" + item.Result_ID).find('strong')).removeAttr('class');
                        $($("#btn_" + item.Result_ID).find('strong')).addClass('status_' + item.Status);
                        $("#btn_" + item.Result_ID).prop('title', item.Status);
                    }
                    else {
                        let grid_step = $("#tempDetailFLSteps_" + item.ParentResult_ID).data('kendoGrid');
                        let row = $("#btn_" + item.Result_ID).closest('tr');
                        if (grid_step) {
                            let data_row = grid_step.dataItem(row);
                            data_row.set('Status', item.Status);
                            $($("#btn_" + item.Result_ID).find('strong')).removeAttr('class');
                            $($("#btn_" + item.Result_ID).find('strong')).addClass('status_' + item.Status);
                            $("#btn_" + item.Result_ID).prop('title', item.Status);
                        };

                    }
                }

            });

            if (dataItem.Type != "ManualFlow") {
                let data_row = grid.dataItem(row);
                data_row.set('Status', status);
                //grid.dataSourse.set(data_row);

                if (data_row.ParentResult_ID == Current_TC.Result_ID) {                   

                    let store_data_binding = localStorage.getItem("ManualRunExecutionData");
                    let store_data = JSON.parse(store_data_binding);
                    store_data["Selected_TC_binding"] =  grid.dataItems();
                    localStorage.setItem("ManualRunExecutionData",JSON.stringify(store_data));
                }

                
            }
            else{
                Current_TC.Status = status;
                let TestCaseStatusDDL = $("#TestCaseStatusDDL").data('kendoDropDownList');
                TestCaseStatusDDL.value(status);
                $(".testCase_step_class").removeClass("active");
                $("#" + Current_TC.Result_ID).addClass("active");
                $($("#" + Current_TC.Result_ID).closest('li')).removeClass("NotExecuted");
                $($("#" + Current_TC.Result_ID).closest('li')).removeClass("Pass");
                $($("#" + Current_TC.Result_ID).closest('li')).removeClass("Fail");
                $($("#" + Current_TC.Result_ID).closest('li')).removeClass("Incomplete");
                $($("#" + Current_TC.Result_ID).closest('li')).removeClass("SkippedOver");
                $($("#" + Current_TC.Result_ID).closest('li')).addClass(status);

                let store_data_binding = localStorage.getItem("ManualRunExecutionData");
                let store_data = JSON.parse(store_data_binding);
                store_data.ManualRunExecutionData.SuiteSteps[Current_Index].Status = status;

                localStorage.setItem("ManualRunExecutionData",JSON.stringify(store_data));
            }

        },
        error: function (error) {
            debugger;

            if (error.responseJSON.message.indexOf('Do you want to Continue') > -1) {
                let data = { grid: grid, row: row, status: status, dataItem: dataItem, old_status: old_status, IsForce: true };
                msgbox_callback(error.responseJSON.message, 'Info', force_update_status_callback, data);
            }
            else {
                showError(error);
            }
        }
    });
}


function force_update_status_callback(data) {
    Update_step_status(data.grid, data.row, data.status, data.dataItem, data.old_status, data.IsForce)
}

var dict_expand_row={};

function BindEditEventFor_actual_input() {
    $(".span_actual_Output").unbind().bind("click", function (e) {
        debugger;
        $(e.target).addClass('hidden');
        $(e.target.nextElementSibling).removeClass('hidden');
        $(e.target.nextElementSibling).focus();
       let GridID = $(e.target.closest(".k-grid-content"))[0].parentElement.parentElement.id;
        let grid = $('#' + GridID).data('kendoGrid');
        let GridRow = grid.dataItem(e.target.closest("tr"));
        let old_value = e.target.value;

        $(e.target.nextElementSibling).unbind().bind('blur', (ev) => {
            debugger;
            let txt = ev.target.value;
            GridRow.set('ActualResult', txt);
            if(GridID == "ManualExecutionSteps_grid"){
                let store_data_binding = localStorage.getItem("ManualRunExecutionData");
                var store_data = JSON.parse(store_data_binding);
    
                store_data["Selected_TC_binding"] = grid.dataItems();
                localStorage.setItem("ManualRunExecutionData",JSON.stringify(store_data));
            } 
            if (old_value != txt) {
                edit_manual_step(grid, $(ev.target.closest("tr")), GridRow);
            }

            $(ev.target).addClass('hidden');
            $(ev.target.previousSibling).removeClass('hidden');
            $(ev.target).unbind();
        });
    });

    $(".view_expected_snapShot_li").unbind().bind('click', function (e) {
        debugger;
        let GridID = $(e.target.closest(".k-grid-content"))[0].parentElement.parentElement.id;
        let grid = $('#' + GridID).data('kendoGrid');
        let GridRow = grid.dataItem(e.target.closest("tr"));

        get_image_base64_then_open(GridRow.ExpectedResult_FID, "Expected Snapshot");
    });
    $(".add_snapShot_li").unbind().bind('click', function (e) {
        debugger;
        let GridID = $(e.target.closest(".k-grid-content"))[0].parentElement.parentElement.id;
        let grid = $('#' + GridID).data('kendoGrid');
        let GridRow = grid.dataItem(e.target.closest("tr"));

        var json_addon = {
            "url": opkey_url,
            "Result_ID": GridRow.Result_ID,
            "SessionID": SessionID,
            "tc name": GridRow.Name,
            "utility": 'snapshot',
            "captureMode":"CAPTUREIMGAEVISIBLEAREA"
        };

        localStorage.removeItem("ManualRunnerSnapshotF_ID");
        localStorage.removeItem("OpkeyTestRunnerSnapData");
        localStorage.setItem("OpkeyTestRunnerSnapData", JSON.stringify(json_addon));

        clearTimeout(timeout_F_ID);
        check_for_FID(grid,$(e.target.closest("tr")), GridRow, GridID);
    });
    $(".upload_attachment_snapShot_li").unbind().bind('click', function (e) {
        debugger;
        let GridID = $(e.target.closest(".k-grid-content"))[0].parentElement.parentElement.id;
        let grid = $('#' + GridID).data('kendoGrid');
        let GridRow = grid.dataItem(e.target.closest("tr"));
    });
    $(".upload_local_snapShot_li").unbind().bind('click', function (e) {
        debugger;
        let GridID = $(e.target.closest(".k-grid-content"))[0].parentElement.parentElement.id;
        let grid = $('#' + GridID).data('kendoGrid');
        let GridRow = grid.dataItem(e.target.closest("tr"));

        $('#upload_file_local_input').attr('data-id', GridRow.Result_ID);
        $('#upload_file_local_input').click();

    });
    $(".add_gif_snapShot_li").unbind().bind('click', function (e) {
        debugger;
        let GridID = $(e.target.closest(".k-grid-content"))[0].parentElement.parentElement.id;
        let grid = $('#' + GridID).data('kendoGrid');
        let GridRow = grid.dataItem(e.target.closest("tr"));

        var json_addon = {
            "url": opkey_url,
            "Result_ID": GridRow.Result_ID,
            "SessionID": SessionID,
            "tc name": GridRow.Name,
            "utility": 'video',
            "captureMode":"CaptureCurrentWithTabCaptureApi"
        };

        localStorage.removeItem("ManualRunnerSnapshotF_ID");
        localStorage.removeItem("OpkeyTestRunnerSnapData");
        localStorage.setItem("OpkeyTestRunnerSnapData", JSON.stringify(json_addon));

        clearTimeout(timeout_F_ID);
        check_for_FID(grid,$(e.target.closest("tr")),GridRow, GridID);
    });
    $(".view_snapShot_li").unbind().bind('click', function (e) {
        debugger;
        let GridID = $(e.target.closest(".k-grid-content"))[0].parentElement.parentElement.id;
        let grid = $('#' + GridID).data('kendoGrid');
        let GridRow = grid.dataItem(e.target.closest("tr"));

        get_image_base64_then_open(GridRow.ActualResult_FID, "Actual Snapshot");
    });
    $(".remove_snapShot_li").unbind().bind('click', function (e) {
        debugger;
        let GridID = $(e.target.closest(".k-grid-content"))[0].parentElement.parentElement.id;
        let grid = $('#' + GridID).data('kendoGrid');
        let GridRow = grid.dataItem(e.target.closest("tr"));
        GridRow.set('ActualResult_FID', empty_guid);
        if(GridID == "ManualExecutionSteps_grid"){
            let store_data_binding = localStorage.getItem("ManualRunExecutionData");
            var store_data = JSON.parse(store_data_binding);

            store_data["Selected_TC_binding"] = grid.dataItems();
            localStorage.setItem("ManualRunExecutionData",JSON.stringify(store_data));
        }      
        edit_manual_step(grid, $(e.target.closest("tr")), GridRow);

        notifier("Attachment removed","success");
    });

    $(".expand_comment_input").unbind().bind('click',function(e){
        debugger;
        let GridID = $(e.target.closest(".k-grid-content"))[0].parentElement.parentElement.id;
        let grid = $('#' + GridID).data('kendoGrid');
        let GridRow = grid.dataItem(e.target.closest("tr"));

        Object.keys(dict_expand_row).forEach((item) =>{    
            if(GridRow.Result_ID != item) {
                grid.collapseRow(dict_expand_row[item]);
                delete dict_expand_row[item];
            }            
        });

        if(!dict_expand_row.hasOwnProperty(GridRow.Result_ID)) {
            dict_expand_row[GridRow.Result_ID] = e.currentTarget.closest('tr');
            grid.expandRow(e.currentTarget.closest('tr'));
        }
        else {
            delete dict_expand_row[GridRow.Result_ID];

            grid.collapseRow(e.currentTarget.closest('tr'));
            //$("#tempDetailCommentSteps_"+GridRow.Result_ID).remove();
        }
       
    })

}


var timeout_F_ID=null;

function check_for_FID(grid,row, step, GridID){
    let manual_capture_binding = localStorage.getItem('ManualRunnerSnapshotF_ID');
    if(manual_capture_binding){
        localStorage.removeItem('ManualRunnerSnapshotF_ID');
        clearTimeout(timeout_F_ID);
        let ManualRunnerSnapshotF_ID = JSON.parse(manual_capture_binding).F_ID;
        //step.ActualResult_FID = ManualRunnerSnapshotF_ID;
        step.set("ActualResult_FID",ManualRunnerSnapshotF_ID);

        if(GridID == "ManualExecutionSteps_grid"){
            let store_data_binding = localStorage.getItem("ManualRunExecutionData");
            var store_data = JSON.parse(store_data_binding);

            store_data["Selected_TC_binding"] = grid.dataItems();
            localStorage.setItem("ManualRunExecutionData",JSON.stringify(store_data));
        }      
        edit_manual_step(grid, row, step);
        return;
    }
    clearTimeout(timeout_F_ID);
    timeout_F_ID = setTimeout(function(){
        check_for_FID(grid, row, step, GridID);
    },2000);
}

function get_image_base64_then_open(F_ID, title){
    
    $.ajax({
        url: opkey_url + "/Result/getManualStepScreenShot",
        data: { "f_ID": F_ID, "SessionID": SessionID },
        type: "get",
        success: function (result) {
            debugger;

            if(result.fileName.indexOf("png") > -1 || result.fileName.indexOf("jpg") > -1 || result.fileName.indexOf("jpeg") > -1){
                imageURL="data:image/png;base64,"+result.base64Data;
              }
              else if(result.fileName.indexOf("gif") > -1) {
                imageURL="data:image/gif;base64,"+result.base64Data;
              }
              else{
                msgBox("Preview not available","error")
                return;
              }

            // let link = document.createElement('a');
            // link.href = imageURL;
            // link.target = '_blank';
            // document.body.appendChild(link);
            // link.click();
            // link.remove();

            let html = '<html><head><title>'+title+'</title></head><body style="width: 100%; height: 100%; margin: 0px;"><img src="' + imageURL + '" style="width: inherit; height: auto;" /></body></html>';
            var w = window.open("");
            w.document.title = title;
            w.document.write(html);
            

        },
        error: function (error) {
            debugger;
            showError(error);
        }
    });
}


function SaveManualRunSteps() {
    $.ajax({
        url: opkey_url + "/Result/SaveManualRunSteps",
        data: { "SessionID": SessionID },
        type: "get",
        success: function (res) {
            debugger;
            
            
            debugger;
            let bindingObject = {state: "Close"};
            localStorage.removeItem("SessionID");
            localStorage.removeItem("ManualFlowBPGroupID");
            localStorage.removeItem("ManualRunExecutionData");

            chrome.runtime
                .sendMessage({
                    SetOpkeyOne_addon_binding: bindingObject
                },
                    function (response) { });
                    notifier("Execution completed successfully","success");
                    
                let close = function (){window.close();}
                msgbox("Execution completed successfully", 'success', close);
                $(".app_closeRadiusBtn").remove();

        },
        error: function (error) {
            debugger;
            showError(error);
        }
    });
}

function DiscardManualRunSteps() {
    if (!isChange) {
        
        
        debugger;
        let bindingObject = {state: "Close"};
        localStorage.removeItem("SessionID");
        localStorage.removeItem("ManualFlowBPGroupID");
        localStorage.removeItem("ManualRunExecutionData");

        chrome.runtime
            .sendMessage({
                SetOpkeyOne_addon_binding: bindingObject
            },
                function (response) { });
        window.close();
        return false;
    }
    $.msgBox({
        title: "Opkey",
        content: "There are some unsaved data. Do you want to Save?",
        modal: true,
        type: "Confirm",
        buttons: [{ value: "Yes" }, { value: "No" }],
        success: function (result) {
            if (result === "Yes") {
                SaveManualRunSteps();
            }
            else {
                $.ajax({
                    url: opkey_url + "/Result/DiscardManualRunSteps",
                    data: { "SessionID": SessionID },
                    type: "get",
                    success: function (res) {
                        debugger;
                        
                        
                        debugger;
                        let bindingObject = {state: "Close"};
                        localStorage.removeItem("SessionID");
                        localStorage.removeItem("ManualFlowBPGroupID");
                        localStorage.removeItem("ManualRunExecutionData");

                        chrome.runtime
                            .sendMessage({
                                SetOpkeyOne_addon_binding: bindingObject
                            },
                                function (response) { });
                        window.close();

                    },
                    error: function (error) {
                        debugger;
                        showError(error);
                    }
                });
            }
        }

    });

}
