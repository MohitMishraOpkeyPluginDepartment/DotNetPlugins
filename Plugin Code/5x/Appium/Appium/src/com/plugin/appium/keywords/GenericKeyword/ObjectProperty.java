package com.plugin.appium.keywords.GenericKeyword;


import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.enums.ElementType;


@XmlRootElement
public class ObjectProperty {
	AppiumObject appiumObject;
	public String type;
	public String tag;
	public String id;
	public String css;
	public String classname;
	public String name;
	public int index;
	public String xpathposition;
	public String innertext;
	public String xpathidrelative;

	// ByText Property
	public ElementType ElementType;
	public String textToSearch;
	public boolean isContains;
	public boolean before;
	public boolean iS_MultipleDropdown;
	public boolean isHighlightParent;
	public List<WebElement> LableELements;
	public String beforeText;
	public String afterText;

	// Default Constructor
	public ObjectProperty() {

	}

	// Costructor for ByText
	public ObjectProperty(ElementType Element_TYPE, String textToSearch, int index, boolean isContains, boolean before) throws ArgumentDataInvalidException {
		//Log.print("Arguments value for ByText: === " + " textToSearch: " + textToSearch + " | index: " + index + " | isContains: " + isContains + " | before: " + before);
		setElementType(Element_TYPE);
		setTextToSearch(textToSearch);
		setIndex(index);
		setContains(isContains);
		setBefore(before);
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type.trim();
	}

	public String getTag() {
		return tag;
	}

	public void setTag(String tag) {
		this.tag = tag.trim();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCss() {
		return css;
	}

	public void setCss(String css) {
		this.css = css.trim();
	}

	public String getClassname() {
		return classname;
	}

	public void setClassname(String classname) {
		this.classname = classname.trim();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name.trim();
	}

	public int getIndex() {
		return index;
	}

	public void setIndex(int index) throws ArgumentDataInvalidException {
		this.index = index;
	}

	public String getXpathposition() {
		return xpathposition;
	}

	public void setXpathposition(String xpathposition) {
		this.xpathposition = xpathposition.trim();
	}

	public String getInnertext() {
		return innertext;
	}

	public void setInnertext(String innertext) {
		this.innertext = innertext.trim();
	}

	public String getXpathidrelative() {
		return xpathidrelative;
	}

	public void setXpathidrelative(String xpathidrelative) {
		this.xpathidrelative = xpathidrelative.trim();
	}


	public String getTextToSearch() {
		return textToSearch;
	}

	public void setTextToSearch(String textToSearch) {
		this.textToSearch = textToSearch.trim();
	}

	public boolean isContains() {
		return isContains;
	}

	public void setContains(boolean isContains) {
		this.isContains = isContains;
	}

	public boolean isBefore() {
		return before;
	}

	public void setBefore(boolean before) {
		this.before = before;
	}

	public boolean isiS_MultipleDropdown() {
		return iS_MultipleDropdown;
	}

	public void setiS_MultipleDropdown(boolean iS_MultipleDropdown) {
		this.iS_MultipleDropdown = iS_MultipleDropdown;
	}

	public boolean isHighlightParent() {
		return isHighlightParent;
	}

	public void setHighlightParent(boolean isHighlightParent) {
		this.isHighlightParent = isHighlightParent;
	}

	public List<WebElement> getLableELements() {
		return LableELements;
	}

	public void setLableELements(List<WebElement> lableELements) {
		LableELements = lableELements;
	}

	public String getBeforeText() {
		return beforeText;
	}

	public void setBeforeText(String beforeText) {
		this.beforeText = beforeText.trim();
	}

	public String getAfterText() {
		return afterText;
	}

	public void setAfterText(String afterText) {
		this.afterText = afterText.trim();
	}

	public ElementType getElementType() {
		return ElementType;
	}

	public void setElementType(ElementType elementType) {
		ElementType = elementType;
	}

	public AppiumObject getAppiumObject() {
		return appiumObject;
	}

	public void setAppiumObject(AppiumObject appiumObject) {
		this.appiumObject = appiumObject;
	}
}

