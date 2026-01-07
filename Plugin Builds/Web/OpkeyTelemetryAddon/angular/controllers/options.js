
angular.module('myApp').controller("options_ctrl", ['$rootScope', '$scope', '$state', 'ServiceFactory', 'DataFactory', '$ocLazyLoad',
    function ($rootScope, $scope, $state, serviceFactory, dataFactory, $ocLazyLoad) {


        $scope.Load_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_View", Load_View);
        };


        function Load_View() {
           // $scope.ChangePageView('options.recording_normal');      
           let manual_ruuner_sessionID = serviceFactory.GetGlobalSetting("SessionID");

             
           if(document.URL.indexOf('callsource')>-1){
                docker_UI_loads();                
            }
            else if(manual_ruuner_sessionID != null && manual_ruuner_sessionID != ""){

            }
            else{
                let windowType = localStorage.getItem("EXTENSION_OPENED");
                localStorage.setItem("EXTENSION_OPENED", "");

                if(windowType == "WINDOW"){
                    $scope.ChangePageView("options.project_selection");
                }
                else {
                    check_open_project_selection("Project");
                }
                
            }
            $scope.Validate_opkey_Session();
        }


        $scope.Select_Option_Tab = function (type) {
            debugger;

            $(".record_selection_item").removeClass("active");
            $("#divTab_" + type).addClass("active");

           
        }

        
        function docker_UI_loads() {

            if(document.URL.indexOf('callsource')>-1){
             let data = {};
             if(document.URL.split("?")[1].split("&")[1].split("#")[0].split("=")[1] == "createticket"){
                let curd_data = localStorage.getItem("capture_step_data");
                if(curd_data != null){
                    curd_data = JSON.parse(curd_data);
                }
                data = {type: "Ticket", current_TestCase: null, Attachment_data: [], Issue_data: curd_data == null?null:curd_data.Issue_data, CallSource: "options.Manual_project_selection"};
             
                serviceFactory.SetCallSourceInDataFactory(data, "Manual_Create_view_data");
 
                $scope.ChangePageView("options.Manual_create_view");
             }
             else if(document.URL.split("?")[1].split("&")[1].split("#")[0].split("=")[1] == "createuserstory"){
                let curd_data = localStorage.getItem("capture_step_data");
                if(curd_data != null){
                    curd_data = JSON.parse(curd_data);
                }
                data = {type: "User Story", current_TestCase: null, Attachment_data: [], Issue_data: curd_data == null?null:curd_data.Issue_data, CallSource: "options.Manual_project_selection"};
                 
                serviceFactory.SetCallSourceInDataFactory(data, "Manual_Create_view_data");
 
                $scope.ChangePageView("options.Manual_create_view");
             }
             // else if(document.URL.split("?")[1].split("&")[1].split("#")[0].split("=")[1] == "captureqlmimage"){
 
             // }
             
            }
        }
        
        function check_open_project_selection(type){

            let step_data= localStorage.getItem("capture_step_data");
            let AppUtility = localStorage.getItem("AppUtilityType");
            let QLM_res = localStorage.getItem("QLM_Response");
            if(step_data != null) {                
                
                if(QLM_res != null) {
                    
                    let step = JSON.parse(step_data);

                    let data={};
                    if(step.type == null){
                        if(step.Issue_data != null) {
                            step.Issue_data.IssueType = JSON.parse(QLM_res).IssueType;
                        }                        
                        data = {type: JSON.parse(QLM_res).IssueType, current_TestCase: step.GridRow, Attachment_data: [], Issue_data: step.Issue_data, CallSource: step.GridRow == null?"options.Manual_project_selection":"ManualRunnerView"};
                    }
                    else if(step.type == "TestCase" || step.type == "Step"){
                        $scope.ChangePageView("ManualRunnerView");
                        return;
                    }
                    else{
                        data = {type: step.type, current_TestCase: step.GridRow, Attachment_data: [], Issue_data: step.Issue_data, CallSource: step.GridRow == null?"options.Manual_project_selection":"ManualRunnerView"};
                    }               
                    
                    
                    serviceFactory.SetCallSourceInDataFactory(data, "Manual_Create_view_data");

                    $scope.ChangePageView("options.Manual_create_view");
                }
                else if(AppUtility != null){
                    
                    let step = JSON.parse(step_data);
                    if(step.Issue_data == null){
                        if(type == "ManualRunner"){
                            $scope.ChangePageView("ManualRunnerView");
                        }  
                        else {
                            $scope.ChangePageView("options.Manual_project_selection");
                        }  
                    }
                    else {

                        let data = {type: step.type?step.type:"Ticket", current_TestCase: step.GridRow, Attachment_data: [], Issue_data: step.Issue_data, CallSource: step.GridRow == null?"options.Manual_project_selection": 'ManualRunnerView'};                    
                    
                        serviceFactory.SetCallSourceInDataFactory(data, "Manual_Create_view_data");

                        $scope.ChangePageView("options.Manual_create_view");
                    }
                }
                else {
                    console.log("step_data",step_data);
                    let step = JSON.parse(step_data);

                    let data = {type: step.type?step.type:"Ticket", current_TestCase: step.GridRow, Attachment_data: [], Issue_data: step.Issue_data, CallSource: step.GridRow == null?"options.Manual_project_selection": 'ManualRunnerView'};                    
                    
                    serviceFactory.SetCallSourceInDataFactory(data, "Manual_Create_view_data");

                    $scope.ChangePageView("options.Manual_create_view");
                }
            }
            else{         
                if(type == "ManualRunner"){
                    $scope.ChangePageView("ManualRunnerView");
                }  
                else {
                    $scope.ChangePageView("options.Manual_project_selection");
                }     
                
            }
        }



    }]);




