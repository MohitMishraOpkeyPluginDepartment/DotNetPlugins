package com.plugin.appium.context;

import java.io.IOException;

import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.SystemCommandExecutor;
import com.plugin.appium.android.AndroidVersion;
import com.plugin.appium.exceptionhandlers.AdbNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.ssts.pcloudy.exception.ConnectError;
import com.ssts.pcloudy.Connector;

public class AndroidContext {
	private String deviceId;
	private String adbpath;
	private AndroidVersion deviceVersion;
	
	public String getDeviceId() throws IOException, ConnectError, InterruptedException, ToolNotSetException {
		if(this.deviceId == null) {
			this.deviceId = this.getAndroidDeviceId();
		}
		
		return this.deviceId;
	}
	
	public String getAdbpath() throws AdbNotFoundException {
		if(AppiumContext.isPCloudy()) {
			this.adbpath="adb";
		}
		if(this.adbpath == null) {
			this.adbpath = com.plugin.appium.Utils.getAdbPath();
		}
		
		return this.adbpath;
	}
	
	public AndroidVersion getDeviceVersion() {
		if(this.deviceVersion == null) {
			this.deviceVersion = new AndroidVersion(AppiumContext.getMobileDevice().getVersion());
		}
		
		return this.deviceVersion;
	}
	
	private String getAndroidDeviceId() throws IOException, ConnectError, InterruptedException, ToolNotSetException {
		if (AppiumContext.isPCloudy()) {
			PCloudyContext pCloudyContext = AppiumContext.getPCloudyContext();
			String apiEndpoint = pCloudyContext.getEndpoint();
			String authToken = pCloudyContext.getAuthToken();
			int rId = pCloudyContext.getRID();
			
			Connector conn = new Connector(apiEndpoint);
			String output = conn.executeAdbCommand(authToken, rId, "adb devices");
			return output;
		}else {
			// Local
			String output = SystemCommandExecutor.runCommand("adb devices");
			return output.split("\n")[1].split("	")[0];
		}
	}
}
