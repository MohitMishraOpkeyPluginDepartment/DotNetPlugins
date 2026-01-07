package com.plugin.appium.android;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;

import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.exceptionhandlers.AdbNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.exceptionhandlers.UnableToProcessADBCommandException;
import com.ssts.pcloudy.exception.ConnectError;

public class ADBCommand {

	public static String runAdbCommand(String[] command) throws IOException, InterruptedException, ConnectError,
	UnableToProcessADBCommandException, ToolNotSetException {
		if (AppiumContext.isPCloudy()) {
			Log.print("[Running Command On pCloudy]--1"); 
			// String adbCommand = Utils.ArrayToString(convertCommandForpCloudy(command));
			String adbCommand = Utils.ArrayToString(command);
			return runAdbCommandOnPcloudy(adbCommand);
			// return new AppiumSpecificUnCategorised().getAdbCommandOutput(adbCommand);
		} else {
			Log.print("[Running Command On Local]--1");
			return runAdbCommandOnLocal(command);
		}
	}

	public static String runAdbCommandOnLocal(String[] command) throws IOException, InterruptedException {
		Log.print("Command: " + Utils.ArrayToString(command));
		String result = runProcesss(command, true);
		return result;
	}

	public static String runAdbCommandOnPcloudy(String command) throws IOException, InterruptedException {	
		String result = "";
		try {
			Object response = Finder.findAppiumDriver().executeScript("pCloudy_executeAdbCommand", command);
			result = (String) response;
		} catch (Exception e) {
			e.printStackTrace();
			result = "";
		}
		return result;
	}

	public static String runProcesss(String[] commandLineArgs, Boolean waitFor)
			throws IOException, InterruptedException {
		String Message = "";
		ProcessBuilder pb = new ProcessBuilder(commandLineArgs);
		Message = Message + pb.command() + "\n";
		Process process = pb.start();
		BufferedReader reader = new BufferedReader(
				new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8));
		StringBuilder builder = new StringBuilder();
		Log.print(pb.command());
		String line = null;
		while ((line = reader.readLine()) != null) {
			builder.append(line);
			builder.append(System.getProperty("line.separator"));
		}
		String result = builder.toString();

		if (waitFor)
			process.waitFor();
		process.destroy();

		return result;
	}

	public static String[] getBroadCastCommand(String KEY_CODE)
			throws AdbNotFoundException, IOException, ConnectError, InterruptedException, ToolNotSetException {
		String adbpath = com.plugin.appium.Utils.getAdbPath();
		String deviceId = AppiumContext.getAndroidContext().getDeviceId();
		String[] pressKeyCommand = { adbpath, "-s", deviceId, "shell", "am", "broadcast", "-a",
				KEY_CODE.toUpperCase() };
		return pressKeyCommand;
	}

	public static String[] convertCommandForpCloudy(String[] AdbCommand) {
		ArrayList<String> Command = new ArrayList<String>(Arrays.asList(AdbCommand));
		Command.set(0, "adb");
		Command.remove(1);
		Command.remove(1);
		return Command.toArray(new String[Command.size()]);
	}

	public static String[] setLocale(String language_Short_Format)
			throws IOException, ConnectError, InterruptedException, ToolNotSetException, AdbNotFoundException {
		// https://www.fincher.org/Utilities/CountryLanguageList.shtml
		String adbpath = com.plugin.appium.Utils.getAdbPath();
		String[] arr = { adbpath, "shell", "am", "start-foreground-service", "--user", "0", "-n",
				"com.pdevice.services/.Changelocale", "--es", "locale", language_Short_Format };
		// language i.e for hindi -> hi
		// english -> en
		return arr;
	}

	public static String[] getTurnWifiOn()
			throws IOException, ConnectError, InterruptedException, ToolNotSetException, AdbNotFoundException {
		String adbpath = com.plugin.appium.Utils.getAdbPath();
		if (!AppiumContext.isPCloudy()) {
			AndroidVersion version = new AndroidVersion(AppiumContext.getMobileDevice().getVersion());
			String deviceId = AppiumContext.getAndroidContext().getDeviceId();
			if (version.getMajor() >= 8) {
				String[] arr = { adbpath, "-s", deviceId, "shell", "am", "start-foreground-service", "--user", "0",
						"-n", "com.pdevice.services/.wifiservice", "--ei", "op", "0" };
				return arr;
			}

			String[] turnWifiOn = { adbpath, "-s", deviceId, "shell", "am", "startservice", "--user", "0", "-n",
					"com.pdevice.services/.wifiservice", "--ei", "op", "0" };
			return turnWifiOn;
		} else {
			String[] turnWifiOn = { adbpath, "shell", "am", "startservice", "--user", "0", "-n",
					"com.pdevice.services/.wifiservice", "--ei", "op", "0" };
			return turnWifiOn;
		}
	}

	public static String[] getTurnWifiOff()
			throws IOException, ConnectError, InterruptedException, ToolNotSetException, AdbNotFoundException {
		String adbpath = AppiumContext.getAndroidContext().getAdbpath();
		if (!AppiumContext.isPCloudy()) {
			AndroidVersion version = AppiumContext.getAndroidContext().getDeviceVersion();
			String deviceId = AppiumContext.getAndroidContext().getDeviceId();
			if (version.getMajor() >= 8) {
				String[] arr = { adbpath, "-s", deviceId, "shell", "am", "start-foreground-service", "--user", "0",
						"-n", "com.pdevice.services/.wifiservice", "--ei", "op", "1" };
				return arr;
			}
			String[] turnWifiOff = { adbpath, "-s", deviceId, "shell", "am", "startservice", "--user", "0", "-n",
					"com.pdevice.services/.wifiservice", "--ei", "op", "1" };

			return turnWifiOff;
		} else {
			String[] turnWifiOff = { adbpath, "shell", "am", "startservice", "--user", "0", "-n",
					"com.pdevice.services/.wifiservice", "--ei", "op", "1" };
			return turnWifiOff;
		}
	}

	public static String[] getAirplaneMode_ON()
			throws IOException, ConnectError, InterruptedException, ToolNotSetException, AdbNotFoundException {
		String adbpath = AppiumContext.getAndroidContext().getAdbpath();
		if (!AppiumContext.isPCloudy()) {
			String deviceId = AppiumContext.getAndroidContext().getDeviceId();
			String[] airplaneMode_ON = { adbpath, "-s", deviceId, "shell", "settings", "put", "global",
					"airplane_mode_on", "1" };
			return airplaneMode_ON;
		} else {
			String[] airplaneMode_ON = { adbpath, "shell", "settings", "put", "global", "airplane_mode_on", "1" };
			return airplaneMode_ON;
		}

	}

	public static String[] getAirplaneMode_OFF()
			throws IOException, ConnectError, InterruptedException, ToolNotSetException, AdbNotFoundException {
		String adbpath = AppiumContext.getAndroidContext().getAdbpath();
		if (!AppiumContext.isPCloudy()) {
			String deviceId = AppiumContext.getAndroidContext().getDeviceId();
			String[] airplaneMode_OFF = { adbpath, "-s", deviceId, "shell", "settings", "put", "global",
					"airplane_mode_on", "0" };
			return airplaneMode_OFF;
		} else {
			String[] airplaneMode_OFF = { adbpath, "shell", "settings", "put", "global", "airplane_mode_on", "0" };
			return airplaneMode_OFF;
		}
	}

	public static String[] getSendBroadCast()
			throws AdbNotFoundException, IOException, ConnectError, InterruptedException, ToolNotSetException {
		String adbpath = AppiumContext.getAndroidContext().getAdbpath();
		if (!AppiumContext.isPCloudy()) {
			String deviceId = AppiumContext.getAndroidContext().getDeviceId();
			String[] sendBroadCast = { adbpath, "-s", deviceId, "shell", "am", "broadcast", "-a",
			"android.intent.action.AIRPLANE_MODE" };
			return sendBroadCast;
		} else {
			String[] sendBroadCast = { adbpath, "shell", "am", "broadcast", "-a",
			"android.intent.action.AIRPLANE_MODE" };
			return sendBroadCast;
		}

	}

	public static String[] getMobileData_ON()
			throws AdbNotFoundException, IOException, ConnectError, InterruptedException, ToolNotSetException {
		String adbpath = AppiumContext.getAndroidContext().getAdbpath();
		if (!AppiumContext.isPCloudy()) {
			String deviceId = AppiumContext.getAndroidContext().getDeviceId();
			String[] MobileData_ON = { adbpath, "-s", deviceId, "shell", "svc", "data", "enable" };
			return MobileData_ON;
		} else {
			String[] MobileData_ON = { adbpath, "shell", "svc", "data", "enable" };
			return MobileData_ON;
		}
	}

	public static String[] getMobileData_OFF()
			throws AdbNotFoundException, IOException, ConnectError, InterruptedException, ToolNotSetException {
		String adbpath = AppiumContext.getAndroidContext().getAdbpath();
		if (!AppiumContext.isPCloudy()) {
			String deviceId = AppiumContext.getAndroidContext().getDeviceId();
			String[] MobileData_OFF = { adbpath, "-s", deviceId, "shell", "svc", "data", "disable" };
			return MobileData_OFF;
		} else {
			String[] MobileData_OFF = { adbpath, "shell", "svc", "data", "disable" };
			return MobileData_OFF;
		}
	}

	public static String[] getTurnBluetooth_ON()
			throws AdbNotFoundException, IOException, ConnectError, InterruptedException, ToolNotSetException {
		String adbpath = AppiumContext.getAndroidContext().getAdbpath();
		if (!AppiumContext.isPCloudy()) {
			String deviceId = AppiumContext.getAndroidContext().getDeviceId();
			String[] turnBluetoothOn = { adbpath, "-s", deviceId, "shell", "am", "start", "-a",
			"android.bluetooth.adapter.action.REQUEST_ENABLE" };
			return turnBluetoothOn;
		} else {
			String[] turnBluetoothOn = { adbpath, "shell", "am", "start", "-a",
			"android.bluetooth.adapter.action.REQUEST_ENABLE" };
			return turnBluetoothOn;
		}
	}

	public static String[] getTurnBluetooth_OFF()
			throws AdbNotFoundException, IOException, ConnectError, InterruptedException, ToolNotSetException {
		String adbpath = AppiumContext.getAndroidContext().getAdbpath();
		if (!AppiumContext.isPCloudy()) {
			String deviceId = AppiumContext.getAndroidContext().getDeviceId();
			String[] turnBluetoothOff = { adbpath, "-s", deviceId, "shell", "am", "start", "-a",
			"android.bluetooth.adapter.action.REQUEST_DISABLE" };
			return turnBluetoothOff;
		} else {
			String[] turnBluetoothOff = { adbpath, "shell", "am", "start", "-a",
			"android.bluetooth.adapter.action.REQUEST_DISABLE" };
			return turnBluetoothOff;
		}
	}

	public static String[] getGPS_Off()
			throws AdbNotFoundException, IOException, ConnectError, InterruptedException, ToolNotSetException {
		String adbpath = AppiumContext.getAndroidContext().getAdbpath();
		if (!AppiumContext.isPCloudy()) {
			String deviceId = AppiumContext.getAndroidContext().getDeviceId();
			String[] gpsOff = { adbpath, "-s", deviceId, "shell", "settings", "put", "secure",
					"location_providers_allowed", "-gps" };
			return gpsOff;
		} else {
			String[] gpsOff = { adbpath, "settings", "put", "secure", "location_providers_allowed", "-gps" };
			return gpsOff;
		}
	}

	public static String[] getGPSOn()
			throws AdbNotFoundException, IOException, ConnectError, InterruptedException, ToolNotSetException {
		String adbpath = AppiumContext.getAndroidContext().getAdbpath();
		if (!AppiumContext.isPCloudy()) {
			String deviceId = AppiumContext.getAndroidContext().getDeviceId();
			String[] gpsOn = { adbpath, "-s", deviceId, "shell", "settings", "put", "secure",
					"location_providers_allowed", "+gps" };
			return gpsOn;
		} else {
			String[] gpsOn = { adbpath, "shell", "settings", "put", "secure", "location_providers_allowed", "+gps" };
			return gpsOn;
		}
	}

	public static String[] getGPS_Off_Network()
			throws IOException, ConnectError, InterruptedException, ToolNotSetException, AdbNotFoundException {
		String adbpath = AppiumContext.getAndroidContext().getAdbpath();
		if (!AppiumContext.isPCloudy()) {
			String deviceId = AppiumContext.getAndroidContext().getDeviceId();
			String[] gpsOffNetwork = { adbpath, "-s", deviceId, "shell", "settings", "put", "secure",
					"location_providers_allowed", "-network" };
			return gpsOffNetwork;
		} else {
			String[] gpsOffNetwork = { adbpath, "shell", "settings", "put", "secure", "location_providers_allowed",
			"-network" };
			return gpsOffNetwork;
		}
	}

	public static String[] getSetLocation(double lattitude, double longitude)
			throws AdbNotFoundException, IOException, ConnectError, InterruptedException, ToolNotSetException {
		String adbpath = AppiumContext.getAndroidContext().getAdbpath();

		int version = AppiumContext.getAndroidContext().getDeviceVersion().getMajor();

		if (AppiumContext.isPCloudy()) {
			String[] setLocation = { "adb", "shell am startservice -e longitude " + longitude + " -e latitude "
					+ lattitude + " io.appium.settings/.LocationService;" };
			return setLocation;
		} else {
			if (version >= 8) {
				String[] setLocation = { adbpath, "shell", "am", "start-foreground-service", "--user", "0", "-n",
						"com.pdevice.services/.rockr", "--ei", "op", "0", "--es", "lat", "" + lattitude, "--es", "lon",
						"" + longitude };
				return setLocation;
			} else {
				String[] setLocation = { adbpath, "shell", "am", "startservice", "--user", "0", "-n",
						"com.pdevice.services/.rockr", "--ei", "op", "0", "--es", "lat", "" + lattitude, "--es", "lon",
						"" + longitude };
				return setLocation;
			}
		}
	}

	public static String[] getMockLocatoin_Allow()
			throws IOException, ConnectError, InterruptedException, ToolNotSetException, AdbNotFoundException {
		String adbpath = AppiumContext.getAndroidContext().getAdbpath();
		String deviceId = "";
		if (!AppiumContext.isPCloudy()) {
			deviceId = AppiumContext.getAndroidContext().getDeviceId();
		}
		if (AppiumContext.isPCloudy()) {
			String[] mockLocation = { "adb", "shell appops set io.appium.settings android:mock_location allow" };
			return mockLocation;
		} else {
			String[] mockLocation = { adbpath, "-s", deviceId, "shell", "appops", "set", "com.pdevice.services",
					"android:mock_location", "allow" };
			return mockLocation;
		}
	}

	public static String[] getRecentMessage()
			throws AdbNotFoundException, IOException, ConnectError, InterruptedException, ToolNotSetException {
		String adbpath = AppiumContext.getAndroidContext().getAdbpath();
		if (!AppiumContext.isPCloudy()) {
			String deviceId = AppiumContext.getAndroidContext().getDeviceId();
			String[] getRecentMessage = { adbpath, "-s", deviceId, "shell", "cat", "/sdcard/swapbox/otp.txt" };
			return getRecentMessage;
		} else {
			String[] getRecentMessage = { adbpath, "shell", "cat", "/sdcard/swapbox/otp.txt" };
			return getRecentMessage;
		}
	}

	public static String[] MakeSwapBoxDirectory()
			throws AdbNotFoundException, IOException, ConnectError, InterruptedException, ToolNotSetException {
		String adbpath = AppiumContext.getAndroidContext().getAdbpath();
		if (!AppiumContext.isPCloudy()) {
			String deviceId = AppiumContext.getAndroidContext().getDeviceId();
			String[] makeOtpTxt = { adbpath, "-s", deviceId, "shell", "mkdir", "-m", "777", "/sdcard/swapbox" };
			return makeOtpTxt;
		} else {
			String[] makeOtpTxt = { adbpath, "shell", "mkdir", "-m", "777", "/sdcard/swapbox" };
			return makeOtpTxt;
		}
	}

	public static void main(String[] args)
			throws AdbNotFoundException, IOException, ConnectError, InterruptedException, ToolNotSetException {
		System.out.println(Arrays.toString(getRecentMessage()));
	}
}