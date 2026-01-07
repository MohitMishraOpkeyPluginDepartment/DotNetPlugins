package Selenium;
import java.util.ArrayList;

import java.util.List;


public class SeleniumServerLauncher {

	String jarPath;
	int port;
	String cmdLineArgs;
	
	public SeleniumServerLauncher(String jarPath, int port, String cmdLineArgs) {
		this.jarPath = jarPath;
		this.port = port;
		this.cmdLineArgs = cmdLineArgs;
	}

	public void launch() throws java.io.IOException, java.net.BindException {
			
			String arg = "java -jar \"" + jarPath + "\" -port " + port + " " + cmdLineArgs ;
			List<String> args= new ArrayList<String>();;
			
			//creating a list of all arguments
			args.add("cmd.exe");
			args.add("/C");
			args.add(arg);
			
			//adding the optional command line arguments to selenium server EX: -debug
			for(String itm : cmdLineArgs.split(" ")) {
				args.add(itm);
			}			
			
			//start the server process. Merge the STDOUT and STDERR into one stream.
			ProcessBuilder pb = new ProcessBuilder(args);
			pb.redirectErrorStream(true);
			Process p = pb.start();

			//consume the output of the server process.
			java.io.InputStream in = p.getInputStream();
			java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader(in));
			
			//consume output and wait until the server is started and ready to accept connections
			String str = null;
			while((str = br.readLine()) != null) {
				System.out.println(str);
				
				if(str.contains("Started org.openqa.jetty.jetty.Server"))
					break;
				
				if(str.contains("Selenium is already running on port"))
					throw new java.net.BindException(str);
				
				if(str.contains("Unable to access jarfile"))
					throw new java.lang.IllegalArgumentException(str);
			}
			
			//we no longer need these streams
			br.close();
			in.close();

	}

}

