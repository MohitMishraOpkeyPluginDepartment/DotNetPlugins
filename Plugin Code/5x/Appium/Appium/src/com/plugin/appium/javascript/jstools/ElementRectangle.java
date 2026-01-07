package com.plugin.appium.javascript.jstools;

public class ElementRectangle {
	private int _x = -1;
	private int _y = -1;
	private int _ew = -1;
	private int _eh = -1;
	private int _ww = -1;
	private int _wh = -1;

	protected ElementRectangle(int x, int y, int ew, int eh, int ww, int wh) {
		this._x = x;
		this._y = y;
		this._ew = ew;
		this._eh = eh;
		this._ww = ww;
		this._wh = wh;
	}

	public int getElementX() {
		return this._x;
	}

	public int getElementY() {
		return this._y;
	}

	public int getElementWidth() {
		return this._ew;
	}

	public int getElementHeight() {
		return this._eh;
	}

	public int getWindowWidth() {
		return this._ww;
	}

	public int getWindowHeight() {
		return this._wh;
	}
}
