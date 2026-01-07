package com.crestech.opkey.plugin.keywords;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;

public class ModuleMetaData implements KeywordLibrary {

	private static String Module = "Default Module";
	private static String Sub_Module = "Default SubModule";

	public FunctionResult Method_SetMetaData(String Module, String SubModule) {

		if (Module == null || Module.isEmpty()) {
			System.out.println("Module is Empty");
			Module = "";
		}
		if (SubModule == null || SubModule.isEmpty()) {
			System.out.println("Sub Module is Empty");
			SubModule = "";
		}

		ModuleMetaData.Module = Module;
		ModuleMetaData.Sub_Module = SubModule;

		Module = Module + " : " +  SubModule;
		return Result.PASS().setOutput(Module).setMessage("Done").make();
	}

	public static String getModule() {
		return Module;
	}

	public static String getSub_Module() {
		return Sub_Module;
	}

}
