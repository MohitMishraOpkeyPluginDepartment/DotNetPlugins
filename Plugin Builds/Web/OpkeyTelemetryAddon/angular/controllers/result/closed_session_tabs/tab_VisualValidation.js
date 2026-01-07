angular.module('myApp').controller("result_VisualValidation_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory', 'FormControlFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory, formControlFactory) {

        var opkey_end_point = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");

        var currentSelectedNode = null;


        var current_session = null;

        $rootScope.scopeVisualValidationDetails = $scope;


        $scope.Load_Sub_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_Sub_View", Load_Sub_View);
        };

        function Load_Sub_View() {
            debugger;
            current_session = dataFactory.Selected_Execution_Node;

            currentSelectedNode = dataFactory.selectedTreeNodeData;

            getAllVisuals(currentSelectedNode.id);
        }
        function getAllVisuals(result_id) {
            $.ajax({
                url: opkey_end_point + "/Result/GetVisualValidationReportSnapshots",
                type: "Post",
                data: { sessionId: current_session.SessionId, resultID: result_id },
                success: function (result) {

                    if (result == "") {
                        $('#divPanelVisuals').addClass('no_ResultData');
                    }
                    else {
                        $('#divPanelVisuals').removeClass('no_ResultData');
                        create_html_visuals(result);
                    }
                },
                error: function (error) {
                    serviceFactory.showError($scope, error);
                }
            })
        }
        function create_html_visuals(result) {
            debugger;
            var html = '';

            html = html + '';
                html = html + '<div class="col-sm-4">';
                html = html + '<h6 class="heading_visual_validate">Baseline Image</h6>';
                html = html + '<a id="an_live" class="an_img"/>';
                html = html + '<img src=data:image/png;base64,' + result.BaseLineImage + '  class="img-responsive img_visual_validate"/>';
                html = html + '</a>';
                html = html + '</div>';
                html = html + '<div class="col-sm-4">';
                html = html + '<h6 class="heading_visual_validate">Runtime Image</h6>';
                html = html + '<a id="an_live" class="an_img"/>';
                html = html + '<img src=data:image/png;base64,' + result.CurrentImage + '  class="img-responsive img_visual_validate"/>';
                html = html + '</a>';
                html = html + '</div>';
                html = html + '<div class="col-sm-4">';
                html = html + '<h6 class="heading_visual_validate">Difference Image</h6>';
                html = html + '<a id="an_live_" class="an_img"/>';
                html = html + '<img src=data:image/png;base64,' + result.DifferenceImage + '  class="img-responsive img_visual_validate"/>';
                html = html + '</a>';
                html = html + '</div>';
            


            $("#divVisualValidation").html(DOMPurify.sanitize(html));
            $('.img_visual_validate').unbind().click(function (e) {
                debugger;
                $('.fullSizeIMGHeader').attr('style', "");

                $('#newSourceProperty').html('');
                debugger;
                var newSource = e.currentTarget.getAttribute('src');//e.currentTarget.currentSrc;
                if (newSource.includes("no_CapturedScreen.png")) {
                    return false;
                }
                // alert(newSource);
                $('.fullSizeImageBGColorClick,.fullSizeImageBGColor').show();
                $('#newSourceImg').show();
                $('#newSourceImg').attr('src', newSource);


                setTimeout(function () {
                    var position = $(".fullSizeImage").position();
                    var width = $('.fullSizeImage')[0].offsetWidth;
                    $('.fullSizeIMGHeader').css('left', position.left);
                    $('.fullSizeIMGHeader').css('top', position.top);
                    $('.fullSizeIMGHeader').css('width', width);

                }, 100);
                $('#btCloseImage').click(function () {
                    $('.fullSizeImageBGColorClick,.fullSizeImageBGColor').hide();
                    $('.fullSizeIMGHeader').attr('style', '');
                });
            })
        }
    }]);