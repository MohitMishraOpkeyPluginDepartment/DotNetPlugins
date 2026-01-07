package com.plugin.appium.annotations.keywordValidation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)

public @interface NotSupportedInHybridApplication {
// when hybrid application is run on below android version 4.4 we are using selendroid mode 
// we run appium using selendroid mode in selendroid mode some keyword not working 	
	
}
