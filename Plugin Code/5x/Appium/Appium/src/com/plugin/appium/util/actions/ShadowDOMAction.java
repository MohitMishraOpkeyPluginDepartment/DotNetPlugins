package com.plugin.appium.util.actions;

import java.util.List;

import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.Utils;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.finder.shadowdom.ShadowDOMFinder;
import com.plugin.appium.javascript.jstools.JSTool;
import com.plugin.appium.keywords.GenericKeyword.WebObjects;

public class ShadowDOMAction {

	public FunctionResult typeByText(String textToSearch, String textToType, int index, boolean isContains) throws Exception {
		List<WebElement> editBoxList = new ShadowDOMFinder().findEditBoxByText(textToSearch, isContains);
		System.out.println("Founded Element Size: " + editBoxList.size());
		
		if (editBoxList.size() == 0) {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).make();
		}

		if(AppiumContext.isAndroid()) {
			editBoxList = Utils.visible(editBoxList);
			System.out.println("@Android: After Visibility Check, Element Size: " + editBoxList.size());
			if (editBoxList.size() == 0) {
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Visible Element Not Found").make();
			}

			if (index + 1 > editBoxList.size()) {
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Index provided is Invalid").make();
			}
		}
		
		try {
			editBoxList.get(index).clear();
			editBoxList.get(index).sendKeys(textToType);
		} catch (Exception e) {
			System.out.println("Android: Exception While Typing using Appium. Trying Using JavaScript.");
			new JSTool().performJavaScriptTypeText(editBoxList.get(0), textToType);
		}

		return Result.PASS().setOutput(true).make();
	}
	
	public FunctionResult clickByText(String textToSearch, int index, boolean isContains) throws Exception {
		List<WebElement> elements = new ShadowDOMFinder().findByTextClick(textToSearch, isContains);
		System.out.println("@Click Element Size: " + elements.size());
		
		if (elements.size() == 0) {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).make();
		}
		
		if(AppiumContext.isAndroid()) {
			elements = Utils.isVisibleByAppium(elements);
			System.out.println("@Android: After Visibility Check, Element Size: " + elements.size());
			if (elements.size() == 0) {
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).make();
			}
			if (index + 1 > elements.size()) {
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Index provided is Invalid").make();
			}
		}
		
		// Appium doing fake pass
		if(AppiumContext.isIOS()) {
			try {
				new JSTool().performJavaScriptClick(elements.get(0));
				new WebObjects().Method_clickUsingJavaScript(elements.get(0));
			} catch (Exception e) {
				System.out.println("iOS: Exception While Clicking using JavaScript. Trying Using Appium.");
				//e.printStackTrace();
				new WebObjects().ClickElement(elements.get(0));
			}
		}else {
			try {
				new WebObjects().ClickElement(elements.get(index));
			} catch (Exception e) {
				System.out.println("Android: Exception While Clicking using Appium. Trying Using JavaScript.");
				new JSTool().performJavaScriptClick(elements.get(index));
				new WebObjects().Method_clickUsingJavaScript(elements.get(index));
			}
		}
		
		return Result.PASS().setOutput(true).make();
	}
}
