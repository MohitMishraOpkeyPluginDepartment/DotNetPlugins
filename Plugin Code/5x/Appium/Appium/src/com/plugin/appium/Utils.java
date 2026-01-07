package com.plugin.appium;

import java.awt.AWTException;
import java.awt.Dimension;
import java.awt.Point;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.ProcessBuilder.Redirect;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Random;
import java.util.Set;
import java.util.Stack;
import java.util.TreeMap;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Attribute;
import org.jsoup.nodes.Attributes;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.Capabilities;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.NoSuchWindowException;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.UnhandledAlertException;
import org.openqa.selenium.UnsupportedCommandException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.plugin.appium.CustomClasses.CustomSelect;
import com.plugin.appium.android.AndroidVersion;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.BrowserType;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.enums.DriverWindow;
import com.plugin.appium.enums.ElementAttributes;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.AdbNotFoundException;
import com.plugin.appium.exceptionhandlers.ElementNotExistInDropDownException;
import com.plugin.appium.exceptionhandlers.KeywordMethodOrArgumentValidationFailException;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.TimeOut_ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.exceptionhandlers.UnableToProcessADBCommandException;
import com.plugin.appium.javascript.ClientSideScripts;
import com.plugin.appium.keywords.GenericKeyword.UnCategorised;
import com.plugin.appium.keywords.GenericKeyword.Waits;
import com.plugin.appium.util.FunctionCaller;
import com.plugin.appium.util.GenericCheckpoint;
import com.ssts.pcloudy.exception.ConnectError;
import io.appium.java_client.MobileDriver;
import io.appium.java_client.TouchAction;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.nativekey.AndroidKey;
import io.appium.java_client.android.nativekey.KeyEvent;
import io.appium.java_client.touch.TapOptions;
import io.appium.java_client.touch.WaitOptions;
import io.appium.java_client.touch.offset.ElementOption;
import io.appium.java_client.touch.offset.PointOption;

public class Utils {
	static Logger logger = Logger.getLogger(Utils.class.getName());
	private static boolean isAngular = true;
	private static ExecutorService executor;

	/**
	 * Waits for the page to load completely
	 * 
	 * 
	 * @throws InterruptedException
	 * @throws ToolNotSetException
	 */

	public static void waitForPageLoad(WebDriver driver)
			throws InterruptedException, ToolNotSetException, UnhandledAlertException, NoSuchWindowException {
		logger.finer("Waiting for page load...");

		int waitTime = Utils.getRemainingTimeForLoading();
		long startTime = System.currentTimeMillis();

		Finder.findAppiumDriver().manage().timeouts().setScriptTimeout(10, TimeUnit.SECONDS);

		while (!checkPageReadyState(driver)) {

			// _Performance_Issue
			Log.print(">>Wait Time " + waitTime);
			long diffTime = System.currentTimeMillis() - startTime;

			if (diffTime < (waitTime * 1000)) {
				// Previous value was 1000
				Thread.sleep(500);
			} else {
				break;
			}
		}
	}

	public static int getRemainingTimeForLoading() {
		int remainingTime = Context.current().getKeywordRemaningSeconds();
		remainingTime = Math.min(remainingTime, new Utils().getXMLHttpRequestWaitTime());
		return remainingTime;
	}

	public static void waitForAngularPageLoad() throws InterruptedException, ToolNotSetException {

		if (isAngular) {
			Log.print("Utils Class: CALLING ANGULAR WAIT");
			ClientSideScripts.WaitForAngular(Finder.findAppiumDriver());
		}
	}

	/**
	 * Checks the current PageLoadStatus
	 * 
	 * @param driver
	 * @return
	 */
	private static Boolean checkPageReadyState(WebDriver driver) {
		try {
			String readyState = ((org.openqa.selenium.JavascriptExecutor) driver)
					.executeScript("return document.readyState").toString();

			String msg = "Current Browser State is: " + readyState;
			logger.finer(msg);
			System.out.println("checkPageReadyState   " + msg);
			return (readyState.equals("complete") || (readyState.equals("interactive")));

		} catch (Exception ex) {
			boolean conditionalPass = (ex.getMessage().contains("waiting for evaluate.js load failed")) ? true : false;
			return conditionalPass;
		}

	}

	boolean canWait(int timeOutInSecs) {
		long timeOutmiliSecs = (long) (timeOutInSecs * 1000.00);
		Date startTime = Calendar.getInstance().getTime();
		long diffInMiliSeconds = (Calendar.getInstance().getTime().getTime() - startTime.getTime());
		boolean canWaitMore = (diffInMiliSeconds >= timeOutmiliSecs) ? true : false;
		return canWaitMore;
	}

	public static boolean waitUntill(int timeOutInSecs) throws InterruptedException {
		int waitFor = (Math.min(Context.current().getKeywordRemaningSeconds(), timeOutInSecs) * 1000);
		Thread.sleep(waitFor);
		return true;
	}

	/**
	 * Checkpoint supported
	 * 
	 * @return
	 * @throws ToolNotSetException
	 */
	public static boolean alertVerifaction() throws ToolNotSetException {
		if (getBrowserName().contentEquals("opera") || getBrowserName().contentEquals("safari")) {

		}

		try {
			switchToAlert();
			return true;
		} catch (Exception e) {
			Log.debug(e.getStackTrace());
			return false;
		}
	}

	public static String getBrowserName() throws ToolNotSetException {

		Capabilities cap = ((RemoteWebDriver) Finder.findAppiumDriver()).getCapabilities();
		String browserName = cap.getBrowserName().toLowerCase();
		System.out.println("----browserName" + browserName);
		return browserName;

	}

	public static String getDeviceName() throws ToolNotSetException {
		String deviceName = Finder.findAppiumDriver().getCapabilities().getCapability("deviceName").toString()
				.toLowerCase();
		System.out.println("----deviceName" + deviceName);
		return deviceName;
	}

	public static String allignText(String cellText) {
		cellText = cellText.replace("\r", "");
		cellText = cellText.replace("\n", "");
		cellText = cellText.replace(" ", "");
		return cellText;
	}

	public static String getDelimiter() {
		return ";";
	}

	/**
	 * Checkpoint Not Required
	 */

	public static Boolean isElementSelected(WebElement we) throws Exception {
		System.out.println("  AppiumContext.getDriverWindow() " + AppiumContext.getDriverWindow()
				+ "  AppiumContext.isBrowserMode() " + AppiumContext.isBrowserMode()
				+ " AppiumContext.getBrowserMode() " + AppiumContext.getBrowserMode());

		if (AppiumContext.getDriverWindow() == DriverWindow.WebView || AppiumContext.isBrowserMode()) {
			Boolean checkBoxStatus = false; // by default
			if (AppiumContext.getBrowserMode() == BrowserType.ChromeOnCloud
					|| AppiumContext.getBrowserMode() == BrowserType.chromeOnLocalAndroid
					|| AppiumContext.getBrowserMode() == BrowserType.SafariOnIos) {
				System.out.println(
						"##<< Browser mode && AppiumContext.getBrowserMode() -> " + AppiumContext.getBrowserMode());
				try {
					checkBoxStatus = we.isSelected();
				} catch (Exception e) {
					System.out.println("##<< Exception in getting checkbox status " + checkBoxStatus);
					// e.printStackTrace();
					System.out.println(e.getMessage());
				}
			}
			return checkBoxStatus;

		}
		// When checkbox / radio button is part of Native Application
		else {
			System.out.println("##<< native mode  ");
			String checkBoxStatus = " "; // by default
			try {
				checkBoxStatus = we.getAttribute("selected");
				System.out.println("##<< Native  mode :: checkbox checked /unchecked   " + checkBoxStatus);
				if (checkBoxStatus.toUpperCase().contentEquals("TRUE")) {
					return true;
				}
				if (checkBoxStatus.toUpperCase().contentEquals("FALSE")) {
					return false;
				}
			} catch (Exception e) {
				System.out.println("##<< Exception in getting checkbox status " + checkBoxStatus);
				// e.printStackTrace();
				System.out.println(e.getMessage());

			}

			if (getAttrAndIgnoreExcecption(we, "selected").toUpperCase().contentEquals("TRUE"))
				return true;
			else
				return false;
		}

		// when checkbox / radio button is part of Webview in hybrid application

	}

	/**
	 * ExpectedCondition used to wait.
	 * 
	 * @param we
	 * @param TimeOut
	 * @return
	 * @throws Exception
	 */
	public Boolean waitElementEnable(WebElement we, int TimeOut) throws Exception {

		int remainsTime = Math.min(Context.current().getKeywordRemaningSeconds(), TimeOut);

		Log.print("WaitTime : " + remainsTime);

		WebDriverWait wait = new WebDriverWait(Finder.findAppiumDriver(), remainsTime);
		try {
			return wait.until((ExpectedCondition<Boolean>) driver -> {
				try {
					return isElementEnabled(we);
				} catch (Exception ex) {
					return false;
				}
			});
		} catch (Exception ex) {
			return false;
		}
	}

	/**
	 * ExpectedCondition used to wait.
	 * 
	 * @param we
	 * @param TimeOut
	 * @return
	 * @throws Exception
	 */

	public Boolean waitElementDisable(WebElement we, int TimeOut) throws Exception {

		TimeOut = Math.min(Context.current().getKeywordRemaningSeconds(), TimeOut);

		WebDriverWait wait = new WebDriverWait(Finder.findAppiumDriver(), TimeOut);
		try {
			return wait.until((ExpectedCondition<Boolean>) driver -> {
				try {
					return !isElementEnabled(we);
				} catch (Exception ex) {
					return false;
				}
			});
		} catch (Exception ex) {
			return false;
		}
	}

	/**
	 * Checkpoint supported
	 * 
	 * @param we
	 * @return
	 * @throws Exception
	 */
	// check the element is Enabled or not
	public Boolean isElementEnabled(WebElement myObject) throws Exception {
		if (AppiumContext.isBrowserOrWebviewMode()) {
			Log.print("checking for DOM Status:::" + myObject.isEnabled());
			String tagName = myObject.getTagName();
			String html = myObject.getAttribute("outerHTML");
			if (tagName.equalsIgnoreCase("td") || tagName.equalsIgnoreCase("th") || tagName.equalsIgnoreCase("tr")) {
				html = "<table>" + myObject.getAttribute("outerHTML") + "</table>";
			} else {
				html = myObject.getAttribute("outerHTML");
			}
			boolean enabled = false;
			if (myObject.isEnabled()) {
				enabled = true;
				Log.print("outer html is \n" + html);
				enabled = true;
				if (html != null) {
					Document source = Jsoup.parse(html);
					Elements element = source.select(myObject.getTagName());
					if (((html.toLowerCase().contains("readonly") || (html.toLowerCase().contains("disabled")))
							&& (!(html.toLowerCase().contains("ng-readonly")
									|| (html.toLowerCase().contains("ng-disabled")))))
							&& (!element.attr("name").contains("disabled"))
							&& (!element.attr("id").contains("disabled"))) {
						Attributes attribute = ((Element) element.get(0)).attributes();
						for (Attribute attribute2 : attribute) {
							if ((attribute2.getKey().contains("disabled") || attribute2.getKey().contains("readonly"))
									&& (attribute2.getValue() != null)
									&& ((attribute2.getValue().equals("true")) || (attribute2.getValue().equals(""))
											|| (attribute2.getValue().equals("readonly"))
											|| (attribute2.getValue().equals("disabled")))) {
								enabled = false;
								break;
							}
						}
					}
				}
			}
			return enabled;
		} else {
			return myObject.isEnabled();
		}
	}

	/**
	 * Checkpoint supported
	 * 
	 * @throws TimeOut_ObjectNotFoundException
	 */

	@Deprecated
	public static boolean switchDriverIfNeeded(AppiumObject object)
			throws ToolNotSetException, InterruptedException, ObjectNotFoundException, TimeOut_ObjectNotFoundException {
		Finder.continueSearchingOrStop();
		Stack<AppiumObject> stk = new Stack<AppiumObject>();

		boolean switchSuccessful = false;
		// push all the parent hierarchy into the stack
		AppiumObject currentObject = object;

		// if the currentObject is itself a frame(condition appears in
		// SelectFrame keyword), then add thyself in the stack
		if (currentObject.getTagName().getValue().toLowerCase().contains("frame")) {
			stk.push(currentObject);
		}

		while (currentObject.getParentObject() != null) {
			Finder.continueSearchingOrStop();
			currentObject = currentObject.getParentObject();
			stk.push(currentObject);
		}
		logger.finer("the stack size is " + stk.size() + " means object lies at " + stk.size() + " level");
		// now start switching
		while (stk.size() > 0) {
			Finder.continueSearchingOrStop();
			switchSuccessful = false;
			AppiumObject obj = stk.pop();

			if (obj.getTagName().getValue().toLowerCase().contains("frame")) {

				logger.info("Switching WebDriver to frame");
				logger.info("   =>Current URL:" + Finder.findAppiumDriver().getCurrentUrl());
				WebDriver driver = Finder.findAppiumDriver();
				if (!obj.getName().isValueNullOrEmpty()) {

					Finder.continueSearchingOrStop();
					try {
						logger.info("  -> Switching by Name: " + obj.getName().getValue());

						driver.switchTo().frame(obj.getName().getValue());
						switchSuccessful = true;
					} catch (WebDriverException ex) {
						// logger.finest(ex.getMessage());
					}

				}
				logger.finer("Status switchSuccessful is " + switchSuccessful);
				if (!switchSuccessful && !obj.getId().isValueNullOrEmpty()) {
					Finder.continueSearchingOrStop();
					try {
						logger.info("  -> Switching by Id: " + obj.getId().getValue());
						driver.switchTo().frame(obj.getId().getValue());
						switchSuccessful = true;
					} catch (WebDriverException ex) {
						// logger.finest(ex.getMessage());
					}

				}
				logger.finer("Status switchSuccessful is " + switchSuccessful);

				if (!switchSuccessful && !obj.getSrc().isValueNullOrEmpty()) {
					Finder.continueSearchingOrStop();
					try {
						String frameXPath = "//iframe[@src=\"" + obj.getSrc().getValue() + "\"]";
						logger.info("  -> Switching by frame with xpath: " + frameXPath);
						WebElement iframe = Finder.findAppiumDriver().findElement(By.xpath(frameXPath));
						driver.switchTo().frame(iframe);
						switchSuccessful = true;
					} catch (WebDriverException ex) {
						// logger.finest(ex.getMessage());
					}
				}
				logger.finer("Status switchSuccessful is " + switchSuccessful);
				if (!switchSuccessful && !obj.getUrl().isValueNullOrEmpty()) {
					Finder.continueSearchingOrStop();
					try {
						String frameXPath = "//iframe[@src=\"" + obj.getUrl().getValue() + "\"]";
						logger.info("  -> Switching by frame with xpath: " + frameXPath);
						WebElement iframe = Finder.findAppiumDriver().findElement(By.xpath(frameXPath));
						driver.switchTo().frame(iframe);
						switchSuccessful = true;
					} catch (WebDriverException ex) {
						// logger.finest(ex.getMessage());
					}
				}
				logger.finer("Status switchSuccessful is " + switchSuccessful);
				if (!switchSuccessful && obj.index != null && obj.index > -1) {
					Finder.continueSearchingOrStop();
					try {
						logger.info("  -> Switching by Index: " + obj.index);
						driver.switchTo().frame(obj.index);
						switchSuccessful = true;
					} catch (WebDriverException ex) {
						// logger.finest(ex.getMessage());
					}

				}
				logger.finer("Status switchSuccessful is " + switchSuccessful);
				if (switchSuccessful) {
					logger.info("   =>URL after switching: " + Finder.findAppiumDriver().getCurrentUrl());
				} else {
					logger.info("  -> Unable to switch AppiumDriver");
				}

			}
		}
		return switchSuccessful;
	}

	/**
	 * CHeckPoint supported
	 * 
	 * @param we
	 * @return
	 * @throws Exception
	 */

	public static String getText(boolean checkPoint, WebElement we) throws Exception {
		if (checkPoint) {
			return FunctionCaller.callWithChekPoint(() -> Utils.getText(we), "GetText Time Taken");
		} else {
			return FunctionCaller.callReturnFunction(() -> Utils.getText(we), "GetText Time Taken");
		}
	}

	public static String getText(WebElement we) throws Exception {
		// old method now throwing exceptions due to removal of some attributes
		String returnText = we.getText();

		logger.fine("Text using Appium inbuild function getText() " + returnText);

		if (AppiumContext.isBrowserOrWebviewMode()) {
			returnText = (returnText == null || returnText.trim().equalsIgnoreCase(""))
					? getAttrAndIgnoreExcecption(we, "value")
					: returnText;
		} else {

			// value attribute not working in android version 4.4
			if (returnText == null || returnText.trim().equalsIgnoreCase("")) {

				try {
					// when name attribute is not found then no such element
					// exception is generated
					returnText = getAttrAndIgnoreExcecption(we, "name");
					logger.fine("Text using Appium inbuild function getAttribute(name) " + returnText);

				} catch (NoSuchElementException ex) {
					ex.printStackTrace();
				}
			}

			if (returnText == null || returnText.trim().equalsIgnoreCase("")) {

				try {
					// when value attribute is not found then no such element
					// exception is generated
					returnText = getAttrAndIgnoreExcecption(we, "value");
					logger.fine("Text using Appium inbuild function getAttribute(value) " + returnText);

				} catch (NoSuchElementException e) {
					// e.printStackTrace();
					System.out.println("Warning exception while getText-1: " + e.getMessage());
				} catch (UnsupportedCommandException e) {
					Log.print(e.getMessage());
				}
			}

			if (returnText == null || returnText.trim().equalsIgnoreCase("")) {

				try {
					// when label attribute is not found then no such element
					// exception is generated
					returnText = getAttrAndIgnoreExcecption(we, "label");
					logger.info("Text using Appium inbuild function getAttribute(label) " + returnText);

				} catch (NoSuchElementException e) {
				}
			}
		}
		return returnText;

	}

	public static void pressAndroidButton(AndroidKey androidKey) throws ToolNotSetException {

		if (AppiumContext.getBrowserMode() == BrowserType.SafariOnIos) {
			// In the case of safari on ios driver not able to pass the keycode
			// to appium server
			return;
		}

		AndroidDriver androidDriver = (AndroidDriver) Finder.findAppiumDriver();

		if (AppiumContext.isBrowserMode()) {
			// when we automate the Chrome and safari browse must to switching
			// context of Appium
			String currentContext = Finder.findAppiumDriver().getContext();
			androidDriver.context("NATIVE_APP");
			androidDriver.pressKey(new KeyEvent(androidKey));
			androidDriver.context(currentContext);

		} else {
			androidDriver.pressKey(new KeyEvent(androidKey));
		}
	}

	public static FunctionResult pressEnter(WebElement we) throws ToolNotSetException, AWTException {

		if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {
			// In the safari browser on ios not able to switch to driver not
			// able to execute the enter key code might be appium bug
			// So special treatment for ios on safari

			logger.fine(" try to press the enter button ");
			try {
				we.sendKeys(Keys.ENTER);
			} catch (org.openqa.selenium.WebDriverException ex) {
				// if the Enter key not found on given page
				if (ex.getMessage().contains("An error occurred while executing user supplied JavaScript.")) {
					return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
							.setMessage(ReturnMessages.BUTTON_NOT_FOUND.toString()).make();
				}
				throw ex;
			}
		}
		// In the case of android
		return new UnCategorised().Method_Enter();
	}

	public static void swipe(int startx, int starty, int endx, int endy, int duration)
			throws ToolNotSetException, InterruptedException {

		try {
			// Finder.findAppiumDriver().swipe(startx, starty, endx, endy, duration);

			new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(startx, starty))
					.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000))).moveTo(PointOption.point(endx, endy))
					.release().perform();
		}

		catch (Exception e) {
			System.out.println("Warning exception while swipe: " + e.getMessage());

			if (AppiumContext.getMobileDevice() != null && AppiumContext.getDeviceType() == DeviceType.Android) {
				// In the case of iPhone simulator not getting the device
				AndroidVersion ver = new AndroidVersion(AppiumContext.getMobileDevice().getVersion());

				Thread.sleep(2000);

				new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(startx, starty))
						.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000)))
						.moveTo(PointOption.point(endx, endy)).release().perform();
			}
		}
	}

	public static Boolean deselectDropdownItem(AppiumObject object, Boolean objectType) throws Exception {

		WebElement we = Finder.findWebElement(object);
		String getText = null;
		// work on dropdown in webview
		if (AppiumContext.getDriverWindow() == DriverWindow.WebView) {
			Select selectData = new Select(we);
			selectData.selectByVisibleText(selectData.getAllSelectedOptions().get(0).getText());
		}
		// when driver is in the native mode and work on spinner
		else {
			we.click();
			List<WebElement> listDropDownItem = Finder.findAppiumDriver()
					.findElements(By.className("android.widget.CheckedTextView"));
			listDropDownItem.addAll(Finder.findAppiumDriver().findElements(By.className("android.widget.TextView")));
			getText = listDropDownItem.get(0).getText();
			listDropDownItem.get(0).click();

		}
		String getSelectedItem = we.getText();
		if (getText.contentEquals(getSelectedItem)) {
			return true;
		}
		return false;
	}

	public static void tap(int x, int y) throws ToolNotSetException {

		if (AppiumContext.isBrowserMode()) {
			// when we automate the Chrome and safari browse must to switching
			// context of Appium
			String currentContext = Finder.findAppiumDriver().getContext();
			Finder.findAppiumDriver().context("NATIVE_APP");
			clickUsingJavaScript(x, y);
			Finder.findAppiumDriver().context(currentContext);
		} else {
			clickUsingJavaScript(x, y);
		}
	}

	/**
	 * Checkpoint Supported
	 * 
	 * @param object
	 * @param value
	 * @param objectType
	 * @return
	 * @throws Exception
	 */

	public static Boolean CustomselectDropDownItem(AppiumObject object, String value, Boolean objectType)
			throws Exception {

		WebElement we = Finder.findWebElementUsingCheckPoint(object);

		return new GenericCheckpoint<Boolean>() {

			@Override
			public Boolean _innerRun() throws Exception {
				CustomSelect selectData = new CustomSelect(we, objectType);
				try {
					selectData.selectByVisibleText(value);
				}

				catch (ElementNotExistInDropDownException e) {
					// in the case of spinner in native application
					// e.printStackTrace();
					throw e;
				}

				catch (NoSuchElementException ex) {
					// in the case of dropdown in hybrid application
					ex.printStackTrace();
					throw new ElementNotExistInDropDownException(
							ReturnMessages.ELEMENT_NOT_EXIST_IN_DROPDOWN.toString());
				}
				// In the com.ob.timesheet.ui.apk application Appium give exception
				// element not longable attach with dom.
				// but select a dropdown item this exception is written in appium server
				// log and give unknown serverside exception
				catch (Exception e) {
					logger.finer(" an exception is generated " + e.getMessage());
					// e.printStackTrace();
				}
				return true;
			}
		}.run();

	}

	public static FunctionResult CustomVerifyDropDownItemCount(AppiumObject object, int countByUser, Boolean objectType)
			throws Exception {

		// in future create a keyword verifySpinnerItemCount and
		// verifyListItemCount so method is use
		CustomSelect select = new CustomSelect(Finder.findWebElementUsingCheckPoint(object), objectType);
		return new GenericCheckpoint<FunctionResult>() {

			@Override
			public FunctionResult _innerRun() throws Exception {
				int getCount = select.getOptions().length; // Get The Count Of DropDown
				if (getCount == countByUser)
					return Result.PASS().setOutput(true).setMessage(ReturnMessages.MATCH_COUNT.toString()).make();
				else
					return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
							.setMessage(ReturnMessages.verificationFailed(getCount, countByUser)).make();
			}
		}.run();

	}

	public static int customGetDropDownItemCount(AppiumObject object, Boolean objectType) throws Exception {
		return new GenericCheckpoint<Integer>() {

			@Override
			public Integer _innerRun() throws Exception {
				CustomSelect select = new CustomSelect(Finder.findWebElement(object), objectType);
				return select.getOptions().length;
			}
		}.run();
	}

	public static Boolean customverifyDropDownItemCount(AppiumObject object, int countByUser, Boolean objectType)
			throws Exception {

		CustomSelect select = new CustomSelect(Finder.findWebElement(object), objectType);
		int getCount = select.getOptions().length; // Get The Count Of DropDown
		if (getCount == countByUser)
			return true;

		return false;
	}

	public static FunctionResult CustomVerifyDropDownItemExists(AppiumObject object, String expectedItem,
			Boolean objectType) throws Exception {

		WebElement we = Finder.findWebElementUsingCheckPoint(object);
		return new GenericCheckpoint<FunctionResult>() {

			@Override
			public FunctionResult _innerRun() throws Exception {
				CustomSelect select = new CustomSelect(we, objectType);
				// Get All The Item From DropDown
				String[] getOptions = select.getOptions();
				String listString = "";

				for (String webElementText : getOptions) {
					logger.fine("Actual Text" + webElementText + " expectedText" + expectedItem);
					if (Utils.contentEquals(webElementText, expectedItem)) {
						return Result.PASS().setOutput(true).setMessage(ReturnMessages.ITEM_EXIST.toString()).make();
					} else {
						listString = listString + webElementText + Utils.getDelimiter();
					}
				}

				// remove last value of getdelemiter value

				if (listString.endsWith(getDelimiter())) {
					listString = listString.substring(0, listString.length() - 1);
				}
				return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED)
						.setMessage(ReturnMessages.verificationFailed(listString, expectedItem)).make();

			}
		}.run();
	}

	public static String CustomGetSelectedItem(AppiumObject object) throws Exception {

		String getText = "";
		WebElement we = Finder.findWebElement(object);
		if (AppiumContext.isBrowserOrWebviewMode()) {
			// In the case of drop down
			CustomSelect selectData = new CustomSelect(we, false);
			return selectData.getAllSelectedOptions().get(0).getText();
		} else {

			String oldText = getText(we);

			// in the case of spinner the text is present in an textView inside
			// the
			// spinner, like:
			// <android.widget.spinner id="xyz">
			// <android.widget.Textview text="--Select--">

			if (getText == null || getText.contentEquals("")) {

				try {
					// after click and go back element reference is updated and
					// exception is generated
					// org.openqa.selenium.StaleElementReferenceException so we
					// again find object
					WebElement _innerWebElement = Finder.findWebElement(object)
							.findElement(By.className("android.widget.TextView"));
					getText = _innerWebElement.getText();
					logger.fine(" get text using inner find element " + getText);

				} catch (NoSuchElementException ex) {
					// In the case of list item return null
				}

			}

			if (getText != null && !getText.contentEquals("")) {
				return getText;
			}

			logger.fine("old text " + oldText);

			// click for get the get the select list item
			we.click();
			try {
				// try to get a text using after click object search a selected
				// item
				List<WebElement> selectedItems = Finder.findAppiumDriver()
						.findElements(By.xpath("//*[@checked='true' or  @selected='true']"));
				// get the multiple list item text with semicolon seprated item
				logger.fine("get element count " + selectedItems.size());

				if (selectedItems.size() == 0) {
					// In the selendroid mode checked and selected property not
					// exist in source it created at run time
					// xpath is working on checked and selected property
					List<WebElement> interMediateList = CustomSelect.getAllListItems();
					for (WebElement lstItem : interMediateList) {
						try {
							if (Boolean.valueOf(getAttrAndIgnoreExcecption(lstItem, "checked"))) {
								selectedItems.add(lstItem);
							}
						} catch (StaleElementReferenceException ex) {
						}
					}
				}

				getText = getDelimiteredText(selectedItems);

			} catch (NoSuchElementException ex) {
			}

			if (getText.contentEquals("")) {
				// in the case of when object not found and not able to get a
				// text return without click object text
				getText = oldText;
			}
		}

		logger.fine("get text " + getText);
		Finder.findAppiumDriver().navigate().back();
		return getText;
	}

	public static String getCurrentWindowHandle() throws ToolNotSetException, InterruptedException {

		String currentHanlde;
		if (AppiumContext.getDeviceType() == DeviceType.Selendroid) {
			Date startTime = Calendar.getInstance().getTime();
			currentHanlde = Finder.findAppiumDriver().getWindowHandle();
			Date endTime = Calendar.getInstance().getTime();
			System.out.println(
					"Waited time for to get the current handle " + (startTime.getTime() - endTime.getTime()) / 1000);

		} else {
			currentHanlde = Finder.findAppiumDriver().getContext();
		}
		return currentHanlde;
	}

	/**
	 * Checkpoint not required
	 * 
	 * @throws ToolNotSetException
	 */
	public static void gobackIfNeed() throws ToolNotSetException {

		/*
		 * some time after send keys keyboard is automatically down but in some cases
		 * keyboard is not automatically down so try to enforce the device to show the
		 * keyboard
		 */

		// keyboard is down automatically down in chrome browser
		if (!(AppiumContext.getBrowserMode() == BrowserType.chromeOnLocalAndroid
				|| AppiumContext.getBrowserMode() == BrowserType.SafariOnIos
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice)) {
			if (AppiumContext.getDeviceType() == DeviceType.Android
					|| (!(AppiumContext.getDeviceType() == DeviceType.Selendroid
							&& AppiumContext.getDriverWindow() == DriverWindow.WebView))) {
				System.out.println("typing sucess try to down the keyboard ");
				try {
					Finder.findAppiumDriver().hideKeyboard();
				} catch (Exception e) {
					if (e.getMessage().contains(
							"An unknown server-side error occurred while processing the command. (Original error: Soft keyboard not present, cannot hide keyboard)")) {
						logger.fine("Soft keyboard not present, cannot hide keyboard");
					}
				}

			}
		}
	}

	/**
	 * Checkpoint Supported
	 * 
	 * @param object
	 * @param we
	 * @return
	 * @throws Exception
	 */

	public static String getobjectType(AppiumObject object, WebElement we) throws Exception {

		return new GenericCheckpoint<String>() {

			@Override
			public String _innerRun() throws Exception {
				String objectType;
				boolean isEmptyOrNull;

				if (AppiumContext.isBrowserOrWebviewMode()) {
					objectType = getAttrAndIgnoreExcecption(we, "type");
				} else {
					objectType = object.getClassName().getValue();
				}

				isEmptyOrNull = (objectType == null || objectType.trim().isEmpty());
				if (AppiumContext.isBrowserOrWebviewMode() && isEmptyOrNull) {
					objectType = we.getTagName();
				}

				isEmptyOrNull = (objectType == null || objectType.trim().isEmpty());
				if (isEmptyOrNull && AppiumContext.isNativeMode()) {
					objectType = getAttrAndIgnoreExcecption(we, "class");
				}

				System.out.println("Object Type " + objectType);
				return objectType;
			}
		}.run();

	}

	/**
	 * Checkpoint not required
	 * 
	 * @param we
	 * @throws Exception
	 */

	public static void clearEditFieldInCheckpoint(WebElement we) throws Exception {
		new GenericCheckpoint<Boolean>() {

			@Override
			public Boolean _innerRun() throws Exception {
				return clearEditField(we);
			}
		}.run();
	}

	public static Boolean clearEditField(boolean checkPoint, WebElement we) throws Exception {
		if (checkPoint) {
			return FunctionCaller.callWithChekPoint(() -> Utils.clearEditField(we), "Clear Editfield Time Taken");
		} else {
			return FunctionCaller.callReturnFunction(() -> Utils.clearEditField(we), "Clear Editfield Time Taken");
		}
	}

	public static Boolean clearEditField(WebElement we) throws Exception {
		boolean clearFlag = false;
		String elementText;
		try {
			we.clear();
			elementText = GetElementText(we);
			System.out.println("##<< element text using clear() ::  " + elementText);
			if (isElementTextCleared(elementText)) {
				clearFlag = true;
				return true;
			}
		} catch (org.openqa.selenium.WebDriverException e) {
			Log.print("#1 Not able to clear using clear ..." + e.getMessage());
			clearFlag = false;
		}

		if (clearFlag == false) {
			System.out.println("##<< clearing text using  sendkeys ");
			System.out.println("##<< element text : " + GetElementText(we));
			try {
				we.sendKeys("");
				clearFlag = true;
				return true;
			} catch (Exception e) {
				Log.print("#1 Not able to clear using sendkeys..." + e.getMessage());
				clearFlag = false;
			}

		}

		if (clearFlag == false) {
			if (AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator
					|| AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice) {
				if (clearField_IOS(we)) {
					if (isElementTextCleared(GetElementText(we))) {
						clearFlag = true;
						return true;
					} else {
						clearFlag = false;
					}
				}
			}

		}
		// Utils.gobackIfNeed();
		return true;
	}

	public static String getDelimiteredText(List<WebElement> webelementList) {

		ArrayList<String> dropDownItem = new ArrayList<String>();
		String getText = "";
		String returnText = "";
		for (WebElement we : webelementList) {

			if (AppiumContext.isBrowserMode()) {
				getText = we.getText();
				returnText = returnText + getText + getDelimiter();
			}

			else {
				// Display property check in the case of Android Application
				try {

					if (we.isDisplayed()) {

						getText = we.getText();
						// In the next line we match the reference of getText
						// string
						// ==
						// null
						// if the link contain text link null then then
						// condition is
						// true
						if (getText == null) {
							getText = "";
						}
					}

				} catch (NoSuchElementException | StaleElementReferenceException ex) {

					logger.fine("An exception is gererated try to get the text in get all button ");
					// if an element don't have an attribute text || content
					// decription || value
					// then given an object not found exception
				}

				if (!dropDownItem.contains(getText)) {
					dropDownItem.add(getText);
					returnText = returnText + getText + getDelimiter();
				}
			}
		}

		// remove all semicolon from last
		if (returnText.endsWith(getDelimiter())) {
			returnText = returnText.substring(0, returnText.length() - 1);
		}
		logger.fine("delmetered text " + returnText);

		return returnText;
	}

	public static void closeAppiumServer() {

		if (AppiumContext.getAppiumServerProcess().size() != 0) {

			// Stop for Appium Server Thread
			AppiumContext.closeAllThread(true);
			CloseAllProcess();
			AppiumContext.launchAppiumServer(false);
			// when we start a Appium server again to set the closeAllThread
			// false
			AppiumContext.closeAllThread(false);
			logger.fine("close Appium server sucessfully");

		} else {
			logger.fine("Appipum server process not exist");
		}
	}

	public static String validateURL(String url) {

		logger.fine(" Try to Validate the Url" + url);

		String lowerCaseURL = url.toLowerCase();
		if ((lowerCaseURL.startsWith("www"))) {
			url = "http://".concat(url);
			lowerCaseURL = url.toLowerCase();
		}

		// Check URL should starts with http:// or https:// or file

		if (!(lowerCaseURL.startsWith("http") || lowerCaseURL.startsWith("file")) || lowerCaseURL.startsWith("ftp")
				|| url.trim().equalsIgnoreCase("")) {

			url = "http://www.".concat(url);
		}

		return url;
	}

	public static void setPageLoadAndScriptTimeout(int pageLoadTimeOut)
			throws ToolNotSetException, WebDriverException, IOException, InterruptedException {
		logger.fine(" Set the page load tiomeOut and script " + pageLoadTimeOut);

		if (AppiumContext.getBrowserMode() == BrowserType.SafariOnIos) {
			// In the case of safari On Ios not able to set the page load
			// timeout
			// https://github.com/appium/appium/issues/4262
			Finder.findAppiumDriver().manage().timeouts().setScriptTimeout(pageLoadTimeOut, TimeUnit.MILLISECONDS);
			Utils.waitForPageLoad(Finder.findAppiumDriver());
			return;
		}

		// In the Case of local Android and as well as Cloud [sauce Labs]
		// Finder.findAppiumDriver().manage().timeouts().setScriptTimeout((pageLoadTimeOut
		// - 5000), TimeUnit.MILLISECONDS);
		// Finder.findAppiumDriver().manage().timeouts().pageLoadTimeout((pageLoadTimeOut
		// - 5000), TimeUnit.MILLISECONDS);
	}

	public static boolean contentEquals(String str1, String str2) {

		// In the case of dropdown (If Dropdown Actual item not match with
		// expected Item then Try After Trimning)
		// http://www.indianrail.gov.in/between_Imp_Stations.html
		// Website with dropdown I
		if (str1.contentEquals(str2)) {
			return true;
		}

		if (str1.trim().contentEquals(str2.trim())) {
			logger.fine("Match With Trimming");
			return true;
		}
		return false;
	}

	public static void clickUsingJavaScript(int x, int y) throws ToolNotSetException {

		HashMap<String, Integer> tapObject = new HashMap<String, Integer>();
		tapObject.put("x", x);
		tapObject.put("y", y);
		tapObject.put("touchCount", 1);
		tapObject.put("duration", 1);
		Finder.findJavaScriptExecuterDriver().executeScript("mobile: tap", tapObject);
	}

	public static void startAdbServer() throws InterruptedException, IOException, AdbNotFoundException {

		logger.fine("Running adb command " + getAdbPath() + " start-server");
		Runtime.getRuntime().exec(getAdbPath() + " start-server").waitFor();

	}

	public static void CloseAllProcess() {

		for (Process process : AppiumContext.getAppiumServerProcess()) {
			process.destroy();
		}
	}

	public static String RemoveLastDirectoryFromPath(String path) {

		String appiumFolderPath = "";
		String interMedateApmPath = path.replace("\\", "@");
		String[] arr = interMedateApmPath.split("@");
		// Path replace function not able to replace with @
		if (arr.length > 0 && interMedateApmPath != path) {
			appiumFolderPath = interMedateApmPath.substring(0,
					interMedateApmPath.lastIndexOf("@" + arr[arr.length - 1]));
			appiumFolderPath = appiumFolderPath.replace("@", "\\");
		}
		logger.finest("After Removing the last directory from given path " + appiumFolderPath);
		return appiumFolderPath;
	}

	public static void bindStream(InputStream stdInput, InputStream stdError) throws InterruptedException {

		InputStreamReader is = new InputStreamReader(stdInput);
		BufferedReader brForOutput = new BufferedReader(is);

		InputStreamReader es = new InputStreamReader(stdError);
		BufferedReader brForError = new BufferedReader(es);

		String readErrorStream = null;
		String readInputStream = null;

		Thread t = Thread.currentThread();
		// Looping for ready inputStremReader Or a errorStream
		try {
			while (!(brForOutput.ready() || brForError.ready())) {

				logger.fine(
						"Not Able to get output Or Error Streaming from " + t.getName() + " wait for 1000 milisecond");
				try {
					// One second wait for ready for get Error stream and get
					// output stream
					Thread.sleep(1000);
				} catch (InterruptedException e) {
				}

				if (brForError.ready() && t.getName().contentEquals("LogReadFromAppiumServer")) {
					readErrorStream = brForError.readLine();
					AppiumContext.launchAppiumServer(true);
				}
				if (brForOutput.ready() && t.getName().contentEquals("LogReadFromAppiumServer")) {
					readInputStream = brForOutput.readLine();
					AppiumContext.launchAppiumServer(true);
				}

				if (brForError.ready() && t.getName().contentEquals("LogReadFromAndroidScreenCast")) {
					readErrorStream = brForError.readLine();
					AppiumContext.launchScreenCastSucessfully(true);
				}
				if (brForOutput.ready() && t.getName().contentEquals("LogReadFromAndroidScreenCast")) {
					readInputStream = brForOutput.readLine();
					AppiumContext.launchScreenCastSucessfully(true);
				}

				if (AppiumContext.isCloseAllThread()) {
					logger.fine("Exist for logging thread");
					// close the bufferReader and inputStreaming
					brForError.close();
					brForOutput.close();
					stdInput.close();
					stdError.close();
					return;
				}

				logger.fine("Buffer Reader for output " + brForOutput.ready());
				logger.fine("Buffer Reader For Error  " + brForError.ready());

			}

		} catch (IOException e) {
		}

		// Looping for when node.exe give Output or a Error
		// Loop break kill node.exe Or a session stop

		while (readInputStream != null || readErrorStream != null) {

			try {
				if (brForError.ready()) {
					readErrorStream = brForError.readLine();
					AppiumContext.setErrorFrmServer(readErrorStream);
					if (t.getName().contentEquals("LogReadFromAndroidScreenCast")) {
						logger.fine("[SCREENCAST]: " + readInputStream);
					} else {
						logger.severe("[SERVER]: " + readErrorStream);
					}
				}

				if (brForOutput.ready()) {

					readInputStream = brForOutput.readLine();

					if (readInputStream.startsWith("error:")) {
						logger.info("[SERVER]: " + readInputStream);
					} else {

						if (readInputStream.contains(
								"info: [debug] Responding to client with error: {\"status\":13,\"value\":{\"message\":\"An unknown server-side error occurred while processing the command.")) {
							AppiumContext.setErrorFrmServer(readInputStream);
						}
						if (t.getName().contentEquals("LogReadFromAndroidScreenCast")) {
							logger.fine("[SCREENCAST]: " + readInputStream);
						} else {
							logger.fine("[SERVER]: " + readInputStream);
						}
					}
				}
				// 200 milisecond wait for cpu wait
				Thread.sleep(200);

				if (AppiumContext.isCloseAllThread()) {
					logger.fine("Exist for logging thread");
					// close the bufferReader and inputStreaming
					brForError.close();
					brForOutput.close();
					stdInput.close();
					stdError.close();
					return;
				}
			} catch (IOException e) {
			}
		}
	}

	public static void killAdbServer() throws IOException, AdbNotFoundException, InterruptedException {

		logger.fine("Running adb command " + getAdbPath() + " kill-server");

		Runtime.getRuntime().exec(getAdbPath() + " kill-server").waitFor();
	}

	public static String getAdbPath() throws AdbNotFoundException {

		String env = null;
		ProcessBuilder pb = new ProcessBuilder();
		Map<String, String> envMap = pb.environment();

		for (String name : envMap.keySet()) {
			String key = name.toString();
			String value = envMap.get(name).toString();
			if (key.toLowerCase().contentEquals("android_home")) {
				env = value;
			}
		}

		if (env == null) {
			throw new AdbNotFoundException("Andorid home variable is not found in envirement variable");
		}

		String adbPath = null;
		File allFolderInSdk = new File(env);

		File[] listOfFiles = allFolderInSdk.listFiles();

		if (listOfFiles == null) {
			throw new AdbNotFoundException(
					"Could not find adb in tools, platform-tools, or build-tools; Kinldy check  proper android SDK installed");
		}

		for (File file : listOfFiles) {
			if (file.isDirectory()) {

				if (adbPath == null && file.getName().toLowerCase().contentEquals("build-tools")) {
					adbPath = getAdbAbsulatePath(file);
				}

				if (adbPath == null && file.getName().toLowerCase().contentEquals("tools")) {
					adbPath = getAdbAbsulatePath(file);
				}

				if (adbPath == null && file.getName().toLowerCase().contentEquals("platform-tools")) {
					adbPath = getAdbAbsulatePath(file);
				}
			}
		}

		if (adbPath == null) {
			throw new AdbNotFoundException(
					"Could not find adb in tools, platform-tools, or build-tools; Kinldy check  proper android SDK installed");
		}

		return adbPath;
	}

	public static String getAaptTPath() throws AdbNotFoundException {

		String env = null;
		ProcessBuilder pb = new ProcessBuilder();
		Map<String, String> envMap = pb.environment();

		for (String name : envMap.keySet()) {
			String key = name.toString();
			String value = envMap.get(name).toString();
			if (key.toLowerCase().contentEquals("android_home")) {
				env = value;
			}
		}

		if (env == null) {
			throw new AdbNotFoundException("Andorid home variable is not found in envirement variable");
		}

		String adbPath = null;
		File allFolderInSdk = new File(env);

		File[] listOfFiles = allFolderInSdk.listFiles();

		if (listOfFiles == null) {
			throw new AdbNotFoundException(
					"Could not find adb in tools, platform-tools, or build-tools; Kinldy check  proper android SDK installed");
		}

		for (File file : listOfFiles) {
			if (file.isDirectory()) {

				if (adbPath == null && file.getName().toLowerCase().contentEquals("build-tools")) {
					adbPath = getAaptAbsulatePath(file);
				}

				if (adbPath == null && file.getName().toLowerCase().contentEquals("tools")) {
					adbPath = getAaptAbsulatePath(file);
				}

				if (adbPath == null && file.getName().toLowerCase().contentEquals("platform-tools")) {
					adbPath = getAaptAbsulatePath(file);
				}
			}
		}

		if (adbPath == null) {
			throw new AdbNotFoundException(
					"Could not find adb in tools, platform-tools, or build-tools; Kinldy check  proper android SDK installed");
		}

		return adbPath;
	}

	private static String getAaptAbsulatePath(File dir) {

		File path = new File(dir.getAbsolutePath());
		File[] listOfFiles = path.listFiles();

		for (File file : listOfFiles) {
			if (file.isDirectory()) {
				File[] listOfSubFiles = file.listFiles();
				for (File subFile : listOfSubFiles) {
					if (subFile.getName().toLowerCase().contentEquals("aapt.exe"))
						return subFile.getAbsolutePath();
				}
			}
			if (file.getName().toLowerCase().contentEquals("aapt.exe"))
				return file.getAbsolutePath();
		}
		return null;
	}

	public static void main(String[] args) throws AdbNotFoundException {
		String adbPath = getAaptTPath();
		System.out.println(adbPath);

	}

	private static String getAdbAbsulatePath(File dir) {

		File path = new File(dir.getAbsolutePath());
		File[] listOfFiles = path.listFiles();

		for (File file : listOfFiles) {
			if (file.getName().toLowerCase().contentEquals("adb.exe"))
				return file.getAbsolutePath();
		}
		return null;
	}

	public static Dimension getDeviceDisplayDimesion() throws IOException, InterruptedException, AdbNotFoundException {

		System.out.println(getAdbPath());
		int actualDisplayHeight = 0;
		int actualDisplayWidth = 0;

		ArrayList<String> cmdForTouchDimesion = new ArrayList<String>();
		// get the device name
		cmdForTouchDimesion.add(getAdbPath());
		cmdForTouchDimesion.add("shell");
		cmdForTouchDimesion.add("getevent");
		cmdForTouchDimesion.add("-i");

		ProcessBuilder prb = new ProcessBuilder(cmdForTouchDimesion);
		prb.redirectErrorStream(true);
		prb.redirectError(Redirect.PIPE);
		prb.redirectOutput(Redirect.PIPE);

		logger.fine("Get Touch Dimension using " + cmdForTouchDimesion.toString());

		Process ps = prb.start();

		BufferedReader brForActualDis = new BufferedReader(new InputStreamReader(ps.getInputStream()));

		while (!brForActualDis.ready()) {
			Thread.sleep(100);
		}

		String line = "";
		while ((line = brForActualDis.readLine()) != null) {
			String data = line.trim();
			// Discard unused data
			if (data.startsWith("0035") || data.startsWith("ABS (0003): 0035")) {
				// Identify max X
				actualDisplayWidth = Integer.parseInt(data.split("max")[1].split(",")[0].trim());
			}
			if (data.startsWith("0036")) {
				// identify Y
				actualDisplayHeight = Integer.parseInt(data.split("max")[1].split(",")[0].trim());
			}
		}
		brForActualDis.close();
		return new Dimension(actualDisplayWidth, actualDisplayHeight);

	}

	public static void hideKeyboard() throws ToolNotSetException {
		WebElement keyboard_hide_button = null;

		try {
			if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
					|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {
				System.out.println("checking iphone/ipad:- " + AppiumContext.getMobileDevice().getDisplayName());
				// this code is for hide keyboard in IOS
				if (AppiumContext.getMobileDevice().getDisplayName().toLowerCase().contains("iphone")) {
					keyboard_hide_button = Finder.findAppiumDriver()
							.findElementByXPath("//UIAButton[@name='Done'][last()]");
				} else {
					keyboard_hide_button = Finder.findAppiumDriver()
							.findElementByXPath("//UIAButton[@name='Hide keyboard'][last()]");
				}
				// Finder.findAppiumDriver().tap(1, keyboard_hide_button, 1);
				new TouchAction<>(Finder.findAppiumDriver())
						.tap(TapOptions.tapOptions().withElement(ElementOption.element(keyboard_hide_button, 1, 1)));
			} else if (AppiumContext.getDeviceType() == DeviceType.Android) {
				// unicodeKeyboard we need not to hide keyboard .Hidekeyboard only works for
				// android keyboard
				// Pls provide this cap for browser stack mandatory
				Object unicodeKeyboardCapability = null, appiumUnicodeKeyboardCapability = null;

				unicodeKeyboardCapability = Finder.findAppiumDriver().getCapabilities()
						.getCapability("unicodeKeyboard");
				appiumUnicodeKeyboardCapability = Finder.findAppiumDriver().getCapabilities()
						.getCapability("appium:unicodeKeyboard");

				System.out.println("##  capability is " + unicodeKeyboardCapability);
				System.out.println("##  capability1 is " + appiumUnicodeKeyboardCapability);

				if (unicodeKeyboardCapability != null) {
					Boolean capsStatus = (Boolean) unicodeKeyboardCapability;
					if (capsStatus == false) {
						Finder.findAppiumDriver().hideKeyboard();
					}
				}

				if (appiumUnicodeKeyboardCapability != null) {
					Boolean capsStatus = (Boolean) unicodeKeyboardCapability;
					if (capsStatus == false) {
						Finder.findAppiumDriver().hideKeyboard();
					}
				}

			}

		} catch (org.openqa.selenium.WebDriverException ex) {
			System.out.println("hide keyboard exception " + ex.getMessage());
			// ex.printStackTrace();
		}

	}

	public static FunctionResult shadow_getObjectText(AppiumObject object) throws Exception {
		WebElement myObject = Finder.findWebElementUsingCheckPoint(object);
		return shadow_getObjectText(myObject);
	}

	public static FunctionResult shadow_getObjectText(WebElement myObject) throws Exception {

		String returnText = myObject.getText();
		returnText = ((returnText == null) || (returnText.equalsIgnoreCase("")))
				? getAttrAndIgnoreExcecption(myObject, "value")
				: returnText;
		returnText = ((returnText == null)) ? "" : returnText;

		if ((returnText == null) || returnText.equalsIgnoreCase(""))
			return Result.PASS().setOutput(returnText)
					.setMessage("No Text or Value property exists or is null for the given Object").make();
		else
			return Result.PASS().setOutput(returnText).make();
	}

	// only use in case of checkpoint
	public static int getRemainingTimeForKeyword(int timeOut) {
		int remainingTime = Context.current().getKeywordRemaningSeconds() - timeOut;
		if (remainingTime < 0) {
			remainingTime = 0;
		}
		Log.print("Remaining TimeOut For Keyword " + (Context.current().getKeywordRemaningSeconds() - remainingTime));
		return remainingTime;
	}

	public int getXMLHttpRequestWaitTime() {
		int XMLHttpRequestWaitTime = 0;
		try {
			XMLHttpRequestWaitTime = Integer
					.parseInt(Context.session().getSettings().get("XMLHttpRequestTimeOut").trim());
		} catch (Exception e) {
			// new ExceptionManager().pushException(e);
			XMLHttpRequestWaitTime = 30;
		}
		if (XMLHttpRequestWaitTime < 0) {
			XMLHttpRequestWaitTime = 0;
		}
		Log.print("Remaining XMLHttpRequestWaitTime : " + XMLHttpRequestWaitTime);
		return XMLHttpRequestWaitTime;
	}

	public void waitForPageLoadAndOtherAjaxIfTrue() throws ToolNotSetException {
		Log.print(">>Executing waitForPageLoadAndOtherAjaxIfTrue");
		// if (Utils.isAlertPresent()) {
		// Log.print("Alert Present. Stopping XHR");
		// return;
		// }

		long start = System.currentTimeMillis();
		if (Utils.useWaitForXMLHttpRequestLoad())
			injectXhrScript();
		if (Utils.useWaitForPageLoad()) {
			new Waits().Method_useWaitForPageLoad();
		}
		if (Utils.useWaitForXMLHttpRequestLoad())
			injectXhrScript();
		if (Utils.useWaitForAngularLoad()) {
			new Waits().Method_useWaitForAngularLoad();
		}
		if (Utils.useWaitForJQueryLoad()) {
			new Waits().Method_useWaitForJQueryLoad();
		}
		if (Utils.useWaitForXMLHttpRequestLoad()) {
			new Waits().Method_useWaitForXMLHttpRequestLoad();
		}
		Log.print("waitForPageLoadAndOtherAjaxCompleted in " + (System.currentTimeMillis() - start) + " ms");
	}

	public static boolean useWaitForPageLoad() {
		Log.print("UseWaitForPageLoad" + Context.session().getSettings().get("UseWaitForPageLoad"));
		Log.print(Context.session().getSettings().get("UseWaitForPageLoad"));
		boolean usePageLoad = Boolean.parseBoolean(Context.session().getSettings().get("UseWaitForPageLoad"));
		Log.print("UseWaitForPageLoad " + usePageLoad);
		return usePageLoad;
	}

	public static boolean useWaitForAngularLoad() {
		boolean useAngularLoad = Boolean.parseBoolean(Context.session().getSettings().get("UseWaitForAngularLoad"));
		Log.print("UseWaitForAngularLoad " + useAngularLoad);
		return useAngularLoad;
	}

	public static boolean useWaitForJQueryLoad() {
		boolean usejQueryLoad = Boolean.parseBoolean(Context.session().getSettings().get("UseWaitForJQueryLoad"));
		Log.print("UseWaitForJQueryLoad " + usejQueryLoad);
		return usejQueryLoad;
	}

	public static boolean useWaitForXMLHttpRequestLoad() {
		boolean useXHRLoad = Boolean.parseBoolean(Context.session().getSettings().get("UseWaitForXMLHttpRequestLoad"));
		Log.print("UseWaitForXMLHttpRequestLoad " + useXHRLoad);
		return useXHRLoad;
	}

	// public void waitForPageLoadAndOtherAjax() throws ToolNotSetException {
	//
	// long start = System.currentTimeMillis();
	// new Waits().Method_useWaitForPageLoad();
	// new Waits().Method_useWaitForAngularLoad();
	// new Waits().Method_useWaitForJQueryLoad();
	// if (Utils.useWaitForXMLHttpRequestLoad()) {
	// new Waits().Method_useWaitForXMLHttpRequestLoad();
	// }
	// Log.print("waitForPageLoadAndOtherAjaxCompleted in " +
	// (System.currentTimeMillis() - start) + " ms");
	//
	// }

	public void waitForPageLoadAndOtherAjax() throws ToolNotSetException {
		Log.print(">>Executing waitForPageLoadAndOtherAjax");
		// if (Utils.isAlertPresent()) {
		// Log.print("Alert Present. Stopping XHR");
		// return;
		// }

		long start = System.currentTimeMillis();
		if (Utils.useWaitForXMLHttpRequestLoad())
			injectXhrScript();

		new Waits().Method_useWaitForPageLoad();

		if (Utils.useWaitForXMLHttpRequestLoad())
			injectXhrScript();

		if (Utils.useWaitForAngularLoad()) {
			new Waits().Method_useWaitForAngularLoad();
		}

		new Waits().Method_useWaitForJQueryLoad();

		if (Utils.useWaitForXMLHttpRequestLoad()) {
			new Waits().Method_useWaitForXMLHttpRequestLoad();
		}
		Log.print("waitForPageLoadAndOtherAjaxCompleted in " + (System.currentTimeMillis() - start) + " ms");
	}

	public void scrollMid(WebElement ele) {
		Log.debug("Scroll Mid");
		try {
			if (getBrowserName().toLowerCase().contains("chrome")) {
				/*- scrollIntoViewIfNeeded - compatible with CHROME only*/
				/*- scrollIntoViewIfNeeded - scrolls the current element into the visible area of the browser window 
				 * if it's not already within the visible area of the browser window. 
				 * If the element is already within the visible area of the browser window, then no scrolling takes place */
				((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("arguments[0].scrollIntoViewIfNeeded()",
						ele);
			} else
				scrollIntoView(ele);

			((JavascriptExecutor) Finder.findAppiumDriver()).executeScript(
					" window.scrollBy(0,arguments[0].getBoundingClientRect().top-window.innerHeight/2) ", ele);
		} catch (Exception e) {
			Log.debug(e.getLocalizedMessage());
		}
	}

	public void scrollIntoView(WebElement ele) {
		Log.debug("scrollIntoView");
		try {
			((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("arguments[0].scrollIntoView()", ele);
		} catch (Exception e) {
			Log.debugErr(e);
		}
	}

	public static Boolean performClick(WebElement we) throws Exception {
		long start = System.currentTimeMillis();
		Boolean bool = new GenericCheckpoint<Boolean>() {

			@Override
			public Boolean _innerRun() throws InterruptedException, ToolNotSetException, ObjectNotFoundException {
				try {
					// ---------------------------------Hybrid Part
					// -------------------------------------------------------------
					try {
						if (AppiumContext.isBrowserMode()) { // for hybrid ececution
							System.out.println("##<< Web mode ");
							if (AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator
									|| AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice) {
								if (AppiumContext.getBrowserMode() == BrowserType.SafariOnIos) {
									System.out.println("##<< clicking on browser element in ios ");
									Finder.findJavaScriptExecuterDriver().executeScript("arguments[0].click();", we);
									return true;
								}
							}

							if (AppiumContext.getDeviceType() == DeviceType.Android) {
								if (AppiumContext.getBrowserMode() == BrowserType.chromeOnLocalAndroid
										|| AppiumContext.getBrowserMode() == BrowserType.ChromeOnCloud) {
									Finder.findJavaScriptExecuterDriver().executeScript("arguments[0].click();", we);
									return true;
								}
							}
						}
					} catch (Exception e) {
						System.out.println("##<< Exception occured while clicking in web " + e.getMessage());
						we.click();
						return true;
					}
					// ---------------------------------Native part for ios
					// -------------------------------------------------------------
					try {
						if (AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator
								| AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice) {
							Object capabilityVersion = Finder.findAppiumDriver().getCapabilities()
									.getCapability("platformVersion");
							String version = capabilityVersion.toString();
							version = version.trim(); // decimal values in string gave exception so remove "."
							if (version.contains(".")) {
								version = version.substring(0, version.indexOf("."));
							}
							int deviceVersion = Integer.parseInt(version);
							if (deviceVersion > 13) {
								System.out.println("##<< Iphone 14 found ");
								try {
									System.out.println("Trying through with tapcount  1  ");
									new TouchAction<>((MobileDriver) Finder.findAppiumDriver()).tap(TapOptions
											.tapOptions().withElement(ElementOption.element(we)).withTapsCount(1))
											.perform();
								} catch (Exception ex) {
									System.out.println("Exception in withTapsCount error message " + ex.getMessage());
									ex.printStackTrace();
								}
								System.out.println("1.sleep   ");
								Thread.sleep(2000);
								TouchAction action = new TouchAction((MobileDriver) Finder.findAppiumDriver());
								try {
									System.out.println("Trying through moveTo element  ");

									action.moveTo(ElementOption.element(we)).tap(ElementOption.element(we)).perform();
								} catch (Exception ex) {
									System.out.println(
											"Exception in moveTo(ElementOption.element(Element)) error message "
													+ ex.getMessage());

								}

								System.out.println("2.sleep ");
								Thread.sleep(2000);
								System.out.println("clicking using general click 2  ");
								try {
									we.click();
								} catch (Exception ex) {
									System.out.println("Exception in genaral click error message " + ex.getMessage());
								}
								return true;
							} else {
								long start1 = System.currentTimeMillis();
								we.click();
								System.out.println(
										"Appium IOS Click Time Taken:" + (System.currentTimeMillis() - start1));
								return true;
							}
						}
					} catch (Exception e) {
						System.out.println("Appium IOS Click Exception " + e.getMessage());
						new TouchAction<>((MobileDriver) Finder.findAppiumDriver())
								.tap(TapOptions.tapOptions().withElement(ElementOption.element(we)).withTapsCount(1))
								.perform();
						return true;
					}

					// ---------------------------------Native part for Android
					// -------------------------------------------------------------
					try {
						if (AppiumContext.getDeviceType() == DeviceType.Android) {
							long start1 = System.currentTimeMillis();
							we.click();
							System.out.println(
									"Appium Android Click Time Taken:" + (System.currentTimeMillis() - start1));
							return true;
						}

					} catch (Exception e) {
						System.out.println("Appium Android Click Exception " + e.getMessage());
						new TouchAction<>((MobileDriver) Finder.findAppiumDriver())
								.tap(TapOptions.tapOptions().withElement(ElementOption.element(we)).withTapsCount(1))
								.perform();
						return true;
					}
				} catch (Exception e) {
					System.out.println("Appium All Click Failed " + e.getMessage());
					return false;
				}

				return true;
			}
		}.run();

		System.out.println("PerformClick Time Taken: " + (System.currentTimeMillis() - start));
		return bool;
	}

	/**
	 * Checkpoint Supported
	 * 
	 * @param we
	 * @return
	 * @throws Exception
	 */

	public static boolean isElementDisplayed(WebElement we) throws Exception {
		return we.isDisplayed();
	}

	public static boolean waitElementDisplayed(WebElement we) throws Exception {
		return new GenericCheckpoint<Boolean>() {
			@Override
			public Boolean _innerRun() throws Exception {
				if (!isElementDisplayed(we)) {
					throw new ObjectNotFoundException("Element_!_Displayed");
				}
				return true;
			}
		}.run();
	}

	public static Object actionToElement(WebElement ele, String methodname, Object... parameters)
			throws ClassNotFoundException, NoSuchMethodException, SecurityException, IllegalAccessException,
			IllegalArgumentException, InvocationTargetException {
		Class c = Class.forName(ele.getClass().getName());

		Class[] listparametersType = new Class[parameters.length];

		int i = 0;
		for (Object obj : parameters) {
			listparametersType[i++] = obj.getClass();
		}

		Method method = c.getDeclaredMethod(methodname, listparametersType);
		return method.invoke(ele, parameters);

	}

	public static String getElementAttribute(WebElement ele, String Attribute) throws Exception {
		return new GenericCheckpoint<String>() {

			@Override
			public String _innerRun() throws Exception {
				return ele.getAttribute(Attribute);
			}
		}.run();
	}

	public static Alert switchToAlert() throws Exception {
		return new GenericCheckpoint<Alert>() {

			@Override
			public Alert _innerRun() throws Exception {
				return Finder.findAppiumDriver().switchTo().alert();
			}

		}.run();

	}

	/**
	 * isOperable(WebElement) checks if any action can be performed on this element.
	 * Return true if Operable otherwise will throw Exception.
	 * 
	 * @param we
	 * @return
	 * @throws Exception
	 */
	public static Boolean isOperable(WebElement we) throws Exception {

		return new GenericCheckpoint<Boolean>() {

			@Override
			public Boolean _innerRun() throws Exception {
				we.isDisplayed();
				return true;
			}
		}.run();

	}

	public static String handleComaInText(String text) {
		if (text.contains("\""))
			return "'" + text + "'";
		return "\"" + text + "\"";
	}

	public static String specialSpaceText(String text) {
		text = text.trim();
		text = text.replace(' ', '\u00A0');
		return text;
	}

	public static List<WebElement> visible(List<WebElement> eles) throws Exception {
		return visibleOverloaded(eles);
		// List<WebElement> eles1 = new ArrayList<>();
		/*
		 * Log.print("Size: " + eles.size());
		 * 
		 * for (WebElement e : eles) { Finder.continueSearchingOrStop(); //
		 * Log.print("@!@# " + e.getAttribute("outerHTML")); //
		 * Log.print("IsDisplayed: "+e.isDisplayed()); // For MAC Safari if
		 * ((AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice ||
		 * AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) &&
		 * (AppiumContext.getBrowserMode() == BrowserType.SafariOnIos)) { //
		 * Log.print("MAC"); boolean display = isVisibleJS(e);
		 * System.out.println("IS_DISPLAYED " + display); try { if (!display) {
		 * continue; } } catch (Exception ex) { System.out.println("Exception FOR IOS "
		 * + ex.getMessage()); } }
		 * 
		 * else { // System.out.print(" @Windows");
		 * 
		 * boolean display = e.isDisplayed(); System.out.println("IS_DISPLAYED " +
		 * e.isDisplayed());
		 * 
		 * try { if (!display) { // System.out.print(" @Display "); continue; } } catch
		 * (Exception ex) { ex.printStackTrace();
		 * 
		 * } }
		 * 
		 * if (AppiumContext.isBrowserMode()) { String eleOuterHtml =
		 * e.getAttribute("outerHTML"); FunctionResult fr =
		 * Utils.shadow_getObjectText(e); Log.print("get Text = " + fr.getOutput()); if
		 * (fr.getOutput().length() > 0 || eleOuterHtml.contains("value") ||
		 * eleOuterHtml.contains("data-original-title") ||
		 * eleOuterHtml.contains("title")) { // boolean visibleByCord = false; //
		 * System.out.print(" @getOutput: <" + fr.getOutput() + ">");
		 * 
		 * JavascriptExecutor jse = (JavascriptExecutor) Finder.findWebDriver(); String
		 * script =
		 * " function widthHeight(ele){console.log(ele.offsetWidth+','+ele.offsetHeight); if(ele.offsetHeight > 2 && ele.offsetHeight > 2)"
		 * + " return true; " + "else " + "return false; " + "}"; if
		 * (Utils.getBrowserName().contains("internet explorer")) { visibleByCord =
		 * (boolean) jse.executeScript(script + "return widthHeight(arguments[0])", e);
		 * if (visibleByCord == true) Log.print(e.getSize().getWidth() + "," +
		 * e.getSize().getHeight()); }
		 * 
		 * Log.print(e.getSize().getWidth() + "," + e.getSize().getHeight()); if
		 * ((e.getSize().getWidth() > 2 || e.getSize().getHeight() > 2 ||
		 * (Utils.getBrowserName().contains("internet explorer"))) ||
		 * (e.getTagName().equals("option"))) { // System.out.print(" @Width > 2"); if
		 * (Utils.isVisibleJS(e)) { // System.out.print(" @PASS "); eles1.add(e); } } }
		 * else { eles1.add(e); } } else { eles1.add(e); } }
		 * 
		 * return eles1;
		 */
	}

	public static List<WebElement> visibleOverloaded(List<WebElement> eles) throws Exception {
		List<WebElement> eles1 = new ArrayList<>();
		Log.print("Size: " + eles.size());

		if (eles.size() == 1) {
			return eles;
		}
		for (WebElement e : eles) {
			boolean isDisplayed = e.isDisplayed();
			System.out.println(isDisplayed);
			if (isDisplayed) {
				eles1.add(e);
			}
		}

		return eles1;
	}

	public static boolean isVisibleJS(WebElement ele) throws ToolNotSetException {
		System.out.println("Checking Visibility");
		String script = "function isVisible(obj1){  \n" + "if (obj1 == document) return true; \n"
				+ "if (!obj1) return false; \n" + "if (!obj1.parentNode) return false; \n" + "if (obj1.style) { \n"
				+ "if (obj1.style.display == 'none') return false; \n"
				+ "if (obj1.style.visibility == 'hidden') return false; \n" + "}" + "if (window.getComputedStyle) { \n"
				+ "var style = window.getComputedStyle(obj1, ''); \n" + "if (style.display == 'none') return false; \n"
				+ "if (style.visibility == 'hidden') return false; \n" + "}" + "var style = obj1.currentStyle; \n"
				+ "if (style) { \n" + "if (style['display'] == 'none') return false; \n"
				+ "if (style['visibility'] == 'hidden') return false; \n" + "} \n"
				+ "return isVisible(obj1.parentNode); \n" + "} ";

		// Log.print(script);
		JavascriptExecutor jse = (JavascriptExecutor) Finder.findAppiumDriver();

		if ((boolean) jse.executeScript(script + " return isVisible(arguments[0])", ele)) {
			Log.print("t in isVisbleJS");
			return true;
		} else {
			Log.print("f in isVisbleJS");
			return false;
		}

	}

	public static boolean isOverlapping(WebElement ele) throws ToolNotSetException {
		System.out.println("Checking overlape #1");
		String script = "function getOverlap(currElem){\r\n" + "var myRect=currElem.getBoundingClientRect();\r\n"
				+ "var myCordinateX= myRect.left, myCordinateY = myRect.top;\r\n"
				+ "var topElement=document.elementFromPoint(myCordinateX,myCordinateY);\r\n"
				+ "if(currElem.isSameNode(topElement)){ return false;} else{ return true; }\r\n" + "}\r\n";

		Log.print(script);
		JavascriptExecutor jse = (JavascriptExecutor) Finder.findAppiumDriver();

		if ((boolean) jse.executeScript(script + " return getOverlap(arguments[0])", ele)) {
			Log.print("element is overlapped");
			return true;
		} else {
			Log.print("element is not overlapped");
			return false;
		}
	}

	public static List<WebElement> isVisibleByAppium(List<WebElement> elements) {
		List<WebElement> visibleElements = new ArrayList<WebElement>();
		for (WebElement element : elements) {
			if (element.isDisplayed()) {
				visibleElements.add(element);
			}
		}

		return visibleElements;
	}

	public static String firstCharCapitalization(String text) {
		boolean firstChar = true;
		char[] chars = text.toCharArray();

		for (int i = 0; i < chars.length; i++) {

			if (chars[i] == ' ') {
				firstChar = true;
				continue;
			}

			if (firstChar && chars[i] != ' ') {
				chars[i] = Character.toUpperCase(chars[i]);
				firstChar = false;
			}
		}
		return new String(chars);
	}

	public static List<WebElement> listRemoveDuplicate(List<WebElement> list) {
		Set<WebElement> set = new LinkedHashSet<WebElement>();
		set.addAll(list);
		list.clear();
		list.addAll(set);
		return list;
	}

	public static String runAdbCommand(String[] command)
			throws InterruptedException, UnableToProcessADBCommandException {
		try {
			String result = null;

			if ((AppiumContext.isPCloudy() == false) && (AppiumContext.isAndroid() == true)) {
				result = runADBCommandOnLocal(command);
				return result;
			}
			if (AppiumContext.getBrowserMode() == BrowserType.chromeOnLocalAndroid) {
				result = runADBCommandOnLocal(command);
			} else if (AppiumContext.isPCloudy()) {
				Log.print("runAdbCommand is not implemented for pcloudy");
				try {
					result = runADBCommandOnPcloudy(command);
				} catch (ToolNotSetException e) {
					e.printStackTrace();
				}
				 
			} else
				Log.print("runAdbCommand is only implemented for chrome on local");

			/*
			 * if (device.getDeviceType() == DeviceType.pCloudyAndroidDevice) { result =
			 * runAdbCommandOnpCloudy(command); }
			 */
			return result;
		} catch (UnableToProcessADBCommandException | InterruptedException e) {
			Log.debug(" Command Failed to execute, command was " + String.valueOf(command));
			throw e;
		}
	}

	private static String runADBCommandOnLocal(String[] command)
			throws UnableToProcessADBCommandException, InterruptedException {
		return SystemCommandExecutor.startProcess(command, true);
	}

	private static String runADBCommandOnPcloudy(String[] command)
			throws UnableToProcessADBCommandException, InterruptedException, ToolNotSetException {
		String commandToRun = String.join(" ", command);
		Object obj = Finder.findAppiumDriver().executeScript("pCloudy_executeAdbCommand", commandToRun);
		String commandOutput = (String) obj;
		System.out.println("##<< Output: " + commandOutput);
		return commandOutput;
	}

	public static File takeSnapShotViaADB(File desiredImageFile)
			throws UnableToProcessADBCommandException, InterruptedException, AdbNotFoundException {
		File ImageFile = desiredImageFile;
		String IMG_NAME = "";

		/* if (ImageTitle.isEmpty()) { */
		IMG_NAME = "Img" + System.currentTimeMillis() + ".png";

		// IMG_NAME = desiredImageFile.getName();

		/*
		 * } else { IMG_NAME = ImageTitle.replaceAll("%s", "-") + ".png"; }
		 */
		if (ImageFile == null) {
			ImageFile = new File(System.getProperty("user.dir"), "Image");
		}

		Log.print("Capture Snapshot ::: " + "Image Name " + IMG_NAME + " Desired Image File "
				+ ImageFile.getAbsolutePath());

		String[] CREATE_IMAGE = { Utils.getAdbPath(), "-s", AppiumContext.getMobileDevice().getSerialNumber(), "shell",
				"screencap", "/sdcard/" + IMG_NAME };
		String[] PULL_COMMAND = { Utils.getAdbPath(), "-s", AppiumContext.getMobileDevice().getSerialNumber(), "pull",
				"/sdcard/" + IMG_NAME, ImageFile.getAbsolutePath() };
		String[] RM_IMAGE_COMMAND = { Utils.getAdbPath(), "-s", AppiumContext.getMobileDevice().getSerialNumber(),
				"shell", "rm", "-r", "/sdcard/" + IMG_NAME };

		if (ImageFile.getParentFile().exists() == false)
			ImageFile.getParentFile().mkdirs();

		runAdbCommand(CREATE_IMAGE);
		runAdbCommand(PULL_COMMAND);
		runAdbCommand(RM_IMAGE_COMMAND);
		Log.print("Image Captured");
		// return new File(ImageFile, IMG_NAME);
		return ImageFile;
	}

	public static StringBuffer getKeyCode(String str) {

		StringBuffer keyCode = new StringBuffer();
		String dataArray[] = str.split(",");

		for (String string : dataArray) {
			String originalString = string;
			string = string.toUpperCase();
			switch (string) {
			case "NULL":
				keyCode.append(Keys.NULL);
				break;
			case "CANCEL":
				keyCode.append(Keys.CANCEL);
				break;
			case "HELP":
				keyCode.append(Keys.HELP);
				break;
			case "BACK_SPACE":
				keyCode.append(Keys.BACK_SPACE);
				break;
			case "TAB":
				keyCode.append(Keys.TAB);
				break;
			case "CLEAR":
				keyCode.append(Keys.CLEAR);
				break;
			case "RETURN":
				keyCode.append(Keys.RETURN);
				break;
			case "ENTER":
				keyCode.append(Keys.ENTER);
				break;
			case "SHIFT":
				break;
			case "LEFT_SHIFT":
				break;
			case "CONTROL":
				keyCode.append(Keys.CONTROL);
				break;
			case "LEFT_CONTROL":
				keyCode.append(Keys.LEFT_CONTROL);
				break;
			case "ALT":
				keyCode.append(Keys.ALT);
				break;
			case "LEFT_ALT":
				keyCode.append(Keys.LEFT_ALT);
				break;
			case "PAUSE":
				keyCode.append(Keys.PAUSE);
				break;
			case "ESCAPE":
				keyCode.append(Keys.ESCAPE);
				break;
			case "SPACE":
				keyCode.append(Keys.SPACE);
				break;
			case "PAGE_UP":
				keyCode.append(Keys.PAGE_UP);
				break;
			case "PAGE_DOWN":
				keyCode.append(Keys.PAGE_DOWN);
				break;
			case "END":
				keyCode.append(Keys.END);
				break;
			case "HOME":
				keyCode.append(Keys.HOME);
				break;
			case "LEFT":
				keyCode.append(Keys.LEFT);
				break;
			case "ARROW_LEFT":
				keyCode.append(Keys.ARROW_LEFT);
				break;
			case "UP":
				keyCode.append(Keys.UP);
				break;
			case "ARROW_UP":
				keyCode.append(Keys.ARROW_UP);
				break;
			case "ARROW_RIGHT":
				keyCode.append(Keys.ARROW_RIGHT);
				break;
			case "DOWN":
				keyCode.append(Keys.DOWN);
				break;
			case "ARROW_DOWN":
				keyCode.append(Keys.ARROW_DOWN);
				break;
			case "INSERT":
				keyCode.append(Keys.INSERT);
				break;
			case "DELETE":
				keyCode.append(Keys.DELETE);
				break;
			case "SEMICOLON":
				keyCode.append(Keys.SEMICOLON);
				break;
			case "EQUALS":
				keyCode.append(Keys.EQUALS);
				break;
			case "NUMPAD0":
				keyCode.append(Keys.NUMPAD0);
				break;
			case "NUMPAD1":
				keyCode.append(Keys.NUMPAD1);
				break;
			case "NUMPAD2":
				keyCode.append(Keys.NUMPAD2);
				break;
			case "NUMPAD3":
				keyCode.append(Keys.NUMPAD3);
				break;
			case "NUMPAD4":
				keyCode.append(Keys.NUMPAD4);
				break;
			case "NUMPAD5":
				keyCode.append(Keys.NUMPAD5);
				break;
			case "NUMPAD6":
				keyCode.append(Keys.NUMPAD6);
				break;
			case "NUMPAD7":
				keyCode.append(Keys.NUMPAD7);
				break;
			case "NUMPAD8":
				keyCode.append(Keys.NUMPAD8);
				break;
			case "NUMPAD9":
				keyCode.append(Keys.NUMPAD9);
				break;
			case "MULTIPLY":
				keyCode.append(Keys.MULTIPLY);
				break;
			case "ADD":
				keyCode.append(Keys.ADD);
				break;
			case "SEPARATOR":
				keyCode.append(Keys.SEPARATOR);
				break;
			case "SUBTRACT":
				keyCode.append(Keys.SUBTRACT);
				break;
			case "DECIMAL":
				keyCode.append(Keys.DECIMAL);
				break;
			case "DIVIDE":
				keyCode.append(Keys.DIVIDE);
				break;
			case "F1":
				keyCode.append(Keys.F1);
				break;
			case "F2":
				keyCode.append(Keys.F2);
				break;
			case "F3":
				keyCode.append(Keys.F3);
				break;
			case "F4":
				keyCode.append(Keys.F4);
				break;
			case "F5":
				keyCode.append(Keys.F5);
				break;
			case "F6":
				keyCode.append(Keys.F6);
				break;
			case "F7":
				keyCode.append(Keys.F7);
				break;
			case "F8":
				keyCode.append(Keys.F8);
				break;
			case "F9":
				keyCode.append(Keys.F9);
				break;
			case "F10":
				keyCode.append(Keys.F10);
				break;
			case "F11":
				keyCode.append(Keys.F11);
				break;
			case "F12":
				keyCode.append(Keys.F12);
				break;
			case "META":
				keyCode.append(Keys.META);
				break;
			case "COMMAND":
				keyCode.append(Keys.COMMAND);
				break;
			case "ZENKAKU_HANKAKU":
				keyCode.append(Keys.ZENKAKU_HANKAKU);
				break;
			default:
				keyCode.append(originalString);
			}
		}
		return keyCode;
	}

	public static void Method_bringObjectInViewArea(WebElement element)
			throws ToolNotSetException, InterruptedException {

		// SAS-13482
		try {
			List<WebElement> parentElement = element
					.findElements(By.xpath("./ancestor::*[contains(@role,\"dialog\")]"));
			if (parentElement.size() > 0) {
				System.out.println("#############");
				return;
			}
		} catch (Exception ex) {

		}
		// Log.print("Method_bringObjectInViewArea");
		// Log.print("Size " +
		// Finder.findWebDriver().manage().window().getSize());
		// Log.print("Location " + element.getLocation() + " " +
		// element.getLocation().getY());
		// Log.print("Rect ");
		// Log.print("Rect "+element.getRect().y);
		// Log.print("Size ");
		boolean tempFlag = false;
		int height = Finder.findAppiumDriver().manage().window().getSize().height;
		Object p = (Object) ((JavascriptExecutor) Finder.findAppiumDriver())
				.executeScript("return arguments[0].getBoundingClientRect().top;", element);
		try {
			((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("scroll(0," + ((Long) p - 300) + ")");
			// Log.print("Object Value Long");
			// Log.print("Object Value " + p);
			// Log.print(element.getLocation().getY() > (Long) p - 50);
			if (!((Long) p > 150 && ((Long) p < height - 150))) {
				tempFlag = true;
				// Log.print(tempFlag);
			}
		} catch (ClassCastException e) {
			((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("scroll(0," + ((Double) p - 300) + ")");
			// Log.print("Object Value Double");
			// Log.print("Object Value " + p);
			// Log.print(element.getLocation().getY() > (Double) p -
			// 50);
			if (!((Double) p > 150 && ((Double) p < height - 150))) {
				tempFlag = true;
				// Log.print(tempFlag);
			}
		}

		// Log.print("Size "+element.getSize().height);
		// ((JavascriptExecutor)
		// Finder.findWebDriver()).executeScript("scroll(0,0)");
		// p = (Object) ((JavascriptExecutor)
		// Finder.findWebDriver()).executeScript("return
		// arguments[0].getBoundingClientRect().top;", element);
		if (tempFlag) {
			((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("scroll(0,0)");
			try {
				((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("scroll(0," + ((Long) p - 300) + ")");
			} catch (ClassCastException e) {
				((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("scroll(0," + ((Double) p - 300) + ")");
			}
		}
		// ((JavascriptExecutor)
		// Finder.findWebDriver()).executeScript("arguments[0].scrollIntoView(true);",
		// element);

	}

	public static void defocousObject() throws AWTException, ToolNotSetException {

		Actions builder = new Actions(Finder.findAppiumDriver());
		builder.sendKeys(new CharSequence[] { Keys.TAB }).perform();

	}

	public static String verification_failed(String actual, String expected) {

		return "Actually Found :<" + actual + "> and Expected :<" + expected + ">";
	}

	public static boolean shouldHighlightAllObjects() {
		boolean hightLightElement = Boolean.parseBoolean(Context.session().getSettings().get("_HighlightObject"));
		if (hightLightElement && AppiumContext.isBrowserOrWebviewMode()) {
			return true;
		}
		return false;
	}

	public static boolean checkFoundedElementVisibility() {
		String value = Context.session().getSettings().get("CheckFoundedElementVisibility");
		System.out.println("Visibility check value: " + value);
		boolean checkForObjectVisibility = Boolean.parseBoolean(value);
		Log.print("Check For Visibility of Element " + checkForObjectVisibility);
		return checkForObjectVisibility;
	}

	public static void Method_bringObjectInViewArea2(WebElement element)
			throws ToolNotSetException, InterruptedException {
		// if (WebDriverDispatcher.isGetKeyword)
		// return;
		// SAS-13482
		try {
			List<WebElement> parentElement = element
					.findElements(By.xpath("./ancestor::*[contains(@role,\"dialog\")]"));
			if (parentElement.size() > 0) {
				System.out.println("@Log: Parent Element Size " + parentElement.size());
				return;
			}
		} catch (Exception ex) {

		}
		boolean tempFlag = false;
		int height = Finder.findAppiumDriver().manage().window().getSize().height;
		Object p = (Object) ((JavascriptExecutor) Finder.findAppiumDriver())
				.executeScript("return arguments[0].getBoundingClientRect().top;", element);
		try {
			((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("scroll(0," + ((Long) p - 300) + ")");
			if (!((Long) p > 150 && ((Long) p < height - 150))) {
				tempFlag = true;
			}
		} catch (ClassCastException e) {
			((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("scroll(0," + ((Double) p - 300) + ")");
			if (!((Double) p > 150 && ((Double) p < height - 150))) {
				tempFlag = true;
			}
		}
		if (tempFlag) {
			((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("scroll(0,0)");
			try {
				((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("scroll(0," + ((Long) p - 300) + ")");
			} catch (ClassCastException e) {
				((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("scroll(0," + ((Double) p - 300) + ")");
			}
		}
	}

	public static String removeSpecialCharacter(String text) {
		text = text.replace("\n", "");
		text = text.trim();
		text = text.replaceAll(" ", " ");
		text = text.replaceAll(" ", " ");
		text = text.replaceAll("[^\\x00-\\x7F]", "");
		return text;
	}

	public boolean isElementTable(WebElement ele) {
		if (ele.getTagName().equalsIgnoreCase("table"))
			return true;
		return false;
	}

	public static String removeLastChar(String str) {
		return str.substring(0, str.length() - 1);
	}

	public void checkGetKeywordsOutput(String output) {
		if (output != null && output.trim().equalsIgnoreCase("false"))
			AppiumDispatcher.isGetKeywordOutputFalse = true;
	}

	public void ValidateHeaderAndValues(int... index)
			throws ArgumentDataMissingException, KeywordMethodOrArgumentValidationFailException {
		for (int i = 0; i < index.length; i = i + 2) {
			boolean flag = false;
			try {
				Validations.checkDataForBlank(index[i]);
				try {
					Validations.checkDataForBlank(index[i + 1]);
				} catch (Exception e) {
					flag = true;
					Log.print("Inside Handling 1 = " + (i + 1));
					throw e;
				}
			} catch (Exception ex) {
				Log.print("Inside Handling 2 = " + i);
				if (flag) {
					throw ex;
				}

			}
		}
	}

	public static FunctionResult shadow_getObjectTextByJsoup(WebElement element) {
		String returnText = "";
		WebElement myObject = element;
		String source = myObject.getAttribute("outerHTML");
		Document sourceHtml = Jsoup.parse(source);
		Element cell = (Element) sourceHtml.select("body").get(0);
		Elements nonvisibleElement = cell.getElementsByClass("assistiveText");
		nonvisibleElement.addAll(cell.getElementsByClass("slds-assistive-text"));
		source = cell.toString();

		Elements allElements = cell.getAllElements();
		for (Element ele : allElements) {
			if (ele.attr("style").contains("display:none")) {
				nonvisibleElement.add(ele);
			}
		}

		for (Element ele : nonvisibleElement) {
			ele.remove();
		}

		source = cell.toString();

		sourceHtml = Jsoup.parse(source);
		cell = (Element) sourceHtml.select("body").get(0);
		returnText = cell.text();

		returnText = (returnText == null) || (returnText.equalsIgnoreCase("")) ? cell.attr("value") : returnText;

		returnText = (returnText == null) || (returnText.equalsIgnoreCase("")) ? cell.attr("placeholder") : returnText;

		returnText = (returnText == null) || (returnText.equalsIgnoreCase("")) ? cell.attr("ps-placeholder")
				: returnText;

		returnText = (returnText == null) || (returnText.equalsIgnoreCase("")) ? cell.attr("innerText") : returnText;

		returnText = returnText == null ? "" : returnText;
		if ((returnText == null) || (returnText.equalsIgnoreCase(""))) {
			return Result.PASS().setOutput(returnText)
					.setMessage("No Text or Value property exists or is null for the given Object").make();
		}
		new Utils().checkGetKeywordsOutput(returnText);
		return Result.PASS().setOutput(returnText).make();
	}

	public static String removeLast2Char(String str) {
		return str.substring(0, str.length() - 2);
	}

	public static String getAttrAndIgnoreExcecption(WebElement we, String Attribute) throws Exception {
		try {
			Boolean attributeFlag = false;
			for (ElementAttributes eleAttrbt : ElementAttributes.values()) {
				if (eleAttrbt.equals(Attribute)) {
					attributeFlag = true;
				}
			}
			if (attributeFlag)
				return we.getAttribute(Attribute);
		} catch (NoSuchElementException ex) {
			Log.print(" checked failed " + ex.getMessage());
			// ex.printStackTrace();
		} catch (UnsupportedCommandException e) {
			Log.print("warning exception while getAttrAndIgnoreExcecption: " + e.getMessage());
			// e.printStackTrace();
		}
		return "OFF";
	}

	public static void touchActionTap(int xOffset, int yOffset) throws ToolNotSetException {
		TouchAction action = new TouchAction<>(Finder.findAppiumDriver());
		action.tap(PointOption.point(xOffset, yOffset));
		action.waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)));
		action.release();
		action.perform();
	}

	// get element attribute using jsoup
	public String getElementAttributeJsoup(WebElement ele, String property) {
		String eleSource = ele.getAttribute("outerHTML");
		Document doc = Jsoup.parse(eleSource, "UTF-8");
		Element jEle = doc.select(ele.getTagName()).first();
		return jEle.attr(property);
	}

	public static boolean isAlertPresent() throws ToolNotSetException {
		return new Utils().checkAlertPresent();
	}

	public Boolean checkAlertPresent() {
		// FunctionResult frTemp = null;
		executor = Executors.newSingleThreadExecutor();
		boolean popupPresent = true;
		Future<Boolean> future = executor.submit(new checkAlertPresentOnPage());
		try {
			popupPresent = future.get(2, TimeUnit.SECONDS);
		} catch (TimeoutException e) {
			Log.print(e.getMessage());
			future.cancel(true);
			Log.print("Terminated Alert detection! ");
			executor.shutdownNow();
		} catch (Exception e) {
			Log.print(e.getMessage());
			future.cancel(true);
		} finally {
			future.cancel(true);
			executor.shutdownNow();
		}

		return popupPresent;
	}

	private void injectXhrScript() {
		try {
			ClientSideScripts.injectOpenXhrRequestsCounter();
		} catch (ToolNotSetException e) {
			Log.print(e.getMessage());
		} catch (Exception e) {
			Log.print(e.getMessage());
		}
	}

	public static String getJavaScriptScriptContent(Class<?> _class, String fileName) {
		try {
			InputStream is = _class.getResourceAsStream(fileName);
			// Log.print(fileName);
			System.out.println("fileName: " + fileName);
			System.out.println("is: " + is);
			byte[] bytes = new byte[is.available()];
			is.read(bytes);
			String result = new String(bytes, "UTF-8");
			return result;
		} catch (IOException e) {
			System.out.println("Exception while getJavaScriptScriptContent: " + e.getMessage());
			// e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	public static String ArrayToString(String[] arr) {
		StringBuilder builder = new StringBuilder();
		for (String s : arr) {
			builder.append(s + " ");
		}
		String Converted_String = builder.toString().substring(0, builder.toString().lastIndexOf(" "));
		Log.print(Converted_String);
		return Converted_String;
	}

	public static String getString(String sms, String before, String after) {
		if ((before == null || before.isEmpty()) && (after == null || after.isEmpty())) {
			return sms;
		}

		String trimmedString = sms;

		if (!(after == null || after.isEmpty())) {
			int afterIndex = sms.indexOf(after) + after.length();

			System.out.println("afterIndex: " + afterIndex);
			trimmedString = sms.substring(afterIndex);
			System.out.println("trimmedString: " + trimmedString);
		}

		if (!(before == null || before.isEmpty())) {
			int beforeIndex = trimmedString.indexOf(before);
			trimmedString = trimmedString.substring(0, beforeIndex);

		}

		return trimmedString.trim();
	}

	public static String getOtpNumber(String message, String before, String after)
			throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException,
			ToolNotSetException, AdbNotFoundException {
		String duplicate = message;
		String[] strings = duplicate.split(" ");
		List<String> listOfNumbers = new ArrayList<String>();
		for (String str : strings) {
			if (str.length() >= 4) {
				char firstword = str.charAt(0);
				char lastword = str.charAt(str.length() - 1);
				if (Character.isDigit(firstword) && Character.isDigit(lastword)) {
					listOfNumbers.add(str.trim());
				}
			}
		}
		int size = listOfNumbers.size();

		if (size == 1) {
			return listOfNumbers.get(0);
		}
		if (size > 1) {
			return getOtpFrom_MultipleNum(listOfNumbers, message, before, after);
		}

		return "Otp Not Found";

	}

	public static int getTextCount(String message, String text) {
		int count = 0;
		Pattern pattern = Pattern.compile(text, Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(message);
		while (matcher.find()) {
			count++;
		}
		return count;
	}

	public static String getOtpFrom_MultipleNum(List<String> list, String message, String before, String after) {
		String finalString = "";
		if (!(after == null || after.isEmpty())) {
			if (getTextCount(message, after) == 1) {
				if (message.contains(after)) {
					message = message.substring(0, message.lastIndexOf(after));
				}
			}
		}

		finalString = message;
		if (!finalString.equals("") && list.contains(finalString.trim())) { // if otp is very first word no before
			return finalString;
		}

		if (!(before == null || before.isEmpty())) {
			if (getTextCount(message, before) == 1) {
				if (message.contains(before)) {
					message = message.substring(message.lastIndexOf(before) + before.length(), message.length());
					finalString = message.trim();
				}
			}

		}
		if (list.contains(finalString.trim())) {
			return finalString.trim();
		}

		return "Please provide before and after text little longer ";
	}

	public static int findFreePort() {
		ServerSocket socket = null;
		try {
			socket = new ServerSocket(0);
			socket.setReuseAddress(true);
			int port = socket.getLocalPort();
			try {
				socket.close();
			} catch (IOException e) {
				// Ignore IOException on close()
			}
			return port;
		} catch (IOException e) {
		} finally {
			if (socket != null) {
				try {
					socket.close();
				} catch (IOException e) {
				}
			}
		}
		throw new IllegalStateException("Could not find a free TCP/IP port to start embedded Jetty HTTP Server on");
	}

	public static boolean isMyLocalAdress(String host) {
		Log.print("argument: " + host);

		try {
			if (host.equalsIgnoreCase("localhost") || host.equalsIgnoreCase("http://localhost")
					|| host.equals("127.0.0.1") || host.equals("0.0.0.0")) {
				Log.print("matched with hard coded value...");
				return true;
			}

			// Compare public IP address
			String requestHostAddress = InetAddress.getByName(host).getHostAddress();
			String myHostAddress = InetAddress.getLocalHost().getHostAddress();
			System.out.println("requestHostAddress: " + requestHostAddress);
			System.out.println("myHostAddress: " + myHostAddress);

			if (requestHostAddress.equals(myHostAddress)) {
				Log.print("matched with private ip address...");
				return true;
			}
		} catch (Exception e) {
			System.out.println("--Exception while checking isMyLocalAdress");
		}

		return false;
	}

	public static int getRandomNumber(int min, int max) {
		Random random = new Random();
		int randomNo = random.nextInt((max - min) + 1) + min;
		return randomNo;
	}

	public File takeScreenshotUsingAppium() throws WebDriverException, ToolNotSetException {
		return Finder.findAppiumDriver().getScreenshotAs(OutputType.FILE);

	}

	public String getAppiumProperty(String name) throws IOException {

		String cDir = Context.session().getDefaultPluginLocation() + File.separator + "appium.properties";
		System.out.println("appium.properties: " + cDir);
		try (FileReader reader = new FileReader(cDir)) {
			Properties prop = new Properties();
			prop.load(reader);
			return prop.getProperty(name);
		}
	}

	public static WebElement findNearestElement(List<WebElement> editboxElements, WebElement relativeElement) {
		org.openqa.selenium.Point point = relativeElement.getLocation();
		org.openqa.selenium.Dimension eleSize = relativeElement.getSize();
		int centerX = point.getX() + (eleSize.getWidth() / 2);
		int centerY = point.getY() + (eleSize.getHeight() / 2);
		System.out.println("relativ element center x and y " + centerX + " " + centerY);
		Point relativeElementCenterPoint = new Point(centerX, centerY);
		HashMap<WebElement, Point> hashmap = new HashMap<>();
		for (WebElement element : editboxElements) {
			org.openqa.selenium.Point elementPoint = element.getLocation();
			org.openqa.selenium.Dimension elementSize = element.getSize();
			int elementCenterX = elementPoint.getX() + (elementSize.getWidth() / 2);
			int elementCenterY = elementPoint.getY() + (elementSize.getHeight() / 2);
			Point elementCenterPoint = new Point(elementCenterX, elementCenterY);
			hashmap.put(element, elementCenterPoint);
		}

		return findMinimumDistanceElement(relativeElementCenterPoint, hashmap);

	}

	public static WebElement findMinimumDistanceElement(Point relativePoint, HashMap<WebElement, Point> hashmap) {
		double dis = 0;
		WebElement element = null;
		Point point;
		LinkedHashMap<Double, WebElement> elementWithDistanceMap = new LinkedHashMap<Double, WebElement>();
		for (Map.Entry<WebElement, Point> entry : hashmap.entrySet()) {
			element = entry.getKey();
			point = entry.getValue();
			dis = Math.sqrt((point.x - relativePoint.x) * (point.x - relativePoint.x)
					+ (point.y - relativePoint.y) * (point.y - relativePoint.y));
			elementWithDistanceMap.put(dis, element);
		}
		List<Double> sortedList = new ArrayList<Double>();
		Map<Double, WebElement> map = new TreeMap<>(elementWithDistanceMap);
		for (Double Key : map.keySet()) {
			System.out.println("Distance -> " + Key);
			sortedList.add(Key);
		}
		return elementWithDistanceMap.get(sortedList.get(0));
	}

	public static boolean clearField_IOS(WebElement we) {
		try {
			System.out.println("##<< IOS ::");
			String text = GetElementText(we);
			System.out.println("##<< object  text is  " + text);
			for (int textLength = text.length(), i = 0; i < textLength; i++) {
				we.sendKeys(new CharSequence[] { (CharSequence) Keys.BACK_SPACE });
				String textAfterOneLetterCleared = GetElementText(we);
				if (text.equals(textAfterOneLetterCleared)) { // break if placeholder text is coming repeatedly. getText
					// also return Placeholder value
					break;
				}
			}
			return true;
		} catch (WebDriverException e) {
			Log.print("#1 Not able to clear..." + e.getMessage());
		}
		return false;
	}

	public static String GetElementText(WebElement we) {
		String text;

		if (AppiumContext.isBrowserMode()) {
			System.out.println(" ##<< Web  mode :: Getting text from element   ");
			try {
				JavascriptExecutor js = Finder.findJavaScriptExecuterDriver();
				String script = "function getText(obj){var text=''; text=obj.innerText; if(!(text==null||undefined)){ return text; } return obj.value; }";
				text = (String) js.executeScript(script + " return getText(arguments[0])", we);

			} catch (Exception e) {
				System.out.println(" ##<< exeption while getting text  " + e.getMessage());
				text = we.getText();
			}

		} else {
			text = we.getText();
			System.out.println("##<< Native mode text of element :: " + text);

		}
		return text;
	}

	public static Boolean isElementTextCleared(String text) {
		try {
			System.out.println("##<< text is " + text + " text length " + text.length());
		} catch (Exception e) {
			System.out.println("##<< exception in isElementTextCleared() ");
			return false;
		}

		if (text != null && text.length() == 0) {
			System.out.println("##<<  isElementTextCleared() returning true  ");
			return true;
		}
		return false;
	}

}

class checkAlertPresentOnPage implements Callable<Boolean> {

	static public Class<?> _class = checkAlertPresentOnPage.class;

	@Override
	public Boolean call() throws Exception {
		Log.print("Searching For Alert Present");
		try {
			Finder.findAppiumDriver().switchTo().alert();
			Log.print("Alert Found");
			return true;
		} // try
		catch (Exception ex) {

			// _Performance_Issues
			Log.print("Alert Not Found");
			Log.print("Checking For Authentication popup");

			try {

				Finder.findAppiumDriver().getTitle();

				return false;
			} catch (UnhandledAlertException e) {
				Log.print(e.getMessage());
				return true;
			} catch (ToolNotSetException e) {
				Log.print(e.getMessage());
				return false;
			}
		}
	}

}
