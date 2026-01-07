package com.plugin.appium.keywords.AppiumSpecificKeyword;

import org.openqa.selenium.remote.DesiredCapabilities;

import com.crestech.opkey.plugin.communication.contracts.functioncall.MobileDevice;
import com.plugin.appium.enums.DeviceType;


public class AppiumConnectionStructure {
	public DesiredCapabilities caps;
	public String fullAppiumEndpoint;
	public DeviceType deviceType;
	public MobileDevice mobileDevice;

}
