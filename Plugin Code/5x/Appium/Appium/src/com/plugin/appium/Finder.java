package com.plugin.appium;

import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Attribute;
import org.jsoup.nodes.Attributes;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.Capabilities;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.Augmenter;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.android.AndroidVersion;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.BrowserType;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.enums.Messages;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.TimeOut_ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.AppiumSpecificKeyword.Connect2AppiumServer;
import com.plugin.appium.keywords.GenericKeyword.Frame;
import com.plugin.appium.keywords.GenericKeyword.Frame.SwitchState;
import com.plugin.appium.keywords.GenericKeyword.WebObjects;
import com.plugin.appium.keywords.GenericKeyword.actionByText.ActionByText;
import com.plugin.appium.selendroid.SelendroidWebDriver;
import com.plugin.appium.selendroid.SelendroidWebElement;
import com.plugin.appium.util.GenericCheckpoint;

import io.appium.java_client.AppiumDriver;

public class Finder {

    public static List<WebElement> textElementsList = new ArrayList<>();
    private static List<Node> allTextNodes;
    public static boolean findUsingFrame = true;
    public static boolean breakFrameHandlingInByText = false;

    // ######################################################################
    public static Boolean enableExtensiveLogging = true;
    static Logger logger = Logger.getLogger(Finder.class.getName());
    private static WebElement findedWebelement;

    // ######################################
    // Variable define for wait for object
    public static long callTimeOut;
    public static Date startTime;
    public static Boolean needMinimizeInWaitForObject = false;
    public static int elementX;
    public static int elementY;
    public static int countF;
    public static int countOfElementF;

    private static Boolean canUseProperty(AppiumObjectProperty prop, Boolean smartIdentificationRequired) {
	// we cannot use a property if its value is null or empty
	if (prop.getValue() == null) {
	    return false;
	} else if (prop.getValue().trim().equalsIgnoreCase("")) {
	    return false;
	}

	if (!smartIdentificationRequired) {
	    return prop.isUsed();
	} else {
	    return (prop.isUsed() == false);
	}

    }

    public static WebElement findWebElementUsingCheckPoint(AppiumObject object) throws Exception {
	WebElement element = new GenericCheckpoint<WebElement>() {

	    @Override
	    public WebElement _innerRun() throws ObjectNotFoundException, ToolNotSetException, InterruptedException,
		    TimeOut_ObjectNotFoundException {
		WebElement result = findAndHighlightWebElement(object);
		System.out.println("Element found in _innerRun() inside findWebElementUsingCheckPoint");
		return result;

	    }
	}.run();
	if (element != null)
	    return element;

	return null;
    }

    public static WebElement findWebElementUsingCheckPoint(AppiumObject object, int timeout) throws Exception {
	return new GenericCheckpoint<WebElement>() {
	    @Override
	    public WebElement _innerRun() throws ObjectNotFoundException, ToolNotSetException, InterruptedException,
		    TimeOut_ObjectNotFoundException {
		return findAndHighlightWebElement(object);
	    }
	}.run(timeout);
    }

    private static WebElement findAndHighlightWebElement(AppiumObject object)
	    throws ObjectNotFoundException, ToolNotSetException, InterruptedException, TimeOut_ObjectNotFoundException {
	WebElement ele = findWebElement(object);
	Boolean isHighlight = Utils.shouldHighlightAllObjects();
	Log.print("shouldHighlight Object: " + isHighlight);
	if (isHighlight) {
	    new WebObjects().Method_highlightElement(ele);
	}
	return ele;
    }

    /**
     * 
     * 
     * 
     * 
     * @param object
     * @param dontPrintMuchLog
     * @return
     * @throws ObjectNotFoundException
     * @throws InterruptedException
     * @throws ToolNotSetException
     * @throws TimeOut_ObjectNotFoundException
     * @throws Exception
     */

    public static WebElement findWebElement(AppiumObject object)
	    throws ObjectNotFoundException, ToolNotSetException, InterruptedException, TimeOut_ObjectNotFoundException {

	WebElement we = null;

	try {
	    we = innerFindWebElement(object);
	} catch (ObjectNotFoundException ex) {
	    Log.print(ex.getMessage());	 
	    boolean flag=false;
	    Object capabilityVersion = Finder.findAppiumDriver().getCapabilities().getCapability("platformVersion");
		String version=capabilityVersion.toString();
		
		       version=version.trim();  // decimal values in string gave exception so remove "."
		       if(version.isEmpty())
		       {
		    	 //please handle if version is blank in case of iOS
		    	   version = "0"; 
		       }
		        if(version.contains(".")) {
		            version=version.substring(0,version.indexOf("."));
		        }		
		        
	         int deviceVersion = Integer.parseInt(version);        
		        
		System.out.println("##<< Android version using capabilities " + deviceVersion);
		flag=true;
		if (deviceVersion == 5 || deviceVersion <= 5) {
		    findAppiumDriver().runAppInBackground(Duration.ofSeconds(2));
		    return innerFindWebElement(object);
		}
	    
	    if(flag==false) { // below code working for local and pcloudy not for browser stack 
	    if (AppiumContext.getDeviceType() == DeviceType.Android) {
		AndroidVersion androidVersion=null;
		try {
		    androidVersion= new AndroidVersion(AppiumContext.getMobileDevice().getVersion()); // this
		} catch (Exception e) {
		    System.out.println("##<< exception in getting version "+e.getMessage());
		    androidVersion=null;
		}																										  // pcloudy
		System.out.println("##<< Android version using getVersion " + androidVersion);
		boolean isRunAppInBackground = Boolean
			.valueOf(Context.session().getSettings().get("RunAppInBackground"));
		logger.info("isRunAppInBackground " + isRunAppInBackground);
		if (androidVersion != null) {
		    if (androidVersion.getMajor() == 4 && androidVersion.getMinor() == 4 && isRunAppInBackground) {
			/**
			 * Device Version 4.4 only On android version 4.4 version bug of UiAutomater,
			 * UiAutometer Not renderer the Hybrid part of hybrid application as result we
			 * minimize and maximize the application then again find still object not found
			 * raise an exception
			 */
			findAppiumDriver().runAppInBackground(Duration.ofSeconds(2));
			return innerFindWebElement(object);
		    }
		}
	   
	    
	    
	    
	  }
	    }

	    throw new ObjectNotFoundException(object);
	} catch (TimeOut_ObjectNotFoundException ex) {

	    throw new ObjectNotFoundException(object);
	}

	return we;
    }

    /**
     * Checkpoint supported
     * 
     * @throws TimeOut_ObjectNotFoundException
     */

    private static WebElement innerFindWebElement(AppiumObject object)
	    throws ToolNotSetException, ObjectNotFoundException, InterruptedException, TimeOut_ObjectNotFoundException {

	Finder.continueSearchingOrStop();
	windowSwitchIfNeeded(object.getWindowHandle());
	frameSwitchingIfNeeded(object, Frame.SwitchState.SWITCH_BY_FINDER);
	List<WebElement> elementsInBucket = new ArrayList<WebElement>();
	if (enableExtensiveLogging)
	    logger.info("Finding an WebElement (" + object.toString() + ")");
	Date startTime = Calendar.getInstance().getTime();

	try {
	    Finder.handle_NameProperty_ForIOSNative(object);
	    elementsInBucket = innerFindWebElements(object, elementsInBucket, false);
	    Log.print("@After first finding elementsInBucket size: " + elementsInBucket.size());

	    if (elementsInBucket.size() != 1 && object.useSmartIdentification()) {
		if (enableExtensiveLogging)
		    logger.info("Unable to identify WebElement uniquely using BasicFind. Trying IntelliChoose...");

		Log.print("@Unable to identify WebElement uniquely using BasicFind. Trying IntelliChoose...");
		elementsInBucket = innerFindWebElements(object, elementsInBucket, true);
		Log.print("@after useSmartIdentification finding elementsInBucket: " + elementsInBucket.size());
	    }

	    /**
	     * # After searching by basic finding(by IsUsed wrt. OpKey Object Repository)
	     * and IntelliChoose, if multiple objects are found, then for one more level
	     * precision get object collection using element TAG, and have intersection.
	     **/

	    if (elementsInBucket.size() > 1 && canUseProperty(object.getTagName(), false)) {
		Log.print("@founded multiple element? don't worry let's intersection. elementsInBucket size: "
			+ elementsInBucket.size());
		elementsInBucket = tryFindElement(By.tagName(object.getTagName().getValue()), elementsInBucket);
		Log.print("@after intersection multiple objects elementsInBucket: " + elementsInBucket.size());
	    }

	    logger.fine("foundWebElementInBucket's Size : " + elementsInBucket.size());

	    if (elementsInBucket.size() == 0) {
		Log.print("@Still not found?? ... :-(  throwing ObjectNotFoundException");
		throw new ObjectNotFoundException(object);
	    } else if (elementsInBucket.size() == 1) {
		// perfect condition
	    } else {

		Finder.continueSearchingOrStop();

		Log.print(
			"@still have multiple objects, let's get element by index, if idex property is available in OR.");
		if (object.index != null && object.index > -1 && object.index < elementsInBucket.size()) {
		    if (enableExtensiveLogging)
			logger.info("Multiple(" + elementsInBucket.size()
				+ ") WebElements found. Accepting according to Object Index." + object.index);

		    Log.print("Multiple(" + elementsInBucket.size()
			    + ") WebElements found. Accepting according to Object Index." + object.index);
		    WebElement elementAccordingToIndex = elementsInBucket.get(object.index);
		    elementsInBucket.clear();
		    elementsInBucket.add(elementAccordingToIndex);
		} else {
		    Log.print("@index is not given? don't worry, " + "Multiple(" + elementsInBucket.size()
			    + ") WebElements found. Will Accepting the first WebElement after visibility check.");

		    if (enableExtensiveLogging)
			logger.info("Multiple(" + elementsInBucket.size()
				+ ") WebElements found. Accepting the first WebElement.");

		    try {
			printElementDetails(elementsInBucket);
		    } catch (java.lang.IllegalArgumentException ex) {
			// when object is not able to print element details
			// cause for selendroid webelement to json convertor
			// then given IllegalArgumentException
			logger.info(
				"Not able to print element details can not convert selendriod element to json Convertor ");
		    } catch (org.openqa.selenium.WebDriverException e) {
			// some time appium not able to print element details
			// using java script
			logger.info("Not able to print element details method not implemented ");
		    }
		}
	    }

	    if (enableExtensiveLogging)
		logger.info("Element Finding Completed in "
			+ (Calendar.getInstance().getTime().getTime() - startTime.getTime()) + " ms.");

	    if (elementsInBucket.size() > 0) {
		findedWebelement = elementsInBucket.get(0);
		return elementsInBucket.get(0);
	    } else {
		throw new ObjectNotFoundException(object);
	    }

	} finally {
	    // TODO:
	}
    }

    /**
     * Currently, Appium doesn't searches object By.Name in iPhones therefore, we
     * will set the name property to NULL and add a xpath:name property instead.
     * 
     * @throws ToolNotSetException
     * 
     */
    public static void handle_NameProperty_ForIOSNative(AppiumObject object)
	    throws InterruptedException, ObjectNotFoundException, TimeOut_ObjectNotFoundException, ToolNotSetException {
	if (!object.getName().isValueNullOrEmpty() && canUseProperty(object.getName(), false)
		&& (!AppiumContext.isBrowserMode()) && AppiumContext.isIOS()) {
	    System.out.println(object.getName().getValue().split("\\{")[0]);
	    if (!AppiumContext.isBrowserMode()) {
		Finder.continueSearchingOrStop();
		String name = object.getName().getValue().split("\\{")[0];
		String type = object.getType().getValue();

		if (type == null)
		    type = "*";

		String xPathName = "//" + type + "[contains(@name,'" + name + "')]";

		// now we will add this xPath and remove the name property
		AppiumObjectProperty xPathNameProperty = new AppiumObjectProperty("xpath:name", xPathName,
			object.getName().isUsed());
		object.getXPaths().add(object.getXPaths().size(), xPathNameProperty);
		Log.print("Added new xPathName:- " + xPathName);
	    }
	}
    }

    public static void highlightWebelement() throws ToolNotSetException, InterruptedException {

	logger.fine(" try to highlighiting a element");
	try {
	    findAppiumDriver().executeScript("arguments[0].style.border = arguments[1];", findedWebelement,
		    "8px solid black");
	} catch (Exception e) {
	    System.out.println("Exception while highlightWebelement : " + e.getMessage());
	    // e.printStackTrace();
	}
	logger.finest("Highlighting complete");
    }

    public static void removeHighlight() throws ToolNotSetException {
	logger.fine(" remove highlighting ");
	try {
	    findJavaScriptExecuterDriver().executeScript("arguments[0].style.border = arguments[1];", findedWebelement,
		    "");
	} catch (Exception e) {
	    System.out.println("Exception while removeHighlight : " + e.getMessage());
	    // e.printStackTrace();
	}
	logger.finest("Remove highlighting sucess");
    }

    /**
     * Checkpoint supported
     * 
     * @throws TimeOut_ObjectNotFoundException
     */

    private static void printElementDetails(List<WebElement> elementsInBucket)
	    throws ToolNotSetException, InterruptedException, ObjectNotFoundException, TimeOut_ObjectNotFoundException {

	Capabilities cap = ((RemoteWebDriver) findAppiumDriver()).getCapabilities();
	String browserName = cap.getBrowserName().toLowerCase();

	// opera Does Not Support JavascriptExecutor To Print Element Details
	if (!browserName.contentEquals("opera")) {

	    System.out.println();
	    for (WebElement element : elementsInBucket) {

		if (element instanceof SelendroidWebElement)
		    element = ((SelendroidWebElement) element).getInnerWebElement();

		Finder.continueSearchingOrStop();

		@SuppressWarnings("unchecked")
		ArrayList<String> allAttributes = (ArrayList<String>) ((JavascriptExecutor) Finder.findAppiumDriver())
			.executeScript(
				"var s = []; var attrs = arguments[0].attributes; for (var l = 0; l < attrs.length; ++l) { var a = attrs[l]; s.push(a.name + '#:#' + a.value); } ; return s;",
				element);
		for (String attb : allAttributes) {
		    try {
			String[] nameValue = attb.split("#:#");
			String name = nameValue[0];
			String value = nameValue[1];
			System.out.print("    " + name + "=" + value);
		    } catch (Exception ex) {
		    }
		}
		System.out.println();
	    }
	    System.out.println();
	} else {
	    System.out.println("opera Browser Cannot Support JavascriptExecutor To print Element Details");
	}

    }

    /**
     * 
     * 
     * Checkpoint Supported
     * 
     * @param object
     * @param elementsInBucket
     * @param respectIsUsedProperty
     * @return
     * @throws ToolNotSetException
     * @throws InterruptedException
     * @throws ObjectNotFoundException
     * @throws TimeOut_ObjectNotFoundException
     */
    private static List<WebElement> innerFindWebElements(AppiumObject object, List<WebElement> elementsInBucket,
	    Boolean smartIdentificationRequired)
	    throws ToolNotSetException, InterruptedException, ObjectNotFoundException, TimeOut_ObjectNotFoundException {

	/** 
	 * ## Special searching mechanism is employed for LINK and SPAN, rest other fall
	 * under same monitoring.
	 */
	Finder.continueSearchingOrStop();

	if (((object.getTagName().getValue().equalsIgnoreCase("a")
		|| object.getTagName().getValue().equalsIgnoreCase("link")
		|| object.getTagName().getValue().equalsIgnoreCase("span"))) && object.getInnerText().getValue() != null
		&& canUseProperty(object.getInnerText(), smartIdentificationRequired)) {

	    String spanXpath = "//" + object.getTagName().getValue() + "[text() = '" + object.getInnerText().getValue()
		    + "']";
	    Log.print("@Special xPath for a, link, span: " + spanXpath);
	    elementsInBucket = tryFindElement(By.xpath(spanXpath), elementsInBucket);
	    Log.print("@elementsInBucket after Special xPath for a, link, span: " + elementsInBucket.size());
	}

	Finder.continueSearchingOrStop();
	if (elementsInBucket.size() != 1 && object.getId().getValue() != null
		&& canUseProperty(object.getId(), smartIdentificationRequired)) {
	    Log.print("Search primarily by ID");
	    elementsInBucket = tryFindElement(By.id(object.getId().getValue()), elementsInBucket);
	}

	Finder.continueSearchingOrStop();
	if (AppiumContext.isBrowserOrWebviewMode()) {
	    if (elementsInBucket.size() != 1 && object.getClassName().getValue() != null
		    && canUseProperty(object.getClassName(), smartIdentificationRequired)) {
		Log.print("Search by ID className");
		elementsInBucket = tryFindElement(By.className(object.getClassName().getValue()), elementsInBucket);
	    }
	}

	Finder.continueSearchingOrStop();
	if (elementsInBucket.size() != 1
		&& (object.getTagName().getValue().contentEquals("a")
			|| object.getTagName().getValue().contentEquals("link"))
		&& canUseProperty(object.getInnerText(), smartIdentificationRequired)) {
	    elementsInBucket = tryFindElement(By.linkText(object.getInnerText().getValue()), elementsInBucket);
	}

	if (elementsInBucket.size() != 1) {
	    Log.print("Search by cssSelector");
	    for (AppiumObjectProperty cssSelector : object.getCssSelectors()) {
		Finder.continueSearchingOrStop();
		if (canUseProperty(cssSelector, smartIdentificationRequired)) {
		    elementsInBucket = tryFindElement(By.cssSelector(cssSelector.getValue()), elementsInBucket);
		    if (elementsInBucket.size() == 1)
			break;
		}
	    }
	}

	if (elementsInBucket.size() != 1) {
	    Log.print("Search by xpath");
	    for (AppiumObjectProperty xPath : object.getXPaths()) {
		Finder.continueSearchingOrStop();
		Log.print("Can Use xPath " + canUseProperty(xPath, smartIdentificationRequired) + ": " + xPath);
		if (canUseProperty(xPath, smartIdentificationRequired)) {
		    elementsInBucket = tryFindElement(By.xpath(xPath.getValue()), elementsInBucket);
		    if (elementsInBucket.size() == 1)
			break;
		}
	    }
	}

	Finder.continueSearchingOrStop();
	if (elementsInBucket.size() != 1 && object.getName().getValue() != null
		&& canUseProperty(object.getName(), smartIdentificationRequired)) {
	    Log.print("Search find by name");
	    if (object.getName().getValue().contains("<|") && object.getName().getValue().contains("|>")) {
		Log.print("Searching By Relational API :: " + object.getName().getValue());
		String nameXpath = new ActionByText().RelationalApi(object.getName().getValue());
		nameXpath = nameXpath.split("@#@")[0];
		elementsInBucket = tryFindElement(By.xpath(nameXpath), elementsInBucket);
	    } else {
		Log.print("Searching By Name :: " + object.getName().getValue().split("\\{")[0]);
		elementsInBucket = tryFindElement(
			By.xpath("//*[contains(@name,'" + object.getName().getValue().split("\\{")[0] + "')]"),
			elementsInBucket);
	    }
	}

	Finder.continueSearchingOrStop();
	if (elementsInBucket.size() != 1 && object.getValue().getValue() != null
		&& canUseProperty(object.getValue(), smartIdentificationRequired)) {
	    Log.print("@not found? then find by value (if exists, tag property is must..!!)");
	    String xpath = "//" + object.getType().getValue() + "[@value='" + object.getValue().getValue() + "']";
	    elementsInBucket = tryFindElement(By.xpath(xpath), elementsInBucket);
	}

	Finder.continueSearchingOrStop();
	if (elementsInBucket.size() != 1 && canUseProperty(object.getValue(), smartIdentificationRequired)) {
	    Log.print("Search by object type.");
	    String xpath = "//" + object.getType().getValue();
	    elementsInBucket = tryFindElement(By.xpath(xpath), elementsInBucket);
	}

	return elementsInBucket;

    }

    /**
     * 
     * 
     * 
     * Checkpoint supported
     * 
     * @param by
     * @param elementsInBucket
     * @return
     * @throws ToolNotSetException
     * @throws InterruptedException
     * @throws ObjectNotFoundException
     * @throws TimeOut_ObjectNotFoundException
     */

    private static List<WebElement> tryFindElement(By by, List<WebElement> elementsInBucket)
	    throws ToolNotSetException, InterruptedException, ObjectNotFoundException, TimeOut_ObjectNotFoundException {

	Log.print("tryFindElement(): " + by.toString());
	List<WebElement> foundedElements = new ArrayList<WebElement>();
	Finder.continueSearchingOrStop();

	if (AppiumContext.isBrowserMode()) {
	    foundedElements = tryFindElementInWeb(by, elementsInBucket);
	} else {
	    foundedElements = tryFindElementInApplication(by, elementsInBucket);
	}

	try {
	    Log.print("--- Before visibility check founded element size: " + foundedElements.size());
	    if (Utils.checkFoundedElementVisibility()) {
		foundedElements = Utils.visible(foundedElements);
	    }
	    Log.print("--- After visibility check final element size: " + foundedElements.size());
	    return foundedElements;
	} catch (Exception e) {
	    Log.print("--- Exception while visibility check in finder.");
	    return foundedElements;
	}
    }

    /**
     * @throws TimeOut_ObjectNotFoundException
     */

    private static List<WebElement> tryFindElementInWeb(By by, List<WebElement> elementsInBucket)
	    throws ToolNotSetException, InterruptedException, ObjectNotFoundException, TimeOut_ObjectNotFoundException {

	/** this method runs in loop, so the 100ms sleep will ensure CPU rest **/
	Thread.sleep(100);

	Finder.continueSearchingOrStop();
	try {
	    List<WebElement> newlyFoundElements = findAppiumDriver().findElements(by);

	    /** Rare Case: Got null instead of empty ArrayList in different browser. **/
	    if (newlyFoundElements == null) {
		newlyFoundElements = new ArrayList<WebElement>();
	    }

	    String log = "Element in Bucket: " + elementsInBucket.size() + "     Searching by: " + by.toString()
		    + "     New Elements Found: " + newlyFoundElements.size();

	    Log.print(log);
	    if (elementsInBucket.size() == 0) {
		elementsInBucket = newlyFoundElements;
	    }

	    Finder.continueSearchingOrStop();
	    // Intersection of two sets
	    if (newlyFoundElements.size() > 0) {
		elementsInBucket.retainAll(newlyFoundElements);
	    } else {
		// no elements found
		Log.print("0 elements found using " + by.toString() + ". Consider updating the Object Property.");
	    }

	    log += "     Retained Bucket Size: " + elementsInBucket.size();

	    Log.print(log);
	    return elementsInBucket;

	} catch (WebDriverException ex) {
	    Log.print("Unable to identify the Element by: " + by.toString() + "\n" + ex.getMessage());
	    return new ArrayList<WebElement>();
	}

    }

    /**
     * Checkpoint supported
     * 
     * @throws TimeOut_ObjectNotFoundException
     */
    private static List<WebElement> tryFindElementInApplication(By by, List<WebElement> elementsInBucket)
	    throws ToolNotSetException, InterruptedException, ObjectNotFoundException, TimeOut_ObjectNotFoundException {

	/** this method runs in loop, so the 100ms sleep will ensure CPU rest **/
	Thread.sleep(100);
	Finder.continueSearchingOrStop();

	try {
	    List<WebElement> newlyFoundElements = findAppiumDriver().findElements(by);
	    if (newlyFoundElements == null) {
		newlyFoundElements = new ArrayList<WebElement>();
	    }

	    String log = "Element in Bucket: " + elementsInBucket.size() + "     Searching by: " + by.toString()
		    + "     New Elements Found: " + newlyFoundElements.size();

	    // no elements found
	    if (enableExtensiveLogging)
		logger.info("0 elements found using " + by.toString() + ". Consider updating the Object Property.");

	    log += "     Newly found Elements Size: " + newlyFoundElements.size();
	    if (enableExtensiveLogging) {
		logger.info(log);
	    }
	    System.out.println(log);
	    return newlyFoundElements;

	} catch (WebDriverException ex) {

	    logger.severe("Unable to identify the Element by: " + by.toString() + "\n" + ex.getMessage());
	    return new ArrayList<WebElement>();
	}

    }

    public static WebElement waitForWebElement(AppiumObject object, int perHitTimeOutInSeconds)
	    throws ToolNotSetException, InterruptedException, ObjectNotFoundException, TimeOut_ObjectNotFoundException {

	frameSwitchingIfNeeded(object, Frame.SwitchState.SWITCH_BY_FINDER);

	List<WebElement> foundElement = waitForWebElement(object, false, perHitTimeOutInSeconds);

	if (!(foundElement.size() == 1) && object.useSmartIdentification()) {
	    foundElement = waitForWebElement(object, true, perHitTimeOutInSeconds);
	}

	logger.fine(" found Element Size " + foundElement.size());
	if (foundElement.size() == 0) {

	    logger.fine("To finding object need to application run in background" + needMinimizeInWaitForObject);
	    if (AppiumContext.getDeviceType() == DeviceType.Android) {
		AndroidVersion androidVersion = new AndroidVersion(AppiumContext.getMobileDevice().getVersion());
		if (androidVersion.getMajor() == 4 && androidVersion.getMinor() == 4 && needMinimizeInWaitForObject) {
		    /**
		     * Device Version 4.4 only On android version 4.4 version bug of UiAutomater,
		     * UiAutometer Not renderer the Hybrid part of hybrid application as result we
		     * minimize and maximize the application then again find still object not found
		     * raise an exception
		     */

		    findAppiumDriver().runAppInBackground(Duration.ofSeconds(2));
		    needMinimizeInWaitForObject = false;
		}
	    }
	    throw new ObjectNotFoundException(object);
	}

	return foundElement.get(0);
    }

    private static List<WebElement> waitForWebElement(AppiumObject object, Boolean smartIdentificationRequired,
	    int perHitTimeOutInSeconds)
	    throws ToolNotSetException, InterruptedException, ObjectNotFoundException, TimeOut_ObjectNotFoundException {

	windowSwitchIfNeeded(object.getWindowHandle());
	List<WebElement> elementsFound = new ArrayList<WebElement>();

	// Search primarily by ID
	if (elementsFound.size() != 1 && canUseProperty(object.getId(), smartIdentificationRequired)
		&& timeIsRemeaning())
	    elementsFound = waitUntil(By.id(object.getId().getValue()), perHitTimeOutInSeconds);

	// not found? then find by name and finding time is remaining
	if (elementsFound.size() != 1 && canUseProperty(object.getName(), smartIdentificationRequired)
		&& timeIsRemeaning()) {
	    String name = object.getName().getValue();
	    if (name.contains("<|") && name.contains("|>")) {
		System.out.println("Searching By Relational API :: " + object.getName().getValue());
		String nameXpath = new ActionByText().RelationalApi(object.getName().getValue());
		nameXpath = nameXpath.split("@#@")[0];
		elementsFound = waitUntil(By.xpath(nameXpath), perHitTimeOutInSeconds);
	    } else {
		elementsFound = waitUntil(By.name(name), perHitTimeOutInSeconds);
	    }
	}

	if (elementsFound.size() != 1 && canUseProperty(object.getName(), smartIdentificationRequired)
		&& timeIsRemeaning()) {
	    String name = object.getName().getValue();
	    if (!(name.contains("<|") && name.contains("|>"))) {
		elementsFound = waitUntil(By.xpath("//*[contains(@name,'" + name.split("\\{")[0] + "')]"),
			perHitTimeOutInSeconds);
	    }
	}

	// not found? then find by class-name and finding time is remaining
	if (AppiumContext.isBrowserOrWebviewMode()) {
	    if (elementsFound.size() != 1 && canUseProperty(object.getClassName(), smartIdentificationRequired)
		    && timeIsRemeaning())
		elementsFound = waitUntil(By.className(object.getClassName().getValue()), perHitTimeOutInSeconds);
	}
	// not found? then find by xpath and finding time is remaining
	if (elementsFound.size() != 1) {
	    List<AppiumObjectProperty> list = object.getXPaths();
	    Collections.reverse(list);
	    for (AppiumObjectProperty xPath : list) {
		if (canUseProperty(xPath, smartIdentificationRequired) && timeIsRemeaning()) {
		    String name = xPath.getValue();
		    if (name.contains("<|") && name.contains("|>")) {
			System.out.println("Searching By Relational API :: " + name);
			String nameXpath = new ActionByText().RelationalApi(name);
			nameXpath = nameXpath.split("@#@")[0];
			elementsFound = waitUntil(By.xpath(nameXpath), perHitTimeOutInSeconds);
		    } else {
			elementsFound = waitUntil(By.xpath(name), perHitTimeOutInSeconds);
		    }
		    if (elementsFound.size() == 1)
			break;
		}
	    }
	}

	// not found? then find by cssSelector and finding time is remaining
	if (elementsFound.size() != 1)
	    for (AppiumObjectProperty cssSelector : object.getCssSelectors()) {
		if (canUseProperty(cssSelector, smartIdentificationRequired) && timeIsRemeaning()) {
		    elementsFound = waitUntil(By.cssSelector(cssSelector.getValue()), perHitTimeOutInSeconds);
		    if (elementsFound.size() == 1)
			break;
		}
	    }

	// In the case of link and a tag find by inner text
	// using link text appium is working slow when we uses wait releated
	// releated
	if (elementsFound.size() != 1
		&& (object.getTagName().getValue().contentEquals("a")
			|| object.getTagName().getValue().contentEquals("link"))
		&& canUseProperty(object.getTagName(), smartIdentificationRequired) && timeIsRemeaning()) {
	    elementsFound = waitUntil(By.linkText(object.getInnerText().getValue()), perHitTimeOutInSeconds);
	}

	if (elementsFound.size() != 1 && object.getValue().getValue() != null
		&& canUseProperty(object.getValue(), smartIdentificationRequired)) {
	    String xpath = "//" + object.getType().getValue() + "[@value='" + object.getValue().getValue() + "']";
	    elementsFound = waitUntil(By.xpath(xpath), perHitTimeOutInSeconds);
	}

	if (elementsFound.size() != 1 && timeIsRemeaning() && object.getName().getValue() != null) {
	    elementsFound = waitUntil(
		    By.xpath("//*[contains(@name,'" + object.getName().getValue().split("\\{")[0] + "')]"),
		    perHitTimeOutInSeconds);

	}
	if (elementsFound.size() != 1 && object.getType().getValue() != null) {
	    String xpath = "//" + object.getType().getValue();
	    elementsFound = waitUntil(By.xpath(xpath), perHitTimeOutInSeconds);
	}

	return elementsFound;

	/*
	 * if (elementsFound.size() > 0) { return elementsFound.get(0); } else { return
	 * false; }
	 */
    }

    @Deprecated
    private static List<WebElement> waitUntil__(By by, int timeOutInSeconds) throws ToolNotSetException {
	// Bug 12521 - Appium is getting stopped when user Stop execution
	try {
	    if (enableExtensiveLogging) {
		logger.info("Waiting for element By " + by.toString() + " for " + timeOutInSeconds + " second(s).");
	    }

	    long findingStartedOn = Calendar.getInstance().getTimeInMillis();
	    List<WebElement> p = Finder.findAppiumDriver().findElements(by);
	    long findingEndedOn = Calendar.getInstance().getTimeInMillis();
	    long remainingTime = (timeOutInSeconds * 1000) - (findingEndedOn - findingStartedOn);
	    if (remainingTime > 0)
		Thread.sleep(remainingTime);

	    if (p == null)
		p = new ArrayList<WebElement>();

	    if (enableExtensiveLogging && p.size() == 0) {
		logger.severe(
			"No elements were found by using " + by.toString() + " in " + timeOutInSeconds + " second(s).");
	    }
	    return p;

	} catch (TimeoutException ex) {
	    if (enableExtensiveLogging) {
		logger.severe(
			"No elements were found by using " + by.toString() + " in " + timeOutInSeconds + " second(s).");
	    }
	    return new ArrayList<WebElement>();
	} catch (Throwable ex) {
	    ex.printStackTrace();
	    return new ArrayList<WebElement>();

	}

    }

    /**
     * 
     * 
     * 
     * 
     * @return
     * @throws ToolNotSetException
     */
    @Deprecated
    public static List<WebElement> waitUntil(By by, int timeOutInSeconds) throws ToolNotSetException {
	long startTime = Calendar.getInstance().getTimeInMillis();

	try {
	    if (enableExtensiveLogging) {
		logger.info("Waiting for element By " + by.toString() + " for " + timeOutInSeconds + " second(s).");
	    }

	    WebDriverWait wait = new WebDriverWait(findAppiumDriver(), timeOutInSeconds);
	    List<WebElement> p = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(by));
	    if (p == null)
		p = new ArrayList<WebElement>();
	    if (enableExtensiveLogging && p.size() == 0) {
		logger.severe(
			"No elements were found by using " + by.toString() + " in " + timeOutInSeconds + " second(s).");
	    }
	    return p;

	} catch (TimeoutException ex) {
	    if (enableExtensiveLogging) {
		logger.severe(
			"No elements were found by using " + by.toString() + " in " + timeOutInSeconds + " second(s).");
	    }
	    return new ArrayList<WebElement>();
	}

	catch (ToolNotSetException e) {
	    throw e;
	}

	catch (Throwable ex) {
	    ex.printStackTrace();
	    return new ArrayList<WebElement>();

	} finally {
	    long timeTaken = (Calendar.getInstance().getTimeInMillis()) - startTime;
	    System.out.println("### ==== Waiting TimedOut when asked for " + timeOutInSeconds + " seconds in "
		    + timeTaken / 1000 + ".");
	}

    }

    // ######################################################################
    public static AppiumDriver<WebElement> findAppiumDriver() throws ToolNotSetException {
	if (Context.session().getTool() != null) {
	    return (AppiumDriver) Context.session().getTool();

	} else {
	    throw new ToolNotSetException();
	}
    }

    // return the casted argument driver
    public static WebDriver findAugmentedDriver() throws ToolNotSetException {

	if (findAppiumDriver() instanceof SelendroidWebDriver) {
	    logger.info(" Augmented driver used from Selendroid mode");
	    return ((SelendroidWebDriver) findAppiumDriver()).augmentedDriver();
	} else {
	    logger.info(" Augmented driver used from Android mode");
	    WebDriver augmentedDriver = new Augmenter().augment(findAppiumDriver());
	    return augmentedDriver;
	}
    }

    // return the casted javascript driver
    public static JavascriptExecutor findJavaScriptExecuterDriver() throws ToolNotSetException {

	if (findAppiumDriver() instanceof SelendroidWebDriver) {
	    logger.info(" javaScript  driver used from Selendroid mode");
	    return ((SelendroidWebDriver) findAppiumDriver()).getJavaScriptExecuterDriver();
	} else {
	    logger.info(" javaScript  driver used from Android mode");
	    JavascriptExecutor javaScriptDriver = ((JavascriptExecutor) findAppiumDriver());
	    return javaScriptDriver;
	}
    }

    /**
     * Checkpoint supported
     * 
     * @throws TimeOut_ObjectNotFoundException
     */

    // if need to switch another window(native or webview)
    public static void windowSwitchIfNeeded(String windowHandle)
	    throws ToolNotSetException, InterruptedException, ObjectNotFoundException, TimeOut_ObjectNotFoundException {
	Finder.continueSearchingOrStop();

	logger.info(" try to switch a window get current window handle " + windowHandle);
	if (windowHandle.contentEquals("")) {
	    logger.info("Receiving window handle blank then try to find object without switching window");
	    return;
	}
	// Switching concept working when driver is in selendroid mode

	if (!(AppiumContext.getBrowserMode() == BrowserType.chromeOnLocalAndroid
		|| AppiumContext.getBrowserMode() == BrowserType.SafariOnIos)) {
	    if (AppiumContext.getDeviceType() == DeviceType.Selendroid) {

		if (!AppiumContext.getLastKnownWindowHandle().equalsIgnoreCase(windowHandle)) {

		    // Current Window Handle is not that of the AppiumObjects,
		    // so
		    // switch
		    // to it first
		    logger.info("#### Need to switching to other window ####");
		    // 5 sec wait for page load if the page not fully loaded
		    // then appium wait for 60 sec
		    logger.info(" wait for 5 sec when we switch window ");
		    Thread.sleep(5000);
		    logger.info("Waiting complete now try to switch a window");
		    findAppiumDriver().switchTo().window(windowHandle);
		    AppiumContext.setDriverWindow(windowHandle);

		}

		else {

		    logger.info("##### No need to be Switching  ######");
		}
		logger.info("driver window handle: " + findAppiumDriver().getWindowHandle());
	    } else {
		logger.info("##### No need to be window switching driver is not under the selendroid mode   ###### ");
	    }
	} else {
	    logger.info("No need to be switch Appium not work on application ");
	}
    }

    private static Boolean timeIsRemeaning() {

	long diffInMiliSeconds = (Calendar.getInstance().getTime().getTime() - startTime.getTime());

	if (diffInMiliSeconds < callTimeOut) {
	    logger.fine("Time is Remeaning for Identifi object to Next Property" + (callTimeOut - diffInMiliSeconds));
	    return true;
	}
	logger.fine("Time Up not Able to Check the Object with next Property" + (callTimeOut - diffInMiliSeconds));
	return false;
    }

    /**
     * Checkpoint supported
     * 
     * @param switchByFinder
     * @throws ObjectNotFoundException
     * @throws ToolNotSetException
     */
    private static void frameSwitchingIfNeeded(AppiumObject object, SwitchState switchByFinder)
	    throws ObjectNotFoundException, ToolNotSetException {
	try {
	    if (Frame.selectFrameActivated == false) {
		Frame.switchDriverIfNeeded(object, Frame.SwitchState.SWITCH_BY_FINDER);
	    } else {
		logger.severe("Select Frame Keyword already in Action. Not automatically switching frames.");
	    }
	} catch (ToolNotSetException e) {
	    throw e;
	} catch (Exception ex) {
	    logger.severe("Unable to switch Driver: " + ex.getMessage());
	    logger.log(Level.SEVERE, ex.getMessage(), ex);
	    if (ex.getMessage() != null && ex.getMessage().equals(Messages.TIMEOUT_INSIDE_FINDER)) {
		throw (ObjectNotFoundException) ex;
	    }
	}

    }

    // ######################################################################
    public static List<WebElement> findElementByText(String text, boolean isContains, int index) throws Exception {
	String tag = "*";
	return findElementByText(text, isContains, index, tag);
    }

    public static List<WebElement> findElementByText(String text, boolean isContains, int index, String tag)
	    throws Exception {
	continueSearchingOrStop();
	text = text.trim();
	long start = System.currentTimeMillis();
	if (tag == null || tag.isEmpty()) {
	    tag = "*";
	}

	Log.print("waitForAngularPageLoad()  = " + (System.currentTimeMillis() - start));
	List<WebElement> eles = new ArrayList<WebElement>();
	List<WebElement> eles1 = new ArrayList<>();
	String x = null;
	String tempText;
	tempText = text;
	continueSearchingOrStop();
	try {
	    eles = Finder.findAppiumDriver()
		    .findElements(By.xpath(x = xpathForTextKeywords(tempText, isContains, tag)));
	} catch (Exception ex) {

	}
	Log.print(x);
	Log.print("a " + eles.size());
	String temptext1 = text.toLowerCase();
	if (eles.size() == 0 || Utils.visible(eles).size() == 0) {
	    // Search In FirstLetter Caps
	    tempText = wordCapitalize(temptext1);
	    continueSearchingOrStop();
	    try {
		eles = Finder.findAppiumDriver()
			.findElements(By.xpath(x = xpathForTextKeywords(tempText, isContains, tag)));
	    } catch (Exception ex) {
		System.out.println("warning: " + ex.getMessage());
	    }
	    Log.print(x);
	    Log.print("b " + eles.size());
	    if (eles.size() == 0 || Utils.visible(eles).size() == 0) {
		tempText = temptext1;
		continueSearchingOrStop();
		try {
		    eles = Finder.findAppiumDriver()
			    .findElements(By.xpath(x = xpathForTextKeywords(tempText, isContains, tag)));
		} catch (Exception ex) {

		}
		Log.print(x);
		Log.print("c " + eles.size());
		if (eles.size() == 0 || Utils.visible(eles).size() == 0) {
		    // Search In UpperCase
		    tempText = temptext1.toUpperCase();
		    continueSearchingOrStop();
		    try {
			eles = Finder.findAppiumDriver()
				.findElements(By.xpath(x = xpathForTextKeywords(tempText, isContains, tag)));
		    } catch (Exception ex) {

		    }
		    Log.print(x);
		    Log.print("d " + eles.size());
		    if (eles.size() == 0 || Utils.visible(eles).size() == 0) {
			// Search In First Letter in UpperCase
			tempText = temptext1.substring(0, 1).toUpperCase() + temptext1.substring(1);
			continueSearchingOrStop();
			try {
			    eles = Finder.findAppiumDriver()
				    .findElements(By.xpath(x = xpathForTextKeywords(tempText, isContains, tag)));
			} catch (Exception ex) {

			}
			Log.print(x);
			Log.print("e " + eles.size());
			try {
			    if (eles.size() == 0 || Utils.visible(eles).size() == 0) {
				allTextNodes = new ArrayList<>();
				/**
				 * Find text which contains spaces and new Line or text which cannot be found by
				 * xpath
				 **/
				eles = findTextByJsoup(text);

				Log.print("g " + eles.size());
			    }
			} catch (Exception e) {
			    // TODO: handle exception
			}
		    }
		}
	    }
	}

	if (!AppiumContext.isBrowserMode()) {
	    return eles;
	}
	eles1 = Utils.visible(eles);
	eles1 = findTextIfInsideSelectOption(eles1, text);
	eles1 = new Utils().listRemoveDuplicate(eles1);

	for (WebElement e : eles1) {
	    System.out.println(e);
	    textElementsList.add(e);
	}

	try {
	    if (AppiumContext.isBrowserOrWebviewMode()) {
		for (WebElement e : textElementsList) {
		    Log.print("@# " + e.getAttribute("outerHTML"));
		}
	    }
	} catch (Exception e) {
	}

	if (textElementsList.size() - 1 < index && (findUsingFrame)) {
	    Log.print("inside IF");
	    findUsingFrame = false;

	    eles = frameHandlingInTextKeywords(text, isContains, index, tag);

	    findUsingFrame = true;
	}

	return textElementsList;
    }

    @Deprecated
    public static String findElementByText_(String textToSearch, int count, int type, boolean contains)
	    throws ToolNotSetException, InterruptedException, IOException {
	String html = Finder.findAppiumDriver().getPageSource();
	Document source = Jsoup.parse(html);
	// System.out.println(source);
	Elements allElesInPage = source.getAllElements();
	String xpath = "";
	String value = "";
	String tagName = null;
	boolean flag = false;
	int countOfElement = 0;
	textToSearch = textToSearch.replaceAll("&amp;", "&");
	String tempText = textToSearch.toLowerCase();
	// System.out.println(text + " :: " + tempText);
	for (Element element : allElesInPage) {
	    elementX = 2;
	    elementY = 2;

	    if (element.tagName().contains("button") && (type == 0)) {
		if (element.toString().toLowerCase().replaceAll("&amp;", "&").contains(tempText)) {
		    try {
			int x = Integer.parseInt(element.attr("x"));
			int y = Integer.parseInt(element.attr("y"));
			if (!(x > 0 && y > 0)) {
			    countOfElement++;
			    continue;
			}
		    } catch (Exception ex) {
			countOfElement++;
			continue;
		    }
		    Attributes attribute = element.attributes();
		    for (Attribute attribute2 : attribute) {
			if (contains) {
			    if (attribute2.toString().toLowerCase().replaceAll("&amp;", "&").contains(tempText)) {
				value = attribute2.toString().split("=")[0];
				textToSearch = attribute2.toString().split("=")[1].replaceAll("\"", "");
				tagName = element.tagName();
				try {
				    elementX = elementX + Integer.parseInt(element.attr("x"));
				    elementY = elementY + Integer.parseInt(element.attr("y"));
				} catch (Exception ex) {
				}
				if (tagName.equalsIgnoreCase("XCUIElementTypeButton"))
				    tagName = "XCUIElementTypeButton";
				flag = true;
				break;
			    }
			} else {
			    if (attribute2.getValue().toString().replaceAll("&amp;", "&").equals(textToSearch)) {
				value = attribute2.toString().split("=")[0];
				textToSearch = attribute2.toString().split("=")[1].replaceAll("\"", "");
				tagName = element.tagName();
				try {
				    elementX = elementX + Integer.parseInt(element.attr("x"));
				    elementY = elementY + Integer.parseInt(element.attr("y"));
				} catch (Exception ex) {
				}
				if (tagName.equalsIgnoreCase("XCUIElementTypeButton"))
				    tagName = "XCUIElementTypeButton";
				flag = true;
				break;
			    }
			}
		    }
		    if (flag)
			break;
		}
	    } else if (element.tagName().contains("textfield") && (type == 1)) {
		if (element.toString().toLowerCase().replaceAll("&amp;", "&").contains(tempText)) {
		    try {
			int x = Integer.parseInt(element.attr("x"));
			int y = Integer.parseInt(element.attr("y"));
			if (!(x > 0 && y > 0)) {
			    countOfElement++;
			    continue;
			}
		    } catch (Exception ex) {
			countOfElement++;
			continue;
		    }
		    Attributes attribute = element.attributes();
		    for (Attribute attribute2 : attribute) {
			if (contains) {
			    if (attribute2.toString().toLowerCase().replaceAll("&amp;", "&").contains(tempText)) {
				value = attribute2.toString().split("=")[0];
				textToSearch = attribute2.toString().split("=")[1].replaceAll("\"", "");
				tagName = element.tagName();
				try {
				    elementX = elementX + Integer.parseInt(element.attr("x"));
				    elementY = elementY + Integer.parseInt(element.attr("y"));
				} catch (Exception ex) {
				}
				if (tagName.equalsIgnoreCase("XCUIElementTypeSecureTextField"))
				    tagName = "XCUIElementTypeSecureTextField";
				else if (tagName.equalsIgnoreCase("XCUIElementTypeTextField"))
				    tagName = "XCUIElementTypeTextField";
				flag = true;
				break;
			    }
			} else {
			    if (attribute2.getValue().toString().replaceAll("&amp;", "&").equals(textToSearch)) {
				value = attribute2.toString().split("=")[0];
				textToSearch = attribute2.toString().split("=")[1].replaceAll("\"", "");
				tagName = element.tagName();
				try {
				    elementX = elementX + Integer.parseInt(element.attr("x"));
				    elementY = elementY + Integer.parseInt(element.attr("y"));
				} catch (Exception ex) {
				}
				if (tagName.equalsIgnoreCase("XCUIElementTypeSecureTextField"))
				    tagName = "XCUIElementTypeSecureTextField";
				else if (tagName.equalsIgnoreCase("XCUIElementTypeTextField"))
				    tagName = "XCUIElementTypeTextField";
				flag = true;
				break;
			    }
			}
		    }
		    if (flag)
			break;
		}
	    } else if (element.tagName().contains("text") && (type == 0)) {
		if (element.toString().toLowerCase().replaceAll("&amp;", "&").contains(tempText)) {
		    try {
			int x = Integer.parseInt(element.attr("x"));
			int y = Integer.parseInt(element.attr("y"));
			if (!(x > 0 && y > 0)) {
			    countOfElement++;
			    continue;
			}
		    } catch (Exception ex) {
			countOfElement++;
			continue;
		    }
		    Attributes attribute = element.attributes();
		    for (Attribute attribute2 : attribute) {
			if (contains) {
			    // System.out.println(attribute2.toString().toLowerCase());
			    // System.out.println(attribute2.toString().toLowerCase().replaceAll("&amp;",
			    // "&")+ ":::::::::::::" + tempText);
			    if (attribute2.toString().toLowerCase().replaceAll("&amp;", "&").contains(tempText)) {
				value = attribute2.toString().split("=")[0];
				textToSearch = attribute2.toString().split("=")[1].replaceAll("\"", "");
				tagName = element.tagName();
				try {
				    elementX = elementX + Integer.parseInt(element.attr("x"));
				    elementY = elementY + Integer.parseInt(element.attr("y"));
				} catch (Exception ex) {
				}
				if (tagName.equalsIgnoreCase("XCUIElementTypeStaticText"))
				    tagName = "XCUIElementTypeStaticText";
				else if (tagName.equalsIgnoreCase("XCUIElementTypeTextField"))
				    tagName = "XCUIElementTypeTextField";
				flag = true;
				break;
			    }
			} else {
			    if (attribute2.getValue().toString().replaceAll("&amp;", "&").equals(textToSearch)) {
				value = attribute2.toString().split("=")[0];
				textToSearch = attribute2.toString().split("=")[1].replaceAll("\"", "");
				tagName = element.tagName();
				try {
				    elementX = elementX + Integer.parseInt(element.attr("x"));
				    elementY = elementY + Integer.parseInt(element.attr("y"));
				} catch (Exception ex) {
				}
				if (tagName.equalsIgnoreCase("XCUIElementTypeStaticText"))
				    tagName = "XCUIElementTypeStaticText";
				else if (tagName.equalsIgnoreCase("XCUIElementTypeTextField"))
				    tagName = "XCUIElementTypeTextField";
				flag = true;
				break;
			    }
			}
		    }
		    if (flag)
			break;
		}
	    }
	}
	textToSearch = textToSearch.replaceAll("&amp;", "&");
	if (!(tagName == null)) {
	    xpath = "//" + tagName + "[@" + value + "='" + textToSearch + "']";
	}
	System.out.println(xpath);
	if (xpath.isEmpty() || xpath == "") {
	    if (contains) {
		xpath = "//*[contains(@name,'" + textToSearch + "')]";
	    } else
		xpath = "//*[@name='" + textToSearch + "']";
	}
	countF = count;
	countOfElementF = countOfElement;
	return xpath;
	/*
	 * List<WebElement> elementsInBucket = new ArrayList<WebElement>();
	 * elementsInBucket = tryFindElement(By.xpath(xpath), elementsInBucket);
	 * WebElement element = elementsInBucket.get(count); if (count == 0) { try {
	 * System.out.println("Trying Getting Element Of countOfElement " +
	 * countOfElement); element = elementsInBucket.get(countOfElement); } catch
	 * (Exception ex) { System.out.println("Trying Getting Element Of Count " +
	 * count); element = elementsInBucket.get(count); } } try {
	 * System.out.println("TAP " + Finder.elementX + ":" + Finder.elementY); } catch
	 * (Exception ex) { System.out.println("ELEMENT CLICK"); } return element;
	 */
    }

    public static WebElement findElementByTextXpath(String xpath)
	    throws ToolNotSetException, InterruptedException, ObjectNotFoundException, TimeOut_ObjectNotFoundException {
	List<WebElement> elementsInBucket = new ArrayList<WebElement>();
	elementsInBucket = tryFindElement(By.xpath(xpath), elementsInBucket);
	WebElement element = elementsInBucket.get(countF);
	if (countF == 0) {
	    try {
		System.out.println("Trying Getting Element Of countOfElement " + countOfElementF);
		element = elementsInBucket.get(countOfElementF);
	    } catch (Exception ex) {
		System.out.println("Trying Getting Element Of Count " + countF);
		element = elementsInBucket.get(countF);
	    }
	}
	countF = 0;
	countOfElementF = 0;
	return element;
    }

    public static void continueSearchingOrStop()
	    throws InterruptedException, ObjectNotFoundException, TimeOut_ObjectNotFoundException, ToolNotSetException {
	if (Context.current().getKeywordRemaningSeconds() - 6 < 0) {
	    Log.print("continueSearchingOrStop() says-> Stoping search due to time completed for searching");
	    ObjectNotFoundException exp = new ObjectNotFoundException(
		    Messages.FUNCTIONRESSULT_OBJECT_NOT_FOUND.toString());
	    throw exp;
	}
    }

    @Deprecated
    public static WebElement findElementByTextUsingCheckPoint(String text, int count, int i, boolean contains)
	    throws Exception {
	return new GenericCheckpoint<WebElement>() {

	    @Override
	    public WebElement _innerRun() throws Exception {
		String xpath = Finder.findElementByText_(text, count, 0, contains);
		if (Finder.elementX > 2 && Finder.elementX < Connect2AppiumServer.dim.getWidth() - 2
			&& Finder.elementY > 62
			&& ((Finder.elementY < Connect2AppiumServer.dim.getHeight() - 48) || text.equals("Home")
				|| text.equals("Sports") || text.equals("Channels") || text.equals("On Demand")
				|| text.equals("Settings"))) {
		    System.out.println("TAP " + Finder.elementX + ":" + Finder.elementY);

		    Utils.touchActionTap(Finder.elementX, Finder.elementY);
		    return null;
		} else {
		    return Finder.findElementByTextXpath(xpath);

		}
	    }
	}.run();

    }

    public List<WebElement> findElementByTextInCurrentDom(String text, boolean isContains, int index) throws Exception {
	String tag = "*";
	return findElementByTextInCurrentDom(text, isContains, index, tag);
    }

    public List<WebElement> findElementByTextInCurrentDom(String text, boolean isContains, int index, String tag)
	    throws Exception {

	long start = System.currentTimeMillis();
	new Utils().waitForPageLoadAndOtherAjax();
	Log.print("waitForAngularPageLoad()  = " + (System.currentTimeMillis() - start));
	List<WebElement> eles = new ArrayList<WebElement>();
	List<WebElement> eles1 = new ArrayList<>();
	String x = null;
	String tempText;
	tempText = text;
	try {
	    eles = Finder.findAppiumDriver()
		    .findElements(By.xpath(x = xpathForTextKeywords(tempText, isContains, tag)));
	} catch (Exception ex) {

	}
	Log.print(x);
	Log.print("a " + eles.size());
	String temptext1 = text.toLowerCase();
	if (eles.size() == 0 || Utils.visible(eles).size() == 0) {
	    // Search In FirstLetter Caps
	    tempText = wordCapitalize(temptext1);
	    try {
		eles = Finder.findAppiumDriver()
			.findElements(By.xpath(x = xpathForTextKeywords(tempText, isContains, tag)));
	    } catch (Exception ex) {
		// Log.print(x);

	    }
	    Log.print(x);
	    Log.print("b " + eles.size());
	    // printList(eles);
	    // matchText = wordCapitalize(temptext);
	    if (eles.size() == 0 || Utils.visible(eles).size() == 0) {
		tempText = temptext1;
		// Log.print("3 check is running");
		// Search In LowerCase
		try {
		    eles = Finder.findAppiumDriver()
			    .findElements(By.xpath(x = xpathForTextKeywords(tempText, isContains, tag)));
		} catch (Exception ex) {

		}
		Log.print(x);
		Log.print("c " + eles.size());
		// printList(eles);
		// matchText = temptext;
		if (eles.size() == 0 || Utils.visible(eles).size() == 0) {
		    // Search In UpperCase
		    tempText = temptext1.toUpperCase();
		    try {
			eles = Finder.findAppiumDriver()
				.findElements(By.xpath(x = xpathForTextKeywords(tempText, isContains, tag)));
		    } catch (Exception ex) {

		    }
		    Log.print(x);
		    Log.print("d " + eles.size());
		    // printList(eles);
		    if (eles.size() == 0 || Utils.visible(eles).size() == 0) {
			// Search In First Letter in UpperCase
			tempText = temptext1.substring(0, 1).toUpperCase() + temptext1.substring(1);
			try {
			    eles = Finder.findAppiumDriver()
				    .findElements(By.xpath(x = xpathForTextKeywords(tempText, isContains, tag)));
			} catch (Exception ex) {

			}
			Log.print(x);
			Log.print("e " + eles.size());
			// printList(eles);

		    }
		}
	    }
	}

	eles1 = Utils.visible(eles);
	try {
	    if (AppiumContext.isBrowserOrWebviewMode()) {
		for (WebElement e : textElementsList) {
		    // Log.print(e.getAttribute("outerHTML"));
		}
	    }
	} catch (Exception e) {
	}
	return eles1;
    }

    public List<WebElement> findElementByTextDirection(String text, boolean isContains, int index, WebElement baseEle,
	    boolean before) throws Exception {
	Finder.continueSearchingOrStop();

	long start = System.currentTimeMillis();
	// Log.print("LoopCount: "+WebDriverDispatcher.getLoopCount);
	// if (WebDriverDispatcher.checkAngular &&
	// WebDriverDispatcher.getLoopCount > 1) {
	new Utils().waitForPageLoadAndOtherAjax();
	// }
	Log.print("waitForAngularPageLoad()  = " + (System.currentTimeMillis() - start));
	List<WebElement> eles = new ArrayList<WebElement>();
	Log.print("Base Ele : 1");
	List<WebElement> eles1 = new ArrayList<>();
	Log.print("Base Ele : ");
	String x = null;
	Log.print("Base Ele : 2");
	String tempText;
	Log.print("Base Ele : 3");
	tempText = text;
	Log.print("Base Ele : 4");
	try {
	    Finder.continueSearchingOrStop();
	    eles = baseEle.findElements(By.xpath(x = xpathForTextKeywordsDirection(tempText, isContains, before)));
	    // matchText = wordCapitalize(text);

	} catch (Exception ex) {

	}
	Log.print(x);
	Log.print("a " + eles.size());
	// printList(eles);
	String temptext1 = text.toLowerCase();
	if (eles.size() == 0 || Utils.visible(eles).size() == 0) {
	    Finder.continueSearchingOrStop();
	    // Search In FirstLetter Caps
	    tempText = wordCapitalize(temptext1);
	    try {
		eles = baseEle.findElements(By.xpath(x = xpathForTextKeywordsDirection(tempText, isContains, before)));
	    } catch (Exception ex) {
		// Log.print(x);

	    }
	    Log.print(x);
	    Log.print("b " + eles.size());
	    // printList(eles);
	    // matchText = wordCapitalize(temptext);
	    if (eles.size() == 0 || Utils.visible(eles).size() == 0) {
		Finder.continueSearchingOrStop();
		tempText = temptext1;
		// Log.print("3 check is running");
		// Search In LowerCase
		try {
		    eles = baseEle
			    .findElements(By.xpath(x = xpathForTextKeywordsDirection(tempText, isContains, before)));
		} catch (Exception ex) {

		}
		Log.print(x);
		Log.print("c " + eles.size());
		// printList(eles);
		// matchText = temptext;
		if (eles.size() == 0 || Utils.visible(eles).size() == 0) {
		    Finder.continueSearchingOrStop();

		    // Search In UpperCase
		    tempText = temptext1.toUpperCase();
		    try {
			eles = baseEle.findElements(
				By.xpath(x = xpathForTextKeywordsDirection(tempText, isContains, before)));
		    } catch (Exception ex) {

		    }
		    Log.print(x);
		    Log.print("d " + eles.size());
		    // printList(eles);
		    if (eles.size() == 0 || Utils.visible(eles).size() == 0) {
			Finder.continueSearchingOrStop();
			// Search In First Letter in UpperCase
			tempText = temptext1.substring(0, 1).toUpperCase() + temptext1.substring(1);
			try {
			    eles = baseEle.findElements(
				    By.xpath(x = xpathForTextKeywordsDirection(tempText, isContains, before)));
			} catch (Exception ex) {

			}
			Log.print(x);
			Log.print("e " + eles.size());
			// printList(eles);

		    }
		}
	    }
	}
	// }
	// Log.print("CHECK");

	Finder.continueSearchingOrStop();
	eles1 = Utils.visible(eles);
	// eles1 = new Utils().listRemoveDuplicate(eles1);
	// Log.print("#$# Size: " + eles1.size());
	try

	{
	    if (AppiumContext.isBrowserOrWebviewMode()) {
		for (WebElement e : eles1) {
		    Finder.continueSearchingOrStop();
		    Log.print("#### " + e.getAttribute("outerHTML"));
		}
	    }
	} catch (Exception e) {
	}
	return eles1;
    }

    private static String wordCapitalize(String text) {
	// Previous Code Was not working if Text: "First name: ...". So created a new
	// one.
	return Utils.firstCharCapitalization(text);
    }

    public static String xpathForTextKeywords(String tempText, boolean isContains, String tag) {
	if (AppiumContext.isBrowserMode()) {
	    return xpathForTextKeywordsWeb(tempText, isContains, tag);
	} else {
	    return xpathForTextKeywordsNative(tempText, isContains, tag);
	}
    }

    private static String xpathForTextKeywordsWeb(String tempText, boolean isContains, String tag) {
	String x;
	String extraProperty = "";
	String xpathForImg = "";
	String preXpath = "";

	/**
	 * It finds element with text no need to use this in img property
	 * (textNodeXpath)
	 */
	String textNodeXpath = "";

	if (tag == null || tag.isEmpty()) {
	    tag = "*";
	} else if (tag.equals("img")) {
	    xpathForImg = "or contains(normalize-space(@alt)," + Utils.handleComaInText(tempText)
		    + ") or contains(normalize-space(@alt)," + Utils.handleComaInText(Utils.specialSpaceText(tempText))
		    + ")";
	} else {
	    tag = "*";
	}

	if (isContains) {
	    if (tag.equals("*"))
		textNodeXpath = " | " + preXpath + "//text()[contains(. , " + Utils.handleComaInText(tempText)
			+ ")]/parent::*" + " | " + preXpath + "//text()[contains(. , "
			+ Utils.handleComaInText(Utils.specialSpaceText(tempText)) + ")]/parent::*";

	    x = preXpath + "//" + tag + "[not(self::script) and not(self::title) and not(@type='hidden') "
		    + extraProperty + " and (contains(normalize-space(text())," + Utils.handleComaInText(tempText)
		    + ") or (contains(normalize-space(@value)," + Utils.handleComaInText(tempText)
		    + ") and (self::input[" + lowerXpathProperty("type", "button")
		    + "])) or (contains(normalize-space(@value)," + Utils.handleComaInText(tempText)
		    + ") and (self::input[" + lowerXpathProperty("type", "submit")
		    + "])) or contains(normalize-space(text()),"
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText))
		    + ") or contains(normalize-space(@placeholder)," + Utils.handleComaInText(tempText)
		    + ") or contains(normalize-space(@placeholder),"
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText))
		    + ") or contains(normalize-space(@data-original-title)," + Utils.handleComaInText(tempText)
		    + ") or contains(normalize-space(@data-original-title),"
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText))
		    + ") or contains(normalize-space(@title)," + Utils.handleComaInText(tempText)
		    + ") or contains(normalize-space(@title),"
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText)) + "" + xpathForImg
		    + " or contains(normalize-space(@data-placeholder)," + Utils.handleComaInText(tempText) + ") ) )] "
		    + textNodeXpath;

	} else {
	    if (tag.equals("*"))
		textNodeXpath = " | " + preXpath + "//text()[normalize-space(.) = " + Utils.handleComaInText(tempText)
			+ "]/parent::*" + " | " + preXpath + "//text()[normalize-space(.) = "
			+ Utils.handleComaInText(Utils.specialSpaceText(tempText)) + "]/parent::*";

	    x = preXpath + "//" + tag + "[not(self::script) and not(@type='hidden') " + extraProperty
		    + " and (normalize-space(text())=" + Utils.handleComaInText(tempText) + " or text()="
		    + Utils.handleComaInText(tempText) + " or normalize-space(translate(text(),'\u00a0',' '))="
		    + Utils.handleComaInText(tempText) + " or (normalize-space(@value)="
		    + Utils.handleComaInText(tempText) + " and (self::input["
		    + Finder.lowerXpathProperty("type", "button") + "])) or (normalize-space(@value)="
		    + Utils.handleComaInText(tempText) + " and (self::input["
		    + Finder.lowerXpathProperty("type", "submit") + "])) or normalize-space(text())="
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText)) + " or normalize-space(@placeholder)="
		    + Utils.handleComaInText(tempText) + " or normalize-space(@placeholder)="
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText))
		    + " or normalize-space(@data-original-title)=" + Utils.handleComaInText(tempText)
		    + " or normalize-space(@data-original-title)="
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText)) + " or normalize-space(@title)="
		    + Utils.handleComaInText(tempText) + " or normalize-space(@title)="
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText)) + xpathForImg
		    + " or normalize-space(@data-placeholder)=" + Utils.handleComaInText(tempText) + " )] "
		    + textNodeXpath;

	}

	return "(" + x + ")";
    }

    private static String xpathForTextKeywordsNative(String tempText, boolean isContains, String tag) {
	String x;
	String extraProperty = "";
	String xpathForImg = "";
	String preXpath = "";

	/**
	 * It finds element with text no need to use this in img property
	 * (textNodeXpath)
	 */
	String textNodeXpath = "";

	if (tag == null || tag.isEmpty()) {
	    tag = "*";
	} else if (tag.equals("img")) {
	    xpathForImg = "or contains(normalize-space(@alt)," + Utils.handleComaInText(tempText)
		    + ") or contains(normalize-space(@alt)," + Utils.handleComaInText(Utils.specialSpaceText(tempText))
		    + ")";
	} else {
	    tag = "*";
	}

	if (isContains) {
	    if (tag.equals("*"))
		textNodeXpath = " | " + preXpath + "//@text[contains(. , " + Utils.handleComaInText(tempText)
			+ ")]/parent::*" + " | " + preXpath + "//@text[contains(. , "
			+ Utils.handleComaInText(Utils.specialSpaceText(tempText)) + ")]/parent::*";

	    x = preXpath + "//" + tag + "[not(self::script) and not(self::title) and not(@type='hidden') "
		    + extraProperty + " and (contains(normalize-space(@text)," + Utils.handleComaInText(tempText)
		    + ") or (contains(normalize-space(@value)," + Utils.handleComaInText(tempText)
		    + ") and (self::input[" + lowerXpathProperty("type", "button")
		    + "])) or (contains(normalize-space(@value)," + Utils.handleComaInText(tempText)
		    + ") and (self::input[" + lowerXpathProperty("type", "submit")
		    + "])) or contains(normalize-space(@text),"
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText))
		    + ") or contains(normalize-space(@placeholder)," + Utils.handleComaInText(tempText)
		    + ") or contains(normalize-space(@placeholder),"
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText))
		    + ") or contains(normalize-space(@data-original-title)," + Utils.handleComaInText(tempText)
		    + ") or contains(normalize-space(@data-original-title),"
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText))
		    + ") or contains(normalize-space(@title)," + Utils.handleComaInText(tempText)
		    + ") or contains(normalize-space(@title),"
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText)) + "" + xpathForImg
		    + " or contains(normalize-space(@data-placeholder)," + Utils.handleComaInText(tempText) + ") ) )] "
		    + textNodeXpath;

	} else {
	    if (tag.equals("*"))
		textNodeXpath = " | " + preXpath + "//@text[normalize-space(.) = " + Utils.handleComaInText(tempText)
			+ "]/parent::*" + " | " + preXpath + "//@text[normalize-space(.) = "
			+ Utils.handleComaInText(Utils.specialSpaceText(tempText)) + "]/parent::*";

	    x = preXpath + "//" + tag + "[not(self::script) and not(@type='hidden') " + extraProperty
		    + " and (normalize-space(@text)=" + Utils.handleComaInText(tempText) + " or @text="
		    + Utils.handleComaInText(tempText) + " or normalize-space(translate(@text,'\u00a0',' '))="
		    + Utils.handleComaInText(tempText) + " or (normalize-space(@value)="
		    + Utils.handleComaInText(tempText) + " and (self::input["
		    + Finder.lowerXpathProperty("type", "button") + "])) or (normalize-space(@value)="
		    + Utils.handleComaInText(tempText) + " and (self::input["
		    + Finder.lowerXpathProperty("type", "submit") + "])) or normalize-space(@text)="
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText)) + " or normalize-space(@placeholder)="
		    + Utils.handleComaInText(tempText) + " or normalize-space(@placeholder)="
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText))
		    + " or normalize-space(@data-original-title)=" + Utils.handleComaInText(tempText)
		    + " or normalize-space(@data-original-title)="
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText)) + " or normalize-space(@title)="
		    + Utils.handleComaInText(tempText) + " or normalize-space(@title)="
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText)) + xpathForImg
		    + " or normalize-space(@data-placeholder)=" + Utils.handleComaInText(tempText) + " )] "
		    + textNodeXpath;

	}

	return "(" + x + ")";
    }

    public static String xpathForTextKeywordsDirection(String tempText, boolean isContains, boolean before) {
	String x;
	String direction;
	if (before) {
	    direction = "preceding";
	} else {
	    direction = "following";
	}
	if (isContains)
	    x = ".//" + direction
		    + "::*[not(self::script) and not(@type='hidden') and (contains(normalize-space(text()),"
		    + Utils.handleComaInText(tempText) + ") or (contains(normalize-space(@value),"
		    + Utils.handleComaInText(tempText) + ") and (self::input[" + lowerXpathProperty("type", "button")
		    + "])) or (contains(normalize-space(@value)," + Utils.handleComaInText(tempText)
		    + ") and (self::input[" + lowerXpathProperty("type", "submit")
		    + "])) or contains(normalize-space(text()),"
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText))
		    + ") or contains(normalize-space(@placeholder)," + Utils.handleComaInText(tempText)
		    + ") or contains(normalize-space(@placeholder),"
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText))
		    + ") or contains(normalize-space(@data-original-title)," + Utils.handleComaInText(tempText)
		    + ") or contains(normalize-space(@data-original-title),"
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText))
		    + ") or contains(normalize-space(@title)," + Utils.handleComaInText(tempText)
		    + ") or contains(normalize-space(@title),"
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText))
		    + " or contains(normalize-space(@data-placeholder)," + Utils.handleComaInText(tempText) + ") ) )]";
	else
	    x = ".//" + direction + "::*[not(self::script) and not(@type='hidden') and (normalize-space(text())="
		    + Utils.handleComaInText(tempText) + " or text()=" + Utils.handleComaInText(tempText)
		    + " or (normalize-space(@value)=" + Utils.handleComaInText(tempText) + " and (self::input["
		    + lowerXpathProperty("type", "button") + "])) or (normalize-space(@value)="
		    + Utils.handleComaInText(tempText) + " and (self::input[" + lowerXpathProperty("type", "submit")
		    + "])) or normalize-space(text())=" + Utils.handleComaInText(Utils.specialSpaceText(tempText))
		    + " or normalize-space(@placeholder)=" + Utils.handleComaInText(tempText)
		    + " or normalize-space(@placeholder)=" + Utils.handleComaInText(Utils.specialSpaceText(tempText))
		    + " or normalize-space(@data-original-title)=" + Utils.handleComaInText(tempText)
		    + " or normalize-space(@data-original-title)="
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText)) + " or normalize-space(@title)="
		    + Utils.handleComaInText(tempText) + " or normalize-space(@title)="
		    + Utils.handleComaInText(Utils.specialSpaceText(tempText))
		    + " or normalize-space(@data-placeholder)=" + Utils.handleComaInText(tempText) + " )]";
	return x;
    }

    // translate xpath property to lowercase
    public static String lowerXpathProperty(String attribute, String text) {
	return "translate(@" + attribute + ",'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz') = '"
		+ text.toLowerCase() + "'";
    }

    private static List<WebElement> findTextByJsoup(String text) throws ToolNotSetException {
	List<WebElement> eles = new ArrayList<>();
	String pageSource = Finder.findAppiumDriver().getPageSource();
	Document source = Jsoup.parse(pageSource, "UTF-8");
	Elements body = source.select("body");
	Node node = body.get(0);
	innerNodeText(node, text);
	for (Node n : allTextNodes) {
	    String xpath = "//body/" + createXpath(n);
	    Log.print("xpath: " + xpath);
	    try {
		eles.add(Finder.findAppiumDriver().findElement((By.xpath(xpath))));
	    } catch (Exception e) {
		System.out.println("Exception while findTextByJsoup : " + e.getMessage());
		// e.printStackTrace();
	    }
	}
	return eles;
    }

    public static void innerNodeText(Node node, String text) {
	List<Node> nodes = node.childNodes();
	// iterate until text node is found
	for (Node n : nodes) {
	    if ((n.hasAttr("value") || n.hasAttr("placeholder")) && !n.attr("type").equals("hidden")) {
		if (n.attr("type").equals("text") || n.attr("type").equals("button") || !n.hasAttr("type")) {
		    // replace &nbsp; with space in placeholder and value text
		    if (n.attr("value").replaceAll("\u00a0", " ").trim().equals(text))
			allTextNodes.add(n);
		    else if (n.attr("placeholder").replaceAll("\u00a0", " ").trim().equals(text)) {
			allTextNodes.add(n);
		    }
		}
	    }

	    innerNodeText(n, text);
	}
	// Text Node only
	if (node.childNodes().size() == 0 && !(node.toString().trim().isEmpty()) && (node.nodeName().equals("#text"))) {
	    String t = node.toString().replaceAll("\n ", "").replaceAll("&nbsp;", " ").trim();
	    if (t.equals(text))
		allTextNodes.add(node.parent());
	}
    }

    public static String createXpath(Node n) {
	int index = 1;
	String xpath = "";
	while (!(n.nodeName().equals("body"))) {
	    Log.print(n.parentNode().nodeName() + " ");
	    index = elementIndex(n);
	    xpath = "/" + n.nodeName() + "[" + index + "]" + xpath;
	    n = n.parentNode();
	}
	return xpath;
    }

    // find element index in xpath
    public static int elementIndex(Node n) {
	int i = 0;
	String s = n.nodeName();

	while (n != null) {
	    if (n.nodeName().equals(s)) {
		i++;
	    }
	    n = n.previousSibling();
	}
	return i;
    }

    private static List<WebElement> findTextIfInsideSelectOption(List<WebElement> textElementsList2,
	    String textSearch) {
	int counter = 0;
	List<WebElement> tempList = new ArrayList<>(textElementsList2);

	for (WebElement e : tempList) {
	    try {
		// Log.print(e.getAttribute("outerHTML"));
		if (e.getTagName().toLowerCase().equals("option")) {
		    WebElement optionParent = e.findElement(By.xpath(".."));
		    Select select = new Select(optionParent);
		    if (!select.isMultiple()) {
			List<WebElement> allSelected = select.getAllSelectedOptions();
			for (WebElement eOption : allSelected) {
			    if (!eOption.getText().equalsIgnoreCase(textSearch)) {
				textElementsList2.remove(counter);
				counter--;
			    }
			}
		    }
		}
	    } catch (StaleElementReferenceException ex) {
		Log.print("@Exception while: findTextIfInsideSelectOption");
		// It may be possible that one element is inside frame and one not, So it may
		// throw staleException
		// But need not to stop for that, Life goes on
	    }
	    counter++;
	}

	return textElementsList2;
    }

    private static List<WebElement> frameHandlingInTextKeywords(String text, boolean isContains, int index, String tag)
	    throws ToolNotSetException, ObjectNotFoundException, TimeOut_ObjectNotFoundException {
	AppiumDispatcher.frameSwitched = true;
	List<WebElement> eles = new ArrayList<WebElement>();
	List<WebElement> frameList = null;

	try {
	    frameList = Finder.findAppiumDriver().findElements(By.xpath("//*[self::frame or self::iframe]"));
	    Log.print("Frame Size: " + frameList.size());
	} catch (Exception e) {
	    if (Log.printDebugLog) {
		System.out.println("Exception while frameHandlingInTextKeywords : " + e.getMessage());
		// e.printStackTrace();
	    }
	}

	// for(int i=frameList.size()-1;i>=0;i--){
	for (int i = 0; i < frameList.size(); i++) {

	    try {
		Log.print("i=" + i + " [x,y,width,height]=[" + frameList.get(i).getRect().x + ","
			+ frameList.get(i).getRect().y + "," + frameList.get(i).getRect().width + ","
			+ frameList.get(i).getRect().height + "] <Display:" + frameList.get(i).isDisplayed()
			+ "> <Element:" + frameList.get(i).getAttribute("outerHTML"));

	    } catch (Exception e) {
	    }

	    if (!frameList.get(i).isDisplayed()) {
		continue;
	    }

	    Log.print("### Switching FRAME");
	    Finder.findAppiumDriver().switchTo().frame(frameList.get(i));

	    new Utils().waitForPageLoadAndOtherAjax();

	    // Issue if switching in iframe click is not working so doing action by
	    // javascript

	    try {
		findElementByText(text, isContains, index, tag);
		// if (eles.size() > 0) {
		Log.print("textElementsList Size: " + textElementsList.size());
		Log.print("index: " + index);
		if (textElementsList.size() > index) {
		    Log.print("Frame Handling End");
		    return textElementsList;
		}
	    } catch (Exception e) {

		if (e instanceof TimeOut_ObjectNotFoundException) {
		    throw new TimeOut_ObjectNotFoundException(e.getMessage());
		}

	    }
	    List<WebElement> list = frameHandlingInTextKeywords(text, isContains, index, tag);

	    if (breakFrameHandlingInByText) {
		Log.print("Switching to Default Content...");
		findAppiumDriver().switchTo().defaultContent();
		Log.print("Breaking Loop...");
		break;
	    }

	    if (!list.isEmpty())
		return list;

	    Log.print("### Switching To Parent Frame");
	    Finder.findAppiumDriver().switchTo().parentFrame();
	}
	return eles;
    }

}
