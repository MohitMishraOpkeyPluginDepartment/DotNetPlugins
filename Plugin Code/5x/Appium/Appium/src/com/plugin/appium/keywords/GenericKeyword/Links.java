package com.plugin.appium.keywords.GenericKeyword;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.annotations.keywordValidation.KeywordActionType;
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInNativeApplication;
import com.plugin.appium.enums.ActionType;
import com.plugin.appium.enums.ReturnMessages;

public class Links implements KeywordLibrary {

	WebObjects webObject = new WebObjects();

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInNativeApplication
	public FunctionResult Method_clickLink(AppiumObject object)
			throws Exception {
				
		return webObject.Method_ObjectClick(object);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInNativeApplication
	public FunctionResult Method_verifyLinkEnabled(AppiumObject object)
			throws Exception {
		return 	webObject.Method_ObjectisEnabled(object);
		}		

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInNativeApplication
	public FunctionResult Method_verifyLinkExist(AppiumObject object)
			throws Exception {
		return webObject.Method_ObjectExists(object);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	public FunctionResult Method_verifyLinkToolTip(AppiumObject object,
			String userToolTipText) throws Exception {
		return new WebObjects().Method_verifyObjectToolTip(object, userToolTipText);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInNativeApplication
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getLinkCount() throws Exception {

		List<WebElement> totalLinks;
        //		Get Total Total Link Use By Ahref
		totalLinks = Finder.findAppiumDriver().findElements(By.tagName("a"));   
		totalLinks.addAll(Finder.findAppiumDriver().findElements(
				By.tagName("Link"))); // Get Link For Link Tag And Add Into
										// Ahref Link
		return Result.PASS().setOutput(totalLinks.size()).make();
	}
	

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	
	@NotSupportedInNativeApplication
	@KeywordArgumentValidation(checkDataForWhiteSpace = {0})
	public FunctionResult Method_verifyLinkCount(int userLinkCount)
			throws Exception {

		List<WebElement> totalLinks;
		// Get Total link Use By Ahref
		totalLinks = Finder.findAppiumDriver().findElements(By.tagName("a")); 
		totalLinks.addAll(Finder.findAppiumDriver().findElements(
				By.tagName("Link"))); // Get Link For Link Tag And Add Into
										// Ahref Link
		if (totalLinks.size() == userLinkCount)
			return Result.PASS().setOutput(true)
					.setMessage(ReturnMessages.MATCH_COUNT.toString()).make();
		
		else {
			return Result
					.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED)
					.setOutput(false)
					.setMessage(ReturnMessages.verificationFailed(totalLinks.size(), Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue())).make();
		}
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInNativeApplication
	public FunctionResult Method_verifyLinkVisible(AppiumObject object)
			throws Exception {
		return webObject.Method_verifyObjectVisible(object);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	
	@KeywordArgumentValidation(checkDataForBlank = {0} , checkDataForWhiteSpace = {0})
	@NotSupportedInNativeApplication
	public FunctionResult Method_waitforLink(AppiumObject object,
			int timeOutInSecs) throws Exception{
		return webObject.Method_waitforObject(object, timeOutInSecs);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getLinkToolTip(AppiumObject object)
			throws Exception {
		return new WebObjects().Method_getObjectToolTip(object);		
	}
}