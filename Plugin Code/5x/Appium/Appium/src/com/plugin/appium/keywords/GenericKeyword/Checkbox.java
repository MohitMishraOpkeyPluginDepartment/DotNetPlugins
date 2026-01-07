package com.plugin.appium.keywords.GenericKeyword;

import java.io.IOException;
import java.util.logging.Logger;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;

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
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInApplicationMode;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInMobileContext;
import com.plugin.appium.enums.ActionType;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.util.Checkpoint;

public class Checkbox implements KeywordLibrary {

	static Logger logger = Logger.getLogger(Checkbox.class.getName());
	WebObjects webObject = new WebObjects();

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_selectCheckBox(AppiumObject object, String status) throws Exception {

		// webObject.Method_waitforObject(object, 20);
		if (status == null || status.length() == 0) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setOutput(false)
					.setMessage("data cannot be blank").make();
		}
		WebElement we = Finder.findWebElementUsingCheckPoint(object);
		if (we != null) {
			return selectCheckBox(we, status);
		} else {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("object not found")
					.make();

		}

	}

	public FunctionResult selectCheckBox(WebElement element, String status) throws Exception {
		Boolean checked = false;
		try {
			checked = Utils.isElementSelected(element);
			System.out.println("checked status " + checked);
		} catch (Exception e) {
			checked = false;
			System.out.println("EXCEPTOIN OCCURED " + e.getMessage());
		}

		if (checked && status.toUpperCase().contentEquals("ON")) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.ALREADY_CHECKED.toString()).make();
		} else if ((status.toUpperCase().contentEquals("ON") && !checked)
				|| (status.toUpperCase().contentEquals("OFF") && checked)) {

			System.out.println("Selecting CheckBox");

			Utils.performClick(element);

			return Result.PASS().setOutput(true).make();
		}
		return Result.PASS().setOutput(true).setMessage(ReturnMessages.UNCHECK.toString()).make();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInApplicationMode
	public FunctionResult Method_verifyCheckBoxToolTip(AppiumObject object, String userToolTipText) throws Exception {
		FunctionResult fr = new WebObjects().Method_verifyObjectToolTip(object, userToolTipText);
		return fr;
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 **/
	public FunctionResult Method_verifyCheckBoxStatus(AppiumObject object, String status) throws Exception {

		WebElement we = Finder.findWebElementUsingCheckPoint(object);
		String isChecked = String.valueOf(Utils.isElementSelected(we));

		if ((isChecked.toUpperCase().contentEquals("TRUE") && status.toUpperCase().contentEquals("ON"))
				|| (isChecked.toUpperCase().contentEquals("FALSE") && status.toUpperCase().contentEquals("OFF"))) {

			return Result.PASS().setOutput(true).make();
		}

		else {

			if (isChecked.toUpperCase().contentEquals("TRUE")) {
				isChecked = "ON";
			} else {

				isChecked = "OFF";
			}
			return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
					.setMessage(ReturnMessages.verificationFailed(isChecked,
							Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue()))
					.make();

		}
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	public FunctionResult Method_verifyCheckBoxEnabled(AppiumObject object) throws Exception {
		return webObject.Method_ObjectisEnabled(object);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	public FunctionResult Method_verifyCheckBoxExist(AppiumObject object) throws Exception {
		return webObject.Method_ObjectExists(object);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	public FunctionResult Method_deSelectCheckBox(AppiumObject object) throws Exception {

		// new WebObjects().Method_waitforObject(object, 20);

		WebElement we = Finder.findWebElementUsingCheckPoint(object);

		// if CheckBox Is Check Then Ucheck It
		if (Utils.isElementSelected(we)) {
			/*
			 * try { we.click(); } catch (Exception e) { // in some chrome driver not able
			 * to click // Exception element is not click // so we again try with java
			 * script // http://www.kabuto.com/ -- Sign-Up button if
			 * (AppiumContext.isBrowserMode()) {
			 * Finder.findJavaScriptExecuterDriver().executeScript("arguments[0].click();",
			 * we); } }
			 */

			Utils.performClick(we);
			return Result.PASS().setOutput(true).make();
		} else
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.UNCHECK.toString()).make();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInMobileContext
	public FunctionResult Method_deFocusCheckBox() throws Exception {
		return null;
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	public FunctionResult Method_focusCheckBox(AppiumObject object) throws Exception {
		new WebObjects().Method_SetFocus(object);

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// Get Focus in Safari
				((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("arguments[0].focus()",
						Finder.findWebElement(object));
				return Result.PASS().setOutput(true).make();

			}
		}.run();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@KeywordActionType({ ActionType.GET })
	public FunctionResult Method_getCheckBoxToolTip(AppiumObject object) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				String output = Finder.findWebElement(object).getAttribute("title");
				return Result.PASS().setOutput(output).make();

			}
		}.run();
	}

	@KeywordActionType({ ActionType.GET })
	public FunctionResult Method_getCheckboxStatus(AppiumObject object) throws Exception {
		WebElement element = Finder.findWebElementUsingCheckPoint(object);

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// WebElement element = null;
				boolean status = false;
				boolean isSelected = false;
				try {
					status = Boolean.parseBoolean(element.getAttribute("checked"));
					isSelected = element.isSelected();
					System.out.println("STATUS IS AS ::: " + status + " IS-SELECTED IS AS ::: " + isSelected);
				} catch (Exception e) {
					return Result.PASS().setMessage("No Element of type Checkbox found.").make();
				}
				if (status || isSelected) {
					return Result.PASS().setOutput("On").make();
				} else {
					return Result.PASS().setOutput("Off").make();
				}

			}
		}.run();

	}
}
