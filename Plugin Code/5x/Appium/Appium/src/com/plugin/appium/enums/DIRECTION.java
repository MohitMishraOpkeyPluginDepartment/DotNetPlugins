package com.plugin.appium.enums;

public enum DIRECTION {
	LEFT("LEFT"), LEFTMOST("LEFTMOST"), RIGHT("RIGHT"), RIGHTMOST("RIGHTMOST"), UP("UP"), UPMOST("UPMOST"), DOWN("DOWN"), DOWNMOST("DOWNMOST");
	
	private String value;
	private DIRECTION(String value) {
		this.value = value;
	}
	
	public String getString() {
		return this.value;
	}
	
	public boolean isMatch(String str) {
		return this.getString().equalsIgnoreCase(str);
	}
}
