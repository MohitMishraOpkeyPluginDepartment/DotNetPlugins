package com.plugin.appium.exceptionhandlers;

public class AppiumCliValidationFailException extends Exception{

	
	String reason;
	
	public AppiumCliValidationFailException(String reason) {
		super(reason);
		this.reason = reason;
	}
	
	private static final long serialVersionUID = -8964044945299185509l;
	
}
