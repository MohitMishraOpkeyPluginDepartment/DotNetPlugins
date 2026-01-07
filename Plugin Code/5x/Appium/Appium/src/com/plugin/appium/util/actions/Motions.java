package com.plugin.appium.util.actions;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebElement;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.contexts.Context;
import com.plugin.appium.AppiumObject;
import com.plugin.appium.Finder;
import com.plugin.appium.enums.DIRECTION;
import com.plugin.appium.enums.Messages;
import com.plugin.appium.exceptionhandlers.KeywordMethodOrArgumentValidationFailException;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.TimeOut_ObjectNotFoundException;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;
import com.plugin.appium.keywords.GenericKeyword.ObjectProperty;
import com.plugin.appium.keywords.GenericKeyword.actionByText.ByTextArgumentValidator;
import io.appium.java_client.TouchAction;
import io.appium.java_client.touch.WaitOptions;
import io.appium.java_client.touch.offset.PointOption;

public class Motions {

	public FunctionResult swipeTowards(String direction)
			throws ToolNotSetException, InterruptedException, KeywordMethodOrArgumentValidationFailException {
		if (DIRECTION.DOWN.isMatch(direction)) {
			this.swipeDown();
			return Result.PASS().setOutput(true).make();
		} else if (DIRECTION.UP.isMatch(direction)) {
			this.swipeUP();
			return Result.PASS().setOutput(true).make();
		} else if (DIRECTION.LEFT.isMatch(direction)) {
			this.swipeLeft();
			return Result.PASS().setOutput(true).make();
		} else if (DIRECTION.RIGHT.isMatch(direction)) {
			this.swipeRight();
			return Result.PASS().setOutput(true).make();
		} else if (DIRECTION.RIGHTMOST.isMatch(direction)) {
			this.swipeRightMost();
			return Result.PASS().setOutput(true).make();
		} else if (DIRECTION.LEFTMOST.isMatch(direction)) {
			this.swipeLeftMost();
			return Result.PASS().setOutput(true).make();
		} else if (DIRECTION.DOWNMOST.isMatch(direction)) {
			this.swipeDownMost();
			return Result.PASS().setOutput(true).make();
		} else if (DIRECTION.UPMOST.isMatch(direction)) {
			this.swipeUPMost();
			return Result.PASS().setOutput(true).make();
		}

		return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).make();
	}
	
	

	public FunctionResult swipeTowards(String direction, int startingPercentage, int endingPercentage)

			throws ToolNotSetException,ObjectNotFoundException,TimeOut_ObjectNotFoundException, InterruptedException, KeywordMethodOrArgumentValidationFailException {
		if (DIRECTION.DOWN.isMatch(direction)) {
			this.swipeDown(startingPercentage, endingPercentage);
			return Result.PASS().setOutput(true).make();
		} else if (DIRECTION.UP.isMatch(direction)) {
			this.swipeUP(startingPercentage, endingPercentage);
			return Result.PASS().setOutput(true).make();
		} else if (DIRECTION.LEFT.isMatch(direction)) {
			this.swipeLeft(startingPercentage, endingPercentage);
			return Result.PASS().setOutput(true).make();
		} else if (DIRECTION.RIGHT.isMatch(direction)) {
			this.swipeRight(startingPercentage, endingPercentage);
			return Result.PASS().setOutput(true).make();
		} else if (DIRECTION.RIGHTMOST.isMatch(direction)) {
			this.swipeRightMost(startingPercentage, endingPercentage);
			return Result.PASS().setOutput(true).make();
		} else if (DIRECTION.LEFTMOST.isMatch(direction)) {
			this.swipeLeftMost(startingPercentage, endingPercentage);
			return Result.PASS().setOutput(true).make();
		} else if (DIRECTION.DOWNMOST.isMatch(direction)) {
			this.swipeDownMost(startingPercentage, endingPercentage);
			return Result.PASS().setOutput(true).make();
		} else if (DIRECTION.UPMOST.isMatch(direction)) {
			this.swipeUPMost(startingPercentage, endingPercentage);
			return Result.PASS().setOutput(true).make();
		}

		return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).make();
	}

	public void swipeRightMost() throws InterruptedException, ToolNotSetException {
		int startX = 0;
		int endX = 0;
		int startY = 0;
		Dimension size = Finder.findAppiumDriver().manage().window().getSize();

		startY = (int) (size.height / 2);
		startX = (int) (10);
		endX = (int) (size.width * 0.99);
		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(startX, startY))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000))).moveTo(PointOption.point(endX, startY))
		.release().perform();
	}

	public void swipeRightMost(int startingPercentage, int endingPercentage)
			throws InterruptedException, ToolNotSetException {
		int startX = 0;
		int endX = 0;
		int startY = 0;
		Dimension size = Finder.findAppiumDriver().manage().window().getSize();

		startY = (int) (size.height / 2);
		startX = (int) ((size.width * (100 - startingPercentage)) / 100);
		endX = (int) ((size.width * (100 - endingPercentage)) / 100);
		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(startX, startY))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000))).moveTo(PointOption.point(endX, startY))
		.release().perform();
	}

	public void swipeLeftMost() throws ToolNotSetException {
		int startX = 0;
		int endX = 0;
		int startY = 0;
		Dimension size = Finder.findAppiumDriver().manage().window().getSize();

		startY = (int) (size.height / 2);
		startX = (int) (size.width * 0.99);
		endX = (int) (10);
		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(startX, startY))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000))).moveTo(PointOption.point(endX, startY))
		.release().perform();
	}

	public void swipeLeftMost(int startingPercentage, int endingPercentage) throws ToolNotSetException {
		int startX = 0;
		int endX = 0;
		int startY = 0;
		Dimension size = Finder.findAppiumDriver().manage().window().getSize();

		startY = (int) (size.height / 2);
		startX = (int) ((size.width * startingPercentage) / 100);
		endX = ((size.width * endingPercentage) / 100);
		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(startX, startY))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000))).moveTo(PointOption.point(endX, startY))
		.release().perform();
	}

	public void swipeDownMost() throws InterruptedException, ToolNotSetException {

		double endPercentage = 0.99;
		double anchorPercentage = 0.3;
		Dimension size = Finder.findAppiumDriver().manage().window().getSize();
		int anchor = (int) (size.width * anchorPercentage);
		int startPoint = 10;
		int endPoint = (int) (size.height * endPercentage);

		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(anchor, startPoint))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000)))
		.moveTo(PointOption.point(anchor, endPoint)).release().perform();
	}

	public void swipeDownMost(int startingPercentage, int endingPercentage)
			throws InterruptedException, ToolNotSetException {

		Dimension size = Finder.findAppiumDriver().manage().window().getSize();
		int anchor = (int) ((size.width * startingPercentage) / 100);
		int startPoint = 10;
		int endPoint = (int) ((size.height * endingPercentage) / 100);

		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(anchor, startPoint))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000)))
		.moveTo(PointOption.point(anchor, endPoint)).release().perform();
	}

	public void swipeUPMost() throws InterruptedException, ToolNotSetException {
		org.openqa.selenium.Dimension windowSize = Finder.findAppiumDriver().manage().window().getSize();

		int startx = 10;
		int startY = (int) (windowSize.height * 0.99);
		int anchor = (int) (windowSize.width * 0.3);
		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(anchor, startY))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000))).moveTo(PointOption.point(anchor, startx))
		.release().perform();
	}

	public void swipeUPMost(int startingPercentage, int endingPercentage)
			throws InterruptedException, ToolNotSetException {
		org.openqa.selenium.Dimension windowSize = Finder.findAppiumDriver().manage().window().getSize();

		int endY = (int) ((windowSize.height * (100 - endingPercentage)) / 100);
		int startY = (int) ((windowSize.height * (100 - startingPercentage)) / 100);
		int anchor = (int) (windowSize.width * 0.3);
		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(anchor, startY))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000))).moveTo(PointOption.point(anchor, endY))
		.release().perform();
	}

	public void swipeUP() throws InterruptedException, ToolNotSetException {
		org.openqa.selenium.Dimension windowSize = Finder.findAppiumDriver().manage().window().getSize();

		int startx = (int) (windowSize.height * 0.10);
		int startY = (int) (windowSize.height * 0.90);
		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(windowSize.width / 2, startY))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000)))
		.moveTo(PointOption.point(windowSize.width / 2, startx)).release().perform();
	}

	public void swipeUP(int startingPercentage, int endingPercentage) throws InterruptedException, ToolNotSetException {
		org.openqa.selenium.Dimension windowSize = Finder.findAppiumDriver().manage().window().getSize();

		int startY = (int) ((windowSize.height * (100 - startingPercentage)) / 100);
		System.out.println(" width/2 " + windowSize.width / 2);
		int endY = (int) ((windowSize.height * (100 - endingPercentage)) / 100);
		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(windowSize.width / 2, startY))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000)))
		.moveTo(PointOption.point(windowSize.width / 2, endY)).release().perform();
	}

	public void swipeDown() throws InterruptedException, ToolNotSetException {

		double startPercentage = 0.3;
		double endPercentage = 0.9;
		double anchorPercentage = 0.3;   // for width parameter , user want to swipe 
		Dimension size = Finder.findAppiumDriver().manage().window().getSize();
		int anchor = (int) (size.width * anchorPercentage);
		int startPoint = (int) ((size.height * startPercentage));
		int endPoint = (int) ((size.height * endPercentage));
		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(anchor, startPoint))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(3000)))
		.moveTo(PointOption.point(anchor, endPoint)).release().perform();

	}

	public void swipeDown(int startingPercentage, int endingPercentage)
			throws InterruptedException, ToolNotSetException {

		double anchorPercentage = 0.3;
		Dimension size = Finder.findAppiumDriver().manage().window().getSize();
		int anchor = (int) (size.width * anchorPercentage);
		int startPoint = (int) ((size.height * startingPercentage) / 100);
		int endPoint = (int) ((size.height * endingPercentage) / 100);
		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(anchor, startPoint))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(3000)))
		.moveTo(PointOption.point(anchor, endPoint)).release().perform();

	}

	public void swipeRight() throws ToolNotSetException, InterruptedException {
		int startX = 0;
		int endX = 0;
		int startY = 0;
		Dimension size = Finder.findAppiumDriver().manage().window().getSize();

		startY = (int) (size.height / 2);
		startX = (int) (size.width * 0.10);
		endX = (int) (size.width * 0.90);

		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(startX, startY))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000))).moveTo(PointOption.point(endX, startY))
		.release().perform();
	}

	public void swipeRight(int startingPercentage, int endingPercentage)
			throws ToolNotSetException, InterruptedException {
		int startX = 0;
		int endX = 0;
		int startY = 0;
		Dimension size = Finder.findAppiumDriver().manage().window().getSize();
		startY = (int) (size.height / 2);
		startX = (int) ((size.width * (100 - startingPercentage)) / 100);
		endX = (int) ((size.width * (100 - endingPercentage)) / 100);
		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(startX, startY))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000))).moveTo(PointOption.point(endX, startY))
		.release().perform();
	}

	public void swipeLeft() throws ToolNotSetException {
		int startX = 0;
		int endX = 0;
		int startY = 0;
		Dimension size = Finder.findAppiumDriver().manage().window().getSize();
		startY = (int) (size.height / 2);
		startX = (int) (size.width * 0.90);
		endX = (int) (size.width * 0.10);
		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(startX, startY))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000))).moveTo(PointOption.point(endX, startY))
		.release().perform();
	}

	public void swipeLeft(int startingPercentage, int endingPercentage) throws ToolNotSetException {
		int startX = 0;
		int endX = 0;
		int startY = 0;
		Dimension size = Finder.findAppiumDriver().manage().window().getSize();
		startY = (int) (size.height / 2);
		startX = (int) ((size.width * startingPercentage) / 100);
		endX = (int) ((size.width * endingPercentage) / 100);
		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(startX, startY))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(2000))).moveTo(PointOption.point(endX, startY))
		.release().perform();
	}

	public FunctionResult swipeToObject(AppiumObject object, String direction) throws Exception {
		System.out.println("#1 Direction: " + direction);
		WebElement element = this.swipeAndFindElement(object, direction);
		if (element != null) {
			return Result.PASS().setOutput(true).make();
		}
		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage(ResultCodes.ERROR_OBJECT_NOT_FOUND.toString()).make();
	}

	public FunctionResult swipeToObject(AppiumObject object, String direction, int startingPercentage,
			int endingPercentage) throws ToolNotSetException, InterruptedException,TimeOut_ObjectNotFoundException,ObjectNotFoundException,Exception {
		if (direction.equals("")|| direction.length()==0 ||startingPercentage == 0 || endingPercentage == 0 || startingPercentage > 100 || endingPercentage > 100) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage(ResultCodes.ERROR_ARGUMENT_DATA_INVALID.toString()).make();
		}
		System.out.println("#1 Direction: " + direction);
		WebElement element=null;
		try {
			element = this.swipeAndFindElement(object, direction, startingPercentage, endingPercentage);
		} catch (Exception e) {
			/*
			 * if (e.getMessage() != null &&
			 * e.getMessage().equals(Messages.TIMEOUT_INSIDE_FINDER)) { return
			 * Result.FAIL().setOutput(false).setMessage(ResultCodes.ERROR_STEP_TIME_OUT.
			 * toString()).make(); }
			 */
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage(ResultCodes.ERROR_OBJECT_NOT_FOUND.toString()).make();
		}
		
		if (element != null) {
			return Result.PASS().setOutput(true).make();
		}
		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage(ResultCodes.ERROR_OBJECT_NOT_FOUND.toString()).make();
	}

	public WebElement swipeAndFindElement(AppiumObject object, String direction) throws Exception {

		WebElement element = null;
		while (Context.current().getKeywordRemaningSeconds() > 6) {

			element = this.findElementExceptionHandled(object);
			if (element != null) {
				break;
			}
			System.out.println("#33 Direction: " + direction);
			this.swipeTowards(direction);
		}

		return element;
	}

	public WebElement swipeAndFindElement(AppiumObject object, String direction, int startingPercentage,
			int endingPercentage) throws ToolNotSetException, InterruptedException,TimeOut_ObjectNotFoundException,ObjectNotFoundException, Exception {

		WebElement element = null;
		while (Context.current().getKeywordRemaningSeconds() > 6) {

			element = this.findElementExceptionHandled(object);
			if (element != null) {
				break;
			}
			System.out.println("#33 Direction: " + direction);
			this.swipeTowards(direction, startingPercentage, endingPercentage);
		}

		return element;
	}

	public WebElement findElementExceptionHandled(AppiumObject object)
			throws ToolNotSetException, InterruptedException, ObjectNotFoundException, TimeOut_ObjectNotFoundException {
		try {
			WebElement element = Finder.findWebElement(object);
			return element;
		} catch (ObjectNotFoundException exception) {
			
		//throw new ObjectNotFoundException(object);
		return null;	
		}
	}

	public FunctionResult swipeToText(ObjectProperty objectProperty, String direction) throws Exception {
		objectProperty = new ByTextArgumentValidator().validate(objectProperty);
		List<WebElement> elements = new ArrayList<WebElement>();

		while (Context.current().getKeywordRemaningSeconds() > 6) {

			elements = Finder.findElementByText(objectProperty.getTextToSearch(), objectProperty.isContains(),
					objectProperty.getIndex());
			if (elements.size() >= (objectProperty.getIndex() + 1)) {
				return Result.PASS().setOutput(true).make();
			}
			System.out.println("#33 Direction: " + direction);
			this.swipeTowards(direction);
		}

		return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).make();
	}

	public FunctionResult swipeOnObject(AppiumObject object, String direction) throws Exception {
		WebElement element = Finder.findWebElementUsingCheckPoint(object);
		this.swipeOnElement(element, direction);
		return Result.PASS().setOutput(true).make();
	}

	public void swipeOnElement(WebElement element, String direction) throws ToolNotSetException {
		System.out.println("Direction: " + direction);
		Point point = element.getLocation();
		Dimension eleSize = element.getSize();
		int centerX = point.getX() + (eleSize.getWidth() / 2);
		int centerY = point.getY() + (eleSize.getHeight() / 2);
		int moveToX = 0;
		int moveToY = 0;

		if (DIRECTION.LEFT.isMatch(direction)) {
			moveToX = point.getX() + 1;
			moveToY = point.getY() + (eleSize.getHeight() / 2);
		} else if (DIRECTION.RIGHT.isMatch(direction)) {
			moveToX = point.getX() + (eleSize.getWidth()) - 1;
			moveToY = point.getY() + (eleSize.getHeight() / 2);
		} else if (DIRECTION.UP.isMatch(direction)) {
			moveToX = point.getX() + (eleSize.getWidth() / 2);
			moveToY = point.getY() + 1;
		} else if (DIRECTION.DOWN.isMatch(direction)) {
			moveToX = point.getX() + (eleSize.getWidth() / 2);
			moveToY = point.getY() + (eleSize.getHeight()) - 1;
		} else {
			throw new IllegalArgumentException(ResultCodes.ERROR_ARGUMENT_DATA_INVALID.toString());
		}

		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(centerX, centerY))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)))
		.moveTo(PointOption.point(moveToX, moveToY)).release().perform();
	}

	public void horizontalSwipeOnElement(WebElement element, int percentage) throws ToolNotSetException {

		Point point = element.getLocation();
		Dimension eleSize = element.getSize();

		int startX = point.getX();
		int startY = point.getY() + (eleSize.getHeight() / 2);
		int moveToX = point.getX() + (eleSize.getWidth() * percentage / 100);
		int moveToY = point.getY() + (eleSize.getHeight() / 2);

		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(startX, startY))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)))
		.moveTo(PointOption.point(moveToX, moveToY)).release().perform();
	}

	public void verticalSwipeOnElement(WebElement element, int percentage) throws ToolNotSetException {
		Point point = element.getLocation();
		Dimension eleSize = element.getSize();

		int startX = point.getX() + (eleSize.getWidth() / 2);
		int startY = point.getY();

		int moveToX = point.getX() + (eleSize.getWidth() / 2);
		int moveToY = point.getY() + (eleSize.getHeight() * percentage / 100);

		new TouchAction<>(Finder.findAppiumDriver()).press(PointOption.point(startX, startY))
		.waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)))
		.moveTo(PointOption.point(moveToX, moveToY)).release().perform();
	}

	public FunctionResult swipeToObjectOnContainerObject(AppiumObject containerObject, AppiumObject objectToFind,
			String direction) throws Exception {
		System.out.println("Finding ContainerObject: ");
		WebElement we_ContainerObject = Finder.findWebElementUsingCheckPoint(containerObject);
		WebElement we_ObjectToFind = null;
		if (we_ContainerObject != null) {
			System.out.println("ContainerObjectFound");
			while (Context.current().getKeywordRemaningSeconds() > 6) {
				System.out.println("Finding ChildObject: ");
				we_ObjectToFind = this.findElementExceptionHandled(objectToFind);
				if (we_ObjectToFind != null) {
					return Result.PASS().setOutput(true).make();
				} else {
					this.swipeOnElement(we_ContainerObject, direction);
				}
			}
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("ObjectToFind Not Found")
					.make();
		} else {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false)
					.setMessage("Container Object Not Found").make();
		}
	}
}