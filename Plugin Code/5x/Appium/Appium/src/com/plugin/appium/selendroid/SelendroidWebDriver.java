package com.plugin.appium.selendroid;

import java.net.URL;
import java.util.Set;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.HasTouchScreen;
import org.openqa.selenium.interactions.TouchScreen;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteTouchScreen;

import com.plugin.appium.Finder;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

import io.appium.java_client.android.AndroidDriver;

public class SelendroidWebDriver extends AndroidDriver<WebElement> implements HasTouchScreen {
	
	private RemoteTouchScreen touch;
	
	public SelendroidWebDriver(URL url, DesiredCapabilities capabilities) {
		super(url, capabilities);	
		touch = new RemoteTouchScreen(getExecuteMethod());
	}
	
	
	
	
	@Override
	public WebElement findElement(By by) {
		WebElement we = super.findElement(by);
		return new SelendroidWebElement(we);
	}

//	@Override
//	public List<WebElement> findElements(By by) {
//	
//		List<WebElement> encapsulatedWebElement = new ArrayList<WebElement>();
//			
//		List elementList = super.findElements(by);
//		
//		super.fin
//	
//		for(int iterator= 0 ; iterator<elementList.size(); iterator++) {
//			encapsulatedWebElement.add(new SelendroidWebElement(elementList.get(iterator)));
//		}
//		for(Object wb:super.findElements(by)){
//			encapsulatedWebElement.add(new SelendroidWebElement(wb));
//
//		}
//		
//		for (WebElement wb : super.findElements(by)) {
//			encapsulatedWebElement.add(new SelendroidWebElement(wb));
//		}
//
//		return encapsulatedWebElement;
//	}


	@Override
	public void close() {
		super.close();
		
	}


	@Override
	public void get(String arg0) {
		super.get(arg0);
		
	}


	@Override
	public String getCurrentUrl() {
		return	super.getCurrentUrl();
		
	}


	@Override
	public String getPageSource() {
		
		return super.getPageSource();
	}


	@Override
	public String getTitle() {		
		return super.getTitle();
	}


	@Override
	public String getWindowHandle() {
		
		return super.getWindowHandle();
	}


	@Override
	public Set<String> getWindowHandles() {
		
		return super.getWindowHandles();
	}


	@Override
	public Options manage() {
		return super.manage();
	}


	@Override
	public Navigation navigate() {
		return super.navigate();
	}


	@Override
	public void quit() {
		super.quit();
	}
	@Override
	public TargetLocator switchTo() {
		return super.switchTo();
	}
	
	// return the Custom  augument driver
	public WebDriver augmentedDriver () throws ToolNotSetException{
		WebDriver augmentedDriver  = new CustomAugmenter().augment(Finder.findAppiumDriver());
		return augmentedDriver; 
	}
	
	// return the casted javaScriptExecuter driver
	public JavascriptExecutor getJavaScriptExecuterDriver() throws ToolNotSetException{
		return ((JavascriptExecutor) Finder.findAppiumDriver());
	}

	@Override
	public TouchScreen getTouch() {
		return touch;
	}
	
}
