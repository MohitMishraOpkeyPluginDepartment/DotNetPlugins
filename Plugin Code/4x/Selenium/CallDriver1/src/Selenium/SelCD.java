package Selenium;

import javax.xml.parsers.*;
import javax.xml.transform.*;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import org.w3c.dom.*;
import java.io.*;
import org.xml.sax.*;
import java.lang.reflect.Method;
import java.sql.*;
import java.util.ArrayList;
import java.util.concurrent.*;
import java.util.*;

import org.sqlite.JDBC;


public class SelCD {

	public static Connection conn;
	public static Statement stat;
	public static ResultSet rs;


	public static String runtimelibpath = "";
	public static double polling_interval;
	public static long sleeptime;
	public static String currentuser="";
	public static String executiontab="";
	public static String executiondb="";
	public static String seleniumdirpath="";
	public static String invokeserverpath="";
	public static String inipath="";
	public static String errorlog="";

	public static long steptimeout;			
	public static String message="";
	public static String status = "pass";
	public static String opvar="";
	public static String wantsnapshot="";
	public static String commandstring="";
	public static String objectxml="";

	public static String methodname="";
	public static String str="";
	public static boolean methodfound = false;
	public static Object msg = null;

	public static  String ServerPath = "";
	public static int Port = 5555;
	public static String Host = "localhost";
	public static String CmdArgs = "";


	public static void main(String[] args) throws SQLException 
	{

		try
		{ 			

			polling_interval= 0.5;
			sleeptime = 50;
			runtimelibpath = args[0].toString();
			currentuser = args[1].toString();
			executiontab = args[2].toString();
			executiondb = args[3].toString();
			seleniumdirpath = args[4].toString();	
			// inipath = seleniumdirpath +"RCSettings.ini";
			inipath =args[5].toString();
			invokeserverpath = seleniumdirpath +"invoke_server.exe";		 

			errorlog = executiondb.replace("executiondb.db","RunErrorLog.txt");

			//Redirecting all the error and print statment to error log file.
			File f = new File(errorlog);
			PrintStream p = new PrintStream(f);
			MultiplePrintStream mp = new MultiplePrintStream(System.out);
			mp.Add(p);
			System.setOut(p);
			System.setErr(p);

			/*System.out.println("Runtime Lib Path: "+runtimelibpath);
			 System.out.println("User: "+currentuser);
			 System.out.println("Execution Table: "+ executiontab);
			 System.out.println("Database: "+executiondb);			 
			 System.out.println("Selenium Directory Path: " + seleniumdirpath);
			 System.out.println("ini file path: " + inipath);
			 System.out.println("Invoke server path: " + invokeserverpath);*/


			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			File file= new File(inipath);
			if (file.exists())
			{
				//System.out.println("Ini File found");


				//Using factory get an instance of document builder
				DocumentBuilder db = dbf.newDocumentBuilder();

				//parse using builder to get DOM representation of the XML file
				Document doc = db.parse(inipath);

				NodeList nl = doc.getElementsByTagName("RCSettings");
				//System.out.println("Node length: "+nl.getLength());
				for(int i = 0; i<nl.getLength(); i++)
				{
					Node nNode = nl.item(i);
					if (nNode.getNodeType() == Node.ELEMENT_NODE)
					{
						Element eElement = (Element) nNode;
						ServerPath = getTagValue("Path", eElement) ;
						if(ServerPath == "")
						{
							ServerPath = "selenium-server.jar";
						}
						Port = Integer.parseInt(getTagValue("Port", eElement)) ;
						Host = getTagValue("Host", eElement) ;									
						CmdArgs = getTagValue("CmdArgs", eElement) ;

						
											
									String[] cmdArray = new String[2];
									cmdArray[0] = invokeserverpath ;
									String arg = "\"" + ServerPath +"\"" + " " + Port + " " + "\"" +CmdArgs + "\"";
									
									cmdArray[1]=arg;
									System.out.println("Port: " + Port);
									System.out.println("Host: " + Host);
									System.out.println("Server Path: " + ServerPath);
									System.out.println("Command Line Arguments: " + CmdArgs);
																									
									Runtime rt = Runtime.getRuntime();
					                      Process myProcess = rt.exec(cmdArray);
					                 
					                        System.out.println("Selenium server invoke command: "+arg);
					                        //Process myProcess = rt.exec(arg);
					                        
					                     //   Thread.sleep(30000);

					                		/*SeleniumServerLauncher r = new SeleniumServerLauncher( ServerPath , Port, CmdArgs);
					                		System.out.println("Launching...");
					                		r.launch();
					                		System.out.println("Done...");*/
					                       // settingsXML.close();
					                //###########For jre 1.6 #######################//  
					                     //  invokeserverpath = "\"" + invokeserverpath + "\"" + " " + arg + "";
					                     //  System.out.println("Printing server: "+invokeserverpath);
					                     //  Process myProcess = rt.exec(invokeserverpath);
					                       
						Thread.sleep(7000);	
						
						/*SeleniumServerLauncher r = new SeleniumServerLauncher( ServerPath , Port, CmdArgs);
                		System.out.println("Launching...");
                		try
                		{
                			r.launch();
                		}
                		catch(java.net.BindException ex )
                		{
                			//do nothing if selenium already running
                		}                	
                		System.out.println("Done...");*/
					}

				}				
			}		 


			Class.forName("org.sqlite.JDBC");
			conn = DriverManager.getConnection("jdbc:sqlite:" + executiondb);			    
			stat = conn.createStatement();

			//System.out.println("connection created");	

			while(true)
			{
				ExecuteKeyword();
				Thread.sleep(sleeptime);			    	 
			}      			   				     
		}

		catch (Exception e)
		{
			opvar="false";
			status="fail";
			message=e.getMessage();

			System.out.println("Exception 1: "+e.getMessage());
			e.printStackTrace();

			//write the result in database
			str = "update " + executiontab + " set Status=" + "'" + status + "'" +",Message="+"'"+ message +"'" +",Opvar="+"'"+ opvar +"'"
					+",OpkeyFlag='0' , CommandString='' , WantSnapShot='' , StepTimeOut='' where username=" + "'"  +  currentuser + "'";
			stat.executeUpdate(str);	

			str= "update " + executiontab + " set PluginFlag='1'  where username=" + "'"  +  currentuser + "'";
			stat.executeUpdate(str);			
		}
		finally
		{
			rs.close();
			conn.close();
		}
	}


	public static void ExecuteKeyword() throws SQLException
	{
		String str="select * from "+ executiontab +" where username='"+ currentuser + "';";
		try 
		{			 		
			conn = DriverManager.getConnection("jdbc:sqlite:" + executiondb);			    
			stat = conn.createStatement();			
			rs = stat.executeQuery(str);

			//			System.out.println("id = " + rs.getString("id"));
			//	  		System.out.println("user name = " + rs.getString("username"));
			//	        System.out.println("Opkey Flag = " + rs.getString("OpkeyFlag"));
			//	        System.out.println("Plugin Flag = " + rs.getString("PluginFlag"));

			if ((rs.getString("OpkeyFlag")).equals("1")  && (rs.getString("PluginFlag")).equals("0"))
			{

				commandstring = rs.getString("CommandString");				
				wantsnapshot = rs.getString("WantSnapshot");
				steptimeout = Long.parseLong(rs.getString("StepTimeOut"));
				message="";
				status="fail";
				opvar="";										

				System.out.println("Input xml: "+ commandstring);
				/*System.out.println(wantsnapshot);
				System.out.println(steptimeout);*/


				Document doc = loadXMLFromString(commandstring);			              
				NodeList nodes;

				//Get method name
				nodes = doc.getElementsByTagName("Opkey:Function");		             		              	                         	 
				Element n=(Element) nodes.item(0);  
				methodname = n.getAttribute("methodName");	                 	 

				//System.out.println("Method Name: "+methodname);

				boolean objexist = false;		              
				//Get Object Arguments node
				nodes = doc.getElementsByTagName("Opkey:ObjectArguments");		                         
				Node nobj = (Node) nodes.item(0);

				//Check the object existence	
				if (nodes.item(0).getChildNodes().getLength() != 0)
				{
					objexist = true;
					//Load the xml from the node 
					objectxml = getOuterXml(nobj);			             

					/*System.out.println("Object Exist: "+ objexist);
			              System.out.println("Object xml: "+ objectxml);*/
				}     	        		                

				//Get data arguments
				nodes = doc.getElementsByTagName("Opkey:DataArgument");

				//Create an object array for passing data
				Object passargs[];


				int arrlength = 0 ;
				int d = 0;

				//Get the length of data to be passed.
				if (objexist)
				{
					//increase the length by 1 to pass objectxml
					arrlength = (nodes.getLength()) + 1;
					passargs  = new Object[arrlength];

					//fill the objectxml at first position of object array
					passargs[0] = objectxml;
					d = 1;
				}  
				else		            	  
				{
					//length will the the number of data arguments
					arrlength = nodes.getLength();
					passargs  = new Object[arrlength];
					d = 0;
				}               		 

				//System.out.println("Data Length:"+nodes.getLength());

				//Fill the array with data arguments
				for(int i = 0; i<nodes.getLength(); i++,d++)
				{		            	 
					n=(Element) nodes.item(i);  		                 
					passargs[d]= getCharacterDataFromElement(n);	

					//System.out.println("Data: "+ passargs[d]);
				}		 							              

				//Load all user defined libraries
				GetFiles gf = new GetFiles();
				String[] userfiles = gf.listFiles(runtimelibpath);

				Class cls;				
				cls = Class.forName("SeleniumLib");		
				msg = null;
				methodfound = false;
				msg = ExecuteTaskWithTimeout(cls,passargs);

				//System.out.println("Default Selenium Lib inovked: "+ msg);

				if ((msg == null) && (methodfound == false))
				{
					System.out.println("Method not found in Selenium Lib");
					ArrayList classes = new ArrayList ();
					for(int f=0; f < userfiles.length; f++)
					{
						if (methodfound)
							break;
						String jarpath = runtimelibpath + userfiles[f];
						classes = JarLoader.LoadJarFile(jarpath);
						//System.out.println("Classes size: "+ classes.size());

						for(int c=0; c < classes.size(); c++)
						{
							cls=(Class) classes.get(c);							
							msg = ExecuteTaskWithTimeout(cls,passargs);
							if (methodfound)
								break;							
						}

					}
				}			


				if(msg == null)
				{
					opvar="false";
					status="fail";
					message = methodname+" returns no output.";
				}
				else
				{
					System.out.println("Found in SeleniumLib");
					System.out.println("Result xml: "+ msg);

					try
					{
						//Load result from xml
						doc = loadXMLFromString(msg.toString());
						nodes = doc.getElementsByTagName("Result");												
						n = (Element) nodes.item(0);
						opvar=getCharacterDataFromElement(n);
						opvar = opvar.replaceAll("'","''");
						//System.out.println("Returned opvar from xml: "+ opvar);
						nodes = doc.getElementsByTagName("Status");												
						n = (Element) nodes.item(0);
						status=getCharacterDataFromElement(n);								
						//System.out.println("Returned status from xml: "+ status);
						nodes = doc.getElementsByTagName("Message");
						n = (Element) nodes.item(0);
						message=getCharacterDataFromElement(n);	
						message = message.replaceAll("'","''");

						//System.out.println("Returned message from xml: "+ message);
					}
					catch(Exception e)
					{

						System.out.println("Exception result xml parsing: ");
						e.printStackTrace();
						message="Invalid xml returned from keyword: "+ methodname +" ,Returned message is: "+ msg.toString() +". Kindly provide keyword output in the following format: <KeywordOutput><Result>Output</Result><Status>true</Status><Message>Your message</Message></KeywordOutput> where Status can be true or false.";
						opvar="false";
						status="fail";								
					}							

				}						 			 			

				/*System.out.println("Opvar: "+ opvar);
						 System.out.println("Message: "+ message);*/

				/*if ((methodname.matches("(?i).*objectexists.*")) || (methodname.matches("(?i).*objectisenabled.*")) ||
								(methodname.matches("(?i).*textverification.*")) || (methodname.matches("(?i).*verifypopuptext.*")) ||
								(methodname.matches("(?i).*verifypropertyvalue.*")) || (methodname.matches("(?i).*verifylistitem.*")) ||
								(methodname.matches("(?i).*objectexistswithinobject.*")) || (methodname.matches("(?i).*objectexistswithintable.*")) || 
								(methodname.matches("(?i).*objectexistencedynamicwait.*")) || (methodname.matches("(?i).*checkfordialogbox.*")) || 
								(methodname.matches("(?i).*textverificationgivenpage.*")) || (methodname.matches("(?i).*objectisvisible.*")) || 
								(methodname.matches("(?i).*ischeckboxchecked.*")))											
						{
							status = "pass";
						}	
						else
						{*/
				if (status.equalsIgnoreCase("true"))
					status = "pass";								
				else
					status = "fail";
				//}		

				if (methodfound == false)
				{
					opvar="false";
					status="fail";
					message= methodname+" not found.";					 
				}


				//System.out.println("Method Found:" +methodfound);

				//write the result in database
				str = "update " + executiontab + " set Status=" + "'" + status + "'" +",Message="+"'"+ message +"'" +",Opvar="+"'"+ opvar +"'"
						+",OpkeyFlag='0' , CommandString='' , WantSnapShot='' , StepTimeOut='' where username=" + "'"  +  currentuser + "'";
				stat.executeUpdate(str);	

				str= "update " + executiontab + " set PluginFlag='1'  where username=" + "'"  +  currentuser + "'";
				stat.executeUpdate(str);					
			}						
		} 
		catch (Exception e)
		{

			opvar="false";
			status="fail";
			message=e.getMessage();	

			System.out.println("Exception 2: ");
			e.printStackTrace();

			//write the result in database
			str = "update " + executiontab + " set Status=" + "'" + status + "'" +",Message="+"'"+ message +"'" +",Opvar="+"'"+ opvar +"'"
					+",OpkeyFlag='0' , CommandString='' , WantSnapShot='' , StepTimeOut='' where username=" + "'"  +  currentuser + "'";
			stat.executeUpdate(str);	

			str= "update " + executiontab + " set PluginFlag='1'  where username=" + "'"  +  currentuser + "'";
			stat.executeUpdate(str);
		}		
		finally
		{
			rs.close();
			conn.close();
		}
	}


	//Execute the task and interrupts if task is not completed before timeout.
	public static Object ExecuteTaskWithTimeout(final Class cls,final Object passargs[]) 
	{		
		msg = null;
		// assuming no return value required
		FutureTask<?> theTask = null;
		try {
			// create new task
			theTask = new FutureTask<Object>(new Runnable() {
				public void run() {
					// do the method invocation
					try 
					{
						msg = InvokeMethod(cls,passargs);
						System.out.println("ExecuteTaskWithTimeout" + msg);
					} 
					catch (InterruptedException e) 
					{
						System.out.println("Thread interrupted exception thrown: "+ e.getMessage());
						e.printStackTrace();
						opvar="false";
						status="fail";
						message= "Step timed out after "+ steptimeout +" seconds.";
					}
				}
			}, null);

			// start task in a new thread
			new Thread(theTask).start();

			// wait for the execution to finish, timeout after n secs 
			theTask.get(steptimeout, TimeUnit.SECONDS);		    
		}

		catch (TimeoutException e) {
			// handle timeout
			System.out.println("Timeout exception thrown: "+ e.getMessage());
			e.printStackTrace();
			theTask.cancel(true);			 
		} 		
		catch (Exception e)
		{		
			opvar="false";
			status="fail";
			message=e.getMessage();
			System.out.println("Exception 3: ");
			e.printStackTrace();
		}
		return msg;	
	}


	//Invokes a method in the class through reflection.
	public static Object InvokeMethod(Class cls,Object passargs[]) throws InterruptedException
	{
		msg=null;
		System.out.println("InvokeMethod");
		try
		{
			Object t = cls.newInstance(); 
			Method methlist[]= cls.getDeclaredMethods();		
			System.out.println("Methods length:"+methlist.length);	

			if(methodname.equals("Method_WebBrowserOpen"))
			{

				for (int i = 0; i < methlist.length; i++)
				{  
					Method m = methlist[i];
					if (m.getName().equals("Setup"))
					{
						m.setAccessible(true);		
						System.out.println("Calling Setup method.");
						String steptimeout1;
						steptimeout1=""+steptimeout;
						m.invoke(t,Host,Port,steptimeout1);
												
						System.out.println("Invoked under step");
					}
				}					
			}

			for (int i = 0; i < methlist.length; i++)
			{  
				Method m = methlist[i];				
				//System.out.println("name = " + m.getName());
				if (m.getName().equals(methodname))
				{

					methodfound = true;
					m.setAccessible(true);		
					//execute the method
					msg = m.invoke(t,passargs);		
				}
			}	
		}
		catch(Exception e)
		{
			opvar="false";
			status="fail";
			message=e.getMessage();
			System.out.println("Exception 4: ");
			e.printStackTrace();
		}
		
		return msg;
	}

	//Returns the xml document from the xml string passed 
	public static Document loadXMLFromString(String xml) throws Exception
	{
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = factory.newDocumentBuilder();
		InputSource is = new InputSource(new StringReader(xml));
		return builder.parse(is);
	}


	//Returns the data or cdata of an xml element
	public static String getCharacterDataFromElement(Element e) throws Exception
	{
		Node child = e.getFirstChild();
		if (child instanceof CharacterData) {
			CharacterData cd = (CharacterData) child;
			return cd.getData();
		}
		return "";
	}

	//Returns the tag value the xml element and tag passed
	public static String getTagValue(String sTag, Element eElement) throws Exception
	{		
		NodeList nlList = eElement.getElementsByTagName(sTag).item(0).getChildNodes();
		Node nValue = (Node) nlList.item(0);
		if (nValue == null)			
			return "";			
		else
			return nValue.getNodeValue(); 		
	}


	//Returns the xml string of an xml node
	public static String getOuterXml(Node node)
			throws TransformerConfigurationException, TransformerException
			{
		Transformer transformer = TransformerFactory.newInstance().newTransformer();
		transformer.setOutputProperty("omit-xml-declaration", "yes");

		StringWriter writer = new StringWriter();
		transformer.transform(new DOMSource(node), new StreamResult(writer));
		return writer.toString();         
			}

}
