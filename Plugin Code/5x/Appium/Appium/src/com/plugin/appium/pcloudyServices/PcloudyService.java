package com.plugin.appium.pcloudyServices;

import java.io.File;
import java.io.IOException;
import com.plugin.appium.android.ADBCommand;
import com.plugin.appium.exceptionhandlers.AdbNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.exceptionhandlers.UnableToProcessADBCommandException;
import com.ssts.pcloudy.exception.ConnectError;

public class PcloudyService {

	public static void installService(String deviceId, String apppath)
			throws IOException, InterruptedException, ConnectError, UnableToProcessADBCommandException, ToolNotSetException {
		String adbpath = null;
		try {
			adbpath = com.plugin.appium.Utils.getAdbPath();
		} catch (AdbNotFoundException e) {

			e.printStackTrace();
		}
		if (adbpath != null) {
			String[] installcommand = { adbpath, "-s", deviceId, "install", apppath };
			ADBCommand.runAdbCommand(installcommand);
		} else {
			return;
		}

	}

	public static void installAndLaunchService(String deviceId, File apk, String ServicePackageName)
			throws IOException, InterruptedException, ConnectError, AdbNotFoundException, UnableToProcessADBCommandException, ToolNotSetException {
		String adbpath = com.plugin.appium.Utils.getAdbPath();
		System.out.println("Inside Launch android service");

		String[] installationServiceCommand = new String[] { adbpath, "-s", deviceId, "install",
				apk.getAbsolutePath() };

		ADBCommand.runAdbCommand(installationServiceCommand);
		System.out.println("Opkey Service Installed ");

		String[] launchServiceActivityCommand = { adbpath, "-s", deviceId, "shell", "monkey", "-p",
				ServicePackageName, "-c", "android.intent.category.LAUNCHER", "1" };

		ADBCommand.runAdbCommand(launchServiceActivityCommand);

		

	}
	public static void installAndLaunchService(File apk, String ServicePackageName)
			throws IOException, InterruptedException, ConnectError, AdbNotFoundException, UnableToProcessADBCommandException, ToolNotSetException {
		String adbpath = com.plugin.appium.Utils.getAdbPath();
		System.out.println("Inside Launch android service");

		String[] installationServiceCommand = new String[] { adbpath,"install",
				apk.getAbsolutePath() };

		ADBCommand.runAdbCommand(installationServiceCommand);
		System.out.println("Opkey Service Installed ");

		String[] launchServiceActivityCommand = { adbpath,"shell", "monkey", "-p",
				ServicePackageName, "-c", "android.intent.category.LAUNCHER", "1" };

		ADBCommand.runAdbCommand(launchServiceActivityCommand);

		

	}

}
