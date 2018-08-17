package selenium.com.selenium.test;

import com.github.webdriverextensions.WebComponent;

public class EWebelement extends WebComponent
{
	
	public void click()
	{
		try {
			Thread.sleep(1000);
			System.out.println("Sleeping for 1 sec");
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		super.click();
	}
}
