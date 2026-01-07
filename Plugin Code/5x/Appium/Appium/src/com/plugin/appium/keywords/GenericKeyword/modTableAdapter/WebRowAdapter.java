package com.plugin.appium.keywords.GenericKeyword.modTableAdapter;

import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public class WebRowAdapter {
	private List<Element> myCells = new ArrayList<>();

	public WebRowAdapter(Element row, WebTableAdapter webTableAdapter) {
		List<Element> thList = row.select("th,td");
		for (int i = 0; i <= thList.size() - 1; i++) {
			Element th = thList.get(i);
			String rowHtml = th.html();
			if (rowHtml.contains("table")) {
				Document source = Jsoup.parse(rowHtml, "UTF-8");
				List<Element> thList1 = source.select("th,td");
				i = i + thList1.size();
			}
			myCells.add(th);
		}
		
	}

	public List<Element> getCells() {
		return myCells;
	}

	public int getCellCount() {
		return myCells.size();
	}
}
