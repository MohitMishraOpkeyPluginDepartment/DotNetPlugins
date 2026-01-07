package com.plugin.appium.keywords.GenericKeyword;


import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriverException;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.Utils;
import com.plugin.appium.annotations.keywordValidation.KeywordActionType;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInMobileContext;
import com.plugin.appium.enums.ActionType;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.util.Checkpoint;

public class Button implements KeywordLibrary {

	WebObjects webobject = new WebObjects();

	/**
	 * 
	 * 
	 * Checkpoint supported
	 * 
	 */
	
	

	public FunctionResult Method_verifyButtonEnabled(AppiumObject object) throws Exception {
		return webobject.Method_ObjectisEnabled(object);
	}

	/**
	 * 
	 * Checkpoint supported
	 * 
	 * 
	 */
	public FunctionResult Method_verifyButtonExist(AppiumObject object) throws Exception {
		return webobject.Method_ObjectExists(object);
	}

	/**
	 * 
	 * 
	 * Checkpoint supported
	 * 
	 */
	
	public FunctionResult Method_verifyButtonToolTip(AppiumObject object, String userToolTipText) throws Exception {
		
		FunctionResult toolTip = webobject.Method_getObjectToolTip(object);
		
		return toolTip;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	public FunctionResult Method_clickButton(AppiumObject object) throws Exception {
		return webobject.Method_ObjectClick(object);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInMobileContext
	public FunctionResult Method_deFocusButton() throws Exception {
		return null;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	public FunctionResult Method_focusButton(AppiumObject object) throws Exception {
		com.plugin.appium.Finder.findWebElementUsingCheckPoint(object);
        ((JavascriptExecutor)Finder.findAppiumDriver()).executeScript("arguments[0].focus()", new Object[]{Finder.findWebElement(object)});
        return Result.PASS().setOutput(true).make();
	}
	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getButtonToolTip(AppiumObject object) throws Exception {
		String output = Utils.getAttrAndIgnoreExcecption(Finder.findWebElementUsingCheckPoint(object), "title");
        return Result.PASS().setOutput(output).make();
	    
	}

	/* 
	 * 
	 * 
	 * 
	 * 
	 * */
	
	public FunctionResult Method_doubleClickButton(AppiumObject object) throws Exception {
		return new WebObjects().Method_dblClick(object);
	}
	
	public FunctionResult Method_verifyAllButtons(String allButtons) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				String outputValue = new Deprecate().Method_getAllButtons().getOutput();
				List<String> actualElements = Arrays.asList(outputValue.split(";"));
				List<String> expectedElements = Arrays.asList(allButtons.split(";"));

				if (actualElements.size() != expectedElements.size()) {
					return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
							.setMessage(com.plugin.appium.Utils.verification_failed(outputValue, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue())).make();
				}

				List<String> matchedElements = actualElements.stream().filter(s -> expectedElements.stream().filter(a -> a.equals(s)).collect(Collectors.toList()).contains(s))
						.collect(Collectors.toList());


				if (outputValue.isEmpty()) {
					return Result.PASS().setMessage("No Button found").make();
				} else {
					if (actualElements.size() == matchedElements.size()) {
						return Result.PASS().setOutput(true).make();
					} else {
						return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
								.setMessage(com.plugin.appium.Utils.verification_failed(outputValue, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue())).make();
					}
				}
			}
		}.run();
	}
}