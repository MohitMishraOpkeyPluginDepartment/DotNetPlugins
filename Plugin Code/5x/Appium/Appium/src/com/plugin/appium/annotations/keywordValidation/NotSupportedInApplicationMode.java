package com.plugin.appium.annotations.keywordValidation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface NotSupportedInApplicationMode {
// Not supported In application mode refer keyword is not supported in application 
// Example com.ba.mobile.app  not supported navigateTo keyword 
// But keyword is supported in browser like in chrome 
}
