package com.plugin.appium.keywords.GenericKeyword;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInApplicationMode;
import com.plugin.appium.util.actions.ShadowDOMAction;

public class ShadowDOM implements KeywordLibrary{

	@NotSupportedInApplicationMode
	public FunctionResult ShadowDOM_TypeByText(String textToSearch, String textToType, int index, boolean isContains) throws Exception {
		return new ShadowDOMAction().typeByText(textToSearch, textToType, index, isContains);
	}
	
	@NotSupportedInApplicationMode
	public FunctionResult ShadowDOM_ClickByText(String textToSearch, int index, boolean isContains) throws Exception {
		return new ShadowDOMAction().clickByText(textToSearch, index, isContains);
	}

}
