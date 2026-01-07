package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.InvalidSelectorException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;



	public class InvalidSelectorExceptionHandler implements ExceptionHandler {
		
		public Class<?> getExceptionType() {
			return InvalidSelectorException.class;
		}

		@Override
		public FunctionResult handle(Throwable e) {
			InvalidSelectorException ex = (InvalidSelectorException) e;

			return Result.FAIL(ResultCodes.ERROR_INSUFFICIENT_PRIVILEGES)
					.setMessage(ex.getMessage())
					.make();
		}
	}

		
	

	
	

