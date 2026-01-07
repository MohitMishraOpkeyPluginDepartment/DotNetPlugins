package com.plugin.appium.keywords.GenericKeyword;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.Alert;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.Utils;
import com.plugin.appium.annotations.keywordValidation.KeywordActionType;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.ActionType;
import com.plugin.appium.enums.DeviceType;
import com.plugin.appium.enums.ReturnMessages;
import com.plugin.appium.util.GenericCheckpoint;

public class PopUp implements KeywordLibrary {

	/**
	 * @throws Exception
	 * 
	 * 
	 * 
	 * 
	 */
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_Getpopuptext(AppiumObject object) throws Exception {
		
		String text = "";
		text = getAlertText();
		return Result.PASS().setOutput(text).make();
		
	}

	
	@KeywordActionType({ActionType.GET})
	public FunctionResult Method_Getpopuptext(AppiumObject object, String before, String after) throws Exception {
		String text = "";
		
		text = getAlertText();
		
		text = new UnCategorised().TrimString(text, before, after);

		String msg = "";
		String output = "";

		if (text.contains("@#@")) {
			output = "";
			msg = text.substring(3, text.length());
		} else
			output = text;
		return Result.PASS().setOutput(output).setMessage(msg).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */

	public FunctionResult Method_VerifyPopUpText(AppiumObject object, String expectedText) throws Exception {
		String getText = "";
		getText = getAlertText();
		if (getText.equals(expectedText)) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.MATCHTEXT.toString()).make();
		}

		return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
				.setMessage(ReturnMessages.UNMATCHTEXT.toString()).make();
	}

	public FunctionResult Method_VerifyPopUpText(AppiumObject object, String expectedText, String before, String after)
			throws Exception {
		String getText = "";
		getText = getAlertText();
		getText = new UnCategorised().TrimString(getText, before, after);
		String msg = "";
		String output = "";

		if (getText.contains("@#@")) {
			output = "";
			msg = getText.substring(3, getText.length());
		} else
			output = getText;
		if (output.equals(expectedText)) {
			return Result.PASS().setOutput(true).setMessage(ReturnMessages.MATCHTEXT.toString()).make();
		}

		return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
				.setMessage(ReturnMessages.UNMATCHTEXT.toString()).make();
	}

	

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	public FunctionResult Method_dismissPopup() throws Exception {

		boolean alertPresent = Utils.alertVerifaction();
		if (alertPresent) {
			new GenericCheckpoint<Boolean>() {

				@Override
				public Boolean _innerRun() throws Exception {
					Finder.findAppiumDriver().switchTo().alert().dismiss();
					return true;
				}
			}.run();
			
			Thread.sleep(500);
			return Result.PASS().setOutput(true).setResultCode(ResultCodes.SUCCESS.Code()).make();
		}

		return Result.FAIL(ResultCodes.ERROR_UNSATISFIED_DEPENDENCIES).setOutput(false)
				.setMessage(ReturnMessages.POPUP_NOT_FOUND.toString()).make();
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 */
	public FunctionResult Method_acceptPopup() throws Exception {

		boolean alertPresent = Utils.alertVerifaction();
		if (alertPresent) {
			new GenericCheckpoint<Boolean>() {

				@Override
				public Boolean _innerRun() throws Exception {
					Finder.findAppiumDriver().switchTo().alert().accept();;
					return true;
				}
			}.run();
			
			Thread.sleep(500);
			return Result.PASS().setOutput(true).setResultCode(ResultCodes.SUCCESS.Code()).make();
		}

		return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setOutput(false).setMessage(ReturnMessages.POPUP_NOT_FOUND.toString()).make();
	}

	/**
	 * 
	 * Checkpoint Supported
	 * 
	 * 
	 */
	public FunctionResult Method_verifyPopupPresent(String expectedText) throws Exception {

		boolean alertPresent = Utils.alertVerifaction();
		expectedText = expectedText.replace("\r", "");
		expectedText = expectedText.replace("\n", "");

		if (alertPresent) {
			Alert alert = Finder.findAppiumDriver().switchTo().alert();
			System.out.println("expectedText: \n<" + expectedText + ">");
			System.out.println("=================================");
			String foundText = alert.getText();
			String foundTextDebugInfo = foundText;

			foundText = foundText.replace("\r", "");
			foundText = foundText.replace("\n", "");

			System.out.println("foundText: \n<" + foundText + ">");
			System.out.println("-----foundText.contentEquals(expectedText) :" + foundText.contentEquals(expectedText));

			for (int ind = 0; ind < expectedText.length(); ind++) {
				char expected = expectedText.charAt(ind);
				char found = foundText.charAt(ind);
				if (expected == found) {

				} else {
					System.out.println("Char @ " + ind + " dont match. Expected: " + expected + " found: " + found);
				}
			}

			if (foundText.contentEquals(expectedText)) {
				return Result.PASS().setOutput(true).setResultCode(ResultCodes.SUCCESS.Code())
						.setMessage(ReturnMessages.MATCHTEXT.toString()).make();

			} else {
				return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
						.setMessage("Text Found:" + foundTextDebugInfo).make();
			}

		}

		return Result.FAIL(ResultCodes.ERROR_VERIFICATION_FAILLED).setOutput(false)
				.setMessage(ReturnMessages.POPUP_NOT_FOUND.toString()).make();
	}
	
	/**
	 * Checkpoint Supported
	 * @return
	 * @throws Exception
	 */
	
private String getAlertText() throws Exception {
		
		return new GenericCheckpoint<String>() {

			@Override
			public String _innerRun() throws Exception {
				String getText;
				try {
					Alert javascriptAlert = Finder.findAppiumDriver().switchTo().alert();
					// Get The Pop Text From Alert
					getText = javascriptAlert.getText();
				} catch (Exception ex) {
					getText = "";
					if (AppiumContext.getDeviceType() == DeviceType.IPhoneRealDevice) {
						String source = Finder.findAppiumDriver().getPageSource();
						Document html = Jsoup.parse(source);
						Elements elements = html.getElementsByTag("XCUIElementTypeTextView");
						for (Element element : elements) {
							getText = getText + element.attr("value");
						}
					} else
						throw ex;
				}
				return getText;
			}
		}.run();
	}
}