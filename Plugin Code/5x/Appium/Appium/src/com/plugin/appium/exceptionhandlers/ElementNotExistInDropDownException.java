package com.plugin.appium.exceptionhandlers;

public class ElementNotExistInDropDownException extends Exception {
String  reason; 
	
	public ElementNotExistInDropDownException(String reason) {
		super(reason);
		this.reason = reason;
	}
	
	private static final long serialVersionUID = -8964044945299185499l;
}
