package com.crestech.opkey.plugin;

import org.openqa.selenium.WebElement;

import com.crestech.opkey.plugin.webdriver.OpkeyLogger;
import com.crestech.opkey.plugin.webdriver.keywords.WebObjects;
import com.crestech.opkey.plugin.webdriver.pluginSpecific.PluginScenario;

public class CP_Scenario extends PluginScenario {
	
	static Class<PluginScenario> _class = PluginScenario.class;

	/**
	 * @throws Exception
	 **
	 **/
	@Override
	public void afterFindingElement(WebElement element) throws Exception {
		OpkeyLogger.printSaasLog(_class, "========== afterFindingElement of Oracle Fusion Plugin =============");
		new WebObjects().highlightElement(element);
		shouldWePerformAction(element);
	}
}
