package com.plugin.appium.context;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.JavascriptExecutor;

import com.crestech.opkey.plugin.communication.contracts.functioncall.MobileApplication;
import com.crestech.opkey.plugin.communication.contracts.functioncall.MobileDevice;
import com.plugin.appium.Finder;
import com.plugin.appium.enums.BrowserType;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.enums.DriverWindow;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

import io.appium.java_client.service.local.AppiumDriverLocalService;

public class AppiumContext {

	private static DeviceType deviceMode;
	private static DriverWindow driverWindow = DriverWindow.Native;
	private static BrowserType browserType;
	private static MobileDevice currentDevice;
	private static String lastKnownWindowHandle = "NATIVE_APP";
	private static ArrayList<Process> processNodeServer = new ArrayList<Process>();
	private static String appiumServerError;
	private static Boolean lauchServerSucessfully = false;
	private static Boolean closeAllThread = false;
	private static Boolean launchScreenCast = false;
	private static MobileApplication mobileApp = null;

	private static AndroidContext androidContext;
	private static boolean isPCloudy;
	private static boolean isOtherCloud;
	private static AppiumDriverLocalService appiumDriverLocalService;

	public static void setMobileApp(MobileApplication app) {

		mobileApp = app;
	}

	public static MobileApplication getMobileApp() {
		return mobileApp;
	}

	public static DriverWindow getDriverWindow() {
		return driverWindow;
	}

	public static DeviceType getDeviceType() {
		return deviceMode;
	}

	public static void setDriverWindow(String driverWindow2) {
		// first set the current window handle
		setWindowHandle(driverWindow2);
		if (driverWindow2.toLowerCase().contains("webview")) {
			driverWindow = DriverWindow.WebView;
		} else {
			driverWindow = DriverWindow.Native;
		}
	}

	public static void setBrowserMode(BrowserType browserMode1) {

		if (browserMode1 == BrowserType.chromeOnLocalAndroid) {
			browserType = BrowserType.chromeOnLocalAndroid;
		} else {
			browserType = BrowserType.SafariOnIos;
		}
	}

	public static BrowserType getBrowserMode() {
		return browserType;
	}

	public static Boolean isBrowserOrWebviewMode() {

		return (AppiumContext.getDriverWindow() == DriverWindow.WebView) || (AppiumContext.getBrowserMode() == BrowserType.chromeOnLocalAndroid)
				|| (AppiumContext.getBrowserMode() == BrowserType.ChromeOnCloud) || (AppiumContext.getBrowserMode() == BrowserType.SafariOnIos);
	}

	public static void setMobileDevice(MobileDevice device) {

		currentDevice = device;
	}

	public static MobileDevice getMobileDevice() {
		return currentDevice;
	}

	public static void setDeviceType(DeviceType deviceType) {
		deviceMode = deviceType;
	}

	public static void setWindowHandle(String currentWindowHandle) {
		lastKnownWindowHandle = currentWindowHandle;
	}

	public static String getLastKnownWindowHandle() {
		return lastKnownWindowHandle;
	}

	public static void setAppiumServerProcess(Process p) {

		processNodeServer.add(p);
	}

	public static List<Process> getAppiumServerProcess() {
		return processNodeServer;
	}

	public static void setErrorFrmServer(String serverError) {
		appiumServerError = serverError;
	}

	public static String getErrorFromAppiumServer() {
		return appiumServerError;
	}

	public static void launchAppiumServer(Boolean launchAppiumSucessfull) {
		lauchServerSucessfully = launchAppiumSucessfull;
	}

	public static Boolean isAppiumServerLaunch() {
		return lauchServerSucessfully;
	}

	public static void closeAllThread(Boolean CloseEventOccur) {
		closeAllThread = CloseEventOccur;
	}

	public static boolean isCloseAllThread() {
		return closeAllThread;
	}

	public static Boolean isBrowserMode() {

		if ((AppiumContext.getBrowserMode() == BrowserType.chromeOnLocalAndroid) || (AppiumContext.getBrowserMode() == BrowserType.ChromeOnCloud)
				|| AppiumContext.getBrowserMode() == BrowserType.SafariOnIos)
			return true;
		else
			return false;
	}

	public static void launchScreenCastSucessfully(Boolean screenCast) {
		launchScreenCast = screenCast;
	}

	public static boolean islaunchScreencast() {
		return launchScreenCast;
	}

	public static JavascriptExecutor JSExecutor() throws ToolNotSetException {
		return Finder.findJavaScriptExecuterDriver();
	}
	
	public static AndroidContext getAndroidContext() {
		if(androidContext == null) {
			return new AndroidContext();
		}
		return androidContext;
	}
	
	public static void setPCloudy(boolean value) {
		isPCloudy = value;
	}
	
	public static boolean isPCloudy() {
		return isPCloudy;
	}
	
	public static PCloudyContext getPCloudyContext() throws IOException {
		return PCloudyContext.getInstance();
	}
	
	public static boolean isAndroid() {
		return (getDeviceType() == DeviceType.Android || getDeviceType() == DeviceType.Selendroid);
	}
	
	public static boolean isIOS() {
		return (getDeviceType() == DeviceType.IPhoneRealDevice || getDeviceType() == DeviceType.IPhoneSimulator);
	}
	
	public static void setOtherCloud(boolean value) {
		isOtherCloud = value;
	}
	
	public static boolean isOtherClouds() {
		return isOtherCloud;
	}
	
	public static boolean isSelendroid() {
		return (getDeviceType() == DeviceType.Selendroid);
	}
	
	public static boolean isIPhoneSimulator() {
		return getDeviceType() == (DeviceType.IPhoneSimulator);
	}
	
	public static boolean isNativeMode() {
		if(isBrowserOrWebviewMode()) {
			return false;
		}else {
			return true;
		}
	}

	public static AppiumDriverLocalService getAppiumDriverLocalService() {
		return appiumDriverLocalService;
	}

	public static void setAppiumDriverLocalService(AppiumDriverLocalService appiumDriverLocalService) {
		AppiumContext.appiumDriverLocalService = appiumDriverLocalService;
	}
	
}
