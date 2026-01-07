package com.plugin.appium.keywords.GenericKeyword.tableAdapter;

import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

import com.plugin.appium.AppiumObject;
import com.plugin.appium.AppiumObjectProperty;
import com.plugin.appium.Finder;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.DriverWindow;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

public class AppAndWebTableAdapter {

	private List<AppAndWebRowAdapter> myRows = new ArrayList<>();

	// private WebElement myWebElementTable;

	public AppAndWebTableAdapter(WebElement tbl, AppiumObject object) throws ToolNotSetException {
		// myWebElementTable = tbl;

		List<WebElement> trList;
		System.out.println("1.1");

		if (AppiumContext.getDriverWindow() == DriverWindow.Native && (!AppiumContext.isBrowserMode())) {
			// In the case of Native application
			trList = tbl.findElements(By.className("android.widget.TableRow"));

			for (int rowIterator = 1; rowIterator <= trList.size(); rowIterator++) {
				// loop for all table for rows
				List<WebElement> row = Finder.findAppiumDriver().findElements(By.xpath(this.getXpath(object).concat("/android.widget.TableRow[" + rowIterator + "]//*")));
				myRows.add(new AppAndWebRowAdapter(row, this));
			}
		}

		else {
			// In the case of chrome
			trList = tbl.findElements(By.xpath("./*[self::thead or self::tbody or self::tfoot]/tr"));
			for (WebElement row : trList) {
				myRows.add(new AppAndWebRowAdapter(row, this));
			}

		}

	}

	public int getRowCount() {

		return myRows.size();
	}

	public int getColumnCount(int rowIndex) {

		return myRows.get(rowIndex).getCellCount();
	}

	public String getCellData(int rowIndex, int colIndex) throws ToolNotSetException {

		WebElement cell = myRows.get(rowIndex).getCells().get(colIndex);
		Object str = ((JavascriptExecutor) Finder.findAppiumDriver()).executeScript("return arguments[0].textContent", cell);
		String text;
		text = (str == null) ? cell.getText() : str.toString();

		return text;
	}

	public int childItemCount(int rowNumber, int columnNumber, String objectTag) {

		if (AppiumContext.getDriverWindow() == DriverWindow.Native && (!AppiumContext.isBrowserMode())) {
			// In the Apk file No multiple element is found in one cell
			return 1;
		}
		WebElement cell = myRows.get(rowNumber).getCells().get(columnNumber);
		List<WebElement> childObject = cell.findElements(By.tagName(objectTag));
		return childObject.size();
	}

	public WebElement childItem(int rowNumber, int columnNumber, String objectTag, int objectAtIndex) {

		WebElement cell = myRows.get(rowNumber).getCells().get(columnNumber);

		if (AppiumContext.getDriverWindow() == DriverWindow.Native && (!AppiumContext.isBrowserMode())) {
			// In the Apk file No multiple element is found in one cell so return cell 
			return cell;
		}
		
		WebElement childObject = cell.findElements(By.tagName(objectTag)).get(objectAtIndex);
		return childObject;
	}

	private String getXpath(AppiumObject object) {

		List<AppiumObjectProperty> objectXpaths = object.getXPaths();

		for (AppiumObjectProperty xpath : objectXpaths) {
			if (xpath.getName().contentEquals("xPath")) {
				return xpath.getValue();
			}
		}
		return null;
	}
}
