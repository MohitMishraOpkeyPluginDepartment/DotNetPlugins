package com.plugin.appium.ocr;

import java.util.List;
import java.util.Map;

public class OCRDataModel {
	private String line;
	private String lineMaxHeight;
	private String lineMinTop;
	private List<Map<String,Map<String,String>>> lineWords;
	
	public String getLine() {
		return line;
	}
	public void setLine(String line) {
		this.line = line;
	}
	public String getLineMaxHeight() {
		return lineMaxHeight;
	}
	public void setLineMaxHeight(String lineMaxHeight) {
		this.lineMaxHeight = lineMaxHeight;
	}
	public String getLineMinTop() {
		return lineMinTop;
	}
	public void setLineMinTop(String lineMinTop) {
		this.lineMinTop = lineMinTop;
	}
	public List<Map<String, Map<String, String>>> getLineWords() {
		return lineWords;
	}
	public void setLineWords(List<Map<String, Map<String, String>>> lineWords) {
		this.lineWords = lineWords;
	}
	@Override
	public String toString() {
		return "OCRSpaceTextDetectionDataModel [line=" + line + ", lineMaxHeight=" + lineMaxHeight + ", lineMinTop="+ lineMinTop + ", lineWords=" + lineWords + "]";
	}
}
