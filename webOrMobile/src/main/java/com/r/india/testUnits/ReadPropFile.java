package com.r.india.testUnits;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ReadPropFile{


	public String getProp(String key){
		String workingDir = System.getProperty("user.dir");
		System.out.println(workingDir+"/config.properties");
		File fs = new File(workingDir+"/config.properties");
		FileInputStream inputfile = null;
		try{
			inputfile = new FileInputStream(fs);
		}catch(FileNotFoundException e){
			System.out.print("Please ensure property file has RW permission");
		}
		Properties property = new Properties();
		try{
			property.load(inputfile);
		}catch(IOException e){
			System.out.print("fatal: i/o load error..!!!");
		}
		
		return property.getProperty(key);
	}
	
	public void loadProperties() throws InterruptedException
	{
		Properties prop = new Properties();
		InputStream input = null;
		try
		{
			System.out.println("Load Properties --"+System.getProperty("user.dir")+"/config.properties");

			String filename =System.getProperty("user.dir")+"/config.properties"; 
			input = new FileInputStream(filename);

			prop.load(input);

			for (String name : prop.stringPropertyNames()) 
			{
				String value = prop.getProperty(name);
				System.setProperty(name, value);
			}
		} catch (IOException ex) 
		{
			ex.printStackTrace();
		}
	}
}
