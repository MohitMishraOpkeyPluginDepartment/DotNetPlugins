package com.plugin.appium.opencv;

import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.util.UUID;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.Finder;
import com.plugin.appium.android.ADBCommand;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import io.appium.java_client.TouchAction;
import io.appium.java_client.touch.WaitOptions;
import io.appium.java_client.touch.offset.PointOption;

public class OpenCVUtils {
	public static void loadLibraries_For_Opencv() {
		try {
			System.out.println("loading required library ");
			File lib = null;
			String osName = System.getProperty("os.name");
			String opencvpath = Context.session().getDefaultPluginLocation();  // System.getProperty("user.dir");
			System.out.println(opencvpath);
			if (osName.startsWith("Windows")) {
				int bitness = Integer.parseInt(System.getProperty("sun.arch.data.model"));
				if (bitness == 32) {
					System.out.println("## Java is of 32 bits ## ");
					opencvpath = opencvpath + System.getProperty("file.separator") + "opencv"
							+ System.getProperty("file.separator") + "x86" + System.getProperty("file.separator");
					lib = new File(opencvpath + System.mapLibraryName("opencv_java2411"));
				} else if (bitness == 64) {
					System.out.println("## Java is of 64 bits ## ");
					opencvpath = opencvpath + System.getProperty("file.separator") + "opencv"
							+ System.getProperty("file.separator") + "x64" + System.getProperty("file.separator");
					lib = new File(opencvpath + System.mapLibraryName("opencv_java2411"));
				}
			} else if (osName.equals("Mac OS X")) {
				opencvpath = opencvpath + "Your path to .dylib";
			}
			System.load(lib.getAbsolutePath());
			System.out.println("library loaded successfully ");
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Failed to load opencv native library of OPencv2411", e);
		}
	}
	
	public static File getScreenshotFile() throws Exception {
		File ImageFile = new File(System.getProperty("user.dir"),UUID.randomUUID().toString().replace("-", "") + "Image.png");
		File file = null;
		try {
			file = takeScreenshotUsingAppium();
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Error While Capturing Image With Appium!");
			System.out.println("Capturing Through ADB ....");
			if (!AppiumContext.isPCloudy() && AppiumContext.isAndroid()) {
				file = com.plugin.appium.Utils.takeSnapShotViaADB(ImageFile);
			}

		}

		if (file != null && file.length() > 0) {
			long fileSizeInBytes = file.length();
			double fileSizeInKB = fileSizeInBytes / 1024.0;
			// double fileSizeInMB = fileSizeInKB / 1024.0;
			System.out.println("File Size : " + fileSizeInKB);
			if (fileSizeInKB > 1024) {
				Result.FAIL(ResultCodes.ERROR_DATA_TOO_LONG).setOutput(false)
						.setMessage("Capture File Size Is Grater Than 1MB").make();
			}

			try {
				FileUtils.copyFile(file, ImageFile);
			} catch (IOException e) {
				e.printStackTrace();
				FileUtils.copyFile(file, ImageFile);
				// if still we get blank text then this file is blank
			}
		}
		return ImageFile;
	}
	
	public static void tapOnCoordinates(int x, int y) throws Exception {

		if (AppiumContext.isPCloudy() == true && AppiumContext.isAndroid() == true) {
			System.out.println(" ##<< Running command on pcloudy ");
			String command = "adb shell input tap " + String.valueOf(x) + " " + String.valueOf(y);
			// ADBCommand.runAdbCommandOnPcloudy(command); // for pcloudy execution
			try {
				Finder.findAppiumDriver().executeScript("pCloudy_executeAdbCommand", command);
			} catch (Exception e) {
				System.out.println("##<< Exception while executing adb command on pcloudy " + e.getMessage());
			}

		} else if (AppiumContext.isPCloudy() == true && AppiumContext.isIOS() == true) {
			touchActionTap(x, y);
		} else {
			if (AppiumContext.isAndroid() == true) {
				System.out.println("##<< Tapping in android local on x and y " + x + " " + y);
				String adbpath = AppiumContext.getAndroidContext().getAdbpath();
				String[] tap = { adbpath, "shell", "input", "tap", String.valueOf(x) + " " + String.valueOf(y) };
				ADBCommand.runAdbCommandOnLocal(tap);
				System.out.println("##<< Adb command executed on local  ");
			}

		}

	}
	
	public static void touchActionTap(int x, int y) throws ToolNotSetException {
		System.out.println("##<< Tapping in ios on x and y " + x + " " + y);
		TouchAction<?> action = new TouchAction<>(Finder.findAppiumDriver());
		action.tap(PointOption.point(x, y));
		action.waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)));
		action.release();
		action.perform();
	}
	
	private static File takeScreenshotUsingAppium() throws Exception {
		return Finder.findAppiumDriver().getScreenshotAs(OutputType.FILE);

	}
}
