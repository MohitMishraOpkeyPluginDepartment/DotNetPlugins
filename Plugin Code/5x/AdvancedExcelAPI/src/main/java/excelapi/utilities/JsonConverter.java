package excelapi.utilities;
import com.google.gson.Gson;

public class JsonConverter {
	Gson gson;
 public String jsonConvter(Object obj) {
	    gson = new Gson();
		String json = gson.toJson(obj);
		//System.out.println(json);
		return json;
 }
}
