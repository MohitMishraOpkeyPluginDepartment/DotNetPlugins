package com.plugin.appium.keywords.GenericKeyword;

import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;
import java.util.regex.Pattern;

import org.apache.commons.io.FileUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.Select;

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
import com.plugin.appium.annotations.keywordValidation.NotSupportedInMobileContext;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInNativeApplication;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.ActionType;
import com.plugin.appium.enums.BrowserType;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.KeywordMethodOrArgumentValidationFailException;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.TimeOut_ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.AppiumSpecificKeyword.AndroidRadio;
import com.plugin.appium.util.Checkpoint;

public class Deprecate implements KeywordLibrary {

	static Logger logger = Logger.getLogger(Finder.class.getName());
	private Browser browser = new Browser();
	private Checkbox checkbox = new Checkbox();
	private Radio radio = new Radio();
	private EditBox editBox = new EditBox();
	private DropDown dropDown = new DropDown();
	private Button button = new Button();
	private WebObjects webObject = new WebObjects();
	private Image image = new Image();
	private TextArea textarea = new TextArea();
	private Links links = new Links();

	/**
	 * @throws InterruptedException
	 * @throws ArgumentDataMissingException
	 * @throws KeywordMethodOrArgumentValidationFailException
	 * 
	 * 
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	@Deprecated
	public FunctionResult Method_goBackAndWait(int timeOutInSecs) throws ToolNotSetException, WebDriverException, IOException, InterruptedException {
		browser.Method_goBack();
		Utils.waitUntill(timeOutInSecs);
		return Result.PASS().setOutput(true).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInApplicationMode
	@Deprecated
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_deselectAllDropDownItemsAndWait(AppiumObject object, Integer timeOutInSecs) throws Exception {
		Select selectData = new Select(Finder.findWebElementUsingCheckPoint(object));
		List<WebElement> list = selectData.getAllSelectedOptions();
		int sizeOfList = list.size();
		System.out.println(" size of list " + sizeOfList);

		if (sizeOfList == 0) {
			return Result.PASS().setMessage(ReturnMessages.NOT_SELECTED.toString()).setOutput(true).make();
		} else if (sizeOfList >= 1) {
			// deselect dropdown is not working with given value
			FunctionResult fr = dropDown.Method_deselectDropDownItem(object, "");
			if (fr.getStatus().contentEquals(ExecutionStatus.Pass.toString()))
				Utils.waitUntill(timeOutInSecs);
			return Result.PASS().setOutput(true).make();
		}

		return Result.FAIL().setOutput(true).setResultCode(ResultCodes.ERROR_UNSUPPORTED_OPERATION.Code()).setMessage("object is not a dropdown type").make();

	}

	/**
	 * @throws ArgumentDataMissingException
	 * @throws KeywordMethodOrArgumentValidationFailException
	 * 
	 * 
	 * 
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1 })
	@Deprecated
	public FunctionResult Method_reportMessage(String message, String status) throws ToolNotSetException {

		switch (status.toLowerCase()) {
		case "true":
			return Result.PASS().setOutput(true).setMessage(message).make();

		case "false":
			return Result.FAIL().setOutput(false).setMessage(message).setResultCode(ResultCodes.ERROR_USER_ASSERTED_FAILURE.Code()).make();

		default:
			return Result.FAIL().setOutput(false).setMessage("Status should be either True/False").setResultCode(ResultCodes.ERROR_ARGUMENT_DATA_INVALID.Code()).make();
		}
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInApplicationMode
	@Deprecated
	public FunctionResult Method_SelectRadio(AppiumObject object, int indx) throws Exception {
		return new AndroidRadio().Method_SelectRadioButton(object);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_verifyEditBoxExist(AppiumObject object, int timeOut) throws Exception {
		return webObject.Method_ObjectExists(object);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	@NotSupportedInApplicationMode
	public FunctionResult Method_VerifyRadioButtonSelected(AppiumObject object, int index) throws Exception {

		WebElement we = Finder.findWebElementUsingCheckPoint(object);

		if (Utils.isElementSelected(we)) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.TRUE_STATUS.toString()).make();

		} else {
			return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false).setMessage(ReturnMessages.FALSE_STATUS.toString()).make();

		}
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_selectRadioButtonOnIndexBasis(AppiumObject object, int index) throws Exception {
		return radio.Method_SelectRadio(object, index);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	public FunctionResult Method_typeSecureText(AppiumObject object, String value) throws Exception {
		if (com.crestech.opkey.plugin.base64.Base64.isBase64(value)) {
			Log.print("Inside base 64");
			Base64.Decoder decoder = Base64.getDecoder();
			try {
				decoder.decode(value);
				Log.print("Inside base 64-1");
				return new EditBox().Method_typeTextOnEditBox(object, value);
				
				// element.sendKeys(value);
			} catch (Exception e) {
				Log.print("Inside base 64-2");
				return new EditBox().Method_typeKeysOnEditBox(object, com.crestech.opkey.plugin.base64.Base64.stringFromBase64(value));
				// element.sendKeys(com.crestech.opkey.plugin.base64.Base64.stringFromBase64(value));
			}
		}else {
			Log.print("Inside not-base-64");
			return new EditBox().Method_typeTextOnEditBox(object, value);
		}

	}

	/**
	 *  
	 * 
	 * 
	 * 
	 * 
	 */

	@Deprecated
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_wait(Integer timeOutInSecs) throws Exception {
		
		long timeOutmiliSecs = (long) Math.min(Context.current().getKeywordRemaningSeconds(),timeOutInSecs);
		
		Thread.sleep(timeOutmiliSecs*1000);
		return Result.PASS().setOutput(true).make();
	}

	/**
	 *  
	 * 
	 * 
	 * 
	 * 
	 */

	@Deprecated
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_CaptureSnapshot(String completeImagepath) throws WebDriverException, ToolNotSetException, IOException {

		File scrFile = Finder.findAppiumDriver().getScreenshotAs(OutputType.FILE);

		int suffix = 0;
		if (new File(completeImagepath).isDirectory()) {
			completeImagepath = completeImagepath.concat("\\OpKey").concat(String.valueOf(suffix).concat(".jpg"));
			while (new File(completeImagepath).exists()) {
				int prevSuffix = suffix;
				suffix++;
				completeImagepath = completeImagepath.replace(String.valueOf(prevSuffix), String.valueOf(suffix));
			}
		}

		FileUtils.copyFile(scrFile, new File(completeImagepath));
		return Result.PASS().setMessage("Snapshot AbsolutePath<".concat(completeImagepath).concat(">")).make();
	}

	/**
	 *  
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInNativeApplication
	@Deprecated
	public FunctionResult Method_verifyAllLink(String expectedLink) throws Exception {

		String temp = expectedLink;
		expectedLink = expectedLink.replace("\r", "");
		expectedLink = expectedLink.replace("\n", "");

		String fetchedLinks = Method_getAllLinks().getOutput();
		fetchedLinks = fetchedLinks.replace("\r", "");
		fetchedLinks = fetchedLinks.replace("\n", "");

		String[] expectedLinksArray = expectedLink.split(";");

		// Lenght for fetched Link String not matches the string count of
		// expected links string
		boolean canProceed_expLen_equals_fetchedLen = fetchedLinks.length() == expectedLink.length();
		boolean canProceedFurther = false;

		if (canProceed_expLen_equals_fetchedLen) {
			for (int expLinkArrayIndx = 0; expLinkArrayIndx < expectedLinksArray.length; expLinkArrayIndx++) {
				if (fetchedLinks.contains(expectedLinksArray[expLinkArrayIndx])) {
					canProceedFurther = true;
				} else {
					canProceedFurther = false;
					return Result.FAIL().setOutput(false).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).setMessage(ReturnMessages.verificationFailed(fetchedLinks, temp)).make();
				}
			}
		}
		if (canProceedFurther) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.ALL_LINK_MATCH.toString()).make();
		}
		return Result.FAIL().setOutput(false).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).setMessage(ReturnMessages.verificationFailed(fetchedLinks, temp)).make();

	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getSelectedRadioButtonFromGroup(AppiumObject object, int index) throws Exception {
		

		WebElement tempEle = Finder.findWebElementUsingCheckPoint(object);

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				String retVal = Utils.getAttrAndIgnoreExcecption(tempEle, "value");
				retVal = (retVal == null || retVal.trim().isEmpty()) ? tempEle.getText() : retVal;
				retVal = (retVal == null || retVal.trim().isEmpty()) ? Utils.getAttrAndIgnoreExcecption(tempEle, "name") : retVal;
				return Result.PASS().setOutput(retVal).make();
			}
		}.run();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_selectGroupRadioButton(AppiumObject object, int index) throws Exception {
		return radio.Method_SelectRadio(object, index);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@NotSupportedInApplicationMode
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	@Deprecated
	public FunctionResult Method_selectMultipleDropDownItemAndWait(AppiumObject object, String value, int timeOut) throws Exception {
		FunctionResult fr = new ListControl().Method_selectMultipleDropDownItem(object, value);
		if (fr.getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			Utils.waitUntill(timeOut);
		}
		return fr;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1 })
	@NotSupportedInNativeApplication
	@Deprecated
	public FunctionResult Method_selectDropDownItemAndWait(AppiumObject object, String value, int timeOut) throws Exception {
		FunctionResult fr = dropDown.Method_selectDropDownItem(object, value);
		if (fr.getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			Utils.waitUntill(timeOut);
		}
		return fr;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	@NotSupportedInNativeApplication
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1 })
	public FunctionResult Method_deselectDropDownItemAndWait(AppiumObject object, String value, int timeOut) throws Exception {

		FunctionResult fr = dropDown.Method_deselectDropDownItem(object, value);
		if (fr.getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			Utils.waitUntill(timeOut);
		}
		return fr;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_verifyEditBoxValue(AppiumObject object, String expectedValue) throws Exception {
		return editBox.Method_verifyeditboxtext(object, expectedValue);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_verifyEditBoxDefaultValue(AppiumObject object, String expectedValue) throws Exception {
		return editBox.Method_verifyeditboxtext(object, expectedValue);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@Deprecated
	public FunctionResult Method_verifyTextAreaValue(AppiumObject object, String expectedValue) throws Exception {
		WebElement we = Finder.findWebElementUsingCheckPoint(object);
		if (AppiumContext.isBrowserOrWebviewMode()) {
			String value = "";
			value = Utils.getAttrAndIgnoreExcecption(we, "value");
			if (value != null && value.equals(expectedValue)) {
				return Result.PASS().setOutput(true).setMessage(ReturnMessages.MATCHTEXT.toString()).make();

			} else {
				return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
						.setMessage(ReturnMessages.verificationFailed(value, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue())).make();
			}
		} else {
			return webObject.Method_ObjectTextVerification(object, expectedValue);
		}

	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@Deprecated
	public FunctionResult Method_verifyTextAreaDefaultValue(AppiumObject object, String expectedValue) throws Exception {
		return new Deprecate().Method_verifyTextAreaValue(object, expectedValue);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_selectRadioButtonAndWait(AppiumObject object, int timeOut) throws Exception {
		// TODO: Request of Testing Team this keyword is remove for release
		// appium date 22-6-2014 please open in next release
		
		int arbitaryIndex = 0;
		FunctionResult fr = radio.Method_SelectRadio(object, arbitaryIndex );
		if (fr.getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			Utils.waitUntill(timeOut);
		}
		return fr;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	@Deprecated
	public FunctionResult Method_clickButtonAndWait(AppiumObject object, int timeOut) throws Exception {
		FunctionResult fr = button.Method_clickButton(object);

		if (fr.getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			Utils.waitUntill(timeOut);
		}
		return fr;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 1 }, checkDataForWhiteSpace = { 1 })
	@Deprecated
	public FunctionResult Method_selectCheckBoxAndWait(AppiumObject object, String status, int timeOut) throws Exception {
		FunctionResult fr = checkbox.Method_selectCheckBox(object, status);
		if (fr.getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			Utils.waitUntill(timeOut);
		}
		return fr;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_deSelectCheckBoxAndWait(AppiumObject object, int timeOut) throws Exception {
		FunctionResult fr = checkbox.Method_deSelectCheckBox(object);
		if (fr.getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			Utils.waitUntill(timeOut);
		}
		return fr;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@NotSupportedInApplicationMode
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	@Deprecated
	public FunctionResult Method_goForwardAndWait(int timeOut) throws Exception {
		return browser.Method_goForward();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInApplicationMode
	@Deprecated
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_refreshAndWait(int timeOut) throws Exception {
		FunctionResult fr = browser.Method_RefreshBrowser();
		if (fr.getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			Utils.waitUntill(timeOut);
		}
		return fr;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInMobileContext
	@Deprecated
	public FunctionResult Method_doubleClickAndWait(AppiumObject object, int timeOut) throws Exception {
		return null;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInApplicationMode
	@Deprecated
	@KeywordArgumentValidation(checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_fetchBrowserTitle(String browsTitle) throws ToolNotSetException, WebDriverException, IOException {
		return browser.Method_fetchBrowserTitle_1();
	}

	/**
	 * @throws Exception
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_VerifyBrowserTitle(String browserName, String userBrowserTitle) throws Exception {
		return browser.Method_VerifyBrowserTitle_1(userBrowserTitle);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_verifyEditBoxDisabled(AppiumObject object) throws Exception {

		WebElement we = Finder.findWebElementUsingCheckPoint(object);
		
		if(EditBox.isEditbox(object, we)){
			FunctionResult functionResult =null;
			if (new Utils().isElementEnabled(we)) {
				functionResult = Result.PASS().setOutput(true).setMessage(ReturnMessages.ENABLED.toString()).make();
			} else {
				functionResult = Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false).setMessage(ReturnMessages.NOTENABLED.toString()).make();
			}
			
			if (functionResult.getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
				return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setMessage(ReturnMessages.NOT_VERFIED.toString()).setOutput(false).make();

			} else {
				return Result.PASS().setOutput(true).make();
			}
		}else {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
					.setMessage("The Object is not of editbox type").make();
		}
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	@NotSupportedInApplicationMode
	public FunctionResult Method_verifyImageDisabled(AppiumObject object) throws Exception {

		if (image.Method_verifyImageEnabled(object).getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			return Result.FAIL().setMessage(ReturnMessages.NOT_VERFIED.toString()).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).setOutput(false).make();
		} else {
			return Result.PASS().setOutput(true).make();
		}

	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_verifyImageNotVisible(AppiumObject object) throws Exception {
		if (image.Method_verifyImageVisible(object).getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			return Result.FAIL().setMessage(ReturnMessages.NOT_VERFIED.toString()).setOutput(false).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).make();

		} else {
			return Result.PASS().setOutput(true).make();
		}
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInApplicationMode
	@Deprecated
	public FunctionResult Method_VerifyDropDownDisabled(AppiumObject object) throws Exception {
		if (dropDown.Method_VerifyDropDownEnabled(object).getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			return Result.FAIL().setMessage(ReturnMessages.NOT_VERFIED.toString()).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).setOutput(false).make();

		} else {
			return Result.PASS().setOutput(true).make();
		}

	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@KeywordArgumentValidation(checkDataForWhiteSpace = { 0 }, checkDataForBlank = { 0 })
	@Deprecated
	public FunctionResult Method_verifyEditBoxnotExist(AppiumObject object, int timeOutInSecs) throws Exception {
		return this.Method_verifyObjectdoesnotExists(object);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_verifyEditBoxNonEditable(AppiumObject object) throws Exception {

		if (editBox.Method_verifyEditBoxEditable(object).getStatus().contentEquals(ExecutionStatus.Pass.toString())) {

			if (Finder.findWebElementUsingCheckPoint(object).isEnabled())
				return Result.FAIL().setMessage(ReturnMessages.NOT_VERFIED.toString()).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).setOutput(false).make();
			else
				return Result.PASS().setOutput(true).make();

		} else {

			return Result.PASS().setOutput(true).make();
		}

	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInApplicationMode
	@Deprecated
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_waitForEditBoxDisabled(AppiumObject object, int timeOutSecs) throws Exception {
		return new WebObjects().Method_waitForObjectdisable(object, timeOutSecs);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@Deprecated
	public FunctionResult Method_verifyEditBoxName(AppiumObject object, String expectedName) throws Exception {

		FunctionResult fr = editBox.Method_GetEditBoxName(object);
		if (ExecutionStatus.valueOf(fr.getStatus()) == ExecutionStatus.Pass) {
			if (fr.getOutput().contentEquals(expectedName)) {
				// Check ExpectedName To Element Name Text
				return Result.PASS().setOutput(true).setMessage(ReturnMessages.MATCHNAME.toString()).make();
			} else
				return Result.FAIL().setOutput(false).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code())
						.setMessage(ReturnMessages.verificationFailed(fr.getOutput(), Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue())).make();
		}
		return fr;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_verifyTextAreanotExist(AppiumObject object) throws Exception {

		return this.Method_verifyObjectdoesnotExists(object);

	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
//	@NotSupportedInNativeApplication
//	@Deprecated
//	public FunctionResult Method_verifyTextAreaNotEditable(AppiumObject object) throws Exception {
//		if (Finder.findWebElementUsingCheckPoint(object).isEnabled()) {
//			if (editBox.Method_verifyEditBoxEditable(object).getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
//				return Result.FAIL().setMessage(ReturnMessages.NOT_VERFIED.toString()).setOutput(false).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).make();
//			}
//			return Result.FAIL().setMessage(ReturnMessages.NOT_VERFIED.toString()).setOutput(false).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).make();
//		} else {
//			return Result.PASS().setOutput(true).make();
//		}
//	}
	
	@Deprecated
	public FunctionResult Method_verifyTextAreaNotEditable(AppiumObject object) throws Exception {
		WebElement element = Finder.findWebElementUsingCheckPoint(object);
		if (element.isEnabled()) {
			if (new Utils().isElementEnabled(element)) {
				return Result.FAIL().setMessage(ReturnMessages.NOT_VERFIED.toString()).setOutput(false).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).make();
			}
			return Result.FAIL().setMessage(ReturnMessages.NOT_VERFIED.toString()).setOutput(false).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).make();
		} else {
			return Result.PASS().setOutput(true).make();
		}
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@Deprecated
	public FunctionResult Method_verifyTextAreaName(AppiumObject object, String expectedName) throws Exception {
		return Method_verifyEditBoxName(object, expectedName);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_verifyTextAreaDisabled(AppiumObject object) throws Exception {

		if (editBox.Method_verifyEditBoxEnabled(object).getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			return Result.FAIL().setMessage(ReturnMessages.NOT_VERFIED.toString()).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).setOutput(false).make();
		} else {
			return Result.PASS().setOutput(true).make();
		}
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_verifyRadioButtonDisabled(AppiumObject object) throws Exception {

		if (radio.Method_verifyRadioButtonEnabled(object).getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			return Result.FAIL().setMessage(ReturnMessages.NOT_VERFIED.toString()).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).setOutput(false).make();
		} else {
			return Result.PASS().setOutput(true).make();
		}
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_focusRadioButton(AppiumObject object) throws Exception {
		
				Finder.findWebElementUsingCheckPoint(object);// .sendKeys("");
				return Result.PASS().setOutput(true).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_VerifyRadioButtonNotSelected(AppiumObject object, int index) throws Exception {
		int arbitaryIndex = 0;
		if (radio.Method_VerifyRadioButtonSelected(object, arbitaryIndex).getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			return Result.FAIL().setMessage(ReturnMessages.NOT_VERFIED.toString()).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).setOutput(false).make();
		} else {
			return Result.PASS().setOutput(true).make();
		}
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInApplicationMode
	@Deprecated
	public FunctionResult Method_verifyButtonDisabled(AppiumObject object) throws Exception {
		if (button.Method_verifyButtonEnabled(object).getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			return Result.FAIL().setMessage(ReturnMessages.NOT_VERFIED.toString()).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).setOutput(false).make();
		} else {
			return Result.PASS().setMessage(ReturnMessages.VERFIYED.toString()).setOutput(true).make();
		}
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_verifyCheckBoxDisabled(AppiumObject object) throws Exception {
		if (checkbox.Method_verifyCheckBoxEnabled(object).getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			return Result.FAIL().setMessage(ReturnMessages.NOT_VERFIED.toString()).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).setOutput(false).make();
		} else {
			return Result.PASS().setOutput(true).make();
		}

	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_verifyObjectdoesnotExists(AppiumObject object) throws Exception {

		try {
			if (Finder.findWebElementUsingCheckPoint(object) != null) {

				return Result.FAIL().setOutput(false).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).setMessage(ReturnMessages.NOT_VERFIED.toString()).make();
			}
		}
		// Below Exception Is Created By US Thrown By Finder Class
		catch (ObjectNotFoundException ex) {

			return Result.PASS().setOutput(true).setMessage(ReturnMessages.NOTEXIST.toString()).make();
		}

		// The Result under ELSE is overridden by the Exception Result

		return Result.FAIL().setOutput(false).setResultCode(ResultCodes.ERROR_OBJECT_NOT_FOUND.Code()).setMessage(ReturnMessages.NOTEXIST.toString()).make();

	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_verifyobjectDisabled(AppiumObject object) throws Exception {
		if (webObject.Method_ObjectisEnabled(object).getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			return Result.FAIL().setMessage(ReturnMessages.NOT_VERFIED.toString()).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).setOutput(false).make();
		} else {
			return Result.PASS().setMessage(ReturnMessages.VERFIYED.toString()).setOutput(true).make();
		}
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_verifyEditable(AppiumObject object) throws Exception {
		return editBox.Method_verifyEditBoxEditable(object);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@KeywordArgumentValidation(checkDataForWhiteSpace = { 1 }, checkDataForBlank = { 1 })
	@Deprecated
	public FunctionResult Method_typeTextAndWait(AppiumObject object, String value, int wait) throws Exception {

		FunctionResult fr = editBox.Method_typeTextOnEditBox(object, value);
		if (fr.getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			Utils.waitUntill(wait);
		}
		return fr;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@KeywordActionType({ActionType.GET})
	@Deprecated
	public FunctionResult Method_getRadioButtonCount(AppiumObject object) throws Exception {
		
		
		WebElement ele = Finder.findWebElementUsingCheckPoint(object);
		
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				
				if (!(ele.getTagName().equalsIgnoreCase("input") && ele.getAttribute("type").equalsIgnoreCase("radio"))) {
					return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setMessage("Specified Object is not Radio Button").make();
				}
				String nameAttr = ele.getAttribute("name");
				String xpath = "";
				if (nameAttr == null || nameAttr.isEmpty()) {
					xpath = "//input[@type='radio']";
				} else {
					xpath = "//input[@type='radio' and @name='" + nameAttr + "']";
				}

				System.out.println("This is xpath:-> " + xpath);
				List<WebElement> radios = ele.findElements(By.xpath(xpath));
				int count = radios.size();
				return Result.PASS().setOutput(count).make();
			}
		}.run();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@NotSupportedInNativeApplication
	@Deprecated
	public FunctionResult Method_verifyEditBoxLength(AppiumObject object, int expectedLength) throws Exception {

		int getLength = Integer.valueOf(textarea.Method_GetTextAreaLength(object).getOutput());

		if (textarea.Method_GetTextAreaLength(object).getResultCode() != 0) {
			return Result.FAIL().setOutput(false).setResultCode(ResultCodes.ERROR_INSUFFICIENT_PRIVILEGES.Code()).setMessage(ReturnMessages.PROPERTY_NOT_FOUND.toString()).make();
		}

		if (getLength == expectedLength)
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.Match_LENGTH.toString()).make();

		return Result.FAIL().setMessage(ReturnMessages.verificationFailed(getLength, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue()))
				.setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).make();

	}

	/**
	 * @throws Exception 
	 * @throws ArgumentDataMissingException
	 * @throws KeywordMethodOrArgumentValidationFailException
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInNativeApplication
	@Deprecated
	public FunctionResult Method_verifyTextareaColsRowLength(AppiumObject object, int expectedRow, int expectedCol)
			throws Exception {
		int getCols = Integer.parseInt(Finder.findWebElementUsingCheckPoint(object).getAttribute("cols"));
		int getRows = Integer.parseInt(Finder.findWebElementUsingCheckPoint(object).getAttribute("rows"));
		if (getCols == expectedCol && getRows == expectedRow)
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.MATCH_ROWS_AND_COLS.toString()).make();

		return Result.FAIL().setMessage(ReturnMessages.NOT_VERFIED.toString()).setOutput(false).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).make();

	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@Deprecated
	@NotSupportedInNativeApplication
	public FunctionResult Method_verifyTextAreaLength(AppiumObject object, int expectedLength) throws Exception {
		return Method_verifyEditBoxLength(object, expectedLength);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getAllButtons() throws Exception {

		List<WebElement> totalButton;
		// when driver under the webview
		if (AppiumContext.isBrowserOrWebviewMode()) {
			totalButton = Finder.findAppiumDriver().findElements(By.xpath("//input[@type='submit']"));
			totalButton.addAll(Finder.findAppiumDriver().findElements(By.tagName("button")));
		}
		// when driver the native
		else {
			totalButton = Finder.findAppiumDriver().findElements(By.className("android.widget.Button"));
			totalButton.addAll(Finder.findAppiumDriver().findElements(By.className("android.widget.ImageButton")));
		}
		return Result.PASS().setOutput(Utils.getDelimiteredText(totalButton)).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInApplicationMode
	@Deprecated
	public FunctionResult Method_verifyLinkDisabled(AppiumObject object) throws Exception {

		if (links.Method_verifyLinkEnabled(object).getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			return Result.FAIL().setMessage(ReturnMessages.NOT_VERFIED.toString()).setResultCode(ResultCodes.ERROR_VERIFICATION_FAILLED.Code()).setOutput(false).make();
		} else {
			return Result.PASS().setOutput(true).make();
		}
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInNativeApplication
	@Deprecated
	public FunctionResult Method_verifyAllLinkExist(String expectedLink) throws Exception {
		return Method_verifyAllLink(expectedLink);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInApplicationMode
	@Deprecated
	@KeywordArgumentValidation(checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_nextPageObject(AppiumObject object, int timeOutInSecs) throws Exception {
		return webObject.Method_waitforObject(object, timeOutInSecs);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@KeywordArgumentValidation(checkDataForBlank = { 0, 2 }, checkDataForWhiteSpace = { 0, 2 })
	@Deprecated
	public FunctionResult Method_waitForObjectProperty(AppiumObject object, String expectedPropertyName, String expectedPropertyValue, int timeOutInsesc) throws Exception {

		String getPropertyValue;
		long timeOutmiliSecs = (long) (timeOutInsesc * 1000.00);
		long callTimeOut = Context.current().getCallTimeoutInMillis();
		callTimeOut = callTimeOut - 1000;
		// if the stepTimeout is lesser than given timeout then wait for
		// stepTimeout
		long effectiveTimeOutmiliSecs = Math.min(timeOutmiliSecs, callTimeOut);
		System.out.println("effectiveTimeOutmiliSecs " + effectiveTimeOutmiliSecs);
		Date startTime = Calendar.getInstance().getTime();

		while (true) {

			try {
				// Fetch a Property Value From Property Name And PropertyName Is
				// Given
				// By User
				getPropertyValue = webObject.Method_getPropertyValue(object, expectedPropertyName).getOutput();

				if (expectedPropertyValue.equalsIgnoreCase(getPropertyValue))
					return Result.PASS().setOutput(true).setMessage(ReturnMessages.MATCH_PROPERTY.toString()).make();
			} catch (InterruptedException e) {
				throw e;
			} catch (Exception e) {
				Thread.sleep(300);
			}

			long diffInMiliSeconds = (Calendar.getInstance().getTime().getTime() - startTime.getTime());
			if (diffInMiliSeconds >= effectiveTimeOutmiliSecs)
				return Result.FAIL().setOutput(false).setResultCode(ResultCodes.ERROR_UNSUPPORTED_OPERATION.Code())
						.setMessage("Waited for " + (((double) diffInMiliSeconds) / 1000) + "seconds" + ReturnMessages.PROPERTY_NOT_FOUND.toString()).make();

		}
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInApplicationMode
	@Deprecated
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_GetAllTitles(String BrowserName) throws Exception {

		// Return the name of tabs open in the chrome browser
		String outputValue = "";
		String delimeter = Utils.getDelimiter();
		String temp = null;
		Set<String> availableWindowsHandle = Finder.findAppiumDriver().getWindowHandles();

		for (String windowHandle : availableWindowsHandle) {
			Finder.findAppiumDriver().switchTo().window(windowHandle);
			temp = Finder.findAppiumDriver().getTitle();
			outputValue = outputValue.concat(temp + delimeter);
		}
		if (outputValue.endsWith(delimeter)) {
			outputValue = outputValue.substring(0, outputValue.length() - 1);
		}
		return Result.PASS().setOutput(outputValue).make();

	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@KeywordArgumentValidation(checkDataForWhiteSpace = { 0, 1 }, checkDataForBlank = { 1 })
	@Deprecated
	public FunctionResult Method_typeKeysAndWait(AppiumObject object, String value, int timeOutInSecs) throws Exception {
		editBox.Method_typeKeysOnEditBox(object, value);
		Utils.waitUntill(timeOutInSecs);
		return Result.PASS().setOutput(true).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInApplicationMode
	@Deprecated
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_GetElementIndex(AppiumObject object) throws Exception {

		String getIndex = ((Finder.findWebElementUsingCheckPoint(object).getAttribute("index")));
		getIndex = (getIndex == null) ? getIndex : getIndex.trim();

		if (getIndex == null) {
			return Result.FAIL().setOutput(false).setResultCode(ResultCodes.ERROR_INSUFFICIENT_PRIVILEGES.Code()).setMessage(ReturnMessages.PROPERTY_NOT_FOUND.toString()).make();
		}

		if (getIndex.equalsIgnoreCase(""))
			return Result.FAIL().setOutput(false).setResultCode(ResultCodes.ERROR_INSUFFICIENT_PRIVILEGES.Code()).setMessage(ReturnMessages.PROPERTY_NOT_FOUND.toString()).make();

		return Result.PASS().setOutput(getIndex).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@NotSupportedInMobileContext
	@Deprecated
	public FunctionResult Method_setPage(AppiumObject object) throws Exception {
		return null;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@Deprecated
	public FunctionResult Method_returnConcatenated(String val1, String val2, String val3) throws Exception {
		return Result.PASS().setOutput(val1.concat(val2).concat(val3)).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@NotSupportedInApplicationMode
	@Deprecated
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getAllFields() throws Exception {

		String outputValue = "";
		String delimeter = Utils.getDelimiter();
		String temp = null;
		// Fetch All The Element Whose Type Are Text
		List<WebElement> field = Finder.findAppiumDriver().findElements(By.xpath("//input[@type='text']"));
		for (WebElement ele : field) {
			temp = ele.getAttribute("id"); // Get The Id From TextType
			outputValue = outputValue.concat(temp + delimeter);
		}
		if (outputValue.endsWith(delimeter)) {
			outputValue = outputValue.substring(0, outputValue.length() - 1);
		}
		return Result.PASS().setOutput(outputValue).make();

	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInHybridApplication
	@Deprecated
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 }, checkDataForDelimiter = { 0 })
	public FunctionResult Method_clickAt(AppiumObject object, String value) throws Exception {

		if (AppiumContext.getDeviceType() == DeviceType.Selendroid) {
			return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false).setMessage(ReturnMessages.ONLY_NATIVE_APPLICATION_SUPPORTED.toString()).make();
		}

		String delemeter = Utils.getDelimiter();
		int x, y;
		String[] expectedPostion = value.split(delemeter);
		x = Integer.parseInt(expectedPostion[0]);
		y = Integer.parseInt(expectedPostion[1]);

		WebElement baseElement = Finder.findWebElementUsingCheckPoint(object);
		int elementX = baseElement.getLocation().getX();
		int ElementY = baseElement.getLocation().getY();
		Utils.tap(x + elementX, y + ElementY);
		return Result.PASS().setOutput(true).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInMobileContext
	@Deprecated
	public FunctionResult Method_doubleClickAt(AppiumObject object, String value) throws Exception {
		return null;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	// TODO: this keyword implmented with different argument with different
	// database of opkey like personal and BPT

	// this method with two argument exist in different database of opkey so we
	// can not be remove
	@NotSupportedInMobileContext
	@Deprecated
	public FunctionResult Method_runScriptAndWait__(String Script, String timeOutInSecs) throws Exception {
		return null;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	// In the Team edition run script and wait accept three argument OROBJECT
	// and SCRIPT and TIMESECOND
	// this time is release so we execute this method
	@Deprecated
	public FunctionResult Method_runScriptAndWait(AppiumObject object, String Script, int timeOutInSecs) throws Exception {
		
		WebElement ele = Finder.findWebElementUsingCheckPoint(object);
		
		JavascriptExecutor js = (JavascriptExecutor) Finder.findAppiumDriver();
		js.executeScript(Script, ele);
		Utils.waitUntill(timeOutInSecs);
		return Result.PASS().setOutput(true).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInApplicationMode
	@Deprecated
	public FunctionResult Method_dragAndDropAndWait(AppiumObject object, String value, int timeOutInsesc) throws Exception {
		FunctionResult fr = Method_dragAndDrop(object, value);
		if (fr.getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			Utils.waitUntill(timeOutInsesc);
		}

		return Result.PASS().setOutput(true).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInApplicationMode
	@Deprecated
	public FunctionResult Method_dragAndDrop(AppiumObject object, String value) throws Exception {
		String delemeter = Utils.getDelimiter();
		int x_Offset, y_Offset;
		String[] expectedPostion = value.split(delemeter);
		x_Offset = Integer.parseInt(expectedPostion[0]);
		y_Offset = Integer.parseInt(expectedPostion[1]);
		WebElement draggable = Finder.findWebElementUsingCheckPoint(object);
		new Actions(Finder.findAppiumDriver()).dragAndDropBy(draggable, x_Offset, y_Offset).build().perform();
		return Result.PASS().setOutput(true).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	
	
	
	
	
	@Deprecated
	public FunctionResult Method_keyPressNative(String data) throws Exception {
		Actions builder = new Actions(Finder.findAppiumDriver());
		builder.sendKeys(Utils.getKeyCode(data)).perform();
		return Result.PASS().setOutput(true).make();
	}

	/**
	 * @throws InterruptedException
	 * @throws ObjectNotFoundException
	 * @throws TimeOut_ObjectNotFoundException 
	 * @throws ArgumentDataMissingException
	 * @throws KeywordMethodOrArgumentValidationFailException
	 * 
	 * 
	 *                                                        Method_getChildObjectCount Method_getChildObjectCount
	 */

	@Deprecated
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1 })
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getChildObjectCount(AppiumObject object, String type, String pname, String pvalue) throws ToolNotSetException, ObjectNotFoundException, InterruptedException, TimeOut_ObjectNotFoundException {

		AppiumContext.setDeviceType(DeviceType.IPhoneRealDevice);
		if (!(AppiumContext.getBrowserMode().equals(BrowserType.SafariOnIos) || AppiumContext.getBrowserMode().equals(BrowserType.chromeOnLocalAndroid)
				|| AppiumContext.getBrowserMode().equals(BrowserType.ChromeOnCloud)))
			if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice) {
				String xpath = "";
				List<AppiumObjectProperty> list = object.getXPaths();
				for (AppiumObjectProperty appiumObjectProperty : list) {
					if (appiumObjectProperty.getValue().contains("XCUIE")) {
						xpath = appiumObjectProperty.getValue();
						break;
					}
				}
				String source = Finder.findAppiumDriver().getPageSource();
				Document html = Jsoup.parse(source);
				String tag = xpath.split("\\)")[0].split("\\//")[1];
				if (tag.contains("[")) {
					tag = tag.split("\\[")[0];
				}
				String value = null;
				// String value =
				// str.split("\\)")[1].split("\\[")[1].split("\\]")[0];
				try {
					value = xpath.split("\\)")[1];
				} catch (ArrayIndexOutOfBoundsException ex) {
					value = xpath.split("\\)")[0];
				}
				try {
					value = value.split("\\[")[1].split("\\]")[0];
				} catch (ArrayIndexOutOfBoundsException ex) {
					value = "1";
				}
				int valueFinal = Integer.parseInt(value) - 1;
				Element parent = html.select(tag).get(valueFinal);
				Elements children = parent.select(type);
				int count = 0;
				if (pvalue.isEmpty() || pname.isEmpty() || pvalue.equals("") || pname.equals("")) {
					count = children.size();
				} else {
					for (Element element : children) {
						if (element.attr(pname).equals(pvalue)) {
							count++;
						}
					}
				}
				return Result.PASS().setOutput(count).make();
			}
		WebElement interMediateobject = Finder.findWebElement(object);
		
		String xpathTo = ""; 
		if(pvalue.isEmpty()) {
			xpathTo =  ".//" + type;
		}else {
			xpathTo = ".//" + type + "[@" + pname + "='" + pvalue + "']";
		}
		int childObjectCount = interMediateobject.findElements(By.xpath(xpathTo)).size();
		return Result.PASS().setOutput(childObjectCount).make();

	}

	/**
	 * @throws MethodOnlyWorkingWithWebViewMode
	 * @throws InterruptedException
	 * 
	 * 
	 * 
	 * 
	 */

	@NotSupportedInNativeApplication
	@Deprecated
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getAllLinks() throws ToolNotSetException, InterruptedException {
		List<WebElement> totalLinks;
		totalLinks = Finder.findAppiumDriver().findElements(By.tagName("a"));
		totalLinks.addAll(Finder.findAppiumDriver().findElements(By.tagName("Link")));
		return Result.PASS().setOutput(Utils.getDelimiteredText(totalLinks)).make();

	}

	@NotSupportedInMobileContext
	public FunctionResult Method_excelCompare(String filePath1, String FilePath2, String SourceSheetName, String DestinationSheetName) throws Exception {
		return null;
	}

	public static String stringFromBase64(String base64) {
		StringBuilder binary = new StringBuilder();
		int countPadding = countPadding(base64);
		for (int i = 0; i < (base64.length() - countPadding); i++) {
			int base64Value = fromBase64(String.valueOf(base64.charAt(i)));
			String base64Binary = Integer.toBinaryString(base64Value);
			StringBuilder base64BinaryCopy = new StringBuilder();
			if (base64Binary.length() < 6) {
				for (int j = base64Binary.length(); j < 6; j++) {
					binary.append("0");
					base64BinaryCopy.append("0");
				}
				base64BinaryCopy.append(base64Binary);
			} else {
				base64BinaryCopy.append(base64Binary);
			}
			binary.append(base64Binary);
		}
		StringBuilder utf8String = new StringBuilder();
		for (int bytenum = 0; bytenum < (binary.length() / 8); bytenum++) {
			StringBuilder utf8Bit = new StringBuilder();
			for (int bitnum = 0; bitnum < 8; bitnum++) {
				utf8Bit.append(binary.charAt(bitnum + (bytenum * 8)));
			}
			char utf8Char = (char) Integer.parseInt(utf8Bit.toString(), 2);
			utf8String.append(String.valueOf(utf8Char));
		}
		return utf8String.toString();
	}

	private static int fromBase64(String x) {
		String charBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		return charBase64.indexOf(x);
	}

	private static int countPadding(String countPadding) {
		int index = countPadding.indexOf("=");
		int count = 0;
		while (index != -1) {
			count++;
			countPadding = countPadding.substring(index + 1);
			index = countPadding.indexOf("=");
		}
		return count;
	}

	public static boolean isBase64(String stringBase64) {
		String regex = "([A-Za-z0-9+/]{4})*" + "([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)";
		Pattern patron = Pattern.compile(regex);
		if (!patron.matcher(stringBase64).matches()) {
			return false;
		} else {
			return true;
		}
	}

}
