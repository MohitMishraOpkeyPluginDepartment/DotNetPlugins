package com.plugin.appium.pagesource;

import java.io.IOException;
import java.util.List;
import org.openqa.selenium.WebDriverException;
import org.w3c.dom.Document;
import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInHybridApplication;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.util.Checkpoint;

public class PagesourceKeywords implements KeywordLibrary {
@NotSupportedInHybridApplication
    public FunctionResult Method_clickOnScreenText(AppiumObject object, int index) throws Exception {
	return new Checkpoint() {

	    @Override
	    public FunctionResult _innerRun()
		    throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
		    ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

		String pageSource = PagesourceUtil.getPageSource();
		Document doc = PagesourceUtil.convertStringToDocument(pageSource);
		if (doc != null) {
		    if (doc.hasChildNodes()) {
			PagesourceUtil.addElementsInList(doc.getChildNodes());
		    }
		}
		if (PagesourceUtil.getArrayOfElements().size() > 0) {

		}

		List<PagesourceElement> listOfElemnts = PagesourceUtil.ElementFinder(object);

		if (listOfElemnts != null && listOfElemnts.size() == 1) {
		    String bounds = listOfElemnts.get(0).getBounds();
		    // click here
		    return Result.PASS().setOutput(true).make();
		}

		if (listOfElemnts != null) {
		    if (listOfElemnts.size() != 0 || listOfElemnts.size() > 1) {
			String bounds = listOfElemnts.get(index).getBounds();
			// click here
			return Result.PASS().setOutput(true).make();
		    }

		}

		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Object not found")
			.make();

	    }
	}.run();
    }





}
