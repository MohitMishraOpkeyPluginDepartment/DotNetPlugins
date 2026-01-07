package com.plugin.appium.keywords.AppiumSpecificKeyword;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.Utils;
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInHybridApplication;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.DriverWindow;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.keywords.GenericKeyword.WebObjects;
import com.plugin.appium.util.GenericCheckpoint;

import io.appium.java_client.android.nativekey.AndroidKey;

public class Spinner implements KeywordLibrary {

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInHybridApplication
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_selectSpinnerItem(AppiumObject object, String value) throws Exception {
		new WebObjects().Method_waitforObject(object, 20);
		Utils.CustomselectDropDownItem(object, value, true);
		return Result.PASS().setOutput(true).make();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInHybridApplication
	public FunctionResult Method_getSelectedSpinnerItem(AppiumObject object) throws Exception {

		String getSelectedItem = Utils.CustomGetSelectedItem(object);
		if (getSelectedItem == null) {
			return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setOutput(false).setMessage(ReturnMessages.ITEM_NOT_SELECTED.toString()).make();
		}
		return Result.PASS().setOutput(getSelectedItem).make();
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInHybridApplication
	public FunctionResult Method_verifySpinnerItemExists(AppiumObject object, String expectedItem) throws Exception {
		return Utils.CustomVerifyDropDownItemExists(object, expectedItem, true);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	@NotSupportedInHybridApplication
	public FunctionResult Method_deselectSpinnerItem(AppiumObject object) throws Exception {

		WebElement we = Finder.findWebElementUsingCheckPoint(object);
		
		return new GenericCheckpoint<FunctionResult>() {

			@Override
			public FunctionResult _innerRun() throws Exception {
				// TODO Auto-generated method stub
				if (AppiumContext.isBrowserMode()) {
					try {
						// When we run on Browser 
						// try to get the default Selected Option When Website Is Load
						WebElement option = we.findElement(By.xpath(".//option[@selected]"));
						Select selectData = new Select(we);
						selectData.selectByVisibleText(option.getText());
					}
					// when object select default index
					catch (NoSuchElementException e) {
						Select selectData = new Select(we);
						selectData.selectByIndex(0);
					}
				} else {
					String afterDeselect = "";
					String beforeSelect = Utils.CustomGetSelectedItem(object);

					// first select the current element

					we.click();

//					Utils.PressAndroidButton(20);
					Utils.pressAndroidButton(AndroidKey.DPAD_DOWN);

					// after selection select the next element using key down
//					Utils.PressAndroidButton(20);
					Utils.pressAndroidButton(AndroidKey.DPAD_DOWN);


					// Press enter
//					Utils.PressAndroidButton(66);
					Utils.pressAndroidButton(AndroidKey.ENTER);

					// we again find because after clicking page is refresh and old
					// webelement not performing operation
					// given exception --- element no longer attach with Dom ---

					afterDeselect = Utils.CustomGetSelectedItem(object);

					System.out.println(" after Deselect " + afterDeselect + " before Deselect " + beforeSelect);

					if (beforeSelect.equalsIgnoreCase(afterDeselect)) {
						// no changes happened than try to select a upper element
						we.click();

						// first select the current element
						if (AppiumContext.getDriverWindow() == DriverWindow.Native) {
							// In the webview by default element is selected when we
							// click
							// on element
//							Utils.PressAndroidButton(19);
							Utils.pressAndroidButton(AndroidKey.DPAD_UP);
						}
						// after selection select the select upper element using up
						// arrow
						// key
//						Utils.PressAndroidButton(19);
						Utils.pressAndroidButton(AndroidKey.DPAD_UP);

						// Press enter
//						Utils.PressAndroidButton(66);
						Utils.pressAndroidButton(AndroidKey.ENTER);

					}

					// we again find because after clicking page is refresh and old
					// webelement not performing operation
					// given exception --- element no longer attach with Dom ---
					afterDeselect = Utils.CustomGetSelectedItem(object);

					if (beforeSelect.equalsIgnoreCase(afterDeselect)) {
						// still no changes
						return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE).setOutput(false).make();
					}
				}
				return Result.PASS().setOutput(true).make();
			}
		}.run();
		

		
	}

}
