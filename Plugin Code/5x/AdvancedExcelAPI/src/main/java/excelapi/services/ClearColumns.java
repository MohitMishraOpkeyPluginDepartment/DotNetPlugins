package excelapi.services;

public class ClearColumns {
  public String action = "clearColumn";
  public String SheetName;
  public long columnNumber;
  public long numberOfColumns;
  public String excelReference;
public ClearColumns(String excelReference , String sheetName, long columnNumber, long numberOfColumns) {
	// TODO Auto-generated constructor stub
	this.SheetName = sheetName;
	this.columnNumber = columnNumber;
	this.numberOfColumns = numberOfColumns;
	this.excelReference = excelReference;
}
public String getSheetName() {
	return SheetName;
}
public void setSheetName(String sheetName) {
	SheetName = sheetName;
}
public long getColumnNumber() {
	return columnNumber;
}
public void setColumnNumber(long columnNumber) {
	this.columnNumber = columnNumber;
}
public long getNumberOfColumns() {
	return numberOfColumns;
}
public void setNumberOfColumns(long numberOfColumns) {
	this.numberOfColumns = numberOfColumns;
}
  
}
