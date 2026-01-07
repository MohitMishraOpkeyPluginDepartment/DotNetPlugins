
angular.module('myApp').controller("Manual_create_view_ctrl", ['$rootScope', '$scope', '$state', 'ServiceFactory', 'DataFactory', '$kWindow',
    function ($rootScope, $scope, $state, serviceFactory, dataFactory, $kWindow) {


        var opkey_url = "";

        var issue_type = null;

        $rootScope.Create_issue_crtl = $scope;

        var empty_guid = "00000000-0000-0000-0000-000000000000"

        var unAssignee = { U_ID: empty_guid, email_ID: "Unassigned" };

        var setNoneValue = "None";

        var Selected_TestCase = null;

        $scope.Load_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_View", Load_View);
        };

        $scope.isInsideDocker = function () {
            if (document.URL != null && (document.URL.indexOf("MainDocker.html") > -1 || document.URL.indexOf("callsource=docker") > -1)) {
                return true;
            }
            return false;
        }

        function Load_View() {
            $(function () {
                $("#div_panelOptions").hide();
                $(".navbar.navbar-default").hide();
                $("#Main_HomeBanner").hide();
                $("#div_footer_tutoriol").hide();

                $("#created_artifact_notify").hide();

                let Manual_Create_view_data = serviceFactory.getCallSourceInDataFactory([], "Manual_Create_view_data", "Create_View");
                issueType = Manual_Create_view_data.type;
                Selected_TestCase = Manual_Create_view_data.current_TestCase;
                obj_issue_data = Manual_Create_view_data.Issue_data;
                if (obj_issue_data != null) {
                    $("#issue_name_summary").val(obj_issue_data["Summary"]);
                    attachment_data_source = obj_issue_data["Attachments"];
                    obj_attachment_type = obj_issue_data["obj_attachment_type"];

                    if (Manual_Create_view_data.Attachment_data.length > 0) {
                        if (Manual_Create_view_data.Attachment_data[0].extension == '.png') {
                            Manual_Create_view_data.Attachment_data["Upload_type"] = "Image";
                            obj_attachment_type.Image++;
                        }
                        else {
                            Manual_Create_view_data.Attachment_data["Upload_type"] = "Video";
                            obj_attachment_type.Video++;
                        }
                    }

                    attachment_data_source = [...Manual_Create_view_data.Attachment_data, ...attachment_data_source];


                }
                else {

                    if (Manual_Create_view_data.Attachment_data.length > 0) {
                        if (Manual_Create_view_data.Attachment_data[0].extension == '.png') {
                            Manual_Create_view_data.Attachment_data["Upload_type"] = "Image";
                            obj_attachment_type.Image++;
                        }
                        else {
                            Manual_Create_view_data.Attachment_data["Upload_type"] = "Video";
                            obj_attachment_type.Video++;
                        }
                    }

                    attachment_data_source = Manual_Create_view_data.Attachment_data;
                }

                if (attachment_data_source.length > 0) {
                    bind_attachment_grid();

                    if (obj_issue_data == null) {
                        obj_issue_data = {};
                        obj_issue_data["Attachments"] = attachment_data_source;
                        obj_issue_data["IssueType"] = issueType;
                        //obj_issue_data["ProjectID"] = $rootScope.Scope_Main.Get_Opkey_URL("SELECTED_PROJECT_PID");
                        obj_issue_data["assignee_ID"] = empty_guid;
                        obj_issue_data["reporter_ID"] = dataFactory.userDTO?.U_ID;
                        obj_issue_data["TicketType"] = "None";
                        obj_issue_data["Priority"] = "Low";
                        obj_issue_data["Sprint"] = empty_guid;
                        obj_issue_data["Summary"] = "";
                        obj_issue_data["Description"] = "";
                        obj_issue_data["obj_attachment_type"] = obj_attachment_type;
                    }

                    let local_data = {
                        GridRow: Selected_TestCase,
                        GridID: "",
                        type: issueType,
                        Issue_data: obj_issue_data,
                    }

                    localStorage.setItem("capture_step_data", JSON.stringify(local_data));

                    // console.log("localStorage.setItem capture_step_data", localStorage.getItem("capture_step_data"));
                }
                else {
                    $("#attachment_grid_panel").hide();
                    $("#attachment_wrapper").html('');
                }

                issue_type = issueType;
                opkey_url = serviceFactory.GetGlobalSetting("OPKEY_DOMAIN_NAME");

                if (Selected_TestCase != null) {
                    if (Selected_TestCase.Type == "ManualFlow") {
                        $("#bold_TestCase_name").html(Selected_TestCase.Name);
                        $("#selected_TC_title").prop('title', Selected_TestCase.Name);
                    }
                    else {
                        if (obj_issue_data == null) {
                            get_step_attachments();
                        }
                    }

                }

                bind_form();

                if (document.URL.indexOf('callsource') > -1) {
                    get_assigned_project();
                    $("#cancel_create_form").hide();
                    $("#discard_docker_form").show();
                    $("#wrapper_project_selection").show();
                    //$('#issueType_DDL').data("kendoDropDownList").enable(false);
                    bind_project_DDL();
                    listen_broadcast_message();
                }


                load_Create_form();

                setTimeout(() => {
                    check_for_response();
                }, 500);
            });
        }

        function bind_project_DDL() {
            $("#manual_project_ddl").kendoDropDownList({
                dataSource: [],
                filter: "contains",
                dataTextField: "Name",
                dataValueField: "P_ID",
                valueTemplate: function (e) {
                    
                    let html = "<span title='" + e.Name + "'>" + e.Name + "</span>";
                    return html;
                },
                template: function (e) {
                    let html = "<span title= '" + e.Name + "'>" + e.Name + "</span>";
                    return html;
                },
                select: function (e) {
                    debugger;
                    choose_project(e.dataItem.P_ID, e.dataItem.Name);
                }
            });

            let manual_project_ddl_wrapper = $("#manual_project_ddl").data("kendoDropDownList").wrapper;

            manual_project_ddl_wrapper.keydown(function (e) {
                if (e.keyCode == 13) {
                    $("#manual_project_ddl").data("kendoDropDownList").toggle();
                }
            });
        }

        var obj_issue_data = null;

        function getCurrentDateTime() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');  // Adding leading zero for months
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
        }

        function load_Create_form() {
            debugger;
            $("#for_journey_guide_view").hide();
            $("#for_journey_guide_view_create").hide();
            if (Selected_TestCase == null) {
                //get_assigned_project();
            }
            if(issue_type == "Recording Guide"){
                get_applications();
                get_workplan();
                $("#not_for_journey_guide_view").hide();
                $("#not_for_journey_guide_view_create").hide();
                $("#for_journey_guide_view").show();
                $("#for_journey_guide_view_create").show();
                const inputField = document.getElementById('issue_name_summary_guide');
                inputField.value = `User_Guide_${getCurrentDateTime()}`;
            }else{
                get_current_users($rootScope.Scope_Main.Get_Opkey_URL("SELECTED_PROJECT_PID"));
                get_ticket_priority();
                get_sprints($rootScope.Scope_Main.Get_Opkey_URL("SELECTED_PROJECT_PID"));
            }

            if (issue_type == "Ticket") {
                get_Tickets_type();
            }


        }


        function bind_form() {

            if (Selected_TestCase == null) {
                $("#selected_TC_hearder_div").hide();
                // $("#current_project_name").prop('disabled', false);
                // $('#current_project_name').kendoDropDownList({
                //     dataSource:[],
                //     filter:"contains",
                //     dataTextField: "Name",
                //     dataValueField: "P_ID",
                //     close: function(e) {
                //         debugger;
                //       },
                //       open: function (e){
                //         debugger;
                //       },
                //     select: function(e) {
                //         debugger;
                //         get_sprints(e.dataItem.P_ID);
                //         let local_data = {
                //             GridRow: Selected_TestCase,
                //             GridID: "",
                //             type: issue_type,
                //             Issue_data: Get_issue_data(),
                //         }

                //         localStorage.setItem("capture_step_data", JSON.stringify(local_data));
                //     }

                // });
            }
            else {
                if (Selected_TestCase.Type != "ManualFlow") {
                    $("#selected_TC_hearder_div").hide();
                }
                //$("#current_project_name").val(serviceFactory.GetGlobalSetting("OPKEY_PROJECT_NAME"));
            }

            if (obj_issue_data != null) {
                $("#issue_name_summary").val(obj_issue_data["Summary"]);
            }
            else {
                if (Selected_TestCase != null) {
                    if (Selected_TestCase.Type != "ManualFlow") {
                        $("#issue_name_summary").val(Selected_TestCase.Name);
                    }
                }
            }

            $("#issue_name_summary").on('change', function (e) {
                debugger;
                store_data_in_local();
            })

            $('#issueType_DDL').kendoDropDownList({
                dataSource: ["User Story", "Ticket"],
                // dataSource: ["User Story", "Ticket" , "Recording Guide"],
                close: function (e) {
                    debugger;
                },
                open: function (e) {
                    debugger;
                },
                select: function (e) {
                    debugger;
                    issue_type = e.dataItem;
                    $("#for_journey_guide_view").hide();
                    if (issue_type == "Ticket") {
                        $("#reporter_wrapper").hide();
                        $("#TicketType_wrapper").show();


                        if ($('#TicketType_dropdown').data('kendoDropDownList').dataSource.data().length == 0) {
                            get_Tickets_type();
                        }
                        if (document.URL.indexOf('callsource') > -1) {
                            let data = { action: "active_ticket" };
                            window.parent.postMessage(JSON.stringify(data), "*");
                        }
                    }
                    else if (issue_type == "Recording Guide") {
                        $("#not_for_journey_guide_view").hide();
                        $("#for_journey_guide_view").show();
                    }
                    else {
                        $("#TicketType_wrapper").hide();
                        $("#reporter_wrapper").show();

                        if (document.URL.indexOf('callsource') > -1) {
                            let data = { action: "active_story" };
                            window.parent.postMessage(JSON.stringify(data), "*");
                        }
                    }

                    setTimeout(function () {
                        store_data_in_local();
                    }, 500);
                }

            });

            let issueType_DDL_wrapper = $("#issueType_DDL").data("kendoDropDownList").wrapper;

            issueType_DDL_wrapper.keydown(function (e) {
                if (e.keyCode == 13) {
                    $("#issueType_DDL").data("kendoDropDownList").toggle();
                }
            });

            if (obj_issue_data != null) {
                $("#issueType_DDL").data("kendoDropDownList").value(obj_issue_data.IssueType);
            }
            else {
                $("#issueType_DDL").data("kendoDropDownList").value(issue_type);
            }


            $('#TicketType_dropdown').kendoDropDownList({
                dataSource: [],
                dataTextField: "Name",
                dataValueField: "ID",
                filter: "contains",
                close: function (e) {
                    debugger;
                },
                open: function (e) {
                    debugger;
                },
                valueTemplate: function (e) {
                    let html = "<span title='"+e.Name+"'>" + e.Name + "</span>";
                    return html;
                },
                template: function (e) {
                    let html = "<span title='" + e.Name + "'>" + e.Name + "</span>";
                    return html;
                },
                select: function (e) {
                    debugger;
                    setTimeout(function () {
                        store_data_in_local();
                    }, 500);

                }

            });

            let TicketType_dropdown_wrapper = $("#TicketType_dropdown").data("kendoDropDownList").wrapper;

            TicketType_dropdown_wrapper.keydown(function (e) {
                if (e.keyCode == 13) {
                    $("#TicketType_dropdown").data("kendoDropDownList").toggle();
                }
            });

            $('#Reporter_list_DDL').kendoDropDownList({
                dataSource: [],
                dataTextField: "email_ID",
                dataValueField: "U_ID",
                filter: "contains",
                close: function (e) {
                    debugger;
                },
                open: function (e) {
                    debugger;
                },
                valueTemplate: function (e) {
                    if (e == "") {
                        return "<span class='unAssignee_user'><i class='oci oci-user'></i><span>Unassigned</span></span>";
                    }
                    let html = "";
                    if (e.U_ID == empty_guid) {
                        html = html + "<span class='unAssignee_user'><i class='oci oci-user'></i><span title='" + e.email_ID + "'>" + e.email_ID + "</span></span>";
                    }
                    else {
                        if (e.U_ID) {
                            html = html + "<span class='d-flex align-items-center w-100'><span class='item-img'><img src='" + opkey_url + "/user/getavatar/" + e.U_ID + "'></span>";
                            html = html + "<span class='d-block ps-2' style='max-width: 11rem;' ><span class='value-template-text align-middle text-ellipsis font_14px' title='" + e.Name + "'>" + e.Name + "</span></span></span>";
                        }
                    }
                    return html;
                },
                template: function (e) {
                    if (e == "") {
                        return "<span class='unAssignee_user'><i class='oci oci-user'></i><span>Unassigned</span></span>";
                    }
                    let html = "";
                    if (e.U_ID == empty_guid) {
                        html = html + "<span class='unAssignee_user'><i class='oci oci-user'></i><span title='" + e.email_ID + "'>" + e.email_ID + "</span></span>";
                    }
                    else {
                        html = html + "<span class='d-flex align-items-center'><span class='item-img'><img src='" + opkey_url + "/user/getavatar/" + e.U_ID + "'></span></span>";
                        html = html + "<span class='d-block ps-2' style='max-width: 14rem; display: inline-grid !important;' ><span class='value-template-text align-middle text-ellipsis font_14px' title='" + e.Name + "'>" + e.Name + "</span>";
                        html = html + "<span class='value-template-text align-middle text-ellipsis font_14px' title='" + e.email_ID + "'>" + e.email_ID + "</span></span>";
                    }
                    return html;
                },
                select: function (e) {
                    debugger;
                    setTimeout(function () {
                        store_data_in_local();
                    }, 500);
                }

            });

            let Reporter_list_DDL_wrapper = $("#Reporter_list_DDL").data("kendoDropDownList").wrapper;

            Reporter_list_DDL_wrapper.keydown(function (e) {
                if (e.keyCode == 13) {
                    $("#Reporter_list_DDL").data("kendoDropDownList").toggle();
                }
            });

            $('#assignee_DDL').kendoDropDownList({
                dataSource: [],
                dataTextField: "email_ID",
                dataValueField: "U_ID",
                filter: "contains",
                close: function (e) {
                    debugger;
                },
                open: function (e) {
                    debugger;
                },
                valueTemplate: function (e) {
                    debugger;
                    if (e == "") {
                        return "<span class='unAssignee_user'><i class='oci oci-user'></i><span>Unassigned</span></span>";
                    }
                    let html = "";
                    if (e.U_ID == empty_guid) {
                        html = html + "<span class='unAssignee_user'><i class='oci oci-user'></i><span title='" + e.email_ID + "'>" + e.email_ID + "</span></span>";
                    }
                    else {
                        if (e.U_ID) {
                            html = html + "<span class='d-flex align-items-center'><span class='item-img'><img src='" + opkey_url + "/user/getavatar/" + e.U_ID + "'></span>";
                            html = html + "<span class='d-block ps-2' style='max-width: 11rem;' ><span class='value-template-text align-middle text-ellipsis font_14px' title='" + e.Name + "'>" + e.Name + "</span></span></span>";
                        }
                    }
                    return html;
                },
                template: function (e) {
                    if (e == "") {
                        return "<span class='unAssignee_user'><i class='oci oci-user'></i><span>Unassigned</span></span>";
                    }
                    let html = "";
                    if (e.U_ID == empty_guid) {
                        html = html + "<span class='unAssignee_user'><i class='oci oci-user'></i><span title='" + e.email_ID + "'>" + e.email_ID + "</span></span>";
                    }
                    else {
                        html = html + "<span class='d-flex align-items-center'><span class='item-img'><img src='" + opkey_url + "/user/getavatar/" + e.U_ID + "'></span></span>";
                        html = html + "<span class='d-block ps-2' style='max-width: 14rem; display: inline-grid !important;'><span class='value-template-text align-middle text-ellipsis font_14px' title='" + e.Name + "'>" + e.Name + "</span>";
                        html = html + "<span class='value-template-text align-middle text-ellipsis font_14px' title='" + e.email_ID + "'>" + e.email_ID + "</span></span>";
                    }
                    return html;
                },
                select: function (e) {
                    debugger;
                    setTimeout(function () {
                        store_data_in_local();
                    }, 500);
                }

            });

            let assignee_DDL_wrapper = $("#assignee_DDL").data("kendoDropDownList").wrapper;

            assignee_DDL_wrapper.keydown(function (e) {
                if (e.keyCode == 13) {
                    $("#assignee_DDL").data("kendoDropDownList").toggle();
                }
            });

            $('#priority_List_dropdown').kendoDropDownList({
                dataSource: [],
                filter: "contains",
                dataTextField: "Name",
                dataValueField: "ID",
                close: function (e) {
                    debugger;
                },
                open: function (e) {
                    debugger;
                },
                valueTemplate: function (e) {
                    let html = "<span><i class='oci oci-" + e.Name + "'></i><span title='" + e.Name + "'>" + e.Name + "</span></span>";

                    return html;
                },
                template: function (e) {
                    let html = "<span><i class='oci oci-" + e.Name + "'></i><span title='" + e.Name + "'>" + e.Name + "</span></span>";
                    return html;
                },
                select: function (e) {
                    debugger;
                    setTimeout(function () {
                        store_data_in_local();
                    }, 500);
                }

            });

            let priority_List_dropdown_wrapper = $("#priority_List_dropdown").data("kendoDropDownList").wrapper;

            priority_List_dropdown_wrapper.keydown(function (e) {
                if (e.keyCode == 13) {
                    $("#priority_List_dropdown").data("kendoDropDownList").toggle();
                }
            });

            $('#sprint_DDL').kendoDropDownList({
                dataSource: [],
                filter: "contains",
                dataTextField: "ArtifactName",
                dataValueField: "ArtifactId",
                close: function (e) {
                    debugger;
                },
                open: function (e) {
                    debugger;
                },
                valueTemplate: function (e) {
                    let html = "<span title='" + e.ArtifactName + "'>" + e.ArtifactName + "</span>";
                    return html;
                },
                template: function (e) {
                    let html = "<span title= '" + e.ArtifactName + "'>" + e.ArtifactName + "</span>";
                    return html;
                },
                select: function (e) {
                    debugger;
                    setTimeout(function () {
                        store_data_in_local();
                    }, 500);
                }

            });

            let sprint_DDL_wrapper = $("#sprint_DDL").data("kendoDropDownList").wrapper;

            sprint_DDL_wrapper.keydown(function (e) {
                if (e.keyCode == 13) {
                    $("#sprint_DDL").data("kendoDropDownList").toggle();
                }
            });

            //$("#issue_description").kendoEditor();
            $("#issue_description").kendoEditor({
                tools: [
                    "bold", "italic", "underline", "strikethrough", "justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "insertUnorderedList", "insertOrderedList", "fontSize"
                ],
                keydown: function (e) {
                    /* The result can be observed in the DevTools(F12) console of the browser. */
                    setTimeout(function () {
                        store_data_in_local();
                    }, 500);
                },
                change: function (e) {
                    setTimeout(function () {
                        store_data_in_local();
                    }, 500);
                }
            });

            setTimeout(() => {
                if (obj_issue_data != null) {
                    let issue_editor = $("#issue_description").data("kendoEditor");
                    if (issue_editor != null && issue_editor != undefined && obj_issue_data.hasOwnProperty('Description')) {
                        issue_editor.value(obj_issue_data['Description']);
                    }
                }
            }, 500);

            $('#tree_node_dropdown').kendoDropDownList({
                filter: "contains",
                optionLabel: 'Please select work plan...',
                dataTextField: "text",
                dataValueField: "id",
                dataSource: [],
                close: function (e) {
                    debugger;
                },
                open: function (e) {
                    debugger;
                },
                select: function (e) {
                    debugger;
                    setTimeout(function () {
                        store_data_in_local();
                        var workPlanSelect = $('#tree_node_dropdown').data('kendoDropDownList').value();
                        const nameField = document.getElementById('name_field');
                        if (workPlanSelect !== "") {
                            nameField.style.display = 'block';
                        } else {
                            nameField.style.display = 'none';
                        }
                    }, 500);
                }
            });

            let tree_node_dropdown_wrapper = $("#tree_node_dropdown").data("kendoDropDownList").wrapper;

            tree_node_dropdown_wrapper.keydown(function (e) {
                if (e.keyCode == 13) {
                    $("#tree_node_dropdown").data("kendoDropDownList").toggle();
                }
            });

            $('#application_dropdown').kendoDropDownList({
                dataSource: [],
                filter: "contains",
                close: function (e) {
                    debugger;
                },
                open: function (e) {
                    debugger;
                },
                select: function (e) {
                    debugger;
                    setTimeout(function () {
                        store_data_in_local();
                        get_modules();
                    }, 500);
                }
            });

            let application_dropdown_wrapper = $("#application_dropdown").data("kendoDropDownList").wrapper;

            application_dropdown_wrapper.keydown(function (e) {
                if (e.keyCode == 13) {
                    $("#application_dropdown").data("kendoDropDownList").toggle();
                }
            });

            $('#module_dropdown').kendoDropDownList({
                dataSource: [],
                filter: "contains",
                close: function (e) {
                    debugger;
                },
                open: function (e) {
                    debugger;
                },
                select: function (e) {
                    debugger;
                    setTimeout(function () {
                        store_data_in_local();
                        get_processes()
                    }, 500);
                }
            });

            let module_dropdown_wrapper = $("#module_dropdown").data("kendoDropDownList").wrapper;

            module_dropdown_wrapper.keydown(function (e) {
                if (e.keyCode == 13) {
                    $("#module_dropdown").data("kendoDropDownList").toggle();
                }
            });

            $('#process_dropdown').kendoDropDownList({
                dataSource: [],
                filter: "contains",
                close: function (e) {
                    debugger;
                },
                open: function (e) {
                    debugger;
                },
                select: function (e) {
                    debugger;
                    setTimeout(function () {
                        store_data_in_local();
                    }, 500);
                }
            });

            let process_dropdown_wrapper = $("#process_dropdown").data("kendoDropDownList").wrapper;

            process_dropdown_wrapper.keydown(function (e) {
                if (e.keyCode == 13) {
                    $("#process_dropdown").data("kendoDropDownList").toggle();
                }
            });

            


            $("#cancel_create_form").on('click', function (e) {

                if (IsRecordingInProgress) {
                    chrome.runtime.sendMessage({
                        ShowVideoEditorInFront: "ShowVideoEditorInFront"
                    }, function (response) { });
                    serviceFactory.notifier($scope, 'Capture ' + get_inprogress_Recordinf_type() + ' is in progress', 'warning');
                    return;
                }

                clearTimeout(addon_time_out);

                let view = serviceFactory.getCallSourceInDataFactory([], "Manual_Create_view_data", "Create_View");
                localStorage.removeItem("capture_step_data");
                $scope.ChangePageView(view.CallSource);
            });

            $("#create_issue").on('click', function (e) {
                debugger;
                if (IsRecordingInProgress) {
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', type: 'warning' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', 'warning');
                    }
                    chrome.runtime.sendMessage({
                        ShowVideoEditorInFront: "ShowVideoEditorInFront"
                    }, function (response) { });
                    return;
                }

                if (issue_type == "Ticket") {
                    if (Selected_TestCase == null) {
                        create_Ticket_project();
                    }
                    else {
                        if (Selected_TestCase.Type == "ManualFlow") {
                            create_Ticket_TestCase();
                            return;
                        }
                        else {
                            create_ticket_manualStep();
                            return;
                        }
                    }


                }
                else if (issue_type == "Recording Guide") {
                    create_Guide_Recording();
                    return;
                }
                else {
                    if (Selected_TestCase == null) {
                        create_requirement_project();
                    }
                    else {
                        if (Selected_TestCase.Type == "ManualFlow") {
                            create_requirement_TestCase();
                            return;
                        }
                        else {
                            create_requirement_ManualStep();
                        }
                    }
                }
            });

            $(".add_attachment_create").on('click', function (e) {
                debugger;
                if (IsRecordingInProgress) {
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', type: 'warning' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', 'warning');
                    }
                    chrome.runtime.sendMessage({
                        ShowVideoEditorInFront: "ShowVideoEditorInFront"
                    }, function (response) { });
                    return;
                }
                $("#upload_file_local_input").click();
            });

            $("#upload_file_local_input").on('change', function (e) {
                debugger;
                let acceptedExtensionArray = ["png", "jpge", "jpg", "webm", "gif", "mp4"];
                let file = e.target.files[0];
                e.target.value = null;
                let name_array = file.name.split('.');
                let extension = name_array[name_array.length - 1];
                // if(acceptedExtensionArray.indexOf(extension) == -1) {
                //     serviceFactory.notifier($scope, 'Invalid file type', 'error');
                //     return;
                // }

                var fileSize = file.size;
                var MaxFileSizeLimit = 15;
                var convertedValidateFileSize = parseInt(MaxFileSizeLimit) * 1024 * 1024;

                if (fileSize > convertedValidateFileSize) {
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: 'File size should not be more then 15MB.', type: 'error' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, 'File size should not be more then 15MB.', 'error');
                    }
                    return false;
                }

                upload_temp_file(file);
            });


            $(".add_capture_image_create").on('click', function (e) {
                if (is_dropdown_clicked) {
                    is_dropdown_clicked = false;
                    return false;
                }
                if (IsRecordingInProgress) {
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', type: 'warning' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', 'warning');
                    }
                    chrome.runtime.sendMessage({
                        ShowVideoEditorInFront: "ShowVideoEditorInFront"
                    }, function (response) { });
                    return;
                }

                chrome.runtime.sendMessage({
                    ResetVideoUploadStatus: "ResetVideoUploadStatus"
                }, function (response) { });

                var hideDocker = { action: "hide_docker" };
                window.parent.postMessage(JSON.stringify(hideDocker), "*");

                var json_addon = {
                    "url": opkey_url,
                    "Result_ID": Selected_TestCase == null ? '' : Selected_TestCase.Result_ID,
                    "SessionID": localStorage.getItem("SessionID"),
                    "tc name": '',
                    "utility": 'qlm_snapshot'
                };

                var selectedOption = $(this).text();
                debugger
                if (selectedOption.indexOf("Capture Visible Part") > -1) {
                    json_addon["captureMode"] = "CAPTUREIMGAEVISIBLEAREA";
                }
                else if (selectedOption.indexOf("Capture Full Page") > -1) {
                    json_addon["captureMode"] = "CAPTUREIMGAEFULLPAGE";
                }
                localStorage.removeItem("QLM_Response");
                localStorage.removeItem("OpkeyTestRunnerSnapData");
                localStorage.setItem("OpkeyTestRunnerSnapData", JSON.stringify(json_addon));

                store_data_in_local();

                setTimeout(() => {
                    let data = { action: "close_docker" };
                    window.parent.postMessage(JSON.stringify(data), "*");
                }, 1000);

                setTimeout(() => {
                    var showDocker = { action: "show_docker" };
                    window.parent.postMessage(JSON.stringify(showDocker), "*");
                }, 2000);

                $("#snap_loader").show();

                setTimeout(() => {
                    check_for_response();
                    //check_for_Issue_attachment_success();
                }, 800);
            });


            $("#capture_visible, #CaptureVisiblePart").click(function (e) {
                if (is_dropdown_clicked) {
                    is_dropdown_clicked = false;
                    return false;
                }
                if (IsRecordingInProgress) {
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', type: 'warning' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', 'warning');
                    }
                    chrome.runtime.sendMessage({
                        ShowVideoEditorInFront: "ShowVideoEditorInFront"
                    }, function (response) { });
                    return;
                }

                chrome.runtime.sendMessage({
                    ResetVideoUploadStatus: "ResetVideoUploadStatus"
                }, function (response) { });

                var hideDocker = { action: "hide_docker" };
                window.parent.postMessage(JSON.stringify(hideDocker), "*");

                var json_addon = {
                    "url": opkey_url,
                    "Result_ID": Selected_TestCase == null ? '' : Selected_TestCase.Result_ID,
                    "SessionID": localStorage.getItem("SessionID"),
                    "tc name": '',
                    "utility": 'qlm_snapshot'
                };

                json_addon["captureMode"] = "CAPTUREIMGAEVISIBLEAREA";
                localStorage.removeItem("QLM_Response");
                localStorage.removeItem("OpkeyTestRunnerSnapData");
                localStorage.setItem("OpkeyTestRunnerSnapData", JSON.stringify(json_addon));

                store_data_in_local();

                setTimeout(() => {
                    let data = { action: "close_docker" };
                    window.parent.postMessage(JSON.stringify(data), "*");
                }, 1000);

                setTimeout(() => {
                    var showDocker = { action: "show_docker" };
                    window.parent.postMessage(JSON.stringify(showDocker), "*");
                }, 2000);

                $("#snap_loader").show();

                setTimeout(() => {
                    check_for_response();
                    //check_for_Issue_attachment_success();
                }, 800);
            });

            $("#CaptureOtherWindow").click(function (e) {
                if (is_dropdown_clicked) {
                    is_dropdown_clicked = false;
                    return false;
                }
                if (IsRecordingInProgress) {
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', type: 'warning' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', 'warning');
                    }
                    chrome.runtime.sendMessage({
                        ShowVideoEditorInFront: "ShowVideoEditorInFront"
                    }, function (response) { });
                    return;
                }

                window.close();
                chrome.runtime.sendMessage({
                    ResetVideoUploadStatus: "ResetVideoUploadStatus"
                }, function (response) { });

                var hideDocker = { action: "hide_docker" };
                window.parent.postMessage(JSON.stringify(hideDocker), "*");

                var json_addon = {
                    "url": opkey_url,
                    "Result_ID": Selected_TestCase == null ? '' : Selected_TestCase.Result_ID,
                    "SessionID": localStorage.getItem("SessionID"),
                    "tc name": '',
                    "utility": 'qlm_snapshot'
                };

                json_addon["captureMode"] = "CAPTUREIMGAEOFOTHERWINDOW";
                localStorage.removeItem("QLM_Response");
                localStorage.removeItem("OpkeyTestRunnerSnapData");
                localStorage.setItem("OpkeyTestRunnerSnapData", JSON.stringify(json_addon));

                store_data_in_local();

                setTimeout(() => {
                    let data = { action: "close_docker" };
                    window.parent.postMessage(JSON.stringify(data), "*");
                }, 1000);

                setTimeout(() => {
                    var showDocker = { action: "show_docker" };
                    window.parent.postMessage(JSON.stringify(showDocker), "*");
                }, 2000);

                $("#snap_loader").show();

                setTimeout(() => {
                    check_for_response();
                    //check_for_Issue_attachment_success();
                }, 800);
            });

            $("#capture_full, #CaptureFullPage").click(function (e) {
                if (is_dropdown_clicked) {
                    is_dropdown_clicked = false;
                    return false;
                }
                if (IsRecordingInProgress) {
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', type: 'warning' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', 'warning');
                    }
                    chrome.runtime.sendMessage({
                        ShowVideoEditorInFront: "ShowVideoEditorInFront"
                    }, function (response) { });
                    return;
                }

                chrome.runtime.sendMessage({
                    ResetVideoUploadStatus: "ResetVideoUploadStatus"
                }, function (response) { });

                var hideDocker = { action: "hide_docker" };
                window.parent.postMessage(JSON.stringify(hideDocker), "*");

                var json_addon = {
                    "url": opkey_url,
                    "Result_ID": Selected_TestCase == null ? '' : Selected_TestCase.Result_ID,
                    "SessionID": localStorage.getItem("SessionID"),
                    "tc name": '',
                    "utility": 'qlm_snapshot'
                };

                json_addon["captureMode"] = "CAPTUREIMGAEFULLPAGE";
                localStorage.removeItem("QLM_Response");
                localStorage.removeItem("OpkeyTestRunnerSnapData");
                localStorage.setItem("OpkeyTestRunnerSnapData", JSON.stringify(json_addon));

                store_data_in_local();

                setTimeout(() => {
                    let data = { action: "close_docker" };
                    window.parent.postMessage(JSON.stringify(data), "*");
                }, 1000);

                setTimeout(() => {
                    var showDocker = { action: "show_docker" };
                    window.parent.postMessage(JSON.stringify(showDocker), "*");
                }, 2000);

                $("#snap_loader").show();

                setTimeout(() => {
                    check_for_response();
                    //check_for_Issue_attachment_success();
                }, 800);
            });

            $(".add_capture_video_create").on('click', function (e) {
                debugger;
                if (is_video_dropdown_clicked) {
                    is_video_dropdown_clicked = false;
                    return false;
                }
                if (IsRecordingInProgress) {
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', type: 'warning' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', 'warning');
                    }
                    chrome.runtime.sendMessage({
                        ShowVideoEditorInFront: "ShowVideoEditorInFront"
                    }, function (response) { });
                    return;
                }

                chrome.runtime.sendMessage({
                    ResetVideoUploadStatus: "ResetVideoUploadStatus"
                }, function (response) { });

                var json_addon = {
                    "url": opkey_url,
                    "Result_ID": Selected_TestCase == null ? '' : Selected_TestCase.Result_ID,
                    "SessionID": localStorage.getItem("SessionID"),
                    "tc name": '',
                    "utility": 'qlm_video'
                };

                var insideDocker = $scope.isInsideDocker();
                var selectedOption = $(this).text();
                debugger
                if (insideDocker == false) {
                    if (selectedOption.indexOf("Record Current Tab") > -1) {
                        json_addon["captureMode"] = "CaptureCurrentWithTabCaptureApi";
                    }
                    else if (selectedOption.indexOf("Record Other Tabs") > -1) {
                        json_addon["captureMode"] = "StartVideoRecording";
                    }
                }
                else {
                    if (selectedOption.indexOf("Record Current Tab") > -1) {
                        json_addon["captureMode"] = "CaptureCurrentWithDisplayModeCurrentTab";
                    }
                    else if (selectedOption.indexOf("Record Other Tabs") > -1) {
                        json_addon["captureMode"] = "StartVideoRecording";
                    }
                }

                localStorage.removeItem("QLM_Response");
                localStorage.removeItem("OpkeyTestRunnerSnapData");
                localStorage.setItem("OpkeyTestRunnerSnapData", JSON.stringify(json_addon));

                store_data_in_local();

                setTimeout(() => {
                    let data = { action: "close_docker" };
                    window.parent.postMessage(JSON.stringify(data), "*");
                }, 1000);


                $("#snap_loader").show();

                setTimeout(() => {
                    check_for_response();
                    //check_for_Issue_attachment_success();
                }, 800);

            });

            $("#record_current, #RecordCurrentTab").click(function (e) {
                if (is_video_dropdown_clicked) {
                    is_video_dropdown_clicked = false;
                    return false;
                }
                if (IsRecordingInProgress) {
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', type: 'warning' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', 'warning');
                    }
                    chrome.runtime.sendMessage({
                        ShowVideoEditorInFront: "ShowVideoEditorInFront"
                    }, function (response) { });
                    return;
                }

                chrome.runtime.sendMessage({
                    ResetVideoUploadStatus: "ResetVideoUploadStatus"
                }, function (response) { });

                var json_addon = {
                    "url": opkey_url,
                    "Result_ID": Selected_TestCase == null ? '' : Selected_TestCase.Result_ID,
                    "SessionID": localStorage.getItem("SessionID"),
                    "tc name": '',
                    "utility": 'qlm_video'
                };

                var insideDocker = $scope.isInsideDocker();
                if (insideDocker == false) {
                    json_addon["captureMode"] = "CaptureCurrentWithTabCaptureApi";
                }
                else {
                    json_addon["captureMode"] = "CaptureCurrentWithDisplayModeCurrentTab";
                }

                localStorage.removeItem("QLM_Response");
                localStorage.removeItem("OpkeyTestRunnerSnapData");
                localStorage.setItem("OpkeyTestRunnerSnapData", JSON.stringify(json_addon));

                store_data_in_local();

                setTimeout(() => {
                    let data = { action: "close_docker" };
                    window.parent.postMessage(JSON.stringify(data), "*");
                }, 1000);


                $("#snap_loader").show();

                setTimeout(() => {
                    check_for_response();
                    //check_for_Issue_attachment_success();
                }, 800);
            });

            $("#record_other, #RecordOtherTabs").click(function (e) {
                if (is_video_dropdown_clicked) {
                    is_video_dropdown_clicked = false;
                    return false;
                }
                if (IsRecordingInProgress) {
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', type: 'warning' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, 'Captured ' + get_inprogress_Recordinf_type() + ' is in inprogress', 'warning');
                    }
                    chrome.runtime.sendMessage({
                        ShowVideoEditorInFront: "ShowVideoEditorInFront"
                    }, function (response) { });
                    return;
                }

                chrome.runtime.sendMessage({
                    ResetVideoUploadStatus: "ResetVideoUploadStatus"
                }, function (response) { });

                var json_addon = {
                    "url": opkey_url,
                    "Result_ID": Selected_TestCase == null ? '' : Selected_TestCase.Result_ID,
                    "SessionID": localStorage.getItem("SessionID"),
                    "tc name": '',
                    "utility": 'qlm_video'
                };

                var insideDocker = $scope.isInsideDocker();
                if (insideDocker == false) {
                    json_addon["captureMode"] = "StartVideoRecording";
                }
                else {
                    json_addon["captureMode"] = "StartVideoRecording";
                }

                localStorage.removeItem("QLM_Response");
                localStorage.removeItem("OpkeyTestRunnerSnapData");
                localStorage.setItem("OpkeyTestRunnerSnapData", JSON.stringify(json_addon));

                store_data_in_local();

                setTimeout(() => {
                    let data = { action: "close_docker" };
                    window.parent.postMessage(JSON.stringify(data), "*");
                }, 1000);


                $("#snap_loader").show();

                setTimeout(() => {
                    check_for_response();
                    //check_for_Issue_attachment_success();
                }, 800);
            });

            if (issue_type == "Ticket") {
                $("#reporter_wrapper").hide();
                $("#TicketType_wrapper").show();
            }
            else {
                $("#TicketType_wrapper").hide();
                $("#reporter_wrapper").show();

                $('#Reporter_list_DDL').data('kendoDropDownList')?.value(dataFactory.userDTO?.U_ID);
            }

        }

        $scope.selected_image_screan = "Capture Visible Part";
        $scope.Unselected_image_screan = "Capture Full Page";

        $scope.set_capture_image_screen = function () {
            debugger;
            $scope.selected_image_screan = $scope.Unselected_image_screan;
            $scope.Unselected_image_screan = $scope.selected_image_screan == "Capture Visible Part" ? "Capture Full Page" : "Capture Visible Part";
            is_dropdown_clicked = false;
        }

        var is_dropdown_clicked = false;
        $scope.open_capture_image_dropdown = function () {
            is_dropdown_clicked = true;
        }

        var is_video_dropdown_clicked = false;
        $scope.open_capture_video_dropdown = function () {
            is_video_dropdown_clicked = true;
        }
        $scope.selected_video_screan = "Record Current Tab";
        $scope.Unselected_video_screan = "Record Other Tabs";

        $scope.set_capture_video_screen = function () {
            debugger;
            $scope.selected_video_screan = $scope.Unselected_video_screan;
            $scope.Unselected_video_screan = $scope.selected_video_screan == "Record Current Tab" ? "Record Other Tabs" : "Record Current Tab";
            is_video_dropdown_clicked = false;
        }
        function get_inprogress_Recordinf_type() {
            let utility = localStorage.getItem("AppUtilityType");
            if (utility != null) {
                if (utility == "snapshot" || utility == "qlm_snapshot" || utility == "qlm_snapshot_IssueType") {
                    return "Snapshot";
                }
                else {
                    return "Video";
                }
            }
        }

        var time_out_snap = null;

        function check_for_Issue_attachment_success() {
            let response = localStorage.getItem("QLM_Response");
            if (response != null && response != "") {
                $("#snap_loader").hide();
                clearTimeout(time_out_snap);
                localStorage.removeItem("QLM_Response");
                let qlm_response = JSON.parse(response);
                var isVideo = false;
                if (qlm_response.extension == ".png") {
                    isVideo = false;
                    qlm_response["Upload_type"] = "Image";
                    obj_attachment_type.Image++;
                }
                else {
                    isVideo = true;
                    qlm_response["Upload_type"] = "Video";
                    obj_attachment_type.Video++;
                }
                attachment_data_source.unshift(qlm_response);
                bind_attachment_grid();
                store_data_in_local();
                if (document.URL.indexOf('callsource') > -1) {
                    if (isVideo) {
                        let data = { action: "notifier", message: 'Video uploaded successfully', type: 'success' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        let data = { action: "notifier", message: 'Snapshot uploaded successfully', type: 'success' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                }
                else {
                    if (isVideo) {
                        serviceFactory.notifier($scope, 'Video uploaded successfully', 'success');
                    }
                    else {
                        serviceFactory.notifier($scope, 'Snapshot uploaded successfully', 'success');
                    }
                }
                return;
            }
            clearTimeout(time_out_snap);
            time_out_snap = setTimeout(() => {
                check_for_Issue_attachment_success();
            }, 800);
        }

        $scope.cancel_check_for_snap = function () {
            clearTimeout(time_out_snap);
            $("#snap_loader").hide();
            chrome.runtime.sendMessage({
                ResetVideoUploadStatus: "STOPSESSION"
            }, function (response) { 
                chrome.runtime.sendMessage({
                    ResetVideoUploadStatus: "INCOMPLETE"
                }, function (response) { 
    
                    
                });

            });
        }

        function Get_issue_data() {
            debugger;
            let issue_data = {};
            issue_data["IssueType"] = issue_type;
            //issue_data["ProjectID"] = Selected_TestCase == null?$("#current_project_name").data('kendoDropDownList').value():$rootScope.Scope_Main.Get_Opkey_URL("SELECTED_PROJECT_PID");
            issue_data["assignee_ID"] = $('#assignee_DDL').data('kendoDropDownList').value() == "" ? empty_guid : $('#assignee_DDL').data('kendoDropDownList').value();
            issue_data["reporter_ID"] = $('#Reporter_list_DDL').data('kendoDropDownList').value() == "" ? empty_guid : $('#Reporter_list_DDL').data('kendoDropDownList').value();
            issue_data["TicketType"] = $('#TicketType_dropdown').data('kendoDropDownList').value() == "" ? 'Defect' : $('#TicketType_dropdown').data('kendoDropDownList').value();
            issue_data["Priority"] = $('#priority_List_dropdown').data('kendoDropDownList').value() == "" ? 'Low' : $('#priority_List_dropdown').data('kendoDropDownList').value();
            issue_data["Sprint"] = $('#sprint_DDL').data('kendoDropDownList').value() == "" ? empty_guid : $('#sprint_DDL').data('kendoDropDownList').value();
            issue_data["Summary"] = $("#issue_name_summary").val();
            issue_data["Description"] = $("#issue_description").data("kendoEditor").value();
            issue_data["Attachments"] = attachment_data_source;
            issue_data["obj_attachment_type"] = obj_attachment_type;
            return issue_data;
        }

        function get_assigned_project() {
            opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

            var current_project_id = $rootScope.Scope_Main.Get_Opkey_URL("SELECTED_PROJECT_PID");

            if (current_project_id == null || current_project_id == "") {
                current_project_id = dataFactory.EmptyGuid;
            }

            loadingStart("#manual_create_issue_wrapper", "Please wait");
            $.ajax({
                url: opkey_end_point + "/OpkeyApi/GetListOfAssignedProject",
                type: "GET",
                success: function (result) {
                    debugger;
                    loadingStop("#manual_create_issue_wrapper");


                    $("#manual_project_ddl").data('kendoDropDownList').dataSource.data(result);

                    if (current_project_id == empty_guid) {
                        $("#manual_project_ddl").data('kendoDropDownList').value(result[0].P_ID);
                        choose_project(result[0].P_ID, result[0].Name)
                    }
                    else {
                        $("#manual_project_ddl").data('kendoDropDownList').value(current_project_id);
                    }

                },
                error: function (error) {
                    loadingStop("#manual_create_issue_wrapper");
                    if(error!=null){
                        if(JSON.stringify(error).indexOf("Session is terminated")>-1){
                            $.msgBox({
                                title: "Opkey",
                                content: "<h5>You have logged in from a different location !</h5><br><h6>Please click on Log In to go to the Login Page.</h6>",
                                modal: true,
                                type: "info",
                                buttons: [{ value: "Login" }],
                                success: function (result) {
                                    $scope.ChangePageView("options.login");
                                }
    
                            });
                            return;
                        }
                    }
                    localStorage.clear();
                    serviceFactory.showError($scope, error);
                    $("#spErrorMessage").text("Unable to Connect to Given Domain");
                    $("#divPanelErrorMessage").show();
                }
            });
        }

        function choose_project(projectId, projectName) {
            debugger;
            if (IsRecordingInProgress) {
                if (document.URL.indexOf('callsource') > -1) {
                    let data = { action: "notifier", message: 'Capture ' + get_inprogress_Recordinf_type() + ' is in progress', type: 'warning' };
                    window.parent.postMessage(JSON.stringify(data), "*");
                }
                else {
                    serviceFactory.notifier($scope, 'Capture ' + get_inprogress_Recordinf_type() + ' is in progress', 'warning');
                }
                chrome.runtime.sendMessage({
                    ShowVideoEditorInFront: "ShowVideoEditorInFront"
                }, function (response) { });
                return;
            }

            opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");
            var remember_me = true;

            loadingStart("#manual_create_issue_wrapper", "Please Wait ...", ".btnTestLoader");
            $.ajax({
                url: opkey_end_point + "/OpkeyApi/ChooseProject",
                data: { projectId: projectId, remember_project_selection: remember_me },
                type: "GET",
                success: function (result) {
                    debugger;
                    loadingStop("#manual_create_issue_wrapper", ".btnTestLoader");
                    //$("#li_project_info").show();

                    $("#li_project_info").attr('title', 'Switch Project (' + projectName + ')'); //Tooltip should be according to selected project
                    if (projectName.length > 15) {
                        projectName = projectName.substring(0, 15)
                            + "...";
                    }

                    serviceFactory.SetGlobalSetting("OPKEY_PROJECT_NAME", projectName);
                    serviceFactory.SetGlobalSetting("SELECTED_PROJECT_PID", projectId);



                    $("#sp_project_info").text(projectName);
                    get_sprints(projectId);

                    //$("#divPanel_Options").removeClass("disabled");
                    //$scope.ChangePageView('options.recording_selection');

                    get_ticket_priority();
                    get_Tickets_type();
                },
                error: function (error) {
                    loadingStop("#manual_create_issue_wrapper", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });


        }


        function get_current_users(P_ID) {

            loadingStart("#manual_create_issue_wrapper", "Please wait");
            $.ajax({
                url: opkey_url + "/Base/getAllEnabledUsersForProject",
                data: {P_ID :P_ID},
                type: "get",
                success: function (res) {
                    debugger;
                    loadingStop("#manual_create_issue_wrapper");
                    res.unshift(unAssignee);


                    $('#assignee_DDL').data('kendoDropDownList').dataSource.data(res);
                    $('#Reporter_list_DDL').data('kendoDropDownList').dataSource.data(res);

                    if (obj_issue_data != null) {
                        $('#assignee_DDL').data('kendoDropDownList').value(obj_issue_data["assignee_ID"]);
                        $('#Reporter_list_DDL').data('kendoDropDownList').value(obj_issue_data["reporter_ID"]);
                    }
                    else {
                        $('#assignee_DDL').data('kendoDropDownList').value(empty_guid);
                        $('#Reporter_list_DDL').data('kendoDropDownList').value(dataFactory.userDTO?.U_ID);
                    }


                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function get_applications() {
            chrome.runtime.sendMessage({ userjourney: "tracking stoped" }, function(response) {
                console.log("Response from background:", response);
            });
            loadingStart("#manual_create_issue_wrapper", "Please wait");
            $.ajax({
                url: opkey_url + "/ExternalApplicationSettings/GetApplications",
                data: {},
                type: "get",
                success: function (res) {
                    debugger;
                    loadingStop("#manual_create_issue_wrapper");
                    res.unshift(setNoneValue);
                    res.push('GenericApp');
                    $('#application_dropdown').data('kendoDropDownList').dataSource.data(res);
                    get_modules();
                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function get_modules() {
            var selectedApplicationId = $('#application_dropdown').data('kendoDropDownList').value();
            loadingStart("#manual_create_issue_wrapper", "Please wait");

            $.ajax({
                url: opkey_url + "/testdiscovery/ERP/GetModulesOfApplication",
                data: { application: selectedApplicationId },
                type: "get",
                success: function (res) {
                    debugger;
                    loadingStop("#manual_create_issue_wrapper");
                    if (selectedApplicationId == 'OracleFusion') {
                        res = res.filter(module => module != "Project Portfolio Management");
                    }
                    res.unshift(setNoneValue);
                    $('#module_dropdown').data('kendoDropDownList').dataSource.data(res);
                    get_processes();
                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function get_processes() {
            var selectedApplicationId = $('#application_dropdown').data('kendoDropDownList').value();
            var selectedModule = $('#module_dropdown').data('kendoDropDownList').value();
            var moduleInArray = [selectedModule];
        
            loadingStart("#manual_create_issue_wrapper", "Please wait");

            var formData = new FormData();
            formData.append("application", selectedApplicationId);
            formData.append("strmodules", JSON.stringify(moduleInArray));
        
            $.ajax({
                url: opkey_url + "/testdiscovery/ERP/GetProcessesOfModules",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    loadingStop("#manual_create_issue_wrapper");
                    res.unshift(setNoneValue);
                    $('#process_dropdown').data('kendoDropDownList').dataSource.data(res);
                },
                error: function (error) {
                    loadingStop("#manual_create_issue_wrapper");
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function get_workplan() {
            var workPlanPayload = {
                "SearchString": null,
                "ModuleTypesToFilterOn": ["Release"],
                "ModeToFilterOn": null,
                "SortingColumn": "modified_on",
                "SortingDirection": "Descending",
                "Limit": 10000,
                "Offset": 0
            };
        
            loadingStart("#manual_create_issue_wrapper", "Please wait");
        
            var formData = new FormData();
            formData.append("strTreeStructureFilterAndSorting", JSON.stringify(workPlanPayload));
        
            $.ajax({
                url: opkey_url + "/ExplorerTree/GetTreeNodesWithFilters",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    console.log(res);
                    loadingStop("#manual_create_issue_wrapper");
                    var dropdown = $('#tree_node_dropdown').data('kendoDropDownList');
                    dropdown.dataSource.data(res.data);
                },                
                error: function (error) {
                    loadingStop("#manual_create_issue_wrapper");
                    serviceFactory.showError($scope, error);
                }
            });
        }
        
        

        var default_sprint = { "ArtifactName": "None", ArtifactId: empty_guid };

        // function get_ticket_priority() {
        //     loadingStart("#manual_create_issue_wrapper", "Please wait");
        //     $.ajax({
        //         url: opkey_url + "/Tickets/GetPriority",
        //         data: {},
        //         type: "get",
        //         success: function (res) {
        //             debugger;
        //             loadingStop("#manual_create_issue_wrapper");


        //             $('#priority_List_dropdown').data('kendoDropDownList').dataSource.data(res);

        //             if (obj_issue_data != null) {
        //                 $('#priority_List_dropdown').data('kendoDropDownList').value(obj_issue_data["Priority"]);
        //             }
        //             else {
        //                 $('#priority_List_dropdown').data('kendoDropDownList').value(res[0]);
        //             }

        //         },
        //         error: function (error) {
        //             serviceFactory.showError($scope, error);
        //         }
        //     });
        // }

        function get_ticket_priority() {
            loadingStart("#manual_create_issue_wrapper", "Please wait");
            $.ajax({
                url: opkey_url + "/QLM/GetRegisteredValuesOfAnArtifactByProjectId",
                data: {moduleType: " AllUnified", field: "Priority", includeHidden: false, pid: $rootScope.Scope_Main.Get_Opkey_URL("SELECTED_PROJECT_PID")},
                type: "get",
                success: function (res) {
                    debugger;

                    loadingStop("#manual_create_issue_wrapper");
                    let defaultItem = null;
                    res.forEach(item => {
                   if (item.IsDefault === true) {
                       defaultItem = item;
                        }
                       });

                    $('#priority_List_dropdown').data('kendoDropDownList').dataSource.data(res);
                    if( obj_issue_data != null && obj_issue_data.Priority == "Low"){
                        obj_issue_data.Priority = defaultItem.ID
                    }

                    if (obj_issue_data != null) {
                        $('#priority_List_dropdown').data('kendoDropDownList').value(obj_issue_data["Priority"]);
                    }
                    else {
                            if (defaultItem) {
                                // Set the value to the ID of the default item
                                $('#priority_List_dropdown').data('kendoDropDownList').value(defaultItem.ID);
                            } else {
                                // If there's no default item, you can choose a different default behavior
                                $('#priority_List_dropdown').data('kendoDropDownList').value(res[0].ID);
                            }                     
                    }
                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function get_sprints(P_ID) {
            loadingStart("#manual_create_issue_wrapper", "Please wait");

            let ajax_url = "/Sprint/GetAllSprintsOfAProject";
            let data = { "projectID": P_ID };
            if (P_ID == empty_guid || P_ID == "" || P_ID == undefined || P_ID == null) {
                ajax_url = "/Sprint/GetAllSprints";
                data = {};
            }

            $.ajax({
                url: opkey_url + "/Sprint/GetAllSprints",
                data: {},
                type: "get",
                success: function (res) {
                    debugger;
                    loadingStop("#manual_create_issue_wrapper");
                    res.unshift(default_sprint);

                    $('#sprint_DDL').data('kendoDropDownList').dataSource.data(res);

                    if (obj_issue_data != null) {
                        $('#sprint_DDL').data('kendoDropDownList').value(obj_issue_data["Sprint"]);
                    }
                    else {
                        $('#sprint_DDL').data('kendoDropDownList').value(empty_guid);
                    }

                },
                error: function (error) {
                    debugger;
                    loadingStop("#manual_create_issue_wrapper");
                    serviceFactory.showError($scope, error);
                }
            });
        }

        // function get_Tickets_type() {
        //     loadingStart("#manual_create_issue_wrapper", "Please wait");
        //     $.ajax({
        //         url: opkey_url + "/Tickets/GetTicketTypes",
        //         data: {},
        //         type: "get",
        //         success: function (res) {
        //             debugger;
        //             loadingStop("#manual_create_issue_wrapper");

        //             $('#TicketType_dropdown').data('kendoDropDownList').dataSource.data(res);

        //             if (obj_issue_data != null) {
        //                 $('#TicketType_dropdown').data('kendoDropDownList').value(obj_issue_data["TicketType"]);
        //             }
        //             else {
        //                 $('#TicketType_dropdown').data('kendoDropDownList').value("Defect");
        //             }

        //         },
        //         error: function (error) {
        //             loadingStop("#manual_create_issue_wrapper");
        //             serviceFactory.showError($scope, error);
        //         }
        //     });
        // }
        function get_Tickets_type() {
            debugger;
            loadingStart("#manual_create_issue_wrapper", "Please wait");
            $.ajax({
                url: opkey_url + "/QLM/GetRegisteredValuesOfAnArtifactByProjectId",
                data: {moduleType: "Ticket", field: "Type", includeHidden: false,  pid: $rootScope.Scope_Main.Get_Opkey_URL("SELECTED_PROJECT_PID")},
                type: "get",
                success: function (res) {
                    debugger;
                    loadingStop("#manual_create_issue_wrapper");
                    let defaultItem = null;
                     res.forEach(item => {
                    if (item.IsDefault === true) {
                        defaultItem = item;
                         }
                        });

                    $('#TicketType_dropdown').data('kendoDropDownList').dataSource.data(res);
                    
                    if(obj_issue_data != null && obj_issue_data.TicketType == 'None'){
                        obj_issue_data.TicketType = defaultItem.ID
                    }

                    if (obj_issue_data != null) {
                        $('#TicketType_dropdown').data('kendoDropDownList').value(obj_issue_data["TicketType"]);
                    }
                    else {
                       if (defaultItem) {
                        // Set the value to the ID of the default item
                        $('#TicketType_dropdown').data('kendoDropDownList').value(defaultItem.ID);
                    } else {
                        // If there's no default item, you can choose a different default behavior
                        $('#TicketType_dropdown').data('kendoDropDownList').value(res[0].ID);
                    }
                    }

                },
                error: function (error) {
                    loadingStop("#manual_create_issue_wrapper");
                    serviceFactory.showError($scope, error);
                }
            });
        }

        attachment_data_source = [];

        function upload_temp_file(file) {

            let form_data = new FormData();
            form_data.append(file.name, file);

            loadingStart("#manual_create_issue_wrapper", "Please wait");
            $.ajax({
                url: opkey_url + "/FileManager/Upload_Temp_Attachment",
                data: form_data,
                dataType: 'json',
                type: "post",
                contentType: false,
                processData: false,
                success: function (res) {
                    loadingStop("#manual_create_issue_wrapper");
                    res["Upload_type"] = "Attach";
                    attachment_data_source.unshift(res);
                    obj_attachment_type.Attach++;
                    bind_attachment_grid();
                    store_data_in_local();
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: 'Attachment Uploaded successfully', type: 'success' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, 'Attachment Uploaded successfully', 'success');
                    }
                },
                error: function (error) {
                    loadingStop("#manual_create_issue_wrapper");
                    serviceFactory.showError($scope, error);
                }
            });
        }

        var obj_attachment_type = { Attach: 0, Image: 0, Video: 0 };

        function bind_attachment_grid() {
            bind_attachment_count();

            let html = "";      
            attachment_data_source.forEach((item, ind) => {
                const isVideo = item.Upload_type === 'Video';
                html += `
                  <div class="d-flex align-items-center justify-content-between attachment_row grid_row w-100">
                    <span class="mb-2 d-flex align-items-center attachment_title_row" style="width: calc(100% - 5rem);" data-index="${ind}">
                      <span id="sp_attachment_image_icon" class="attach_icon me-2 ${isVideo ? 'hidden' : ''}">
                        <i class="oci oci-picture element-center"></i>
                      </span>
                      <span id="sp_attachment_video_icon" class="attach_icon me-2 ${isVideo ? '' : 'hidden'}">
                        <i class="oci oci-video element-center"></i>
                      </span>
                      <span class="" style="display: inline-grid" style="width: calc(100% - 2rem);">
                        <span class="file_attach_name text-ellipsis" title="${item.fileName}">${item.fileName}</span>
                        <span class="text-muted">${convert_file_Size(item.size)}</span>
                      </span>
                    </span>
                    <span class="on_hover">
                      <span class="attachement_download me-3" title="Download Attachement" style="cursor: pointer;" data-index="${ind}" tabindex="0">
                        <i class="oci oci-download-cloud font_18px"></i>
                      </span>                
                      <span class="attachement_delete" style="cursor: pointer;" title="Remove Attachement" data-index="${ind}" tabindex="0">
                        <i class="oci oci-trash-2 font_16px"></i>
                      </span>
                    </span>
                  </div>
                `;
              });             
            $("#attachment_grid_panel").show();
            $("#attachment_wrapper").html(html);

            $(".attachement_download").on('click', (e) => {
                debugger;
                let index = $(e.currentTarget).attr('data-index');
                let url = attachment_data_source[index].temporaryFilePath;
                var link = document.createElement('a');
                link.href = url;
                link.download = attachment_data_source[index].fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                if (document.URL.indexOf('callsource') > -1) {
                    let data = { action: "notifier", message: 'Attachment downloaded successfully', type: 'success' };
                    window.parent.postMessage(JSON.stringify(data), "*");
                }
                else {
                    serviceFactory.notifier($scope, 'Attachment downloaded successfully', 'success');
                }
            });

            $(".attachement_download").on('keydown', function (e) {
                if (e.keyCode == 13) {
                    e.currentTarget.click();
                }
            });

            $(".attachement_delete").on('click', (e) => {
                debugger;
                let index = $(e.currentTarget).attr('data-index');

                obj_attachment_type[attachment_data_source[index].Upload_type]--;

                attachment_data_source.splice(index, 1);

                if (attachment_data_source.length > 0) {
                    bind_attachment_grid();
                }
                else {
                    $("#attachment_grid_panel").hide();
                    $("#attachment_wrapper").html('');
                    bind_attachment_count();
                }
                store_data_in_local();
                if (document.URL.indexOf('callsource') > -1) {
                    let data = { action: "notifier", message: 'Attachment deleted successfully', type: 'success' };
                    window.parent.postMessage(JSON.stringify(data), "*");
                }
                else {
                    serviceFactory.notifier($scope, 'Attachment deleted successfully', 'success');
                }

            });

            $(".attachement_delete").on('keydown', function (e) {
                if (e.keyCode == 13) {
                    e.currentTarget.click();
                }
            });

            $('.attachment_title_row').on('dblclick', function (e) {
                let index = $(e.currentTarget).attr('data-index');
                let url = attachment_data_source[index].temporaryFilePath;
                open_preview_dialog(attachment_data_source[index]); //image preview function
            });
        }

        function bind_attachment_count() {

            for (let i in obj_attachment_type) {
                if (obj_attachment_type[i] > 0) {
                    $("#" + i + "_count").show();
                    $("#" + i + "_count").html(obj_attachment_type[i]);
                }
                else {
                    $("#" + i + "_count").hide();
                    $("#" + i + "_count").html(0);
                }
            }
        }

        function convert_file_Size(bytes, decimals = 1) {
            if (!+bytes) return '0 Bytes'

            const k = 1024
            const dm = decimals < 0 ? 0 : decimals
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];

            const i = Math.floor(Math.log(bytes) / Math.log(k))

            return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
        }

        function create_form_validate() {
            $(".issue_fields_error").hide();
            if ($("#issue_name_summary").val() == "" || $("#issue_name_summary").val() == null) {
                $("#issue_name_error").show();
                return false;
            }
            return true;
        }

        function create_guide_form_validate() {
            console.log($('#tree_node_dropdown').data('kendoDropDownList').value());
            $(".issue_fields_error").hide();
            if ($("#issue_name_summary_guide").val() == "" || $("#issue_name_summary_guide").val() == null) {
                const nameField = document.getElementById('issue_name_guide_error');
                nameField.style.display = 'block';
                $("#issue_name_guide_error").show();
                return false;
            }
            var workPlanSelect = $('#tree_node_dropdown').data('kendoDropDownList').value();
            if (workPlanSelect == "" || workPlanSelect == null) {
               
            } else {
                if ($("#group_guide_name").val() == "" || $("#group_guide_name").val() == null) {
                    const nameField = document.getElementById('group_guide_name_error');
                    nameField.style.display = 'block';
                    $("#group_guide_name_error").show();
                    return false;
                }
            }
            
            return true;
        }

        var created_artifact_data = [];

        function create_requirement_TestCase() {
            let validate_field = create_form_validate();
            if (!validate_field) {
                return false;
            }

            let Custom_field = { custom1: null, custom2: null, custom3: null, custom4: null };
            let dto_requirement = {
                Requirement_ID: empty_guid,
                RequirementName: $("#issue_name_summary").val(),
                Priority: $('#priority_List_dropdown').data('kendoDropDownList').value(),
                Assignee: $('#assignee_DDL').data('kendoDropDownList').value() == empty_guid ? [] : [$('#assignee_DDL').data('kendoDropDownList').value()] ,
                Reporter: $('#Reporter_list_DDL').data('kendoDropDownList').value() == empty_guid ? [] : [$('#Reporter_list_DDL').data('kendoDropDownList').value()],
                Description: $("#issue_description").data("kendoEditor").value(),
            //    Status: "Backlog",
                CustomFields: JSON.stringify(Custom_field),
                SprintID: $('#sprint_DDL').data('kendoDropDownList').value(),
            }
            loadingStart("#manual_create_issue_wrapper", "Please wait");
            $.ajax({
                url: opkey_url + "/Requirement/CreateNewRequirementAndLinkFlow",
                data: { "flowID": Selected_TestCase.DB_ID, parentID: empty_guid, strRequirementBinding: JSON.stringify(dto_requirement), str_files: JSON.stringify(attachment_data_source) },
                type: "Post",              
                success: function (res) {
                    debugger;
                    loadingStop("#manual_create_issue_wrapper");
                    localStorage.removeItem("capture_step_data");
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: issue_type + ' created successfully', type: 'success' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, issue_type + ' created successfully', 'success');
                    }
                    let obj = {
                        Name: $("#issue_name_summary").val(),
                        id: res,
                        type: 'Requirement'
                    }
                    created_artifact_data.push(obj);
                    linkArtifact(Selected_TestCase.DB_ID,res.id,res.type)
                    bind_created_artifact_notify_grid();
                    reset_form();
                    goBackToMainPage();
                },
                error: function (error) {
                    loadingStop("#manual_create_issue_wrapper");
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function linkArtifact(sourceArtifactID,destinationArtifactID,destinationModuleType){
            $.ajax({              
                url: opkey_url + "/QLM/LinkArtifact",
                data: {destinationArtifactID: destinationArtifactID, sourceArtifactID: sourceArtifactID, destinationModuleType:destinationModuleType  },
                type: "Post",
                success: function (res) {               
                    loadingStop("#manual_create_issue_wrapper");                
                },
                error: function (error) {
                    loadingStop("#manual_create_issue_wrapper");
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function create_requirement_project() {
            let validate_field = create_form_validate();
            if (!validate_field) {
                return false  ;
            }

            let Custom_field = { custom1: null, custom2: null, custom3: null, custom4: null };
            let dto_requirement = {
                Requirement_ID: empty_guid,
                RequirementName: $("#issue_name_summary").val(),
                Priority: $('#priority_List_dropdown').data('kendoDropDownList').value(),
                Assignee: $('#assignee_DDL').data('kendoDropDownList').value() == empty_guid ? [] : [$('#assignee_DDL').data('kendoDropDownList').value()],
                Reporter: $('#Reporter_list_DDL').data('kendoDropDownList').value() == empty_guid ? [] : [$('#Reporter_list_DDL').data('kendoDropDownList').value()],
                Description: $("#issue_description").data("kendoEditor").value(),
                //Status: "Backlog",
                CustomFields: JSON.stringify(Custom_field),
                SprintID: $('#sprint_DDL').data('kendoDropDownList').value(),
            }
            loadingStart("#manual_create_issue_wrapper", "Please wait");
            $.ajax({
                url: opkey_url + "/Requirement/CreateNewRequirementInProject",
                data: { "projectID": $rootScope.Scope_Main.Get_Opkey_URL("SELECTED_PROJECT_PID"), parentID: empty_guid, strRequirementBinding: JSON.stringify(dto_requirement), str_files: JSON.stringify(attachment_data_source) },
                type: "Post",
                success: function (res) {
                    debugger;
                    loadingStop("#manual_create_issue_wrapper");
                    localStorage.removeItem("capture_step_data");
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: issue_type + ' created successfully', type: 'success' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, issue_type + ' created successfully', 'success');
                    }
                    let obj = {
                        Name: $("#issue_name_summary").val(),
                        id: res,
                        type: 'Requirement'
                    }
                    created_artifact_data.push(obj);
                    bind_created_artifact_notify_grid();
                    reset_form();
                    goBackToMainPage();
                },
                error: function (error) {
                    loadingStop("#manual_create_issue_wrapper");
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function create_Ticket_project() {
            let validate_field = create_form_validate();
            if (!validate_field) {
                return false;
            }

            let dto_requirement = {
                TicketNumber: 1,
                Summary: $("#issue_name_summary").val(),
                TicketType: $('#TicketType_dropdown').data('kendoDropDownList').value(),
                Priority_Enum: $('#priority_List_dropdown').data('kendoDropDownList').value(),
                Assignee: $('#assignee_DDL').data('kendoDropDownList').value() == empty_guid ? [] : [$('#assignee_DDL').data('kendoDropDownList').value()],
                Reporter: [dataFactory.userDTO.U_ID],
                Description: $("#issue_description").data("kendoEditor").value(),
                State_Enum: null,
                SprintID: $('#sprint_DDL').data('kendoDropDownList').value(),
            }
            loadingStart("#manual_create_issue_wrapper", "Please wait");
            $.ajax({
                url: opkey_url + "/Tickets/CreateNewTicketInProject",
                data: { "projectID": $rootScope.Scope_Main.Get_Opkey_URL("SELECTED_PROJECT_PID"), parentID: empty_guid, strTicketBinding: JSON.stringify(dto_requirement), str_files: JSON.stringify(attachment_data_source) },
                type: "Post",
                success: function (res) {
                    debugger;
                    loadingStop("#manual_create_issue_wrapper");
                    localStorage.removeItem("capture_step_data");
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: issue_type + ' created successfully', type: 'success' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, issue_type + ' created successfully', 'success');
                    }
                    let obj = {
                        Name: $("#issue_name_summary").val(),
                        id: res,
                        type: 'Ticket'
                    }
                    created_artifact_data.push(obj);
                    bind_created_artifact_notify_grid();
                    reset_form();
                    goBackToMainPage();
                },
                error: function (error) {
                    loadingStop("#manual_create_issue_wrapper");
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function create_Guide_Recording() {
            let validate_field = create_guide_form_validate();
            if (!validate_field) {
                return false;
            }

            let dto_guide = {
                appType:$('#application_dropdown').data('kendoDropDownList').value().toUpperCase(),
                moduleName:$('#module_dropdown').data('kendoDropDownList').value(),
                parentFolderId: empty_guid,
                processName: $('#process_dropdown').data('kendoDropDownList').value() == "" ? 'None' : $('#process_dropdown').data('kendoDropDownList').value(),
                projectId: $rootScope.Scope_Main.Get_Opkey_URL("SELECTED_PROJECT_PID"),
                projectPlanID:$('#tree_node_dropdown').data('kendoDropDownList').value() == "" ? null : $('#tree_node_dropdown').data('kendoDropDownList').value() ,
                userGuideGroupName: $("#group_guide_name").val() == "" ? null : $("#group_guide_name").val(),
                userGuideName:$("#issue_name_summary_guide").val(),
                userId: dataFactory.userDTO.U_ID,
                userName: dataFactory.userDTO.UserName,
                journeySessionId:localStorage.getItem("obiq_journey_sessionId")
            }

            console.log(dto_guide);
            console.log(JSON.stringify(dto_guide));
            
            loadingStart("#manual_create_issue_wrapper", "Please wait");
            $.ajax({
                url: opkey_url + "/OpkeyObiqServerApi/OpkeyTraceIAAnalyticsApi/ObiqArtifactController/createUserGuideFromUserJourney",
                contentType: "application/json",
                data: JSON.stringify(dto_guide),
                type: "Post",
                success: function (res) {
                    debugger;
                    localStorage.removeItem("obiq_journey_sessionId")
                    loadingStop("#manual_create_issue_wrapper");
                    localStorage.removeItem("capture_step_data");
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: issue_type + ' created successfully', type: 'success' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, issue_type + ' created successfully', 'success');
                    }
                    let obj = {
                        Name: $("#issue_name_summary").val(),
                        id: res,
                        type: 'Recording Guide'
                    }
                    var url = opkey_url + '/opkeyone/obiq/guide/' + res.journeySessionId;
                    serviceFactory.Navigate_msgbox("Do you want to open User Guide?", "info", function(isNavigating) {
                        if (isNavigating) {                         
                            bind_created_artifact_notify_grid();
                            reset_form();
                            goBackToMainPage();
                            window.open(url, '_blank');
                        } else {
                            created_artifact_data.push(obj);
                            $scope.ChangePageView('options.Manual_project_selection');
                           // return;
                        }
                    });
                   

                },
                error: function (error) {
                    loadingStop("#manual_create_issue_wrapper");
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function create_Ticket_TestCase() {
            let validate_field = create_form_validate();
            if (!validate_field) {
                return false;
            }

            let dto_requirement = {
                TicketNumber: 1,
                Summary: $("#issue_name_summary").val(),
                TicketType: $('#TicketType_dropdown').data('kendoDropDownList').value(),
                Priority_Enum: $('#priority_List_dropdown').data('kendoDropDownList').value(),
                Assignee: $('#assignee_DDL').data('kendoDropDownList').value() == empty_guid ? [] : [$('#assignee_DDL').data('kendoDropDownList').value()],
                Reporter: [dataFactory.userDTO.U_ID],
                Description: $("#issue_description").data("kendoEditor").value(),
                State_Enum: null,
                SprintID: $('#sprint_DDL').data('kendoDropDownList').value(),
            }
            loadingStart("#manual_create_issue_wrapper", "Please wait");
            $.ajax({
                url: opkey_url + "/QLM/CreateNewTicketAndLinkWithArtifact",
                data: { parentID: empty_guid, strTicketBinding: JSON.stringify(dto_requirement),str_files: JSON.stringify(attachment_data_source), "ArtifactToLinkWith": Selected_TestCase.DB_ID},
                type: "Post",
                success: function (res) {
                    debugger;
                    loadingStop("#manual_create_issue_wrapper");
                    localStorage.removeItem("capture_step_data");
                    //create_notifier(issue_type + ' created successfully', 'success');
                    let obj = {
                        Name: $("#issue_name_summary").val(),
                        id: res,
                        type: 'Ticket'
                    }
                    created_artifact_data.push(obj);
                    bind_created_artifact_notify_grid();
                    reset_form();
                    goBackToMainPage();
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: issue_type + ' created successfully', type: 'success' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, issue_type + ' created successfully', 'success');
                    }
                },
                error: function (error) {
                    loadingStop("#manual_create_issue_wrapper");
                    serviceFactory.showError($scope, error);
                }
            });
        }


        function goBackToMainPage() {
            if (document.URL != null && document.URL.indexOf('callsource') > -1) {
                return;
            }
            let view = serviceFactory.getCallSourceInDataFactory([], "Manual_Create_view_data", "Create_View");
            $scope.ChangePageView(view.CallSource);
        }

        function create_ticket_manualStep() {
            let validate_field = create_form_validate();
            if (!validate_field) {
                return false;
            }

            let dto_requirement = {
                TicketNumber: 1,
                Summary: $("#issue_name_summary").val(),
                TicketType: $('#TicketType_dropdown').data('kendoDropDownList').value(),
                Priority_Enum: $('#priority_List_dropdown').data('kendoDropDownList').value(),
                Assignee: $('#assignee_DDL').data('kendoDropDownList').value() == empty_guid ? [] : [$('#assignee_DDL').data('kendoDropDownList').value()],
                Reporter: [dataFactory.userDTO.U_ID],
                Description: $("#issue_description").data("kendoEditor").value(),
                State_Enum: null,
                SprintID: $('#sprint_DDL').data('kendoDropDownList').value(),
            }
            loadingStart("#manual_create_issue_wrapper", "Please wait");
            $.ajax({
                url: opkey_url + "/Result/CreateTicketForManualStep",
                data: { SessionId: localStorage.getItem('SessionID'), resultID: Selected_TestCase.Result_ID, strTicketBinding: JSON.stringify(dto_requirement), str_files: JSON.stringify(attachment_data_source) },
                type: "Post",
                success: function (res) {
                    debugger;
                    loadingStop("#manual_create_issue_wrapper");
                    localStorage.removeItem("capture_step_data");
                    //create_notifier(issue_type + ' created successfully', 'success');
                    let obj = {
                        Name: $("#issue_name_summary").val(),
                        id: res,
                        type: 'Ticket'
                    }
                    created_artifact_data.push(obj);
                    bind_created_artifact_notify_grid();
                    reset_form();
                    goBackToMainPage();
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: issue_type + ' created successfully', type: 'success' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, issue_type + ' created successfully', 'success');
                    }
                },
                error: function (error) {
                    loadingStop("#manual_create_issue_wrapper");
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function create_requirement_ManualStep() {

            let validate_field = create_form_validate();
            if (!validate_field) {
                return false;
            }

            let Custom_field = { custom1: null, custom2: null, custom3: null, custom4: null };
            let dto_requirement = {
                Requirement_ID: empty_guid,
                RequirementName: $("#issue_name_summary").val(),
                Priority: $('#priority_List_dropdown').data('kendoDropDownList').value(),
                Assignee: $('#assignee_DDL').data('kendoDropDownList').value() == empty_guid ? [] : [$('#assignee_DDL').data('kendoDropDownList').value()],
                Reporter: $('#Reporter_list_DDL').data('kendoDropDownList').value() == empty_guid ? [] : [$('#Reporter_list_DDL').data('kendoDropDownList').value()],
                Description: $("#issue_description").data("kendoEditor").value(),
              //  Status: "Backlog",
                CustomFields: JSON.stringify(Custom_field),
                SprintID: $('#sprint_DDL').data('kendoDropDownList').value(),
            }
            loadingStart("#manual_create_issue_wrapper", "Please wait");
            $.ajax({
                url: opkey_url + "/Result/CreateUserStoryForManualStep",
                data: { SessionId: localStorage.getItem('SessionID'), resultID: Selected_TestCase.Result_ID, strRequirementBinding: JSON.stringify(dto_requirement), str_files: JSON.stringify(attachment_data_source) },
                type: "Post",
                success: function (res) {
                    debugger;
                    loadingStop("#manual_create_issue_wrapper");
                    localStorage.removeItem("capture_step_data");
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: issue_type + ' created successfully', type: 'success' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.notifier($scope, issue_type + ' created successfully', 'success');
                    }
                    let obj = {
                        Name: $("#issue_name_summary").val(),
                        id: res,
                        type: 'Requirement'
                    }
                    created_artifact_data.push(obj);
                    bind_created_artifact_notify_grid();
                    reset_form();
                    goBackToMainPage();
                },
                error: function (error) {
                    loadingStop("#manual_create_issue_wrapper");
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function reset_form() {
            $("#issue_name_summary").val('');
            // $('#TicketType_dropdown').data('kendoDropDownList').value("Defect");
            // $('#priority_List_dropdown').data('kendoDropDownList').value("Low"),
            setDropDownByText('#TicketType_dropdown', 'Defect');
            setDropDownByText('#priority_List_dropdown', 'Low');
            $('#sprint_DDL').data('kendoDropDownList').value(empty_guid);
            $('#assignee_DDL').data('kendoDropDownList').value(empty_guid);
            $('#Reporter_list_DDL').data('kendoDropDownList').value(empty_guid);
            $("#issue_description").data("kendoEditor").value('');
            attachment_data_source = [];
            $("#attachment_wrapper").html('');
            $("#attachment_grid_panel").hide();
            obj_attachment_type = { Attach: 0, Image: 0, Video: 0 };
            bind_attachment_count();
        }

        function setDropDownByText(dropdownId, targetText) {
            var dropdown = $(dropdownId).data('kendoDropDownList');
            var data = dropdown.dataSource.data();

            var item = data.find(obj =>
                obj.name === targetText ||
                obj.text === targetText ||
                obj.label === targetText
            );

            if (item) {
                dropdown.value(item[dropdown.options.dataValueField]);
            } else {
                console.warn(`${dropdownId}: '${targetText}' not found in dropdown data`);
            }
        }

        function bind_created_artifact_notify_grid() {
            if (created_artifact_data.length == 0) {
                $("#created_artifact_notify").html('');
                $("#created_artifact_notify").hide();
                return;
            }
            $("#created_artifact_notify").show();
            let html = "";

            html = html + '<div class="artifact_pan">';

            created_artifact_data.forEach(function (item, ind) {
                html = html + `<div class="artifact_row">
                                    <span class="open_artifact" data-id="${item.id}" data-type="${item.type}" tabindex="0">${item.Name}</span>
                                    <i class="oci oci-x delete_notify" title="Delete" data-index="${ind}" tabindex="0"></i>
                                </div>`;
            });

            html = html + '</div>';

            $("#created_artifact_notify").html(html);

            $(".open_artifact").on('click', function (e) {
                let id = $(e.currentTarget).attr('data-id');

                id= DOMPurify.sanitize(id);
                
                let type = $(e.currentTarget).attr('data-type');
                let issue = "userstory";
                if (type == "Ticket") {
                    issue = "ticket";
                }
                else if (type == "Requirement") {
                    issue = "userstory";
                }
                let url = opkey_url + "/opkeyone/pmo/" + issue + "/" + id;
                var link = document.createElement('a');
                link.href = url;
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });

            $(".delete_notify").on('click', function (e) {
                let index = $(e.currentTarget).attr('data-index');
                created_artifact_data.splice(index, 1);
                bind_created_artifact_notify_grid();
            });

            $(".open_artifact").on('keyup', function (e) {
                if (e.keyCode == 13) {
                    $(".open_artifact").click();
                }
            });

            $(".delete_notify").on('keyup', function (e) {
                if (e.keyCode == 13) {
                    $(".delete_notify").click();
                }
            });
        }


        function store_data_in_local() {
            let local_data = {
                GridRow: Selected_TestCase,
                GridID: "",
                type: issue_type,
                Issue_data: Get_issue_data(),
            }

            localStorage.setItem("capture_step_data", JSON.stringify(local_data));
        }

        var IsRecordingInProgress = false;

        var addon_time_out = null;

        function check_for_response() {
            chrome.runtime.sendMessage({
                GetVideoUploadStatus: "GetVideoUploadStatus"
            }, function (response) {

                // console.log("create response log",response);

                if (response == "COMPLETED") {
                    IsRecordingInProgress = false;
                    loadingStop("body", "");
                    clearTimeout(addon_time_out);
                    $("#snap_loader").hide();
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "Pin_docker" };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    check_for_Issue_attachment_success();
                    chrome.runtime.sendMessage({
                        ResetVideoUploadStatus: "ResetVideoUploadStatus"
                    }, function (response) { });
                }
                else if (response == "") {
                    IsRecordingInProgress = false;
                }
                else if (response.indexOf("UPLOADATTACHMENTEORROR_") > -1) {
                    IsRecordingInProgress = false;
                    loadingStop("body", "");
                    clearTimeout(addon_time_out);
                    $("#snap_loader").hide();
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "notifier", message: response.split("_")[1], type: 'error' };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    else {
                        serviceFactory.showError($scope, JSON.parse(response.split("_")[1]));
                    }
                    chrome.runtime.sendMessage({
                        ResetVideoUploadStatus: "ResetVideoUploadStatus"
                    }, function (response) { });
                }
                else if (response == "FETCHING") {
                    IsRecordingInProgress = false;
                    $("#snap_loader").hide();
                    if (document.URL.indexOf('callsource') > -1) {
                        let data = { action: "Pin_docker" };
                        window.parent.postMessage(JSON.stringify(data), "*");
                    }
                    loadingStart("body", "Please wait uploading data", "");
                    clearTimeout(addon_time_out);
                    setTimeout(function () {
                        check_for_response();
                    }, 800)
                }
                else if (response == "INCOMPLETE") {
                    loadingStop("body", "");
                    IsRecordingInProgress = false;
                    clearTimeout(addon_time_out);
                    clearTimeout(time_out_snap);
                    $("#snap_loader").hide();
                    chrome.runtime.sendMessage({
                        ResetVideoUploadStatus: "ResetVideoUploadStatus"
                    }, function (response) { });
                }
                else if (response == "STARTINGCAPTURING") {
                    IsRecordingInProgress = false;
                    clearTimeout(addon_time_out);
                    setTimeout(function () {
                        check_for_response();
                    }, 800)
                }
                else {
                    IsRecordingInProgress = true;
                    clearTimeout(addon_time_out);
                    addon_time_out = setTimeout(function () {
                        check_for_response();
                    }, 800);
                }
            });
        }

        function get_inprogress_Recordinf_type() {
            let utility = localStorage.getItem("AppUtilityType");
            if (utility != null) {
                if (utility == "snapshot" || utility == "qlm_snapshot" || utility == "qlm_snapshot_IssueType") {
                    return "Snapshot";
                }
                else {
                    return "Video";
                }
            }
        }

        function listen_broadcast_message() {

            window.parent.addEventListener(
                "message",
                (e) => {
                    // Do we trust the sender of this message?  (might be
                    // different from what we originally opened, for example).
                    //if (event.origin !== "http://example.com") return;
                    if (e.origin !== window.parent.origin) return;

                    let event_data = JSON.parse(e.data);
                    if (event_data.persist) {

                        $.msgBox({
                            title: "Opkey",
                            content: "There is some unsaved data. Do you want to discard?",
                            modal: true,
                            type: "confirm",
                            buttons: [{ value: "Yes" }, { value: "No" }],
                            success: function (result) {
                                if (result === "Yes") {
                                    let data = { success: result, type: event_data.type };
                                    window.parent.postMessage(JSON.stringify(data), "*");
                                }
                            }

                        });

                    }

                },
                false
            );

            $(document).on('click', function (e) {
                let data = { action: "Pin_docker" };
                window.parent.postMessage(JSON.stringify(data), "*");
            });


            Mousetrap.bind(['esc'], function (e) {
                let data = { action: "Discard_docker" };
                window.parent.postMessage(JSON.stringify(data), "*");
                return false;
            });

            $("#discard_docker_form").on('click', function (e) {
                let data = { action: "Discard_docker" };
                window.parent.postMessage(JSON.stringify(data), "*");
            });

            document.addEventListener("visibilitychange", function () {
                if (document.visibilityState === 'visible') {
                    //console.log('has focus');
                    update_form();
                } else {
                    //console.log('lost focus');
                }
            });
        }

        function open_preview_dialog(dataItem) {
            debugger;
            let preview_attachment_type = ['.png', '.jpge', '.jpg', '.webm', '.mp4', '.wav'];

            let image_attachment_type = ['.png', '.jpge', '.jpg'];
            let video_attachment_type = ['.webm', '.mp4', '.wav'];

            let title = "Preview";

            if (image_attachment_type.indexOf(dataItem.extension) > -1) {
                title = "Image preview";
            }
            else if (video_attachment_type.indexOf(dataItem.extension) > -1) {
                title = "Video preview";
            }

            if (preview_attachment_type.indexOf(dataItem.extension) == -1) {
                if (document.URL.indexOf('callsource') > -1) {
                    let data = { action: "notifier", message: dataItem.extension + ' preview not available', type: 'error' };
                    window.parent.postMessage(JSON.stringify(data), "*");
                }
                else {
                    serviceFactory.notifier($scope, dataItem.extension + ' preview not available', 'error');
                }
                return false;
            }

            let obj = { Selected_Attachment: dataItem };
            serviceFactory.SetCallSourceInDataFactory(obj, "Manual_Create_Attachment_data");

            $scope.Modal_Instance_open_preview_dialog = $kWindow.open({
                options: {


                    width: "445px",
                    height: "253px",
                    resizable: false,
                    draggable: false,
                    closeOnEscape: true,
                    modal: true,
                    close: function () { },
                    open: function () {
                        debugger;
                    },
                    visible: false,
                    title: title,

                },
                templateUrl: 'views/Manual_view/Preview_modal.html',
                controller: 'preview_modal_ctrl'
            });


        }

        function update_form() {

            let curd_data = localStorage.getItem("capture_step_data");
            if (curd_data == null) {
                return;
            }

            curd_data = JSON.parse(curd_data);
            let form_data = curd_data.Issue_data;

            $("#issue_name_summary").val(form_data.Summary);
            $('#TicketType_dropdown').data('kendoDropDownList').value(form_data.TicketType);
            $('#priority_List_dropdown').data('kendoDropDownList').value(form_data.Priority),
                $('#sprint_DDL').data('kendoDropDownList').value(form_data.Sprint);
            $('#assignee_DDL').data('kendoDropDownList').value(form_data.assignee_ID);
            $('#Reporter_list_DDL').data('kendoDropDownList').value(form_data.reporter_ID);
            $("#issue_description").data("kendoEditor").value(form_data.Description);
            attachment_data_source = form_data.Attachments;
            obj_attachment_type = form_data.obj_attachment_type;
            bind_attachment_grid();

        }

        function get_step_attachments() {
            loadingStart("#manual_create_issue_wrapper", "Please wait");
            $.ajax({
                url: opkey_url + "/Result/GetActualResultAttachmentofManualStep",
                data: { SessionId: localStorage.getItem('SessionID'), resultID: Selected_TestCase.Result_ID },
                type: "get",
                success: function (res) {
                    debugger;
                    console.log("GetActualResultAttachmentofManualStep", res);
                    if (res != null) {
                        obj_attachment_type.Attach = 1;
                        attachment_data_source = [res];
                        bind_attachment_grid();
                    }


                },
                error: function (error) {
                    loadingStop("#manual_create_issue_wrapper");
                    serviceFactory.showError($scope, error);
                }
            });
        }


    }]);




