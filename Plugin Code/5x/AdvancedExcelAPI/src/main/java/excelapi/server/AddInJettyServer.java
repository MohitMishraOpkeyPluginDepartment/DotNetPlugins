package excelapi.server;
import org.eclipse.jetty.server.HttpConnectionFactory;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.servlet.ServletHandler;

import excelapi.controller.GetExcelRoot;
import excelapi.controller.GetSingleValueFromExcel;
import excelapi.controller.StartServerService;
//import org.eclipse.jetty.util.thread.QueuedThreadPool;
public class AddInJettyServer {
	static Server  server =  new Server();
	
	
	public boolean serverStatus = false;
	public void startServer() {
	
		  serverStatus = true;
		  System.out.println("Starting The Thread");

//			 	   QueuedThreadPool threadPool = new QueuedThreadPool();
//				   threadPool.setMaxThreads(500);

				   server = new Server();

				   ServerConnector http = new ServerConnector(server, new HttpConnectionFactory());
				   http.setPort(8093);
				   server.addConnector(http);
				   ServletHandler servletHandler = new ServletHandler();
				   server.setHandler(servletHandler);
				
				
					servletHandler.addServletWithMapping(GetExcelRoot.class,"/root");
					servletHandler.addServletWithMapping(StartServerService.class , "/connect");
					servletHandler.addServletWithMapping(GetSingleValueFromExcel.class, "/postvalue");
					
		
					try {
						server.start();
						
					} catch (Exception e) {
						// TODO Auto-generated catch block
						//return;
					//	System.out.println("ERROR IN JETTY SERVER");
						e.printStackTrace();
						
						
					}
					
			 }
			
		
    
	
	public boolean isServeStarted() {
		System.out.println("isStarted : : "+this.serverStatus);
		return this.serverStatus;
	}
	public void serverStop() throws Exception {
		AddInJettyServer.server.stop();
	}
	public static void main(String [] args) {
		AddInJettyServer obj = new AddInJettyServer();
		obj.startServer();
	
	}
}