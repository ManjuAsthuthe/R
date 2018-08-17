package selenium.com.selenium.test;

public class Overload {
	
	void main()
	{
		System.out.println("just main");
	}
	
	static void main (int x)
	{
		System.out.println(x);
	}
	
	public static void main(String[] args) {
		
		System.out.println("JVM main method");
		
		Overload obj = new Overload();
		obj.main();
		
		obj.main(16);
		
		
	}
}
