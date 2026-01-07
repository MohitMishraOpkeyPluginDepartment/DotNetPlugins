package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.io.File;
import java.io.IOException;

import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.Finder;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.ssts.pcloudy.exception.ConnectError;

public class AfterAppiumConnection {
	public AfterAppiumConnection() {
		
	}
	
	public void run() throws IOException, ConnectError, InterruptedException, ToolNotSetException {
		this.mainRun();
	}
	
	private void mainRun() throws IOException, ConnectError, InterruptedException, ToolNotSetException {
		this.installPClouyServices();
	}
	
	private void installPClouyServices() throws IOException, ConnectError, InterruptedException, ToolNotSetException {

		if (AppiumContext.isPCloudy() || (AppiumContext.getDeviceType() != DeviceType.Android)) {
			return;
		}

		try {
			String packageName = "com.pcloudy.services";
			if (Finder.findAppiumDriver().isAppInstalled(packageName)) {
				return;
			}

			String androidServicesAPK = Context.session().getDefaultPluginLocation() + File.separator + "PcloudyService.apk";
			Finder.findAppiumDriver().installApp(androidServicesAPK);
		} catch (Exception e) {
			AppiumContext.setOtherCloud(true);
			System.out.println("@Warning: PcloudyService is not installed. Setting OtherCloud = True." );
		}
	}
}
