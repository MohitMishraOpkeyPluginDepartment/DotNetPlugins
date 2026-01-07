package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.MalformedURLException;
import java.net.ServerSocket;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import org.openqa.selenium.Dimension;
import org.openqa.selenium.Platform;
import org.openqa.selenium.UnsupportedCommandException;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functioncall.MobileApplication;
import com.crestech.opkey.plugin.communication.contracts.functioncall.MobileDevice;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;
import com.plugin.appium.AppiumServerArgument;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.android.AndroidVersion;
import com.plugin.appium.android.AndroidWebDriver;
import com.plugin.appium.capabilities.Capabilities;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.BrowserType;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.AdbNotFoundException;
import com.plugin.appium.exceptionhandlers.AppiumCliValidationFailException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.GenericKeyword.Browser;
import com.plugin.appium.keywords.GenericKeyword.SetCapabilities;
import com.plugin.appium.pcloudy.PCloudyCapabilities;
import com.plugin.appium.util.FileHosting;
import com.ssts.pcloudy.exception.ConnectError;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.Setting;
import io.appium.java_client.android.Activity;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import io.appium.java_client.service.local.AppiumServiceBuilder;
import io.appium.java_client.service.local.flags.AndroidServerFlag;
import io.appium.java_client.service.local.flags.GeneralServerFlag;

public class Connect2AppiumServer implements KeywordLibrary {

    public static Dimension dim;
    public static ArrayList<AppiumDriver> allOpenWebDrivers = new ArrayList<AppiumDriver>();

    Logger logger = Logger.getLogger(Connect2AppiumServer.class.getName());
    public static boolean safari_on_pcloudy = false;
    public static String appPath = null;
    public static MobileDevice mobileDevice;
    public static MobileApplication mobileApplication;

    static boolean isReset = false;

    public FunctionResult Method_LaunchBrowserOnMobileDevice(MobileDevice mobileDevice, String url) throws Exception {
	if (mobileDevice.getOperatingSystem().equalsIgnoreCase("android")) {
	    return Method_Launch_ChromeBrowser(mobileDevice, url);
	} else if (mobileDevice.getOperatingSystem().equalsIgnoreCase("ios")) {
	    return Method_LaunchSafarOnIos(mobileDevice, url);
	}

	return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).make();
    }

    public FunctionResult LaunchApplicationOnMobileDevice(MobileDevice mobileDevice,
	    MobileApplication mobileApplication) throws Exception {

	if (mobileDevice.getOperatingSystem().equalsIgnoreCase("android")) {
	    return Method_Launch_AndroidApplication(mobileDevice, mobileApplication);
	} else if (mobileDevice.getOperatingSystem().equalsIgnoreCase("ios")) {
	    return Method_Launch_iOSApplicationOnDevice(mobileDevice, mobileApplication);
	}

	return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).make();
    }

    public FunctionResult Method_Launch_AndroidApplication(MobileDevice androidDevice,
	    MobileApplication androidApplication) throws Exception {

	logger.info("Opkey Appium Initiated ...");
	AppiumDriver<WebElement> wb;
	AppiumContext.setMobileApp(androidApplication);

	DeviceType deviceType = this.predictDeviceType(androidDevice, androidApplication);
	AppiumContext.setMobileDevice(androidDevice);
	AppiumContext.setDeviceType(deviceType);

	logger.info("Determining Appium Device Mode: " + deviceType);

	DesiredCapabilities caps = this.getDesiredCapabilities(deviceType, androidApplication,
		androidApplication.getApplicationPath(), androidDevice.getSerialNumber(), null, null);

	// if the activity is changed during the execution then catch an
	// exception check retry only one times
	caps.setCapability("appium:platformVersion", (androidDevice.getVersion()).toString());
	try {
	    wb = this.setUpConnectionWithAppiumServer(deviceType, caps, null);
	} catch (WebDriverException ex) {
	    if (ex.getMessage().contains("Connection refused:")) {
		int port = Integer.parseInt(Context.session().getSettings().get("Port"));
		this.launchAppiumServer("127.0.0.1", port);
		wb = this.setUpConnectionWithAppiumServer(deviceType, caps, null);
	    }

	    String message;
	    String currentActivity = null;

	    if (AppiumContext.getErrorFromAppiumServer() != null) {

		message = AppiumContext.getErrorFromAppiumServer();
		if (message.contains("Activity") && message.contains("never started") && message.contains("Current")) {
		    currentActivity = message.substring(message.indexOf("Current: "));
		}
	    }

	    else {
		message = ex.getMessage();
		if (message.contains("Activity") && message.contains("never started") && message.contains("Current")) {
		    currentActivity = message.substring(message.indexOf("Current: "), message.indexOf(")"));
		}
	    }

	    System.out.println(" messages " + message);

	    if (currentActivity != null) {

		logger.fine("before removing the current  " + currentActivity);
		currentActivity = currentActivity.replace("Current: ", "");

		logger.fine(" current activity " + currentActivity);
		currentActivity = currentActivity.replace("/.", ".");

		// In com.utorrent.client.apk-Media & Video apk after replace
		// com.utorrent.client/com.bittorrent.client.onboarding.OnboardingManager
		// so we replace
		currentActivity = currentActivity.replace("/", "");

		/*
		 * In some application new changed activity is not get using /. replace so we
		 * replace / to get the new activity name
		 */

		logger.info(
			"######Current Activity has been changed Now Current Activity  #########  " + currentActivity);
		caps.setCapability("app-wait-activity", currentActivity);
		caps.setCapability("appWaitActivity", currentActivity);
		// Delete a sever and try to get start again because give an
		// exception a session is already in progress
		Utils.closeAppiumServer();

		// we are try to launch appium server again so Appium sever
		// instance false
		AppiumContext.launchAppiumServer(false);

		Thread.sleep(2000);

		wb = this.setUpConnectionWithAppiumServer(deviceType, caps, null);

	    } else {
		Utils.closeAppiumServer();
		throw ex;
	    }
	}

	AndroidDriver<WebElement> androidDriver = (AndroidDriver<WebElement>) wb;
	androidDriver.setSetting(Setting.WAIT_FOR_IDLE_TIMEOUT, 500);
	allOpenWebDrivers.add(wb);
	dim = Finder.findAppiumDriver().manage().window().getSize();
	return Result.PASS().make();
    }

    public FunctionResult Method_Launch_ChromeOnCloud(String androidVersion, String appiumVersion, String sauceUserName,
	    String sauceacessKey, String url) throws Exception {

	DesiredCapabilities caps = DesiredCapabilities.android();

	caps.setCapability("browserName", "Chrome");
	caps.setCapability("platformVersion", androidVersion);
	caps.setCapability("appiumVersion", appiumVersion);
	caps.setCapability("platformName", "Android");
	caps.setCapability("deviceName", "Android Emulator");
	caps.setCapability("device-orientation", "portrait");
	// caps.setCapability(CapabilityType.BROWSER_NAME, "");
	caps.setCapability("platform", Platform.XP);
	// caps.setCapability("app", "chrome");

	AppiumDriver<WebElement> wb = new AndroidWebDriver(
		new URL("http://" + sauceUserName + ":" + sauceacessKey + "@ondemand.saucelabs.com:80/wd/hub"), caps);
	AppiumContext.setBrowserMode(BrowserType.chromeOnLocalAndroid);
	return this.ValidateUrl(wb, url);
    }

    public FunctionResult Method_Launch_iOSApplicationOnDevice_OldBackup(MobileDevice iosDevice,
	    MobileApplication iOSApplication) throws Exception {
	String bundleID = iOSApplication.getPackage();
	AppiumContext.setMobileDevice(iosDevice);
	DesiredCapabilities caps = this.getDesiredCapabilities(DeviceType.IPhoneRealDevice, null, bundleID,
		iosDevice.getSerialNumber(), null, null);

	AppiumDriver<WebElement> wb = this.setUpConnectionWithAppiumServer(DeviceType.IPhoneRealDevice, caps, null);
	allOpenWebDrivers.add(wb);
	// set the device on the Iphone
	AppiumContext.setDeviceType(DeviceType.IPhoneRealDevice);
	return Result.PASS().make();
    }

    // Modified By Tarif
    public FunctionResult Method_Launch_iOSApplicationOnDevice(MobileDevice iosDevice, MobileApplication iOSApplication)
	    throws Exception {
    	
	mobileDevice = iosDevice;
	String iosversion = mobileDevice.getVersion();
	mobileApplication = iOSApplication;
	String bundleID = iOSApplication.getApplicationPath();
	appPath = bundleID;
	System.out.println("*****************FILE PATH***************** " + bundleID);
	if (!(Context.session().getSettings().containsKey("pCloudy_AppiumCapabilities"))) {
	    bundleID = new FileHosting().StartFileTransferServer(bundleID);
	}

	AppiumContext.setMobileDevice(iosDevice);
	DesiredCapabilities caps = this.getDesiredCapabilities(DeviceType.IPhoneRealDevice, null, bundleID,
		iosDevice.getSerialNumber(), null, null);
//		caps.setCapability(MobileCapabilityType.PLATFORM_NAME, "ios");
	caps.setCapability("appium:platformVersion", iosversion);
	caps.setCapability("appium:automationName", "XCUITest");
	caps.setCapability("appium:bundleId", iOSApplication.getPackage());
	caps.setCapability("appium:xcodeConfigFile", "/usr/local/appium.xcconfig");
	caps.setCapability("appium:newCommandTimeout", 3000);
//		caps.setCapability(GeneralServerFlag.SESSION_OVERRIDE.getArgument(), true);
	caps.setCapability("appium:includeSafariInWebviews", true);
	caps.setCapability("appium:realDeviceLogger", "/usr/local/lib/node_modules/deviceconsole/deviceconsole");
	caps.setCapability("appium:wdaLocalPort", Utils.getRandomNumber(1024, 65535));
	// includeSafariInWebviews waits without any reason when run getContext on
	// native page.
	int webviewConnectTimeout = 78;
	System.out.println("@Condition: " + (Context.current().getKeywordRemaningSeconds() < 90));
	System.out.println("@Timeout :" + Context.current().getKeywordRemaningSeconds());
	if (Context.current().getKeywordRemaningSeconds() < 90) {
	    webviewConnectTimeout = Context.current().getKeywordRemaningSeconds() - 6;
	}
	caps.setCapability("appium:webviewConnectTimeout", webviewConnectTimeout * 1000);

	AppiumDriver wb = null;
	try {
	    wb = this.setUpConnectionWithAppiumServer(DeviceType.IPhoneRealDevice, caps, null);
	} catch (Exception ex) {
	     ex.printStackTrace();
	     System.out.println(ex.getMessage());
	    wb = null;
	    bundleID = "/usr/local/ssts.ipa";
	    appPath = bundleID;
	    caps = this.getDesiredCapabilities(DeviceType.IPhoneRealDevice, null, bundleID, iosDevice.getSerialNumber(),
		    null, null);
//			caps.setCapability(MobileCapabilityType.PLATFORM_NAME, "ios");
//			caps.setCapability("appium:automationName", "XCUITest");
//			caps.setCapability("appium:realDeviceLogger", "/usr/local/lib/node_modules/deviceconsole/deviceconsole");
//			caps.setCapability("appium:wdaLocalPort", 8200);
//			caps.setCapability("appium:xcodeConfigFile", "/usr/local/appium.xcconfig");
//			caps.setCapability("appium:newCommandTimeout", 3000);
//			caps.setCapability(GeneralServerFlag.SESSION_OVERRIDE.getArgument(), true); //these caps are repeated in exception scenario making logs confusing
	    wb = this.setUpConnectionWithAppiumServer(DeviceType.IPhoneRealDevice, caps, null);
	}
	allOpenWebDrivers.add(wb);
	// set the device on the Iphone
	AppiumContext.setDeviceType(DeviceType.IPhoneRealDevice);
	new FileHosting().StopFileTransferServer();
	dim = Finder.findAppiumDriver().manage().window().getSize();
	return Result.PASS().make();
    }

    public FunctionResult Method_Launch_iOSApplicationOnDeviceReset(MobileDevice iosDevice,
	    MobileApplication iOSApplication) throws Exception {
	Finder.findAppiumDriver().quit();
	isReset = true;
	String bundleID = iOSApplication.getApplicationPath();
	appPath = bundleID;
	System.out.println("*****************FILE PATH***************** " + bundleID);
	if (!(Context.session().getSettings().containsKey("pCloudy_AppiumCapabilities"))) {
	    bundleID = new FileHosting().StartFileTransferServer(bundleID);
	}
	// bundleID = "/Users/crestech/Desktop/ASTRO_DEVELOP__1_.ipa";
	AppiumContext.setMobileDevice(iosDevice);
	DesiredCapabilities caps = this.getDesiredCapabilities(DeviceType.IPhoneRealDevice, null, bundleID,
		iosDevice.getSerialNumber(), null, null);
	caps.setCapability("platformName", "ios");
	caps.setCapability("appium:platformName", "ios");
	caps.setCapability("appium:automationName", "XCUITest");
	caps.setCapability("appium:fullReset", true);
	caps.setCapability("appium:newCommandTimeout", 3000);

	caps.setCapability("appium:realDeviceLogger", "/usr/local/lib/node_modules/deviceconsole/deviceconsole");
	caps.setCapability("appium:wdaLocalPort", 8200);
	caps.setCapability("appium:xcodeConfigFile", "/usr/local/appium.xcconfig");

	caps.setCapability(GeneralServerFlag.SESSION_OVERRIDE.getArgument(), true);
	AppiumDriver wb = null;
	try {
	    wb = this.setUpConnectionWithAppiumServer(DeviceType.IPhoneRealDevice, caps, null);
	} catch (Exception ex) {
	    wb = null;
	    bundleID = "/usr/local/ssts.ipa";
	    appPath = bundleID;
	    caps = this.getDesiredCapabilities(DeviceType.IPhoneRealDevice, null, bundleID, iosDevice.getSerialNumber(),
		    null, null);
//			caps.setCapability(MobileCapabilityType.PLATFORM_NAME, "ios");
//			caps.setCapability("appium:automationName", "XCUITest");
//			caps.setCapability("appium:realDeviceLogger", "/usr/local/lib/node_modules/deviceconsole/deviceconsole");
//			caps.setCapability("appium:wdaLocalPort", 8200);
//			caps.setCapability("appium:fullReset", true);
//			caps.setCapability("appium:xcodeConfigFile", "/usr/local/appium.xcconfig");
//			caps.setCapability("appium:newCommandTimeout", 3000);
//			caps.setCapability(GeneralServerFlag.SESSION_OVERRIDE.getArgument(), true); //these caps are repeated in exception scenario making logs confusing
	    wb = this.setUpConnectionWithAppiumServer(DeviceType.IPhoneRealDevice, caps, null);
	}
	allOpenWebDrivers.add(wb);
	// set the device on the Iphone
	AppiumContext.setDeviceType(DeviceType.IPhoneRealDevice);
	new FileHosting().StopFileTransferServer();
	dim = Finder.findAppiumDriver().manage().window().getSize();
	isReset = false;
	return Result.PASS().make();
    }

    /*
     * 
     * 
     * 
     * 
     **/

    public FunctionResult Method_Launch_ChromeBrowser(MobileDevice androidDevice, String url) throws Exception {

	ArrayList<String> additionalServerArgument = new ArrayList<String>();
	AppiumContext.setMobileDevice(androidDevice);
	// Add the Server Argument Chrome run on the Android mobile
	additionalServerArgument.add("--browser-name");
	additionalServerArgument.add("Chrome");
	additionalServerArgument.add("--chromedriver-port");
	additionalServerArgument.add(findFreePort() + "");

	AppiumContext.setBrowserMode(BrowserType.chromeOnLocalAndroid);
	DeviceType deviceType = this.predictDeviceType(androidDevice, null);
	AppiumContext.setDeviceType(deviceType);
	DesiredCapabilities caps = this.getDesiredCapabilities(deviceType, null, null, androidDevice.getSerialNumber(),
		null, null);
	caps.setCapability("appium:platformVersion", (androidDevice.getVersion()).toString());
	// caps.setCapability(ChromeOptions.CAPABILITY,
	// SetCapabilities.getChromeOptions());

	logger.info("Determining Appium Device Mode: " + deviceType);
	AppiumDriver wb = null;
	try {
	    wb = this.setUpConnectionWithAppiumServer(deviceType, caps, additionalServerArgument);
	    AppiumContext.setBrowserMode(BrowserType.chromeOnLocalAndroid);
	} catch (WebDriverException ex) {
	    /** host and port provided but appium server is not running. */
	    if (ex.getMessage().contains("Connection refused:")) {
		int port = Integer.parseInt(Context.session().getSettings().get("Port"));
		this.launchAppiumServer("127.0.0.1", port);
		wb = this.setUpConnectionWithAppiumServer(deviceType, caps, additionalServerArgument);
		AppiumContext.setBrowserMode(BrowserType.chromeOnLocalAndroid);
	    }

	    ex.printStackTrace();
	}

	return this.ValidateUrl(wb, url);
    }

    // Added By Prashant
    public FunctionResult Method_Launch_InstalledAndroidApplication(MobileDevice androidDevice, String appPackage, String appActivity) throws Exception {

		System.out.println("<<### Device Serial Number: " + androidDevice.getSerialNumber());
		System.out.println("<<### AppPackage :" + appPackage + " AppActivity : " + appActivity);

		if (Context.session()!= null && Context.session().getTool() != null) {
			System.out.println("<<### Appium Driver already Exists, No need to Setup Appium Server");

			if (AppiumContext.isAndroid()) {
				AndroidDriver<WebElement> androidDriver = (AndroidDriver<WebElement>) Finder.findAppiumDriver();
				System.out.println("<<### Appium Driver: " + androidDriver.getClass().getName());
				Activity activity = new Activity(appPackage, appActivity);
				activity.setAppWaitPackage(appPackage);
				androidDriver.startActivity(activity);
				System.out.println("<<### Launched Android App Directly");
				return Result.PASS().setOutput(true).setMessage("Activity Launched").make();
			} 
		}
		System.out.println("<<### Appium Driver Doesn't Exists, Setting up New");

		AppiumDriver<WebElement> wb = null;
		DeviceType deviceType = DeviceType.Android;
		System.out.println("<<### Device Type: " + deviceType);
		AppiumContext.setMobileDevice(androidDevice);
		AppiumContext.setDeviceType(deviceType);
		logger.info("Determining Appium Device Mode: " + deviceType);

		DesiredCapabilities caps = Capabilities.getAndroidcapabilities();
		System.out.println("<<### Setting full desired capabilities.");
		caps.setCapability("deviceName", AppiumContext.getMobileDevice().getDisplayName());
		caps.setCapability("appium:platformName", "Android");
		caps.setCapability("appium:automationName", "UiAutomator2");
		caps.setCapability("appium:platformVersion", androidDevice.getVersion().toString());
		caps.setCapability("appium:appPackage", appPackage);
		caps.setCapability("appium:appActivity", appActivity);

		try {
			wb = this.setUpConnectionWithAppiumServer(deviceType, caps, null);
			System.out.println("<<### wb is: " + wb.getClass().getName());
		} catch (WebDriverException ex) {
			if (ex.getMessage().contains("Connection refused:")) {
				int port = Integer.parseInt(Context.session().getSettings().get("Port"));
				this.launchAppiumServer("127.0.0.1", port);
				wb = this.setUpConnectionWithAppiumServer(deviceType, caps, null);
			}

			String message;
			String currentActivity = null;

			if (AppiumContext.getErrorFromAppiumServer() != null) {
				message = AppiumContext.getErrorFromAppiumServer();
			} else {
				message = ex.getMessage();
			}

			if (message.contains("Activity") && message.contains("never started") && message.contains("Current")) {
				currentActivity = message.substring(message.indexOf("Current: ")).replace("Current: ", "").replace("/.", ".");
				logger.info("###### Current Activity has changed: " + currentActivity);
				caps.setCapability("appWaitActivity", currentActivity);

				// Restarting Appium Server
				Utils.closeAppiumServer();
				AppiumContext.launchAppiumServer(false);
				Thread.sleep(2000);

				wb = this.setUpConnectionWithAppiumServer(deviceType, caps, null);
			} else {
				Utils.closeAppiumServer();
				throw ex;
			}
		}

		// Verifying Android Driver Initialization
		if (wb == null) {
			System.out.println("<<### Appium Driver is not initialized.");
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("Appium Driver is not initialized.").make();
		}

		AndroidDriver<WebElement> androidDriver = (AndroidDriver<WebElement>) wb;
		System.out.println("<<### Appium Driver initialized successfully");
		System.out.println("<<### Launching the application: " + appPackage + " | " + appActivity);

		// Launching the Application
		Activity activity = new Activity(appPackage, appActivity);
		activity.setAppWaitPackage(appPackage);
		androidDriver.startActivity(activity);
		System.out.println("<<### App Launched Successfully By Creating Appium Server");

		androidDriver.setSetting(Setting.WAIT_FOR_IDLE_TIMEOUT, 500);
		allOpenWebDrivers.add(wb);

		return Result.PASS().setOutput(true).setMessage("App Launch By Creating Appium Server").make();
    }

    // Added By Prashant
	public FunctionResult Method_LaunchInstalledIOSApplication(MobileDevice iOSDevice, String BundleID) throws Exception {

		if (Context.session() != null && Context.session().getTool() != null) {
			System.out.println("<<### Appium Driver already Exists, No need to Setup Appium Server");

			if (AppiumContext.isIOS()) {
				AppiumDriver<WebElement> appiumDriver = Finder.findAppiumDriver();
				IOSDriver<WebElement> iosDriver = (IOSDriver<WebElement>) appiumDriver;
				iosDriver.activateApp(BundleID);
				System.out.println("<<### Launched iOS App Directly: " + BundleID);
				return Result.PASS().setOutput(true).setMessage("iOS App Launched Successfully").make();
			}
		}

		System.out.println("<<### Appium Driver Doesn't Exists, Setting up New");

		AppiumDriver<WebElement> wb = null;
		DeviceType deviceType = DeviceType.IPhoneRealDevice;
		AppiumContext.setDeviceType(deviceType);
		System.out.println("<<### Device Type: " + deviceType);
		String iosversion = iOSDevice.getVersion();
		AppiumContext.setMobileDevice(iOSDevice);
		logger.info("Determining Appium Device Mode: " + deviceType);

		if (BundleID == null || BundleID.isEmpty()) {
			System.out.println("<<### ERROR: BundleID is not provided!");
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING)
					.setMessage("BundleID is missing. Cannot launch iOS app.").make();
		}
		System.out.println("<<### BundleID : " + BundleID);
		System.out.println("<<### UDID : " + iOSDevice.getSerialNumber());

		DesiredCapabilities caps = Capabilities.getIphoneCapabilities();
		caps.setCapability("appium:platformVersion", iosversion);
		caps.setCapability("deviceName", AppiumContext.getMobileDevice().getDisplayName());
		caps.setCapability("appium:udid", iOSDevice.getSerialNumber());
		caps.setCapability("appium:automationName", "XCUITest");
		caps.setCapability("appium:bundleId", BundleID);
		caps.setCapability("appium:xcodeConfigFile", "/usr/local/appium.xcconfig");
		caps.setCapability("appium:newCommandTimeout", 3000);
		caps.setCapability("appium:includeSafariInWebviews", true);
		caps.setCapability("appium:realDeviceLogger", "/usr/local/lib/node_modules/deviceconsole/deviceconsole");
		caps.setCapability("appium:wdaLocalPort", Utils.getRandomNumber(1024, 65535));

		int webviewConnectTimeout = 78;
		System.out.println("@Condition: " + (Context.current().getKeywordRemaningSeconds() < 90));
		System.out.println("@Timeout :" + Context.current().getKeywordRemaningSeconds());
		if (Context.current().getKeywordRemaningSeconds() < 90) {
			webviewConnectTimeout = Context.current().getKeywordRemaningSeconds() - 6;
		}
		caps.setCapability("appium:webviewConnectTimeout", webviewConnectTimeout * 1000);

		try {
			wb = this.setUpConnectionWithAppiumServer(DeviceType.IPhoneRealDevice, caps, null);
			if (wb == null) {
				System.out.println("<<### WebDriver returned NULL. No exception thrown, but connection failed.");
				return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false)
						.setMessage("Appium session could not be established, WB is null.").make();
			} else {
				System.out.println("<<### WebDriver initialized: " + wb.getClass().getName());
			}
		} catch (Exception e) {
			System.out.println("<<### Exception while setting up Appium connection: " + e.getMessage());
			e.printStackTrace();
		}

		try {
			// Checking if WebDriver is an instance of IOSDriver before casting
			if (wb instanceof IOSDriver) {
				IOSDriver<WebElement> iosDriver = (IOSDriver<WebElement>) wb;
				System.out.println("<<### Launching iOS app through activateApp: " + BundleID);
				iosDriver.activateApp(BundleID);
			} else {
				System.out.println("<<### wb is NOT an instance of IOSDriver. Attempting executeScript...");

				Map<String, Object> params = new HashMap<>();
				params.put("bundleId", BundleID);
				AppiumDriver<WebElement> appiumDriver = Finder.findAppiumDriver();
				if (appiumDriver != null) {
					((IOSDriver<WebElement>) appiumDriver).executeScript("mobile: launchApp", params);
				} else {
					System.out.println("<<### Appium driver is also null. App launch failed!");
				}
			}
		} catch (Exception e) {
			System.out.println("<<### Exception occurred while launching the iOS app: " + e.getMessage());
			e.printStackTrace();
			return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false)
					.setMessage("Exception occurred while launching the iOS app: " + e.getMessage()).make();
		}

		allOpenWebDrivers.add(wb);
		// set the device on the Iphone
		new FileHosting().StopFileTransferServer();
		return Result.PASS().setOutput(true).setMessage("IPA Launched By Creating Appium Server").make();
	}
    
    private void getExtensionsOptions() {

	ChromeOptions options = new ChromeOptions();

	if (SetCapabilities.getChromeExtensions().size() != 0) {
	    Set<String> set = SetCapabilities.getChromeExtensions();
	    for (Object object : set) {
		try {
		    logger.info("Setting Extension " + object.toString());
		    File file = new File(object.toString());
		    options.addExtensions(file);
		} catch (Exception ex) {
		    logger.warning("Not a valid Chrome Extension <" + object.toString() + ">");
		}
	    }
	} else {
	    options.addArguments("disable-extensions");
	}

    }

    /*
     * 
     * 
     * 
     * 
     * */

    public FunctionResult Method_Launch_iOSApplicationOnSimulator(MobileDevice iosSimulator, String appPath)
	    throws Exception {
	AppiumContext.setMobileDevice(iosSimulator);
	DesiredCapabilities caps = this.getDesiredCapabilities(DeviceType.IPhoneSimulator, null, appPath, "", null,
		null);
	AppiumDriver<WebElement> wb = this.setUpConnectionWithAppiumServer(DeviceType.IPhoneSimulator, caps, null);
	// set the application on iPhone simulator
	AppiumContext.setDeviceType(DeviceType.IPhoneSimulator);
	allOpenWebDrivers.add(wb);
	return Result.PASS().make();
    }

    /*
     * 
     * 
     * 
     * 
     * */

    private boolean isInteger(Object s) {
	try {
	    Integer.parseInt((String) s);
	} catch (NumberFormatException e) {
	    return false;
	} catch (NullPointerException e) {
	    return false;
	}
	// only got here if we didn't return false
	return true;
    }

    public AppiumDriver<WebElement> setUpConnectionWithAppiumServer(DeviceType deviceType, DesiredCapabilities caps,
	    ArrayList<String> addionalServerArgument) throws MalformedURLException, ToolNotSetException, Exception {

	URL fullAppiumEndpoint = null;
	// ---------------------------------------------------------
	// ---------------------------------------------------------
	// ------------------------ PCLOUDY -------------------------
	// ---------------------------------------------------------
	// ---------------------------------------------------------

	if (Context.session().getSettings().containsKey("pCloudy_AppiumCapabilities")) { // ios working fine on pcloudy
											 // but not on local
	    AppiumContext.setPCloudy(true);
	    PCloudyCapabilities pCloudyCapabilities = new PCloudyCapabilities(caps, mobileDevice, mobileApplication);
	    caps = pCloudyCapabilities.getCapabilities();
	    fullAppiumEndpoint = pCloudyCapabilities.getAppiumEndpoint();
	    if (isReset)
		caps.setCapability("appium:fullReset", true);
	    logger.info("Using pCloudy Appium Endpoint:" + fullAppiumEndpoint);
//	    logger.fine("Disabling SNI Extension via setting up environment variable");
//	    System.out.println("Using pCloudy Appium Endpoint:" + fullAppiumEndpoint);
//	    System.out.println("Disabling SNI Extension via setting up environment variable");
//	    System.setProperty("jsse.enableSNIExtension", "false");

	}

	else {

	    // validate Android home path if android home path is not set throw
	    // ADB not found exception

	    System.out.println(
		    "Context.session().getSettings().get(\"Host\"): " + Context.session().getSettings().get("Host"));
	    String appiumServer = Context.session().getSettings().get("Host");

	    System.out.println(
		    " Context.session().getSettings().get(\"Port\"): " + Context.session().getSettings().get("Port"));
	    String appiumPort = Context.session().getSettings().get("Port");

	    if (appiumServer.contentEquals("")) {

		if (deviceType == DeviceType.Android || deviceType == DeviceType.Selendroid)
		    Utils.getAdbPath(); // TODO: Don't check adbPath if Host is Remote

		// ---------------------------------------------------------
		// ---------------------------------------------------------
		// ------------------ Start Appium -------------------------
		// ---------------------------------------------------------
		// ---------------------------------------------------------

		// blank host and port indicates appium run on local machine and
		// when we run on local machine appium appium start
		// automatically

		logger.fine("Fetching the host blank so assuming that execute the appium flow on local machine ");
		appiumServer = "localhost";
		int freePort = findFreePort();
		appiumPort = String.valueOf(freePort);

		logger.fine("start a Appium server using Cli " + appiumServer + " Port" + appiumPort);
		// start a appium server
		this.launchAppiumServer(appiumServer, freePort, addionalServerArgument);

		while (!(AppiumContext.isAppiumServerLaunch())) {
		    logger.fine("Appium Server is not  successfully launch waiting main thread for  1 second  ");
		    Thread.sleep(1000);
		}
		logger.info("Appium Server Started on: http://" + appiumServer + ":" + appiumPort + "/wd/hub");
	    }

	    if (!appiumServer.startsWith("http")) {
		appiumServer = "http://" + appiumServer;
	    }

	    if (appiumPort.contentEquals("")) {

		logger.fine("The appiumserver port-number is blank. Assuming that Appium is already running on :"
			+ appiumServer + " 4723");
		appiumPort = "4723";
	    }

	    // not pCloudy. Should be on local network
	    fullAppiumEndpoint = new URL(appiumServer + ":" + appiumPort + "/wd/hub");
	}

	System.out.println("Calling InnerConnectToAppium");
	// ---------------------------------------------------------

	AppiumDriver<WebElement> wd = _innerConnectToAppium(caps, fullAppiumEndpoint, deviceType);
	this.afterAppimConnection();
	return wd;
	// ---------------------------------------------------------
    }

    public void _ConnectToExitingAppium(String jsonString) throws MalformedURLException, InterruptedException {
	AppiumConnectionStructure struct = (new Gson()).fromJson(jsonString, AppiumConnectionStructure.class);
	AppiumContext.setMobileDevice(struct.mobileDevice);
	logger.fine("checking iphone/ipad in existing appium connection :- "
		+ AppiumContext.getMobileDevice().getDisplayName());
	AppiumContext.setDeviceType(struct.deviceType);
	AppiumDriver<WebElement> wb = _innerConnectToAppium(struct.caps, new URL(struct.fullAppiumEndpoint),
		struct.deviceType);
	allOpenWebDrivers.add(wb);

    }

    private AppiumDriver _innerConnectToAppium(DesiredCapabilities caps, URL fullAppiumEndpoint, DeviceType deviceType)
	    throws InterruptedException {
	// ---------------------------------------------------------
	AppiumDriver<WebElement> wb = null;

	logger.fine("=========== Capabilities =============");
	for (Entry<String, ?> cap : caps.asMap().entrySet()) {
	    System.out.println(cap.getKey() + " : " + cap.getValue());
	}
	logger.fine("======================================");
	// logger.fine(caps.toString());

	logger.info("Trying to connect Appium client on " + fullAppiumEndpoint + " ....");
	System.out.println("Trying to connect Appium client on " + fullAppiumEndpoint + " ....");

	if (deviceType == DeviceType.IPhoneRealDevice || deviceType == DeviceType.IPhoneSimulator) {
	    System.out.println("INSIDE IOS CONNECT");
	    long start = System.currentTimeMillis();
	    try {
		wb = new IOSDriver<WebElement>(fullAppiumEndpoint, caps);
	    } catch (Exception e) {
		String message = e.getMessage();
		System.out.println("##<< ios driver exception message " + message);
	    }

	    System.out.println("Device book And Open In " + (System.currentTimeMillis() - start) / 1000 + " ms");
	    System.out.println("Setting Driver To OpkeyNow");
	} else {
	    Log.print("INSIDE ANDRIOD CONNECT");
	    Log.print("driver Creation started");
	    try {
		wb = new AndroidWebDriver(fullAppiumEndpoint, caps);
	    } catch (org.openqa.selenium.SessionNotCreatedException e) {
		String message = e.getMessage();
		System.out.println("##<< android driver exception message " + message);
		if (message.contains(
			"Starting: Intent { dat=data: cmp=com.android.chrome/com.google.android.apps.chrome.Main }")) {

		}
	    } catch (Exception e) {

	    }

	    Log.print("driver Created");

	}
	// Thread.sleep(30000);

	Context.session().setTool(wb);

	// if we not set the 5 second
	// Then the Appium wait for 60 second using given search
	// paremeter
	// if
	// locator is not exist on page
	// wb.manage().timeouts().implicitlyWait(1,
	// TimeUnit.SECONDS);
	// HashMap<String, Integer> args = new HashMap<String,
	// Integer>();
	// args.put("timeout", 900);
	// (Finder.getJavaScriptExecuterDriver()).executeScript(
	// "mobile: setCommandTimeout", args);

	// Let us create the AppiumConnectionStructure and write it
	// in
	// logs,
	AppiumConnectionStructure struct = new AppiumConnectionStructure();
	struct.caps = caps;
	struct.deviceType = deviceType;
	struct.fullAppiumEndpoint = fullAppiumEndpoint.toString();
	struct.mobileDevice = AppiumContext.getMobileDevice();
	String jSonString = (new Gson()).toJson(struct);
	logger.info("AppiumConnectionStructure:");
	logger.info(jSonString);

	return wb;

    }

    /*
     * 
     * 
     * 
     * 
     * */

    public DesiredCapabilities getDesiredCapabilities(DeviceType deviceType, MobileApplication app, String appPath,
	    String deviceId, String AndroidVersion, String AppiumVersion) {
	// 4 scenerios for androind ,chrome,ios,safari
	DesiredCapabilities globalCaps = null;
	if ((AppiumContext.isBrowserMode() || AppiumContext.getBrowserMode() == BrowserType.chromeOnLocalAndroid
		|| AppiumContext.getBrowserMode() == BrowserType.ChromeOnCloud)
		&& AppiumContext.getDeviceType() == DeviceType.Android) {
	    if (deviceType == DeviceType.Android) { // android hybrid case
		System.out.println("##<< setting capability for Android Chrome ");
		// AndroidVersion version = new
		// AndroidVersion(AppiumContext.getMobileDevice().getVersion());
		DesiredCapabilities capabilities = Capabilities.getAndroidcapabilities();
		capabilities.setCapability("appium:udid", deviceId);
		capabilities.setCapability("appium:deviceName", "Android");
		capabilities.setCapability("appium:automationName", "uiautomator2");
		capabilities.setCapability("appium:uiautomator2ServerLaunchTimeout", 90000);
		capabilities.setCapability("browserName", "Chrome");
		capabilities.setCapability("appium:chromeOptions", ImmutableMap.of("w3c", false));

		System.out.println("##<< Setting  chrome options  ");
		ChromeOptions options = new ChromeOptions();
		options.addArguments("--disable-blink-features=AutomationControlled");
		System.out.println("##<<  Adding chrome blink options ");
		capabilities.setCapability(ChromeOptions.CAPABILITY, options);

		if (Utils.isMyLocalAdress(Context.session().getSettings().get("Host"))) {
		    int freeRandomPort = Utils.findFreePort();
		    capabilities.setCapability("appium:systemPort", freeRandomPort);
		}
		globalCaps = capabilities;
	    }

	}

	else if (deviceType == DeviceType.Android) { // native case
	    System.out.println("##<< setting capability for android ");
	    DesiredCapabilities capabilities = Capabilities.getAndroidcapabilities();
	    if ((app.getWaitForActivity() != null && !app.getWaitForActivity().contentEquals(""))) {
		logger.info("get wait for activity " + app.getWaitForActivity());
		capabilities.setCapability("appium:appWaitActivity", app.getWaitForActivity());
	    }
	    capabilities.setCapability("appium:app", appPath);
	    capabilities.setCapability("appium:app-package", app.getPackage());
	    capabilities.setCapability("appium:appPackage", app.getPackage());
	    capabilities.setCapability("appium:app-activity", app.getMainActivity());
	    capabilities.setCapability("appium:appActivity", app.getMainActivity());
	    capabilities.setCapability("appium:udid", deviceId);
	    capabilities.setCapability("appium:deviceName", deviceType.name());
	    capabilities.setCapability("platformName", deviceType.name());
	    capabilities.setCapability("appium:noSign", true);
	    capabilities.setCapability("appium:automationName", "uiautomator2");
	    capabilities.setCapability("appium:uiautomator2ServerLaunchTimeout", 90000);
	    if (Utils.isMyLocalAdress(Context.session().getSettings().get("Host"))) {
		int freeRandomPort = Utils.findFreePort();
		capabilities.setCapability("appium:systemPort", freeRandomPort);
	    }

	    globalCaps = capabilities;

	}

	else if ((AppiumContext.isBrowserMode() && AppiumContext.getBrowserMode() == BrowserType.SafariOnIos)
		&& (deviceType == DeviceType.IPhoneRealDevice || deviceType == DeviceType.IPhoneSimulator)) {
	    DesiredCapabilities capabilities = Capabilities.getIphoneCapabilities();
	    logger.fine("##<< setting  capabilities for Safari  browser on ios");
	    capabilities.setCapability(CapabilityType.BROWSER_NAME, "Safari");
	    capabilities.setCapability("appium:browser", "safari"); // capabilities.setCapability("app", // "safari");
	    capabilities.setCapability("platformName", AppiumContext.getMobileDevice().getOperatingSystem());
	    capabilities.setCapability("appium:deviceName", AppiumContext.getMobileDevice().getDisplayName());
	    capabilities.setCapability("appium:udid", deviceId);
	    globalCaps = capabilities;

	} else if (deviceType == DeviceType.IPhoneRealDevice || deviceType == DeviceType.IPhoneSimulator) {
	    System.out.println("##<< setting capability for ios ");
	    DesiredCapabilities capabilities = Capabilities.getIphoneCapabilities();
	    AppiumSpecificUnCategorised speci_cat = new AppiumSpecificUnCategorised();
	    String ip = "";
	    if (!Context.session().getSettings().containsKey("pCloudy_AppiumCapabilities")) { // not required for
		String commandOutput = speci_cat.getAdbCommandOutput("ipconfig");
		speci_cat = null;
		ip = getIPAddress(commandOutput);
		Log.print("ip address is " + ip);
		if (!ip.equals("")) {
		    appPath = "http://" + ip.trim() + ":8000" + "/ssts.ipa";
		    appPath = appPath.trim();
		}
	    }
	    capabilities.setCapability("appium:app", appPath);
	    capabilities.setCapability("appium:appPath", appPath);
	    capabilities.setCapability("platformName", AppiumContext.getMobileDevice().getOperatingSystem()); // iOS
	    capabilities.setCapability("appium:deviceName", AppiumContext.getMobileDevice().getDisplayName());
	    capabilities.setCapability("appium:udid", deviceId);
	    globalCaps = capabilities;

	}

	else {
	    Log.print("no one matches");
	}

	logger.fine(" Capabilities Set Sucessfully");
	if (globalCaps != null) {
	    return globalCaps;
	}
	return globalCaps;
    }

    /*
     * 
     * 
     * 
     * 
     * */

    private DeviceType predictDeviceType(MobileDevice device, MobileApplication app) {

	if (device.getOperatingSystem().equalsIgnoreCase("Android")) {
	    AndroidVersion version = new AndroidVersion(device.getVersion());
	    if ((version.getMajor() >= 5) || (version.getMajor() >= 4 && version.getMinor() > 1)) {

		logger.info("Android version is greater 4.1");
		// if android version 5
		// version atleast 4.2
		// for automating Hybrid Apps, with version lesser than v4.4,
		// Selendroid is used
		// only run devicesSelendroid mode Devices
		if (app != null && app.isIsHybrid() && version.getMinor() < 4 && version.getMajor() < 5) {
		    logger.info("Application is Hybrid and Android version is " + version.toString()
			    + " Using SELENDROID Mode.");
		    // version is 4.2 to 4.3
		    return DeviceType.Selendroid;
		} else
		    // version at least 4.4. or grate than 4.4
		    return DeviceType.Android;
	    } else
		return DeviceType.Selendroid;
	}

	else {
	    throw new UnsupportedCommandException(device.getOperatingSystem());
	}
    }

    /*
     * 
     * 
     * 
     * 
     * */

    public FunctionResult Method_closeApplication()
	    throws ToolNotSetException, IOException, AdbNotFoundException, InterruptedException {
	String msg = Browser.util_KillAllDrivers();
	System.out.println(msg);
	return Result.PASS().setOutput(true).make();
    }

    /*
     * 
     * 
     * 
     * 
     * */

    public FunctionResult Method_LaunchSafarOnIos(MobileDevice device, String url)
	    throws MalformedURLException, ToolNotSetException, Exception {
	if (AppiumContext.isAndroid()) {
	    return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID)
		    .setMessage("safari cannot be launched on android device").setOutput(false).make();
	}

	AppiumContext.setMobileDevice(device);
	AppiumContext.setBrowserMode(BrowserType.SafariOnIos);
	DesiredCapabilities caps;
	AppiumDriver<WebElement> wb = null;
	if (Context.session().getSettings().containsKey("pCloudy_AppiumCapabilities")) {
	    int trailLeft = 10;
	    int count = 0;
	    while (trailLeft > 0) {
		try {
		    if (device.getDisplayName().contains("Simulator")) {
			AppiumContext.setDeviceType(DeviceType.IPhoneSimulator);
			caps = this.getDesiredCapabilities(DeviceType.IPhoneSimulator, null, null, null, null, null);
			String iosversion = device.getVersion();
			caps.setCapability("platformVersion", iosversion);
			wb = this.setUpConnectionWithAppiumServer(DeviceType.IPhoneSimulator, caps, null);
			return this.ValidateUrl(wb, url);
		    } else {
			AppiumContext.setDeviceType(DeviceType.IPhoneRealDevice);
			caps = this.getDesiredCapabilities(DeviceType.IPhoneRealDevice, null, null,
				device.getSerialNumber(), null, null);
			wb = this.setUpConnectionWithAppiumServer(DeviceType.IPhoneSimulator, caps, null);
			// Set<String> contextHandles =
			// Finder.findAppiumDriver().getContextHandles();
			/*
			 * String webContext = "WEBVIEW_1"; for (String handle : contextHandles) {
			 * System.out.println("Handle is:- " +handle);
			 * if(handle.toLowerCase().contains("webview")) { webContext = handle;
			 * 
			 * } }
			 */
			// wb.context(webContext);
			wb.manage().timeouts().setScriptTimeout(5, TimeUnit.SECONDS);
			return this.ValidateUrl(wb, url);
		    }
		} catch (Exception ex) {
		    count++;
		    if (wb != null) {
			wb.quit();
			wb = null;
		    }
		    Thread.sleep(1000);
		    System.out.println("Trial " + count + "Fails");
		    ex.printStackTrace();
		}
		trailLeft--;
	    }
	    return this.ValidateUrl(wb, url);
	} else {
	    if (device.getDisplayName().contains("Simulator")) {
		AppiumContext.setDeviceType(DeviceType.IPhoneSimulator);
		caps = this.getDesiredCapabilities(DeviceType.IPhoneSimulator, null, null, null, null, null);
		wb = this.setUpConnectionWithAppiumServer(DeviceType.IPhoneSimulator, caps, null);
	    } else {
		AppiumContext.setDeviceType(DeviceType.IPhoneRealDevice);
		caps = this.getDesiredCapabilities(DeviceType.IPhoneRealDevice, null, null, device.getSerialNumber(),
			null, null);
		wb = this.setUpConnectionWithAppiumServer(DeviceType.IPhoneSimulator, caps, null);
		// Set<String> contextHandles =
		// Finder.findAppiumDriver().getContextHandles();
		/*
		 * String webContext = "WEBVIEW_1"; for (String handle : contextHandles) {
		 * System.out.println("Handle is:- "+handle);
		 * if(handle.toLowerCase().contains("webview")) { webContext = handle;
		 * 
		 * } }
		 */
		// wb.context(webContext);
		wb.manage().timeouts().setScriptTimeout(5, TimeUnit.SECONDS);
	    }

	    return this.ValidateUrl(wb, url);
	}
    }

    /*
     * 
     * 
     * 
     * 
     * */

    private void launchAppiumServer(String address, int port, ArrayList<String> additionalServerArgument)
	    throws Exception {
	logger.fine("Try to start a Appium server using command line ");
	Log.print("Trying to start Appium server....");

	AppiumServerArgument appiumServerArgument = new AppiumServerArgument();
	System.out.println("Founded Appium JS Path: " + appiumServerArgument.getAppiumJSPath());
	AppiumDriverLocalService service = AppiumDriverLocalService.buildService(
		new AppiumServiceBuilder().usingDriverExecutable(new File(appiumServerArgument.getNodePath()))
			.withAppiumJS(new File(appiumServerArgument.getAppiumJSPath())).withIPAddress("127.0.0.1")
			.usingPort(Integer.valueOf(port))
			.withLogFile(new File(new AppiumServerArgument().getAppiumLogFilePath()))
			.withArgument(AndroidServerFlag.CHROME_DRIVER_PORT, findFreePort() + ""));

	AppiumContext.setAppiumDriverLocalService(service);

	service.start();
	service.clearOutPutStreams();
	AppiumContext.launchAppiumServer(true);
	AppiumContext.setAppiumDriverLocalService(service);
	System.out.println("Appium Running Status: " + service.isRunning());
    }

    public void launchAppiumServer(String address, int port) throws Exception {
	this.launchAppiumServer(address, port, null);
    }

    private void validationForAppoumServer(String address, String port)
	    throws NumberFormatException, IOException, AppiumCliValidationFailException {

	// check for Appium.exe is exist and node module is exist
	System.out.println("AppiumServer: " + Context.session().getSettings().get("AppiumServer"));
	String serverPath = Context.session().getSettings().get("AppiumServer");

	if (serverPath.trim().contentEquals("")) {
	    throw new AppiumCliValidationFailException(ReturnMessages.Appium_Exe_Path_Not_Set.toString());
	}

//		if (!serverPath.endsWith("Appium.exe")) {
//			throw new AppiumCliValidationFailException(ReturnMessages.Appium_NODEMODULE_APPIUMEXE_NOTEXIST.toString());
//		}

	String appiumFolderPath = Utils.RemoveLastDirectoryFromPath(serverPath);
	if (new File(appiumFolderPath.concat("\\Appium.exe")).exists()
		&& new File(appiumFolderPath.concat("\\resources\\app\\node_modules")).exists()) {

	    /*
	     * we are not using the Runtime.getRunTime.exce it uses the backend
	     * serverArgument In some system serverArgument is crupt Other soloution is
	     * processBuilder But process builder is not able to fire two command
	     * simultaneously delimetred by | netStat -ano | findstr <port>
	     */

	    ServerSocket socket = null;

	    try {
		socket = new ServerSocket();
		socket.bind(new InetSocketAddress(address, Integer.parseInt(port)));
		socket.close();
	    }

	    catch (java.net.SocketException e) {
		System.out.println("Exception while validationForAppoumServer: " + e.getMessage());
		// e.printStackTrace();
		throw new AppiumCliValidationFailException(ReturnMessages.PORT_IS_ALREADY_USED.toString());
	    }

	}

	else {
	    throw new AppiumCliValidationFailException(ReturnMessages.Appium_NODEMODULE_APPIUMEXE_NOTEXIST.toString());
	}

    }

    private int findFreePort() {
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
	throw new IllegalStateException("Could not find a free TCP/IP port to start Appium Server ");
    }

    // Vaidate Url and Execute
    private FunctionResult ValidateUrl(AppiumDriver<WebElement> driver, String url)
	    throws ToolNotSetException, WebDriverException, IOException, InterruptedException {
	System.out.println("##7");
	Log.print(" Url Is as :: " + url);
	System.out.println(" Url Is as :: " + url);
	String validatedUrl = Utils.validateURL(url);
	System.out.println("Validate Url Is as :: " + validatedUrl);
	if (validatedUrl.trim().equalsIgnoreCase("")) {
	    String message = "Please enter valid url";
	    return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setMessage(message).make();
	}
	logger.fine("Navigate to Url: " + validatedUrl);
	// set the page load timeout as well as page load TimeOut with opkey
	// TimeOut

	System.out.println("driver: " + driver);
	System.out.println("validatedUrl: " + validatedUrl);
	driver.navigate().to(validatedUrl);
	Utils.setPageLoadAndScriptTimeout(Context.current().getCallTimeoutInMillis());
	allOpenWebDrivers.add(driver);
	Context.session().setTool(driver);
	return Result.PASS().make();
    }

    private void afterAppimConnection() throws IOException, ConnectError, InterruptedException, ToolNotSetException {
	new AfterAppiumConnection().run();
    }

    public FunctionResult Method_closeApplication(String BundleId) throws Exception {
	System.out.println("BundleId " + BundleId);
	try {
	    Finder.findAppiumDriver().terminateApp(BundleId); // for ios to hide app in background

	} catch (Exception e) {
	    System.out.println("exception error messsage " + e.getMessage());
	    e.printStackTrace();
	}

	return Result.PASS().make();
    }

    public String getAccurateAndroidVerion(String version) {
	if (version.startsWith("0")) {
	    version = version.substring(1, version.length());
	}
	if (version.contains(".")) {
	    version = version.substring(0, version.indexOf(".")).trim();
	    System.out.println("version " + version);

	}

	return version;
    }

    public String getIPAddress(String commandOutput) {
	String ipv4 = "";

	if (commandOutput.contains("IPv6 Address")) {

	    commandOutput = commandOutput.substring(commandOutput.lastIndexOf("IPv6 Address"),
		    commandOutput.lastIndexOf("Default Gateway"));
	    String[] newString = commandOutput.split("\n");
	    for (String str : newString) {
		if (str.contains("IPv4 Address. . . . . . . . . . . :")) {

		    ipv4 = str;
		    break;
		}
	    }
	    ipv4 = ipv4.replace("IPv4 Address. . . . . . . . . . . :", "");

	}

	// below approach is connection name dependent. since connection name appears
	// multiple times in different formats this will get messy
//		if (commandOutput.contains("Wireless LAN adapter Wi-Fi")) {
//
//			commandOutput = commandOutput.substring(commandOutput.lastIndexOf("Wireless LAN adapter Wi-Fi"),
//					commandOutput.lastIndexOf("Default Gateway"));
//			String[] newString = commandOutput.split("\n");
//			for (String str : newString) {
//				if (str.contains("IPv4 Address. . . . . . . . . . . :")) {
//
//					ipv4 = str;
//					break;
//				}
//			}
//			ipv4 = ipv4.replace("IPv4 Address. . . . . . . . . . . :", "");
//
//		}
//
//		else if (commandOutput.contains("Ethernet adapter Ethernet")) {
//
//			commandOutput = commandOutput.substring(commandOutput.lastIndexOf("Ethernet adapter Ethernet"),
//					commandOutput.lastIndexOf("Default Gateway")); // for LAN adapter
//			String[] newString = commandOutput.split("\n");
//			for (String str : newString) {
//				if (str.contains("IPv4 Address. . . . . . . . . . . :")) {
//
//					ipv4 = str;
//					break;
//				}
//			}
//			ipv4 = ipv4.replace("IPv4 Address. . . . . . . . . . . :", "");
//
//		}
//			
//		else {
//
//			commandOutput = commandOutput.substring(commandOutput.lastIndexOf("Wireless LAN adapter"),
//					commandOutput.lastIndexOf("Default Gateway"));
//			String[] newString = commandOutput.split("\n");
//			for (String str : newString) {
//				if (str.contains("IPv4 Address. . . . . . . . . . . :")) {
//
//					ipv4 = str;
//					break;
//				}
//			}
//			ipv4 = ipv4.replace("IPv4 Address. . . . . . . . . . . :", "");
//
//		}
//			
	return ipv4;
    }

}
