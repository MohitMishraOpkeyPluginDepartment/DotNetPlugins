package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.ElementNotVisibleException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;

public class ElementNotVisibleExceptionHandler implements ExceptionHandler {
	
	public Class<?> getExceptionType() {
		return ElementNotVisibleException.class;
	}

	@Override
	public FunctionResult handle(Throwable e) {
		ElementNotVisibleException ex = (ElementNotVisibleException) e;

		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE)
				.setMessage(ex.getMessage())
				.setMessage("Element Not Visible")
				.make();
	}

	
}
