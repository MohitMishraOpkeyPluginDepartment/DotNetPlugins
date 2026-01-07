package com.plugin.appium.enums;

public enum Messages {
	
	TIMEOUT_INSIDE_FINDER("Object Not Found"),
	FUNCTIONRESSULT_OBJECT_NOT_FOUND("");
	
	
	
	String message;
	
	Messages(String message){
		this.message = message;
	}
	
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return message;
	}

}
