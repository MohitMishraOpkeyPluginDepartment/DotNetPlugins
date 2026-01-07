package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;
import org.openqa.selenium.WebElement;
import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.AppiumObjectProperty;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.ReadAndroidScreenCastLog;
import com.plugin.appium.SystemCommandExecutor;
import com.plugin.appium.Utils;
import com.plugin.appium.android.ADBExecutor;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.AdbNotFoundException;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.TimeOut_ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.exceptionhandlers.UnableToProcessADBCommandException;
import com.ssts.pcloudy.exception.ConnectError;

import io.appium.java_client.Setting;
import io.appium.java_client.android.AndroidDriver;

public class AppiumSpecificUnCategorised implements KeywordLibrary {

	public static boolean takeSnapShot = true;
	Logger logger = Logger.getLogger(Connect2AppiumServer.class.getName());

	public FunctionResult Method_openScreenCast() throws IOException, InterruptedException, AdbNotFoundException {

		startAndroidScreencast();
		while (!(AppiumContext.islaunchScreencast())) {
			logger.fine(" launch Appium server::" + AppiumContext.isAppiumServerLaunch() + " launch screenCast::"
					+ AppiumContext.islaunchScreencast());
			logger.fine("Appium Server is not  successfully launch waiting main thread for  1 second  ");
			Thread.sleep(1000);
		}

		if (AppiumContext.islaunchScreencast()) {
			return Result.PASS().setOutput(true).make();
		}
		return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false)
				.setMessage(ReturnMessages.SCREENCAST_NOT_OPEN.toString()).make();
	}

	private void startAndroidScreencast() throws IOException, InterruptedException, AdbNotFoundException {

		logger.fine(" Try to start a android Screen cast");

		// start a adb server
		Utils.startAdbServer();
		String getRequiredJars = Utils.RemoveLastDirectoryFromPath(Context.session().getScreenshotsDirectory())
				.concat("\\Appium\\AndroidScreenCast\\");
		String androidScreencastJar = getRequiredJars.concat("androidscreencast.jar");
		String ddmlibJar = getRequiredJars.concat("ddmlib.jar");

		String command = "java -cp " + "\"" + androidScreencastJar + ";" + ddmlibJar + "\" "
				+ " net.srcz.android.screencast.Main";

		logger.fine("Command For Screencast " + command);

		Runnable readlog = new ReadAndroidScreenCastLog(command);
		Thread readlogThread = new Thread(readlog);
		readlogThread.setName("LogReadFromAndroidScreenCast");
		readlogThread.start();
	}

	public FunctionResult Method_tapOnCoordinate(AppiumObject object, String TouchCoordinates,
			String deviceScreenDimension) throws ToolNotSetException, IOException, InterruptedException,
			AdbNotFoundException, ObjectNotFoundException, TimeOut_ObjectNotFoundException {

		if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice
				|| AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator) {
			takeSnapShot = false;
			List<AppiumObjectProperty> xpaths = object.getXPaths();
			for (AppiumObjectProperty appiumObjectProperty : xpaths) {
				if (appiumObjectProperty.getValue().toLowerCase().contains("herobanner")) {
					Utils.touchActionTap(200, 150);
					return Result.PASS().setOutput(true).make();
				}
			}

			Utils.touchActionTap(Connect2AppiumServer.dim.getWidth() / 2, Connect2AppiumServer.dim.getHeight() / 2);
			return Result.PASS().setOutput(true).make();
		}
		WebElement we = Finder.findWebElement(object);
		String[] expectedPostion = TouchCoordinates.split(Utils.getDelimiter());
		String[] expectedScreenDimension = deviceScreenDimension.split(Utils.getDelimiter());

		int givenXCoordinate = Integer.valueOf(Integer.parseInt(expectedPostion[0]));
		int givenYCoordinate = Integer.valueOf(Integer.parseInt(expectedPostion[1]));

		Double givenScreenHeight = Double.valueOf(Integer.parseInt(expectedScreenDimension[0]));
		Double givenScreenWidth = Double.valueOf(Integer.parseInt(expectedScreenDimension[1]));

		if (AppiumContext.getDeviceType() == DeviceType.Selendroid) {
			return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
					.setMessage(ReturnMessages.ONLY_NATIVE_APPLICATION_SUPPORTED.toString()).make();
		}

		int currentDeviceHeight = (Double.valueOf(Utils.getDeviceDisplayDimesion().height).intValue());
		int currentDeviceWidth = (Double.valueOf(Utils.getDeviceDisplayDimesion().width).intValue());

		logger.fine("Current Screen Width " + currentDeviceWidth + " Given Screen width " + givenScreenWidth);
		logger.fine("Current Screen Height " + currentDeviceHeight + " Given Screen height " + givenScreenHeight);

		// Identify that device is need to
		if (currentDeviceHeight != givenScreenHeight || currentDeviceWidth != givenScreenWidth) {
			// Need to update the coordinates according device height and width

			logger.fine("Fetched Coordinate " + givenXCoordinate + ";" + givenYCoordinate);

			double xCoordinateInPer = (givenXCoordinate / givenScreenWidth);
			double yCoordinateInPer = (givenYCoordinate / givenScreenHeight);

			logger.fine("Scalling X Coordinate " + xCoordinateInPer + " Scalling Y Coordinate " + yCoordinateInPer);

			givenXCoordinate = (int) (currentDeviceWidth * xCoordinateInPer);
			givenYCoordinate = (int) (currentDeviceHeight * yCoordinateInPer);

			logger.fine("Updated Coordinate " + givenXCoordinate + ";" + givenYCoordinate);
		}

		logger.info("Object location " + we.getLocation());

		logger.info("Updated Coordinaes" + givenXCoordinate + we.getLocation().x + ";" + givenYCoordinate
				+ we.getLocation().y + "Text: " + we.getText());

		Utils.tap(givenXCoordinate + we.getLocation().x, givenYCoordinate + we.getLocation().y);

		return Result.PASS().setOutput(true).make();
	}
	
	public FunctionResult Method_RunAdbCommand(String adbCommand) {
	    if (adbCommand.isEmpty() || adbCommand == null || adbCommand.trim().isEmpty()) {
		return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Pls Provide Valid Command ")
			.make();
	    }
		System.out.println("Executing ADB Command: " + adbCommand);
		
		String output =getAdbCommandOutput(adbCommand);
		if(output.contains("Invalid Command")) {
			return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setOutput(false).setMessage("Invalid Command").make();
		}
		if(output.contains("exception")) {
		    return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setOutput(false).setMessage(output).make();
		}else {
		    return Result.PASS().setOutput(true).make();
		}
	}
	
	public FunctionResult Method_setLocale(String language) {
		// only supported in pcloudy
	    if (language.isEmpty() || language == null || language.trim().isEmpty()) {
		return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Pls Provide Valid language ")
			.make();
	    }
		System.out.println("User provided language : " + language);
		String output="";
		try {
			output=	ADBExecutor.SetLocale(language);
		} catch (IOException | InterruptedException | ConnectError | UnableToProcessADBCommandException
				| ToolNotSetException | AdbNotFoundException e) {
			e.printStackTrace();
		}
		
		if(output.contains("Invalid Language")) {
			return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setOutput(false).setMessage("Invalid language").make();
		}
		if(output.contains("exception")) {
		    return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setOutput(false).setMessage(output).make();
		}else {
		    return Result.PASS().setOutput(true).make();
		}
	}
	
	// Appium_ResetApplication
	public FunctionResult Method_ResetApplication() throws ToolNotSetException {
		Finder.findAppiumDriver().resetApp();
		return Result.PASS().setOutput(true).make();
	}
	
	// Keyword: Appium_SetVisibilityCheck
	public FunctionResult Method_SetVisibilityCheck(boolean status) throws ToolNotSetException {
		AndroidDriver<WebElement> androidDriver = (AndroidDriver<WebElement>) Finder.findAppiumDriver();
		androidDriver.setSetting(Setting.ALLOW_INVISIBLE_ELEMENTS, status);
		Context.session().getSettings().put("CheckFoundedElementVisibility", status+"");
		return Result.PASS().setOutput(true).make();
	}
	public  String getAdbCommandOutput(String adbCommand) {
		String output ="";
		try {
			if (AppiumContext.isPCloudy()) {
				Log.print("Running command on pcloudy");
			Object response=	Finder.findAppiumDriver().executeScript("pCloudy_executeAdbCommand", adbCommand);
			    try {
			    	output=(String)response;
			    	Log.print("command output :: "+output);
				} catch (Exception e) {
					e.printStackTrace();
					output="";
				}        			
			    return output;
			} else {
				try {
					output = SystemCommandExecutor.runCommand(adbCommand);
					if(output.contains("is not recognized as an internal or external command")) {
						return "Invalid Command";
					}
					return output;

				} catch (Exception e) {
					return "Invalid Command";
				}
							}
		} catch (Exception ex) {
			System.out.println("** Error Caused ADB Command **");
			ex.printStackTrace();
			return "exception :: "+ex.getMessage();
		}
	}
	
}
