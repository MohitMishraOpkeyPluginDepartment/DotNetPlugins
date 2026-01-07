package excelapi.services;
import java.util.ArrayList;

import excelapi.utilities.JsonConverter;

public class GetFromExcelService {
	GetFromExcel getObj;
	String json;
	String action = "get";
	public String setValue(String sheetName , String cell){
		    
			ArrayList<Cell> valueList = new ArrayList<Cell>();
			valueList.add(new Cell(sheetName,cell));
			getObj = new GetFromExcel(action,valueList);
			ArrayList<GetFromExcel> list = new ArrayList<GetFromExcel>();
			list.add(getObj);
			json = new JsonConverter().jsonConvter(list);
			return json;
	}
}
