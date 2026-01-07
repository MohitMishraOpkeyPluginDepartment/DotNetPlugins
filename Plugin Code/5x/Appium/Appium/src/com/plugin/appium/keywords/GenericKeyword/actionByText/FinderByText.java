package com.plugin.appium.keywords.GenericKeyword.actionByText;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.ElementType;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.GenericKeyword.ObjectProperty;
import com.plugin.appium.util.GenericCheckpoint;

public class FinderByText {

	public static boolean findInWholeHtml = false;

	public static WebElement findWebElement(ObjectProperty byTextObject) throws Exception {
		WebElement element = findElement(byTextObject);
		return element;
	}

	private static WebElement findElement(ObjectProperty byTextObject) throws Exception {

		return new GenericCheckpoint<WebElement>() {

			@Override
			public WebElement _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				if (byTextObject.getElementType() == ElementType.CLICK_BY_TEXT) {
					return findForClickByext(byTextObject);
				}
				return findElementHelper(byTextObject);

			}
		}.run();
	}

	private static WebElement findElementHelper(ObjectProperty byTextObject) throws Exception {
		if (byTextObject.getTextToSearch().trim().length() == 0) {
			throw new ArgumentDataInvalidException("#1: Text is not provided<" + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue() + ">");
		}

		List<WebElement> eles = Finder.findElementByText(byTextObject.getTextToSearch(), byTextObject.isContains(), byTextObject.getIndex(), byTextObject.getTag());
		Log.print("Founded Text List Count is: " + eles.size());
		if (eles.size() == 0) {
			throw new ObjectNotFoundException("#2: No Object Found With Text <" + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue() + ">");
		}

		/* ================================================================ */
		try {
			byTextObject.setLableELements(eles);
			WebElement element = findElementByType(byTextObject);
			Log.print("Final Founded Element is: " + element);
			if (element != null)
				return element;

			throw new ObjectNotFoundException("#3: No Object Found With Text <" + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue() + ">");
		} catch (Exception e) {
			Log.print("@Exception While Fiding Final Element: " + e.getMessage());
			throw new ObjectNotFoundException("#4: No Object Found With Text <" + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue() + ">");
		}
	}

	private static WebElement findElementByType(ObjectProperty byTextObject) throws Exception {
		switch (byTextObject.getElementType()) {
		case EDITBOX:
			return findEditBox(byTextObject);
		case IMAGE:
			return findImage(byTextObject);
		case ANCHOR:
			return findAnchor(byTextObject);
		case CHECKBOX:
			return findCheckBox(byTextObject);
		case RADIO:
			return findRadioBox(byTextObject);
		case SELECT:
			return findDropDown(byTextObject);
		case SELECT_BY_TEXT:
			return findSelectByext(byTextObject);
		default:
			throw new ObjectNotFoundException("Object Not Found.");
		}
	}

	/**
	 * @throws ToolNotSetException
	 ** 
	 ** 
	 ** 
	 **/
	private static WebElement findRadioBox(ObjectProperty byTextObject) throws ObjectNotFoundException, ToolNotSetException {
		if(AppiumContext.isBrowserOrWebviewMode()) {
			return findRadioButton_Web(byTextObject);
		}else {
			return findRadioButton_Native(byTextObject);
		}
	}
	
	private static WebElement findRadioButton_Web(ObjectProperty byTextObject) throws ToolNotSetException {
		WebElement elementLable = byTextObject.getLableELements().get(byTextObject.getIndex());
		WebElement radio = null;
		radio = findRadioInsideLabel(elementLable, byTextObject.getTextToSearch(), byTextObject.isContains(), byTextObject.isBefore());

		if (radio == null) {
			String xpath = null;
			if (byTextObject.isBefore()) {
				xpath = "./../input[@type=\"radio\"] | ./preceding::input[@type=\"radio\"]";
			} else {
				Log.print("After");
				xpath = "./following::input[@type=\"radio\"]";
			}
			Log.print("XPATH : " + xpath);
			List<WebElement> list = elementLable.findElements(By.xpath(xpath));
			Log.print("Last eles list " + list.size());
			if (byTextObject.isBefore())
				radio = list.get(list.size() - 1);
			else
				radio = list.get(0);
			System.out.println(radio.getAttribute("outerHTML"));
		}
		return radio;
	}
	
	private static WebElement findRadioButton_Native(ObjectProperty byTextObject) {
		WebElement eleLable = byTextObject.getLableELements().get(byTextObject.getIndex());
		List<WebElement> list;
		WebElement checkbox = null;
		
		// Check If Itself is CheckBox
		String xPathForSelf = "//self::android.widget.RadioButton";
		list = eleLable.findElements(By.xpath(xPathForSelf));
		if(list.size() > 0) {
			return list.get(0);
		}
		
		String xpath="";
		if (byTextObject.isBefore()) {
			Log.print("Before");
			xpath = "./preceding::android.widget.RadioButton";
			list = eleLable.findElements(By.xpath(xpath));
		} else {
			Log.print("After");
			xpath = ".//android.widget.RadioButton"
					+ " | ./android.widget.RadioButton"
					+ " | /following::android.widget.RadioButton"
					+"  | //following::android.widget.RadioButton";
			
			list = eleLable.findElements(By.xpath(xpath));
		}

		Log.print("Size: " + list.size() + " Xpath: " + xpath);
		if (list.size() > 0) {
			if (byTextObject.isBefore()) {
				checkbox = list.get(list.size() - 1);
			} else {
				checkbox = list.get(0);
			}
		}
		return checkbox;
	}

	/**
	 * @throws ToolNotSetException
	 ** 
	 ** 
	 ** 
	 **/
	private static WebElement findCheckBox(ObjectProperty byTextObject) throws ObjectNotFoundException, ToolNotSetException {
		
		if(AppiumContext.isBrowserOrWebviewMode()) {
			return findCheckBox_Web(byTextObject);
		}else {
			return findCheckBox_Native(byTextObject);
		}
	}
	
	private static WebElement findCheckBox_Web(ObjectProperty byTextObject) throws ObjectNotFoundException, ToolNotSetException {
		WebElement elementLable = byTextObject.getLableELements().get(byTextObject.getIndex());
		WebElement ele1 = null;
		ele1 = findCheckBoxInsideLabel(elementLable, byTextObject.getTextToSearch(), byTextObject.isContains(), byTextObject.isBefore());

		if (ele1 != null) {
			return ele1;
		}
		String xpath = null;
		if (byTextObject.isBefore()) {
			xpath = "./../input[@type=\"checkbox\"] | ./preceding::input[@type=\"checkbox\"]";
		} else {
			xpath = "./input[@type=\"checkbox\"] | ./following::input[@type=\"checkbox\"]";
		}
		List<WebElement> list = elementLable.findElements(By.xpath(xpath));
		if (list.size() == 0) {
			throw new ObjectNotFoundException("No Object Found");
		}
		WebElement checkbox = null;
		if (byTextObject.isBefore())
			checkbox = list.get(list.size() - 1);
		else
			checkbox = list.get(0);

		return checkbox;
	}
	
	private static WebElement findCheckBox_Native(ObjectProperty byTextObject) {
		WebElement eleLable = byTextObject.getLableELements().get(byTextObject.getIndex());
		List<WebElement> list;
		WebElement checkbox = null;
		
		// Check If Itself is CheckBox
		String xPathForSelf = "//self::android.widget.CheckBox";
		list = eleLable.findElements(By.xpath(xPathForSelf));
		if(list.size() > 0) {
			return list.get(0);
		}
		
		String xpath="";
		if (byTextObject.isBefore()) {
			Log.print("Before");
			xpath = "./preceding::android.widget.CheckBox";
			list = eleLable.findElements(By.xpath(xpath));
		} else {
			Log.print("After");
			xpath = ".//android.widget.CheckBox"
					+ " | ./android.widget.CheckBox"
					+ " | /following::android.widget.CheckBox"
					+"  | //following::android.widget.CheckBox";
			
			list = eleLable.findElements(By.xpath(xpath));
		}

		Log.print("Size: " + list.size() + " Xpath: " + xpath);
		if (list.size() > 0) {
			if (byTextObject.isBefore()) {
				checkbox = list.get(list.size() - 1);
			} else {
				checkbox = list.get(0);
			}
		}
		return checkbox;
	}

	/**
	 ** 
	 ** 
	 ** 
	 **/
	private static WebElement findAnchor(ObjectProperty byTextObject) throws ObjectNotFoundException {
		return null;
	}

	/**
	 ** 
	 ** 
	 ** 
	 **/
	private static WebElement findImage(ObjectProperty byTextObject) throws ObjectNotFoundException {
		try {
			return byTextObject.getLableELements().get(byTextObject.getIndex());
		} catch (IndexOutOfBoundsException e) {
			throw new ObjectNotFoundException("Not able to find Image object with text <" + byTextObject.getTextToSearch() + "> and index <" + byTextObject.getIndex() + ">");
		}
	}

	/**
	 ** 
	 ** 
	 ** 
	 **/
	private static WebElement findDropDown(ObjectProperty byTextObject) throws ObjectNotFoundException {
		WebElement elementLable = byTextObject.getLableELements().get(byTextObject.getIndex());
		List<WebElement> byForElements = findElementByForAttribute(elementLable);
		if (byForElements != null) {
			return byForElements.get(0);
		}

		WebElement dropdownElement = null;
		String xpath = null;
		if (byTextObject.isBefore()) {
			xpath = "./../select | ./preceding::select";
		} else {
			xpath = "./select | ./following::select";
		}
		try {
			List<WebElement> list = elementLable.findElements(By.xpath(xpath));
			Log.print(list.size());
			// Log.print(list.get((list.size() - 1)).getAttribute("outerHTML"));
			if (byTextObject.isBefore())
				dropdownElement = list.get(list.size() - 1);
			else
				dropdownElement = list.get(0);

			Log.print("Finally Founded Dropdown: " + dropdownElement.getAttribute("outerHTML"));
			return dropdownElement;
		} catch (Exception e) {
			System.out.println("Exception while findDropDown: " + e.getMessage());
			//e.printStackTrace();
			return null;
		}
	}

	/**
	 **
	 **
	 ** 
	 ** 
	 ** 
	 **/
	private static WebElement findEditBox(ObjectProperty byTextObject) throws ObjectNotFoundException, ToolNotSetException, InterruptedException {

		Log.print("@Founded Lable Size: " + byTextObject.getLableELements().size());
		Log.print("@Provied Lable Index: " + byTextObject.getIndex());
		Log.print("@Final Lable: " + byTextObject.getLableELements().get(byTextObject.getIndex()));

		WebElement eleLable = byTextObject.getLableELements().get(byTextObject.getIndex());
		findInWholeHtml = false;
		String xpath = "";
		WebElement eleEditBox = null;
		if (!byTextObject.isBefore() && AppiumContext.isBrowserOrWebviewMode()) {
			eleEditBox = getElementUsingLabelForAttr(eleLable);
			if (eleEditBox != null)
				return eleEditBox;
		}

		List<WebElement> list = new ArrayList<WebElement>();

		if (byTextObject.isBefore()) {
			Log.print("Before");
			xpath = "./preceding::textarea | ./preceding::input[@type='text' or @type='email' or @type='password' or not(@type) or @type='number' or @type='search' or @type='tel' or @type='url' or @type='date' or @type='datelocal' or @type='datetime-local' or @type='month' or @type='time' or @type='week'] | ./preceding::android.widget.EditText | ./preceding::XCUIElementTypeSearchField | ./preceding::UIATextView | ./preceding::UIATextField";
			list = eleLable.findElements(By.xpath(xpath));
			// Log.print("Size: " + list.size() + " Xpath: " + xpath);
		} else {
			// for placeholder
			Log.print("Placeholder");
			String xpathForPlaceholder = "(.//self::input[@type='text' or @type='email' or @type='password' or not(@type) or @type='number' or @type='search' or @type='tel' or @type='url' or @type='date' or @type='datelocal' or @type='datetime-local' or @type='month' or @type='time' or @type='week'] | self::textarea | //self::android.widget.EditText | //self::XCUIElementTypeSearchField | //self::UIATextView | //self::UIATextField)";
			try {
				eleEditBox = eleLable.findElement(By.xpath(xpathForPlaceholder));
				return eleEditBox;
			} catch (Exception e) {
			}
			// If Element not found by Placeholder then find inside and after
			Log.print("After");
			if(AppiumContext.isBrowserMode()) {
				xpath = ".//input | ./textarea | ./input[@type='text' or @type='email' or @type='password' or not(@type) or @type='number' or @type='search' or @type='tel' or @type='url' or @type='date' or @type='datelocal' or @type='datetime-local' or @type='month' or @type='time' or @type='week'] | ./following::textarea | ./following::input[@type='text' or @type='email' or @type='password' or not(@type) or @type='number' or @type='search' or @type='tel' or @type='url' or @type='date' or @type='datelocal' or @type='datetime-local' or @type='month' or @type='time' or @type='week']";
			}else {
				xpath = ".//android.widget.EditText"
						+ " | ./android.widget.EditText"
						+ " | /following::android.widget.EditText"
						+ ".//UIATextField"
						+ " | ./UIATextField"
						+ " | /following::UIATextField"
						+ ".//UIATextView"
						+ " | ./UIATextView"
						+ " | /following::UIATextView"
						+ ".//XCUIElementTypeSearchField"
						+ " | ./XCUIElementTypeSearchField"
						+ " | /following::XCUIElementTypeSearchField";
						
			}
			list = eleLable.findElements(By.xpath(xpath));
			Log.print("Size: " + list.size() + " Xpath: " + xpath);
		}

		if (list.size() > 0) {
			if (byTextObject.isBefore()) {
				eleEditBox = list.get(list.size() - 1);

			} else {
				eleEditBox = list.get(0);
				// Log.print(eleEditBox.getAttribute("outerHTML"));
			}
		}
		return eleEditBox;
	}

	/**
	 **
	 ** 
	 ** 
	 ** 
	 **/
	private static WebElement findSelectByext(ObjectProperty byTextObject) throws ObjectNotFoundException {
		List<WebElement> dropdownList = new ArrayList<WebElement>();
		try {
			for (WebElement e : byTextObject.getLableELements()) {
				Log.print(e.getAttribute("outerHTML"));
				if (e.getTagName().toLowerCase().equals("option")) {
					if (byTextObject.iS_MultipleDropdown) {
						try {
							Log.print(e.findElement(By.xpath("..")).getAttribute("multiple"));
							if (e.findElement(By.xpath("..")).getAttribute("multiple").equals("true"))
								dropdownList.add(e);
						} catch (Exception e2) {
						}
					} else {
						dropdownList.add(e);
					}
				}
			}

			WebElement ele = dropdownList.get(byTextObject.getIndex());
			return ele;
		} catch (Exception e) {
			Log.print("@Exception While: findSelectByext: " + e.getMessage());
			throw new ObjectNotFoundException("No Object Found With Text <" + byTextObject.getTextToSearch() + ">");
		}

	}

	private static WebElement findForClickByext(ObjectProperty objectProperty) throws ToolNotSetException, InterruptedException, Exception {

		List<WebElement> eles = new ArrayList<WebElement>();

		if (!objectProperty.getBeforeText().trim().isEmpty() || !objectProperty.getAfterText().trim().isEmpty()) {

			boolean isBeforeText = false;
			boolean isAfterText = false;
			if (!objectProperty.getBeforeText().trim().isEmpty()) {
				isBeforeText = true;
			}
			if (!objectProperty.getAfterText().trim().isEmpty()) {
				isAfterText = true;
			}

			List<WebElement> beforeEles;
			List<WebElement> afterEles;
			List<WebElement> finalEles = new ArrayList<>();

			if (isBeforeText && isAfterText) {
				beforeEles = getBeforeTextElement(objectProperty);

				WebElement afterEle = null;
				try {
					afterEle = new Finder().findElementByTextInCurrentDom(objectProperty.getAfterText(), objectProperty.isContains(), 0).get(0);
				} catch (Exception e) {
					Log.print("@Exception While: findSelectByext: " + e.getMessage());
					throw new ObjectNotFoundException("No Object Found With Text <" + objectProperty.getTextToSearch() + ">");
				}

				afterEles = new Finder().findElementByTextDirection(objectProperty.getTextToSearch(), objectProperty.isContains(), objectProperty.getIndex(), afterEle, false);

				finalEles.addAll(beforeEles);
				finalEles.retainAll(afterEles);

			} else if (isBeforeText) {
				finalEles = getBeforeTextElement(objectProperty);
				// Have You Notice, We reverse the list......
				Collections.reverse(finalEles);
			} else if (isAfterText) {
				finalEles = getAfterTextElement(objectProperty);
			}

			eles = finalEles;

		} else {
			eles = getTextElement(objectProperty);
		}

		// Remove Image Tag From The List
		//eles = Utils.removeElementFromList(eles, "img");
		if (eles.size() == 0 || eles == null || eles.size() <= objectProperty.getIndex()) {
			throw new ObjectNotFoundException("No Object Found With Text <" + objectProperty.getTextToSearch() + ">");
		}

		return eles.get(objectProperty.getIndex());
	}

	private static List<WebElement> getBeforeTextElement(ObjectProperty objectProperty) throws ObjectNotFoundException, ToolNotSetException, InterruptedException, Exception {
		WebElement beforeElements = null;
		List<WebElement> finalEles = new ArrayList<>();
		beforeElements = Finder.findElementByText(objectProperty.getBeforeText(), objectProperty.isContains(), 0).get(0);
		finalEles = new Finder().findElementByTextDirection(objectProperty.getTextToSearch(), objectProperty.isContains(), objectProperty.getIndex(), beforeElements, true);
		return finalEles;
	}

	private static List<WebElement> getAfterTextElement(ObjectProperty objectProperty) throws ObjectNotFoundException, ToolNotSetException, InterruptedException, Exception {
		Log.print("After");
		WebElement afterEle = null;
		try {
			afterEle = Finder.findElementByText(objectProperty.getAfterText(), objectProperty.isContains(), 0).get(0);
		} catch (Exception e) {
			throw new ObjectNotFoundException("After Text <" + objectProperty.getAfterText() + "> is not found");
		}
		List<WebElement> finalEles = new Finder().findElementByTextDirection(objectProperty.getTextToSearch(), objectProperty.isContains(), objectProperty.getIndex(), afterEle, false);
		return finalEles;
	}

	private static List<WebElement> getTextElement(ObjectProperty objectProperty) throws ObjectNotFoundException, Exception {
		return Finder.findElementByText(objectProperty.getTextToSearch(), objectProperty.isContains(), objectProperty.getIndex());
	}
	
	public static WebElement findRadioInsideLabel(WebElement ele, String text, boolean isContains, boolean before) throws ToolNotSetException {
		String xpath = "";
		String script = "function textNodesUnder(node) {" + "	var all = [];" + "	for (node = node.firstChild; node; node = node.nextSibling) {" + "		if (node.nodeType == 3) {"
				+ "			var x = node.nodeValue.replace(/\\u00a0/g, '').replace('\\n', '')" + "					.trim();" + "			if (( x != null)) {"
				+ "				var val = node.nodeValue;" + "				if (val.charCodeAt(0) == 10) {" + "					val = val.substring(1);" + "				}"
				+ "				if (val.charCodeAt(val.length) == 10) {" + "					val = val.substring(0, val.length)" + "				}" + "				all.push(val);" + "			}"
				+ "		}" + "	}" + "	return all;" + "	}";
		Log.print(script);
		JavascriptExecutor jse = (JavascriptExecutor)(Finder.findAppiumDriver());
		ArrayList<String> texts = new ArrayList<>();
		texts = (ArrayList<String>) jse.executeScript(script + "return textNodesUnder(arguments[0]);", ele);
		Log.print("Texts Size: " + texts.size());
		/*
		 * for (String s : texts) { s.replaceAll("\u00a0", "").replaceAll("\n ",
		 * "").trim(); if (s.isEmpty()) Log.print("<" + s + ">"); }
		 */
		int radioIndex = 0;
		for (int i = 0; i < texts.size(); i++) {
			Log.print(texts.get(i));
			if (texts.get(i).toLowerCase().contains(text.toLowerCase())) {
				Log.print("Found : <" + texts.get(i).toLowerCase() + ">  Given : <" + text.toLowerCase() + ">");
				Log.print("texts.get(i).toLowerCase().contains(text.toLowerCase()): " + texts.get(i).toLowerCase().contains(text.toLowerCase()));
				radioIndex = i + 1;
				break;
				// Log.print(" Text Match");
			}
		}
		Log.print("Index: " + radioIndex);
		if (radioIndex == 0)
			return null;

		// Log.print("radioIndex= "+radioIndex);
		List<WebElement> list = null;
		WebElement radioEle = null;
		if (before) {
			xpath = "./text()[" + radioIndex + "]/preceding::input[@type='radio'][1]";
			try {
				list = ele.findElements(By.xpath(xpath));
			} catch (Exception e) {
			}
			if (list != null && list.size() != 0)
				radioEle = list.get(list.size() - 1);
		} else {
			xpath = "./text()[" + radioIndex + "]/following::input[@type=\"radio\"][1]";
			try {
				list = ele.findElements(By.xpath(xpath));
			} catch (Exception e) {

			}

			if (list != null && list.size() != 0)
				radioEle = list.get(0);

		}

		return radioEle;

	}
	
	public static WebElement findCheckBoxInsideLabel(WebElement ele, String text, boolean isContains, boolean before) throws ToolNotSetException {
		String xpath = "";
		// Log.print("Inside findCheckBoxInsideLabel");
		String script = "function textNodesUnder(node) {" + "	var all = [];" + "	for (node = node.firstChild; node; node = node.nextSibling) {" + "		if (node.nodeType == 3) {"
				+ "			var x = node.nodeValue.replace(/\\u00a0/g, '').replace('\\n', '')" + "					.trim();" + "			if (( x != null)) {"
				+ "				var val = node.nodeValue;" + "				if (val.charCodeAt(0) == 10) {" + "					val = val.substring(1);" + "				}"
				+ "				if (val.charCodeAt(val.length) == 10) {" + "					val = val.substring(0, val.length)" + "				}" + "				all.push(val);" + "			}"
				+ "		}" + "	}" + "	return all;" + "	}";
		Log.print(script);
		JavascriptExecutor jse = (JavascriptExecutor)Finder.findAppiumDriver();
		ArrayList<String> texts = new ArrayList<>();
		texts = (ArrayList<String>) jse.executeScript(script + "return textNodesUnder(arguments[0]);", ele);
		int checkBoxIndex = 0;
		for (int i = 0; i < texts.size(); i++) {
			Log.print("<" + texts.get(i) + ">");
			Log.print(texts.get(i).toLowerCase().contains(text.toLowerCase()));
			if (texts.get(i).toLowerCase().contains(text.toLowerCase())) {

				checkBoxIndex = i + 1;
				System.out.println("INDEX IS AS:::: " + i + " :: " + checkBoxIndex);
				break;
				// Log.print(" Text Match");
			}
		}
		if (checkBoxIndex == 0)
			return null;

		// Log.print("@#!" + ele.getAttribute("outerHTML"));
		// Log.print("radioIndex= "+radioIndex);
		List<WebElement> list = null;
		WebElement checkBoxEle = null;
		System.out.println("BEFORE IS AS:::: " + before);
		if (before) {
			xpath = "./text()[" + checkBoxIndex + "]/preceding::input[@type='checkbox'][1]";
			Log.print("Xpath; " + xpath);
			try {
				list = ele.findElements(By.xpath(xpath));
				Log.print("SIZE: " + list.size());
				for (WebElement e : list)
					Log.print("@ " + e.getAttribute("outerHTML"));
			} catch (Exception e) {
			}
			if (list != null && list.size() != 0)
				checkBoxEle = list.get(list.size() - 1);
		} else {
			xpath = "./text()[" + checkBoxIndex + "]/following::input[@type='checkbox'][1]";
			Log.print("Xpath; " + xpath);
			try {
				list = ele.findElements(By.xpath(xpath));
				for (WebElement e : list) {
					Log.print(e.getAttribute("outerHTML"));
				}
			} catch (Exception e) {

			}

			if (list != null && list.size() != 0)
				checkBoxEle = list.get(0);
		}
		return checkBoxEle;
	}
	
	public static WebElement getElementUsingLabelForAttr(WebElement labelEle) throws ToolNotSetException {
		String forAttr = getForAttribute(labelEle);
		if (forAttr == null || forAttr.trim().isEmpty()) {
			return null;
		}
		List<WebElement> eles = Finder.findAppiumDriver().findElements(By.xpath("//*[@id=\"" + forAttr + "\"]"));

		return eles.size() == 1 ? eles.get(0) : null;

	}
	
	public static String getForAttribute(WebElement ele) {

		if (ele == null)
			return "";

		String forAttr = ele.getAttribute("for");

		Log.print("ELE1 = " + ele.getAttribute("outerHTML"));
		Log.print(forAttr != null && !forAttr.isEmpty());

		if (forAttr != null && !forAttr.isEmpty()) {
			return forAttr;
		}

		return "";

	}
	
	public static List<WebElement> findElementByForAttribute(WebElement element) {
		String forAttrValue = element.getAttribute("for");
		try {
			if (forAttrValue != null && !forAttrValue.isEmpty()) {
				List<WebElement> foundedEle = Finder.findAppiumDriver().findElements(By.id(forAttrValue));
				if (foundedEle.size() > 0)
					return foundedEle;
			}
		} catch (Exception e) {
			Log.debug(e.getMessage());
		}
		return null;
	}
}
