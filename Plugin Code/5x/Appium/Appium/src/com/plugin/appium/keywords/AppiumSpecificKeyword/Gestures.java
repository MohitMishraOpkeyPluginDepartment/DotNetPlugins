package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.time.Duration;
import java.util.HashMap;

import org.openqa.selenium.Dimension;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.touch.TouchActions;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.DeviceScreen;
import com.plugin.appium.Finder;
import com.plugin.appium.Utils;
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInHybridApplication;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.KeywordMethodOrArgumentValidationFailException;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.TimeOut_ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.GenericKeyword.ObjectProperty;
import com.plugin.appium.selendroid.SelendroidWebDriver;
import com.plugin.appium.util.actions.Motions;

import io.appium.java_client.MobileDriver;
import io.appium.java_client.TouchAction;
import io.appium.java_client.touch.LongPressOptions;
import io.appium.java_client.touch.TapOptions;
import io.appium.java_client.touch.WaitOptions;
import io.appium.java_client.touch.offset.ElementOption;
import io.appium.java_client.touch.offset.PointOption;

public class Gestures implements KeywordLibrary {

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInHybridApplication
	public FunctionResult Method_LongPress(AppiumObject object) throws ToolNotSetException, ObjectNotFoundException,
			InterruptedException, KeywordMethodOrArgumentValidationFailException, TimeOut_ObjectNotFoundException {

		if (AppiumContext.getDeviceType() == DeviceType.Selendroid) {
			return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
					.setMessage(ReturnMessages.ONLY_NATIVE_APPLICATION_SUPPORTED.toString()).make();
		}
		WebElement ele = Finder.findWebElement(object);
		if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {
			new TouchAction<>(Finder.findAppiumDriver()).longPress(LongPressOptions.longPressOptions()
					.withElement(ElementOption.element(ele)).withDuration(Duration.ofMillis(5000))).release().perform();
		} else {
			new TouchActions(Finder.findAppiumDriver()).longPress(ele).perform();
		}
		return Result.PASS().setOutput(true).make();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	public FunctionResult Method_DoubleTouch(AppiumObject object)
			throws ToolNotSetException, ObjectNotFoundException, InterruptedException, TimeOut_ObjectNotFoundException {
		WebElement we = Finder.findWebElement(object);		
		System.out.println(" Double Tapping ");
		TapOptions to = TapOptions.tapOptions().withElement(ElementOption.element(we)).withTapsCount(2);
		new TouchAction<>(Finder.findAppiumDriver()).tap(to).perform();
		// http://appium.io/docs/en/commands/interactions/touch/double-tap/
		System.out.println("returning keyword status ");
		// we.click(); // old way
		// we.click();
		return Result.PASS().setOutput(true).make();
	}

	public FunctionResult Method_Touch(AppiumObject object) throws ToolNotSetException, ObjectNotFoundException,
			InterruptedException, KeywordMethodOrArgumentValidationFailException, TimeOut_ObjectNotFoundException {

		WebElement element = Finder.findWebElement(object);

		if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {
			new TouchAction<>((MobileDriver) Finder.findAppiumDriver())
					.tap(TapOptions.tapOptions().withElement(ElementOption.element(element)));
		} else if (Finder.findAppiumDriver() instanceof SelendroidWebDriver) {
			element.click();
		} else {
			Point cordinaPoint = element.getLocation();
			if (AppiumContext.isBrowserMode()) {
				// when we automate the Chrome and safari browse must to switching
				// context of Appium
				String currentContext = Finder.findAppiumDriver().getContext();
				Finder.findAppiumDriver().context("NATIVE_APP");
				Utils.tap(cordinaPoint.x, cordinaPoint.y);
				Finder.findAppiumDriver().context(currentContext);
			}
			else {
				try {
					element.click();
				}
				catch(Exception e) {
					System.out.println("Exception occured while clicking");
					new TouchAction<>((MobileDriver) Finder.findAppiumDriver())
					.tap(TapOptions.tapOptions().withElement(ElementOption.element(element)));
				}
			}
		}
		return Result.PASS().setOutput(true).make();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInHybridApplication
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1, 2, 3, 4 }, checkDataForWhiteSpace = { 0, 1, 2, 3, 4 })
	public FunctionResult Method_swipe(Double startx, Double starty, Double endx, Double endy, Double duration)
			throws ToolNotSetException, KeywordMethodOrArgumentValidationFailException, InterruptedException {

		if (AppiumContext.getDeviceType() == DeviceType.Selendroid) {
			return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
					.setMessage(ReturnMessages.ONLY_NATIVE_APPLICATION_SUPPORTED.toString()).make();
		}
		int getWidth = 0;
		int getHeight = 0;
		if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {
			getWidth = Connect2AppiumServer.dim.getWidth();
			getHeight = Connect2AppiumServer.dim.getHeight();
		} else {
			getWidth = Finder.findAppiumDriver().manage().window().getSize().getWidth();
			getHeight = Finder.findAppiumDriver().manage().window().getSize().getHeight();

			if ((startx < 0 || starty < 0 || endx < 0 || endy < 0)
					|| (startx > getWidth - 50 || starty > getHeight - 50)) {
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
						.setMessage(ReturnMessages.SWIPE_NOT_SUCESS.toString()).make();
			}
		}
		Utils.swipe(startx.intValue(), starty.intValue(), endx.intValue(), endy.intValue(), duration.intValue());

		return Result.PASS().setOutput(true).setMessage(ReturnMessages.SWIPE.toString()).make();
	}

	/**
	 * 
	 * @param endX
	 * @param endY
	 * @param touchCount
	 * @return
	 * @throws ToolNotSetException
	 * @throws KeywordMethodOrArgumentValidationFailException
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1 })
	public FunctionResult Method_flick(int xSpeed, int ySpeed)
			throws ToolNotSetException, KeywordMethodOrArgumentValidationFailException {

		if (AppiumContext.getDeviceType() == DeviceType.Selendroid) {
			return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
					.setMessage(ReturnMessages.ONLY_NATIVE_APPLICATION_SUPPORTED.toString()).make();
		}
		if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {
			return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
					.setMessage(ReturnMessages.NOT_SUPPORTED_IN_IOS.toString()).make();
		}

		TouchActions flick = new TouchActions(Finder.findAppiumDriver()).flick(xSpeed, ySpeed);
		flick.perform();
		return Result.PASS().setOutput(true).setMessage(ReturnMessages.FLICKED.toString()).make();
	}

	/**
	 * 
	 * @param object
	 * @param x
	 * @param y
	 * @return
	 * @throws ToolNotSetException
	 * @throws ObjectNotFoundException
	 * @throws InterruptedException
	 * @throws KeywordMethodOrArgumentValidationFailException
	 * @throws TimeOut_ObjectNotFoundException
	 */

	public FunctionResult Method_Tap(AppiumObject object) throws ToolNotSetException, ObjectNotFoundException,
			InterruptedException, KeywordMethodOrArgumentValidationFailException, TimeOut_ObjectNotFoundException {
		return Method_Touch(object);
	}

	/**
	 * @throws KeywordMethodOrArgumentValidationFailException
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInHybridApplication
	public FunctionResult Method_ScrollDown()
			throws ToolNotSetException, InterruptedException, KeywordMethodOrArgumentValidationFailException {

		DeviceScreen deviceScreen = new DeviceScreen();
		int screenWidth = deviceScreen.getScreenWidth() / 2;
		int screenHeight = deviceScreen.getScreenHeight() / 2;

		int scrollDownPixel = screenHeight + 300;

		while (scrollDownPixel > (deviceScreen.getScreenHeight() - 100)) {
			// some time scroll Down pixel is grater than device height
			scrollDownPixel = scrollDownPixel - 10;
		}

		if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {

			double startpercent = 0.75, endpercent = 0.25;
			Dimension size = Finder.findAppiumDriver().manage().window().getSize();
			int starty = (int) (size.height * startpercent);
			// Find endy point which is at top side of screen.
			int endy = (int) (size.height * endpercent);
			// Find horizontal point where you wants to swipe. It is in middle
			// of screen width.
			int startx = size.width / 2;
			System.out.println("START =" + startx);
			System.out.println("STARTY =" + starty);
			System.out.println("ENDX =" + startx);
			System.out.println("ENDY =" + endy);

			new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(startx, starty))
					.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000))).moveTo(PointOption.point(0, -endy))
					.release().perform();
		} else if (AppiumContext.getDeviceType() == DeviceType.Android) {
			double startpercent = 0.90, endpercent = 0.10;
			Dimension size = Finder.findAppiumDriver().manage().window().getSize();
			int starty = (int) (size.height * startpercent);
			int endy = (int) (size.height * endpercent);

			int startx = size.width / 2;
			System.out.println("STARTX = " + startx);
			System.out.println("STARTY = " + starty);
			System.out.println("ENDY = " + endy);

			new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(startx, starty))
					.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000)))
					.moveTo(PointOption.point(startx, endy)).release().perform();
		}

		else {
			Utils.swipe(screenWidth, scrollDownPixel, screenWidth, screenHeight, 0);
		}
		return Result.PASS().setOutput(true).make();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	@NotSupportedInHybridApplication
	public FunctionResult Method_ScrollUp()
			throws ToolNotSetException, InterruptedException, KeywordMethodOrArgumentValidationFailException {

		DeviceScreen deviceScreen = new DeviceScreen();
		int screenWidth = deviceScreen.getScreenWidth() / 2;
		int screenHeight = deviceScreen.getScreenHeight() / 2;

		if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {

			double startpercent = 0.75, endpercent = 0.25, temp;
			temp = startpercent;
			startpercent = endpercent;
			endpercent = temp;

			Dimension size = Finder.findAppiumDriver().manage().window().getSize();
			System.out.println("X== " + size.getHeight() + " Y==" + size.getWidth());
			int starty = (int) (size.height * startpercent);
			// Find endy point which is at top side of screen.
			int endy = (int) (size.height * endpercent);
			// Find horizontal point where you wants to swipe. It is in middle
			// of screen width.
			int startx = size.width / 2;
			System.out.println("START =" + startx);
			System.out.println("STARTY =" + starty);
			System.out.println("ENDX =" + startx);
			System.out.println("ENDY =" + endy);
			Utils.swipe(startx, starty, startx, endy, 100);
		}

		else if (AppiumContext.getDeviceType() == DeviceType.Android) {

			double startpercent = 0.10, endpercent = 0.90;

			Dimension size = Finder.findAppiumDriver().manage().window().getSize();
			System.out.println("X== " + size.getHeight() + "Y== " + size.getWidth());

			int starty = (int) (size.height * startpercent);
			int endy = (int) (size.height * endpercent);
			int startx = size.width / 2;

			System.out.println("START =" + startx);
			System.out.println("STARTY =" + starty);
			System.out.println("ENDX =" + startx);
			System.out.println("ENDY =" + endy);
			System.out.println("Executing swipe action...");
			Utils.swipe(startx, starty, startx, endy, 100);
		}

		else {
			Utils.swipe(screenWidth, 200, screenWidth, screenHeight, 0);
		}
		return Result.PASS().setOutput(true).make();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInHybridApplication
	public FunctionResult Method_SwipeLeft()
			throws ToolNotSetException, InterruptedException, KeywordMethodOrArgumentValidationFailException {

		if (AppiumContext.getDeviceType() == DeviceType.Selendroid) {
			return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
					.setMessage(ReturnMessages.ONLY_NATIVE_APPLICATION_SUPPORTED.toString()).make();
		}

		DeviceScreen deviceScreen = new DeviceScreen();
		int screenWidth = deviceScreen.getScreenWidth() / 2;
		int screenHeight = deviceScreen.getScreenHeight() / 2;

		if (Finder.findAppiumDriver() instanceof SelendroidWebDriver) {
			TouchActions flick = new TouchActions(Finder.findAppiumDriver()).flick(-1200, 0);
			flick.perform();
		} else {
			new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(screenWidth, screenHeight))
					.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000)))
					.moveTo(PointOption.point(-screenWidth, 0)).release().perform();
		}
		return Result.PASS().setOutput(true).make();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInHybridApplication
	public FunctionResult Method_SwipeRight()
			throws ToolNotSetException, InterruptedException, KeywordMethodOrArgumentValidationFailException {

		if (AppiumContext.getDeviceType() == DeviceType.Selendroid) {
			return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
					.setMessage(ReturnMessages.ONLY_NATIVE_APPLICATION_SUPPORTED.toString()).make();
		}

		DeviceScreen deviceScreen = new DeviceScreen();
		int screenWidth = deviceScreen.getScreenWidth() / 2;
		int screenHeight = deviceScreen.getScreenHeight() / 2;
		if (Finder.findAppiumDriver() instanceof SelendroidWebDriver) {
			TouchActions flick = new TouchActions(Finder.findAppiumDriver()).flick(1200, 0);
			flick.perform();
		} else {
			new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(screenWidth, screenHeight))
					.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000)))
					.moveTo(PointOption.point(screenWidth, 0)).release().perform();
		}
		return Result.PASS().setOutput(true).make();
	}

	public FunctionResult Method_runAppInBackground() throws ToolNotSetException {

		// Finder.findAppiumDriver().runAppInBackground(2);

		return Result.PASS().setOutput(true).make();
	}

	public FunctionResult Method_KillAndRelaunch() throws Exception {
		new Connect2AppiumServer().Method_Launch_iOSApplicationOnDeviceReset(Connect2AppiumServer.mobileDevice,
				Connect2AppiumServer.mobileApplication);
		return Result.PASS().setOutput(true).make();
	}

	@NotSupportedInHybridApplication
	public FunctionResult Method_SwipeToObject(AppiumObject object, String direction) throws Exception {
		return new Motions().swipeToObject(object, direction);
	}

	@NotSupportedInHybridApplication
	public FunctionResult Method_SwipeToObjectOnContainerObject(AppiumObject containerObject, AppiumObject objectToFind,
			String direction) throws Exception {
		return new Motions().swipeToObjectOnContainerObject(containerObject, objectToFind, direction);
	}

	@NotSupportedInHybridApplication
	public FunctionResult Method_SwipeTowards(String direction)
			throws ToolNotSetException, InterruptedException, KeywordMethodOrArgumentValidationFailException {
		return new Motions().swipeTowards(direction);
	}
	
	public FunctionResult Method_SwipeTowardsByPercentage(String direction,int from ,int to)
			throws ToolNotSetException, InterruptedException, KeywordMethodOrArgumentValidationFailException, ObjectNotFoundException, TimeOut_ObjectNotFoundException {
		if(direction==null || direction.length()==0 ) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("invalid direction provided").make();
		}
		if(from<0 || to>100) {			
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("invalid percentage provided").make();
		}
		if(from!=0 && to!=0) {	
			System.out.println("User given the percentage for swiping ");
			return new Motions().swipeTowards(direction,from,to);									
		}
		
		System.out.println("User not given the percentage for swiping ");
		return new Motions().swipeTowards(direction);
	}

	@NotSupportedInHybridApplication
	public FunctionResult Method_SwipeOnObject(AppiumObject object, String direction) throws Exception {
		return new Motions().swipeOnObject(object, direction);
	}

	@NotSupportedInHybridApplication
	public FunctionResult Method_swipeWithObject(AppiumObject object, String direction) throws Exception {
		return new Motions().swipeOnObject(object, direction);
	}

	/*
	 * @NotSupportedInHybridApplication public FunctionResult
	 * Method_SwipeToText(AppiumObject object, String textToSearch, int index,
	 * boolean isContains, String direction) throws Exception { ObjectProperty
	 * objectProperty = new ObjectProperty();
	 * objectProperty.setTextToSearch(textToSearch); objectProperty.setIndex(index);
	 * objectProperty.setContains(isContains);
	 * objectProperty.setAppiumObject(object); return new
	 * Motions().swipeToText(objectProperty, direction); }
	 */
	
	public FunctionResult Method_SwipeToText( String Text, String Direction , int Index , Boolean ContainsText) throws Exception
	{
		ObjectProperty objectProperty = new ObjectProperty();
		objectProperty.setTextToSearch(Text);
		objectProperty.setIndex(Index);
		objectProperty.setContains(ContainsText);
		//objectProperty.setAppiumObject(object);
		return new Motions().swipeToText(objectProperty, Direction);
		//return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage(ResultCodes.ERROR_OBJECT_NOT_FOUND.toString()).make();
	}

	public FunctionResult Method_SwipeToObject(AppiumObject object, String direction, int fromPercentage,
			int toPercentage) throws ToolNotSetException, InterruptedException, TimeOut_ObjectNotFoundException,
			ObjectNotFoundException, Exception {
		return new Motions().swipeToObject(object, direction, fromPercentage, toPercentage);
	}
	
	public FunctionResult Method_TrippleTouch(AppiumObject object)
		throws ToolNotSetException, ObjectNotFoundException, InterruptedException, TimeOut_ObjectNotFoundException {
	WebElement we = Finder.findWebElement(object);	
	if(we!=null) {
	   
	    if (AppiumContext.isBrowserMode()) {
	    Point cordinaPoint = we.getLocation();		
	    HashMap<String, Integer> tapObject = new HashMap<String, Integer>();
		tapObject.put("x", cordinaPoint.x);
		tapObject.put("y", cordinaPoint.y);
		tapObject.put("touchCount", 3);
		tapObject.put("duration", 1);
		Finder.findJavaScriptExecuterDriver().executeScript("mobile: tap", tapObject);   
		System.out.println("##<< web :: Tapping Done ");
		return Result.PASS().setOutput(true).make();
	    }
	    
	System.out.println(" Tripple Tapping ");
	TapOptions option = TapOptions.tapOptions().withElement(ElementOption.element(we)).withTapsCount(3);
	new TouchAction<>(Finder.findAppiumDriver()).tap(option).waitAction(WaitOptions.waitOptions(Duration.ofMillis(50))).perform();
//	TapOptions option1 = TapOptions.tapOptions().withPosition(PointOption.point(startX, startY)).withTapsCount(3);
//	new TouchAction<>(Finder.findAppiumDriver()).tap(option1).perform();
	System.out.println("##<<  Tapping Done ");
	return Result.PASS().setOutput(true).make();
	}else {
	    return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Object not found").make(); 
	}
}
	public FunctionResult Method_TouchWithCount(AppiumObject object,int count,int time )
		throws ToolNotSetException, ObjectNotFoundException, InterruptedException, TimeOut_ObjectNotFoundException {
	    WebElement we = Finder.findWebElement(object);
	    if (we != null) {	
				
		/*
		 * System.out.println("tapping with point"); Point point=we.getLocation();
		 * TouchAction actionWithPoint = new TouchAction(Finder.findAppiumDriver())
		 * .tap(TapOptions.tapOptions().withPosition(PointOption.point(point.x,
		 * point.y))) .waitAction(WaitOptions.waitOptions(Duration.ofMillis(milliSec)))
		 * .tap(TapOptions.tapOptions().withPosition(PointOption.point(point.x,
		 * point.y))) .waitAction(WaitOptions.waitOptions(Duration.ofMillis(milliSec)))
		 * .tap(TapOptions.tapOptions().withPosition(PointOption.point(point.x,
		 * point.y))); actionWithPoint.perform();
		 * System.out.println(" tapping with pointdone ");
		 */
		
		System.out.println("tapping with element");	
		TouchAction tripple_action = new TouchAction(Finder.findAppiumDriver())
			.tap(TapOptions.tapOptions().withElement(ElementOption.element(we)))
			.waitAction(WaitOptions.waitOptions(Duration.ofMillis(time)))
			.tap(TapOptions.tapOptions().withElement(ElementOption.element(we)))
			.waitAction(WaitOptions.waitOptions(Duration.ofMillis(time)))
			.tap(TapOptions.tapOptions().withElement(ElementOption.element(we)));
		tripple_action.perform();	
		System.out.println(" tapping with pointdone ");
		return Result.PASS().setOutput(true).make();

	    } else {
		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Object not found")
			.make();
	    }

	}


}
