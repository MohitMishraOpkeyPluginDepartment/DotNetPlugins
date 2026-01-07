package com.plugin.appium.keywords.AppiumSpecificKeyword;

import org.openqa.selenium.WebElement;



import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.Utils;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInHybridApplication;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.TimeOut_ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.GenericKeyword.Checkbox;
import com.plugin.appium.keywords.GenericKeyword.WebObjects;

public class Switch implements KeywordLibrary {

	Checkbox checkbox = new Checkbox();

	@NotSupportedInHybridApplication
	public FunctionResult Method_selectSwitch(AppiumObject object) throws Exception {

		new WebObjects().Method_waitforObject(object, 20);
		
		WebElement we = Finder.findWebElement(object);
		// Check object Is Checked Or Not
		if (Utils.isElementSelected(we))
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.ALREADY_ON.toString()).make();

		else
			we.click();
		return Result.PASS().setOutput(true).make();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInHybridApplication
	public FunctionResult Method_verifySwitchStatus(AppiumObject object, String status) throws Exception {
		return checkbox.Method_verifyCheckBoxStatus(object, status);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInHybridApplication
	public FunctionResult Method_getSwitchStatus(AppiumObject object) throws Exception {
		WebElement we = Finder.findWebElement(object);
		String isChecked = String.valueOf(Utils.isElementSelected(we));

		if (isChecked.toUpperCase().contentEquals("TRUE"))
			isChecked = "ON";
		else
			isChecked = "OFF";

		return Result.PASS().setOutput(isChecked).make();

	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInHybridApplication
	public FunctionResult Method_deSelectSwitch(AppiumObject object) throws Exception {
		
		new WebObjects().Method_waitforObject(object, 20);
		
		WebElement we = Finder.findWebElement(object);

		// if CheckBox Is Check Then Ucheck It
		if (Utils.isElementSelected(we)) {
			we.click();
			return Result.PASS().setOutput(true).make();
		} else
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.ALREADY_OFF.toString()).make();

	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInHybridApplication
	public FunctionResult Method_Switch(AppiumObject object) throws ToolNotSetException, ObjectNotFoundException, InterruptedException, TimeOut_ObjectNotFoundException {
		WebElement ae = Finder.findWebElement(object);
		ae.click();
		return Result.PASS().setOutput(true).make();
	}
}