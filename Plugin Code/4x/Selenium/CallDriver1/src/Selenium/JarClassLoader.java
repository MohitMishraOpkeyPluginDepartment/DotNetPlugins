package Selenium;

import java.util.jar.*;
import java.util.*;
import java.io.*;

public class JarClassLoader {

 private static boolean debug = true;

 public ArrayList getClasseNamesInPackage
     (String jarName){
   ArrayList classes = new ArrayList ();
 
   try{
     JarInputStream jarFile = new JarInputStream
        (new FileInputStream (jarName));
     JarEntry jarEntry;

     while(true) {
       jarEntry=jarFile.getNextJarEntry ();
       if(jarEntry == null){
         break;
       }
       if(jarEntry.getName().endsWith (".class")) {
         if (debug) System.out.println 
           ("Found " + jarEntry.getName().replaceAll("/", "\\."));
         classes.add (jarEntry.getName().replaceAll("/", "\\."));
       }
     }
   }
   catch( Exception e){	   
	   System.out.println("Exception Jar Class Loader: "+e.getMessage());
	   e.printStackTrace();
   }
   return classes;
}
 
}
