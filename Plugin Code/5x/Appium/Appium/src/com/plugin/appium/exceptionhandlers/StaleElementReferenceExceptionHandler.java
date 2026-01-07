package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.StaleElementReferenceException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;

public class StaleElementReferenceExceptionHandler implements ExceptionHandler {

	@Override
	public Class<?> getExceptionType() {
		return StaleElementReferenceException.class;
	}

	@Override
	public FunctionResult handle(Throwable e) {
				
		StaleElementReferenceException ex = (StaleElementReferenceException) e;

		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE)
				.setMessage(ex.getMessage())
				.setMessage("Element does not exist in cache...")
				.make();
	}
}
