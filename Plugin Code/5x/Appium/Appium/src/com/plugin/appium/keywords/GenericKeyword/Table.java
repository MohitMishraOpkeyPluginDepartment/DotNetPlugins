package com.plugin.appium.keywords.GenericKeyword;

import java.awt.Robot;
import java.awt.event.KeyEvent;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import com.crestech.opkey.plugin.ExecutionStatus;
import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.plugin.appium.AppiumDispatcher;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.Validations;
import com.plugin.appium.annotations.keywordValidation.KeywordActionType;
import com.plugin.appium.annotations.keywordValidation.KeywordArgumentValidation;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInApplicationMode;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInHybridApplication;
import com.plugin.appium.annotations.keywordValidation.NotSupportedInNativeApplication;
import com.plugin.appium.enums.ActionType;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.GenericKeyword.modTableAdapter.WebTableAdapter;
import com.plugin.appium.keywords.GenericKeyword.tableAdapter.AppAndWebTableAdapter;
import com.plugin.appium.util.Checkpoint;

public class Table implements KeywordLibrary {

	private AppAndWebTableAdapter appAndWebTableAdapter;
	private WebTableAdapter webTable;
	private WebObjects webobjects = new WebObjects();
	private static boolean isCompleteTableCellText = false;
	private String message = "Not able to find unique cell object by given data arguments. This mostly happpens when invalid <Header,value> pair is provided.";

	// Assuming that table coloum is defined under tabel rows and start with
	// index 0

	/**
	 * @throws Exception
	 * @throws MethodOnlyWorkingWithWebViewMode
	 * 
	 * 
	 * 
	 * 
	 */

	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1 })
	@NotSupportedInHybridApplication
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_TableGetTextRow(AppiumObject object, int colId, String expectedText) throws Exception {

		int foundAtRow;

		WebElement table = Finder.findWebElementUsingCheckPoint(object);

		appAndWebTableAdapter = new AppAndWebTableAdapter(table, object);

		int rowLastIndex = appAndWebTableAdapter.getRowCount();
		String tempCelltext = "";

		for (int rowInd = 0; rowInd < rowLastIndex; rowInd++) {

			String cellText = appAndWebTableAdapter.getCellData(rowInd, colId);
			if (Utils.allignText(cellText).contentEquals(Utils.allignText(expectedText))) {
				foundAtRow = rowInd;
				return Result.PASS().setOutput(foundAtRow).make();
			}
			tempCelltext = tempCelltext + cellText + Utils.getDelimiter();
		}

		return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND)
				.setMessage(ReturnMessages.verificationFailed(tempCelltext, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(1).getValue())).make();
	}

	/**
	 * @throws Exception
	 * @throws MethodOnlyWorkingWithWebViewMode
	 * 
	 * 
	 * 
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0, 2 }, checkDataForWhiteSpace = { 0, 1, 2 })
	@NotSupportedInHybridApplication
	public FunctionResult Method_verifyTableColumnNumber(AppiumObject object, int rowId, String expectedText, int expextedColNo) throws Exception {

		WebElement table = Finder.findWebElementUsingCheckPoint(object);
		appAndWebTableAdapter = new AppAndWebTableAdapter(table, object);

		int lastColumnInd = appAndWebTableAdapter.getColumnCount(rowId);
		int matchedAtInd = -1;

		String tempCellText = "";
		for (int colInd = 0; colInd < lastColumnInd; colInd++) {

			String cellText = appAndWebTableAdapter.getCellData(rowId, colInd);
			if (Utils.allignText(cellText).contentEquals(Utils.allignText(expectedText))) {

				matchedAtInd = colInd;
				if (expextedColNo == matchedAtInd) {

					return Result.PASS().make();
				}

				tempCellText = tempCellText + cellText + Utils.getDelimiter();
			}
		}

		if (matchedAtInd < 0) {
			return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND)
					.setMessage(ReturnMessages.verificationFailed(tempCellText, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(1).getValue())).make();
		}

		return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED)
				.setMessage(ReturnMessages.verificationFailed(matchedAtInd, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(2).getValue())).make();

	}

	/**
	 * @throws Exception
	 * @throws MethodOnlyWorkingWithWebViewMode
	 * 
	 * 
	 * 
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1, 2, 3, 4 }, checkDataForWhiteSpace = { 0, 1, 2, 3, 4 })
	@NotSupportedInHybridApplication
	public FunctionResult Method_clickTableCellAndWait(AppiumObject object, int rowId, int colId, String webelementTag, int indx, int timeInSecs) throws Exception {

		FunctionResult fr = Method_clickTableCell(object, rowId, colId, webelementTag, indx);
		if (fr.getStatus().contentEquals(ExecutionStatus.Pass.toString())) {
			Utils.waitUntill(timeInSecs);
		}
		return fr;
	}

	/**
	 * @throws Exception
	 * @throws MethodOnlyWorkingWithWebViewMode
	 * 
	 * 
	 * 
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0, 1 })
	@NotSupportedInHybridApplication
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_TableGetTextColumn(AppiumObject object, int rowId, String expectedText) throws Exception {

		WebElement table = Finder.findWebElementUsingCheckPoint(object);
		appAndWebTableAdapter = new AppAndWebTableAdapter(table, object);
		String tempCellText = "";
		int lastColIndex = appAndWebTableAdapter.getColumnCount(rowId);

		for (int colInd = 0; colInd < lastColIndex; colInd++) {

			String cellText = appAndWebTableAdapter.getCellData(rowId, colInd);
			expectedText = Utils.allignText(expectedText);

			if (Utils.allignText(cellText).contentEquals(expectedText)) {
				return Result.PASS().setOutput(colInd).make();
			}
			tempCellText = tempCellText + cellText + Utils.getDelimiter();
		}
		return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND)
				.setMessage(ReturnMessages.verificationFailed(tempCellText, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(1).getValue())).make();
	}

	/**
	 * @throws Exception
	 * @throws MethodOnlyWorkingWithWebViewMode
	 * 
	 * 
	 * 
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1 })
	@NotSupportedInApplicationMode
	public FunctionResult Method_clickLinkInTableCell(AppiumObject object, int rowId, int colId) throws Exception {

		WebElement table = Finder.findWebElementUsingCheckPoint(object);
		appAndWebTableAdapter = new AppAndWebTableAdapter(table, object);
		int childItemCount = appAndWebTableAdapter.childItemCount(rowId, colId, "a");
		WebElement linkAt0thIndex;
		if (childItemCount > 0) {
			linkAt0thIndex = appAndWebTableAdapter.childItem(rowId, colId, "a", 0);
			linkAt0thIndex.click();
			return Result.PASS().setOutput(true).make();
		}

		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage("No Link found in the Table Cell").make();

	}

	/**
	 * @throws Exception
	 * @throws MethodOnlyWorkingWithWebViewMode
	 * 
	 * 
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0, 2 }, checkDataForWhiteSpace = { 0, 1, 2 })
	@NotSupportedInHybridApplication
	public FunctionResult Method_verifyTableRowNumber(AppiumObject object, int colId, String expectedText, int expextedRowNo) throws Exception {

		int matchedAtInd = -1;
		WebElement table = Finder.findWebElementUsingCheckPoint(object);
		appAndWebTableAdapter = new AppAndWebTableAdapter(table, object);
		int rowLastIndex = appAndWebTableAdapter.getRowCount();
		String tempCellText = "";

		for (int rowInd = 0; rowInd < rowLastIndex; rowInd++) {

			String cellText = appAndWebTableAdapter.getCellData(rowInd, colId);

			if (Utils.allignText(cellText).contentEquals(Utils.allignText(expectedText))) {
				matchedAtInd = rowInd;
				if (matchedAtInd == expextedRowNo)
					return Result.PASS().make();
			}
			tempCellText = tempCellText + cellText + Utils.getDelimiter();
		}

		if (matchedAtInd < 0) {
			return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND)
					.setMessage(ReturnMessages.verificationFailed(tempCellText, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(1).getValue())).make();
		}
		return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED)
				.setMessage(ReturnMessages.verificationFailed(matchedAtInd, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(2).getValue())).make();
	}

	/**
	 * @throws Exception
	 * @throws MethodOnlyWorkingWithWebViewMode
	 * 
	 * 
	 * 
	 * 
	 */

	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1, 2 })
	@NotSupportedInHybridApplication
	public FunctionResult Method_verifyTextInTable(AppiumObject object, int rowId, int colId, String expectedText) throws Exception {

		WebElement table = Finder.findWebElementUsingCheckPoint(object);
		String cellText = null;
		appAndWebTableAdapter = new AppAndWebTableAdapter(table, object);
		int rowLastInd = appAndWebTableAdapter.getRowCount();
		String tempCellText = "";

		for (int rowInd = 0; rowInd < rowLastInd; rowInd++) {

			int colLastInd = appAndWebTableAdapter.getColumnCount(rowInd);
			for (int colInd = 0; colInd < colLastInd; colInd++) {

				cellText = Utils.allignText(appAndWebTableAdapter.getCellData(rowInd, colInd));
				if (cellText.contentEquals(Utils.allignText(expectedText))) {

					return Result.PASS().setMessage(ReturnMessages.VERFIYED.toString()).make();
				}
				tempCellText = tempCellText + cellText + Utils.getDelimiter();
			}
		}

		return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED)
				.setMessage(ReturnMessages.verificationFailed(tempCellText, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(2).getValue())).make();

	}

	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1, 2 })
	@NotSupportedInHybridApplication
	public FunctionResult Method_verifyTextInTable(AppiumObject object, int rowId, int colId, String expectedText, String before, String after) throws Exception {

		WebElement table = Finder.findWebElementUsingCheckPoint(object);
		String cellText = null;
		appAndWebTableAdapter = new AppAndWebTableAdapter(table, object);
		int rowLastInd = appAndWebTableAdapter.getRowCount();
		String tempCellText = "";

		for (int rowInd = 0; rowInd < rowLastInd; rowInd++) {

			int colLastInd = appAndWebTableAdapter.getColumnCount(rowInd);
			for (int colInd = 0; colInd < colLastInd; colInd++) {

				cellText = Utils.allignText(appAndWebTableAdapter.getCellData(rowInd, colInd));
				cellText = new UnCategorised().TrimString(cellText, before, after);
				String msg = "";
				String output = "";

				if (cellText.contains("@#@")) {
					output = "";
					msg = cellText.substring(3, cellText.length());
				} else
					output = cellText;
				if (output.contentEquals(Utils.allignText(expectedText))) {

					return Result.PASS().setMessage(ReturnMessages.VERFIYED.toString()).make();
				}
				tempCellText = tempCellText + output + Utils.getDelimiter();
			}
		}

		return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED)
				.setMessage(ReturnMessages.verificationFailed(tempCellText, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(2).getValue())).make();

	}

	/**
	 * @throws Exception
	 * @throws MethodOnlyWorkingWithWebViewMode
	 * 
	 * 
	 * 
	 * 
	 */

	@NotSupportedInHybridApplication
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getFullTableText(AppiumObject object) throws Exception {

		WebElement table = Finder.findWebElementUsingCheckPoint(object);
		String cellText = null;
		appAndWebTableAdapter = new AppAndWebTableAdapter(table, object);
		int rowLastInd = appAndWebTableAdapter.getRowCount();
		String tempCellText = "";

		for (int rowInd = 0; rowInd < rowLastInd; rowInd++) {

			int colLastInd = appAndWebTableAdapter.getColumnCount(rowInd);
			for (int colInd = 0; colInd < colLastInd; colInd++) {

				cellText = Utils.allignText(appAndWebTableAdapter.getCellData(rowInd, colInd));
				tempCellText = tempCellText + cellText + Utils.getDelimiter();
			}
		}
		return Result.PASS().setOutput(tempCellText).make();
	}

	/**
	 * @throws Exception
	 * @throws MethodOnlyWorkingWithWebViewMode
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInHybridApplication
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0, 1 })
	public FunctionResult Method_verifyTableRowText(AppiumObject object, int colId, String expectedText) throws Exception {

		WebElement table = Finder.findWebElementUsingCheckPoint(object);

		appAndWebTableAdapter = new AppAndWebTableAdapter(table, object);
		int lastRowInd = appAndWebTableAdapter.getRowCount();
		String cellText = "", tempRowText = "";

		for (int rowInd = 0; rowInd < lastRowInd; rowInd++) {

			cellText = appAndWebTableAdapter.getCellData(rowInd, colId);
			if (Utils.allignText(cellText).contentEquals(Utils.allignText(expectedText))) {

				return Result.PASS().setMessage(expectedText + " found at row " + rowInd).make();
			}
			tempRowText = tempRowText + cellText + Utils.getDelimiter();
		}

		return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED)
				.setMessage(ReturnMessages.verificationFailed(tempRowText, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(1).getValue())).make();
	}

	/**
	 * @throws Exception
	 * @throws MethodOnlyWorkingWithWebViewMode
	 * 
	 * 
	 * 
	 * 
	 */
	@KeywordArgumentValidation(checkDataForWhiteSpace = { 0 })
	@NotSupportedInApplicationMode
	public FunctionResult Method_verifyTableColumnHeader(AppiumObject object, String expectedColumnHeader) throws Exception {

		WebElement table = Finder.findWebElementUsingCheckPoint(object);
		appAndWebTableAdapter = new AppAndWebTableAdapter(table, object);
		int lastColumnHeader = appAndWebTableAdapter.getColumnCount(0);
		String cellText = "", tempCellText = "";

		for (int colHeadInd = 0; colHeadInd < lastColumnHeader; colHeadInd++) {

			cellText = appAndWebTableAdapter.getCellData(0, colHeadInd);
			if (Utils.allignText(cellText).contentEquals(Utils.allignText(expectedColumnHeader))) {

				return Result.PASS().setMessage("Found At Column : " + colHeadInd).make();
			}
			tempCellText = tempCellText + cellText + Utils.getDelimiter();
		}

		return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED)
				.setMessage(ReturnMessages.verificationFailed(tempCellText, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue())).make();

	}

	/**
	 * @throws Exception
	 * @throws MethodOnlyWorkingWithWebViewMode
	 * 
	 * 
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1, 2, 3 }, checkDataForWhiteSpace = { 0, 1, 2, 3 })
	@NotSupportedInHybridApplication
	public FunctionResult Method_clickTableCell(AppiumObject object, int rowId, int colId, String webelementTag, int indx) throws Exception {

		WebElement table = Finder.findWebElementUsingCheckPoint(object);
		appAndWebTableAdapter = new AppAndWebTableAdapter(table, object);
		if (appAndWebTableAdapter.childItemCount(rowId, colId, webelementTag) > 0) {
			appAndWebTableAdapter.childItem(rowId, colId, webelementTag, indx).click();
			return Result.PASS().make();
		}

		return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setMessage("No Object of type " + webelementTag + " found in the Table Cell").make();
	}

	/**
	 * @throws Exception
	 * @throws MethodOnlyWorkingWithWebViewMode
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInHybridApplication
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0, 1 })
	public FunctionResult Method_verifyTableColumnText(AppiumObject object, int rowId, String expectedText) throws Exception {

		WebElement table = Finder.findWebElementUsingCheckPoint(object);

		appAndWebTableAdapter = new AppAndWebTableAdapter(table, object);
		int lastColInd = appAndWebTableAdapter.getColumnCount(rowId);
		String cellText = "", tempCellText = "";

		for (int colInd = 0; colInd < lastColInd; colInd++) {

			cellText = appAndWebTableAdapter.getCellData(rowId, colInd);
			if (Utils.allignText(cellText).contentEquals(Utils.allignText((expectedText)))) {

				return Result.PASS().make();
			}
			tempCellText = tempCellText + cellText + Utils.getDelimiter();
		}

		return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED)
				.setMessage(ReturnMessages.verificationFailed(tempCellText, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(1).getValue())).make();
	}

	/**
	 * @throws Exception
	 * @throws MethodOnlyWorkingWithWebViewMode
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInHybridApplication
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1 })
	public FunctionResult Method_clickButtonInTableCell(AppiumObject object, int rowId, int colId) throws Exception {

		WebElement table = Finder.findWebElementUsingCheckPoint(object);
		appAndWebTableAdapter = new AppAndWebTableAdapter(table, object);

		if (appAndWebTableAdapter.childItemCount(rowId, colId, "input") > 0) {
			appAndWebTableAdapter.childItem(rowId, colId, "input", 0).click();
			return Result.PASS().make();
		}

		return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setMessage("No Object of button type  found in the Table Cell").make();
	}

	/**
	 * @throws Exception
	 * @CheckPoint True
	 * 
	 * 
	 * 
	 */
	public FunctionResult Method_clickButtonInTableCell(AppiumObject object, int rowId, int colId, int index) throws Exception {
		Validations.checkDataForNegative(0, 1, 2);
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				webTable = new WebTableAdapter(table);
				WebElement element = null;
				if (webTable.childItemCount(rowId, colId, "button") > 0) {
					try {
						element = webTable.childItem(table, rowId, colId, "button", index);
					} catch (ArrayIndexOutOfBoundsException ex) {
						element = webTable.childItem(table, rowId, colId, "input", index);
					}
				} else if (webTable.childItemCount(rowId, colId, "input") > 0) {
					element = webTable.childItem(table, rowId, colId, "input", index);
				} else {
					return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setMessage("No Object of button type  found in the Table Cell").make();
				}
				if (AppiumDispatcher.lastChance) {
					return webobjects.Method_clickUsingJavaScript(element);
				} else {
					element.click();
				}
				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	/**
	 * @throws Exception
	 * @throws MethodOnlyWorkingWithWebViewMode
	 * 
	 * 
	 * 
	 * 
	 */
	@NotSupportedInHybridApplication
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1 })
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_GetCellText(AppiumObject object, int rowId, int colId) throws Exception {

		WebElement table = Finder.findWebElementUsingCheckPoint(object);
		appAndWebTableAdapter = new AppAndWebTableAdapter(table, object);
		String cellText = appAndWebTableAdapter.getCellData(rowId, colId);
		return Result.PASS().setOutput(cellText).make();

	}

	@NotSupportedInHybridApplication
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1 })
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_GetCellText(AppiumObject object, int rowId, int colId, String before, String after) throws Exception {

		WebElement table = Finder.findWebElementUsingCheckPoint(object);
		appAndWebTableAdapter = new AppAndWebTableAdapter(table, object);
		String cellText = appAndWebTableAdapter.getCellData(rowId, colId);
		cellText = new UnCategorised().TrimString(cellText, before, after);
		String msg = "";
		String output = "";

		if (cellText.contains("@#@")) {
			output = "";
			msg = cellText.substring(3, cellText.length());
		} else
			output = cellText;
		return Result.PASS().setOutput(output).setMessage(msg).make();

	}

	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getTableRowCount(AppiumObject object) throws Exception {

		WebElement tableElement = Finder.findWebElementUsingCheckPoint(object);
		int rowCount = new AppAndWebTableAdapter(tableElement, object).getRowCount();
		return Result.PASS().setOutput(rowCount - 1).make();
	}

	public FunctionResult Method_getTableColCount(AppiumObject object, int rowNumber) throws Exception {

		WebElement tableElement = Finder.findWebElementUsingCheckPoint(object);
		int colCount = new AppAndWebTableAdapter(tableElement, object).getColumnCount(rowNumber);
		return Result.PASS().setOutput(colCount - 1).make();
	}

	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getSingleRowText(AppiumObject object, int rowIndex, String Odelimeter) throws Exception {
		try {
			Validations.checkDataForBlank(1);
		} catch (Exception e) {
			Odelimeter = Utils.getDelimiter();
		}

		Validations.checkDataForNegative(0);
		String delimeter = Odelimeter;
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				AppiumDispatcher.isGetKeyword = true;
				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				String text = "", cellText = "";
				webTable = new WebTableAdapter(table);
				for (int i = 0; i < webTable.getColumnCount(rowIndex); i++) {
					cellText = webTable.getCellData(rowIndex, i);
					cellText = Utils.removeSpecialCharacter(cellText);
					text = text + cellText + delimeter;
				}
				text = Utils.removeLastChar(text);
				new Utils().checkGetKeywordsOutput(text);
				return Result.PASS().setOutput(text).make();
			}
		}.run();
	}

	@KeywordArgumentValidation(checkDataForBlank = { 0, 2, 3 }, checkDataForWhiteSpace = { 0, 2, 3 })
	public FunctionResult Method_clickInTableCellByQuery(AppiumObject object, String cellName, int OobjectIndex, String header1, String value1, String header2, String value2, String header3,
			String value3, String header4, String value4, String header5, String value5) throws Exception {

		try {
			Validations.checkDataForBlank(1);
		} catch (Exception ex) {
			OobjectIndex = 0;
		}
		Validations.checkDataForNegative(1);
		new Utils().ValidateHeaderAndValues(4, 5, 6, 7, 8, 9, 10, 11);
		int objectIndex = OobjectIndex;

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = Finder.findWebElement(object);
				/*
				 * if (!new Utils().isElementTable(table)) return
				 * Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).
				 * setMessage("Specified object is not table").make();
				 */
				return Method_clickInTableCellByQueryHelper(table, cellName, 0, "", objectIndex, header1, value1, header2, value2, header3, value3, header4, value4, header5, value5, false);
			}
		}.run();
	}

	public FunctionResult Method_clickInTableCellByQueryHelper(WebElement table, String cellName, int headerIndex, String objectTagName, int objectIndex, String header1, String value1, String header2,
			String value2, String header3, String value3, String header4, String value4, String header5, String value5, boolean isSalesForce)
			throws ToolNotSetException, ArgumentDataInvalidException, ObjectNotFoundException, InterruptedException, ArgumentDataMissingException {

		int count = 0;
		// WebElement table = Finder.findWebElement(object);
		Log.print("TagName: " + table.getTagName());
		webTable = new WebTableAdapter(table);
		List<WebElement> ele = webTable.getElementByQuery(table, cellName, headerIndex, header1, value1, header2, value2, header3, value3, header4, value4, header5, value5, isSalesForce);
		for (WebElement webElement : ele) {
			Log.print("foundCell is" + webElement.getText());
		}
		WebElement element = null;
		String elementXpath = "";
		if (objectTagName.isEmpty()) {
			elementXpath = ".//*";
		} else {
			elementXpath = ".//" + objectTagName.trim();
		}
		try {
			objectIndex = objectIndex + 1;
			if (objectIndex == 1 && ele.get(0).findElements(By.xpath(elementXpath)).size() == 0)
				element = ele.get(0);
			else
				element = ele.get(0).findElement(By.xpath("(" + elementXpath + ")[" + objectIndex + "]"));
		} catch (IndexOutOfBoundsException ex) {
			count++;
			if (count < 2) {
				Thread.sleep(2000);
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Not able to find object.").make();
			} else
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage(message).make();
		} catch (NoSuchElementException e) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Index is invalid").make();
		}
		new Utils().scrollMid(element);
		if (AppiumDispatcher.lastChance) {
			return webobjects.Method_clickUsingJavaScript(element);
		} else {
			element.click();
		}
		return Result.PASS().setOutput(true).make();
	}

	/**
	 * @CheckPoint True
	 * 
	 */
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getCompleteTableText(AppiumObject object) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebTableAdapter webTable;
				AppiumDispatcher.isGetKeyword = true;
				isCompleteTableCellText = true;
				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				String cellText = null;
				webTable = new WebTableAdapter(table);
				int rowLastInd = webTable.getRowCount();
				String tempCellText = "";
				for (int rowInd = 0; rowInd < rowLastInd; rowInd++) {
					int colLastInd = webTable.getColumnCount(rowInd);
					for (int colInd = 0; colInd < colLastInd; colInd++) {
						cellText = Utils.allignText(webTable.getCellData(rowInd, colInd));
						tempCellText = tempCellText + cellText + Utils.getDelimiter();
					}
				}
				new Utils().checkGetKeywordsOutput(tempCellText);
				return Result.PASS().setOutput(tempCellText).make();
			}
		}.run();
	}

	/**
	 * @CheckPoint True
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1 })
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getSelectedDropDownInTableCell(AppiumObject object, int rowId, int colId, int indx) throws Exception {
		Validations.checkDataForBlank(0, 1);

		Validations.checkDataForNegative(0, 1, 2);
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				AppiumDispatcher.isGetKeyword = true;
				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				webTable = new WebTableAdapter(table);
				if (webTable.childItemCount(rowId, colId, "select") > 0) {
					WebElement element = webTable.childItem(table, rowId, colId, "select", indx);
					Select select = new Select(element);
					List<WebElement> selectedOption = select.getAllSelectedOptions();
					String retValue;
					retValue = selectedOption.get(0).getText();
					for (int counter = 1; counter < selectedOption.size(); counter++)
						retValue = retValue + ";" + selectedOption.get(counter).getText();
					new Utils().checkGetKeywordsOutput(retValue);
					return Result.PASS().setOutput(retValue).make();
				}
				return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setMessage("No Object of type " + "select" + " found in the Table Cell").make();

			}
		}.run();
	}

	/**
	 * @CheckPoint True
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getSingleColText(AppiumObject object, int columnIndex, String Odelimeter) throws Exception {

		try {
			Validations.checkDataForBlank(1);
		} catch (Exception e) {
			Odelimeter = Utils.getDelimiter();
		}
		Validations.checkDataForNegative(0);
		String delimeter = Odelimeter;
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				AppiumDispatcher.isGetKeyword = true;
				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				String text = "", cellText = "";
				webTable = new WebTableAdapter(table);
				for (int i = 0; i < webTable.getRowCount(); i++) {
					cellText = webTable.getCellData(i, columnIndex);
					cellText = Utils.removeSpecialCharacter(cellText);
					text = text + cellText + delimeter;
				}
				text = Utils.removeLastChar(text);
				new Utils().checkGetKeywordsOutput(text);
				return Result.PASS().setOutput(text).make();
			}
		}.run();
	}

	/**
	 * @CheckPoint True
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1, 2, 3 }, checkDataForWhiteSpace = { 0, 1, 3 })
	public FunctionResult Method_selectMultipleDropdownItemInTableCell(AppiumObject object, int rowId, int colId, int indx, String value) throws Exception {

		Validations.checkDataForNegative(0, 1, 2);
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				// Select selectData = new Select(table);

				webTable = new WebTableAdapter(table);
				if (webTable.childItemCount(rowId, colId, "select") > 0) {
					WebElement element = webTable.childItem(table, rowId, colId, "select", indx);
					try {
						String[] values = value.split(";");
						System.out.println("********" + Arrays.toString(values));
						List<WebElement> option = element.findElements(By.tagName("option"));
						for (int i = 0; i < values.length; i++) {
							boolean match = false;
							try {

								for (WebElement webElement : option) {

									if (webElement.getText().equalsIgnoreCase(values[i])) {
										match = true;
										Finder.findJavaScriptExecuterDriver().executeScript("arguments[0].selected=true;", webElement);
										break;
									}

								}
								if (!match) {
									return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setMessage("Text <" + values[i] + "> is not present in dropdown").setOutput(false).make();
								}

							} catch (Exception e) {
								return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID)
										.setMessage("Text <" + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(3).getValue() + "> is not present in dropdown")
										.setOutput(false).make();
							}
						}
						return Result.PASS().setOutput(true).make();
					} finally {
						new Robot().keyRelease(KeyEvent.VK_CONTROL);
					}
				}
				return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setOutput(false).setMessage("Dropdown is not present in the specidied cell").make();
			}
		}.run();
	}

	/**
	 * @CheckPoint True
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1, 3 }, checkDataForWhiteSpace = { 0, 1, 3 })
	public FunctionResult Method_deSelectMultipleDropDownItemInTableCell(AppiumObject object, int rowId, int colId, int indx, String userExpText) throws Exception {

		Validations.checkDataForNegative(0, 1, 2);
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				webTable = new WebTableAdapter(table);
				if (webTable.childItemCount(rowId, colId, "select") > 0) {
					WebElement element = webTable.childItem(table, rowId, colId, "select", indx);
					try {
						Select selectData = new Select(element);
						String[] values = userExpText.split(";");
						for (int i = 0; i < values.length; i++) {
							try {
								selectData.deselectByVisibleText(values[i]);
							} catch (Exception e) {
								return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID)
										.setMessage("Text <" + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(3).getValue() + "> is not present in dropdown")
										.setOutput(false).make();
							}
						}
						return Result.PASS().setOutput(true).make();
					} finally {
						new Robot().keyRelease(KeyEvent.VK_CONTROL);
					}
				}
				return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setOutput(false).setMessage("Dropdown is not present in the specidied cell").make();

			}
		}.run();
	}

	/**
	 * @CheckPoint True
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_verifyTableRowCount(AppiumObject object, int count) throws Exception {
		Validations.checkDataForNegative(0);
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				FunctionResult fr = Method_getTableRowCount(object);
				int rowCount = Integer.parseInt(fr.getOutput());
				if (rowCount == count) {
					return Result.PASS().setOutput(true).make();
				} else {
					AppiumDispatcher.isGetKeyword = false;
					return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
							.setMessage(Utils.verification_failed("" + rowCount, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue())).make();
				}
			}
		}.run();
	}

	/**
	 * @CheckPoint True
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1 })
	public FunctionResult Method_verifyTableColumnCount(AppiumObject object, int rowNumber, int count) throws Exception {
		Validations.checkDataForBlank(0, 1);
		Validations.checkDataForNegative(0, 1);
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				FunctionResult fr;
				int colCount = 0;
				try {
					fr = Method_getTableColCount(object, rowNumber);
					colCount = Integer.parseInt(fr.getOutput());
				} catch (Exception e) {
					System.out.println(e.getMessage());
					AppiumDispatcher.isGetKeyword = false;
					throw e;
				}

				if (colCount == count) {
					return Result.PASS().setOutput(true).make();
				} else {
					AppiumDispatcher.isGetKeyword = false;
					return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
							.setMessage(Utils.verification_failed("" + colCount, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(1).getValue())).make();
				}
			}
		}.run();
	}

	/**
	 * @CheckPoint True
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	public FunctionResult Method_verifyFullTableText(AppiumObject object, String Text) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				FunctionResult fr = null;
				if (isCompleteTableCellText) {
					fr = Method_getCompleteTableText(object);
				} else {
					fr = Method_getFullTableText(object);
				}
				String actual = fr.getOutput();
				if (fr.getOutput().equals(Text)) {
					return Result.PASS().setOutput(true).make();
				} else {
					AppiumDispatcher.isGetKeyword = false;
					return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND).setOutput(false)
							.setMessage(Utils.verification_failed(actual, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue())).make();
				}

			}
		}.run();
	}

	/**
	 * @CheckPoint True
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0 }, checkDataForWhiteSpace = { 0 })
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getTableColumnHeader(AppiumObject object, int colID) throws Exception {
		Validations.checkDataForNegative(0);
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				AppiumDispatcher.isGetKeyword = true;
				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				webTable = new WebTableAdapter(table);
				int lastColumnHeader = webTable.getColumnCount(0);
				String cellText = "", tempCellText = "";
				for (int colHeadInd = 0; colHeadInd < lastColumnHeader; colHeadInd++) {
					tempCellText = webTable.getCellData(0, colHeadInd);
					if (colHeadInd == colID) {
						cellText = tempCellText;
					}
				}
				new Utils().checkGetKeywordsOutput(cellText);
				return Result.PASS().setOutput(cellText).make();

			}
		}.run();
	}

	@KeywordArgumentValidation(checkDataForBlank = { 0, 3, 4 }, checkDataForWhiteSpace = { 0, 3, 4 })
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getTextFromTableCellByQuery(AppiumObject object, String cellName, int OheaderIndex, int OobjectIndex, String header1, String value1, String header2, String value2,
			String header3, String value3, String header4, String value4, String header5, String value5) throws Exception {

		try {
			Validations.checkDataForBlank(1);
		} catch (Exception e) {
			OheaderIndex = 0;
		}

		try {
			Validations.checkDataForBlank(2);
		} catch (Exception e) {
			OobjectIndex = 0;
		}

		Validations.checkDataForNegative(1);
		new Utils().ValidateHeaderAndValues(5, 6, 7, 8, 9, 10, 11, 12);
		int objectIndex = OobjectIndex;
		int headerIndex = OheaderIndex;
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				AppiumDispatcher.isGetKeyword = true;
				WebElement table = Finder.findWebElement(object);
				/*
				 * if (!new Utils().isElementTable(table)) return
				 * Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).
				 * setMessage("Specified object is not table").make();
				 */
				return Method_getTextFromTableCellByQueryHelper(table, cellName, headerIndex, objectIndex, header1, value1, header2, value2, header3, value3, header4, value4, header5, value5, false);

			}
		}.run();
	}

	public FunctionResult Method_getTextFromTableCellByQueryHelper(WebElement table, String cellName, int headerIndex, int objectIndex, String header1, String value1, String header2, String value2,
			String header3, String value3, String header4, String value4, String header5, String value5, boolean isSalesForce)
			throws ToolNotSetException, ArgumentDataInvalidException, ObjectNotFoundException, InterruptedException, ArgumentDataMissingException {
		int count = 0;
		// WebElement table = Finder.findWebElement(object);
		webTable = new WebTableAdapter(table);
		List<WebElement> ele = webTable.getElementByQuery(table, cellName, headerIndex, header1, value1, header2, value2, header3, value3, header4, value4, header5, value5, isSalesForce);
		for (WebElement webElement : ele) {
			Log.print(webElement.getText());
		}
		WebElement element = null;
		try {
			if (objectIndex != 0) {
				objectIndex = objectIndex + 1;
				element = ele.get(0).findElement(By.xpath("./*[" + objectIndex + "]"));
			} else {
				element = ele.get(0);
			}
		} catch (IndexOutOfBoundsException ex) {
			count++;
			if (count < 2) {
				Thread.sleep(2000);
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Not able to find object.").make();
			} else
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage(message).make();
		} catch (NoSuchElementException e) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Index is invalid").make();
		}
		new Utils().scrollMid(element);
		return Utils.shadow_getObjectTextByJsoup(element);
	}

	/**
	 **
	 * @CheckPoint True
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1, 2, 4 }, checkDataForWhiteSpace = { 0, 1, 2, 4 })
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_fetchObjectPropertyInTableCell(AppiumObject object, int rowId, int colId, String tag, int indx, String property) throws Exception {
		Validations.checkDataForNegative(0, 1, 3);
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				webTable = new WebTableAdapter(table);
				if (webTable.childItemCount(rowId, colId, tag) > 0) {
					if (property.equals("")) {
						return Result.PASS().setOutput("").setMessage("Property Not Set").make();
					} else {
						WebElement element = webTable.childItem(table, rowId, colId, tag, indx);
						String str = element.getAttribute(property);
						if (str == " ") {
							Log.print("No Such Property");
							return Result.PASS().setOutput(str).setMessage("No Such Property Exists").make();
						} else {
							return Result.PASS().setOutput(str).make();
						}
					}

				}
				return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION)
						.setMessage("No Object of type " + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(2).getValue() + " found in the Table Cell").make();
			}
		}.run();
	}

	/**
	 * @CheckPoint True
	 * 
	 */
	@NotSupportedInApplicationMode
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1, 3 }, checkDataForWhiteSpace = { 0, 1, 3 })
	public FunctionResult Method_verifyCheckboxStatusInTableCell(AppiumObject object, int rowId, int colId, int indx, String Ostatus) throws Exception {

		Validations.checkDataForNegative(0, 1, 2);
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				webTable = new WebTableAdapter(table);
				String status = Ostatus.toUpperCase();
				boolean bstatus;
				if (status.equals("ON")) {
					bstatus = true;
				} else if (status.equals("OFF")) {
					bstatus = false;
				} else {
					bstatus = false;
					throw new ArgumentDataInvalidException("Unexpected Data Received. Please Provide ON/OFF In Status Column.");
				}
				if (webTable.childItemCount(rowId, colId, "input") > 0) {
					WebElement element = webTable.childItem(table, rowId, colId, "input", indx);
					String chkStatus = "";
					boolean result = Boolean.parseBoolean(element.getAttribute("checked"));
					if (result) {
						chkStatus = "ON";
					} else {
						chkStatus = "OFF";
					}
					if (result == bstatus) {
						return Result.PASS().setOutput(true).make();
					} else {
						AppiumDispatcher.isGetKeyword = false;
						return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
								.setMessage(Utils.verification_failed(chkStatus, Context.current().getFunctionCall().getDataArguments().getDataArgument().get(3).getValue())).make();
					}
				}
				AppiumDispatcher.isGetKeyword = false;
				return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setMessage("No Object of type " + "checkbox" + " found in the Table Cell").make();
			}
		}.run();
	}

	@KeywordArgumentValidation(checkDataForBlank = { 0, 3, 4 }, checkDataForWhiteSpace = { 0, 3, 4 })
	public FunctionResult Method_typeTextInTableCellByQuery(AppiumObject object, String cellName, int OheaderIndex, int OobjectIndex, String header1, String value1, String header2, String value2,
			String header3, String value3, String header4, String value4, String header5, String value5, String text) throws Exception {

		try {
			Validations.checkDataForBlank(1);
		} catch (Exception e) {
			OheaderIndex = 0;
		}

		try {
			Validations.checkDataForBlank(2);
		} catch (Exception e) {
			OobjectIndex = 0;
		}

		Validations.checkDataForNegative(1);
		new Utils().ValidateHeaderAndValues(5, 6, 7, 8, 9, 10, 11, 12);
		int objectIndex = OobjectIndex;
		int headerIndex = OheaderIndex;
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = Finder.findWebElement(object);
				/*
				 * if (!new Utils().isElementTable(table)) return
				 * Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).
				 * setMessage("Specified object is not table").make();
				 */
				return Method_typeTextInTableCellByQueryHelper(table, cellName, headerIndex, objectIndex, header1, value1, header2, value2, header3, value3, header4, value4, header5, value5, text,
						false);

			}
		}.run();
	}

	public FunctionResult Method_typeTextInTableCellByQueryHelper(WebElement table, String cellName, int headerIndex, int objectIndex, String header1, String value1, String header2, String value2,
			String header3, String value3, String header4, String value4, String header5, String value5, String text, boolean isSalesForce) throws Exception {
		int count = 0;
		// WebElement table = Finder.findWebElement(object);
		webTable = new WebTableAdapter(table);
		List<WebElement> eles = webTable.getElementByQuery(table, cellName, headerIndex, header1, value1, header2, value2, header3, value3, header4, value4, header5, value5, isSalesForce);

		if (eles.isEmpty())
			throw new ObjectNotFoundException("Cell Not Found");

		for (WebElement webElement : eles) {
			Log.print(webElement.getText());
		}

		WebElement element = null;
		try {
			if (objectIndex != 0) {
				objectIndex = objectIndex + 1;
				element = eles.get(0).findElement(By.xpath("(.//*[self::input[@type='' or not(@type) or @type='text' or @type='password' or @type='email'] or self::textarea])[" + objectIndex + "]"));
				Log.print(element.getAttribute("outerHTML"));
			} else {
				element = eles.get(0).findElement(By.xpath("(.//*[self::input[@type='' or not(@type) or @type='text' or @type='password' or @type='email'] or self::textarea])"));
			}
		} catch (IndexOutOfBoundsException ex) {
			count++;
			if (count < 2) {
				Thread.sleep(2000);
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Not able to find object.").make();
			} else
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage(message).make();
		} catch (NoSuchElementException e) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Index is invalid").make();
		}
		new Utils().scrollMid(element);
		element.clear();
		new WebObjects().Shadow_typeTextOnElement(element, text);
		return Result.PASS().setOutput(true).make();
	}

	/**
	 * @CheckPoint True
	 * 
	 */

	@KeywordArgumentValidation(checkDataForBlank = { 0, 1, 2, 4 }, checkDataForWhiteSpace = { 0, 1, 2, 4 })
	public FunctionResult Method_typeTextInTableCell(AppiumObject object, int rowId, int colId, String tag, int index, String text) throws Exception {

		Validations.checkDataForNegative(0, 1, 3);
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				webTable = new WebTableAdapter(table);
				if (webTable.childItemCount(rowId, colId, tag) > 0) {
					WebElement element = webTable.childItem(table, rowId, colId, tag, index);
					new WebObjects().Shadow_typeTextOnElement(element, text);
					return Result.PASS().setOutput(true).make();
				} else {

					return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION)
							.setMessage("No Object of " + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(2).getValue() + " type  found in the Table Cell")
							.setOutput(false).make();
				}
			}
		}.run();
	}

	/**
	 * @CheckPoint True
	 * 
	 */
	@NotSupportedInNativeApplication
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1 })
	public FunctionResult Method_selectRadioButtobTableCell(AppiumObject object, int rowId, int colId, int indx) throws Exception {

		Validations.checkDataForNegative(0, 1, 2);
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				webTable = new WebTableAdapter(table);
				if (webTable.childItemCount(rowId, colId, "input") > 0) {
					WebElement element = webTable.childItem(table, rowId, colId, "input", indx);
					if (element.isSelected()) {
						return Result.PASS().setOutput(true).setMessage(ReturnMessages.ALREADY_CHECKED.toString()).make();
					} else {
						if (AppiumDispatcher.lastChance) {
							return webobjects.Method_clickUsingJavaScript(element);
						} else {
							element.click();
						}
						return Result.PASS().setOutput(true).make();
					}

				} else {

					return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setMessage("No Object of type " + "input" + " found in the Table Cell").make();
				}
			}
		}.run();
	}

	@KeywordArgumentValidation(checkDataForBlank = { 0, 1, 3 }, checkDataForWhiteSpace = { 0, 1, 3 })
	public FunctionResult Method_selectDropDownInTableCell(AppiumObject object, int rowId, int colId, int cellindx, String selectValue) throws Exception {
		Validations.checkDataForBlank(0, 1, 3);

		Validations.checkDataForNegative(0, 1, 2);
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				webTable = new WebTableAdapter(table);
				if (webTable.childItemCount(rowId, colId, "select") > 0) {
					WebElement element = webTable.childItem(table, rowId, colId, "select", cellindx);
					Log.debug("OUTERHTML: " + element.getAttribute("outerHTML"));
					Select select = new Select(element);
					Log.debug("#$ 1");
					if (!select.isMultiple()) {
						select.selectByVisibleText(selectValue);
					} else {
						Log.debug("#$ 11");
						List<WebElement> option = element.findElements(By.tagName("option"));
						Log.debug("option Size: " + option.size());
						Log.debug("#$ 12");
						Log.debug("SelectValue: <" + selectValue + ">");
						for (WebElement webElement : option) {
							Log.debug("    ** Text:  " + webElement.getText() + "   " + webElement.getText().equals(selectValue));
							if (webElement.getText().equals(selectValue)) {
								select.deselectAll();
								Log.debug("#$ Selecting JS");
								Finder.findJavaScriptExecuterDriver().executeScript("arguments[0].selected=true;", webElement);
								break;
							}
						}
					}
					return Result.PASS().setOutput(true).make();
				} else {
					return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setMessage("No Object of type " + "select" + " found in the Table Cell").make();
				}
			}
		}.run();
	}

	/**
	 * @CheckPoint True
	 * 
	 */

	@NotSupportedInApplicationMode
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1, 3 }, checkDataForWhiteSpace = { 0, 1, 3 })
	public FunctionResult Method_selectCheckBoxinTableCell(AppiumObject object, int rowId, int colId, int indx, String Ostatus) throws Exception {
		Validations.checkDataForNegative(0, 1, 2);
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				String status = Ostatus.toUpperCase();
				boolean isChecked;
				WebElement we, table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				webTable = new WebTableAdapter(table);
				if (webTable.childItemCount(rowId, colId, "input") > 0) {
					we = webTable.childItem(table, rowId, colId, "input", indx);
					isChecked = we.isSelected();
					if ((isChecked) && status.contentEquals("ON"))
						return Result.PASS().setOutput(true).setMessage(ReturnMessages.ALREADY_CHECKED.toString()).make();
					else if ((status.contentEquals("ON") && (!isChecked)) || (status.contentEquals("OFF") && (isChecked))) {
						if (AppiumDispatcher.lastChance) {
							return webobjects.Method_clickUsingJavaScript(we);
						} else {
							we.click();
						}
						return Result.PASS().setOutput(true).make();
					} else if ((!isChecked) && status.contentEquals("OFF")) {
						return Result.PASS().setOutput(true).setMessage("Already unchecked").make();
					} else
						return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setMessage("Invalid status").make();
				} else {

					return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setMessage("No Object of type " + "input" + " found in the Table Cell").make();
				}
			}
		}.run();
	}

	/**
	 * @CheckPoint True
	 * 
	 */

	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1 })
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getAllColText(AppiumObject object, String rowDelimiter, String colDelimiter) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				AppiumDispatcher.isGetKeyword = true;
				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				webTable = new WebTableAdapter(table);
				String cellText = "";
				String result = "";
				for (int j = 0; j < webTable.getColumnCount(0); j++) {
					for (int i = 0; i < webTable.getRowCount(); i++) {
						cellText = webTable.getCellData(i, j);
						cellText = Utils.removeSpecialCharacter(cellText);
						result = result + cellText + rowDelimiter;
					}
					result = Utils.removeLastChar(result);
					result = result + colDelimiter + "\n";
				}
				result = Utils.removeLast2Char(result);
				new Utils().checkGetKeywordsOutput(result);
				return Result.PASS().setOutput(result).make();
			}
		}.run();
	}

	/**
	 * @CheckPoint True
	 * 
	 */
	@KeywordArgumentValidation(checkDataForBlank = { 0, 1 }, checkDataForWhiteSpace = { 0, 1 })
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_getAllRowText(AppiumObject object, String rowDelimiter, String colDelimiter) throws Exception {
		AppiumDispatcher.isGetKeyword = true;
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				webTable = new WebTableAdapter(table);
				String result = "", cellText = "";
				Log.print(webTable.getRowCount());
				for (int i = 0; i < webTable.getRowCount(); i++) {
					for (int j = 0; j < webTable.getColumnCount(i); j++) {
						cellText = webTable.getCellData(i, j);
						cellText = Utils.removeSpecialCharacter(cellText);
						result = result + cellText + colDelimiter;
					}
					result = Utils.removeLastChar(result);
					result = result + rowDelimiter + "\n";
				}
				result = Utils.removeLast2Char(result);
				new Utils().checkGetKeywordsOutput(result);
				return Result.PASS().setOutput(result).make();
			}
		}.run();
	}

	/**
	 * @throws Exception
	 * @CheckPoint True
	 * 
	 * 
	 * 
	 */
	public FunctionResult Method_clickLinkInTableCell(AppiumObject object, int rowId, int colId, int index) throws Exception {

		try {
			Validations.checkDataForBlank(2);
		} catch (Exception e) {
			index = 0;
		}
		Validations.checkDataForNegative(0, 1, 2);
		final int finalIndex = index;

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				webTable = new WebTableAdapter(table);
				int childItemCount = webTable.childItemCount(rowId, colId, "a");
				WebElement linkAtIndex;
				if (childItemCount > 0) {
					linkAtIndex = webTable.childItem(table, rowId, colId, "a", finalIndex);
					linkAtIndex.click();
					return Result.PASS().setOutput(true).make();
				}

				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage("No Link found in the Table Cell").make();
			}
		}.run();
	}

	/**
	 * @CheckPoint True
	 * 
	 */

	@KeywordArgumentValidation(checkDataForBlank = { 0, 1, 2 }, checkDataForWhiteSpace = { 0, 1, 2 })
	public FunctionResult Method_clickOnObjectInTableCell(AppiumObject object, int rowId, int colId, String tag, int indx) throws Exception {
		Validations.checkDataForNegative(0, 1, 3);
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = Finder.findWebElement(object);
				if (!new Utils().isElementTable(table))
					return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Specified object is not table").make();
				webTable = new WebTableAdapter(table);
				if (webTable.childItemCount(rowId, colId, tag) > 0) {
					WebElement element = webTable.childItem(table, rowId, colId, tag, indx);
					if (AppiumDispatcher.lastChance) {
						return webobjects.Method_clickUsingJavaScript(element);
					} else {
						element.click();
					}
					return Result.PASS().setOutput(true).make();
				} else {

					return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION)
							.setMessage("No Object of type " + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(2).getValue() + " found in the Table Cell").setOutput(false)
							.make();
				}

			}
		}.run();
	}

	@KeywordArgumentValidation(checkDataForBlank = { 0, 4, 5 }, checkDataForWhiteSpace = { 0, 4, 5 })
	public FunctionResult Method_clickInTableCellByQuery(AppiumObject object, String cellName, int OheaderIndex, String objectTagName, int OobjectIndex, String header1, String value1, String header2,
			String value2, String header3, String value3, String header4, String value4, String header5, String value5) throws Exception {

		try {
			Validations.checkDataForBlank(1);
		} catch (Exception e) {
			OheaderIndex = 0;
		}

		try {
			Validations.checkDataForBlank(3);
		} catch (Exception e) {
			OobjectIndex = 0;
		}

		Validations.checkDataForNegative(1);
		new Utils().ValidateHeaderAndValues(6, 7, 8, 9, 10, 11, 12, 13);

		int objectIndex = OobjectIndex;
		int headerIndex = OheaderIndex;
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = Finder.findWebElement(object);
				/*
				 * if (!new Utils().isElementTable(table)) return
				 * Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).
				 * setMessage("Specified object is not table").make();
				 */
				return Method_clickInTableCellByQueryHelper(table, cellName, headerIndex, objectTagName, objectIndex, header1, value1, header2, value2, header3, value3, header4, value4, header5,
						value5, false);
			}
		}.run();
	}

}