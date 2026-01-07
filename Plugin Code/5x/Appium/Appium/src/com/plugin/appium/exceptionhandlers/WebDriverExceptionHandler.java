package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.WebDriverException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;
import com.plugin.appium.context.AppiumContext;

@Deprecated() //throw in else block. use ThrowableHandler
public class WebDriverExceptionHandler implements ExceptionHandler {

	/* In appium plugin when appium fail on particular step then webdriver exception is generated 
		but appium written on own log why step fail 
	*/
	@Override
	public Class<?> getExceptionType() {
		return WebDriverException.class;
	}

	@Override
	public FunctionResult handle(Throwable e) {
		
		WebDriverException ex = (WebDriverException) e;
		String msg = "An exception is generated please see the appium log";
		ResultCodes resultCode = ResultCodes.ERROR_UNHANDLED_EXCEPTION;
		
		if(ex.getMessage().contains("An unknown server-side error occurred while processing the command")){
			
			System.out.println("############ Message for unhandle exception #######");
			ex.printStackTrace();
			
			System.out.println("AppiumContext.getErrorFromAppiumServer()"+ AppiumContext.getErrorFromAppiumServer());
			
		
			if(AppiumContext.getErrorFromAppiumServer()!=null){
				
				
				
				// when object is not clickable show an set the msg of appium server 
				msg = AppiumContext.getErrorFromAppiumServer();
				resultCode = ResultCodes.ERROR_OBJECT_NOT_OPERATABLE;
			}
			
			return Result.FAIL(resultCode)
					.setMessage(msg)												
					.make();
		}
		else{
			throw ex;
		}
	}

	
}
