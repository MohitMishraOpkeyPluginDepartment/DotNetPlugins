package com.plugin.appium.keywords.AppiumSpecificKeyword;

import org.openqa.selenium.ScreenOrientation;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.Finder;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

public class Orientation implements KeywordLibrary {

	/**
	 * 
	 * @return
	 * @throws ToolNotSetException
	 */

	public FunctionResult Method_getCurrentOrientation() throws ToolNotSetException {

		// WebDriver augmentedDriver = Finder.findAppiumDriver();
		// ScreenOrientation orientation = ((Rotatable)
		// augmentedDriver).getOrientation();
		ScreenOrientation orientation = Finder.findAppiumDriver().getOrientation();
		return Result.PASS().setOutput(orientation.name()).setMessage("Current Orientation is:" + orientation.name())
				.make();
	}

	/**
	 * 
	 * @return
	 * @throws ToolNotSetException
	 */

	public FunctionResult Method_isCurrentOrientationLandScape() throws ToolNotSetException {

		FunctionResult fr = Method_getCurrentOrientation();
		ScreenOrientation orientation = ScreenOrientation.valueOf(fr.getOutput());

		if (orientation == ScreenOrientation.LANDSCAPE) {
			return Result.PASS().setOutput(true).setMessage("Current Orientation is: " + fr.getOutput()).make();

		} else {
			return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
					.setMessage("Current Orientation is: " + fr.getOutput()).make();
		}
	}

	/**
	 * 
	 * @return
	 * @throws ToolNotSetException
	 */
	public FunctionResult Method_isCurrentOrientationPortrait() throws ToolNotSetException {
		FunctionResult fr = Method_getCurrentOrientation();
		ScreenOrientation orientation = ScreenOrientation.valueOf(fr.getOutput());

		if (orientation == ScreenOrientation.PORTRAIT) {
			return Result.PASS().setOutput(true).setMessage("Current Orientation is: " + fr.getOutput()).make();

		} else {
			return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
					.setMessage("Current Orientation is:" + fr.getOutput()).make();
		}

	}

	/**
	 * 
	 * @return
	 * @throws ToolNotSetException
	 */

	public FunctionResult Method_currentOrientationChangeToPortrait() throws ToolNotSetException {
		try {
			FunctionResult fr = Method_getCurrentOrientation();
			ScreenOrientation orientation = ScreenOrientation.valueOf(fr.getOutput());
			if (orientation == (ScreenOrientation.PORTRAIT))
				return Result.PASS().setOutput(true).setMessage("Orientation is already in: " + fr.getOutput()).make();

			else {
				Finder.findAppiumDriver().rotate(ScreenOrientation.PORTRAIT);
				// WebDriver augmentedDriver = Finder.findAugmentedDriver();
				// ((Rotatable)
				// augmentedDriver).rotate(ScreenOrientation.PORTRAIT);
				return Result.PASS().setOutput(true).setMessage("Orientation has changed to PORTRAIT").make();
			}
		} catch (Exception ex) {
			return Result.FAIL(ResultCodes.ERROR_UNSATISFIED_DEPENDENCIES).setOutput(false)
					.setMessage("Not able to change Orientation at this time.").make();
		}
	}

	/**
	 * 
	 * @return
	 * @throws ToolNotSetException
	 */

	public FunctionResult Method_currentOrientationChangeToLandScape() throws ToolNotSetException {
		try {
			FunctionResult fr = Method_getCurrentOrientation();
			ScreenOrientation orientation = ScreenOrientation.valueOf(fr.getOutput());
			if (orientation == ScreenOrientation.LANDSCAPE)
				return Result.PASS().setOutput(true).setMessage("Orientation is already in:" + fr.getOutput()).make();
			else {
				Finder.findAppiumDriver().rotate(ScreenOrientation.LANDSCAPE);
				// ((Rotatable)
				// augmentedDriver).rotate(ScreenOrientation.LANDSCAPE);
				return Result.PASS().setOutput(true).setMessage("Orientation has changed to LANDSCAPE").make();
			}
		} catch (Exception ex) {
			return Result.FAIL(ResultCodes.ERROR_UNSATISFIED_DEPENDENCIES).setOutput(false)
					.setMessage("Not able to change Orientation at this time").make();
		}
	}

}
