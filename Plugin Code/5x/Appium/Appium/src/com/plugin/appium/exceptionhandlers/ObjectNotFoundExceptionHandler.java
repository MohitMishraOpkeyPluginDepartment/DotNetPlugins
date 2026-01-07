package com.plugin.appium.exceptionhandlers;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;

public class ObjectNotFoundExceptionHandler implements ExceptionHandler {

	@Override
	public Class<?> getExceptionType() {
		return ObjectNotFoundException.class;
	}

	@Override
	public FunctionResult handle(Throwable e) {
		ObjectNotFoundException ex = (ObjectNotFoundException) e;

		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND)
				.setMessage(ex.getMessage())
				.make();
	}

}
