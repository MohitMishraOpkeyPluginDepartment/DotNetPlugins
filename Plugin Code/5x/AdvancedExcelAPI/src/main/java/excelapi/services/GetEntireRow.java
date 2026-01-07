package excelapi.services;

public class GetEntireRow {
   public String excelReference;
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
	public String getDelimeter() {
		return Delimeter;
	}
	public GetEntireRow(String excelReference ,String sheetName, long rowNumber, String delimeter) {
		super();
		this.SheetName = sheetName;
		this.rowNumber = rowNumber;
		this.Delimeter = delimeter;
		this.excelReference=excelReference;
	}
	public void setDelimeter(String delimeter) {
		Delimeter = delimeter;
	}
public String action = "getEntireRow";
   public String SheetName;
   public long rowNumber;
   public String Delimeter;
}
