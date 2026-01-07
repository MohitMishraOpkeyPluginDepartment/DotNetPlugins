package com.plugin.appium.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriverException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.crestech.opkey.plugin.exceptionhandling.RetryKeywordAgainException;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.Messages;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.TimeOut_ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

public abstract class Checkpoint {
	
	public  int LoopCount =0;
	
	public abstract FunctionResult _innerRun() throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception;

	public FunctionResult run() throws Exception {
		Log.print("################################################INSIDE CHECKPOINT#####################################");
		System.out.println("################################################INSIDE CHECKPOINT#####################################");
		return executeKeyword(Context.current().getKeywordRemaningSeconds());
	}

	public FunctionResult run(int timeOut) throws Exception {
		timeOut = Math.min(timeOut, Context.current().getKeywordRemaningSeconds());
		return executeKeyword(timeOut);
	}

	private FunctionResult executeKeyword(int timeOut) throws Exception {
		
		Log.print("Effective TimeOut For Keyword " + timeOut);
		List<Exception> exceptions = new ArrayList<Exception>();
		int remainingSeconds = Utils.getRemainingTimeForKeyword(timeOut);
		while (Context.current().getKeywordRemaningSeconds() > remainingSeconds) {
			try {

				if(AppiumContext.isBrowserMode()) {
					long start = System.currentTimeMillis();
					if (LoopCount >= 1) {
						Log.print("Enabling PageLoad/Angular/Jquery Wait By Default ");
						new Utils().waitForPageLoadAndOtherAjax();
					} else {
						Log.print("Considering User Preference For Loading By Default ");
						new Utils().waitForPageLoadAndOtherAjaxIfTrue();
					}
					
					System.out.println("Total Time Wait is: " + (System.currentTimeMillis() - start));
				}

				FunctionResult fr = _innerRun();

				if (fr.getResultCode() == ResultCodes.ERROR_OBJECT_NOT_FOUND.Code() || fr.getResultCode() == ResultCodes.ERROR_OBJECT_NOT_OPERATABLE.Code()) {
					Log.print("got result as error object not found");
					continue;
				}
				return fr;
			}catch (ToolNotSetException e) {
				throw e;
			} 
			catch (Exception exception) {
				Log.debug(exception.getStackTrace());
				
				throwIfNeeded(exception);
				//AddExceptionInList(exception);
				exceptions.add(exception);
				
				
			}finally {
				// rest a little. Rest and let rest.
				Thread.sleep(100);

				updatePostCheckpointers();
			}
		}
		
		throw exceptions.stream().reduce((first, second) -> second).orElse(new ObjectNotFoundException(new AppiumObject(false)));
	}
	
	private void throwIfNeeded(Exception exception) throws Exception {
		if (exception instanceof StaleElementReferenceException) {
			throw new RetryKeywordAgainException();
		}
		
		if(exception instanceof TimeOut_ObjectNotFoundException) {
			throw new ObjectNotFoundException("Object Not Found");
		}
		
		if (exception.getMessage() != null && !exception.getMessage().isEmpty() && exception.getMessage().equals(Messages.TIMEOUT_INSIDE_FINDER)) {
			// changing message of exception
			 throw new ObjectNotFoundException("Object Not Found");
		}
		
		
	}

	private void updatePostCheckpointers() {
		LoopCount++;
	}
	
}
