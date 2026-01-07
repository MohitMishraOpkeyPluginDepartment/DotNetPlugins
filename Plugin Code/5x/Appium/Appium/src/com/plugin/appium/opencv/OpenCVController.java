package com.plugin.appium.opencv;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;

public class OpenCVController implements KeywordLibrary{
	
	public FunctionResult Method_OpenCVFindAndTapOnImage(String templateImgPath) throws Exception { 
		Path path = Paths.get(templateImgPath); // no need to new file(path)		
		if (!Files.exists(path) && !Files.isDirectory(path)) {
			System.out.println("##<< template  file not exists at given path " + templateImgPath);
				Result.FAIL(ResultCodes.ERROR_FILE_NOT_FOUND).setOutput(false).setMessage("Unable to locate template image file .Please provide valid path ")
						.make();		
		}
		
		if(Files.size(path)==0) {
			System.out.println("##<< template  file  exists but size is 0");
			Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE).setOutput(false).setMessage(" Image file  size is 0 .Please provide valid file ")
					.make();	
		}
	
		File screenShot = OpenCVUtils.getScreenshotFile();
		if ( screenShot.length() == 0) {
			Result.FAIL(ResultCodes.ERROR_FILE_NOT_FOUND).setOutput(false)
			.setMessage("Unable to Capture File ").make();
		} 
		String screenShotPath = screenShot.getAbsolutePath();
		String templateImagePath = templateImgPath;
		String rectangleImagePath = System.getProperty("user.dir")+UUID.randomUUID().toString().replace("-", "") + "Rectangle.png";
		String keypointsImagePath = System.getProperty("user.dir")+UUID.randomUUID().toString().replace("-", "") + "Keypoints.png";
		
		System.out.println("<<## ScreenShot Path : "+screenShotPath);
		System.out.println("<<## Template Image Path : "+templateImagePath);
		System.out.println("<<## Rectangle Image Path : "+rectangleImagePath);
		System.out.println("<<## Keypoints Image Path : "+keypointsImagePath);
 
		System.out.println("Starting ImageMatching using SurfDetection ");
		OpenCVSurfDetection imageSearchBySurf = new OpenCVSurfDetection();
		try {
			Map<String, String> result = imageSearchBySurf.MatchImage(templateImagePath, screenShotPath,rectangleImagePath,keypointsImagePath);
			System.out.println("<<##Return Boolean Is : "+result.get("status"));
			if (result.get("status").equals("true")) {
				int x = Integer.valueOf(result.get("x"));
				int y = Integer.valueOf(result.get("y"));
				System.out.println("Tapping x "+ x +" and y "+ y +" coordinates!");
				OpenCVUtils.tapOnCoordinates(x,y);
				return Result.PASS().setOutput(true).setMessage("[IMAGE API] Image Matched using surf detection ? " + result.get("status")).make();
			}else {
				System.out.println("<<## Boolean Come False");
				return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setMessage("Status is false").setOutput(false).make();
			}	
			
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("## unnable to take screenshot");
			return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setMessage("unnable to take screenshot").setOutput(false).make();
		}
	} 
}
