package excelapi.services;

public class GetEntireColumn {
      public String action = "getEntireColumn";
      public long columnNumber ;
      public String Delimeter;
      public String SheetName;
	public String excelReference;
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
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
	public String getSheetName() {
		return SheetName;
	}
	public void setSheetName(String sheetName) {
		SheetName = sheetName;
	}
	public GetEntireColumn( String excelReference ,String sheetName , long columnNumber, String delimeter) {
	

		this.columnNumber = columnNumber;
		this.Delimeter = delimeter;
		this.SheetName = sheetName;
		this.excelReference=excelReference;
	}
      
}  
