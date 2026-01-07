package com.plugin.appium;

import org.openqa.selenium.Dimension;

import com.plugin.appium.exceptionhandlers.ToolNotSetException;

public class DeviceScreen {

	private Dimension dimension = null;

	public DeviceScreen() throws ToolNotSetException {
		dimension = Finder.findAppiumDriver().manage().window().getSize();
	}

	public Dimension getScreenSize() throws ToolNotSetException {
		return dimension;
	}

	public int getScreenWidth() {
		return dimension.getWidth();

	}

	public int getScreenHeight() {
		return dimension.getHeight();
	}
}
