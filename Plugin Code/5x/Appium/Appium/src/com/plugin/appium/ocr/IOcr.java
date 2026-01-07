package com.plugin.appium.ocr;

import java.io.File;

import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;

interface  IOcr {
	public final String apikey="K86547219588957";// limit 25000 calls create new if exhausted
	public final String url="https://api.ocr.space/parse/image";
	public File takeScreenshotUsingAppium() throws Exception;
	public FunctionResult Method_OCRGetPageText(String imagePath) throws Exception;
	public FunctionResult Method_OCRGetPageText() throws Exception;
	public FunctionResult Method_OCRTap(String wordToSearch,int index) throws Exception;	
	public FunctionResult Method_OCRSendKeys(String wordToSearch,int index, String text) throws Exception;
	public FunctionResult Method_OCRGetWordCoordiantes(String wordToSearch,int index) throws Exception;
}
