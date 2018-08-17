package test;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class stringMatch {
	public static String check() {
		String theGroup = "";
	String pattern = "[u0]";
	Pattern pat = Pattern.compile(pattern);
	String input = "{23r3rf4 u0 com.rakuten.ivdn.display/com.rakuten.ivdn.display.map.MapsActivity}";
	Matcher m = pat.matcher(input);
	if(m.find())
	{
		theGroup= m.group(0);
		
	}
//	Boolean found = pat.matcher(input).lookingAt();
	
	return theGroup;
	}

	
	public static void main(String[] args) {
//		stringMatch ss= new stringMatch();
//		ss.check();
		
//		String k = "4.7.0(470002)STG";
//		String split[] = k.split("\\)");
//		System.out.println(split[1]);
//		
//		String inn = "27858 ttys002    0:00.85 /usr/bin/java -jar TestAppium-0.0.1-SNAPSHOT-jar-with-dependencies.jar samarthh 08df4c900c025bb2 6.0 app-v5.0.1-release.apk 27979 ttys004    0:00.00 /bin/sh -c ps -ax | grep  TestAppium-0.0.1-SNAPSHOT-jar-with-dependencies.jar 27981 ttys004    0:00.00 grep TestAppium-0.0.1-SNAPSHOT-jar-with-dependencies.jar 27888 ttys007    0:00.91 /usr/bin/java -jar TestAppium-0.0.1-SNAPSHOT-jar-with-dependencies.jar samarthh 2335452b 6.0 app-v5.0.1-release.apk";
			
//		String some = check();
//		System.out.println(some);
		
		
		String k = "{23r3rf4 u0 com.rakuten.ivdn.display/com.rakuten.ivdn.display.map.MapsActivity}";
		String split[] = k.split("\\/");
		String activity = split[0];
		String split1[] = activity.split("u0");
		String trimmedActivity =split1[1].trim();
		String currActivity = split[1];
		System.out.println("Activity -----"+trimmedActivity);
		System.out.println("Current Activity -----"+currActivity);
		String remove = currActivity.replace(trimmedActivity, " ");
		System.out.println("ONLY Current Activity -----"+remove.trim());
		
		
	
	
	}
	
}
	

