package com.plugin.appium.javascript.jstools;

public class ActionValidator {
	private Exception exception = null;
	private String action_status = null;

	public ActionValidator(Exception _exception, String _status) {
		this.exception = _exception;
		this.action_status = _status;
	}

	public Exception getException() {
		return this.exception;
	}

	public String getClickStatus() {
		return this.action_status;
	}
}
