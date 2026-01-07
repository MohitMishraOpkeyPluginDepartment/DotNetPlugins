package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.util.Set;


import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.Finder;
import com.plugin.appium.Utils;
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

public class AndroidWindowHandling implements KeywordLibrary {

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	public FunctionResult Method_getCurrentWindow() throws ToolNotSetException, InterruptedException {
		return Result.PASS().setOutput(Utils.getCurrentWindowHandle()).make();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@KeywordArgumentValidation(checkDataForBlank = {0} , checkDataForWhiteSpace ={0})
	public FunctionResult Method_switchWindow(String switchWindow) throws ToolNotSetException, InterruptedException {
		switchWindow = switchWindow.toUpperCase();
		if (!Utils.getCurrentWindowHandle().contentEquals(switchWindow)) {
			Finder.findAppiumDriver().switchTo().window(switchWindow);
			AppiumContext.setDriverWindow(switchWindow);
			return Result.PASS().setOutput(true).make();
		}

		return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID)
				.setOutput(true)
				.setMessage("Current window is being selected ")
				.make();

	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	public FunctionResult Method_getAllWindow() throws ToolNotSetException {

		String outputVal = "";
		String currentHandle;
		// if the androdoid version >= 4.4 than than all hybrid application is
		// work as native app
		if (AppiumContext.getDeviceType() == DeviceType.Android) {
			outputVal = "NATIVE_APP";

		} else {
			Set<String> windowHandle = Finder.findAppiumDriver().getContextHandles();
			for (String winHandle : windowHandle) {
				currentHandle = winHandle.toString();
				outputVal = outputVal + currentHandle + Utils.getDelimiter();
			}
			// remove the last delemeter
			if (outputVal.endsWith(Utils.getDelimiter())) {
				outputVal = outputVal.substring(0, outputVal.length() - 1);
			}
		}

		return Result.PASS().setOutput(outputVal).make();
	}
}
