package com.plugin.appium.pagesource;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import com.plugin.appium.AppiumObject;
import com.plugin.appium.AppiumObjectProperty;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

public class PagesourceUtil {
    public static List<PagesourceElement> arrayOfElements = new ArrayList<PagesourceElement>();

    public static List<PagesourceElement> getArrayOfElements() {
	return arrayOfElements;
    }

    public static void setArrayOfElements(List<PagesourceElement> arrayOfElements) {
	PagesourceUtil.arrayOfElements = arrayOfElements;
    }

    public static List<PagesourceElement> ElementFinder(AppiumObject object) {
	List<PagesourceElement> elementsInBucket = new ArrayList<>();

	if (elementsInBucket.size() != 1 && object.getId().getValue() != null) {
	    Log.print("Search by ID");
	    elementsInBucket = filterElementAccordingToRequest("id", object.getId().getValue());
	}

	if (elementsInBucket.size() != 1 && object.getClassName().getValue() != null) {
	    Log.print("Search  by class");
	    elementsInBucket = filterElementAccordingToRequest("class", object.getClassName().getValue());
	}

	if (elementsInBucket.size() != 1 && object.getName().getValue() != null) {
	    Log.print("Search by Name");
	    elementsInBucket = filterElementAccordingToRequest("Name", object.getName().getValue());
	}
	if (elementsInBucket.size() != 1 && object.getText().getValue() != null) {
	    Log.print("Search by Text");
	    elementsInBucket = filterElementAccordingToRequest("Name", object.getText().getValue());
	}
	if (elementsInBucket.size() != 1 && object.getXPaths().size() != 0) {
	    Log.print("Search by xpath");
	    for (AppiumObjectProperty xpath : object.getXPaths()) {
		elementsInBucket = filterElementAccordingToRequest("xpath", xpath.toString());
		if (elementsInBucket.size() == 1) {
		    break;
		}
	    }

	}
	if (elementsInBucket.size() >= 1) {
	    return elementsInBucket;
	}
	return elementsInBucket;
    }

    public static List<PagesourceElement> filterElementAccordingToRequest(String tagname, String value) {
	List<PagesourceElement> filteredElements = new ArrayList<>();
	switch (value.toLowerCase()) {
	case "*":
	case "": {
	    filteredElements.addAll(PagesourceUtil.getArrayOfElements());
	    break;
	}
	case "id": {
	    for (PagesourceElement element : PagesourceUtil.getArrayOfElements()) {
		if (element.getResourceid() != null && element.getResourceid().equalsIgnoreCase(value))
		    filteredElements.add(element);
	    }
	    break;
	}
	case "class": {
	    for (PagesourceElement element : PagesourceUtil.getArrayOfElements()) {
		if (element.getClassName() != null && element.getClassName().equalsIgnoreCase(value))
		    filteredElements.add(element);
	    }
	    break;
	}

	case "name":
	case "text": {
	    for (PagesourceElement element : PagesourceUtil.getArrayOfElements()) {
		if (element.getText() != null && element.getText().equalsIgnoreCase(value))
		    filteredElements.add(element);
	    }
	    break;
	}
	case "partialtext": {
	    for (PagesourceElement element : PagesourceUtil.getArrayOfElements()) {
		if (element.getText() != null && element.getText().toLowerCase().contains(value.toLowerCase()))
		    filteredElements.add(element);
	    }
	    break;
	}
	case "xpath": {

	    for (PagesourceElement element : PagesourceUtil.getArrayOfElements()) {
		if (element.getXpath() != null && element.getXpath().equalsIgnoreCase(value))

		    filteredElements.add(element);
	    }
	    break;
	}

	default: {
	    System.out.println("Accessor not Implemented yet: " + value);

	}
	}
	return filteredElements;
    }

    public static String getXpath(Node node) {
	String xpath = "";
	if (node.getNodeName() == "hierarchy") {
	    return "";
	}
	if (node.hasAttributes()) {
	    NamedNodeMap nodeMap = node.getAttributes();
	    Node parentNode = node.getParentNode();
	    String className = nodeMap.getNamedItem("class").getNodeValue();
	    return xpath + getXpath(parentNode) + "//" + className;
	}
	return xpath;
    }

    public static String getParentClass(Node node) {
	String ParentClass = "";
	if (node.getNodeName() == "hierarchy") {
	    return "";
	}
	if (node.hasAttributes()) {
	    NamedNodeMap nodeMap = node.getAttributes();
	    String className = nodeMap.getNamedItem("class").getNodeValue();
	    ParentClass = className;
	}
	return ParentClass;
    }

    public static String getPageSource() throws ToolNotSetException {
	String source = "";
	try {
	    source = Finder.findAppiumDriver().getPageSource();
	} catch (Exception e) {
	    System.out.println("Exception while getting pagesource " + e.getMessage());
	}
	if (source != null) {
	    return source;
	}
	return source;
    }

    public static void addElementsInList(NodeList nodeList) {

	for (int count = 0; count < nodeList.getLength(); count++) {
	    Node tempNode = nodeList.item(count);
	    PagesourceElement ele = new PagesourceElement();
	    if (tempNode.hasAttributes()) {

		String xpath = PagesourceUtil.getXpath(tempNode);
		if (xpath != null) {
		    ele.setXpath(xpath);
		}

		String parentClass = PagesourceUtil.getParentClass(tempNode.getParentNode());
		if (parentClass != null) {
		    ele.setParentClass(parentClass);
		}

		NamedNodeMap nodeMap = tempNode.getAttributes();
		int numAttrs = nodeMap.getLength();
		for (int i = 0; i < numAttrs; i++) {
		    Attr attr = (Attr) nodeMap.item(i);
		    String attrName = attr.getNodeName();
		    String attrValue = attr.getNodeValue();
		    // System.out.println( attrName +" "+ attrValue);
		    if (attrName.equalsIgnoreCase("checkable")) {
			ele.setCheckable(attrValue);
		    }
		    if (attrName.equalsIgnoreCase("class")) {
			ele.setClassName(attrValue);
		    }
		    if (attrName.equalsIgnoreCase("clickable")) {
			ele.setClickable(attrValue);
		    }

		    if (attrName.equalsIgnoreCase("checked")) {
			ele.setChecked(attrValue);
		    }

		    if (attrName.equalsIgnoreCase("content-desc")) {
			ele.setContentdesc(attrValue);
		    }

		    if (attrName.equalsIgnoreCase("enabled")) {
			ele.setEnabled(attrValue);
		    }

		    if (attrName.equalsIgnoreCase("focusable")) {
			ele.setFocusable(attrValue);
		    }

		    if (attrName.equalsIgnoreCase("focused")) {
			ele.setFocused(attrValue);
		    }

		    if (attrName.equalsIgnoreCase("long-clickable")) {
			ele.setLongclickable(attrValue);
		    }

		    if (attrName.equalsIgnoreCase("package")) {
			ele.setPackageName(attrValue);
		    }

		    if (attrName.equalsIgnoreCase("password")) {
			ele.setPassword(attrValue);
		    }

		    if (attrName.equalsIgnoreCase("resource-id")) {
			ele.setResourceid(attrValue);
		    }

		    if (attrName.equalsIgnoreCase("scrollable")) {
			ele.setScrollable(attrValue);
		    }

		    if (attrName.equalsIgnoreCase("selected")) {
			ele.setSelected(attrValue);
		    }

		    if (attrName.equalsIgnoreCase("text")) {
			ele.setText(attrValue);
		    }
		}
	    }
	    PagesourceUtil.arrayOfElements.add(ele);
	    if (tempNode.hasChildNodes()) {
		// loop again if has child nodes
		addElementsInList(tempNode.getChildNodes());

	    }
	}

    }

    public static Document convertStringToDocument(String xmlStr) {
	DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
	DocumentBuilder builder;
	try {
	    builder = factory.newDocumentBuilder();
	    Document doc = builder.parse(new InputSource(new StringReader(xmlStr)));
	    return doc;
	} catch (Exception e) {
	    e.printStackTrace();
	}
	return null;
    }

    public static String convertDocumentToString(Document doc) {
	TransformerFactory tf = TransformerFactory.newInstance();
	Transformer transformer;
	try {
	    transformer = tf.newTransformer();
	    // below code to remove XML declaration
	    // transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
	    StringWriter writer = new StringWriter();
	    transformer.transform(new DOMSource(doc), new StreamResult(writer));
	    String output = writer.getBuffer().toString();
	    return output;
	} catch (TransformerException e) {
	    e.printStackTrace();
	}

	return null;
    }

    public static void createAndWriteToFile(String path, String xmlString) throws IOException {
	BufferedWriter out = new BufferedWriter(new FileWriter(path));
	try {
	    out.write(xmlString);
	} catch (IOException e) {
	    e.printStackTrace();
	} finally {
	    out.close();
	}

    }

}
