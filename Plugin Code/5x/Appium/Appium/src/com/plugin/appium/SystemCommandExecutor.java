package com.plugin.appium;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import com.plugin.appium.exceptionhandlers.UnableToProcessADBCommandException;

public class SystemCommandExecutor {

	public static String startProcess(String[] commandLineArgs, boolean waitFor)
			throws UnableToProcessADBCommandException, InterruptedException {
		String Message = "";
		String result = "";
		try {
			ProcessBuilder pb = new ProcessBuilder(commandLineArgs);
			Log.debug("Command-To-Execute" + pb.command() + "\n");
			Message = Message + pb.command() + "\n";
			Process process = pb.start();
			BufferedReader stdError = new BufferedReader(new InputStreamReader(process.getErrorStream()));
			BufferedReader stdOutput = new BufferedReader(new InputStreamReader(process.getInputStream()));
			StringBuilder builder = new StringBuilder();
			String line = null;

			while ((line = stdOutput.readLine()) != null) {
				builder.append(line);
				builder.append(System.getProperty("line.separator"));
				Log.debug("[Command-Output]" + line);
			}
			while ((line = stdError.readLine()) != null) {
				builder.append(line);
				builder.append(System.getProperty("line.separator"));
				Log.debug("[Command-Error]" + line);
			}

			result = builder.toString();
			if (waitFor)
				process.waitFor();
			process.destroy();
		} catch (IOException e) {
			throw new UnableToProcessADBCommandException(String.valueOf(commandLineArgs), e);
		}
		return Message + result;
	}
	
	public static String runCommand(String command) throws InterruptedException, IOException {
		Process p = Runtime.getRuntime().exec(command);
		// get std output
		BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()));
		String line = "";
		String allLine = "";
		while ((line = r.readLine()) != null) {
			allLine = allLine + "" + line + "\n";
			if (line.contains("Console LogLevel: debug") && line.contains("Complete")) {
				break;
			}
		}
		return allLine;
	}

}
