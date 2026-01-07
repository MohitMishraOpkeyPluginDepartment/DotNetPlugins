package excelapi.services;

public class SetCellValue {
    public String action = "setCellValue";
    
    public String SheetName;
    public String value;
    public long columnNumber;
    public long rowNumber;
	public SetCellValue( String excelReference , String sheetName, long columnNumber, long rowNumber, String value) {
		// TODO Auto-generated constructor stub
		this.SheetName = sheetName;
		this.columnNumber = columnNumber;
		this.rowNumber  = rowNumber;
		this.value = value;
		this.excelReference = excelReference;
	}
	public String getSheetName() {
		return SheetName;
	}
	public void setSheetName(String sheetName) {
		SheetName = sheetName;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
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
	
	public String excelReference;
	public String getExcelReference() {
		return excelReference;
	}
	public void setExcelReference(String excelReference) {
		this.excelReference = excelReference;
	}
}
