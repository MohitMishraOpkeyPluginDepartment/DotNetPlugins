package com.crestech.opkey.plugin.tableAdapter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.keywords.WebObject;
import com.crestech.opkey.plugin.webdriver.OpkeyLogger;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ObjectNotFoundException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ToolNotSetException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.exceptionmanager.ExceptionManager;
import com.crestech.opkey.plugin.webdriver.javascript.JSExecutor;
import com.crestech.opkey.plugin.webdriver.keywords.Utils;
import com.crestech.opkey.plugin.webdriver.object.WebDriverObject;

public class TableAdpater {

	static Class<WebObject> _class = WebObject.class;

	private List<RowAdapter> rows = new ArrayList<RowAdapter>();
	private Element[][] table = new Element[1000][1000];
	private int headerMaxIndex = 0;
	private WebElement element;

	// Declaring 2D Array with row-col(cell) data

	public TableAdpater(WebElement element) throws ObjectNotFoundException {
		// boolean runningInImpactMode = false;
		this(element, false);
	}

	public TableAdpater(WebElement element, boolean runningInImpactMode) throws ObjectNotFoundException {
		// Considering element is div containing all the tables required to
		// parse

		try {
			injectUniqeID(element);
		} catch (Exception e) {
			e.printStackTrace();
		}

		this.element = element;

		// Parsing the whole div HTML with Jsoup
		Document document = Jsoup.parse(element.getAttribute("outerHTML"));

		parseTable(document, runningInImpactMode);
	}

	private static void injectUniqeID(WebElement element2) {

		String script = Utils.getJavaScriptScriptContent(TableAdpater.class, "IDInjector.js");
		JSExecutor js = new JSExecutor();

		try {
			js.executeScript(script + "inject(arguments[0]);", element2);
		} catch (ToolNotSetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public TableAdpater(Document document, boolean runningInImpactMode) throws ObjectNotFoundException {
		parseTable(document, runningInImpactMode);
	}

	/**
	 * Parsing the div now
	 * 
	 * @param document
	 * @throws ObjectNotFoundException
	 * 
	 */
	private void parseTable(Document document, boolean runningInImpactMode) throws ObjectNotFoundException {
		// Finding all the elements in the div

		Elements hiden = document
				.select("td > span > span > div[style=\"display:none\"] div[_leafcolclientids] > div.x1np > table");

		System.out.println("hidden size is:" + hiden.size());

		if (hiden.size() == 10) {
			hiden.remove();
		} else {
			// hiden.remove();
		}

		/*
		 * if(!hiden.isEmpty()) {
		 * 
		 * for(Element h : hiden) {
		 * 
		 * h.remove();
		 * 
		 * } }
		 */

		document = Jsoup.parse(document.toString());

		Elements Elements = document.getAllElements();

		/*
		 * Since ID's in fusion comprising of Colon<:> And Css with colon doesn't work
		 * So removing all the ID's from the elements
		 */
		for (Element element : Elements) {
			element.removeAttr("id");
			if (element.attr("class").contains("Highlight"))
				element.removeAttr("class");
		}

		// Getting the parsed HTML from Document and parsing it with Jsoup
		String html = document.toString();
		Document source = Jsoup.parse(html);

		// Find all tables elements
		Elements tables = source.select("table");
		int rowNumber = -1;

		boolean getHeaderCount = true;
		int byPassInnerTable = 0;
		int headerTables = 0;
		boolean shouldAcceptEmptySummaryTable = false;
		boolean headerTable = true;
		// Handling scenario where every table contains summary as blank
		boolean isSummaryBlank = false;
		for (Element table : tables) {
			String summary = table.attr("summary").trim();
			if (summary.isEmpty() || summary.trim().equals("")) {
				isSummaryBlank = true;
			} else {
				isSummaryBlank = false;
				break;
			}
		}

		for (Element table : tables) {

			String summary = table.attr("summary").trim();
			OpkeyLogger.printSaasLog(_class, "summary is: " + summary);
			if (byPassInnerTable > 0) {
				byPassInnerTable--;
				continue;
			}

			if (!isSummaryBlank && !shouldAcceptEmptySummaryTable && !headerTable)
				// Ignoring all the tables where summary attribute is missing or
				// with empty value as they are content of nested table and need
				// not to be parse
				if (summary.isEmpty() || summary.trim().equals("")) {
					continue;
				}

			// Stop parsing table if it has no row(empty table)
			OpkeyLogger.printSaasLog(_class, "row count in this is: " + table.select("tr").size());
			if (table.select("tr").size() < 1) {
				continue;
			}

			// Parsing all the headers table (Considering header Table contains
			// 'column headers' in its summary attribute which is used to
			// identify table as Header table)
			if (summary.contains("column headers") || headerTable) {
				headerTable = false;
				headerTables = headerTables + 1;
				// If table element only contains headers then we need to add
				// that table's data in the following column rather that in row
				// so making rowNumber as -1
				if (checkTableContainsOnlyHeader(table)) {
					OpkeyLogger.printSaasLog(_class, "TABLE CONTAINS ONLY HEADER");
					rowNumber = -1;
				}

				// Fetch all the rows from the table
				Elements trList = table.select("tr");
				for (int j = 0; j < trList.size(); j++) {
					rowNumber = rowNumber + 1;

					// Add row And Parse row
					rows.add(new RowAdapter(this.table, trList.get(j), rowNumber, 0));

					// neglecting inner rows currently
					if (trList.get(j).select("tr").size() > 1) {
						j = j + (trList.get(j).select("tr").size() - 1);
					}
				}
				// Including table if firstTable after headerTables is
				// containing Summary attribute as empty/null
				if (headerTables > 1) {
					shouldAcceptEmptySummaryTable = true;
				}
			}
			// Parsing the table that doesn't contains summary as <Column
			// Headers>
			else {
				// Since running in impact analysis mode no need to parse data. Need to do this
				// in future
				if (runningInImpactMode)
					continue;

				shouldAcceptEmptySummaryTable = false;
				try {
					getHeaderCount = parseTabledataRows(table, getHeaderCount);
				} catch (IndexOutOfBoundsException e) {
					e.printStackTrace();
					throw new ObjectNotFoundException(new WebDriverObject(false, "Table", false), "Object Not Found");
				}

			}

			org.jsoup.select.Elements innerTables = table.select("table");
			byPassInnerTable = innerTables.size() - 1;
		}
	}

	/**
	 * This returns the count of inner cells of the last cell of the first data
	 * table
	 * 
	 * @param table
	 * @return
	 */
	private int getInnerCellsOfLastColumnOfTable(Element table) {
		OpkeyLogger.printSaasLog(_class, "CSS IS AS ::: " + validateCSS(table.cssSelector()));

		List<WebElement> eles = new ArrayList<WebElement>();

		// Find the table element and all column of that table
		if (validateCSS(table.cssSelector()).contains(".") || validateCSS(table.cssSelector()).contains(">")) {
			OpkeyLogger.printSaasLog(_class, "Searching using Css ");
			eles = this.element.findElement(By.cssSelector(validateCSS(table.cssSelector())))
					.findElements(By.xpath("(.//tr)[1]/td"));
		} else {
			OpkeyLogger.printSaasLog(_class, "Searching using TagName");
			eles = this.element.findElement(By.tagName(validateCSS(table.cssSelector())))
					.findElements(By.xpath("(.//tr)[1]/td"));
		}

		// Find the table element and all column of that table
		// List<WebElement> eles =
		// this.element.findElement(By.cssSelector(validateCSS(table.cssSelector()))).findElements(By.xpath("(.//tr)[1]/td"));

		// Fetch the last column of the table
		WebElement lastColumn = eles.get(eles.size() - 1);

		// Search all the inner cells of the last column
		List<WebElement> tdCount = lastColumn.findElements(By.xpath(".//td"));

		// return count of all the inner cells
		return tdCount.size();
	}

	/**
	 * 
	 * @param table
	 * @param getHeaderCount
	 * @return
	 */
	private boolean parseTabledataRows(Element table, boolean getHeaderCount) {
		removeAllInnerTables(table);
		Elements trList = table.select("tr");
		// First get the count of rows in the this.table i.e count of headers
		// (Since this.table only contains header till Now)
		// Runs only once in Table parsing
		if (getHeaderCount) {
			this.headerMaxIndex = getNextEmptyCellIndex();
			getHeaderCount = false;
		}

		int rowNumber = getNextEmptyCellIndex() - 1;
		int innerTableCellSize = getInnerCellsOfLastColumnOfTable(table);
		for (int j = 0; j < trList.size(); j++) {
			rowNumber = rowNumber + 1;
			// Add row And Parse row
			rows.add(new RowAdapter(this.table, trList.get(j), rowNumber, innerTableCellSize));

			// neglecting inner rows currently
			if (trList.get(j).select("tr").size() > 1) {
				j = j + (trList.get(j).select("tr").size() - 1);
			}
		}
		return getHeaderCount;
	}

	public int getHeaderMaxIndex() {
		return headerMaxIndex;
	}

	public int getHeaderMaxIndexForImpactAnalysis() {
		if (this.headerMaxIndex == 0) {
			this.headerMaxIndex = getNextEmptyCellIndex();
		}
		return this.headerMaxIndex;
	}

	private void removeAllInnerTables(Element table) {
		Elements innerTables = table.select("table");
		for (Element element : innerTables) {
			try {
				if (!element.attr("summary").equals(""))
					element.remove();

			} catch (Exception e) {
				System.out.println("Element Already removed");
			}
		}
	}

	/**
	 * Returns true if Table contains only Headers i.e only 'th' element within 'tr'
	 * 
	 * @param table
	 * @return
	 */
	private boolean checkTableContainsOnlyHeader(Element table) {
		Document document = Jsoup.parse(table.toString());
		Elements innerTables = document.select("table");
		boolean flag = false;
		for (Element element : innerTables) {
			// Removing all the inner table and its element from the Main Table
			if (!flag) {
				flag = true;
				continue;
			}
			Elements allInnerElements = element.getAllElements();
			try {
				for (Element element2 : allInnerElements) {
					element2.remove();
				}
			} catch (Exception e) {
				new ExceptionManager().pushException(e);
			}
		}
		Elements thList = document.select("th");
		Elements tdList = document.select("td");
		// Returns true if <th> element is found and <td> is empty
		if (thList.size() > 0 && tdList.size() == 0) {
			return true;
		}
		return false;
	}

	private String getString(String css) {
		String[] str = css.split(">");
		String parCss = null;
		if (str[0].trim().equalsIgnoreCase("html")) {
			parCss = css.substring(14);
			if (str[2].trim().contains("table")) {
				parCss = css.substring(14 + str[2].trim().length() + 3);
			}
		}
		if (str[0].trim().contains("table")) {
			parCss = css.substring(str[0].trim().length() + 3);
		}
		if (parCss != null) {
			return parCss;
		}
		return css;
	}

	/**
	 * returns the count of Headers in the Div
	 */
	private int getNextEmptyCellIndex() {
		int cellIndex = -1;
		for (int i = 0; i < this.table.length; i++) {
			Element cellValue = (this.table[i])[0];
			if (cellValue == null) {
				cellIndex = i;
				break;
			}
		}
		return cellIndex;
	}

	public int getHeaderNumber(String header, int headerIndex) {
		int foundHeaders = -1, headerNumber = -1;
		if (header.equals("@#@")) {
			return headerNumber;
		}

		// Check Header is given as value or Index
		try {
			// Checking header is Integer
			headerNumber = Integer.parseInt(header);
			return headerNumber;
		} catch (NumberFormatException e) {
			// Don't worry. Carry on life by searching header from table.
		}
		// Searching headerIndex from table
		OpkeyLogger.printSaasLog(_class, this.headerMaxIndex + " this.headerCount");
		outerLoop: for (int i = 0; i <= this.headerMaxIndex; i++) {
			for (int j = 0; j < 1000;) {
				Element cell = table[i][j];
				if ((cell != null)) {
					String cellText = "";
					Elements elements = cell.getAllElements();
					for (Element element : elements) {
						if (element.attr("class").contains("column_label-text")) {
							cellText = cellText + element.text();
						}
					}
					if (cellText.isEmpty() || cellText.equals("")) {
						cellText = cell.text();
					}

					if (cellText.equals(header)) {
						foundHeaders = foundHeaders + 1;
						if (foundHeaders == headerIndex) {
							headerNumber = j;
							break outerLoop;
						}
					}
					j++;
				} else
					break;
			}
		}
		OpkeyLogger.printSaasLog(_class, "TEXT <" + header + "> FOUND AT <" + headerNumber + ">");
		return headerNumber;
	}

	public List<Element> getAllCellsWithText(String text, int colNumber) {
		List<Element> cells = new ArrayList<Element>();
		List<Integer> rows = this.getAllRowIndexWithCellText(text, colNumber);
		for (Integer rowNumber : rows) {
			cells.add(this.table[rowNumber][colNumber]);
		}
		OpkeyLogger.printSaasLog(_class, " cells : " + cells);
		return cells;
	}

	public List<Integer> getAllRowIndexWithCellText(String text, int colNumber) {
		OpkeyLogger.printSaasLog(_class, "TEXT IS AS:::: " + text + " : col no: " + colNumber);
		List<Integer> rows = new ArrayList<Integer>();
		int l = -1;
		OpkeyLogger.printSaasLog(_class, "this.table.length Value Is AS ::" + this.table.length);
		for (int i = 0; i < this.table.length; i++) {
			l += 1;
			if (l == (this.headerMaxIndex)) {
				l = 0;
			}
			Element cell = this.table[i][colNumber];
			if ((cell != null)) {
				String cellText = cell.text();

				System.out.println("cellText is :- " + cellText);

				if (cell.select("input").size() > 0) {
					String inputValue = cell.select("input").attr("value").toLowerCase();
					OpkeyLogger.printSaasLog(_class, "Input Value Is AS ::" + inputValue);
					if (inputValue.equalsIgnoreCase(text)) {
						rows.add(i);
					} else if (cellText.equalsIgnoreCase(text)) {
						rows.add(i);
					}
				} else if (cellText.equalsIgnoreCase(text)) {
					OpkeyLogger.printSaasLog(_class, "  row number:-  " + l);
					rows.add(i);

				} else if (cell.hasAttr("data-th")) {
					System.out.println("inside data-th condition ");
					if (cell.attr("data-th").equalsIgnoreCase(QueryAdapter.header1Value)) {
						if (cellText.contains(text)) {
							OpkeyLogger.printSaasLog(_class, "  row number:-  " + l);
							rows.add(i);

						}
					}

				}
			}
		}

		OpkeyLogger.printSaasLog(_class, "rows Value Is AS ::" + rows);

//		if (false && rows.isEmpty())
//			for (int i = 0; i < this.table.length; i++) {
//				Element cell = this.table[i][colNumber];
//				if (!(cell == null)) {
//					String cellText = cell.text();
//
//					if (cell.select("input").size() > 0) {
//						String inputValue = cell.select("input").attr("value").toLowerCase();
//						OpkeyLogger.printSaasLog(_class, "Input Value Is AS ::" + inputValue);
//						if (inputValue.toLowerCase().contains(text.toLowerCase())) {
//							rows.add(i);
//						} else if (cellText.toLowerCase().contains(text.toLowerCase())) {
//							rows.add(i);
//						}
//					} else if (cellText.toLowerCase().contains(text.toLowerCase())) {
//						rows.add(i);
//					}
//
//				}
//			}

		return rows;
	}

	public int getAllColumnCount() {

		int rowsMaxCount = getHeaderMaxIndex()+1;
		int colCount = 0;

		for (int i = 0; i < rowsMaxCount; i++) {
			int cellCountInRow = Arrays.asList(table[i]).stream().filter(x -> x != null).collect(Collectors.toList())
					.size();
			colCount = colCount < cellCountInRow ? cellCountInRow : colCount;

		}

		return colCount;

	}

	public int getRowsCountInsideTableBody() {
		return Arrays.asList(table).stream().filter(x -> x[0] != null).collect(Collectors.toList()).size()
				- getHeaderMaxIndex();
	}

	public Element getElement(int rowNumber, int colNumber, boolean calledFromKeyword) {
		// printTable();
		int rowIndex = rowNumber;
		if (calledFromKeyword)
			rowIndex = rowNumber + this.headerMaxIndex;
		OpkeyLogger.printSaasLog(_class, "Getting rowNumber " + rowNumber + " headerMaxIndex " + this.headerMaxIndex
				+ " colNumber" + colNumber + " rowIndex" + rowIndex);
		OpkeyLogger.printSaasLog(_class, this.table.length);
//		try {
//			OpkeyLogger.printSaasLog(_class, "cell is :- " + this.table[rowIndex][colNumber].outerHtml());
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			System.out.println("Testing ");
//		}
        // System.out.println("cell is--------------------------- :- " + this.table[rowIndex][colNumber].outerHtml());
		for(int i=0;i<=5;i++) {
			for(int j=0;j<11;j++) {
				System.out.println("Table Cell "+" i "+i +" j "+j+ " cell "+this.table[i][j]);
			}
			
		}
		if(this.table[rowIndex][colNumber]==null) {
			if(this.table[3][2]!=null) {
				return this.table[3][2];
			}else {
				return this.table[3][3];
			}
			
			
		}
		
		return this.table[rowIndex][colNumber];
	}

	public String getTableHeadersName(String delimiter) {
		if(getHeaderMaxIndex()==0)
		{
			return Arrays.asList(table[getHeaderMaxIndex()]).stream().filter(cell -> cell != null)
					.map(cell -> cell.text()).collect(Collectors.joining(delimiter));
		}
		return Arrays.asList(table[getHeaderMaxIndex()-1]).stream().filter(cell -> cell != null)
				.map(cell -> cell.text()).collect(Collectors.joining(delimiter));
	}

	public Element[][] getTable() {
		return table;
	}

	private String validateCSS(String css) {
		try {
			String[] str = css.split(">");
			String parCss = null;
			if (str[0].trim().equalsIgnoreCase("html")) {
				parCss = css.substring(14);
				if (str[2].trim().contains("table")) {
					parCss = css.substring(14 + str[2].trim().length() + 3);
				}
			}
			if (str[0].trim().contains("table")) {
				parCss = css.substring(str[0].trim().length() + 3);
			}
			if (parCss != null) {
				return parCss;
			}
			return css;
		} catch (Exception e) {
			return css;
		}
	}

	public void printTable() {
		OpkeyLogger.printSaasLog(_class, this.headerMaxIndex + " this.headerCount");
		try {
			for (int i = 0; i < 100; i++) {
				// System.out.print("[" + i + "]\t");
				for (int j = 0; j < table[i].length; j++) {
					try {
						Element element = table[i][j];
						System.out
								.print(element.text() + " " + getString(element.cssSelector()) + " [" + j + "]\t\t\t");
						// System.out.print(table[i][j].text() + "[" + j +
						// "]\t\t\t");
						// String xpath = "//body/" + createXpath(table[i][j]);
						// System.out.print(table[i][j].text() + " " + xpath + "[" +
						// j + "]\t\t\t");
					} catch (NullPointerException e) {
						if (j == 0) {
							break;
						}
					}
				}
				System.out.println();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
