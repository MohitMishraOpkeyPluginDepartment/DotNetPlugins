package com.plugin.appium.keywords.GenericKeyword;

import java.awt.AWTException;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.HasInputDevices;
import org.openqa.selenium.interactions.Mouse;
import org.openqa.selenium.interactions.internal.Locatable;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInApplicationMode;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInHybridApplication;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInMobileContext;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInNativeApplication;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.BrowserType;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.javascript.ClientSideScripts;
import com.plugin.appium.util.FunctionCaller;

import io.appium.java_client.android.nativekey.AndroidKey;

public class UnCategorised implements KeywordLibrary {

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInMobileContext
	public FunctionResult Method_copyFromClipBoard() throws Exception {
		return null;
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInApplicationMode
	public FunctionResult Method_KeyRight() throws ToolNotSetException, AWTException {
		return null;
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInMobileContext
	public FunctionResult Method_KeyLeft() throws ToolNotSetException, AWTException {
		return null;
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	public FunctionResult Method_Enter() throws ToolNotSetException, AWTException {
		// 66 is the code of enter
		if (!(AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator)) {
//			Utils.PressAndroidButton(66);
			Utils.pressAndroidButton(AndroidKey.ENTER);
		}

		return Result.PASS().setOutput(true).make();
	}

	/* 
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInNativeApplication
	@NotSupportedInHybridApplication
	public FunctionResult Method_MouseHover(AppiumObject object)
			throws Exception {
		if (AppiumContext.getBrowserMode() == BrowserType.chromeOnLocalAndroid) {
			WebElement ele = Finder.findWebElementUsingCheckPoint(object);
			
			Utils.isOperable(ele);
			
			Locatable hoverItem = (Locatable)ele ;
			Mouse mouse = ((HasInputDevices) Finder.findAppiumDriver()).getMouse();
			mouse.mouseMove(hoverItem.getCoordinates());
			return Result.PASS().setOutput(true).make();
		}
		return null;
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_AssertTextPresent(String value) throws Exception {
		if (false && (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator)) {
			return Method_AssertTextPresentIOS(value);
		}
		boolean isTextPresent = false;
		boolean isTextVisible = false;
		// when driver is in the browesr or webview mode
		if (AppiumContext.isBrowserOrWebviewMode()) {
			WebElement element = Finder.findAppiumDriver().findElement(By.cssSelector("body"));
			String bodyText = element.getText();
			System.out.println("Element get text:- " + bodyText);

			if (bodyText.contains(value))
				isTextPresent = true;

			System.out.println(" is text present:- " + isTextPresent);
			isTextVisible = element.isDisplayed();
			System.out.println(" is text visible:- " + isTextVisible);
		}
		// for native application
		else {
			try {
				WebElement we = Finder.findAppiumDriver()
						.findElement(By.xpath("//*[contains(@text," + "'" + value + "'" + ")]"));
				isTextPresent = FunctionCaller.callReturnFunction(()-> Utils.getText(we).contains(value), "#1 GetText Time Taken");
				isTextVisible = we.isDisplayed();

			} catch (org.openqa.selenium.NoSuchElementException e) {
				try {
					WebElement we = Finder.findAppiumDriver()
							.findElement(By.xpath("//*[contains(@content-desc," + "'" + value + "'" + ")]"));
					isTextPresent = FunctionCaller.callReturnFunction(()-> Utils.getText(we).contains(value), "#2 GetText Time Taken");
					isTextVisible = we.isDisplayed();

				} catch (org.openqa.selenium.NoSuchElementException ex) {
					// In selendroid mode text is exist in value property
					try {
						WebElement we = Finder.findAppiumDriver()
								.findElement(By.xpath("//*[contains(@value," + "'" + value + "'" + ")]"));
						isTextPresent = FunctionCaller.callReturnFunction(()-> Utils.getText(we).contains(value), "#3 GetText Time Taken");
						isTextVisible = we.isDisplayed();
					} catch (org.openqa.selenium.NoSuchElementException textNotExist) {

					}
				}
			}

		}

		if (isTextPresent && isTextVisible) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.VERFIYED.toString()).make();
		}
		return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setMessage(ReturnMessages.NOT_VERFIED.toString())
				.setOutput(false).make();
	}

	private FunctionResult Method_AssertTextPresentIOS(String value) throws ToolNotSetException, InterruptedException {
		Thread.sleep(5000);
		String source = Finder.findAppiumDriver().getPageSource();
		Document html = Jsoup.parse(source);
		Elements eles = html.getAllElements();
		for (Element element : eles) {
			String name = element.attr("name");
			if (name.isEmpty() || name == "" || name == null) {
				name = element.attr("value");
			}
			if (name.toLowerCase().contains(value.toLowerCase())) {
				try {
					int x = Integer.parseInt(element.attr("x"));
					int y = Integer.parseInt(element.attr("y"));
					// if (x > 0 && y > 0) {
					return Result.PASS().setOutput(true).setMessage(ReturnMessages.VERFIYED.toString()).make();
					// }
				} catch (Exception ex) {
				}
			}
		}
		return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setMessage(ReturnMessages.NOT_VERFIED.toString())
				.setOutput(false).make();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	public FunctionResult Method_PressTAB() throws ToolNotSetException, AWTException {
		// 61 is the code tab
//		Utils.PressAndroidButton(61);
		Utils.pressAndroidButton(AndroidKey.TAB);
		return Result.PASS().setOutput(true).make();
	}
	
	public String TrimString(String text, String before, String after) {
		String tempBefore = before;
		String tempafter = after;
		before = before.toLowerCase();
		after = after.toLowerCase();
		if (before.trim().length() > 0 || after.trim().length() > 0) {

			if (text.trim().length() == 0)
				return text;
			int start = text.toLowerCase().indexOf(after.trim());
			if (start != -1) {
				start = start + after.length();
				text = text.substring(start);
				start = 0;
			}

			int end = text.toLowerCase().indexOf(before.trim());
			if (end == -1) {
				if (start == -1) {
					return "@#@Values provided for Before(" + tempBefore + ") and After(" + tempafter
							+ ") are not found";
				} else
					return "@#@Value provided for Before(" + tempBefore + ") is not found";
			} else if (before.trim().length() == 0 && end == 0)
				end = text.length();
			if (start == -1)
				return "@#@Value provided for After(" + tempafter + ") is not found";

			text = text.substring(start, end).trim();
		}
		return text;
	}

	public FunctionResult Method_LoadMe() {
		return Result.PASS().setOutput(true).make();
	}
	
	
	public FunctionResult Method_ignoreXMLHttpRequest(String url) throws ArgumentDataMissingException {
		
		ClientSideScripts.urlsToAvoid.add(url);
		Log.print("urls To Avoid : " + ClientSideScripts.urlsToAvoid);
		
		return Result.PASS().setOutput(true).make();
	}
	
	
	
}
