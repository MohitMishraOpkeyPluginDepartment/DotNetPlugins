angular.module("myApp").controller("advanced_settings_ctrl", [
  "$rootScope",
  "$scope",
  "ServiceFactory",
  "DataFactory",
  "FormControlFactory",
  function (
    $rootScope,
    $scope,
    serviceFactory,
    dataFactory,
    formControlFactory
  ) {
    var opkey_end_point =
      $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

    var localTagData = new Object();

    var runTimeGVChanges = {};

    $scope.OnModalLoad = function () {
      debugger;
      serviceFactory.LoadDataWhenAngularViewLoaded(
        "div_modal_advaned_settings",
        OnModalLoad
      );
    };

    var localTagData = new Object();

    var rowUid;

    var stepSnapshot = "NoStep";
    var stepSnapshotQuality = "Medium";
    var stepTimeout = 90;
    var reportStatus = "DontSend";

    var allApplicationLocalExecutionArray = [];
    var allRegisterdDevicesLocalExecutionArray = [];
    var tempGridTagData = [];
    var tempGridGlobalVariableData = [];
    var tempIsExternalTestManagementToolMapped = false;

    var allAttachment = [];

    function adjustDropDownWidth(e) {
      var listContainer = e.sender.list.closest(".k-list-container");
      listContainer.width("300");
      //  listContainer.width(listContainer.width() + kendo.support.scrollbar());
    }

    function OnModalLoad() {
      $("#divGridGlobalVariable .k-grid-content").attr("tabindex", "0");

      $("#ContineuOnErrorAll").kendoDropDownList();

      $('[data-bs-toggle="popover"]').popover();

      BindTabClickOperation();
      bindDataBySettingType();
      createDropdownForAgent();
      $scope.GetAllAgents();
    }

    function bindDataBySettingType() {
      debugger;
      if (
        dataFactory.TempDataOfExecutionSessionSettings === null ||
        dataFactory.TempDataOfExecutionSessionSettings == {}
      ) {
        // Get Data From DataBase
        getSessionDataFromDb();
      } else {
        var savedDefaultData = dataFactory.TempDataOfExecutionSessionSettings;
        setSessionValues(savedDefaultData);
        bindSliderElements();
      }

      // Make below function CommonchkUpdateMappedTest

      GetAllApplication();

      GetAllRegisterdDevice();

      if (
        dataFactory.TempDataOfExecutionGlobalSettings == null ||
        dataFactory.TempDataOfExecutionGlobalSettings.length === 0
      ) {
        $scope.getGlobalvariableData();
      } else {
        tempGridGlobalVariableData =
          dataFactory.TempDataOfExecutionGlobalSettings;
        $scope.GlobalVariableDataSource.data(
          dataFactory.TempDataOfExecutionGlobalSettings
        );
      }
      if (
        dataFactory.TempDataOfExecutionTagSettings === null ||
        dataFactory.TempDataOfExecutionTagSettings.length == 0
      ) {
      } else {
        tempGridTagData = dataFactory.TempDataOfExecutionTagSettings;
        $scope.GridTagData.data(dataFactory.TempDataOfExecutionTagSettings);
      }
    }

    $scope.getGlobalvariableData = function () {
      $scope.GlobalVariableDataSource.read();
      //var setSelectedGv = [];

      //loadingStart("#CommonLocalExecutionID", "Please Wait ...", ".btnTestLoader");
      //$.ajax({
      //    url: opkey_end_point + "/GlobalVariable/getAllGlobalVariables",
      //    type: "Get",
      //    success: function (res) {
      //        loadingStop("#CommonLocalExecutionID", ".btnTestLoader");
      //        for (var i = 0; i < res.length; i++) {
      //            if (res[i].ExternallyUpdatable === true) {
      //                setSelectedGv.push(res[i]);
      //            }
      //        }
      //        //GetAllData.GlobalVariables = setSelectedGv;
      //        tempGridGlobalVariableData = setSelectedGv;
      //        $scope.GlobalVariableDataSource.data(setSelectedGv);
      //    },
      //    error: function (error) {
      //        loadingStop("#CommonLocalExecutionID", ".btnTestLoader");
      //        serviceFactory.showError($scope, error);
      //    }
      //});
    };

    function GetAllApplication() {
      $.ajax({
        url: opkey_end_point + "/Mobile/GetMobileApplications",
        method: "Post",
        success: function (result) {
          allApplicationLocalExecutionArray = result;
        },
        error: function (error) {
          serviceFactory.showError($scope, error);
        },
      });
    }

    function GetAllRegisterdDevice() {
      $.ajax({
        url: opkey_end_point + "/MobileDevice/GetAllRegisterDevices",
        method: "Post",
        success: function (result) {
          allRegisterdDevicesLocalExecutionArray = result;
        },
        error: function (error) {
          serviceFactory.showError($scope, error);
        },
      });
    }

    function bindSliderElements() {
      debugger;
      //var stepSnapshot = "NoStep";
      //var stepSnapshotQuality = "Medium";
      //var stepTimeout = 90;
      //var reportStatus = "DontSend";

      var valueSnapShot = 0;
      var valueSnapShotQuality = 0;
      var valueReport = 0;

      if (stepSnapshot === "NoStep") {
        valueSnapShot = 0;
      } else if (stepSnapshot === "FailedSteps") {
        valueSnapShot = 1;
      } else {
        valueSnapShot = 2;
      }

      $("#txtStepSnapshot").kendoSlider({
        orientation: "vertical",
        min: 0,
        max: 2,
        value: valueSnapShot,
        change: function (e) {
          debugger;
          if (e.value == 0) {
            stepSnapshot = "NoStep";
          } else if (e.value == 1) {
            stepSnapshot = "FailedSteps";
          } else {
            stepSnapshot = "AllSteps";
          }
          removeUnUsedAttribute();
        },
      });

      if (stepSnapshotQuality === "Low") {
        valueSnapShotQuality = 0;
      } else if (stepSnapshotQuality === "Medium") {
        valueSnapShotQuality = 1;
      } else {
        valueSnapShotQuality = 2;
      }

      $("#txtStepQuality").kendoSlider({
        orientation: "vertical",
        min: 0,
        max: 2,
        value: valueSnapShotQuality,
        change: function (e) {
          debugger;
          if (e.value == 0) {
            stepSnapshotQuality = "Low";
          } else if (e.value == 1) {
            stepSnapshotQuality = "Medium";
          } else {
            stepSnapshotQuality = "High";
          }
          removeUnUsedAttribute();
        },
      });

      $("#txtStepTimeout").kendoSlider({
        orientation: "vertical",
        min: 5, //SAS-7296
        max: 300,
        value: stepTimeout,
        change: function (e) {
          debugger;
          stepTimeout = e.value;
          $("#txtInputStepTimeout").val(stepTimeout);
          if (stepTimeout < 5) {
            $("#btNextSelectionSlider").prop("disabled", true);
            $("#txtInputStepTimeout").val(stepTimeout);
          } else {
            $("#btNextSelectionSlider").prop("disabled", false);
            $("#txtInputStepTimeout").val(stepTimeout);
          }
          removeUnUsedAttribute();
        },
        slide: function (event, ui) {
          //for (var i = 0; i < ui.values.length; i++) {
          //    $("input.sliderValue[data-index=" + i + "]").val(ui.values[i]);
          //}
        },
      });
      $("#txtInputStepTimeout").val(stepTimeout);

      // binding Reports

      if (reportStatus === "DontSend") {
        valueReport = 0;
      } else if (reportStatus === "Failed") {
        valueReport = 1;
      } else if (reportStatus === "Summary") {
        valueReport = 2;
      } else if (reportStatus === "Detailed") {
        valueReport = 3;
      } else if (reportStatus === "OutlineReport") {
        valueReport = 4;
      } else {
        valueReport = 5;
      }

      $("#sendReport").kendoSlider({
        orientation: "vertical",
        min: 0,
        max: 5,
        value: valueReport,
        change: function (e) {
          debugger;
          if (e.value === 0) {
            reportStatus = "DontSend";
          } else if (e.value === 1) {
            reportStatus = "Failed";
          } else if (e.value === 2) {
            reportStatus = "Summary";
          } else if (e.value === 3) {
            reportStatus = "Detailed";
          } else if (e.value === 4) {
            reportStatus = "OutlineReport";
          } else {
            reportStatus = "IntegratedDataReport";
          }
          removeUnUsedAttribute();
        },
      });

      removeUnUsedAttribute();

      debugger;
      //if (dataFactory.TempDataOfSmtpSettings != null) {
      //    var res = dataFactory.TempDataOfSmtpSettings;
      //    if (res.port != "" || res.MailTo != "" || res.SenderEmailAddress != "" || res.smtpServer != "") {
      //        $('#sendReport').data("kendoSlider").enable(true);
      //    } else {
      //        $('#sendReport').data("kendoSlider").enable(false);
      //    }
      //} else {
      //    $('#sendReport').data("kendoSlider").enable(false);
      //}
      //  $("#chkEnableStepLogs").prop("checked", dataFactory.TempDataOfSmtpSettings.EnableStepLogs);
    }

    function removeUnUsedAttribute() {
      $("#table-example-1 .k-draghandle").removeAttr("role");
      $("#table-example-1 .k-draghandle").removeAttr("aria-valuemin");
      $("#table-example-1 .k-draghandle").removeAttr("aria-valuemax");
      $("#table-example-1 .k-draghandle").removeAttr("aria-valuenow");
      $("#table-example-1 .k-draghandle").removeAttr("aria-valuetext");
    }

    function BindTabClickOperation() {
      $(".anTabChooserExecutionAdvanceSettings").click(function () {
        debugger;
        if (
          $("#" + this.id)[0].className !==
          "btn  anTabChooserExecutionAdvanceSettings active"
        ) {
          if (this.id === "anTabGlobalVariable") {
            //get the scope of GV in Grid Execution
            var scope = angular
              .element(
                document.getElementById("divPanelSelectionGlobalVariable")
              )
              .scope();
            //clear search box text of RunTime GV on back button
            scope.btnSearch(
              "divGridGlobalVariable",
              "txtSearchGlobalVariableModelExecution"
            );
          }
        }

        $(".anTabChooserExecutionAdvanceSettings").removeClass("active");
        $(this).addClass("active");
        $(".panelTabExecutionAdvanceSettings").hide();
        if (this.id === "anTabSlider") {
          $("#divPanelSelectionSlider").show();
        } else if (this.id === "anTabTags") {
          $("#divPanelSelectionTags").show();
        } else if (this.id === "anTabOptionalAgent") {
          $("#divPanelSelectionOptionalAgent").show();
        } else {
          $("#divPanelSelectionGlobalVariable").show();
        }
      });
    }

    $scope.localSlider = function (event) {
      debugger;
      //validateFormSelectionSlider();
      if (event.keyCode == 37 || event.keyCode == 39) {
        //SAS 7319
        return;
      }
      stepTimeout = event.currentTarget.value;
      $("#txtStepTimeout").kendoSlider("value", parseInt(stepTimeout));
      if (parseInt(stepTimeout) < 5) {
        $("#btNextSelectionSlider").prop("disabled", true);
        $("#txtInputStepTimeout").val(stepTimeout);
        $("#spSliderError").show(); //SAS-7309
      } else {
        $("#btNextSelectionSlider").prop("disabled", false);
        $("#txtInputStepTimeout").val(stepTimeout);
        $("#spSliderError").hide(); //SAS-7309
      }
    };

    var serchBoxText = "";

    $scope.btnSearch = function (GlobalVariableId, txtBoxId) {
      //      $('#txtSearchGlobalVariable').toggle();
      debugger;
      if (document.getElementById(txtBoxId).value != "") {
        var searchitem = document.getElementById(txtBoxId).value;
        if (searchitem.length < 3) {
          serviceFactory.notifier(
            $scope,
            "At least provide three characters to search Global Variable",
            "error"
          );
          return false;
        }
        serchBoxText = searchitem;
        SearchGV(searchitem, GlobalVariableId, txtBoxId);
      }
    };
    $scope.btnSearchClear = function (GlobalVariableId, txtBoxId) {
      if (document.getElementById(txtBoxId).value != "") {
        var searchitem = (document.getElementById(txtBoxId).value = "");
        serchBoxText = searchitem;
        SearchGV(searchitem, GlobalVariableId, txtBoxId);
      }
    };

    function getSessionDataFromDb() {
      debugger;
      loadingStart(
        "#divModalBodyLocalExecution",
        "Please Wait ...",
        ".btnTestLoader"
      );
      $.ajax({
        url:
          opkey_end_point + "/Execution/getGridExecutionSessionDefaultSettings",
        type: "GET",
        success: function (result) {
          console.log("Execution Setting from database");
          console.log(result);
          setSessionValues(result);
          setTimeout(function () {
            bindSliderElements();
          }, 200);
          loadingStop("#divModalBodyLocalExecution", ".btnTestLoader");
        },
        error: function (error) {
          loadingStop("#divModalBodyLocalExecution", ".btnTestLoader");
          serviceFactory.showError($scope, error);
        },
      });
    }

    function setSessionValues(savedDefaultData) {
      debugger;
      console.log("Get Setting");
      console.log(savedDefaultData);
      console.log("----");
      stepSnapshot = savedDefaultData.SnapshotFrequency;
      stepSnapshotQuality = savedDefaultData.SnapshotQuality;
      stepTimeout = savedDefaultData.StepTimeOut;
      reportStatus = savedDefaultData.SendReportType;
      var boolTmt = savedDefaultData.IsExternalTestManagementToolMapped;
      var ContinueOnErrorVal = savedDefaultData.RunTimeAllContinueOnError;

      tempIsExternalTestManagementToolMapped =
        savedDefaultData.IsExternalTestManagementToolMapped;
      $("#txtInputStepTimeout").val(savedDefaultData.StepTimeOut);
      if (boolTmt) {
        //  $("#chkUpdateMappedTest").attr('disabled', '');
        //  $("#chkUpdateMappedTest").prop("disabled", false);
        // $("#chkUpdateMappedTest").attr("disabled", false);
      } else {
        $("#chkUpdateMappedTest").attr("disabled", "disabled");
        $("#chkUpdateMappedTest").attr("disabled", true);
        // $("#chkUpdateMappedTest").prop("disabled", true);
      }
      //  $("#chkUpdateMappedTest").prop("checked", savedDefaultData.ResultUpdateOnTMT);
      $("#chkIsHighlightObject").prop(
        "checked",
        savedDefaultData.HighlightObject
      );
      $("#chkIsLEWObjectVisibilityCheck").prop(
        "checked",
        savedDefaultData.ObjectVisibilityCheck
      );
      $("#chkIsIpDefaultValueWillBeUsedRandom").prop(
        "checked",
        savedDefaultData.IsIpDefaultValueWillBeUsedRandom
      );
      $("#chkApplySkipStepValidation").prop(
        "checked",
        savedDefaultData.ApplySkipStepValidation
      );
      $("#chkEnableStepLogs").prop("checked", savedDefaultData.EnableStepLogs);

      setTimeout(function () {
        var dropdownlist = $("#ContineuOnErrorAll").data("kendoDropDownList");
        dropdownlist.value(ContinueOnErrorVal);
      }, 100);

      //  $("#chkUpdateMappedOR").prop("checked", boolOr);

      if ($rootScope.IsExternalTestManagementToolMapped == true) {
        //SAS-6776
        //  $('#chkUpdateMappedTest').prop('disabled', false);
      } else {
        $("#chkUpdateMappedTest").prop("disabled", true);
      }

      // $("#chkUpdateMappedTest").removeAttr("disabled");
    }

    $scope.GlobalVariableDataSource = new kendo.data.DataSource({
      transport: {
        read: function (options) {
          debugger;
          var searchTextBoxTxt = $(
            "#txtSearchGlobalVariableModelExecution"
          ).val();
          if (searchTextBoxTxt == undefined || searchTextBoxTxt == "") {
            getAllLazyGlobalVariables(
              "divGridGlobalVariable",
              options,
              true,
              serviceFactory,
              $scope,
              trackPrevGridChanges
            );
          } else if (searchTextBoxTxt != "") {
            searchLazyGlobalVariable(
              "divGridGlobalVariable",
              options,
              searchTextBoxTxt,
              true,
              serviceFactory,
              $scope,
              trackPrevGridChanges
            );
          }
        },
      },
      schema: {
        data: "data",
        total: "total",
        model: {
          fields: {
            Position: { hidden: true, type: "number" },
            GV_ID: { type: "string", editable: false },
            Name: { type: "string", editable: false },
            DataType_ENUM: { type: "string", editable: false },
            Value: { type: "string" },
            ExternallyUpdatable: { type: "boolean", editable: false },
            DisplayValue: { type: "string" },
          },
        },
      },
      pageSize: 25,
      serverPaging: true,
      serverFiltering: true,
      group: { field: "Type" },
      sort: {
        field: "Position",
        dir: "asce",
        compare: function (a, b) {
          if (a.Type == "System_Defined") {
            return -1;
          }
        },
      },
      change: function (e) {
        debugger;
        if (e.action) {
          var dataItem = e.items[0];
          if (e.action == "itemchange") {
            // dataItem.DisplayValue = dataItem.Value;
            dataItem.Value = dataItem.Value;
            dataItem.DisplayValue = dataItem.DisplayValue;
            dataItem.isUpdated = true;
            if (dataItem.DataType_ENUM == "SecuredString") {
              if (dataItem.Value != "") {
                $scope.EncryptionDecryptGlobalVariableValue(
                  null,
                  dataItem,
                  "Encryption",
                  "GV",
                  "divGridGlobalVariable"
                );
              }
              dataItem.ShowDecryptedData = true;
              dataItem.Decrypt = true;
            }
            //var gvChangedData = $scope.GlobalVariableDataSource._data;
            //var gVdata = gvChangedData.toJSON();
            //tempGridGlobalVariableData = gVdata;
            runTimeGVChanges[dataItem.GV_ID] = dataItem;
          }
        }
      },
    });
    function trackPrevGridChanges(result) {
      for (var i = 0; i < result.length; i++) {
        var value = runTimeGVChanges[result[i].GV_ID];
        if (value != undefined) result[i] = value;
      }
    }
    $scope.EncryptionDecryptGlobalVariableValue = function (
      password,
      binding,
      type,
      callSource,
      griddivName
    ) {
      debugger;
      loadingStart("#" + griddivName, "Please Wait ...", ".btnTestLoader");
      var urlVal = "",
        data = null;
      var selectedRowData = null;
      var gridInst = $("#" + griddivName).data("kendoGrid");
      var selectedGrid = gridInst.select();
      selectedRowData = gridInst.dataItem(selectedGrid);
      if (type == "Encryption") {
        urlVal = opkey_end_point + "/GlobalVariable/EncrptGlobalVariableValue";
        data = { gvBinding: JSON.stringify(binding) };
      } else {
        urlVal = opkey_end_point + "/GlobalVariable/DecryptGlobalVariableValue";
        data = { Password: password, gvBinding: JSON.stringify(binding) };
      }
      $.ajax({
        url: urlVal,
        type: "Post",
        data: data,
        success: function (res) {
          debugger;
          loadingStop("#" + griddivName, ".btnTestLoader");
          if (callSource == "GV") {
            if (type == "Decryption") {
              gridInst.dataItem(selectedGrid).Value = res.Value;
              gridInst.dataItem(selectedGrid).DisplayValue = res.DisplayValue;
              gridInst.dataItem(selectedGrid).ShowDecryptedData = true;
              var dataInputCol = $("#divGridGlobalVariable table tr.k-state-selected td:eq(7)");
              let tempHtml =
                '<span class="Encryption_Password" title="' +
                fakingAngularCharacter(res.Value) +
                '">' +
                fakingAngularCharacter(res.Value) +
                "</span>"; //<button id = "btnEnc-' + selectedRowData.GV_ID + '" title="Encrypt Value" class="Decrypt_Value btn btn-default btn-sm fa fa-eye-slash"></button> ;
              // $rootScope.ModalScope.ModalEncryption.close(false);
              let safeHtml = DOMPurify.sanitize(tempHtml);
              dataInputCol[0].innerHTML = safeHtml;
            } else {
              gridInst.dataItem(selectedGrid).Value = fakingAngularCharacter(
                res.Value
              );
              gridInst.dataItem(selectedGrid).DisplayValue =
                fakingAngularCharacter(res.DisplayValue);
              $("#inpt-" + selectedRowData.GV_ID).prop("readonly", true);
              gridInst.dataItem(selectedGrid).ShowDecryptedData = false;
              if (binding.DataType_ENUM == "SecuredString") {
                gridInst.refresh();
              }
            }
          }
        },
        error: function (error) {
          loadingStop("#" + griddivName, ".btnTestLoader");
          serviceFactory.showError($scope, error);
        },
      });
    };
    function getAllLazyGlobalVariables(
      elementID,
      options,
      isExternallyUpdatable,
      serviceFactory,
      $scope,
      callBack
    ) {
      debugger;
      $.ajax({
        url: opkey_end_point + "/CommonUcs/getAllLazyGlobalVariables",
        type: "get",
        data: {
          pageNum: options.data.page,
          pageSize: options.data.pageSize,
          isExternallyUpdatable: isExternallyUpdatable,
        },
        success: function (result) {
          if (callBack != undefined) {
            callBack(result.data);
          }
          var gridInst = $("#" + elementID).data("kendoGrid");
          loadingStop("#" + elementID, ".btnTest");
          options.success(result);
          gridInst.element.removeClass("k-state-selected");
          gridInst.element.find("tbody tr:eq(1)").addClass("k-state-selected");
          var container = gridInst.element.children(".k-grid-content");
          container.scrollLeft(0);
          container.scrollTop(0);
          if (result.total == 0 && result.data.length == 0) {
            $("#" + elementID)
              .addClass("GV_noDataOnGrid")
              .attr("data-msg", "No data found.");
          } else {
            $("#" + elementID)
              .removeClass("GV_noDataOnGrid")
              .attr("data-msg", "");
          }
        },
        error: function (error) {
          options.error(error);
          serviceFactory.showError($scope, error);
        },
      });
    }
    function searchLazyGlobalVariable(
      elementID,
      options,
      selecteditem,
      isExternallyUpdatable,
      serviceFactory,
      $scope,
      callBack
    ) {
      debugger;
      var gridInst = $("#" + elementID).data("kendoGrid");
      if (selecteditem == "") {
        gridInst.dataSource.read();
      }
      $.ajax({
        url: opkey_end_point + "/GlobalVariable/searchLazyGlobalVariable",
        type: "Post",
        data: {
          searchName: fakingAngularCharacter(selecteditem),
          pageNum: options.data.page,
          pageSize: options.data.pageSize,
          isExternallyUpdatable: isExternallyUpdatable,
        },
        success: function (result) {
          if (callBack != undefined) {
            callBack(result.data);
          }
          loadingStop("#" + elementID, ".btnTest");
          options.success(result);
          gridInst.element.removeClass("k-state-selected");
          gridInst.element.find("tbody tr:eq(1)").addClass("k-state-selected");
          if (result.total == 0 && result.data.length == 0) {
            $("#" + elementID)
              .addClass("GV_noDataOnGrid")
              .attr("data-msg", "No data found.");
          } else {
            $("#" + elementID)
              .removeClass("GV_noDataOnGrid")
              .attr("data-msg", "");
          }
        },
        error: function (error) {
          options.error(error);
          serviceFactory.showError($scope, error);
        },
      });
    }
    var _grid = null;

    function initilizeGrid(dataSource) {
      _grid = $("#GlobalValueListgrid")
        .kendoGrid({
          dataSource: $scope.ListData,
          columns: [
            {
              field: "Value",
              encoded: true,
              template:
                "<button class='listValue' style=' border: 0; padding: 0; margin: 0; background: none; line-height: inherit; font-size: inherit; color: inherit; outline: none; box-shadow: none; cursor: default;width: 100%;display: block;text-align: left;'>#:Value#</button>",
            },
          ],
          selectable: true,
          editable: false,
          change: function (e) {
            debugger;
          },
        })
        .data("kendoGrid");

      _grid.dataSource.filter({});

      // $("#txtListSearch").bind("input", function () {
      //   SearchListValues($("#txtListSearch").val());
      // });
      // bind depericated on jquery 3

      $("#txtListSearch").on("input", function () {
        SearchListValues($(this).val());
      });
    

      $("#btnClearListSearch").click(function () {
        $("#txtListSearch").val("");
        _grid.dataSource.filter({});
      });

      $("#GlobalValueListgrid").on("click", ".listValue", function () {
        debugger;
        var obj = $("td.GVValueEditor.k-edit-cell.ListGridOpen > span");
        obj.text($(this).text());
        dataSource.set("DisplayValue", $(this).text());
        dataSource.set("Value", $(this).text());
        $(".GVValueEditor").removeClass("k-edit-cell");
      });
    }

    $scope.GridTagData = new kendo.data.DataSource({
      data: null,
      schema: {
        model: {
          fields: {
            Key: {
              validation: {
                required: {
                  message: "Name is required.",
                },
                PropertyNamevalidation: function (input, e) {
                  debugger;
                  var duplicateChecker = true;
                  if (input.val() !== "") {
                    var displayedData = $("#divGridTag")
                      .data("kendoGrid")
                      .dataSource.view();
                    var parentElementDataUid = $(input)
                      .closest("tr")
                      .attr("data-uid");
                    var enteredValue = input.val();
                    $.each(displayedData, function (index, obj) {
                      if (
                        obj.Key === enteredValue &&
                        obj.uid !== parentElementDataUid
                      ) {
                        input.attr(
                          "data-PropertyNamevalidation-msg",
                          "Name Already Exists !"
                        );
                        duplicateChecker = false;
                        return false;
                      }
                    });
                    var reg = /[~`!@#$%^&*()+={}|\:;'<,>.?/ ]/;
                    if (reg.test(input.val())) {
                      input.attr(
                        "data-PropertyNamevalidation-msg",
                        "Special Character not allowed"
                      );
                      return false;
                    }
                  }
                  return duplicateChecker;
                },
              },
              type: "string",
            },
            Value: {
              type: "string",
              validation: {
                required: {
                  message: "Name is required.",
                },
                PropertyNamevalidation: function (input, e) {
                  debugger;
                  var duplicateChecker = true;
                  if (input.val() !== "") {
                    var displayedData = $("#divGridTag")
                      .data("kendoGrid")
                      .dataSource.view();
                    var parentElementDataUid = $(input)
                      .closest("tr")
                      .attr("data-uid");
                    var enteredValue = input.val();
                    $.each(displayedData, function (index, obj) {
                      if (
                        obj.Key === enteredValue &&
                        obj.uid !== parentElementDataUid
                      ) {
                        input.attr(
                          "data-PropertyNamevalidation-msg",
                          "Name Already Exists !"
                        );
                        duplicateChecker = false;
                        return false;
                      }
                    });
                    //var reg = /[~`!@#$%^&*()+={}|\:;'<,>.?/ ]/;
                    //if (reg.test(input.val())) {
                    //    input.attr("data-PropertyNamevalidation-msg", "Special Character not allowed");
                    //    return false;
                    //}
                  }
                  return duplicateChecker;
                },
              },
            },
          },
        },
      },
      change: function (e) {
        debugger;
        var gridInst = $("#divGridTag").data("kendoGrid");
        var dataSource = gridInst.dataSource.data();
        if (e.action === "itemchange") {
          var sessionObjData = new Object();
          sessionObjData.Key = dataSource.Key;
          sessionObjData.Value = dataSource.Value;
          tempGridTagData.push(sessionObjData);
        }
        if (dataSource.length === 0) {
          $("#btDeleteTag").prop("disabled", true);
          $("#btMoveUpTag").prop("disabled", true);
          $("#btMoveDownTag").prop("disabled", true);
        } else if (dataSource.length === 1 || dataSource.length === 0) {
          $("#btMoveUpTag").prop("disabled", true);
          $("#btMoveDownTag").prop("disabled", true);
          $("#btDeleteTag").prop("disabled", false);
        } else {
          $("#btDeleteTag").prop("disabled", false);
          $("#btMoveUpTag").prop("disabled", false);
          $("#btMoveDownTag").prop("disabled", false);
        }
      },
    });

    $scope.GridOptionTag = {
      dataSource: $scope.GridTagData,
      editable: true,
      selectable: "row",
      resizable: false,
      scrollable: true,
      columns: [
        { field: "Key", width: "50%", editor: keysComboboxEditor },
        { field: "Value", width: "50%", editor: valuesComboboxEditor },
      ],
      dataBound: function () {
        serviceFactory.AccessibilityGridEmpty(this);
      },
      edit: function (e) {
        e.container.find("input").attr("aria-label", "Enter Value");
      },
    };

    $scope.OnTagGridChange = function (data, dataItem, columns) {
      debugger;
      // var CurrentRowData = ServiceFactory.getGridSelectedRowData('divGridTag');
      var currentRowData = data;
      if (currentRowData != null) rowUid = currentRowData.uid;
    };

    function valuesComboboxEditor(container, options) {
      debugger;
      getGridTagsData();
      tagDataSource = serviceFactory.getAllTagsData();
      $('<input data-bind="value:' + options.field + '" class="combo_width" />')
        .appendTo(container)
        .kendoComboBox({
          suggest: true,
          filter: "contains",
          dataSource: tagDataSource.Values,
          // select: onSelect,
          // change: OnChange,
        });
    }

    function keysComboboxEditor(container, options) {
      debugger;
      getGridTagsData();
      tagDataSource = serviceFactory.getAllTagsData();
      $(
        '<input data-bind="value:' +
          options.field +
          '" class="combo_width" required/>'
      )
        .appendTo(container)
        .kendoComboBox({
          suggest: true,
          filter: "contains",
          dataSource: tagDataSource.Keys,
        });
    }

    function getGridTagsData() {
      debugger;
      var tagKeys = [],
        tagValue = [];
      var tagdata = $scope.GridTagData._data;
      var serveragsKeyData = serviceFactory.getAllTagsData().Keys;
      var serveragsValueData = serviceFactory.getAllTagsData().Values;
      for (var i = 0; i < tagdata.length; i++) {
        tagKeys.push(tagdata[i].Key);
        if (tagdata[i].Value != null) tagValue.push(tagdata[i].Value);
        localTagData.Keys = tagKeys;
        localTagData.Values = tagValue;
      }
      for (var i = 0; i < serveragsKeyData.length; i++) {
        tagKeys.push(serveragsKeyData[i]);
        tagKeys = unique(tagKeys); //jQuery.unique(tagKeys);
        localTagData.Keys = tagKeys;
      }
      for (var i = 0; i < serveragsValueData.length; i++) {
        if (serveragsValueData[i] != null) tagValue.push(serveragsValueData[i]);
        tagValue = unique(tagValue); //jQuery.unique(tagValue);
        tagValue = $.grep(tagValue, function (TagValue) {
          return TagValue;
        });
        localTagData.Values = tagValue;
      }
      serviceFactory.setAllTagsData(localTagData);
      return localTagData;
    }

    function getUniqueKey(Key, Value, isvalid) {
      debugger;
      if (isvalid == true) {
        return { Key: Key, Value: Value };
      } else {
        isvalid = true;
        if (Key == null && Value == null) {
          Key = "NewTag-1";
          Value = "Value-1";
        } else {
          var keyName = Key.split("-");
          var keyValue = Value.split("-");
          var count = parseInt(keyName[1]) + 1;
          Key = keyName[0] + "-" + count;
          Value = keyValue[0] + "-" + count;
        }
        var gridInst = $scope.GridTagData.data();
        for (var i = 0; i < gridInst.length; i++) {
          if (gridInst[i].Key == Key && gridInst[i].Value == Value)
            isvalid = false;
        }
      }
      var obj = getUniqueKey(Key, Value, isvalid);
      var key2 = obj.Key;
      var value2 = obj.Value;
      return { Key: key2, Value: value2 };
    }

    $scope.LocalExecutionAddTag = function () {
      debugger;
      var gridInstance = $scope.GridTag;
      var objKeyValue = getUniqueKey(null, null, false);
      var dataToAdd = { Key: objKeyValue.Key, Value: objKeyValue.Value };
      var dataOfWholeGrid = gridInstance.dataSource.data();
      var countOfGridData = dataOfWholeGrid.length;
      gridInstance.dataSource.insert(countOfGridData, dataToAdd);
      var newIndex = countOfGridData;
      var tr = $("#divGridTag table tr:eq(" + (newIndex + 1) + ")");
      var grid = $("#divGridTag").data("kendoGrid");
      grid.select(tr);
      $scope.GridTag.element
        .find("tbody tr:eq(" + newIndex + ")")
        .addClass("k-state-selected");
      $("#divGridTag").focus();
      $("#divGridTag div.scroll-scrolly_visible:eq(0)").scrollTop(
        tr.height() * dataOfWholeGrid.length
      );
      serviceFactory.notifier($scope, "Tag Added", "success");
    };

    function unique(array) {
      return $.grep(array, function (el, index) {
        return index == $.inArray(el, array);
      });
    }

    $scope.LocalExecutionMoveTagUp = function () {
      debugger;
      var gridInstance = $scope.GridTag;
      var dataOfCurrentRow = gridInstance.dataSource.getByUid(rowUid);
      var indexOfSelectedRow = gridInstance.select().index();
      var indexToMove = Math.max(0, indexOfSelectedRow - 1);

      if (indexToMove !== indexOfSelectedRow) {
        gridInstance.dataSource.remove(dataOfCurrentRow);
        gridInstance.dataSource.insert(indexToMove, dataOfCurrentRow);

        var newIndex = indexOfSelectedRow - 1;
        if (newIndex < 0) {
          newIndex = 0;
        }
        $scope.GridTag.element
          .find("tbody tr:eq(" + newIndex + ")")
          .addClass("k-state-selected");
        serviceFactory.notifier($scope, "Tag moved up", "success");
        var trHeight = $("#divGridTag tr:eq(0)").height();
        var selectedRowIndex = $("#divGridTag tr.k-state-selected").index();
        var totalHeightofDiv = trHeight * selectedRowIndex;
        if (selectedRowIndex < 6) {
          $("#divGridTag div:eq(3)").scrollTop(0);
        } else {
          $("#divGridTag div:eq(3)").scrollTop(totalHeightofDiv);
        }
        return false;
      }
      serviceFactory.notifier($scope, "Tag Can not MoveUp ", "warning");
      return false;
    };

    $scope.LocalExecutionMoveTagDown = function () {
      debugger;
      var gridInstance = $scope.GridTag;
      var dataOfWholeGrid = gridInstance.dataSource.data();
      var dataOfCurrentRow = gridInstance.dataSource.getByUid(rowUid);
      var indexOfSelectedRow = gridInstance.select().index();

      var indexToMove = Math.min(
        gridInstance.dataSource.total() - 1,
        indexOfSelectedRow + 1
      );
      var divScrollDown = [9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 99];
      if (indexToMove !== indexOfSelectedRow) {
        gridInstance.dataSource.remove(dataOfCurrentRow);
        gridInstance.dataSource.insert(indexToMove, dataOfCurrentRow);

        var newIndex = indexOfSelectedRow + 1;
        if (newIndex >= dataOfWholeGrid.length) {
          newIndex = dataOfWholeGrid.length - 1;
        } else if (newIndex < 0) {
          newIndex = 0;
        }

        $scope.GridTag.element
          .find("tbody tr:eq(" + newIndex + ")")
          .addClass("k-state-selected");
        serviceFactory.notifier($scope, "Tag movedown", "success");

        var trHeight = $("#divGridTag tr:eq(1)").outerHeight();
        var selectedRowIndex = $("#divGridTag tr.k-state-selected").index();
        var totalHeightofDiv = trHeight * selectedRowIndex;
        if (divScrollDown.indexOf(selectedRowIndex) >= 0)
          $("#divGridTag div:eq(3)").scrollTop(totalHeightofDiv);

        return false;
      }
      serviceFactory.notifier($scope, "Tag Can not movedown ", "warning");
      return false;
    };

    $scope.LocalExecutionDeleteTag = function () {
      debugger;
      var gridInstance = $scope.GridTag;
      var dataOfSelectedRow = gridInstance.dataItem(gridInstance.select());
      var indexOfSelectedRow = gridInstance.select().index();
      gridInstance.dataSource.remove(dataOfSelectedRow);
      var newIndex = indexOfSelectedRow - 1;
      if (newIndex < 0) {
        newIndex = 0;
      }

      $scope.GridTag.element
        .find("tbody tr:eq(" + newIndex + ")")
        .addClass("k-state-selected");
      serviceFactory.notifier($scope, "Tag Deleted", "success");
    };

    $scope.GridOptionGlobalVariable = {
      dataSource: $scope.GlobalVariableDataSource,
      selectable: "row",
      editable: true,
      groupable: false,
      sortable: false,
      scrollable: true,
      pageable: {
        alwaysVisible: true,
        pageSizes: [25, 50, 100],
        buttonCount: 5,
        info: false,
      },
      page: function (e) {
        loadingStart("#divGridGlobalVariable", "Please Wait ...", ".btnTest");
      },
      //dataBound: GlobaldataBound,
      columns: [
        { hidden: true, field: "GV_ID" },
        { hidden: true, field: "Type" },
        {
          field: "Name",
          title: "Name",
          template: function (e) {
            return createCoulumnTitle(e.Name);
          },
        },
        {
          field: "DataType_ENUM",
          title: "DataType",
          template: function (e) {
            var DataType = e.DataType_ENUM;
            if (
              DataType == EnumArgumentDataType.CollectionOfString ||
              DataType == EnumArgumentDataType.CollectionOfBoolean ||
              DataType == EnumArgumentDataType.CollectionOfDateTime ||
              DataType == EnumArgumentDataType.CollectionOfDouble ||
              DataType == EnumArgumentDataType.CollectionOfInteger ||
              DataType == EnumArgumentDataType.CollectionOfMobileDevice ||
              DataType == EnumArgumentDataType.CollectionOfMobileApplication ||
              DataType == EnumArgumentDataType.CollectionOfFile ||
              DataType == EnumArgumentDataType.CollectionOfSecuredString ||
              DataType == EnumArgumentDataType.CollectionOfKeyValuePair
            ) {
              var collectiontype = "";
              if (DataType === EnumArgumentDataType.CollectionOfString) {
                collectiontype = EnumArgumentDataType.String;
              } else if (
                DataType === EnumArgumentDataType.CollectionOfBoolean
              ) {
                collectiontype = EnumArgumentDataType.Boolean;
              } else if (
                DataType === EnumArgumentDataType.CollectionOfDateTime
              ) {
                collectiontype = EnumArgumentDataType.DateTime;
              } else if (DataType === EnumArgumentDataType.CollectionOfDouble) {
                collectiontype = EnumArgumentDataType.Double;
              } else if (
                DataType === EnumArgumentDataType.CollectionOfInteger
              ) {
                collectiontype = EnumArgumentDataType.Integer;
              } else if (
                DataType === EnumArgumentDataType.CollectionOfMobileDevice
              ) {
                collectiontype = EnumArgumentDataType.MobileDevice;
              } else if (
                DataType === EnumArgumentDataType.CollectionOfMobileApplication
              ) {
                collectiontype = EnumArgumentDataType.MobileApplication;
              } else if (DataType === EnumArgumentDataType.CollectionOfFile) {
                collectiontype = EnumArgumentDataType.File;
              } else if (
                DataType === EnumArgumentDataType.CollectionOfSecuredString
              ) {
                collectiontype = EnumArgumentDataType.SecuredString;
              } else if (
                DataType === EnumArgumentDataType.CollectionOfKeyValuePair
              ) {
                collectiontype = EnumArgumentDataType.KeyValuePair;
              }
              return (
                "<span title='Collection(" +
                collectiontype +
                ")'>Collection(" +
                fakingAngularCharacter(collectiontype) +
                ")</span>"
              );
            } else {
              return (
                '<span title="' +
                DataType +
                '" >' +
                fakingAngularCharacter(DataType) +
                "</span>"
              );
            }
          },
        },
        {
          field: "Value",
          width: "20%",
          editor: gridEditorLocalExecution,
          attributes: {
            class: "table-cell GVValueEditor input-group-editor",
            style: "font-size: 14px",
          },
          template: function (e) {
            if (e.DisplayValue == null) {
              return "";
            } else {
              if (
                e.DataType_ENUM == "SecuredString" &&
                e.ShowDecryptedData != true
              ) {
                if (e.Value == "") {
                  return (
                    "<span class='isEncodedClass' title='" +
                    e.Value +
                    "'>" +
                    e.Value +
                    "</span>"
                  );
                } else {
                  // return "<span>" + elementFactory.createAsterisk(e.Value) + "</span>" + '<button title="View Value" class="btn btn-sm btn-grid-action" ng-click="EncryptData($event)" style="float: right;"><i class="fa fa-eye"></i></button>';
                  return (
                    "<span class='isEncodedClass' title='" +
                    createAsterisk(e.Value) +
                    "'>" +
                    createAsterisk(e.Value) +
                    "</span>"
                  );
                }
              } else if (e.DataType_ENUM.indexOf("Collection") != -1) {
                if (e.Value != "") {
                  return (
                    "<span class='isEncodedClass' title='" +
                    fakingAngularCharacter(JSON.parse(e.Value).DisplayValue) +
                    "'>" +
                    fakingAngularCharacter(JSON.parse(e.Value).DisplayValue) +
                    "</span>"
                  );
                } else {
                  return "<span class='isEncodedClass'></span>";
                }
              } else {
                return (
                  "<span title='" +
                  fakingAngularCharacter(e.DisplayValue) +
                  "'>" +
                  fakingAngularCharacter(e.DisplayValue)
                );
                ("</span>");
              }
            }
          },
        },
        {
          hidden: true,
          field: "ExternallyUpdatable",
          width: "2%",
          title: "ExternallyUpdatable",
          template:
            '<div style="text-align:center"><input type="checkbox" #= ExternallyUpdatable ? \'checked="checked"\' : "" # class="chkglobal" onchange="checkchange(this)" "/><div> ',
        },
      ],
      dataBound: function (e) {
        $("#divGridGlobalVariable div.k-grid-content").scroll(function () {
          $scope.closeKeyValueIfOpen();
        });
        $(".k-pager-wrap").css("z-index", "9999");
      },
      edit: function (e) {
        e.container.find("input").attr("aria-label", "Enter Value");
      },
    };
    var _grid = null;

    function initilizeGrid(dataSource) {
      _grid = $("#GlobalValueListgrid")
        .kendoGrid({
          dataSource: $scope.ListData,
          columns: [
            {
              field: "Value",
              encoded: true,
              template:
                "<button class='listValue' style=' border: 0; padding: 0; margin: 0; background: none; line-height: inherit; font-size: inherit; color: inherit; outline: none; box-shadow: none; cursor: default;width: 100%;display: block;text-align: left;'>#:Value#</button>",
            },
          ],
          selectable: true,
          editable: false,
          change: function (e) {
            debugger;
          },
        })
        .data("kendoGrid");

      _grid.dataSource.filter({});

      // $("#txtListSearch").bind("input", function () {
      //   SearchListValues($("#txtListSearch").val());
      // });
      
     // bind depericated on jquery 3

     $("#txtListSearch").on("input", function () {
      SearchListValues($(this).val());
      });

      $("#btnClearListSearch").click(function () {
        $("#txtListSearch").val("");
        _grid.dataSource.filter({});
      });

      $("#GlobalValueListgrid").on("click", ".listValue", function () {
        debugger;
        var obj = $("td.GVValueEditor.k-edit-cell.ListGridOpen > span");
        obj.text($(this).text());
        dataSource.set("DisplayValue", $(this).text());
        dataSource.set("Value", $(this).text());
        $(".GVValueEditor").removeClass("k-edit-cell");
      });
    }

    function SearchListValues(seachedItem) {
      debugger;
      console.log("seachedItem" + seachedItem);
      $("#GlobalValueListgrid")
        .data("kendoGrid")
        .dataSource.filter({
          logic: "or",
          filters: [
            {
              field: "Value",
              operator: "contains",
              value: seachedItem,
            },
          ],
        });
      if ($("#GlobalValueListgrid div.k-grid-content tr").length == 0) {
        serviceFactory.notifier(
          $scope,
          "No such value present in it",
          "warning"
        );
      }
    }

    $scope.ListData = new kendo.data.DataSource({
      data: null,
      schema: {
        model: {
          fields: {
            Value: {
              type: "string",
              validation: {
                required: { message: "Value is required." },
                PropertyValueValidation: function (input, e) {
                  debugger;
                  if (input.is("[name='Value']") && input.val() != "") {
                    var isunique = validateListValueUnique(input);
                    if (isunique == false) {
                      input.attr(
                        "data-PropertyNamevalidation-msg",
                        "Duplicate Value Found."
                      );
                    }
                    return isunique;
                  } else return true;
                },
              },
            },
            Value_ID: { type: "hidden" },
          },
        },
      },
      change: function (e) {
        debugger;
        //if (e.action == "itemchange") {
        //    if (e.items.length > 0) {
        //        var changeValueId = e.items[0].Value_ID;
        //        var newValue = e.items[0].Value;
        //        UpdateListItemValue(newValue, changeValueId);
        //    }
        //}
      },
    });

    function validateListValueUnique(e) {
      debugger;
      var ignoreID = $(e[0].parentElement.parentElement).attr("data-uid");
      var isUnique = true;
      var datasource = $scope.ListData.data();
      for (var i = 0; i < datasource.length; i++) {
        if (datasource[i].uid != ignoreID) {
          var existingProperty = datasource[i];
          var existingpropertyValue = existingProperty.Value;
          if (existingpropertyValue.toLowerCase() == $(e).val().toLowerCase()) {
            isUnique = false;
            break;
          }
        }
      }
      return isUnique;
    }

    var flagCallFromKeyValuePairClick = false;

    function gridEditorLocalExecution(container, options) {
      debugger;
      console.log("options-options");
      console.log(options);
      //if (options.model.Type === "System_Defined") {
      //    return false;
      //}
      var counter = 0;
      if (options.model.DataType_ENUM === "DateTime") {
        $('<input id="datatype" value=' + options.field + '"/>') //options.model.Value
          .attr("id", "datetimepicker")
          .appendTo(container)
          .kendoDateTimePicker({
            value: new Date(),
            animation: false,
            format: "yyyy-MM-dd HH':'mm':'ss",
            change: function (e) {
              debugger;
              var Globalgrid = $("#divGridGlobalVariable").data("kendoGrid");
              var selectedItem = Globalgrid.dataItem(Globalgrid.select());
              var val = e.sender._value;
              var datestring = kendo.toString(val, "yyyy-MM-dd HH':'mm':'ss");
              options.model.Value = datestring;
              options.model.Value = datestring;
              selectedItem.set("GV_ID", options.model.GV_ID);
              $scope.AddEditGlobalVariable(options.model);
              options.model.set("DisplayValue", this.value());
            },
            open: function (e) {
              options.model.set("DisplayValue", this.value());
            },
          });
      } else if (options.model.DataType_ENUM === "Double") {
        $('<input data-decimals="13" data-bind="value:' + options.field + '"/>')
          .attr("id", "Decimaltextbox")
          .appendTo(container)
          .kendoNumericTextBox({
            culture: "de-DE",
            change: function (e) {
              var datasource = options.model;
              datasource.set("DisplayValue", this.value());
            },
          });
      } else if (options.model.DataType_ENUM === "Integer") {
        $('<input  data-bind="value:' + options.field + '"/>')
          .attr("id", "Integertextbox")
          .appendTo(container)
          .kendoNumericTextBox({
            decimals: 0,
            change: function (e) {
              var datasource = options.model;
              datasource.set("DisplayValue", this.value());
            },
          });
      } else if (options.model.DataType_ENUM === "MobileApplication") {
        debugger;
        $(
          '<input id="#txtMobileApplicationGlobalVariable--' +
            'required name="' +
            options.field +
            '"  class="cltxtMobileApplicationGlobalVariable"  />'
        )
          .appendTo(container)
          .kendoDropDownList({
            autoBind: false,
            dataTextField: "DisplayName",
            template:
              "<div style='width:100%;display:inline-block;'><div style='width:75%;display:inline-block;color:black;word-break: break-all !important;'>#: DisplayName#</div><div style='width:25%;display:inline-block;color:black'><i>" +
              "# if(isHybrid == 'true')" +
              "{#<span>(Hybrid)</span>#}#" +
              "</i></div></div>",
            dataValueField: "DBID",
            filter: "startswith",
            dataSource: {
              data: allApplicationLocalExecutionArray,
            },
            select: function (e) {
              debugger;
              var dataItem = this.dataItem(e.item.index());

              var mobileDtOobject = new Object();
              mobileDtOobject.DBID = dataItem.DBID;
              mobileDtOobject.DisplayName = dataItem.DisplayName;
              mobileDtOobject.Platform = dataItem.Platform;
              mobileDtOobject.WaitForActivity = dataItem.WaitForActivity;
              var stringfymobileDtOobject = JSON.stringify(mobileDtOobject);

              var datasource = options.model;
              datasource.set("Value", stringfymobileDtOobject);
              options.model.set("DisplayValue", dataItem.DisplayName);
              options.model.DisplayValue = mobileDtOobject.DisplayName;
              //  options.model.Value = mobileDtOobject.DisplayName;  // jaugard for a urgent demo
            },
            change: function (e) {
              debugger;
            },
            open: adjustDropDownWidth,
          });
      } else if (options.model.DataType_ENUM === "MobileDevice") {
        debugger;
        $(
          '<input id="#txtMobileApplicationGlobalVariable--' +
            'required name="' +
            options.field +
            '"  class="cltxtMobileApplicationGlobalVariable"  />'
        )
          .appendTo(container)
          .kendoDropDownList({
            autoBind: false,
            dataTextField: "DisplayName",
            template:
              "<div style='width:100%;display:inline-block;'><div style='width:75%;display:inline-block;color:black;word-break: break-all !important;'>#: DisplayName#</div><div style='width:25%;display:inline-block;color:black'></div></div>",
            dataValueField: "DBID",
            filter: "startswith",
            dataSource: {
              data: allRegisterdDevicesLocalExecutionArray,
            },
            select: function (e) {
              debugger;
              var dataItem = this.dataItem(e.item.index());
              var mobileDtOobject = new Object();
              mobileDtOobject.DBID = dataItem.DBID;
              mobileDtOobject.DisplayName = dataItem.DisplayName;
              mobileDtOobject.DeviceType = dataItem.DeviceType;
              mobileDtOobject.OperatingSystem = dataItem.OperatingSystem;
              mobileDtOobject.SerialNumber = dataItem.SerialNumber;
              var stringfymobileDtOobject = JSON.stringify(mobileDtOobject);

              var datasource = options.model;
              datasource.set("Value", stringfymobileDtOobject);
              options.model.set("DisplayValue", dataItem.DisplayName);
              options.model.DisplayValue = mobileDtOobject.DisplayName;
              //       datasource.set("Text",  mobileDtOobject.DisplayName);
              //    options.model.Value = mobileDtOobject.DisplayName;
            },
            change: function (e) {
              debugger;
            },
            open: adjustDropDownWidth,
          });
      } else if (options.model.DataType_ENUM == "File") {
        debugger;
        $(
          '<input id="#txtFileGlobalVariable--' +
            options.model.GV_ID +
            'required name="' +
            options.field +
            '"  class="cltxtFileGlobalVariable"  />'
        )
          .appendTo(container)
          .kendoDropDownList({
            autoBind: true,
            dataTextField: "FileName",
            template:
              "<div style='width:100%;display:inline-block;'><div title='#: FileName##:Extension#' style='width:75%;display:inline-block;color:black;word-break: break-all !important;' class='app_Text_overflowDot'>#: FileName##:Extension#</div><div style='width:25%;display:inline-block;color:black'></div></div>",
            dataValueField: "DBID",
            filter: "startswith",
            dataSource: {
              data: allAttachment,
            },
            dataBound: function (e) {
              //http://demos.telerik.com/kendo-ui/dropdownlist/api
              $(e)[0].sender.open();
            },
            select: function (e) {
              debugger;
              var globalgrid = $("#divGridGlobalVariable").data("kendoGrid");
              var selectedItem = globalgrid.dataItem(globalgrid.select());
              var dataItem = this.dataItem(e.item.index());
              var stringfyattachDtOobject = JSON.stringify(dataItem);
              var newAttachmentId = dataItem.Attachment_ID;

              var datasource = options.model;
              datasource.set("Value", stringfyattachDtOobject);
              options.model.set("DisplayValue", dataItem.FileName);
              options.model.set("Attachment_ID", newAttachmentId);
              options.model.DisplayValue =
                dataItem.FileName + dataItem.Extension;
            },
            open: adjustDropDownWidth,
          });
      } else if (options.model.DataType_ENUM == "List") {
        debugger;

        setTimeout(function () {
          debugger;

          $(".GVValueEditor").removeClass("ListGridOpen");
          $(".GVValueEditor  span.k-widget").append(
            '<div style="display:none;" class="app_Tree_Dropdown" id="listValueGridExecutionRunTime"><div class="input-group" id="divSearchList"><input type="text" id="txtListSearch" class="form-control input-sm" placeholder="Search for..." aria-label="Search for"/> <span class="input-group-btn"><button title="Search" class="btn btn-default rebootbtndefault fa fa-eraser btn-sm" type="button" id="btnClearListSearch"></button></span></div><div id="GlobalValueListgrid" style="height: 78px;"  class=""></div></div>'
          );
          $scope.ListData.data([]);
          initilizeGrid(options.model);
          $scope.ListData.data(options.model.ListValues);
          $(
            ".GVValueEditor .k-dropdown-wrap span.k-input,.GVValueEditor .k-dropdown-wrap .k-select"
          ).click();
        }, 100);

        $(
          '<span title="" id="txtFileGlobalVariable-' +
            options.model.GV_ID +
            '" name="' +
            options.field +
            '" class="k-widget k-dropdown k-header"><span class="k-dropdown-wrap k-state-default"><span class="k-input"></span></span></span> </span>'
        ).appendTo(container);

        $(
          ".GVValueEditor .k-dropdown-wrap span.k-input,.GVValueEditor .k-dropdown-wrap .k-select"
        ).click(function () {
          debugger;
          $(".GVValueEditor").addClass("ListGridOpen");
          $("#listValueGridExecutionRunTime").css("display", "block");

          var marginTopValue = $("#divGridGlobalVariable tr:eq(1)").offset()
            .top;
          var scrollTop = $(
            "#divGridGlobalVariable .k-grid-content"
          ).scrollTop();

          var topOffset =
            $("#divGridGlobalVariable tr.k-state-selected").offset().top -
            marginTopValue;
          var relativeOffset = topOffset - scrollTop;
          var windowHeight = $(
            "#divGridGlobalVariable .k-grid-content"
          ).height();
          $("#listValueGridExecutionRunTime").css(
            "height",
            windowHeight / 2 - 30
          );

          if (relativeOffset > windowHeight / 2) {
            $("#listValueGridExecutionRunTime").addClass("DropdownTopOpen");
          } else {
            $("#listValueGridExecutionRunTime").removeClass("DropdownTopOpen");
          }
        });
      } else if (options.model.DataType_ENUM == "SecuredString") {
        $(
          '<span class="k-widget"><span class="input-widget-editor"><input data-text-field="' +
            options.field +
            '" ' +
            'class="k-input k-textbox staticEncryptedpvalue staticvalue" ' +
            'type="password" ' +
            'id = "inpt-' +
            options.model.GV_ID +
            '"' +
            'data-value-field="' +
            options.field +
            '" ' +
            'data-bind="value:' +
            options.field +
            '" />' +
            "</span><input id=btnEnc-" +
            options.model.GV_ID +
            '  readonly title="Decrypt Value" class="btn btn-default btn-sm fa fa-eye" ng-click="EncryptData($event)" /></span>'
        ).appendTo(container);

        setTimeout(function () {
          if (options.model.ShowDecryptedData == true) {
            $("#inpt-" + options.model.GV_ID).prop("type", "text");
            $("#btnEnc-" + options.model.GV_ID)
              .removeClass("fa-eye")
              .addClass("fa-eye-slash")
              .attr("title", "Encrypt Value");
          } else if (options.model.Value != "") {
            $("#inpt-" + options.model.GV_ID).prop("readonly", true);
            $("#inpt-" + options.model.GV_ID + '[readonly=""]').click(
              function () {
                serviceFactory.notifier(
                  $scope,
                  "Modifications are not allowed for encrypted field. Please decrypt and try again.",
                  "warning"
                );
              }
            );
            $("#inpt-" + options.model.GV_ID).keydown(function (event) {
              event.preventDefault();
              event.stopPropagation();
            });
          }
        }, 20);

        if (options.model.Value == "" || options.model.Value == null) {
          $("#" + options.model.GV_ID).prop("disabled", true);
        } else {
          $("#" + options.model.GV_ID).prop("disabled", false);
        }

        $("#inpt-" + options.model.GV_ID).keyup(function () {
          var val = $("#inpt-" + options.model.GV_ID).val();
          if (val == "" || val == null) {
            $("#" + options.model.GV_ID).prop("disabled", true);
          } else {
            $("#" + options.model.GV_ID).prop("disabled", false);
          }
        });
      } else if (options.model.DataType_ENUM.indexOf("Collection") != -1) {
        var collectionid = $("#divGridGlobalVariable")
          .data("kendoGrid")
          .dataItem(
            $("#divGridGlobalVariable").data("kendoGrid").select()
          ).Collection_ID;
        var dataTypeCollection = $("#divGridGlobalVariable")
          .data("kendoGrid")
          .dataItem(
            $("#divGridGlobalVariable").data("kendoGrid").select()
          ).DataType_ENUM;
        $(
          '<input id="#txtCollectionGlobalVariable--' +
            options.model.GV_ID +
            'required name="' +
            options.field +
            '"  class="cltxtFileGlobalVariable"  />'
        )
          .appendTo(container)
          .kendoDropDownList({
            template:
              "<div style='width:100%;display:inline-block;'><div style='width:75%;display:inline-block;color:black;word-break: break-all !important;'>#: DisplayValue#</div><div style='width:25%;display:inline-block;color:black'></div></div>",
            dataValueField: "CollectionVariableID",
            dataTextField: "DisplayValue",
            filter: "startswith",
            autoBind: false,
            dataSource: {
              transport: {
                read: {
                  type: "POST",
                  dataType: "json",
                  url:
                    opkey_end_point +
                    "/CollectionVariable/GetAllGlobalCollectionVarWithoutSelectedVar",
                  data: {
                    SelectedCollection_ID: collectionid,
                    GlobalVariableCollectionDataType: dataTypeCollection,
                  },
                },
              },
            },
            dataBound: function (e) {
              console.log(e.sender.dataSource.data());
              if (counter == 0) {
                counter++;
                $(e)[0].sender.open();
                //e.sender.dataSource.insert(0, { DisplayValue: '--Select Value--' });
              }
            },
            select: function (e) {
              debugger;
              var dataItem = this.dataItem(e.item.index());
              var collectionVariableDto = new Object();
              collectionVariableDto.CollectionVariableID =
                dataItem.CollectionVariableID;
              collectionVariableDto.Name = dataItem.Name;
              collectionVariableDto.DataType_Enum = dataItem.DataType_Enum;
              collectionVariableDto.ProjectID = dataItem.ProjectID;
              collectionVariableDto.Position = dataItem.Position;
              collectionVariableDto.Artifact_ID = dataItem.Artifact_ID;
              collectionVariableDto.DisplayValue = dataItem.DisplayValue;
              //   collectionVariableDto.DisplayValue = dataItem.TooltipValue;
              var stringfyCollectionDtOobject = JSON.stringify(
                collectionVariableDto
              );
              var datasource = options.model;
              datasource.set("Collection_ID", dataItem.CollectionVariableID);
              datasource.set("Value", stringfyCollectionDtOobject);
            },
          });
        if ($(".drop-Down-Parameter .k-widget").next(".btn")) {
          $(".drop-Down-Parameter>.k-widget").attr(
            "style",
            "width:calc(100% - 35px) !important; display: inline-block;"
          );
        }
      } else if (options.model.DataType_ENUM == "KeyValuePair") {
        debugger;
        setTimeout(function () {
          debugger;
          //$('.GVValueEditor').removeClass('ListGridOpen');
          //$('.GVValueEditor  span.k-widget').append('<div style="display:none;" class="app_Tree_Dropdown "><div id="GlobalKeyValuegrid" style="height:100% !important"  class=""></div></div>');
          $scope.GlobalKeyValueData.data([]);
          initializeKeyValueGrid();
          debugger;
          if (options.model.KeyValuePair === null) {
            $scope.GlobalKeyValueData.data([{ Key: "", Value: "" }]);
          } else {
            $scope.GlobalKeyValueData.data([
              {
                Key: options.model.KeyValuePair.Key,
                Value: options.model.KeyValuePair.Value,
              },
            ]);
          }
          $(
            "#txtFileGlobalVariable-" +
              options.model.GV_ID +
              " .k-dropdown-wrap  span.k-input, #txtFileGlobalVariable-" +
              options.model.GV_ID +
              " .k-dropdown-wrap .k-select"
          ).click();
        }, 100);

        $(
          '<span title="" id="txtFileGlobalVariable-' +
            options.model.GV_ID +
            '" name="' +
            options.field +
            '" class="k-widget k-dropdown k-header"><span class="k-dropdown-wrap k-state-default"><span class="k-input"></span></span></span> </span>'
        ).appendTo(container);

        $(
          "#txtFileGlobalVariable-" + options.model.GV_ID + " .k-dropdown-wrap"
        ).css("padding-right", "0");
        $(
          "#txtFileGlobalVariable-" +
            options.model.GV_ID +
            " .k-dropdown-wrap  span.k-input, #txtFileGlobalVariable-" +
            options.model.GV_ID +
            " .k-dropdown-wrap .k-select"
        ).click(function (e) {
          debugger;

          var gridId = "divGridGlobalVariable",
            keyValuePairGridId = "divRunTimeGVKeyValuegrid";

          flagCallFromKeyValuePairClick = true;
          var isKeyValueOpen = $("#" + keyValuePairGridId).hasClass(
            "ListGridOpen"
          );

          if (isKeyValueOpen) {
            $("#" + keyValuePairGridId).removeClass("ListGridOpen");
            $("#" + keyValuePairGridId).css("display", "none");
          } else {
            var marginTopValue = $("#" + gridId + " tr:eq(1)").offset().top;
            var scrollTop = $("#" + gridId + " .k-grid-content").scrollTop();

            var topOffset =
              $("#" + gridId + " tr.k-state-selected").offset().top -
              marginTopValue;
            var relativeOffset = topOffset - scrollTop;
            var windowHeight = $("#" + gridId + " .k-grid-content").height();
            $("#" + keyValuePairGridId).css("height", 85);

            //Let's open
            var offset = $(this).offset();
            var height = $(this).height();
            var width = $(this).width();
            //  var top = (offset.top - $('#' + gridId + ' thead').offset().top) + $("#" + gridId).data('kendoGrid').select().height() + "px";
            var right = width - 168 + "px";

            var top =
              offset.top -
              $("#" + gridId + " thead").offset().top -
              ($("#" + keyValuePairGridId).height() + 10) +
              92 +
              "px";
            $("#" + keyValuePairGridId).removeClass("DropdownTopOpen");
            //if (relativeOffset > (windowHeight / 2)) {
            //    top = (offset.top - $('#' + gridId + ' thead').offset().top) - ($('#' + keyValuePairGridId).height() + 10) + "px";
            //    $('#' + keyValuePairGridId).addClass("DropdownTopOpen");
            //}
            //else {
            //    $('#' + keyValuePairGridId).removeClass("DropdownTopOpen");
            //}

            $("#" + keyValuePairGridId).css({
              position: "absolute",
              right: right,
              top: top,
            });

            $("#" + keyValuePairGridId).addClass("ListGridOpen");
            $("#" + keyValuePairGridId).css("display", "block");
            $("#divModalBodyLocalExecution").click(function (e) {
              debugger;
              var keyValuePairGridId = "divRunTimeGVKeyValuegrid";

              if (
                !flagCallFromKeyValuePairClick &&
                $(e.target).parents("#" + keyValuePairGridId).length != 1
              ) {
                $scope.closeKeyValueIfOpen();
                flagCallFromKeyValuePairClick = false;

                // unbind depericated on jquery 3 we use off
                // $("#divModalBodyLocalExecution").unbind("click");

                $("#divModalBodyLocalExecution").off("click");
              } else {
                flagCallFromKeyValuePairClick = false;
              }
            });

            $(".k-i-collapse").click(function (e) {
              $scope.closeKeyValueIfOpen();
            });

            $(".k-i-close").click(function (e) {
              $scope.closeKeyValueIfOpen();
              $rootScope.ModalScope.ModalInstancelExecutionAdvanceSettings.close(
                true
              );
            });
          }
        });
      } else {
        $('<input  data-bind="value:' + options.field + '"/>')
          .attr("id", "textbox")
          .appendTo(container)
          .kendoMaskedTextBox({
            change: function (e) {
              var datasource = options.model;
              datasource.set("DisplayValue", this.value());
            },
          });
      }
    }

    $scope.closeKeyValueIfOpen = function () {
      var gridId = "divGridGlobalVariable";
      var keyValuePairGridId = "divRunTimeGVKeyValuegrid";

      var isKeyValueOpen = $("#" + keyValuePairGridId).hasClass("ListGridOpen");

      if (isKeyValueOpen) {
        //Let's close
        $("#" + keyValuePairGridId).removeClass("ListGridOpen");
        $("#" + keyValuePairGridId).css("display", "none");
        var divId = "#" + gridId;
        var grid = $(divId).data("kendoGrid");
        var selectedrow = grid.select().index();
        grid.refresh();
        grid.select("tr:eq(" + selectedrow + ")");
        //$('#GVKeyValue').html('');
      }
    };

    function createDropdownForAgent() {
      $("#ddlAgent").kendoDropDownList({
        dataTextField: "AgentName",
        dataValueField: "AgentID",
        dataSource: [],
        animation: false,
        template:
          '#if(data.AgentName == "--- Select Agent ---")' +
          "{# <span>#: data.AgentName # </span> #}" +
          "else if(data.IsOnline == true)" +
          '{# <span><i class="fa fa-circle fa-lg colorGreen"></i>&nbsp;&nbsp;#: data.AgentName # </span> #}' +
          'else {# <span><i class="fa fa-circle  fa-lg colorRed"></i>&nbsp;&nbsp;#: data.AgentName # </span> #} #',
        suggest: false,
        open: function () {},
        select: function (e) {
          debugger;
          if (e.dataItem.IsOnline) {
            dataFactory.AdvanceSettingAgentId = e.dataItem.AgentID;
          } else {
            dataFactory.AdvanceSettingAgentId = dataFactory.EmptyGuid;
            serviceFactory.notifier(
              $scope,
              "Agent is currently offline ",
              "error"
            );
          }
        },
        close: function (e) {},
      });
    }

    $scope.GetAllAgents = function () {
      $.ajax({
        url: opkey_end_point + "/Admin/GetPoolAgents",
        type: "Post",
        success: function (result) {
          debugger;
          var agentobj = new Object();
          agentobj.AgentName = "--- Select Agent ---";
          agentobj.AgentID = dataFactory.EmptyGuid;
          agentobj.IsOnline = true;

          var res = [];

          $.each(result, function (ind, obj) {
            if (obj.IsRegistered) {
              res.push(obj);
            }
          });

          res.sort(function (a, b) {
            return (
              (a.IsOnline == true) - (a.IsOnline == true) ||
              -(a.IsOnline > b.IsOnline) ||
              +(a.IsOnline < b.IsOnline)
            );
          });
          res.unshift(agentobj);

          var combo = $("#ddlAgent").data("kendoDropDownList");
          combo.setDataSource(res);
          combo.refresh();
          combo.select(0);

          if (dataFactory.AdvanceSettingAgentId === dataFactory.EmptyGuid) {
            combo.value(dataFactory.AdvanceSettingAgentId);
          }

          setTimeout(function () {
            $("#divPanelAgent .TextNode ").removeAttr("aria-autocomplete");
          }, 1000); //WCAG

          combo.value(dataFactory.AdvanceSettingAgentId);
        },
        error: function (error) {
          serviceFactory.showError($scope, error);
        },
      });
    };

    function validateFormSelectionSlider() {
      var timeOutSteps = parseFloat($("#txtInputStepTimeout").val());
      if (timeOutSteps < 5 || timeOutSteps > 300) {
        $("#spSliderError").show();
        return false;
      } else {
        $("#spSliderError").hide();
      }
      return true;
    }

    function getTagData() {
      debugger;
      var gridInst = $("#divGridTag").data("kendoGrid");
      var gridDataSourceData = gridInst.dataSource.data();
      var sessionObjData = new Object();
      if (gridDataSourceData.length == 0) {
        tempGridTagData = [];
        sessionObjData = new Object();
        sessionObjData.Key = "";
        sessionObjData.Value = "";
        //tempGridTagData.push(null);
      } else {
        tempGridTagData = [];
        for (var i = 0; i < gridDataSourceData.length; i++) {
          sessionObjData = new Object();
          sessionObjData.Key = gridDataSourceData[i].Key;
          sessionObjData.Value = gridDataSourceData[i].Value;
          tempGridTagData.push(sessionObjData);
        }
      }
    }

    function getGlobalVaraiableData() {
      debugger;
      //var getGlobalVariable = serviceFactory.getGlobalvariable();
      var setSelectedGv = [];
      //for (var i = 0; i < getGlobalVariable.length; i++) {
      //    if (getGlobalVariable[i].ExternallyUpdatable == true && getGlobalVariable[i].isUpdated == true) {
      //        setSelectedGv.push(getGlobalVariable[i]);
      //    }
      //}
      for (var itm in runTimeGVChanges) {
        setSelectedGv.push(runTimeGVChanges[itm]);
      }
      tempGridGlobalVariableData = setSelectedGv;
      return setSelectedGv;
    }

    $scope.SaveAdvanceSettings = function () {
      debugger;

      var objectSession = new Object();
      objectSession.SnapshotFrequency = stepSnapshot;
      objectSession.SnapshotQuality = stepSnapshotQuality;
      objectSession.SendReportType = reportStatus;
      objectSession.ResultUpdateOnTMT = $("#chkUpdateMappedTest").prop(
        "checked"
      );
      objectSession.UpdateMappedOR = false;
      objectSession.StepTimeOut =
        stepTimeout < 5 || stepTimeout > 300 ? 90 : stepTimeout;
      objectSession.Zephyr_Test_Cycle_Setting = "";
      objectSession.IsIpDefaultValueWillBeUsedRandom = $(
        "#chkIsIpDefaultValueWillBeUsedRandom"
      ).prop("checked");
      objectSession.HighlightObject = $("#chkIsHighlightObject").prop(
        "checked"
      );
      objectSession.ObjectVisibilityCheck = $(
        "#chkIsLEWObjectVisibilityCheck"
      ).prop("checked");
      objectSession.ApplySkipStepValidation = $(
        "#chkApplySkipStepValidation"
      ).prop("checked");
      objectSession.RunTimeAllContinueOnError = $("#ContineuOnErrorAll").val();
      objectSession.EnableStepLogs = $("#chkEnableStepLogs").prop("checked");
      if (dataFactory.TempDataOfSmtpSettings != null) {
        dataFactory.TempDataOfSmtpSettings["EnableStepLogs"] =
          $("#chkEnableStepLogs").prop("checked");
      }

      objectSession["IsRememberExecutionSettings"] = true;
      objectSession["EnableStepLogs"] = $("#chkEnableStepLogs").prop("checked");
      objectSession["DefaultStepTimeOut"] = objectSession.StepTimeOut;

      var stringyfyData = JSON.stringify(objectSession);

      validateFormSelectionSlider();

      objectSession.IsExternalTestManagementToolMapped =
        tempIsExternalTestManagementToolMapped;

      dataFactory.TempDataOfExecutionSessionSettings = objectSession;

      if (dataFactory.CallSourceAdvanceSettings === "Default") {
        loadingStart(
          "#divModalBodyLocalExecution",
          "Please Wait ...",
          ".btnTestLoader"
        );
        $.ajax({
          url: opkey_end_point + "/Execution/saveGridSessionDefaultSettings",
          type: "Post",
          data: { strSessionDefaultSettings: stringyfyData },
          success: function (result) {
            debugger;
            dataFactory.DataOfSessionSetting = objectSession;

            tempGridGlobalVariableData =
              $scope.GridGlobalVariable.dataSource.data();
            getGlobalVaraiableData();
            dataFactory.TempDataOfExecutionGlobalDefaultSettings =
              tempGridGlobalVariableData;

            //serviceFactory.notifier($scope, "Default settings saved successfully", "success");
            setTimeout(function () {
              loadingStop("#divModalBodyLocalExecution", ".btnTestLoader");
              $scope.DestroyModalInstanceExecutionAdvanceSettings();
            }, 200);
            return false;
          },
          error: function (error) {
            loadingStop("#divModalBodyLocalExecution", ".btnTestLoader");
            serviceFactory.showError($scope, error);
          },
        });
        return false;
      }

      // Setting Tags

      getTagData();
      dataFactory.TempDataOfExecutionTagSettings = tempGridTagData;

      // Global Variables

      //tempGridGlobalVariableData = $scope.GridGlobalVariable.dataSource.data();

      //var listOfGlobalVariables = [];

      //$.each(tempGridGlobalVariableData, function (ind, obj) {
      //    if (obj.isUpdated) {
      //        listOfGlobalVariables.push(obj);
      //    }
      //});

      //if (dataFactory.CallSourceAdvanceSettings !== "MultiBrowser") {
      //    if (tempGridGlobalVariableData.length === 0) {
      //        getGlobalVaraiableData();
      //    }

      //}
      dataFactory.TempDataOfExecutionGlobalSettings = getGlobalVaraiableData();

      if (dataFactory.CallSourceAdvanceSettings === "Scheduler") {
        $scope.DestroyModalInstanceExecutionAdvanceSettings();
        return false;
      } else if (dataFactory.CallSourceAdvanceSettings === "MultiBrowser") {
        objectSession["DefaultStepTimeout"] = objectSession.StepTimeOut;
        dataFactory.TempDataOfExecutionSessionSettings = objectSession;
        $scope.DestroyModalInstanceExecutionAdvanceSettings();
        return false;
      } else if (dataFactory.CallSourceAdvanceSettings === "Custom") {
        var gridInstance = $rootScope.ScopeGridExecution.GridExecutionSetting;
        var dataOfSelectedRow = gridInstance.dataItem(gridInstance.select());
        dataOfSelectedRow.SessionSettings = objectSession;
        dataOfSelectedRow.SessionTags = tempGridTagData;
        dataOfSelectedRow.GlobalVariables = getGlobalVaraiableData();
        dataOfSelectedRow.GlobalVariablesBinding = $("#divGridGlobalVariable")
          .data("kendoGrid")
          .dataSource.data(); //tempGridGlobalVariableData;
        setTimeout(function () {
          loadingStop("#divModalBodyLocalExecution", ".btnTestLoader");
          $scope.DestroyModalInstanceExecutionAdvanceSettings();
        }, 200);
        serviceFactory.notifier(
          $scope,
          "Custom settings saved successfully",
          "success"
        );
      } else {
        objectSession["DefaultStepTimeout"] = objectSession.StepTimeOut;
        dataFactory.TempDataOfExecutionSessionSettings = objectSession;
        $scope.DestroyModalInstanceExecutionAdvanceSettings();
        return false;
      }
    };

    $scope.category_global = function ($event, GlobalVariableId, txtBoxId) {
      debugger;
      var selecteditem = $("#" + txtBoxId).val();
      if (selecteditem == "") {
        $scope.GlobalVariableDataSource.read();
      } else if (selecteditem.length >= 3) {
        SearchGV(selecteditem, GlobalVariableId, txtBoxId);
      }
    };

    function SearchGV(selecteditem, GlobalVariableId, txtBoxId) {
      debugger;

      if (selecteditem != "") $rootScope.GvSearch_txtBoxId = txtBoxId;
      var currentPageNumber = $scope.GlobalVariableDataSource.page();
      if (currentPageNumber != 1) {
        $scope.GlobalVariableDataSource.page(1);
        setTimeout(function () {
          $scope.GlobalVariableDataSource.read();
        }, 300);
      } else {
        $scope.GlobalVariableDataSource.read();
      }
      return false;
      $("#" + GlobalVariableId)
        .data("kendoGrid")
        .dataSource.filter({
          logic: "or",
          filters: [
            {
              field: "Name",
              operator: "contains",
              value: selecteditem,
            },
          ],
        });
      if ($("#" + GlobalVariableId + " div.k-grid-content tr").length == 0) {
        // serviceFactory.notifier($scope, 'No such data or variable present in it', 'warning');
      }
    }

    $scope.DestroyModalInstanceExecutionAdvanceSettings = function () {
      $rootScope.ScopeMultibrowser.Modal_Instance_Addvance_Settings.close(true);
    };
    function createAsterisk(num) {
      var ast = "";
      for (var i = 0; i < num.length; i++) {
        ast = ast + "*";
      }
      return ast;
    }
  },
]);
