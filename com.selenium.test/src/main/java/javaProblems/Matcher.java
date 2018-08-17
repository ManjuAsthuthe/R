package javaProblems;

import java.util.regex.Pattern;

public class Matcher {
	
	static boolean numberOrNot(String input)
    {
        try
        {
            Integer.parseInt(input);
        }
        catch(NumberFormatException ex)
        {
            return false;
        }
        return true;
    }
	
	
	public static void checkOperator(String name)
	{
		String operator = null;
		
		if(name.contains("+"))
	     {
	    	  operator = "plus";
	     }else if(name.contains("-"))
	     {
	    	 operator = "minus";
	     }else if(name.contains("*"))
	     {
	    	 operator = "times";
	     }else if(name.contains("/"))
	     {
	    	 operator = "div";
	     }
	     
	     if(name.contains("+") || name.contains("-") || name.contains("*") || name.contains("/"))
	     {
	    	 switch(operator)
	    	 {
	    		   case "plus" :
	    			  String [] str = name.split("\\+");
	    			  {
	    				  if(numberOrNot(str[0]) && numberOrNot(str[1]))
	    					{
	    					  System.out.println("OK");
	    					}else{
	    						System.out.println("ERR");
	    					}
	    			  }
	    		      break; 
	    		   
	    		   case  "minus":
	    			   String [] str1 = name.split("\\-");
		    			  {
		    				  if(numberOrNot(str1[0]) && numberOrNot(str1[1]))
		    					{
		    					  System.out.println("OK");
		    					}else{
		    						System.out.println("ERR");
		    					}
		    			  }
	    		      break; 
	    		      
	    		   case  "times":
	    			   String [] str2 = name.split("\\*");
		    			  {
		    				  if(numberOrNot(str2[0]) && numberOrNot(str2[1]))
		    					{
		    					  System.out.println("OK");
		    					}else{
		    						System.out.println("ERR");
		    					}
		    			  }
	    		      break; 
	    		   case  "div":
	    			   String [] str3 = name.split("\\/");
		    			  {
		    				  if(numberOrNot(str3[0]) && numberOrNot(str3[1]))
		    					{
		    					  System.out.println("OK");
		    					}else{
		    						System.out.println("ERR");
		    					}
		    			  }
	    		      break; 
	    		   
	    		   default : 
	    		      
	    	 }
	     }else{
	    	 System.out.println("ERR");
	     }
	}
	
	public static void patternMatcher(String input)
	{
		Pattern pattern = Pattern.compile("[0-9][+\\*\\/-][0-9]");
		Matcher matcher = pattern.matcher(input);
		if(matcher.find())
		{
//			System.out.println(matcher.group(1));
			System.out.println("OK");
		}else{
			System.out.println("ERR");
		}
		
		
	}
	public static void main(String[] args) {

//		checkOperator("123--123");
		patternMatcher("123-123");
	     
	}
	     
	

}
