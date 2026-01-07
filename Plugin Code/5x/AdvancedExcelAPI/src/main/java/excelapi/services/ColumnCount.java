package excelapi.services;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class ColumnCount {
	@SerializedName("rownumber")
	@Expose
	public int rowcount;
	public int getRowcount() {
		return rowcount;
	}
	public void setRowcount(int rowcount) {
		this.rowcount = rowcount;
		
	}

	public String action = "columncount";
	public String excelReference;
    
   
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
		
	}
	public String SheetName;
	public String getSheetName() {
		return SheetName;
	}
	public void setSheetName(String sheetName) {
		SheetName = sheetName;
	}
	public ColumnCount(String excelReference , String sheetName,int rownumber) {
		this.rowcount = rownumber;
		this.excelReference=excelReference;
		this.SheetName = sheetName;
	}
	

}
