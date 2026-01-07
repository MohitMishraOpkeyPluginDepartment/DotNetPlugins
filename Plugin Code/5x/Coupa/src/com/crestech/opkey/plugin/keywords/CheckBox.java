package com.crestech.opkey.plugin.keywords;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.crestech.opkey.plugin.webdriver.Finder;
import com.crestech.opkey.plugin.webdriver.Log;
import com.crestech.opkey.plugin.webdriver.OpkeyLogger;
import com.crestech.opkey.plugin.webdriver.Validations;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ObjectNotFoundException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ToolNotSetException;
import com.crestech.opkey.plugin.webdriver.keywords.Checkbox;
import com.crestech.opkey.plugin.webdriver.keywords.Utils;
import com.crestech.opkey.plugin.webdriver.keywords.WebObjects;
import com.crestech.opkey.plugin.webdriver.object.WebDriverObject;
import com.crestech.opkey.plugin.webdriver.util.Checkpoint;

public class CheckBox implements KeywordLibrary {
	
	static Class<CheckBox> _class = CheckBox.class;

	public FunctionResult Method_deSelectCheckBoxInTableCellUsingText(WebDriverObject object, String textSearch, int index, boolean isContains, boolean before) throws Exception {

		if (object.getTextToSearch().getValue() != null && (!object.getTextToSearch().getValue().isEmpty() || !object.getTextToSearch().getValue().equals(""))) {
			textSearch = object.getTextToSearch().getValue();
			OpkeyLogger.printSaasLog(_class, object.getIndex().getValue());
			try {
				index = Integer.parseInt(object.getIndex().getValue());
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "Index found Not to be Integer.Considering 0 as new Index");
				index = 0;
			}
			try {
				isContains = Boolean.parseBoolean(object.getPartialText().getValue());
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "PartialText found Not to be Boolean.Considering False as Default");
				isContains = false;
			}
			try {
				before = Boolean.parseBoolean(object.getBefore().getValue());
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "PartialText found Not to be Boolean.Considering False as Default");
				before = false;
			}
		} else {
			FunctionResult fr = null;
			try {
				fr = new Checkbox().deSelectCheckBoxHelper(textSearch, index, isContains, before);
			} catch (Exception ex) {
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
						.setMessage("No Object Found With Text <" + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue() + ">").make();
			}
			return fr;
		}
		FunctionResult fr = null;
		try {
			fr = new Checkbox().deSelectCheckBoxHelper(textSearch, index, isContains, before);
		} catch (Exception ex) {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage("No Object Found With Text <" + textSearch + ">").setOutput(false).make();
		}
		if (fr.getOutput().equalsIgnoreCase("false")) {
			fr.setMessage("No Object Found With Text <" + textSearch + ">");
		}
		return fr;

	}

	/**
	 * 
	 */
	public FunctionResult Method_selectCheckboxItemsInDropDown(WebDriverObject object, String textToSearch, int index, boolean isContains, boolean before, String valuesToSelect, String delimiter) {
		try {
			Validations.checkDataForBlank(5);
		} catch (ArgumentDataMissingException e) {
			delimiter = Utils.getDelimiter();
		}
		if (object.getTextToSearch().getValue() != null && (!object.getTextToSearch().getValue().isEmpty() || !object.getTextToSearch().getValue().equals(""))) {
			textToSearch = object.getTextToSearch().getValue();
			OpkeyLogger.printSaasLog(_class, object.getIndex().getValue());
			try {
				index = Integer.parseInt(object.getIndex().getValue());
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "Index found Not to be Integer.Considering 0 as new Index");
				index = 0;
			}
			try {
				isContains = Boolean.parseBoolean(object.getPartialText().getValue());
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "PartialText found Not to be Boolean.Considering False as Default");
				isContains = false;
			}
			try {
				before = Boolean.parseBoolean(object.getBefore().getValue());
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "PartialText found Not to be Boolean.Considering False as Default");
				before = false;
			}
		} else {
			FunctionResult fr = null;
			try {
				fr = selectCheckBoxInDropDown(textToSearch, index, isContains, before, valuesToSelect, delimiter, true);
			} catch (Exception ex) {
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
						.setMessage("No Object Found With Text <" + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue() + ">").make();
			}
			return fr;
		}
		FunctionResult fr = null;
		try {
			fr = selectCheckBoxInDropDown(textToSearch, index, isContains, before, valuesToSelect, delimiter, true);
		} catch (Exception ex) {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage("No Object Found With Text <" + textToSearch + ">").setOutput(false).make();
		}
		if (fr.getOutput().equalsIgnoreCase("false")) {
			fr.setMessage("No Object Found With Text <" + textToSearch + ">");
		}
		return fr;
	}

	public FunctionResult Method_deSelectCheckboxItemsInDropDown(WebDriverObject object, String textToSearch, int index, boolean isContains, boolean before, String valuesToSelect, String delimiter) {
		try {
			Validations.checkDataForBlank(5);
		} catch (ArgumentDataMissingException e) {
			delimiter = Utils.getDelimiter();
		}
		if (object.getTextToSearch().getValue() != null && (!object.getTextToSearch().getValue().isEmpty() || !object.getTextToSearch().getValue().equals(""))) {
			textToSearch = object.getTextToSearch().getValue();
			OpkeyLogger.printSaasLog(_class, object.getIndex().getValue());
			try {
				index = Integer.parseInt(object.getIndex().getValue());
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "Index found Not to be Integer.Considering 0 as new Index");
				index = 0;
			}
			try {
				isContains = Boolean.parseBoolean(object.getPartialText().getValue());
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "PartialText found Not to be Boolean.Considering False as Default");
				isContains = false;
			}
			try {
				before = Boolean.parseBoolean(object.getBefore().getValue());
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "PartialText found Not to be Boolean.Considering False as Default");
				before = false;
			}
		} else {
			FunctionResult fr = null;
			try {
				fr = selectCheckBoxInDropDown(textToSearch, index, isContains, before, valuesToSelect, delimiter, false);
			} catch (Exception ex) {
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
						.setMessage("No Object Found With Text <" + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue() + ">").make();
			}
			return fr;
		}
		FunctionResult fr = null;
		try {
			fr = selectCheckBoxInDropDown(textToSearch, index, isContains, before, valuesToSelect, delimiter, false);
		} catch (Exception ex) {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage("No Object Found With Text <" + textToSearch + ">").setOutput(false).make();
		}
		if (fr.getOutput().equalsIgnoreCase("false")) {
			fr.setMessage("No Object Found With Text <" + textToSearch + ">");
		}
		return fr;
	}

	private FunctionResult selectCheckBoxInDropDown(String textToSearch, int index, boolean isContains, boolean before, String valuesToSelect, String delimiter, boolean isSelectKeyword)
			throws Exception {
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// Type by text as blank data in order to open dropdown
				Method_clickInputBoxUsingLabelText(textToSearch, index, isContains, false);

				new Utils().waitForAjaxAndJqueryToLoad();

				// Check for the dropdown Open or Not
				WebElement dropdown = waitForDropdown();

				// Split the value given by user
				String[] values = valuesToSelect.split(delimiter);

				String message = "";

				for (String value : values) {

					// Search for list Item Within Dropdown
					List<WebElement> listItem = dropdown.findElements(By.xpath(".//li[@class and contains(.,\"" + value.trim() + "\")]"));

					// Search for checkBox Item within List Item
					List<WebElement> checkboxs = listItem.get(0).findElements(By.xpath(".//input[@type=\"checkbox\"]"));

					// Perform action on the first Checkbox found
					WebElement checkBox = checkboxs.get(0);

					if (isSelectKeyword) {
						// Check for the checkbox is already selected
						boolean isSelected = checkBox.isSelected();
						if (isSelected) {
							// CheckBox is already Selected
							message = message + " Checkbox With Value <" + value + "> is already Selected\n";
						} else {
							// CheckBox is not Selected, select It
							message = message + " Selecting CheckBox With Value <" + value + ">\n";
							try {
								new WebObjects().Method_clickUsingJavaScript(checkBox);
							} catch (Exception e) {
								e.printStackTrace();
							}
						}
					} else {
						// Check for the checkbox is already selected
						boolean isSelected = checkBox.isSelected();
						if (!isSelected) {
							// CheckBox is already Selected
							message = message + " Checkbox With Value <" + value + "> is already DeSelected\n";
						} else {
							// CheckBox is not Selected, select It
							message = message + " DeSelecting CheckBox With Value <" + value + ">\n";
							new WebObjects().Method_clickUsingJavaScript(checkBox);
						}
					}
				}

				// To close the Dropdown Clicking on label
				new WebObjects().Method_clickByText(textToSearch, index, isContains, "", "");

				return Result.PASS().setOutput(true).setMessage(message).make();

			}
		}.run();
	}

	private WebElement waitForDropdown() throws ToolNotSetException {
		OpkeyLogger.printSaasLog(_class, "INSIDE DROPDOWN FINDING");
		List<WebElement> dropdowns = new ArrayList<WebElement>();
		do {
			dropdowns = Finder.findWebDriver().findElements(By.xpath("//*[@class=\"AFPopupMenuContent\" or @class=\"mlistbox\"]"));
			OpkeyLogger.printSaasLog(_class, "NUMBER OF DROPDOWN OPENEND FOUND " + dropdowns.size());
		} while (dropdowns.size() < 1);
		return dropdowns.get(0);
	}

	private FunctionResult Method_clickInputBoxUsingLabelText(String textSearch, int index, boolean isContains, boolean before)
			throws InterruptedException, ToolNotSetException, ObjectNotFoundException, ArgumentDataMissingException {
		new Utils().someChecksBeforeTextKeywords();
		Boolean foundByPlaceholder = false;
		
		textSearch = textSearch.trim();

		if (textSearch.trim().length() == 0) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setMessage("Text is not provided").setOutput(false).make();
		}
		List<WebElement> eles = new ArrayList<>();

		try {
			eles = Finder.findElementByText(textSearch, isContains, index);
		} catch (Exception e) {
			
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
					.setMessage("No Object Found With Text <" + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue() + ">").make();
		}
		
		if (eles.size() == 0) {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
					.setMessage("No Object Found With Text <" + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue() + ">").make();
		}
		String xpath;
		WebElement ele = eles.get(index);
		OpkeyLogger.printSaasLog(_class, "ELE = " + ele);
		if (!before) {
			String forAttr = ele.getAttribute("for");
			OpkeyLogger.printSaasLog(_class, "ELE1 = " + ele);
			OpkeyLogger.printSaasLog(_class, forAttr != null && !forAttr.isEmpty());

			try {
				if (forAttr != null && !forAttr.isEmpty()) {
					WebElement editBox = Finder.findWebDriver().findElement(By.id(forAttr));
					if (editBox != null && editBox.getAttribute("type").equalsIgnoreCase("text")) {
						new WebObjects().ClickElement(editBox);
						return Result.PASS().setOutput(true).make();
					}
				}
			} catch (Exception e) {
				Log.debug(e.getMessage());
			}
		}
		
		List<WebElement> list = new ArrayList<WebElement>();

		if (before) {
			OpkeyLogger.printSaasLog(_class, "before");
			xpath = "./preceding::textarea | ./preceding::input[@type='text' or @type='email' or @type='password' or not(@type) or @type='number' or @type='search' or @type='tel' or @type='url' or @type='date' or @type='datelocal' or @type='datetime-local' or @type='month' or @type='time' or @type='week']";
			list = ele.findElements(By.xpath(xpath));
		} else {
			// for placeholder
			OpkeyLogger.printSaasLog(_class, "After");
			String xpathForPlaceholder = ".//self::input[@type='text' or @type='email' or @type='password' or not(@type) or @type='number' or @type='search' or @type='tel' or @type='url' or @type='date' or @type='datelocal' or @type='datetime-local' or @type='month' or @type='time' or @type='week'] | self::textarea";
			WebElement eleForPlaceholder = null;
			try {
				eleForPlaceholder = ele.findElement(By.xpath(xpathForPlaceholder));
			} catch (Exception e) {
			}
			if (eleForPlaceholder != null) {
				OpkeyLogger.printSaasLog(_class, "eph : " + eleForPlaceholder);
				foundByPlaceholder = true;
			} else {
				OpkeyLogger.printSaasLog(_class, "eph else : ");
				xpath = ".//input | ./textarea | ./input[@type='text' or @type='email' or @type='password' or not(@type) or @type='number' or @type='search' or @type='tel' or @type='url' or @type='date' or @type='datelocal' or @type='datetime-local' or @type='month' or @type='time' or @type='week'] | ./following::textarea | ./following::input[@type='text' or @type='email' or @type='password' or not(@type) or @type='number' or @type='search' or @type='tel' or @type='url' or @type='date' or @type='datelocal' or @type='datetime-local' or @type='month' or @type='time' or @type='week']";
				list = ele.findElements(By.xpath(xpath));
				OpkeyLogger.printSaasLog(_class, "Size: " + list.size() + " Xpath: " + xpath);
			}
		}

		if (!foundByPlaceholder) {
			OpkeyLogger.printSaasLog(_class, "!foundByPlaceholder");
			if (list.size() > 0) {
				if (before) {
					ele = list.get(list.size() - 1);

				} else {
					ele = list.get(0);
				}
			}
		}

		if (ele != null) {
			try {
				OpkeyLogger.printSaasLog(_class, "Typing");
				List<WebElement> innerElement = ele.findElements(By.xpath("./input"));
				if (innerElement.size() == 0)
				new WebObjects().ClickElement(ele);
				else
				new WebObjects().ClickElement(innerElement.get(0));

			} catch (Exception ex) {
				if (list.size() > 1) {
					if (before) {
						ele = list.get(list.size() - 2);
					} else {
						ele = list.get(1);
					}
					new WebObjects().ClickElement(ele);
				} else
					throw ex;
			}
			return Result.PASS().setOutput(true).make();
		}

		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND)
				.setMessage("No Object Found With Text <" + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue() + ">").setOutput(false).make();
	}

}
