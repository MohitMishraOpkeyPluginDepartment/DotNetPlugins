package com.plugin.appium.javascript.jstools;

import java.util.UUID;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.logging.OpkeyLogger;
import com.plugin.appium.Finder;
import com.plugin.appium.Log;
import com.plugin.appium.Utils;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.javascript.JSExecutor;

public class JSTool {
	
	static public Class _class = JSTool.class;

	public void clearText(WebElement _element) {
		JSExecutor js = new JSExecutor();
		try {
			js.executeScript("arguments[0].value=''", _element);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public String AttachFakePassDetector(WebElement element) {
		String _guid = UUID.randomUUID().toString();
		String scriptContent = Utils.getJavaScriptScriptContent(JSTool.class, "domevent.js");
		try {
			((JavascriptExecutor) Finder.findAppiumDriver()).executeScript(
					scriptContent + " opkey_setIdentifierOnElement(arguments[0],'" + _guid + "')", element);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return _guid;
	}

	public String isFakeClickOccured(WebElement element, String guid) {
		try {
			//String element_guid = (String) ((JavascriptExecutor)Finder.findWebDriver()).executeScript("return arguments[0].getAttribute('opkey_elementGuid');", element);
			String element_guid=element.getAttribute("opkey_elementGuid");
			if (element_guid == null) {
				OpkeyLogger.printLog(_class, ">>Clicked on Wrong Object Retrying");
				return "CLICK_WRONG_OBJECT";
			}
			OpkeyLogger.printLog(_class, ">>Fetched Element Guid <" + element_guid + "> Actual Element Guid <" + guid + ">");
			if (element_guid.equals(guid)) {
				OpkeyLogger.printLog(_class, ">>Clicked on Actual Object");
				return "CLICK_OK";
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
		try {
			String fakeData = (String) ((JavascriptExecutor) Finder.findAppiumDriver()).executeScript(
					"var ret_data=window.opkey_trigger; window.opkey_trigger='FAKE_PASS'; return ret_data;");
			if (fakeData == null) {
				OpkeyLogger.printLog(_class, "Null Fake Data Found");
				return "CLICK_OK";
			}
			OpkeyLogger.printLog(_class, ">>Click Action " + fakeData);
			if (fakeData.trim().equals("FAKE_PASS")) {
				OpkeyLogger.printLog(_class, "Fake Click Action Detected Retrying");
				return "CLICK_FAKE";
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "CLICK_OK";
	}

	public WebElement getClickAbleParent(WebElement element) {
		String scriptContent = Utils.getJavaScriptScriptContent(JSTool.class, "jstool.js");
		JSExecutor js = new JSExecutor();
		try {
			WebElement _element = (WebElement) js
					.executeScript(scriptContent + "return opkey_getClickAbleElement(arguments[0])", element);
			if (_element != null) {
				OpkeyLogger.printLog(_class, ">>Clickable Parent Found " + _element.getTagName());
				return _element;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return element;
	}

	public String getAttribute(WebElement element, String attrName) {
		JSExecutor js = new JSExecutor();
		try {
			Object attributeValue = js.executeScript("return arguments[0].getAttribute('" + attrName + "')", element);
			if (attributeValue != null) {
				return (String) attributeValue;
			}

		} catch (ToolNotSetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public String getOuterHTML(WebElement element) {
		try {
			Object attributeValue = ((JavascriptExecutor) Finder.findAppiumDriver())
					.executeScript("return arguments[0].outerHTML;", element);
			if (attributeValue != null) {
				return (String) attributeValue;
			}

		} catch (ToolNotSetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	
	public boolean isApplicableAttributeAvailableForVisibilityCheck(WebElement element) {
		String scriptContent = Utils.getJavaScriptScriptContent(JSTool.class, "jstool.js");
		JSExecutor js = new JSExecutor();
		try {
			boolean _status = (boolean) js.executeScript(
					scriptContent + "return isApplicableAttributeAvailableForVisibilityCheck(arguments[0])", element);
			OpkeyLogger.printLog(_class, ">>isApplicableAttributeAvailableForVisibilityCheck Status " + _status);
			return _status;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	
	public boolean isElementIsEnable(WebElement element) {
		String scriptContent = Utils.getJavaScriptScriptContent(JSTool.class, "jstool.js");
		JSExecutor js = new JSExecutor();
		try {
			boolean _status = (boolean) js.executeScript(
					scriptContent + "return isElementIsEnable(arguments[0])", element);
			OpkeyLogger.printLog(_class, ">>isElementIsEnable Status " + _status);
			return _status;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return true;
	}

	public String getElementTextContent(WebElement element) {
		String scriptContent = Utils.getJavaScriptScriptContent(JSTool.class, "jstool.js");
		JSExecutor js = new JSExecutor();
		try {
			String _text = (String) js.executeScript(scriptContent + "return getTextContent(arguments[0])", element);
			if (_text != null) {
				OpkeyLogger.printLog(_class, ">>JS TextContent is " + _text);
			}
			return _text;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public void performJavaScriptClick(WebElement _element) {
		OpkeyLogger.printLog(_class, ">>Performing Click Action by JavaScript Click");
		String scriptContent = JSClickStringScript.script;
		JSExecutor js = new JSExecutor();
		try {
			js.executeScript(scriptContent + " performOpKeyClick(arguments[0])", _element);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void performWaitAndClick(WebElement _element,int interval) {
		String scriptContent = Utils.getJavaScriptScriptContent(JSClick.class, "jsclick.js");
		JSExecutor js = new JSExecutor();
		Log.print("Performing Click");
		try {
			js.executeScript(scriptContent + " performWaitAndClick(arguments[0]," + interval + ");", _element);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void triggerMouseEvent(WebElement _element, String eventtype) {
		String scriptContent = Utils.getJavaScriptScriptContent(JSClick.class, "jsclick.js");
		JSExecutor js = new JSExecutor();
		try {
			js.executeScript(scriptContent + " opkey_triggerEvent(arguments[0],'" + eventtype + "')", _element);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void performFocusTrigger(WebElement _element) {
		String scriptContent = Utils.getJavaScriptScriptContent(JSClick.class, "jstool.js");
		JSExecutor js = new JSExecutor();
		try {
			js.executeScript(scriptContent + " opkey_triggerFocus(arguments[0])", _element);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void performDeFocusTrigger(WebElement _element) {
		String scriptContent = Utils.getJavaScriptScriptContent(JSClick.class, "jstool.js");
		JSExecutor js = new JSExecutor();
		try {
			js.executeScript(scriptContent + " opkey_triggerDeFocus(arguments[0])", _element);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void injectMouseEvents(WebElement _element) {
		String scriptContent = Utils.getJavaScriptScriptContent(JSClick.class, "jsclick.js");
		JSExecutor js = new JSExecutor();
		try {
			js.executeScript(scriptContent + " performMouseOver(arguments[0])", _element);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void scrollAllParents(WebElement _element) {
		String scriptContent = Utils.getJavaScriptScriptContent(JSClick.class, "scrolljs.js");
		JSExecutor js = new JSExecutor();
		try {
			js.executeScript(scriptContent + " opkey_scrollAllParents(arguments[0])", _element);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public boolean performVisibilityCheck(WebElement _element) {
		OpkeyLogger.printLog(_class, ">>Performing Visibility check by JavaScript");
		String scriptContent = Utils.getJavaScriptScriptContent(JSTool.class, "isVisible.js");
		JSExecutor js = new JSExecutor();
		boolean visible = false;
		try {
			visible = (boolean) js.executeScript(scriptContent, _element);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return visible;
	}

	public void performJavaScriptTypeText(WebElement _element, String dataToType) {
		OpkeyLogger.printLog(_class, "Type Text: Plan-B");
		String scriptContent = Utils.getJavaScriptScriptContent(JSTool.class, "JSTypeText.js");
		JSExecutor js = new JSExecutor();
		try {
			js.executeScript(scriptContent + " performOpKeyTypeText(arguments[0],'" + dataToType + "')", _element);
		} catch (Exception e) {
			System.out.println("Exception while performJavaScriptTypeText: ");
			e.printStackTrace();
		}
	}

//	public ElementRectangle getElementRectangle(WebElement _element) {
//		String scriptContent = Utils.getJavaScriptScriptContent(JSTool.class, "ElementRectangle.js");
//		JSExecutor js = new JSExecutor();
//		try {
//			String _point = (String) js.executeScript(scriptContent + "return opkey_getElementRectangle(arguments[0])",
//					_element);
//			OpkeyLogger.printLog(_class, ">>Element Rectangle " + _point);
//			JSONObject _rectObject = new JSONObject(_point);
//			int _elementX = _rectObject.getInt("X");
//			int _elementY = _rectObject.getInt("Y");
//			int _elementWidth = _rectObject.getInt("Width");
//			int _elementHeight = _rectObject.getInt("Height");
//			int _windowWidth = _rectObject.getInt("WindowWidth");
//			int _windowHeight = _rectObject.getInt("WindowHeight");
//
//			OpkeyLogger.printLog(_class, ">>ElementRectangle X = " + _elementX);
//			OpkeyLogger.printLog(_class, ">>ElementRectangle Y = " + _elementY);
//			OpkeyLogger.printLog(_class, ">>ElementRectangle Width = " + _elementWidth);
//			OpkeyLogger.printLog(_class, ">>ElementRectangle Height = " + _elementHeight);
//			OpkeyLogger.printLog(_class, ">>ElementRectangle WindowWidth = " + _windowWidth);
//			OpkeyLogger.printLog(_class, ">>ElementRectangle WindowHeight = " + _windowHeight);
//			return new ElementRectangle(_elementX, _elementY, _elementWidth, _elementHeight, _windowWidth,
//					_windowHeight);
//		} catch (Exception e) {
//			e.printStackTrace();
//			return null;
//		}
//	}

//	public ElementRectangle getElementSize(WebElement _element) {
//		String scriptContent = Utils.getJavaScriptScriptContent(JSTool.class, "ElementRectangle.js");
//		JSExecutor js = new JSExecutor();
//		try {
//			String _point = (String) js.executeScript(scriptContent + "return opkey_getElementSize(arguments[0])",
//					_element);
//			OpkeyLogger.printLog(_class, ">>ElementSize " + _point);
//			JSONObject _rectObject = new JSONObject(_point);
//			int _elementX = _rectObject.getInt("X");
//			int _elementY = _rectObject.getInt("Y");
//			int _elementWidth = _rectObject.getInt("Width");
//			int _elementHeight = _rectObject.getInt("Height");
//			int _windowWidth = _rectObject.getInt("WindowWidth");
//			int _windowHeight = _rectObject.getInt("WindowHeight");
//			OpkeyLogger.printLog(_class, ">>ElementSize Width = " + _elementWidth);
//			OpkeyLogger.printLog(_class, ">>ElementSize Height = " + _elementHeight);
//			return new ElementRectangle(_elementX, _elementY, _elementWidth, _elementHeight, _windowWidth,
//					_windowHeight);
//		} catch (Exception e) {
//			e.printStackTrace();
//			return null;
//		}
//	}

	public boolean isElementIsInsideViewPort(WebElement _element) {
		OpkeyLogger.printLog(_class, ">>ViewPortCheck Checking Whether Element Is Visible in View Port");
		String scriptContent = Utils.getJavaScriptScriptContent(JSTool.class, "ISINView.js");
		JSExecutor js = new JSExecutor();
		try {
			boolean isinview = (boolean) js.executeScript(scriptContent + "return inView(arguments[0])", _element);
			if (isinview) {
				OpkeyLogger.printLog(_class, ">>Element is inside View Port");
			} else {
				OpkeyLogger.printLog(_class, ">>Element is Not inside View Port");
			}
			return isinview;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return true;
	}
}
