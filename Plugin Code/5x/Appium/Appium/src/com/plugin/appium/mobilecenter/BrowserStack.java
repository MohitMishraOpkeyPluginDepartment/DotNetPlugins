package com.plugin.appium.mobilecenter;

import java.io.IOException;
import java.net.URL;
import java.util.HashMap;

import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.DesiredCapabilities;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functioncall.MobileDevice;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.AppiumSpecificKeyword.Connect2AppiumServer;

import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;

public class BrowserStack implements KeywordLibrary {
	public FunctionResult Method_LaunchBrowserStack(String platformName, String deviceName, String platformVersion,
			String appUrl, String URL, String userName, String accessKeys, Boolean unicodeKeyboard)
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

		// https://hub-cloud.browserstack.com
		System.out.println("##<< Basic Capabilities");

		System.out.println("platformName is: " + platformName);
		System.out.println("deviceName is: " + deviceName);
		System.out.println("platformVersion is: " + platformVersion);
		System.out.println("applicationUrl is: " + appUrl);
		System.out.println("##<< Browserstack Capabilities ");

		System.out.println("URL is: " + URL);
		System.out.println("Username is: " + userName);
		System.out.println("accessKeys is: " + accessKeys);

		if (platformName == null) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false)
					.setMessage("Capability Not Provided platformName").make();
		}
		if (deviceName == null) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false)
					.setMessage("Capability Not Provided deviceName").make();
		}

		if (platformVersion == null) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false)
					.setMessage("Capability Not Provided platformVersion").make();
		}
		if (appUrl == null) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false)
					.setMessage("Capability Not Provided applicationName").make();
		}
		if (URL == null) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false)
					.setMessage("Capability Not Provided URL").make();
		}
		if (userName == null) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false)
					.setMessage("Capability Not Provided userName").make();
		}

		if (accessKeys == null) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false)
					.setMessage("Capability Not Provided accessKeys").make();
		}

		if (platformName.equalsIgnoreCase("Android")) {
			System.out.println("##<< Launching Android Driver");
			MobileDevice mobileDevice = new MobileDevice();
			mobileDevice.setDisplayName("Android");
			DesiredCapabilities caps = new DesiredCapabilities();
			HashMap<String, Object> browserstackOptions = new HashMap<String, Object>();
			browserstackOptions.put("userName", userName);
			browserstackOptions.put("accessKey", accessKeys);

			caps.setCapability("platformName", platformName);
			caps.setCapability("appium:app", appUrl); // The filename of the mobile app
			caps.setCapability("appium:deviceName", deviceName);
			caps.setCapability("appium:platformVersion", platformVersion);
			caps.setCapability("appium:automationName", "UiAutomator2");
			caps.setCapability("browserstack.idleTimeout", 300);
			caps.setCapability("appium:newCommandTimeout", 0);
			caps.setCapability("appium:launchTimeout", 150000);
			caps.setCapability("appium:unicodeKeyboard", unicodeKeyboard);

			caps.setCapability("bstack:options", browserstackOptions);

			AndroidDriver<WebElement> wd = null;
			Thread.sleep(2000);
			try {
				wd = new AndroidDriver(new URL(URL + "/wd/hub"), caps);
			} catch (Exception e) {
				e.printStackTrace();
				return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false).setMessage(e.getMessage())
						.make();

			}
			if (wd != null) {
				System.out.println("android driver created ");
				Thread.sleep(5000);
				Context.session().setTool(wd);
				// AppiumContext.setBrowserMode(BrowserType.chromeOnLocalAndroid);
				AppiumContext.setDeviceType(DeviceType.Android);
				AppiumContext.setMobileDevice(mobileDevice);
				Connect2AppiumServer.allOpenWebDrivers.add(wd);
				return Result.PASS().setOutput(true).setMessage("Android Connection Made Successfuly").make();
			}

		} else {

			System.out.println("Launching Ios Driver");
			MobileDevice mobileDevice = new MobileDevice();
			mobileDevice.setDisplayName("iOS");
			DesiredCapabilities caps = new DesiredCapabilities();
			HashMap<String, Object> browserstackOptions = new HashMap<String, Object>();
			browserstackOptions.put("userName", userName);
			browserstackOptions.put("accessKey", accessKeys);

			caps.setCapability("platformName", platformName);
			caps.setCapability("appium:app", appUrl); // The filename of the mobile app
			caps.setCapability("appium:deviceName", deviceName);
			caps.setCapability("appium:platformVersion", platformVersion);
			caps.setCapability("appium:automationName", "XCUITest");
			caps.setCapability("browserstack.idleTimeout", 300);
			caps.setCapability("appium:newCommandTimeout", 0);
			caps.setCapability("appium:launchTimeout", 150000);
			caps.setCapability("bstack:options", browserstackOptions);

			IOSDriver<WebElement> wd = null;
			Thread.sleep(2000);

			try {
				wd = new IOSDriver<WebElement>(new URL(URL + "/wd/hub"), caps);
			} catch (Exception e) {
				e.printStackTrace();
				return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false)
						.setMessage("Connection Failure").make();

			}
			if (wd != null) {
				System.out.println("ios driver created ");
				Thread.sleep(5000);
				Context.session().setTool(wd);
				// AppiumContext.setBrowserMode(BrowserType.chromeOnLocalAndroid);
				AppiumContext.setDeviceType(DeviceType.IPhoneRealDevice);
				AppiumContext.setMobileDevice(mobileDevice);
				Connect2AppiumServer.allOpenWebDrivers.add(wd);
				return Result.PASS().setOutput(true).setMessage("IOS Connection Made Successfuly").make();
			}

		}

		return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false)
				.setMessage("Finally Connection Failure").make();

	}
}
