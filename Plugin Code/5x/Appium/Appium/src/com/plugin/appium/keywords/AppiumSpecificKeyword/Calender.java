package com.plugin.appium.keywords.AppiumSpecificKeyword;

import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import org.openqa.selenium.WebElement;
import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;

public class Calender implements KeywordLibrary {
    public FunctionResult Method_setMonth(AppiumObject Backward, AppiumObject Forward, String userGiverMonth)
	    throws Exception {
	WebElement forwardEle = null;
	WebElement backwardEle = null;
	int diff = 0;
	List<String> Months = Arrays.asList("January", "February", "March", "April", "May", "June", "July", "August",
		"September", "October", "November", "December");
	int monthIndex = 0;

	for (int i = 1; i <= Months.size(); i++) {
	    if (Months.get(i).toUpperCase().contains(userGiverMonth.toUpperCase())) {
		monthIndex = i;
		System.out.println("contains month at index " + i);
		break;
	    }
	}

	if (monthIndex != 0) {
	    System.out.println("verifying where to press backward or forward ");
	    Calendar calender = Calendar.getInstance();
	    int currentMonthIndex = calender.get(Calendar.MONTH);
	    System.out.println("current month " + currentMonthIndex);
	    if (monthIndex < currentMonthIndex) {
		System.out.println("current month is greater  need to click on backward");
		diff = currentMonthIndex - monthIndex;
	    }

	    if (monthIndex > currentMonthIndex) {
		System.out.println("clicking on forward button  ");

		diff = monthIndex - currentMonthIndex;

		try {
		    forwardEle = Finder.findWebElement(Forward);
		} catch (Exception e) {
		    System.out.println("Exception cought   ");
		    return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
			    .setMessage("object not found ").make();
		}

		if (forwardEle != null) {
		    System.out.println("clicking forward  button  ");
		    for (int i = 0; i < diff; i++) {
			forwardEle.click();
		    }

		} else {
		    return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
			    .setMessage("object not found ").make();
		}

	    } else {
		System.out.println("finding backward  button  ");

		try {
		    backwardEle = Finder.findWebElement(Forward);
		} catch (Exception e) {
		    System.out.println("Exception cought while finding backward button  ");
		    return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
			    .setMessage("object not found ").make();
		}

		if (backwardEle != null) {
		    System.out.println("clicking backward  button  ");
		    for (int i = 0; i < diff; i++) {
			backwardEle.click();
		    }

		} else {
		    return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
			    .setMessage("object not found ").make();
		}

	    }

	} else {

	    return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
		    .setMessage("wrong month value provided").make();
	}

	return Result.PASS().setOutput(true).make();
    }
}
