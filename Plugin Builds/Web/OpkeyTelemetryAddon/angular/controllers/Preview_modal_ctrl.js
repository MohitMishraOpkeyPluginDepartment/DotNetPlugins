angular.module('myApp').controller("preview_modal_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory) {

        
        $scope.OnModalLoad = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divModalElement", OnModalLoad);
        };


        function OnModalLoad() {
            let Attachment_data = serviceFactory.getCallSourceInDataFactory([], "Manual_Create_Attachment_data", "Create_View").Selected_Attachment;
            let image_attachment_type = ['.png','.jpge','.jpg'];
            let video_attachment_type = ['.webm','.mp4','.wav'];
            if(image_attachment_type.indexOf(Attachment_data.extension)>-1){
                $("#image_wrapper").show();
                $("#opkeyImgViewer").prop('src',Attachment_data.temporaryFilePath);
            }
            else if(video_attachment_type.indexOf(Attachment_data.extension)>-1){
                $("#video_wrapper").show();
                $("#opkeyVideoViewer").prop('src',Attachment_data.temporaryFilePath);
            }
        }
    
    
    }])