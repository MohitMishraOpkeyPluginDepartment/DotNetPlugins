package com.plugin.appium.keywords.GenericKeyword;


import java.io.IOException;

import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.Utils;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInApplicationMode;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInMobileContext;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.util.Checkpoint;

public class Radio implements KeywordLibrary {

	WebObjects webObject = new WebObjects();

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	
	public FunctionResult Method_verifyRadioButtonExist(AppiumObject object) throws Exception {
		return webObject.Method_ObjectExists(object);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	public FunctionResult Method_verifyRadioButtonEnabled(AppiumObject object) throws Exception {
		return new WebObjects().Method_getObjectEnabled(object);
	}
	
	
	public FunctionResult Method_VerifyRadioButtonSelected(AppiumObject object, int index) throws Exception {
		
		
		WebElement radioButton = Finder.findWebElementUsingCheckPoint(object);
		
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// Check The Status Of RadioButton
				if (radioButton.isSelected())

					return Result.PASS().setOutput(true).setMessage(ReturnMessages.TRUE_STATUS.toString()).make();

				else

					return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false).setMessage(ReturnMessages.FALSE_STATUS.toString()).make();
			}
		}.run();

	}
	
	
	public FunctionResult Method_SelectRadio(AppiumObject object, int indx) throws Exception {

		
		WebElement radioButton = Finder.findWebElementUsingCheckPoint(object);
		
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				

				if (radioButton.isSelected()) {
					// Check RadioButton Is Selected Or Not

					return Result.PASS().setOutput(true).setMessage(ReturnMessages.ALREADY_CHECKED.toString()).make();

				} else {
					
					Utils.performClick(radioButton);

					return Result.PASS().setOutput(true).make();
				}
			}
		}.run();
	}

	/**
     * 
     * 
     * 
     * 
     */
	@NotSupportedInMobileContext
	public FunctionResult Method_deFocusRadioButton() throws Exception {
		return null;
	}

}