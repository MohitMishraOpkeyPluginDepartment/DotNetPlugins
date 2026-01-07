package excelapi.services;

public class DeleteRow {
  public  String SheetName;
  public String action = "deleteRow";
  public int rowNumber;
  public String excelReference;
public DeleteRow(String excelReference ,String sheetName2, int rowNumber2) {
	// TODO Auto-generated constructor stub
	this.SheetName = sheetName2;
	this.rowNumber = rowNumber2;
	this.excelReference=excelReference;
}
public String getSheetName() {
	return SheetName;
}
public void setSheetName(String sheetName) {
	SheetName = sheetName;
}
public String getAction() {
	return action;
}
public void setAction(String action) {
	this.action = action;
}
public int getRowNumber() {
	return rowNumber;
}
public void setRowNumber(int rowNumber) {
	this.rowNumber = rowNumber;
}
}
