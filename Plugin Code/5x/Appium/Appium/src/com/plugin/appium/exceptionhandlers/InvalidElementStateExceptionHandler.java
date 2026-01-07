package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.InvalidElementStateException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;

public class InvalidElementStateExceptionHandler implements ExceptionHandler {
	@Override
	public Class<?> getExceptionType() {
		return InvalidElementStateException.class;
	}

	@Override
	public FunctionResult handle(Throwable e) {
		InvalidElementStateException ex = (InvalidElementStateException) e;

		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE)
				.setMessage(ex.getMessage())
				.setMessage("Element is not currently interactable and may not be manipulated")
				.make();
	}
}
