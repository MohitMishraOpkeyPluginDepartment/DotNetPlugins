package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.awt.AWTException;
import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.StringSelection;
import java.awt.event.KeyEvent;
import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.openqa.selenium.By;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.plugin.appium.Finder;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.TouchAction;
import io.appium.java_client.touch.WaitOptions;
import io.appium.java_client.touch.offset.PointOption;

public class NumberPicker implements KeywordLibrary {

	public String RunAdb(String commandString, AppiumDriver<WebElement> wb) {
		Map<String, String> commandMap = new HashMap<>();
		commandMap.put("command", "input text " + commandString);		
		//String output = (String) wb.executeScript("mobile: shell", Map.of("command", "input text " + commandString));
		String output = (String) wb.executeScript("mobile: shell",commandMap);
		return output;
	
	}

	public static void Swipe(WebElement element, AppiumDriver wb) {

		int percentage = 99;

		Point point = element.getLocation();
		org.openqa.selenium.Dimension eleSize = element.getSize();

		int startX = point.getX() + (eleSize.getWidth() / 2);
		int startY = point.getY();

		int moveToX = point.getX() + (eleSize.getWidth() / 2);
		int moveToY = point.getY() + (eleSize.getHeight() * percentage / 100);

		new TouchAction<>(wb).press(PointOption.point(startX, startY))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)))
		.moveTo(PointOption.point(moveToX, moveToY)).release().perform();

	}

	public static void pasteContentUsingRobot(String value) throws AWTException, InterruptedException {
		Robot rbt = new Robot();

		Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
		StringSelection stringSelection = new StringSelection(value);
		clipboard.setContents(stringSelection, null);
		rbt.keyPress(KeyEvent.VK_CONTROL);
		rbt.keyPress(KeyEvent.VK_V);
		rbt.keyRelease(KeyEvent.VK_V);
		rbt.keyRelease(KeyEvent.VK_CONTROL);
		System.out.println("Paste it");
		Thread.sleep(1000);
		clipboard.setContents(new StringSelection(" "), null);
	}

	public FunctionResult Method_Launch(String DayValue, String MonthValue, String YearValue)
			throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
			ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

		Boolean isMonth = false, isDay = false, isYear = false;

		WebElement Year = null, Month = null, Day = null;

		AppiumDriver wb = Finder.findAppiumDriver();

		if (wb != null) {

			System.out.println("driver created ");
			Thread.sleep(20000);
			List<WebElement> elements = null;

			int startingTime = (int) (System.currentTimeMillis() / 1000);
			int endTime = startingTime + 20;
			int diff = endTime - startingTime;

			while (diff >= 1) {
				try {
					elements = wb.findElements(By.className("android.widget.EditText"));
				} catch (Exception e) {
					e.printStackTrace();
				}

				if (elements.size() > 0) {
					System.out.println(elements.size());
					break;

				}
				diff--;
			}

			if (elements.size() == 0) {
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Element Not Found")
						.make();
			}
			if (elements.size() > 0) {
				System.out.println("Element Found");

				for (WebElement ele : elements) {

					String text = ele.getText();

					if (text != null) {
						if (text.length() == 2) {
							Day = ele;
							isDay = true;
						}
						if (text.length() == 3) {
							Month = ele;
							isMonth = true;
						}
						if (text.length() == 4) {
							Year = ele;
							isYear = true;
						}

					}
					System.out.println();
				}
			}

			if (isYear && isMonth && isDay) {

				if (isYear) {
					Thread.sleep(1000);
					Year.clear();
					Thread.sleep(1000);
					Year.click();
					Thread.sleep(1000);
					Year.sendKeys(YearValue);
					//pasteContentUsingRobot(YearValue);
					// new NumberPicker().RunAdb(YearValue, wb);

				}
				if (isMonth) {

					while (true) {
						System.out.println("in while Loop");
						String month = Month.getText();
						System.out.println(month);
						if (month.trim().equalsIgnoreCase(MonthValue) || month.trim().contains(MonthValue)) {
							System.out.println("Matched");
							break;
						}
						Swipe(Month, wb);

					}
					// new NumberPicker().RunAdb(MonthValue, wb);

				}
				if (isDay) {
					Thread.sleep(1000);
					Day.clear();
					Thread.sleep(1000);
					Day.click();
					Thread.sleep(1000);
					Day.sendKeys(DayValue);
					//pasteContentUsingRobot(DayValue);
					
					// new NumberPicker().RunAdb(DayValue, wb);

				}

				// element.click();
				return Result.PASS().setOutput(true).setMessage("Value Setted Successfuly").make();

			} else {
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Element Not Found")
						.make();
			}
		}

		return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false)
				.setMessage("Finally Connection Failure").make();
	}

}
