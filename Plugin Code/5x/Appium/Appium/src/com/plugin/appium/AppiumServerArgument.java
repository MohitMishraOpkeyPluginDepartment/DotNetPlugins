package com.plugin.appium;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.logging.Logger;

import javax.swing.text.html.HTMLDocument.HTMLReader.PreAction;

import com.crestech.opkey.plugin.contexts.Context;

public class AppiumServerArgument {

	String appiumServerPath = Context.session().getSettings().get("AppiumServer");
	Logger logger = Logger.getLogger(AppiumServerArgument.class.getName());

	public String getAppiumNodeExePath() {

		// Not getting the appium.cmd path because if the file is changed in
		// future so we get the path where the appium.exe is exist

		// remove the appium.exe from path
		logger.finest(" AppiumExePath:  " + appiumServerPath);

		File nodejs = new File(new File(Context.session().getDefaultPluginLocation()).getParentFile().getAbsolutePath() + "\\libs\\NodeJS\\node.exe");
		Log.print("Node JS Path :: " + nodejs.getAbsolutePath());
		return nodejs.getAbsolutePath();
	}

	public String getAppiumJSPath() throws IOException, InterruptedException {
		String appiumPath = Context.session().getSettings().get("AppiumServer");
		System.out.println("Appium Path: " + appiumPath);
		File file = new File(appiumPath);
		if (file.getName().equalsIgnoreCase("appium")) {
			appiumPath += "\\build\\lib\\main.js";
			return appiumPath;
		}else if (file.getName().equalsIgnoreCase("node_modules")) {
			File parent = file.getParentFile();
			System.out.println(parent.getPath());
			appiumPath = parent.getPath() + "\\build\\lib\\main.js";
			return appiumPath;
		}else {
			System.out.println("Appium Path Not Set Looking MySelf");
			return findAppiumJSPath();
		}
		
	}
	
	public static void main(String[] args) {
		String appiumPath = "C:\\Users\\Ahmad\\AppData\\Roaming\\npm\\node_modules\\appium";
		File file = new File(appiumPath);
		if (file.getName().equalsIgnoreCase("appium")) {
			appiumPath += "\\build\\lib\\main.js";
			System.out.println(appiumPath);
		}else if (file.getName().equalsIgnoreCase("node_modules")) {
			File parent = file.getParentFile();
			System.out.println(parent.getPath());
			appiumPath = parent.getPath() + "\\build\\lib\\main.js";
			System.out.println(appiumPath);
		}
	}

	public String getAppiumLogFilePath() {
		return Utils.RemoveLastDirectoryFromPath(Context.session().getScreenshotsDirectory()).concat("\\Appium\\AppiumServerLog.txt");
	}
	

	public String getNodePath() throws IOException, InterruptedException {

		String jsPaths = null;
		String nodePath = null;

		Process p;
		BufferedReader reader;
		String operatingSystem = System.getProperty("os.name");
		
		if (operatingSystem.contains("Win")) {
			String whereAppium = "where" + " " + "node";
			p = Runtime.getRuntime().exec(whereAppium);
			reader = new BufferedReader(new InputStreamReader(p.getInputStream()));

			while ((jsPaths = reader.readLine()) != null) {
				nodePath = jsPaths;
				break;
			}

			p.waitFor();
			p.destroy();

			if (nodePath == null) {
				System.exit(0);
			}

		} else {
			String command = "which " + "node";
			p = Runtime.getRuntime().exec(command);
			p.waitFor();

			reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
			String line = "";
			
			while ((line = reader.readLine()) != null) {
				nodePath = line;
				break;
			}
			
			p.destroy();

			if (nodePath == null) {
				System.exit(0);
			}
		}

		System.out.println("nodePath: " + nodePath);
		return nodePath;

	}
	
	public String findAppiumJSPath() throws IOException, InterruptedException {
		String jsPaths = null;
		String actualJSPath = null;
		String operatingSystem = System.getProperty("os.name");

		if (operatingSystem.contains("Win")) {
			String whereAppium = "where" + " " + "appium";
			Process p = Runtime.getRuntime().exec(whereAppium);
			BufferedReader stdInput = new BufferedReader(new InputStreamReader(p.getInputStream()));

			while ((jsPaths = stdInput.readLine()) != null) {
				actualJSPath = jsPaths.replace("appium", "node_modules\\appium\\build\\lib\\main.js");
				break;
			}

			p.waitFor();
			p.destroy();

			if (actualJSPath == null) {
				System.exit(0);
			}

		} else {
			actualJSPath = "//usr//local//lib//node_modules//appium//build//lib//main.js";
		}

		System.out.println("actualJSPath: " + actualJSPath);
		return actualJSPath;

	}
}
