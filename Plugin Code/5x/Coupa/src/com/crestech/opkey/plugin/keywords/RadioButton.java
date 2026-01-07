package com.crestech.opkey.plugin.keywords;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.webdriver.OpkeyLogger;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ObjectNotFoundException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ToolNotSetException;
import com.crestech.opkey.plugin.webdriver.keywords.Radio;
import com.crestech.opkey.plugin.webdriver.object.WebDriverObject;

public class RadioButton implements KeywordLibrary {
	
	static Class<RadioButton> _class = RadioButton.class;
	
	public FunctionResult Method_SelectRadioButtonInUsingText(WebDriverObject object, String textSearch, int index, boolean isContains, boolean before)
			throws InterruptedException, ToolNotSetException, ObjectNotFoundException {

		if (object.getTextToSearch().getValue() != null && (!object.getTextToSearch().getValue().isEmpty() || !object.getTextToSearch().getValue().equals(""))) {
			textSearch = object.getTextToSearch().getValue();
			OpkeyLogger.printSaasLog(_class, object.getIndex().getValue());
			try {
				index = Integer.parseInt(object.getIndex().getValue());
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "Index found Not to be Integer.Considering 0 as new Index");
				index = 0;
			}
			try {
				isContains = Boolean.parseBoolean(object.getPartialText().getValue());
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "PartialText found Not to be Boolean.Considering False as Default");
				isContains = false;
			}
			try {
				before = Boolean.parseBoolean(object.getBefore().getValue());
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "PartialText found Not to be Boolean.Considering False as Default");
				before = false;
			}
		} else {
			FunctionResult fr = null;
			try {
				fr = new Radio().selectRadioHelper(textSearch, index, isContains, before);
			} catch (Exception ex) {
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
						.setMessage("No Object Found With Text <" + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue() + ">").make();
			}
			return fr;
		}
		FunctionResult fr = null;
		try {
			fr = new Radio().selectRadioHelper(textSearch, index, isContains, before);
		} catch (Exception ex) {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage("No Object Found With Text <" + textSearch + ">").setOutput(false).make();
		}
		if (fr.getOutput().equalsIgnoreCase("false")) {
			fr.setMessage("No Object Found With Text <" + textSearch + ">");
		}
		return fr;
	}
}
