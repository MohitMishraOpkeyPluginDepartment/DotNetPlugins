package com.plugin.appium.keywords.GenericKeyword.actionByText;

import java.awt.AWTException;
import java.awt.Robot;
import java.awt.event.KeyEvent;
import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Point;
import org.openqa.selenium.Rectangle;
import org.openqa.selenium.UnhandledAlertException;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functioncall.MobileApplication;
import com.crestech.opkey.plugin.communication.contracts.functioncall.MobileDevice;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.AppiumObjectProperty;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.Validations;
import com.plugin.appium.annotations.keywordValidation.KeywordActionType;
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInHybridApplication;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.ActionType;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.enums.ElementType;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.KeywordMethodOrArgumentValidationFailException;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.TimeOut_ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.AppiumSpecificKeyword.Connect2AppiumServer;
import com.plugin.appium.keywords.AppiumSpecificKeyword.Gestures;
import com.plugin.appium.keywords.GenericKeyword.Checkbox;
import com.plugin.appium.keywords.GenericKeyword.Deprecate;
import com.plugin.appium.keywords.GenericKeyword.EditBox;
import com.plugin.appium.keywords.GenericKeyword.ObjectProperty;
import com.plugin.appium.keywords.GenericKeyword.WebObjects;
import com.plugin.appium.util.Checkpoint;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.TouchAction;
import io.appium.java_client.touch.LongPressOptions;
import io.appium.java_client.touch.TapOptions;
import io.appium.java_client.touch.WaitOptions;
import io.appium.java_client.touch.offset.ElementOption;
import io.appium.java_client.touch.offset.PointOption;

public class ActionByText implements KeywordLibrary {
	EditBox editbox = new EditBox();
	public static int count = 0;

	public FunctionResult Method_ClickByText(String text, int count, boolean contains) throws Exception {
		return Method_clickByText(text, count, contains, null, "", "");

	}

	public FunctionResult Method_selectRadioButtonByText(String textToSearch, int index, boolean isContains,
			boolean before, AppiumObject object) throws Exception {

		if (object.getTextToSearch().getValue() != null && (!object.getTextToSearch().getValue().isEmpty()
				|| !object.getTextToSearch().getValue().equals(""))) {
			Log.print(object.getTextToSearch().getValue());
			textToSearch = object.getTextToSearch().getValue();
			Log.print(object.getIndex().getValue());
			try {
				index = Integer.parseInt(object.getIndex().getValue());
			} catch (Exception ex) {
				Log.print("Index found Not to be Integer.Considering 0 as new Index");
				index = 0;
			}
			Log.print(object.getPartialText().getValue());
			try {
				isContains = Boolean.parseBoolean(object.getPartialText().getValue());
			} catch (Exception ex) {
				Log.print("PartialText found Not to be Boolean.Considering False as Default");
				isContains = false;
			}
			try {
				before = Boolean.parseBoolean(object.getBefore().getValue());
			} catch (Exception ex) {
				Log.print("Before Not Found.Considering False as Default");
				before = false;
			}
		} else {
			Validations.checkDataForBlank(0);
			FunctionResult fr = null;
			try {
				if (textToSearch.trim().isEmpty()) {
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setOutput(false)
							.setMessage("TextToSearch is missing").make();
				}
				fr = selectRadioHelper(textToSearch, index, isContains, before);
			} catch (Exception ex) {
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
						.setMessage("No Object Found With Text <" + Context.current().getFunctionCall()
								.getDataArguments().getDataArgument().get(0).getValue() + ">")
						.make();
			}
			if (fr.getOutput().equalsIgnoreCase("false")) {
				fr.setMessage("No Object Found With Text <"
						+ Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue()
						+ ">");
			}
			return fr;
		}

		FunctionResult fr = null;
		try {
			fr = selectRadioHelper(textToSearch, index, isContains, before);
		} catch (Exception ex) {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
					.setMessage("No Object Found With Text <" + textToSearch + ">").make();
		}
		if (fr.getOutput().equalsIgnoreCase("false")) {
			fr.setMessage("No Object Found With Text <" + textToSearch + ">");
		}
		return fr;

	}

	public FunctionResult selectRadioHelper(String textToSearch, int index, boolean isContains, boolean before)
			throws Exception {

		ObjectProperty byTextObject = new ObjectProperty(ElementType.RADIO, textToSearch, index, isContains, before);
		WebElement radio = FinderByText.findWebElement(byTextObject);

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
				try {

					if (radio.isSelected()) {
						return Result.PASS().setOutput(true).setMessage(ReturnMessages.ALREADY_CHECKED.toString())
								.make();
					}
					radio.click();
				} catch (Exception e) {
					if (radio.isSelected()) {
						return Result.PASS().setOutput(true).setMessage(ReturnMessages.ALREADY_CHECKED.toString())
								.make();
					}
					new WebObjects().Method_clickUsingJavaScript(radio);
				}
				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	public FunctionResult Method_selectCheckBoxByText(String OtextToSearch, int Oindex, boolean OisContains,
			boolean Obefore, String Ostatus, AppiumObject Oobject) throws Exception {
		Log.print("@New ByText");

		if (!Ostatus.equalsIgnoreCase("ON") && !Ostatus.equalsIgnoreCase("OFF")) {
			throw new ArgumentDataInvalidException("Argument Data Invalid. Status: " + Ostatus);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				String textToSearch = OtextToSearch;
				int index = Oindex;
				boolean isContains = OisContains;
				boolean before = Obefore;
				String status = Ostatus;
				AppiumObject object = Oobject;
				if (object.getTextToSearch().getValue() != null && (!object.getTextToSearch().getValue().isEmpty()
						|| !object.getTextToSearch().getValue().equals(""))) {
					Log.print(object.getTextToSearch().getValue());
					textToSearch = object.getTextToSearch().getValue();
					Log.print(object.getIndex().getValue());
					try {
						index = Integer.parseInt(object.getIndex().getValue());
					} catch (Exception ex) {
						Log.print("Index found Not to be Integer.Considering 0 as new Index");
						index = 0;
					}
					Log.print(object.getPartialText().getValue());
					try {
						isContains = Boolean.parseBoolean(object.getPartialText().getValue());
					} catch (Exception ex) {
						Log.print("PartialText found Not to be Boolean.Considering False as Default");
						isContains = false;
					}
					try {
						before = Boolean.parseBoolean(object.getBefore().getValue());
					} catch (Exception ex) {
						Log.print("Before Not Found.Considering False as Default");
						before = false;
					}
				} else {
					Validations.checkDataForBlank(0);
					FunctionResult fr = null;
					try {
						fr = selectCheckBoxHelper(textToSearch, index, isContains, before, status);
					} catch (Exception ex) {
						return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
								.setMessage("No Object Found With Text <" + Context.current().getFunctionCall()
										.getDataArguments().getDataArgument().get(0).getValue() + ">")
								.make();
					}
					if (fr.getOutput().equalsIgnoreCase("false")) {
						fr.setMessage("No Object Found With Text <" + Context.current().getFunctionCall()
								.getDataArguments().getDataArgument().get(0).getValue() + ">");
					}
					return fr;
				}

				FunctionResult fr = null;
				try {
					fr = selectCheckBoxHelper(textToSearch, index, isContains, before, status);
				} catch (Exception ex) {
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
							.setMessage("No Object Found With Text <" + textToSearch + ">").make();
				}
				if (fr.getOutput().equalsIgnoreCase("false")) {
					fr.setMessage("No Object Found With Text <" + textToSearch + ">");
				}
				return fr;

			}
		}.run();
	}

	public FunctionResult selectCheckBoxHelper(String textToSearch, int index, boolean isContains, boolean before,
			String Ostatus) throws Exception {
		try {
			Validations.checkDataForBlank(4);
		} catch (Exception ex) {
			Ostatus = "ON";
		}
		String status = Ostatus;
		ObjectProperty byTextObject = new ObjectProperty(ElementType.CHECKBOX, textToSearch, index, isContains, before);
		WebElement element = FinderByText.findWebElement(byTextObject);
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
				if (AppiumContext.isBrowserOrWebviewMode())
					return selectCheckBox_Web(element, status);
				else {
					return new Checkbox().selectCheckBox(element, status);
				}
			}
		}.run();
	}

	public FunctionResult selectCheckBox_Web(WebElement element, String statusS) throws Exception {

		new Utils().scrollMid(element);
		boolean isChecked = element.isSelected();
		String status = statusS;
		status = status.toUpperCase();
		// Check CheckBox Is Checked Or Not
		if ((isChecked) && status.contentEquals("ON")) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.ALREADY_CHECKED.toString()).make();
		} else if ((status.contentEquals("ON") && (!isChecked)) || (status.contentEquals("OFF") && (isChecked))) {
			try {
				Log.print("Clicking");
				element.click();

				Log.print("Selected : " + element.isSelected());
				Log.print("Condition : " + (!element.isSelected() && !status.contentEquals("OFF")));

				// If click fails to select checkbox
				try {
					if (!element.isSelected() && !status.contentEquals("OFF")) {
						new WebObjects().Method_clickUsingJavaScript(element);
					}
				} catch (Exception e) {
				}
			} catch (Exception e) {
				if (e.getMessage().contains("is not clickable at point"))
					new WebObjects().Method_clickUsingJavaScript(element);
			}

			// If All fail let's check if label have 'for' attribute can tick the checkbox
			try {
				if (!element.isSelected() && !status.contentEquals("OFF")) {
					String elementID = Utils.getAttrAndIgnoreExcecption(element, "id");
					if (elementID != null && !elementID.trim().isEmpty()) {
						Finder.findAppiumDriver().findElement(By.xpath("//label[@for='" + elementID + "']")).click();
					}
				}
			} catch (UnhandledAlertException e) {
				// DO Nothing
			}

			return Result.PASS().setOutput(true).make();
		} else if ((!isChecked) && status.contentEquals("OFF")) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.UNCHECK.toString()).make();
		} else {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
					.setMessage("Please provide valid Status<ON/OFF>").make();
		}

	}

	public FunctionResult Method_deSelectCheckBoxByText(String textToSearch, int index, boolean isContains,
			boolean before, AppiumObject object) throws Exception {
		Log.print("@New ByText");
		if (object.getTextToSearch().getValue() != null && (!object.getTextToSearch().getValue().isEmpty()
				|| !object.getTextToSearch().getValue().equals(""))) {
			Log.print(object.getTextToSearch().getValue());
			textToSearch = object.getTextToSearch().getValue();
			Log.print(object.getIndex().getValue());
			try {
				index = Integer.parseInt(object.getIndex().getValue());
			} catch (Exception ex) {
				Log.print("Index found Not to be Integer.Considering 0 as new Index");
				index = 0;
			}
			Log.print(object.getPartialText().getValue());
			try {
				isContains = Boolean.parseBoolean(object.getPartialText().getValue());
			} catch (Exception ex) {
				Log.print("PartialText found Not to be Boolean.Considering False as Default");
				isContains = false;
			}
			try {
				before = Boolean.parseBoolean(object.getBefore().getValue());
			} catch (Exception ex) {
				Log.print("Before not to be Boolean.Considering False as Default");
				before = false;
			}
		} else {
			Validations.checkDataForBlank(0);
			FunctionResult fr = null;
			try {
				fr = deSelectCheckBoxHelper(textToSearch, index, isContains, before);
			} catch (Exception ex) {
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
						.setMessage("No Object Found With Text <" + Context.current().getFunctionCall()
								.getDataArguments().getDataArgument().get(0).getValue() + ">")
						.make();
			}
			if (fr.getOutput().equalsIgnoreCase("false")) {
				fr.setMessage("No Object Found With Text <"
						+ Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue()
						+ ">");
			}
			return fr;
		}
		FunctionResult fr = null;
		try {
			fr = deSelectCheckBoxHelper(textToSearch, index, isContains, before);
		} catch (Exception ex) {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
					.setMessage("No Object Found With Text <" + textToSearch + ">").make();
		}
		if (fr.getOutput().equalsIgnoreCase("false")) {
			fr.setMessage("No Object Found With Text <" + textToSearch + ">");
		}
		return fr;
	}

	public FunctionResult deSelectCheckBoxHelper(String textToSearch, int index, boolean isContains, boolean before)
			throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				ObjectProperty byTextObject = new ObjectProperty(ElementType.CHECKBOX, textToSearch, index, isContains,
						before);
				WebElement myCheckBox = FinderByText.findWebElement(byTextObject);
				if (AppiumContext.isBrowserOrWebviewMode())
					return deSelectCheckBox_Web(myCheckBox);
				else
					return new Checkbox().selectCheckBox(myCheckBox, "OFF");
			}
		}.run();
	}

	public FunctionResult deSelectCheckBox_Web(WebElement myCheckBox) throws Exception {
		// if CheckBox Is Check Then Ucheck It
		if (myCheckBox.isSelected()) {
			try {
				myCheckBox.click();
				// If click fails to deselect checkbox
				if (myCheckBox.isSelected()) {
					new WebObjects().Method_clickUsingJavaScript(myCheckBox);
				}
			} catch (Exception e) {
				Log.print("@Exception While Deselecting");
				if (e.getMessage().contains("org.openqa.selenium.WebDriverException: unknown error:")
						&& e.getMessage().contains("is not clickable at point"))
					;
				new WebObjects().Method_clickUsingJavaScript(myCheckBox);
			}

			return Result.PASS().setOutput(true).make();
		} else
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.UNCHECK.toString()).make();
	}

	public FunctionResult Method_clickImageByAltText(String altOrTitle, int index, boolean isContains)
			throws Exception {
		Log.print("@New ByText");
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				ObjectProperty byTextObject = new ObjectProperty(ElementType.IMAGE, altOrTitle, index, isContains,
						false);
				byTextObject.setTag("img");
				WebElement ele = FinderByText.findWebElement(byTextObject);
				ele.click();
				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	/**
	 * Checkpoint Supported
	 * 
	 * @param text
	 * @param count
	 * @return
	 * @throws Exception
	 */
	// @KeywordArgumentValidation(checkDataForBlank = { 0, 1 },
	// checkDataForWhiteSpace = { 0, 1 })
	public FunctionResult Method_clickByText(String Otext, int Oindex, boolean OisContains, AppiumObject object,
			String Obefore, String Oafter) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
				String text = Otext;
				int index = Oindex;
				boolean isContains = OisContains;
				String before = Obefore;
				String after = Oafter;

				if(object != null)
				{
				if (object.getTextToSearch().getValue() != null && (!object.getTextToSearch().getValue().isEmpty()
						|| !object.getTextToSearch().getValue().equals(""))) {
					Log.print("Text: " + object.getTextToSearch().getValue());
					Log.print("Before: " + object.getBefore().getValue());
					Log.print("After: " + object.getAfter().getValue());
					text = object.getTextToSearch().getValue();
					before = object.getBefore().getValue();
					after = object.getAfter().getValue();
					if (before == null)
						before = "";
					if (after == null)
						after = "";
					Log.print(object.getIndex().getValue());
					try {
						index = Integer.parseInt(object.getIndex().getValue());
					} catch (Exception ex) {
						Log.print("Index found Not to be Integer.Considering 0 as new Index");
						index = 0;
					}
					try {
						isContains = Boolean.parseBoolean(object.getPartialText().getValue());
					} catch (Exception ex) {
						Log.print("PartialText found Not to be Boolean.Considering False as Default");
						isContains = false;
					}
				}
				}

				Log.print("Text: " + text);
				Log.print("index: " + index);
				Log.print("isContains: " + isContains);
				Log.print("before: " + before);
				Log.print("after: " + after);

				// Validations.checkDataForNegative(1);
				FunctionResult fr = clickByTextHelper(text, index, isContains, before, after);
				if(object != null)
				{
				if (object.getTextToSearch().getValue() != null
						&& (!object.getTextToSearch().getValue().isEmpty()
								|| !object.getTextToSearch().getValue().equals(""))
						&& fr.getOutput().equalsIgnoreCase("false")) {
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
							.setMessage("No Object Found With Text <" + text + ">").make();
				}
				}
				return fr;
				// return Result.PASS().make();

			}
		}.run();
	}

	/**
	 * checkpoint Supported
	 * 
	 * @throws Exception
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_SelectByText(String text) throws Exception {
		return Method_clickByText(text, 0, true, new AppiumObject(false), null, null);
	}

	public FunctionResult Method_selectDropDownByText(String textSearch, int index, boolean isContains,
			String dropdownText, boolean before, boolean isMultipleDropdown, AppiumObject object) throws Exception {
		Log.print("@New ByText");

		if (object.getTextToSearch().getValue() != null && (!object.getTextToSearch().getValue().isEmpty()
				|| !object.getTextToSearch().getValue().equals(""))) {
			Log.print(object.getTextToSearch().getValue());
			textSearch = object.getTextToSearch().getValue();
			Log.print(object.getIndex().getValue());
			try {
				index = Integer.parseInt(object.getIndex().getValue());
			} catch (Exception ex) {
				Log.print("Index found Not to be Integer.Considering 0 as new Index");
				index = 0;
			}
			Log.print(object.getPartialText().getValue());
			try {
				isContains = Boolean.parseBoolean(object.getPartialText().getValue());
			} catch (Exception ex) {
				Log.print("PartialText found Not to be Boolean.Considering False as Default");
				isContains = false;
			}

			try {
				before = Boolean.parseBoolean(object.getBefore().getValue());
				Log.print("before:" + before);
			} catch (Exception ex) {
				Log.print("PartialText found Not to be Boolean.Considering False as Default");
				isContains = false;
			}
		} else {
			Validations.checkDataForBlank(0);
			FunctionResult fr = selectDropDownHelper(textSearch, index, isContains, dropdownText, before,
					isMultipleDropdown);
			if (fr.getOutput().equalsIgnoreCase("false")) {
				fr.setMessage("No Object Found With Text <"
						+ Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue()
						+ ">");
			}
			return fr;
		}
		FunctionResult fr = selectDropDownHelper(textSearch, index, isContains, dropdownText, before,
				isMultipleDropdown);
		if (fr.getOutput().equalsIgnoreCase("false")) {
			fr.setMessage("No Object Found With Text <" + textSearch + ">");
		}
		return fr;
	}

	private FunctionResult selectDropDownHelper(String OlabelSearch, int Oindex, boolean OisContains,
			String dropdownText, boolean before, boolean isMultipleDropdown) throws Exception {
		String finalDropdownText = dropdownText.trim();
		ObjectProperty byTextObject = new ObjectProperty(ElementType.SELECT, OlabelSearch, Oindex, OisContains, before);
		WebElement dropdownElement = FinderByText.findWebElement(byTextObject);
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				if (dropdownElement == null)
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
							.setMessage("Dropdown not found With Text <" + Context.current().getFunctionCall()
									.getDataArguments().getDataArgument().get(0).getValue() + ">")
							.make();

				return selectDropDownOptionByText(dropdownElement, isMultipleDropdown, finalDropdownText);

			}
		}.run();
	}

	public FunctionResult Method_SelectByText(String textSearch, int index, boolean isContains,
			boolean isMultipleDropdown) throws Exception {

		ObjectProperty byTextObject = new ObjectProperty(ElementType.SELECT_BY_TEXT, textSearch, index, isContains,
				false);
		byTextObject.setiS_MultipleDropdown(isMultipleDropdown);
		WebElement ele = FinderByText.findWebElement(byTextObject);

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
				Robot robot = new Robot();

				if (ele.getTagName().toLowerCase().equals("option") && isMultipleDropdown) {
					robot.keyPress(KeyEvent.VK_CONTROL);
					ele.click();
					robot.keyRelease(KeyEvent.VK_CONTROL);
					return Result.PASS().setOutput(true).make();
				} else if (ele.getTagName().toLowerCase().equals("option")) {
					// For MAC Safari
					((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("arguments[0].selected=true;", ele);
					ele.click();
					return Result.PASS().setOutput(true).make();
				}

				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND)
						.setMessage("No Object Found With Text <" + textSearch + ">").setOutput(false).make();
			}
		}.run();
	}

	public FunctionResult selectDropDownOptionByText(WebElement dropdownElement, boolean isMultipleDropdown,
			String dropdownText) throws ToolNotSetException, InterruptedException, AWTException {

		Select select = new Select(dropdownElement);
		if (!isMultipleDropdown) {
			try {
				// For Selecting in MAC Safari
				/*
				 * if (!(OsCheck.getOperatingSystemType() == OSType.Windows) &&
				 * Utils.getBrowserName().toLowerCase().contains("safari")) { List<WebElement>
				 * option = dropdownElement.findElements(By.tagName("option")); for (WebElement
				 * webElement : option) { Log.print("Comparing Select Option: " +
				 * webElement.getText()); if (webElement.getText().equals(dropdownText)) {
				 * ((JavascriptExecutor)
				 * Finder.findWebDriver()).executeScript("arguments[0].selected=true;",
				 * webElement); break; } } } else {
				 */
				select.selectByVisibleText(dropdownText);
				// }
			} catch (Exception e) {
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage("No Object Found With Text <"
						+ Context.current().getFunctionCall().getDataArguments().getDataArgument().get(3).getValue()
						+ ">").setOutput(false).make();
			}
			return Result.PASS().setOutput(true).make();
		}

		Robot robot = new Robot();
		robot.keyPress(KeyEvent.VK_CONTROL);
		try {
			select.selectByVisibleText(dropdownText);
		} catch (Exception e) {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND)
					.setMessage("No Object Found With Text <"
							+ Context.current().getFunctionCall().getDataArguments().getDataArgument().get(3).getValue()
							+ ">")
					.setOutput(false).make();
		}
		robot.keyRelease(KeyEvent.VK_CONTROL);

		return Result.PASS().setOutput(true).make();

	}

	public FunctionResult Method_typeTextUsingText(String OtextSearch, int Oindex, boolean OisContains,
			String textValue, boolean Obefore, AppiumObject object) throws Exception {
		return this.typeByText(OtextSearch, Oindex, OisContains, textValue, Obefore, object);
	}

	/**
	 * Checkpoint Supported
	 * 
	 * @param text
	 * @param count
	 * @param textToEnter
	 * @return
	 * @throws Exception
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1, 2 }, checkDataForWhiteSpace = { 0, 1, 2 })
	public FunctionResult typeByText(String OtextSearch, int Oindex, boolean OisContains, String textValue,
			boolean Obefore, AppiumObject object) throws Exception {

		String textSearch = OtextSearch;
		int index = Oindex;
		boolean isContains = OisContains;
		boolean before = Obefore;

		if (object.getTextToSearch().getValue() != null && (!object.getTextToSearch().getValue().isEmpty()
				|| !object.getTextToSearch().getValue().equals(""))) {
			textSearch = object.getTextToSearch().getValue();
			Log.print(object.getIndex().getValue());
			try {
				index = Integer.parseInt(object.getIndex().getValue());
			} catch (Exception ex) {
				Log.print("Index found Not to be Integer.Considering 0 as new Index");
				index = 0;
			}
			try {
				isContains = Boolean.parseBoolean(object.getPartialText().getValue());
			} catch (Exception ex) {
				Log.print("PartialText found Not to be Boolean.Considering False as Default");
				isContains = false;
			}
			try {
				before = Boolean.parseBoolean(object.getBefore().getValue());
			} catch (Exception ex) {
				Log.print("PartialText found Not to be Boolean.Considering False as Default");
				before = false;
			}
		} else {
			FunctionResult fr = null;
			fr = typeTextUsingTextHelper(textSearch, index, isContains, textValue, before);

			return fr;
		}
		FunctionResult fr = null;
		fr = typeTextUsingTextHelper(textSearch, index, isContains, textValue, before);
		if (fr.getOutput().equalsIgnoreCase("false")) {
			fr.setMessage("No Object Found With Text <" + textSearch + ">");
		}
		return fr;
	}

	/**
	 * Checkpoint not Required
	 * 
	 * @return
	 * @throws ToolNotSetException
	 */
	public FunctionResult Method_getPageSource() throws ToolNotSetException {
		String source = Finder.findAppiumDriver().getPageSource();
		return Result.PASS().setOutput(source).make();
	}

	/**
	 * Checkpoint not Required
	 * 
	 * @param direction
	 * @return
	 * @throws ToolNotSetException
	 * @throws InterruptedException
	 * @throws KeywordMethodOrArgumentValidationFailException
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_MobilitySwipe(String direction)
			throws ToolNotSetException, InterruptedException, KeywordMethodOrArgumentValidationFailException {
		if (direction.equalsIgnoreCase("left")) {
			new Gestures().Method_SwipeLeft();
		} else if (direction.equalsIgnoreCase("right")) {
			new Gestures().Method_SwipeRight();
		} else if (direction.equalsIgnoreCase("up")) {
			new Gestures().Method_ScrollDown();
		} else if (direction.equalsIgnoreCase("down")) {
			new Gestures().Method_ScrollUp();
		}
		return Result.PASS().setOutput(true).make();
	}

	// @SuppressWarnings({ "rawtypes" })
	// @KeywordArgumentValidation(checkDataForBlank = { 0, 1, 2 },
	// checkDataForWhiteSpace = { 0, 1, 2 })
	// public FunctionResult Method_SwipeToText(String text, int count, boolean
	// contains) throws ToolNotSetException {
	// int limit = 0;
	// Element eleFound = null;
	// AppiumDriver driver = Finder.findAppiumDriver();
	// // JavascriptExecutor js = (JavascriptExecutor) driver;
	// int height = Connect2AppiumServer.dim.getHeight();
	// int width = Connect2AppiumServer.dim.getWidth() / 2;
	// for (int i = 1; i <= 2; i++) {
	//
	//// new TouchAction(Finder.findAppiumDriver()).press(width, 70).moveTo(0,
	// (height - 80)).release().perform();
	//
	// new TouchAction(driver).press(PointOption.point(width, 70))
	// .waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)))
	// .moveTo(PointOption.point(0, (height - 80))).release().perform();
	// }
	// height = height / 2;
	// // HashMap<String, String> swipeObject = new HashMap<String, String>();
	// do {
	// String source = driver.getPageSource();
	// Document html = Jsoup.parse(source);
	// // System.out.println(html);
	// ArrayList<Element> list = new ArrayList<Element>();
	// if (contains) {
	// for (Element element : html.getAllElements()) {
	// if (element.attr("name").toLowerCase().contains(text.toLowerCase())) {
	// // System.out.println("SYSO OBJECT FOUND :::: " +
	// // element);
	// list.add(element);
	// }
	// }
	// if (list.isEmpty()) {
	// list = html.getElementsByAttributeValue("name", text);
	// }
	// } else {
	// for (Element element : html.getAllElements()) {
	// if (element.attr("name").toLowerCase().equals(text.toLowerCase())) {
	// // System.out.println("SYSO OBJECT FOUND :::: " +
	// // element);
	// list.add(element);
	// }
	// }
	// if (list.isEmpty()) {
	// list = html.getElementsByAttributeValue("name", text);
	// }
	// if (list.isEmpty()) {
	// for (Element element : html.getAllElements()) {
	// if (element.attr("name").toLowerCase().contains(text.toLowerCase())) {
	// // System.out.println("SYSO OBJECT FOUND :::: " +
	// // element);
	// list.add(element);
	// }
	// }
	// }
	// }
	// Element ele = null;
	// try {
	// ele = list.get(count);
	// eleFound = ele;
	// int x = Integer.parseInt(ele.attr("x"));
	// int y = Integer.parseInt(ele.attr("y"));
	// System.out.println("LOCATION FOUND IS AS ::: X=" + x + " Y=" + y);
	// if (y != 0 && (y > 0 && y < Connect2AppiumServer.dim.getHeight())) {
	// System.out.println("************");
	// break;
	// }
	// if (firstElementDisplayed(html) > getPositionElementByText(html, text)) {
	// System.out.println("*****************INSIDE IF UP");
	//// new TouchAction(Finder.findAppiumDriver()).press(width, height).moveTo(0,
	// height).release().perform();
	// new TouchAction(driver).press(PointOption.point(width, height))
	// .waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)))
	// .moveTo(PointOption.point(0, height)).release().perform();
	// /*
	// * swipeObject.put("direction", "up"); js.executeScript("mobile: scroll",
	// swipeObject);
	// */
	// } else if (y < 0) {
	//// new TouchAction(Finder.findAppiumDriver()).press(width, height).moveTo(0,
	// height).release().perform();
	// new TouchAction(driver).press(PointOption.point(width, height))
	// .waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)))
	// .moveTo(PointOption.point(0, height)).release().perform();
	// } else {
	// try {
	// System.out.println("*****************INSIDE TRY1");
	//// new TouchAction(Finder.findAppiumDriver()).press(width, height).moveTo(0,
	// -height).release().perform();
	// new TouchAction(driver).press(PointOption.point(width, height))
	// .waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)))
	// .moveTo(PointOption.point(0, -height)).release().perform();
	// /*
	// * swipeObject = new HashMap<String, String>(); swipeObject.put("direction",
	// "down"); js.executeScript("mobile: scroll", swipeObject);
	// */
	// } catch (Exception ex) {
	// ex.printStackTrace();
	// System.out.println("*****************INSIDE Catch1");
	//// new TouchAction(Finder.findAppiumDriver()).press(width, height).moveTo(0,
	// -height).release().perform();
	// new TouchAction(driver).press(PointOption.point(width, height))
	// .waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)))
	// .moveTo(PointOption.point(0, -height)).release().perform();
	// /*
	// * swipeObject = new HashMap<String, String>(); swipeObject.put("direction",
	// "down"); js.executeScript("mobile: scroll", swipeObject);
	// */
	// }
	// }
	// } catch (IndexOutOfBoundsException x) {
	// try {
	// System.out.println("*****************INSIDE TRY2");
	//// new TouchAction(Finder.findAppiumDriver()).press(width, height).moveTo(0,
	// -height).release().perform();
	// new TouchAction(driver).press(PointOption.point(width, height))
	// .waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)))
	// .moveTo(PointOption.point(0, -height)).release().perform();
	// /*
	// * swipeObject = new HashMap<String, String>(); swipeObject.put("direction",
	// "down"); js.executeScript("mobile: scroll", swipeObject);
	// */
	// } catch (Exception ex) {
	// ex.printStackTrace();
	// System.out.println("*****************INSIDE Catch2");
	//// new TouchAction(Finder.findAppiumDriver()).press(width, height).moveTo(0,
	// -height).release().perform();
	// new TouchAction(driver).press(PointOption.point(width, height))
	// .waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)))
	// .moveTo(PointOption.point(0, -height)).release().perform();
	// /*
	// * swipeObject = new HashMap<String, String>(); swipeObject.put("direction",
	// "down"); js.executeScript("mobile: scroll", swipeObject);
	// */
	// }
	// }
	// limit++;
	// } while (limit < 8);
	// if (eleFound != null) {
	// int x = Integer.parseInt(eleFound.attr("x"));
	// int y = Integer.parseInt(eleFound.attr("y"));
	// if (!(y > 50 && y < (Connect2AppiumServer.dim.getHeight() - 100))) {
	// System.out.println("Final Scroll");
	//
	//// new TouchAction(Finder.findAppiumDriver()).press(width, height).moveTo(0,
	// -height).release().perform();
	// new TouchAction(driver).press(PointOption.point(width, height))
	// .waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)))
	// .moveTo(PointOption.point(0, -height)).release().perform();
	// /*
	// * swipeObject = new HashMap<String, String>(); swipeObject.put("direction",
	// "down"); js.executeScript("mobile: scroll", swipeObject);
	// */
	// }
	// } else {
	// return
	// Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setOutput(false).setMessage("Text
	// Not Found").make();
	// }
	// return Result.PASS().setOutput(true).make();
	// }

	/**
	 * Checkpoint Supported
	 * 
	 * @param object
	 * @return
	 * @throws Exception
	 */
	// public FunctionResult Method_SwipeToObject(AppiumObject object) throws
	// Exception {
	// WebElement ele = Finder.findWebElementUsingCheckPoint(object);
	// String text = Utils.getAttrAndIgnoreExcecption(ele,"name");
	// int limit = 0;
	// int counter = 2;
	// JavascriptExecutor js = (JavascriptExecutor) Finder.findAppiumDriver();
	// HashMap<String, String> swipeObject = new HashMap<String, String>();
	// if (!(text.isEmpty() || text.equals("") || text == null)) {
	// do {
	// try {
	// Point point = ele.getLocation();
	// int x = point.getX();
	// int y = point.getY();
	// System.out.println("LOCATION FOUND IS AS ::: X=" + x + " Y=" + y);
	// if (x != 0 && y != 0 && (y > 0 && y < Connect2AppiumServer.dim.getHeight()))
	// {
	// System.out.println("************");
	// break;
	// }
	// if (counter != 0) {
	// System.out.println("*****************INSIDE IF");
	// swipeObject.put("direction", "up");
	// js.executeScript("mobile: scroll", swipeObject);
	// counter--;
	// } else {
	// try {
	// System.out.println("*****************INSIDE TRY");
	// swipeObject = new HashMap<String, String>();
	// swipeObject.put("direction", "down");
	// js.executeScript("mobile: scroll", swipeObject);
	// } catch (Exception ex) {
	// ex.printStackTrace();
	// System.out.println("*****************INSIDE Catch");
	// swipeObject = new HashMap<String, String>();
	// swipeObject.put("direction", "down");
	// js.executeScript("mobile: scroll", swipeObject);
	// }
	// }
	// } catch (IndexOutOfBoundsException x) {
	// try {
	// System.out.println("*****************INSIDE TRY");
	// swipeObject = new HashMap<String, String>();
	// swipeObject.put("direction", "down");
	// js.executeScript("mobile: scroll", swipeObject);
	// } catch (Exception ex) {
	// ex.printStackTrace();
	// System.out.println("*****************INSIDE Catch");
	// swipeObject = new HashMap<String, String>();
	// swipeObject.put("direction", "down");
	// js.executeScript("mobile: scroll", swipeObject);
	// }
	// }
	// limit++;
	// } while (limit < 5);
	// } else {
	// return Method_SwipeToText(text, 0, false);
	// }
	// return Method_SwipeToText(text, 0, false);
	// }

	private static Integer getPositionElementByText(Document html, String text) {
		Elements list = html.getAllElements();
		int count = 0;
		for (Element element : list) {
			String name = element.attr("name");
			if (name.equalsIgnoreCase(text)) {
				break;
			}
			count++;
		}
		System.out.println("FIRST ELEMENT VISIBLE COUNT IS AS ::: " + count);
		return count;
	}

	private static Integer firstElementDisplayed(Document html) {
		Elements list = html.getAllElements();
		int count = 0;
		int y = 0;
		int x = 0;
		for (Element element : list) {
			try {
				x = Integer.parseInt(element.attr("x"));
				y = Integer.parseInt(element.attr("y"));
			} catch (Exception ex) {
				// ex.printStackTrace();
				// System.out.println("Not Able To Number Format");
			}
			if (!(element.attr("label").equalsIgnoreCase("Settings")
					|| element.attr("name").equalsIgnoreCase("astroNavBarLogo")
					|| element.tagName().equalsIgnoreCase("XCUIElementTypeButton")
					|| element.attr("label").equalsIgnoreCase("User"))) {
				if (x != 0 && y != 0) {
					break;
				}
			}
			count++;
		}
		System.out.println("FIRST ELEMENT COUNT IS AS ::: " + count);
		return count;
	}

	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_scrollToText(String text) throws ToolNotSetException, InterruptedException {
		int limit = 0;
		AppiumDriver<WebElement> driver = Finder.findAppiumDriver();
		JavascriptExecutor js = (JavascriptExecutor) driver;
		HashMap<String, String> swipeObject = new HashMap<String, String>();
		swipeObject.put("direction", "up");
		js.executeScript("mobile: scroll", swipeObject);
		int deviceWidth = driver.manage().window().getSize().getWidth();
		int deviceHeight = driver.manage().window().getSize().getHeight();
		String xpath = "//XCUIElementTypeStaticText[@name='" + text + "']";
		do {
			try {
				WebElement element = driver.findElementByXPath(xpath);
				xpath = "//" + element.getTagName() + "[@name='" + text + "']";
				Point point = element.getLocation();
				int x = point.getX();
				int y = point.getY();
				Dimension dim = element.getSize();
				int w = dim.getWidth();
				int h = dim.getHeight();
				System.out.println("X=" + x + " W=" + w + " x + w / 2 =" + (x + w / 2) + " DEVICEWIDTH" + deviceWidth);
				System.out.println("Y=" + y + " H=" + h + " y + h / 2 =" + (y + h / 2) + " DVICEHEIGHT" + deviceHeight);
				if (x == 0 && y == 0) {
					System.out.println("*****************INSIDE IF");
					limit++;
					swipeObject = new HashMap<String, String>();
					swipeObject.put("direction", "down");
					js.executeScript("mobile: scroll", swipeObject);
				} else {
					System.out.println("*****************INSIDE ELSE");
					break;
				}
			} catch (Exception ex) {
				ex.printStackTrace();
				System.out.println("*****************INSIDE Catch");
				limit++;
				swipeObject = new HashMap<String, String>();
				swipeObject.put("direction", "down");
				js.executeScript("mobile: scroll", swipeObject);
			}
		} while (limit < 5);
		return Result.PASS().setOutput(true).make();
	}

	/**
	 * Checkpoint Not Required
	 * 
	 * @param object
	 * @param type
	 * @param pname
	 * @param pvalue
	 * @param expected
	 * @return
	 * @throws ToolNotSetException
	 * @throws ObjectNotFoundException
	 * @throws InterruptedException
	 * @throws TimeOut_ObjectNotFoundException
	 */

	public FunctionResult Method_verifyChildObjectCount(AppiumObject object, String type, String pname, String pvalue,
			int expected)
			throws ToolNotSetException, ObjectNotFoundException, InterruptedException, TimeOut_ObjectNotFoundException {

		return Method_VerifyChildObjectCount(object, type, pname, pvalue, expected);

	}

	@KeywordArgumentValidation(checkDataForBlank = { 0, 1, 2, 3 }, checkDataForWhiteSpace = { 0, 1, 2, 3 })
	public FunctionResult Method_VerifyChildObjectCount(AppiumObject object, String type, String pname, String pvalue,
			int expected)
			throws ToolNotSetException, ObjectNotFoundException, InterruptedException, TimeOut_ObjectNotFoundException {
		FunctionResult fr = new Deprecate().Method_getChildObjectCount(object, type, pname, pvalue);
		int actualFound = Integer.parseInt(fr.getOutput());
		if (actualFound == expected) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.VERFIYED.toString()).make();
		} else {
			return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
					.setMessage(ReturnMessages.verificationFailed(actualFound,
							Context.current().getFunctionCall().getDataArguments().getDataArgument().get(3).getValue()))
					.make();
		}
	}

	/**
	 * Checkpoint Supported
	 * 
	 * @param object
	 * @param direction
	 * @return
	 * @throws Exception
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_swipeWithObject(AppiumObject object, String direction) throws Exception {
		List<AppiumObjectProperty> list = object.getXPaths();
		Collections.reverse(list);
		for (AppiumObjectProperty appiumObjectProperty : list) {
			if (appiumObjectProperty.getValue().toLowerCase().contains("herobanner")) {
				return HandleHeroBanner(direction);
			}
		}
		WebElement ele = Finder.findWebElementUsingCheckPoint(object);
		Utils.isOperable(ele);
		// Point size = ele.getLocation();
		Rectangle rect = ele.getRect();
		int x = rect.getX() + 5;
		int y = rect.getY() + 5;
		int height = rect.getHeight() / 2;
		int width = rect.getWidth() / 2;
		// x = x + width;
		// y = y + height;
		int mobileWidth = Connect2AppiumServer.dim.getWidth() - 2;
		if (direction.equalsIgnoreCase("right")) {
			System.out.println("<x1:y1 = " + (x) + ":" + (y + height) + ">");
			System.out.println("<x2:y2 = " + (((mobileWidth - (x)))) + ":0>");

			// tAction.press(x, (y + height)).moveTo(mobileWidth - (x),
			// 0).release().perform();
			new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(x, (y + height)))
					.waitAction(WaitOptions.waitOptions(Duration.ofMillis(100)))
					.moveTo(PointOption.point(mobileWidth - (x), 0)).release().perform();

		} else if (direction.equalsIgnoreCase("left")) {
			System.out.println("11");
			System.out.println("<x1:y1 = " + (x + width * 2 - 10) + ":" + (y + height) + ">");
			System.out.println("<x2:y2 = " + (-(x + width * 2 - 10)) + ":0>");

			// tAction.press((x + width * 2 - 10), (y + height)).moveTo(-(x + width * 2 -
			// 10), 0).release().perform();
			new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point((x + width * 2 - 10), (y + height)))
					.waitAction(WaitOptions.waitOptions(Duration.ofMillis(100)))
					.moveTo(PointOption.point(-(x + width * 2 - 10), 0)).release().perform();

		} else if (direction.equalsIgnoreCase("up")) {

			// tAction.press(x, y).moveTo(0, -y).release().perform();
			new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(x, y))
					.waitAction(WaitOptions.waitOptions(Duration.ofMillis(100))).moveTo(PointOption.point(0, -y))
					.release().perform();

		} else if (direction.equalsIgnoreCase("down")) {

			// tAction.press(x, y).moveTo(0, y).release().perform();
			new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(x, y))
					.waitAction(WaitOptions.waitOptions(Duration.ofMillis(100))).moveTo(PointOption.point(0, y))
					.release().perform();

		}
		Thread.sleep(5000);
		return Result.PASS().setOutput(true).make();
	}

	private FunctionResult HandleHeroBanner(String direction) throws ToolNotSetException {
		if (direction.equalsIgnoreCase("right")) {

			// new TouchAction(Finder.findAppiumDriver()).press(50,
			// 150).moveTo(Connect2AppiumServer.dim.getWidth() - 100,
			// 0).release().perform();
			new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(50, 150))
					.waitAction(WaitOptions.waitOptions(Duration.ofMillis(100)))
					.moveTo(PointOption.point(Connect2AppiumServer.dim.getWidth() - 100, 0)).release().perform();

		} else if (direction.equalsIgnoreCase("left")) {

			// new
			// TouchAction(Finder.findAppiumDriver()).press(Connect2AppiumServer.dim.getWidth()
			// - 50, 150).moveTo(-(Connect2AppiumServer.dim.getWidth() - 100),
			// 0).release().perform();
			new TouchAction<>(Finder.findAppiumDriver())
					.press(PointOption.point(Connect2AppiumServer.dim.getWidth() - 50, 150))
					.waitAction(WaitOptions.waitOptions(Duration.ofMillis(100)))
					.moveTo(PointOption.point(-(Connect2AppiumServer.dim.getWidth() - 100), 0)).release().perform();
		} else {
			return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false).make();
		}
		return Result.PASS().setOutput(true).make();
	}

	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_VerifyTextOnScreen(String text) throws ToolNotSetException {
		String source = Method_getPageSource().getOutput();
		System.out.println(source);
		Document html = Jsoup.parse(source);
		Elements list = html.getAllElements();
		System.out.println("List Size :" + list.size());
		String found = "";

		try {
			Element ele = printElementTextRecursively(list.get(0), text);
			if (ele != null) {
				System.out.println("Element found :" + ele.attr("text"));

				return Result.PASS().setOutput(true).setMessage(ReturnMessages.VERFIYED.toString()).make();
			}

		} catch (NumberFormatException ex) {
			System.out.println("Internal Exception Occur On Element " + list.toString());
			ex.printStackTrace();
		}
		return Result.PASS().setOutput(false).setMessage(ReturnMessages.NOT_VERFIED.toString()).make();

	}

	public Element printElementTextRecursively(Element element, String value) {

		String elementText = element.attr("text");
		System.out.println("Printing Text :" + element.attr("text"));
		System.out.println("value is :" + value.trim() + " elementText is :" + elementText.trim());

		if (value.trim().equals(elementText.trim())) {
			System.out.println("Element Matched :");
			return element;
		}

		Elements children = element.children();
		if (children.size() >= 1) {
			for (Element child : children) {
				Element ele = printElementTextRecursively(child, value);
				if (ele != null) {
					return ele;
				}
			}
		}
		return null;
	}

	public FunctionResult Method_IsTextOnScreen(String text) throws ToolNotSetException {
		FunctionResult fr = Method_VerifyTextOnScreen(text);
		if (fr.getResultCode() == ResultCodes.ERROR_VERIFICATION_FAILLED.Code()) {
			return Result.PASS().setOutput(fr.getOutput()).setMessage(fr.getMessage()).make();
		}
		return fr;
	}

	public FunctionResult Method_GetVisibleTextsOnScreen() throws ToolNotSetException {
		String source = Method_getPageSource().getOutput();
		Document html = Jsoup.parse(source);
		Elements list = html.getAllElements();
		String output = "";
		for (Element element : list) {
			try {
				int x = Integer.parseInt(element.attr("x"));
				int y = Integer.parseInt(element.attr("y"));
				if (x != 0 && y != 0) {
					String value = element.attr("name");
					output = output + value + " || ";
				}
			} catch (Exception ex) {

			}
		}
		return Result.PASS().setOutput(output.substring(0, output.lastIndexOf("||"))).make();
	}

	/**
	 * Checkpoint Supported
	 * 
	 * @param object
	 * @param duration
	 * @return
	 * @throws Exception
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_performLongClick(AppiumObject object, int duration) throws Exception {
		WebElement ele = Finder.findWebElementUsingCheckPoint(object);

		// TouchAction tAction = new TouchAction(Finder.findAppiumDriver());
		// tAction.longPress(ele, duration).perform();
		new TouchAction(Finder.findAppiumDriver()).longPress(LongPressOptions.longPressOptions()
				.withElement(ElementOption.element(ele)).withDuration(Duration.ofSeconds(duration))).release()
				.perform();

		return Result.PASS().setOutput(true).make();
	}

	public FunctionResult Method_Launch_AndroidApplicationOnMobility(MobileDevice iosDevice,
			MobileApplication iOSApplication) throws Exception {
		return new Connect2AppiumServer().Method_Launch_iOSApplicationOnDevice(iosDevice, iOSApplication);
	}

	/**
	 * Checkpoint Supported
	 * 
	 * @param object
	 * @return
	 * @throws Exception
	 */
	public FunctionResult Method_GetSeekBaarCurrentValue(AppiumObject object) throws Exception {

		WebElement ele = Finder.findWebElementUsingCheckPoint(object);

		Utils.isOperable(ele);

		try {
			String value = Utils.getAttrAndIgnoreExcecption(ele, "value").split("%")[0];
			return Result.PASS().setOutput(Integer.parseInt(value)).make();
		} catch (Exception ex) {
			return Result.PASS().setMessage("No SeekBar Present").make();
		}
	}

	/**
	 * Checkpoint supported
	 * 
	 * @param object
	 * @param expectedValue
	 * @return
	 * @throws Exception
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_VerifySeekBaarValue(AppiumObject object, int expectedValue) throws Exception {
		WebElement ele = Finder.findWebElementUsingCheckPoint(object);

		Utils.isOperable(ele);
		int actualValue = Integer.parseInt(Utils.getAttrAndIgnoreExcecption(ele, "value").split("%")[0]);
		if (actualValue == expectedValue) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.VERFIYED.toString()).make();
		}
		return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
				.setMessage(ReturnMessages.verificationFailed(actualValue,
						Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue()))
				.make();
	}

	public FunctionResult Method_GetSeekBaarMaxValue(AppiumObject object) throws Exception {
		return Result.PASS().setOutput(100).make();
	}

	public FunctionResult Method_GetSeekBaarMinValue(AppiumObject object) throws Exception {
		return Result.PASS().setOutput(0).make();
	}

	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_VerifySeekBaarMaxValue(int value) throws Exception {
		if (value == 100) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.VERFIYED.toString()).make();
		} else {
			return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
					.setMessage(ReturnMessages.verificationFailed("100",
							Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue()))
					.make();
		}
	}

	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_VerifySeekBaarMinValue(int value) throws Exception {
		if (value == 0) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.VERFIYED.toString()).make();
		} else {
			return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
					.setMessage(ReturnMessages.verificationFailed("0",
							Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue()))
					.make();
		}
	}

	static boolean flagContinue = true;

	public FunctionResult GetChildObjectTextByRelational(String xpath, String className)
			throws InterruptedException, ToolNotSetException {
		System.out.println("Inside Relation");
		String relation = (xpath.split("\\|")[1].split("@")[1]).trim();
		if (check_for_Filtre_Object(xpath)) {
			System.out.println("Inside Relation 2");
			return Handle_Filtre_Object(xpath, className, relation);
		}
		System.out.println("Inside Relation 3");
		String text;
		try {
			text = xpath.split("\\|")[1].split("@")[2].split("=")[1].split("\\'")[1];
		} catch (ArrayIndexOutOfBoundsException ae) {
			text = xpath.split("\\|")[1].split("@")[2].split("=")[1];
		}
		String source = Finder.findAppiumDriver().getPageSource();
		Document html = Jsoup.parse(source);
		String TagName = "q";
		String output = "";
		Set<String> linkedHashSet = new LinkedHashSet<String>();
		Elements elements = html.getAllElements();
		System.out.println("Found Relation AS:: " + relation);
		System.out.println("Found TEXT AS :: " + text);
		boolean flag = true;
		if (relation.equalsIgnoreCase("rightof") || relation.equalsIgnoreCase("belowof")) {
			for (Element element : elements) {
				String elementTag = element.tagName();
				String name = element.attr("name");
				if (name.equals(text)) {
					TagName = element.tagName();
					flag = false;
				}
				if (!(TagName.equals("q")) && elementTag.equalsIgnoreCase("xcuielementtypecollectionview")) {
					Elements childEle = element.getAllElements();
					for (Element element2 : childEle) {
						String name1 = element2.attr("name");
						if (!(name1.isEmpty() || name1.equals("")) && element2.tagName().equalsIgnoreCase(className)) {
							linkedHashSet.add(element2.attr("name"));
						}
					}
					break;
				}
			}
		} else if (relation.equalsIgnoreCase("aboveof") || relation.equalsIgnoreCase("leftof")) {
			Collections.reverse(elements);
			for (Element element : elements) {
				String elementTag = element.tagName();
				String name = element.attr("name");
				if (name.equals(text)) {
					TagName = element.tagName();
					flag = false;
				}
				if (!(TagName.equals("q")) && elementTag.equalsIgnoreCase("xcuielementtypecollectionview")) {
					Elements childEle = element.getAllElements();
					for (Element element2 : childEle) {
						String name1 = element2.attr("name");
						if (!(name1.isEmpty() || name1.equals("")) && element2.tagName().equalsIgnoreCase(className)) {
							linkedHashSet.add(element2.attr("name"));
						}
					}
					break;
				}
			}
		} else {
			System.out.println("UnSupported Property " + relation);
		}
		if (flag) {
			if (flagContinue) {
				Thread.sleep(5000);
				flagContinue = false;
				return GetChildObjectTextByRelational(xpath, className);
			} else {
				flagContinue = true;
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID)
						.setMessage("No ChildObject Found By Text " + text).make();
			}
		}
		count = linkedHashSet.size();
		Iterator<String> ite = linkedHashSet.iterator();
		while (ite.hasNext()) {
			String val = ite.next();
			output = output + val + "||";
			System.out.println(val);
		}
		try {
			output = output.substring(0, output.length() - 2);
		} catch (Exception ex) {

			if (flagContinue) {
				Thread.sleep(5000);
				flagContinue = false;
				return GetChildObjectTextByRelational(xpath, className);
			}
			flagContinue = true;
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setMessage("No Child Found With Object " + text)
					.make();
		}
		System.out.println("OUTPUT IS AS :: " + output);
		return Result.PASS().setOutput(output).make();
	}

	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1 })
	@KeywordActionType({ ActionType.GET })
	public FunctionResult Method_getChildObjectCountNew(AppiumObject object, String className, boolean isRecursive)
			throws ToolNotSetException, InterruptedException {
		Method_GetChildObjectText(object, className);
		return Result.PASS().setOutput(count).make();
	}

	static boolean flagContinuenew = true;

	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_GetChildObjectText(AppiumObject object, String className)
			throws ToolNotSetException, InterruptedException {
		if (object.getId().getValue() != null
				&& (object.getId().getValue().contains("<|") || object.getId().getValue().contains("|>"))) {
			return GetChildObjectTextByRelational(object.getId().getValue(), className);
		}
		if (object.getClassName().getValue() != null && (object.getClassName().getValue().contains("<|")
				|| object.getClassName().getValue().contains("|>"))) {
			return GetChildObjectTextByRelational(object.getClassName().getValue(), className);
		}
		if (object.getName().getValue() != null
				&& (object.getName().getValue().contains("<|") || object.getName().getValue().contains("|>"))) {
			return GetChildObjectTextByRelational(object.getName().getValue(), className);
		}
		boolean recursive = false;
		String tempClassName = className;
		int min = 0;
		int max = 0;
		if (className.contains("<") && className.contains(">")) {
			className = className.split("<")[0];
			System.out.println(className);
			String temp = tempClassName.split("<")[1].split(">")[0];
			min = Integer.parseInt(temp.split("-")[0]);
			System.out.println(min);
			max = Integer.parseInt(temp.split("-")[1]);
			System.out.println(max);
		}
		String xpath = "";
		List<AppiumObjectProperty> list = object.getXPaths();
		for (AppiumObjectProperty appiumObjectProperty : list) {
			if (appiumObjectProperty.getValue().contains("XCUIE")) {
				xpath = appiumObjectProperty.getValue();
				break;
			} else if (appiumObjectProperty.getValue().contains("<|")
					&& appiumObjectProperty.getValue().contains("|>")) {
				xpath = appiumObjectProperty.getValue();
				return GetChildObjectTextByRelational(xpath, className);
			}
		}

		String source = Finder.findAppiumDriver().getPageSource();
		Document html = Jsoup.parse(source);
		String tag = xpath.split("\\)")[0].split("\\//")[1];
		if (tag.contains("[")) {
			tag = tag.split("\\[")[0];
		}
		String value = null;
		// String value =
		// str.split("\\)")[1].split("\\[")[1].split("\\]")[0];
		try {
			value = xpath.split("\\)")[1];
		} catch (Exception ex) {
			value = xpath.split("\\)")[0];
		}
		try {
			value = value.split("\\[")[1].split("\\]")[0];
		} catch (Exception ex) {
			value = "1";
		}
		int valueFinal = Integer.parseInt(value) - 1;
		try {
			Element parent = html.select(tag).get(valueFinal);
			Elements children = parent.select(className);
			String text = "";
			Set<String> linkedHashSet = new LinkedHashSet<String>();
			try {
				if (max == 0) {
					if (recursive) {
						for (Element element : children) {
							for (Element element2 : element.getAllElements()) {
								String name = element2.attr("name");
								String enable = element2.attr("visible");
								if (!(name.isEmpty() || name.equals("")) && enable.toLowerCase().contains("true")) {
									linkedHashSet.add(element2.attr("name"));
								}
							}
						}
					} else {
						for (Element element : children) {
							String name = element.attr("name");
							String enable = element.attr("visible");
							if (!(name.isEmpty() || name.equals("")) && enable.toLowerCase().contains("true")) {
								linkedHashSet.add(element.attr("name"));
							}
						}
					}
				} else {
					if (recursive) {
						for (int i = min - 1; i < max; i++) {
							Element element = children.get(i);
							for (Element element2 : element.getAllElements()) {
								String name = element2.attr("name");
								String enable = element2.attr("visible");
								if (!(name.isEmpty() || name.equals("")) && enable.toLowerCase().contains("true")) {
									linkedHashSet.add(element2.attr("name"));
								}
							}
						}
					} else {
						for (int i = min - 1; i < max; i++) {
							Element element = children.get(i);
							String name = element.attr("name");
							String enable = element.attr("visible");
							if (!(name.isEmpty() || name.equals("")) && enable.toLowerCase().contains("true")) {
								linkedHashSet.add(element.attr("name"));
							}
						}
					}
				}
			} catch (IndexOutOfBoundsException ex) {
				// To Nothing
			}
			count = linkedHashSet.size();
			Iterator<String> ite = linkedHashSet.iterator();
			while (ite.hasNext()) {
				String val = ite.next();
				if (val.trim().equals("More of:"))
					continue;
				text = text + val + "||";
				if (val.trim().equalsIgnoreCase("show less")) {
					break;
				}
			}
			String output = "";
			String message = "";
			try {
				output = text.substring(0, text.length() - 2);
			} catch (StringIndexOutOfBoundsException ex) {
				if (flagContinuenew) {
					Thread.sleep(5000);
					flagContinuenew = false;
					return Method_GetChildObjectText(object, tempClassName);
				}
				flagContinuenew = true;
				message = "No Child Object Found";
			}
			return Result.PASS().setOutput(output).setMessage(message).make();
		} catch (Exception ex) {
			return Result.PASS().setOutput(0).setMessage("No Child Object Found").make();
		}

	}

	private FunctionResult Handle_Filtre_Object(String xpath, String className, String relation)
			throws ToolNotSetException {
		String findName = "";
		if (xpath.toLowerCase().contains("@text")) {
			if (xpath.contains("AVAILABLE ON MY CURRENT PLAN")) {
				findName = "AVAILABLE ON MY CURRENT PLAN";
			} else if (xpath.contains("TYPE")) {
				findName = "TYPE";
			} else if (xpath.contains("SORTING")) {
				findName = "SORTING";
			} else if (xpath.contains("LANGUAGE")) {
				findName = "LANGUAGE";
			} else if (xpath.contains("GENRES")) {
				findName = "GENRES";
			}
			boolean flag = false;
			String source = Method_getPageSource().getOutput();
			Document html = Jsoup.parse(source);
			String output = "";
			Elements elements = html.getAllElements();
			Set<String> linkedHashSet = new LinkedHashSet<String>();
			if (relation.equalsIgnoreCase("rightof") || relation.equalsIgnoreCase("belowof")) {
				for (Element element : elements) {
					String name = element.attr("name");
					if (!(name.isEmpty() || name.equals("")) && name.equals(findName)) {
						System.out.println("HURREY FOUND ");
						flag = true;
						continue;
					}
					if (flag) {
						if (element.tagName().equalsIgnoreCase("XCUIElementTypeStaticText")) {
							break;
						}
						if (!(name.isEmpty() || name.equals("")) && element.tagName().equalsIgnoreCase(className)) {
							linkedHashSet.add(name);
						}
					}
				}
			} else if (relation.equalsIgnoreCase("leftof") || relation.equalsIgnoreCase("aboveof")) {
				Collections.reverse(elements);
				for (Element element : elements) {
					String name = element.attr("name");
					if (!(name.isEmpty() || name.equals("")) && name.equals(findName)) {
						flag = true;
						continue;
					}
					if (flag) {
						if (element.tagName().equalsIgnoreCase("XCUIElementTypeStaticText")) {
							break;
						}
						if (!(name.isEmpty() || name.equals("")) && element.tagName().equalsIgnoreCase(className)) {
							linkedHashSet.add(name);
						}
					}
				}
			}
			count = linkedHashSet.size();
			Iterator<String> ite = linkedHashSet.iterator();
			while (ite.hasNext()) {
				String val = ite.next();
				output = output + val + "||";
			}
			String text = "";
			String message = "";
			try {
				text = output.substring(0, output.length() - 2);
			} catch (StringIndexOutOfBoundsException ex) {
				message = "No Child Object Found";
			}
			return Result.PASS().setOutput(text).setMessage(message).make();
		}
		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).make();

	}

	private boolean check_for_Filtre_Object(String xpath) {
		System.out.println("Inside Filter Object Check");
		if (xpath.toLowerCase().contains("@text")) {
			if (xpath.contains("AVAILABLE ON MY CURRENT PLAN")) {
				return true;
			} else if (xpath.contains("TYPE")) {
				return true;
			} else if (xpath.contains("SORTING")) {
				return true;
			} else if (xpath.contains("LANGUAGE")) {
				return true;
			} else if (xpath.contains("GENRES")) {
				return true;
			}
		}
		return false;
	}

	private String parseTagName(String tagName) {
		switch (tagName) {
		case "xcuielementtypeother":
			tagName = "XCUIElementTypeOther";
			break;
		case "xcuielementtypestatictext":
			tagName = "XCUIElementTypeStaticText";
			break;
		case "xcuielementtypecell":
			tagName = "XCUIElementTypeCell";
			break;
		case "xcuielementtypebutton":
			tagName = "XCUIElementTypeButton";
			break;
		case "xcuielementtypetextview":
			tagName = "XCUIElementTypeTextView";
			break;
		/*
		 * case "xcuielementtypeother": tagName = "XCUIElementTypeOther";break; case
		 * "xcuielementtypeother": tagName = "XCUIElementTypeOther";break; case
		 * "xcuielementtypeother": tagName = "XCUIElementTypeOther";break; case
		 * "xcuielementtypeother": tagName = "XCUIElementTypeOther";break; case
		 * "xcuielementtypeother": tagName = "XCUIElementTypeOther";break; case
		 * "xcuielementtypeother": tagName = "XCUIElementTypeOther";break; case
		 * "xcuielementtypeother": tagName = "XCUIElementTypeOther";break;
		 */
		}
		return tagName;

	}

	public boolean VerifyRelationText(String xpath) throws ToolNotSetException {
		String text;
		try {
			text = xpath.split("\\|")[1].split("@")[2].split("=")[1].split("\\'")[1];
		} catch (ArrayIndexOutOfBoundsException ae) {
			text = xpath.split("\\|")[1].split("@")[2].split("=")[1];
		}
		String source = Method_getPageSource().getOutput();
		Document html = Jsoup.parse(source);
		Elements allElements = html.getAllElements();
		for (Element element : allElements) {
			if (element.attr("name").contains(text)) {
				return true;
			}
		}
		return false;
	}

	public String RelationalApi(String xpath) throws ToolNotSetException {
		String object = "syed";
		int index = -1;
		try {
			object = xpath.split("\\{")[0];
			index = Integer.parseInt(xpath.split("\\{")[1].split("\\}")[0]);
		} catch (Exception ex) {

		}
		String relation = (xpath.split("\\|")[1].split("@")[1]).trim();
		String text;
		try {
			text = xpath.split("\\|")[1].split("@")[2].split("=")[1].split("\\'")[1];
		} catch (ArrayIndexOutOfBoundsException ae) {
			text = xpath.split("\\|")[1].split("@")[2].split("=")[1];
		}
		String source = Method_getPageSource().getOutput();
		Document html = Jsoup.parse(source);
		Elements allElements = html.getAllElements();
		int count1 = 0;
		int count2 = 0;
		Map<String, Integer> map = new HashMap<String, Integer>();
		List<Element> relationalElement = new ArrayList<Element>();
		List<Element> objectElement = new ArrayList<Element>();
		for (Element element : allElements) {
			count2++;
			element.attr("ssts2", String.valueOf(count2));
			if (map.get(element.tagName()) != null) {
				count1 = map.get(element.tagName()).intValue() + 1;
				map.put(element.tagName(), count1);
				element.attr("ssts1", String.valueOf(count1));
			} else {
				count1 = 1;
				map.put(element.tagName(), count1);
				element.attr("ssts1", String.valueOf(count1));
			}
			if (element.attr("name").contains(text)) {
				relationalElement.add(element);
			}
			if (element.attr("name").contains(object)) {
				objectElement.add(element);
			}
		}
		String xpathFinal = "//*[contains(@name='" + text + "')]";
		int relationalElementCount = 0;
		int objectElementCount = 0;
		// System.out.println(object);
		System.out.println(index);
		System.out.println(relation);
		System.out.println(text);
		System.out.println(relationalElement.size());
		System.out.println(objectElement.size());
		String x = "0", y = "0";
		if (relationalElement.size() > 0) {
			Element ele = relationalElement.get(0);
			relationalElementCount = Integer.parseInt(ele.attr("ssts2"));
			if (objectElement.size() > 0) {
				if (relation.equalsIgnoreCase("rightof") || relation.equalsIgnoreCase("belowof")) {
					for (Element element : objectElement) {
						objectElementCount = Integer.parseInt(element.attr("ssts2"));
						System.out.println(objectElementCount);
						if (objectElementCount > relationalElementCount) {
							xpathFinal = "(//" + parseTagName(element.tagName()) + ")[" + element.attr("ssts1") + "]";
							x = element.attr("x");
							y = element.attr("y");
							break;
						}
					}
				} else if (relation.equalsIgnoreCase("aboveof") || relation.equalsIgnoreCase("leftof")) {
					Collections.reverse(objectElement);
					for (Element element : objectElement) {
						objectElementCount = Integer.parseInt(element.attr("ssts2"));
						System.out.println(objectElementCount);
						if (objectElementCount < relationalElementCount) {
							xpathFinal = "(//" + parseTagName(element.tagName()) + ")[" + element.attr("ssts1") + "]";
							x = element.attr("x");
							y = element.attr("y");
							break;
						}
					}
				} else {
					System.out.println("UnSupported Property " + relation);
				}
			}
		}
		if (xpathFinal == null) {
			if (objectElement.size() == 1) {
				x = objectElement.get(0).attr("x");
				y = objectElement.get(0).attr("y");
				xpathFinal = "(//" + parseTagName(objectElement.get(0).tagName()) + ")["
						+ objectElement.get(0).attr("ssts1") + "]";
			}
		}
		System.out.println(xpathFinal);
		return xpathFinal + "@#@" + x + "@#@" + y;
	}

	public FunctionResult clickByTextHelper(String Otext, int index, boolean isContains, String beforeText,
			String afterText) throws Exception {

		ObjectProperty objectProperty = new ObjectProperty();
		objectProperty.setTextToSearch(Otext);
		objectProperty.setIndex(index);
		objectProperty.setContains(isContains);
		objectProperty.setBeforeText(beforeText);
		objectProperty.setAfterText(afterText);

		WebObjects webObjects = new WebObjects();
		String text = Otext.trim();
		if (Otext.length() == 0)
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setMessage("Text is not provided")
					.setOutput(false).make();

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// new Utils().someChecksBeforeTextKeywords();
				List<WebElement> eles = new ArrayList<WebElement>();

				if (!beforeText.trim().isEmpty() || !afterText.trim().isEmpty()) {

					boolean isBeforeText = false;
					boolean isAfterText = false;
					if (!beforeText.trim().isEmpty()) {
						isBeforeText = true;
					}
					if (!afterText.trim().isEmpty()) {
						isAfterText = true;
					}

					List<WebElement> beforeEles;
					List<WebElement> afterEles;
					List<WebElement> finalEles = new ArrayList<>();

					if (isBeforeText && isAfterText) {
						beforeEles = getBeforeTextElement(objectProperty);

						WebElement afterEle = null;
						try {
							afterEle = new Finder().findElementByTextInCurrentDom(afterText, isContains, 0).get(0);
						} catch (Exception e) {
							return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND)
									.setMessage("After Text <" + afterText + "> is not found").setOutput(false).make();
						}

						afterEles = new Finder().findElementByTextDirection(text, isContains, index, afterEle, false);

						finalEles.addAll(beforeEles);
						finalEles.retainAll(afterEles);

					} else if (isBeforeText) {
						finalEles = getBeforeTextElement(objectProperty);
						// Have You Notice, We reverse the list......
						Collections.reverse(finalEles);
					} else if (isAfterText) {
						finalEles = getAfterTextElement(objectProperty);
					}

					eles = finalEles;

				} else {
					eles = getTextElement(objectProperty);
				}

				// Remove Image Tag From The List
				// eles = Utils.removeElementFromList(eles, "img");
				if (eles.size() == 0 || eles == null || eles.size() <= index) {
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
							.setMessage("No Object Found With Text <" + text + ">").make();
				}

				do {
					if (index == 0) {
						try {
							if (Utils.getBrowserName().contains("safari")) {
								webObjects.Method_clickUsingJavaScript(eles.get(0));
							} else {

								try {
									webObjects.ClickElement(eles.get(0));

								} catch (Exception e) {

									if (Utils.getBrowserName().contains("chrome")
											&& e.getMessage().contains("is not clickable at point")) {
										return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE)
												.setMessage(e.getMessage()).setOutput(false).make();
									}
									if (eles.get(0).getTagName().equals("span")) {

										if (Utils.getBrowserName().contains("chrome")) {

											webObjects.clickWithSpanHandled(eles.get(0));

										} else {

											webObjects.Method_clickUsingJavaScript(eles.get(0));
										}
									}
								}
							}

							break;
						} catch (WebDriverException e) {
							String msg = e.getMessage().split("\\n")[0];
							if (msg.toLowerCase().contains("unknown error:")
									&& msg.toLowerCase().contains("is not clickable at point")) {
								WebElement newEle = eles.get(index).findElement(By.xpath("./ancestor::*[1]"));
								new Utils().scrollMid(newEle);
								if (Utils.getBrowserName().contains("safari")) {
									webObjects.Method_clickUsingJavaScript(newEle);
								} else {
									((JavascriptExecutor) Finder.findAppiumDriver())
											.executeScript("arguments[0].click();", newEle);
								}
								break;
							} else if (eles.size() > 1) {
								eles.remove(eles.get(0));
							} else
								break;
						}
					} else {

						try {
							new Utils().scrollMid(eles.get(index));
							if (Utils.getBrowserName().contains("safari")) {
								webObjects.Method_clickUsingJavaScript(eles.get(index));
							} else {

								webObjects.ClickElement(eles.get(index));

							}
							break;
						} catch (Exception e) {
							String msg = e.getMessage().split("\\n")[0];
							if (msg.toLowerCase().contains("unknown error:")
									&& msg.toLowerCase().contains("is not clickable at point")) {
								WebElement newEle = eles.get(index).findElement(By.xpath("./ancestor::*[1]"));
								new Utils().scrollMid(newEle);
								if (Utils.getBrowserName().contains("safari")) {
									webObjects.Method_clickUsingJavaScript(newEle);
								} else {
									webObjects.ClickElement(newEle);
								}
								break;
							}
						}
					}

				} while (true);

				return Result.PASS().setOutput(true).make();

			}

		}.run();
	}

	private List<WebElement> getBeforeTextElement(ObjectProperty objectProperty)
			throws ObjectNotFoundException, ToolNotSetException, InterruptedException, Exception {
		WebElement beforeElements = null;
		List<WebElement> finalEles = new ArrayList<>();

		try {
			beforeElements = Finder.findElementByText(objectProperty.getBeforeText(), objectProperty.isContains(), 0)
					.get(0);
		} catch (Exception e) {
			throw new ObjectNotFoundException("Before Text <" + objectProperty.getAfterText() + "> is not found");
		}
		Log.print("Before Element Found...");
		finalEles = new Finder().findElementByTextDirection(objectProperty.getTextToSearch(),
				objectProperty.isContains(), objectProperty.getIndex(), beforeElements, true);
		return finalEles;
	}

	private List<WebElement> getAfterTextElement(ObjectProperty objectProperty)
			throws ObjectNotFoundException, ToolNotSetException, InterruptedException, Exception {
		WebElement afterEle = null;
		try {
			afterEle = Finder.findElementByText(objectProperty.getAfterText(), objectProperty.isContains(), 0).get(0);
		} catch (Exception e) {
			throw new ObjectNotFoundException("After Text <" + objectProperty.getAfterText() + "> is not found");
		}
		List<WebElement> finalEles = new Finder().findElementByTextDirection(objectProperty.getTextToSearch(),
				objectProperty.isContains(), objectProperty.getIndex(), afterEle, false);
		return finalEles;
	}

	private List<WebElement> getTextElement(ObjectProperty objectProperty) throws ObjectNotFoundException, Exception {
		return Finder.findElementByText(objectProperty.getTextToSearch(), objectProperty.isContains(),
				objectProperty.getIndex());
	}

	public FunctionResult typeTextUsingTextHelper(String OtextSearch, int Oindex, boolean OisContains, String textValue,
			boolean Obefore) throws Exception {

		ObjectProperty byTextObject = new ObjectProperty(ElementType.EDITBOX, OtextSearch, Oindex, OisContains,
				Obefore);
		WebElement ele = FinderByText.findWebElement(byTextObject);

		return editbox.typeText(ele, textValue);
	}

	public FunctionResult Method_clickByTextInSequence(String text1, int index1, boolean isContains1, String text2,
			int index2, boolean isContains2, String text3, int index3, boolean isContains3, String text4, int index4,
			boolean isContains4, String text5, int index5, boolean isContains5, AppiumObject object1,
			AppiumObject object2, AppiumObject object3, AppiumObject object4, AppiumObject object5) throws Exception {

		ObjectProperty objectProperty1 = new ObjectProperty();
		objectProperty1.setTextToSearch(text1);
		objectProperty1.setIndex(index1);
		objectProperty1.setContains(isContains1);
		objectProperty1.setAppiumObject(object1);

		ObjectProperty objectProperty2 = new ObjectProperty();
		objectProperty2.setTextToSearch(text2);
		objectProperty2.setIndex(index2);
		objectProperty2.setContains(isContains2);
		objectProperty2.setAppiumObject(object2);

		ObjectProperty objectProperty3 = new ObjectProperty();
		objectProperty3.setTextToSearch(text3);
		objectProperty3.setIndex(index3);
		objectProperty3.setContains(isContains3);
		objectProperty3.setAppiumObject(object3);

		ObjectProperty objectProperty4 = new ObjectProperty();
		objectProperty4.setTextToSearch(text4);
		objectProperty4.setIndex(index4);
		objectProperty4.setContains(isContains4);
		objectProperty4.setAppiumObject(object4);

		ObjectProperty objectProperty5 = new ObjectProperty();
		objectProperty5.setTextToSearch(text5);
		objectProperty5.setIndex(index5);
		objectProperty5.setContains(isContains5);
		objectProperty5.setAppiumObject(object5);

		List<ObjectProperty> listObjectProperty = new ArrayList<ObjectProperty>();
		listObjectProperty.add(objectProperty1);
		listObjectProperty.add(objectProperty2);
		listObjectProperty.add(objectProperty3);
		listObjectProperty.add(objectProperty4);
		listObjectProperty.add(objectProperty5);
		ByTextInSequence byTextInSequence = new ByTextInSequence(listObjectProperty);
		return byTextInSequence.click();
	}

	@NotSupportedInHybridApplication
	public FunctionResult Mobile_typeTextUsingText(String OtextSearch, String ObeforeText, String OafterText,
			int Oindex, String textValue) throws InterruptedException, ToolNotSetException, ObjectNotFoundException,
			WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

		String text = OtextSearch.trim();
		String afterText = OafterText.trim();
		String beforeText = ObeforeText.trim();
		Boolean isIndexGiven = false;
		String textTobeTyped = textValue;

		boolean isBefore = false, isAfter = false, isObjectText = false;

		if (textTobeTyped == null || textTobeTyped.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false)
					.setMessage("Provide textValue to be typed").make();

		}

		if (text.isEmpty() && afterText.isEmpty() && beforeText.isEmpty()) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setOutput(false)
					.setMessage("Enter parameter(s) to perform action").make();
		}
		if (Oindex != 0) {
			isIndexGiven = true;
		}

		if (!(beforeText.trim().isEmpty() || beforeText == null)) {
			isBefore = true;
		}

		if (!(afterText == null || afterText.trim().isEmpty())) {
			isAfter = true;
		}
		if (!(text == null || text.trim().isEmpty())) {
			isObjectText = true;
		}

		List<WebElement> mainElements = new ArrayList<WebElement>();
		List<WebElement> editboxElements = new ArrayList<WebElement>();
		List<WebElement> beforeElements = new ArrayList<WebElement>();
		List<WebElement> afterElements = new ArrayList<WebElement>();
		WebElement relativeElement = null;

		/*------------------------finding text given by user---------------------*/

		if (isObjectText) {
			mainElements = findAfterOrBeforeElements(text);
			Log.print("##< editbox text elements found " + mainElements.size());
			if (mainElements.size() >= 1) {
				if (mainElements.size() == 1) {
					// editbox.typeText(mainElements.get(0), textValue);
					System.out.println("##<< found 1 nearest element");
					if (Utils.clearEditField(mainElements.get(0))) {
						// editbox.typeText(finalElement, textValue);
						mainElements.get(0).sendKeys(textValue);
						return Result.PASS().setOutput(true).setMessage("DONE").make();
					}

				} else {
					if (isIndexGiven && Oindex <= mainElements.size()) {
						// editbox.typeText(mainElements.get(Oindex-1), textValue);
						if (Utils.clearEditField(mainElements.get(Oindex - 1))) {
							// editbox.typeText(finalElement, textValue);
							mainElements.get(Oindex - 1).sendKeys(textValue);
							return Result.PASS().setOutput(true).setMessage("DONE").make();
						}
						// return Result.PASS().setOutput(true).setMessage("DONE").make();
					}

				}

				// return Result.PASS().setOutput(true).setMessage("DONE").make();
			}

		}

		// }
		if (mainElements.size() == 0 && (isAfter == false && isBefore == false)) {
			Log.print("OBJECT NOT FOUND PLEASE SPY ON APPLICATION AND USE OTHER PARAMETERS.");
			return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setOutput(false)
					.setMessage("TEXT NOT FOUND PLEASE SPY ON APPLICATION AND USE OTHER PARAMETERS.").make();

		}

		if (isBefore) {
			beforeElements = findAfterOrBeforeElements(beforeText);
			Log.print("##<<Before elements found " + beforeElements.size());
			if (beforeElements.size() == 0 && isAfter == false && mainElements.size() == 0) {
				Log.print("BEFORE ELEMENT NOT FOUND.");
				return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setOutput(false)
						.setMessage("TEXT NOT FOUND PLEASE SPY ON APPLICATION AND USE OTHER PARAMETERS.").make();
			}
		}

		if (isAfter) {
			afterElements = findAfterOrBeforeElements(afterText);
			Log.print("##<< after elements found " + afterElements.size());
			if (afterElements.size() == 0 && beforeElements.size() == 0 && mainElements.size() == 0) {
				Log.print("AFTER ELEMENT NOT FOUND.");
				return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setOutput(false)
						.setMessage("TEXT NOT FOUND PLEASE SPY ON APPLICATION AND USE OTHER PARAMETERS.").make();
			}
		}
		/*------------------------Finding editboxes---------------------*/

		editboxElements = findAllEditboxes();// need to find only editboxes
		System.out.println("##<< finding relative element ");

		/*--------------------------------------selecting relative element----------*/
		System.out.println("##<<  size of editbox clickable  list " + editboxElements.size());
		if (isObjectText) {
			if (mainElements.size() >= 1) {
				relativeElement = findRelativeElement(mainElements, Oindex, isIndexGiven);
			}
			if (Oindex > mainElements.size()) {
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Invalid Index")
						.make();
			}

		} else if (isBefore) {
			if (beforeElements.size() >= 1) {
				relativeElement = findRelativeElement(beforeElements, Oindex, isIndexGiven);
			}
			if (Oindex > beforeElements.size()) {
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Invalid Index")
						.make();
			}

		} else if (isAfter) {
			if (afterElements.size() >= 1) {
				relativeElement = findRelativeElement(afterElements, Oindex, isIndexGiven);
			}
			if (Oindex > afterElements.size()) {
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Invalid Index")
						.make();
			}
		}

		/*---------------------------------finding nearest----------------------*/

		System.out.println("##<< finding nearest element");
		WebElement finalElement = null;
		if (relativeElement != null) {
			if (isBefore) {
				finalElement = Utils.findNearestElement(editboxElements, relativeElement);
			} else {
				if (isAfter) {
					finalElement = Utils.findNearestElement(editboxElements, relativeElement);
					if (finalElement != null) {
						editboxElements.remove(finalElement);
					}

					finalElement = Utils.findNearestElement(editboxElements, relativeElement);

				}
			}

		}
		if (finalElement != null) {
			System.out.println("##<< found  nearest element");
			if (Utils.clearEditField(finalElement)) {
				// editbox.typeText(finalElement, textValue);
				finalElement.sendKeys(textValue);
			}
			return Result.PASS().setOutput(true).setMessage("DONE").make();
		} else {
			System.out.println("##<< nearest element  not found ");
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Element Not Found")
					.make();
		}

	}

	@NotSupportedInHybridApplication
	public FunctionResult Mobile_typeTextOnSecureFields(String OtextSearch, String ObeforeText, String OafterText,
			int Oindex, String textValue) throws InterruptedException, ToolNotSetException, ObjectNotFoundException,
			WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
		String text = OtextSearch.trim();
		String afterText = OafterText.trim();
		String beforeText = ObeforeText.trim();
		Boolean isIndexGiven = false;
		String textTobeTyped = textValue;

		boolean isBefore = false, isAfter = false, isObjectText = false;

		if (textTobeTyped == null || textTobeTyped.isEmpty()) {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false)
					.setMessage("Provide textValue to be typed").make();

		}

		if (text.isEmpty() && afterText.isEmpty() && beforeText.isEmpty()) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setOutput(false)
					.setMessage("Enter parameter(s) to perform action").make();
		}
		if (Oindex != 0) {
			isIndexGiven = true;
		}

		if (!(beforeText.trim().isEmpty() || beforeText == null)) {
			isBefore = true;
		}

		if (!(afterText == null || afterText.trim().isEmpty())) {
			isAfter = true;
		}
		if (!(text == null || text.trim().isEmpty())) {
			isObjectText = true;
		}

		List<WebElement> mainElements = new ArrayList<WebElement>();
		List<WebElement> editboxElements = new ArrayList<WebElement>();
		List<WebElement> beforeElements = new ArrayList<WebElement>();
		List<WebElement> afterElements = new ArrayList<WebElement>();
		WebElement relativeElement = null;

		/*------------------------finding text given by user---------------------*/

		if (isObjectText) {
			mainElements = findAfterOrBeforeElements(text);
			Log.print("##< editbox text elements found " + mainElements.size());
			if (mainElements.size() >= 1) {
				if (mainElements.size() == 1) {
					// editbox.typeText(mainElements.get(0), textValue);
					System.out.println("##<< found 1 nearest element");
					if (Utils.clearEditField(mainElements.get(0))) {
						// editbox.typeText(finalElement, textValue);
						mainElements.get(0).sendKeys(textValue);
						return Result.PASS().setOutput(true).setMessage("DONE").make();
					}

				} else {
					if (isIndexGiven && Oindex <= mainElements.size()) {
						// editbox.typeText(mainElements.get(Oindex-1), textValue);
						if (Utils.clearEditField(mainElements.get(Oindex - 1))) {
							// editbox.typeText(finalElement, textValue);
							mainElements.get(Oindex - 1).sendKeys(textValue);
							return Result.PASS().setOutput(true).setMessage("DONE").make();
						}
						// return Result.PASS().setOutput(true).setMessage("DONE").make();
					}

				}

				// return Result.PASS().setOutput(true).setMessage("DONE").make();
			}

		}

		// }
		if (mainElements.size() == 0 && (isAfter == false && isBefore == false)) {
			Log.print("OBJECT NOT FOUND PLEASE SPY ON APPLICATION AND USE OTHER PARAMETERS.");
			return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setOutput(false)
					.setMessage("TEXT NOT FOUND PLEASE SPY ON APPLICATION AND USE OTHER PARAMETERS.").make();

		}

		if (isBefore) {
			beforeElements = findAfterOrBeforeElements(beforeText);
			Log.print("##<<Before elements found " + beforeElements.size());
			if (beforeElements.size() == 0 && isAfter == false && mainElements.size() == 0) {
				Log.print("BEFORE ELEMENT NOT FOUND.");
				return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setOutput(false)
						.setMessage("TEXT NOT FOUND PLEASE SPY ON APPLICATION AND USE OTHER PARAMETERS.").make();
			}
		}

		if (isAfter) {
			afterElements = findAfterOrBeforeElements(afterText);
			Log.print("##<< after elements found " + afterElements.size());
			if (afterElements.size() == 0 && beforeElements.size() == 0 && mainElements.size() == 0) {
				Log.print("AFTER ELEMENT NOT FOUND.");
				return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setOutput(false)
						.setMessage("TEXT NOT FOUND PLEASE SPY ON APPLICATION AND USE OTHER PARAMETERS.").make();
			}
		}
		/*------------------------Finding editboxes---------------------*/

		editboxElements = findAllSecureFields();// secure fields only in ios

		/*--------------------------------------selecting relative element----------*/

		if (isObjectText) {
			if (mainElements.size() >= 1) {
				relativeElement = findRelativeElement(mainElements, Oindex, isIndexGiven);
			}
			if (Oindex > mainElements.size()) {
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Invalid Index")
						.make();
			}

		} else if (isBefore) {
			if (beforeElements.size() >= 1) {
				relativeElement = findRelativeElement(beforeElements, Oindex, isIndexGiven);
			}
			if (Oindex > beforeElements.size()) {
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Invalid Index")
						.make();
			}

		} else if (isAfter) {
			if (afterElements.size() >= 1) {
				relativeElement = findRelativeElement(afterElements, Oindex, isIndexGiven);
			}
			if (Oindex > afterElements.size()) {
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Invalid Index")
						.make();
			}
		}

		/*---------------------------------finding nearest----------------------*/

		System.out.println("##<< finding nearest element");
		WebElement finalElement = null;
		if (relativeElement != null) {
			if (isBefore) {
				finalElement = Utils.findNearestElement(editboxElements, relativeElement);
			} else {
				if (isAfter) {
					finalElement = Utils.findNearestElement(editboxElements, relativeElement);
					if (finalElement != null) {
						editboxElements.remove(finalElement);
					}

					finalElement = Utils.findNearestElement(editboxElements, relativeElement);

				}
			}

		}
		if (finalElement != null) {
			System.out.println("##<< found 1 nearest element");
			if (Utils.clearEditField(finalElement)) {
				// editbox.typeText(finalElement, textValue);
				finalElement.sendKeys(textValue);
			}
			return Result.PASS().setOutput(true).setMessage("DONE").make();
		} else {
			System.out.println("##<< nearest element  not found ");
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Element Not Found")
					.make();
		}

	}

	@NotSupportedInHybridApplication
	public FunctionResult Mobile_ClickByText(String Otext, String ObeforeText, String OafterText, int Oindex)
			throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
			ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

		// isPasswordField only for ios
		String text = Otext.trim();
		String afterText = OafterText.trim();
		String beforeText = ObeforeText.trim();
		Boolean isIndexGiven = false;

		boolean isBefore = false, isAfter = false, isObjectText = false;

		if (text.isEmpty() && afterText.isEmpty() && beforeText.isEmpty()) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setOutput(false)
					.setMessage("Enter parameter(s) to perform action").make();
		}
		if (Oindex != 0) {
			isIndexGiven = true;
		}

		if (!(beforeText.trim().isEmpty() || beforeText == null)) {
			isBefore = true;
		}

		if (!(afterText == null || afterText.trim().isEmpty())) {
			isAfter = true;
		}
		if (!(text == null || text.trim().isEmpty())) {
			isObjectText = true;
		}

		List<WebElement> mainElements = new ArrayList<WebElement>();
		List<WebElement> clickableElements = new ArrayList<WebElement>();
		List<WebElement> beforeElements = new ArrayList<WebElement>();
		List<WebElement> afterElements = new ArrayList<WebElement>();
		WebElement relativeElement = null;

		/*------------------------finding text given by user---------------------*/

		if (isObjectText) {
			mainElements = findAfterOrBeforeElements(text);
			Log.print("##< editbox text elements found " + afterElements.size());
			if (mainElements.size() >= 1) {
				if (mainElements.size() == 1) {
					try {
						mainElements.get(0).click();
					} catch (Exception e) {
						System.out.println("Exception in click clicking through tap ");
						try {
							new TouchAction(Finder.findAppiumDriver()).tap(
									TapOptions.tapOptions().withElement(ElementOption.element(mainElements.get(0))));
						} catch (Exception e2) {
							System.out.println("Exception in tap clicking through press ");
							new TouchAction<>(Finder.findAppiumDriver())
									.press(ElementOption.element(mainElements.get(0)));
						}

					}

					return Result.PASS().setOutput(true).setMessage("DONE").make();
				}
				if (isIndexGiven && Oindex <= mainElements.size()) {
					mainElements.get(Oindex - 1).click();
					return Result.PASS().setOutput(true).setMessage("DONE").make();
				}
			}

		}
		if (mainElements.size() == 0 && (isAfter == false && isBefore == false)) {
			Log.print("OBJECT NOT FOUND PLEASE SPY ON APPLICATION AND USE OTHER PARAMETERS.");
			return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setOutput(false)
					.setMessage("TEXT NOT FOUND PLEASE SPY ON APPLICATION AND USE OTHER PARAMETERS.").make();

		}

		if (isBefore) {
			beforeElements = findAfterOrBeforeElements(beforeText);
			Log.print("##<<Before elements found " + beforeElements.size());
			if (beforeElements.size() == 0 && isAfter == false && mainElements.size() == 0) {
				Log.print("BEFORE ELEMENT NOT FOUND.");
				return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setOutput(false)
						.setMessage("TEXT NOT FOUND PLEASE SPY ON APPLICATION AND USE OTHER PARAMETERS.").make();
			}
		}

		if (isAfter) {
			afterElements = findAfterOrBeforeElements(afterText);
			Log.print("##<< after elements found " + afterElements.size());
			if (afterElements.size() == 0 && beforeElements.size() == 0 && mainElements.size() == 0) {
				Log.print("AFTER ELEMENT NOT FOUND.");
				return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setOutput(false)
						.setMessage("TEXT NOT FOUND PLEASE SPY ON APPLICATION AND USE OTHER PARAMETERS.").make();
			}
		}
		/*------------------------Finding editboxes---------------------*/

		clickableElements = findAllElements();
		System.out.println("##<< clickable element size " + clickableElements.size());

		/*--------------------------------------selecting relative element----------*/

		if (isObjectText) {
			if (mainElements.size() >= 1) {
				relativeElement = findRelativeElement(mainElements, Oindex, isIndexGiven);
			}
			if (Oindex > mainElements.size()) {
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Invalid Index")
						.make();
			}

		} else if (isBefore) {
			if (beforeElements.size() >= 1) {
				relativeElement = findRelativeElement(beforeElements, Oindex, isIndexGiven);
			}
			if (Oindex > beforeElements.size()) {
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Invalid Index")
						.make();
			}

		} else if (isAfter) {
			if (afterElements.size() >= 1) {
				relativeElement = findRelativeElement(afterElements, Oindex, isIndexGiven);
			}
			if (Oindex > afterElements.size()) {
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Invalid Index")
						.make();
			}
		}
		/*-------------------------Remove relative element first from clickable elements if not distance=0----------------------*/

		if (clickableElements.contains(relativeElement)) {
			System.out.println(
					"##<< Clickable elements contain relative element so removing it otherwise nearest distance will be zero");
			clickableElements.remove(relativeElement);
		}

		/*---------------------------------finding nearest----------------------*/

		System.out.println("##<< finding nearest element");
		WebElement finalElement = null;
		if (relativeElement != null) {
			if (isBefore) {
				finalElement = Utils.findNearestElement(clickableElements, relativeElement);
			} else {
				if (isAfter) {
					finalElement = Utils.findNearestElement(clickableElements, relativeElement);
					if (finalElement != null) {
						clickableElements.remove(finalElement);
					}

					finalElement = Utils.findNearestElement(clickableElements, relativeElement);

				}
			}

		}
		if (finalElement != null) {
			System.out.println("##<< found 1 nearest element");
			try {
				finalElement.click();
			} catch (Exception e) {

				System.out.println("##<< exception in click " + e.getMessage());

				try {
					TouchAction tapAction = new TouchAction(Finder.findAppiumDriver())
							.tap(TapOptions.tapOptions().withElement(ElementOption.element(finalElement)))
							.waitAction(WaitOptions.waitOptions(Duration.ofMillis(200)));
					tapAction.perform();
				} catch (Exception e2) {
					System.out.println("##<< exception in tap " + e.getMessage());
					Point point = finalElement.getLocation();
					TouchAction pressAction = new TouchAction<>(Finder.findAppiumDriver())
							.press(PointOption.point(point.x, point.y))
							.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000))).release();
					pressAction.release();
				}

			}
			return Result.PASS().setOutput(true).setMessage("DONE").make();
		} else {
			System.out.println("##<< nearest element  not found ");
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Element Not Found")
					.make();
		}

	}

	@NotSupportedInHybridApplication
	public FunctionResult Mobile_ClickOnEditboxByText(String Otext, String ObeforeText, String OafterText, int Oindex)
			throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
			ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

		String text = Otext.trim();
		String afterText = OafterText.trim();
		String beforeText = ObeforeText.trim();
		Boolean isIndexGiven = false;

		boolean isBefore = false, isAfter = false, isObjectText = false;

		if (text.isEmpty() && afterText.isEmpty() && beforeText.isEmpty()) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setOutput(false)
					.setMessage("Enter parameter(s) to perform action").make();
		}
		if (Oindex != 0) {
			isIndexGiven = true;
		}

		if (!(beforeText.trim().isEmpty() || beforeText == null)) {
			isBefore = true;
		}

		if (!(afterText == null || afterText.trim().isEmpty())) {
			isAfter = true;
		}
		if (!(text == null || text.trim().isEmpty())) {
			isObjectText = true;
		}

		List<WebElement> mainElements = new ArrayList<WebElement>();
		List<WebElement> clickableElements = new ArrayList<WebElement>();
		List<WebElement> beforeElements = new ArrayList<WebElement>();
		List<WebElement> afterElements = new ArrayList<WebElement>();
		WebElement relativeElement = null;

		/*------------------------finding text given by user---------------------*/

		if (isObjectText) {
			mainElements = findAfterOrBeforeElements(text);
			Log.print("##< editbox text elements found " + afterElements.size());
			if (mainElements.size() >= 1) {
				if (mainElements.size() == 1) {
					try {
						mainElements.get(0).click();
					} catch (Exception e) {
						System.out.println("Exception in click clicking through tap ");
						try {
							new TouchAction(Finder.findAppiumDriver()).tap(
									TapOptions.tapOptions().withElement(ElementOption.element(mainElements.get(0))));
						} catch (Exception e2) {
							System.out.println("Exception in tap clicking through press ");
							new TouchAction<>(Finder.findAppiumDriver())
									.press(ElementOption.element(mainElements.get(0)));
						}

					}

					return Result.PASS().setOutput(true).setMessage("DONE").make();
				}
				if (isIndexGiven && Oindex <= mainElements.size()) {
					mainElements.get(Oindex - 1).click();
					return Result.PASS().setOutput(true).setMessage("DONE").make();
				}
			}

		}
		if (mainElements.size() == 0 && (isAfter == false && isBefore == false)) {
			Log.print("OBJECT NOT FOUND PLEASE SPY ON APPLICATION AND USE OTHER PARAMETERS.");
			return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setOutput(false)
					.setMessage("TEXT NOT FOUND PLEASE SPY ON APPLICATION AND USE OTHER PARAMETERS.").make();

		}

		if (isBefore) {
			beforeElements = findAfterOrBeforeElements(beforeText);
			Log.print("##<<Before elements found " + beforeElements.size());
			if (beforeElements.size() == 0 && isAfter == false && mainElements.size() == 0) {
				Log.print("BEFORE ELEMENT NOT FOUND.");
				return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setOutput(false)
						.setMessage("TEXT NOT FOUND PLEASE SPY ON APPLICATION AND USE OTHER PARAMETERS.").make();
			}
		}

		if (isAfter) {
			afterElements = findAfterOrBeforeElements(afterText);
			Log.print("##<< after elements found " + afterElements.size());
			if (afterElements.size() == 0 && beforeElements.size() == 0 && mainElements.size() == 0) {
				Log.print("AFTER ELEMENT NOT FOUND.");
				return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setOutput(false)
						.setMessage("TEXT NOT FOUND PLEASE SPY ON APPLICATION AND USE OTHER PARAMETERS.").make();
			}
		}
		/*------------------------Finding editboxes---------------------*/

		clickableElements = findAllEditboxes(); // need to find only editboxes
		System.out.println("##<< clickable element size " + clickableElements.size());

		/*--------------------------------------selecting relative element----------*/

		if (isObjectText) {
			if (mainElements.size() >= 1) {
				relativeElement = findRelativeElement(mainElements, Oindex, isIndexGiven);
			}
			if (Oindex > mainElements.size()) {
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Invalid Index")
						.make();
			}

		} else if (isBefore) {
			if (beforeElements.size() >= 1) {
				relativeElement = findRelativeElement(beforeElements, Oindex, isIndexGiven);
			}
			if (Oindex > beforeElements.size()) {
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Invalid Index")
						.make();
			}

		} else if (isAfter) {
			if (afterElements.size() >= 1) {
				relativeElement = findRelativeElement(afterElements, Oindex, isIndexGiven);
			}
			if (Oindex > afterElements.size()) {
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Invalid Index")
						.make();
			}
		}
		/*-------------------------Remove relative element first from clickable elements if not distance=0----------------------*/

		if (clickableElements.contains(relativeElement)) {
			System.out.println(
					"##<< Clickable elements contain relative element so removing it otherwise nearest distance will be zero");
			clickableElements.remove(relativeElement);
		}

		/*---------------------------------finding nearest----------------------*/

		System.out.println("##<< finding nearest element");
		WebElement finalElement = null;
		if (relativeElement != null) {
			if (isBefore) {
				finalElement = Utils.findNearestElement(clickableElements, relativeElement);
			} else {
				if (isAfter) {
					finalElement = Utils.findNearestElement(clickableElements, relativeElement);
					if (finalElement != null) {
						clickableElements.remove(finalElement);
					}

					finalElement = Utils.findNearestElement(clickableElements, relativeElement);

				}
			}

		}
		if (finalElement != null) {
			System.out.println("##<< found 1 nearest element");
			try {
				finalElement.click();
			} catch (Exception e) {

				System.out.println("##<< exception in click " + e.getMessage());

				try {
					TouchAction tapAction = new TouchAction(Finder.findAppiumDriver())
							.tap(TapOptions.tapOptions().withElement(ElementOption.element(finalElement)))
							.waitAction(WaitOptions.waitOptions(Duration.ofMillis(200)));
					tapAction.perform();
				} catch (Exception e2) {
					System.out.println("##<< exception in tap " + e.getMessage());
					Point point = finalElement.getLocation();
					TouchAction pressAction = new TouchAction<>(Finder.findAppiumDriver())
							.press(PointOption.point(point.x, point.y))
							.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000))).release();
					pressAction.release();
				}

			}
			return Result.PASS().setOutput(true).setMessage("DONE").make();
		} else {
			System.out.println("##<< nearest element  not found ");
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Element Not Found")
					.make();
		}

	}

	public List<WebElement> findAfterOrBeforeElements(String text) throws Exception {
		List<WebElement> elements = new ArrayList<WebElement>();

		if (AppiumContext.getDeviceType() == DeviceType.Android) {
			while (Context.current().getKeywordRemaningSeconds() > 6) {
				elements = Finder.findAppiumDriver().findElementsByXPath("//*[@text='" + text + "']");
				if (elements.size() >= 1) {
					break;
				}
				if (elements.size() == 0) {
					elements = Finder.findAppiumDriver().findElementsByXPath("//*[@content-desc='" + text + "']");
				}
				if (elements.size() >= 1) {
					break;
				}
			}

		}
		if (AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice) {
			while (Context.current().getKeywordRemaningSeconds() > 0) {
				elements = Finder.findAppiumDriver().findElementsByXPath("//*[@value='" + text + "']");
				if (elements.size() >= 1) {
					break;
				}
				if (elements.size() == 0) {
					elements = Finder.findAppiumDriver().findElementsByXPath("//*[@name='" + text + "']");
				}
				if (elements.size() >= 1) {
					break;
				}
			}
		}
		return elements;
	}

	public List<WebElement> findAllElements() throws Exception {
		List<WebElement> AllElements = new ArrayList<WebElement>();
		if (AppiumContext.getDeviceType() == DeviceType.Android) {

			AllElements = Finder.findAppiumDriver().findElementsByXPath("//*[@clickable='true']");
		}
		if (AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice) {
			List<WebElement> allFields = Finder.findAppiumDriver()
					.findElementsByXPath("//*[@enabled='true' and @visible='true']");
			if (allFields.size() >= 0) {
				for (WebElement elem : allFields) {
					String tagName = elem.getTagName().toString(); // remove all classes that are not required like
					// TextView
					// System.out.println("tag name "+tagName );
					if ((!tagName.equals("XCUIElementTypeStaticText")) || (!tagName.equals("XCUIElementTypeOther"))
							|| (!tagName.equals("XCUIElementTypeWindow"))) {
						AllElements.add(elem);
					}
				}
			}
		}
		Log.print("##<< elements found " + AllElements.size());
		return AllElements;
	}

	public List<WebElement> findAllSecureFields() throws Exception {
		List<WebElement> AllElements = new ArrayList<WebElement>();
		if (AppiumContext.getDeviceType() == DeviceType.Android) {
			AllElements = Finder.findAppiumDriver().findElementsByXPath("//android.widget.EditText[@clickable='true']");
			System.out.println("##<< android size of editbox    " + AllElements.size());

		}
		if (AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice) {
			List<WebElement> anotherListForSecureFields = Finder.findAppiumDriver()
					.findElementsByXPath("//XCUIElementTypeSecureTextField[@enabled='true' and @visible='true']");
			if (anotherListForSecureFields.size() > 0) {
				AllElements.addAll(anotherListForSecureFields);
				System.out.println("##<< ios  size of secure editbox   list " + AllElements.size());
			}
		}
		return AllElements;
	}

	public List<WebElement> findAllEditboxes() throws Exception {
		List<WebElement> AllElements = new ArrayList<WebElement>();
		if (AppiumContext.getDeviceType() == DeviceType.Android) {
			AllElements = Finder.findAppiumDriver().findElementsByXPath("//android.widget.EditText[@clickable='true']");

		}
		if (AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice) {
			AllElements = Finder.findAppiumDriver()
					.findElementsByXPath("//XCUIElementTypeTextField[@enabled='true' and @visible='true']");

		}

		return AllElements;
	}

	public WebElement findRelativeElement(List<WebElement> elements, int Oindex, boolean isIndexGiven)
			throws Exception {
		WebElement relativeElement = null;
		if (elements.size() >= 1) {
			if (isIndexGiven && Oindex <= elements.size()) {
				relativeElement = elements.get(Oindex - 1);
			} else {
				if (elements.size() == 1) {
					relativeElement = elements.get(0);
				}
				if (elements.size() >= 1 && Oindex == 0) {
					relativeElement = elements.get(0);
				}
			}
		}
		if (relativeElement != null) {
			return relativeElement;
		}
		return null;
	}

}
