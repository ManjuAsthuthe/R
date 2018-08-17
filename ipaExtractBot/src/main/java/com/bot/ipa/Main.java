package com.bot.ipa;

import java.io.IOException;

import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.SAXException;

public class Main 
{
    public static void main( String[] args ) throws IOException, InterruptedException, SAXException, ParserConfigurationException
    {
//    	String app_path = args[0];
//    	String icon_path = args[1];
    	
    	String app_path = "";
    	String icon_path = "";
    	
        Helper helper = new Helper();
        
        /** Unzip ipa to user directory  **/
        String  path = helper.unzip(app_path);
        
        /** get appFileName **/
        String appFileName = helper.getAppFileName(path);
        
        /** Get app name **/
        String appName = helper.getAppName(path,appFileName);
        System.out.println(appName);
        String appNameTrimmed = appName.replaceAll(" ", "");
        
        /** Get app version **/
        String appVersion = helper.getAppVersion(path,appFileName);
        
        /** Get Package name **/
        String PackageName = helper.getPackageName(path, appFileName);
        
        /** cop icon to given location **/
        String iconFileName = helper.getIcon(appFileName, appNameTrimmed, appVersion, PackageName, path, icon_path);
        System.out.println(iconFileName);
        
        /** Delete Directory **/
//        helper.deleteDirectory(path);
        
    }
}
