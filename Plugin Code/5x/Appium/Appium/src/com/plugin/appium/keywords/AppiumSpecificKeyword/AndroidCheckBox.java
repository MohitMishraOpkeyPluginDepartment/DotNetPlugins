package com.plugin.appium.keywords.AppiumSpecificKeyword;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInApplicationMode;

public class AndroidCheckBox implements KeywordLibrary {
	@NotSupportedInApplicationMode
	public FunctionResult Method_appiumSelectCheckBox(AppiumObject object) throws Exception {

		return new AndroidRadio().Method_SelectRadioButton(object);
	}

}
