package com.bot.apk;

import java.io.BufferedReader;
import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStreamReader;
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

public class Helper {
	
	
	public  String  extractApkAndGetPath(String appPath) throws IOException, InterruptedException{
		
		String line;
		String path;
		
//		ProcessBuilder pb = new ProcessBuilder("/usr/bin/java","-jar","/Users/manjunath.r/Desktop/apktool/apktool.jar","d",appPath); 
		
		Date now = new Date();
		long timeMilli = now.getTime();
		
		path = System.getProperty("user.dir")+"/"+timeMilli;
//		System.out.println("User directory with time stamp path---- "+path);
		
        ProcessBuilder pb = new ProcessBuilder("/usr/local/bin/apktool","d",appPath,"-o",path); 
		Process p = pb.start();
		BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
        while((line = reader.readLine()) != null) {
//            System.out.print(line + "\n");
        }
        p.waitFor();
        
		return path;
	}
	
	
	public String getPackageName(String path) throws ParserConfigurationException, SAXException, IOException
	{
		File inputFile = new File(path+"/AndroidManifest.xml");
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
        Document doc = dBuilder.parse(inputFile);
        doc.getDocumentElement().normalize();
        
//        System.out.println("Root element :" + doc.getDocumentElement().getNodeName());
        
        Element root = doc.getDocumentElement();	
//        System.out.println("Package name ---"+root.getAttribute("package"));
        
		return root.getAttribute("package");
	}
	
	public String getAppNameVariableOldMethod(String path) throws ParserConfigurationException, SAXException, IOException
	{
		String appNameVariable = null;
		String appNameVariablePath = null;
		
		File inputFile = new File(path+"/AndroidManifest.xml");
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
        Document doc = dBuilder.parse(inputFile);
        doc.getDocumentElement().normalize();
		
        NodeList nList = doc.getElementsByTagName("application");
//        System.out.println("----------------------------");
        
        for (int temp = 0; temp < nList.getLength(); temp++) {
            Node nNode = nList.item(temp);
            System.out.println("\nCurrent Element :" + nNode.getNodeName());
            
            if (nNode.getNodeType() == Node.ELEMENT_NODE) 
            {
               Element eElement = (Element) nNode;
              appNameVariablePath = eElement.getAttribute("android:label");
               System.out.println("Application name path: " + appNameVariable);
            }
         }
        
        String [] split = appNameVariablePath.split("\\/");
        String s = split[0].replaceAll("@", "");
        if(s.equalsIgnoreCase("string"))
        {
        	appNameVariable= split[1];
        }
		return appNameVariable;
		
	}
	
	
	public String getAppNameVariable(String path)
	{
		String appNameVariable = null ;
		DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
        try{
            DocumentBuilder builder = domFactory.newDocumentBuilder();
            Document dDoc = builder.parse(new InputSource(path+"/AndroidManifest.xml"));

            XPath xPath = XPathFactory.newInstance().newXPath();
            Element userElement = (Element) xPath.evaluate("//application", dDoc, XPathConstants.NODE);
            
            appNameVariable = userElement.getAttribute("android:label"); 
//            System.out.println("app name path -- "+appNameVariable);
           
            String[] split = appNameVariable.split("\\/");
            appNameVariable = split[1];
            
        }catch (Exception e) {
//        	System.out.println("getAppNameVariable is not working -- getting error --"+e);
        }
		return appNameVariable;
	}
	
	
	public String getAppName(String path, String appVariable)
	{
		String appName = null ;
		DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
        try {
            DocumentBuilder builder = domFactory.newDocumentBuilder();
            Document dDoc = builder.parse(new InputSource(path+"/res/values/strings.xml"));

            XPath xPath = XPathFactory.newInstance().newXPath();
            appName = xPath.evaluate("//string[@name='"+appVariable+"']/text()",
            		dDoc.getDocumentElement());
//            System.out.println(appName);
        } catch (Exception e) {
//            e.printStackTrace();
        }
		return appName;
	}
	
	
	public String[] getFolderAndIconName(String path)
	{
		String folderName = null ;
		String iconName = null ;
		String folderImage;
		
		DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
        try{
            DocumentBuilder builder = domFactory.newDocumentBuilder();
            Document dDoc = builder.parse(new InputSource(path+"/AndroidManifest.xml"));

            XPath xPath = XPathFactory.newInstance().newXPath();
            Element userElement = (Element) xPath.evaluate("//application", dDoc, XPathConstants.NODE);
            
            folderImage = userElement.getAttribute("android:icon"); 
//            System.out.println(folderImage);
            
            String [] split = folderImage.split("\\/");
            folderName = split[0].replaceAll("@", "");
//            System.out.println("Icon folder name --- "+folderName);
            
            iconName = split[1];
//            System.out.println("Icon  name -- " +iconName+".png");
            
        } catch (Exception e) {
//            System.out.println("getFolderAndIconName-- method not working"+e);
        }
        
        return new String[] {folderName,iconName+".png"};
	}
	
	
	
	public String  getIcon(String path, final String folderName, String iconName,String appName, String PackageName, String destinationPath) {
		
		String resPath = path+"/res";
		
		  Date date = new Date();
	      long timeMilli = date.getTime();
		
		// initialize File object
		File file = new File(resPath);
		File checkFile ;
		
		File dest ;

		// check if the specified pathname is directory first
		if(file.isDirectory())
		{
			//list specified files on the specified directory
			String[] files = file.list(new FilenameFilter() 
			{
				
				@Override
				public boolean accept(File dir, String name) 
				{
					boolean value;
					// return files only that begins with given folderName
					if(name.startsWith(folderName))
					{
						value=true;
					}
					else{
						value=false;
					}
					return value;
				}
			});
			
			
			for(String s:files)
			{
				checkFile= new File(resPath+"/"+s+"/"+iconName);
				if(checkFile.exists())
				{
//					System.out.println("APP ICON is found in --->"+checkFile);
					
//					dest = new File(destinationPath+"/"+appName+"("+PackageName+").png");
					dest = new File(destinationPath+"/"+timeMilli+".png");
					try {
					    FileUtils.copyFile(checkFile, dest);
					} catch (IOException e) {
//						e.printStackTrace();
//						System.out.println("Uanble to copy icon from source path -- "+checkFile+" to Destination path -- "+destinationPath+ " error --"+e);
					}
					
					break;
				}
				
			}
		}
		return timeMilli+".png";
	}
	
	public void deleteDirectory(String path)
	{
		File file = new File(path);
		
		try {
			FileUtils.deleteDirectory(file);
//			System.out.println("Directory has been deleted recursively !");
		} catch (IOException e) {
//			System.out.println("Problem occurs when deleting the directory : " + path);
			e.printStackTrace();
		}
	}
}
