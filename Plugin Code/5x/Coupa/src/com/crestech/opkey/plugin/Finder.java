package com.crestech.opkey.plugin;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.keywords.WebObject;
import com.crestech.opkey.plugin.webdriver.FinderOverride;
import com.crestech.opkey.plugin.webdriver.Log;
import com.crestech.opkey.plugin.webdriver.OpkeyLogger;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ObjectNotFoundException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.TimeOut_ObjectNotFoundException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ToolNotSetException;
import com.crestech.opkey.plugin.webdriver.finders.JSFinder;
import com.crestech.opkey.plugin.webdriver.keywords.Utils;
import com.crestech.opkey.plugin.webdriver.object.WebDriverObject;
import com.crestech.opkey.plugin.webdriver.object.WebDriverObjectProperty;

public class Finder extends FinderOverride {

	static Class<WebObject> _class = WebObject.class;

	@Override
	public List<WebElement> findElements(WebDriverObject object) throws ToolNotSetException, IOException,
			InterruptedException, ObjectNotFoundException, TimeOut_ObjectNotFoundException {
		List<WebElement> webElementList = new ArrayList<WebElement>();
		List<WebElement> tempWebElementList = new ArrayList<WebElement>();

		OpkeyLogger.printSaasLog(_class, ">>>>>>>>>> OF specific Finder");
		String tag = object.getTagName().isValueNullOrEmpty() ? "*" : object.getTagName().getValue();

		// Neon has requested for this change
		// Finding element first by its innerText
		// *******************************STARTS**************************************
		String innerText = (object.getInnerText().isUsed() && !object.getInnerText().isValueNullOrEmpty())
				? object.getInnerText().getValue()
				: null;

		if (innerText == null || innerText.isEmpty())
			innerText = (object.getTextContent().isUsed() && !object.getTextContent().isValueNullOrEmpty())
					? object.getTextContent().getValue()
					: null;

		if (innerText != null && !innerText.isEmpty()) {
			tempWebElementList = JSFinder.findElementByJsFinder(tag, "", "", innerText, "", "", "", "", "");
			tempWebElementList = Utils.visible(tempWebElementList);
			if (tempWebElementList.size() == 1) {
				OpkeyLogger.printSaasLog(_class, ">>Found By InnerText By JS");
				return tempWebElementList;
			}
			/*
			 * else { tempWebElementList =
			 * com.crestech.opkey.plugin.webdriver.Finder.findElementByText(innerText,
			 * false, 0, tag); tempWebElementList =
			 * Utils.getVisibleEles(tempWebElementList); if (tempWebElementList.size() == 1)
			 * { return tempWebElementList; } }
			 */
		}
		// *******************************ENDS**************************************

		if (!(object.getId().getValue() == null)) {
			String id = object.getId().getValue().trim();
			if (object.getId().isUsed() && !id.isEmpty() && !id.contains(";")) {
				if (!tag.isEmpty() && tag.equalsIgnoreCase("input") && !object.getInputType().isValueNullOrEmpty()
						&& object.getInputType().getValue().equals("radio")) {
					System.out.println("yes radio.");
					tempWebElementList = com.crestech.opkey.plugin.webdriver.Finder.findWebDriver()
							.findElements(By.xpath("//label[@for=\"" + id + "\"]"));
				}

				if (tempWebElementList.isEmpty()) {
					tempWebElementList = com.crestech.opkey.plugin.webdriver.Finder.findWebDriver()
							.findElements(By.id(object.getId().getValue().trim()));
				}
				if (tempWebElementList.size() == 1)

					return tempWebElementList;
			}
		}

		ArrayList<String> customXpaths = getCustomXpaths1(object);

		// Added Finding Element By JSFinder
		String xpathForJSFinder = String.join("@#@", customXpaths);

		tempWebElementList = JSFinder.findElementByJsFinder("", "", "", "", "", "", xpathForJSFinder, "", "");
		tempWebElementList = Utils.getVisibleEles(tempWebElementList);
		if (tempWebElementList.size() == 1) {
			webElementList.clear();
			webElementList.addAll(tempWebElementList);
			return webElementList;
		}

		for (String xpath : customXpaths) {

			tempWebElementList = com.crestech.opkey.plugin.webdriver.Finder.findWebDriver()
					.findElements(By.xpath(xpath));
			tempWebElementList = Utils.getVisibleEles(tempWebElementList);
			if (tempWebElementList.size() == 1) {
				webElementList.clear();
				webElementList.addAll(tempWebElementList);
				return webElementList;
			}
		}
		return new ArrayList<WebElement>();
	}

	private ArrayList<String> getCustomXpaths1(WebDriverObject object) throws ToolNotSetException {
		ArrayList<String> xpaths = new ArrayList<String>();
		String xpath = null;
		// Making xpath on basis of Label.
		String tag = object.getTagName().getValue();
		if (!object.getOF_Label_text().isValueNullOrEmpty() && object.getOF_Label_text().isUsed()) {
			String label_text = object.getOF_Label_text().getValue();

			// Let's Find the object int basis of label-for attribute
			String xPathByForAttr = getXpathByForAttribute(object);
			OpkeyLogger.printSaasLog(_class, "@Log Info: Founded xPath by for attribute: " + xPathByForAttr);
			if (xPathByForAttr != null) {
				xpaths.add(xPathByForAttr);
				OpkeyLogger.printSaasLog(_class, "@Log Info: Added xPath by for attribute: " + xPathByForAttr);
			}

			if (!object.getLabelText().isValueNullOrEmpty()) {
				xpath = "(//label[text()=\"" + label_text + "\"]/following::" + object.getTagName().getValue() + ")[1]";
			} else if (tag.equalsIgnoreCase("input")) {
				WebDriverObjectProperty inputTypeProp = object.getInputType();
				String inputType = (inputTypeProp.isValueNullOrEmpty()) ? "" : inputTypeProp.getValue();
				List<String> xpathsInput = inputXpaths("./following::", label_text, inputType);
				xpaths.addAll(xpathsInput);
			} else if (tag.equalsIgnoreCase("textarea")) {
				xpath = "(//" + "*[normalize-space(text())=\"" + label_text + "\"]//following::"
						+ object.getTagName().getValue().toLowerCase().trim() + ")[1]";
			} else if (tag.equalsIgnoreCase("img"))
				xpath = "(//" + "*[normalize-space(text())=\"" + label_text + "\"]//"
						+ object.getTagName().getValue().toLowerCase().trim() + ")[1]";
			else // double review
				xpath = "//" + "*[normalize-space(text())=\"" + label_text + "\"]//following::"
						+ object.getTagName().getValue().toLowerCase().trim();

//			xpath = "//" + "*[normalize-space(text())=\"" + label_text + "\"]//following::" + object.getTagName().getValue().toLowerCase().trim();

			xpaths.add(xpath);
			xpath = null;
			return xpaths;
		}

		return new ArrayList<String>();
	}

	static List<String> inputXpaths(String xpathPrefix, String label_text, String inputType)
			throws ToolNotSetException {
		List<String> xpathList = new ArrayList<>();
		String xpath = "";
		String xpath1 = "";

		/*- find label element and check if it contains 'for' attribute */
		String xpathTemp = xpathPrefix + "*[normalize-space(text())=\"" + label_text + "\" or text()=\"" + label_text
				+ "\"]";
		List<WebElement> eles = com.crestech.opkey.plugin.webdriver.Finder.findWebDriver()
				.findElements(By.xpath(xpathTemp));
		eles = Utils.getVisibleEles(eles);
		WebElement ele = eles.size() == 1 ? eles.get(0) : null;

		String idAttr = Utils.getForAttribute(ele);

		Log.debug("## idAttr " + idAttr);

		/*- if label does not have 'for' attribute */
		if (idAttr == null || idAttr.isEmpty()) {

			Log.debug("## input" + inputType);

			/*- xpath if inputType is radio or checkbox */
			if ("checkbox".equalsIgnoreCase(inputType) || "radio".equalsIgnoreCase(inputType)) {

				List<String> inputTypeXpaths = getCheckboxAndRadioXpathsByLabel(xpathPrefix, label_text, inputType);
				if (!inputTypeXpaths.isEmpty())
					xpathList.addAll(inputTypeXpaths);

			} else {

				xpath = xpathPrefix + "*[normalize-space(text())=\"" + label_text + "\" or text()=\"" + label_text
						+ "\"]//following::input[not(@type='hidden') or not(@type) or @type='text'][1]";
				xpath1 = "(//*[contains(@class,\"activeTemplate\")]" + xpathPrefix + "*[normalize-space(text())=\""
						+ label_text + "\"]/following::input[not(@type='hidden') or not(@type) or @type='text'])[1]";
				xpathList.add(xpath1);

			}
		} else
			xpath = "//*[@id='" + idAttr + "']";

		if (!xpath.isEmpty())
			xpathList.add(xpath);

		return xpathList;
	}

	static List<String> getCheckboxAndRadioXpathsByLabel(String xpathPrefix, String label, String inputType) {
		String xpath = "";
		String xpath1 = "";
		/*- find checkbox or radio (two level parent) */
		if (inputType.equalsIgnoreCase("checkbox")) {
			xpath = xpathPrefix + "*[normalize-space(text())=\"" + label + "\" or text()=\"" + label
					+ "\"]/parent::*/input[not(@type='hidden') and (@type='checkbox')][1]";
			xpath1 = xpathPrefix + "*[normalize-space(text())=\"" + label + "\" or text()=\"" + label
					+ "\"]/parent::*/parent::*/input[not(@type='hidden') and (@type='checkbox')][1]";

		} else if (inputType.equalsIgnoreCase("radio")) {
			xpath = xpathPrefix + "*[normalize-space(text())=\"" + label + "\" or text()=\"" + label
					+ "\"]/parent::*/input[not(@type='hidden') and (@type='radio')][1]";
			xpath1 = xpathPrefix + "*[normalize-space(text())=\"" + label + "\" or text()=\"" + label
					+ "\"]/parent::*/parent::*/input[not(@type='hidden') and (@type='radio')][1]";
		}
		List<String> xpathList = new ArrayList<>();
		xpathList.add(xpath);
		xpathList.add(xpath1);
		return xpathList;
	}

	private static String getXpathByForAttribute(WebDriverObject object) throws ToolNotSetException {
		OpkeyLogger.printSaasLog(_class, "@Log Info: Invoked getElementByForAttribute");
		if (!object.getOF_Label_text().isValueNullOrEmpty() && object.getOF_Label_text().isUsed()) {
			String labelXpath = "//label[text()='" + object.getOF_Label_text().getValue() + "']";
			OpkeyLogger.printSaasLog(_class, "@Log Info: Created lableXpath: " + labelXpath);
			try {
				WebElement element = com.crestech.opkey.plugin.webdriver.Finder.findWebDriver()
						.findElement(By.xpath(labelXpath));
				String labelFor = element.getAttribute("for");
				if (labelFor != null) {
					String objectXpath = "//*[@id='" + labelFor + "']";
					OpkeyLogger.printSaasLog(_class, "@Log Info: Created objectXpath: " + objectXpath);
					WebElement FoundObject = com.crestech.opkey.plugin.webdriver.Finder.findWebDriver()
							.findElement(By.xpath(objectXpath));
					// return objectXpath;
					if (object.getTagName().getValue().equalsIgnoreCase(FoundObject.getTagName())) {
						return objectXpath;
					} else
						return null;
				}
			} catch (WebDriverException e) {
				OpkeyLogger.printSaasLog(_class, "Log Info::: Label For attribute not found");
			}
		}
		return null;
	}
}
