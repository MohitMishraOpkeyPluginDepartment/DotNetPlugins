package com.plugin.appium.pcloudy;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.DesiredCapabilities;
import com.crestech.opkey.plugin.communication.contracts.functioncall.MobileApplication;
import com.crestech.opkey.plugin.communication.contracts.functioncall.MobileDevice;
import com.crestech.opkey.plugin.contexts.Context;
import com.google.common.collect.ImmutableMap;
import com.plugin.appium.android.AndroidVersion;
import com.plugin.appium.context.AppiumContext;
import com.plugin.appium.enums.BrowserType;
import com.plugin.appium.enums.DeviceType;

public class PCloudyCapabilities {

	private DesiredCapabilities capabilities;
	private boolean isSafari;
	private URL fullAppiumEndpoint;
	private String deviceVersion;
	private DesiredCapabilities olderCapabilities;
	private boolean isAndroid;
	private boolean isIOS;
	public MobileDevice mobileDevice;
	public MobileApplication mobileApplication;

	public PCloudyCapabilities() {

	}

	public PCloudyCapabilities(DesiredCapabilities olderCaps, MobileDevice mobileDevice,
			MobileApplication mobileApplication) throws IOException {

		if (AppiumContext.getDeviceType() == DeviceType.Android) {
			this.isAndroid = true;
		} else {
			this.isIOS = true;
		}
		this.mobileDevice = mobileDevice;
		this.mobileApplication = mobileApplication;
		this.olderCapabilities = olderCaps;
		this.capabilities = new DesiredCapabilities();
		this.deviceVersion = AppiumContext.getMobileDevice().getVersion();
		this.setCapsFromSettingFiles();
		if (this.isAndroid) {
			this.setAndroidCaps();
		} else {
			this.setiOSCaps();
		}

		this.setGenericCaps();
		// if (isReset)
		// caps.setCapability("fullReset", true);
//	System.out.println("Disabling SNI Extension via setting up environment variable");
//	System.setProperty("jsse.enableSNIExtension", "false");
	}

	private void setCapsFromSettingFiles() throws IOException {
		File pCloudy_AppiumCapabilities = new File(Context.session().getSettings().get("pCloudy_AppiumCapabilities"));
		System.out.println("pCloudy Setting File Path: " + pCloudy_AppiumCapabilities.getPath());
		FileInputStream fis = new FileInputStream(pCloudy_AppiumCapabilities);
		byte[] data = new byte[(int) pCloudy_AppiumCapabilities.length()];
		fis.read(data);
		fis.close();

		String pCloudy_AppiumCapabilities_FileContents = new String(data, "UTF-8");

		String os = System.getProperty("os.name");
		if (os.startsWith("Windows")) {
			for (String line : pCloudy_AppiumCapabilities_FileContents.split("\r\n")) {
				if (line.isEmpty())
					continue;

				String key = line.split("=")[0];
				Object value;
				if (line.split("=").length > 1) {
					value = line.split("=")[1];
				} else {
					value = "";
				}

				if (key.equalsIgnoreCase("HOSTADDRESS")) {
					String hostAddress;
					try {
						hostAddress = value.toString();
					} catch (Exception e) {
						e.printStackTrace();
						hostAddress = "";
					}

					this.fullAppiumEndpoint = new URL(hostAddress);

				} else {
					// this should be a capability
					key = key.replace("CAPABILITY_", "");
					if (key.equals("deviceName") || key.equals("pCloudy_DeviceFullName")) {
						key = "pCloudy_DeviceFullName";
						this.capabilities.setCapability(key, value);

					} else if (key.equals("browserName")) {
						value = String.valueOf(value);
						if (value.equals("safari")) {
							this.isSafari = true;
							value = "Safari";
							this.capabilities.setCapability(key, value);
						}

					}

					// Log.print("Adding capability for pCloudy: " + key + " -> " + value);

					if (key.equals("browserName") && !AppiumContext.isBrowserMode()) {
						// Skip this if browserName caps is coming and the execution is not browser.
					} else if (key.equals("pc_pCloudyUserName")) {
						key = "pCloudy_Username";
						this.capabilities.setCapability(key, value);

					} else if (key.equals("pc_pCloudyApiToken")) {
						key = "pCloudy_ApiKey";
						this.capabilities.setCapability(key, value);

					}

					else if (key.equals("pc_pDriveFile")) {
						key = "pCloudy_ApplicationName";
						if (this.isIOS) {
							String appName = value + "==.ipa";
							this.capabilities.setCapability(key, appName);
							// this.capabilities.setCapability("appium:app", appName);

						} else {
							String apkName = value + "==.apk";
							this.capabilities.setCapability(key, apkName);
							// this.capabilities.setCapability("appium:app", apkName);
						}

					}

					else {

					}
				}
			}
		} else { // Mac Case
			for (String line : pCloudy_AppiumCapabilities_FileContents.split("\n")) {
				if (line.isEmpty())
					continue;

				String key = line.split("=")[0];
				Object value;
				if (line.split("=").length > 1) {
					value = line.split("=")[1];
				} else {
					value = "";
				}

				if (key.equalsIgnoreCase("HOSTADDRESS")) {
					String hostAddress;
					try {
						hostAddress = value.toString();
					} catch (Exception e) {
						e.printStackTrace();
						hostAddress = "";
					}

					this.fullAppiumEndpoint = new URL(hostAddress);

				} else {
					// this should be a capability
					key = key.replace("CAPABILITY_", "");
					if (key.equals("deviceName") || key.equals("pC_deviceFullName")) {
						key = "pCloudy_DeviceFullName";
						this.capabilities.setCapability(key, value);

					} else if (key.equals("browserName")) {
						value = String.valueOf(value);
						if (value.equals("safari")) {
							this.isSafari = true;
							value = "Safari";
							this.capabilities.setCapability(key, value);
						}

					}

					// Log.print("Adding capability for pCloudy: " + key + " -> " + value);

					if (key.equals("browserName") && !AppiumContext.isBrowserMode()) {
						// Skip this if browserName caps is coming and the execution is not browser.
					} else if (key.equals("pc_pCloudyUserName")) {
						key = "pCloudy_Username";
						this.capabilities.setCapability(key, value);

					} else if (key.equals("pc_pCloudyApiToken")) {
						key = "pCloudy_ApiKey";
						this.capabilities.setCapability(key, value);

					}

					else if (key.equals("pc_pDriveFile")) {
						key = "pCloudy_ApplicationName";
						if (this.isIOS) {
							String appName = value + "==.ipa";
							this.capabilities.setCapability(key, appName);
							// this.capabilities.setCapability("appium:app", appName);

						} else {
							String apkName = value + "==.apk";
							this.capabilities.setCapability(key, apkName);
							// this.capabilities.setCapability("appium:app", apkName);
						}

					}

					else {

					}
				}
			}

		}
	}

	public DesiredCapabilities getCapabilities() throws IOException {
		if ((AppiumContext.isBrowserMode() || AppiumContext.getBrowserMode() == BrowserType.chromeOnLocalAndroid
				|| AppiumContext.getBrowserMode() == BrowserType.ChromeOnCloud)
				&& AppiumContext.getDeviceType() == DeviceType.Android) {
			this.capabilities.setCapability("browserName", "Chrome");
			// if we not give chrome in here then there will be a error on appium server it
			// will show small "chrome" in caps
			// while we need Chrome name first letter in capital letter
		}
		return this.capabilities;
	}

	public URL getAppiumEndpoint() {
		return this.fullAppiumEndpoint;
	}

	public boolean isSafari() {
		return this.isSafari;
	}

	public void setGenericCaps() {

//	this.capabilities.setCapability("usePrebuiltWDA", true);
//	this.capabilities.setCapability("clearSystemFiles", true);
//	this.capabilities.setCapability("webkitResponseTimeout", 150000);
//	
		this.capabilities.setCapability("appium:noReset", false);
		this.capabilities.setCapability("appium:newCommandTimeout", 3000);
		this.capabilities.setCapability("appium:unicodeKeyboard", true);
		this.capabilities.setCapability("appium:resetKeyboard", true);
		// this.capabilities.setCapability(GeneralServerFlag.SESSION_OVERRIDE.getArgument(),
		// true);
	}

	private void setAndroidCaps() {
		this.setAppiumVersion();
		this.capabilities.setCapability("appium:platformVersion",
				this.olderCapabilities.getCapability("appium:platformVersion").toString());
		this.capabilities.setCapability("platformName", "Android");
		this.capabilities.setCapability("pCloudy_DurationInMinutes", 720);
		this.setDevicePasscode();
		this.setUiAutomator();
		this.capabilities.setCapability("appim:adbExecTimeout", 90000);

		if (AppiumContext.isBrowserMode()) {
			this.capabilities.setCapability("appium:chromeOptions", ImmutableMap.of("w3c", false));
			ChromeOptions options = new ChromeOptions();
			options.addArguments("--disable-blink-features=AutomationControlled");
			this.capabilities.setCapability(ChromeOptions.CAPABILITY, options);
		} else {
			this.capabilities.setCapability("appium:appPackage",
					this.olderCapabilities.getCapability("appium:appPackage"));
			this.capabilities.setCapability("appium:appActivity",
					this.olderCapabilities.getCapability("appium:appActivity"));

		}

	}

	private void setUiAutomator() {
		System.out.println("AndroidVersion: " + AppiumContext.getMobileDevice().getVersion());
		AndroidVersion version = new AndroidVersion(this.deviceVersion);
		if (version.getMajor() >= 6) {
			System.out.println("Setting UI Automator 2");
			this.capabilities.setCapability("appium:automationName", "uiautomator2");
			this.capabilities.setCapability("appium:uiautomator2ServerLaunchTimeout", 60000);
		}
	}

	private void setiOSCaps() {
		this.setAppiumVersion();
		this.capabilities.setCapability("appium:platformName", "ios");
		this.capabilities.setCapability("platformName", "ios");
		this.capabilities.setCapability("appium:automationName", "XCUITest");
		this.capabilities.setCapability("appium:platformVersion", this.deviceVersion);
		this.capabilities.setCapability("pCloudy_DurationInMinutes", 720); // for 3 hours
		if (!this.isSafari()) {
			String bundle = this.mobileApplication.getPackage();
			// String bundle =
			// this.olderCapabilities.getCapability("appium:bundleId").toString();
			this.capabilities.setCapability("appium:bundleId", bundle);
			this.capabilities.setCapability("appium:includeSafariInWebviews", true);

			// includeSafariInWebviews waits without any reason when run getContext on
			// native page.
			int webviewConnectTimeout = 78;
			if (Context.current().getKeywordRemaningSeconds() < 90) {
				webviewConnectTimeout = Context.current().getKeywordRemaningSeconds() - 6;
			}
			this.capabilities.setCapability("appium:webviewConnectTimeout", webviewConnectTimeout * 1000);
		}
	}

	private void setDevicePasscode() {
		String device_Passcode = Context.session().getSettings().get("DEVICE_PASSCODE");
		System.out.println("#<< device passcode " + device_Passcode);
		if (device_Passcode != null) {
			if (!(device_Passcode).isEmpty()) {
				this.capabilities.setCapability("pCloudy_DevicePasscode", device_Passcode);
			}
		}
	}

	private void setAppiumVersion() {

		String appium_Version = Context.session().getSettings().get("APPIUM_VERSION");
		System.out.println("#<< appium version " + appium_Version);
		if (appium_Version != null) {
			if (!(appium_Version).isEmpty()) {
				this.capabilities.setCapability("appium:appiumVersion", appium_Version);
			}
		}
	}

	public String getAccurateAndroidVerion(String version) {
		if (version.startsWith("0")) {
			version = version.substring(1, version.length());
		}
		if (version.contains(".")) {
			version = version.substring(0, version.indexOf(".")).trim();
			System.out.println("version " + version);

		}

		return version;
	}
}
