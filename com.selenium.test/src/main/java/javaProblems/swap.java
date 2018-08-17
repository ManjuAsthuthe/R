package javaProblems;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class swap {
	
	
	
	public void swapWithoutTemp()
	{
		int x= 10;
		int y= 20;
		
		System.out.println("value of x before swapping "+x);
		System.out.println("value of y before swapping "+y);
		
			x = x+y;
			y = x-y;
			x = x-y;
		
		
		System.out.println("value of x after swapping "+x);
		System.out.println("value of y after swapping "+y);
	}
	
	public static void subsetOfSet(char[] arr)
	{
		System.out.println("full array "+Arrays.toString(arr));
		System.out.println("Null array "+null);
		
		int v = 2 ;	
	for(int i=0; i<arr.length; i++)
	{
		System.out.println(arr[i]);
		
		int k=0;
		while(k<=arr.length-v)
		{
			System.out.print(arr[k]+" ");
			k++;
		}
		v++;
		
		System.out.println("\n");
	}
		
	}
	
	public static void main (String [] args)
	{
		String waiting = "waiting";
		char [] wait = waiting.toCharArray();
		
		subsetOfSet(wait);
	}

}
