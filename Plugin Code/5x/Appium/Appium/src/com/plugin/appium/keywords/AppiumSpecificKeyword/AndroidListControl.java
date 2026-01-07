package com.plugin.appium.keywords.AppiumSpecificKeyword;


import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Utils;
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInHybridApplication;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.keywords.GenericKeyword.WebObjects;

public class AndroidListControl implements KeywordLibrary {

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	private Boolean _comboShieldObject = true;

	@NotSupportedInHybridApplication
	public FunctionResult Method_getSelectedListItem(AppiumObject object) throws Exception {

		String selectedItem = Utils.CustomGetSelectedItem(object);

		if (selectedItem == null) {
			return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND)
					.setOutput(false)
					.setMessage(ReturnMessages.ITEM_NOT_SELECTED.toString())
					.make();
			
		} else {		
			return Result.PASS().setOutput(selectedItem).make();
		}
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInHybridApplication
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_verifyListItemExists(AppiumObject object, String expectedItem) throws Exception {
		//System.out.println("class name:-  "+object.getClassName().getName()+"  value:- "+object.getClassName().getValue()+ "  class:- "+object.getClassName().getClass());
		if(object.getClassName().getValue().equalsIgnoreCase("android.widget.ListView")){
			//System.out.println("class name:-  "+object.getClassName().getName());
			_comboShieldObject=false;
		}
		return Utils.CustomVerifyDropDownItemExists(object, expectedItem, _comboShieldObject);
	}

	/*
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInHybridApplication
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_selectListItem(AppiumObject object, String value) throws Exception {
		//System.out.println("class name:-  "+object.getClassName().getName()+"  value:- "+object.getClassName().getValue()+ "  class:- "+object.getClassName().getClass());
		new WebObjects().Method_waitforObject(object, 20);
		if(object.getClassName().getValue().equalsIgnoreCase("android.widget.ListView")){
			_comboShieldObject=false;
		}
		
		
		Utils.CustomselectDropDownItem(object, value, _comboShieldObject);
		return Result.PASS().setOutput(true).make();
	}

}
