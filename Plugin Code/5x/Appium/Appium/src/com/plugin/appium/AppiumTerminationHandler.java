package com.plugin.appium;

import java.io.Closeable;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.eventhandling.DefaultTerminationEventHandler;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.BrowserType;
import com.plugin.appium.exceptionhandlers.AdbNotFoundException;
import com.plugin.appium.keywords.GenericKeyword.Browser;
import com.ssts.pcloudy.Connector;

public class AppiumTerminationHandler extends DefaultTerminationEventHandler {

	public AppiumTerminationHandler(Closeable... resources) {
		super(resources);
	}

	protected void beforeCleanup() throws IOException, InterruptedException, AdbNotFoundException {

		String message = Browser.util_KillAllDrivers();
		System.out.println(" before close all thread::: ");
		// set variable close all thread when close a flow and stop a flow
		AppiumContext.closeAllThread(true);

		System.out.println(message);

		System.out.println("Close all clean up function ::: ");
		releasePcloudyDeviceIfAvailable();
	}

	protected void afterCleanup() throws IOException, AdbNotFoundException, InterruptedException {

		System.out.println(" after clean up function:::: ");
		if (AppiumContext.getBrowserMode() == BrowserType.chromeOnLocalAndroid) {
			// In the Case of Chrome run on the Local Envirement
			// . some time Appium quit method not able to close the
			// chrome driver So we kill the chrome driver
			System.out.println(" try to kill the chrome driver");
			// Runtime.getRuntime().exec("taskkill /f /IM chromedriver.exe");

		}

		// Utils.killAdbServer();;
	}

	private void releasePcloudyDeviceIfAvailable() {
		try {
			if (AppiumContext.isPCloudy()) {
				AppiumContext.getPCloudyContext().releaseSession();
				Log.print("pCloudy Device Release");
			}
		} catch (Exception ex) {
			Log.print("** Error Caused In Releasing Device **");
		}
	}
}
