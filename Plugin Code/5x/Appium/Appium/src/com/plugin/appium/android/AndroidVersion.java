package com.plugin.appium.android;

import java.util.regex.Pattern;

public class AndroidVersion {

	private int major;
	private int minor;

	public AndroidVersion(String version) {
		if(version.contains(".")){
			String[] split = Pattern.compile(".", Pattern.LITERAL).split(version);
			major = Integer.parseInt(split[0]);
			minor = Integer.parseInt(split[1]);
		}else {
			this.major = Integer.parseInt(version);
			this.minor = 0;
		}
	}

	public int getMajor() {
		return major;
	}

	public int getMinor() {
		return minor;
	}
	
	public String getVersion() {
		return this.getMajor() + "." + this.getMinor();
	}

	@Override
	public String toString() {
		return this.getMajor() + "." + this.getMinor();
	}
}
