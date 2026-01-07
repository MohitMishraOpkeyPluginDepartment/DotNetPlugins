package com.plugin.appium.exceptionhandlers;


import com.plugin.appium.AppiumObject;
import com.plugin.appium.enums.Messages;

public class ObjectNotFoundException extends Exception {

	AppiumObject object;

	public ObjectNotFoundException(AppiumObject object) {
		super("Object not found");
		
		this.object = object;
	}
	
	public ObjectNotFoundException(Messages message) {
		super(message.toString());
		
		this.object = new AppiumObject(false);
	}
	
	public ObjectNotFoundException(String message) {
		super(message.toString());
		
		this.object = new AppiumObject(false);
	}

	private static final long serialVersionUID = -8964044945299185497L;

}
