package com.plugin.appium.keywords.GenericKeyword;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
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
import com.plugin.appium.annotations.keywordValidation.NotSupportedInHybridApplication;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInMobileContext;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInNativeApplication;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.ActionType;
import com.plugin.appium.enums.BrowserType;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.enums.DriverWindow;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.util.Checkpoint;
import com.plugin.appium.util.GenericCheckpoint;

public class EditBox implements KeywordLibrary {

    static Logger logger = Logger.getLogger(EditBox.class.getName());
    WebObjects webObject = new WebObjects();
    UnCategorised uncategoried = new UnCategorised();

    /**
     * Checkpoint Supported
     * 
     * 
     */

    public FunctionResult Method_typeTextOnEditBox(AppiumObject object, String value) throws Exception {
	long start = System.currentTimeMillis();
	System.out.println("Starting Finder.findWebElementUsingCheckpoint(object)");
	WebElement we = Finder.findWebElementUsingCheckPoint(object);
	System.out.println("TypeText Finder Time Taken: " + (System.currentTimeMillis() - start));

	start = System.currentTimeMillis();
	FunctionResult functionResult = this.typeText(we, value.trim());
	System.out.println("TypeText Complete Time Taken is: " + (System.currentTimeMillis() - start));
	return functionResult;
	// return this.typeText(we, value.trim());
    }

    public FunctionResult Method_typeTextWithVisibleText(WebElement element, String value) throws Exception {
	return this.typeText(element, value);
    }

    @KeywordActionType({ ActionType.GET })
    public FunctionResult Method_getEditboxLength(AppiumObject object) throws Exception {

	WebElement we = Finder.findWebElementUsingCheckPoint(object);

	String text = "";
	int getLength = 0;
	if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
		|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator
		|| AppiumContext.getDeviceType() == DeviceType.Android) {
	    text = we.getText();
	    if (text != null && text.length() != 0) {
		getLength = text.length();
	    }

	}
	if (AppiumContext.isBrowserOrWebviewMode() || AppiumContext.getBrowserMode() == BrowserType.chromeOnLocalAndroid
		|| AppiumContext.getBrowserMode() == BrowserType.SafariOnIos) {

	    String GetLength = we.getAttribute("length");
	    GetLength = (GetLength == null) ? we.getAttribute("maxlength") : GetLength;
	    GetLength = (GetLength == null) ? we.getAttribute("size") : GetLength;
	    GetLength = (GetLength == null) ? "0" : GetLength;
	    int getLengthStringToInt = Integer.valueOf(GetLength);
	    getLength = getLengthStringToInt;
	}
	if (getLength == 0) {
	    return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION)
		    .setMessage(ReturnMessages.PROPERTY_NOT_FOUND.toString()).make();
	}
	return Result.PASS().setOutput(getLength).make();

    }

    /**
     * Checkpoint Suported
     * 
     * 
     */

    public FunctionResult Method_typeTextandEnterEditBox(AppiumObject object, String value) throws Exception {
    	if( value.length()==0|| value.equals("")) {
    		
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING ).setOutput(false).setMessage("Please Provide Value").make();
    	}	
	WebElement we = Finder.findWebElementUsingCheckPoint(object);
	String objectText=Utils.getText(we);
	this.typeText(we, value);
	String objectTextNew=Utils.getText(we);
	
	if(!objectText.equals(objectTextNew)) {
		Utils.pressEnter(we);
		return Result.PASS().setOutput(true).setMessage(ReturnMessages.TYPE_TEXT.toString()).make();

	}else {
		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE ).setOutput(false).setMessage("Unable to text type").make();

	}

    }

    /**
     * 
     * 
     * Checkpoint Supported
     * 
     */

    public FunctionResult Method_verifyEditBoxEditable(AppiumObject object) throws Exception {

	WebElement we = Finder.findWebElementUsingCheckPoint(object);
	String objectType = Utils.getobjectType(object, we);

	if (!(objectType.equalsIgnoreCase("android.widget.EditText") || objectType.equalsIgnoreCase("text")
		|| objectType.equalsIgnoreCase("email") || objectType.equalsIgnoreCase("password")
		|| objectType.equalsIgnoreCase("textarea") || objectType.equalsIgnoreCase("EditText")
		|| objectType.equalsIgnoreCase("UIATextField") || objectType.equalsIgnoreCase("UIATextView")
		|| objectType.equalsIgnoreCase("XCUIElementTypeSearchField"))) {

	    return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
		    .setMessage("The Object is not of editbox type").make();

	} else {

	    if (new Utils().isElementEnabled(we)) {
		return Result.PASS().setOutput(true).setMessage(ReturnMessages.EDITABLE.toString()).make();
	    }
	    return Result.PASS().setOutput(true).setMessage(ReturnMessages.NOTEDITABLE.toString()).make();
	}
    }

    /**
     * 
     * Checkpoint Supported
     * 
     * 
     * 
     */

    public FunctionResult Method_verifyeditboxtext(AppiumObject object, String userText) throws Exception {
	return webObject.Method_ObjectTextVerification(object, userText);
    }

    /**
     * 
     * Checkpoint Supported
     * 
     * 
     */
    @KeywordActionType({ ActionType.GET })
    public FunctionResult Method_getEditboxDefaultvalue(AppiumObject object) throws Exception {
	return Method_getTextFromEditBox(object);

    }

    @KeywordActionType({ ActionType.GET })
    public FunctionResult Method_getTextFromEditBox(AppiumObject object) throws Exception {
	return webObject.Method_GetObjectText(object);
    }

    @KeywordActionType({ ActionType.GET })
    public FunctionResult Method_getEditboxValue(AppiumObject object) throws Exception {
	return Method_getTextFromEditBox(object);
    }

    /**
     * 
     * Checkpoint supported
     * 
     * 
     */
    @NotSupportedInHybridApplication
    @NotSupportedInNativeApplication
    public FunctionResult Method_verifyEditBoxToolTip(AppiumObject object, String userToolTipText) throws Exception {

	WebElement webElement = Finder.findWebElementUsingCheckPoint(object);
	return new GenericCheckpoint<FunctionResult>() {

	    @Override
	    public FunctionResult _innerRun() throws Exception {
		String getToolTipText;
		getToolTipText = webElement.getAttribute("title");
		if (getToolTipText.equals(userToolTipText))
		    // Check UserToolTipText To ObjectToolTip Text
		    return Result.PASS().setOutput(true).setMessage(ReturnMessages.MATCHTOOLTIP.toString()).make();

		else
		    return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
			    .setMessage(ReturnMessages.verificationFailed(getToolTipText, Context.current()
				    .getFunctionCall().getDataArguments().getDataArgument().get(0).getValue()))
			    .make();
	    }
	}.run();

    }

    /**
     * 
     * Checkpoint supported
     * 
     * 
     */

    public FunctionResult Method_verifyEditBoxEnabled(AppiumObject object) throws Exception {
	return webObject.Method_ObjectisEnabled(object);
    }

    /**
     * Checkpoint Supported
     * 
     * 
     * 
     */

    public FunctionResult Method_typeKeysOnEditBox(AppiumObject object, String value) throws Exception {

	WebElement we = Finder.findWebElementUsingCheckPoint(object);
	System.out.println("<<### Web Element :" + we);

	return new GenericCheckpoint<FunctionResult>() {
	    @Override
	    public FunctionResult _innerRun() throws Exception {

		try {
		    if (AppiumContext.isIOS())
		    {
			// Finder.findAppiumDriver().tap(1, we, 1);
			Utils.touchActionTap(1, 1);
			sendKeyAndHideKeyboard(we, value);
		    }
			else if (AppiumContext.isAndroid()) {
					we.click();
					String existingText = we.getText();
					if (existingText == null) {
						existingText = "";
					}
					System.out.println("Existing Text: " + existingText);

					String newValue = existingText + value;
					System.out.println("<<### New Value :" + newValue);
					we.clear();
					sendKeyAndHideKeyboard(we, newValue);
				}
		} catch (Exception e) {
		   e.printStackTrace();
           return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE).setMessage("Error interacting with edit box: " + e.getMessage()).make();
		}
		
		Utils.gobackIfNeed();
		return Result.PASS().setOutput(true).setMessage(ReturnMessages.TYPEKEYS.toString()).make();

	    }
	}.run();
    }

	/*
	 * WebElement element = Finder.findWebElement(object); value =
	 * value.toLowerCase(); String typeKeys = ""; int length = value.length(); if
	 * (element != null) { // True When Object Is exists for (int i = 0; i < length;
	 * i++) {
	 * 
	 * typeKeys = typeKeys + Character.toString(value.charAt(i));
	 * System.out.println(" typinf jeys "+ Character.toString(value.charAt(i)));
	 * element.sendKeys(Character.toString(value.charAt(i))); // Write Char By Char
	 * On // Object Finder.findWebDriver().manage().timeouts().implicitlyWait(1,
	 * TimeUnit.SECONDS);
	 * 
	 * }
	 * 
	 * element.sendKeys(Keys.DOWN); element.sendKeys(Keys.SPACE);
	 * 
	 * if (AppiumContext.DeviceType() == DeviceType.Android) {
	 * Finder.findWebDriver().navigate().back(); }
	 * 
	 * return Result.PASS().setOutput(true)
	 * .setMessage(ReturnMessages.TYPEKEYS.toString()).make(); } else return
	 * Result.FAIL().setOutput(false)
	 * .setMessage(ReturnMessages.NOTEXIST.toString()).make();
	 */
    

    /**
     * 
     * Checkpoint Supported
     * 
     * 
     */

    public FunctionResult Method_clearEditField(AppiumObject object) throws Exception {
	WebElement we = Finder.findWebElementUsingCheckPoint(object);
	String objectType = Utils.getobjectType(object, we);

	if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
		|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {
	    // || objectType.equalsIgnoreCase("XCUIElementTypeTextField")
	    if (objectType.equalsIgnoreCase("XCUIElementTypeSecureTextField")) {
		boolean returnStatus = Utils.clearField_IOS(we);
		if (returnStatus)
		    return Result.PASS().setOutput(true).make();
	    }
	    we.clear();
	}
	Utils.clearEditFieldInCheckpoint(we);
	Utils.hideKeyboard();
	return Result.PASS().setOutput(true).make();
    }

    /**
     * 
     * 
     * 
     * 
     */
    @NotSupportedInMobileContext
    public FunctionResult Method_deFocusEditField() throws Exception {
	// defocus object is remove because In british Airways application root
	// the another page
	// when we press a tab
	// so we remove a defacous keyword
	return null;
    }

    /**
     * 
     * 
     * 
     * 
     */
    @NotSupportedInHybridApplication
    @NotSupportedInNativeApplication
    public FunctionResult Method_SetfocusEditField(AppiumObject object) throws Exception {
	WebElement ele = Finder.findWebElementUsingCheckPoint(object);
	return new GenericCheckpoint<FunctionResult>() {

	    @Override
	    public FunctionResult _innerRun() throws Exception {
		sendKeyAndHideKeyboard(ele, "");
		// ele.sendKeys("");
		return Result.PASS().setOutput(true).make();
	    }
	}.run();
    }

    /**
     * 
     * Checkpoint Supported
     * 
     * 
     */
    @NotSupportedInNativeApplication
    @NotSupportedInHybridApplication
    @KeywordActionType({ ActionType.GET })
    public FunctionResult Method_getEditBoxToolTip(AppiumObject object) throws Exception {

	WebElement ele = Finder.findWebElementUsingCheckPoint(object);

	return new GenericCheckpoint<FunctionResult>() {

	    @Override
	    public FunctionResult _innerRun() throws Exception {
		String title = ele.getAttribute("title");
		return Result.PASS().setOutput(title).make();
	    }
	}.run();

    }

    /**
     * 
     * 
     * 
     * 
     */
    @KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
    public FunctionResult Method_waitForEditBoxEnabled(AppiumObject object, int timeOutInSecs) throws Exception {

	WebElement we = Finder.findWebElementUsingCheckPoint(object, timeOutInSecs);

	try {

	    if (new Utils().waitElementEnable(we, timeOutInSecs) && we.isDisplayed()) {
		return Result.PASS().setOutput(true).make();
	    }

	} catch (InterruptedException | ToolNotSetException ex) {
	    throw ex;
	}

	catch (Exception ex) {

	}

	return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).make();

    }

    /**
     * 
     * 
     * Checkpoint Supported
     * 
     */
    @KeywordActionType({ ActionType.GET })
    public FunctionResult Method_GetEditBoxName(AppiumObject object) throws Exception {
	WebElement we = Finder.findWebElementUsingCheckPoint(object);
	String getName = "";
	// when driver under the webview
	if (AppiumContext.isBrowserOrWebviewMode() || AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator
		|| AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice) {
	    getName = Utils.getElementAttribute(we, "name");
	}
	if (((getName == null) || getName.trim().equalsIgnoreCase(""))
		&& AppiumContext.getDriverWindow() == DriverWindow.Native) {

	    /*
	     * when driver under the native application content description is work as name
	     * when we find an object
	     */
	    try {
		// if content description property is not exist given no such
		// element exception
		getName = Utils.getText(we);
	    } catch (Exception ex) {
System.out.println("Exception occured" + ex.getMessage());
		
	    }
	}
	// In the case of selendroid if property is not found then return null
	if (getName == null) {
	    return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID)
		    .setMessage(ReturnMessages.PROPERTY_NOT_FOUND.toString()).make();
	}

	return Result.PASS().setOutput(getName).make();
    }

    /**
     * Checkpoint Supported
     */
    public FunctionResult typeText(WebElement we, String value) throws Exception {

	return new GenericCheckpoint<FunctionResult>() {

	    @Override
	    public FunctionResult _innerRun() throws Exception {
		if (AppiumContext.getBrowserMode() == BrowserType.chromeOnLocalAndroid
			|| AppiumContext.getBrowserMode() == BrowserType.SafariOnIos) {
		    Utils.clearEditField(false, we);
		    sendKeyAndHideKeyboard(we, value);
		    return Result.PASS().setOutput(true).make();
		}

		else {
		    Utils.clearEditField(we);
		    if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
			    || AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {

			try {	Thread.sleep(2000);		   
			    sendKeyAndHideKeyboard(we, value);		   
			} catch (org.openqa.selenium.WebDriverException ex) {

			    if (ex.getMessage()
				    .contains("An error occurred while executing user supplied JavaScript")) {
				System.out.println("hiding keyboard..2");
				// Utils.hideKeyboard();
				
			    } else {
				System.out.println("throwing exception from editbox");
				throw ex;
			    }
			}
		    } else {
			sendKeyAndHideKeyboard(we, value);
		    }

		    logger.fine(" send keys complete now 2 second wait for keyword up");
		    if (!(AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
			    || AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator))
			Thread.sleep(2000);

		    // Utils.gobackIfNeed();
		    return Result.PASS().setOutput(true).make();
		}
	    }
	}.run();

    }

    public FunctionResult Method_TypeTextInContentEditable(AppiumObject object, String textToType) throws Exception {
	return new Checkpoint() {
	    public FunctionResult _innerRun()
		    throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
		    ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
		WebElement textElement = Finder.findWebElement(object);
		System.out.println("textElement.getAttribute(\"contenteditable\")-> "
			+ textElement.getAttribute("contenteditable"));
		if (textElement.getAttribute("contenteditable") != null) {

		    textElement.clear();

		    textElement.sendKeys(new CharSequence[] { textToType });
		} else {
		    String xpath = "./ancestor::*[@contenteditable ='true']";
		    List<WebElement> eles = textElement.findElements(By.xpath(xpath));

		    System.out.println("eles.size()-> " + eles.size());

		    WebElement ele = null;
		    if (eles.size() > 0) {
			ele = (WebElement) eles.get(eles.size() - 1);
		    } else {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE)
				.setMessage("none of parent or self is content editable").make();
		    }
		    if (ele != null) {
			ele.clear();
			ele.sendKeys(new CharSequence[] { textToType });
		    }
		}
		return Result.PASS().setOutput(true).setMessage("Text typed successfully....").make();
	    }
	}.run();
    }

    public boolean sendKeyAndHideKeyboard(WebElement ele, String value) throws ToolNotSetException {
	long start = System.currentTimeMillis();
	ele.sendKeys(value);
	System.out.println("SendKeys Time Taken: " + (System.currentTimeMillis() - start));

	start = System.currentTimeMillis();
         Utils.hideKeyboard();
	System.out.println("Hide Keyword Time Taken: " + (System.currentTimeMillis() - start));
	return true;
    }

    public static boolean isEditbox(AppiumObject object, WebElement webElement) throws Exception {
	String objectType = Utils.getobjectType(object, webElement);
	if ((objectType.equalsIgnoreCase("android.widget.EditText") || objectType.equalsIgnoreCase("text")
		|| objectType.equalsIgnoreCase("email") || objectType.equalsIgnoreCase("password")
		|| objectType.equalsIgnoreCase("textarea") || objectType.equalsIgnoreCase("EditText")
		|| objectType.equalsIgnoreCase("UIATextField") || objectType.equalsIgnoreCase("UIATextView")
		|| objectType.equalsIgnoreCase("XCUIElementTypeSearchField")
		|| objectType.equalsIgnoreCase("XCUIElementTypeSecureTextField")
		|| objectType.equalsIgnoreCase("XCUIElementTypeTextField"))) {

	    return true;
	}

	return false;
    }

    public static String getVisibleEditBoxText(WebElement element) throws Exception {
	String text = Utils.getText(element);
	if (text == null) {
	    text = Utils.getAttrAndIgnoreExcecption(element, "placeholder");
	}

	return text;
    }
}
