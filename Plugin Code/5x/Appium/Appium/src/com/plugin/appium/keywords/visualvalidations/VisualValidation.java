package com.plugin.appium.keywords.visualvalidations;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.apache.commons.io.FileUtils;
import org.json.JSONObject;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriverException;

import com.assertthat.selenium_shutterbug.core.PageSnapshot;
import com.assertthat.selenium_shutterbug.core.Shutterbug;
import com.assertthat.selenium_shutterbug.utils.web.ScrollStrategy;
import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.logging.OpkeyLogger;
import com.opkey.opkeyaiclient.baseline.BaseLine;
import com.opkey.opkeyaiclient.imagecompare.ImageCompare;
import com.opkey.opkeyaiclient.tools.OpKeyToolUtils;
import com.opkey.opkeyaiclient.tools.RestClient;
import com.plugin.appium.Finder;
import com.plugin.appium.Utils;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.util.ImageUtils;

public class VisualValidation implements KeywordLibrary {
	private boolean createBaseLine = false;
	private boolean fullPageScreenShot = false;

	public FunctionResult setConfiguaration(String serverApiUrl, String baseLineName, boolean createBaseLine,
			boolean fullpageScreenShot) throws IOException {
		OpKeyToolUtils.getInstance().setServerURL(serverApiUrl);
		baseLineName = baseLineName.replaceAll("-", "").replaceAll(" ", "");
		OpKeyToolUtils.getInstance().setBaseLineId(baseLineName);
		setCreateBaseLine(createBaseLine);
		setFullPageScreenShot(fullpageScreenShot);
		if (isCreateBaseLine()) {
			new BaseLine().createBaseLineSchema(baseLineName);
		}
		return Result.PASS().setOutput(true).setMessage("URL: " + serverApiUrl + " BaseLineId: " + baseLineName).make();

	}

	public FunctionResult checkPoint() throws Exception {
		System.out.println(">>OpKey Tools CheckPoint Executed");
		
		if(AppiumContext.isBrowserOrWebviewMode())
			new Utils().waitForPageLoadAndOtherAjaxIfTrue();
		
		File screenShotFile = getScreenShotAsFile();
		
		System.out.println("Combined screenshot: " + screenShotFile.getPath());
		
		String resizedImagePath = System.getProperty("java.io.tmpdir") + File.separator + UUID.randomUUID().toString() + ".jpg";
		screenShotFile = this.resizeImageForServer(screenShotFile, new File(resizedImagePath));
		
		System.out.println("ReSized screenshot: " + screenShotFile.getPath());
		
		BufferedImage bimg = ImageIO.read(screenShotFile);
		int width = bimg.getWidth();
		int height = bimg.getHeight();
		bimg.flush();
		
		
		System.out.println("After Resize Width, Height: " + width + ", " + height);
		
		String dimension = String.valueOf(String.valueOf(width)) + "_" + height;
		String baseLineid = OpKeyToolUtils.getInstance().getBaseLineId();
		String stepNo = String.valueOf(Context.current().getFunctionCall().getStepNumber());
		String deviceName = "";
		
		if(AppiumContext.isNativeMode())
			deviceName = Utils.getDeviceName().trim().replaceAll(" ", "");
		else
			deviceName = Utils.getBrowserName().trim().replaceAll(" ", "");
			
			
		if (isCreateBaseLine()) {
			new BaseLine().createBaseLine(baseLineid, stepNo, deviceName, dimension, screenShotFile);
			return Result.PASS().setOutput(true).setMessage("BaseLine Created For Checkpoint").make();
		}
		String baseLineImageFileName = new BaseLine().fetchBaseLineImageFileName(baseLineid, stepNo, deviceName,
				dimension);
		System.out.println(">>BaseLine Image File Name Retrieved: " + baseLineImageFileName);
		String response = new ImageCompare().compareImageWithBaseLineImage(baseLineid, stepNo, deviceName, dimension,
				baseLineImageFileName, screenShotFile);
		if (response == null) {
			return Result.FAIL(ResultCodes.ERROR_UNHANDLED_EXCEPTION).setOutput(false)
					.setMessage("Unable to fetch response from server").make();
		}
		if (response.trim().isEmpty()) {
			return Result.FAIL(ResultCodes.ERROR_UNHANDLED_EXCEPTION).setOutput(false)
					.setMessage("Unable to fetch response from server").make();
		}
		try {
			JSONObject object = new JSONObject(response);
			if (object.getString("downloadPath") == null)
				return Result.FAIL(ResultCodes.ERROR_UNHANDLED_EXCEPTION).setOutput(false)
						.setMessage("Please Create a BaseLine First for " + deviceName).make();
			int failpercent = object.getInt("failPercentage");
			String downloadPath = object.getString("downloadPath");
			System.out.println(">> Download Path " + downloadPath);
			String outputImagePath = String.valueOf(String.valueOf(OpKeyToolUtils.getInstance().getBaseLineImageDir()))
					+ File.separator + OpKeyToolUtils.getInstance().getUniqueFileName("pdf");
			RestClient.downloadFile(downloadPath, outputImagePath);
			//AppiumDispatcher.isSnapshotAlreadyTaken = true;
			if (failpercent > 0) {
				return Result.FAIL(ResultCodes.ERROR_USER_ASSERTED_FAILURE).setOutput(false)
						.setMessage("Difference in Images Found " + failpercent)
						.addAttachment("VisualValidationReport_StepNo_"
								+ Context.current().getFunctionCall().getStepNumber() + ".zip", outputImagePath,
								"VisualQA")
						.make();
			}
			return Result.PASS().setOutput(true)
					.addAttachment("VisualValidationReport_StepNo_"
							+ Context.current().getFunctionCall().getStepNumber() + ".zip", outputImagePath, "VisualQA")
					.make();
		} catch (Exception e) {
			return Result.FAIL(ResultCodes.ERROR_USER_ASSERTED_FAILURE).setOutput(false).setMessage(response).make();
		}

	}

	private File getScreenShotAsFile() throws Exception {
		if (isFullPageScreenShot()) {
			File imageFile = new File(
					System.getProperty("java.io.tmpdir") + File.separator + UUID.randomUUID().toString() + ".jpg");
			System.out.println("Taking Full Page ScreenShot File Path " + imageFile.getAbsolutePath());
			captureSnapshot(imageFile.getAbsolutePath());
			return imageFile;
		}

		try {
			return (File) ((TakesScreenshot) Finder.findAppiumDriver()).getScreenshotAs(OutputType.FILE);
		} catch (WebDriverException | ToolNotSetException e) {
			e.printStackTrace();
			return null;
		}
	}
	
	private FunctionResult captureSnapshot(String completeImagepath) throws Exception {

		new Utils().waitForPageLoadAndOtherAjax();

		File scrFile = null;
		System.out.println("Using Shutterbug");
		PageSnapshot page = Shutterbug.shootPage(Finder.findAppiumDriver(), ScrollStrategy.BOTH_DIRECTIONS);
		scrFile = new File(page.saveAndReturn());
		
		int suffix = 0;
		try {

			// Scenario: C:\Users\ahmad.sayeed\Desktop\New folder\img ------------- img does
			// not explain if its file or directory
			String fileExtension = getFileExtension(new File(completeImagepath));

			if (new File(completeImagepath).isDirectory() || fileExtension == null) {
				System.out.println("Log Info ::: the coming path is directory or file name without extension : " + completeImagepath);

				completeImagepath = completeImagepath.concat("\\OpKey").concat(String.valueOf(suffix).concat(".jpg"));

				System.out.println("Log Info ::: After Concat Image Path is: " + completeImagepath);
				while (new File(completeImagepath).exists()) {
					int prevSuffix = suffix;
					suffix++;
					completeImagepath = completeImagepath.replace(String.valueOf(prevSuffix), String.valueOf(suffix));

					System.out.println("Log Info::: Managing File Exitence: " + completeImagepath);
				}
			}
			FileUtils.copyFile(scrFile, new File(completeImagepath));
		} catch (Exception e) {
			//new ExceptionManager().pushException(e);
			System.out.println("Log Info ::: Exception Occur while creating file");
			return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setMessage("Admin right is required to create Folder\\File").setOutput(false).make();
		}
		return Result.PASS().setMessage("Snapshot AbsolutePath<".concat(completeImagepath).concat(">")).setSnapshotPath(completeImagepath).setOutput(true).make();
	}

	private static String getFileExtension(File file) {
		String fileName = file.getName();
		if (fileName.lastIndexOf(".") != -1 && fileName.lastIndexOf(".") != 0)
			return fileName.substring(fileName.lastIndexOf(".") + 1);
		else
			return null;
	}
	
	private File resizeImageForServer(File inputFile, File outputFile) throws IOException {
		File newOutputFile = inputFile;
		boolean needResize = false;
		
		BufferedImage bimg = ImageIO.read(inputFile);
		int height = bimg.getHeight();
		int width = bimg.getWidth();
		
		System.out.println("Before Resize bimg.getHeight(): " + height);
		System.out.println("Before Resize bimg.getWidth(): " + width);
		
		
		if(height >= 14400) {
			height = 14000;
			needResize = true;
		}
		
		if(width >= 14000) {
			width = 14000;
			needResize = true;
		}
		
		System.out.println("Need to resize for server.");
		if(needResize)
			newOutputFile = new ImageUtils().reSize(bimg, outputFile, width, height);
		
		bimg.flush();
		return newOutputFile;
	}
	
	public boolean isCreateBaseLine() {
		return createBaseLine;
	}

	public void setCreateBaseLine(boolean createBaseLine) {
		this.createBaseLine = createBaseLine;
	}

	public boolean isFullPageScreenShot() {
		return fullPageScreenShot;
	}

	public void setFullPageScreenShot(boolean fullPageScreenShot) {
		this.fullPageScreenShot = fullPageScreenShot;
	}

}
