package com.crestech.opkey.plugin.keywords;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataMissingException;
import com.crestech.opkey.plugin.exceptionhandling.RetryKeywordAgainException;
import com.crestech.opkey.plugin.webdriver.Finder;
import com.crestech.opkey.plugin.webdriver.Log;
import com.crestech.opkey.plugin.webdriver.WebDriverDispatcher;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ObjectNotFoundException;
import com.crestech.opkey.plugin.webdriver.exceptionhandlers.ToolNotSetException;
import com.crestech.opkey.plugin.webdriver.keywords.Browser;
import com.crestech.opkey.plugin.webdriver.keywords.Utils;
import com.crestech.opkey.plugin.webdriver.keywords.WebObjects;
import com.crestech.opkey.plugin.webdriver.keywords.byText.ByTextKeywords;
import com.crestech.opkey.plugin.webdriver.object.WebDriverObject;
import com.crestech.opkey.plugin.webdriver.util.Checkpoint;

public class Uncategorised implements KeywordLibrary {
	
	static Class<Uncategorised> _class = Uncategorised.class;

	public FunctionResult Method_IsTextPresentOnScreen(WebDriverObject object, String OtextToSearch, String Obefore, String Oafter) throws Exception {
		
		WebDriverDispatcher.isGetKeyword = true;
		
		// Thread.sleep(20000);
		if ((object == null || object.getTextToSearch().isValueNullOrEmpty()) && (OtextToSearch == null || OtextToSearch.isEmpty()))
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setOutput(false).setMessage("Object argument is not valid").make();

		if(object != null && !object.getTextToSearch().isValueNullOrEmpty()) {
		OtextToSearch = object.getTextToSearch().getValue().trim();
		Obefore = object.getBefore().getValue().trim();
		Oafter = object.getAfter().getValue().trim();
		}
		
		Log.debug("TextToSearch : " + OtextToSearch + "  ,  " + "Before : " + Obefore + "  ,  " + "After : " + Oafter);

		String before = Obefore;
		String after = Oafter;
		String textToSearch = OtextToSearch;
		
		Finder.textElementsList.clear();

		waitForTitleToFetch();

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
				List<WebElement> eles = new ArrayList<WebElement>();
				
					
					if (!before.trim().isEmpty() || !after.trim().isEmpty()) {
						eles = Utility.findElementsByTextWithBeforeAfter(textToSearch, 0, false, before, after);
					} else
						eles = Finder.findElementByText(textToSearch, false, 0);
					
					if(!eles.isEmpty()) {
						Utils.visible(eles);
					}
					
					

				if (eles.isEmpty()) {
					throw new ObjectNotFoundException("Text<" + textToSearch + "> not found");
				} else {
					if (Utils.shouldHighlightAllObjects()) {
						new WebObjects().Method_highlightElement(eles.get(0));
					}
					new Utils().scrollIntoView_Extended(eles.get(0));
					return Result.PASS().setOutput(true).make();
				}

			}
		}.run();

	}
	
	public FunctionResult Method_getObjectEnabledByText(String OtextSearch, int Oindex, boolean OisContains,
			String Obefore, String Oafter, WebDriverObject object) throws Exception {

		WebDriverDispatcher.isGetKeyword = true;

		// Thread.sleep(20000);
		if ((object == null || object.getTextToSearch().isValueNullOrEmpty())
				&& (OtextSearch == null || OtextSearch.isEmpty()))
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_MISSING).setOutput(false)
					.setMessage("Object argument is not valid").make();

		if (object != null && !object.getTextToSearch().isValueNullOrEmpty()) {
			OtextSearch = object.getTextToSearch().getValue().trim();
			Obefore = object.getBefore().getValue().trim();
			Oafter = object.getAfter().getValue().trim();
			Oindex = Integer.parseInt(object.getIndex().getValue().trim());
		}

		Log.debug("TextToSearch : " + OtextSearch + "  ,  " + "Before : " + Obefore + "  ,  " + "After : " + Oafter);

		String before = Obefore;
		String after = Oafter;
		String textToSearch = OtextSearch;
		int index = Oindex;
		Finder.textElementsList.clear();

		waitForTitleToFetch();

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException,
					ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
				List<WebElement> eles = new ArrayList<WebElement>();

				if (!before.trim().isEmpty() || !after.trim().isEmpty()) {
					eles = Utility.findElementsByTextWithBeforeAfter(textToSearch, index, false, before, after);
				} else {
					eles = Finder.findElementByText(textToSearch, false, index);
				}
					
				if (!eles.isEmpty()) {
					Utils.visible(eles);
				}

				if (eles.isEmpty()) {
//					throw new ObjectNotFoundException("Text<" + textToSearch + "> not found");
					return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
							.setMessage("Text<" + textToSearch + "> not found").make();
				} else {

					boolean check =false;
					try {
					WebElement foundElement = eles.get(index);
					
					if (Utils.shouldHighlightAllObjects()) {
						new WebObjects().Method_highlightElement(foundElement);
					}
					new Utils().scrollIntoView_Extended(foundElement);

					if (foundElement.isDisplayed() && foundElement.isEnabled()) {
						check =true;
//						return Result.PASS().setOutput(true).make();
					}
					
					if (!check) {
						
						new Utils().waitForPageLoadAndOtherAjax();
						Thread.sleep(3000);

						if (foundElement.isDisplayed() && foundElement.isEnabled()) {
							check =true;
//							return Result.PASS().setOutput(true).make();
						}
//						return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE).setOutput(">> Object is not Enabled or Displayed ").make();
					}
					if (check) {
						return Result.PASS().setOutput(true).make();
					}else {
						return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_OPERATABLE).setOutput(">> Object is not Enabled or Displayed ").make();
					}
						
					} catch (Exception e) {
						e.printStackTrace();
						return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false).setMessage("Index Out Of Bound ").make();
					}

				}
				

			}
		}.run();

	}

	public FunctionResult Method_clickOnDownloadButton() throws Exception {
		
		if(Browser.browserName.toLowerCase().contains("firefox") || Browser.browserName.toLowerCase().contains("mozilla")) {
			return new ByTextKeywords().clickByTextHelper("Download", 0, false, "", "");
		}

		new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// switch inside frame now
				WebElement iframe = Finder.findWebDriver().findElement(By.xpath("//iframe[not(@style=\"display:none\") and @onload]"));

				System.out.println(iframe);

				// Switch into frame
				Finder.findWebDriver().switchTo().frame(iframe);
				return Result.PASS().make();
			}
		}.run();

		return new Checkpoint() {

			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {

				// Switch into embed tag
				List<WebElement> embedList = Finder.findWebDriver().findElements(By.tagName("embed"));

				if (embedList.isEmpty()) {
					Finder.findWebDriver().switchTo().defaultContent();
					throw new RetryKeywordAgainException();
				}
				WebElement embed = embedList.get(0);
				String source = embed.getAttribute("src");
				System.out.println(source + " $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
				//	@formatter:off
				String downloadScript = "downloadURI = function(uri, name) "
								+"{"
									+"var link = document.createElement(\"a\");"
									+"link.download = name;"
									+"link.href = uri;"
									+"link.click();"
								+"};"
								+"downloadURI(\""+source+"\", \"file\");"	;
				// @formatter:on
				System.out.println(downloadScript);
				JavascriptExecutor jse = (JavascriptExecutor) Finder.findWebDriver();
				jse.executeScript(downloadScript);

				return Result.PASS().setOutput(true).make();

			}
		}.run();
	}
	
	
	

	private void waitForTitleToFetch() throws ToolNotSetException, InterruptedException {
		int iterationLeft = 5;
		breakLoop: while (iterationLeft > 0) {
			iterationLeft--;
			String title = Finder.findWebDriver().getTitle();
			if (title == null || title.isEmpty()) {
				Thread.sleep(2000);
				continue;
			} else {
				break breakLoop;
			}
		}
	}

	/**
	 * Used for initializing impact mode
	 * 
	 * @return
	 * @throws Exception 
	 */
	public FunctionResult Method_selectPage(String pageTitle, String pageHeader) throws Exception {
		return new Checkpoint() {
			
			@Override
			public FunctionResult _innerRun()
					throws InterruptedException, ToolNotSetException, ObjectNotFoundException, WebDriverException, ArgumentDataMissingException, IOException, ArgumentDataInvalidException, Exception {
				// TODO Auto-generated method stub
				return Result.PASS().setOutput(true).make();
			}
		}.run();
		
	}
}
