package excelapi.services;

public class CloseWorkbook {
  public String action = "closeWorkbook";
  
  public String excelReference;

public CloseWorkbook(String reference) {
	// TODO Auto-generated constructor stub
	this.excelReference = reference;
}

public String getAction() {
	return action;
}

public void setAction(String action) {
	this.action = action;
}

public String getExcelReference() {
	return excelReference;
}

public void setExcelReference(String excelReference) {
	this.excelReference = excelReference;
}
}
