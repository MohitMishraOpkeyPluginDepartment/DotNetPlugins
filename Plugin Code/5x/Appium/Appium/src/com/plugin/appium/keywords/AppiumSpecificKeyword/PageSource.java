package com.plugin.appium.keywords.AppiumSpecificKeyword;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.Finder;

public class PageSource implements KeywordLibrary {

    public FunctionResult Method_getPageSource() throws Exception {
	String pagesource = null;
	try {
	    pagesource = Finder.findAppiumDriver().getPageSource();
	} catch (Exception e) {
	    System.out.println("##<< exception in getting pagesource " + e.getMessage());
	}

	if (pagesource != null) {
	    return Result.PASS().setOutput(pagesource).setResultCode(ResultCodes.SUCCESS.Code()).make();
	} else {
	    return Result.FAIL(ResultCodes.ERROR_USER_ASSERTED_FAILURE).setMessage("Unable to take screenshot")
		    .setOutput("").make();
	}
    }

}
