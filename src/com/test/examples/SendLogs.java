package com.test.examples;

import java.io.IOException;

public class SendLogs {
	
 	private static WriteLogs wl = new WriteLogs();
 	
	public static void main(String[] args) throws IOException {
		wl.writeLogsToFile("Line1\n");
		test1();
		test2();
	}
	
	public static void test1() throws IOException{
		wl.writeLogsToFile("Line2\n");
	}

	public static void test2() throws IOException{
		wl.writeLogsToFile("Line3\n");
	}
	
}
