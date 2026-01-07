package excelapi.services;

public class Cell {
	private String cell;
    private String SheetName;
	public String getSheetName() {
		return SheetName;
	}

	public void setSheetName(String sheetName) {
		SheetName = sheetName;
	}

	public String getCell() {
		return cell;
	}

	public Cell(String SheetName,String cell) {
		this.cell = cell;
		this.SheetName = SheetName;
	}

	public void setCell(String cell) {
		this.cell = cell;
	}
}
