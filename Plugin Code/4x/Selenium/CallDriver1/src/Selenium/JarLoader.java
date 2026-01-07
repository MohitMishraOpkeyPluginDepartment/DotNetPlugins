package Selenium;

import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;


public class JarLoader extends URLClassLoader
{
	
	     public JarLoader(URL[] urls) {  
		         super(urls);  
		     }  
		       
		     @Override  
		   
		     public void addURL(URL url) {  
		         super.addURL(url);  
		     }  
	
	public static ArrayList LoadJarFile(String jarpath)
	{
		ArrayList classes = new ArrayList();	
		try{
			URLClassLoader loader = (URLClassLoader)ClassLoader.getSystemClassLoader();  
		
			JarLoader l = new JarLoader(loader.getURLs());  
			
			//System.out.println("Jar path: "+ jarpath);	 
		 l.addURL(new URL("file:/" + jarpath));
		 
		 //Get all class names in a list from jar file
		 JarClassLoader jcl = new JarClassLoader();		
		 ArrayList classnames = new ArrayList ();		
		 //System.out.println("Load classes in Jar: "+ jarpath);
		 classnames= jcl.getClasseNamesInPackage(jarpath);
		// System.out.println("Class Names size: "+ classnames.size());	 
		 	
		 
		 for(int i=0;i<classnames.size();i++)
		 {			
			 //Remove .class from classname.
			 String classname = classnames.get(i).toString();
			 classname = classname.replace(".class","");
			 
			// System.out.println("Class Name: "+ classname);
			 try
			 {
				//Load class and get all methods
				 Class c = l.loadClass(classname);
				 
				 classes.add(c); 
				/* Method methlist[]= c.getDeclaredMethods();
				 
				 for(int j=0;j<methlist.length;j++)
				 System.out.println(methlist[j].getName());*/
			 }
			 catch(Exception e)
			{
				System.out.println("Exception JarLoader: "+e.getMessage());
				e.printStackTrace();
			}	
			 		
		 }	 
		}
		catch(Exception e)
		{
			System.out.println("Exception JarLoader: "+e.getMessage());
			e.printStackTrace();
		}
		return classes;
	}		
	
}


