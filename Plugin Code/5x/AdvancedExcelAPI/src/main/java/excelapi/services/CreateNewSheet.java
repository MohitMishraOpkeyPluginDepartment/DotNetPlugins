package excelapi.services;

public class CreateNewSheet {
    public String action = "createNewSheet";
    public String excelReference;
    public String getExcelReference() {
		return excelReference;
	}
	public void setExcelReference(String excelReference) {
		this.excelReference = excelReference;
	}
	public String NewSheetName;
	public CreateNewSheet(String excelReference, String newSheetName) {
		// TODO Auto-generated constructor stub
		this.NewSheetName = newSheetName;
		this.excelReference = excelReference;
		
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public String getNewSheetName() {
		return NewSheetName;
	}
	public void setNewSheetName(String newSheetName) {
		NewSheetName = newSheetName;
	}
}
