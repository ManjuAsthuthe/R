package com.r.india.testUnits;

import java.util.ArrayList;
import java.util.List;

import org.testng.TestNG;
import org.testng.xml.XmlClass;
import org.testng.xml.XmlSuite;
import org.testng.xml.XmlTest;

public class mainClass {
	
	public static void main(String[] args) {
		
		XmlSuite xmlSuite = new XmlSuite();
		xmlSuite.setName("r  Test");
		xmlSuite.setParallel("false");
		xmlSuite.setVerbose(1);
		
		int len = args.length;
		if(len > 1)
		{
			String device_id = args[0];
			String os_version = args[1];
			String device_name = args[2];
			String device_os = args[3];
			
			System.out.println(device_id);
			System.out.println(os_version);
			System.out.println(device_name);
			System.out.println(device_os);
			
			XmlTest xmlTest = new XmlTest(xmlSuite);
			xmlTest.setName("Browser/Mobile Test");
			xmlTest.addParameter("device_id", device_id);
			xmlTest.addParameter("os_version", os_version);
			xmlTest.addParameter("device_name", device_name);
			xmlTest.addParameter("device_os", device_os);
			xmlTest.setPreserveOrder("true");
			
			XmlClass runner = new XmlClass(Runners.class);
			
			List<XmlClass> list = new ArrayList<XmlClass>();
			list.add(runner);
			
			xmlTest.setXmlClasses(list);
			
		}else if(args[0].equalsIgnoreCase("web")){
			
			System.out.println(args[0]);
			
			XmlTest xmlTest = new XmlTest(xmlSuite);
			xmlTest.setName("Browser/Mobile Test");
			xmlTest.setPreserveOrder("true");
			
			XmlClass runner = new XmlClass(Runners.class);
			
			List<XmlClass> list = new ArrayList<XmlClass>();
			list.add(runner);
			
			xmlTest.setXmlClasses(list);
		}else{
			System.out.println("\n"+"----------Please provide valid parameters---------");
			System.out.println("\n"+"To test web application provide parameter as----> web");
			System.out.println("\n"+"To test mobile application provide four parameters as----> device_id os_version device_name device_os \n");
		}
		
		TestNG testNG = new TestNG();
		
		List<XmlSuite> suites = new ArrayList<XmlSuite>();
		suites.add(xmlSuite);
		
		testNG.setXmlSuites(suites);
		testNG.run();
	}

}
