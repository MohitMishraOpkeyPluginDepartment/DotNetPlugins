package com.plugin.appium.keywords.AppiumSpecificKeyword;


import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInHybridApplication;

public class Toggle implements KeywordLibrary{

	
	@NotSupportedInHybridApplication
	public FunctionResult Method_selectToggele(AppiumObject object)
			throws Exception {
		return new Switch().Method_selectSwitch(object);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInHybridApplication
	public FunctionResult Method_verifyToggleStatus(AppiumObject object,
			String status) throws Exception {
		 return new Switch().Method_verifySwitchStatus(object, status);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInHybridApplication
	public FunctionResult Method_getToggleStatus(AppiumObject object) throws Exception {
		return new Switch().Method_getSwitchStatus(object);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	 @NotSupportedInHybridApplication
	 public FunctionResult Method_deSelectToggle(AppiumObject object) throws Exception{
		 return new Switch().Method_deSelectSwitch(object);
	 }
	 
	 /*
	  * 
	  * 
	  * 
	  * 
	  * */	
	 @NotSupportedInHybridApplication
	 public FunctionResult Method_Toggle(AppiumObject object) throws Exception{
		 return new Switch().Method_Switch(object);		 
	 }
	 
}
