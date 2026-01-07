package com.plugin.appium;

import java.io.IOException;
import java.io.InputStream;
import java.util.logging.Logger;

import com.plugin.appium.context.AppiumContext;

public class ReadAndroidScreenCastLog implements Runnable {

	static Logger logger = Logger.getLogger(ReadAppiumServerLog.class.getName());
	private String commad;

	public ReadAndroidScreenCastLog(String cmd) {
		this.commad = cmd;
	}

	@Override
	public void run() {

		Process ps = null;
		try {

			ps = Runtime.getRuntime().exec(commad);

			AppiumContext.setAppiumServerProcess(ps);

		} catch (IOException e1) {
			e1.printStackTrace();
		}

		InputStream stdInputStream = ps.getInputStream();
		InputStream StdErrorStream = ps.getErrorStream();
		
		
		try {
			Utils.bindStream(stdInputStream, StdErrorStream);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			System.out.println("Warning exception while ReadAndroidScreenCastLog: " + e.getMessage());
			//e.printStackTrace();
		}

		logger.fine("Log Reading from Android Screen Cast thread exit Sucessfully");

	}

}
