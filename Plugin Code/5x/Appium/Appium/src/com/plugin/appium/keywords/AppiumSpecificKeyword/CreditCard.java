package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.io.IOException;
import java.time.Duration;
import java.util.List;

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

public class CreditCard implements KeywordLibrary {

	public static void clickOnRectangleUsingItemNumber(AppiumDriver wb, WebElement ele, int itemNumber)
			throws InterruptedException {

		org.openqa.selenium.Dimension dimension = ele.getSize();
		Point point = ele.getLocation();
		int X = point.getX() + dimension.getWidth();
		System.out.println(X);

		int Y = point.getY() + dimension.getHeight();
		int Height = dimension.getHeight();

		System.out.println(Height);
		System.out.println(Y);

		int centerX = (int) (X / 2);
		int yCordinate = Y + (int) (Height * itemNumber);
		touchActionTap(wb, centerX, yCordinate);

	}

	public static void touchActionTap(AppiumDriver<WebElement> wb, int xOffset, int yOffset)
			throws InterruptedException {
		System.out.println("Tapping");
		Thread.sleep(3000);
		TouchAction action = new TouchAction(wb);
		System.out.println(xOffset + " " + yOffset);
		try {
			action.tap(PointOption.point(xOffset, yOffset));
			action.waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)));
			action.release().perform();
			Thread.sleep(3000);
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}

	public FunctionResult Method_Launch(int cardNumber)
			throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
			ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

		AppiumDriver wb = Finder.findAppiumDriver();

		if (wb != null) {

			System.out.println("driver created ");
			Thread.sleep(30000);
			List<WebElement> elements = null;

			int startingTime = (int) (System.currentTimeMillis() / 1000);
			int endTime = startingTime + 20;
			int diff = endTime - startingTime;

			while (diff >= 1) {
				try {
					elements = wb
							.findElements(By.xpath("//android.widget.ImageButton[@content-desc='Show dropdown menu']"));
					System.out.println();
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
				System.out.println("Element Found" + elements.size());
				clickOnRectangleUsingItemNumber(wb, elements.get(0), cardNumber);

				// element.click();
				return Result.PASS().setOutput(true).setMessage("CreditCard Selected Successfully").make();
			}

		} else {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Element Not Found")
					.make();
		}

		return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false)
				.setMessage("Finally Connection Failure").make();
	}
}
