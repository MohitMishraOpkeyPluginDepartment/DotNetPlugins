(function (exports) {
    "use strict";

    function recordOpKeyTestPage() { };

    exports.recordOpKeyTestPage = recordOpKeyTestPage;
    let btnText = "Existing TC/FL";

    recordOpKeyTestPage.recordOpKeyTestInitializer = function (saas_object) {

        return new recordOpKeyTestPage.Initializer(saas_object);
    }


    recordOpKeyTestPage.Initializer = function (saas_object) {

        if (!(this instanceof recordOpKeyTestPage.Initializer)) {
            console.war("recordOpKeyTestPage constructor is not used!");
            return new recordOpKeyTestPage.Initializer();
        }
        console.log(saas_object)

        function recordOpKeyTest() {
            if (saas_object.isAlreadyLoggedIn) {
                saas_object.PopulateUniqueName(DEFAULT_OPKEY_LOCATION_ID);
                showHideRecordOpkeyPanel(false);
            }
            saas_object.CheckLoginStatusRecursively();
            saas_object.CheckLoginStatusOnClick();
            saas_object.CheckUserAndProjectSessionState(true);
            $('#divSelectResoposve').bury(true);
        }

        $(document).on("click", "#divRecordOpkeyTest", function () {
            recordOpKeyTest();
            //$('#divRecordOpkeyTest').addClass('active');
            if ($(this).hasClass("btn_loginOpkeyPortal") == false) {
                $("#divRecordResponsiveTest, #divRecordRun").removeClass("active");
                $(this).addClass("active");
            }
        });


        $(document).on('click', '#anExistingTcfl', function () {
            debugger
            $(this).text($(this).text() == 'Existing TC/FL' ? 'New TC/FL' : 'Existing TC/FL');

            if (btnText == "Existing TC/FL") {
                $('#divPanel_New_Artifact').bury(true);
                $('#divPanel_Existing_Artifact').bury(false);
                $('#ORSelectionPage').bury(true);
                $('#testCaseSelectionPage').bury(false);
                $('#anChooseOr').removeClass('active');
                $(this).addClass('active');
                saas_object.loadTestCaseSelectionTree();
            } else {
                if ($('#divRecordResponsiveTest').hasClass('active')) {
                    recordOpKeyTest();
                    $("#divRecordResponsiveTest").addClass('active');
                    $('#divSelectResoposve').bury(false);
                } else {
                    $('#divRecordOpkeyTest').click();
                }
            }
            btnText = $(this).text();
            // used to hide and remove class for new and existing tc
            $('#divSelectResoposve_existing').bury(true);
            $('.existingArtifact-selection-body').removeClass('jsTree_dynamicHeight');
        });

        $(document).on('click', '#anChooseOr', function () {
            $('#divPanel_New_Artifact').bury(true);
            $('#divPanel_Existing_Artifact').bury(false);
            $('#testCaseSelectionPage').bury(true);
            $('#ORSelectionPage').bury(false);
            $('#anExistingTcfl').removeClass('active');
            $(this).addClass('active');
            saas_object.loadORSelectionTree();
            saas_object.select_NodeTree();
            if ($('#divRecordResponsiveTest').hasClass('active')) {
                $('#divSelectResoposve_existing').bury(false);
                $('.existingArtifact-selection-body').addClass('jsTree_dynamicHeight');
            } else {
                $('#divSelectResoposve_existing').bury(true);
                $('.existingArtifact-selection-body').removeClass('jsTree_dynamicHeight');
            }
        });

        $(document).on('click', '#divRecordResponsiveTest', function () {
            debugger
            if ($(this).hasClass("btn_loginOpkeyPortal") == false) {
                $("#divRecordOpkeyTest, #divRecordRun").removeClass("active");
                $(this).addClass("active");
            }

            if (saas_object.isAlreadyLoggedIn) {
                saas_object.PopulateUniqueName(DEFAULT_OPKEY_LOCATION_ID);
                showHideRecordOpkeyPanel(false);
            }
            saas_object.CheckLoginStatusRecursively();
            saas_object.CheckLoginStatusOnClick();
            saas_object.CheckUserAndProjectSessionState(true);
            if ($('#divRecordResponsiveTest').hasClass('active')) {
                $('#divSelectResoposve').bury(false);
                $('.existingArtifact-selection-body').addClass('jsTree_dynamicHeight');
            } else {
                $('#divSelectResoposve').bury(true);
                $('.existingArtifact-selection-body').removeClass('jsTree_dynamicHeight');
            }
        })

        $(document).on('click', '#anSwitchTcfl', function () {
            $(this).text($(this).text() == 'Switch to Function Library' ? 'Switch to Test Case' : 'Switch to Function Library');
        })


        // --------------Start Recording width New TC/FL-----------------

        $(document).on("click", "#startRecording", function () {
            debugger
            var recordFromORTree = $('#anChooseOr').hasClass('active');
            if (recordFromORTree) {
                var or_node = saas_object.GetSelectedNode("ORSelectionTree");
                var or_id = or_node[0].id;
                saas_object.AcquireORLock(or_id);
            } else {

                var artificate_value = $("#NewOrRecordName").val().trim();
                if (artificate_value == "") {
                    saas_object.ShowToastMessage("error", "Artifact name cannot be blank.");
                    saas_object.ResetArtificateTextField();
                    return;
                }

                var app_url = $("#ApplicationURL").val();
                saas_object.SetGlobalSetting("APPLICATION_URL", app_url);
                saas_object.CreateArtificate_ORInProject();
            }

        });


        function showHideRecordOpkeyPanel(isHide) {
            if ($('.recordingSelector').hasClass('active') == true) {
                $('#testCaseSelectionPage').bury(isHide);
                $('#divPanel_Existing_Artifact').bury(!isHide);
                $('#ORSelectionPage').bury(!isHide);
                $('.recordingSelector').removeClass('active');
            }
            $('#divPanel_New_Artifact').bury(isHide);
            $('#btnstartRecording').bury(isHide);
            $('#btnArtifactState').bury(isHide);
            $('#startRecording').attr('disabled', false);
        }


    }

})(this);