package com.plugin.appium.CustomClasses;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import org.openqa.selenium.By;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import com.plugin.appium.Finder;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.exceptionhandlers.ElementNotExistInDropDownException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

public class CustomSelect {

	private Select _innerSelectElement;
	private WebElement _innerElement;
	private static Logger logger = Logger.getLogger(CustomSelect.class.getName());
	/**
	 * This property denotes that the end users will give the ComboBox
	 * look-alike element while using these keywords, and not the actual inner
	 * ListView Element.
	 * 
	 * This property determines whether the plugin needs to click & go-back
	 * before & after performing any operations on the provided element.
	 */
	private Boolean COMBO_SHELL_PROVIDED;

	public CustomSelect(WebElement element, Boolean COMBO_SHELL_PROVIDED) throws ToolNotSetException {
		this._innerElement = element;
		this.COMBO_SHELL_PROVIDED = COMBO_SHELL_PROVIDED;
		if (AppiumContext.isBrowserOrWebviewMode()) {
			this._innerSelectElement = new Select(element);
		}

		/*
		 * this exception catch because android spinner work with same keyword
		 * dropdown if we work with select class on android spinner item then
		 * exception generate
		 */

	}

	public String[] getOptions() throws ToolNotSetException, InterruptedException {

		ArrayList<String> listDropDownItemText = new ArrayList<String>();
		if (AppiumContext.isBrowserOrWebviewMode())
			for (WebElement we : _innerSelectElement.getOptions()) {
				listDropDownItemText.add(we.getText());
			}

		else {

			String getSelectedDropDownText = _innerElement.getText();

			if (getSelectedDropDownText != null) {
				// If item get text is null then nothing to add
				listDropDownItemText.add(getSelectedDropDownText);
			}
			// if user provide list object then no need to click
			if (COMBO_SHELL_PROVIDED) {
				_innerElement.click();
			}

			List<WebElement> listDropDownItem = getAllListItems();

			// some element is not clickable but parent is clickable like //
			// <parent
			// clickable:true> // <android.widget.textView clickable:false>

			for (WebElement we : listDropDownItem) {
				try {
					String text = we.getText();
					text = (text == null || text.isEmpty()) ? we.getAttribute("name") : text;
					if (text != null)
						listDropDownItemText.add(text);
				} catch (StaleElementReferenceException ex) {

					logger.fine(" StaleElementReferenceException is generated ");
					// When we get the all element by class name it collect
					// element as well as element
					// whose reference currently not exist it reference after
					// click or after perform some action
				}
			}

			// if user provide list object then no need to go back
			if (COMBO_SHELL_PROVIDED)
				Finder.findAppiumDriver().navigate().back();
		}

		return listDropDownItemText.toArray(new String[listDropDownItemText.size()]);
	}

	public void selectByVisibleText(String text) throws ToolNotSetException, ElementNotExistInDropDownException, InterruptedException {

		if (AppiumContext.isBrowserOrWebviewMode())
		try {
			_innerSelectElement.selectByVisibleText(text);

		}catch(Exception ex) {
			_innerSelectElement.selectByValue(text);
		}
		else {
			if (COMBO_SHELL_PROVIDED) {
				_innerElement.click();
			}
			List<WebElement> listDropDownItem = getAllListItems();
			logger.fine("getting drop down item size:- " + listDropDownItem.size());
			String webelementText="";
			for (WebElement we : listDropDownItem) {
				webelementText = we.getText();
				webelementText = (webelementText == null || webelementText.isEmpty()) ? we.getAttribute("name") : webelementText;
				// an super exception catch is exist in called function
				try {
					logger.fine(" get attribute text:- " + we.getAttribute("name") + " input text:- " + text);
					logger.fine(" get text " + webelementText + " input text " + text);
					if ((webelementText != null && webelementText.contentEquals(text))) {
						logger.fine(" sucess match now click ");
						we.click();
						return;
					}
				} catch (StaleElementReferenceException e) {					
					// get all getAllListItems() some time return the element
					// list which is not exist it shows after some activity
				}
			}
			if (COMBO_SHELL_PROVIDED) {
				Finder.findAppiumDriver().navigate().back();
				throw new ElementNotExistInDropDownException(ReturnMessages.ELEMENT_NOT_EXIST_IN_DROPDOWN.toString());
			}
		}
	}

	public List<WebElement> getAllSelectedOptions() throws ToolNotSetException {

		if (AppiumContext.isBrowserOrWebviewMode()) {
			return _innerSelectElement.getAllSelectedOptions();
		} else {
			List<WebElement> listDropDownItem = _innerElement.findElements(By.className("android.widget.CheckedTextView"));
			listDropDownItem.addAll(_innerElement.findElements(By.className("android.widget.TextView")));
			return listDropDownItem;
		}
	}

	public static List<WebElement> getAllListItems() throws ToolNotSetException, InterruptedException {

		List<WebElement> listDropDownItem = new ArrayList<WebElement>();
		// try for 5 times when page is not fully loaded after clicking on
		// list items
		for (int iterator = 0; iterator < 5; iterator++) {

			listDropDownItem = Finder.findAppiumDriver().findElements(By.className("android.widget.CheckedTextView"));

			logger.info("item found by checked text view " + listDropDownItem.size());
			// When element is exist in the form of checkbox

			if (listDropDownItem.size() == 0) {
				logger.info(" not found by checked text view and checkbox try to get the item text view ");
				listDropDownItem.addAll(Finder.findAppiumDriver().findElements(By.className("android.widget.TextView")));

			}
			
			
			logger.info(" item found by text view " + listDropDownItem.size());

			listDropDownItem.addAll(Finder.findAppiumDriver().findElements(By.className("android.widget.CheckBox")));
			logger.info("item found by checkbox " + listDropDownItem.size());
			// wait 1 Sec for page load in after clicking
			// in some application 1 element is found by using above class name
			// but item is title of list so wait for minimum 2 items
			

			if (listDropDownItem.size() == 0) {
				logger.info(" not found by checked text view and checkbox try to get the item View ");
				listDropDownItem.addAll(Finder.findAppiumDriver().findElements(By.className("android.view.View")));

			}
			
			if (listDropDownItem.size() > 1) {
				break;
			}
			Thread.sleep(1000);
			// clear the old items from list
			listDropDownItem.clear();
		}
		System.out.println(" size of drop down list getting by dropdown item " + listDropDownItem.size());
		return listDropDownItem;
	}
	// remove whose element which are not clickable
	/*
	 * private List<WebElement> removeNonClickableElements(List<WebElement>
	 * listDropDownItem) throws ToolNotSetException {
	 * 
	 * logger.info("Filtering Non-Clickable Items"); List<WebElement>
	 * filteredList = new ArrayList<WebElement>(); for (WebElement we :
	 * listDropDownItem) { if (Boolean.valueOf(we.getAttribute("clickable"))) {
	 * filteredList.add(we); } }
	 * logger.info("Non-Clickable Items have been filtered out"); return
	 * filteredList; }
	 */
}
