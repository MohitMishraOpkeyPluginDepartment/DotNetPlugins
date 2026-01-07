package com.crestech.opkey.plugin.keywords;

import java.awt.Robot;
import java.awt.event.KeyEvent;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.jsoup.nodes.Element;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.Select;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.crestech.opkey.plugin.tableAdapter.TableAdpater;
import com.crestech.opkey.plugin.webdriver.Finder;
import com.crestech.opkey.plugin.webdriver.OpkeyLogger;
import com.crestech.opkey.plugin.webdriver.Validations;
import com.crestech.opkey.plugin.webdriver.WebDriverDispatcher;
import com.crestech.opkey.plugin.webdriver.enums.ReturnMessages;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ObjectNotFoundException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ToolNotSetException;
import com.crestech.opkey.plugin.webdriver.finders.JSFinder;
import com.crestech.opkey.plugin.webdriver.jstools.JSTool;
import com.crestech.opkey.plugin.webdriver.keywords.ActionsAbstraction;
import com.crestech.opkey.plugin.webdriver.keywords.Checkbox;
import com.crestech.opkey.plugin.webdriver.keywords.Radio;
import com.crestech.opkey.plugin.webdriver.keywords.UnCategorised;
import com.crestech.opkey.plugin.webdriver.keywords.Utils;
import com.crestech.opkey.plugin.webdriver.keywords.WebObjects;
import com.crestech.opkey.plugin.webdriver.object.WebDriverObject;
import com.crestech.opkey.plugin.webdriver.util.Checkpoint;
import com.crestech.opkey.plugin.webdriver.util.GenericCheckpoint;

public class Table implements KeywordLibrary {

	static Class<Table> _class = Table.class;

	public FunctionResult Method_clickInTableCellUsingRowIndex(WebDriverObject object, String columnName, int rowNumber,
			int objectIndex, String tableName) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByRowIndex(object, columnName, rowNumber, tableName);
				new WebObjects().ClickElement(cell);

				return Result.PASS().setOutput(true).make();

			}
		}.run();
	}

	public FunctionResult Method_doubleClickInTableCellUsingRowIndex(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String tableName) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByRowIndex(object, columnName, rowNumber, tableName);
				new WebObjects().Shadow_dblClick(cell);

				return Result.PASS().setOutput(true).make();

			}
		}.run();
	}

	public FunctionResult Method_selectDropdownInTableCellUsingRowIndex(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String valueToSelect, String tableName) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByRowIndex(object, columnName, rowNumber, tableName);
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

	public FunctionResult Method_highlightTableCellUsingRowIndex(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String tableName) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByRowIndex(object, columnName, rowNumber, tableName);
				new WebObjects().Method_highlightElement(cell);
				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	public FunctionResult Method_TypeTextInTableCellUsingRowIndex(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String textToType, String tableName) throws Exception {
		return OF_TypeTextInTableCellAndPresKeyUsingRowIndex(object, columnName, rowNumber, objectIndex, textToType, "",
				tableName);
	}

	public FunctionResult OF_TypeTextInTableCellAndPresKeyUsingRowIndex(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String textToType, String keyToPress, String tableName) throws Exception {

		System.out.println("Going To Run Via ROW INDEX");
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByRowIndex(object, columnName, rowNumber, tableName);

				List<WebElement> textBox = cell.findElements(By.xpath(
						"./*[not(@style='display:none')]//input[not(@type='hidden')] | ./*[not(@style='display:none')]/*[not(@style='display:none')]//input[not(@type='hidden')] | ./*[not(@style='display:none')]//textarea[not(@type='hidden')] |  ./*[not(@style='display:none')]/*[not(@style='display:none')]//textarea[not(@type='hidden')]"));
				for (WebElement webElement : textBox) {
					System.out.println(webElement);
				}

				if (textBox.size() > 0) {
					textBox = Utils.visible(textBox);
				} else {
					String message = "No object of INPUT find inside <" + cell + ">";
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage(message).setOutput(false).make();
				}

				new JSTool().clearText(textBox.get(objectIndex));

				WebElement ele = textBox.get(objectIndex);

				new WebObjects().shadow_TypeByText(ele, textToType);

				if (keyToPress != null && !keyToPress.isEmpty()) {

					new Utils().waitForPageLoadAndOtherAjax(); // After XHR Runs. We need to enter after loading the
																// data.

					ele.sendKeys(Utils.getKeyCode(keyToPress));
				}

				new Utils().defocusEle(ele);

				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	public FunctionResult Method_getTableCellValueUsingRowIndex(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String tableName) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByRowIndex(object, columnName, rowNumber, tableName);
				String cellText = new Utility().getCellText(cell);

				return Result.PASS().setOutput(cellText).make();
			}
		}.run();
	}

	public FunctionResult Method_verifyTableCellValueUsingRowIndex(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String expectedValue, String tableName) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				String actualValue = Method_getTableCellValueUsingRowIndex(object, columnName, rowNumber, objectIndex,
						tableName).getOutput();
				if (actualValue.trim().equals(expectedValue.trim())) {
					return Result.PASS().setOutput(true).setMessage(ReturnMessages.VERFIYED.toString()).make();
				} else {
					return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
							.setMessage(Utils.verification_failed(actualValue, expectedValue)).make();
				}
			}
		}.run();
	}

	public FunctionResult Method_clickTextInTableCellUsingRowIndex(WebDriverObject object, String columnName,
			int rowNumber, String text, int textIndex, String tableName) throws Exception {
		try {
			Validations.checkDataForBlank(3);
		} catch (ArgumentDataMissingException e) {
			textIndex = 0;
		}
		final int finalTextIndex = textIndex;
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByRowIndex(object, columnName, rowNumber, tableName);

				List<WebElement> textObjects = cell
						.findElements(By.xpath(".//self::*[normalize-space(text())=\"" + text.trim() + "\"]"));

				String elementID = textObjects.get(finalTextIndex).getAttribute("id");
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
					new WebObjects().ClickElement(textObjects.get(finalTextIndex));
				}

				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	public FunctionResult Method_clearEditFieldInTableCellUsingRowIndex(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String tableName) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByRowIndex(object, columnName, rowNumber, tableName);
				List<WebElement> inputs = cell.findElements(By.xpath(
						"./*[not(@style='display:none')]//input[not(@type='hidden')] | ./*[not(@style='display:none')]/*[not(@style='display:none')]//input[not(@type='hidden')] | ./*[not(@style='display:none')]//textarea[not(@type='hidden')] |  ./*[not(@style='display:none')]/*[not(@style='display:none')]//textarea[not(@type='hidden')]"));
				for (WebElement webElement : inputs) {
					System.out.println(webElement);
				}
				if (inputs.size() == 0) {
					String message = "No object of INPUT find inside <" + cell + ">";
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage(message).setOutput(false).make();
				} else {
					inputs.get(objectIndex).clear();
				}

				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	public FunctionResult Method_selectCheckBoxInTableCellRowIndex(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String status, String tableName) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByRowIndex(object, columnName, rowNumber, tableName);
				List<WebElement> element = cell.findElements(
						By.xpath("./*[not(@style='display:none')]//input[not(@type='hidden') and @type='checkbox']"));
				if(element.size()==0)
				{
					element=cell.findElements(By.xpath(".//input[not(@type='hidden') and @type='checkbox']"));
				}
				return new Checkbox().Method_selectCheckBoxElement(element.get(objectIndex), status);
			}
		}.run();
	}

	public FunctionResult Method_VeirfyCheckBoxStatusInTableCellRowIndex(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String status, String tableName) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByRowIndex(object, columnName, rowNumber, tableName);
				List<WebElement> element = cell.findElements(
						By.xpath(".//input[not(@type='hidden') and @type='checkbox']"));
				if (status.equalsIgnoreCase(element.get(0).isSelected() == true ? "On" : "Off")) {
					return Result.PASS().setOutput(true).setMessage("Done").make();

				} else {
					return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false).setMessage("Done")
							.make();
				}
			}
		}.run();
	}

	public FunctionResult Method_GetCheckBoxStatusInTableCellRowIndex(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String tableName) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByRowIndex(object, columnName, rowNumber, tableName);
				List<WebElement> element = cell.findElements(
						By.xpath("./*[not(@style='display:none')]//input[not(@type='hidden') and @type='checkbox']"));
				if (element.size() == 0) {
					element=cell.findElements(By.xpath(".//input[not(@type='hidden') and @type='checkbox']"));
				}
				return Result.PASS().setOutput(element.get(0).isSelected() == true ? "On" : "Off").setMessage("Done")
						.make();
			}
		}.run();
	}

	public FunctionResult Method_deSelectCheckBoxInTableCellRowIndex(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String tableName) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByRowIndex(object, columnName, rowNumber, tableName);
				List<WebElement> element = cell.findElements(
						By.xpath("./*[not(@style='display:none')]//input[not(@type='hidden') and @type='checkbox']"));
				if(element.size()==0)
				{
					element=cell.findElements(By.xpath(".//input[not(@type='hidden') and @type='checkbox']"));
				}
				return new Checkbox().shadow_deSelectCheckBox(element.get(objectIndex));
			}
		}.run();
	}

	public FunctionResult Method_clickImageInTableCellUsingRowIndex(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String tableName) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByRowIndex(object, columnName, rowNumber, tableName);
				List<WebElement> imagesWithAnchor = cell.findElements(By.xpath(".//a//img | .//button//img"));
				WebElement imgParent = imagesWithAnchor.get(objectIndex).findElement(By.xpath(".."));

				OpkeyLogger.printSaasLog(_class, "@Log: TotalSize of image: " + imagesWithAnchor.size());
				new WebObjects().ClickElement(imgParent);
				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	public FunctionResult Method_getColumnValueInTableCellUsingRowIndex(WebDriverObject object, String columnName,
			String delimiter, String tableName) throws Exception {
		try {
			Validations.checkDataForBlank(0);
		} catch (ArgumentDataMissingException e) {
			columnName = "0";
		}
		try {
			Validations.checkDataForBlank(1);
		} catch (ArgumentDataMissingException e) {
			delimiter = Utils.getDelimiter();
		}

		final String finalColumnName = columnName;
		final String finalDelimeter = delimiter;
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
				WebDriverDispatcher.isGetKeyword = true;
				WebElement table = null;

				if (tableName != null && !tableName.isEmpty()) {
					table = GetTableObjectByTableName(tableName);

				} else {
					table = Finder.findWebElement(object);
				}

				TableAdpater ta = new TableAdpater(table);

				int columnNumber = ta.getHeaderNumber(finalColumnName, 0);
				Element[][] tableArray = ta.getTable();
				List<String> output = new ArrayList<>();

				for (int i = ta.getHeaderMaxIndex() + 1, j = 1; i < tableArray.length; i++, j++) {

					if (columnNumber == -1) {
						return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage("Column Value(s) not found")
								.setOutput(false).make();

					}
					String cssPath = "";
					Element cell = tableArray[i][columnNumber];
//					System.out.println("***************i= " + i + " ********** col no.= " + columnNumber);
					if (cell != null) {

						String cssSelector = null;

						cssSelector = Utility.validateCSS(cell.cssSelector());
						String[] str = cssSelector.split(">");
//						

						boolean repl = false;
						if ((str[1].trim().equalsIgnoreCase("tr.xem")) && (!repl)) {

							repl = true;

							str[1] = str[1].replaceFirst(".*", " tr.xem:nth-child(" + j + ") ");
							int k = 1;
							for (String string : str) {
								if (k == 1) {
									cssPath = cssPath.concat(string);
								} else
									cssPath = cssPath.concat(">" + string);
								k++;
							}
						}

						List<WebElement> elements = null;
						if (repl) {
							System.out.println("cssPath :: " + cssPath);
							elements = table.findElements(By.cssSelector(cssPath));
							repl = false;
						} else {
							System.out.println("cssSelector :: " + cssSelector);
							elements = table.findElements(By.cssSelector(cssSelector));
						}
						WebElement element = elements.get(0);
						String cellText = element.getText();
						cellText = formatCellText(cellText);
						OpkeyLogger.printSaasLog(_class,
								"=========================================================================== "
										+ cellText);
						List<WebElement> dropdowns = element.findElements(
								By.xpath(".//select[not(@style='display:none') and not(@type='hidden')]"));
						if (dropdowns.size() > 0) {

							Select select = new Select(dropdowns.get(0));

							cellText = select.getFirstSelectedOption().getText();
							cellText = formatCellText(cellText);
						}

						OpkeyLogger.printSaasLog(_class,
								"=========================================================================== "
										+ cellText);
						cellText = ((cellText == null) || (cellText.equalsIgnoreCase(""))) ? cell.text() : cellText;

						List<WebElement> inputs = element.findElements(By.xpath(
								"./*[not(@style='display:none')]//input[not(@type='hidden')] | ./*[not(@style='display:none')]//textarea[not(@type='hidden')]"));

						if (inputs.size() > 0) {

							String tempCellText = "";
							cellText = tempCellText;

							for (WebElement input : inputs) {

								cellText = cellText + Utils.shadow_getObjectText(input).getOutput();
							}
						}
						output.add(cellText);
					} else
						break;
				}

				return Result.PASS().setOutput(String.join(finalDelimeter, output)).make();
			}
		}.run();
	}

	private String formatCellText(String text) {
		if (text == null) {
			return "";
		}
		return text.replaceAll("&nbsp;", " ");
	}

	public FunctionResult Method_mouseHoverInTableCelllUsingRowIndex(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String tableName) throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByRowIndex(object, columnName, rowNumber, tableName);
				System.out.println("cell objects : "+cell.getAttribute("outerHTML"));
				 List<WebElement> elementOfLink = cell.findElements(By.xpath(".//a[contains(@class,\"popover__trigger\")]"));
				 System.out.println("elementOfLink size "+elementOfLink.size());
				    if(elementOfLink.size()>0) {
				    	System.out.println("inside a element of link @535");
				    	Map<String, Integer> dragDimension = new TableByQuery().getEleSizeObj(elementOfLink.get(0));
						int dragEleX = dragDimension.get("x").intValue();
						int dragEleY = dragDimension.get("y").intValue();
						int dragEleWidth = dragDimension.get("width").intValue();
						int dragEleHeight = dragDimension.get("height").intValue();

					

						System.out.println(">>Drag Element X " + dragEleX + " Y " + dragEleY + " Width " + dragEleWidth + " Height "
								+ dragEleHeight);
					
						Robot robot = new Robot();
						robot.mouseMove(0, 0);
					//	System.out.println("Move from :: " + dragXWidth + " :: " + dragYHeight);
//						Util.getScreen().mouseMove(dragXWidth + 3, dragYHeight + 3);
						robot.mouseMove(dragEleWidth, dragEleHeight);
						
					
						
				    //	new WebObjects().ClickElement(elementOfLink.get(0));
				    	return new UnCategorised().Method_MouseHoverElement(elementOfLink.get(0));
				    }
				return new UnCategorised().Method_MouseHoverElement(cell);
			}
		}.run();
	}

	public FunctionResult Method_getRowValueInTableCellUsingRowIndex(WebDriverObject object, int rowNumber,
			String delimiter, String tableName) throws Exception {

		try {
			Validations.checkDataForNegative(0);
		} catch (ArgumentDataInvalidException e) {
			rowNumber = 0;
		}
		try {
			Validations.checkDataForBlank(1);
		} catch (ArgumentDataMissingException e) {
			delimiter = Utils.getDelimiter();
		}
		final String finalDelimeter = delimiter;
		final int finalRowNumber = rowNumber;

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = null;

				if (tableName != null && !tableName.isEmpty()) {
					table = GetTableObjectByTableName(tableName);

				} else {
					table = Finder.findWebElement(object);
				}

				TableAdpater ta = new TableAdpater(table);
				List<String> output = new ArrayList<>();

				Element[][] tableArray = ta.getTable();
				for (int i = 0; i < tableArray[finalRowNumber].length; i++) {
					Element cell = tableArray[finalRowNumber + ta.getHeaderMaxIndex()][i];
					if (cell != null) {
						String cssSelector = Utility.validateCSS(cell.cssSelector());
						System.out.println("cssSelector :: " + cssSelector);
						List<WebElement> elements = table.findElements(By.cssSelector(cssSelector));
						WebElement element = null;
						if (elements.size() == 2) {
							element = elements.get(1);
						} else
							element = elements.get(0);
						String cellText = element.getText();
						cellText = formatCellText(cellText);
						OpkeyLogger.printSaasLog(_class,
								"=========================================================================== "
										+ cellText);
						List<WebElement> dropdowns = element.findElements(
								By.xpath(".//select[not(@style='display:none') and not(@type='hidden')]"));
						if (dropdowns.size() > 0) {
							Select select = new Select(dropdowns.get(0));
							cellText = select.getFirstSelectedOption().getText();
							cellText = formatCellText(cellText);
						}
						OpkeyLogger.printSaasLog(_class,
								"=========================================================================== "
										+ cellText);

						cellText = ((cellText == null) || (cellText.equalsIgnoreCase(""))) ? cell.text() : cellText;

						List<WebElement> inputs = element.findElements(By.xpath(
								"./*[not(@style='display:none')]//input[not(@type='hidden')] | ./*[not(@style='display:none')]//textarea[not(@type='hidden')]"));
						if (inputs.size() > 0) {
							String tempCellText = "";
							cellText = tempCellText;
							for (WebElement input : inputs) {
								cellText = cellText + Utils.shadow_getObjectText(input).getOutput();
							}
						}
						output.add(cellText);

					} else {
						break;
					}
				}

				return Result.PASS().setOutput(String.join(finalDelimeter, output)).make();
			}
		}.run();
	}

	public FunctionResult Method_clickLinkInTableCellUsingRowIndex(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, String tableName) throws Exception {

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByRowIndex(object, columnName, rowNumber, tableName);
				List<WebElement> links = cell.findElements(By.xpath(".//a"));
				OpkeyLogger.printSaasLog(_class, "Number Of Links Found Are As " + links.size());
				OpkeyLogger.printSaasLog(_class, "Picking Value " + objectIndex);

				links = Utils.visible(links);
				if (links.size() == 0) {
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
							.setMessage("No Link found in Cell").make();
				}
				new WebObjects().ClickElement(links.get(objectIndex));

				return Result.PASS().setOutput(true).make();
			}
		}.run();
	}

	public FunctionResult Method_selectRadioButtonInTableCellRowIndex(WebDriverObject object, String columnName,
			int rowNumber, int objectIndex, int index, String tableName) throws Exception {

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByRowIndex(object, columnName, rowNumber, tableName);
				List<WebElement> element = cell.findElements(
						By.xpath("./*[not(@style='display:none')]//input[not(@type='hidden') and @type='checkbox']"));
				return new Radio().Method_SelectRadioButton(element.get(objectIndex), index);
			}
		}.run();
	}

	// Wire
	public FunctionResult Method_GetRowNumberByColumnName(WebDriverObject object, String columnName, String cellValue,
			int index, String tableName) throws Exception {

		Validations.checkDataForMandatoryBlankWhitespace(1);

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = null;

				if (tableName != null && !tableName.isEmpty()) {
					table = GetTableObjectByTableName(tableName);

				} else {
					table = Finder.findWebElement(object);
				}

				TableAdpater ta = new TableAdpater(table);

				int columnNumber = ta.getHeaderNumber(columnName, 0);
				String cellText = null;
				Element[][] tableObject = ta.getTable();
				OpkeyLogger.printSaasLog(_class, "Log: " + ta.getHeaderMaxIndex());
				for (int i = ta.getHeaderMaxIndex(), rowCounter = 0; i < tableObject.length; i++, rowCounter++) {
					Element cell = tableObject[i][columnNumber];
					if (cell != null) {
						String cssSelector = Utility.validateCSS(cell.cssSelector());
						System.out.println("cssSelector :: " + cssSelector);
						List<WebElement> elements = table.findElements(By.cssSelector(cssSelector));
						WebElement element = elements.get(0);

						cellText = new Utility().getCellText(element);
						System.out.println(cellText + " *******************");
					} else {
						break;
					}
					if (cellText.trim().equalsIgnoreCase(cellValue.trim())) {
						return Result.PASS().setOutput(rowCounter).make();
					}

				}

				return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND)
						.setMessage("No Cell Found With Text <"
								+ Context.current().getFunctionCall().getDataArguments().getDataArgument().get(1) + ">")
						.make();
			}
		}.run();
	}

	public FunctionResult Method_getColumnNameByRowNumber(WebDriverObject object, int rowNumber, String cellValue,
			int index, String tableName) throws Exception {
		OpkeyLogger.printSaasLog(_class, "Invoked: GetColumnNameByRowNumber SID");

		Validations.checkDataForMandatoryBlankWhitespace(1);

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement table = null;

				if (tableName != null && !tableName.isEmpty()) {
					table = GetTableObjectByTableName(tableName);

				} else {
					table = Finder.findWebElement(object);
				}

				TableAdpater ta = new TableAdpater(table);

				// int columnNumber = ta.getHeaderNumber(columnName, 0);
				String cellText = null;
				Element[][] tableObject = ta.getTable();
				for (int i = 0; i < tableObject.length; i++) {
					Element cell = tableObject[rowNumber + ta.getHeaderMaxIndex()][i];
					if (cell != null) {
						String cssSelector = Utility.validateCSS(cell.cssSelector());
						System.out.println("cssSelector :: " + cssSelector);
						List<WebElement> elements = table.findElements(By.cssSelector(cssSelector));
						WebElement element = elements.get(0);

						cellText = new Utility().getCellText(element);
						System.out.println(cellText + " *******************");
					} else {
						break;
					}
					if (cellText.trim().equalsIgnoreCase(cellValue.trim())) {

						for (int j = 0; j < tableObject.length; j++) {
							cell = tableObject[j][i];
							if (cell != null) {
								String cssSelector = Utility.validateCSS(cell.cssSelector());
								System.out.println("cssSelector :: " + cssSelector);
								List<WebElement> elements = table.findElements(By.cssSelector(cssSelector));
								WebElement element = elements.get(0);

								cellText = new Utility().getCellText(element);
								System.out.println(cellText + " *******************");
							} else {
								break;
							}
							if (!(cellText == null || cellText.equals("") || cellText.isEmpty()))
								return Result.PASS().setOutput(cellText).make();
						}

					}

				}

				return Result.FAIL(ResultCodes.ERROR_TEXT_NOT_FOUND)
						.setMessage("No Cell Found With Text <"
								+ Context.current().getFunctionCall().getDataArguments().getDataArgument().get(1) + ">")
						.make();
			}
		}.run();
	}

	public FunctionResult Method_getObjectPropertyInTableCellByRowIndex(WebDriverObject object, String columnName,
			int rowNumber, String objectTag, int tagIndex, String propertyName, String tableName) throws Exception {
		try {
			Validations.checkDataForBlank(4);
		} catch (ArgumentDataMissingException e) {
			return Result.PASS().setOutput("").setMessage("Property Not Set").make();
		}
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement cell = findTableCellByRowIndex(object, columnName, rowNumber, tableName);
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
	 * @KeywordName: OracleFussion_GetTextCountInTableColumn
	 */
	public FunctionResult Method_getTextCountInTableColumn(WebDriverObject object, String columnName, String text,
			String tableName) throws Exception {

		Validations.checkDataForMandatoryBlankWhitespace(1);

		// Get All Column values
		String values = Method_getColumnValueInTableCellUsingRowIndex(object, columnName, ";", tableName).getOutput();
		String[] columnValues = values.split(";");

		// Check matched value
		int counter = 0;
		for (String value : columnValues) {
			if (value.trim().equalsIgnoreCase(text)) {
				counter++;
			}
		}
		System.out.println("@Log Info: Total text match count is: " + counter);
		return Result.PASS().setMessage("Total text matched: " + counter).setOutput(counter).make();
	}

	/**
	 * @throws Exception
	 * @KeywordName: OracleFusion_GetTextCountInTableRow
	 */
	public FunctionResult Method_getTextCountInTableRowUsingRowIndex(WebDriverObject object, int rowNumber, String text,
			String tableName) throws Exception {
		Validations.checkDataForMandatoryBlankWhitespace(1);

		String values = Method_getRowValueInTableCellUsingRowIndex(object, rowNumber, ";", tableName).getOutput();
		String[] splitValue = values.split(";");
		int counter = 0;
		for (String value : splitValue) {
			if (text.equalsIgnoreCase(value.trim())) {
				counter++;
			}
		}
		System.out.println("@Log Info: Total text match count is: " + counter);
		return Result.PASS().setMessage("Total text matched: " + counter).setOutput(counter).make();
	}

	public FunctionResult Method_selectRowsFromTableUsingRowIndex(WebDriverObject object, String rows,
			boolean addHeadersRow, String tableName) throws Exception {

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				/*
				 * WebElement table = Finder.findWebElement(object); TableAdpater tableAdapter =
				 * null;
				 */
				/*
				 * ActionsAbstraction actionsAbstraction = ActionsAbstraction.getInstance();
				 * actionsAbstraction.pressCtrlDown();
				 */

				System.out.println("@Log: Values: " + rows);

				for (String row : rows.split(";")) {
					new Utils().waitForPageLoadAndOtherAjax();
					Thread.sleep(5000);
					WebDriverDispatcher.flagWebElement = null;
					WebElement table = null;

					if (tableName != null && !tableName.isEmpty()) {
						table = GetTableObjectByTableName(tableName);

					} else {
						table = Finder.findWebElement(object);
					}

					TableAdpater tableAdapter = new TableAdpater(table);

					System.out.println("Finding row: " + row);
					// Select the first row
					// Element cell = tableAdapter.getElement(Integer.parseInt(row.trim()), 0,
					// addHeadersRow);
					Element cell = null;
					try {
						cell = tableAdapter.getElement(Integer.parseInt(row.trim()), 0, addHeadersRow);
					} catch (Exception e) {
						throw new ObjectNotFoundException(new WebDriverObject(false, "Table", false),
								"Data Not Loaded Yet...");
					}
					if (cell != null) {

						String cssSelector = Utility.validateCSS(cell.cssSelector());
						System.out.println("cssSelector :: " + cssSelector);
						List<WebElement> elements = table.findElements(By.cssSelector(cssSelector));
						WebElement element = elements.get(0);

						System.out.println("Element: " + element);

						// new Utils().scrollMid(element);

						ActionsAbstraction actionsAbstraction2 = ActionsAbstraction.getInstance();
						actionsAbstraction2.pressKeyRobot(KeyEvent.VK_CONTROL);

						ActionsAbstraction actionsAbstraction = ActionsAbstraction.getInstance();
						actionsAbstraction.clickViaActionClass(element);

						ActionsAbstraction actionsAbstraction3 = ActionsAbstraction.getInstance();
						actionsAbstraction3.releaseKeyRobot(KeyEvent.VK_CONTROL);

						// new Utility().OF_ElementClick(element);

						// new Utility().OF_ElementClick(element);
						// Selecting and Leaving if doing it fast.
						// Thread.sleep(5 * 1000);
					} else {
						OpkeyLogger.printSaasLog(_class, "@Log Cell Not Found + " + row);
					}
				}
				// actionsAbstraction.releaseCtrlUp();
				return Result.PASS().setMessage("Rows selected").setOutput(true).make();
			}
		}.run();
	}

	public FunctionResult OF_getAllColumnCount(WebDriverObject object, String tableName) throws Exception {

		FunctionResult result = new GenericCheckpoint<FunctionResult>() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
				// TODO Auto-generated method stub
				WebElement table = null;

				if (tableName != null && !tableName.isEmpty()) {
					table = GetTableObjectByTableName(tableName);

				} else {
					table = Finder.findWebElement(object);
				}

				TableAdpater tableAdopter = new TableAdpater(table, false);
				int columncount = tableAdopter.getAllColumnCount();
				return Result.PASS().setOutput(columncount).setMessage("Done").make();
			}
		}.run();

		return result;

	}

	public FunctionResult OF_getTableRowCount(WebDriverObject object, String tableName) throws Exception {

		FunctionResult result = new GenericCheckpoint<FunctionResult>() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
				// TODO Auto-generated method stub
				WebElement table = null;

				if (tableName != null && !tableName.isEmpty()) {
					table = GetTableObjectByTableName(tableName);

				} else {
					table = Finder.findWebElement(object);
				}

				TableAdpater tableAdopter = new TableAdpater(table, false);
				int rowsCountInsideTableBody = tableAdopter.getRowsCountInsideTableBody();
				return Result.PASS().setOutput(rowsCountInsideTableBody).setMessage("Done").make();
			}
		}.run();
		return result;
	}

	public FunctionResult OF_getTableHeadersName(WebDriverObject object, String Odelimiter, String tableName)
			throws Exception {

		if (Odelimiter == null || Odelimiter.isEmpty()) {
			Odelimiter = ";";
		}

		String delimiter = Odelimiter;

		FunctionResult result = new GenericCheckpoint<FunctionResult>() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
				// TODO Auto-generated method stub
				WebElement table = null;

				if (tableName != null && !tableName.isEmpty()) {
					table = GetTableObjectByTableName(tableName);

				} else {
					table = Finder.findWebElement(object);
				}

				TableAdpater tableAdopter = new TableAdpater(table, false);
				String rowsCountInsideTableBody = tableAdopter.getTableHeadersName(delimiter);
				return Result.PASS().setOutput(rowsCountInsideTableBody).setMessage("Done").make();
			}
		}.run();
		return result;
	}

	/************************************************
	 * Dont't Cross This Line
	 * 
	 * @throws Exception
	 **********************************************************************************/
	private WebElement findTableCellByRowIndex(WebDriverObject object, String columnName, int rowNumber,
			String tableName) throws Exception {
		int columnNumber = -1;
		try {
			Validations.checkDataForBlank(0);
		} catch (ArgumentDataMissingException e) {
			columnNumber = 0;
		}
		try {
			Validations.checkDataForBlank(1);
		} catch (ArgumentDataMissingException e) {
			rowNumber = 1;
		}
        
		WebElement table = null;

		if (tableName != null && !tableName.isEmpty()) {
			table = GetTableObjectByTableName(tableName);

		} else {
			table = Finder.findWebElement(object);
		}

		TableAdpater ta = new TableAdpater(table);

		try {
			columnNumber = Integer.parseInt(columnName);
		} catch (Exception e) {
			columnNumber = ta.getHeaderNumber(columnName, 0);
		}

		Element cell = null;
		try {

			cell = ta.getElement(rowNumber, columnNumber, true);
		} catch (Exception e) {
			System.out.println("inside eception block 1st");
			throw new ObjectNotFoundException(new WebDriverObject(false, "Table", false), "Data Not Loaded Yet...");
		}
		System.out.println("***** " + cell.text());
		// OpkeyLogger.printSaasLog(_class, cell);
		String cssSelector = Utility.validateCSS(cell.cssSelector());
		System.out.println("cssSelector :: " + cssSelector);
		List<WebElement> elements = table.findElements(By.cssSelector(cssSelector));

		WebElement element = null;

		for (WebElement webElement : elements) {
			String elementText = webElement.getText();
			elementText = formatCellText(elementText);
			// OpkeyLogger.printSaasLog(_class, "***** " + elementText);
			// OpkeyLogger.printSaasLog(_class, webElement);
			if (elementText.equals(cell.text())) {
				element = webElement;
				break;
			}
		}

		System.out.println((element != null ? "Element Display : " + element.isDisplayed() : "Element is null"));

		boolean goByiD = false;

		if (element != null && elements.size() > 1 && element.getText().isEmpty()) {
			goByiD = true;
		}

		// Considering picking first row if many are found
		int objectIndex = 0;
		if (goByiD || (element == null && (elements.isEmpty() || !elements.get(0).isDisplayed()))
				|| (element != null && !element.isDisplayed())) {
			if (cell != null) {
				String id = cell.attr("opkey-uid-a");
				if (id != null && !id.isEmpty()) {
					List<WebElement> tds = table.findElements(By.xpath(".//td[@opkey-uid-a=\"" + id + "\"]"));
					if (!tds.isEmpty()) {
						element = tds.get(0);
					}
				}
			}
		}

		else if (element == null) {
			element = elements.get(objectIndex);
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
		// OpkeyLogger.printSaasLog(_class, element.getTagName());
		return element;
	}

	public WebElement GetTableObjectByTableName(String tableName) throws ToolNotSetException {
		WebElement element = null;

		element = Finder.findWebDriver().findElement(By.xpath("//div[@title=\"" + tableName
				+ "\"]//following::div[contains(@class,'xkg')]//following::div[@tabindex=\"0\" and contains(@class,'xkg')]"));
		return element;

	}

}
