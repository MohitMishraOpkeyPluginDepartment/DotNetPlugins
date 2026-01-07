myApp.factory("ServiceFactory", ['$rootScope', 'DataFactory', function($rootScope, dataFactory) {

    var ServiceFactory = {};

    var AllTagsData = null;
    var privilege_list = null;
    let userHavePrivilege = null;
    ServiceFactory.SetGlobalSetting = function(setting_key, setting_value) {
        localStorage.setItem(setting_key, setting_value);
    };

    ServiceFactory.GetGlobalSetting = function(setting_key) {
        return localStorage.getItem(setting_key);
    };

    ServiceFactory.AccessibilityGridEmpty = function(element) {
        if (element.dataSource.data().length === 0) {
            element.thead.removeAttr('role');
            element.tbody.removeAttr('role');

            if (element.thead.find('tr th').length === 0) {
                element.thead.find('tr').removeAttr('role');
            }
        }
    };

    ServiceFactory.LoadDataWhenAngularViewLoaded = function(element, callbackFunction, objectparameter) {
        if ($("#" + element).length === 0) {
            setTimeout(function() { ServiceFactory.LoadDataWhenAngularViewLoaded(element, callbackFunction, objectparameter); }, 500);
        } else {
            if (objectparameter === undefined) {
                callbackFunction();
            } else {
                callbackFunction(objectparameter[0], objectparameter[1], objectparameter[2], objectparameter[3], objectparameter[4], objectparameter[5]);
            }
            return false;
        }
    };

    ServiceFactory.groupingGridHighlightByName = function(GridID, filtertext) { // Function to highlight search for Grouping Grid
        debugger;
        if (filtertext.indexOf('>') != -1) {
            filtertext = filtertext.replace(/>/g, "&gt ");
        }
        if (filtertext.indexOf('<') != -1) {
            filtertext = filtertext.replace(/</g, "&lt;");
        }

        var $rows = $("#" + GridID + ' table tbody tr td');
        for (var i = 0; i < $rows.length; i++) {
            debugger;
            var row = $($rows[i]);
            if (row[0].cellIndex === 1 && $($rows[2]).is(":visible")) {
                var textName = fakingAngularCharacter(row.text());
                textName = textName.replace(/&gt  /g, "&gt ");
                if (textName.toLowerCase().includes(filtertext.toLowerCase()) == true) {
                    var indexOfText = textName.toLowerCase().indexOf(filtertext.toLowerCase());
                    var actualtext = textName.slice(indexOfText, indexOfText + filtertext.length);
                    var highlightedText = textName.replace(actualtext, "<span class='highlightSearch'>" + fakingAngularCharacter(actualtext) + "</span>");
                    row[0].innerHTML =DOMPurify.sanitize(highlightedText);
                }
            }
            if (row[0].cellIndex === 3 && $($rows[i - 2])[0].lastElementChild.className !== "highlightSearch" && $($rows[i - 1])[0].lastElementChild.className !== "highlightSearch") {
                var textName = fakingAngularCharacter(row.text());
                textName = textName.replace(/&gt  /g, "&gt ");
                if (textName.toLowerCase().includes(filtertext.toLowerCase()) == true) {
                    var indexOfText = textName.toLowerCase().indexOf(filtertext.toLowerCase());
                    var actualtext = textName.slice(indexOfText, indexOfText + filtertext.length);
                    var highlightedText = textName.replace(actualtext, "<span class='highlightSearch'>" + fakingAngularCharacter(actualtext) + "</span>");
                    row[0].innerHTML =DOMPurify.sanitize(highlightedText);
                }
            }
            if (row[0].cellIndex === 2 && $($rows[3]).is(":visible") && $($rows[i - 1])[0].lastElementChild.className !== "highlightSearch") {
                var textName = fakingAngularCharacter(row.text());
                textName = textName.replace(/&gt  /g, "&gt ");
                if (textName.toLowerCase().includes(filtertext.toLowerCase()) == true) {
                    var indexOfText = textName.toLowerCase().indexOf(filtertext.toLowerCase());
                    var actualtext = textName.slice(indexOfText, indexOfText + filtertext.length);
                    var highlightedText = textName.replace(actualtext, "<span class='highlightSearch'>" + fakingAngularCharacter(actualtext) + "</span>");
                    row[0].innerHTML = DOMPurify.sanitize(highlightedText);
                }
            }
        }
    };

    ServiceFactory.notifier = function(scope, title, content) {
        if (scope.notifier == undefined) {
            scope = $rootScope.Scope_Main;
        }
        //console.error(content);
        scope.notifier.show(fakingAngularCharacter(title), fakingAngularCharacter(content));
        $(".k-animation-container").css("z-index", "99999999");
        $(".k-animation-container").addClass("notification-container");

    };

    ServiceFactory.expandTreeNode = function(Treeid, NodeId) {
        $('#' + Treeid).jstree("open_node", NodeId);
    };

    ServiceFactory.setAllTagsData = function(TagsData) {
        AllTagsData = TagsData;
    };

    ServiceFactory.getAllTagsData = function() {
        return AllTagsData;
    };

    ServiceFactory.showError = function(scope, error) {
        debugger;
        var message = null;
        if (error == undefined) {
            return;
        }
        if (error.status == 403) {
            scope.ChangePageView("options.login");
            return false;
        }


        if (error != null && error.responseText != null) {
            if (error.responseText.indexOf("User not selected yet!") != -1) {
                scope.ChangePageView("options.login");
                return false;
            }
        }

        //Check that if it is a locked by error then refresh the artifact

        if (!!error.responseJSON) {
            message = error.responseJSON.message;
            if(document.URL.indexOf('callsource')>-1){
                let data = {action: "notifier", message: message, type: 'error' };
                window.parent.postMessage(JSON.stringify(data), "*");
            }
            else{
                ServiceFactory.notifier(scope, message, "Error");
            }
        } else if (error.message) {
            message = error.message;
            if(document.URL.indexOf('callsource')>-1){
                let data = {action: "notifier", message: message, type: 'error' };
                window.parent.postMessage(JSON.stringify(data), "*");
            }
            else{
                ServiceFactory.notifier(scope, message, "Error");
            }
        } else if (error.data) {
            message = error.data.message;
            if (message == "" || message == undefined) {
                ServiceFactory.msgbox(error.data, 'info');
            } else {
                if(document.URL.indexOf('callsource')>-1){
                    let data = {action: "notifier", message: message, type: 'error' };
                    window.parent.postMessage(JSON.stringify(data), "*");
                }
                else{
                    ServiceFactory.notifier(scope, message, "Error");
                }
            }
        } else if (error.responseText == undefined) {
            return false;
        } else if (error.responseText == "") {
            return false;
        } else if (typeof(error) === "string") {
            if (error.search("<!DOCTYPE html>") != -1) {
                ServiceFactory.msgbox(error, 'info');
            }
        }
        //else if (error.search("<!DOCTYPE html>") != -1) {
        //    ServiceFactory.msgbox(error, 'info');
        //}
        else {

            var errorMessage = error.responseText;
            if (errorMessage.indexOf("Version Information") !== -1) {

                var versionError = errorMessage.replace("Version Information:", "")
                errorMessage = versionError.replace("Microsoft .NET Framework Version:4.0.30319; ASP.NET Version:4.7.3282.0", "")


            }

            ServiceFactory.msgbox(errorMessage, 'info');
        }


    };

    //#region Notifications      

    ServiceFactory.msgbox = function(msg, msg_type) {
        $.msgBox({
            title: "Opkey",
            content: msg,
            modal: true,
            type: msg_type,
            buttons: [{ value: "ok" }],
            success: function(result) {
                if (result === "ok") {

                }
            }

        });
    };
    ServiceFactory.Navigate_msgbox = function(msg, msg_type, callback) {
        $.msgBox({
            title: "Opkey",
            content: msg,
            modal: true,
            type: msg_type,
            buttons: [{ value: "Navigate" }, { value: "Cancel" }],
            success: function(result) {
                if (result === "Navigate") {
                    callback(true); 
                } else {
                    callback(false);
                }
            }
        });
    };
    ServiceFactory.selectTreeNode = function(tree, nodeId) {

        $('#' + tree).jstree('deselect_all');

        if (nodeId !== null) {
            $('#' + tree).jstree('select_node', nodeId);
        }
    };

    ServiceFactory.getTreeNode = function(Treeid, NodeId) {
        var tree = ServiceFactory.getTreeInstance(Treeid);
        var node = tree.get_node(NodeId);
        return node;
    };

    ServiceFactory.getSelectedNodeID = function(Treeid) {
        var tree = ServiceFactory.getTreeInstance(Treeid);
        if (!tree) { return false; }
        var selectedNode = tree.get_selected();
        if (selectedNode.length == 0) {
            return null;
        }
        return selectedNode[0];
    };

    ServiceFactory.getTreeInstance = function(Treeid) {
        return $('#' + Treeid).jstree(true);
    };

    ServiceFactory.clickTreeNode = function(Treeid, NodeId) {
        // $("#" + Treeid + " li[id=" + NodeId + "] a").click();
        $("#" + Treeid + " #" + NodeId).closest("li").find("a")[0].click();
        //$("#" + Treeid + " li[id=" + NodeId + "] a").addClass('jstree-clicked');
        // $("#" + Treeid + " #" + NodeId).closest("li").find("a")[0].addClass('jstree-clicked');

    };

    ServiceFactory.getSelectedNode = function(Treeid) {
        //debugger;
        var tree = ServiceFactory.getTreeInstance(Treeid);
        var selectedNode = tree.get_selected();
        var actualNode = tree.get_node(selectedNode[0]);
        if (selectedNode.length == 0) {
            return null;
        }
        return actualNode;
    };

    ServiceFactory.ExpandTree = function(treeId, treeNodeId) {
        var tree = ServiceFactory.getTreeInstance(treeId);

        //Clear the previous preserved state
        tree.clear_state();

        //Close all the nodes
        tree.close_all();

        //Expand the root node
        $('#' + treeId).jstree("open_node", $("#00000000-0000-0000-0000-000000000000"));

        //Focus the root node
        ServiceFactory.SelectTreeNode(treeId, treeNodeId);

        // clear search result in execution tree & project tree
        $('#' + treeId).jstree(true).search('');
    };

    ServiceFactory.SelectTreeNode = function(tree, nodeId) {
        $('#' + tree).jstree("deselect_all");
        $('#' + tree).jstree(true).select_node(nodeId);
    }; //$scope.TreeSelectNode

    ServiceFactory.SetTreeNodeText = function(element, node, text) {
        $("#" + element).jstree('set_text', node, text);
    };

    ServiceFactory.load_resources = function(scripts) {

        scripts.forEach(function(script) {

            alert("script was called")

            $.ajax({
                url: script,
                async: false,
                dataType: "script",
            });
        });

    }

    ServiceFactory.SetCallSourceInDataFactory = function(data, key, callSource) {
        dataFactory[key]=data;
    };

    ServiceFactory.getCallSourceInDataFactory = function(data, key, callSource) {
        return dataFactory[key];
    };

    return ServiceFactory;


}]);