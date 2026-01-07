package com.crestech.opkey.plugin.tableAdapter;

import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;

public class CellAdapter {
	private Element cell;
	private int rowSpan;
	private int colSpan;
	private String getElementXpath;

	/**
	 * It parse the particular cell and fetch Rowspan and Colspan
	 * 
	 * @param cell
	 */
	public CellAdapter(Element cell) {
		this.cell = cell;
		ParseCell();
	}

	private void ParseCell() {
		// These returns atleast 1 since cell is part of one column and one row
		setColSpan(((cell.attr("colspan") == null) || (cell.attr("colspan").isEmpty())) ? 1 : Integer.parseInt(cell.attr("colspan")));
		setRowSpan(((cell.attr("rowspan") == null) || (cell.attr("rowspan").isEmpty())) ? 1 : Integer.parseInt(cell.attr("rowspan")));
	}

	/**
	 * Returns the ColSpan (Min : 1)
	 * 
	 * @return
	 */
	public int getColSpan() {
		return colSpan;
	}

	private void setColSpan(int colSpan) {
		this.colSpan = colSpan;
	}

	/**
	 * Returns the RowSpan (Min : 1)
	 * 
	 * @return
	 */
	public int getRowSpan() {
		return rowSpan;
	}

	private void setRowSpan(int rowSpan) {
		this.rowSpan = rowSpan;
	}

	public String getGetElementXpath(Node n) {
		getElementXpath = "//body/" + createXpath(n);
		return getElementXpath;
	}

	private String createXpath(Node n) {
		int index = 1;
		String xpath = "";
		while (!(n.nodeName().equals("body"))) {
			index = elementIndex(n);
			xpath = "/" + n.nodeName() + "[" + index + "]" + xpath;
			n = n.parentNode();
		}
		return xpath;
	}

	// find element index in xpath
	private int elementIndex(Node n) {
		int i = 0;
		String s = n.nodeName();

		while (n != null) {
			if (n.nodeName().equals(s)) {
				i++;
			}
			n = n.previousSibling();
		}
		return i;
	}
}
