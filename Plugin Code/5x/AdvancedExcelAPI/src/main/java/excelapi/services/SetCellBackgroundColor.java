package excelapi.services;

public class SetCellBackgroundColor {
   public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public String getSheetName() {
		return sheetName;
	}
	public void setSheetName(String sheetName) {
		this.sheetName = sheetName;
	}
	public String getCellBgColor() {
		return cellBgColor;
	}
	public void setCellBgColor(String cellBgColor) {
		this.cellBgColor = cellBgColor;
	}
	public String getCell() {
		return cell;
	}
	public void setCell(String cell) {
		this.cell = cell;
	}
public String action = "setCellBackgroundColor";
   public String sheetName;
   public String cellBgColor;
   public String cell;
   public String excelReference;
public SetCellBackgroundColor(String excelReference,String sheetName, String cellBgColor, String cell) {
	
	this.sheetName = sheetName;
	this.cellBgColor = cellBgColor;
	this.cell = cell;
	this.excelReference=excelReference;
}
}