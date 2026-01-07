package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.UnsupportedCommandException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.exceptionhandling.CanHandle;
import com.crestech.opkey.plugin.exceptionhandling.ExceptionHandler2;
import com.crestech.opkey.plugin.exceptionhandling.Handleability;
import com.plugin.appium.enums.ReturnMessages;

public class UnsupportedCommandExceptionHandler implements ExceptionHandler2 {

	@Override
	public Handleability canHandle(Throwable e) {
		return CanHandle.givenThat().throwable(e).isSubclassOf(UnsupportedCommandException.class)._and_.messageOf(e).contains(
				"The requested resource could not be found, or a request was received using an HTTP method that is not supported by the mapped resource.");
	}

	@Override
	public FunctionResult handle(Throwable e) {
		return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setMessage(ReturnMessages.PROPERTY_NOT_FOUND.toString()).make();
	}

}
