package com.plugin.appium.annotations.keywordValidation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.plugin.appium.enums.ActionType;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface KeywordActionType {
   public ActionType[] value() default ActionType.DEFAULT;
}
