package com.plugin.appium.keywords.GenericKeyword.modTableAdapter;

import java.util.List;

import org.apache.commons.lang3.StringUtils;

public class TablePrinter {

	private List<WebRowAdapter> rowsList;

	public TablePrinter(WebTableAdapter table) {
		rowsList = table.getRows();
		print();
	}

	private int[] colWidths() {
		int cols = -1;
		/*- max column size */
		for (WebRowAdapter row : rowsList)
			cols = Math.max(cols, row.getCells().size());

		int[] widths = new int[cols];

		for (WebRowAdapter row : rowsList) {
			for (int colNum = 0; colNum < row.getCells().size(); colNum++) {
				widths[colNum] = Math.max(widths[colNum], StringUtils.length(row.getCells().get(colNum).text()) + 3);
			}
		}
		return widths;
	}

	private void print() {
		StringBuilder buf = new StringBuilder();

		int[] colWidths = colWidths();

		for (WebRowAdapter row : rowsList) {
			for (int colNum = 0; colNum < row.getCells().size(); colNum++) {
				buf.append(StringUtils.rightPad(StringUtils.defaultString(row.getCells().get(colNum).text()), colWidths[colNum]));
				buf.append(' ');
			}
			buf.append('\n');
		}
		System.out.println(buf);
	}

}
