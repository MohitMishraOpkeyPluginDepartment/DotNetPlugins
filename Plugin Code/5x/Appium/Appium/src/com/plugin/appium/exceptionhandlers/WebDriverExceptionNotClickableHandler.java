package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.WebDriverException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;

@Deprecated
public class WebDriverExceptionNotClickableHandler implements ExceptionHandler {
	
		@Override
		public Class<?> getExceptionType() {
			return WebDriverException.class;
		}
		
		@Override
		public FunctionResult handle(Throwable e) {					
			WebDriverException ex = (WebDriverException) e;
			
			if(ex.getMessage().contains("Element is not clickable")){				
				return Result
						.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE)
						.setMessage("Element is not clickable at this point of Time")												
						.make();
			}
			else{
				throw ex;
			}
			
		}
		
}
