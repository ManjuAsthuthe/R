package com.appium.parallel;

import java.util.ArrayList;
import java.util.List;

public class Memory {
	
	public static void main(String[] args) {
		
		maxMemory();
	}
	
	
	public static int maxMemory()
	{
		int  maxMem=0;
		int mem = 0;
		int in[] = {14, 16, 18, 12, 10};
		
		
		for (int i: in)
		{
			if(mem>maxMem)
			{
				maxMem = mem;
				System.out.println("Maximum memory is --"+ maxMem);
			}
			
			if(i==1 || i>1)
			{
				mem= getRandom(20);
				System.out.println("Random number is ---"+ mem);
			}
			
		}
		
		System.out.println("final maximum memory is -------"+maxMem);
		return maxMem;
		
	}
	
	
	
	public static int getRandom(int max)
	{
		return (int) (Math.random()*max);
	}

}
