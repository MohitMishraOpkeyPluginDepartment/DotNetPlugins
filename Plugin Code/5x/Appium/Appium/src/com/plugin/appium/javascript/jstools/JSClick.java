package com.plugin.appium.javascript.jstools;

import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.logging.OpkeyLogger;
import com.plugin.appium.Utils;
import com.plugin.appium.javascript.JSExecutor;

public class JSClick {
	
	static public Class _class = JSClick.class;

	public void performJavaScriptClick(WebElement _element) {
		OpkeyLogger.printLog(_class, ">>Performing Click Action by JavaScript Click");
		String scriptContent = Utils.getJavaScriptScriptContent(JSClick.class,"jsclick.js");
		JSExecutor js = new JSExecutor();
		try {
			js.executeScript(scriptContent +" performOpKeyClick(arguments[0])",_element);
		} catch (Exception e) {
			System.out.println("Exception while performJavaScriptClick: " + e.getMessage());
			//e.printStackTrace();
		}
	}
	
	public void performJavaScriptClick_hidden(WebElement _element) {
		String scriptContent = Utils.getJavaScriptScriptContent(JSClick.class,"jsclick.js");
		JSExecutor js = new JSExecutor();
		try {
			js.executeScript(scriptContent +" performOpKeyClick(arguments[0])",_element);
		} catch (Exception e) {
			System.out.println("Exception while performJavaScriptClick_hidden: " + e.getMessage());
			//e.printStackTrace();
		}
	}
}
