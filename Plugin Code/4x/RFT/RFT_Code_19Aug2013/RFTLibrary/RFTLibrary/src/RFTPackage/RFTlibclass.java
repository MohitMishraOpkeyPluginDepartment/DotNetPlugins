package RFTPackage;
import java.awt.Color;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.Toolkit;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.DataFlavor;
import java.awt.datatransfer.Transferable;
import java.awt.datatransfer.UnsupportedFlavorException;
import java.awt.image.BufferedImage;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringReader;

import javax.imageio.ImageIO;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;

import org.w3c.dom.CharacterData;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import com.rational.test.ft.PropertyNotFoundException;
import com.rational.test.ft.object.interfaces.BrowserTestObject;
import com.rational.test.ft.object.interfaces.GuiTestObject;
import com.rational.test.ft.object.interfaces.IText;
import com.rational.test.ft.object.interfaces.IWindow;
import com.rational.test.ft.object.interfaces.RootTestObject;
import com.rational.test.ft.object.interfaces.SelectGuiSubitemTestObject;
import com.rational.test.ft.object.interfaces.StatelessGuiSubitemTestObject;
import com.rational.test.ft.object.interfaces.TestObject;
import com.rational.test.ft.object.interfaces.TextGuiTestObject;
import com.rational.test.ft.object.interfaces.ToggleGUITestObject;
import com.rational.test.ft.object.interfaces.TopLevelTestObject;
import com.rational.test.ft.script.Property;
import com.rational.test.ft.script.RationalTestScript;
import com.rational.test.ft.script.State;
import com.rational.test.ft.sys.graphical.Highlighter;
import com.rational.test.ft.ui.Highlight;
import com.rational.test.ft.value.RegularExpression;
import com.rational.test.ft.vp.ITestDataElement;
import com.rational.test.ft.vp.ITestDataElementList;
import com.rational.test.ft.vp.ITestDataList;
import com.rational.test.ft.vp.ITestDataTable;

public class RFTlibclass extends RationalTestScript

{
	public java.lang.String message=" "; 

	//==================================================================================================

	public java.lang.String Method_WebBrowserOpen(java.lang.String Browser, java.lang.String URL) 
	{
		java.lang.String ret_mess, mess;
		Boolean opvar;
		try 
		{
			startBrowser(Browser,URL);
			sleep(8);
			opvar=true;
			mess="Web Browser is Open";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch(Exception e)
		{
			mess=e.getMessage();
			opvar=false;
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================	

	public java.lang.String Method_CloseAllBrowsers()
	{
		boolean opvar;
		java.lang.String mess, ret_mess;

		try
		{	
			TestObject[] browsers = getRootTestObject().find(atChild(".class", "Html.HtmlBrowser")); 
			for (TestObject browser:browsers) 
			{
				((BrowserTestObject) browser).close();
			}
			unregister(browsers); 
			opvar=true;
			mess="All Browser Closed" ;
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";

		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}		
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}		


	//==================================================================================================		

	public java.lang.String Method_typeTextOnEditBox(java.lang.String object, java.lang.String textboxtext) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];
			tgui.setText(textboxtext);
			setmessage("text is set");		
			opvar=true;
			mess="Text is Set";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================	

	public java.lang.String Method_selectDropDownItemAtIndex(java.lang.String object, java.lang.String Index) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (SelectGuiSubitemTestObject) test[0];
			tgui.select(Integer.parseInt(Index));
			opvar=true;
			mess="Dropdown Item is selected";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}	

	//==================================================================================================	

	public java.lang.String Method_selectDropDownItem(java.lang.String object, java.lang.String selectvalue) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (SelectGuiSubitemTestObject) test[0];
			tgui.select(selectvalue);
			opvar=true;
			mess="Dropdown Item is selected";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}
	//==================================================================================================	

	public java.lang.String Method_ObjectClick(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];
			tgui.waitForExistence();
			tgui.click();
			setmessage("Object is Clicked");		
			opvar=true;
			mess="Object is Clicked";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}	


	//==================================================================================================	

	public java.lang.String Method_wait(java.lang.String timeout) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		double timeout1;
		timeout1 = Double.parseDouble(timeout);
		try
		{		
			sleep(timeout1);		
			opvar=true;
			mess="Static Wait time "+ timeout;
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}		
	//==================================================================================================	

	public java.lang.String Method_selectCheckBox(java.lang.String object, java.lang.String textboxtext) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];
			tgui.click();	
			opvar=true;
			mess="CheckBox has been checked";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}



	//==================================================================================================	

	public java.lang.String Method_SelectRadio(java.lang.String object, java.lang.String selectvalue) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];
			tgui.click();	
			opvar=true;
			mess="Radio Button is Clicked";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}
	//=============================================================================================
	public java.lang.String Method_CloseBrowser(String BrowserTitle) 
	{
		boolean opvar;
		int flag=0;
		java.lang.String mess,ret_mess = null;

		try
		{	
			IWindow[] wins = getTopWindows();
			for (int n = 0; n < wins.length; ++n) 
			{
				if (wins[n].getWindowClassName().equals("IEFrame") || wins[n].getWindowClassName().equals("MozillaUIWindowClass") || wins[n].getWindowClassName().equals("MozillaWindowClass")) 
				{
					if (wins[n].getText().toLowerCase().contains(BrowserTitle.toLowerCase()) )
						wins[n].close();
					flag=1;
					break;
				}
			}
			if(flag==1)
			{	
				opvar=true;
				mess="Browser Window is Closed";
			}
			else
			{
				opvar=false;
				mess="Browser Window is Not Closed";	
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";

		}

		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Browser Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}
	//===============================================================================================

	//==================================================================================================	

	public java.lang.String Method_closeSelectedWindow(String WindowTitle) 
	{
		boolean opvar; 
		int flag=0;
		java.lang.String mess,ret_mess;

		try
		{		
			IWindow[] wins = getTopWindows();
			for (int n = 0; n < wins.length; ++n) {
				if (wins[n].getWindowClassName().equals("IEFrame") || wins[n].getWindowClassName().equals("MozillaUIWindowClass") || wins[n].getWindowClassName().equals("MozillaWindowClass")) 
				{
					if (wins[n].getText().toLowerCase().contains(WindowTitle.toLowerCase()) )
						wins[n].close();
					flag=1;
					break;
				}
			}		
			if(flag==1)
			{	
				opvar=true;
				mess="Browser Window is Closed";
			}
			else
			{
				opvar=false;
				mess="Browser Window is Not Closed";	
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";

		}

		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Browser Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}	

	//==================================================================================================	

	public java.lang.String Method_selectWindow(String WindowTitle) 
	{
		boolean opvar;  
		int flag=0;
		java.lang.String mess,ret_mess;

		try
		{		
			IWindow[] wins = getTopWindows();
			for (int n = 0; n < wins.length; ++n) {
				if (wins[n].getWindowClassName().equals("IEFrame") || wins[n].getWindowClassName().equals("MozillaUIWindowClass")|| wins[n].getWindowClassName().equals("MozillaWindowClass")) 
				{
					if (wins[n].getText().toLowerCase().contains(WindowTitle.toLowerCase()) )
						wins[n].activate();
					flag=1;
					break;
				}
			}		
			if(flag==1)
			{	
				opvar=true;
				mess="Browser Window is Activated";
			}
			else
			{
				opvar=false;
				mess="Browser Window is Not Activated";	
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";

		}

		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Browser Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}
	//==================================================================================================	

	public java.lang.String Method_setFocusOnWindow(String WindowTitle) 
	{
		boolean opvar;  
		int flag=0;
		java.lang.String mess,ret_mess;

		try
		{		
			IWindow[] wins = getTopWindows();
			for (int n = 0; n < wins.length; ++n) {
				if (wins[n].getWindowClassName().equals("IEFrame") || wins[n].getWindowClassName().equals("MozillaUIWindowClass")|| wins[n].getWindowClassName().equals("MozillaWindowClass")) 
				{
					if (wins[n].getText().toLowerCase().contains(WindowTitle.toLowerCase()) )
						wins[n].activate();
					flag=1;
					break;
				}
			}		
			if(flag==1)
			{	
				opvar=true;
				mess="Browser Window is Selected";
			}
			else
			{
				opvar=false;
				mess="Browser Window is Not Selected";	
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";

		}

		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Browser Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================	

	public java.lang.String Method_fetchBrowserTitle() 
	{
		boolean opvar;  
		int flag=0;
		java.lang.String broTitle;
		java.lang.String mess,ret_mess;
		broTitle = "";
		try
		{		
			IWindow[] wins = getTopWindows();
			for (int n = 0; n < wins.length; ++n) 
			{
				if (wins[n].getWindowClassName().equals("IEFrame") || wins[n].getWindowClassName().equals("MozillaUIWindowClass")|| wins[n].getWindowClassName().equals("MozillaWindowClass")) 
				{
					broTitle = wins[n].getText();					
					flag=1;
				}
			}	
			if(flag==1)
			{	
				opvar=true;
				mess="Browser Title is Fetched";
			}
			else
			{
				opvar=false;
				mess="Browser Title is Not Fetched";	
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+broTitle+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";

		}

		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Browser Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}

		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}	

	//==================================================================================================	

	/*public java.lang.String Method_GetAllTitles() 
		{
			boolean opvar;  
			java.lang.String broTitle;
			java.lang.String mess,ret_mess;
			String titles[] = new String[6];
			int k=0;

			try
			{	
				RootTestObject rtoRoot = getRootTestObject();
				TestObject[] toTestObj;
				BrowserTestObject btoBrowser; 
				toTestObj  = rtoRoot.find(atDescendant(".class", "Html.HtmlBrowser"));

				for (int bCount=0; bCount<toTestObj.length; bCount++)
				{
				btoBrowser = new BrowserTestObject(toTestObj[bCount]);
				TestObject[] to = btoBrowser.find(atDescendant(".class", "Html.HtmlDocument"));

				for (int iCount=0; iCount<to.length; iCount++)
				{
					titles[k] = to[iCount].getProperty(".title").toString();
					k++;
				}
				}
				System.out.println("Number of HTMLDoc:  " + to.length);
				GuiTestObject gtoHTMLDoc=(GuiTestObject) to[1];
				System.out.println(gtoHTMLDoc.getProperty(".title").toString());//setProperty(".url", "www.google.com");


				IWindow[] wins = getTopWindows();
				for (int n = 0; n < wins.length; ++n) 
				{
					System.out.println(wins[n].getWindowClassName());
					if (wins[n].getWindowClassName().equals("IEFrame") || wins[n].getWindowClassName().equals("MozillaUIWindowClass")) 
					{
						titles[k] = wins[n].getText();					
						k++; 
					}
				}

				broTitle = titles[0];

				for(int j=1; j<k; j++)
	    		{
					broTitle = broTitle+";"+titles[j];

	    		}

				opvar=true;
				mess="Browser Title is Fetched";
				ret_mess="<KeywordOutput><Result><![CDATA["+broTitle+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
			}
			catch (Exception e)
			{
			    opvar=false;
			    mess=e.getMessage();
			    ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
			}
			return ret_mess;
		}*/	


	public java.lang.String Method_GetAllTitles() 
	{
		boolean opvar= false;  
		java.lang.String broTitle = "";
		java.lang.String mess = "",ret_mess;
		String titles[] = new String[15];
		int k=0;

		try
		{	
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			BrowserTestObject btoBrowser; 
			toTestObj  = rtoRoot.find(atDescendant(".class", "Html.HtmlBrowser"));				
			if (toTestObj.length != 0)
			{
				for (int bCount=0; bCount<toTestObj.length; bCount++)
				{
					btoBrowser = new BrowserTestObject(toTestObj[bCount]);
					TestObject[] to = btoBrowser.find(atDescendant(".class", "Html.HtmlDocument"));
					for (int iCount=0; iCount<to.length; iCount++)
					{
						titles[k] = to[iCount].getProperty(".title").toString();
						k++;
					}
					opvar=true;
					mess="Browser Title is Fetched";
				}

				broTitle = titles[0];

				for(int j=1; j<k; j++)
				{
					broTitle = broTitle+";"+titles[j];	
				}
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+broTitle+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}



	//==================================================================================================	

	public java.lang.String Method_MaximizeBrowser() 
	{
		boolean opvar;  
		int flag=0;
		java.lang.String mess,ret_mess;

		try
		{		
			IWindow[] wins = getTopWindows();
			for (int n = 0; n < wins.length; ++n) 
			{
				if (wins[n].getWindowClassName().equals("IEFrame") || wins[n].getWindowClassName().equals("MozillaUIWindowClass") || wins[n].getWindowClassName().equals("MozillaWindowClass")) 
				{
					wins[n].maximize();
					flag=1;
					break;
				}
			}		

			if(flag==1)
			{	
				opvar=true;
				mess="Browser Window is Maximized";
			}
			else
			{
				opvar=false;
				mess="Browser Window is Not Maximized";	
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";

		}

		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Browser Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}	
	//==================================================================================================	

	public java.lang.String Method_syncBrowser() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;

		try
		{		
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			BrowserTestObject btoBrowser;
			toTestObj = rtoRoot.find(atDescendant(".class", "Html.HtmlBrowser"));
			btoBrowser = new BrowserTestObject(toTestObj[0]);
			while (Integer.parseInt(btoBrowser.getProperty(".readyState").toString()) < 4) 
			{	
				sleep(3);	
				System.out.println("Loading in Progress");
			}

			opvar=true;
			mess="Browser Window is sync";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Browser Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}	
	//==================================================================================================	
	public java.lang.String Method_selectDropDownItemAndWait(java.lang.String object, java.lang.String selectvalue,java.lang.String wait_tme) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		double wait_tme1;
		wait_tme1 = Double.parseDouble(wait_tme);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (SelectGuiSubitemTestObject) test[0];
			tgui.select(selectvalue);
			sleep(wait_tme1);	
			opvar=true;
			mess="Item is selected and wait for time " + wait_tme1;
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}
	//==================================================================================================			

	public java.lang.String Method_getDropDownItemCount(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);

		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (SelectGuiSubitemTestObject) test[0];
			ITestDataList dataList = (ITestDataList)tgui.getTestData("list"); //  
			ITestDataElementList elementList = (ITestDataElementList)dataList.getElements();
			int x=elementList.getLength();		
			opvar=true;
			mess="Item Count is "+x;
			ret_mess="<KeywordOutput><Result><![CDATA["+x+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}
	//==================================================================================================

	public java.lang.String Method_verifyDropDownItemCount(java.lang.String object,java.lang.String expectedItemCount) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (SelectGuiSubitemTestObject) test[0];
			ITestDataList dataList = (ITestDataList)tgui.getTestData("list");   
			ITestDataElementList elementList = (ITestDataElementList)dataList.getElements();
			String Str2=elementList.getElement(1).getElement().toString();
			int x=elementList.getLength();
			int i = Integer.parseInt(expectedItemCount);
			if(x==i)
			{
				opvar=true;
				mess="ItemCount is Verified";					
			}
			else
			{
				opvar=false;
				mess="ItemCount is not Verified";	
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==================================================================================================

	public java.lang.String Method_verifyDropDownItemExists(java.lang.String object,java.lang.String ExpectedItem) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess,Str2 = null;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (SelectGuiSubitemTestObject) test[0];
			ITestDataList dataList = (ITestDataList)tgui.getTestData("list");
			ITestDataElementList elementList = (ITestDataElementList)dataList.getElements();
			int x=elementList.getLength();
			for(int i=0;i<=x-1;i++)
			{
				Str2=elementList.getElement(i).getElement().toString();
				if(Str2.equals(ExpectedItem))
				{
					break;
				}

			}
			if(Str2.equals(ExpectedItem))
			{
				opvar=true;
				mess="item Exist"; 
			}
			else
			{
				opvar=false;
				mess="item does not Exist";  
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}



	//==================================================================================================

	public java.lang.String Method_getSelectedDropDownItem(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (SelectGuiSubitemTestObject) test[0];
			String x= tgui.getSelectedText();
			opvar=true;
			mess="Item is selected";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_verifyDropDownSelection(java.lang.String object,java.lang.String expectedValues) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (SelectGuiSubitemTestObject) test[0];
			java.lang.String x= tgui.getSelectedText();
			if(x.equals(expectedValues))
			{
				opvar=true;
				mess="Dropdown Selection is Verified";
			}	
			else
			{
				opvar=false;
				mess="Dropdown Selection is not Verified";
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_VerifyDropDownEnabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (SelectGuiSubitemTestObject) test[0];

			boolean opvar1 = tgui.isEnabled();
			if(opvar1==true)
			{
				opvar=true;
				mess="Item is enabled";
			}
			else
			{
				opvar=false;
				mess="Item is disabled";
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_VerifyDropDownDisabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (SelectGuiSubitemTestObject) test[0];
			boolean opvar1 = tgui.isEnabled();
			if(opvar1==false)
			{
				opvar=true;
				mess="Item is disabled";
			}
			else
			{
				opvar=false;
				mess="Item is not disabled";
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==================================================================================================

	public java.lang.String Method_verifyDropDownExist(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (SelectGuiSubitemTestObject) test[0];
			boolean opvar1 = tgui.exists();
			if(opvar1==true)
			{
				opvar=true;
				mess="Item is exist";
			}
			else
			{
				opvar=false;
				mess="Item does not exist";
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar1+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}

		return ret_mess;
	}

	//==================================================================================================

	public String Method_addxmlparameter(String xmlString,String type,String value,String regexp)
	{
		boolean opvar;
		String mess,ret_mess;
		try
		{

			/*String x[]=xmlString.split("<Opkey:ChildObject>");
				String y[]=x[1].split("<Opkey:Properties>");
				y[1]="<Opkey:Property name="+'"'+type+'"'+" regularExpression="+'"'+regexp+'"'+">"+value+"</Opkey:Property>"+y[1];
				xmlString=x[0]+"<Opkey:ChildObject>"+y[0]+"<Opkey:Properties>"+y[1];*/
			String newxml="<Opkey:Property name="+'"'+type+'"'+" regularExpression="+'"'+regexp+'"'+">"+value+"</Opkey:Property>";
			String x[]=xmlString.split("<Opkey:ChildObject>");
			if(x[1].contains("<Opkey:Properties>"))
			{
				String y[]=x[1].split("<Opkey:Properties>");
				String concat="";
				if(y[1].contains("name="+'"'+type+'"'))
				{
					System.out.println("inside this");
					String y1[]=y[1].split("</Opkey:Properties>");
					String y2[]=y1[0].split("<Opkey:Property");
					for(int i=1;i<y2.length;i++)
					{
						if(y2[i].contains("name="+'"'+type+'"'))
						{
							y2[i]=newxml;
						}
						else
						{
							System.out.println("y2"+i+"  "+y2[i]);
							y2[i]="<Opkey:Property"+y2[i];
						}
						concat=concat+y2[i];
					}

					xmlString=x[0]+"<Opkey:ChildObject>"+y[0]+"<Opkey:Properties>"+concat+"</Opkey:Properties>"+y1[1];

				}	
				else
				{
					y[1]=newxml+y[1];
					xmlString=x[0]+"<Opkey:ChildObject>"+y[0]+"<Opkey:Properties>"+y[1];
				}
			}
			else
			{
				String q[]=x[1].split("</Opkey:Properties />");
				xmlString=x[0]+"<Opkey:ChildObject>"+q[0]+"<Opkey:Properties>"+newxml+"</Opkey:Properties>"+q[1];
				System.out.println("hello"+xmlString);

			}
			System.out.println(xmlString);
			opvar=true;
			mess="New parameter is added";
			ret_mess="<KeywordOutput><Result><![CDATA["+xmlString+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";

		}
		catch(Exception e)
		{
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	public java.lang.String Method_verifyMultipleDropDownItemExist(java.lang.String object,java.lang.String ExpectedItem) 
	{
		boolean opvar = false;  
		int Count1=0;
		java.lang.String mess = null,ret_mess,Str2 = null;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (SelectGuiSubitemTestObject) test[0];
			ITestDataList dataList = (ITestDataList)tgui.getTestData("list");  
			ITestDataElementList elementList = (ITestDataElementList)dataList.getElements();
			int x=elementList.getLength();
			String[] ExpectedItem1=ExpectedItem.split(";");
			int length1=ExpectedItem1.length;
			int flag=0;
			for(int j=0;j<length1;j++)
			{
				java.lang.String str1=ExpectedItem1[j]; 
				for(int i=0;i<=x-1;i++)
				{
					Str2=elementList.getElement(i).getElement().toString();
					if(str1.equals(Str2))
					{
						opvar=true;
						mess="Multiple Dropdown Item Exist"; 
						flag=1;
						break;
					}
				}	 
				if(flag==0)
				{
					opvar=false;
					mess="Multiple Dropdown item does not exist";
					break;
				}
				flag=0;
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_verifyAllDropDownItemExist(java.lang.String object,java.lang.String ExpectedItem) 
	{
		boolean opvar;  
		int Count1=0;
		java.lang.String mess,ret_mess,Str2 = null;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (SelectGuiSubitemTestObject) test[0];
			ITestDataList dataList = (ITestDataList)tgui.getTestData("list");  
			ITestDataElementList elementList = (ITestDataElementList)dataList.getElements();
			int x=elementList.getLength();
			String[] ExpectedItem1=ExpectedItem.split(";");
			int length1=ExpectedItem1.length;

			for(int i=0;i<=x-1;i++)
			{
				Str2=elementList.getElement(i).getElement().toString();
				java.lang.String str1=ExpectedItem1[i];
				if(Str2.equals(str1))
				{
					Count1=Count1+1;
				}

			}
			if(length1==Count1)
			{
				opvar=true;
				mess="All Dropdown Item Exist"; 
			}
			else
			{
				opvar=false;
				mess="All Dropdown item doesnt exist";  
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}

		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_verifyAllDropDownItems(java.lang.String object,java.lang.String ExpectedItem) 
	{
		boolean opvar;  
		int Count1=0;
		java.lang.String mess,ret_mess,Str2 = null;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (SelectGuiSubitemTestObject) test[0];
			ITestDataList dataList = (ITestDataList)tgui.getTestData("list"); 
			ITestDataElementList elementList = (ITestDataElementList)dataList.getElements();
			int x=elementList.getLength();
			String[] ExpectedItem1=ExpectedItem.split(";");
			int length1=ExpectedItem1.length;

			for(int i=0;i<=x-1;i++)
			{
				Str2=elementList.getElement(i).getElement().toString();
				java.lang.String str1=ExpectedItem1[i];
				if(Str2.equals(str1))
				{
					Count1=Count1+1;
				}

			}
			if(length1==Count1)
			{
				opvar=true;
				mess="All Dropdown Items Verified"; 
			}
			else
			{
				opvar=false;
				mess="All Dropdown items not Verified";  
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_selectMultipleDropDownItem(java.lang.String object,java.lang.String selectvalue) 
	{
		boolean opvar;  
		String item[];
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		item = selectvalue.split(";");		

		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));						
			tgui = (SelectGuiSubitemTestObject) test[0];

			if(item.length == 1){
				tgui.click(atText(item[0]));
			}
			else{
				tgui.click(atText(item[0]));
				for(int i=1;i<item.length;i++){
					tgui.click(CTRL_LEFT, atText(item[i]));
				}
			}		

			opvar=true;
			mess="Multiple DropDown items are selected";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_selectMultipleDropDownItemAndWait(java.lang.String object,java.lang.String selectvalue,java.lang.String tim) 
	{
		boolean opvar;  
		String item[];
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		item = selectvalue.split(";");		

		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));						
			tgui = (SelectGuiSubitemTestObject) test[0];

			if(item.length == 1){
				tgui.click(atText(item[0]));
			}
			else{
				tgui.click(atText(item[0]));
				for(int i=1;i<item.length;i++){
					tgui.click(CTRL_LEFT, atText(item[i]));
				}
			}		

			double timeout1;
			timeout1 = Double.parseDouble(tim);
			sleep(timeout1);

			opvar=true;
			mess="Multiple DropDown items are selected";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}		
	//==================================================================================================

	public java.lang.String Method_getPropertyValue(java.lang.String object,java.lang.String P_Name) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			test = bt.find(atDescendant(objectProp));
			Object obj = test[0].getProperty("."+P_Name);	
			java.lang.String abc1=obj.toString();

			opvar=true;
			mess="Property Value is fetched :" + abc1;
			ret_mess="<KeywordOutput><Result><![CDATA["+abc1+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}

		return ret_mess;
	}

	//==================================================================================================

	public static String Method_getValueExcelSheet(String path,String columnname,String rowno)
	{
		boolean opvar = false;
		String ret_mess,mess="",opvars;
		int col_locstr=0;
		try{ 
			Workbook workbook = Workbook.getWorkbook(new File(path));
			Sheet sheet = workbook.getSheet(0);
			int	col_count = sheet.getColumns();
			for(int h = 0;h<=col_count;h++){
				Cell a1 = sheet.getCell(h,0); 
				String colval = a1.getContents();
				boolean x =   colval.equalsIgnoreCase(columnname);
				if(x == true){
					int  col_loc = h;
					col_locstr =col_loc;
					h = col_count;
				}
			}
			int rowno1=Integer.parseInt(rowno);
			int rowno2 = rowno1 -1;
			Cell a1 = sheet.getCell(col_locstr,rowno2); 
			String val = a1.getContents();
			opvars=val;
			opvar = true;
			mess = "Get the value from excel sheet is successfully";

			ret_mess="<KeywordOutput><Result><![CDATA["+val+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";

		}

		catch(Exception e)
		{
			opvar = false;
			mess = e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
			e.printStackTrace();
		}
		return ret_mess;

	}

	//==================================================================================================

	public static String Method_GetValueFromExcelFileUsingColumnNumber(String path,String columnnumber,String rowno){
		boolean opvar = false;
		String ret_mess,mess="",opvars;
		int col_locstr=0;
		try{
			int colno=Integer.parseInt(columnnumber);
			int rowno1=Integer.parseInt(rowno);
			Workbook workbook = Workbook.getWorkbook(new File(path));	
			Sheet sheet = workbook.getSheet(0);
			int	col_count = sheet.getColumns();
			colno = colno -1;
			rowno1 = rowno1 -1;							
			Cell a1 = sheet.getCell(colno,rowno1); 
			String val = a1.getContents();
			opvars=val;
			opvar = true;
			mess = "Get the value from excel sheet is successfully";

			ret_mess="<KeywordOutput><Result><![CDATA["+opvars+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}

		catch(Exception e)
		{
			opvar = false;
			mess = e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
			e.printStackTrace();
		}
		return ret_mess;
	} 

	//==================================================================================================

	public java.lang.String Method_typeTextInTextArea(java.lang.String object, java.lang.String textAreatext) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];
			tgui.setText(textAreatext);

			opvar=true;
			mess="Text is Set";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_GetTextfromTextArea(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];									
			String txt= tgui.getText();

			opvar=true;			
			mess = "Text is get";
			ret_mess="<KeywordOutput><Result><![CDATA["+txt+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_getSelectedRadioButtonFromGroup(java.lang.String object, java.lang.String F_index) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		int retval = 0;
		mess  ="no radio button is selected";
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));

			for (int i=0;i <test.length;i++){
				tgui = (ToggleGUITestObject) test[i];
				if(tgui.getState().toString().equalsIgnoreCase("SELECTED")){
					mess = "radio button at Index "+i+" is selected";
					retval = i;
					break;					
				}
			}		

			opvar=true;			
			ret_mess="<KeywordOutput><Result><![CDATA["+retval+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_verifyCheckBoxStatus(java.lang.String object,java.lang.String dvalue) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];
			State sts = tgui.getState();
			//opvar=true;
			//mess = sts.toString();
			boolean result = sts.isSelected();
			if(result)
			{
				if(dvalue.equalsIgnoreCase("true"))
				{
					opvar =true;
					mess="Status is Verified";
				}
				else
				{
					opvar =false;
					mess="Status is Not Verified";
				}
			}
			else
			{
				if(dvalue.equalsIgnoreCase("true"))
				{
					opvar =false;
					mess="Status is Not Verified";
				}
				else
				{
					opvar =true;
					mess="Status is Verified";
				}
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+sts.toString()+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_deSelectCheckBox(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];
			tgui.deselect();					
			opvar=true;
			mess="deSelected";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_verifyEditBoxEditable(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);		
		try {
			RootTestObject bt = getRootTestObject();

			TestObject[] test = bt.find(atDescendant(objectProp));
			Object obj = test[0].getProperty("." + "readOnly");
			if(obj.toString().equalsIgnoreCase("false"))
			{
				mess = "Object is Editable";
				opvar = true;
			}
			else
			{
				mess = "Object is NonEditable";
				opvar = false;
			}
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (PropertyNotFoundException e)
		{
			mess = "Object is Editable";
			opvar = true;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_verifyeditboxtext(java.lang.String object, java.lang.String expectedText) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];									
			String txt= tgui.getText();
			if(txt.equalsIgnoreCase(expectedText))
			{
				mess = "Editbox text Verified";
				opvar=true;			
			}
			else
			{
				mess = "Editbox text not verified";
				opvar=false;			
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_getTextFromEditBox(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];									
			String txt= tgui.getText();
			opvar=true;			
			mess = "Text is get";
			ret_mess="<KeywordOutput><Result><![CDATA["+txt+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_GetObjectText(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			IText tgui;

			test = bt.find(atDescendant(objectProp));
			tgui = (IText) test[0];			
			String txt= tgui.getText();	
			opvar=true;			
			mess = "Text is get";
			ret_mess="<KeywordOutput><Result><![CDATA["+txt+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_waitForObjectProperty(java.lang.String object, java.lang.String p_name, java.lang.String p_value, java.lang.String tme) 
	{
		boolean opvar=false;  
		java.lang.String mess="",ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;


			int time=Integer.parseInt(tme);
			for(int i=0;i<time;i++)
			{
				try
				{
					test = bt.find(atDescendant(objectProp));
					Object obj = test[0].getProperty("."+p_name);	
					obj.toString().equalsIgnoreCase(p_value);
					if (test[0].getProperty("." + p_name).toString().equalsIgnoreCase(p_value)) {
						mess = "found Object with desired property";
						opvar=true;
						break;
					}
					else {

						opvar=false;
						mess = "not found Object with desired property";
					}
				}
				catch (ArrayIndexOutOfBoundsException e)
				{
					mess = "Object Not Found";
					opvar =false;
					// ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
				}

				Thread.sleep(1000L);
			}			
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess = "Object Not Found";
			opvar =false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//===================================Yogesh===============================================================
	public java.lang.String Method_VerifyPropertyValue(java.lang.String object, java.lang.String p_name, java.lang.String p_value) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			test = bt.find(atDescendant(objectProp));
			Object obj = test[0].getProperty("."+p_name);	
			obj.toString().equalsIgnoreCase(p_value);
			if(test[0].getProperty("."+p_name).toString().equalsIgnoreCase(p_value)){
				mess = "Verified";
				opvar=true;	
			}
			else{
				mess = "Not Verified";
				opvar=false;	
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_ObjectTextVerification(java.lang.String object, java.lang.String text) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			IText tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (IText) test[0];			
			String s= tgui.getText();
			if(s.equalsIgnoreCase(text))
			{
				mess = "verified";
				opvar=true;
			}
			else{
				mess = "not Verified";
				opvar=true;
			}	
			//mess = "clicked";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_waitforObject(java.lang.String object, java.lang.String tme) 
	{
		boolean opvar=false;  
		java.lang.String mess="",ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;

			int time=Integer.parseInt(tme);
			for(int i=0;i<time;i++)
			{
				try
				{
					test = bt.find(atDescendant(objectProp));			
					tgui = (GuiTestObject) test[0];
					if(tgui.exists())
					{
						mess = "Object Found";
						opvar=true;
						break;
					}
					else
					{
						mess = "Object not Found";
						opvar=false;
					}
				}
				catch (ArrayIndexOutOfBoundsException e)
				{
					opvar=false;
					mess="Object is Not Found";
					//ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
				}

				sleep(1);
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==================================================================================================

	public java.lang.String Method_dblClick(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];
			tgui.doubleClick();	
			opvar=true;			
			mess = "Double clicked";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==================================================================================================

	public java.lang.String Method_verifyObjectVisible(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];			
			if(tgui.ensureObjectIsVisible()){
				mess="Visible";
				opvar=true;
			}
			else
			{
				mess="not Visible";
				opvar=false;
			}		
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==================================================================================================


	public java.lang.String Method_ObjectisEnabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];			
			if(tgui.isEnabled()){
				mess="Enabled";
			}
			else{
				mess="not Enabled";
			}				
			opvar=true;
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==================================================================================================

	public java.lang.String Method_ObjectExists(java.lang.String object) 
	{
		boolean opvar,opvar1;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];		
			opvar1=tgui.exists();
			if(tgui.exists()){
				mess="Exists";
			}
			else{
				mess="Object not Exists";
			}			

			opvar=true;			
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar1+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=true;
			opvar1=false;
			mess="Object not Exists";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar1+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}
	//=================================================================================================

	public java.lang.String Method_reportMessage(java.lang.String Message, java.lang.String Status) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		try
		{				
			if(Status.equalsIgnoreCase("true"))
				opvar=true;
			else
				opvar=false;
			mess = Message;
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}

		catch (Exception e)
		{			
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}
	//=================================================================================================

	public java.lang.String Method_selectRadioButtonOnIndexBasis(java.lang.String object, java.lang.String index) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test = bt.find(atDescendant(objectProp));
			TestObject child[]=test[0].find(atChild(".index",index));
			ToggleGUITestObject tgui = (ToggleGUITestObject)child[0];
			tgui.click();
			opvar=true;
			mess="Radio Button at index"+ index + " is Clicked";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}
	//==================================================================================================

	public java.lang.String Method_selectGroupRadioButton(java.lang.String object, java.lang.String index) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test = bt.find(atDescendant(objectProp));
			TestObject child[]=test[0].find(atChild(".index",index));
			ToggleGUITestObject tgui = (ToggleGUITestObject)child[0];
			tgui.click();					
			opvar=true;
			mess="Radio Button is Clicked";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyRadioButtonExist(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];			

			if(tgui.exists())
			{
				mess="radio Exists";
				opvar=true;
			}
			else{
				mess="radio not Exists";
				opvar=false;
			}				
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyRadioButtonDisabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);	
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];

			if(tgui.isEnabled())
			{
				mess="radio is not Disabled";
				opvar=false;
			}
			else
			{
				mess="radio is Disabled";
				opvar=true;
			}	
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyRadioButtonEnabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];
			tgui = (ToggleGUITestObject) test[0];

			if(tgui.isEnabled()){
				mess="Radio is Enabled";
				opvar=true;
			}
			else{
				mess="radio is not Enabled";
				opvar=false;
			}			
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_selectRadioButtonAndWait(java.lang.String object, java.lang.String TimeOut) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];
			tgui.click();
			Thread.sleep(Long.parseLong(TimeOut) * 1000L);
			opvar=true;
			mess="Radio Button is Clicked";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_setPropertyValue(java.lang.String object, java.lang.String PropName, java.lang.String PropVal) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];
			tgui.setProperty("."+PropName,PropVal);			

			opvar=true;
			mess="Property Value is Set";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			System.out.println(mess);
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_VerifyBrowserTitle(java.lang.String expectedTitle) 
	{
		boolean opvar;  
		java.lang.String broTitle;
		java.lang.String mess,ret_mess;
		broTitle = "";
		try
		{		
			IWindow[] wins = getTopWindows();
			for (int n = 0; n < wins.length; ++n) 
			{
				if (wins[n].getWindowClassName().equals("IEFrame") || wins[n].getWindowClassName().equals("MozillaUIWindowClass")|| wins[n].getWindowClassName().equals("MozillaWindowClass")) 
				{
					broTitle = wins[n].getText();					

				}
			}	
			if(broTitle.equalsIgnoreCase(expectedTitle)){
				mess = "Verified";
				opvar=true;	
			}
			else{
				mess = "Not Verified";
				opvar=false;	
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+broTitle+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}		


	//==============================================================================================

	public java.lang.String Method_setPage(java.lang.String f_obj) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;

		try
		{		
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			BrowserTestObject btoBrowser;
			toTestObj = rtoRoot.find(atDescendant(".class", "Html.HtmlBrowser"));
			btoBrowser = new BrowserTestObject(toTestObj[0]);
			while (Integer.parseInt(btoBrowser.getProperty(".readyState").toString()) < 4) 
			{	
				sleep(3);				
			}						
			opvar=true;
			mess="Page is set";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}	


	//==============================================================================================

	public java.lang.String Method_verifyTextareaColsRowLength(java.lang.String object, java.lang.String expRow, java.lang.String expCol) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];
			String rw = tgui.getProperty("rows").toString();
			String cl = tgui.getProperty("cols").toString();

			if(rw.equals(expRow) && cl.equals(expCol)){
				mess = "verified";
				opvar=true;
			}
			else{
				mess = "Not verified";
				opvar=false;
			}		

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}			

	//==============================================================================================		
	public java.lang.String Method_nextPageObject(java.lang.String object,java.lang.String tme) 
	{
		boolean opvar=false;  
		java.lang.String mess,ret_mess;
		mess = "";
		Property[] objectProp = XmlString(object);
		try
		{		
			double timeout1;
			//timeout1 = Double.parseDouble(tme);
			//sleep(timeout1);
			int time=Integer.parseInt(tme);
			for(int i=0;i<time;i++)
			{
				RootTestObject bt = getRootTestObject();
				TestObject[] test;
				test = bt.find(atDescendant(objectProp));

				if(test[0].exists())
				{
					mess  = "Object Found";
					opvar=true;
					break;	
				}
				else{
					mess = "Object not Found";
					opvar=false;	
				}
				sleep(1);
			}		
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================	

	public java.lang.String Method_typeSecureText(java.lang.String object, java.lang.String value) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];
			tgui.setText(value);			

			opvar=true;
			mess="Secure Text is Set";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================	

	public java.lang.String Method_verifyEditBoxName(java.lang.String object, java.lang.String expectedName) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		mess = "";
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];	
			String propertyName = ".name";
			if(tgui.getProperty(propertyName).equals(expectedName)){
				mess = "verified";
				opvar=true;
			}
			else{
				mess = "not Verified";
				opvar=false;
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================	

	public java.lang.String Method_verifyEditBoxLength(java.lang.String object, java.lang.String expectedLength) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		mess = "";
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];	
			String propertyName = ".maxLength";
			if(Long.parseLong(tgui.getProperty(propertyName).toString()) == Long.parseLong(expectedLength)){
				mess = "Editbox length verified";
				opvar=true;
			}
			else{
				mess = "Editbox length not Verified";
				opvar=false;
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================	

	public java.lang.String Method_verifyEditBoxValue(java.lang.String object, java.lang.String expectedText) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];									
			String txt= tgui.getText();
			if(txt.equalsIgnoreCase(expectedText)){
				mess = "Verified";
				opvar=true;
			}
			else{
				mess = "not Verified";
				opvar=false;
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================	

	public java.lang.String Method_verifyEditBoxNonEditable(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);		
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test = bt.find(atDescendant(objectProp));
			Object obj = test[0].getProperty("." + "readOnly");
			if(obj.toString().equalsIgnoreCase("true"))
			{
				mess = "Non Editable";
				opvar = true;
			}
			else
			{
				mess = "Editable";
				opvar = false;
			}
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch(PropertyNotFoundException e)
		{
			mess = "Object is Editable";
			opvar = false;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================	

	public java.lang.String Method_verifyEditBoxExist(java.lang.String object, java.lang.String tme) 
	{
		boolean opvar=true;  
		java.lang.String mess,ret_mess;
		mess = "";
		Property[] objectProp = XmlString(object);		
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];									
			String x=tgui.getProperty(".class").toString();
			int time1=Integer.parseInt(tme);

			for(int i=1;i<=time1;i++)
			{   					
				if(x.equalsIgnoreCase("Html.INPUT.text"))
				{
					mess="Editbox exist";
					opvar=true;
					break;		
				}
				else 
				{
					mess="Editbox not exist";
					opvar=false;
				}
				Thread.sleep(1000);
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================	

	public java.lang.String Method_verifyEditBoxEnabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		mess = "";
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];									

			if(tgui.isEnabled()){
				mess = "EditBox Enabled";
				opvar=true;
			}
			else{
				mess = "EditBox is not Enabled";
				opvar=false;
			}
			//opvar=true;		
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================	

	public java.lang.String Method_verifyEditBoxDisabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		mess = "";
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];		

			if(tgui.isEnabled())
			{
				mess="Editbox not disabled";
				opvar=false;
			}
			else 
			{
				mess="Editbox disabled";
				opvar=true;
			}				
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================	

	public java.lang.String Method_verifyCheckBoxEnabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];									
			if(tgui.isEnabled()){
				mess = "checkBox is Enabled";
				opvar=true;
			}
			else{
				mess = "check box is not enabled";
				opvar=false;
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyCheckBoxDisabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];	
			if(tgui.isEnabled()){
				mess = "Checkbox is not disabled";
				opvar=false;
			}
			else{
				mess = "Checkbox is disabled";
				opvar=true;	
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}

		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyCheckBoxExist(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];	

			if(tgui.exists())
			{
				mess = "Checkbox exists";
				opvar=true;	
			}
			else
			{
				mess = "Checkbox not exists";
				opvar=false;	
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}

		catch (Exception e)
		{
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_waitForEditBoxEnabled(java.lang.String object, java.lang.String tme) 
	{
		boolean opvar=false;  
		java.lang.String mess,ret_mess;
		mess = "";
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			int time1=Integer.parseInt(tme);
			for(int i=1;i<=time1;i++)
			{   
				try
				{
					test = bt.find(atDescendant(objectProp));
					tgui = (TextGuiTestObject) test[0];		
					opvar=tgui.isEnabled();	
					if(opvar==true)
					{
						mess="Editbox Enabled";
						opvar=true;
						break;		
					}
					else 
					{
						mess="Editbox was not Enabled till the time mentioned";
						opvar=false;
					}

				}
				catch (ArrayIndexOutOfBoundsException e)
				{
					opvar=false;
					mess="Object is Not Found";
				}
				Thread.sleep(1000);
			}			
			//opvar=true;			
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}

		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_waitForEditBoxDisabled(java.lang.String object, java.lang.String tme) 
	{
		boolean opvar=false;  
		java.lang.String mess,ret_mess;
		mess = "";
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			int time1=Integer.parseInt(tme);
			for(int i=1;i<=time1;i++)
			{   
				try
				{
					test = bt.find(atDescendant(objectProp));
					tgui = (TextGuiTestObject) test[0];		
					opvar=tgui.isEnabled();	
					if(opvar==false)
					{
						mess="Editbox disabled";
						opvar=true;
						break;		
					}
					else 
					{
						mess="Editbox was not disabled till the time mentioned";
						opvar=false;
					}

				}
				catch (ArrayIndexOutOfBoundsException e)
				{
					opvar=false;
					mess="Object is Not Found";
				}
				Thread.sleep(1000);
			}			
			//opvar=true;			
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}

		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_clearEditField(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];									
			tgui.setText("");
			opvar=true;			
			mess = "Edit Field is cleared";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}

		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_typeTextAndWait(java.lang.String object, java.lang.String textboxtext,java.lang.String wait_time) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];
			tgui.setText(textboxtext);
			double timeout1;
			timeout1 = Double.parseDouble(wait_time);
			sleep(timeout1);	
			opvar=true;
			mess="Text is Set and waited" + timeout1;
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_typeKeysOnEditBox(java.lang.String object, java.lang.String textboxtext) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();

			BrowserTestObject rtoRoot;
			TestObject[] toTestObj;
			toTestObj = bt.find(atDescendant(".class", "Html.HtmlBrowser"));
			rtoRoot = new BrowserTestObject(toTestObj[0]);
			TestObject[] test;
			TextGuiTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject ) test[0];
			tgui.click();
			rtoRoot.inputKeys(textboxtext);
			opvar=true;
			mess="Text is Set";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_typeKeysAndWait(java.lang.String object, java.lang.String textboxtext,java.lang.String wait_time) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();

			BrowserTestObject rtoRoot;
			TestObject[] toTestObj;
			toTestObj = bt.find(atDescendant(".class", "Html.HtmlBrowser"));
			rtoRoot = new BrowserTestObject(toTestObj[0]);
			TestObject[] test;
			TextGuiTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject ) test[0];
			tgui.click();
			rtoRoot.inputKeys(textboxtext);
			double timeout1;
			timeout1 = Double.parseDouble(wait_time);
			sleep(timeout1);
			opvar=true;
			mess="Text is Set";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_selectCheckBoxAndWait(java.lang.String object, java.lang.String dvalue, java.lang.String wait_time) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];
			tgui.click();
			double timeout1;
			timeout1 = Double.parseDouble(wait_time);
			sleep(timeout1);
			opvar=true;
			mess="CheckBox has been checked";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_deSelectCheckBoxAndWait(java.lang.String object,java.lang.String wait_time) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];
			tgui.deselect();
			double timeout1;
			timeout1 = Double.parseDouble(wait_time);
			sleep(timeout1);
			opvar=true;
			mess="deSelected";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_doubleClickAndWait(java.lang.String object,java.lang.String wait_time) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];
			tgui.doubleClick();
			double timeout1;
			timeout1 = Double.parseDouble(wait_time);
			sleep(timeout1);
			opvar=true;			
			mess = "Double clicked";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_goBack() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		try
		{		
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			BrowserTestObject btoBrowser;
			toTestObj = rtoRoot.find(atDescendant(".class", "Html.HtmlBrowser"));
			btoBrowser = new BrowserTestObject(toTestObj[0]);
			btoBrowser.back();
			opvar=true;
			mess="Browser is go back";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_goBackAndWait(java.lang.String wait_time) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		try
		{		
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			BrowserTestObject btoBrowser;
			toTestObj = rtoRoot.find(atDescendant(".class", "Html.HtmlBrowser"));
			btoBrowser = new BrowserTestObject(toTestObj[0]);
			btoBrowser.back();	
			double timeout1;
			timeout1 = Double.parseDouble(wait_time);
			sleep(timeout1);
			opvar=true;
			mess="Browser is go back";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_goForward() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		try
		{		
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			BrowserTestObject btoBrowser;
			toTestObj = rtoRoot.find(atDescendant(".class", "Html.HtmlBrowser"));
			btoBrowser = new BrowserTestObject(toTestObj[0]);
			btoBrowser.forward();
			opvar=true;
			mess="Browser is go forward";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_goForwardAndWait(java.lang.String wait_time) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		try
		{		
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			BrowserTestObject btoBrowser;
			toTestObj = rtoRoot.find(atDescendant(".class", "Html.HtmlBrowser"));
			btoBrowser = new BrowserTestObject(toTestObj[0]);
			btoBrowser.forward();	
			double timeout1;
			timeout1 = Double.parseDouble(wait_time);
			sleep(timeout1);
			opvar=true;
			mess="Browser is go forward";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==============================================================================================

	public java.lang.String Method_doubleClickAt(java.lang.String object,java.lang.String points) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];
			String[] x=points.split(";");
			int x1=Integer.parseInt(x[0]);
			int y1=Integer.parseInt(x[1]);
			tgui.doubleClick(atPoint(x1, y1));
			opvar=true;			
			mess = "Double clicked at point: "+x1 +", "+y1;
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_RefreshBrowser() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		try
		{		
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			BrowserTestObject btoBrowser;
			toTestObj = rtoRoot.find(atDescendant(".class", "Html.HtmlBrowser"));
			btoBrowser = new BrowserTestObject(toTestObj[0]);
			btoBrowser.inputKeys("{F5}");
			opvar=true;
			mess="Browser is refreshed";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_refreshAndWait(java.lang.String wait_time) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;

		try
		{		
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			BrowserTestObject btoBrowser;
			toTestObj = rtoRoot.find(atDescendant(".class", "Html.HtmlBrowser"));
			btoBrowser = new BrowserTestObject(toTestObj[0]);
			btoBrowser.inputKeys("{F5}");
			double timeout1;
			timeout1 = Double.parseDouble(wait_time);
			sleep(timeout1);
			opvar=true;
			mess="Browser is refreshed";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_getAllButtons() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		try
		{		
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			toTestObj = rtoRoot.find(atDescendant(".class", "Html.INPUT.button"));
			int x=toTestObj.length;	
			opvar=true;
			mess="All Button Count is:"+x;
			ret_mess="<KeywordOutput><Result><![CDATA["+x+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_getAllLinks() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		try
		{		
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			toTestObj = rtoRoot.find(atDescendant(".class", "Html.A"));
			GuiTestObject link;
			String linkStr="";
			link = (GuiTestObject)toTestObj[0];
			int linkCount=toTestObj.length;
			if(linkCount == 0){
				mess = "No Links Found";
			}else if(linkCount == 1){
				linkStr = ((GuiTestObject)toTestObj[0]).toString();
			}else{
				linkStr = ((GuiTestObject)toTestObj[0]).getProperty(".text").toString();
				for(int i=1;i<linkCount;i++){
					link = (GuiTestObject)toTestObj[i];					
					linkStr = linkStr +";"+ link.getProperty(".text");
				}
			}

			mess = "All links is fetched";
			opvar = true;
			ret_mess="<KeywordOutput><Result><![CDATA["+linkStr+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_getAllFields() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		try
		{		
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			toTestObj = rtoRoot.find(atDescendant(".class", "Html.INPUT.text"));
			int x=toTestObj.length;		
			opvar=true;
			mess="All TextField Count is:"+x;
			ret_mess="<KeywordOutput><Result><![CDATA["+x+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_doubleClickImage(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject) test[0];			
			tgui.doubleClick();
			mess = "Image is double clicked";				
			opvar=true;		
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_clickImage(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			System.out.println(objectProp[0]);
			System.out.println(objectProp[1]);
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			System.out.println("itemcount is " + test.length);
			tgui = (StatelessGuiSubitemTestObject) test[0];			
			tgui.click();
			mess = "image is clicked";				
			opvar=true;			
			System.out.println("Method_clickImage  " + mess);
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyImageExist(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject) test[0];			

			if(tgui.ensureObjectIsVisible()){
				mess="Image exist";
				opvar=true;	
			}
			else{
				mess="Image not exist";
				opvar=false;	
			}			
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyImageNotVisible(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject) test[0];		
			if(tgui.ensureObjectIsVisible()){
				mess="Image Visible";
				opvar=false;	
			}
			else{
				mess="Image not Visible";
				opvar=true;	
			}			

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyImageVisible(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject) test[0];			
			if(tgui.ensureObjectIsVisible()){
				mess="Image is Visible on the page";
				opvar=true;	
			}
			else{
				mess="Image is Not Visible on the page";
				opvar=false;	
			}			
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_returnConcatenated(java.lang.String str1, java.lang.String str2, java.lang.String str3) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess,concatStr;
		concatStr  = str1 + str2 + str3;
		opvar = true;
		mess = "String are concatenated";
		System.out.println("Method_returnConcatenated  " + mess + concatStr);
		ret_mess="<KeywordOutput><Result><![CDATA["+concatStr+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyTextAreaToolTip(java.lang.String object, java.lang.String toolTip) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];
			String x= (String) tgui.getProperty(".title");

			if(x.equalsIgnoreCase(toolTip))
			{
				opvar=true;
				mess="TextArea tooltip is verified";
			}
			else
			{
				opvar=false;
				mess="TextArea tooltip is not verified";
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyButtonExist(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];	

			if(tgui.exists()){
				mess = "Button Exists";
				opvar=true;
			}
			else{
				mess = "Button not Exists";
				opvar=false;
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Button Not Exists";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyButtonDisabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];	

			if(tgui.isEnabled()){
				mess = "Button is not Disabled";
				opvar=false;
			}
			else{
				mess = "Button is Disabled";
				opvar=true;
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}

		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_doubleClickButton(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];			
			tgui.doubleClick();	
			opvar=true;			
			mess = " Double clicked";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_typeKeysInTextArea(java.lang.String object, java.lang.String text) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);

		try
		{		
			RootTestObject bt = getRootTestObject();

			TestObject[] toTestObj;
			toTestObj = bt.find(atDescendant(".class", "Html.HtmlBrowser"));

			BrowserTestObject rtoRoot;
			rtoRoot = new BrowserTestObject(toTestObj[0]);

			TestObject[] test;			
			test = bt.find(atDescendant(objectProp));

			TextGuiTestObject  tgui;
			tgui = (TextGuiTestObject ) test[0];

			tgui.click();
			rtoRoot.inputKeys(text);

			opvar=true;
			mess="Text is Set";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}

		catch (Exception e)
		{		    
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_clearTextArea(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];			
			tgui.setText("");

			mess = "textArea is cleared";
			opvar=true;			
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyTextAreaValue(java.lang.String object, java.lang.String expectedText) 
	{						
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];									
			String txt= tgui.getText();
			if(txt.equalsIgnoreCase(expectedText)){
				mess = "Verified";
				opvar=true;	
			}
			else{
				mess = "not Verified";
				opvar=false;	
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyTextAreaEditable(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);		
		try {
			RootTestObject bt = getRootTestObject();
			TestObject[] test = bt.find(atDescendant(objectProp));
			Object obj = test[0].getProperty("." + "readOnly");
			if(obj.toString().equalsIgnoreCase("false"))
			{
				mess = "Object is Editable";
				opvar = true;
			}
			else
			{
				mess = "Object is NonEditable";
				opvar = false;
			}
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (PropertyNotFoundException e)
		{
			//String ret_mess;
			setmessage(e.getMessage());
			opvar = true;
			mess = "Object is Editable";
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}

		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyTextAreaNotEditable(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);		
		try 
		{
			RootTestObject bt = getRootTestObject();
			TestObject[] test = bt.find(atDescendant(objectProp));
			Object obj = test[0].getProperty("." + "readOnly");
			if(obj.toString().equalsIgnoreCase("true"))
			{
				mess = "Object is NonEditable";
				opvar = true;
			}
			else
			{
				mess = "Object is Editable";
				opvar = false;
			}
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (PropertyNotFoundException e)
		{
			//String ret_mess;
			setmessage(e.getMessage());
			opvar = false;
			mess = "Object is Editable";
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================
	//............yogesh  

	public java.lang.String Method_verifyTextAreaExist(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		mess = "";
		Property[] objectProp = XmlString(object);		
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];	
			String x=tgui.getProperty(".class").toString();

			if(x.equalsIgnoreCase("Html.TEXTAREA"))
			{
				mess="TextArea exist";	
				opvar=true;
			}
			else 
			{
				mess="TextArea not exist";
				opvar=false;
			}									

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyTextAreanotExist(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		mess = "";
		Property[] objectProp = XmlString(object);

		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];									
			String x=tgui.getProperty(".class").toString();

			if(x.equalsIgnoreCase("Html.TEXTAREA"))
			{
				mess="TextArea exist";
				opvar=false;
			}
			else 
			{
				mess="TextArea not exist";
				opvar=true;
			}						

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			mess="TextArea not exist";
			opvar=true;
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyTextAreaDisabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		mess = "";
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];		

			if(tgui.isEnabled())
			{
				mess="TextArea not disabled";
				opvar=false;
			}
			else 
			{
				mess="TextArea disabled";
				opvar=true;
			}			
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyBrowserExist(String BrowserTitle) 
	{
		boolean opvar = false;  
		java.lang.String broTitle;
		java.lang.String mess = null,ret_mess;
		broTitle = "";
		try
		{		
			IWindow[] wins = getTopWindows();
			for (int n = 0; n < wins.length; ++n) 
			{
				if (wins[n].getWindowClassName().equals("IEFrame") || wins[n].getWindowClassName().equals("MozillaUIWindowClass")) 
				{
					broTitle = wins[n].getText();
					if(broTitle.equals(BrowserTitle))
					{
						opvar=true;
						mess="Browser Existence Verified";
						break;
					}
					else
					{
						opvar=false;
						mess="Browser Existence not Verified";
					}

				}
			}	

			ret_mess="<KeywordOutput><Result><![CDATA["+broTitle+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyEditBoxnotExist(java.lang.String object,java.lang.String wait_time) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];
			String x=tgui.getProperty(".class").toString();

			if(x.equalsIgnoreCase("Html.INPUT.text"))
			{
				opvar=false;
				mess="Editbox exist" ;	
			}
			else
			{
				opvar=true;
				mess="Editbox doesnt exist" ;
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_typeTextandEnterEditBox(java.lang.String object, java.lang.String textboxtext) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();

			BrowserTestObject rtoRoot;
			TestObject[] toTestObj;
			toTestObj = bt.find(atDescendant(".class", "Html.HtmlBrowser"));
			rtoRoot = new BrowserTestObject(toTestObj[0]);
			TestObject[] test;
			TextGuiTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject ) test[0];
			tgui.setText(textboxtext);
			rtoRoot.inputKeys("{ENTER}");
			opvar=true;
			mess="Text is Set";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_clickButton(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];
			tgui.waitForExistence();
			tgui.click();		
			opvar=true;
			mess="Button is Clicked";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}	

	//==============================================================================================

	public java.lang.String Method_clickButtonAndWait(java.lang.String object,java.lang.String wait_time) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];
			tgui.waitForExistence();
			tgui.click();
			double timeout1;
			timeout1 = Double.parseDouble(wait_time);
			sleep(timeout1);
			opvar=true;
			mess="Button is Clicked and waited"+timeout1;
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}	

	//==============================================================================================

	public java.lang.String Method_VerifyRadioButtonSelected(java.lang.String object, java.lang.String F_index) 
	{
		boolean opvar = false;  
		java.lang.String mess,ret_mess;
		int retval = 0;
		mess  ="no radio button is selected";
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];
			mess = tgui.getState().toString();

			if(tgui.getState().toString().equalsIgnoreCase("SELECTED"))
			{
				opvar=true;	
			}
			else
			{
				opvar=false;
			}							
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_VerifyRadioButtonNotSelected(java.lang.String object, java.lang.String F_index) 
	{
		boolean opvar = false;  
		java.lang.String mess,ret_mess;
		int retval = 0;
		mess  ="no radio button is selected";
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];
			mess = tgui.getState().toString();

			if(tgui.getState().toString().equalsIgnoreCase("SELECTED"))
			{
				opvar=false;		
			}
			else
			{
				opvar=true;
			}							
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================
	//-------------------------------------------------------yogesh	
	public java.lang.String Method_verifyTextAreaText(java.lang.String object,java.lang.String expectedText) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];									
			String txt= tgui.getText();

			if((txt.trim()).equalsIgnoreCase(expectedText))
			{
				opvar=true;			
				mess = "TextArea text is verified";
			}
			else
			{
				opvar=false;			
				mess = "TextArea text is not verified";
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+txt+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyTextAreaEnabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];									
			boolean x=tgui.isEnabled();
			if(x=true)
			{
				opvar=true;			
				mess = "TextArea text is enabled";
			}
			else
			{
				opvar=false;			
				mess = "TextArea text is disabled";
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_getRadioButtonCount() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		try
		{		
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			toTestObj = rtoRoot.find(atDescendant(".class", "Html.INPUT.radio"));
			int x=toTestObj.length;		
			opvar=true;
			mess="Radio Button Count is:"+x;
			ret_mess="<KeywordOutput><Result><![CDATA["+x+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_typeTextandEnterTextArea(java.lang.String object, java.lang.String textboxtext) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();

			BrowserTestObject rtoRoot;
			TestObject[] toTestObj;
			toTestObj = bt.find(atDescendant(".class", "Html.HtmlBrowser"));
			rtoRoot = new BrowserTestObject(toTestObj[0]);
			TestObject[] test;
			TextGuiTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject ) test[0];
			tgui.setText(textboxtext);
			rtoRoot.inputKeys("{ENTER}");
			opvar=true;
			mess="Text is Set";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyEditBoxDefaultValue(java.lang.String object,java.lang.String defaultvalue) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];
			String x=(String) tgui.getProperty(".defaultValue");
			if(x.equals(defaultvalue))
			{
				opvar=true;
				mess="Editbox default value is verified" ;	
			}
			else
			{
				opvar=false;
				mess="Editbox default value is not verified" ;
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyDropDownDefaultItem(java.lang.String object,java.lang.String defaultvalue) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (SelectGuiSubitemTestObject) test[0];
			String x= (String) tgui.getProperty(".value");
			if(x.equalsIgnoreCase(defaultvalue))
			{
				opvar=true;
				mess="Dropdown default item is verified";
			}
			else
			{
				opvar=false;
				mess="Dropdown default item is not verified";
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyTextAreaDefaultValue(java.lang.String object,java.lang.String defaultvalue) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];
			String x=(String) tgui.getProperty(".defaultValue");
			if(x.equals(defaultvalue))
			{
				opvar=true;
				mess="TextArea default value is verified" ;	
			}
			else
			{
				opvar=false;
				mess="TextArea default value is not verified" ;
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyEditBoxToolTip(java.lang.String object,java.lang.String tooltiptext) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];
			String x= (String) tgui.getProperty(".title");

			if(x.equalsIgnoreCase(tooltiptext))
			{
				opvar=true;
				mess="Editbox tooltip is verified";
			}
			else
			{
				opvar=false;
				mess="Editbox tooltip is not verified";
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyCheckBoxToolTip(java.lang.String object,java.lang.String tooltiptext) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];
			String x= (String) tgui.getProperty(".title");

			if(x.equalsIgnoreCase(tooltiptext))
			{
				opvar=true;
				mess="Checkbox tooltip is verified";
			}
			else
			{
				opvar=false;
				mess="Checkbox tooltip is not verified";
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}

		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_getLinkCount() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		try
		{		
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			toTestObj = rtoRoot.find(atDescendant(".class", "Html.A"));
			int x=toTestObj.length;	
			opvar=true;
			mess="All Links Count is:"+x;
			ret_mess="<KeywordOutput><Result><![CDATA["+x+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyLinkCount(java.lang.String ExpectedLinkCount) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		try
		{		
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			toTestObj = rtoRoot.find(atDescendant(".class", "Html.A"));
			int x=toTestObj.length;	
			int ExpectedLinkCount1=Integer.parseInt(ExpectedLinkCount);
			if(x==ExpectedLinkCount1)
			{
				opvar=true;
				mess="link count is verified";
			}
			else
			{
				opvar=false;
				mess="link count is not verified";
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public String Method_copyFromClipBoard() 
	{
		String result = "",ret_mess="";
		boolean opvar = false;
		String opvars, mess;

		Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
		//odd: the Object param of getContents is not currently used
		Transferable contents = clipboard.getContents(null);
		boolean hasTransferableText =    (contents != null) &&contents.isDataFlavorSupported(DataFlavor.stringFlavor);
		if ( hasTransferableText ) {
			try 
			{
				result = (String)contents.getTransferData(DataFlavor.stringFlavor);
				opvar=true;
				mess = "Content is successfully copied";

				ret_mess="<KeywordOutput><Result><![CDATA["+result+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
			}
			catch (UnsupportedFlavorException ex)
			{
				System.out.println(ex);
				ex.printStackTrace();
			}
			catch (IOException e) 
			{ 
				opvar=false;
				mess=e.getMessage();
				ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
			}
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyTextAreaName(java.lang.String object, java.lang.String expectedName) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		mess = "";
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];	
			String propertyName = ".name";
			if(tgui.getProperty(propertyName).equals(expectedName)){
				mess = "TextArea Name is verified";
				opvar=true;	
			}
			else{
				mess = "TextArea Name is not Verified";
				opvar=false;	
			}	

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyTextAreaLength(java.lang.String object, java.lang.String expectedLength) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		mess = "";
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];	
			String propertyName = ".maxLength";
			if(tgui.getProperty(propertyName).equals(expectedLength)){
				mess = "Text Area Length is verified";
				opvar=true;	
			}
			else{
				mess = "Text Area Length is not Verified";
				opvar=false;	
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_clickLink(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];
			tgui.waitForExistence();
			tgui.click();		
			opvar=true;
			mess="Link is Clicked";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyLinkExist(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];
			boolean x=tgui.exists();
			if(x=true)
			{
				mess="Link existence is verified";
				opvar=true;
			}
			else
			{
				mess="Link existence is not Verified";
				opvar=false;
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyButtonEnabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];
			boolean x=tgui.isEnabled();
			if(x=true)
			{
				mess="Button is enabled";
				opvar=true;
			}
			else
			{
				mess="Button is disabled";
				opvar=false;
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyImageCount(java.lang.String expCount) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		try
		{		
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			toTestObj = rtoRoot.find(atDescendant(".class", "Html.IMG"));
			int x=toTestObj.length;	
			if(x==Integer.parseInt(expCount)){
				mess= "Image Count Verified";
				opvar=true;
			}
			else{
				mess = "Image Count Not verified";
				opvar=false;
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+x+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyImageEnabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject) test[0];
			boolean x=tgui.isEnabled();
			if(x=true)
			{
				mess="Image is enabled";
				opvar=true;
			}
			else
			{
				mess="Image is disabled";
				opvar=false;
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+x+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyImageDisabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject) test[0];
			boolean x=tgui.isEnabled();
			if(x==true)
			{
				mess="Image is enabled";
				opvar=false;
			}
			else
			{
				mess="Image is disabled";
				opvar=true;
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+x+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_waitforImageLoad(java.lang.String object,java.lang.String wait_time) 
	{
		boolean opvar=false;  
		java.lang.String mess = null,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject tgui;

			double timeout1;
			timeout1 = Double.parseDouble(wait_time);
			for(int i=0;i<timeout1;i++)
			{
				try
				{
					test = bt.find(atDescendant(objectProp));
					tgui = (StatelessGuiSubitemTestObject) test[0];
					boolean x=tgui.exists();
					if (x==true)
					{
						opvar=true;
						mess = "Image  found";						
						break;				
					}
					else
					{
						opvar =false;
						mess="Image  not found";
					}
				}
				catch (ArrayIndexOutOfBoundsException e)
				{
					opvar=false;
					mess="Object is Not Found";

				}
				sleep(1);
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyObjectdoesnotExists(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];			

			if(tgui.exists()){
				mess="object Exists";
				opvar=false;
			}
			else{
				mess="Object does not Exists";
				opvar=true;
			}			

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=true;
			mess="Object does not Exists";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=true;
			mess="Object does not Exists";//e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyobjectDisabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];			

			if(tgui.isEnabled()){
				mess="object is Enabled";
				opvar=false;
			}
			else{
				mess="object is disabled";
				opvar=true;
			}			
			//				opvar=true;			
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_KeyLeft() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;		
		try
		{		
			RootTestObject bt = getRootTestObject();
			BrowserTestObject rtoRoot;
			TestObject[] toTestObj;
			toTestObj = bt.find(atDescendant(".class", "Html.HtmlBrowser"));
			rtoRoot = new BrowserTestObject(toTestObj[0]);
			rtoRoot.inputKeys("{LEFT}");
			opvar=true;
			mess="Key Left operation is performed";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_KeyRight() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;			
		try
		{		
			RootTestObject bt = getRootTestObject();
			BrowserTestObject rtoRoot;
			TestObject[] toTestObj;
			toTestObj = bt.find(atDescendant(".class", "Html.HtmlBrowser"));
			rtoRoot = new BrowserTestObject(toTestObj[0]);
			rtoRoot.inputKeys("{RIGHT}");
			opvar=true;
			mess="Key Right operation is performed";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_PressTAB() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;			
		try
		{		
			RootTestObject bt = getRootTestObject();
			BrowserTestObject rtoRoot;
			TestObject[] toTestObj;
			toTestObj = bt.find(atDescendant(".class", "Html.HtmlBrowser"));
			rtoRoot = new BrowserTestObject(toTestObj[0]);
			rtoRoot.inputKeys("{TAB}");
			opvar=true;
			mess="TAB Key operation is performed";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyDropDownToolTip(java.lang.String object,java.lang.String tooltiptext) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (SelectGuiSubitemTestObject) test[0];
			String x= (String) tgui.getProperty(".title");

			if(x.equalsIgnoreCase(tooltiptext))
			{
				opvar=true;
				mess="Dropdown tooltip is verified";
			}
			else
			{
				opvar=false;
				mess="Dropdown tooltip is not verified";
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyButtonToolTip(java.lang.String object,java.lang.String tooltiptext) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];
			String x= (String) tgui.getProperty(".title");

			if(x.equalsIgnoreCase(tooltiptext))
			{
				opvar=true;
				mess="Button tooltip is verified";
			}
			else
			{
				opvar=false;
				mess="Button tooltip is not verified";
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyLinkToolTip(java.lang.String object,java.lang.String tooltiptext) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];
			String x= (String) tgui.getProperty(".title");

			if(x.equalsIgnoreCase(tooltiptext))
			{
				opvar=true;
				mess="Link tooltip is verified";
			}
			else
			{
				opvar=false;
				mess="Link tooltip is not verified";
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}		

	//==============================================================================================

	public java.lang.String Method_verifyImageToolTip(java.lang.String object,java.lang.String tooltiptext) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject) test[0];
			String x= (String) tgui.getProperty(".alt");

			if(x.equalsIgnoreCase(tooltiptext))
			{
				opvar=true;
				mess="Image tooltip is verified";
			}
			else
			{
				opvar=false;
				mess="Image tooltip is not verified";
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==============================================================================================

	public java.lang.String Method_verifyObjectToolTip(java.lang.String object,java.lang.String tooltiptext) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess,x2;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];
			String x1= (String) tgui.getProperty(".class");
			if(x1.equals("Html.IMG"))
			{
				x2= (String) tgui.getProperty(".alt");
			}
			else
			{
				x2= (String) tgui.getProperty(".title");
			}

			if(x2.equalsIgnoreCase(tooltiptext))
			{
				opvar=true;
				mess="Object tooltip is verified";
			}
			else
			{
				opvar=false;
				mess="Object tooltip is not verified";
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==============================================================================================

	public java.lang.String Method_verifyLinkEnabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];

			boolean opvar1 = tgui.isEnabled();
			if(opvar1=true)
			{
				opvar=true;
				mess="Link is enabled";
			}
			else
			{
				opvar=false;
				mess="Link is disabled";
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar1+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==============================================================================================

	public java.lang.String Method_verifyLinkDisabled(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];

			boolean opvar1 = tgui.isEnabled();
			if(opvar1==true)
			{
				opvar=false;
				mess="Link is enabled";
			}
			else
			{
				opvar=true;
				mess="Link is disabled";
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar1+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================


	public java.lang.String Method_verifyLinkVisible(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];
			boolean opvar1 = tgui.isShowing();
			if(opvar1=true)
			{
				opvar=true;
				mess="Link is Visible";
			}
			else
			{
				opvar=false;
				mess="Link is Invisible";
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar1+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyEditable(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test = bt.find(atDescendant(objectProp));
			Object obj = test[0].getProperty("." + "readOnly");
			if(obj.toString().equalsIgnoreCase("false"))
			{
				mess = "Object is Editable";
				opvar = true;
			}
			else
			{
				mess = "Object is NonEditable";
				opvar = false;
			}
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (PropertyNotFoundException e)
		{
			mess = "Object is Editable";
			opvar = true;
			ret_mess = "<KeywordOutput><Result><![CDATA[" + opvar + "]]></Result><Status><![CDATA[" + opvar + "]]></Status><Message><![CDATA[" + mess + "]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}	


	//==============================================================================================

	public java.lang.String Method_Getpopuptext(java.lang.String caption) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		String popuptext = null;
		String x1;
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TopLevelTestObject tgui;
			test = bt.find(atDescendant(".class","Html.Dialog",".caption",caption));
			tgui = (TopLevelTestObject) test[0];
			TestObject[] x=tgui.getChildren();
			for(int i=0;i<x.length;i++)
			{
				x1=(String) x[i].getProperty(".class");
				if(x1.equalsIgnoreCase("Html.DialogStatic"))
				{
					popuptext=(String) x[i+1].getProperty(".text");
					break;
				}
			}
			opvar=true;
			mess="popup text is:"+popuptext;
			ret_mess="<KeywordOutput><Result><![CDATA["+popuptext+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==============================================================================================

	public java.lang.String Method_VerifyPopUpText(java.lang.String caption,java.lang.String ExpectedPopupText) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		String popuptext = null;
		String x1;
		try
		{		

			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TopLevelTestObject tgui;
			test = bt.find(atDescendant(".class","Html.Dialog",".caption",caption));
			tgui = (TopLevelTestObject) test[0];
			TestObject[] x=tgui.getChildren();
			for(int i=0;i<x.length;i++)
			{
				x1=(String) x[i].getProperty(".class");
				if(x1.equalsIgnoreCase("Html.DialogStatic"))
				{
					popuptext=(String) x[i+1].getProperty(".text");
					break;
				}
			}
			if(popuptext.equals(ExpectedPopupText))
			{
				opvar=true;
				mess="popup text is verified";
			}
			else
			{
				opvar=false;
				mess="popup text is not verified";	
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}	

	//==============================================================================================

	public java.lang.String Method_Handlepopup(java.lang.String DialogTitle,java.lang.String ButtonText) 
	{
		boolean opvar = false;  
		java.lang.String mess = null,ret_mess;
		String popuptext = null;
		String x1;
		int counter=0;
		try
		{		

			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TopLevelTestObject tgui;
			test = bt.find(atDescendant(".class","Html.Dialog",".caption",DialogTitle));
			tgui = (TopLevelTestObject) test[0];
			TestObject[] x=tgui.getChildren();
			for(int i=0;i<x.length;i++)
			{
				x1=(String) x[i].getProperty(".class");
				if(x1.equalsIgnoreCase("Html.DialogButton"))
				{
					popuptext=(String) x[i].getProperty(".text");
					if(popuptext.equals(ButtonText))
					{
						((GuiTestObject) x[i]).click();
						opvar=true;
						mess="popup is handled and"+ButtonText+"is Clicked";
						break;

					}
					else
					{
						opvar=false;
						mess="popup is not handled";
					}

				}
			}	
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyAllLink(java.lang.String verifyLink) 
	{
		boolean opvar;
		int found=0;
		java.lang.String mess,ret_mess,exp_link[];		
		exp_link     = verifyLink.split(";");

		try
		{		
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			toTestObj = rtoRoot.find(atDescendant(".class", "Html.A"));			
			String linkStr="";		

			int linkCount=toTestObj.length;

			if(linkCount == 0){
				mess = "No Links Found";
				opvar=false;
			}else{

				for(int i=0;i<exp_link.length;i++){
					for(int j=0;j<linkCount;j++){
						if(exp_link[i] != ((GuiTestObject)toTestObj[j]).getProperty(".text").toString()){
							found++;
							break;
						}
					}
				}
			}	
			if(found == linkCount){
				mess = "Verified";
				opvar=true;
			}
			else{
				mess = "Not Verified";
				opvar=false;
			}

			mess = "All links Verified";
			ret_mess="<KeywordOutput><Result><![CDATA["+linkStr+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_clickTableCell(java.lang.String object,java.lang.String rowId,java.lang.String colId,java.lang.String type,java.lang.String index) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);

		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject ) test[0];
			int rowid=Integer.parseInt(rowId);
			int colid=Integer.parseInt(colId);
			tgui.click(atCell(atRow(rowid-1),atColumn(colid-1)));
			opvar=true;
			mess="Table cell is Clicked";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==============================================================================================

	public java.lang.String Method_getFullTableText(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();	
			BrowserTestObject rtoRoot;
			TestObject[] test;
			StatelessGuiSubitemTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject ) test[0];
			TestObject[] x=tgui.getChildren();
			String x1=(String) x[0].getProperty(".text");
			opvar=true;
			mess="Table Full Text is get";
			ret_mess="<KeywordOutput><Result><![CDATA["+x1+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==============================================================================================

	public java.lang.String Method_clickTableCellAndWait(java.lang.String object,java.lang.String rowId,java.lang.String colId,java.lang.String type,java.lang.String index,java.lang.String wait_time) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject ) test[0];
			int rowid=Integer.parseInt(rowId);
			int colid=Integer.parseInt(colId);
			tgui.click(atCell(atRow(rowid-1),atColumn(colid-1)));
			double timeout1;
			timeout1 = Double.parseDouble(wait_time);
			sleep(timeout1);
			opvar=true;
			mess="Table cell is Clicked and waited"+timeout1;
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==============================================================================================

	public java.lang.String Method_GetCellText(java.lang.String object,java.lang.String rowId,java.lang.String colId)
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject) test[0];
			ITestDataTable t=(ITestDataTable)tgui.getTestData("contents");		
			int rowid=Integer.parseInt(rowId);
			int colid=Integer.parseInt(colId);
			opvar=true;
			mess="Table cell Text is Found: "+t.getCell(rowid-1, colid-1);
			System.out.println("in 3" + mess);
			ret_mess="<KeywordOutput><Result><![CDATA["+t.getCell(rowid-1, colid-1)+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==============================================================================================

	public java.lang.String Method_TableGetTextRow(java.lang.String object,java.lang.String Colid,java.lang.String text)
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		int Counter=0;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject) test[0];	
			ITestDataTable t=(ITestDataTable)tgui.getTestData("contents");		
			int colid=Integer.parseInt(Colid);
			colid=colid-1;
			for(int i=0;i<t.getColumnCount();i++)
			{
				String x=t.getCell(i,colid).toString();
				if(x.equals(text))
				{
					Counter=i+1;
					break;
				}
			}
			if(Counter==0)
			{
				opvar=false;
				mess="Column Text is Not Found";	
			}
			else
			{
				opvar=true;
				mess="Column Text is Found at Row: " + Counter;
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==============================================================================================

	public java.lang.String Method_TableGetTextColumn(java.lang.String object,java.lang.String RowId,java.lang.String text)
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		int Counter=0;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject) test[0];	
			ITestDataTable t=(ITestDataTable)tgui.getTestData("contents");		
			int rowid=Integer.parseInt(RowId);
			rowid=rowid-1;
			for(int i=0;i<t.getColumnCount();i++)
			{
				String x=t.getCell(rowid,i).toString();
				if(x.equals(text))
				{
					Counter=i+1;
					break;
				}
			}
			if(Counter==0)
			{
				opvar=false;
				mess="Row Text is Not Found";	
			}
			else
			{
				opvar=true;
				mess="Row Text is Found at Column: " + Counter;
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==============================================================================================

	public java.lang.String Method_verifyTextInTable(java.lang.String object,java.lang.String RowId,java.lang.String ColId,java.lang.String text)
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		int Counter=0;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject) test[0];	
			ITestDataTable t=(ITestDataTable)tgui.getTestData("contents");		
			int rowid=Integer.parseInt(RowId);
			rowid=rowid-1;
			int colid=Integer.parseInt(ColId);
			colid=colid-1;
			String x=t.getCell(rowid,colid).toString();
			if(x.equalsIgnoreCase(text))
			{
				opvar=true;
				mess="Text data is verified in table";
			}
			else
			{
				opvar=false;
				mess="Text data is not Verified in Table";
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==============================================================================================

	public java.lang.String Method_keyPressNative(String data) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		try
		{		
			RootTestObject bt = getRootTestObject();

			TestObject[] toTestObj;
			toTestObj = bt.find(atDescendant(".class", "Html.HtmlBrowser"));

			BrowserTestObject rtoRoot;
			rtoRoot = new BrowserTestObject(toTestObj[0]);
			rtoRoot.inputKeys("{"+data+" KeyDn}{"+data+" KeyUp}");

			opvar=true;
			mess="press native button is typed";

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==============================================================================================

	public java.lang.String Method_getChildObjectCount(java.lang.String object, java.lang.String objectToCount, java.lang.String j_sta, java.lang.String j_prro) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			test = bt.find(atDescendant(objectProp));
			test[0].getProperty(".class");

			test = bt.find(atDescendant(".class",test[0].getProperty(".class")));

			/*to count the number of child count*/

			int len = test.length;

			opvar=true;
			mess="child object Count is:"+len;
			System.out.println("Method_getChildObjectCount" + mess +"  <<"+len);
			ret_mess="<KeywordOutput><Result><![CDATA["+len+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==============================================================================================

	public java.lang.String Method_CaptureSnapshot(java.lang.String pathToSave) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;

		try {
			RootTestObject bt = getRootTestObject();

			java.awt.image.BufferedImage bi = bt.getScreenSnapshot();			 			 
			ImageIO.write(bi, "jpg", new File(pathToSave+"/crestest.jpg"));

			opvar=true;
			mess="snapshot is captured";

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{		    
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}


	//==============================================================================================

	public java.lang.String Method_Enter() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		try
		{		
			RootTestObject bt = getRootTestObject();

			TestObject[] toTestObj;
			toTestObj = bt.find(atDescendant(".class", "Html.HtmlBrowser"));

			BrowserTestObject rtoRoot;
			rtoRoot = new BrowserTestObject(toTestObj[0]);			
			rtoRoot.inputKeys("{ENTER}");

			opvar=true;
			mess="Enter button is clicked";

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_waitforLink(java.lang.String object, java.lang.String tme) 
	{
		boolean opvar = true;  
		java.lang.String mess,ret_mess;
		mess = "";
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;

			for(int i=0;i<Integer.parseInt(tme);i++)
			{
				try
				{
					test = bt.find(atDescendant(objectProp));
					tgui = (GuiTestObject) test[0];
					if(tgui.exists()){
						mess = "Link Found";
						opvar = true;
						break;
					}
					else{
						mess = "Waited for link, Link not Found in the given Time";
						opvar = false;
					}
				}
				catch (ArrayIndexOutOfBoundsException e)
				{
					opvar=false;
					mess="Object is Not Found";
					//ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
				}
				Thread.sleep(1000);

			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_fetchBrowserURL() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		try
		{		
			RootTestObject bt = getRootTestObject();

			TestObject[] toTestObj;
			toTestObj = bt.find(atDescendant(".class", "Html.HtmlBrowser"));

			BrowserTestObject rtoRoot;
			rtoRoot = new BrowserTestObject(toTestObj[0]);
			String title = rtoRoot.getProperty(".documentName").toString();				
			opvar=true;
			mess="Browser url is Fetched";		
			ret_mess="<KeywordOutput><Result><![CDATA["+title+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{		    
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_getTableRowNumber(java.lang.String object,java.lang.String Colid,java.lang.String text)
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		int Counter=0;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject) test[0];	
			ITestDataTable t=(ITestDataTable)tgui.getTestData("contents");		
			int colid=Integer.parseInt(Colid);
			colid=colid-1;
			for(int i=0;i<t.getRowCount();i++)
			{
				String x=t.getCell(i,colid).toString();
				if(x.equals(text))
				{
					Counter=i+1;
					break;
				}
			}
			if(Counter==0)
			{
				opvar=false;
				mess="Text is Not Present";	
			}
			else
			{
				opvar=true;
				mess="Text is Present at Column:"+Counter;
			}
			//opvar=true;
			//mess="Text is Present at Row Number:"+Counter;
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_getTableColumnNumber(java.lang.String object,java.lang.String RowId,java.lang.String text)
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		int Counter=0;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject) test[0];	
			ITestDataTable t=(ITestDataTable)tgui.getTestData("contents");		
			int rowid=Integer.parseInt(RowId);
			rowid=rowid-1;
			for(int i=0;i<t.getColumnCount();i++)
			{
				String x=t.getCell(rowid,i).toString();
				if(x.equals(text))
				{
					Counter=i+1;
					break;
				}
			}
			if(Counter==0)
			{
				opvar=false;
				mess="Text is Not Present";	
			}
			else
			{
				opvar=true;
				mess="Text is Present at Column:"+Counter;
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_clickLinkInTableCell(java.lang.String object,java.lang.String rowId,java.lang.String colId) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject ) test[0];
			int rowid=Integer.parseInt(rowId);
			int colid=Integer.parseInt(colId);
			tgui.click(atCell(atRow(rowid-1),atColumn(colid-1)));
			opvar=true;
			mess="Link in Table cell is Clicked";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_clickButtonInTableCell(java.lang.String object,java.lang.String rowId,java.lang.String colId,java.lang.String type,java.lang.String index) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);

		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject ) test[0];
			int rowid=Integer.parseInt(rowId);
			int colid=Integer.parseInt(colId);
			tgui.click(atCell(atRow(rowid-1),atColumn(colid-1)));
			opvar=true;
			mess="Button in Table cell is Clicked";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyTableColumnHeader(java.lang.String object,java.lang.String expextedText) 
	{
		boolean opvar = false;  
		java.lang.String mess = null,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject ) test[0];
			ITestDataTable t=(ITestDataTable)tgui.getTestData("contents");	
			for(int i=0;i<t.getColumnCount();i++)
			{
				java.lang.String x= t.getColumnHeader(i).toString();
				if(x.equals(expextedText))
				{
					opvar=true;
					mess="Table Column Header is Verified";
					break;
				}
				else
				{
					opvar=false;
					mess="Table Column Header is not Verified";
				}
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyTableColumnNumber(java.lang.String object,java.lang.String RowId,java.lang.String text,java.lang.String expextedColno)
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		int Counter=0;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject) test[0];	
			ITestDataTable t=(ITestDataTable)tgui.getTestData("contents");		
			int rowid=Integer.parseInt(RowId);
			rowid=rowid-1;
			for(int i=0;i<t.getColumnCount();i++)
			{
				String x=t.getCell(rowid,i).toString();
				if(x.equals(text))
				{
					Counter=i+1;
					break;
				}
			}
			int ExpectedColNumber=Integer.parseInt(expextedColno);
			if(ExpectedColNumber==Counter)
			{
				opvar=true;
				mess="Table Column Number is Verified";
			}
			else
			{
				opvar=false;
				mess="Table Column Number is not Verified";
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyTableColumnText(java.lang.String object,java.lang.String RowId,java.lang.String expextedText)
	{
		boolean opvar = false;  
		java.lang.String mess = null,ret_mess;
		int Counter=0;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject) test[0];	
			ITestDataTable t=(ITestDataTable)tgui.getTestData("contents");		
			int rowid=Integer.parseInt(RowId);
			rowid=rowid-1;
			for(int i=0;i<t.getColumnCount();i++)
			{
				String x=t.getCell(rowid,i).toString();
				if(x.equals(expextedText))
				{
					Counter=i+1;
					opvar=true;
					mess="Table Column Text is Verified";
					break;
				}
				else
				{
					opvar=false;
					mess="Table Column Text is not Verified";
				}
			}
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyTableRowText(java.lang.String object,java.lang.String Colid,java.lang.String text)
	{
		boolean opvar = false;  
		java.lang.String mess = null,ret_mess;
		int Counter=0;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject) test[0];	
			ITestDataTable t=(ITestDataTable)tgui.getTestData("contents");		
			int colid=Integer.parseInt(Colid);
			colid=colid-1;
			for(int i=0;i<t.getRowCount();i++)
			{
				String x=t.getCell(i,colid).toString();
				if(x.equals(text))
				{
					Counter=i+1;
					opvar=true;
					mess="Table row Text is Verified";
					break;
				}
				else
				{
					opvar=false;
					mess="Table Row Text is not verified";
				}
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyTableRowNumber(java.lang.String object,java.lang.String Colid,java.lang.String text,java.lang.String expextedRowno)
	{
		boolean opvar = false;  
		java.lang.String mess = null,ret_mess;
		int Counter=0;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			StatelessGuiSubitemTestObject  tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (StatelessGuiSubitemTestObject) test[0];	
			ITestDataTable t=(ITestDataTable)tgui.getTestData("contents");		
			int colid=Integer.parseInt(Colid);
			colid=colid-1;
			for(int i=0;i<t.getRowCount();i++)
			{
				String x=t.getCell(i,colid).toString();
				if(x.equals(text))
				{
					Counter=i+1;
					break;
				}

			}
			int ExpectedColNumber=Integer.parseInt(expextedRowno);
			if(ExpectedColNumber==Counter)
			{
				opvar=true;
				mess="Table Row Number is Verified";
			}
			else
			{
				opvar=false;
				mess="Table Row Number is not Verified";
			}

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public static String Method_excelCompare(java.lang.String srcPath,java.lang.String desPath,java.lang.String srcSheet,java.lang.String desSheet)
	{
		boolean opvar = true,sFail = true;
		String ret_mess,mess="";
		int column_countSrc,column_countDes,row_countSrc,row_countDes,i,j;
		try{ 
			Workbook workbookSrc = Workbook.getWorkbook(new File(srcPath));
			Sheet sheetSrc = workbookSrc.getSheet(srcSheet);

			Workbook workbookDes = Workbook.getWorkbook(new File(desPath));
			Sheet sheetDes = workbookDes.getSheet(desSheet);

			column_countSrc = sheetSrc.getColumns();
			column_countDes = sheetDes.getColumns();

			row_countSrc = sheetSrc.getRows();
			row_countDes = sheetDes.getRows();

			if((row_countSrc != row_countDes) || (column_countSrc != column_countDes)){
				sFail = true;
			}
			else{
				for(i=0;i<=row_countSrc-1;i++){
					for(j=0;j<=column_countDes-1;j++)
					{
						if(sheetSrc.getCell(i,j).getContents().equalsIgnoreCase(sheetDes.getCell(i,j).getContents())== false)
						{
							sFail = true;
						}							
					}
				}
			}
			if(sFail){
				mess = "File Matched";
				opvar = true;
			}
			else{
				mess = "File not Matched";
				opvar = false;
			}
			System.out.println("mess  " + mess);

			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";				
		}

		catch(Exception e)
		{
			opvar = false;
			mess = e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
			e.printStackTrace();
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_deselectDropDownItemAndWait(java.lang.String object,java.lang.String valueString,java.lang.String wait_tme) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{	String item[];	
		RootTestObject bt = getRootTestObject();
		TestObject[] test;
		SelectGuiSubitemTestObject tgui;
		test = bt.find(atDescendant(objectProp));
		tgui = (SelectGuiSubitemTestObject) test[0];			
		item = (tgui.getProperty(".text").toString()).split(" ");
		tgui.select(item[0]);	
		Thread.sleep(Long.parseLong(wait_tme)*1000);
		opvar=true;
		mess="DropDown items is deselected";
		ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_deselectDropDownItem(java.lang.String object,java.lang.String valueString) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);

		try
		{	String item[];	
		RootTestObject bt = getRootTestObject();
		TestObject[] test;
		SelectGuiSubitemTestObject tgui;
		test = bt.find(atDescendant(objectProp));
		tgui = (SelectGuiSubitemTestObject) test[0];
		item = (tgui.getProperty(".text").toString()).split(" ");
		tgui.select(item[0]);			
		opvar=true;
		mess="DropDown item is deslected";
		ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_verifyAllLinkExist(java.lang.String verifyLink) 
	{
		boolean opvar;
		int found=0;
		java.lang.String mess,ret_mess,exp_link[];		
		exp_link     = verifyLink.split(";");
		try
		{		
			RootTestObject rtoRoot = getRootTestObject();
			TestObject[] toTestObj;
			toTestObj = rtoRoot.find(atDescendant(".class", "Html.A"));			
			String linkStr="";		

			int linkCount=toTestObj.length;

			if(linkCount == 0){
				mess = "No Links Found";			
			}else{

				for(int i=0;i<exp_link.length;i++){
					for(int j=0;j<linkCount;j++){
						if(exp_link[i] != ((GuiTestObject)toTestObj[j]).getProperty(".text").toString()){
							found++;
							break;
						}
					}
				}
			}	
			if(found == exp_link.length){
				mess = "All links existence Verified";
				opvar = true;
			}
			else{
				mess = "All links existence not Verified";
				opvar = false;
			}


			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_SetFocusonDropDown(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (SelectGuiSubitemTestObject) test[0];
			tgui.click();
			opvar=true;
			mess="DropDown is Focussed";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_SetfocusEditField(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];
			tgui.click();
			opvar=true;
			mess="EditField is Focused";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_focusCheckBox(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (ToggleGUITestObject) test[0];									
			tgui.click();
			tgui.click();
			opvar=true;			
			mess = "checkBox is Focused";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_deFocusButton() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;			
		try
		{		
			RootTestObject bt = getRootTestObject();
			BrowserTestObject rtoRoot;
			TestObject[] toTestObj;
			toTestObj = bt.find(atDescendant(".class", "Html.HtmlBrowser"));
			rtoRoot = new BrowserTestObject(toTestObj[0]);
			rtoRoot.inputKeys("{TAB}");
			opvar=true;
			mess="Button is defocussed";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_deFocusTextArea() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;			
		try
		{		
			RootTestObject bt = getRootTestObject();
			BrowserTestObject rtoRoot;
			TestObject[] toTestObj;
			toTestObj = bt.find(atDescendant(".class", "Html.HtmlBrowser"));
			rtoRoot = new BrowserTestObject(toTestObj[0]);
			rtoRoot.inputKeys("{TAB}");
			opvar=true;
			mess="textarea is defocussed";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_deFocusfromDropDown() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;			
		try
		{		
			RootTestObject bt = getRootTestObject();
			BrowserTestObject rtoRoot;
			TestObject[] toTestObj;
			toTestObj = bt.find(atDescendant(".class", "Html.HtmlBrowser"));
			rtoRoot = new BrowserTestObject(toTestObj[0]);
			rtoRoot.inputKeys("{TAB}");
			opvar=true;
			mess="DropDown is defocussed";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_deFocusRadioButton() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;			
		try
		{		
			RootTestObject bt = getRootTestObject();
			BrowserTestObject rtoRoot;
			TestObject[] toTestObj;
			toTestObj = bt.find(atDescendant(".class", "Html.HtmlBrowser"));
			rtoRoot = new BrowserTestObject(toTestObj[0]);
			rtoRoot.inputKeys("{TAB}");
			opvar=true;
			mess="radioButton is defocussed";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_deFocusEditField() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;			
		try
		{		
			RootTestObject bt = getRootTestObject();
			BrowserTestObject rtoRoot;
			TestObject[] toTestObj;
			toTestObj = bt.find(atDescendant(".class", "Html.HtmlBrowser"));
			rtoRoot = new BrowserTestObject(toTestObj[0]);
			rtoRoot.inputKeys("{TAB}");
			opvar=true;
			mess="EditField is defocussed";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_deFocusCheckBox() 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;			
		try
		{		
			RootTestObject bt = getRootTestObject();
			BrowserTestObject rtoRoot;
			TestObject[] toTestObj;
			toTestObj = bt.find(atDescendant(".class", "Html.HtmlBrowser"));
			rtoRoot = new BrowserTestObject(toTestObj[0]);
			rtoRoot.inputKeys("{TAB}");
			opvar=true;
			mess="CheckBox is defocussed";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_setfocusTextArea(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			TextGuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (TextGuiTestObject) test[0];
			tgui.click();
			opvar=true;
			mess="TextArea is Focused";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_deselectAllDropDownItemsAndWait(java.lang.String object,java.lang.String selectvalue) 
	{
		boolean opvar;  
		String item[];
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));						
			tgui = (SelectGuiSubitemTestObject) test[0];

			ITestDataList dataList = (ITestDataList)tgui.getTestData("list");  
			ITestDataElementList elementList = (ITestDataElementList)dataList.getElements();
			int x = elementList.getLength();

			for(int i=0;i<=x-1;i++)
			{
				String Str2=elementList.getElement(i).getElement().toString();
				tgui.click(CTRL_LEFT, atText(Str2)); 
			}

			Thread.sleep(Long.parseLong(selectvalue) * 1000L);
			opvar=true;
			mess="DropDown items are de-selected";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_deselectMultipleDropDownItem(java.lang.String object,java.lang.String selectvalue) 
	{
		boolean opvar;  
		String item[];
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);
		item = selectvalue.split(";");		
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			SelectGuiSubitemTestObject tgui;
			test = bt.find(atDescendant(objectProp));						
			tgui = (SelectGuiSubitemTestObject) test[0];

			int i=0;
			while(Boolean.getBoolean(tgui.getSelectedText())){
				item[i]=tgui.getSelectedText();
				i++;
			}

			for(int j=0;j<item.length;j++){
				tgui.click(CTRL_LEFT, atText(item[i]));
			}	

			opvar=true;
			mess="Multiple DropDown items are deselected";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_dragAndDropAndWait(java.lang.String object, java.lang.String MovementString, java.lang.String tme) 
	{
		boolean opvar; 		
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);				
		String coordinate[];	
		int x,y;

		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));						
			tgui = (GuiTestObject) test[0];
			coordinate = MovementString.split(";");
			x = Integer.parseInt(coordinate[0]);
			y = Integer.parseInt(coordinate[1]);
			tgui.dragToScreenPoint(new Point(x,y));
			Thread.sleep(Long.parseLong(tme)*1000);

			opvar=true;
			mess="Item is Draged and droped at point:"+"("+x+","+y+")";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_dragAndDrop(java.lang.String object, java.lang.String MovementString) 
	{
		boolean opvar; 		
		java.lang.String mess,ret_mess;
		Property[] objectProp = XmlString(object);				
		String coordinate[];	
		int x,y;

		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));
			tgui = (GuiTestObject) test[0];
			coordinate = MovementString.split(";");
			x = Integer.parseInt(coordinate[0]);
			y = Integer.parseInt(coordinate[1]);
			tgui.dragToScreenPoint(new Point(x,y));			
			opvar=true;
			mess="Item is Draged and droped at point:"+"("+x+","+y+")";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_GetElementIndex(java.lang.String object) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;		
		Property[] objectProp = XmlString(object);
		try
		{		
			RootTestObject bt = getRootTestObject();
			TestObject[] test;		
			test = bt.find(atDescendant(objectProp));
			String x=  test[0].getProperty(".classIndex").toString();
			/*NOTE: if <.classIndex> property could not be fetched then a
			 * exception is generated showing  message  
			 * i.e <Property .classIndex was not found.>*/
			opvar=true;
			mess="Index of the given Object is " + x;
			ret_mess="<KeywordOutput><Result><![CDATA["+x+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public java.lang.String Method_runScriptAndWait(java.lang.String AppName,java.lang.String wait_time) 
	{
		boolean opvar;  
		java.lang.String mess,ret_mess;
		try
		{		
			startApp(AppName);
			double timeout1;
			timeout1 = Double.parseDouble(wait_time);
			sleep(timeout1);
			opvar=true;			
			mess = "Application has been started";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch (Exception e)
		{
			setmessage(e.getMessage());
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;

	}

	//===============================================================================================

	public String Method_focusRadioButton(java.lang.String object) throws InterruptedException {
		Property[] objectProp = XmlString(object);
		java.lang.String ret_mess = null,mess = null;
		boolean opvar = false;
		try
		{

			Color m_oBorderColor = new Color(255, 129, 53);
			int m_iBorderWidth = Highlight.getBorderWidth();
			int m_iFlashSpeed = Highlight.getFlashSpeed();
			int m_iDisplayTime = Highlight.getDisplayTime();

			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			ToggleGUITestObject tgui;
			test = bt.find(atDescendant(objectProp));						
			tgui = (ToggleGUITestObject) test[0];

			long a_lStartTime = System.currentTimeMillis();

			for (int i = 0; i < test.length; i++) {
				//check object type
				if (test[i] != null && test[i] instanceof GuiTestObject) {
					TopLevelTestObject a_oTopLevelTestObject = (TopLevelTestObject)test[i].getTopMappableParent();

					a_oTopLevelTestObject.activate();

					GuiTestObject a_oObject = (GuiTestObject)test[i];

					Rectangle a_oRectangleOfObject = a_oObject.getClippedScreenRectangle();

					if (i + 1 >= test.length) {
						a_lStartTime = System.currentTimeMillis();
					}

					if (a_oRectangleOfObject != null) {
						Highlighter.create(a_oRectangleOfObject, m_oBorderColor, m_iBorderWidth, m_iFlashSpeed, m_iDisplayTime);
					}
				}
				else {
					System.out.println("Could not highlight the Object. The object was null or not a GuiTestObject.");
				}
			}

			//Sleep the thread to allow the object to be highlighted for a minimum time
			long a_lEndTime = System.currentTimeMillis();
			long a_lElapseTime = a_lEndTime - a_lStartTime;
			long a_lRemainingTime = m_iDisplayTime - a_lElapseTime;
			if (a_lRemainingTime > 0) {
				Thread.sleep(a_lRemainingTime);
				opvar=true;
				mess="Radio Button is focused";
				ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
			}
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch(Exception e)
		{
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public String Method_focusButton(java.lang.String object) throws InterruptedException {
		Property[] objectProp = XmlString(object);
		java.lang.String ret_mess = null,mess = null;
		boolean opvar = false;
		try
		{
			Color m_oBorderColor = new Color(255, 129, 53);
			int m_iBorderWidth = Highlight.getBorderWidth();
			int m_iFlashSpeed = Highlight.getFlashSpeed();
			int m_iDisplayTime = Highlight.getDisplayTime();

			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			GuiTestObject tgui;
			test = bt.find(atDescendant(objectProp));						
			tgui = (GuiTestObject) test[0];

			long a_lStartTime = System.currentTimeMillis();

			for (int i = 0; i < test.length; i++) {
				//check object type
				if (test[i] != null && test[i] instanceof GuiTestObject) {
					TopLevelTestObject a_oTopLevelTestObject = (TopLevelTestObject)test[i].getTopMappableParent();

					a_oTopLevelTestObject.activate();

					GuiTestObject a_oObject = (GuiTestObject)test[i];

					Rectangle a_oRectangleOfObject = a_oObject.getClippedScreenRectangle();

					if (i + 1 >= test.length) {
						a_lStartTime = System.currentTimeMillis();
					}

					if (a_oRectangleOfObject != null) {
						Highlighter.create(a_oRectangleOfObject, m_oBorderColor, m_iBorderWidth, m_iFlashSpeed, m_iDisplayTime);
					}
				}
				else {
					System.out.println("Could not highlight the Object. The object was null or not a GuiTestObject.");
				}
			}

			//Sleep the thread to allow the object to be highlighted for a minimum time
			long a_lEndTime = System.currentTimeMillis();
			long a_lElapseTime = a_lEndTime - a_lStartTime;
			long a_lRemainingTime = m_iDisplayTime - a_lElapseTime;
			if (a_lRemainingTime > 0) {
				Thread.sleep(a_lRemainingTime);
				opvar=true;
				mess="Button is focused";
				ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
			}
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch(Exception e)
		{
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}
	//=============================================================================================



	//=============================================================================================
	public String Method_SetFocus(java.lang.String object)
	{
		boolean opvar;
		String mess = "";
		String ret_mess = null;
		Property[] objectProp = XmlString(object);
		try
		{
			Color m_oBorderColor = new Color(255, 129, 53);
			int m_iBorderWidth = Highlight.getBorderWidth();
			int m_iFlashSpeed = Highlight.getFlashSpeed();
			int m_iDisplayTime = Highlight.getDisplayTime();
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			test = bt.find(atDescendant(objectProp));						

			long a_lStartTime = System.currentTimeMillis();

			for (int i = 0; i < test.length; i++) {
				//check object type
				if (test[i] != null && test[i] instanceof GuiTestObject) {
					TopLevelTestObject a_oTopLevelTestObject = (TopLevelTestObject)test[i].getTopMappableParent();

					a_oTopLevelTestObject.activate();

					GuiTestObject a_oObject = (GuiTestObject)test[i];

					Rectangle a_oRectangleOfObject = a_oObject.getClippedScreenRectangle();

					if (i + 1 >= test.length) {
						a_lStartTime = System.currentTimeMillis();
					}

					if (a_oRectangleOfObject != null) {
						Highlighter.create(a_oRectangleOfObject, m_oBorderColor, m_iBorderWidth, m_iFlashSpeed, m_iDisplayTime);
					}
				}
				else {
					System.out.println("Could not highlight the Object. The object was null or not a GuiTestObject.");
				}
			}

			//Sleep the thread to allow the object to be highlighted for a minimum time
			long a_lEndTime = System.currentTimeMillis();
			long a_lElapseTime = a_lEndTime - a_lStartTime;
			long a_lRemainingTime = m_iDisplayTime - a_lElapseTime;
			if (a_lRemainingTime > 0) {
				//sleep for 1 second to allow highligh to show
				Thread.sleep(a_lRemainingTime);
				opvar=true;
				mess="Object is Heighlighted";
				ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";

			}
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch(Exception e)
		{
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//=============================================================================================

	public String Method_highlightObject(java.lang.String object)
	{
		boolean opvar;
		String mess = "";
		String ret_mess = null;
		Property[] objectProp = XmlString(object);
		try
		{
			Color m_oBorderColor = new Color(255, 129, 53);
			int m_iBorderWidth = Highlight.getBorderWidth();
			int m_iFlashSpeed = Highlight.getFlashSpeed();
			int m_iDisplayTime = Highlight.getDisplayTime();
			RootTestObject bt = getRootTestObject();
			TestObject[] test;
			test = bt.find(atDescendant(objectProp));						

			long a_lStartTime = System.currentTimeMillis();

			for (int i = 0; i < test.length; i++) {
				//check object type
				if (test[i] != null && test[i] instanceof GuiTestObject) {
					TopLevelTestObject a_oTopLevelTestObject = (TopLevelTestObject)test[i].getTopMappableParent();

					a_oTopLevelTestObject.activate();

					GuiTestObject a_oObject = (GuiTestObject)test[i];

					Rectangle a_oRectangleOfObject = a_oObject.getClippedScreenRectangle();

					if (i + 1 >= test.length) {
						a_lStartTime = System.currentTimeMillis();
					}

					if (a_oRectangleOfObject != null) {
						Highlighter.create(a_oRectangleOfObject, m_oBorderColor, m_iBorderWidth, m_iFlashSpeed, m_iDisplayTime);
					}
				}
				else {
					System.out.println("Could not highlight the Object. The object was null or not a GuiTestObject.");
				}
			}

			//Sleep the thread to allow the object to be highlighted for a minimum time
			long a_lEndTime = System.currentTimeMillis();
			long a_lElapseTime = a_lEndTime - a_lStartTime;
			long a_lRemainingTime = m_iDisplayTime - a_lElapseTime;
			if (a_lRemainingTime > 0) {
				//sleep for 1 second to allow highligh to show
				Thread.sleep(a_lRemainingTime);
				opvar=true;
				mess="Object is Highlighted";
				ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";

			}
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			opvar=false;
			mess="Object is Not Found";
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		catch(Exception e)
		{
			opvar=false;
			mess=e.getMessage();
			ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
		}
		return ret_mess;
	}

	//==============================================================================================

	public void setmessage(java.lang.String message1 )
	{
		message = message1;
	}

	//==================================================================================================	
	public Property[] XmlString(java.lang.String xmlRecords)
	{
		java.lang.String property1 = null;
		java.lang.String value1 = null, regexp1 = null, type = null, mainstr = null, type1[];
		java.lang.String[] propertyArrary = new java.lang.String[15];
		Object[] ValueArrary = new Object[15];
		Property[] p = new Property[15];
		int k=0;

		try {
			DocumentBuilder db = DocumentBuilderFactory.newInstance().newDocumentBuilder();
			InputSource is = new InputSource();
			is.setCharacterStream(new StringReader(xmlRecords));

			Document doc = db.parse(is);
			NodeList nodes = doc.getElementsByTagName("Opkey:ChildObject");
			Node cnode = nodes.item(0);
			//System.out.println(cnode.getChildNodes().getLength());

			Element line2=(Element)cnode.getChildNodes().item(1);
			type = line2.getAttribute("tag");
			Element element12 = (Element)nodes.item(0);
			NodeList name1 = element12.getElementsByTagName("Opkey:Property");

			for(int i=0;i<name1.getLength();i++)
			{
				Element line1 = (Element) name1.item(i);
				property1 = line1.getAttribute("name");
				regexp1 = line1.getAttribute("regularExpression");
				value1 = getCharacterDataFromElement(line1);

				/*if(regexp1.compareTo("1")==0)
				        	value1="*"+value1+"*";*/
				if(i==0)
				{
					if(property1.compareToIgnoreCase("index")==0) 
					{ propertyArrary[i] = ".index"; ValueArrary[i]= value1; }	                          	
					else if(property1.compareToIgnoreCase("text")==0 || (property1.compareToIgnoreCase("innertext")==0))
					{ propertyArrary[i] = ".text"; ValueArrary[i]= value1; }	 	 
					else if((property1.compareToIgnoreCase("name")==0))
					{ propertyArrary[i] = ".name"; ValueArrary[i]= value1; }
					else if((property1.compareToIgnoreCase("value")==0))
					{ propertyArrary[i] = ".value"; ValueArrary[i]= value1; }
					else if((property1.compareToIgnoreCase("id")==0))
					{ propertyArrary[i] = ".id"; ValueArrary[i]= value1; }	 
					else if((property1.compareToIgnoreCase("type")==0))
					{ propertyArrary[i] = ".type";  ValueArrary[i]= value1; }	
					else if((property1.compareToIgnoreCase("class")==0))
					{ propertyArrary[i] = ".class";  ValueArrary[i]= value1; }
					else if((property1.compareToIgnoreCase("classindex")==0))
					{ propertyArrary[i] = ".classIndex";  ValueArrary[i]= value1; }
					else if((property1.compareToIgnoreCase("caption")==0))
					{ propertyArrary[i] = ".caption";  ValueArrary[i]= value1; }
					else if((property1.compareToIgnoreCase("alt")==0))
					{ propertyArrary[i] = ".alt";  ValueArrary[i]= value1; }
					else if((property1.compareToIgnoreCase("src")==0))
					{ propertyArrary[i] = ".src";  ValueArrary[i]= value1; }
					else if((property1.compareToIgnoreCase("href")==0))
					{ propertyArrary[i] = ".href";  ValueArrary[i]= value1; }
					else if((property1.compareToIgnoreCase("title")==0))
					{ propertyArrary[i] = ".title";  ValueArrary[i]= value1; }
					//else
					//  { propertyArrary[i] = property1;  ValueArrary[i]= value1; }        
				}
				if(i>0)
				{
					if(property1.compareToIgnoreCase("index")==0) 
					{ propertyArrary[i] = ".index"; ValueArrary[i]= value1; }	                          	
					else if(property1.compareToIgnoreCase("text")==0 || (property1.compareToIgnoreCase("innertext")==0))
					{ propertyArrary[i] = ".text"; ValueArrary[i]= value1; }  
					else if((property1.compareToIgnoreCase("name")==0))
					{ propertyArrary[i] = ".name"; ValueArrary[i]= value1; }
					else if((property1.compareToIgnoreCase("value")==0))
					{ propertyArrary[i] = ".value"; ValueArrary[i]= value1; }
					else if((property1.compareToIgnoreCase("id")==0))
					{ propertyArrary[i] = ".id"; ValueArrary[i]= value1; }	 
					else if((property1.compareToIgnoreCase("type")==0))
					{ propertyArrary[i] = ".type";  ValueArrary[i]= value1; } 
					else if((property1.compareToIgnoreCase("class")==0))
					{ propertyArrary[i] = ".class";  ValueArrary[i]= value1; }
					else if((property1.compareToIgnoreCase("classindex")==0))
					{ propertyArrary[i] = ".classIndex";  ValueArrary[i]= value1; }
					else if((property1.compareToIgnoreCase("caption")==0))
					{ propertyArrary[i] = ".caption";  ValueArrary[i]= value1; }
					else if((property1.compareToIgnoreCase("alt")==0))
					{ propertyArrary[i] = ".alt";  ValueArrary[i]= value1; }
					else if((property1.compareToIgnoreCase("src")==0))
					{ propertyArrary[i] = ".src";  ValueArrary[i]= value1; }
					else if((property1.compareToIgnoreCase("href")==0))
					{ propertyArrary[i] = ".href";  ValueArrary[i]= value1; }
					else if((property1.compareToIgnoreCase("title")==0))
					{ propertyArrary[i] = ".title";  ValueArrary[i]= value1; }
					//else
					//  { propertyArrary[i] = property1;  ValueArrary[i]= value1; }  	
				}
				if (regexp1.compareTo("1") == 0)
				{
					String value_temp = ".*" + value1 + ".*";
					RegularExpression value12 = new RegularExpression(value_temp,false);
					ValueArrary[i] = value12;
					//GuiTestObject guiPlusSignImg;
				}
				k++;
			}
			p = new Property[k];
			/*FileWriter fstream = new FileWriter("c:\\out.txt");
		    		  BufferedWriter out = new BufferedWriter(fstream);*/

			for(int j=0; j<k; j++)
			{


				// out.write("first line  "+ j +"  "+ propertyArrary[j] +"  "+ValueArrary[j]+"\n");
				//Close the output stream

				Property temp=new Property(propertyArrary[j],ValueArrary[j]);
				p[j] = temp;
			}
			//out.close();
		}
		catch (Exception e) 
		{
			e.printStackTrace();
			mainstr = e.getMessage();
		}
		return p;
	}

	/*public String Method_addxmlparameter(String xmlString,String type,String value,String regexp)
		{
			boolean opvar;
			String mess,ret_mess;
			try
			{

				String x[]=xmlString.split("<Opkey:ChildObject>");
				String y[]=x[1].split("<Opkey:Properties>");
				y[1]="<Opkey:Property name="+'"'+type+'"'+" regularExpression="+'"'+regexp+'"'+">"+value+"</Opkey:Property>"+y[1];
				xmlString=x[0]+"<Opkey:ChildObject>"+y[0]+"<Opkey:Properties>"+y[1];
				opvar=true;
			    mess="New parameter is added";
			     ret_mess="<KeywordOutput><Result><![CDATA["+xmlString+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";

			}
			catch(Exception e)
			{
				opvar=false;
			    mess=e.getMessage();
			     ret_mess="<KeywordOutput><Result><![CDATA["+opvar+"]]></Result><Status><![CDATA["+opvar+"]]></Status><Message><![CDATA["+mess+"]]></Message></KeywordOutput>";
			}
			return ret_mess;
		}*/

	//input[@name='datePickerDepart_dom1'][@class='ic_cal validate[check_datepicker_dom[1,4]] hasDatepick'][@id='datePickerDepart_dom1']	

	public static java.lang.String getCharacterDataFromElement(Element e) throws Exception
	{
		Node child = e.getFirstChild();
		if (child instanceof CharacterData) {
			CharacterData cd = (CharacterData) child;
			return cd.getData();
		}
		return "";
	}

}

