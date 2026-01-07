package excelapi.services;

public class RenameSheet {
   public String action = "renameSheet";
   public String SheetName;
   public String renameSheet;
   public String excelReference;
public String getSheetName() {
	return SheetName;
}
public RenameSheet(String excelReference,String sheetName, String renameSheet) {
	
	this.SheetName = sheetName;
	this.renameSheet = renameSheet;
	this.excelReference=excelReference;
}
public void setSheetName(String sheetName) {
	SheetName = sheetName;
}
public String getRenameSheet() {
	return renameSheet;
}
public void setRenameSheet(String renameSheet) {
	this.renameSheet = renameSheet;
}
}
