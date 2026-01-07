package com.plugin.appium.enums;

public enum ReturnMessages {

	
	ALREADY_CHECKED                      ("Already Checked"),
	UNCHECK                              ("Already Unchecked"),
	VERFIYED                             ("Verified"), 
	NOT_VERFIED                          ("Not verified"),
    NOTEDITABLE                          ("Element is not editable"),
    EDITABLE                             ("Element is  editable"),
    EXIST                                ("Element Exists"),
    NOTEXIST                             ("Element does not Exists"),
    MATCHTOOLTIP                         ("Tooltip matched"),
    MATCHTEXT                            ("Element text matched with given text"),
    UNMATCHTEXT                          ("Element text unmatched with given text"),
    MATCHNAME                            ("Provided name matched from object name"), 
    MATCHVALUE                           ("Provided value matched from object default value"),
    ENABLED                              ("Element is enabled"),
    NOTENABLED                           ("Element is disabled or not visible"),
    TYPEKEYS                             ("Keys typed sucessfully"),
    VISIBLE                              ("Element is visible"),
    INVISIBLE                            ("Element is invisible"),
    MATCH_PROPERTY                       ("Property-Name and value matched"),
    MATCH_COUNT                          ("Count matched"),
    MATCH_SELECTED                       ("Selected element matched"),
    ALL_MATCH                            ("All element are matched"),
    ALL_LINK_MATCH                       ("All link are matched"),
    Match_LENGTH                         ("Length are matched"),
    MATCH_ROWS_AND_COLS                  ("Element rows and cols are matched"),
    PROPERTY_NOT_FOUND                   ("Property not found"),
    ITEM_EXIST                			 ("Item Exists"),
    NOT_SELECTED                         ("No item is selected"),
    TYPE_TEXT                            ("Text typed successfully"),
    POPUP_NOT_FOUND                      ("Popup not found"),
    SWIPE                                ("Swiped sucessfully"),
    APPIUM_NOT_SUPPURTED				 ("This method is not supported in mobile context"),
    FLICKED                              ("Flicked sucessfully"),
    ONLY_WEBVIEWS_SUPPORT           	 ("This method only work with webviews in hybrid application or in Browser Apk"),
    ONLY_NATIVE_APPLICATION_SUPPORTED    ("This method is only working with native application"),
    ONLY_BROWSER_SUPPORTED               ("This method is only supported in mobile browser"),
    ALREADY_ON                    		 ("Already ON"),
    ALREADY_OFF							 ("Already OFF"),
    ALREADY_SELECTED                     ("Already Selected"),
    SWIPE_NOT_SUCESS                     ("Input coordinates must be positive and with in the device Screen size"),
	ITEM_NOT_SELECTED					 ("Item not selected"),
    DEVICE_NOT_CONNECTED           		 ("Device not found"),
    PERCENTAGE_IN_LIMIT                  ("Give percentage in between 0 to 100"),
    ELEMENT_NOT_EXIST_IN_DROPDOWN      	 ("Element does not exist in given object"),
	WINDOW_NOT_EXIST					 ("A request to switch to a different window could not be satisfied because the window could not be found"),
	APPIUM_SERVER_BUSY                   ("Requested a new session but one was in progress.Please restart your appium server "),
	SELE$NDROID_SERVER_BUSY				 ("Waited 20 secs for selendroid server and it never showed up.Please restart your device"),
	PORT_IS_ALREADY_USED				 ("Either the port is busy or Server address not valid"),
	Appium_NODEMODULE_APPIUMEXE_NOTEXIST ("Either the Appium.exe not exist or node_modules not Exist"),
	Appium_Exe_Path_Not_Set				 ("Kindly set the path of Appium.exe from  OpKey Agent -> Tools -> Plugin Settings -> Appium Plugin -> AppiumServer"),	
	SELENDROID_PORT_BUSY				 ("Port 8080 is used by another process"),
	TRUE_STATUS                          ("Status is true"),
	FALSE_STATUS                         ("Status is false"),
	SCREENCAST_NOT_OPEN					 ("Unable to open Screencast"),
	WRONG_APP_PATH                       ("Application not found at given path , App paths need to be absolute, or relative to the appium server install dir, or a URL to compressed file"),
	BUTTON_NOT_FOUND                     ("Unable to proceed command button not found"), 
	JRE_PATH_NOT_SET                     ("JRE path not properly set in Environment variable"),
	NOT_SUPPORTED_IN_IOS				 ("This action in not supported in IOS application");
	;

	private final String message;

	ReturnMessages(String message) {
		this.message = message;
	}

	@Override
	public String toString() {
		return message;
	}

	public static  String verificationFailed(Object actualFound , Object expected)
	{
		return "Actually Found  :<" + actualFound + ">"
				+ "and Expected :<" + expected + ">";
	}
}