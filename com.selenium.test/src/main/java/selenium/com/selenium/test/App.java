package selenium.com.selenium.test;

import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;

import com.google.common.base.Verify;

/**
 * Hello world!
 *
 */
public class App 
{
	static WebDriver driver  = new ChromeDriver();
	
	public static void jsClick(WebElement element) {
		JavascriptExecutor js = (JavascriptExecutor) driver;  
		 js.executeScript("return arguments[0].click();", element);
		}
	
    public static void main( String[] args )
    {
    	
    	driver.get("https://www.facebook.com");
    	driver.manage().timeouts().implicitlyWait(10,TimeUnit.SECONDS);
    	Set<String> set = driver.getWindowHandles();
    	for(String handle : set)
    	{
    		driver.switchTo().window(handle);
    		System.out.println("Current URl is --"+driver.getCurrentUrl());
    		System.out.println("Title is --"+driver.getTitle());
    		
    	}
    	
//    	WebElement fb  = driver.findElement(By.id("emai"));
//    	WebElement amazon  = driver.findElement(By.id("twotabsearchtextbox"));
//    	WebElement flipkart  = driver.findElement(By.xpath("//input[@name='q']"));
    	
//    	WebElement hidden =driver.findElement(By.xpath("//a[contains(text(),'This is a test link')]"));
    	
//    	jsClick(hidden);
    	
//    	Actions action = new Actions(driver);
//    	action.moveToElement(hidden).perform();
//    	hidden.click();
    	
    	
//    	PageObject po = new PageObject(driver);
//    	po.clickMethod();
//    	Set<String> window = driver.getWindowHandles();
//    	try
//    	{
//    		Actions action = new Actions(driver);
//        	action.moveToElement(driver.findElement(By.xpath("//input[@type='text']")));
//        	action.click();
//        	action.sendKeys("Milk");
//        	action.build().perform();
//    	}catch(Exception e)
//    	{
//    		System.out.println("Action not working without perform"+e);
//    	}
    	
    	
    	
//    	String s = "MALAYALAM ASA";
//    	char[] ch = s.toCharArray();
//    	
//    	for( int i=0; i<ch.length; i++)
//    	{
//    		int count = 0;
//    		for(int j=0; j<ch.length; j++)
//    		{
//    			if(ch[i]==ch[j] )
//    			{
//    				count++;
//    			}
//    		}
//    		if(count==1)
//    		{
//    			System.out.println(ch[i]+" ");
//    		}
//    	}
    	
    	
    }
}
