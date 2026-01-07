var Saas = function () {
    this.domainName = "http://localhost:58039";
    this.IsRedirectionAlreadyCalled = false;
    this.current_Tree_ID = null;
    this.current_selected_node = null;
    this.flowchart_tab_id = -1;
    this.flowchart_tab_called = false;
    this.EmptyGuid = "00000000-0000-0000-0000-000000000000";
    this.empty = "";
};


// ------------- global functions -------

var saas_object = new Saas();
saas_object.testCase_Tree_ID = "testCaseSelectionTree";
saas_object.OR_Tree_ID = "ORSelectionTree";
var DEFAULT_OPKEY_LOCATION_ID = "47d772f3-e08f-4874-9585-a2bdb34eee04";
Saas.prototype.SetGlobalSetting = function (setting_key, setting_value) {
    localStorage.setItem(setting_key, setting_value);
};

Saas.prototype.GetGlobalSetting = function (setting_key) {
    return localStorage.getItem(setting_key);
};


Saas.prototype.ShowErrorWithHtmlRendered = function (message) {
    swal({
        title: "OpKey Error",
        text: message,
        type: "error",
        html: true,
        customClass: 'swal-BIG',
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ok",
        closeOnConfirm: true,
    }, function (isConfirm) {
    });
};

Saas.prototype.ShowError = function (message) {
    //////debugger;
    if (message.length > 200) {
        message = message.substring(0, 199);
    }
    swal({
        title: "OpKey Error",
        text: message,
        type: "error",
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ok",
        closeOnConfirm: true,
    }, function (isConfirm) {
    });
};




Saas.prototype.Init = function () {
    $(document)
        .ready(
            function () {

                return false;

                $("#NewOrRecordName").on('keydown', function (e) {
                    if (e.key == '\\') {
                        e.preventDefault();
                    }
                });

                jQuery.migrateMute = true;
                saas_object.CheckLoginStatusRecursively();
                saas_object.CheckLoginStatusOnClick();
                saas_object.CheckUserAndProjectSessionState(true);
                saas_object.getPlatformDetails();
                var body_node = document.getElementsByTagName("BODY")[0];
                var page_type = body_node
                    .getAttribute("op-addon-pagetype");
                var project_name = saas_object
                    .GetGlobalSetting("OPKEY_PROJECT_NAME");

                if (page_type == "RecorderPage") {
                    saas_object.MaintainSession();
                    if (saas_object.flowchart_tab_called == false) {
                        saas_object.OpenFlowChartView();
                        saas_object.flowchart_tab_called = true;
                    }

                    chrome.runtime.sendMessage({
                        setRecordingMode: "NORMAL"
                    }, function (response) {
                        if (chrome.runtime.lastError) { }
                    });
                }

                if (page_type == "RunTestSelectionPage") {
                    saas_object.loadTestCaseSelectionTree();
                }

                $("#SelectNewOrRecord")
                    .click(
                        function (e) {
                            $("#goForRecordings")
                                .html(
                                    "<i class='fa fa-video-camera'></i>&nbsp; Start Recording");
                        });

                $("#SelectExistingOrRecord").click(function (e) {
                    $("#goForRecordings").html("Next");
                });

                //$("#goForRecordings")
                //    .click(
                //        function (e) {

                //            if ($("#SelectNewOrRecord").is(
                //                ":checked")) {
                //                var artificate_value = $(
                //                    "#NewOrRecordName")
                //                    .val();
                //                artificate_value = artificate_value
                //                    .trim();
                //                if (artificate_value == "") {
                //                    saas_object
                //                        .ShowToastMessage(
                //                            "error",
                //                            "Artifact name cannot be blank.");
                //                    saas_object
                //                        .ResetArtificateTextField();
                //                    return;
                //                }
                //                var app_url = $(
                //                    "#ApplicationURL")
                //                    .val();
                //                saas_object.SetGlobalSetting(
                //                    "APPLICATION_URL",
                //                    app_url);
                //                saas_object
                //                    .CreateArtificate_ORInProject();
                //            }

                //            if ($("#SelectExistingOrRecord")
                //                .is(":checked")) {
                //                var project_pid = saas_object
                //                    .GetGlobalSetting("SELECTED_PROJECT_PID");
                //                saas_object.SetGlobalSetting(
                //                    "APPLICATION_URL", "");
                //                saas_object
                //                    .SelectProject(project_pid);
                //            }
                //        });

                if (page_type == "LoginPage") {
                    debugger;


                    //$("#forgotPasswordButton").click(function (e) {
                    //    saas_object.OpenForgotPasswordPage();
                    //});

                    //$("#signupButton").click(function (e) {
                    //    saas_object.OpenSignUpPage();
                    //});

                    //$("#urlAddress").prop("disabled", true);
                    //$("#userName").prop("disabled", true);
                    //$("#password").prop("disabled", true);
                    //$("#loginButton").prop("disabled", true);
                    //saas_object.CheckUserAndProjectSessionState(true);
                    //var domain_name = saas_object
                    //    .GetGlobalSetting("OPKEY_DOMAIN_NAME");
                    //var user_name = saas_object
                    //    .GetGlobalSetting("OPKEY_USER_NAME");
                    //if (domain_name != null) {
                    //    $("#urlAddress").val(domain_name);
                    //}

                    //if (user_name != null) {
                    //    $("#userName").val(user_name);
                    //}

                    //$("#urlAddress")
                    //    .keyup(
                    //        function (e) {
                    //            var url_domain = $(this).val();
                    //            //url_domain = url_domain.replace("http://", "https://");
                    //            saas_object.SetGlobalSetting(
                    //                "OPKEY_DOMAIN_NAME",
                    //                url_domain);
                    //            saas_object
                    //                .CheckIsDomainHasHTTPS(url_domain);
                    //        });

                    //$("#userName").keyup(
                    //    function (e) {
                    //        saas_object.SetGlobalSetting(
                    //            "OPKEY_USER_NAME", $(this)
                    //                .val());
                    //    });
                    ///* [ Focus input ]*/
                    //$('.login_mid .form-control').each(function () {
                    //    if ($(this).val() !== "") {
                    //        $(this).addClass('has-val');
                    //    } else {
                    //        $(this).removeClass('has-val');
                    //        $(this).focus(function () {
                    //            $(this).addClass('has-val');
                    //        });
                    //        $(this).on('blur', function () {
                    //            if ($(this).val() !== "") {
                    //                $(this).addClass('has-val');
                    //            } else {
                    //                $(this).removeClass('has-val');
                    //            }
                    //        });
                    //    }
                    //});

                } else if (page_type == "ProjectSelectionPage") {
                    var app_url = saas_object
                        .GetGlobalSetting("APPLICATION_URL");
                    if (app_url != null) {
                        if (app_url.trim() != "") {
                            $("#ApplicationURL").val(app_url);
                        }
                    }

                    saas_object.CheckLoginStatus_Simple();
                    saas_object.CheckUserAndProjectSessionState(false);
                    //	saas_object.RenderAllProjectsForCurrentUser();
                    //saas_object.RenderAllProjectsForCurrentUser_New();

                    if (window.location.toString().indexOf(
                        "showContinueAlert") > -1) {
                        swal(
                            {
                                title: "Confirmation Required",
                                text: "Do you want to continue using Addon?",
                                showCancelButton: true,
                                confirmButtonClass: "btn-success",
                                confirmButtonText: "Yes",
                                cancelButtonText: "No",
                                closeOnConfirm: true,
                                closeOnCancel: true
                            }, function (isConfirm) {
                                if (!isConfirm) {
                                    chrome.tabs
                                        .getCurrent(function (
                                            tab) {
                                            chrome.tabs.remove(
                                                tab.id,
                                                function () {
                                                });
                                        });
                                }
                            });
                    }

                    $('#selectProjectList').select2({
                        placeholder: 'Select Project...',
                    });

                    $("#selectProjectList").on(
                        "select2:open",
                        function () {
                            $(".select2-search__field").attr(
                                "placeholder",
                                "Search for Project...");
                        });
                    $("#selectProjectList").on(
                        "select2:close",
                        function () {
                            $(".select2-search__field").attr(
                                "placeholder", null);
                        });

                    function setRecordList(node) {
                        //////debugger
                        if (!node.id) {
                            return node.text;
                        }
                        var $node = $('<span><i class="sprite2 '
                            + node.element.dataset.icon + '"></i> '
                            + node.text + '</span>');
                        return $node;
                    }
                    ;

                    $('[data-bs-toggle="popover"]').popover();

                    $('#NewOrRecordList').select2({
                        //placeholder: "What currency do you use?", //placeholder
                        minimumResultsForSearch: Infinity,
                        templateResult: setRecordList,
                        templateSelection: setRecordList
                    });

                    $("#projectSearchArea").keyup(function (e) {
                        saas_object.FilterProjectsName();
                    });

                    $("#ProjectSearchButton").click(function (e) {
                        saas_object.FilterProjectsName();
                    });

                } else if (page_type == "TestCaseSelectionPage") {

                    //saas_object.CheckLoginStatus_Simple();
                    //if (project_name == null) {
                    //    saas_object
                    //        .OpenProjectSelectionPageExcludingProjectSelectionCheck();
                    //}
                    //if (project_name == "") {
                    //    saas_object
                    //        .OpenProjectSelectionPageExcludingProjectSelectionCheck();
                    //}
                    //$("#liProjectName").attr('title', project_name); //Tooltip should be according to selected project
                    //if (project_name.length > 10) {
                    //    project_name = project_name.substring(0, 10)
                    //        + "...";
                    //}
                    //$("#projectNameText").text(project_name);
                    //saas_object.current_Tree_ID = "testCaseSelectionTree";
                    //saas_object
                    //    .InitializeJsTree("testCaseSelectionTree");
                    //$("#testCaseSelectionTree")
                    //    .click(
                    //        function (e) {

                    //            var artificate_node = saas_object
                    //                .GetSelectedNode("testCaseSelectionTree");
                    //            saas_object
                    //                .SetGlobalSetting(
                    //                    "SELECTED_NODE_OF_TREE_TC",
                    //                    JSON
                    //                        .stringify(artificate_node));
                    //            if (artificate_node[0]) {
                    //                var artificate_type = artificate_node[0].type;

                    //                var isRestricted = artificate_node[0].original.isRestricted;

                    //                if (artificate_type == "Flow"
                    //                    && !isRestricted) {
                    //                    $("#selectTestCase")
                    //                        .prop(
                    //                            "disabled",
                    //                            false);
                    //                } else if (artificate_type == "Component"
                    //                    && !isRestricted) {
                    //                    $("#selectTestCase")
                    //                        .prop(
                    //                            "disabled",
                    //                            false);
                    //                } else {
                    //                    $("#selectTestCase")
                    //                        .prop(
                    //                            "disabled",
                    //                            true);
                    //                }
                    //            }
                    //        });

                    //$('#testCaseSearchArea').bind(
                    //    'keyup',
                    //    function (e) {
                    //        var searchValue = $(
                    //            '#testCaseSearchArea').val();
                    //        if (searchValue.length < 4
                    //            && searchValue != "") {
                    //            return;
                    //        }
                    //        $("#testCaseSelectionTree")
                    //            .jstree(true).search(
                    //                searchValue);
                    //    });

                    //$('#testCaseSearchButton').bind(
                    //    'click',
                    //    function (e) {
                    //        var searchValue = $(
                    //            '#testCaseSearchArea').val();
                    //        $("#testCaseSelectionTree")
                    //            .jstree(true).search(
                    //                searchValue);
                    //    });

                    //saas_object.ProcessAllTestCaseTreeData();

                    //$("#RefreshTCTree").click(function (e) {
                    //    saas_object.ProcessAllTestCaseTreeData();
                    //});

                    //$("#selectTestCase")
                    //    .click(
                    //        function (e) {
                    //            var artificate_node = saas_object
                    //                .GetSelectedNode("testCaseSelectionTree");
                    //            var artificate_id = artificate_node[0].id;
                    //            var artificate_type = artificate_node[0].original.type;
                    //            saas_object.AcquireTCLock(
                    //                artificate_id,
                    //                artificate_type);
                    //        });
                } else if (page_type == "ORSelectionPage") {
                    //saas_object.CheckLoginStatus_Simple();
                    //$("#liProjectName").attr('title', project_name); //Tooltip should be according to selected project
                    //if (project_name.length > 10) {
                    //    project_name = project_name.substring(0, 10)
                    //        + "...";
                    //}
                    //$("#projectNameText").text(project_name);
                    //saas_object.current_Tree_ID = "ORSelectionTree";
                    //saas_object.InitializeJsTree("ORSelectionTree");
                    //saas_object.ProcessAllObjectRepositoryTreeData();

                    //$("#ORSelectionTree")
                    //    .click(
                    //        function (e) {
                    //            var artificate_node = saas_object
                    //                .GetSelectedNode("ORSelectionTree");
                    //            saas_object
                    //                .SetGlobalSetting(
                    //                    "SELECTED_NODE_OF_TREE_OR",
                    //                    JSON
                    //                        .stringify(artificate_node));
                    //            if (artificate_node[0]) {
                    //                var artificate_type = artificate_node[0].type;
                    //                if (artificate_type == "ObjectRepository") {
                    //                    $("#startRecording")
                    //                        .prop(
                    //                            "disabled",
                    //                            false);
                    //                } else {
                    //                    $("#startRecording")
                    //                        .prop(
                    //                            "disabled",
                    //                            true);
                    //                }
                    //            }
                    //        });

                    //$('#ORSearchArea').bind(
                    //    'keyup',
                    //    function (e) {
                    //        var searchValue = $('#ORSearchArea')
                    //            .val();
                    //        if (searchValue.length < 4
                    //            && searchValue != "") {
                    //            return;
                    //        }
                    //        $("#ORSelectionTree").jstree(true)
                    //            .search(searchValue);
                    //    });

                    //$('#ORSearchButton').bind(
                    //    'click',
                    //    function (e) {
                    //        var searchValue = $('#ORSearchArea')
                    //            .val();
                    //        $("#ORSelectionTree").jstree(true)
                    //            .search(searchValue);
                    //    });

                    //$("#RefreshOrTree")
                    //    .click(
                    //        function (e) {
                    //            saas_object
                    //                .ProcessAllObjectRepositoryTreeData();
                    //        });
                    //$("#startRecording")
                    //    .click(
                    //        function (e) {
                    //            var or_node = saas_object
                    //                .GetSelectedNode("ORSelectionTree");
                    //            var or_id = or_node[0].id;
                    //            saas_object
                    //                .AcquireORLock(or_id);
                    //        });
                }
                $("#backButton")
                    .click(
                        function (e) {
                            if (page_type == "ORSelectionPage") {
                                var artificate_id = saas_object
                                    .GetGlobalSetting("RECORDER_FLOW_DB_ID");
                                if (artificate_id != null) {
                                    saas_object
                                        .ReleaseLock(artificate_id);
                                }
                                saas_object.UnBlockUI();
                                saas_object
                                    .OpenTestCaseSelectionPage();
                            } else if (page_type == "TestCaseSelectionPage") {
                                saas_object.UnBlockUI();
                                saas_object
                                    .OpenProjectSelectionPageExcludingProjectSelectionCheck();
                            } else if (page_type == "Main") {
                                saas_object.UnBlockUI();
                                saas_object
                                    .OpenObjectRepositorySelectionPage();

                            }
                        });

                $("#userInfoButton").click(function (e) {
                    saas_object.GetOpKeyUserInfo();
                });

                $("#password").keypress(function (event) {
                    var x = event.which || event.keyCode;
                    if (x == 13) {
                        $("#loginButton").click();
                    }
                });

                // $("#loginButton").click(
                //     function (e) {
                //         var user_name = $("#userName").val();
                //         var pass_word = $("#password").val();
                //         var url_domain = $("#urlAddress").val();
                //         // url_domain = url_domain.replace("http://", "https://");
                //         saas_object.SetGlobalSetting(
                //             "OPKEY_DOMAIN_NAME", url_domain);
                //         saas_object.SetGlobalSetting(
                //             "OPKEY_USER_NAME", $("#userName")
                //                 .val());
                //         saas_object.SetGlobalSetting(
                //             "SELECTED_PROJECT_PID", "");
                //         saas_object.LoginInSaas(user_name,
                //             pass_word, false);
                //     });

                $("#logoutbutton").click(function (e) {
                    saas_object.LogOut();
                });

                $("#projectSelectionButton")
                    .click(
                        function (e) {
                            saas_object.UnBlockUI();
                            saas_object.projectSelectionWin();
                        });

                $("#createFlButton").click(
                    function (e) {
                        saas_object.AddFileInTree(
                            saas_object.current_selected_node,
                            "Component");
                    });

                $("#createTCButton").click(
                    function (e) {
                        saas_object.AddFileInTree(
                            saas_object.current_selected_node,
                            "Flow");
                    });

                $("#artificateholder_or").click(
                    function (e) {
                        $(e.target).prop("disabled", true);
                        saas_object.AddFileInTree(
                            saas_object.current_selected_node,
                            "ObjectRepository");
                        window.setTimeout(function () {
                            $(e.target).prop("disabled", false);
                        }, 800);
                    });

                $(".createFolderButton")
                    .click(
                        function (e) {
                            debugger;
                            $(e.target).prop("disabled", true);
                            var name = this.name;
                            var selectedNode = null;
                            if (name == "TCCreateBtn") {
                                saas_object.current_Tree_ID = saas_object.testCase_Tree_ID;
                                selectedNode = saas_object.getSelectedNode(saas_object.testCase_Tree_ID);
                            } else {
                                saas_object.current_Tree_ID = saas_object.OR_Tree_ID;
                                selectedNode = saas_object.getSelectedNode(saas_object.OR_Tree_ID);
                            }
                            saas_object.AddFolderInTree(selectedNode, saas_object.current_Tree_ID);
                            window.setTimeout(function () {
                                $(e.target).prop("disabled",
                                    false);
                            }, 800);
                        });

                $(".deleteArtificateButton")
                    .click(
                        function (e) {
                            var name = this.name;
                            var selectedNode = null;
                            if (name == "TCDeleteBtn") {
                                saas_object.current_Tree_ID = saas_object.testCase_Tree_ID;
                                selectedNode = saas_object.getSelectedNode(saas_object.testCase_Tree_ID);
                            } else {
                                saas_object.current_Tree_ID = saas_object.OR_Tree_ID;
                                selectedNode = saas_object.getSelectedNode(saas_object.OR_Tree_ID);
                            }
                            saas_object.DeleteNodeFromTree(selectedNode, saas_object.current_Tree_ID);
                        });

                $(".renameArtificateButton")
                    .click(
                        function (e) {
                            debugger;
                            var name = this.name;
                            var selectedNode = null;
                            if (name == "TCRenameBtn") {
                                saas_object.current_Tree_ID = saas_object.testCase_Tree_ID;
                                selectedNode = saas_object.getSelectedNode(saas_object.testCase_Tree_ID);
                            } else {
                                saas_object.current_Tree_ID = saas_object.OR_Tree_ID;
                                selectedNode = saas_object.getSelectedNode(saas_object.OR_Tree_ID);
                            }
                            saas_object.RenameNodeName(selectedNode, saas_object.current_Tree_ID);
                        });

                //$("#" + saas_object.current_Tree_ID).on(
                //    'rename_node.jstree',
                //    function (e, data) {
                //        var tree_node = data.node;
                //        var new_text = data.text;
                //        var old_text = data.old;
                //        saas_object.RenameNodeOfTree(tree_node,
                //            new_text);
                //    });

                //$("#" + saas_object.current_Tree_ID)
                //    .on(
                //        'select_node.jstree',
                //        function (e, data) {
                //            debugger;
                //            var tree_node = data.node;
                //            var isRestricted = tree_node.original.IsRestricted;

                //            saas_object.current_selected_node = tree_node;
                //            var node_type = tree_node["type"];
                //            var node_id = tree_node["id"];
                //            //console.log(node_type);
                //            //console.log(node_id);
                //            if (node_id == "00000000-0000-0000-0000-000000000000") {
                //                $("#deleteArtificateButton")
                //                    .prop("disabled", true);
                //                $("#renameArtificateButton")
                //                    .prop("disabled", true);
                //            } else {
                //                $("#deleteArtificateButton")
                //                    .prop("disabled", false);
                //                $("#renameArtificateButton")
                //                    .prop("disabled", false);
                //            }

                //            if (node_type == "Folder") {
                //                $("#artificateholder").prop(
                //                    "disabled", false);
                //                $("#artificateholder_or").prop(
                //                    "disabled", false);
                //                $("#createFolderButton").prop(
                //                    "disabled", false);
                //                $("#selectTestCase").prop(
                //                    "disabled", true);
                //                $("#startRecording").prop(
                //                    "disabled", true);
                //            } else if ((node_type == "Flow")
                //                || (node_type == "Component")) {
                //                $("#artificateholder").prop(
                //                    "disabled", true);
                //                $("#artificateholder_or").prop(
                //                    "disabled", true);
                //                $("#createFolderButton").prop(
                //                    "disabled", true);
                //                $("#selectTestCase").prop(
                //                    "disabled", false);
                //                $("#startRecording").prop(
                //                    "disabled", false);
                //            } else if (node_type == "ObjectRepository") {
                //                $("#artificateholder").prop(
                //                    "disabled", true);
                //                $("#artificateholder_or").prop(
                //                    "disabled", true);
                //                $("#createFolderButton").prop(
                //                    "disabled", true);
                //                $("#selectTestCase").prop(
                //                    "disabled", false);
                //                $("#startRecording").prop(
                //                    "disabled", false);
                //            }

                //            if (isRestricted) {
                //                $("#deleteArtificateButton")
                //                    .prop("disabled", true);
                //                $("#renameArtificateButton")
                //                    .prop("disabled", true);
                //                $("#artificateholder").prop(
                //                    "disabled", true);
                //                $("#createFolderButton").prop(
                //                    "disabled", true);

                //                $("#artificateholder_or").prop(
                //                    "disabled", true);
                //            }

                //            var countSelected = data.selected.length;
                //            if (countSelected > 1) {
                //                data.instance
                //                    .deselect_node([data.selected[0]]);
                //            }
                //        })
            });


};

Saas.prototype.BlockUI = function (message) {
    loadingStart(document.body, DOMPurify.sanitize( message), "");
};

Saas.prototype.UnBlockUI = function () {
    loadingStop(document.body,  DOMPurify.sanitize(""));
};

Saas.prototype.BlockLoaderUI = function (div_id, message) {
    loadingStart_BlockLoader(div_id, message, "");
};

Saas.prototype.UnBlockLoaderUI = function (div_id, message) {
    loadingStop_BlockLoader(div_id, "");
};

Saas.prototype.RefreshRespectiveTree = function () {
    if (saas_object.current_Tree_ID == "ORSelectionTree") {
        saas_object.ProcessAllObjectRepositoryTreeData();
    } else {
        saas_object.ProcessAllTestCaseTreeData();
    }
};


Saas.prototype.GetDataFromJsTree = function (treeId) {
    return $('#' + treeId).jstree(true).get_node(nodeId);
};

Saas.prototype.GetSelectedNode = function (treeId) {
    return $('#' + treeId).jstree().get_selected(true)
};

Saas.prototype.getInstanceJsTree = function (treeId) {
    return $('#' + treeId).jstree(true);
};

Saas.prototype.SetNodeJsTree = function (treeId, nodeId) {
    $('#' + treeId).jstree("deselect_all");
    $('#' + treeId).jstree(true).select_node(nodeId);
};

Saas.prototype.ShowToastMessage = function (messagetype, message) {
    chrome.runtime.sendMessage({ setDockerCommand_dock: { "action": "notifymessage", value: message } }, function (response) { });

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
};


Saas.prototype.IsCurrentPageExist = function (page_name) {
    var body_node = document.getElementsByTagName("BODY")[0];
    var page_type = body_node.getAttribute("op-addon-pagetype");
    var project_name = saas_object.GetGlobalSetting("OPKEY_PROJECT_NAME");
    if (page_type == page_name) {
        return true;
    }
    return false;
};

Saas.prototype.ExpandFirstLevelOfTree = function (treeid) {
    $("#" + treeid).jstree("select_node", "ul > li:first");
    var Selectednode = $("#" + treeid).jstree("get_selected");
    var treeexpansion_thread = window.setInterval(function () {
        $("#" + treeid).jstree("select_node", "ul > li:first");
        Selectednode = $("#" + treeid).jstree("get_selected");
        if (Selectednode != "") {
            $("#" + treeid).jstree("open_node", Selectednode, false, true);
            window.clearInterval(treeexpansion_thread);
        }
    }, 100);

};

Saas.prototype.CreateNewNodeInTree = function (node) {

};

Saas.prototype.RenameNodeNameApi = function (treeid, moduleType, originalNodeId,
    newName) {

    $.ajax({
        url: saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME")
            + "/ExplorerTree/RenameTreeItem",
        type: "Post",
        data: {
            moduleType: moduleType,
            nodeID: originalNodeId,
            newName: newName
        },
        success: function (returned_data) {

        },
        error: function (returned_data) {

        }
    });
};

Saas.prototype.RenameNodeName = function (tree_node, treeID) {
    debugger
    saas_object.current_Tree_ID = treeID;
    if (tree_node instanceof Array) {
        if (saas_object.current_Tree_ID == "testCaseSelectionTree") {
            saas_object.SetGlobalSetting("SELECTED_NODE_OF_TREE_TC", JSON
                .stringify(tree_node));
        } else {
            saas_object.SetGlobalSetting("SELECTED_NODE_OF_TREE_OR", JSON
                .stringify(tree_node));
        }
        $("#" + saas_object.current_Tree_ID)
            .jstree("select_node", tree_node[0]);
        $("#" + saas_object.current_Tree_ID).jstree("edit", tree_node[0]);
    } else {
        if (saas_object.current_Tree_ID == "testCaseSelectionTree") {
            saas_object.SetGlobalSetting("SELECTED_NODE_OF_TREE_TC", "["
                + JSON.stringify(tree_node) + "]");
        } else {
            saas_object.SetGlobalSetting("SELECTED_NODE_OF_TREE_OR", "["
                + JSON.stringify(tree_node) + "]");
        }
        $("#" + saas_object.current_Tree_ID).jstree("select_node", tree_node);
        $("#" + saas_object.current_Tree_ID).jstree("edit", tree_node);
    }
};

Saas.prototype.RenderAllProjectsForCurrentUser = function () {
    saas_object.BlockUI("Please Wait ...");

    $
        .ajax({
            url: saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME")
                + "/OpkeyApi/GetListOfAssignedProject",
            type: "GET",
            success: function (returened_project_names) {

                $
                    .ajax({
                        url: saas_object
                            .GetGlobalSetting("OPKEY_DOMAIN_NAME")
                            + "/OpkeyApi/GetSelectedProjectId",
                        type: "GET",
                        success: function (selected_project_name) {
                            var selected_project_pid = selected_project_name.SelectedProjectId;
                            if (selected_project_pid == "00000000-0000-0000-0000-000000000000") {
                                var extracted_project = saas_object
                                    .ExtractProjectNodeFromData(returened_project_names);
                                for (var i = 0; i < extracted_project.length; i++) {
                                    var project = extracted_project[i];
                                    var project_name = project.Name;
                                    var project_pid = project.PID;
                                    if (i == 0) {
                                        if (saas_object
                                            .GetGlobalSetting("SELECTED_PROJECT_PID") == null) {
                                            saas_object
                                                .SetGlobalSetting(
                                                    "OPKEY_PROJECT_NAME",
                                                    project_name);
                                            saas_object
                                                .SetGlobalSetting(
                                                    "SELECTED_PROJECT_PID",
                                                    project_pid);
                                            //  saas_object.SelectProject(project_pid);
                                        }
                                    }
                                    // $("#selectProjectList").append($('<option></option>').val(DOMPurify.sanitize(project_pid)).text(DOMPurify.sanitize(project_name)));
                                    // $("#selectProjectList").append($('<option></option>').val(project_pid).text(project_name));
                                    saas_object.appendSanitizedOption('selectProjectList', project_name,project_pid )
                                }

                                if (saas_object
                                    .GetGlobalSetting("SELECTED_PROJECT_PID") != null) {
                                    $("#selectProjectList")
                                        .val(
                                            saas_object
                                                .GetGlobalSetting("SELECTED_PROJECT_PID"));
                                }

                                saas_object.UnBlockUI();
                                if (saas_object
                                    .GetGlobalSetting("SELECTED_PROJECT_PID") != null) {
                                    saas_object
                                        .SelectProjectAmdGenerateUniQueName(saas_object
                                            .GetGlobalSetting("SELECTED_PROJECT_PID"));
                                }
                            } else {
                                var extracted_project = saas_object
                                    .ExtractProjectNodeFromData(returened_project_names);
                                for (var i = 0; i < extracted_project.length; i++) {
                                    var project = extracted_project[i];
                                    var project_name = project.Name;
                                    var project_pid = project.PID;
                                    if (project_pid == selected_project_pid) {
                                        saas_object.SetGlobalSetting(
                                            "SELECTED_PROJECT_PID",
                                            selected_project_pid);
                                        saas_object.SetGlobalSetting(
                                            "OPKEY_PROJECT_NAME",
                                            project_name);
                                    }
                                    // $("#selectProjectList").append($('<option></option>').val(DOMPurify.sanitize(project_pid)).text(DOMPurify.sanitize(project_name)));
                                    // $("#selectProjectList").append($('<option></option>').val(project_pid).text(project_name));
                                    saas_object.appendSanitizedOption('selectProjectList', project_name,project_pid )

                                }
                                $("#selectProjectList").val(
                                    selected_project_pid);
                                $("#selectProjectList").change();
                            }
                        }
                    });

            },
            error: function (error_returned_data) {
                saas_object.UnBlockUI();
            }
        });
};
$(function () {
    $("#selectProjectList").change(function (e) {
        var project_pid = $("#selectProjectList :selected").val();
        var project_name = $("#selectProjectList :selected").text();
        saas_object.SetGlobalSetting("OPKEY_PROJECT_NAME", project_name);
        saas_object.SetGlobalSetting("SELECTED_PROJECT_PID", project_pid);
        saas_object.SelectProjectAmdGenerateUniQueName(project_pid);
    });
});

Saas.prototype.ExtractProjectNodeFromData = function (projects_data) {
    var returned_project_array = [];
    var projects_array = projects_data["ListOfProjects"];
    for (var i = 0; i < projects_array.length; i++) {
        var project = projects_array[i];
        var project_node = new Object();
        project_node.PID = project.P_ID;
        project_node.Name = project.Name;
        project_node.Mode = project.Mode;
        returned_project_array.push(project_node);
    }
    return returned_project_array;
};

Saas.prototype.ExtractProjectNodeFromData_New = function (projects_array) {
    var returned_project_array = [];
    for (var i = 0; i < projects_array.length; i++) {
        var project = projects_array[i];
        var project_node = new Object();
        project_node.PID = project.P_ID;
        project_node.Name = project.Name;
        project_node.Mode = project.Mode;
        returned_project_array.push(project_node);
    }
    return returned_project_array;
};

Saas.prototype.SelectProject = function (project_pid) {
    $.get(saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME")
        + "/Login/ChooseProject?P_ID=" + project_pid, function (
            isselected_data, http_status) {

        if (http_status == "success") {
            saas_object.OpenTestCaseSelectionPage();
        }
    });
};

Saas.prototype.SelectProjectAmdGenerateUniQueName = function (project_pid) {
    saas_object.BlockUI("Please Wait ...");
    $.get(saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME")
        + "/Login/ChooseProject?P_ID=" + project_pid, function (
            isselected_data, http_status) {

        if (http_status == "success") {
            saas_object.UnBlockUI();
            saas_object.GetUniqueName();
        } else {
            saas_object.UnBlockUI();
        }
    });
};

Saas.prototype.SelectProjectWithoutGenerateUniQueName = function (project_pid) {
    saas_object.BlockUI("Please Wait ...");
    $.get(saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME")
        + "/Login/ChooseProject?P_ID=" + project_pid, function (
            isselected_data, http_status) {

        if (http_status == "success") {
            saas_object.UnBlockUI();
        } else {
            saas_object.UnBlockUI();
        }
    });
};

Saas.prototype.SelectProjectAndOpenRecorder = function (project_pid) {
    saas_object.BlockUI("Please Wait ...");
    $.get(saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME")
        + "/Login/ChooseProject?P_ID=" + project_pid, function (
            isselected_data, http_status) {

        if (http_status == "success") {
            saas_object.UnBlockUI();
            saas_object.OpenRecorderPage();
        }
    });
};

Saas.prototype.SelectSelectedNodeOnRefresh = function () {
    debugger;
    var selected_node = null;
    if (saas_object.current_Tree_ID == "testCaseSelectionTree") {
        selected_node = saas_object
            .GetGlobalSetting("SELECTED_NODE_OF_TREE_TC");
    } else {
        selected_node = saas_object
            .GetGlobalSetting("SELECTED_NODE_OF_TREE_OR");
    }
    if (selected_node != "[null]") {
        var object_select_node = JSON.parse(selected_node);
        var node_parents = object_select_node[0].parents;
        node_parents.reverse();
        var created_node_id = object_select_node[0].id;
        var parent_node = object_select_node[0].parent;
        var interval_thread = window.setInterval(function () {

            $(function () {
                var selected_node = saas_object
                    .GetSelectedNode(saas_object.current_Tree_ID);
                if (selected_node[0] != null) {
                    var selected_node_id = selected_node[0].id;
                    if (selected_node_id == created_node_id) {
                        window.clearInterval(interval_thread);
                    } else {
                        for (var np_i = 0; np_i < node_parents.length; np_i++) {
                            var node_parent = node_parents[np_i];
                            if (node_parent != "#") {
                                $("#" + saas_object.current_Tree_ID).jstree(
                                    "open_node", $("#" + node_parent));
                            }
                        }
                        window.setTimeout(function () {
                            $("#" + saas_object.current_Tree_ID).jstree(
                                "open_node", parent_node);
                            $("#" + saas_object.current_Tree_ID).jstree(
                                "select_node", $("#" + created_node_id));
                            var targetScroll = document.getElementById(
                                created_node_id).getBoundingClientRect();
                            if (targetScroll.y > window.innerHeight) {
                                document.getElementById(created_node_id)
                                    .scrollIntoView();
                            }
                        }, 500);
                    }
                }
            });
        }, 100);
    }
};

Saas.prototype.ProcessAllTestCaseTreeData = function () {
    debugger;
    saas_object.BlockLoaderUI("div_modal_body", "Please Wait ...");
    saas_object.BlockLoaderUI("testCaseSelectionPage", "Please Wait ..."); $.ajax({
        url: saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME")
            + "/ExplorerTree/GetFlowComponentJSTreeNodes?moduleType=Flow&isDTORequired=false",
        type: "Get",
        success: function (returned_data) {
            returned_data[0].text = "Test Case and Function Library";
            saas_object.current_Tree_ID = "testCaseSelectionTree";
            saas_object.UpdateJsTree("testCaseSelectionTree", returned_data);
            saas_object.UnBlockLoaderUI("testCaseSelectionPage", "");
            saas_object.UnBlockLoaderUI("div_modal_body", "");
        },
        error: function (error_returned) {
            saas_object.UnBlockUI();
        }
    });
};

Saas.prototype.ProcessAllObjectRepositoryTreeData = function () {
    saas_object.BlockLoaderUI("ORSelectionPage", "Please Wait ...");
    $.ajax({
        url: saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME")
            + "/ExplorerTree/GetJSTreeNodes?moduleType=ObjectRepository&isDTORequired=true",
        type: "Get",
        success: function (returned_data) {
            saas_object.current_Tree_ID = "ORSelectionTree";
            saas_object.UpdateJsTree("ORSelectionTree", returned_data);

            //saas_object.SelectSelectedNodeOnRefresh();
            saas_object.UnBlockLoaderUI("ORSelectionPage", "");
        },
        error: function (error_returned) {
            saas_object.UnBlockUI();
        }
    });
}

Saas.prototype.AcquireTCLock = function (db_id, module_type) {
    debugger;
    saas_object.AcquireLock(module_type, db_id);
};

Saas.prototype.AcquireORLock = function (db_id) {
    saas_object.AcquireLock("ObjectRepository", db_id);
};

Saas.prototype.OpenFlowChartView = function () {

    chrome.tabs.query({}, function (tabs) {
        var is_opkey_win_found = false;
        for (var tb_i = 0; tb_i < tabs.length; tb_i++) {
            var f_tab = tabs[tb_i];
            if (f_tab.title == "OpKey") {
                if (f_tab.url.indexOf(saas_object
                    .GetGlobalSetting("OPKEY_DOMAIN_NAME")) > -1) {
                    is_opkey_win_found = true;
                    saas_object.flowchart_tab_id = f_tab.id;
                    saas_object.SetGlobalSetting("FLOW_CHART_TABID", f_tab.id);
                    // chrome.tabs.update(f_tab.id,{url:saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME")+"/External/Recorder"}, function(response){});
                    var inj_tab_thread = window.setInterval(function () {
                        chrome.scripting.executeScript(
                            {
                                target: { tabId: f_tab.id },
                                func: () => {
                                    return sToggleRecorderOff();
                                },
                            },
                            function (results) {
                                // Log the results if needed
                                console.log("Tab Returned result", results);
                                if (results && results[0]?.result === "TOGGLED") {
                                    window.clearInterval(inj_tab_thread);
                                }
                            }
                        );

                    }, 500);
                    break;
                }
            }
        }

        if (is_opkey_win_found == false) {
            chrome.windows.create({
                url: saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME")
                    + "/External/Recorder",
                type: 'panel',
                state: "normal",
                left: 470,
                top: 0,
                width: 800,
                height: 600,
            }, function (win) {
                chrome.tabs.query({
                    windowId: win.id
                }, function (tabs) {
                    var tab_id = tabs[0].id;
                    saas_object.flowchart_tab_id = tab_id;
                    saas_object.SetGlobalSetting("FLOW_CHART_TABID", tab_id);
                    saas_object.SetGlobalSetting("FLOW_CHART_WinId", win.id);
                    var inj_tab_thread = window.setInterval(function () {
                        chrome.scripting.executeScript(
                            {
                                target: { tabId: tab_id },
                                func: () => {
                                    return sToggleRecorderOff();
                                },
                            },
                            function (results) {
                                // Log the results if needed
                                console.log("Tab Returned result", results);
                                if (results && results[0]?.result === "TOGGLED") {
                                    window.clearInterval(inj_tab_thread);
                                }
                            }
                        );

                    }, 500);
                });

            });
        }
    });
};

Saas.prototype.AcquireLock = function (module_type, db_id) {
    debugger;

    $
        .ajax({
            url: saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME")
                + "/Base/AcquireLock?moduleType=" + module_type
                + "&DB_ID=" + db_id,
            type: "Get",
            success: function (returned_data) {
                if (module_type == "Flow") {
                    saas_object.SetGlobalSetting("RECORDER_FLOW_DB_ID",
                        db_id);
                    saas_object.OpenObjectRepositorySelectionPage();
                }
                if (module_type == "Component") {
                    saas_object.SetGlobalSetting("RECORDER_FLOW_DB_ID",
                        db_id);
                    saas_object.OpenObjectRepositorySelectionPage();
                } else if (module_type == "ObjectRepository") {
                    saas_object
                        .SetGlobalSetting("RECORDER_OR_DB_ID", db_id);
                    saas_object.OpenRecorderPage();
                }
            },
            error: function (returned_error_data) {
                var response_text = returned_error_data.responseText;
                var response_text_object = JSON.parse(response_text);
                saas_object.ShowToastMessage("error",
                    response_text_object.message);
            }
        });
};

Saas.prototype.ReleaseLock = function (db_id) {
    $.get(saas_object.GetGlobalSetting("OPKEY_DOMAIN_NAME")
        + "/Base/ReleaseLock?DB_ID=" + db_id, function (returned_data,
            http_status) {

    });
};


Saas.prototype.getTreeInstance = function (Treeid) {
    return $('#' + Treeid).jstree(true);
};

Saas.prototype.getSelectedNode = function (Treeid) {
    //debugger;
    var tree = saas_object.getTreeInstance(Treeid);
    var selectedNode = tree.get_selected();
    var actualNode = tree.get_node(selectedNode[0]);
    if (selectedNode.length == 0) {
        return null;
    }
    return actualNode;
};

Saas.prototype.selectTreeNode = function (tree, nodeId) {
    $('#' + tree).jstree('deselect_all');
    if (nodeId !== null) {
        $('#' + tree).jstree('select_node', nodeId);
    }
};

Saas.prototype.getTreeNode = function (Treeid, NodeId) {
    var tree = saas_object.getTreeInstance(Treeid);
    var node = tree.get_node(NodeId);
    return node;
};

Saas.prototype.getPreviousNode = function (Treeid) {
    var tree = saas_object.getTreeInstance(Treeid);
    var actualNode = saas_object.getSelectedNode(Treeid);
    var ParentNodeid = actualNode.parent;
    var parentNode = tree.get_node(ParentNodeid);
    var currentNodePosition = $.inArray(actualNode.id, parentNode.children);
    var nodeToFocusAfterDelete = null;
    if (currentNodePosition == 0) {
        //It is the first children within its parent
        nodeToFocusAfterDelete = parentNode;
    }
    else {
        nodeToFocusAfterDelete = tree.get_node(parentNode.children[currentNodePosition - 1]);
    }

    return nodeToFocusAfterDelete;
};

//Custom util functions 

$.fn.bury = function (flag) {
    if (flag) { $(this).hide(); } else { $(this).show(); }
}


window.setInterval(function () {
    var body_node = document.getElementsByTagName("BODY")[0];
    var page_type = body_node.getAttribute("op-addon-pagetype");
    if (page_type != "RecorderPage") {
        chrome.runtime.sendMessage({
            cleanUp: "cleanUp"
        }, function (response) {
            if (chrome.runtime.lastError) { }
            chrome.runtime.sendMessage({
                removeHighlight: "removeHighlight"
            }, function (response) {
                if (chrome.runtime.lastError) { }
                chrome.runtime.sendMessage({
                    stopIdentifyingTabs: "stopIdentifyingTabs"
                }, function (response) {
                    if (chrome.runtime.lastError) { }
                });
            });
        });
    } else {

        var recording_mode = saas_object.GetGlobalSetting("RECORDING_MODE");

        if (recording_mode.indexOf("Desktop") == -1 && recording_mode.indexOf("SAP Netweaver") == -1 && recording_mode.indexOf("Mobile") == -1) {
            chrome.runtime.sendMessage({
                setHighlight: "setHighlight"
            }, function (response) {
                if (chrome.runtime.lastError) { }
                chrome.runtime.sendMessage({
                    startIdentifyingTabs: "startIdentifyingTabs"
                }, function (response) {
                    if (chrome.runtime.lastError) { }
                });
            });
        }
        else {
            chrome.runtime.sendMessage({
                removeHighlight: "removeHighlight"
            }, function (response) {

            });
        }
    }
}, 1000);

saas_object.Init();

Saas.prototype.appendSanitizedOption = function(selectId, rawText, value) {
	// 1) lookup the <select>
	const dropdownEl = document.getElementById(selectId);
	if (!dropdownEl) {
		console.warn(`No <select> with id="${selectId}" found.`);
		return;
	}

	// 2) create & populate the <option>
	const optionEl = document.createElement('option');
	const cleanText = DOMPurify.sanitize(rawText);
	const cleanValue = (value != null)
		? DOMPurify.sanitize(value)
		: cleanText;

	optionEl.value = cleanValue;
	optionEl.textContent = cleanText;

	// 3) append to the dropdown
	dropdownEl.appendChild(optionEl);
}
