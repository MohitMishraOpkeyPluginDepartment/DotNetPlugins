package com.plugin.appium.exceptionhandlers;

public class AdbNotFoundException extends Exception{
	
	String msg;
	
	public AdbNotFoundException(String msg) {
		super(msg);
		this.msg = msg;
	}

	private static final long serialVersionUID = -8964044945299185609l;

}
