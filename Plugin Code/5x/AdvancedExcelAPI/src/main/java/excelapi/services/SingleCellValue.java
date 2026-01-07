package excelapi.services;
public class SingleCellValue {
	private String SheetName;
	public String getSheetName() {
		return SheetName;
	}
	public void setSheetName(String sheetName) {
		SheetName = sheetName;
	}
	private String value;
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getCell() {
		return cell;
	}
	public void setCell(String cell) {
		this.cell = cell;
	}
	private String cell;
	public String excelReference;
	
	public SingleCellValue( String value, String cell) {
		
		this.value = value;
		this.cell = cell;
		
	}
	public SingleCellValue(String excelReference,String SheetName , String value, String cell) {
		
		this.value = value;
		this.cell = cell;
		this.SheetName = SheetName;
		this.excelReference=excelReference;
	}
	

}
