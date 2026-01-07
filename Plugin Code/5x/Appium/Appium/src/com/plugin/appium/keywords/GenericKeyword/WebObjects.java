package com.plugin.appium.keywords.GenericKeyword;

import java.awt.Color;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Stack;
import java.util.StringTokenizer;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.crestech.opkey.plugin.ExecutionStatus;
import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.AppiumObjectProperty;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.annotations.keywordValidation.KeywordActionType;
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInApplicationMode;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInHybridApplication;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInNativeApplication;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.ActionType;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.enums.DriverWindow;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.AppiumSpecificKeyword.Spinner;
import com.plugin.appium.keywords.GenericKeyword.actionByText.ActionByText;
import com.plugin.appium.selendroid.SelendroidWebDriver;
import com.plugin.appium.util.Checkpoint;
import com.plugin.appium.util.GenericCheckpoint;

import io.appium.java_client.AppiumDriver;

public class WebObjects implements KeywordLibrary {
	/*
	 * 
	 * 
	 * 
	 * 
	 */
	public static WebElement element = null;
	int flag = 0;
	static int elementPart;
	String elementPath = null;
	String elementFileName = null;
	String screenShotPath = null;

	static Stack<HighlightedElement> highlightedElements = new Stack<HighlightedElement>();

	public static Stack<HighlightedElement> HighlightedElements() {
		return highlightedElements;
	}

	public static boolean hasHighlightedElements() {
		return !highlightedElements.empty();
	}

	public WebElement getWaitForObjectElement(AppiumObject object, int timeOutInSecs) throws Exception {
		element = null;
		Method_waitforObject(object, timeOutInSecs);
		return element;
	}

	/**
	 * checkpoint Supported
	 * 
	 * @param object
	 * @param timeOutInSecs
	 * @return
	 * @throws Exception
	 */

	public FunctionResult Method_waitforObject(AppiumObject object, int timeOutInSecs) throws Exception {

		Finder.findWebElementUsingCheckPoint(object, timeOutInSecs);

		return Result.PASS().setOutput(true).make();
	}

	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_waitforObject_old(AppiumObject object, int timeOutInSecs)
			throws InterruptedException, com.plugin.appium.exceptionhandlers.ToolNotSetException {

		if (Context.current().getKeywordRemaningSeconds() < timeOutInSecs) {
			timeOutInSecs = Context.current().getKeywordRemaningSeconds();
		}

		long timeOutmiliSecs = (long) (timeOutInSecs * 1000.00);

		Date startTime = Calendar.getInstance().getTime();
		Finder.startTime = startTime;

		boolean isRunAppInBackground = Boolean.valueOf(Context.session().getSettings().get("RunAppInBackground"));
		Finder.needMinimizeInWaitForObject = isRunAppInBackground;
		int perHitCount = 1;

		Boolean foundButNotVisible = false;

		long callTimeOut = Context.current().getCallTimeoutInMillis();
		callTimeOut = callTimeOut - 1000;
		// if the stepTimeout is lesser than given timeout then wait for
		// stepTimeout
		long effectiveTimeOutmiliSecs = Math.min(timeOutmiliSecs, callTimeOut);
		Finder.callTimeOut = effectiveTimeOutmiliSecs - 1000;

		try {
			WebElement we = Finder.waitForWebElement(object, perHitCount);
			if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice) {
				element = we;
				System.out.println("Element Found Here Returing To Method");
				return Result.PASS().setOutput(true).make();
			}
			if (we.isDisplayed()) {
				return Result.PASS().setOutput(true).make();
			} else {
				foundButNotVisible = true;
			}

		} catch (InterruptedException | ToolNotSetException ex) {
			ex.printStackTrace();
			throw ex;
		} catch (ObjectNotFoundException ex) {

		} catch (Exception ex) {
			ex.printStackTrace();
		}

		long diffInMiliSeconds = (Calendar.getInstance().getTime().getTime() - startTime.getTime());

		if (diffInMiliSeconds >= effectiveTimeOutmiliSecs) {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
					.setMessage("Waited for " + (((double) diffInMiliSeconds) / 1000) + "seconds").make();
		}

		while (true) {
			Boolean isLogginEnabled = Finder.enableExtensiveLogging;
			try {
				Finder.enableExtensiveLogging = true;
				WebElement we = Finder.waitForWebElement(object, perHitCount);
				if (we.isDisplayed()) {
					element = we;
					return Result.PASS().setOutput(true).make();
				} else {
					foundButNotVisible = true;
				}
			} catch (InterruptedException | ToolNotSetException ex) {
				throw ex;
			} catch (Exception e) {
			} finally {
				Finder.enableExtensiveLogging = isLogginEnabled;
			}

			diffInMiliSeconds = (Calendar.getInstance().getTime().getTime() - startTime.getTime());

			if (diffInMiliSeconds >= effectiveTimeOutmiliSecs) {
				if (foundButNotVisible) {
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE).setOutput(false)
							.setMessage("Object was found but not Displayed. Waited for "
									+ (((double) diffInMiliSeconds) / 1000) + " seconds")
							.make();

				} else {
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
							.setMessage("Waited for " + (((double) diffInMiliSeconds) / 1000) + " seconds").make();
				}
			}

			Thread.sleep(1000);
		}
	}

	/**
	 * 
	 * 
	 * Checkpoint supported
	 * 
	 */

	public FunctionResult Method_ObjectExists(AppiumObject object) throws ToolNotSetException {
		boolean flag = false;
		for (AppiumObjectProperty xPath : object.getXPaths()) {
			String name = xPath.getValue();
			System.out.println("**** " + name);
			if (name.contains("<|") && name.contains("|>")) {
				System.out.println("Searching By Relational API :: " + name);
				// String nameXpath = new ActionByText().RelationalApi(name);
				flag = new ActionByText().VerifyRelationText(name);
			}
		}
		if (flag) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.EXIST.toString()).make();
		}

		// WebElement ele = getWaitForObjectElement(object, 20);

		WebElement ele = null;
		try {
			ele = Finder.findWebElementUsingCheckPoint(object);
		} catch (Exception e) {
			System.out.println("Exception while Method_ObjectExists: " + e.getMessage());
			// e.printStackTrace();
		}

		if (ele != null) {
			try {
				System.out.println("##<< object to viewport ");
				((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("arguments[0].scrollIntoView(true);",
						ele);
			} catch (Exception e) {
				System.out.println("exception " + e.getMessage());
			}

			return Result.PASS().setOutput(true).setMessage(ReturnMessages.EXIST.toString()).make();
		}

		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
				.setMessage(ReturnMessages.NOTEXIST.toString()).make();
	}

	/**
	 * 
	 * 
	 * 
	 * Checkpoint supported
	 * 
	 * 
	 */

	public FunctionResult Method_ObjectisEnabled(AppiumObject object) throws Exception {

		WebElement we = Finder.findWebElementUsingCheckPoint(object);

		if (new Utils().isElementEnabled(we)) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.ENABLED.toString()).make();
		} else {
			return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
					.setMessage(ReturnMessages.NOTENABLED.toString()).make();
		}

	}

	/**
	 * Checkpoint supported
	 */

	@NotSupportedInNativeApplication
	@NotSupportedInHybridApplication
	public FunctionResult Method_verifyObjectToolTip(AppiumObject object, String userToolTipText) throws Exception {
		String getToolTipText;

		FunctionResult fr = Method_getObjectToolTip(object);

		// when We Wrap a String into ResultCode in to the SetOutput Then Add
		// Some Special Charcter so we Compare Function Result Of
		// GetObjectTooltip To THe EXpected Text
		WebElement ele = Finder.findWebElementUsingCheckPoint(object);

		Utils.isOperable(ele);

		getToolTipText = Utils.getAttrAndIgnoreExcecption(ele, "title");

		// Check UserToolTipText To ObjectToolTip Text
		if (getToolTipText != null && fr.getOutput().contentEquals(userToolTipText)) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.MATCHTOOLTIP.toString()).make();

		} else {
			return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
					.setMessage(ReturnMessages.verificationFailed(getToolTipText,
							Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue()))
					.make();
		}
	}

	/**
	 * Checkpoint supported
	 */

	public FunctionResult Method_ObjectClick(AppiumObject object) throws Exception {
		List<AppiumObjectProperty> list = object.getXPaths();
		Collections.reverse(list);
		WebElement we = null;
		we = Finder.findWebElementUsingCheckPoint(object);
		if(we!=null) {
		Utils.performClick(we);
		return Result.PASS().setOutput(true).make();
		}
		else {
		    return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).make();
		}
	}

	/**
	 * 
	 * Checkpoint Supported
	 * 
	 * Method wait for Object but does not wait for its visibility
	 * 
	 * @param object
	 * @return
	 * @throws Exception
	 */

	public FunctionResult Method_verifyObjectVisible(AppiumObject object) throws Exception {
		// Check Object Is Visible Or Not
		/*
		 * WebObjects.element = null; WebElement we = null; // new
		 * WebObjects().Method_waitforObject(object, 20); we = new
		 * WebObjects().getWaitForObjectElement(object, 20); if (we == null)
		 */
		WebElement we = Finder.findWebElementUsingCheckPoint(object);
		return new GenericCheckpoint<FunctionResult>() {

			@Override
			public FunctionResult _innerRun() throws Exception {
				if (we.isDisplayed()) {
					return Result.PASS().setOutput(true).setMessage(ReturnMessages.VISIBLE.toString()).make();

				} else {
					return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
							.setMessage(ReturnMessages.INVISIBLE.toString()).make();
				}
			}

		}.run();

	}

	/**
	 * Checkpoint Supported
	 * 
	 * @param object
	 * @param pName
	 * @return
	 * @throws Exception
	 */
	@KeywordActionType({ ActionType.GET })
	public FunctionResult Method_getObjectProperty(AppiumObject object, String pName) throws Exception {
		WebElement ele = Finder.findWebElementUsingCheckPoint(object);
		return new GenericCheckpoint<FunctionResult>() {

			@Override
			public FunctionResult _innerRun() throws Exception {
				String returnText = Utils.getAttrAndIgnoreExcecption(ele, pName.toLowerCase());
				if (returnText == null) {
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).make();
				}
				return Result.PASS().setOutput(returnText).make();
			}
		}.run();

	}

	/**
	 * Checkpoint Supported
	 * 
	 * @param object
	 * @return
	 * @throws Exception
	 */

	@KeywordActionType({ ActionType.GET })
	public FunctionResult Method_GetObjectText(AppiumObject object) throws Exception {

		WebElement we = Finder.findWebElementUsingCheckPoint(object);
		//String returnText = Utils.getText(true, we);
		String returnText = Utils.GetElementText(we);
		if (returnText != null) {
			return Result.PASS().setOutput(returnText).make();
		}
		return Result.PASS().setMessage("No Value or Text property exists or is null for the given Object").make();

	}

	/**
	 * Checkpoint Supported
	 * 
	 * @param object
	 * @param before
	 * @param after
	 * @return
	 * @throws Exception
	 */

	@KeywordActionType({ ActionType.GET })
	public FunctionResult Method_GetObjectText(AppiumObject object, String before, String after) throws Exception {
		try {
			WebElement we = Finder.findWebElementUsingCheckPoint(object);
			String returnText = Utils.GetElementText(we);
			returnText = new UnCategorised().TrimString(returnText, before, after);
			String msg = "";
			String output = "";

			if (returnText.contains("@#@")) {
				output = "";
				msg = returnText.substring(3, returnText.length());
			} else
				output = returnText;

			return Result.PASS().setOutput(output).setMessage(msg).make();
		} catch (Exception ex) {
			// Do Nothing
			System.out.println("NO OBJECT FOUND " + ex);
		}
		return Result.PASS().setMessage("No Value or Text property exists or is null for the given Object").make();

	}

	@KeywordActionType({ ActionType.GET })
	public FunctionResult Method_GetObjectTextWEB(AppiumObject object) throws Exception { // get Text using javascript
		List<AppiumObjectProperty> list = object.getXPaths();
		Collections.reverse(list);
		WebElement we = null;
		String text = null;
		try {
			we = Finder.findWebElementUsingCheckPoint(object);
		} catch (Exception e) {
			System.out.println("##<< exception " + e.getMessage());
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).make();
		}
		if (we != null) {
			if (AppiumContext.isBrowserMode()) {
				System.out.println(" ##<< Web  mode  ");
				try {
					JavascriptExecutor js = Finder.findJavaScriptExecuterDriver();
					String script = "function getText(obj){ return obj.value; }";
					text = (String) js.executeScript(script + " return getText(arguments[0])", we);
					System.out.println(" ##<< element value or text  " + text);
					return Result.PASS().setOutput(true).setMessage(text).make();
				} catch (Exception e) {
					System.out.println(" ##<< exeption while getting text  " + e.getMessage());
					e.printStackTrace();
					return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setOutput(false).make();

				}

			} else {
				text = we.getText();
				return Result.PASS().setOutput(true).setMessage(text).make();

			}

		}

		return Result.PASS().setOutput(true).make();
	}

	@NotSupportedInApplicationMode
	@KeywordActionType({ ActionType.GET })
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_getObjectCSSProperty(AppiumObject object, String property) throws Exception {

		property = property.toLowerCase();
		String str = "";
		System.out.println("Input Argument : " + property);
		if (property.equals("")) {
			return Result.PASS().setOutput("").setMessage("Property Not Set").make();
		} else {
			WebElement element = Finder.findWebElementUsingCheckPoint(object);
			try {
				str = element.getCssValue(property);
			} catch (Exception ex) {
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).make();
			}
			if (property.equalsIgnoreCase("color")) {
				String s1 = str.substring(5);
				StringTokenizer st = new StringTokenizer(s1);
				int r = Integer.parseInt(st.nextToken(",").trim());
				int g = Integer.parseInt(st.nextToken(",").trim());
				int b = Integer.parseInt(st.nextToken(",").trim());
				Color c = new Color(r, g, b);
				str = "#" + Integer.toHexString(c.getRGB()).substring(2);
				System.out.println(str);
			}
			if (str == " " || str.isEmpty()) {
				System.out.println("No Such Property");
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(str)
						.setMessage("No Such Property Exists").make();
			} else {
				return Result.PASS().setOutput(str).make();
			}
		}
	}

	/* 
	 * 
	 * 
	 * 
	 * 
	 * */
	@KeywordActionType({ ActionType.GET })
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_getPropertyValue(AppiumObject object, String propertyValue) throws Exception {

		WebElement we = Finder.findWebElementUsingCheckPoint(object);
		Utils.isOperable(we);

		String outputVal = "";
		propertyValue = propertyValue.toLowerCase();
		if (propertyValue.contentEquals("class") && AppiumContext.getDriverWindow() == DriverWindow.Native) {
			outputVal = we.getTagName();
			if (outputVal.contentEquals(""))
				outputVal = object.getClassName().getValue();
		} else if (propertyValue.contentEquals("size"))
			outputVal = we.getSize().toString();
		else if (propertyValue.contentEquals("location"))
			outputVal = we.getLocation().toString();
		else if (propertyValue.contentEquals("input-type") || propertyValue.contentEquals("type")) {
			outputVal = Utils.getAttrAndIgnoreExcecption(we, "type");
			if (outputVal == null || outputVal.contentEquals("")) {
				// In the selendroid mode type properties get type using tag
				// name
				outputVal = we.getTagName();
			}
		}

		else if (propertyValue.contentEquals("value") && Finder.findAppiumDriver() instanceof SelendroidWebDriver) {
			outputVal = Utils.getAttrAndIgnoreExcecption(we, "value");
			if (outputVal == null) {
				// In the selendroid mode type properties get value using
				// gettext() method
				outputVal = we.getText();
			}
		}

		else if (propertyValue.toLowerCase().contentEquals("tag"))
			// get tag name give the value in capital letter but when get page
			// source then open in mozila firefox tag name shows in small letter
			outputVal = we.getTagName().toLowerCase();
		else {
			try {
				outputVal = Utils.getAttrAndIgnoreExcecption(we, propertyValue.toLowerCase());
			} catch (NoSuchElementException ex) {
				// when attribute not found then give an exception no such
				// element exception
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID)
						.setMessage(ReturnMessages.PROPERTY_NOT_FOUND.toString()).make();
			}
		}

		if (outputVal == null) {
			// when attribute not found then return null
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID)
					.setMessage(ReturnMessages.PROPERTY_NOT_FOUND.toString()).make();
		} else {
			return Result.PASS().setOutput(outputVal).make();
		}
	}

	/* 
	 * 
	 * 
	 * 
	 * 
	 * */

	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_VerifyPropertyValue(AppiumObject object, String userPropertyName,
			String userPropertyValue) throws Exception {
		String getPropertyValue;
		// Fetch a Property Value From Property Name And PropertyName Is Given
		// By User

		FunctionResult fr = this.Method_getPropertyValue(object, userPropertyName);
		getPropertyValue = fr.getOutput();

		if (fr.getStatus().contentEquals(ExecutionStatus.Fail.toString())
				&& fr.getMessage().contentEquals(ReturnMessages.PROPERTY_NOT_FOUND.toString())) {
			return fr;
		} else if (userPropertyValue.equalsIgnoreCase(getPropertyValue))
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.MATCH_PROPERTY.toString()).make();

		else {
			return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
					.setMessage(ReturnMessages.verificationFailed(getPropertyValue,
							Context.current().getFunctionCall().getDataArguments().getDataArgument().get(1).getValue()))
					.make();
		}
	}

	/* 
	 * 
	 * 
	 * 
	 * 
	 * */

	/**
	 * Checkpoint Supported
	 * 
	 * @param object
	 * @param userText
	 * @return
	 * @throws Exception
	 */

	public FunctionResult Method_ObjectTextVerification(AppiumObject object, String userText) throws Exception {

		// Get Text From Object

		FunctionResult fr = Method_GetObjectText(object);
		if ((fr.getOutput() == null)) {
			return fr;
		}

		if (fr.getOutput().equals(userText)) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.MATCHTEXT.toString()).make();

		} else {
			return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
					.setMessage(ReturnMessages.verificationFailed(fr.getOutput(),
							Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue()))
					.make();
		}
	}

	public FunctionResult Method_ObjectTextVerification(AppiumObject object, String userText, String before,
			String after) throws Exception {

		// Get Text From Object

		FunctionResult fr = Method_GetObjectText(object);

		if ((fr.getOutput() == null)) {
			return fr;
		}

		String text = fr.getOutput();
		text = new UnCategorised().TrimString(text, before, after);

		String msg = "";
		String output = "";

		if (text.contains("@#@")) {
			output = "";
			msg = text.substring(3, text.length());
		} else
			output = text;

		if (output.equals(userText)) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.MATCHTEXT.toString()).make();

		} else {
			return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
					.setMessage(ReturnMessages.verificationFailed(fr.getOutput(),
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
	@NotSupportedInNativeApplication
	@NotSupportedInHybridApplication
	public FunctionResult Method_dblClick(AppiumObject object) throws Exception {

		WebElement ele = Finder.findWebElementUsingCheckPoint(object);

		Actions builder = new Actions(Finder.findAppiumDriver());
		builder.doubleClick(ele).perform();
		return Result.PASS().setOutput(true).make();
	}

	/**
	 * 
	 * @param object
	 * @return
	 * @throws Exception
	 */
	@NotSupportedInHybridApplication
	@NotSupportedInNativeApplication
	public FunctionResult Method_SetFocus(AppiumObject object) throws Exception {
		Finder.findJavaScriptExecuterDriver().executeScript("arguments[0].focus()",
				Finder.findWebElementUsingCheckPoint(object));
		// Finder.findWebElement(object).sendKeys("");
		return Result.PASS().setOutput(true).make();
	}

	/**
	 * Checkpoint supported
	 * 
	 * @param object
	 * @return
	 * @throws Exception
	 */
	@NotSupportedInNativeApplication
	@NotSupportedInHybridApplication
	@KeywordActionType({ ActionType.GET })
	public FunctionResult Method_getObjectToolTip(AppiumObject object) throws Exception {
		WebElement ele = Finder.findWebElementUsingCheckPoint(object);
		String title = getToolTip(ele);
		return Result.PASS().setOutput(title).make();
	}

	private String getToolTip(WebElement ele) throws Exception {
		return new GenericCheckpoint<String>() {

			@Override
			public String _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				String getTile = "";
				try {
					getTile = Utils.getAttrAndIgnoreExcecption(element, "title");
					if (getTile.trim().isEmpty())
						return "";
				} catch (Exception ex) {
					return "";
				}
				return getTile;
			}
		}.run();
	}

	/**
	 * 
	 * @param object
	 * @return
	 * @throws Exception
	 */
	@NotSupportedInNativeApplication
	@NotSupportedInHybridApplication
	// public FunctionResult Method_highlightElement(WebElement element) throws
	// ToolNotSetException, InterruptedException {
	// // As discussed with TEST team this is disabled - writing comment after
	// // long time.
	// // WebElement element = Finder.findWebElement(object);
	// HighlightedElement highlightedElement = new HighlightedElement();
	// Log.debug("GoingToHighLigt Object");
	// try {
	// JavascriptExecutor jse = (JavascriptExecutor) Finder.findAppiumDriver();
	// String eleOrignalStyle = (String) jse.executeScript("return
	// arguments[0].getAttribute('style')", element);
	// if (eleOrignalStyle != null)
	// eleOrignalStyle.trim();
	// String highlightStyle = " ;outline: red solid 2px !important; box-shadow:
	// none !important; outline-offset: -2px !important;";
	// jse.executeScript("arguments[0].setAttribute('style','" + eleOrignalStyle +
	// highlightStyle + "')", element);
	// Log.debug("Highlight Done");
	// Thread.sleep(200);
	// highlightedElement.setElement(element);
	// highlightedElement.setEleOrignalStyle(eleOrignalStyle);
	// HighlightedElements().push(highlightedElement);
	// // Finder.isHighlightObject = true;
	// // jse.executeScript("arguments[0].setAttribute('style','border:')",
	// // element);
	// } catch (Exception e) {
	// System.out.println("@Log: Exception while highlighting element");
	// // e.printStackTrace();
	// }
	//
	// return Result.PASS().setOutput(true).make();
	// }

	public FunctionResult Method_highlightElement(WebElement element) throws ToolNotSetException, InterruptedException {
		HighlightedElement highlightedElement = new HighlightedElement();
		Log.debug("GoingToHighLigt Object");
		try {
			String highlightStyle = " ;outline: red solid 2px !important; box-shadow: none !important; outline-offset: -2px !important;";
			String script = "OPK_StyleValue = arguments[0].getAttribute('style');";
			script += "arguments[0].setAttribute('style','OPK_StyleValue" + highlightStyle + "');";
			script += "return OPK_StyleValue";

			JavascriptExecutor jse = (JavascriptExecutor) Finder.findAppiumDriver();
			String eleOrignalStyle = (String) jse.executeScript(script, element);
			if (eleOrignalStyle != null)
				eleOrignalStyle.trim();
			highlightedElement.setElement(element);
			highlightedElement.setEleOrignalStyle(eleOrignalStyle);
			HighlightedElements().push(highlightedElement);
		} catch (Exception e) {
			System.out.println("@Log: Exception while highlighting element");
			// e.printStackTrace();
		}

		return Result.PASS().setOutput(true).make();
	}

	/**
	 * 
	 * @param object
	 * @return
	 * @throws Exception
	 */
	@KeywordActionType({ ActionType.GET })
	public FunctionResult Method_getObjectValue(AppiumObject object) throws Exception {

		String attributeValue = null;
		String objectType = null;
		WebElement we = Finder.findWebElementUsingCheckPoint(object);

		Utils.isOperable(we);

		if (AppiumContext.isBrowserMode()) { // if
			// (AppiumContext.getDriverWindow()
			// == DriverWindow.WebView) {
			System.out.println(" driver is in webview ");
			objectType = Utils.getAttrAndIgnoreExcecption(we, "type");
			// try to get the tag name use For link and a tag
			if (objectType == null || objectType.equals("")) {
				objectType = we.getTagName();
			}
		} else {
			System.out.println(" In Method_getObjectValue driver is NOT  in Webview");
			objectType = we.getTagName();
			// in Android get tag name return the run time class name of object
			// but in android version 4.2 gettagName return the value of class
			// name ""
			// so we get the value of class name using importer
			if (objectType.contentEquals("")) {
				objectType = object.getClassName().getValue();
			}
		}

		boolean radioCheckBoxValue;
		System.out.println("In get object value type value " + objectType);

		/*
		 * if value attribute not find in native application then throw an exception but
		 * not throwing an exception in hybrid applicatoion so continue flow we need
		 * catch
		 */

		System.out.println("Try to find an value  using value attribute");
		attributeValue = Utils.shadow_getObjectText(object).getOutput();

		if (attributeValue != null) {
			return Result.PASS().setOutput(attributeValue).make();
		}

		else {

			if (objectType.toLowerCase().equals("text") || objectType.toLowerCase().contains("edittext")
					|| objectType.toLowerCase().contains("textview") || objectType.toLowerCase().contains("button")
					|| objectType.toLowerCase().contains("email")) {
				return this.Method_GetObjectText(object);
			}
			// check For RadioButton or radiobutton or Toggle or switch
			else if (objectType.toLowerCase().equals("radio") || objectType.toLowerCase().contains("radiobutton")
					|| objectType.toLowerCase().equals("checkbox") || objectType.toLowerCase().contains("checkbox")
					|| objectType.toLowerCase().contains("togglebutton")
					|| objectType.toLowerCase().contains("switch")) {
				radioCheckBoxValue = Utils.isElementSelected(we);
				return Result.PASS().setOutput(radioCheckBoxValue).make();
			}

			// Check For DropDown or Spinner
			else if (objectType.toLowerCase().contains("select") || objectType.toLowerCase().contains("spinner")) {

				FunctionResult fr = (new Spinner()).Method_getSelectedSpinnerItem(object);
				return Result.PASS().setOutput(fr.getOutput()).make();

			}
			// Check For a Tag
			else if (objectType.contentEquals("a")) {
				String value = Finder.findWebElementUsingCheckPoint(object).getText();
				return Result.PASS().setOutput(value).make();
			}
			// Check For link
			else if (objectType.contentEquals("link")) {
				String value = Finder.findWebElementUsingCheckPoint(object).getText();
				return Result.PASS().setOutput(value).make();
			}

		}

		return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
				.setMessage(ReturnMessages.PROPERTY_NOT_FOUND.toString()).make();
	}

	/* 
	 * 
	 * 
	 * 
	 * 
	 * */

	public FunctionResult Method_VerifyObjectValue(AppiumObject object, String expectedValue) throws Exception {

		FunctionResult fr = this.Method_getObjectValue(object);
		if ((fr.getOutput() == null) || fr.getOutput().trim().equalsIgnoreCase("")) {
			return fr;
		}
		boolean ActualValue = this.Method_getObjectValue(object).getOutput().contentEquals(expectedValue);
		if (ActualValue) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.VERFIYED.toString()).make();
		}

		return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
				.setMessage(ReturnMessages.verificationFailed(String.valueOf(ActualValue),
						Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue()))
				.make();
	}

	/**
	 * Checkpoint Supported
	 * 
	 * @param object
	 * @return
	 * @throws Exception
	 */

	@KeywordActionType({ ActionType.GET })
	public FunctionResult Method_getObjectEnabled(AppiumObject object) throws Exception {

		WebElement we = Finder.findWebElementUsingCheckPoint(object);

		if (new Utils().isElementEnabled(we))
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.ENABLED.toString()).make();
		else
			return Result.PASS().setOutput(false).setMessage(ReturnMessages.NOTENABLED.toString()).make();

	}

	/* 
	 * 
	 * 
	 * 
	 * 
	 * */
	@KeywordActionType({ ActionType.GET })
	public FunctionResult Method_getObjectExistence(AppiumObject object) throws Exception {

		WebElement webElememnt = null;// = new WebObjects().getWaitForObjectElement(object, 20);
		try {
			webElememnt = Finder.findWebElementUsingCheckPoint(object);
		} catch (ObjectNotFoundException e) {
			return Result.PASS().setOutput(false).setMessage(ReturnMessages.NOTEXIST.toString()).make();
		} catch (Exception ex) {
			return Result.PASS().setOutput(false).setMessage("Object not foud").make();
		}

		if (webElememnt != null) {
			try {
				System.out.println("##<< object to viewport ");
				((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("arguments[0].scrollIntoView(true);",
						webElememnt);
			} catch (Exception e) {
				System.out.println("exception " + e.getMessage());
			}
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.EXIST.toString()).make();
		}
		// The Result under ELSE is overridden by the Exception Result
		else {
			return Result.PASS().setOutput(false).setMessage(ReturnMessages.NOTEXIST.toString()).make();
		}
	}

	/* 
	 * 
	 * 
	 * 
	 * 
	 * */

	public FunctionResult Method_waitforobjectvisible(AppiumObject object, int waitTime) throws Exception {

		if (waitTime == 0) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
					.setMessage("Time Cannot be Zero").make();
		}
		AppiumDriver<WebElement> driver = Finder.findAppiumDriver();

		WebElement myWebelement = Finder.findWebElementUsingCheckPoint(object, waitTime);

		waitTime = Math.min(Context.current().getKeywordRemaningSeconds(), waitTime);

		WebDriverWait wait = new WebDriverWait(driver, waitTime);
		try {
			wait.until(ExpectedConditions.visibilityOf(myWebelement));
		} catch (Exception e) {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE).setMessage("object is not visible")
					.setOutput(false).make();
		}

		return Result.PASS().setMessage("object is visible").setOutput(true).make();
	}

	@KeywordActionType({ ActionType.GET })
	public FunctionResult Method_getObjectVisibility(AppiumObject object) throws Exception {
		// Check Object Is Visible Or Not

		WebElement we = null;
		try {
			we = Finder.findWebElementUsingCheckPoint(object);
		} catch (ObjectNotFoundException e) {
			return Result.PASS().setOutput(false).setMessage("Object not foud").make();
		} catch (Exception ex) {
			return Result.PASS().setOutput(false).setMessage("Object not foud").make();
		}

		if (we != null) {
			if (we.isDisplayed()) {
				return Result.PASS().setOutput(true).setMessage(ReturnMessages.VISIBLE.toString()).make();
			} else {
				return Result.PASS().setOutput(false).setMessage(ReturnMessages.INVISIBLE.toString()).make();
			}
		}
		return Result.PASS().setOutput(false).setMessage(ReturnMessages.INVISIBLE.toString()).make();
	}

	@KeywordActionType({ ActionType.GET })
	public FunctionResult Method_getObjectCount(String propertyName1, String propertyValue1, String propertyName2,
			String propertyValue2, String propertyName3, String propertyValue3, String propertyName4,
			String propertyValue4, String propertyName5, String propertyValue5)
					throws InterruptedException, ToolNotSetException {
		WebDriver driver = Finder.findAppiumDriver();
		HashMap<String, String> hash = new HashMap<>();
		StringBuffer xPath = new StringBuffer("//");

		if (propertyName1.length() == 0)
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setOutput(false).make();
		else {
			hash.put(propertyName1, propertyValue1);
			if (propertyName2.length() > 0)
				hash.put(propertyName2, propertyValue2);
			if (propertyName3.length() > 0)
				hash.put(propertyName3, propertyValue3);
			if (propertyName4.length() > 0)
				hash.put(propertyName4, propertyValue4);
			if (propertyName5.length() > 0)
				hash.put(propertyName5, propertyValue5);
		}

		// Check if any property contains Tag
		Iterator<Entry<String, String>> iterator = hash.entrySet().iterator();
		while (iterator.hasNext()) {
			Entry<String, String> entry = iterator.next();
			if (entry.getKey().trim().equalsIgnoreCase("tag")) {
				xPath.append(entry.getValue().trim());
				iterator.remove();
				break;
			}
		}
		int flag = 1;

		// if there is no tag, insert * in place of Tag
		String temp = xPath.toString();
		if (temp.equals("//"))
			xPath.append("*");

		// create xpath String
		Iterator<Entry<String, String>> iterator1 = hash.entrySet().iterator();
		while (iterator1.hasNext()) {
			Entry<String, String> entry = iterator1.next();
			String name = entry.getKey().trim().toLowerCase();
			String value = entry.getValue().trim();
			if (flag == 1) {
				xPath.append("[");
				flag = 0;
			} else {
				xPath.append(" and ");
			}

			if (name.equals("text") || name.equals("innertext"))
				xPath.append("text" + "()=" + "\'" + value + "\'");
			else if (name.contains("contains")) {
				if (name.contains("text") || name.contains("innertext"))
					xPath.append("contains(text()," + "\'" + value + "\')");
				else {
					String temp1 = name;
					if (temp1.indexOf("contains") == 0)
						temp1 = temp1.substring(8).trim();
					else
						temp1 = temp1.substring(0, temp1.length() - 8).trim();
					xPath.append("contains(@" + temp1 + ",\'" + value + "\')");
				}
			} else
				xPath.append("@" + name + "=" + "\'" + value + "\'");

			if (!iterator1.hasNext())
				xPath.append("]");
		}
		System.out.println(xPath.toString());
		List<WebElement> list = new ArrayList<>();
		try {
			list = driver.findElements(By.xpath(xPath.toString()));
		} catch (Exception e) {
			System.out.println(e);
		}
		if (list.size() == 0)
			return Result.PASS().setOutput(list.size()).setMessage("No object found by the given properties").make();
		return Result.PASS().setOutput(list.size()).make();
	}

	@NotSupportedInNativeApplication
	@NotSupportedInHybridApplication
	public FunctionResult Method_waitforobjectenable(AppiumObject object, int waitTime) throws Exception {

		if (waitTime == 0) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
					.setMessage("Time Cannot be Zero").make();
		}

		WebElement ele = Finder.findWebElementUsingCheckPoint(object, waitTime);

		if (new Utils().waitElementEnable(ele, waitTime)) {
			return Result.PASS().setOutput(true).make();
		}

		return Result.FAIL(ResultCodes.ERROR_TIMEOUT).setMessage("Timeout: Waited for " + waitTime + " seconds.")
				.setOutput(false).make();
	}

	public FunctionResult Method_waitForObjectdisable(AppiumObject object, int waitTime) throws Exception {

		if (waitTime == 0) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
					.setMessage("Time Cannot be Zero").make();
		}

		WebElement ele = Finder.findWebElementUsingCheckPoint(object, waitTime);

		if (new Utils().waitElementDisable(ele, waitTime)) {
			return Result.PASS().setOutput(true).make();
		}

		return Result.FAIL(ResultCodes.ERROR_TIMEOUT).setMessage("Timeout: Waited for " + waitTime + " seconds.")
				.setOutput(false).make();
	}

	public boolean Method_deHighlightElement() throws ToolNotSetException {
		// Removing Highlight Object if activated
		if (WebObjects.hasHighlightedElements()) {

			Log.debug("HighLighted Object Size: " + WebObjects.HighlightedElements().size());
			Log.print("going to unhighlight the Element");
			JavascriptExecutor jse = AppiumContext.JSExecutor();

			while (WebObjects.hasHighlightedElements()) {
				HighlightedElement highlightedElement = WebObjects.HighlightedElements().pop();
				try {

					jse.executeScript("arguments[0].setAttribute('style','border:')", highlightedElement.getElement());
					Thread.sleep(200);
					jse.executeScript(
							"arguments[0].setAttribute('style','" + highlightedElement.getEleOrignalStyle() + "')",
							highlightedElement.getElement());

					return true;
				} catch (Exception e) {
					return false;
				}
			}
		}
		return false;

	}

	public FunctionResult Method_clickUsingJavaScript(WebElement ele) throws ToolNotSetException, WebDriverException {
		Log.print("Clicking By JavaScript");
		JavascriptExecutor jse = (JavascriptExecutor) Finder.findAppiumDriver();
		jse.executeScript("arguments[0].click();", ele);
		return Result.PASS().setOutput(true).make();
	}

	private class HighlightedElement {

		String eleOrignalStyle;
		WebElement element;

		public String getEleOrignalStyle() {
			return eleOrignalStyle;
		}

		public void setEleOrignalStyle(String eleOrignalStyle) {
			this.eleOrignalStyle = eleOrignalStyle;
		}

		public WebElement getElement() {
			return element;
		}

		public void setElement(WebElement element) {
			this.element = element;
		}

	}

	public boolean clickWithSpanHandled(WebElement ele) throws ToolNotSetException {
		try {
			ele.click();
			return true;
		} catch (Exception e) {
			if (e.getMessage().contains("unknown error:") && e.getMessage().contains("is not clickable at point")
					&& e.getMessage().contains("Other element would receive the click:")) {
				String cordString = e.getMessage().substring(e.getMessage().indexOf("at point"));
				int c = cordString.indexOf(",");
				int x = Integer.parseInt(cordString.substring(cordString.indexOf("(") + 1, c));
				int y = Integer.parseInt(cordString.substring(c + 2, cordString.indexOf(")")));
				JavascriptExecutor jse = (JavascriptExecutor) Finder.findAppiumDriver();
				jse.executeScript("document.elementFromPoint('" + x + "' ,'" + y + "' ).click();");
				return true;
			}
		}
		return false;
	}

	@KeywordActionType({ ActionType.GET })
	public FunctionResult Method_getObjectHeightWidth(AppiumObject object) throws Exception {

		WebElement ele = Finder.findWebElementUsingCheckPoint(object);

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				String s = ele.getSize().height + " ; " + ele.getSize().width;
				return Result.PASS().setOutput(s).make();
			}
		}.run();
	}

	@NotSupportedInNativeApplication
	public FunctionResult Method_highlightObject(AppiumObject object) throws Exception {
		// As discussed with TEST team this is disabled - writing comment after long
		// time.

		WebElement element = Finder.findWebElementUsingCheckPoint(object);

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				Log.print("HighlightObject");
				Thread.sleep(2000);

				if (Utils.shouldHighlightAllObjects()) {
					return Result.PASS().setOutput(true).make();
				}

				Method_highlightElement(element);
				return Result.PASS().setOutput(true).make();

			}
		}.run();
	}

	public FunctionResult Method_waitForObjectEditable(AppiumObject object, int waitTime) throws Exception {

		if (waitTime == 0) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
					.setMessage("Time Cannot be Zero").make();
		}

		WebElement myWebElement = Finder.findWebElementUsingCheckPoint(object);

		final int newWait = Math.min(Context.current().getKeywordRemaningSeconds(), waitTime);

		WebDriver driver = (WebDriver) Context.session().getTool();
		WebDriverWait wait = new WebDriverWait(driver, newWait - 1);
		try {
			wait.until(new ExpectedCondition<Boolean>() {
				public Boolean apply(WebDriver driver) {
					String text = null;
					try {
						text = Utils.shadow_getObjectText(myWebElement).getOutput();
						myWebElement.clear();
						myWebElement.sendKeys(text);
						return true;
					} catch (Exception e) {
						// e.printStackTrace();
						return false;
					}

				}
			});

		} catch (Exception e) {
			// e.printStackTrace();
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE).setMessage("object is not editable")
					.setOutput(false).make();
		}
		return Result.PASS().setMessage("object is editable").setOutput(true).make();

	}

	/*
	 * public FunctionResult Method_captureObjectSnapShot(AppiumObject object)
	 * throws Exception { return new Checkpoint() {
	 * 
	 * @Override public FunctionResult _innerRun() throws InterruptedException,
	 * ToolNotSetException, ObjectNotFoundException, WebDriverException,
	 * ArgumentDataMissingException, IOException, ArgumentDataInvalidException,
	 * Exception {
	 * 
	 * WebDriver driver = (WebDriver) Context.session().getTool(); WebElement
	 * element = Finder.findWebElement(object);
	 * Utils.Method_bringObjectInViewArea(element); String path =
	 * elementScreenShot(driver, element, object.getName().getName()); return
	 * Result.PASS().setOutput(path).setSnapshotPath(path).make(); } }.run(); }
	 */

	public FunctionResult Method_deFocusObject() throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				Utils.defocousObject();
				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	public void ClickElement(WebElement element) throws Exception {

		Utils.performClick(element);

	}

	public FunctionResult Method_typeTextUsingJavaScriptElement(WebElement ele, String value)
			throws ToolNotSetException, ObjectNotFoundException, InterruptedException {
		JavascriptExecutor jse = (JavascriptExecutor) Finder.findAppiumDriver();
		jse.executeScript("arguments[0].value='" + value + "'", ele);
		return Result.PASS().setOutput(true).make();
	}

	public FunctionResult Shadow_typeTextOnElement(WebElement element, String value) throws Exception {
		element.clear();
		element.sendKeys(value);
		return Result.PASS().setOutput(true).make();
	}

	public FunctionResult Method_VerifyMultipleObjectProperty(AppiumObject object, String propName1, String propValue1,
			String propName2, String propValue2, String propName3, String propValue3, String propName4,
			String propValue4, String propName5, String propValue5) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				Map<String, String> linkedHashMap = new LinkedHashMap<String, String>();
				String originalValue1 = Context.current().getFunctionCall().getDataArguments().getDataArgument().get(1)
						.getValue();
				String originalValue2 = Context.current().getFunctionCall().getDataArguments().getDataArgument().get(3)
						.getValue();
				String originalValue3 = Context.current().getFunctionCall().getDataArguments().getDataArgument().get(5)
						.getValue();
				String originalValue4 = Context.current().getFunctionCall().getDataArguments().getDataArgument().get(7)
						.getValue();
				String originalValue5 = Context.current().getFunctionCall().getDataArguments().getDataArgument().get(9)
						.getValue();
				Map<String, String> originalValueMap = new HashMap<String, String>();
				originalValueMap.put(propValue1, originalValue1);
				originalValueMap.put(propValue2, originalValue2);
				originalValueMap.put(propValue3, originalValue3);
				originalValueMap.put(propValue4, originalValue4);
				originalValueMap.put(propValue5, originalValue5);
				// boolean verificationFailed=false;
				if (propName1.trim().length() == 0 || propValue1.trim().length() == 0) {
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING)
							.setMessage("First Property Name/Value cannot be empty").setOutput(false).make();
				} else {
					linkedHashMap.put(propName1, checkForHref(propName1, propValue1));
					String names[] = { propName2, propName3, propName4, propName5 };
					String values[] = { propValue2, propValue3, propValue4, propValue5 };
					for (int i = 0; i < 4; i++) {
						if (!insertValueInMap(names[i], values[i], linkedHashMap))
							return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING)
									.setMessage("Property Name/Value cannot be empty").setOutput(false).make();
					}
				}

				WebElement ele = Finder.findWebElement(object);

				Iterator<Entry<String, String>> iterator = linkedHashMap.entrySet().iterator();
				while (iterator.hasNext()) {
					Entry<String, String> entry = iterator.next();
					String propName = entry.getKey();
					String givenValue = entry.getValue();
					String originalValue = ele.getAttribute(entry.getKey());
					if (originalValue == null) {
						return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED)
								.setMessage("Object doesn't have " + propName + " property.").setOutput(false).make();
					}
					if (originalValue.equals("true")) {
						String attVal = new Utils().getElementAttributeJsoup(ele, propName);
						if (!attVal.trim().isEmpty()) {
							originalValue = attVal;
						}
					}
					if (!(givenValue.equalsIgnoreCase(originalValue))) {
						return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED)
								.setMessage(Utils.verification_failed(originalValue, originalValueMap.get(givenValue)))
								.setOutput(false).make();
					}
				}
				return Result.PASS().setOutput(true).setMessage(ReturnMessages.VERFIYED.toString()).make();

			}
		}.run();
	}

	public static String checkForHref(String name, String value) throws ToolNotSetException {
		if (name.equalsIgnoreCase("href") && value.charAt(0) == '/') {
			String url = Finder.findAppiumDriver().getCurrentUrl();
			if (url.charAt(url.length() - 1) == '/')
				return url.substring(0, url.length() - 1) + value;
			else
				return url + value;
		}
		return value;
	}

	// Insert Property Name and Value in hashMap when both prop Name and value
	// are present and if one of the name/value pair is empty then return false
	public static boolean insertValueInMap(String propName, String propValue, Map<String, String> linkedHashMap)
			throws ToolNotSetException {
		int propNameLength = propName.trim().length();
		int propValueLength = propValue.trim().length();
		if (propNameLength == 0 && propValueLength == 0)
			return true;
		if ((propNameLength > 0 && propValueLength > 0)) {
			linkedHashMap.put(propName, checkForHref(propName, propValue));
		} else {
			return false;
		}
		return true;
	}
}