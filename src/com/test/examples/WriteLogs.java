package com.test.examples;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class WriteLogs implements WriteLogsInterface{

	synchronized public void writeLogsToFile(String logs) {
		BufferedWriter bw = null;
		FileWriter fw = null;
		try{
		
		File f=new File("Logs.txt");
		if(!f.exists()){
			f.createNewFile();
		}
		fw = new FileWriter(f.getAbsoluteFile(), true);
		bw = new BufferedWriter(fw);
		bw.write(logs);
		System.out.println("Done");
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			try {
				if (bw != null)
					bw.close();

				if (fw != null)
					fw.close();

			} catch (IOException ex) {

				ex.printStackTrace();

			}
		}
	}
}
