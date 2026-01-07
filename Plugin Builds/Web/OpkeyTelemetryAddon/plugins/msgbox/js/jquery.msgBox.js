/*
jQuery.msgBox plugin
Version: 0.1.1 (trying to follow http://semver.org/)
Code repository: https://github.com/dotCtor/jQuery.msgBox

Copyright (c) 2011-2013 Halil İbrahim Kalyoncu and Oliver Kopp
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

// users may change this variable to fit their needs
//var msgBoxImagePath = "images/";
var msgBoxImagePath = "/IconImages/Used/";

jQuery.msgBox = msg;
function msg(options) {
    var isShown = false;
    var typeOfValue = typeof options;
    var defaults = {
        content: (typeOfValue == "string" ? options : "Message"),
        title: "Warning",
        type: "alert",
        autoClose: false,
        timeOut: 0,
        modal: false,
        showButtons: true,
        buttons: [{ value: "OK" }],
        inputs: [{ type: "text", name: "userName", header: "User Name" }, { type: "password", name: "password", header: "Password" }],
        success: function (result) { },
        beforeShow: function () { },
        afterShow: function () { },
        beforeClose: function () { },
        afterClose: function () { },
        // opacity: 0.1
    };
    options = typeOfValue == "string" ? defaults : options;
    if (options.type != null) {
        switch (options.type) {
            case "alert":
                options.title = options.title == null ? "Warning" : options.title;
                break;
            case "info":
                options.title = options.title == null ? "Information" : options.title;
                break;
            case "error":
                options.title = options.title == null ? "Error" : options.title;
                break;
            case "success":
                options.title = options.title == null ? "Success" : options.title;
                options.buttons = options.buttons == null ? [{ value: "OK" }, { value: "Cancel" }] : options.buttons;
                break;
            case "confirm":
                options.title = options.title == null ? "Confirmation" : options.title;
                options.buttons = options.buttons == null ? [{ value: "OK" }, { value: "Cancel" }] : options.buttons;
                break;
            case "prompt":
                options.title = options.title == null ? "Log In" : options.title;
                options.buttons = options.buttons == null ? [{ value: "OK" }, { value: "Cancel" }] : options.buttons;
                break;
            default:
                image = "<div class='op-icon op-warning'>!</div>";
        }
    }
    options.timeOut = options.timeOut == null ? (options.content == null ? 500 : options.content.length * 70) : options.timeOut;
    options = $.extend({}, defaults, options);
    if (options.autoClose) {
        setTimeout(hide, options.timeOut);
    }

    if (options.success) {
        $('.msgBoxBackGround').remove();
    }

    var image = "";

    // switch (options.type) {
    //     case "alert":
    //         image = "<div class='op-icon op-warning'>!</div>";
    //         break;
    //     case "info":
    //         image = "<div class='op-icon op-info'>i</div>";
    //         break;
    //     case "error":
    //         image = "<div class='op-icon op-error op-animate-error-icon'> <span class='op-x-mark op-animate-x-mark'><span class='op-x-mark-line-left'></span><span class='op-x-mark-line-right'></span></span></div>";
    //         break;
    //     case "success":
    //         image = "<div class='op-icon op-success op-animate-success-icon'><div class='op-success-circular-line-left' style='background: rgb(255, 255, 255);'></div><span class='op-success-line-tip op-animate-success-line-tip'></span> <span class='op-success-line-long op-animate-success-line-long'></span><div class='op-success-ring'></div><div class='op-success-fix' style='background: rgb(255, 255, 255);'></div><div class='op-success-circular-line-right' style='background: rgb(255, 255, 255);'></div></div>";
    //         break;
    //     case "confirm":
    //         image = "<div class='op-icon op-question'>?</div>";
    //         break;
    //     default:
    //         image = "<div class='op-icon op-warning'>!</div>";
    // }


    switch (options.type) {
        case "alert":
            image = '<span class="op-icon icon_box alert-iconBox"> <i class="oci oci-alert-triangle font_20px" style="color:#DC6803;"></i></span>';
            break;
        case "info":
            image = '<span class="op-icon icon_box info-iconBox"> <i class="oci oci-alert-circle font_20px" style="color:#1C7C92;"></i></span>';
            break;
        case "error":
            image = '<span class="op-icon icon_box error-iconBox"><i class="oci oci-alert-circle font_20px" style="color:#D92D20;"></i></span>';
            break;
        case "success":
            image = '<span class="op-icon icon_box success-iconBox"><i class="oci oci-check-circle font_20px" style="color:#039855;"></i></span>';
            break;
        case "confirm":
            image = '<span class="op-icon icon_box confirm-iconBox"><i class="oci oci-check-circle font_20px" style="color:#DC6803;"></i></span>';
            break;
        case "delete":
            image = '<span class="op-icon icon_box delete-iconBox"><i class="oci oci-alert-circle font_20px" style="color:#D92D20;"></i></span>';
            break;
        default:
            image = '<span class="op-icon icon_box none-iconBox"><i class="oci oci-alert-circle font_20px" style="color:#1C7C92;"></i></span>';
    }


    var MsgBoxHeader = "";

    switch (options.type) {
        case "alert":
            MsgBoxHeader = '<h4 class="msgheader">Alert</h4>';
            break;
        case "info":
            MsgBoxHeader = '<h4 class="msgheader">Info</h4>';
            break;
        case "error":
            MsgBoxHeader = '<h4 class="msgheader">Error</h4>';
            break;
        case "success":
            MsgBoxHeader = '<h4 class="msgheader">Success</h4>';
            break;
        case "confirm":
            MsgBoxHeader = '<h4 class="msgheader">Confirm</h4>';
            break;
        case "delete":
            MsgBoxHeader = '<h4 class="msgheader">Delete</h4>';
            break;
        default:
            MsgBoxHeader = '<h4 class="msgheader">Default</h4>';
    }


    var divId = "msgBox" + new Date().getTime();

    /* i was testing with ($.browser.msie  && parseInt($.browser.version, 10) === 7) but $.browser.msie is not working with jQuery 1.9.0 :S. Alternative method: */
    if (navigator.userAgent.match(/msie 7/i) !== null) { var divMsgBoxContentClass = "msgBoxContentIEOld"; } else { var divMsgBoxContentClass = "msgBoxContent"; }

    var divMsgBoxId = divId;
    var divMsgBoxContentId = divId + "Content";
    var divMsgBoxImageId = divId + "Image";
    var divMsgBoxButtonsId = divId + "Buttons";
    var divMsgBoxBackGroundId = divId + "BackGround";
    var firstButtonId = divId + "FirstButton";
    

    var buttons = "";
    var isFirstButton = true;
    $(options.buttons).each(function (index, button) {
        var add = "";
        if (isFirstButton) {
            add = ' id="' + firstButtonId + '"';
            isFirstButton = false;
        }
        buttons += "<input class=\"msgButton " + button.value + "\" type=\"button\" name=\"" + button.value + "\" value=\"" + button.value + "\"" + add + "/>";
    });

    var inputs = "";
    $(options.inputs).each(function (index, input) {
        var type = input.type;
        if (type == "checkbox" || type == "radiobutton") {
            inputs += "<div class=\"msgInput\">" +
            "<input aria-label='input' type=\"" + input.type + "\" name=\"" + input.name + "\" class=\"" + input.name + "\" autofocus onfocus=\"this.select()\"  " + (input.checked == null ? "" : "checked ='" + input.checked + "'") + " value=\"" + (typeof input.value == "undefined" ? "" : input.value) + "\" />" +
            "<text>" + input.header + "</text>" +
            "</div>";

        }
        else {
            inputs += "<div class=\"msgInput\">" +
            "<div class=\"msgInputHeader\">" + input.header + "<div>" +
            "<input aria-label='input' type=\"" + input.type + "\" name=\"" + input.name + "\" maxlength=\"255\" autofocus onfocus=\"this.select()\" value=\"" + (typeof input.value == "undefined" ? "" : input.value.replace(/"/g, '&quot;')) + "\" />" + // set autofocuse and setauto select text on input 
            "</div>";
        }
    });

    //var divBackGround = "<div id=\"" + divMsgBoxBackGroundId + "\" class=\"msgBoxBackGround\"></div>";
    var divTitle = "<div class=\"msgBoxTitle\">" + options.title + " <button aria-label='close' class=\"btn app_closeRadiusBtn msgButtonHide cancel\" type=\"button\" name=\"cancel\" value=\"cancel\"><span class=\"k-icon k-i-close\"></span></button></div>";
    var divContainer = "<div class=\"msgBoxContainer gherkinMsgWrapper\"><div class=\"msgBoxContainerHeight\"><div class=\"LoadMsgBoxScroller\"><div id=\"" + divMsgBoxContentId + "\" class=\"" + divMsgBoxContentClass + "\"><div readonly>" + options.content + "</div></div></div></div></div>";
    var divButtons = "<div id=\"" + divMsgBoxButtonsId + "\" class=\"msgBoxButtons\">" + buttons + "</div>";
    var divInputs = "<div class=\"msgBoxInputs\">" + inputs + "</div>";

    var divMsgBox;
    var divMsgBoxContent;
    var divMsgBoxImage;
    var divMsgBoxButtons;
    var divMsgBoxBackGround;

    if (options.type == "prompt") {
        $("body").append("<div id=\"" + divMsgBoxBackGroundId + "\" class=\"msgBoxBackGround\"><div id=\"" + divMsgBoxId + "\" class=\"msgBox\">" + divTitle + "<div id=\"" + divMsgBoxImageId + "\" class=\"msgBoxIcon\">" + image + "</div>" + "<div class=\"msgBoxFakeDiv\">" + MsgBoxHeader + divContainer + (options.showButtons ? divButtons + "</div>" : "</div>") + "</div></div>");
        divMsgBox = $("#" + divMsgBoxId);
        divMsgBoxContent = $("#" + divMsgBoxContentId);
        divMsgBoxImage = $("#" + divMsgBoxImageId);
        divMsgBoxButtons = $("#" + divMsgBoxButtonsId);
        divMsgBoxBackGround = $("#" + divMsgBoxBackGroundId);

        divMsgBoxImage.remove();
        divMsgBoxButtons.css({ "text-align": "center", "margin-top": "5px" });
        divMsgBoxContent.css({ "width": "100%", "height": "100%" });
        divMsgBoxContent.html(divInputs);
    }
    else {
        $("body").append("<div id=\"" + divMsgBoxBackGroundId + "\" class=\"msgBoxBackGround\"><div id=\"" + divMsgBoxId + "\" class=\"msgBox\">" + divTitle + "<div id=\"" + divMsgBoxImageId + "\" class=\"msgBoxIcon\">" + image + "</div>" + "<div class=\"msgBoxFakeDiv\">" + MsgBoxHeader + divContainer + (options.showButtons ? divButtons + "</div>" : "</div>") + "</div></div>");
        divMsgBox = $("#" + divMsgBoxId);
        divMsgBoxContent = $("#" + divMsgBoxContentId);
        divMsgBoxImage = $("#" + divMsgBoxImageId);
        divMsgBoxButtons = $("#" + divMsgBoxButtonsId);
        divMsgBoxBackGround = $("#" + divMsgBoxBackGroundId);
    }

    var width = divMsgBox.width();
    var height = divMsgBox.height();
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();

    var top = windowHeight / 2 - height / 2;
    var left = windowWidth / 2 - width / 2;

    show();

    function show() {

        if (isShown) {
            return;
        }
        //divMsgBox.css({ opacity: 0, top: top - 50, left: left });
        //divMsgBox.css("background-image", "url('"+msgBoxImagePath+"msgBoxBackGround.png')");
        //divMsgBoxBackGround.css({ opacity: options.opacity });
        options.beforeShow();
        divMsgBoxBackGround.css({ "width": $(document).width(), "height": getDocHeight() });
        $(divMsgBoxId + "," + divMsgBoxBackGroundId).fadeIn(0);
        divMsgBox.addClass("op-MSGshow");
        setTimeout(options.afterShow, 200);

        $("#" + firstButtonId).focus();

        setTimeout(function () {
            $("#" + firstButtonId).focus();           // SAS-8416 By Gautam changes            
        }, 20)


        setTimeout(function () {
            $("#" + firstButtonId).focus();         // SAS-8416 By Gautam             
        }, 50)

        setTimeout(function () {
            $("#" + firstButtonId).focus();         // SAS-8416 By Gautam             
        }, 100)

        setTimeout(function () {
            $('.msgBoxContainer input[autofocus]').focus();          // SAS-7379 By Gautam 
        }, 150)

        //setTimeout(function () {
        //    $("#" + firstButtonId).focus();         // SAS-8416 By Gautam             
        //}, 500)

        //setTimeout(function () {
        //    $("#" + firstButtonId).focus();         // SAS-8416 By Gautam             
        //}, 1000)

        // $('input[autofocus]').focus();

        $("#MainBody,.MainGuestBodyClass").click(function (e) {
            //  e.stopPropagation();
            $("#" + firstButtonId).focus();
            $('input[autofocus]').focus();
        });

        jQuery("div.msgBox").click(function (e) {
            e.stopPropagation();  //************** SAS-8658
        });

        isShown = true;
        //$(window).bind("resize", function (e) {
        //    var width = divMsgBox.width();
        //    var height = divMsgBox.height();
        //    var windowHeight = $(window).height();
        //    var windowWidth = $(window).width();

        //    var top = windowHeight / 2 - height / 2;
        //    var left = windowWidth / 2 - width / 2;

        //    divMsgBox.css({ "top": top, "left": left });
        //    divMsgBoxBackGround.css({ "width": "100%", "height": "100%" });

        //});
        $('.msgInput').find('input[type=text],select').each(function () { this.select(); })


        //var lines = $("div").text().split('\n');
        var preLines = $(".msgBoxContent>div").text().split('\n').filter(function (v) { return v !== '' });
        var preToFindHTML = $(".msgBoxContent>div")[0].innerHTML.split('\n').filter(function (v) { return v !== '' });
        var preLinesCount = preLines.length;

        if (preLinesCount >= 3) {
            // alert();
            $(".msgBoxContent").css("text-align", "left");
        };

        if (preLinesCount >= 15) {
            // alert();
            $(".msgBoxButtons").append("<button class='msgButton msgBoxfullscreen' type='button'><i class='fa fa-arrows-alt'> </i></button>");
        };

        for (var i = 0; i < preToFindHTML.length; i++) {
            var index = preToFindHTML[i].search("<style>");
            if (index >= 0)
                break;
            else
                continue;

        };
        if (index > 0) {
            //$(".msgBoxContent").wrap("<iframe></iframe>");
            // alert("find");
            $(".msgBoxContent").css("white-space", "normal");
            $(".msgBoxIcon .op-icon").remove();
            $(".msgBoxIcon").append('<span class="op-icon icon_box error-iconBox"><i class="oci oci-alert-circle font_20px" style="color:#D92D20;"></i></span>');

        };

        $(".msgBoxfullscreen").click(function () {
            $("div.msgBox").toggleClass("MSGfullscreenWidth");

        });

        $('.msgBoxContainerHeight').each(function () {


            //var self = $(this),
            container = $(this).parent('div.msgBoxContainer');

            $(this).height(container[0].offsetHeight + 15);
            $(this).css('max-height', '340px');

        });
       $("div.LoadMsgBoxScroller").addClass("MSGScrollAuto gherkinMsgBox");
    }


    function close(e) {
    }

    function hide() {
        if (!isShown) {
            return;
        }
        options.beforeClose();
        divMsgBox.addClass("op-MSGhide");
        divMsgBoxBackGround.fadeOut(300);
        setTimeout(function () { divMsgBox.remove(); divMsgBoxBackGround.remove(); }, 300);
        setTimeout(options.afterClose, 300);
        isShown = false;
    }

    function getDocHeight() {
        var D = document;
        return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight));
    }

    function getFocus() {
        ///divMsgBox.fadeOut(200).fadeIn(200);

    }

    $("input.msgButton,.msgButtonHide").click(function (e) {
        e.preventDefault();
        var value = $(this).val();
        if (options.type != "prompt") {
            options.success(value);
        }
        else {
            var inputValues = [];
            $("div.msgInput input").each(function (index, domEle) {
                var name = $(this).attr("name");
                var value = $(this).val();
                var type = $(this).attr("type");
                if (type == "checkbox" || type == "radiobutton") {
                    inputValues.push({ name: name, value: value, checked: $(this).attr("checked") });
                }
                else {
                    inputValues.push({ name: name, value: value });
                }
            });
            options.success(value, inputValues);
        }
        hide();
    });

    divMsgBoxBackGround.click(function (e) {
        if (options.modal)
            return;
        if (!options.showButtons || (options.showButtons && options.buttons.length < 2) || options.autoClose) {
            hide();
        }
        else {
            getFocus();
        }
    });

    //   setting keyup event on jquery msgbox for save and cancel
    $(".msgBox").keyup(function (e) {
        var msgBox = $('.msgBox').find(".msgButton");
        if (!msgBox.is(':focus')) {
            var msgBoxOk = msgBox[0];
            if (e.which == 13) {
                //  alert("Document");
                if (!$(msgBoxOk).is(':focus')) {
                    $('.msgButton')[0].click();
                }
            }
            e.preventDefault();
            e.stopImmediatePropagation();
        }
        var msgBoxCancel = msgBox[1];
        if (e.which == 27) {
            //   alert("Document");
            //commented as requested SAS-7050
            //if (!$(msgBoxCancel).is(':focus')) {
            //    $('.msgButton')[1].click();
            //}
            $('.msgButton')[2].click();
        }
        e.preventDefault();
        e.stopImmediatePropagation();
    });


    //Mousetrap.bind(['enter'], function (e) {
    //    // alert("Bind");
    //    var msgBox = $('.msgBox').find(".msgButton");
    //    var msgBoxOk = msgBox[0];
    //    if (!$(msgBoxOk).is(':focus')) {
    //        $('.msgButton')[0].click();

    //    }
    //});
    Mousetrap.bind(['esc'], function (e) {
        var msgBox = $('.msgBox').find(".msgButton");
        var msgBoxCancel = msgBox.length == 3 ? msgBox[2] : msgBox[1];              //SAS-7050
        if (!$(msgBoxCancel).is(':focus')) {
            $(msgBoxCancel).click();
        }
    });



};
