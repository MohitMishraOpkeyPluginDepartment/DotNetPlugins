/*
 *  Copyright (c) 2016, Glib Briia  <a href="mailto:glib.briia@assertthat.com">Glib Briia</a>
 *  Distributed under the terms of the MIT License
 */

package com.assertthat.selenium_shutterbug.utils.web;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.Point;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.assertthat.selenium_shutterbug.utils.file.FileUtil;
import com.crestech.opkey.plugin.logging.OpkeyLogger;
import com.plugin.appium.Utils;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.javascript.JSExecutor;
import com.plugin.appium.util.ImageUtils;
import com.sun.imageio.plugins.common.ImageUtil;

public class Browser {
	
	static public Class _class = Browser.class;

	public static final String RELATIVE_COORDS_JS = "relative-element-coords.js";
	public static final String MAX_DOC_WIDTH_JS = "max-document-width.js";
	public static final String MAX_DOC_HEIGHT_JS = "max-document-height.js";
	public static final String VIEWPORT_HEIGHT_JS = "viewport-height.js";
	public static final String VIEWPORT_WIDTH_JS = "viewport-width.js";
	public static final String SCROLL_TO_JS = "scroll-to.js";
	public static final String SCROLL_BY_JS = "scroll-by.js";
	public static final String SCROLL_INTO_VIEW_JS = "scroll-element-into-view.js";
	public static final String CURRENT_SCROLL_Y_JS = "get-current-scrollY.js";
	public static final String CURRENT_SCROLL_X_JS = "get-current-scrollX.js";
	public static final String DEVICE_PIXCEL_RATIO = "device-pixcel-ratio.js";
	public static final String SCROLL_TO_TOP_JS = "scroll-to-top.js";
	
	private BufferedImage combinedImage;
	private Graphics2D graphics;

	private WebDriver driver;
	private int docHeight = -1;
	private int docWidth = -1;
	private int viewportWidth = -1;
	private int viewportHeight = -1;
	private int currentScrollX;
	private int currentScrollY;
	private int devicePixcelRatio = -1;
	private boolean isLastScroll;

	/* ================ For Last SnapShot =========================== */
	private int secondLastScrollY;

	public Browser(WebDriver driver) {
		this.driver = driver;
	}

	public static void wait(int milis) {
		try {
			Thread.sleep(milis);
		} catch (InterruptedException e) {
			throw new UnableTakeSnapshotException(e);
		}
	}

	public BufferedImage takeScreenshot() {
		File srcFile = ((TakesScreenshot) this.getUnderlyingDriver()).getScreenshotAs(OutputType.FILE);
		try {

			File destFile = File.createTempFile("ssts", ".png");
			FileUtils.copyFile(srcFile, destFile);
			OpkeyLogger.printLog(_class,"FILE SAVED HERE ----->>>>> " + srcFile.getAbsolutePath());
		} catch (Exception e) {
			// Don't stop carry on
			OpkeyLogger.printLog(_class,"@Exception while taking screenshot: Method: takeScreenshot()");
		}

		try {
			String resizedImagePath = System.getProperty("java.io.tmpdir") + File.separator + UUID.randomUUID().toString() + ".jpg";
			File file = new ImageUtils().reSize(srcFile, new File(resizedImagePath) , this.getViewportWidth(), this.getViewportHeight());
			return  ImageIO.read(file);
		} catch (IOException e) {
			throw new UnableTakeSnapshotException(e);
		}
	}
	
	private int waitGivenByUser() {
		int wait = 500;
		try {
			String value = new com.plugin.appium.Utils().getAppiumProperty("snapshotWaitTime");
			wait = Integer.parseInt(value);
			System.out.println("SnapShotWaitTime: " + wait);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("snapshotWaitTime not given. going with 500 ms");
		}
		
		return wait;
	}

	public BufferedImage takeScreenshotEntirePage() throws ToolNotSetException {
		return takeScreenshotEntirePageHelper();
	}

	private boolean isElementIntoView(WebElement element) {
		String scriptString = "function isScrolledIntoView(elem)\r\n" + "{\r\n" + "" + " var docViewTop = $(window).scrollTop();\r\n" + "    var docViewBottom = docViewTop + $(window).height();\r\n"
				+ "\r\n" + "    var elemTop = $(elem).offset().top;\r\n" + "    var elemBottom = elemTop + $(elem).height();\r\n" + "\r\n"
				+ "    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));\r\n" + "}" + "return isScrolledIntoView(arguments[0])";
		try {
			return (Boolean) new JSExecutor().executeScript(scriptString, element);
		} catch (ToolNotSetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return false;
	}

	public BufferedImage takeScreenshotEntirePageHelper() throws ToolNotSetException {
		loadDynamicContent();

		int horizontalIterations = (int) Math.ceil(((double) this.getDocWidth()) / this.getViewportWidth());
		int verticalIterations = (int) Math.ceil(((double) this.getDocHeight()) / this.getViewportHeight());

		OpkeyLogger.printLog(_class,"@DevicePixcelRatio: " + getDevicePixcelRatio());
		OpkeyLogger.printLog(_class,"@this.getDocWidth() = " + this.getDocWidth());
		OpkeyLogger.printLog(_class,"@this.getDocHeight() = " + this.getDocHeight());
		OpkeyLogger.printLog(_class,"@horizontalIterations: " + horizontalIterations);
		OpkeyLogger.printLog(_class,"@verticalIterations: " + verticalIterations);
		OpkeyLogger.printLog(_class,"@Width = " + horizontalIterations * this.getViewportWidth());
		OpkeyLogger.printLog(_class,"@Height = " + this.getViewportHeight() * verticalIterations);
		OpkeyLogger.printLog(_class,"@Drawed Width: " + getWidthByPixelration(this.getViewportWidth()));
		OpkeyLogger.printLog(_class,"@Drawed Height: " + getHeightByPixelRatio(this.getViewportHeight()));

		// Create Graphics
		this.createGraphics();

		int imageHeight = 0;
		imageHeight =  this.getViewportHeight(); //getWidthByPixelration(this.getViewportHeight());

		OpkeyLogger.printLog(_class,"@ViewportHeight: " + imageHeight);
		int waitTime = waitGivenByUser();
		// horizontalIterations = 1;
		outerloop: for (int j = 0; j <= verticalIterations; j++) {

			OpkeyLogger.printLog(_class,"Vertical Scrolled From: " + j + " To: " + j * this.getViewportHeight());
			if(j == 0)
				this.scrollBy(0, 0);
			else
				this.scrollBy(0, this.getViewportHeight());

			for (int i = 0; i < horizontalIterations; i++) {

				OpkeyLogger.printLog(_class,"Horizontal Scrolled From: " + i * this.getViewportWidth() + " To: " + this.getViewportHeight() * j);
				this.scrollTo(i * this.getViewportWidth(), this.getViewportHeight() * j);

				wait(50);
				wait(waitTime);
				Image image = takeScreenshot();
				OpkeyLogger.printLog(_class,"@Original Image Height: " + image.getHeight(null));

				if (j == (verticalIterations - 1)) {
					this.isLastScroll = true;
					OpkeyLogger.printLog(_class,"@Last Screenshot: " + j);
					image = cropImage((BufferedImage) image, imageHeight);
				}else {
					this.secondLastScrollY = this.getCurrentScrollY();
				}

				OpkeyLogger.printLog(_class,"Saving Image This Location <" + this.getCurrentScrollX() + ">< " + this.getCurrentScrollY() + ">");

				OpkeyLogger.printLog(_class,"@Finally Drawing: Width: " + this.getCurrentScrollX() + " Height: " + imageHeight * j);
				this.graphics.drawImage(image, this.getCurrentScrollX(), imageHeight * j, null);

				System.out.println(" ================== New Screenshot step end ===========================");
				
				if (this.isLastScroll) {
					break outerloop;
				}
			}
		}
		this.graphics.dispose();
		return combinedImage;

	}

	private void createGraphics() {
		int verticalIterations = (int) Math.ceil(((double) this.getDocHeight()) / this.getViewportHeight());
//		this.combinedImage = new BufferedImage(getWidthByPixelration(this.getViewportWidth()), (this.getViewportHeight() * verticalIterations), BufferedImage.TYPE_INT_ARGB);
		this.combinedImage = new BufferedImage(this.getViewportWidth(), (this.getViewportHeight() * verticalIterations), BufferedImage.TYPE_INT_ARGB);

		this.graphics = this.combinedImage.createGraphics();
	}

	public void loadDynamicContent() throws ToolNotSetException {
		// Fake Scroll To Load All Contents
		new Utils().waitForPageLoadAndOtherAjax();
		OpkeyLogger.printLog(_class, "Fake Scroll To Load All Contents");
		wait(5 * 1000);
		
		// We need scroll to top because in some Website scrollTo() and scrollBy() function is not working to go UP.
		this.scrollToTop();
		
		int demoVerticalIterations = (int) Math.ceil(((double) this.getDocHeight()) / this.getViewportHeight());
		for (int j = 0; j < demoVerticalIterations; j++) {
			this.scrollBy(0, this.getViewportHeight());
			wait(200);
		}
		this.scrollToTop();
	}
	
	private void scrollToTop() {
		executeJsScript(SCROLL_TO_TOP_JS);
	}

	private BufferedImage cropImage(BufferedImage originalImgage, int imageHeight) {

		int newData = this.getCurrentScrollY() - this.secondLastScrollY;
		if (newData < 1) {
			OpkeyLogger.printLog(_class,"@No need to crop. newData: " + newData);
			return originalImgage;
		}

		int startY = (imageHeight - newData);
		BufferedImage croppedImage = originalImgage.getSubimage(0, startY, originalImgage.getWidth(), imageHeight - startY);
		saveBufferdImageIntoFile(croppedImage, "LastCroppedImage");

		OpkeyLogger.printLog(_class,"@New Data: " + newData);
		OpkeyLogger.printLog(_class,"@Current ScrollY: " + this.getCurrentScrollY());
		OpkeyLogger.printLog(_class,"@Second Last ScrollY;:  " + this.secondLastScrollY);
		OpkeyLogger.printLog(_class,"@StartY: " + startY);
		OpkeyLogger.printLog(_class,"@After Croping Image HEIGHT is: " + croppedImage.getHeight());
		OpkeyLogger.printLog(_class,"@getSubimage Argument: " + 0 + "," + startY + "," + originalImgage.getWidth() + "," + (imageHeight - startY));
		return croppedImage;

	}

	private boolean isLastScroll() {
		OpkeyLogger.printLog(_class,"========= Inside isLastScroll() =================");
		String documentHeightScript = FileUtil.getJsScript("DocumentHeight.js");
		JavascriptExecutor js = (JavascriptExecutor) driver;
		boolean return_value = (Boolean) js.executeScript( documentHeightScript + "; return (window.innerHeight + (window.scrollY || document.documentElement.scrollTop)) >= height");
		OpkeyLogger.printLog(_class,"@return_value: " + return_value);
		if (return_value) {
			this.isLastScroll = true;
			return true;
		}

		OpkeyLogger.printLog(_class,"getCurrentScrollY: " + this.getCurrentScrollY());
		this.secondLastScrollY = this.getCurrentScrollY();
		return false;
	}

	public BufferedImage takeScreenshotScrollHorizontally() {
		BufferedImage combinedImage = new BufferedImage(this.getDocWidth(), this.getViewportHeight(), BufferedImage.TYPE_INT_ARGB);
		Graphics2D g = combinedImage.createGraphics();
		int horizontalIterations = (int) Math.ceil(((double) this.getDocWidth()) / this.getViewportWidth());
		for (int i = 0; i < horizontalIterations; i++) {
			this.scrollTo(i * this.getViewportWidth(), 0);
			Image image = takeScreenshot();
			g.drawImage(image, this.getCurrentScrollX(), 0, null);
			if (this.getDocWidth() == image.getWidth(null)) {
				break;
			}
		}
		g.dispose();
		return combinedImage;
	}

	public BufferedImage takeScreenshotScrollVertically() {
		BufferedImage combinedImage = new BufferedImage(this.getViewportWidth(), this.getDocHeight(), BufferedImage.TYPE_INT_ARGB);
		Graphics2D g = combinedImage.createGraphics();
		int verticalIterations = (int) Math.ceil(((double) this.getDocHeight()) / this.getViewportHeight());
		for (int j = 0; j < verticalIterations; j++) {
			this.scrollBy(0, this.getViewportHeight());
			Image image = takeScreenshot();
			g.drawImage(image, 0, this.getCurrentScrollY(), null);
			if (this.getDocHeight() == image.getHeight(null)) {
				break;
			}
		}
		g.dispose();
		return combinedImage;
	}

	public WebDriver getUnderlyingDriver() {
		return driver;
	}

	public int getCurrentScrollX() {
		try {
			return ((Long) executeJsScript(Browser.CURRENT_SCROLL_X_JS)).intValue();
		} catch (ClassCastException e) {
			return ((Double) executeJsScript(Browser.CURRENT_SCROLL_X_JS)).intValue();
		}
	}

	public int getCurrentScrollY() {
		try {
			return ((Long) executeJsScript(Browser.CURRENT_SCROLL_Y_JS)).intValue();
		} catch (ClassCastException e) {
			return ((Double) executeJsScript(Browser.CURRENT_SCROLL_Y_JS)).intValue();
		}
	}

	public int getDocWidth() {
		int documentWidth;
		try {
			documentWidth = docWidth != -1 ? docWidth : ((Long) executeJsScript(MAX_DOC_WIDTH_JS)).intValue();
		} catch (ClassCastException e) {
			documentWidth = docWidth != -1 ? docWidth : ((Double) executeJsScript(MAX_DOC_WIDTH_JS)).intValue();
		}
		return documentWidth;
		//return getWidthByPixelration(documentWidth);
		// return (documentWidth * getDevicePixcelRatio());
	}

	// public int getDevicePixcelRatio() {
	// Object devicePixcelRatio = null;
	// try {
	// devicePixcelRatio = (Long) devicePixcelRatio != null ? devicePixcelRatio :
	// ((Long) executeJsScript(DEVICE_PIXCEL_RATIO));
	// return (int) (long) devicePixcelRatio;
	// } catch (ClassCastException e) {
	// devicePixcelRatio = (Double) devicePixcelRatio != null ? devicePixcelRatio :
	// ((Double) executeJsScript(DEVICE_PIXCEL_RATIO));
	// return (int) (double) devicePixcelRatio;
	// }
	// }

	public Object getDevicePixcelRatio() {
		return executeJsScript(DEVICE_PIXCEL_RATIO);
	}

	public int getDocHeight() {
		int documentHeight = 0;
		try {
			documentHeight = docHeight != -1 ? docHeight : ((Long) executeJsScript(MAX_DOC_HEIGHT_JS)).intValue();
		} catch (ClassCastException e) {
			documentHeight = docHeight != -1 ? docHeight : ((Double) executeJsScript(MAX_DOC_HEIGHT_JS)).intValue();
		}
		return documentHeight;
//		return getHeightByPixelRatio(documentHeight);
		// return (documentHeight * getDevicePixcelRatio());
	}

	public int getViewportWidth() {
		try {
			return viewportWidth != -1 ? viewportWidth : ((Long) executeJsScript(VIEWPORT_WIDTH_JS)).intValue();
		} catch (ClassCastException e) {
			return viewportWidth != -1 ? viewportWidth : ((Double) executeJsScript(VIEWPORT_WIDTH_JS)).intValue();
		}
	}

	public int getViewportHeight() {
		try {
			return viewportHeight != -1 ? viewportHeight : ((Long) executeJsScript(VIEWPORT_HEIGHT_JS)).intValue();
		} catch (ClassCastException e) {
			return viewportHeight != -1 ? viewportHeight : ((Double) executeJsScript(VIEWPORT_HEIGHT_JS)).intValue();
		}
	}

	public Coordinates getBoundingClientRect(WebElement element) {
		String script = FileUtil.getJsScript(RELATIVE_COORDS_JS);
		ArrayList<String> list = (ArrayList<String>) executeJsScript(RELATIVE_COORDS_JS, element);
		Point start = new Point(Integer.parseInt(list.get(0)), Integer.parseInt(list.get(1)));
		Dimension size = new Dimension(Integer.parseInt(list.get(2)), Integer.parseInt(list.get(3)));
		return new Coordinates(start, size);
	}

	public void scrollToElement(WebElement element) {
		executeJsScript(SCROLL_INTO_VIEW_JS, element);
	}

	public void scrollTo(int x, int y) {
		executeJsScript(SCROLL_TO_JS, x, y);
	}
	
	public void scrollBy(int x, int y) {
		executeJsScript(SCROLL_BY_JS, x, y);
	}

	public Object executeJsScript(String filePath, Object... arg) {
		String script = FileUtil.getJsScript(filePath);
		JavascriptExecutor js = (JavascriptExecutor) driver;
		return js.executeScript(script, arg);
	}

	public void saveBufferdImageIntoFile(BufferedImage bufferedImage, String imageName) {
		try {
			File cFile = File.createTempFile(imageName, ".png");
			ImageIO.write(bufferedImage, "png", cFile);
			OpkeyLogger.printLog(_class,imageName + ": " + cFile.getPath());
		} catch (Exception e) {
			OpkeyLogger.printLog(_class,"@Exception while saving MyImage");
		}
	}

	private int getHeightByPixelRatio(int height) {

		Object devicePixcelRatio = null;
		try {
			devicePixcelRatio = (Long) devicePixcelRatio != null ? devicePixcelRatio : ((Long) getDevicePixcelRatio());
			return (int) (height * (long) (devicePixcelRatio));
		} catch (ClassCastException e) {
			devicePixcelRatio = (Double) devicePixcelRatio != null ? devicePixcelRatio : ((Double) executeJsScript(DEVICE_PIXCEL_RATIO));
			return (int) (height * (double) (devicePixcelRatio));
		}
	}

	private int getWidthByPixelration(int width) {

		Object devicePixcelRatio = null;
		try {
			devicePixcelRatio = (Long) devicePixcelRatio != null ? devicePixcelRatio : ((Long) getDevicePixcelRatio());
			return (int) (width * (long) (devicePixcelRatio));
		} catch (ClassCastException e) {
			devicePixcelRatio = (Double) devicePixcelRatio != null ? devicePixcelRatio : ((Double) executeJsScript(DEVICE_PIXCEL_RATIO));
			return (int) (width * (double) (devicePixcelRatio));
		}
	}
	
}