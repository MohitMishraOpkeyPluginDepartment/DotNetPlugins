$(document).ready(function (){

	var saas_object=new Saas();
	$("button#pause_button").click(function(){
		var x = $("i").attr("class");
		if(x=="glyphicon glyphicon-pause")
			$("i#pause").attr("class","glyphicon glyphicon-play");
		else
			$("i#pause").attr("class","glyphicon glyphicon-pause");
    });
	$('#addModalContent').dialog({
		width:325,
		height:450,
		title:"Add a Step in Recorder Grid",
		autoOpen : false,
		modal : true,
		show : "blind",
		hide : "blind",
		buttons: {
			"OK": function(){
				alert("hello");
				saas_object.ShowToastMessage("warning","You are about to be logged out!");
				$( this).dialog( "close" );
			},
			"Close": function(){
				$(this).dialog( "close" );
			}
		}
	});
	$('#addrow').click(function(e){
		$("#addModalContent").dialog("open");
	});
	$('#delrow').click(function(){
		$("#delModalContent").dialog("open");
	});
	$('#delModalContent').dialog({
		width:400,
		height:250,
		title:"Delete a row",
		autoOpen : false, 
		modal : true, 
		show : "blind", 
		hide : "blind",
		buttons: {
			"OK": function(){
				deleteRowInGrid();
				$( this ).dialog( "close");
			},
			"Close": function() {
				$( this ).dialog( "close" );
			}
		}
	});
	$('#editModalContent').dialog({
		width:400,
		height:250,
		title:"Edit a row",
		autoOpen : false, 
		modal : true, 
		show : "blind", 
		hide : "blind",
		buttons: {
			"OK": function(){
				updateRowInGrid();
				$( this ).dialog( "close" );
			},
			"Close": function() {
				$( this ).dialog( "close" );
			}
		}
	});
});

function resetAction(){
	document.addform.addAction.value = "";
}
function resetObject(){
	document.addform.addObject.value = "";
}
function resetData(){
	document.addform.addData.value = "";
}