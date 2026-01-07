package com.plugin.appium.pagesource;

public class PagesourceElement {

    private String index;
    private String focusable;
    private String focused;
    private String longclickable;
    private String packageName;
    private String password;
    private String resourceid;
    private String scrollable;
    private String selected;
    private String text;
    private String bounds;
    private String checkable;
    private String checked;
    private String className;
    private String clickable;
    private String contentdesc;
    private String enabled;
    private String xpath;
    private String parentClass;
    

    public String getParentClass() {
        return parentClass;
    }

    public void setParentClass(String parentClass) {
        this.parentClass = parentClass;
    }

    public String getXpath() {
        return xpath;
    }

    public void setXpath(String xpath) {
        this.xpath = xpath;
    }

    public PagesourceElement(String index, String focusable, String focused, String longclickable, String packageName,
	    String password, String resourceid, String scrollable, String selected, String text, String bounds,
	    String checkable, String checked, String className, String clickable, String contentdesc, String enabled,String xpath,String parentClass) {
	super();
	this.parentClass = parentClass;
	this.index = index;
	this.focusable = focusable;
	this.focused = focused;
	this.longclickable = longclickable;
	this.packageName = packageName;
	this.password = password;
	this.resourceid = resourceid;
	this.scrollable = scrollable;
	this.selected = selected;
	this.text = text;
	this.bounds = bounds;
	this.checkable = checkable;
	this.checked = checked;
	this.className = className;
	this.clickable = clickable;
	this.contentdesc = contentdesc;
	this.enabled = enabled;
	this.xpath = xpath;
    }

    public String getIndex() {
	return index;
    }

    public void setIndex(String index) {
	this.index = index;
    }

    public String getFocusable() {
	return focusable;
    }

    public void setFocusable(String focusable) {
	this.focusable = focusable;
    }

    public String getFocused() {
	return focused;
    }

    public void setFocused(String focused) {
	this.focused = focused;
    }

    public String getLongclickable() {
	return longclickable;
    }

    public void setLongclickable(String longclickable) {
	this.longclickable = longclickable;
    }

    public String getPackageName() {
	return packageName;
    }

    public void setPackageName(String packageName) {
	this.packageName = packageName;
    }

    public String getPassword() {
	return password;
    }

    public void setPassword(String password) {
	this.password = password;
    }

    public String getResourceid() {
	return resourceid;
    }

    public void setResourceid(String resourceid) {
	this.resourceid = resourceid;
    }

    public String getScrollable() {
	return scrollable;
    }

    public void setScrollable(String scrollable) {
	this.scrollable = scrollable;
    }

    public String getSelected() {
	return selected;
    }

    public void setSelected(String selected) {
	this.selected = selected;
    }

    public String getText() {
	return text;
    }

    public void setText(String text) {
	this.text = text;
    }

    public String getBounds() {
	return bounds;
    }

    public void setBounds(String bounds) {
	this.bounds = bounds;
    }

    public String getCheckable() {
	return checkable;
    }

    public void setCheckable(String checkable) {
	this.checkable = checkable;
    }

    public String getChecked() {
	return checked;
    }

    public void setChecked(String checked) {
	this.checked = checked;
    }

    public String getClassName() {
	return className;
    }

    public void setClassName(String className) {
	this.className = className;
    }

    public String getClickable() {
	return clickable;
    }

    public void setClickable(String clickable) {
	this.clickable = clickable;
    }

    public String getContentdesc() {
	return contentdesc;
    }

    public void setContentdesc(String contentdesc) {
	this.contentdesc = contentdesc;
    }

    public String getEnabled() {
	return enabled;
    }

    public void setEnabled(String enabled) {
	this.enabled = enabled;
    }

    public PagesourceElement() {

    }
}
