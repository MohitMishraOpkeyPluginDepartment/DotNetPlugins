package com.plugin.appium;

import java.util.List;

import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functioncall.FunctionCall;
import com.crestech.opkey.plugin.communication.contracts.functioncall.FunctionCall.DataArguments.DataArgument;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.plugin.appium.exceptionhandlers.KeywordMethodOrArgumentValidationFailException;

public class Validations {

	public static void checkDataForBlank(FunctionCall fc, int... blankDataArgIndices) throws KeywordMethodOrArgumentValidationFailException {

		String tempArgs = "";

		List<DataArgument> dataArgArrList = fc.getDataArguments().getDataArgument();

		System.out.println("blankDataArgIndices" + blankDataArgIndices.length);

		for (int mayBeBlankIndex : blankDataArgIndices) {

			if (dataArgArrList.get(mayBeBlankIndex).getValue().isEmpty()) {

				tempArgs = tempArgs + dataArgArrList.get(mayBeBlankIndex).getArgumentName();

				if (mayBeBlankIndex < (blankDataArgIndices.length - 1))
					tempArgs = tempArgs + ", ";
			}
		}

		if (!tempArgs.isEmpty()) {
			tempArgs = "Argumemt(s) : (" + tempArgs + ") are blank.";
			throw new KeywordMethodOrArgumentValidationFailException(tempArgs, ResultCodes.ERROR_ARGUMENT_DATA_MISSING);

		}
	}
	
	public static void checkDataForBlank(int... blankDataArgIndices) throws KeywordMethodOrArgumentValidationFailException {

		String tempArgs = "";

		List<DataArgument> dataArgArrList = Context.current().getFunctionCall().getDataArguments().getDataArgument();

		System.out.println("blankDataArgIndices" + blankDataArgIndices.length);

		for (int mayBeBlankIndex : blankDataArgIndices) {

			if (dataArgArrList.get(mayBeBlankIndex).getValue().isEmpty()) {

				tempArgs = tempArgs + dataArgArrList.get(mayBeBlankIndex).getArgumentName();

				if (mayBeBlankIndex < (blankDataArgIndices.length - 1))
					tempArgs = tempArgs + ", ";
			}
		}

		if (!tempArgs.isEmpty()) {
			tempArgs = "Argumemt(s) : (" + tempArgs + ") are blank.";
			throw new KeywordMethodOrArgumentValidationFailException(tempArgs, ResultCodes.ERROR_ARGUMENT_DATA_MISSING);

		}
	}

	public static void checkDataForWhiteSpace(FunctionCall fc, int... whiteSpaceDataArgIndices) throws KeywordMethodOrArgumentValidationFailException {

		String tempArgs = "";

		List<DataArgument> dataArgArrList = fc.getDataArguments().getDataArgument();

		for (int mayBeWhiteSpace : whiteSpaceDataArgIndices) {

			if (dataArgArrList.get(mayBeWhiteSpace).getValue().trim().isEmpty()) {

				tempArgs = tempArgs + dataArgArrList.get(mayBeWhiteSpace).getArgumentName();
				if (mayBeWhiteSpace < (whiteSpaceDataArgIndices.length - 1))

					tempArgs = tempArgs + ", ";
			}
		}

		if (!tempArgs.isEmpty()) {
			tempArgs = "Argumemt(s) : (" + tempArgs + ") \r\n may be not defined in proper format it contain(s) whitespaces.";
			throw new KeywordMethodOrArgumentValidationFailException(tempArgs, ResultCodes.ERROR_ARGUMENT_DATA_MISSING);
		}
	}

	public static void checkDataForDelimiter(FunctionCall fc, int... wrongDelimitedDataArgIndices) throws KeywordMethodOrArgumentValidationFailException {

		String tempArgs = "";

		List<DataArgument> dataArgArrList = fc.getDataArguments().getDataArgument();

		// check for each data args
		for (int mayBeWrongDelimited : wrongDelimitedDataArgIndices) {

			// checking for delimiter not to be present in the tempArgs
			// dataArgArrList
			if (!(dataArgArrList.get(mayBeWrongDelimited).getValue().contains(Utils.getDelimiter()))) {

				tempArgs = tempArgs + dataArgArrList.get(mayBeWrongDelimited).getArgumentName();
				// To avoid the semicolon at the last postion in the message to
				// be displayed to user.
				if (mayBeWrongDelimited < (wrongDelimitedDataArgIndices.length - 1))

					tempArgs = tempArgs + ", ";
			}
		}

		// tempArgs not empty implies that, one of the argument is not properly
		// delimited.
		if (!tempArgs.isEmpty()) {
			tempArgs = "Argumemt(s) : (" + tempArgs + ") \r\n may be not defined in proper format. Note : <" + Utils.getDelimiter() + "> is the delimiter in OpKey ";
			throw new KeywordMethodOrArgumentValidationFailException(tempArgs, ResultCodes.ERROR_ARGUMENT_DATA_MISSING);
		}
	}
	
	public static void checkDataForNegative(int... negIntDataArgIndices) throws ArgumentDataInvalidException {
		String tempArgs = "";
		List<DataArgument> dataArgArrList = Context.current().getFunctionCall().getDataArguments().getDataArgument();
		for (int mayBeBlankIndex : negIntDataArgIndices) {
			int argValue = 0;
			String argDatatype = dataArgArrList.get(mayBeBlankIndex).getDataType();
			// Log.print("argDatatype: " + argDatatype);
			if (argDatatype.equals("Integer")) {
				try {
					argValue = Integer.parseInt(dataArgArrList.get(mayBeBlankIndex).getValue());
				} catch (Exception e) {
				}
			} else
				continue;
			if (argValue < 0) {
				tempArgs = tempArgs + dataArgArrList.get(mayBeBlankIndex).getArgumentName();
				if (mayBeBlankIndex < (negIntDataArgIndices.length - 1))
					tempArgs = tempArgs + ";";
			}
		}
		if (!tempArgs.isEmpty()) {
			tempArgs = "Argument(s) : (" + tempArgs + ") is/are negative";
			throw new ArgumentDataInvalidException(tempArgs);
		}
	}
}
