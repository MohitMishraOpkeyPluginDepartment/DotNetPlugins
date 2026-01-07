package excelapi.services;
import java.util.ArrayList;
import java.util.Iterator;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class ExcelRootJason {
	@SerializedName("action")
	@Expose
	private String action;
	@SerializedName("get")
	@Expose
	ArrayList<Cell> getExcel;
	@SerializedName("write")
	@Expose
	ArrayList<SingleCellValue> writeExcel;
	
	@SerializedName("columnnumber")
	@Expose
	public String  rowCount;
    
	@SerializedName("rownumber")
	@Expose
	public String  columnCount;

	@SerializedName("SheetName")
	@Expose
	public String  SheetName;
	
	@SerializedName("cellBgColor")
	@Expose
	public String cellBgColor;
	
	@SerializedName("cell")
	@Expose
	public String cell;
	
	@SerializedName("renameSheet")
	@Expose
	public String renameSheet;
	
	@SerializedName("NumberofRow")
	@Expose
	public int NumberofRow;
	
	
	@SerializedName("rowNumber")
	@Expose
	public long rowNumber;
	
	@SerializedName("Delimeter")
	@Expose
	public String Delimeter;
	
	@SerializedName("columnNumber")
	@Expose
	public long columnNumber;
	
	@SerializedName("newSheetName")
	@Expose
	public String newSheetName;
	
	@SerializedName("value")
	@Expose
	public String value;
	
	@SerializedName("lastRowNumber")
	@Expose
	public long lastRowNumber;
	
	@SerializedName("lastColumnNumber")
	@Expose
	public long lastColumnNumber;
	
	@SerializedName("numberOfColumns")
	@Expose
	public long numberOfColumns;
	
	@SerializedName("NewSheetName")
	@Expose
	public String NewSheetName;
	
	@SerializedName("excelReference")
	@Expose
	public String excelReference;
	
	public long AfterTargetPoint;
	
	public long getAfterTargetPoint() {
		return AfterTargetPoint;
	}
	public void setAfterTargetPoint(long afterTargetPoint) {
		AfterTargetPoint = afterTargetPoint;
	}
	public String getExcelReference() {
		return excelReference;
	}
	public void setExcelReference(String excelReference) {
		this.excelReference = excelReference;
	}
	public int getNumberofRow() {
		return NumberofRow;
	}
	public void setNumberofRow(int numberofRow) {
		NumberofRow = numberofRow;
	}
	public long getRowNumber() {
		return rowNumber;
	}
	public void setRowNumber(long rowNumber) {
		this.rowNumber = rowNumber;
	}
	public long getNumberOfColumns() {
		return numberOfColumns;
	}
	public void setNumberOfColumns(long numberOfColumns) {
		this.numberOfColumns = numberOfColumns;
	}
	public long getLastRowNumber() {
		return lastRowNumber;
	}
	public void setLastRowNumber(long lastRowNumber) {
		this.lastRowNumber = lastRowNumber;
	}
	public long getLastColumnNumber() {
		return lastColumnNumber;
	}
	public void setLastColumnNumber(long lastColumnNumber) {
		this.lastColumnNumber = lastColumnNumber;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getNewSheetName() {
		return newSheetName;
	}
	public void setNewSheetName(String newSheetName) {
		this.newSheetName = newSheetName;
	}
	public long getColumnNumber() {
		return columnNumber;
	}
	public void setColumnNumber(long columnNumber) {
		this.columnNumber = columnNumber;
	}
	public String getDelimeter() {
		return Delimeter;
	}
	public void setDelimeter(String delimeter) {
		Delimeter = delimeter;
	}
	
	public String getRenameSheet() {
		return renameSheet;
	}
	public void setRenameSheet(String renameSheet) {
		this.renameSheet = renameSheet;
	}
	public String getCell() {
		return cell;
	}
	public void setCell(String cell) {
		this.cell = cell;
	}
	public String getCellBgColor() {
		return cellBgColor;
	}
	public void setCellBgColor(String cellBgColor) {
		this.cellBgColor = cellBgColor;
	}
	public String getSheetName() {
		return SheetName;
	}
	public void setSheetName(String sheetName) {
		SheetName = sheetName;
	}
	public String getColumnCount() {
		return columnCount;
	}
	public void setColumnCount(String columnCount) {
		this.columnCount = columnCount;
	}
	public String getRowCount() {
		return rowCount;
	}
	public void setRowCount(String rowCount) {
		this.rowCount = rowCount;
	}
	public ExcelRootJason() {
		
	}
	public ExcelRootJason(String action , ArrayList<SingleCellValue> writeExcel, ArrayList<Cell> getExcel , String rowCount , String columnCount) {
		
		this.action = action;
		this.writeExcel = writeExcel;
		this.getExcel = getExcel;
		this.rowCount = rowCount;
		this.columnCount = columnCount;
	}
	
	public String getAction() {
		return action;
		}

	public void setAction(String action) {
		this.action = action;
	}

	public ArrayList<SingleCellValue> getWriteExcel() {
		return writeExcel;
	}

	public void setWriteExcel(ArrayList<SingleCellValue> writeExcel) {
		this.writeExcel = writeExcel;
	}

	public ArrayList<Cell> getGetExcel() {
		return getExcel;
	}

	public void setGetExcel(ArrayList<Cell> getExcel) {
		this.getExcel = getExcel;
	}
	
	@Override
	public String toString() {
		return "ExcelRootJason [action=" + action + ", getExcel=" + getExcel + ", writeExcel=" + writeExcel
				+ ", rowCount=" + rowCount + "]";
	}
	public static void main(String [] args) {
//		WriteIntoExcel obj = new WriteIntoExcel();
//		obj.EnterData();
//		ArrayList<SingleCellValue> list = new ArrayList<SingleCellValue>();
//		list.add(new SingleCellValue("Mayank","A1"));
//		ExcelRootJason obj = new ExcelRootJason("write",list,null,null);
//		System.out.println(obj.action);
//		ArrayList<SingleCellValue> list2 = obj.getWriteExcel();
//		for(SingleCellValue sc : list2) {
//			System.out.println(sc.getValue());
//		}
//		ArrayList<Cell> listget = new ArrayList<Cell>();
//		
//		for(Cell sc : listget) {
//			System.out.println(sc.getCell());
//		}
//		ArrayList<RowCount> list3 = new ArrayList<RowCount>();
//		list3.add(new RowCount("A"));
//		
//	
		
		
	}

}