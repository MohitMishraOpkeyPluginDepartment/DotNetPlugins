package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.remote.UnreachableBrowserException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.exceptionhandling.CanHandle;
import com.crestech.opkey.plugin.exceptionhandling.ExceptionHandler2;
import com.crestech.opkey.plugin.exceptionhandling.Handleability;

public class UnreachableBrowserExceptionHandler implements ExceptionHandler2 {

	@Override
	public Handleability canHandle(Throwable e) {
		return CanHandle.givenThat().throwable(e).isSubclassOf(UnreachableBrowserException.class)._and_.messageOf(e).contains("Possible causes are invalid address of ");
	}

	@Override
	public FunctionResult handle(Throwable e) {
		//UnreachableBrowserException ex = (UnreachableBrowserException) e;
		return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE)
				.setMessage("Unreachable Appium Server at given HOST and PORT. Reverify the host and port from Tools > Plugin Settings > Appium  (TAB)").make();
	}
}
