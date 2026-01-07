package com.plugin.appium.android;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import com.plugin.appium.Finder;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.exceptionhandlers.AdbNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.exceptionhandlers.UnableToProcessADBCommandException;
import com.ssts.pcloudy.exception.ConnectError;

public class ADBExecutor {

	public static String SwitchAirplaneMode_ON() throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, ToolNotSetException, AdbNotFoundException {
		return ADBCommand.runAdbCommand(ADBCommand.getAirplaneMode_ON())
				+ ADBCommand.runAdbCommand(ADBCommand.getSendBroadCast());
	}

	public static String SwitchAirplaneMode_OFF() throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, ToolNotSetException, AdbNotFoundException {
		return ADBCommand.runAdbCommand(ADBCommand.getAirplaneMode_OFF())
				+ ADBCommand.runAdbCommand(ADBCommand.getSendBroadCast());
	}

	public static String TurnMobileData_ON() throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, AdbNotFoundException, ToolNotSetException {
		return ADBCommand.runAdbCommand(ADBCommand.getMobileData_ON());
	}

	public static String TurnMobileData_OFF() throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, AdbNotFoundException, ToolNotSetException {
		return ADBCommand.runAdbCommand(ADBCommand.getMobileData_OFF());
	}

	
	public static String TurnWifi_ON() throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, ToolNotSetException, AdbNotFoundException {
		return ADBCommand.runAdbCommand(ADBCommand.getTurnWifiOn());
	}

	public static String TurnWifi_OFF() throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, ToolNotSetException, AdbNotFoundException {
		return ADBCommand.runAdbCommand(ADBCommand.getTurnWifiOff());
	}

	public static String TurnBlutooth_ON() throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, AdbNotFoundException, ToolNotSetException {
		return ADBCommand.runAdbCommand(ADBCommand.getTurnBluetooth_ON());
	}

	public static String TurnBlutooth_OFF() throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, AdbNotFoundException, ToolNotSetException {
		return ADBCommand.runAdbCommand(ADBCommand.getTurnBluetooth_OFF());
	}

	public static String SwitchGPS_OFF() throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, AdbNotFoundException, ToolNotSetException {
		return ADBCommand.runAdbCommand(ADBCommand.getGPS_Off()) + ADBCommand.runAdbCommand(ADBCommand.getGPS_Off_Network());
	}

	public static String SwitchGPS_ON() throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, AdbNotFoundException, ToolNotSetException {
		return ADBCommand.runAdbCommand(ADBCommand.getGPSOn());
	}
	
	public static String SetLocation(double lattitude, double longitude) throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, ToolNotSetException, AdbNotFoundException {
		return ADBCommand.runAdbCommand(ADBCommand.getMockLocatoin_Allow()) 
				+ ADBCommand.runAdbCommand(ADBCommand.getSetLocation(lattitude, longitude));
	}
	
	public static String GetRecentMessage() throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, ToolNotSetException, AdbNotFoundException {
	//	return ADBCommand.runAdbCommand(ADBCommand.getRecentMessage()) ;
	    if (AppiumContext.isPCloudy()) {
		Map<String, Object> params = new HashMap<>();
		Object response	=Finder.findAppiumDriver().executeScript("mobile:get:otp",params);
		String output="";
		try {
			output=(String)response;
		} catch (Exception e) {
			e.printStackTrace();
			output="";
		}
		System.out.println("returned value "+output);
		return (String)output;
		}
	    else {
		return ADBCommand.runAdbCommandOnLocal(ADBCommand.getRecentMessage());
	    }
	  
	}
	
	public static String SetLocale(String language) throws IOException, InterruptedException, ConnectError,
			UnableToProcessADBCommandException, ToolNotSetException, AdbNotFoundException {
		return ADBCommand.runAdbCommand(ADBCommand.setLocale(language));

	}
	public static String MakeSwapBoxDirectory() throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, ToolNotSetException, AdbNotFoundException {
		return ADBCommand.runAdbCommand(ADBCommand.MakeSwapBoxDirectory()) ;
	}
}
