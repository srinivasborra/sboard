package com.test.examples;

public class StoreLogs<T>{
	Class  class1;
	
	public StoreLogs(Class class1){
		this.class1= class1;
	}
	public T  CreateInstance() throws IllegalAccessException, InstantiationException{
		return (T) this.class1.newInstance();
	}
	
//	public static void main(String ag[]){
//		StoreLogs<Integer> slInt = new StoreLogs<Integer>();
//		StoreLogs<String> slStr = new StoreLogs<String>();
//		
//		slInt.testMethod1(new Integer(10));
//		slStr.testMethod1(new String("Welcome"));
//		System.out.println("Integer Val from Class:"+slInt.get());
//		System.out.println("String Val from Class:"+slStr.get());
//	} 
}

//public class StoreLogs<T>{
//	private T t;
//	
//	public void testMethod1(T t){
//		this.t= t;
//	}
//	public T get(){
//		return t;
//	}
//	
//	public static void main(String ag[]){
//		StoreLogs<Integer> slInt = new StoreLogs<Integer>();
//		StoreLogs<String> slStr = new StoreLogs<String>();
//		
//		slInt.testMethod1(new Integer(10));
//		slStr.testMethod1(new String("Welcome"));
//		System.out.println("Integer Val from Class:"+slInt.get());
//		System.out.println("String Val from Class:"+slStr.get());
//	} 
//}