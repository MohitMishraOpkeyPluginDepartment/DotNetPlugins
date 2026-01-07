package excelapi.ClientHTTPRequest;
import java.io.IOException;

import okhttp3.Dispatcher;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import static okhttp3.RequestBody.create;
public class ClientOkHttp  {

	public void whenPost(String json) throws IOException, InterruptedException {
		//MediaType JSON = MediaType.get("application/json");
		Dispatcher dispatcher = new Dispatcher();
		dispatcher.setMaxRequests(1);
		OkHttpClient client = new OkHttpClient.Builder()
			    .dispatcher(dispatcher)
			    .build();
		//RequestBody body = RequestBody.create(json, JSON);
		//RequestBody body = RequestBody.Companion.create(json, JSON);
		RequestBody body =  create(MediaType.parse("application/json; charset=utf-8"),json);
		Request request = new Request.Builder().url("http://localhost:8093/root").post(body).build();
		Response response = client.newCall(request).execute();
		
		if(response.isSuccessful()) {
			System.out.println("Succesee");
			Thread.sleep(1000);
		}
		System.out.println("Json which i post : "+json);
	//	System.out.println("POST IS DONE");
	}

	public String whenGETRequest(String route) throws IOException, InterruptedException {
		OkHttpClient client = new OkHttpClient();
		Thread.sleep(1000);
	//	System.out.println("GET CALL STARTED");
		Request request = new Request.Builder().url("http://localhost:8093/"+route).build();
		Response response = client.newCall(request).execute();
	//	System.out.println("GET IS DONE");
		
		System.out.println("GET data from excel : "+response.peekBody(2048).string());
		String returnData  = response.peekBody(2048).string();
		System.out.println("Get Data From EXCEL EXCEL GET -------- "+returnData);
		return returnData;

	}

}