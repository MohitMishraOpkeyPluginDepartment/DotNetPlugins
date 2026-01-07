package excelapi.controller;
import java.io.BufferedReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.google.gson.reflect.TypeToken;

import excelapi.utilities.JsonConverter;

public class StartServerService extends HttpServlet {
	@SerializedName("action")
	@Expose
	private static String action =  "handshake";
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// TODO Auto-generated method stub
		resp.setContentType("application/json;charset=UTF-8");
		JsonObject jobj = new JsonObject();
		jobj.addProperty("action", action);
		JsonConverter jc = new JsonConverter();
		String s = jc.jsonConvter(jobj);
		System.out.println(s);
		ServletOutputStream out = resp.getOutputStream();
		out.print(s);
		
		
	}
	
	
	
}
