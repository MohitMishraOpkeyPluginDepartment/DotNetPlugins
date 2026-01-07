package com.plugin.appium.javascript;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.GenericKeyword.Waits;

public class ClientSideScripts {
	
	static public Class<ClientSideScripts> _class = ClientSideScripts.class;

	static boolean IgnoreSynchronization = false;
	static JavascriptExecutor jsExecutor;
	static String str1 = "";
	static int count = 0;
	static boolean chance = true;

	public static List<String> urlsToAvoid = new ArrayList<>();

	public static String getScriptContent(String fileName) {
		if (chance) {
			chance = false;
		}
		try {
			InputStream is = com.plugin.appium.javascript.ClientSideScripts.class.getResourceAsStream(fileName);
			// Log.print(fileName);
			byte[] bytes = new byte[is.available()];
			is.read(bytes);
			String result = new String(bytes, "UTF-8");
			return result;
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	
	public static final URL scriptUrl = com.plugin.appium.javascript.ClientSideScripts.class.getResource("axe.min.js");
	// public static final String FindElementsByText =
	// getScriptContent("findElementsByText.js");

	public static void WaitForAngular(WebDriver driver) throws ToolNotSetException {
		String WaitForAngular = Utils.getJavaScriptScriptContent(ClientSideScripts.class, "waitForAngular.js");
		int scriptTimeout = getRemainingTime();
		if (scriptTimeout < 2)
			scriptTimeout = 3;
		driver.manage().timeouts().setScriptTimeout(scriptTimeout, TimeUnit.SECONDS);
		jsExecutor = (JavascriptExecutor) driver;
		int i = 5;
		if (!IgnoreSynchronization) {
			try {
				jsExecutor.executeAsyncScript(WaitForAngular, "body");
			} catch (TimeoutException ex) {
				// new ExceptionManager().pushException(ex);
				// Timeout Occur carry on flow..No need to stop.
			} catch (WebDriverException ex) {
				Log.print(_class.getName() + ": No Angular Activity Going ");
				//new ExceptionManager().pushException(ex);
			} catch (Exception ex) {
				WaitForAngular(driver);
				//new ExceptionManager().pushException(ex);
			}
			i--;
			if (i == 0) {
				IgnoreSynchronization = true;
			}
		}
	}

	public static void injectOpenXhrStatusJS(WebDriver driver) {
		try {
		ClientSideScripts.injectOpenXhrStatusJS(driver, urlsToAvoid.toArray(new String[urlsToAvoid.size()]));
		}
		catch (Exception e) {
			//new ExceptionManager().pushException(e);
		}
		}

	private static void injectOpenXhrStatusJS(WebDriver driver, String[] urlsToAvoid) {
		List<String> enclosedWithQuotes = Arrays.stream(urlsToAvoid).map(itm -> "\"" + itm + "\"").collect(Collectors.toList());

		String urlsToAvoidJavaScript = "[" + String.join(", ", enclosedWithQuotes) + "]";
		if (urlsToAvoid.length > 0)
			System.out.println("URLs To Avoid: " + urlsToAvoidJavaScript);

		String _xhrScript = Utils.getJavaScriptScriptContent(ClientSideScripts.class, "XHRAndRenderingCheck.js");
		_xhrScript=_xhrScript.replaceAll("OPKEY_URLS_TO_AVOID", urlsToAvoidJavaScript);
		driver.manage().timeouts().setScriptTimeout(5, TimeUnit.SECONDS);
		((JavascriptExecutor) driver).executeScript("if (!String.prototype.includes) { String.prototype.includes = function (str) { return this.indexOf(str) !== -1; } }");
		Object res = ((JavascriptExecutor) driver).executeAsyncScript(_xhrScript);
		System.out.println("######### " + res);

	}

	public static void injectOpenXhrRequestsCounter() throws ToolNotSetException {
		Object ret = ((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("return window.openHttpURLs");
		if (("" + ret).equals("null")) {
			Log.print(_class.getName() + ": WindowOpenHTTPStatus is null. Therefore reinjecting");
			injectOpenXhrStatusJS(Finder.findAppiumDriver());
		}
	}

	public static boolean waitForReadyStateJQueryAndXhrToLoad(WebDriver driver, Waits.WaitMechanism type) throws ToolNotSetException {
		if (type.equals(Waits.WaitMechanism.XHR)) {
			injectOpenXhrRequestsCounter();
		}
		WebDriverWait wait = new WebDriverWait(driver, getRemainingTime());
		wait.pollingEvery(10, TimeUnit.MILLISECONDS);

		// wait for XHR to load
		ExpectedCondition<Boolean> xhrLoad = new ExpectedCondition<Boolean>() {
			//long startTime = System.currentTimeMillis();

			@Override
			public Boolean apply(WebDriver driver) {
				try {
					Object ret = ((JavascriptExecutor) driver).executeScript("return JSON.stringify(window.openHttpURLs);");
					//long diff = System.currentTimeMillis() - startTime;
					if(ret!=null)
					{
						String _ret=(String)ret;
						if(!_ret.equals("[]"))
						{
							Log.print(_class.getName() + ">> XHRCheck :* Some XHRs are Running");
						}
						if(_ret.contains("SetTimeOut_"))
						{
							Log.print(_class.getName() + ">> XHRCheck :* Some SetTimeouts are Running");
						}
						if(_ret.contains("ElementEvent_"))
						{
							Log.print(_class.getName() + ">> XHRCheck :* Some Element Attach Events are Running");
						}
						if(_ret.contains("ElementRendering_"))
						{
							Log.print(_class.getName() + ">> XHRCheck :* Some Element Rendering Functions are Running");
						}
						if(_ret.contains("PageRedirection_"))
						{
							Log.print(_class.getName() + ">> XHRCheck :* Some Page Redirection Functions are Running");
						}
						if(_ret.contains("ScrollEvent_"))
						{
							Log.print(_class.getName() + ">> XHRCheck :* Some Scroll Event Functions are Running");
						}
					}
					/*
					 * if (diff > 10) { Log.print("XhrWait: window.openHttpURLs: " + ret); startTime
					 * = System.currentTimeMillis(); }
					 */
					return ret == null || ("" + ret).contentEquals("[]") || ("" + ret).contentEquals("\"[]\"");
				} catch (Exception ex) {
					// new ExceptionManager().pushException(ex);
					return true;
				}
			}
		};

		// wait for Javascript to load
		ExpectedCondition<Boolean> windowReadyState = new ExpectedCondition<Boolean>() {
			@Override
			public Boolean apply(WebDriver driver) {
				return ((JavascriptExecutor) driver).executeScript("return document.readyState").toString().equals("complete");
			}
		};

		// wait for Angular to Load
		ExpectedCondition<Boolean> jQueryLoad = new ExpectedCondition<Boolean>() {
			@Override
			public Boolean apply(WebDriver driver) {
				try {
					Boolean jQueryActive = (Boolean) ((JavascriptExecutor) driver).executeScript("return (window.jQuery == null) || (window.jQuery.active == 0)");
					return jQueryActive;
				} catch (Exception ex) {
					// new ExceptionManager().pushException(ex);
					return true;
				}
			}
		};
		
		
		if (type.equals(Waits.WaitMechanism.JQUERY)) {
			if (Utils.useWaitForPageLoad()) {
				return wait.until(jQueryLoad);
			}
			return wait.until(windowReadyState) && wait.until(jQueryLoad);
		} else if (type.equals(Waits.WaitMechanism.XHR)) {
			if (Utils.useWaitForPageLoad()) {
				return wait.until(xhrLoad);
			}
			return wait.until(windowReadyState) && wait.until(xhrLoad);
		} else
			return true;
	}

	public static int getRemainingTime() {
		int remainingTime = (Context.current().getCallRemainingMillis() - Context.current().getPostKeywordTimeInMillis()) / 1000;
		remainingTime = Math.min(remainingTime, new Utils().getXMLHttpRequestWaitTime());
		Log.print(_class.getName() + "Effective XMLHttpRequestWaitTime : " + remainingTime);
		return remainingTime;
	}
}
