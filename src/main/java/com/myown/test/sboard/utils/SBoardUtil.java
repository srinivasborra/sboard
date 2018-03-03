package com.myown.test.sboard.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

public class SBoardUtil {
	
	private static SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy");
	
	public static String currentDate(Date d){
		String dateToStr = format.format(d);
		return dateToStr;
	}
	
}
