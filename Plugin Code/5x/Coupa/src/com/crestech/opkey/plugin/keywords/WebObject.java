package com.crestech.opkey.plugin.keywords;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.crestech.opkey.plugin.webdriver.Finder;
import com.crestech.opkey.plugin.webdriver.OpkeyLogger;
import com.crestech.opkey.plugin.webdriver.WebDriverDispatcher;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ObjectNotFoundException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ToolNotSetException;
import com.crestech.opkey.plugin.webdriver.keywords.Utils;
import com.crestech.opkey.plugin.webdriver.object.WebDriverObject;
import com.crestech.opkey.plugin.webdriver.util.Checkpoint;
import com.crestech.opkey.plugin.webdriver.util.GenericCheckpoint;

public class WebObject implements KeywordLibrary {

	static Class<WebObject> _class = WebObject.class;

	public FunctionResult OF_GetObjectTextByLabel(String OtextSearch, int Oindex, boolean OisContains, boolean Obefore,
			WebDriverObject object) throws Exception {
		WebDriverDispatcher.isGetKeyword = true;
		String textSearch = OtextSearch;
		int index = Oindex;
		boolean isContains = OisContains;
		boolean before = Obefore;

		if (object.getTextToSearch().getValue() != null && (!object.getTextToSearch().getValue().isEmpty()
				|| !object.getTextToSearch().getValue().equals(""))) {
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
			fr = OF_GetObjectTextByLabelHelper(textSearch, index, isContains, before);

			return fr;
		}
		FunctionResult fr = null;
		fr = OF_GetObjectTextByLabelHelper(textSearch, index, isContains, before);
		if (fr.getOutput().equalsIgnoreCase("false")) {
			fr.setMessage("No Object Found With Text <" + textSearch + ">");
		}
		return fr;

	}

	private FunctionResult OF_GetObjectTextByLabelHelper(String OtextSearch, int Oindex, boolean OisContains,
			boolean Obefore) throws Exception {

		/*
		 * WebElement ele; boolean isEditBox = false; try { ObjectProperty byTextObject
		 * = new ObjectProperty(WEB_ELEMENT.EDITBOX, OtextSearch, Oindex, OisContains,
		 * Obefore); ele = FinderByText.findWebElement(byTextObject); isEditBox = true;
		 * 
		 * } catch (Exception e) { ObjectProperty byTextObject = new
		 * ObjectProperty(WEB_ELEMENT.SELECT, OtextSearch, Oindex, OisContains,
		 * Obefore); ele = FinderByText.findWebElement(byTextObject); }
		 * 
		 * final WebElement element = ele; final boolean isEdit = isEditBox;
		 */

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				try {

					List<WebElement> eleLabels = Finder.findElementByText(OtextSearch, OisContains, Oindex);

					WebElement eleLabel = eleLabels.get(Oindex);

					try {
						// When label value present inside parent of label tag
						WebElement parentElement = eleLabel
								.findElement(By.xpath(".//parent::div[@class=\"inline_form_element\"]"));

						if (parentElement != null) {
							String fullText = parentElement.getText();
							System.out.println("full text: " + fullText);

							// Remove text of all children
							for (WebElement child : parentElement.findElements(By.xpath(".//*"))) {
								String childText = child.getText().trim();
								if (!childText.isEmpty()) {
									fullText = fullText.replace(childText, "").trim();
								}
							}

							fullText = fullText.trim();
							System.out.println("full text after removing child text: " + fullText);

							if (fullText != null && !fullText.isEmpty()) {
								return Result.PASS().setOutput(fullText).make();
							}
						}
					} catch (Exception e) {
						System.out.println(e.getMessage());
						e.printStackTrace();
					}

					String xpath = ".//following::*[normalize-space(text()) != \"\" or  self::input or normalize-space(@value) != \"\" or normalize-space(@placeholder) != \"\"]";

					List<WebElement> elements = eleLabel.findElements(By.xpath(xpath));

					WebElement element = elements.get(0);

					new Utils().scrollIntoView(element);

					String tag = element.getTagName();

					boolean isEdit = false;
					boolean isDropDown = false;
					if (tag.toLowerCase().equals("input")) {
						isEdit = true;
					} else if (tag.toLowerCase().equals("option")) {
						isDropDown = true;
						element = element.findElement(By.xpath(".//ancestor::select[position() = 1]"));
					}

					if (element != null) {
						new Utils().scrollIntoView(element);
					}

					if (isEdit)
						return Utils.shadow_getObjectText(element);
					else if (isDropDown) {
						String value = getDropdownText(element);
						return Result.PASS().setOutput(value).make();
					} else {
						return Result.PASS().setOutput(element.getText()).make();
					}

				} catch (StaleElementReferenceException e) {
					OpkeyLogger.printSaasLog(_class, "@Handled Exception While fetching data: " + e.getMessage());
					throw e;
				} catch (Exception e) {
					e.printStackTrace();
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput("").make();
				}
			}
		}.run();
	}

	public FunctionResult Custom_Method_StringContains(String parent, String child, boolean ignoreCase) {
		if (ignoreCase) {
			return Result.PASS().setOutput(parent.toLowerCase().contains(child.toLowerCase())).make();
		} else {
			System.out.println("parent.contains(child) trimm  : " + parent.trim().contains(child.trim()));
			OpkeyLogger.printSaasLog(null, "parent.contains(child)   : " + parent.contains(child));
			System.out.println("parent.contains(child)   : " + parent.contains(child));
			System.out.println("parent-----    : " + parent);
			System.out.println("child----   : " + child);
			return Result.PASS().setOutput(parent.contains(child)).make();
		}
	}

	private String getDropdownText(WebElement ele) {
		String text = "";
		Select select = new Select(ele);
		if (select.isMultiple()) {
			List<WebElement> options = select.getAllSelectedOptions();
			List<String> textEles = new ArrayList<>();
			for (WebElement option : options) {
				/*- Get Text is not working in classic Multiple Dropdown (returning value blank) that's why using value attribute */
				textEles.add(option.getAttribute("value"));
			}
			text = Utils.joinToStringArray(textEles, ";");
		} else {
			text = select.getFirstSelectedOption().getText();
		}
		return text;
	}

	public FunctionResult Method_OF_ZoomOut(WebDriverObject object) throws Exception {
		WebElement element = new GenericCheckpoint<WebElement>() {

			@Override
			public WebElement _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
				// TODO Auto-generated method stub
				new Utils().waitForPageLoadAndOtherAjaxIfTrue();
				return Finder.findWebElement(object);
			}
		}.run();

		new Utils().waitForPageLoadAndOtherAjaxIfTrue();
		String attrForm = "arguments[0].setAttribute('transform', '%s');";
		attrForm = String.format(attrForm,
				"matrix(0.3371443627221548,0,0,0.3371443627221548,68.99448835038925,48.24180658787702)");
		JavascriptExecutor jsExecutor = (JavascriptExecutor) Finder.findWebDriver();
		jsExecutor.executeScript(attrForm, element);
		return Result.PASS().setOutput(true).make();
	}

}
