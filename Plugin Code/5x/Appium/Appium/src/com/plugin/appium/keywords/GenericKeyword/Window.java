package com.plugin.appium.keywords.GenericKeyword;

import java.util.Set;

import org.openqa.selenium.NoSuchWindowException;
import org.openqa.selenium.WebDriver;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInApplicationMode;
import com.plugin.appium.enums.ReturnMessages;

public class Window implements KeywordLibrary {

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInApplicationMode
	public FunctionResult Method_closeSelectedWindow(String windowTitle) throws Exception {

		String temp = "";

		String baseWindow = Finder.findAppiumDriver().getWindowHandle();
		Set<String> availableWindow = Finder.findAppiumDriver().getWindowHandles();
		for (String x : availableWindow) {

			WebDriver switchedDriver = Finder.findAppiumDriver().switchTo().window(x);

			temp = temp + switchedDriver.getTitle() + Utils.getDelimiter();

			if (switchedDriver.getTitle().equalsIgnoreCase(windowTitle)) {
				Finder.findAppiumDriver().close();
				return Result.PASS().setOutput(true).make();
			}
		}

		Finder.findAppiumDriver().switchTo().window(baseWindow);

		return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
				.setMessage(ReturnMessages.verificationFailed(temp,
						Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue()))
				.make();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInApplicationMode
	public FunctionResult Method_selectWindow(String windowTitle, int index) throws Exception {
		return Method_selectWindow(windowTitle);
	}

	/**
	 * SelectWindow keyword should not fail.
	 */
	@NotSupportedInApplicationMode
	public FunctionResult Method_selectWindow(String windowTitle) throws Exception {
	    
	    try {   // pageload should be placed before switching tab
		WebDriver driver=Finder.findAppiumDriver();
		Utils.waitForPageLoad(driver);
	    } catch (Exception e) {
		System.out.println("##<< exception while page load exception message is :: " + e.getMessage());
	    }
	    
		try {
			String temp = "";
			String baseWindow = null;
			try {
				baseWindow = Finder.findAppiumDriver().getWindowHandle();
			} catch (NoSuchWindowException ex) {
				System.out.println("##<< SELECT WINDOW EXCEPTION :: " + ex.getMessage());
			}

			Set<String> availableWindow = Finder.findAppiumDriver().getWindowHandles();
			System.out.println("##<< Windows size" + availableWindow.size());
			for (String x : availableWindow) {
				WebDriver switchedDriver = Finder.findAppiumDriver().switchTo().window(x);
				// wait for the window to load completely
				System.out.println("##<< title " + switchedDriver.getTitle());
				temp = temp + switchedDriver.getTitle() + Utils.getDelimiter();

				Utils.waitForPageLoad(switchedDriver);

				if (switchedDriver.getTitle().equalsIgnoreCase(windowTitle))
					return Result.PASS().setOutput(true).make();
			}
			if (baseWindow != null) {
				Finder.findAppiumDriver().switchTo().window(baseWindow);
			}
		} catch (Exception e) {
			Log.print("@Exception while SelectWindow: " + e.getMessage());
		}

		return Result.PASS().setOutput(false).setMessage("").make();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@KeywordArgumentValidation(checkDataForWhiteSpace = { 0 }, checkDataForBlank = { 0 })
	@NotSupportedInApplicationMode
	public FunctionResult Method_setFocousOnWindow(int indx) throws Exception {

		Thread.sleep(10000);
		Set<String> availableWindow = Finder.findAppiumDriver().getWindowHandles();
		int getTotalWindowSize = availableWindow.size();
		if (indx <= getTotalWindowSize) {
			int count = 0;
			for (String x : availableWindow) {
				count++;
				if (count == indx) {
					Finder.findAppiumDriver().switchTo().window(x);
					return Result.PASS().setOutput(true).make();
				}
			}
		}

		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).make();
	}

}
