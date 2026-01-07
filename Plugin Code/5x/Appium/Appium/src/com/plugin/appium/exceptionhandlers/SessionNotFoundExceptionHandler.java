/*package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.remote.SessionNotFoundException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;

public class SessionNotFoundExceptionHandler implements ExceptionHandler {

	@Override
	public Class<?> getExceptionType() {
		return SessionNotFoundException.class;
	}

	@Override
	public FunctionResult handle(Throwable e) {

		SessionNotFoundException ex = (SessionNotFoundException) e;

		return Result.FAIL(ResultCodes.ERROR_INSUFFICIENT_PRIVILEGES)
				.setMessage(ex.getMessage())
				.setMessage("Application was not successfully launched").make();
	}
}
*/