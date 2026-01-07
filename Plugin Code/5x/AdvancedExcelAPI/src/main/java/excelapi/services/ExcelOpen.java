package excelapi.services;

public class ExcelOpen {
	public String action = "excelOpen";
	public String excelReference;
	public String getExcelReference() {
		return excelReference;
	}

	public void setExcelReference(String excelReference) {
		this.excelReference = excelReference;
	}

	public ExcelOpen(String reference) {
		this.excelReference = reference;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}
	
}
