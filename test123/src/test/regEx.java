package test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class regEx {
	
	public static void returnMemoryConsumed() throws IOException{
		  String line = "";
		  Matcher m = Pattern.compile("\\[").matcher(line);
		  while(m.find())
		  {
			System.out.println(m.group(1));  
		  }
		
//		  int start = 0;
//		          int end = 0;
//		  try {
//		  
//		    ProcessBuilder proc = new ProcessBuilder("/Users/samarth.handur/Library/Android/sdk/platform-tools/adb",
//		  
//		    "shell","dumpsys","meminfo");
//		      Process p = proc.start();
//		      Thread.sleep(2000);
//		      BufferedReader br2 = new BufferedReader(new InputStreamReader(p.getInputStream()));
////		      line = br2.lines().collect(Collectors.joining());
//		    LineNumberReader lineReader = new LineNumberReader(br2);
//		      while (lineReader != null){
//		m.reset(line); //reset the input
//		          if (!m.find()) {
//		            String msg = "Line " + lineReader.getLineNumber() + " is bad: " + line;
//		            throw new IllegalStateException(msg);
//		          }
//	      
////		return line.substring(start, end);
//		      }
//		  } catch (Exception e) {
//		      System.err.println("Error  ::  "+e.toString());
//		  }
//		//  return line.substring(start, end);
//		  }
	
	}
}
