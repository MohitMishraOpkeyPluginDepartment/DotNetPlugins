package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.io.IOException;
import java.net.URL;

import org.openqa.selenium.MutableCapabilities;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;

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

import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;

public class SauceLab implements KeywordLibrary {

	public FunctionResult Method_LaunchSauceLab(String deviceName, String platformVersion, String URL, String name,
			String build, String platformName, String applicationName)
			throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
			ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

		System.out.println("deviceName is: " + deviceName);
		System.out.println("platformVersion is: " + platformVersion);
		System.out.println("applicationName is: " + applicationName);
		System.out.println("platformName is: " + platformName);
		System.out.println("Build is: " + build);
		System.out.println("Name is: " + name);
		System.out.println("URL is: " + URL);

		if (deviceName == null) {
			// deviceName = "Android GoogleAPI Emulator";

			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false)
					.setMessage("Capability Not Provided deviceName").make();
		}
		if (platformVersion == null) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false)
					.setMessage("Capability Not Provided platformVersion").make();
		}
		if (applicationName == null) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false)
					.setMessage("Capability Not Provided applicationName").make();
		}
		if (platformName == null) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false)
					.setMessage("Capability Not Provided platformName").make();
		}
		if (build == null) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false)
					.setMessage("Capability Not Provided build").make();
		}
		if (name == null) {
			name = "Test";
		}
		if (URL == null) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false)
					.setMessage("Capability Not Provided URL").make();
		}

		if (platformName.equalsIgnoreCase("Android")) {
			System.out.println("Launching Android Driver");
			MobileDevice mobileDevice = new MobileDevice();
			mobileDevice.setDisplayName("Android");
			MutableCapabilities caps = new MutableCapabilities();
			caps.setCapability("platformName", platformName);
			caps.setCapability("appium:app", applicationName); // The filename of the mobile app
			caps.setCapability("appium:deviceName", deviceName);
			caps.setCapability("appium:platformVersion", platformVersion);
			caps.setCapability("appium:automationName", "UiAutomator2");
			caps.setCapability("appium:newCommandTimeout", 3000);
			caps.setCapability("appium:launchTimeout", 150000);
			MutableCapabilities sauceOptions = new MutableCapabilities();
			sauceOptions.setCapability("build", build);
			sauceOptions.setCapability("name", name);
			sauceOptions.setCapability("deviceOrientation", "PORTRAIT");
			caps.setCapability("sauce:options", sauceOptions);

			AndroidDriver<WebElement> wd = null;
			Thread.sleep(5000);
			try {
				wd = new AndroidDriver<WebElement>(new URL(URL), caps);
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
			MutableCapabilities caps = new MutableCapabilities();
			caps.setCapability("platformName", platformName);
			caps.setCapability("appium:app", applicationName); // The filename of the mobile app
			caps.setCapability("appium:deviceName", deviceName);
			caps.setCapability("appium:platformVersion", platformVersion);
			caps.setCapability("appium:automationName", "XCUITest");
			caps.setCapability("appium:newCommandTimeout", 3000);
			caps.setCapability("appium:launchTimeout", 150000);
			MutableCapabilities sauceOptions = new MutableCapabilities();
			sauceOptions.setCapability("build", build);
			sauceOptions.setCapability("name", name);
			sauceOptions.setCapability("deviceOrientation", "PORTRAIT");
			caps.setCapability("sauce:options", sauceOptions);

			IOSDriver<WebElement> wd = null;
			Thread.sleep(5000);

			try {
				wd = new IOSDriver<WebElement>(new URL(URL), caps);
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
