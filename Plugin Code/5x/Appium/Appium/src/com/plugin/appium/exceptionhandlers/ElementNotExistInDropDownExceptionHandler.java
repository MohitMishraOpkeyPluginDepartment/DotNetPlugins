package com.plugin.appium.exceptionhandlers;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;



public class ElementNotExistInDropDownExceptionHandler implements ExceptionHandler {
		
		public Class<?> getExceptionType() {
			return ElementNotExistInDropDownException.class;
		}

		@Override
		public FunctionResult handle(Throwable e) {
			ElementNotExistInDropDownException ex = (ElementNotExistInDropDownException) e;

			return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setMessage(ex.getMessage())
					.setMessage(ex.getMessage())
					.make();
		}

}
