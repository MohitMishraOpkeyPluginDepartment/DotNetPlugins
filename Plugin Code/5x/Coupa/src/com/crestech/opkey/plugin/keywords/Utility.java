package com.crestech.opkey.plugin.keywords;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.InvalidArgumentException;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

import com.crestech.opkey.plugin.codedfl.NotImplementedOSException;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.webdriver.Finder;
import com.crestech.opkey.plugin.webdriver.OpkeyLogger;
import com.crestech.opkey.plugin.webdriver.WebDriverDispatcher;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ObjectNotFoundException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.TimeOut_ObjectNotFoundException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ToolNotSetException;
import com.crestech.opkey.plugin.webdriver.keywords.Utils;
import com.crestech.opkey.plugin.webdriver.keywords.WebObjects;

public class Utility {

	static Class<Utility> _class = Utility.class;

	public static String validateCSS(String css) {
		String[] str = css.split(">");
		String parCss = null;
		if (str[0].trim().equalsIgnoreCase("html")) {

			parCss = css.substring(14);
			if (str[2].trim().contains("table")) {

				parCss = css.substring(14 + str[2].trim().length() + 3);
			}
		}

		if (str[0].trim().contains("table")) {

			parCss = css.substring(str[0].trim().length() + 3);
		}

		if (parCss != null) {

			System.out.println("parCss CSS SELECTOR IS AS :: " + parCss);
			return parCss;
		}
		String[] split = css.split(">");
		if (split[0].contains(":")) {
			css = css.substring(split[0].length() + 2, css.length());
		}
		System.out.println("CSS SELECTOR IS AS :: " + css);
		return css;
	}

	public static List<WebElement> findElementsByTextWithBeforeAfter(String text, int index, boolean isContains,
			String before, String after) throws ToolNotSetException, ObjectNotFoundException, InterruptedException,
			TimeOut_ObjectNotFoundException, NotImplementedOSException {

		boolean isBefore = false;
		boolean isAfter = false;
		if (!before.trim().isEmpty()) {
			isBefore = true;
		}
		if (!after.trim().isEmpty()) {
			isAfter = true;
		}

		List<WebElement> beforeEles;
		List<WebElement> afterEles;
		List<WebElement> finalEles = new ArrayList<>();

		if (isBefore && isAfter) {
			WebElement beforeEle = null;
			WebElement afterEle = null;
			try {
				beforeEle = Finder.findElementByText(before, isContains, 0).get(0);
			} catch (Exception e) {
				return finalEles;
				/*- return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage("Before Text <" + before + "> is not Found").setOutput(false).make();*/
			}

			beforeEles = new Finder().findElementByTextDirection(text, isContains, index, beforeEle, true);

			try {
				afterEle = new Finder().findElementByTextInCurrentDom(after, isContains, 0).get(0);
			} catch (Exception e) {
				return finalEles;
				/*- return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage("After Text <" + after + "> is not found").setOutput(false).make();*/
			}

			afterEles = new Finder().findElementByTextDirection(text, isContains, index, afterEle, false);

			finalEles.addAll(beforeEles);
			finalEles.retainAll(afterEles);

		} else if (isBefore) {
			OpkeyLogger.printSaasLog(_class, "Before");
			WebElement beforeEle = null;
			try {
				beforeEle = Finder.findElementByText(before, isContains, 0).get(0);
			} catch (Exception e) {
				return finalEles;
				/*- return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage("Before Text <" + before + "> is not found").setOutput(false).make();*/
			}
			finalEles = new Finder().findElementByTextDirection(text, isContains, index, beforeEle, true);
			Collections.reverse(finalEles);

		} else if (isAfter) {
			OpkeyLogger.printSaasLog(_class, "After");
			WebElement afterEle = null;
			try {
				afterEle = Finder.findElementByText(after, isContains, 0).get(0);
			} catch (Exception e) {
				return finalEles;
				/*- return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage("After Text <" + after + "> is not found").setOutput(false).make();*/
			}

			finalEles = new Finder().findElementByTextDirection(text, isContains, index, afterEle, false);

		}

		return finalEles;
	}

	public String getCellText(WebElement cell)
			throws ToolNotSetException, ObjectNotFoundException, InterruptedException {
		String cellText = com.crestech.opkey.plugin.webdriver.keywords.Utils.shadow_getObjectText(cell).getOutput();

		List<WebElement> inputs = cell.findElements(By.xpath(
				"./*[not(@style='display:none')]//input[not(@type='hidden')] | ./*[not(@style='display:none')]//textarea[not(@type='hidden')]"));

		if (inputs.size() > 0)
			inputs = Utils.visible(inputs);

		if (inputs.size() > 0) {
			String tempCellText = "";
			cellText = tempCellText;
			for (WebElement input : inputs) {
				cellText = cellText
						+ com.crestech.opkey.plugin.webdriver.keywords.Utils.shadow_getObjectText(input).getOutput();
			}
		}

		return cellText;
	}

	public FunctionResult OF_ElementClick(WebElement ele) throws Exception {

		if (WebDriverDispatcher.lastChance) {
			System.out.println("@@@: USING JAVASCRIP");
			return Method_clickUsingJavaScript(ele);
		}

		else {

			try {
				moveToElement(ele);
				new WebObjects().ClickElement(ele);
			} catch (InvalidArgumentException e) {
				OpkeyLogger.printSaasLog(_class,
						"Invalid Argument Throwing Exception So Again Attemping Using Javascrip");
				return Method_clickUsingJavaScript(ele);
			} catch (WebDriverException e) {
				if (e.toString().contains("Element is obscured")) {
					OpkeyLogger.printSaasLog(_class, "Found Element as Obscured. Going to click via Action class");
					return Method_clickUsingJavaScript(ele);
				} else
					throw e;
			}
		}

		return Result.PASS().setOutput(true).make();
	}

	

	private void moveToElement(WebElement element) {
		try {
			Actions act = new Actions(Finder.findWebDriver());
			act.moveToElement(element).build().perform();
		} catch (Exception e) {
		}
	}

	public FunctionResult Method_clickUsingJavaScript(WebElement ele) throws ToolNotSetException {
		new WebObjects().Method_clickUsingJavaScript(ele);
		return Result.PASS().setOutput(true).make();
	}
}
