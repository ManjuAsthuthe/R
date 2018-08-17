package test;

public class Activity {
	
	public static void main(String[] args) {
		
		String s = "mFocusedActivity: ActivityRecord{41678a8 u0 com.amazon.mShop.android.shopping/com.amazon.mShop.home.web.MShopWebGatewayActivity t129}";
		String [] sa = s.split("\\.");
		String lastString = sa[(sa.length)-1];
		String [] activity = lastString.split(" ");
		System.out.println(activity[0].toString());
	}

}
