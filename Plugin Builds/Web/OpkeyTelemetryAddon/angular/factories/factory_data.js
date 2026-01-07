


myApp.factory("DataFactory", [function () {

    var factory = {};

    factory.EmptyGuid = "00000000-0000-0000-0000-000000000000";

    factory.Empty = "";

    factory.FollowMeModalData=null;

    factory.TempDataOfExecutionSessionSettings = new Object();

    factory.TempDataOfExecutionTagSettings = [];
    
    factory.TempDataOfExecutionGlobalSettings = [];

    factory.TempDataOfExecutionSettings = new Object();

    factory.AdvanceSettingAgentId = factory.EmptyGuid;

    factory.DataOfSessionSetting = null;

    factory.TempDataOfExecutionGlobalDefaultSettings = [];

    factory.CallSourceAdvanceSettings = "MultiBrowser";

    factory.TempValueOfCurrentUser = null;

    factory.ProjectTreeFlows = [];

    factory.selectedTreeNodeData = null;

    factory.LabelTreeFlows = [];

    factory.DisplayTimeZone = [];

    factory.MultiBrowser_ExecutionType = null;

    factory.local_Exection_SessionId = null;

    factory.Response_pcloudy_credentials = new Object();

    factory.Closed_Session_Batch_Id = factory.EmptyGuid;

    factory.Selected_Execution_Node = null;

    factory.Session_logs = new Object();

    factory.Select_live_Window = null;

    factory.Session_Data = null;

    factory.Pin_Live_Executions = {};

    factory.OPKEY_URL = "";



    factory.Clear_Variable = function () {


        factory.TempDataOfExecutionSessionSettings = new Object();

        factory.TempDataOfExecutionTagSettings = [];

        factory.TempDataOfExecutionGlobalSettings = [];

        factory.TempDataOfExecutionSettings = new Object();

        factory.DataOfSessionSetting = null;

        factory.TempDataOfExecutionGlobalDefaultSettings = [];

        factory.ProjectTreeFlows = [];

        factory.selectedTreeNodeData = null;

        factory.LabelTreeFlows = [];

        factory.DisplayTimeZone = [];

        factory.Session_logs = new Object();

        factory.Session_Data = null;

        factory.Pin_Live_Executions = {};


    }
    
    return factory;
}]);



