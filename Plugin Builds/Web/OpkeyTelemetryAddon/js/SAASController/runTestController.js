(function (exports) {
    "use strict";

    function runTestPage() { };

    exports.runTestPage = runTestPage;


    runTestPage.runTestPageInitializer = function (saas_object) {

        return new runTestPage.Initializer(saas_object);
    }


    runTestPage.Initializer = function (saas_object) {

        if (!(this instanceof runTestPage.Initializer)) {
            console.war("runTestPage constructor is not used!");
            return new runTestPage.Initializer();
        }

        Saas.prototype.getPlatformDetails = function () {
            let data = fetch("./js/JSON/PlatformInfo.json");
            data.then(response => response.json())
                .then(json =>
                    saas_object.createPlaformInfoHTMLTabel(json)
                )
        }

        Saas.prototype.createPlaformInfoHTMLTabel = function (Jsondata) {
            var html = "";
            let count = 0;
            $.each(Jsondata, function (win, platforms) {
                //console.log(win); for accordion
                $.each(platforms, function (platformName, lstOfbrowser) {
                    debugger
                    count++;
                    var className = platformName.replace(" ", "").replace(".", "_") + "_" + count;
                    html += "<tr class=" + className + " name='" + platformName + "'>"
                    html += '<td style="padding-left:20px; font-size: 15px;"><img src="icons/' + platformName + '.png" alt="Windows" style="width: 40px!important; " /> &nbsp; ' + platformName + '</td>'
                    $.each(lstOfbrowser, function (browser, val) {
                        count++;
                        if (val != "") {
                            html += '<td><label for=' + browser + "_" + count + ' ><input id=' + browser + "_" + count + ' type="checkbox"><span name=' + browser + '>&nbsp; ' + val + '</span></label>'
                            html += ' <select style=" height: 30px; width: 80px; " class="artifact-item form-control"><option value="2560">2560 x 1600</option>   <option value="1920">1920 x 1080</option><option value = "1600" > 1600 x 900</option><option value="1440">1440 x 900</option><option value="1366">1366 x 768</option><option value="1280">1280 x 720</option></select>'
                            html += '</td>'
                        } else {
                            html += '<td></td>'
                        }
                    });
                    html += "</tr>"
                });
                //
            });
            $('#table_platformInfo').html(html);
            if (navigator.platform != "MacIntel") {
                $('[name="Mac"]').hide();
            }
        }

        Saas.prototype.selectedBrowserInfo = function () {
            debugger
            var allRows = $('#table_platformInfo tr');
            var selectedPlatformVersions = [];
            for (var i = 0; i < allRows.length; i++) {
                var trclassName = allRows[i].className.replace(".", "_");
                var allCheckedOptions = $("." + trclassName + " td input:checkbox:checked");
                for (var j = 0; j < allCheckedOptions.length; j++) {
                    let obj = {
                        platform: allRows[i].getAttribute('name'),
                        name: $(allCheckedOptions[j]).next('span').attr("name"),
                        version: $(allCheckedOptions[j]).next('span').text().trim()
                    }
                    selectedPlatformVersions.push(obj);
                }
            }
            console.log(selectedPlatformVersions)
            return selectedPlatformVersions;
        }


        $(document).on('click', '#btTestAdd', function () {
            $("#AddTestCaseModal").modal({ backdrop: 'static', keyboard: false });
            saas_object.loadTestCaseSelectionTree();
        });

        $(document).on('click', '#testCaseCleanButton', function () {
            $('#testCaseSearchArea').val('');
            $("#testCaseSelectionTree").jstree(true).search('');
        });


        // Delete row on delete button click
        $(document).on("click", ".delete", function () {
            debugger
            $(this).parents("tr").remove();
            $(".add-new").removeAttr("disabled");
        });

    }

})(this);