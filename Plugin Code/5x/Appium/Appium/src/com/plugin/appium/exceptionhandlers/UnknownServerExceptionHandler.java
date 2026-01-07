package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.remote.ErrorHandler.UnknownServerException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;

public class UnknownServerExceptionHandler  implements ExceptionHandler {
	@Override
	public Class<?> getExceptionType() {
		return UnknownServerException.class;
	}
	
	@Override
	public FunctionResult handle(Throwable e) {
				
		UnknownServerException ex = (UnknownServerException) e;

		return Result.FAIL(ResultCodes.ERROR_INSUFFICIENT_PRIVILEGES)
				.setMessage(ex.getMessage())				
				.make();
	}

}
