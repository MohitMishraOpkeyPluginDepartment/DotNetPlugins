package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.interactions.InvalidCoordinatesException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;

public class InvalidCoordinatesExceptionHandler implements ExceptionHandler {
	@Override
	public Class<?> getExceptionType() {
		return InvalidCoordinatesException.class;
	}

	@Override
	public FunctionResult handle(Throwable e) {
		InvalidCoordinatesException ex = (InvalidCoordinatesException) e;

		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE)
				.setMessage(ex.getMessage())
				.setMessage("The coordinates provided to an interactions operation are invalid")
				.make();
	}
}
