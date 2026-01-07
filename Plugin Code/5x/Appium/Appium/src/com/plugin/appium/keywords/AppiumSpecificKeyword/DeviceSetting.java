package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.io.IOException;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.Utils;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInIOS;
import com.plugin.appium.exceptionhandlers.AdbNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.exceptionhandlers.UnableToProcessADBCommandException;
import com.plugin.appium.util.actions.PhoneSetting;
import com.ssts.pcloudy.exception.ConnectError;

public class DeviceSetting implements KeywordLibrary{
	
	@NotSupportedInIOS
	public FunctionResult Method_Switch_WIFI(boolean status) throws InterruptedException, IOException, ConnectError, ToolNotSetException, UnableToProcessADBCommandException, AdbNotFoundException {
		return new PhoneSetting().switchWIFI(status);
	}
	
	@NotSupportedInIOS
	public FunctionResult Method_SwitchAirplaneMode(boolean status) throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, ToolNotSetException, AdbNotFoundException {
		return new PhoneSetting().switchAirplaneMode(status);
	}
	
	@NotSupportedInIOS
	public FunctionResult Method_SwitchMobileData(boolean status) throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, AdbNotFoundException, ToolNotSetException {
		return new PhoneSetting().switchMobileData(status);
	}
	
	@NotSupportedInIOS
	public FunctionResult Method_SwitchBluetooth(boolean status) throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, AdbNotFoundException, ToolNotSetException {
		return new PhoneSetting().switchBluetooth(status);
	}
	
	@NotSupportedInIOS
	public FunctionResult Method_SwitchGPS(boolean status) throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, AdbNotFoundException, ToolNotSetException {
		return new PhoneSetting().switchGPS(status);
	}
	
	@NotSupportedInIOS
	public FunctionResult Method_SetLocation(double lattitude, double longitude) throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, ToolNotSetException, AdbNotFoundException {
		return new PhoneSetting().setLocation(lattitude, longitude);
	}
	
	@NotSupportedInIOS
	public FunctionResult Method_getRecentMessage() throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, ToolNotSetException, AdbNotFoundException {
		return new PhoneSetting().getRecentMessage();
	}
	
	@NotSupportedInIOS
	public FunctionResult Method_getOTP(String before, String after)
			throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, ToolNotSetException, AdbNotFoundException {
		return new PhoneSetting().getOTP(before, after);
	}
}
