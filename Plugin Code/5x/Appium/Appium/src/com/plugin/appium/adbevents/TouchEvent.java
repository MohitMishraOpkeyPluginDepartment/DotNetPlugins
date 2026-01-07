package com.plugin.appium.adbevents;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;

public class TouchEvent implements KeywordLibrary{
	
	public FunctionResult getCurrentTouchPositions() throws Exception{
		String command = "adb shell getevent -l";
		ProcessBuilder processBuilder = new ProcessBuilder(command.split(" "));
		Process process = processBuilder.start();

		BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
		String line = "";

		Pattern xPattern = Pattern.compile("ABS_MT_POSITION_X\\s+(\\w+)");
		Pattern yPattern = Pattern.compile("ABS_MT_POSITION_Y\\s+(\\w+)");
		String xCord = null, yCord = null;

		while (true) {
			if ((line = reader.readLine()) != null) {
				while ((line = reader.readLine()) != null) {
					if (line.contains("EV_ABS")) {
						process.destroy();
						break;
					} else {
						continue;
					}
				}
				break;
			}
		}

		while ((line = reader.readLine()) != null) {
			Matcher xMatcher = xPattern.matcher(line);
            Matcher yMatcher = yPattern.matcher(line);

            if (xMatcher.find()) {
                xCord = xMatcher.group(1);
            }

            if (yMatcher.find()) {
                yCord = yMatcher.group(1);
            }

		}
		System.out.println("Touch Screen coordinates:-\nX = " + Integer.parseInt(xCord, 16) + "\nY= " + Integer.parseInt(yCord, 16));
		
		if(xCord != null && yCord != null) {
			return Result.PASS().setOutput(true).setMessage("Success").make();
		}else {
			return Result.FAIL(ResultCodes.ERR_MANDATORY_DATA_MISSING).setOutput(false).setMessage("Failed").make();
		}
	}
}
