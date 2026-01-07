package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.UnhandledAlertException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;

public class UnhandledAlertExceptionHandler implements ExceptionHandler {

	@Override
	public Class<?> getExceptionType() {
		return UnhandledAlertException.class;
	}

	@Override
	public FunctionResult handle(Throwable e) {
		UnhandledAlertException ex = (UnhandledAlertException) e;

		return Result
				.FAIL(ResultCodes.ERROR_UNEXPECTED_POPUP_DETECTED)
				.setMessage(ex.getMessage())
				.make();	
	}
}
