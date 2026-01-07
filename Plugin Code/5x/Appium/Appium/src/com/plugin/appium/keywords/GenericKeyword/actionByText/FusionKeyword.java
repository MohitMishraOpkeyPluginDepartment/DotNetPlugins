package com.plugin.appium.keywords.GenericKeyword.actionByText;

import java.awt.AWTException;
import java.awt.Robot;
import java.awt.event.KeyEvent;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.ElementNotVisibleException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.Validations;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.GenericKeyword.WebObjects;
import com.plugin.appium.util.Checkpoint;

public class FusionKeyword implements KeywordLibrary {

	static Class<FusionKeyword> _class = FusionKeyword.class;

	public FunctionResult Appium_OF_selectDropDownByText(String OlabelSearch, int Oindex, boolean OisContains,
			String dropdownText, boolean Obefore, boolean isMultipleDropdown, AppiumObject object) throws Exception {
		String labelSearch = OlabelSearch;
		int index = Oindex;
		boolean isContains = OisContains;
		boolean before = Obefore;
		if(dropdownText.length()==0 || dropdownText==null) {
            return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setMessage("Please Provide Value It cannot be blank").setOutput(false).make();
        }
	
		

		if (object.getTextToSearch().getValue() != null && (!object.getTextToSearch().getValue().isEmpty()
				|| !object.getTextToSearch().getValue().equals(""))) {
			System.out.println(object.getTextToSearch().getValue());
			labelSearch = object.getTextToSearch().getValue();
			System.out.println(object.getIndex().getValue());
			try {
				index = Integer.parseInt(object.getIndex().getValue());
			} catch (Exception ex) {
				System.out.println("Index found Not to be Integer.Considering 0 as new Index");
				index = 0;
			}
			System.out.println(object.getPartialText().getValue());
			try {
				isContains = Boolean.parseBoolean(object.getPartialText().getValue());
			} catch (Exception ex) {
				System.out.println("PartialText found Not to be Boolean.Considering False as Default");
				isContains = false;
			}

			try {
				before = Boolean.parseBoolean(object.getBefore().getValue());
				System.out.println("before:" + before);
			} catch (Exception ex) {
				System.out.println("PartialText found Not to be Boolean.Considering False as Default");
				isContains = false;
			}
		} else {
			Validations.checkDataForBlank(0);
			Validations.checkDataForNegative(1);
			FunctionResult fr = selectDropDownByText(labelSearch, index, isContains, dropdownText, before,
					isMultipleDropdown);
			if (fr.getOutput().equalsIgnoreCase("false")) {
				fr.setMessage("No Object Found With Text <"
						+ Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue()
						+ ">");
			}
			return fr;
		}

		FunctionResult fr = selectDropDownByText(labelSearch, index, isContains, dropdownText, before,
				isMultipleDropdown);
		if (fr.getOutput().equalsIgnoreCase("false")) {
			fr.setMessage("No Object Found With Text <" + labelSearch + ">");
		}
		return fr;
	}

	private FunctionResult selectDropDownByText(String OlabelSearch, int Oindex, boolean OisContains,
			String dropdownText, boolean before, boolean isMultipleDropdown) throws Exception {
		return selectDropDownByText(OlabelSearch, Oindex, OisContains, dropdownText, 0, before, isMultipleDropdown);

	}

	protected FunctionResult selectDropDownByText(String OlabelSearch, int Oindex, boolean OisContains,
			String dropdownText, int dropDownIndex, boolean before, boolean isMultipleDropdown) throws Exception {
		String finalDropdownText = dropdownText.trim();
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun() throws Exception {

				WebElement dropdownElement = getDropdownElementByText(OlabelSearch, Oindex, OisContains, dropdownText,
						dropDownIndex, before);
				if (dropdownElement == null)
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
							.setMessage("Dropdown not found With Text <" + Context.current().getFunctionCall()
									.getDataArguments().getDataArgument().get(0).getValue() + ">")
							.make();
Utils.performClick(dropdownElement);
return selectDropDownOptionByText(finalDropdownText);
//return selectDropDownOptionByText(dropdownElement, isMultipleDropdown, finalDropdownText);
				/*
				 * if (dropdownElement.getTagName().equalsIgnoreCase("select")) { return
				 * selectDropDownOptionByText(dropdownElement, isMultipleDropdown,
				 * finalDropdownText); }
				 */

				// It is a ComboBox
				//return selectComboBoxOptionByText(dropdownElement, dropdownText);
			}
		}.run();
	}

	protected FunctionResult getDropDownTextByText(String OlabelSearch, int Oindex, boolean OisContains,
			String dropdownText, int dropDownIndex, boolean before, boolean isMultipleDropdown) throws Exception {
		String finalDropdownText = dropdownText.trim();
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun() throws Exception {

				String texts = "";

				WebElement dropdownElement = getDropdownElementByText(OlabelSearch, Oindex, OisContains, dropdownText,
						dropDownIndex, before);
				if (dropdownElement == null)
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
							.setMessage("Dropdown not found With Text <" + Context.current().getFunctionCall()
									.getDataArguments().getDataArgument().get(0).getValue() + ">")
							.make();

				if (dropdownElement.getTagName().equalsIgnoreCase("select")) {
					dropdownElement.click();
					texts = getSelectTagtext(dropdownElement);
				}

				// It is a ComboBox
				texts = getComboBoxTextByText(dropdownElement);

				return Result.PASS().setOutput(texts).make();
			}

		}.run();
	}

	private String getSelectTagtext(WebElement dropdownElement) {
		String html = dropdownElement.getAttribute("outerHTML");
		List<String> texts = new ArrayList<String>();

		Document selectDoc = Jsoup.parse(html);

		Elements options = selectDoc.select("option");

		for (Element option : options) {

			String t = option.text();

			if (t.trim().isEmpty()) {
				continue;
			}

			texts.add(t);
		}

		return texts.toString();
	}

	/**
	 * 
	 * @CheckPoint True
	 * 
	 * 
	 */

	private WebElement getDropdownElementByText(String labelSearch, int index, boolean isContains, String dropdownText,
			boolean before) {
		return getDropdownElementByText(labelSearch, index, isContains, dropdownText, 0, before);
	}

	private WebElement getDropdownElementByText(String labelSearch, int lebelIndex, boolean isContains,
			String dropdownText, int dropdownIndex, boolean before) {
		someChecksBeforeTextKeywords();
		labelSearch = labelSearch.trim();
		List<WebElement> eles = new ArrayList<WebElement>();
		try {
			eles = Finder.findElementByText(labelSearch, isContains, lebelIndex);
		} catch (Exception e) {
			return null;
		}
		if (eles.size() == 0)
			return null;

		System.out.println(eles.size());

		WebElement labelElement = eles.get(lebelIndex);

		WebElement dropdownElement = null;

		String xpath = null;

		/* *********************** */
		if (before) {
			xpath = ".//preceding::*[not(@type='hidden') and (self::select or self::input or self::input[@role='combobox'] or self::a[@title=\"Search: "
					+ labelSearch + "\"] or self::a[@title=\"Search:  " + labelSearch
					+ "\"] or self::a[@title=\"Search\"])]";
		} else {
			xpath = ".//following::*[not(@type='hidden') and (self::select or self::input or self::input[@role='combobox'] or self::a[@title=\"Search: "
					+ labelSearch + "\"] or self::a[@title=\"Search:  " + labelSearch + "\"] or self::a[@title=\""
					+ labelSearch + "\"]  or self::a[@title=\"Search\"])]";
		}

		try {

			System.out.println("finding dropdown by xpath: " + xpath);

			List<WebElement> list = labelElement.findElements(By.xpath(xpath));

			System.out.println(list.size());

			WebElement tempdropdownElement;
			if (before) {

				List<WebElement> reverseList = new ArrayList<>(list);
				Collections.reverse(reverseList);

				WebElement dropDownEle = reverseList.get(dropdownIndex);

				if (dropDownEle.getTagName().toLowerCase().equals("input")) {
					for (int i = dropdownIndex; i < reverseList.size(); i++) {
						if (reverseList.get(i).getTagName().toLowerCase().equals("a")) {
							return reverseList.get(i);
						}
					}
				} else if (dropDownEle.getTagName().toLowerCase().equals("select")) {
					return dropDownEle;
				}

				for (WebElement ele : reverseList) {

					System.out.println(ele.getAttribute("outerHTML"));

					if (ele.getTagName().toLowerCase().equals("a")) {
						return ele;
					}
				}

				return dropDownEle;

			} else {
				
System.out.println("list size is " + list.size() + "index given is " + dropdownIndex);
if(list.size() == 0)
{   
	
	Log.print("List size is zero");
	String str = "//*[@text=\""+labelSearch+"\"]";
	Log.print("text xpath is" + str);
	list = Finder.findAppiumDriver().findElementsByXPath(str);
	System.out.println("list size after finding by text is " + list.size());
	if(list.size() == 0)
	{
		
		return null;
	}
	
}
				WebElement dropdownEle = list.get(dropdownIndex);
				if (dropdownEle.getTagName() == null && list.size() == 1) {
					Log.print("single element found, returning it");
				return dropdownEle;
				}
				//what if tag name is null in case of multiple?? fix it
				
				if (dropdownEle.getTagName().toLowerCase().equals("input")) {

					if ((list.size() >= dropdownIndex + 2)
							&& list.get(dropdownIndex + 1).getTagName().toLowerCase().equals("a")) {
						return list.get(dropdownIndex + 1);
					}

					/*
					 * for(int i = dropdownIndex; i < list.size(); i++) {
					 * if(list.get(i).getTagName().toLowerCase().equals("a")) { return list.get(i);
					 * } }
					 */
				} else if (dropdownEle.getTagName().toLowerCase().equals("select")) {
					return dropdownEle;
				}

				for (WebElement ele : list) {
					if (ele.getTagName().toLowerCase().equals("a")) {
						// return ele;
					}
				}

				return dropdownEle;
			}

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public String getComboBoxTextByText(WebElement dropdownElement) throws Exception {

		WebElement div = getDiv(dropdownElement);
		String outerHTML = div.getAttribute("outerHTML");
		Document doc = Jsoup.parse(outerHTML);
		Elements spans = doc.select("span");
		List<String> texts = new ArrayList<String>();

		for (Element span : spans) {
			String t = span.text();

			if (t.trim().isEmpty()) {
				continue;
			}

			texts.add(t);
		}

		return texts.toString();

	}

	public FunctionResult selectComboBoxOptionByText(WebElement dropdownElement, String dropdownText) throws Exception {
		new WebObjects().ClickElement(dropdownElement);

		Thread.sleep(2000);

		String id = dropdownElement.getAttribute("id");

		if (id.endsWith("::content")) {
			id = id.substring(0, id.lastIndexOf("::content"));
		} else if (id.endsWith("::lovIconId")) {
			id = id.substring(0, id.lastIndexOf("::lovIconId"));
		}

		System.out.println("Id found is: " + id);

		WebElement div = null;

		if (id != null && !id.isEmpty()) {
			List<WebElement> popups = Finder.findAppiumDriver().findElements(
					By.xpath("//div[@data-afr-popupid=\"" + id + "\"]//div[@class=\"AFPopupMenuContent\"]"));
			System.out.println("popups found is: " + popups.size());

			if (popups.isEmpty()) {

				id = id + "::dropdownPopup";

				popups = Finder.findAppiumDriver().findElements(By.xpath("//div[@data-afr-popupid=\"" + id + "\"]"));
				System.out.println("popups found is: " + popups.size());

			}

			if (!popups.isEmpty()) {

				// List<WebElement> visPopups = Utils.visible(popups);
				System.out.println("vis popups found is: " + popups.size());
				if (!popups.isEmpty()) {
					div = popups.get(0);
				}

			}

		}

		if (div == null) {
			try {
				div = Finder.findAppiumDriver().findElement(By.className("AFPopupMenuContent"));
				System.out.println("@DIVOPTION: " + div);
			} catch (Exception e) {
				div = Finder.findAppiumDriver()
						.findElement(By.xpath("//*[@id=\"__af_Z_window\" and @class=\"AFZOrderLayer\"]"));
			}
		}

		WebElement option = div.findElement(By.xpath(".//*[text()='" + dropdownText + "']"));

		try {

			/*
			 * try { new Utils().scrollIntoView(option); } catch (RetryKeywordAgainException
			 * e) { // TODO Auto-generated catch block e.printStackTrace(); }
			 */
//			if (Finder.findAppiumDriver() instanceof InternetExplorerDriver) {
//				List<WebElement> ulEl = option.findElements(By.xpath("(.//ancestor::ul)[last()]"));
//				if (!ulEl.isEmpty()) {
//					if (ulEl.get(0).getAttribute("class").contains("p_AFScroll")) {
//						((JavascriptExecutor) Finder.findAppiumDriver())
//								.executeScript("arguments[0].scrollIntoView(false);", option);
//					}
//				}
//				// ((JavascriptExecutor)
//				// Finder.findWebDriver()).executeScript("arguments[0].scrollIntoView(false);",
//				// option);
//			}

			new WebObjects().ClickElement(option);

		} catch (ElementNotVisibleException e) {
			// Try Clicking Using Javascript
			new WebObjects().Method_clickUsingJavaScript(option);
		}
		return Result.PASS().setOutput(true).make();
	}

	private WebElement getDiv(WebElement dropdownElement) throws Exception {

		new WebObjects().Method_highlightElement(dropdownElement);

		new WebObjects().ClickElement(dropdownElement);
		Thread.sleep(2000);

		new Utils().waitForPageLoadAndOtherAjax();

		WebElement div;
		try {
			div = Finder.findAppiumDriver().findElement(By.className("AFPopupMenuContent"));
			System.out.println("@DIVOPTION: " + div);
		} catch (Exception e) {
			div = Finder.findAppiumDriver()
					.findElement(By.xpath("//*[@id=\"__af_Z_window\" and @class=\"AFZOrderLayer\"]"));
		}

		return div;

	}

	// First actions performed inside text keywords
	public void someChecksBeforeTextKeywords() {
		Finder.textElementsList.clear();
	}

	public FunctionResult selectDropDownOptionByText(WebElement dropdownElement, boolean isMultipleDropdown,
			String dropdownText) throws ToolNotSetException, InterruptedException, AWTException {

//		new WebObjects().shadow_highlightElement(dropdownElement);
		Select select = new Select(dropdownElement);
		if (!isMultipleDropdown) {
			try {

				if (dropdownText.equalsIgnoreCase("{blank}")) {
					select.selectByIndex(0);
				} else
					select.selectByVisibleText(dropdownText);

			} catch (Exception e) {
				e.printStackTrace();
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage("No Object Found With Text <"
						+ Context.current().getFunctionCall().getDataArguments().getDataArgument().get(3).getValue()
						+ ">").setOutput(false).make();
			}
			return Result.PASS().setOutput(true).make();
		}

		Robot robot = new Robot();
		robot.keyPress(KeyEvent.VK_CONTROL);
		try {
			select.selectByVisibleText(dropdownText);
		} catch (Exception e) {
			e.printStackTrace();
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND)
					.setMessage("No Object Found With Text <"
							+ Context.current().getFunctionCall().getDataArguments().getDataArgument().get(3).getValue()
							+ ">")
					.setOutput(false).make();
		}
		robot.keyRelease(KeyEvent.VK_CONTROL);

		return Result.PASS().setOutput(true).make();

	}
	public FunctionResult selectDropDownOptionByText(
			String dropdownText) throws ToolNotSetException, InterruptedException, AWTException {


		List<WebElement> eles = new ArrayList<WebElement>();
			
			
			String str = "//*[@text=\""+dropdownText+"\"]";
			Log.print("text xpath is" + str);
			try {
				eles = Finder.findAppiumDriver().findElementsByXPath(str);
			} catch (Exception e) {
				Log.print("element not found" + e.getMessage());
				eles.clear();
				
			}
			
			
			System.out.println("list size after finding by text is " + eles.size());
			if(eles.size() == 0)
			{
				
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND)
				.setMessage("No Object Found With Text <"
						+ Context.current().getFunctionCall().getDataArguments().getDataArgument().get(3).getValue()
						+ ">")
				.setOutput(false).make();
			}
			
			eles.get(0).click();
			//what if we found multiple elements?
			return Result.PASS().setOutput(true).make();
		}
		
	}


