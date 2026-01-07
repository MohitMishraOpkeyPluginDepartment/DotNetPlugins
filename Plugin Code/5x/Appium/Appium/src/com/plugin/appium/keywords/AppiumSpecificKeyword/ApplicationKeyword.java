package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.communication.contracts.functioncall.MobileDevice;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.Finder;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.context.PCloudyContext;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.util.FileHosting;
import com.ssts.pcloudy.exception.ConnectError;
import com.ssts.pcloudy.Connector;
import com.ssts.pcloudy.dto.file.PDriveFileDTO;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.Activity;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;

public class ApplicationKeyword implements KeywordLibrary{	
	
	@Deprecated
	public FunctionResult Method_LaunchInstalledApplication(String appPackageOrBundleId, String appActivity) throws ToolNotSetException {
		if(AppiumContext.isAndroid()) {
			launchInstalledAndroidApplication(appPackageOrBundleId, appActivity);
		}else if(AppiumContext.isIOS()) {
			launchInstalledIOSApplication(appPackageOrBundleId);
		}
		return Result.PASS().setOutput(true).make();
	}
	
	public FunctionResult Method_LaunchInstalledAndroidApp(MobileDevice androidDevice, String appPackage, String appActivity) throws Exception {
		//launchInstalledAndroidApplication(appPackage, appActivity);
		Connect2AppiumServer connect2AppiumServer = new Connect2AppiumServer();
		FunctionResult fr = connect2AppiumServer.Method_Launch_InstalledAndroidApplication(androidDevice, appPackage, appActivity);
		return fr;
	}
	
	public FunctionResult Method_LaunchInstalledIOSApp(MobileDevice iOSDevice, String bundleId) throws Exception {
		//launchInstalledIOSApplication(bundleId);
		Connect2AppiumServer connect2AppiumServer = new Connect2AppiumServer();
		FunctionResult fr = connect2AppiumServer.Method_LaunchInstalledIOSApplication(iOSDevice, bundleId);
		return fr;
	}
	
	public FunctionResult Method_RemoveApplication(String appPackageOrBundleId) throws ToolNotSetException {
		if(AppiumContext.isAndroid()) {
			removeAndroidApp(appPackageOrBundleId);
		}else if(AppiumContext.isIOS()) {
			removeiOSApp(appPackageOrBundleId);
		}else {
			return Result.FAIL().setMessage("Unable to detect os type").setOutput(false).make();
		}
		return Result.PASS().setOutput(true).make();
	}
	
	public FunctionResult Method_InstallAppOnLocal(String appPath) throws ToolNotSetException, IOException {
		if(AppiumContext.isAndroid()) {
			installAppOnLocalAndroid(appPath);
		}else if(AppiumContext.isIOS() && (isAttachmentPath(appPath) || isLocalFilePath(appPath))) {
			installAppOnRemoteIOS(appPath);
		}else if(AppiumContext.isIOS()) {
			installAppOnLocalIOS(appPath);
		}
		else {
			return Result.FAIL().setMessage("Unable to detect os type").setOutput(false).make();
		}
		return Result.PASS().setOutput(true).make();
	}
	
	private void launchInstalledAndroidApplication(String appPackage, String appActivity) throws ToolNotSetException {
		AppiumDriver<WebElement> appiumDriver = Finder.findAppiumDriver();
		Activity activity = new Activity(appPackage, appActivity);
		activity.setAppWaitPackage(appPackage);
		((AndroidDriver<WebElement>)appiumDriver).startActivity(activity);
	}
	
	private void launchInstalledIOSApplication(String bundleId) throws ToolNotSetException {
		Map<String, Object> params = new HashMap<>();
		params.put("bundleId", bundleId);
		
		AppiumDriver<WebElement> appiumDriver = Finder.findAppiumDriver();
		((IOSDriver<WebElement>)appiumDriver).executeScript("mobile: launchApp", params);
	}

	private void removeAndroidApp(String appPackage) throws ToolNotSetException {
		AppiumDriver<WebElement> appiumDriver = Finder.findAppiumDriver();
		((AndroidDriver<WebElement>)appiumDriver).removeApp(appPackage);
	}
	
	private void removeiOSApp(String bundleId) throws ToolNotSetException {
		Map<String, Object> params = new HashMap<>();
		params.put("bundleId", bundleId);
		
		AppiumDriver<WebElement> appiumDriver = Finder.findAppiumDriver();
		((IOSDriver<WebElement>)appiumDriver).executeScript("mobile: removeApp", params);
	}
	
	
	private void installAppOnLocalAndroid(String appPath) throws ToolNotSetException {
		
		AppiumDriver<WebElement> appiumDriver = Finder.findAppiumDriver();
		((AndroidDriver<WebElement>)appiumDriver).installApp(appPath);
	}
	
	private void installAppOnLocalIOS(String appPath) throws ToolNotSetException {
		AppiumDriver<WebElement> appiumDriver = Finder.findAppiumDriver();
		((IOSDriver<WebElement>)appiumDriver).installApp(appPath);
	}
	
	private void installAppOnRemoteIOS(String appPath) throws ToolNotSetException, IOException {
		FileHosting fileHosting = new FileHosting();
		String appUrl = fileHosting.StartFileTransferServer(appPath);
		AppiumDriver<WebElement> appiumDriver = Finder.findAppiumDriver();
		((IOSDriver<WebElement>)appiumDriver).installApp(appUrl);
		fileHosting.StopFileTransferServer();
	}
	
	private boolean isAttachmentPath(String appPath) {
		String sessionId = Context.session().getSettings().get("_SessionID_");
		if(appPath.contains(sessionId))
			return true;
		else
			return false;
	}
	
	private boolean isLocalFilePath(String appPath) {
		File file = new File(appPath);
		if(file.exists())
			return true;
		else 
			return false;
	}
	
	private void installAppOnpCloudy(String appPathOrName) throws ConnectError, IOException {
		
		PCloudyContext pCloudyContext = AppiumContext.getPCloudyContext();
		String apiEndpoint = pCloudyContext.getEndpoint();
		String authToken = pCloudyContext.getAuthToken();
		int rId = pCloudyContext.getRID();
		
		Connector conn = new Connector(apiEndpoint);
		PDriveFileDTO pCloudyApp = conn.getAvailableAppIfUploaded(authToken, appPathOrName);
		
		if(isLocalFilePath(appPathOrName)) {
			// upload the file and get the appPath
		}else {
			// get the app path
		}
	}
	
	private boolean isAppInstalled(String appPackageOrBundleId) throws ToolNotSetException {
		return Finder.findAppiumDriver().isAppInstalled(appPackageOrBundleId);
	}
}

