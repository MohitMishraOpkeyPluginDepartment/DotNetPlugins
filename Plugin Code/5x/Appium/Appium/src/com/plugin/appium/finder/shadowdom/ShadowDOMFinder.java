package com.plugin.appium.finder.shadowdom;

import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.WebElement;

import com.plugin.appium.Utils;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.javascript.JSExecutor;
import com.plugin.appium.keywords.GenericKeyword.EditBox;

public class ShadowDOMFinder {
	
	public List<WebElement> findEditBoxByText(String textToSearch, boolean isContains) {
		List<WebElement> foundedElement = new ArrayList<WebElement>();
		List<WebElement> rootElements = getAllShadowRootElements();
		for (WebElement rootElement : rootElements) {
			try {
				List<WebElement> allElements = getAllChildElementsByTagName(rootElement, "LABEL");
				allElements.addAll(getAllChildElementsByTagName(rootElement, "INPUT"));
				allElements.addAll(getAllChildElementsByTagName(rootElement, "TEXTAREA"));
				
				for (WebElement element : allElements) {
					List<WebElement> editBoxList = findEditBox(rootElement, element, textToSearch, isContains);
					if(editBoxList != null && editBoxList.size() > 0) {
						foundedElement.addAll(editBoxList);
					}
				}
			} catch (Exception e) {
				System.out.println("Exception while finding shadow element: " + rootElements.indexOf(rootElement));
				//e.printStackTrace();
			}
		}
		return foundedElement;
	}
	
	private List<WebElement> findEditBox(WebElement rootElement, WebElement element, String textToSearch, boolean isContains) throws Exception {
		System.out.println("@Function: findEditBox============================");
		String elementText = null;
		List<WebElement> elementsFound = new ArrayList<WebElement>();
		
		String elementTag = Utils.getobjectType(null, element);
		System.out.println("@elementTag: " + elementTag);
		
		boolean isEditBox = EditBox.isEditbox(null, element);
		System.out.println("@isEditBox: " + isEditBox);
		
		boolean isLable = elementTag.equalsIgnoreCase("label");
		System.out.println("@isLable: " + isEditBox);
		
		if(isLable){
			elementText = Utils.getText(element);
		}else if(isEditBox) {
			elementText = EditBox.getVisibleEditBoxText(element);
		}
		
		System.out.println("@ElementText: " + elementText);
		
		if (elementText == null) {
			return elementsFound;
		}
		
		boolean containsMatched = (isContains && elementText.trim().contains(textToSearch.trim()));
		System.out.println("@containsMatched: " + containsMatched);
		
		boolean exactMatched = elementText.trim().equalsIgnoreCase(textToSearch.trim());
		System.out.println("@exactMatched: " + exactMatched);
		
		boolean textMatched = (containsMatched || exactMatched);
		
		if(textMatched && isLable) {
			String forAttrValue = element.getAttribute("for");
			System.out.println("@forAttrValue: " + forAttrValue);
			if (forAttrValue != null) {
				elementsFound = getElementByIdShadow(rootElement, forAttrValue);
			}
		}else if(textMatched && isEditBox) {
			elementsFound.add(element);
		}

		return elementsFound;
	}

	public List<WebElement> findByTextClick(String text, boolean isContains) {
		List<WebElement> elements = getAllShadowRootElements();
		for (WebElement element : elements) {
			try {
				List<WebElement> allElements = getAllChildElementsByTagName(element, "SPAN");
				allElements.addAll(getAllChildElementsByTagName(element, "A"));
				allElements.addAll(getAllChildElementsByTagName(element, "INPUT"));
				allElements.addAll(getAllChildElementsByTagName(element, "BUTTON"));
				ArrayList<WebElement> textElements = new ArrayList<>();
				for (WebElement labelElement : allElements) {
					String textcontent = labelElement.getText();
					if (textcontent == null) {
						continue;
					}
					if (isContains) {
						if (textcontent.trim().contains(text.trim())) {
							textElements.add(labelElement);
						}
					} else {
						if (textcontent.trim().equals(text.trim())) {
							textElements.add(labelElement);
						}
					}
				}
				if (textElements.size() > 0) {
					return textElements;
				}
			} catch (Exception e) {
				System.out.println("Exception while finding shadow element: " + elements.indexOf(element));
				//e.printStackTrace();
			}
		}
		return new ArrayList<WebElement>();
	}

	@SuppressWarnings("unchecked")
	public List<WebElement> getAllShadowRootElements() {
//		String script = getJavaScriptScriptContent(com.plugin.appium.finder.shadowdom.ShadowDOMFinder.class, "shadowDomFinder.js");
		String script = ShadowDOMScript.script;
		JSExecutor js = new JSExecutor();
		try {
			return (List<WebElement>) js.executeScript(script + "return opkey_getAllShadowRootElements();");
		} catch (ToolNotSetException e) {
			System.out.println("Exception while get All ShadowRootElements");
			//e.printStackTrace();
		}
		return new ArrayList<>();
	}
	
	public static void main(String[] args) {
		new ShadowDOMFinder().getAllShadowRootElements();
	}

	@SuppressWarnings("unchecked")
	public List<WebElement> getAllChildElementsByTagName(WebElement element, String tagName) {
//		String script = Utils.getJavaScriptScriptContent(com.plugin.appium.finder.shadowdom.ShadowDOMFinder.class, "shadowDomFinder.js");
		String script = ShadowDOMScript.script;
		JSExecutor js = new JSExecutor();
		try {
			return (List<WebElement>) js.executeScript(script + "return opkey_getAllChildElementsByTagName(arguments[0],'" + tagName + "');", element);
		} catch (ToolNotSetException e) {
			System.out.println("Exception while get All Child Elements By TagName");
			//e.printStackTrace();
		}
		return new ArrayList<>();
	}

	@SuppressWarnings("unchecked")
	private List<WebElement> getElementByIdShadow(WebElement parentNode, String idattr) {
//		String script = Utils.getJavaScriptScriptContent(com.plugin.appium.finder.shadowdom.ShadowDOMFinder.class, "shadowDomFinder.js");
		String script = ShadowDOMScript.script;
		JSExecutor js = new JSExecutor();
		try {
			return (List<WebElement>) js.executeScript(script + "return opkey_getElementByIdSahdow(arguments[0],'" + idattr + "');", parentNode);
		} catch (ToolNotSetException e) {
			System.out.println("Exception while get Element By Id Shadow");
			//e.printStackTrace();
		}
		return null;
	}
}
