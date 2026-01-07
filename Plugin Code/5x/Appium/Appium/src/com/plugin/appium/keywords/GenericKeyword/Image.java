package com.plugin.appium.keywords.GenericKeyword;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.crestech.opkey.plugin.exceptionhandling.RetryKeywordAgainException;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.annotations.keywordValidation.KeywordActionType;
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.ActionType;
import com.plugin.appium.enums.ElementType;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.GenericKeyword.actionByText.FinderByText;
import com.plugin.appium.util.Checkpoint;

import io.appium.java_client.MobileElement;

public class Image implements KeywordLibrary {

	private WebObjects webObject = new WebObjects();

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	public FunctionResult Method_clickImage(AppiumObject object) throws Exception {
		WebElement ele = Finder.findWebElementUsingCheckPoint(object);
		Utils.performClick(ele);
		return Result.PASS().setOutput(true).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_waitforImageLoad(AppiumObject object, int timeOutInSecs) throws Exception {

		WebElement ele = Finder.findWebElementUsingCheckPoint(object, timeOutInSecs);

		
			
			if (Utils.waitElementDisplayed(ele)) {
				return Result.PASS().setOutput(true).make();
			}

	return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Image Loading Unsuccessfull, Waited for " + timeOutInSecs + " seconds").make();
	
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	public FunctionResult Method_verifyImageExist(AppiumObject object) throws Exception {

		try {
			WebElement we = Finder.findWebElementUsingCheckPoint(object);
			String objectType = Utils.getobjectType(object, we);

			if (objectType.equalsIgnoreCase("image") || objectType.equalsIgnoreCase("android.widget.ImageView") || objectType.toLowerCase().contentEquals("img")
					|| objectType.toLowerCase().contentEquals("imageview")) {

				if (Utils.isElementDisplayed(we)) {
					return Result.PASS().setOutput(true).setMessage(ReturnMessages.EXIST.toString()).make();
				}
			}

		} catch (Exception e) {
			Log.debug(e.getStackTrace());
			if (e instanceof RetryKeywordAgainException) {
				throw e;
			}
			// return
			// Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE).setOutput(false).setMessage("The
			// Object is not of image type").make();

		}

		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE).setOutput(false).setMessage("The Object is not of image type").make();

		/*
		 * // when image is not visible return
		 * Result.FAIL(ResultCodes.ERROR_INSUFFICIENT_PRIVILEGES).setOutput(false).
		 * setMessage("Image Not Exists").make();
		 */
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	public FunctionResult Method_verifyImageToolTip(AppiumObject object, String userToolTipText) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				String getToolTipText;
				getToolTipText = Utils.getAttrAndIgnoreExcecption(Finder.findWebElement(object), "title");
				// Check UserToolTipText To ObjectToolTip Text
				if (getToolTipText != null && getToolTipText.equals(userToolTipText))
					return Result.PASS().setOutput(true).setMessage(ReturnMessages.MATCHTOOLTIP.toString()).make();
				else
					return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
							.setMessage(Utils.verification_failed(getToolTipText, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue())).make();

			}
		}.run();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	public FunctionResult Method_verifyImageVisible(AppiumObject object) throws Exception {

		WebElement ele = Finder.findWebElementUsingCheckPoint(object);
		try {
			if (Utils.isElementDisplayed(ele)) {
				return Result.PASS().setOutput(true).setMessage(ReturnMessages.VISIBLE.toString()).make();

			}
		} catch (Exception e) {
			Log.debug(e.getStackTrace());
		}
		return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false).setMessage(ReturnMessages.INVISIBLE.toString()).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	public FunctionResult Method_verifyImageEnabled(AppiumObject object) throws Exception {
		return webObject.Method_ObjectisEnabled(object);
	}

	/**
	 * 
	 * Checkpoint Not Required
	 * 
	 * 
	 */

	public FunctionResult Method_verifyImageCount(int userImageCount) throws Exception {

		List<WebElement> totalImages;

		if (AppiumContext.isBrowserOrWebviewMode())
			// Get Total Image Use By img Tag
			totalImages = Finder.findAppiumDriver().findElements(By.tagName("img"));
		else
			// get total image Use by class name android.widget.ImageView
			totalImages = Finder.findAppiumDriver().findElements(By.className("android.widget.ImageView"));

		if (totalImages.size() == userImageCount)
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.MATCH_COUNT.toString()).make();

		else {
			return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
					.setMessage(ReturnMessages.verificationFailed(totalImages.size(), Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue())).make();
		}
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	public FunctionResult Method_doubleClickImage(AppiumObject object) throws Exception {
		
		new WebObjects().Method_dblClick(object);
		return Result.PASS().setOutput(true).make();
		
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getImageToolTip(AppiumObject object) throws Exception {
		try {
			return webObject.Method_getObjectToolTip(object);
		} catch (Exception e) {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Object Not Found").make();
		}
	}

	/**
	 * 
	 * @CheckPoint True
	 * 
	 */
	/*
	 * @KeywordActionType({ActionType.GET}) public FunctionResult
	 * Method_getImageCount() throws Exception { return new Checkpoint() {
	 * 
	 * @Override public FunctionResult _innerRun() throws InterruptedException,
	 * ToolNotSetException, ObjectNotFoundException, WebDriverException,
	 * ArgumentDataMissingException, IOException, ArgumentDataInvalidException,
	 * Exception {
	 * 
	 * // WebDriverDispatcher.isGetKeyword = true; WebDriver driver =
	 * Finder.findAppiumDriver(); //List<WebElement> listwebelement =
	 * driver.findElements(By.tagName("img")); List<WebElement> listwebelement =
	 * driver.findElements(By.className("android.widget.ImageView"));
	 * Log.print("<<#### Total Images Found " + listwebelement.size()); return
	 * Result.PASS().setOutput(listwebelement.size()).make(); } }.run(); }
	 */

	@KeywordActionType({ ActionType.GET })
	public FunctionResult Method_getImageCount(String path) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				if (path == null || path.isEmpty()) {
					throw new ArgumentDataInvalidException("The 'path' argument is required but missing or invalid.");
				}

				// Ensuring the directory exists
				File directory = new File(path);
				if (!directory.exists() && !directory.mkdirs()) {
					throw new IOException("Failed to create the specified directory: " + path);
				}

				WebDriver driver = Finder.findAppiumDriver();

				List<WebElement> imageElements = driver.findElements(By.className("android.widget.ImageView"));
				Log.print("<<#### Total Images Found: " + imageElements.size());

				//̥int imageIndex = 1;
				for (WebElement element : imageElements) {
					try {
						String timestamp = String.valueOf(System.currentTimeMillis());
						File screenshot = element.getScreenshotAs(OutputType.FILE);
						File outputFile = new File(directory, "image_" + timestamp + ".png");
						FileUtils.copyFile(screenshot, outputFile);
						Log.print("<<#### Image saved: " + outputFile.getAbsolutePath());
					} catch (Exception e) {
						Log.print("<<#### Error saving image: " + e.getMessage());
					}
				}

				return Result.PASS().setOutput(imageElements.size()).make();
			}
		}.run();
	}

	/**
	 * 
	 * 
	 * @Keyword: ClickImageByTitle/Alt
	 */
	public FunctionResult Method_clickImageByAltText(String altOrTitle, int index, boolean isContains) throws Exception {
		Log.print("@New ByText");
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				ObjectProperty byTextObject = new ObjectProperty(ElementType.IMAGE, altOrTitle, index, isContains, false);
				byTextObject.setTag("img");
				WebElement ele = FinderByText.findWebElement(byTextObject);
				ele.click();
				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}
}