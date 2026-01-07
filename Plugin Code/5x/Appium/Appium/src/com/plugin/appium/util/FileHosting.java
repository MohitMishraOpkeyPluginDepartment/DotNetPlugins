package com.plugin.appium.util;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

@SuppressWarnings("restriction")
public class FileHosting {
	static HttpServer server = null;

	public String StartFileTransferServer(String path) throws IOException {
		try {
			server = HttpServer.create(new InetSocketAddress(8000), 0);
		} catch (Exception ex) {
			StopFileTransferServer();
			server = HttpServer.create(new InetSocketAddress(8000), 0);
		}
		server.createContext("/info", new InfoHandler());
		server.createContext("/ssts.ipa", new GetHandler(path));
		server.setExecutor(null); // creates a default executor
		server.start();
		String address = "http://" + InetAddress.getLocalHost().toString().split("/")[1] + ":8000/ssts.ipa";
		return address;
	}

	public boolean StopFileTransferServer() {
		try {
			if (server != null) {
				server.stop(0);
			} else {
				return false;
			}
			System.out.println("File Hosting Stop Success");
		} catch (Exception ex) {
			System.out.println("Error in closing FileHosting");
			ex.printStackTrace();
			return false;
		}
		return true;
	}

	static class InfoHandler implements HttpHandler {
		public void handle(HttpExchange t) throws IOException {
			String response = "Use /ssts.ipa to download a PDF";
			t.sendResponseHeaders(200, response.length());
			OutputStream os = t.getResponseBody();
			os.write(response.getBytes());
			os.close();
		}
	}

	static class GetHandler implements HttpHandler {
		String filePath = "";

		public GetHandler(String path) {
			filePath = path;
		}

		public void handle(HttpExchange t) throws IOException {

			// add the required response header for a PDF file
			Headers h = t.getResponseHeaders();
			h.add("Content-Type", "application/octet-stream ipa");
			// a PDF (you provide your own!)
			File file = new File(filePath);
			byte[] bytearray = new byte[(int) file.length()];
			FileInputStream fis = new FileInputStream(file);
			BufferedInputStream bis = new BufferedInputStream(fis);
			bis.read(bytearray, 0, bytearray.length);
			// ok, we are ready to send the response.
			t.sendResponseHeaders(200, file.length());
			OutputStream os = t.getResponseBody();
			os.write(bytearray, 0, bytearray.length);
			os.close();
		}
	}
}
