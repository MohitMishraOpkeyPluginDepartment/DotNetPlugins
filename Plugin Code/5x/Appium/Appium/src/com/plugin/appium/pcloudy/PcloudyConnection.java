package com.plugin.appium.pcloudy;

import java.net.URL;
import java.util.HashMap;
import java.util.Map.Entry;
import org.openqa.selenium.remote.DesiredCapabilities;
import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.BrowserType;
import com.plugin.appium.enums.DeviceType;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;

public class PcloudyConnection implements KeywordLibrary {

  	
	public FunctionResult Method_LaunchAndroidApplicationOnPcloudyDevice(String pCloudy_Username, String pCloudy_ApiKey, String appName, String appPackage, String appActivity, String platformVersion,
			String deviceName ) {
		
		
		if (pCloudy_Username == null || pCloudy_Username.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("username cannot be empty ")
					.setOutput(false).make();
		}

		if (pCloudy_ApiKey == null || pCloudy_ApiKey.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("apis keys cannot be empty ")
					.setOutput(false).make();
		}

		if (appName == null || appName.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("appName cannot be empty ")
					.setOutput(false).make();
		}
		
		if (appPackage == null || appPackage.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("appPackage cannot be empty ")
					.setOutput(false).make();
		}
		
		if (appActivity == null || appActivity.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("appActivity cannot be empty ")
					.setOutput(false).make();
		}
		

		if (platformVersion == null || platformVersion.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("platformVersion cannot be empty ")
					.setOutput(false).make();
		}

		if (deviceName == null || deviceName.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("deviceName1 cannot be empty ")
					.setOutput(false).make();
		}
		
		AppiumContext.setDeviceType(DeviceType.Android);
		AppiumContext.setPCloudy(true);
		
		AppiumDriver wb = null;
		DesiredCapabilities capabilities = new DesiredCapabilities();
		capabilities.setCapability("appium:adbExecTimeout", 90000);
		capabilities.setCapability("appium:launchTimeout", 90000);
		capabilities.setCapability("appium:platformVersion",platformVersion );
		capabilities.setCapability("appium:platformName", "Android");
		capabilities.setCapability("appium:automationName", "UiAutomator2");
		capabilities.setCapability("appium:uiautomator2ServerLaunchTimeout", 60000);
		capabilities.setCapability("appium:appPackage", appPackage);
		capabilities.setCapability("appium:appActivity", appActivity);
		HashMap<String, Object> pcloudyOptions = new HashMap<String, Object>();
		pcloudyOptions.put("pCloudy_ApplicationName", appName);
		pcloudyOptions.put("pCloudy_DurationInMinutes", 720);
		pcloudyOptions.put("pCloudy_Username", pCloudy_Username);
		pcloudyOptions.put("pCloudy_ApiKey", pCloudy_ApiKey);
		pcloudyOptions.put("pCloudy_DeviceFullName", deviceName);
		pcloudyOptions.put("pCloudy_WildNet", false);
		pcloudyOptions.put("pCloudy_EnableVideo", false);
		pcloudyOptions.put("pCloudy_EnablePerformanceData", false);
		pcloudyOptions.put("pCloudy_EnableDeviceLogs", false);
		pcloudyOptions.put("appiumVersion", "2.0.0");
		capabilities.setCapability("pcloudy:options", pcloudyOptions);
		System.out.println("Starting new android session  with given capabilities ");
		for (Entry<String, ?> cap : capabilities.asMap().entrySet()) {
		    System.out.println(cap.getKey() + " : " + cap.getValue());
		}
		try {
		wb = new AndroidDriver(new URL("https://device.pcloudy.com/appiumcloud/wd/hub"), capabilities);
		}  catch (org.openqa.selenium.SessionNotCreatedException e) {
			String message = e.getMessage();
			System.out.println("##<< android driver exception message " + message);
			return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setMessage(" SessionNotCreatedException :: "+message).setOutput(false).make();
			
		} catch (Exception e) {
			  e.printStackTrace();
			return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setMessage(" SessionNotCreatedException :: "+e.getMessage()).setOutput(false).make();
         
		}
		
		if(wb!=null) {
			Context.session().setTool(wb);
			return Result.PASS().setOutput(true).setMessage("driver created successfully").make();
		}
		
		return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setMessage(" SessionNotCreatedException :: ").setOutput(false).make();

		
		
		
		
		
	
	}
	
	public FunctionResult Method_LaunchChromeOnPcloudyDevice(String pCloudy_Username,String pCloudy_ApiKey,String platformVersion ,
			String deviceName ,String url) {
		
		
		if (pCloudy_Username == null || pCloudy_Username.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("username cannot be empty ")
					.setOutput(false).make();
		}

		if (pCloudy_ApiKey == null || pCloudy_ApiKey.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("apis keys cannot be empty ")
					.setOutput(false).make();
		}


		if (platformVersion == null || platformVersion.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("platformVersion cannot be empty ")
					.setOutput(false).make();
		}

		if (deviceName == null || deviceName.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("deviceName cannot be empty ")
					.setOutput(false).make();
		}
		if (url == null || url.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("url cannot be empty ")
					.setOutput(false).make();
		}
		
		AppiumContext.setDeviceType(DeviceType.Android);
		AppiumContext.setPCloudy(true);
		AppiumContext.setBrowserMode(BrowserType.chromeOnLocalAndroid);
		
		
		AppiumDriver wb = null;
		DesiredCapabilities capabilities = new DesiredCapabilities();
		
		capabilities.setCapability("browserName", "Chrome");
		capabilities.setCapability("appium:newCommandTimeout", 600);
		capabilities.setCapability("appim:adbExecTimeout", 90000);
		capabilities.setCapability("appium:launchTimeout", 90000);
		capabilities.setCapability("appium:platformVersion",platformVersion );
		capabilities.setCapability("appium:platformName", "Android");
		capabilities.setCapability("appium:automationName", "UiAutomator2");
		capabilities.setCapability("appium:uiautomator2ServerLaunchTimeout", 60000);
		
		
		
		HashMap<String, Object> pcloudyOptions = new HashMap<String, Object>();
		
		pcloudyOptions.put("pCloudy_DurationInMinutes", 720);
		pcloudyOptions.put("pCloudy_Username", pCloudy_Username);
		pcloudyOptions.put("pCloudy_ApiKey", pCloudy_ApiKey);
		pcloudyOptions.put("pCloudy_DeviceFullName", deviceName);
		pcloudyOptions.put("pCloudy_WildNet", false);
		pcloudyOptions.put("pCloudy_EnableVideo", false);
		pcloudyOptions.put("pCloudy_EnablePerformanceData", false);
		pcloudyOptions.put("pCloudy_EnableDeviceLogs", false);
		pcloudyOptions.put("appiumVersion", "2.0.0");
		capabilities.setCapability("pcloudy:options", pcloudyOptions);
		
		System.out.println("Starting new android session  with given capabilities ");
		
		for (Entry<String, ?> cap : capabilities.asMap().entrySet()) {
		    System.out.println(cap.getKey() + " : " + cap.getValue());
		}
		
	
		try {

			wb = new AndroidDriver(new URL("https://device.pcloudy.com/appiumcloud/wd/hub"), capabilities);
		} catch (org.openqa.selenium.SessionNotCreatedException e) {
			String message = e.getMessage();
			System.out.println("##<< android driver exception message " + message);
			return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setMessage(" SessionNotCreatedException :: "+message).setOutput(false).make();
			
		} catch (Exception e) {
			  e.printStackTrace();
			return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setMessage(" SessionNotCreatedException :: "+e.getMessage()).setOutput(false).make();
         
		}
		
		if(wb!=null) {
			wb.get(url);
			Context.session().setTool(wb);
			return Result.PASS().setOutput(true).setMessage("Chrome Launched successfully").make();
		}
		
		return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setMessage(" SessionNotCreatedException :: ").setOutput(false).make();

	}
	
	public FunctionResult Method_LaunchSafariOnPcloudyDevice(String pCloudy_Username,String pCloudy_ApiKey,String platformVersion ,
			String deviceName ,String url) {
		
		
		if (pCloudy_Username == null || pCloudy_Username.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("username cannot be empty ")
					.setOutput(false).make();
		}

		if (pCloudy_ApiKey == null || pCloudy_ApiKey.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("apis keys cannot be empty ")
					.setOutput(false).make();
		}


		if (platformVersion == null || platformVersion.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("platformVersion cannot be empty ")
					.setOutput(false).make();
		}

		if (deviceName == null || deviceName.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("deviceName cannot be empty ")
					.setOutput(false).make();
		}
		if (url == null || url.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("url cannot be empty ")
					.setOutput(false).make();
		}
		
		AppiumContext.setDeviceType(DeviceType.IPhoneRealDevice);
		AppiumContext.setPCloudy(true);
		AppiumContext.setBrowserMode(BrowserType.SafariOnIos);
		
		
		AppiumDriver wb = null;
		DesiredCapabilities capabilities = new DesiredCapabilities();
		
		capabilities.setCapability("browserName", "Safari");
		capabilities.setCapability("appium:newCommandTimeout", 600);
		capabilities.setCapability("appim:adbExecTimeout", 90000);
		capabilities.setCapability("appium:launchTimeout", 90000);
		capabilities.setCapability("appium:platformVersion",platformVersion );
		capabilities.setCapability("appium:acceptAlerts", true);
		capabilities.setCapability("appium:platformName", "iOS");
		capabilities.setCapability("appium:automationName", "XCUITest");
		
		
		
		HashMap<String, Object> pcloudyOptions = new HashMap<String, Object>();
		
		pcloudyOptions.put("pCloudy_DurationInMinutes", 720);
		pcloudyOptions.put("pCloudy_Username", pCloudy_Username);
		pcloudyOptions.put("pCloudy_ApiKey", pCloudy_ApiKey);
		pcloudyOptions.put("pCloudy_DeviceFullName", deviceName);
		pcloudyOptions.put("pCloudy_WildNet", false);
		pcloudyOptions.put("pCloudy_EnableVideo", false);
		pcloudyOptions.put("pCloudy_EnablePerformanceData", false);
		pcloudyOptions.put("pCloudy_EnableDeviceLogs", false);
		pcloudyOptions.put("appiumVersion", "2.0.0");
		capabilities.setCapability("pcloudy:options", pcloudyOptions);
		
		System.out.println("Starting new ios session  with given capabilities ");
		
		for (Entry<String, ?> cap : capabilities.asMap().entrySet()) {
		    System.out.println(cap.getKey() + " : " + cap.getValue());
		}
		
	
		try {

			wb = new IOSDriver(new URL("https://device.pcloudy.com/appiumcloud/wd/hub"), capabilities);
		} catch (org.openqa.selenium.SessionNotCreatedException e) {
			String message = e.getMessage();
			System.out.println("##<< android driver exception message " + message);
			return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setMessage(" SessionNotCreatedException :: "+message).setOutput(false).make();
			
		} catch (Exception e) {
			  e.printStackTrace();
			return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setMessage(" SessionNotCreatedException :: "+e.getMessage()).setOutput(false).make();
         
		}
		
		if(wb!=null) {
			wb.get(url);
			Context.session().setTool(wb);
			return Result.PASS().setOutput(true).setMessage("Safari Launched successfully").make();
		}
		
		return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setMessage(" SessionNotCreatedException :: ").setOutput(false).make();

		
		
		
		
		
	
	}
	
	public FunctionResult Method_LaunchIosApplicationOnPcloudyDevice(String pCloudy_Username,String pCloudy_ApiKey,String appName,String bundleId, String platformVersion ,
			String deviceName ) {
		
		
		if (pCloudy_Username == null || pCloudy_Username.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("username cannot be empty ")
					.setOutput(false).make();
		}

		if (pCloudy_ApiKey == null || pCloudy_ApiKey.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("apis keys cannot be empty ")
					.setOutput(false).make();
		}

		if (appName == null || appName.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("appName cannot be empty ")
					.setOutput(false).make();
		}
		
		if (bundleId == null || bundleId.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("bundleId cannot be empty ")
					.setOutput(false).make();
		}


		if (platformVersion == null || platformVersion.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("platformVersion cannot be empty ")
					.setOutput(false).make();
		}

		if (deviceName == null || deviceName.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setMessage("deviceName cannot be empty ")
					.setOutput(false).make();
		}
		
		AppiumContext.setDeviceType(DeviceType.IPhoneRealDevice);
		AppiumContext.setPCloudy(true);
		
		AppiumDriver wb = null;
		DesiredCapabilities capabilities = new DesiredCapabilities();
		capabilities.setCapability("appium:trust", false);
		capabilities.setCapability("appium:newCommandTimeout", 600);
		capabilities.setCapability("appium:launchTimeout", 90000);
		capabilities.setCapability("appium:platformVersion",platformVersion );
		capabilities.setCapability("appium:platformName", "iOS");
		capabilities.setCapability("appium:acceptAlerts", true);
		capabilities.setCapability("appium:automationName", "XCUITest");
		capabilities.setCapability("appium:bundleId",bundleId );
		
		HashMap<String, Object> pcloudyOptions = new HashMap<String, Object>();
		pcloudyOptions.put("pCloudy_ApplicationName", appName);	
		pcloudyOptions.put("pCloudy_DurationInMinutes", 720);
		pcloudyOptions.put("pCloudy_Username", pCloudy_Username);
		pcloudyOptions.put("pCloudy_ApiKey", pCloudy_ApiKey);
		pcloudyOptions.put("pCloudy_DeviceFullName", deviceName);
		pcloudyOptions.put("pCloudy_WildNet", false);
		pcloudyOptions.put("pCloudy_EnableVideo", false);
		pcloudyOptions.put("pCloudy_EnablePerformanceData", false);
		pcloudyOptions.put("pCloudy_EnableDeviceLogs", false);
		pcloudyOptions.put("appiumVersion", "2.0.0");
		capabilities.setCapability("pcloudy:options", pcloudyOptions);
		
		System.out.println("Starting new ios session  with given capabilities ");
		
		for (Entry<String, ?> cap : capabilities.asMap().entrySet()) {
		    System.out.println(cap.getKey() + " : " + cap.getValue());
		}
		
	
		try {

			wb = new IOSDriver(new URL("https://device.pcloudy.com/appiumcloud/wd/hub"), capabilities);
		} catch (org.openqa.selenium.SessionNotCreatedException e) {
			String message = e.getMessage();
			System.out.println("##<< android driver exception message " + message);
			return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setMessage(" SessionNotCreatedException :: "+message).setOutput(false).make();
			
		} catch (Exception e) {
			  e.printStackTrace();
			return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setMessage(" SessionNotCreatedException :: "+e.getMessage()).setOutput(false).make();
         
		}
		
		if(wb!=null) {
			Context.session().setTool(wb);
			return Result.PASS().setOutput(true).setMessage("ios driver created successfully").make();
		}
		
		return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setMessage(" SessionNotCreatedException :: ").setOutput(false).make();


	}
	
	


	
	

}
