package com.plugin.appium.keywords.GenericKeyword.modTableAdapter;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.By.ByTagName;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

public class WebTableAdapter {

	private String html = "";
	private List<WebRowAdapter> myRows = new ArrayList<WebRowAdapter>();
	private Document source = null;
	private WebElement table;

	public WebTableAdapter(WebElement tbl) throws ObjectNotFoundException {
		this.table = tbl;
		html = tbl.getAttribute("outerHTML");
		source = Jsoup.parse(html, "UTF-8");
		List<Element> trList = source.select("tr");
		Log.print("LIST COUNT IS AS :::--- " + trList.size());
		for (int j = 0; j < trList.size(); j++) {
			myRows.add(new WebRowAdapter(trList.get(j), this));
			if (trList.get(j).select("tr").size() > 1) {
				j = j + (trList.get(j).select("tr").size() - 1);
			}
		}

		if (myRows.isEmpty())
			throw new ObjectNotFoundException("Table doesn't contain any data");

		new TablePrinter(this);
	}

	public int getRowCount() {
		return myRows.size();
	}

	public List<WebRowAdapter> getRows() {
		return myRows;
	}

	public int getColumnCount(int rowIndex) {
		return myRows.get(rowIndex).getCellCount();
	}

	public String getCellData(int rowIndex, int colIndex) {
		Element cell = null;
		String getText = null;
		try {
			cell = myRows.get(rowIndex).getCells().get(colIndex);
			// getText = getInnerElementText(cell);
			if (getText == null || getText.isEmpty() || getText == "") {
				getText = cell.text();
			}
			// Log.print("CELL TEXT IS AS 1::::: " + getText);
			if (getText == null || getText.isEmpty() || getText == "") {
				getText = cell.attr("value");
			}
			// Log.print("CELL TEXT IS AS 2::::: " + getText);
			if (getText == null || getText.isEmpty() || getText == "") {
				getText = getInnerElementText(cell);
			}
			// Log.print("CELL TEXT IS AS 3::::: " + getText);
			getText = Utils.removeSpecialCharacter(getText);

			// Log.print("CELL TEXT IS AS 4::::: " + getText);
		} catch (Exception e) {
		}
		if (getText == null)
			return "";
		// Log.print("CELL TEXT IS AS 5::::: " + getText);
		return getText.trim();
	}

	public int[] getRowColumnNumber(String text) {
		String cellData;
		for (int row = 0; row <= getRowCount(); row++) {
			for (int col = 0; col < getColumnCount(row); col += 1) {
				cellData = getCellData(row, col);
				if (cellData.contains(text)) {
					Log.print("row to return is:-->" + row + " Column to be returned is:-->" + col);
					return new int[] { row, col };
				}
			}
		}
		return null;

	}

	private static ArrayList<String> getClassNameToIgnore() {
		Properties prop = new Properties();
		InputStream input = null;
		ArrayList<String> hiddenClassList = new ArrayList<String>();
		try {
			input = new FileInputStream(Context.session().getDefaultPluginLocation() + "\\web.properties");
			prop.load(input);
			String hiddenClass = prop.getProperty("class");
			Log.print("Auto find Class to Hide AS::::::::" + hiddenClass);
			String[] list = hiddenClass.split(";");
			for (String string : list) {
				hiddenClassList.add(string);
			}
			return hiddenClassList;
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			if (input != null) {
				try {
					input.close();
				} catch (IOException e) {
					System.out.println("Exception while getClassNameToIgnore: " + e.getMessage());
					//e.printStackTrace();
				}
			}
		}
		return new ArrayList<String>();
	}

	public String getCellDataGeneric(int rowIndex, int colIndex) {

		Element cell = null;
		String getText = null;
		if (getClassNameToIgnore().size() > 1) {
			try {
				ArrayList<String> classToIgnore = getClassNameToIgnore();
				cell = myRows.get(rowIndex).getCells().get(colIndex);
				Elements nonvisibleElement = null;
				for (String string : classToIgnore) {
					nonvisibleElement = cell.getElementsByClass(string);
				}
				// nonvisibleElement.addAll(cell.getElementsByClass("slds-assistive-text"));
				String source = cell.toString();
				for (Element element : nonvisibleElement) {
					source = source.replace(element.toString(), "");
				}
				Document sourceHtml = Jsoup.parse(source);
				cell = sourceHtml.select("body").get(0);
				// getText = getInnerElementText(cell);
				if (getText == null || getText.isEmpty() || getText == "") {
					getText = cell.text();
				}
				// Log.print("CELL TEXT IS AS 1::::: "+getText);
				if (getText == null || getText.isEmpty() || getText == "") {
					getText = cell.attr("value");
				}
				getText = Utils.removeSpecialCharacter(getText);
			} catch (Exception e) {
			}
		}
		if (getText == null)
			return "";
		// Log.print("CELL TEXT IS AS 2::::: "+getText);
		return getText;
	}

	private String getInnerElementText(Element cell) {
		Elements elements = cell.getAllElements();
		String output = "";
		ArrayList<String> list = new ArrayList<String>();
		for (Element element : elements) {
			String getText = null;
			// String getText = element.text();
			if (getText == null || getText.isEmpty() || getText == "") {
				getText = element.attr("value");
			}
			if (!(getText == null || getText.isEmpty() || getText == "")) {
				if (list.size() == 0) {
					list.add(getText);
				} else if (!(list.get(list.size() - 1).equals(getText)))
					list.add(getText);
			}
		}
		for (String string : list) {
			output = output + string + "";
		}
		return output;
	}

	public int childItemCount(int rowNumber, int colNumber, String objectTag) {
		Element cell = myRows.get(rowNumber).getCells().get(colNumber);
		// Log.print(myRows.get(rowNumber).getCells());
		List<Element> childObject = null;
		if (objectTag.isEmpty() || objectTag.toLowerCase().contentEquals("")) {
			Log.print("NO TAG FOUND");
			return 1;
		} else {
			childObject = cell.select(objectTag);
		}
		return childObject.size();
	}

	public Element childItem(int rowNumber, int colNumber, String objectTag, int objectAtIndex) {
		Element cell = myRows.get(rowNumber).getCells().get(colNumber);
		if (objectTag.toLowerCase().contentEquals("") || objectTag.isEmpty()) {
			return cell;
		}
		Element childObject = cell.select(objectTag).get(objectAtIndex);
		return childObject;
	}

	public WebElement childItem(WebElement table, int rowNumber, int colNumber, String objectTag, int objectAtIndex) throws ToolNotSetException, InterruptedException {
		String cellXpath = "(./*[self::thead or self::tbody or self::tfoot]/tr)[" + (rowNumber + 1) + "]/*[self::th or self::td]";
		List<WebElement> cells = table.findElements(By.xpath(cellXpath));
		WebElement cellElement = cells.get(colNumber);
		if (objectTag.toLowerCase().contentEquals("") || objectTag.isEmpty()) {
			new Utils().scrollMid(cellElement);
			return cellElement;
		}
		List<WebElement> element = cellElement.findElements(ByTagName.tagName(objectTag));
		new Utils().scrollMid(element.get(objectAtIndex));
		return element.get(objectAtIndex);
	}

	public List<String> getHeaderValues() throws ObjectNotFoundException {
		List<WebElement> tables = this.table.findElements(By.tagName("table"));
		for (int i = 0; i < tables.size(); i++)
			System.out.println("####" + tables.get(i).getAttribute("class"));
		WebTableAdapter headerTable = new WebTableAdapter(tables.get(0));
		int colCount = headerTable.getColumnCount(0);
		List<String> value = new ArrayList<String>();
		for (int i = 0; i < colCount; i++) {
			value.add(headerTable.getCellData(0, i));
		}
		return value;
	}

	public int getHeaderNumber(String header) throws ObjectNotFoundException {
		System.out.println("In Adapter of WebTable.......**************");
		System.out.println("header provided is:--" + header);
		List<String> list = getHeaderValues();
		System.out.println("list of column header is:--" + list);
		// int count = -1;
		int count = -1;
		for (String listElement : list) {
			count += 1;
			System.out.println("index of list element " + listElement + " is:-->" + count);
			if (listElement.contentEquals(header)) {
				break;
			}
		}

		return count;
	}

	public WebElement Workday_childItem(WebElement table, int rowNumber, int colNumber, String objectTag, int objectAtIndex) throws ToolNotSetException, InterruptedException {

		String cellXpath = "((.//*[self::thead or self::tbody or self::tfoot]/tr[not(@data-automation-id='ghostRow' and  starts-with(@class,'W'))])[" + (rowNumber + 1) + "]/*[self::th or self::td])["
				+ (colNumber + 1) + "]";
		Log.print("Xpath obtained in WD:-->" + cellXpath);
		Log.print("table obtained is:-->" + table.toString());
		List<WebElement> cells = table.findElements(By.xpath(cellXpath));
		Log.print("cell obtained is:-->" + cells.toString());
		WebElement cellElement = cells.get(0);
		if (objectTag.toLowerCase().contentEquals("") || objectTag.isEmpty()) {
			// Utils.Method_bringObjectInViewArea(cellElement);
			Log.print("elemetn to be returned is:--" + cellElement);
			return cellElement;
		}
		List<WebElement> element = cellElement.findElements(ByTagName.tagName(objectTag));
		new Utils().scrollMid(element.get(objectAtIndex));
		return element.get(objectAtIndex);
	}

	private String getTrimmedData(String text) {
		if (text.isEmpty()) {
			text = "@#@";
		} else {
			text = text.trim();
		}
		return text;
	}

	public List<WebElement> getElementByQuery(WebElement table, String cellName, String header1, String value1, String header2, String value2, String header3, String value3, String header4,
			String value4, String header5, String value5, boolean isSalesForce) {
		return getElementByQuery(table, cellName, 0, header1, value1, header2, value2, header3, value3, header4, value4, header5, value5, isSalesForce);
	}

	public List<WebElement> getElementByQuery(WebElement table, String cellName, int headerIndex, String header1, String value1, String header2, String value2, String header3, String value3,
			String header4, String value4, String header5, String value5, boolean isSalesForce) {
		// Get CellNumber on Which Action is to Perform
		header1 = getTrimmedData(header1);
		value1 = getTrimmedData(value1);

		header2 = getTrimmedData(header2);
		value2 = getTrimmedData(value2);

		header3 = getTrimmedData(header3);
		value3 = getTrimmedData(value3);

		header4 = getTrimmedData(header4);
		value4 = getTrimmedData(value4);

		header5 = getTrimmedData(header5);
		value5 = getTrimmedData(value5);

		cellName = getTrimmedData(cellName);

		int cellNumber = -1;
		int colCount = getColumnCount(headerIndex);
		// Log.print("Header Col Count "+colCount);
		int colID1 = -1, colID2 = -1, colID3 = -1, colID4 = -1, colID5 = -1;
		if (isSalesForce) {
			for (int i = 0; i < colCount; i++) {
				Log.print("****************** " + getCellDataForSalesForce(0, i));
				if (getCellDataForSalesForce(0, i).equalsIgnoreCase(header1)) {
					Log.print(header1 + "  " + colID1 + "  " + i);
					colID1 = i;
				} else if (getCellDataForSalesForce(0, i).equalsIgnoreCase(header2)) {
					Log.print(header2 + colID2 + "  " + i);
					colID2 = i;
				} else if (getCellDataForSalesForce(0, i).equalsIgnoreCase(header3)) {
					Log.print(header3 + colID3 + "  " + i);
					colID3 = i;
				} else if (getCellDataForSalesForce(0, i).equalsIgnoreCase(header4)) {
					Log.print(header4 + colID4 + "  " + i);
					colID4 = i;
				} else if (getCellDataForSalesForce(0, i).equalsIgnoreCase(header5)) {
					Log.print(header5 + colID5 + "  " + i);
					colID5 = i;
				}
				if (isInteger(cellName)) {
					cellNumber = Integer.parseInt(cellName);
				} else {
					if (getCellDataForSalesForce(0, i).equalsIgnoreCase(cellName)) {
						cellNumber = i;
					}
				}
			}
		} else {
			for (int i = 0; i < colCount; i++) {
				if (getCellData(headerIndex, i).equals(header1)) {
					Log.print(header1 + " " + colID1 + "  " + i);
					colID1 = i;
				} else if (getCellData(headerIndex, i).equals(header2)) {
					Log.print(header2 + colID2 + "  " + i);
					colID2 = i;
				} else if (getCellData(headerIndex, i).equals(header3)) {
					Log.print(header3 + colID3 + "  " + i);
					colID3 = i;
				} else if (getCellData(headerIndex, i).equals(header4)) {
					Log.print(header4 + colID4 + "  " + i);
					colID4 = i;
				} else if (getCellData(headerIndex, i).equals(header5)) {
					Log.print(header5 + colID5 + "  " + i);
					colID5 = i;
				}
				if (isInteger(cellName)) {
					cellNumber = Integer.parseInt(cellName);
				} else {
					if (getCellData(headerIndex, i).equals(cellName)) {
						cellNumber = i;
					}
				}
			}
		}
		// Log.print("colID1= "+colID1);
		// Log.print("colID2= "+colID2);
		// Log.print("colID3= "+colID3);
		// Log.print("colID4= "+colID4);
		// Log.print("colID5= "+colID5);
		// Log.print("cellNumber= "+cellNumber);

		ArrayList<Integer> list1 = new ArrayList<Integer>();
		ArrayList<Integer> list2 = new ArrayList<Integer>();
		ArrayList<Integer> list3 = new ArrayList<Integer>();
		ArrayList<Integer> list4 = new ArrayList<Integer>();
		ArrayList<Integer> list5 = new ArrayList<Integer>();
		int rowCount = getRowCount();

		if (isSalesForce) {
			for (int i = 0; i < rowCount; i++) {

				/*- Log.debug("## ROW" + i + " ##");*/

				/*- Log.debug("colID1 : <" + colID1 + ">  ,  DomValue : <" + Utils.allignText(getCellDataForSalesForce(i, colID1) + ">  ,  GivenValue1 : <" + Utils.allignText(value1)) + ">");*/
				if ((colID1 >= 0 && Utils.allignText(getCellDataForSalesForce(i, colID1)).equalsIgnoreCase(Utils.allignText(value1)))) {
					list1.add(i);
				}
				/*- Log.debug("colID2 : <" + colID2 + ">  ,  DomValue2 : <" + Utils.allignText(getCellDataForSalesForce(i, colID2) + ">  ,  GivenValue2 : <" + Utils.allignText(value2)) + ">");*/
				if ((colID2 >= 0 && Utils.allignText(getCellDataForSalesForce(i, colID2)).equalsIgnoreCase(Utils.allignText(value2)))) {
					list2.add(i);
				}
				/*- Log.debug("colID3 : <" + colID3 + ">  ,  DomValue3 : <" + Utils.allignText(getCellDataForSalesForce(i, colID3) + ">  ,  GivenValue3 : <" + Utils.allignText(value3)) + ">");*/
				if ((colID3 >= 0 && Utils.allignText(getCellDataForSalesForce(i, colID3)).equalsIgnoreCase(Utils.allignText(value3)))) {
					list3.add(i);
				}
				/*- Log.debug("colID4 : <" + colID4 + ">  ,  DomValue4 : <" + Utils.allignText(getCellDataForSalesForce(i, colID4) + ">  ,  GivenValue4 : <" + Utils.allignText(value4)) + ">");*/
				if ((colID4 >= 0 && Utils.allignText(getCellDataForSalesForce(i, colID4)).equalsIgnoreCase(Utils.allignText(value4)))) {
					list4.add(i);
				}
				/*- Log.debug("colID5 : <" + colID5 + ">  ,  DomValue5 : <" + Utils.allignText(getCellDataForSalesForce(i, colID5) + ">  ,  GivenValue5 : <" + Utils.allignText(value5)) + ">");*/
				if ((colID5 >= 0 && Utils.allignText(getCellDataForSalesForce(i, colID5)).equalsIgnoreCase(Utils.allignText(value5)))) {
					list5.add(i);
				}
			}
		} else {
			for (int i = 0; i < rowCount; i++) {
				// Log.print(Utils.allignText(getCellData(i, colID1)) +
				// "
				// <> " + Utils.allignText(value1));
				if ((colID1 >= 0 && Utils.allignText(getCellData(i, colID1)).equals(Utils.allignText(value1)))) {
					list1.add(i);
				}
				if ((colID2 >= 0 && Utils.allignText(getCellData(i, colID2)).equals(Utils.allignText(value2)))) {
					list2.add(i);
				}
				if ((colID3 >= 0 && Utils.allignText(getCellData(i, colID3)).equals(Utils.allignText(value3)))) {
					list3.add(i);
				}
				if ((colID4 >= 0 && Utils.allignText(getCellData(i, colID4)).equals(Utils.allignText(value4)))) {
					list4.add(i);
				}
				if ((colID5 >= 0 && Utils.allignText(getCellData(i, colID5)).equals(Utils.allignText(value5)))) {
					list5.add(i);
				}
			}
		}

		if (isSalesForce)
			return makeXpathAndFindElements_Salesforce(list1, header1, value1, list2, header2, value2, list3, header3, value3, list4, header4, value4, list5, header5, value5, cellNumber);
		else
			return makeXpathAndFindElements(list1, header1, value1, list2, header2, value2, list3, header3, value3, list4, header4, value4, list5, header5, value5, cellNumber);

	}

	private List<WebElement> makeXpathAndFindElements(ArrayList<Integer> list1, String header1, String value1, ArrayList<Integer> list2, String header2, String value2, ArrayList<Integer> list3,
			String header3, String value3, ArrayList<Integer> list4, String header4, String value4, ArrayList<Integer> list5, String header5, String value5, int cellNumber) {
		String xpath = null;
		if (list1.size() >= 1 && checkArrayListHasOneElement(list2, header2, value2, list3, header3, value3, list4, header4, value4, list5, header5, value5)) {
			Log.print("::::::::::::::::::::: 1");
			xpath = "((.//*[self::thead or self::tbody or self::tfoot]/tr)[" + (list1.get(0) + 1) + "]/*[self::th or self::td])[" + (cellNumber + 1) + "]";
		} else if (list2.size() >= 1 && checkArrayListHasOneElement(list1, header1, value1, list3, header3, value3, list4, header4, value4, list5, header5, value5)) {
			Log.print("::::::::::::::::::::: 2");
			xpath = "((.//*[self::thead or self::tbody or self::tfoot]/tr)[" + (list2.get(0) + 1) + "]/*[self::th or self::td])[" + (cellNumber + 1) + "]";
		} else if (list3.size() >= 1 && checkArrayListHasOneElement(list2, header2, value2, list1, header1, value1, list4, header4, value4, list5, header5, value5)) {
			Log.print("::::::::::::::::::::: 3");
			xpath = "((.//*[self::thead or self::tbody or self::tfoot]/tr)[" + (list3.get(0) + 1) + "]/*[self::th or self::td])[" + (cellNumber + 1) + "]";
		} else if (list4.size() >= 1 && checkArrayListHasOneElement(list2, header2, value2, list3, header3, value3, list1, header1, value1, list5, header5, value5)) {
			Log.print("::::::::::::::::::::: 4");
			xpath = "((.//*[self::thead or self::tbody or self::tfoot]/tr)[" + (list4.get(0) + 1) + "]/*[self::th or self::td])[" + (cellNumber + 1) + "]";
		} else if (list5.size() >= 1 && checkArrayListHasOneElement(list2, header2, value2, list3, header3, value3, list4, header4, value4, list1, header1, value1)) {
			Log.print("::::::::::::::::::::: 5");
			xpath = "((.//*[self::thead or self::tbody or self::tfoot]/tr)[" + (list5.get(0) + 1) + "]/*[self::th or self::td])[" + (cellNumber + 1) + "]";
		}

		Log.print("XPATH IS AS ::::::: " + xpath);
		List<WebElement> element = new ArrayList<WebElement>();
		if (xpath == null) {
			ArrayList<Integer> result = WebTableAdapter.intersection(list1, header1, list2, header2, list3, header3, list4, header4, list5, header5);

			for (int i = 0; i < result.size(); i++) {

				xpath = "((.//*[self::thead or self::tbody or self::tfoot]/tr)[" + (result.get(i) + 1) + "]/*[self::th or self::td])[" + (cellNumber + 1) + "]";
				List<WebElement> eles = table.findElements(By.xpath(xpath));

				element.addAll(eles);
			}
		} else {
			element.addAll(table.findElements(By.xpath(xpath)));
		}
		Log.print("XPATH IS AS :: " + xpath);
		return element;
	}

	private List<WebElement> makeXpathAndFindElements_Salesforce(ArrayList<Integer> list1, String header1, String value1, ArrayList<Integer> list2, String header2, String value2,
			ArrayList<Integer> list3, String header3, String value3, ArrayList<Integer> list4, String header4, String value4, ArrayList<Integer> list5, String header5, String value5, int cellNumber) {
		String xpath = null;
		if (list1.size() >= 1 && checkArrayListHasOneElement(list2, header2, value2, list3, header3, value3, list4, header4, value4, list5, header5, value5)) {
			Log.print("::::::::::::::::::::: 1");
			xpath = "((.//*[self::thead or self::tbody or self::tfoot]/tr)[" + (list1.get(0) + 1) + "]/*[self::th or self::td])[" + (cellNumber + 1) + "]";
		} else if (list2.size() >= 1 && checkArrayListHasOneElement(list1, header1, value1, list3, header3, value3, list4, header4, value4, list5, header5, value5)) {
			Log.print("::::::::::::::::::::: 2");
			xpath = "((.//*[self::thead or self::tbody or self::tfoot]/tr)[" + (list2.get(0) + 1) + "]/*[self::th or self::td])[" + (cellNumber + 1) + "]";
		} else if (list3.size() >= 1 && checkArrayListHasOneElement(list2, header2, value2, list1, header1, value1, list4, header4, value4, list5, header5, value5)) {
			Log.print("::::::::::::::::::::: 3");
			xpath = "((.//*[self::thead or self::tbody or self::tfoot]/tr)[" + (list3.get(0) + 1) + "]/*[self::th or self::td])[" + (cellNumber + 1) + "]";
		} else if (list4.size() >= 1 && checkArrayListHasOneElement(list2, header2, value2, list3, header3, value3, list1, header1, value1, list5, header5, value5)) {
			Log.print("::::::::::::::::::::: 4");
			xpath = "((.//*[self::thead or self::tbody or self::tfoot]/tr)[" + (list4.get(0) + 1) + "]/*[self::th or self::td])[" + (cellNumber + 1) + "]";
		} else if (list5.size() >= 1 && checkArrayListHasOneElement(list2, header2, value2, list3, header3, value3, list4, header4, value4, list1, header1, value1)) {
			Log.print("::::::::::::::::::::: 5");
			xpath = "((.//*[self::thead or self::tbody or self::tfoot]/tr)[" + (list5.get(0) + 1) + "]/*[self::th or self::td])[" + (cellNumber + 1) + "]";
		}

		Log.print("XPATH IS AS ::::::: " + xpath);
		List<WebElement> element = new ArrayList<WebElement>();
		if (xpath == null) {
			ArrayList<Integer> result = WebTableAdapter.intersection(list1, list2, list3, list4, list5);

			for (int i = 0; i < result.size(); i++) {

				xpath = "((.//*[self::thead or self::tbody or self::tfoot]/tr)[" + (result.get(i) + 1) + "]/*[self::th or self::td])[" + (cellNumber + 1) + "]";
				element.addAll(table.findElements(By.xpath(xpath)));
			}
		} else {
			element.addAll(table.findElements(By.xpath(xpath)));
		}
		Log.print("XPATH IS AS :: " + xpath);
		return element;
	}

	private boolean checkArrayListHasOneElement(List<Integer> list1, String header1, String value1, List<Integer> list2, String header2, String value2, List<Integer> list3, String header3,
			String value3, List<Integer> list4, String header4, String value4) {
		/*
		 * if (!header1.equals("@#@") || !header2.equals("@#@") ||
		 * !header3.equals("@#@") || !header4.equals("@#@")) { if (!value1.equals("@#@")
		 * && !value2.equals("@#@") && !value3.equals("@#@") && !value4.equals("@#@")) {
		 * // if (list1.size() >= 1 || list2.size() >= 1 || list3.size() >= 1 ||
		 * list4.size() >= 1) { return false; // } } }
		 */

		ArrayList<String> headers = new ArrayList<String>();
		headers.add(header1);
		headers.add(header2);
		headers.add(header3);
		headers.add(header4);
		ArrayList<String> values = new ArrayList<String>();
		values.add(value1);
		values.add(value2);
		values.add(value3);
		values.add(value4);

		boolean flag = true;

		for (int i = 0; i < headers.size(); i++) {
			if (!headers.get(i).equals("@#@")) {
				if (!values.get(i).equals("@#@")) {
					flag = false;
				}
				flag = false;
			}
		}

		/*
		 * if (list1.size() >= 1 || list2.size() >= 1 || list3.size() >= 1 ||
		 * list4.size() >= 1) { return false; }
		 */
		return flag;
	}

	private static ArrayList<Integer> intersection(List<Integer> list1, String header1, List<Integer> list2, String header2, List<Integer> list3, String header3, List<Integer> list4, String header4,
			List<Integer> list5, String header5) {

		ArrayList<Integer> result = new ArrayList<Integer>(list1);

		if (list2.size() != 0 || header2 != "@#@")
			result.retainAll(list2);

		if (list3.size() != 0 || header3 != "@#@")
			result.retainAll(list3);

		if (list4.size() != 0 || header4 != "@#@")
			result.retainAll(list4);

		if (list5.size() != 0 || header5 != "@#@")
			result.retainAll(list5);

		return result;
	}

	private static ArrayList<Integer> intersection(List<Integer> list1, List<Integer> list2, List<Integer> list3, List<Integer> list4, List<Integer> list5) {

		ArrayList<Integer> result = new ArrayList<Integer>(list1);

		if (list2.size() != 0)
			result.retainAll(list2);

		if (list3.size() != 0)
			result.retainAll(list3);

		if (list4.size() != 0)
			result.retainAll(list4);

		if (list5.size() != 0)
			result.retainAll(list5);

		return result;
	}

	/*
	 * private static boolean checkArrayListHasOneElement(ArrayList<Integer> list1,
	 * ArrayList<Integer> list2, ArrayList<Integer> list3, ArrayList<Integer> list4)
	 * { if (list1.size() >= 1 || list2.size() >= 1 || list3.size() >= 1 ||
	 * list4.size() >= 1) { return false; } return true; }
	 */

	public static boolean isInteger(String s) {
		try {
			Integer.parseInt(s);
		} catch (NumberFormatException e) {
			return false;
		} catch (NullPointerException e) {
			return false;
		}
		return true;
	}

	private String getWebelementType(Element we) {

		String elementType = we.tagName();
		if (elementType == null) {
			elementType = we.attr("type");
		}
		return elementType;
	}

	private int getMaxColInTable() {

		int maximumColInTable = 0;
		int colInCurrentRow;

		for (int rowInd = 0; rowInd < myRows.size(); rowInd++) {

			colInCurrentRow = getColumnCount(rowInd);
			if (colInCurrentRow > maximumColInTable) {
				maximumColInTable = colInCurrentRow;
			}
		}
		// Log.print(" maxmium column in table:: " +
		// maximumColInTable);
		return maximumColInTable;
	}

	// **************************Sales Force Specific
	// Patterns****************************
	public String getCellDataForSalesForce(int rowIndex, int colIndex) {
		Element cell = null;
		String getText = null;
		try {
			cell = myRows.get(rowIndex).getCells().get(colIndex);

			getText = getCellDataForSalesForce(cell);

		} catch (Exception e) {
		}
		if (getText == null)
			return "";
		return getText;
	}

	private boolean isCellHidden(Element cell) {
		boolean isCellHidden = false;

		if (cell == null)
			return false;

		// Log.debug("TH : " + cell.outerHtml());
		// Log.debug("Has style : " + cell.hasAttr("style"));
		if (cell.hasAttr("style")) {
			String style = cell.attr("style");
			System.out.println("Style : " + style);

			style = style.trim();

			for (String s : style.split(";")) {
				// System.out.println("# " + s);
				if (s.toLowerCase().contains("display") && s.toLowerCase().contains(":") && s.toLowerCase().contains("none")) {
					isCellHidden = true;
				}
			}
		}

		Log.debug("isCellHidden : " + isCellHidden);
		return isCellHidden;
	}

	public String getCellDataForSalesForce(Element cell) {
		String getText = null;
		try {
			Elements nonvisibleElement = cell.getElementsByClass("assistiveText");
			nonvisibleElement.addAll(cell.getElementsByClass("slds-assistive-text"));
			String source = cell.toString();

			Elements allElements = cell.getAllElements();
			for (Element element : allElements) {
				
				if (element.attr("style").contains("display:none") || isCellHidden(element) || element.attr("class").equals("modal fade")) {
					nonvisibleElement.add(element);
				}
			}

			/*-for (Element element : nonvisibleElement) {
				source = source.replace(element.toString(), "");
			}*/

			for (Element element : nonvisibleElement) {
				element.remove();
			}

			source = cell.toString();


			Document sourceHtml = Jsoup.parse(source);
			cell = sourceHtml.select("body").get(0);
			// getText = getInnerElementText(cell);
			if (getText == null || getText.isEmpty() || getText == "") {
				getText = cell.text();
			}
			// Log.print("CELL TEXT IS AS 1::::: "+getText);
			if (getText == null || getText.isEmpty() || getText == "") {
				getText = cell.attr("value");
			}

			/*- commenting for bug - SAS-18176 (not able to click cell text '₢⦿͡ ˒̫̮ ⦿͡ꀣ')
			getText = Utils.removeSpecialCharacter(getText);*/
		} catch (Exception e) {
		}
		if (getText == null)
			return "";
		// Log.print("CELL TEXT IS AS 2::::: "+getText);
		return getText;
	}

}