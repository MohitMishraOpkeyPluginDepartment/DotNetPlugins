



angular.module('myApp').controller("result_closed_session_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory', '$kWindow','$state',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory, $kWindow, $state) {

        var opkey_end_point =  $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        var object_session = null;

        $scope.currentTab = null;

        var sessionId = null;

        var SelectedSessionDto = null;

        $scope.SplitterClosedSessionOrientation = 'horizontal';
        $scope.ExecutionRightPanCenterSplitterOrientation = 'vertical';
        $scope.CenterOrientation = 'vertical';

        var treeId = 'div_JsTreeExecutionGrid';

        $scope.Load_Sub_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_Sub_View", Load_Sub_View);
        };

        function Load_Sub_View() {
            debugger;
            object_session = dataFactory.Selected_Execution_Node;
            sessionId = object_session.SessionId;
            //var session_name = dataFactory.Selected_Execution_Node.OS + " " + dataFactory.Selected_Execution_Node.Browser + " " + dataFactory.Selected_Execution_Node.Resolution;
            //$("#sp_session_name").text(stringCutter(session_name, 100) + ", " + object_session.SessionStatus + ", " + object_session.SessionState + ", " + object_session.SessionStart.split(" ")[0] + " - " + object_session.SessionEnd.split(" ")[0] + ", " + object_session.Browser);
            if (object_session.OS != null) {
                $("#divPlatform_text").text(object_session.OS);
                $("#Browser_text").text(object_session.Browser);
                $("#Resolution_text").text(object_session.Resolution);
                $("#Status_text").text(object_session.SessionStatus);
                GetSessionDataById(sessionId);
            }
            else {
                $('#div_ClosedsessionInfo').hide();
            }
            GetSessionInfoDtoBySessionId(sessionId);
            
        }
        function GetSessionInfoDtoBySessionId(sessionID) {
            debugger;
            console.log("4");
            $.ajax({
                url: opkey_end_point + "/Result/GetSessionInfoDtoBySessionId",
                type: "Post",
                crossDomain: true,
                data: { sessionId: sessionID },
                success: function (result) {
                    debugger;
                   
                    SelectedSessionDto = result.Item1;
                  
                    InitializeSessionExecutiontree(treeId);
                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function GetSessionDataById(sessionID) {
            debugger;
            $.ajax({
                url: opkey_end_point + "/MultiBrowser/GetSessionDataById",
                type: "Post",
                crossDomain: true,
                data: { sessionId: sessionID },
                success: function (result) {
                    $("#Status_text").text(result.SessionStatus);
                    
                },
                error: function (error) {

                }
            });
        }
        function InitializeSessionExecutiontree(treeId) {
            debugger
            debugger;
            $("#" + treeId).jstree("destroy"); // used to dispose tree if exist
            $("#" + treeId).on("loaded.jstree", function (e, data) {
                debugger;
                var nodeId = $(e.currentTarget.children).find('li')[0].id;
                serviceFactory.clickTreeNode(treeId, nodeId);
            }),
                $('#' + treeId).on("click", ".jstree-anchor", function (e, data) {
                debugger;               
                var node = $(e.target).closest("li");
                var nodeid = node[0].id;
                var treeNode = serviceFactory.getTreeNode(treeId, nodeid);
                dataFactory.selectedTreeNodeData = treeNode;

                setTimeout(function () {
                    debugger; 
                    if ($scope.currentTab != 'stepdetail' || $scope.currentTab == null) {
                        $scope.ChangeTabView("stepdetail");
                    }
                    else {                       
                        $rootScope.scopeStepDetails.bindStepdetailsData(treeNode);
                    }
                }, 100);

                });
            $('#' + treeId).on('click', '.jstree-node .jstree-icon.jstree-ocl', function (e) {
            });

            $("#" + treeId).on("before_open.jstree", function (e, data) {
                debugger
                var childrenLength = data.node.children.length;
                // $("#" + treeId).jstree("close_node", data.node.parent);
                if (childrenLength > 2) {
                    var nodesToKeepOpen = [];
                    if (data.node.id != "#") {
                        if (data.node.type != "Flow" || data.node.type != "Component") {
                            // get all parent nodes to keep open
                            $('#' + data.node.id).parents('.jstree-node').each(function () {
                                nodesToKeepOpen.push(this.id);
                            });
                            nodesToKeepOpen.push(data.node.id);
                            $('#div_JsTreeExecutionGrid .jstree-node .jstree-node .jstree-open').each(function () {
                                if (nodesToKeepOpen.indexOf(this.id) === -1) {
                                    var allOpenNodes = $('#div_JsTreeExecutionGrid .jstree-node .jstree-node .jstree-open');
                                    var node = serviceFactory.getTreeNode(treeId, this.id);
                                    // if (node.parent == )
                                    $("#" + treeId).jstree("close_node", node.id);
                                    //$("#" + treeId).jstree().close_node(this.id);
                                }
                            });
                        }
                    }
                    var selectedNode = serviceFactory.getTreeNode(treeId, data.node.parent);
                    var targetScroll = document.getElementById(selectedNode.parent);
                    if (targetScroll != null) {
                        $('.jstree-grid-wrapper').scrollTop($(targetScroll).position().top);
                    }
                }
            })
                .on('hover_node.jstree', function (e, data) {
                    var $node = $("#" + data.node.id);
                    var url = data.node.text;
                    $("#" + data.node.id).prop('title', url);
                }),
                $("#" + treeId).on("open_node.jstree", function (e, data) {
                   
                });
            $("#" + treeId).on("close_node.jstree", function (e, data) {

            });
            var repositoriesBP_Group = [];
            $("#" + treeId).jstree({
                'core': {
                    "worker": true,
                    "animation": false,
                    "force_text": true,
                    "themes": {
                        "name": "default-dark",
                        "dots": true,
                        "icons": true
                    },
                    "check_callback": true,
                    'multiple': false,
                    'worker': false,
                    'async': true,
                    'data': {
                        "type": 'POST',
                        'crossDomain': true,
                        "url": function (node) {
                            debugger;
                            var serverURL = getExecutionResultTreeURL(object_session.SessionId, node);
                            $scope.clickedNodeId = node.id;
                            return serverURL;
                        },
                        'data': function (node, cb) {
                        },
                        "success": function (result) {
                            debugger;
                            for (var i = result.length-1; i >=0; i--) {
                                if (result[i].type != "Suite" && result[i].data.Status == "NotExecuted") {
                                    result.splice(i, 1);
                                }
                            }
                            for (var i = 0; i < result.length; i++) {
                                //This is to show BP_Group as Flow type.
                                if (result[i].icon.indexOf("BP_Group") >= 0) {
                                    result[i].icon = result[i].icon.replace("BP_Group", "Flow");
                                    repositoriesBP_Group.push(result[i].id);
                                }
                                //This is to find weather the parent is of BP_Group type.
                                if (repositoriesBP_Group.indexOf(result[i].parent) >= 0) {
                                    result[i].icon = result[i].icon.replace("Flow", "BP_Group");
                                }
                            }
                            setTimeout(function () {
                                
                                serviceFactory.clickTreeNode(treeId, result[0].id);

                            },500)
                        },
                        "error": function (error) {
                            if (error.responseJSON != undefined) {
                                if (error.responseJSON.message.includes("Session result not found")) {
                                    $('#div_JsTreeExecutionGrid').html('');
                                    $('#div_JsTreeExecutionGrid').addClass('no_ResultData').attr('data-msg', error.responseJSON.message);
                                    return false;
                                }
                            }
                            serviceFactory.showError($scope, error);
                        }
                    },
                },
                "plugins": ["types"],
                search: {
                    case_insensitive: true,
                    show_only_matches: true
                },
                "types": {
                    "Component": { "icon": "sprite2 Component", "max_children": 0 },
                    "Flow": { "icon": "sprite2 Flow", "max_children": 0 },
                    "Suite": { "icon": "sprite2 Suite", "max_children": 0 },
                    "Gherkin": { "icon": "sprite2 Gherkin ", "max_children": 0 },
                },
            });
        };

        function getExecutionResultTreeURL(sessionId, node) {
            if (node.id == "#") {
                return opkey_end_point+"/Result/getResultTree?&SessionID=" + sessionId + "&parentResultID=" + dataFactory.EmptyGuid + "&stepNumber=" + 0 + "&decryptData=" + false;
            } else {
                return opkey_end_point+"/Result/getResultTree?&SessionID=" + sessionId + "&parentResultID=" + node.id + "&stepNumber=" + node.data.StepNumber + "&decryptData=" + false;
            }

        }
        $scope.ExpandAll = function () {
            var Selectednode = serviceFactory.getSelectedNode(treeId);
            $("#" + treeId).jstree("open_node", Selectednode.id);//.trigger("select_node.jstree");
            if (Selectednode.children.length > 0) {
                setTimeout(function () {
                    serviceFactory.clickTreeNode(treeId, Selectednode.children[0]);
                }, 100);
                setTimeout(function () {
                    serviceFactory.SelectTreeNode(treeId, Selectednode.children[0]);
                }, 150);
            }
        };
        $scope.collapseAll = function () {
            debugger;
            var ExeTreeInst = $("#" + treeId).jstree(true);
            var Selectednode = serviceFactory.getSelectedNode(treeId);
            $("#" + treeId).jstree("open_node", Selectednode.parent);//.trigger("select_node.jstree");
            //Close all the nodes
            ExeTreeInst.close_all();
            if (Selectednode.parent.length > 1) {
                var rootNodeindex = Selectednode.parents.length - 2;
                setTimeout(function () {
                    serviceFactory.clickTreeNode(treeId, Selectednode.parents[rootNodeindex]);
                }, 100);
                serviceFactory.SelectTreeNode(treeId, Selectednode.parents[rootNodeindex]);
            }
        };
        $scope.ChangeTabView = function (tab_type) {
            $('.SessionTabContent').removeClass('active');
            $('#bt_' + tab_type).addClass('active');
            $scope.currentTab = tab_type;
            $state.go('result.closed_session.' + tab_type);
        }
        $scope.getlogs = function () {
            debugger;
            var sessionDto = SelectedSessionDto.SessionDTO;
            sessionDto.text = sessionDto.Name;
            $.ajax({
                url: opkey_end_point+"/Result/getSessionLogs",
                type: "Post",
                crossDomain: true,
                data: { sessionID: sessionId },
                responseType: 'arraybuffer',
                async: false,
                success: function (res) {
                    debugger;
                    if (res.indexOf("http") == 0) {

                        window.location.href = res;

                    } else {
                        var blob = new Blob([res]);
                        var a = document.createElement("a"),
                            file = new Blob([res], { type: "text" });
                        if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                            download(new Blob([res]), sessionDto.text + new Date() + ".txt", "text/plain");
                        } else {
                            if (window.navigator.msSaveOrOpenBlob) // IE10+
                                window.navigator.msSaveOrOpenBlob(file, sessionDto.text + new Date() + ".txt");
                            else { // Others
                                var url = URL.createObjectURL(file);
                                a.href = url;
                                a.download = sessionDto.text + new Date() + ".txt";
                                document.body.appendChild(a);
                                a.click();
                                setTimeout(function () {
                                    document.body.removeChild(a);
                                    window.URL.revokeObjectURL(url);
                                }, 0);
                            }
                            return false;
                        }
                    }
                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });
        };
        $scope.dockCollapse = function () {
            debugger
            $scope.BottomModule = null;
            var splitter = $("#BottomSplitter").data("kendoSplitter");
            $('#dockpanel').hide();
            $('.bottomMenuModule').removeClass('BottomSelect');
            splitter.toggle(".k-pane:last", false);
        }
        $scope.LoadBottom = function (Modulename) {
            $('.bottomMenuModule').removeClass('BottomSelect');
            if (Modulename == $scope.BottomModule) {
                $scope.dockCollapse();
                return;
            }
            $scope.BottomModule = Modulename;
            if ($scope.BottomModule == 'MetaInfo') {
                $('#MetaInfoButton').addClass('BottomSelect');
            } else if ($scope.BottomModule == 'Tag') {
                $('#TagButton').addClass('BottomSelect');
            }
            LoadInfo(Modulename);
        }
        function LoadInfo(Modulename) {
            debugger;
            $('#bottom-Head').text(Modulename);
            $('#dockpanel').show();
            switch (Modulename) {
                case "MetaInfo":
                    bindMetaInfoGrid();
                    break;

                case "Tag":
                    tagsServerCall();
                    break;

            }
            var splitter = $("#BottomSplitter").data("kendoSplitter");
            splitter.toggle(".k-pane:last", true);
        }
        function tagsServerCall() {
            debugger

            $.ajax({
                url: opkey_end_point+"/Result/getSessionTags",
                type: "Post",
                crossDomain: true,
                data: { SessionId: object_session.SessionId },
                success: function (res) {
                    debugger;
                    $("#Div_Execution_Result_Info").html('');

                    var html = "";

                    html = html + '<div class="appScroll_xy" tabindex="0"><table width="100%" border="0" cellspacing="0" cellpadding="0" class="table BottomGridtableStyle table-bordered">';
                    html = html + '<tbody>';

                    for (var i = 0; i < res.length; i++) {
                        html = html + '<tr><th>' + fakingAngularCharacter(res[i].Key) + '</th>';
                        html = html + '<td>' + fakingAngularCharacter(res[i].Value) + '</td></tr>';
                    }

                    html = html + ' </tbody></table></div>';

                    $("#Div_Execution_Result_Info").html(DOMPurify.sanitize(html));

                }, error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });
        };

        function bindMetaInfoGrid() {
            debugger;
            $.ajax({
                type: "Post",
                crossDomain: true,
                url: opkey_end_point+"/Result/getSessionMetaInformation",
                data: { sessionID: object_session.SessionId},
                success: function (res) {
                    debugger;
                    $("#Div_Execution_Result_Info").html('');
                    var html = "";
                    html = html + '<div class="appScroll_xy" tabindex="0"><table width="100%" border="0" cellspacing="0" cellpadding="0" class="table BottomGridtableStyle table-bordered">';
                    html = html + '<tbody>';


                    html = html + '<tr><th>Suite Name</th>';
                    html = html + '<td> <span id="spanMetaSuiteName">' + fakingAngularCharacter(res.SuiteName) + '</span></td></tr>';
                    html = html + '<tr><th>Session Name</th>';
                    html = html + '<td>' + fakingAngularCharacter(res.Name) + '</td></tr>';

                    html = html + '<tr><th>Session Id</th>';
                    html = html + '<td>' + res.Session_ID + '</td></tr>';
                    html = html + '<tr><th>Batch Name</th>';
                    html = html + '<td>' + fakingAngularCharacter(res.BatchName) + '</td></tr>';
                    html = html + '<tr><th>Build Name</th>';
                    html = html + '<td>' + fakingAngularCharacter(res.BuildName) + '</td></tr>';
                    html = html + '<tr><th>DefaultStepTimeout</th>';
                    html = html + '<td>' + res.DefaultStepTimeout + '</td></tr>';
                    html = html + '<tr><th>SnapshotFrequency</th>';
                    html = html + '<td>' + res.SnapshotFrequency + '</td></tr>';
                    html = html + '<tr><th>SnapshotQuality</th>';
                    html = html + '<td>' + res.SnapshotQuality + '</td></tr>';
                    html = html + '<tr><th>Start Time</th>';
                    html = html + '<td>' + res.StartTime + '</td></tr>';
                    html = html + '<tr><th>End Time</th>';
                    html = html + '<td>' + res.EndTime + '</td></tr>';
                    html = html + '<tr><th>Agent Name</th>';
                    html = html + '<td>' + fakingAngularCharacter(res.AgentName) + '</td></tr>';
                    html = html + '<tr><th>Plugins</th>';
                    html = html + '<td>' + res.Plugins + '</td></tr>';
                    html = html + '<tr><th>Browser</th>';
                    html = html + '<td><span id="spanMetaBrowserName">' + res.Browser + '</span></td></tr>';
                    html = html + '<tr><th>Debug Mode</th>';
                    html = html + '<td>' + res.DebugMode + '</td></tr>';

                    var postExecutionReportStatus = res.PostExecutionReport ? "Yes" : "No";

                    html = html + '<tr><th>Validation Report</th>';
                    html = html + '<td>' + postExecutionReportStatus + '</td></tr>';               
                    html = html + '<tr><th>Skip Blank Data Steps</th>';
                        html = html + '<td>' + res.ApplySkipStepValidation + '</td></tr>';
                        html = html + '<tr><th>Randomize Input Default Value</th>';
                        html = html + '<td>' + res.RandomizeInputDefaultValue + '</td></tr>';                    
                    html = html + ' </tbody></table></div>';
                    $("#Div_Execution_Result_Info").html(DOMPurify.sanitize(html));

                    if (res.SuiteName == null) {
                        GetSessionSuiteName();
                    }
                    if (res.Browser == "-none-") {
                        GetSessionBrowserName();
                    }
                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            });
        }

        function GetSessionSuiteName() {
            $.ajax({
                url: opkey_end_point+"/Result/GetSessionSuiteName",
                data: { SessionID: object_session.SessionId },
                type: "Get",
                success: function (res) {
                    $('#spanMetaSuiteName').text(res);
                },
                error: function (error) {

                }
            })
        }

        function GetSessionBrowserName() {
            $.ajax({
                url: opkey_end_point+"/Result/GetSessionBrowserName",
                data: { SessionID: object_session.SessionId  },
                type: "Get",
                success: function (res) {
                    $('#spanMetaBrowserName').text(res);
                },
                error: function (error) {

                }
            })
        }
    }]);




