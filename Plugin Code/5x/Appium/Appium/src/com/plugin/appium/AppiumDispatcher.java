package com.plugin.appium;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.logging.Logger;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.WebDriverException;
import com.crestech.opkey.plugin.ExecutableClassLibrary;
import com.crestech.opkey.plugin.ExecutionStatus;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functioncall.FunctionCall;
import com.crestech.opkey.plugin.communication.contracts.functioncall.Object.Properties.Property;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.contexts.InvocationContext;
import com.crestech.opkey.plugin.contexts.SessionSnapshotFrequency;
import com.crestech.opkey.plugin.exceptionhandling.ExceptionHandler2;
import com.crestech.opkey.plugin.exceptionhandling.MethodNotFoundException;
import com.crestech.opkey.plugin.exceptionhandling.RetryKeywordAgainException;
import com.crestech.opkey.plugin.exceptionhandling.SkippedStepValidationException;
import com.crestech.opkey.plugin.functiondispatch.ArgumentFormatter;
import com.crestech.opkey.plugin.functiondispatch.BaseDispatcher;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;
import com.crestech.opkey.plugin.functiondispatch.LibraryLocator;
import com.crestech.opkey.plugin.functiondispatch.Tuple;
import com.plugin.appium.annotations.keywordValidation.KeywordActionType;
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInApplicationMode;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInHybridApplication;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInIOS;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInMobileContext;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInNativeApplication;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.context.PCloudyContext;
import com.plugin.appium.enums.ActionType;
import com.plugin.appium.enums.BrowserType;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.enums.DriverWindow;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.enums.VisibilityKeywords;
import com.plugin.appium.exceptionhandlers.AdbNotFoundException;
import com.plugin.appium.exceptionhandlers.KeywordMethodOrArgumentValidationFailException;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.exceptionhandlers.UnableToProcessADBCommandException;
import com.plugin.appium.keywords.AppiumSpecificKeyword.AppiumSpecificUnCategorised;
import com.plugin.appium.keywords.GenericKeyword.Frame;
import com.plugin.appium.keywords.GenericKeyword.WebObjects;
import com.ssts.pcloudy.exception.ConnectError;
import com.ssts.pcloudy.Connector;
import com.ssts.pcloudy.dto.screenshot.CaptureDeviceScreenshotDto.CaptureDeviceScreenshotResultDto;

public class AppiumDispatcher extends BaseDispatcher {

	public static boolean frameSwitched = false;
	public static boolean isSelectWindow;
	private File baseScreenshotsDir = null;
	private Logger logger = Logger.getLogger(this.getClass().getName());
	public static boolean isGetKeyword = false;
	public static boolean isGetKeywordOutputFalse;
	public static boolean lastChance = false;

	public AppiumDispatcher(LibraryLocator locator, ArgumentFormatter formatter, ExceptionHandler[] arrOldExHandlers, List<ExceptionHandler2> listNewExceptionHandler, File ScreenshotDir) {
		super(locator, formatter, arrOldExHandlers, listNewExceptionHandler);
		this.baseScreenshotsDir = ScreenshotDir;
	}

	@Override
	public FunctionResult Dispatch(FunctionCall fc) throws InterruptedException, SkippedStepValidationException {

		beforeDispatcher();

		FunctionResult fr = null;
		ActionType[] actionType = new ActionType[0];
		try {

			if (fc.getFunction().getCodedFunction() != null) {
				// Don't validate the CodedFunction. It will get validated in PluginBase
			} else {
				this.keywordMethodValidation(fc);
				this.keywordArgumentValidation(fc);
				actionType = this.keywordActionType(fc);

			}

			Exception lastException = null;
			long start = System.currentTimeMillis();
			while (Context.current().getKeywordRemaningSeconds() - 4 > 0) {
				try {
					fr = super.Dispatch(fc);
					break;
				} catch (RetryKeywordAgainException e) {

					lastException = e;

					Thread.sleep(500);
					// AppiumDispatcher.flagWebElement = null;
					logger.warning("Stale Reference Exception occur Finding element Once Again");
					Log.print("Stale Reference Exception occur Finding element Once Again");
				}
			}
			System.out.println("Keyword Execution Time Taken: " + (System.currentTimeMillis() - start));
			if (fr == null && lastException != null && lastException instanceof RetryKeywordAgainException) {
				fr = Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE).setOutput(false).setMessage("Stale Element Found").make();

			}

			// fr = super.Dispatch(fc);

			fr = formateFunctionResult(fr, fc, actionType);

		} catch (KeywordMethodOrArgumentValidationFailException ex) {
			fr = Result.FAIL(ex.getErrorCode()).setOutput(false).setMessage(ex.getMessage()).make();
		} catch (MethodNotFoundException e) {
			fr = Result.FAIL(ResultCodes.ERROR_METHOD_NOT_FOUND).setOutput(false).setMessage(e.getMessage()).make();
		} catch (InterruptedException | SkippedStepValidationException ex) {
			throw ex;
		} catch (Throwable ex) {
			ex.printStackTrace();
			fr = Result.FAIL(ResultCodes.ERROR_UNHANDLED_EXCEPTION).setOutput(false).setMessage(ex.getMessage()).make();

		} finally {
			fr = afterDispatcher(fc, fr);
		}

		return fr;
	}

	public static boolean visibilityKeywordStatus(String methodName) {
		for (VisibilityKeywords vk : VisibilityKeywords.values()) {
			if (vk.name().equals(methodName)) {
				return true;
			}
		}
		return false;
	}
	
	private FunctionResult afterDispatcher(FunctionCall fc, FunctionResult fr) {
		long start = System.currentTimeMillis();
		afterKeywordTask(fc, fr);

		AppiumSpecificUnCategorised.takeSnapShot = true;
		System.out.println("AfterDispatcher Time Taken: " + (System.currentTimeMillis() - start));
		return fr;
	}

	private FunctionResult afterKeywordTask(FunctionCall fc, FunctionResult fr) {

		ExecutorService executor = Executors.newSingleThreadExecutor();
		Future<FunctionResult> future = executor.submit(new AfterKeywordTask(this, fc, fr, Context.current()));

		try {
			fr = future.get(Context.current().getKeywordRemaningSeconds() + 3, TimeUnit.SECONDS);
		} catch (TimeoutException e) {
			future.cancel(true);
			executor.shutdownNow();
			
			logger.warning("Plugin unable to take screenshot. " + e.getMessage());
			//e.printStackTrace();
			fr.setMessage(fr.getMessage() + "\n\n -plugin-unable-to-take-screenshot- \n");
			fr.setMessage(fr.getMessage().trim());
			fr.setResultCode(fr.getResultCode());
		} catch (Exception e) {
			future.cancel(true);
			
			logger.warning("Plugin unable to take screenshot. " + e.getMessage());
			//e.printStackTrace();
			fr.setMessage(fr.getMessage() + "\n\n -plugin-unable-to-take-screenshot- \n");
			fr.setMessage(fr.getMessage().trim());
			fr.setResultCode(fr.getResultCode());
		} finally {
			future.cancel(true);
			executor.shutdownNow();
		}

		if (!executor.isShutdown()) {
			future.cancel(true);
			executor.shutdownNow();
		}

		return fr;
	}

	private FunctionResult screenshot(FunctionCall fc, FunctionResult fr) throws ToolNotSetException, IOException, UnableToProcessADBCommandException, InterruptedException, AdbNotFoundException, ConnectError {
		// check whether snapshot is required or not
		if (fr != null && this.shouldCaptureScreenshot(ExecutionStatus.valueOf(fr.getStatus()), fc) && AppiumSpecificUnCategorised.takeSnapShot) {
			logger.info("Try to take snapshot");
			File snapshot = this.captureScreenshot("Step" + fc.getStepNumber());
			System.out.println("Session snapshot path " + snapshot.getAbsolutePath());
			fr.setSnapshotPath(snapshot.getAbsolutePath());
			logger.info("Take Snapshot Complete");
			// minimize keyboard if open

			// dehighlight keyword
			new WebObjects().Method_deHighlightElement();
		}
		return fr;
	}

	private FunctionResult formateFunctionResult(FunctionResult fr, FunctionCall fc, ActionType[] actionType) {
		printFunctionResult(fr);
		if (fr == null && Arrays.asList(actionType).contains(ActionType.GET)) {
			return Result.PASS().setOutput(false).setMessage(ResultCodes.ERROR_STEP_TIME_OUT.toString()).make();
			
		} else if (fr == null) {
			return Result.FAIL(ResultCodes.ERROR_STEP_TIME_OUT).setOutput(false).setMessage(ResultCodes.ERROR_STEP_TIME_OUT.toString()).make();
			
		}else if(fr != null && Arrays.asList(actionType).contains(ActionType.GET)) {
			if (fr.getOutput() == null || fr.getOutput().isEmpty()) 
				return Result.PASS().setOutput(false).setMessage(fr.getMessage()).make();
			
		}else if (fr != null && visibilityKeywordStatus(fc.getFunction().getMethodName())) {
			if (fr.getOutput() == null || fr.getOutput().isEmpty())			// this is a Visibility Keyword 
				//return Result.FAIL(ResultCodes.fromCode(fr.getResultCode())).setOutput(false).setMessage(fr.getMessage()).make();
			return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false).setMessage(fr.getMessage()).make();
		}
		
//		if (Arrays.asList(actionType).contains(ActionType.GET) || visibilityKeywordStatus(fc.getFunction().getMethodName())) {
//			if (fr == null) {
//				return Result.PASS().setOutput(false).setMessage(ResultCodes.ERROR_STEP_TIME_OUT.toString()).make();
//			}else if(fr.getOutput() == null || fr.getOutput().isEmpty()) {
//				return Result.PASS().setOutput(false).setMessage(fr.getMessage()).make();
//			}else {
//				return Result.PASS().setOutput(fr.getOutput()).setMessage(fr.getMessage()).make();
//			}
//		}else if(fr == null) {
//			return Result.FAIL().setOutput(false).setMessage(ResultCodes.ERROR_STEP_TIME_OUT.toString()).make();
//		}
		return fr;
	}
	
	private void printFunctionResult(FunctionResult functionResult) {
		System.out.println("---- Output Fr: " + functionResult);
		if (functionResult != null) {
			System.out.println("Output: " + functionResult.getOutput());
			System.out.println("Status: " + functionResult.getStatus());
			System.out.println("Message: " + functionResult.getMessage());
			System.out.println("Result Code: " + functionResult.getResultCode());
		}
	}

	private ActionType[] keywordActionType(FunctionCall fc) throws FileNotFoundException, InterruptedException {
		String Methodname = fc.getFunction().getMethodName();
		Method m = super.locator.Locate(Methodname, checkArgumentNumber(fc)).x;

		if (m.isAnnotationPresent(KeywordActionType.class)) {
			KeywordActionType methodAnno = m.getAnnotation(KeywordActionType.class);
			ActionType[] arrKeywordActionType = methodAnno.value();
			return arrKeywordActionType;
		}

		return new ActionType[0];
	}

	private void beforeDispatcher() {
		Finder.textElementsList = new ArrayList<>();
		Finder.findUsingFrame = true;
	}

	private void switchToDefaultContentIfNeeded() {
		try {
			Frame.switchToDefaultContent(Frame.SwitchState.SWITCH_BY_FINDER);
		} catch (Exception e) {
			Log.print("@Exception while switchToDefaultContent..");
			// we cannot break out of the dispatch loop.
			// life goes on...
		}
	}

	private void keywordMethodValidation(FunctionCall fc) throws InterruptedException, KeywordMethodOrArgumentValidationFailException, MethodNotFoundException, FileNotFoundException {

		String Methodname = fc.getFunction().getMethodName();

		if (fc.getObjectArguments().getObjectArgument().size() != 0) {
			try {
				List<Property> properties = fc.getObjectArguments().getObjectArgument().get(0).getObject().getProperties().getProperty();
				for (Property prp : properties) {
					if (prp.getName().equalsIgnoreCase("Window")) {
						try {

							Finder.windowSwitchIfNeeded(prp.getValue());

						}
						// base dispatcher is not ready for throw
						// ToolNotSetException so we catch
						catch (ToolNotSetException ex) {
						} catch (ObjectNotFoundException e) {

						}
					}
				}
			} catch (Exception e) {
			}
		}

		Method m = null;
		Tuple<Method, ExecutableClassLibrary> tuple = super.locator.Locate(Methodname, checkArgumentNumber(fc));

		if (tuple == null) {
			// when method not found
			throw new MethodNotFoundException(Methodname);
		}

		else {
			m = tuple.x;
		}

		if (m.isAnnotationPresent(NotSupportedInMobileContext.class)) {
			throw new KeywordMethodOrArgumentValidationFailException(ReturnMessages.APPIUM_NOT_SUPPURTED.toString(), ResultCodes.ERROR_UNSUPPORTED_OPERATION);

		} else if (((m.isAnnotationPresent(NotSupportedInNativeApplication.class)) && (!AppiumContext.isBrowserOrWebviewMode()))) {
			throw new KeywordMethodOrArgumentValidationFailException(ReturnMessages.ONLY_WEBVIEWS_SUPPORT.toString(), ResultCodes.ERROR_UNSUPPORTED_OPERATION);
		}

		else if (((m.isAnnotationPresent(NotSupportedInHybridApplication.class) && (AppiumContext.getDriverWindow() == DriverWindow.WebView)))) {
			throw new KeywordMethodOrArgumentValidationFailException(ReturnMessages.ONLY_NATIVE_APPLICATION_SUPPORTED.toString(), ResultCodes.ERROR_UNSUPPORTED_OPERATION);
		}

		else if (((m.isAnnotationPresent(NotSupportedInApplicationMode.class))
				&& (!(AppiumContext.getBrowserMode() == BrowserType.chromeOnLocalAndroid || AppiumContext.getBrowserMode() == BrowserType.ChromeOnCloud || AppiumContext.getBrowserMode() == BrowserType.SafariOnIos)))) {
			throw new KeywordMethodOrArgumentValidationFailException(ReturnMessages.ONLY_BROWSER_SUPPORTED.toString(), ResultCodes.ERROR_UNSUPPORTED_OPERATION);
		}

		else if (m.isAnnotationPresent(NotSupportedInIOS.class) && (AppiumContext.isIOS())) {
			throw new KeywordMethodOrArgumentValidationFailException(ReturnMessages.NOT_SUPPORTED_IN_IOS.toString(), ResultCodes.ERROR_UNSUPPORTED_OPERATION);
		}
	}

	private Integer checkArgumentNumber(FunctionCall fc) {
		int opkeyArgumentCount = 0;

		// Add the objects
		if (fc.getObjectArguments() != null) {
			opkeyArgumentCount += fc.getObjectArguments().getObjectArgument().size();
		}

		if (fc.getMobilityArguments() != null) {
			// Add the Mobile Devices
			if (fc.getMobilityArguments().getMobileDeviceArguments() != null) {
				opkeyArgumentCount += fc.getMobilityArguments().getMobileDeviceArguments().getDevice().size();
			}
			// Add the Mobile Application
			if (fc.getMobilityArguments().getMobileApplicationArguments() != null) {
				opkeyArgumentCount += fc.getMobilityArguments().getMobileApplicationArguments().getApplication().size();
			}
		}
		// Add non-object data
		if (fc.getDataArguments() != null) {
			opkeyArgumentCount += fc.getDataArguments().getDataArgument().size();
		}
		return opkeyArgumentCount;
	}

	private void keywordArgumentValidation(FunctionCall fc) throws KeywordMethodOrArgumentValidationFailException, FileNotFoundException, InterruptedException {

		String Methodname = fc.getFunction().getMethodName();
		Method m = super.locator.Locate(Methodname, checkArgumentNumber(fc)).x;

		if (m.isAnnotationPresent(KeywordArgumentValidation.class)) {
			KeywordArgumentValidation methodAnno = m.getAnnotation(KeywordArgumentValidation.class);
			int[] arrCheckDataForBlank = methodAnno.checkDataForBlank();
			int[] checkDataForWhiteSpace = methodAnno.checkDataForWhiteSpace();
			int[] checkDataForDelimiter = methodAnno.checkDataForDelimiter();
			Validations.checkDataForBlank(fc, arrCheckDataForBlank);
			Validations.checkDataForWhiteSpace(fc, checkDataForWhiteSpace);
			Validations.checkDataForDelimiter(fc, checkDataForDelimiter);
		}
	}

	private File captureScreenshot(String prefix) throws IOException, ToolNotSetException, UnableToProcessADBCommandException, InterruptedException, AdbNotFoundException, ConnectError {

		File scrFile = null;
		boolean isAndoird = (DeviceType.Android == AppiumContext.getDeviceType());
		if (AppiumContext.isPCloudy() && isAndoird) {
			try {
				System.out.println("##<< capturing image on Pcloudy ");
				scrFile = pCloudyAndroidScreenshot();
			} catch (Exception e) {	
				System.out.println("##<< Error while capturing image through pcloudy "+e.getMessage());
				e.printStackTrace();
				scrFile = null;
			}
							
		}

		if (scrFile == null) {
			try {
				System.out.println("##<< capturing image through appium ");
				scrFile = this.takeScreenshotUsingAppium();
				if(scrFile!=null) {
				System.out.println("##<< captured image file size through appium :: "+scrFile.length());
				}
			} catch (Exception e) {
				System.out.println("##<< Error while capturing image through appium "+e.getMessage());
				e.printStackTrace();
			} 
		}

		File screenshot = File.createTempFile(prefix, ".png", this.baseScreenshotsDir);
		try {

			FileUtils.copyFile(scrFile, screenshot);

		} catch (Exception e) {
			System.out.println("##<< Error while copying image  "+e.getMessage());
			e.printStackTrace();
			Log.print(">> Taking snapshot via ADB command");
			// generally it takes time 2 sec.
			Utils.takeSnapShotViaADB(screenshot);
		}

		return screenshot;

	}

	/**
	 * Appium Screenshot sometime stuck and took more than 10 seconds. Take
	 * Screenshot from API if pCLoudy and Android. This has average 2 seconds.
	 */
	private File pCloudyAndroidScreenshot() throws IOException, ConnectError, InterruptedException {
		try {
			PCloudyContext pCloudyContext = AppiumContext.getPCloudyContext();
			String authToken = pCloudyContext.getAuthToken();
			int rId = pCloudyContext.getRID();

			Connector conn = pCloudyContext.getConnector();
			CaptureDeviceScreenshotResultDto dto = conn.takeDeviceScreenshot(authToken, rId, false);
			System.out.println("dto.filename: " + dto.filename);
			System.out.println("dto.dir: " + dto.dir);
			System.out.println("dto.error: " + dto.error);
			File apiImage = conn.downloadFileFromCloud(authToken, dto.filename, dto.dir);
			File convertedImage = new File(apiImage.getPath().replace("jpg", "png"));
			apiImage.renameTo(convertedImage);
			return convertedImage;
		} catch (Exception e) {
			Log.print("@Exception while pCloudyScreenshot" + e.getMessage());
		}
		return null;
	}

	private File takeScreenshotUsingAppium() throws WebDriverException, ToolNotSetException {
		return Finder.findAppiumDriver().getScreenshotAs(OutputType.FILE);

	}

	/**
	 * this method return true if screenshot must be captured otherwise false
	 * 
	 * @param resultStatus
	 * @return
	 */
	private Boolean shouldCaptureScreenshot(ExecutionStatus resultStatus, FunctionCall fc) {
		if (fc.isSnapshotRequired()) {
			if ((Context.session().getSessionSnapshotFrequency() == SessionSnapshotFrequency.AllSteps
					|| (Context.session().getSessionSnapshotFrequency() == SessionSnapshotFrequency.FailedSteps && resultStatus == ExecutionStatus.Fail))
					&& Context.session().getSessionSnapshotFrequency() != SessionSnapshotFrequency.NoStep)
				return true;

			else
				return false;
		} else
			return false;

	}

	class AfterKeywordTask implements Callable<FunctionResult> {
		AppiumDispatcher appiumDispatcher;
		FunctionCall functionCall;
		InvocationContext invocationContext;
		FunctionResult functionResult;

		AfterKeywordTask(AppiumDispatcher wdd, FunctionCall fc, FunctionResult fr, InvocationContext invContext) {
			this.appiumDispatcher = wdd;
			this.functionCall = fc;
			this.functionResult = fr;
			this.invocationContext = invContext;
		}

		@Override
		public FunctionResult call() throws Exception {
			Context.set(this.invocationContext);
			this.appiumDispatcher.switchToDefaultContentIfNeeded();
			return appiumDispatcher.screenshot(this.functionCall, this.functionResult);
		}

	}
}
