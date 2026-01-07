package excelapi.services;

public class GetCellValue {
	public String action = "getCellValue";
    public String SheetName;
	public String excelReference;
    public GetCellValue(String excelReference ,String sheetName, long columnNumber, long rowNumber) {
		// TODO Auto-generated constructor stub
    	this.columnNumber = columnNumber;
    	this.rowNumber = rowNumber;
    	this.SheetName = sheetName;
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
	public long getRowNumber() {
		return rowNumber;
	}
	public void setRowNumber(long rowNumber) {
		this.rowNumber = rowNumber;
	}
	public long columnNumber;
    public long rowNumber;
}
