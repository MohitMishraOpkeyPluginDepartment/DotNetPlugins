package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.NoSuchWindowException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.exceptionhandling.CanHandle;
import com.crestech.opkey.plugin.exceptionhandling.ExceptionHandler2;
import com.crestech.opkey.plugin.exceptionhandling.Handleability;
import com.plugin.appium.enums.ReturnMessages;

public class NoSuchWindowExceptionHandler implements ExceptionHandler2 {

	@Override
	public Handleability canHandle(Throwable e) {
		return CanHandle.givenThat().throwable(e).isSubclassOf(NoSuchWindowException.class);

	}

	@Override
	public FunctionResult handle(Throwable e) {
		return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setMessage(ReturnMessages.WINDOW_NOT_EXIST.toString()).make();
	}
}
