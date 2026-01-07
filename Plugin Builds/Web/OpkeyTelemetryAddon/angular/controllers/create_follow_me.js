angular.module('myApp').controller("createFollowMe_ctrl", [
    '$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory', '$kWindow',
    function($rootScope, $scope, serviceFactory, dataFactory, formControlFactory, $kWindow) {

        var pureAllStartBrowserObject = new Object();

        var selectedExecutionMode = EnumExecutionMode.Web;

        var selectedBrowserDeviceElement = $("#btSelectBrowser");

        var execution_type = EnumExecutionType.Cloud;

 

        var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        $rootScope.ScopeFollowMe = $scope;

        $scope.Load_View = function() {
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_View", Load_View);
        }

        function Load_View() {
            PopulateBrowserWindow();
            //$("#div_footer_tutoriol").hide();
            $("#Main_HomeBanner").hide();
            $("#div_footer_tutoriol").hide();
            $("#Main_Home").removeClass('col-sm-9');
            $("#Main_Home").addClass('col-sm-12');

        }

        function PopulateBrowserWindow() {
            pureAllStartBrowserObject = [];
            pureAllStartPlatformObject = [];
            getGridExecutionInformation();
        }

        function getGridExecutionInformation() {
            debugger;
            loadingStart("#div_select_browsers", "Please Wait ...", ".btnTestLoader");
            $.ajax({
                url: opkey_end_point + "/Execution/GetMultiBrowserPreExecutionInformation",
                type: "POST",
                success: function(result) {
                    debugger;

                    loadingStop("#div_select_browsers", ".btnTestLoader");
                    if (result.LastUsedBuildName == "" || result.LastUsedBuildName == null) {
                        createDropdownForBuilds(result.AllBuildNames, result.NewBuildName);
                    } else {
                        createDropdownForBuilds(result.AllBuildNames, result.LastUsedBuildName);
                    }

                    selectedSession = result.SessionName;

                    $('#txtSessionName').val(fakingAngularCharacter(result.SessionName));

                    changeBrowserDevice(selectedExecutionMode);

                    // Date related stuff

                },
                error: function(error) {
                    loadingStop("#div_select_test_cases", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });
        };

        function createDropdownForBuilds(listOfBuilds, lastUsedBuildName) {

            $("#ddlBuilds").kendoComboBox({
                dataSource: listOfBuilds,
                filter: "contains",
                template: '<span class="k-state-default app_Text_overflowDot" title = "#: data #">#: data #</span>',
                select: function(e) {
                    debugger;

                }
            });

            var createBuild = $("#ddlBuilds").data("kendoComboBox");
            createBuild.input.keydown(function(e) {
                debugger;
                var inputVal = e.which;
                var specialChar = inputVal == 186 || inputVal == 191 || inputVal == 220 || inputVal == 222 || inputVal == 188 || inputVal == 190 || inputVal == 188 || inputVal == 186 ||
                    inputVal == 190 || inputVal == 191 || inputVal == 192 || inputVal == 220 || inputVal == 222 || inputVal == 106 || (e.shiftKey && inputVal == 56) || inputVal == 111 || (e.shiftKey && inputVal == 59) || inputVal == 59;

                if ($("#ddlBuilds").val().length == 0) {
                    if (specialChar == true) {
                        e.preventDefault();
                    } else {
                        $('#spErrorBuild').html('');
                    }
                } else {
                    if (specialChar == true) {
                        e.preventDefault();
                    }
                }
            });
            createBuild.input.bind("cut copy paste", function(e) {
                e.preventDefault();
            });
            createBuild.value(lastUsedBuildName);

        }

        function changeBrowserDevice(type) {

            $(".tab-platform").removeClass("active");
            $(".panelBrowserDevice").bury(true);
            $(".gridCategory").bury(true);

            selectedExecutionMode = type;
            if (type === EnumExecutionMode.Web) {

                $(selectedBrowserDeviceElement).addClass("active");
                pureAllStartPlatformObject = [];
                $("#divGridCategory").bury(false);
                $("#divGridBrowserSubCategory").bury(false);



                objectOfDevice = new Object();
                arrayOfPlatform = [];
                selectedDeviceVersion = new Object();


                var columnBrowser = browserCategoryColumn();
                BindCategory(columnBrowser);
                GetBrowserCombinations();
            } else {

                $(selectedBrowserDeviceElement).addClass("active");
                pureAllStartBrowserObject = [];
                //     selectedDeviceVersion = {};
                $("#divGridPlatform").bury(false);
                $("#divGridMobileDevice").bury(false);

                arrayOperatingSystem = [];
                objectBrowser = new Object();
                selectedOperatingSystem = new Object();
                objectOfDeviceVersion = new Object();
                objectBrowserAttribute = "";
                browserGuids = [];
                $scope.selectedBrowserVersion = new Object();
                object_browser_version_resolution = new Object();
                object_browser_version_viewport = new Object();
                GetMobileCombinations();
            }

        }

        function browserCategoryColumn() {
            var arrayOfBrowserColumn = [];
            var objectColumn = new Object();
            objectColumn["field"] = "OS_Name";
            objectColumn["title"] = "Operating System";
            objectColumn["template"] = function(e) {
                debugger;
                var osname = e.OS_Name + " " + e.OS_Version;
                // var osmac = e.OS_Name;

                var html = '';

                var osSprite = "mbspriteB Window10";
                debugger;
                if (osname.toLowerCase().indexOf("windows 10") != -1) {
                    osSprite = "mbspriteB window10";
                } else if (osname.toLowerCase().indexOf("windows 8.1") != -1) {
                    osSprite = "mbspriteB window7";
                } else if (osname.toLowerCase().indexOf("windows 7") != -1) {
                    osSprite = "mbspriteB window7";

                } else if (osname.toLowerCase().indexOf("mac") != -1) {
                    osSprite = "mbspriteB mac";
                }
                debugger;

                return '<span class="' + osSprite + '" style="vertical-align:bottom;"></span>' + e.OS_Name + " " + e.OS_Version;

            }
            arrayOfBrowserColumn.push(objectColumn);

            return arrayOfBrowserColumn;
        }

        function BindCategory(gridColumnData) {

            $("#divGridCategory").kendoGrid({
                dataSource: new kendo.data.DataSource({
                    data: [],
                }),
                selectable: "row",
                scrollable: false,
                columns: gridColumnData,
                change: function(e) {
                    debugger;
                    var selectedItem = e.sender.dataItem(e.sender.select());
                    var osKey = selectedItem["OS_Name"] + selectedItem["OS_Version"]
                    var selectedOSData = objectBrowser[osKey];
                    selectedOperatingSystem = selectedOSData;
                    var gridColumn = browserSubCategoryColumn(selectedOSData);
                    var gridData = browserSubCategoryData(selectedOSData);
                    BindBrowserSubCategory(gridColumn, gridData)

                },
                editable: false,
                edit: function(e) {
                    debugger;
                },
                dataBound: function(e) {
                    debugger;
                    var data = e.sender.dataSource.data();
                    if (data.length != 0) {
                        e.sender.select("tr:eq(1)");
                    }
                },

            }).getKendoGrid();


        }

        function BindBrowserSubCategory(gridColumn, gridData) {


            var dictionary_columns = {};

            $.each(gridColumn, function(ind, obj) {



                if (obj.title.toLowerCase().indexOf("chrome") != -1) {
                    dictionary_columns[0] = obj;
                } else if (obj.title.toLowerCase().indexOf("firefox") != -1) {
                    dictionary_columns[1] = obj;
                } else if (obj.title.toLowerCase().indexOf("msedge") != -1) {
                    dictionary_columns[2] = obj;
                } else if (obj.title.toLowerCase().indexOf("ie") != -1) {
                    dictionary_columns[3] = obj;
                } else if (obj.title.toLowerCase().indexOf("safari") != -1) {
                    dictionary_columns[4] = obj;
                } else {

                    var ind_dict = ind + 20;
                    dictionary_columns[ind_dict] = obj;
                }

            });


            console.log("dictionary_columns");
            console.log(dictionary_columns);



            var my_new_array_columns = [];


            $.each(dictionary_columns, function(ind, obj) {
                my_new_array_columns.push(obj);
            });



            $("#divGridBrowserSubCategory").html('');

            $("#divGridBrowserSubCategory").kendoGrid({
                dataSource: new kendo.data.DataSource({
                    data: gridData,
                }),
                selectable: "row",
                columns: my_new_array_columns,
                change: function(e) {
                    debugger;

                },
                editable: false,
                edit: function(e) {
                    debugger;
                },
                dataBound: function(e) {
                    debugger;

                    // $(".selectVersion").unbind().bind("click", function() {
                    // bind is depricated 

                    $(".selectVersion").off("click").on("click", function() {
                        debugger;
                        var checkedState = this.checked;
                        var browserVersionId = $(this).attr("data-browserId");

                        if (checkedState) {
                            if (!$scope.selectedBrowserVersion.hasOwnProperty(browserVersionId)) {
                                $scope.selectedBrowserVersion[browserVersionId] = objectOfDeviceVersion[browserVersionId];
                            }
                        } else {
                            delete $scope.selectedBrowserVersion[browserVersionId];
                            delete object_browser_version_resolution[browserVersionId];
                            delete object_browser_version_viewport[browserVersionId];

                            $("#ddlResolution_" + browserVersionId).val("Select");


                            var ddlResolution = $("#ddlResolution_" + browserVersionId).data("kendoDropDownList");
                            ddlResolution.select(0);


                            var ddlviewport = $("#ddlviewport_" + browserVersionId).data("kendoDropDownList");
                            ddlviewport.select(0);

                        }
                        loadWindow_Summary();
                    });

                },

            }).getKendoGrid();
        }

        function loadWindow_Summary() {
            var arraySummaryGrid = [];
            $.each($scope.selectedBrowserVersion, function(ind, obj) {
                debugger;
                var objectGridSummaryRow = new Object();
                var browserKey = obj.OS_Name + obj.OS_Version + obj.Browser_Name + obj.Browser_Version;

                objectGridSummaryRow["Type"] = "Browser";
                objectGridSummaryRow["SessionName"] = $("#txtSessionName").val();
                objectGridSummaryRow["Category"] = obj.OS_Name + " " + obj.OS_Version;
                objectGridSummaryRow["SubCategory"] = obj.Browser_Name + " " + obj.Browser_Version;
                objectGridSummaryRow["Id"] = obj.Browser_Version_ID;

                objectGridSummaryRow["Resolution"] = empty;
                objectGridSummaryRow["ViewPort"] = empty;

                if (object_browser_version_resolution.hasOwnProperty(obj.Browser_Version_ID)) {
                    objectGridSummaryRow["ViewPort"] = object_browser_version_resolution[obj.Browser_Version_ID];
                }

                if (object_browser_version_viewport.hasOwnProperty(obj.Browser_Version_ID)) {
                    objectGridSummaryRow["Resolution"] = object_browser_version_viewport[obj.Browser_Version_ID];
                }
                objectGridSummaryRow["Error"] = false;

                arraySummaryGrid.push(objectGridSummaryRow);

            });
            $scope.DataGridSessionSummary.data(arraySummaryGrid);
        }
        // Browsers Operation

        var arrayOperatingSystem = [];

        var objectBrowser = new Object();

        var selectedOperatingSystem = new Object();

        var objectOfDeviceVersion = new Object();

        var objectBrowserAttribute = "";

        var browserGuids = [];

        $scope.selectedBrowserVersion = new Object();

        var pureAllStartBrowserObject = new Object();

        var object_browser_version_resolution = new Object();

        var object_browser_version_viewport = new Object();

        var all_browser_data = [];

        function GetBrowserCombinations() {
            debugger;



            var ajax_url = empty;
            var ajax_data = {};

            if (execution_type === EnumExecutionType.Local) {
                ajax_url = opkey_end_point + "/Admin/GetBrowserCombinations";
            } else if (execution_type === EnumExecutionType.Cloud) {
                ajax_url = opkey_end_point + "/BrowserCloud/getAvailableBrowsers";
                ajax_data = { browserCloudRelayServer: dataFactory.Response_pcloudy_credentials.browserCloudRelayServer, browserCloudAuthToken: dataFactory.Response_pcloudy_credentials.AuthToken };
            }


            loadingStart(".selectTestBrowsers", "Please Wait ...", ".btnTestLoader");


            $.ajax({
                url: ajax_url,
                data: ajax_data,
                type: "POST",
                success: function(result) {

                    debugger;
                    loadingStop(".selectTestBrowsers", ".btnTestLoader");

                    if (all_browser_data.length === 0) {


                        // Step 1 Ok Lets Vreate Binding

                        objectBrowser = new Object();
                        arrayOperatingSystem = [];
                        selectedOperatingSystem = new Object();
                        objectOfDeviceVersion = new Object();
                        objectBrowserAttribute = "";
                        browserGuids = [];
                        pureAllStartBrowserObject = new Object();


                        $.each(result, function(ind, obj) {

                            var theOsKey = obj.OS_Name + obj.OS_Version;
                            var theBrowserKey = "B" + obj.Browser_ID.replace(/\-/g, '');
                            var theBrowserVersionKey = obj.Browser_Version_ID;
                            var tempBrowserVersionObject = new Object();
                            var tempBrowserObject = new Object();
                            var keyBrowserObject = new Object();
                            var totalBrowsersInOS = 1;

                            var allStartKey = obj.OS_Name + obj.OS_Version + obj.Browser_Name + obj.Browser_Version;

                            if (pureAllStartBrowserObject.hasOwnProperty(allStartKey)) {
                                return true;
                            } else {
                                pureAllStartBrowserObject[allStartKey] = allStartKey;

                            }


                            // All Versions

                            if (!objectOfDeviceVersion.hasOwnProperty(obj.Browser_Version_ID)) {
                                objectOfDeviceVersion[obj.Browser_Version_ID] = obj
                            }


                            // Grids

                            if (objectBrowser.hasOwnProperty(theOsKey)) {

                                keyBrowserObject = objectBrowser[theOsKey];

                                totalBrowsersInOS = keyBrowserObject["Total"]

                                if (keyBrowserObject.hasOwnProperty(theBrowserKey)) {

                                    tempBrowserObject = keyBrowserObject[theBrowserKey];
                                    tempBrowserVersionObject = tempBrowserObject["Versions"];


                                    var totalVersion = tempBrowserVersionObject["Total"] + 1;

                                    if (totalBrowsersInOS < totalVersion) {
                                        totalBrowsersInOS = totalVersion;
                                    }

                                    tempBrowserVersionObject["Total"] = totalVersion;
                                    tempBrowserVersionObject[totalVersion] = obj.Browser_Version_ID;
                                } else {


                                    tempBrowserVersionObject[0] = obj.Browser_Version_ID;
                                    tempBrowserVersionObject["Total"] = 0;


                                    tempBrowserObject["Name"] = obj.Browser_Name;
                                    tempBrowserObject["Versions"] = tempBrowserVersionObject;
                                }

                            } else {

                                tempBrowserVersionObject[0] = obj.Browser_Version_ID;
                                tempBrowserVersionObject["Total"] = 0;
                                tempBrowserObject["Name"] = obj.Browser_Name;
                                tempBrowserObject["Versions"] = tempBrowserVersionObject;


                                var osObject = new Object();
                                osObject["OS_Name"] = obj.OS_Name;
                                osObject["OS_Version"] = obj.OS_Version;
                                arrayOperatingSystem.push(osObject);
                            }


                            keyBrowserObject[theBrowserKey] = tempBrowserObject;


                            //tempBrowserVersionObject["Browsers"] = "";
                            keyBrowserObject["Total"] = totalBrowsersInOS;

                            objectBrowser[theOsKey] = keyBrowserObject;

                        });


                    }
                    all_browser_data = result;
                    var Arranged_OS = arrayOperatingSystem.sort(Arrange_OS("OS_Name"));
                    $("#divGridCategory").data("kendoGrid").dataSource.data(Arranged_OS);
                    if (arrayOperatingSystem.length == 0) {
                        $('#divGridBrowserSubCategory').addClass('Banner_NoBrowser_Step')
                    } else {
                        $('#divGridBrowserSubCategory').removeClass('Banner_NoBrowser_Step')
                    }
                    loadWindow_Summary();
                },
                error: function(error) {
                    loadingStop(".selectTestBrowsers", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });
        };

        function Arrange_OS(property) {
            var sort_order = -1;
            return function(a, b) {
                // a should come before b in the sorted order
                if (a[property] < b[property]) {
                    return -1 * sort_order;
                    // a should come after b in the sorted order
                } else if (a[property] > b[property]) {
                    return 1 * sort_order;
                    // a and b are the same
                } else {
                    return 0 * sort_order;
                }
            }
        }
        // Device Operation

        var objectOfDevice = new Object();

        var arrayOfPlatform = [];

        var selectedDeviceVersion = new Object();

        var pureAllStartPlatformObject = new Object();

        function GetMobileCombinations() {
            debugger;



            var ajax_url = empty;
            var ajax_data = {};

            if (execution_type === EnumExecutionType.Local) {
                ajax_url = opkey_end_point + "/Admin/GetMobileCombinations";
            } else if (execution_type === EnumExecutionType.Cloud) {}



            loadingStart(".selectTestBrowsers", "Please Wait ...", ".btnTestLoader");
            $.ajax({
                url: ajax_url,
                data: ajax_data,
                type: "POST",
                success: function(result) {

                    debugger;
                    loadingStop(".selectTestBrowsers", ".btnTestLoader");

                    objectOfDevice = new Object();
                    arrayOfPlatform = [];
                    pureAllStartPlatformObject = new Object();

                    $.each(result, function(ind, obj) {

                        var thePlatform = obj.Platform + obj.MobileDevice_Version;

                        var allStartKey = obj.Platform + obj.MobileDevice_Version + obj.MobileDevice_Name;

                        if (pureAllStartPlatformObject.hasOwnProperty(allStartKey)) {
                            return true;
                        } else {
                            pureAllStartPlatformObject[allStartKey] = allStartKey;

                        }


                        var arrayOfMobileDevice = []

                        if (objectOfDevice.hasOwnProperty(thePlatform)) {
                            arrayOfMobileDevice = objectOfDevice[thePlatform];
                        } else {
                            var objectPlatform = new Object();
                            objectPlatform["Platform"] = obj.Platform;
                            objectPlatform["PlatformVersion"] = obj.MobileDevice_Version;

                            arrayOfPlatform.push(objectPlatform);
                        }
                        arrayOfMobileDevice.push(obj)
                        objectOfDevice[thePlatform] = arrayOfMobileDevice;
                    });

                    $scope.DataGridPlatform.data(arrayOfPlatform);
                    if (arrayOfPlatform.length == 0) {
                        $('#divGridMobileDevice').addClass('Banner_NoDevice_Step')
                    } else {
                        $('#divGridMobileDevice').removeClass('Banner_NoDevice_Step')
                    }

                },
                error: function(error) {
                    loadingStop(".selectTestBrowsers", ".btnTestLoader");
                    serviceFactory.showError($scope, error);
                }
            });
        };

        $scope.DataGridPlatform = new kendo.data.DataSource({
            data: null,
        });

        $scope.OptionsGridPlatform = {
            dataSource: $scope.DataGridPlatform,
            resizable: false,
            selectable: "row",
            columns: [{
                    field: "Platform",
                    title: "Platform",
                    template: function(e) {

                        return e.Platform + " " + e.PlatformVersion;
                    }
                },

            ],
            editable: false,
            dataBound: function(e) {
                debugger;
                var data = e.sender.dataSource.data();
                if (data.length != 0) {
                    e.sender.select("tr:eq(0)");
                }

            },
            edit: function(e) {
                $(e.container[0]).find('input').attr('aria-label', 'Enter Value');
            }
        };

        $scope.OnGridPlatformChange = function(data, dataItem, columns) {
            debugger;

            var platformKey = data["Platform"] + data["PlatformVersion"];
            var arrayOfDevices = objectOfDevice[platformKey];
            $scope.DataGridMobileDevice.data([]);
            $scope.DataGridMobileDevice.data(arrayOfDevices);

        }

        $scope.DataGridMobileDevice = new kendo.data.DataSource({
            data: null,
        });

        $scope.OptionsGridMobileDevice = {
            dataSource: $scope.DataGridMobileDevice,
            resizable: false,
            selectable: "row",
            columns: [{
                    field: "MobileDevice_Name",
                    title: "Mobile Name",
                    template: function(e) {

                        var checked = '';

                        if (selectedDeviceVersion.hasOwnProperty(e.MobileDevice_ID)) {
                            checked = 'checked="checked"'
                        }

                        var html = '';
                        html = html + '<input id="chkDevice_' + e.MobileDevice_ID + '"  class="selectMobileDevice" data-deviceId="' + e.MobileDevice_ID + '" ' + checked + ' type="checkbox">&nbsp;&nbsp;' + fakingAngularCharacter(e.MobileDevice_Name);
                        return html;
                    }
                },

            ],
            dataBound: function(e) {
                debugger;

                // $(".selectMobileDevice").unbind().bind("click", function() {
                    // bind and unbind are depricated
                    
                $(".selectMobileDevice").off("click").on("click", function () {
                    debugger;
                    var checkedState = this.checked;

                    var mobileDeviceId = $(this).attr("data-deviceId")

                    var selectedTr = $(this).closest("tr");
                    var selectedRowData = formControlFactory.GetKendoGridRowDataByTr("divGridMobileDevice", selectedTr);
                    selectedRowData.IsSelected = checkedState;

                    if (checkedState) {
                        if (!selectedDeviceVersion.hasOwnProperty(mobileDeviceId)) {
                            selectedDeviceVersion[mobileDeviceId] = selectedRowData;
                        }
                    } else {
                        delete selectedDeviceVersion[mobileDeviceId];
                    }
                });
                

            },
            edit: function(e) {
                $(e.container[0]).find('input').attr('aria-label', 'Enter Value');
            }
        };

        function browserSubCategoryColumn(browserData) {
            debugger;
            var arrayOfBrowserColumn = [];

            var tempObject = new Object();

            browserGuids = [];
            $.each(browserData, function(ind, obj) {

                debugger;

                if (ind !== "Total") {
                    var objectColumn = new Object();
                    objectColumn["field"] = ind;
                    objectColumn["title"] = obj.Name;
                    objectColumn["template"] = function(e) {
                        debugger;


                        var html = '';

                        var versionId = e[ind];

                        if (versionId !== "") {
                            var obj_browser_verion = objectOfDeviceVersion[versionId];

                            var checked = '';

                            if ($scope.selectedBrowserVersion.hasOwnProperty(obj_browser_verion.Browser_Version_ID)) {
                                checked = 'checked="checked"'
                            }


                            html = html + '<div id="div_browserPanel" style="display:flex; justify-content: space-around;">';
                            html = html + '<div style="width: 45px;">';
                            html = html + '<div class="reboot-margin-bottom-sm text-center" > <b>Browser Version</b></div > ';
                            html = html + '<div style="display: flex;"><input aria-label="Select Browser"  id = "chkBrowser_' + versionId + '" class="selectVersion" ' + checked + ' data-browserId="' + versionId + '" type = "checkbox" >&nbsp;&nbsp;<div title="' + obj_browser_verion.Browser_Version + ' ">' + stringCutter(obj_browser_verion.Browser_Version, 5) + '</div></div>';
                            html = html + '</div>';

                            //var SeperateResoution = getSpecificResolutionList(obj_browser_verion.SupportedResolutions);
                            //console.log("SeperateResoution", SeperateResoution);
                            // lets check oif browser with verion  have any resolution 


                            if (obj_browser_verion.SupportedMachineResolutions.length === 0) {
                                obj_browser_verion.SupportedMachineResolutions.push("1024x768");
                            }


                            if (obj_browser_verion.SupportedMachineResolutions.length > 0) {
                                //  console.log("obj_browser_verion.SupportedResolutions", obj_browser_verion.SupportedResolutions);
                                var ddlResolutionID = 'ddlResolution_' + versionId;
                                var ddlResolutionID2 = 'ddlviewport_' + versionId;

                                html = html + '<div style="width: 65px;">';
                                html = html + '<div class="reboot-margin-bottom-xs text-center"><b>System Resolution</b></div> <div id="' + ddlResolutionID2 + '" data_versionId="' + versionId + '" ></div>';
                                html = html + '</div>';

                                html = html + '<div style="width: 65px;">';
                                html = html + '<div class="reboot-margin-bottom-xs text-center"><b>Browser Viewport</b></div> <div id="' + ddlResolutionID + '" data_versionId="' + versionId + '" ></div>';
                                //html = html + '<div class="reboot-margin-bottom-xs"><b>Select Resolution</b></div > <div><select class="form-control input-sm resolution_selection" id="' + ddlResolutionID + '" data_versionId="' + versionId + '" style="width: 75px;height: 15px !important; padding: 2px 12px !important;" > </div>';
                                html = html + '</div>';

                                html = html + '</div>';
                                // html = html + '<option>Select</option>'
                                setTimeout(function() {
                                    create_dropdown_resolution(ddlResolutionID, obj_browser_verion.SupportedBrowserViewPorts);
                                    create_dropdown_viewport(ddlResolutionID2, obj_browser_verion.SupportedMachineResolutions);
                                }, 500);
                                //$.each(obj_browser_verion.SupportedMachineResolutions, function (ind, obj) {
                                //    if (object_browser_version_resolution.hasOwnProperty(versionId)) {
                                //        if (obj.Name === object_browser_version_resolution[versionId].Name) {
                                //            setTimeout(function () {
                                //                var dropdownlist = $("#" + ddlResolutionID).data("kendoDropDownList");
                                //                dropdownlist.search(object_browser_version_resolution[versionId].Name);
                                //            }, 500);
                                //        }
                                //    }
                                //});

                                //    html = html + '<option value="' + obj + '" ' + selected_dropdown + '>' + obj + '</option>';





                                // html = html + '</select>'



                            }





                        }
                        return html;
                    };
                    objectColumn["headerTemplate"] = function(e) {

                        var browsername = obj.Name

                        var html = '';

                        var browserSprite = "mbspriteB chrome";

                        if (browsername.toLowerCase().indexOf("chrome") != -1) {
                            browsername = "Google Chrome";
                            browserSprite = "mbspriteB chrome";
                        } else if (browsername.toLowerCase().indexOf("internet") != -1) {
                            browsername = "Internet Explorer";
                            browserSprite = "mbspriteB ie";
                        } else if (browsername.toLowerCase().indexOf("firefox") != -1) {
                            browsername = "Mozilla Firefox";
                            browserSprite = "mbspriteB firefox";
                        } else if (browsername.toLowerCase().indexOf("safari") != -1) {
                            browsername = "Safari";
                            browserSprite = "mbspriteB safari";
                        } else if (browsername.toLowerCase().indexOf("msedge") != -1) {
                            browsername = "Microsoft Edge";
                            browserSprite = "mbspriteB msedge";
                        } else if (browsername.toLowerCase().indexOf("ie") != -1) {
                            browsername = "Internet Explorer";
                            browserSprite = "mbspriteB ie";
                        } else if (browsername.toLowerCase().indexOf("mozilla") != -1) {
                            browsername = "Mozilla Firefox";
                            browserSprite = "mbspriteB firefox";
                        }

                        html = html + '<div data-item="' + browsername + '" class="' + browserSprite + '"></div><div class="BrowserName" data-item="' + browsername + '" >' + browsername + '</div>';


                        return html;


                    }



                    arrayOfBrowserColumn.push(objectColumn);
                    browserGuids.push(ind);
                    tempObject[ind] = "";
                }

            });


            objectBrowserAttribute = JSON.stringify(tempObject);

            return arrayOfBrowserColumn;
        }

        function create_dropdown_resolution(id, data) {
            $("#" + id).kendoDropDownList({
                dataTextField: "Name",
                dataValueField: "Name",
                groupTemplate: "Group: #: data #",
                optionLabel: "-- Select --",
                template: '<span title = "#: Name #">#: Name #</span>',
                valueTemplate: '<span title = "#: Name #">#: Name #</span>',
                dataSource: {
                    data: data,
                    group: { field: "Type" }
                },
                select: function(e) {
                    debugger
                    var dataItem = e.dataItem;

                    var browser_version_id = e.sender.element.attr("data_versionId");

                    if (dataItem.Name === "") {
                        delete object_browser_version_resolution[browser_version_id];
                    } else {
                        object_browser_version_resolution[browser_version_id] = dataItem;
                    }
                    loadWindow_Summary();
                }

            });
        }


        function create_dropdown_viewport(id, data) {
            $("#" + id).kendoDropDownList({
                dataTextField: "Name",
                dataValueField: "Name",
                groupTemplate: "Group: #: data #",
                optionLabel: "-- Select --",
                template: '<span title = "#: Name #">#: Name #</span>',
                valueTemplate: '<span title = "#: Name #">#: Name #</span>',
                dataSource: {
                    data: data,
                    group: { field: "Type" }
                },
                select: function(e) {
                    debugger
                    var dataItem = e.dataItem;

                    var browser_version_id = e.sender.element.attr("data_versionId");

                    if (dataItem.Name === "") {
                        delete object_browser_version_viewport[browser_version_id];
                    } else {
                        object_browser_version_viewport[browser_version_id] = dataItem;
                    }
                    loadWindow_Summary();
                }

            });
        }


        function browserSubCategoryData(browserData) {
            debugger;

            var arrayOfGridData = [];

            for (var i = 0; i <= browserData.Total; i++) {

                var objectRow = new Object();
                objectRow = JSON.parse(objectBrowserAttribute);


                $.each(browserGuids, function(ind, obj) {

                    if (selectedOperatingSystem[obj] !== undefined) {
                        if (selectedOperatingSystem[obj].Versions[i] !== undefined) {
                            objectRow[obj] = selectedOperatingSystem[obj].Versions[i];
                        } else {
                            objectRow[obj] = "";
                        }
                    } else {
                        objectRow[obj] = "";
                    }

                });
                arrayOfGridData.push(objectRow);

            }
            return arrayOfGridData;
        }
        $scope.ReloadGrid = function() {
            debugger;
            if (selectedExecutionMode === EnumExecutionMode.Web) {
                GetBrowserCombinations();
            } else {
                GetMobileCombinations();

            }
        }
        $scope.DataGridSessionSummary = new kendo.data.DataSource({
            data: null,
        });

        $scope.OptionsGridSessionSummary = {
            dataSource: $scope.DataGridSessionSummary,
            resizable: false,
            selectable: "row",
            columns: [
                { field: "SessionName", title: "Test" },
                { field: "Category", title: "Platform" },
                { field: "SubCategory", title: "Browser/Device", width: "150px", },
                { field: "Resolution", title: "SystemResolution", width: "100px", headerTemplate: '<span title="SystemResolution">SystemResolution</span>', template: function(e) { debugger; if (e.Resolution != undefined && e.Resolution != '') { return e.Resolution.Name } else { return 'NA' } } },
                { field: "ViewPort", title: "BrowserViewport", width: "100px", headerTemplate: '<span title="BrowserViewport">BrowserViewport</span>', template: function(e) { debugger; if (e.ViewPort != undefined && e.ViewPort != '') { return e.ViewPort.Name } else { return 'NA' } } },
            ],
            editable: false,
            dataBound: function(e) {
                debugger;

            },
            edit: function(e) {
                $(e.container[0]).find('input').attr('aria-label', 'Enter Value');
            }
        };




        //follow me area starts
        var followMeBackgroundPage = chrome.extension.getBackgroundPage();
        var allSelectedBrowserArray = [];
        var globalAuthCredential;
        var globalsessionId;
        var globalroutingkey;
        var queueBrowserInstances = [];

        var pluginName = ""
        var browserUrl = "";

        $scope.CreatefollowMeOperation = function() {
            loadingStart("body", "Starting FollowMe. Please Wait ...", ".btnTestLoader");
            allSelectedBrowserArray = [];
            queueBrowserInstances = [];
            var FollowMeModalData=dataFactory.FollowMeModalData;
            console.log('FollowMeModalData',FollowMeModalData);
            if ($.isEmptyObject($scope.selectedBrowserVersion)) {
                serviceFactory.notifier($scope, 'Please select atleast one browser', 'error');
                return false;
            }
            if ($('#txtURL').val() == empty) {
                serviceFactory.notifier($scope, 'Please provide url', 'error');
                return false;
            }
            var objectExecution = new Object();
            var arrayOfBrowsers = [];

            $.each($scope.selectedBrowserVersion, function(ind, obj) {
                debugger;
                var selected_browser_binding = obj;
                var Custom_ResolutionObj = {};
                if (object_browser_version_resolution.hasOwnProperty(selected_browser_binding.Browser_Version_ID)) {
                    Custom_ResolutionObj["BrowserViewPort"] = object_browser_version_resolution[selected_browser_binding.Browser_Version_ID];
                }

                if (object_browser_version_viewport.hasOwnProperty(selected_browser_binding.Browser_Version_ID)) {
                    Custom_ResolutionObj["MachineResolution"] = object_browser_version_viewport[selected_browser_binding.Browser_Version_ID];
                }
                obj['SelectedResolutions'] = Custom_ResolutionObj;

                obj["BrowserProvider"] = "BrowserCloudOfPCloudy";



                arrayOfBrowsers.push(selected_browser_binding);
                objectExecution["Browsers"] = arrayOfBrowsers;
                objectExecution["BuildName"] = $('#ddlBuilds').val();
                objectExecution["BatchName"] = $("#txtSessionName").val();
                objectExecution["URL"] = $('#txtURL').val();
                objectExecution["browserCloudCredentials"] = dataFactory.Response_pcloudy_credentials;

                var authCredential = objectExecution["browserCloudCredentials"];
                var selectedBrowsersArray = objectExecution["Browsers"];
                var sessionId = $scope.getSessionId();
                var routingKey = $scope.getRoutingKey();

                allSelectedBrowserArray = selectedBrowsersArray;
                globalAuthCredential = authCredential;
                globalsessionId = sessionId;
                globalroutingkey = routingKey;
                browserUrl = FollowMeModalData.App_Url;
                pluginName = FollowMeModalData.Plugin_name;
                selectedBrowsersArray.forEach((selectedBrowser) => {
                    $scope.setRoutingInfo(authCredential["browserCloudRelayServer"], routingKey)
                    $scope.getPreferredBrowser(sessionId, routingKey, selectedBrowser, authCredential);
                });

                var intervalId = window.setInterval(function() {
                    console.log("Intance Length " + allSelectedBrowserArray.length + "  " + queueBrowserInstances.length)
                    if (allSelectedBrowserArray.length == queueBrowserInstances.length) {
                        window.clearInterval(intervalId);
                        window.setTimeout(function() {
                            $scope.ModalOperationfollowMeOperation();
                            $scope.startFollowMe(browserUrl, pluginName);
                            loadingStop("body", ".btnTestLoader");
                        }, 10000);
                    }
                }, 1000)
            });
        }

        $scope.getSessionId = function() {
            return "FollowMeSession_" + $scope.generateRandomGuid();
        };

        $scope.getRoutingKey = function() {
            return "FollowMeAgentRoutingKey_" + $scope.generateRandomGuid();
        };

        $scope.generateRandomGuid = function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };


        $scope.getOpKeyInstanceUrl = function() {
            return localStorage.getItem("OPKEY_DOMAIN_NAME");
        };

        $scope.bookBrowser = function(sessionId, routingKey, selectedBrowserObject, authCredential) {
            var opkeyUrl = $scope.getOpKeyInstanceUrl();
            $.ajax({
                url: opkeyUrl + "/BrowserCloud/BookBrowser",
                type: "POST",
                data: {
                    "browserCloudRelayServer": authCredential["browserCloudRelayServer"],
                    "browserCloudAuthToken": authCredential["AuthToken"],
                    "instance_id": selectedBrowserObject["instance_id"],
                    "OSName": selectedBrowserObject["OS_Name"],
                    "OSVersion": selectedBrowserObject["OS_Version"],
                    "browserName": selectedBrowserObject["Browser_Name"],
                    "browserVersion": selectedBrowserObject["Browser_Version"],
                    "browserArchitecture": "",
                    "userEmail": authCredential["userEmail"],
                    "session_type": "opkey",
                    "session_name": sessionId
                },
                success: function(result) {
                    $scope.initializeFollowMeAgent(sessionId, routingKey, selectedBrowserObject, authCredential);
                },
                error: function(error) {
                    $scope.releaseBrowser(sessionId, routingKey, selectedBrowserObject, authCredential);
                }
            });
        };


        $scope.getPreferredBrowser = function(sessionId, routingKey, selectedBrowserObject, authCredential, width, height) {
            var opkeyUrl = $scope.getOpKeyInstanceUrl();
            $.ajax({
                url: opkeyUrl + "/BrowserCloud/getPreferredBrowser",
                type: "POST",
                data: {
                    browserCloudRelayServer: authCredential["browserCloudRelayServer"],
                    browserCloudAuthToken: authCredential["AuthToken"],
                    OS_Name: selectedBrowserObject["OS_Name"],
                    OS_Version: selectedBrowserObject["OS_Version"],
                    BrowserName: selectedBrowserObject["Browser_Name"],
                    BrowserVersion: selectedBrowserObject["Browser_Version"]
                },
                success: function(result) {
                    selectedBrowserObject["instance_id"] = result["instance_id"];
                    $scope.bookBrowser(sessionId, routingKey, selectedBrowserObject, authCredential);
                },
                error: function(error) {
                    $scope.releaseBrowser(sessionId, routingKey, selectedBrowserObject, authCredential);
                }
            });
        };

        $scope.setMachineResolution = function(sessionId, routingKey, selectedBrowserObject, authCredential, width, height) {
            var opkeyUrl = $scope.getOpKeyInstanceUrl();
            $.ajax({
                url: opkeyUrl + "/BrowserCloud/setResolution",
                type: "POST",
                data: {
                    "browserCloudRelayServer": authCredential["browserCloudRelayServer"],
                    "browserCloudAuthToken": authCredential["AuthToken"],
                    "instance_id": selectedBrowserObject["instance_id"],
                    "userEmail": authCredential["userEmail"],
                    "width": width,
                    "height": height
                },
                success: function(result) {
                    $scope.initializeFollowMeAgent(sessionId, routingKey, selectedBrowserObject, authCredential);
                },
                error: function(error) {
                    $scope.releaseBrowser(sessionId, routingKey, selectedBrowserObject, authCredential);
                }
            });
        };

        $scope.initializeFollowMeAgent = function(sessionId, routingKey, selectedBrowserObject, authCredential) {
            var opkeyUrl = $scope.getOpKeyInstanceUrl();
            $.ajax({
                url: opkeyUrl + "/BrowserCloud/initiateFollowMeAgent",
                type: "POST",
                data: {
                    "browserCloudRelayServer": authCredential["browserCloudRelayServer"],
                    "browserCloudAuthToken": authCredential["AuthToken"],
                    "instance_id": selectedBrowserObject["instance_id"],
                    "userEmail": authCredential["userEmail"],
                    "FollowMe_HubUrl": authCredential["browserCloudRelayServer"] + "/followMe",
                    "FollowMe_SessionId": sessionId,
                    "FollowMe_RoutingKey": routingKey,
                    "FollowMe_PluginName": pluginName,
                    "FollowMe_BrowserName": "Chrome",
                    "FollowMe_BrowserUrl": browserUrl,
                    "FollowMe_BrowserResolution": ""
                },
                success: function(result) {
                    $scope.initiateScreenSharing(sessionId, routingKey, selectedBrowserObject, authCredential);
                },
                error: function(error) {
                    $scope.releaseBrowser(sessionId, routingKey, selectedBrowserObject, authCredential);
                }
            });
        };

        $scope.initiateScreenSharing = function(sessionId, routingKey, selectedBrowserObject, authCredential) {
            var opkeyUrl = $scope.getOpKeyInstanceUrl();
            $.ajax({
                url: opkeyUrl + "/BrowserCloud/initiateScreenSharing",
                type: "POST",
                data: {
                    "browserCloudRelayServer": authCredential["browserCloudRelayServer"],
                    "browserCloudAuthToken": authCredential["AuthToken"],
                    "instance_id": selectedBrowserObject["instance_id"],
                    "userEmail": authCredential["userEmail"]
                },
                success: function(result) {
                    console.log(result)
                    $scope.addBrowserInQueue(selectedBrowserObject);
                },
                error: function(error) {
                    $scope.releaseBrowser(sessionId, routingKey, selectedBrowserObject, authCredential);
                }
            });
        };

        $scope.releaseBrowser = function(sessionId, selectedBrowserObject, authCredential) {
            var opkeyUrl = $scope.getOpKeyInstanceUrl();
            $.ajax({
                url: opkeyUrl + "/BrowserCloud/releaseBrowser",
                type: "POST",
                data: {
                    "browserCloudRelayServer": authCredential["browserCloudRelayServer"],
                    "browserCloudAuthToken": authCredential["AuthToken"],
                    "instance_id": selectedBrowserObject["instance_id"]
                },
                success: function(result) {
                    $scope.addBrowserInQueue(selectedBrowserObject);
                },
                error: function(error) {
                    $scope.addBrowserInQueue(selectedBrowserObject);
                }
            });
        };


        var recorderStepsFetcherThread = -1;
        var recorderStepsSenderThread = -1;
        var queue_followmesteps = [];
        $scope.startFollowMe = function(startUrl, recorderName) {
            $scope.stopFetchingRecordedSteps();
            $scope.stopSendingRecordedSteps();

            followMeBackgroundPage.startFollowMeAddonRecorder(startUrl, recorderName);
            openFollowMeBrowser(startUrl);
            // $scope.launchPluginInBookedBrowser(recorderName);
            $scope.startFetchingRecordedSteps();
            $scope.startSendingRecordedSteps();
        };

        $scope.stopFollowMe = function() {
            loadingStart("body", "Stopping FollowMe. Please Wait ...", ".btnTestLoader");
            $scope.stopFetchingRecordedSteps();
            $scope.stopSendingRecordedSteps();
            closeFollowMeBrowser();
            followMeBackgroundPage.stopFollowMeAddonRecorder();
            allSelectedBrowserArray.forEach((selectedBrowser) => {
                $scope.releaseBrowser(globalsessionId, selectedBrowser, globalAuthCredential);
            });
            window.setTimeout(function(){
                loadingStop("body", ".btnTestLoader");
            },2000);
        };



        $scope.startFetchingRecordedSteps = function() {
            recorderStepsFetcherThread = window.setInterval(function() {
                var response = getRecordedStepsofPcloudyFollowMe();
                if (response.length > 0) {
                    var convertedResponseArray = $scope.ConvertDataToOpKeyLiteAgentFormat(response);
                    convertedResponseArray.forEach((response) => {
                        queue_followmesteps.push(response);
                    })
                }
            }, 500);
        };

        $scope.startSendingRecordedSteps = function() {
            recorderStepsSenderThread = window.setInterval(function() {
                if (queue_followmesteps.length > 0) {
                    var recordedstep = queue_followmesteps.shift();
                    $scope.sendFunctionCallToBookedBrowser([recordedstep]);
                }
            }, 500);
        };


        $scope.stopFetchingRecordedSteps = function() {
            if (recorderStepsFetcherThread == -1) {
                return;
            }
            window.clearInterval(recorderStepsFetcherThread);
        };

        $scope.stopSendingRecordedSteps = function() {
            if (recorderStepsSenderThread == -1) {
                return;
            }
            window.clearInterval(recorderStepsSenderThread);
        };

        $scope.setRoutingInfo = function(relayServerUrl, routingKey) {
            followMeBackgroundPage.setRoutingInfo(relayServerUrl, routingKey);
        }

        $scope.launchPluginInBookedBrowser = function(pluginName) {
            followMeBackgroundPage.launchPluginInBookedBrowser(pluginName);
        };

        $scope.sendFunctionCallToBookedBrowser = function(functionCall) {
            followMeBackgroundPage.SendFunctionCallToBookedBrowser(JSON.stringify(functionCall));
        };

        $scope.addBrowserInQueue = function(selectedBrowser) {
            queueBrowserInstances.push(selectedBrowser);
        };
        $scope.ConvertDataToOpKeyLiteAgentFormat = function(recorded_data) {
            var all_recorded_data = recorded_data;
            var all_datas = [];
            for (var i = 0; i < all_recorded_data.length; i++) {
                var object_attribute_array = new Array();
                var parent_attribute_array = new Array();
                var step_data = all_recorded_data[i];
                if (step_data != "") {
                    var action_name = step_data["Action"];
                    var logical_name = step_data["Object"];
                    var data_args = step_data["Data"];
                    var object_data = step_data["ObjectData"];
                    logical_name = logical_name.replace(/\n/g, "").replace(/\t/g, "").replace(/  /g, "");
                    var parent_object_data = object_data["parent"];
                    if (action_name.indexOf("TypeSecureText") > -1) {
                        data_args = object_data["unencryptedData"];
                    }
                    $.each(object_data, function(k, v) {
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
                                object_attribute_array.push({ "Name": k, "Value": "", "DataType": "Image" });
                            }
                        } else if (k == "ObjectImage") {
                            if (v != null) {
                                v = v.replace("data:image/png;base64,", "");
                                object_attribute_array.push({ "Name": k, "Value": "", "DataType": "Image" });
                            }
                        } else {
                            if (v != null) {
                                object_attribute_array.push({ "Name": k, "Value": v.toString(), "DataType": "String" });
                            }
                        }
                    });

                    $.each(parent_object_data, function(k, v) {
                        if (v == "") {
                            v = null;
                        }
                        if (v != null) {
                            parent_attribute_array.push({ "Name": k, "Value": v.toString(), "DataType": "String" });
                        }
                    });

                    var validdatas = [];
                    if (data_args!=null && data_args != "") {
                        if (data_args.indexOf("{") == 0) {
                            var parsed_dataarray = JSON.parse(data_args);
                            $.each(parsed_dataarray, function(key, value) {
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
                        var out_data = { "action": action_name, "logicalname": logical_name, "objectProperties": object_attribute_array, "parentProperties": parent_attribute_array, "dataArgs": argumentdata };
                        all_datas.push(out_data);
                    } else {
                        var out_data = { "action": action_name, "logicalname": logical_name, "objectProperties": object_attribute_array, "parentProperties": parent_attribute_array, "dataArgs": [data_args] };
                        all_datas.push(out_data);
                    }
                }
            }
            return all_datas;
        };

        // Region stop follow me actions..
        $scope.stopFollowMeOperation = function() {

            $scope.stopFollowMe();
        }

        $scope.ModalfollowMeOperation = function() {
            if ($.isEmptyObject($scope.selectedBrowserVersion)) {
                serviceFactory.notifier($scope, 'Please select atleast one browser', 'error');
                return false;
            }
            $scope.Modal_Instance_CreateFollowMe = $kWindow.open({
                options: {


                    width: "400px",
                    height: "300px",
                    close: function() {},
                    open: function() {},
                    resizable: false,
                    draggable: false,
                    closeOnEscape: true,
                    modal: true,
                    close: function() {},
                    open: function() {},
                    visible: false,
                    title: "Create Follow Me",

                },
                templateUrl: 'views/cloud/_modal_create_followme.html',
                controller: 'modal_create_followme_ctrl'
            });
        }

        $scope.ModalOperationfollowMeOperation = function() {

            $scope.Modal_Instance_OperationFollowMe = $kWindow.open({
                options: {


                    width: "500px",
                    height: "450px",
                    close: function() {},
                    open: function() {},
                    resizable: false,
                    draggable: false,
                    closeOnEscape: true,
                    modal: true,
                    close: function() {},
                    open: function() {},
                    visible: false,
                    title: "Follow Me",

                },
                templateUrl: 'views/cloud/_modal_operation_followme.html',
                controller: 'modal_operation_followme_ctrl'
            });
        }
    }
]);