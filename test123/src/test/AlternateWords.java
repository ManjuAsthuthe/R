package test;

	
	public class AlternateWords {  
		public static void main(String[] args) {  
		     String s = "one two three four";
		     String[] split = s.split(" ");
		     String r = "";
		     for(int i=0; i<split.length; i++)
		     {
		    	 if((i%2==0))
		    	 {
		    		 r= r+split[i];
			    	 r=r+" ";
		    	 }else{
		    		 
		    		 for(int j=(split[i].length()-1); j>=0; j--)
		    		 {
		    			 r= r+split[i].charAt(j);
		    		 }
		    		 r=r+" ";
		    	 }
		     }
		     
		     System.out.println(r);
		    }  
		}  
		
			
		
	
	


