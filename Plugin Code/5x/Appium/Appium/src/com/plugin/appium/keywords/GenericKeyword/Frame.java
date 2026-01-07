package com.plugin.appium.keywords.GenericKeyword;

import java.util.HashMap;
import java.util.List;
import java.util.Stack;
import java.util.logging.Logger;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.AppiumObjectProperty;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInNativeApplication;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

import io.appium.java_client.AppiumDriver;

public class Frame implements KeywordLibrary {
	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	// -- Case 1: if OpKey smartly interupts for Frame : selectFrameActivated = false
	// -- Case 2: if User interupts for Frame : selectFrameActivated = true

	private static Logger logger = Logger.getLogger(Frame.class.getName());
	private static HashMap<WebDriver, Frames> whereAmI = new HashMap<>();
	public static boolean frameSwitch = false;

	/*
	 * 
	 * 
	 * 
	 * 
	 * */

	public static HashMap<WebDriver, Frames> getWhereAmI() {
		return whereAmI;

	}

	public static Boolean selectFrameActivated = false;

	@NotSupportedInNativeApplication
	public FunctionResult Method_selectFrame(AppiumObject frame) throws Exception {
	//as we do not have insight of the elements in iframe so we first found all elements using "//*" this xpath then we can print properties of each element
	
		boolean switchSuccessful = switchDriverIfNeeded(frame, SwitchState.SWITCHED_BY_KEYWORD);
		

		if (switchSuccessful) {
			return Result.PASS().setOutput(true).setResultCode(ResultCodes.SUCCESS.Code()).make();
		} else {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage("Unable to switch frame.").setOutput(false).make();
		}
	}

	@NotSupportedInNativeApplication
	public FunctionResult Method_switchToDefaultContent() throws Exception {
		logger.fine("   =>Current Title & URL: " + Finder.findAppiumDriver().getTitle() + "; " + Finder.findAppiumDriver().getCurrentUrl());
		switchToDefaultContent(SwitchState.SWITCHED_BY_KEYWORD);
		logger.fine("   =>Title & URL after switching: " + Finder.findAppiumDriver().getTitle() + "; " + Finder.findAppiumDriver().getCurrentUrl());
		return Result.PASS().setOutput(true).setResultCode(ResultCodes.SUCCESS.Code()).make();
	}

	/**
	 * Checkpoint supported
	 */
	public static boolean switchDriverIfNeeded(AppiumObject currentObject, SwitchState switchState) throws Exception {
		
		Finder.continueSearchingOrStop();
		
		AppiumDriver<WebElement> driver = Finder.findAppiumDriver();

		if (!whereAmI.containsKey(driver)) {
			whereAmI.put(driver, new Frames());
		}
		Frames frames = whereAmI.get(driver);

		if (switchState == SwitchState.DEFAULT_CONTEXT) {
			throw new Exception("Impossible scenario 1");

		} else if (frames.switchState == SwitchState.SWITCHED_BY_KEYWORD && switchState != SwitchState.SWITCHED_BY_KEYWORD) {
			logger.fine("Frame previously switched by keyword. No need to switch again");
			return false;

		} else if (frames.switchState == SwitchState.SWITCH_BY_FINDER && switchState == SwitchState.SWITCHED_BY_KEYWORD) {
			throw new Exception("Impossible scenario 2");
		}

		// Not given time so code is duplicate in finder as well as frame
		Stack<AppiumObject> stk = new Stack<AppiumObject>();

		boolean switchSuccessful = false;
		// push all the parent hierarchy into the stack

		// if the currentObject is itself a frame(condition appears in
		// SelectFrame keyword), then add thyself in the stack
		if (currentObject.getTagName().getValue().toLowerCase().contains("frame")) {
			stk.push(currentObject);
		}

		while (currentObject.getParentObject() != null) {
			Finder.continueSearchingOrStop();
			currentObject = currentObject.getParentObject();
			stk.push(currentObject);
		}
		Log.print("the stack size is " + stk.size() + " means object lies at " + stk.size() + " level");

		// now start switching
		while (stk.size() > 0) {
			Finder.continueSearchingOrStop();

			switchSuccessful = false;
			AppiumObject parentObj = stk.pop();

			if (!parentObj.getTagName().getValue().toLowerCase().contains("frame")) {
				Finder.continueSearchingOrStop();
				// System.out.println("TARIF "+parentObj.getTitle().getValue());
				continue;
			}

			logger.fine("Switching WebDriver to frame");

			// Switch by id
			if (!parentObj.getId().isValueNullOrEmpty()) {
				try {
					System.out.println("  -> Switching by Id: " + parentObj.getId().getValue());
					driver.switchTo().frame(parentObj.getId().getValue());
					switchSuccessful = true;
					System.out.println("Switch successful");
					continue;
				} catch (WebDriverException ex) {
					 logger.finest(ex.getMessage());
					 System.out.println(ex.getMessage());
				}
			}

			Finder.continueSearchingOrStop();
			// Switch by Name
			if (!parentObj.getName().isValueNullOrEmpty()) {
				try {
					System.out.println("  -> Switching by Name: " + parentObj.getName().getValue());
					List<WebElement> frameElements = driver.findElements(By.xpath("//iframe[@name=\"" + parentObj.getName().getValue().trim() + "\"]"));
					if (frameElements.size() > 1) {
						logger.warning("Multiple Frames Found By Name. Considering Switching To First Frame Found...");
						System.out.println("Multiple Frames Found By Name. Considering Switching To First Frame Found...");
					}
					driver.switchTo().frame(parentObj.getName().getValue());
					switchSuccessful = true;
					System.out.println("Switch successful");
					continue;
				} catch (WebDriverException ex) {
					// logger.finest(ex.getMessage());
					 System.out.println(ex.getMessage());
				}
			}

			Finder.continueSearchingOrStop();
			// Switch by xpath - using source property
			if (!parentObj.getSrc().isValueNullOrEmpty()) {
				try {
					String frameXPath = "//iframe[@src=\"" + parentObj.getSrc().getValue() + "\"]";
					System.out.println("  -> Switching by frame with xpath: " + frameXPath);
					List<WebElement> iframe = driver.findElements(By.xpath(frameXPath));
					if (iframe.size() == 1) {
						driver.switchTo().frame(iframe.get(0));
						switchSuccessful = true;
						System.out.println("Switch successful");
						continue;
					}
				} catch (WebDriverException ex) {
					// logger.finest(ex.getMessage());
					 System.out.println(ex.getMessage());
				}
			}

			
			Finder.continueSearchingOrStop();
			// Switch by xpath - url
			if (!parentObj.getUrl().isValueNullOrEmpty()) {
				try {
					String frameXPath = "//iframe[@src=\"" + parentObj.getUrl().getValue() + "\"]";
					System.out.println("  -> Switching by frame with xpath with src: " + frameXPath);
					List<WebElement> iframe = driver.findElements(By.xpath(frameXPath));
					if (iframe.size() == 1) {
						driver.switchTo().frame(iframe.get(0));
						switchSuccessful = true;
						System.out.println("Switch successful");
						continue;
					}
				} catch (WebDriverException ex) {
					// logger.finest(ex.getMessage());
					 System.out.println(ex.getMessage());
				}
			}

			Finder.continueSearchingOrStop();
			// Switch By class name
			if (!parentObj.getClassName().isValueNullOrEmpty()) {
				try {
					System.out.println("  -> Switching by class Name: " + parentObj.getClassName().getValue());
					List<WebElement> iframe = driver.findElements(By.className(parentObj.getClassName().getValue()));
					if (iframe.size() == 1) {
						driver.switchTo().frame(iframe.get(0));
						switchSuccessful = true;
						System.out.println("Switch successful");
						continue;
					}
				} catch (WebDriverException ex) {
					// logger.finest(ex.getMessage());
					 System.out.println(ex.getMessage());
				}
			}

			// Switch By cssSelector
			if (!switchSuccessful) {
				for (AppiumObjectProperty cssSelector : parentObj.getCssSelectors()) {
					Finder.continueSearchingOrStop();
					try {
						if (!cssSelector.isValueNullOrEmpty()) {
							System.out.println("  -> Switching by Css Selector:  " + cssSelector.getValue());
							List<WebElement> iframe = driver.findElements(By.cssSelector(cssSelector.getValue()));
							if (iframe.size() == 1) {
								driver.switchTo().frame(iframe.get(0));
								switchSuccessful = true;
								System.out.println("Switch successful");
								break;
							}
						}
					} catch (WebDriverException ex) {
						// logger.finest(ex.getMessage());
						 System.out.println(ex.getMessage());
					}

				}
			}

			// Switch By xpath
			if (!switchSuccessful) {
				for (AppiumObjectProperty xPath : parentObj.getXPaths()) {
					Finder.continueSearchingOrStop();
					try {
						if (!xPath.isValueNullOrEmpty()) {
							System.out.println("  -> Switching by xpath: " + xPath.getValue());
							List<WebElement> iframe = driver.findElements(By.xpath(xPath.getValue()));
							if (iframe.size() == 1) {
								driver.switchTo().frame(iframe.get(0));
								switchSuccessful = true;
								System.out.println("Switch successful");
								break;
							}
						}
					} catch (WebDriverException ex) {
						// logger.finest(ex.getMessage());
						 System.out.println(ex.getMessage());
					}
				}
			}

		}

		if (switchSuccessful) {
			logger.fine("   =>URL of frame after switching: " + driver.getCurrentUrl());
			frameSwitch = true;
			frames.stack.push(currentObject);
			frames.switchState = switchState;

		} else {
			logger.finer("  -> Unable to switch WebDriver, Either object is not in the frame or frame property is not sufficient to switch Webdriver");
		}
		 System.out.println(switchSuccessful);
		return switchSuccessful;
	}

	/**
	 * Checkpoint not required
	 * @param switchState
	 * @throws Exception
	 */
	public static void switchToDefaultContent(SwitchState switchState) throws Exception {
		
		if (switchState == SwitchState.DEFAULT_CONTEXT) {
			throw new Exception("Impossible scenario 3");
		}

		WebDriver driver = Finder.findAppiumDriver();
		if (!whereAmI.containsKey(driver)) {
			whereAmI.put(driver, new Frames());
		}

		Frames frames = whereAmI.get(driver);
		
		Log.print("frames.switchState :: " + frames.switchState + "\n switchState :: " + switchState);

		if (frames.switchState != switchState) {
			Log.debug("Not jumping to default context. SwitchState: " + frames.switchState.name());

		} else { // now jumping jumping
			Log.debug("Switching to default content");

			Finder.findAppiumDriver().switchTo().defaultContent();
			// Next call no need to be Switch content default content
			frames.stack.clear();
			frames.switchState = SwitchState.DEFAULT_CONTEXT;
			Thread.sleep(1);
		}
	}

	public static void setFrameSwitchState(SwitchState switchState) throws ToolNotSetException {
		Frames frames = whereAmI.get(Finder.findAppiumDriver());
		frames.switchState = switchState;
	}

	public static class Frames {

		public Stack<AppiumObject> stack = new Stack<>();

		public SwitchState switchState = SwitchState.DEFAULT_CONTEXT;

	}

	public enum SwitchState {
		DEFAULT_CONTEXT, SWITCH_BY_FINDER, SWITCHED_BY_KEYWORD
	}

}
