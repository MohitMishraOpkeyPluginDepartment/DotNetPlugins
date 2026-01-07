package com.crestech.opkey.plugin.keywords;

import java.awt.Dimension;
import java.awt.Toolkit;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import java.util.stream.Collectors;

import org.openqa.selenium.By;
import org.openqa.selenium.InvalidArgumentException;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.crestech.opkey.plugin.webdriver.Finder;
import com.crestech.opkey.plugin.webdriver.OpkeyLogger;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ObjectNotFoundException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ToolNotSetException;
import com.crestech.opkey.plugin.webdriver.keywords.Utils;
import com.crestech.opkey.plugin.webdriver.keywords.WebObjects;
import com.crestech.opkey.plugin.webdriver.util.GenericCheckpoint;

public class NavigatorResponsibility implements KeywordLibrary {
	

	public void sysResolution() {
		Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
		double width = screenSize.getWidth();
		double height = screenSize.getHeight();
		System.out.println("System Resolution " + width + ":" + height);
	}

	String maxHeight = "450";

	String popupViewPortResolverStyle = "max-height: " + maxHeight + "px !important;";
	String allClassModified;
	String allStyleModified;

	
	//Method_navigatorClick
	//Method_NavigateToWorkArea
	public FunctionResult Method_NavigateToWorkArea(String ParentResp, String childResp) throws Exception {

		OpkeyLogger.printSaasLog(this.getClass(), "inside Method_navigatorClick");
		sysResolution();

		if (childResp == null || childResp.isEmpty())
			throw new InvalidArgumentException("Child Responsibility value can not be null or empty");

		OpkeyLogger.printSaasLog(this.getClass(), "inside Method_navigatorClick2");

		loadAndResole();
		
		launchNavigator();

		/*
		 * resolvePopupViewPortAndConfirm("pt1:nv_pgl3");
		 * 
		 * launchNavigator(); launchNavigator();
		 */

		OpkeyLogger.printSaasLog(this.getClass(), "inside Method_navigatorClick3");

		WebElement parentRespEle = null;
		WebElement childRespEle = null;

		if (ParentResp != null && !ParentResp.isEmpty()) {
			parentRespEle = findParentRespWebElement(ParentResp);
		}

		if (parentRespEle != null) {

			new WebObjects().highlightElement(parentRespEle);

			List<WebElement> parentRespEleContainer = parentRespEle.findElements(By.xpath("./.."));

			if (parentRespEleContainer.size() == 0) {
				throw new ObjectNotFoundException("parentRespEleContainer not found");
			}

			childRespEle = findChildRespElement(parentRespEleContainer.get(0), childResp);

		} else {
			childRespEle = findChildRespElement(null, childResp);
		}

		new WebObjects().highlightElement(childRespEle);

		if (childRespEle != null) {

			clickElement(childRespEle);
		}

		return Result.PASS().setOutput(true).setMessage("done").make();
	}

	private WebElement findChildRespElement(WebElement siblingElement, String childResp) throws Exception {

		return new GenericCheckpoint<WebElement>() {

			@Override
			public WebElement _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
				List<WebElement> childRespElements;

				if (siblingElement != null) {
					childRespElements = siblingElement.findElements(By.xpath("./following-sibling::div//a[text()=\"" + childResp + "\"]"));
				} else {
					childRespElements = Finder.findWebDriver().findElements(By.xpath("//h1[text()=\"Navigator\"]/following::a[text()=\"" + childResp + "\"]"));
					if (childRespElements.size() == 0) {

						childRespElements = findChildRespElementInSecondPopup(childResp);

					}

				}

				if (childRespElements.size() == 0) {
					OpkeyLogger.printSaasLog(this.getClass(), "childRespElements not found");
					throw new ObjectNotFoundException("Child responsibility not found");
				} else if (childRespElements.size() > 1)
					OpkeyLogger.printSaasLog(this.getClass(), "Warning: Multiple childRespElements Found, performing on first.");

				return childRespElements.get(0);
			}

		}.run();

	}

	private List<WebElement> findChildRespElementInSecondPopup(String childResp) throws Exception {

		openSecondPopup();

		//resolvePopupViewPortAndConfirm("pt1:nv_pgl4");

		return new GenericCheckpoint<List<WebElement>>() {

			@Override
			public List<WebElement> _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				String xpath = "//h1[text()=\"Navigator\"]/following::a[text()=\"" + childResp + "\"]";
				OpkeyLogger.printSaasLog(this.getClass(), "findChildRespElementInSecondPopup xpath -> " + xpath);
				List<WebElement> childRespElements = Finder.findWebDriver().findElements(By.xpath(xpath));
				if (childRespElements.size() == 0) {
					OpkeyLogger.printSaasLog(this.getClass(), "childRespElements not found");
					throw new ObjectNotFoundException("Child responsibility not found");
				}

				return childRespElements;
			}
		}.run();

	}

	private WebElement findParentRespWebElement(String parentResp) throws Exception {

		return new GenericCheckpoint<WebElement>() {

			

			@Override
			public WebElement _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				//confirmNavigatorPresence();

				List<WebElement> ParentRespWebElement = findInFirstpopup(parentResp);
				
				
				if (ParentRespWebElement.size() == 0) {

					OpkeyLogger.printSaasLog(this.getClass(), "Not found in first popup, finding in second");

					ParentRespWebElement = findInSecondpopup(parentResp);
				}

				if (ParentRespWebElement.size() != 1) {
					OpkeyLogger.printSaasLog(this.getClass(), "ParentRespWebElement not found");
					throw new ObjectNotFoundException("Parent responsibility not found");
				} else if (ParentRespWebElement.size() > 1)
					OpkeyLogger.printSaasLog(this.getClass(), "Warning: Multiple ParentRespWebElement Found, performing on first.");

				return ParentRespWebElement.get(0);

			}

		}.run();

	}

	private void confirmNavigatorPresence() throws ToolNotSetException, ObjectNotFoundException {

		List<WebElement> navigatorHeading = Finder.findWebDriver().findElements(By.xpath("//h1[text()=\"Navigator\"]"));

		if (navigatorHeading.size() != 1) {
			OpkeyLogger.printSaasLog(this.getClass(), "navigatorHeading not found");
			throw new ObjectNotFoundException("navigatorHeading not found");
		} else if (navigatorHeading.size() > 1)
			OpkeyLogger.printSaasLog(this.getClass(), "Warning: Multiple navigatorHeading Found, performing on first.");

		new WebObjects().ClickElement(navigatorHeading.get(0));

	}

	private List<WebElement> findInFirstpopup(String parentResp) throws ToolNotSetException, InterruptedException {

		Thread.sleep(2000);
		
		String xpath = "//h1[text()=\"Navigator\"]/following::span[text()=\"" + parentResp + "\"]";

		OpkeyLogger.printSaasLog(this.getClass(), "findInFirstpopup -> " + xpath);

		return Finder.findWebDriver().findElements(By.xpath(xpath));

	}

	private List<WebElement> findInSecondpopup(String parentResp) throws Exception {

		openSecondPopup();

		//resolvePopupViewPortAndConfirm("pt1:nv_pgl4");

		OpkeyLogger.printSaasLog(this.getClass(), "Second Pop opened");

		return Finder.findWebDriver().findElements(By.xpath("//h1[text()=\"Navigator\"]/following::span[text()=\"" + parentResp + "\"]"));

	}

	private FunctionResult openSecondPopup() throws Exception {

		return new GenericCheckpoint<FunctionResult>() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
				List<WebElement> secondPopLinks = Finder.findWebDriver().findElements(By.xpath("//a[text()=\"More...\"]"));

				if (secondPopLinks.size() != 1) {
					OpkeyLogger.printSaasLog(this.getClass(), "Links to second popup not found");
					throw new ObjectNotFoundException("secondPopLink not found");
				} else if (secondPopLinks.size() > 1)
					OpkeyLogger.printSaasLog(this.getClass(), "Warning: Multiple secondPopLinks Element Found, performing on first.");

				clickElement(secondPopLinks.get(0));

				OpkeyLogger.printSaasLog(this.getClass(), "SecondPop Launched");

				return Result.PASS().setOutput(true).setMessage("SecondPop Launched").make();
			}
		}.run();
	}

	private FunctionResult launchNavigator() throws Exception {

		return new GenericCheckpoint<FunctionResult>() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				List<WebElement> navElements = Finder.findWebDriver().findElements(By.xpath("//a[@title=\"Navigator\"]"));

				if (navElements.size() > 1)
					OpkeyLogger.printSaasLog(this.getClass(), "Warning: Multiple Navigator Element Found, performing on first.");

				else if (navElements.size() == 0) {
					OpkeyLogger.printSaasLog(this.getClass(), "Navigator not found");
					throw new ObjectNotFoundException("Navigator not found");
				}

				new WebObjects().ClickElement(navElements.get(0));

				OpkeyLogger.printSaasLog(this.getClass(), "Navigator launched");

				return Result.PASS().setOutput(true).setMessage("Navigator Launched").make();
			}
		}.run();

	}

	void clickElement(WebElement el) throws ToolNotSetException {
		
		new WebObjects().Method_clickUsingJavaScript(el);
	}

	public void loadAndResole() throws IOException, ToolNotSetException {
		
		new Utils().waitForPageLoadAndOtherAjax();
		
		InputStream is = com.crestech.opkey.plugin.jsScript.ScriptReader.class.getResourceAsStream("viewPortStyleScript.js");
		String script;
		try (BufferedReader br = new BufferedReader(new InputStreamReader(is))) {
			script = br.lines().collect(Collectors.joining(System.lineSeparator()));
		}
		
		((JavascriptExecutor) Finder.findWebDriver()).executeScript(script);

	}

}
