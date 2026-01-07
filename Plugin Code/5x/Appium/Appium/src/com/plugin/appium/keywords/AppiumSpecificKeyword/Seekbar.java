package com.plugin .appium.keywords.AppiumSpecificKeyword;

import java.util.logging.Logger;

import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInHybridApplication;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.keywords.GenericKeyword.WebObjects;
import com.plugin.appium.util.actions.Motions;

import io.appium.java_client.ios.IOSElement;

public class Seekbar implements KeywordLibrary {

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	static Logger logger = Logger.getLogger(Seekbar.class.getName());

	@NotSupportedInHybridApplication
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_SetSeekbar(AppiumObject object, int percentage)
			throws Exception {

		WebElement element = null;
		if (AppiumContext.isIOS()) {
			WebObjects.element = null;
	     	Dimension dimension=	Finder.findAppiumDriver().manage().window().getSize();
	     	System.out.println("##<< width height "+dimension.getWidth() +" "+dimension.getHeight() );
			Utils.touchActionTap(dimension.getWidth() / 2, dimension.getHeight() / 2);
			
			element = Finder.findWebElementUsingCheckPoint(object);
			Thread.sleep(5000);
			double value = (double) percentage;
			String sendKeysValue = String.valueOf(value / 100);
			IOSElement ele = (IOSElement) element;
			
			Utils.touchActionTap(dimension.getWidth() / 2, dimension.getHeight() / 2);
			
			ele.setValue("0");
			Utils.touchActionTap(dimension.getWidth() / 2, dimension.getHeight() / 2);
			
			ele.setValue(sendKeysValue);
			// ae.sendKeys(sendKeysValue);
			WebObjects.element = null;
			return Result.PASS().setOutput(true).make();
		}

		else {
			return setAndroidSeekBar(object, percentage);
		}
	}
	
	private FunctionResult setAndroidSeekBar(AppiumObject object, int percentage) throws Exception {
		WebElement element = Finder.findWebElementUsingCheckPoint(object);
		if (percentage > 100 || percentage < 0) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID)
					.setMessage(ReturnMessages.PERCENTAGE_IN_LIMIT.toString()).make();
		}

		Dimension elementSize = element.getSize();

		if (elementSize.getHeight() > elementSize.getWidth()) {
			Log.print("Seekbar is Vertical.");
			new Motions().verticalSwipeOnElement(element, percentage);

		} else {
			Log.print("Seekbar is Horizontal.");
			new Motions().horizontalSwipeOnElement(element, percentage);
		}
		
		return Result.PASS().setOutput(true).make();
	}
}
