package com.plugin.appium.keywords.GenericKeyword.actionByText;

import java.util.List;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.keywords.GenericKeyword.ObjectProperty;

public class ByTextInSequence {

	private List<ObjectProperty> objectPropertyList;
	private boolean isDaynamicObject;
	ActionByText actionByText;

	public ByTextInSequence(List<ObjectProperty> objectPropertyList) {
		this.objectPropertyList = objectPropertyList;
	}

	public FunctionResult click() throws Exception {
		if (!(this.isDynamicObjectAdded()) && this.isFirstTextEmpty()) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setMessage("Text is not provided").setOutput(false).make();
		}

		return this.clickInSequence();
	}

	private boolean isDynamicObjectAdded() {
		AppiumObject object1 = objectPropertyList.get(0).getAppiumObject();
		if (object1 != null && object1.getTextToSearch().getValue() != null && (!object1.getTextToSearch().getValue().isEmpty() || !object1.getTextToSearch().getValue().equals(""))) {
			this.isDaynamicObject = true;
			return true;
		}
		this.isDaynamicObject = false;
		return false;
	}

	private boolean isFirstTextEmpty() {
		if (this.objectPropertyList.get(0).getTextToSearch().length() == 0)
			return true;

		return false;
	}

	private FunctionResult clickInSequence() throws Exception {
		int counter = 1;
		this.actionByText = new ActionByText();
		for (ObjectProperty objectProperty : this.objectPropertyList) {
			System.out.println("@Counter: " + counter);
			FunctionResult fr = this.clickByText(objectProperty);
			if (fr.getOutput().trim().equalsIgnoreCase("false")) {
				System.out.println("FrOutput: " + fr.getOutput());
				return fr;
			}
				
			System.out.println("Next: " + this.isNext(objectProperty));
			System.out.println("CounterStatus: " + (counter == (this.objectPropertyList.size())));
			System.out.println("Size: " + this.objectPropertyList.size());
			if(counter == (this.objectPropertyList.size()))
				return Result.PASS().setOutput(true).make();
			else if(!this.isNext(this.objectPropertyList.get(counter))) {
				return Result.PASS().setOutput(true).make();
			}
			counter++;
		}
		return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setMessage("Unexpected Result").setOutput(false).make();
	}
	
	private FunctionResult clickByText(ObjectProperty objectProperty) throws Exception {
		Finder.textElementsList.clear();
		objectProperty = this.validateArguments(objectProperty);
		return this.actionByText.clickByTextHelper(objectProperty.getTextToSearch(), objectProperty.getIndex(), objectProperty.isContains(), objectProperty.getBeforeText(), objectProperty.getAfterText());
	}
	
	private ObjectProperty validateArguments(ObjectProperty objectProperty) throws ArgumentDataInvalidException {
		AppiumObject appiumObject = objectProperty.getAppiumObject();
	
		if (this.isDaynamicObject && appiumObject != null) {
			String text = appiumObject.getTextToSearch().getValue();
			String before = appiumObject.getBefore().getValue();
			String after = appiumObject.getAfter().getValue();
			if (before == null)
				before = "";
			if (after == null)
				after = "";
			Log.print(appiumObject.getIndex().getValue());
			int index;
			try {
				index = Integer.parseInt(appiumObject.getIndex().getValue());
			} catch (Exception ex) {
				Log.print("Index found Not to be Integer.Considering 0 as new Index");
				index = 0;
			}
			
			boolean isContains;
			try {
				isContains = Boolean.parseBoolean(appiumObject.getPartialText().getValue());
			} catch (Exception ex) {
				Log.print("PartialText found Not to be Boolean.Considering False as Default");
				isContains = false;
			}
			
			objectProperty.setTextToSearch(text);
			objectProperty.setIndex(index);
			objectProperty.setBeforeText(before);
			objectProperty.setAfterText(after);
			objectProperty.setContains(isContains);
			
			return objectProperty;
		}
		
		objectProperty.setBeforeText("");
		objectProperty.setAfterText("");
		return objectProperty;
	}
	
	private boolean isNext(ObjectProperty objectProperty) {
		AppiumObject appiumObject = objectProperty.getAppiumObject();
		boolean isEmtyDanmicObject = (appiumObject == null || appiumObject.getTextToSearch().getValue() == null || appiumObject.getTextToSearch().getValue().isEmpty() || appiumObject.getTextToSearch().getValue().equals("")); 
		boolean isEmptyObjectProperty = (objectProperty.getTextToSearch() == null || objectProperty.getTextToSearch().isEmpty() || objectProperty.getTextToSearch().equals(""));
		
		System.out.println("isEmtyDanmicObject: " + isEmtyDanmicObject);
		System.out.println("isEmptyObjectProperty: " + isEmptyObjectProperty);
		if(isEmtyDanmicObject && isEmptyObjectProperty) {
			return false;
		}
		return true;
	}
}
