package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.TimeoutException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;

public class TimeoutExceptionHandler implements ExceptionHandler {
	@Override
	public Class<?> getExceptionType() {
		return TimeoutException.class;
	}

	@Override
	public FunctionResult handle(Throwable e) {
		TimeoutException ex = (TimeoutException) e;

		return Result.FAIL(ResultCodes.ERROR_TIMEOUT)
				.setMessage(ex.getMessage())
				.setMessage("Timeout: Timed out receiving message from renderer")
				.make();
	}
}
