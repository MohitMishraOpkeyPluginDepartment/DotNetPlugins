package com.crestech.opkey.plugin.keywords;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.openqa.selenium.NoSuchSessionException;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.crestech.opkey.plugin.exceptionhandling.RetryKeywordAgainException;
import com.crestech.opkey.plugin.webdriver.OpkeyLogger;
import com.crestech.opkey.plugin.webdriver.enums.WEB_ELEMENT;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ObjectNotFoundException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ToolNotSetException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.exceptionmanager.ExceptionManager;
import com.crestech.opkey.plugin.webdriver.jstools.JSTool;
import com.crestech.opkey.plugin.webdriver.keywords.EditBox;
import com.crestech.opkey.plugin.webdriver.keywords.UnCategorised;
import com.crestech.opkey.plugin.webdriver.keywords.Utils;
import com.crestech.opkey.plugin.webdriver.keywords.WebObjects;
import com.crestech.opkey.plugin.webdriver.keywords.byText.ByTextKeywords;
import com.crestech.opkey.plugin.webdriver.keywords.byText.FinderByText;
import com.crestech.opkey.plugin.webdriver.object.ObjectProperty;
import com.crestech.opkey.plugin.webdriver.object.WebDriverObject;
import com.crestech.opkey.plugin.webdriver.util.Checkpoint;

public class EditField implements KeywordLibrary {
	
	static Class<EditField> _class = EditField.class;

	public FunctionResult Method_clearEditFieldUsingText(WebDriverObject object, String textSearch, int index, boolean isContains, boolean before)
			throws InterruptedException, ToolNotSetException, ObjectNotFoundException {

		String textValue = "";
		if (object.getTextToSearch().getValue() != null && (!object.getTextToSearch().getValue().isEmpty() || !object.getTextToSearch().getValue().equals(""))) {
			textSearch = object.getTextToSearch().getValue();
			OpkeyLogger.printSaasLog(_class, object.getIndex().getValue());
			try {
				index = Integer.parseInt(object.getIndex().getValue());
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "Index found Not to be Integer.Considering 0 as new Index");
				index = 0;
			}
			try {
				isContains = Boolean.parseBoolean(object.getPartialText().getValue());
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "PartialText found Not to be Boolean.Considering False as Default");
				isContains = false;
			}
			try {
				before = Boolean.parseBoolean(object.getBefore().getValue());
			} catch (Exception ex) {
				OpkeyLogger.printSaasLog(_class, "PartialText found Not to be Boolean.Considering False as Default");
				before = false;
			}
		} else {
			FunctionResult fr = null;
			try {
				fr = new EditBox().typeTextUsingTextHelper(textSearch, index, isContains, textValue, before);
			} catch (Exception ex) {
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
						.setMessage("No Object Found With Text <" + Context.current().getFunctionCall().getDataArguments().getDataArgument().get(0).getValue() + ">").make();
			}
			return fr;
		}
		FunctionResult fr = null;
		try {
			fr = new EditBox().typeTextUsingTextHelper(textSearch, index, isContains, textValue, before);
		} catch (Exception ex) {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setMessage("No Object Found With Text <" + textSearch + ">").setOutput(false).make();
		}
		if (fr.getOutput().equalsIgnoreCase("false")) {
			fr.setMessage("No Object Found With Text <" + textSearch + ">");
		}
		return fr;
	}

	public FunctionResult OF_typeTextUsingTextAndPressEnter(String OtextSearch, int Oindex, boolean OisContains, String textValue, boolean Obefore, WebDriverObject object) throws Exception {
		return new EditBox().Method_typeTextUsingTextAndPressKey(OtextSearch, Oindex, OisContains, textValue, Obefore, object, "enter");
	}
	
	public FunctionResult OF_SetDate(String OtextSearch, int Oindex, boolean OisContains, String textValue, boolean Obefore, WebDriverObject object) throws Exception {
		return new com.crestech.opkey.plugin.webdriver.keywords.EditBox().Method_typeTextUsingText(OtextSearch, Oindex, OisContains, textValue, Obefore, object);
	}
	
	public FunctionResult Method_typeTextUsingText(String OtextSearch, int Oindex, boolean OisContains,
			String textValue, boolean Obefore, WebDriverObject object) throws Exception {
		new ByTextKeywords().modifyObjectProperty(object);
		String textSearch = OtextSearch;
		int index = Oindex;
		boolean isContains = OisContains;
		boolean before = Obefore;
		String beforetext = "";
		String aftertext = "";
		System.out.println("inside Method_typeTextUsingTextAndPressKey");
		if (object.getTextToSearch().getValue() != null && (!object.getTextToSearch().getValue().isEmpty()
				|| !object.getTextToSearch().getValue().equals(""))) {
			textSearch = object.getTextToSearch().getValue();
			OpkeyLogger.printSaasLog(_class, object.getIndex().getValue());
			try {
				index = Integer.parseInt(object.getIndex().getValue());
			} catch (Exception ex) {
				new ExceptionManager().pushException(ex);
				OpkeyLogger.printSaasLog(_class, "Index found Not to be Integer.Considering 0 as new Index");
				index = 0;
			}
			try {

				isContains = Boolean.parseBoolean(object.getPartialText().getValue());
			} catch (Exception ex) {
				new ExceptionManager().pushException(ex);
				OpkeyLogger.printSaasLog(_class, "PartialText found Not to be Boolean.Considering False as Default");
				isContains = false;
			}
			try {

				before = Boolean.parseBoolean(object.getBefore().getValue());
			} catch (Exception ex) {
				new ExceptionManager().pushException(ex);
				OpkeyLogger.printSaasLog(_class, "PartialText found Not to be Boolean.Considering False as Default");
				before = false;
			}
			if (object.getBeforeText() != null && !object.getBeforeText().isValueNullOrEmpty()) {
				beforetext = object.getBeforeText().getValue();
			}

			if (object.getAfterText() != null && !object.getAfterText().isValueNullOrEmpty()) {

				aftertext = object.getAfterText().getValue();
			}

		} else {
			System.out.println("Call  Method_typeTextUsingTextAndPressKey 1");
			FunctionResult fr = null;
			fr = typeTextUsingTextHelper(textSearch, index, isContains, textValue, before, "", "");

			if (fr.getOutput().equalsIgnoreCase("false")) {
				fr.setMessage("No Object Found With Text <" + textSearch + ">");
			}
			return fr;
		}
		FunctionResult fr = null;
		System.out.println("Call  Method_typeTextUsingTextAndPressKey 2");
		fr = typeTextUsingTextHelper(textSearch, index, isContains, textValue, before, aftertext, beforetext);
		if (fr.getOutput().equalsIgnoreCase("false")) {
			fr.setMessage("No Object Found With Text <" + textSearch + ">");
		}
		return fr;

	}
	
	public FunctionResult typeTextUsingTextHelper(String textToSearch, int Oindex, boolean OisContains,
			String textToType, boolean Obefore, String afterText, String beforeText) throws Exception {
		if (afterText == null) {
			afterText = "";
		}
		if (beforeText == null) {
			beforeText = "";
		}

		new Utils().waitForPageLoadAndOtherAjaxIfTrue();

		int index = Oindex;
		boolean isContains = OisContains;
		boolean before = Obefore;

		OpkeyLogger.printSaasLog(_class, ">>coupa inside typeTextUsingTextHelper ");

		ObjectProperty byTextObject = new ObjectProperty(WEB_ELEMENT.EDITBOX, textToSearch, index, isContains, before);

		byTextObject.setBeforeText(beforeText);
		byTextObject.setAfterText(afterText);

		FinderByText.elementType = WEB_ELEMENT.EDITBOX;
		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
				String textToSearch = byTextObject.getTextToSearch();
				String AfterText = byTextObject.getAfterText();
				String BeforeText = byTextObject.getBeforeText();

				List<WebElement> lableEles = new ArrayList<>();

				WebElement element = null;

				if (!AfterText.isEmpty() || !BeforeText.isEmpty()) {
					OpkeyLogger.printSaasLog(_class, "<<  finding by before or  after  ");
					lableEles = UnCategorised.findElementsByTextWithBeforeAfter(textToSearch, byTextObject.getIndex(),
							byTextObject.isContains(), BeforeText, AfterText);
					OpkeyLogger.printSaasLog(_class, "<<  element found by befor and after size   " + lableEles.size());
					if (lableEles.size() == 0) {
						throw new ObjectNotFoundException("Label element not found");
					}
					OpkeyLogger.printSaasLog(_class, "<< printing lable elements outer html   ");
					if (lableEles.size() >= 1) {
						for (WebElement ele : lableEles) {
							OpkeyLogger.printSaasLog(_class,
									"<<  element outerHtml   " + ele.getAttribute("outerHTML"));
						}
					}

					try {
						byTextObject.setLableELements(lableEles);
						WebElement editBoxElement = FinderByText.findElementByType(byTextObject);
						if (editBoxElement != null) {
							OpkeyLogger.printSaasLog(_class,
									"<< editbox  element found after setting label elements  ");
							element = editBoxElement;
						} else
							throw new ObjectNotFoundException(new WebDriverObject(false, "", true),
									"#3: No Object Found With Text <" + Context.current().getFunctionCall()
											.getDataArguments().getDataArgument().get(0).getValue() + ">");
					} catch (Exception e) {

						new ExceptionManager().pushException(e);
						OpkeyLogger.printSaasLog(_class, "@Exception While Fiding Final Element: " + e.getMessage());
						throw new ObjectNotFoundException(new WebDriverObject(false, "", true),
								"#4: No Object Found With Text <" + Context.current().getFunctionCall()
										.getDataArguments().getDataArgument().get(0).getValue() + ">");
					}

				} else {
					OpkeyLogger.printSaasLog(_class, "<< Finding element by TextSearch ");
					element = FinderByText.findWebElement(byTextObject);
				}
				OpkeyLogger.printSaasLog(_class, "<< editbox  element found now typing ");

				WebObjects wobj = new WebObjects();
				if (element != null) {
					try {
						System.out.println("here the outer html is" + element.getAttribute("outerHTML"));
						System.out.println("Call Shadow_ele");
						wobj.shadow_TypeByText(element, textToType);
						new JSTool().performDeFocusTrigger(element);
						return Result.PASS().setOutput(true).make();

					} catch (StaleElementReferenceException e) {
						new ExceptionManager().pushException(e);
						OpkeyLogger.printSaasLog(_class, "@Handled Exception While Typing: ");
						e.printStackTrace();
						throw new RetryKeywordAgainException();
					} catch (NoSuchSessionException e) {
						throw new RetryKeywordAgainException();
					} catch (Exception e) {
						e.printStackTrace();
						new ExceptionManager().pushException(e);
						return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).make();
					}

				}
				return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).make();

			}
		}.run();
	}

}
