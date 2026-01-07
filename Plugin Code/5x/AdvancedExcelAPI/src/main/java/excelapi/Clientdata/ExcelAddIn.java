package excelapi.Clientdata;

import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import excelapi.ClientHTTPRequest.ClientOkHttp;
import excelapi.server.AddInJettyServer;
import excelapi.services.GetFromExcelService;
import excelapi.services.SingleCellValue;
import excelapi.services.WriteIntoExcelService;
import okhttp3.MediaType;
import okhttp3.RequestBody;

public class ExcelAddIn {
	static AddInJettyServer obj = new AddInJettyServer();
	static Map<String, String> excelMap = new HashMap<String, String>();

	public static String getExcelReference(String value) {
		String keyExcelFile = "";
		for (Entry<String, String> entry : excelMap.entrySet()) {
			if (entry.getValue() == value) {
				System.out.println("The key for value " + value + " is " + entry.getKey());
				keyExcelFile = entry.getKey();
				break;
			}
		}
		return keyExcelFile;
	}

	public static void openExcel(String excelREF) throws InterruptedException, IOException {

		//excelMap.put(excelFile, reference);

		Thread.sleep(3000);
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();
		String json = obj.excelOpen_SetValue(excelREF);
		System.out.println("when i post a value " + json);
		ClientOkHttp client = new ClientOkHttp();
		// RequestBody body = RequestBody.create(json, JSON);
		client.whenPost(json);
		System.out.println("jdwfjjendej       -------------------------------i am done");
		String rowcount = client.whenGETRequest("postvalue");
		System.out.println("row count +---- " + rowcount);
		
	}

	public static String rowCountFromExcel(String excelREF, String SheetName, int colNumber)
			throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		// String excelREF = getExcelReference(excelReference);
		WriteIntoExcelService obj = new WriteIntoExcelService();
		String json = obj.rowCount_SetValue(excelREF, SheetName, colNumber);
		System.out.println("when i post a value " + json);
		ClientOkHttp client = new ClientOkHttp();
		// RequestBody body = RequestBody.create(json, JSON);
		client.whenPost(json);
		System.out.println("jdwfjjendej       -------------------------------i am done");
		String rowcount = client.whenGETRequest("postvalue");
		System.out.println("row count +---- " + rowcount);
		return rowcount;
	}

	public static String columnCount(String excelREF,String sheetName, int rowNumber) throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}

		WriteIntoExcelService obj = new WriteIntoExcelService();
		String json = obj.columnCount_SetValue(excelREF,sheetName, rowNumber);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String columncount = client.whenGETRequest("postvalue");
		System.out.println("column count +---- " + columncount);
		return columncount;
	}

	public static boolean setCellBgColor(String SheetName, String cellBgColor, String cell)
			throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();

		String json = obj.bgColor_SetValue("", SheetName, cellBgColor, cell);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String done = client.whenGETRequest("postvalue");
		boolean flage = false;
		if (done == "true") {
			flage = true;
		}
		System.out.println("CELL BG COLOR is DOWN " + done);

		return flage;
	}

	public static boolean renameSheet(String excelREF, String SheetName, String newName)
			throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();

		String json = obj.renameSheet_SetValue(excelREF, SheetName, newName);
		System.out.println("----------------------" + json);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String done = client.whenGETRequest("postvalue");
		boolean flage = false;
		if (done == "true") {
			flage = true;
		}
		System.out.println("CELL BG COLOR is DOWN " + done);

		return flage;

	}

	public static boolean insertRow(String excelREF, String SheetName, int rowNumber, int NumberofRow)
			throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();

		String json = obj.insertRow_SetValue(excelREF, SheetName, rowNumber, NumberofRow);
		System.out.println("----------------------" + json);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String done = client.whenGETRequest("postvalue");
		boolean flage = false;
		if (done == "true") {
			flage = true;
		}
		System.out.println("CELL BG COLOR is DOWN " + done);

		return flage;

	}

	public static boolean deleteRow(String excelREF, String SheetName, int rowNumber)
			throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();

		String json = obj.deleteRow_SetValue(excelREF, SheetName, rowNumber);
		System.out.println("----------------------  " + json);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String done = client.whenGETRequest("postvalue");
		boolean flage = false;
		if (done == "true") {
			flage = true;
		}

		return flage;

	}

	public static String getEntireRow(String excelREF, String SheetName, long rowNumber, String Delimeter)
			throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();
		if (Delimeter == "" || Delimeter == null) {
			Delimeter = " ";
		}

		String json = obj.getEntireRow_SetValue(excelREF, SheetName, rowNumber, Delimeter);
		System.out.println("----------------------  " + json);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String jsonString = client.whenGETRequest("postvalue");

		return jsonString;

	}

	public static String getEntireColumn(String excelREF, String SheetName, long columnNumber, String Delimeter)
			throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();
		if (Delimeter == "" || Delimeter == null) {
			Delimeter = " ";
		}

		String json = obj.getEntireColumn_SetValue(excelREF, SheetName, columnNumber, Delimeter);
		System.out.println("----------------------  " + json);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String jsonString = client.whenGETRequest("postvalue");

		return jsonString;
	}

	public static boolean setRowValue(String excelREF, String SheetName, long rowNumber, String value)
			throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();
		// String excelREF = getExcelReference(excelReference);
		String json = obj.setRowValue_SetValue(excelREF, SheetName, rowNumber, value);
		System.out.println("----------------------  " + json);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String done = client.whenGETRequest("postvalue");
		boolean flage = false;
		if (done == "true") {
			flage = true;
		}

		return flage;
	}

	public static boolean setColumnValue(String excelREF, String SheetName, long columnNumber, String value)
			throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();

		String json = obj.setColumnValue_SetValue(excelREF, SheetName, columnNumber, value);
		System.out.println("----------------------  " + json);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String done = client.whenGETRequest("postvalue");
		boolean flage = false;
		if (done == "true") {
			flage = true;
		}

		return flage;
	}

	public static boolean setCellValue(String excelREF, String SheetName, long columnNumber, long rowNumber,
			String value) throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();

		// String excelREF = getExcelReference( excelReference);
		String json = obj.setCellValue_SetValue(excelREF, SheetName, columnNumber, rowNumber, value);
		System.out.println("----------------------  " + json);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String done = client.whenGETRequest("postvalue");
		boolean flage = false;
		if (done == "true") {
			flage = true;
		}

		return flage;
	}

	public static String getCellValue(String excelREF, String SheetName, long columnNumber, long rowNumber)
			throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();

		String json = obj.getCellValue_SetValue(excelREF, SheetName, columnNumber, rowNumber);
		System.out.println("----------------------  " + json);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String done = client.whenGETRequest("postvalue");
		return done;
	}

	public static boolean clearCellValue(String excelREF, String SheetName, long columnNumber, long rowNumber,
			long lastRowNumber, long lastColumnNumber) throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();

		String json = obj.clearCellValue_SetValue(excelREF, SheetName, columnNumber, rowNumber, lastRowNumber,
				lastColumnNumber);
		System.out.println("----------------------  " + json);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String done = client.whenGETRequest("postvalue");
		boolean flage = false;
		if (done == "true") {
			flage = true;
		}

		return flage;
	}

	public static boolean clearColumns(String excelREF, String SheetName, long columnNumber, long numberOfColumns)
			throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();

		String json = obj.clearColumns_SetValue(excelREF, SheetName, columnNumber, numberOfColumns);
		System.out.println("----------------------  " + json);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String done = client.whenGETRequest("postvalue");
		boolean flage = false;
		if (done.equals("true")) {
			flage = true;
		}

		return flage;
	}

	public static boolean clearRows(String excelREF, String SheetName, long rowNumber, long numberofRows)
			throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();

		String json = obj.clearRows_SetValue(excelREF, SheetName, rowNumber, numberofRows);
		System.out.println("----------------------  " + json);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String done = client.whenGETRequest("postvalue");
		boolean flage = false;
		if (done == "true") {
			flage = true;
		}

		return flage;
	}

	public static boolean createNewSheet(String excelREF, String newSheetName)
			throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();

		String json = obj.createNewSheet_SetValue(excelREF, newSheetName);
		System.out.println("----------------------  " + json);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String done = client.whenGETRequest("postvalue");
		boolean flage = false;
		if (done == "true") {
			flage = true;
		}

		return flage;
	}

	public static boolean closeAllWorkbook() throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();
		String json = obj.closeAllWorkbook_SetValue();
		System.out.println("----------------------  " + json);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String done = client.whenGETRequest("postvalue");
		excelMap.clear();
		boolean flage = false;
		if (done == "true") {
			flage = true;
		}

		return flage;
	}

	public static boolean closeWorkbook(String excelREF) throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();

		String json = obj.closeWorkbook_SetValue(excelREF);
		System.out.println("----------------------  " + json);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String done = client.whenGETRequest("postvalue");

		boolean flage = false;
		if (done == "true") {
			flage = true;
		}

		return flage;
	}

	public static boolean duplicateSheet(String excelREF, String SourceSheet, long AfterTargetPoint,
			String NewSheetName) throws IOException, InterruptedException {
		if (obj.isServeStarted() == false) {
			obj.startServer();
		}
		WriteIntoExcelService obj = new WriteIntoExcelService();

		System.out.println("---------------------nnnnnwiedwe " + excelREF);
		String json = obj.duplicateSheet_SetValue(excelREF, SourceSheet, AfterTargetPoint, NewSheetName);
		System.out.println("----------------------  " + json);
		ClientOkHttp client = new ClientOkHttp();
		client.whenPost(json);
		String done = client.whenGETRequest("postvalue");

		boolean flage = false;
		if (done == "true") {
			flage = true;
		}

		return flage;
	}
  public static void main(String [] args) {
	  
  }

}