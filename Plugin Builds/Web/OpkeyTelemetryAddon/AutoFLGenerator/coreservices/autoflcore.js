let choosen_fl_id = null;

let artifactTypeToCreate = "";

let selectedRowIndex = -1;

let rowIndexCount = 0;

function fetchAndDisplayFlData() {
    saas_object.BlockUI("Fetching Data!");
    window.setTimeout(function () {
        chrome.runtime.sendMessage({
            FetchAutoFlCreationData: { "action": "Wd_RefreshElements" }
        }, function (response) {
            if (chrome.runtime.lastError) { }
            console.log(response);
            last_steps_data_array = [];
            populateDataInAutoFlUi(response);
            if (fl_sectionHeader != null) {
                $("#componentNameField").val(fl_sectionHeader);
            }
            else {
                $("#componentNameField").val(getArtifactName("AutomatedFunctionLibrary_"));
            }
            saas_object.UnBlockUI();
        });
    }, 2000);
}

function fetchNewElementAndDisplayFlData() {
    saas_object.BlockUI("Fetching New Changes!");
    window.setTimeout(function () {
        chrome.runtime.sendMessage({
            FetchAutoFlCreationData: {}
        }, function (response) {
            if (chrome.runtime.lastError) { }
            console.log(response);


            response = processAndAddNewElement(response);

            populateDataInAutoFlUi(response);

            if (fl_sectionHeader != null) {
                $("#componentNameField").val(fl_sectionHeader);
            }
            else {
                $("#componentNameField").val(getArtifactName("AutomatedFunctionLibrary_"));
            }

            saas_object.UnBlockUI();
        });
    }, 2000);
}


function processAndAddNewElement(_response) {

    _response.forEach(function (dataArray, index) {

        if (dataArray != null) {
            dataArray.forEach(function (stepdata, index) {
                var stepObjectArray = stepdata["StepObject"];
                if (stepObjectArray != null) {
                    if (stepObjectArray.length > 0) {

                        stepObjectArray.forEach(function (stepObject, index) {
                            var stepElementId = stepObject["StepElementId"];
                            if (stepElementId != null) {
                                if (all_steps_stepelementId_array.indexOf(stepElementId) == -1) {
                                    addInExistingHeader(stepdata["HeaderName"], stepObject, stepdata);
                                } else {
                                    updateInExistingHeader(stepdata["HeaderName"], stepObject, stepdata);
                                }
                            }
                        });

                    }
                }
            });
        }
    });

    return all_data_response;
}

function addInExistingHeader(headerName, stepObject, mainStepdata) {
    var stepDataAdded = false;
    all_data_response.forEach(function (dataArray, index) {

        if (dataArray != null) {
            dataArray.forEach(function (stepdata, index) {
                if (headerName == stepdata["HeaderName"]) {
                    var stepObjectArray = stepdata["StepObject"];
                    if (stepObjectArray != null) {
                        stepObjectArray.push(stepObject);
                        stepDataAdded = true;
                    }
                }
            });
        }
    });

    if (stepDataAdded == false) {
        all_data_response[0].push(mainStepdata);
        debugger
    }
}

function updateInExistingHeader(headerName, stepObject, mainStepdata) {
    var stepDataAdded = false;
    all_data_response.forEach(function (dataArray, index) {

        if (dataArray != null) {
            dataArray.forEach(function (stepdata, index) {
                if (headerName == stepdata["HeaderName"]) {
                    var stepObjectArray = stepdata["StepObject"];
                    if (stepObjectArray != null) {
                        var existingStep = stepObjectArray.find(obj => obj.StepElementId === stepObject.StepElementId);

                        if (existingStep) {
                            existingStep.InputParameterDefaultValue = stepObject.InputParameterDefaultValue;
                            if (stepObject.DataArguments) {
                                existingStep.DataArguments = { ...existingStep.DataArguments, ...stepObject.DataArguments };
                            }
                            stepDataAdded = true;
                        }
                    }
                }
            });
        }
    });

    if (stepDataAdded == false) {
        all_data_response[0].push(mainStepdata);
    }
}

var all_data_response;
var all_steps_data_array = [];
var last_steps_data_array = [];
var all_steps_stepelementId_array = [];
var temp_artifact_id = null;
var temp_or_id = null;

var saas_object = new Saas();
var current_selected_step_object

let fl_sectionHeader = null;

function populateDataInAutoFlUi(_response) {

    rowIndexCount = 0;
    all_steps_data_array = [];
    var local_all_steps_stepelementId_array = [];
    $("#mainStepHolderContainer").html("");

    all_data_response = _response;
    if (_response == null) {
        return;
    }

    fl_sectionHeader = null;
    var totalHeaderCount = 0;

    _response.forEach(function (dataArray, index) {

        if (dataArray != null) {

            var headerIndex = 0;
            dataArray.forEach(function (stepdata, index) {

                headerIndex++;

                var headerName = stepdata["HeaderName"];

                var stepObjectArray = stepdata["StepObject"];

                let sectionHeader = stepdata["SectionHeader"];

                if (sectionHeader != null && fl_sectionHeader == null) {
                    fl_sectionHeader = sectionHeader;
                    sessionStorage.setItem("fl_Name", sectionHeader);
                }
                if (stepObjectArray != null) {

                    if (stepObjectArray.length > 0) {
                        totalHeaderCount++;
                    }
                    var content = "";

                    if (stepObjectArray.length > 0) {
                        content = '<div class="mb-3 border_bottom" id="accordion-header">' +
                            '<div class="px-0 d-flex justify-content-between accordian_dropdown">' +
                            '<div>' +
                            '<i class="fa fa-key me-2"></i>' +
                            '<span>' +
                            '' + headerName + '' +
                            '</span>' +
                            '</div>' +
                            //         '<div class=" px-0">' +
                            //         '<span class="number_style me-2">1</span>' +
                            //         '<i class="fa fa-chevron-down dropdown-icon"></i>' +
                            //         '</div>' +
                            '</div>' +
                            '</div>' +

                            '<div class="table_format_accordian">' +
                            '<table class="table table-bordered">' +
                            '<thead class="thead-light">' +
                            '<tr>' +
                            '<th style="text-align: center; width: 6rem;"><input type="checkbox" style="display:none;"></th>' +
                            '<th style="width: 36rem;">Keyword</th>' +
                            '<th style="width: 40rem;">Label</th>' +
                            '<th style="width: 50rem;">DataInput</th>' +
                            '</tr>' +
                            '</thead>' +
                            '<tbody id="mainAutoFlGridTable_' + headerIndex + '">' +

                            '</tbody>' +
                            '</table>' +
                            '</div>';

                        $('#mainStepHolderContainer').append(content);

                        document.getElementById("mainAutoFlGridTable_" + headerIndex).addEventListener('click', function (e) {
                            let clickedRow = e.target.closest('tr.stepRow');

                            if (clickedRow) {
                                document.querySelectorAll('tr.stepRow').forEach(row => {
                                    row.classList.remove('stepRowSelected');
                                });
                                clickedRow.classList.add('stepRowSelected');

                                $("#fetchFLButton2").prop("disabled", false);

                                checkAllGridConditions();
                            }
                        });
                    }



                    stepObjectArray.forEach(function (stepObject, index) {

                        stepObject["IsFunctionLibrary"] = false;

                        stepObject["HeaderIndex"] = headerIndex;

                        if (stepObject["StepElementId"] != null && local_all_steps_stepelementId_array.indexOf(stepObject["StepElementId"]) > -1) {
                            return
                        }
                        if (stepObject["StepElementId"] != null) {
                            all_steps_stepelementId_array.push(stepObject["StepElementId"]);
                            local_all_steps_stepelementId_array.push(stepObject["StepElementId"]);
                        }

                        all_steps_data_array.push(stepObject);
                    });
                }

            });
        }
    });

    renderAllStepsArray(all_steps_data_array);

    $("#totalHeadersCount").text(totalHeaderCount);

    if (selectedRowIndex > -1) {
        debugger
        let selectedRowElement = getSelectedStepRowBtRowIndex(selectedRowIndex);

        if (selectedRowElement) {
            //  $(selectedRowElement).click();
        }
    }


    let cloned_steps_array = last_steps_data_array;

    if (cloned_steps_array != null && cloned_steps_array.length > 0) {
        console.log(cloned_steps_array);

        cloned_steps_array.forEach(function (object, index) {
            if (object["IsFunctionLibrary"] != null && object["IsFunctionLibrary"] == true) {

                index -= 1;
                addRCStepObjectOnIndex(object, index);
            }
        });
    }

    last_steps_data_array = all_steps_data_array;
}


function clearAllDataFromStepGrid() {
    for (let ia = 0; ia < 20; ia++) {
        $('#mainAutoFlGridTable_' + ia).html("");
    }
}

function addGlobalListeners() {
    $(".stepSelectCheckbox").unbind().click(function (e) {
        var _element = e.target;
        var stepId = _element.getAttribute("stepId");
        var stepObject = getStepObjectByStepId(stepId);

        var selectRowElement = getSelectedStepRow();
        if (selectRowElement) {
            selectedRowIndex = parseInt(selectRowElement.getAttribute("rowIndex"));
        }


        if ($(this).is(':checked')) {
            stepObject["StepSelected"] = true;
            rowIndexCount = 0;
            renderAllStepsArray(all_steps_data_array);
        } else {
            stepObject["StepSelected"] = false;
            rowIndexCount = 0;
            renderAllStepsArray(all_steps_data_array);
        }
    });

    $(".stepEditButton").unbind().click(function (e) {
        var _element = e.target;
        var stepId = _element.getAttribute("stepId");
        var stepObject = getStepObjectByStepId(stepId);

        current_selected_step_object = stepObject;
        renderDataInputArguments();
        openDataArgumentsEditorUi();
    });

}

function renderAllStepsArray(all_steps_array) {
    clearAllDataFromStepGrid();
    all_steps_array.forEach(function (stepObject, index) {
        var stepId = stepObject["StepId"];
        var stepSelected = stepObject["StepSelected"];
        var elementType = stepObject["ElementType"];
        var keywordName = stepObject["Keyword"];
        var labelName = stepObject["LabelName"];

        var headerIndex = stepObject["HeaderIndex"];

        if (labelName == null || labelName == "") {
            labelName = stepObject["TableName"];
        }

        if (labelName == null || labelName == "") {
            labelName = stepObject["ColumnName"];
        }

        if (stepObject["FLName"] != null) {
            keywordName = stepObject["FLName"];
            labelName = "";
        }

        var dataArguments = stepObject["DataArguments"];


        var checkBoxHtml = '<th style="text-align: center;"><input stepId="' + stepId + '" class="stepSelectCheckbox" type="checkbox" checked></th>';

        if (stepSelected == false) {
            checkBoxHtml = '<th style="text-align: center;"><input stepId="' + stepId + '" class="stepSelectCheckbox" type="checkbox"></th>';
        }

        var dataArgumentStr = convertDataArgumentsToString(dataArguments);

        var dataArgumentHtml = "";

        if (dataArgumentStr != null && dataArgumentStr != "" && dataArgumentStr != "{}") {
            dataArgumentHtml = dataArgumentStr + '<br><input class="stepEditButton" stepId="' + stepId + '" type="button" value="Edit">';
        }

        var rowContent = '<tr class="stepRow" headerIndex=' + headerIndex + ' rowIndex=' + rowIndexCount + ' id="' + stepId + '">' + checkBoxHtml
            +
            '<td>' + keywordName + '</td>' +
            '<td>' + labelName + '</td>' +
            '<td>' + dataArgumentHtml + '</td>' +
            '</tr>';

        $('#mainAutoFlGridTable_' + headerIndex).append(rowContent);

        rowIndexCount++;
    });

    addGlobalListeners();
}

function checkAllGridConditions() {
    let selectedRow = getSelectedStepRow();
    if (selectedRow == null) {
        return;
    }
    console.log(selectedRow);

    let selectedRowIndex = parseInt(selectedRow.getAttribute("rowIndex"));

    const rows = getAllStepRows(selectedRow);

    if (rows.length > 0) {
        if (selectedRowIndex == 0) {
            $("#moveUpFLButton2").prop("disabled", true);
        }
        else {
            $("#moveUpFLButton2").prop("disabled", false);
        }

        if (selectedRowIndex > 0 && selectedRowIndex == (rows.length - 1)) {
            $("#moveDownButton2").prop("disabled", true);
        }
        else {
            $("#moveDownButton2").prop("disabled", false);
        }
        $("#deletStepButton").prop("disabled", false);
    }
    else {
        $("#deletStepButton").prop("disabled", true);
        $("#moveUpFLButton2").prop("disabled", true);
        $("#moveDownButton2").prop("disabled", true);
    }
}

function getSelectedStepRow() {
    return document.querySelector("tr.stepRowSelected");
}

function getSelectedStepRowBtRowIndex(stepRowIndex) {
    const allTrs = document.querySelectorAll('tr');
    for (const row of allTrs) {
        if (row.getAttribute("rowindex") == stepRowIndex.toString()) {
            return row;
        }
    }
    return null;

}

function listemForUIUpdates() {
    window.addEventListener("message", function (event) {
        const receivedData = event.data;

        if (receivedData) {
            let _action = receivedData.action;
            let _data = receivedData.data;
            if (_action === "AddRCToGrid") {
                addRCAfterSelectedRow(_data);
                checkAllGridConditions();
            }

            if (_action === "DeleteStep") {
                deleteStep();
                checkAllGridConditions();
            }

            if (_action === "MoveStepUp") {
                moveStepUp();
                checkAllGridConditions();
            }

            if (_action === "MoveStepDown") {
                moveStepDown();
                checkAllGridConditions();
            }
        }
    });
}

function deleteStep() {
    let selectedRow = getSelectedStepRow();
    let tempSelectedRow = selectedRow;
    let selectedRowIndex = parseInt(selectedRow.getAttribute("rowIndex"));

    all_steps_data_array.splice(selectedRowIndex, 1);

    selectedRow.remove();        // ← modern


    reIndexAllRows(tempSelectedRow);


}

function moveStepUp() {
    let selectedRow = getSelectedStepRow();

    if (selectedRow == null) {
        return;
    }

    let selectedRowIndex = parseInt(selectedRow.getAttribute("rowIndex"), 10);

    if (selectedRowIndex === 0) return;

    let currentStep = all_steps_data_array[selectedRowIndex];
    let previousStep = all_steps_data_array[selectedRowIndex - 1];

    if (currentStep == null || previousStep == null) {
        return;
    }

    previousStep["HeaderIndex"] = currentStep["HeaderIndex"];
    all_steps_data_array[selectedRowIndex] = previousStep;
    all_steps_data_array[selectedRowIndex - 1] = currentStep;

    const prev = getSelectedStepRowBtRowIndex(selectedRowIndex - 1);
    if (prev) {
        const prevParent = prev.parentNode;
        $(selectedRow).attr("headerindex", $(prev).attr("headerindex"));
        prevParent.insertBefore(selectedRow, prev);
    }

    reIndexAllRows(selectedRow);
}


function moveStepDown() {
    const selectedRow = getSelectedStepRow();
    if (selectedRow == null) {
        return;
    }
    const selectedRowIndex = parseInt(selectedRow.getAttribute("rowIndex"), 10);
    const lastIndex = all_steps_data_array.length - 1;

    if (selectedRowIndex >= lastIndex) return;

    const currentStep = all_steps_data_array[selectedRowIndex];
    const nextStep = all_steps_data_array[selectedRowIndex + 1];

    if (currentStep == null || nextStep == null) {
        return;
    }

    nextStep["HeaderIndex"] = currentStep["HeaderIndex"];

    all_steps_data_array[selectedRowIndex] = nextStep;
    all_steps_data_array[selectedRowIndex + 1] = currentStep;

    const nextRow = getSelectedStepRowBtRowIndex(selectedRowIndex + 1);
    if (nextRow) {
        $(selectedRow).attr("headerindex", $(nextRow).attr("headerindex"));
        const nextParent = nextRow.parentNode;
        nextParent.insertBefore(selectedRow, nextRow.nextElementSibling);
    }

    reIndexAllRows(selectedRow);
}


function addRCAfterSelectedRow(_rcData) {

    let flName = DOMPurify.sanitize(_rcData.text);
    let flId = DOMPurify.sanitize(_rcData.id.toString());
    
    reIndexAllRow();
    let selectedRow = getSelectedStepRow();
    let selectedRowIndex = parseInt(selectedRow.getAttribute("rowIndex"), 10);
    let keywordName = DOMPurify.sanitize(flName);
    let stepId = flId;
    let index = 0;
    let labelName = "";  
    let dataArgumentHtml = "";  
    let headerIndex = DOMPurify.sanitize($(selectedRow).attr("headerindex") || "");
    let $newRow = $(`
      <tr class="stepRow" headerindex="${headerIndex}" rowIndex="${index}" id="${stepId}">
        <th style="text-align: center;">
          <input stepId="${stepId}" flId="${flId}" class="stepSelectCheckbox" type="checkbox" checked>
        </th>
        <td>${keywordName}</td>
        <td>${labelName}</td>
        <td>${dataArgumentHtml}</td>
      </tr>
    `);
    
    $(selectedRow).after($newRow);

    let flStepObject = new Object();

    flStepObject["ComponentInputParameterName"] = null;
    flStepObject["DataArguments"] = null;
    flStepObject["DynamicOrObject"] = null;
    flStepObject["ElementType"] = null;
    flStepObject["InputParameterDefaultValue"] = "";
    flStepObject["Keyword"] = null;
    flStepObject["LabelName"] = null;
    flStepObject["StepElement"] = null;
    flStepObject["StepElementId"] = null;
    flStepObject["StepId"] = stepId;
    flStepObject["StepSelected"] = true;
    flStepObject["ComponentId"] = flId;
    flStepObject["IsFunctionLibrary"] = true;
    flStepObject["FLName"] = flName;
    flStepObject["HeaderIndex"] = $(selectedRow).attr("headerindex");
    all_steps_data_array.splice(selectedRowIndex + 1, 0, flStepObject);

    reIndexAllRows(selectedRow);
}

function addRCStepObjectOnIndex(stepObject, addAfterRowIndex) {
    debugger
    let flName = stepObject.FLName;
    let flId = stepObject.ComponentId;

    let selectedRow = null;

    if (addAfterRowIndex == -1) {
        selectedRow = getSelectedStepRowBtRowIndex(0);
    }
    else {
        selectedRow = getSelectedStepRowBtRowIndex(addAfterRowIndex);
    }

    if (selectedRow == null) {
        return;
    }
    console.log(selectedRow);

    let selectedRowIndex = parseInt(selectedRow.getAttribute("rowIndex"));

    let keywordName = flName;
    let stepId = flId;
    let index = 0;
    let labelName = "";
    let dataArgumentHtml = "";
    var checkBoxHtml = '<th style="text-align: center;"><input stepId="' + stepId + '" flId="' + flId + '" class="stepSelectCheckbox" type="checkbox" checked></th>';
    var rowContent = '<tr class="stepRow" rowIndex=' + index + ' id="' + stepId + '">' +
        checkBoxHtml +
        '<td>' + keywordName + '</td>' +
        '<td>' + labelName + '</td>' +
        '<td>' + dataArgumentHtml + '</td>' +
        '</tr>';

    if (addAfterRowIndex == -1) {
        $(selectedRow).before(rowContent);
        all_steps_data_array.splice(selectedRowIndex, 0, stepObject);
    }
    else {
        $(selectedRow).after(rowContent);
        all_steps_data_array.splice(selectedRowIndex + 1, 0, stepObject);
    }


    reIndexAllRows(selectedRow);
}

function reIndexAllRow() {
    $('.stepRow').each(function (index) {
        $(this).attr('rowIndex', index);
    });
}

function reIndexAllRows(selectedRow) {
    const rows = getAllStepRows(selectedRow);

    rows.forEach((row, index) => {
        row.setAttribute("rowIndex", index);
    });
}

function getAllStepRows(selectedRow) {
    const parent = selectedRow.parentElement;
    if (!parent) return [];


    const rows = Array.from(parent.children).filter(
        el => el.tagName.toLowerCase() === 'tr'
    );

    return rows;
}

function renderDataInputArguments() {
    console.log(current_selected_step_object);
    var dataArguments = current_selected_step_object["DataArguments"];

    const entries = Object.entries(dataArguments);

    var dataArgumentHolderTable = document.getElementById("autofldataarguments_holder");

    $(dataArgumentHolderTable).html("");
    var tbody_element = document.createElement("TBODY");

    entries.forEach(([name, value]) => {



        var arg_name = name;
        var arg_type = "STRING";
        var tr_element = document.createElement("TR");
        var td_Name_element = document.createElement("TD");
        td_Name_element.id = "Name";
        td_Name_element.innerText = arg_name;
        var td_Type_element = document.createElement("TD");
        td_Type_element.id = "Type";

        var input_element = document.createElement("INPUT");
        if (arg_type == "STRING" || arg_type == "String") {
            input_element.type = "text";
            if (value != null) {
                input_element.value = value;
            } else {
                input_element.value = ""
            }
        }

        input_element.fieldName = arg_name;
        input_element.placeholder = "Enter Value";
        input_element.title = "Enter Value";
        td_Type_element.appendChild(input_element);

        tr_element.appendChild(td_Name_element);
        tr_element.appendChild(td_Type_element);
        tbody_element.appendChild(tr_element);

    });
    dataArgumentHolderTable.append(tbody_element);

}

function setAllChangedData() {
    var dataArgumentHolderTable = document.getElementById("autofldataarguments_holder");
    var allInputElements = dataArgumentHolderTable.getElementsByTagName("INPUT");

    for (var aie = 0; aie < allInputElements.length; aie++) {
        var fieldName = allInputElements[aie].fieldName;
        var fieldValue = allInputElements[aie].value;

        var dataArguments = current_selected_step_object["DataArguments"];

        const entries = Object.entries(dataArguments);


        entries.forEach(([name, value]) => {
            if (name == fieldName) {
                dataArguments[name] = fieldValue;
            }
        });
    }

    renderAllStepsArray(all_steps_data_array);
    // populateDataInAutoFlUi(all_data_response);
}


function getStepObjectByStepId(_stepId) {
    for (var asi = 0; asi < all_steps_data_array.length; asi++) {
        if (all_steps_data_array[asi]["StepId"] == _stepId) {
            return all_steps_data_array[asi];
        }
    }

    return null;
}

function convertDataArgumentsToString(_dataArguments) {

    if (_dataArguments == null || _dataArguments == "") {
        return "";
    }
    var out = "";
    const keys = Object.keys(_dataArguments);
    for (const key of keys) {
        const value = _dataArguments[key];
        out += " " + key + " : " + value + "<br>"
    }
    return out;
}

function Get_Opkey_URL(setting_key) {
    return localStorage.getItem(setting_key);
}

function Get_Default_Parent_Node() {
    saas_object.BlockUI("Saving & Creating Reusable Component!");
    var opkey_end_point = Get_Opkey_URL("OPKEY_DOMAIN_NAME");
    //  loadingStart('#divPanel_New_Artifact', "Please Wait ...", ".btn");          //SAS-7919
    $.ajax({
        url: opkey_end_point + "/ExplorerTree/CreateDefaultParentNodeOnDashboard",
        type: "POST",
        success: function (result) {
            var parent_id = result.id;
            Create_Component(parent_id);

        },
        error: function (error) {
            saas_object.UnBlockUI();
        }
    });
};

function getFlDesignStepsCount(opkey_end_point, artifact_type, dbId) {
    return new Promise(function (resolve) {
        $.ajax({
            url: opkey_end_point + "/ComponentFlow/Refresh?moduleType=" + artifact_type + "&DB_ID=" + dbId,
            type: "Get",
            success: function (resultList) {
                if (resultList != null && resultList.DesignSteps != null) {
                    resolve(resultList.DesignSteps.length);
                }

                resolve(0);
            },
            error: function (error) {
                ShowToastMessage("error", JSON.stringify(error));
                resolve(0);
            }

        });
    });
}

function getFlInputParameters(opkey_end_point, artifact_type, dbId) {
    return new Promise(function (resolve) {
        $.ajax({
            url: opkey_end_point + "/ComponentFlow/Refresh?moduleType=" + artifact_type + "&DB_ID=" + dbId,
            type: "Get",
            success: function (resultList) {
                if (resultList != null && resultList.InputParameters != null) {
                    resolve(resultList.InputParameters);
                }

                resolve([]);
            },
            error: function (error) {
                ShowToastMessage("error", JSON.stringify(error));
                resolve([]);
            }

        });
    });
}

function addKeyValuePair(artifact_name, fl_Name) {
    let keyValueCollection = JSON.parse(sessionStorage.getItem("keyValueCollection")) || {};
    keyValueCollection[artifact_name] = fl_Name;
    sessionStorage.setItem("keyValueCollection", JSON.stringify(keyValueCollection));
    sessionStorage.setItem("artifact_name", artifact_name);
}
async function Create_Component(parent_id) {

    localStorage.setItem("TestCaseStepIndex", "-1")

    var artifact_type = "Component";

    var artifact_name = DOMPurify.sanitize($("#componentNameField").val());

    var opkey_end_point = Get_Opkey_URL("OPKEY_DOMAIN_NAME");

    if (sessionStorage.getItem("choosen_fl_id") != null) {
        choosen_fl_id = JSON.parse(sessionStorage.getItem("choosen_fl_id"));
        let stepCount = await getFlDesignStepsCount(opkey_end_point, artifact_type, choosen_fl_id.id);

        if (stepCount == 0) {
            stepCount = -1;
        }
        if (stepCount > 0) {
            stepCount--;
        }
        localStorage.setItem("TestCaseStepIndex", "" + stepCount)
    }
    if (choosen_fl_id != null) {
        $.ajax({
            url: opkey_end_point + "/Base/AcquireLock?moduleType=" + artifact_type + "&DB_ID=" + choosen_fl_id.id,
            type: "Get",
            success: function (result_AcquireLock) {
                temp_artifact_id = choosen_fl_id.id;
                Create_Object_Repository("OR_" + choosen_fl_id.text, parent_id);

            },
            error: function (error) {
                saas_object.UnBlockUI();
                ShowToastMessage("error", JSON.stringify(error));
            }

        });
    }
    else {


        addKeyValuePair(artifact_name, sessionStorage.getItem("fl_Name"));
        var testManagementDetails = {
        };
        const form_data = {
            'moduleType': artifact_type,
            'startName': artifact_name,
            'description': "Component created by OBE AutoFl Creator.",
            'parentID': parent_id,
            'tags': "",
            'strTestManagementDetails': JSON.stringify(testManagementDetails),
            'flowOrComponentMode': "Automated",
            'str_files': null
        }
        $.ajax({
            url: opkey_end_point + "/ExplorerTree/AddFileFolderWithTestManagementDetails",
            type: "POST",
            data: form_data,
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            success: function (result) {
                addComponentInSessionStorage(result);
                $.ajax({
                    url: opkey_end_point + "/Base/AcquireLock?moduleType=" + result.type + "&DB_ID=" + result.id,
                    type: "Get",
                    success: function (result_AcquireLock) {
                        temp_artifact_id = result.id;
                        Create_Object_Repository("OR_" + result.text, parent_id);

                    },
                    error: function (error) {
                        saas_object.UnBlockUI();
                        ShowToastMessage("error", JSON.stringify(error));
                    }

                });
            },
            error: function (error) {
                saas_object.UnBlockUI();
                try {
                    let response = JSON.parse(error.responseText);
                    if (response.message.includes("Component with same name already exists.")) {
                        ShowToastMessage("error", "RC with the same name is already present.");
                    } else {
                        ShowToastMessage("error", JSON.stringify(error));
                    }
                } catch (e) {
                    ShowToastMessage("error", "An unexpected error occurred.");
                }
            }
        });
    }
};

async function startCreateAutomatedTestCaseWithFLSteps() {
    let componentArray = getComponentArrayFromSessionStorage();
    if (componentArray.length == 0) {
        ShowToastMessage("error", "No Component found!");
        return;
    }
    saas_object.BlockUI("Creating Test Case!");
    let artifact_name = DOMPurify.sanitize($("#testcaseName").val());
    let testCaseData = await createAutomatedTestCaseWithFLSteps(artifact_name, "00000000-0000-0000-0000-000000000000");
    if (testCaseData == null) {
        saas_object.UnBlockUI();
        return;
    }
    debugger

    let position = -1;
    saas_object.UnBlockUI();
    saas_object.BlockUI("Adding Components in Test Case!");

    for (const _object of componentArray) {

        await addComponentAsStepInTestCase("Flow", testCaseData.id, position, _object.id);

        position++;
    }


    window.setTimeout(async function () {
        $('#div_table_FL input[type="checkbox"]').trigger("change");
        await saveFLComponent("Flow", testCaseData.id);
        saas_object.UnBlockUI();
        navigateAndCloseWindow(testCaseData.id, true);
    }, 3000);
}

function addComponentAsStepInTestCase(moduleType, db_id, _position, _componentId) {
    return new Promise(function (resolve) {

        var opkey_end_point = Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        var formData = new FormData();

        formData.append('moduleType', moduleType);
        formData.append('DB_ID', db_id);
        formData.append('position', _position);
        formData.append('componentID', _componentId);

        $.ajax({
            url: opkey_end_point + "/ComponentFlow/AddNewStepAsComponent",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (result) {
                resolve(result);
            },
            error: function (error) {
                saas_object.UnBlockUI();
                ShowToastMessage("error", JSON.stringify(error));
                resolve(null);
            }
        });
    });
}

async function createAutomatedTestCaseWithFLSteps(artifact_name, parent_id) {
    return new Promise(function (resolve) {

        var opkey_end_point = Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        var testManagementDetails = {
        };
     
        const form_data = {
            'moduleType': "FLOW",
            'startName': artifact_name,
            'description': "Automated Test Case created by OBE AutoFl Creator.",
            'parentID': parent_id,
            'tags': "",
            'strTestManagementDetails': JSON.stringify(testManagementDetails),
            'flowOrComponentMode': "Automated",
            'str_files': null,
            "wantDataSheet": true
        }

        $.ajax({
            url: opkey_end_point + "/ExplorerTree/AddTestCaseWithLDR",
            type: "POST",
            data: form_data,
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            success: function (result) {
                apiFlag = true;
                $.ajax({
                    url: opkey_end_point + "/Base/AcquireLock?moduleType=" + result.type + "&DB_ID=" + result.id,
                    type: "Get",
                    success: function (result_AcquireLock) {
                        saas_object.UnBlockUI();
                        resolve(result);

                    },
                    error: function (error) {
                        saas_object.UnBlockUI();
                        ShowToastMessage("error", JSON.stringify(error));
                        resolve(null);
                    }

                });
            },
            error: function (error) {
                apiFlag = false;
                saas_object.UnBlockUI();
                try {
                    let response = JSON.parse(error.responseText);
                    if (response.message.includes("Flow with same name already exists.")) {
                        ShowToastMessage("error", "TC with the same name is already present.");
                    } else {
                        ShowToastMessage("error", response.message);
                    }
                } catch (e) {
                    ShowToastMessage("error", JSON.stringify(error));
                }
                resolve(null);
            }
        });
    });
}

function getComponentArrayFromSessionStorage() {
    let componentArrayString = sessionStorage.getItem("component_arrays");

    if (componentArrayString == null || componentArrayString == "") {
        return [];
    }

    let finalArray = [];
    let componentArray = JSON.parse(sessionStorage.getItem("component_arrays"));

    componentArray.forEach(function (_object, _index_array) {
        finalArray.push({ "id": _object.id, "text": _object.text, "addFromRC": _object.addFromRC })
    });

    return finalArray;
}

function addComponentInSessionStorage(_componentObject) {
    let componentArrayString = sessionStorage.getItem("component_arrays");

    if (componentArrayString == null || componentArrayString == "") {
        componentArrayString = JSON.stringify([]);
        sessionStorage.setItem("component_arrays", componentArrayString);
    }

    let componentArray = JSON.parse(sessionStorage.getItem("component_arrays"));
    componentArray.push(_componentObject);

    sessionStorage.setItem("component_arrays", JSON.stringify(componentArray));
}

function Create_Object_Repository(Or_Name, parent_id) {
    var node_module_type = "ObjectRepository";

    var opkey_end_point = Get_Opkey_URL("OPKEY_DOMAIN_NAME");

    $.ajax({
        url: opkey_end_point + "/ExplorerTree/getHiddenFolderID",
        type: "GET",
        success: function (result_node) {
            let hiddenParentId = result_node["Id"];
            $.ajax({
                url: opkey_end_point + "/ExplorerTree/AddFileFolderForDialer_With_Timestamp",
                type: "POST",
                datatype: "jsonp",
                data: {
                    moduleType: node_module_type,
                    name: Or_Name,
                    description: "Object Repository Created by OBE AutoFl Creator.",
                    parentID: hiddenParentId,
                    add_timestamp: true
                },
                success: function (result_node) {
                    $.ajax({
                        url: opkey_end_point + "/Base/AcquireLock?moduleType=" + node_module_type + "&DB_ID=" + result_node.id,
                        type: "Get",
                        success: function (result) {
                            temp_or_id = result_node.id;
                            SaveRecordingLoadTest(all_steps_data_array);
                        },
                        error: function (error) {
                            saas_object.UnBlockUI();
                            ShowToastMessage("error", JSON.stringify(error));
                        }
                    });

                },
                error: function (error) {
                    saas_object.UnBlockUI();
                    ShowToastMessage("error", JSON.stringify(error));
                }
            });
        },
        error: function (error) {

        }
    });


};

function createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getCurrentTimeStamp() {
    // YYYY-MM-DD H:M:S.ms
    var currentDate = new Date();
    return currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate() + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds() + "." + currentDate.getMilliseconds();
}

async function SaveRecordingLoadTest(recorded_data) {

    var all_recorded_data = recorded_data;
    var all_datas = [];
    var all_functionalSteps = [];
    var all_loadtestingSteps = [];
    var ltstep_parentId = "00000000-0000-0000-0000-000000000000";
    for (var i = 0; i < all_recorded_data.length; i++) {
        debugger
        var object_attribute_array = new Array();
        var parent_attribute_array = new Array();
        var step_data = all_recorded_data[i];
        if (step_data != "") {

            if (step_data["StepSelected"] == false) {
                continue;
            }

            let isFunctionLibrary = step_data["IsFunctionLibrary"];
            if (isFunctionLibrary === true) {
                let componentId = step_data["ComponentId"];
                var __uuid = createUUID();
                ltstep_parentId = __uuid;
                var out_data = {
                    "action": null,
                    "actionID": __uuid,
                    "logicalname": null,
                    "objectProperties": [],
                    "parentProperties": [],
                    "dataArgs": [],
                    "RecordingTimeStamp": 0,
                    "hasChildrens": false,
                    "componentID": componentId,
                    "actionType": "Component"
                };
                all_functionalSteps.push(out_data);
                all_datas.push(out_data);
            }

            else {
                var action_name = step_data["Keyword"];
                var logical_name = step_data["LabelName"];

                var isDynamicOr = false;
                if (step_data["DynamicOrObject"] != null) {
                    if (step_data["DynamicOrObject"]["IgnoreDynamicOR"] == null || step_data["DynamicOrObject"]["IgnoreDynamicOR"] == false) {
                        isDynamicOr = true;
                    }
                    if (step_data["DynamicOrObject"]["IgnoreDynamicOR"] != null) {
                        delete step_data["DynamicOrObject"]["IgnoreDynamicOR"];
                    }
                }
                var stepObjectData = step_data["DynamicOrObject"];

                if (logical_name == null || logical_name == "") {
                    logical_name = step_data["TableName"];
                }

                if (logical_name == null || logical_name == "") {
                    logical_name = step_data["ColumnName"];
                }

                var data_args = JSON.stringify(step_data["DataArguments"]);
                var object_data = { "logicalname": logical_name };

                if (stepObjectData != null) {
                    object_data = stepObjectData;
                }
                var _timestamp = step_data["TimeStamp"];


                if (_timestamp == null) {
                    _timestamp = getCurrentTimeStamp();
                }
                logical_name = logical_name.replace(/\n/g, "").replace(/\t/g, "").replace(/  /g, "");
                var parent_object_data = object_data["parent"];

                $.each(object_data, function (k, v) {
                    if (k == "parent") {
                        v = null;
                    }
                    if (k.indexOf("element:") > -1) {
                        v = null;
                    }
                    if (k == "logicalname") {
                        logical_name = v;
                    }
                    if (k == "IsSikuliKeyword") {
                        v = null;
                    }
                    if (k == "sahiText") {
                        k = "innertext";
                    }
                    if (k == "unencryptedData") {
                        v = null;
                    }
                    if (v == "") {
                        v = null;
                    }
                    if (k == "Image") {
                        if (v != null) {
                            v = v.replace("data:image/png;base64,", "");
                            object_attribute_array.push({
                                "Name": k,
                                "Value": DetectFileSize(v),
                                "DataType": "Image"
                            });
                        }
                    } else if (k == "ObjectImage") {
                        if (v != null) {
                            v = v.replace("data:image/png;base64,", "");
                            object_attribute_array.push({
                                "Name": k,
                                "Value": DetectFileSize(v),
                                "DataType": "Image"
                            });
                        }
                    } else {
                        if (v != null) {
                            object_attribute_array.push({
                                "Name": k,
                                "Value": v.toString(),
                                "DataType": "String"
                            });
                        }
                    }
                });

                $.each(parent_object_data, function (k, v) {
                    if (v == "") {
                        v = null;
                    }
                    if (v != null) {
                        parent_attribute_array.push({
                            "Name": k,
                            "Value": v.toString(),
                            "DataType": "String"
                        });
                    }
                });

                var validdatas = [];
                if (data_args != null && data_args != "") {
                    if (data_args.indexOf("{") == 0) {
                        var parsed_dataarray = JSON.parse(data_args);
                        $.each(parsed_dataarray, function (key, value) {
                            validdatas.push(parsed_dataarray[key]);
                        });
                    }
                }
                var argumentdata = []
                if (validdatas != null) {
                    if (validdatas.length > 0) {
                        for (var il = 0; il < validdatas.length; il++) {
                            argumentdata.push(validdatas[il])
                        }
                    }
                }

                if (logical_name.length > 25) {
                    logical_name = logical_name.substring(0, 24)
                }

                if (argumentdata.length > 0) {
                    var __uuid = createUUID();
                    ltstep_parentId = __uuid;
                    var out_data = {
                        "action": action_name,
                        "actionID": __uuid,
                        "logicalname": logical_name,
                        "objectProperties": object_attribute_array,
                        "parentProperties": parent_attribute_array,
                        "dataArgs": argumentdata,
                        "RecordingTimeStamp": _timestamp,
                        "hasChildrens": false,
                        "actionType": "Keyword"
                    };

                    if (isDynamicOr == true) {
                        out_data["ObjectType"] = "DynamicObject";
                    }
                    all_functionalSteps.push(out_data);
                    all_datas.push(out_data);
                } else {
                    var __uuid = createUUID();
                    ltstep_parentId = __uuid;
                    var out_data = {
                        "action": action_name,
                        "actionID": __uuid,
                        "logicalname": logical_name,
                        "objectProperties": object_attribute_array,
                        "parentProperties": parent_attribute_array,
                        "dataArgs": [data_args],
                        "RecordingTimeStamp": _timestamp,
                        "hasChildrens": false,
                        "actionType": "Keyword"
                    };

                    if (isDynamicOr == true) {
                        out_data["ObjectType"] = "DynamicObject";
                    }
                    all_functionalSteps.push(out_data);
                    all_datas.push(out_data);
                }
            }
        }
    }
    if (all_datas.length > 0 || isMobileRecording() == true) {

        var saveDataToOpkey = {
            "FunctionalSteps": all_functionalSteps,
            "PerformanceSteps": all_loadtestingSteps
        };

        var append_at = "-1";
        var append_step_at = localStorage.getItem("TestCaseStepIndex");
        if (append_step_at != null) {
            if (append_step_at != "") {
                append_at = append_step_at;
            }
        }

        var artificate_id = temp_artifact_id;
        var or_id = temp_or_id;
        var sr_id = "00000000-0000-0000-0000-000000000000";

        var save_call_data = {
            moduleType: "Flow",
            orId: or_id,
            srID: sr_id,
            artifactId: artificate_id,
            insertStepsAt: append_at,
            strAllRecordedActionsList: JSON.stringify(saveDataToOpkey),
            recorderType: "SahiRecorderForSaaS",
            serializedMobileAppDto: "",
            strPCloudyCredentials: "",
            strBookingDtoResult: null,
            pathWindowsApplication: "",
            createLoadTestingDependentArtifacts: false,
            wantOpenBrowserKeyword: false
        };

        let lastStepCount = await getFlDesignStepsCount(Get_Opkey_URL("OPKEY_DOMAIN_NAME"), "Component", artificate_id);

        $.ajax({
            url: Get_Opkey_URL("OPKEY_DOMAIN_NAME") + "/ComponentFlow/ProcessFunctionalAndLoadTestingRecorderSteps",
            type: "POST",
            datatype: "jsonp",
            data: save_call_data,
            success: async function (returned_data) {
                saas_object.UnBlockUI();
                if ($('#generateInputParameterChkBx').is(':checked')) {
                    let designSteps = returned_data["DesignSteps"];

                    if (designSteps.length > lastStepCount) {
                        debugger
                        designSteps = designSteps.slice(lastStepCount);
                    }

                    // createInputParameterOfComponent(artificate_id, recorded_data, designSteps);
                    await createInputParameterOfComponent_New(artificate_id, recorded_data, designSteps);
                }

                if ($('#generateInputParameterForFlsChkbx').is(':checked')) {
                    await createRCInputParameters(all_functionalSteps, artificate_id);

                }

                navigateAndCloseWindow(artificate_id, false);
            },
            error: function (returned_error_data) {
                ShowToastMessage("error", JSON.stringify(returned_error_data));
                saas_object.UnBlockUI();
            }
        });
    } else {

    }
};

async function createRCInputParameters(all_functionalSteps, artificate_id) {

    return new Promise((resolve) => {

        saas_object.BlockUI("Creating Fl Input Parameters of Automated Reusable Component!");
        let strComponentStepsArray = [];

        // iterate and build steps
        all_functionalSteps.forEach(item => {
            if (item.actionType && item.actionType === "Component") {
                strComponentStepsArray.push({
                    ComponentID: item.componentID,
                    StepID: item.actionID
                });
            }
        });


        var formData = new FormData();
        formData.append("DB_ID", artificate_id);

        formData.append("strComponentSteps", JSON.stringify(strComponentStepsArray));
        $.ajax({
            url: Get_Opkey_URL("OPKEY_DOMAIN_NAME") + "/ComponentFlow/CreateInputParametersAlongWithMappingForRecorder",
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                saas_object.UnBlockUI();
                resolve(response);
            },
            error: function (returned_error_data) {
                ShowToastMessage("error", JSON.stringify(returned_error_data));
                saas_object.UnBlockUI();
                resolve(errorThrown);
            }
        });
    });
}

function makeSyncajaxCall(urlObject, delay) {

    return new Promise((resolve) => {
        setTimeout(() => {

            urlObject["success"] = function (response) {
                resolve(response);
            };

            urlObject["error"] = function (error) {
                resolve(error);
            };

            $.ajax(urlObject);
        }, delay);
    });
}


async function createInputParameterOfComponent(_componentId, recorded_data, compponentData) {
    saas_object.BlockUI("Creating Input Parameters of Automated Reusable Component!");
    var all_ajax_calls = [];

    let alreadyAddedInputParameters = await getFlInputParameters(Get_Opkey_URL("OPKEY_DOMAIN_NAME"), "Component", _componentId);

    var all_added_input_params = [];
    var all_already_added_input_params = [];
    let temp_added_param_names = [];
    var ipCount = alreadyAddedInputParameters.length - 1;
    for (var ipi = 0; ipi < recorded_data.length; ipi++) {
        var stepObject = recorded_data[ipi];

        if (stepObject["StepSelected"] == false) {
            continue;
        }

        var inputParamName = stepObject["ComponentInputParameterName"];

        var defaultValue = stepObject["InputParameterDefaultValue"];
        if (inputParamName != null && inputParamName != "") {

            let inputParameterFound = false;

            if (alreadyAddedInputParameters.length > 0) {
                alreadyAddedInputParameters.forEach(function (_object, index, array) {

                    if (_object["Name"] === inputParamName) {
                        all_already_added_input_params.push(_object);
                        inputParameterFound = true;
                    }
                });
            }

            if (inputParameterFound == true) {
                continue;
            }

            var inputParameters = await makeSyncajaxCall({
                url: Get_Opkey_URL("OPKEY_DOMAIN_NAME") + "/CFComponent/AddNewInputParameter?moduleType=Component&componentID=" + _componentId + "&position=" + ipCount,
                type: "GET"
            }, 100);

            ipCount++;
            var currentlyAddedParam = inputParameters[inputParameters.length - 1];

            currentlyAddedParam["Name"] = inputParamName;

            currentlyAddedParam["Description"] = "";

            if (defaultValue != null && defaultValue != "") {
                //  currentlyAddedParam["DefaultValue"]=defaultValue;
                currentlyAddedParam["DefaultValues"] = [
                    {
                        "Value": defaultValue,
                        "IsSelected": true,
                        "IsSecured": false,
                        "IsEditable": true,
                        "Position": 1,
                        "custom_position": 1,
                        "DataType": "String",
                        "IP_ID": "00000000-0000-0000-0000-000000000000"

                    }];
            }

            await renameInputParameterName(_componentId, JSON.stringify(currentlyAddedParam), inputParamName);

        }
    }

    await saveFLComponent("Component", _componentId);

    let latestAddedInputParameters = await getFlInputParameters(Get_Opkey_URL("OPKEY_DOMAIN_NAME"), "Component", _componentId);

    let last_new_added_input_params = getLatestInputParameters(alreadyAddedInputParameters, latestAddedInputParameters);

    last_new_added_input_params.forEach(function (_object, index, array) {
        all_already_added_input_params.push(_object);
    });

    debugger

    saas_object.UnBlockUI();

    await mapInputParameterWithFl(_componentId, recorded_data, compponentData, all_already_added_input_params);




    await saveFLComponent("Component", _componentId);

    createKeyValuePairOfArifact_nameAndDB_ID(_componentId, sessionStorage.getItem("artifact_name"));

    saas_object.UnBlockUI();
    if (localStorage.getItem("flagForTestCase") == "false") {
        navigateAndCloseWindow(_componentId, true);
    } else {
        navigateAndCloseWindow(_componentId, false);
    }
    if (sessionStorage.getItem("choosen_fl_id") != null) {
        ShowToastMessage("success", "FL Updated Successfully!");
        choosen_fl_id = null;
        sessionStorage.removeItem("choosen_fl_id");
    } else {
        ShowToastMessage("success", "Component Created Successfully!");
    }
}

async function createInputParameterOfComponent_New(_componentId, recorded_data, compponentData) {
    saas_object.BlockUI("Creating Input Parameters of Automated Reusable Component!");

    let alreadyAddedInputParameters = await getFlInputParameters(Get_Opkey_URL("OPKEY_DOMAIN_NAME"), "Component", _componentId);

    let all_already_added_input_params = [];
    let ipCount = alreadyAddedInputParameters.length - 1;
    let ipPositions = [];
    let newInputParams = [];

    for (let ipi = 0; ipi < recorded_data.length; ipi++) {
        let stepObject = recorded_data[ipi];

        if (stepObject["StepSelected"] == false) {
            continue;
        }

        let inputParamName = stepObject["ComponentInputParameterName"];
        let defaultValue = stepObject["InputParameterDefaultValue"];
        if (inputParamName != null && inputParamName != "") {
            let inputParameterFound = false;

            if (alreadyAddedInputParameters.length > 0) {
                alreadyAddedInputParameters.forEach(function (_object, index, array) {

                    if (_object["Name"] === inputParamName) {
                        all_already_added_input_params.push(_object);
                        inputParameterFound = true;
                    }
                });
            }

            if (inputParameterFound == true) {
                continue;
            }

            ipPositions.push(ipCount);
            newInputParams.push({
                "Name": inputParamName,
                "Description": "",
                "DefaultValues": defaultValue ? [
                    {
                        "Value": defaultValue,
                        "IsSelected": true,
                        "IsSecured": false,
                        "IsEditable": true,
                        "Position": 1,
                        "custom_position": 1,
                        "DataType": "String",
                        "IP_ID": "00000000-0000-0000-0000-000000000000"
                    }
                ] : []
            });

            ipCount++;
        }
    }

    if (newInputParams.length > 0) {
        let positionsParam = encodeURIComponent(JSON.stringify(ipPositions));

        let inputParameters = await makeSyncajaxCall({
            url: Get_Opkey_URL("OPKEY_DOMAIN_NAME") +
                `/CFComponent/AddMultipleNewInputParameters?moduleType=Component&componentID=${_componentId}&position=${positionsParam}`,
            type: "GET"
        }, 100);

        if (alreadyAddedInputParameters.length > 0) {
            inputParameters = inputParameters.slice(alreadyAddedInputParameters.length);
        }

        if (inputParameters.length !== newInputParams.length) {
            console.warn("Warning: inputParameters and newInputParams have different lengths!");
        }

        inputParameters.forEach((param, index) => {
            if (newInputParams[index] && newInputParams[index].Name) {
                param.Name = newInputParams[index].Name;
                param.Description = newInputParams[index].Description;
                param.DefaultValues = newInputParams[index].DefaultValues;
            }
        });

        await renameInputParameterName_New(_componentId, inputParameters);
    }
    debugger;
    await saveFLComponent("Component", _componentId);

    let latestAddedInputParameters = await getFlInputParameters(Get_Opkey_URL("OPKEY_DOMAIN_NAME"), "Component", _componentId);
    let last_new_added_input_params = getLatestInputParameters(alreadyAddedInputParameters, latestAddedInputParameters);
    last_new_added_input_params.forEach(param => all_already_added_input_params.push(param));

    saas_object.UnBlockUI();
    await mapInputParameterWithFl_New(_componentId, recorded_data, compponentData, all_already_added_input_params);

    await saveFLComponent("Component", _componentId);

    createKeyValuePairOfArifact_nameAndDB_ID(_componentId, sessionStorage.getItem("artifact_name"));
    saas_object.UnBlockUI();

    if (localStorage.getItem("flagForTestCase") == "false") {
        navigateAndCloseWindow(_componentId, true);
    } else {
        navigateAndCloseWindow(_componentId, false);
    }

    if (sessionStorage.getItem("choosen_fl_id")) {
        ShowToastMessage("success", "FL Updated Successfully!");
        choosen_fl_id = null;
        sessionStorage.removeItem("choosen_fl_id");
    } else {
        ShowToastMessage("success", "Component Created Successfully!");
    }
}
let artifactNameAndDB_ID = {};
function createKeyValuePairOfArifact_nameAndDB_ID(_componentId, fl_Name) {
    artifactNameAndDB_ID[fl_Name] = _componentId;
}

function getLatestInputParameters(arr1, arr2) {
    return arr2.filter(item2 =>
        !arr1.some(item1 => item1.Name === item2.Name)
    );
}


function navigateAndCloseWindow(_componentId, _canNavigate) {
    if (_canNavigate == true) {
        navigateToFunctionLibrary(_componentId);
        window.close();
    }
}

var ipCount = 0;
async function renameInputParameterName(_componentId, strIPBinding, ipName) {
    return new Promise((resolve) => {
        var formData = new FormData();
        formData.append("moduleType", "Component");
        formData.append("componentID", _componentId);
        formData.append("strIPBinding", strIPBinding);
        $.ajax({
            url: Get_Opkey_URL("OPKEY_DOMAIN_NAME") + "/CFComponent/EditInputParameter",
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                ipCount = 0;
                resolve(response);
            },
            error: async function (jqXHR, textStatus, errorThrown) {
                ipCount++;
                var strIPBindingObject = JSON.parse(strIPBinding);
                strIPBindingObject["Name"] = ipName + "_" + ipCount;
                strIPBindingObject["Description"] = "";
                await renameInputParameterName(_componentId, JSON.stringify(strIPBindingObject), ipName);
                resolve(errorThrown);
            }
        });
    });
}

var ipCount = 0;
async function renameInputParameterName_New(_componentId, strIPBindingList) {
    return new Promise((resolve) => {
        var formData = new FormData();
        formData.append("moduleType", "Component");
        formData.append("componentID", _componentId);
        formData.append("strIPBinding", JSON.stringify(strIPBindingList));

        $.ajax({
            url: Get_Opkey_URL("OPKEY_DOMAIN_NAME") + "/CFComponent/EditMultipleInputParameter",
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                ipCount = 0;
                resolve(response);
            },
            error: async function (jqXHR, textStatus, errorThrown) {
                ipCount++;
                let updatedList = strIPBindingList.map((param, index) => {
                    param["Name"] = param["Name"] + "_" + ipCount;
                    param["Description"] = "";
                    return param;
                });
                await renameInputParameterName_New(_componentId, updatedList);
                resolve(errorThrown);
            }
        });
    });
}


async function mapInputParameterWithFl(_componentId, recorded_data, compponentSteps, allAddedInputParams) {

    saas_object.BlockUI("Mapping Input Parameter with Steps!");

    if (compponentSteps[0].text == "OpenBrowser") {
        compponentSteps.shift();
    }

    let all_recorded_step = [];

    recorded_data.forEach(function (_object, _index, _array) {
        if (_object["StepSelected"] == true) {
            all_recorded_step.push(_object);
        }
    });

    var argMapCount = 0;
    for (var ipa = 0; ipa < compponentSteps.length; ipa++) {

        var componentStep = compponentSteps[ipa];

        let recordedStep = all_recorded_step[ipa];


        if (recordedStep["StepSelected"] == false) {
            debugger
            continue;
        }

        var inputParamName = recordedStep["ComponentInputParameterName"];

        var inputArgumentsArray = componentStep["inputArguments"];
        for (var iaa = 0; iaa < inputArgumentsArray.length; iaa++) {
            var inputArgumentObject = inputArgumentsArray[iaa];

            var argumentName = inputArgumentObject["Name"];

            if (argumentName == "TextToType" || argumentName == "ValueToType" || argumentName == "ValueToSelect" || argumentName == "Date" || argumentName == "Status") {

                var inputPrameter = findInputParameterName(allAddedInputParams, inputParamName)
                debugger
                if (inputPrameter == null) {
                    continue;
                }
                //   var inputPrameter = allAddedInputParams[argMapCount];
                var ipBindObject = new Object();
                ipBindObject["componentIPDTO"] = inputPrameter["componentIPDTO"];
                await setStepInputAsIPAndGetDesignStep(_componentId, inputArgumentObject["StepID"], inputArgumentObject["ArgumentID"], JSON.stringify(ipBindObject));
                argMapCount++;
            }
        }

    }

}


async function mapInputParameterWithFl_New(_componentId, recorded_data, compponentSteps, allAddedInputParams) {

    let dataToMapArray = new Array();

    saas_object.BlockUI("Mapping Input Parameter with Steps!");

    if (compponentSteps[0].text == "OpenBrowser") {
        compponentSteps.shift();
    }

    let all_recorded_step = [];

    recorded_data.forEach(function (_object, _index, _array) {
        if (_object["StepSelected"] == true) {
            all_recorded_step.push(_object);
        }
    });

    var argMapCount = 0;
    for (var ipa = 0; ipa < compponentSteps.length; ipa++) {

        var componentStep = compponentSteps[ipa];

        let recordedStep = all_recorded_step[ipa];


        if (recordedStep["StepSelected"] == false) {
            debugger
            continue;
        }

        var inputParamName = recordedStep["ComponentInputParameterName"];

        var inputArgumentsArray = componentStep["inputArguments"];
        for (var iaa = 0; iaa < inputArgumentsArray.length; iaa++) {
            var inputArgumentObject = inputArgumentsArray[iaa];

            var argumentName = inputArgumentObject["Name"];

            if (argumentName == "TextToType" || argumentName == "ValueToType" || argumentName == "ValueToSelect" || argumentName == "Date" || argumentName == "Status") {

                var inputPrameter = findInputParameterName(allAddedInputParams, inputParamName)
                debugger
                if (inputPrameter == null) {
                    continue;
                }
                //   var inputPrameter = allAddedInputParams[argMapCount];
                var ipBindObject = new Object();
                ipBindObject["componentIPDTO"] = inputPrameter["componentIPDTO"];

                let dataToMapObject = new Object();
                dataToMapObject["StepID"] = inputArgumentObject["StepID"];
                dataToMapObject["inputArgID"] = inputArgumentObject["ArgumentID"];
                dataToMapObject["ipBinding"] = inputPrameter;

                dataToMapArray.push(dataToMapObject);

                argMapCount++;
            }
        }
    }

    await setStepInputAsIPAndGetDesignStep_New(_componentId, JSON.stringify(dataToMapArray));


}

function findInputParameterName(_allAddedInputParams, _name) {
    if (_name == null || _name === "") {
        return null;
    }

    let result = null;
    _allAddedInputParams.some(function (_object) {
        if (_object["Name"] === _name) {
            result = _object;
            return true;
        }
        return false;
    });

    return result;
}


async function setStepInputAsIPAndGetDesignStep(_componentId, stepid, inputargid, strIPBinding) {
    return new Promise((resolve) => {
        var formData = new FormData();
        formData.append("moduleType", "Component");
        formData.append("DB_ID", _componentId);
        formData.append("stepid", stepid);
        formData.append("inputargid", inputargid);
        formData.append("strIPBinding", strIPBinding);
        $.ajax({
            url: Get_Opkey_URL("OPKEY_DOMAIN_NAME") + "/ComponentFlow/SetStepInputAsIPAndGetDesignStep",
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                resolve(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                resolve(errorThrown);
            }
        });
    });
}


async function setStepInputAsIPAndGetDesignStep_New(_componentId, strIPBinding) {
    return new Promise((resolve) => {
        var formData = new FormData();
        formData.append("moduleType", "Component");
        formData.append("DB_ID", _componentId);
        formData.append("strIPBinding", strIPBinding);
        $.ajax({
            url: Get_Opkey_URL("OPKEY_DOMAIN_NAME") + "/ComponentFlow/SetMultipleStepInputAsIPAndGetDesignStep",
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                resolve(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                resolve(errorThrown);
            }
        });
    });
}

async function saveFLComponent(_moduleType, _componentId) {
    return new Promise((resolve) => {

        var formData = new FormData();
        formData.append("moduleType", _moduleType);
        formData.append("DB_ID", _componentId);

        formData.append("impactInfo", JSON.stringify({ "IsNeedToImpact": false, "AllowedStatsForImpact": [] }));
        $.ajax({
            url: Get_Opkey_URL("OPKEY_DOMAIN_NAME") + "/ComponentFlow/Save",
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                resolve(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                resolve(errorThrown);
            }
        });
    });
}


function navigateToFunctionLibrary(componentId) {
    var redirectUrl = Get_Opkey_URL("OPKEY_DOMAIN_NAME") + "/opkeyone/pmo/component/" + componentId;
    window.open(redirectUrl, '_blank');
}

function ShowToastMessage(messagetype, message) {

    var toast_object = new Object();
    toast_object.text = message;
    toast_object.duration = 5000;
    toast_object.newWindow = true;
    toast_object.close = true;
    toast_object.gravity = "bottom";
    toast_object.positionLeft = false;
    toast_object.backgroundColor = "green";
    if (messagetype == "error") {
        toast_object.backgroundColor = "red";
    } else if (messagetype == "warning") {
        toast_object.backgroundColor = "orange";
    } else if (messagetype == "greeting") {
        toast_object.backgroundColor = "yellow";
    }
    Toastify(toast_object).showToast();
}
var apiFlag = false;
$(function () {
    fetchAndDisplayFlData();

    $("#fetchElementButton").click(function (e) {
        fetchAndDisplayFlData();
    });

    $("#fetchNewElementButton").click(function (e) {
        fetchNewElementAndDisplayFlData();
    });

    $("#createComponentButton").click(function (e) {

        if ($("#componentNameField").val() == null || $("#componentNameField").val().trim() == "") {
            ShowToastMessage("error", "Name is required");
            return
        }
        artifactTypeToCreate = "Component";
        //   openDomainSelectionUi();
        startDataSavingInComponentOrTestCase();
    });

    $("#createTestCaseButton").click(function (e) {
        debugger
        let componentOfArray = getComponentArrayFromSessionStorage();
        // console.log("componentOfArray===", componentOfArray);
        if (componentOfArray.length == 0) {
            $("#div_content_FL").hide();
            $("#div_nodata_tc").show();
            $("#div_table_FL").html("");
            $("#bt_proceedTC").hide();
            return;
        }

        sessionStorage.setItem("temp_fl_arrays", JSON.stringify(componentOfArray));

        $("#div_content_FL").show();
        $("#div_nodata_tc").hide();
        $("#bt_proceedTC").show();

        let html_template = "<tbody>";

        componentOfArray.forEach(item => {
            debugger
            let hideButton = item.addFromRC ? 'style="display:none;"' : '';
            html_template = html_template + `
            <tr id="tr_item_${item.id}">
                <td>
                    <div class="td_item" style="align-items: center;">

                        <div class="item-check">
                            <span class="item-check-label">
                                <input type="checkbox" class="item-check-input action_checkbox_FL mt-0" value="${item.text}" id="${item.id}">
                                <span class="item-check-text" data-bs-toggle="tooltip" title="${item.text}">${item.text}</span>
                            </span>
                        </div>

                        <div class="ms-auto SuggestedFL" addfromrc="${item.addFromRC}">
                            <button type="button" class="btn btn_layout btn_bg_white action_suggestedFL" 
                                data-id="${item.id}" data-text="${item.text}" ${hideButton}>
                                Suggested RC
                            </button>
                        </div>

                    </div>
                </td>
                        
            </tr>`;
        });

        html_template = html_template + "</tbody>";


        $("#div_table_FL").html(html_template);

        $('[data-bs-toggle="tooltip"]').tooltip();

        window.setTimeout(function () {
            $("#testcaseName").val(getArtifactName("AutomatedTestCase_"));
            updateButtonState();
        }, 300);

    });


    // reason moveup and move down 
    $(document).on('click', '.action_checkbox_FL', function (e) {
        debugger
        updateButtonState();
    });

    $("#btn_moveup_component").click(function (e) {
        debugger;
        let selectedRow = getSelectedRow();
        let selectedListRow = getSelectedRowList();

        if (selectedListRow.length == 0) {
            ShowToastMessage("warning", "Please select atlist one component");
            return;
        } else if (selectedListRow.length > 1) {
            ShowToastMessage("warning", "Cannot move multiple component. Select one component for move");
            return;
        }

        if (selectedRow && selectedRow.previousElementSibling) {
            let tableBody = document.querySelector("#div_table_FL tbody");
            tableBody.insertBefore(selectedRow, selectedRow.previousElementSibling);
            updateButtonState();
        }
    });

    $("#btn_movedown_component").click(function (e) {
        debugger;
        let selectedRow = getSelectedRow();
        let selectedListRow = getSelectedRowList();

        if (selectedListRow.length == 0) {
            ShowToastMessage("warning", "Please select atlist one component");
            return;
        } else if (selectedListRow.length > 1) {
            ShowToastMessage("warning", "Cannot move multiple component. Select one component for move");
            return;
        }

        if (selectedRow && selectedRow.nextElementSibling) {
            let tableBody = document.querySelector("#div_table_FL tbody");
            tableBody.insertBefore(selectedRow.nextElementSibling, selectedRow);
            updateButtonState();
        }
    });

    $("#btn_save_component").click(function () {
        let savedFLArray = [];

        $(".action_checkbox_FL").each(function () {
            let id = $(this).attr("id");
            let text = $(this).val();
            let addFromRC = $(this).closest("tr").find("#addFromRC").length > 0 ||
                $(this).closest("tr").find("[addfromrc='true']").length > 0;
            savedFLArray.push({ id, text, addFromRC });
        });
        sessionStorage.setItem("component_arrays", JSON.stringify(savedFLArray));
        ShowToastMessage("success", "Steps saved successfully!");
    });

    $("#btn_delete_component").click(function () {
        let selectedIds = [];

        $(".action_checkbox_FL:checked").each(function () {
            selectedIds.push($(this).attr("id"));
        });

        if (selectedIds.length === 0) {
            ShowToastMessage("warning", "No components selected to delete.");
            return;
        }
        let temp_FLArray = JSON.parse(sessionStorage.getItem("component_arrays")) || [];
        temp_FLArray = temp_FLArray.filter(item => !selectedIds.includes(item.id));

        $(".action_checkbox_FL:checked").each(function () {

            let parentRow = $(this).closest("tr");
            let suggestedFL = parentRow.find(".SuggestedFL");

            if (suggestedFL.length > 0) {
                let addFromRcValue = suggestedFL.attr("addfromrc");

                if (addFromRcValue && (addFromRcValue.toLowerCase() === "false") || addFromRcValue.toLowerCase() === "undefined") {

                    var artifactName = parentRow.find(".item-check-text").text().trim();
                    var _componentId = getDB_ID(artifactName);

                    if (!_componentId) {
                        console.error("DB_ID not found for:", artifactName);
                        return;
                    }

                    var formData = new FormData();
                    formData.append("strDB_IDs", JSON.stringify([_componentId]));
                    formData.append("moduleTypes", JSON.stringify(["Component"]));

                    $.ajax({
                        url: Get_Opkey_URL("OPKEY_DOMAIN_NAME") + "/ExplorerTree/DeleteArtifactsFolders",
                        type: 'POST',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            console.log("Delete successful:", response);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error("AJAX Error:", textStatus, errorThrown);
                        }
                    });

                } else {
                    console.warn("addfromrc is not 'false' or missing, found:", addFromRcValue);
                }
            } else {
                console.error(".SuggestedFL not found in row:", parentRow);
            }
        });
        selectedIds.forEach(id => {
            $("#tr_item_" + id).remove();
        });

        sessionStorage.setItem("component_arrays", JSON.stringify(temp_FLArray));
        if (temp_FLArray.length === 0) {
            $("#div_content_FL").hide();
            $("#div_nodata_tc").show();
            $("#bt_proceedTC").hide();
        } else {
            $("#div_content_FL").show();
            $("#div_nodata_tc").hide();
            $("#bt_proceedTC").show();
        }
    });
    function getDB_ID(artifactName) {
        return artifactNameAndDB_ID[artifactName] || null;
    }
    function getSelectedRow() {
        return document.querySelector(".action_checkbox_FL:checked")?.closest("tr");
    }

    function getSelectedRowList() {
        return Array.from(document.querySelectorAll(".action_checkbox_FL:checked")).map(checkbox => checkbox.closest("tr"));
    }

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


    // Reason proceed to selected FL
    $("#bt_proceedTC").click(function () {
        let artifactName = $("#testcaseName").val();
        if (!artifactName || artifactName.trim() === "") {
            ShowToastMessage("error", "Test Case Name shouldn't be blank.!");
            return;
        }

        let checkedValues = $('#div_table_FL input[type="checkbox"]:checked').map(function () {
            return {
                id: $(this).attr("id"),
                text: $(this).val(),
                addFromRC: $(this).closest("tr").find("#addFromRC").length > 0 ||
                    $(this).closest("tr").find("[addfromrc='true']").length > 0
            };
        }).get();

        if (checkedValues.length === 0) {
            ShowToastMessage("warning", "Please select at least one component");
            return;
        }

        var allValues = sessionStorage.getItem("component_arrays");
        sessionStorage.setItem("component_arrays", JSON.stringify(checkedValues));
        $('#divModalTestCase').modal('hide');

        artifactTypeToCreate = "Flow";
        startDataSavingInComponentOrTestCase();
        if (!apiFlag) {
            sessionStorage.setItem("component_arrays", allValues);
        }

        $(document).on("change", "#div_table_FL input[type='checkbox']", function () {
            let parentRow = $(this).closest("tr");
            let suggestedFL = parentRow.find(".SuggestedFL");
            if (!$(this).is(":checked")) {
                if (suggestedFL.length > 0) {
                    let addFromRcValue = (suggestedFL.attr("addfromrc") || "").trim().toLowerCase();
    
                    if (addFromRcValue === "false" || addFromRcValue === "undefined") {
                        let flName = parentRow.find(".item-check-text").text().trim();
                        let _componentId = getDB_ID(flName);
    
                        if (!_componentId) {
                            console.error("DB_ID not found for:", flName);
                            return;
                        }
    
                        let formData = new FormData();
                        formData.append("strDB_IDs", JSON.stringify([_componentId]));
                        formData.append("moduleTypes", JSON.stringify(["Component"]));
    
                        $.ajax({
                            url: Get_Opkey_URL("OPKEY_DOMAIN_NAME") + "/ExplorerTree/DeleteArtifactsFolders",
                            type: 'POST',
                            data: formData,
                            contentType: false,
                            processData: false,
                            success: function (response) {
                                console.log("Delete successful:", response);
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                console.error("AJAX Error:", textStatus, errorThrown);
                            }
                        });
                    } else {
                        console.warn("addfromrc is not 'false', found:", addFromRcValue);
                    }
                } else {
                    console.error(".SuggestedFL not found in row:", parentRow);
                }
            }
        });
    });

    // Reason to suggested FL
    let fl_Name = "";
    let fl_componentID = null;
    let offset_skip = 0;
    let limit_pageSize = 100;
    let api_call_pending = false;
    let grid_load_more = true;
    let datasource_component = [];

    $(document).on('click', '.action_suggestedFL', function (e) {
        debugger
        // console.log("action_suggestedFL value: " + $(this).data("id") + ", Text: " + $(this).data("text"));

        $("#div_modal_selectFL").hide();
        $("#div_modal_suggestedFL").show();

        fl_Name = $(this).data("text");
        fl_Name = getValueByKey(fl_Name);
        fl_componentID = $(this).data("id");

        get_componentSuggestions();

    });

    function getValueByKey(artifact_name) {
        let keyValueCollection = JSON.parse(sessionStorage.getItem("keyValueCollection")) || {};
        return keyValueCollection[artifact_name] || null;
    }

    function get_componentSuggestions() {

        loadingStart('#div_content_Suggested_FL', "Please Wait ...", ".btn");
        api_call_pending = true;

        let opkey_end_point = Get_Opkey_URL("OPKEY_DOMAIN_NAME");
        let form_url = opkey_end_point + '/ExplorerTree/GetComponentSuggestions';

        let form_data = new FormData();
        form_data.append('flName', fl_Name);
        form_data.append('componentID', fl_componentID);
        form_data.append('limit', limit_pageSize);
        form_data.append('offset', offset_skip);

        $.ajax({
            url: form_url,
            data: form_data,
            type: 'POST',
            contentType: false,
            processData: false,
            success: function (result) {
                loadingStop("#div_content_Suggested_FL", ".btn");
                api_call_pending = false;
                datasource_component = [...datasource_component, ...result.data];
                grid_load_more = result.count > datasource_artifact.length;

                if (datasource_component.length == 0) {
                    $("#div_content_Suggested_FL").hide();
                    $("#div_nodata_Suggested_FL").show();
                    $("#div_table_Suggested_FL").html("");
                    return;
                }

                $("#div_content_Suggested_FL").show();
                $("#div_nodata_Suggested_FL").hide();

                let html_template_suggestFL = "<tbody>";

                datasource_component.forEach(item => {
                    debugger
                    html_template_suggestFL = html_template_suggestFL + `
                    <tr>
                        <td>
                            <div class="td_item">
                                <div class="item-check">
                                    <span class="item-check-label">
                                        <input type="checkbox" class="item-check-input action_checkbox_suggestFL" value="${item.text}" id="${item.id}">
                                        <span class="item-check-text" data-bs-toggle="tooltip" title="${item.text}">${item.text}</span>
                                    </span>
                                </div>
                            </div>
                        </td>
                                
                    </tr>`;
                });

                html_template_suggestFL = html_template_suggestFL + "</tbody>";

                $("#div_table_Suggested_FL").html(html_template_suggestFL);
                $('[data-bs-toggle="tooltip"]').tooltip();
            },
            error: function (error) {
                loadingStop("#div_content_Suggested_FL", ".btn");
                api_call_pending = false;
                $("#div_content_Suggested_FL").hide();
                $("#div_nodata_Suggested_FL").show();
                // serviceFactory.showError($scope, error);
            }
        });
    }


    $(document).on('change', '.action_checkbox_suggestFL', function (e) {
        debugger
        if (this.checked) {
            // console.log("Checked value: " + $(this).attr("id") + ", Text: " + $(this).attr("value"));

            let item_id = DOMPurify.sanitize($(this).attr("id"));
            let item_text = DOMPurify.sanitize($(this).attr("value"));

            let json_fl_array = sessionStorage.getItem("temp_fl_arrays");
            let temp_FLArray = JSON.parse(json_fl_array);

            if (temp_FLArray.some(item => item.id == item_id)) {
                ShowToastMessage("warning", "This RC already exists. Please select another FL.");
                $(this).prop("checked", false);
                return
            }

            let tr_template = `<tr id="tr_item_${item_id}">
                <td>
                    <div class="td_item" id="addFromRC">
                        <div class="item-check">
                            <span class="item-check-label">
                                <input type="checkbox" class="item-check-input action_checkbox_FL" value="${item_text}" id="${item_id}" checked="true">
                                <span class="item-check-text" data-bs-toggle="tooltip" title="${item_text}">${item_text}</span>
                            </span>
                        </div>
                    </div>
                </td>
                        
            </tr>`;


            $("#tr_item_" + fl_componentID + " .action_checkbox_FL").prop("checked", false);

            $("#tr_item_" + fl_componentID).after(tr_template);

            $('[data-bs-toggle="tooltip"]').tooltip();

            let obj_temp = { id: item_id, text: item_text };
            temp_FLArray.push(obj_temp);
            sessionStorage.setItem("temp_fl_arrays", JSON.stringify(temp_FLArray));

            clear_data_suggestedFL();

        } else {

        }
    });

    $("#bt_cancel_Suggested_FL").click(function () {
        clear_data_suggestedFL();
    })

    function clear_data_suggestedFL() {
        fl_Name = "";
        fl_componentID = null;
        offset_skip = 0;
        limit_pageSize = 100;
        api_call_pending = false;
        grid_load_more = true;
        datasource_component = [];
        $("#div_modal_suggestedFL").hide();
        $("#div_table_Suggested_FL").html("");
        $("#div_modal_selectFL").show();
    }

    // Reason on scroll suggested fl component 
    document.getElementById("div_modal_body_Suggested_content").addEventListener("scroll", scrollHandler);

    function scrollHandler() {
        debugger;
        if (!grid_load_more || api_call_pending) { return }

        const nativeElement = document.getElementById("div_modal_body_Suggested_content");

        if ((nativeElement.clientHeight + Math.round(nativeElement.scrollTop) === nativeElement.scrollHeight) ||
            (nativeElement.clientHeight + Math.round(nativeElement.scrollTop) + 50 > nativeElement.scrollHeight)) {
            offset_skip += limit_pageSize;
            get_componentSuggestions();
        }

    }
    // ----------End------------------

    $("#cancelButton").click(function (e) {
        window.close();
    });

    $('#accordion-header').click(function (e) {
        var accordionContent = document.querySelector('.table_format_accordian');
        var dropdownIcon = document.querySelector('.dropdown-icon');
        accordionContent.style.display = (accordionContent.style.display === 'none' || accordionContent.style.display === '') ? 'block' : 'none';
        accordionHeader.classList.toggle('opened');
    });

});


function getArtifactName(_name) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return _name + year + "_" + month + "_" + day + "_" + hours + "_" + minutes + "_" + seconds + "_" + milliseconds;
}

function openDataArgumentsEditorUi() {
    $("#editDataArguments").dialog("open");
}

function initDataArgumentsEditorUi() {
    $('#editDataArguments').dialog({
        width: 325,
        height: 322,
        title: "DataArgument Editor",
        autoOpen: false,
        modal: true,
        draggable: false,
        show: "slide",
        hide: "scale",
        buttons: [{
            text: "OK",
            click: function () {
                setAllChangedData();
                $(this).dialog("close");
            },
            class: "btn btn-primary btn-sm"
        },
        {
            text: "Close",
            click: function () {
                $(this).dialog("close");
            },
            class: "btn btn-default btn-sm",
            style: "border: 2px solid #cccc; border-radius: 4px; box-shadow: none;"
        },
        ],
        open: function (e) {
            if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
                var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
                $.ui.dialog.prototype._allowInteraction = function (e) {
                    if ($(e.target).closest('.select2-dropdown').length) return true;
                    return ui_dialog_interaction.apply(this, arguments);
                };
            }
        },
        close: function (e) {

        },
        _allowInteraction: function (event) {
            return !!$(event.target).is(".select2-input") || this._super(event);
        }
    });
}



function openDomainSelectionUi() {

    chrome.runtime.sendMessage({ SetOpkeyOneVars: "SetOpkeyOneVars" }, function (response) {
        debugger
        window.setTimeout(function () {
            var allDomainsArrayStr = localStorage.getItem("OPKEY_DOMAIN_NAMES_ARRAY");
            if (allDomainsArrayStr != null && allDomainsArrayStr != "") {
                var allDomainsArray = JSON.parse(allDomainsArrayStr);

                $('#edit_domainsholder').empty();

                for (var idi = 0; idi < allDomainsArray.length; idi++) {
                    var newOption = $('<option>', {
                        value: allDomainsArray[idi],
                        text: allDomainsArray[idi]
                    });
                    $('#edit_domainsholder').append(DOMPurify.sanitize(newOption));
                }

                $('#edit_domainsholder').trigger('change');
            }
        }, 1000);
    });
    $("#changeDomainModalContent").dialog("open");
}


function startDataSavingInComponentOrTestCase() {
    if (artifactTypeToCreate == "Component") {
        Get_Default_Parent_Node();
    }
    if (artifactTypeToCreate == "Flow") {
        startCreateAutomatedTestCaseWithFLSteps();
    }
}

function initDomainSelectionUi() {
    $('#changeDomainModalContent').dialog({
        width: 325,
        height: 322,
        title: "Select Domain & Project",
        autoOpen: false,
        modal: true,
        draggable: false,
        show: "slide",
        hide: "scale",
        buttons: [{
            text: "Save",
            click: function () {
                startDataSavingInComponentOrTestCase();
                $(this).dialog("close");
            },
            class: "btn btn-primary btn-sm"
        },
        {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            },
            class: "btn btn-default btn-sm"
        },
        ],
        open: function (e) {
            if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
                var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
                $.ui.dialog.prototype._allowInteraction = function (e) {
                    if ($(e.target).closest('.select2-dropdown').length) return true;
                    return ui_dialog_interaction.apply(this, arguments);
                };
            }
        },
        close: function (e) {

        },
        _allowInteraction: function (event) {
            return !!$(event.target).is(".select2-input") || this._super(event);
        }
    });

    $("#edit_domainsholder").change(function (e) {
        var selectedValue = $(this).val();
        localStorage.setItem("OPKEY_DOMAIN_NAME", selectedValue);
        bindProjectList(selectedValue);
    });

    $("#edit_projectssholder").change(function (e) {
        var projectPid = $(this).val();
        var projectName = $(this).text();
        localStorage.setItem("OPKEY_PROJECT_NAME", projectName);
        localStorage.setItem("SELECTED_PROJECT_PID", projectPid);
    });
}

function bindProjectList(opkey_end_point) {
    $('body > div:nth-child(11)').block({
        message: 'Fetching Projects'
    });
    $.ajax({
        url: opkey_end_point + "/OpkeyApi/GetListOfAssignedProject",
        type: "GET",
        success: function (result) {
            $('#edit_projectssholder').empty();
            $.each(result, function (ind, obj) {
                var newOption = $('<option>', {
                    value: obj.P_ID,
                    text: obj.Name
                });
                $('#edit_projectssholder').append(newOption);
            });

            $('#edit_projectssholder').trigger('change');
            $('body > div:nth-child(11)').unblock();
        },
        error: function (error) {
            $('body > div:nth-child(11)').unblock();
        }

    });
}

$(function () {
    initDataArgumentsEditorUi();
    initDomainSelectionUi();
    listemForUIUpdates();
});