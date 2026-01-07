package excelapi.services;
import java.util.ArrayList;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class GetFromExcel {
	String action;
	@SerializedName("get")
	@Expose
	ArrayList<Cell> getExcel;
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public ArrayList<Cell> getGetExcel() {
		return getExcel;
	}
	public void setGetExcel(ArrayList<Cell> getExcel) {
		this.getExcel = getExcel;
	}
	public GetFromExcel(String action, ArrayList<Cell> getExcel) {
		super();
		this.action = action;
		this.getExcel = getExcel;
	}
	
	
}
