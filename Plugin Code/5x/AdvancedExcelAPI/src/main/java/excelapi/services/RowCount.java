package excelapi.services;

import java.util.ArrayList;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class RowCount {
	@SerializedName("columnnumber")
	@Expose
	public long columnNumber;
	
	public String SheetName;
	
	public String getSheetName() {
		return SheetName;
	}
	public void setSheetName(String sheetName) {
		SheetName = sheetName;
	}
	public String action = "rowcount";

	public String excelReference;
	
	public String getAction() {
		return action;
}
	public long getColumnNumber() {
		return columnNumber;
	}
	public void setColumnNumber(long columnNumber) {
		this.columnNumber = columnNumber;
	}

	public RowCount(String excelReference ,String SheetName , long columnNumber) {
		this.columnNumber = columnNumber;
		this.SheetName = SheetName;
		this.excelReference=excelReference;
		
	}
	
	
	
}
