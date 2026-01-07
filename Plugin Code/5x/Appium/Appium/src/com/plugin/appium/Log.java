package com.plugin.appium;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Log {

	static Logger log = Logger.getLogger(Log.class.getName());
	public static boolean printDebugLog = true;

	public static void print(String msg) {
		//log.fine("Fine :: " + msg);
		//log.finer("Finer :: " + msg);
		System.out.println("SYSO :: " + msg);
	}

	public static void print(int msg) {
		log.fine(Integer.toString(msg));
	}

	public static void print(double msg) {
		log.fine(Double.toString(msg));
	}

	public static void print(float msg) {
		log.fine(Float.toString(msg));
	}

	public static void print(boolean msg) {
		log.fine(Boolean.toString(msg));
	}

	public static void print(Object obj) {
		log.fine(obj.toString());
	}

	public static void err(String msg) {
		log.fine(msg);
	}

	public static void err(Exception e) {
		StringWriter sw = new StringWriter();
		e.printStackTrace(new PrintWriter(sw));
		log.fine(sw.toString());
	}

	public static void debug(String msg) {
		if (printDebugLog)
			log.fine(msg);
	}

	public static void debug(Object obj) {
		if (printDebugLog)
			log.fine(obj.toString());
	}

	public static void debugErr(Exception e) {
		if (printDebugLog)
			err(e);
	}

	public static void startLogs() {
		log.setLevel(Level.ALL);
	}

	public static void stopLogs() {
		log.setLevel(Level.OFF);
	}

	public static void startDebugLogs() {
		printDebugLog = true;
	}

	public static void stopDebugLogs() {
		printDebugLog = false;
	}

	/**
	 * This method reads .properties file and get "printDebugLog"
	 * 
	 * @return
	 */
	public static void setPrintDebugSatus() {

		stopDebugLogs();

	}

	public static void main(String[] args) {

		startLogs();

		print("Print");
		print("1Print\n ashdkjasdhkashkd");
		err("Err");
		debug("Debug");

		stopDebugLogs();

		print("1Print\n ashdkjasdhkashkd");
		err("1Err");
		debug("1Debug");

		startDebugLogs();

		print("2Print");
		err("2Err");
		debug("2Debug");

	}

}
