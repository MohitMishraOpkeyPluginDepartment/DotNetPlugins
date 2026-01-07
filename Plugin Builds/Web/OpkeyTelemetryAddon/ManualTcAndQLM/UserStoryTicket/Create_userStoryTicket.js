function load_Create_form(type) {
    debugger;
    $(function () {
        issue_type = type;
        opkey_url = localStorage.getItem("Domain");
        bind_form();
        let Curd_dataSource_str = localStorage.getItem("Curd_dataSource");

        if (Curd_dataSource_str != null) {
            let Curd_dataSource_obj = JSON.parse(Curd_dataSource_str);
            if (Curd_dataSource_obj.User.loaded) {
                $('#assignee_DDL').data('kendoDropDownList').dataSource.data(Curd_dataSource_obj.User.data);
                $('#reporter_DDL').data('kendoDropDownList').dataSource.data(Curd_dataSource_obj.User.data);

                $('#assignee_DDL').data('kendoDropDownList').value(unAssignee);
                $('#reporter_DDL').data('kendoDropDownList').value(unAssignee);
            }
            else {
                get_current_users();
            }

            if (Curd_dataSource_obj.Priority.loaded) {
                $('#priority_DDL').data('kendoDropDownList').dataSource.data(Curd_dataSource_obj.Priority.data);

                $('#priority_DDL').data('kendoDropDownList').value(Curd_dataSource_obj.Priority.data[0]);
            }
            else {
                get_current_users();
            }

            if (Curd_dataSource_obj.Sprint.loaded) {
                $('#sprint_DDL').data('kendoDropDownList').dataSource.data(Curd_dataSource_obj.Sprint.data);

                $('#sprint_DDL').data('kendoDropDownList').value(Curd_dataSource_obj.Sprint.data[0]);
            }
            else {
                get_current_users();
            }
        }
        else {
            get_current_users();
            get_ticket_priority();
            get_sprints();
        }
    });

}

var opkey_url = "";

var issue_type = null;

var Curd_dataSource = { User: { data: [], loaded: false }, Priority: { data: [], loaded: false }, Sprint: { data: [], loaded: false } }

var empty_guid = "00000000-0000-0000-0000-000000000000"

var unAssignee = { U_ID: empty_guid, email_ID: "Unassigned" };

function bind_form() {

    $("#current_project_name").val(Current_cookie_DTO.ProjectDTO.Name);

    $('#issueType_DDL').kendoDropDownList({
        dataSource: ["User Story", "Ticket"],
        select: function (e) {
            debugger;

        }

    });

    $("#issueType_DDL").data("kendoDropDownList").value(issue_type);

    $('#reporter_DDL').kendoDropDownList({
        dataSource: [],
        dataTextField: "email_ID",
        dataValueField: "U_ID",
        valueTemplate: function (e) {
            if (e == "") {
                return "<span class='unAssignee_user'><i class='oci oci-user'></i><span>Unassigned</span></span>";
            }
            let html = "";
            if (e.U_ID == empty_guid) {
                html = html + "<span class='unAssignee_user'><i class='oci oci-user'></i><span>" + e.email_ID + "</span></span>";
            }
            else {
                html = html + "<span class'd-block'><span class='items-template'><span class='item-img'><img class='img_avatar_profile' src='" + opkey_url + "/user/getavatar/" + e.U_ID + "'></span></span>";
                html = html + "<span class='d-block ps-2 line_h_normal' style='width: calc(100% - 1.3rem);'><span class='value-template-text align-middle text-ellipsis font_14px'>" + e.Name + "</span></span></span>";
            }
            return html;
        },
        template: function (e) {
            if (e == "") {
                return "<span class='unAssignee_user'><i class='oci oci-user'></i><span>Unassigned</span></span>";
            }
            let html = "";
            if (e.U_ID == empty_guid) {
                html = html + "<span class='unAssignee_user'><i class='oci oci-user'></i><span>" + e.email_ID + "</span></span>";
            }
            else {
                html = html + "<span class='items-template'><span class='item-img'><img class='img_avatar_profile' src='" + opkey_url + "/user/getavatar/" + e.U_ID + "'></span>";
                html = html + "<span class='d-block ps-2 line_h_normal' style='width: calc(100% - 1.3rem);'><span class='value-template-text align-middle text-ellipsis font_14px'>" + e.Name + "</span></span></span>";
                html = html + "<span class='d-block ps-2'><span class='value-template-text align-middle text-ellipsis font_14px'>" + e.email_ID + "</span></span>";
            }
            return html;
        },
        select: function (e) {
            debugger;

        }

    });

    $('#assignee_DDL').kendoDropDownList({
        dataSource: [],
        dataTextField: "email_ID",
        dataValueField: "U_ID",
        valueTemplate: function (e) {
            debugger;
            if (e == "") {
                return "<span class='unAssignee_user'><i class='oci oci-user'></i><span>Unassigned</span></span>";
            }
            let html = "";
            if (e.U_ID == empty_guid) {
                html = html + "<span class='unAssignee_user'><i class='oci oci-user'></i><span>" + e.email_ID + "</span></span>";
            }
            else {
                html = html + "<span class='items-template'><span class='item-img'><img class='img_avatar_profile' src='" + opkey_url + "/user/getavatar/" + e.U_ID + "'></span>";
                html = html + "<span class='d-block ps-2 line_h_normal' style='width: calc(100% - 1.3rem);'><span class='value-template-text align-middle text-ellipsis font_14px'>" + e.Name + "</span></span></span>";
            }
            return html;
        },
        template: function (e) {
            if (e == "") {
                return "<span class='unAssignee_user'><i class='oci oci-user'></i><span>Unassigned</span></span>";
            }
            let html = "";
            if (e.U_ID == empty_guid) {
                html = html + "<span class='unAssignee_user'><i class='oci oci-user'></i><span>" + e.email_ID + "</span></span>";
            }
            else {
                html = html + "<span class='items-template'><span class='item-img'><img class='img_avatar_profile' src='" + opkey_url + "/user/getavatar/" + e.U_ID + "'></span>";
                html = html + "<span class='d-block ps-2 line_h_normal' style='width: calc(100% - 1.3rem);'><span class='value-template-text align-middle text-ellipsis font_14px'>" + e.Name + "</span></span></span>";
                html = html + "<span class='d-block ps-2'><span class='value-template-text align-middle text-ellipsis font_14px'>" + e.email_ID + "</span></span>";
            }
            return html;
        },
        select: function (e) {
            debugger;

        }

    });

    $('#priority_DDL').kendoDropDownList({
        dataSource: [],
        valueTemplate: function (e) {
            let html = "<span><i class='oci oci-" + e + "'></i><span>" + e + "</span></span>";

            return html;
        },
        template: function (e) {
            let html = "<span><i class='oci oci-" + e + "'></i><span>" + e + "</span></span>";
            return html;
        },
        select: function (e) {
            debugger;

        }

    });

    $('#sprint_DDL').kendoDropDownList({
        dataSource: [],
        dataTextField: "ArtifactName",
        dataValueField: "ArtifactId",
        valueTemplate: function (e) {
            let html = "<span>" + e.ArtifactName + "</span>";
            return html;
        },
        template: function (e) {
            let html = "<span>" + e.ArtifactName + "</span>";
            return html;
        },
        select: function (e) {
            debugger;

        }

    });

    // $("#issue_description").kendoEditor();
    // let description_editor = $("#issue_description").data("kendoEditor");

    $("#cancel_create_form").on('click', function (e) {
        $('#ManualExecutionModel_div').removeClass('hidden');
        $('#create_form_userStory_ticket_wrapper').html('');
    });

    $("#create_issue").on('click', function (e) {
        debugger;
    });

    $("#add_attachment_create").on('click', function (e) {
        debugger;
    });

    $("#add_capture_image_create").on('click', function (e) {
        debugger;
    });

    $("#add_capture_video_create").on('click', function (e) {
        debugger;
    });

}

function get_current_users() {
    $.ajax({
        url: opkey_url + "/Base/getAllEnabledUsersForProject",
        data: {P_ID:Current_cookie_DTO?.ProjectDTO?.P_ID},
        type: "get",
        success: function (res) {
            debugger;
            res.unshift(unAssignee);

            Curd_dataSource.User.data = res;
            Curd_dataSource.User.loaded = true;

            localStorage.setItem("Curd_dataSource", JSON.stringify(Curd_dataSource));

            $('#assignee_DDL').data('kendoDropDownList').dataSource.data(res);
            $('#reporter_DDL').data('kendoDropDownList').dataSource.data(res);

            $('#assignee_DDL').data('kendoDropDownList').value(unAssignee);
            $('#reporter_DDL').data('kendoDropDownList').value(unAssignee);

        },
        error: function (error) {
            showError(error);
        }
    });
}

function get_ticket_priority() {
    $.ajax({
        url: opkey_url + "/Tickets/GetPriority",
        data: {},
        type: "get",
        success: function (res) {
            debugger;

            Curd_dataSource.Priority.data = res;
            Curd_dataSource.Priority.loaded = true;

            localStorage.setItem("Curd_dataSource", JSON.stringify(Curd_dataSource));

            $('#priority_DDL').data('kendoDropDownList').dataSource.data(res);

            $('#priority_DDL').data('kendoDropDownList').value(res[0]);
        },
        error: function (error) {
            showError(error);
        }
    });
}


function get_sprints() {
    $.ajax({
        url: opkey_url + "/Sprint/GetAllSprints",
        data: {},
        type: "get",
        success: function (res) {
            debugger;

            Curd_dataSource.Sprint.data = res;
            Curd_dataSource.Sprint.loaded = true;

            localStorage.setItem("Curd_dataSource", JSON.stringify(Curd_dataSource));

            $('#sprint_DDL').data('kendoDropDownList').dataSource.data(res);

            $('#sprint_DDL').data('kendoDropDownList').value(res[0]);
        },
        error: function (error) {
            showError(error);
        }
    });
}