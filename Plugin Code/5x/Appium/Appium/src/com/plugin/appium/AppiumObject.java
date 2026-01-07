package com.plugin.appium;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;

import com.plugin.appium.ArrayOfParentProperties.ParentProperties;
import com.plugin.appium.exceptionhandlers.ObjectPropertiesNotSufficientException;

public class AppiumObject {

	Logger logger = Logger.getLogger(AppiumObject.class.getName());

	private Boolean useSmartIdentification = false;

	private AppiumObject parentObject = null;

	private AppiumObjectProperty name;
	private AppiumObjectProperty type;

	private AppiumObjectProperty id;
	private AppiumObjectProperty resourceId;
	private AppiumObjectProperty contentDesc;
	private AppiumObjectProperty text;
	private AppiumObjectProperty tagName;
	private AppiumObjectProperty className;
	private AppiumObjectProperty innerText;
	private AppiumObjectProperty value;
	private AppiumObjectProperty url;
	private AppiumObjectProperty src;
	private AppiumObjectProperty title;
	private AppiumObjectProperty TextToSearch;
	private AppiumObjectProperty PartialText;
	private AppiumObjectProperty Before;
	private AppiumObjectProperty After;
	private AppiumObjectProperty Index;
	private AppiumObjectProperty SF_IsMultipleDropdown;

	public Integer index = null;

	private String windowHandle;

	private List<AppiumObjectProperty> cssSelectors;
	private List<AppiumObjectProperty> xPaths;

	public AppiumObject(Boolean useSmartIdentification) {
		this.useSmartIdentification = useSmartIdentification;

		this.name = new AppiumObjectProperty("name", null, false);
		this.type = new AppiumObjectProperty("type", null, false);
		this.windowHandle = "";
		this.id = new AppiumObjectProperty("id", null, false);
		this.resourceId = new AppiumObjectProperty("Resource-ID", null, false);
		this.contentDesc = new AppiumObjectProperty("Content Description", null, false);
		this.text = new AppiumObjectProperty("text", null, false);
		this.tagName = new AppiumObjectProperty("tagName", "", false);
		this.className = new AppiumObjectProperty("className", null, false);
		this.innerText = new AppiumObjectProperty("innerText", null, false);
		this.value = new AppiumObjectProperty("value", null, false);
		this.url = new AppiumObjectProperty("url", null, false);
		this.src = new AppiumObjectProperty("url", null, false);
		this.title = new AppiumObjectProperty("title", null, false);
		this.cssSelectors = new ArrayList<AppiumObjectProperty>();
		this.xPaths = new ArrayList<AppiumObjectProperty>();
		this.TextToSearch = new AppiumObjectProperty("TextToSearch", null, false);
		this.PartialText = new AppiumObjectProperty("PartialText", null, false);
		this.Before = new AppiumObjectProperty("Before", null, false);
		this.After = new AppiumObjectProperty("After", null, false);
		this.Index = new AppiumObjectProperty("Index", null, false);
		this.SF_IsMultipleDropdown = new AppiumObjectProperty("SF_IsMultipleDropdown", null, false);

	}

	public AppiumObject getParentObject() {
		return this.parentObject;
	}

	public void setParentObject(AppiumObject parentObject) {
		this.parentObject = parentObject;
	}

	/**
	 * Can be used to set the parent hierarchy of a AppiumObject as per OpKey
	 * current implementation of Serialized Parent XML. Refer Class
	 * {@link ArrayOfParentProperties} for more details.
	 * 
	 * @param parentHierarchyXml
	 * @throws JAXBException
	 */
	@Deprecated
	public void setParentObject(String parentHierarchyXml) throws JAXBException {
		JAXBContext frameXmlContext = JAXBContext.newInstance(ArrayOfParentProperties.class);
		Unmarshaller frameDeserializer = frameXmlContext.createUnmarshaller();

		ArrayOfParentProperties xml = (ArrayOfParentProperties) frameDeserializer.unmarshal(new StringReader(parentHierarchyXml));
		AppiumObject currentObj = this;
		for (ParentProperties pProp : xml.getParentProperties()) {

			AppiumObject immediateParent = new AppiumObject(true);

			immediateParent.name = new AppiumObjectProperty("name", pProp.name, pProp.name != null);
			immediateParent.type = new AppiumObjectProperty("type", pProp.type, pProp.type != null);
			immediateParent.id = new AppiumObjectProperty("id", pProp.id, pProp.id != null);
			immediateParent.url = new AppiumObjectProperty("url", pProp.url, pProp.url != null);
			immediateParent.src = new AppiumObjectProperty("src", pProp.src, pProp.src != null);
			immediateParent.title = new AppiumObjectProperty("title", pProp.title, pProp.title != null);

			immediateParent.index = Integer.valueOf(new AppiumObjectProperty("index", "" + pProp.index, pProp.index > -1).getValue());
			if (pProp.tag != null) {
				immediateParent.tagName = new AppiumObjectProperty("tagName", pProp.tag, pProp.tag != null);
			} else {
				immediateParent.tagName = new AppiumObjectProperty("tagName", pProp.type, pProp.type != null);
			}
			currentObj.setParentObject(immediateParent);
			currentObj = immediateParent;
		}
	}

	public Boolean useSmartIdentification() {
		return this.useSmartIdentification;
	}

	public AppiumObjectProperty getIndex() {
		return Index;
	}

	public AppiumObjectProperty getTextToSearch() {
		return TextToSearch;
	}

	public AppiumObjectProperty getPartialText() {
		return PartialText;
	}

	public AppiumObjectProperty getBefore() {
		return Before;
	}

	public AppiumObjectProperty getAfter() {
		return After;
	}

	public AppiumObjectProperty getSF_IsMultipleDropdown() {
		return SF_IsMultipleDropdown;
	}

	public AppiumObjectProperty getId() {
		return this.id;
	}

	public AppiumObjectProperty getResourceId() {
		return this.resourceId;
	}
	
	public AppiumObjectProperty getContentDesc() {
		return this.contentDesc;
	}

	public AppiumObjectProperty getText() {
		return this.text;
	}
	
	public AppiumObjectProperty getTagName() {
		return this.tagName;
	}

	public AppiumObjectProperty getClassName() {
		return this.className;
	}

	public AppiumObjectProperty getName() {
		return this.name;
	}

	public AppiumObjectProperty getType() {
		return this.type;
	}

	public AppiumObjectProperty getInnerText() {
		return this.innerText;
	}

	public AppiumObjectProperty getValue() {
		return this.value;
	}

	public List<AppiumObjectProperty> getCssSelectors() {
		return this.cssSelectors;
	}

	public List<AppiumObjectProperty> getXPaths() {
		return this.xPaths;
	}

	public AppiumObjectProperty getTitle() {
		return this.title;
	}

	public String getWindowHandle() {
		AppiumObject currentObject = this;
		while (currentObject.getParentObject() != null) {
			currentObject = currentObject.getParentObject();

		}
		return currentObject.windowHandle;

	}

	public AppiumObjectProperty getSrc() {
		return this.src;
	}

	public AppiumObjectProperty getUrl() {
		return this.url;
	}

	void setWindowHandle(String windowHandle) {
		this.windowHandle = windowHandle;
	}

	/**
	 * Method can be used to validate whether all the minimum-required set of
	 * properties exists in the object or not
	 */
	void ValidateProperties() throws ObjectPropertiesNotSufficientException {

		if (className.getValue() != null && className.getValue().contains(" ")) {
			System.out.println("@ClassName with space. replacing space with (.): " + className.getValue());
			// http://stackoverflow.com/questions/15699900/compound-class-names-are-not-supported-error-in-webdriver
			System.err.println("Compound Class names are not supported in webdriver." + "Transforming compound class name into css-selector");
			this.cssSelectors.add(new AppiumObjectProperty("cssSelector", className.getValue().replace(" ", "."), className.isUsed()));
			className.setValue(null);
		}

		// TAG & INNERTEXT
		if (innerText.isValueNullOrEmpty() == false && tagName.isValueNullOrEmpty() == false && innerText.isUsed()) {
			// try to create an xPath
			String intermediateXpath = "//" + this.tagName.getValue() + "[contains(text(), \"" + this.innerText.getValue() + "\")]";
			this.xPaths.add(new AppiumObjectProperty("xPath", intermediateXpath, true));
		}

		// @Resource-ID
		if (!resourceId.isValueNullOrEmpty() && this.resourceId.isUsed()) {
			String tag = "*";
			if(!this.tagName.isValueNullOrEmpty()) {
				tag = this.tagName.getValue();
			}
			if (className.getValue() != null && this.className.isUsed()) {
				
				String classvalue = className.getValue();
				String customXpath = "//" + classvalue + "[contains(@resource-id, '" + this.resourceId.getValue() + "')]";
				this.xPaths.add(new AppiumObjectProperty("xPath", customXpath, true));
			}
			String intermediateXpath = "//" + tag + "[@resource-id='" + this.resourceId.getValue() + "']";
			this.xPaths.add(new AppiumObjectProperty("xPath", intermediateXpath, true));
		}
		
		// @Content-Desc
		if (!this.contentDesc.isValueNullOrEmpty() && this.contentDesc.isUsed()) {
			String tag = "*";
			if(!this.tagName.isValueNullOrEmpty()) {
				tag = this.tagName.getValue();
			}
			String intermediateXpath = "//" + tag + "[@content-desc='" + this.contentDesc.getValue() + "']";
			this.xPaths.add(new AppiumObjectProperty("xPath", intermediateXpath, true));
		}
		
		// @Text
		if (!this.text.isValueNullOrEmpty() && this.text.isUsed()) {
			String tag = "*";
			if(!this.tagName.isValueNullOrEmpty()) {
				tag = this.tagName.getValue();
			}
			String intermediateXpath = "//" + tag + "[@text='" + this.text.getValue() + "']";
			this.xPaths.add(new AppiumObjectProperty("xPath", intermediateXpath, true));
		}

		// TAG & VALUE
		if (innerText.isValueNullOrEmpty() == false && value.isValueNullOrEmpty() == false && value.isUsed()) {
			String intermediateXpath = "//" + this.tagName.getValue() + "[@value = \"" + this.value.getValue() + "\"]";
			this.xPaths.add(new AppiumObjectProperty("xPath", intermediateXpath, true));
		}

		// Causing problem while byText keywords.
		/*if (id.isValueNullOrEmpty() && name.isValueNullOrEmpty() && className.isValueNullOrEmpty() && TextToSearch.isValueNullOrEmpty() && cssSelectors.size() == 0 && xPaths.size() == 0) {
			throw new ObjectPropertiesNotSufficientException();
		}*/

		// validate xpath remove 'xpath='
		for (AppiumObjectProperty xpath : this.xPaths) {
			if (xpath.getValue().startsWith("xpath=")) {
				xpath.setValue(xpath.getValue().substring(6));
			}
		}

		// validate extra spaces in class names, ID & Name
		if (className.getValue() != null) {
			if (className.getValue().length() > className.getValue().trim().length()) {
				logger.warning("BlankSpace found in ClassName. Trimming it...");
				className.setValue(className.getValue().trim());
			}

		}
		if (id.getValue() != null) {
			if (id.getValue().length() > id.getValue().trim().length()) {
				logger.warning("BlankSpace found in Id. Trimming it...");
				id.setValue(id.getValue().trim());
			}
		}

		// If we remove space from name property then appium not able to find by name
		// without space
		// taxi.sixcrore.customer.apk next->next->Getsrart->getservice-> sigh up is a
		// object

		// if (name.getValue() != null) {
		// if (name.getValue().length() > name.getValue().trim().length()) {
		// logger.warning("BlankSpace found in Name. Trimming it...");
		// name.setValue(name.getValue().trim());
		// }
		// }
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();

		if (this.tagName.getValue() != null)
			sb.append(this.tagName + " ");
		if (this.id.getValue() != null)
			sb.append(id + " ");
		if (this.name.getValue() != null)
			sb.append(this.name + " ");
		/*
		 * if (this.type.getValue() != null) sb.append(this.type + " ");
		 */
		if (this.className.getValue() != null)
			sb.append(this.className + " ");
		if (this.innerText.getValue() != null)
			sb.append(this.innerText + " ");

		for (AppiumObjectProperty css : this.cssSelectors) {
			sb.append(css + " ");
		}
		for (AppiumObjectProperty xPath : this.xPaths) {
			sb.append(xPath + " ");
		}

		AppiumObject currentObject = this;
		sb.append(" **ParentHierarchy: {");
		while (currentObject.getParentObject() != null) {
			currentObject = currentObject.getParentObject();

			if (currentObject.name.getValue() != null && currentObject.name.getValue().trim().length() > 0) {
				String name = currentObject.name.getValue();
				sb.append(" --> " + name);
			} else if (currentObject.id.getValue() != null) {
				sb.append(" --> " + currentObject.id.getValue());
			}

		}
		sb.append("}");

		return sb.toString();
	}
}
