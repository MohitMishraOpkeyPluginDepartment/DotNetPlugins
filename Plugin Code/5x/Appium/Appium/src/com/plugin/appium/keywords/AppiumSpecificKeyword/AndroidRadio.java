package com.plugin.appium.keywords.AppiumSpecificKeyword;

import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.Utils;
import com.plugin.appium.enums.ReturnMessages;

public class AndroidRadio implements KeywordLibrary {

	/**
	 * 
	 * 
	 * 
	 * 
	 * 
	 */
	public FunctionResult Method_SelectRadioButton(AppiumObject object) throws Exception {
		WebElement we = Finder.findWebElementUsingCheckPoint(object);

		if (Utils.isElementSelected(we)) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.ALREADY_SELECTED.toString()).make();

		} else {
			we.click();
			return Result.PASS().setOutput(true).make();
		}

	}

	/**
	 * @throws Exception 
	 * 
	 * 
	 * 
	 * 
	 * 
	 */
	public FunctionResult Method_getRadioButtonStatus(AppiumObject object)
			throws Exception {
		WebElement we = Finder.findWebElement(object);
		return Result.PASS().setOutput(Utils.isElementSelected(we)).make();
	}

	/**
	 * @throws Exception 
	 * 
	 * 
	 * 
	 * 
	 * 
	 */
	public FunctionResult Method_VerifyRadioButtonStatus(AppiumObject object, Boolean status)
			throws Exception {
		WebElement ae = Finder.findWebElementUsingCheckPoint(object);
		Boolean getStatus = Utils.isElementSelected(ae);
		if (getStatus == status) {
			return Result.PASS().setOutput(true).make();
		}

		return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
				.setMessage(ReturnMessages.verificationFailed(getStatus, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue())).make();
	}
}
