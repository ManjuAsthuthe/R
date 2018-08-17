package com.bot.ipa;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import org.apache.commons.io.FileUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.dd.plist.NSArray;
import com.dd.plist.NSDictionary;
import com.dd.plist.NSNumber;
import com.dd.plist.NSObject;
import com.dd.plist.PropertyListParser;

public class Helper {
	
	
	public String unzip(String path) throws InterruptedException
	{
		String userDir;
		String destPath;
		String line;
		
		Date now = new Date();
		long millisec = now.getTime();
		
		userDir = System.getProperty("user.dir");
		destPath = userDir+"/"+millisec;
		try {
			ProcessBuilder pb = new ProcessBuilder("unzip",path,"-d",destPath); 
			Process p = pb.start();
			BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
	        while((line = reader.readLine()) != null) 
	        {
//	            System.out.print(line + "\n");
	        }
	        p.waitFor();
	        
	        
		} catch (IOException e) {
			e.printStackTrace();
//			System.out.println("Uanble to Zip from  -- "+path+" to Destination path -- "+destPath+ " error --"+e);
		}
//		 return userDir+"/"+timeStamp;
		return destPath;
	}
	
	public String getAppFileName(String path)
	{
		String appFileName = "";
		try
		{
			File file = new File(path+"/Payload");
	        File [] ss = file.listFiles();
	        appFileName = ss[0].getName();
			
		}catch(Exception e)
		{
//			System.out.println("getAppFileName method is not working -- error --"+e);
		}
		return appFileName;
	}
	
	
	public String getIcon(String appFileName, String appName, String appVersion, String packageName, String sourcePath, String destPath)
	{
		Date now = new Date();
		long millisec = now.getTime();
		String ms = Long.toString(millisec)+".png";
		
		String source = sourcePath+"/Payload/"+appFileName+"/AppIcon40x40@2x.png";
//		String dest = destPath+"/"+appName+"("+packageName+")"+appVersion+".png";
		String dest = destPath+"/"+millisec+".png";
		try
		{
			FileUtils.copyFile(new File(source), new File(dest));
		}catch(Exception e)
		{
//			System.out.println("getIcon method is not working -- error --"+e);
		}
		return ms;
	}
	
	public String getAppName(String path, String appFileName)
	{
		String appName = null;
		String plistPath = path+"/Payload/"+appFileName+"/Info.plist";
		try {
			  File file = new File(plistPath);
			  NSDictionary rootDict = (NSDictionary)PropertyListParser.parse(file);
//			  String [] ss = rootDict.allKeys();
			  appName = rootDict.get("CFBundleName").toString();
//			  System.out.println("APP Name ---------->   "+appName);

			} catch(Exception ex) {
//			  ex.printStackTrace();
			}
		return appName;
	}
	
	public String getPackageName(String path, String appFileName)
	{
		String appName = null;
		String plistPath = path+"/Payload/"+appFileName+"/Info.plist";
		try {
			  File file = new File(plistPath);
			  NSDictionary rootDict = (NSDictionary)PropertyListParser.parse(file);
			  appName = rootDict.get("CFBundleIdentifier").toString();
//			  System.out.println("PACKAGE Name ---------->   "+appName);

			} catch(Exception ex) {
//			  ex.printStackTrace();
			}
		return appName;
	}

	public String getAppVersion(String path, String appFileName)
	{
		String appVersion = "";
		String plistPath = path+"/Payload/"+appFileName+"/Info.plist";
		try {
				  File file = new File(plistPath);
				  NSDictionary rootDict = (NSDictionary)PropertyListParser.parse(file);
				  appVersion = rootDict.get("CFBundleShortVersionString").toString();
//				  System.out.println("APP version  ---------->   "+appVersion);

		}catch(Exception ex) 
		{
//			ex.printStackTrace();
		}
		
		return appVersion;
	}
	public void deleteDirectory(String path)
	{
		File file = new File(path);
		
		try {
			FileUtils.deleteDirectory(file);
//			System.out.println("Directory has been deleted recursively !");
		} catch (IOException e) {
//			System.out.println("Problem occurs when deleting the directory : " + path);
//			e.printStackTrace();
		}
	}
}
