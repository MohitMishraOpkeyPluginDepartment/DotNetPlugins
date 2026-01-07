package com.plugin.appium.keywords.GenericKeyword;

import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.javascript.ClientSideScripts;

public class Waits implements KeywordLibrary {
	
	static public Class<Waits> _class = Waits.class;
	public static enum WaitMechanism {
		PAGELOAD, ANGULAR, JQUERY, XHR
	}

	public FunctionResult Method_useWaitForPageLoad() {
		long start = System.currentTimeMillis();
		try {
			if (Utils.getRemainingTimeForLoading() > 0)
				Utils.waitForPageLoad(Finder.findAppiumDriver());
		} catch (Exception e) {
			//new ExceptionManager().pushException(e);
		}
		Log.print(_class.getName() + "########## PAGE LOADING ENDS IN : " + (System.currentTimeMillis() - start) + "ms");
		return Result.PASS().setOutput(true).make();
	}

	public FunctionResult Method_useWaitForAngularLoad() {
		/*Log.print("Angular Started");
		long start = System.currentTimeMillis();
		try {
			if (Utils.getRemainingTimeForLoading() > 0)
				Utils.waitForAngularPageLoad();
		} catch (Exception e) {
			new ExceptionManager().pushException(e);
		}
		Log.print("########## ANGULAR WAIT ENDS IN : " + (System.currentTimeMillis() - start) + "ms");*/
		return Result.PASS().setOutput(true).make();
	}

	public FunctionResult Method_useWaitForJQueryLoad() {
		long start = System.currentTimeMillis();
		/*try {
			if (Utils.getRemainingTimeForLoading() > 0)
				ClientSideScripts.waitForReadyStateJQueryAndXhrToLoad(Finder.findWebDriver(), WaitMechanism.JQUERY);
		} catch (Exception e) {
			Log.print(e.getMessage());
		}*/
		Log.print(_class.getName() +  ">>JQuery wait has been depricated use XHRWait");
		Log.print(_class.getName() + "########## JQUERY WAIT ENDS IN : " + (System.currentTimeMillis() - start) + "ms");
		return Result.PASS().setOutput(true).make();
	}

	public FunctionResult Method_useWaitForXMLHttpRequestLoad() {
		long start = System.currentTimeMillis();
		try {
			if (Utils.getRemainingTimeForLoading() > 0)
				ClientSideScripts.waitForReadyStateJQueryAndXhrToLoad(Finder.findAppiumDriver(), WaitMechanism.XHR);
		} catch (Exception e) {
			// new ExceptionManager().pushException(e);
		}
		Log.print(_class.getName() + "########## XHR WAIT ENDS IN : " + (System.currentTimeMillis() - start) + "ms");
		return Result.PASS().setOutput(true).make();
	}
	
	public FunctionResult Method_WaitForObjectEnable (AppiumObject object) throws Exception {
		WebElement element=null;
		boolean status=false;
		
		Log.print(Context.current().getKeywordRemaningSeconds());
		while(Context.current().getKeywordRemaningSeconds()>5) {
			try {
				element = Finder.findWebElementUsingCheckPoint(object);
			} catch (Exception e) {
				Log.print("Exception"+e.getMessage());
				element=null;
			}
			 
			 if(element!=null) {
				 
				 status=element.isEnabled();
				 if(status) {
					 break;
				 }
				 
			 }
			 
		}
		if(status) {
			return Result.PASS().setOutput(true).make();
		}else {
			return Result.FAIL(ResultCodes.ERROR_USER_ASSERTED_FAILURE).setMessage("Not Enable").setOutput(false).make();
		}
		
	}
}
