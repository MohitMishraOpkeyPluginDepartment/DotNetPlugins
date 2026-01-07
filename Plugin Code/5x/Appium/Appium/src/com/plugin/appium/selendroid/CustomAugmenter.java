package com.plugin.appium.selendroid;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.Augmenter;
import org.openqa.selenium.remote.RemoteWebDriver;

public class CustomAugmenter  extends Augmenter{

	@Override
    protected RemoteWebDriver extractRemoteWebDriver(WebDriver driver) {    	
    	      return (RemoteWebDriver) driver;

    	   }
	
}
