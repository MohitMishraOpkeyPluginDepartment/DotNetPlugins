var rowno=0;
var executionResultThread=-1;
$(document).ready(function(){
    var gridWidth = $('.op-step-grid').innerWidth();
    console.log("gridWidth", gridWidth);
    $("#resultdomgrid").jqGrid({
        autoencode: true,
        width: gridWidth,
        height: 'auto',
        shrinkToFit: true,
        colModel: [
            { name: "Action", type: "text", editable: false, sortable: false },
            { name: "Object", type: "text", editable: false, sortable: false },
            { name: "Data", type: "text", editable: false, sortable: false },
            { name: "Status", type: "text", editable: false, sortable: false }
        ],
    });


    $("#pause_execution").click(function(e){
        if($("#pause_execution").hasClass("fa-pause")){
            $("#pause_execution").removeClass("fa-pause");
            $("#pause_execution").addClass("fa-play");
            $("#pause_execution").attr("title","Resume Execution");
            pauseExecution();
            return;
        }
        
        $("#pause_execution").removeClass("fa-play");
        $("#pause_execution").addClass("fa-pause");
        $("#pause_execution").attr("title","Pause Execution");
        resumeExecution();
    });
    
    $("#stop_execution").click(function(e){
        lastPausePressed=false;
        $("#executeButton").removeClass("fa-pause");
        $("#executeButton").addClass("fa-play");
        $("#executeButtonHolder").attr("title","Play");
        stopExecution();
    });
});

function pauseExecution(){
    saas_object.ShowToastMessage("", "Pausing Execution");
    $.ajax({
        url: "http://localhost:8090/pauseExecution",
        type: "GET",
        success: function(returned_data) {
            saas_object.ShowToastMessage("", "Execution Paused");
        },
        error: function(returned_error_data) {
            saas_object.ShowToastMessage("error", "Error in Pausing Execution.");
        }
    });
}

function resumeExecution(){
    saas_object.ShowToastMessage("", "Resuming Execution");
    $.ajax({
        url: "http://localhost:8090/resumeExecution",
        type: "GET",
        success: function(returned_data) {
            saas_object.ShowToastMessage("", "Execution Resumed");
        },
        error: function(returned_error_data) {
            saas_object.ShowToastMessage("error", "Error in Resuming Execution.");
        }
    });
}

function stopExecution(){
    saas_object.ShowToastMessage("", "Stopping Execution");
    $.ajax({
        url: "http://localhost:8090/stopExecution",
        type: "GET",
        success: function(returned_data) {
            saas_object.ShowToastMessage("", "Execution Stoped");
        },
        error: function(returned_error_data) {
            saas_object.ShowToastMessage("error", "Error in Stopping Execution.");
        }
    });
}

function getCurrentFunctionResult(){
    if(true){
        return;
    }
    $.ajax({
        url: "http://localhost:8090/getCurrentStepFunctionResult",
        type: "GET",
        success: function(returned_data) {
            addResultStepObject(returned_data);
        },
        error: function(returned_error_data) {

        }
    });
}

function startExecutionResultFetch(){
    executionResultThread = window.setInterval(function(){
        getCurrentFunctionResult();
    },1000);
}

startExecutionResultFetch();

function stopExecutionResultFetch(){
    window.clearInterval(executionResultThread);
}

function addResultStepObject(_resultObject){
    if(_resultObject==null){
        return;
    }
    addResultStep(_resultObject.keywordName,_resultObject.objectName,_resultObject.data,_resultObject.status);
}

function addResultStep(_action, _objectname, _data, _status){
    if(_objectname==null){
        _objectname="";
    }
    if(_objectname==""){
        _objectname="Not Required"
    }
    var object = new Object();
    object.Action = _action;
    object.Object = _objectname;
    object.Data = _data;
    object.Status = _status;
    $("#resultdomgrid").jqGrid("addRowData", rowno, object);
    var _table=document.getElementById("resultdomgrid");
        var _row=_table.getElementsByTagName("TR")[rowno + 1];
        if(_row){
            var _column=_row.getElementsByTagName("TD")[3];
            if(_column){
                if(_status=="Pass"){
                    //$(_column).css("background-color","green");
                    $(_column).html('<span title="Pass" class="label Pass">Pass</span>');
                }
                else{
                    //$(_column).css("background-color", "red");
                    $(_column).html('<span title="Fail" class="label Fail">Fail</span>');
                }
            }
        }
    rowno++;
}

function showButtonHolder(){
    $("#resultViewButtonHolder").show();
}

function hideButtonHolder(){
    $("#resultViewButtonHolder").hide();
}

function clearResultGrid(){
    rowno=0;
    $("#resultdomgrid").jqGrid("clearGridData");
}