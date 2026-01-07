package com.plugin.appium;

import com.crestech.opkey.plugin.communication.contracts.functioncall.Object.Properties.Property;

public class AppiumObjectProperty {

	private String name;
	private String value;
	private Boolean isUsed;

	public AppiumObjectProperty(String name, String value, Boolean isUsed) {
		this.name = name;
		this.value = value;
		this.isUsed = isUsed;
	}

	public AppiumObjectProperty(Property prp) {
		this.name = prp.getName();
		this.value = prp.getValue();
		this.isUsed = prp.isIsUsed();
	}

	public String getName() {
		return name;
	}

	public String getValue() {
		return value;
	}

	public Boolean isUsed() {
		return isUsed;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public void setIsUsed(Boolean isUsed) {
		this.isUsed = isUsed;
	}

	@Override
	public String toString() {
		return "[" + this.name + ", " + this.value + ", " + this.isUsed + "]";
	}
	
	public Boolean isValueNullOrEmpty() {
		if (this.getValue() == null) // null value
			return true;

		if (this.getValue().trim().length() == 0) // empty string
			return true;

		return false;
	}

}