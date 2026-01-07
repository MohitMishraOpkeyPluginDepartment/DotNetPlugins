package excelapi.controller;
import java.io.BufferedReader;
import java.io.IOException;
import java.lang.reflect.Type;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import excelapi.services.ExcelRootJason;

public class GetExcelRoot extends HttpServlet {
	ExcelRootJason root[];

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// TODO Auto-generated method stub
       
		resp.setContentType("application/json;charset=UTF-8");
		ServletOutputStream out = resp.getOutputStream();
		Gson gson = new Gson();
		String json;
		 String strPathn = "not a object";
	    if(root==null) {
	    	json = gson.toJson(strPathn);
	    }else {
	    	json = gson.toJson(root);
	    }
		System.out.println("Json Which I Send------"+json);
		out.print(json);
		root=null;
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// TODO Auto-generated method stub
		StringBuilder strbul = new StringBuilder();
		BufferedReader reader = req.getReader();
		String line;
		while ((line = reader.readLine()) != null) {
			strbul.append(line);
		}
		System.out.println("Json Which Come from OkHTTPClient "+strbul);
		System.out.println("ROOT POST");
		Gson gson = new Gson();
		JsonParser jsonParser = new JsonParser();
		JsonArray jarr = (JsonArray) jsonParser.parse(strbul.toString());
		Type type = new TypeToken<ExcelRootJason[]>() {
		}.getType();
		root = gson.fromJson(jarr, type);
		

	}
}
