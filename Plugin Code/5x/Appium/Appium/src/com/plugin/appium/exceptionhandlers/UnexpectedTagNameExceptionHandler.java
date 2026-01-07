package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.support.ui.UnexpectedTagNameException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;

public class UnexpectedTagNameExceptionHandler implements ExceptionHandler {


	@Override
	public Class<?> getExceptionType() {
		return UnexpectedTagNameException.class;
	}

	@Override
	public FunctionResult handle(Throwable e) {
		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE)
				.setMessage("Wrong AndroidElement is provided")
				.make();
	}
}
