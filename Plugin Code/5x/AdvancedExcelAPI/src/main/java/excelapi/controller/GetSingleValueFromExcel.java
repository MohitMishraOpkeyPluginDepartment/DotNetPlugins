package excelapi.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

public class GetSingleValueFromExcel extends HttpServlet {
	public static String  value;
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// TODO Auto-generated method stub
		resp.setContentType("application/json;charset=UTF-8");
		//System.out.println(req.getParameter(getServletName()));
		ServletOutputStream out=  resp.getOutputStream();
		out.print(value);
		
	}
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// TODO Auto-generated method stub

		StringBuilder jb = new StringBuilder();
		String line = null;
		BufferedReader reader = req.getReader();
		while((line=reader.readLine())!=null) {
				jb.append(line);
				System.out.println("line--->"+line.toString());
		}
		value = jb.toString();
	}
}
