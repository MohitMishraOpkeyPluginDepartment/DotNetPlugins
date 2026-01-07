
public class Test_Custom_Keyword {
	 public String Method_Hello(String value)
		{
		 boolean opvar;
		 String mess,ret_mess;
		try
		{
		opvar=true;
		mess=value;
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
}
