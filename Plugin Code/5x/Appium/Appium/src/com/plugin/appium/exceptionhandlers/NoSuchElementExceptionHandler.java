package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.NoSuchElementException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;

public class NoSuchElementExceptionHandler implements ExceptionHandler {
	@Override
	public Class<?> getExceptionType() {
		return NoSuchElementException.class;
	}

	@Override
	public FunctionResult handle(Throwable e) {
		NoSuchElementException ex = (NoSuchElementException) e;

		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND)
				.setMessage(ex.getMessage())
				.make();
	}
}
