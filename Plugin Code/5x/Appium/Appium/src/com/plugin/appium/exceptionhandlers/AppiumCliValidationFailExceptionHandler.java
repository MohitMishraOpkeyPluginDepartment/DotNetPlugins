package com.plugin.appium.exceptionhandlers;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.exceptionhandling.CanHandle;
import com.crestech.opkey.plugin.exceptionhandling.ExceptionHandler2;
import com.crestech.opkey.plugin.exceptionhandling.Handleability;

public class AppiumCliValidationFailExceptionHandler implements ExceptionHandler2 {

	@Override
	public Handleability canHandle(Throwable e) {
		return CanHandle.givenThat().throwable(e).isSubclassOf(AppiumCliValidationFailException.class);
	}

	@Override
	public FunctionResult handle(Throwable e) {
		return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setMessage(e.getMessage()).make();
	}
}
