package com.plugin.appium.util;

import java.util.concurrent.Callable;

public class FunctionCaller {
	public static <T> T callReturnFunction(Callable<T> task, String message) throws Exception {
		long startTime = System.currentTimeMillis();
		T call = task.call();
		String timeTaken = (System.currentTimeMillis() - startTime) + "ms";
		System.out.println("Return: " + message + " : " + timeTaken);
		return call;
	}

	public static <T> void callVoidFunction(Runnable aMethod, String message) {
		long startTime = System.currentTimeMillis();
		aMethod.run();
		String timeTaken = (System.currentTimeMillis() - startTime) + "ms";
		System.out.println("Void: " + message + " : " + timeTaken);
	}

	public static <T> T callWithChekPoint(Callable<T> task, String message) throws Exception {
		long startTime = System.currentTimeMillis();
		T call = new GenericCheckpoint<T>() {

			@Override
			public T _innerRun() throws Exception {
				T call = task.call();
				return call;
			}
		}.run();

		
		String timeTaken = (System.currentTimeMillis() - startTime) + "ms";
		System.out.println("CheckPoint: " + message + " : " + timeTaken);
		return call;
	}
}
