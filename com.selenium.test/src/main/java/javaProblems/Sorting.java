package javaProblems;

import java.util.Arrays;

public class Sorting {
	public static int[] insertionSort(int[] list)
	{
		int i,j,key,temp;
		
		for(i=1; i<list.length; i++)
		{
			key=list[i];
			j=i-1;
			
			while(j>=0 && key<list[j])
			{
				temp = list[j];
				list[j]=list[j+1];
				list[j+1]= temp;
				j--;
			}
			
		}
		return list;
	}
	
	int[] arry1 = {9,0,5,4,7,7,3,6};
	
	public static int[] selectionSort(int[] list)
	{
		for(int i=0; i<list.length; i++)
		{
			int min = list[i];
			int index = 0 ;
			int temp;
			
			for(int j=i+1; j<list.length; j++)
			{
				if(list[j]<min)
				{
					min=list[j];
					index=j;
				}
			}
			if(list[i]!=min)
			{
				temp = list[i];
				list[i]=list[index];
				list[index]=temp;
			}
			
		}
		return list;
	}
	
	public static int[] insertionSortFor(int[] list)
	{
		for(int i=1; i<list.length; i++)
		{
			int temp;
			int key = list[i];
			for(int j=i-1; j>=0; j--)
			{
				if(key<list[j])
				{
					temp = list[j];
					list[j] = list[j+1];
					list[j+1]=temp;
				}
			}
		}
		return list;
		
	}
	public static int[] bubbleSort(int[] list)
	{
		for(int i=0; i<list.length; i++)
		{
			int temp;
			for(int j=0; j<list.length-1; j++)
			{
				if(list[j]>list[j+1])
				{
					temp = list[j];
					list[j]=list[j+1];
					list[j+1]= temp;
				}
			}
		}
		return list;
	}
	
	
	public static void main(String[] args)
	{
		int[] arry = {9,0,5,4,7,7,3,6};
//		System.out.println("Insertion sort ---"+Arrays.toString(insertionSort(arry)));
		
//		System.out.println("Selection sort ---"+Arrays.toString(selectionSort(arry)));
		
		System.out.println("Bubble sort -----"+Arrays.toString(bubbleSort(arry)));
		
//		System.out.println("Insertion sort for ---"+Arrays.toString(insertionSortFor(arry)));
		
	}

}
