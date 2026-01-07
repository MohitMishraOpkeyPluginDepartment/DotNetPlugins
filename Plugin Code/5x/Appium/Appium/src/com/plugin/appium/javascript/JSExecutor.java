package com.plugin.appium.javascript;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.logging.OpkeyLogger;
import com.plugin.appium.Finder;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

public class JSExecutor {
	
	static public Class _class = JSExecutor.class;

	private JavascriptExecutor javascriptExecutor;

	public JSExecutor() {
		try {
			javascriptExecutor = (JavascriptExecutor) Finder.findAppiumDriver();
		} catch (ToolNotSetException e) {
			OpkeyLogger.printLog(_class, "@Exception:JSExecutor>>" + e.getMessage());
		}
	}

	public JavascriptExecutor getJavascriptExecutor() {
		return javascriptExecutor;
	}

	public void setJavascriptExecutor() {
		try {
			javascriptExecutor = (JavascriptExecutor) Finder.findAppiumDriver();
		} catch (ToolNotSetException e) {
			OpkeyLogger.printLog(_class, "@Exception:setJavascriptExecutor>>" + e.getMessage());
		}
	}

	public Object executeScript(String scriptString) throws ToolNotSetException {
		return executeScript(scriptString, null);
	}

	public Object executeScript(String scriptString, WebElement element) throws ToolNotSetException {
		return executeScriptHelper(scriptString, element);

	}

	private Object executeScriptHelper(String scriptString, WebElement element) throws ToolNotSetException {
		// Log.print(scriptString);
		Object object = null;
		if (element == null) {
			object = javascriptExecutor.executeScript(scriptString);
		} else {
			object = javascriptExecutor.executeScript(scriptString, element);
		}

		return object;
	}


	public void injectJS(String jsString) throws ToolNotSetException {
		executeScript(jsString);
	}
}
