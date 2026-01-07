package excelapi.services;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

import excelapi.services.SingleCellValue;
import excelapi.utilities.JsonConverter;


public class WriteIntoExcelService {
	 WriteIntoExcel obj;
	 String json;
	 String action = "write";
	public String setValue(String excelReference , String SheetName , String value , String cell){
		
		ArrayList<SingleCellValue> valueList = new ArrayList<SingleCellValue>();
		valueList.add(new SingleCellValue(excelReference ,SheetName,value,cell));
		obj = new WriteIntoExcel(action,valueList);
		ArrayList< WriteIntoExcel> objArr = new ArrayList<WriteIntoExcel>();
		objArr.add(obj);
		json = new JsonConverter().jsonConvter(objArr);
		return json;
	}
	
	public String rowCount_SetValue(String excelReference ,String SheetName ,long rowcount) {
		 ArrayList<RowCount> rowcountArr = new ArrayList<RowCount>();
		 rowcountArr.add(new RowCount(excelReference ,SheetName , rowcount));
		 String json = new JsonConverter().jsonConvter(rowcountArr);
		 System.out.println(json);
		 return json;
		 
	}
	public String columnCount_SetValue(String excelReference ,String sheetName,int columncount) {
		 ArrayList<ColumnCount> columncountArr = new ArrayList<ColumnCount>();
		 columncountArr.add(new ColumnCount(excelReference ,sheetName,columncount));
		 String json = new JsonConverter().jsonConvter(columncountArr);
		 System.out.println(json);
		 return json;
	}
	public String bgColor_SetValue(String excelReference ,String sheetname , String bgcolor , String cell) {
		 ArrayList<SetCellBackgroundColor> bgColorArr = new ArrayList<SetCellBackgroundColor>();
		 bgColorArr.add(new SetCellBackgroundColor(excelReference ,sheetname , bgcolor , cell));
		 String json = new JsonConverter().jsonConvter(bgColorArr);
		 System.out.println(json);
		 return json;
	}
	public String renameSheet_SetValue(String excelReference ,String sheetname , String newname) {
		 ArrayList<RenameSheet> renameArr = new ArrayList<RenameSheet>();
		 renameArr.add(new RenameSheet(excelReference ,sheetname , newname));
		 String json = new JsonConverter().jsonConvter(renameArr);
		 System.out.println(json);
		 return json;
	}
	public String insertRow_SetValue(String excelReference ,String sheetname , int rowNumber , int NumberofRow) {
		 ArrayList<InsertRow> insertRowArr = new ArrayList<InsertRow>();
		 insertRowArr.add(new InsertRow(excelReference ,sheetname , rowNumber , NumberofRow));
		 String json = new JsonConverter().jsonConvter(insertRowArr);
		 System.out.println(json);
		 return json;
	}
	public String deleteRow_SetValue(String excelReference ,String sheetname , int rowNumber) {
		 ArrayList<DeleteRow> deleteRowArr = new ArrayList<DeleteRow>();
		 deleteRowArr.add(new DeleteRow(excelReference ,sheetname , rowNumber));
		 String json = new JsonConverter().jsonConvter(deleteRowArr);
		 System.out.println(json);
		 return json;
	}
	
	public String getEntireRow_SetValue(String excelReference ,String sheetname , long rowNumber , String Delimeter) {
		 ArrayList<GetEntireRow> getEntireRowArr = new ArrayList<GetEntireRow>();
		 getEntireRowArr.add(new GetEntireRow(excelReference ,sheetname,rowNumber,Delimeter));
		 String json = new JsonConverter().jsonConvter(getEntireRowArr);
		 System.out.println(json);
		 return json;
	}
	public String getEntireColumn_SetValue(String excelReference ,String sheetname , long columnNumber , String Delimeter) {
		 ArrayList<GetEntireColumn> getEntireColumnArr = new ArrayList<GetEntireColumn>();
		 getEntireColumnArr.add(new GetEntireColumn(excelReference ,sheetname,columnNumber,Delimeter));
		 String json = new JsonConverter().jsonConvter(getEntireColumnArr);
		 System.out.println(json);
		 return json;
	}
	public String setRowValue_SetValue(String excelReference ,String sheetname , long rowNumber , String value) {
		 ArrayList<SetRowValue> setRowValueArr = new ArrayList<	SetRowValue>();
		 setRowValueArr.add(new SetRowValue(excelReference ,sheetname,rowNumber,value));
		 String json = new JsonConverter().jsonConvter(setRowValueArr);
		 System.out.println(json);
		 return json;
	}
	public String setColumnValue_SetValue(String excelReference ,String sheetname , long columnNumber , String value) {
		 ArrayList<SetColumnValue> setColumnValueArr = new ArrayList<SetColumnValue>();
		 setColumnValueArr.add(new SetColumnValue(excelReference ,sheetname,columnNumber,value));
		 String json = new JsonConverter().jsonConvter(setColumnValueArr);
		 System.out.println(json);
		 return json;
	}
	
	public String setCellValue_SetValue(String excelReference ,  String sheetName , long columnNumber , long rowNumber , String value) {
		 ArrayList<SetCellValue> setCellValueArr = new ArrayList<SetCellValue>();
		 setCellValueArr.add(new SetCellValue(excelReference ,sheetName,columnNumber,rowNumber,value));
		 String json = new JsonConverter().jsonConvter(setCellValueArr);
		 System.out.println(json);
		 return json;
	}
	
	public String getCellValue_SetValue(String excelReference ,String sheetName ,  long columnNumber , long rowNumber) {
		 ArrayList<GetCellValue> GetCellValueArr = new ArrayList<GetCellValue>();
		 GetCellValueArr.add(new GetCellValue(excelReference ,sheetName,columnNumber,rowNumber));
		 String json = new JsonConverter().jsonConvter(GetCellValueArr);
		 System.out.println(json);
		 return json;
	}
	
	public String clearCellValue_SetValue(String excelReference ,String sheetName, long columnNumber , long rowNumber ,long lastRowNumber, long lastColumnNumber) {
		 ArrayList<ClearCellValue> clearCellValueArr = new ArrayList<ClearCellValue>();
		 clearCellValueArr.add(new ClearCellValue(excelReference ,sheetName,columnNumber,rowNumber ,lastRowNumber , lastColumnNumber));
		 String json = new JsonConverter().jsonConvter(clearCellValueArr);
		 System.out.println(json);
		 return json;
	}
	public String clearColumns_SetValue(String excelReference ,String sheetName, long columnNumber , long numberOfColumns) {
		 ArrayList<ClearColumns> clearColumnsArr = new ArrayList<ClearColumns>();
		 clearColumnsArr.add(new ClearColumns(excelReference ,sheetName,columnNumber,numberOfColumns));
		 String json = new JsonConverter().jsonConvter(clearColumnsArr);
		 System.out.println(json);
		 return json;
	}
	public String clearRows_SetValue(String excelReference ,String sheetName, long rowNumber , long NumberofRow) {
		 ArrayList<ClearRows> clearRowsArr = new ArrayList<ClearRows>();
		 clearRowsArr.add(new ClearRows(excelReference ,sheetName,rowNumber,NumberofRow));
		 String json = new JsonConverter().jsonConvter(clearRowsArr);
		 System.out.println(json);
		 return json;
	}
	
	public String createNewSheet_SetValue(String excelReference ,String newSheetName) {
		 ArrayList<CreateNewSheet> createNewSheetArr = new ArrayList<CreateNewSheet>();
		 createNewSheetArr.add(new CreateNewSheet(excelReference ,newSheetName));
		 String json = new JsonConverter().jsonConvter(createNewSheetArr);
		 System.out.println(json);
		 return json;
	}
	public String closeAllWorkbook_SetValue() {
		 ArrayList<CloseAllWorkbook> closeAllWorkbookArr = new ArrayList<CloseAllWorkbook>();
		 closeAllWorkbookArr.add(new CloseAllWorkbook());
		 String json = new JsonConverter().jsonConvter(closeAllWorkbookArr);
		 System.out.println(json);
		 return json;
	}
	public String closeWorkbook_SetValue(String reference) {
		 ArrayList<CloseWorkbook> closeWorkbookArr = new ArrayList<CloseWorkbook>();
		 closeWorkbookArr.add(new CloseWorkbook(reference));
		 String json = new JsonConverter().jsonConvter(closeWorkbookArr);
		 System.out.println("Json at WriteIntoExcel + "+ json);
		 return json;
	}
	public String duplicateSheet_SetValue(String reference , String SheetName, long AfterTargetPoint , String NewSheetName  ) {
		 ArrayList<DuplicateSheet> duplicateSheetArr = new ArrayList<DuplicateSheet>();
		 duplicateSheetArr.add(new DuplicateSheet(reference,SheetName , AfterTargetPoint , NewSheetName));
		 String json = new JsonConverter().jsonConvter(duplicateSheetArr);
		 System.out.println(json);
		 return json;
	}
	public String excelOpen_SetValue(String reference) {
		ArrayList<ExcelOpen> excelOpenArr = new ArrayList<ExcelOpen>();
		excelOpenArr.add(new ExcelOpen(reference));
		 String json = new JsonConverter().jsonConvter(excelOpenArr);
		 System.out.println(json);
		 return json;
	}
	public static void main(String [] args) {
		WriteIntoExcelService jo = new WriteIntoExcelService();
		//System.out.println(jo.columnCount_SetValue(3));
		//System.out.println(jo.bgColor_SetValue("Sheet1", "RED", "A1"));
//		System.out.println(jo.closeAllWorkbook_SetValue());
//		System.out.println(jo.closeWorkbook_SetValue("test"));
	//	System.out.println(jo.duplicateSheet_SetValue("test", "gtgtgtg", 0, "dddddddddd"));
	    String fileP = "C:\\Users\\mayank.sharma\\Downloads\\Utility Keywords  My List.xlsx";	
		Path path = Paths.get(fileP);
		String directory = path.toString();
		System.out.println(directory);
	}

	

	

}
