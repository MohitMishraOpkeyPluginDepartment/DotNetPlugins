package com.plugin.appium.context;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import com.ssts.pcloudy.exception.ConnectError;
import com.ssts.pcloudy.Connector;

import com.crestech.opkey.plugin.contexts.Context;

public class PCloudyContext {
	
	private static PCloudyContext instance;
	private Map<String, String> map;
	private Connector connector;
	
	private PCloudyContext() throws IOException {
		this.map = this.getpCLoudySessionInfo();
		this.setConnector();
	}
	
	public static PCloudyContext getInstance() throws IOException {
		if(PCloudyContext.instance == null) {
			PCloudyContext.instance = new PCloudyContext();
		}
		
		return PCloudyContext.instance;
	}
	
	public String getEndpoint() {
		return this.map.get("pCloudy_apiEndpoint");
	}
	
	public String getAuthToken() {
		return this.map.get("pCloudy_AuthToken");
	}
	
	public int getRID() {
		return Integer.parseInt(this.map.get("pC_RID"));
	}
	
	private void setConnector() {
		this.connector = new Connector(this.getEndpoint());
	} 
	
	public Connector getConnector() {
		return this.connector;
	}
	
	public Map<String, String> getpCLoudySessionInfo() throws IOException {
		HashMap<String, String> infoMap = new HashMap<String, String>();

		File pCloudy_AppiumCapabilities = new File(Context.session().getSettings().get("pCloudy_AppiumCapabilities"));
		System.out.println("pCloudy Setting Path: " + pCloudy_AppiumCapabilities.getPath());
		FileInputStream fis = new FileInputStream(pCloudy_AppiumCapabilities);
		byte[] data = new byte[(int) pCloudy_AppiumCapabilities.length()];
		fis.read(data);
		fis.close();
		String pCloudy_AppiumCapabilities_FileContents = new String(data, "UTF-8");

		for (String line : pCloudy_AppiumCapabilities_FileContents.split("\r\n")) {
			if (line.isEmpty())
				continue;
			String key = line.split("=")[0];
			
//			// error [1] due to string not exist after split
//			System.out.println("The line is "+line);
//			System.out.println("line split"+line.split("=")[0] );
//			
//			
			Object value ="";
			try {
				if (line.split("=").length > 1) {
					value = line.split("=")[1];
				} else {
					value = "";
				}
			} catch (Exception e) {
			  //  e.printStackTrace();
			    value="";
			}
			
			if (key.equalsIgnoreCase("pC_AuthToken")) {
				infoMap.put("pCloudy_AuthToken", value.toString());
			} else if (key.equalsIgnoreCase("pC_RID")) {
				infoMap.put("pC_RID", value.toString());
			} else if (key.equalsIgnoreCase("pC_apiEndpoint")) {
				infoMap.put("pCloudy_apiEndpoint", value.toString());
			}
		}
		return infoMap;
	}
	
	public void releaseSession() throws ConnectError, IOException {
		this.connector.AppiumApis().releaseSession(this.getAuthToken(), this.getRID());
	}
	
	public void resetLocation() throws IOException, ConnectError {
		this.connector.resetAndroidLocation(this.getAuthToken(), this.getRID());
	}
}
