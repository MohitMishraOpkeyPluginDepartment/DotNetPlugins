package excelapi.services;

public class InsertRow {
    public String action = "insertRow";
    public String SheetName;
	public String excelReference;
   
	public InsertRow(String excelReference ,String sheetName, int rowNumber2, int numberofRow2) {
		SheetName = sheetName;
		this.rowNumber = rowNumber2;
		NumberofRow = numberofRow2;
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
	public int getNumberofRow() {
		return NumberofRow;
	}
	public void setNumberofRow(int numberofRow) {
		NumberofRow = numberofRow;
	}
	public int rowNumber;
    public int NumberofRow;
}
