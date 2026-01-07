package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.NoSuchFrameException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;

public class NoSuchFrameExceptionHandler implements ExceptionHandler {
	
	public Class<?> getExceptionType() {
		return NoSuchFrameException.class;
	}

	@Override
	public FunctionResult handle(Throwable e) {
		return Result.FAIL(ResultCodes.ERROR_UNSATISFIED_DEPENDENCIES)
				.setMessage("Frame Not Exist")
				.make();
	}

	
}
