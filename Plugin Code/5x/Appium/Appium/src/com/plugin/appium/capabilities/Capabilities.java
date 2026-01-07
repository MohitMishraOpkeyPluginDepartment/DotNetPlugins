package com.plugin.appium.capabilities;

import org.openqa.selenium.remote.DesiredCapabilities;

import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.Utils;

import io.appium.java_client.remote.MobileCapabilityType;

public class Capabilities {

    public static DesiredCapabilities getAndroidcapabilities() {
	DesiredCapabilities capabilities = new DesiredCapabilities(); // basic capabilities for local android devices
	capabilities.setCapability("appium:launch", true);
	capabilities.setCapability("appium:rotatable", true);
	capabilities.setCapability("appium:launchTimeout", 90000);
	capabilities.setCapability("appium:newCommandTimeout", 3000);
	capabilities.setCapability("appium:pageLoadStrategy", "none");
	capabilities.setCapability("appium:unicodeKeyboard", true);
	capabilities.setCapability("appium:resetKeyboard", true);
	capabilities.setCapability("appium:uiautomator2ServerInstallTimeout", 15000);
	capabilities.setCapability("appium:uiautomator2ServerLaunchTimeout", 20000);
	// any security on apps installation will block this thatswhy timeout cap.
	return capabilities;
    }

    public static DesiredCapabilities getIphoneCapabilities() { // basic capabilities for local ios devices
	DesiredCapabilities capabilities = new DesiredCapabilities();
	capabilities.setCapability("appium:launch", true);
	capabilities.setCapability("appium:rotatable", true);
	capabilities.setCapability("appium:launchTimeout", 90000);
	capabilities.setCapability("appium:pageLoadStrategy", "none");
	capabilities.setCapability("appium:unicodeKeyboard", true);
	capabilities.setCapability("appium:resetKeyboard", true);
	capabilities.setCapability("appium:automationName", "XCUITest");
	capabilities.setCapability("appium:platformName", "ios");
	capabilities.setCapability("appium:newCommandTimeout", 3000);
	capabilities.setCapability("appium:noReset", false);
	capabilities.setCapability("appium:webkitResponseTimeout", 150000);
	System.out.println("Context.session().getSettings().get(\"PlatformVersion\"): "
		+ Context.session().getSettings().get("PlatformVersion"));
	capabilities.setCapability("appium:platformVersion", Context.session().getSettings().get("PlatformVersion"));
	
	capabilities.setCapability("appium:realDeviceLogger", "/usr/local/lib/node_modules/deviceconsole/deviceconsole");
	capabilities.setCapability("appium:wdaLocalPort", Utils.getRandomNumber(1024, 65535));
	capabilities.setCapability("appium:webkitDebugProxyPort", Utils.getRandomNumber(1024, 65535));
	capabilities.setCapability("appium:xcodeConfigFile", "/usr/local/appium.xcconfig");	
	capabilities.setCapability("appium:startIWDP", true);
	capabilities.setCapability("appium:usePrebuiltWDA", true);	
	capabilities.setCapability("appium:clearSystemFiles", true);
	

	return capabilities;
    }

}
