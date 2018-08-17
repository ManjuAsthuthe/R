package com.r.india.testUnits;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.MobileDriver;
import io.appium.java_client.TouchAction;
import io.appium.java_client.android.AndroidDriver;

public class MobileScript {
	MobileDriver<WebElement> driver;
	
	MobileScript(MobileDriver<WebElement> adriver)
	{
			this.driver= adriver;
	}
	
	ReadPropFile prop = new ReadPropFile();
	SetterAndGetter setGet = new SetterAndGetter();
	
	public void randomClicks() throws InterruptedException
	{
		List<String> tagNames  = new ArrayList<String>();
		tagNames.add("input");
		tagNames.add("button");
		tagNames.add("a");
		tagNames.add("div");
		tagNames.add("ul");
		tagNames.add("span");
		
		
		for(String tagName : tagNames)
		{
//			for(int k=0; k<3; k++)
//			{
				List<WebElement> list = driver.findElements(By.tagName(tagName));
				int fCount  = Integer.parseInt(System.getProperty("fCount"));
				int iCount  = Integer.parseInt(System.getProperty("iCount"));
				if(!list.isEmpty())
				{
					for(int i=iCount; i<fCount; i++)
					{
						switch(tagName)
						{
							case "input":
							{
								try
								{
									setGet.setTitle(driver.getTitle());
//									String con = driver.getContext();
//									driver.context(con);
									String hid = list.get(i).getAttribute("type");
									if(list.get(i).isDisplayed() && hid!="hidden")
									{
										list.get(i).sendKeys(System.getProperty("text"));
										list.get(i).sendKeys(Keys.ENTER);
										Thread.sleep(2000);
										
										checkTitle(setGet.getTitle());
										
										break;
									}else{
										break;
									}
									
								}catch(Exception e)
								{
									break;
//									System.out.println("Unable to click on webElement---"+list.get(i));
								}
								
							}
							
							case "button":
							{
								try
								{
									setGet.setTitle(driver.getTitle());
//									String con = driver.getContext();
//									driver.context(con);
									String hid = list.get(i).getAttribute("type");
									if(list.get(i).isDisplayed() && hid!="hidden")
									{
										list.get(i).click();
										Thread.sleep(2000);
										
										checkTitle(setGet.getTitle());
										
										break;
									}else{
										break;
									}
									
								}catch(Exception e)
								{
//									System.out.println("Unable to click on webElement---"+list.get(i));
									break;
									
								}
								
							}
							
							case "a":
							{
								try
								{
									setGet.setTitle(driver.getTitle());
//									String con = driver.getContext();
//									driver.context(con);
									String hid = list.get(i).getAttribute("type");
									if(list.get(i).isDisplayed() && hid!="hidden")
									{
										list.get(i).click();
										Thread.sleep(2000);
										
										checkTitle(setGet.getTitle());
										
										Set<String> tabs = driver.getWindowHandles();
										if(tabs.size()>1)
										{
											int counter =0;
											for(String tab : tabs)
											{
												if(counter==0)
												{
													setGet.setTab(tab);
													counter++;
													continue;
												}
												
												driver.switchTo().window(tab);
												randomClicks();
												driver.switchTo().window(setGet.getTab());
											}
										}else{
											
										}
										break;
									}else{
										break;
									}
									
								}catch(Exception e)
								{
									break;
//									System.out.println("Unable to click on webElement---"+list.get(i));
								}
								
							}
							
							case "img":
							{
								try
								{
									setGet.setTitle(driver.getTitle());
//									String con = driver.getContext();
//									driver.context(con);
									String hid = list.get(i).getAttribute("type");
									if(list.get(i).isDisplayed() && hid!="hidden")
									{
										list.get(i).click();
										Thread.sleep(2000);
										
										checkTitle(setGet.getTitle());
										
										Set<String> tabs = driver.getWindowHandles();
										if(tabs.size()>1)
										{
											int counter =0;
											for(String tab : tabs)
											{
												if(counter==0)
												{
													setGet.setTab(tab);
													counter++;
													continue;
												}
												
												driver.switchTo().window(tab);
												randomClicks();
												driver.switchTo().window(setGet.getTab());
											}
										}
										break;
									}else{
										break;
									}
									
								}catch(Exception e)
								{
									break;
//									System.out.println("Unable to click on webElement---"+list.get(i));
								}
								
							}
							
							case "div":
							{
								try
								{
									setGet.setTitle(driver.getTitle());
//									String con = driver.getContext();
//									driver.context(con);
									String hid = list.get(i).getAttribute("type");
									if(list.get(i).isDisplayed() && hid!="hidden")
									{
										list.get(i).click();
										Thread.sleep(2000);
										
										checkTitle(setGet.getTitle());
										
										Set<String> tabs = driver.getWindowHandles();
										if(tabs.size()>1)
										{
											int counter =0;
											for(String tab : tabs)
											{
												if(counter==0)
												{
													setGet.setTab(tab);
													counter++;
													continue;
												}
												
												driver.switchTo().window(tab);
												randomClicks();
												driver.switchTo().window(setGet.getTab());
											}
										}else{
											
										}
										break;
									}else{
										break;
									}
									
								}catch(Exception e)
								{
									break;
//									System.out.println("Unable to click on webElement---"+list.get(i));
								}
								
							}
							
							case "ul":
							{
								try
								{
									setGet.setTitle(driver.getTitle());
//									String con = driver.getContext();
//									driver.context(con);
									String hid = list.get(i).getAttribute("type");
									if(list.get(i).isDisplayed() && hid!="hidden")
									{
										list.get(i).click();
										Thread.sleep(2000);
										
										checkTitle(setGet.getTitle());
										
										Set<String> tabs = driver.getWindowHandles();
										if(tabs.size()>1)
										{
											int counter =0;
											for(String tab : tabs)
											{
												if(counter==0)
												{
													setGet.setTab(tab);
													counter++;
													continue;
												}
												
												driver.switchTo().window(tab);
												randomClicks();
												driver.switchTo().window(setGet.getTab());
											}
										}else{
											
										}
										break;
									}else{
										break;
									}
									
								}catch(Exception e)
								{
									break;
//									System.out.println("Unable to click on webElement---"+list.get(i));
								}
								
							}
							
							case "span":
							{
								try
								{
									setGet.setTitle(driver.getTitle());
//									String con = driver.getContext();
//									driver.context(con);
									String hid = list.get(i).getAttribute("type");
									if(list.get(i).isDisplayed() && hid!="hidden")
									{
										list.get(i).click();
										Thread.sleep(2000);
										
										checkTitle(setGet.getTitle());
										
										Set<String> tabs = driver.getWindowHandles();
										if(tabs.size()>1)
										{
											int counter =0;
											for(String tab : tabs)
											{
												if(counter==0)
												{
													setGet.setTab(tab);
													counter++;
													continue;
												}
												
												driver.switchTo().window(tab);
												randomClicks();
												driver.switchTo().window(setGet.getTab());
											}
										}else{
											
										}
										break;
									}else{
										break;
									}
									
								}catch(Exception e)
								{
									break;
//									System.out.println("Unable to click on webElement---"+list.get(i));
								}
								
							}
						}
					}
				}else {
					System.out.println("Elements list is empty-- There are no elements with tagname as "+tagName);
				}
				
//				swipe();
//			}
			
		}
		
	}
	
	public void checkTitle(String expectedTitle)
	{
		if(!expectedTitle.equalsIgnoreCase(driver.getTitle()))
		{
			driver.navigate().back();
			checkTitle(expectedTitle);
		}
	}
	
	public void  verticalSwipe()
	{
		try
		{
			Dimension dimensions = driver.manage().window().getSize();
			int height =  dimensions.getHeight();
			int width = dimensions.getWidth();
			int x= width/2;
			int starty= (int) (height*0.80);
			int endy= (int) (height*0.20);
			driver.swipe(x, starty, x, endy, 500);
			
		}catch(Exception e)
		{
			System.out.println("verticalSwipe method is not working---- error---"+e);
		}
	}
	
	public void swipe()
	{
		try
		{
			
			Dimension dimensions = driver.manage().window().getSize();
			int height =  dimensions.getHeight();
			int width = dimensions.getWidth();
			int x= width/2;
			int starty= (int) (height*0.80);
			int endy= (int) (height*0.20);
			
			// appium converts press-wait-moveto-release to a swipe action
			TouchAction touchAction = new TouchAction(driver);
	        touchAction.press(x, starty).waitAction(500).moveTo(x, endy).release();
	        touchAction.perform();
			
		}catch(Exception e)
		{
			System.out.println("swipe method is not working---- error---"+e);
		}
	}
	
}
