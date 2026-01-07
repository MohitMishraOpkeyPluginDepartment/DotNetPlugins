package com.crestech.opkey.plugin.keywords;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.crestech.opkey.plugin.tableAdapter.QueryAdapter;
import com.crestech.opkey.plugin.tableAdapter.TableAdpater;
import com.crestech.opkey.plugin.webdriver.Finder;
import com.crestech.opkey.plugin.webdriver.Log;
import com.crestech.opkey.plugin.webdriver.OpkeyLogger;
import com.crestech.opkey.plugin.webdriver.Validations;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ObjectNotFoundException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ToolNotSetException;
import com.crestech.opkey.plugin.webdriver.keywords.Frame;
import com.crestech.opkey.plugin.webdriver.keywords.Utils;
import com.crestech.opkey.plugin.webdriver.object.WebDriverObject;
import com.crestech.opkey.plugin.webdriver.util.Checkpoint;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.jsoup.nodes.Element;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;

public class ScrollInTable implements KeywordLibrary {
	private int height = 100;

	public FunctionResult Method_scrollRow(final WebDriverObject object, final String columnName, final int rowNumber,
			int objectIndex, final String header1, final String value1, final String header2, final String value2,
			final String header3, final String value3, final String header4, final String value4, final String header5,
			final String value5) throws Exception {
		return (new Checkpoint() {
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
//				WebElement table = Finder.findWebElement(object);
				try {
					Validations.checkDataForBlank(new int[] { 3 });
				} catch (ArgumentDataMissingException e) {
					System.out.println("*********** ByRow **********");

					ScrollInTable.this.ByRow(object, columnName, rowNumber);
				}
				ScrollInTable.this.ByQuery(object, columnName, header1, value1, header2, value2, header3, value3,
						header4, value4, header5, value5);
				return Result.PASS().setMessage("Scrolling Done!").setOutput(true).make();
			}
		}).run();
	}

	private void ByQuery(WebDriverObject object, String columnName, String header1, String value1, String header2,
			String value2, String header3, String value3, String header4, String value4, String header5, String value5)
			throws Exception {
		WebElement cellFound = null;
		try {
			cellFound = findTableCellByQuery(object, columnName, header1, value1, header2, value2, header3, value3,
					header4, value4, header5, value5);
			if (cellFound != null) {
				System.out.println("Cell Found: ");
				return;
			}
		} catch (Exception e) {
			if (e instanceof ObjectNotFoundException)
				throw e;
			e.printStackTrace();
		}
		if (cellFound == null) {
			Frame.m = 0;
			OpkeyLogger.printSaasLog(null, "  cellFound == null ");
			(new Utils()).waitForPageLoadAndOtherAjax();
			WebElement table = Finder.findWebElement(object);
			OpkeyLogger.printSaasLog(null,
					".//div[(contains(@style,\"position: absolute;\") or contains(@style,\"overflow: auto;\") or contains(@style,\"z-index: 0;\")) and(contains(@id,\"scroller\"))]");
			List<WebElement> scrollDivs = table.findElements(By.xpath(
					".//div[(contains(@style,\"position: absolute;\") or contains(@style,\"overflow: auto;\") or contains(@style,\"z-index: 0;\")) and (contains(@id,\"scroller\"))]"));
			if (scrollDivs.isEmpty()) {
				OpkeyLogger.printSaasLog(null,
						".//div[contains(@style,\"position: absolute;\") or contains(@style,\"overflow: auto;\") or contains(@style,\"z-index: 0;\")]");
				scrollDivs = table.findElements(By.xpath(
						".//div[contains(@style,\"position: absolute;\") or contains(@style,\"overflow: auto;\") or contains(@style,\"z-index: 0;\")]"));
			}
			if (scrollDivs.isEmpty()) {
				OpkeyLogger.printSaasLog(null,
						".//tbody[contains(@style,\"position: absolute;\") or contains(@style,\"overflow: auto;\") or (@data-oj-container=\"ojTable\") or  contains(@style,\"z-index: 0;\") or contains(@style,\"overflow-x: hidden;\")]");
				scrollDivs = table.findElements(By.xpath(
						".//tbody[contains(@style,\"position: absolute;\") or contains(@style,\"overflow: auto;\") or (@data-oj-container=\"ojTable\") or  contains(@style,\"z-index: 0;\") or contains(@style,\"overflow-x: hidden;\")]"));
			}
			List<WebElement> visscrollDivs = Utils.visible(scrollDivs);
			WebElement visscrollDiv = visscrollDivs.get(0);
			OpkeyLogger.printSaasLog(null,
					(new StringBuilder()).append(visscrollDivs.get(0)).append("  visscrollDivs.get(0) ").toString());
			int addition = 200;
			System.out.println("Scrolling By: " + this.height);
			String script = "";
			if (Finder.findWebDriver() instanceof org.openqa.selenium.ie.InternetExplorerDriver) {
				script = "arguments[0].scrollTop = " + this.height + ";";
			} else {
				script = "arguments[0].scrollTo(0, " + this.height + ");";
			}
			if (visscrollDiv != null) {
				OpkeyLogger.printSaasLog(null, String.valueOf((visscrollDiv != null)) + "  visscrollDiv != null ");
				((JavascriptExecutor) Finder.findWebDriver()).executeScript(script, new Object[] { visscrollDiv });
				this.height += addition;

				Thread.sleep(2000);
				(new Utils()).waitForPageLoadAndOtherAjaxIfTrue();
				ByQuery(object, columnName, header1, value1, header2, value2, header3, value3, header4, value4, header5,
						value5);
			}
		}
	}

	private WebElement ByRow(WebDriverObject object, String columnName, int rowNumber) throws Exception {
		try {
			WebElement ta = findTableCellByRowIndex(object, columnName, rowNumber);
			if (ta != null) {
				(new Utils()).scrollIntoView_Extended(ta);
				System.out.println("Cell Found: " + ta.getText());
				return ta;
			}
		} catch (Exception e) {
			if (!e.getMessage().equals("Data Not Loaded Yet..."))
				throw e;
		}
		WebElement table = Finder.findWebElement(object);
		List<WebElement> scrollDivs = table.findElements(By.xpath(
				".//div[contains(@style,\"position: absolute;\") and contains(@style,\"overflow: auto;\") and contains(@style,\"z-index: 0;\")]"));
		List<WebElement> visscrollDivs = Utils.visible(scrollDivs);
		WebElement visscrollDiv = visscrollDivs.get(0);
		int addition = 100;
		String script = "";
		if (Finder.findWebDriver() instanceof org.openqa.selenium.ie.InternetExplorerDriver) {
			script = "arguments[0].scrollTop = " + this.height + ";";
		} else {
			script = "arguments[0].scrollTo(0, " + this.height + ");";
		}
		if (visscrollDiv != null) {
			((JavascriptExecutor) Finder.findWebDriver()).executeScript(script, new Object[] { visscrollDiv });
			this.height += addition;
			(new Utils()).waitForPageLoadAndOtherAjax();
			Thread.sleep(1000L);
			return ByRow(object, columnName, rowNumber);
		}
		throw new ObjectNotFoundException("No div found to scroll!");
	}

	public static String createXpath(Element n) {
		int index = 1;
		String xpath = "";
		while (true) {
			if (n == null) {
				System.out.println("Last Element Found");
				break;
			}
			if (n.tagName().toLowerCase().equals("body"))
				break;
			index = elementIndex(n);
			xpath = "/" + n.tagName() + "[" + index + "]" + xpath;
			n = n.parent();
		}
		return xpath;
	}

	public static int elementIndex(Element n) {
		int i = 0;
		String s = n.tagName();
		while (n != null) {
			if (n.tagName().equals(s))
				i++;
			n = n.previousElementSibling();
		}
		return i;
	}

	private WebElement findTableCellByQuery(WebDriverObject object, String columnName, String header1, String value1,
			String header2, String value2, String header3, String value3, String header4, String value4, String header5,
			String value5) throws Exception {
		long start = System.currentTimeMillis();
		WebElement table = Finder.findWebElement(object);
		QueryAdapter qa = new QueryAdapter(table, columnName, header1, value1, header2, value2, header3, value3,
				header4, value4, header5, value5);
		List<Element> cells = qa.findCells();
		WebElement element = null;
		List<WebElement> list = new ArrayList<>();
		outerLoop: for (Element cell : cells) {
			System.out.println("***** " + cell.text() + " " + cell.tagName());
			if (cell.tagName().equals("th"))
				continue;
			Thread.sleep(500L);
			String xpath = "//*[contains(text(),\"" + cell.text() + "\")]";
			System.out.println("Neon Xpath " + xpath);
			List<WebElement> elements = Finder.findWebDriver().findElements(By.xpath(xpath));

			if (elements.size() == 0 && (table.getAttribute("class").contains("oj-table-container"))) {
				// specific for molina client
				xpath = "//*[contains(text(),\"" + value1 + "\")]";
				System.out.println("Neon Xpath molina specific " + xpath);
				elements = Finder.findWebDriver().findElements(By.xpath(xpath));
				System.out.println("elements size molina specific ***** " + elements.size());
				for (WebElement webElement : elements) {
					new Utils().scrollMid(webElement);
					list.add(webElement);

					String elementText = webElement.getText();

					System.out.println("***** " + elementText);

					if (elementText.contains(value1)) {
						element = webElement;
						break outerLoop;
					}
				}
			}

			else {
				System.out.println("elements size ***** " + elements.size());
				for (WebElement webElement : elements) {
					new Utils().scrollMid(webElement);
					list.add(webElement);

					String elementText = webElement.getText();

					System.out.println("***** " + elementText);

					if (elementText.equals(cell.text())) {
						element = webElement;
						break outerLoop;
					}
				}
			}
		}
		if (element != null)
			(new Utils()).scrollMid(element);
		return element;
	}

	private WebElement findTableCellByRowIndex(WebDriverObject object, String columnName, int rowNumber)
			throws Exception {
		int columnNumber = -1;
		try {
			Validations.checkDataForBlank(new int[1]);
		} catch (ArgumentDataMissingException e) {
			columnNumber = 0;
		}
		try {
			Validations.checkDataForBlank(new int[] { 1 });
		} catch (ArgumentDataMissingException e) {
			rowNumber = 0;
		}
		WebElement table = Finder.findWebElement(object);
		TableAdpater ta = new TableAdpater(table);
		columnNumber = ta.getHeaderNumber(columnName, 0);
		Element cell = null;
		try {
			cell = ta.getElement(rowNumber, columnNumber, true);
		} catch (Exception e) {
			throw new ObjectNotFoundException(
					new WebDriverObject(Boolean.valueOf(false), "Table", Boolean.valueOf(false)),
					"Data Not Loaded Yet...");
		}
		System.out.println("***** " + cell.text());
		String cssSelector = Utility.validateCSS(cell.cssSelector());
		System.out.println("cssSelector :: " + cssSelector);
		List<WebElement> elements = table.findElements(By.cssSelector(cssSelector));
		WebElement element = null;
		for (WebElement webElement : elements) {
			String elementText = webElement.getText();
			if (elementText.equals(cell.text())) {
				element = webElement;
				break;
			}
		}
		int objectIndex = 0;
		if (element == null)
			element = elements.get(objectIndex);
		(new Utils()).scrollMid(element);
		return element;
	}

	public WebElement getCell(Element cell, WebElement table) {
		String cssSelector = Utility.validateCSS(cell.cssSelector());
		System.out.println("cssSelector :: " + cssSelector);
		List<WebElement> elements = table.findElements(By.cssSelector(cssSelector));
		ArrayList<WebElement> finalEles = new ArrayList<>();
		for (WebElement webElement : elements) {
			String elementText = webElement.getText();
			System.out.println("***** " + elementText);
			if (elementText.equals(cell.text()))
				return webElement;
		}
		return null;
	}

	public WebElement getFirstCell(Element cell, WebElement table) {
		String cssSelector = Utility.validateCSS(cell.cssSelector());
		System.out.println("cssSelector :: " + cssSelector);
		List<WebElement> elements = table.findElements(By.cssSelector(cssSelector));
		return elements.get(0);
	}

	WebElement findTableCellByAdapter(WebElement table) throws ObjectNotFoundException {
		TableAdpater ta = new TableAdpater(table);
		int colCount = ta.getAllColumnCount();
		int rowCount = ta.getRowsCountInsideTableBody();
		for (int colNo = 0; colNo < colCount; colNo++) {
			Element element = ta.getElement(rowCount - 1, colNo, false);
		}
		return table;
	}

	public static void main(String[] args) throws ToolNotSetException {
		String c = ".//div[contains(@style,\"position: absolute;\") and contains(@style,\"overflow: auto;\") and contains(@style,\"z-index: 0;\")]";
		int height = 100;
		String script = "";
		if (Finder.findWebDriver() instanceof org.openqa.selenium.ie.InternetExplorerDriver) {
			script = "arguments[0].scrollTop = " + height + ";";
		} else {
			script = "arguments[0].scrollTo(0, " + height + ");";
		}
		System.out.println(script);
	}

	void scrollDiv(WebDriverObject object) throws Exception {
		WebElement table = Finder.findWebElement(object);
		List<WebElement> scrollDivs = table.findElements(By.xpath(
				".//div[contains(@style,\"position: absolute;\") and contains(@style,\"overflow: auto;\") and contains(@style,\"z-index: 0;\")]"));
		List<WebElement> visscrollDivs = Utils.visible(scrollDivs);
		WebElement visscrollDiv = visscrollDivs.get(0);
		int addition = 100;
		String script = "";
		if (Finder.findWebDriver() instanceof org.openqa.selenium.ie.InternetExplorerDriver) {
			script = "arguments[0].scrollTop = " + this.height + ";";
		} else {
			script = "arguments[0].scrollTo(0, " + this.height + ");";
		}
		if (visscrollDiv != null) {
			((JavascriptExecutor) Finder.findWebDriver()).executeScript(script, new Object[] { visscrollDiv });
			this.height += addition;
			(new Utils()).waitForPageLoadAndOtherAjax();
			Thread.sleep(1000L);
		}
	}
}
