package test;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Date;
import java.util.stream.Collectors;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.io.FileUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class apkExtract {
	
	
	public static String extractApk(String appPath, String newPath) throws IOException, InterruptedException{
		
		String manifestFilePAth;
		String line;
		
//		ProcessBuilder pb = new ProcessBuilder("/usr/bin/java","-jar","/Users/manjunath.r/Desktop/apktool/apktool.jar","d",appPath); 
//		Process p = pb.start();
//		BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
//        while((line = reader.readLine()) != null) {
//            System.out.print(line + "\n");
//        }
//        p.waitFor(); 

        ProcessBuilder pb = new ProcessBuilder("/usr/local/bin/apktool","d",appPath,"-o",newPath); 
		Process p = pb.start();
		BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
        while((line = reader.readLine()) != null) {
            System.out.print(line + "\n");
        }
        p.waitFor();
        
        
        
		manifestFilePAth = appPath.substring(0, 4);
		return manifestFilePAth+"/AndroidManifest.xml";

	}
	
	
	public static void readManifestFile(String manifestPath) throws SAXException, IOException, ParserConfigurationException
	{
		File inputFile = new File(manifestPath);
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
        Document doc = dBuilder.parse(inputFile);
        doc.getDocumentElement().normalize();
        System.out.println("Root element :" + doc.getDocumentElement().getNodeName());
        NodeList nList = doc.getElementsByTagName("application");
        System.out.println("----------------------------");
        
        for (int temp = 0; temp < nList.getLength(); temp++) {
            Node nNode = nList.item(temp);
            System.out.println("\nCurrent Element :" + nNode.getNodeName());
            
            if (nNode.getNodeType() == Node.ELEMENT_NODE) 
            {
               Element eElement = (Element) nNode;
               System.out.println("Application name path: " 
                  + eElement.getAttribute("android:label"));
//               System.out.println("First Name : " 
//                  + eElement
//                  .getElementsByTagName("firstname")
//                  .item(0)
//                  .getTextContent());
//               System.out.println("Last Name : " 
//                  + eElement
//                  .getElementsByTagName("lastname")
//                  .item(0)
//                  .getTextContent());
//               System.out.println("Nick Name : " 
//                  + eElement
//                  .getElementsByTagName("nickname")
//                  .item(0)
//                  .getTextContent());
//               System.out.println("Marks : " 
//                  + eElement
//                  .getElementsByTagName("marks")
//                  .item(0)
//                  .getTextContent());
            }
         }
     
        
	}
	
	public void deleteDirectory(String path)
	{
		File file = new File(path);
		
		try {
			FileUtils.deleteDirectory(file);
			System.out.println("Directory has been deleted recursively !");
		} catch (IOException e) {
			System.out.println("Problem occurs when deleting the directory : " + path);
			e.printStackTrace();
		}
	}
	
	public static void main(String[] args) throws IOException, InterruptedException, SAXException, ParserConfigurationException {
		
		Date now = new Date();
		System.out.println(now.getTime());
		String ss = extractApk("/Users/manjunath.r/Desktop/apktool/IVDNnew.apk","/Users/manjunath.r/Desktop/test");
		
		readManifestFile(ss);
	}

}
