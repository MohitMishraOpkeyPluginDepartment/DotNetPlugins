package com.plugin.appium;

import java.io.IOException;
import java.io.InputStream;
import java.lang.ProcessBuilder.Redirect;
import java.util.ArrayList;
import java.util.logging.Logger;

import com.plugin.appium.context.AppiumContext;

public class ReadAppiumServerLog implements Runnable {

	static Logger logger = Logger.getLogger(ReadAppiumServerLog.class.getName());

	ArrayList<String> command = new ArrayList<String>();

	public ReadAppiumServerLog(ArrayList<String> cmd) {
		this.command = cmd;
	}

	@Override
	public void run() {

		ProcessBuilder prb = new ProcessBuilder(this.command);
		Process ps = null;
		try {
			ps = prb.start();
			AppiumContext.setAppiumServerProcess(ps);
		} catch (IOException e1) {
			e1.printStackTrace();
		}

		prb.redirectErrorStream(true);
		prb.redirectError(Redirect.PIPE);
		prb.redirectOutput(Redirect.PIPE);
		InputStream stdInputStream = ps.getInputStream();
		InputStream StdErrorStream = ps.getErrorStream();

		try {
			Utils.bindStream(stdInputStream, StdErrorStream);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			System.out.println("Warning exception while ReadAppiumServerLog: " + e.getMessage());
			//e.printStackTrace();
		}

		logger.fine("Log Reading thread exit Sucessfully");
	}

}
