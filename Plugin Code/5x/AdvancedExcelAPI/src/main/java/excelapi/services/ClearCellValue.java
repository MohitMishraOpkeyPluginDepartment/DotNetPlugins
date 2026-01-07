package excelapi.services;

public class ClearCellValue {
	 public String action = "clearCellValue";
	 public String SheetName;
	 public long columnNumber;
	 public long rowNumber;
	 public long lastColumnNumber;
	 public long lastRowNumber;
	public String excelReference;
	public ClearCellValue(String excelReference , String sheetName, long columnNumber, long rowNumber, long lastRowNumber,
			long lastColumnNumber) {
		// TODO Auto-generated constructor stub
		this.SheetName = sheetName;
		this.columnNumber = columnNumber;
		this.rowNumber = rowNumber;
		this.lastRowNumber = lastRowNumber;
		this.lastColumnNumber = lastColumnNumber;
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
	public long getLastColumnNumber() {
		return lastColumnNumber;
	}
	public void setLastColumnNumber(long lastColumnNumber) {
		this.lastColumnNumber = lastColumnNumber;
	}
	public long getLastRowNumber() {
		return lastRowNumber;
	}
	public void setLastRowNumber(long lastRowNumber) {
		this.lastRowNumber = lastRowNumber;
	}
	 
}
