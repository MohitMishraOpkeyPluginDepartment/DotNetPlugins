package com.plugin.appium.annotations.keywordValidation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface KeywordArgumentValidation {
	int[] checkDataForBlank() default {};

	int[] checkDataForWhiteSpace() default {};

	int[] checkDataForDelimiter() default {};
}