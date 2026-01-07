package com.plugin.appium.keywords.GenericKeyword;

import java.io.IOException;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;


import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.Utils;
import com.plugin.appium.CustomClasses.CustomSelect;
import com.plugin.appium.annotations.keywordValidation.KeywordActionType;
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInApplicationMode;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInMobileContext;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInNativeApplication;
import com.plugin.appium.enums.ActionType;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.AppiumSpecificKeyword.Spinner;
import com.plugin.appium.util.Checkpoint;
import com.plugin.appium.util.GenericCheckpoint;

import io.appium.java_client.AppiumDriver;

public class DropDown implements KeywordLibrary {

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	@NotSupportedInNativeApplication
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_selectDropDownItem(AppiumObject object, String value) throws Exception {
		Utils.CustomselectDropDownItem(object, value, true);
		return Result.PASS().setOutput(true).make();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInNativeApplication
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getSelectedDropDownItem(AppiumObject object) throws Exception {
		Select DropdownList = new Select(Finder.findWebElementUsingCheckPoint(object));
		
		return new GenericCheckpoint<FunctionResult>() {

			@Override
			public FunctionResult _innerRun() throws Exception {
				List<WebElement> selectedOption = DropdownList.getAllSelectedOptions();
				String retValue;
				retValue = selectedOption.get(0).getText();
				for (int counter = 1; counter < selectedOption.size(); counter++)
					retValue = retValue + ";" + selectedOption.get(counter).getText();
				return Result.PASS().setOutput(retValue).make();
			}
		}.run();
		

	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	@NotSupportedInNativeApplication
	public FunctionResult Method_deselectDropDownItem(AppiumObject object, String value) throws Exception {
		return new Spinner().Method_deselectSpinnerItem(object);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	@NotSupportedInMobileContext
	public FunctionResult Method_deFocusfromDropDown() throws Exception {
		return null;
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	//@NotSupportedInMobileContext
	public FunctionResult Method_verifyDropDownToolTip(AppiumObject object, String userToolTipText) throws Exception {
		return new WebObjects().Method_verifyObjectToolTip(object, userToolTipText);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInNativeApplication
	public FunctionResult Method_verifyDropDownItemCount(AppiumObject object, int countByUser) throws Exception {
		return Utils.CustomVerifyDropDownItemCount(object, countByUser, true);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	@NotSupportedInNativeApplication
	public FunctionResult Method_verifyDropDownExist(AppiumObject object) throws Exception {
		return new WebObjects().Method_ObjectExists(object);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInNativeApplication
	public FunctionResult Method_VerifyDropDownEnabled(AppiumObject object) throws Exception {
		return (new WebObjects()).Method_ObjectisEnabled(object);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInNativeApplication
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getDropDownItemCount(AppiumObject object) throws Exception {
		return Result.PASS().setOutput(Utils.customGetDropDownItemCount(object, true)).make();
	}

	/*
	 * 
	 * 
	 * 
	 * */

	@NotSupportedInNativeApplication
	public FunctionResult Method_verifyDropDownDefaultItem(AppiumObject object, String expectedDefValue) throws Exception {

		WebElement webElement = Finder.findWebElementUsingCheckPoint(object);
		
		Select dropDown = new Select(webElement);
		return new GenericCheckpoint<FunctionResult>() {

			@Override
			public FunctionResult _innerRun() throws Exception {
				String defaultValue = "";
				
				try {
					// try to get the default Selected Option When Website Is Load
					// WebElement option =
					// webElement.findElement(By.xpath(".//option[@selected='selected']"));
					WebElement option = webElement.findElement(By.xpath(".//option[@selected]"));
					defaultValue = option.getText();
					defaultValue = defaultValue.trim().equalsIgnoreCase("") ? webElement.findElement(By.xpath(".//option[@selected='']")).getText() : defaultValue;
				} catch (NoSuchElementException e) {
					defaultValue = dropDown.getOptions().get(0).getText();
				}

				if (defaultValue.equals(expectedDefValue))
					return Result.PASS().setOutput(true).setMessage(ReturnMessages.MATCHVALUE.toString()).make();
				else
					return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false).setMessage(ReturnMessages.verificationFailed(defaultValue, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue())).make();
			}
		}.run();
		

	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	//@NotSupportedInMobileContext
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getDropDownToolTip(AppiumObject object) throws Exception {
		return new WebObjects().Method_getObjectToolTip(object);
	}

	/*
	 * 
	 * 
	 * 
	 * */
	//@NotSupportedInMobileContext
	public FunctionResult Method_SetFocusonDropDown(AppiumObject object) throws Exception {
		WebElement ele = Finder.findWebElementUsingCheckPoint(object);
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun() throws ToolNotSetException {

				// For Focussing in MAC Safari
				
					try {
						ele.sendKeys("");
					} catch (Exception e) {
						AppiumDriver<WebElement> driver = Finder.findAppiumDriver();
						JavascriptExecutor exe = (JavascriptExecutor)driver;
						exe.executeScript("document.activeElement.focus()");
					}
				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}
	
	
	
	public FunctionResult Method_getDropDownDefaultValue(AppiumObject object) throws Exception {
		
		WebElement dropDown = Finder.findWebElementUsingCheckPoint(object);
		
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				
				String source = dropDown.getAttribute("outerHTML");
				Document html = Jsoup.parse(source);
				Elements element = html.select("option");

				if (element == null | element.size() == 0) {
					return Result.PASS().setOutput("Object not Operatable").make();
				}

				String default_Item = element.first().text();

				for (Element element2 : element) {
					if (element2.toString().contains("selected")) {
						default_Item = element2.text();
					}
				}
				
				return Result.PASS().setOutput(default_Item).make();

			}
		}.run();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	@NotSupportedInNativeApplication
	public FunctionResult Method_verifyDropDownItemExists(AppiumObject object, String expectedItem) throws Exception {
		return Utils.CustomVerifyDropDownItemExists(object, expectedItem, true);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInNativeApplication
	public FunctionResult Method_verifyDropDownSelection(AppiumObject object, String expectedItemSelected) throws Exception {

		WebElement we = Finder.findWebElementUsingCheckPoint(object);
		return new GenericCheckpoint<FunctionResult>() {

			@Override
			public FunctionResult _innerRun() throws Exception {
				CustomSelect selectData = new CustomSelect(we, true);
				List<WebElement> option = selectData.getAllSelectedOptions();
				int sizeOfList = option.size();
				String actualFound = Method_getSelectedDropDownItem(object).getOutput();

				if (sizeOfList == 0) {
					return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setMessage(ReturnMessages.NOT_SELECTED.toString()).make();
				}

				else if (sizeOfList == 1) {
					if (actualFound.contentEquals(expectedItemSelected))
						return Result.PASS().setOutput(true).setMessage(ReturnMessages.MATCH_SELECTED.toString()).make();
				}

				return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false).setMessage(ReturnMessages.verificationFailed(actualFound, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue())).make();
			
			}
			
		}.run();
		}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	@NotSupportedInNativeApplication
	public FunctionResult Method_verifyAllDropDownItemExist(AppiumObject object, String expectedItem) throws Exception {
		return this.Method_verifyAllDropDownItems(object, expectedItem);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	@NotSupportedInApplicationMode
	public FunctionResult Method_verifyMultipleDropDownItemExist(AppiumObject object, String expectedItem) throws Exception {

		String[] exceptedArray = expectedItem.split(";");
		WebElement dropdown = Finder.findWebElement(object);
		Select select = new Select(dropdown);
		int matchCount = 0;

		List<WebElement> allOptions = select.getOptions();
		for (int i = 0; i < allOptions.size(); i++) {
			for (int j = 0; j < exceptedArray.length; j++) {
				if ((exceptedArray[j].contentEquals(allOptions.get(i).getText().toString()))) {
					matchCount++;
					break;
				}
			}

		}
		if (matchCount == exceptedArray.length) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.ALL_MATCH.toString()).make();
		} else {

			return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false).setMessage(ReturnMessages.verificationFailed(allOptions.toString(), Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue())).make();
		}

	}

	/**
	 * 
	 * 
	 * 
	 * 
	 * */

	@NotSupportedInNativeApplication
	public FunctionResult Method_verifyAllDropDownItems(AppiumObject object, String expectedItem) throws Exception {

		
		String[] exceptedArray = expectedItem.split(Utils.getDelimiter());
		WebElement dropdown = Finder.findWebElementUsingCheckPoint(object);
		return new GenericCheckpoint<FunctionResult>() {

			@Override
			public FunctionResult _innerRun() throws Exception {
				Select select = new Select(dropdown);
				List<WebElement> allOptions = select.getOptions();
				int matchCount = 0;
				String tempStr = "";

				for (WebElement we : allOptions) {
					tempStr = tempStr + we.getText() + Utils.getDelimiter();
				}
				if (tempStr.endsWith(Utils.getDelimiter())) {
					tempStr = tempStr.substring(0, tempStr.length() - 1);
				}

				if (allOptions.size() < exceptedArray.length) {
					return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
							.setMessage("Expected number of option exceeds the total options in dropdown./n/r" + ReturnMessages.verificationFailed(tempStr, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue())).make();
				}

				for (int i = 0; i < allOptions.size(); i++) {
					for (int j = 0; j < exceptedArray.length; j++) {
						if ((Utils.contentEquals(exceptedArray[j], allOptions.get(i).getText().toString()))) {
							matchCount++;
							break;
						}
					}
				}

				if (matchCount == exceptedArray.length) {
					return Result.PASS().setOutput(true).setMessage(ReturnMessages.ALL_MATCH.toString()).make();

				} else {
					return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false).setMessage(ReturnMessages.verificationFailed(tempStr, expectedItem)).make();
				}
			}
		}.run();
		
	}
}