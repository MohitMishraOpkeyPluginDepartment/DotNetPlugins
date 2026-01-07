package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.util.Set;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.Finder;
import com.plugin.appium.annotations.keywordValidation.KeywordActionType;
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.enums.ActionType;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

public class ApplicationContext implements KeywordLibrary {

	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getCurrentContext() throws ToolNotSetException {
		try {
			String currentContext = Finder.findAppiumDriver().getContext();
			System.out.println("Current Context: " + currentContext);
			return Result.PASS().setOutput(currentContext).make();
		} catch (Exception e) {
			System.out.println("Exception while Context Operation");
			e.printStackTrace();
			return Result.PASS().setOutput("").setMessage(e.getMessage()).make();
			// return Result.FAIL(ResultCodes.ERROR_UNHANDLED_EXCEPTION).setMessage(e.getMessage()).setOutput(false).make();
		}

	}

	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_setContext(String value) throws ToolNotSetException {
		try {
			System.out.println("Context Switching to: " + value);
			
			if(value.contains("NATIVE")) {
				Finder.findAppiumDriver().context("NATIVE_APP");
			}else {
				Set<String> contexts = Finder.findAppiumDriver().getContextHandles();
				for (String context : contexts) {
					System.out.println("Founded Context: " + context);
					if (context.contains(value)) {
						Finder.findAppiumDriver().context(context);
					}
				}
			}
			
			System.out.println("Context Switched to: " + Finder.findAppiumDriver().getContext());

			return Result.PASS().setOutput(true).make();
		} catch (Exception e) {
			System.out.println("Exception while Context Operation");
			e.printStackTrace();
			return Result.FAIL(ResultCodes.ERROR_UNHANDLED_EXCEPTION).setMessage(e.getMessage()).setOutput(false).make();
		}

	}

	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getAllContext() throws ToolNotSetException {
		try {
			StringBuilder allContext = new StringBuilder();
			Set<String> contexts = Finder.findAppiumDriver().getContextHandles();
			for (String context : contexts) {
				System.out.println("Founded Context: " + context);
				allContext.append(context + " ");
			}

			System.out.println("All Available Context: " + allContext.toString());

			return Result.PASS().setOutput(allContext.toString()).make();

		} catch (Exception e) {
			System.out.println("Exception while Context Operation");
			e.printStackTrace();
			return Result.PASS().setOutput("").setMessage(e.getMessage()).make();
			// return Result.FAIL(ResultCodes.ERROR_UNHANDLED_EXCEPTION).setMessage(e.getMessage()).setOutput(false).make();
		}
	}
}
