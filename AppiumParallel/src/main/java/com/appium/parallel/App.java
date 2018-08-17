package com.appium.parallel;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.Test;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import io.appium.java_client.service.local.AppiumServiceBuilder;

/**
 * Hello world!
 *
 */
public class App 
{
	AppiumDriver<WebElement> driver;
//	LoginPage login ;
//	HelperFunctionalities helper;
	AppiumDriverLocalService appiumService ;
	String service_url ;
	String Appium_Node_Path ;
	String Appium_JS_Path;
	String DeviceId;
	String DeviceName;
	String platformVersion;
	String testStatus ;
	String apk_name;
	String device_os;
	String Package;
	String appPath;
	Date create;
	
	@BeforeSuite
	public void beforeSuite() throws Exception
	{
		Appium_Node_Path = "/usr/local/bin/node";
		Appium_JS_Path = "/usr/local/lib/node_modules/appium/build/lib/main.js";
		appiumService = AppiumDriverLocalService.buildService(new AppiumServiceBuilder().withIPAddress("127.0.0.1").usingPort(0).usingDriverExecutable(new File(Appium_Node_Path)).withAppiumJS(new File(Appium_JS_Path)));
		appiumService.start();
		service_url = appiumService.getUrl().toString();
		Thread.sleep(1000);
		System.out.println("Suite started");
	}
	
	
//	@Parameters({"cycle_id","device_id","os_version","device_name","app_path","app_family"})
//	@BeforeMethod
//	public void beforeTest(String cycle_id, String device_id, String os_version, String device_name,String app_path,String app_family) throws Exception
//	{
//		Cycle_Id = cycle_id;
//		DeviceId = device_id;
//		platformVersion=os_version;
//		DeviceName = device_name;
//		device_os = "iOS";
//		appPath = app_path;
//		Package = app_family;
//		     
//		DesiredCapabilities capabilities = new DesiredCapabilities();
//		capabilities.setCapability("udid",DeviceId );
//		capabilities.setCapability("deviceName",DeviceName );
//		capabilities.setCapability("platformVersion", platformVersion);
//		capabilities.setCapability("platformName", "Android");
//		capabilities.setCapability("newCommandTimeout","7200");
//		capabilities.setCapability("autoAcceptAlerts", true);
//		capabilities.setCapability("autoDismissAlerts", true);
//		capabilities.setCapability("autoGrantPermissions", true);
//		capabilities.setCapability("app", appPath);
//		capabilities.setCapability("noReset", true);
//		
//		create = new Date();
////		capabilities.setCapability(MobileCapabilityType.FULL_RESET, "True");
//		driver = new AndroidDriver<WebElement>(new URL(service_url), capabilities);
//		driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
//		
//		helper= new HelperFunctionalities(driver);
////		helper.dissmissPopUp();
//		exec = new ExecExecutor(driver);
//		Thread.sleep(1000);
//	}
	
	
	@BeforeMethod
	public void beforeTest() throws Exception
	{
		
		DeviceId = "";
		platformVersion="";
		DeviceName = "";
		device_os = "android";
		appPath = "";
		Package = "";
		     
		DesiredCapabilities capabilities = new DesiredCapabilities();
		capabilities.setCapability("udid",DeviceId );
		capabilities.setCapability("deviceName",DeviceName );
		capabilities.setCapability("platformVersion", platformVersion);
		capabilities.setCapability("platformName", "Android");
		capabilities.setCapability("newCommandTimeout","7200");
		capabilities.setCapability("autoAcceptAlerts", true);
		capabilities.setCapability("autoDismissAlerts", true);
		capabilities.setCapability("autoGrantPermissions", true);
		capabilities.setCapability("app", appPath);
		capabilities.setCapability("noReset", true);
		
		create = new Date();
		
		switch(device_os)
		{
			case "android":
				driver = new AndroidDriver<WebElement>(new URL(service_url), capabilities);
				break;
				
			case "ios":
				driver = new IOSDriver<WebElement>(new URL(service_url), capabilities);
				break;
				
			default:
				driver = new AndroidDriver<WebElement>(new URL(service_url), capabilities);
		}
		
//		driver = new AndroidDriver<WebElement>(new URL(service_url), capabilities);
		driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
		
		Thread.sleep(1000);
		
	}
	
	
	
	@AfterMethod
	public void afterTest(ITestResult result) throws IOException, ParseException
	{
		System.out.println("After method");
	}
    
	@Test
	public void checkoutTest()
	{
		switch(device_os)
		{
			case "android":
				break;
				
			case "ios":
				
				
				
				break;
		}
	}
	
	@AfterSuite
	public void afterSuite()
	{
		appiumService.stop();
		System.out.println("\n Suite Completed");
	}
	
}
