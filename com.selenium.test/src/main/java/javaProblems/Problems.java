package javaProblems;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class Problems {
	
	public static void dupCharWithoutCollection(String ss)
	{
		Date start = new Date();
		char [] ch = ss.toCharArray();
		
		System.out.println("Duplicate character without collection");
		
		for(int i=0; i<ch.length; i++)
		{
			int count =0;
			for(int j=i+1; j<ch.length; j++)
			{
				if(ch[i]==ch[j])
				{
					count++;
				}
			}
			if(count==1 && !Character.isWhitespace(ch[i]))
			{
				int c = 1;
				for(int k=i; k>=0; k--)
				{
					if(ch[i]==ch[k])
					{
						c++;
					}
				}
				System.out.print(ch[i]+"---"+c+" ");
			}
		}
		Date end = new Date();
//		System.out.println("Start time --"+start.getTime());
//		System.out.println("End time --"+end.getTime());
		System.out.println("Time taken in miliseconds "+(end.getTime()-start.getTime()));
	}
	
	public static void distCharWithoutCollection(String ss)
	{
		char [] ch = ss.toCharArray();
		
		System.out.println("Distinct character without collection");
		
		for(int i=0; i<ch.length; i++)
		{
			int count=0;
			for(int j=0; j<ch.length; j++)
			{
				if(ch[i]==ch[j])
				{
					count++;
				}
			}
			if(count==1)
			{
				System.out.print(ch[i]+"---"+count+" ");
			}
		}
	}
	
	public static void dupIntWithoutCollection(int[] arr)
	{
		System.out.println("Duplicate integer without collection ");
		
		for(int i=0; i<arr.length; i++)
		{
			int count=0;
			for(int j=i+1; j<arr.length; j++)
			{
				if(arr[i]==arr[j])
				{
					count++;
				}
			}
			if(count==1)
			{
				System.out.print(arr[i]+" ");
			}
		}
	}
	
	public static void distIntWithoutCollection(int[] arr)
	{
		System.out.println("Distinct integer without collection ");
		
		for(int i=0; i<arr.length; i++)
		{
			int count =0;
			for(int j=0; j<arr.length; j++)
			{
				if(arr[i]==arr[j])
				{
					count++;
				}
			}
			if(count==1)
			{
				System.out.print(arr[i]+" ");
			}
		}
	}
	
	public static void dupCharWithCollection(String ss)
	{
		Date start = new Date();
		System.out.println("Duplicate Character with Collection");
		char[] ch = ss.toCharArray();
		Map<Character,Integer> map = new HashMap<Character,Integer>();
		
		for(Character chr : ch)
		{
			if(map.containsKey(chr))
			{
				map.put(chr, map.get(chr)+1);
			}else{
				map.put(chr, 1);
			}
		}
		
		Set<Character> set = map.keySet();
		for(Character c : set)
		{
			if(!Character.isWhitespace(c) && map.get(c)>1)
			{
				System.out.print(c+"---"+map.get(c)+" ");
			}
		}
		Date end = new Date();
//		System.out.println("Start time --"+start.getTime());
//		System.out.println("End time --"+end.getTime());
		System.out.println("Time taken in miliseconds "+(end.getTime()-start.getTime()));
	}
	
	public static void distCharWithCollection(String ss)
	{
		System.out.println("Distinct character with collection");
		
		char [] ch = ss.toCharArray();
		Map<Character,Integer> map = new HashMap<Character,Integer>();
		
		for(Character chr: ch)
		{
			if(map.containsKey(chr))
			{
				map.put(chr, map.get(chr)+1);
			}else{
				map.put(chr, 1);
			}
		}
		Set<Character> set = map.keySet();
		for(Character c : set)
		{
			if(!Character.isWhitespace(c) && map.get(c)==1)
			{
				System.out.print(c+"---"+map.get(c)+" ");
			}
		}
	}
	
	public static void reverseOfString(String ss)
	{
		System.out.println("Reverse of String");
		char[] ch = ss.toCharArray();
		
		for(int i=ch.length-1; i>=0; i--)
		{
			System.out.print(ch[i]);
		}
	}
	
	public static void reverseOfWords(String ss)
	{
		System.out.println(" \nReverse of words");
		
		String [] split = ss.split(" ");
		for(int i=0; i<split.length; i++)
		{
			char ch[] = split[i].toCharArray();
			
			for(int j= ch.length-1; j>=0; j--)
			{
				System.out.print(ch[j]);
			}
			
			System.out.print(" ");
		}
	}
	
	public static void printLastToFirst(String filePath) throws IOException
	{
		File file = new File(filePath);
		String line = "";
		ArrayList<String> lines = new ArrayList<String>();
			BufferedReader br = new BufferedReader(new FileReader(file));
			while((line = br.readLine()) != null)
			{
				lines.add(line);
			}
		for(int i=lines.size()-1; i>=0; i--)
		{
			System.out.println(lines.get(i));
		}
	}
	
	public static void printLastToFirstWithoutCollection(String filePath) throws IOException
	{
		File file = new File(filePath);
		String line = "";
		String[] lines= new String[20];
		int i=0;
		FileReader reader = new FileReader(file);
		BufferedReader br = new BufferedReader(reader);
			while((line = br.readLine()) != null)
			{
				lines[i++]=line;
//				i++;
			}
			for(int j=lines.length-1; j>=0; j--)
			{
				if(lines[j]!= null)
				{
					System.out.println(lines[j]);
				}
			}
	}
	
	int[] format = {1,2,3,4,5,1,2,3,4};	
	public static void repeatFormat(int[] arr)
	{
		for(int i=0; i<arr.length-1; i++)
		{
			int j=0;
			int c = 1 ;
			boolean flag = false;
			for(j=i+1; j<arr.length-1; j++)
			{
				if(arr[i]==arr[j] && arr[i+1]==arr[j+1])
				{
					System.out.print(arr[i]+" ");
					for( c=1; c<=j-1; c++)
					{
						if((j+c) <= arr.length-1)
						{
							if( arr[i+c]==arr[j+c])
							{
								System.out.print(arr[i+c]+" ");
							}else{
								break;
							}
						}else{
							break;
						}
						
					}
					flag = true;	
				}
				
			}
			if(flag == true)
			{
				break;
			}
		}
	}
	
	int[] format1 = {1,2,3,4,5,1,2,3,4};
	public static void repeatFormatWhile(int [] list)
	{
		for (int i=0; i<list.length-1; i++)
		{
			boolean flag = false;
			for(int j=i+1; j<list.length-1; j++)
			{
				if(list[i]==list[j] && list[i+1]==list[j+1])
				{
					System.out.print(list[i]+" ");
					int c=1;
					while(c<=j-1 && (j+c)<=list.length-1)
					{
						if(list[i+c]==list[j+c])
						{
							System.out.print(list[i+c]+" ");
						}else{
							break;
						}
						c++;
					}
					
					flag = true;
				}
			}
			
			if(flag==true)
			{
				break;
			}
		}
	}
	
	
	public static int reverseOfAnInteger(int input)
	{
		int reversedNum = 0;
		
		while (input != 0) {
			  reversedNum = reversedNum * 10 + input % 10;
			  input = input / 10;
			}
		
		return reversedNum;
	}
	
	public static  void reverseOfAnIntegerUsingIntArray(int input)
	{
		String ss = Integer.toString(input);
		
		char [] ch = ss.toCharArray();
		
		for(int i=ch.length-1; i>=0; i--)
		{
			System.out.println(Character.getNumericValue(ch[i]));
		}
		
	}
	
	public static void main(String[] args) throws IOException
	{
		String manju = "sdd shh im p";
		int[] man = {1,2,3,1,2,3,5,5,5,6,7,8,6,6};
		
		int[] format = {1,2,3,4,5,1,2,3,4};
		
		
//		dupCharWithCollection(manju);
		
//		System.out.println("----------");
//		distCharWithoutCollection(manju);
//		
//		System.out.println("----------");
//		
//		dupIntWithoutCollection(man);
//		System.out.println("----------");
//		distIntWithoutCollection(man);
		
//		System.out.println("----------");
		
//		dupCharWithoutCollection(manju);
//		System.out.println("----------");
//		distCharWithCollection(manju);
		
		
//		reverseOfString(manju);
//		reverseOfWords(manju);
		
//		printLastToFirstWithoutCollection("/Users/manjunath.r/Desktop/readMe.txt");
		
//		System.out.println(reverseOfAnInteger(123456778));
		
		reverseOfAnIntegerUsingIntArray(12345);
		
//		repeatFormat(format);
//		System.out.println("---------------------");
//		repeatFormatWhile(format);
		
	}
	

}
