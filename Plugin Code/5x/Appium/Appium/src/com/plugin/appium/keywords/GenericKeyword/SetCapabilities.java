package com.plugin.appium.keywords.GenericKeyword;

import java.io.File;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.openqa.selenium.chrome.ChromeOptions;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.Log;

public class SetCapabilities implements KeywordLibrary {
//-----------
	static HashMap<String, String> userCapabilities  = new HashMap<String, String>();
	static HashMap<String, Boolean> booleanUserCapabilities = new HashMap<String, Boolean>();
	static HashMap<String, Integer> integerUserCapabilities = new HashMap<String, Integer>();
	static HashMap<String, Object> objectUserCapabilities = new HashMap<String, Object>();
	static Map<String, Object> chromePrefs = new HashMap<String, Object>();
	static HashMap<String, String> firefoxProfile = new HashMap<String, String>();
	static String chromeOptions = "";
	static Set<String> chromeExtensions = new HashSet<String>();
	static Set<String> firefoxExtensions = new HashSet<String>();
	public static boolean isSetCapabilitiesUsed = false;
	public static String pageLoadStartegy = null;

	public static HashMap<String, String> getUserDefinedBrowserCapabilities() {
		return userCapabilities;
	}

	public static ChromeOptions getChromeOptions() {
		ChromeOptions option = new ChromeOptions();
		Log.print("chromeOptions : "  + chromeOptions);
		option.addArguments(chromeOptions);
		return option;
	}

	public static Set<String> getChromeExtensions() {
		return chromeExtensions;
	}
	
	public static ChromeOptions getChromeExtensionsOption() {
		return createOptionOfExtensionChrome();
	}
	

	private static ChromeOptions createOptionOfExtensionChrome() {
		ChromeOptions options = new ChromeOptions();
		if (SetCapabilities.getChromeExtensions().size() != 0) {
			Set<String> set = SetCapabilities.getChromeExtensions();
			for (Object object : set) {
				try {
					//logger.info("Setting Extension " + object.toString());
					File file = new File(object.toString());
					options.addExtensions(file);
				} catch (Exception ex) {
					//logger.warning("Not a valid Chrome Extension <" + object.toString() + ">");
				}
			}
		} else {
			options.addArguments("disable-extensions");
		}
		return options;
	}

	public static Set<String> getFirefoxExtensions() {
		return firefoxExtensions;
	}

	public static HashMap<String, Boolean> getUserDefinedBooleanBrowserCapabilities() {
		return booleanUserCapabilities;
	}

	public static HashMap<String, Integer> getUserDefinedIntegerBrowserCapabilities() {
		return integerUserCapabilities;
	}

	public static HashMap<String, Object> getUserDefinedObjectBrowserCapabilities() {
		return objectUserCapabilities;
	}

	public FunctionResult Method_setCapabilities(String capability1, String value1) throws Exception {

		if (!capability1.trim().isEmpty()) {
			userCapabilities.put(capability1, value1);
		}

		return Result.PASS().setMessage("Recieved the String Capabilities").make();
	}

	public FunctionResult Method_setBooleanCapabilities(String capability1, Boolean value1) throws Exception {

		if (!capability1.trim().isEmpty()) {
			booleanUserCapabilities.put(capability1, value1);
		}

		return Result.PASS().setMessage("Recieved the Boolean Capabilities").make();
	}

	public FunctionResult Method_setIntegerCapabilities(String capability1, Integer value1) throws Exception {

		if (!capability1.trim().isEmpty()) {
			integerUserCapabilities.put(capability1, value1);
		}

		return Result.PASS().setMessage("Recieved the Integer Capabilities").make();
	}

	public FunctionResult Method_setObjectCapabilities(String capability1, Object value1) throws Exception {

		if (!capability1.trim().isEmpty()) {
			objectUserCapabilities.put(capability1, value1);
		}

		return Result.PASS().setMessage("Recieved the Integer Capabilities").make();
	}

	public FunctionResult Method_setArrayCapabilities(String delimiter1, String capability1, String value1, String delimiter2, String capability2, String value2, String delimiter3, String capability3,
			String value3) throws Exception {

		if (!capability1.trim().isEmpty()) {
			userCapabilities.put(capability1, value1);
		}
		if (!capability2.trim().isEmpty()) {
			userCapabilities.put(capability2, value2);
		}
		if (!capability3.trim().isEmpty()) {
			userCapabilities.put(capability3, value3);
		}

		return Result.PASS().setMessage("Recieved the setting").make();
	}

	// ---Chrome Preferences---
	public static Map<String, Object> getUserDefinedChromePreferences() {
		return chromePrefs;
	}

	public FunctionResult Method_setChromePreferences(String preference1, Object value1) {

		if (!preference1.trim().isEmpty()) {
			chromePrefs.put(preference1, value1);
		}

		return Result.PASS().setMessage("Recieved the setting").make();
	}

	// Firefox Profile
	public static HashMap<String, String> getUserDefinedFirefoxPreference() {
		return firefoxProfile;
	}

	public FunctionResult Method_setFirefoxProfile(String key1, String value1) throws Exception {

		if (!key1.trim().isEmpty()) {
			firefoxProfile.put(key1, value1);
		}

		return Result.PASS().setMessage("Recieved the String Capabilities").make();
	}

	public FunctionResult Method_SetBrowserCapability(String key, String value, String Otype, String browser) throws Exception {

		isSetCapabilitiesUsed = true;
		String type = Otype.toLowerCase();
		boolean isChrome = false;
		boolean isFirefox = false;
		boolean isInteger = false;
		boolean isString = false;
		boolean isBoolean = false;
		if (!browser.isEmpty() || browser != null) {
			if (browser.toLowerCase().equals("chrome"))
				isChrome = true;
			else if (browser.toLowerCase().contains("firefox"))
				isFirefox = true;
		}
		if (type.startsWith("int")) {
			isInteger = true;
		} else if (type.equals("string")) {
			isString = true;
		} else if (type.equals("boolean")) {
			isBoolean = true;
		} else {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setMessage("Capability Not Set. Not a Valid Type of Value Received.").make();
		}

		if (isChrome) {
			if (key.toLowerCase().contains("option")) {
				
				// https://stackoverflow.com/questions/46568714/open-chrome-in-incognito-mode-on-real-android-device-using-appium
				
				if (!value.isEmpty()) {
					chromeOptions = value;
					Log.print("chrome option set to : " + chromeOptions);
					return Result.PASS().setOutput(true).setMessage("Capability Set").make();
				}
			}
			if (key.toLowerCase().contains("extension")) {
				
				// Chrome does not support apps and extensions currently on Chrome for Android
				// https://developer.chrome.com/multidevice/faq
				Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setOutput(false).setMessage("Chrome does not support apps and extensions currently on Chrome for Android.").make();
				
				if (!value.isEmpty()) {
					chromeExtensions.add(value);
					return Result.PASS().setOutput(true).setMessage("Capability Set").make();
				}
			}
			if (isString) {
				Method_setChromePreferences(key, value);
			}
			if (isBoolean) {
				Method_setChromePreferences(key, Boolean.parseBoolean(value));
			}
		} else if (isFirefox) {
			if (key.equalsIgnoreCase("pageloadstartegy")) {
				pageLoadStartegy = value;
			} else if (key.toLowerCase().contains("extension")) {
				if (!value.isEmpty()) {
					firefoxExtensions.add(value);
					return Result.PASS().setOutput(true).setMessage("Capability Set").make();
				}
			} else if (isString) {
				Method_setFirefoxProfile(key, value);
			}
		} else {
			if (key.equalsIgnoreCase("pageloadstartegy")) {
				pageLoadStartegy = value;
			} else if (isString) {
				Method_setCapabilities(key, value);
			}
		}
		if (isInteger) {
			try {
				Method_setIntegerCapabilities(key, getIntValue(value));
			} catch (NumberFormatException NFE) {
				Method_setObjectCapabilities(key, value);
			}
		} else if (isBoolean) {
			if (key.toLowerCase().contains("location") && key.toLowerCase().contains("popup")) {
				Method_setFirefoxProfile(key, value);
			} else {
				Method_setBooleanCapabilities(key, getBooleanValue(value));
			}
		}
		return Result.PASS().setOutput(true).setMessage("Capability Set").make();

	}

	private Integer getIntValue(String value) {
		return Integer.parseInt(value);
	}

	private boolean getBooleanValue(String value) {
		return Boolean.parseBoolean(value);
	}
}