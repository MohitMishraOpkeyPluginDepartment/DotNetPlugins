package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.io.File;

import javax.imageio.ImageIO;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.Finder;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInNativeApplication;
import com.plugin.appium.exceptionhandlers.KeywordMethodOrArgumentValidationFailException;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.TimeOut_ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

import ru.yandex.qatools.ashot.AShot;
import ru.yandex.qatools.ashot.Screenshot;
import ru.yandex.qatools.ashot.shooting.ShootingStrategies;

public class WebFullPageSnapshot implements KeywordLibrary {
    @NotSupportedInNativeApplication
    public FunctionResult Method_CaptureFullPageSnapshot(Boolean isFullScreenshotRequired, String path)
	    throws ToolNotSetException, ObjectNotFoundException, InterruptedException,
	    KeywordMethodOrArgumentValidationFailException, TimeOut_ObjectNotFoundException {
	if (path.length() == 0 || path.equals("") || path == null) {
	    return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setMessage("invalid path").make();
	}
	WebDriver driver = (WebDriver) Finder.findAppiumDriver();
	JavascriptExecutor js = (JavascriptExecutor) driver;
	Object output = js.executeScript("return window.devicePixelRatio");
	String value = String.valueOf(output);
	float windowDPR = Float.parseFloat(value);

	Boolean flag = false;
	String baseName = "__" + System.currentTimeMillis();
	File Directory = new File(path + File.separator + "Screenshots" + baseName);
	Directory.mkdir();
	File imgfile = new File(Directory + File.separator + "screenshot.png");
	try {
	    if (isFullScreenshotRequired) {

		Screenshot screenshotfull = new AShot()
			.shootingStrategy(ShootingStrategies.viewportRetina(1000, 0, 0, windowDPR))
			.takeScreenshot(driver);
		ImageIO.write(screenshotfull.getImage(), "PNG", imgfile);
		flag = true;
	    } else {
		Screenshot screenshothalf = new AShot().takeScreenshot(driver);
		ImageIO.write(screenshothalf.getImage(), "PNG", imgfile);
		flag = true;
	    }
	} catch (Exception e) {
	    System.out.println("<<## exception " + e.getMessage());
	    flag = false;
	}
	if (flag) {
	    return Result.PASS().setOutput(true).make();
	} else {
	    return Result.FAIL(ResultCodes.ERROR_UNHANDLED_EXCEPTION).setMessage("unable to take screenshot").make();
	}
    }
}
