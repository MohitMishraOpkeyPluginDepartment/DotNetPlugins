package com.plugin.appium.exceptionhandlers;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;

public class ToolNotSetExceptionHandler implements ExceptionHandler {
	@Override
	public Class<?> getExceptionType() {
		return ToolNotSetException.class;
	}

	@Override
	public FunctionResult handle(Throwable e) {
		return Result.FAIL(ResultCodes.ERROR_INSUFFICIENT_PRIVILEGES)
				.setMessage("Either Application was never Opened  or all Appium  instances were closed")
				.make();
	}
}
