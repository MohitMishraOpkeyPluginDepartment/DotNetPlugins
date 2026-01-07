
window.onload = function () {

    $(document).on('input change', '#txtStepSnapshot', function () {
        debugger;
        var slideWidth = $(this).val() * 100 / 100;
        //$("#divStepSnapshot .custome_slide").css("width", slideWidth + "%");
        $(".step_snapshot").removeClass("active");
        $("#demo").html(slideWidth);

        if (slideWidth > 0 && slideWidth < 40 || slideWidth == 50) {
            $("#FailedSteps").addClass("active");
            $("#divStepSnapshot .custome_slide").css("width", "49.3%");
            $(this).val(50);
        }

        if (slideWidth > 40 && slideWidth < 50 || slideWidth == 0) {
            $("#NoSteps").addClass("active");
            $("#divStepSnapshot .custome_slide").css("width", "0%");
            $(this).val(0);
        }
    
        if (slideWidth > 50 && slideWidth < 90 || slideWidth == 100) {
            $("#AllSteps").addClass("active");
            $("#divStepSnapshot .custome_slide").css("width", "calc(100% - 20px)");
            $(this).val(100);
        }

        if (slideWidth > 90 && slideWidth < 100 || slideWidth == 50) {
            $("#FailedSteps").addClass("active");
            $("#divStepSnapshot .custome_slide").css("width", "49.3%");
            $(this).val(50);
        }
    });

    $(document).on('input change', '#txtStepQuality', function () {
        debugger;
        var slideWidth = $(this).val() * 100 / 100;
       // $("#divStepQuality .custome_slide").css("width", slideWidth + "%");
        $(".step_quality").removeClass("active");

        if (slideWidth > 0 && slideWidth < 40 || slideWidth == 50) {
            $("#MediumStep").addClass("active");
            $("#divStepQuality .custome_slide").css("width", "49.3%");
            $(this).val(50);
        }

        if (slideWidth > 40 && slideWidth < 50 || slideWidth == 0) {
            $("#LowStep").addClass("active");
            $("#divStepQuality .custome_slide").css("width", "0%");
            $(this).val(0);
        }

        if (slideWidth > 50 && slideWidth < 90 || slideWidth == 100) {
            $("#HighStep").addClass("active");
            $("#divStepQuality .custome_slide").css("width", "calc(100% - 20px)");
            $(this).val(100);
        }

        if (slideWidth > 90 && slideWidth < 100 || slideWidth == 50) {
            $("#MediumStep").addClass("active");
             $("#divStepQuality .custome_slide").css("width", "49.3%");
            $(this).val(50);
        }
    });

    $(document).on('input change', '#txtStepTimeout', function () {
        debugger;
        var slideWidth = $(this).val() * 100 / 300;
        $('#txtInputStepTimeout').val(Math.floor($(this).val()));
        $("#txtStepTimeout").attr("value", Math.floor($(this).val()));

        $("#StepTimeout .custome_slide").css("width", (slideWidth - 1.4) + "%");
        $(".step_timeout").removeClass("active");
        

        if (slideWidth < 40) {
            $("#LowTimeout").addClass("active");
        } else if (slideWidth < 90) {
            $("#MediumTimeout").addClass("active");
        } else {
            $("#HighTimeout").addClass("active");
        }
    });

    $(document).on('input change', '#txtInputStepTimeout', function () {
        debugger;
        var customeValue = Math.floor($(this).val());
        if (customeValue < 5 || customeValue > 300 ) {
            $("#spSliderError").show();
            $("#txtStepTimeout").attr("value", 5);
            $("#txtStepTimeout").val(5);
            $("#StepTimeout .custome_slide").css("width", "0%");
            return;
        }

        $("#spSliderError").hide();
        $("#txtStepTimeout").attr("value", customeValue);
        $("#txtStepTimeout").val(customeValue);
        $("#StepTimeout .custome_slide").css("width", (customeValue / 3 - 1.4) + "%");
     
    });
	
    $("#txtStepTimeout").val(90);
    $("#StepTimeout .custome_slide").css("width", "28.5%");
    $("#LowTimeout").addClass("active");
    $("#spSliderError").hide();
}