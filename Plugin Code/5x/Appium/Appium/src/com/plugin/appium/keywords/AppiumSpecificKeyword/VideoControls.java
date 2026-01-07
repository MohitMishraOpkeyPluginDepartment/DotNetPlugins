package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.Finder;
import com.plugin.appium.Utils;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

public class VideoControls implements KeywordLibrary {
	// as there is no generic name property for all video players, below keywords
	// work for YOUTUBE video player only
	public FunctionResult Method_MediaPlay() throws ToolNotSetException, InterruptedException {
		if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {
			TabOnMiddleScreen();
			WebElement play = Finder.findAppiumDriver()
					.findElement(By.xpath("//XCUIElementTypeButton[contains(@name,'id.player.play.button')]")); // add
																												// name
																												// property
																												// of
																												// other
																												// video
																												// players
																												// if
																												// need
																												// to
																												// run
																												// here
			Thread.sleep(5000);
			TabOnMiddleScreen();
			play.click();
			return Result.PASS().setOutput(true).make();
		}

		if (AppiumContext.getDeviceType() == DeviceType.Android)

		{

			AppiumSpecificUnCategorised obj = new AppiumSpecificUnCategorised();
			return obj.Method_RunAdbCommand("adb shell input keyevent 85");

		}
		return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
				.setMessage("Operation Not Supported").make();
	}

	public FunctionResult Method_MediaPause() throws ToolNotSetException, InterruptedException {
		if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {
			TabOnMiddleScreen();
			WebElement pause = Finder.findAppiumDriver()
					.findElement(By.xpath("//XCUIElementTypeButton[contains(@name,'id.player.pause.button')]"));

//			List<WebElement> pause = Finder.findAppiumDriver()
//					.findElements(By.xpath("//XCUIElementTypeButton[@enabled='true' and @visible='true']"));

			Thread.sleep(5000);
			TabOnMiddleScreen();
			if (pause != null) {
				pause.click();
				return Result.PASS().setOutput(true).make();
			}
		}

		if (AppiumContext.getDeviceType() == DeviceType.Android)

		{

			AppiumSpecificUnCategorised obj = new AppiumSpecificUnCategorised();
			return obj.Method_RunAdbCommand("adb shell input keyevent 85");

		}
		return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
				.setMessage("Operation Not Supported").make();
	}

	public FunctionResult Method_MediaNext() throws ToolNotSetException, InterruptedException {
		if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {
			TabOnMiddleScreen();
			WebElement play = Finder.findAppiumDriver()
					.findElement(By.xpath("//XCUIElementTypeButton[contains(@name,'id.player.next.button')]"));
			Thread.sleep(5000);
			TabOnMiddleScreen();
			play.click();
			return Result.PASS().setOutput(true).make();
		}
		if (AppiumContext.getDeviceType() == DeviceType.Android)

		{

			AppiumSpecificUnCategorised obj = new AppiumSpecificUnCategorised();
			return obj.Method_RunAdbCommand("adb shell input keyevent 87");

		}
		return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
				.setMessage("Operation Not Supported").make();
	}

	private static String RemoveStatusBar(String source) {
		Document ele = Jsoup.parse(source);
		Elements node = ele.getElementsByTag("XCUIElementTypeStahguhgutusBar");
		int size = node.size();
		System.out.println("Size is as :: " + size);
		try {
			ele.getElementsByTag("XCUIElementTypeStatusBar").get(size - 1).remove();
		} catch (Exception ex) {
			// Do Nothing
		}
		return ele.toString();
	}

	static boolean flagNew = true;

	public FunctionResult Method_MediaStop() throws ToolNotSetException, InterruptedException {
		if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {
			WebElement play = null;
			Thread.sleep(3000);
			String source = Finder.findAppiumDriver().getPageSource();
			source = RemoveStatusBar(source);
			TabOnMiddleScreen();
			boolean flag = true;
			try {
				play = Finder.findAppiumDriver()
						.findElement(By.xpath("//XCUIElementTypeButton[contains(@name,'Done')]"));
				flag = true;
			} catch (Exception ex) {
				flag = false;
			}
			Thread.sleep(5000);
			TabOnMiddleScreen();
			if (flag)
				play.click();
			else {
				// new
				// TouchAction(Finder.findAppiumDriver()).tap(Connect2AppiumServer.dim.getWidth()
				// - 15, 15).perform();
				Utils.touchActionTap(Connect2AppiumServer.dim.getWidth() - 15, 15);
			}
			Thread.sleep(3000);
			String html = Finder.findAppiumDriver().getPageSource();
			html = RemoveStatusBar(html);
			if (html.equals(source) && flagNew) {
				flagNew = false;
				Method_MediaStop();
			}
			return Result.PASS().setOutput(true).make();
		}
		if (AppiumContext.getDeviceType() == DeviceType.Android)

		{

			AppiumSpecificUnCategorised obj = new AppiumSpecificUnCategorised();
			return obj.Method_RunAdbCommand("adb shell input keyevent 86");

		}
		return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
				.setMessage("Operation Not Supported").make();
	}

	public FunctionResult Method_MediaPrevious() throws ToolNotSetException, InterruptedException {
		if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {
			TabOnMiddleScreen();
			WebElement play = Finder.findAppiumDriver()
					.findElement(By.xpath("//XCUIElementTypeButton[contains(@name,'id.player.previous.button')]"));
			Thread.sleep(5000);
			TabOnMiddleScreen();
			play.click();
			return Result.PASS().setOutput(true).make();
		}
		if (AppiumContext.getDeviceType() == DeviceType.Android)

		{

			AppiumSpecificUnCategorised obj = new AppiumSpecificUnCategorised();
			return obj.Method_RunAdbCommand("adb shell input keyevent 88");

		}
		return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
				.setMessage("Operation Not Supported").make();
	}

	private static void TabOnMiddleScreen() throws ToolNotSetException {
		int height = Connect2AppiumServer.dim.getHeight();
		int Width = Connect2AppiumServer.dim.getWidth();
//		new TouchAction(Finder.findAppiumDriver()).tap(Width / 2, height / 2).perform();
		Utils.touchActionTap(Width / 2, height / 4);
	}
}
