package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.SessionNotCreatedException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.exceptionhandling.CanHandle;
import com.crestech.opkey.plugin.exceptionhandling.ExceptionHandler2;
import com.crestech.opkey.plugin.exceptionhandling.Handleability;
import com.plugin.appium.enums.ReturnMessages;

public class SelendroidServerNeverStartExceptionHandler implements ExceptionHandler2{

	@Override
	public Handleability canHandle(Throwable e) {
		return CanHandle.givenThat().throwable(e).isSubclassOf(SessionNotCreatedException.class)._and_.messageOf(e).contains(
				"A new session could not be created. (Original error: Waited 20 secs for selendroid server and it never showed up)");
	}

	@Override
	public FunctionResult handle(Throwable e) {
		return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setMessage(ReturnMessages.SELE$NDROID_SERVER_BUSY.toString()).make();
	}

	
	
}
