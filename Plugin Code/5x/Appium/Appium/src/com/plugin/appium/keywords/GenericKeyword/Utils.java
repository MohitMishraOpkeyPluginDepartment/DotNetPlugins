package com.plugin.appium.keywords.GenericKeyword;

import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchWindowException;
import org.openqa.selenium.UnhandledAlertException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.UnreachableBrowserException;

import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.GenericKeyword.Frame.SwitchState;
import com.plugin.appium.util.GenericCheckpoint;

public class Utils {
	public static boolean switchFrame(String xpath) throws Exception {
		
		WebElement ele = new GenericCheckpoint<WebElement>() {

			@Override
			public WebElement _innerRun() throws Exception {
				// TODO Auto-generated method stub
				return  Finder.findAppiumDriver().findElement(By.xpath(xpath));
			}
		}.run();
		
		try {
			
			
			Finder.findAppiumDriver().switchTo().frame(ele);
			Frame.setFrameSwitchState(SwitchState.SWITCH_BY_FINDER);
			System.out.println("Frame Switch sucessfull");
			return true;
		} catch (Exception e) {
			System.out.println(e.getMessage());
			System.out.println("Frame Switch NOT sucessfull");
		}
		return false;
	}

	public static int getRemainingTimeForLoading() {
		int remainingTime = Context.current().getKeywordRemaningSeconds();
		remainingTime = Math.min(remainingTime, new Utils().getXMLHttpRequestWaitTime());
		return remainingTime;
	}

	public int getXMLHttpRequestWaitTime() {
		int XMLHttpRequestWaitTime = 0;
		try {
			XMLHttpRequestWaitTime = Integer.parseInt(Context.session().getSettings().get("XMLHttpRequestTimeOut").trim());
		} catch (Exception e) {
			XMLHttpRequestWaitTime = 30;
		}
		if (XMLHttpRequestWaitTime < 0) {
			XMLHttpRequestWaitTime = 0;
		}
		Log.debug("XMLHttpRequestWaitTime : " + XMLHttpRequestWaitTime);
		return XMLHttpRequestWaitTime;
	}

//	public static void waitForPageLoad(WebDriver driver) throws InterruptedException, ToolNotSetException, UnhandledAlertException, NoSuchWindowException, ObjectNotFoundException {
//		System.out.println("Waiting for page load...");
//
//		Finder.findAppiumDriver().manage().timeouts().setScriptTimeout(10, TimeUnit.SECONDS);
//		while (!checkPageReadyState(driver)) {
//			Finder.continueSearchingOrStop();
//			Thread.sleep(1000);// we need to wait for this much
//		}
//	}

	public static void waitForPageLoad(WebDriver driver)
			throws InterruptedException, ToolNotSetException, UnhandledAlertException, NoSuchWindowException {
		Log.print("Waiting for page load...");

		int waitTime = Utils.getRemainingTimeForLoading();
		long startTime = System.currentTimeMillis();

		Finder.findAppiumDriver().manage().timeouts().setScriptTimeout(10, TimeUnit.SECONDS);

		while (!checkPageReadyState(driver)) {

			// _Performance_Issue
			Log.print(">>Wait Time " + waitTime);
			long diffTime = System.currentTimeMillis() - startTime;

			if (diffTime < (waitTime * 1000)) {
				// Previous value was 1000
				Thread.sleep(500);
			} else {
				break;
			}
		}
	}
	private static Boolean checkPageReadyState(WebDriver driver) {
		try {
			String readyState = ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("return document.readyState").toString();
			String msg = "Current Browser State is: " + readyState;
			System.out.println(msg);
			return (readyState.equals("complete") || (readyState.equals("interactive")));

		} catch (UnhandledAlertException ex) {
			throw ex;
		} catch (NoSuchWindowException ex) {
			throw ex;
		} catch (UnreachableBrowserException ex) {
			throw ex;
		} catch (Exception ex) {
			boolean conditionalPass = (ex.getMessage().contains("waiting for evaluate.js load failed")) ? true : false;
			return conditionalPass;
		}
	}
	
}
