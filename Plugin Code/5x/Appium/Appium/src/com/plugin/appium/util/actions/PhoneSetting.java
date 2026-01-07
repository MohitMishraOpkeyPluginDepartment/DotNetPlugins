package com.plugin.appium.util.actions;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.android.ADBCommand;
import com.plugin.appium.android.ADBExecutor;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.exceptionhandlers.AdbNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.exceptionhandlers.UnableToProcessADBCommandException;
import com.ssts.pcloudy.exception.ConnectError;

public class PhoneSetting implements KeywordLibrary {

	public FunctionResult switchWIFI(boolean status) throws InterruptedException, IOException, ConnectError,
			ToolNotSetException, UnableToProcessADBCommandException, AdbNotFoundException {

		if (AppiumContext.getDeviceType() == DeviceType.Android) {
			return this.android_SwitchWIFI(status);
		} else if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice) {
			return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false)
					.setMessage("Not Iplemented for iOS yet.").make();
		}

		return null;
	}

	private FunctionResult android_SwitchWIFI(boolean status) throws InterruptedException, IOException, ConnectError,
			ToolNotSetException, UnableToProcessADBCommandException, AdbNotFoundException {
		String response = "";
		if (status) {
			Log.print("Turning Wifif On.");
			response = ADBExecutor.TurnWifi_ON();
		} else {
			Log.print("Turning Wifif Off.");
			response = ADBExecutor.TurnWifi_OFF();
		}
		Log.print("Response: " + response);
		return Result.PASS().setOutput(true).setMessage(response).make();
	}

	public FunctionResult switchAirplaneMode(boolean status) throws IOException, InterruptedException, ConnectError,
			UnableToProcessADBCommandException, ToolNotSetException, AdbNotFoundException {
		String response = "";
		if (status) {
			Log.print("Turning AirplaneMode On.");
			response = ADBExecutor.SwitchAirplaneMode_ON();
		} else {
			Log.print("Turning AirplaneMode Off.");
			response = ADBExecutor.SwitchAirplaneMode_OFF();
		}
		Log.print("Response: " + response);
		return Result.PASS().setOutput(true).setMessage(response).make();
	}

	public FunctionResult switchMobileData(boolean status) throws IOException, InterruptedException, ConnectError,
			UnableToProcessADBCommandException, AdbNotFoundException, ToolNotSetException {
		String response = "";
		if (status) {
			Log.print("Turning MobileData On.");
			response = ADBExecutor.TurnMobileData_ON();
		} else {
			Log.print("Turning MobileData Off.");
			response = ADBExecutor.TurnMobileData_OFF();
		}
		Log.print("Response: " + response);
		return Result.PASS().setOutput(true).setMessage(response).make();
	}

	public FunctionResult switchBluetooth(boolean status) throws IOException, InterruptedException, ConnectError,
			UnableToProcessADBCommandException, AdbNotFoundException, ToolNotSetException {
		String response = "";
		if (status) {
			Log.print("Turning Bluetooth On.");
			response = ADBExecutor.TurnBlutooth_ON();
		} else {
			Log.print("Turning Bluetooth Off.");
			response = ADBExecutor.TurnBlutooth_OFF();
		}
		Log.print("Response: " + response);
		return Result.PASS().setOutput(true).setMessage(response).make();
	}

	public FunctionResult switchGPS(boolean status) throws IOException, InterruptedException, ConnectError,
			UnableToProcessADBCommandException, AdbNotFoundException, ToolNotSetException {
		String response = "";
		if (status) {
			Log.print("Turning GPS On");
			response = ADBExecutor.SwitchGPS_ON();
		} else {
			Log.print("Turning GPS Off");
			response = ADBExecutor.SwitchGPS_OFF();
		}
		Log.print("Response: " + response);
		return Result.PASS().setOutput(true).setMessage(response).make();
	}

	public FunctionResult setLocation(double lattitude, double longitude) throws IOException, InterruptedException,
			ConnectError, UnableToProcessADBCommandException, ToolNotSetException, AdbNotFoundException {
		String response = ADBExecutor.SetLocation(lattitude, longitude);
		return Result.PASS().setOutput(true).setMessage(response).make();
	}

	public FunctionResult getRecentMessage() throws IOException, InterruptedException, ConnectError,
			UnableToProcessADBCommandException, ToolNotSetException, AdbNotFoundException {
		int time = Context.current().getCallTimeoutInMillis() - 6000;
		int timeOutInSecs = time;
		long timeOutmiliSecs = (timeOutInSecs);
		Date startTime = Calendar.getInstance().getTime();
		long diffInMiliSeconds = (Calendar.getInstance().getTime().getTime() - startTime.getTime());

		String message = "";
		index: while (true) {
			message = ADBExecutor.GetRecentMessage();
			System.out.println("@message: " + message);
			if (message != null && !message.isEmpty() && !message.contains("No such file or directory")) {
				break;
			}
			diffInMiliSeconds = (Calendar.getInstance().getTime().getTime() - startTime.getTime());

			if (diffInMiliSeconds >= (timeOutmiliSecs)) {
				break index;
			}
			Thread.sleep(200);
		}
		
		System.out.println("\n\n==========RECENT SMS is : " + message);
		if (AppiumContext.isPCloudy()) {
		System.out.println("\n\n==========Deleting Directory==========  ");
		try {
			Finder.findAppiumDriver().executeScript("pCloudy_executeAdbCommand", "adb shell rm sdcard/swapbox/otp.txt");
		} catch (Exception e) {
		System.out.println("Exception while executing adb command "+e.getMessage());
		}
	
	} else {
		String adbpath = AppiumContext.getAndroidContext().getAdbpath();
		String[] RM_OTP_COMMAND = { adbpath, "shell", "rm", "sdcard/swapbox/otp.txt" };
		ADBCommand.runAdbCommandOnLocal(RM_OTP_COMMAND);

	}
		return Result.PASS().setOutput(message).make();
	}

	public FunctionResult getOTP(String before, String after) throws IOException, InterruptedException, ConnectError,
			UnableToProcessADBCommandException, ToolNotSetException, AdbNotFoundException {
		String message = getRecentMessage().getOutput();
		if (message == null || message.isEmpty() || message.contains("No such file or directory")) {
		    return Result.FAIL(ResultCodes.ERROR_FILE_NOT_FOUND).setOutput("").setMessage("File Not Found").make();
		}
		try {
		    String output=Utils.getOtpNumber(message,before,after);
		String ret_message1="Otp Not Found";
		String ret_message2="Please provide before and after text little longer";
		if(!output.equals(ret_message1) &&  !output.equals(ret_message2))
			return Result.PASS().setOutput(output).make();
		    else {
			if (output.equals(ret_message1))
			    return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput("")
				    .setMessage(ret_message1).make();

			if (output.equals(ret_message2))
			    return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput("")
				    .setMessage(ret_message2).make();

			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput("")
				.setMessage("Otp Not Found").make();
		}
		} catch (Exception e) {
			// e.printStackTrace();
			return Result.PASS().setOutput("").setMessage("No Text / SMS found by provided input.").make();
		}
	}

}
