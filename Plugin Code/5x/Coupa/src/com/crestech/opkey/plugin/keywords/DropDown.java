package com.crestech.opkey.plugin.keywords;

import java.awt.AWTException;
import java.awt.Robot;
import java.awt.event.KeyEvent;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.ListIterator;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.ExecutionException;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.ElementNotVisibleException;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.codedfl.NotImplementedOSException;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.crestech.opkey.plugin.exceptionhandling.RetryKeywordAgainException;
import com.crestech.opkey.plugin.webdriver.Finder;
import com.crestech.opkey.plugin.webdriver.KeywordContext;
import com.crestech.opkey.plugin.webdriver.OpkeyLogger;
import com.crestech.opkey.plugin.webdriver.Validations;
import com.crestech.opkey.plugin.webdriver.WebDriverDispatcher;
import com.crestech.opkey.plugin.webdriver.enums.PluginName;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ObjectNotFoundException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.TimeOut_ObjectNotFoundException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ToolNotSetException;
import com.crestech.opkey.plugin.webdriver.keywords.Utils;
import com.crestech.opkey.plugin.webdriver.keywords.WebObjects;
import com.crestech.opkey.plugin.webdriver.object.WebDriverObject;
import com.crestech.opkey.plugin.webdriver.util.Checkpoint;
import com.crestech.opkey.plugin.webdriver.util.GenericCheckpoint;

public class DropDown implements KeywordLibrary {

	static Class<DropDown> _class = DropDown.class;
	
	// Coupa_FindAndSelectLov Method
	public FunctionResult Method_Coupa_FindAndSelectLov(WebDriverObject object, String LabelText, String ValueToSelect, 
	        int LabelIndex, String Beforetext, String Aftertext, boolean partialText) throws Exception {

	    if (WebDriverDispatcher.applySkipStepValidation)
	        Validations.checkMandatoryDataForBlank(1);
	    Validations.checkDataForBlank(1);
	    
	    String labelText = LabelText;
	    String valueToSelect = ValueToSelect;
	    int labelIndex = LabelIndex;
	    String beforetext = Beforetext;
	    String aftertext = Aftertext; 

	    if (object != null) {
	        if (object.getWD_LOVLabel() != null && !object.getWD_LOVLabel().isValueNullOrEmpty()) {
	            labelText = object.getWD_LOVLabel().getValue();
	        }
	        if (object.getIndex() != null && !object.getIndex().isValueNullOrEmpty()) {
	            labelIndex = Integer.parseInt(object.getIndex().getValue());
	        }
	        if (object.getBefore() != null && !object.getBefore().isValueNullOrEmpty()) {
	            beforetext = object.getBefore().getValue();
	        }
	        if (object.getAfter() != null && !object.getAfter().isValueNullOrEmpty()) {
	            aftertext = object.getAfter().getValue();
	        }
	        if (partialText == false && object.getPartialText() != null && !object.getPartialText().isValueNullOrEmpty()) {
				partialText = Boolean.parseBoolean(object.getPartialText().getValue());
			}
	    }

	    if (labelText == null || labelText.trim().isEmpty()) {
	        return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
	                .setMessage("Label text is null or empty").make();
	    }
	    
	    if (valueToSelect == null || valueToSelect.trim().isEmpty()) {
	        return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
	                .setMessage("Value to select is null or empty").make();
	    }

	    return findAndSelectInLov(labelText, labelIndex, valueToSelect, beforetext, aftertext, partialText);
	}

	public FunctionResult findAndSelectInLov(String labelText, int labelIndex, String valueToSelect,
	        String beforetext, String aftertext, boolean partialText) throws Exception {
	    return new Checkpoint() {

	        @Override
	        public FunctionResult _innerRun() throws InterruptedException, ObjectNotFoundException, ToolNotSetException,
	                WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException,
	                IllegalArgumentException, ExecutionException, TimeOut_ObjectNotFoundException,
	                NotImplementedOSException, AWTException, RetryKeywordAgainException {

	            new Utils().waitForPageLoadAndOtherAjaxIfTrue();

	            List<String> valuesToSelect = new ArrayList<String>();
	            if (valueToSelect != null && valueToSelect.contains(";")) {
	                valuesToSelect = Arrays.asList(valueToSelect.split(";"));
	            } else {
	                valuesToSelect.add(valueToSelect);
	            }

	            int successfulSelections = 0;
	            int totalSelections = valuesToSelect.size();

	            System.out.println("<<### Total values to select: " + totalSelections);

	            for (int i = 0; i < totalSelections; i++) {
	                String currentValue = valuesToSelect.get(i).trim();
	                if (currentValue.isEmpty()) {
	                    System.out.println("<<### Skipping empty value at position: " + (i + 1));
	                    continue;
	                }
	                
	                System.out.println("<<### Processing selection " + (i + 1) + " of " + totalSelections + ": " + currentValue);

	                WebElement labelElement = findAndClickLabelFresh(labelText, labelIndex, beforetext, aftertext);
	                if (labelElement == null) {
	                    System.out.println("<<### ERROR: Could not find label: " + labelText);
	                    break;
	                }

	                new Utils().waitForPageLoadAndOtherAjaxIfTrue();
	                Thread.sleep(500);

	                WebElement targetDropdown = findTargetDropdownNearLabel(labelElement, labelText);
	                if (targetDropdown == null) {
	                    System.out.println("<<### ERROR: Could not find dropdown near label: " + labelText);
	                    break;
	                }

	                String dropdownType = detectDropdownType(targetDropdown);
	                System.out.println("<<### Detected dropdown type: " + dropdownType);

	                if (dropdownType.equals("UNKNOWN")) {
	                    System.out.println("<<### ERROR: Unknown dropdown type");
	                    break;
	                }
	            
	                boolean selectionSuccess = false;

	                if (currentValue.contains("||")) {
	                    if (dropdownType.equals("CHOSEN_SINGLE")) {
	                        System.out.println("<<### ERROR: Hierarchical path not supported on Chosen Single");
	                        break;
	                    } else if (dropdownType.equals("CHOSEN_HIERARCHICAL")) {
	                        selectionSuccess = selectChosenHierarchical(targetDropdown, currentValue, partialText);
	                    } else if (dropdownType.equals("COMBOBOX")) {
	                        selectionSuccess = selectComboBoxHierarchical(targetDropdown, currentValue, partialText);
	                    } else {
	                        System.out.println("<<### ERROR: Hierarchical path not supported on this dropdown type");
	                        break;
	                    }
	                } else {
	                    if (dropdownType.equals("CHOSEN") || dropdownType.equals("CHOSEN_SINGLE") || dropdownType.equals("CHOSEN_HIERARCHICAL")) {
	                        selectionSuccess = selectChosenFlatRobust(targetDropdown, currentValue, partialText);
	                    } else if (dropdownType.equals("COMBOBOX")) {
	                        selectionSuccess = selectComboBoxFlat(targetDropdown, currentValue, partialText);
	                    }
	                }

	                if (selectionSuccess) {
	                    successfulSelections++;
	                    System.out.println("<<### SUCCESS: Selection " + (i + 1) + " completed: " + currentValue);
	                } else {
	                    System.out.println("<<### FAILED: Selection " + (i + 1) + " failed: " + currentValue);
	                }

	                System.out.println("<<### LOOP CHECK: Processed " + (i + 1) + " out of " + totalSelections);
	            }

	            System.out.println("<<### FINAL: Selected " + successfulSelections + " out of " + totalSelections + " values");

	            if (successfulSelections == 0) {
	                return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
	                        .setMessage("No values were successfully selected").make();
	            }
	            
	            if (successfulSelections < totalSelections) {
	                return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
	                        .setMessage("Partial success: " + successfulSelections + "/" + totalSelections + " selected").make();
	            }

	            
//	            // Tab out
//                System.out.println("<<### Inside Robot Tab Out findAndSelectInLov");
//	            new Utils().waitForPageLoadAndOtherAjax();
//	            Thread.sleep(500);
//	            Robot rob = new Robot();
//	            rob.keyPress(KeyEvent.VK_TAB);
//	            Thread.sleep(300);
//	            rob.keyRelease(KeyEvent.VK_TAB);
	            
	            ((JavascriptExecutor) Finder.findWebDriver()).executeScript("document.activeElement.blur();");
	            ((JavascriptExecutor) Finder.findWebDriver()).executeScript("document.body.focus();");


	            return Result.PASS().setOutput(true)
	                    .setMessage("DropDown Selected Successfully. Total " + successfulSelections + " values selected.").make();
	        }
	    }.run();
	}

	private WebElement findAndClickLabelFresh(String labelText, int labelIndex, String beforetext, String aftertext) {
    WebElement labelElement = null;
    
    try {
        System.out.println("<<### Finding fresh label: " + labelText);
        
        //String xpath = "//label[text()=\"" + labelText + "\"]";
        String xpath = "//label[translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='"
                + labelText.toLowerCase() + "']";

        if (beforetext != null && !beforetext.trim().isEmpty()) {
            xpath += "/preceding::*[contains(text(), '" + beforetext + "')]";
            System.out.println("<<### Added beforetext filter: label before " + beforetext);
        }
        
        if (aftertext != null && !aftertext.trim().isEmpty()) {
            xpath = "//*[contains(text(), '" + aftertext + "')]//following::" + xpath;
            System.out.println("<<### Added aftertext filter: label after " + aftertext);
        }
        
        if (labelIndex != 0) {
            xpath = "(" + xpath + ")[" + (labelIndex + 1) + "]";
        }
        
        System.out.println("<<### Final XPath: " + xpath);
        
        try {
            labelElement = Finder.findWebDriver().findElement(By.xpath(xpath));
            System.out.println("<<### Found label successfully with enhanced XPath");
        } catch (Exception e) {
            String fallbackXPath = labelIndex != 0 
                ? "//label[text()=\"" + labelText + "\"][" + (labelIndex + 1) + "]"
                : "//label[text()=\"" + labelText + "\"]";
            
            labelElement = Finder.findWebDriver().findElement(By.xpath(fallbackXPath));
            System.out.println("<<### Found label with fallback simple XPath");
        }
        
        try {
            new Utils().scrollMid(labelElement);
        } catch (Exception ignore) {}
        
        try {
            labelElement.click();
            System.out.println("<<### Clicked label successfully");
        } catch (Exception e) {
            ((JavascriptExecutor) Finder.findWebDriver()).executeScript("arguments[0].click()", labelElement);
            System.out.println("<<### Clicked label via JS");
        }
        return labelElement;
        
    } catch (Exception e) {
        System.out.println("<<### Label not found: " + labelText + " - " + e.getMessage());
        return null;
    }
}

	private WebElement findTargetDropdownNearLabel(WebElement labelElement, String labelText) throws InterruptedException {
		
		System.out.println("<<### LabelText: " + labelText);
	    try {
	        WebElement parent = labelElement.findElement(By.xpath("./ancestor::div[contains(@class,'field') or contains(@class,'form') or contains(@class,'input')][1]"));
	        
	        List<WebElement> chosenContainers = parent.findElements(By.cssSelector("div.chosen-container"));
	        if (!chosenContainers.isEmpty()) {
	            System.out.println("<<### Found Chosen container near label");
	            return chosenContainers.get(0);
	        }
	        
	        List<WebElement> comboContainers = parent.findElements(By.cssSelector("div.ComboBox__field"));
	        if (!comboContainers.isEmpty()) {
	            System.out.println("<<### Found ComboBox container near label");
	            return comboContainers.get(0);
	        }
	        
	    } catch (Exception ignore) {}
	    
	    try {

			List<WebElement> followingChosen = null;
	        String xPath = "./following::div[contains(@class,'chosen-container')][1]";

	        followingChosen = Finder.findWebDriver().findElements(By.xpath("//following::select[@aria-label = '"+ labelText +"']//following::div[1]"));
	        if (followingChosen.isEmpty()) {
	        	followingChosen = labelElement.findElements(By.xpath(xPath));
			}
	        System.out.println("<<### Following Chosen Xpath: " + xPath);
	        if (!followingChosen.isEmpty()) {
		        	System.out.println("<<### Following Chosen Element: " + followingChosen.get(0).getAttribute("outerHTML"));
	            System.out.println("<<### Found following Chosen container");	
	            return followingChosen.get(0);
	        }
	        
	        List<WebElement> followingCombo = labelElement.findElements(By.xpath("./following::div[contains(@class,'ComboBox__field')][1]"));
	        if (!followingCombo.isEmpty()) {
	            System.out.println("<<### Found following ComboBox container");
	            return followingCombo.get(0);
	        }
	        
	    } catch (Exception ignore) {}
	    
	    System.out.println("<<### Could not find dropdown container");
	    return null;
	}

	private String detectDropdownType(WebElement dropdownContainer) throws InterruptedException {
	    System.out.println("<<### Inside Detect DropDownType Method");
	    try {
	        String containerClass = dropdownContainer.getAttribute("class");
	        if (containerClass != null && containerClass.contains("chosen-container")) {

	            // Handling Chosen single first
	            if (containerClass.contains("chosen-container-single")) { 
	                List<WebElement> singleAnchors = dropdownContainer.findElements(By.cssSelector("a.chosen-single"));
	                System.out.println("<<### Inside IF chosen-container-single ");
	                if (!singleAnchors.isEmpty()) {
	                    WebElement anchor = singleAnchors.get(0);
	                    String anchorClass = anchor.getAttribute("class");
	                    
	                    // If anchor already has "with-scopes", treating it as hierarchical
	                    if (anchorClass != null && anchorClass.contains("chosen-single-with-scopes")) {
	                        System.out.println("<<### Detected Chosen HIERARCHICAL (single-with-scopes via anchor class)");
	                        return "CHOSEN_HIERARCHICAL";
	                    }

	                    // Open dropdown to inspect results for scope items
	                    try {
	                        anchor.click();
	                        Thread.sleep(600);

	                        // Wait for visible results
	                        WebElement resultsList = null;
	                        for (int i = 0; i < 10; i++) {
	                            try {
	                                for (WebElement ul : dropdownContainer.findElements(By.cssSelector("ul.chosen-results"))) {
	                                    if (ul.isDisplayed()) { resultsList = ul; break; }
	                                }
	                                if (resultsList != null) break;
	                            } catch (Exception ignore) {}
	                            Thread.sleep(200);
	                        }

	                        // If any 'is-scope' entries are present, this is hierarchical
	                        if (resultsList != null) {
	                            List<WebElement> scopeItems = resultsList.findElements(By.cssSelector("li.active-result.is-scope"));
	                            if (!scopeItems.isEmpty()) {
	                                System.out.println("<<### Detected Chosen HIERARCHICAL dropdown (single with scopes)");
	                                return "CHOSEN_HIERARCHICAL";
	                            }
	                        }
	                    } catch (Exception e) {
	                        System.out.println("<<### Single chosen open/check failed: " + e.getMessage());
	                    }

	                    // Fall back to plain single
	                    System.out.println("<<### Detected Chosen SINGLE dropdown (no scopes)");
	                    return "CHOSEN_SINGLE";
	                } else {
	                    System.out.println("<<### Single Element Is Empty");
	                }
	            }
	            
	            else {
	                List<WebElement> multiInputs = dropdownContainer.findElements(By.cssSelector("div.chosen-choices input[role='combobox']"));
	                System.out.println("<<### Inside ELSE div.chosen-choices input[role='combobox']");
	                if (!multiInputs.isEmpty()) {
	                    System.out.println("<<### Detected Chosen MULTI dropdown (element check)");
	                    return "CHOSEN";
	                }
	            }
	        }

	        List<WebElement> comboInputs = dropdownContainer.findElements(By.cssSelector("input.ComboBox__input[role='combobox']"));
	        if (!comboInputs.isEmpty()) {
	            System.out.println("<<### Detected ComboBox dropdown (element check)");
	            return "COMBOBOX";
	        }

	    } catch (Exception e) {
	        System.out.println("<<### Detection exception: " + e.getMessage());
	    }
	    return "UNKNOWN";
	}

	private boolean selectChosenFlatRobust(WebElement dropdownContainer, String value, boolean partialText) throws ToolNotSetException, InterruptedException {
	    System.out.println("<<### Selecting in Chosen dropdown: " + value);
	    
	    // Clear pre-selected values first
	    try {
	        List<WebElement> clearButtons = dropdownContainer.findElements(By.cssSelector("abbr.search-choice-close"));
	        if (!clearButtons.isEmpty()) {
	            System.out.println("<<### Found pre-selected values, clearing them first");
	            for (WebElement clearBtn : clearButtons) {
	                try {
	                    clearBtn.click();
	                    Thread.sleep(200);
	                    System.out.println("<<### Cleared a pre-selected value");
	                } catch (Exception e) {
	                    ((JavascriptExecutor) Finder.findWebDriver()).executeScript("arguments[0].click()", clearBtn);
	                    Thread.sleep(200);
	                    System.out.println("<<### Cleared pre-selected value via JS");
	                }
	            }
	            Thread.sleep(300);
	        }
	    } catch (Exception ignore) {
	        System.out.println("<<### No pre-selected values found or error clearing them");
	    }
	    
	    int maxAttempts = 3;
	    for (int attempt = 1; attempt <= maxAttempts; attempt++) {
	        try {
	            System.out.println("<<### Attempt " + attempt + " to select: " + value);
	            
	            boolean dropdownAlreadyOpen = false;
	            try {
	                List<WebElement> visibleResults = dropdownContainer.findElements(By.cssSelector("ul.chosen-results"));
	                for (WebElement list : visibleResults) {
	                    if (list.isDisplayed()) {
	                        dropdownAlreadyOpen = true;
	                        System.out.println("<<### Dropdown already open, skipping click");
	                        break;
	                    }
	                }
	            } catch (Exception ignore) {}
	            
	            // Only clicking if not already open
	            if (!dropdownAlreadyOpen) {
	                boolean clickSuccess = false;
	                
	                // Trying single chosen first
	                try {
	                    WebElement singleInput = dropdownContainer.findElement(By.cssSelector("a.chosen-single"));
	                    singleInput.click();
	                    Thread.sleep(700);
	                    System.out.println("<<### Clicked single chosen input");
	                    clickSuccess = true;
	                } catch (Exception e) {
	                    // Fallback to multi chosen
	                    try {
	                        WebElement multiInput = dropdownContainer.findElement(By.cssSelector("div.chosen-choices input[role='combobox']"));
	                        multiInput.click();
	                        Thread.sleep(500);
	                        System.out.println("<<### Clicked multi chosen input");
	                        clickSuccess = true;
	                    } catch (Exception e2) {
	                        System.out.println("<<### Could not click any chosen input");
	                    }
	                }
	                
	                if (!clickSuccess && attempt < maxAttempts) {
	                    continue;
	                }
	            }
	            
	            // Wait for results with extended timeout
	            WebElement resultsList = null;
	            for (int waitAttempt = 0; waitAttempt < 20; waitAttempt++) {
	                try {
	                    List<WebElement> lists = dropdownContainer.findElements(By.cssSelector("ul.chosen-results"));
	                    for (WebElement list : lists) {
	                        if (list.isDisplayed()) {
	                            resultsList = list;
	                            break;
	                        }
	                    }
	                    if (resultsList != null) break;
	                } catch (Exception ignore) {}
	                Thread.sleep(100);
	            }
	            
	            if (resultsList == null) {
	                System.out.println("<<### Attempt " + attempt + ": Results not visible");
	                continue;
	            }
	            
	            List<WebElement> items = resultsList.findElements(By.cssSelector("li.active-result"));
	            System.out.println("<<### Attempt " + attempt + ": Found " + items.size() + " options");
	            
	            if (items.isEmpty()) {
	                System.out.println("<<### Attempt " + attempt + ": No options available");
	                continue;
	            }
	            
	            for (int i = 0; i < Math.min(items.size(), 5); i++) {
	                try {
	                    String optionText = items.get(i).getText().trim();
	                    System.out.println("<<### Option " + (i + 1) + ": '" + optionText + "'");
	                } catch (Exception ignore) {}
	            }
	            
	            // Finding matching item
	            WebElement matchingItem = null;
	            for (WebElement item : items) {
	                try {
	                    String itemText = item.getText().trim();
	                    if (itemText.equalsIgnoreCase(value) || 
	                       (partialText && itemText.toLowerCase().contains(value.toLowerCase()))) {
	                        matchingItem = item;
	                        System.out.println("<<### Found matching item: '" + itemText + "' for input: '" + value + "'");
	                        break;
	                    }
	                } catch (Exception ignore) {}
	            }
	            
	            if (matchingItem == null) {
	                System.out.println("<<### Attempt " + attempt + ": Item not found: " + value);
	                continue;
	            }
	            
	            try {
	                matchingItem.click();
	                System.out.println("<<### SUCCESS: Clicked item successfully on attempt " + attempt);
	                Thread.sleep(300);
	                
	                try {
	                    ((JavascriptExecutor) Finder.findWebDriver()).executeScript("document.activeElement.blur();");
	                    Thread.sleep(200);
	                    ((JavascriptExecutor) Finder.findWebDriver()).executeScript("document.body.focus();");
	                    Thread.sleep(200);
	                    ((JavascriptExecutor) Finder.findWebDriver()).executeScript("window.focus();");
	                    Thread.sleep(100);
	                } catch (Exception ignore) {}
	                
	                return true;
	            } catch (Exception e) {
	                try {
	                    ((JavascriptExecutor) Finder.findWebDriver()).executeScript("arguments[0].click()", matchingItem);
	                    System.out.println("<<### SUCCESS: JS click successful on attempt " + attempt);
	                    Thread.sleep(300);
	                    
	                    try {
	                        ((JavascriptExecutor) Finder.findWebDriver()).executeScript("document.activeElement.blur();");
	                        Thread.sleep(200);
	                        ((JavascriptExecutor) Finder.findWebDriver()).executeScript("document.body.focus();");
	                        Thread.sleep(200);
	                        ((JavascriptExecutor) Finder.findWebDriver()).executeScript("window.focus();");
	                        Thread.sleep(100);
	                    } catch (Exception ignore) {}
	                    
	                    return true;
	                } catch (Exception e2) {
	                    System.out.println("<<### Attempt " + attempt + ": Click failed - " + e2.getMessage());
	                }
	            }
	            
	        } catch (Exception e) {
	            System.out.println("<<### Attempt " + attempt + ": Exception - " + e.getMessage());
	        }
	        
	        if (attempt < maxAttempts) {
	            Thread.sleep(500);
	        }
	    }
	    
	    System.out.println("<<### FAILED: All attempts exhausted for: " + value);
	    return false;
	}

	// Hierarchical Chosen (like Commodity dropdown)
	private boolean selectChosenHierarchical(WebElement dropdownContainer, String hierarchicalPath, boolean partialText) throws ToolNotSetException, InterruptedException {
		System.out.println("<<### Inside selectChosenHierarchical Method");

		System.out.println("<<### Processing Chosen hierarchical path: " + hierarchicalPath);
	    String[] hops = hierarchicalPath.split("\\|\\|");
	    
	    for (int i = 0; i < hops.length; i++) {
	        String currentHop = hops[i].trim();
	        System.out.println("<<### Processing Chosen hop " + (i + 1) + ": " + currentHop);
	        
	        boolean hopSuccess = selectChosenFlatRobust(dropdownContainer, currentHop, partialText);
	        if (!hopSuccess) {
	            System.out.println("<<### FAIL: Chosen hop failed: " + currentHop);
	            return false;
	        }
	        
	        if (i < hops.length - 1) {
	            Thread.sleep(800);
	        }
	    }
	    
	    System.out.println("<<### SUCCESS: Chosen hierarchical path completed");
	    return true;
	}

	// ComboBox Flat
	private boolean selectComboBoxFlat(WebElement dropdownContainer, String value, boolean partialText) throws InterruptedException, ToolNotSetException {
	    System.out.println("<<## Inside selectComboBoxFlat Method");
		System.out.println("<<### Selecting in ComboBox dropdown: " + value);
	    
	    // Clearing pre-selected values first
	    try {
	        List<WebElement> clearButtons = dropdownContainer.findElements(By.cssSelector("span.s-clearSelection.ComboBox__clearSelection"));
	        if (!clearButtons.isEmpty()) {
	            System.out.println("<<### Found pre-selected values, clearing them first");
	            try {
	                clearButtons.get(0).click();
	                Thread.sleep(500);
	                System.out.println("<<### Successfully cleared pre-selected values");
	            } catch (Exception e) {
	                ((JavascriptExecutor) Finder.findWebDriver()).executeScript("arguments[0].click()", clearButtons.get(0));
	                Thread.sleep(500);
	                System.out.println("<<### Cleared pre-selected values via JS");
	            }
	        }
	    } catch (Exception ignore) {
	        System.out.println("<<### No pre-selected values found or error clearing them");
	    }

	    // Re-open dropdown after clearing
		try {
			WebElement input = dropdownContainer.findElement(By.cssSelector("input.ComboBox__input[role='combobox']"));
			new Utils().scrollMid(input);
			System.out.println("<<### ScrolledMid Successfully for Input");
			input.click();

			// wait until dropdown items visible
			WebDriverWait wait = new WebDriverWait(Finder.findWebDriver(), 10);
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("li.s-selectOption.ComboBox__resultItem")));
		} catch (Exception e) {
			e.printStackTrace();
		}
	    
	    WebElement resultsList = null;
	    for (int attempt = 0; attempt < 20; attempt++) {
	        try {
	            List<WebElement> lists = Finder.findWebDriver().findElements(By.cssSelector("ul.ComboBox__results"));
	            for (WebElement list : lists) {
	                if (list.isDisplayed()) {
	                    resultsList = list;
	                    break;
	                }
	            }
	            if (resultsList != null) break;
	        } catch (Exception ignore) {}
	        Thread.sleep(100);
	    }
	    
	    if (resultsList == null) {
	        System.out.println("<<### FAIL: ComboBox results not visible");
	        return false;
	    }
	    
	    List<WebElement> items = resultsList.findElements(By.cssSelector("li.s-selectOption.ComboBox__resultItem"));
	    System.out.println("<<### ComboBox options: " + items.size());
	    
	    WebElement matchingItem = null;
	    for (WebElement item : items) {
	        try {
	            String itemText = item.getText().trim();
	            if (itemText.equalsIgnoreCase(value) || 
	               (partialText && itemText.toLowerCase().contains(value.toLowerCase()))) {
	                matchingItem = item;
	                System.out.println("<<### Found matching ComboBox item: '" + itemText + "' for input: '" + value + "'");
	                break;
	            }
	        } catch (Exception ignore) {}
	    }
	    
	    if (matchingItem == null) {
	        System.out.println("<<### FAIL: ComboBox item not found: " + value);
	        return false;
	    }
	    
	    try {
	        new Utils().scrollMid(matchingItem);
            System.out.println("<<### ScrolledMid Successfully for MatchingItem");
	        Thread.sleep(200);
	        
	        matchingItem.click();
	        System.out.println("<<### SUCCESS: ComboBox click successful");
	        Thread.sleep(300);
	        //((JavascriptExecutor) Finder.findWebDriver()).executeScript("document.activeElement.blur();");

	        return true;
	    } catch (Exception e) {
	        try {
	            ((JavascriptExecutor) Finder.findWebDriver()).executeScript("arguments[0].click()", matchingItem);
	            System.out.println("<<### SUCCESS: ComboBox JS click successful");
	            Thread.sleep(300);

	            //((JavascriptExecutor) Finder.findWebDriver()).executeScript("document.activeElement.blur();");
	            return true;
	        } catch (Exception e2) {
	            System.out.println("<<### FAIL: ComboBox click failed");
	            return false;
	        }
	    }
	}

	// ComboBox Hierarchical
	private boolean selectComboBoxHierarchical(WebElement dropdownContainer, String hierarchicalPath, boolean partialText) throws ToolNotSetException, InterruptedException {
	    System.out.println("<<## Inside selectComboBoxHierarchical Method");
		System.out.println("<<### Processing hierarchical path: " + hierarchicalPath);
	    String[] hops = hierarchicalPath.split("\\|\\|");
	    
	    for (int i = 0; i < hops.length; i++) {
	        String currentHop = hops[i].trim();
	        System.out.println("<<### Processing hop " + (i + 1) + ": " + currentHop);
	        
	        boolean hopSuccess = selectComboBoxFlat(dropdownContainer, currentHop, partialText);
	        if (!hopSuccess) {
	            System.out.println("<<### FAIL: Hop failed: " + currentHop);
	            return false;
	        }
	        
	        if (i < hops.length - 1) {
	            Thread.sleep(500);
	        }
	    }
	    
	    System.out.println("<<### SUCCESS: Hierarchical path completed");
	    return true;
	}

		
	// Coupa_SearchAndSelect Method
	public FunctionResult Method_Coupa_SearchAndSelectByText(WebDriverObject object, String labelText,
			String valueToSelect, int valueIndex, int labelIndex, String beforeText, String afterText,
			boolean partialText) throws Exception {

		if (WebDriverDispatcher.applySkipStepValidation)
			Validations.checkMandatoryDataForBlank(1);
		Validations.checkDataForBlank(1);

		String finalLabelText = labelText;
		String finalValueToSelect = valueToSelect;
		int finalValueIndex = valueIndex;
		int finalLabelIndex = labelIndex;
		String finalBeforeText = beforeText;
		String finalAfterText = afterText;

		if (object.getDropDownLabel().getValue() != null && !object.getDropDownLabel().getValue().trim().isEmpty()) {
			
			System.out.println("<<### Inside object GetDropDownLabel ");

			OpkeyLogger.printSaasLog(_class, object.getDropDownLabel().getValue());
			finalLabelText = object.getDropDownLabel().getValue();

			// Handling ValueToSelect
			if (object.getValue() != null && object.getValue().getValue() != null) {
				OpkeyLogger.printSaasLog(_class, "ValueToSelect: " + object.getValue().getValue());
				finalValueToSelect = object.getValue().getValue();
			}

			// Handling ValueIndex
			if (object.getIndex() != null && object.getIndex().getValue() != null) {
				OpkeyLogger.printSaasLog(_class, "ValueIndex: " + object.getIndex().getValue());
				try {
					finalValueIndex = Integer.parseInt(object.getIndex().getValue());
				} catch (Exception ex) {
					OpkeyLogger.printSaasLog(_class,
							"ValueIndex found Not to be Integer. Considering 0 as new ValueIndex");
					finalValueIndex = 0;
				}
			}

			// Handling LabelIndex
			if (object.getIndex() != null && object.getIndex().getValue() != null) {
				OpkeyLogger.printSaasLog(_class, "LabelIndex: " + object.getIndex().getValue());
				try {
					finalLabelIndex = Integer.parseInt(object.getIndex().getValue());
				} catch (Exception ex) {
					OpkeyLogger.printSaasLog(_class, "Index found Not to be Integer. Considering 0 as new Index");
					finalLabelIndex = 0;
				}
			}

			if (object.getBefore() != null && object.getBefore().getValue() != null) {
				OpkeyLogger.printSaasLog(_class, "BeforeText: " + object.getBefore().getValue());
				finalBeforeText = object.getBefore().getValue();
			}

			if (object.getAfter() != null && object.getAfter().getValue() != null) {
				OpkeyLogger.printSaasLog(_class, "AfterText: " + object.getAfter().getValue());
				finalAfterText = object.getAfter().getValue();
			}
			
			// Handling PartialText
//			if (object.getPartialText() != null && !object.getPartialText().isValueNullOrEmpty()) {
//			    try {
//			        partialText = Boolean.parseBoolean(object.getPartialText().getValue());
//			        OpkeyLogger.printSaasLog(_class, "PartialText: " + partialText);
//			    } catch (Exception ex) {
//			        OpkeyLogger.printSaasLog(_class, "Invalid PartialText value. Defaulting to false.");
//			        partialText = false;
//			    }
//			}
			
			if (object.getPartialText() != null && !object.getPartialText().isValueNullOrEmpty()) {
			    partialText = Boolean.parseBoolean(object.getPartialText().getValue());
			    OpkeyLogger.printSaasLog(_class, "PartialText set to: " + partialText);
			}
		}

		if (finalBeforeText == null) {
			finalBeforeText = "";
		}
		if (finalAfterText == null) {
			finalAfterText = "";
		}

		FunctionResult fr = searchAndselectByText(finalLabelText, finalValueToSelect, finalValueIndex, finalLabelIndex,
				finalBeforeText, finalAfterText, partialText);
//		if (fr.getOutput().equalsIgnoreCase("false")) {
//			fr.setMessage("No Object Found With Text <" + finalLabelText + ">");
//		}
		return fr;

	}
	
	private FunctionResult searchAndselectByText(String labelText, String valueToSelect, int valueIndex, int labelIndex,
			String beforeText, String afterText, Boolean partialText) throws Exception {

		String labelBeforeText = beforeText.trim();
		String labelAfterText = afterText.trim();

		return new Checkpoint() {
			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				String labelXpath = "";

				if (labelText != null && !labelText.trim().isEmpty()) {
					labelXpath = "text()='" + labelText.trim() + "'";
				} else {
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
							.setMessage("Label text is null or empty").make();
				}

				new Utils().waitForPageLoadAndOtherAjax();
				new Utils().waitForAjaxAndJqueryToLoad();

				try {
					List<WebElement> labelEles = new ArrayList<WebElement>();

					if ((labelBeforeText != null && !labelBeforeText.isEmpty()) || (labelAfterText != null && !labelAfterText.isEmpty())) {
						OpkeyLogger.printSaasLog(_class, ">>Finding label using beforeText and/or afterText!");

						String beforeTextCondition = (labelBeforeText != null && !labelBeforeText.isEmpty())
								? " and ./following::*[text()='" + labelBeforeText + "']"
								: "";
						String afterTextCondition = (labelAfterText != null && !labelAfterText.isEmpty())
								? " and ./preceding::*[text()='" + labelAfterText + "']"
								: "";

						String dynamicXpath = String.format("//*[(self::span or self::label) and %s %s %s]", labelXpath,
								afterTextCondition, beforeTextCondition);

						labelEles = Finder.findWebDriver().findElements(By.xpath(dynamicXpath));
					} else {
						OpkeyLogger.printSaasLog(_class, ">>Finding label!");
						labelEles = Finder.findWebDriver()
								.findElements(By.xpath("//*[(self::span or self::label) and " + labelXpath + "]"));
					}

					labelEles = Utils.visible(labelEles);
					OpkeyLogger.printSaasLog(_class, "visible Label size:" + labelEles.size());

					if (labelEles.size() == 0 || labelEles.size() <= labelIndex) {
						return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
								.setMessage("No Object Found With Text <" + labelText + "> at index " + labelIndex).make();
					}

					OpkeyLogger.printSaasLog(_class, "Index:" + labelIndex);
					OpkeyLogger.printSaasLog(_class, "LabelEle:" + labelEles.get(labelIndex).getAttribute("outerHTML"));

					List<WebElement> dropdownSearch = labelEles.get(labelIndex).findElements(By.xpath(
							".//following::div[contains(@class,'chosen-container') and contains(@class,'chosen-container-single')][1]"));

					if (dropdownSearch.size() > 0) {
						new WebObjects().ClickElement(dropdownSearch.get(0));
						Thread.sleep(800);

						String dropdownId = dropdownSearch.get(0).getAttribute("id");
						System.out.println("<<### Dropdown ID: " + dropdownId);

						String resultsId;
						if (!dropdownId.trim().isEmpty()) {
							resultsId = dropdownId.replace("_chosen", "") + "_chosen_results";
						} else {
							// Adding fall back for a ul where id was undefined_results
							resultsId = "undefined_results";
						}

						List<WebElement> coupaInputEles = Finder.findWebDriver()
								.findElements(By.xpath("//input[@role='combobox' and @aria-owns='" + resultsId + "']"));

						coupaInputEles = Utils.visible(coupaInputEles);
						System.out.println("After Visibility Check : " + coupaInputEles.size());
						
						if (coupaInputEles.size() > 0) {
							System.out.println("<<### Coupa Input Element: " + coupaInputEles.get(0).getAttribute("outerHTML"));
						}
						System.out.println("<<### inputEles size:" + coupaInputEles.size());

						if (coupaInputEles.size() == 0) {
							System.out.println("<<### coupaInputEles Size is Null, Returning Fail");
							return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
									.setMessage("Input element not found after clicking dropdown").make();
						}

						WebElement combobox = coupaInputEles.get(0);

						try {
						    ((JavascriptExecutor) Finder.findWebDriver())
						        .executeScript("arguments[0].value = '';", combobox);
						    System.out.println("<<### Cleared input using JavaScript");
						} catch (Exception e) {
						    System.out.println("<<### Failed to clear via JS: " + e.getMessage());
						}

						for (char ch : valueToSelect.toCharArray()) {
							combobox.sendKeys(String.valueOf(ch));
							Thread.sleep(100);
						}
						Thread.sleep(500);
						System.out.println("<<### Typing done");

						new Utils().waitForPageLoadAndOtherAjax();
						new Utils().waitForAjaxAndJqueryToLoad();

						// Finding DropDown options
						WebDriverWait wait = new WebDriverWait(Finder.findWebDriver(), 10);

						try {
							wait.until(ExpectedConditions
									.presenceOfElementLocated(By.xpath("//ul[@id='" + resultsId + "']//li[@role='option']")));
						} catch (Exception e) {
							System.out.println("<<### Options not immediately available, proceeding with search");
						}

						// 1: Specific ID with class filter
						List<WebElement> optionsList = Finder.findWebDriver().findElements(
								By.xpath("//ul[@id='" + resultsId + "']//li[@role='option' and @class='active-result']"));
						System.out.println("<<### ID with class - Options found: " + optionsList.size());

						// 2: Specific ID without class filter
						if (optionsList.isEmpty()) {
							optionsList = Finder.findWebDriver()
									.findElements(By.xpath("//ul[@id='" + resultsId + "']//li[@role='option']"));
							System.out.println("<<### ID without class - Options found: " + optionsList.size());
						}

						System.out.println("<<### Total options found: " + optionsList.size());

						if (optionsList.size() == 0) {
							return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
									.setMessage("No options found after typing '" + valueToSelect + "'").make();
						}

						// Filter matching options (partial + case-insensitive)
						String matchXpath;
						if (partialText) {
							System.out.println("<<### Inside Partial Text block, Partial Text Exist");
						    // Case-insensitive partial match
						    matchXpath = "//ul[@id='" + resultsId
						        + "']//li[@role='option'][contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '"
						        + valueToSelect.toLowerCase() + "')]";
						} else {
							System.out.println("<<### Partial Text Doesn't Exist");
						    // Case-insensitive exact match
						    matchXpath = "//ul[@id='" + resultsId
						        + "']//li[@role='option'][translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='"
						        + valueToSelect.toLowerCase() + "']";
						}

						List<WebElement> matchingOptions = Finder.findWebDriver().findElements(By.xpath(matchXpath));
						System.out.println("<<### Total matching options found: " + matchingOptions.size());
						System.out.println("<<### Matching Options Text: " + matchingOptions);

//						// Filter matching options
//						List<WebElement> matchingOptions = Finder.findWebDriver().findElements(By.xpath("//ul[@id='" + resultsId
//								+ "']//li[@role='option'][contains(normalize-space(.), '" + valueToSelect + "')]"));
//
//						System.out.println("<<### Total matching options found: " + matchingOptions.size());

						if (matchingOptions.size() == 0) {
							return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
									.setMessage("No matching options found for: " + valueToSelect).make();
						}

						// Select option based on index
						WebElement selectedOption = null;
						String selectionMessage = "";

						if (valueIndex > 0) {
							if (matchingOptions.size() >= valueIndex) {
								selectedOption = matchingOptions.get(valueIndex - 1);
								selectionMessage = "Selecting option at index " + valueIndex;
							} else {
								return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
										.setMessage("ValueIndex " + valueIndex + " not found. Only " + matchingOptions.size()
												+ " matching options available.")
										.make();
							}
						} else {
							selectedOption = matchingOptions.get(0);
							selectionMessage = "Selecting first matching option";
						}

						System.out.println("<<### " + selectionMessage);

						if (selectedOption != null) {
							String optionText = "";
							try {
								optionText = selectedOption.getText().trim();
							} catch (StaleElementReferenceException e) {
								System.out.println("<<### Selected option became stale, finding fresh element");
							}

							for (int attempt = 1; attempt <= 3; attempt++) {
								try {
//									String xpath = "//ul[@id='" + resultsId
//											+ "']//li[@role='option'][contains(normalize-space(.), '" + valueToSelect + "')]["
//											+ (valueIndex > 0 ? valueIndex : 1) + "]";

									String xpath;
									if (partialText) {
										// case-insensitive partial match
										xpath = "//ul[@id='" + resultsId
												+ "']//li[@role='option'][contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '"
												+ valueToSelect.toLowerCase() + "')]["
												+ (valueIndex > 0 ? valueIndex : 1) + "]";
									} else {
										// case-insensitive exact match
										xpath = "//ul[@id='" + resultsId
												+ "']//li[@role='option'][translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='"
												+ valueToSelect.toLowerCase() + "']["
												+ (valueIndex > 0 ? valueIndex : 1) + "]";
									}

									WebElement freshOption = wait
											.until(ExpectedConditions.elementToBeClickable(By.xpath(xpath)));

									optionText = freshOption.getText().trim();
									System.out.println("<<### Attempt " + attempt + " - clicking: " + optionText);
									freshOption.click();

									System.out.println("<<### Successfully selected option: " + optionText);
									return Result.PASS().setOutput(true).setMessage("DropDown Selected Successfully")
											.make();

								} catch (StaleElementReferenceException e) {
									System.out.println("<<### Stale element on attempt " + attempt + ", retrying...");
									if (attempt == 3) {
										return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
												.setMessage(
														"Failed to click option due to stale element after 3 attempts")
												.make();
									}
									try {
										Thread.sleep(500);
									} catch (InterruptedException ie) {
									}
								} catch (Exception e) {
									System.out.println("<<### Click attempt " + attempt + " failed: " + e.getMessage());
									if (attempt == 3) {
										return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
												.setMessage("Failed to click option: " + e.getMessage()).make();
									}
									try {
										Thread.sleep(500);
									} catch (InterruptedException ie) {
									}
								}
							}
						}

						return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
								.setMessage("Failed to select any option").make();

					} else {
						return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
								.setMessage("No compatible dropdown found for the given label").make();
					}

				} catch (Exception e) {
					OpkeyLogger.printSaasLog(_class, "Exception in dropdown handling: " + e.getMessage());
					e.printStackTrace();
					//throw new RetryKeywordAgainException();
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
							.setMessage("Failed to handle dropdown for label <" + labelText + ">: " + e.getMessage()).make();
				}
			}
		}.run();
	}

	
	public FunctionResult OF_selectDropDownByText(String OlabelSearch, int Oindex, boolean OisContains, String dropdownText, boolean Obefore, boolean isMultipleDropdown, WebDriverObject object)
			throws Exception {
		String labelSearch = OlabelSearch;
		int index = Oindex;
		boolean isContains = OisContains;
		boolean before = Obefore;

		if (object.getDropDownLabel().getValue() != null && (!object.getDropDownLabel().getValue().isEmpty() || !object.getDropDownLabel().getValue().equals(""))) {
			OpkeyLogger.printSaasLog(_class, object.getDropDownLabel().getValue());
			labelSearch = object.getDropDownLabel().getValue();
			OpkeyLogger.printSaasLog(_class, object.getIndex().getValue());
			try {
				index = Integer.parseInt(object.getIndex().getValue());
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "Index found Not to be Integer.Considering 0 as new Index");
				index = 0;
			}
			OpkeyLogger.printSaasLog(_class, object.getPartialText().getValue());
			try {
				isContains = Boolean.parseBoolean(object.getPartialText().getValue());
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "PartialText found Not to be Boolean.Considering False as Default");
				isContains = false;
			}

			try {
				before = Boolean.parseBoolean(object.getBefore().getValue());
				OpkeyLogger.printSaasLog(_class, "before:" + before);
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "PartialText found Not to be Boolean.Considering False as Default");
				isContains = false;
			}
		} else {
			Validations.checkDataForBlank(0);
			Validations.checkDataForNegative(1);
			FunctionResult fr = selectDropDownByText(labelSearch, index, isContains, dropdownText, before, isMultipleDropdown);
			if (fr.getOutput().equalsIgnoreCase("false")) {
				fr.setMessage("No Object Found With Text <" + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue() + ">");
			}
			return fr;
		}

		FunctionResult fr = selectDropDownByText(labelSearch, index, isContains, dropdownText, before, isMultipleDropdown);
		if (fr.getOutput().equalsIgnoreCase("false")) {
			fr.setMessage("No Object Found With Text <" + labelSearch + ">");
		}
		return fr;
	}

	/**
	 *
	 * @CheckPoint True
	 * 
	 */

	private FunctionResult selectDropDownByText(String OlabelSearch, int Oindex, boolean OisContains, String dropdownText, boolean before, boolean isMultipleDropdown) throws Exception {
		return selectDropDownByText(OlabelSearch, Oindex, OisContains, dropdownText, 0, before, isMultipleDropdown);

	}

	protected FunctionResult selectDropDownByText(String OlabelSearch, int Oindex, boolean OisContains, String dropdownText, int dropDownIndex, boolean before, boolean isMultipleDropdown)
			throws Exception {
		String finalDropdownText = dropdownText.trim();
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				WebElement dropdownElement = getDropdownElementByText(OlabelSearch, Oindex, OisContains, dropdownText, dropDownIndex, before);
				if (dropdownElement == null)
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
							.setMessage("Dropdown not found With Text <" + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue() + ">").make();

				System.out.println("##>> here the dropdownElement is "+dropdownElement.getAttribute("outerHTML"));
				new Utils().scrollIntoView_Extended(dropdownElement);
				if (dropdownElement.getTagName().equalsIgnoreCase("select")) {
					return new com.crestech.opkey.plugin.webdriver.keywords.DropDown().selectDropDownOptionByText(dropdownElement, isMultipleDropdown, finalDropdownText);
				}

				// It is a ComboBox
				return selectComboBoxOptionByText(dropdownElement, dropdownText);
			}
		}.run();
	}

	protected FunctionResult getDropDownTextByText(String OlabelSearch, int Oindex, boolean OisContains, String dropdownText, int dropDownIndex, boolean before, boolean isMultipleDropdown)
			throws Exception {
		String finalDropdownText = dropdownText.trim();
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				String texts = "";

				WebElement dropdownElement = getDropdownElementByText(OlabelSearch, Oindex, OisContains, dropdownText, dropDownIndex, before);
				if (dropdownElement == null)
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
							.setMessage("Dropdown not found With Text <" + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue() + ">").make();

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

	private WebElement getDropdownElementByText(String labelSearch, int index, boolean isContains, String dropdownText, boolean before) {
		return getDropdownElementByText(labelSearch, index, isContains, dropdownText, 0, before);
	}

	private WebElement getDropdownElementByText(String labelSearch, int lebelIndex, boolean isContains, String dropdownText, int dropdownIndex, boolean before) {
		new Utils().someChecksBeforeTextKeywords();
		labelSearch = labelSearch.trim();
		List<WebElement> eles = new ArrayList<WebElement>();
		try {
			eles = Finder.findElementByText(labelSearch, isContains, lebelIndex);
		} catch (Exception e) {
			return null;
		}
		if (eles.size() == 0)
			return null;

		OpkeyLogger.printSaasLog(_class, eles.size());

		WebElement labelElement = eles.get(lebelIndex);
		
		if (KeywordContext.get().runningPlugin == PluginName.Coupa && Context.current().getFunctionCall().getFunction()
				.getMethodName().equals("OF_selectDropDownByText")) {
			List<WebElement> foundedlabelElements = new ArrayList<WebElement>();
			for (WebElement webElement : eles) {
				if (webElement.getTagName().equals("label")) {
					foundedlabelElements.add(webElement);
				}
			}
			if (foundedlabelElements.size() > 0) {
				labelElement = foundedlabelElements.get(lebelIndex);
			}
		}
		

		WebElement dropdownElement = null;

		String xpath = null;

		/* *********************** */
		if (before) {
			xpath = ".//preceding::*[not(@type='hidden') and (self::select or self::input or self::input[@role='combobox'] or self::a[@title=\"Search: " + labelSearch
					+ "\"] or self::a[@title=\"Search:  " + labelSearch + "\"] or self::a[@title=\"Search\"])]";
		} else {
			xpath = ".//following::*[not(@type='hidden') and (self::select or self::input or self::input[@role='combobox'] or self::a[@title=\"Search: " + labelSearch
					+ "\"] or self::a[@title=\"Search:  " + labelSearch + "\"] or self::a[@title=\"" + labelSearch + "\"]  or self::a[@title=\"Search\"])]";
		}

		try {

			System.out.println("finding dropdown by xpath: " + xpath);

			List<WebElement> list = labelElement.findElements(By.xpath(xpath));

			OpkeyLogger.printSaasLog(_class, list.size());
            
			for (int i = 0; i < eles.size(); i++) {
				System.out.println("the label element is " + eles.get(i).getAttribute("outerHTML"));
				System.out.println("Iteration:" + i);

				if (i == lebelIndex && (eles.get(i).getTagName().equalsIgnoreCase("span")
						|| eles.get(i).getTagName().equalsIgnoreCase("label"))) {

					List<WebElement> parentDiv = eles.get(i)
							.findElements(By.xpath(".//ancestor::div[contains(@class, 'wrapper_vertical')]"));
					if (parentDiv.size() > 0) {
						List<WebElement> divToClick = parentDiv.get(0).findElements(
								By.xpath(".//div[contains(@class, 'chosen-container chosen-container-single')]"));

						if (divToClick.size() > 0) {
							List<WebElement> selectElements = parentDiv.get(0).findElements(By.tagName("select"));
							if (selectElements.size() > 0) {
								WebElement selectElement = selectElements.get(0);

								try {
									List<WebElement> options = selectElement.findElements(By.tagName("option"));

									if (options.size() > 1) {
										return selectElement;
									}
								} catch (Exception e) {
									System.out.println("<<### Exception e: " + e.getMessage());
									// If select interaction fails, u
								}
							}
							return divToClick.get(0);
						}

//						if (divToClick.size() > 0) {
//							List<WebElement> selectElements = parentDiv.get(0).findElements(By.tagName("select"));
//					        System.out.println("<<### selectElements size inside parentDiv[0]: " + selectElements.size() + " >>");
//
//							if(selectElements.size()>0)
//							{
//								System.out.println("<<### Returning first <select> element: " + selectElements.get(0).getAttribute("outerHTML") + " >>");
//						        return selectElements.get(0);
//								//return divToClick.get(0);
//							}
//						}

					}
				}
			}
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

					OpkeyLogger.printAgentLog(_class, "" + ele.getAttribute("outerHTML"));

					if (ele.getTagName().toLowerCase().equals("a")) {
						return ele;
					}
				}

				return dropDownEle;

			} else {

				WebElement dropdownEle = list.get(dropdownIndex);

				if (dropdownEle.getTagName().toLowerCase().equals("input")) {

					if ((list.size() >= dropdownIndex + 2) && list.get(dropdownIndex + 1).getTagName().toLowerCase().equals("a")) {
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

	public String getComboBoxTextByText(WebElement dropdownElement) throws ToolNotSetException, InterruptedException {

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

	public FunctionResult selectComboBoxOptionByText(WebElement dropdownElement, String dropdownText) throws ToolNotSetException, InterruptedException, ObjectNotFoundException {

		new WebObjects().ClickElement(dropdownElement);
		
		Thread.sleep(2000);

		String id = dropdownElement.getAttribute("id");
		String cid="";
		if (id.endsWith("::content")) {
			id = id.substring(0, id.lastIndexOf("::content"));
		} else if (id.endsWith("::lovIconId")) {
			id = id.substring(0, id.lastIndexOf("::lovIconId"));
		}else if (id.endsWith("_chosen")) {
			 cid = id.substring(0, id.lastIndexOf("_chosen"));
		}

		System.out.println("Id found is: " + id);

		WebElement div = null;

		if (id != null && !id.isEmpty()) {
			List<WebElement> popups = Finder.findWebDriver().findElements(By.xpath("//div[@data-afr-popupid=\"" + id + "\"]//div[@class=\"AFPopupMenuContent\"]"));
			System.out.println("popups found is: " + popups.size());

			if (popups.isEmpty()) {

				id = id + "::dropdownPopup";
				
				popups = Finder.findWebDriver().findElements(By.xpath("//div[@data-afr-popupid=\"" + id + "\"]"));
				System.out.println("popups found is: " + popups.size());

			}
			if (popups.isEmpty()) {

				cid = cid + "_chosen_results";

				popups = Finder.findWebDriver().findElements(By.xpath(
						".//div[contains(@class, 'chosen-drop chosen-container-single')]//ul[@id=\"" + cid + "\"]"));
				System.out.println("UL popups found is: " + popups.size());

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
				div = Finder.findWebDriver().findElement(By.className("AFPopupMenuContent"));
				System.out.println("@DIVOPTION: " + div);
			} catch (Exception e) {
				try {
					div = Finder.findWebDriver()
							.findElement(By.xpath("//*[@id=\"__af_Z_window\" and @class=\"AFZOrderLayer\"]"));

				} catch (Exception e2) {
					try {
					div = Finder.findWebDriver()
							.findElement(By.xpath("//div[contains(@class, 'chosen-drop chosen-container-single')]"));
					}catch(Exception e3) {
						div = Finder.findWebDriver()
								.findElement(By.xpath("//div[contains(@class, 's-comboBoxContainer')]"));
					}
				}
			}
		}
		
		try {
			System.out.println("<<### Div is null before trying to find input!");
		    WebElement input = div.findElement(By.xpath(".//input[@role='combobox']"));
		    if (input != null) {
		        System.out.println("<<### Found input inside div.");
		        input.clear();
		        input.sendKeys(dropdownText);
		        Thread.sleep(1000);
		    }
		} catch (NoSuchElementException e) {
		    System.out.println("<<### No input found inside div.");
		} catch (Exception e) {
		    System.out.println("<<### Unexpected error: " + e.getMessage());
		}


//		if (div == null) {
//			System.out.println("### ERROR: div is null before trying to find input!");
//		} else {
//			try {
//				WebElement input = div.findElement(By.xpath(".//input[@role='combobox']"));
//				System.out.println("<<### Inside new added try Block.");
//				if (input != null) {
//					input.clear();
//					input.sendKeys(dropdownText);
//					Thread.sleep(1000);
//				}
//			} catch (Exception ignore) {
//				// ignore if input doesn't exist
//			}
//		}

		WebElement option = div.findElement(By.xpath(".//*[text()='" + dropdownText + "']"));

		try {

			/*
			 * try { new Utils().scrollIntoView(option); } catch (RetryKeywordAgainException
			 * e) { // TODO Auto-generated catch block e.printStackTrace(); }
			 */
			if (Finder.findWebDriver() instanceof InternetExplorerDriver) {
				List<WebElement> ulEl = option.findElements(By.xpath("(.//ancestor::ul)[last()]"));
				if (!ulEl.isEmpty()) {
					if (ulEl.get(0).getAttribute("class").contains("p_AFScroll")) {
						((JavascriptExecutor) Finder.findWebDriver()).executeScript("arguments[0].scrollIntoView(false);", option);
					}
				}
				// ((JavascriptExecutor)
				// Finder.findWebDriver()).executeScript("arguments[0].scrollIntoView(false);",
				// option);
			}

			new WebObjects().ClickElement(option);

		} catch (ElementNotVisibleException e) {
			// Try Clicking Using Javascript
			new WebObjects().Method_clickUsingJavaScript(option);
		}
		return Result.PASS().setOutput(true).make();
	}

	private WebElement getDiv(WebElement dropdownElement) throws ToolNotSetException, InterruptedException {

		new WebObjects().Method_highlightElement(dropdownElement);

		new WebObjects().ClickElement(dropdownElement);
		Thread.sleep(2000);

		new Utils().waitForPageLoadAndOtherAjax();

		WebElement div;
		try {
			div = Finder.findWebDriver().findElement(By.className("AFPopupMenuContent"));
			System.out.println("@DIVOPTION: " + div);
		} catch (Exception e) {
			div = Finder.findWebDriver().findElement(By.xpath("//*[@id=\"__af_Z_window\" and @class=\"AFZOrderLayer\"]"));
		}

		return div;

	}

	public FunctionResult OF_selectDropDownItem(WebDriverObject object, String value) throws Exception {

		WebElement dropdownElement = new GenericCheckpoint<WebElement>() {

			@Override
			public WebElement _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
				// TODO Auto-generated method stub
				return Finder.findWebElement(object);
			}
		}.run();

		if (dropdownElement.getTagName().equalsIgnoreCase("select")) {
			return new com.crestech.opkey.plugin.webdriver.keywords.DropDown().selectDropDownItem_Helper(dropdownElement, value);
		}

		// It is a ComboBox
		return selectComboBoxOptionByText(dropdownElement, value);
	}

}
