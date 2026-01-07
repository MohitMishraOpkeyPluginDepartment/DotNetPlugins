open cmd in buildstatic files in plugin 
provide the path of maven in the cmd  or we can drag and drop maven.bat file 
Now install these jar files using these command 

mvn install:install-file -Dfile=path to pCloudy-java-connector-11.0.7-jar-with-dependencies.jar -DgroupId=pCloudy-java-connector -DartifactId=pCloudy-java-connector -Dversion=11.0.3 -Dpackaging=jar

C:\AppiumCheckOut\BuildStaticFiles>C:\apache-maven-3.1.0-bin\apache-maven-3.1.0\bin\mvn.bat install:install-file -Dfile=opkeyaiclient-0.0.1-SNAPSHOT.jar -DgroupId=com.opkey -DartifactId=opkeyaiclient -Dversion=0.0.1-SNAPSHOT -Dpackaging=jar

C:\AppiumCheckOut\BuildStaticFiles>C:\apache-maven-3.1.0-bin\apache-maven-3.1.0\bin\mvn.bat install:install-file -Dfile=opkey-pluginbase-v2.0-jar-with-dependencies.jar -DgroupId=opkey -DartifactId=opkey-pluginbase -Dversion=v2.0 -Dpackaging=jar

please verify version groupid artifactId and name of jar file before installing the jars 


Example :: suppose path of buildstatic file is C\:AppiumCheckOut\BuildStaticFiles
Then Open cmd and paste the path on cmd .
Now path of maven is C\Apache\maven\bin\maven.bat

Then Proper command bill we :: C\:AppiumCheckOut\BuildStaticFiles C\Apache\maven\bin\maven.bat install:install-file -Dfile=pCloudy-java-connector-11.0.3-jar-with-dependencies.jar -DgroupId=pCloudy-java-connector -DartifactId=pCloudy-java-connector -Dversion=11.0.3 -Dpackaging=jar


after installation please remove scope and systempath tags in dependency tag in pom file of the above installed dependencies



or after setting mavaen path in environment varibale 

then command will be like
mvn install:install-file -Dfile=path to pCloudy-java-connector-11.0.7-jar-with-dependencies.jar -DgroupId=pCloudy-java-connector -DartifactId=pCloudy-java-connector -Dversion=11.0.7 -Dpackaging=jar





================Command to install the Certificate in the Java trust store:====================================================

"C:\Program Files\Java\jdk-17\bin\keytool.exe" -import -file "Path of the Opkey Cert" -keystore "C:\Program Files\Java\jdk-17\lib\security\cacerts" -alias "OpkeyPfizerCertificate"
 
Password - changeit



======================Mobile Center Coded Function Librarry==============================================
          // take given parameter from user
          MobileDevice mobileDevice = new MobileDevice();
          mobileDevice.setDisplayName("Android");
          DesiredCapabilities capabilities = new DesiredCapabilities();
          capabilities.setCapability("newCommandTimeout",360);
          capabilities.setCapability("appPackage", "edu.northwell.dpxapp");
          capabilities.setCapability("appActivity", "edu.northwell.dpxapp.MainActivity");
          capabilities.setCapability("platformName", "Android");
          capabilities.setCapability("userName", MC_Username );
          capabilities.setCapability("password", MC_Password );
          capabilities.setCapability("UDID", MC_Device_UDID);
          capabilities.setCapability("deviceName", MC_deviceName);
          capabilities.setCapability("automationName", "UIAutomator2");
          AndroidDriver wd = new AndroidDriver(new URL(MC_URL +"/wd/hub"), capabilities);
          System.out.println("Bitbar session was successfully created [Android Device]");
          Thread.sleep(10000);
          Context.session().setTool(wd);
          //AppiumContext.setBrowserMode(BrowserType.chromeOnLocalAndroid);
          AppiumContext.setDeviceType(DeviceType.Android);
          AppiumContext.setMobileDevice(mobileDevice);
          Connect2AppiumServer.allOpenWebDrivers.add(wd);


======================Browser Stack Coded Function Librarry==============================================

 MobileDevice mobileDevice = new MobileDevice();
          mobileDevice.setDisplayName("Android");
          DesiredCapabilities capabilities = new DesiredCapabilities();
          capabilities.setCapability("newCommandTimeout",360);
          capabilities.setCapability("app", appUrl);
          capabilities.setCapability("appPackage", apppackage);
          capabilities.setCapability("appActivity", appActivity);
          capabilities.setCapability("platformName", "Android");     
          capabilities.setCapability("platformVersion", version );  //string
          capabilities.setCapability("browserstack.user", MC_Username );
          capabilities.setCapability("browserstack.key", MC_Key );
          capabilities.setCapability("UDID", MC_Device_UDID);
          capabilities.setCapability("deviceName", MC_deviceName);
          capabilities.setCapability("automationName", "UIAutomator2");
          AndroidDriver wd = new AndroidDriver(new URL(MC_URL +"/wd/hub"), capabilities);
          System.out.println("Bitbar session was successfully created [Android Device]");
          Thread.sleep(10000);
          Context.session().setTool(wd);
          //AppiumContext.setBrowserMode(BrowserType.chromeOnLocalAndroid);
          AppiumContext.setDeviceType(DeviceType.Android);
          AppiumContext.setMobileDevice(mobileDevice);
          Connect2AppiumServer.allOpenWebDrivers.add(wd);

=====================================download sauce tunnel proxy 5.1.3 first =======================
Provide below arguments 
sc.exe run -u oauth-opuser0000-a78bb -k d76ea097-e06f-46e5-aa09-17b27eb1aef2 -r eu-central-1 -i sriti

-u username
-k access key
-r region 
-i tunell name 

===========================capability given in suacelab capability in buildstatic file  pdf===========================================

 if (platformName.equalsIgnoreCase("Android")) {
      MobileDevice mobileDevice = new MobileDevice();
      mobileDevice.setDisplayName("Android");
      MutableCapabilities caps = new MutableCapabilities();
      caps.setCapability("platformName", platformName);
      caps.setCapability("appium:app", "storage:filename=" + applicationName);
      caps.setCapability("appium:deviceName", deviceName);
      caps.setCapability("appium:platformVersion", platformVersion);
      caps.setCapability("appium:automationName", "UiAutomator2");
      MutableCapabilities sauceOptions = new MutableCapabilities();
      sauceOptions.setCapability("build", build);
      sauceOptions.setCapability("name", name);
      sauceOptions.setCapability("deviceOrientation", "PORTRAIT");
      caps.setCapability("sauce:options", sauceOptions);
      AndroidDriver wd = null;
      Thread.sleep(5000L);
      try {
        wd = new AndroidDriver(new URL(URL), (Capabilities)caps);
      } catch (Exception e) {
        return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false).setMessage(e.getMessage())
          .make();
      } 
      if (wd != null) {
        System.out.println("driver created ");
        Thread.sleep(5000L);
        Context.session().setTool(wd);
        AppiumContext.setDeviceType(DeviceType.Android);
        AppiumContext.setMobileDevice(mobileDevice);
        Connect2AppiumServer.allOpenWebDrivers.add(wd);
        return Result.PASS().setOutput(true).setMessage(ReturnMessages.ALREADY_CHECKED.toString()).make();
      } 
else {
      MobileDevice mobileDevice = new MobileDevice();
      mobileDevice.setDisplayName("iOS");
      MutableCapabilities caps = new MutableCapabilities();
      caps.setCapability("platformName", platformName);
      caps.setCapability("appium:app", "storage:filename=" + applicationName);
      caps.setCapability("appium:deviceName", deviceName);
      caps.setCapability("appium:platformVersion", platformVersion);
      caps.setCapability("appium:automationName", "XCUITest");
      MutableCapabilities sauceOptions = new MutableCapabilities();
      sauceOptions.setCapability("build", build);
      sauceOptions.setCapability("name", name);
      sauceOptions.setCapability("deviceOrientation", "PORTRAIT");
      caps.setCapability("sauce:options", sauceOptions);
      IOSDriver wd = null;
      Thread.sleep(5000L);
      try {
        wd = new IOSDriver(new URL(URL), (Capabilities)caps);
      } catch (Exception e) {
        return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false)
          .setMessage("Connection Failure").make();
      } 
      if (wd != null) {
        System.out.println("driver created ");
        Thread.sleep(5000L);
        Context.session().setTool(wd);
        AppiumContext.setDeviceType(DeviceType.Android);
        AppiumContext.setMobileDevice(mobileDevice);
        Connect2AppiumServer.allOpenWebDrivers.add(wd);
      } 
    } 
    return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false).setMessage("Connection Failure")
      .make();
  }