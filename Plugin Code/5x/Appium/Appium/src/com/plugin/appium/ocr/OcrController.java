package com.plugin.appium.ocr;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.util.HashMap;
import java.util.Map;
import javax.imageio.ImageIO;
import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.Finder;
import com.plugin.appium.context.AppiumContext;
import com.ssts.pcloudy.Connector;

public class OcrController extends Ocr implements KeywordLibrary {
	
	public FunctionResult Method_OCRGetText() throws Exception {
		Ocr ocr=new Ocr();
		return ocr.Method_OCRGetPageText();
	}
	
	public FunctionResult Method_OCRClickOnText(String Text,int index) throws Exception {
		Ocr ocr=new Ocr();
		return ocr.Method_OCRTap(Text, index);
	}
	
	public FunctionResult Method_OCRGetText(String imagePath, String text) throws Exception {
		
		if (text.isEmpty() || text.isBlank()) {
			System.out.println("The file not exists.");
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
					.setMessage("text cannot be empty. provide valid text").make();
		}
		File fileToBeUploaded = new File(imagePath);
		if (!fileToBeUploaded.exists()) {
			System.out.println("The file not exists.");
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false).setMessage("text not found")
					.make();
		}

		if (AppiumContext.isPCloudy() ) {
			Boolean textStatus;
		Map<String, Object> params = new HashMap<>();
		params.put("word", text);		
		System.out.println(Finder.findAppiumDriver().executeScript("mobile:ocr:textExists", params));
		textStatus = (Boolean) Finder.findAppiumDriver().executeScript("mobile:ocr:textExists", params);
		if (textStatus == false) {
			return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setOutput(false).setMessage("text not found").make();
		}else {
	  String output=(String) Finder.findAppiumDriver().executeScript("mobile:ocr:coordinate", params);
	  return Result.PASS().setOutput(true).setMessage(output).make();
			}
		}
		
		
		return Result.PASS().setOutput(true).setMessage("Text  found").make();

	}

	public FunctionResult Method_OCRImageDifference(String CLOUD_URL,String baseImagePath,String secondImagePath, String outputImagePath) throws Exception {

		File baseFileToBeUploaded = new File(baseImagePath);
		if (!baseFileToBeUploaded.exists()) {
			System.out.println("The file not exists.");
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false).setMessage("please provide valid base image")
					.make();
		}
		File secondImageToBeUploaded = new File(secondImagePath);
		if (!secondImageToBeUploaded.exists()) {
			System.out.println("The file not exists.");
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false).setMessage("please provide valid image")
					.make();
		}

		if (CLOUD_URL == null || CLOUD_URL.isEmpty()) {
			CLOUD_URL = "https://device.pcloudy.com/"; // provide a default value
		}
		
		Connector con = new Connector(CLOUD_URL);
		String authToken = con.authenticateUser("arjun.singh@opkey.com", "dxd5gkrrvrt4r2yq676tszds");
		String baseImageId = con.getImageId(authToken, baseFileToBeUploaded);
		String secondImageId = con.getImageId(authToken, secondImageToBeUploaded);

		Map<String, Object> params = new HashMap<>();
		params.put("baseImageId", baseImageId);
		params.put("secondImageId", secondImageId);
		String base64 = (String) Finder.findAppiumDriver().executeScript("mobile:visual:imageDiff", params);
		File imgFile = new File(outputImagePath); // outputImagePath should have image extention
		BufferedImage img = ImageIO
				.read(new ByteArrayInputStream(org.apache.commons.codec.binary.Base64.decodeBase64(base64)));
		ImageIO.write(img, "png", imgFile);
		return Result.PASS().setOutput(true).setMessage("Difference Image can be found at :: "+outputImagePath).make();
	}
	
	
	public FunctionResult Method_OCR_SendKeys(String wordToSearch, int index, String text) throws Exception {
		Ocr ocr=new Ocr();
		return ocr.Method_OCRSendKeys(wordToSearch, index, text);
	}
	
		
}