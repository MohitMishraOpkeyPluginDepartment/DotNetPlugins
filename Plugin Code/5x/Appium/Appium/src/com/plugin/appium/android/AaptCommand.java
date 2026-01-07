package com.plugin.appium.android;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import com.crestech.opkey.plugin.communication.contracts.functioncall.MobileApplication;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.exceptionhandlers.AdbNotFoundException;

public class AaptCommand {
	
	public static void main(String[] args) throws AdbNotFoundException, IOException, InterruptedException {
		MobileApplication mobileApplication = new AaptCommand().getMobileApplication("C:\\Users\\Ahmad\\Downloads\\OpKeyStudio_v12May\\TED_v4.5.5_apkpure.com.apk");
		System.out.println("Package: " + mobileApplication.getPackage());
		System.out.println("Activity: " + mobileApplication.getMainActivity());
	}
	
	public MobileApplication getMobileApplication(String appPath)
			throws IOException, InterruptedException, AdbNotFoundException {
		
		MobileApplication mobileApplication = new MobileApplication();
		String aaptPath = Utils.getAaptTPath();
		String[] commandLineArgs = { aaptPath, "dump", "badging", appPath};
		
		String Message = "";
		ProcessBuilder pb = new ProcessBuilder(commandLineArgs);
		Message = Message + pb.command()+ "\n";
		Process process = pb.start();
		BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8));
		Log.print(pb.command());
		String line = null;
		while ((line = reader.readLine()) != null) {
			if(line.contains("package: name=")) {
				String appPackage = line.substring(line.indexOf("'")+1, line.indexOf("' "));
				mobileApplication.setPackage(appPackage);
			}else if(line.contains("launchable-activity: name='")) {
				String appActivity = line.substring(line.indexOf("'")+1, line.indexOf("' "));
				mobileApplication.setMainActivity(appActivity);
			}
		}

		process.waitFor();
		process.destroy();

		return mobileApplication;
	}
	
}
