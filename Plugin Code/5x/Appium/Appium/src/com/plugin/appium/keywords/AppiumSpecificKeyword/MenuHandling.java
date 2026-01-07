package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.time.Duration;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

import io.appium.java_client.TouchAction;
import io.appium.java_client.android.nativekey.AndroidKey;
import io.appium.java_client.touch.WaitOptions;
import io.appium.java_client.touch.offset.PointOption;

public class MenuHandling implements KeywordLibrary {

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	public FunctionResult Method_PressHome() throws ToolNotSetException {
		// 3 key code of home button on android
		if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {
			// Finder.findAppiumDriver().closeApp();
			// The close app approach was giving timeout issues. So found a better implementation
			// https://discuss.appium.io/t/appium-ios-how-can-i-go-to-home-screen/20956/8
			Finder.findAppiumDriver().runAppInBackground(Duration.ofSeconds(-1));
			
		} else {
//			Utils.PressAndroidButton(3);
			Utils.pressAndroidButton(AndroidKey.HOME);
			
		}
		return Result.PASS().setOutput(true).make();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	public FunctionResult Method_PressMenu() throws ToolNotSetException {
		// 82 key code of menu button on android
//		Utils.PressAndroidButton(82);
		Utils.pressAndroidButton(AndroidKey.MENU);
		return Result.PASS().setOutput(true).make();
	}

	public FunctionResult Method_launchActivityCommand() throws Exception {
		if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {
			//Finder.findAppiumDriver().quit();
			new Connect2AppiumServer().Method_Launch_iOSApplicationOnDevice(Connect2AppiumServer.mobileDevice,
					Connect2AppiumServer.mobileApplication);
		}else if(AppiumContext.getDeviceType() == DeviceType.Android){
			// start app
			try{
//				Finder.findAppiumDriver().runAppInBackground(1);
				Finder.findAppiumDriver().runAppInBackground(Duration.ofSeconds(1));
				}catch (Exception e) {
				Log.print(e.getMessage());
			}
		}else {
			Log.print("Not implemented for currently used device");
		}
		return Result.PASS().setOutput(true).make();
	}

	public FunctionResult Method_TurnWifi(String status) throws ToolNotSetException, InterruptedException {
		if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {
			
//			new TouchAction(Finder.findAppiumDriver()).press(100, Connect2AppiumServer.dim.getHeight()).moveTo(0, -400)
//					.release().perform();
			
			new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(100, Connect2AppiumServer.dim.getHeight()))
			.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000)))
			.moveTo(PointOption.point(0, -400)).release().perform();
			
			Thread.sleep(3000);
			int x = 0;
			int y = 0;
			String source = Finder.findAppiumDriver().getPageSource();
			Document html = Jsoup.parse(source);
			String tagName = "*";
			Elements ele = html.getAllElements();
			for (Element element : ele) {
				String name = element.attr("name");
				if (name.equals("Wi-Fi")) {
					tagName = element.tagName();
					x = Integer.parseInt(element.attr("x"));
					y = Integer.parseInt(element.attr("y"));
					break;
				}
			}
			String xpath = "//" + tagName + "[@name,'Wi-Fi']";
			try {
				Finder.findAppiumDriver().findElementByXPath(xpath).click();
			} catch (Exception ex) {
				if (x != 0 && y != 0) {
//					new TouchAction(Finder.findAppiumDriver()).tap(x + 5, y + 5).perform();
					Utils.touchActionTap(x + 5, y + 5);
				}
			}
//			new TouchAction(Finder.findAppiumDriver()).tap(10, 10).perform();
			Utils.touchActionTap(10, 10);
		}
		return Result.PASS().setOutput(true).make();
	}

}
