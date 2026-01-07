package Selenium;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.OutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.io.UnsupportedEncodingException;

public class MultiplePrintStream extends PrintStream {
	
	public java.util.ArrayList<OutputStream> al = new java.util.ArrayList<OutputStream>(); 
	
	public MultiplePrintStream(OutputStream out) {
		super(out);
		// TODO Auto-generated constructor stub
	}
	
	public void Add(OutputStream out) {
		al.add(out);
	}
	

	public void println(String s) {
		super.println(s);
		for(OutputStream out : al) {
			try {
				out.write(s.getBytes());
			} catch (Exception e) {}
		}
	}	
}

