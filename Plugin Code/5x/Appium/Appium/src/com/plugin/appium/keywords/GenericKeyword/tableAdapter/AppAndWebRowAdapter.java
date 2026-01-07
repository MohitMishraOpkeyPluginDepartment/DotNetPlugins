package com.plugin.appium.keywords.GenericKeyword.tableAdapter;

import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

class AppAndWebRowAdapter {

	// private WebElement myWebElementRow;
	// private AppAndWebTableAdapter myTable;
	private List<WebElement> myCells = new ArrayList<>();

	// call the constructor when test the chrome browser 
	public AppAndWebRowAdapter(WebElement row, AppAndWebTableAdapter myTable) {

		// myWebElementRow = row;
		// this.myTable = myTable;
		System.out.println("1.5.1");

		List<WebElement> thList = row.findElements(By.xpath("./*[self::th or self::td]"));
		System.out.println("\t\ttotal headers found : <<" + thList.size());
		for (WebElement th : thList) {
			myCells.add(th);
		}

	}

	// call the constructor when test the application [Apk] 
	public AppAndWebRowAdapter(List<WebElement> row, AppAndWebTableAdapter myTable) {
		
		// Under all the WebElement in a row is a column
		for (WebElement th : row) {
			myCells.add(th);
		}
	}

	public List<WebElement> getCells() {
		System.out.println("1.5.3");
		return myCells;
	}

	public int getCellCount() {
		return myCells.size();
	}

}
