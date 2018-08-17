package com.r.india.testUnits;

import java.io.File;
import java.net.URL;
import java.util.concurrent.TimeUnit;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.Optional;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.MobileDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import io.appium.java_client.service.local.AppiumServiceBuilder;

public class Runners 
{
	String DeviceId;
	String platformVersion;
	String DeviceName;
	String deviceOs;
	String appPath;
	String Appium_Node_Path;
	String Appium_JS_Path;
	AppiumDriverLocalService appiumService;
	String service_url;
	ReadPropFile prop = new ReadPropFile();
	WebScript ws ;
	MobileScript ms ;
	WebDriver driver ;
	
	@BeforeSuite
	public void beforeSuite() throws InterruptedException
	{
		Appium_Node_Path = "/usr/local/bin/node";
		Appium_JS_Path = "/usr/local/lib/node_modules/appium/build/lib/main.js";
		appiumService = AppiumDriverLocalService.buildService(
						new AppiumServiceBuilder().withIPAddress("127.0.0.1").usingPort(0).usingDriverExecutable(
						new File(Appium_Node_Path)).withAppiumJS(new File(Appium_JS_Path)));
		appiumService.start();
		service_url = appiumService.getUrl().toString();
		prop.loadProperties();
		Thread.sleep(1000);
	}
	
	@Parameters({"device_id","os_version","device_name","device_os"})
	@BeforeMethod
	public void beforeMethod(@Optional() String device_id, @Optional() String os_version,@Optional() String device_name,@Optional() String device_os) throws Exception
	{
		DeviceId = device_id;
		platformVersion=os_version;
		DeviceName = device_name;
		deviceOs = device_os;
		
		System.out.println(device_id);
		System.out.println(os_version);
		System.out.println(device_name);
		System.out.println(device_os);
		
		if(DeviceId != null && DeviceId != "")
		{
			DesiredCapabilities capabilities = new DesiredCapabilities();
			MobileDriver<WebElement> adriver;
			switch(deviceOs)
			{
				case "android":
					capabilities.setCapability("udid",DeviceId );
					capabilities.setCapability("deviceName",DeviceName );
					capabilities.setCapability("platformVersion", platformVersion);
					capabilities.setCapability("platformName", deviceOs);
					capabilities.setCapability("browserName","Chrome");
					capabilities.setCapability("newCommandTimeout","7200");
					capabilities.setCapability("autoAcceptAlerts", true);
					capabilities.setCapability("autoDismissAlerts", true);
					capabilities.setCapability("autoGrantPermissions", true);
					capabilities.setCapability("noReset", true);
					
					adriver = new AndroidDriver<WebElement>(new URL(service_url), capabilities);
					adriver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
					adriver.get(System.getProperty("url"));
					ms = new MobileScript(adriver);
					driver = adriver;
					
					break;
					
				case "ios":
					capabilities.setCapability("udid",DeviceId );
					capabilities.setCapability("deviceName",DeviceName );
					capabilities.setCapability("platformVersion", platformVersion);
					capabilities.setCapability("platformName", deviceOs);
					capabilities.setCapability("browserName","Safari");
					capabilities.setCapability("newCommandTimeout","7200");
					capabilities.setCapability("autoAcceptAlerts", true);
					capabilities.setCapability("autoDismissAlerts", true);
					capabilities.setCapability("autoGrantPermissions", true);
					capabilities.setCapability("noReset", true);
//					capabilities.setCapability("xcodeOrgId", System.getProperty("appleId"));
//					capabilities.setCapability("xcodeSigningId", "iPhone Developer");
					capabilities.setCapability("automationName", "XCUITest");
					capabilities.setCapability("clearSystemFiles", true);
					
					adriver = new IOSDriver<WebElement>(new URL(service_url), capabilities);
					adriver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
					adriver.get(System.getProperty("url"));
					ms = new MobileScript(adriver);
					
					driver = adriver;
					
					break;	
			}
			
		}else
		{
			appiumService.stop();
			driver = new ChromeDriver();
			driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
			driver.get(System.getProperty("url"));
			ws =  new WebScript(driver);
		}
	}
	
	
//	@BeforeMethod
//	public void beforeMethod() throws Exception
//	{
////		DeviceId = "";
//		
////		DeviceId = "RQ3003HEAV";
////		platformVersion="7.0";
////		DeviceName = "sony";
////		deviceOs = "android";
//		
//		DeviceId = "1d61b13936ad3a620d7cd049eed1ae966ad9b5cc";
//		platformVersion="11.4.1";
//		DeviceName = "iphone-6 plus";
//		deviceOs = "ios";
//		
//		System.out.println(DeviceId);
//		System.out.println(platformVersion);
//		System.out.println(DeviceName);
//		System.out.println(deviceOs);
//		
//		if(DeviceId != null && DeviceId != "")
//		{
//			DesiredCapabilities capabilities = new DesiredCapabilities();
//			MobileDriver<WebElement> adriver;
//			switch(deviceOs)
//			{
//				case "android":
//					capabilities.setCapability("udid",DeviceId );
//					capabilities.setCapability("deviceName",DeviceName );
//					capabilities.setCapability("platformVersion", platformVersion);
//					capabilities.setCapability("platformName", deviceOs);
//					capabilities.setCapability("browserName","Chrome");
//					capabilities.setCapability("newCommandTimeout","7200");
//					capabilities.setCapability("autoAcceptAlerts", true);
//					capabilities.setCapability("autoDismissAlerts", true);
//					capabilities.setCapability("autoGrantPermissions", true);
//					capabilities.setCapability("noReset", true);
//					
//					adriver = new AndroidDriver<WebElement>(new URL(service_url), capabilities);
//					adriver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
//					adriver.get(System.getProperty("url"));
//					ms = new MobileScript(adriver);
//					driver = adriver;
//					
//					break;
//					
//				case "ios":
//					capabilities.setCapability("udid",DeviceId );
//					capabilities.setCapability("deviceName",DeviceName );
//					capabilities.setCapability("platformVersion", platformVersion);
//					capabilities.setCapability("platformName", deviceOs);
//					capabilities.setCapability("browserName","Safari");
//					capabilities.setCapability("newCommandTimeout","7200");
//					capabilities.setCapability("autoAcceptAlerts", true);
//					capabilities.setCapability("autoDismissAlerts", true);
//					capabilities.setCapability("autoGrantPermissions", true);
//					capabilities.setCapability("noReset", true);
////					capabilities.setCapability("xcodeOrgId", System.getProperty("appleId"));
////					capabilities.setCapability("xcodeSigningId", "iPhone Developer");
//					capabilities.setCapability("automationName", "XCUITest");
//					capabilities.setCapability("clearSystemFiles", true);
//					
//					adriver = new IOSDriver<WebElement>(new URL(service_url), capabilities);
//					adriver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
//					adriver.get(System.getProperty("url"));
//					ms = new MobileScript(adriver);
//					
//					driver = adriver;
//					
//					break;	
//			}
//			
//		}else
//		{
//			appiumService.stop();
//			driver = new ChromeDriver();
//			driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
//			driver.get(System.getProperty("url"));
//			ws =  new WebScript(driver);
//		}
//		
//	  
//	  
//	}
	
//	@BeforeMethod
//	public void beforeMethod() throws InterruptedException
//	{
//		try
//		{
//			driver = new ChromeDriver();
//			driver.get(System.getProperty("url"));
//			gs =  new GenericScript(driver);
//			Thread.sleep(1000);
//		}catch(Exception e)
//		{
//			System.out.println(e);
//		}
//		
//		
//	}
	
	
	@AfterMethod
	public void afterMethod()
	{
		driver.close();
	}
	
	@AfterSuite
	public void afterSuite()
	{
		appiumService.stop();
		driver.quit();
	}
	
	@Test
	public void test1() throws InterruptedException
	{
			if(DeviceId != null && DeviceId != "")
			{
				ms.randomClicks();
			}else{
				ws.randomClicks();
			}
		}
		
	}
	

