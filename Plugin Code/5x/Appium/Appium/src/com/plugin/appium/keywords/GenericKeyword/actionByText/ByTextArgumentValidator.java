package com.plugin.appium.keywords.GenericKeyword.actionByText;

import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Log;
import com.plugin.appium.keywords.GenericKeyword.ObjectProperty;

public class ByTextArgumentValidator {
	private boolean isDaynamicObject;
	private ObjectProperty objectProperty;
	
	public ObjectProperty validate(ObjectProperty objectProperty) throws Exception {
		this.objectProperty = objectProperty;
		if (!(this.isDynamicObjectAdded()) && this.isFirstTextEmpty()) {
			throw new ArgumentDataMissingException("Text is not provided");
		}
		return validateArguments();
	}
	
	private boolean isDynamicObjectAdded() {
		AppiumObject object1 = this.objectProperty.getAppiumObject();
		if (object1 != null && object1.getText().getValue() != null && (!object1.getText().getValue().isEmpty() || !object1.getText().getValue().equals(""))) {
			this.isDaynamicObject = true;
			return true;
		}
		this.isDaynamicObject = false;
		return false;
	}
	
	private boolean isFirstTextEmpty() {
		if (this.objectProperty.getTextToSearch().length() == 0)
			return true;

		return false;
	}
	
	private ObjectProperty validateArguments() throws ArgumentDataInvalidException {
		AppiumObject appiumObject = objectProperty.getAppiumObject();
	
		if (this.isDaynamicObject && appiumObject != null) {
			String text = appiumObject.getText().getValue();
			String before = appiumObject.getBefore().getValue();
			String after = appiumObject.getAfter().getValue();
			if (before == null)
				before = "";
			if (after == null)
				after = "";
//			Log.print(appiumObject.getIndex().getValue());
//			int index;
//			try {
//				index = Integer.parseInt(appiumObject.getIndex().getValue());
//			} catch (Exception ex) {
//				Log.print("Index found Not to be Integer.Considering 0 as new Index");
//				index = 0;
//			}
			
			boolean isContains;
			try {
				isContains = Boolean.parseBoolean(appiumObject.getPartialText().getValue());
			} catch (Exception ex) {
				Log.print("PartialText found Not to be Boolean.Considering False as Default");
				isContains = false;
			}
			
			objectProperty.setTextToSearch(text);
			//objectProperty.setIndex(index);
			objectProperty.setBeforeText(before);
			objectProperty.setAfterText(after);
			objectProperty.setContains(isContains);
			
			return objectProperty;
		}
		
		objectProperty.setBeforeText("");
		objectProperty.setAfterText("");
		return objectProperty;
	}
}
