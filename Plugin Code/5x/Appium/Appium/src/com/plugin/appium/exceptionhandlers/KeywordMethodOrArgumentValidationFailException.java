package com.plugin.appium.exceptionhandlers;

import com.crestech.opkey.plugin.ResultCodes;

public class KeywordMethodOrArgumentValidationFailException extends Exception {
	private static final long serialVersionUID = -6454321776464870004L;

	private ResultCodes errorResultCode;

	public KeywordMethodOrArgumentValidationFailException(String message, ResultCodes failResultCode) {
		super(message);
		this.errorResultCode = failResultCode;
	}

	public ResultCodes getErrorCode() {
		return this.errorResultCode;
	}
}
