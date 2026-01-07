package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.openqa.selenium.InvalidElementStateException;
import org.openqa.selenium.Rectangle;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.DeviceType;

import io.appium.java_client.TouchAction;
import io.appium.java_client.touch.WaitOptions;
import io.appium.java_client.touch.offset.PointOption;

public class CustomPicker implements KeywordLibrary {

	public FunctionResult Method_setCustomPicker(AppiumObject object, String text, String direction, int percentage)
			throws Exception {

		if ((AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator)) {
			System.out.println("Running on IOS");
			return Method_setCustomPicker_IOS(object, text, direction, percentage);

		}
		else 
			return Method_setCustomPicker_Android(object, text, direction, percentage); 

		
	}

	public FunctionResult Method_setCustomPicker_IOS(AppiumObject object, String text, String direction, int percentage)
			throws Exception {
		if (text == null || text.equals("") || text.length() == 0 || text.equals(" ")) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setOutput(false)
					.setMessage("Invalid value provided by user").make();
		}
		if ((direction.equals("") || direction.length() == 0)) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setOutput(false)
					.setMessage("direction is blank").make();
		}
		if (percentage == 0) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setOutput(false)
					.setMessage("percentage is blank ").make();
		}
		if (percentage < 0 || percentage > 100) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
					.setMessage("invalid percentage ").make();
		}

		ArrayList<String> dirList = new ArrayList<String>(Arrays.asList("up", "down", "Down", "Up", "UP", "DOWN"));

		if ((dirList.contains(direction.trim()))) {

		} else {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setOutput(false)
					.setMessage("percentage is blank").make();
		}

		boolean flag = false;
		Long startTime = System.currentTimeMillis();
		int sec = Context.current().getKeywordRemaningSeconds();
		WebElement we = null;

		try {
			we = Finder.findWebElement(object);
		} catch (Exception e) {
			System.out.println("object not found");
		}

		if (we == null) {
			System.out.println(" object not found  ");
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Object not found ")
					.make();
		}
		System.out.println(" object  found  ");
		Rectangle rect = we.getRect();
		int x = rect.x;
		int y = rect.y;
		int height = rect.height;
		int width = rect.width;		
		int centerX = (x + width / 2);
		int centerY = (y + rect.height / 2);
		int deltaY = height * percentage / 100;
		
		System.out.println("x y width height centerX centerY deltaY " + x + " " + y + " " + +width + " " + height + " "
				+ centerX + " " + centerY+" "+deltaY);

		String elementText = we.getText();
		System.out.println("Object text is before swipe  " + elementText);

		if (elementText.equals(text)) {
			System.out.println("Element already in list ");
			System.out.println("text found before swiping");
			return Result.PASS().setOutput(true).setMessage("Setted Successfully").make();
		} else {

			while (System.currentTimeMillis() < startTime + (sec - 8) * 1000) {
				
				System.out.println("Looping ");
				if (direction.equalsIgnoreCase("up")) {
					System.out.println("Swiping up ");
					try {
						new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(centerX, centerY + deltaY))
						.waitAction(WaitOptions.waitOptions(Duration.ofMillis(1800)))
						.moveTo(PointOption.point(centerX, centerY - deltaY)).release().perform();
					} catch (InvalidElementStateException e) {
						return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE).setOutput(false)
								.setMessage("stale element :: element not operatable").make();
					} catch (Exception e) {
						return Result.FAIL(ResultCodes.ERROR_UNHANDLED_EXCEPTION).setOutput(false)
								.setMessage("operation not performed due to exception").make();

					}
				}
				// swiping vertically . So x will remain same

				if (direction.equalsIgnoreCase("down")) {
					System.out.println("Swiping down ");
					try {
						new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(centerX, centerY - deltaY))
						.waitAction(WaitOptions.waitOptions(Duration.ofMillis(1800)))
						.moveTo(PointOption.point(centerX, centerY + deltaY)).release().perform();
					} catch (InvalidElementStateException e) {
						return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE).setOutput(false)
								.setMessage("stale element :: element not operatable").make();
					} catch (Exception e) {
						return Result.FAIL(ResultCodes.ERROR_UNHANDLED_EXCEPTION).setOutput(false)
								.setMessage("operation not performed due to exception").make();

					}
				}
				
				String objectText = we.getText();
				System.out.println("Object Text is  :: " + objectText);
				if (objectText.trim().equals(text.trim())) {
					System.out.println("ByText :: ## object found");
					flag = true;
					break;
				}
			}
		}

		if (flag)
			return Result.PASS().setOutput(true).setMessage("picker set the value successfully").make();
		else
			return Result.FAIL(ResultCodes.ERROR_UNSATISFIED_DEPENDENCIES).setOutput(false)
					.setMessage("picker unnable to set the value successfully").make();
	}

	
	public FunctionResult Method_setCustomPicker_Android(AppiumObject object, String text, String direction, int percentage)
			throws Exception {	

		if (text == null || text.equals("") || text.length() == 0 || text.equals(" ")) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setOutput(false)
					.setMessage("Invalid value provided by user").make();
		}
		if ((direction.equals("") || direction.length() == 0)) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setOutput(false)
					.setMessage("direction is blank").make();
		}
		if (percentage == 0) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setOutput(false)
					.setMessage("percentage is blank ").make();
		}
		if (percentage < 0 || percentage > 100) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
					.setMessage("invalid percentage ").make();
		}

		ArrayList<String> dirList = new ArrayList<String>(Arrays.asList("up", "down", "Down", "Up", "UP", "DOWN"));

		if ((dirList.contains(direction.trim()))) {

		} else {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
					.setMessage("percentage is blank").make();
		}

		boolean flag = false;
		Long startTime = System.currentTimeMillis();
		int sec = Context.current().getKeywordRemaningSeconds();
		WebElement we = null;

		try {
			we = Finder.findWebElement(object);
		} catch (Exception e) {
			System.out.println("object not found");
		}

		if (we == null) {
			System.out.println(" object not found  ");
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Object not found ")
					.make();
		}
		System.out.println(" object  found  ");
		Rectangle rect = we.getRect();
		int x = rect.x;
		int y = rect.y;
		int height = rect.height;
		int width = rect.width;
		int centerX = (x + width / 2);
		int centerY = (y + rect.height / 2);
		int deltaY = height * percentage / 100;
		
		System.out.println("x y width height centerX centerY deltaY " + x + " " + y + " " + +width + " " + height + " "
				+ centerX + " " + centerY+" "+deltaY);


		List<WebElement> weByText = null;

		try {
			weByText = Finder.findElementByText(text, false, 1);
			System.out.println("1st findByText completed ");
		} catch (Exception e) {
			System.out.println("ByText :: object not found");
		}

		if (weByText.size() == 1) {
			System.out.println("Element already in list ");
			if (weByText.get(0).getText().trim().equals(text.trim())) {
				System.out.println("text found before swiping");
				weByText.get(0).click();
				return Result.PASS().setOutput(true).setMessage("Setted Successfully").make();
			}
		} else {

			while (System.currentTimeMillis() < startTime + (sec - 8) * 1000) {
				
				System.out.println("Looping ");
				if (direction.equalsIgnoreCase("up")) {
					System.out.println("Swiping up ");
					try {
						new TouchAction<>(Finder.findAppiumDriver())
						.press(PointOption.point(centerX, centerY+ deltaY))
						.waitAction(WaitOptions.waitOptions(Duration.ofMillis(1800)))
						.moveTo(PointOption.point(centerX, centerY-deltaY)).release().perform();
					} catch (InvalidElementStateException e) {
						return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE).setOutput(false)
								.setMessage("stale element :: element not operatable").make();
					} catch (Exception e) {
						return Result.FAIL(ResultCodes.ERROR_UNHANDLED_EXCEPTION).setOutput(false)
								.setMessage("operation not performed due to exception").make();

					}
				}
				// swiping vertically . So x will remain same

				if (direction.equalsIgnoreCase("down")) {
					System.out.println("Swiping down ");
					try {
						new TouchAction<>(Finder.findAppiumDriver())
						.press(PointOption.point(centerX, centerY-deltaY))
						.waitAction(WaitOptions.waitOptions(Duration.ofMillis(1800)))
						.moveTo(PointOption.point(centerX, centerY+deltaY )).release().perform();
					} catch (InvalidElementStateException e) {
						return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE).setOutput(false)
								.setMessage("stale element :: element not operatable").make();
					} catch (Exception e) {
						return Result.FAIL(ResultCodes.ERROR_UNHANDLED_EXCEPTION).setOutput(false)
								.setMessage("operation not performed due to exception").make();

					}
				}
				

				weByText = Finder.findElementByText(text, false, 1);
				System.out.println("ByText completed ");
				if (weByText.size() >= 1) {
					if (weByText.get(0).getText().trim().equals(text.trim())) {
						System.out.println("ByText :: ## object found");
						weByText.get(0).click();
						flag = true;
						break;
					}
				}
			}

		}
		if (flag)
			return Result.PASS().setOutput(true).setMessage("picker set the value successfully").make();
		else
			return Result.FAIL(ResultCodes.ERROR_UNSATISFIED_DEPENDENCIES).setOutput(false)
					.setMessage("picker unable to set the value successfully").make();
	}
}
