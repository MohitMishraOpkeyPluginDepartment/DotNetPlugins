package com.crestech.opkey.plugin.tableAdapter;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class RowAdapter {
	private Element row;
	private int rowNumber;
	private Element[][] table;
	private int innerTableCellSize;

	/**
	 * Parse the table Row
	 * 
	 * @param table
	 * @param row
	 * @param rowNumber
	 * @param innerTableCellSize
	 */
	public RowAdapter(Element[][] table, Element row, int rowNumber, int innerTableCellSize) {
		this.table = table;
		this.row = row;
		this.rowNumber = rowNumber;
		this.innerTableCellSize = innerTableCellSize;
		ParseRow();
	}

	// Parse the table row And cell
	private void ParseRow() {

		// Fetch All the Column from the current row
		Elements cells = this.row.select("th,td");

		// Iterate on all the cells and parse
		for (int cellIndex = 0; cellIndex < cells.size(); cellIndex++) {
			Element cell = cells.get(cellIndex);
			Elements innerCells = cell.select("th,td");
			Elements colgroup = cell.select("colgroup");

			System.out.println(cell.text() + " <<<<<<<<<<<<--------------");

			// If this.innerTableCellSize is greater than innerCellSize we need to parse
			// inner cells not the current cell
			// So continuing here if this condition meets
			if (this.innerTableCellSize <= 1 || innerCells.size() < this.innerTableCellSize || colgroup.size() <= 0) {

				CellAdapter ca = new CellAdapter(cell);
				int firstEmptyCellIndex = getNextEmptyCellIndex(this.rowNumber);
				// System.out.println("firstEmptyCellIndex " + firstEmptyCellIndex + "
				// cells.get(cellIndex)" + cells.get(cellIndex));

				// Get the current col span and place element at all the occurence
				for (int i = 0; i < ca.getColSpan(); i++) {
					this.table[this.rowNumber][firstEmptyCellIndex + i] = cell;
				}

				// Get the current row span and place element at all the occurence
				for (int i = 1; i < ca.getRowSpan(); i++) {
					this.table[this.rowNumber + i][firstEmptyCellIndex] = cell;
				}

				// Add the inner table cells count to the table cell size in-order to byPass
				// that inner cells
				if (innerCells.size() < this.innerTableCellSize
						|| (this.innerTableCellSize == 0 && innerCells.size() > 1)
						|| (colgroup.size() == 0 && innerCells.size() > 1))
					cellIndex = cellIndex + innerCells.size() - 1;
			}
		}
	}

	/**
	 * Returns the next empty cell in particular row
	 * 
	 * @param rowIndex
	 * @return
	 */
	private int getNextEmptyCellIndex(int rowIndex) {
		int cellIndex = -1;
		for (int i = 0; i < this.table[rowIndex].length; i++) {
			Element cellValue = this.table[rowIndex][i];
			if (cellValue == null) {
				cellIndex = i;
				break;
			}
		}
		return cellIndex;
	}
}
