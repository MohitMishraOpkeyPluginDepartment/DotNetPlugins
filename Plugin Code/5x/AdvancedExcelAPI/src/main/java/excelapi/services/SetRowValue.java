package excelapi.services;

public class SetRowValue {
    public String action = "setRowValue";
    public String SheetName;
    public long rowNumber ;
    
    public long getRowNumber() {
		return rowNumber;
	}
	public void setRowNumber(long rowNumber) {
		this.rowNumber = rowNumber;
	}
	public String value;
	public String excelReference;
	public SetRowValue(String excelReference ,String sheetname2, long rowNumber , String value) {
		// TODO Auto-generated constructor stub
		this.SheetName = sheetname2;
		this.rowNumber = rowNumber;
		this.value  = value;
		this.excelReference=excelReference;
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
    
}
