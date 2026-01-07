package com.crestech.opkey.plugin;


import com.crestech.opkey.plugin.webdriver.BeforeKeywordClean;

public class BeforeKeywordSessionCleanup extends BeforeKeywordClean {

	@Override
	public void beforeKeywordCleanSession() {
		super.beforeKeywordCleanSession();
		cleanSession();
	}

	private void cleanSession() {
		
	}
}
