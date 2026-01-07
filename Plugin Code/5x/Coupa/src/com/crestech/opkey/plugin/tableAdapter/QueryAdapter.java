package com.crestech.opkey.plugin.tableAdapter;

import java.util.ArrayList;
import java.util.List;

import org.jsoup.nodes.Element;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.keywords.Utility;
import com.crestech.opkey.plugin.keywords.WebObject;
import com.crestech.opkey.plugin.webdriver.OpkeyLogger;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ObjectNotFoundException;

public class QueryAdapter {
	static Class<WebObject> _class = WebObject.class;

	private String cellName;
	private int cellNumber;
	private String header1, header2, header3, header4, header5;
	private String value1, value2, value3, value4, value5;
	private int header1Index = 0, header2Index = 0, header3Index = 0, header4Index = 0, header5Index = 0;
	public static String header1Value;
	// private Document div;
	private TableAdpater tableAdapter;
	private WebElement mainDiv;

	public QueryAdapter(WebElement div, String cellName, String header1, String value1, String header2, String value2,
			String header3, String value3, String header4, String value4, String header5, String value5)
			throws ArgumentDataInvalidException, ObjectNotFoundException {
		this.mainDiv = div;
		int staticIndex = 0;
		this.tableAdapter = new TableAdpater(div);
		// this.div = div;
		this.cellName = cellName;
		OpkeyLogger.printSaasLog(_class, String.valueOf(this.cellName) + "    this.cellName");
		this.cellNumber = this.tableAdapter.getHeaderNumber(this.cellName, staticIndex);
		OpkeyLogger.printSaasLog(_class, String.valueOf(this.cellNumber) + "  this.cellNumber");

		this.header1 = getTrimmedData(header1);
		this.header2 = getTrimmedData(header2);
		this.header3 = getTrimmedData(header3);
		this.header4 = getTrimmedData(header4);
		this.header5 = getTrimmedData(header5);
		OpkeyLogger.printSaasLog(_class, String.valueOf(this.header1) + "    this.header1");
		header1Value = String.valueOf(this.header1);
		this.value1 = getTrimmedData(value1);
		this.value2 = getTrimmedData(value2);
		this.value3 = getTrimmedData(value3);
		this.value4 = getTrimmedData(value4);
		this.value5 = getTrimmedData(value5);
		OpkeyLogger.printSaasLog(_class, String.valueOf(this.value1) + "    this.value1");
		this.header1Index = this.tableAdapter.getHeaderNumber(this.header1, staticIndex);
		this.header2Index = this.tableAdapter.getHeaderNumber(this.header2, staticIndex);
		this.header3Index = this.tableAdapter.getHeaderNumber(this.header3, staticIndex);
		this.header4Index = this.tableAdapter.getHeaderNumber(this.header4, staticIndex);
		this.header5Index = this.tableAdapter.getHeaderNumber(this.header5, staticIndex);
		if (this.cellNumber < 0) {
			OpkeyLogger.printSaasLog(_class, "Column Name Not Found. Invalid<" + this.cellName + "> ");
			String message = "Column Name Not Found. Invalid<" + this.cellName + "> ";
			throw new ArgumentDataInvalidException(message);
		}
	}

	private String getTrimmedData(String text) {
		if (text == null || text.isEmpty()) {
			text = "@#@";
		} else {
			text = text.trim();
		}
		return text;
	}

	public List<WebElement> findElements() throws ObjectNotFoundException {
		List<WebElement> webElements = new ArrayList<WebElement>();
		List<Element> cells = findCells();
		for (Element cell : cells) {
			webElements.addAll(this.mainDiv.findElements(By.cssSelector(Utility.validateCSS(cell.cssSelector()))));
		}
		return webElements;
	}

	public List<Element> findCells() throws ObjectNotFoundException {

		List<Integer> rows = findAllElementsWithValueAndHeaderIndex();
		List<Element> cells = new ArrayList<Element>();

		System.out.println("rows :::" + rows);
		System.out.println("cells :::" + cells);

		for (Integer rowNumber : rows) {

			Element cell = this.tableAdapter.getElement(rowNumber, this.cellNumber, false);
			cells.add(cell);
		}

		System.out.println(">>Total Cell Size " + cells.size());
		return cells;
	}

	public List<Integer> getAllRowsByQuery() throws ObjectNotFoundException {
		List<Integer> rows = findAllElementsWithValueAndHeaderIndex();
		return rows;
	}

	private List<Integer> findAllElementsWithValueAndHeaderIndex() throws ObjectNotFoundException {
		System.out.println(this.value1 + " " + this.header1Index);
		List<Integer> list1 = findAllElementsWithTextInColumn(this.value1, this.header1Index);

		if (list1.size() < 0) {
			String message = "No value <" + this.value1 + "> found in Column <" + this.header1 + ">";
			throw new ObjectNotFoundException(message);
		}
		List<Integer> list2 = findAllElementsWithTextInColumn(this.value2, this.header2Index);
		List<Integer> list3 = findAllElementsWithTextInColumn(this.value3, this.header3Index);
		List<Integer> list4 = findAllElementsWithTextInColumn(this.value4, this.header4Index);
		List<Integer> list5 = findAllElementsWithTextInColumn(this.value5, this.header5Index);

		return interSection(list1, list2, list3, list4, list5);
	}

	private List<Integer> findAllElementsWithTextInColumn(String text, int colNumber) {
		List<Integer> cells = new ArrayList<Integer>();
		if (colNumber >= 0) {
			cells.addAll(this.tableAdapter.getAllRowIndexWithCellText(text, colNumber));
		}
		System.out.println(cells.size() + " Cells Size");
		return cells;
	}

	private List<Integer> interSection(List<Integer> list1, List<Integer> list2, List<Integer> list3,
			List<Integer> list4, List<Integer> list5) {
		List<Integer> interSectionList = new ArrayList<Integer>();
		interSectionList.addAll(list1);
		if (list2.size() > 0)
			interSectionList.retainAll(list2);
		if (list3.size() > 0)
			interSectionList.retainAll(list3);
		if (list4.size() > 0)
			interSectionList.retainAll(list4);
		if (list5.size() > 0)
			interSectionList.retainAll(list5);

		return interSectionList;

	}

	public void printAllElements() {
		this.tableAdapter.printTable();
	}

}
