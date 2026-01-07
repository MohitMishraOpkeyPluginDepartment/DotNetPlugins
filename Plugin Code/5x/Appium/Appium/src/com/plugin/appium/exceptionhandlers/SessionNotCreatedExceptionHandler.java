package com.plugin.appium.exceptionhandlers;

import org.openqa.selenium.SessionNotCreatedException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.exceptionhandling.CanHandle;
import com.crestech.opkey.plugin.exceptionhandling.ExceptionHandler2;
import com.crestech.opkey.plugin.exceptionhandling.Handleability;
import com.plugin.appium.enums.ReturnMessages;

public class SessionNotCreatedExceptionHandler implements ExceptionHandler2 {

	@Override
	public FunctionResult handle(Throwable e) {
			
		if(e.getMessage().contains("A new session could not be created. (Original error: Bad app:"))
		{
			// When App not not found on given path
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setMessage(ReturnMessages.WRONG_APP_PATH.toString()).make();
			
		}
		
		if(e.getMessage().contains("A new session could not be created. (Original error: 'java -version' failed. Error")){
			// When JRE bin path not set 
			return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setMessage(ReturnMessages.JRE_PATH_NOT_SET.toString()).make();
		}
		return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setMessage(ReturnMessages.DEVICE_NOT_CONNECTED.toString()).make();
	}

	@Override
	public Handleability canHandle(Throwable e) {
		
		return CanHandle.givenThat()
				
				// Android Exception Messages
				
				.throwable(e).isSubclassOf(SessionNotCreatedException.class)._and_.messageOf(e).contains("A new session could not be created. (Original error: spawn OK)")
				._or_
				.throwable(e).isSubclassOf(SessionNotCreatedException.class)._and_.messageOf(e).contains("was not in the list of connected devices)")
				._or_
				.throwable(e).isSubclassOf(SessionNotCreatedException.class)._and_.messageOf(e).contains("A new session could not be created. (Original error: Could not find a connected Android device.)")
				._or_
				.throwable(e).isSubclassOf(SessionNotCreatedException.class)._and_.messageOf(e).contains("A new session could not be created. (Original error: 'java -version' failed. Error")
	
				// iOS Exception Messages
				._or_
				.throwable(e).isSubclassOf(SessionNotCreatedException.class)._and_.messageOf(e).contains("A new session could not be created. (Original error: Bad app:")
				._or_
				.throwable(e).isSubclassOf(SessionNotCreatedException.class)._and_.messageOf(e).contains("A new session could not be created. (Original error: Log capture did not start in a reasonable amount of time)")
				._or_
				.throwable(e).isSubclassOf(SessionNotCreatedException.class)._and_.messageOf(e).contains("A new session could not be created. (Original error: Could not find a device to launch.")
				
				;
	}
}
