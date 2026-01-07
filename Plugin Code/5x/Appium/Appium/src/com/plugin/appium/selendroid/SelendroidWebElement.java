package com.plugin.appium.selendroid;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.Point;
import org.openqa.selenium.Rectangle;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;

public class SelendroidWebElement implements WebElement {

	private WebElement _innerWebElement = null;

	public SelendroidWebElement(WebElement webElement) {
		this._innerWebElement = webElement;
	}

	@Override
	public String getText() {

		String returnText = _innerWebElement.getText();
		returnText = (returnText == null || returnText.trim().equalsIgnoreCase(
				"")) ? _innerWebElement.getAttribute("value") : returnText;
		return returnText;		
	}

	@Override
	public void clear() {

		_innerWebElement.clear();

	}

	@Override
	public void click() {
		_innerWebElement.click();

	}

	@Override
	public WebElement findElement(By arg0) {
		WebElement we = _innerWebElement.findElement(arg0);
		return we;
	}

	@Override
	public List<WebElement> findElements(By arg0) {
		List<WebElement> list = _innerWebElement.findElements(arg0);
		return list;
	}

	@Override
	public String getAttribute(String arg0) {
		String attribute = _innerWebElement.getAttribute(arg0);
		return attribute;
	}

	@Override
	public String getCssValue(String arg0) {
		return _innerWebElement.getCssValue(arg0);
	}

	@Override
	public Point getLocation() {
		return _innerWebElement.getLocation();
	}

	@Override
	public Dimension getSize() {
		return _innerWebElement.getSize();
	}

	@Override
	public String getTagName() {
		return _innerWebElement.getTagName();
	}

	@Override
	public boolean isDisplayed() {
		return _innerWebElement.isDisplayed();
	}

	@Override
	public boolean isEnabled() {
		return _innerWebElement.isEnabled();
	}

	@Override
	public boolean isSelected() {
		return _innerWebElement.isSelected();
	}

	@Override
	public void sendKeys(CharSequence... arg0) {
		_innerWebElement.sendKeys(arg0);
	}

	@Override
	public void submit() {
		_innerWebElement.submit();
	}

	public WebElement getInnerWebElement() {
		return _innerWebElement;
	}

	@Override
	public <X> X getScreenshotAs(OutputType<X> arg0) throws WebDriverException {
		return _innerWebElement.getScreenshotAs(arg0);
	}

	@Override
	public Rectangle getRect() {
		return _innerWebElement.getRect();
	}

}
