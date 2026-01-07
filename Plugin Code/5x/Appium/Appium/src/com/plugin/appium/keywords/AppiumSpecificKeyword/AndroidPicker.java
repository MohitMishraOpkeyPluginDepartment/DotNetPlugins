package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.openqa.selenium.InvalidArgumentException;
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
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

import io.appium.java_client.MobileElement;
import io.appium.java_client.TouchAction;
import io.appium.java_client.touch.WaitOptions;
import io.appium.java_client.touch.offset.PointOption;

public class AndroidPicker implements KeywordLibrary {

	public FunctionResult Method_SetPickerValue(AppiumObject object, String value) throws Exception {
		if (value.equals("") || value.length() == 0) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
					.setMessage("Invalid value provided by user").make();
		}

		WebElement we = Finder.findWebElement(object);
		if (we == null) {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Object not found ")
					.make();
		}
		String objText = we.getText();
		System.out.println("Number picker current text is " + objText + " lenght is " + objText.length());

		if (objText.equals("") || objText.length() == 0) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setOutput(false)
					.setMessage("Picker donot have any value so cannot set any value").make();
		}

		Rectangle rect = we.getRect();

		if ((AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator)) {
			System.out.println("Running on IOS");
			String classname = we.getClass().toString();
			System.out.println(" obj class " + classname);

			if (isNumeric(objText)) {

				if (isNumeric(value)) {

					if (value.equals(objText) || Integer.parseInt(value) == Integer.parseInt(objText)) {
						return Result.PASS().setOutput(true).setMessage("value already set ").make();
					}

					if (Integer.parseInt(value) > Integer.parseInt(objText)) {
						System.out.println("## Swiping up");

						if (setPickerWheel(value, "NEXT", we)) {

							return Result.PASS().setOutput(true).setMessage("value set for up case  ").make();
						} else {
							return Result.FAIL(ResultCodes.ERROR_USER_ASSERTED_FAILURE).setOutput(false)
									.setMessage("value not set").make();
						}
					}

					if (Integer.parseInt(objText) > Integer.parseInt(value)) {

						System.out.println("## Swiping down");

						if (setPickerWheel(value, "PREVIOUS", we)) {

							return Result.PASS().setOutput(true).setMessage("value set for down case ").make();
						} else {
							return Result.FAIL(ResultCodes.ERROR_USER_ASSERTED_FAILURE).setOutput(false)
									.setMessage("value not set").make();
						}

					}

				}

				else {
					return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
							.setMessage("invalid value cannot be setted successfully. requires integer value").make();
				}

			}

			else {

				System.out.println("Month Case");

				if (setPickerWheel(value, "NEXT", we)) {
					return Result.PASS().setOutput(true).setMessage("value setted successfully").make();
				} else {

					return Result.FAIL(ResultCodes.ERROR_USER_ASSERTED_FAILURE).setOutput(false)
							.setMessage("value not setted successfully").make();
				}

			}

			return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
					.setMessage("object is not number picker").make();

		} else {
			System.out.println("Running on Android");
			runPicker(we, objText, value, rect);
		}

		// we.sendKeys(value);
		System.out.println("digit and string algo finished ");
		// wait for set the value of picker properly
		Thread.sleep(2000);
		return Result.PASS().setOutput(true).make();
	}

	public static boolean isNumeric(String string) {

		if (string == null || string.equals("")) {
			System.out.println("String cannot be parsed, it is null or empty.");
			return false;
		}

		try {
			int intValue = Integer.parseInt(string);
			System.out.println("##<< Is Numeric true " + intValue);
			return true;
		} catch (NumberFormatException e) {
			System.out.println("Invalid Operation :: Input string is not integer.");
		}
		return false;
	}

	public FunctionResult runPicker(WebElement we, String objText, String value, Rectangle rect)
			throws ToolNotSetException {
		Boolean flag = false;
		int x = rect.x;
		int y = rect.y;
		int height = rect.height;
		int width = rect.width;
		int centerX = x + width / 2;
		int YToSwipe = y + height + 10;
		System.out.println("x y width height  " + x + " " + y + " " + width + " " + height);

		char chAtZero = objText.charAt(0);

		System.out.println("char at 0 index " + chAtZero);

		if (objText.length() >= 1) {

			if ((Character.isDigit(chAtZero)) && isNumeric(value)) {

				System.out.println("digit character founded "); // just to check if digit are in picker.if exist it
				// means date or year

				if (Integer.parseInt(value.trim()) > Integer.parseInt(objText)) {

					int dif = Integer.parseInt(objText.trim()) - Integer.parseInt(value.trim());

					dif = Math.abs(dif);

					System.out.println("difference in default  digit value  and user given value " + dif);
					System.out.println("integer case :: Looping up with digits ");

					for (int i = 0; i < dif; i++) {

						String text = we.getText().trim();
						System.out.println(" picker value is " + text);

						if (text.trim().equals(value.trim())) {
							System.out.println("value matched with picker value");
							flag = true;
							break;
						}

						new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(centerX, YToSwipe))
						.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000)))
						.moveTo(PointOption.point(centerX, y - 10)).release().perform();
						// swiping vertically . So x will remain same

						System.out.println(i + "th iteration ");

					}

					Result.PASS().setOutput(true).setMessage("number setted successfully ").make();
				}

				if (Integer.parseInt(objText) > Integer.parseInt(value.trim())) {
					int difference = Integer.parseInt(value.trim()) - Integer.parseInt(objText);

					System.out.println("difference in default  digit value  and user given value " + difference);
					System.out.println("integer case :: Looping down with digits ");

					difference = Math.abs(difference);

					for (int i = 0; i < difference; i++) {

						String text = we.getText().trim();
						System.out.println(" picker value is " + text);
						if (text.equals(value.trim())) {
							System.out.println("value matched with picker value");
							flag = true;
							break;
						}

						new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(centerX, y - 10))
						.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000)))
						.moveTo(PointOption.point(centerX, YToSwipe)).release().perform();

						System.out.println(i + "th iteration ");

					}

					Result.PASS().setOutput(true).setMessage("number setted successfully ").make();
				}

			}

			else { // character is in string format may be month
				int dif = 0;

				int indexOfPickerValue = 0, indexOfUserValue = 0;

				List<String> Months = new ArrayList<String>(Arrays.asList("Jan", "Feb", "Mar", "Apr", "May", "Jun",
						"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"));

				if (Months.contains(objText.trim())) {
					indexOfPickerValue = Months.indexOf(objText.trim());
					System.out
					.println("list contains the default selected picker value  at index " + indexOfPickerValue);
				} else {
					return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
							.setMessage("List not contains default value").make();

				}

				if (Months.contains(value.trim())) {
					indexOfUserValue = Months.indexOf(value.trim());
					System.out.println("list contains the user given value at index " + indexOfUserValue);

					if (indexOfUserValue > indexOfPickerValue) {

						dif = indexOfUserValue - indexOfPickerValue;
						dif = Math.abs(dif);
						System.out.println(" case of string ::  swiping up  ");

						for (int i = 0; i < dif; i++) {
							System.out.println("Looping");
							String text = we.getText().trim();
							System.out.println(" picker value is " + text);
							if (text.equals(value.trim())) {
								flag = true;
								break;
							}
							new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(centerX, YToSwipe))
							.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000)))
							.moveTo(PointOption.point(centerX, y - 10)).release().perform();

							System.out.println(i + "th iteration ");
						}
					}

					if (indexOfPickerValue > indexOfUserValue) {
						dif = indexOfPickerValue - indexOfUserValue;
						dif = Math.abs(dif);
						System.out.println("case of string ::  swiping down  ");
						for (int i = 0; i < dif; i++) {
							System.out.println("Looping");
							String text = we.getText().trim();
							System.out.println(" picker value is " + text);
							if (text.equals(value.trim())) {
								flag = true;
								break;
							}

							new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(centerX, y - 10))
							.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000)))
							.moveTo(PointOption.point(centerX, YToSwipe)).release().perform();

							System.out.println(i + "th iteration ");
						}

					}

				} else {
					return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
							.setMessage("List not contains user given value").make();

				}
			}
		}
		if (!flag)
			return Result.FAIL(ResultCodes.ERROR_USER_ASSERTED_FAILURE).setOutput(false).make();
		else
			return Result.PASS().setOutput(true).setMessage(" Algo finished ").make();
	}

	public boolean setPickerWheel(String text, String order, WebElement we) throws ToolNotSetException {

		Rectangle rect = we.getRect();
		int x = rect.x;
		int y = rect.y;
		int height = rect.height;
		int width = rect.width;

		System.out.println("x y width height  " + x + " " + y + " " + width + " " + height);

		System.out.println("setPickerWheel(): text: '" + text + "',order: '" + order + "'"); // always log your actions

		// className("XCUIElementTypePickerWheel"));

		// limit search time to avoid infinite loops
		String resultText;
		Long startTime = System.currentTimeMillis();
		int sec = Context.current().getKeywordRemaningSeconds();
		do {
			resultText = we.getText();
			System.out.println("## text is :: " + resultText);
			if (resultText.equals(text)) {
				System.out.println("## text matched");
				return true;
			}
			if (!selectPickerWheelIOS((MobileElement) we, order)) {
				System.out.println("## returning false ");

				return false;
			}
		} while (System.currentTimeMillis() < startTime + (sec - 8) * 1000); // 60 sec MAX
		System.out.println("## setPickerWheel returning :: false  ");
		return false;
	}

	public boolean selectPickerWheelIOS(MobileElement el, String order) throws ToolNotSetException {
		System.out.println("selectPickerWheelIOS(): order: '" + order + "'"); // always log your actions
		HashMap<String, Object> params = new HashMap<>();
		params.put("order", order.toLowerCase());
		params.put("offset", "0.1"); // tap offset
		params.put("element", el.getId()); // pickerWheel element
		try {
			Finder.findAppiumDriver().executeScript("mobile: selectPickerWheelValue", params);
			return true;
		} catch (InvalidElementStateException e1) {
			System.out.println("selectPickerWheelIOS(): FAILED\n" + e1.getMessage());
		} catch (InvalidArgumentException e2) {
			System.out.println("selectPickerWheelIOS(): FAILED\n" + e2.getMessage());
		} catch (Exception e3) {
			System.out.println("selectPickerWheelIOS(): FAILED\n" + e3.getMessage());
		}
		return false;
	}

}
