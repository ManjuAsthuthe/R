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
import io.appium.java_client.android.AndroidDriver;

public class WebScript {
	WebDriver driver;
	
	WebScript(WebDriver wdriver)
	{
			this.driver= wdriver;
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
									String hid = list.get(i).getAttribute("type");
									if(list.get(i).isDisplayed() && hid!="hidden")
									{
										list.get(i).sendKeys(System.getProperty("text"));
										list.get(i).sendKeys(Keys.ENTER);
										Thread.sleep(1000);
										
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
									String hid = list.get(i).getAttribute("type");
									if(list.get(i).isDisplayed() && hid!="hidden")
									{
										list.get(i).click();
										Thread.sleep(1000);
										
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
									String hid = list.get(i).getAttribute("type");
									if(list.get(i).isDisplayed() && hid!="hidden")
									{
										list.get(i).click();
										Thread.sleep(1000);
										
										checkTitle(setGet.getTitle());
										
										Set<String> tabs = driver.getWindowHandles();
										List<String> tabsList =  new ArrayList<String>(tabs);
										
										if(tabs.size()>1 && !tabsList.contains(setGet.getTab()))
										{
											setGet.setTab(tabsList.get(0));
											driver.switchTo().window(tabsList.get(1));
											randomClicks();
											driver.switchTo().window(setGet.getTab());
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
									String hid = list.get(i).getAttribute("type");
									if(list.get(i).isDisplayed() && hid!="hidden")
									{
										list.get(i).click();
										Thread.sleep(1000);
										
										checkTitle(setGet.getTitle());
										
										Set<String> tabs = driver.getWindowHandles();
										List<String> tabsList =  new ArrayList<String>(tabs);
										
										if(tabs.size()>1 && !tabsList.contains(setGet.getTab()))
										{
											setGet.setTab(tabsList.get(0));
											driver.switchTo().window(tabsList.get(1));
											randomClicks();
											driver.switchTo().window(setGet.getTab());
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
							
							case "div":
							{
								try
								{
									setGet.setTitle(driver.getTitle());
									String hid = list.get(i).getAttribute("type");
									if(list.get(i).isDisplayed() && hid!="hidden")
									{
										list.get(i).click();
										Thread.sleep(1000);
										
										checkTitle(setGet.getTitle());
										
										Set<String> tabs = driver.getWindowHandles();
										List<String> tabsList =  new ArrayList<String>(tabs);
										
										if(tabs.size()>1 && !tabsList.contains(setGet.getTab()))
										{
											setGet.setTab(tabsList.get(0));
											driver.switchTo().window(tabsList.get(1));
											randomClicks();
											driver.switchTo().window(setGet.getTab());
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
									String hid = list.get(i).getAttribute("type");
									if(list.get(i).isDisplayed() && hid!="hidden")
									{
										list.get(i).click();
										Thread.sleep(1000);
										
										checkTitle(setGet.getTitle());
										
										Set<String> tabs = driver.getWindowHandles();
										List<String> tabsList =  new ArrayList<String>(tabs);
										
										if(tabs.size()>1 && !tabsList.contains(setGet.getTab()))
										{
											setGet.setTab(tabsList.get(0));
											driver.switchTo().window(tabsList.get(1));
											randomClicks();
											
										}else if(tabs.size()>1){
											driver.close();
											driver.switchTo().window(setGet.getTab());
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
									String hid = list.get(i).getAttribute("type");
									if(list.get(i).isDisplayed() && hid!="hidden")
									{
										list.get(i).click();
										Thread.sleep(1000);
										
										checkTitle(setGet.getTitle());
										
										Set<String> tabs = driver.getWindowHandles();
										List<String> tabsList =  new ArrayList<String>(tabs);
										
										if(tabs.size()>1 && !tabsList.contains(setGet.getTab()))
										{
											setGet.setTab(tabsList.get(0));
											driver.switchTo().window(tabsList.get(1));
											randomClicks();
											driver.switchTo().window(setGet.getTab());
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
//					System.out.println("Elements list is empty-- There are no elements with tagname as "+tagName);
				}
				
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
	
}
