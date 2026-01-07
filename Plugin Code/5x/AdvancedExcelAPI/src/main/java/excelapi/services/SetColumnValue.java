package excelapi.services;

public class SetColumnValue {
	public String action = "setColumnValue";
    public String SheetName;
    public long columnNumber;
    public String value;
    public String excelReference;
    public SetColumnValue(String excelReference ,String sheetname2, long columnNumber, String value) {
		// TODO Auto-generated constructor stub
    	this.SheetName  = sheetname2;
    	this.columnNumber = columnNumber;
    	this.value = value;
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
	
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
}
