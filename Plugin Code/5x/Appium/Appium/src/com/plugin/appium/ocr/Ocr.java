package com.plugin.appium.ocr;

import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.apache.commons.io.FileUtils;
import org.json.JSONObject;
import org.openqa.selenium.Keys;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.plugin.appium.Finder;
import com.plugin.appium.android.ADBCommand;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.exceptionhandlers.ToolNotSetException;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.TouchAction;
import io.appium.java_client.touch.WaitOptions;
import io.appium.java_client.touch.offset.PointOption;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class Ocr implements IOcr {

	private static Map<String, Object> jsonFullData = new LinkedHashMap<>();

	@Override
	public FunctionResult Method_OCRGetPageText(String imagePath) throws Exception {
		// file should be less than equals 1 mb
		// api call limit is 25000

		File file = new File(imagePath);
		if (!file.exists()) {
			System.err.println("Error: File not found at " + imagePath);
			System.out.println("The file not exists.");
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
					.setMessage("text cannot be empty. provide valid text").make();
		}

		Response response;
		try {
			response = this.callOCRApi(file);
			if (!response.isSuccessful()) {
				System.err.println("Request failed with status code: " + response.code());
				return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false)
						.setMessage("Request failed with status code: " + response.code()).make();
			} else {

				String ApiResponse = response.body().string();
				JSONObject jsonResponse = new JSONObject(ApiResponse);
				String JsonArray = jsonResponse.getJSONArray("ParsedResults").getJSONObject(0)
						.getJSONObject("TextOverlay").getJSONArray("Lines").toString();
				return Result.PASS().setOutput(true).setMessage(JsonArray).make();
			}
		} catch (IOException e) {
			System.err.println("Network error: " + e.getMessage());
			// e.printStackTrace();
			return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false)
					.setMessage("Network error: " + e.getMessage()).make();

		}
	}

	@Override
	public FunctionResult Method_OCRGetPageText() throws Exception {
		// file should be less than equals 1 mb
		// api call limit is 25000
		if (!AppiumContext.isPCloudy() && !AppiumContext.isIOS()) {

			File ImageFile = this.getScreenshotFile();
			if (!ImageFile.exists()) {
				System.err.println("Error: File not found at " + ImageFile.getAbsolutePath());
				System.out.println("The file not exists.");
				return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false)
						.setMessage("text cannot be empty. provide valid text").make();
			}

			Response response;
			try {
				response = this.callOCRApi(ImageFile);
				if (!response.isSuccessful()) {
					System.err.println("Request failed with status code: " + response.code());
					return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false)
							.setMessage("Request failed with status code: " + response.code()).make();
				} else {
					String ApiResponse = response.body().string();
					JSONObject jsonResponse = new JSONObject(ApiResponse);
					String JsonArray = jsonResponse.getJSONArray("ParsedResults").getJSONObject(0)
							.getJSONObject("TextOverlay").getJSONArray("Lines").toString();
					return Result.PASS().setOutput(true).setMessage(JsonArray).make();
				}
			} catch (IOException e) {
				System.err.println("Network error: " + e.getMessage());
				// e.printStackTrace();
				return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false)
						.setMessage("Network error: " + e.getMessage()).make();

			}
		} else {// pcloudy code here

			// https://www.pcloudy.com/docs/pcloudy-mobile-commands-2

			//
			// String pageText;
			// Map<String, Object> params = new HashMap<>();
			// Object info = Finder.findAppiumDriver().executeScript("mobile:ocr:text",
			// params);
			// pageText = (String) info;
			// System.out.println("## << pcloudy ocr text " + pageText);
			// Result.PASS().setOutput(true).setMessage(pageText).make();

			//
			// String pageText;
			// Map<String, Object> params = new HashMap<>();
			// params.put("word", "abc") // change the word
			// Object info =
			// Finder.findAppiumDriver().executeScript("mobile:ocr:coordinate", params);
			// pageText = (String) info;
			// System.out.println("## << pcloudy ocr text " + pageText);
			// Result.PASS().setOutput(true).setMessage(pageText).make();

			File file = this.getScreenshotFile();
			System.out.println("##<< pcloudy file screenshot " + file.getAbsolutePath());
			Response response;
			try {
				response = this.callOCRApi(file);

				if (!response.isSuccessful()) {
					System.err.println("Request failed with status code: " + response.code());
					return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false)
							.setMessage("Request failed with status code: " + response.code()).make();
				} else {
					String ApiResponse = response.body().string();
					JSONObject jsonResponse = new JSONObject(ApiResponse);
					String JsonArray = jsonResponse.getJSONArray("ParsedResults").getJSONObject(0)
							.getJSONObject("TextOverlay").getJSONArray("Lines").toString();
					return Result.PASS().setOutput(true).setMessage(JsonArray).make();
				}
			} catch (IOException e) {
				System.err.println("Network error: " + e.getMessage()); //
				e.printStackTrace();
				return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false)
						.setMessage("Network error: " + e.getMessage()).make();

			}
		}

	}

	public Response callOCRApi(File file) throws Exception {

		OkHttpClient client = new OkHttpClient().newBuilder().retryOnConnectionFailure(true).build();
		RequestBody fileBody = RequestBody.create(file, MediaType.get("application/octet-stream"));
		RequestBody body = new MultipartBody.Builder().setType(MultipartBody.FORM)
				.addFormDataPart("file", file.getName(), fileBody).addFormDataPart("language", "eng")
				.addFormDataPart("issearchablepdfhidetextlayer", "false")
				.addFormDataPart("iscreatesearchablepdf", "true").addFormDataPart("scale", "true")
				.addFormDataPart("isoverlayrequired", "false").addFormDataPart("istable", "true")
				.addFormDataPart("detectorientation", "false").build();

		Request request = new Request.Builder().url(IOcr.url).post(body).addHeader("apikey", IOcr.apikey).build();

		Response response = client.newCall(request).execute();
		return response;
	}

	@Override
	public File takeScreenshotUsingAppium() throws Exception {
		return Finder.findAppiumDriver().getScreenshotAs(OutputType.FILE);

	}

	public File getScreenshotFile() throws Exception {
		File ImageFile = new File(System.getProperty("user.dir"),
				UUID.randomUUID().toString().replace("-", "") + "Image.png");
		File file = null;
		try {
			file = this.takeScreenshotUsingAppium();
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Error While Capturing Image With Appium!");
			System.out.println("Capturing Through ADB ....");
			if (!AppiumContext.isPCloudy() && AppiumContext.isAndroid()) {
				file = com.plugin.appium.Utils.takeSnapShotViaADB(ImageFile);
			}

		}

		if (file != null && file.length() > 0) {
			long fileSizeInBytes = file.length();
			double fileSizeInKB = fileSizeInBytes / 1024.0;
			// double fileSizeInMB = fileSizeInKB / 1024.0;
			System.out.println("File Size : " + fileSizeInKB);
			if (fileSizeInKB > 1024) {
				Result.FAIL(ResultCodes.ERROR_DATA_TOO_LONG).setOutput(false)
						.setMessage("Capture File Size Is Grater Than 1MB").make();
			}

			try {
				FileUtils.copyFile(file, ImageFile);
			} catch (IOException e) {
				e.printStackTrace();
				FileUtils.copyFile(file, ImageFile);
				// if still we get blank text then this file is blank
			}
		}
		return ImageFile;
	}

	@Override
	public FunctionResult Method_OCRTap(String wordToSearch, int index) throws Exception {
		File screenShot = this.getScreenshotFile();
		Map<String, String> coordinates = this.findWord(screenShot, wordToSearch, index);

		if(coordinates.get("status").equals("true")) {
			String sleft = coordinates.get("left");
	    	String stop = coordinates.get("top");
	    	double left = Double.valueOf(sleft);
	    	double top = Double.valueOf(stop);
	    	tapOnCoordinates((int)left ,(int)top);
	    	return Result.PASS().setOutput(true).setMessage("Successfully Tap On Coordinates : X : "+ left +" Y : "+ top).make();
		}else {
			return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false).setMessage(coordinates.get("message")).make();
		}
		// tap functionalitty should be here 
	}

	public Map<String,String> findWord(File imageFile, String word, int index) {
		Map<String,String> coordinatesData = new HashMap<>();
		
		try {
			if (!imageFile.exists() || imageFile == null) {
				coordinatesData.put("status", "false");
				coordinatesData.put("message", "Image file is null or empty");
				return coordinatesData;
			}

			System.out.println("##<< Searching Word : " + word+" with index : "+index);

			Response response = this.callOCRApi(imageFile); // fails after some apis 
			if (!response.isSuccessful()) {
				coordinatesData.put("status", "false");
				coordinatesData.put("message", "Request failed with status code: " + response.code());
				return coordinatesData;
			}
			System.out.println(" Is Response SuccessFull : " + response.isSuccessful());
			System.out.println(" Response Code : " + response.code());

			String responseBody = response.body().string();
			System.out.println("##<<  Response body : " + responseBody);
			JsonObject jsonResponse = null;
			try {
				jsonResponse = JsonParser.parseString(responseBody).getAsJsonObject();
			} catch (Exception e) {
				System.out.println("##<< error while converting String Response to   JSON Object : "+e.getMessage());
				e.printStackTrace();

			}
			Gson gson = new GsonBuilder().setPrettyPrinting().create();
			System.out.println(" JSON Response: ");
			System.out.println(gson.toJson(jsonResponse));

			try {
				jsonFullData = this.processOCRData(responseBody); // process response body
			} catch (Exception e) {
				System.out.println("##<< error while processing  JSON data : "+e.getMessage());
				e.printStackTrace();
			}
			System.out.println(" Return Json :  : " + gson.toJson(jsonFullData));

			@SuppressWarnings("unchecked")
			List<OCRDataModel> wordDataList = (List<OCRDataModel>) jsonFullData.get("dataObject");
			List<OCRDataModel> matchingLines = wordDataList.stream()
					.filter(data -> data.getLine().equals(word) || data.getLine().contains(word))
					.collect(Collectors.toList());
			
             System.out.println("##<< matching lines  found : "+matchingLines.size());
             boolean isOnlyOne = false;
             if (matchingLines.size() == 1) {
            	 isOnlyOne = true;
             }
             
			 if (matchingLines.size() >= index || isOnlyOne ) {
				 System.out.println("##<< Finding  word through index : "+matchingLines.size());
				 OCRDataModel target = null;
				 
				 if(isOnlyOne || index == 0) {
					 target = matchingLines.get(0);
				 }else {
					 target = matchingLines.get(index - 1);
				 }
				 
				String lineString = target.getLine();

				if (lineString.equals(word)) {
					String[] splitWords = lineString.split(" ");
					Map<String, Map<String, String>> firstWordMap = target.getLineWords().get(0);
					Map<String, String> attributes = firstWordMap.get(splitWords[0]);
					double left = Double.parseDouble(attributes.get("Left"));
					double top = Double.parseDouble(attributes.get("Top"));
					double height = Double.parseDouble(attributes.get("Height"));
					double width = Double.parseDouble(attributes.get("Width"));
					
					coordinatesData.put("status", "true");
					coordinatesData.put("message", "Successfull");
					coordinatesData.put("left", String.valueOf(left));
					coordinatesData.put("top", String.valueOf(top));
					coordinatesData.put("height", String.valueOf(height));
					coordinatesData.put("width", String.valueOf(width));
					return coordinatesData;
					
				} else {
					Optional<Map<String, Map<String, String>>> matchingWordMap = target.getLineWords().stream()
							.filter(map -> map.containsKey(word)).findFirst();
					if (matchingWordMap.isPresent()) {
						Map<String, String> thatWord = matchingWordMap.get().get(word);
						double left = Double.parseDouble(thatWord.get("Left"));
						double top = Double.parseDouble(thatWord.get("Top"));
						double height = Double.parseDouble(thatWord.get("Height"));
						double width = Double.parseDouble(thatWord.get("Width"));
												
						coordinatesData.put("status", "true");
						coordinatesData.put("message", "Successfull");
						coordinatesData.put("left", String.valueOf(left));
						coordinatesData.put("top", String.valueOf(top));
						coordinatesData.put("height", String.valueOf(height));
						coordinatesData.put("width", String.valueOf(width));
						return coordinatesData;
						
					} else {
						String[] splitWords = lineString.split(" ");
						Map<String, Map<String, String>> firstWordMap = target.getLineWords().get(0);
						Map<String, String> attributes = firstWordMap.get(splitWords[0]);
						double left = Double.parseDouble(attributes.get("Left"));
						double top = Double.parseDouble(attributes.get("Top"));
						double height = Double.parseDouble(attributes.get("Height"));
						double width = Double.parseDouble(attributes.get("Width"));
						
						coordinatesData.put("status", "true");
						coordinatesData.put("message", "Successfull");
						coordinatesData.put("left", String.valueOf(left));
						coordinatesData.put("top", String.valueOf(top));
						coordinatesData.put("height", String.valueOf(height));
						coordinatesData.put("width", String.valueOf(width));
						return coordinatesData;
					}
				}
			} else {
				coordinatesData.put("status", "false");
				coordinatesData.put("message","Unable To Find The Word: " + word);
				return coordinatesData;
			}

		} catch (Exception e) {
			e.printStackTrace();
			coordinatesData.put("status", "false");
			coordinatesData.put("message", "Error : " + e.getMessage());
			return coordinatesData;
		}
	}

	public Map<String, Object> processOCRData(String response) {
		Map<String, Object> jsonData = new LinkedHashMap<>();
		try {
			JsonObject jsonResponse = JsonParser.parseString(response).getAsJsonObject();
			List<OCRDataModel> dataList = new ArrayList<>();
			List<String> allWords = new ArrayList<>();

			if (jsonResponse.has("ParsedResults")) {
				JsonArray parsedResults = jsonResponse.getAsJsonArray("ParsedResults");

				dataList = StreamSupport.stream(parsedResults.spliterator(), false).flatMap(result -> {
					JsonArray lines = result.getAsJsonObject().getAsJsonObject("TextOverlay").getAsJsonArray("Lines");
					return StreamSupport.stream(lines.spliterator(), false);
				}).map(lineElement -> {
					JsonObject lineObj = lineElement.getAsJsonObject();
					OCRDataModel model = new OCRDataModel();
					String line = lineObj.get("LineText").getAsString();
					model.setLine(line);
					model.setLineMaxHeight(lineObj.get("MaxHeight").getAsString());
					model.setLineMinTop(lineObj.get("MinTop").getAsString());

					List<Map<String, Map<String, String>>> lineWordsList = StreamSupport.stream(lineObj.getAsJsonArray("Words")
							.spliterator(), false).map(wordElement -> {
								JsonObject wordObj = wordElement.getAsJsonObject();
								Map<String, String> wordAttributes = new LinkedHashMap<>();
								wordAttributes.put("Left", wordObj.get("Left").getAsString());
								wordAttributes.put("Top", wordObj.get("Top").getAsString());
								wordAttributes.put("Height", wordObj.get("Height").getAsString());
								wordAttributes.put("Width", wordObj.get("Width").getAsString());

								String originalWord = wordObj.get("WordText").getAsString();
								allWords.add(originalWord);
								Map<String, Map<String, String>> wordMap = new LinkedHashMap<>();
								wordMap.put(originalWord, wordAttributes);
								return wordMap;
							}).collect(Collectors.toList());
					model.setLineWords(lineWordsList);
					return model;
				}).collect(Collectors.toList());
			}

			jsonData.put("allWords", allWords);
			String jsonPdfUrl = jsonResponse.has("SearchablePDFURL") ? jsonResponse.get("SearchablePDFURL").getAsString() : "";
			jsonData.put("detectedFile", jsonPdfUrl);
			jsonData.put("dataObject", dataList);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return jsonData;
	}

	public void tapOnCoordinates(int x, int y) throws Exception {
		
		if (AppiumContext.isPCloudy() == true && AppiumContext.isAndroid() == true) {
			System.out.println(" ##<< Running command on pcloudy ");
			String command = "adb shell input tap " + String.valueOf(x) + " " + String.valueOf(y);
			// ADBCommand.runAdbCommandOnPcloudy(command); // for pcloudy execution
			try {
				Finder.findAppiumDriver().executeScript("pCloudy_executeAdbCommand", command);
			} catch (Exception e) {
				System.out.println("##<< Exception while executing adb command on pcloudy " + e.getMessage());
			}

		} else if (AppiumContext.isPCloudy() == true && AppiumContext.isIOS() == true) {
			this.touchActionTap(x, y);
		} else {
			if (AppiumContext.isAndroid() == true) {
				System.out.println("##<< Tapping in android local on x and y " + x + " " + y);
				String adbpath = AppiumContext.getAndroidContext().getAdbpath();
				String[] tap = { adbpath, "shell", "input", "tap", String.valueOf(x) + " " + String.valueOf(y) };
				ADBCommand.runAdbCommandOnLocal(tap);
				System.out.println("##<< Adb command executed on local  ");
			}

		}

	}

	public void touchActionTap(int x, int y) throws ToolNotSetException {
		System.out.println("##<< Tapping in ios on x and y " + x + " " + y);
		TouchAction<?> action = new TouchAction<>(Finder.findAppiumDriver());
		action.tap(PointOption.point(x, y));
		action.waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)));
		action.release();
		action.perform();
	}
	
	//***************************** NEW ADD *************************************************
	
	@Override
	public FunctionResult Method_OCRSendKeys(String wordToSearch, int index, String text) throws Exception{
		File screenShot = this.getScreenshotFile();
		if (screenShot.length() == 0) {
			return Result.FAIL(ResultCodes.ERROR_FILE_NOT_FOUND).setOutput(false).setMessage("Screenshot not captured successfully" ).make();
		}
		Map<String, String> coordinates = this.findWord(screenShot, wordToSearch, index);

	    if(coordinates.get("status").equals("true")) {
	    	String sleft = coordinates.get("left");
	    	String stop = coordinates.get("top");
	    	double left = Double.valueOf(sleft);
	    	double top = Double.valueOf(stop);
	    	tapOnCoordinates((int)left ,(int)top);
	    	
		    if(this.appiumTypeText(Finder.findAppiumDriver(), text)) {
			    if(this.appiumPressEnter(Finder.findAppiumDriver())) {
				   return Result.PASS().setOutput(true).setMessage("Successfully: Enter Text :" + text).make();
			    }
		    }
		 }
		return Result.FAIL(ResultCodes.ERROR_UNSUPPORTED_OPERATION).setOutput(false).setMessage("Error In Entering Text" ).make();
	}
	
	public boolean appiumTypeText(AppiumDriver<WebElement> driver, String text) {
		System.out.println("##<< Typing Text : " + text);
		boolean result = false;
		try {
			Actions actions = new Actions(driver);
			actions.sendKeys(text).perform();
			result = true; 
		}catch(Exception e) {
			System.out.println("##<< Error: Unable To Type Text "+ e.getMessage());
		}
		return result;
	}
	
	public boolean appiumPressEnter(AppiumDriver<WebElement> driver) {
		System.out.println("##<< Pressing Enter");
		boolean result = false;
		try {
			Actions actions = new Actions(driver);
			actions.sendKeys(Keys.ENTER).perform();
			result = true;
		}catch(Exception e) {
			System.out.println("##<< Error: Unable To Press Enter "+ e.getMessage());
		}
		return result;
	}

	
	@Override
	public FunctionResult Method_OCRGetWordCoordiantes(String wordToSearch,int index) throws Exception {
		File screenShot = this.getScreenshotFile();
		if (screenShot.length() == 0) {
			return Result.FAIL(ResultCodes.ERROR_FILE_NOT_FOUND).setOutput(false).setMessage("Unable to get Screeshot").make();
		}
		Map<String, String> coordinates = this.findWord(screenShot, wordToSearch,index);

		if(coordinates.get("status").equals("true")) {
			String sleft = coordinates.get("left");
	    	String stop = coordinates.get("top");
	    	double left = Double.valueOf(sleft);
	    	double top = Double.valueOf(stop);
	    	
	    	return Result.PASS().setOutput(true).setMessage(" Coordinates : X : "+ left +" Y : "+ top).make();
		}else {
			return Result.FAIL(ResultCodes.ERROR_OBJECT_NOT_FOUND).setOutput(false).setMessage("Unable to find word ").make();
		}
	}

	
}
