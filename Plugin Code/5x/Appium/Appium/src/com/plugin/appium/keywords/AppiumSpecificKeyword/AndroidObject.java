package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.openqa.selenium.Dimension;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebElement;


import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInHybridApplication;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.TimeOut_ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.GenericKeyword.Deprecate;

public class AndroidObject implements KeywordLibrary {

	/* 
	 * 
	 * 
	 * 
	 * 
	 * */
	

	public FunctionResult Method_GetObjectCordinates(AppiumObject object) throws ToolNotSetException, ObjectNotFoundException, InterruptedException, TimeOut_ObjectNotFoundException {

		WebElement we = Finder.findWebElement(object);
		int x = we.getLocation().getX();
		int y = we.getLocation().getY();
		return Result.PASS().setOutput(x + ";" + y).make();
	}

	/* 
	 * 
	 * 
	 * 
	 * 
	 * */
	@NotSupportedInHybridApplication
	@SuppressWarnings("deprecation")
	public FunctionResult Method_getObjectImage(AppiumObject object) throws ToolNotSetException, ObjectNotFoundException, InterruptedException, IOException, TimeOut_ObjectNotFoundException
	{
		
		if(AppiumContext.getDeviceType() == DeviceType.Selendroid){
			return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false).setMessage(ReturnMessages.ONLY_NATIVE_APPLICATION_SUPPORTED.toString()).make();
		}
		
		File CaptureScreenshot = File.createTempFile("Original Snapshot ", ".png");
		File CropScreenshot = File.createTempFile("Cropped Object ", ".png");
		WebElement we = Finder.findWebElement(object);
		Point loc = we.getLocation();
		Dimension size = we.getSize();

		new Deprecate().Method_CaptureSnapshot(CaptureScreenshot.getAbsolutePath());

		// Get tempropary file path
		BufferedImage image = ImageIO.read(new File(CaptureScreenshot.getAbsolutePath()));
		System.out.println("Image cordinates " + loc.x + loc.y + size.width + size.height);

		BufferedImage dest = image.getSubimage(loc.x, loc.y, size.width, size.height);

		ImageIO.write(dest, "png", new File(CropScreenshot.getAbsolutePath()));
		return Result.PASS().setOutput(CropScreenshot.getAbsolutePath()).make();

	}

}
