package excelapi.services;

public class DuplicateSheet {

	public String action = "duplicateSheet";
	public String  SheetName;
	public String NewSheetName;
	public long AfterTargetPoint;
	public String excelReference;
	
	public DuplicateSheet(String excelReference , String sheetName, long afterTargetPoint, String newSheetName) {
		SheetName = sheetName;
		NewSheetName = newSheetName;
		AfterTargetPoint = afterTargetPoint;
		this.excelReference = excelReference;
	}
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
	public String getNewSheetName() {
		return NewSheetName;
	}
	public void setNewSheetName(String newSheetName) {
		NewSheetName = newSheetName;
	}
	public long getAfterTargetPoint() {
		return AfterTargetPoint;
	}
	public void setAfterTargetPoint(long afterTargetPoint) {
		AfterTargetPoint = afterTargetPoint;
	}
	
}
