package com.plugin.appium.android;

import io.appium.java_client.android.AndroidDriver;

import java.net.URL;

import org.openqa.selenium.Capabilities;
import org.openqa.selenium.interactions.HasTouchScreen;
import org.openqa.selenium.interactions.TouchScreen;
import org.openqa.selenium.remote.RemoteTouchScreen;

public class AndroidWebDriver extends AndroidDriver implements HasTouchScreen {

	private RemoteTouchScreen touch;
	
	public AndroidWebDriver(URL remoteAddress, Capabilities desiredCapabilities) {
		super(remoteAddress, desiredCapabilities);
		touch = new RemoteTouchScreen(getExecuteMethod());
	}

	@Override
	public TouchScreen getTouch() {
		return touch ;
	}

}
