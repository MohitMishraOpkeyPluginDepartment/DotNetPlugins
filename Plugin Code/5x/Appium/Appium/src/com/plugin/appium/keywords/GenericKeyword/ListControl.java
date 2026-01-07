package com.plugin.appium.keywords.GenericKeyword;

import java.util.List;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;


import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.Utils;
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInApplicationMode;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.util.GenericCheckpoint;

public class ListControl implements KeywordLibrary {

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	@NotSupportedInApplicationMode
	public FunctionResult Method_selectMultipleDropDownItem(AppiumObject object, String value) throws Exception {

		return new DropDown().Method_selectDropDownItem(object, value);

	}

	/**
	 * 
	 *
	 * 
	 * 
	 */

	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	@NotSupportedInApplicationMode
	public FunctionResult Method_deselectMultipleDropDownItem(AppiumObject object, String userExpText) throws Exception {

		WebElement ele = Finder.findWebElementUsingCheckPoint(object);
		
		return new GenericCheckpoint<FunctionResult>() {

			@Override
			public FunctionResult _innerRun() throws Exception {
				Select selectData = new Select(ele);
				String tempString = "";
				List<WebElement> selectedOption = selectData.getAllSelectedOptions();

				boolean deselctedFlag = false;
				for (int selectOpt = 0; selectOpt < selectedOption.size(); selectOpt++) {

					String dropDownText = selectedOption.get(selectOpt).getText().toString();
					tempString = dropDownText + Utils.getDelimiter();
					//System.out.println("userExpText<" + userExpText + ">dropDownText<" + dropDownText + ">userExpText.contentEquals(dropDownText)<" + userExpText.contentEquals(dropDownText) + ">");

					if (userExpText.contentEquals(dropDownText)) {
						selectData.deselectByVisibleText(userExpText);
					}
					deselctedFlag = true;
				}

				// if tempString ends with delimiter i.e(;) then remove it.
				tempString = tempString.endsWith(Utils.getDelimiter()) ? tempString.substring(0, (tempString.length() - 1)) : tempString;

				if (deselctedFlag)
					return Result.PASS().setOutput(true).make();
				else
					return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setMessage("Expected item doesnot exist among selected option(s) \n\r" + ReturnMessages.verificationFailed(tempString, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue()))
							.make();
			}
		}.run();
		

	}
}