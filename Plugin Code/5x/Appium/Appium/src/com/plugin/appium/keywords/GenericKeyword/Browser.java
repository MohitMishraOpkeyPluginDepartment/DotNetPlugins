package com.plugin.appium.keywords.GenericKeyword;

import java.io.IOException;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.Finder;
import com.plugin.appium.Utils;
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInApplicationMode;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInMobileContext;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.BrowserType;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.enums.DriverWindow;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.AdbNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.AppiumSpecificKeyword.Connect2AppiumServer;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.nativekey.AndroidKey;

public class Browser implements KeywordLibrary {

	static Logger logger = Logger.getLogger(Finder.class.getName());
	static boolean flag = true;

	/**
	 * 
	 * 
	 * 
	 * 
	 * 
	 */

	public FunctionResult Method_WebBrowserOpen(String browser, String url) throws ToolNotSetException, IOException, InterruptedException {
		return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false).setMessage("Method not supported in Mobile Context. Use 'Launch_Android Application' Keyword instead").make();
	}

	/**
	 * @throws InterruptedException
	 * 
	 * 
	 * 
	 * 
	 */
	private static String RemoveStatusBar(String source) {
		Document ele = Jsoup.parse(source);
		Elements node = ele.getElementsByTag("XCUIElementTypeStatusBar");
		int size = node.size();
		System.out.println("Size is as :: " + size);
		try {
			ele.getElementsByTag("XCUIElementTypeStatusBar").get(size - 1).remove();
		} catch (Exception ex) {
			// Do Nothing
		}
		return ele.toString();
	}

	public FunctionResult Method_goBack() throws ToolNotSetException, WebDriverException, IOException, InterruptedException {

		if (AppiumContext.getDriverWindow() == DriverWindow.WebView) {
			// In webView mode back button is invisible so we press back using
			// android key code
//			Utils.PressAndroidButton(4);
			Utils.pressAndroidButton(AndroidKey.BACK);
		} else {
			Thread.sleep(3000);
			// When driver is in native mode or in browser mode
			if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice) {
				String source = Finder.findAppiumDriver().getPageSource();
				// System.out.println(source);
				source = RemoveStatusBar(source);
				Finder.findAppiumDriver().navigate().back();
				Thread.sleep(3000);
				String html = Finder.findAppiumDriver().getPageSource();
				// System.out.println(html);
				html = RemoveStatusBar(html);
				if (source.equals(html)) {
					try {
						Finder.findAppiumDriver().findElement(By.xpath("(//XCUIElementTypeButton[contains(@name,'Back')])[1]")).click();
					} catch (Exception ex) {
//						new TouchAction(Finder.findAppiumDriver()).tap(12, 12).perform();
						Utils.touchActionTap(12,  12);
					}
				}
				html = Finder.findAppiumDriver().getPageSource();
				html = RemoveStatusBar(html);
				if (flag && source.equals(html)) {
					flag = false;
					Method_goBack();
				}
			} else {
				Finder.findAppiumDriver().navigate().back();
			}
		}
		flag = true;
		return Result.PASS().setOutput(true).make();
	}

	/**
	 * @throws ToolNotSetException
	 * 
	 * 
	 * 
	 * 
	 */

	public FunctionResult Method_fetchBrowserTitle_1() throws ToolNotSetException {
		String browserTitle = Finder.findAppiumDriver().getTitle();
		return Result.PASS().setOutput(browserTitle).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInApplicationMode
	public FunctionResult Method_fetchBrowserURL() throws ToolNotSetException, WebDriverException, IOException {
		String fetchedUrl = Finder.findAppiumDriver().getCurrentUrl();
		return Result.PASS().setOutput(fetchedUrl).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@NotSupportedInMobileContext
	public FunctionResult Method_CloseBrowser(String browserTitle) throws Exception {
		return null;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@NotSupportedInApplicationMode
	public FunctionResult Method_CloseAllBrowsers() throws Exception {
		String msg = Browser.util_KillAllDrivers();
		System.out.println(msg);
		return Result.PASS().setOutput(true).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	public FunctionResult Method_MaximizeBrowser() throws Exception {
		
		Finder.findAppiumDriver().manage().window().maximize();
		
		return Result.PASS().setOutput(true).setMessage("DONE").make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	public FunctionResult Method_VerifyBrowserTitle_1(String userBrowserTitle) throws Exception {

		String browserTitle = Finder.findAppiumDriver().getTitle();

		boolean titleMatched = userBrowserTitle.contentEquals(browserTitle) ? true : false;

		if (titleMatched) {
			return Result.PASS().setOutput(true).make();
		} else {
			return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
					.setMessage(ReturnMessages.verificationFailed(browserTitle, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue())).make();
		}

		// return
		// Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setMessage(ReturnMessages.APPIUM_NOT_SUPPURTED.toString()).make();

	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@NotSupportedInApplicationMode
	public FunctionResult Method_goForward() throws ToolNotSetException, WebDriverException, IOException {
		return null;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@NotSupportedInApplicationMode
	public FunctionResult Method_verifyBrowserExist(String browserTitle) throws ToolNotSetException, WebDriverException, IOException {
		return null;
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@NotSupportedInApplicationMode
	public FunctionResult Method_RefreshBrowser() throws ToolNotSetException, WebDriverException, IOException {
		Finder.findAppiumDriver().navigate().refresh();
		return Result.PASS().setOutput(true).make();
	}

	/**
	 * @throws InterruptedException
	 * 
	 * 
	 * 
	 * 
	 */

	@NotSupportedInApplicationMode
	public FunctionResult Method_syncBrowser() throws ToolNotSetException, WebDriverException, IOException, InterruptedException {
		// wait for navigate the old page in to the new page then try to sync
//		Thread.sleep(1500);
//		Utils.waitForPageLoad(Finder.findAppiumDriver());
		
		/*Now our each keyword checks for XHR,Wait and ETC so no need to spend time here.*/
		return Result.PASS().setOutput(true).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@NotSupportedInApplicationMode
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_navigateTo(String url) throws Exception {

		String simplifiedUrl = Utils.validateURL(url);

		if (simplifiedUrl.trim().equalsIgnoreCase("")) {

			String message = "Please enter valid url";
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setMessage(message).make();
		}

		if (AppiumContext.getBrowserMode() == BrowserType.SafariOnIos) {
			Finder.findAppiumDriver().navigate().to(simplifiedUrl);
			// Sync After Navigate
			Utils.setPageLoadAndScriptTimeout(Context.current().getCallTimeoutInMillis());
		} else {
			// set the page load time Out
			Utils.setPageLoadAndScriptTimeout(Context.current().getCallTimeoutInMillis());
			Finder.findAppiumDriver().navigate().to(simplifiedUrl);
		}
		// set the driver timeout with opkey step timeout
		return Result.PASS().setOutput(true).make();

	}

	/**
	 * @throws ToolNotSetException
	 * 
	 * 
	 * 
	 * 
	 */

	public FunctionResult Method_MinimizeBrowser() throws Exception {
		
		Finder.findAppiumDriver().manage().window().maximize();
		
		return Result.PASS().setOutput(true).setMessage("DON").make();
	}

	// ******Helping Function*******
	public static String util_KillAllDrivers() throws IOException, AdbNotFoundException, InterruptedException {

		String message = (Connect2AppiumServer.allOpenWebDrivers.size() <= 0) ? "No Instance of Appium driver exists"
				: Connect2AppiumServer.allOpenWebDrivers.size() + " instance of Appium Driver exists";
		String msg;

		// kill a process when start Appium server sucessfully but driver
		// instance not created
		//if  AppiumContext.getAppiumServerProcess() is null, it will lead to error;
		
		if(Connect2AppiumServer.allOpenWebDrivers.size() == 0 && AppiumContext.getAppiumDriverLocalService() == null) {
			return "Either Application was never Opened or All instances were closed";
		}
		
		if (AppiumContext.getAppiumServerProcess() != null && Connect2AppiumServer.allOpenWebDrivers.size() == 0) {
			System.out.println("Instance of Appium Server not created So kill Appium server process");
			Utils.CloseAllProcess();
			// in the case of when Appium instance i s created but appium driver
			// instance not created during some reason
			if (AppiumContext.getBrowserMode() == BrowserType.chromeOnLocalAndroid) {
				// Runtime.getRuntime().exec("taskkill /f /IM
				// chromedriver.exe");
				// Utils.killAdbServer();
			}
		}

		for (AppiumDriver<WebElement> wd : Connect2AppiumServer.allOpenWebDrivers) {
			try {

				wd.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
				closeAllTabs(wd);
			} catch (Exception ex) {
				System.out.println("Not able to close driver, trying to quit now...");
				// ex.printStackTrace();
			} finally {
				System.out.println("quiting");
				try {
					wd.quit();
					System.out.println("after quiting");
				} catch (Exception ex) {
					System.out.println("quiting exception:- ");
				}

				msg = "\nClosed ::";
				message = message + msg;
			}
		}
		
		try {
			System.out.println("Closing auto started appium server");
			System.out.println("AppiumContext.getAppiumDriverLocalService(): " + AppiumContext.getAppiumDriverLocalService());
			if(AppiumContext.getAppiumDriverLocalService() !=null) {
				AppiumContext.getAppiumDriverLocalService().stop();
				AppiumContext.setAppiumDriverLocalService(null);
			}
		} catch (Exception e) {
			System.out.println("Warning while closing auto started appium server: " + e.getMessage());
		}
		
		
		if (AppiumContext.getAppiumServerProcess() != null) {
			Utils.closeAppiumServer();
		}

		Connect2AppiumServer.allOpenWebDrivers.clear();
		AppiumContext.launchAppiumServer(false);
		Context.session().setTool(null);
		
		
		
		return message;
	}

	public static void closeAllTabs(AppiumDriver<WebElement> driver) throws IOException {

		System.out.println("Try to close all tabs ");
		if (AppiumContext.isBrowserMode()) {
			driver.close();

			/*
			 * 
			 * Set<String> winHandles = driver.getWindowHandles(); System.out.println("eindow handles size:- "+winHandles.size()); for (String currWindHandle : winHandles) {
			 * System.out.println("closing:- "+currWindHandle); driver.switchTo().window(currWindHandle).close(); System.out.println("closed:- "+currWindHandle); }
			 * 
			 */
		}
		System.out.println("closing all tabs that are opened by driver");

		// Unintall App
		if (AppiumContext.getMobileApp() != null && !AppiumContext.isBrowserMode()) {
			driver.removeApp(AppiumContext.getMobileApp().getPackage());
		}
	}
}
