package com.plugin.appium;

import java.util.List;
import java.util.Stack;
import java.util.logging.Logger;

import javax.xml.bind.JAXBException;

import com.crestech.opkey.plugin.communication.contracts.functioncall.FunctionCall.ObjectArguments.ObjectArgument;
import com.crestech.opkey.plugin.communication.contracts.functioncall.Object;
import com.crestech.opkey.plugin.communication.contracts.functioncall.Object.Properties.Property;
import com.crestech.opkey.plugin.functiondispatch.ArgumentFormatter;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.exceptionhandlers.ObjectPropertiesNotSufficientException;

public class ObjectFormatter extends ArgumentFormatter {
	Logger logger = Logger.getLogger(AppiumObject.class.getName());

	public AppiumObject formatObjectToWebDriverObject(Object currentObj) throws ObjectPropertiesNotSufficientException {
		Stack<Object> stk = new Stack<Object>();
		stk.push(currentObj);

		// lets push the current object hierarchy into a stack, so that when
		// retreiving, we can traverse from child to object. This is similar to
		// reversing the Object hierarchy
		if (currentObj == null) {
			return new AppiumObject(false);
		}

		while (currentObj.getChildObject() != null) {
			currentObj = currentObj.getChildObject().getObject();
			stk.push(currentObj);
		}

		// Now, the stack should be somewhat like this :
		// childObj -- parentObject -- grandParentObject -....- rootParentObject

		if (stk.size() == 0)
			throw new ObjectPropertiesNotSufficientException();

		// Now, we will frame/mould the WebDriver Object
		Object stkObject = stk.pop();
		AppiumObject obj = new AppiumObject(stkObject.isUseSmartIdentification());
		this.fillObjectProperties(obj, stkObject.getProperties().getProperty(), true);

		try {
			this.setParentObjectHierarchy(obj, stk);
		} catch (JAXBException e) {
			// e.printStackTrace();
			System.out.println("Warning exception while formatObjectToWebDriverObject: " + e.getMessage());
		}

		System.out.println("############### " + obj.toString());
		return obj;
	}
	
	@Override
	protected java.lang.Object FormatObjectArgument(ObjectArgument oArg) throws ObjectPropertiesNotSufficientException {
		Stack<Object> stk = new Stack<Object>();
		Object currentObj = oArg.getObject();
		stk.push(currentObj);

		// lets push the current object hierarchy into a stack, so that when
		// retreiving, we can traverse from child to object. This is similar to
		// reversing the Object hierarchy
		if (currentObj == null) {
			return new AppiumObject(false);
		}

		while (currentObj.getChildObject() != null) {
			currentObj = currentObj.getChildObject().getObject();
			stk.push(currentObj);
		}

		// Now, the stack should be somewhat like this :
		// childObj -- parentObject -- grandParentObject -....- rootParentObject

		if (stk.size() == 0)
			throw new ObjectPropertiesNotSufficientException();

		// Now, we will frame/mould the WebDriver Object
		Object stkObject = stk.pop();
		AppiumObject obj = new AppiumObject(stkObject.isUseSmartIdentification());
		this.fillObjectProperties(obj, stkObject.getProperties().getProperty(), true);

		try {
			this.setParentObjectHierarchy(obj, stk);
		} catch (JAXBException e) {
			System.out.println("Warning exception while formatObjectToWebDriverObject: " + e.getMessage());
			//e.printStackTrace();
		}

		System.out.println("############### " + obj.toString());
		return obj;
	}

	/**
	 * This method will take care of setting all the parent Object hierarchy, and its properties. The method will call itself recursively assuming the following parameters:
	 * 
	 * 
	 * @param obj
	 *            = The leaf WebDriverObject on which an operation will be performed, and its parent hierarchy is needed to be set
	 * @param stk
	 *            = Contains the immediate parents, in order, of the obj
	 * @throws ObjectPropertiesNotSufficientException
	 * @throws JAXBException
	 */
	private void setParentObjectHierarchy(AppiumObject obj, Stack<Object> stk) throws ObjectPropertiesNotSufficientException, JAXBException {
		if (stk.size() > 0) {
			Object stkObj = stk.pop();
			AppiumObject parentObj = new AppiumObject(stkObj.isUseSmartIdentification());

			// set the object-properties
			this.fillObjectProperties(parentObj, stkObj.getProperties().getProperty(), false);

			// set the parent
			obj.setParentObject(parentObj);
			this.setParentObjectHierarchy(parentObj, stk);

		}
	}

	public AppiumObject fillObjectProperties(AppiumObject obj, List<Property> objectproperties, Boolean alsoValidateProperties) throws ObjectPropertiesNotSufficientException {

		for (Property prp : objectproperties) {

			if (prp.getName().equalsIgnoreCase("ID")) {
				obj.getId().setValue(prp.getValue());
				obj.getId().setIsUsed(prp.isIsUsed());

			}
			else if (prp.getName().equalsIgnoreCase("resource-id")) {
				obj.getResourceId().setValue(prp.getValue());
				obj.getResourceId().setIsUsed(prp.isIsUsed());

			}
			else if (prp.getName().equalsIgnoreCase("Content Description")) {
				obj.getContentDesc().setValue(prp.getValue());
				obj.getContentDesc().setIsUsed(prp.isIsUsed());

			}
			else if (prp.getName().equalsIgnoreCase("text")) {
				obj.getText().setValue(prp.getValue());
				obj.getText().setIsUsed(prp.isIsUsed());

			}

			// if id value is null or empty then id valued filled by resource id
			else if (prp.getName().toUpperCase().endsWith("ID") && obj.getId().isValueNullOrEmpty()) {
				obj.getId().setValue(prp.getValue());
				obj.getId().setIsUsed(prp.isIsUsed());
			}

			else if (prp.getName().equalsIgnoreCase("Class")) {
				obj.getClassName().setValue(prp.getValue());
				obj.getClassName().setIsUsed(prp.isIsUsed());

			} else if (prp.getName().equalsIgnoreCase("Type")) {
				// For SELENDROID Objects, the Class Property is referred as
				// Type
				obj.getClassName().setValue(prp.getValue());
				obj.getClassName().setIsUsed(prp.isIsUsed());
				
				if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice || AppiumContext.getDeviceType() == DeviceType.IPhoneSimulator ) {
					obj.getType().setValue(prp.getValue());
					obj.getType().setIsUsed(prp.isIsUsed());
				}				

			} else if (prp.getName().equalsIgnoreCase("Tag")) {
				obj.getTagName().setValue(prp.getValue());
				obj.getTagName().setIsUsed(prp.isIsUsed());

			} else if (prp.getName().equalsIgnoreCase("Name")) {
				obj.getName().setValue(prp.getValue());
				refactorProperty(obj, prp);

			}

			else if (prp.getName().equalsIgnoreCase("src")) {
				// Fill the src property in object for frame switching
				obj.getSrc().setValue(prp.getValue());
				obj.getSrc().setIsUsed(prp.isIsUsed());
				refactorProperty(obj, prp);
			}

			else if (prp.getName().equalsIgnoreCase("url")) {
				// Fill the url property in object for frame switching
				obj.getUrl().setValue(prp.getValue());
				obj.getUrl().setIsUsed(prp.isIsUsed());
				refactorProperty(obj, prp);
			}

			// if name value is null or empty then name valued filled by Content
			// Description
			else if (prp.getName().equalsIgnoreCase("Content Description") && obj.getName().isValueNullOrEmpty()) {
				System.out.println("Filled content decription in name property ");
				obj.getName().setValue(prp.getValue());
				obj.getName().setIsUsed(prp.isIsUsed());
			}

			else if (prp.getName().equalsIgnoreCase("innertext")) {
				obj.getInnerText().setValue(prp.getValue());
				obj.getInnerText().setIsUsed(prp.isIsUsed());

			} else if (prp.getName().toLowerCase().contains("xpath")) {
				obj.getXPaths().add(new AppiumObjectProperty(prp));

			} else if (prp.getName().toLowerCase().contains("css")) {
				obj.getCssSelectors().add(new AppiumObjectProperty(prp));

			} else if (prp.getName().toLowerCase().contains("value")) {
				obj.getValue().setValue(prp.getValue());
				obj.getValue().setIsUsed(prp.isIsUsed());

			} else if (prp.getName().equalsIgnoreCase("index") && prp.getValue() != null && prp.getValue().trim().length() > 0) {
				obj.index = Integer.valueOf(prp.getValue());
				obj.getIndex().setValue(prp.getValue());
			}
			
			else if (prp.getName().toLowerCase().contains("texttosearch")) {
				obj.getTextToSearch().setValue(prp.getValue());
				obj.getTextToSearch().setIsUsed(prp.isIsUsed());

			}
			
			
			else if (prp.getName().toLowerCase().contains("before")) {
				obj.getBefore().setValue(prp.getValue());
				obj.getBefore().setIsUsed(prp.isIsUsed());

			}
			
			else if (prp.getName().toLowerCase().contains("after")) {
				obj.getAfter().setValue(prp.getValue());
				obj.getAfter().setIsUsed(prp.isIsUsed());

			}
			
			else if (prp.getName().toLowerCase().contains("partialText")) {
				obj.getPartialText().setValue(prp.getValue());
				obj.getPartialText().setIsUsed(prp.isIsUsed());

			}
			
			else if (prp.getName().toLowerCase().contains("SF_IsMultipleDropdown")) {
				obj.getSF_IsMultipleDropdown().setValue(prp.getValue());
				obj.getSF_IsMultipleDropdown().setIsUsed(prp.isIsUsed());

			}

			else if (prp.getName().toLowerCase().contains("window")) {
				obj.setWindowHandle(prp.getValue());
			}

			else if (prp.getName().toLowerCase().contains("parent") && prp.getValue() != null && prp.getValue().toLowerCase().contains("xml")) {
				/*
				 * try { obj.setParentObject(prp.getValue()); } catch (JAXBException e) { System.err.println("Unable to parse parent property xml"); e.printStackTrace(); }
				 */
			}

		}

		if (alsoValidateProperties)
			obj.ValidateProperties();
		return obj;
	}

	// in the case of toggle/switch name property set isUsed property is false
	private void refactorProperty(AppiumObject object, Property prp) {
		String className = object.getClassName().getValue();
		if ((className != null && (className.contains("android.widget.Switch") || className.contains("android.widget.ToggleButton")))) {
			logger.info("In the case of  toggle/switch name property set isUsed property is false");
			object.getName().setIsUsed(false);
		} else {
			object.getName().setIsUsed(prp.isIsUsed());
		}
	}
}