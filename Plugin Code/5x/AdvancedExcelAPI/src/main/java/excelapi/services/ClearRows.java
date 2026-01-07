package excelapi.services;

public class ClearRows {
	  public String action = "clearRows";
	  public String SheetName;
	  public long rowNumber;
	  public long NumberofRow;
	  public String excelReference;
	public ClearRows(String  excelReference , String sheetName, long rowNumber, long numberofRow) {
		// TODO Auto-generated constructor stub
		this.rowNumber = rowNumber;
		this.NumberofRow = numberofRow;
		this.SheetName = sheetName;
		this.excelReference = excelReference;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public String getSheetName() {
		return SheetName;
	}
	public void setSheetName(String sheetName) {
		SheetName = sheetName;
	}
	public long getRowNumber() {
		return rowNumber;
	}
	public void setRowNumber(long rowNumber) {
		this.rowNumber = rowNumber;
	}
	public long getNumberofRow() {
		return NumberofRow;
	}
	public void setNumberofRow(long numberofRow) {
		NumberofRow = numberofRow;
	}
}