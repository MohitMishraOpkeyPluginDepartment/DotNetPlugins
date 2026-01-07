package com.crestech.opkey.exceptions;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;

public class CompositeTableExceptionHandler implements ExceptionHandler {

	@Override
	public Class<?> getExceptionType() {
		return CompositeTableException.class;
	}

	@Override
	public FunctionResult handle(Throwable e) {
		CompositeTableException ex = (CompositeTableException) e;
		return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setMessage(ex.getMessage()).make();
	}

}
