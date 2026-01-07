package com.crestech.opkey.plugin.keywords.web;

import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.keywords.DropDown;
import com.crestech.opkey.plugin.webdriver.keywords.interfaceClass.OracleFusionMethods;
import com.crestech.opkey.plugin.webdriver.object.WebDriverObject;

public class DynamicMethods implements OracleFusionMethods {

	@Override
	public FunctionResult Oracle_selectDropDownByText(String OlabelSearch, int Oindex, boolean OisContains, String dropdownText, boolean Obefore, boolean isMultipleDropdown, WebDriverObject object)
			throws Exception {
		// TODO Auto-generated method stub
		return new DropDown().OF_selectDropDownByText(OlabelSearch, Oindex, OisContains, dropdownText, Obefore, isMultipleDropdown, object);
	}

	@Override
	public FunctionResult Oracle_selectDropDownByText(String OlabelSearch, int Oindex, boolean OisContains,
			String dropdownText, boolean Obefore, boolean isMultipleDropdown, WebDriverObject object, String after,
			String before) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

}
