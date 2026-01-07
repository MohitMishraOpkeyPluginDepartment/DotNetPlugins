package com.crestech.opkey.plugin.keywords;

import java.awt.Robot;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.Rectangle;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.Select;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.crestech.opkey.plugin.tableAdapter.QueryAdapter;
import com.crestech.opkey.plugin.webdriver.Finder;
import com.crestech.opkey.plugin.webdriver.Log;
import com.crestech.opkey.plugin.webdriver.OpkeyLogger;
import com.crestech.opkey.plugin.webdriver.Validations;
import com.crestech.opkey.plugin.webdriver.WebDriverDispatcher;
import com.crestech.opkey.plugin.webdriver.enums.ReturnMessages;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ObjectNotFoundException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ToolNotSetException;
import com.crestech.opkey.plugin.webdriver.finders.JSFinder;
import com.crestech.opkey.plugin.webdriver.jstools.JSTool;
import com.crestech.opkey.plugin.webdriver.keywords.Checkbox;
import com.crestech.opkey.plugin.webdriver.keywords.Radio;
import com.crestech.opkey.plugin.webdriver.keywords.UnCategorised;
import com.crestech.opkey.plugin.webdriver.keywords.Utils;
import com.crestech.opkey.plugin.webdriver.keywords.WebObjects;
import com.crestech.opkey.plugin.webdriver.object.WebDriverObject;
import com.crestech.opkey.plugin.webdriver.util.Checkpoint;

public class TableByQuery implements KeywordLibrary {

	static Class<TableByQuery> _class = TableByQuery.class;

	public FunctionResult Method_getTextFromTableCellByQuery(WebDriverObject object, String columnName, int rowNumber,
			int objectIndex, String header1, String value1, String header2, String value2, String header3,
			String value3, String header4, String value4, String header5, String value5, String tableName)
			throws Exception {
		try {
			Validations.checkDataForBlank(3);
		} catch (ArgumentDataMissingException e) {
			return new Table().Method_getTableCellValueUsingRowIndex(object, columnName, rowNumber, objectIndex,
					tableName);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				return Method_getTableCellValueByQuery(object, columnName, objectIndex, rowNumber, header1, value1,
						header2, value2, header3, value3, header4, value4, header5, value5, tableName);

			}
		}.run();
	}

	public FunctionResult Method_HighlightTableCellByQuery(WebDriverObject object, String columnName, int rowNumber,
			int objectIndex, String header1, String value1, String header2, String value2, String header3,
			String value3, String header4, String value4, String header5, String value5, String tableName)
			throws Exception {

		try {
			Validations.checkDataForBlank(3);
		} catch (ArgumentDataMissingException e) {
			return new Table().Method_highlightTableCellUsingRowIndex(object, columnName, rowNumber, objectIndex,
					tableName);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);

				new WebObjects().Method_highlightElement(cell);

				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	public FunctionResult Method_clickTableCellByQuery(WebDriverObject object, String columnName, int rowNumber,
			int objectIndex, String header1, String value1, String header2, String value2, String header3,
			String value3, String header4, String value4, String header5, String value5, String tableName)
			throws Exception {

		try {
			Validations.checkDataForBlank(3);
		} catch (ArgumentDataMissingException e) {
			// If header1 is not given then run by rowNumber.
			return new Table().Method_clickInTableCellUsingRowIndex(object, columnName, rowNumber, objectIndex,
					tableName);
		}
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// First Priority ByQuery
				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);

//				if (cell.getAttribute("class").equalsIgnoreCase("xen")) {
//					new WebObjects().Method_ObjectClick(object);
//					new WebObjects().ClickElement(cell);
				Thread.sleep(800);
				new WebObjects().ClickElement(cell);
//					Thread.sleep(500);
//				} else {
//					new WebObjects().ClickElement(cell);
//				}

				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	public FunctionResult Method_doubleClickTableCellByQuery(WebDriverObject object, String columnName, int rowNumber,
			int objectIndex, String header1, String value1, String header2, String value2, String header3,
			String value3, String header4, String value4, String header5, String value5, String tableName)
			throws Exception {

		try {
			Validations.checkDataForBlank(3);
		} catch (ArgumentDataMissingException e) {
			// If header1 is not given then run by rowNumber.
			return new Table().Method_doubleClickInTableCellUsingRowIndex(object, columnName, rowNumber, objectIndex,
					tableName);
		}
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// First Priority ByQuery
				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);
				new WebObjects().Shadow_dblClick(cell);
				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	public FunctionResult Method_typeTextTableCellByQuery(WebDriverObject object, String columnName, int rowNumber,
			String valueToType, int objectIndex, String header1, String value1, String header2, String value2,
			String header3, String value3, String header4, String value4, String header5, String value5,
			String tableName) throws Exception {
		return OF_typeTextTableCellAndPressKeyByQuery(object, columnName, rowNumber, valueToType, objectIndex, header1,
				value1, header2, value2, header3, value3, header4, value4, header5, value5, "", tableName);
	}

	public FunctionResult Method_typeTextTableCellAndPressEnterByQuery(WebDriverObject object, String columnName,
			int rowNumber, String valueToType, int objectIndex, String header1, String value1, String header2,
			String value2, String header3, String value3, String header4, String value4, String header5, String value5,
			String tableName) throws Exception {
		return OF_typeTextTableCellAndPressKeyByQuery(object, columnName, rowNumber, valueToType, objectIndex, header1,
				value1, header2, value2, header3, value3, header4, value4, header5, value5, "enter", tableName);
	}

	public FunctionResult OF_typeTextTableCellAndPressKeyByQuery(WebDriverObject object, String columnName,
			int rowNumber, String valueToType, int objectIndex, String header1, String value1, String header2,
			String value2, String header3, String value3, String header4, String value4, String header5, String value5,
			String keyToPress, String tableName) throws Exception {
		System.out.println("INSIDE KEYWORD " + rowNumber);
		OpkeyLogger.printSaasLog(_class, "INSIDE KEYWORD PRINT " + rowNumber);
		Log.debug("INSIDE KEYWORD DEBUG " + rowNumber);
		Validations.checkDataForMandatoryBlankWhitespace(2);
		try {
			Validations.checkDataForBlank(4);
		} catch (ArgumentDataMissingException e) {
			// If header1 is not given then run by rowNumber.
			return new Table().OF_TypeTextInTableCellAndPresKeyUsingRowIndex(object, columnName, rowNumber, objectIndex,
					valueToType, keyToPress, tableName);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				System.out.println("Going TO RUN VIA QUUERY");
				// First Priority ByQuery
				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);

				List<WebElement> textBox = cell.findElements(By.xpath(
						"./*[not(@style='display:none')]//input[not(@type='hidden')] | ./*[not(@style='display:none')]/*[not(@style='display:none')]//input[not(@type='hidden')] | ./*[not(@style='display:none')]//textarea[not(@type='hidden')] |  ./*[not(@style='display:none')]/*[not(@style='display:none')]//textarea[not(@type='hidden')]"));
				if (textBox.size() > 0) {
					textBox = Utils.visible(textBox);
				} else {
					String message = "No object of INPUT find inside <" + cell + ">";
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage(message).setOutput(false).make();
				}

				new JSTool().clearText(textBox.get(0));

				WebElement ele = textBox.get(objectIndex);
				new WebObjects().shadow_TypeByText(ele, valueToType);

				if (keyToPress != null && !keyToPress.isEmpty()) {
					new Utils().waitForPageLoadAndOtherAjax(); // After XHR Runs. We need to enter after loading the
																// data.
					Thread.sleep(3000);
					ele.sendKeys(Utils.getKeyCode(keyToPress));
				}

				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	public FunctionResult Method_getTableCellValueByQuery(WebDriverObject object, String columnName, int rowNumber,
			int objectIndex, String header1, String value1, String header2, String value2, String header3,
			String value3, String header4, String value4, String header5, String value5, String tableName)
			throws Exception {

		try {
			Validations.checkDataForBlank(4);
		} catch (ArgumentDataMissingException e) {
			// If header1 is not given then run by rowNumber.
			return new Table().Method_getTableCellValueUsingRowIndex(object, columnName, rowNumber, objectIndex,
					tableName);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// First Priority ByQuery
				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);
				String cellText = Utils.shadow_getObjectText(cell).getOutput();

				List<WebElement> inputs = cell.findElements(By.xpath(
						"./*[not(@style='display:none')]//input[not(@type='hidden')] | ./*[not(@style='display:none')]//textarea[not(@type='hidden')]"));

				if (inputs.size() > 0) {
					String tempCellText = "";
					cellText = tempCellText;
					for (WebElement input : inputs) {
						cellText = cellText + Utils.shadow_getObjectText(input).getOutput();
					}
				}
				return Result.PASS().setOutput(cellText).make();
			}
		}.run();
	}

	public FunctionResult Method_verifyTableCellValueByQuery(WebDriverObject object, String columnName, int rowNumber,
			String expectedText, int objectIndex, String header1, String value1, String header2, String value2,
			String header3, String value3, String header4, String value4, String header5, String value5,
			String tableName) throws Exception {

		try {
			Validations.checkDataForBlank(5);
		} catch (ArgumentDataMissingException e) {
			// If header1 is not given then run by rowNumber.
			return new Table().Method_verifyTableCellValueUsingRowIndex(object, columnName, rowNumber, objectIndex,
					expectedText, tableName);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// First Priority ByQuery
				String actualText = Method_getTableCellValueByQuery(object, columnName,  rowNumber,objectIndex,  header1,
						value1, header2, value2, header3, value3, header4, value4, header5, value5, tableName)
								.getOutput();
				if (actualText.trim().equals(expectedText.trim())) {
					return Result.PASS().setOutput(true).setMessage(ReturnMessages.VERFIYED.toString()).make();
				} else {
					return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
							.setMessage(Utils.verification_failed(actualText, expectedText)).make();
				}
			}
		}.run();
	}

	public FunctionResult Method_SelectDropDownInTableCellByQuery(WebDriverObject object, String columnName,
			int rowNumber, String valueToSelect, int objectIndex, String header1, String value1, String header2,
			String value2, String header3, String value3, String header4, String value4, String header5, String value5,
			String tableName) throws Exception {

		Validations.checkDataForMandatoryBlankWhitespace(2);

		try {
			Validations.checkDataForBlank(3);
		} catch (ArgumentDataMissingException e) {
			// If header1 is not given then run by rowNumber.
			return new Table().Method_selectDropdownInTableCellUsingRowIndex(object, columnName, rowNumber, objectIndex,
					valueToSelect, tableName);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// First Priority ByQuery
				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);

				// Find Dropdown Present
				List<WebElement> dropDownList = cell.findElements(By.xpath(".//select"));
				if (dropDownList.size() == 0) {
					// Look for input role=ComboBox
					dropDownList = cell.findElements(By.xpath(".//input[@role='combobox']"));
				}

				WebElement dropdownElement;
				if (dropDownList.size() > 0) {
					dropdownElement = dropDownList.get(objectIndex);
				} else {
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
							.setMessage("No Object of Select present. Kindly check cell.").make();
				}

				if (dropdownElement.getTagName().equalsIgnoreCase("select")) {
					Select select = new Select(dropdownElement);
					select.selectByVisibleText(valueToSelect);
					return Result.PASS().setOutput(true).setMessage("Value Selected").make();
				} else {
					// It is a input ComboBox
					return new DropDown().selectComboBoxOptionByText(dropdownElement, valueToSelect);
				}
			}
		}.run();
	}

	public FunctionResult Method_clickTextInTableCellByQuery(WebDriverObject object, String columnName, int rowNumber,
			String textToClick, int textIndex, String header1, String value1, String header2, String value2,
			String header3, String value3, String header4, String value4, String header5, String value5,
			String tableName) throws Exception {

		Validations.checkDataForMandatoryBlankWhitespace(2);

		try {
			Validations.checkDataForBlank(4);
		} catch (ArgumentDataMissingException e) {
			return new Table().Method_clickTextInTableCellUsingRowIndex(object, columnName, rowNumber, textToClick,
					textIndex, tableName);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);

				List<WebElement> textObjects = cell
						.findElements(By.xpath(".//self::*[normalize-space(text())=\"" + textToClick.trim() + "\"]"));

				if (textObjects.isEmpty()) {
					throw new ObjectNotFoundException("No Object found with text <" + textToClick + ">");
				}

				// Selenium Not Working on this. Tried So many ways.only this one works

				String elementID = textObjects.get(textIndex).getAttribute("id");
				if (elementID != null && !elementID.isEmpty()) {
					List<WebElement> _elements = JSFinder.findElementByJsFinder("", elementID, "", "", "", "", "", "",
							"");
					if (_elements.size() == 1) {
						Actions action = new Actions(Finder.findWebDriver());
						action.moveToElement(_elements.get(0)).build().perform();
						new Utils().scrollIntoView(_elements.get(0));
						new WebObjects().Method_clickUsingJavaScript(_elements.get(0));
					}
				} else {
					new WebObjects().ClickElement(textObjects.get(textIndex));
				}

				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	public FunctionResult Method_clearEditFieldInTableCellByQuery(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String header1, String value1, String header2, String value2,
			String header3, String value3, String header4, String value4, String header5, String value5,
			String tableName) throws Exception {

		try {
			Validations.checkDataForBlank(3);
		} catch (ArgumentDataMissingException e) {
			// If header1 is not given then run by rowNumber.
			return new Table().Method_clearEditFieldInTableCellUsingRowIndex(object, columnName, rowNumber, objectIndex,
					tableName);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// First Priority ByQuery
				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);

				List<WebElement> textBox = cell.findElements(By.xpath(
						"./*[not(@style='display:none')]//input[not(@type='hidden')] | ./*[not(@style='display:none')]/*[not(@style='display:none')]//input[not(@type='hidden')] | ./*[not(@style='display:none')]//textarea[not(@type='hidden')] |  ./*[not(@style='display:none')]/*[not(@style='display:none')]//textarea[not(@type='hidden')]"));
				if (textBox.size() == 0) {
					String message = "No object of INPUT find inside <" + cell + ">";
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage(message).setOutput(false).make();
				} else {
					textBox.get(objectIndex).clear();
				}
				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	public FunctionResult Method_selectCheckBoxInTableCellByQuery(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String status, String header1, String value1, String header2, String value2,
			String header3, String value3, String header4, String value4, String header5, String value5,
			String tableName) throws Exception {

		try {
			Validations.checkDataForBlank(4);
		} catch (ArgumentDataMissingException e) {
			// By RowIndex
			return new Table().Method_selectCheckBoxInTableCellRowIndex(object, columnName, rowNumber, objectIndex,
					status, tableName);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// By Query
				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);
				List<WebElement> element = cell.findElements(
						By.xpath("./*[not(@style='display:none')]//input[not(@type='hidden') and @type='checkbox']"));
				if(element.size()==0)
				{
					element=cell.findElements(By.xpath(".//input[not(@type='hidden') and @type='checkbox']"));
				}
				if (element.size() > 0) {
					WebElement checkBoxElement = element.get(objectIndex);
					String _id = checkBoxElement.getAttribute("id");
					if (_id != null) {
						List<WebElement> labels = cell.findElements(By.xpath("//label[@for='" + _id + "']"));
						if (labels.size() == 1) {
							OpkeyLogger.printSaasLog(_class, ">>Label Found");
							new WebObjects().ClickElement(labels.get(0));
							return Result.PASS().setOutput(true).setMessage("CheckBox Selected").make();
						}
					}
					OpkeyLogger.printSaasLog(_class,
							">>CheckBox OuterHTML " + checkBoxElement.getAttribute("outerHTML"));
				}
				if (element.size() == 0) {
					String message = "No object of INPUT find inside <" + cell + ">";
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage(message).setOutput(false).make();
				} else {
					return new Checkbox().Method_selectCheckBoxElement(element.get(objectIndex), status);
				}
			}
		}.run();
	}

	public FunctionResult Method_GetCheckBoxStatusInTableCellByQuery(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String status, String header1, String value1, String header2, String value2,
			String header3, String value3, String header4, String value4, String header5, String value5,
			String tableName) throws Exception {

		try {
			Validations.checkDataForBlank(4);
		} catch (ArgumentDataMissingException e) {
			// By RowIndex
			return new Table().Method_selectCheckBoxInTableCellRowIndex(object, columnName, rowNumber, objectIndex,
					status, tableName);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// By Query
				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);
				List<WebElement> element = cell.findElements(
						By.xpath("./*[not(@style='display:none')]//input[not(@type='hidden') and @type='checkbox']"));
				if (element.size() > 0) {
					WebElement checkBoxElement = element.get(objectIndex);
					String _id = checkBoxElement.getAttribute("id");
					if (_id != null) {
						List<WebElement> labels = cell.findElements(By.xpath("//label[@for='" + _id + "']"));
						if (labels.size() == 1) {
							OpkeyLogger.printSaasLog(_class, ">>Label Found");
							// new WebObjects().ClickElement(labels.get(0));
							return Result.PASS().setOutput(labels.get(0).isSelected() == true ? "On" : "Off")
									.setMessage("CheckBox Status").make();
						}
					}
					OpkeyLogger.printSaasLog(_class,
							">>CheckBox OuterHTML " + checkBoxElement.getAttribute("outerHTML"));
				}
				if (element.size() == 0) {
					String message = "No object of INPUT find inside <" + cell + ">";
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage(message).setOutput(false).make();
				} else {
					return Result.PASS().setOutput(element.get(0).isSelected() == true ? "On" : "Off")
							.setMessage("CheckBox Status").make();
				}
			}
		}.run();
	}

	public FunctionResult Method_deSelectCheckBoxInTableCellByQuery(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String header1, String value1, String header2, String value2,
			String header3, String value3, String header4, String value4, String header5, String value5,
			String tableName) throws Exception {

		try {
			Validations.checkDataForBlank(3);
		} catch (ArgumentDataMissingException e) {
			// By RowIndex
			return new Table().Method_deSelectCheckBoxInTableCellRowIndex(object, columnName, rowNumber, objectIndex,
					tableName);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// By Query
				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);
				List<WebElement> element = cell.findElements(
						By.xpath("./*[not(@style='display:none')]//input[not(@type='hidden') and @type='checkbox']"));
				if(element.size()==0)
				{
					element=cell.findElements(By.xpath(".//input[not(@type='hidden') and @type='checkbox']"));
				}
				if (element.size() == 0) {
					String message = "No object of INPUT find inside <" + cell + ">";
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage(message).setOutput(false).make();
				} else {
					return new Checkbox().shadow_deSelectCheckBox(element.get(objectIndex));
				}
			}
		}.run();
	}

	public FunctionResult Method_mouseHoverInTableCellByQuery(WebDriverObject object, String columnName, int rowNumber,
			int objectIndex, String header1, String value1, String header2, String value2, String header3,
			String value3, String header4, String value4, String header5, String value5, String tableName)
			throws Exception {

		try {
			Validations.checkDataForBlank(3);
		} catch (ArgumentDataMissingException e) {
			return new Table().Method_mouseHoverInTableCelllUsingRowIndex(object, columnName, rowNumber, objectIndex,
					tableName);
		}
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);
			    List<WebElement> elementOfLink = cell.findElements(By.xpath(".//a[contains(@class,\"popover__trigger\")]"));
			    if(elementOfLink.size()>0) {
			    	Map<String, Integer> dragDimension = getEleSizeObj(elementOfLink.get(0));
					int dragEleX = dragDimension.get("x").intValue();
					int dragEleY = dragDimension.get("y").intValue();
					int dragEleWidth = dragDimension.get("width").intValue();
					int dragEleHeight = dragDimension.get("height").intValue();

				

					System.out.println(">>Drag Element X " + dragEleX + " Y " + dragEleY + " Width " + dragEleWidth + " Height "
							+ dragEleHeight);
				
					Robot robot = new Robot();
					robot.mouseMove(0, 0);
				//	System.out.println("Move from :: " + dragXWidth + " :: " + dragYHeight);
//					Util.getScreen().mouseMove(dragXWidth + 3, dragYHeight + 3);
					robot.mouseMove(dragEleWidth, dragEleHeight);
			    //	new WebObjects().ClickElement(elementOfLink.get(0));
			    	return new UnCategorised().Method_MouseHoverElement(elementOfLink.get(0));
			    }
				return new UnCategorised().Method_MouseHoverElement(cell);
			}
		}.run();
		// return Result.PASS().setOutput(true).make();
	}
	public Map<String, Integer> getEleSizeObj(WebElement ele) throws ToolNotSetException {
		Map<String, Integer> map = new HashMap<>();
		// Object json = ((JavascriptExecutor) Finder.findWebDriver())
		// .executeScript(" return
		// JSON.stringify(arguments[0].getBoundingClientRect())", new Object[] { ele });
		// System.out.println("JSON : " + json);
		// JsonObject result = (JsonObject) (new JsonParser()).parse(json.toString());
		int dropX = 0;
		int dropY = 0;
		int dropWidth = 0;
		int dropHeight = 0;
		org.openqa.selenium.Point point = ele.getLocation();
		Dimension dimension = ele.getSize();
		try {
			dropX = point.getX();
			dropY = point.getY();
			dropWidth = dimension.getWidth();
			dropHeight = dimension.getHeight();
		} catch (NullPointerException ex) {
			Rectangle rect = ele.getRect();
			dropX = rect.x;
			dropY = rect.y;
			dropWidth = rect.width;
			dropHeight = rect.height;
		}
		map.put("x", dropX);
		map.put("y", dropY);
		map.put("width", dropWidth);
		map.put("height", dropHeight);
		System.out
				.println("x : " + dropX + " , y : " + dropY + " , width : " + dropWidth + " , height : " + dropHeight);
		return map;
	}

	public FunctionResult Method_clickImageInTableCellByQuery(WebDriverObject object, String columnName, int rowNumber,
			int objectIndex, String header1, String value1, String header2, String value2, String header3,
			String value3, String header4, String value4, String header5, String value5, String tableName)
			throws Exception {

		try {
			Validations.checkDataForBlank(3);
		} catch (ArgumentDataMissingException e) {
			// If header1 is not given then run by rowNumber.
			try {
				//to check if row number is present if not then we are using default row number as 1
				Validations.checkDataForBlank(1);
			} catch (ArgumentDataMissingException e1) {
				rowNumber=1;
			} 
			return new Table().Method_clickImageInTableCellUsingRowIndex(object, columnName, rowNumber, objectIndex,
					tableName);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// First Priority ByQuery
				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);

				List<WebElement> imagesWithAnchor = cell.findElements(By.xpath(".//a//img | .//button//img"));
				WebElement imgParent = imagesWithAnchor.get(objectIndex).findElement(By.xpath(".."));
				new WebObjects().ClickElement(imgParent);
				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	public FunctionResult Method_clickLinkInTableCellByQuery(WebDriverObject object, String columnName, int rowNumber,
			int objectIndex, String header1, String value1, String header2, String value2, String header3,
			String value3, String header4, String value4, String header5, String value5, String tableName)
			throws Exception {

		try {
			Validations.checkDataForBlank(3);
		} catch (ArgumentDataMissingException e) {
			// If header1 is not given then run by rowNumber.
			return new Table().Method_clickLinkInTableCellUsingRowIndex(object, columnName, rowNumber, objectIndex,
					tableName);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// First Priority ByQuery
				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);
				List<WebElement> images = cell.findElements(By.xpath(".//a"));
				images = Utils.visible(images);
				if (images.size() == 0) {
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
							.setMessage("No Link found in Cell").make();
				}
				new WebObjects().ClickElement(images.get(objectIndex));

				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	public FunctionResult Method_selectRadioButtonInTableCellByQuery(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, int index, String header1, String value1, String header2, String value2,
			String header3, String value3, String header4, String value4, String header5, String value5,
			String tableName) throws Exception {

		try {
			Validations.checkDataForBlank(4);
		} catch (ArgumentDataMissingException e) {
			// By RowIndex
			return new Table().Method_selectRadioButtonInTableCellRowIndex(object, columnName, rowNumber, objectIndex,
					index, tableName);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// By Query
				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);
				List<WebElement> element = cell.findElements(
						By.xpath("./*[not(@style='display:none')]//input[not(@type='hidden') and @type='radio']"));
				if (element.size() == 0) {
					String message = "No object of INPUT find inside <" + cell + ">";
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage(message).setOutput(false).make();
				} else {
					return new Radio().Method_SelectRadioButton(element.get(objectIndex), index);
				}
			}
		}.run();
	}

	public FunctionResult Method_getObjectPropertyInTableCellByQuery(WebDriverObject object, String columnName,
			int rowNumber, String objectTag, int tagIndex, String propertyName, String header1, String value1,
			String header2, String value2, String header3, String value3, String header4, String value4, String header5,
			String value5, String tableName) throws Exception {

		Validations.checkDataForMandatoryBlankWhitespace(4);

		try {
			Validations.checkDataForBlank(5);
		} catch (ArgumentDataMissingException e) {
			return new Table().Method_getObjectPropertyInTableCellByRowIndex(object, columnName, rowNumber, objectTag,
					tagIndex, propertyName, tableName);
		}
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);
				// Find child Element within Cell
				List<WebElement> innerElement = cell
						.findElements(By.xpath(".//" + objectTag + "[not(@style='display:none')]"));
				WebElement element = innerElement.get(tagIndex);
				String str = element.getAttribute(propertyName);
				if (str == null || str.trim().isEmpty()) {
					OpkeyLogger.printSaasLog(_class, "No Such Property");
					return Result.PASS().setOutput(str).setMessage("No Such Property Exists").make();
				} else {
					return Result.PASS().setOutput(str).make();
				}
			}
		}.run();
	}

	/**
	 * @throws Exception
	 * @KeywordName: OracleFussion_GetRowsCountHavingSameData
	 */
	public FunctionResult Method_getRowsCountHavingSameDataByQuery(WebDriverObject object, String columnName,
			int objectIndex, String header1, String value1, String header2, String value2, String header3,
			String value3, String header4, String value4, String header5, String value5, String tableName)
			throws Exception {

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = null;

				if (tableName != null && !tableName.isEmpty()) {
					table = new Table().GetTableObjectByTableName(tableName);

				} else {
					table = Finder.findWebElement(object);
				}
				QueryAdapter qa = new QueryAdapter(table, columnName, header1, value1, header2, value2, header3, value3,
						header4, value4, header5, value5);
				List<WebElement> list = qa.findElements();

				return Result.PASS().setMessage("Total Count: " + list.size()).setOutput(list.size()).make();
			}
		}.run();
	}

	/**
	 * @throws Exception
	 * @KeywordName: SelectRowsFromTable
	 */
	public FunctionResult Method_selectRowsFromTableByQuery(WebDriverObject object, String columnName,
			String rowNumbers, int objectIndex, String header1, String value1, String header2, String value2,
			String header3, String value3, String header4, String value4, String header5, String value5,
			String tableName) throws Exception {

		try {
			Validations.checkDataForBlank(3);
		} catch (ArgumentDataMissingException e) {
			return new Table().Method_selectRowsFromTableUsingRowIndex(object, rowNumbers, true, tableName);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = null;

				if (tableName != null && !tableName.isEmpty()) {
					table = new Table().GetTableObjectByTableName(tableName);

				} else {
					table = Finder.findWebElement(object);
				}
				QueryAdapter qa = new QueryAdapter(table, columnName, header1, value1, header2, value2, header3, value3,
						header4, value4, header5, value5);
				List<Integer> allRows = qa.getAllRowsByQuery();
				String rowString = "";
				for (int i : allRows) {
					rowString += Integer.toString(i) + ";";
				}
				System.out.println("Created String: " + rowString);
				System.out.println("All Rows: " + allRows);

				// List<String> strings =
				// allRows.stream().map(Object::toString).collect(Collectors.toList());
				// String rows = String.join(";", strings);
				return new Table().Method_selectRowsFromTableUsingRowIndex(object, rowString, false, tableName);
			}
		}.run();
	}

	public FunctionResult Method_GetCheckBoxStatusInTableCellByQuery(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String header1, String value1, String header2, String value2,
			String header3, String value3, String header4, String value4, String header5, String value5,
			String tableName) throws Exception {

		WebDriverDispatcher.isGetKeyword = true;

		try {
			Validations.checkDataForBlank(4);
		} catch (ArgumentDataMissingException e) {
			// By RowIndex
			return new Table().Method_GetCheckBoxStatusInTableCellRowIndex(object, columnName, rowNumber, objectIndex,
					tableName);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// By Query
				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);
				List<WebElement> element = cell.findElements(
						By.xpath("./*[not(@style='display:none')]//input[not(@type='hidden') and @type='checkbox']"));
				if (element.size() == 0) {
					element=cell.findElements(By.xpath(".//input[not(@type='hidden') and @type='checkbox']"));
				}
				if (element.size() > 0) {
					WebElement checkBoxElement = element.get(objectIndex);
					String _id = checkBoxElement.getAttribute("id");
					if (_id != null) {
						List<WebElement> labels = cell.findElements(By.xpath("//label[@for='" + _id + "']"));
						if (labels.size() == 1) {
							OpkeyLogger.printSaasLog(_class, ">>Label Found");
							// new WebObjects().ClickElement(labels.get(0));
							return Result.PASS().setOutput(labels.get(0).isSelected() == true ? "On" : "Off")
									.setMessage("CheckBox Status").make();
						}
					}
					OpkeyLogger.printSaasLog(_class,
							">>CheckBox OuterHTML " + checkBoxElement.getAttribute("outerHTML"));
				}
				if (element.size() == 0) {
					String message = "No object of INPUT find inside <" + cell + ">";
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage(message).setOutput(false).make();
				} else {
					return Result.PASS().setOutput(element.get(0).isSelected() == true ? "On" : "Off")
							.setMessage("CheckBox Status").make();
				}
			}
		}.run();
	}

	public FunctionResult Method_VerifyCheckBoxStatusInTableCellByQuery(WebDriverObject object, String columnName,
			int rowNumber, String status, int objectIndex, String header1, String value1, String header2, String value2,
			String header3, String value3, String header4, String value4, String header5, String value5,
			String tableName) throws Exception {

		try {
			Validations.checkDataForBlank(4);
		} catch (ArgumentDataMissingException e) {
			// By RowIndex
			return new Table().Method_VeirfyCheckBoxStatusInTableCellRowIndex(object, columnName, rowNumber,
					objectIndex, status, tableName);
		}

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// By Query
				WebElement cell = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3,
						value3, header4, value4, header5, value5, tableName);
				String checkboxvalue=cell.findElement(By.xpath(".//input[@type='checkbox']")).getAttribute("value");
				List<WebElement> element = cell.findElements(
						By.xpath(".//input[not(@type='hidden') and @type='checkbox' and @value= '" + checkboxvalue + "']"));
				if (element.size() > 0) {
					WebElement checkBoxElement = element.get(objectIndex);
					String _id = checkBoxElement.getAttribute("id");
					if (_id != null) {
						List<WebElement> labels = cell.findElements(By.xpath("//label[@for='" + _id + "']"));
						if (labels.size() == 1) {
							OpkeyLogger.printSaasLog(_class, ">>Label Found");
							// new WebObjects().ClickElement(labels.get(0));
							return Result.PASS().setOutput(labels.get(0).isSelected() == true ? "On" : "Off")
									.setMessage("CheckBox Status").make();
						}
					}
					OpkeyLogger.printSaasLog(_class,
							">>CheckBox OuterHTML " + checkBoxElement.getAttribute("outerHTML"));
				}
				if (element.size() == 0) {
					String message = "No object of INPUT find inside <" + cell + ">";
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage(message).setOutput(false).make();
				} else {
					if (status.equalsIgnoreCase(element.get(0).isSelected() == true ? "On" : "Off")) {
						return Result.PASS().setOutput(true).setMessage("Done").make();

					} else {
						return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false).setMessage("Done")
								.make();
					}
				}
			}
		}.run();
	}

	/************************************************
	 * Dont't Cross This Line
	 * 
	 * @throws Exception
	 **********************************************************************************/
	private WebElement findTableCellByQuery(WebDriverObject object, String columnName, String header1, String value1,
			String header2, String value2, String header3, String value3, String header4, String value4, String header5,
			String value5, String tableName) throws Exception {

		long start = System.currentTimeMillis();

		WebElement table = null;

		if (tableName != null && !tableName.isEmpty()) {
			table = new Table().GetTableObjectByTableName(tableName);

		} else {
			table = Finder.findWebElement(object);
		}

//		table.click();
		new WebObjects().ClickElement(table);
		Log.debug("FINDER TIME = " + (System.currentTimeMillis() - start));
		QueryAdapter qa = new QueryAdapter(table, columnName, header1, value1, header2, value2, header3, value3,
				header4, value4, header5, value5);
		List<Element> cells = qa.findCells();
		int count = 0;
		WebElement element = null;
		List<WebElement> list = new ArrayList<WebElement>();
		List<WebElement> elements = new ArrayList<WebElement>();
		outerLoop: for (Element cell : cells) {
			System.out.println("Looking for null pointer");
			if(cell==null) {
				continue;
			}
			System.out.println("***** " + getTextOfJSoupElement(cell));
			System.out.println("null pointer not found");
			if (cell.tagName().equals("th"))
				continue;
			String cssSelector = Utility.validateCSS(cell.cssSelector());
			System.out.println("cssSelector :: " + cssSelector);

			elements = table.findElements(By.cssSelector(cssSelector));

			for (WebElement webElement : elements) {
				list.add(webElement);
				String elementText = getTextOfWebElement(webElement);
				System.out.println("***** " + elementText);
				System.out.println("Comparing jsouptext and webelement text : "
						+ getTextOfWebElement(webElement).equals(getTextOfJSoupElement(cell)));
				if (getTextOfWebElement(webElement).equals(getTextOfJSoupElement(cell))) {
					element = webElement;
					count = count + 1;
					break;
				}
			}
			if (count == 1) {
				System.out.println("only one object found");
				System.out.println("Final element found is   " + element.getText());
				break outerLoop;
			} else {
				System.out.println("more than one object with same name found");
				break outerLoop;
			}

		}


		// Considering picking first row if many are found
		int objectIndex = 0;
		boolean goByiD = false;
		if (element != null && elements.size() > 1 && element.getText().isEmpty()) {
			goByiD = true;
		}
		// if((element == null && (elements.isEmpty() ||
		// !elements.get(0).isDisplayed())) || (element != null &&
		// !element.isDisplayed())) {
		if ((goByiD) || element == null || (!list.isEmpty() && !list.get(objectIndex).isDisplayed())) {
			if (!list.isEmpty()) {
				element = list.get(list.size() - 1);
			} else if (!cells.isEmpty()) {
				String id = cells.get(0).attr("opkey-uid-a");
				if (id != null && !id.isEmpty()) {
					List<WebElement> tds = table.findElements(By.xpath(".//td[@opkey-uid-a=\"" + id + "\"]"));
					if (!tds.isEmpty()) {
						element = tds.get(0);
					}
				}
			} else {
				element = list.get(objectIndex);
			}

		}

		if (element != null) {
			List<WebElement> hiden = element.findElements(By.xpath("./ancestor::div[@style=\"display:none\"]"));
			System.out.println("Hidden counts are:" + hiden.size());
			if (!hiden.isEmpty()) {
				System.out.println("HTML: " + hiden.get(0).getAttribute("outerHTML"));
				List<WebElement> tds = hiden.get(0).findElements(By.xpath("./ancestor::td"));
				System.out.println("tds size: " + tds.size());
				if (!tds.isEmpty()) {
					element = tds.get(tds.size() - 1);
				}
			}
		}

		new Utils().scrollMid(element);
		return element;
	}

	String getTextOfWebElement(WebElement el) {
		Document sourceHtml = Jsoup.parse(el.getAttribute("outerHTML"));
		Element cell = sourceHtml.select("body").get(0);
		return getTextOfJSoupElement(cell);
	}

	String getTextOfJSoupElement(Element cell) {
        
		System.out.println("Cell***** "+cell);
		if(cell.text()==null) {
			System.out.println("Mayank Null Cell getText");
		}
		String returnText = "";
		String inputText = "";
		returnText = cell.text();

		Element input = cell.selectFirst("input");

		if (returnText == null) {
			returnText = "";
		}
		if (input != null) {

			inputText = (inputText == null) || (inputText.equalsIgnoreCase("")) ? input.attr("value") : inputText;

			inputText = (inputText == null) || (inputText.equalsIgnoreCase("")) ? input.attr("placeholder") : inputText;

			inputText = (inputText == null) || (inputText.equalsIgnoreCase("")) ? input.attr("ps-placeholder")
					: inputText;

			inputText = (inputText == null) || (inputText.equalsIgnoreCase("")) ? input.attr("innerText") : inputText;

			inputText = inputText == null ? "" : inputText;

		}
		

		return returnText + inputText;

	}

}
