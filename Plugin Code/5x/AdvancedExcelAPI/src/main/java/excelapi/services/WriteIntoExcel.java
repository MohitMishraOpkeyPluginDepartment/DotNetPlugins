package excelapi.services;
import java.util.ArrayList;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;


public class WriteIntoExcel {
	public String action;
	@SerializedName("write")
	@Expose
	ArrayList<SingleCellValue> writeExcel;
	public ArrayList<SingleCellValue> getWriteExcel() {
		return writeExcel;
	}
	public void setWriteExcel(ArrayList<SingleCellValue> writeExcel) {
		this.writeExcel = writeExcel;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public WriteIntoExcel(String action, ArrayList<SingleCellValue> writeExcel) {
		super();
		this.action = action;
		this.writeExcel = writeExcel;
	}
	

}
