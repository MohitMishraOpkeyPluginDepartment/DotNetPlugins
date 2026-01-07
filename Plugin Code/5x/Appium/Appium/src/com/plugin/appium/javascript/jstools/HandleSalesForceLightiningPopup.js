var isOpkeySalesforceLightningPopupHandlerJSInjected = true;

function handlePopup(){
	var popup = document.getElementById("tryLexDialogX");
	if(popup){
	   popup.click();
	}
}

window.setInterval(handlePopup, 1000);