package com.bot.apk;

import java.io.IOException;

import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.SAXException;

public class Main 
{
    public static void main( String[] args ) throws IOException, InterruptedException, SAXException, ParserConfigurationException
    {
    	String app_path = args[0];
    	String icon_path = args[1];
    	
    	
        Helper helper = new Helper();
        String path = helper.extractApkAndGetPath(app_path);
        
        /** get package name **/
        String Package = helper.getPackageName(path);
//        System.out.println("Package Name ---> "+Package);
        
        /** get APP name **/
        String appNameVariable = helper.getAppNameVariable(path);
        String appName = helper.getAppName(path, appNameVariable);
        System.out.println(appName);
        String appNameTrimmed = appName.replaceAll(" ", "");
        
        /** Get Icon Folder name and Icon name **/
	    String [] folderAndIcon=  helper.getFolderAndIconName(path);
	    String folderName = folderAndIcon[0];
	    String iconName = folderAndIcon[1];
        
	    /** Copy Icon from source path to destination path **/
        String iconFileName = helper.getIcon(path, folderName, iconName, appNameTrimmed, Package,icon_path);
        System.out.println(iconFileName);
        
        /** Delete the directory **/
        helper.deleteDirectory(path);
        
    }
}
