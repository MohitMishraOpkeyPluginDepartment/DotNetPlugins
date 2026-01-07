package com.plugin.appium.util;

import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.StaleElementReferenceException;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.exceptionhandling.RetryKeywordAgainException;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.Messages;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.TimeOut_ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

public abstract class GenericCheckpoint<T> {

	public int LoopCount = 0;

	public abstract T _innerRun() throws Exception;

	public T run() throws Exception {
		return executeKeyword(Context.current().getKeywordRemaningSeconds());
	}

	public T run(int timeOut) throws Exception {
		timeOut = Math.min(timeOut, Context.current().getKeywordRemaningSeconds());
		return executeKeyword(timeOut);
	}

	private T executeKeyword(int timeOut) throws Exception {
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
				
				T result = _innerRun();

				if (result instanceof FunctionResult) {
					FunctionResult fr = (FunctionResult) result;
					if (fr.getResultCode() == ResultCodes.ERROR_OBJECT_NOT_FOUND.Code() || fr.getResultCode() == ResultCodes.ERROR_OBJECT_NOT_OPERATABLE.Code()) {
						Log.print(Messages.FUNCTIONRESSULT_OBJECT_NOT_FOUND.toString());
						continue;
					}
				}

				return result;

			}catch (ToolNotSetException e) {
				throw e;
			} 
			catch (Exception exception) {

				Log.print("At generic checkpoint.................");
				
				throwIfNeeded(exception);

				exceptions.add(exception);

			} finally {
				// rest a little. Rest and let rest.
				Thread.sleep(100);

				updatePostCheckpointers();
			}
		}
		throw exceptions.stream().reduce((first, second) -> second).orElse(new ObjectNotFoundException(new AppiumObject(false)));
	}

	private  void throwIfNeeded(Exception exception) throws Exception {
		if (exception instanceof StaleElementReferenceException) {
			throw new RetryKeywordAgainException();
		}
		
		if(exception instanceof TimeOut_ObjectNotFoundException) {
			throw new ObjectNotFoundException("Object Not Found");
		}
		
		// Changing message of exception
		if (exception.getMessage() != null && !exception.getMessage().isEmpty() && exception.getMessage().equals(Messages.TIMEOUT_INSIDE_FINDER)) {
			throw new ObjectNotFoundException("Object Not Found");
		}

	}

	private void updatePostCheckpointers() {
		LoopCount++;
	}
	
	

}
