package Selenium;

import java.io.File;
import java.io.FilenameFilter;

public class GetFiles {

  public String[] listFiles(String dir) {
	String[] filenames = null;
	try{
		File directory = new File(dir);

	    if (!directory.isDirectory()) {
	      //System.out.println("No directory provided");
	      return filenames;
	    }

	    //create a FilenameFilter and override its accept-method
	    FilenameFilter filefilter = new FilenameFilter() {

	      public boolean accept(File dir, String name) {
	        //if the file extension is .txt return true, else false
	        return name.endsWith(".jar");
	      }
	    };

	    filenames = directory.list(filefilter);

	    /*for (String name : filenames) {
	      System.out.println("File Name in directory "+name);
	    }*/
	}
	catch( Exception e){
	     e.printStackTrace ();
	   }
	return filenames;
    
  }  
}
