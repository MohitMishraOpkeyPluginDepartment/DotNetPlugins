package com.crestech.opkey.plugin;

import java.io.File;

import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.keywords.web.DynamicMethods;
import com.crestech.opkey.plugin.webdriver.KeywordContext;
import com.crestech.opkey.plugin.webdriver.WebMain;
import com.crestech.opkey.plugin.webdriver.enums.PluginName;
import com.crestech.opkey.plugin.webdriver.keywords.ChromeOptionProvider;
import com.crestech.opkey.plugin.webdriver.keywords.SetCapabilities;
import com.crestech.opkey.plugin.webdriver.keywords.interfaceClass.OracleFusionMethods;

public class CoupaMain {

	public static void main(String args[]) throws Throwable {
		/*
		 * for (String string : args) { System.out.println(
		 * "******************************************************\n" + string); }
		 */
		OracleFusionMethods ofMethod = new DynamicMethods();
		com.crestech.opkey.plugin.webdriver.Finder.oracleMethod = ofMethod;
		KeywordContext.get().finderOverride = new Finder();
		KeywordContext.get().runningPlugin = PluginName.Coupa;
		KeywordContext.get().pluginPropertyFileName = "Coupa";
		//com.crestech.opkey.plugin.webdriver.Finder.isOracleFusion = true;
		KeywordContext.get().pluginScenario = new CP_Scenario();

		WebMain.main(args);
	}

}