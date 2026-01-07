package com.plugin.appium.keywords.GenericKeyword;

import org.openqa.selenium.WebElement;


import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.Utils;
import com.plugin.appium.annotations.keywordValidation.KeywordActionType;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInMobileContext;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInNativeApplication;
import com.plugin.appium.enums.ActionType;
import com.plugin.appium.enums.ReturnMessages;

public class TextArea implements KeywordLibrary {

	EditBox editbox = new EditBox();
	WebObjects webobject = new WebObjects();

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	public FunctionResult Method_verifyTextAreaEditable(AppiumObject object) throws Exception {
		WebElement we = Finder.findWebElementUsingCheckPoint(object);
		if(EditBox.isEditbox(object, we)) {
			if (new Utils().isElementEnabled(we)) {
				return Result.PASS().setOutput(true).setMessage(ReturnMessages.EDITABLE.toString()).make();
			}
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.NOTEDITABLE.toString()).make();
		}
		return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
				.setMessage("The Object is not of textArea type").make();
	}
	
	
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getTextAreavalue(AppiumObject object)
			throws Exception {
		return new EditBox().Method_getEditboxValue(object);
	}
	
	
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getTextAreaName(AppiumObject object)
			throws Exception {
		
		return new EditBox().Method_GetEditBoxName(object);
		
	}
	
	
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getTextAreaDefaultvalue(AppiumObject object) throws Exception {
		
				return Method_GetTextfromTextArea(object);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	
	public FunctionResult Method_typeKeysInTextArea(AppiumObject object,
			String value) throws Exception {
		return editbox.Method_typeKeysOnEditBox(object, value);

	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	public FunctionResult Method_typeTextandEnterTextArea(
			AppiumObject object, String value) throws Exception {
		return editbox.Method_typeTextandEnterEditBox(object, value);

	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	
	public FunctionResult Method_verifyTextAreaText(AppiumObject object,
			String userText) throws Exception {
		return editbox.Method_verifyeditboxtext(object, userText);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	public FunctionResult Method_verifyTextAreaToolTip(AppiumObject object,
			String userToolTipText) throws Exception {
		return new EditBox().Method_verifyEditBoxToolTip(object, userToolTipText);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	public FunctionResult Method_verifyTextAreaExist(AppiumObject object)
			throws Exception {
		return webobject.Method_ObjectExists(object);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	public FunctionResult Method_clearTextArea(AppiumObject object)
			throws Exception {
		return editbox.Method_clearEditField(object);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	public FunctionResult Method_typeTextInTextArea(AppiumObject object,
			String value) throws Exception {
		//webobject.Method_waitforObject(object, 20);
		return editbox.Method_typeTextOnEditBox(object, value);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_GetTextfromTextArea(AppiumObject object)
			throws Exception {
		return editbox.Method_getTextFromEditBox(object);
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	public FunctionResult Method_verifyTextAreaEnabled(AppiumObject object)
			throws Exception {
		return webobject.Method_ObjectisEnabled(object);
	}
	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInMobileContext
	public FunctionResult Method_deFocusTextArea()
			throws Exception{
		return null;
	}
	
	/**
	 * 
	 * 
	 * 
	 * 
	 */
	public FunctionResult Method_SetfocusTextArea(AppiumObject object)
			throws Exception {
		return new EditBox().Method_SetfocusEditField(object);
	}
	
	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getTextAreaToolTip(AppiumObject object)
			throws Exception {
		return new EditBox().Method_getEditBoxToolTip(object);
	}
	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInNativeApplication
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_GetTextAreaLength(AppiumObject object)
			throws Exception {
		
		WebElement we = Finder.findWebElementUsingCheckPoint(object);
		
		com.plugin.appium.Utils.isElementDisplayed(we);
		String getLength = we.getAttribute("length");
		System.out.println(" get text area length " + getLength);
		getLength = (getLength == null) ? we.getAttribute("maxlength") : getLength;
		System.out.println(" get text area Maxlength " + getLength);
		
		getLength = (getLength == null) ? we.getAttribute("size") : getLength;		
		System.out.println(" get text area Size " + getLength);
		getLength = (getLength == null) ? "0" : getLength;
		
		int getLengthStringToInt = Integer.valueOf(getLength);
		
		 if(getLengthStringToInt==0) {
			 return Result
					 .FAIL(ResultCodes.ERROR_INSUFFICIENT_PRIVILEGES)
					 .setOutput(getLengthStringToInt)
					 .setMessage(ReturnMessages.PROPERTY_NOT_FOUND.toString()).make();
		 }
		 
		 return Result.PASS().setOutput(getLengthStringToInt).make();
		
	}
	
	/**
	 * 
	 * 
	 * 
	 * 
	 */
	
	@NotSupportedInNativeApplication
	public FunctionResult Method_GetTextAreaColRowLength(AppiumObject object)
			throws Exception {
		 WebElement ele = Finder.findWebElementUsingCheckPoint(object);
		 
		 
		 //check if element is oprable 
		 //otherwise will throw Exception
		 com.plugin.appium.Utils.isOperable(ele);
		 
		 
		 String getCols = ele.getAttribute("cols");
		
		if(getCols!=null) {
			getCols=getCols+";";
		}
		
		String getRows =ele.getAttribute("rows");
		
		if(getCols==null || getRows==null) {
			 return Result
					 .FAIL(ResultCodes.ERROR_INSUFFICIENT_PRIVILEGES)
					 .setOutput(false)
					 .setMessage(ReturnMessages.PROPERTY_NOT_FOUND.toString())
					 .make();
		}
						
		 return Result.PASS().setOutput(getCols+getRows)
					.make();
		
	}
}
