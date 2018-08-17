package selenium.com.selenium.test;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.github.webdriverextensions.WebDriverExtensionFieldDecorator;

public class PageObject extends EWebelement{
	
	WebDriver driver ;
	PageObject(WebDriver driver)
	{
		this.driver=driver;
		PageFactory.initElements(new WebDriverExtensionFieldDecorator(driver), this);
	}
	
	@FindBy(xpath = "//button[@class='_2AkmmA _29YdH8']")
	private EWebelement crossBtn;
	
	public void clickMethod()
	{
		crossBtn.click();
		System.out.println("Clicked successfully");
	}
	
	public boolean isAlertPresent()
	{
		boolean flag = false;
		
		WebDriverWait wait = new WebDriverWait(driver, 10);
		try{
			if(wait.until(ExpectedConditions.alertIsPresent())!=null)
			{
				flag =true;
			}
			
		}catch(Exception e)
		{
			e.printStackTrace();
		}
		return flag;
	}
	
	public void clickAllAlerts()
	{
		boolean check = false; 
		if(isAlertPresent())
		{
			check = true;
			while(check=true)
			{
				driver.switchTo().alert().accept();
				if(!isAlertPresent())
				{
					check= false;
				}
			}
		}
	}
	
	

}
